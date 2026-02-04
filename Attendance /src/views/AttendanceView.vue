<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import AttendanceTable from '../components/AttendanceTable.vue'
import AddStudentModal from '../components/AddStudentModal.vue'

type StudentRow = { id: string; name: string; presentDays: number[] }
type ClassOption = {
  id: number
  name: string
  year: number
  module: string
  courseId: number | null
  courseName: string
}
type CourseOption = { id: number; name: string }

const days = ref<number[]>([])
const students = ref<StudentRow[]>([])
const classes = ref<ClassOption[]>([])
const courses = ref<CourseOption[]>([])
const selectedClassId = ref<number | null>(null)
const currentMonth = ref('')
const selectedMonth = ref('')
const selectedCourseId = ref<number | null>(null)
const selectedYear = ref<number | null>(null)
const selectedModule = ref('Module 1')
const apiBaseUrl = 'http://localhost:8000'
const isModalOpen = ref(false)
const searchQuery = ref('')
const editingStudent = ref<StudentRow | null>(null)
const modalMode = ref<'add' | 'edit'>('add')
const isClassModalOpen = ref(false)
const classCourseId = ref<number | null>(null)
const classYear = ref<number | null>(null)
const classModule = ref('')
const classError = ref('')
const isClassSubmitting = ref(false)

const canCreateClass = computed(
  () => Boolean(classCourseId.value) && Boolean(classYear.value) && classModule.value.trim() !== '',
)
const formatModuleLabel = (value: string) => value.replace(/^module\s*/i, 'Class ')
const courseList = computed(() => courses.value.slice(0, 5))
const courseIdSet = computed(() => new Set(courseList.value.map((course) => course.id)))
const selectedCourseName = computed(() => {
  const match = courseList.value.find((course) => course.id === selectedCourseId.value)
  return match?.name ?? 'Course'
})
const selectedClassLabel = computed(
  () => `${selectedCourseName.value} - Year ${selectedYear.value ?? ''} - ${formatModuleLabel(selectedModule.value)}`,
)
const displayClasses = computed(() => {
  if (courseIdSet.value.size === 0) return classes.value
  return classes.value.filter((item) => !item.courseId || courseIdSet.value.has(item.courseId))
})
const classOptions = computed(() => {
  const filtered = displayClasses.value.filter((klass) => {
    if (selectedCourseId.value && klass.courseId !== selectedCourseId.value) return false
    if (selectedYear.value && klass.year !== selectedYear.value) return false
    if (selectedModule.value && klass.module !== selectedModule.value) return false
    return true
  })
  return filtered.map((klass) => ({
    id: klass.id,
    label: `${klass.courseName} - Year ${klass.year} - ${formatModuleLabel(klass.module)}`,
  }))
})
const filteredStudents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return students.value
  return students.value.filter((student) => student.name.toLowerCase().includes(query))
})
const availableYears = [1, 2, 3, 4, 5]
const availableModules = computed(() => {
  const modules = new Set<string>()
  const filtered = displayClasses.value.filter((item) => {
    if (selectedCourseId.value && item.courseId !== selectedCourseId.value) return false
    if (selectedYear.value && item.year !== selectedYear.value) return false
    return true
  })
  for (const item of filtered) {
    if (item.module) {
      modules.add(item.module)
    }
  }
  const list = Array.from(modules)
  return list.length > 0 ? list : ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
})

const fetchAttendance = async () => {
  if (!selectedClassId.value) {
    days.value = []
    students.value = []
    return
  }
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
  modalMode.value = 'add'
  editingStudent.value = null
  isModalOpen.value = true
}

const openEditModal = (student: StudentRow) => {
  modalMode.value = 'edit'
  editingStudent.value = student
  isModalOpen.value = true
}

const handleStudentSaved = async (payload?: { classId?: number }) => {
  if (payload?.classId && selectedClassId.value !== payload.classId) {
    selectedClassId.value = payload.classId
  }
  await fetchClasses()
  syncSelectionFromClasses()
  fetchAttendance().catch(() => {
    students.value = []
  })
}

const exportPdf = () => {
  const monthLabel = selectedMonth.value || currentMonth.value || 'current'
  const exportTimestamp = new Date().toLocaleString()
  const title = 'Attendance Report'

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  })

  doc.setFontSize(14)
  doc.text(title, 40, 34)
  doc.setFontSize(10)
  doc.text(`Course: ${selectedCourseName.value}`, 40, 52)
  doc.text(`Year: ${selectedYear.value ?? '-'}`, 40, 66)
  doc.text(`Class: ${formatModuleLabel(selectedModule.value)}`, 40, 80)
  doc.text(`Month: ${monthLabel}`, 320, 52)
  doc.text(`Exported: ${exportTimestamp}`, 320, 66)

  const header = ['Student Name', 'ID', ...days.value.map((day) => String(day))]
  const rows = filteredStudents.value.map((student) => {
    const presentSet = new Set(student.presentDays)
    return [
      student.name,
      student.id,
      ...days.value.map((day) => (presentSet.has(day) ? 'P' : '')),
    ]
  })

  autoTable(doc, {
    startY: 98,
    head: [header],
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      halign: 'center',
    },
    headStyles: {
      fillColor: [91, 164, 213],
      textColor: [255, 255, 255],
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 160 },
      1: { halign: 'left', cellWidth: 70 },
    },
    margin: { left: 40, right: 40 },
  })

  const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY
  doc.setFontSize(9)
  doc.text('P = Present, blank = unmarked', 40, finalY ? finalY + 18 : 110)

  const safeMonth = monthLabel.replace(/[^\w-]+/g, '_')
  doc.save(`attendance_${safeMonth}.pdf`)
}

