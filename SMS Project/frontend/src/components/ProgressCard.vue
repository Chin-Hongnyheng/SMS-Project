<script setup lang="ts">
const attendance = 75
const assignment = 60
</script>

<template>
  <div class="card progress">
    <div class="circle-group">
      <div class="circle" :style="{ '--p': attendance + '%' }">Attendance</div>
      <div class="circle" :style="{ '--p': assignment + '%' }">Assignment</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 25px;
}

.circle-group {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 10px solid #e5e5e5;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.circle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 10px solid #5ba4d5;
  clip-path: inset(calc(100% - var(--p)) 0 0 0);
}
</style>
