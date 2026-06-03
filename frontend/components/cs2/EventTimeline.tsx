import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import type { MarketEvent } from '@/lib/cs2-types'

const impactConfig = {
  positive: {
    dot:   'bg-primary border-primary/40',
    badge: 'bg-primary/10 text-primary border border-primary/20',
    icon:  TrendingUp,
    sign:  '+',
  },
  negative: {
    dot:   'bg-red-400 border-red-400/40',
    badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon:  TrendingDown,
    sign:  '',
  },
  neutral: {
    dot:   'bg-on-surface-variant border-on-surface-variant/40',
    badge: 'bg-white/5 text-on-surface-variant border border-white/10',
    icon:  Minus,
    sign:  '',
  },
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

interface EventTimelineProps {
  events: MarketEvent[]
  limit?: number
  className?: string
}

export function EventTimeline({ events, limit, className }: EventTimelineProps) {
  const visible = limit ? events.slice(0, limit) : events

  return (
    <ol aria-label="CS2 market events timeline" className={clsx('relative', className)}>
      <div
        aria-hidden="true"
        className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"
      />

      {visible.map((event, idx) => {
        const cfg  = impactConfig[event.impact]
        const Icon = cfg.icon

        return (
          <li
            key={event.id}
            className={clsx('relative pl-8', idx < visible.length - 1 && 'mb-lg')}
          >
            <span
              aria-hidden="true"
              className={clsx(
                'absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2',
                cfg.dot,
              )}
            />

            <div className="flex flex-wrap items-center gap-2 mb-1">
              <time
                dateTime={event.date}
                className="text-label-sm text-on-surface-variant tabular-nums"
              >
                {formatEventDate(event.date)}
              </time>

              {event.priceChangePct !== 0 && (
                <span
                  className={clsx(
                    'inline-flex items-center gap-0.5 text-label-sm font-medium px-2 py-0.5 rounded-full',
                    cfg.badge,
                  )}
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  {cfg.sign}{event.priceChangePct}%
                </span>
              )}
            </div>

            <h3 className="text-body-md font-semibold text-on-surface leading-snug mb-1">
              {event.title}
            </h3>
            <p className="text-label-md text-on-surface-variant leading-relaxed">
              {event.description}
            </p>
            <p className="text-label-sm text-on-surface-variant/60 mt-1">
              Source: {event.source}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
