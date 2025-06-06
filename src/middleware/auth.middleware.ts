import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid authorization header');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const { user, error } = await this.supabaseService.validateToken(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      req['user'] = user;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        res.status(401).json({
          statusCode: 401,
          message: error.message,
          error: 'Unauthorized',
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          message: 'Authentication failed',
          error: 'Internal Server Error',
        });
      }
    }
  }
}
