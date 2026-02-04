import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Course } from './entity/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    ) {}

    async create(dto: CreateCourseDto, file?: Express.Multer.File){
        const course = this.courseRepo.create({
            ...dto,
            image: file?.filename || '',
        });
        console.log("Course created");
        return this.courseRepo.save(course);
    }

    async findAll(){
        return this.courseRepo.find();
    }

    async findOne(id: number){
        const course = await this.courseRepo.findOne({
            where: { id },
        });
        if (!course) throw new NotFoundException(`Course with id ${id} not found`);
        return course;
    }

    async update(id:number, dto: Partial<CreateCourseDto>, file?: Express.Multer.File){
        const course = await this.findOne(id);

        Object.assign(course, dto);

        if(file){
            course.image = file.filename;
        }

        console.log("Course Updated");
        return this.courseRepo.save(course);
    }

    async remove(id:number){
        const course = await this.findOne(id);
        return this.courseRepo.remove(course);
    }
}
