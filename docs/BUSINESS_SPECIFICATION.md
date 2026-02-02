# Lost Dane Found - Business Specification Document

**Version:** 2.0
**Date:** January 2026
**Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context](#2-business-context)
3. [Problem Statement](#3-problem-statement)
4. [Solution Overview](#4-solution-overview)
5. [Stakeholders](#5-stakeholders)
6. [Business Objectives](#6-business-objectives)
7. [Scope](#7-scope)
8. [Key Features](#8-key-features)
9. [User Workflows](#9-user-workflows)
10. [Page Specifications](#10-page-specifications)
11. [AI & Automation Features](#11-ai--automation-features)
12. [Success Metrics](#12-success-metrics)
13. [Constraints & Assumptions](#13-constraints--assumptions)
14. [Risk Assessment](#14-risk-assessment)
15. [Future Considerations](#15-future-considerations)
16. [Related Documentation](#16-related-documentation)

---

## 1. Executive Summary

**Lost Dane Found** is a web-based lost and found management system specifically designed for Denmark High School in Forsyth County, Georgia. The platform digitizes the traditional lost and found process with AI-powered features including:

- **AI Chatbot** for user assistance and navigation
- **Object Detection Model** for automatic item matching
- **Smart Request System** where students can pre-register lost items and get notified when a matching item is found
- **Comprehensive Admin Dashboard** with real-time analytics and approval workflows
- **Priority-based Claim System** for urgent items

The platform ensures school security by requiring school ID authentication while keeping item browsing publicly accessible.

---

## 2. Business Context

### 2.1 Organization
- **Institution:** Denmark High School
- **Location:** Forsyth County, Georgia
- **Type:** Public High School
- **Website Integration:** Platform linked to official school page

### 2.2 Current State
Traditional lost and found systems in schools face several challenges:
- Physical collection points require manual management
- No centralized searchable database of found items
- Difficult for students to check if their lost items have been found
- Time-consuming claim verification process
- Items often go unclaimed and are eventually discarded
- No proactive notification when lost items are found

### 2.3 Market Need
Schools need modern, digital solutions that:
- Reduce administrative overhead
- Improve item recovery rates
- Provide transparency to students and parents
- Create audit trails for accountability
- Use AI to automatically match lost items with owners
- Prevent theft through verification workflows

---

## 3. Problem Statement

Denmark High School students frequently lose personal belongings throughout the campus. The existing physical lost and found system:

1. **Lacks visibility** - Students don't know what items have been turned in
2. **Is inefficient** - Staff spend excessive time managing physical items
3. **Has low recovery rates** - Items often go unclaimed due to lack of awareness
4. **Lacks accountability** - No tracking of who submitted or claimed items
5. **Creates storage issues** - Accumulated unclaimed items take up space
6. **No proactive matching** - Students must repeatedly check for their items
7. **Security concerns** - No verification that claimant is actual owner

---

## 4. Solution Overview

Lost Dane Found provides a comprehensive digital platform that:

- **Digitizes item reporting** - Found items are photographed and logged with details
- **Enables self-service search** - Students can browse and search for their lost items
- **AI-Powered Matching** - Object detection matches uploaded photos with lost item requests
- **Proactive Notifications** - Students who pre-register lost items get notified when matches are found
- **Streamlines claims** - Digital claim submission with proof of ownership
- **Provides admin tools** - Dashboard for staff to manage items, verify claims, and track metrics
- **Creates accountability** - Full audit trail of all system activities
- **Ensures security** - School ID login requirement prevents unauthorized access

### 4.1 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase hosted) |
| Authentication | JWT (JSON Web Tokens) with School ID verification |
| AI/ML | Object Detection Model for item matching |
| Chatbot | AI-powered conversational assistant |
| Email | Gmail/Nodemailer (transactional emails) |

### 4.2 Access Control Philosophy

| Feature | Public | Student Login Required | Admin Only |
|---------|--------|------------------------|------------|
| Browse Items | Yes | - | - |
| View FAQ | Yes | - | - |
| View Testimonials | Yes | - | - |
| Report Found Item | - | Yes | - |
| Request Lost Item | - | Yes | - |
| Claim Item | - | Yes | - |
| AI Picture Match | - | Yes | - |
| Admin Dashboard | - | - | Yes |
| Approve Claims | - | - | Yes |
| View Student Data | - | - | Yes |

---

## 5. Stakeholders

### 5.1 Primary Stakeholders

| Stakeholder | Role | Interests |
|-------------|------|-----------|
| Students | End Users | Find lost items quickly, report found items easily, get notified when items match |
| School Administrators | System Managers | Efficient management, reduced workload, real-time analytics |
| Front Office Staff | Daily Operators | Easy claim verification, organized workflow, priority management |
| Site Owner | Super Admin | Approve admin accounts, maintain system security |

### 5.2 Secondary Stakeholders

| Stakeholder | Role | Interests |
|-------------|------|-----------|
| Parents | Indirect Users | Their children's belongings are recovered |
| IT Department | Technical Support | System reliability, security compliance |
| School District | Governance | Policy compliance, liability management |

---

## 6. Business Objectives

### 6.1 Primary Objectives

1. **Increase Item Recovery Rate**
   - Target: 70%+ of reported items claimed within 30 days
   - Current baseline: ~30% (estimated traditional system)

2. **Reduce Administrative Time**
   - Target: 50% reduction in staff time spent on lost and found
   - Measure: Hours per week on L&F tasks

3. **Improve Student Satisfaction**
   - Target: 80%+ satisfaction rating for item recovery process
   - Measure: Post-claim surveys and testimonials

4. **Proactive Item Matching**
   - Target: 40%+ of items matched via AI before manual search
   - Measure: AI match notifications sent vs items claimed

### 6.2 Secondary Objectives

1. **Create Digital Accountability**
   - Full audit trail of all items and claims
   - Track item lifecycle from report to claim/disposal

2. **Reduce Physical Storage**
   - Faster claim resolution means less accumulation
   - Automated expiration tracking

3. **Enable Data-Driven Decisions**
   - Analytics on common lost items
   - Identification of high-loss locations

4. **Prevent Theft**
   - AI matching ensures only legitimate owners are notified
   - Admin verification before item release

---

## 7. Scope

### 7.1 In Scope

**User Features:**
- Student registration with school ID verification
- Admin registration with approval workflow
- AI chatbot for user assistance
- FAQ page
- Real user testimonials (with optional video)
- Browse all lost and found items (public)
- Report found items with mandatory photo
- Request lost items (pre-register for matching)
- AI picture/description matching
- Claim items with proof of ownership
- Email receipts for pickup location and timing
- Category and duration filters

**Admin Features:**
- Admin dashboard with real-time analytics
- Claim approval workflow with priority queue
- Private section with student email/grade access
- Backend activity tracker (audit log)
- 6-digit security code login (periodic refresh)
- Site owner approval for new admin accounts

**Technical Features:**
- Object detection model for item matching
- Secure school ID authentication
- Email notification system
- Mobile-responsive design

### 7.2 Out of Scope (Initial Release)

- Native mobile applications (web-only for initial release)
- Integration with existing school SIS
- Multi-school support
- Parent account access
- Real-time push notifications (email only)

---

## 8. Key Features

### 8.1 Public Features (No Login Required)

| Feature | Description | Priority |
|---------|-------------|----------|
| Browse Items | View all available lost and found items | P0 |
| Search & Filter | Find specific items by category, duration, priority, availability | P0 |
| FAQ Page | Common questions and answers about the system | P0 |
| Real User Testimonials | Video/text testimonials from students | P1 |
| AI Chatbot | Conversational assistant for navigation and help | P1 |

### 8.2 Student Features (Login Required)

| Feature | Description | Priority |
|---------|-------------|----------|
| Account Registration | Create account with student ID and school email | P0 |
| Secure Login | School ID authenticated login | P0 |
| Report Found Item | Submit items with mandatory photos and details | P0 |
| Request Lost Item | Pre-register lost items for AI matching | P0 |
| AI Picture Match | Upload photo to match against found items | P0 |
| Claim Item | Claim ownership with proof description | P0 |
| View My Claims | Track status of submitted claims | P0 |
| Email Notifications | Receive updates on matches, claims, and pickup details | P0 |
| Cancel Claim | Withdraw pending claims | P1 |

### 8.3 Admin Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Admin Dashboard | Real-time statistics (total claims, available, success rate) | P0 |
| Claim Approval Queue | Review and approve/deny claims with priority sorting | P0 |
| View All Items | List of all items with status filters | P0 |
| Activity Tracker | Backend log of all uploads, claims, requests, pickups | P0 |
| Student Directory | Private access to student emails and grade levels | P0 |
| 6-Digit Security Code | Periodic code refresh for admin login security | P1 |
| Email Notifications | Receive periodic security codes and system alerts | P1 |

### 8.4 Site Owner Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Admin Approval | Approve new admin registration requests | P0 |
| Send Admin Codes | Email 6-digit codes with approval notes | P0 |
| Super Admin Access | Full system access and configuration | P0 |

---

## 9. User Workflows

### 9.1 Student Registration Workflow

```
Student clicks "Sign Up"
       ↓
Enters registration details:
  - First Name
  - Last Name
  - Grade Level
  - Student ID
  - School Email
  - Password
  - Confirm Password
       ↓
System validates school email domain
       ↓
Account created
       ↓
Student can log in and access features
```

### 9.2 Admin Registration Workflow

```
Admin clicks "Admin Sign Up"
       ↓
Enters registration details:
  - First Name
  - Last Name
  - Admin ID
  - Admin Email
  - Password
  - Confirm Password
       ↓
System shows "Pending Approval" message
       ↓
Site Owner receives notification
       ↓
Site Owner reviews and approves/denies
       ↓
If Approved:
  - System generates 6-digit code
  - Email sent to admin with code and approval note
  - Admin can now access Admin Portal with code
```

### 9.3 Report Found Item Workflow

```
Student logs in
       ↓
Clicks "Report Found Item"
       ↓
Fills mandatory form:
  - Name (mandatory)
  - Grade Level (mandatory)
  - Date Found (mandatory)
  - Where Found - classroom number or main spot
    (gym, cafe, media center, hallway number) (mandatory)
  - Dropped off at Lost and Found? (Yes/No radio) (mandatory)
  - Picture Upload (mandatory)
  - Description (optional)
       ↓
Submits form
       ↓
System runs AI object detection
       ↓
System checks for matching "Request" entries
       ↓
If match found → Notify requesting student
       ↓
Item visible in Browse page
       ↓
Email confirmation sent to reporter
```

### 9.4 Request Lost Item Workflow (Pre-Registration)

```
Student logs in
       ↓
Clicks "Request" (for items not yet reported)
       ↓
Fills form:
  - Name (mandatory)
  - Grade Level (mandatory)
  - Description of lost item:
    - Color
    - Size
    - Material
    - Object type
  - Date Lost (mandatory)
  - Where Lost (optional) - classroom/location
  - Priority Selection (High/Low)
  - Optional: Upload reference photo for AI matching
       ↓
Submits request
       ↓
Request stored in system
       ↓
When matching item is reported:
  - AI compares photo/description
  - If match → Student receives email notification
  - Student can then submit formal claim
```

### 9.5 Claim Item Workflow

```
Student finds item on Browse page
       ↓
Clicks "Claim This Item"
       ↓
Must be logged in
       ↓
Fills claim form with proof of ownership
       ↓
Submits claim
       ↓
Form disappears, shows:
  "Pending Approval"
  + Description: "You'll get an email if approved"
  + "Submit New Form" button
       ↓
Claim goes to Admin approval queue
       ↓
High priority claims appear at top of queue
       ↓
Admin reviews and approves/denies
       ↓
If Approved:
  - Email sent with pickup location and timing
  - Item status changes to "Pending Pickup"
       ↓
Student picks up item
       ↓
Admin marks as picked up
       ↓
Item lifecycle complete
```

### 9.6 AI Picture Matching Workflow

```
Student uploads photo of lost item
       ↓
Object detection model analyzes image
       ↓
System compares against all found items:
  - Visual similarity
  - Category match
  - Location proximity
  - Date range
       ↓
Returns ranked list of potential matches
       ↓
Student reviews matches
       ↓
If match found → Student submits claim
       ↓
Privacy Protection:
  - Only the requesting student is notified
  - Prevents theft by limiting information exposure
```

---

## 10. Page Specifications

### 10.1 Home Page
- Hero section with search functionality
- Feature highlights (AI matching, easy reporting, fast claims)
- Real user testimonials (text and optional video)
- Statistics counter (items returned, success rate)
- Quick links to Browse, Report, Request
- AI Chatbot floating button

### 10.2 Browse Page (Public)

**Filters:**

| Filter | Options |
|--------|---------|
| Search Bar | Free text search |
| Type of Product | Accessories, Clothing, Electronics, School Supplies, Key/ID, Other |
| Duration | 1 week, 2 weeks, 1 month, >1 month |
| Priority | High, Low |
| Availability | Available, Pending Claim, Claimed, All Items |

**Display:**
- Grid/list view of items
- Item cards with photo, category, date, location
- Pagination
- Sort options (newest, oldest, priority)

### 10.3 Report Item Page (Login Required)

**Form Fields:**

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Grade Level | Dropdown | Yes |
| Date Found | Date Picker | Yes |
| Where Found | Text/Dropdown (classroom #, gym, cafe, media center, hallway #) | Yes |
| Dropped off at Lost & Found | Radio (Yes/No) | Yes |
| Picture Upload | File Upload | Yes |
| Description | Textarea | No |

### 10.4 Request Page (Login Required)

**Form Fields:**

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Grade Level | Dropdown | Yes |
| Date Lost | Date Picker | Yes |
| Where Lost | Text/Dropdown | No |
| Description (color, size, material, object) | Textarea | Yes |
| Priority | Radio (High/Low) | Yes |
| Reference Photo | File Upload | No |

### 10.5 Claim Page (Login Required)

**Form Fields:**
- Proof of ownership description
- Contact email
- Contact phone (optional)

**After Submission:**
- Form disappears
- Shows "Pending Approval" message
- Description: "You'll get an email if the request is approved"
- "Submit New Form" button

### 10.6 My Claims Page (Login Required)
- List of all submitted claims
- Status indicators (Pending, Approved, Denied)
- Pickup details for approved claims
- Option to cancel pending claims

### 10.7 FAQ Page (Public)
- Accordion-style Q&A
- Categories: General, Reporting, Claiming, Account
- Search within FAQ
- Contact link for additional questions

### 10.8 Testimonials Section
- Student photos (with permission) or avatars
- Quote text
- Optional video embeds
- Star ratings
- "Share Your Experience" link

### 10.9 Student Sign Up Page

**Form Fields:**

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Grade Level | Dropdown | Yes |
| Student ID | Text | Yes |
| School Email | Email | Yes |
| Password | Password | Yes |
| Confirm Password | Password | Yes |

### 10.10 Admin Sign Up Page

**Form Fields:**

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Admin ID | Text | Yes |
| Admin Email | Email | Yes |
| Password | Password | Yes |
| Confirm Password | Password | Yes |

**After Submit:**
- Shows "Pending Approval" message
- Explains that Site Owner will review and send approval email with 6-digit code

### 10.11 Admin Dashboard (Admin Only)

**Statistics Cards:**
- Total Claims (all time)
- Available Items
- Pending Claims
- Success Rate (%)
- Items This Week
- Claims This Week

**Sections:**
- **Approval Queue** - Priority-sorted list of pending claims
- **All Items** - Filterable table of all items
- **All Claims** - Filterable table of all claims
- **Activity Log** - Backend tracker (uploads, claims, requests, pickups)
- **Student Directory** - Private list with emails and grade levels
- **Request Matches** - AI-suggested matches between requests and items

### 10.12 Site Owner Portal

**Features:**
- Approve/Deny admin registration requests
- Send 6-digit codes with approval notes
- View all admin accounts
- System configuration
- Access to all admin features

---

## 11. AI & Automation Features

### 11.1 AI Chatbot

**Capabilities:**
- Answer FAQs about the system
- Guide users through reporting/claiming process
- Help with navigation
- Provide item search assistance
- Explain policies and procedures

**Availability:**
- Floating button on all pages
- Available 24/7
- Escalation option to contact admin

### 11.2 Object Detection Model

**Functionality:**
- Analyze uploaded item photos
- Extract features (color, shape, category, brand logos)
- Generate searchable tags
- Compare against existing items/requests
- Rank similarity scores

**Privacy Protection:**
- Only notify the student who requested the specific item
- Prevent browsing students from seeing detailed matches
- Require claim verification before revealing owner

### 11.3 Smart Matching System

**How It Works:**
1. Student A loses item → Creates Request with description/photo
2. Student B finds item → Reports with mandatory photo
3. AI compares Request against new Report
4. If match confidence > threshold → Notify Student A only
5. Student A can then submit formal Claim
6. Admin verifies before release

**Benefits:**
- Proactive notification (don't have to keep checking)
- Privacy protection (only owner notified)
- Theft prevention (can't claim items you don't own)

---

## 12. Success Metrics

### 12.1 Key Performance Indicators (KPIs)

| Metric | Description | Target |
|--------|-------------|--------|
| Recovery Rate | % of items successfully claimed | >70% |
| AI Match Rate | % of items matched via AI before manual search | >40% |
| Average Time to Claim | Days from report to claim approval | <5 days |
| User Adoption | % of student body with accounts | >60% |
| Active Users | Monthly active users | >300 |
| Admin Response Time | Time to review pending claims | <24 hours |
| System Uptime | Platform availability | >99% |
| User Satisfaction | Post-claim survey rating | >4.5/5 |

### 12.2 Dashboard Metrics (Real-Time)

- Total active items
- Pending claims count
- Returned items count
- Success rate percentage
- Items reported this week
- Claims submitted this week
- Items by category breakdown
- Recent activity feed
- AI match success rate
- Average claim approval time

---

## 13. Constraints & Assumptions

### 13.1 Constraints

| Type | Constraint |
|------|------------|
| Technical | Web-based only (no native mobile app initially) |
| Budget | School-funded, limited resources |
| Timeline | Must launch before semester end |
| Authentication | Must use school email domain for verification |
| Privacy | Must comply with student data protection regulations |
| AI | Object detection accuracy depends on photo quality |

### 13.2 Assumptions

1. Students have access to devices with cameras and internet
2. Students will voluntarily report found items
3. Admin staff will review claims within reasonable timeframe
4. School network can support the application traffic
5. Users will provide honest information in claims
6. School will provide list of valid student IDs for verification
7. Site Owner will be available to approve admin requests

---

## 14. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low student adoption | Medium | High | Marketing, incentives, ease of use, testimonials |
| False claims | Medium | Medium | AI verification, admin review, proof requirement |
| AI matching errors | Medium | Low | Human verification, confidence thresholds |
| System downtime | Low | High | Cloud hosting, monitoring, backups |
| Data privacy breach | Low | Critical | Encryption, secure auth, audit logs, compliance |
| Admin overwhelmed | Medium | Medium | Priority queue, efficient UI, batch operations |
| Unauthorized admin access | Low | High | 6-digit codes, site owner approval, audit trail |
| Photo storage costs | Medium | Low | Image compression, retention policy |

---

## 15. Future Considerations

1. **Native Mobile App** - iOS and Android applications
2. **School SIS Integration** - Automatic student data sync
3. **Multi-School Support** - Expand to other schools in district
4. **Parent Portal** - Allow parents to view child's claims
5. **Push Notifications** - Real-time mobile alerts
6. **Advanced AI** - Better object recognition, natural language processing
7. **Multi-Language Support** - Spanish and other languages
8. **Analytics Dashboard** - Advanced reporting for school administration
9. **Integration with School Page** - Embed widget on school website

---

## 16. Related Documentation

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | Project overview and setup instructions |
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Detailed functional and technical requirements |
| [CLAUDE.md](../CLAUDE.md) | Development guidelines for AI-assisted coding |

---

*This document is maintained as part of the Lost Dane Found project. For questions or updates, contact the Denmark High School IT department.*
