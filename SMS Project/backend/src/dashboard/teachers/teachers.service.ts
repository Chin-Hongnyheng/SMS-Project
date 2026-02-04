import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) {}

  findAll() {
    return this.teacherRepo.find();
  }

  create(dto: CreateTeacherDto) {
    return this.teacherRepo.save(this.teacherRepo.create(dto));
  }

  count() {
    return this.teacherRepo.count();
  }
}
