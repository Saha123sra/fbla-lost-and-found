const express = require('express');
const { query } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;

    let queryStr = `
      SELECT id, name, grade, text, avatar, created_at
      FROM testimonials
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `;

    if (limit) {
      queryStr += ` LIMIT ${parseInt(limit)}`;
    }

    const result = await query(queryStr);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Submit a testimonial (authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    const { text, avatar } = req.body;

    if (!text || text.length < 10) {
      return res.status(400).json({ error: 'Testimonial must be at least 10 characters' });
    }

    // Get user info
    const userResult = await query(
      'SELECT first_name, last_name, grade_level FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const displayName = `${user.first_name} ${user.last_name.charAt(0)}.`;

    const result = await query(
      `INSERT INTO testimonials (user_id, name, grade, text, avatar, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id`,
      [req.user.id, displayName, user.grade_level, text, avatar || '👤']
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted for review',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

// Get all testimonials (admin only)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let queryStr = `
      SELECT t.*, u.email as user_email
      FROM testimonials t
      LEFT JOIN users u ON t.user_id = u.id
    `;
    const params = [];

    if (status) {
      queryStr += ' WHERE t.status = $1';
      params.push(status);
    }

    queryStr += ' ORDER BY t.created_at DESC';

    const result = await query(queryStr, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Approve/reject testimonial (admin only)
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await query(
      `UPDATE testimonials SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      message: `Testimonial ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

module.exports = router;
