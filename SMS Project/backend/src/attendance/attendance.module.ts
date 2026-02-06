import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'
import { CurriculumController } from './curriculum.controller'
import { CurriculumService } from './curriculum.service'
import { AttendanceRecord, ClassEntity, CourseEntity, CurriculumSubject, Student } from './entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, ClassEntity, Student, AttendanceRecord, CurriculumSubject]),
  ],
  controllers: [AttendanceController, CurriculumController],
  providers: [AttendanceService, CurriculumService],
})
export class AttendanceModule {}



