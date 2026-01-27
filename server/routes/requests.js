const express = require('express');
const multer = require('multer');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { uploadImage } = require('../services/storageService');
const { analyzeImage, analyzeDescription } = require('../services/aiService');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all requests for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, c.name as category_name, c.icon as category_icon,
              l.name as location_name, l.building as location_building
       FROM requests r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN locations l ON r.location_id = l.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get single request
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, c.name as category_name, c.icon as category_icon,
              l.name as location_name, l.building as location_building,
              i.name as matched_item_name, i.image_url as matched_item_image
       FROM requests r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN locations l ON r.location_id = l.id
       LEFT JOIN items i ON r.matched_item_id = i.id
       WHERE r.id = $1 AND r.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Check for similar existing items before creating request
router.post('/check-matches', authenticate, async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Extract keywords from name and description
    const searchText = `${name} ${description || ''}`.toLowerCase();
    const words = searchText.split(/\s+/).filter(w => w.length > 2);

    // Build search conditions
    let searchConditions = [];
    let params = ['available']; // Only search available items
    let paramIndex = 2;

    // Add keyword search conditions
    if (words.length > 0) {
      const keywordConditions = words.map(word => {
        params.push(`%${word}%`);
        return `(LOWER(i.name) LIKE $${paramIndex++} OR LOWER(i.description) LIKE $${paramIndex - 1})`;
      });
      searchConditions.push(`(${keywordConditions.join(' OR ')})`);
    }

    // Add category match if provided
    if (categoryId) {
      params.push(categoryId);
      searchConditions.push(`i.category_id = $${paramIndex++}`);
    }

    // If no search conditions, return empty
    if (searchConditions.length === 0) {
      return res.json({ success: true, matches: [], hasMatches: false });
    }

    const result = await query(
      `SELECT i.id, i.name, i.description, i.image_url, i.found_date, i.status,
              c.name as category_name, l.name as location_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN locations l ON i.location_id = l.id
       WHERE i.status = $1 AND (${searchConditions.join(' OR ')})
       ORDER BY i.found_date DESC
       LIMIT 5`,
      params
    );

    res.json({
      success: true,
      matches: result.rows,
      hasMatches: result.rows.length > 0
    });
  } catch (error) {
    console.error('Check matches error:', error);
    res.status(500).json({ error: 'Failed to check for matches' });
  }
});

// Create new request (pre-register lost item)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { name, description, categoryId, locationId, lostDate } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Handle image upload to Supabase
    let imageUrl = null;
    let aiTags = null;

    if (req.file) {
      try {
        // Upload to Supabase Storage
        const uploadResult = await uploadImage(req.file.buffer, req.file.originalname, 'requests');
        imageUrl = uploadResult.url;
        console.log('Request image uploaded to Supabase:', imageUrl);

        // Analyze image with AI
        try {
          aiTags = await analyzeImage(imageUrl);
          if (aiTags) {
            console.log('Request AI analysis complete:', aiTags);
          }
        } catch (aiError) {
          console.error('AI analysis failed (continuing without tags):', aiError.message);
        }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    } else {
      // No image - analyze the text description instead
      try {
        aiTags = await analyzeDescription(name, description);
        if (aiTags) {
          console.log('Description AI analysis complete:', aiTags);
        }
      } catch (aiError) {
        console.error('Description analysis failed:', aiError.message);
      }
    }

    const result = await query(
      `INSERT INTO requests (user_id, name, description, category_id, location_id, lost_date, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        name,
        description,
        categoryId || null,
        locationId || null,
        lostDate || new Date(),
        imageUrl
      ]
    );

    // Send confirmation email
    try {
      await sendEmail(req.user.email, 'requestCreated', [req.user.first_name, name]);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Lost item request created',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create request error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create request: ' + error.message });
  }
});

// Cancel request
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `UPDATE requests SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status = 'active'
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already cancelled' });
    }

    res.json({
      success: true,
      message: 'Request cancelled',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Check for matching items (manual trigger)
router.post('/match/:id', authenticate, async (req, res) => {
  try {
    // Get the request
    const requestResult = await query(
      'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = requestResult.rows[0];

    // Find potential matches based on category and keywords
    let matchQuery = `
      SELECT i.*, c.name as category_name, l.name as location_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE i.status = 'available'
    `;
    const params = [];
    let paramIndex = 1;

    // Match by category if specified
    if (request.category_id) {
      matchQuery += ` AND i.category_id = $${paramIndex}`;
      params.push(request.category_id);
      paramIndex++;
    }

    // Search by name/description similarity
    matchQuery += ` AND (
      i.name ILIKE $${paramIndex} OR
      i.description ILIKE $${paramIndex}
    )`;
    params.push(`%${request.name.split(' ')[0]}%`);

    matchQuery += ' ORDER BY i.found_date DESC LIMIT 10';

    const matchResult = await query(matchQuery, params);

    res.json({
      success: true,
      matches: matchResult.rows,
      count: matchResult.rows.length
    });
  } catch (error) {
    console.error('Match request error:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

module.exports = router;
