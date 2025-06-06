import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new InternalServerErrorException('Missing Supabase credentials');
    }

    this.client = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
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

  get supabase(): SupabaseClient {
    return this.client;
  }
}
