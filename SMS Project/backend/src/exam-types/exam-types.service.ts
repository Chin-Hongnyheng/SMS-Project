import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExamType,
  ExamTypeEnum,
  ExamTypeStatus,
} from './entities/exam-type.entity';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { Course } from '../course/entity/course.entity'
import { Subject } from '../curriculum/entities/curriculum.entity';

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  /**
   * Create a new exam type
   * Prevents duplicate exam type names
   */
  async create(createExamTypeDto: CreateExamTypeDto): Promise<ExamType> {
    const existingExamType = await this.examTypeRepository.findOne({
      where: { name: createExamTypeDto.name },
    });

    if (existingExamType) {
      throw new BadRequestException(
        `Exam type "${createExamTypeDto.name}" already exists`,
      );
    }

    // Fetch related course and subject
    const course = await this.courseRepository.findOne({
      where: { id: createExamTypeDto.courseId },
    });
    const subject = await this.subjectRepository.findOne({
      where: { id: createExamTypeDto.subjectId },
    });

    if (!course) throw new BadRequestException('Course not found');
    if (!subject) throw new BadRequestException('Subject not found');

    const examType = this.examTypeRepository.create({
      ...createExamTypeDto,
      course,
      subject,
    });

    return await this.examTypeRepository.save(examType);
  }

  /**
   * Get all exam types with pagination
   */
  async findAll(skip = 0, take = 10): Promise<{ data: ExamType[]; total: number }> {
      const [data, total] = await this.examTypeRepository.findAndCount({
        skip,
        take,
        order: { createdAt: 'DESC' },
        relations: ['course', 'subject', 'schedules'],
      });

      return { data, total };
    }

  /**
   * Get a single exam type by ID
   */
  async findOne(id: string): Promise<ExamType> {
    const examType = await this.examTypeRepository.findOne({
      where: { id },
      relations: ['course', 'subject', 'schedules'],
    });

    if (!examType) {
      throw new NotFoundException(`Exam type with ID ${id} not found`);
    }

    return examType;
  }

  /**
   * Update an exam type
   */
  async update(
    id: string,
    updateExamTypeDto: UpdateExamTypeDto,
  ): Promise<ExamType> {
    const examType = await this.findOne(id);

    // Check if new name already exists
    if (updateExamTypeDto.name && updateExamTypeDto.name !== examType.name) {
      const existingExamType = await this.examTypeRepository.findOne({
        where: { name: updateExamTypeDto.name },
      });
      if (existingExamType) {
        throw new BadRequestException(
          `Exam type "${updateExamTypeDto.name}" already exists`,
        );
      }
    }

    // Update course if courseId is provided
    if (updateExamTypeDto.courseId) {
      const course = await this.courseRepository.findOne({
        where: { id: updateExamTypeDto.courseId },
      });
      if (!course) throw new BadRequestException('Course not found');
      examType.course = course;
    }

    // Update subject if subjectId is provided
    if (updateExamTypeDto.subjectId) {
      const subject = await this.subjectRepository.findOne({
        where: { id: updateExamTypeDto.subjectId },
      });
      if (!subject) throw new BadRequestException('Subject not found');
      examType.subject = subject;
    }

    // Update other fields
    if (updateExamTypeDto.name) examType.name = updateExamTypeDto.name;
    if (updateExamTypeDto.description !== undefined)
      examType.description = updateExamTypeDto.description;
    if (updateExamTypeDto.status) examType.status = updateExamTypeDto.status;

    return await this.examTypeRepository.save(examType);
  }

  /**
   * Delete an exam type
   */
  async remove(id: string): Promise<{ message: string }> {
    const examType = await this.findOne(id);

    if (examType.schedules && examType.schedules.length > 0) {
      throw new BadRequestException(
        'Cannot delete exam type with associated schedules. Delete schedules first.',
      );
    }

    await this.examTypeRepository.remove(examType);
    return { message: `Exam type "${id}" deleted successfully` };
  }

  /**
   * Toggle exam type status
   */
  async toggleStatus(id: string): Promise<ExamType> {
    const examType = await this.findOne(id);
    examType.status =
      examType.status === ExamTypeStatus.ACTIVE
        ? ExamTypeStatus.INACTIVE
        : ExamTypeStatus.ACTIVE;
    return await this.examTypeRepository.save(examType);
  }
}
