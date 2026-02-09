<template>
  <section class="dashboard-container">
    <!-- ✅ Role Check Wrapper -->
    <div v-if="userRole === 'admin' || userRole === 'teacher'">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading exam data...</p>
      </div>

      <!-- Stats Grid -->
      <div v-else class="stats-grid">
        <div class="card stat-card" @click="navigateTo('exam-types')">
          <p class="stat-label">Exam Types</p>
          <p class="stat-value">{{ stats.totalExamTypes }}</p>
          <p class="stat-detail">{{ stats.activeExamTypes }} active</p>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width:
                  getPercentage(stats.activeExamTypes, stats.totalExamTypes) +
                  '%',
              }"
            ></div>
          </div>
        </div>

        <div class="card stat-card" @click="navigateTo('exam-schedules')">
          <p class="stat-label">Exam Schedules</p>
          <p class="stat-value">{{ stats.totalSchedules }}</p>
          <p class="stat-detail">{{ stats.scheduledExams }} scheduled</p>
          <div class="progress-bar">
            <div
              class="progress-fill progress-blue"
              :style="{
                width:
                  getPercentage(stats.scheduledExams, stats.totalSchedules) +
                  '%',
              }"
            ></div>
          </div>
        </div>

        <div class="card stat-card" @click="navigateTo('exam-results')">
          <p class="stat-label">Exam Results</p>
          <p class="stat-value">{{ stats.totalResults }}</p>
          <p class="stat-detail">{{ stats.passedResults }} passed</p>
          <div class="progress-bar">
            <div
              class="progress-fill progress-green"
              :style="{
                width:
                  getPercentage(stats.passedResults, stats.totalResults) + '%',
              }"
            ></div>
          </div>
        </div>

        <div class="card stat-card">
          <p class="stat-label">Average Score</p>
          <p class="stat-value">{{ stats.averageScore.toFixed(1) }}%</p>
          <p class="stat-detail">across all exams</p>
          <div class="progress-bar">
            <div
              class="progress-fill progress-purple"
              :style="{ width: stats.averageScore + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <!-- Left Column -->
        <div class="column">
          <!-- Quick Actions -->
          <div class="card">
            <h2 class="card-title">Quick Actions</h2>
            <div class="button-stack">
              <button class="btn btn-primary" @click="navigateTo('exam-types')">
                📋 Manage Exam Types
              </button>
              <button
                class="btn btn-primary"
                @click="navigateTo('exam-schedules')"
              >
                📅 Manage Schedules
              </button>
              <button
                class="btn btn-primary"
                @click="navigateTo('exam-results')"
              >
                📊 View Results
              </button>
              <button class="btn btn-secondary" @click="refreshData">
                🔄 Refresh Data
              </button>
            </div>
          </div>

          <!-- Recent Exam Schedules -->
          <div class="card">
            <div class="card-header-flex">
              <h2 class="card-title">Recent Schedules</h2>
              <button
                class="btn btn-link"
                @click="navigateTo('exam-schedules')"
              >
                View All →
              </button>
            </div>
            <ul class="list-stack" v-if="recentSchedules.length > 0">
              <li
                v-for="schedule in recentSchedules"
                :key="schedule.id"
                class="list-item-card"
                @click="navigateTo('exam-schedules')"
              >
                <p class="item-title">{{ schedule.subject }}</p>
                <p class="item-subtitle">{{ schedule.course }}</p>
                <p class="item-subtitle">
                  {{ formatDate(schedule.examDate) }} |
                  {{ schedule.startTime }} - {{ schedule.endTime }} |
                  {{ schedule.room }}
                </p>
                <span
                  :class="[
                    'status-badge',
                    'status-' + schedule.status.toLowerCase(),
                  ]"
                >
                  {{ schedule.status }}
                </span>
              </li>
            </ul>
            <p v-else class="empty-message">No schedules found</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column">
          <!-- Exam Types Overview -->
          <div class="card">
            <div class="card-header-flex">
              <h2 class="card-title">Exam Types</h2>
              <button class="btn btn-link" @click="navigateTo('exam-types')">
                Manage →
              </button>
            </div>
            <ul class="list-stack" v-if="examTypes.length > 0">
              <li
                v-for="examType in examTypes"
                :key="examType.id"
                class="list-item-card flex-between"
              >
                <div>
                  <p class="item-title">{{ examType.name }}</p>
                  <p class="item-subtitle">{{ examType.description }}</p>
                </div>
                <span
                  :class="[
                    'status-badge',
                    examType.status === 'ACTIVE'
                      ? 'status-active'
                      : 'status-inactive',
                  ]"
                >
                  {{ examType.status }}
                </span>
              </li>
            </ul>
            <p v-else class="empty-message">No exam types found</p>
          </div>

          <!-- Recent Results -->
          <div class="card">
            <div class="card-header-flex">
              <h2 class="card-title">Recent Results</h2>
              <button class="btn btn-link" @click="navigateTo('exam-results')">
                View All →
              </button>
            </div>
            <ul class="list-stack" v-if="recentResults.length > 0">
              <li
                v-for="result in recentResults"
                :key="result.id"
                class="list-item-card flex-between"
              >
                <div>
                  <p class="item-title">
                    Student: {{ result.studentId.slice(0, 8) }}...
                  </p>
                  <p class="item-subtitle">Score: {{ result.score }}%</p>
                </div>
                <div class="result-badges">
                  <span
                    :class="[
                      'grade-badge',
                      'grade-' + result.grade.toLowerCase(),
                    ]"
                  >
                    {{ result.grade }}
                  </span>
                  <span
                    :class="[
                      'status-badge',
                      result.remarks === 'PASS' ? 'status-pass' : 'status-fail',
                    ]"
                  >
                    {{ result.remarks }}
                  </span>
                </div>
              </li>
            </ul>
            <p v-else class="empty-message">No results found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Candidate View Fallback -->
    <div v-else>
      <CandidateExamView />
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-toast">
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="close-btn">×</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  examTypesService,
  examSchedulesService,
  examResultsService,
} from "@/api/examService";
import CandidateExamView from "./CandidateExamView.vue";

