<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
</script>

<template>
  <header class="topbar">
    <div class="search">
      <span class="search-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6" />
          <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </span>
      <input
        :value="modelValue"
        type="search"
        placeholder="Search"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="top-actions"></div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: space-between;
}

.search {
  flex: 1;
  max-width: 520px;
  background: #f2f2f6;
  border-radius: 18px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e2e5ec;
}

.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  font-family: inherit;
}

.search-icon svg {
  width: 20px;
  height: 20px;
  color: #7d7f88;
}

.top-actions {
  display: flex;
  gap: 10px;
}
</style>
