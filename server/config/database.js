const { Pool } = require('pg');

// Determine if SSL is needed (use SSL for remote databases like Supabase)
const isRemoteDB = process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes('supabase') ||
   process.env.DATABASE_URL.includes('pooler') ||
   process.env.NODE_ENV === 'production' ||
   process.env.VERCEL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemoteDB ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, transaction };