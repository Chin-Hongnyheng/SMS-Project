import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ExamResultRemark } from '../entities/exam-result.entity';

export class UpdateExamResultDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number;

  @IsEnum(ExamResultRemark)
  @IsOptional()
  remarks?: ExamResultRemark;
}
