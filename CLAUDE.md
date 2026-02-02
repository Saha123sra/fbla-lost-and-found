# CLAUDE.md - AI Development Guidelines

This file provides context and guidelines for AI assistants (like Claude) working on the Lost Dane Found codebase.

---

## Project Overview

**Lost Dane Found** is a web-based lost and found system for Denmark High School. It consists of:
- **Frontend**: React 18 app with Vite and Tailwind CSS
- **Backend**: Node.js/Express.js REST API
- **Database**: PostgreSQL (hosted on Supabase)

---

## Quick Start Commands

```bash
# Start backend development server
cd server && npm run dev

# Start frontend development server
cd client && npm run dev

# Run both in parallel (from root)
cd server && npm run dev & cd ../client && npm run dev
```

---

## Project Structure

```
Lost Dane Found/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ChatBot
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── ItemDetail.jsx
│   │   │   ├── Report.jsx
│   │   │   ├── Claim.jsx
│   │   │   ├── MyClaims.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── StudentRegister.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminRegister.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/           # api.js - Axios client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express backend
│   ├── config/
│   │   └── database.js         # PostgreSQL pool
│   ├── middleware/
│   │   └── auth.js             # JWT auth, role checks
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── items.js            # /api/items/*
│   │   ├── claims.js           # /api/claims/*
│   │   └── admin.js            # /api/admin/*
│   ├── services/
│   │   └── emailService.js     # Email templates (stubbed)
│   ├── index.js                # App entry point
│   └── package.json
├── database/
│   └── schema.sql              # Full database schema
└── [Documentation files]
```

---

## Key Files Reference

### Backend Entry Point
- `server/index.js` - Express app setup, middleware, routes

### API Routes
- `server/routes/auth.js` - Registration, login, user info
- `server/routes/items.js` - CRUD for items, metadata
- `server/routes/claims.js` - Claim submission and management
- `server/routes/admin.js` - Admin dashboard and statistics

### Database
- `server/config/database.js` - PostgreSQL connection pool with transaction support
- `database/schema.sql` - Complete schema with tables, triggers, and seed data

### Frontend Entry
- `client/src/main.jsx` - React app entry
- `client/src/App.jsx` - Router configuration

### State Management
- `client/src/context/AuthContext.jsx` - Global auth state with JWT handling

### API Client
- `client/src/services/api.js` - Axios instance with interceptors

---

## Coding Conventions

### Backend (Node.js/Express)

```javascript
// Route handler pattern
router.get('/endpoint', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Use parameterized queries for SQL
const result = await pool.query(
  'SELECT * FROM items WHERE id = $1',
  [itemId]
);

// Transaction pattern
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // ... queries
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### Frontend (React)

```javascript
// Component pattern
import { useState, useEffect } from 'react';
import api from '../services/api';

const Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.items.getAll();
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
};
```

### Tailwind CSS

```jsx
// Use school colors defined in tailwind.config.js
<div className="bg-navy text-white">  {/* Primary navy */}
<div className="bg-carolina">         {/* Carolina blue accent */}
<button className="bg-navy hover:bg-navy/90">

// Common patterns
<button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition">
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy">
```

---

## Database Schema Summary

### Tables
| Table | Purpose | Primary Key |
|-------|---------|-------------|
| users | User accounts | id (SERIAL) |
| items | Lost/found items | id (UUID) |
| claims | Ownership claims | id (UUID) |
| categories | Item categories | id (SERIAL) |
| locations | School locations | id (SERIAL) |
| notifications | User notifications | id (SERIAL) |
| audit_log | System audit trail | id (SERIAL) |

### Status Values
- **Item status**: `available`, `pending`, `claimed`, `expired`
- **Claim status**: `pending`, `approved`, `denied`, `cancelled`
- **User roles**: `student`, `admin`

---

## API Response Format

```javascript
// Success
{ success: true, data: {...} }

// Success with pagination
{
  success: true,
  data: [...],
  pagination: { total: 100, limit: 20, offset: 0, hasMore: true }
}

// Error
{ success: false, error: "Error message" }
```

---

## Authentication Flow

1. User registers/logs in at `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token
3. Client stores token in localStorage
4. `api.js` interceptor adds token to all requests
5. Protected routes use `auth` middleware to validate token
6. Admin routes use `requireAdmin` middleware for role check

---

## Common Tasks

### Adding a New API Endpoint

1. Add route in appropriate `server/routes/*.js` file
2. Use `auth` middleware if authentication required
3. Use `requireAdmin` if admin-only
4. Return consistent response format

### Adding a New Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add navigation link in `client/src/components/Navbar.jsx` if needed

### Modifying Database Schema

1. Update `database/schema.sql`
2. Run migration on database
3. Update relevant API routes
4. Update TypeScript types if applicable

---

## Known Issues / TODOs

1. **Email Service**: `server/services/emailService.js` uses Gmail/Nodemailer. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env` to enable. Without credentials, emails are logged to console.

2. **Image Upload**: Items use placeholder image URLs. Need to implement actual file upload to cloud storage.

3. **AI Matching**: The marketing mentions "AI-powered" matching, but this feature doesn't exist yet.

4. **Supabase Duplication**: `client/src/pages/Browse.jsx` uses Supabase client directly while the backend uses pg driver. Should consolidate to one approach.

---

## Environment Variables

### Server
```
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=<secret>
JWT_EXPIRES_IN=24h
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
```

### Client
```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=<key>
```

---

## Related Documentation

- [README.md](./README.md) - Project overview and setup
- [BUSINESS_SPECIFICATION.md](./docs/BUSINESS_SPECIFICATION.md) - Business context and objectives
- [REQUIREMENTS.md](./docs/REQUIREMENTS.md) - Functional and technical requirements

---

## Tips for AI Assistants

1. **Read before editing** - Always read a file before making changes
2. **Follow existing patterns** - Match the coding style already in use
3. **Test changes** - Suggest running the app to verify changes work
4. **Keep it simple** - Avoid over-engineering; make minimal necessary changes
5. **Security first** - Use parameterized queries, validate inputs, check auth
6. **Consistent responses** - Use the established API response format
