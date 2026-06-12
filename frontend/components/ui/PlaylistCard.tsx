'use client'

import Image from 'next/image'
import { Star, Play } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from './GlassPanel'
import type { Playlist } from '@/lib/types'

interface PlaylistCardProps {
  playlist: Playlist
  onToggleFavorite: (id: string) => void
  onClick?: (id: string) => void
}

export function PlaylistCard({ playlist, onToggleFavorite, onClick }: PlaylistCardProps) {
  return (
    <GlassPanel
      className={clsx(
        'flex items-center gap-md p-md transition-all duration-150 cursor-pointer',
        'hover:border-primary/30 hover:shadow-glow-primary',
      )}
      as="article"
    >
      <button
        onClick={() => onClick?.(playlist.id)}
        className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden group focus-ring"
        aria-label={`Play ${playlist.title}`}
      >
        <Image
          src={playlist.thumbnailUrl}
          alt={playlist.title}
          width={64}
          height={64}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-title-md text-on-surface truncate">{playlist.title}</p>
        <p className="text-body-md text-on-surface-variant">
          {playlist.trackCount} tracks · Extended by {playlist.extendedBy}
        </p>
        <span className={clsx(
          'inline-block mt-1 text-label-sm px-2 py-0.5 rounded-full',
          playlist.status === 'completed'  && 'bg-primary/10 text-primary',
          playlist.status === 'processing' && 'bg-secondary/10 text-secondary',
          playlist.status === 'failed'     && 'bg-error/10 text-error',
        )}>
          {playlist.status}
        </span>
      </div>

      <button
        onClick={() => onToggleFavorite(playlist.id)}
        aria-label={playlist.isFavorite ? `Remove ${playlist.title} from favorites` : `Add ${playlist.title} to favorites`}
        className="text-on-surface-variant hover:text-secondary transition-colors focus-ring rounded p-1"
      >
        <Star
          className={clsx('w-5 h-5', playlist.isFavorite && 'fill-secondary text-secondary')}
        />
      </button>
    </GlassPanel>
  )
}
