import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { getEnvironmentConfig } from '../config/environment';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient<Database>;

  constructor() {
    const config = getEnvironmentConfig();

    this.client = createClient<Database>(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
      },
    );
  }

  async validateToken(
    token: string,
  ): Promise<{ user: User | null; error: any }> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser(token);
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ session: any; error: any }> {
    try {
      const { data, error } = await this.client.auth.refreshSession({
        refresh_token: refreshToken,
      });
      return { session: data.session, error };
    } catch (error) {
      return { session: null, error };
    }
  }

  get supabase(): SupabaseClient<Database> {
    return this.client;
  }
}
