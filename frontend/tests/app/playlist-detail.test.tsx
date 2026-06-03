import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaylistDetailPage from '@/app/(app)/history/[id]/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/history/1', useParams: () => ({ id: '1' }) }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  useReducedMotion: () => false,
}))
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  RadarChart: ({ children }: any) => <div>{children}</div>,
  Radar: () => null, PolarGrid: () => null, PolarAngleAxis: () => null, Tooltip: () => null,
}))

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
