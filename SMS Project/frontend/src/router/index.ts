import { createRouter, createWebHistory } from 'vue-router'
import CurriculumView from '../views/CurriculumView.vue'
import AttendanceView from '../views/AttendanceView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/attendance' },
    { path: '/home', name: 'home', component: HomeView },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: CurriculumView,
    },
    {
      path: '/curriculum/:id',
      name: 'course-details',
      component: () => import('../components/CourseDetailView.vue'),
    },
    {
      path: '/attendance',
      name: 'attendance',
      component: AttendanceView,
    },
    {
      path: '/attendance/check-in',
      name: 'attendance-check-in',
      component: () => import('../views/AttendanceCheckInView.vue'),
    },
  ],
})

export default router
