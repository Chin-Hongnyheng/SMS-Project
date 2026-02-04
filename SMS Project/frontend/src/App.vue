<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'

import NavigationComponent from '@/components/NavigationComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
const route = useRoute()

// Compute whether to show layout
const showLayout = computed(() => {
  return route.path !== '/login' && route.path !== '/register'
})

watch(route, () => {
  if (!showLayout.value) isCollapsed.value = false
})
</script>

<template>
  <div>
    <!-- Show layout on authenticated pages -->
    <div v-if="showLayout" class="app-layout">
      <NavigationComponent :is-collapsed="isCollapsed" />

      <div class="main-content">
        <HeaderComponent @toggle="toggleSidebar" />
        <main class="page-content">
          <RouterView :key="$route.fullPath" :is-collapsed="isCollapsed" />
        </main>
      </div>
    </div>

    <!-- Show only the page content on login/register -->
    <RouterView v-else :key="$route.fullPath" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

html,
body,
#app {
  height: 100%;
  margin: 0;
  font-family: 'Nunito';
}

.app-layout {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: #fcfaf6;
  font-family: 'Nunito';
  align-items: stretch;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background-color: #fcfaf6;
  overflow: hidden;
}

.page-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 30px;
  background-color: #fcfaf6;
  scrollbar-width: thin;
  scrollbar-color: #fcfaf6;
}
</style>
