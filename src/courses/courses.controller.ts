import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '../common/auth.guard';
import { CourseSectionDto } from './dto/course-section.dto';
import { LessonDto } from './dto/lesson.dto';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourseData(): Promise<CourseSectionDto[]> {
    return this.coursesService.getCourseData();
  }

  @Get('lesson/:slug')
  async getLessonBySlug(@Param('slug') slug: string): Promise<LessonDto> {
    return this.coursesService.getLessonBySlug(slug);
  }
}
