<script setup lang="ts">
interface Student {
  id: string
  name: string
  presentDays: number[]
}

type CourseOption = { id: number; name: string }
type ClassOption = { id: number; label: string }

defineProps<{
  days: number[]
  students: Student[]
  courses: CourseOption[]
  classOptions: ClassOption[]
  years: number[]
  modules: string[]
  selectedCourseId: number | null
  selectedYear: number | null
  selectedModule: string
  selectedClassId: number | null
  selectedMonth: string
}>()
const emit = defineEmits<{
  (event: 'add-student'): void
  (event: 'add-class'): void
  (event: 'delete-class'): void
  (event: 'select-course', id: number): void
  (event: 'select-year', value: number): void
  (event: 'select-module', value: string): void
  (event: 'select-class', id: number): void
  (event: 'select-month', value: string): void
  (event: 'delete-student', id: string): void
  (event: 'edit-student', student: Student): void
  (event: 'export-pdf'): void
  (event: 'toggle-attendance', payload: { studentId: string; day: number; present: boolean }): void
}>()

const formatModuleLabel = (value: string) => value.replace(/^module\s*/i, 'Module ')
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <div class="title-group">
        <span class="module-tag">{{ formatModuleLabel(selectedModule) }} Student attendance</span>
        <h1>Student Attendance</h1>
      </div>
      <div class="panel-actions">
        <label class="course-select">
          <span>Course</span>
          <select
            :value="selectedCourseId ?? undefined"
            @change="emit('select-course', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
        </label>
        <label class="year-select">
          <span>Year</span>
          <select
            :value="selectedYear ?? undefined"
            @change="emit('select-year', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="year in years" :key="year" :value="year">
              Year {{ year }}
            </option>
          </select>
        </label>
        <label class="module-select">
          <span>Module</span>
          <select
            :value="selectedModule"
            @change="emit('select-module', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="moduleValue in modules" :key="moduleValue" :value="moduleValue">
              {{ formatModuleLabel(moduleValue) }}
            </option>
          </select>
        </label>
        <label class="class-select">
          <span>Class</span>
          <select
            :value="selectedClassId ?? ''"
            @change="emit('select-class', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-if="classOptions.length === 0" value="" disabled>
              No classes
            </option>
            <option v-for="klass in classOptions" :key="klass.id" :value="klass.id">
              {{ klass.label }}
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
        <button class="ghost export-pdf" type="button" @click="emit('export-pdf')">Export PDF</button>
        <button class="ghost add-class" type="button" @click="emit('add-class')">Add Class</button>
        <button class="ghost delete-class" type="button" @click="emit('delete-class')">Remove Class</button>
        <button class="add-btn" type="button" @click="emit('add-student')">Add Student</button>
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
            <div class="row-actions">
              <button
                class="edit-row"
                type="button"
                title="Edit student"
                aria-label="Edit student"
                @click="emit('edit-student', student)"
              >
                <span class="edit-icon">✎</span>
              </button>
              <button
                class="delete-row"
                type="button"
                title="Remove student"
                aria-label="Remove student"
                @click="emit('delete-student', student.id)"
              >
                <span class="delete-icon">×</span>
              </button>
            </div>
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
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 26px 28px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid #eef1f5;
  display: grid;
  gap: 18px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.class-select,
.module-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #5c6b78;
  font-weight: 600;
}

.class-select select,
.course-select select,
.year-select select,
.module-select select {
  border: 1px solid #d9dfe7;
  background: #f7f9fc;
  border-radius: 10px;
  padding: 6px 10px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.course-select,
.year-select,
.module-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #5c6b78;
  font-weight: 600;
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

.export-pdf {
  padding: 8px 14px;
}

.title-group {
  display: grid;
  gap: 6px;
}

.module-tag {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #5b616b;
}

.panel-title h1 {
  font-size: 1.5rem;
  margin: 0;
}

.add-btn {
  border: none;
  background: #5ba4d5;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(91, 164, 213, 0.28);
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
  background: #5ba4d5;
  box-shadow: 0 0 0 4px rgba(91, 164, 213, 0.2);
}

.cell.id {
  font-weight: 600;
  color: #6c7784;
}

.row-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}

.edit-row,
.delete-row {
  border: 1px solid #d9dfe7;
  background: #f7f9fc;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.edit-row:hover {
  background: #e8f3fb;
  box-shadow: 0 4px 10px rgba(63, 133, 189, 0.18);
  transform: translateY(-1px);
}

.delete-row {
  border-color: #f2c1bf;
  background: #fff5f5;
}

.delete-row:hover {
  background: #ffe4e2;
  box-shadow: 0 4px 10px rgba(176, 64, 58, 0.15);
  transform: translateY(-1px);
}

.edit-row:focus-visible,
.delete-row:focus-visible {
  outline: 2px solid #b0403a;
  outline-offset: 2px;
}

.edit-icon {
  font-size: 0.95rem;
  line-height: 1;
  color: #3f85bd;
  font-weight: 700;
}

.delete-icon {
  font-size: 1.05rem;
  line-height: 1;
  color: #b0403a;
  font-weight: 700;
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
  background: #5ba4d5;
  border-color: #5ba4d5;
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
