<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AttendanceTable from "@/components/AttendanceTable.vue";
import AttendanceScanner from "@/components/AttendanceScanner.vue";
import AddStudentModal from "@/components/AddStudentModal.vue";
import { ATTENDANCE_API_BASE_URL, SMS_API_BASE_URL } from "@/config/api";

type CourseOption = { id: number; name: string };
type ClassOption = {
  id: number;
  name: string;
  year: number;
  module: string;
  courseId: number | null;
  courseName: string;
  subjectId?: number | null;
};
type StudentRow = { id: string; name: string; presentDays: number[] };
type SubjectRow = {
  id: number;
  name: string;
  code: string;
  description?: string;
  lectureHours: number;
  labHours: number;
  year: number;
  semester: number;
  courseId: number;
};

const apiBaseUrl = ATTENDANCE_API_BASE_URL;
const smsApiBaseUrl = SMS_API_BASE_URL;
const YEAR_OPTIONS = [1, 2, 3, 4, 5];
const MODULE_OPTIONS = [
  "Module 1",
  "Module 2",
  "Module 3",
  "Module 4",
  "Module 5",
];
const COURSE_NAMES = [
  "Bachelor degree in Nursing and Midwifery",
  "Associate degree in Nurse",
  "Continue Primary Nurse to Associate degree",
  "Continue Primary Midwife to Associate degree",
  "Continue Primary Nurse to Associate degree",
];

const courses = ref<CourseOption[]>([]);
const classes = ref<ClassOption[]>([]);
const days = ref<number[]>([]);
const students = ref<StudentRow[]>([]);
const subjects = ref<SubjectRow[]>([]);

const selectedCourseId = ref<number | null>(null);
const selectedSubjectId = ref<number | null>(null);
const selectedYear = ref<number | null>(1);
const selectedModule = ref("Module 1");
const selectedClassId = ref<number | null>(null);
const selectedMonth = ref("");

const isLoading = ref(false);
const errorMessage = ref("");
const isInitialized = ref(false);
const isLoadingSubjects = ref(false);
const subjectsError = ref("");

const showStudentModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const modalStudent = ref<StudentRow | null>(null);
const showClassModal = ref(false);
const classNameInput = ref("");
const classError = ref("");
const isCreatingClass = ref(false);

const formatModuleLabel = (value: string) =>
  value.replace(/^module\s*/i, "Module ");

const moduleFromSemester = (semester?: number | null) => {
  if (!semester || semester < 1) return null;
  const label = `Module ${semester}`;
  return MODULE_OPTIONS.includes(label) ? label : null;
};

const defaultMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

const courseClasses = computed(() =>
  classes.value.filter(
    (item) =>
      !selectedCourseId.value || item.courseId === selectedCourseId.value,
  ),
);

const selectedCourse = computed(
  () =>
    courses.value.find((item) => item.id === selectedCourseId.value) ?? null,
);

const filteredSubjects = computed(() =>
  subjects.value.filter(
    (subject) =>
      !selectedCourseId.value || subject.courseId === selectedCourseId.value,
  ),
);

const selectedSubject = computed(
  () =>
    subjects.value.find((subject) => subject.id === selectedSubjectId.value) ??
    null,
);

const filteredClasses = computed(() => {
  const subject = selectedSubject.value;
  const subjectModule = subject ? moduleFromSemester(subject.semester) : null;
  return classes.value.filter((item) => {
    if (selectedCourseId.value && item.courseId !== selectedCourseId.value) {
      return false;
    }
    if (subject) {
      if (item.subjectId) {
        return item.subjectId === subject.id;
      }
      if (subject.year && item.year !== subject.year) return false;
      if (subjectModule && item.module !== subjectModule) return false;
    }
    return true;
  });
});

const currentClass = computed(
  () => classes.value.find((item) => item.id === selectedClassId.value) ?? null,
);

const classLabel = computed(() => {
  const courseName =
    currentClass.value?.courseName ?? selectedCourse.value?.name ?? "Course";
  const subjectName = selectedSubject.value?.name ?? "Subject";
  if (currentClass.value) {
    return `${courseName} - ${subjectName} - ${currentClass.value.name}`;
  }
  if (selectedSubject.value) {
    return `${courseName} - ${subjectName} - No class`;
  }
  return `${courseName} - No class selected`;
});

