# EmergiQR — Project Context for AI Assistants

This document explains the full architecture, decisions, and conventions of the EmergiQR project so any AI assistant can understand the codebase without prior context.

---

## What is EmergiQR?

A web app that allows motorcyclists to register their medical data and generate a unique QR code. When someone scans the QR in an emergency, it opens a public page with critical medical information instantly — no app, no login required.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14 |
| Language | TypeScript | 5 |
| Styles | TailwindCSS | 3 |
| Database | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth | built-in |
| QR Generation | qrcode.react | 3 |
| Form handling | react-hook-form + zod | latest |
| Icons | lucide-react | latest |
| Deploy | Vercel | — |

---

## Project Structure

```
emergiqr/
├── app/
│   ├── page.tsx                       # Landing page (public)
│   ├── layout.tsx                     # Root layout — fonts: Syne (display), DM Sans (body), DM Mono (mono)
│   ├── globals.css                    # Global styles + custom utility classes
│   ├── not-found.tsx                  # 404 page
│   ├── login/
│   │   └── page.tsx                   # Login — reads error_code from URL params, shows friendly messages
│   ├── register/
│   │   └── page.tsx                   # Register — email confirmation flow
│   ├── dashboard/
│   │   ├── layout.tsx                 # Protected layout — redirects to /login if no session
│   │   ├── page.tsx                   # Dashboard home — shows profile status
│   │   ├── profile/
│   │   │   ├── page.tsx               # Server Component — fetches profile from Supabase
│   │   │   └── ProfilePageClient.tsx  # Client Component — calls POST or PUT /api/profile
│   │   └── qr/
│   │       └── page.tsx               # Shows QRDisplay component or prompt to complete profile
│   ├── e/
│   │   └── [publicId]/
│   │       └── page.tsx               # Public emergency page — no auth required, filters deleted_at IS NULL
│   └── api/
│       └── profile/
│           └── route.ts               # REST API: GET / POST / PUT / DELETE (soft delete)
├── components/
│   ├── DashboardNav.tsx               # Sticky nav with active link detection and logout
│   ├── ProfileForm.tsx                # Full medical profile form with react-hook-form + zod
│   └── QRDisplay.tsx                  # QR code display with PNG and SVG download
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client (createBrowserClient)
│   │   └── server.ts                  # Server Supabase client (createServerClient + cookies)
│   └── utils.ts                       # cn(), getPublicUrl(), BLOOD_TYPES
├── types/
│   └── index.ts                       # MedicalProfile, PublicProfile, BloodType, ProfileFormValues
├── middleware.ts                      # Protects /dashboard/* — redirects unauthenticated users to /login
├── supabase/
│   └── migrations/
│       └── 001_initial.sql            # Full DB schema with RLS policies and soft delete
└── .env.example                       # Environment variable template
```

---

## Database Schema

Single table: `public.medical_profiles`

```sql
id              uuid PRIMARY KEY
user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
public_id       uuid NOT NULL UNIQUE  -- used in QR URL, never exposes user_id
full_name       text NOT NULL
birth_date      date
blood_type      text  -- enum: A+, A-, B+, B-, AB+, AB-, O+, O-, unknown
allergies       text
medical_conditions    text
current_medications   text
emergency_contact_name   text
emergency_contact_phone  text
emergency_contact_whatsapp boolean DEFAULT false
insurance_info  text
additional_notes text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()  -- auto-updated via trigger
deleted_at      timestamptz  -- NULL = active, NOT NULL = soft deleted
```

**Indexes:**
- Unique index on `user_id WHERE deleted_at IS NULL` — one active profile per user
- Partial index on `user_id WHERE deleted_at IS NULL` — fast active profile lookups
- Partial index on `public_id WHERE deleted_at IS NULL` — fast emergency page lookups

**RLS Policies:**
- Authenticated users can SELECT/UPDATE their own profile where `deleted_at IS NULL`
- Anyone can SELECT by `public_id` where `deleted_at IS NULL` (emergency page)
- Users can INSERT their own profile

---

## Authentication Flow

- Supabase Auth handles all auth (email + password)
- Registration sends a confirmation email
- Sessions are stored in cookies via `@supabase/ssr`
- `middleware.ts` runs on every request to `/dashboard/*`, `/login`, `/register`
- If no valid session → redirect to `/login`
- If valid session on auth pages → redirect to `/dashboard`

