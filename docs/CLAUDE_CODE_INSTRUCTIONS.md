# SiteForge AI - Claude Code Build Instructions

## Executive Overview

**Project:** SiteForge AI - AI-powered Project Management Assistant for Construction
**Pilot Client:** Barhale / Thames Water on J676 Manor Road NOS Bridge
**Project Owner:** Billy Kin Pang (Pang & Chiu)
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, NextAuth.js, Prisma + SQLite, Anthropic Claude API
**Objective:** Build a PM assistant webapp that manages 43 AI-generated documents across 6 categories for civil engineering projects.

---

## 1. PROJECT CONTEXT

### 1.1 What is SiteForge AI?

SiteForge AI is a **Project Management assistant webapp** designed specifically for construction project managers. It:

- **Manages AI-generated documents** — 43 pre-built PM documents in 6 categories (Planning, H&S, Engineering, Commercial, Quality, Handover)
- **Serves on-site PMs** — Must work on phones, tablets, and desktops for fieldwork
- **Integrates with Anthropic Claude API** — Parses project briefs, generates personalised documents via templates
- **Tracks document status** — Draft, In Review, Approved, Issued lifecycle
- **Provides PM dashboard** — KPIs, constraints heatmap, programme timeline, change register, completion tracking

### 1.2 Pilot Project Context

**Project Name:** J676.02 Manor Road NOS Bridge
**Client:** Thames Water / Barhale
**Contract:** FA1495
**Scope Elements:**
- NOS07 (Rail Spans)
- NOS08 (Road Span)

**Key Site Constraints (these influence document generation):**
- LUL/DLR track access (strict hours)
- LB Newham road closures (coordination required)
- 5x sewer barrel isolation (3 must stay live — critical sequencing)
- HV cable exclusion zones
- Asbestos sludge main (environmental compliance)

These constraints appear in H&S, Engineering, and Commercial documents automatically.

---

## 2. TECHNOLOGY STACK

### 2.1 Frontend
- **Next.js 14** with App Router (`src/app/` directory structure)
- **TypeScript** (strict mode)
- **React 19**
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** (pre-built accessible components)
- **mammoth.js** (convert `.docx` to HTML for in-browser viewing)

### 2.2 Backend
- **Next.js API Routes** (`src/app/api/`)
- **NextAuth.js** (credentials provider for dev/demo)
- **Prisma ORM** (all database access)
- **SQLite** (local development database)
- **docx library** (generate `.docx` files programmatically)
- **Anthropic Claude API** (document generation, prompt parsing)

### 2.3 Database
- **Prisma schema** with models:
  - `User` (email, password hash, role: ADMIN/PM/VIEWER)
  - `Project` (projectCode, name, client, status)
  - `Document` (category, docCode, title, status, fileContent as Bytes, createdAt, updatedAt)
  - `DocumentTemplate` (category, docCode, prompt template, variables)
  - `GenerationJob` (status, batchId, createdAt, completedAt)

### 2.4 External APIs
- **Anthropic Claude API** — Document generation, prompt analysis
- (Optional future) **Slack** — Notifications
- (Optional future) **Azure Blob Storage** — Document archival

---

## 3. DESIGN REQUIREMENTS

### 3.1 Brand Colours

```
Primary Navy:      #1F4E79 (Pang & Chiu brand)
Accent Blue:       #2E75B6 (Construction professional)
Background Dark:   #0F172A (Dark mode base)
Text Light:        #F1F5F9 (Dark mode text)
Success Green:     #10B981
Warning Amber:     #F59E0B
Error Red:         #EF4444
Border Gray:       #334155
```

### 3.2 Design Aesthetic

- **Professional construction office look** — clean, structured, minimal
- Inspired by modern on-site document management systems
- **Sidebar navigation** (desktop) with project/document tree
- **Mobile hamburger menu** with full-screen nav
- **Card-based layouts** for documents, KPIs, timeline items
- **Status badges** with distinct colours (Draft=gray, In Review=amber, Approved=green, Issued=blue)
- **Dark mode by default** (construction sites are often outdoors; light-sensitive)

### 3.3 Mobile-First Responsive Design

**Breakpoints:**
- Mobile: < 640px (phones, touch-first)
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Touch Targets:**
- Minimum 44px × 44px (buttons, taps, menu items)
- Spacing: 16px minimum padding on touch elements

**Responsive Rules:**
- Sidebar collapses to hamburger on mobile
- Document list is full-width on mobile
- KPI cards stack vertically on mobile, 2-col on tablet, 3-col on desktop
- Timeline rotates to vertical on mobile

### 3.4 Dark Mode Support

- Use `dark:` Tailwind utilities throughout
- Default to dark mode (construction aesthetic)
- Light mode toggle in settings (optional)
- Persist user preference in localStorage

### 3.5 PWA (Progressive Web App)

- Add `/public/manifest.json` for mobile install
- Service worker for offline support (cache documents)
- Install prompt on iOS/Android
- App icon (192px and 512px)
- Splash screen colour = #0F172A

---

## 4. BUILD PHASES

**Important:** Follow this phase order strictly. Each phase builds on the previous one.

### PHASE 1: Foundation (Days 1–2)

