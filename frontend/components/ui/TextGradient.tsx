import { clsx } from 'clsx'

interface TextGradientProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function TextGradient({ children, className, as: Tag = 'span' }: TextGradientProps) {
  return (
    <Tag className={clsx('text-gradient', className)}>
      {children}
    </Tag>
  )
}
