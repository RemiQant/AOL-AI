'use client'

import { useEffect } from 'react'
import { clsx } from 'clsx'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'fixed bottom-6 right-6 z-[1000] flex items-center gap-sm px-md py-sm rounded-lg glass-panel shadow-glow-secondary max-w-sm',
        type === 'error' ? 'border-error/30' : 'border-primary/30',
      )}
    >
      {type === 'success'
        ? <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
        : <XCircle className="w-5 h-5 text-error flex-shrink-0" />
      }
      <p className="text-body-md text-on-surface flex-1">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-on-surface-variant hover:text-on-surface transition-colors focus-ring rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
