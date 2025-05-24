import { pool } from '../db';

export const courseAccessService = {
  async fetchCourseAccess(userId: string): Promise<{ hasAccess: boolean; error?: string }> {
    try {
      const result = await pool.query(
        'SELECT has_access FROM course_access WHERE user_id = $1',
        [userId]
      );

      return {
        hasAccess: result.rows[0]?.has_access || false
      };
    } catch (error) {
      return {
        hasAccess: false,
        error: 'Failed to fetch course access'
      };
    }
  },

  async updateCourseAccess(userId: string, hasAccess: boolean): Promise<{ error?: string }> {
    try {
      await pool.query(
        `INSERT INTO course_access (user_id, has_access)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET has_access = $2`,
        [userId, hasAccess]
      );

      return {};
    } catch (error) {
      return {
        error: 'Failed to update course access'
      };
    }
  }
}; 