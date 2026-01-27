const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// Get all active FAQs
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let queryStr = `
      SELECT id, question, answer, category
      FROM faqs
      WHERE is_active = true
    `;
    const params = [];

    if (category) {
      queryStr += ' AND category = $1';
      params.push(category);
    }

    queryStr += ' ORDER BY sort_order ASC, id ASC';

    const result = await query(queryStr, params);

    // Group by category
    const grouped = result.rows.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    res.json({
      success: true,
      data: result.rows,
      grouped,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get FAQ categories
router.get('/categories', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT category FROM faqs WHERE is_active = true ORDER BY category
    `);

    res.json({
      success: true,
      data: result.rows.map(r => r.category)
    });
  } catch (error) {
    console.error('Get FAQ categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
