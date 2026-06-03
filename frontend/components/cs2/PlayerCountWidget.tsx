'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { useMotion } from '@/components/providers/MotionProvider'
import type { PlayerCountData } from '@/lib/cs2-types'

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

interface PlayerCountWidgetProps {
  data: PlayerCountData
  className?: string
}

export function PlayerCountWidget({ data, className }: PlayerCountWidgetProps) {
  const { shouldAnimate } = useMotion()
  const isUp = data.trend === 'up'

  return (
    <GlassPanel className={clsx('p-lg flex flex-col gap-md', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <span className="text-label-md text-on-surface-variant uppercase tracking-widest">
            Live Players
          </span>
        </div>
        <div
          className={clsx(
            'flex items-center gap-1 text-label-md font-medium px-2 py-0.5 rounded-full',
            isUp
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20',
          )}
        >
          {isUp
            ? <TrendingUp className="w-3 h-3" aria-hidden="true" />
            : <TrendingDown className="w-3 h-3" aria-hidden="true" />
          }
          <span>{isUp ? '+' : ''}{data.change24hPct.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <p
          className="text-display-lg font-bold text-on-surface leading-none tabular-nums"
          aria-label={`${data.current.toLocaleString()} current players`}
        >
          {formatCount(data.current)}
        </p>
        <p className="text-label-md text-on-surface-variant mt-1">concurrent players</p>
      </div>

      <div aria-label="Player count over last 24 hours" className="h-[72px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.history} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="playerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="count"
              stroke="#fbbf24"
              strokeWidth={1.5}
              fill="url(#playerGrad)"
              dot={false}
              isAnimationActive={shouldAnimate}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-sm pt-1 border-t border-white/8">
        <div>
          <p className="text-label-sm text-on-surface-variant">Peak 24h</p>
          <p className="text-body-md font-semibold text-on-surface tabular-nums">
            {formatCount(data.peak24h)}
          </p>
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant">Peak 30d</p>
          <p className="text-body-md font-semibold text-on-surface tabular-nums">
            {formatCount(data.peak30d)}
          </p>
        </div>
      </div>
    </GlassPanel>
  )
}
