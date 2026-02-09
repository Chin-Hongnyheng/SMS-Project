import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { ExamTypeStatus, ExamFor } from "../entities/exam-type.entity";

export class UpdateExamTypeDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  room?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsEnum(ExamTypeStatus, {
    message: "Status must be either ACTIVE or INACTIVE",
  })
  @IsOptional()
  status?: ExamTypeStatus;

  @IsEnum(ExamFor, {
    message: "ExamFor must be either STUDENT or CANDIDATE",
  })
  @IsOptional()
  examFor?: ExamFor;
}
