-- =====================================================
-- MODULE 4: EXAM MANAGEMENT - SQL SCHEMA
-- Database: MySQL (or PostgreSQL compatible)
-- =====================================================

-- =====================================================
-- 1. EXAM TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_types (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  name ENUM('Midterm', 'Final Semester', 'Final Year') NOT NULL UNIQUE COMMENT 'Exam type name',
  description VARCHAR(255) NOT NULL COMMENT 'Description of exam type',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT 'Status of exam type',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  
  INDEX idx_status (status),
  INDEX idx_name (name),
  
  CONSTRAINT chk_description_length CHECK (CHAR_LENGTH(description) >= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Exam Types Management';

-- =====================================================
-- 2. EXAM SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_schedules (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  examTypeId VARCHAR(36) NOT NULL COMMENT 'Foreign key to exam_types',
  subject VARCHAR(255) NOT NULL COMMENT 'Subject/Course name',
  examDate DATE NOT NULL COMMENT 'Date of the exam',
  startTime TIME NOT NULL COMMENT 'Exam start time (HH:MM:SS)',
  endTime TIME NOT NULL COMMENT 'Exam end time (HH:MM:SS)',
  room VARCHAR(100) NOT NULL COMMENT 'Room/Hall number',
  status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED' COMMENT 'Exam status',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  
  -- Foreign key constraint
  CONSTRAINT fk_exam_schedules_examTypeId 
    FOREIGN KEY (examTypeId) 
    REFERENCES exam_types(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  -- Indexes
  INDEX idx_examTypeId (examTypeId),
  INDEX idx_examDate (examDate),
  INDEX idx_status (status),
  INDEX idx_room_date_time (room, examDate, startTime),
  
  -- Constraints
  CONSTRAINT chk_exam_schedule_times CHECK (startTime < endTime),
  CONSTRAINT chk_subject_length CHECK (CHAR_LENGTH(subject) > 0),
  CONSTRAINT chk_room_length CHECK (CHAR_LENGTH(room) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Exam Schedules';

-- =====================================================
-- 3. EXAM RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_results (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  studentId VARCHAR(36) NOT NULL COMMENT 'Foreign key to students table',
  examScheduleId VARCHAR(36) NOT NULL COMMENT 'Foreign key to exam_schedules',
  score DECIMAL(5, 2) NOT NULL DEFAULT 0 COMMENT 'Exam score (0-100)',
  grade ENUM('A', 'B', 'C', 'D', 'F') NOT NULL DEFAULT 'F' COMMENT 'Auto-calculated grade',
  remarks ENUM('PASS', 'FAIL') NOT NULL DEFAULT 'FAIL' COMMENT 'PASS/FAIL status',
  enteredAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record entry timestamp',
  
  -- Foreign key constraint
  CONSTRAINT fk_exam_results_examScheduleId 
    FOREIGN KEY (examScheduleId) 
    REFERENCES exam_schedules(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  -- Unique constraint: one result per student per exam
  UNIQUE KEY uq_exam_result_per_student (studentId, examScheduleId),
  
  -- Indexes
  INDEX idx_studentId (studentId),
  INDEX idx_examScheduleId (examScheduleId),
  INDEX idx_grade (grade),
  INDEX idx_remarks (remarks),
  
  -- Constraints
  CONSTRAINT chk_score_range CHECK (score >= 0 AND score <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Exam Results';

-- =====================================================
-- 4. VIEWS & HELPER QUERIES
-- =====================================================

-- View: Student Exam Performance Summary
CREATE OR REPLACE VIEW vw_exam_performance_summary AS
SELECT 
  er.studentId,
  es.subject,
  et.name AS examType,
  es.examDate,
  er.score,
  er.grade,
  er.remarks,
  CASE 
    WHEN er.grade IN ('A', 'B') THEN 'Excellent'
    WHEN er.grade = 'C' THEN 'Good'
    WHEN er.grade = 'D' THEN 'Pass'
    ELSE 'Fail'
  END AS performance,
  er.enteredAt
FROM exam_results er
JOIN exam_schedules es ON er.examScheduleId = es.id
JOIN exam_types et ON es.examTypeId = et.id
ORDER BY es.examDate DESC, er.enteredAt DESC;

-- View: Exam Schedule Details
CREATE OR REPLACE VIEW vw_exam_schedule_details AS
SELECT 
  es.id,
  es.subject,
  et.name AS examType,
  es.examDate,
  es.startTime,
  es.endTime,
  es.room,
  es.status,
  es.createdAt,
  COUNT(er.id) AS totalResults,
  AVG(er.score) AS avgScore
FROM exam_schedules es
JOIN exam_types et ON es.examTypeId = et.id
LEFT JOIN exam_results er ON es.id = er.examScheduleId
GROUP BY es.id, es.subject, et.name, es.examDate, es.startTime, es.endTime, es.room, es.status, es.createdAt;

-- =====================================================
-- 5. INITIAL DATA (Optional)
-- =====================================================

-- Insert default exam types
INSERT INTO exam_types (id, name, description, status) VALUES
  (UUID(), 'Midterm', 'Mid-semester examination', 'ACTIVE'),
  (UUID(), 'Final Semester', 'End of semester final examination', 'ACTIVE'),
  (UUID(), 'Final Year', 'Final year comprehensive examination', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for filtering and searching
ALTER TABLE exam_types ADD INDEX idx_created_date (createdAt DESC);
ALTER TABLE exam_schedules ADD INDEX idx_created_date (createdAt DESC);
ALTER TABLE exam_schedules ADD INDEX idx_status_date (status, examDate);
ALTER TABLE exam_results ADD INDEX idx_entered_date (enteredAt DESC);
ALTER TABLE exam_results ADD INDEX idx_grade_remarks (grade, remarks);

-- =====================================================
-- END OF SQL SCHEMA
-- =====================================================
