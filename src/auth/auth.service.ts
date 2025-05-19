// Authentication logic removed. To be reimplemented later.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './types/user.type';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getGoogleAuthUrl() {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.BACKEND_URL}/auth/google/callback`,
        },
      });

      if (error) throw error;
      return { url: data.url };
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }

  async handleGoogleCallback(code: string) {
    try {
      const { data: { session }, error } = await this.supabaseService.supabase.auth.exchangeCodeForSession(code);
      if (error || !session) {
        throw new UnauthorizedException('Failed to exchange code for session');
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        hasCourseAccess: false
      };

      // Check course access
      const hasAccess = await this.checkUserAccess(user.id);
      user.hasCourseAccess = hasAccess;

      return {
        token: session.access_token,
        user
      };
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }

  async verifySession(token: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.getUser(token);
      if (error || !data.user) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying session:', error);
      return false;
    }
  }

  async getUserFromToken(token: string): Promise<User> {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.getUser(token);
      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        id: data.user.id,
        email: data.user.email!,
        hasCourseAccess: false // Will be updated by checkUserAccess
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.admin.getUserById(userId);
      if (error || !data.user) {
        throw new UnauthorizedException('User not found');
      }

      const hasAccess = await this.checkUserAccess(userId);
      return {
        id: data.user.id,
        email: data.user.email!,
        hasCourseAccess: hasAccess
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to get user profile');
    }
  }

  async checkUserAccess(userId: string): Promise<boolean> {
    try {
      const { data: userCourse, error } = await this.supabaseService.supabase
        .from('user_courses')
        .select('has_access')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking user access:', error);
        return false;
      }

      return userCourse?.has_access ?? false;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
    }
  }

  async updateCourseAccess(userId: string, hasAccess: boolean): Promise<void> {
    try {
      const { data: existingRecord, error: checkError } = await this.supabaseService.supabase
        .from('user_courses')
        .select('id, has_access')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingRecord) {
        const { error } = await this.supabaseService.supabase
          .from('user_courses')
          .insert([{ user_id: userId, has_access: hasAccess }]);
        if (error) throw error;
      } else {
        const { error } = await this.supabaseService.supabase
          .from('user_courses')
          .update({ has_access: hasAccess })
          .eq('user_id', userId);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating course access:', error);
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.supabase.auth.admin.signOut(userId);
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
} 