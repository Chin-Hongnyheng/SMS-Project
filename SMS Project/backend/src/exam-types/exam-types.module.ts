import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExamTypesService } from "./exam-types.service";
import { ExamTypesController } from "./exam-types.controller";
import { ExamType } from "./entities/exam-type.entity";
import { Course } from "../course/entity/course.entity";
import { Subject } from "../curriculum/entities/curriculum.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ExamType, Course, Subject])],
  controllers: [ExamTypesController],
  providers: [ExamTypesService],
  exports: [ExamTypesService],
})
export class ExamTypesModule {}