// ------------------ Types ------------------
interface ExamType {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

interface ExamSchedule {
  id: string;
  subject: string;
  course: string;
  examType: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
}

interface ExamResult {
  id: string;
  studentId: string;
  score: number;
  grade: string;
  remarks: string;
}

interface Stats {
  totalExamTypes: number;
  activeExamTypes: number;
  totalSchedules: number;
  scheduledExams: number;
  totalResults: number;
  passedResults: number;
  averageScore: number;
}

// ------------------ Refs ------------------
const router = useRouter();
const loading = ref(true);
const errorMessage = ref("");
const userRole = ref<string | null>(null); // ✅ Already exists

const examTypes = ref<ExamType[]>([]);
const recentSchedules = ref<ExamSchedule[]>([]);
const recentResults = ref<ExamResult[]>([]);

const stats = ref<Stats>({
  totalExamTypes: 0,
  activeExamTypes: 0,
  totalSchedules: 0,
  scheduledExams: 0,
  totalResults: 0,
  passedResults: 0,
  averageScore: 0,
});

// ------------------ Lifecycle ------------------
onMounted(async () => {
  try {
    // ✅ SAME LOGIC AS THE WORKING PAGE
    const roles = sessionStorage.getItem("roles");

    if (roles) {
      const parsedRoles = JSON.parse(roles) as string[];
      userRole.value = parsedRoles[0] || null;
    }

    // Normalize role
    userRole.value = userRole.value?.toLowerCase() || null;

    // Load dashboard data only for admin/teacher
    if (userRole.value === "admin" || userRole.value === "teacher") {
      await fetchAllData();
    }
  } catch (error) {
    console.error("Failed to get user role", error);
    errorMessage.value = "Failed to determine user role";
  }
});

// ------------------ Methods ------------------
async function fetchAllData() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [typesRes, schedulesRes, resultsRes] = await Promise.all([
      examTypesService.getAll(0, 100),
      examSchedulesService.getAll(0, 5),
      examResultsService.getAll(0, 5),
    ]);

