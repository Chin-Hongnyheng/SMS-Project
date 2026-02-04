import { createRouter, createWebHistory } from 'vue-router'
import CurriculumView from '../views/CurriculumView.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'
import StudentView from '../views/StudentView.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

// import StudentList from '../views/StudentList.vue'

const routes = [
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  // {
  //   path: '/dashboard',
  //   name: 'StudentDashboard',
  //   component: StudentDashboard
  // },
  // {
  //   path: '/dashboard',
  //   name: 'TeacherDashboard',
  //   component: TeacherDashboard
  // },
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
]

const router = createRouter({
  history: createWebHistory(),  
  routes
})

export default router
