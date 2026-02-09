<template>
  <div class="results-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button @click="$router.back()" class="back-button">← Back</button>
        <h1>My Exam Results</h1>
        <p>View your exam scores and grades</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="message message-error">
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div>Loading your results...</div>
    </div>

    <!-- Results Cards -->
    <div v-else class="results-grid">
      <div v-if="results.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No Results Yet</h3>
        <p>Your exam results will appear here once they are published.</p>
      </div>

      <div v-for="result in results" :key="result.id" class="result-card">
        <div class="result-card-header">
          <span class="course-badge">{{
            result.examSchedule?.course?.courseName || "Course"
          }}</span>
          <span
            :class="[
              'result-status',
              result.remarks === 'PASS' ? 'status-pass' : 'status-fail',
            ]"
          >
            {{ result.remarks || "PENDING" }}
          </span>
        </div>

        <div class="result-card-body">
          <div class="score-display">
            <span class="score-value">{{ result.score ?? 0 }}%</span>
            <span
              :class="[
                'grade-badge',
                'grade-' + (result.grade || 'f').toLowerCase(),
              ]"
            >
              Grade: {{ result.grade || "N/A" }}
            </span>
          </div>

          <div class="result-details">
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-text">{{
                formatDate(result.examSchedule?.examDate)
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📋</span>
              <span class="detail-text">{{
                result.examSchedule?.examType?.name || "Exam"
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🏫</span>
              <span class="detail-text"
                >Room: {{ result.examSchedule?.room || "N/A" }}</span
              >
            </div>
          </div>
        </div>

        <div class="result-card-footer">
          <span class="entered-date"
            >Entered: {{ formatDate(result.enteredAt) }}</span
          >
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div v-if="results.length > 0" class="stats-summary">
      <div class="stat-item">
        <span class="stat-label">Total Exams</span>
        <span class="stat-value">{{ results.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Passed</span>
        <span class="stat-value stat-pass">{{ passedCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Failed</span>
        <span class="stat-value stat-fail">{{ failedCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Average Score</span>
        <span class="stat-value">{{ averageScore.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { examResultsService } from "@/api/examService";

interface ExamResult {
  id: string;
  studentId: string;
  score: number;
  grade: string;
  remarks: string;
  enteredAt: string;
  examSchedule?: {
    id: string;
    examDate: string;
    room: string;
    course?: { id: number; courseName: string };
    examType?: { id: string; name: string };
  };
}

const results = ref<ExamResult[]>([]);
const loading = ref(false);
const errorMessage = ref("");

const passedCount = computed(
  () => results.value.filter((r) => r.remarks === "PASS").length,
);

const failedCount = computed(
  () => results.value.filter((r) => r.remarks === "FAIL").length,
);

const averageScore = computed(() => {
  if (results.value.length === 0) return 0;
  const total = results.value.reduce((sum, r) => sum + Number(r.score || 0), 0);
  return total / results.value.length;
});

onMounted(async () => {
  await fetchMyResults();
});

async function fetchMyResults() {
  loading.value = true;
  errorMessage.value = "";

  try {
    // Get user ID from session storage (set during login)
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      errorMessage.value = "Unable to identify user. Please log in again.";
      return;
    }

    const response = await examResultsService.getMyResults(userId);
    results.value = response.data;
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to load your results";
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
/* Container */
.results-container {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
}

/* Header */
.page-header {
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
  grid-column: 1 / -1;
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

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Result Card */
.result-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.result-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.result-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pass {
  background-color: #d1fae5;
  color: #065f46;
}

.status-fail {
  background-color: #fee2e2;
  color: #991b1b;
}

.result-card-body {
  padding: 1.5rem;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.score-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
}

.grade-badge {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
}

.grade-a {
  background-color: #d1fae5;
  color: #065f46;
}

.grade-b {
  background-color: #dbeafe;
  color: #1e40af;
}

.grade-c {
  background-color: #fef3c7;
  color: #92400e;
}

.grade-d {
  background-color: #fed7aa;
  color: #9a3412;
}

.grade-f {
  background-color: #fee2e2;
  color: #991b1b;
}

.result-details {
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

.result-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.entered-date {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Stats Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-pass {
  color: #065f46;
}

.stat-fail {
  color: #991b1b;
}
</style>
