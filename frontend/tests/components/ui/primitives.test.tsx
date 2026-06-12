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
