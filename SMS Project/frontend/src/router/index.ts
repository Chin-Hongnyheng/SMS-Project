// 1. Add this import line
import { createRouter, createWebHistory } from 'vue-router'
import CurriculumView from '../views/CurriculumView.vue'

const router = createRouter({
  // Use createWebHistory() for clean URLs (like /curriculum)
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
    // You can add more routes here later
  ]
})

// 2. Add this export line so the rest of the app can find the router
export default router