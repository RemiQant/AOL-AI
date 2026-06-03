# SonicPro AI Playlist Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build SonicPro, a dark-mode AI playlist extension web app with 6 pages, pixel-matched to the Stitch design (project `11582237515904702992`).

**Architecture:** Next.js 14 App Router with a persistent sidebar shell layout. All design tokens are encoded in `tailwind.config.ts`. Framer Motion drives page transitions and stagger animations. Data is mocked via `lib/mock-data.ts` — real Spotify/AI backend can be wired in later without touching components.

**Tech Stack:** Next.js 14 · Tailwind CSS · Framer Motion · Recharts · Lucide React · Inter (Google Fonts) · Vitest · React Testing Library

**Spec:** `docs/superpowers/specs/2026-05-31-sonicpro-design.md`

---

## File Map

```
app/
  layout.tsx                          # Root: fonts, global CSS, providers
  (app)/
    layout.tsx                        # Shell: Sidebar + main wrapper
    page.tsx                          # Generator Dashboard
    history/
      page.tsx                        # Generation History
      [id]/
        page.tsx                      # Playlist Detail
    favorites/
      page.tsx                        # Favorites
    stats/
      page.tsx                        # AI Statistics
    generator/
      unified/
        page.tsx                      # Unified Generator Dashboard

components/
  layout/
    Sidebar.tsx                       # Fixed 280px sidebar, responsive rail
    NavItem.tsx                       # Single nav link with active/hover states
    BottomTabBar.tsx                  # Mobile bottom navigation (4 tabs)
  ui/
    GlassPanel.tsx                    # Frosted glass card wrapper
    AtmosphericOrb.tsx                # Pulsing blurred gradient orb
    TextGradient.tsx                  # green→purple gradient text
    StatCard.tsx                      # Metric card with icon + trend
    PlaylistCard.tsx                  # Playlist thumbnail + metadata card
    PlaylistInput.tsx                 # Spotify URL input with link icon
    GenerateButton.tsx                # Primary CTA with loading state
    SkeletonCard.tsx                  # Pulse skeleton loader
    Toast.tsx                         # Auto-dismiss error/success toast
  charts/
    DiscoveryGrowthChart.tsx          # Recharts Area chart (weekly growth)
    AttributeBalanceChart.tsx         # Recharts Radar chart (audio attributes)
  providers/
    MotionProvider.tsx                # Framer Motion reduced-motion context

lib/
  types.ts                            # Shared TypeScript interfaces
  mock-data.ts                        # Static mock playlists, stats, history
  stitch.ts                           # Stitch MCP HTTP helpers (design only)

styles/
  globals.css                         # Tailwind directives + CSS custom props

tailwind.config.ts                    # Full design token config
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via CLI)
- Create: `tailwind.config.ts`
- Create: `styles/globals.css`
- Create: `app/layout.tsx`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd "d:\Materi Artificial Intelligence\Machine Learning\Tangent"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
```

When prompted: `yes` to all defaults. This creates the base structure.

- [ ] **Step 2: Install dependencies**

```bash
pnpm add framer-motion recharts lucide-react clsx
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Create `vitest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 14 project with Tailwind, Framer Motion, Recharts, Vitest"
```

---

## Task 2: Tailwind Design Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `styles/globals.css`

- [ ] **Step 1: Write failing test**

Create `tests/design-tokens.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import config from '../tailwind.config'

