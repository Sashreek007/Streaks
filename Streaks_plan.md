# STREAKS
## Technical Architecture & Development Plan

---

**Project Type:** Productivity Social Media Platform  
**Development Period:** 2-Day Hackathon  
**Team Size:** 5 Engineers  
**Target Scale:** 100-1,000 Initial Users  
**Platform:** Web Application

**Version:** 1.0  
**Date:** January 2026  
**Status:** Planning Phase

---

## EXECUTIVE SUMMARY

### Project Overview

Streaks is a next-generation productivity platform that leverages social accountability and artificial intelligence to help users achieve their goals. The platform combines community-driven motivation with AI-powered task verification to create a comprehensive accountability ecosystem.

### Core Value Proposition

When users share their goals publicly and provide verifiable proof of completion, they are significantly more likely to follow through. Streaks monetizes this behavioral insight through:

- **AI-Powered Verification:** Automated proof validation using computer vision
- **Social Accountability:** Public and private community structures
- **Gamified Progress:** Dynamic scoring system based on difficulty and engagement
- **Real-Time Engagement:** Live updates and community interaction

### Technical Approach

The application employs a modern, scalable architecture utilizing industry-standard technologies:

- **Frontend:** React with TypeScript for type-safe, maintainable code
- **Backend:** Node.js with Express for high-performance API services
- **Database:** PostgreSQL via Supabase for relational data integrity
- **AI Services:** OpenAI Vision API for intelligent verification
- **Infrastructure:** Google Cloud Run for auto-scaling containerized deployment

### Success Metrics

**Technical:**
- Sub-2 second page load times
- 95%+ AI verification accuracy
- Real-time updates with <500ms latency
- Zero critical security vulnerabilities

**Business:**
- Functional MVP within 48 hours
- All core features operational
- Deployed and publicly accessible
- Demo-ready presentation materials

---

## TABLE OF CONTENTS

### I. TECHNICAL ARCHITECTURE
1. Technology Stack
2. System Architecture
3. Component Diagram
4. Data Flow Architecture
5. Security Architecture

### II. DATABASE DESIGN
1. Schema Overview
2. Entity Relationship Diagram
3. Table Specifications
4. Indexes and Performance
5. Row Level Security Policies

### III. API SPECIFICATION
1. RESTful Endpoints
2. Authentication Flow
3. Request/Response Schemas
4. Error Handling
5. Rate Limiting

### IV. AI VERIFICATION SYSTEM
1. Computer Vision Integration
2. Verification Algorithm
3. Scoring Methodology
4. Confidence Thresholds
5. Manual Review Queue

### V. DEVELOPMENT ROADMAP
1. Project Timeline
2. Team Roles & Responsibilities
3. Development Milestones
4. Integration Strategy
5. Testing Protocol

### VI. DEPLOYMENT STRATEGY
1. Infrastructure Setup
2. CI/CD Pipeline
3. Environment Configuration
4. Monitoring & Logging
5. Rollback Procedures

### VII. PROJECT MANAGEMENT
1. Team Structure
2. Communication Protocols
3. Version Control Workflow
4. Quality Assurance
5. Risk Mitigation

### VIII. APPENDICES
1. Environment Variables
2. Quick Reference Commands
3. Troubleshooting Guide
4. Resources & Documentation

---

# I. TECHNICAL ARCHITECTURE

## 1.1 Technology Stack

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 18.x | UI component library |
| Language | TypeScript | 5.x | Type-safe development |
| Build Tool | Vite | 5.x | Fast development builds |
| UI Library | Shadcn/ui | Latest | Pre-built components |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State Management | Zustand | 4.x | Lightweight state store |
| HTTP Client | Axios | 1.x | API communication |
| Routing | React Router | 6.x | Client-side routing |
| Deployment | Vercel | N/A | Edge network hosting |

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18 LTS | JavaScript runtime |
| Framework | Express | 4.x | Web application framework |
| Language | TypeScript | 5.x | Type-safe development |
| Validation | Zod | 3.x | Schema validation |
| Authentication | Supabase Auth | Latest | JWT-based auth |
| Deployment | Google Cloud Run | N/A | Containerized hosting |

### Database & Services

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Database | PostgreSQL (Supabase) | Relational data storage |
| Authentication | Supabase Auth | User management |
| File Storage | Supabase Storage | Image/file hosting |
| Real-time | Supabase Realtime | WebSocket connections |
| AI Service | OpenAI Vision API | Image verification |

### Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Code repository |
| GitHub Actions | CI/CD automation |
| Docker | Containerization |
| ESLint | Code linting |
| Prettier | Code formatting |

---

## 1.2 System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Application (TypeScript)                │  │
│  │                                                        │  │
│  │  • Component-based UI                                 │  │
│  │  • Zustand state management                           │  │
│  │  • React Router navigation                            │  │
│  │  • Axios HTTP client                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│             Deployed on: Vercel Edge Network                 │
│                https://streaks-app.vercel.app               │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         HTTPS/REST
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Express API Server (TypeScript)                  │  │
│  │                                                        │  │
│  │  • RESTful endpoints                                  │  │
│  │  • JWT authentication                                 │  │
│  │  • Business logic                                     │  │
│  │  • Request validation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│        Deployed on: Google Cloud Run (Containerized)         │
│          https://streaks-backend-xyz.run.app                │
└─────────────────────────────────────────────────────────────┘
                              ↓
            ┌─────────────────┴─────────────────┐
            ↓                                    ↓
┌──────────────────────────┐      ┌──────────────────────────┐
│      DATA LAYER          │      │     AI SERVICES          │
│                          │      │                          │
│  Supabase Platform       │      │  OpenAI Platform         │
│  ┌────────────────────┐  │      │  ┌────────────────────┐ │
│  │ PostgreSQL DB      │  │      │  │ Vision API         │ │
│  │ • User data        │  │      │  │ • Image analysis   │ │
│  │ • Tasks            │  │      │  │ • Verification     │ │
│  │ • Submissions      │  │      │  │ • Confidence score │ │
│  │ • Groups           │  │      │  └────────────────────┘ │
│  └────────────────────┘  │      │                          │
│  ┌────────────────────┐  │      └──────────────────────────┘
│  │ Auth Service       │  │
│  │ • JWT tokens       │  │
│  │ • User sessions    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Storage Service    │  │
│  │ • Image files      │  │
│  │ • CDN delivery     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Realtime Service   │  │
│  │ • WebSocket        │  │
│  │ • Live updates     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

---

## 1.3 Component Architecture

### Frontend Component Hierarchy

```
App (Root)
│
├── AuthProvider (Context)
│   │
│   ├── Login Page
│   │   ├── LoginForm
│   │   └── SignupForm
│   │
│   └── Authenticated Layout
│       │
│       ├── Navbar
│       │   ├── UserMenu
│       │   └── NotificationBell
│       │
│       ├── Sidebar
│       │   ├── Navigation
│       │   └── QuickActions
│       │
│       └── Main Content
│           │
│           ├── Dashboard
│           │   ├── StatsOverview
│           │   ├── ActiveTasks
│           │   └── RecentActivity
│           │
│           ├── Tasks
│           │   ├── TaskList
│           │   ├── TaskCard
│           │   ├── TaskForm
│           │   └── TaskFilter
│           │
│           ├── Submissions
│           │   ├── SubmissionForm
│           │   ├── ProofUpload
│           │   └── VerificationStatus
│           │
│           ├── Groups
│           │   ├── GroupList
│           │   ├── GroupCard
│           │   ├── GroupDetail
│           │   └── CreateGroup
│           │
│           ├── Feed
│           │   ├── FeedFilter
│           │   ├── FeedList
│           │   └── FeedItem
│           │
│           ├── Leaderboard
│           │   ├── GlobalLeaderboard
│           │   ├── GroupLeaderboard
│           │   └── UserRankCard
│           │
│           └── Profile
│               ├── ProfileHeader
│               ├── UserStats
│               ├── TaskHistory
│               └── EditProfile
```

### Backend Service Architecture

```
Express Application
│
├── Middleware Layer
│   ├── CORS Handler
│   ├── Body Parser
│   ├── Authentication Middleware
│   ├── Validation Middleware
│   └── Error Handler
│
├── Route Layer
│   ├── /api/auth
│   ├── /api/tasks
│   ├── /api/submissions
│   ├── /api/groups
│   ├── /api/feed
│   ├── /api/leaderboard
│   └── /api/profile
│
├── Controller Layer
│   ├── Auth Controller
│   ├── Tasks Controller
│   ├── Submissions Controller
│   ├── Groups Controller
│   ├── Feed Controller
│   ├── Leaderboard Controller
│   └── Profile Controller
│
├── Service Layer
│   ├── Supabase Service
│   ├── OpenAI Service
│   ├── Scoring Service
│   ├── Storage Service
│   └── Notification Service
│
└── Utility Layer
    ├── Validators
    ├── Logger
    ├── Error Classes
    └── Type Definitions
```

---

## 1.4 Data Flow Architecture

### Task Verification Flow

