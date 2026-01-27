-- =============================================
-- LOST DANE FOUND - DATABASE SCHEMA
-- Denmark High School Lost & Found System
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'staff', 'owner')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'deactivated')),
    admin_id VARCHAR(50),
    security_code VARCHAR(10),
    code_expires_at TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed categories
INSERT INTO categories (name, description, icon) VALUES
    ('Electronics', 'Phones, calculators, headphones, chargers', '📱'),
    ('Clothing', 'Jackets, hoodies, shirts, hats', '🧥'),
    ('Shoes', 'Sneakers, boots, sandals, cleats', '👟'),
    ('Accessories', 'Watches, jewelry, bags, wallets', '👜'),
    ('Books', 'Textbooks, notebooks, novels', '📚'),
    ('Keys', 'Car keys, house keys, keychains', '🔑'),
    ('ID/Cards', 'Student IDs, credit cards, gift cards', '💳'),
    ('Sports Equipment', 'Balls, gear, uniforms', '⚽'),
    ('School Supplies', 'Pencils, calculators, binders', '✏️'),
    ('Other', 'Miscellaneous items', '📦')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- LOCATIONS TABLE (Denmark High specific)
-- =============================================
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(20),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Seed Denmark HS locations
INSERT INTO locations (name, building, floor) VALUES
    ('Main Gym', 'Athletics', '1'),
    ('Auxiliary Gym', 'Athletics', '1'),
    ('Library/Media Center', 'Main Building', '2'),
    ('Cafeteria', 'Main Building', '1'),
    ('Main Office', 'Main Building', '1'),
    ('Hallway 100s', 'Main Building', '1'),
    ('Hallway 200s', 'Main Building', '2'),
    ('Hallway 300s', 'Main Building', '3'),
    ('Science Wing', 'Main Building', '2'),
    ('Fine Arts Wing', 'Fine Arts', '1'),
    ('Band Room', 'Fine Arts', '1'),
    ('Theater/Auditorium', 'Fine Arts', '1'),
    ('Football Stadium', 'Outdoor', 'N/A'),
    ('Baseball/Softball Fields', 'Outdoor', 'N/A'),
    ('Tennis Courts', 'Outdoor', 'N/A'),
    ('Parking Lot', 'Outdoor', 'N/A'),
    ('Bus Loop', 'Outdoor', 'N/A'),
    ('Locker Room', 'Athletics', '1'),
    ('Weight Room', 'Athletics', '1'),
    ('Other', 'Various', 'N/A')
ON CONFLICT DO NOTHING;

-- =============================================
-- ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    location_detail VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available'
        CHECK (status IN ('available', 'pending', 'claimed', 'expired', 'donated')),
    priority VARCHAR(10) DEFAULT 'low' CHECK (priority IN ('low', 'high')),
    dropped_off BOOLEAN DEFAULT FALSE,
    reporter_name VARCHAR(100),
    reporter_grade INTEGER,
    ai_tags JSONB,
    image_url TEXT,
    found_by UUID REFERENCES users(id),
    found_date DATE NOT NULL DEFAULT CURRENT_DATE,
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    claimed_by UUID REFERENCES users(id),
    claimed_date TIMESTAMP WITH TIME ZONE,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_date ON items(date_reported DESC);

-- =============================================
-- CLAIMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    proof_description TEXT NOT NULL,
    proof_image_url TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'denied', 'cancelled', 'picked_up')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    denial_reason TEXT,
    pickup_date DATE,
    pickup_time TIME,
    pickup_location VARCHAR(255),
    pickup_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- =============================================
-- AUDIT LOG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_items_timestamp ON items;
CREATE TRIGGER update_items_timestamp
    BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_users_timestamp ON users;
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_claims_timestamp ON claims;
CREATE TRIGGER update_claims_timestamp
    BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-set expiration date (30 days)
CREATE OR REPLACE FUNCTION set_expiration_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expiration_date = NEW.found_date + INTERVAL '30 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_item_expiration ON items;
CREATE TRIGGER set_item_expiration
    BEFORE INSERT ON items
    FOR EACH ROW EXECUTE FUNCTION set_expiration_date();

-- =============================================
-- NOTE: No seeded admin - admins register with real emails
-- and get approved by the site owner
-- =============================================

-- =============================================
-- SEED SAMPLE DATA (Optional - for testing)
-- =============================================
INSERT INTO users (student_id, email, password_hash, first_name, last_name, grade_level, role)
VALUES (
    'student1',
    'student@forsyth.k12.ga.us',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2lRAqLqCBZKFi',
    'Test',
    'Student',
    'Junior',
    'student'
) ON CONFLICT (student_id) DO NOTHING;

