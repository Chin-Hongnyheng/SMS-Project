import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Competition } from './entities/competition.entity';
import { Notice } from './entities/notice.entity';
import { Agenda } from './entities/agenda.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,

    @InjectRepository(Competition)
    private competitionRepo: Repository<Competition>,

    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,

    @InjectRepository(Agenda)
    private agendaRepo: Repository<Agenda>,
  ) {}

  async getDashboardData() {
    return {
      studentsCount: await this.studentRepo.count(),
      teachersCount: await this.teacherRepo.count(),
      competitions: await this.competitionRepo.find(),
      notices: await this.noticeRepo.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      agenda: await this.agendaRepo.find({
        order: { time: 'ASC' },
      }),
    };
  }
}
