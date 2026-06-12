'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface GenerateButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled?: boolean
}

export function GenerateButton({ isLoading, onClick, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={clsx(
        'flex items-center gap-sm bg-primary text-on-primary font-label-lg rounded-xl px-8 py-4',
        'transition-all duration-150',
        'hover:scale-[1.02] hover:shadow-glow-primary-lg',
        'disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed',
        'focus-ring',
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-label="Generating" />
          <span>Generating…</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span>Generate Extension</span>
        </>
      )}
    </button>
  )
}
