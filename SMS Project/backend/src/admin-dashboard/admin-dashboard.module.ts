import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [AdminDashboardService],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {}
