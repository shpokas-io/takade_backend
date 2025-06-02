import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

interface SessionInfo {
  userId: string;
  lastActivity: Date;
  refreshToken?: string;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly sessions = new Map<string, SessionInfo>();
  private readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private readonly REFRESH_THRESHOLD = 2 * 60 * 1000; // 2 minutes before expiry

  constructor(private readonly supabaseService: SupabaseService) {
    // Clean up expired sessions every minute
    setInterval(() => this.cleanupExpiredSessions(), 60 * 1000);
  }

  updateSession(userId: string, refreshToken?: string): void {
    this.sessions.set(userId, {
      userId,
      lastActivity: new Date(),
      refreshToken,
    });
    this.logger.log(`Session updated for user ${userId}`);
  }

  isSessionValid(userId: string): boolean {
    const session = this.sessions.get(userId);
    if (!session) {
      this.logger.debug(`No session found for user ${userId}`);
      return false;
    }

    const now = new Date();
    const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
    const isValid = timeSinceLastActivity < this.SESSION_TIMEOUT;
    
    if (!isValid) {
      this.logger.log(`Session expired for user ${userId} (inactive for ${Math.round(timeSinceLastActivity / 1000)}s)`);
      this.sessions.delete(userId);
    }
    
    return isValid;
  }

  async refreshTokenIfNeeded(userId: string, currentToken: string): Promise<{ newToken?: string; shouldRefresh: boolean }> {
    const session = this.sessions.get(userId);
    if (!session?.refreshToken) {
      return { shouldRefresh: false };
    }

    try {
      // Check if token is close to expiry (simplified check)
      const { session: newSession, error } = await this.supabaseService.refreshToken(session.refreshToken);
      
      if (error || !newSession) {
        this.logger.warn(`Token refresh failed for user ${userId}`, error);
        // Remove invalid session
        this.sessions.delete(userId);
        return { shouldRefresh: false };
      }

      // Update session with new refresh token
      this.updateSession(userId, newSession.refresh_token);
      
      return { 
        newToken: newSession.access_token, 
        shouldRefresh: true 
      };
    } catch (error) {
      this.logger.error(`Token refresh error for user ${userId}`, error);
      // Remove invalid session
      this.sessions.delete(userId);
      return { shouldRefresh: false };
    }
  }

  removeSession(userId: string): void {
    const removed = this.sessions.delete(userId);
    if (removed) {
      this.logger.log(`Session removed for user ${userId}`);
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [userId, session] of this.sessions.entries()) {
      const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
      if (timeSinceLastActivity >= this.SESSION_TIMEOUT) {
        this.sessions.delete(userId);
        cleanedCount++;
        this.logger.debug(`Cleaned up expired session for user ${userId}`);
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }
} 