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

const TODAY = new Date().toISOString().split('T')[0]

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

  const historical    = payload.find((p) => p.dataKey === 'price')
  const prophet       = payload.find((p) => p.dataKey === 'predicted')
  const lstm          = payload.find((p) => p.dataKey === 'predictedLSTM')

  return (
    <div className="glass-panel rounded-lg px-md py-sm text-body-md min-w-[180px]">
      <p className="text-on-surface-variant text-label-md mb-1">{formattedDate}</p>
      {historical?.value != null && (
        <p className="text-primary font-medium">
          Historical: ${historical.value.toFixed(2)}
        </p>
      )}
      {prophet?.value != null && (
        <p className="text-secondary font-medium">
          Prophet: ${prophet.value.toFixed(2)}
        </p>
      )}
      {lstm?.value != null && (
        <p className="font-medium" style={{ color: '#fb923c' }}>
          LSTM: ${lstm.value.toFixed(2)}
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

  // Dynamic month ticks from the actual data range
  const monthTicks = (() => {
    if (!data.length) return []
    const start = new Date(data[0].date)
    const end   = new Date(data[data.length - 1].date)
    const ticks: string[] = []
    const cur = new Date(start.getFullYear(), start.getMonth(), 1)
    while (cur <= end) {
      ticks.push(cur.toISOString().split('T')[0])
      cur.setMonth(cur.getMonth() + 1)
    }
    return ticks
  })()

  const prices    = data.map((d) => d.price).filter((v): v is number => v !== null)
  const prophets  = data.map((d) => d.predicted).filter((v): v is number => v !== null)
  const lstms     = data.map((d) => d.predictedLSTM ?? null).filter((v): v is number => v !== null)
  const allValues = [...prices, ...prophets, ...lstms]
  const yMin      = allValues.length ? Math.floor(Math.min(...allValues) * 0.96) : 0
  const yMax      = allValues.length ? Math.ceil(Math.max(...allValues)  * 1.02) : 100

  const hasLSTM = lstms.length > 0

  const priceFmt = (v: number) =>
    v >= 1000 ? `${currency}${(v / 1000).toFixed(1)}k` : `${currency}${v.toFixed(0)}`

  return (
    <div aria-label="CS2 skin price chart with historical, Prophet, and LSTM forecast data" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#53e076" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#53e076" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

          <XAxis
            dataKey="date"
            ticks={monthTicks}
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
            formatter={(value) => {
              if (value === 'price')         return <span style={{ color: '#53e076', fontSize: 12 }}>Historical</span>
              if (value === 'predicted')     return <span style={{ color: '#d1bcff', fontSize: 12 }}>Prophet</span>
              if (value === 'predictedLSTM') return <span style={{ color: '#fb923c', fontSize: 12 }}>LSTM</span>
              return value
            }}
          />

          <ReferenceLine
            x={TODAY}
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="4 3"
            label={{ value: 'Today →', fill: '#869585', fontSize: 10, position: 'insideTopRight' }}
          />

          {/* Historical price area */}
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

          {/* Prophet forecast */}
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

          {/* LSTM forecast — only render if data has LSTM predictions */}
          {hasLSTM && (
            <Line
              type="monotone"
              dataKey="predictedLSTM"
              stroke="#fb923c"
              strokeWidth={2}
              strokeDasharray="3 5"
              connectNulls={false}
              dot={false}
              activeDot={{ r: 4, fill: '#fb923c', strokeWidth: 0 }}
              isAnimationActive={shouldAnimate}
              animationDuration={1300}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
