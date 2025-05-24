import express, { Request, Response } from 'express';
import { pool } from '../db';

const router = express.Router();

// Get all courses with their sections and lessons
router.get('/courses', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all sections with their lessons
    const sectionsResult = await pool.query(
      `SELECT 
        s.id,
        s.title,
        s.description,
        s.order,
        s.created_at,
        s.updated_at,
        json_agg(
          json_build_object(
            'id', l.id,
            'section_id', l.section_id,
            'slug', l.slug,
            'title', l.title,
            'description', l.description,
            'content', l.content,
            'order', l.order,
            'created_at', l.created_at,
            'updated_at', l.updated_at
          ) ORDER BY l.order
        ) as lessons
      FROM sections s
      LEFT JOIN lessons l ON s.id = l.section_id
      GROUP BY s.id
      ORDER BY s.order`
    );

    // Get the "Start Here" lesson
    const startHereResult = await pool.query(
      `SELECT 
        id,
        section_id,
        slug,
        title,
        description,
        content,
        order,
        created_at,
        updated_at
      FROM lessons
      WHERE slug = 'start-here'
      LIMIT 1`
    );

    res.json({
      sections: sectionsResult.rows,
      startHere: startHereResult.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a specific lesson by slug
router.get('/courses/:slug', async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT 
        l.id,
        l.section_id,
        l.slug,
        l.title,
        l.description,
        l.content,
        l.order,
        l.created_at,
        l.updated_at,
        s.title as section_title
      FROM lessons l
      LEFT JOIN sections s ON l.section_id = s.id
      WHERE l.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router; 