const classOptions = computed(() => {
  return filteredClasses.value.map((item) => ({
    id: item.id,
    label: item.name || `Class ${item.id}`,
  }));
});

const selectedClassLabel = computed(
  () =>
    classOptions.value.find((option) => option.id === selectedClassId.value)
      ?.label ??
    classOptions.value[0]?.label ??
    classLabel.value,
);

const selectionKey = computed(
  () =>
    `${selectedCourseId.value ?? "none"}|${selectedSubjectId.value ?? "none"}|${selectedClassId.value ?? "none"}|${selectedMonth.value}`,
);

const courseNameById = computed(() => {
  const map = new Map<number, string>();
  for (const course of courses.value) {
    map.set(course.id, course.name);
  }
  return map;
});

const resolveCourseName = (courseId?: number | null) =>
  courseNameById.value.get(courseId ?? -1) ?? "Unknown Course";

const subjectsForDisplay = computed(() => {
  if (!selectedCourseId.value) return subjects.value;
  return subjects.value.filter(
    (subject) => subject.courseId === selectedCourseId.value,
  );
});

const hydrateCoursesFromClasses = () => {
  if (courses.value.length > 0) return;
  if (classes.value.length === 0) return;
  const seen = new Map<number, CourseOption>();
  for (const item of classes.value) {
    if (!item.courseId) continue;
    if (!seen.has(item.courseId)) {
      seen.set(item.courseId, { id: item.courseId, name: item.courseName });
    }
  }
  courses.value = Array.from(seen.values());
};

const syncSelection = () => {
  if (courses.value.length > 0) {
    const hasCourse = courses.value.some(
      (item) => item.id === selectedCourseId.value,
    );
    if (!hasCourse) {
      selectedCourseId.value = courses.value[0].id;
    }
  } else if (!selectedCourseId.value && classes.value.length > 0) {
    selectedCourseId.value = classes.value[0].courseId;
  }

  const subjectOptions = filteredSubjects.value;
  if (subjectOptions.length === 0) {
    selectedSubjectId.value = null;
  } else if (
    !selectedSubjectId.value ||
    !subjectOptions.some((item) => item.id === selectedSubjectId.value)
  ) {
    selectedSubjectId.value = subjectOptions[0].id;
  }

  if (selectedSubjectId.value) {
    const subject = subjects.value.find(
      (item) => item.id === selectedSubjectId.value,
    );
    if (subject) {
      selectedYear.value =
        subject.year ?? selectedYear.value ?? YEAR_OPTIONS[0];
      const subjectModule = moduleFromSemester(subject.semester);
      if (subjectModule) {
        selectedModule.value = subjectModule;
      }
    }
  }

  if (!selectedYear.value || !YEAR_OPTIONS.includes(selectedYear.value)) {
    selectedYear.value = YEAR_OPTIONS[0];
  }

  if (!MODULE_OPTIONS.includes(selectedModule.value)) {
    selectedModule.value = MODULE_OPTIONS[0];
  }

  const options = filteredClasses.value;
  if (options.length === 0) {
    selectedClassId.value = null;
  } else if (
    !selectedClassId.value ||
    !options.some((item) => item.id === selectedClassId.value)
  ) {
    selectedClassId.value = options[0].id;
  }
};

const fetchCourses = async () => {
  const staticCourses = COURSE_NAMES.map((name, index) => ({
    id: index + 1,
    name,
  }));
  let list: CourseOption[] = [];
  try {
    const response = await fetch(`${apiBaseUrl}/courses`);
    if (!response.ok) {
      throw new Error("Failed to load courses");
    }
    const data = await response.json();
    list = Array.isArray(data) ? data : [];
  } catch (error) {
    list = [];
  }
  const buckets = new Map<string, CourseOption[]>();
  for (const course of list) {
    const key = course.name.trim().toLowerCase();
    const existing = buckets.get(key) ?? [];
    existing.push(course);
    buckets.set(key, existing);
  }
  const ordered: CourseOption[] = [];
  for (const name of COURSE_NAMES) {
    const bucket = buckets.get(name.trim().toLowerCase());
    if (bucket && bucket.length > 0) {
      ordered.push(bucket.shift() as CourseOption);
    }
  }
  courses.value = ordered.length > 0 ? ordered : list;
  if (courses.value.length === 0) {
    courses.value = staticCourses;
  }
  if (courses.value.length > 0) {
    const hasCourse = courses.value.some(
      (item) => item.id === selectedCourseId.value,
    );
    if (!hasCourse) {
      selectedCourseId.value = courses.value[0].id;
    }
  }
};

