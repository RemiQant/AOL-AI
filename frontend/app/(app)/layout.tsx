'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <Sidebar />
      <main className="md:ml-[280px] min-h-dvh relative overflow-hidden pb-20 md:pb-0">
        {children}
      </main>
      <BottomTabBar currentPath={pathname} />
    </>
  )
}
