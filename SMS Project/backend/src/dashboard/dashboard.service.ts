import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Student } from './students/entities/student.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Competition } from './admin-dashboard/entities/competition.entity';
import { Notice } from './admin-dashboard/entities/notice.entity';
import { Agenda } from './admin-dashboard/entities/agenda.entity';

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

  async getAdminStats() {
    //1. Get totals
    let totalStudents = await this.studentRepo.count();
    const totalTeachers = await this.teacherRepo.count();

    //2. Gender for the chart
    let male = await this.studentRepo.count({ where: { gender: 'Male' } });
    let female = await this.studentRepo.count({
      where: { gender: 'Female' },
    });

    // Fetch latest notice
    const latestNotices = await this.noticeRepo.find({
      order: { createdAt: 'DESC' },
      take: 3,
    });

    //3. Trends calculation
    const studentTrend = '+12%';

    if (totalStudents === 0) {
      totalStudents = 150;
      male = 90;
      female = 60;
    }
    return {
      cards: {
        students: { count: totalStudents, trend: studentTrend },
        teachers: { count: totalTeachers, trend: '-2%' },
        staffs: { count: 245, trend: '+8%' },
      },
      genderStats: {
        male: male || 0,
        female: female || 0,
        total: (male || 0) + (female || 0),
      },
      charts: {
        studentGender: {
          boy: (male / totalStudents) * 100,
          girls: (female / totalStudents) * 100,
          total: totalStudents,
        },
        notices: latestNotices,
      },
      //Fetch latest 5 for dashboards
      notices: await this.noticeRepo.find({
        take: 5,
        order: {
          createdAt: 'DESC',
        },
      }),
      // feedback: await this.feedbackRepo.find({ take 4, order: {
      //   date: 'DESC'
      // }}),
    };
  }
}
