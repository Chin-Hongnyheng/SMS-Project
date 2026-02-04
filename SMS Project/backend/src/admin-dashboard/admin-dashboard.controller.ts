import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { AdminDashboardService } from './admin-dashboard.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  /* ===== NOTICE ===== */

  @Get('notices')
  getNotices() {
    return this.adminDashboardService.getNotices();
  }

  @Post('notices')
  createNotice(@Body() dto: CreateNoticeDto) {
    return this.adminDashboardService.createNotice(dto);
  }

  @Delete('notices/:id')
  deleteNotice(@Param('id') id: string) {
    return this.adminDashboardService.deleteNotice(Number(id));
  }

  /* ===== AGENDA ===== */

  @Get('agenda')
  getAgenda() {
    return this.adminDashboardService.getAgenda();
  }

  @Post('agenda')
  createAgenda(@Body() dto: CreateAgendaDto) {
    return this.adminDashboardService.createAgenda(dto);
  }

  @Delete('agenda/:id')
  deleteAgenda(@Param('id') id: string) {
    return this.adminDashboardService.deleteAgenda(Number(id));
  }

  /* ===== COMPETITION ===== */

  @Get('competitions')
  getCompetitions() {
    return this.adminDashboardService.getCompetitions();
  }

  @Post('competitions')
  createCompetition(@Body() dto: CreateCompetitionDto) {
    return this.adminDashboardService.createCompetition(dto);
  }

  @Delete('competitions/:id')
  deleteCompetition(@Param('id') id: string) {
    return this.adminDashboardService.deleteCompetition(Number(id));
  }
}
