import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { CourseSectionDto } from './dto/course-section.dto';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async getCourseData() {
    const { data: sections, error: sectionsError } = await this.supabase
      .from("sections")
      .select("*")
      .order("order_index");

    if (sectionsError) throw sectionsError;

    const courseData = [];

    for (const section of sections) {
      const { data: lessons, error: lessonsError } = await this.supabase
        .from("lessons")
        .select(
          `
          *,
          materials (*)
        `
        )
        .eq("section_id", section.id)
        .order("order_index");

      if (lessonsError) throw lessonsError;

      const formattedLessons = lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        videoThumbnail: lesson.video_thumbnail,
        videoUrl: lesson.video_url,
        materials: lesson.materials?.map((material: { name: any; url: any }) => ({
          name: material.name,
          url: material.url,
        })),
      }));

      courseData.push({
        sectionTitle: section.title,
        description: section.description,
        lessons: formattedLessons,
      });
    }

    return courseData;
  }

  async getStartHereLesson() {
    const { data, error } = await this.supabase
      .from("lessons")
      .select("*")
      .eq("is_start_here", true)
      .single();

    if (error) throw error;
    return data;
  }

  async getLessonBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("lessons")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }
}
