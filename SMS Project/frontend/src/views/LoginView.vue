<template>
  <div class="login-page">
    <div class="login-container">
      <div class="left-login-container">
        <div class="inner-left-login-container">
          <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
          <span class="greeting-style-text">Greeting Fellow Student!</span>
          <span class="account-style-text">Don't have an account?</span>
          <button class="register-button" @click="goToRegister">
            Register
          </button>
        </div>
      </div>
      <div class="right-login-container">
        <span class="login-style-text">Login</span>
        <div class="input-container">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="input-style"
          />
          <FontAwesomeIcon :icon="faUserIcon" class="input-icon" />
        </div>
        <div class="input-container">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="input-style"
          />
          <FontAwesomeIcon
            :icon="faLockIcon"
            class="input-icon"
            @click="showPassword = !showPassword"
          />
        </div>
        <button class="login-button" @click="login">Login</button>
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

      <div v-if="modal.show" class="modal-overlay">
        <div class="modal-box">
          <!-- Close button -->
          <button class="close-button" @click="handleClose">×</button>

          <!-- Message -->
          <p :class="modal.type === 'success' ? 'success-text' : 'error-text'">
            {{ modal.message }}
          </p>

          <!-- OK button -->
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
import { ref } from "vue";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const faUserIcon = faUser;
const faLockIcon = faLock;

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const modal = ref<{
  show: boolean;
  type: "success" | "error";
  message: string;
}>({
  show: false,
  type: "success",
  message: "",
});

const goToRegister = () => {
  router.push("/register");
};

const login = async () => {
  // ✅ Clear old session before login
  sessionStorage.clear();

  if (!username.value || !password.value) {
    modal.value = {
      show: true,
      type: "error",
      message: "All fields are required",
    };
    return;
  }

  try {
    const res = await axios.post("http://localhost:3001/auth/login", {
      username: username.value,
      password: password.value,
    });

    const { accessToken, refreshToken } = res.data;

    // Store tokens
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    // Decode JWT payload
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    console.log("JWT Payload:", payload);

    // ✅ Store username
    sessionStorage.setItem("username", payload.username || username.value);
    console.log("Logged in username:", sessionStorage.getItem("username"));

    // ✅ Store user ID for result queries
    sessionStorage.setItem("userId", String(payload.sub || ""));
    console.log("Logged in user ID:", sessionStorage.getItem("userId"));

    let roles: string[] = [];

    if (Array.isArray(payload.roles)) {
      roles = payload.roles.map((r: string) => r.toLowerCase());
    } else if (typeof payload.roles === "string") {
      roles = [payload.roles.toLowerCase()];
    }

    // Store roles
    sessionStorage.setItem("roles", JSON.stringify(roles));
    console.log("Logged in user roles:", roles);

    modal.value = { show: true, type: "success", message: "Login successful!" };
  } catch (err: any) {
    console.error(err);
    modal.value = {
      show: true,
      type: "error",
      message: "Invalid username or password",
    };
  }
};

const handleOk = () => {
  if (modal.value.type === "success") {
    router.replace("/dashboard").then(() => {
      window.location.reload();
    });
  } else {
    modal.value.show = false;
  }
};

const handleClose = () => {
  modal.value.show = false;
};
</script>

<style>
html,
body {
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
  background-color: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
  font-family: "Nunito";
  margin-bottom: 20px;
  font-size: 20px;
}
.success-text {
  color: #2ecc71;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: "Nunito";
  font-size: 20px;
}
.ok-button {
  padding: 8px 30px;
  border-radius: 8px;
  background: #5ba4d5;
  color: white;
  border: none;
  cursor: pointer;
  font-family: "Nunito";
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}

.ok-success:hover {
  background-color: #2ecc71;
  transform: scale(1.05);
}
.ok-error:hover {
  background-color: #e74c3c;
  transform: scale(1.05);
}
.input-container {
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
.input-style:focus {
  border-color: rgb(94, 171, 214);
  box-shadow: 0 0 0 2px rgba(94, 171, 214, 0.2);
}
.input-style {
  font-family: "Nunito";
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
.left-login-container {
  height: 100%;
  width: 50%;
  border: 1px solid #5ba4d5;
  background-color: #5ba4d5;
  border-top-right-radius: 150px;
  border-bottom-right-radius: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner-left-login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px;
}
.right-login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  gap: 40px;
}
.login-style-text {
  font-family: "Nunito";
  font-size: 40px;
  font-weight: 900;
}
.logo-img {
  width: 217px;
  height: 217px;
  transition: width 0.3s;
}
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(159, 159, 159, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.login-container {
  background-color: white;
  border: 1px solid white;
  border-radius: 20px;
  width: 60%;
  height: 60%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.greeting-style-text {
  font-family: "Nunito";
  font-weight: 900;
  font-size: 40px;
  color: white;
}
.account-style-text {
  font-family: "Nunito";
  font-weight: 400;
  font-size: 18px;
  color: white;
}
.register-button {
  font-family: "Nunito";
  font-size: 1.2vw;
  color: white;
  font-weight: bold;
  background-color: #5ba4d5;
  border: 2px solid white;
  border-radius: 1vw;
  width: 50%;
  max-width: 226px;
  height: 66px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.register-button:hover {
  color: #5ba4d5;
  border-color: #5ba4d5;
  background-color: white;
}
.login-button {
  font-family: "Nunito";
  font-size: 1.2vw;
  color: white;
  font-weight: bold;
  background-color: #5ba4d5;
  border: 2px solid white;
  border-radius: 10px;
  width: 82%;
  height: 10%;
  cursor: pointer;
  transition: all 0.3s ease;
}
.login-button:hover {
  color: #5ba4d5;
  border-color: #5ba4d5;
  background-color: white;
}
</style>
