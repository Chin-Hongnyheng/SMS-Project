import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Student } from './students/entities/student.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Competition } from './admin-dashboard/entities/competition.entity';
import { Notice } from './admin-dashboard/entities/notice.entity';
import { Agenda } from './admin-dashboard/entities/agenda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, Competition, Notice, Agenda]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
