import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async checkUserAccess(userId: string): Promise<boolean> {
    try {
      const { data: userCourse, error } = await this.supabase
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
      const { error } = await this.supabase
        .from('user_courses')
        .upsert({
          user_id: userId,
          has_access: hasAccess,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating course access:', error);
      throw error;
    }
  }
} 