'use client'

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useMotion } from '@/components/providers/MotionProvider'
import type { AcousticProfile } from '@/lib/types'

interface AttributeBalanceChartProps {
  profile: AcousticProfile
}

export function AttributeBalanceChart({ profile }: AttributeBalanceChartProps) {
  const { shouldAnimate } = useMotion()

  const data = [
    { attribute: 'Energy',       value: profile.energy        },
    { attribute: 'Danceability', value: profile.danceability  },
    { attribute: 'Valence',      value: profile.valence       },
    { attribute: 'Acoustic',     value: profile.acousticness  },
  ]

  return (
    <div
      aria-label="Attribute Balance radar chart showing acoustic profile"
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#3d4a3d" />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fill: '#bccbb9', fontSize: 12 }}
          />
          <Radar
            dataKey="value"
            stroke="#d1bcff"
            fill="#d1bcff"
            fillOpacity={0.2}
            isAnimationActive={shouldAnimate}
            animationDuration={800}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(24,24,24,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e3e2e2',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
