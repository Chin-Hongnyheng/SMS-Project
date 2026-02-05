<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ATTENDANCE_API_BASE_URL } from '@/config/api'

type StudentRow = { id: string; name: string; presentDays: number[] }

type ClassOption = {
  id: number
  name: string
  year: number
  module: string
  courseId: number | null
  courseName: string
}

const route = useRoute()
const apiBaseUrl = ATTENDANCE_API_BASE_URL

const classId = computed(() => {
  const value = route.query.classId
  const parsed = Array.isArray(value) ? Number(value[0]) : Number(value)
  return Number.isFinite(parsed) ? parsed : null
})

const expiresAt = computed(() => {
  const value = route.query.exp
  const parsed = Array.isArray(value) ? Number(value[0]) : Number(value)
  return Number.isFinite(parsed) ? parsed : null
})


const classLabel = ref('')
const students = ref<StudentRow[]>([])
const searchQuery = ref('')
const selectedStudentId = ref<string | null>(null)
const statusMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isLoading = ref(true)
const remainingMs = ref(0)

let timerId: number | null = null

const today = new Date()
const todayDay = today.getDate()
const todayLabel = today.toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const formatModuleLabel = (value: string) => value.replace(/^module\s*/i, 'Class ')

const updateRemaining = () => {
  if (!expiresAt.value) {
    remainingMs.value = 0
    return
  }
  const diff = expiresAt.value - Date.now()
  remainingMs.value = diff > 0 ? diff : 0
  if (remainingMs.value === 0) {
    stopTimer()
  }
}

const startTimer = () => {
  stopTimer()
  updateRemaining()
  if (expiresAt.value) {
    timerId = window.setInterval(updateRemaining, 1000)
  }
}

const stopTimer = () => {
  if (timerId) {
    window.clearInterval(timerId)
    timerId = null
  }
}

const formattedRemaining = computed(() => {
  if (!expiresAt.value) return '00:00'
  const totalSeconds = Math.ceil(remainingMs.value / 1000)
  const minutes = Math.max(Math.floor(totalSeconds / 60), 0)
  const seconds = Math.max(totalSeconds % 60, 0)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const isExpired = computed(() => !expiresAt.value || remainingMs.value <= 0)

const filteredStudents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return students.value
  return students.value.filter((student) => student.name.toLowerCase().includes(query))
})

const selectedStudent = computed(() =>
  students.value.find((student) => student.id === selectedStudentId.value),
)

const isAlreadyPresent = computed(() => {
  if (!selectedStudent.value) return false
  return selectedStudent.value.presentDays.includes(todayDay)
})

const canSubmit = computed(() => {
  return Boolean(selectedStudentId.value) && !isSubmitting.value && !isExpired.value && !isAlreadyPresent.value
})

const fetchClassLabel = async () => {
  if (!classId.value) return
  const response = await fetch(`${apiBaseUrl}/classes`)
  if (!response.ok) {
    throw new Error('Failed to load classes')
  }
  const data = await response.json()
  const classes = Array.isArray(data) ? (data as ClassOption[]) : []
  const match = classes.find((item) => item.id === classId.value)
  if (match) {
    classLabel.value = `${match.courseName} - Year ${match.year} - ${formatModuleLabel(match.module)}`
  } else {
    classLabel.value = `Class ${classId.value}`
  }
}

const fetchStudents = async () => {
  if (!classId.value) return
  const now = new Date()
  const monthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const response = await fetch(`${apiBaseUrl}/attendance?month=${monthValue}&classId=${classId.value}`)
  if (!response.ok) {
    throw new Error('Failed to load attendance')
  }
  const data = await response.json()
  students.value = Array.isArray(data?.students) ? data.students : []
}

const handleSelectStudent = (student: StudentRow) => {
  if (isExpired.value) return
  selectedStudentId.value = student.id
  statusMessage.value = ''
}

