import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { Lecture } from "./lecture.entity";
import { Announcement } from "./announcement.entity";
import { Course } from "../../course/entity/course.entity";

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  code: string;

  @Column({ type: "int" })
  lectureHours: number;

  @Column({ type: "int" })
  labHours: number;

  @Column()
  year: number;

  @Column()
  semester: number;

  @ManyToOne(() => Course, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "course_id" })
  course: Course;

  @OneToMany(() => Assignment, (assignment) => assignment.subject)
  assignments: Assignment[];

  @OneToMany(() => Lecture, (lecture) => lecture.subject)
  lectures: Lecture[];

  @OneToMany(() => Announcement, (announcement) => announcement.subject)
  announcements: Announcement[];
}
