<template>
  <div class="right-squares">
    <!-- Competition -->
    <div class="right-square">
      <div class="competition-title">Competition</div>

      <img
        src="@/assets/competition.png"
        alt="Competition"
        class="competition-img"
      />

      <div class="competition-number">37,037</div>
      <div class="competition-oval">- 5%</div>
    </div>

    <!-- Notice Board -->
    <div class="right-square notice-board">
      <div class="notice-title">Notice Board</div>

      <div class="notice-item">
        <div class="notice-header">Sport</div>
        <div class="notice-desc">
          Inter-school football competition on Jan 30.
        </div>
      </div>

      <div class="notice-item">
        <div class="notice-header">Cultural Event</div>
        <div class="notice-desc">
          Drama performance by students on Feb 2.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.right-squares {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

/* Shared square style */
.right-square {
  background: #ffffff;
  border-radius: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  padding: 15px;
}

/* Competition */
.competition-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
}

.competition-img {
  width: 80%;
  max-height: 70px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 10px;
}

.competition-number {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
}

.competition-oval {
  background: #dc3545;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

/* Notice Board */
.notice-board {
  align-items: flex-start;
}

.notice-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.notice-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  width: 95%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.notice-header {
  font-weight: 600;
  margin-bottom: 5px;
}

.notice-desc {
  font-size: 14px;
  color: #555;
}
</style>
