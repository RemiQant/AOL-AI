import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { StatCard } from '@/components/ui/StatCard'
import { mockPlaylists, mockStats } from '@/lib/mock-data'

describe('PlaylistCard', () => {
  const playlist = mockPlaylists[0]

  it('renders playlist title', () => {
    render(<PlaylistCard playlist={playlist} onToggleFavorite={() => {}} />)
    expect(screen.getByText(playlist.title)).toBeInTheDocument()
  })

  it('renders track count', () => {
    render(<PlaylistCard playlist={playlist} onToggleFavorite={() => {}} />)
    expect(screen.getByText(/24 tracks/i)).toBeInTheDocument()
  })

  it('calls onToggleFavorite when star clicked', () => {
    const onToggle = vi.fn()
    render(<PlaylistCard playlist={playlist} onToggleFavorite={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }))
    expect(onToggle).toHaveBeenCalledWith(playlist.id)
  })
})

describe('StatCard', () => {
  const stat = mockStats[0]

  it('renders label and value', () => {
    render(<StatCard stat={stat} />)
    expect(screen.getByText(stat.label)).toBeInTheDocument()
    expect(screen.getByText(String(stat.value))).toBeInTheDocument()
  })

  it('renders positive trend in green', () => {
    render(<StatCard stat={stat} />)
    const trend = screen.getByText(stat.trend!)
    expect(trend).toHaveClass('text-primary')
  })
})
