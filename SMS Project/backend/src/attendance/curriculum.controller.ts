import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CurriculumService } from './curriculum.service'

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  async getAll() {
    return this.curriculumService.getAll()
  }

  @Post()
  async create(@Body() body: any) {
    return this.curriculumService.create(body)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.curriculumService.update(Number(id), body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.curriculumService.remove(Number(id))
  }
}
