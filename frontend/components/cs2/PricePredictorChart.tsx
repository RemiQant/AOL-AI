'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useMotion } from '@/components/providers/MotionProvider'
import type { SkinPricePoint } from '@/lib/cs2-types'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number | null; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const formattedDate = label
    ? new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  const historical = payload.find((p) => p.dataKey === 'price')
  const predicted  = payload.find((p) => p.dataKey === 'predicted')

  return (
    <div className="glass-panel rounded-lg px-md py-sm text-body-md min-w-[160px]">
      <p className="text-on-surface-variant text-label-md mb-1">{formattedDate}</p>
      {historical?.value != null && (
        <p className="text-primary font-medium">
          Historical: ${historical.value.toFixed(2)}
        </p>
      )}
      {predicted?.value != null && (
        <p className="text-secondary font-medium">
          AI Forecast: ${predicted.value.toFixed(2)}
        </p>
      )}
    </div>
  )
}

interface PricePredictorChartProps {
  data: SkinPricePoint[]
  height?: number
  currency?: string
}

export function PricePredictorChart({ data, height = 280, currency = '$' }: PricePredictorChartProps) {
  const { shouldAnimate } = useMotion()

  const monthTicks = ['2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01']
  const validTicks  = monthTicks.filter((t) => data.some((d) => d.date >= t))

  const prices     = data.map((d) => d.price).filter((v): v is number => v !== null)
  const predicted  = data.map((d) => d.predicted).filter((v): v is number => v !== null)
  const allValues  = [...prices, ...predicted]
  const yMin       = Math.floor(Math.min(...allValues) * 0.96)
  const yMax       = Math.ceil(Math.max(...allValues)  * 1.02)

  const priceFmt = (v: number) =>
    v >= 1000 ? `${currency}${(v / 1000).toFixed(1)}k` : `${currency}${v.toFixed(0)}`

  return (
    <div aria-label="CS2 skin price chart with historical and AI forecast data" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#53e076" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#53e076" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            ticks={validTicks}
            tickFormatter={(s) =>
              new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: '#869585', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={priceFmt}
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: '#869585', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            formatter={(value) =>
              value === 'price' ? (
                <span style={{ color: '#53e076', fontSize: 12 }}>Historical</span>
              ) : (
                <span style={{ color: '#d1bcff', fontSize: 12 }}>AI Forecast</span>
              )
            }
          />

          <ReferenceLine
            x="2026-05-30"
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="4 3"
            label={{ value: 'Today →', fill: '#869585', fontSize: 10, position: 'insideTopRight' }}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#53e076"
            strokeWidth={2}
            fill="url(#historicalGrad)"
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, fill: '#53e076', strokeWidth: 0 }}
            isAnimationActive={shouldAnimate}
            animationDuration={900}
          />

          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#d1bcff"
            strokeWidth={2}
            strokeDasharray="6 3"
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, fill: '#d1bcff', strokeWidth: 0 }}
            isAnimationActive={shouldAnimate}
            animationDuration={1100}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
