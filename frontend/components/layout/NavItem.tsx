import Link from 'next/link'
import { clsx } from 'clsx'
import { Sparkles, History, Star, BarChart2, LayoutDashboard, TrendingUp, CalendarClock, Hash } from 'lucide-react'

const iconMap = {
  sparkles:  Sparkles,
  history:   History,
  star:      Star,
  chart:     BarChart2,
  dashboard: LayoutDashboard,
  trending:  TrendingUp,
  calendar:  CalendarClock,
  hash:      Hash,
} as const

type IconKey = keyof typeof iconMap

interface NavItemProps {
  href: string
  icon: IconKey
  label: string
  isActive: boolean
}

export function NavItem({ href, icon, label, isActive }: NavItemProps) {
  const Icon = iconMap[icon]
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-4 rounded-lg px-4 py-3 text-label-md transition-all duration-150 focus-ring',
        isActive
          ? 'text-primary bg-primary/10 shadow-glow-primary'
          : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface hover:translate-x-1',
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}