**Deliverable:** Authenticated, responsive layout with login, protected routes, role-based access, project selector, database schema.

**Tasks:**

1. **Project Setup**
   - Create Next.js 14 project with App Router
   - Install dependencies: typescript, tailwind, shadcn/ui, next-auth, prisma, sqlite, mammoth, docx, anthropic
   - Configure `tsconfig.json` (strict mode)
   - Configure `tailwind.config.js` with custom brand colours

2. **Prisma & Database**
   - Create `.env.local`: `DATABASE_URL="file:./dev.db"`
   - Write `prisma/schema.prisma` with models:
     - `User` (id, email, passwordHash, role enum, createdAt)
     - `Project` (id, projectCode, name, client, description, status, createdAt)
     - `Document` (id, projectId, category, docCode, title, status, fileContent as Bytes, version, createdAt, updatedAt)
     - `DocumentTemplate` (id, category, docCode, name, promptTemplate, variables as JSON, createdAt)
     - `GenerationJob` (id, projectId, batchId, status, docsGeneratedCount, createdAt, completedAt)
   - Run `prisma migrate dev --name init`
   - Seed database with test user + test project + one test document

3. **NextAuth.js Setup**
   - Create `src/app/api/auth/[...nextauth]/route.ts`
   - Configure credentials provider (dev only)
   - Add default users:
     - `admin@pangandchiu.com` / `siteforge2026` (ADMIN)
     - `viewer@barhale.co.uk` / `barhale2026` (VIEWER)
   - Add PM user: `pm@barhale.co.uk` / `barhale2026` (PM)
   - Hash passwords (bcrypt)
   - Set session secret in `.env.local`

4. **Responsive Layout**
   - Create layout components:
     - `src/components/layout/Sidebar.tsx` — Project tree, nav links (responsive: hamburger on mobile)
     - `src/components/layout/TopBar.tsx` — Logo, user profile, project selector
     - `src/components/layout/MobileNav.tsx` — Full-screen mobile menu (slide-in from left)
   - Create `src/app/layout.tsx` (root layout) — Sidebar + main content area
   - Add Tailwind dark mode classes globally
   - Mobile hamburger menu: toggle state in client component

5. **Authentication Pages**
   - Create `src/app/login/page.tsx` — Login form (email/password)
   - Create `src/app/auth/error/page.tsx` — Auth error display
   - Create middleware (`src/middleware.ts`) — Redirect unauthenticated users to `/login`
   - Protected route: `/dashboard` (requires session)

6. **Project Selector**
   - Create dropdown/modal in TopBar for project selection
   - Store `projectId` in NextAuth session context
   - Fetch projects from Prisma on page load (server component)
   - Update active project indicator in sidebar

7. **Basic Dashboard Placeholder**
   - Create `src/app/dashboard/page.tsx` — Placeholder "Welcome to SiteForge AI"
   - Display active project name and code
   - Link to Documents, Settings

**Success Criteria:**
- Login works with credentials
- Authenticated users see dashboard
- Unauthenticated users redirected to login
- Sidebar responsive (hamburger on mobile)
- Project selector functional
- Database seeded and migrations run
- No TypeScript errors

---

### PHASE 2: Document Library (Days 3–4)

**Deliverable:** Full document management UI — folder tree by category, document viewer with mammoth.js, download, bulk zip, status lifecycle.

**Tasks:**

1. **Document Folder Structure UI**
   - Create `src/components/DocumentTree.tsx` — Hierarchical tree view
   - Structure: 6 categories (Planning, H&S, Engineering, Commercial, Quality, Handover)
   - Each category shows N documents with status badges
   - Clicking a document opens viewer
   - Expand/collapse categories

2. **Document Viewer Component**
   - Create `src/components/DocumentViewer.tsx` — Renders `.docx` content
   - Use `mammoth.js` to convert binary Bytes from DB to HTML
   - Display title, status, version, created/updated dates
   - Show in a card or modal with proper spacing
   - Handle missing/corrupted files gracefully

3. **Document List Page**
   - Create `src/app/dashboard/documents/page.tsx`
   - Display all documents in active project
   - Filter by category (tabs or dropdown)
   - Filter by status (Draft, In Review, Approved, Issued)
   - Search by title/code
   - Sort by date, status, category
   - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

4. **Document Actions**
   - **Download Button** — Download selected document as `.docx` file
   - **Bulk Download** — Select multiple documents, generate ZIP, download
   - **View Details** — Modal showing full metadata, revision history
   - **Status Badge** — Visual indicator (Draft=gray, In Review=amber, Approved=green, Issued=blue)

