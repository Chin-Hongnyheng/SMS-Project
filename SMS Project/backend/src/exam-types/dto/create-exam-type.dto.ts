import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ExamTypeEnum, ExamTypeStatus } from '../entities/exam-type.entity';

export class CreateExamTypeDto {
  @IsEnum(ExamTypeEnum, {
    message: 'Name must be one of: Midterm, Final Semester, Final Year',
  })
  @IsNotEmpty()
  name: ExamTypeEnum;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  description: string;

  @IsEnum(ExamTypeStatus, {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  status: ExamTypeStatus = ExamTypeStatus.ACTIVE;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
}
