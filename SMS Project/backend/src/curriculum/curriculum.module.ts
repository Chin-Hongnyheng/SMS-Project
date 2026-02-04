import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { Subject } from './entities/curriculum.entity';
import { Lecture } from './entities/lecture.entity';
import { Announcement } from './entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Lecture, Announcement])],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
