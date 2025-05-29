import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  providers: [],
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the auth middleware to all routes except /auth and /health
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/(.*)', 'health')
      .forRoutes('*');
  }
} 