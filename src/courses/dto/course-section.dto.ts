import { LessonDto } from './lesson.dto';

export class CourseSectionDto {
  sectionTitle: string;
  description: string;
  lessons: LessonDto[];

  constructor(sectionTitle: string, description: string, lessons: LessonDto[]) {
    this.sectionTitle = sectionTitle;
    this.description = description;
    this.lessons = lessons;
  }
}
