import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'classes' })
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  name: string

  @OneToMany(() => Student, (student) => student.classEntity)
  students: Student[]
}

@Entity({ name: 'students' })
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
