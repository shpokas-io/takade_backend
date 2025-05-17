import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { SupabaseModule } from './supabase.module';

@Module({
  imports: [CoursesModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
