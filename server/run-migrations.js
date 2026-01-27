require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrations = `
-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS code_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_id VARCHAR(50);

-- Add check constraint for status (ignore if exists)
DO $$ BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
  ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'pending', 'deactivated'));
EXCEPTION WHEN others THEN NULL;
END $$;

-- Update role check to include owner
DO $$ BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'admin', 'staff', 'owner'));
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add new columns to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'low';
ALTER TABLE items ADD COLUMN IF NOT EXISTS dropped_off BOOLEAN DEFAULT FALSE;
ALTER TABLE items ADD COLUMN IF NOT EXISTS reporter_name VARCHAR(100);
ALTER TABLE items ADD COLUMN IF NOT EXISTS reporter_grade INTEGER;
ALTER TABLE items ADD COLUMN IF NOT EXISTS ai_tags JSONB;

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    lost_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    matched_item_id UUID REFERENCES items(id),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20),
    text TEXT NOT NULL,
    avatar VARCHAR(10) DEFAULT '👤',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed FAQ data
INSERT INTO faqs (question, answer, category, sort_order) VALUES
    ('How do I report a found item?', 'Click the "Report Found" button in the navigation bar. Fill out the form with a description, category, and location where you found the item. Upload a photo if possible - this helps owners identify their belongings.', 'Reporting', 1),
    ('How do I search for my lost item?', 'Use the "Browse Items" page to search through all found items. You can filter by category, date range, and location. If you find your item, click "Claim" and provide proof of ownership.', 'Searching', 2),
    ('What counts as proof of ownership?', 'Describe unique features only the owner would know: specific scratches, stickers, contents of a bag/wallet, passwords/lock codes, purchase receipts, or engravings. The more specific, the better!', 'Claims', 3),
    ('How long are items kept before donation?', 'Items are kept for 30 days. After that, unclaimed items may be donated to local charities. We will send email reminders before items expire.', 'Policies', 4),
    ('Where do I pick up my item?', 'After your claim is approved, you will receive an email with pickup details. Items are typically available at the Main Office during school hours.', 'Pickup', 5),
    ('What if someone falsely claims my item?', 'All claims require proof of ownership and are reviewed by staff. False claims result in account suspension. If you believe your item was wrongly given away, contact the school administration.', 'Security', 6),
    ('Can I pre-register a lost item?', 'Yes! Use the "Request" feature to describe an item you have lost. If a matching item is found later, you will be notified automatically.', 'Features', 7),
    ('How do I contact support?', 'For technical issues, email lostdanefound@forsythk12.org. For urgent matters, visit the Main Office during school hours.', 'Support', 8)
ON CONFLICT DO NOTHING;

-- Seed testimonials
INSERT INTO testimonials (name, grade, text, avatar, status) VALUES
    ('Sarah M.', 'Junior', 'Found my AirPods within 2 hours of losing them! The system made it so easy.', '👩‍🎓', 'approved'),
    ('Marcus T.', 'Senior', 'I have returned 5 items through this site. It feels good to help fellow Danes!', '👨‍🎓', 'approved'),
    ('Emily R.', 'Sophomore', 'Way better than the old lost and found box. Got my calculator back before my test!', '👩‍💻', 'approved')
ON CONFLICT DO NOTHING;

-- Create site owner account (password: admin123)
INSERT INTO users (student_id, email, password_hash, first_name, last_name, role, status)
VALUES (
    'owner',
    'owner@lostdanefound.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2lRAqLqCBZKFi',
    'Site',
    'Owner',
    'owner',
    'active'
) ON CONFLICT (student_id) DO NOTHING;
`;

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    await client.query(migrations);
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
