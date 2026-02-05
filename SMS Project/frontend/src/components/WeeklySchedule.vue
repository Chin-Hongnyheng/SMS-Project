<script setup lang="ts"></script>

<template>
  <div class="schedule">
    <div class="days">
      <span>MON</span><span>TUE</span><span>WED</span>
      <span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
    </div>

    <div class="blocks">
      <div class="block">IT Project management</div>
      <div class="block">Network</div>
      <div class="block">Software Engineering Concepts</div>
    </div>
  </div>
</template>

<style scoped>
.schedule {
  background: #fafafa;
  border-radius: 15px;
  padding: 20px;
}

.days {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: gray;
  margin-bottom: 15px;
}

.blocks {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.block {
  background: #eaeaea;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
}
</style>