```
User Action → Frontend → Backend → AI Service → Database → Frontend Update

Step-by-Step:

1. User uploads proof image
   Frontend: SubmissionForm component
   → Validates file type and size
   → Uploads to Supabase Storage
   → Receives image URL

2. Frontend sends verification request
   API: POST /api/submissions
   → Includes task_id and image_url
   → JWT token in Authorization header

3. Backend validates request
   Middleware: Authentication + Validation
   → Verifies user owns the task
   → Checks task is active

4. Backend calls AI service
   OpenAI Service: verifyTaskCompletion()
   → Sends task description + image URL
   → Receives verification result
   → Confidence score calculated

5. Backend calculates score
   Scoring Service: calculateScore()
   → Task difficulty factor
   → Group multiplier
   → Confidence bonus
   → Streak bonus

6. Database updated
   Supabase Service:
   → Insert submission record
   → Update user score
   → Create feed post
   → Trigger real-time event

7. Frontend receives update
   Real-time: Supabase subscription
   → Feed updates automatically
   → Score updates in UI
   → Leaderboard refreshes
```

### Real-Time Data Synchronization

```
Database Change → Postgres Trigger → Supabase Realtime → WebSocket → Frontend Update

Example: New Post Created

1. User creates post
   → POST /api/feed/post
   → Inserted into posts table

2. Postgres triggers Supabase Realtime
   → Change notification sent to channel
   → All subscribed clients notified

3. Frontend receives notification
   useRealtime hook:
   → Detects new post event
   → Fetches post details
   → Updates Zustand store

4. UI re-renders
   Feed component:
   → New post appears
   → Smooth animation
   → No page refresh needed
```

---

## 1.5 Security Architecture

### Authentication Flow

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ 1. User enters credentials
       ↓
┌──────────────────────────────┐
│   Supabase Auth Service      │
│                              │
│  • Validates credentials     │
│  • Generates JWT token       │
│  • Creates session           │
└──────────┬───────────────────┘
           │ 2. Returns JWT + User
           ↓
┌──────────────┐
│   Frontend   │
│              │
│  • Stores JWT in memory      │
│  • Updates auth state        │
│  • Includes token in headers │
└──────┬───────┘
       │ 3. API requests with token
       ↓
┌──────────────────────────────┐
│   Backend API                │
│                              │
│  Auth Middleware:            │
│  • Extracts JWT from header  │
│  • Verifies signature        │
│  • Validates expiration      │
│  • Adds user to request      │
└──────┬───────────────────────┘
       │ 4. Authorized request
       ↓
┌──────────────────────────────┐
│   Database (Supabase)        │
│                              │
│  Row Level Security (RLS):   │
│  • Checks auth.uid()         │
│  • Enforces permissions      │
│  • Returns authorized data   │
└──────────────────────────────┘
```

### Security Layers

**1. Transport Security**
- TLS/HTTPS enforced on all connections
- Vercel automatic SSL certificates
- Google Cloud Run managed certificates
- Secure WebSocket (WSS) for real-time

**2. Authentication Security**
- JWT-based stateless authentication
- Token expiration (1 hour)
- Refresh token rotation
- HTTP-only cookies (future enhancement)
- Rate limiting on auth endpoints

**3. Authorization Security**
- Row Level Security (RLS) in database
- Resource ownership validation
- Role-based access control (RBAC)
- API endpoint permission checks

**4. Input Security**
- Request validation using Zod schemas
- SQL injection prevention (parameterized queries)
- XSS protection (React auto-escaping)
- File upload validation
- Request size limits

**5. API Security**
- CORS whitelist configuration
- Rate limiting (10 req/sec per user)
- API key rotation procedures
- Request logging and monitoring
- DDoS protection via Cloud Run

**6. Data Security**
- Passwords hashed with bcrypt (via Supabase)
- Environment variables for secrets
- No sensitive data in logs
- Encrypted data at rest (Supabase)
- Encrypted data in transit (HTTPS)

---

# II. DATABASE DESIGN

## 2.1 Schema Overview

### Database Summary

| Metric | Value |
|--------|-------|
| Total Tables | 7 core tables |
| Total Indexes | 15+ optimized indexes |
| Total Functions | 3 stored procedures |
| Total Triggers | 3 automated triggers |
| Security Policies | 20+ RLS policies |

### Entity List

1. **profiles** - User information extending Supabase auth
2. **tasks** - User-created goals and challenges
3. **submissions** - Proof of task completion
4. **groups** - Communities and accountability circles
5. **group_members** - Group membership relationships
6. **posts** - Social feed content
7. **follows** - User relationship graph

---

## 2.2 Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
└────────┬────────┘
         │ 1
         │
         │ 1
┌────────┴────────┐
│    profiles     │
│─────────────────│
│ • id (PK)       │
│ • username      │
│ • display_name  │
│ • score         │
│ • streak_count  │
└────────┬────────┘
         │ 1
         │
         ├──────────┐
         │          │
         │ *        │ *
┌────────┴────────┐ │     ┌──────────────┐
│     tasks       │ │     │  submissions │
│─────────────────│ │     │──────────────│
│ • id (PK)       │ │     │ • id (PK)    │
│ • user_id (FK)  │ │     │ • task_id (FK)│
│ • title         │ │     │ • user_id (FK)│
│ • difficulty    │─┼─────│ • image_url   │
│ • deadline      │       │ • ai_verified │
└─────────────────┘       │ • score       │
                          └──────┬───────┘
                                 │ *
                                 │
┌─────────────────┐              │
│     groups      │              │ *
│─────────────────│         ┌────┴────────┐
│ • id (PK)       │         │    posts    │
│ • name          │         │─────────────│
│ • is_public     │         │ • id (PK)   │
│ • multiplier    │         │ • user_id   │
└────────┬────────┘         │ • group_id  │
         │ *                │ • submission│
         │                  └─────────────┘
         │ *
┌────────┴──────────┐
│  group_members    │
│───────────────────│
│ • group_id (FK)   │
│ • user_id (FK)    │
│ • role            │
└───────────────────┘

         ┌─────────────┐
         │   follows   │
         │─────────────│
         │ • follower  │
         │ • following │
         └─────────────┘
```

---

## 2.3 Table Specifications

### 2.3.1 profiles

**Purpose:** Extended user information linked to Supabase auth

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  score INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT score_non_negative CHECK (score >= 0)
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_score ON profiles(score DESC);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, FK | References auth.users |
| username | TEXT | UNIQUE, NOT NULL | User's unique handle |
| display_name | TEXT | NULL | User's display name |
| bio | TEXT | NULL | User biography |
| avatar_url | TEXT | NULL | Profile picture URL |
| score | INTEGER | DEFAULT 0, >= 0 | Total points earned |
| streak_count | INTEGER | DEFAULT 0 | Current streak days |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last profile update |

---

### 2.3.2 tasks

**Purpose:** User-created goals and challenges

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty FLOAT DEFAULT 1.0,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 3),
  CONSTRAINT difficulty_range CHECK (difficulty >= 0.5 AND difficulty <= 3.0)
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline) WHERE is_active = TRUE;
CREATE INDEX idx_tasks_active ON tasks(is_active);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique task identifier |
| user_id | UUID | FK, NOT NULL | Task owner |
| title | TEXT | NOT NULL, >= 3 chars | Task title |
| description | TEXT | NULL | Detailed description |
| difficulty | FLOAT | 0.5-3.0, DEFAULT 1.0 | Difficulty multiplier |
| deadline | TIMESTAMPTZ | NULL | Optional deadline |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update |

---

### 2.3.3 submissions

**Purpose:** Proof of task completion with AI verification

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  ai_verified BOOLEAN DEFAULT FALSE,
  ai_confidence FLOAT,
  ai_explanation TEXT,
  human_verified BOOLEAN DEFAULT NULL,
  verified_by UUID REFERENCES profiles(id),
  score_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT confidence_range CHECK (
    ai_confidence IS NULL OR 
    (ai_confidence >= 0 AND ai_confidence <= 1)
  ),
  CONSTRAINT score_non_negative CHECK (score_awarded >= 0)
);

CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_verified ON submissions(ai_verified, human_verified);
CREATE INDEX idx_submissions_pending ON submissions(ai_confidence) 
  WHERE ai_confidence < 0.8 AND human_verified IS NULL;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique submission ID |
| task_id | UUID | FK, NOT NULL | Associated task |
| user_id | UUID | FK, NOT NULL | Submission author |
| image_url | TEXT | NOT NULL | Proof image URL |
| ai_verified | BOOLEAN | DEFAULT FALSE | AI verification status |
| ai_confidence | FLOAT | 0.0-1.0, NULL | AI confidence score |
| ai_explanation | TEXT | NULL | AI reasoning |
| human_verified | BOOLEAN | NULL | Manual verification |
| verified_by | UUID | FK, NULL | Moderator who verified |
| score_awarded | INTEGER | >= 0, DEFAULT 0 | Points earned |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Submission time |

---

### 2.3.4 groups

**Purpose:** Communities and accountability circles

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  score_multiplier FLOAT DEFAULT 1.0,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_length CHECK (char_length(name) >= 3),
  CONSTRAINT multiplier_range CHECK (
    score_multiplier >= 0.5 AND score_multiplier <= 2.0
  )
);

CREATE INDEX idx_groups_public ON groups(is_public);
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_member_count ON groups(member_count DESC);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique group ID |
| name | TEXT | NOT NULL, >= 3 chars | Group name |
| description | TEXT | NULL | Group description |
| is_public | BOOLEAN | DEFAULT TRUE | Public/private status |
| score_multiplier | FLOAT | 0.5-2.0, DEFAULT 1.0 | Score multiplier |
| member_count | INTEGER | DEFAULT 0 | Total members |
| created_by | UUID | FK, NULL | Group creator |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update |

---

### 2.3.5 group_members

**Purpose:** Group membership and roles

```sql
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (group_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('member', 'moderator', 'admin'))
);

CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);
```

---

### 2.3.6 posts

