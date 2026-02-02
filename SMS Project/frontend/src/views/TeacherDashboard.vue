<script setup lang="ts">
import ProfileCard from '../components/ProfileCard.vue'
import FilterSelect from '../components/FilterSelect.vue'
import WeeklySchedule from '../components/WeeklySchedule.vue'
import UpcomingEvents from '../components/UpcomingEvents.vue'
import Calendar from '../components/Calendar.vue'
import Agenda from '../components/Agenda.vue'

</script>

<template>
  <section class="dashboard">
    <h1 class="title">Dashboard</h1>

    <!-- Top Profile Card -->
    <div class="card">
      <ProfileCard />

      <div class="filters">
        <FilterSelect label="Select Year" />
        <FilterSelect label="Select Class" />
      </div>

      <WeeklySchedule />
      <Calendar />
      <Agenda />
    </div>

    <!-- Upcoming Events -->
    <UpcomingEvents />
  </section>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.filters {
  display: flex;
  gap: 20px;
}
</style>
