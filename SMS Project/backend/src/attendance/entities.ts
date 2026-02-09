import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Course } from '../course/entity/course.entity'

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

  @OneToMany(() => Student, (student) => student.classEntity)
  students: Student[]
}

@Entity({ name: 'attendance_students' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text', unique: true, name: 'student_code' })
  studentCode: string

  @Column({ type: 'text', name: 'full_name' })
  fullName: string

  @ManyToOne(() => ClassEntity, (klass) => klass.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  classEntity: ClassEntity
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
