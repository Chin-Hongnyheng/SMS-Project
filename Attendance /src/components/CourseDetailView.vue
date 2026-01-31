<template>
  <div class="detail-page">
    <button @click="$router.back()" class="back-btn">
      <font-awesome-icon :icon="['fas', 'circle-arrow-left']" /> Back
    </button>

    <div class="header-section">
      <h1 class="course-title">{{ courseName }}</h1>
      <p class="subtitle">Academic Roadmap & Subject Credits </p>
    </div>

    <!-- 1. Management Table (visible to admin/teacher) -->
     <div v-if="userRole !== 'student'" class="table-container">
      <div class="table-header">
        <h3>Subject Management</h3>
        <button @click="showModal = true" class="add-btn">
          + Add Subject
        </button>
      </div>

      <table class="curriculum-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Subject Name</th>
            <th>Year</th>
            <th>Sem</th>
            <th>Lec Hours</th>
            <th>Lab Hours</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
    
        </thead>
        <tbody>
          <!-- We will loop through subjects here -->
          <tr v-for="subject in subjects" :key="subject.id">
            <td><span class="badge">{{ subject.code }}</span></td>
            <td class="subject-name">{{ subject.name }}
              <small v-if="subject.description" class="sub-desc">{{ subject.description }}</small>
            </td>
            <td>Y{{ subject.year }}</td>
            <td>{{ subject.semester }}</td>
            <td>{{ subject.lectureHours }}h</td>
            <td>{{ subject.labHours }}h</td>
            <td class="total-hours">{{ subject.lectureHours + subject.labHours }}h</td>

            <td class="action-btn">
              <button @click="editSubject(subject)" class="icon-btn edit">
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>
              <button @click="deleteSubject(subject.id)" class="icon-btn delete">
                <font-awesome-icon icon="fas fa-trash" />
              </button>
            </td>
          </tr>
          
          <!-- If no subjects yet -->
          <tr v-if="subjects.length === 0">
            <td colspan="7" class="empty-state">No subjects added to this curriculum yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- student display -->
    <div class="main-container-white">
      <h2 class="section-title">Visual Roadmap</h2>

      <div v-for="yearNum in [1, 2, 3, 4]" :key="yearNum" class="year-wrapper">
        <div class="year-bar" @click="toggleYear(yearNum)">
          <span>Year {{ yearNum === 1 ? '1 (Foundation)' : yearNum }}</span>
          <font-awesome-icon :icon="['fas', activeYear === yearNum ? 'chevron-up' : 'chevron-down']" />
        </div>

        <transition name="slide">
          <div v-if="activeYear === yearNum" class="subjects-list">
             <div v-for="subject in getSubjectsByYear(yearNum)" :key="subject.id" class="subject-row">
                <div class="sub-info">
                  <span class="sub-code">{{ subject.code }}</span>
                  <span class="sub-name">{{ subject.name }}</span>
                </div>
                <div class="sub-hours">
                  {{ subject.lectureHours }}L / {{ subject.labHours }}P
                </div>
             </div>
             <div v-if="getSubjectsByYear(yearNum).length === 0" class="no-data">
               No subjects assigned to this year.
             </div>
          </div>
        </transition>
      </div>

      <div class="requirements-box">
        <h3>General Academic Requirements</h3>
        <p><strong>Attendance:</strong> 85% to 90% attendance is mandatory.</p>
        <p><strong>Assessment:</strong> Theory (40%) and Lab/Clinical (60%).</p>
        <p><strong>Graduation:</strong> Must pass School and National Exit Exams.</p>
      </div>
    </div>

    <!-- 3. ADD/EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit Subject' : 'Add New Subject' }}</h2>
        <input v-model="newSubject.name" placeholder="Subject Name" class="form-input" />
        <input v-model="newSubject.code" placeholder="Code (e.g. ANA101)" class="form-input" />
        <textarea v-model="newSubject.description" placeholder="Requirements/Info/Labs details..." class="form-input" rows="3"></textarea>
        
        <div class="form-row">
          <input type="number" v-model="newSubject.lectureHours" placeholder="Lec Hours" />
          <input type="number" v-model="newSubject.labHours" placeholder="Lab Hours" />
        </div>

        <div class="form-row">
          <select v-model="newSubject.year">
            <option :value="1">Year 1</option>
            <option :value="2">Year 2</option>
            <option :value="3">Year 3</option>
            <option :value="4">Year 4</option>
          </select>
          <select v-model="newSubject.semester">
            <option :value="1">Semester 1</option>
            <option :value="2">Semester 2</option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="cancel-btn">Cancel</button>
          <button @click="saveSubject" class="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash, faCircleArrowLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// You MUST add them to the library here
