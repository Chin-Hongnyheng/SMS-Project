import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
  IsEnum,
  Matches,
} from 'class-validator';
import { ExamScheduleStatus } from '../entities/exam-schedule.entity';

export class CreateExamScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  examTypeId: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  subject: string;

  @IsDateString()
  @IsNotEmpty()
  examDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'startTime must be a valid time format (HH:mm or HH:mm:ss)',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'endTime must be a valid time format (HH:mm or HH:mm:ss)',
  })
  endTime: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  room: string;

  @IsEnum(ExamScheduleStatus)
  status: ExamScheduleStatus = ExamScheduleStatus.SCHEDULED;
}
