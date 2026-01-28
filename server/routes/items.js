const express = require('express');
const multer = require('multer');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { sendEmail, sendMatchNotifications } = require('../services/emailService');
const { uploadImage } = require('../services/storageService');
const { findMatchingRequests } = require('../services/aiService');

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

// ===================
// GET ALL ITEMS (with filters)
// ===================
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status = 'available',
      search,
      location,
      priority,
      foundAfter,
      foundBefore,
      sortBy = 'date_reported',
      sortOrder = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    const params = [];
    let paramCount = 0;

    // Build base query
    let queryText = `
      SELECT
        i.id, i.name, i.description, i.status, i.image_url, i.priority,
        i.found_date, i.date_reported, i.location_detail, i.ai_tags,
        c.name as category_name, c.icon as category_icon,
        l.name as location_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE 1=1
    `;

    // Add filters
    if (status && status !== 'all') {
      params.push(status);
      queryText += ` AND i.status = $${++paramCount}`;
    }

    if (category && category !== 'All' && category !== '') {
      params.push(category);
      queryText += ` AND i.category_id = $${++paramCount}`;
    }

    if (location) {
      params.push(location);
      queryText += ` AND l.name = $${++paramCount}`;
    }

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (i.name ILIKE $${++paramCount} OR i.description ILIKE $${paramCount})`;
    }

    if (priority) {
      params.push(priority);
      queryText += ` AND i.priority = $${++paramCount}`;
    }

    if (foundAfter) {
      params.push(foundAfter);
      queryText += ` AND i.found_date >= $${++paramCount}`;
    }

    if (foundBefore) {
      params.push(foundBefore);
      queryText += ` AND i.found_date <= $${++paramCount}`;
    }

    // Add sorting
    const validSortFields = ['date_reported', 'found_date', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date_reported';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryText += ` ORDER BY i.${sortField} ${order}`;

    // Add pagination
    params.push(limit, offset);
    queryText += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;

    // Execute query
    const result = await query(queryText, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE 1=1
    `;
    const countParams = [];
    let countParamNum = 0;

    if (status && status !== 'all') {
      countParams.push(status);
      countQuery += ` AND i.status = $${++countParamNum}`;
    }
    if (category && category !== 'All' && category !== '') {
      countParams.push(category);
      countQuery += ` AND i.category_id = $${++countParamNum}`;
    }
    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (i.name ILIKE $${++countParamNum} OR i.description ILIKE $${countParamNum})`;
    }
    if (priority) {
      countParams.push(priority);
      countQuery += ` AND i.priority = $${++countParamNum}`;
    }
    if (foundAfter) {
      countParams.push(foundAfter);
      countQuery += ` AND i.found_date >= $${++countParamNum}`;
    }
    if (foundBefore) {
      countParams.push(foundBefore);
      countQuery += ` AND i.found_date <= $${++countParamNum}`;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ===================
// GET SINGLE ITEM
// ===================
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT
        i.*,
        c.name as category_name, c.icon as category_icon,
        l.name as location_name, l.building as location_building,
        u.first_name || ' ' || LEFT(u.last_name, 1) || '.' as found_by_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      LEFT JOIN users u ON i.found_by = u.id
      WHERE i.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// ===================
// CREATE ITEM (Report Found Item)
// ===================
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { name, description, categoryId, locationId, locationDetail, foundDate } = req.body;

    // Validation
    if (!name || !description || !categoryId || !locationId) {
      return res.status(400).json({ error: 'Name, description, category, and location are required' });
    }

    // Handle image upload to Supabase (optional)
    let imageUrl = null;
    let aiTags = null;

    if (req.file) {
      try {
        // Upload to Supabase Storage
        const uploadResult = await uploadImage(req.file.buffer, req.file.originalname, 'items');
        imageUrl = uploadResult.url;
        console.log('Image uploaded to Supabase:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Analyze description for matching (works with or without image)
    try {
      const { analyzeDescription } = require('../services/aiService');
      aiTags = analyzeDescription(name, description);
      if (aiTags) {
        console.log('Description analysis complete:', aiTags);
      }
    } catch (aiError) {
      console.error('Description analysis failed:', aiError.message);
    }

    // Insert item
    const result = await query(
      `INSERT INTO items (name, description, category_id, location_id, location_detail, found_date, found_by, image_url, ai_tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, categoryId, locationId, locationDetail, foundDate || new Date(), req.user.id, imageUrl, aiTags ? JSON.stringify(aiTags) : null]
    );

    const item = result.rows[0];

    // Create audit log entry
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'CREATE_ITEM', 'item', $2, $3)`,
      [req.user.id, item.id, JSON.stringify(item)]
    );

    // Send confirmation email to reporter
    const referenceId = `LF-${item.id.substring(0, 8).toUpperCase()}`;
    await sendEmail(req.user.email, 'itemReported', [req.user.first_name, name, referenceId]);

    // Find matching lost item requests and send notifications
    let matchCount = 0;
    try {
      // Parse ai_tags if it's a string (from DB)
      const itemWithTags = {
        ...item,
        ai_tags: aiTags || (item.ai_tags ? (typeof item.ai_tags === 'string' ? JSON.parse(item.ai_tags) : item.ai_tags) : null)
      };

      const matches = await findMatchingRequests(itemWithTags);
      matchCount = matches.length;

      if (matches.length > 0) {
        console.log(`Found ${matches.length} matching requests for item ${item.id}`);

        // Send notification emails to all matching request owners
        const emailResults = await sendMatchNotifications(item, matches);
        console.log('Match notification results:', emailResults);

        // Create in-app notifications for matches
        for (const match of matches) {
          await query(
            `INSERT INTO notifications (user_id, type, title, message, link)
             VALUES ($1, 'match_found', $2, $3, $4)`,
            [
              match.request.user_id,
              'Potential Match Found!',
              `A ${item.name} was found that matches your lost item request. Match confidence: ${Math.round(match.score)}%`,
              `/item/${item.id}`
            ]
          );
        }
      }
    } catch (matchError) {
      console.error('Error finding matches:', matchError);
      // Don't fail the request if matching fails
    }

    res.status(201).json({
      message: 'Item reported successfully',
      item,
      referenceId,
      matchesFound: matchCount
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to report item' });
  }
});

// ===================
// UPDATE ITEM
// ===================
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, categoryId, locationId, locationDetail, status } = req.body;

    // Check if user owns the item or is admin
    const itemResult = await query('SELECT found_by FROM items WHERE id = $1', [req.params.id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemResult.rows[0].found_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    const result = await query(
      `UPDATE items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category_id = COALESCE($3, category_id),
        location_id = COALESCE($4, location_id),
        location_detail = COALESCE($5, location_detail),
        status = COALESCE($6, status),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, categoryId, locationId, locationDetail, status, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// ===================
// DELETE ITEM
// ===================
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check authorization
    const itemResult = await query('SELECT found_by FROM items WHERE id = $1', [req.params.id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemResult.rows[0].found_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await query('DELETE FROM items WHERE id = $1', [req.params.id]);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ===================
// GET CATEGORIES
// ===================
router.get('/meta/categories', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT ON (name) id, name, icon
      FROM categories
      ORDER BY name, id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ===================
// GET LOCATIONS
// ===================
router.get('/meta/locations', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT ON (name) id, name, building, floor, description, is_active
      FROM locations
      WHERE is_active = true
      ORDER BY name, id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;
