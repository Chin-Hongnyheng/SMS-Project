<template>
  <div class="academic-container">
  <section class="content-body">
    <div class="courseOption-container">
          <span class="course-title">Course Available</span>
          <div class="courseOption-container-inner">
            <CourseComponent 
              v-for="course in courseStore.courses"
              :key="course.id"
              :courseId="course.id"
              :courseName="course.courseName"
              :image="'http://localhost:3000/uploads/courses/' + course.image"
              @click.native="() => navigateToCourse(course.id)"
            />
          </div>
    </div>
  </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CourseComponent from '@/components/CourseComponent.vue'
import { useCourseStore } from '@/stores/counter'

const router = useRouter();
const navigateToCourse = (id) => {
  router.push({ path: `/academic/${id}` });
}
// ----- STORE -----
const courseStore = useCourseStore()
courseStore.fetchCourses()


</script>

<style scoped>
 .academic-container {
  width: 100%;
  margin: 0 auto;
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
    min-width: 500px;
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
.courseOption-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    margin: 30px;
    font-family: 'Nunito';
    justify-content: center;
}
.course-title{
    font-size: 48px;
    font-weight: 900;
    color: rgb(94, 171, 214);
    margin-top:20px;
}
.courseOption-container-inner{
    display:flex;
    flex-wrap: wrap;
    padding: 30px;
    gap: 70px;
    align-items: center;
    justify-content: center;
}
</style>