const handleCheckIn = async () => {
  if (!classId.value || !selectedStudentId.value || isExpired.value) return
  isSubmitting.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  const monthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const date = `${monthValue}-${String(todayDay).padStart(2, '0')}`

  try {
    const response = await fetch(`${apiBaseUrl}/attendance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: classId.value,
        studentCode: selectedStudentId.value,
        attendanceDate: date,
        present: true,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update attendance')
    }

    const target = students.value.find((student) => student.id === selectedStudentId.value)
    if (target && !target.presentDays.includes(todayDay)) {
      target.presentDays.push(todayDay)
    }
    statusMessage.value = `Checked in at ${new Date().toLocaleTimeString()}`
  } catch (error) {
    errorMessage.value = 'Unable to check you in. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!classId.value) {
    errorMessage.value = 'Invalid session link. Please rescan the QR code.'
    isLoading.value = false
    return
  }
  if (!expiresAt.value) {
    errorMessage.value = 'This session link is missing an expiration time.'
  }
  startTimer()
  Promise.all([fetchClassLabel(), fetchStudents()])
    .catch(() => {
      if (!errorMessage.value) {
        errorMessage.value = 'Unable to load attendance data.'
      }
    })
    .finally(() => {
      isLoading.value = false
    })
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<template>
  <section class="checkin-page">
    <div class="checkin-card">
      <header class="checkin-header">
        <div>
          <p class="eyebrow">Attendance Check-In</p>
          <h1>{{ classLabel || 'Student attendance' }}</h1>
          <p class="meta">{{ todayLabel }}</p>
        </div>
        <div class="timer" :class="{ expired: isExpired }">
          <span>{{ isExpired ? 'Session expired' : 'Session ends in' }}</span>
          <strong>{{ formattedRemaining }}</strong>
        </div>
      </header>

      <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>

      <div v-else>
        <div class="search">
          <label>
            <span>Search your name</span>
            <input v-model="searchQuery" type="search" placeholder="Type to filter" />
          </label>
        </div>

        <div v-if="isLoading" class="loading">Loading students...</div>

        <div v-else class="student-list">
          <button
            v-for="student in filteredStudents"
            :key="student.id"
            class="student-card"
            type="button"
            :class="{ selected: student.id === selectedStudentId, present: student.presentDays.includes(todayDay) }"
            @click="handleSelectStudent(student)"
          >
            <div>
              <h3>{{ student.name }}</h3>
              <p>ID {{ student.id }}</p>
            </div>
            <span v-if="student.presentDays.includes(todayDay)" class="badge">Checked in</span>
          </button>
          <p v-if="filteredStudents.length === 0" class="empty">No students found.</p>
        </div>

        <div class="actions">
          <p v-if="statusMessage" class="alert success">{{ statusMessage }}</p>
          <button class="primary" type="button" :disabled="!canSubmit" @click="handleCheckIn">
            {{ isSubmitting ? 'Saving...' : 'Mark Present' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkin-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%);
  display: grid;
  place-items: center;
  padding: 24px 16px 40px;
  font-family: 'Nunito', sans-serif;
  color: #1f2933;
}

.checkin-card {
  width: min(640px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
  border: 1px solid #e6ebf2;
  display: grid;
  gap: 20px;
}

.checkin-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: #5b616b;
}

.checkin-header h1 {
  margin: 0 0 6px;
  font-size: 1.4rem;
}

.meta {
  margin: 0;
  color: #5b616b;
}

.timer {
  background: #eef4f9;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  display: grid;
  gap: 4px;
  min-width: 150px;
}

.timer.expired {
  background: #fff4f4;
  color: #b0403a;
}

.alert {
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.alert.error {
  background: #fff4f4;
  color: #b0403a;
}

.alert.success {
  background: #e7f6ee;
  color: #166534;
}

.search label {
  display: grid;
  gap: 6px;
  font-weight: 600;
  color: #364152;
}

.search input {
  border: 1px solid #d9dfe7;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
}

.loading {
  color: #52606d;
  font-weight: 600;
}

.student-list {
  display: grid;
  gap: 10px;
  margin-top: 6px;
}

.student-card {
  border: 1px solid #e2e8f0;
  background: #f9fafc;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.student-card h3 {
  margin: 0 0 4px;
  font-size: 1rem;
}

.student-card p {
  margin: 0;
  color: #5b616b;
  font-size: 0.85rem;
}

.student-card.selected {
  border-color: #5ba4d5;
  background: #e7f1fa;
  box-shadow: 0 10px 20px rgba(91, 164, 213, 0.2);
  transform: translateY(-1px);
}

.student-card.present {
  opacity: 0.8;
}

.badge {
  background: #e7f6ee;
  color: #166534;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
}

.empty {
  margin: 0;
  color: #5b616b;
}

.actions {
  display: grid;
  gap: 12px;
}

.primary {
  border: none;
  background: #5ba4d5;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 540px) {
  .checkin-card {
    padding: 20px;
  }

  .timer {
    width: 100%;
  }
}
</style>
