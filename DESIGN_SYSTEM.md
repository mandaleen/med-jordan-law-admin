# MJL Design System

The visual and interaction language of the Med Jordan Law practice dashboard.
Source of truth for tokens and primitives: [`app/globals.css`](app/globals.css).

**Character:** calm, precise, authoritative. Deep navy on a cool-grey canvas, floating rounded surfaces, one warm gold accent, and a diagonal-hatch motif for "not yet / pending". Generous radii, soft shadows, no gradients except on dark hero surfaces.

---

## 1. Principles

1. **Quiet by default.** White surfaces on a tinted canvas; colour is reserved for state and for the single primary action.
2. **One primary action per view.** Navy pill. Everything else is outline or ghost.
3. **Numbers are the hero.** Large, tight-tracked, tabular figures; labels stay small and muted.
4. **Hatch means "not yet".** Pending, early-stage and empty tracks use `pattern-hatch`; solid navy means done or selected.
5. **Bilingual first.** Every layout works in LTR (English) and RTL (Arabic). Use logical properties only.
6. **Accessible always.** Visible focus, 4.5:1 text contrast, keyboard reachable, reduced-motion respected.

---

## 2. Colour

Tokens are CSS variables in `:root`, exposed to Tailwind as `navy-*`, `gold-*`, `gray-*`, `success`, `warning`, `error`, `info`.

| Role | Token | Value |
|---|---|---|
| Primary / selected / CTA | `navy-900` | `#1A2744` |
| Primary hover | `navy-800` | `#232F52` |
| Deepest (text, dark surfaces) | `navy-950` | `#111A30` |
| Mid accent (charts, links) | `navy-600` / `navy-400` | `#3D5390` / `#7A8FC0` |
| Tints (hover, chips, tracks) | `navy-50` / `navy-100` / `navy-200` / `navy-300` | `#F3F5FA` … `#A3B3D7` |
| **Secondary accent** (second chart series, peaks, "live", highlights) | `gold-500` (+ `gold-100/300/700`) | `#E8B04A` |
| Canvas | `#EEF1F7` | app background |
| Text body / muted / faint | `navy-950` / `gray-500` / `gray-400` | |
| Success / Warning / Error / Info | `success` `warning` `error` `info` | `#2F9E6E` `#E0A030` `#D64545` `#3B82C4` |

Rules
- Status colours appear as a **10–15 % tinted background + full-strength text/icon** (e.g. `bg-success/10 text-success`), never as solid blocks, except destructive confirmations.
- No off-palette blues/slates in new work. **Charts: navy-900 is the primary series, gold-500 is the secondary series**; hatch means pending. Use `navy-400`/`navy-300` only for tints, never as a second series next to navy-900.
- Borders on surfaces are `navy-900` at 7 % (`rgba(26,39,68,.07)`); dividers inside surfaces use 6 %.

---

## 3. Typography

Fonts: **Geist Sans** (UI), **Geist Mono** (identifiers, docket numbers).

| Use | Classes |
|---|---|
| Page title | `text-[32px] sm:text-[38px] font-semibold tracking-[-0.035em] leading-[1.05] text-navy-950` (or `<PageHeader>`) |
| Section / card title | `text-[17px] font-semibold tracking-tight text-navy-950` |
| Big metric | `text-[52px] font-semibold tracking-[-0.04em] tabular-nums leading-none` |
| Mid metric | `text-[34px]–[40px]` same weight/tracking |
| Body | `text-sm text-navy-950` / secondary `text-gray-500` |
| Row title | `text-[13px]–[13.5px] font-semibold tracking-tight` |
| Meta | `text-[11.5px]–[12px] text-gray-500` |
| Eyebrow / group label | `text-[10.5px] font-semibold tracking-[0.14em] uppercase text-gray-400` |
| Identifiers | `font-mono` |

Always use `tabular-nums` for figures, times and money.

---

## 4. Shape, elevation, spacing

