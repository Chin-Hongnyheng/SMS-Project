<template>
  <section class="home">
    <div class="hero">
      <h1>Dashboard</h1>
      <p>Quick access to attendance and curriculum tools.</p>
    </div>
    <div class="quick-grid">
      <div class="quick-card">
        <h3>Attendance</h3>
        <p>Track daily attendance by class.</p>
      </div>
      <div class="quick-card">
        <h3>Curriculum</h3>
        <p>Browse available courses and details.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: grid;
  gap: 24px;
}

.hero h1 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  color: #1f2933;
}

.hero p {
  margin: 0;
  color: #6b7280;
}

.quick-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.quick-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  border: 1px solid #eef1f5;
}

.quick-card h3 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  color: #1f2933;
}

.quick-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
