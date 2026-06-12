import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NavItem } from '@/components/layout/NavItem'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

describe('NavItem', () => {
  it('renders label', () => {
    render(<NavItem href="/" icon="sparkles" label="Generator" isActive={false} />)
    expect(screen.getByText('Generator')).toBeInTheDocument()
  })

  it('applies active styles when isActive', () => {
    render(<NavItem href="/" icon="sparkles" label="Generator" isActive={true} />)
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
