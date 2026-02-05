<template>
  <div class="registration-container">
    <div class="title">
      <span class="registration-title">Exam Registration Form</span>
      <span class="registration-option">
        Please fill out our application sections of this form
      </span>
      <span class="registration-type">(For Undergraduate Entrance Exam)</span>
    </div>

    <div class="registration-container-inner">
      <div class="content-container">

        <!-- English Name -->
        <span class="header-title-english">
          Name <span class="required">*</span>
        </span>
        <div class="english-name">
          <span class="header-title-english">
            FullName (in English) <span class="required">*</span>
          </span>
          <input
            type="text"
            v-model="form.firstNameEn"
            placeholder="First name"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.firstNameEn }"
            :style="{ width: props.isCollapsed ? '600px' : '527px' }"
          />
          <input
            type="text"
            v-model="form.lastNameEn"
            placeholder="Last name"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.lastNameEn }"
            :style="{ width: props.isCollapsed ? '655px' : '522px' }"
          />
        </div>

        <!-- Khmer Name -->
        <div class="khmer-name">
          <span class="header-title-khmer">
            ឈ្មោះ​(ជាអក្សរខ្មែរ) <span class="required">*</span>
          </span>
          <input
            type="text"
            v-model="form.firstNameKh"
            placeholder="នាមត្រកូល"
            class="filling-name-khmer"
            :class="{ 'invalid-field': invalidFields.firstNameKh }"
            :style="{ width: props.isCollapsed ? '600px' : '562px' }"
          />
          <input
            type="text"
            v-model="form.lastNameKh"
            placeholder="នាមខ្លួន"
            class="filling-name-khmer"
            :class="{ 'invalid-field': invalidFields.lastNameKh }"
            :style="{ width: props.isCollapsed ? '727px' : '562px' }"
          />
        </div>

        <!-- Status & Gender -->
        <div class="status-gender">
          <div class="status">
            <span class="header-title-english">Status <span class="required">*</span></span>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.status }">
              <input type="radio" value="Single" v-model="form.status"/>
              <span>Single</span>
            </label>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.status }">
              <input type="radio" value="Married" v-model="form.status" />
              <span>Married</span>
            </label>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.status }">
              <input type="radio" value="Relationship" v-model="form.status" />
              <span>Relationship</span>
            </label>
          </div>

          <div class="gender">
            <span class="header-title-english">Gender <span class="required">*</span></span>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.gender }">
              <input type="radio" value="Male" v-model="form.gender" :style="{ width: props.isCollapsed ? '600px' : '497px' }" />
              <span>Male</span>
            </label>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.gender }">
              <input type="radio" value="Female" v-model="form.gender" :style="{ width: props.isCollapsed ? '600px' : '497px' }" />
              <span>Female</span>
            </label>
            <label class="option-box" :class="{ 'invalid-field': invalidFields.gender }">
              <input type="radio" value="Others" v-model="form.gender" :style="{ width: props.isCollapsed ? '600px' : '497px' }" />
              <span>Others</span>
            </label>
          </div>
        </div>

        <!-- Race & Nationality -->
        <div class="inner-content">
          <span class="header-title-english">Race <span class="required">*</span></span>
          <input
            type="text"
            placeholder="From"
            v-model="form.race"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.race }"
            :style="{ width: props.isCollapsed ? '600px' : '562px' }"
          />

          <span class="header-title-english">Nationality <span class="required">*</span></span>
          <input
            type="text"
            placeholder="From"
            v-model="form.nationality"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.nationality }"
            :style="{ width: props.isCollapsed ? '725px' : '557px' }"
          />
        </div>

        <!-- DOB & Email -->
        <div class="inner-content">
          <span class="header-title-english">Date of Birth <span class="required">*</span></span>
          <input
            type="text"
            v-model="form.dob"
            class="filling-name date-input"
            placeholder="MM/DD/YYYY"
            :class="{ 'invalid-field': invalidFields.dob }"
            :style="{ width: props.isCollapsed ? '600px' : '497px' }"
            ref="dobInput"
          />

          <span class="header-title-english">Email <span class="required">*</span></span>
          <input
            type="text"
            v-model="form.email"
            placeholder="student@gmail.com"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.email }"
            :style="{ width: props.isCollapsed ? '690px' : '587px' }"
          />
        </div>

        <!-- Place of Birth -->
        <span class="header-title-english">Place of Birth <span class="required">*</span></span>
        <div class="inner-content">
          <span class="header-title-english">Village <span class="header-title-khmer">ភូមិ ​​​</span><span class="required">*</span></span>
          <input
            type="text"
            v-model="form.village"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.village }"
            :style="{ width: props.isCollapsed ? '600px' : '497px' }"
          />

          <span class="header-title-english">Commune <span class="header-title-khmer">(ឃុំ/សង្កាត់​)</span><span class="required">*</span></span>
          <input
            type="text"
            v-model="form.commune"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.commune }"
            :style="{ width: props.isCollapsed ? '592px' : '482px' }"
          />
        </div>

        <div class="inner-content">
          <span class="header-title-english">District <span class="header-title-khmer">(ស្រុក/ខណ្ឌ) ​</span><span class="required">*</span></span>
          <input
            type="text"
            v-model="form.district"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.district }"
            :style="{ width: props.isCollapsed ? '500px' : '307px' }"
          />

          <span class="header-title-english">Province/City <span class="header-title-khmer"> (ខេត្ត/ក្រុង) </span><span class="required">*</span></span>
          <input
            type="text"
            v-model="form.province"
            class="filling-name"
            :class="{ 'invalid-field': invalidFields.province }"
            :style="{ width: props.isCollapsed ? '595px' : '577px' }"
          />
        </div>

        <!-- Current Address -->
        <div class="inner-content">
          <span class="header-title-english">Current Address <span class="required">*</span></span>
          <textarea
            class="address"
            v-model="form.address"
            placeholder="Home address"
            :class="{ 'invalid-field': invalidFields.address }"
            :style="{ width: props.isCollapsed ? '1407px' : '1197px' }"
          ></textarea>
        </div>

        <!-- Note -->
        <div class="note-container">
          <span class="note">Note: </span>
          <span class="note">
            All personal information provided must be true, complete and accurate, and must match official
            documents. Providing false or misleading information may result disqualifications from entrance exam.
            Once the registrations is submitted, changes may not be allow. Please review all details carefully
            before confirming your submission.
          </span>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

