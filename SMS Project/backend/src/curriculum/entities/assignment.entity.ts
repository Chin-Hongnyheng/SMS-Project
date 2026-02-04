import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from './curriculum.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Subject, (subject) => subject.assignments)
  subject: Subject;
}
