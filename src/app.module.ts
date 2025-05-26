import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { SupabaseModule } from './supabase.module';

@Module({
  imports: [CoursesModule, SupabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
