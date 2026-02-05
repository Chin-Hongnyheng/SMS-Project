import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Student } from './entities/student.entity';
// import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  //create
  create(data: Partial<Student>) {
    const student = this.studentRepository.create(data);
    return this.studentRepository.save(student);
  }

  async findAll(
    search?: string,
    gender?: string,
    className?: string,
    major?: string,
    year?: string,
    group?: string,
  ) {
    const baseFilters: FindOptionsWhere<Student> = {};

    if (major && major !== '') baseFilters.major = major;
    if (year && year !== '') {
      const yearNum = Number(year);
      if (!isNaN(yearNum)) {
        baseFilters.year = yearNum;
      }
    }
    if (group && group !== '') baseFilters.group = group;
    try {
      if (search && search.trim() !== '') {
        const searchPattern = Like(`%${search}%`);
        return await this.studentRepository.find({
          where: [
            { ...baseFilters, name: searchPattern },
            { ...baseFilters, studentId: searchPattern },
            { ...baseFilters, location: searchPattern },
            { ...baseFilters, exam: searchPattern },
          ],
          order: { createdAt: 'DESC' },
        });
      }
      return await this.studentRepository.find({
        where: baseFilters,
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Database Query Error:', error);
      throw error;
    }
  }
  async remove(id: number) {
    return await this.studentRepository.delete(id);
  }

  findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  count() {
    return this.studentRepository.count();
  }
}
