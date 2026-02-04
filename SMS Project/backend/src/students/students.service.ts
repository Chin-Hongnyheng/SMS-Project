import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  create(dto: CreateStudentDto) {
    const student = this.studentRepository.create(dto);
    return this.studentRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return this.studentRepository.remove(student);
  }

  count() {
    return this.studentRepository.count();
  }
}
