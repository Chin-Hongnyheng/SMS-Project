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
const isEnrolled = ref(true); // Logic for your Student Service later
const completion = ref(55); // Dummy data for now

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
</style>