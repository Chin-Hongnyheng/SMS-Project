import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Competition } from './entities/competition.entity';
import { Notice } from './entities/notice.entity';
import { Agenda } from './entities/agenda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      Competition,
      Notice,
      Agenda,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
