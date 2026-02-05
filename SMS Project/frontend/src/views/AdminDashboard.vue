<template>
  <div class="dashboard-page">
    <h1 class="page-title">Dashboard</h1>

    <!-- Cards -->
    <div class="cards" v-if="stats">
      <!-- Students Card -->
      <Card 
        :number="stats.cards.students.count.toString()" 
        label="Students" 
        :percent="stats.cards.students.trend" 
        arrow="↑"
        color="green" 
      />

      <!-- Teachers Card -->
      <Card 
        :number="stats.cards.teachers.count.toString()" 
        label="Teachers" 
        :percent="stats.cards.teachers.trend" 
        arrow="↓"
        color="red" 
      />

      <!-- Staffs Card -->
      <Card 
        :number="stats.cards.staffs.count.toString()" 
        label="Staffs" 
        :percent="stats.cards.staffs.trend" 
        arrow="↑"
        color="green" 
      />
    </div>

    <div class="notice-board" v-if="stats">
    <div class="section-header">
      <h3>Notice Board</h3>
      <router-link to="/notices" class="view-all">View all</router-link>
    </div>
    
    <div class="notice-list">
      <div v-for="notice in stats.notices" :key="notice.id" class="notice-item">
        <div class="notice-icon">🔔</div>
        <div class="notice-content">
          <p class="notice-title">{{ notice.title }}</p>
          <p class="notice-date">{{ new Date(notice.createdAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>

  <StudentNum
    v-if="stats"
    :male="stats.genderStats.male"
    :female="stats.genderStats.female">
  </StudentNum>

    <Calendar />
    <Agenda />
  </div>
</template> 

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/axios";

import Card from "../components/card.vue";
import StudentNum from "../components/Studentnum.vue";
import RightSquares from "../components/RightSquare.vue";
import Calendar from "../components/Calendar.vue";
import Agenda from "../components/Agenda.vue";

interface DashboardStats {
  cards: {
    students: { count: number; trend: string };
    teachers: { count: number; trend: string };
    staffs: { count: number; trend: string };
  };
  genderStats: {
    male: number;
    female: number;
    total: number;
  };
  notices: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }[];
}

const stats = ref<DashboardStats | null>(null);

onMounted(async () => {
  try {
    const response = await api.get('/dashboard/admin-summary');
    stats.value = response.data;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
});

</script>

<style scoped>
.dashboard-page { padding: 20px; }
.page-title { font-size: 32px; font-weight: 700; margin-bottom: 30px; color: #333; }
.cards { display: flex; gap: 30px; }
.split-screen { display: flex; gap: 30px; margin-top: 40px; }
.notice-board {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notice-item {
  display: flex;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.notice-title {
  font-weight: 600;
  margin: 0;
  font-size: 14px;
}

.notice-date {
  font-size: 12px;
  color: #888;
  margin: 0;
}
</style>
