import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlaylistInput } from '@/components/ui/PlaylistInput'
import { GenerateButton } from '@/components/ui/GenerateButton'

describe('PlaylistInput', () => {
  it('renders input with placeholder', () => {
    render(<PlaylistInput value="" onChange={() => {}} error={null} />)
    expect(screen.getByPlaceholderText(/spotify playlist/i)).toBeInTheDocument()
  })

  it('calls onChange on input', () => {
    const onChange = vi.fn()
    render(<PlaylistInput value="" onChange={onChange} error={null} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://open.spotify.com/playlist/abc' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('shows error message when error is provided', () => {
    render(<PlaylistInput value="" onChange={() => {}} error="Invalid URL" />)
    expect(screen.getByText('Invalid URL')).toBeInTheDocument()
  })
})

describe('GenerateButton', () => {
  it('renders label', () => {
    render(<GenerateButton isLoading={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /generate extension/i })).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<GenerateButton isLoading={true} onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByLabelText(/generating/i)).toBeInTheDocument()
  })
})
