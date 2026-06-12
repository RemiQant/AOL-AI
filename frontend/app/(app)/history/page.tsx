'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export default function HistoryPage() {
  const { shouldAnimate } = useMotion()
  const [query, setQuery]         = useState('')
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)

  const filtered = useMemo(
    () => playlists.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [playlists, query],
  )

  function handleToggleFavorite(id: string) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">Generation History</h1>

        <div className="relative mb-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search playlists…"
            aria-label="Search generation history"
            className="w-full bg-surface-container-high text-on-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-body-md placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>

        <p className="text-label-md text-on-surface-variant mb-md">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-xxl">
            <p className="text-body-lg text-on-surface-variant">No playlists match your search.</p>
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-md"
          >
            {filtered.map((playlist) => (
              <motion.div key={playlist.id} variants={shouldAnimate ? itemVariants : undefined}>
                <PlaylistCard playlist={playlist} onToggleFavorite={handleToggleFavorite} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
