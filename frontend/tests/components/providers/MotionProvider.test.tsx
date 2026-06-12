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
