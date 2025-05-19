// Authentication logic removed. To be reimplemented later.

import { Controller, Get, Post, Body, Param, UseGuards, Req, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';
import { User } from './types/user.type';

// Extend Express Request type to include user
interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleAuth() {
    return this.authService.getGoogleAuthUrl();
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { code } = req.query;
    if (!code) {
      throw new UnauthorizedException('No code provided');
    }

    const { token, user } = await this.authService.handleGoogleCallback(code as string);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Post('verify-session')
  async verifySession(@Body('token') token: string) {
    const isValid = await this.authService.verifySession(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid session');
    }
    return { valid: true };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getUserProfile(req.user.id);
  }

  @Get('access/:userId')
  @UseGuards(AuthGuard)
  async checkUserAccess(@Param('userId') userId: string) {
    return this.authService.checkUserAccess(userId);
  }

  @Post('access/:userId')
  @UseGuards(AuthGuard)
  async updateCourseAccess(
    @Param('userId') userId: string,
    @Body('hasAccess') hasAccess: boolean,
  ) {
    return this.authService.updateCourseAccess(userId, hasAccess);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.id);
  }
} 