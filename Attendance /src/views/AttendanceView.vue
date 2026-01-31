<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AttendanceTable from '../components/AttendanceTable.vue'

type StudentRow = { id: string; name: string; presentDays: number[] }
type ClassOption = { id: number; name: string }

const days = ref<number[]>([])
const students = ref<StudentRow[]>([])
const classes = ref<ClassOption[]>([])
const selectedClassId = ref<number | null>(null)
const currentMonth = ref('')
const selectedMonth = ref('')
const apiBaseUrl = 'http://localhost:8000'
const isModalOpen = ref(false)
const searchQuery = ref('')
const formName = ref('')
const formCode = ref('')
const formError = ref('')
const isSubmitting = ref(false)
const isClassModalOpen = ref(false)
const className = ref('')
const classError = ref('')
const isClassSubmitting = ref(false)
const studentClassId = ref<number | null>(null)

const canSubmit = computed(() => formName.value.trim() !== '' && formCode.value.trim() !== '')
const canCreateClass = computed(() => className.value.trim() !== '')
const filteredStudents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return students.value
  return students.value.filter((student) => student.name.toLowerCase().includes(query))
})

const fetchAttendance = async () => {
  const now = new Date()
  const monthValue =
    selectedMonth.value || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  selectedMonth.value = monthValue
  currentMonth.value = monthValue
  const classQuery = selectedClassId.value ? `&classId=${selectedClassId.value}` : ''
  const response = await fetch(`${apiBaseUrl}/attendance?month=${monthValue}${classQuery}`)
  if (!response.ok) {
    throw new Error('Failed to load attendance')
  }
  const data = await response.json()
  days.value = data.days ?? []
  students.value = data.students ?? []
}

const openModal = () => {
  formName.value = ''
  formCode.value = ''
  formError.value = ''
  studentClassId.value = selectedClassId.value
  isModalOpen.value = true
}

const closeModal = () => {
  if (isSubmitting.value) return
  isModalOpen.value = false
}

const openClassModal = () => {
  className.value = ''
  classError.value = ''
  isClassModalOpen.value = true
}

const closeClassModal = () => {
  if (isClassSubmitting.value) return
  isClassModalOpen.value = false
}

const submitStudent = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true
  formError.value = ''

  try {
    const response = await fetch(`${apiBaseUrl}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formName.value.trim(),
        studentCode: formCode.value.trim(),
        classId: studentClassId.value ?? undefined,
      }),
    })

    if (!response.ok) {
      formError.value = 'Failed to add student'
      return
    }

    await fetchAttendance()
    isModalOpen.value = false
  } catch (error) {
    formError.value = 'Failed to add student'
  } finally {
    isSubmitting.value = false
  }
}

const submitClass = async () => {
  if (!canCreateClass.value || isClassSubmitting.value) return
  isClassSubmitting.value = true
  classError.value = ''

  try {
    const response = await fetch(`${apiBaseUrl}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: className.value.trim() }),
    })

    if (!response.ok) {
      classError.value = 'Failed to add class'
      return
    }

    await fetchClasses()
    isClassModalOpen.value = false
  } catch (error) {
    classError.value = 'Failed to add class'
  } finally {
    isClassSubmitting.value = false
  }
}

onMounted(() => {
  fetchClasses()
    .then(fetchAttendance)
    .catch(() => {
      days.value = Array.from({ length: 31 }, (_, index) => index + 1)
      students.value = []
    })
})

const fetchClasses = async () => {
  const response = await fetch(`${apiBaseUrl}/classes`)
  if (!response.ok) {
    throw new Error('Failed to load classes')
  }
  const data = await response.json()
  classes.value = Array.isArray(data) ? data : []
  if (!selectedClassId.value && classes.value.length > 0) {
    selectedClassId.value = classes.value[0].id
  }
  if (!studentClassId.value && selectedClassId.value) {
    studentClassId.value = selectedClassId.value
  }
}

const handleClassSelect = (id: number) => {
  if (selectedClassId.value === id) return
  selectedClassId.value = id
  fetchAttendance().catch(() => {
    students.value = []
  })
}

const handleMonthSelect = (value: string) => {
  selectedMonth.value = value
  fetchAttendance().catch(() => {
    students.value = []
  })
}

const handleDeleteStudent = async (studentId: string) => {
  if (!selectedClassId.value) return
  const confirmed = window.confirm('Remove this student from the class?')
  if (!confirmed) return

  const response = await fetch(
    `${apiBaseUrl}/classes/${selectedClassId.value}/students/${encodeURIComponent(studentId)}`,
    { method: 'DELETE' },
  )

  if (!response.ok) {
    window.alert('Failed to remove student')
    return
  }

  await fetchAttendance()
}

