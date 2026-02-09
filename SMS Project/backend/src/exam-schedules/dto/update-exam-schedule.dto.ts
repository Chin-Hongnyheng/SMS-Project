import {
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
  IsEnum,
  IsNumber,
} from "class-validator";
import { ExamScheduleStatus } from "../entities/exam-schedule.entity";

export class UpdateExamScheduleDto {
  @IsUUID()
  @IsOptional()
  examTypeId?: string;

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsNumber()
  @IsOptional()
  subjectId?: number;

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
