import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ExamResult,
  ExamResultGrade,
  ExamResultRemark,
} from "./entities/exam-result.entity";
import { CreateExamResultDto } from "./dto/create-exam-result.dto";
import { UpdateExamResultDto } from "./dto/update-exam-result.dto";
import { ExamSchedulesService } from "../exam-schedules/exam-schedules.service";

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
    private readonly examSchedulesService: ExamSchedulesService,
  ) {}

  /**
   * Create a new exam result
   * Auto-calculates grade based on score
   * Prevents duplicate result per student per exam
   */
  async create(createExamResultDto: CreateExamResultDto): Promise<ExamResult> {
    // Verify exam schedule exists
    await this.examSchedulesService.findOne(createExamResultDto.examScheduleId);

    // Check if result already exists for this student and exam
    const existingResult = await this.examResultRepository.findOne({
      where: {
        studentId: createExamResultDto.studentId,
        examScheduleId: createExamResultDto.examScheduleId,
      },
    });

    if (existingResult) {
      throw new BadRequestException(
        "Result already exists for this student and exam schedule",
      );
    }

    // Calculate grade based on score
    const grade = this.calculateGrade(createExamResultDto.score);
    const remarks =
      createExamResultDto.score >= 50
        ? ExamResultRemark.PASS
        : ExamResultRemark.FAIL;

    const result = this.examResultRepository.create({
      ...createExamResultDto,
      grade,
      remarks,
    });

    return await this.examResultRepository.save(result);
  }

  /**
   * Get all exam results with pagination and filtering
   */
  async findAll(
    skip = 0,
    take = 10,
    studentId?: string,
    examScheduleId?: string,
  ): Promise<{ data: ExamResult[]; total: number }> {
    const query = this.examResultRepository
      .createQueryBuilder("result")
      .leftJoinAndSelect("result.examSchedule", "examSchedule")
      .leftJoinAndSelect("examSchedule.course", "course")
      .leftJoinAndSelect("examSchedule.examType", "examType");

    if (studentId) {
      query.andWhere("result.studentId = :studentId", { studentId });
    }

    if (examScheduleId) {
      query.andWhere("result.examScheduleId = :examScheduleId", {
        examScheduleId,
      });
    }

    query.skip(skip).take(take).orderBy("result.enteredAt", "DESC");

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * Get a single exam result by ID
   */
  async findOne(id: string): Promise<ExamResult> {
    const result = await this.examResultRepository.findOne({
      where: { id },
      relations: ["examSchedule"],
    });

    if (!result) {
      throw new NotFoundException(`Exam result with ID ${id} not found`);
    }

    return result;
  }

  /**
   * Update an exam result
   * Recalculates grade if score is updated
   */
  async update(
    id: string,
    updateExamResultDto: UpdateExamResultDto,
  ): Promise<ExamResult> {
    const result = await this.findOne(id);

    if (updateExamResultDto.score !== undefined) {
      const newGrade = this.calculateGrade(updateExamResultDto.score);
      const newRemarks =
        updateExamResultDto.score >= 50
          ? ExamResultRemark.PASS
          : ExamResultRemark.FAIL;

      Object.assign(result, {
        ...updateExamResultDto,
        grade: newGrade,
        remarks: newRemarks,
      });
    } else {
      Object.assign(result, updateExamResultDto);
    }

    return await this.examResultRepository.save(result);
  }

  /**
   * Delete an exam result
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.findOne(id);
    await this.examResultRepository.remove(result);
    return { message: `Exam result "${id}" deleted successfully` };
  }

  /**
   * Search results by student and exam
   */
  async searchResults(
    studentId?: string,
    examScheduleId?: string,
  ): Promise<ExamResult[]> {
    const query = this.examResultRepository.createQueryBuilder("result");

    if (studentId) {
      query.andWhere("result.studentId = :studentId", { studentId });
    }

    if (examScheduleId) {
      query.andWhere("result.examScheduleId = :examScheduleId", {
        examScheduleId,
      });
    }

    return await query.getMany();
  }

  /**
   * Helper: Calculate grade based on score
   * A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59
   */
  private calculateGrade(score: number): ExamResultGrade {
    if (score >= 90) return ExamResultGrade.A;
    if (score >= 80) return ExamResultGrade.B;
    if (score >= 70) return ExamResultGrade.C;
    if (score >= 60) return ExamResultGrade.D;
    return ExamResultGrade.F;
  }
}
