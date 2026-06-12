# SonicPro — AI Playlist Engine: Design Spec

**Date:** 2026-05-31  
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Recharts  
**Source:** Stitch project `11582237515904702992` (Sonic AI Playlist Dashboard)

---

## 1. Product Overview

SonicPro is an AI-powered playlist extension tool. Users paste a Spotify playlist URL, the AI analyzes the acoustic profile, and curates a seamless extension of new undiscovered tracks. The app is desktop-first, dark mode only.

---

## 2. Pages & Navigation

Six pages served from a persistent sidebar layout shell:

| Route | Page | Description |
|---|---|---|
| `/` | Generator Dashboard | Paste Spotify URL → generate extension + recent activity |
| `/history` | Generation History | All past generated playlists, searchable/filterable |
| `/history/[id]` | Playlist Detail View | Single playlist detail: tracks, match scores, metadata |
| `/favorites` | Favorite Generations | Saved/starred playlists |
| `/stats` | AI Statistics | Analytics: metric cards, discovery growth chart, attribute balance radar |
| `/generator/unified` | Unified Generator Dashboard | Combined generator + live results in split view |

---

## 3. Layout Shell

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (280px fixed)  │  Main Content (flex-1)    │
│                         │                           │
│  Logo + Brand           │  Atmospheric orbs (bg)    │
│  ─────────────────      │  Page content             │
│  Generator   ✦ active   │                           │
│  History                │                           │
│  Favorites              │                           │
│  AI Stats               │                           │
│                         │                           │
│  User avatar (bottom)   │                           │
└─────────────────────────────────────────────────────┘
```

- Sidebar: `w-[280px] h-screen fixed left-0 top-0 bg-surface-dim border-r border-white/10 z-50`
- Main: `md:ml-[280px] min-h-screen relative overflow-hidden`
- Mobile: sidebar collapses to bottom tab bar (4 primary tabs)

---

## 4. Design Tokens (Tailwind extend)

### Colors

```js
// tailwind.config.ts
colors: {
  'background':                '#121414',
  'surface':                   '#121414',
  'surface-dim':               '#0d0e0f',
  'surface-container-low':     '#1a1c1c',
  'surface-container':         '#1e2020',
  'surface-container-high':    '#292a2a',
  'surface-container-highest': '#343535',
  'surface-bright':            '#38393a',
  'surface-variant':           '#343535',
  'on-surface':                '#e3e2e2',
  'on-surface-variant':        '#bccbb9',
  'primary':                   '#53e076',
  'primary-container':         '#1db954',
  'on-primary':                '#003914',
  'secondary':                 '#d1bcff',
  'secondary-container':       '#5b00cd',
  'on-secondary':              '#3d008f',
  'tertiary':                  '#c8c6c5',
  'outline':                   '#869585',
  'outline-variant':           '#3d4a3d',
  'error':                     '#ffb4ab',
}
```

### Typography scale

```js
fontSize: {
  'display-lg':   ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
  'headline-xl':  ['32px', { lineHeight: '40px' }],
  'headline-lg':  ['28px', { lineHeight: '36px' }],
  'title-lg':     ['22px', { lineHeight: '28px' }],
  'title-md':     ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '500' }],
  'body-lg':      ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
  'body-md':      ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
  'label-lg':     ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }],
  'label-md':     ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
  'label-sm':     ['11px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
}
```

Font: **Inter** (Google Fonts) — single family, weights 300/400/500/600/700.

### Spacing

4pt base grid: `4 8 12 16 20 24 32 40 48 64 80 96`

```js
// Custom semantic spacing
spacing: {
  'sm':  '8px',
  'md':  '16px',
  'lg':  '24px',
  'xl':  '40px',
  'xxl': '64px',
  'margin-mobile':  '16px',
  'margin-desktop': '32px',
}
```

### Roundness

`ROUND_EIGHT` → `rounded-lg` (8px) as default. Inputs use `rounded-xl` (12px). Modals `rounded-2xl`.

---

## 5. Component Library

### GlassPanel

```
background: rgba(24, 24, 24, 0.6)
backdrop-filter: blur(20px)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 12px
```

Used for: cards, input wrappers, modal overlays.

### AtmosphericOrb

Large blurred gradient circles in page backgrounds. Two per page:
- Top-left: `bg-secondary/10 w-[600px] h-[600px] rounded-full blur-[120px]`
- Bottom-right: `bg-primary/5 w-[400px] h-[400px] rounded-full blur-[100px]`

Both animate with `pulse-bg` (scale 1→1.1, opacity 0.3→0.6, 8s ease-in-out infinite alternate).

### Sidebar NavItem

- Default: `text-on-surface-variant px-4 py-3 hover:bg-white/5 hover:text-on-surface hover:translate-x-1 transition-all`
- Active: `text-primary bg-primary/10 rounded-lg px-4 py-3 shadow-[0_0_15px_rgba(83,224,118,0.2)]`
- Icon: Material Symbols Outlined, filled on active

### PlaylistInput

Full-width input with link icon prefix:
- Base: `bg-surface-container-high border border-white/10 rounded-xl py-5 pl-12 pr-4`
- Focus: `border-secondary ring-1 ring-secondary shadow-[0_0_20px_rgba(209,188,255,0.2)]`
- Placeholder: `text-on-surface-variant`

### GenerateButton

- `bg-primary text-on-primary font-label-lg rounded-xl px-8 py-4`
- Hover: `scale-[1.02] shadow-[0_0_20px_rgba(83,224,118,0.4)]`
- Loading: spinner + disabled state `opacity-70`

### PlaylistCard (recent activity)

Glass panel with:
- Thumbnail (left, rounded-lg)
- Title + track count + "Extended by N tracks" label
- Play button (icon, `text-primary`)
- Star/favorite toggle (icon, `text-secondary`)
- Hover: `border-primary/30 shadow-[0_0_15px_rgba(83,224,118,0.1)]`

### StatCard (AI Stats page)

- Icon + label + large metric value + trend indicator
- Trend: green `↑ +12%` or red `↓`
- Glass panel, min-w fixed

### TextGradient

```css
background: linear-gradient(to right, #53e076, #d1bcff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

Used on brand name, section headings.

### AIGlow

```css
box-shadow: 0 0 15px rgba(209, 188, 255, 0.3);
```

Applied to active cards and focused inputs.

---

## 6. Charts (Recharts — AI Stats page)

| Chart | Type | Data |
|---|---|---|
| Discovery Growth | Area/Line | Weekly track discovery count (W1–W4) |
| Attribute Balance | Radar | Energy · Dance · Valence · Acoustic dimensions |

Chart styling:
- Background: transparent (sits on glass panel)
- Grid lines: `stroke="#3d4a3d"` (outline-variant, very subtle)
- Primary line/fill: `#53e076` at 20% fill opacity
- Secondary line: `#d1bcff`
- Tooltip: glass panel style, `backdrop-blur`
- Respect `prefers-reduced-motion`: disable enter animation, show static chart

---

## 7. Animations (Framer Motion)

| Element | Animation | Duration / Easing |
|---|---|---|
| Page enter | `opacity 0→1`, `y 8→0` | 250ms ease-out |
| Atmospheric orbs | Scale 1→1.1, opacity 0.3→0.6 (CSS) | 8s ease-in-out infinite alternate |
| Stat cards mount | Stagger `y 12→0`, 40ms apart | 300ms ease-out |
| Playlist cards stagger | `y 16→0`, 50ms apart | 350ms ease-out |
| Nav hover | `translateX 0→4px` | 150ms ease-out (CSS Tailwind) |
| Generate button hover | `scale 1→1.02` + glow | 150ms ease-out |
| Input focus ring | Shadow expand | 200ms ease (CSS) |
| Skeleton loaders | `animate-pulse` | CSS |
| Chart line draw | `pathLength 0→1` | 800ms ease-out |
| Modal open | `scale 0.96→1` + `opacity 0→1` | 200ms ease-out |

All Framer Motion animations wrapped in `useReducedMotion` check — if true, skip translate/scale, use opacity-only fade.

---

## 8. Page Details

### Generator Dashboard (`/`)

```
AtmosphericOrbs (bg)
│
├── Hero Section (max-w-3xl mx-auto text-center)
│   ├── h1: "Extend Your Sound" (headline-xl)
│   ├── p: description (body-lg text-on-surface-variant)
│   └── PlaylistInput + GenerateButton
│
└── Recent Activity Section
    ├── Section label: "Recent Activity" (label-lg)
    └── PlaylistCard × 3 (staggered mount)
```

### Generation History (`/history`)

```
├── Search input + filter chips (status, date range)
├── Results count label
└── PlaylistCard list (paginated, 10/page)
    Each card: thumbnail · title · track count · date · status badge · actions
```

### Playlist Detail (`/history/[id]`)

```
├── Breadcrumb: History > [Playlist Name]
├── Hero: thumbnail + title + metadata row
├── Track list table
│   Columns: # · Track · Artist · Match % · BPM · Key · Actions
└── Acoustic Profile panel (radar chart mini)
```

### Favorites (`/favorites`)

```
└── PlaylistCard grid (2-col desktop, 1-col mobile)
    Empty state: illustration + "No favorites yet" + CTA
```

### AI Statistics (`/stats`)

```
├── Stat cards row (3): Total Tracks · Avg Match Confidence · Top Genres
├── Discovery Growth chart (line/area, full width)
├── Attribute Balance chart (radar, half width)
└── Artist Recommendations (4 cards: avatar · name · match % · play)
```

### Unified Generator Dashboard (`/generator/unified`)

```
Split layout (desktop):
├── Left 50%: PlaylistInput + GenerateButton + config options
└── Right 50%: Live results panel (glass, scrollable)
    Shows tracks as they stream in, with skeleton placeholders
```

---

## 9. Error Handling & Empty States

- API error: toast notification (bottom-right, auto-dismiss 4s, `aria-live="polite"`)
- Empty history: centered illustration + "No generations yet" + "Generate your first" CTA button
- Invalid Spotify URL: inline error below input field (red, `text-error`)
- Loading > 300ms: skeleton cards replace content

---

## 10. Responsiveness

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Sidebar hidden, bottom tab bar (4 tabs: Generator, History, Favorites, Stats) |
| `768px–1024px` | Sidebar icon-only rail `w-[72px]`, labels hidden |
| `≥ 1024px` | Full sidebar `w-[280px]` with labels |

---

## 11. Accessibility

- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons
- Focus ring: `outline-2 outline-offset-2 outline-primary`
- Color not used as sole indicator (badges include text labels)
- `prefers-reduced-motion`: disables translate/scale animations
- Chart: `aria-label` summary on SVG container

---

## 12. Tech Stack

```
Next.js 14         App Router, server components where possible
Tailwind CSS       Custom design tokens (colors, spacing, typography)
Framer Motion      Page transitions, card stagger, modal animations
Recharts           Discovery Growth (area), Attribute Balance (radar)
Lucide React       Icons (supplementing Material Symbols)
Google Fonts       Inter (weights: 300 400 500 600 700)
Google Stitch MCP  Design source of truth (project: 11582237515904702992)
```

---

## 13. File Structure

```
app/
├── layout.tsx                    # Root: fonts, global CSS
├── (app)/
│   ├── layout.tsx                # Shell: Sidebar + AtmosphericOrbs
│   ├── page.tsx                  # Generator Dashboard
│   ├── history/
│   │   ├── page.tsx              # Generation History
│   │   └── [id]/page.tsx        # Playlist Detail
│   ├── favorites/page.tsx        # Favorites
│   ├── stats/page.tsx            # AI Statistics
│   └── generator/unified/page.tsx
components/
├── layout/
│   ├── Sidebar.tsx
│   ├── NavItem.tsx
│   └── BottomTabBar.tsx
├── ui/
│   ├── GlassPanel.tsx
│   ├── AtmosphericOrb.tsx
│   ├── TextGradient.tsx
│   ├── StatCard.tsx
│   ├── PlaylistCard.tsx
│   ├── PlaylistInput.tsx
│   ├── GenerateButton.tsx
│   └── SkeletonCard.tsx
├── charts/
│   ├── DiscoveryGrowthChart.tsx
│   └── AttributeBalanceChart.tsx
└── providers/
    └── MotionProvider.tsx        # useReducedMotion wrapper
lib/
├── stitch.ts                     # Stitch MCP client helpers
└── types.ts                      # Shared TypeScript types
styles/
└── globals.css                   # Tailwind base + CSS custom props
tailwind.config.ts                # Full token config
```
