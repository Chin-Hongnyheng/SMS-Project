import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumModule } from './curriculum/curriculum.module';
import { NoticesModule } from './notices/notices.module';
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sms',
    autoLoadEntities: true,
    synchronize: true,
  }),
    UsersModule,
    CurriculumModule,
    NoticesModule,
    DashboardModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
