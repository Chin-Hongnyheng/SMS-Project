<template>
    <!-- don't draw unitul the data is ready -->
  <div class="detail-page" v-if="subject">
    <button @click="$router.back()" class="back-btn">
      <font-awesome-icon :icon="['fas', 'circle-arrow-left']" /> Back
    </button>
    
    <div class="header">
      <h1>{{ subject.name }} ({{ subject.code }})</h1>
      <div class="progress-section">
         <span>Your Progress: {{ completion }}%</span>
         <div class="progress-bar"><div :class="statusClass" :style="{ width: completion + '%' }"></div></div>
      </div>
    </div>

    <!-- Tab Navigation -->
     <div class="tabs">
      <button @click="activeTab = 'info'" :class="{ active: activeTab === 'info' }">Course Info</button>
      <button @click="activeTab = 'lectures'" :class="{ active: activeTab === 'lectures' }">Lectures</button>
      <button @click="activeTab = 'assignments'" :class="{ active: activeTab === 'assignments' }">Assignments</button>
      <button @click="activeTab = 'announcements'" :class="{ active: activeTab === 'announcements' }">Announcements</button>
    </div>

    <!-- TAB CONTENT -->
    <div class="tab-content">
      
      <!-- 1. COURSE INFO TAB -->
      <div v-if="activeTab === 'info'" class="card">
        <div v-if="!isEnrolled" class="alert-box">
       ⚠️ You are not enrolled in this course. Please contact the registrar.
        </div>

        <div v-else class="content-grid">
          <div class="description-card">
            <h3>Course Description</h3>
            <!-- Markdown Renderer -->
            <MdPreview :modelValue="subject.description || '*No description provided.*'" />
          </div>

          <div class="assignments-card">
            <h3>Assignments</h3>
            <ul>
                <li>Midterm Project (Pending)</li>
                <li>Lab Report #1 (Completed ✅)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 2. LECTURES TAB -->
      <div v-if="activeTab === 'lectures'">
        <div class="tab-header">
           <h3>Lecture Notes</h3>
           <button v-if="userRole === 'teacher'" @click="openLectureModal" class="add-btn">+ Add Lecture</button>
          <div v-if="showLectureModal" class="modal-overlay">
            <div class="modal-content">
              <h2>Add New Lecture</h2>
              <input v-model="lectureTitle" placeholder="Lecture Title" class="form-input" />
              
              <!-- FILE INPUT -->
              <input type="file" @change="handleFileChange" class="form-input" />

              <div class="modal-actions">
                <button @click="showLectureModal = false" class="cancel-btn">Cancel</button>
                <button @click="uploadLecture" class="save-btn">Upload</button>
              </div>
            </div>
          </div>
        </div>
        <div v-for="lec in subject.lectures" :key="lec.id" class="item-row">
          <div class="lec-info">
            <font-awesome-icon :icon="['fas', 'file-pdf']" class="file-icon" />
            <span>{{ lec.title }}</span>
          </div>
            <button @click="viewFile(lec.fileUrl)" class="view-btn">View</button>
           
        </div>
      </div>

      <!-- 3. ASSIGNMENTS TAB -->
      <div v-if="activeTab === 'assignments'">
        <div class="tab-header">
           <h3>Course Assignments</h3>
           <button v-if="userRole === 'teacher'" @click="openAssignModal" class="add-btn">+ Create Assignment</button>
        </div>
        <div v-for="asg in subject.assignments" :key="asg.id" class="item-row">
           <div>
             <strong>{{ asg.title }}</strong>
             <p class="due-date">Due: {{ formatDate(asg.dueDate) }}</p>
           </div>
           <button v-if="userRole === 'student'" class="submit-btn">Submit Work</button>
        </div>
      </div>
  </div>
  </div>
  <!-- add loading message -->
   <div v-else class="loading-container">
    <p>Loading...</p>
   </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash, faCircleArrowLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const subjectId = route.params.id;

