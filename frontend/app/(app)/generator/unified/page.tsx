'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlaylistInput } from '@/components/ui/PlaylistInput'
import { GenerateButton } from '@/components/ui/GenerateButton'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

function isValidSpotifyUrl(url: string) {
  return url.includes('open.spotify.com/playlist/')
}

export default function UnifiedPage() {
  const { shouldAnimate } = useMotion()
  const [url, setUrl]             = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [isLoading, setLoading]   = useState(false)
  const [results, setResults]     = useState<Playlist[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)

  function handleGenerate() {
    if (!isValidSpotifyUrl(url)) {
      setError('Please paste a valid Spotify playlist URL.')
      return
    }
    setError(null)
    setLoading(true)
    setResults([])
    setTimeout(() => {
      setLoading(false)
      setResults(mockPlaylists.slice(0, 2))
    }, 2000)
  }

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl min-h-dvh"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Unified Generator</TextGradient>
        </h1>

        <div className="grid md:grid-cols-2 gap-lg">
          <GlassPanel className="p-lg flex flex-col gap-lg">
            <div>
              <h2 className="text-title-lg font-semibold text-on-surface mb-sm">Extend Your Sound</h2>
              <p className="text-body-md text-on-surface-variant">
                Paste a Spotify playlist link to analyze and extend it with AI-curated tracks.
              </p>
            </div>
            <PlaylistInput value={url} onChange={setUrl} error={error} />
            <GenerateButton isLoading={isLoading} onClick={handleGenerate} />
          </GlassPanel>

          <GlassPanel className="p-lg flex flex-col gap-md overflow-y-auto max-h-[600px]">
            <h2 className="text-title-md font-semibold text-on-surface">Results</h2>
            {isLoading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
            {!isLoading && results.length === 0 && (
              <p className="text-body-md text-on-surface-variant text-center py-xl">
                Your generated playlists will appear here.
              </p>
            )}
            {results.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} onToggleFavorite={handleToggleFavorite} />
            ))}
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  )
}
