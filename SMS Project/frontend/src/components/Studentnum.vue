<template>
  <div class="chart-container">
    <h3>Students</h3>
    <div id="chart">
      <apexchart class="chartposition"
        type="donut" 
        width="350" 
        :options="chartOptions" 
        :series="series"
      ></apexchart>
    </div>
    
    <div class="chart-legend">
      <div class="legend-item">
        <span class="dot boys"></span>
        <p>Boys ({{ malePercent }}%)</p>
      </div>
      <div class="legend-item">
        <span class="dot female"></span>
        <p>female ({{ femalePercent }}%)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  male: number;
  female: number;
}>();

const total = computed(() => props.male + props.female);
const malePercent = computed(() => total.value ? Math.round((props.male / total.value) * 100) : 0);
const femalePercent = computed(() => total.value ? Math.round((props.female / total.value) * 100) : 0);

const series = computed(() => {
  if (props.male === 0 && props.female === 0) {
    return [1, 1];
  }
  return [props.male, props.female];
});

const chartOptions = {
  labels: ['male', 'female'],
  colors: ['#A5A6F6', '#FFD66B'], // Colors matching your prototype
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Students',
            formatter: () => total.value
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
}
.chartposition {
  justify-self: center
}
.chart-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.male { background-color: #A5A6F6; }
.female { background-color: #FFD66B; }
.legend-item p { font-size: 14px; color: #666; }
</style>