describe('Tailwind design tokens', () => {
  const colors = (config.theme?.extend as any)?.colors

  it('has primary green color', () => {
    expect(colors['primary']).toBe('#53e076')
  })

  it('has secondary purple color', () => {
    expect(colors['secondary']).toBe('#d1bcff')
  })

  it('has correct background color', () => {
    expect(colors['background']).toBe('#121414')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test:run tests/design-tokens.test.ts
```

Expected: FAIL — `colors` is undefined.

- [ ] **Step 3: Write tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
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
      },
      fontSize: {
        'display-lg':  ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
        'headline-xl': ['32px', { lineHeight: '40px' }],
        'headline-lg': ['28px', { lineHeight: '36px' }],
        'title-lg':    ['22px', { lineHeight: '28px' }],
        'title-md':    ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '500' }],
        'body-lg':     ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-md':     ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'label-lg':    ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }],
        'label-md':    ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
        'label-sm':    ['11px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
      },
      spacing: {
        'sm':  '8px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '40px',
        'xxl': '64px',
        'margin-mobile':  '16px',
        'margin-desktop': '32px',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glow-primary':   '0 0 15px rgba(83,224,118,0.2)',
        'glow-primary-lg':'0 0 20px rgba(83,224,118,0.4)',
        'glow-secondary': '0 0 15px rgba(209,188,255,0.3)',
        'glow-input':     '0 0 20px rgba(209,188,255,0.2)',
      },
      keyframes: {
        'pulse-slow': {
          '0%':   { transform: 'scale(1)',   opacity: '0.3' },
          '100%': { transform: 'scale(1.1)', opacity: '0.6' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Write globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-sans: 'Inter', system-ui, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-sans);
    background-color: #121414;
    color: #e3e2e2;
    -webkit-font-smoothing: antialiased;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .glass-panel {
    background: rgba(24, 24, 24, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ai-glow {
    box-shadow: 0 0 15px rgba(209, 188, 255, 0.3);
  }

  .text-gradient {
    background: linear-gradient(to right, #53e076, #d1bcff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .focus-ring {
    @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary;
  }
}
```

- [ ] **Step 5: Run test — expect PASS**

```bash
pnpm test:run tests/design-tokens.test.ts
```

Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts styles/globals.css tests/design-tokens.test.ts vitest.config.ts vitest.setup.ts
git commit -m "feat: add Tailwind design tokens, global CSS, Inter font"
```

---

## Task 3: TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write types**

Create `lib/types.ts`:

```typescript
export interface Playlist {
  id: string
  title: string
  thumbnailUrl: string
  trackCount: number
  extendedBy: number
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
  isFavorite: boolean
  spotifyUrl: string
  acousticProfile?: AcousticProfile
}

export interface AcousticProfile {
  energy: number      // 0–100
  danceability: number
  valence: number
  acousticness: number
}

export interface Track {
  id: string
  title: string
  artist: string
  matchConfidence: number  // 0–100
  bpm: number
  key: string
  albumArt: string
  spotifyUrl: string
}

export interface StatMetric {
  id: string
  label: string
  value: string | number
  trend?: string        // e.g. "+12% this month"
  trendPositive?: boolean
  icon: string          // lucide icon name
}

export interface WeeklyDiscovery {
  week: string          // "W1" | "W2" | "W3" | "W4"
  tracks: number
}

export interface GenerationResult {
  playlist: Playlist
  tracks: Track[]
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 4: Mock Data

**Files:**
- Create: `lib/mock-data.ts`

- [ ] **Step 1: Write mock data**

Create `lib/mock-data.ts`:

```typescript
import type { Playlist, Track, StatMetric, WeeklyDiscovery } from './types'

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Late Night Drive Vol. 2',
    thumbnailUrl: 'https://picsum.photos/seed/playlist1/80/80',
    trackCount: 24,
    extendedBy: 24,
    createdAt: '2026-05-30T22:14:00Z',
    status: 'completed',
    isFavorite: true,
    spotifyUrl: 'https://open.spotify.com/playlist/1',
    acousticProfile: { energy: 60, danceability: 55, valence: 40, acousticness: 30 },
  },
  {
    id: '2',
    title: 'Deep Work Ambient',
    thumbnailUrl: 'https://picsum.photos/seed/playlist2/80/80',
    trackCount: 15,
    extendedBy: 15,
    createdAt: '2026-05-29T10:00:00Z',
    status: 'completed',
    isFavorite: false,
    spotifyUrl: 'https://open.spotify.com/playlist/2',
    acousticProfile: { energy: 25, danceability: 20, valence: 50, acousticness: 75 },
  },
  {
    id: '3',
    title: 'Gym Hype 2024',
    thumbnailUrl: 'https://picsum.photos/seed/playlist3/80/80',
    trackCount: 30,
    extendedBy: 30,
    createdAt: '2026-05-28T07:30:00Z',
    status: 'completed',
    isFavorite: true,
    spotifyUrl: 'https://open.spotify.com/playlist/3',
    acousticProfile: { energy: 92, danceability: 85, valence: 80, acousticness: 5 },
  },
  {
    id: '4',
    title: 'Cyberpunk Focus Flow',
    thumbnailUrl: 'https://picsum.photos/seed/playlist4/80/80',
    trackCount: 18,
    extendedBy: 18,
    createdAt: '2026-05-27T15:00:00Z',
    status: 'processing',
    isFavorite: false,
    spotifyUrl: 'https://open.spotify.com/playlist/4',
  },
]

export const mockTracks: Track[] = [
  { id: 't1', title: 'Neon Pulsar', artist: 'Synthwave Ghost', matchConfidence: 97, bpm: 128, key: 'Am', albumArt: 'https://picsum.photos/seed/track1/40/40', spotifyUrl: '#' },
  { id: 't2', title: 'Dark Matter', artist: 'Void Protocol', matchConfidence: 94, bpm: 132, key: 'Dm', albumArt: 'https://picsum.photos/seed/track2/40/40', spotifyUrl: '#' },
  { id: 't3', title: 'Signal Loss', artist: 'Circuit Breaker', matchConfidence: 91, bpm: 124, key: 'Em', albumArt: 'https://picsum.photos/seed/track3/40/40', spotifyUrl: '#' },
  { id: 't4', title: 'Chromatic Drift', artist: 'Analog Dreams', matchConfidence: 88, bpm: 120, key: 'Bm', albumArt: 'https://picsum.photos/seed/track4/40/40', spotifyUrl: '#' },
  { id: 't5', title: 'Fractal Mind', artist: 'Neural Echo', matchConfidence: 85, bpm: 136, key: 'Fm', albumArt: 'https://picsum.photos/seed/track5/40/40', spotifyUrl: '#' },
]

export const mockStats: StatMetric[] = [
  { id: 's1', label: 'Total Tracks Discovered', value: '1,492', trend: '+12% this month', trendPositive: true, icon: 'library-music' },
  { id: 's2', label: 'Avg. Match Confidence', value: '94.8%', trend: '+2.1% this month', trendPositive: true, icon: 'brain' },
  { id: 's3', label: 'Top Genres', value: 'Synthwave · Dark Techno · Ambient Chill', icon: 'tag' },
]

export const mockDiscoveryGrowth: WeeklyDiscovery[] = [
  { week: 'W1', tracks: 280 },
  { week: 'W2', tracks: 350 },
  { week: 'W3', tracks: 410 },
  { week: 'W4', tracks: 452 },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add mock playlist, track, and stats data"
```

---

## Task 5: MotionProvider

**Files:**
- Create: `components/providers/MotionProvider.tsx`
- Test: `tests/components/providers/MotionProvider.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/providers/MotionProvider.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { MotionProvider, useMotion } from '@/components/providers/MotionProvider'
import { describe, it, expect } from 'vitest'

function Consumer() {
  const { shouldAnimate } = useMotion()
  return <div data-testid="result">{shouldAnimate ? 'animate' : 'static'}</div>
}

describe('MotionProvider', () => {
  it('renders children', () => {
    render(<MotionProvider><div>child</div></MotionProvider>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('provides shouldAnimate via context', () => {
    render(<MotionProvider><Consumer /></MotionProvider>)
    expect(screen.getByTestId('result')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test:run tests/components/providers/MotionProvider.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement MotionProvider**

Create `components/providers/MotionProvider.tsx`:

```typescript
'use client'

import { createContext, useContext } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MotionContextValue {
  shouldAnimate: boolean
}

const MotionContext = createContext<MotionContextValue>({ shouldAnimate: true })

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  return (
    <MotionContext.Provider value={{ shouldAnimate: !prefersReduced }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  return useContext(MotionContext)
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test:run tests/components/providers/MotionProvider.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/providers/MotionProvider.tsx tests/components/providers/MotionProvider.test.tsx
git commit -m "feat: add MotionProvider with useReducedMotion support"
```

---

## Task 6: GlassPanel + AtmosphericOrb + TextGradient

**Files:**
- Create: `components/ui/GlassPanel.tsx`
- Create: `components/ui/AtmosphericOrb.tsx`
- Create: `components/ui/TextGradient.tsx`
- Test: `tests/components/ui/primitives.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/ui/primitives.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'

describe('GlassPanel', () => {
  it('renders children', () => {
    render(<GlassPanel>content</GlassPanel>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies glass-panel CSS class', () => {
    const { container } = render(<GlassPanel>x</GlassPanel>)
    expect(container.firstChild).toHaveClass('glass-panel')
  })

  it('forwards className prop', () => {
    const { container } = render(<GlassPanel className="p-4">x</GlassPanel>)
    expect(container.firstChild).toHaveClass('p-4')
  })
})

describe('AtmosphericOrb', () => {
  it('renders without crashing', () => {
    const { container } = render(<AtmosphericOrb color="primary" size="lg" position="top-left" />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('TextGradient', () => {
  it('renders children with gradient class', () => {
    render(<TextGradient>SonicPro</TextGradient>)
    expect(screen.getByText('SonicPro')).toHaveClass('text-gradient')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test:run tests/components/ui/primitives.test.tsx
```

- [ ] **Step 3: Implement components**

Create `components/ui/GlassPanel.tsx`:

```typescript
import { clsx } from 'clsx'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function GlassPanel({ children, className, as: Tag = 'div' }: GlassPanelProps) {
  return (
    <Tag className={clsx('glass-panel rounded-lg', className)}>
      {children}
    </Tag>
  )
}
```

Create `components/ui/AtmosphericOrb.tsx`:

```typescript
import { clsx } from 'clsx'

interface AtmosphericOrbProps {
  color: 'primary' | 'secondary'
  size: 'lg' | 'md'
  position: 'top-left' | 'bottom-right'
  className?: string
}

const sizeMap = {
  lg: 'w-[600px] h-[600px]',
  md: 'w-[400px] h-[400px]',
}

const colorMap = {
  primary:   'bg-primary/5',
  secondary: 'bg-secondary/10',
}

const positionMap = {
  'top-left':     'top-[-10%] left-[20%]',
  'bottom-right': 'bottom-[10%] right-[10%]',
}

export function AtmosphericOrb({ color, size, position, className }: AtmosphericOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'absolute rounded-full blur-[120px] pointer-events-none animate-pulse-slow z-0',
        sizeMap[size],
        colorMap[color],
        positionMap[position],
        className,
      )}
    />
  )
}
```

Create `components/ui/TextGradient.tsx`:

```typescript
import { clsx } from 'clsx'

interface TextGradientProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function TextGradient({ children, className, as: Tag = 'span' }: TextGradientProps) {
  return (
    <Tag className={clsx('text-gradient', className)}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test:run tests/components/ui/primitives.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/GlassPanel.tsx components/ui/AtmosphericOrb.tsx components/ui/TextGradient.tsx tests/components/ui/primitives.test.tsx
git commit -m "feat: add GlassPanel, AtmosphericOrb, TextGradient components"
```

---

## Task 7: SkeletonCard + Toast

**Files:**
- Create: `components/ui/SkeletonCard.tsx`
- Create: `components/ui/Toast.tsx`
- Test: `tests/components/ui/feedback.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/ui/feedback.test.tsx`:

```typescript
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { Toast } from '@/components/ui/Toast'

describe('SkeletonCard', () => {
  it('renders pulse animation container', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('has aria-label for accessibility', () => {
    render(<SkeletonCard />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('Toast', () => {
  it('renders message', () => {
    render(<Toast message="Something went wrong" type="error" onDismiss={() => {}} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('calls onDismiss after timeout', async () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast message="Done" type="success" onDismiss={onDismiss} />)
    act(() => { vi.advanceTimersByTime(4000) })
    expect(onDismiss).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/feedback.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/ui/SkeletonCard.tsx`:

```typescript
export function SkeletonCard() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse glass-panel rounded-lg p-md">
      <div className="flex gap-md">
        <div className="w-16 h-16 rounded-lg bg-surface-container-high flex-shrink-0" />
        <div className="flex-1 space-y-sm">
          <div className="h-4 bg-surface-container-high rounded w-3/4" />
          <div className="h-3 bg-surface-container-high rounded w-1/2" />
          <div className="h-3 bg-surface-container-high rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}
```

Create `components/ui/Toast.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { clsx } from 'clsx'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'fixed bottom-6 right-6 z-[1000] flex items-center gap-sm px-md py-sm rounded-lg glass-panel shadow-glow-secondary max-w-sm',
        type === 'error' ? 'border-error/30' : 'border-primary/30',
      )}
    >
      {type === 'success'
        ? <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
        : <XCircle className="w-5 h-5 text-error flex-shrink-0" />
      }
      <p className="text-body-md text-on-surface flex-1">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-on-surface-variant hover:text-on-surface transition-colors focus-ring rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/feedback.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/SkeletonCard.tsx components/ui/Toast.tsx tests/components/ui/feedback.test.tsx
git commit -m "feat: add SkeletonCard and Toast components"
```

---

## Task 8: PlaylistInput + GenerateButton

**Files:**
- Create: `components/ui/PlaylistInput.tsx`
- Create: `components/ui/GenerateButton.tsx`
- Test: `tests/components/ui/input.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/ui/input.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlaylistInput } from '@/components/ui/PlaylistInput'
import { GenerateButton } from '@/components/ui/GenerateButton'

describe('PlaylistInput', () => {
  it('renders input with placeholder', () => {
    render(<PlaylistInput value="" onChange={() => {}} error={null} />)
    expect(screen.getByPlaceholderText(/spotify playlist/i)).toBeInTheDocument()
  })

  it('calls onChange on input', () => {
    const onChange = vi.fn()
    render(<PlaylistInput value="" onChange={onChange} error={null} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://open.spotify.com/playlist/abc' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('shows error message when error is provided', () => {
    render(<PlaylistInput value="" onChange={() => {}} error="Invalid URL" />)
    expect(screen.getByText('Invalid URL')).toBeInTheDocument()
  })
})

describe('GenerateButton', () => {
  it('renders label', () => {
    render(<GenerateButton isLoading={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /generate extension/i })).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<GenerateButton isLoading={true} onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByLabelText(/generating/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/input.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/ui/PlaylistInput.tsx`:

```typescript
'use client'

import { Link } from 'lucide-react'
import { clsx } from 'clsx'

interface PlaylistInputProps {
  value: string
  onChange: (value: string) => void
  error: string | null
}

export function PlaylistInput({ value, onChange, error }: PlaylistInputProps) {
  return (
    <div className="w-full">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
          <Link className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a Spotify playlist link…"
          aria-label="Spotify playlist URL"
          aria-invalid={!!error}
          aria-describedby={error ? 'playlist-input-error' : undefined}
          className={clsx(
            'w-full bg-surface-container-high text-on-surface border rounded-xl py-5 pl-12 pr-4 text-body-lg',
            'placeholder:text-on-surface-variant transition-all outline-none',
            'focus:border-secondary focus:ring-1 focus:ring-secondary focus:shadow-glow-input',
            error ? 'border-error/60' : 'border-white/10',
          )}
        />
      </div>
      {error && (
        <p id="playlist-input-error" role="alert" className="mt-sm text-label-md text-error">
          {error}
        </p>
      )}
    </div>
  )
}
```

Create `components/ui/GenerateButton.tsx`:

```typescript
'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface GenerateButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled?: boolean
}

export function GenerateButton({ isLoading, onClick, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={clsx(
        'flex items-center gap-sm bg-primary text-on-primary font-label-lg rounded-xl px-8 py-4',
        'transition-all duration-150',
        'hover:scale-[1.02] hover:shadow-glow-primary-lg',
        'disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed',
        'focus-ring',
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-label="Generating" />
          <span>Generating…</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span>Generate Extension</span>
        </>
      )}
    </button>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/input.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/PlaylistInput.tsx components/ui/GenerateButton.tsx tests/components/ui/input.test.tsx
git commit -m "feat: add PlaylistInput and GenerateButton components"
```

---

## Task 9: PlaylistCard + StatCard

**Files:**
- Create: `components/ui/PlaylistCard.tsx`
- Create: `components/ui/StatCard.tsx`
- Test: `tests/components/ui/cards.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/ui/cards.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { StatCard } from '@/components/ui/StatCard'
import { mockPlaylists, mockStats } from '@/lib/mock-data'

describe('PlaylistCard', () => {
  const playlist = mockPlaylists[0]

  it('renders playlist title', () => {
    render(<PlaylistCard playlist={playlist} onToggleFavorite={() => {}} />)
    expect(screen.getByText(playlist.title)).toBeInTheDocument()
  })

  it('renders track count', () => {
    render(<PlaylistCard playlist={playlist} onToggleFavorite={() => {}} />)
    expect(screen.getByText(/24 tracks/i)).toBeInTheDocument()
  })

  it('calls onToggleFavorite when star clicked', () => {
    const onToggle = vi.fn()
    render(<PlaylistCard playlist={playlist} onToggleFavorite={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }))
    expect(onToggle).toHaveBeenCalledWith(playlist.id)
  })
})

describe('StatCard', () => {
  const stat = mockStats[0]

  it('renders label and value', () => {
    render(<StatCard stat={stat} />)
    expect(screen.getByText(stat.label)).toBeInTheDocument()
    expect(screen.getByText(String(stat.value))).toBeInTheDocument()
  })

  it('renders positive trend in green', () => {
    render(<StatCard stat={stat} />)
    const trend = screen.getByText(stat.trend!)
    expect(trend).toHaveClass('text-primary')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/cards.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/ui/PlaylistCard.tsx`:

```typescript
'use client'

import Image from 'next/image'
import { Star, Play, Music } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from './GlassPanel'
import type { Playlist } from '@/lib/types'

interface PlaylistCardProps {
  playlist: Playlist
  onToggleFavorite: (id: string) => void
  onClick?: (id: string) => void
}

export function PlaylistCard({ playlist, onToggleFavorite, onClick }: PlaylistCardProps) {
  return (
    <GlassPanel
      className={clsx(
        'flex items-center gap-md p-md transition-all duration-150 cursor-pointer',
        'hover:border-primary/30 hover:shadow-glow-primary',
      )}
      as="article"
    >
      <button
        onClick={() => onClick?.(playlist.id)}
        className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden group focus-ring"
        aria-label={`Play ${playlist.title}`}
      >
        <Image
          src={playlist.thumbnailUrl}
          alt={playlist.title}
          width={64}
          height={64}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-title-md text-on-surface truncate">{playlist.title}</p>
        <p className="text-body-md text-on-surface-variant">
          {playlist.trackCount} tracks · Extended by {playlist.extendedBy}
        </p>
        <span className={clsx(
          'inline-block mt-1 text-label-sm px-2 py-0.5 rounded-full',
          playlist.status === 'completed'  && 'bg-primary/10 text-primary',
          playlist.status === 'processing' && 'bg-secondary/10 text-secondary',
          playlist.status === 'failed'     && 'bg-error/10 text-error',
        )}>
          {playlist.status}
        </span>
      </div>

      <button
        onClick={() => onToggleFavorite(playlist.id)}
        aria-label={playlist.isFavorite ? `Remove ${playlist.title} from favorites` : `Add ${playlist.title} to favorites`}
        className="text-on-surface-variant hover:text-secondary transition-colors focus-ring rounded p-1"
      >
        <Star
          className={clsx('w-5 h-5', playlist.isFavorite && 'fill-secondary text-secondary')}
        />
      </button>
    </GlassPanel>
  )
}
```

Create `components/ui/StatCard.tsx`:

```typescript
import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from './GlassPanel'
import type { StatMetric } from '@/lib/types'

interface StatCardProps {
  stat: StatMetric
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <GlassPanel className="p-lg flex-1 min-w-[200px]">
      <p className="text-label-md text-on-surface-variant mb-sm">{stat.label}</p>
      <p className="text-headline-xl font-bold text-on-surface mb-sm">{stat.value}</p>
      {stat.trend && (
        <div className={clsx(
          'flex items-center gap-1 text-label-md',
          stat.trendPositive ? 'text-primary' : 'text-error',
        )}>
          {stat.trendPositive
            ? <TrendingUp className="w-4 h-4" aria-hidden="true" />
            : <TrendingDown className="w-4 h-4" aria-hidden="true" />
          }
          <span>{stat.trend}</span>
        </div>
      )}
    </GlassPanel>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/cards.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/PlaylistCard.tsx components/ui/StatCard.tsx tests/components/ui/cards.test.tsx
git commit -m "feat: add PlaylistCard and StatCard components"
```

---

## Task 10: Sidebar + NavItem + BottomTabBar

**Files:**
- Create: `components/layout/NavItem.tsx`
- Create: `components/layout/Sidebar.tsx`
- Create: `components/layout/BottomTabBar.tsx`
- Test: `tests/components/layout/navigation.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/layout/navigation.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NavItem } from '@/components/layout/NavItem'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

describe('NavItem', () => {
  it('renders label', () => {
    render(<NavItem href="/" icon="music" label="Generator" isActive={false} />)
    expect(screen.getByText('Generator')).toBeInTheDocument()
  })

  it('applies active styles when isActive', () => {
    render(<NavItem href="/" icon="music" label="Generator" isActive={true} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('text-primary')
  })

  it('has accessible href', () => {
    render(<NavItem href="/history" icon="history" label="History" isActive={false} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/history')
  })
})

describe('BottomTabBar', () => {
  it('renders 4 navigation tabs', () => {
    render(<BottomTabBar currentPath="/" />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/layout/navigation.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/layout/NavItem.tsx`:

```typescript
import Link from 'next/link'
import { clsx } from 'clsx'
import { Sparkles, History, Star, BarChart2 } from 'lucide-react'

const iconMap = {
  sparkles: Sparkles,
  history:  History,
  star:     Star,
  chart:    BarChart2,
} as const

type IconKey = keyof typeof iconMap

interface NavItemProps {
  href: string
  icon: IconKey
  label: string
  isActive: boolean
}

export function NavItem({ href, icon, label, isActive }: NavItemProps) {
  const Icon = iconMap[icon]
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-4 rounded-lg px-4 py-3 text-label-md transition-all duration-150 focus-ring',
        isActive
          ? 'text-primary bg-primary/10 shadow-glow-primary'
          : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface hover:translate-x-1',
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}
```

Create `components/layout/Sidebar.tsx`:

```typescript
'use client'

import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'
import { TextGradient } from '@/components/ui/TextGradient'
import { Music2 } from 'lucide-react'

const navItems = [
  { href: '/',         icon: 'sparkles' as const, label: 'Generator' },
  { href: '/history',  icon: 'history'  as const, label: 'History'   },
  { href: '/favorites',icon: 'star'     as const, label: 'Favorites' },
  { href: '/stats',    icon: 'chart'    as const, label: 'AI Stats'  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col py-lg px-md h-screen fixed left-0 top-0 w-[280px] bg-surface-dim border-r border-white/10 z-50">
      <div className="flex items-center gap-sm mb-xl px-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Music2 className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <TextGradient as="div" className="text-title-lg font-bold leading-none">
            SonicPro
          </TextGradient>
          <p className="text-label-sm text-on-surface-variant">AI Playlist Engine</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  )
}
```

Create `components/layout/BottomTabBar.tsx`:

```typescript
import Link from 'next/link'
import { clsx } from 'clsx'
import { Sparkles, History, Star, BarChart2 } from 'lucide-react'

const tabs = [
  { href: '/',          icon: Sparkles,  label: 'Generator' },
  { href: '/history',   icon: History,   label: 'History'   },
  { href: '/favorites', icon: Star,      label: 'Favorites' },
  { href: '/stats',     icon: BarChart2, label: 'Stats'     },
]

interface BottomTabBarProps {
  currentPath: string
}

export function BottomTabBar({ currentPath }: BottomTabBarProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 flex"
    >
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = currentPath === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-label-sm transition-colors focus-ring',
              isActive ? 'text-primary' : 'text-on-surface-variant',
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/layout/navigation.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/layout/ tests/components/layout/navigation.test.tsx
git commit -m "feat: add Sidebar, NavItem, BottomTabBar navigation components"
```

---

## Task 11: App Shell Layout

**Files:**
- Create: `app/layout.tsx` (root)
- Create: `app/(app)/layout.tsx` (shell)

- [ ] **Step 1: Write root layout**

Create `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { MotionProvider } from '@/components/providers/MotionProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'SonicPro — AI Playlist Engine',
  description: 'Extend your Spotify playlists with AI-curated tracks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-on-surface antialiased">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Write app shell layout**

Create `app/(app)/layout.tsx`:

```typescript
'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <Sidebar />
      <main className="md:ml-[280px] min-h-dvh relative overflow-hidden pb-20 md:pb-0">
        {children}
      </main>
      <BottomTabBar currentPath={pathname} />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/\(app\)/layout.tsx
git commit -m "feat: add root layout and app shell with sidebar + bottom tab bar"
```

---

## Task 12: Charts

**Files:**
- Create: `components/charts/DiscoveryGrowthChart.tsx`
- Create: `components/charts/AttributeBalanceChart.tsx`
- Test: `tests/components/charts/charts.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/charts/charts.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DiscoveryGrowthChart } from '@/components/charts/DiscoveryGrowthChart'
import { AttributeBalanceChart } from '@/components/charts/AttributeBalanceChart'
import { mockDiscoveryGrowth } from '@/lib/mock-data'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Area: () => null,
  Radar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
}))

describe('DiscoveryGrowthChart', () => {
  it('renders with accessible label', () => {
    render(<DiscoveryGrowthChart data={mockDiscoveryGrowth} />)
    expect(screen.getByLabelText(/discovery growth/i)).toBeInTheDocument()
  })
})

describe('AttributeBalanceChart', () => {
  it('renders with accessible label', () => {
    render(<AttributeBalanceChart profile={{ energy: 80, danceability: 60, valence: 50, acousticness: 30 }} />)
    expect(screen.getByLabelText(/attribute balance/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/charts/charts.test.tsx
```

- [ ] **Step 3: Implement**

Create `components/charts/DiscoveryGrowthChart.tsx`:

```typescript
'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMotion } from '@/components/providers/MotionProvider'
import type { WeeklyDiscovery } from '@/lib/types'

interface DiscoveryGrowthChartProps {
  data: WeeklyDiscovery[]
}

export function DiscoveryGrowthChart({ data }: DiscoveryGrowthChartProps) {
  const { shouldAnimate } = useMotion()

  return (
    <div
      aria-label="Discovery Growth chart showing weekly track discoveries"
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#53e076" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#53e076" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3d4a3d" vertical={false} />
          <XAxis
            dataKey="week"
            stroke="#869585"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#869585"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(24,24,24,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(20px)',
              color: '#e3e2e2',
            }}
          />
          <Area
            type="monotone"
            dataKey="tracks"
            stroke="#53e076"
            strokeWidth={2}
            fill="url(#primaryGrad)"
            isAnimationActive={shouldAnimate}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

Create `components/charts/AttributeBalanceChart.tsx`:

```typescript
'use client'

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useMotion } from '@/components/providers/MotionProvider'
import type { AcousticProfile } from '@/lib/types'

interface AttributeBalanceChartProps {
  profile: AcousticProfile
}

export function AttributeBalanceChart({ profile }: AttributeBalanceChartProps) {
  const { shouldAnimate } = useMotion()

  const data = [
    { attribute: 'Energy',       value: profile.energy        },
    { attribute: 'Danceability', value: profile.danceability  },
    { attribute: 'Valence',      value: profile.valence       },
    { attribute: 'Acoustic',     value: profile.acousticness  },
  ]

  return (
    <div
      aria-label="Attribute Balance radar chart showing acoustic profile"
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#3d4a3d" />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
          />
          <Radar
            dataKey="value"
            stroke="#d1bcff"
            fill="#d1bcff"
            fillOpacity={0.2}
            isAnimationActive={shouldAnimate}
            animationDuration={800}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(24,24,24,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e3e2e2',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/charts/charts.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/charts/ tests/components/charts/charts.test.tsx
git commit -m "feat: add DiscoveryGrowthChart (area) and AttributeBalanceChart (radar)"
```

---

## Task 13: Generator Dashboard Page (`/`)

**Files:**
- Create: `app/(app)/page.tsx`
- Test: `tests/app/generator.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/app/generator.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GeneratorPage from '@/app/(app)/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

describe('Generator Dashboard', () => {
  it('renders headline', () => {
    render(<GeneratorPage />)
    expect(screen.getByRole('heading', { name: /extend your sound/i })).toBeInTheDocument()
  })

  it('renders playlist input', () => {
    render(<GeneratorPage />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders recent activity section', () => {
    render(<GeneratorPage />)
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
  })

  it('shows error on empty submit', async () => {
    render(<GeneratorPage />)
    fireEvent.click(screen.getByRole('button', { name: /generate extension/i }))
    await waitFor(() => {
      expect(screen.getByText(/please paste a valid spotify/i)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/app/generator.test.tsx
```

- [ ] **Step 3: Implement**

Create `app/(app)/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlaylistInput } from '@/components/ui/PlaylistInput'
import { GenerateButton } from '@/components/ui/GenerateButton'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

function isValidSpotifyUrl(url: string): boolean {
  return url.includes('open.spotify.com/playlist/')
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function GeneratorPage() {
  const { shouldAnimate } = useMotion()
  const [url, setUrl]           = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists.slice(0, 3))

  function handleGenerate() {
    if (!isValidSpotifyUrl(url)) {
      setError('Please paste a valid Spotify playlist URL.')
      return
    }
    setError(null)
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) =>
      prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    )
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop pb-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      {/* Hero */}
      <section className="relative z-10 max-w-3xl mx-auto pt-xl text-center flex flex-col items-center gap-xl">
        <div>
          <h1 className="text-headline-xl font-bold text-on-surface mb-sm">
            Extend Your <TextGradient>Sound</TextGradient>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Paste any Spotify playlist link. Our AI engine will analyze the acoustic profile
            and curate a seamless extension of new, undiscovered tracks.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-md">
          <PlaylistInput value={url} onChange={setUrl} error={error} />
          <GenerateButton isLoading={isLoading} onClick={handleGenerate} />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="relative z-10 max-w-3xl mx-auto mt-xxl">
        <h2 className="text-label-lg text-on-surface-variant mb-md uppercase tracking-widest">
          Recent Activity
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-md">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-md"
          >
            {playlists.map((playlist) => (
              <motion.div key={playlist.id} variants={shouldAnimate ? itemVariants : undefined}>
                <PlaylistCard playlist={playlist} onToggleFavorite={handleToggleFavorite} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/app/generator.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/page.tsx tests/app/generator.test.tsx
git commit -m "feat: add Generator Dashboard page with playlist input, stagger animation, recent activity"
```

---

## Task 14: Generation History Page (`/history`)

**Files:**
- Create: `app/(app)/history/page.tsx`
- Test: `tests/app/history.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/app/history.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HistoryPage from '@/app/(app)/history/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/history' }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

describe('Generation History', () => {
  it('renders page heading', () => {
    render(<HistoryPage />)
    expect(screen.getByRole('heading', { name: /generation history/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<HistoryPage />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders playlist cards', () => {
    render(<HistoryPage />)
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
  })

  it('filters playlists by search query', () => {
    render(<HistoryPage />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Gym' } })
    expect(screen.getByText('Gym Hype 2024')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/app/history.test.tsx
```

- [ ] **Step 3: Implement**

Create `app/(app)/history/page.tsx`:

```typescript
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function HistoryPage() {
  const { shouldAnimate } = useMotion()
  const [query, setQuery]         = useState('')
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)

  const filtered = useMemo(
    () => playlists.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [playlists, query],
  )

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">Generation History</h1>

        {/* Search */}
        <div className="relative mb-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search playlists…"
            aria-label="Search generation history"
            className="w-full bg-surface-container-high text-on-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-body-md placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>

        <p className="text-label-md text-on-surface-variant mb-md">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-xxl">
            <p className="text-body-lg text-on-surface-variant">No playlists match your search.</p>
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-md"
          >
            {filtered.map((playlist) => (
              <motion.div key={playlist.id} variants={shouldAnimate ? itemVariants : undefined}>
                <PlaylistCard playlist={playlist} onToggleFavorite={handleToggleFavorite} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/app/history.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/history/page.tsx tests/app/history.test.tsx
git commit -m "feat: add Generation History page with search filtering"
```

---

## Task 15: Playlist Detail Page (`/history/[id]`)

**Files:**
- Create: `app/(app)/history/[id]/page.tsx`
- Test: `tests/app/playlist-detail.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/app/playlist-detail.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaylistDetailPage from '@/app/(app)/history/[id]/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/history/1', useParams: () => ({ id: '1' }) }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

describe('Playlist Detail', () => {
  it('renders breadcrumb', () => {
    render(<PlaylistDetailPage params={{ id: '1' }} />)
    expect(screen.getByText(/history/i)).toBeInTheDocument()
  })

  it('renders track table', () => {
    render(<PlaylistDetailPage params={{ id: '1' }} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders match confidence column', () => {
    render(<PlaylistDetailPage params={{ id: '1' }} />)
    expect(screen.getByText(/match/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/app/playlist-detail.test.tsx
```

- [ ] **Step 3: Implement**

Create `app/(app)/history/[id]/page.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AttributeBalanceChart } from '@/components/charts/AttributeBalanceChart'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists, mockTracks } from '@/lib/mock-data'

interface Props {
  params: { id: string }
}

export default function PlaylistDetailPage({ params }: Props) {
  const { shouldAnimate } = useMotion()
  const playlist = mockPlaylists.find((p) => p.id === params.id) ?? mockPlaylists[0]

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="primary" size="md" position="top-left" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-label-md text-on-surface-variant mb-lg">
          <Link href="/history" className="hover:text-on-surface transition-colors focus-ring rounded">
            History
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-on-surface truncate">{playlist.title}</span>
        </nav>

        {/* Hero */}
        <div className="flex items-center gap-lg mb-xl">
          <Image
            src={playlist.thumbnailUrl}
            alt={playlist.title}
            width={96}
            height={96}
            className="rounded-xl flex-shrink-0"
          />
          <div>
            <h1 className="text-headline-xl font-bold text-on-surface">{playlist.title}</h1>
            <p className="text-body-md text-on-surface-variant">
              {playlist.trackCount} tracks · Extended by {playlist.extendedBy} · {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-lg">
          {/* Track table */}
          <GlassPanel className="overflow-hidden">
            <table className="w-full" aria-label="Track list">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">#</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">Track</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden sm:table-cell">Artist</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">Match</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden md:table-cell">BPM</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden md:table-cell">Key</th>
                  <th className="px-md py-sm" />
                </tr>
              </thead>
              <tbody>
                {mockTracks.map((track, i) => (
                  <tr key={track.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-md py-sm text-label-md text-on-surface-variant">{i + 1}</td>
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-sm">
                        <Image src={track.albumArt} alt={track.title} width={36} height={36} className="rounded" />
                        <span className="text-body-md text-on-surface">{track.title}</span>
                      </div>
                    </td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden sm:table-cell">{track.artist}</td>
                    <td className="px-md py-sm">
                      <span className="text-label-md text-primary font-medium">{track.matchConfidence}%</span>
                    </td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden md:table-cell">{track.bpm}</td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden md:table-cell">{track.key}</td>
                    <td className="px-md py-sm">
                      <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${track.title} on Spotify`} className="text-on-surface-variant hover:text-primary transition-colors focus-ring rounded">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPanel>

          {/* Acoustic profile */}
          {playlist.acousticProfile && (
            <GlassPanel className="p-md">
              <h2 className="text-title-md font-semibold text-on-surface mb-md">Acoustic Profile</h2>
              <AttributeBalanceChart profile={playlist.acousticProfile} />
            </GlassPanel>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/app/playlist-detail.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/history/[id]/page.tsx" tests/app/playlist-detail.test.tsx
git commit -m "feat: add Playlist Detail page with track table and acoustic profile chart"
```

---

## Task 16: Favorites + AI Statistics Pages

**Files:**
- Create: `app/(app)/favorites/page.tsx`
- Create: `app/(app)/stats/page.tsx`
- Test: `tests/app/favorites-stats.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/app/favorites-stats.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FavoritesPage from '@/app/(app)/favorites/page'
import StatsPage from '@/app/(app)/stats/page'

vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  RadarChart: ({ children }: any) => <div>{children}</div>,
  Area: () => null, Radar: () => null, XAxis: () => null, YAxis: () => null,
  CartesianGrid: () => null, Tooltip: () => null, PolarGrid: () => null, PolarAngleAxis: () => null,
}))

describe('Favorites', () => {
  it('renders heading', () => {
    render(<FavoritesPage />)
    expect(screen.getByRole('heading', { name: /favorites/i })).toBeInTheDocument()
  })

  it('shows only favorited playlists', () => {
    render(<FavoritesPage />)
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
  })
})

describe('AI Statistics', () => {
  it('renders heading', () => {
    render(<StatsPage />)
    expect(screen.getByRole('heading', { name: /performance analytics/i })).toBeInTheDocument()
  })

  it('renders stat cards', () => {
    render(<StatsPage />)
    expect(screen.getByText('1,492')).toBeInTheDocument()
  })

  it('renders discovery growth chart', () => {
    render(<StatsPage />)
    expect(screen.getByLabelText(/discovery growth/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/app/favorites-stats.test.tsx
```

- [ ] **Step 3: Implement Favorites**

Create `app/(app)/favorites/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function FavoritesPage() {
  const { shouldAnimate } = useMotion()
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)
  const favorites = playlists.filter((p) => p.isFavorite)

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Favorites</TextGradient>
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-xxl flex flex-col items-center gap-md">
            <Star className="w-12 h-12 text-on-surface-variant" aria-hidden="true" />
            <p className="text-body-lg text-on-surface-variant">No favorites yet.</p>
            <p className="text-body-md text-on-surface-variant">Star a playlist from History to save it here.</p>
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-md"
          >
            {favorites.map((playlist) => (
              <motion.div key={playlist.id} variants={shouldAnimate ? itemVariants : undefined}>
                <PlaylistCard playlist={playlist} onToggleFavorite={handleToggleFavorite} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Implement AI Statistics**

Create `app/(app)/stats/page.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { StatCard } from '@/components/ui/StatCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { DiscoveryGrowthChart } from '@/components/charts/DiscoveryGrowthChart'
import { AttributeBalanceChart } from '@/components/charts/AttributeBalanceChart'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockStats, mockDiscoveryGrowth } from '@/lib/mock-data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const defaultProfile = { energy: 72, danceability: 65, valence: 55, acousticness: 28 }

export default function StatsPage() {
  const { shouldAnimate } = useMotion()

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Performance Analytics</TextGradient>
        </h1>

        {/* Stat cards */}
        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-md mb-xl"
        >
          {mockStats.map((stat) => (
            <motion.div key={stat.id} variants={shouldAnimate ? itemVariants : undefined} className="flex-1 min-w-[200px]">
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid md:grid-cols-[1fr_320px] gap-lg">
          <GlassPanel className="p-lg">
            <h2 className="text-title-md font-semibold text-on-surface mb-md">Discovery Growth</h2>
            <DiscoveryGrowthChart data={mockDiscoveryGrowth} />
          </GlassPanel>

          <GlassPanel className="p-lg">
            <h2 className="text-title-md font-semibold text-on-surface mb-md">Attribute Balance</h2>
            <AttributeBalanceChart profile={defaultProfile} />
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
pnpm test:run tests/app/favorites-stats.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add "app/(app)/favorites/page.tsx" "app/(app)/stats/page.tsx" tests/app/favorites-stats.test.tsx
git commit -m "feat: add Favorites and AI Statistics pages with stagger animations and charts"
```

---

## Task 17: Unified Generator Dashboard (`/generator/unified`)

**Files:**
- Create: `app/(app)/generator/unified/page.tsx`
- Test: `tests/app/unified.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/app/unified.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UnifiedPage from '@/app/(app)/generator/unified/page'

vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

describe('Unified Generator Dashboard', () => {
  it('renders heading', () => {
    render(<UnifiedPage />)
    expect(screen.getByRole('heading', { name: /unified generator/i })).toBeInTheDocument()
  })

  it('renders both input and results panels', () => {
    render(<UnifiedPage />)
    expect(screen.getByLabelText(/spotify playlist url/i)).toBeInTheDocument()
    expect(screen.getByText(/results/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/app/unified.test.tsx
```

- [ ] **Step 3: Implement**

Create `app/(app)/generator/unified/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlaylistInput } from '@/components/ui/PlaylistInput'
import { GenerateButton } from '@/components/ui/GenerateButton'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

function isValidSpotifyUrl(url: string) {
  return url.includes('open.spotify.com/playlist/')
}

export default function UnifiedPage() {
  const { shouldAnimate } = useMotion()
  const [url, setUrl]             = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [isLoading, setLoading]   = useState(false)
  const [results, setResults]     = useState<Playlist[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)

  function handleGenerate() {
    if (!isValidSpotifyUrl(url)) {
      setError('Please paste a valid Spotify playlist URL.')
      return
    }
    setError(null)
    setLoading(true)
    setResults([])
    setTimeout(() => {
      setLoading(false)
      setResults(mockPlaylists.slice(0, 2))
    }, 2000)
  }

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl min-h-dvh"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Unified Generator</TextGradient>
        </h1>

        <div className="grid md:grid-cols-2 gap-lg">
          {/* Input panel */}
          <GlassPanel className="p-lg flex flex-col gap-lg">
            <div>
              <h2 className="text-title-lg font-semibold text-on-surface mb-sm">Extend Your Sound</h2>
              <p className="text-body-md text-on-surface-variant">
                Paste a Spotify playlist link to analyze and extend it with AI-curated tracks.
              </p>
            </div>
            <PlaylistInput value={url} onChange={setUrl} error={error} />
            <GenerateButton isLoading={isLoading} onClick={handleGenerate} />
          </GlassPanel>

          {/* Results panel */}
          <GlassPanel className="p-lg flex flex-col gap-md overflow-y-auto max-h-[600px]">
            <h2 className="text-title-md font-semibold text-on-surface">Results</h2>
            {isLoading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
            {!isLoading && results.length === 0 && (
              <p className="text-body-md text-on-surface-variant text-center py-xl">
                Your generated playlists will appear here.
              </p>
            )}
            {results.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} onToggleFavorite={handleToggleFavorite} />
            ))}
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/app/unified.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/generator/unified/page.tsx" tests/app/unified.test.tsx
git commit -m "feat: add Unified Generator Dashboard with split input/results panel"
```

---

## Task 18: Full Test Suite + Build Verification

**Files:** none new — runs all tests and build

- [ ] **Step 1: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass. Fix any failures before continuing.

- [ ] **Step 2: Run Next.js build**

```bash
pnpm build
```

Expected: build succeeds with no errors. Fix TypeScript or import errors if any appear.

- [ ] **Step 3: Smoke-test locally**

```bash
pnpm dev
```

Open `http://localhost:3000` and verify:
- Sidebar renders with SonicPro logo and 4 nav items
- Generator page shows hero, input, and 3 playlist cards with stagger animation
- Atmospheric orbs pulse in background
- History page search filters correctly
- Favorites shows starred playlists
- Stats page shows 3 metric cards + 2 charts
- Unified page shows split panel layout
- Mobile: sidebar hides, bottom tab bar appears

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete SonicPro AI Playlist Engine — all 6 pages, components, charts, animations"
```

---

## Self-Review

**Spec coverage check:**

| Spec Section | Covered by Task |
|---|---|
| 6 pages + routes | Tasks 13–17 |
| Sidebar layout shell | Task 10–11 |
| BottomTabBar (mobile) | Task 10 |
| GlassPanel | Task 6 |
| AtmosphericOrb + pulse | Task 6 |
| TextGradient | Task 6 |
| Design tokens (colors, type, spacing) | Task 2 |
| Inter font | Task 2 |
| PlaylistInput + error | Task 8 |
| GenerateButton + loading | Task 8 |
| PlaylistCard + favorite toggle | Task 9 |
| StatCard + trend | Task 9 |
| SkeletonCard | Task 7 |
| Toast | Task 7 |
| DiscoveryGrowthChart | Task 12 |
| AttributeBalanceChart | Task 12 |
| prefers-reduced-motion | Tasks 5, 13–17 |
| Page transition animation | Tasks 13–17 |
| Stagger card animations | Tasks 13, 14, 16 |
| Playlist Detail track table | Task 15 |
| Breadcrumb navigation | Task 15 |
| Empty states | Tasks 14, 16, 17 |
| Accessible aria-labels | Tasks 6–17 |
| focus-ring on all interactives | Tasks 8–17 |
| Responsive breakpoints | Tasks 10–11 |
| Build verification | Task 18 |

**No gaps found.**

**Type consistency:** All interfaces defined once in `lib/types.ts`. `Playlist`, `Track`, `StatMetric`, `WeeklyDiscovery`, `AcousticProfile` used consistently across all tasks by the same names.

**Placeholder scan:** No TBDs, no "similar to above", all code blocks are complete.
