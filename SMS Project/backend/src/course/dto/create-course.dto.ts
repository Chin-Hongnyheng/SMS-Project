import { IsString } from 'class-validator'
export class CreateCourseDto{

    @IsString()
    courseName: string;
}