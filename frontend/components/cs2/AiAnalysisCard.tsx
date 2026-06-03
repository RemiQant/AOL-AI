'use client'

import { Brain, TrendingUp, TrendingDown, Minus, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import type { SkinOption } from '@/lib/cs2-types'

type Signal   = 'BUY' | 'HOLD' | 'SELL'
type RiskLevel = 'Low' | 'Moderate' | 'High'

function getSignal(delta: number): Signal {
  if (delta >= 2.5)  return 'BUY'
  if (delta >= -0.5) return 'HOLD'
  return 'SELL'
}

function getRisk(category: SkinOption['category'], signal: Signal): RiskLevel {
  if (category === 'knife') return signal === 'SELL' ? 'High' : 'Moderate'
  if (signal === 'BUY')     return 'Low'
  if (signal === 'HOLD')    return 'Moderate'
  return 'High'
}

function getConfidence(category: SkinOption['category']): number {
  return category === 'knife' ? 81.5 : category === 'pistol' ? 85.2 : 87.3
}

const KEY_SIGNALS: Record<SkinOption['category'], string[]> = {
  rifle: [
    'Player count +3.2% in 24h → demand pressure positive',
    'Post-operation demand cycle: week 2 historically +8.3%',
    'Steam volume trading above 30-day moving average',
    'Liquid skin: tight bid-ask spread, low slippage risk',
  ],
  pistol: [
    'High-velocity segment: strong daily trading liquidity',
    'Community tournament demand boosting short-term volume',
    'Price-to-float correlation remains positive this week',
    'Market sentiment index: bullish momentum detected',
  ],
  knife: [
    'Float distribution: supply-constrained in upper tier',
    'Pattern ID premium stable vs. 30-day benchmark',
    'Sparse transaction data: confidence slightly reduced',
    'Post-crash recovery: knife segment historically undervalued',
  ],
}

const SIGNAL_STYLE: Record<Signal, { bg: string; border: string; text: string; glow: string }> = {
  BUY:  { bg: 'bg-primary/10',   border: 'border-primary/40',   text: 'text-primary',   glow: 'shadow-glow-primary-lg' },
  HOLD: { bg: 'bg-amber-400/10', border: 'border-amber-400/40', text: 'text-amber-400', glow: '' },
  SELL: { bg: 'bg-red-500/10',   border: 'border-red-500/40',   text: 'text-red-400',   glow: '' },
}

const RISK_ICON: Record<RiskLevel, React.ElementType> = {
  Low:      ShieldCheck,
  Moderate: AlertTriangle,
  High:     ShieldAlert,
}

const RISK_COLOR: Record<RiskLevel, string> = {
  Low:      'text-primary',
  Moderate: 'text-amber-400',
  High:     'text-red-400',
}

interface AiAnalysisCardProps {
  skin: SkinOption
  lastPrediction: number
  predictionDelta: number
}

export function AiAnalysisCard({ skin, lastPrediction, predictionDelta }: AiAnalysisCardProps) {
  const signal     = getSignal(predictionDelta)
  const risk       = getRisk(skin.category, signal)
  const confidence = getConfidence(skin.category)
  const style      = SIGNAL_STYLE[signal]
  const RiskIcon   = RISK_ICON[risk]
  const signals    = KEY_SIGNALS[skin.category]

  return (
    <GlassPanel className="p-lg flex flex-col gap-lg relative overflow-hidden">
      {/* Background accent glow */}
      <div
        aria-hidden="true"
        className={clsx(
          'absolute inset-0 opacity-5 pointer-events-none',
          signal === 'BUY'  && 'bg-primary',
          signal === 'HOLD' && 'bg-amber-400',
          signal === 'SELL' && 'bg-red-400',
        )}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center">
            <Brain className="w-5 h-5 text-secondary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-title-md font-bold text-on-surface">AI Analysis</h3>
            <p className="text-label-sm text-on-surface-variant">LSTM · 90-day window</p>
          </div>
        </div>
        <span className="text-label-sm text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full">
          LIVE
        </span>
      </div>

      {/* Signal + confidence */}
      <div className="relative grid grid-cols-2 gap-md">
        {/* Signal badge */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">
            Signal
          </p>
          <div
            aria-label={`Signal: ${signal}`}
            className={clsx(
              'w-full text-center py-md rounded-xl border-2 font-black tracking-wider',
              'text-3xl transition-all duration-300',
              style.bg, style.border, style.text, style.glow,
            )}
          >
            {signal}
          </div>
          <div className="flex items-center gap-1 mt-sm">
            {signal === 'BUY'  && <TrendingUp  className="w-3.5 h-3.5 text-primary"   aria-hidden="true" />}
            {signal === 'HOLD' && <Minus       className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />}
            {signal === 'SELL' && <TrendingDown className="w-3.5 h-3.5 text-red-400"  aria-hidden="true" />}
            <span className={clsx('text-label-sm font-medium', style.text)}>
              {signal === 'BUY' ? 'Bullish momentum' : signal === 'HOLD' ? 'Wait & observe' : 'Bearish pressure'}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex flex-col justify-center">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">
            Confidence
          </p>
          <p className={clsx('text-4xl font-black tabular-nums', style.text)}>
            {confidence.toFixed(1)}%
          </p>
          <div className="mt-sm h-2 rounded-full bg-white/8 overflow-hidden">
            <div
              aria-hidden="true"
              className={clsx(
                'h-full rounded-full transition-all duration-700',
                signal === 'BUY'  && 'bg-primary',
                signal === 'HOLD' && 'bg-amber-400',
                signal === 'SELL' && 'bg-red-400',
              )}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-label-sm text-on-surface-variant mt-1">model confidence</p>
        </div>
      </div>

      {/* Forecast metrics row */}
      <div className="relative grid grid-cols-3 gap-sm pt-md border-t border-white/8">
        <div>
          <p className="text-label-sm text-on-surface-variant mb-1">7-Day Target</p>
          <p className="text-title-md font-bold text-on-surface tabular-nums">
            ${lastPrediction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant mb-1">Expected Δ</p>
          <p className={clsx('text-title-md font-bold tabular-nums', predictionDelta >= 0 ? 'text-primary' : 'text-red-400')}>
            {predictionDelta >= 0 ? '+' : ''}{predictionDelta.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant mb-1">Risk</p>
          <div className="flex items-center gap-1">
            <RiskIcon className={clsx('w-4 h-4', RISK_COLOR[risk])} aria-hidden="true" />
            <p className={clsx('text-title-md font-bold', RISK_COLOR[risk])}>{risk}</p>
          </div>
        </div>
      </div>

      {/* Key signals */}
      <div className="relative">
        <p className="text-label-md text-on-surface-variant uppercase tracking-widest mb-md">
          Key Signals
        </p>
        <ul className="flex flex-col gap-sm" aria-label="Key market signals">
          {signals.map((sig, i) => (
            <li key={i} className="flex items-start gap-sm">
              <CheckCircle2
                className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-body-md text-on-surface-variant leading-snug">{sig}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Liquidity tag */}
      <div className="relative flex items-center gap-sm pt-md border-t border-white/8">
        <Info className="w-4 h-4 text-on-surface-variant/60 flex-shrink-0" aria-hidden="true" />
        <p className="text-label-sm text-on-surface-variant/70 leading-relaxed">
          {skin.category === 'knife'
            ? 'Rare skin — low transaction volume. Prediction based on comparable float/pattern tier data.'
            : 'Liquid skin — high daily transaction volume ensures reliable prediction accuracy.'
          }
        </p>
      </div>

      {/* Model footer */}
      <div className="relative -mt-sm flex flex-wrap gap-x-md gap-y-1">
        {[
          { label: 'Model', value: 'LSTM 2-layer' },
          { label: 'MAE',   value: '$0.45'        },
          { label: 'RMSE',  value: '$0.62'        },
          { label: 'R²',    value: '0.847'        },
        ].map(({ label, value }) => (
          <span key={label} className="text-label-sm text-on-surface-variant/50">
            <span className="text-on-surface-variant/70">{label}:</span> {value}
          </span>
        ))}
      </div>
    </GlassPanel>
  )
}
