<template>
  <div class="detail-page">
    <button @click="$router.back()" class="back-btn">
      <font-awesome-icon :icon="fas.arrowLeft" /> Back
    </button>
    <div class="container">
      <div class="CourseNameHeader">
        <img :src="B1" alt="Course Image" class="course image" />
        <h1>{{ courseName }}</h1>
      </div>
      <div class="year bar container">Foundation Year</div>
      <div class="year bar container">Year 1</div>
      <div class="year bar container">Year 2</div>
      <div class="year bar container">Year 3</div>
      <div class="year bar container">Final Year</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const courseId = Number(route.params.id)
const courseName = ref('')

import B1 from '@/assets/B1.png'
import B2 from '@/assets/B2.png'
import B3 from '@/assets/B3.png'
import B4 from '@/assets/B4.png'
import B5 from '@/assets/B5.png'

const courses = {
  1: 'Bachelor degree in Nursing and Midwifery',
  2: 'Associate degree in Nurse',
  3: 'Continue Primary Nurse to Associate degree',
  4: 'Continue Primary Midwife to Associate degree',
  5: 'Continue Primary Nurse to Associate degree',
}

onMounted(() => {
  courseName.value = courses[courseId] || 'Unknown Course'
})

const fas = {
  arrowLeft: 'circle-arrow-left',
}
</script>

<style scoped>
.back-btn {
  cursor: pointer;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #5ba4d5;
  color: white;
  border: none;
  border-radius: 15px;
}
.container {
  background-color: white;
  border-radius: 15px;
  height: auto;
  padding: 20px;
}
.course.image {
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
}
.CourseNameHeader {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  justify-content: center;
  margin: 0 auto;
}
.year.bar.container {
  background-color: #f9f3ef;
  border-radius: 10px;
  padding-left: 30px;
  margin-top: 10px;
  height: 35px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
