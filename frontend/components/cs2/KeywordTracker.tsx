'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import type { NewsKeyword } from '@/lib/cs2-types'

type Category = 'all' | NewsKeyword['category']

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'price',     label: 'Price'     },
  { key: 'trade',     label: 'Trade'     },
  { key: 'update',    label: 'Updates'   },
  { key: 'community', label: 'Community' },
  { key: 'valve',     label: 'Valve'     },
]

const CATEGORY_COLORS: Record<NewsKeyword['category'], string> = {
  update:    'bg-amber-400',
  trade:     'bg-blue-400',
  community: 'bg-purple-400',
  valve:     'bg-red-400',
  price:     'bg-primary',
}

const SENTIMENT_CONFIG = {
  positive: { color: 'text-primary',             label: 'Positive' },
  negative: { color: 'text-red-400',             label: 'Negative' },
  neutral:  { color: 'text-on-surface-variant',  label: 'Neutral'  },
}

const TREND_ICON = {
  up:     ArrowUp,
  down:   ArrowDown,
  stable: Minus,
}

const TREND_COLOR = {
  up:     'text-primary',
  down:   'text-red-400',
  stable: 'text-on-surface-variant',
}

interface KeywordTrackerProps {
  keywords: NewsKeyword[]
  limit?: number
  showFilters?: boolean
  className?: string
}

export function KeywordTracker({
  keywords,
  limit,
  showFilters = true,
  className,
}: KeywordTrackerProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? keywords
    : keywords.filter((k) => k.category === activeCategory)

  const visible  = limit ? filtered.slice(0, limit) : filtered
  const maxCount = Math.max(...keywords.map((k) => k.count))

  return (
    <div className={clsx('flex flex-col gap-md', className)}>
      {showFilters && (
        <div
          role="tablist"
          aria-label="Filter by keyword category"
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              className={clsx(
                'px-3 py-1 rounded-full text-label-sm font-medium transition-all duration-150 focus-ring',
                activeCategory === key
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-white/5 text-on-surface-variant border border-white/10 hover:bg-white/10 hover:text-on-surface',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <ul aria-label="News keyword frequency tracker" className="flex flex-col gap-sm">
        {visible.map((kw) => {
          const TrendIcon    = TREND_ICON[kw.trend]
          const trendColor   = TREND_COLOR[kw.trend]
          const sentCfg      = SENTIMENT_CONFIG[kw.sentiment]
          const barPct       = Math.round((kw.count / maxCount) * 100)
          const catColor     = CATEGORY_COLORS[kw.category]

          return (
            <li
              key={kw.word}
              className="flex items-center gap-sm group"
              aria-label={`${kw.word}: ${kw.count} mentions, ${kw.sentiment} sentiment`}
            >
              <span
                aria-hidden="true"
                className={clsx('w-2 h-2 rounded-full flex-shrink-0', catColor)}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-body-md font-medium text-on-surface truncate pr-2">
                    {kw.word}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={clsx('text-label-sm font-medium', sentCfg.color)}>
                      {sentCfg.label}
                    </span>
                    <div className={clsx('flex items-center gap-0.5', trendColor)}>
                      <TrendIcon className="w-3 h-3" aria-hidden="true" />
                      <span className="text-label-sm tabular-nums">{kw.count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="h-1 rounded-full bg-white/8 overflow-hidden"
                >
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      kw.sentiment === 'positive' ? 'bg-primary'
                        : kw.sentiment === 'negative' ? 'bg-red-400'
                        : 'bg-on-surface-variant/50',
                    )}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {visible.length === 0 && (
        <p className="text-body-md text-on-surface-variant text-center py-lg">
          No keywords in this category.
        </p>
      )}
    </div>
  )
}
