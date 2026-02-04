import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service.js';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  findAll(@Query('courseName') courseName?: string) {
    if (courseName) return this.curriculumService.findByCourse(courseName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curriculumService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ) {
    return this.curriculumService.update(+id, updateCurriculumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curriculumService.remove(+id);
  }

  // 1. ADD LECTURE WITH FILE UPLOAD
  @Post(':subjectId/lecture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/lectures',
        filename: (
          req: any,
          file: any,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname((file as { originalname: string }).originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addLecture(
    @Param('subjectId') subjectId: string,
    @Body('title') title: string,
    @UploadedFile() file: any, // 'any' stops the 'IsolatedModules' error
  ) {
    if (!file) {
      throw new Error('File upload failed');
    }

    // Use type casting here to stop the red lines on .path and .originalname
    const filePath = (file as { path: string }).path;
    const fileName = (file as { originalname: string }).originalname;

    return this.curriculumService.addLecture(
      +subjectId,
      title,
      filePath,
      fileName,
    );
  }

  // 2. ADD ANNOUNCEMENT
  @Post(':subjectId/announcement')
  async addAnnouncement(
    @Param('subjectId') subjectId: string,
    @Body() data: { title: string; content: any },
  ) {
    return this.curriculumService.addAnnouncement(+subjectId, data);
  }
}
