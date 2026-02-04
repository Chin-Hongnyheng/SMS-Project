import { createRouter, createWebHistory } from 'vue-router'
import CurriculumView from '../views/CurriculumView.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import StudentView from '../views/StudentView.vue'
// import StudentList from '../views/StudentList.vue'


const router = createRouter({
  history: createWebHistory(),  
  routes: [
    {
      path: '/',
      redirect: '/admin'         
    },
    {
      path: '/admin',
      name: 'StudentDashboard',
      component: StudentDashboard
    },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: CurriculumView
    },
    {
      path: '/curriculum/:id',
      name: 'course-details',
      component: () => import('../views/CourseDetailView.vue')
    },
    {
      path: '/student',
      name: 'student',
      component: StudentView
    }
  ]
})

export default router
