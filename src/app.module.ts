import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase.module';

@Module({
  imports: [CoursesModule, AuthModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
