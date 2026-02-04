import {
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ExamScheduleStatus } from '../entities/exam-schedule.entity';

export class UpdateExamScheduleDto {
  @IsUUID()
  @IsOptional()
  examTypeId?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  subject?: string;

  @IsDateString()
  @IsOptional()
  examDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  room?: string;

  @IsEnum(ExamScheduleStatus)
  @IsOptional()
  status?: ExamScheduleStatus;
}