5. **Database Seed: 43 Documents**
   - Seed `DocumentTemplate` with all 43 document codes:
     - Planning (PL-001 to PL-006): Site Plan, Methodology, Schedule, H&S Plan, Quality Plan, Traffic Management
     - H&S (HS-001 to HS-008): Risk Assessment, Method Statements, Induction Checklist, Incident Log, Welfare Plan, Noise/Dust Control, Environmental, Asbestos Management
     - Engineering (EN-001 to EN-008): Calculations, Drawings Register, Inspection Schedule, Material Certs, As-Built Register, Commissioning Plan, Testing Plan, Design Changes
     - Commercial (CM-001 to CM-006): Contract Summary, Payment Schedule, Change Register, Procurement Schedule, Subcontractor List, Performance Metrics
     - Quality (QA-001 to QA-007): QA Plan, Inspection Plan, Test Reports, Defect Register, Compliance Checklist, Audit Schedule, Lessons Learned
     - Handover (HO-001 to HO-008): O&M Manuals, Asset Register, Training Records, Defects List, Final Accounts, Warranties, Maintenance Schedule, As-Fitted Drawings
   - Seed 5–10 sample documents with dummy `.docx` content (use docx library to create minimal test files)
   - Assign various statuses (Draft, In Review, Approved, Issued)

6. **API Routes for Documents**
   - `GET /api/documents?projectId=...&category=...` — List documents
   - `GET /api/documents/:id/download` — Download single document
   - `POST /api/documents/zip` — Bulk download (body: `docIds[]`)
   - `PATCH /api/documents/:id` — Update status/metadata (ADMIN only)

7. **Error Handling**
   - Graceful fallback if document rendering fails
   - Toast notifications for download success/failure
   - Loading skeleton while fetching documents

**Success Criteria:**
- All 43 document codes appear in seed
- Document list displays in grid (responsive)
- Clicking document opens viewer
- Status badges render correctly
- Download single document works
- Bulk download creates ZIP
- Filter/search functional
- No mammoth.js errors when rendering docx
- Mobile layout responsive

---

### PHASE 3: Dashboard (Days 5–6)

**Deliverable:** PM dashboard with KPIs, constraints heatmap, programme timeline, change register, completion tracker. All fully responsive.

**Tasks:**

1. **Dashboard Layout**
   - Create `src/app/dashboard/page.tsx` (replace placeholder)
   - Grid layout: 4 cols on desktop, 2 on tablet, 1 on mobile
   - Sections: KPIs (top), Timeline (middle), Constraints Heatmap (middle), Change Register (bottom)

2. **KPI Cards Component**
   - Create `src/components/KPICard.tsx`
   - Display:
     - Total Documents: 43
     - Approved: X (green badge)
     - In Review: Y (amber badge)
     - Draft: Z (gray badge)
     - Compliance: X% (radial chart: green if >95%)
   - Calculate from DB (count documents by status)
   - Responsive: Full-width on mobile, 2 cols on tablet, 4 on desktop
   - Touch target: 44px minimum

3. **Constraints Heatmap**
   - Create `src/components/ConstraintsHeatmap.tsx`
   - Display 5 key constraints from project brief:
     - LUL/DLR track access (CRITICAL)
     - LB Newham road closures (HIGH)
     - Sewer barrel isolation / live stays (CRITICAL)
     - HV cable exclusion zones (HIGH)
     - Asbestos sludge main (CRITICAL)
   - Use colour coding: RED=CRITICAL, AMBER=HIGH, YELLOW=MEDIUM, GREEN=LOW
   - Table/grid layout, responsive to vertical on mobile

4. **Programme Timeline**
   - Create `src/components/ProgrammeTimeline.tsx`
   - Display mock project phases:
     - Phase 1: Mobilisation (Jan–Feb)
     - Phase 2: Sewer Isolation (Feb–Mar)
     - Phase 3: Road Works (Mar–May)
     - Phase 4: Rail Works (May–Jul)
     - Phase 5: Handover (Jul–Aug)
   - Show as vertical timeline on mobile, horizontal on desktop
   - Colour each phase (blue gradient)
   - Display current phase highlight

5. **Change Register**
   - Create `src/components/ChangeRegister.tsx`
   - Table with columns: Change ID, Description, Status, Impact, Created Date
   - Mock 5–10 changes (e.g., "Asbestos survey findings", "Road closure extended", "Schedule acceleration")
   - Paginate on mobile (show 3 per page), full list on desktop
   - Sortable by date, impact, status
   - Click row to view details (modal)

6. **Completion Radial Chart**
   - Create `src/components/CompletionChart.tsx`
   - Use recharts or similar for radial/donut chart
   - Show: Documents Approved (green), In Review (amber), Draft (gray)
   - Display percentage labels
   - Responsive sizing (smaller on mobile)

7. **API Routes for Dashboard**
   - `GET /api/dashboard/kpis?projectId=...` — Return document counts by status
   - `GET /api/dashboard/constraints?projectId=...` — Return constraint list with risk level
   - `GET /api/dashboard/timeline?projectId=...` — Return phases and dates
   - `GET /api/dashboard/changes?projectId=...&page=...` — Return paginated change register

8. **Real Data Integration**
   - Replace all mock data with actual DB queries (Prisma)
   - Calculate KPIs from Document counts
   - Constraints hardcoded for pilot (J676 specific), but structure for future projects

**Success Criteria:**
- Dashboard loads without errors
- KPI cards calculate correctly
- Constraints heatmap displays all 5 items
- Timeline shows phases (vertical on mobile, horizontal on desktop)
- Change register paginated, searchable
- Completion chart renders
- All responsive, no horizontal scroll
- Dark mode looks professional
- Touch targets >= 44px

---

### PHASE 4: AI Generation (Days 7–8)

