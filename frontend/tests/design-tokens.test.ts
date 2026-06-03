import { describe, it, expect } from 'vitest'
import config from '../tailwind.config'

describe('Tailwind design tokens', () => {
  const colors = (config.theme?.extend as any)?.colors

  it('has primary green color', () => {
    expect(colors['primary']).toBe('#53e076')
  })

  it('has secondary purple color', () => {
    expect(colors['secondary']).toBe('#d1bcff')
  })

  it('has correct background color', () => {
    expect(colors['background']).toBe('#121414')
  })
})
