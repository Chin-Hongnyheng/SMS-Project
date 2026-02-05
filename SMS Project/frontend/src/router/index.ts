import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true, roles: ['Student', 'Teacher', 'Admin'] },
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/admission',
      name: 'admission',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/AdmissionView.vue'),
    },
    {
      path: '/student',
      name: 'student',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/StudentView.vue'),
    },
    {
      path: '/academic',
      name: 'academic',
      meta: { requiresAuth: true, roles: ['Student', 'Teacher', 'Admin'] },
      component: () => import('../views/AcademicView.vue'),
    },
    {
      path: '/curriculum/:id',
      name: 'course-details',
      component: () => import('../components/CourseDetailComponent.vue'),
    },
    {
      path: '/curriculum/subject/:id',
      name: 'subject-detail',
      component: () => import('../components/SubjectDetailComponent.vue'),
    },
    {
      path: '/examination',
      name: 'examination',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/ExaminationView.vue'),
    },
    {
      path: '/exam-types',
      name: 'exam-types',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/ExamTypeView.vue'),
    },
    {
      path: '/exam-schedules',
      name: 'exam-schedules',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/ExamScheduleView.vue'),
    },
    {
      path: '/exam-results',
      name: 'exam-results',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/ExamResultView.vue'),
    },
    {
      path: '/attendance',
      name: 'attendance',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin'] },
      component: () => import('../views/AttendanceView.vue'),
    },
    {
      path: '/transcript',
      name: 'transcript',
      meta: { requiresAuth: true, roles: ['Student', 'Teacher', 'Admin'] },
      component: () => import('../views/TranscriptView.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      meta: { requiresAuth: true, roles: ['Student'] },
      component: () => import('../views/RegistrationView.vue'),
    },
    {
      path: '/report',
      name: 'report',
      meta: { requiresAuth: true, roles: ['Teacher', 'Admin', 'Student'] },
      component: () => import('../views/ReportView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      meta: { requiresAuth: true, roles: ['Student', 'Teacher', 'Admin'] },
      component: () => import('../views/AccountView.vue'),
    },
  ],
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const roles: string[] = JSON.parse(sessionStorage.getItem('roles') || '[]')
  const normalizedRoles = roles.map(r => r.toLowerCase())

  if (to.meta.requiresAuth) {
    if (!token) return next('/login')

    if (to.meta.roles) {
      const allowedRoles = (to.meta.roles as string[]).map(r => r.toLowerCase())
      const hasAccess = normalizedRoles.some(r => allowedRoles.includes(r))
      if (!hasAccess) return next('/login')
    }
  }
  next()
})
export default router
