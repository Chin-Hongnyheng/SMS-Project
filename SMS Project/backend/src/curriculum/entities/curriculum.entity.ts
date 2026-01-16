import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ type: 'int' })
  lectureHours: number;

  @Column({ type: 'int' })
  labHours: number;

  @Column()
  year: number;

  @Column()
  semester: number;

  @Column()
  courseName: string;
}
