import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CourseSectionDto } from './dto/course-section.dto';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly sb: SupabaseService) {}

  async getCourseSections(): Promise<CourseSectionDto[]> {
    const { data: sections, error: secErr } = await this.sb.supabase
      .from('sections')
      .select('*')
      .order('order_index');
    if (secErr) throw secErr;

    const result: CourseSectionDto[] = [];
    for (const s of sections) {
      const { data: lessons, error: lesErr } = await this.sb.supabase
        .from('lessons')
        .select(`*, materials (*)`)
        .eq('section_id', s.id)
        .order('order_index');
      if (lesErr) throw lesErr;

      result.push({
        sectionTitle: s.title,
        description: s.description,
        lessons: lessons.map((l) => new LessonDto(l)),
      });
    }
    return result;
  }

  async getStartHere(): Promise<LessonDto | null> {
    const { data: lesson, error } = await this.sb.supabase
      .from('lessons')
      .select(`*, materials (*)`)
      .eq('order_index', 0)
      .single();
    return error ? null : new LessonDto(lesson);
  }

  async getLessonBySlug(slug: string): Promise<LessonDto | null> {
    const { data: lesson, error } = await this.sb.supabase
      .from('lessons')
      .select(`*, materials (*)`)
      .eq('slug', slug)
      .single();
    return error ? null : new LessonDto(lesson);
  }
}
