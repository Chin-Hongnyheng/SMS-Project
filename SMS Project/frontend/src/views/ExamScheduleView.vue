<template>
  <div class="exam-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button @click="$router.back()" class="back-button">← Back</button>
        <h1>Exam Schedules</h1>
        <p>Schedule and manage exams</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <span>+ Schedule Exam</span>
      </button>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="message message-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="message message-error">
      {{ errorMessage }}
    </div>

    <!-- Filters -->
    <div class="filter-container">
      <div class="filter-grid">
        <div class="form-group">
          <label>Filter by Exam Type</label>
          <select
            v-model="filters.examTypeId"
            @change="fetchSchedules"
            class="form-control"
          >
            <option value="">All Types</option>
            <option v-for="type in examTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Filter by Date</label>
          <input
            v-model="filters.examDate"
            @change="fetchSchedules"
            type="date"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>&nbsp;</label>
          <button @click="clearFilters()" class="btn btn-secondary full-width">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div>Loading schedules...</div>
    </div>

    <!-- Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Subject</th>
            <th>Exam Type</th>
            <th>Date & Time</th>
            <th>Room</th>
            <th>Status</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in schedules" :key="schedule.id">
            <td>
              <strong>{{ schedule.course?.courseName || "-" }}</strong>
            </td>
            <td>{{ schedule.subject?.name || "-" }}</td>
            <td>{{ schedule.examType?.name || "N/A" }}</td>
            <td>
              {{ formatDate(schedule.examDate) }}<br />
              <span class="time-range"
                >{{ schedule.startTime }} - {{ schedule.endTime }}</span
              >
            </td>
            <td>{{ schedule.room }}</td>
            <td>
              <span
                :class="[
                  'status-badge',
                  'status-' + schedule.status.toLowerCase(),
                ]"
              >
                {{ schedule.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editSchedule(schedule)" class="action-link edit">
                Edit
              </button>
              <button
                @click="deleteSchedule(schedule.id)"
                class="action-link delete"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="schedules.length === 0">
            <td colspan="7" class="empty-state">No exam schedules found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box modal-large">
          <h2>{{ isEditing ? "Edit Exam Schedule" : "Schedule New Exam" }}</h2>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>Exam Type</label>
              <select v-model="form.examTypeId" required class="form-control">
                <option value="">Select Exam Type</option>
                <option
                  v-for="type in examTypes"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Course</label>
              <select v-model="form.courseId" required class="form-control">
                <option :value="null">Select Course</option>
                <option v-for="c in courses" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Subject</label>
              <select
                v-model="form.subjectId"
                required
                class="form-control"
                :disabled="!filteredSubjects.length"
              >
                <option :value="null">Select Subject</option>
                <option v-for="s in filteredSubjects" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Exam Date</label>
              <input
                v-model="form.examDate"
                required
                type="date"
                class="form-control"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start Time</label>
                <input
                  v-model="form.startTime"
                  required
                  type="time"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input
                  v-model="form.endTime"
                  required
                  type="time"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Room</label>
              <input
                v-model="form.room"
                required
                type="text"
                maxlength="100"
                class="form-control"
                placeholder="Enter room number/name"
              />
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status" class="form-control">
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Update" : "Schedule" }}
              </button>
              <button
                type="button"
                @click="closeModal()"
                class="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-box">
          <h3>Delete Schedule</h3>
          <p class="confirm-text">
            Are you sure? This action cannot be undone.
          </p>
          <div class="form-actions">
            <button @click="confirmDelete()" class="btn btn-danger">
              Delete
            </button>
            <button
              @click="showDeleteConfirm = false"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { examTypesService, examSchedulesService } from "@/api/examService";

interface ExamType {
  id: string;
  name: string;
}

interface CourseOption {
  id: number;
  name: string;
}

interface SubjectOption {
  id: number;
  name: string;
  courseId: number;
}

interface ExamSchedule {
  id: string;
  examTypeId: string;
  courseId: number | null;
  subjectId: number | null;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  examType?: ExamType;
  course?: any;
  subject?: any;
}

const schedules = ref<ExamSchedule[]>([]);
const examTypes = ref<ExamType[]>([]);
const courses = ref<CourseOption[]>([]);
const subjects = ref<SubjectOption[]>([]);
const filteredSubjects = ref<SubjectOption[]>([]);
const loading = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const deleteId = ref<string | null>(null);

const filters = ref({
  examTypeId: "",
  examDate: "",
});

const form = ref({
  examTypeId: "",
  courseId: null as number | null,
  subjectId: null as number | null,
  examDate: "",
  startTime: "",
  endTime: "",
  room: "",
  status: "SCHEDULED",
});

watch(
  () => form.value.courseId,
  (courseId) => {
    form.value.subjectId = null;
    if (!courseId) {
      filteredSubjects.value = [];
      return;
    }
    filteredSubjects.value = subjects.value.filter(
      (s) => s.courseId === courseId,
    );
  },
);

onMounted(async () => {
  await fetchCourses();
  await fetchSubjects();
  await loadExamTypes();
  await fetchSchedules();
});

async function fetchCourses() {
  const res = await fetch("http://localhost:3000/courses");
  const data = await res.json();
  courses.value = data.map((c: any) => ({
    id: Number(c.id),
    name: c.courseName,
  }));
}

async function fetchSubjects() {
  const res = await fetch("http://localhost:3000/curriculum");
  const data = await res.json();
  subjects.value = data.map((s: any) => ({
    id: Number(s.id),
    name: s.name,
    courseId: Number(s.courseId) || null,
  }));
}

async function loadExamTypes() {
  try {
    const response = await examTypesService.getAll(0, 100);
    examTypes.value = response.data;
  } catch (error) {
    console.error("Failed to load exam types");
  }
}

async function fetchSchedules() {
  loading.value = true;
  try {
    const response = await examSchedulesService.getAll(
      0,
      100,
      filters.value.examTypeId || undefined,
      filters.value.examDate || undefined,
    );
    schedules.value = response.data;
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to load schedules";
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  filters.value = { examTypeId: "", examDate: "" };
  fetchSchedules();
}

function openModal() {
  isEditing.value = false;
  form.value = {
    examTypeId: "",
    courseId: null,
    subjectId: null,
    examDate: "",
    startTime: "",
    endTime: "",
    room: "",
    status: "SCHEDULED",
  };
  filteredSubjects.value = [];
  showModal.value = true;
}

function editSchedule(schedule: ExamSchedule) {
  isEditing.value = true;
  form.value = {
    ...(schedule as any),
    courseId: schedule.course?.id ? Number(schedule.course.id) : null,
    subjectId: schedule.subject?.id ? Number(schedule.subject.id) : null,
  };
  if (form.value.courseId) {
    filteredSubjects.value = subjects.value.filter(
      (s) => s.courseId === form.value.courseId,
    );
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submitForm() {
  try {
    if (isEditing.value && (form.value as any).id) {
      await examSchedulesService.update((form.value as any).id, form.value);
      successMessage.value = "Schedule updated successfully";
    } else {
      await examSchedulesService.create(form.value);
      successMessage.value = "Schedule created successfully";
    }
    closeModal();
    await fetchSchedules();
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to save schedule";
  }
}

function deleteSchedule(id: string) {
  deleteId.value = id;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!deleteId.value) return;
  try {
    await examSchedulesService.delete(deleteId.value);
    successMessage.value = "Schedule deleted successfully";
    await fetchSchedules();
    showDeleteConfirm.value = false;
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to delete schedule";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}
</script>

<style scoped>
/* Container */
.exam-container {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-header p {
  color: #6b7280;
  margin-top: 0.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #e5e7eb;
  color: #111827;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #005086;
  color: white;
}

.btn-primary:hover {
  background-color: #003d66;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.full-width {
  width: 100%;
  justify-content: center;
}

/* Messages */
.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.message-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Filters */
.filter-container {
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Loading */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
}

/* Table */
.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f3f4f6;
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

.data-table .actions {
  text-align: center;
}

.time-range {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-scheduled {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Action Links */
.action-link {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  transition: color 0.2s;
}

.action-link.edit {
  color: #3b82f6;
}

.action-link.edit:hover {
  color: #2563eb;
}

.action-link.delete {
  color: #ef4444;
}

.action-link.delete:hover {
  color: #dc2626;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Box */
.modal-box {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 32rem;
}

.modal-box h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.25rem;
}

.modal-box h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

/* Form */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.form-control {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.form-actions .btn {
  flex: 1;
  justify-content: center;
}

/* Confirm Text */
.confirm-text {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
</style>
