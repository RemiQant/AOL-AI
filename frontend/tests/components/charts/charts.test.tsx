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
