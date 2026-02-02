import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { Subject } from './entities/curriculum.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Lecture } from './entities/lecture.entity';
import { Announcement } from './entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Lecture, Announcement])],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
