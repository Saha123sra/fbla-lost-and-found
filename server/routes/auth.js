const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Generate 6-digit security code
const generateSecurityCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate 6-digit OTP for MFA
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Student Register
router.post('/register', async (req, res) => {
  try {
    const { studentId, email, password, firstName, lastName, gradeLevel } = req.body;

    if (!studentId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format (school email)
    if (!email.endsWith('@forsythk12.org') && !email.endsWith('@students.forsythk12.org') && !email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Please use your school email address (@forsythk12.org)' });
    }

    const existing = await query(
      'SELECT id FROM users WHERE email = $1 OR student_id = $2',
      [email, studentId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email or Student ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (student_id, email, password_hash, first_name, last_name, grade_level, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'student', 'active')
       RETURNING id, student_id, email, role, status, first_name, last_name`,
      [studentId, email, passwordHash, firstName, lastName, gradeLevel]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin Register (creates pending account)
router.post('/register/admin', async (req, res) => {
  try {
    const { adminId, email, password, firstName, lastName } = req.body;

    if (!adminId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await query(
      'SELECT id FROM users WHERE email = $1 OR student_id = $2 OR admin_id = $2',
      [email, adminId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email or Admin ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await query(
      `INSERT INTO users (student_id, admin_id, email, password_hash, first_name, last_name, role, status)
       VALUES ($1, $1, $2, $3, $4, $5, 'admin', 'pending')`,
      [adminId, email, passwordHash, firstName, lastName]
    );

    res.status(201).json({
      message: 'Admin registration submitted',
      status: 'pending',
      note: 'Your account is pending approval by the site owner. You will receive an email with your access code once approved.'
    });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Student Login - Step 1: Verify credentials and send OTP
router.post('/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ error: 'Student ID and password required' });
    }

    const result = await query('SELECT * FROM users WHERE student_id = $1', [studentId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if account is deactivated
    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    // Check if admin account is pending
    if (user.role === 'admin' && user.status === 'pending') {
      return res.status(403).json({
        error: 'Admin account pending approval',
        status: 'pending'
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // MFA only for admin users
    if (user.role === 'admin') {
      // Generate OTP and save to database
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await query(
        'UPDATE users SET security_code = $1, code_expires_at = $2 WHERE id = $3',
        [otp, otpExpiry, user.id]
      );

      // Send OTP email
      await sendEmail(user.email, 'loginOTP', [user.first_name, otp]);

      // Return pending MFA status (don't send token yet)
      return res.json({
        message: 'OTP sent to your email',
        requiresOTP: true,
        userId: user.id,
        email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
      });
    }

    // Direct login for students (no MFA)
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Login Step 2: Verify OTP and return token
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ error: 'User ID and OTP required' });
    }

    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check OTP
    if (!user.security_code || user.security_code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if OTP is expired
    if (user.code_expires_at && new Date(user.code_expires_at) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired. Please login again.' });
    }

    // Clear OTP after successful verification
    await query(
      'UPDATE users SET security_code = NULL, code_expires_at = NULL, last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      'UPDATE users SET security_code = $1, code_expires_at = $2 WHERE id = $3',
      [otp, otpExpiry, user.id]
    );

    // Send OTP email
    await sendEmail(user.email, 'loginOTP', [user.first_name, otp]);

    res.json({ message: 'New verification code sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend code' });
  }
});

// Owner Login
router.post('/login/owner', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'owner']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Owner login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Owner login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify Admin Security Code
router.post('/verify-code', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const result = await query(
      'SELECT security_code, code_expires_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (!user.security_code) {
      return res.status(400).json({ error: 'No security code set' });
    }

    if (user.code_expires_at && new Date(user.code_expires_at) < new Date()) {
      return res.status(400).json({ error: 'Security code has expired' });
    }

    if (user.security_code !== code) {
      return res.status(400).json({ error: 'Invalid security code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    id: req.user.id,
    studentId: req.user.student_id,
    email: req.user.email,
    role: req.user.role,
    status: req.user.status,
    gradeLevel: req.user.grade_level,
    name: `${req.user.first_name} ${req.user.last_name}`
  });
});

module.exports = router;
