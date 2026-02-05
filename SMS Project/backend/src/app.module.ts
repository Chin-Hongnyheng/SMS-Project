import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { ExamSchedulesModule } from './exam-schedules/exam-schedules.module';
import { ExamResultsModule } from './exam-results/exam-results.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AttendanceModule } from './attendance/attendance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NoticesModule } from './dashboard/notices/notices.module';
import { StudentsModule } from './dashboard/students/students.module';
import { TeachersModule } from './dashboard/teachers/teachers.module';
import { AdminDashboardModule } from './dashboard/admin-dashboard/admin-dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'sms',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CourseModule,
    CurriculumModule,
    AttendanceModule,
    ExamTypesModule,
    ExamSchedulesModule,
    ExamResultsModule,
    DashboardModule,
    NoticesModule,
    StudentsModule,
    TeachersModule,
    AdminDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
