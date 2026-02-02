<template>
  <div class="agenda-card">
    <h2 class="title">Agenda</h2>

    <div v-if="items.length === 0" class="empty">
      No agenda items
    </div>

    <ul v-else class="agenda-list">
      <li v-for="item in items" :key="item.id" class="agenda-item">
        <div class="time">{{ item.time }}</div>
        <div class="content">
          <div class="name">{{ item.title }}</div>
          <div class="desc">{{ item.description }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface AgendaItem {
  id: number
  time: string
  title: string
  description: string
}

const items = ref<AgendaItem[]>([
  {
    id: 1,
    time: "08:30",
    title: "Morning Meeting",
    description: "Staff daily briefing"
  },
  {
    id: 2,
    time: "10:00",
    title: "Class Review",
    description: "Curriculum planning"
  },
  {
    id: 3,
    time: "14:00",
    title: "Student Consultation",
    description: "Advising session"
  }
])
</script>

<style scoped>
.agenda-card {
  margin-top: 30px;
  padding: 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.empty {
  color: #888;
  font-size: 14px;
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.agenda-item:last-child {
  border-bottom: none;
}

.time {
  font-weight: 700;
  color: #4caf50;
  min-width: 60px;
}

.content {
  flex: 1;
}

.name {
  font-weight: 600;
}

.desc {
  font-size: 13px;
  color: #777;
}
</style>
