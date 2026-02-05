<template>
  <div>
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
import { ref, onMounted } from 'vue'

// Function to decode JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch (err) {
    return null
  }
}

const username = ref('Guest')
const roles = ref<string[]>([])
const userId = ref<number | null>(null)

onMounted(() => {
  // ✅ Make sure access token is stored in sessionStorage
  const token = sessionStorage.getItem('token') // same key you used in loginView
  if (token) {
    const payload = parseJwt(token)
    if (payload) {
      username.value = payload.username || 'Guest'
      roles.value = payload.roles || []
      userId.value = payload.sub || null // ← this is the user ID
    }
  }

  console.log('Dashboard username:', username.value)
  console.log('Dashboard roles:', roles.value)
  console.log('Dashboard userId:', userId.value)
})
</script>
