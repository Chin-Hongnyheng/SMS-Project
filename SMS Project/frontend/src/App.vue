<script setup lang="ts">
  import homeIcon from '@/assets/Home.png';
  import admissionIcon from '@/assets/Admission.png';
  import studentIcon from '@/assets/Student.png';
  import academicIcon from '@/assets/Academic1.png';
  import examinationIcon from '@/assets/Examination.png';
  import attendanceIcon from '@/assets/Attendance.png';
  import transcriptIcon from '@/assets/Transcript.png';
  import registrationIcon from '@/assets/Registration.png';
  import reportIcon from '@/assets/Report.png';
  import accountIcon from '@/assets/Account.png';
  import logoutIcon from '@/assets/Logout.png';
  import notificationIcon from '@/assets/Notification.png';
  import messageIcon from '@/assets/Chat.png';
  import userIcon from '@/assets/Profile.png';

</script>

<template>
  <router-view />
    <div class="app-container">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="logo-section">
        <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
        <h2 class="logo-title">BATTAMBANG REGIONAL TRAINING CENTER</h2>
      </div>

      <nav class="menu">
        <div class="menu-item">
          <img :src="homeIcon" alt="Home Icon" class="menu-icon"/>
          Dashboard
        </div>
        <div class="menu-item"><img :src="admissionIcon" alt="Admission Icon" class="menu-icon"/> Admission</div>
        <div class="menu-item"><img :src="studentIcon" alt="Student Icon" class="menu-icon"/> Student</div>
        <router-link to="/curriculum" class="menu-item">
          <img :src="academicIcon" alt="Academic Icon" class="menu-icon"/> Academic
        </router-link> 
        <div class="menu-item"><img :src="examinationIcon" alt="Examination Icon" class="menu-icon"/> Examination</div>
        <div class="menu-item"><img :src="attendanceIcon" alt="Attendance Icon" class="menu-icon"/> Attendance</div>
        <div class="menu-item"><img :src="transcriptIcon" alt="Transcript Icon" class="menu-icon"/> Transcript</div>
        <div class="menu-item"><img :src="registrationIcon" alt="Registration Icon" class="menu-icon"/> Registration</div>
        <div class="menu-item"><img :src="reportIcon" alt="Report Icon" class="menu-icon"/> Report</div>
        <div class="menu-item"><img :src="accountIcon" alt="Account Icon" class="menu-icon"/> Account</div>
      </nav>

      <button class="logout-btn">Log Out <img :src="logoutIcon" alt="Logout Icon" class="menu-icon"/></button>
    </aside>

    <main class="main-content">
      <!-- TOP SEARCH BAR -->
      <header class="top-bar">
        <div class="search-container">
          <input type="text" placeholder="Search" />
        </div>
        <div class="top-icons">
          <span><img :src="notificationIcon" alt="Notification Icon" class="top-bar-icon"/></span>
          <span><img :src="messageIcon" alt="Message Icon" class="top-bar-icon"/></span>
          <span><img :src="userIcon" alt="User Icon" class="top-bar-icon"/></span>
        </div>
      </header>
    </main>
  </div>

  <!-- 2. MAIN CONTENT AREA -->
    
</template>

<style scoped>
.app-container {
  display: flex;
  height: 150vh;
  background-color: #fcfaf6;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 280px;
  background-color: #5ba4d5;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 25px;
  border-radius: 20px 20px 20px 20px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 140px;
  margin-bottom: 10px;
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
}

.menu-item {
  color: white; 
  padding: 12px 15px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  transition: 0.3s;
  gap: 16px;
}

.menu-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  object-fit: contain;
}

.menu-item.active {
  background-color: #a0d2eb;
  color: black !important;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
}

/* .menu-item.active a {
  color: black;
  text-decoration: none;
} */

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
  padding: 30px;
  overflow-y: auto;
}

.top-bar {
  width: 1100px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 40px;
}

.top-bar-icon {
  width: 28px;
  height: 28px;
  gap: 50px;
  cursor: pointer;
}

.search-container input {
  width: 800px;
  height: 40px;
  padding-left: 15px;
  border-radius: 10px;
  background-color: #efefef;
  border: none
}

a {
  text-decoration: none;
  color: black;
}

</style>
