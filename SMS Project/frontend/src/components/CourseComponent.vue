<template>
  <div class="course-container" :class="{ active: isActive, 'invalid-field': isInvalid }" @click="selectCourse">
    <img :src="image" alt="Course Image"/>
    <span class="course-name">{{ courseName }}</span>
  </div>
</template>
<script>
    export default{
        name: 'CourseComponent',
        props:{
            courseId:{
                type: Number,
                required: true,
            },
            courseName: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            isActive: { type: Boolean, default: false },
            isInvalid: { type: Boolean, default: false },
        },
        methods: {
        selectCourse() {
        const newActive = this.isActive ? null : this.courseId
        this.$emit('select', newActive)
    }
  }
    }
</script>
<style scoped>
.course-name{
    font-family: 'Nunito';
    font-weight: 900;
    color: rgba(165, 164, 170);
    font-size: 28px;
}
.course-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 499px;
    height: 236px;
    gap: 30px;
    background-color: rgb(249, 243, 239);
    padding: 0 30px;
    border-radius: 20px;
    border: 2px solid transparent;
    outline: none;
    transition: all 0.3s ease;
}

.course-container:hover{
    transform:scale(1.05);
    color:rgb(94, 171, 214);
}
.course-container.active {
  border-color: rgb(94, 171, 214);
  background-color: rgba(94, 171, 214, 0.1);
  transform: scale(1.05);
}
.course-container.invalid-field {
  border-color: red;
  box-shadow: 0 0 10px red;
}
</style>