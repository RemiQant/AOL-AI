import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UnifiedPage from '@/app/(app)/generator/unified/page'

vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  useReducedMotion: () => false,
}))

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
