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
