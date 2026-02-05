<script setup lang="ts">
const assignments = [
  { subject: 'Math', task: 'Homework 1', done: true },
  { subject: 'Physics', task: 'Lab Report', done: false },
  { subject: 'Chemistry', task: 'Quiz', done: true },
]
</script>

<template>
  <div class="card big">
    <h2>My Assignment</h2>

    <div class="header">
      <span>Subject</span>
      <span>Task</span>
      <span>Update</span>
    </div>

    <div v-for="(a, i) in assignments" :key="i" class="row">
      <span>{{ a.subject }}</span>
      <span>{{ a.task }}</span>
      <span :class="['status', a.done ? 'done' : 'pending']">
        {{ a.done ? 'Complete' : 'Submit' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 30px;
}

.header, .row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  padding: 12px 0;
}

.header {
  font-weight: bold;
  border-bottom: 2px solid #eee;
}

.row {
  border-bottom: 1px solid #eee;
}

.status {
  text-align: center;
  color: white;
  padding: 6px;
  border-radius: 8px;
}

.done {
  background: #2ecc71;
}

.pending {
  background: #e74c3c;
}
</style>
