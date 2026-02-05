<template>
  <div class="student-frame">
    <!-- Top-left Title -->
    <span class="frame-title">Students List</span>

    <!-- Search Row -->
    <div class="search-row">
      <div class="search-square">
        <span class="square-text">Search</span>
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- 4 Small Squares Row -->
    <div class="small-squares-row">
      <div
        class="info-square"
        v-for="(item, index) in infoSquares"
        :key="index"
        @click="toggleCaret(index)"
      >
        <span class="square-text">{{ item.text }}</span>
        <span class="caret">{{ item.open ? 'v' : '^' }}</span>
      </div>
    </div>

    <!-- Blue Big Square with Headers -->
    <div class="big-square blue-square headers-row">
      <span class="header-item">No</span>
      <span class="header-item">Student</span>
      <span class="header-item">Student ID</span>
      <span class="header-item">Class</span>
      <span class="header-item">Generation</span>
      <span class="header-item">Location</span>
      <span class="header-item">Contact</span>
      <span class="header-item">Exam </span>
      <span class="header-item">Action</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// Small squares
const infoSquares = reactive([
  { text: 'Class', open: false },
  { text: 'Intake', open: false },
  { text: 'Generation', open: false },
  { text: 'Year', open: false },
]);

function toggleCaret(index: number) {
  infoSquares[index].open = !infoSquares[index].open;
}

</script>

<style scoped>
.student-frame {
  background: #fff;
  border-radius: 15px;
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Title */
.frame-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Search Row */
.search-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px; /* gap below search row */
}

/* Search Square */
.search-square {
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  width: 150px;
  height: 32px;
  cursor: pointer;
}

.search-icon {
  font-size: 14px;
  color: #666;
}

/* 4 Small Squares Row */
.small-squares-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px; /* gap before blue square */
}

.info-square {
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  width: 80px;
  height: 32px;
  cursor: pointer;
}

/* Text inside squares */
.square-text {
  font-size: 12px;
  color: #666;
}

.caret {
  font-size: 18px;
  color: #666;
  user-select: none;
}

/* Big Squares */
.big-square {
  width: 100%;
  height: 50px;
  border-radius: 15px;
  border: 1px solid #999; /* visible stroke */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 0; /* no gap between stacked squares */
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}

/* Blue square */
.blue-square {
  background-color: #EDF9FD;
  justify-content: space-between;
}

/* Headers inside blue square */
.headers-row {
  font-weight: 600;
  color: #333;
}

.header-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
}

/* White square data rows */
.data-row {
  background-color: #fff;
}

.data-item {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #333;
}

/* Action buttons inside data rows */
.data-item:last-child {
  display: flex;
  gap: 5px; /* gap between buttons */
  justify-content: center;
  align-items: center;
}

.action-btn {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 5px;
  border: none;
  background-color: #5ba4d5;
  color: white;
  cursor: pointer;
}

</style>
