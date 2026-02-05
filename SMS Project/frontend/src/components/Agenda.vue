<template>
  <div class="agenda-card">
    <h2 class="title">Agenda</h2>

    <div v-if="items.length === 0" class="empty">
      No agenda items
    </div>

    <!-- Scrollable agenda list -->
    <ul v-else class="agenda-list">
      <li v-for="item in items" :key="item.id" class="agenda-item">
        <div class="time">{{ item.time }}</div>
        <div class="content">
          <div class="name">{{ item.title }}</div>
          <div class="desc">{{ item.description }}</div>
        </div>
        <button class="delete-btn" @click="deleteItem(item.id)">Delete</button>
      </li>
    </ul>

    <!-- Add Agenda Form -->
    <div v-if="showForm" class="agenda-form">
      <input v-model="newItem.time" type="time" placeholder="Time" />
      <input v-model="newItem.title" type="text" placeholder="Title" />
      <input v-model="newItem.description" type="text" placeholder="Description" />
      <div class="form-buttons">
        <button class="add-btn" @click="submitItem">Add</button>
        <button class="cancel-btn" @click="cancelForm">Cancel</button>
      </div>
    </div>

    <!-- Show form button -->
    <button v-else class="add-btn" @click="showForm = true">Add Agenda Item</button>
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
  { id: 1, time: "08:30", title: "Morning Meeting", description: "Staff daily briefing" },
  { id: 2, time: "10:00", title: "Class Review", description: "Curriculum planning" },
  { id: 3, time: "14:00", title: "Student Consultation", description: "Advising session" }
])

const nextId = ref(4)
const showForm = ref(false)
const newItem = ref({ time: "", title: "", description: "" })

const deleteItem = (id: number) => {
  items.value = items.value.filter(item => item.id !== id)
}

const submitItem = () => {
  if (!newItem.value.time || !newItem.value.title || !newItem.value.description) {
    alert("Please fill all fields")
    return
  }

  items.value.push({
    id: nextId.value++,
    time: newItem.value.time,
    title: newItem.value.title,
    description: newItem.value.description
  })

  // Reset form
  newItem.value = { time: "", title: "", description: "" }
  showForm.value = false
}

const cancelForm = () => {
  newItem.value = { time: "", title: "", description: "" }
  showForm.value = false
}
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
  max-height: 300px; /* Scroll when more than 3 items */
  overflow-y: auto;
}

.agenda-item {
  display: flex;
  align-items: center;
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

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.add-btn {
  margin-top: 12px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
}

.agenda-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.agenda-form input {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  background: #888;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
}
</style>
