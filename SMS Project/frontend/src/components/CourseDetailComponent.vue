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
    <div v-if="userRole === 'admin' || userRole === 'teacher'" class="table-container">
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
              <button @click="confirmDelete(subject.id)" class="icon-btn delete">
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
             <div v-for="subject in getSubjectsByYear(yearNum)" 
              :key="subject.id"
              class="subject-row clickable"
              @click="$router.push(`/academic/subject/${subject.id}`)"
              >
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
      <div class="modal-content large">
        <h2>{{ isEditing ? 'Edit Subject' : 'Add New Subject' }}</h2>
        <input v-model="newSubject.name" placeholder="Subject Name" class="form-input" />
        <input v-model="newSubject.code" placeholder="Code (e.g. ANA101)" class="form-input" />
        
        <p class="label">Course Description (Mardown):</p>
        <MdEditor v-model="newSubject.description" language="en-US" />
        
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
  <!-- Delete Confirmation Screen -->
  <div v-if="showDeleteModal" class="modal-overlay">
  <div class="modal-content delete-modal">
    <div class="warning-icon">⚠️</div>
    <h2>Are you sure?</h2>
    <p>This will permanently delete this subject from the roadmap. This action cannot be undone.</p>
    
    <div class="modal-actions">
      <button @click="showDeleteModal = false" class="cancel-btn">No, Cancel</button>
      <button @click="executeDelete" class="confirm-delete-btn">Yes, Delete it</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';


import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash, faCircleArrowLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// library here
library.add(faPen, faTrash, faCircleArrowLeft, faChevronUp, faChevronDown);

const route = useRoute();
const courseId = Number(route.params.id);
const courseName = ref('Loading...');
const subjects = ref<any[]>([]);
const userRole = ref<string | null>(null);
const activeYear = ref<number | null>(null);

const showModal = ref(false);
const isEditing = ref(false);
const currentEditingId = ref<number | null>(null);
const showDeleteModal = ref(false);
const subjectToDeleteId = ref<number | null>(null);

  onMounted(() => {
  // Get the role from sessionStorage
  const roles = sessionStorage.getItem('roles');
  if (roles) {
    const parsedRoles = JSON.parse(roles) as string[];
    userRole.value = parsedRoles[0] || null; // pick first role
  }

  courseName.value = courses[courseId] || 'Unknown Course';
  fetchSubjects();
});

const courses: Record<number, string> = {
  1: 'Bachelor degree in Nursing and Midwifery',
  2: 'Associate degree in Nurse',
  3: 'Continue Primary Nurse to Associate degree',
  4: 'Continue Primary Midwife to Associate degree',
  5: 'Continue Primary Nurse to Associate degree',
};

const newSubject = ref({
  name: '',
  code: '',
  lectureHours: 0,
  labHours: 0,
  year: 1,
  semester: 1,
  description: '',
  courseId: courseId,
});

const fetchSubjects = async () => {
  try {
    const response = await axios.get('http://localhost:3000/curriculum', {
      params: { courseId } // send the ID, not name
    });

    if (Array.isArray(response.data)) {
      subjects.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }
};

const editSubject = (subject: any) => {
  isEditing.value = true;
  currentEditingId.value = subject.id;
  newSubject.value = {
    name: subject.name,
    code: subject.code,
    lectureHours: subject.lectureHours,
    labHours: subject.labHours,
    year: subject.year,
    semester: subject.semester,
    description: subject.description,
    courseId: subject.course.id,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const saveSubject = async () => {
  try {
    const payload = {
      ...newSubject.value,
      courseId: courseId  // this is used by the backend to find the Course entity
    };

    if (isEditing.value && currentEditingId.value) {
      // PATCH request for editing
      await axios.patch(`http://localhost:3000/curriculum/${currentEditingId.value}`, payload);
    } else {
      // POST request for creating
      await axios.post('http://localhost:3000/curriculum', payload);
    }

    closeModal();
    fetchSubjects(); // refresh table
  } catch (error) {
    console.error('Error saving subject:', error);
    alert('Failed to save subject');
  }
};


// 1. This just opens the box
const confirmDelete = (id: number) => {
  subjectToDeleteId.value = id;
  showDeleteModal.value = true;
};

// 2. This actually talks to the backend
const executeDelete = async () => {
  if (subjectToDeleteId.value) {
    try {
      await axios.delete(`http://localhost:3000/curriculum/${subjectToDeleteId.value}`);
      showDeleteModal.value = false;
      subjectToDeleteId.value = null;
      fetchSubjects(); // Refresh the list
    } catch (error) {
      alert("Failed to delete subject.");
    }
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
.modal-content.large { width: 800px; max-height: 90vh; overflow-y: auto; }
.label { margin-top: 10px; font-weight: bold; color: #666; }
.form-row { display: flex; gap: 10px; margin-bottom: 15px;}
.form-row input, .form-row select { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #ddd;}
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
.form-input { width: 100%; padding: 10px 16px ; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ddd; box-sizing: border-box;}
.form-row { display: flex; gap: 10px; margin-bottom: 10px; }

.delete-modal {
  text-align: center;
  width: 350px !important;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.delete-modal h2 {
  color: #333;
  margin-bottom: 10px;
}

.delete-modal p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 25px;
  line-height: 1.4;
}

.confirm-delete-btn {
  background-color: #e74c3c; /* Red color for danger */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.confirm-delete-btn:hover {
  background-color: #c0392b;
}

.cancel-btn {
  background-color: #eee;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>