<script setup lang="ts">
defineProps<{ isCollapsed: boolean }>()
</script>

<template>
  <aside class="sidebar" :class="{ collasped: isCollapsed }">
    <div class="logo-section">
      <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
      <h2 v-if="!isCollapsed" class="logo-title">BATTAMBANG REGIONAL TRAINING CENTER</h2>
    </div>

    <nav class="menu">
      <RouterLink to="/" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'house']" class="menu-icon" />
        <span v-if="!isCollapsed">Dashboard</span>
      </RouterLink>

      <RouterLink to="/curriculum" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'graduation-cap']" class="menu-icon" />
        <span v-if="!isCollapsed">Academic</span>
      </RouterLink>

      <RouterLink to="/admission" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'building-columns']" class="menu-icon" />
        <span v-if="!isCollapsed">Admission</span>
      </RouterLink>

      <RouterLink to="/student" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'user-graduate']" class="menu-icon" />
        <span v-if="!isCollapsed">Student</span>
      </RouterLink>

      <RouterLink to="/examination" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'clipboard-list']" class="menu-icon" />
        <span v-if="!isCollapsed">Examination</span>
      </RouterLink>

      <RouterLink to="/attendance" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'user-check']" class="menu-icon" />
        <span v-if="!isCollapsed">Attendance</span>
      </RouterLink>

      <RouterLink to="/transcript" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'rectangle-list']" class="menu-icon" />
        <span v-if="!isCollapsed">Transcript</span>
      </RouterLink>

      <RouterLink to="/registration" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'user-plus']" class="menu-icon" />
        <span v-if="!isCollapsed">Registration</span>
      </RouterLink>

      <RouterLink to="/report" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'chart-simple']" class="menu-icon" />
        <span v-if="!isCollapsed">Report</span>
      </RouterLink>

      <RouterLink to="/account" class="menu-item" active-class="active">
        <font-awesome-icon :icon="['fas', 'circle-user']" class="menu-icon" />
        <span v-if="!isCollapsed">Account</span>
      </RouterLink>
    </nav>

    <button class="logout-btn">
      <span v-if="!isCollapsed">Logout</span>
      <font-awesome-icon :icon="['fas', 'angle-right']" class="menu-icon" />
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #5ba4d5;
  height: 120%;
  color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: 25px;
  border-radius: 20px;
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
  transition: width 0.3s;
}

.logo-title {
  font-size: 1.15rem;
  font-weight: bold;
  line-height: 1.2;
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
  white-space: nowrap;
}

.sidebar.collasped .menu-item {
  justify-content: center;
}

.menu-icon {
  font-size: 26px;
  flex-shrink: 0;
  object-fit: contain;
}

.menu-item.active,
.menu-item.active:hover {
  background-color: #a0d2eb;
  color: black;
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

@media (max-width: 768px) {
  .sidebar:not(.collasped) {
    position: absolute;
    z-index: 100;
  }
}
</style>
