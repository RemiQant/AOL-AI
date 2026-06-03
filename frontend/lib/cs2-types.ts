export interface SkinPricePoint {
  date: string
  price: number | null
  predicted: number | null
  volume: number
}

export interface MarketEvent {
  id: string
  date: string
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  priceChangePct: number
  source: string
}

export interface NewsKeyword {
  word: string
  count: number
  trend: 'up' | 'down' | 'stable'
  sentiment: 'positive' | 'negative' | 'neutral'
  category: 'update' | 'trade' | 'community' | 'valve' | 'price'
}

export interface PlayerCountPoint {
  hour: string
  count: number
}

export interface PlayerCountData {
  current: number
  peak24h: number
  peak30d: number
  change24hPct: number
  trend: 'up' | 'down' | 'stable'
  history: PlayerCountPoint[]
}

export interface SkinOption {
  id: string
  weapon: string
  name: string
  wear: string
  category: 'rifle' | 'pistol' | 'knife'
  currentPrice: number
  changePct24h: number
  priceData: SkinPricePoint[]
}
