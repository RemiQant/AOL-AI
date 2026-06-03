'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMotion } from '@/components/providers/MotionProvider'
import type { WeeklyDiscovery } from '@/lib/types'

interface DiscoveryGrowthChartProps {
  data: WeeklyDiscovery[]
}

export function DiscoveryGrowthChart({ data }: DiscoveryGrowthChartProps) {
  const { shouldAnimate } = useMotion()

  return (
    <div
      aria-label="Discovery Growth chart showing weekly track discoveries"
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#53e076" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#53e076" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3d4a3d" vertical={false} />
          <XAxis
            dataKey="week"
            stroke="#869585"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#869585"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(24,24,24,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(20px)',
              color: '#e3e2e2',
            }}
          />
          <Area
            type="monotone"
            dataKey="tracks"
            stroke="#53e076"
            strokeWidth={2}
            fill="url(#primaryGrad)"
            isAnimationActive={shouldAnimate}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