**Deliverable:** Document generation UI — upload brief, template selection, batch generation with progress bar, generated documents saved to DB.

**Tasks:**

1. **Brief Upload Component**
   - Create `src/components/BriefUpload.tsx`
   - File input: accept `.docx`, `.pdf`, `.txt`
   - Drag-and-drop zone (touch-friendly on mobile)
   - Show file name, size validation (max 10MB)
   - Parse brief text using Claude API

2. **Template Selection UI**
   - Create `src/components/TemplateSelector.tsx`
   - Show all 43 document templates organized by category
   - Select/deselect templates (checkboxes or toggle)
   - Quick actions: "Select All in Category", "Select All", "Clear All"
   - Show document code, title, brief description
   - Responsive grid

3. **Generation Settings Component**
   - Create `src/components/GenerationSettings.tsx`
   - Options:
     - Tone (Professional, Formal, Concise)
     - Include sections (Risks, Compliance, Lessons Learned)
     - Output format (DOCX only for now)
     - Override project variables (optional)

4. **AI Generation Service**
   - Create `src/lib/ai/documentGenerator.ts` — Orchestrates Claude API calls
   - Function `generateDocuments(briefText, templates, projectContext, settings)`:
     - Call Claude API for each template
     - Prompt structure:
       ```
       You are a construction PM assistant. Generate a professional document.

       Project Context:
       - Name: J676.02 Manor Road NOS Bridge
       - Client: Thames Water / Barhale
       - Constraints: [list of 5]

       Document Type: [PL-001 Site Plan]
       Brief: [uploaded brief text]

       Generate a comprehensive [PL-001 Site Plan] document in docx-compatible markdown.
       Include: [tone, sections from settings]
       ```
     - Collect all responses
     - Convert each to `.docx` using `docx` library
     - Return `{ docCode, title, docxBytes, generatedAt }`
   - Error handling: Retry failed requests, log errors

5. **Progress Tracking**
   - Create `GenerationJob` record in Prisma when batch starts
   - Status progression: PENDING → GENERATING → COMPLETED / FAILED
   - `src/components/GenerationProgress.tsx` — Show progress bar
     - Displays: "3 of 10 documents generated..."
     - Polling API every 2 seconds
     - Real-time update using React state
   - On completion: Success message with download option

6. **API Routes for Generation**
   - `POST /api/documents/generate` (body: `{ briefText, templateIds[], projectId, settings }`)
     - Creates GenerationJob record
     - Returns `jobId`
     - Async processing (background job)
   - `GET /api/documents/generate/:jobId` — Return job status + progress
   - `POST /api/documents/generate/:jobId/cancel` — Cancel in-progress job

7. **Background Job Processing**
   - For MVP, use Next.js API route to process sequentially
   - Future: Move to queue (Bull, RabbitMQ)
   - Save generated documents to DB with status DRAFT
   - Update GenerationJob.docsGeneratedCount, status, completedAt

8. **Anthropic Claude API Integration**
   - Create `src/lib/anthropic/client.ts`:
     ```typescript
     import Anthropic from "@anthropic-ai/sdk";

     const client = new Anthropic({
       apiKey: process.env.ANTHROPIC_API_KEY,
     });

     export async function generateDocumentText(
       docTemplate: string,
       projectBrief: string,
       projectContext: ProjectContext
     ): Promise<string> {
       const message = await client.messages.create({
         model: "claude-3-5-sonnet-20241022",
         max_tokens: 4000,
         messages: [
           {
             role: "user",
             content: buildPrompt(docTemplate, projectBrief, projectContext),
           },
         ],
       });
       return message.content[0].type === "text" ? message.content[0].text : "";
     }
     ```
   - Add `ANTHROPIC_API_KEY` to `.env.local`

9. **Document Generation Flow Page**
   - Create `src/app/dashboard/generate/page.tsx`
   - Step 1: Upload brief (BriefUpload component)
   - Step 2: Select templates (TemplateSelector component)
   - Step 3: Configure settings (GenerationSettings component)
   - Step 4: Review & Generate (confirm button)
   - Step 5: Progress & Results (GenerationProgress component)
   - Navigation: prev/next buttons, progress indicator

10. **Error Handling & Validation**
    - Validate brief file size and type
    - Validate at least 1 template selected
    - Handle Claude API rate limits (backoff + retry)
    - Handle missing/malformed responses from Claude
    - Toast notifications for success/failure
    - Log all generation attempts to DB for audit

11. **Testing**
    - Test with mock brief: "J676 Manor Road bridge, 18-month programme, key constraint is live LUL track access"
    - Generate 5 documents, verify quality
    - Test cancellation mid-batch
    - Test with invalid brief (empty, corrupted)

**Success Criteria:**
- Brief upload accepts files (docx, pdf, txt)
- Template selection UI shows all 43 templates
- Generation starts and tracks progress
- Progress bar updates in real-time
- Generated documents appear in Document Library with DRAFT status
- Generated documents can be opened in viewer
- Claude API integration works without errors
- Error handling graceful
- Mobile layout responsive

---

### PHASE 5: Polish & Deploy (Days 9–10)

**Deliverable:** PWA setup, error boundaries, loading states, animations, deploy config, production hardening.

