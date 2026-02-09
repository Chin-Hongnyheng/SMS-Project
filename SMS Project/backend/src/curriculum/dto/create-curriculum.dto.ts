export class CreateCurriculumDto {
  name: string;
  description?: string;
  code: string;
  lectureHours: number;
  labHours: number;
  year: number;
  semester: number;
  courseId: number;
}
