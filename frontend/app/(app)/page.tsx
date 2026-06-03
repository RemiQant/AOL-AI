'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { PricePredictorChart } from '@/components/cs2/PricePredictorChart'
import { PlayerCountWidget } from '@/components/cs2/PlayerCountWidget'
import { EventTimeline } from '@/components/cs2/EventTimeline'
import { KeywordTracker } from '@/components/cs2/KeywordTracker'
import { useMotion } from '@/components/providers/MotionProvider'
import { getSkins, getMarketEvents, getNewsKeywords, getPlayerCount } from '@/lib/api'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const defaultSkin = getSkins()[0]

const marketStats = [
  { label: 'Steam Market Vol.',  value: '$2.41M',  change: '+8.3%',  up: true  },
  { label: 'Active Listings',    value: '142,830', change: '+1.2%',  up: true  },
  { label: 'Market Index (7d)',  value: '+3.2%',   change: 'vs prev week', up: true  },
]

export default function DashboardPage() {
  const { shouldAnimate } = useMotion()

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left"    />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      <div className="relative z-10 w-full">

        {/* Header */}
        <div className="mb-xl">
          <div className="flex items-center gap-sm mb-sm">
            <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            </div>
            <span className="text-label-md text-primary uppercase tracking-widest font-medium">
              LSTM · 90-day training · 7-day forecast
            </span>
          </div>
          <h1 className="text-headline-xl font-bold text-on-surface">
            CS2 Market <TextGradient>Intelligence</TextGradient>
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-sm max-w-xl">
            Real-time skin market analytics powered by AI price prediction.
            Monitor player trends, market events, and community signals.
          </p>
        </div>

        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-md"
        >
          {/* Row 1: Player Count + Stats column  |  Price Predictor Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">

            {/* Left column: player count + market stats */}
            <motion.div variants={shouldAnimate ? itemVariants : undefined} className="flex flex-col gap-md">
              <PlayerCountWidget data={getPlayerCount()} />

              <GlassPanel className="p-md">
                <p className="text-label-md text-on-surface-variant uppercase tracking-widest mb-md">
                  Market Overview
                </p>
                <div className="flex flex-col gap-sm">
                  {marketStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-label-md text-on-surface-variant">{stat.label}</span>
                      <div className="text-right">
                        <span className="text-body-md font-semibold text-on-surface tabular-nums block">
                          {stat.value}
                        </span>
                        <span className={stat.up ? 'text-primary text-label-sm' : 'text-red-400 text-label-sm'}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            {/* Right column: price predictor chart */}
            <motion.div variants={shouldAnimate ? itemVariants : undefined} className="md:col-span-2">
              <GlassPanel className="p-lg h-full flex flex-col">
                <div className="flex items-start justify-between mb-md flex-wrap gap-2">
                  <div>
                    <h2 className="text-title-md font-semibold text-on-surface">
                      {defaultSkin.name}
                      <span className="ml-2 text-label-md text-on-surface-variant font-normal">
                        {defaultSkin.wear}
                      </span>
                    </h2>
                    <div className="flex items-center gap-md mt-1">
                      <span className="text-headline-lg font-bold text-on-surface tabular-nums">
                        ${defaultSkin.currentPrice.toFixed(2)}
                      </span>
                      <span className={defaultSkin.changePct24h >= 0 ? 'text-primary text-label-md font-medium' : 'text-red-400 text-label-md font-medium'}>
                        {defaultSkin.changePct24h >= 0 ? '+' : ''}{defaultSkin.changePct24h}% 24h
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/predictor"
                    className="flex items-center gap-1 text-label-md text-secondary hover:text-on-surface transition-colors focus-ring rounded px-2 py-1"
                  >
                    Full Predictor <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="flex-1">
                  <PricePredictorChart data={defaultSkin.priceData} height={260} />
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Row 2: Events Timeline  |  Keywords Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">

            {/* Events */}
            <motion.div variants={shouldAnimate ? itemVariants : undefined}>
              <GlassPanel className="p-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-lg">
                  <h2 className="text-title-md font-semibold text-on-surface">Market Events</h2>
                  <Link
                    href="/events"
                    className="flex items-center gap-1 text-label-md text-secondary hover:text-on-surface transition-colors focus-ring rounded px-2 py-1"
                  >
                    All Events <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
                  <EventTimeline events={getMarketEvents()} limit={4} />
                </div>
              </GlassPanel>
            </motion.div>

            {/* Keywords */}
            <motion.div variants={shouldAnimate ? itemVariants : undefined} className="md:col-span-2">
              <GlassPanel className="p-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-md">
                  <div>
                    <h2 className="text-title-md font-semibold text-on-surface">News Intelligence</h2>
                    <p className="text-label-md text-on-surface-variant mt-0.5">
                      Top keywords · Last 30 days · Community &amp; forums
                    </p>
                  </div>
                  <Link
                    href="/keywords"
                    className="flex items-center gap-1 text-label-md text-secondary hover:text-on-surface transition-colors focus-ring rounded px-2 py-1"
                  >
                    Full View <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <KeywordTracker keywords={getNewsKeywords()} limit={8} showFilters={false} />
              </GlassPanel>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
