import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { ExamResultRemark } from '../entities/exam-result.entity';

export class CreateExamResultDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  examScheduleId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  score: number;

  @IsEnum(ExamResultRemark)
  remarks: ExamResultRemark = ExamResultRemark.FAIL;
}
