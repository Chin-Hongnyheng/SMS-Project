<script setup lang="ts">
const stats = [
  { title: 'Course in Progress', value: 6 },
  { title: 'Course Complete', value: 19 },
  { title: 'Certificate', value: 3 },
]
</script>

<template>
  <div class="stats">
    <div class="card" v-for="s in stats" :key="s.title">
      <p>{{ s.title }}</p>
      <h2>{{ s.value }}</h2>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 25px;
  text-align: center;
}

h2 {
  color: #5ba4d5;
  font-size: 36px;
}
</style>
