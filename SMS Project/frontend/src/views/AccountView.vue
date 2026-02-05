<template>
  <div class="account-view">
    <h1>Welcome, {{ username }}!</h1>
    <p>User ID: {{ userId !== null ? userId : 'Guest' }}</p>
    <p v-if="roles.length">
      Role: <strong>{{ roles.join(', ') }}</strong>
    </p>
    <p v-else>Role: Guest</p>

    <div v-if="loading">
      <p>Loading user info...</p>
    </div>

    <div v-else-if="userInfo.length > 0">
      <h2>Your Personal Info</h2>
      <div v-for="(info, index) in userInfo" :key="index" class="user-info-card">
        <ul>
          <li><strong>First Name (EN):</strong> {{ info.firstNameEn }}</li>
          <li><strong>Last Name (EN):</strong> {{ info.lastNameEn }}</li>
          <li><strong>First Name (KH):</strong> {{ info.firstNameKh }}</li>
          <li><strong>Last Name (KH):</strong> {{ info.lastNameKh }}</li>
          <li><strong>Status:</strong> {{ info.status }}</li>
          <li><strong>Gender:</strong> {{ info.gender }}</li>
          <li><strong>Race:</strong> {{ info.race }}</li>
          <li><strong>Nationality:</strong> {{ info.nationality }}</li>
          <li><strong>DOB:</strong> {{ info.dob }}</li>
          <li>
            <strong>Address:</strong>
            {{ info.village }}, {{ info.commune }}, {{ info.district }}, {{ info.province }}, {{ info.address }}
          </li>
          <li><strong>Year:</strong> {{ info.year }}</li>
        </ul>
      </div>
    </div>

    <div v-else>
      <p>No user info found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Decode JWT to extract payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

const username = ref('Guest')
const roles = ref<string[]>([])
const userId = ref<number | null>(null)
const userInfo = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    loading.value = false
    return
  }

  const payload = parseJwt(token)
  if (!payload) {
    loading.value = false
    return
  }

  username.value = payload.username || 'Guest'
  roles.value = Array.isArray(payload.roles) ? payload.roles : []
  userId.value = payload.sub || null

  if (userId.value !== null) {
    try {
      const res = await axios.get(`http://localhost:3002/user-info/user/${userId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Ensure the response is always an array for v-for
      userInfo.value = Array.isArray(res.data) ? res.data : [res.data]
      console.log('Fetched user info:', userInfo.value)
    } catch (err) {
      console.error('Error fetching user info:', err)
      userInfo.value = []
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.account-view {
  padding: 20px;
  font-family: 'Nunito', sans-serif;
}

h1 {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 10px;
}

.user-info-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 6px;
}

a {
  color: #3490dc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
