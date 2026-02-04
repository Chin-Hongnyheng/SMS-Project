import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Subject } from './curriculum.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' }) // Use text for long Markdown content
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Many announcements belong to one Subject
  @ManyToOne(() => Subject, (subject) => subject.announcements, {
    onDelete: 'CASCADE',
  })
  subject: Subject;
}
