import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { SessionService } from '../common/session.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    this.sessionService.removeSession(userId);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('session/status')
  @UseGuards(AuthGuard)
  async getSessionStatus(@Req() req: any) {
    const userId = req.user?.id;
    const isValid = userId ? this.sessionService.isSessionValid(userId) : false;

    return {
      isValid,
      userId,
      activeSessions: this.sessionService.getActiveSessionsCount(),
    };
  }
}
