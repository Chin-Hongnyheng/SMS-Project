import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/curriculum.entity';
import { Repository } from 'typeorm';
import { Lecture } from './entities/lecture.entity';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,

    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto) {
    const newSubject = this.subjectRepository.create(createCurriculumDto);
    return await this.subjectRepository.save(newSubject);
  }

  async findByCourse(courseName: string) {
    return await this.subjectRepository.find({
      where: {
        courseName: courseName,
      },
    });
  }

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id },

      relations: ['lectures', 'announcements'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: number, updateCurriculumDto: UpdateCurriculumDto) {
    const subject = await this.subjectRepository.preload({
      id: id,
      ...updateCurriculumDto,
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return await this.subjectRepository.save(subject);
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    return await this.subjectRepository.remove(subject);
  }

  async addLecture(
    subjectId: number,
    title: string,
    filePath: string,
    fileName: string,
  ) {
    const subject = await this.subjectRepository.findOneBy({ id: subjectId });
    if (!subject) throw new NotFoundException('Subject not found');

    const lecture = this.lectureRepository.create({
      title,
      fileUrl: filePath,
      fileName: fileName,
      subject,
    });
    return await this.lectureRepository.save(lecture);
  }
  async addAnnouncement(
    subjectId: number,
    data: { title: string; content: string },
  ) {
    const subject = await this.subjectRepository.findOneBy({ id: subjectId });
    if (!subject) throw new NotFoundException('Subject not found');

    const announcement = this.announcementRepository.create({
      ...data,
      subject,
    });
    return await this.announcementRepository.save(announcement);
  }
}