// Emit event to parent when form updates
const emit = defineEmits(['update:form'])

// Props
const props = defineProps({ isCollapsed: Boolean })

// Form state
const form = ref({
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

// Track which fields are invalid
const invalidFields = ref<Record<string, boolean>>({})

// Track if user has tried to submit (for UX)
const submitted = ref(false)

// Watch form changes and emit to parent
watch(
  form,
  (newForm) => {
    emit('update:form', newForm)

    // Live clear invalid field glow as soon as user types/selects
    Object.keys(invalidFields.value).forEach((key) => {
      const value = newForm[key as keyof typeof newForm]
      if (value && value.toString().trim() !== '') {
        invalidFields.value[key] = false
      }
    })
    console.log('Form updated:', newForm)
  },
  { deep: true }
)


// Flatpickr for DOB
const dobInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
  if (dobInput.value) {
    const fp = flatpickr(dobInput.value, {
      dateFormat: 'm/d/Y',
      allowInput: true
    })
    dobInput.value.addEventListener('dblclick', () => fp.close())
  }
})

// Validation function
const validateForm = () => {
  const requiredFields = [
    'firstNameEn',
    'lastNameEn',
    'firstNameKh',
    'lastNameKh',
    'status',
    'gender',
    'race',
    'nationality',
    'dob',
    'email',
    'village',
    'commune',
    'district',
    'province',
    'address'
  ]

  const newInvalidFields: Record<string, boolean> = {}

  requiredFields.forEach((field) => {
    const value = form.value[field as keyof typeof form.value]
    if (!value || value.toString().trim() === '') {
      newInvalidFields[field] = true
    }
  })

  invalidFields.value = newInvalidFields

  // Return true if form is valid
  return Object.keys(newInvalidFields).length === 0
}

// Call this when user clicks Submit
const submitForm = () => {
  submitted.value = true // mark that user tried submitting
  const isValid = validateForm()
  if (!isValid) {
    alert('Please fill out all required fields!')
  } else {
    alert('Form submitted successfully!')
    // Do actual submission here
  }
}

// Expose validateForm for parent components
defineExpose({ validateForm, submitForm })
</script>

<style>
.invalid-field {
  border-color: red !important;
  box-shadow: 0 0 5px 2px rgba(255, 0, 0, 0.5);
}

.flatpickr-calendar {
  font-family: 'Nunito';
  font-size: 16px;
  font-weight: 900;
}

.flatpickr-day {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 900;
}

.note-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note {
  font-family: 'Nunito';
  color: red;
  font-weight: 900;
  font-size: 16px;
}

