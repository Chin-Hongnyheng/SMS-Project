import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { ExamSchedulesModule } from './exam-schedules/exam-schedules.module';
import { ExamResultsModule } from './exam-results/exam-results.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'sms',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    CurriculumModule,
    ExamTypesModule,
    ExamSchedulesModule,
    ExamResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
