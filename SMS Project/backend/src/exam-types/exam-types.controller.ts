import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

@Controller('exam-types')
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  /**
   * Create a new exam type
   * POST /exam-types
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return await this.examTypesService.create(createExamTypeDto);
  }

  /**
   * Get all exam types with pagination
   * GET /exam-types?skip=0&take=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return await this.examTypesService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 10,
    );
  }

  /**
   * Get a specific exam type by ID
   * GET /exam-types/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.examTypesService.findOne(id);
  }

  /**
   * Update an exam type
   * PATCH /exam-types/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateExamTypeDto: UpdateExamTypeDto,
  ) {
    return await this.examTypesService.update(id, updateExamTypeDto);
  }

  /**
   * Delete an exam type
   * DELETE /exam-types/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.examTypesService.remove(id);
  }

  /**
   * Toggle exam type status (ACTIVE/INACTIVE)
   * PATCH /exam-types/:id/toggle-status
   */
  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id') id: string) {
    return await this.examTypesService.toggleStatus(id);
  }
}
