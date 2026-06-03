import type { Playlist, Track, StatMetric, WeeklyDiscovery } from './types'

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Late Night Drive Vol. 2',
    thumbnailUrl: 'https://picsum.photos/seed/playlist1/80/80',
    trackCount: 24,
    extendedBy: 24,
    createdAt: '2026-05-30T22:14:00Z',
    status: 'completed',
    isFavorite: true,
    spotifyUrl: 'https://open.spotify.com/playlist/1',
    acousticProfile: { energy: 60, danceability: 55, valence: 40, acousticness: 30 },
  },
  {
    id: '2',
    title: 'Deep Work Ambient',
    thumbnailUrl: 'https://picsum.photos/seed/playlist2/80/80',
    trackCount: 15,
    extendedBy: 15,
    createdAt: '2026-05-29T10:00:00Z',
    status: 'completed',
    isFavorite: false,
    spotifyUrl: 'https://open.spotify.com/playlist/2',
    acousticProfile: { energy: 25, danceability: 20, valence: 50, acousticness: 75 },
  },
  {
    id: '3',
    title: 'Gym Hype 2024',
    thumbnailUrl: 'https://picsum.photos/seed/playlist3/80/80',
    trackCount: 30,
    extendedBy: 30,
    createdAt: '2026-05-28T07:30:00Z',
    status: 'completed',
    isFavorite: true,
    spotifyUrl: 'https://open.spotify.com/playlist/3',
    acousticProfile: { energy: 92, danceability: 85, valence: 80, acousticness: 5 },
  },
  {
    id: '4',
    title: 'Cyberpunk Focus Flow',
    thumbnailUrl: 'https://picsum.photos/seed/playlist4/80/80',
    trackCount: 18,
    extendedBy: 18,
    createdAt: '2026-05-27T15:00:00Z',
    status: 'processing',
    isFavorite: false,
    spotifyUrl: 'https://open.spotify.com/playlist/4',
  },
]

export const mockTracks: Track[] = [
  { id: 't1', title: 'Neon Pulsar', artist: 'Synthwave Ghost', matchConfidence: 97, bpm: 128, key: 'Am', albumArt: 'https://picsum.photos/seed/track1/40/40', spotifyUrl: '#' },
  { id: 't2', title: 'Dark Matter', artist: 'Void Protocol', matchConfidence: 94, bpm: 132, key: 'Dm', albumArt: 'https://picsum.photos/seed/track2/40/40', spotifyUrl: '#' },
  { id: 't3', title: 'Signal Loss', artist: 'Circuit Breaker', matchConfidence: 91, bpm: 124, key: 'Em', albumArt: 'https://picsum.photos/seed/track3/40/40', spotifyUrl: '#' },
  { id: 't4', title: 'Chromatic Drift', artist: 'Analog Dreams', matchConfidence: 88, bpm: 120, key: 'Bm', albumArt: 'https://picsum.photos/seed/track4/40/40', spotifyUrl: '#' },
  { id: 't5', title: 'Fractal Mind', artist: 'Neural Echo', matchConfidence: 85, bpm: 136, key: 'Fm', albumArt: 'https://picsum.photos/seed/track5/40/40', spotifyUrl: '#' },
]

export const mockStats: StatMetric[] = [
  { id: 's1', label: 'Total Tracks Discovered', value: '1,492', trend: '+12% this month', trendPositive: true, icon: 'library-music' },
  { id: 's2', label: 'Avg. Match Confidence', value: '94.8%', trend: '+2.1% this month', trendPositive: true, icon: 'brain' },
  { id: 's3', label: 'Top Genres', value: 'Synthwave · Dark Techno · Ambient Chill', icon: 'tag' },
]

export const mockDiscoveryGrowth: WeeklyDiscovery[] = [
  { week: 'W1', tracks: 280 },
  { week: 'W2', tracks: 350 },
  { week: 'W3', tracks: 410 },
  { week: 'W4', tracks: 452 },
]
