-- =====================================================
-- MODULE 4: EXAM MANAGEMENT - POSTGRESQL SCHEMA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_types_name_enum') THEN
    CREATE TYPE exam_types_name_enum AS ENUM ('Midterm', 'Final Semester', 'Final Year');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_types_status_enum') THEN
    CREATE TYPE exam_types_status_enum AS ENUM ('ACTIVE', 'INACTIVE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_schedules_status_enum') THEN
    CREATE TYPE exam_schedules_status_enum AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_results_grade_enum') THEN
    CREATE TYPE exam_results_grade_enum AS ENUM ('A', 'B', 'C', 'D', 'F');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_results_remarks_enum') THEN
    CREATE TYPE exam_results_remarks_enum AS ENUM ('PASS', 'FAIL');
  END IF;
END $$;

-- =====================================================
-- 1. EXAM TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name exam_types_name_enum NOT NULL,
  description varchar(255),
  status exam_types_status_enum NOT NULL DEFAULT 'ACTIVE',
  "createdAt" timestamp NOT NULL DEFAULT now(),

  CONSTRAINT chk_description_length CHECK (description IS NULL OR char_length(description) >= 5)
);

-- =====================================================
-- 2. EXAM SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "examTypeId" uuid NOT NULL,
  subject varchar(255) NOT NULL,
  "examDate" date NOT NULL,
  "startTime" time NOT NULL,
  "endTime" time NOT NULL,
  room varchar(100) NOT NULL,
  status exam_schedules_status_enum NOT NULL DEFAULT 'SCHEDULED',
  "createdAt" timestamp NOT NULL DEFAULT now(),

  CONSTRAINT fk_exam_schedules_exam_type
    FOREIGN KEY ("examTypeId")
    REFERENCES exam_types(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_exam_schedule_times CHECK ("startTime" < "endTime"),
  CONSTRAINT chk_subject_length CHECK (char_length(subject) > 0),
  CONSTRAINT chk_room_length CHECK (char_length(room) > 0)
);

-- =====================================================
-- 3. EXAM RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" varchar(36) NOT NULL,
  "examScheduleId" uuid NOT NULL,
  score numeric(5, 2) NOT NULL DEFAULT 0,
  grade exam_results_grade_enum NOT NULL DEFAULT 'F',
  remarks exam_results_remarks_enum NOT NULL DEFAULT 'FAIL',
  "enteredAt" timestamp NOT NULL DEFAULT now(),

  CONSTRAINT fk_exam_results_exam_schedule
    FOREIGN KEY ("examScheduleId")
    REFERENCES exam_schedules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT uq_exam_result_per_student UNIQUE ("studentId", "examScheduleId"),
  CONSTRAINT chk_score_range CHECK (score >= 0 AND score <= 100)
);

-- =====================================================
-- 4. VIEWS & HELPER QUERIES
-- =====================================================

-- View: Student Exam Performance Summary
CREATE OR REPLACE VIEW vw_exam_performance_summary AS
SELECT
  er."studentId",
  es.subject,
  et.name AS examtype,
  es."examDate",
  er.score,
  er.grade,
  er.remarks,
  CASE
    WHEN er.grade IN ('A', 'B') THEN 'Excellent'
    WHEN er.grade = 'C' THEN 'Good'
    WHEN er.grade = 'D' THEN 'Pass'
    ELSE 'Fail'
  END AS performance,
  er."enteredAt"
FROM exam_results er
JOIN exam_schedules es ON er."examScheduleId" = es.id
JOIN exam_types et ON es."examTypeId" = et.id
ORDER BY es."examDate" DESC, er."enteredAt" DESC;

-- View: Exam Schedule Details
CREATE OR REPLACE VIEW vw_exam_schedule_details AS
SELECT
  es.id,
  es.subject,
  et.name AS examtype,
  es."examDate",
  es."startTime",
  es."endTime",
  es.room,
  es.status,
  es."createdAt",
  COUNT(er.id) AS totalresults,
  AVG(er.score) AS avgscore
FROM exam_schedules es
JOIN exam_types et ON es."examTypeId" = et.id
LEFT JOIN exam_results er ON es.id = er."examScheduleId"
GROUP BY
  es.id,
  es.subject,
  et.name,
  es."examDate",
  es."startTime",
  es."endTime",
  es.room,
  es.status,
  es."createdAt";

-- =====================================================
-- 5. INITIAL DATA (Optional)
-- =====================================================

INSERT INTO exam_types (name, description, status)
SELECT v.name::exam_types_name_enum, v.description, v.status::exam_types_status_enum
FROM (
  VALUES
    ('Midterm', 'Mid-semester examination', 'ACTIVE'),
    ('Final Semester', 'End of semester final examination', 'ACTIVE'),
    ('Final Year', 'Final year comprehensive examination', 'ACTIVE')
) AS v(name, description, status)
WHERE NOT EXISTS (
  SELECT 1 FROM exam_types et WHERE et.name = v.name::exam_types_name_enum
);

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_exam_types_status ON exam_types(status);
CREATE INDEX IF NOT EXISTS idx_exam_types_name ON exam_types(name);
CREATE INDEX IF NOT EXISTS idx_exam_types_created_at ON exam_types("createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_exam_schedules_exam_type_id ON exam_schedules("examTypeId");
CREATE INDEX IF NOT EXISTS idx_exam_schedules_exam_date ON exam_schedules("examDate");
CREATE INDEX IF NOT EXISTS idx_exam_schedules_status ON exam_schedules(status);
CREATE INDEX IF NOT EXISTS idx_exam_schedules_room_date_time ON exam_schedules(room, "examDate", "startTime");
CREATE INDEX IF NOT EXISTS idx_exam_schedules_created_at ON exam_schedules("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_exam_schedules_status_date ON exam_schedules(status, "examDate");

CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results("studentId");
CREATE INDEX IF NOT EXISTS idx_exam_results_exam_schedule_id ON exam_results("examScheduleId");
CREATE INDEX IF NOT EXISTS idx_exam_results_grade ON exam_results(grade);
CREATE INDEX IF NOT EXISTS idx_exam_results_remarks ON exam_results(remarks);
CREATE INDEX IF NOT EXISTS idx_exam_results_entered_at ON exam_results("enteredAt" DESC);
CREATE INDEX IF NOT EXISTS idx_exam_results_grade_remarks ON exam_results(grade, remarks);

-- =====================================================
-- END OF SQL SCHEMA
-- =====================================================
