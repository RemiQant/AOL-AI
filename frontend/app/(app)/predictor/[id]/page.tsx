'use client'

import { useState, useEffect, useMemo, use } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { PricePredictorChart } from '@/components/cs2/PricePredictorChart'
import { AiAnalysisCard } from '@/components/cs2/AiAnalysisCard'
import { useMotion } from '@/components/providers/MotionProvider'
import { getSkinById, fetchSkinById } from '@/lib/api'
import type { SkinOption, SkinPricePoint } from '@/lib/cs2-types'

type Timeframe = '1W' | '1M' | '3M'

const TIMEFRAME_DAYS: Record<Timeframe, number> = { '1W': 7, '1M': 30, '3M': 90 }

function filterByTimeframe(data: SkinPricePoint[], tf: Timeframe): SkinPricePoint[] {
  const days   = TIMEFRAME_DAYS[tf]
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days + 1)
  const cutStr = cutoff.toISOString().split('T')[0]
  return data.filter((d) => d.date >= cutStr)
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  return `$${price.toFixed(2)}`
}

const CATEGORY_COLOR: Record<string, string> = {
  rifle:  'bg-blue-400/15 text-blue-300 border-blue-400/30',
  pistol: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  knife:  'bg-purple-400/15 text-purple-300 border-purple-400/30',
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

interface Props {
  params: Promise<{ id: string }>
}

export default function SkinDetailPage({ params }: Props) {
  const { id }    = use(params)
  const { shouldAnimate } = useMotion()
  const [timeframe, setTimeframe] = useState<Timeframe>('3M')

  const decodedId = decodeURIComponent(id)
  const [skin, setSkin] = useState<SkinOption | undefined>(
    getSkinById(id) ?? getSkinById(decodedId)
  )

  useEffect(() => {
    fetchSkinById(decodedId).then(setSkin).catch(() => {})
  }, [decodedId])

  const chartData = useMemo(
    () => skin ? filterByTimeframe(skin.priceData, timeframe) : [],
    [skin, timeframe],
  )

  if (!skin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-md">
        <p className="text-body-lg text-on-surface-variant">Skin not found.</p>
        <Link href="/predictor" className="text-secondary hover:text-on-surface transition-colors focus-ring rounded">
          ← Back to Predictor
        </Link>
      </div>
    )
  }

  const prophetTarget   = skin.priceData.findLast((d) => d.predicted !== null)?.predicted ?? skin.currentPrice
  const lstmTarget      = skin.priceData.findLast((d) => (d.predictedLSTM ?? null) !== null)?.predictedLSTM ?? null
  const lastPrediction  = lstmTarget !== null
    ? Math.round(((prophetTarget + lstmTarget) / 2) * 100) / 100
    : prophetTarget
  const predictionDelta = ((lastPrediction - skin.currentPrice) / skin.currentPrice) * 100
  const isUp            = skin.changePct24h >= 0

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-dvh px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left"    />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      <div className="relative z-10 max-w-7xl mx-auto">

        <Link
          href="/predictor"
          className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-on-surface transition-colors focus-ring rounded mb-lg"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Back to Predictor
        </Link>

        {/* Skin header */}
        <div className="flex flex-wrap items-start justify-between gap-md mb-lg">
          <div className="flex items-center gap-md">
            <div>
              <div className="flex items-center gap-sm mb-1 flex-wrap">
                <h1 className="text-headline-xl font-bold text-on-surface">{skin.name}</h1>
                <span className={clsx(
                  'text-label-sm font-medium px-2 py-0.5 rounded-full border capitalize',
                  CATEGORY_COLOR[skin.category],
                )}>
                  {skin.category}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">{skin.wear}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-headline-xl font-black text-on-surface tabular-nums">
              {formatPrice(skin.currentPrice)}
            </p>
            <p className={clsx(
              'text-label-md font-medium flex items-center gap-1 justify-end mt-1',
              isUp ? 'text-primary' : 'text-red-400',
            )}>
              {isUp
                ? <TrendingUp  className="w-3.5 h-3.5" aria-hidden="true" />
                : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              }
              {isUp ? '+' : ''}{skin.changePct24h}% 24h
            </p>
          </div>
        </div>

        {/* Main content */}
        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-md items-start"
        >
          {/* Chart */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined} className="flex flex-col gap-md">
            <GlassPanel className="p-lg">
              <div className="flex items-center justify-between mb-md flex-wrap gap-2">
                <div>
                  <h2 className="text-title-md font-semibold text-on-surface">Price History &amp; Forecast</h2>
                  <p className="text-label-md text-on-surface-variant">
                    Green = historical · Purple dashed = AI prediction
                  </p>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Chart timeframe"
                  className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1"
                >
                  {(['1W', '1M', '3M'] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      role="radio"
                      aria-checked={timeframe === tf}
                      onClick={() => setTimeframe(tf)}
                      className={clsx(
                        'px-3 py-1 rounded text-label-md font-medium transition-all duration-150 focus-ring',
                        timeframe === tf
                          ? 'bg-primary/10 text-primary'
                          : 'text-on-surface-variant hover:text-on-surface',
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <PricePredictorChart data={chartData} height={380} />
            </GlassPanel>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              {[
                { label: 'Current Price',    value: formatPrice(skin.currentPrice),  color: 'text-on-surface' },
                { label: 'Ensemble Target', value: formatPrice(lastPrediction),      color: 'text-secondary'  },
                { label: 'Expected Return', value: `${predictionDelta >= 0 ? '+' : ''}${predictionDelta.toFixed(2)}%`,          color: predictionDelta >= 0 ? 'text-primary' : 'text-red-400' },
                { label: 'Forecast Window', value: '7 days',                                                                     color: 'text-on-surface' },
              ].map(({ label, value, color }) => (
                <GlassPanel key={label} className="p-md text-center">
                  <p className="text-label-sm text-on-surface-variant mb-1">{label}</p>
                  <p className={clsx('text-title-md font-bold tabular-nums', color)}>{value}</p>
                </GlassPanel>
              ))}
            </div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            variants={shouldAnimate ? itemVariants : undefined}
            className="lg:sticky lg:top-[24px]"
          >
            <AiAnalysisCard
              skin={skin}
              lastPrediction={lastPrediction}
              predictionDelta={predictionDelta}
              prophetTarget={prophetTarget}
              lstmTarget={lstmTarget ?? undefined}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
