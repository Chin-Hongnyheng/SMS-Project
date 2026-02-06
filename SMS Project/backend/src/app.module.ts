import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CourseModule } from "./course/course.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CurriculumModule } from "./curriculum/curriculum.module";
import { ExamTypesModule } from "./exam-types/exam-types.module";
import { ExamSchedulesModule } from "./exam-schedules/exam-schedules.module";
import { ExamResultsModule } from "./exam-results/exam-results.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AttendanceModule } from "./attendance/attendance.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "sms",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    CourseModule,
    CurriculumModule,
    AttendanceModule,
    ExamTypesModule,
    ExamSchedulesModule,
    ExamResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
