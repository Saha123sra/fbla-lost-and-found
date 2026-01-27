# Lost Dane Found - Requirements Document

**Version:** 2.0
**Date:** January 2026
**Status:** Active Development

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Functional Requirements](#2-functional-requirements)
3. [Page Requirements](#3-page-requirements)
4. [AI & Chatbot Requirements](#4-ai--chatbot-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Requirements](#6-data-requirements)
7. [API Specifications](#7-api-specifications)
8. [Security Requirements](#8-security-requirements)
9. [Email Requirements](#9-email-requirements)
10. [Integration Requirements](#10-integration-requirements)
11. [Testing Requirements](#11-testing-requirements)
12. [Deployment Requirements](#12-deployment-requirements)
13. [Related Documentation](#13-related-documentation)

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the Lost Dane Found application, a web-based lost and found management system for Denmark High School with AI-powered features.

### 1.2 Scope
The requirements cover the complete system including:
- React frontend client application
- Node.js/Express backend API server
- PostgreSQL database
- Authentication and authorization (student, admin, site owner)
- AI chatbot and object detection model
- Email notification system
- Admin approval workflows

### 1.3 Definitions

| Term | Definition |
|------|------------|
| Item | A physical object that has been found and reported in the system |
| Request | A pre-registration of a lost item (for AI matching before item is found) |
| Claim | A request from a user asserting ownership of a found item |
| Student | A registered user with standard permissions |
| Admin | A registered user with administrative permissions (requires approval) |
| Site Owner | Super admin with ability to approve admin accounts |
| Available | Item status indicating it can be claimed |
| Pending | Claim/Item status indicating review in progress |
| Claimed | Final status when item has been returned to owner |
| Priority | Urgency level (High/Low) for requests and claims |

---

## 2. Functional Requirements

### 2.1 Authentication System

#### FR-AUTH-001: Student Registration
| ID | FR-AUTH-001 |
|-----|-------------|
| Description | System shall allow students to register accounts |
| Priority | P0 (Critical) |
| Inputs | First Name, Last Name, Grade Level, Student ID, School Email, Password, Confirm Password |
| Validation | School email must match approved domain (@student.forsyth.k12.ga.us) |
| Processing | Validate inputs, verify email domain, hash password, create user record |
| Outputs | User account created, JWT token returned |

#### FR-AUTH-002: Admin Registration
| ID | FR-AUTH-002 |
|-----|-------------|
| Description | System shall allow admin registration with approval workflow |
| Priority | P0 (Critical) |
| Inputs | First Name, Last Name, Admin ID, Admin Email, Password, Confirm Password |
| Processing | Create pending admin record, notify site owner |
| Outputs | "Pending Approval" message displayed |
| Post-Approval | Site owner approves → System generates 6-digit code → Email sent to admin |

#### FR-AUTH-003: Site Owner Admin Approval
| ID | FR-AUTH-003 |
|-----|-------------|
| Description | Site owner shall approve/deny admin registration requests |
| Priority | P0 (Critical) |
| Inputs | Admin request ID, Approval decision, Optional note |
| Processing | Update admin status, generate 6-digit code if approved, send email |
| Outputs | Admin account activated (if approved) with 6-digit code |

#### FR-AUTH-004: Student Login
| ID | FR-AUTH-004 |
|-----|-------------|
| Description | System shall authenticate registered students |
| Priority | P0 (Critical) |
| Inputs | School Email, Password |
| Processing | Verify credentials, generate JWT token |
| Outputs | JWT authentication token with user data |

#### FR-AUTH-005: Admin Login
| ID | FR-AUTH-005 |
|-----|-------------|
| Description | System shall authenticate approved admins with 6-digit code |
| Priority | P0 (Critical) |
| Inputs | Admin Email, Password, 6-Digit Code (periodic) |
| Processing | Verify credentials, validate code if required |
| Outputs | JWT authentication token with admin privileges |
| Note | 6-digit code required periodically (every few months) |

#### FR-AUTH-006: Site Owner Login
| ID | FR-AUTH-006 |
|-----|-------------|
| Description | System shall authenticate site owner (demo credentials) |
| Priority | P0 (Critical) |
| Inputs | Preset email and password (for demo) |
| Outputs | JWT token with site owner privileges |

#### FR-AUTH-007: Role-Based Access Control
| ID | FR-AUTH-007 |
|-----|-------------|
| Description | System shall enforce permissions based on user role |
| Priority | P0 (Critical) |
| Roles | Student, Admin, Site Owner |
| Access Levels | See Access Control Matrix below |

**Access Control Matrix:**

| Feature | Public | Student | Admin | Site Owner |
|---------|--------|---------|-------|------------|
| Browse Items | Yes | Yes | Yes | Yes |
| View FAQ | Yes | Yes | Yes | Yes |
| View Testimonials | Yes | Yes | Yes | Yes |
| Report Item | No | Yes | Yes | Yes |
| Request Lost Item | No | Yes | Yes | Yes |
| Claim Item | No | Yes | Yes | Yes |
| AI Picture Match | No | Yes | Yes | Yes |
| View Own Claims | No | Yes | Yes | Yes |
| Admin Dashboard | No | No | Yes | Yes |
| Approve Claims | No | No | Yes | Yes |
| View Student Directory | No | No | Yes | Yes |
| Approve Admins | No | No | No | Yes |

---

### 2.2 Item Management

#### FR-ITEM-001: Report Found Item
| ID | FR-ITEM-001 |
|-----|-------------|
| Description | Authenticated users shall report found items |
| Priority | P0 (Critical) |
| Required Fields | Name, Grade Level, Date Found, Where Found, Dropped Off (Yes/No), Picture |
| Optional Fields | Description |
| Processing | Validate inputs, upload image, create item record, run AI matching |
| Post-Processing | Check against existing Requests, notify matches |
| Outputs | Item created with unique ID, confirmation message |

**Report Form Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | 2-100 characters |
| Grade Level | Dropdown | Yes | 9, 10, 11, 12 |
| Date Found | Date Picker | Yes | Cannot be future date |
| Where Found | Text/Dropdown | Yes | Classroom #, gym, cafe, media center, hallway # |
| Dropped off at L&F | Radio | Yes | Yes or No |
| Picture | File Upload | Yes | Image file, max 10MB, jpg/png/webp |
| Description | Textarea | No | Max 1000 characters |

#### FR-ITEM-002: Browse All Items
| ID | FR-ITEM-002 |
|-----|-------------|
| Description | System shall display all items (public access) |
| Priority | P0 (Critical) |
| Filters | Search, Type, Duration, Priority, Availability |
| Processing | Query items with filters, paginate results |
| Outputs | List of items with pagination metadata |

**Browse Filters:**

| Filter | Options |
|--------|---------|
| Search Bar | Free text search (title, description) |
| Type of Product | Accessories, Clothing, Electronics, School Supplies, Key/ID, Other |
| Duration | 1 week, 2 weeks, 1 month, >1 month |
| Priority | High, Low, All |
| Availability | Available, Pending Claim, Claimed, All Items |

#### FR-ITEM-003: View Item Details
| ID | FR-ITEM-003 |
|-----|-------------|
| Description | Users shall view detailed information about a single item |
| Priority | P0 (Critical) |
| Inputs | Item ID |
| Outputs | Complete item details including photo, category, location, date, status |

#### FR-ITEM-004: Update Item
| ID | FR-ITEM-004 |
|-----|-------------|
| Description | Item reporter or admin can update item details |
| Priority | P1 (High) |
| Inputs | Item ID, Updated fields |
| Outputs | Updated item |

#### FR-ITEM-005: Delete Item
| ID | FR-ITEM-005 |
|-----|-------------|
| Description | Admin can delete items |
| Priority | P1 (High) |
| Inputs | Item ID |
| Outputs | Item removed, audit log entry created |

#### FR-ITEM-006: Automatic Cleanup
| ID | FR-ITEM-006 |
|-----|-------------|
| Description | Claimed items deleted after set number of months |
| Priority | P2 (Medium) |
| Processing | Scheduled job removes old claimed items |

---

### 2.3 Request Management (Pre-Registration)

#### FR-REQ-001: Create Lost Item Request
| ID | FR-REQ-001 |
|-----|-------------|
| Description | Students can pre-register lost items for AI matching |
| Priority | P0 (Critical) |
| Required Fields | Name, Grade Level, Date Lost, Description, Priority |
| Optional Fields | Where Lost, Reference Photo |
| Processing | Create request record, enable AI matching |
| Outputs | Request created, monitoring active |

**Request Form Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | 2-100 characters |
| Grade Level | Dropdown | Yes | 9, 10, 11, 12 |
| Date Lost | Date Picker | Yes | Cannot be future date |
| Where Lost | Text/Dropdown | No | Classroom #, gym, cafe, media center, hallway # |
| Description | Textarea | Yes | Color, size, material, object type (min 20 chars) |
| Priority | Radio | Yes | High, Low |
| Reference Photo | File Upload | No | Image file for AI matching |

#### FR-REQ-002: AI Match Notification
| ID | FR-REQ-002 |
|-----|-------------|
| Description | System notifies requester when matching item is found |
| Priority | P0 (Critical) |
| Trigger | New item reported matches existing request |
| Processing | AI compares photo/description, if match > threshold → notify |
| Outputs | Email to requester with match details |
| Privacy | Only requester is notified (prevents theft) |

#### FR-REQ-003: View My Requests
| ID | FR-REQ-003 |
|-----|-------------|
| Description | Students can view their active requests |
| Priority | P1 (High) |
| Outputs | List of requests with match status |

#### FR-REQ-004: Cancel Request
| ID | FR-REQ-004 |
|-----|-------------|
| Description | Students can cancel their requests |
| Priority | P1 (High) |
| Processing | Mark request as cancelled |

---

### 2.4 Claim Management

#### FR-CLAIM-001: Submit Claim
| ID | FR-CLAIM-001 |
|-----|-------------|
| Description | Authenticated users shall submit ownership claims |
| Priority | P0 (Critical) |
| Inputs | Item ID, Proof Description, Contact Email, Contact Phone (optional) |
| Processing | Create claim record, update item status to 'pending' |
| UI After Submit | Form disappears, shows "Pending Approval" + "You'll get an email if approved" + "Submit New Form" button |

#### FR-CLAIM-002: View My Claims
| ID | FR-CLAIM-002 |
|-----|-------------|
| Description | Users shall view their submitted claims |
| Priority | P0 (Critical) |
| Outputs | List of claims with status (Pending, Approved, Denied) |
| Details | Pickup info shown for approved claims |

#### FR-CLAIM-003: Cancel Claim
| ID | FR-CLAIM-003 |
|-----|-------------|
| Description | Users shall cancel their pending claims |
| Priority | P1 (High) |
| Processing | Mark claim cancelled, item back to 'available' |

#### FR-CLAIM-004: Admin Claim Queue
| ID | FR-CLAIM-004 |
|-----|-------------|
| Description | Admins shall see priority-sorted claim queue |
| Priority | P0 (Critical) |
| Sorting | High priority claims appear at top |
| Display | Claim details, proof, item info, requester info |

#### FR-CLAIM-005: Approve Claim
| ID | FR-CLAIM-005 |
|-----|-------------|
| Description | Admins shall approve valid ownership claims |
| Priority | P0 (Critical) |
| Inputs | Claim ID, Pickup Location, Pickup Time/Instructions |
| Processing | Update status, send email with pickup details |
| Outputs | Approved claim, email sent to student |

#### FR-CLAIM-006: Deny Claim
| ID | FR-CLAIM-006 |
|-----|-------------|
| Description | Admins shall deny invalid claims |
| Priority | P0 (Critical) |
| Inputs | Claim ID, Denial Reason |
| Processing | Update status, item back to 'available' |
| Outputs | Denied claim, email sent to student with reason |

#### FR-CLAIM-007: Mark as Picked Up
| ID | FR-CLAIM-007 |
|-----|-------------|
| Description | Admins shall confirm item handover |
| Priority | P1 (High) |
| Processing | Update final status, record pickup time, audit log |

---

### 2.5 Admin Dashboard

#### FR-ADMIN-001: View Statistics
| ID | FR-ADMIN-001 |
|-----|-------------|
| Description | Admins shall view real-time system statistics |
| Priority | P0 (Critical) |
| Statistics | Total Claims, Available Items, Pending Claims, Success Rate (%), Items This Week, Claims This Week |

#### FR-ADMIN-002: View All Items
| ID | FR-ADMIN-002 |
|-----|-------------|
| Description | Admins shall view and filter all items |
| Priority | P0 (Critical) |
| Filters | Status, Category, Date Range, Location |

#### FR-ADMIN-003: View All Claims
| ID | FR-ADMIN-003 |
|-----|-------------|
| Description | Admins shall view and filter all claims |
| Priority | P0 (Critical) |
| Filters | Status, Priority, Date Range |

#### FR-ADMIN-004: Activity Tracker (Audit Log)
| ID | FR-ADMIN-004 |
|-----|-------------|
| Description | Admins shall view backend activity log |
| Priority | P0 (Critical) |
| Tracked Actions | Item uploaded, Item claimed, Item picked up, Request created, Request matched, Claim approved/denied |
| Display | Chronological list with filters |

#### FR-ADMIN-005: Student Directory
| ID | FR-ADMIN-005 |
|-----|-------------|
| Description | Admins shall access student email and grade info |
| Priority | P0 (Critical) |
| Data | Name, Email, Grade Level, Student ID |
| Purpose | Contact students if needed |
| Privacy | Admin-only access, audit logged |

#### FR-ADMIN-006: Request Match Review
| ID | FR-ADMIN-006 |
|-----|-------------|
| Description | Admins can view AI-suggested matches |
| Priority | P1 (High) |
| Display | Side-by-side comparison of request and item |

---

### 2.6 Site Owner Features

#### FR-OWNER-001: Admin Approval Dashboard
| ID | FR-OWNER-001 |
|-----|-------------|
| Description | Site owner manages admin registration requests |
| Priority | P0 (Critical) |
| Actions | Approve, Deny, View pending requests |
| On Approve | Generate 6-digit code, send email with approval note |

#### FR-OWNER-002: View All Admins
| ID | FR-OWNER-002 |
|-----|-------------|
| Description | Site owner can view all admin accounts |
| Priority | P1 (High) |
| Actions | View, Deactivate, Regenerate codes |

---

## 3. Page Requirements

### 3.1 Home Page
| Requirement | Description |
|-------------|-------------|
| Hero Section | Search bar, call-to-action buttons |
| Features | Highlight AI matching, easy reporting, fast claims |
| Testimonials | Real user quotes and optional videos |
| Statistics | Items returned, success rate counters |
| Quick Links | Browse, Report, Request buttons |
| Chatbot | Floating AI chatbot button |

### 3.2 Browse Page (Public)
| Requirement | Description |
|-------------|-------------|
| Search Bar | Free text search |
| Filter: Type | Accessories, Clothing, Electronics, School Supplies, Key/ID, Other |
| Filter: Duration | 1 week, 2 weeks, 1 month, >1 month |
| Filter: Priority | High, Low |
| Filter: Availability | Available, Pending Claim, Claimed, All Items |
| Display | Grid of item cards with photo, category, date, location |
| Pagination | Load more or page numbers |
| Login Prompt | "Log in to claim" message for non-authenticated users |

### 3.3 Report Page (Login Required)
| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Grade Level | Dropdown (9-12) | Yes |
| Date Found | Date Picker | Yes |
| Where Found | Dropdown/Text (classroom #, gym, cafe, media center, hallway #) | Yes |
| Dropped off at L&F | Radio (Yes/No) | Yes |
| Picture Upload | File | Yes |
| Description | Textarea | No |

### 3.4 Request Page (Login Required)
| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Grade Level | Dropdown (9-12) | Yes |
| Date Lost | Date Picker | Yes |
| Where Lost | Dropdown/Text | No |
| Description | Textarea (color, size, material, object) | Yes |
| Priority | Radio (High/Low) | Yes |
| Reference Photo | File | No |

### 3.5 Claim Page (Login Required)
| Field | Type | Required |
|-------|------|----------|
| Proof of Ownership | Textarea | Yes |
| Contact Email | Email | Yes |
| Contact Phone | Phone | No |

**After Submission UI:**
- Form hidden
- "Pending Approval" header
- "You'll get an email if the request is approved" description
- "Submit New Form" button

### 3.6 My Claims Page (Login Required)
| Element | Description |
|---------|-------------|
| Claims List | All submitted claims |
| Status Badge | Pending (yellow), Approved (green), Denied (red) |
| Pickup Details | Shown for approved claims |
| Cancel Button | For pending claims only |

### 3.7 FAQ Page (Public)
| Element | Description |
|---------|-------------|
| Categories | General, Reporting, Claiming, Account |
| Format | Accordion Q&A |
| Search | Search within FAQ |
| Contact | Link to contact admin |

### 3.8 Testimonials Section
| Element | Description |
|---------|-------------|
| Student Photos | With permission or avatars |
| Quotes | Text testimonials |
| Videos | Optional embedded videos |
| Ratings | Star ratings |
| Submit Link | "Share Your Experience" |

### 3.9 Student Sign Up Page
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | Text | Yes | 2-50 chars |
| Last Name | Text | Yes | 2-50 chars |
| Grade Level | Dropdown | Yes | 9, 10, 11, 12 |
| Student ID | Text | Yes | Valid format |
| School Email | Email | Yes | @student.forsyth.k12.ga.us |
| Password | Password | Yes | Min 8 chars, 1 uppercase, 1 number |
| Confirm Password | Password | Yes | Must match |

### 3.10 Admin Sign Up Page
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | Text | Yes | 2-50 chars |
| Last Name | Text | Yes | 2-50 chars |
| Admin ID | Text | Yes | Valid format |
| Admin Email | Email | Yes | Valid email |
| Password | Password | Yes | Min 8 chars, 1 uppercase, 1 number |
| Confirm Password | Password | Yes | Must match |

**After Submit:** "Pending Approval" message explaining site owner will review and send 6-digit code.

### 3.11 Admin Dashboard
| Section | Content |
|---------|---------|
| Stats Cards | Total Claims, Available Items, Pending Claims, Success Rate %, Items This Week, Claims This Week |
| Approval Queue | Priority-sorted pending claims |
| All Items | Filterable item table |
| All Claims | Filterable claims table |
| Activity Log | Backend tracker |
| Student Directory | Email/grade lookup |
| Request Matches | AI-suggested matches |

### 3.12 Site Owner Portal
| Section | Content |
|---------|---------|
| Pending Admins | List of admin registration requests |
| Approve/Deny | Buttons for each request |
| Send Code | Generate and email 6-digit code |
| Active Admins | List of approved admins |
| Configuration | System settings |

---

## 4. AI & Chatbot Requirements

### 4.1 AI Chatbot

#### FR-CHAT-001: Chatbot Availability
| ID | FR-CHAT-001 |
|-----|-------------|
| Description | Chatbot available on all pages |
| Display | Floating button (bottom-right) |
| Availability | 24/7 |

#### FR-CHAT-002: Chatbot Capabilities
| Capability | Description |
|------------|-------------|
| FAQ Answers | Answer common questions |
| Navigation Help | Guide to correct pages |
| Reporting Guide | Walk through report process |
| Claiming Guide | Walk through claim process |
| Search Help | Help find items |
| Escalation | Option to contact admin |

### 4.2 Object Detection Model

#### FR-AI-001: Image Analysis
| ID | FR-AI-001 |
|-----|-------------|
| Description | Analyze uploaded item photos |
| Features Extracted | Color, shape, category, brand logos, text |
| Output | Searchable tags, feature vectors |

#### FR-AI-002: Item Matching
| ID | FR-AI-002 |
|-----|-------------|
| Description | Compare items against requests |
| Inputs | New item photo, existing request descriptions/photos |
| Processing | Calculate similarity scores |
| Threshold | Configurable confidence threshold (e.g., 70%) |
| Output | Ranked list of potential matches |

#### FR-AI-003: Privacy-Protected Matching
| ID | FR-AI-003 |
|-----|-------------|
| Description | Only notify legitimate owner |
| Behavior | When match found, only the original requester is notified |
| Purpose | Prevent theft, protect privacy |

#### FR-AI-004: Student Picture Match
| ID | FR-AI-004 |
|-----|-------------|
| Description | Students can upload photo to find matches |
| Inputs | Photo of lost item |
| Processing | Compare against all found items |
| Output | Ranked list of potential matches |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-001 | Page load time | < 3 seconds |
| NFR-PERF-002 | API response time | < 500ms (95th percentile) |
| NFR-PERF-003 | AI matching time | < 5 seconds |
| NFR-PERF-004 | Concurrent users | 200+ |
| NFR-PERF-005 | Database query time | < 100ms |
| NFR-PERF-006 | Image upload time | < 10 seconds |

### 5.2 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SCALE-001 | Items capacity | 10,000+ items |
| NFR-SCALE-002 | User capacity | 3,000+ users |
| NFR-SCALE-003 | Requests capacity | 5,000+ requests |
| NFR-SCALE-004 | Image storage | Scalable cloud storage |

### 5.3 Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-AVAIL-001 | System uptime | 99% |
| NFR-AVAIL-002 | Maintenance window | Off-hours only |
| NFR-AVAIL-003 | Recovery time | < 4 hours |

### 5.4 Usability

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-USE-001 | Mobile responsive | Works on all device sizes |
| NFR-USE-002 | Accessibility | WCAG 2.1 AA compliance |
| NFR-USE-003 | Browser support | Chrome, Firefox, Safari, Edge |
| NFR-USE-004 | Navigation | < 3 clicks to any feature |
| NFR-USE-005 | Error messages | Clear, actionable messages |

### 5.5 Maintainability

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-MAINT-001 | Code modularity | Separation of concerns |
| NFR-MAINT-002 | Documentation | Inline comments, API docs |
| NFR-MAINT-003 | Version control | Git-based workflow |
| NFR-MAINT-004 | Logging | Comprehensive application logs |

---

## 6. Data Requirements

### 6.1 Data Model

#### Users Table
```sql
users (
  id              SERIAL PRIMARY KEY,
  first_name      VARCHAR(50) NOT NULL,
  last_name       VARCHAR(50) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20) DEFAULT 'student',  -- student, admin, owner
  grade_level     INTEGER,                        -- 9, 10, 11, 12 (for students)
  student_id      VARCHAR(50),
  admin_id        VARCHAR(50),
  status          VARCHAR(20) DEFAULT 'active',   -- active, pending, deactivated
  security_code   VARCHAR(10),                    -- 6-digit code for admins
  code_expires_at TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

#### Items Table
```sql
items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  category_id     INTEGER REFERENCES categories(id),
  location_id     INTEGER REFERENCES locations(id),
  image_url       TEXT NOT NULL,
  status          VARCHAR(20) DEFAULT 'available',  -- available, pending, claimed
  priority        VARCHAR(10) DEFAULT 'low',        -- high, low
  reported_by     INTEGER REFERENCES users(id),
  reporter_name   VARCHAR(100),
  reporter_grade  INTEGER,
  date_found      DATE NOT NULL,
  dropped_off     BOOLEAN DEFAULT false,
  ai_tags         JSONB,                            -- AI-extracted features
  expires_at      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

#### Requests Table (Lost Item Pre-Registration)
```sql
requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER REFERENCES users(id),
  description     TEXT NOT NULL,
  category_id     INTEGER REFERENCES categories(id),
  location_id     INTEGER REFERENCES locations(id),
  reference_image TEXT,
  priority        VARCHAR(10) DEFAULT 'low',        -- high, low
  date_lost       DATE NOT NULL,
  status          VARCHAR(20) DEFAULT 'active',     -- active, matched, cancelled
  ai_features     JSONB,                            -- AI-extracted features for matching
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

#### Claims Table
```sql
claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id         UUID REFERENCES items(id),
  claimant_id     INTEGER REFERENCES users(id),
  proof           TEXT NOT NULL,
  contact_email   VARCHAR(255) NOT NULL,
  contact_phone   VARCHAR(20),
  priority        VARCHAR(10) DEFAULT 'low',
  status          VARCHAR(20) DEFAULT 'pending',    -- pending, approved, denied, cancelled
  admin_notes     TEXT,
  denial_reason   TEXT,
  pickup_location VARCHAR(200),
  pickup_time     VARCHAR(200),
  reviewed_by     INTEGER REFERENCES users(id),
  reviewed_at     TIMESTAMP,
  picked_up_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

#### Categories Table
```sql
categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,  -- Accessories, Clothing, Electronics, School Supplies, Key/ID, Other
  icon  VARCHAR(50)
)
```

#### Locations Table
```sql
locations (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50),  -- classroom, gym, cafeteria, media_center, hallway, other
  building    VARCHAR(100),
  description TEXT
)
```

#### AI Matches Table
```sql
ai_matches (
  id              SERIAL PRIMARY KEY,
  request_id      UUID REFERENCES requests(id),
  item_id         UUID REFERENCES items(id),
  confidence      DECIMAL(5,2),                     -- 0.00 to 100.00
  notified        BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

#### Audit Log Table
```sql
audit_log (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  action      VARCHAR(50) NOT NULL,   -- item_created, item_claimed, claim_approved, etc.
  entity_type VARCHAR(50),
  entity_id   VARCHAR(100),
  details     JSONB,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP DEFAULT NOW()
)
```

#### Testimonials Table
```sql
testimonials (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  content     TEXT NOT NULL,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_url   TEXT,
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
)
```

#### FAQ Table
```sql
faqs (
  id          SERIAL PRIMARY KEY,
  category    VARCHAR(50) NOT NULL,   -- general, reporting, claiming, account
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
)
```

### 6.2 Data Validation Rules

| Field | Validation |
|-------|------------|
| Email (Student) | Must match school domain |
| Password | Min 8 chars, 1 uppercase, 1 number |
| Grade Level | 9, 10, 11, or 12 |
| Student ID | Valid format per school rules |
| Item Photo | Required, max 10MB, jpg/png/webp |
| Description | Min 10 characters for claims |
| Phone | Valid US phone format |
| 6-Digit Code | Exactly 6 numeric digits |

### 6.3 Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Active Items | Until claimed or 6 months |
| Claimed Items | 3 months after pickup, then deleted |
| User Accounts | Until deletion requested |
| Requests | 3 months if unmatched |
| Audit Logs | 2 years |
| AI Match Data | 6 months |

---

## 7. API Specifications

### 7.1 Base URL
```
/api
```

### 7.2 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Student registration | No |
| POST | `/auth/register/admin` | Admin registration (pending) | No |
| POST | `/auth/login` | Student/Admin login | No |
| POST | `/auth/login/owner` | Site owner login | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/verify-code` | Verify admin 6-digit code | Yes (Admin) |

### 7.3 Items Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/items` | List items with filters | No |
| GET | `/items/:id` | Get single item | No |
| POST | `/items` | Report found item | Yes |
| PATCH | `/items/:id` | Update item | Yes (Owner/Admin) |
| DELETE | `/items/:id` | Delete item | Yes (Admin) |
| GET | `/items/meta/categories` | Get categories | No |
| GET | `/items/meta/locations` | Get locations | No |

### 7.4 Requests Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/requests` | List user's requests | Yes |
| POST | `/requests` | Create lost item request | Yes |
| GET | `/requests/:id` | Get single request | Yes |
| DELETE | `/requests/:id` | Cancel request | Yes (Owner) |
| POST | `/requests/match` | AI photo match | Yes |

### 7.5 Claims Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/claims` | List user's claims | Yes |
| GET | `/claims/:id` | Get single claim | Yes |
| POST | `/claims` | Submit new claim | Yes |
| PATCH | `/claims/:id` | Update claim (admin) | Yes (Admin) |
| POST | `/claims/:id/cancel` | Cancel pending claim | Yes (Owner) |
| POST | `/claims/:id/pickup` | Mark as picked up | Yes (Admin) |

### 7.6 Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/stats` | Dashboard statistics | Yes (Admin) |
| GET | `/admin/items` | All items | Yes (Admin) |
| GET | `/admin/claims` | All claims (priority sorted) | Yes (Admin) |
| GET | `/admin/requests` | All requests | Yes (Admin) |
| GET | `/admin/students` | Student directory | Yes (Admin) |
| GET | `/admin/audit-log` | Activity log | Yes (Admin) |
| GET | `/admin/matches` | AI match suggestions | Yes (Admin) |

### 7.7 Site Owner Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/owner/pending-admins` | Pending admin requests | Yes (Owner) |
| POST | `/owner/approve-admin/:id` | Approve admin | Yes (Owner) |
| POST | `/owner/deny-admin/:id` | Deny admin | Yes (Owner) |
| GET | `/owner/admins` | All admins | Yes (Owner) |
| POST | `/owner/regenerate-code/:id` | Regenerate admin code | Yes (Owner) |

### 7.8 FAQ & Testimonials

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/faq` | Get all FAQs | No |
| GET | `/testimonials` | Get approved testimonials | No |
| POST | `/testimonials` | Submit testimonial | Yes |

### 7.9 Chatbot Endpoint

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/chatbot/message` | Send message to chatbot | No |

---

## 8. Security Requirements

### 8.1 Authentication Security

| ID | Requirement |
|----|-------------|
| SEC-AUTH-001 | Passwords hashed with bcrypt (12+ salt rounds) |
| SEC-AUTH-002 | JWT tokens with 24-hour expiration |
| SEC-AUTH-003 | Admin 6-digit codes expire after 3 months |
| SEC-AUTH-004 | Password: min 8 chars, 1 uppercase, 1 number |
| SEC-AUTH-005 | School email domain validation |
| SEC-AUTH-006 | Rate limiting on login attempts (5 per minute) |

### 8.2 Authorization Security

| ID | Requirement |
|----|-------------|
| SEC-AUTHZ-001 | Role-based access control on all endpoints |
| SEC-AUTHZ-002 | Resource ownership validation |
| SEC-AUTHZ-003 | Admin endpoints require admin role |
| SEC-AUTHZ-004 | Site owner endpoints require owner role |
| SEC-AUTHZ-005 | Student directory access logged |

### 8.3 Data Security

| ID | Requirement |
|----|-------------|
| SEC-DATA-001 | HTTPS enforced |
| SEC-DATA-002 | SQL injection prevention |
| SEC-DATA-003 | XSS prevention |
| SEC-DATA-004 | CORS restricted |
| SEC-DATA-005 | File upload validation |
| SEC-DATA-006 | Student data encrypted at rest |

### 8.4 API Security

| ID | Requirement |
|----|-------------|
| SEC-API-001 | Rate limiting (100 requests/15 minutes) |
| SEC-API-002 | Security headers (Helmet.js) |
| SEC-API-003 | Request size limits (10MB for images) |
| SEC-API-004 | Input validation on all endpoints |

---

## 9. Email Requirements

### 9.1 Email Types

| Email | Trigger | Recipient |
|-------|---------|-----------|
| Item Report Confirmation | Item reported | Reporter |
| Request Confirmation | Request created | Requester |
| AI Match Notification | Match found | Requester |
| Claim Submitted | Claim created | Claimant |
| Claim Approved | Admin approves | Claimant |
| Claim Denied | Admin denies | Claimant |
| Pickup Reminder | 24h before pickup | Claimant |
| Admin Approval | Site owner approves | New admin |
| Admin 6-Digit Code | Periodic | Admin |

### 9.2 Email Content

#### Claim Approved Email
```
Subject: Your Claim Has Been Approved - Lost Dane Found

Hi [Name],

Good news! Your claim for [Item Name] has been approved.

PICKUP DETAILS:
Location: [Pickup Location]
Time: [Pickup Time]

Please bring your student ID for verification.

Thank you for using Lost Dane Found!
```

---

## 10. Integration Requirements

### 10.1 AI/ML Service

| ID | Requirement |
|----|-------------|
| INT-AI-001 | Object detection API for image analysis |
| INT-AI-002 | Feature extraction for matching |
| INT-AI-003 | Confidence score calculation |
| INT-AI-004 | Chatbot NLP processing |

### 10.2 Email Service

| ID | Requirement |
|----|-------------|
| INT-EMAIL-001 | Resend or SendGrid integration |
| INT-EMAIL-002 | Template-based emails |
| INT-EMAIL-003 | Async sending (non-blocking) |

### 10.3 File Storage

| ID | Requirement |
|----|-------------|
| INT-STOR-001 | Cloud storage (Supabase Storage or S3) |
| INT-STOR-002 | Image optimization on upload |
| INT-STOR-003 | CDN delivery |

### 10.4 School Website Integration

| ID | Requirement |
|----|-------------|
| INT-SCHOOL-001 | Link from school website |
| INT-SCHOOL-002 | Embeddable widget (future) |

---

## 11. Testing Requirements

### 11.1 Test Coverage Goals

| Type | Target |
|------|--------|
| Unit Tests | 70% |
| Integration Tests | Critical paths |
| E2E Tests | Main workflows |
| AI Model Tests | Accuracy benchmarks |

### 11.2 Key Test Scenarios

**Authentication:**
- Student registration with valid school email
- Admin registration → pending → approval flow
- Site owner admin approval with code generation
- Invalid login attempts

**Items:**
- Report item with all fields
- Browse with filters
- AI tag generation on upload

**Requests:**
- Create request
- AI matching trigger on new item
- Notification delivery

**Claims:**
- Submit claim
- Priority queue ordering
- Approval with pickup details
- Denial with reason

**AI:**
- Image feature extraction
- Match confidence calculation
- False positive rate

---

## 12. Deployment Requirements

### 12.1 Environments

| Environment | Purpose |
|-------------|---------|
| Development | Local development |
| Staging | Pre-production testing |
| Production | Live system |

### 12.2 Infrastructure

| Component | Requirement |
|-----------|-------------|
| Backend | Node.js hosting (Railway, Render, Heroku) |
| Frontend | Static hosting (Vercel, Netlify) |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage or AWS S3 |
| AI | External API or hosted model |
| Email | Resend or SendGrid |
| Domain | Custom domain with SSL |

### 12.3 Environment Variables

```env
# Backend
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=<secret>
JWT_EXPIRES_IN=24h

# Site Owner Credentials (Demo)
OWNER_EMAIL=owner@lostdanefound.com
OWNER_PASSWORD=<secure_password>

# Email
RESEND_API_KEY=<key>
FROM_EMAIL=noreply@lostdanefound.com

# AI Service
AI_API_URL=https://...
AI_API_KEY=<key>

# Storage
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_KEY=<key>

# Frontend
VITE_API_URL=https://api.lostdanefound.com
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=<key>
```

---

## 13. Related Documentation

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | Project overview and setup instructions |
| [BUSINESS_SPECIFICATION.md](./BUSINESS_SPECIFICATION.md) | Business context and objectives |
| [CLAUDE.md](../CLAUDE.md) | Development guidelines for AI-assisted coding |

---

*This document is maintained as part of the Lost Dane Found project. For questions or updates, contact the Denmark High School IT department.*
