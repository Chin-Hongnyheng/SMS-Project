import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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
}
