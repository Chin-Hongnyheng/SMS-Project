import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useCourseStore = defineStore('course', {
state: () => ({
  courses: [],
}),

actions: {
  async fetchCourses(){
    try{
      const res = await axios.get('http://localhost:3000/courses');
      this.courses = res.data;
      console.log("Courses Fetched successfully");
    }catch(error){
      console.error('Failed to fetch courses', error);
    }
  }
}
});