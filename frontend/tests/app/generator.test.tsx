import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GeneratorPage from '@/app/(app)/page'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: () => false,
}))

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
