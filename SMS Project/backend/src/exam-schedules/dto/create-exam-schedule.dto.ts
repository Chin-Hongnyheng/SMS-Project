import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
  IsEnum,
  Matches,
  IsNumber,
  IsOptional,
} from "class-validator";
import { ExamScheduleStatus } from "../entities/exam-schedule.entity";

export class CreateExamScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  examTypeId: string;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @IsDateString()
  @IsNotEmpty()
  examDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "startTime must be a valid time format (HH:mm or HH:mm:ss)",
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "endTime must be a valid time format (HH:mm or HH:mm:ss)",
  })
  endTime: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  room: string;

  @IsEnum(ExamScheduleStatus)
  @IsOptional()
  status?: ExamScheduleStatus = ExamScheduleStatus.SCHEDULED;
}
