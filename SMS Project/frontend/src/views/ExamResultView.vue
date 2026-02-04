<template>
  <div class="exam-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button @click="$router.back()" class="back-button">← Back</button>
        <h1>Exam Results</h1>
        <p>View and manage student exam results</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <span>+ Add Result</span>
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
          <label>Search by Student ID</label>
          <input
            v-model="filters.studentId"
            @input="debouncedFetch"
            type="text"
            placeholder="Enter Student ID"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Filter by Exam Schedule</label>
          <select v-model="filters.examScheduleId" @change="fetchResults" class="form-control">
            <option value="">All Schedules</option>
            <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
              {{ schedule.subject }} - {{ formatDate(schedule.examDate) }}
            </option>
          </select>
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
      <div>Loading results...</div>
    </div>

    <!-- Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Exam Subject</th>
            <th>Exam Date</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Remarks</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.id">
            <td>
              <strong>{{ result.studentId.slice(0, 8) }}...</strong>
            </td>
            <td>{{ result.examSchedule?.subject || 'N/A' }}</td>
            <td>
              {{ result.examSchedule?.examDate ? formatDate(result.examSchedule.examDate) : 'N/A' }}
            </td>
            <td>{{ result.score }}%</td>
            <td>
              <span :class="['grade-badge', 'grade-' + result.grade.toLowerCase()]">
                {{ result.grade }}
              </span>
            </td>
            <td>
              <span
                :class="['status-badge', result.remarks === 'PASS' ? 'status-pass' : 'status-fail']"
              >
                {{ result.remarks }}
              </span>
            </td>
            <td class="actions">
              <button @click="editResult(result)" class="action-link edit">Edit</button>
              <button @click="deleteResult(result.id)" class="action-link delete">Delete</button>
            </td>
          </tr>
          <tr v-if="results.length === 0">
            <td colspan="7" class="empty-state">No exam results found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box">
          <h2>{{ isEditing ? 'Edit Exam Result' : 'Add New Result' }}</h2>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>Student ID</label>
              <input
                v-model="form.studentId"
                required
                type="text"
                class="form-control"
                placeholder="Enter student UUID"
              />
            </div>

            <div class="form-group">
              <label>Exam Schedule</label>
              <select v-model="form.examScheduleId" required class="form-control">
                <option value="">Select Schedule</option>
                <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
                  {{ schedule.subject }} - {{ formatDate(schedule.examDate) }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Score (0-100)</label>
              <input
                v-model.number="form.score"
                required
                type="number"
                min="0"
                max="100"
                step="0.01"
                class="form-control"
              />
            </div>

            <div class="grade-preview" v-if="form.score !== null && form.score !== undefined">
              <span class="preview-label">Auto Grade:</span>
              <span :class="['grade-badge', 'grade-' + calculateGrade(form.score).toLowerCase()]">
                {{ calculateGrade(form.score) }}
              </span>
              <span :class="['status-badge', form.score >= 50 ? 'status-pass' : 'status-fail']">
                {{ form.score >= 50 ? 'PASS' : 'FAIL' }}
              </span>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'Update' : 'Add Result' }}
              </button>
              <button type="button" @click="closeModal()" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-box">
          <h3>Delete Result</h3>
          <p class="confirm-text">Are you sure? This action cannot be undone.</p>
          <div class="form-actions">
            <button @click="confirmDelete()" class="btn btn-danger">Delete</button>
            <button @click="showDeleteConfirm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { examSchedulesService, examResultsService } from '@/api/examService'

interface ExamSchedule {
  id: string
  subject: string
  examDate: string
}

interface ExamResult {
  id: string
  studentId: string
  examScheduleId: string
  score: number
  grade: string
  remarks: string
  examSchedule?: ExamSchedule
}

const results = ref<ExamResult[]>([])
const schedules = ref<ExamSchedule[]>([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const deleteId = ref<string | null>(null)

const filters = ref({
  studentId: '',
  examScheduleId: '',
})

const form = ref({
  studentId: '',
  examScheduleId: '',
  score: 0,
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadSchedules()
  fetchResults()
})

async function loadSchedules() {
  try {
    const response = await examSchedulesService.getAll(0, 100)
    schedules.value = response.data
  } catch (error) {
    console.error('Failed to load schedules')
  }
}

async function fetchResults() {
  loading.value = true
  try {
    const response = await examResultsService.getAll(
      0,
      100,
      filters.value.studentId || undefined,
      filters.value.examScheduleId || undefined,
    )
    results.value = response.data
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load results'
  } finally {
    loading.value = false
  }
}

function debouncedFetch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchResults()
  }, 500)
}

function clearFilters() {
  filters.value = { studentId: '', examScheduleId: '' }
  fetchResults()
}

function openModal() {
  isEditing.value = false
  form.value = {
    studentId: '',
    examScheduleId: '',
    score: 0,
  }
  showModal.value = true
}

function editResult(result: ExamResult) {
  isEditing.value = true
  form.value = {
    studentId: result.studentId,
    examScheduleId: result.examScheduleId,
    score: result.score,
  }
  ;(form.value as any).id = result.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  try {
    if (isEditing.value && (form.value as any).id) {
      await examResultsService.update((form.value as any).id, form.value)
      successMessage.value = 'Result updated successfully'
    } else {
      await examResultsService.create(form.value)
      successMessage.value = 'Result added successfully'
    }
    closeModal()
    await fetchResults()
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to save result'
  }
}

function deleteResult(id: string) {
  deleteId.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!deleteId.value) return
  try {
    await examResultsService.delete(deleteId.value)
    successMessage.value = 'Result deleted successfully'
    await fetchResults()
    showDeleteConfirm.value = false
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete result'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function calculateGrade(score: number): string {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
</script>

<style scoped>
/* Container */
.exam-container {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
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

/* Grade Badge */
.grade-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
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
  color: #c2410c;
}

.grade-f {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Status Badge */
.status-badge {
  display: inline-block;
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

/* Grade Preview */
.grade-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.preview-label {
  font-size: 0.875rem;
  color: #6b7280;
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
