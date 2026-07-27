# Restaurant Loyalty — Frontend

Next.js 14 (App Router) + Tailwind v4 frontend for the loyalty backend.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

## Design tokens — read before adding brand colors

Every color in the app is a CSS variable defined once, in
`app/globals.css`, under the `DESIGN TOKENS` comment block. There is no
color hardcoded anywhere else — components reference `var(--color-*)`. When
brand colors arrive, that's the only file that needs to change:

```css
--color-bg: ...
--color-surface: ...
--color-accent: ...
/* etc. */
```

Same goes for fonts — `--font-display`, `--font-body`, `--font-mono` in the
same file, loaded via Google Fonts link tags in `app/layout.tsx`.

## Current direction (placeholder, pending brand colors)

A "scoreboard / ticket redemption counter" feel: warm dark ground, gold
accent, tabular-mono digits for every point count so numbers don't jitter
the layout as they update. The leaderboard is styled like an arcade
high-score list with tiered rank badges (gold/silver/bronze for top 3).

## Structure

```
app/
  layout.tsx          — root layout, loads fonts, wraps AuthProvider
  globals.css         — ALL design tokens live here
  page.tsx            — landing page
  login/              — email + OTP login flow
  dashboard/          — customer: wallet, loyalty points, rank
  leaderboard/        — public leaderboard
  menu/               — public menu with point values
  rewards/            — public rewards catalog
  staff/
    orders/           — staff: log a completed order
    redeem/           — staff: redeem a reward for a customer
    menu-items/       — staff: manage point values per dish
components/
  Navbar.tsx
  PointsCounter.tsx   — the scoreboard-style point display
  RankBadge.tsx        — tiered rank badge
lib/
  api.ts              — fetch wrapper, attaches JWT from localStorage
  auth-context.tsx    — logged-in user state, OTP flow
  types.ts            — mirrors backend DTOs
```

## Notes

- Auth token is stored in `localStorage`. Fine for this use case; revisit if
  you need httpOnly cookies for stricter XSS protection later.
- Staff-only pages check `user.role` client-side to hide/redirect, but the
  real enforcement is server-side in the backend (`RolesGuard`) — this is
  just UX, not a security boundary.
- No component library — plain Tailwind, so the re-skin later is simple and
  there's nothing fighting your brand colors.
