<script setup lang="ts"></script>

<template>
  <div class="profile">
    <img src="../assets/boygirl.png" alt="Teacher" />
    <h2>Tal Tongsreng</h2>
    <p>Applied Software engineer Teacher</p>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

h2 {
  font-size: 1.2rem;
  font-weight: 600;
}

p {
  color: gray;
  font-size: 0.95rem;
}
</style>
