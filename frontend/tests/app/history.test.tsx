import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HistoryPage from '@/app/(app)/history/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/history' }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: () => false,
}))

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
