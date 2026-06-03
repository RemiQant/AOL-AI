'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, TrendingDown, Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { useMotion } from '@/components/providers/MotionProvider'
import { getSkins, fetchSkins } from '@/lib/api'
import type { SkinOption } from '@/lib/cs2-types'

type Category = 'all' | SkinOption['category']

const CATEGORY_LABEL: Record<Category, string> = {
  all: 'All', rifle: 'Rifles', pistol: 'Pistols', knife: 'Knives',
}

const CATEGORY_COLOR: Record<SkinOption['category'], string> = {
  rifle:  'bg-blue-400/20   text-blue-300   border-blue-400/30',
  pistol: 'bg-amber-400/20  text-amber-300  border-amber-400/30',
  knife:  'bg-purple-400/20 text-purple-300 border-purple-400/30',
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } },
}

function SkinCard({ skin }: { skin: SkinOption }) {
  const isUp = skin.changePct24h >= 0
  return (
    <Link
      href={`/predictor/${encodeURIComponent(skin.id)}`}
      aria-label={`View AI forecast for ${skin.name} ${skin.wear}`}
      className="group block focus-ring rounded-lg"
    >
      <GlassPanel className="p-lg h-full flex flex-col gap-md transition-all duration-200 group-hover:border-white/20 group-hover:shadow-glow-secondary group-hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className={clsx(
            'text-label-sm font-medium px-2 py-0.5 rounded-full border capitalize',
            CATEGORY_COLOR[skin.category],
          )}>
            {skin.category}
          </span>
          <span className={clsx(
            'flex items-center gap-0.5 text-label-sm font-semibold tabular-nums',
            isUp ? 'text-primary' : 'text-red-400',
          )}>
            {isUp
              ? <TrendingUp  className="w-3.5 h-3.5" aria-hidden="true" />
              : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            }
            {isUp ? '+' : ''}{skin.changePct24h}%
          </span>
        </div>

        <div className="flex-1">
          <p className="text-body-md font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
            {skin.name}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-0.5">{skin.wear}</p>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-title-lg font-black text-on-surface tabular-nums">
            {skin.currentPrice >= 1000
              ? `$${skin.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              : `$${skin.currentPrice.toFixed(2)}`
            }
          </p>
          <span className="flex items-center gap-1 text-label-md text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            AI Forecast <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        </div>

        <div
          aria-hidden="true"
          className={clsx(
            'h-0.5 rounded-full transition-all duration-300',
            'bg-gradient-to-r from-transparent via-secondary/40 to-transparent',
            'scale-x-0 group-hover:scale-x-100',
          )}
        />
      </GlassPanel>
    </Link>
  )
}

export default function PredictorPage() {
  const { shouldAnimate }             = useMotion()
  const [skins, setSkins]             = useState<SkinOption[]>(getSkins())
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory]       = useState<Category>('all')

  useEffect(() => {
    fetchSkins().then(setSkins).catch(() => {})
  }, [])

  const counts = useMemo<Record<Category, number>>(() => ({
    all:    skins.length,
    rifle:  skins.filter((s) => s.category === 'rifle').length,
    pistol: skins.filter((s) => s.category === 'pistol').length,
    knife:  skins.filter((s) => s.category === 'knife').length,
  }), [skins])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return skins
      .filter((s) => category === 'all' || s.category === category)
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.weapon.toLowerCase().includes(q))
  }, [skins, category, searchQuery])

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left"    />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-xl">
          <div className="flex items-center gap-sm mb-sm">
            <Brain className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span className="text-label-md text-secondary uppercase tracking-widest font-medium">
              AI Price Predictor
            </span>
          </div>
          <h1 className="text-headline-xl font-bold text-on-surface">
            Select a <TextGradient>Skin</TextGradient>
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-sm">
            Choose a CS2 skin to view the LSTM price forecast and AI market analysis.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-md mb-xl">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by name or weapon…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search skins"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-sm text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus-ring focus:border-primary/40 transition-colors outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-on-surface-variant hover:text-on-surface focus-ring"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div
            role="radiogroup"
            aria-label="Filter by weapon category"
            className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1 self-start"
          >
            {(['all', 'rifle', 'pistol', 'knife'] as Category[]).map((cat) => (
              <button
                key={cat}
                role="radio"
                aria-checked={category === cat}
                onClick={() => setCategory(cat)}
                className={clsx(
                  'px-3 py-1.5 rounded text-label-md font-medium transition-all duration-150 focus-ring whitespace-nowrap',
                  category === cat
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface',
                )}
              >
                {CATEGORY_LABEL[cat]}
                <span className="ml-1 text-label-sm opacity-60">({counts[cat]})</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-label-md text-on-surface-variant mb-md">
          {filtered.length} skin{filtered.length !== 1 ? 's' : ''}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </p>

        {filtered.length > 0 ? (
          <motion.div
            key={`${category}-${searchQuery}`}
            variants={shouldAnimate ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md"
          >
            {filtered.map((skin) => (
              <motion.div key={skin.id} variants={shouldAnimate ? itemVariants : undefined}>
                <SkinCard skin={skin} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-xxl">
            <p className="text-body-lg text-on-surface-variant">No skins found.</p>
            <button
              onClick={() => { setSearchQuery(''); setCategory('all') }}
              className="mt-md text-label-md text-secondary hover:text-on-surface transition-colors focus-ring rounded"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
