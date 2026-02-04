import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  studentId: string;

  @Column()
  name: string;

  @Column({ default: 'Male' })
  gender: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  class: string;

  @Column()
  generation: string;

  @Column()
  location: string;

  @Column()
  contact: string;

  @Column()
  exam: string;
}
