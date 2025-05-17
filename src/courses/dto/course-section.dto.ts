import { LessonDto } from './lesson.dto';

export class CourseSectionDto {
  sectionTitle!: string;
  description!: string;
  lessons!: LessonDto[];
}
