// Authentication logic removed. To be reimplemented later.

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

  async verifySession(token: string): Promise<boolean> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      if (error || !user) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying session:', error);
      return false;
    }
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
      const { data: existingRecord, error: checkError } = await this.supabase
        .from('user_courses')
        .select('id, has_access')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingRecord) {
        const { error } = await this.supabase
          .from('user_courses')
          .insert([{ user_id: userId, has_access: hasAccess }]);
        if (error) throw error;
      } else {
        const { error } = await this.supabase
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

  async getSession(userId: string) {
    const { data: session, error } = await this.supabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return session;
  }
} 