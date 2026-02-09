import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from "class-validator";
import { ExamTypeStatus } from "../entities/exam-type.entity";

export class CreateExamTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  room?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  description: string;

  @IsEnum(ExamTypeStatus, {
    message: "Status must be either ACTIVE or INACTIVE",
  })
  status: ExamTypeStatus = ExamTypeStatus.ACTIVE;
}