**Tasks:**

1. **PWA Setup**
   - Create `/public/manifest.json`:
     ```json
     {
       "name": "SiteForge AI",
       "short_name": "SiteForge",
       "start_url": "/",
       "display": "standalone",
       "background_color": "#0F172A",
       "theme_color": "#1F4E79",
       "icons": [
         { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
         { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
       ]
     }
     ```
   - Add manifest link to `src/app/layout.tsx`
   - Create service worker (`src/app/service-worker.ts`) for offline support
   - Cache: documents, UI bundle, API responses
   - Install prompt on iOS/Android

2. **Error Boundaries**
   - Create `src/components/ErrorBoundary.tsx` (React error boundary)
   - Wraps major sections (Dashboard, Documents, Generation)
   - Shows user-friendly error UI with retry button
   - Logs errors to console/monitoring service

3. **Loading States**
   - Add Tailwind `animate-pulse` skeleton loaders for:
     - Document list (grid of skeletons)
     - Dashboard KPIs (card skeletons)
     - Document viewer (paragraph skeletons)
   - Create `src/components/SkeletonLoader.tsx` reusable component

4. **Animations & Transitions**
   - Add Tailwind animations:
     - Sidebar slide-in/out (mobile)
     - Document card hover effects (shadow, scale)
     - Status badge transitions
     - Progress bar smooth update
   - Use `transition-all duration-300` on interactive elements
   - Fade-in document viewer content

5. **Dark Mode Refinement**
   - Test all components in dark mode
   - Ensure sufficient contrast (WCAG AA)
   - Refine colours for readability:
     - Navy #1F4E79 text on #0F172A background
     - Blue #2E75B6 accents on dark background
   - Add explicit dark: classes where needed

6. **Accessibility (A11y)**
   - Add ARIA labels to buttons, icons
   - Keyboard navigation on all dropdowns, modals
   - Focus indicators (ring on focus)
   - Test with screen reader (NVDA/JAWS)
   - Alt text on all images/icons

7. **Performance Optimization**
   - Image optimization (next/image component)
   - Code splitting (lazy load Pages, heavy components)
   - Minify CSS/JS (Next.js handles by default)
   - Optimize font loading (system fonts for mobile speed)
   - Database query optimization (Prisma select)

8. **Environment & Deployment Config**
   - Create `.env.example` with required vars
   - Update `.env.local` with production values:
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
     - `NEXTAUTH_URL=https://siteforge-ai.pangandchiu.com` (production)
     - `DATABASE_URL` (production database — update for PostgreSQL if scaling)
     - `ANTHROPIC_API_KEY`
   - Create `next.config.js` with optimization settings:
     ```javascript
     module.exports = {
       reactStrictMode: true,
       swcMinify: true,
       images: { unoptimized: false },
     };
     ```

9. **Production Deployment Options**
   - **Vercel** (recommended for Next.js):
     - Push to GitHub
     - Deploy on Vercel, connect repo
     - Set environment variables in Vercel dashboard
     - Auto-deploy on push to main
   - **Self-hosted** (Pang & Chiu server):
     - Build: `npm run build`
     - Run: `npm run start`
     - Use PM2 or systemd to manage process
     - Nginx reverse proxy on port 80/443 with SSL
   - **Docker** (for containerization):
     - Create Dockerfile, .dockerignore
     - Build image, push to registry
     - Run with docker-compose

10. **Security Hardening**
    - **CSRF Protection**: Next.js handles by default with cookies
    - **SQL Injection**: Prisma parameterized queries prevent this
    - **XSS**: React auto-escapes content; sanitize user input from Claude API if needed
    - **Auth**: Hash passwords (bcrypt), use secure session cookies
    - **HTTPS**: Use SSL on production (Vercel/Nginx)
    - **Rate Limiting**: Add rate limit middleware on API routes:
      ```typescript
      import { Ratelimit } from "@upstash/ratelimit";
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
      });
      ```
    - **Environment Secrets**: Use .env.local, never commit secrets

11. **Monitoring & Logging**
    - Add Sentry for error tracking (optional):
      ```typescript
      import * as Sentry from "@sentry/nextjs";
      Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
      ```
    - Log generation jobs to DB (audit trail)
    - Monitor API response times (simple console.time/timeEnd)

12. **Testing**
    - Manual smoke test: Login → Dashboard → Documents → Generate → Download
    - Test on mobile (Chrome DevTools, actual devices)
    - Test PWA install on iOS/Android
    - Verify offline mode (cached documents load)
    - Test with slow network (throttle in DevTools)

13. **Documentation**
    - Create user guide: `docs/USER_GUIDE.md`
    - Create deployment guide: `docs/DEPLOYMENT.md`
    - Create API docs: `docs/API.md`
    - README: Quick start, feature overview, credits

**Success Criteria:**
- PWA installs on mobile
- Offline documents viewable
- No console errors or warnings (production build)
- All components responsive on all devices
- Error boundary catches errors gracefully
- Dark mode accessible
- Keyboard navigation works
- Deploy successful (Vercel or self-hosted)
- Sub-3s load time on 4G (LCP < 2.5s)

---