library.add(faPen, faTrash, faCircleArrowLeft, faChevronUp, faChevronDown);

const route = useRoute();
const courseId = Number(route.params.id);
const courseName = ref('Loading...');
const subjects = ref<any[]>([]);
const userRole = ref('admin'); // Set to 'admin' or 'student'
const activeYear = ref<number | null>(null);

const showModal = ref(false);
const isEditing = ref(false);
const currentEditingId = ref<number | null>(null);

const courses: Record<number, string> = {
  1: 'Bachelor degree in Nursing and Midwifery',
  2: 'Associate degree in Nurse',
  3: 'Continue Primary Nurse to Associate degree',
  4: 'Continue Primary Midwife to Associate degree',
  5: 'Continue Primary Nurse to Associate degree',
};

const newSubject = ref({
  name: '', code: '', lectureHours: 0, labHours: 0, year: 1, semester: 1, description: '', courseName: ''
});

const fetchSubjects = async () => {
  try {
    const response = await axios.get('http://localhost:3000/curriculum');
    subjects.value = response.data.filter((s: any) => s.courseName === courses[courseId]);
  } catch (error) { console.error(error); }
};

const openAddModal = () => {
  isEditing.value = false;
  newSubject.value = { name: '', code: '', lectureHours: 0, labHours: 0, year: 1, semester: 1, description: '', courseName: courses[courseId] };
  showModal.value = true;
};

const editSubject = (subject: any) => {
  isEditing.value = true;
  currentEditingId.value = subject.id;
  newSubject.value = { ...subject };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const saveSubject = async () => {
  try {
    newSubject.value.courseName = courses[courseId];
    if (isEditing.value && currentEditingId.value) {
      await axios.patch(`http://localhost:3000/curriculum/${currentEditingId.value}`, newSubject.value);
    } else {
      await axios.post('http://localhost:3000/curriculum', newSubject.value);
    }
    closeModal();
    fetchSubjects();
  } catch (error) { alert("Error saving"); }
};

const deleteSubject = async (id: number) => {
  if (confirm("Delete this subject forever?")) {
    try {
      await axios.delete(`http://localhost:3000/curriculum/${id}`);
      fetchSubjects();
    } catch (error) { alert("Delete failed"); }
  }
};

const toggleYear = (y: number) => activeYear.value = activeYear.value === y ? null : y;
const getSubjectsByYear = (y: number) => subjects.value.filter(s => s.year === y);

onMounted(() => {
  courseName.value = courses[courseId] || 'Unknown Course';
  fetchSubjects();
});
</script>

<style scoped>
.detail-page { padding: 25px; }
.header-section { margin-bottom: 25px; }
.course-title { font-size: 26px; font-weight: 800; }
.table-container { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 30px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }

.back-btn { 
  cursor: pointer; 
  margin-bottom: 20px; 
  padding: 8px 15px; 
  background-color: #5ba4d5; 
  color: white;
  border: none; 
  border-radius: 10px;
  font-weight: bold;
}
.add-btn {
  background-color: #5ba4d5;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content { background: white; padding: 30px; border-radius: 15px; width: 400px; }
.form-input { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd; }
.form-row { display: flex; gap: 10px; margin-bottom: 15px; }
.form-row input, .form-row select { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #ddd; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.save-btn { background: #5ba4d5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.cancel-btn { background: #eee; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.action-btn { width: 84px;}

.curriculum-table { width: 100%; border-collapse: collapse; }
.curriculum-table th { padding: 12px; border-bottom: 2px solid #eee; text-align: left; color: #888; font-size: 0.8rem; }
.curriculum-table td { padding: 15px 12px; border-bottom: 1px solid #eee; }

.sub-desc { display: block; font-size: 0.75rem; color: #999; margin-top: 4px; }
.icon-btn { border: none; background: none; cursor: pointer; margin-right: 10px; font-size: 1rem; }
.icon-btn.edit { color: #5ba4d5; }
.icon-btn.delete { color: #e74c3c; }

.main-container-white { background: white; border-radius: 15px; padding: 30px; }
.year-bar { background-color: #F9F3EF; padding: 15px 25px; border-radius: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: bold; cursor: pointer; }
.subject-row { display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #f9f9f9; }
.sub-code { color: #5ba4d5; font-weight: bold; margin-right: 10px; }

.empty-state, .no-data { text-align: center; padding: 30px; color: #aaa; font-style: italic; }

.requirements-box { margin-top: 40px; padding: 20px; border: 1px dashed #ccc; border-radius: 10px; background: #fcfaf6; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: 30px; border-radius: 15px; width: 450px; }
.form-input { width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ddd; }
.form-row { display: flex; gap: 10px; margin-bottom: 10px; }
</style>