---

## API Endpoints

All endpoints in `app/api/profile/route.ts`:

| Method | Auth | Description |
|---|---|---|
| GET | Required | Fetch own active profile |
| POST | Required | Create profile (generates new `public_id` via uuid v4) |
| PUT | Required | Update active profile |
| DELETE | Required | Soft delete — sets `deleted_at = now()` |

All write endpoints validate input with Zod before touching the database.
All queries filter `deleted_at IS NULL` to only operate on active profiles.

---

## Public Emergency Page

Route: `/e/[publicId]`

- No authentication required
- Server Component — renders on the server for fast load
- Queries `medical_profiles` by `public_id` where `deleted_at IS NULL`
- If not found → Next.js `notFound()` → renders `not-found.tsx`
- Special route `/e/demo` returns hardcoded demo data for previewing
- Shows: name, blood type, allergies (highlighted in red), conditions, medications, insurance, notes
- Emergency contact section shows: call button (green) or WhatsApp button (green) based on `emergency_contact_whatsapp` flag
- If WhatsApp preferred, also shows a secondary plain call button

---

## QR Code Generation

- Generated entirely on the frontend using `qrcode.react`
- QR value is the full public URL: `${NEXT_PUBLIC_APP_URL}/e/${publicId}`
- `QRCodeSVG` used for display (vector, sharp on any screen)
- `QRCodeCanvas` used hidden for PNG export (rasterized with padding and label added via canvas API)
- SVG export serializes the DOM element directly
- `public_id` is a UUID v4 — 122 bits of entropy, not guessable

---

## Soft Delete Pattern

Profiles are never hard deleted. When a user deletes their profile:
- `deleted_at` is set to the current timestamp
- All queries filter `WHERE deleted_at IS NULL`
- The QR page returns 404 for deleted profiles
- A new profile can be created after deletion (unique index only applies to active profiles)

---

## Design System

Defined in `tailwind.config.ts` and `globals.css`.

**Colors:**
- `bg.DEFAULT` — `#0a0a0f` (page background)
- `bg.card` — `#111118` (card background)
- `bg.elevated` — `#16161f` (input background)
- `border.DEFAULT` — `#1e1e2e`
- `accent.red` — `#ff3333` (primary CTA, alerts)
- `accent.green` — `#22c55e` (call button)
- `accent.amber` — `#f59e0b` (warnings)
- `text.primary` — `#f0f0f8`
- `text.secondary` — `#8888aa`
- `text.muted` — `#555570`

**Fonts:**
- `font-display` → Syne (headings, labels, buttons)
- `font-body` → DM Sans (body text, inputs)
- `font-mono` → DM Mono (data labels, codes)

**Custom utility classes (defined in globals.css):**
- `.input-base` — standard input styling
- `.btn-primary` — red primary button
- `.btn-secondary` — ghost secondary button
- `.card` — dark card with border
- `.label` — uppercase tracking label above inputs
- `.error-text` — red validation error text
- `.data-row` — row in emergency page data list
- `.data-label` — small mono label in emergency page
- `.data-value` — value text in emergency page

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://okkflnjmlykoegjrbanq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://emergi-qr.vercel.app
```

All variables are prefixed with `NEXT_PUBLIC_` — they are safe to expose to the browser.
No secret server-only variables are used in this MVP.

---

## Deployment

- **Vercel** — auto-deploys on every push to `main`
- **Supabase** — managed PostgreSQL, no server to maintain
- Production URL: `https://emergi-qr.vercel.app`
- Vercel Analytics: enabled

---

## Key Conventions

- Server Components fetch data directly from Supabase (no API call needed)
- Client Components that need to write data call `/api/profile` via fetch
- `createClient()` from `lib/supabase/client.ts` → use in Client Components
- `createClient()` from `lib/supabase/server.ts` → use in Server Components and API routes
- Always filter `deleted_at IS NULL` on every query — never omit this
- The `public_id` is the only identifier exposed publicly — never expose `user_id` or `id`
- Form validation always uses Zod schemas — no manual validation
- All Tailwind classes use the custom color tokens (e.g. `text-text-primary`, `bg-bg-card`) — avoid raw hex colors in JSX

---

## Known Limitations (MVP)

- No password reset flow implemented yet
- No profile photo support
- No scan tracking / analytics per QR
- No multi-language support
- Supabase free tier pauses after 1 week of inactivity
