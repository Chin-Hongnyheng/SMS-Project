import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('course')
export class Course{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courseName: string;

    @Column()
    image: string;
}