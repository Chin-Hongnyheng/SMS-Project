<template>
  <div class="register-page">
    <div class="register-container">
        <div class="left-register-container">
            <span class="register-style-text">Register</span>
            <div class="input-container">
                <input v-model="username" type="text" placeholder="Username" class="input-style"/>
                <FontAwesomeIcon :icon="faUserIcon" class="input-icon"/>
            </div>
            <div class="input-container">
                <input v-model="email" type="text" placeholder="Email" class="input-style"/>
                <FontAwesomeIcon :icon="faEnvelopeIcon" class="input-icon"/>
            </div>
            <div class="input-container">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" class="input-style"/>
                <FontAwesomeIcon :icon="faLockIcon" class="input-icon" @click="showPassword = !showPassword"/>
            </div>
            <div class="input-container">
                <input v-model="confirm_password" :type="showPassword ? 'text' : 'password'" placeholder="Confirm Password" class="input-style"/>
                <FontAwesomeIcon :icon="faLockIcon" class="input-icon" @click="showPassword = !showPassword"/>
            </div>
            <button class="register-button" @click="handleRegister">Register</button>
        </div>
        <div class="right-register-container">
            <div class="inner-right-register-container">
                <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
                <span class="greeting-style-text">Greeting Fellow Student!</span>
                <span class="account-style-text">Join us for better future at RTC</span>
            </div>
        </div>

        <div v-if="modal.show" class="modal-overlay">
            <div class="modal-box">
                <!-- Close button -->
                <button class="close-button" @click="handleClose">×</button>

                <p :class="modal.type === 'success' ? 'success-text' : 'error-text'">
                {{ modal.message }}
                </p>

                <button
                class="ok-button"
                :class="modal.type === 'success' ? 'ok-success' : 'ok-error'"
                @click="handleOk"
                >
                OK
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const faUserIcon = faUser
const faLockIcon = faLock
const faEnvelopeIcon = faEnvelope

const username = ref('')
const password = ref('')
const email = ref('')
const confirm_password = ref('')

const showPassword = ref(false)

const modal = ref<{
  show: boolean
  type: 'success' | 'error'
  message: string
}>({
  show: false,
  type: 'success',
  message: '',
})

const handleRegister = async () => {
  // validation
  if (!username.value || !email.value || !password.value || !confirm_password.value) {
    modal.value = {
      show: true,
      type: 'error',
      message: 'All fields are required',
    }
    return
  }

  if (password.value !== confirm_password.value) {
    modal.value = {
      show: true,
      type: 'error',
      message: 'Passwords do not match',
    }
    return
  }

  try {
    await axios.post('http://localhost:3001/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirm_password.value,
    })

    modal.value = {
      show: true,
      type: 'success',
      message: 'Registration successful!',
    }
  } catch (err: any) {
    modal.value = {
      show: true,
      type: 'error',
      message: err.response?.data?.message || 'Registration failed',
    }
  }
}

const handleOk = () => {
  if (modal.value.type === 'success') {
    router.replace('/login')
  } else {
    modal.value.show = false
  }
}
const handleClose = () => {
  modal.value.show = false;
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  position: relative;
  background-color: white;
  padding: 30px 20px 20px 20px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;           
  height: 30px;         
  border-radius: 50%;  
  border: 1px solid transparent; 
  background-color: transparent;
  color: #999;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;          
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: #ffffff;
  background-color: #5ba4d5;
  border: 1px solid #5ba4d5;
}

.error-text {
  color: #e74c3c;
  font-weight: 900;
  font-family: 'Nunito';
  margin-bottom: 20px;
  font-size: 20px;
}
.success-text {
  color: #2ecc71;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'Nunito';
  font-size: 20px;
}
.ok-button {
  padding: 8px 30px;
  border-radius: 8px;
  background: #5ba4d5;
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Nunito';
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}

.ok-success:hover {
  background-color: #2ecc71;
  transform: scale(1.05);
}

/* error = red */
.ok-error:hover {
  background-color: #e74c3c;
  transform: scale(1.05);
}
.input-container{
    width: 100%;
    height: 5%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 10px 0;
}
.input-icon {
    position: absolute;
    right: 70px;  
    top: 50%;
    transform: translateY(-50%); 
    font-size: 24px;
    color: #5ba4d5;
    cursor: pointer;
    pointer-events: auto;
}
.input-style{
    font-family: 'Nunito';
    font-size: 20px;
    color: rgb(0, 0, 0);
    font-weight: bold;
    border: 1px solid #5ba4d5;
    width: 70%;
    height: 100%;
    outline: none;
    padding: 10px 40px 10px 20px;
    border-radius: 10px;
}
.input-style:focus{
    border-color: rgb(94, 171, 214);
    box-shadow: 0 0 0 2px rgba(94, 171, 214, 0.2);
}
.right-register-container{
    height: 100%;
    width: 50%;
    border: 1px solid #5ba4d5;
    background-color: #5ba4d5;
    border-top-left-radius: 150px;
    border-bottom-left-radius: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.inner-right-register-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height:100%;
    gap: 10px;
}
.left-register-container{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    gap:40px;
}
.register-style-text{
    font-family: 'Nunito';
    font-size: 40px;
    font-weight: 900;
}
.logo-img {
  width: 217px;
  height:217px;
  transition: width 0.3s ;
}
.register-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(159, 159, 159, 0.6); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.register-container{
    background-color: white;
    border: 1px solid white;
    border-radius:20px;
    width: 60%;
    height:70%;
    display:flex;
    flex-direction: row;
    overflow: hidden;
}
.greeting-style-text{
    font-family: 'Nunito';
    font-weight: 900;
    font-size:40px;
    color: white;
}
.account-style-text{
    font-family: 'Nunito';
    font-weight: 400;
    font-size:18px;
    color:white;
}
.register-button{
    font-family: 'Nunito';
    font-size: 1.2vw;
    color: white;
    font-weight: bold;
    background-color: #5ba4d5;
    border: 2px solid white;
    border-radius: 10px;
    width: 82%;
    height: 10%  ;  
    cursor: pointer;
    transition: all 0.3s ease;
}
.register-button:hover{
    color: #5ba4d5;
    border-color: #5ba4d5;
    background-color: white;
}
</style>