| Token | Value | Used for |
|---|---|---|
| Radius – surface | `24px` | cards, tables, dialogs (`rounded-3xl`) |
| Radius – control | `9999px` | buttons, chips, segmented controls, avatars-as-pills |
| Radius – tile | `12–16px` | icon tiles, inner rows, inputs (`rounded-xl`/`2xl`) |
| Shadow – surface | `0 1px 2px rgba(26,39,68,.03), 0 8px 24px -12px rgba(26,39,68,.08)` | `.surface-card` |
| Shadow – dark / CTA | `0 14px 32px -14px rgba(17,26,48,.55)` | `.surface-dark`, primary buttons |
| Gaps | `gap-4` (cards in a row), `gap-5` (page sections), `p-5` (card padding), `p-6` (large cards) | |

Layout shell: floating sidebar (`264px`, `p-3`) + main column. Page content is `p-3 sm:p-5 lg:p-6`, max width 1600px. Dashboard grid is 12 columns from `xl`, 2 from `lg`, 1 below.

---

## 5. Surfaces & utilities (in `globals.css`)

| Class | Purpose |
|---|---|
| `.surface-card` | Default white card (24px radius, soft shadow). |
| `.surface-table` | Card variant that clips table contents. |
| `.surface-dark` | Navy gradient hero surface. Add concentric-ring SVG at `text-white/[0.06]` for texture. |
| `.pattern-hatch` | Diagonal hatch fill for pending / empty tracks. |
| `.press`, `.press-sm` | Tactile `:active` scale (disabled under reduced motion). |
| `.rise-in` | Entrance animation; stagger with `style={{"--rise-delay":"120ms"}}`. |
| `.custom-scrollbar`, `.scrollbar-thin` | Slim themed scrollbar. |
| `.no-scrollbar` | Hide scrollbar (tab strips, chip rows). |
| `.table-header-cell`, `.table-row-hover` | Table header and row hover. |

---

## 6. Components

### Sidebar — `components/layout/sidebar.tsx`
Floating card. Logo → **Menu** group → **General** group (Settings, Audit, Help, Sign out) → "Next up" dark card (hidden below 880px viewport height).
- Active item: `bg-navy-50`, navy-900 icon tile with white glyph, 4px accent bar on the card edge, `aria-current="page"`.
- Inactive: muted icon, hover tile lift. Sign out uses danger tint on hover.
- Mobile: same content in an off-canvas drawer; `Esc` and scrim close it.

### Top header — `components/layout/top-header.tsx`
Floating `surface-card` bar: current page, search trigger (⌘K), primary "New Booking", notifications, account menu.

### Buttons
| Type | Classes |
|---|---|
| Primary | `h-11 px-5 rounded-full bg-navy-900 text-white font-semibold hover:bg-navy-800 press` (+ CTA shadow for page-level) |
| Secondary | `rounded-full bg-white border border-navy-900/20 text-navy-900 hover:bg-navy-50 press` |
| Compact action (cards) | same, `px-3.5 py-1.5 text-[12px]` |
| Destructive | secondary with `hover:bg-error/10 hover:text-error hover:border-error/30` |
| Circular icon CTA | `w-9 h-9 rounded-full border border-navy-900/15`, fills navy on hover, arrow rotates 12° |

### Segmented control / filter chips
Track `bg-gray-100 rounded-full p-1`; selected `bg-white shadow-xs font-semibold text-navy-900`. Use `role="tablist"` / `role="tab"` + `aria-selected`.
Chip rows: selected `bg-navy-900 text-white`, others `bg-gray-100 text-gray-500`.

### Stat card — `components/dashboard/stat-cards.tsx`
Title + circular arrow CTA, metric, footer with trend chip (`TrendingUp` icon) and context. First card is dark (`surface-dark`). Whole card is a `<button>` with `aria-pressed`.

### Panel header
Title (`17px/600`) + count pill (`bg-navy-50 text-navy-700 rounded-full text-[11px]`) on the left; segmented control or quiet link on the right. Do not draw a divider under it.

