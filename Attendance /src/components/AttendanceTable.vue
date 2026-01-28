<script setup lang="ts">
interface Student {
  id: string
  name: string
  presentDays: number[]
}

type ClassOption = { id: number; name: string }

defineProps<{
  days: number[]
  students: Student[]
  classes: ClassOption[]
  selectedClassId: number | null
  selectedMonth: string
}>()
const emit = defineEmits<{
  (event: 'add-student'): void
  (event: 'add-class'): void
  (event: 'delete-class'): void
  (event: 'select-class', id: number): void
  (event: 'select-month', value: string): void
  (event: 'delete-student', id: string): void
  (event: 'toggle-attendance', payload: { studentId: string; day: number; present: boolean }): void
}>()
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <div class="title-group">
        <span class="module-tag">Module 5 Student attendance</span>
        <h1>Student Attendance</h1>
      </div>
      <div class="panel-actions">
        <label class="class-select">
          <span>Class</span>
          <select
            :value="selectedClassId ?? undefined"
            @change="emit('select-class', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="klass in classes" :key="klass.id" :value="klass.id">
              {{ klass.name }}
            </option>
          </select>
        </label>
        <label class="month-select">
          <span>Month</span>
          <input
            type="month"
            :value="selectedMonth"
            @change="emit('select-month', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <button class="ghost add-class" type="button" @click="emit('add-class')">Add Class</button>
        <button class="ghost delete-class" type="button" @click="emit('delete-class')">Remove Class</button>
        <button class="add-btn" type="button" @click="emit('add-student')">Add New</button>
      </div>
    </div>

    <div class="card">
      <div class="attendance-toolbar">
        <div class="section-label">Attendance</div>
      </div>

      <div class="attendance-table">
        <div class="attendance-row head">
          <div class="cell name">Student Name</div>
          <div class="cell id">ID</div>
          <div class="days" role="row">
            <div v-for="day in days" :key="`head-${day}`" class="day">{{ day }}</div>
          </div>
        </div>

        <div v-for="student in students" :key="student.id" class="attendance-row">
          <div class="cell name">
            <span class="avatar-dot"></span>
            {{ student.name }}
            <button class="delete-row" type="button" @click="emit('delete-student', student.id)">✕</button>
          </div>
          <div class="cell id">{{ student.id }}</div>
          <div class="days" role="row">
            <label
              v-for="day in days"
              :key="`${student.id}-${day}`"
              class="day check"
              :aria-label="`Day ${day}`"
            >
              <input
                type="checkbox"
                :checked="student.presentDays.includes(day)"
                @change="
                  emit('toggle-attendance', {
                    studentId: student.id,
                    day,
                    present: ($event.target as HTMLInputElement).checked,
                  })
                "
              />
              <span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 20px;
  padding: 24px 26px 28px;
  box-shadow: 0 12px 24px rgba(19, 31, 54, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: grid;
  gap: 18px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: 'Space Grotesk', sans-serif;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.class-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #5c6b78;
  font-weight: 600;
}

.class-select select {
  border: 1px solid #d9dfe7;
  background: #f7f9fc;
  border-radius: 10px;
  padding: 6px 10px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.month-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #5c6b78;
  font-weight: 600;
}

.month-select input {
  border: 1px solid #d9dfe7;
  background: #f7f9fc;
  border-radius: 10px;
  padding: 6px 10px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.add-class {
  padding: 8px 14px;
}

.delete-class {
  padding: 8px 14px;
  color: #b0403a;
  border-color: #f0c9c7;
}

.title-group {
  display: grid;
  gap: 6px;
}

.module-tag {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #6c7784;
}

.panel-title h1 {
  font-size: 1.6rem;
  margin: 0;
}

.add-btn {
  border: none;
  background: #5aa9d6;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(90, 169, 214, 0.28);
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 20px;
  border: 1px solid #ecedf1;
  display: grid;
  gap: 16px;
}

.attendance-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.section-label {
  font-weight: 600;
  color: #2b2d35;
}

.chip {
  border: 1px solid #d9dfe7;
  background: #f7f9fc;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: #3d4a57;
}

.chip.active {
  background: #e0f0fb;
  border-color: #9bc9e8;
  color: #0f3753;
}

.attendance-table {
  display: grid;
  gap: 10px;
  overflow: auto;
  padding-bottom: 6px;
}

.attendance-row {
  display: grid;
  grid-template-columns: 220px 90px minmax(520px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #edf0f5;
  width: max-content;
}

.attendance-row.head {
  background: #eef4f9;
  font-weight: 600;
  color: #1d2a37;
  position: sticky;
  top: 0;
  z-index: 2;
}

.cell.name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #5aa9d6;
  box-shadow: 0 0 0 4px rgba(90, 169, 214, 0.2);
}

.cell.id {
  font-weight: 600;
  color: #6c7784;
}

.delete-row {
  border: none;
  background: transparent;
  padding: 0 2px;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  color: #b0403a;
  margin-left: 8px;
  opacity: 0.8;
}

.delete-row:hover {
  opacity: 1;
}

.days {
  display: grid;
  grid-template-columns: repeat(31, 26px);
  gap: 6px;
  align-items: center;
  min-width: 1030px;
}

.day {
  font-size: 0.72rem;
  color: #5c6b78;
  text-align: center;
}

.day.check {
  position: relative;
  display: grid;
  place-items: center;
}

.day.check input {
  position: absolute;
  opacity: 0;
  inset: 0;
  margin: 0;
  cursor: pointer;
}

.day.check span {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1.6px solid #d0d6df;
  background: #ffffff;
  box-shadow: inset 0 0 0 2px transparent;
}

.day.check input:checked + span {
  background: #5aa9d6;
  border-color: #5aa9d6;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.8);
}

.day.check input:focus-visible + span {
  outline: 2px solid #2f79a8;
  outline-offset: 2px;
}

@media (max-width: 1200px) {
  .attendance-row {
    grid-template-columns: 190px 80px minmax(520px, 1fr);
  }
}

@media (max-width: 900px) {
  .panel-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
