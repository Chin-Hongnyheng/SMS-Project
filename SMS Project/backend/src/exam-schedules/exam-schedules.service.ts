import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { ExamSchedule } from './entities/exam-schedule.entity';
import { CreateExamScheduleDto } from './dto/create-exam-schedule.dto';
import { UpdateExamScheduleDto } from './dto/update-exam-schedule.dto';
import { ExamTypesService } from '../exam-types/exam-types.service';

@Injectable()
export class ExamSchedulesService {
  constructor(
    @InjectRepository(ExamSchedule)
    private readonly examScheduleRepository: Repository<ExamSchedule>,
    private readonly examTypesService: ExamTypesService,
  ) {}

  /**
   * Create a new exam schedule
   * Prevents overlapping exams in the same room and time
   */
  async create(
    createExamScheduleDto: CreateExamScheduleDto,
  ): Promise<ExamSchedule> {
    // Verify exam type exists
    await this.examTypesService.findOne(createExamScheduleDto.examTypeId);

    // Check for overlapping exams in the same room
    const overlap = await this.findOverlappingExams(
      createExamScheduleDto.room,
      createExamScheduleDto.examDate,
      createExamScheduleDto.startTime,
      createExamScheduleDto.endTime,
    );

    if (overlap) {
      throw new BadRequestException(
        `Exam already scheduled in room "${createExamScheduleDto.room}" at the same time`,
      );
    }

    const schedule = this.examScheduleRepository.create(createExamScheduleDto);
    return await this.examScheduleRepository.save(schedule);
  }

  /**
   * Get all exam schedules with pagination and filtering
   */
  async findAll(
    skip = 0,
    take = 10,
    examTypeId?: string,
    examDate?: string,
  ): Promise<{ data: ExamSchedule[]; total: number }> {
    const query = this.examScheduleRepository.createQueryBuilder('schedule');

    if (examTypeId) {
      query.andWhere('schedule.examTypeId = :examTypeId', { examTypeId });
    }

    if (examDate) {
      query.andWhere('schedule.examDate = :examDate', { examDate });
    }

    query
      .skip(skip)
      .take(take)
      .orderBy('schedule.examDate', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC');

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * Get a single exam schedule by ID
   */
  async findOne(id: string): Promise<ExamSchedule> {
    const schedule = await this.examScheduleRepository.findOne({
      where: { id },
      relations: ['examType', 'results'],
    });

    if (!schedule) {
      throw new NotFoundException(`Exam schedule with ID ${id} not found`);
    }

    return schedule;
  }

  /**
   * Update an exam schedule
   */
  async update(
    id: string,
    updateExamScheduleDto: UpdateExamScheduleDto,
  ): Promise<ExamSchedule> {
    const schedule = await this.findOne(id);

    // Verify exam type if being updated
    if (updateExamScheduleDto.examTypeId) {
      await this.examTypesService.findOne(updateExamScheduleDto.examTypeId);
    }

    // Check for overlapping exams if date/time/room is being updated
    if (
      updateExamScheduleDto.room ||
      updateExamScheduleDto.examDate ||
      updateExamScheduleDto.startTime ||
      updateExamScheduleDto.endTime
    ) {
      const room = updateExamScheduleDto.room || schedule.room;
      const examDate = updateExamScheduleDto.examDate || schedule.examDate;
      const startTime = updateExamScheduleDto.startTime || schedule.startTime;
      const endTime = updateExamScheduleDto.endTime || schedule.endTime;

      const overlap = await this.findOverlappingExams(
        room,
        examDate.toString(),
        startTime,
        endTime,
        id, // Exclude current schedule
      );

      if (overlap) {
        throw new BadRequestException(
          `Exam already scheduled in room "${room}" at the same time`,
        );
      }
    }

    Object.assign(schedule, updateExamScheduleDto);
    return await this.examScheduleRepository.save(schedule);
  }

  /**
   * Delete an exam schedule
   */
  async remove(id: string): Promise<{ message: string }> {
    const schedule = await this.findOne(id);

    // Check if schedule has results
    if (schedule.results && schedule.results.length > 0) {
      throw new BadRequestException(
        'Cannot delete exam schedule with existing results. Delete results first.',
      );
    }

    await this.examScheduleRepository.remove(schedule);
    return { message: `Exam schedule "${id}" deleted successfully` };
  }

  /**
   * Helper: Find overlapping exams in the same room
   */
  private async findOverlappingExams(
    room: string,
    examDate: string,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<ExamSchedule | null> {
    const query = this.examScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.room = :room', { room })
      .andWhere('schedule.examDate = :examDate', { examDate })
      .andWhere('schedule.status != :cancelled', { cancelled: 'CANCELLED' });

    // Time overlap logic: NOT (new.end <= existing.start OR new.start >= existing.end)
    // PostgreSQL uses direct time comparison (cast string to time type)
    // Note: Column names must be quoted to preserve camelCase in PostgreSQL
    query.andWhere(
      `NOT (
        CAST(:endTime AS TIME) <= schedule."startTime" OR
        CAST(:startTime AS TIME) >= schedule."endTime"
      )`,
      { startTime, endTime },
    );

    if (excludeId) {
      query.andWhere('schedule.id != :excludeId', { excludeId });
    }

    return await query.getOne();
  }

  /**
   * Change exam schedule status
   */
  async changeStatus(id: string, status: string): Promise<ExamSchedule> {
    const schedule = await this.findOne(id);
    schedule.status = status as any;
    return await this.examScheduleRepository.save(schedule);
  }
}
