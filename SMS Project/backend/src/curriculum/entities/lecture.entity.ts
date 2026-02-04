import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Subject } from './curriculum.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  fileUrl: string; // Path to the uploaded file (PDF, Docx, etc.)

  @Column({ nullable: true })
  fileName: string; // The original name of the file

  @CreateDateColumn()
  createdAt: Date;

  // Many lectures belong to one Subject
  @ManyToOne(() => Subject, (subject) => subject.lectures, {
    onDelete: 'CASCADE',
  })
  subject: Subject;
}
