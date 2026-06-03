import type { Metadata } from 'next'
import { MotionProvider } from '@/components/providers/MotionProvider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'CS2MarketAI — Skin Market Predictor',
  description: 'AI-powered CS2 skin market price prediction using LSTM neural networks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-on-surface antialiased">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
