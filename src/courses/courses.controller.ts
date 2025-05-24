import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourseData() {
    return this.coursesService.getCourseData();
  }

  @Get('lesson/:slug')
  async getLessonBySlug(@Param('slug') slug: string) {
    return this.coursesService.getLessonBySlug(slug);
  }
}
