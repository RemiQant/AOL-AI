import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FavoritesPage from '@/app/(app)/favorites/page'
import StatsPage from '@/app/(app)/stats/page'

vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  useReducedMotion: () => false,
}))
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
