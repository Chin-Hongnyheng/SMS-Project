<template>
  <div class="calendar-section">
    <div class="calendar-square">
      <div class="calendar-header">
        <span class="arrow-btn">&lt;</span>
        <span class="month-year">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <span class="arrow-btn">&gt;</span>
      </div>

      <table class="calendar-table">
        <thead>
          <tr>
            <th v-for="day in weekDays" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, wIndex) in weeks" :key="wIndex">
            <td v-for="(day, dIndex) in week" :key="dIndex">
              <span :class="{ today: isToday(day) }">{{ day || '' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()
const currentDate = today.getDate()

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const weeks = computed(() => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days: (number|null)[] = []
  for(let i=0;i<firstDay;i++) days.push(null)
  for(let i=1;i<=daysInMonth;i++) days.push(i)
  const weeksArr: (number|null)[][] = []
  for(let i=0;i<days.length;i+=7) weeksArr.push(days.slice(i,i+7))
  return weeksArr
})

const isToday = (day: number|null) => day === currentDate
</script>

<style scoped>
.calendar-section { margin-top: 50px; display: flex; flex-direction: column; align-items: center; }
.calendar-square {
  width: 1120px; 
  height: 300px;
  background: #fff; 
  border-radius: 15px; 
  padding: 20px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
}
.calendar-header { display: flex; align-items: center; justify-content: center; margin-bottom: 15px; gap: 20px; font-weight: bold; font-size: 20px; }
.arrow-btn { cursor: pointer; font-size: 20px; user-select: none; }
.month-year { flex-grow: 1; text-align: center; }
.calendar-table { width: 100%; height: 90%; border-collapse: collapse; text-align: center; }
.calendar-table th, .calendar-table td { border: 1px solid #ddd; padding: 10px; width: 14.28%; font-size: 14px; }
.calendar-table th { background-color: #f0f0f0; font-weight: 600; }
.calendar-table td { background-color: #fafafa; }
.calendar-table td span.today { color: #ff0d00; font-weight: bold; }
</style>
