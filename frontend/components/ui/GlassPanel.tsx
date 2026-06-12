import { clsx } from 'clsx'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function GlassPanel({ children, className, as: Tag = 'div' }: GlassPanelProps) {
  return (
    <Tag className={clsx('glass-panel rounded-lg', className)}>
      {children}
    </Tag>
  )
}
