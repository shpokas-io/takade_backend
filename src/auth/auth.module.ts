import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  providers: [],
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the auth middleware to all routes except /auth
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/(.*)')
      .forRoutes('*');
  }
} 