import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';
import { CourseSectionDto } from './dto/course-section.dto';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getCourseData(): Promise<CourseSectionDto[]> {
    const { data: sectionsWithLessons, error } = await this.supabaseService.supabase
      .from('sections')
      .select(`
        *,
        lessons (
          *,
          materials (*)
        )
      `)
      .order('order_index')
      .order('lessons(order_index)');

    if (error) {
      throw new InternalServerErrorException('Failed to fetch course data');
    }

    if (!sectionsWithLessons?.length) {
      return [];
    }

    return sectionsWithLessons.map(section => 
      new CourseSectionDto(
        section.title,
        section.description,
        section.lessons?.map(lesson => new LessonDto(lesson)) || []
      )
    );
  }

  async getLessonBySlug(slug: string): Promise<LessonDto> {
    const { data, error } = await this.supabaseService.supabase
      .from('lessons')
      .select('*, materials (*)')
      .eq('slug', slug)
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to fetch lesson');
    }

    if (!data) {
      throw new NotFoundException(`Lesson with slug '${slug}' not found`);
    }

    return new LessonDto(data);
  }
}
