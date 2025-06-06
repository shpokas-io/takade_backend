import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class CoursesService {
  private readonly supabase: SupabaseClient<Database>;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new InternalServerErrorException('Missing Supabase credentials');
    }

    this.supabase = createClient<Database>(url, key);
  }

  async getCourseData() {
    const { data: sections, error: sectionsError } = await this.supabase
      .from('sections')
      .select('*')
      .order('order_index');

    if (sectionsError)
      throw new InternalServerErrorException(sectionsError.message);
    if (!sections) return [];

    const courseData = await Promise.all(
      sections.map(async (section) => {
        const { data: lessons, error: lessonsError } = await this.supabase
          .from('lessons')
          .select(`*, materials (*)`)
          .eq('section_id', section.id)
          .order('order_index');

        if (lessonsError)
          throw new InternalServerErrorException(lessonsError.message);

        return {
          sectionTitle: section.title,
          description: section.description,
          lessons:
            lessons?.map((lesson) => ({
              slug: lesson.slug,
              title: lesson.title,
              description: lesson.description,
              videoUrl: lesson.video_url,
              videoThumbnail: lesson.video_thumbnail,
              materials:
                lesson.materials?.map(({ name, url }) => ({ name, url })) || [],
            })) || [],
        };
      }),
    );

    return courseData;
  }

  async getLessonBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('lessons')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) return null;

    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      videoThumbnail: data.video_thumbnail,
      materials: data.materials || [],
    };
  }
}
