# Med Jordan Law — Admin Dashboard

A legal practice management dashboard built with Next.js (App Router), Tailwind CSS, shadcn/ui, and TypeScript. Styled in pure light mode with Med Jordan Law's signature deep navy palette (`#0A2342`) and zero green accents.

## Features

- **Non-Scrolling Fixed Sidebar**: Permanently anchored left navigation with active indicators, notification badges, and a dark navy support card.
- **Top Bar**: Search bar with keyboard shortcut (`⌘F`), notification badge, message center, user profile chip, and quick action buttons.
- **Stat Cards (Row 1)**: 4 cards featuring 1 deep navy accent card (`Total bookings`) with circular arrow trigger and 3 white cards (`Ended Consultations`, `Active cases`, `Pending approval`).
- **Weekly Bookings Chart**: 7 pill bars with SVG diagonal-hatched patterns, active deep navy bar, and floating percentage badge. Fully interactive day selection.
- **Next Consultation**: Client appointment card with time badge and `Start consultation` action.
- **Recent Bookings**: Client roster with avatars, case subtitles, and status badges (`Completed`, `In Progress`, `Pending`).
- **Case Completion**: Semi-circle arch gauge chart with center metrics and 3-color legend.
- **Key Cases**: Active matters list matching reference layout with category badges and due dates.
- **Time Tracker / Office Hours**: Textured dark navy card with live ticking billable digital timer and circular pause/play and stop controls.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied) in your browser.

## Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```
