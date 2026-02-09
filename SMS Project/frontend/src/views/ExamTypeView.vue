<template>
  <div class="exam-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button @click="$router.back()" class="back-button">← Back</button>
        <h1>Exam Types</h1>
        <p>Manage exam types and categories</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <span>+ Add Exam Type</span>
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="message message-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="message message-error">
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div>Loading exam types...</div>
    </div>

    <!-- Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Room</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="examType in examTypes" :key="examType.id">
            <td>
              <strong>{{ examType.name }}</strong>
            </td>
            <td>{{ examType.room || "-" }}</td>
            <td>{{ examType.description }}</td>
            <td>
              <button
                @click="toggleStatus(examType.id)"
                :class="[
                  'status-badge',
                  examType.status === 'ACTIVE'
                    ? 'status-active'
                    : 'status-inactive',
                ]"
              >
                {{ examType.status }}
              </button>
            </td>
            <td>
              {{
                examType.createdAt
                  ? new Date(examType.createdAt).toLocaleDateString()
                  : "-"
              }}
            </td>
            <td class="actions">
              <button @click="editExamType(examType)" class="action-link edit">
                Edit
              </button>
              <button
                @click="deleteExamType(examType.id)"
                class="action-link delete"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="examTypes.length === 0">
            <td colspan="6" class="empty-state">
              No exam types found. Create one to get started.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box">
          <h2>{{ isEditing ? "Edit Exam Type" : "Add New Exam Type" }}</h2>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>Exam Type Name</label>
              <input
                v-model="form.name"
                required
                type="text"
                maxlength="100"
                class="form-control"
                placeholder="e.g., Midterm, Final, Quiz"
              />
            </div>

            <div class="form-group">
              <label>Room Number</label>
              <input
                v-model="form.room"
                type="text"
                maxlength="100"
                class="form-control"
                placeholder="e.g., Room 101, Hall A"
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="form.description"
                required
                minlength="5"
                maxlength="255"
                class="form-control"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status" class="form-control">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Update" : "Create" }}
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
          <h3>Delete Exam Type</h3>
          <p class="confirm-text">
            Are you sure you want to delete this exam type? This action cannot
            be undone.
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
import { ref, onMounted } from "vue";
import { examTypesService } from "@/api/examService";

interface ExamType {
  id: string;
  name: string;
  room: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string | Date;
}

const examTypes = ref<ExamType[]>([]);
const loading = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const deleteId = ref<string | null>(null);

const form = ref<{
  id?: string;
  name: string;
  room: string;
  description: string;
  status: string;
}>({
  id: undefined,
  name: "",
  room: "",
  description: "",
  status: "ACTIVE",
});

onMounted(async () => {
  await fetchExamTypes();
});

async function fetchExamTypes() {
  loading.value = true;
  try {
    const response = await examTypesService.getAll(0, 100);

    examTypes.value = response.data.map((e: any) => ({
      id: e.id,
      name: e.name,
      room: e.room || "",
      description: e.description,
      status: e.status,
      createdAt: e.createdAt,
    }));
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to load exam types";
  } finally {
    loading.value = false;
  }
}

function openModal() {
  isEditing.value = false;
  form.value = {
    name: "",
    room: "",
    description: "",
    status: "ACTIVE",
  };
  showModal.value = true;
}

function editExamType(examType: any) {
  isEditing.value = true;

  form.value = {
    id: examType.id,
    name: examType.name,
    room: examType.room || "",
    description: examType.description,
    status: examType.status,
  };

  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  form.value = {
    name: "",
    room: "",
    description: "",
    status: "ACTIVE",
  };
}

async function submitForm() {
  try {
    if (isEditing.value && form.value.id) {
      await examTypesService.update((form.value as any).id, form.value);
      successMessage.value = "Exam type updated successfully";
    } else {
      await examTypesService.create(form.value);
      successMessage.value = "Exam type created successfully";
    }
    closeModal();
    await fetchExamTypes();
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to save exam type";
  }
}

async function toggleStatus(id: string) {
  try {
    await examTypesService.toggleStatus(id);
    successMessage.value = "Status updated successfully";
    await fetchExamTypes();
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to toggle status";
  }
}

function deleteExamType(id: string) {
  deleteId.value = id;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!deleteId.value) return;
  try {
    await examTypesService.delete(deleteId.value);
    successMessage.value = "Exam type deleted successfully";
    await fetchExamTypes();
    showDeleteConfirm.value = false;
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Failed to delete exam type";
  }
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

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
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

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-active:hover {
  background-color: #a7f3d0;
}

.status-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-inactive:hover {
  background-color: #fecaca;
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

textarea.form-control {
  resize: vertical;
  min-height: 80px;
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
