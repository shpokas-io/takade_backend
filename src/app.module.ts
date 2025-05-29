import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { SupabaseModule } from './supabase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoursesModule, SupabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
