# Streaks UI Design Plan

## Project Context
- **Type**: Productivity Social Media Platform with AI verification
- **Stack**: React + TypeScript + Shadcn/ui + Tailwind CSS
- **Target**: Broad audience (students, fitness, productivity, teams)
- **Style**: Modern Minimal (Linear/Notion-inspired)
- **Theme**: Dark mode default, light mode available

---

## Design System Foundation

### 1. Color Palette

**Dark Mode (Default)**
```
Background:
- bg-primary: #0A0A0B (near-black)
- bg-secondary: #141415 (card backgrounds)
- bg-tertiary: #1C1C1E (elevated surfaces)

Text:
- text-primary: #FAFAFA (main text)
- text-secondary: #A1A1AA (muted text)
- text-tertiary: #71717A (subtle text)

Accent:
- accent-primary: #6366F1 (indigo - main brand)
- accent-success: #22C55E (verified/completed)
- accent-warning: #F59E0B (pending/streak)
- accent-error: #EF4444 (failed/error)
- accent-info: #3B82F6 (info/links)

Borders:
- border-default: #27272A
- border-hover: #3F3F46
```

**Light Mode**
```
Background:
- bg-primary: #FFFFFF
- bg-secondary: #F9FAFB
- bg-tertiary: #F3F4F6

Text:
- text-primary: #111827
- text-secondary: #6B7280
- text-tertiary: #9CA3AF

Accent: (same as dark mode)
Borders:
- border-default: #E5E7EB
- border-hover: #D1D5DB
```

### 2. Typography
```
Font Family: Inter (primary), system-ui fallback
Sizes:
- h1: 2.25rem (36px) - Page titles
- h2: 1.5rem (24px) - Section headers
- h3: 1.25rem (20px) - Card titles
- body: 1rem (16px) - Main content
- small: 0.875rem (14px) - Meta info
- xs: 0.75rem (12px) - Labels/badges
```

### 3. Spacing & Layout
```
Border Radius:
- sm: 6px (buttons, inputs)
- md: 8px (cards)
- lg: 12px (modals, larger cards)
- full: 9999px (avatars, badges)

Spacing Scale: 4px base (4, 8, 12, 16, 24, 32, 48, 64)
```

---

## Component Library (Shadcn/ui + Custom)

### Core Components to Build/Configure

1. **Button** - Primary, Secondary, Ghost, Destructive variants
2. **Card** - Task cards, feed items, group cards
3. **Input** - Text, textarea with validation states
4. **Avatar** - User avatars with fallback initials
5. **Badge** - Status, difficulty, verification badges
6. **Progress** - Streak progress, score bars
7. **Modal/Dialog** - Task creation, submission, confirmations
8. **Dropdown** - User menu, filters, actions
9. **Toast** - Notifications, success/error feedback
10. **Skeleton** - Loading states for all cards

---

## Page Designs

### 1. Authentication Pages

**Login Page**
- Centered card layout
- Logo + tagline at top
- Email/password inputs
- "Sign in" primary button
- "Create account" link
- Social auth buttons (Google, GitHub)
- Minimal, clean aesthetic

**Signup Page**
- Same layout as login
- Additional: username, display name fields
- Password strength indicator
- Terms acceptance checkbox

### 2. Dashboard (Home)

**Layout**: Sidebar (collapsible) + Main content

**Components**:
- **Stats Overview** (top)
  - Current score (large number)
  - Current streak (fire icon + days)
  - Tasks completed today
  - Rank position

- **Active Tasks** (main section)
  - TaskCard grid (2-3 columns)
  - Each card shows: title, difficulty badge, deadline countdown, progress
  - Quick action: "Submit Proof" button

- **Recent Activity** (sidebar or below)
  - Timeline of recent submissions
  - Quick wins from followed users

### 3. Tasks Page

**Views**: Grid / List toggle

**TaskCard Design**:
```
┌─────────────────────────────────┐
│ [Difficulty Badge]    [Deadline]│
│                                 │
│ Task Title                      │
│ Description preview...          │
│                                 │
│ ─────────────────────────────── │
│ [Submit Proof]  [Edit] [Delete] │
└─────────────────────────────────┘
```

**Difficulty Badges**:
- Easy (0.5-1.0): Green badge
- Medium (1.0-1.5): Yellow badge
- Hard (1.5-2.5): Orange badge
- Extreme (2.5-3.0): Red badge

**Create Task Modal**:
- Title input
- Description textarea
- Difficulty slider (visual)
- Deadline picker
- Group selector (optional)

### 4. Submission Flow

**Proof Upload Component**:
- Drag & drop zone
- Camera capture option (mobile)
- Preview with crop capability
- File size/type validation UI

**Verification Status Display**:
```
┌─────────────────────────────────┐
│ ◉ Verifying...                  │  (Spinner state)
│ ✓ Verified (95% confidence)     │  (Success state)
│ ⚠ Needs Review (62% confidence) │  (Pending state)
│ ✗ Not Verified                  │  (Failed state)
└─────────────────────────────────┘
```

**Score Breakdown Modal**:
- Base points
- Difficulty multiplier
- Group multiplier
- Streak bonus
- Total = animated reveal

### 5. Feed Page

**Feed Item Design**:
```
┌─────────────────────────────────┐
│ [Avatar] Username    • 2h ago   │
│                                 │
│ Completed: "Task Title"         │
│ +150 points | 🔥 7 day streak   │
│                                 │
│ [Proof Image - clickable]       │
│                                 │
│ ♡ 12  💬 3   [Share]           │
└─────────────────────────────────┘
```

