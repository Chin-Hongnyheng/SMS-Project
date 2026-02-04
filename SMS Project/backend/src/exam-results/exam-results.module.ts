import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResultsService } from './exam-results.service';
import { ExamResultsController } from './exam-results.controller';
import { ExamResult } from './entities/exam-result.entity';
import { ExamSchedulesModule } from '../exam-schedules/exam-schedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult]), ExamSchedulesModule],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
  exports: [ExamResultsService],
})
export class ExamResultsModule {}
