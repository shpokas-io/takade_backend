import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

interface SessionInfo {
  userId: string;
  lastActivity: Date;
  refreshToken?: string;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, SessionInfo>();
  private readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly supabaseService: SupabaseService) {
    setInterval(() => this.cleanupExpiredSessions(), 60 * 1000);
  }

  updateSession(userId: string, refreshToken?: string): void {
    this.sessions.set(userId, {
      userId,
      lastActivity: new Date(),
      refreshToken,
    });
  }

  isSessionValid(userId: string): boolean {
    const session = this.sessions.get(userId);
    if (!session) return false;

    const isValid =
      Date.now() - session.lastActivity.getTime() < this.SESSION_TIMEOUT;
    if (!isValid) {
      this.sessions.delete(userId);
    }

    return isValid;
  }

  async refreshTokenIfNeeded(
    userId: string,
  ): Promise<{ newToken?: string; shouldRefresh: boolean }> {
    const session = this.sessions.get(userId);
    if (!session?.refreshToken) return { shouldRefresh: false };

    try {
      const { session: newSession, error } =
        await this.supabaseService.refreshToken(session.refreshToken);

      if (error || !newSession) {
        this.sessions.delete(userId);
        return { shouldRefresh: false };
      }

      this.updateSession(userId, newSession.refresh_token);

      return {
        newToken: newSession.access_token,
        shouldRefresh: true,
      };
    } catch {
      this.sessions.delete(userId);
      return { shouldRefresh: false };
    }
  }

  removeSession(userId: string): void {
    this.sessions.delete(userId);
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [userId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() >= this.SESSION_TIMEOUT) {
        this.sessions.delete(userId);
      }
    }
  }
}