const openClassModal = () => {
  classCourseId.value = selectedCourseId.value ?? courseList.value[0]?.id ?? null
  classYear.value = selectedYear.value ?? 1
  classModule.value = selectedModule.value || 'Module 1'
  classError.value = ''
  isClassModalOpen.value = true
}

const closeClassModal = () => {
  if (isClassSubmitting.value) return
  isClassModalOpen.value = false
}

const submitClass = async () => {
  if (!canCreateClass.value || isClassSubmitting.value) return
  isClassSubmitting.value = true
  classError.value = ''

  try {
    const response = await fetch(`${apiBaseUrl}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: classCourseId.value,
        year: classYear.value,
        module: classModule.value.trim(),
      }),
    })

    if (!response.ok) {
      classError.value = 'Failed to add class'
      return
    }

    await fetchClasses()
    selectedCourseId.value = classCourseId.value
    selectedYear.value = classYear.value
    selectedModule.value = classModule.value.trim()
    await applySelection()
    isClassModalOpen.value = false
  } catch (error) {
    classError.value = 'Failed to add class'
  } finally {
    isClassSubmitting.value = false
  }
}

onMounted(() => {
  Promise.all([fetchCourses(), fetchClasses()])
    .then(() => {
      syncSelectionFromClasses()
      return fetchAttendance()
    })
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
}

const fetchCourses = async () => {
  const response = await fetch(`${apiBaseUrl}/courses`)
  if (!response.ok) {
    throw new Error('Failed to load courses')
  }
  const data = await response.json()
  courses.value = Array.isArray(data) ? data : []
  const list = courseList.value
  if (!selectedCourseId.value || !list.some((course) => course.id === selectedCourseId.value)) {
    selectedCourseId.value = list[0]?.id ?? null
  }
  if (!selectedYear.value) {
    selectedYear.value = availableYears[0]
  }
  if (!selectedModule.value) {
    selectedModule.value = 'Module 1'
  }
}

const syncSelectionFromClasses = () => {
  if (displayClasses.value.length === 0) {
    selectedClassId.value = null
    return
  }
  let target = displayClasses.value.find((item) => item.id === selectedClassId.value)
  if (!target && selectedCourseId.value && selectedYear.value && selectedModule.value) {
    target = displayClasses.value.find(
      (item) =>
        item.courseId === selectedCourseId.value &&
        item.year === selectedYear.value &&
        item.module === selectedModule.value,
    )
  }
  if (!target) {
    target = displayClasses.value[0]
  }
  selectedClassId.value = target.id
  selectedCourseId.value = target.courseId ?? selectedCourseId.value
  selectedYear.value = target.year ?? selectedYear.value
  selectedModule.value = target.module ?? selectedModule.value
}

const applySelection = async () => {
  const moduleOptions = availableModules.value
  if (!moduleOptions.includes(selectedModule.value)) {
    selectedModule.value = moduleOptions[0] ?? 'Module 1'
  }
  const match = displayClasses.value.find(
    (item) =>
      item.courseId === selectedCourseId.value &&
      item.year === selectedYear.value &&
      item.module === selectedModule.value,
  )
  if (!match) {
    selectedClassId.value = null
    days.value = []
    students.value = []
    return
  }
  selectedClassId.value = match.id
  await fetchAttendance()
}

const handleCourseSelect = (id: number) => {
  if (selectedCourseId.value === id) return
  selectedCourseId.value = id
  applySelection().catch(() => {
    students.value = []
  })
}

const handleYearSelect = (value: number) => {
  if (selectedYear.value === value) return
  selectedYear.value = value
  applySelection().catch(() => {
    students.value = []
  })
}

const handleModuleSelect = (value: string) => {
  if (selectedModule.value === value) return
  selectedModule.value = value
  applySelection().catch(() => {
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
  syncSelectionFromClasses()
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
      :courses="courseList"
      :years="availableYears"
      :modules="availableModules"
      :selected-course-id="selectedCourseId"
      :selected-year="selectedYear"
      :selected-module="selectedModule"
      :selected-month="selectedMonth"
      @add-student="openModal"
      @add-class="openClassModal"
      @delete-class="handleDeleteClass"
      @select-course="handleCourseSelect"
      @select-year="handleYearSelect"
      @select-module="handleModuleSelect"
      @select-month="handleMonthSelect"
      @delete-student="handleDeleteStudent"
      @edit-student="openEditModal"
      @export-pdf="exportPdf"
      @toggle-attendance="handleToggleAttendance"
    />

    <AddStudentModal
      :open="isModalOpen"
      :mode="modalMode"
      :student="editingStudent"
      :class-options="classOptions"
      :selected-class-id="selectedClassId"
      :selected-class-label="selectedClassLabel"
      :selected-course-id="selectedCourseId"
      :selected-year="selectedYear"
      :selected-module="selectedModule"
      :api-base-url="apiBaseUrl"
      @close="isModalOpen = false"
      @saved="handleStudentSaved"
    />

    <div v-if="isClassModalOpen" class="modal-backdrop" @click="closeClassModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Add Class</h2>
          <button class="modal-close" type="button" @click="closeClassModal">✕</button>
        </div>
        <div class="modal-body">
          <label class="modal-field">
            <span>Course</span>
            <select v-model.number="classCourseId">
              <option v-for="course in courseList" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </label>
          <label class="modal-field">
            <span>Year</span>
            <select v-model.number="classYear">
              <option v-for="year in availableYears" :key="year" :value="year">Year {{ year }}</option>
            </select>
          </label>
          <label class="modal-field">
            <span>Module</span>
            <input v-model="classModule" type="text" placeholder="Module 1" />
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