**Purpose:** Social feed content

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  content TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT has_content CHECK (
    content IS NOT NULL OR submission_id IS NOT NULL
  )
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_group_id ON posts(group_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_submission ON posts(submission_id);
```

---

### 2.3.7 follows

**Purpose:** User relationship graph

```sql
CREATE TABLE follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

---

## 2.4 Database Functions

### 2.4.1 Increment User Score

```sql
CREATE OR REPLACE FUNCTION increment_score(
  p_user_id UUID,
  p_points INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    score = score + p_points,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.4.2 Update Group Member Count

```sql
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER group_member_count_trigger
AFTER INSERT OR DELETE ON group_members
FOR EACH ROW EXECUTE FUNCTION update_group_member_count();
```

### 2.4.3 Auto-Update Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at 
BEFORE UPDATE ON groups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 2.5 Row Level Security Policies

### profiles Table

```sql
-- Public profiles viewable by all authenticated users
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### tasks Table

```sql
-- Users can view their own tasks
CREATE POLICY "tasks_select_own"
ON tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own tasks
CREATE POLICY "tasks_insert_own"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own tasks
CREATE POLICY "tasks_update_own"
ON tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### submissions Table

```sql
-- Users can view their own submissions
CREATE POLICY "submissions_select_own"
ON submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "submissions_insert_own"
ON submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### groups Table

```sql
-- Public groups viewable by all
-- Private groups viewable by members only
CREATE POLICY "groups_select_policy"
ON groups FOR SELECT
TO authenticated
USING (
  is_public = true 
  OR created_by = auth.uid()
  OR auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = id
  )
);

-- Authenticated users can create groups
CREATE POLICY "groups_insert_policy"
ON groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
```

### posts Table

```sql
-- Posts in public groups viewable by all
-- Posts in private groups viewable by members
CREATE POLICY "posts_select_policy"
ON posts FOR SELECT
TO authenticated
USING (
  group_id IN (
    SELECT id FROM groups WHERE is_public = true
  )
  OR group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);

-- Users can create posts in groups they're members of
CREATE POLICY "posts_insert_policy"
ON posts FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);
```

---

# III. API SPECIFICATION

## 3.1 API Overview

### Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| Production | `https://streaks-backend-xyz.run.app/api` |

### Authentication

All API requests (except `/api/auth/*`) require authentication using JWT tokens in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Response Format

All API responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 3.2 Authentication Endpoints

### POST /api/auth/signup

Create a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt-token-here",
      "refresh_token": "refresh-token-here",
      "expires_in": 3600
    },
    "profile": {
      "id": "uuid-here",
      "username": "johndoe",
      "score": 0
    }
  }
}
```

---

### POST /api/auth/login

Authenticate existing user.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "session": { ... },
    "profile": { ... }
  }
}
```

---

### POST /api/auth/logout

Invalidate current session.

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me

Get current authenticated user.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "profile": {
      "username": "johndoe",
      "display_name": "John Doe",
      "score": 250,
      "streak_count": 7
    }
  }
}
```

---

## 3.3 Tasks Endpoints

### GET /api/tasks

Retrieve user's tasks with optional filtering.

**Request:**
```http
GET /api/tasks?is_active=true&sort=deadline
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| is_active | boolean | Filter by active status |
| sort | string | Sort by: created_at, deadline, difficulty |
| order | string | asc or desc (default: desc) |
| limit | number | Results per page (default: 20) |
| offset | number | Pagination offset |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "Read 30 pages",
        "description": "Daily reading goal",
        "difficulty": 1.5,
        "deadline": "2026-01-29T00:00:00Z",
        "is_active": true,
        "created_at": "2026-01-28T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 20,
      "offset": 0,
      "has_more": false
    }
  }
}
```

---

### POST /api/tasks

Create a new task.

**Request:**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Morning workout",
  "description": "30 minutes of exercise",
  "difficulty": 2.0,
  "deadline": "2026-01-29T08:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Morning workout",
      "description": "30 minutes of exercise",
      "difficulty": 2.0,
      "deadline": "2026-01-29T08:00:00Z",
      "is_active": true,
      "created_at": "2026-01-28T12:00:00Z"
    }
  }
}
```

---

### GET /api/tasks/:id

Get a specific task by ID.

**Request:**
```http
GET /api/tasks/uuid-here
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task": { ... },
    "submissions": [
      {
        "id": "uuid",
        "image_url": "https://...",
        "ai_verified": true,
        "score_awarded": 30,
        "created_at": "2026-01-28T15:00:00Z"
      }
    ]
  }
}
```

---

### PUT /api/tasks/:id

Update an existing task.

**Request:**
```http
PUT /api/tasks/uuid-here
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "is_active": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task": { ... }
  }
}
```

---

### DELETE /api/tasks/:id

Delete a task.

**Request:**
```http
DELETE /api/tasks/uuid-here
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## 3.4 Submissions Endpoints

### POST /api/submissions

Create a new submission with proof image.

**Request:**
```http
POST /api/submissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

task_id: uuid-here
image: <file>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "task_id": "uuid",
      "user_id": "uuid",
      "image_url": "https://storage.supabase.co/...",
      "ai_verified": false,
      "created_at": "2026-01-28T16:00:00Z"
    },
    "message": "Submission created. Verification pending."
  }
}
```

---

### POST /api/submissions/:id/verify

Trigger AI verification for a submission.

**Request:**
```http
POST /api/submissions/uuid-here/verify
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "ai_verified": true,
      "ai_confidence": 0.95,
      "ai_explanation": "Image clearly shows completed workout with visible timer",
      "score_awarded": 30
    },
    "user_score_updated": true,
    "new_total_score": 280
  }
}
```

**Low Confidence Response (200):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "ai_verified": false,
      "ai_confidence": 0.65,
      "ai_explanation": "Unable to clearly verify task completion",
      "score_awarded": 0
    },
    "requires_manual_review": true,
    "message": "Submission queued for manual review"
  }
}
```

---

### GET /api/submissions/pending

Get submissions requiring manual review (moderator only).

**Request:**
```http
GET /api/submissions/pending
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "task": {
          "title": "Run 5km",
          "description": "Morning run"
        },
        "user": {
          "username": "johndoe"
        },
        "image_url": "https://...",
        "ai_confidence": 0.65,
        "ai_explanation": "Unclear image quality",
        "created_at": "2026-01-28T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/submissions/:id/manual-verify

Manually verify a submission (moderator only).

**Request:**
```http
POST /api/submissions/uuid-here/manual-verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "verified": true,
  "notes": "Verified via external evidence"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "human_verified": true,
      "verified_by": "moderator-uuid",
      "score_awarded": 25
    }
  }
}
```

---

## 3.5 Groups Endpoints

### GET /api/groups

List all groups (public + user's private groups).

**Request:**
```http
GET /api/groups?search=fitness&is_public=true
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name |
| is_public | boolean | Filter public/private |
| sort | string | member_count, created_at |
| limit | number | Results per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "uuid",
        "name": "Fitness Challenge",
        "description": "Daily workout accountability",
        "is_public": true,
        "score_multiplier": 1.5,
        "member_count": 127,
        "is_member": false,
        "created_at": "2026-01-15T00:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/groups

Create a new group.

**Request:**
```http
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Morning Runners",
  "description": "5am running crew",
  "is_public": true,
  "score_multiplier": 1.3
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": "uuid",
      "name": "Morning Runners",
      "description": "5am running crew",
      "is_public": true,
      "score_multiplier": 1.3,
      "member_count": 1,
      "created_by": "uuid"
    }
  }
}
```

---

### GET /api/groups/:id

Get group details including members.

**Request:**
```http
GET /api/groups/uuid-here
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": "uuid",
      "name": "Fitness Challenge",
      "description": "...",
      "is_public": true,
      "member_count": 127
    },
    "members": [
      {
        "user_id": "uuid",
        "username": "johndoe",
        "role": "admin",
        "joined_at": "2026-01-15T00:00:00Z"
      }
    ],
    "user_role": "member"
  }
}
```

---

### POST /api/groups/:id/join

Join a group.

**Request:**
```http
POST /api/groups/uuid-here/join
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "membership": {
      "group_id": "uuid",
      "user_id": "uuid",
      "role": "member",
      "joined_at": "2026-01-28T12:00:00Z"
    }
  }
}
```

---

### DELETE /api/groups/:id/leave

Leave a group.

**Request:**
```http
DELETE /api/groups/uuid-here/leave
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## 3.6 Feed Endpoints

### GET /api/feed

Get social feed posts.

**Request:**
```http
GET /api/feed?group_id=uuid&limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| group_id | uuid | Filter by group |
| user_id | uuid | Filter by user |
| limit | number | Posts per page (default: 20) |
| offset | number | Pagination offset |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "username": "johndoe",
          "avatar_url": "https://..."
        },
        "group": {
          "id": "uuid",
          "name": "Fitness Challenge"
        },
        "content": "Completed today's workout!",
        "submission": {
          "id": "uuid",
          "image_url": "https://...",
          "score_awarded": 30
        },
        "likes_count": 15,
        "comments_count": 3,
        "created_at": "2026-01-28T15:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

### POST /api/feed/post

Create a new feed post.

**Request:**
```http
POST /api/feed/post
Authorization: Bearer <token>
Content-Type: application/json

{
  "group_id": "uuid",
  "content": "Just hit a new personal record!",
  "submission_id": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "uuid",
      "user_id": "uuid",
      "group_id": "uuid",
      "content": "Just hit a new personal record!",
      "submission_id": "uuid",
      "created_at": "2026-01-28T16:00:00Z"
    }
  }
}
```