const fetchClasses = async () => {
  const response = await fetch(`${apiBaseUrl}/classes`);
  if (!response.ok) {
    throw new Error("Failed to load classes");
  }
  const data = await response.json();
  classes.value = Array.isArray(data) ? data : [];
  hydrateCoursesFromClasses();
};

const fetchSubjects = async () => {
  isLoadingSubjects.value = true;
  subjectsError.value = "";
  try {
    const response = await fetch(`${smsApiBaseUrl}/curriculum`);
    if (!response.ok) {
      throw new Error("Failed to load subjects");
    }
    const data = await response.json();
    subjects.value = Array.isArray(data) ? data : [];
  } catch (error) {
    subjectsError.value = "Unable to load subject data.";
    subjects.value = [];
  } finally {
    isLoadingSubjects.value = false;
  }
};

const loadAttendance = async () => {
  if (!selectedMonth.value) {
    selectedMonth.value = defaultMonth();
  }

  const target = currentClass.value ?? null;
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const params = new URLSearchParams();
    if (target?.id) params.set("classId", String(target.id));
    if (selectedMonth.value) params.set("month", selectedMonth.value);
    const response = await fetch(`${apiBaseUrl}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to load attendance");
    }
    const data = await response.json();
    days.value = Array.isArray(data?.days) ? data.days : [];
    students.value = Array.isArray(data?.students) ? data.students : [];
  } catch (error) {
    errorMessage.value = "Unable to load attendance data.";
    days.value = [];
    students.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadInitial = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    await Promise.all([fetchCourses(), fetchClasses(), fetchSubjects()]);
    hydrateCoursesFromClasses();
    syncSelection();
    await loadAttendance();
  } catch (error) {
    errorMessage.value = "Unable to load attendance data.";
  } finally {
    isLoading.value = false;
  }
};

const handleSelectCourse = (id: number) => {
  selectedCourseId.value = id;
  syncSelection();
};

const handleSelectSubject = (id: number) => {
  selectedSubjectId.value = Number.isFinite(id) ? id : null;
  if (selectedSubjectId.value) {
    const subject = subjects.value.find(
      (item) => item.id === selectedSubjectId.value,
    );
    if (subject) {
      selectedYear.value = subject.year ?? selectedYear.value ?? 1;
      const subjectModule = moduleFromSemester(subject.semester);
      if (subjectModule) {
        selectedModule.value = subjectModule;
      }
    }
  }
  syncSelection();
};

const handleSelectClass = (id: number) => {
  selectedClassId.value = Number.isFinite(id) ? id : null;
  const match = classes.value.find((item) => item.id === id);
  if (match) {
    if (match.subjectId) {
      selectedSubjectId.value = match.subjectId;
    }
    selectedYear.value = match.year;
    selectedModule.value = match.module;
  }
};

const handleSelectMonth = (value: string) => {
  selectedMonth.value = value;
};

const openClassModal = () => {
  classNameInput.value = "";
  classError.value = "";
  showClassModal.value = true;
};

const closeClassModal = () => {
  if (isCreatingClass.value) return;
  showClassModal.value = false;
  classError.value = "";
};

const submitClass = async () => {
  if (!selectedCourseId.value) {
    classError.value = "Select a course first.";
    return;
  }
  if (!selectedSubjectId.value) {
    classError.value = "Select a subject first.";
    return;
  }
  isCreatingClass.value = true;
  classError.value = "";

  const subject = selectedSubject.value ?? null;
  const derivedYear = subject?.year ?? selectedYear.value ?? 1;
  const derivedModule =
    (moduleFromSemester(subject?.semester ?? null) ?? selectedModule.value) || "Module 1";

  const payload = {
    name: classNameInput.value.trim() || undefined,
    courseId: selectedCourseId.value,
    subjectId: subject?.id ?? undefined,
    year: derivedYear,
    module: derivedModule,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      classError.value = "Failed to create class.";
      return;
    }

    const data = await response.json();
    await fetchClasses();
    if (data?.id) {
      const match = classes.value.find((item) => item.id === Number(data.id));
      if (match) {
        selectedCourseId.value = match.courseId;
        selectedYear.value = match.year;
        selectedModule.value = match.module;
        selectedClassId.value = match.id;
      }
    }
    syncSelection();
    showClassModal.value = false;
  } catch (error) {
    classError.value = "Failed to create class.";
  } finally {
    isCreatingClass.value = false;
  }
};

const handleDeleteClass = async () => {
  if (!currentClass.value) return;
  const confirmed = window.confirm("Remove this class and all its students?");
  if (!confirmed) return;

  const response = await fetch(
    `${apiBaseUrl}/classes/${currentClass.value.id}?confirm=confirm`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    errorMessage.value = "Failed to delete class.";
    return;
  }

  await fetchClasses();
  syncSelection();
  await loadAttendance();
};

const openAddStudent = () => {
  modalMode.value = "add";
  modalStudent.value = null;
  showStudentModal.value = true;
};

const openEditStudent = (student: StudentRow) => {
  modalMode.value = "edit";
  modalStudent.value = student;
  showStudentModal.value = true;
};

const closeStudentModal = () => {
  showStudentModal.value = false;
};

const handleStudentSaved = async (payload?: { classId?: number }) => {
  await fetchClasses();
  if (payload?.classId) {
    const match = classes.value.find((item) => item.id === payload.classId);
    if (match) {
      selectedCourseId.value = match.courseId;
      selectedYear.value = match.year;
      selectedModule.value = match.module;
      selectedClassId.value = match.id;
    }
  }
  syncSelection();
  await loadAttendance();
};

const handleDeleteStudent = async (studentId: string) => {
  if (!currentClass.value) return;
  const confirmed = window.confirm("Remove this student from the class?");
  if (!confirmed) return;

  const response = await fetch(
    `${apiBaseUrl}/classes/${currentClass.value.id}/students/${encodeURIComponent(studentId)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    errorMessage.value = "Failed to delete student.";
    return;
  }

  await loadAttendance();
};

const handleToggleAttendance = async (payload: {
  studentId: string;
  day: number;
  present: boolean;
}) => {
  if (!currentClass.value) return;
  const monthValue = selectedMonth.value || defaultMonth();
  const date = `${monthValue}-${String(payload.day).padStart(2, "0")}`;

  const response = await fetch(`${apiBaseUrl}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      classId: currentClass.value.id,
      studentCode: payload.studentId,
      attendanceDate: date,
      present: payload.present,
    }),
  });

  if (!response.ok) {
    errorMessage.value = "Failed to update attendance.";
    return;
  }

  const student = students.value.find((item) => item.id === payload.studentId);
  if (!student) return;
  if (payload.present && !student.presentDays.includes(payload.day)) {
    student.presentDays.push(payload.day);
  }
  if (!payload.present) {
    student.presentDays = student.presentDays.filter(
      (day) => day !== payload.day,
    );
  }
};

const handleExportPdf = () => {
  if (students.value.length === 0) {
    window.alert("No attendance data to export yet.");
    return;
  }

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });

  const headerCells = days.value.map((day) => `<th>${day}</th>`).join("");
  const bodyRows = students.value
    .map((student) => {
      const dayCells = days.value
        .map((day) => (student.presentDays.includes(day) ? "✓" : ""))
        .map((value) => `<td>${value}</td>`)
        .join("");
      return `<tr><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.id)}</td>${dayCells}</tr>`;
    })
    .join("");

  const title = escapeHtml(classLabel.value);
  const monthLabel = escapeHtml(selectedMonth.value || defaultMonth());
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Attendance Export</title>
      <style>
        body { font-family: 'Nunito', Arial, sans-serif; margin: 24px; color: #111827; }
        h1 { margin: 0 0 6px; font-size: 20px; }
        .meta { margin: 0 0 18px; color: #4b5563; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 6px; text-align: center; }
        th { background: #f3f4f6; font-weight: 700; }
        td:first-child, th:first-child { text-align: left; min-width: 160px; }
        td:nth-child(2), th:nth-child(2) { min-width: 90px; }
      </style>
    </head>
    <body>
      <h1>Student Attendance</h1>
      <p class="meta">${title} · ${monthLabel}</p>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>ID</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </body>
  </html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

onMounted(async () => {
  selectedMonth.value = defaultMonth();
  await loadInitial();
  isInitialized.value = true;
});

watch(selectionKey, () => {
  if (!isInitialized.value) return;
  loadAttendance();
});
</script>

<template>
  <section class="attendance-page">
    <header class="page-header">
      <div>
        <h1>Attendance</h1>
        <p>Track attendance and manage student check-ins.</p>
      </div>
      <div class="header-meta">
        <span>{{ classLabel }}</span>
      </div>
    </header>

    <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>

    <div v-if="isLoading" class="loading">Loading attendance...</div>

    <div v-else class="attendance-grid">
      <AttendanceTable
        :days="days"
        :students="students"
        :courses="courses"
        :subjects="filteredSubjects"
        :class-options="classOptions"
        :selected-course-id="selectedCourseId"
        :selected-subject-id="selectedSubjectId"
        :selected-class-id="selectedClassId"
        :selected-month="selectedMonth"
        @select-course="handleSelectCourse"
        @select-subject="handleSelectSubject"
        @select-class="handleSelectClass"
        @select-month="handleSelectMonth"
        @edit-student="openEditStudent"
        @delete-student="handleDeleteStudent"
        @add-class="openClassModal"
        @delete-class="handleDeleteClass"
        @export-pdf="handleExportPdf"
        @toggle-attendance="handleToggleAttendance"
      />

      <section class="subjects-panel">
        <div class="subjects-header">
          <div>
            <p class="subjects-kicker">Curriculum Subjects</p>
            <h2>Subject Overview</h2>
            <p class="subjects-subtitle">
              {{ selectedCourse?.name || "All courses" }}
            </p>
          </div>
          <div class="subjects-meta">
            <span>{{ subjectsForDisplay.length }}</span>
            <span>Subjects</span>
          </div>
        </div>

        <p v-if="subjectsError" class="message error">{{ subjectsError }}</p>
        <div v-else-if="isLoadingSubjects" class="loading">
          Loading subjects...
        </div>

        <div v-else class="subjects-table">
          <div class="subjects-row head">
            <div class="cell id">ID</div>
            <div class="cell subject">Subject</div>
            <div class="cell code">Code</div>
            <div class="cell course">Course</div>
            <div class="cell hours">Lecture</div>
            <div class="cell hours">Lab</div>
            <div class="cell term">Year</div>
            <div class="cell term">Semester</div>
            <div class="cell desc">Description</div>
          </div>

          <div
            v-for="subject in subjectsForDisplay"
            :key="subject.id"
            class="subjects-row"
          >
            <div class="cell id">{{ subject.id }}</div>
            <div class="cell subject">
              <span class="subject-name">{{ subject.name }}</span>
            </div>
            <div class="cell code">{{ subject.code }}</div>
            <div class="cell course">
              <span class="course-name">{{ resolveCourseName(subject.courseId) }}</span>
              <span class="course-id">#{{ subject.courseId }}</span>
            </div>
            <div class="cell hours">{{ subject.lectureHours }}</div>
            <div class="cell hours">{{ subject.labHours }}</div>
            <div class="cell term">{{ subject.year }}</div>
            <div class="cell term">{{ subject.semester }}</div>
            <div class="cell desc">
              <span class="subject-desc">
                {{ subject.description || "No description" }}
              </span>
            </div>
          </div>

          <p v-if="subjectsForDisplay.length === 0" class="subjects-empty">
            No subjects found for this course.
          </p>
        </div>
      </section>

      <AttendanceScanner
        :class-id="currentClass?.id ?? null"
        :class-label="classLabel"
        :students-count="students.length"
      />
    </div>

    <AddStudentModal
      :open="showStudentModal"
      :mode="modalMode"
      :student="modalStudent"
      :class-options="classOptions"
      :selected-class-id="selectedClassId"
      :selected-class-label="selectedClassLabel"
      :selected-course-id="selectedCourseId"
      :selected-year="selectedYear"
      :selected-module="selectedModule"
      :api-base-url="apiBaseUrl"
      @close="closeStudentModal"
      @saved="handleStudentSaved"
    />

    <div v-if="showClassModal" class="modal-backdrop" @click="closeClassModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Add Class</h2>
          <button class="modal-close" type="button" @click="closeClassModal">
            ✕
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-meta">
            <p>
              <strong>Course:</strong>
              {{ selectedCourse?.name || "Select a course" }}
            </p>
            <p>
              <strong>Subject:</strong>
              {{ selectedSubject?.name || "Select a subject" }}
            </p>
          </div>
          <label class="modal-field">
            <span>Class Name (optional)</span>
            <input v-model="classNameInput" type="text" placeholder="Class 1" />
          </label>
          <p v-if="classError" class="modal-error">{{ classError }}</p>
        </div>
        <div class="modal-actions">
          <button class="ghost" type="button" @click="closeClassModal">
            Cancel
          </button>
          <button
            class="primary"
            type="button"
            :disabled="!selectedCourseId || !selectedSubjectId || isCreatingClass"
            @click="submitClass"
          >
            {{ isCreatingClass ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attendance-page {
  padding: 24px 28px 32px;
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  margin: 0;
  font-size: 1.6rem;
}

.page-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-weight: 600;
}

.header-meta {
  background: #ffffff;
  border: 1px solid #e6ebf2;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  color: #2f3a4a;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.attendance-grid {
  display: grid;
  gap: 20px;
}

.subjects-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 24px 26px;
  border: 1px solid #eef1f5;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.subjects-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.subjects-kicker {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9aa5b1;
  font-weight: 700;
}

.subjects-header h2 {
  margin: 6px 0 2px;
  font-size: 1.3rem;
}

.subjects-subtitle {
  margin: 0;
  color: #6b7280;
  font-weight: 600;
}

.subjects-meta {
  display: grid;
  justify-items: end;
  background: #f5f8fc;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  color: #2b2d35;
  min-width: 120px;
}

.subjects-meta span:first-child {
  font-size: 1.2rem;
}

.subjects-table {
  display: grid;
  gap: 10px;
  overflow: auto;
  padding-bottom: 4px;
}

.subjects-row {
  display: grid;
  grid-template-columns: 60px 200px 90px 220px 80px 80px 70px 90px minmax(220px, 1fr);
  gap: 12px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  padding: 10px 12px;
  min-width: 980px;
}

.subjects-row.head {
  background: #eef4f9;
  font-weight: 700;
  color: #1d2a37;
}

.subjects-row .cell {
  font-size: 0.9rem;
  color: #4b5563;
}

.subjects-row.head .cell {
  color: #1f2937;
}

.subject-name {
  font-weight: 700;
  color: #243244;
}

.course-name {
  font-weight: 600;
  color: #344256;
}

.course-id {
  display: block;
  font-size: 0.78rem;
  color: #8a94a6;
  font-weight: 600;
  margin-top: 2px;
}

.subject-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subjects-empty {
  margin: 4px 0 0;
  color: #6b7280;
  font-weight: 600;
}

.loading {
  color: #52606d;
  font-weight: 600;
}

.message {
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
}

.message.error {
  background: #fff4f4;
  color: #b0403a;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 20;
  padding: 16px;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  width: min(560px, 95vw);
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

.modal-meta {
  display: grid;
  gap: 4px;
  color: #4b5563;
  font-weight: 600;
}

.modal-field {
  display: grid;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-field input {
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

@media (max-width: 900px) {
  .attendance-page {
    padding: 20px;
  }
}
</style>
