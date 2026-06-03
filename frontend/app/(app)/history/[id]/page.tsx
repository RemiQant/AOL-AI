'use client'

import { motion } from 'framer-motion'
import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AttributeBalanceChart } from '@/components/charts/AttributeBalanceChart'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockPlaylists, mockTracks } from '@/lib/mock-data'

interface Props {
  params: Promise<{ id: string }>
}

export default function PlaylistDetailPage({ params }: Props) {
  const { id }    = use(params)
  const { shouldAnimate } = useMotion()
  const playlist  = mockPlaylists.find((p) => p.id === id) ?? mockPlaylists[0]

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="primary" size="md" position="top-left" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-label-md text-on-surface-variant mb-lg">
          <Link href="/history" className="hover:text-on-surface transition-colors focus-ring rounded">
            History
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-on-surface truncate">{playlist.title}</span>
        </nav>

        <div className="flex items-center gap-lg mb-xl">
          <Image
            src={playlist.thumbnailUrl}
            alt={playlist.title}
            width={96}
            height={96}
            className="rounded-xl flex-shrink-0"
          />
          <div>
            <h1 className="text-headline-xl font-bold text-on-surface">{playlist.title}</h1>
            <p className="text-body-md text-on-surface-variant">
              {playlist.trackCount} tracks · Extended by {playlist.extendedBy} · {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-lg">
          <GlassPanel className="overflow-hidden">
            <table className="w-full" aria-label="Track list">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">#</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">Track</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden sm:table-cell">Artist</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium">Match</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden md:table-cell">BPM</th>
                  <th className="px-md py-sm text-label-md text-on-surface-variant font-medium hidden md:table-cell">Key</th>
                  <th className="px-md py-sm" />
                </tr>
              </thead>
              <tbody>
                {mockTracks.map((track, i) => (
                  <tr key={track.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-md py-sm text-label-md text-on-surface-variant">{i + 1}</td>
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-sm">
                        <Image src={track.albumArt} alt={track.title} width={36} height={36} className="rounded" />
                        <span className="text-body-md text-on-surface">{track.title}</span>
                      </div>
                    </td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden sm:table-cell">{track.artist}</td>
                    <td className="px-md py-sm">
                      <span className="text-label-md text-primary font-medium">{track.matchConfidence}%</span>
                    </td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden md:table-cell">{track.bpm}</td>
                    <td className="px-md py-sm text-body-md text-on-surface-variant hidden md:table-cell">{track.key}</td>
                    <td className="px-md py-sm">
                      <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${track.title} on Spotify`} className="text-on-surface-variant hover:text-primary transition-colors focus-ring rounded">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPanel>

          {playlist.acousticProfile && (
            <GlassPanel className="p-md">
              <h2 className="text-title-md font-semibold text-on-surface mb-md">Acoustic Profile</h2>
              <AttributeBalanceChart profile={playlist.acousticProfile} />
            </GlassPanel>
          )}
        </div>
      </div>
    </motion.div>
  )
}