---

## 3.7 Leaderboard Endpoints

### GET /api/leaderboard

Get global or group-specific leaderboard.

**Request:**
```http
GET /api/leaderboard?group_id=uuid&period=week&limit=100
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| group_id | uuid | Group leaderboard (optional) |
| period | string | all, week, month (default: all) |
| limit | number | Top N users (default: 100) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "username": "topuser",
          "avatar_url": "https://..."
        },
        "score": 1250,
        "streak_count": 45
      },
      {
        "rank": 2,
        "user": { ... },
        "score": 1180,
        "streak_count": 38
      }
    ],
    "current_user_rank": 15,
    "current_user_score": 780
  }
}
```

---

## 3.8 Profile Endpoints

### GET /api/profile/:username

Get user profile by username.

**Request:**
```http
GET /api/profile/johndoe
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "username": "johndoe",
      "display_name": "John Doe",
      "bio": "Fitness enthusiast",
      "avatar_url": "https://...",
      "score": 780,
      "streak_count": 15,
      "created_at": "2026-01-01T00:00:00Z"
    },
    "stats": {
      "total_tasks": 45,
      "completed_tasks": 38,
      "completion_rate": 84.4,
      "groups_joined": 5,
      "followers_count": 23,
      "following_count": 31
    },
    "is_following": false
  }
}
```

---

### PUT /api/profile

Update current user's profile.

**Request:**
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "display_name": "John Smith",
  "bio": "Updated bio",
  "avatar_url": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": { ... }
  }
}
```

---

### POST /api/profile/:userId/follow

Follow a user.

**Request:**
```http
POST /api/profile/uuid-here/follow
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "following": true,
    "follower_count": 24
  }
}
```

---

### DELETE /api/profile/:userId/follow

Unfollow a user.

**Request:**
```http
DELETE /api/profile/uuid-here/follow
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## 3.9 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| AUTH_001 | Invalid credentials | 401 |
| AUTH_002 | Token expired | 401 |
| AUTH_003 | Token invalid | 401 |
| AUTH_004 | Insufficient permissions | 403 |
| VALID_001 | Invalid input format | 400 |
| VALID_002 | Missing required field | 400 |
| VALID_003 | Value out of range | 400 |
| RES_001 | Resource not found | 404 |
| RES_002 | Resource already exists | 409 |
| RES_003 | Cannot delete resource | 409 |
| RATE_001 | Rate limit exceeded | 429 |
| SRV_001 | Internal server error | 500 |
| SRV_002 | External service unavailable | 503 |

---

# IV. AI VERIFICATION SYSTEM

## 4.1 OpenAI Vision Integration

### Service Implementation

```typescript
// backend/src/services/openai.service.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface VerificationResult {
  verified: boolean;
  confidence: number;
  explanation: string;
}

export async function verifyTaskCompletion(
  taskTitle: string,
  taskDescription: string,
  imageUrl: string
): Promise<VerificationResult> {
  
  const systemPrompt = `You are a task verification AI for a productivity app. 
Analyze images to determine if users have completed their stated tasks.
Be strict but fair - look for clear evidence of completion.
Consider potential cheating or staged photos.`;

  const userPrompt = `Task Title: "${taskTitle}"
Task Description: "${taskDescription || 'No additional details'}"

Analyze the provided image and determine:
1. Does it show clear, genuine evidence of task completion?
2. Are there any signs of cheating, staging, or fake evidence?
3. How confident are you in this assessment?

Respond ONLY with valid JSON:
{
  "verified": true/false,
  "confidence": 0.0-1.0,
  "explanation": "Brief, specific reasoning (max 100 chars)"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.2, // Low temperature for consistency
    });

    const content = response.choices[0].message.content;
    
    // Extract JSON from markdown if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response missing JSON');
    }
    
    const result: VerificationResult = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (
      typeof result.verified !== 'boolean' ||
      typeof result.confidence !== 'number' ||
      typeof result.explanation !== 'string' ||
      result.confidence < 0 ||
      result.confidence > 1
    ) {
      throw new Error('Invalid verification result format');
    }
    
    return result;
    
  } catch (error) {
    console.error('OpenAI verification failed:', error);
    
    // Return low-confidence failure on errors
    return {
      verified: false,
      confidence: 0,
      explanation: 'Verification service error - manual review required',
    };
  }
}
```

---

## 4.2 Verification Algorithm

### Decision Tree

```
Image Upload
    ↓
Call OpenAI Vision API
    ↓
Parse Response
    ↓
┌─────────────────────────┐
│ Confidence >= 0.8 ?     │
└─────────────────────────┘
    ↓               ↓
   YES             NO
    ↓               ↓
┌─────────┐   ┌──────────────┐
│ Verified│   │Manual Review │
│ = TRUE  │   │   Queue      │
└─────────┘   └──────────────┘
    ↓               ↓
Award Points   Moderator Review
    ↓               ↓
Update Score   Manual Decision
    ↓               ↓
Post to Feed   Award/Deny Points
```

### Confidence Thresholds

| Confidence Range | Action | Points Awarded |
|-----------------|--------|----------------|
| 0.95 - 1.0 | Auto-approve + bonus | Full + 20% |
| 0.80 - 0.94 | Auto-approve | Full points |
| 0.60 - 0.79 | Manual review queue | TBD |
| 0.00 - 0.59 | Auto-reject + review | 0 points |

---

## 4.3 Scoring Methodology

### Point Calculation Formula

```typescript
// backend/src/services/scoring.service.ts

interface ScoreInput {
  taskDifficulty: number;      // 0.5 - 3.0
  groupMultiplier: number;     // 0.8 - 2.0 (private=0.8, public=1.5)
  aiConfidence: number;        // 0.0 - 1.0
  userStreak: number;          // Consecutive days
}

export function calculateScore(input: ScoreInput): number {
  const BASE_POINTS = 10;
  
  // Step 1: Base points × difficulty
  let points = BASE_POINTS * input.taskDifficulty;
  
  // Step 2: Group type multiplier
  points *= input.groupMultiplier;
  
  // Step 3: Confidence adjustment
  if (input.aiConfidence >= 0.95) {
    points *= 1.2; // High confidence bonus
  } else if (input.aiConfidence >= 0.80) {
    points *= 1.0; // Standard
  } else if (input.aiConfidence >= 0.70) {
    points *= 0.8; // Low confidence penalty
  } else {
    points = 0; // Too low - no points
  }
  
  // Step 4: Streak bonus (max 2x at 30 days)
  const streakMultiplier = Math.min(1 + (input.userStreak / 30), 2.0);
  points *= streakMultiplier;
  
  // Round to whole number
  return Math.round(points);
}
```

### Scoring Examples

**Example 1: High Performer**
```typescript
calculateScore({
  taskDifficulty: 2.5,    // Hard task
  groupMultiplier: 1.5,   // Public group
  aiConfidence: 0.96,     // Very high confidence
  userStreak: 15,         // 15-day streak
});
// = 10 * 2.5 * 1.5 * 1.2 * 1.5 = 68 points
```

**Example 2: Moderate Performance**
```typescript
calculateScore({
  taskDifficulty: 1.0,    // Medium task
  groupMultiplier: 1.0,   // No group
  aiConfidence: 0.85,     // Good confidence
  userStreak: 3,          // New streak
});
// = 10 * 1.0 * 1.0 * 1.0 * 1.1 = 11 points
```

**Example 3: Private Group**
```typescript
calculateScore({
  taskDifficulty: 1.5,    // Medium-hard task
  groupMultiplier: 0.8,   // Private group penalty
  aiConfidence: 0.90,     // High confidence
  userStreak: 0,          // No streak
});
// = 10 * 1.5 * 0.8 * 1.0 * 1.0 = 12 points
```

---

## 4.4 Manual Review System

### Review Queue Implementation

```typescript
// backend/src/services/review.service.ts

