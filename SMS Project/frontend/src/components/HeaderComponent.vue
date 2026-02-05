<script setup lang="ts">
const emit = defineEmits(['toggle'])

const fas = {
  bar: 'bars',
  notification: 'bell',
  message: 'comment-dots',
  account: 'circle-user',
}
</script>

<template>
  <header class="top-bar">

    <button class="toggle-btn" @click="emit('toggle')">
      <font-awesome-icon :icon="fas.bar" />
    </button>

    <div>
        <input type="text" placeholder="Search" class="search-input" />
    </div>

    <div class="top-icons">
      <font-awesome-icon :icon="fas.notification" class="each-icon"/>
      <font-awesome-icon :icon="fas.message" class="each-icon" />
      <font-awesome-icon :icon="fas.account" class="each-icon"/>
    </div>

  </header>
</template>

<style scoped>
.top-bar {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 0 30px; */
  gap: 100px;
  width:100%;
  position: relative;
}

.left-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: #5ba4d5;
  cursor: pointer;
  font-size: 30px;
  position: absolute;
  left: 30px;              
  top: 50%;                
  transform: translateY(-50%);
}

.search-input {
  font-family: 'Nunito';
  font-weight: 900;
  font-size: 20px;
  color: rgb(189, 183, 183);
  width: 1100px;
  height: 40px;
  border-radius: 10px;
  border: none;
  padding-left: 15px;
  background-color: #efefef;
}

.top-icons {
  display: flex;
  gap: 20px;
  font-size: 30px;
  color: #5ba4d5;
}
.each-icon{
  transition: transform 0.3s ease;
}
.each-icon:hover{
  transform: scale(1.2);
}
</style>
