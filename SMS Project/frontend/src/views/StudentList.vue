<template>
  <div class="student-page px-6">
    <!-- Page Title -->
    <h1 class="text-2xl font-bold text-gray-700 mb-4">Student List</h1>

    <!-- Use the White Frame Component -->
    <StudentFrame />
  </div>
</template>

<script setup lang="ts">
import StudentFrame from '../components/StudentTable.vue';
</script>

<style scoped>
.student-page {
  padding-top: 20px;
}
</style>