const handleDeleteClass = async () => {
  if (!selectedClassId.value) return
  const input = window.prompt('Type CONFIRM to delete this class')
  if (!input || input.toLowerCase() !== 'confirm') {
    return
  }

  const response = await fetch(
    `${apiBaseUrl}/classes/${selectedClassId.value}?confirm=confirm`,
    { method: 'DELETE' },
  )

  if (!response.ok) {
    window.alert('Failed to remove class')
    return
  }

  await fetchClasses()
  if (!classes.value.find((item) => item.id === selectedClassId.value)) {
    selectedClassId.value = classes.value[0]?.id ?? null
  }
  await fetchAttendance()
}

const handleToggleAttendance = async (payload: { studentId: string; day: number; present: boolean }) => {
  if (!selectedClassId.value) return
  const monthValue =
    selectedMonth.value || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const date = `${monthValue}-${String(payload.day).padStart(2, '0')}`

  const response = await fetch(`${apiBaseUrl}/attendance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId: selectedClassId.value,
      studentCode: payload.studentId,
      attendanceDate: date,
      present: payload.present,
    }),
  })

  if (!response.ok) {
    window.alert('Failed to update attendance')
    return
  }

  const target = students.value.find((student) => student.id === payload.studentId)
  if (!target) return
  if (payload.present) {
    if (!target.presentDays.includes(payload.day)) {
      target.presentDays.push(payload.day)
    }
  } else {
    target.presentDays = target.presentDays.filter((day) => day !== payload.day)
  }
}
</script>

<template>
  <section class="attendance-page">
    <header class="attendance-header">
      <div class="title-block">
        <h1 class="page-title">Attendance</h1>
        <p class="section-subtitle">Manage student attendance and class rosters.</p>
      </div>
      <div class="search">
        <input v-model="searchQuery" type="search" placeholder="Search students" />
      </div>
    </header>

    <AttendanceTable
      :days="days"
      :students="filteredStudents"
      :classes="classes"
      :selected-class-id="selectedClassId"
      :selected-month="selectedMonth"
      @add-student="openModal"
      @add-class="openClassModal"
      @delete-class="handleDeleteClass"
      @select-class="handleClassSelect"
      @select-month="handleMonthSelect"
      @delete-student="handleDeleteStudent"
      @toggle-attendance="handleToggleAttendance"
    />

    <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Add Student</h2>
          <button class="modal-close" type="button" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <label class="modal-field">
            <span>Student Name</span>
            <input v-model="formName" type="text" placeholder="Student name" />
          </label>
          <label class="modal-field">
            <span>Student ID</span>
            <input v-model="formCode" type="text" placeholder="ST-011" />
          </label>
          <label class="modal-field">
            <span>Class</span>
            <select v-model="studentClassId">
              <option v-for="klass in classes" :key="klass.id" :value="klass.id">
                {{ klass.name }}
              </option>
            </select>
          </label>
          <p v-if="formError" class="modal-error">{{ formError }}</p>
        </div>
        <div class="modal-actions">
          <button class="ghost" type="button" @click="closeModal">Cancel</button>
          <button class="primary" type="button" :disabled="!canSubmit || isSubmitting" @click="submitStudent">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isClassModalOpen" class="modal-backdrop" @click="closeClassModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Add Class</h2>
          <button class="modal-close" type="button" @click="closeClassModal">✕</button>
        </div>
        <div class="modal-body">
          <label class="modal-field">
            <span>Class Name</span>
            <input v-model="className" type="text" placeholder="Class C" />
          </label>
          <p v-if="classError" class="modal-error">{{ classError }}</p>
        </div>
        <div class="modal-actions">
          <button class="ghost" type="button" @click="closeClassModal">Cancel</button>
          <button class="primary" type="button" :disabled="!canCreateClass || isClassSubmitting" @click="submitClass">
            {{ isClassSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attendance-page {
  display: grid;
  gap: 24px;
}

.attendance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.title-block {
  display: grid;
  gap: 4px;
}

.page-title {
  margin: 0 0 6px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2933;
}

.section-subtitle {
  margin: 0;
  color: #5b616b;
  font-size: 1rem;
}

.search {
  flex: 1;
  min-width: 220px;
  max-width: 360px;
  background: #efefef;
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  border: none;
}

.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  font-family: inherit;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 10;
  padding: 16px;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  width: min(420px, 100%);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
  padding: 18px 20px 20px;
  display: grid;
  gap: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
  display: grid;
  gap: 12px;
}

.modal-field {
  display: grid;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-field input,
.modal-field select {
  border: 1px solid #e1e3ea;
  background: #f9fafb;
  border-radius: 10px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 0.95rem;
}

.modal-error {
  margin: 0;
  color: #b0403a;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ghost {
  border: 1px solid #d9dfe7;
  background: transparent;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary {
  border: none;
  background: #5ba4d5;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .attendance-header {
    align-items: flex-start;
  }
}
</style>
