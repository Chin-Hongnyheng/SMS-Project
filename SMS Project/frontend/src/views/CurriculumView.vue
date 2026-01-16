<template>
  <section class="content-body">
    <h1 class="page-title">Study Curriculum</h1>
    <h2 class="section-subtitle">Courses Available</h2>

    <!-- COURSE CARDS GRID -->
    <div class="course-grid">
      <div 
        v-for="course in courses" 
        :key="course.id" 
        class="course-card"
        @click="navigateToCourse(course.id)">
        <div class="course-icon-bg">
          <img :src="course.icon" alt="icon" />
        </div>
        <div class="course-info">
          <p class="course-name">{{ course.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const navigateToCourse = (id) => {
  router.push({ path: `/curriculum/${id}` });
}

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
 .page-title {
   font-size: 28px;
   font-weight: bold;
   margin-bottom: 10px;
 }
  .section-subtitle {
    font-size: 25px;
    color: #555;
    margin-bottom: 20px;
    text-align: center;
  }
  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 2fr));
    gap: 20px;
  }
  .course-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    transition: transform 0.2s;
    cursor: pointer;
  }
  .course-card:last-child {
    grid-column: span 2/span 1;
    justify-self: center;
  }
  .course-card:hover {
    transform: translateY(-5px);
  }
  .course-icon-bg {
    background-color: #f0f4f8;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
  }
  .course-icon-bg img {
    width: 50px;
    height: 50px;
  }
  .course-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

</style>
