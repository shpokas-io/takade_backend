import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '../common/auth.guard';
import { CourseSectionDto, LessonDto, LessonSlugDto } from './dto';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourseData(): Promise<CourseSectionDto[]> {
    return this.coursesService.getCourseData();
  }

  @Get('lesson/:slug')
  async getLessonBySlug(@Param() params: LessonSlugDto): Promise<LessonDto> {
    return this.coursesService.getLessonBySlug(params.slug);
  }
}