export async function getReviewQueue(
  moderatorId: string,
  limit: number = 20
): Promise<Submission[]> {
  
  // Get submissions needing review
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      task:tasks(*),
      user:profiles(username, avatar_url)
    `)
    .lt('ai_confidence', 0.8)
    .is('human_verified', null)
    .order('created_at', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function manualVerifySubmission(
  submissionId: string,
  moderatorId: string,
  decision: {
    verified: boolean;
    notes?: string;
  }
): Promise<void> {
  
  // Get submission and task details
  const submission = await getSubmission(submissionId);
  const task = await getTask(submission.task_id);
  
  // Calculate points if verified
  let pointsAwarded = 0;
  if (decision.verified) {
    const group = await getGroupForTask(task.id);
    const streak = await getUserStreak(submission.user_id);
    
    pointsAwarded = calculateScore({
      taskDifficulty: task.difficulty,
      groupMultiplier: group?.score_multiplier || 1.0,
      aiConfidence: 1.0, // Full confidence for human verification
      userStreak: streak,
    });
    
    // Award points
    await incrementUserScore(submission.user_id, pointsAwarded);
  }
  
  // Update submission
  await supabase
    .from('submissions')
    .update({
      human_verified: decision.verified,
      verified_by: moderatorId,
      score_awarded: pointsAwarded,
    })
    .eq('id', submissionId);
  
  // Create feed post if verified
  if (decision.verified) {
    await createFeedPost({
      user_id: submission.user_id,
      submission_id: submissionId,
      content: `Completed: ${task.title}`,
    });
  }
}
```

---

## 4.5 Anti-Fraud Measures

### Fraud Detection Strategies

**1. AI Prompt Engineering**
- Explicitly instruct AI to look for signs of cheating
- Check for staged photos, screenshots, or stock images
- Verify timestamps and metadata when visible
- Look for inconsistencies in environment

**2. Rate Limiting**
- Max 10 submissions per user per day
- Cooldown period between submissions for same task
- Flag accounts with abnormal submission patterns

**3. Community Moderation**
- Allow users to report suspicious submissions
- Public submissions visible to group members
- Community voting on verification (future feature)

**4. Behavioral Analysis**
- Track completion patterns
- Flag sudden score spikes
- Monitor streak consistency
- Compare to peer performance

**5. Technical Validation**
- Check image metadata for manipulation
- Verify file upload timestamps
- Detect duplicate image submissions
- Validate image quality and resolution

---

# V. DEVELOPMENT ROADMAP

## 5.1 Project Timeline

### Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| Day 0 | Pre-hackathon | Setup & planning |
| Day 1 | Hours 1-8 | Core features & integration |
| Day 2 | Hours 9-16 | Social features & polish |
| Post-hackathon | Ongoing | Improvements & scaling |

---

### Day 0: Pre-Hackathon Preparation

**Account Setup (Team Lead)**
- Create GitHub organization
- Setup Supabase account
- Create Google Cloud project
- Obtain OpenAI API key
- Setup Vercel account

**Repository Structure (All)**
- Initialize Git repository
- Create frontend & backend folders
- Setup .gitignore files
- Create README template
- Define branch strategy

**Tool Installation (Individual)**
- Install Node.js 18+
- Install Google Cloud CLI
- Install Docker Desktop
- Setup code editor (VS Code recommended)
- Install browser dev tools

---

### Day 1: Foundation & Core Features

#### Hour 0-1: Project Initialization

**Frontend Team (Person 1 & 2)**
```bash
# Initialize React + TypeScript project
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Install dependencies
npm install @supabase/supabase-js axios zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Shadcn/ui
npx shadcn-ui@latest init

# Start development server
npm run dev
```

**Backend Team (Person 3 & 4)**
```bash
# Initialize Node.js project
mkdir backend && cd backend
npm init -y

# Install dependencies
npm install express cors dotenv zod
npm install -D typescript @types/node @types/express \
  @types/cors ts-node-dev

# Initialize TypeScript
npx tsc --init

# Create folder structure
mkdir -p src/{routes,controllers,services,middleware,types}

# Start development server
npm run dev
```

**Database Team (Person 3)**
- Create Supabase project
- Run database schema SQL
- Setup storage bucket
- Configure RLS policies
- Test connections

**AI/DevOps (Person 5)**
- Setup OpenAI account
- Test Vision API
- Create Google Cloud project
- Configure service accounts
- Prepare deployment scripts

**Deliverables:**
- ✅ All development environments running
- ✅ Database schema deployed
- ✅ Team can commit to Git
- ✅ All API keys obtained

---

#### Hour 1-4: Core Feature Development

**Person 1: Authentication & Layout**

Tasks:
1. Create Supabase client configuration
2. Build login/signup forms
3. Implement authentication flow
4. Create Zustand auth store
5. Build main layout (Navbar, Sidebar)
6. Setup protected routes

Files to create:
```
src/lib/supabase.ts
src/stores/authStore.ts
src/components/auth/LoginForm.tsx
src/components/auth/SignupForm.tsx
src/components/layout/Navbar.tsx
src/components/layout/Sidebar.tsx
src/pages/Login.tsx
src/pages/Dashboard.tsx
```

**Person 2: Task Management UI**

Tasks:
1. Create API client (Axios instance)
2. Build TaskForm component
3. Build TaskCard component
4. Build TaskList component
5. Connect to backend API
6. Add loading states

Files to create:
```
src/lib/api.ts
src/components/tasks/TaskForm.tsx
src/components/tasks/TaskCard.tsx
src/components/tasks/TaskList.tsx
src/types/index.ts
src/hooks/useTasks.ts
```

**Person 3: Database Layer**

Tasks:
1. Create Supabase service
2. Implement database query functions
3. Create auth middleware
4. Add error handling
5. Write validation utilities

Files to create:
```
src/services/supabase.service.ts
src/middleware/auth.middleware.ts
src/utils/validators.ts
src/types/index.ts
```

**Person 4: API Routes**

Tasks:
1. Setup Express server
2. Configure CORS
3. Create auth routes
4. Create task routes
5. Add request validation
6. Test with Postman

Files to create:
```
src/index.ts
src/routes/auth.routes.ts
src/routes/tasks.routes.ts
src/controllers/auth.controller.ts
src/controllers/tasks.controller.ts
src/middleware/validation.middleware.ts
```

**Person 5: AI Integration**

Tasks:
1. Create OpenAI service
2. Write verification prompt
3. Test with sample images
4. Create scoring service
5. Document AI behavior

Files to create:
```
src/services/openai.service.ts
src/services/scoring.service.ts
docs/ai-verification.md
```

**Deliverables (End of Hour 4):**
- ✅ Working authentication
- ✅ Task creation functional
- ✅ Database queries working
- ✅ AI service ready

---

#### Hour 4-6: Integration & Submissions

**Frontend Team**

Person 1:
- Create SubmissionForm
- Implement image upload to Supabase Storage
- Build ProofUpload component
- Add verification status display

Person 2:
- Connect TaskForm to API
- Display tasks from database
- Add error handling
- Implement optimistic updates

**Backend Team**

Person 3:
- Create submissions routes
- Handle image uploads
- Update user scores
- Create feed posts

Person 4:
- Build submissions controller
- Integrate AI verification
- Calculate points
- Handle edge cases

**AI/DevOps**
- Fine-tune prompts
- Test verification accuracy
- Add retry logic
- Begin deployment setup

**Deliverables (End of Hour 6):**
- ✅ Image upload working
- ✅ AI verification functional
- ✅ Points calculated correctly
- ✅ Scores updating

---

#### Hour 6-8: Real-Time & Feed

**Frontend Team**

Person 1:
- Create useRealtime hook
- Subscribe to Supabase channels
- Handle real-time updates
- Add optimistic UI updates

Person 2:
- Create FeedItem component
- Create Feed component
- Display user posts
- Show submission images

**Backend Team**

Person 3:
- Create feed routes
- Implement pagination
- Join user & submission data
- Optimize queries

Person 4:
- Create groups routes
- Basic group CRUD
- Group membership logic
- Feed filtering

**AI/DevOps**
- Deploy backend to Cloud Run
- Deploy frontend to Vercel
- Configure environment variables
- End-to-end testing

**Deliverables (End of Hour 8 - END DAY 1):**
- ✅ Real-time feed working
- ✅ Social features basic
- ✅ Deployed to staging
- ✅ MVP functional

---

### Day 2: Social Features & Polish

#### Hour 8-10: Groups & Communities

**Frontend Team**

Person 1:
- GroupCard component
- GroupList page
- Join/leave functionality
- Group detail page

Person 2:
- CreateGroup form
- Member list display
- Feed filtering by group
- Public/private UI

**Backend Team**

Person 3:
- Group membership endpoints
- Permission enforcement
- Member management
- Score multiplier logic

Person 4:
- Group feed filtering
- Leaderboard per group
- Query optimization
- Caching strategy

**AI/DevOps**
- Monitor costs
- Add rate limiting
- Performance testing
- Prepare demo data

**Deliverables (End of Hour 10):**
- ✅ Public groups working
- ✅ Private groups functional
- ✅ Membership management
- ✅ Group feeds

---

#### Hour 10-12: Leaderboard & Profiles

**Frontend Team**

Person 1:
- Leaderboard component
- Rank display
- Time period filtering
- User rank highlighting

Person 2:
- Profile page
- User statistics
- Task history
- Edit profile form

**Backend Team**

Person 3:
- Leaderboard queries
- Score aggregation
- Caching results
- Performance optimization

Person 4:
- Profile endpoints
- User statistics
- Following system
- Privacy settings

**AI/DevOps**
- Seed database
- Create demo accounts
- Generate realistic data
- Performance benchmarks

**Deliverables (End of Hour 12):**
- ✅ Leaderboard functional
- ✅ Profiles complete
- ✅ Demo data ready
- ✅ Performance optimized

---

#### Hour 12-14: Polish & Enhancement

**Frontend Team**

Person 1:
- Loading skeletons
- Error boundaries
- Toast notifications
- Animations

Person 2:
- Mobile responsiveness
- Accessibility (a11y)
- UI polish
- Dark mode (optional)

**Backend Team**

Person 3:
- Comprehensive error handling
- Input validation
- Logging
- Security audit

Person 4:
- Rate limiting
- API documentation
- Performance optimization
- Final testing

**AI/DevOps**
- Production deployment
- SSL certificates
- Monitoring setup
- Backup strategy

**Deliverables (End of Hour 14):**
- ✅ Polished UI
- ✅ Error handling complete
- ✅ Mobile responsive
- ✅ Production deployed

---

#### Hour 14-16: Testing & Demo Prep

**All Team**

Hour 14-15: Final Testing
- End-to-end testing
- Cross-browser testing
- Mobile testing
- Bug fixing
- Performance testing

Hour 15-16: Demo Preparation
- Create demo accounts
- Seed demo data
- Write demo script
- Create pitch deck
- Record demo video
- Update README
- Code cleanup

**Final Deliverables:**
- ✅ Fully functional application
- ✅ Deployed and accessible
- ✅ Demo materials ready
- ✅ Documentation complete

---

## 5.2 Team Roles & Responsibilities

### Person 1: Frontend Lead

**Primary Responsibilities:**
- Authentication system
- Layout & navigation
- Real-time integration
- State management
- User experience

**Technical Skills:**
- React + TypeScript
- Zustand
- Supabase client SDK
- WebSocket/Realtime
- UI/UX design

**Key Deliverables:**
- Auth flow
- Main layout
- Real-time hooks
- Navigation system
- Loading states

---

### Person 2: Frontend Developer

**Primary Responsibilities:**
- Task management UI
- Forms & validation
- Feed components
- Profile pages
- Responsive design

**Technical Skills:**
- React components
- Form handling
- API integration
- CSS/Tailwind
- Accessibility

**Key Deliverables:**
- Task components
- Form components
- Feed UI
- Profile pages
- Mobile responsive

---

### Person 3: Backend/Database Lead

**Primary Responsibilities:**
- Database schema
- Supabase integration
- Data layer
- Complex queries
- Performance optimization

**Technical Skills:**
- PostgreSQL/SQL
- Supabase platform
- Database design
- Query optimization
- Node.js

**Key Deliverables:**
- Database schema
- Supabase service
- Data queries
- RLS policies
- Database functions

---

### Person 4: Backend Developer

**Primary Responsibilities:**
- REST API design
- Route handlers
- Business logic
- API documentation
- Error handling

**Technical Skills:**
- Node.js + Express
- TypeScript
- REST API design
- Validation (Zod)
- API security

**Key Deliverables:**
- Express routes
- Controllers
- Middleware
- API documentation
- Error handling

---

### Person 5: AI/DevOps Engineer

**Primary Responsibilities:**
- AI integration
- Verification system
- Deployment
- CI/CD
- Monitoring

**Technical Skills:**
- OpenAI API
- Google Cloud
- Docker
- CI/CD (GitHub Actions)
- Prompt engineering

**Key Deliverables:**
- OpenAI service
- Scoring algorithm
- Deployment pipeline
- Monitoring setup
- Documentation

---

## 5.3 Development Milestones

### Milestone 1: Development Environment Ready
**Target:** Hour 1  
**Owner:** All team members

Criteria:
- [ ] Local environments running
- [ ] Database deployed
- [ ] API keys obtained
- [ ] Git repository setup
- [ ] Team can collaborate

---

### Milestone 2: Authentication Complete
**Target:** Hour 3  
**Owner:** Person 1, 3, 4

Criteria:
- [ ] Users can sign up
- [ ] Users can log in
- [ ] JWT tokens working
- [ ] Protected routes functional
- [ ] Auth state managed

---

### Milestone 3: Task Management Working
**Target:** Hour 4  
**Owner:** Person 2, 3, 4

Criteria:
- [ ] Tasks can be created
- [ ] Tasks display correctly
- [ ] Tasks can be edited
- [ ] Tasks can be deleted
- [ ] Validation working

---

### Milestone 4: AI Verification Functional
**Target:** Hour 6  
**Owner:** Person 5, 4

Criteria:
- [ ] Images upload successfully
- [ ] AI analyzes images
- [ ] Confidence scores returned
- [ ] Points calculated
- [ ] Scores update

---

### Milestone 5: MVP Complete
**Target:** Hour 8 (End Day 1)  
**Owner:** All team

Criteria:
- [ ] All core features working
- [ ] Real-time updates functional
- [ ] Deployed to staging
- [ ] Basic testing complete
- [ ] No critical bugs

---

### Milestone 6: Social Features Complete
**Target:** Hour 12  
**Owner:** All team

Criteria:
- [ ] Groups working
- [ ] Feed functional
- [ ] Leaderboard live
- [ ] Profiles complete
- [ ] Integration tested

---

### Milestone 7: Production Ready
**Target:** Hour 14  
**Owner:** Person 5, All

Criteria:
- [ ] Deployed to production
- [ ] All features working
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Documentation complete

---

### Milestone 8: Demo Ready
**Target:** Hour 16 (End Day 2)  
**Owner:** All team

Criteria:
- [ ] Demo script prepared
- [ ] Demo data seeded
- [ ] Pitch deck ready
- [ ] Video recorded
- [ ] Presentation rehearsed

---

## 5.4 Quality Assurance

### Code Quality Standards

**TypeScript Requirements:**
- Strict mode enabled
- No `any` types (except external libs)
- All functions typed
- Interfaces for complex objects
- Enums for constants

**Code Style:**
- ESLint configured
- Prettier for formatting
- Consistent naming conventions
- Meaningful variable names
- Comments for complex logic

**Git Commit Standards:**
```
[FRONTEND] Add task creation form
[BACKEND] Implement AI verification
[DATABASE] Add groups schema
[AI] Optimize verification prompt
[DEVOPS] Configure Cloud Run deployment
[FIX] Resolve auth token expiration
[DOCS] Update API documentation
```

---

### Testing Strategy

**Frontend Testing:**
- Manual testing of all flows
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- Accessibility checking

**Backend Testing:**
- API endpoint testing with Postman
- Error handling verification
- Database constraint testing
- Load testing (basic)

**Integration Testing:**
- End-to-end user flows
- Real-time functionality
- File uploads
- AI verification

**Performance Testing:**
- Page load times
- API response times
- Database query performance
- Image loading speed

---

### Bug Tracking

**Priority Levels:**
- **P0 (Critical):** Blocks core functionality - fix immediately
- **P1 (High):** Major feature broken - fix today
- **P2 (Medium):** Minor issue - fix if time
- **P3 (Low):** Nice to have - defer

**Bug Report Format:**
```markdown
## Bug Title
**Priority:** P0/P1/P2/P3
**Component:** Frontend/Backend/Database/AI
**Assigned:** Person Name

### Description
Clear description of the issue

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots/Logs
Attach relevant info
```

---

# VI. DEPLOYMENT STRATEGY

## 6.1 Infrastructure Setup

### Supabase Configuration

**1. Project Creation:**
```bash
# Go to https://supabase.com/dashboard
# Click "New Project"
Project Name: streaks-app
Database Password: [SECURE_PASSWORD]
Region: us-east-1 (or closest to users)
```

**2. Database Setup:**
```sql
-- Run in Supabase SQL Editor
-- Copy entire schema from database/schema.sql
-- Execute to create all tables, functions, triggers, policies
```

**3. Storage Configuration:**
```bash
# In Supabase Dashboard:
# Storage → New Bucket
Name: task-proofs
Public: Yes
File size limit: 5MB
Allowed MIME types: image/jpeg, image/png, image/webp

# Add RLS policy for bucket:
```

```sql
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public images viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-proofs');
```

**4. Obtain Credentials:**
```bash
# Settings → API
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (SECRET!)
```

---

### Google Cloud Setup

**1. Project Creation:**
```bash
# Install Google Cloud CLI first
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Create project
gcloud projects create streaks-backend-prod \
  --name="Streaks Backend Production"

# Set as active project
gcloud config set project streaks-backend-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Set default region
gcloud config set run/region us-central1
```

**2. Service Account Setup:**
```bash
# Create service account for CI/CD
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding streaks-backend-prod \
  --member="serviceAccount:github-actions@streaks-backend-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding streaks-backend-prod \
  --member="serviceAccount:github-actions@streaks-backend-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@streaks-backend-prod.iam.gserviceaccount.com
```

---

### OpenAI Setup

**1. Account Creation:**
```bash
# Go to https://platform.openai.com
# Sign up or log in
# Add payment method (required for Vision API)
# Add minimum $5 credit
```

**2. API Key Generation:**
```bash
# Go to API Keys section
# Click "Create new secret key"
# Name: streaks-hackathon
# Copy key: sk-proj-xxxxx...
# Save securely (cannot view again)
```

---

## 6.2 CI/CD Pipeline

### GitHub Secrets Configuration

```bash
# Go to GitHub Repository Settings → Secrets and variables → Actions
# Add the following secrets:

# Google Cloud
GCP_SA_KEY: <paste contents of key.json>

# Vercel
VERCEL_TOKEN: <get from vercel.com/account/tokens>
VERCEL_ORG_ID: <from .vercel/project.json>
VERCEL_PROJECT_ID: <from .vercel/project.json>

# Supabase
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY: eyJhbGci... (service_role key)
SUPABASE_ANON_KEY: eyJhbGci... (anon public key)

# OpenAI
OPENAI_API_KEY: sk-proj-xxxxx...

# Application
VITE_API_URL: https://streaks-backend-xyz.run.app
FRONTEND_URL: https://streaks-app.vercel.app
```

---

### Backend Deployment Workflow

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to Cloud Run

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'

env:
  PROJECT_ID: streaks-backend-prod
  SERVICE_NAME: streaks-backend
  REGION: us-central1

jobs:
  deploy:
    name: Deploy to Cloud Run
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ env.PROJECT_ID }}

      - name: Authorize Docker
        run: gcloud auth configure-docker

      - name: Deploy to Cloud Run
        run: |
          cd backend
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --source . \
            --platform managed \
            --region ${{ env.REGION }} \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --max-instances 10 \
            --timeout 60s \
            --set-env-vars "\
          SUPABASE_URL=${{ secrets.SUPABASE_URL }},\
          SUPABASE_SERVICE_KEY=${{ secrets.SUPABASE_SERVICE_KEY }},\
          OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }},\
          FRONTEND_URL=${{ secrets.FRONTEND_URL }},\
          NODE_ENV=production"

      - name: Get Service URL
        run: |
          URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --platform managed \
            --region ${{ env.REGION }} \
            --format 'value(status.url)')
          echo "Service deployed at: $URL"
