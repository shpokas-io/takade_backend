import { Module, Controller, Get } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { SupabaseModule } from './supabase.module';
import { AuthModule } from './auth/auth.module';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    };
  }
}

@Module({
  imports: [CoursesModule, SupabaseModule, AuthModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
