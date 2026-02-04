import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'
import { AttendanceRecord, ClassEntity, CourseEntity, Student } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, ClassEntity, Student, AttendanceRecord])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}




