<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-8">Log in</h1>

      <div class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path
                  v-if="showPassword"
                  d="M14.95 14.95a7 7 0 01-9.9 0M3.5 10.5a8.38 8.38 0 0113 0M10 13a3 3 0 100-6 3 3 0 000 6z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-else
                  d="M10 13a3 3 0 100-6 3 3 0 000 6z M3.5 10.5a8.38 8.38 0 0113 0"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              v-model="rememberMe"
              class="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <label for="remember" class="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-700">
            Forgot your password?
          </a>
        </div>

        <button
          @click="handleLogin"
          class="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Login
        </button>

        <button
          @click="handleGoogleLogin"
          class="w-full border border-gray-300 bg-white text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="text-center text-sm text-gray-600 mt-6">
        Create a new account here
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const handleLogin = () => {
  console.log('Login submitted:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
  // Add your login logic here
}

const handleGoogleLogin = () => {
  console.log('Google login clicked')
  // Add Google OAuth logic here
}
</script>
