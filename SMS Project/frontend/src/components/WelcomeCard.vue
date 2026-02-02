<script setup lang="ts">
import boyGirl from '../assets/boygirl.png'
</script>

<template>
  <div class="card welcome">
    <div>
      <h2>Srun NaiEang</h2>
      <p>
        Stay updated on academics, attendance, finances, and more—working
        together to shape a brighter future for education.
      </p>
    </div>
    <img :src="boyGirl" />
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 25px;
}

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 180px;
}
</style>