-- Sample items
INSERT INTO items (name, description, category_id, location_id, status, found_date, found_by)
SELECT 
    'Blue North Face Jacket',
    'Size Medium, navy blue with gray lining. Found near the gym entrance.',
    (SELECT id FROM categories WHERE name = 'Clothing'),
    (SELECT id FROM locations WHERE name = 'Main Gym'),
    'available',
    CURRENT_DATE - INTERVAL '2 days',
    (SELECT id FROM users WHERE student_id = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Blue North Face Jacket');

INSERT INTO items (name, description, category_id, location_id, status, found_date, found_by)
SELECT 
    'TI-84 Plus Calculator',
    'Graphing calculator, has some scratches on the back. Name label partially removed.',
    (SELECT id FROM categories WHERE name = 'Electronics'),
    (SELECT id FROM locations WHERE name = 'Hallway 200s'),
    'available',
    CURRENT_DATE - INTERVAL '1 day',
    (SELECT id FROM users WHERE student_id = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'TI-84 Plus Calculator');

INSERT INTO items (name, description, category_id, location_id, status, found_date, found_by)
SELECT 
    'AirPods Pro Case (White)',
    'White AirPods Pro charging case, no name on it. Found on cafeteria table.',
    (SELECT id FROM categories WHERE name = 'Electronics'),
    (SELECT id FROM locations WHERE name = 'Cafeteria'),
    'available',
    CURRENT_DATE,
    (SELECT id FROM users WHERE student_id = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'AirPods Pro Case (White)');

-- =============================================
-- REQUESTS TABLE (Lost Item Pre-Registration)
-- =============================================
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    lost_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'matched', 'cancelled', 'expired')),
    matched_item_id UUID REFERENCES items(id),
    image_url TEXT,
    ai_tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- =============================================
-- FAQS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed FAQ data
INSERT INTO faqs (question, answer, category, sort_order) VALUES
    ('How do I report a found item?', 'Click the "Report Found" button in the navigation bar. Fill out the form with a description, category, and location where you found the item. Upload a photo if possible - this helps owners identify their belongings.', 'Reporting', 1),
    ('How do I search for my lost item?', 'Use the "Browse Items" page to search through all found items. You can filter by category, date range, and location. If you find your item, click "Claim" and provide proof of ownership.', 'Searching', 2),
    ('What counts as proof of ownership?', 'Describe unique features only the owner would know: specific scratches, stickers, contents of a bag/wallet, passwords/lock codes, purchase receipts, or engravings. The more specific, the better!', 'Claims', 3),
    ('How long are items kept before donation?', 'Items are kept for 30 days. After that, unclaimed items may be donated to local charities. We''ll send email reminders before items expire.', 'Policies', 4),
    ('Where do I pick up my item?', 'After your claim is approved, you''ll receive an email with pickup details. Items are typically available at the Main Office during school hours.', 'Pickup', 5),
    ('What if someone falsely claims my item?', 'All claims require proof of ownership and are reviewed by staff. False claims result in account suspension. If you believe your item was wrongly given away, contact the school administration.', 'Security', 6),
    ('Can I pre-register a lost item?', 'Yes! Use the "Request" feature to describe an item you''ve lost. If a matching item is found later, you''ll be notified automatically.', 'Features', 7),
    ('How do I contact support?', 'For technical issues, email lostdanefound@forsyth.k12.ga.us. For urgent matters, visit the Main Office during school hours.', 'Support', 8)
ON CONFLICT DO NOTHING;

-- =============================================
-- TESTIMONIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20),
    text TEXT NOT NULL,
    avatar VARCHAR(10) DEFAULT '👤',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed testimonials
INSERT INTO testimonials (name, grade, text, avatar, status) VALUES
    ('Sarah M.', 'Junior', 'Found my AirPods within 2 hours of losing them! The system made it so easy.', '👩‍🎓', 'approved'),
    ('Marcus T.', 'Senior', 'I''ve returned 5 items through this site. It feels good to help fellow Danes!', '👨‍🎓', 'approved'),
    ('Emily R.', 'Sophomore', 'Way better than the old lost and found box. Got my calculator back before my test!', '👩‍💻', 'approved')
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED SITE OWNER (Fixed Demo Account)
-- Email: demo@lostdanefound.com
-- Password: DemoOwner2024!
-- =============================================
INSERT INTO users (student_id, email, password_hash, first_name, last_name, role, status)
VALUES (
    'owner',
    'demo@lostdanefound.com',
    '$2a$12$5HdBMQQPdpQ.Q8.Q/QBK4ODNWA4JO67JZ8EI0.pw6bYrPg11TqflW',
    'Demo',
    'Owner',
    'owner',
    'active'
) ON CONFLICT (student_id) DO NOTHING;

-- =============================================
-- DONE! Your database is ready.
-- =============================================
SELECT 'Database setup complete! 🎉' AS message;