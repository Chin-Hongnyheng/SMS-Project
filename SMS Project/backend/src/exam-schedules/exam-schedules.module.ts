import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSchedulesService } from './exam-schedules.service';
import { ExamSchedulesController } from './exam-schedules.controller';
import { ExamSchedule } from './entities/exam-schedule.entity';
import { ExamTypesModule } from '../exam-types/exam-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSchedule]), ExamTypesModule],
  controllers: [ExamSchedulesController],
  providers: [ExamSchedulesService],
  exports: [ExamSchedulesService],
})
export class ExamSchedulesModule {}
