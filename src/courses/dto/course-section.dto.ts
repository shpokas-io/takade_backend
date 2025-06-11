import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LessonDto } from './lesson.dto';

export class CourseSectionDto {
  @IsString({ message: 'Section title must be a string' })
  @IsNotEmpty({ message: 'Section title is required' })
  sectionTitle: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsArray({ message: 'Lessons must be an array' })
  @ValidateNested({ each: true })
  @Type(() => LessonDto)
  lessons: LessonDto[];

  constructor(sectionTitle: string, description: string, lessons: LessonDto[]) {
    this.sectionTitle = sectionTitle;
    this.description = description;
    this.lessons = lessons;
  }
}