    // Exam Types
    examTypes.value = typesRes.data.slice(0, 5);
    stats.value.totalExamTypes = typesRes.total || typesRes.data.length;
    stats.value.activeExamTypes = typesRes.data.filter(
      (t: ExamType) => t.status === "ACTIVE",
    ).length;

    // Schedules - map nested objects to strings
    recentSchedules.value = schedulesRes.data.map((s: any) => ({
      id: s.id,
      subject: s.subject?.name || "N/A",
      course: s.course?.courseName || "N/A",
      examType: s.examType?.name || "N/A",
      examDate: s.examDate,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
      status: s.status,
    }));
    stats.value.totalSchedules = schedulesRes.total || schedulesRes.data.length;
    stats.value.scheduledExams = schedulesRes.data.filter(
      (s: ExamSchedule) => s.status === "SCHEDULED",
    ).length;

    // Results
    recentResults.value = resultsRes.data;
    stats.value.totalResults = resultsRes.total || resultsRes.data.length;
    stats.value.passedResults = resultsRes.data.filter(
      (r: ExamResult) => r.remarks === "PASS",
    ).length;

    // Average score
    if (resultsRes.data.length > 0) {
      const totalScore = resultsRes.data.reduce(
        (sum: number, r: ExamResult) => sum + Number(r.score),
        0,
      );
      stats.value.averageScore = totalScore / resultsRes.data.length;
    }
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to load exam data";
  } finally {
    loading.value = false;
  }
}

function refreshData() {
  fetchAllData();
}

function navigateTo(routeName: string) {
  router.push({ name: routeName });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
</script>

<style scoped>
/* Variables for easy theming */
:root {
  --primary-blue: #1e40af;
  --primary-hover: #1e3a8a;
  --bg-gray: #f9fafb;
  --text-main: #111827;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.dashboard-container {
  padding: 1.5rem;
  background-color: var(--bg-gray);
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
  color: var(--text-main);
}

/* Header Styles */
.dashboard-header {
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.dashboard-header p {
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--text-muted);
}

/* Grid Systems */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr 1fr;
  }
}

/* Generic Card Styles */
.card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
}

.stat-card {
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* Stats Specific */
.stat-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.stat-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.progress-bar {
  height: 0.3rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  margin-top: 0.75rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.progress-blue {
  background-color: #3b82f6;
}

.progress-green {
  background-color: #10b981;
}

.progress-purple {
  background-color: #8b5cf6;
}

/* Layout Helpers */
.column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.button-stack,
.list-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.flex-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Card Header */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header-flex .card-title {
  margin-bottom: 0;
}

/* Buttons */
.btn {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  font-weight: 500;
  font-size: 0.95rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  min-height: 40px;
  line-height: 1.4;
  box-sizing: border-box;
  font-family: inherit;
}

.btn-primary {
  background-color: var(--primary-blue) !important;
  color: rgb(1, 5, 15) !important;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-link {
  background: transparent;
  color: var(--primary-blue);
  box-shadow: none;
  width: auto;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* List Items */
.list-item-card {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.list-item-card:hover {
  background-color: #f3f4f6;
  transform: translateX(4px);
}

.item-title {
  font-weight: 600;
  margin: 0;
  color: var(--text-main);
}

.item-subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0.25rem 0 0.5rem 0;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active,
.status-pass {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive,
.status-fail {
  background-color: #fee2e2;
  color: #991b1b;
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
  background-color: #f3f4f6;
  color: #6b7280;
}

/* Grade Badges */
.grade-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  margin-right: 0.5rem;
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
  color: #c2410c;
}

.grade-f {
  background-color: #fee2e2;
  color: #991b1b;
}

.result-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Empty Message */
.empty-message {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem;
  font-style: italic;
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: #fee2e2;
  color: #991b1b;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #991b1b;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #7f1d1d;
}
</style>
