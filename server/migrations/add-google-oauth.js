const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('Running Google OAuth migration...\n');

    // Add google_id column
    console.log('1. Adding google_id column...');
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
    `);
    console.log('   Done.');

    // Add auth_provider column
    console.log('2. Adding auth_provider column...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'auth_provider'
        ) THEN
          ALTER TABLE users ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'local';
          ALTER TABLE users ADD CONSTRAINT auth_provider_check
            CHECK (auth_provider IN ('local', 'google', 'both'));
        END IF;
      END $$;
    `);
    console.log('   Done.');

    // Make password_hash nullable
    console.log('3. Making password_hash nullable...');
    await client.query(`
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL
    `);
    console.log('   Done.');

    // Create index on google_id
    console.log('4. Creating index on google_id...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)
    `);
    console.log('   Done.');

    console.log('\nMigration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
