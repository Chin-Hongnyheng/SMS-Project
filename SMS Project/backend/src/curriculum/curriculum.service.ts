import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/curriculum.entity';
import { Repository } from 'typeorm';
import { Lecture } from './entities/lecture.entity';
import { Announcement } from './entities/announcement.entity';
import { Course } from '../course/entity/course.entity'

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,

    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,

    @InjectRepository(Course)
  private readonly courseRepository: Repository<Course>,
  ) {}

async create(dto: CreateCurriculumDto) {
  const course = await this.courseRepository.findOne({
    where: { id: Number(dto.courseId) },
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  const subject = this.subjectRepository.create({
    name: dto.name,
    description: dto.description,
    code: dto.code,
    lectureHours: dto.lectureHours,
    labHours: dto.labHours,
    year: dto.year,
    semester: dto.semester,
    course: course,
  });

  return await this.subjectRepository.save(subject);
}


  async findByCourse(courseId: number) {
    return await this.subjectRepository.find({
      where: {
        course: { id: courseId },
      },
      relations: ['course', 'lectures', 'announcements'],
    });
  }


  async findAll() {
    const subjects = await this.subjectRepository.find({ relations: ['course'] });
    return subjects.map((s) => ({
      id: s.id,
      name: s.name,
      courseId: s.course.id,  // <-- now frontend gets courseId
      description: s.description,
      code: s.code,
      lectureHours: s.lectureHours,
      labHours: s.labHours,
      year: s.year,
      semester: s.semester,
    }));
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

async update(id: number, dto: UpdateCurriculumDto) {
  const subject = await this.subjectRepository.findOne({
    where: { id },
    relations: ['course'],
  });

  if (!subject) {
    throw new NotFoundException(`Subject with ID ${id} not found`);
  }

  // ✅ handle course relation
  if (dto.courseId !== undefined) {
    const course = await this.courseRepository.findOne({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    subject.course = course;
  }

  if (dto.name !== undefined) subject.name = dto.name;
  if (dto.description !== undefined) subject.description = dto.description;
  if (dto.code !== undefined) subject.code = dto.code;
  if (dto.lectureHours !== undefined) subject.lectureHours = dto.lectureHours;
  if (dto.labHours !== undefined) subject.labHours = dto.labHours;
  if (dto.year !== undefined) subject.year = dto.year;
  if (dto.semester !== undefined) subject.semester = dto.semester;

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
