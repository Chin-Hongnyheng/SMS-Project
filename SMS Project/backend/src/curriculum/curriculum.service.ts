import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/curriculum.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto) {
    const newSubject = this.subjectRepository.create(createCurriculumDto);
    return await this.subjectRepository.save(newSubject);
  }

  async findByCourse(courseName: string) {
    return await this.subjectRepository.find({
      where: {
        courseName: courseName,
      },
    });
  }

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: number, updateCurriculumDto: UpdateCurriculumDto) {
    const subject = await this.subjectRepository.preload({
      id: id,
      ...updateCurriculumDto,
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return await this.subjectRepository.save(subject);
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    return await this.subjectRepository.remove(subject);
  }
}
