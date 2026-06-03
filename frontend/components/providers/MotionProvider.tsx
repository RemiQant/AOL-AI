'use client'

import { createContext, useContext } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MotionContextValue {
  shouldAnimate: boolean
}

const MotionContext = createContext<MotionContextValue>({ shouldAnimate: true })

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  return (
    <MotionContext.Provider value={{ shouldAnimate: !prefersReduced }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  return useContext(MotionContext)
}
