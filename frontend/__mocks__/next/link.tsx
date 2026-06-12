import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  'aria-current'?: React.AriaAttributes['aria-current']
  [key: string]: unknown
}

function NextLink({ href, children, className, 'aria-current': ariaCurrent, ...rest }: LinkProps) {
  return (
    <a href={href} className={className} aria-current={ariaCurrent} {...rest}>
      {children}
    </a>
  )
}

export default NextLink
