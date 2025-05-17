import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('access/:userId')
  async checkUserAccess(@Param('userId') userId: string) {
    return this.authService.checkUserAccess(userId);
  }

  @Post('access/:userId')
  async updateCourseAccess(
    @Param('userId') userId: string,
    @Body('hasAccess') hasAccess: boolean,
  ) {
    return this.authService.updateCourseAccess(userId, hasAccess);
  }
} 