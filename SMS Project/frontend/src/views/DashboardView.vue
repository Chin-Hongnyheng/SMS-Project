<template>
  <div>
    <h1>Welcome, {{ username }}!</h1>
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

const username = ref('Guest')
const roles = ref<string[]>([])

onMounted(() => {
  username.value = sessionStorage.getItem('username') || 'Guest'

  const storedRoles = sessionStorage.getItem('roles')
  roles.value = storedRoles ? JSON.parse(storedRoles) : []

  console.log('Dashboard username:', username.value)
  console.log('Dashboard roles:', roles.value)
})
</script>