### List rows
Avatar/tile 40px (`rounded-xl`), title + meta, trailing compact action. Rows separated by `divide-navy-900/[0.06]`, not boxed, unless the row has its own actions (then `rounded-2xl border bg-gray-50/60`).

### Progress & charts — `weekly-bookings.tsx`, `matters-progress.tsx`
- Capsule bars (`rounded-full`): active = navy gradient + tooltip bubble, peak = `navy-400`, rest = `pattern-hatch`.
- Gauge: semicircle, layered arcs (track hatch → advanced `navy-400` → completed `navy-900`), round caps, centred percentage, legend with counts.
- Linear progress: `h-1.5 rounded-full bg-navy-50` with a coloured fill.

### Tables
`.surface-table` + `.table-header-cell` + `.table-row-hover`. Identifiers in `font-mono`. Status as tinted pill.

### Status pills
`rounded-full px-2 py-0.5 text-[10.5px]–[11px] font-semibold` with tinted bg: success, info, warning (`bg-gold-100 text-gold-700`), error, neutral (`bg-gray-100 text-gray-700`).

### Dialogs — `components/ui/dialog.tsx`
`rounded-3xl`, navy scrim with blur, header/footer separated by 6 % navy hairlines, footer `bg-navy-50/50`. Focus trapped, `Esc` closes, body scroll locked.

### Empty state — `components/ui/empty-state.tsx`
Hatch circle icon, 15px/600 title, 13px description, primary + secondary pill actions.

### Page header — `components/ui/page-header.tsx`
Optional gold eyebrow, display title, description, right-aligned actions. `SectionHeader` for in-page sections.

### Avatars
`ClientAvatar` generates a deterministic gradient + initials; use `rounded-xl` for lists, `rounded-2xl` for hero cards, `shape="circle"` for people chips.

---

## 7. Motion

- Durations: 150–200 ms for hover/press, 300 ms for card lift, 420 ms for entrance (`rise-in`), 500–700 ms for chart fills.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; `ease-out` otherwise.
- Animate `transform` and `opacity` only. Hover lift is `-translate-y-0.5`; press is `scale(0.95–0.98)`.
- Respect `prefers-reduced-motion` (already handled in `.rise-in` and `.press*`).

---

## 8. Accessibility

- Interactive elements are real `<button>`/`<a>`; icon-only controls carry `aria-label`.
- Focus: `focus-visible:ring-2 ring-navy-600/40–50` (offset on cards). Never remove outlines without a replacement.
- Charts expose a text alternative (`role="img"` + `aria-label`) or are keyboard-focusable per bar.
- Toggle-like controls use `aria-pressed` / `aria-selected` / `aria-current`.
- Text on `navy-*` ≥ 700 backgrounds is white; on tints is `navy-800`+.

## 9. Internationalisation

- Use logical utilities: `ms-/me-/ps-/pe-`, `start-/end-`, `text-start`, `border-s`. Never `left/right/ml/mr` for layout.
- Directional icons (arrows, chevrons) get `rtl:-scale-x-100` or `rtl:rotate-180`.
- Strings live in `lib/i18n.ts` (`getTranslation`). New navigation labels need `nav.*` keys.
- Dates and greetings are resolved after mount to avoid hydration mismatches.

## 10. Do / Don't

| Do | Don't |
|---|---|
| Use `surface-card` for every card | Hand-roll `bg-white border rounded-xl shadow` |
| Pill for buttons and chips | Mix square and pill buttons in one toolbar |
| Tinted status backgrounds | Solid red/green/yellow blocks |
| `tabular-nums` for figures | Monospace for every number |
| Hatch for pending | Grey bars for pending |
| Logical properties | `ml-*`, `text-left` |

## 11. Adding a new page

1. Wrap content in a `flex flex-col gap-5` column.
2. Start with `PageHeader` (or the dashboard-style greeting for home).
3. Group content in `surface-card` panels with the standard panel header.
4. Use one primary pill action; secondary actions as outline pills.
5. Provide loading (`Skeleton`), empty (`EmptyState`) and error states.
6. Verify at 375px, 768px, 1280px+, in English and Arabic, and with keyboard only.