## 5. KEY DATA STRUCTURES

### 5.1 Document Categories & Codes

```
PLANNING (6 documents)
├─ PL-001: Site Plan
├─ PL-002: Methodology
├─ PL-003: Master Schedule
├─ PL-004: Health & Safety Plan (summary)
├─ PL-005: Quality Plan (summary)
└─ PL-006: Traffic Management Plan

HEALTH & SAFETY (8 documents)
├─ HS-001: Risk Assessment
├─ HS-002: Method Statements (sewer isolation)
├─ HS-003: Site Induction Checklist
├─ HS-004: Incident Log Template
├─ HS-005: Welfare & Facilities Plan
├─ HS-006: Noise & Dust Control Plan
├─ HS-007: Environmental Management Plan
└─ HS-008: Asbestos Management Plan

ENGINEERING (8 documents)
├─ EN-001: Design Calculations
├─ EN-002: Drawings Register
├─ EN-003: Inspection & Testing Schedule
├─ EN-004: Material Certificates Register
├─ EN-005: As-Built Register
├─ EN-006: Commissioning Plan
├─ EN-007: Testing & Inspection Plan
└─ EN-008: Design Changes Register

COMMERCIAL (6 documents)
├─ CM-001: Contract Summary
├─ CM-002: Payment Schedule & Milestones
├─ CM-003: Change Register
├─ CM-004: Procurement Schedule
├─ CM-005: Subcontractor List & Performance
└─ CM-006: KPI & Performance Metrics

QUALITY (7 documents)
├─ QA-001: Quality Assurance Plan
├─ QA-002: Inspection Plan
├─ QA-003: Test Reports Register
├─ QA-004: Defect Register
├─ QA-005: Compliance Checklist
├─ QA-006: Audit Schedule
└─ QA-007: Lessons Learned Register

HANDOVER (8 documents)
├─ HO-001: Operation & Maintenance Manuals
├─ HO-002: Asset Register
├─ HO-003: Training Records
├─ HO-004: Defects List (punch list)
├─ HO-005: Final Accounts & Closeout
├─ HO-006: Warranties & Guarantees
├─ HO-007: Maintenance Schedule
└─ HO-008: As-Fitted Drawings
```

### 5.2 Project Seed Data

```typescript
// J676 Manor Road NOS Bridge
{
  projectCode: "J676.02",
  name: "Manor Road NOS Bridge",
  client: "Thames Water / Barhale",
  contract: "FA1495",
  description: "Rail and road bridge replacement with sewer isolation",
  location: "North of Shoeburyness (NOS), Essex",
  startDate: "2026-01-15",
  endDate: "2026-08-31",
  status: "ACTIVE",

  constraints: [
    { name: "LUL/DLR track access", level: "CRITICAL", details: "Track closed Sat-Sun only" },
    { name: "LB Newham road closures", level: "HIGH", details: "2-week road closure Oct" },
    { name: "Sewer barrel isolation (5 total, 3 must stay live)", level: "CRITICAL", details: "Sequence critical" },
    { name: "HV cable exclusion zones", level: "HIGH", details: "South side of road" },
    { name: "Asbestos sludge main", level: "CRITICAL", details: "Environmental compliance" }
  ],

  scopeElements: ["NOS07 (Rail Spans)", "NOS08 (Road Span)"]
}
```

### 5.3 Prisma Models (Schema)

```prisma
// src/prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          UserRole
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}

enum UserRole {
  ADMIN
  PM
  VIEWER
}

model Project {
  id            String    @id @default(cuid())
  projectCode   String    @unique
  name          String
  client        String
  contract      String?
  description   String?
  location      String?
  status        String    @default("ACTIVE") // ACTIVE, PAUSED, COMPLETED
  startDate     DateTime?
  endDate       DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  documents     Document[]
  jobs          GenerationJob[]

  @@index([projectCode])
}

model Document {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  category      String    // "Planning", "H&S", "Engineering", "Commercial", "Quality", "Handover"
  docCode       String    // "PL-001", "HS-008", etc.
  title         String
  description   String?

  status        DocumentStatus @default(DRAFT) // DRAFT, IN_REVIEW, APPROVED, ISSUED
  version       Int       @default(1)

  fileContent   Bytes?    // Stored as DOCX binary
  fileMimeType  String    @default("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  fileSize      Int?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  issuedAt      DateTime?

  @@unique([projectId, docCode])
  @@index([projectId, category])
  @@index([status])
}

enum DocumentStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  ISSUED
}

model DocumentTemplate {
  id            String    @id @default(cuid())

  category      String    // Category name
  docCode       String    // Document code (PL-001, etc.)
  name          String    // Human-readable name

  promptTemplate String  // Claude prompt template with {{variables}}
  variables     Json?     // JSON array of variable names

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([docCode])
  @@index([category])
}

model GenerationJob {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  batchId       String    @unique
  briefText     String?
  status        JobStatus @default(PENDING) // PENDING, GENERATING, COMPLETED, FAILED

  templatesRequested Int @default(0)
  docsGeneratedCount Int @default(0)
  docsFailedCount    Int @default(0)

  errorMessage  String?

  createdAt     DateTime  @default(now())
  completedAt   DateTime?
  updatedAt     DateTime  @updatedAt

  @@index([projectId, status])
  @@index([batchId])
}

enum JobStatus {
  PENDING
  GENERATING
  COMPLETED
  FAILED
}
```

