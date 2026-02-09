<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo Section -->
    <div class="logo-section">
      <img src="@/assets/logortc.png" alt="RTC Logo" class="logo-img" />
      <span v-if="!isCollapsed">BATTAMBANG REGIONAL TRAINING CENTER</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="menu">
      <RouterLink
        v-for="item in filteredNavItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ navigate }"
      >
        <div
          class="menu-item"
          :class="{ active: isNavActive(item.path) }"
          @click="navigate"
        >
          <font-awesome-icon :icon="item.icon" class="menu-icon" />
          <span v-if="!isCollapsed" class="navigation-title">
            {{ item.title }}
          </span>
        </div>
      </RouterLink>
    </nav>

    <!-- Logout Button -->
    <button class="logout-btn" @click="logout">
      <font-awesome-icon :icon="fas.logout" class="menu-icon" />
      <span v-if="!isCollapsed" class="navigation-title">Logout</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const router = useRouter();

defineProps<{ isCollapsed: boolean }>();

const fas = {
  house: "house",
  academic: "graduation-cap",
  admissions: "building-columns",
  report: "chart-simple",
  examination: "clipboard-list",
  attendance: "user-check",
  registration: "user-plus",
  account: "circle-user",
  transcript: "rectangle-list",
  student: "user-graduate",
  logout: "angle-right",
  myExams: "file-lines",
};

const route = useRoute();
const isNavActive = (path: string) => {
  // Academic should stay active for curriculum & subject pages
  if (path === "/academic") {
    return route.path === "/academic" || route.path.startsWith("/curriculum");
  }

  // Normal behavior for other menu items
  return route.path.startsWith(path);
};

const navItems = [
  { path: '/dashboard', title: 'Dashboard', icon: fas.house, roles: ['Admin', 'Teacher', 'Student'] },
  { path: '/student', title: 'Student', icon: fas.student, roles: ['Admin', 'Teacher'] },
  { path: '/academic', title: 'Academic', icon: fas.academic, roles: ['Admin', 'Teacher', 'Student'] },
  { path: '/examination', title: 'Examination', icon: fas.examination, roles: ['Admin', 'Teacher', 'Student'] },
  { path: '/attendance', title: 'Attendance', icon: fas.attendance, roles: ['Admin', 'Teacher'] },
  { path: '/registration', title: 'Registration', icon: fas.registration, roles: ['Student'] },
  { path: '/account', title: 'Account', icon: fas.account, roles: ['Admin', 'Teacher', 'Student'] },
]

// Get user roles from sessionStorage
const rawUserRoles: string[] = JSON.parse(
  sessionStorage.getItem("roles") || "[]",
);

//hello

// Normalize user roles (case-insensitive)
const userRoles = rawUserRoles.map((role) => role.toLowerCase());

// Filter nav items based on role (case-insensitive)
const filteredNavItems = computed(() =>
  navItems.filter((item) =>
    item.roles.some((role) => userRoles.includes(role.toLowerCase())),
  ),
);

// Logout function
const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("roles");
  router.replace("/login");
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #5ba4d5;
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

.sidebar.collapsed {
  width: 80px;
  padding: 20px 10px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 30px;
  gap: 15px;
}

.logo-img {
  width: 80%;
  max-width: 120px;
  transition: width 0.3s;
}

.menu {
  flex-grow: 1;
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
  font-weight: 900;
  text-decoration: none;
}

.menu-icon {
  font-size: 26px;
}

.active {
  background-color: #a0d2eb;
  color: black !important;
  border-radius: 10px;
  font-weight: 900;
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
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>
