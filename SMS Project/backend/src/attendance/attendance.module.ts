import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'
import { CurriculumController } from './curriculum.controller'
import { CurriculumService } from './curriculum.service'
import { AttendanceRecord, ClassEntity, CurriculumSubject } from './entities'
import { Course } from '../course/entity/course.entity'
import { Student } from '../dashboard/students/entities/student.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, ClassEntity, Student, AttendanceRecord, CurriculumSubject]),
  ],
  controllers: [AttendanceController, CurriculumController],
  providers: [AttendanceService, CurriculumService],
})
export class AttendanceModule {}

