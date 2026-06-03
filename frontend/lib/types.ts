export interface Playlist {
  id: string
  title: string
  thumbnailUrl: string
  trackCount: number
  extendedBy: number
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
  isFavorite: boolean
  spotifyUrl: string
  acousticProfile?: AcousticProfile
}

export interface AcousticProfile {
  energy: number      // 0–100
  danceability: number
  valence: number
  acousticness: number
}

export interface Track {
  id: string
  title: string
  artist: string
  matchConfidence: number  // 0–100
  bpm: number
  key: string
  albumArt: string
  spotifyUrl: string
}

export interface StatMetric {
  id: string
  label: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  icon: string
}

export interface WeeklyDiscovery {
  week: string
  tracks: number
}

export interface GenerationResult {
  playlist: Playlist
  tracks: Track[]
}
