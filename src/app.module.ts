import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { HealthController } from './health/health.controller';

@Module({
  imports: [CommonModule, CoursesModule, AuthModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('health').forRoutes('*');
  }
}
