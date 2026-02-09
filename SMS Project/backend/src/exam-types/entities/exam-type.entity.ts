import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamSchedule } from '../../exam-schedules/entities/exam-schedule.entity';
import { Course } from "../../course/entity/course.entity";
import { Subject } from '../../curriculum/entities/curriculum.entity';

export enum ExamTypeEnum {
  ENTRANCE_EXAM = 'Entrance Exam',
  MIDTERM = 'Midterm',
  FINAL_SEMESTER = 'Final Semester',
  FINAL_YEAR = 'Final Year',
}

export enum ExamTypeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('exam_types')
export class ExamType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ExamTypeEnum,
    default: ExamTypeEnum.MIDTERM,
  })
  name: ExamTypeEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ExamTypeStatus,
    default: ExamTypeStatus.ACTIVE,
  })
  status: ExamTypeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ExamSchedule, (schedule) => schedule.examType)
  schedules: ExamSchedule[];

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Subject, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

}
