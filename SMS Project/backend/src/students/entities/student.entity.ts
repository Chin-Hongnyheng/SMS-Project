import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  studentId: string;

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
