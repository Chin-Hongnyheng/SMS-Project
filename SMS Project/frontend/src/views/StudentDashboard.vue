<script setup lang="ts">
import DashboardHeader from '../components/DashboardHeader.vue'
import WelcomeCard from '../components/WelcomeCard.vue'
// import ProgressCard from '../components/ProgressCard.vue'
import StatsCards from '../components/StatsCards.vue'
import AssignmentTable from '../components/AssignmentTable.vue'
import ScheduleCard from '../components/ScheduleCard.vue'
import Agenda from '../components/Agenda.vue'
import Calendar from '../components/Calendar.vue'
</script>

<template>
  <div class="dashboard">
    <DashboardHeader />

    <div class="row two-col">
      <WelcomeCard />
      <!-- <ProgressCard /> -->
    </div>

    <StatsCards />

    <div class="divider"></div>

    <AssignmentTable />
    <ScheduleCard />

    <div class="row two-col">
      <Agenda />
      <Calendar />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.row {
  display: grid;
  gap: 25px;
}

.two-col {
  grid-template-columns: 2fr 1fr;
}

.divider {
  height: 6px;
  background: #5ba4d5;
  border-radius: 5px;
}
</style>
