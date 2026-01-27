const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      'SELECT id, student_id, email, role, status, first_name, last_name, grade_level FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check user status
    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    if (user.status === 'pending' && user.role === 'admin') {
      return res.status(403).json({ error: 'Admin account pending approval', status: 'pending' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'owner')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query(
        'SELECT id, student_id, email, role, status, first_name, last_name FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (result.rows.length > 0 && result.rows[0].status === 'active') {
        req.user = result.rows[0];
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, requireAdmin, requireOwner, optionalAuth };
