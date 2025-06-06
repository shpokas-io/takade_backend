import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = this.extractToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }

    const { user, error } = await this.supabaseService.validateToken(token);
    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    this.sessionService.updateSession(user.id);

    const { newToken, shouldRefresh } =
      await this.sessionService.refreshTokenIfNeeded(user.id);
    if (shouldRefresh && newToken) {
      response.setHeader('X-New-Token', newToken);
    }

    request.user = user;
    return true;
  }

  private extractToken(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
