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
      const emailResult = await sendEmail(user.email, 'loginOTP', [user.first_name, otp]);

      // Build response
      const response = {
        message: 'OTP sent to your email',
        requiresOTP: true,
        userId: user.id,
        email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
      };

      // If in dev mode (no Resend API key), include OTP in response for testing
      if (emailResult.dev) {
        response.devMode = true;
        response.devOTP = otp;
        response.devMessage = 'Email service not configured. Use the code shown below to login.';
      }

      return res.json(response);
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
    const emailResult = await sendEmail(user.email, 'loginOTP', [user.first_name, otp]);

    const response = { message: 'New verification code sent to your email' };

    // If in dev mode, include OTP in response for testing
    if (emailResult.dev) {
      response.devMode = true;
      response.devOTP = otp;
      response.devMessage = 'Email service not configured. Use the code shown below.';
    }

    res.json(response);
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

// Generate secure reset token
const generateResetToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

// Request Password Reset (Forgot Password)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const result = await query(
      'SELECT id, email, first_name, role, status FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const user = result.rows[0];

    // Don't allow reset for deactivated accounts
    if (user.status === 'deactivated') {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token and expiry (1 hour from now)
    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetToken, resetExpiry, user.id]
    );

    // Send password reset email
    const emailResult = await sendEmail(user.email, 'passwordReset', [user.first_name, resetToken]);
    console.log(`Password reset requested for: ${user.email}`);

    // In dev mode (when emails aren't sent), include the reset link in response for testing
    const response = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };

    // If in dev mode, provide the reset link directly
    if (emailResult.dev) {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      console.log(`[DEV] Reset link: ${resetLink}`);
      response.devResetLink = resetLink;
    }

    res.json(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Verify Reset Token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const result = await query(
      `SELECT id, email, first_name FROM users
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid or expired reset token'
      });
    }

    res.json({
      valid: true,
      email: result.rows[0].email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Failed to verify reset token' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Find user with valid token
    const result = await query(
      `SELECT id, email, first_name FROM users
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = result.rows[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await query(
      `UPDATE users
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    // Log the password reset
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id)
       VALUES ($1, 'password_reset', 'user', $1)`,
      [user.id]
    );

    // Send confirmation email
    await sendEmail(user.email, 'passwordResetSuccess', [user.first_name]);
    console.log(`Password reset completed for: ${user.email}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
