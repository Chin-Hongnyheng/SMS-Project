<template>
  <div class="student-frame">
    <span class="frame-title">Intake Students</span>

    <!-- Big Square with Headers -->
    <div class="big-square blue-square headers-row">
      <span class="header-item">No</span>
      <span class="header-item">Student</span>
      <span class="header-item">Student ID</span>
      <span class="header-item">Group</span>
      <span class="header-item">Year</span>
      <span class="header-item">Major</span>
      <span class="header-item">Contact</span>
      <span class="header-item">Action</span>
    </div>

    <!-- List of Students -->
    <div v-if="students.length > 0">
      <div class="big-square white-square data-row" v-for="(student, index) in students" :key="student.id">
        <span class="data-item">{{ index + 1 }}</span>
        <span class="data-item font-bold">{{ student.name }}</span>
        <span class="data-item">{{ student.studentId }}</span>
        <span class="data-item">{{ student.group }}</span>
        <span class="data-item">{{ student.year }}</span>
        <span class="data-item">{{ student.major }}</span>
        <span class="data-item">{{ student.contact }}</span>
        <span class="data-item">
          <button class="action-btn edit">Edit</button>
          <button class="action-btn delete" @click="$emit('delete', student.id)">Delete</button>
        </span>
      </div>
    </div>
    <div v-else class="empty-state">No students found.</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ students: any[] }>();
defineEmits(['delete']);
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
  margin-top: 15px;
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
.action-btn.delete { background-color: #FF3F33; }
.action-btn.edit { background-color: #5ba4d5; margin-right: 5px; }
.empty-state { text-align: center; padding: 40px; color: #999; border: 1px dashed #ccc; border-radius: 15px; margin-top: 10px; }
.big-square {
  display: flex;
  align-items: center;
  padding: 0 15px;
  min-height: 50px;
  border: 1px solid #e0e0e0;
  margin-top: -1px; /* Overlap borders for clean look */
}
.blue-square { background-color: #EDF9FD; border-radius: 12px 12px 0 0; }
.white-square:last-child { border-radius: 0 0 12px 12px; }
.header-item, .data-item { flex: 1; text-align: center; font-size: 13px; }
.action-btn { border: none; padding: 4px 10px; border-radius: 4px; color: white; cursor: pointer; font-size: 11px; }
.edit { background: #5ba4d5; margin-right: 5px; }
.delete { background: #ff7675; }
.empty-state { padding: 40px; text-align: center; color: #999; background: white; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; }
</style>
