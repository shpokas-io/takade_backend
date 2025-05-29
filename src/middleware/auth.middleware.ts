import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('AuthMiddleware initialized with Supabase client');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Processing request:', req.method, req.path);
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        console.log('No authorization header found');
        throw new UnauthorizedException('No authorization header');
      }

      console.log('Authorization header found:', authHeader.substring(0, 20) + '...');
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        console.log('No token found in authorization header');
        throw new UnauthorizedException('No token provided');
      }

      console.log('Validating token with Supabase...');
      const { data: { user }, error } = await this.supabase.auth.getUser(token);

      if (error) {
        console.error('Token validation error:', error);
        throw new UnauthorizedException('Invalid token');
      }

      if (!user) {
        console.log('No user found for token');
        throw new UnauthorizedException('Invalid token');
      }

      console.log('Token validated successfully for user:', user.id);
      // Attach the user to the request for use in controllers
      req['user'] = user;
      next();
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
} 