---

## 6. IMPORTANT ARCHITECTURE PATTERNS

### 6.1 File Organization

```
siteforge-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── documents/
│   │   │   │   ├── route.ts (GET/POST)
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts (GET/PATCH)
│   │   │   │   │   └── download/
│   │   │   │   │       └── route.ts (GET)
│   │   │   │   ├── generate/
│   │   │   │   │   ├── route.ts (POST)
│   │   │   │   │   └── [jobId]/
│   │   │   │   │       ├── route.ts (GET)
│   │   │   │   │       └── cancel/
│   │   │   │   │           └── route.ts (POST)
│   │   │   │   └── zip/
│   │   │   │       └── route.ts (POST)
│   │   │   └── dashboard/
│   │   │       ├── kpis/
│   │   │       │   └── route.ts
│   │   │       ├── constraints/
│   │   │       │   └── route.ts
│   │   │       ├── timeline/
│   │   │       │   └── route.ts
│   │   │       └── changes/
│   │   │           └── route.ts
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── documents/
│   │   │   │   └── page.tsx
│   │   │   └── generate/
│   │   │       └── page.tsx
│   │   ├── auth/
│   │   │   └── error/
│   │   │       └── page.tsx
│   │   ├── layout.tsx (root)
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   ├── documents/
│   │   │   ├── DocumentTree.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   ├── DocumentCard.tsx
│   │   │   └── DocumentActions.tsx
│   │   ├── dashboard/
│   │   │   ├── KPICard.tsx
│   │   │   ├── ConstraintsHeatmap.tsx
│   │   │   ├── ProgrammeTimeline.tsx
│   │   │   ├── ChangeRegister.tsx
│   │   │   └── CompletionChart.tsx
│   │   ├── generation/
│   │   │   ├── BriefUpload.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── GenerationSettings.tsx
│   │   │   └── GenerationProgress.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── Toast.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   └── documentGenerator.ts
│   │   ├── anthropic/
│   │   │   └── client.ts
│   │   ├── auth/
│   │   │   └── utils.ts
│   │   ├── db/
│   │   │   └── prisma.ts (singleton client)
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useProject.ts
│   │   ├── useAuth.ts
│   │   └── useDocuments.ts
│   ├── types/
│   │   └── index.ts (shared TypeScript types)
│   └── middleware.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
├── docs/
│   ├── CLAUDE_CODE_INSTRUCTIONS.md (this file)
│   ├── USER_GUIDE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── .env.local (git-ignored)
├── .env.example
├── .gitignore
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

### 6.2 API Route Patterns

**All API routes return JSON:**

```typescript
// Success response
{ success: true, data: {...}, timestamp: "2026-03-24T10:30:00Z" }

// Error response
{ success: false, error: "Description", code: "ERROR_CODE", timestamp: "..." }
```

**Authentication:** Use NextAuth.js session in API routes:
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  // session.user.role is "ADMIN" | "PM" | "VIEWER"
}
```

### 6.3 Server vs Client Components

**Use Server Components by default** (fetch data, access DB):
- Pages (`.page.tsx`)
- Layout files
- API routes

**Use Client Components only when:**
- Interactive state (onClick, useState, useEffect)
- Browser APIs (localStorage, window)
- Real-time updates (polling, WebSocket)

```typescript
// Server component (default)
export default async function DocumentList() {
  const documents = await prisma.document.findMany();
  return <div>...</div>;
}

// Client component (needs "use client")
"use client";
import { useState } from "react";
export default function DocumentFilter() {
  const [filter, setFilter] = useState("");
  return <input onChange={e => setFilter(e.target.value)} />;
}
```

### 6.4 Database Access Pattern

**Always use Prisma singleton in lib/db/prisma.ts:**

```typescript
// src/lib/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Use in API routes:**
```typescript
import { prisma } from "@/lib/db/prisma";

const doc = await prisma.document.findUnique({ where: { id } });
```

### 6.5 Document File Storage

**Store .docx files as Bytes in Document.fileContent:**

```typescript
// Generating a document
import { Document as DocxDocument } from "docx";

const doc = new DocxDocument({ sections: [...] });
const buffer = await doc.save();

// Save to DB
await prisma.document.create({
  data: {
    projectId,
    docCode: "PL-001",
    title: "Site Plan",
    category: "Planning",
    status: "DRAFT",
    fileContent: buffer, // Bytes
    fileMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: buffer.length,
  },
});
```

**Rendering .docx in UI:**

```typescript
// Client component
"use client";
import mammoth from "mammoth";
import { useEffect, useState } from "react";

interface DocumentViewerProps {
  fileContent: Uint8Array;
}

export function DocumentViewer({ fileContent }: DocumentViewerProps) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const convertDocument = async () => {
      try {
        const result = await mammoth.convertToHtml({
          arrayBuffer: fileContent.buffer,
        });
        setHtml(result.value);
      } catch (err) {
        setError("Failed to render document");
      }
    };
    convertDocument();
  }, [fileContent]);

  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div
      className="prose dark:prose-invert max-w-none p-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### 6.6 Responsive Grid Examples

