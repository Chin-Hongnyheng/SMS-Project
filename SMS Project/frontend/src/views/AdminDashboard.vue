<template>
  <div class="dashboard-page">
    <h1 class="page-title">Dashboard</h1>

    <!-- Cards -->
    <div class="cards">
      <Card number="123,456" label="Students" percent="10%" arrow="↑" color="green" />
      <Card number="362" label="Teachers" percent="2%" arrow="↓" color="red" />
      <Card number="245" label="Staffs" percent="8%" arrow="↑" color="green" />
    </div>

    <!-- Split Screen -->
    <div class="split-screen">
      <StudentNum />
      <RightSquares />
    </div>

    <Calendar />
    <Agenda />
  </div>
</template> 

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from '../services/axios'  

import Card from "../components/card.vue";
import StudentNum from "../components/Studentnum.vue";
import RightSquares from "../components/RightSquare.vue";
import Calendar from "../components/Calendar.vue";
import Agenda from "../components/Agenda.vue";

const studentsCount = ref(0)
const teachersCount = ref(0)
const competitions = ref([])
const notices = ref([])
const agendaItems = ref([])

onMounted(async () => {
  studentsCount.value = (await api.get('/students/count')).data.count
  teachersCount.value = (await api.get('/teachers/count')).data.count
  competitions.value = (await api.get('/competitions')).data
  notices.value = (await api.get('/notices')).data
  agendaItems.value = (await api.get('/agenda')).data
})
</script>

<style scoped>
.dashboard-page { padding: 20px; }
.page-title { font-size: 32px; font-weight: 700; margin-bottom: 30px; color: #333; }
.cards { display: flex; gap: 30px; }
.split-screen { display: flex; gap: 30px; margin-top: 40px; }
</style>
