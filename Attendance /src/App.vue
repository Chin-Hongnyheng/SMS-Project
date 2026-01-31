<script setup lang="ts">
  
  import { RouterView, RouterLink } from 'vue-router';
  import { ref } from 'vue';

  const fas = {
    house: 'house',
    academic: 'graduation-cap',
    admissions: 'building-columns',
    report: 'chart-simple',
    examination: 'clipboard-list',
    attendance: 'user-check',
    registration: 'user-plus',
    account: 'circle-user',
    transcript: 'rectangle-list',
    bar: 'bars',
    student: 'user-graduate',
    logout: 'angle-right',
    notification: 'bell',
    message: 'comment-dots',
  };

  const isCollapsed = ref(false);

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  }

</script>

<template>
    <div class="app-layout">
  
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar" :class="{ 'collasped': isCollapsed }">
      <div class="logo-section">
        <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
        <h2 v-if="!isCollapsed" class="logo-title">BATTAMBANG REGIONAL TRAINING CENTER</h2>
      </div>

      <nav class="menu">
        <RouterLink to="/" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.house" class="menu-icon"/>
          <span v-if="!isCollapsed">Dashboard</span>
        </RouterLink>

        <RouterLink to="/curriculum" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.academic" class="menu-icon"/>
          <span v-if="!isCollapsed">Academic</span>
        </RouterLink>

        <RouterLink to="/admission" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.admissions" class="menu-icon"/>
          <span v-if="!isCollapsed">Admission</span>
        </RouterLink>

        <RouterLink to="/student" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.student" class="menu-icon"/>
          <span v-if="!isCollapsed">Student</span>
        </RouterLink>

        <router-link to="/examination" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.examination" class="menu-icon"/>
          <span v-if="!isCollapsed">Examination</span>
        </router-link>

        <router-link to="/attendance" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.attendance" class="menu-icon"/>
          <span v-if="!isCollapsed">Attendance</span>
        </router-link>

        <router-link to="/transcript" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.transcript" class="menu-icon"/>
          <span v-if="!isCollapsed">Transcript</span>
        </router-link>

        <router-link to="/registration" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.registration" class="menu-icon"/>
          <span v-if="!isCollapsed">Registration</span>
        </router-link>

        <router-link to="/report" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.report" class="menu-icon"/>
          <span v-if="!isCollapsed">Report</span>
        </router-link>

        <router-link to="/account" class="menu-item" active-class="active">
          <font-awesome-icon :icon="fas.account" class="menu-icon"/>
          <span v-if="!isCollapsed">Account</span>
        </router-link>
      </nav>

      <button class="logout-btn">
        <span v-if="!isCollapsed">Logout</span>
        <font-awesome-icon :icon="fas.logout" class="menu-icon"/>
      </button>
    </aside>

    <div class="main-content">
      <!-- TOP SEARCH BAR -->
      <header class="top-bar">
        <div class="left-header">
          <button @click="toggleSidebar" class="toggle-btn">
            <font-awesome-icon :icon="fas.bar" class="menu-icon"/>
          </button>
          <div class="search-container">
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div class="top-icons">
          <span><font-awesome-icon :icon="fas.notification" class="top-bar-icon"/></span>
          <span><font-awesome-icon :icon="fas.message" class="top-bar-icon"/></span>
          <span><font-awesome-icon :icon="fas.account" class="top-bar-icon"/></span>
        </div>
      </header>

      <!-- Main Content -->
      <main class="page-content">
        <RouterView/>
      </main>
    </div>
  </div>    
</template>

<style scoped>
.app-layout {
  display: flex;
  width: 100vw;
  height: 150vh;
  overflow: hidden;
  background-color: #fcfaf6;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 280px;
  background-color: #5ba4d5;
  /* height: 100%; */
  color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: 25px;
  border-radius: 20px 20px 20px 20px;
  transition: width 0.3s ease;
  flex-shrink: 0;
  align-self: stretch;
}

.sidebar.collasped {
  width: 80px;
  padding: 20px 10px;
}
.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 80%;
  max-width: 120px;
  transition: width 0.3s ;
}

.logo-section h2 {
  font-size: 1.15rem;
  font-weight: bold;
  line-height: 1.2;
}

.icon-logo {
    width: 30px;
    margin-right: 15px
}
.menu {
  flex-grow: 1;
  margin-top: 10px;
}

.menu-item {
  color: white; 
  padding: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  transition: 0.3s;
  gap: 15px;
  white-space: nowrap; /* Prevent text wrap */
}

.sidebar.collasped .menu-item span {
  justify-content: center;
  gap: 0;
}

.menu-icon {
  font-size: 26px;
  flex-shrink: 0;
  object-fit: contain;
}

.active {
  background-color: #a0d2eb;
  color: black !important;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
}

.logout-btn {
  background-color: #a0d2eb;
  border: none;
  padding: 12px 15px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.15rem;
  text-align: center;
  color: black;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 30px;
  background-color: #fcfaf6;
}

.top-bar {
  height: 70px;
  width: 1150px;
  display: flex;
  padding: 0 30px;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 0px;
  flex-shrink: 0;
  z-index: 10;
}

.left-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #5ba4d5;
}

.top-bar-icon {
  font-size: 1.5rem;
  gap: 20px;
  cursor: pointer;
  color: #5ba4d5;
}

.search-container input {
  width: 800px;
  height: 40px;
  padding-left: 15px;
  border-radius: 10px;
  background-color: #efefef;
  border: none
}

.page-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 30px;
  background-color: #fcfaf6;
}

@media (max-width: 768px) {
  .sidebar:not(.collasped) {
    position: absolute;
    z-index: 100;
  }

  .search-container input {
    width: 300px;
  }
}

a {
  text-decoration: none;
  color: black;
}

/* This removes default gaps from all elements */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Ensure the layout takes the full screen */
body, html {
  width: 100%;
  height: 100%;
  background-color: #fcfaf6; /* Match your beige background */
}

</style>
