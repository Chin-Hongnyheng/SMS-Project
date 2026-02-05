import { Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe, UploadedFiles, UseInterceptors, NotFoundException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserInfoDto } from './dto/create-userinfo.dto';
import { UserInfoService } from './userinfo.service';
import * as multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

export const userInfoMulterOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads/userinfo';
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

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  // Create new user info with file upload
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, userInfoMulterOptions)) // max 5 files
  create(@Body() createUserInfoDto: CreateUserInfoDto, @UploadedFiles() files: Express.Multer.File[]) {
    const fileData = files.map(file => ({
      filename: file.originalname,
      url: `/uploads/userinfo/${file.filename}`,
    }));

    return this.userInfoService.create({ ...createUserInfoDto, files: fileData });
  }

  // Get all user info
  @Get()
  findAll() {
    return this.userInfoService.findAll();
  }

  // Get user info by userId
  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const userInfo = await this.userInfoService.findByUserId(userId);
    if (!userInfo) {
      // return 404 if no record
      throw new NotFoundException(`No user-info found for userId ${userId}`);
    }
    return userInfo;
  }

  // Get user info by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userInfoService.findOne(id);
  }

  // Update user info
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5, userInfoMulterOptions)) // optional new files
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateUserInfoDto>,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      const fileData = files.map(file => ({
        filename: file.originalname,
        url: `/uploads/userinfo/${file.filename}`,
      }));
      updateData.files = fileData;
    }
    return this.userInfoService.update(id, updateData);
  }

  // Delete user info
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userInfoService.remove(id);
  }

}
