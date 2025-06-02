import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const { user, error } = await this.supabaseService.validateToken(token);

    if (error || !user) {
      this.logger.warn('Token validation failed', { error: error?.message });
      throw new UnauthorizedException('Invalid token');
    }

    // Check if session exists and is valid
    if (!this.sessionService.isSessionValid(user.id)) {
      this.logger.log(`Creating new session for user ${user.id}`);
      this.sessionService.updateSession(user.id);
    } else {
      // Update existing session activity
      this.sessionService.updateSession(user.id);
    }

    // Check if token needs refresh
    const { newToken, shouldRefresh } = await this.sessionService.refreshTokenIfNeeded(user.id, token);
    
    if (shouldRefresh && newToken) {
      // Send new token in response header
      response.setHeader('X-New-Token', newToken);
      this.logger.log(`Token refreshed for user ${user.id}`);
    }

    // Attach user to request
    request.user = user;
    return true;
  }
} 