import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from './GlassPanel'
import type { StatMetric } from '@/lib/types'

interface StatCardProps {
  stat: StatMetric
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <GlassPanel className="p-lg flex-1 min-w-[200px]">
      <p className="text-label-md text-on-surface-variant mb-sm">{stat.label}</p>
      <p className="text-headline-xl font-bold text-on-surface mb-sm">{stat.value}</p>
      {stat.trend && (
        <div className="flex items-center gap-1 text-label-md">
          {stat.trendPositive
            ? <TrendingUp className="w-4 h-4 text-primary" aria-hidden="true" />
            : <TrendingDown className="w-4 h-4 text-error" aria-hidden="true" />
          }
          <span className={clsx(stat.trendPositive ? 'text-primary' : 'text-error')}>
            {stat.trend}
          </span>
        </div>
      )}
    </GlassPanel>
  )
}
