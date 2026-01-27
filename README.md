# Lost Dane Found

A web-based lost and found management system for Denmark High School, Forsyth County, Georgia.

---

## Overview

Lost Dane Found digitizes the traditional lost and found process, enabling students to:
- **Report found items** with photos and descriptions
- **Search for lost belongings** with filters and search
- **Submit ownership claims** with proof of ownership
- **Track claim status** through to pickup

Administrators can manage items, review claims, and access analytics through a comprehensive dashboard.

---

## Features

### For Students
- Account registration and secure login
- Report found items with image upload
- Browse and search available items
- Filter by category, location, and date
- Submit ownership claims with proof
- Track claim status
- Cancel pending claims

### For Administrators
- Dashboard with real-time statistics
- Manage all items and claims
- Approve or deny claims with notes
- Mark items as picked up
- View audit logs
- Monitor student activity

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | JWT (JSON Web Tokens) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## Project Structure

```
Lost Dane Found/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   └── services/       # API client
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   ├── services/          # Email service
│   └── package.json
├── database/              # SQL schema
│   └── schema.sql
├── docs/                  # Documentation
│   ├── BUSINESS_SPECIFICATION.md
│   └── REQUIREMENTS.md
├── CLAUDE.md
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Lost Dane Found"
   ```

2. **Set up the database**
   ```bash
   # Create database and run schema
   psql -d your_database -f database/schema.sql
   ```

3. **Configure environment variables**

   **Server (.env):**
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=your-secret-key
   RESEND_API_KEY=your-resend-key
   FRONTEND_URL=http://localhost:5173
   ```

   **Client (.env):**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   ```

4. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List items |
| GET | `/api/items/:id` | Get item details |
| POST | `/api/items` | Report found item |
| PATCH | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | List claims |
| POST | `/api/claims` | Submit claim |
| PATCH | `/api/claims/:id` | Update claim |
| POST | `/api/claims/:id/cancel` | Cancel claim |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/items` | All items |
| GET | `/api/admin/claims` | All claims |
| GET | `/api/admin/students` | All students |

---

## Database Schema

### Core Tables
- **users** - Student and admin accounts
- **items** - Lost and found items
- **claims** - Ownership claims
- **categories** - Item categories
- **locations** - School locations
- **audit_log** - System audit trail

### Seeded Data

**Categories:**
- Electronics
- Clothing
- Books
- Accessories
- Sports Equipment
- School Supplies
- Bags/Backpacks
- Keys
- ID Cards
- Other

**Locations:**
- Main Gym
- Auxiliary Gym
- Cafeteria
- Media Center/Library
- Main Office
- A Building Hallway
- B Building Hallway
- C Building Hallway
- Performing Arts Center
- Stadium
- Tennis Courts
- Baseball Field
- Softball Field
- Soccer Field
- Track Area
- Parking Lot
- Bus Loop
- Courtyard
- Weight Room
- Athletic Training Room

---

## Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Tailwind CSS for styling conventions

### Database Migrations
Add new migrations to `database/` directory and run them in order.

---

## Deployment

### Production Build

```bash
# Build frontend
cd client
npm run build

# The build output is in client/dist/
```

### Environment Setup
- Set `NODE_ENV=production`
- Use secure JWT secret
- Configure production database URL
- Set up HTTPS

---

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview (this file) |
| [BUSINESS_SPECIFICATION.md](./docs/BUSINESS_SPECIFICATION.md) | Business context, objectives, workflows |
| [REQUIREMENTS.md](./docs/REQUIREMENTS.md) | Functional and technical requirements |
| [CLAUDE.md](./CLAUDE.md) | AI development guidelines |

---

## Current Limitations

1. **Email notifications** - Service configured but not sending real emails
2. **Image upload** - Using placeholder URLs instead of actual storage
3. **AI matching** - Marketed feature not yet implemented
4. **Mobile app** - Web-only, no native mobile apps

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

---

## License

This project is developed for Denmark High School, Forsyth County, Georgia.

---

## Support

For issues or questions, contact the Denmark High School IT department.