```

---

### Frontend Deployment Workflow

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: |
          cd frontend
          vercel pull --yes --environment=production \
            --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: |
          cd frontend
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        run: |
          cd frontend
          vercel deploy --prebuilt --prod \
            --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 6.3 Manual Deployment Commands

### Backend Deployment (Google Cloud Run)

```bash
# Navigate to backend directory
cd backend

# Ensure Dockerfile exists
# (See Dockerfile template below)

# Deploy to Cloud Run
gcloud run deploy streaks-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 60s \
  --set-env-vars "\
SUPABASE_URL=https://xxxxx.supabase.co,\
SUPABASE_SERVICE_KEY=your_service_key,\
OPENAI_API_KEY=sk-proj-xxxxx,\
FRONTEND_URL=https://streaks-app.vercel.app,\
NODE_ENV=production"

# Get deployed URL
gcloud run services describe streaks-backend \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

**Backend Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Cloud Run expects PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Start application
CMD ["node", "dist/index.js"]
```

---

### Frontend Deployment (Vercel)

```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel (first time only)
vercel login

# Link project (first time only)
vercel link

# Set environment variables
vercel env add VITE_API_URL production
# Enter: https://streaks-backend-xyz.run.app

vercel env add VITE_SUPABASE_URL production
# Enter: https://xxxxx.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter: eyJhbGci...

