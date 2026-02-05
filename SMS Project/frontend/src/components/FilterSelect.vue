<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="filter">
    <span class="arrow">^</span>
    <span class="text">{{ label }}</span>
  </div>
</template>

<style scoped>
.filter {
  flex: 1;
  background: #f3f3f3;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.arrow {
  font-weight: bold;
}

.text {
  color: #777;
}
</style>
