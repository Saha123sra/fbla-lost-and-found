// Script to reset the demo owner password
// Run with: node scripts/reset-owner-password.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function resetOwnerPassword() {
  try {
    const password = 'DemoOwner2024!';
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('Generated hash:', passwordHash);

    // Update the owner password
    const result = await pool.query(
      `UPDATE users
       SET password_hash = $1
       WHERE email = 'demo@lostdanefound.com' AND role = 'owner'
       RETURNING id, email, first_name, last_name`,
      [passwordHash]
    );

    if (result.rows.length === 0) {
      // Owner doesn't exist, create it
      console.log('Owner not found, creating...');
      await pool.query(
        `INSERT INTO users (student_id, email, password_hash, first_name, last_name, role, status)
         VALUES ('owner', 'demo@lostdanefound.com', $1, 'Demo', 'Owner', 'owner', 'active')
         ON CONFLICT (email) DO UPDATE SET password_hash = $1`,
        [passwordHash]
      );
      console.log('Owner account created/updated!');
    } else {
      console.log('Owner password updated for:', result.rows[0].email);
    }

    console.log('\nYou can now login with:');
    console.log('Email: demo@lostdanefound.com');
    console.log('Password: DemoOwner2024!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

resetOwnerPassword();
