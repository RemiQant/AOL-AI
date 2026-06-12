import Link from 'next/link'
import { clsx } from 'clsx'
import { LayoutDashboard, TrendingUp, CalendarClock, Hash } from 'lucide-react'

const tabs = [
  { href: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/predictor', icon: TrendingUp,      label: 'Predictor' },
  { href: '/events',    icon: CalendarClock,   label: 'Events'    },
  { href: '/keywords',  icon: Hash,            label: 'Keywords'  },
]

interface BottomTabBarProps {
  currentPath: string
}

export function BottomTabBar({ currentPath }: BottomTabBarProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 flex"
    >
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-label-sm transition-colors focus-ring',
              isActive ? 'text-primary' : 'text-on-surface-variant',
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
