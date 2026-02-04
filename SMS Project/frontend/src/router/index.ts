import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: () => import('../views/CurriculumView.vue'),
    },
    {
      path: '/curriculum/:id',
      name: 'course-details',
      component: () => import('../views/CourseDetailView.vue'),
    },
    {
      path: '/examination',
      name: 'examination',
      component: () => import('../views/OverallExamView.vue'),
    },
    {
      path: '/exam-types',
      name: 'exam-types',
      component: () => import('../views/ExamTypeView.vue'),
    },
    {
      path: '/exam-schedules',
      name: 'exam-schedules',
      component: () => import('../views/ExamScheduleView.vue'),
    },
    {
      path: '/exam-results',
      name: 'exam-results',
      component: () => import('../views/ExamResultView.vue'),
    },
  ],
})

export default router