**Feed Filters**:
- All / Following / Groups
- Time period dropdown

### 6. Groups Page

**Group Card**:
```
┌─────────────────────────────────┐
│ Group Name              [Join]  │
│ 🔓 Public | 24 members          │
│ 1.5x score multiplier           │
│                                 │
│ "Group description..."          │
└─────────────────────────────────┘
```

**Group Detail Page**:
- Header with group info
- Member leaderboard
- Group feed
- Settings (for admins)

### 7. Leaderboard Page

**Design**:
- Tab navigation: Global / Weekly / Groups
- Top 3: Special podium design
- List below with rank, avatar, name, score, streak
- Current user highlighted if in list
- "Your Rank" card at top if not in visible range

### 8. Profile Page

**Layout**:
```
┌─────────────────────────────────────────┐
│ [Avatar]  Display Name    [Edit]        │
│ @username                               │
│ "Bio text..."                           │
│                                         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │Score│ │Streak│ │Tasks│ │Groups│       │
│ │2,450│ │🔥 12 │ │ 47  │ │  3  │        │
│ └─────┘ └─────┘ └─────┘ └─────┘        │
│                                         │
│ [Follow]  [Message]                     │
├─────────────────────────────────────────┤
│ Tab: Activity | Tasks | Groups          │
│                                         │
│ [List of submissions/tasks/groups]      │
└─────────────────────────────────────────┘
```

---

## Navigation Structure

### Sidebar (Desktop)
```
[Logo]

Dashboard
Tasks
Feed
Groups
Leaderboard

──────────
Profile
Settings
```

### Bottom Nav (Mobile)
```
[Home] [Tasks] [+Submit] [Feed] [Profile]
```

---

## Animations & Micro-interactions

1. **Score increment**: Counter animation when points awarded
2. **Streak fire**: Pulse animation on active streaks
3. **Card hover**: Subtle lift + shadow
4. **Verification spinner**: Custom branded spinner
5. **Success confetti**: Optional on task completion
6. **Page transitions**: Fade/slide between routes
7. **Skeleton loading**: Smooth content reveal

---

## Theme Toggle

- Icon button in navbar (sun/moon)
- Smooth CSS transition on toggle
- Persist preference in localStorage
- Respect system preference on first load

---

## Implementation Order (TODO)

### Phase 1: Foundation
- [ ] Set up Tailwind config with color palette
- [ ] Configure Shadcn/ui with dark theme
- [ ] Create theme provider & toggle
- [ ] Set up typography & base styles
- [ ] Build core reusable components (Button, Card, Input, Avatar, Badge)

### Phase 2: Layout
- [ ] Create app shell (Sidebar + Main)
- [ ] Build responsive Navbar
- [ ] Build collapsible Sidebar
- [ ] Build mobile bottom navigation
- [ ] Create page wrapper component

### Phase 3: Auth Pages
- [ ] Login page
- [ ] Signup page
- [ ] Auth forms with validation UI

### Phase 4: Dashboard
- [ ] Stats overview cards
- [ ] Active tasks section
- [ ] Recent activity feed

### Phase 5: Task Management
- [ ] TaskCard component
- [ ] TaskList with grid/list views
- [ ] Create/Edit task modal
- [ ] Task detail view

### Phase 6: Submission Flow
- [ ] Proof upload component
- [ ] Verification status display
- [ ] Score breakdown modal

### Phase 7: Social Features
- [ ] Feed page & FeedItem
- [ ] Groups page & GroupCard
- [ ] Group detail page
- [ ] Leaderboard page

### Phase 8: Profile
- [ ] Profile page layout
- [ ] Edit profile modal
- [ ] User stats display
- [ ] Activity history

### Phase 9: Polish
- [ ] Loading skeletons everywhere
- [ ] Error states
- [ ] Empty states
- [ ] Toast notifications
- [ ] Animations & transitions
- [ ] Responsive testing

---

## Files to Create

```
src/
├── styles/
│   └── globals.css (Tailwind + theme variables)
├── lib/
│   └── theme-provider.tsx
├── components/
│   ├── ui/ (Shadcn components)
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   │   ├── StatsOverview.tsx
│   │   └── RecentActivity.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── submissions/
│   │   ├── ProofUpload.tsx
│   │   ├── VerificationStatus.tsx
│   │   └── ScoreBreakdown.tsx
│   ├── feed/
│   │   ├── FeedItem.tsx
│   │   └── FeedList.tsx
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   └── GroupList.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   └── RankCard.tsx
│   └── profile/
│       ├── ProfileHeader.tsx
│       └── UserStats.tsx
└── pages/
    ├── Login.tsx
    ├── Signup.tsx
    ├── Dashboard.tsx
    ├── Tasks.tsx
    ├── Feed.tsx
    ├── Groups.tsx
    ├── GroupDetail.tsx
    ├── Leaderboard.tsx
    └── Profile.tsx
```

---

## Verification Checklist

- [ ] Dark mode is default and renders correctly
- [ ] Light mode toggle works smoothly
- [ ] All pages are responsive (mobile/tablet/desktop)
- [ ] Loading states show skeletons
- [ ] Error states are user-friendly
- [ ] Empty states guide users
- [ ] Forms validate and show errors properly
- [ ] Navigation is intuitive
- [ ] Theme persists across sessions
