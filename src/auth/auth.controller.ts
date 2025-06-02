import { Controller, Post, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { SessionService } from '../common/session.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly sessionService: SessionService) {}

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req: any) {
    try {
      const userId = req.user?.id;
      
      if (userId) {
        this.sessionService.removeSession(userId);
        this.logger.log(`User ${userId} logged out successfully`);
      }

      return { 
        success: true, 
        message: 'Logged out successfully' 
      };
    } catch (error) {
      this.logger.error('Logout error:', error);
      return { 
        success: false, 
        message: 'Logout failed' 
      };
    }
  }

  @Post('session/status')
  @UseGuards(AuthGuard)
  async getSessionStatus(@Request() req: any) {
    const userId = req.user?.id;
    const isValid = userId ? this.sessionService.isSessionValid(userId) : false;
    
    return {
      isValid,
      userId,
      activeSessions: this.sessionService.getActiveSessionsCount()
    };
  }
} 