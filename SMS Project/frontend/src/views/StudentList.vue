<template>
  <div class="student-page px-6">
    <!-- Page Title and Add Button -->
    <div class="page-header">
      <h1 class="text-2xl font-bold text-gray-700">Student List</h1>
      <button class="add-btn" @click="showForm = true">Add Student</button>
    </div>

    <!-- Add Student Form -->
    <div v-if="showForm" class="add-form mb-4">
      <input v-model="newStudent.name" type="text" placeholder="Name" />
      <input v-model="newStudent.id" type="text" placeholder="Student ID" />
      <input v-model="newStudent.class" type="text" placeholder="Class" />
      <input v-model="newStudent.generation" type="text" placeholder="Generation" />
      <input v-model="newStudent.location" type="text" placeholder="Location" />
      <input v-model="newStudent.contact" type="text" placeholder="Contact" />
      <input v-model="newStudent.exam" type="text" placeholder="Exam Status" />
      <div class="form-buttons">
        <button class="add-btn" @click="submitStudent">Add</button>
        <button class="cancel-btn" @click="cancelForm">Cancel</button>
      </div>
    </div>

    <!-- Use the White Frame Component -->
    <StudentFrame :students="students" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StudentFrame from '../components/StudentTable.vue'

interface Student {
  name: string
  id: string
  class: string
  generation: string
  location: string
  contact: string
  exam: string
}

const students = ref<Student[]>([])

const showForm = ref(false)
const newStudent = ref<Student>({
  name: '',
  id: '',
  class: '',
  generation: '',
  location: '',
  contact: '',
  exam: ''
})

const submitStudent = () => {
  // Validate all fields
  if (!newStudent.value.name || !newStudent.value.id || !newStudent.value.class ||
      !newStudent.value.generation || !newStudent.value.location || 
      !newStudent.value.contact || !newStudent.value.exam) {
    alert("Please fill all fields")
    return
  }

  // Add new student
  students.value.push({ ...newStudent.value })

  // Reset form
  newStudent.value = {
    name: '',
    id: '',
    class: '',
    generation: '',
    location: '',
    contact: '',
    exam: ''
  }
  showForm.value = false
}

const cancelForm = () => {
  newStudent.value = {
    name: '',
    id: '',
    class: '',
    generation: '',
    location: '',
    contact: '',
    exam: ''
  }
  showForm.value = false
}
</script>

<style scoped>
.student-page {
  padding-top: 20px;
  position: relative;
}

/* .add-btn {
  background-color: #5ba4d5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
} */

.add-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #888;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.page-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  width: 100%; 
}

.page-header .add-btn{
  position: absolute;
  top: 0;
  right: 0;
}

.add-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
}

.add-form input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
}

.form-buttons {
  display: flex;
  gap: 10px;
}
</style>
