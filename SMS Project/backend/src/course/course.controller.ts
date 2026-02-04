import { Controller, Post, Delete, Get, Patch, Body, Param, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads/courses';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + '-' + file.originalname);
    },
  }),
};

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService){
      console.log('CourseController loaded');
    }

    @Get()
    findAll(){
        return this.courseService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number){
        return this.courseService.findOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', multerOptions))
    create(
    @Body() dto: CreateCourseDto,
    @UploadedFile() file?: Express.Multer.File, // optional
    ){
    return this.courseService.create(dto, file);
    }


    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', multerOptions))
    update(
        @Param('id', ParseIntPipe) id:number,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: Partial<CreateCourseDto>,
    ){
        return this.courseService.update(id, dto, file);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.courseService.remove(id);
    }
}