# Deploy to production
vercel --prod

# Or use Vercel Dashboard:
# 1. Go to vercel.com/dashboard
# 2. Import Git Repository
# 3. Select 'frontend' as root directory
# 4. Add environment variables
# 5. Deploy
```

---

## 6.4 Environment Configuration

### Development Environment

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**Backend (.env):**
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci... (service_role)
OPENAI_API_KEY=sk-proj-xxxxx
FRONTEND_URL=http://localhost:5173
```

---

### Production Environment

**Frontend (Vercel Environment Variables):**
```env
VITE_API_URL=https://streaks-backend-xyz.run.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**Backend (Cloud Run Environment Variables):**
```env
PORT=8080
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci... (service_role)
OPENAI_API_KEY=sk-proj-xxxxx
FRONTEND_URL=https://streaks-app.vercel.app
```

---

## 6.5 Monitoring & Logging

### Google Cloud Monitoring

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=streaks-backend" \
  --limit 50 \
  --format json

# Stream logs in real-time
gcloud logging tail "resource.type=cloud_run_revision \
  AND resource.labels.service_name=streaks-backend"

# View metrics in Cloud Console
# https://console.cloud.google.com/run/detail/us-central1/streaks-backend/metrics
```

### Vercel Monitoring

```bash
# View deployment logs
# https://vercel.com/your-team/streaks-app/deployments

# Runtime logs
# https://vercel.com/your-team/streaks-app/logs

# Analytics
# https://vercel.com/your-team/streaks-app/analytics
```

### Application Logging

**Backend Logging:**
```typescript
// src/utils/logger.ts

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      meta,
      timestamp: new Date().toISOString(),
    }));
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      meta,
      timestamp: new Date().toISOString(),
    }));
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      meta,
      timestamp: new Date().toISOString(),
    }));
  },
};
```

---

## 6.6 Rollback Procedures

### Backend Rollback

```bash
# List recent revisions
gcloud run revisions list \
  --service=streaks-backend \
  --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic streaks-backend \
  --to-revisions=streaks-backend-00002-abc=100 \
  --region=us-central1
```

### Frontend Rollback

```bash
# Via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Promote to Production"

# Via CLI:
vercel rollback
```

---

# VII. PROJECT MANAGEMENT

## 7.1 Team Structure

### Organizational Chart

```
Project Lead (Person 5 - AI/DevOps)
│
├── Frontend Team Lead (Person 1)
│   └── Frontend Developer (Person 2)
│
└── Backend Team Lead (Person 4)
    └── Database Developer (Person 3)
```

### Team Coordination

**Daily Sync Schedule:**
- **Morning Standup (9:00 AM):** 10 minutes
  - Progress updates
  - Today's goals
  - Blockers

- **Midday Check-in (1:00 PM):** 5 minutes
  - Quick status
  - Urgent blockers

- **End-of-Day Review (5:00 PM):** 15 minutes
  - Demo progress
  - Tomorrow's plan
  - Celebrate wins

---

## 7.2 Communication Protocols

### Tools & Channels

**Slack/Discord Channels:**
- `#general` - Team-wide announcements
- `#frontend` - Frontend team coordination
- `#backend` - Backend team coordination
- `#bugs` - Bug reports and fixes
- `#deployment` - Deployment notifications
- `#random` - Social/off-topic

**GitHub:**
- Issues for bug tracking
- Pull Requests for code review
- Discussions for architecture decisions
- Wiki for documentation

**Video Calls:**
- Zoom/Google Meet for standups
- Screen sharing for debugging
- Pair programming sessions

---

### Response Time Expectations

| Channel | Response Time |
|---------|--------------|
| Critical bugs (Slack @channel) | < 15 minutes |
| Direct message | < 30 minutes |
| Pull request review | < 2 hours |
| General question | < 4 hours |
| Documentation update | < 24 hours |

---

## 7.3 Version Control Workflow

### Branch Strategy

```
main (production)
  │
  ├── dev (integration)
  │   │
  │   ├── feature/auth-system (Person 1)
  │   ├── feature/task-ui (Person 2)
  │   ├── feature/api-routes (Person 3)
  │   ├── feature/ai-verification (Person 4)
  │   └── feature/deployment (Person 5)
  │
  └── hotfix/critical-bug (as needed)
```

### Git Workflow

**1. Create Feature Branch:**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/task-creation
```

**2. Make Changes:**
```bash
# Make your changes
git add .
git commit -m "[FRONTEND] Add task creation form with validation"
```

**3. Push to Remote:**
```bash
git push origin feature/task-creation
```

**4. Create Pull Request:**
```
Title: [FRONTEND] Add task creation form
Description:
- Implemented TaskForm component
- Added Zod validation
- Connected to API
- Added loading states

Closes #15
```

**5. Code Review:**
- At least 1 approval required
- Address review comments
- Update PR if needed

**6. Merge to Dev:**
```bash
# After approval
git checkout dev
git merge --no-ff feature/task-creation
git push origin dev
```

**7. Deploy to Staging:**
- Automatic via CI/CD
- Test on staging environment

**8. Merge to Main:**
```bash
# After testing on dev
git checkout main
git merge --no-ff dev
git push origin main
```

**9. Deploy to Production:**
- Automatic via CI/CD
- Monitor deployment
- Verify functionality

---

### Commit Message Convention

**Format:**
```
[TYPE] Brief description

Detailed explanation (optional)
- Bullet point 1
- Bullet point 2

Related Issue: #123
```

**Types:**
- `[FRONTEND]` - Frontend changes
- `[BACKEND]` - Backend changes
- `[DATABASE]` - Database changes
- `[AI]` - AI/ML changes
- `[DEVOPS]` - Infrastructure/deployment
- `[FIX]` - Bug fixes
- `[DOCS]` - Documentation
- `[TEST]` - Tests
- `[REFACTOR]` - Code refactoring

**Examples:**
```bash
git commit -m "[FRONTEND] Add real-time feed updates"

git commit -m "[BACKEND] Implement AI verification endpoint

- Created OpenAI service
- Added confidence scoring
- Integrated with submissions controller

Related Issue: #42"

git commit -m "[FIX] Resolve authentication token expiration issue"
```

---

## 7.4 Code Review Guidelines

### Review Checklist

**Functionality:**
- [ ] Code works as described
- [ ] No obvious bugs
- [ ] Edge cases handled
- [ ] Error handling present

**Code Quality:**
- [ ] Follows style guidelines
- [ ] No code duplication
- [ ] Functions are focused
- [ ] Variables named clearly

**TypeScript:**
- [ ] Proper types used
- [ ] No `any` types
- [ ] Interfaces defined
- [ ] Type errors resolved

**Testing:**
- [ ] Manual testing completed
- [ ] Key flows tested
- [ ] Error cases tested

**Documentation:**
- [ ] Code comments added
- [ ] README updated if needed
- [ ] API docs updated

**Security:**
- [ ] No sensitive data exposed
- [ ] Input validation present
- [ ] Authentication checked
- [ ] SQL injection prevented

---

### Review Response Time

**Priority Levels:**
| Priority | Description | Review SLA |
|----------|-------------|-----------|
| P0 | Critical fix | 15 minutes |
| P1 | Important feature | 1 hour |
| P2 | Standard change | 2 hours |
| P3 | Minor improvement | 4 hours |

---

## 7.5 Risk Mitigation

### Identified Risks

**1. API Rate Limits**
- **Risk:** OpenAI API rate limits reached
- **Impact:** Verification stops working
- **Mitigation:**
  - Monitor usage closely
  - Implement caching
  - Add retry logic with backoff
  - Have manual review as fallback

**2. Database Performance**
- **Risk:** Supabase free tier limits hit
- **Impact:** Slow queries, failed writes
- **Mitigation:**
  - Optimize queries early
  - Add indexes
  - Monitor database size
  - Ready to upgrade if needed

**3. Team Member Unavailable**
- **Risk:** Key person becomes unavailable
- **Impact:** Feature blocked, deadline missed
- **Mitigation:**
  - Cross-train team members
  - Document critical code
  - Pair programming
  - Clear handoff procedures

**4. Deployment Failure**
- **Risk:** Production deployment breaks
- **Impact:** App down, no demo
- **Mitigation:**
  - Deploy early and often
  - Test on staging first
  - Have rollback plan
  - Keep previous version accessible

**5. Scope Creep**
- **Risk:** Adding too many features
- **Impact:** MVP not complete in time
- **Mitigation:**
  - Stick to defined features
  - Defer nice-to-haves
  - Time-box exploration
  - Focus on demo impact

**6. Integration Issues**
- **Risk:** Frontend-backend mismatch
- **Impact:** Features don't work together
- **Mitigation:**
  - Define API contracts early
  - Regular integration testing
  - Use TypeScript for type safety
  - Frequent communication

---

# VIII. APPENDICES

## Appendix A: Environment Variables Reference

### Complete Environment Variables

**Frontend Production (.env.production):**
```env
# API Configuration
VITE_API_URL=https://streaks-backend-xyz123.run.app

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4OTY4MDAsImV4cCI6MTk5NDQ3MjgwMH0.signature

