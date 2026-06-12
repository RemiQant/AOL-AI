'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists } from '@/lib/mock-data'
import type { Playlist } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export default function FavoritesPage() {
  const { shouldAnimate } = useMotion()
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)
  const favorites = playlists.filter((p) => p.isFavorite)

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
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Favorites</TextGradient>
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-xxl flex flex-col items-center gap-md">
            <Star className="w-12 h-12 text-on-surface-variant" aria-hidden="true" />
            <p className="text-body-lg text-on-surface-variant">No favorites yet.</p>
            <p className="text-body-md text-on-surface-variant">Star a playlist from History to save it here.</p>
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-md"
          >
            {favorites.map((playlist) => (
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
