const express = require('express');
const { query } = require('../config/database');
const { authenticate, requireOwner } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Generate 6-digit security code
const generateSecurityCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get all pending admin accounts
router.get('/pending-admins', authenticate, requireOwner, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, admin_id, email, first_name, last_name, created_at
       FROM users
       WHERE role = 'admin' AND status = 'pending'
       ORDER BY created_at ASC`
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get pending admins error:', error);
    res.status(500).json({ error: 'Failed to fetch pending admins' });
  }
});

// Get all admins (active and pending)
router.get('/admins', authenticate, requireOwner, async (req, res) => {
  try {
    const { status } = req.query;

    let queryStr = `
      SELECT id, admin_id, student_id, email, first_name, last_name, status, created_at, last_login
      FROM users
      WHERE role = 'admin'
    `;
    const params = [];

    if (status) {
      queryStr += ' AND status = $1';
      params.push(status);
    }

    queryStr += ' ORDER BY created_at DESC';

    const result = await query(queryStr, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Approve admin account
router.post('/approve-admin/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Generate security code and expiration (90 days from now)
    const securityCode = generateSecurityCode();
    const codeExpiration = new Date();
    codeExpiration.setDate(codeExpiration.getDate() + 90);

    const result = await query(
      `UPDATE users
       SET status = 'active', security_code = $1, code_expires_at = $2
       WHERE id = $3 AND role = 'admin' AND status = 'pending'
       RETURNING id, email, first_name, last_name, security_code`,
      [securityCode, codeExpiration, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending admin not found' });
    }

    const admin = result.rows[0];

    // Log the approval in audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'admin_approved', 'user', $2, $3)`,
      [req.user.id, id, JSON.stringify({ approved_by: req.user.email })]
    );

    // Send email with security code
    await sendEmail(admin.email, 'adminApproved', [admin.first_name, securityCode]);
    console.log(`Admin approved: ${admin.email}, Security Code: ${securityCode}`);

    res.json({
      success: true,
      message: 'Admin account approved',
      data: {
        id: admin.id,
        email: admin.email,
        name: `${admin.first_name} ${admin.last_name}`,
        securityCode: admin.security_code
      }
    });
  } catch (error) {
    console.error('Approve admin error:', error);
    res.status(500).json({ error: 'Failed to approve admin' });
  }
});

// Deny admin account
router.post('/deny-admin/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await query(
      `UPDATE users
       SET status = 'deactivated'
       WHERE id = $1 AND role = 'admin' AND status = 'pending'
       RETURNING id, email, first_name, last_name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending admin not found' });
    }

    // Log the denial in audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'admin_denied', 'user', $2, $3)`,
      [req.user.id, id, JSON.stringify({ denied_by: req.user.email, reason: reason || 'No reason provided' })]
    );

    res.json({
      success: true,
      message: 'Admin account denied',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Deny admin error:', error);
    res.status(500).json({ error: 'Failed to deny admin' });
  }
});

// Deactivate an active admin
router.post('/deactivate-admin/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await query(
      `UPDATE users
       SET status = 'deactivated'
       WHERE id = $1 AND role = 'admin' AND status = 'active'
       RETURNING id, email, first_name, last_name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Active admin not found' });
    }

    // Log the deactivation
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'admin_deactivated', 'user', $2, $3)`,
      [req.user.id, id, JSON.stringify({ deactivated_by: req.user.email, reason: reason || 'No reason provided' })]
    );

    res.json({
      success: true,
      message: 'Admin account deactivated',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Deactivate admin error:', error);
    res.status(500).json({ error: 'Failed to deactivate admin' });
  }
});

// Reactivate a deactivated admin
router.post('/reactivate-admin/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Generate new security code and expiration (90 days from now)
    const securityCode = generateSecurityCode();
    const codeExpiration = new Date();
    codeExpiration.setDate(codeExpiration.getDate() + 90);

    const result = await query(
      `UPDATE users
       SET status = 'active', security_code = $1, code_expires_at = $2
       WHERE id = $3 AND role = 'admin' AND status = 'deactivated'
       RETURNING id, email, first_name, last_name, security_code`,
      [securityCode, codeExpiration, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deactivated admin not found' });
    }

    const admin = result.rows[0];

    // Log the reactivation
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'admin_reactivated', 'user', $2, $3)`,
      [req.user.id, id, JSON.stringify({ reactivated_by: req.user.email })]
    );

    // Send email with new security code
    await sendEmail(admin.email, 'adminReactivated', [admin.first_name, securityCode]);
    console.log(`Admin reactivated: ${admin.email}, New Security Code: ${securityCode}`);

    res.json({
      success: true,
      message: 'Admin account reactivated',
      data: {
        id: admin.id,
        email: admin.email,
        name: `${admin.first_name} ${admin.last_name}`,
        securityCode: admin.security_code
      }
    });
  } catch (error) {
    console.error('Reactivate admin error:', error);
    res.status(500).json({ error: 'Failed to reactivate admin' });
  }
});

// Get owner dashboard stats
router.get('/stats', authenticate, requireOwner, async (req, res) => {
  try {
    const statsResult = await query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'admin' AND status = 'pending') as pending_admins,
        (SELECT COUNT(*) FROM users WHERE role = 'admin' AND status = 'active') as active_admins,
        (SELECT COUNT(*) FROM users WHERE role = 'admin' AND status = 'deactivated') as deactivated_admins,
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM items WHERE status = 'available') as active_items,
        (SELECT COUNT(*) FROM claims WHERE status = 'pending') as pending_claims
    `);

    res.json({
      success: true,
      data: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Get owner stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
