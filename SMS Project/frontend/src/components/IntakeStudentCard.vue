<template>
  <div class="student-frame">
    <!-- Top-left Title -->
    <span class="frame-title">Intake Students</span>

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
      <span class="header-item">Action</span>
    </div>

    <!-- White Squares with Student Data -->
    <div
      class="big-square white-square data-row"
      v-for="(student, index) in students"
      :key="index"
    >
      <span class="data-item">{{ index + 1 }}</span>
      <span class="data-item">{{ student.name }}</span>
      <span class="data-item">{{ student.id }}</span>
      <span class="data-item">{{ student.class }}</span>
      <span class="data-item">{{ student.generation }}</span>
      <span class="data-item">{{ student.location }}</span>
      <span class="data-item">{{ student.contact }}</span>
      <span class="data-item">
        <button class="action-btn">Edit</button>
        <button class="action-btn">Delete</button>
      </span>
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

// Sample student data
const students = reactive([
  {
    name: 'John Doe',
    id: 'S1234',
    class: '10A',
    generation: '2023',
    location: 'Phnom Penh',
    contact: '012345678',
  },
  {
    name: 'Jane Smith',
    id: 'S1235',
    class: '10B',
    generation: '2023',
    location: 'Battambang',
    contact: '098765432',
  },
  {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
    {
    name: 'Bob Tan',
    id: 'S1236',
    class: '10C',
    generation: '2022',
    location: 'Siem Reap',
    contact: '011223344',
  },
]);
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
