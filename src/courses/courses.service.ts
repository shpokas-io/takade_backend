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
    const { data: sections, error: sectionsError } =
      await this.supabaseService.supabase
        .from('sections')
        .select('*')
        .order('order_index');

    if (sectionsError) {
      throw new InternalServerErrorException('Failed to fetch course sections');
    }

    if (!sections?.length) {
      return [];
    }

    const courseData = await Promise.all(
      sections.map(async (section) => {
        const { data: lessons, error: lessonsError } =
          await this.supabaseService.supabase
            .from('lessons')
            .select('*, materials (*)')
            .eq('section_id', section.id)
            .order('order_index');

        if (lessonsError) {
          throw new InternalServerErrorException('Failed to fetch lessons');
        }

        return new CourseSectionDto(
          section.title,
          section.description,
          lessons?.map((lesson) => new LessonDto(lesson)) || [],
        );
      }),
    );

    return courseData;
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
