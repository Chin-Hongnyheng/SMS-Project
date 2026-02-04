import { createRouter, createWebHistory } from 'vue-router'
import CurriculumView from '../views/CurriculumView.vue'

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
      component: CurriculumView
    },
    {
      path: '/curriculum/:id',
      name: 'course-details',
      component: () => import('../components/CourseDetailView.vue')
    },
    {
      path: '/curriculum/subject/:id',
      name: 'subject-detail',
      component: () => import('../components/SubjectDetailView.vue')
    }
  ]
})

export default router