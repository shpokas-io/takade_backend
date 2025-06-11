import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { SessionService } from '../common/session.service';
import { SupabaseService } from '../common/supabase.service';
import {
  LoginDto,
  RegisterDto,
  UpdatePasswordDto,
  UpdateEmailDto,
  RefreshTokenDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // This endpoint would typically handle login logic
    // For now, we'll return a placeholder since Supabase handles auth
    return {
      message: 'Login endpoint - handled by Supabase client',
      email: loginDto.email,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // This endpoint would typically handle registration logic
    // For now, we'll return a placeholder since Supabase handles auth
    return {
      message: 'Registration endpoint - handled by Supabase client',
      email: registerDto.email,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const { session, error } = await this.supabaseService.refreshToken(
        refreshTokenDto.refreshToken,
      );

      if (error || !session) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      return {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      };
    } catch (error) {
      throw new HttpException('Token refresh failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // This would typically update password via Supabase
    return {
      message: 'Password update endpoint - implement Supabase password update',
      userId,
    };
  }

  @Post('update-email')
  @UseGuards(AuthGuard)
  async updateEmail(@Body() updateEmailDto: UpdateEmailDto, @Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // This would typically update email via Supabase
    return {
      message: 'Email update endpoint - implement Supabase email update',
      userId,
      newEmail: updateEmailDto.newEmail,
    };
  }

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
