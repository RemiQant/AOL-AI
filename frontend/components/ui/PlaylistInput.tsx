'use client'

import { Link } from 'lucide-react'
import { clsx } from 'clsx'

interface PlaylistInputProps {
  value: string
  onChange: (value: string) => void
  error: string | null
}

export function PlaylistInput({ value, onChange, error }: PlaylistInputProps) {
  return (
    <div className="w-full">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
          <Link className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a Spotify playlist link…"
          aria-label="Spotify playlist URL"
          aria-invalid={!!error}
          aria-describedby={error ? 'playlist-input-error' : undefined}
          className={clsx(
            'w-full bg-surface-container-high text-on-surface border rounded-xl py-5 pl-12 pr-4 text-body-lg',
            'placeholder:text-on-surface-variant transition-all outline-none',
            'focus:border-secondary focus:ring-1 focus:ring-secondary focus:shadow-glow-input',
            error ? 'border-error/60' : 'border-white/10',
          )}
        />
      </div>
      {error && (
        <p id="playlist-input-error" role="alert" className="mt-sm text-label-md text-error">
          {error}
        </p>
      )}
    </div>
  )
}