.english-name,
.khmer-name {
  display: flex;
  gap: 60px;
  align-items: center;
  justify-items: center;
  flex-wrap: wrap;
  row-gap: 12px;
}

.registration-container {
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  margin: 30px;
  align-items: center;
  font-family: 'Nunito';
  width: 100%;
  box-sizing: border-box;
}

.registration-container-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.registration-title {
  font-size: 64px;
  font-weight: 900;
  color: rgb(94, 171, 214);
}

.status.invalid-field,
.gender.invalid-field {
  border: 2px solid red;
  border-radius: 12px;
  box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.6);
  padding: 10px;
}

.registration-option {
  font-size: 28px;
  font-weight: 600;
  color: rgb(165, 164, 170);
}

.registration-type {
  font-size: 20px;
  font-weight: 400;
  color: rgb(165, 164, 170);
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.content-container {
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}

.header-title-english {
  font-family: 'Nunito';
  font-size: 20px;
  font-weight: 900;
}

.header-title-khmer {
  font-family: 'Battambang';
  font-size: 18px;
  font-weight: 900;
}

.required {
  color: red;
}

.filling-name,
.filling-name-khmer {
  width: 497px;
  height: 38px;
  border-radius: 10px;
  border: 2px solid rgb(250, 244, 241);
  font-family: 'Nunito';
  font-weight: 400;
  font-size: 16px;
  outline: none;
  color: rgb(165, 164, 170);
  padding-left: 16px;
  transition: all 0.3s ease;
  background-color: #fff;
  max-width: 100%;
  box-sizing: border-box;
}

.filling-name-khmer {
  font-family: 'Battambang';
  font-size: 14px;
}

.filling-name:focus,
.filling-name-khmer:focus {
  border-color: rgb(94, 171, 214);
  background-color: rgba(94, 171, 214, 0.05);
  box-shadow: 0 0 0 2px rgba(94, 171, 214, 0.2);
}

.filling-name:hover,
.filling-name-khmer:hover {
  border-color: rgb(94, 171, 214);
}

.filling-name.invalid-field,
.filling-name-khmer.invalid-field,
.address.invalid-field {
  border: 2px solid red !important;
  box-shadow: 0 0 6px 2px rgba(255, 0, 0, 0.6) !important;
}

.status.invalid-field,
.gender.invalid-field {
  border: 2px solid red;
  border-radius: 12px;
  box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.6);
  padding: 10px;
}

.address {
  width: 1297px;
  height: 138px;
  border-radius: 10px;
  border: 2px solid rgb(250, 244, 241);
  font-family: 'Nunito';
  font-size: 16px;
  color: rgb(165, 164, 170);
  padding: 12px 14px;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
  background-color: #fff;
  max-width: 100%;
  box-sizing: border-box;
}

.address:focus {
  border-color: rgb(94, 171, 214);
  background-color: rgba(94, 171, 214, 0.05);
  box-shadow: 0 0 0 2px rgba(94, 171, 214, 0.2);
}

.address:active {
  border-color: rgb(94, 171, 214);
}

.status,
.gender {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
  flex-wrap: wrap;
  row-gap: 12px;
}

.option-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 40px;
  border: 2px solid rgb(250, 244, 241);
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-weight: 600;
  color: rgb(165, 164, 170);
  transition: all 0.2s ease;
}

.option-box input {
  display: none;
}

.option-box:has(input:checked) {
  border-color: rgb(94, 171, 214);
  background-color: rgba(94, 171, 214, 0.1);
  color: rgb(94, 171, 214);
}

.option-box:hover {
  border-color: rgb(94, 171, 214);
}

.date-input {
  width: 497px;
  height: 38px;
  border-radius: 10px;
  border: 2px solid rgb(250, 244, 241);
  font-family: 'Nunito';
  font-size: 16px;
  color: rgb(165, 164, 170);
  padding: 0 12px;
  cursor: pointer;
  max-width: 100%;
  box-sizing: border-box;
}

.date-input:focus {
  border-color: rgb(94, 171, 214);
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(60%) sepia(20%) saturate(300%) hue-rotate(170deg);
  cursor: pointer;
}

.date-input::-webkit-datetime-edit {
  color: transparent; /* hides the default MM/DD/YYYY */
}

.date-input:focus::-webkit-datetime-edit {
  color: rgb(165, 164, 170); /* shows typed or selected value */
}

input[type="date"] {
  font-family: 'Nunito';
  font-size: 16px;
}

.status-gender {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
  row-gap: 16px;
}

.inner-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  row-gap: 12px;
}

.option-box.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
