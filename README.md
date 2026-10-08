# Med Jordan Law — Practice Management Dashboard

A legal practice management system built with Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS v4, Base UI, and TypeScript. Styled in executive architectural light mode adhering to the MJL Design System (see DESIGN_SYSTEM.md).

---

## Workspaces & Client Journey Architecture

The application maps the full end-to-end lifecycle of legal practice representation:

1. **Executive Dashboard (`/dashboard`)**:
   - **Client Journey Stat Cards**: 4 responsive key indicators with interactive category filtering.
   - **Needs Attention Panel**: Live operational triage for bookings awaiting acceptance, rejected documents, and stalled reschedules.
   - **Upcoming Consultations**: Chronological appointments with modality badge (Video, Phone, In-Person) and post-consultation workflow triggers.
   - **Weekly Practice Velocity**: Interactive day-by-day consultation bar charts with SVG hatched patterns.
   - **Active Matters**: Ongoing litigation and commercial case dossiers with progress tracking.
2. **Bookings & Consultations (`/bookings`)**: Intake triage, calendar and roster views, conflict check reviews, gateway refund processing, and automated client notifications.
3. **Court Cases & Dossiers (`/cases`)**: Confidential case vault, document audit trails, hearing schedules, and attorney notes.
4. **Clients & Entities (`/clients`)**: Corporate and individual profiles, retainer history, tax invoices, and communications.
5. **Fee Agreements & Retainers (`/contracts`)**: Formal Jordanian Bar Association fee contracts, counter-signatures, and digital audit certificates.
6. **Leads & Inquiries (`/leads`)**: Prospect intake pipeline with 1-click conversion to consultation booking.
7. **Financial Ledger & Trust Accounts (`/finance`)**: Real-time revenue tracking, trust account balances, and tax invoice generation.
8. **Legal Content & Publications (`/content`)**: Bilingual legal bulletin and article publishing workflow (English / Arabic).
9. **Office Practice Settings (`/settings`)**: Booking policies, lawyer hourly rates, 2FA enforcement, and staff invitations.
10. **Compliance & Audit Vault (`/audit`)**: Tamper-evident ledger of all user actions, document views, and financial transactions.

---

## Tech Stack & Design System

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS variables
- **Primitives**: [@base-ui/react](https://base-ui.com/) & custom Accessible Dialog primitives
- **Typography**: [Geist Sans](https://vercel.com/font), Geist Mono, and [Cinzel](https://fonts.google.com/specimen/Cinzel)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Design Philosophy**: [MJL Design System](DESIGN_SYSTEM.md) — direct manipulation, 1:1 pointer tracking, interruptible transitions, and reduced-motion fallbacks.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Global Spotlight Search |
| `⌘F` or `Ctrl+F` | Quick Search in current dossier |
| `Escape` | Dismiss active modal dialog / spotlight |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Code Quality & Type Verification
```bash
# Verify TypeScript types
npx tsc --noEmit

# Run ESLint check
npm run lint
```

### 4. Production Build
```bash
npm run build
npm run start
```

---

## Production Readiness

For the full production audit and execution checklist, see [PRODUCTION_READINESS_CHECKLIST.md](PRODUCTION_READINESS_CHECKLIST.md).
