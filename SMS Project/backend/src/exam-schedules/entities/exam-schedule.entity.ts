import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ExamType } from '../../exam-types/entities/exam-type.entity';
import { ExamResult } from '../../exam-results/entities/exam-result.entity';

export enum ExamScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('exam_schedules')
@Index(['examTypeId'])
@Index(['room', 'examDate', 'startTime'])
export class ExamSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  examTypeId: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'date' })
  examDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'varchar', length: 100 })
  room: string;

  @Column({
    type: 'enum',
    enum: ExamScheduleStatus,
    default: ExamScheduleStatus.SCHEDULED,
  })
  status: ExamScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ExamType, (examType) => examType.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examTypeId' })
  examType: ExamType;

  @OneToMany(() => ExamResult, (result) => result.examSchedule)
  results: ExamResult[];
}
