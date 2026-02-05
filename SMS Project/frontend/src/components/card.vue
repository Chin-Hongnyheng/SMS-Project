<template>
  <div class="card">
    <div :class="['oval', color]">
      <span class="arrow">{{ arrow }}</span>
      <span class="percent">{{ percent }}</span>
    </div>
    <router-link v-if="label === 'Students'" to="/students" class="manage-link">
      Manage →
    </router-link>
    <div class="card-number">{{ number }}</div>
    <div class="card-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    number: string | number;
    label: string;
    percent: string | number;
    arrow?: string;
    color: 'green' | 'red';
  }>()
</script>

<style scoped>
.card { width: 500px; height: 120px; background: #fff; border-radius: 15px; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.08); padding: 15px; }
.oval { width: 60px; height: 28px; border-radius: 50px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; gap: 4px; font-size: 20px; position: absolute; top: 15px; left: 15px; }
.oval.green { background-color: #28a745; }
.oval.red { background-color: #dc3545; }
.arrow { font-size: 14px; }
.percent { font-size: 14px; }
.card-number { position: absolute; top: 55px; left: 15px; font-size: 28px; font-weight: bold; color: #333; }
.card-label { position: absolute; top: 95px; left: 15px; font-size: 18px; font-weight: 500; color: #555; }
.manage-link {
  position: absolute;
  top: 11px;
  right: 15px;
  display: block;
  margin-top: 10px;
  font-size: 15px;
  color: #666;
  padding: 4px 8px;
  text-decoration: none;
  font-weight: 600;

}
.manage-link:hover { color: #000; }

</style>