# Application Configuration
VITE_APP_NAME=Streaks
VITE_APP_VERSION=1.0.0
```

**Backend Production (Cloud Run):**
```env
# Server Configuration
PORT=8080
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODg5NjgwMCwiZXhwIjoxOTk0NDcyODAwfQ.signature

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-vision-preview

# CORS Configuration
FRONTEND_URL=https://streaks-app.vercel.app
ALLOWED_ORIGINS=https://streaks-app.vercel.app,https://streaks-staging.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## Appendix B: Quick Reference Commands

### Development Commands

**Frontend:**
```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

**Backend:**
```bash
# Install dependencies
cd backend && npm install

# Start development server (with auto-reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type check
npm run type-check
```

---

### Deployment Commands

**Backend (Google Cloud Run):**
```bash
# Quick deploy
gcloud run deploy streaks-backend --source .

# Deploy with specific configuration
gcloud run deploy streaks-backend \
  --source . \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# View service details
gcloud run services describe streaks-backend

# View logs
gcloud logging tail "resource.type=cloud_run_revision"

# Delete service
gcloud run services delete streaks-backend
```

**Frontend (Vercel):**
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployments
vercel ls

# View logs
vercel logs

# Roll back deployment
vercel rollback
```

---

### Database Commands

**Supabase (via SQL Editor):**
```sql
-- View all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check row counts
SELECT 
  schemaname,
  relname as table_name,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- View active connections
SELECT * FROM pg_stat_activity;

-- Reset a user's score (for testing)
UPDATE profiles 
SET score = 0, streak_count = 0 
WHERE username = 'testuser';

-- View pending submissions
SELECT 
  s.*,
  t.title as task_title,
  p.username
FROM submissions s
JOIN tasks t ON s.task_id = t.id
JOIN profiles p ON s.user_id = p.id
WHERE s.ai_confidence < 0.8 
AND s.human_verified IS NULL;
```

---

### Git Commands

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# View changed files
git status

# Add all changes
git add .

# Commit with message
git commit -m "[TYPE] Message"

# Push to remote
git push origin feature/new-feature

# Pull latest changes
git pull origin dev

# Merge branch
git checkout dev
git merge feature/new-feature

# Delete local branch
git branch -d feature/new-feature

# Delete remote branch
git push origin --delete feature/new-feature

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

---

## Appendix C: Troubleshooting Guide

### Common Issues & Solutions

**1. CORS Errors**

**Problem:**
```
Access to fetch at 'https://api...' from origin 'https://frontend...' 
has been blocked by CORS policy
```

**Solution:**
```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',           // Development
    'https://streaks-app.vercel.app',  // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

**2. Supabase RLS Blocking Queries**

**Problem:**
```
new row violates row-level security policy for table "tasks"
```

**Solution:**
```sql
-- Temporarily disable RLS for debugging
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- OR fix the policy
CREATE POLICY "tasks_insert_policy"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

---

**3. OpenAI Rate Limits**

**Problem:**
```
Rate limit exceeded
```

**Solution:**
```typescript
// Add exponential backoff retry
async function verifyWithRetry(
  title: string,
  description: string,
  imageUrl: string,
  maxRetries = 3
): Promise<VerificationResult> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await verifyTaskCompletion(title, description, imageUrl);
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        // Wait exponentially: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

**4. Image Upload Failures**

**Problem:**
```
Storage error: new row violates row-level security policy
```

**Solution:**
```sql
-- Check storage policies
SELECT * FROM storage.objects WHERE bucket_id = 'task-proofs';

-- Fix storage policy
CREATE POLICY "task_proofs_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

**5. Cloud Run Cold Starts**

**Problem:**
Slow initial response (5+ seconds)

**Solution:**
```bash
# Option 1: Set minimum instances (costs money)
gcloud run services update streaks-backend \
  --min-instances 1

# Option 2: Implement health check endpoint
# backend/src/routes/health.routes.ts
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

# Option 3: Scheduled ping (Cloud Scheduler)
# Keep instance warm with periodic requests
```

---

**6. TypeScript Build Errors**

**Problem:**
```
error TS2345: Argument of type 'string | undefined' 
is not assignable to parameter of type 'string'
```

**Solution:**
```typescript
// Use type guards
const apiUrl = process.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error('VITE_API_URL not configured');
}
// Now apiUrl is definitely a string

// OR use non-null assertion (less safe)
const apiUrl = process.env.VITE_API_URL!;
```

---

**7. Real-Time Updates Not Working**

**Problem:**
Real-time subscriptions not firing

**Solution:**
```typescript
// Ensure Realtime is enabled in Supabase dashboard
// Database → Replication → Enable Realtime for tables

// Check subscription setup
const subscription = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts',
    },
    (payload) => {
      console.log('New post:', payload.new);
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });

// Don't forget to unsubscribe on cleanup
return () => {
  subscription.unsubscribe();
};
```

---

**8. Authentication Token Expiration**

**Problem:**
```
JWT expired
```

**Solution:**
```typescript
// Implement token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Token automatically refreshed
    console.log('Token refreshed');
  }
  
  if (event === 'SIGNED_OUT') {
    // Redirect to login
    window.location.href = '/login';
  }
});

// Add axios interceptor for 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const { data, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (!refreshError && data.session) {
        // Retry original request with new token
        error.config.headers.Authorization = 
          `Bearer ${data.session.access_token}`;
        return axios.request(error.config);
      }
      
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Appendix D: Resources & Documentation

### Official Documentation

**Frameworks & Libraries:**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com/en/guide
- Vite: https://vitejs.dev/guide

**Services:**
- Supabase: https://supabase.com/docs
- OpenAI API: https://platform.openai.com/docs
- Google Cloud Run: https://cloud.google.com/run/docs
- Vercel: https://vercel.com/docs

**UI/Styling:**
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com
- Lucide Icons: https://lucide.dev

**State & Data:**
- Zustand: https://github.com/pmndrs/zustand
- React Router: https://reactrouter.com
- Axios: https://axios-http.com/docs
- Zod: https://zod.dev

---

### Learning Resources

**React & TypeScript:**
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript

**Backend Development:**
- Express Best Practices: https://expressjs.com/en/advanced/best-practice-performance.html
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

**Database:**
- PostgreSQL Tutorial: https://www.postgresqltutorial.com
- Supabase University: https://supabase.com/docs/guides/getting-started

**Deployment:**
- Cloud Run Quickstart: https://cloud.google.com/run/docs/quickstarts
- Vercel Deployment: https://vercel.com/docs/deployments/overview

---

### Community & Support

**Discord/Slack Communities:**
- Supabase Discord: https://discord.supabase.com
- Reactiflux (React): https://www.reactiflux.com

**Stack Overflow Tags:**
- [react] [typescript]
- [node.js] [express]
- [supabase]
- [google-cloud-run]

**GitHub Repositories:**
- Project Repository: https://github.com/your-team/streaks-app
- Issue Tracker: https://github.com/your-team/streaks-app/issues

---

### AI & Prompt Engineering

**OpenAI Resources:**
- Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
- Vision API Quickstart: https://platform.openai.com/docs/guides/vision
- Best Practices: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering

**Prompt Examples:**
- OpenAI Cookbook: https://github.com/openai/openai-cookbook

---

## FINAL CHECKLIST

### Pre-Hackathon
- [ ] GitHub repository created
- [ ] All team members have access
- [ ] Supabase account setup
- [ ] Google Cloud project created
- [ ] OpenAI API key obtained
- [ ] Vercel account linked
- [ ] Development tools installed
- [ ] Team roles assigned
- [ ] Communication channels setup
- [ ] Project plan reviewed

### Day 1 End
- [ ] Authentication working
- [ ] Tasks CRUD functional
- [ ] AI verification operational
- [ ] Real-time feed live
- [ ] Deployed to staging
- [ ] No critical bugs
- [ ] Team aligned on Day 2 priorities

### Day 2 End
- [ ] All features complete
- [ ] Deployed to production
- [ ] Demo data seeded
- [ ] Pitch deck ready
- [ ] Demo video recorded
- [ ] README updated
- [ ] Code documented
- [ ] Known issues listed
- [ ] Team ready to present

---

**END OF DOCUMENTATION**

This comprehensive project plan provides complete guidance for building Streaks from architecture through deployment. All team members should reference this document throughout the hackathon for technical specifications, best practices, and troubleshooting assistance.

**Good luck building Streaks! 🚀**
