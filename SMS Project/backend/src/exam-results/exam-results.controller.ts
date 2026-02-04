import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamResultsService } from './exam-results.service';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';

@Controller('exam-results')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  /**
   * Create a new exam result
   * POST /exam-results
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExamResultDto: CreateExamResultDto) {
    return await this.examResultsService.create(createExamResultDto);
  }

  /**
   * Get all exam results with filters and pagination
   * GET /exam-results?skip=0&take=10&studentId=uuid&examScheduleId=uuid
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('studentId') studentId?: string,
    @Query('examScheduleId') examScheduleId?: string,
  ) {
    return await this.examResultsService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 10,
      studentId,
      examScheduleId,
    );
  }

  /**
   * Get a specific exam result by ID
   * GET /exam-results/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.examResultsService.findOne(id);
  }

  /**
   * Update an exam result
   * PATCH /exam-results/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateExamResultDto: UpdateExamResultDto,
  ) {
    return await this.examResultsService.update(id, updateExamResultDto);
  }

  /**
   * Delete an exam result
   * DELETE /exam-results/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.examResultsService.remove(id);
  }

  /**
   * Search exam results by student and/or exam schedule
   * GET /exam-results/search?studentId=uuid&examScheduleId=uuid
   */
  @Get('search/query')
  @HttpCode(HttpStatus.OK)
  async searchResults(
    @Query('studentId') studentId?: string,
    @Query('examScheduleId') examScheduleId?: string,
  ) {
    return await this.examResultsService.searchResults(
      studentId,
      examScheduleId,
    );
  }
}
