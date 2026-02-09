<template>
  <div class="candidate-exam-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button @click="$router.back()" class="back-button">← Back</button>
        <h1>Available Exams</h1>
        <p>View exams available for candidates</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="message message-error">
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div>Loading exams...</div>
    </div>

    <!-- Exam Cards -->
    <div v-else class="exam-grid">
      <div v-if="schedules.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Exams Available</h3>
        <p>There are no exams scheduled for candidates at this time.</p>
      </div>

      <div v-for="schedule in schedules" :key="schedule.id" class="exam-card">
        <div class="exam-card-header">
          <span class="exam-type-badge">{{
            schedule.examType?.name || "Exam"
          }}</span>
          <span
            class="exam-status"
            :class="'status-' + schedule.status.toLowerCase()"
          >
            {{ schedule.status }}
          </span>
        </div>

        <div class="exam-card-body">
          <h3 class="exam-title">
            {{ schedule.course?.courseName || "Course" }}
          </h3>

          <div class="exam-details">
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-text">{{
                formatDate(schedule.examDate)
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🕒</span>
              <span class="detail-text"
                >{{ schedule.startTime }} - {{ schedule.endTime }}</span
              >
            </div>
            <div class="detail-item">
              <span class="detail-icon">🏫</span>
              <span class="detail-text">Room: {{ schedule.room }}</span>
            </div>
          </div>
        </div>

        <div class="exam-card-footer">
          <button class="btn btn-primary" @click="viewDetails(schedule)">
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <teleport to="body">
      <div v-if="showDetailModal" class="modal-overlay">
        <div class="modal-box">
          <h2>Exam Details</h2>

          <div v-if="selectedSchedule" class="detail-content">
            <div class="detail-row">
              <label>Exam Type:</label>
              <span>{{ selectedSchedule.examType?.name || "N/A" }}</span>
            </div>
            <div class="detail-row">
              <label>Course:</label>
              <span>{{ selectedSchedule.course?.courseName || "N/A" }}</span>
            </div>
            <div class="detail-row">
              <label>Date:</label>
              <span>{{ formatDate(selectedSchedule.examDate) }}</span>
            </div>
            <div class="detail-row">
              <label>Time:</label>
              <span
                >{{ selectedSchedule.startTime }} -
                {{ selectedSchedule.endTime }}</span
              >
            </div>
            <div class="detail-row">
              <label>Room:</label>
              <span>{{ selectedSchedule.room }}</span>
            </div>
            <div class="detail-row">
              <label>Status:</label>
              <span
                :class="
                  'status-badge status-' + selectedSchedule.status.toLowerCase()
                "
              >
                {{ selectedSchedule.status }}
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button @click="showDetailModal = false" class="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { examSchedulesService } from "@/api/examService";

interface ExamSchedule {
  id: string;
  examType?: { id: string; name: string };
  course?: { id: string; courseName: string };
  subject?: { id: string; name: string };
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
}

const schedules = ref<ExamSchedule[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const showDetailModal = ref(false);
const selectedSchedule = ref<ExamSchedule | null>(null);

onMounted(async () => {
  await fetchCandidateSchedules();
});

async function fetchCandidateSchedules() {
  loading.value = true;
  try {
    const response = await examSchedulesService.getCandidateSchedules();
    schedules.value = response.data;
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to load exams";
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function viewDetails(schedule: ExamSchedule) {
  selectedSchedule.value = schedule;
  showDetailModal.value = true;
}
</script>

<style scoped>
/* Container */
.candidate-exam-container {
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
}

/* Messages */
.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.message-error {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

/* Exam Grid */
.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Exam Card */
.exam-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.exam-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.exam-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.exam-type-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.exam-status {
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

.exam-card-body {
  padding: 1.5rem;
}

.exam-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.exam-course {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.exam-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.detail-icon {
  font-size: 1rem;
}

.exam-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-box h2 {
  margin: 0 0 1.5rem 0;
  color: #111827;
}

.detail-content {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  color: #374151;
  width: 120px;
  flex-shrink: 0;
}

.detail-row span {
  color: #111827;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
