import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExamType, ExamTypeStatus } from "./entities/exam-type.entity";
import { CreateExamTypeDto } from "./dto/create-exam-type.dto";
import { UpdateExamTypeDto } from "./dto/update-exam-type.dto";

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
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

    const examType = this.examTypeRepository.create(createExamTypeDto);
    return await this.examTypeRepository.save(examType);
  }

  /**
   * Get all exam types with pagination
   */
  async findAll(
    skip = 0,
    take = 10,
  ): Promise<{ data: ExamType[]; total: number }> {
    const [data, total] = await this.examTypeRepository.findAndCount({
      skip,
      take,
      order: { createdAt: "DESC" },
      relations: ["schedules"],
    });

    return { data, total };
  }

  /**
   * Get a single exam type by ID
   */
  async findOne(id: string): Promise<ExamType> {
    const examType = await this.examTypeRepository.findOne({
      where: { id },
      relations: ["schedules"],
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

    // Update fields
    if (updateExamTypeDto.name) examType.name = updateExamTypeDto.name;
    if (updateExamTypeDto.room !== undefined)
      examType.room = updateExamTypeDto.room;
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
        "Cannot delete exam type with associated schedules. Delete schedules first.",
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
