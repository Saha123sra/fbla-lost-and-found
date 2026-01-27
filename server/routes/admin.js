const express = require('express');
const { query } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, requireAdmin);

// ===================
// GET DASHBOARD STATS
// ===================
router.get('/stats', async (req, res) => {
  try {
    // Get various statistics
    const stats = await query(`
      SELECT
        (SELECT COUNT(*) FROM items WHERE status = 'available') as active_items,
        (SELECT COUNT(*) FROM items WHERE status = 'claimed') as claimed_items,
        (SELECT COUNT(*) FROM items WHERE status = 'pending') as pending_items,
        (SELECT COUNT(*) FROM claims WHERE status = 'pending') as pending_claims,
        (SELECT COUNT(*) FROM items) as total_items,
        (SELECT COUNT(*) FROM claims) as total_claims,
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM items WHERE date_reported >= CURRENT_DATE - INTERVAL '7 days') as items_this_week,
        (SELECT COUNT(*) FROM claims WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as claims_this_week
    `);
    
    // Calculate success rate
    const successRateResult = await query(`
      SELECT 
        ROUND(
          COUNT(*) FILTER (WHERE status = 'claimed')::DECIMAL / 
          NULLIF(COUNT(*), 0) * 100, 
          1
        ) as success_rate
      FROM items
    `);
    
    // Get items by category
    const categoryStats = await query(`
      SELECT c.name, COUNT(i.id) as count
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id
      GROUP BY c.name
      ORDER BY count DESC
    `);
    
    // Get recent activity
    const recentActivity = await query(`
      SELECT 
        'item' as type,
        i.name as title,
        i.date_reported as timestamp,
        'New item reported' as action
      FROM items i
      ORDER BY i.date_reported DESC
      LIMIT 5
      
      UNION ALL
      
      SELECT 
        'claim' as type,
        it.name as title,
        c.created_at as timestamp,
        'Claim submitted' as action
      FROM claims c
      JOIN items it ON c.item_id = it.id
      ORDER BY timestamp DESC
      LIMIT 10
    `);
    
    res.json({
      ...stats.rows[0],
      success_rate: successRateResult.rows[0]?.success_rate || 0,
      category_breakdown: categoryStats.rows,
      recent_activity: recentActivity.rows
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ===================
// GET ALL ITEMS (Admin view with more details)
// ===================
router.get('/items', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        i.*,
        c.name as category_name,
        l.name as location_name,
        u.first_name || ' ' || u.last_name as found_by_name,
        u.email as found_by_email,
        (SELECT COUNT(*) FROM claims WHERE item_id = i.id AND status = 'pending') as pending_claims_count
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      LEFT JOIN users u ON i.found_by = u.id
    `;
    
    const params = [];
    if (status) {
      params.push(status);
      queryText += ` WHERE i.status = $1`;
    }
    
    queryText += ` ORDER BY i.date_reported DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM items';
    if (status) {
      countQuery += ' WHERE status = $1';
    }
    const countResult = await query(countQuery, status ? [status] : []);
    
    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
    
  } catch (error) {
    console.error('Get admin items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ===================
// GET ALL CLAIMS (Admin view)
// ===================
router.get('/claims', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        c.*,
        i.name as item_name, i.image_url,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email, u.student_id,
        r.first_name || ' ' || r.last_name as reviewed_by_name
      FROM claims c
      JOIN items i ON c.item_id = i.id
      JOIN users u ON c.user_id = u.id
      LEFT JOIN users r ON c.reviewed_by = r.id
    `;
    
    const params = [];
    if (status) {
      params.push(status);
      queryText += ` WHERE c.status = $1`;
    }
    
    queryText += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get admin claims error:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// ===================
// GET ALL STUDENTS
// ===================
router.get('/students', async (req, res) => {
  try {
    const { search, gradeLevel, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        id, student_id, email, first_name, last_name, grade_level,
        created_at, last_login,
        (SELECT COUNT(*) FROM claims WHERE user_id = users.id) as total_claims,
        (SELECT COUNT(*) FROM items WHERE found_by = users.id) as items_reported
      FROM users
      WHERE role = 'student'
    `;
    
    const params = [];
    
    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length} OR student_id ILIKE $${params.length})`;
    }
    
    if (gradeLevel) {
      params.push(gradeLevel);
      queryText += ` AND grade_level = $${params.length}`;
    }
    
    queryText += ` ORDER BY last_name, first_name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ===================
// GET AUDIT LOG
// ===================
router.get('/audit-log', async (req, res) => {
  try {
    const { action, userId, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        a.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email
      FROM audit_log a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (action) {
      params.push(action);
      queryText += ` AND a.action = $${params.length}`;
    }
    
    if (userId) {
      params.push(userId);
      queryText += ` AND a.user_id = $${params.length}`;
    }
    
    queryText += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// ===================
// BULK UPDATE ITEMS (Mark as expired/donated)
// ===================
router.post('/items/bulk-update', async (req, res) => {
  try {
    const { itemIds, status } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ error: 'Item IDs are required' });
    }
    
    const validStatuses = ['expired', 'donated', 'available'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await query(
      'UPDATE items SET status = $1, updated_at = NOW() WHERE id = ANY($2) RETURNING id',
      [status, itemIds]
    );
    
    // Log the action
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, new_values)
       VALUES ($1, 'BULK_UPDATE_ITEMS', 'item', $2)`,
      [req.user.id, JSON.stringify({ itemIds, status })]
    );
    
    res.json({
      message: `${result.rowCount} items updated to ${status}`,
      updatedCount: result.rowCount
    });
    
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to update items' });
  }
});

// ===================
// GET NOTIFICATIONS
// ===================
router.get('/notifications', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ===================
// MARK NOTIFICATION AS READ
// ===================
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    res.json({ message: 'Notification marked as read' });
    
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;