// Define subject variable
const subject = ref(null);
const isEnrolled = ref(true); // Logic for Student Service later
const completion = ref(55); // Dummy data for now
const lectureTitle = ref('');
const selectedFile = ref(null);
const showLectureModal = ref(false);
const viewFile = (filePath) => {
  if (!filePath) return;
  const backendUrl = "http://localhost:3000";
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  window.open(`${backendUrl}${cleanPath}`, '_blank');
};

const openLectureModal = () => {
  lectureTitle.value = '';
  selectedFile.value = null;
  showLectureModal.value = true;
};

const openAssignModal = () => {
  alert("Assignment modal feature coming soon!");
};

const formatDate = (dateString) => {
  if(!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString();
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadLecture = async () => {
  if (!selectedFile.value || !lectureTitle.value) {
    alert("Please provide a title and a file");
    return;
  }

  const formData = new FormData();
  formData.append('title', lectureTitle.value);
  formData.append('file', selectedFile.value);
  
  try {
    await axios.post(`http://localhost:3000/curriculum/${subjectId}/lecture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert("Upload successful!");
    showLectureModal.value = false;
    fetchSubjectDetails();
  }catch(error) {
    console.error("Upload failed", error.response?.data);
    alert("Upload failed: "+ (error.response?.data?.message || "Unknown error"));
  }
}

// Fetch data from backend
const fetchSubjectDetails = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/curriculum/${subjectId}`);
        subject.value = response.data;
    }catch(error) {
        console.error("Error loading subject: ", error);
    }
};

onMounted(() => {
    fetchSubjectDetails();
})

const statusClass = computed(() => {
  if (completion.value < 50) return 'progress-low';
  return 'progress-high';
});

const activeTab = ref('info');
const userRole = ref('teacher'); // Toggle to 'student' to test

// Form data for adding items
const showContentModal = ref(false);
const newItem = ref({
  type: '', // 'lecture', 'assignment', or 'announcement'
  title: '',
  content: '',
  date: ''
});

const saveTeacherInput = async () => {
  try {
    const endpoint = `http://localhost:3000/${newItem.value.type}`;
    await axios.post(endpoint, {
      ...newItem.value,
      subjectId: subjectId // Link to current subject
    });
    fetchSubjectDetails(); // Refresh everything
    showContentModal.value = false;
  } catch (error) {
    alert("Error saving data");
  }
};
</script>

<style scoped>
.detail-page {
    padding: 25px;
}
.progress-bar { width: 100%; background: #eee; height: 10px; border-radius: 5px; margin-top: 5px; }
.progress-high { background: #4caf50; height: 100%; border-radius: 5px; }
.progress-low { background: #ff9800; height: 100%; border-radius: 5px; }
.alert-box { background: #fff3cd; color: #856404; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: center; font-weight: bold; }
.content-grid { display: grid; grid-template-rows: auto; gap: 20px; margin-top: 20px; }
.description-card, .assignments-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
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

.tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  color: #888;
}

.tabs button.active {
  color: #5ba4d5;
  border-bottom: 3px solid #5ba4d5;
}

.item-row {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.due-date {
  font-size: 0.8rem;
  color: #e74c3c;
  margin: 0;
}
/* Modal Overlay - Dark background */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* High z-index to be on top */
}

/* Modal Content Box */
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.form-input {
  width: 90%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: block;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background-color: #5ba4d5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #eee;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.add-btn {
  background-color: #5ba4d5;
  color: white;
  border: none;
  padding: 15px 15px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}
.lec-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  color: #e74c3c; /* PDF Red color */
  font-size: 1.2rem;
}

.view-btn {
  background-color: #f0f4f8;
  color: #5ba4d5;
  border: 1px solid #5ba4d5;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s; 
}

.view-btn:hover {
  background-color: #5ba4d5;
  color: white;
}
</style>