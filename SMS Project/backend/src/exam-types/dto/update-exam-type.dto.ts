import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ExamTypeEnum, ExamTypeStatus } from '../entities/exam-type.entity';

export class UpdateExamTypeDto {
  @IsEnum(ExamTypeEnum, {
    message: 'Name must be one of: Midterm, Final Semester, Final Year',
  })
  @IsOptional()
  name?: ExamTypeEnum;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsEnum(ExamTypeStatus, {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  @IsOptional()
  status?: ExamTypeStatus;

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsNumber()
  @IsOptional()
  subjectId?: number;
}
