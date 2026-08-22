# GlobeTrotter — Empowering Personalized Travel Planning

> **Hackathon Edition 2026** — Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and a 100% custom native backend using Mongoose & MongoDB (Zero BaaS / No Supabase / No Firebase).

---

## 🏛️ Architecture

GlobeTrotter adheres strictly to a clean, decoupled frontend/backend architecture powered by Next.js App Router & Mongoose REST API handlers:

- **`GLOBE - TROTTER/app/`** — **Frontend Pages & View Layer** (Next.js 13 App Router, React Server/Client Components, Protected Route Wrappers).
- **`GLOBE - TROTTER/app/api/`** — **Backend REST API Routes** (Custom-built route handlers for Auth, Trips, Stops, Activities, Expenses, Budget calculations, and Public Sharing. Zero BaaS).
- **`GLOBE - TROTTER/components/`** — **Frontend UI Component Library** (Interactive widgets, Recharts donut visualization, slide-over sheets, travel style selectors, timeline cards).
- **`GLOBE - TROTTER/models/`** — **Backend Data Schemas & Mongoose Models** (`User`, `Trip`, `Stop`, `City`, `Activity`, `Expense`, `SharedTrip` with strict type definitions).
- **`GLOBE - TROTTER/lib/`** — **Backend & Utility Layer** (Cached Mongoose connection helper with in-memory local fallback, JWT cookie session helpers, auto-seeder).
- **`GLOBE - TROTTER/context/` & `hooks/`** — **Client State & API Data Layer** (`AuthContext`, `useTrips`, `useTrip`, `useCities`, `useExpenses` connecting directly to custom `/api/*` endpoints).

---

## 📱 14 Visual Specification Screens

| # | Screen | Description | Path |
|---|---|---|---|
| **1** | **Welcome Screen** | Hero alpine branding, logo, Get Started / Login | `app/page.tsx` |
| **2** | **Login / Signup** | Auth card, email/password, social Google/Apple login | `app/login`, `app/signup` |
| **3** | **Dashboard / Home** | Greeting, search + mic, quick action pills, upcoming trip % progress | `app/dashboard` |
| **4** | **Create Trip** | Cover photo upload, dates, description counter (0/300), AI Enhancer | `app/trips/new` |
| **5** | **My Trips List** | Tabs (All, Upcoming, Completed), numbered cards with status badges | `app/trips` |
| **6** | **Itinerary Builder** | Numbered stop badges (1, 2, 3), action icons (Hotel, Camera, Luggage, User) | `app/trips/[tripId]/plan` |
| **7** | **Itinerary View** | List / Calendar toggle, timeline step cards, Total Cost bar | `app/trips/[tripId]` |
| **8** | **City Search** | Search, Region pills (All, Europe, Asia, Americas, Africa), price tiers | `app/explore` |
| **9** | **Activity Browse** | Category filter pills, grid cards with images, tags, favorites | `app/explore` |
| **10** | **Activity Details** | Slide-over drawer with hero carousel, duration/cost pills, includes checklist | `components/itinerary/ActivityDetailsSheet.tsx` |
| **11** | **Budget Breakdown** | Recharts donut chart, category % breakdown, itemized expenses in ₹ | `components/itinerary/BudgetBreakdown.tsx` |
| **12** | **Profile Screen** | Avatar, Nomad/Explorer chips, 30/93/69 stats, profile options | `app/profile` |
| **13** | **Plan A Trip Step** | Destination card with voice input, date chips, budget slider, travel styles | `components/trip/PlanTripStep.tsx` |
| **14** | **Notifications** | Today & Yesterday grouped alerts (trip reminder, hotel, budget alert) | `app/notifications` |

---

## 🛠️ Tech Stack & Key Rules

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Sonner.
- **Backend**: Next.js Route Handlers (`app/api/**/route.ts`), Mongoose, MongoDB.
- **Authentication**: `bcryptjs` password hashing, 7-day `jsonwebtoken` stored securely in `httpOnly` cookies, protected by Next.js `middleware.ts`.
- **Currency**: Indian Rupee (**₹**) formatted consistently across all seed data, inputs, cards, and budget breakdowns.
- **Zero BaaS**: No Supabase, Firebase, or external BaaS dependencies.

---

## ⚡ Quick Start

```bash
cd "GLOBE - TROTTER"

# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
