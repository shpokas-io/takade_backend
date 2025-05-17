import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseSectionDto } from './dto/course-section.dto';
import { LessonDto } from './dto/lesson.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly cs: CoursesService) {}

  @Get() getAll(): Promise<CourseSectionDto[]> {
    return this.cs.getCourseSections();
  }
  @Get('start') getStart(): Promise<LessonDto | null> {
    return this.cs.getStartHere();
  }
  @Get(':slug') getBySlug(@Param('slug') slug: string) {
    return this.cs.getLessonBySlug(slug);
  }
}
