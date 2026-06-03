'use client'

import { motion } from 'framer-motion'
import { Hash, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { KeywordTracker } from '@/components/cs2/KeywordTracker'
import { useMotion } from '@/components/providers/MotionProvider'
import { getNewsKeywords } from '@/lib/api'

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

const ALL_KEYWORDS     = getNewsKeywords()
const sentimentSummary = [
  {
    label:    'Positive Signals',
    count:    ALL_KEYWORDS.filter((k) => k.sentiment === 'positive').length,
    total:    ALL_KEYWORDS.reduce((s, k) => s + (k.sentiment === 'positive' ? k.count : 0), 0),
    icon:     TrendingUp,
    color:    'text-primary',
    bgColor:  'bg-primary/10 border-primary/20',
  },
  {
    label:    'Negative Signals',
    count:    ALL_KEYWORDS.filter((k) => k.sentiment === 'negative').length,
    total:    ALL_KEYWORDS.reduce((s, k) => s + (k.sentiment === 'negative' ? k.count : 0), 0),
    icon:     TrendingDown,
    color:    'text-red-400',
    bgColor:  'bg-red-500/10 border-red-500/20',
  },
  {
    label:    'Neutral Signals',
    count:    ALL_KEYWORDS.filter((k) => k.sentiment === 'neutral').length,
    total:    ALL_KEYWORDS.reduce((s, k) => s + (k.sentiment === 'neutral' ? k.count : 0), 0),
    icon:     Minus,
    color:    'text-on-surface-variant',
    bgColor:  'bg-white/5 border-white/10',
  },
]

export default function KeywordsPage() {
  const { shouldAnimate } = useMotion()

  const totalMentions = ALL_KEYWORDS.reduce((s, k) => s + k.count, 0)

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="primary" size="md" position="bottom-right" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-xl">
          <div className="flex items-center gap-sm mb-sm">
            <Hash className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-label-md text-primary uppercase tracking-widest font-medium">
              News Intelligence
            </span>
          </div>
          <h1 className="text-headline-xl font-bold text-on-surface">
            Keyword <TextGradient>Tracker</TextGradient>
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-sm">
            Community forums, Reddit, and CS2 news sites scraped daily.
            Keyword frequency and sentiment analysis for the last 30 days.
          </p>
        </div>

        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-md"
        >
          {/* Sentiment summary cards */}
          <motion.div
            variants={shouldAnimate ? itemVariants : undefined}
            className="grid grid-cols-1 sm:grid-cols-3 gap-md"
          >
            {sentimentSummary.map(({ label, count, total, icon: Icon, color, bgColor }) => (
              <GlassPanel key={label} className={`p-lg border ${bgColor}`}>
                <div className="flex items-center gap-sm mb-sm">
                  <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
                  <span className={`text-label-md font-medium ${color}`}>{label}</span>
                </div>
                <p className={`text-headline-xl font-bold tabular-nums ${color}`}>
                  {total.toLocaleString()}
                </p>
                <p className="text-label-md text-on-surface-variant mt-1">
                  {count} keyword{count !== 1 ? 's' : ''} · {Math.round((total / totalMentions) * 100)}% of total
                </p>
              </GlassPanel>
            ))}
          </motion.div>

          {/* Keyword tracker with filters */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <GlassPanel className="p-lg">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-lg">
                <div>
                  <h2 className="text-title-md font-semibold text-on-surface">All Keywords</h2>
                  <p className="text-label-md text-on-surface-variant mt-0.5">
                    {totalMentions.toLocaleString()} total mentions · {ALL_KEYWORDS.length} tracked terms
                  </p>
                </div>
                <div className="text-label-sm text-on-surface-variant/60 text-right">
                  <p>Sources: Reddit · Steam Forums</p>
                  <p>CS2 Discord · Liquipedia</p>
                </div>
              </div>

              <KeywordTracker keywords={ALL_KEYWORDS} showFilters />
            </GlassPanel>
          </motion.div>

          {/* Legend */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <GlassPanel className="p-md">
              <p className="text-label-md text-on-surface-variant uppercase tracking-widest mb-md">
                Category Legend
              </p>
              <div className="flex flex-wrap gap-md">
                {[
                  { color: 'bg-primary',    label: 'Price Action'  },
                  { color: 'bg-blue-400',   label: 'Trade / Market' },
                  { color: 'bg-amber-400',  label: 'Game Updates'  },
                  { color: 'bg-purple-400', label: 'Community'     },
                  { color: 'bg-red-400',    label: 'Valve Actions' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-sm">
                    <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-label-md text-on-surface-variant">{label}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
