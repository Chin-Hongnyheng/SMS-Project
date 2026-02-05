import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_info')
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  // Personal info
  @Column()
  firstNameEn: string;

  @Column()
  lastNameEn: string;

  @Column()
  firstNameKh: string;

  @Column()
  lastNameKh: string;

  @Column()
  status: string;

  @Column()
  gender: string;

  @Column()
  race: string;

  @Column()
  nationality: string;

  @Column()
  dob: string;

  @Column()
  phoneNumber: number;

  @Column()
  village: string;

  @Column()
  commune: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  address: string;

  @Column({ default: 1 })
  year: number;

  @Column({default: 1})
  semester: number;

  @Column({ nullable: true })
  profileImage: string;


  // RELATIONSHIPS (IDs only, no joins across services)
  @Column()
  userId: number; // references auth-service User

  @Column()
  courseId: number; // references backend-service Course

  // Uploaded files stored as JSON array of file paths
  @Column('simple-json', { nullable: true })
  files: { filename: string; url: string }[];
}
