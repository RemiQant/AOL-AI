import { clsx } from 'clsx'

interface AtmosphericOrbProps {
  color: 'primary' | 'secondary'
  size: 'lg' | 'md'
  position: 'top-left' | 'bottom-right'
  className?: string
}

const sizeMap = {
  lg: 'w-[600px] h-[600px]',
  md: 'w-[400px] h-[400px]',
}

const colorMap = {
  primary:   'bg-primary/5',
  secondary: 'bg-secondary/10',
}

const positionMap = {
  'top-left':     'top-[-10%] left-[20%]',
  'bottom-right': 'bottom-[10%] right-[10%]',
}

export function AtmosphericOrb({ color, size, position, className }: AtmosphericOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'absolute rounded-full blur-[120px] pointer-events-none animate-pulse-slow z-0',
        sizeMap[size],
        colorMap[color],
        positionMap[position],
        className,
      )}
    />
  )
}