**Dashboard KPIs (Tailwind):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <KPICard title="Total Docs" value="43" />
  <KPICard title="Approved" value="12" />
  {/* ... */}
</div>
```

**Document List:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {documents.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
</div>
```

**Mobile Navigation:**
```tsx
// Hamburger menu on mobile
<button
  className="md:hidden p-2"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</button>

{menuOpen && (
  <nav className="fixed inset-0 bg-slate-900 z-40 flex flex-col p-6">
    {/* Menu items */}
  </nav>
)}
```

### 6.7 Authentication & Authorization

**Roles:**
- `ADMIN` — Full access, user management, settings
- `PM` — Full access to documents, generation, dashboard
- `VIEWER` — Read-only access to documents

**Middleware check:**
```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Routes check can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/documents/:path*"],
};
```

**API route role check:**
```typescript
const session = await getServerSession(authOptions);
if (session?.user?.role !== "ADMIN") {
  return new Response("Forbidden", { status: 403 });
}
```

---

## 7. DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All environment variables set (`.env.local`)
- [ ] Database migrated (Prisma migrations applied)
- [ ] NextAuth secret generated (`openssl rand -base64 32`)
- [ ] ANTHROPIC_API_KEY configured
- [ ] Test login with all 3 roles
- [ ] Test document generation (at least 1 full batch)
- [ ] Test mobile responsiveness (iPhone, Android, tablet)
- [ ] PWA installs on mobile
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors in production build
- [ ] Dark mode looks professional
- [ ] All links work
- [ ] 404 page set up
- [ ] Error boundary catches errors gracefully
- [ ] Sentry (if using) configured
- [ ] HTTPS/SSL enabled
- [ ] Security headers set (if self-hosting)

---

## 8. QUICK REFERENCE

### Commands

```bash
# Setup
npm install
npx prisma migrate dev --name init
npx prisma db seed

# Development
npm run dev  # Starts on http://localhost:3000

# Build & Test
npm run build
npm run start  # Production server
npm run type-check  # TypeScript check
npm run lint

# Database
npx prisma studio  # Open Prisma Studio UI
npx prisma reset  # Reset database (dev only)
```

### Key Files to Edit First

1. `prisma/schema.prisma` — Database schema
2. `.env.local` — Environment variables
3. `tailwind.config.js` — Brand colours & design tokens
4. `src/components/layout/Sidebar.tsx` — Navigation structure
5. `src/app/layout.tsx` — Root layout, dark mode setup

### Key Endpoints (Phase 2+)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/documents` | List documents |
| `GET` | `/api/documents/:id/download` | Download single doc |
| `POST` | `/api/documents/zip` | Bulk download |
| `POST` | `/api/documents/generate` | Start generation job |
| `GET` | `/api/documents/generate/:jobId` | Check job status |
| `GET` | `/api/dashboard/kpis` | KPI data |

---

## 9. SUPPORT & TROUBLESHOOTING

### Common Issues

**Issue: "ENOENT: no such file or directory, open 'dev.db'"**
- **Solution:** Run `npx prisma migrate dev --name init` first

**Issue: NextAuth session not working**
- **Solution:** Check `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your deployment

**Issue: mammoth.js fails to render .docx**
- **Solution:** Ensure file is valid .docx; check browser console for errors

**Issue: Tailwind classes not applying**
- **Solution:** Check `tailwind.config.js` includes `src/` in `content`

**Issue: "API route returned 500"**
- **Solution:** Check server logs; ensure Prisma is connected

---

## 10. SUCCESS CRITERIA (OVERALL)

By end of Phase 5, SiteForge AI should:

✅ Authenticate users with NextAuth.js (3 roles)
✅ Display responsive dashboard (no horizontal scroll on mobile)
✅ Show 43 documents organized by category
✅ Render .docx documents in browser with mammoth.js
✅ Download individual and bulk documents
✅ Generate documents via Claude API based on brief
✅ Show progress bar during generation
✅ Save generated documents to database
✅ Display KPIs, constraints, timeline, changes on dashboard
✅ Work offline (PWA with cached documents)
✅ Support dark mode (default)
✅ Be accessible (keyboard nav, ARIA labels, 44px touch targets)
✅ Load in <3 seconds on 4G
✅ Deploy to Vercel or self-hosted server
✅ Have zero TypeScript errors in production build

---

## 11. NEXT STEPS AFTER BUILD

1. **Collect feedback** from Barhale PMs (on-site testing)
2. **Refine document templates** based on real project data
3. **Add analytics** (Vercel Analytics or Mixpanel)
4. **Plan Phase 2** features:
   - Real-time collaboration (document comments)
   - Integration with project management tools (Monday.com, Asana)
   - Advanced reporting & exports
   - Mobile app (React Native)
5. **Plan scaling**:
   - Multi-project support (currently J676 only)
   - Database migration to PostgreSQL
   - Document versioning & audit trail
   - Custom branding per client

---

**Owner:** Billy Kin Pang (Pang & Chiu)
**Last Updated:** 2026-03-24
**Version:** 1.0
