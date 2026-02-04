<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ClassOption = { id: number; label: string }
type StudentInfo = { id: string; name: string }

const props = defineProps<{
  open: boolean
  mode: 'add' | 'edit'
  student: StudentInfo | null
  classOptions: ClassOption[]
  selectedClassId: number | null
  selectedClassLabel: string
  selectedCourseId: number | null
  selectedYear: number | null
  selectedModule: string
  apiBaseUrl: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'saved', payload?: { classId?: number }): void
}>()

const formName = ref('')
const formCode = ref('')
const originalCode = ref('')
const formError = ref('')
const isSubmitting = ref(false)
const studentClassId = ref<number | null>(null)

const canCreateClass = computed(
  () => Boolean(props.selectedCourseId) && Boolean(props.selectedYear) && props.selectedModule.trim() !== '',
)
const canSubmit = computed(
  () =>
    formName.value.trim() !== '' &&
    formCode.value.trim() !== '' &&
    (Boolean(studentClassId.value) || canCreateClass.value),
)

const resetForm = () => {
  if (props.mode === 'edit' && props.student) {
    formName.value = props.student.name
    formCode.value = props.student.id
    originalCode.value = props.student.id
  } else {
    formName.value = ''
    formCode.value = ''
    originalCode.value = ''
  }
  formError.value = ''
  const selectedInOptions = props.classOptions.some((option) => option.id === props.selectedClassId)
  if (selectedInOptions) {
    studentClassId.value = props.selectedClassId
  } else {
    studentClassId.value = props.classOptions[0]?.id ?? null
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      resetForm()
      return
    }
    formError.value = ''
    isSubmitting.value = false
  },
)

watch(
  () => props.classOptions,
  () => {
    if (!props.open) return
    if (props.classOptions.length === 0) {
      studentClassId.value = null
      return
    }
    const hasSelected = props.classOptions.some((option) => option.id === studentClassId.value)
    if (!hasSelected) {
      const selectedInOptions = props.classOptions.some((option) => option.id === props.selectedClassId)
      studentClassId.value = selectedInOptions ? props.selectedClassId : props.classOptions[0]?.id ?? null
    }
  },
  { deep: true },
)

watch(
  () => props.selectedClassId,
  (value) => {
    if (!props.open) return
    if (!value) return
    const inOptions = props.classOptions.some((option) => option.id === value)
    if (inOptions) {
      studentClassId.value = value
    }
  },
)

const ensureClassId = async () => {
  if (studentClassId.value) return studentClassId.value
  if (!canCreateClass.value) return null

  const response = await fetch(`${props.apiBaseUrl}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: props.selectedCourseId,
      year: props.selectedYear,
      module: props.selectedModule.trim(),
    }),
  })

  if (!response.ok) {
    formError.value = 'Failed to create class'
    return null
  }

  const data = await response.json()
  if (!data?.id) {
    formError.value = 'Failed to create class'
    return null
  }

  studentClassId.value = Number(data.id)
  return studentClassId.value
}

const close = () => {
  if (isSubmitting.value) return
  emit('close')
}

const submitStudent = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true
  formError.value = ''

  try {
    const classId = await ensureClassId()
    if (!classId) {
      formError.value = 'No class selected'
      return
    }

    const payload = {
      fullName: formName.value.trim(),
      studentCode: formCode.value.trim(),
      classId,
    }

    const response =
      props.mode === 'edit' && originalCode.value
        ? await fetch(`${props.apiBaseUrl}/students/${encodeURIComponent(originalCode.value)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch(`${props.apiBaseUrl}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

    if (!response.ok) {
      formError.value = props.mode === 'edit' ? 'Failed to update student' : 'Failed to add student'
      return
    }

    emit('saved', { classId })
    emit('close')
  } catch (error) {
    formError.value = props.mode === 'edit' ? 'Failed to update student' : 'Failed to add student'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click="close">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>{{ props.mode === 'edit' ? 'Edit Student' : 'Add Student' }}</h2>
        <button class="modal-close" type="button" @click="close">✕</button>
      </div>
      <div class="modal-body">
        <label class="modal-field">
          <span>Student Name</span>
          <input v-model="formName" type="text" placeholder="Student name" />
        </label>
        <label class="modal-field">
          <span>Student ID</span>
          <input v-model="formCode" type="text" placeholder="ST-011" />
        </label>
        <label class="modal-field">
          <span>Class</span>
          <template v-if="classOptions.length > 0">
            <select v-model.number="studentClassId" disabled>
              <option v-for="klass in classOptions" :key="klass.id" :value="klass.id">
                {{ klass.label }}
              </option>
            </select>
          </template>
          <template v-else>
            <input type="text" :value="selectedClassLabel" readonly />
          </template>
        </label>
        <p v-if="classOptions.length === 0" class="modal-hint">
          No class found yet for this course/year/class. It will be created when you save.
        </p>
        <p v-if="formError" class="modal-error">{{ formError }}</p>
      </div>
      <div class="modal-actions">
        <button class="ghost" type="button" @click="close">Cancel</button>
        <button class="primary" type="button" :disabled="!canSubmit || isSubmitting" @click="submitStudent">
          {{ isSubmitting ? 'Saving...' : props.mode === 'edit' ? 'Update' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 10;
  padding: 16px;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  width: min(420px, 100%);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
  padding: 18px 20px 20px;
  display: grid;
  gap: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
  display: grid;
  gap: 12px;
}

.modal-field {
  display: grid;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-field input,
.modal-field select {
  width: 100%;
  max-width: 100%;
  border: 1px solid #e1e3ea;
  background: #f9fafb;
  border-radius: 10px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 0.95rem;
}

.modal-error {
  margin: 0;
  color: #b0403a;
  font-weight: 600;
}

.modal-hint {
  margin: 0;
  color: #7b8794;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ghost {
  border: 1px solid #d9dfe7;
  background: transparent;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary {
  border: none;
  background: #5ba4d5;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
