<template>
  <div class="student-page px-6">
    <div class="page-header">
      <h1 class="text-2xl font-bold text-gray-700">Student Management</h1>
    </div>
    <div class="btn-position">
      <button class="add-btn" @click="openAddStudent">+ Add Student</button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-card mb-6">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          @input="fetchStudents"
          type="text"
          placeholder="Search by name or ID..."
          class="search-input"
        />

        <select v-model="filterMajor" @change="fetchStudents">
          <option value="">All Major</option>
          <option v-for="course in courses" :key="course.id" :value="course.name">
            {{ course.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- The Custom Frame Component -->
    <IntakeStudentCard :students="students" @delete="handleDelete" @edit="handleEdit" />

    <!-- ADD STUDENT MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h2>
          <button class="close-x" @click="showModal = false">×</button>
        </div>
        <div class="form-grid">
          <div class="input-item">
            <label>Full Name</label>
            <input v-model="newStudent.name" type="text" placeholder="Enter name" />
          </div>
          <div class="input-item">
            <label>Student ID</label>
            <input v-model="newStudent.studentId" type="text" placeholder="STU001" />
          </div>
          <div class="input-item">
            <label>Gender</label>
            <select v-model="newStudent.gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div class="input-item">
            <label>Course</label>
            <select v-model.number="modalCourseId">
              <option v-if="courses.length === 0" value="" disabled>No courses</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>
          <div class="input-item">
            <label>Subject</label>
            <select v-model.number="modalSubjectId">
              <option v-if="filteredModalSubjects.length === 0" value="" disabled>No subjects</option>
              <option
                v-for="subject in filteredModalSubjects"
                :key="subject.id"
                :value="subject.id"
              >
                {{ subject.name }}
              </option>
            </select>
          </div>
          <div class="input-item">
            <label>Class</label>
            <select v-model.number="modalClassId">
              <option v-if="availableClasses.length === 0" value="" disabled>No classes</option>
              <option v-for="klass in availableClasses" :key="klass.id" :value="klass.id">
                {{ klass.name }}
              </option>
            </select>
          </div>
          <div class="input-item">
            <label>Generation</label>
            <input v-model="newStudent.generation" type="text" placeholder="2024" />
          </div>
          <div class="input-item">
            <label>Location</label>
            <input v-model="newStudent.location" type="text" placeholder="Phnom Penh" />
          </div>
          <div class="input-item">
            <label>Contact</label>
            <input v-model="newStudent.contact" type="text" placeholder="012-345-678" />
          </div>
          <div class="input-item">
            <label>Exam</label>
            <input v-model="newStudent.exam" type="text" placeholder="Final" />
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showModal = false">Cancel</button>
          <button class="save-btn" @click="submitStudent">
            {{ isEditing ? 'Update Student' : 'Create Student' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import api from '../services/axios'
import IntakeStudentCard from '../components/IntakeStudentCard.vue'

type CourseOption = { id: number; name: string }
type ClassOption = {
  id: number
  name: string
  year: number
  module: string
  courseId: number | null
  courseName: string
  subjectId?: number | null
}
type SubjectOption = {
  id: number
  name: string
  code: string
  description?: string
  lectureHours: number
  labHours: number
  year: number
  semester: number
  courseId: number
}

const students = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const searchQuery = ref('')
const filterGender = ref('')
const filterClass = ref('')
const filterMajor = ref('')
const courses = ref<CourseOption[]>([])
const classes = ref<ClassOption[]>([])
const subjects = ref<SubjectOption[]>([])
const modalCourseId = ref<number | null>(null)
const modalSubjectId = ref<number | null>(null)
const modalClassId = ref<number | null>(null)

const newStudent = ref({
  name: '',
  studentId: '',
  class: '',
  generation: '',
  location: '',
  contact: '',
  gender: 'Male',
  exam: '',
  major: '',
  year: 1,
  group: '',
})

const resetStudentForm = () => {
  newStudent.value = {
    name: '',
    studentId: '',
    class: '',
    generation: '',
    location: '',
    contact: '',
    gender: 'Male',
    exam: '',
    major: '',
    year: 1,
    group: '',
  }
  modalCourseId.value = null
  modalSubjectId.value = null
  modalClassId.value = null
}

const moduleFromSemester = (semester?: number | null) => {
  if (!semester || semester < 1) return null
  const label = `Module ${semester}`
  return label
}

const filteredModalSubjects = computed(() =>
  subjects.value.filter(
    (subject) =>
      !modalCourseId.value || subject.courseId === modalCourseId.value,
  ),
)

const availableClasses = computed(() => {
  const subject = subjects.value.find((item) => item.id === modalSubjectId.value)
  const subjectModule = subject ? moduleFromSemester(subject.semester) : null
  return classes.value.filter((klass) => {
    if (modalCourseId.value && klass.courseId !== modalCourseId.value) {
      return false
    }
    if (subject) {
      if (klass.subjectId) {
        return klass.subjectId === subject.id
      }
      if (subject.year && klass.year !== subject.year) return false
      if (subjectModule && klass.module !== subjectModule) return false
    }
    return true
  })
})

const applyModalSelections = (options?: { preserveMissing?: boolean }) => {
  const course = courses.value.find((item) => item.id === modalCourseId.value)
  const klass = classes.value.find((item) => item.id === modalClassId.value)
  if (course) {
    newStudent.value.major = course.name
  } else if (!options?.preserveMissing) {
    newStudent.value.major = ''
  }

  if (klass) {
    newStudent.value.class = klass.name
    newStudent.value.year = klass.year
    newStudent.value.group = klass.name
  } else if (!options?.preserveMissing) {
    newStudent.value.class = ''
    newStudent.value.year = 1
    newStudent.value.group = ''
  }
}

const openAddStudent = () => {
  isEditing.value = false
  editingId.value = null
  resetStudentForm()
  showModal.value = true
  if (courses.value.length > 0) {
    const fromFilter = courses.value.find((c) => c.name === filterMajor.value)
    modalCourseId.value = fromFilter?.id ?? courses.value[0].id
  } else {
    modalCourseId.value = null
  }

  if (filteredModalSubjects.value.length > 0) {
    modalSubjectId.value = filteredModalSubjects.value[0].id
  } else {
    modalSubjectId.value = null
  }

  if (availableClasses.value.length > 0) {
    modalClassId.value = availableClasses.value[0].id
  } else {
    modalClassId.value = null
  }
  applyModalSelections()
}

watch(modalCourseId, () => {
  const subjectOptions = filteredModalSubjects.value
  const hasSubject = subjectOptions.some((item) => item.id === modalSubjectId.value)
  if (!hasSubject) {
    modalSubjectId.value = subjectOptions[0]?.id ?? null
  }
  const hasSelection = availableClasses.value.some(
    (klass) => klass.id === modalClassId.value,
  )
  if (!hasSelection) {
    if (availableClasses.value.length > 0) {
      modalClassId.value = availableClasses.value[0].id
    } else {
      modalClassId.value = null
    }
  }
  applyModalSelections({ preserveMissing: isEditing.value })
})

watch(modalSubjectId, () => {
  const hasSelection = availableClasses.value.some(
    (klass) => klass.id === modalClassId.value,
  )
  if (!hasSelection) {
    if (availableClasses.value.length > 0) {
      modalClassId.value = availableClasses.value[0].id
    } else {
      modalClassId.value = null
    }
  }
  applyModalSelections({ preserveMissing: isEditing.value })
})

watch(modalClassId, () => {
  applyModalSelections({ preserveMissing: isEditing.value })
})

const fetchCourses = async () => {
  try {
    const [courseRes, classRes] = await Promise.all([
      api.get('/attendance/courses'),
      api.get('/attendance/classes'),
    ])
    courses.value = Array.isArray(courseRes.data) ? courseRes.data : []
    classes.value = Array.isArray(classRes.data) ? classRes.data : []
  } catch (err) {
    console.error('Failed to load courses/classes', err)
    courses.value = []
    classes.value = []
  }
}

const fetchSubjects = async () => {
  try {
    const res = await api.get('/curriculum')
    subjects.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Failed to load subjects', err)
    subjects.value = []
  }
}

const fetchStudents = async () => {
  try {
    const params = {
      search: searchQuery.value,
      gender: filterGender.value,
      class: filterClass.value,
      major: filterMajor.value,
    }
    const res = await api.get('/students', { params })
    students.value = res.data
  } catch (err) {
    console.error('Fetch failed', err)
  }
}

const handleEdit = async (student: any) => {
  if (courses.value.length === 0 || classes.value.length === 0 || subjects.value.length === 0) {
    await Promise.all([fetchCourses(), fetchSubjects()])
  }
  isEditing.value = true
  editingId.value = student.id
  showModal.value = true

  newStudent.value = {
    name: student.name ?? '',
    studentId: student.studentId ?? '',
    class: student.class ?? '',
    generation: student.generation ?? '',
    location: student.location ?? '',
    contact: student.contact ?? '',
    gender: student.gender ?? 'Male',
    exam: student.exam ?? '',
    major: student.major ?? '',
    year: student.year ?? 1,
    group: student.group ?? '',
  }

  const courseMatch = courses.value.find((course) => course.name === student.major)
  modalCourseId.value = courseMatch?.id ?? null
  const classMatch = classes.value.find(
    (klass) =>
      klass.name === student.class &&
      (!modalCourseId.value || klass.courseId === modalCourseId.value),
  )
  modalClassId.value = classMatch?.id ?? null
  if (classMatch?.subjectId) {
    modalSubjectId.value = classMatch.subjectId
  } else {
    const subjectMatch = subjects.value.find(
      (subject) =>
        subject.courseId === modalCourseId.value &&
        subject.year === (student.year ?? subject.year),
    )
    modalSubjectId.value = subjectMatch?.id ?? filteredModalSubjects.value[0]?.id ?? null
  }
  applyModalSelections({ preserveMissing: true })
}

const submitStudent = async () => {
  try {
    applyModalSelections({ preserveMissing: isEditing.value })
    if (isEditing.value && editingId.value !== null) {
      await api.patch(`/students/${editingId.value}`, newStudent.value)
    } else {
      await api.post('/students', newStudent.value)
    }
    showModal.value = false
    fetchStudents()
    isEditing.value = false
    editingId.value = null
    resetStudentForm()
  } catch (err) {
    alert('Check if Student ID is unique.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Delete this student?')) {
    await api.delete(`/students/${id}`)
    fetchStudents()
  }
}

onMounted(() => {
  fetchCourses()
  fetchSubjects()
  fetchStudents()
})
</script>
<style scoped>
.page-header {
  display: flex;
  justify-content: center;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 600px;
  max-width: 90%;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}
.input-item label {
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  color: #666;
}
.input-item input,
.input-item select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}
.save-btn {
  background: #5ba4d5;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
}
.cancel-btn {
  background: #eee;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
}
.add-btn {
  background: #5ba4d5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.filter-card {
  background: white;
  padding: 10px;
  border-radius: 10px;
  margin-top: 15px;
  margin-left: 25px;
  width: 95%;
}
.filter-group {
  display: flex;
  gap: 15px;
}
.search-input {
  flex: 2;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.student-page {
  padding: 20px;
  background: #f4f7f9;
  min-height: 100vh;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.input-item label {
  font-weight: 600;
  color: #555;
  font-size: 13px;
}
.input-item input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 5px;
}
.save-btn {
  background: #5ba4d5;
  color: white;
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.btn-position {
  display: flex;
  justify-content: flex-end;
  width: 100;
  margin-right: 40px;
}
</style>
