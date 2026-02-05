<template>
  <AdminDashboard v-if="dashboardType === 'admin'" />
  <TeacherDashboard v-else-if="dashboardType === 'teacher'" />
  <StudentDashboard v-else-if="dashboardType === 'student'" />
  <div v-else class="fallback">
    <h1>Welcome, {{ username }}!</h1>
    <p>User ID: {{ userId !== null ? userId : 'Guest' }}</p>
    <p v-if="roles.length">
      Role:
      <strong>{{ roles.join(', ') }}</strong>
    </p>
    <p v-else>
      Role: Guest
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import AdminDashboard from './AdminDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'
import StudentDashboard from './StudentDashboard.vue'

const roles = ref<string[]>([])
const username = ref('Guest')
const userId = ref<number | null>(null)

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch (err) {
    return null
  }
}

onMounted(() => {
  const token = sessionStorage.getItem('token')
  if (token) {
    const payload = parseJwt(token)
    if (payload) {
      username.value = payload.username || 'Guest'
      roles.value = payload.roles || []
      userId.value = payload.sub || null
    }
  }
})

const dashboardType = computed(() => {
  const normalizedRoles = roles.value.map((r) => r.toLowerCase())
  if (normalizedRoles.includes('admin')) return 'admin'
  if (normalizedRoles.includes('teacher')) return 'teacher'
  if (normalizedRoles.includes('student')) return 'student'
  return 'guest'
})
</script>

<style scoped>
.fallback {
  padding: 20px;
}
</style>
