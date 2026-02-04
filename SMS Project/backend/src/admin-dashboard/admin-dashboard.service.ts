import { Injectable } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Injectable()
export class AdminDashboardService {
  private notices: Array<CreateNoticeDto & { id: number }> = [];
  private agenda: Array<CreateAgendaDto & { id: number }> = [];
  private competitions: Array<CreateCompetitionDto & { id: number }> = [];

  /* ===== NOTICE ===== */

  getNotices() {
    return this.notices;
  }

  createNotice(dto: CreateNoticeDto) {
    const notice = {
      id: Date.now(),
      ...dto,
    };
    this.notices.push(notice);
    return notice;
  }

  deleteNotice(id: number) {
    this.notices = this.notices.filter(n => n.id !== id);
    return { message: 'Notice deleted' };
  }

  /* ===== AGENDA ===== */

  getAgenda() {
    return this.agenda;
  }

  createAgenda(dto: CreateAgendaDto) {
    const item = {
      id: Date.now(),
      ...dto,
    };
    this.agenda.push(item);
    return item;
  }

  deleteAgenda(id: number) {
    this.agenda = this.agenda.filter(a => a.id !== id);
    return { message: 'Agenda deleted' };
  }

  /* ===== COMPETITION ===== */

  getCompetitions() {
    return this.competitions;
  }

  createCompetition(dto: CreateCompetitionDto) {
    const competition = {
      id: Date.now(),
      ...dto,
    };
    this.competitions.push(competition);
    return competition;
  }

  deleteCompetition(id: number) {
    this.competitions = this.competitions.filter(c => c.id !== id);
    return { message: 'Competition deleted' };
  }
}
