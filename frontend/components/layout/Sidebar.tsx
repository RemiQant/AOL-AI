'use client'

import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'
import { TextGradient } from '@/components/ui/TextGradient'
import { Crosshair } from 'lucide-react'

const navItems = [
  { href: '/',           icon: 'dashboard' as const, label: 'Dashboard'  },
  { href: '/predictor',  icon: 'trending'  as const, label: 'Predictor'  },
  { href: '/events',     icon: 'calendar'  as const, label: 'Events'     },
  { href: '/keywords',   icon: 'hash'      as const, label: 'Keywords'   },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col py-lg px-md h-screen fixed left-0 top-0 w-[280px] bg-surface-dim border-r border-white/10 z-50">
      <div className="flex items-center gap-sm mb-xl px-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Crosshair className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <TextGradient as="div" className="text-title-lg font-bold leading-none">
            CS2MarketAI
          </TextGradient>
          <p className="text-label-sm text-on-surface-variant">Skin Market Predictor</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      <div className="px-4 py-md border-t border-white/8">
        <p className="text-label-sm text-on-surface-variant/60 leading-relaxed">
          LSTM Neural Network · 90-day training window · 7-day forecast horizon
        </p>
      </div>
    </aside>
  )
}
