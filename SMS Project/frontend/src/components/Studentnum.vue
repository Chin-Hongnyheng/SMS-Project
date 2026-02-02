<template>
  <div class="student-num">
    <div class="left-text">Students</div>
    <div class="circle-container">
      <div class="big-circle">
        <div class="small-circle">
          <img src="@/assets/boygirl.png" class="boygirl-img" />
        </div>
      </div>

      <div class="legend-circles">
        <!-- Boys -->
        <div class="legend-item">
          <div class="legend-circle left"></div>
          <div class="legend-label">Boys: 120</div>
        </div>

        <!-- Girls -->
        <div class="legend-item">
          <div class="legend-circle right"></div>
          <div class="legend-label">Girls: 123</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No special JS needed unless you want to make boys/girls dynamic
</script>

<style scoped>
/* Use the same style as .right-square for the wrapper */
.student-num {
  background: #fff;
  border-radius: 15px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  flex-direction: column;
  position: relative;
  padding: 15px; /* optional padding */
}

.left-text { 
  font-size: 18px; 
  font-weight: 600; 
  margin-bottom: 20px; 
}

/* Circles */
.circle-container { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
}

.big-circle { 
  width: 270px; 
  height: 270px; 
  border-radius: 50%; 
  border: 27px solid #CFCEFF; 
  display: flex; 
  align-items: center;
  justify-content: center; 
  margin-bottom: 20px; 
}

.small-circle { 
  width: 190px; 
  height: 190px; 
  border-radius: 50%; 
  border: 27px solid #FFED9F; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.boygirl-img {
  width: 80px;   
  height: 60px;
  object-fit: contain;
  position: absolute;
}

.legend-circles { 
  width: 100%; 
  display: flex; 
  justify-content: space-around; 
  margin-top: 10px; 
}

.legend-circle { 
  width: 25px; 
  height: 25px; 
  border-radius: 50%; 
}

.legend-circle.left { 
  background-color: #CFCEFF; 
}

.legend-circle.right { 
  background-color: #FFED9F; 
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.legend-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
</style>
