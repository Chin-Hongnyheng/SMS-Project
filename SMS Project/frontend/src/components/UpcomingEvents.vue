<script setup lang="ts">
const events = [
  { color: 'green', name: 'Conference', date: 'Jan 10 - Jan 12', time: '08:00 AM' },
  { color: 'yellow', name: 'Workshop', date: 'Jan 15', time: '01:00 PM' },
  { color: 'orange', name: 'Meeting', date: 'Jan 18', time: '10:00 AM' },
  { color: 'red', name: 'Exam', date: 'Jan 22', time: '09:00 AM' },
]
</script>

<template>
  <div class="events card">
    <h3>Upcoming Events</h3>

    <div v-for="e in events" :key="e.name" class="event">
      <span class="dot" :class="e.color"></span>
      <div>
        <strong>{{ e.name }}</strong>
        <p class="date">{{ e.date }}</p>
        <p class="time">{{ e.time }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events {
  width: 100%;
}

.event {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 5px;
}

.green { background: #4caf50; }
.yellow { background: #ffc107; }
.orange { background: #ff9800; }
.red { background: #f44336; }

.date {
  color: gray;
  font-size: 0.85rem;
}

.time {
  font-size: 0.85rem;
}
</style>
