<template>
  <div class="page-content">
    <div v-if="loading">
      <p>Checking your registration...</p>
    </div>

    <div v-else>
      <!-- Already registered -->
      <div v-if="userInfoExists">
        <p>You have already completed your registration. You cannot register again.</p>
      </div>

      <!-- Show registration form if no record -->
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

// ----- STATE -----
const registrationForm = ref({
  firstNameEn: '',
  lastNameEn: '',
  firstNameKh: '',
  lastNameKh: '',
  status: '',
  gender: '',
  race: '',
  nationality: '',
  dob: '',
  email: '',
  village: '',
  commune: '',
  district: '',
  province: '',
  address: ''
})

const uploadedFiles = ref([])
const selectedCourseId = ref(null)
const showCourseError = ref(false)
const registrationFormRef = ref(null)
const showUploadError = ref(false)
const userInfoExists = ref(false)
const loading = ref(true)
const userId = ref(null)

// ----- JWT Parse Function -----
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

// ----- ON MOUNT -----
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

  userId.value = payload.sub || null

  if (userId.value !== null) {
    try {
        const res = await axios.get(`http://localhost:3002/user-info/user/${userId.value}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // user-info exists → block registration
            userInfoExists.value = !!res.data;
        } catch (err) {
        if (err.response && err.response.status === 404) {
            // user-info does NOT exist → allow registration
            userInfoExists.value = false;
        } else {
            console.error('Error fetching user info:', err);
        }
        } finally {
            loading.value = false;
        }
  } else {
    loading.value = false
  }
})

// ----- METHODS -----
const selectCourse = (courseId) => {
  selectedCourseId.value = courseId
  showCourseError.value = false
}

const cancel = () => {
  registrationForm.value = {
    firstNameEn: '',
    lastNameEn: '',
    firstNameKh: '',
    lastNameKh: '',
    status: '',
    gender: '',
    race: '',
    nationality: '',
    dob: '',
    email: '',
    village: '',
    commune: '',
    district: '',
    province: '',
    address: ''
  }
  uploadedFiles.value = []
  selectedCourseId.value = null
  showCourseError.value = false
  registrationFormRef.value && registrationFormRef.value.validateForm()
}

const submit = () => {
  const isFormValid = registrationFormRef.value?.validateForm()
  let isCourseValid = true

  if (!selectedCourseId.value) {
    showCourseError.value = true
    isCourseValid = false
  }

  if (uploadedFiles.value.length === 0) {
    showUploadError.value = true
  } else {
    showUploadError.value = false
  }

  if (!isFormValid || !isCourseValid || uploadedFiles.value.length === 0) {
    alert('Please fill out all required fields, select a course, and upload files!')
    return
  }

  const payload = {
    courseId: selectedCourseId.value,
    registrationForm: registrationForm.value,
    files: uploadedFiles.value
  }

  console.log('Submitting registration:', payload)
  alert('Registration submitted successfully!')
}
</script>
