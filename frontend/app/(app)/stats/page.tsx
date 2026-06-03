'use client'

import { motion } from 'framer-motion'
import { StatCard } from '@/components/ui/StatCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AtmosphericOrb } from '@/components/ui/AtmosphericOrb'
import { TextGradient } from '@/components/ui/TextGradient'
import { DiscoveryGrowthChart } from '@/components/charts/DiscoveryGrowthChart'
import { AttributeBalanceChart } from '@/components/charts/AttributeBalanceChart'
import { useMotion } from '@/components/providers/MotionProvider'
import { mockStats, mockDiscoveryGrowth } from '@/lib/mock-data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

const defaultProfile = { energy: 72, danceability: 65, valence: 55, acousticness: 28 }

export default function StatsPage() {
  const { shouldAnimate } = useMotion()

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative px-margin-mobile md:px-margin-desktop py-xl"
    >
      <AtmosphericOrb color="secondary" size="lg" position="top-left" />
      <AtmosphericOrb color="primary"   size="md" position="bottom-right" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-headline-xl font-bold text-on-surface mb-lg">
          <TextGradient>Performance Analytics</TextGradient>
        </h1>

        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-md mb-xl"
        >
          {mockStats.map((stat) => (
            <motion.div key={stat.id} variants={shouldAnimate ? itemVariants : undefined} className="flex-1 min-w-[200px]">
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-[1fr_320px] gap-lg">
          <GlassPanel className="p-lg">
            <h2 className="text-title-md font-semibold text-on-surface mb-md">Discovery Growth</h2>
            <DiscoveryGrowthChart data={mockDiscoveryGrowth} />
          </GlassPanel>

          <GlassPanel className="p-lg">
            <h2 className="text-title-md font-semibold text-on-surface mb-md">Attribute Balance</h2>
            <AttributeBalanceChart profile={defaultProfile} />
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  )
}
