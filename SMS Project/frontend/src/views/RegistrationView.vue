<template>
    <div class="page-content">
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
</template>
<script setup>
import { ref } from 'vue'
import { useCourseStore } from '@/stores/counter'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import CourseComponent from '@/components/CourseComponent.vue'
import UploadComponent from '@/components/UploadComponent.vue'

// ----- STORE -----
const courseStore = useCourseStore()
courseStore.fetchCourses() // fetch courses

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

// ----- METHODS -----
const selectCourse = (courseId) => {
  selectedCourseId.value = courseId
  showCourseError.value = false // clear error glow
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
  // reset child invalid fields
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

  // payload for submission
  const payload = {
    courseId: selectedCourseId.value,
    registrationForm: registrationForm.value,
    files: uploadedFiles.value
  }

  console.log('Submitting registration:', payload)
  alert('Registration submitted successfully!')
}
</script>

<style scoped>
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