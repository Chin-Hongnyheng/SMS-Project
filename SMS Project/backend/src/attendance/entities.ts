import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Course } from '../course/entity/course.entity'
import { Student } from '../dashboard/students/entities/student.entity'

@Entity({ name: 'classes' })
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int', default: 1 })
  year: number

  @Column({ type: 'text', name: 'module_name', default: 'Module 1' })
  module: string

  @ManyToOne(() => Course, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course
}

@Entity({ name: 'attendance' })
@Unique(['classEntity', 'student', 'attendanceDate'])

export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ClassEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  classEntity: ClassEntity

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student

  @Column({ type: 'date', name: 'attendance_date' })
  attendanceDate: Date

  @Column({ type: 'boolean', default: true })
  present: boolean
}

@Entity({ name: 'curriculum_subjects' })
export class CurriculumSubject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text' })
  code: string

  @Column({ type: 'int', default: 1 })
  year: number

  @Column({ type: 'int', default: 1 })
  semester: number

  @Column({ type: 'int', name: 'lecture_hours', default: 0 })
  lectureHours: number

  @Column({ type: 'int', name: 'lab_hours', default: 0 })
  labHours: number

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'text', name: 'course_name', nullable: true })
  courseName?: string
}
