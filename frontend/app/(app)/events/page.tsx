'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { EventTimeline } from '@/components/cs2/EventTimeline'
import { useMotion } from '@/components/providers/MotionProvider'
import { getMarketEvents, fetchMarketEvents } from '@/lib/api'
import type { MarketEvent } from '@/lib/cs2-types'

type ImpactFilter = 'all' | MarketEvent['impact']

const FILTERS: { key: ImpactFilter; label: string; icon: React.ElementType }[] = [
  { key: 'all',      label: 'All Events', icon: CalendarClock },
  { key: 'positive', label: 'Positive',   icon: TrendingUp    },
  { key: 'negative', label: 'Negative',   icon: TrendingDown  },
  { key: 'neutral',  label: 'Neutral',    icon: Minus         },
]

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export default function EventsPage() {
  const { shouldAnimate }   = useMotion()
  const [filter, setFilter] = useState<ImpactFilter>('all')
  const [events, setEvents] = useState<MarketEvent[]>(getMarketEvents())

  useEffect(() => {
    fetchMarketEvents().then(setEvents).catch(() => {})
  }, [])

  const impactCounts = {
    positive: events.filter((e) => e.impact === 'positive').length,
    negative: events.filter((e) => e.impact === 'negative').length,
    neutral:  events.filter((e) => e.impact === 'neutral').length,
  }

  const summaryStats = [
    { label: 'Total Events',    value: events.length,          sub: 'since Oct 2025', color: 'text-on-surface' },
    { label: 'Positive Impact', value: impactCounts.positive,  sub: 'market boosters', color: 'text-primary' },
    { label: 'Negative Impact', value: impactCounts.negative,  sub: 'market shocks',   color: 'text-red-400' },
    { label: 'Neutral Impact',  value: impactCounts.neutral,   sub: 'market-neutral',  color: 'text-on-surface-variant' },
  ]

  const filtered = filter === 'all' ? events : events.filter((e) => e.impact === filter)

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-xl">
          <div className="flex items-center gap-sm mb-sm">
            <CalendarClock className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span className="text-label-md text-secondary uppercase tracking-widest font-medium">
              Historical Events
            </span>
          </div>
          <h1 className="text-headline-xl font-bold text-on-surface">
            Market <TextGradient>Events</TextGradient>
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-sm">
            Chronological record of policy changes, updates, and market-moving events since the October 2025 Trade-Up collapse.
          </p>
        </div>

        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-lg"
        >
          {/* Summary stats */}
          <motion.div
            variants={shouldAnimate ? itemVariants : undefined}
            className="grid grid-cols-2 md:grid-cols-4 gap-md"
          >
            {summaryStats.map((stat) => (
              <GlassPanel key={stat.label} className="p-md text-center">
                <p className={clsx('text-headline-xl font-bold tabular-nums', stat.color)}>
                  {stat.value}
                </p>
                <p className="text-label-md text-on-surface font-medium">{stat.label}</p>
                <p className="text-label-sm text-on-surface-variant">{stat.sub}</p>
              </GlassPanel>
            ))}
          </motion.div>

          {/* Filter buttons */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <div role="radiogroup" aria-label="Filter events by impact" className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  role="radio"
                  aria-checked={filter === key}
                  onClick={() => setFilter(key)}
                  className={clsx(
                    'flex items-center gap-1.5 px-md py-sm rounded-lg text-label-md font-medium border transition-all duration-150 focus-ring',
                    filter === key
                      ? key === 'positive' ? 'bg-primary/10 text-primary border-primary/30'
                        : key === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : key === 'neutral'  ? 'bg-white/8 text-on-surface border-white/20'
                        : 'bg-secondary/10 text-secondary border-secondary/30'
                      : 'bg-white/3 text-on-surface-variant border-white/8 hover:bg-white/8 hover:text-on-surface',
                  )}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                  {key !== 'all' && (
                    <span className="ml-1 text-label-sm opacity-70">
                      ({impactCounts[key as keyof typeof impactCounts] ?? 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <GlassPanel className="p-lg md:p-xl">
              {filtered.length > 0 ? (
                <EventTimeline events={filtered} />
              ) : (
                <p className="text-body-md text-on-surface-variant text-center py-xl">
                  No events match the selected filter.
                </p>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
