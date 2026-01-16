import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { Subject } from './entities/curriculum.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
