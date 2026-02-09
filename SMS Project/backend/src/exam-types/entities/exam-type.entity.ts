import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ExamSchedule } from "../../exam-schedules/entities/exam-schedule.entity";

export enum ExamTypeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

@Entity("exam_types")
export class ExamType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  room: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ExamTypeStatus,
    default: ExamTypeStatus.ACTIVE,
  })
  status: ExamTypeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ExamSchedule, (schedule) => schedule.examType)
  schedules: ExamSchedule[];
}
