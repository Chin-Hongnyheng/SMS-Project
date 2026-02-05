<script setup lang="ts">
const emit = defineEmits<{ (event: 'toggle'): void }>()
</script>

<template>
  <header class="top-bar">
    <div class="left-header">
      <button @click="emit('toggle')" class="toggle-btn" aria-label="Toggle sidebar">
        <font-awesome-icon :icon="['fas', 'bars']" class="menu-icon" />
      </button>
      <div class="search-container">
        <input type="text" placeholder="Search" />
      </div>
    </div>

    <div class="top-icons">
      <span>
        <font-awesome-icon :icon="['fas', 'bell']" class="top-bar-icon" />
      </span>
      <span>
        <font-awesome-icon :icon="['fas', 'comment-dots']" class="top-bar-icon" />
      </span>
      <span>
        <font-awesome-icon :icon="['fas', 'circle-user']" class="top-bar-icon" />
      </span>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  height: 70px;
  width: 100%;
  display: flex;
  padding: 0 30px;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 0;
  flex-shrink: 0;
  z-index: 10;
}

.left-header {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.toggle-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #5ba4d5;
}

.menu-icon {
  font-size: 1.5rem;
}

.top-icons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.top-bar-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: #5ba4d5;
}

.search-container input {
  width: 800px;
  height: 40px;
  padding-left: 15px;
  border-radius: 10px;
  background-color: #efefef;
  border: none;
}

@media (max-width: 768px) {
  .search-container input {
    width: 300px;
  }
}
</style>
