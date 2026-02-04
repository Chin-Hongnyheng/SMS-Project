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
import { ExamSchedulesService } from './exam-schedules.service';
import { CreateExamScheduleDto } from './dto/create-exam-schedule.dto';
import { UpdateExamScheduleDto } from './dto/update-exam-schedule.dto';

@Controller('exam-schedules')
export class ExamSchedulesController {
  constructor(private readonly examSchedulesService: ExamSchedulesService) {}

  /**
   * Create a new exam schedule
   * POST /exam-schedules
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExamScheduleDto: CreateExamScheduleDto) {
    return await this.examSchedulesService.create(createExamScheduleDto);
  }

  /**
   * Get all exam schedules with filters and pagination
   * GET /exam-schedules?skip=0&take=10&examTypeId=uuid&examDate=2026-02-10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('examTypeId') examTypeId?: string,
    @Query('examDate') examDate?: string,
  ) {
    return await this.examSchedulesService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 10,
      examTypeId,
      examDate,
    );
  }

  /**
   * Get a specific exam schedule by ID
   * GET /exam-schedules/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.examSchedulesService.findOne(id);
  }

  /**
   * Update an exam schedule
   * PATCH /exam-schedules/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateExamScheduleDto: UpdateExamScheduleDto,
  ) {
    return await this.examSchedulesService.update(id, updateExamScheduleDto);
  }

  /**
   * Delete an exam schedule
   * DELETE /exam-schedules/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.examSchedulesService.remove(id);
  }

  /**
   * Change exam schedule status
   * PATCH /exam-schedules/:id/status
   */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.examSchedulesService.changeStatus(id, status);
  }
}
