<template>
  <div class="account-page">
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
    </div>

    <div class="card profile-main-card">
      <div class="profile-flex">
        <div class="profile-image-wrapper">
          <div class="avatar-large">
            <img 
              v-if="userInfo[0]?.profileImage" 
              :src="getImageUrl(userInfo[0].profileImage)" 
              class="avatar-img" 
            />
            <span v-else>{{ username.charAt(0).toUpperCase() }}</span>
            
            <label for="profileUpload" class="pencil-badge">
              <span class="pencil-icon">✎</span>
              <input 
                type="file" 
                id="profileUpload" 
                hidden 
                accept="image/*" 
                @change="handleImageUpload" 
              />
            </label>
          </div>
        </div>

        <div class="profile-details">
          <h2 class="user-full-name">
            {{ userInfo[0]?.firstNameEn }} {{ userInfo[0]?.lastNameEn }}
          </h2>
          <p class="user-role-tag">{{ roles.join(', ') || 'User' }}</p>
          <p class="user-location-text">
            <span class="loc-icon">📍</span> {{ userInfo[0]?.province || 'Kandal' }}, Cambodia
          </p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="state-loader">
      <p>Loading profile...</p>
    </div>

    <template v-else-if="userInfo.length">
      <div class="card info-card-section">
        <div class="card-header">
          <h3>Personal Information</h3>
          <button class="btn-edit">Edit ✎</button>
        </div>
        
        <div class="info-grid">
          <div class="grid-item"><label>First Name (EN)</label><p>{{ userInfo[0].firstNameEn }}</p></div>
          <div class="grid-item"><label>Last Name (EN)</label><p>{{ userInfo[0].lastNameEn }}</p></div>
          <div class="grid-item"><label>Phone Number</label><p>{{ userInfo[0].phoneNumber }}</p></div>
          <div class="grid-item"><label>First Name (KH)</label><p>{{ userInfo[0].firstNameKh }}</p></div>
          <div class="grid-item"><label>Last Name (KH)</label><p>{{ userInfo[0].lastNameKh }}</p></div>
          <div class="grid-item"><label>Status</label><p class="status-active">{{ userInfo[0].status }}</p></div>
          <div class="grid-item"><label>Gender</label><p>{{ userInfo[0].gender }}</p></div>
          <div class="grid-item"><label>Race</label><p>{{ userInfo[0].race }}</p></div>
          <div class="grid-item"><label>Nationality</label><p>{{ userInfo[0].nationality }}</p></div>
          <div class="grid-item"><label>Date of Birth</label><p>{{ userInfo[0].dob }}</p></div>
          <div class="grid-item"><label>Year</label><p>{{ userInfo[0].year }}</p></div>
        </div>
      </div>

      <div class="card info-card-section">
        <div class="card-header">
          <h3>Location & Address</h3>
          <button class="btn-edit">Edit ✎</button>
        </div>
        <div class="info-grid">
          <div class="grid-item"><label>Province</label><p>{{ userInfo[0].province }}</p></div>
          <div class="grid-item"><label>District</label><p>{{ userInfo[0].district }}</p></div>
          <div class="grid-item"><label>Commune</label><p>{{ userInfo[0].commune }}</p></div>
          <div class="grid-item"><label>Village</label><p>{{ userInfo[0].village }}</p></div>
          <div class="grid-item full-width">
            <label>Current Address</label>
            <p>{{ userInfo[0].address }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const username = ref('Guest')
const roles = ref<string[]>([])
const userId = ref<number | null>(null)
const userInfo = ref<any[]>([])
const loading = ref(true)

// Helper to construct image URL
const getImageUrl = (path: string) => {
  if (!path) return '';
  // If it's a base64 preview, return as is. Otherwise, append backend host.
  if (path.startsWith('data:image')) return path;
  return `http://localhost:3002${path}`;
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];

  // 1. UI Preview (instant)
  const reader = new FileReader();
  reader.onload = (e) => {
    if (userInfo.value[0]) {
      userInfo.value[0].profileImage = e.target?.result as string;
    }
  };
  reader.readAsDataURL(file);

  // 2. Upload to Backend
  const formData = new FormData();
  formData.append('files', file); // Matches your FilesInterceptor('files')

  try {
    const token = sessionStorage.getItem('token');
    const res = await axios.patch(`http://localhost:3002/user-info/user/${userId.value}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    // 3. Update state with the path saved in DB
    // Assuming your backend returns the updated user object
    if (res.data && res.data.profileImage) {
      userInfo.value[0].profileImage = res.data.profileImage;
      console.log("Profile image updated in database.");
    }
  } catch (err) {
    console.error('Database update failed:', err);
    alert('Failed to save image to database.');
  }
};

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) { loading.value = false; return; }
  const payload = parseJwt(token)
  if (!payload) { loading.value = false; return; }
  
  username.value = payload.username || 'Guest'
  roles.value = Array.isArray(payload.roles) ? payload.roles : []
  userId.value = payload.sub || null

  if (userId.value !== null) {
    try {
      const res = await axios.get(`http://localhost:3002/user-info/user/${userId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      userInfo.value = Array.isArray(res.data) ? res.data : [res.data]
    } catch (err) {
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.account-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 60px;
  font-family: 'Nunito', sans-serif;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

.profile-image-wrapper {
  position: relative;
}

.avatar-large {
  position: relative;
  width: 150px;
  height: 150px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 800;
  color: #94a3b8;
  border: 5px solid #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.pencil-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #f97316;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.pencil-icon {
  font-size: 20px;
}

.pencil-badge:hover {
  background: #ea580c;
  transform: scale(1.1);
}

.profile-flex { display: flex; align-items: center; gap: 40px; }
.user-full-name { font-size: 2rem; font-weight: 800; margin: 0; color: #1e293b; }
.user-role-tag { color: #64748b; font-weight: 700; font-size: 1.1rem; margin: 5px 0; }
.user-location-text { color: #94a3b8; font-weight: 600; font-size: 1rem; }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 20px; }
.grid-item label { display: block; font-size: 0.85rem; color: #94a3b8; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; }
.grid-item p { margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; }
.full-width { grid-column: span 3; }
.status-active { color: #10b981; }

.btn-edit {
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.3s;
}

.btn-edit:hover { background: #ea580c; }

.state-loader {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  font-weight: 700;
}
</style>