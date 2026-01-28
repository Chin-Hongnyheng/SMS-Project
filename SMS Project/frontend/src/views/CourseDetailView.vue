<!-- <template>
  <div class="detail-page">
    <button @click="$router.back()" class="back-btn">
      <font-awesome-icon :icon="fas.arrowLeft" /> Back
    </button>
    <div class="container">
        <div class="CourseNameHeader">
            <img :src="B1" alt="Course Image" class="course image">
            <h1>{{ courseName }}</h1>
        </div>
        <div class="year bar container">Foundation Year</div>
        <div class="year bar container">Year 1</div>
        <div class="year bar container">Year 2</div>
        <div class="year bar container">Year 3</div>
        <div class="year bar container">Final Year</div>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute();
    const courseId = Number(route.params.id);
    const courseName = ref('');

    import B1 from '@/assets/B1.png';
    import B2 from '@/assets/B2.png';
    import B3 from '@/assets/B3.png';
    import B4 from '@/assets/B4.png';
    import B5 from '@/assets/B5.png';

    const courses = {
      1: 'Bachelor degree in Nursing and Midwifery',
      2: 'Associate degree in Nurse',
      3: 'Continue Primary Nurse to Associate degree',
      4: 'Continue Primary Midwife to Associate degree',
      5: 'Continue Primary Nurse to Associate degree',
    };

    onMounted(() => {
      courseName.value = courses[courseId] || 'Unknown Course';
    });

    const fas = {
      arrowLeft: 'circle-arrow-left',
    };
</script>

<style scoped>
  .back-btn { 
    cursor: pointer; 
    margin-bottom: 20px; 
    padding: 10px; 
    background-color: #5ba4d5; 
    color: white;
    border: none; 
    border-radius: 15px;
    }
  .container {
    background-color: white;
    border-radius: 15px;
    height: auto;
    padding: 20px;
  }
  .course.image {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }
  .CourseNameHeader {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding: 10px;
    justify-content: center;
    margin: 0 auto;
  }
  .year.bar.container {
    background-color: #F9F3EF;
    border-radius: 10px;
    padding-left: 30px;
    margin-top: 10px;
    height: 35px;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    }
</style> -->

<template>
  <div class="detail-page">
    <button @click="$router.back()" class="back-btn">
      <font-awesome-icon :icon="['fas', 'circle-arrow-left']" /> Back
    </button>

    <div class="header-section">
      <h1 class="course-title">{{ courseName }}</h1>
      <p class="subtitle">Academic Roadmap & Subject Credits</p>
    </div>

    <!-- MAIN TABLE CONTAINER -->
    <div class="table-container">
      <div class="table-header">
        <h3>Academic Roadmap</h3>
        <button @click="showModal = true" class="add-btn">+ Add Subject</button>
      </div>

      <div v-for="(group, title) in groupedSubjects" :key="title" class="semester-group">
        <h4 class="group-title">{{  title  }}</h4>
        <table class="curriculum-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Year</th>
              <th>Sem</th>
              <th>Lec Hours</th>
              <th>Lab Hours</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- We will loop through subjects here -->
            <tr v-for="subject in subjects" :key="subject.id">
              <td><span class="badge">{{ subject.code }}</span></td>
              <td class="subject-name">{{ subject.name }}</td>
              <td>Year {{ subject.year }}</td>
              <td>{{ subject.semester }}</td>
              <td>{{ subject.lectureHours }}h</td>
              <td>{{ subject.labHours }}h</td>
              <td class="total-hours">{{ subject.lectureHours + subject.labHours }}h</td>
            </tr>
            
            <!-- If no subjects yet -->
            <tr v-if="subjects.length === 0">
              <td colspan="7" class="empty-state">No subjects added to this curriculum yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const courseId = Number(route.params.id);
const courseName = ref('Loading...');
const subjects = ref([]);

const courses = {
  1: 'Bachelor degree in Nursing and Midwifery',
  2: 'Associate degree in Nurse',
  3: 'Continue Primary Nurse to Associate degree',
  4: 'Continue Primary Midwife to Associate degree',
  5: 'Continue Primary Nurse to Associate degree',
};

const fetchSubjects = async () => {
  try {
    // In the future, you will filter this by courseId in the backend
    const response = await axios.get('http://localhost:3000/curriculum');
    // For now, let's filter the ones that match this courseName
    subjects.value = response.data.filter(s => s.courseName === courses[courseId]);
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

onMounted(() => {
  courseName.value = courses[courseId] || 'Unknown Course';
  fetchSubjects();
});

const groupedSubjects = computed(() => {
  const groups = {};
  subjects.value.forEach(subject => {
    const key = `Year ${subject.year} - Semester ${subject.semester}`;
    if (!groups[key]) groups[key] = [];
      groups[key].push(subject);
  });
  return groups;
})

const showModal = ref(false);
const newSubject = ref({
  name: '',
  code: '',
  lectureHours: '',
  labHours: '',
  year: 1,
  semester: 1,
  courseName: ''
})
</script>

<style scoped>
.detail-page { padding: 25px; }

.course-title { font-size: 28px; font-weight: 800; color: #333; margin-bottom: 5px; }
.subtitle { color: #888; margin-bottom: 25px; }

.table-container {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #5ba4d5;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.curriculum-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.curriculum-table th {
  padding: 12px;
  border-bottom: 2px solid #f0f4f8;
  color: #7a8288;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.curriculum-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f4f8;
  color: #444;
}

.badge {
  background: #eef6fc;
  color: #5ba4d5;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.8rem;
}

.subject-name { font-weight: 600; }
.total-hours { font-weight: bold; color: #333; }

.empty-state {
  text-align: center;
  padding: 40px !important;
  color: #bbb;
}

.back-btn { 
  cursor: pointer; 
  margin-bottom: 20px; 
  padding: 8px 15px; 
  background-color: #5ba4d5; 
  color: white;
  border: none; 
  border-radius: 10px;
  font-weight: bold;
}
</style>