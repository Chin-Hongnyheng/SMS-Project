import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { ExamSchedule } from '../../exam-schedules/entities/exam-schedule.entity';

export enum ExamResultGrade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

export enum ExamResultRemark {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

@Entity('exam_results')
@Index(['studentId'])
@Index(['examScheduleId'])
@Unique('UQ_exam_result_per_student', ['studentId', 'examScheduleId'])
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  studentId: string;

  @Column({ type: 'uuid' })
  examScheduleId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({
    type: 'enum',
    enum: ExamResultGrade,
    default: ExamResultGrade.F,
  })
  grade: ExamResultGrade;

  @Column({
    type: 'enum',
    enum: ExamResultRemark,
    default: ExamResultRemark.FAIL,
  })
  remarks: ExamResultRemark;

  @CreateDateColumn()
  enteredAt: Date;

  @ManyToOne(() => ExamSchedule, (schedule) => schedule.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examScheduleId' })
  examSchedule: ExamSchedule;
}
