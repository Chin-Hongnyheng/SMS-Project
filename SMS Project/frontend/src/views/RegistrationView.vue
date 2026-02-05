<template>
  <div class="page-content">
    <Transition name="fade">
      <div v-if="statusMessage" :class="['status-label', statusType]">
        <span class="status-icon">{{ statusType === 'success' ? '✅' : '❌' }}</span>
        {{ statusMessage }}
      </div>
    </Transition>

    <div v-if="loading">
      <p>Checking your registration...</p>
    </div>

    <div v-else>
      <div v-if="userInfoExists" class="already-registered-card">
        <div class="success-icon-wrapper">
          <span class="check-icon">✓</span>
        </div>
        <h2 class="registered-title">Registration Complete</h2>
        <p class="registered-text">
          You have already completed your registration. Your profile is now active, 
          and you cannot register again at this time.
        </p>
        <button class="view-profile-btn" @click="$router.push('/account')">
          View My Profile
        </button>
      </div>

      <div v-else>
        <RegistrationComponent v-model:form="registrationForm" ref="registrationFormRef" :isCollapsed="false"/>
        
        <div class="courseOption-container">
          <span class="course-title">Course</span>
          <div class="courseOption-container-inner">
            <CourseComponent 
              v-for="course in courseStore.courses"
              :key="course.id"
              :courseId="course.id"
              :courseName="course.courseName"
              :image="'http://localhost:3000/uploads/courses/' + course.image"
              :isActive="selectedCourseId === course.id"
              :isInvalid="showCourseError && selectedCourseId === null"
              @select="selectCourse"
            />
          </div>
        </div>

        <UploadComponent v-model:files="uploadedFiles" :isInvalid="showUploadError" />

        <div class="button-container">
          <button class="cancel-button" @click="cancel">Cancel</button>
          <button class="submit-button" @click="submit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '@/stores/counter'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import CourseComponent from '@/components/CourseComponent.vue'
import UploadComponent from '@/components/UploadComponent.vue'
import axios from 'axios'

// ----- STORE -----
const courseStore = useCourseStore()
courseStore.fetchCourses()

// ----- NOTIFICATION STATE -----
const statusMessage = ref('')
const statusType = ref('success') // 'success' or 'error'

// Helper to show label
const showNotification = (message, type = 'success') => {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// ----- FORM STATE -----
const registrationForm = ref({
  firstNameEn: '', lastNameEn: '', firstNameKh: '', lastNameKh: '',
  status: '', gender: '', race: '', nationality: '', dob: '',
  phoneNumber: '', village: '', commune: '', district: '',
  province: '', address: ''
})

const uploadedFiles = ref([])
const selectedCourseId = ref(null)
const showCourseError = ref(false)
const registrationFormRef = ref(null)
const showUploadError = ref(false)
const userInfoExists = ref(false)
const loading = ref(true)
const userId = ref(null)

function parseJwt(token) {
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
  userId.value = payload.sub || null

  if (userId.value !== null) {
    try {
      const res = await axios.get(`http://localhost:3002/user-info/user/${userId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      userInfoExists.value = !!res.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        userInfoExists.value = false;
      }
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false
  }
})

const selectCourse = (courseId) => {
  selectedCourseId.value = courseId
  showCourseError.value = false
}

const cancel = () => {
  registrationForm.value = {
    firstNameEn: '', lastNameEn: '', firstNameKh: '', lastNameKh: '',
    status: '', gender: '', race: '', nationality: '', dob: '',
    phoneNumber: '', village: '', commune: '', district: '',
    province: '', address: ''
  }
  uploadedFiles.value = []
  selectedCourseId.value = null
  showCourseError.value = false
  showNotification('Form reset cleared', 'success')
}

const submit = async () => {
  const isFormValid = registrationFormRef.value?.validateForm()

  if (!isFormValid || !selectedCourseId.value || uploadedFiles.value.length === 0) {
    showNotification('Please fill all fields, select a course and upload files!', 'error')
    return
  }

  const token = sessionStorage.getItem('token')
  const formData = new FormData()

  Object.entries(registrationForm.value).forEach(([key, value]) => {
    formData.append(key, value)
  })

  formData.append('userId', userId.value)
  formData.append('courseId', selectedCourseId.value)
  uploadedFiles.value.forEach(file => {
    formData.append('files', file)
  })

  try {
    await axios.post('http://localhost:3002/user-info', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    showNotification('Registration submitted successfully!', 'success')
    userInfoExists.value = true
  } catch (err) {
    console.error(err)
    showNotification('Failed to submit registration.', 'error')
  }
}
</script>

<style scoped>
.already-registered-card {
  background: white;
  max-width: 600px;
  margin: 100px auto;
  padding: 50px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  font-family: 'Nunito', sans-serif;
  border: 1px solid #f0f0f0;
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #00ff2a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
  font-size: 40px;
  box-shadow: 0 8px 20px rgba(0, 255, 42, 0.3);
}

.registered-title {
  font-size: 32px;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 15px;
}

.registered-text {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 30px;
}

.view-profile-btn {
  background-color: rgb(94, 171, 214);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-profile-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(94, 171, 214, 0.4);
}
.status-label {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 18px 30px;
  border-radius: 15px;
  z-index: 1000;
  font-family: 'Nunito';
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  transition: all 0.4s ease;
}
.success { background-color: #00ff2a; color: #004d0c; border: 2px solid white; }
.error { background-color: #ff0000; color: white; border: 2px solid white; }

.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(50px); }

.page-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}
.registration-container-outer{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}
.course-title{
    font-size: 64px;
    font-weight: 900;
    color: rgb(94, 171, 214);
}
.courseOption-container-inner{
    display:flex;
    flex-wrap: wrap;
    padding: 30px;
    gap: 70px;
    align-items: center;
    justify-content: center;
}
.courseOption-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    margin: 30px;
    font-family: 'Nunito';
    justify-content: center;
}
.button-container{
    display:flex;
    flex-direction: row;
    align-items: center;
    margin: 20px;
    font-family: 'Nunito';
    justify-content: center;
    height:77px;
    gap: 293px;
}
.cancel-button{
    font-family: 'Nunito';
    font-size: 1.2vw;
    color: white;
    font-weight: bold;
    background-color: #ff0000;
    border: 2px solid white;
    border-radius: 10px;
    width: 20%;
    height: 100%;  
    cursor: pointer;
    transition: all 0.3s ease;
}
.submit-button{
    font-family: 'Nunito';
    font-size: 1.2vw;
    color: white;
    font-weight: bold;
    background-color: #00ff2a;
    border: 2px solid white;
    border-radius: 10px;
    width: 20%;
    height: 100%;  
    cursor: pointer;
    transition: all 0.3s ease;
}
.cancel-button:hover{
    color: #ff0000;
    border-color: #ff0000;
    background-color: white;
}
.submit-button:hover{
    color: #00ff2a;
    border-color: #00ff2a;
    background-color: white;
}
</style>