<template>
  <div class="app-container">
    <main class="main-content">
      <section class="content-body">
        <h1 class="page-title">Study Curriculum</h1>
        <h2 class="section-subtitle">Courses Available</h2>

        <!-- COURSE CARDS GRID -->
        <div class="course-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <div class="course-icon-bg">
              <img :src="course.icon" alt="icon" />
            </div>
            <div class="course-info">
              <p class="course-name">{{ course.name }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import B1 from '@/assets/B1.png';
import B2 from '@/assets/B2.png';
import B3 from '@/assets/B3.png';
import B4 from '@/assets/B4.png';
import B5 from '@/assets/B5.png';

const courses = ref([
  { id: 1, name: 'Bachelor degree in Nursing and Midwifery', icon: B1},
  { id: 2, name: 'Associate degree in Nurse', icon: B2 },
  { id: 3, name: 'Continue Primary Nurse to Associate degree', icon: B3 },
  { id: 4, name: 'Continue Primary Midwife to Associate degree', icon: B4 },
  { id: 5, name: 'Continue Primary Nurse to Associate degree', icon: B5 },
]);
</script>

<style scoped>
.app-container {
  display: flex;
  height: 150vh;
  background-color: #fcfaf6;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 280px;
  background-color: #5ba4d5;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 25px;
  border-radius: 20px 20px 20px 20px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 140px;
  margin-bottom: 10px;
}

.logo-section h2 {
  font-size: 1.15rem;
  font-weight: bold;
  line-height: 1.2;
}

.icon-logo {
    width: 30px;
    margin-right: 15px
}
.menu {
  flex-grow: 1;
}

.menu-item {
  color: white; 
  padding: 12px 15px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  transition: 0.3s;
  gap: 16px;
}

.menu-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  object-fit: contain;
}

.menu-item.active {
  background-color: #a0d2eb;
  color: black !important;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
}

/* .menu-item.active a {
  color: black;
  text-decoration: none;
} */

.logout-btn {
  background-color: #a0d2eb;
  border: none;
  padding: 12px 15px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.15rem;
  text-align: center;
  color: black;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.search-container input {
  width: 800px;
  background-color: #efefef;
  border: none
}

a {
  text-decoration: none;
  color: black;
}

</style>
