<template>
  <div class="student-page px-6">
    <div class="page-header">
      <h1 class="text-2xl font-bold text-gray-700">Student Management</h1>
    </div>
    <div class="btn-position">
      <button class="add-btn" @click="showModal = true">+ Add Student</button>
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
          <option value="Bachelor degree in Nursing and Midwifery">Nursing and Midwifery</option>
          <option value="Associate degree in Nurse">Associate Nurse</option>
          <option value="Continue Primary Nurse to Associate degree">Nurse AD</option>
          <option value="Continue Primary Midwife to Associate degree">Midwife AD</option>
          <option value="Associate degree in Midwifery">Midwifery AD</option>
        </select>

        <select v-model="filterYear" @change="fetchStudents">
          <option value="">All Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
          <option value="5">Year 5</option>
        </select>

        <select v-model="filterGroup" @change="fetchStudents">
          <option value="">All Group</option>
          <option value="Group A">Group A</option>
          <option value="Group B">Group B</option>
        </select>
      </div>
    </div>

    <!-- The Custom Frame Component -->
    <IntakeStudentCard :students="students" @delete="handleDelete" />

    <!-- ADD STUDENT MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Student</h2>
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
            <label>Class</label>
            <input v-model="newStudent.class" type="text" placeholder="10A" />
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
          <button class="save-btn" @click="submitStudent">Create Student</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/axios'
import IntakeStudentCard from '../components/IntakeStudentCard.vue'

const students = ref([])
const showModal = ref(false)
const searchQuery = ref('')
const filterGender = ref('')
const filterClass = ref('')
const filterMajor = ref('')
const filterGroup = ref('')
const filterYear = ref('')

const newStudent = ref({
  name: '',
  studentId: '',
  class: '',
  generation: '',
  location: '',
  contact: '',
  gender: 'Male',
  exam: '',
  major: 'Associate degree in Nurse',
  year: '1',
  group: 'Group A',
})

const fetchStudents = async () => {
  try {
    const params = {
      search: searchQuery.value,
      gender: filterGender.value,
      class: filterClass.value,
      major: filterMajor.value,
      year: filterYear.value,
      group: filterGroup.value,
    }
    const res = await api.get('/students', { params })
    students.value = res.data
  } catch (err) {
    console.error('Fetch failed', err)
  }
}

const submitStudent = async () => {
  try {
    await api.post('/students', newStudent.value)
    showModal.value = false
    fetchStudents()
    // Reset form
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
      year: '',
      group: '',
    }
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

onMounted(fetchStudents)
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
