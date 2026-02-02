<script setup lang="ts">
const schedule = [
  { time: '08:00 - 09:00', course: 'Mathematics' },
  { time: '09:00 - 10:00', course: 'Physics' },
  { time: '10:30 - 11:30', course: 'Chemistry' },
]
</script>

<template>
  <div class="card big">
    <h2>Schedule</h2>

    <div class="row" v-for="(s, i) in schedule" :key="i">
      <span>{{ s.time }}</span>
      <span>{{ s.course }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
</style>
