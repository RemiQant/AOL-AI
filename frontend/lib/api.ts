import {
  mockSkins,
  mockMarketEvents,
  mockNewsKeywords,
  mockPlayerCount,
} from './cs2-mock-data'

import type {
  SkinOption,
  MarketEvent,
  NewsKeyword,
  PlayerCountData,
} from './cs2-types'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

// ── Sync mock accessors (used for initial state) ──────────────────────────────

export function getSkins(): SkinOption[]                   { return mockSkins }
export function getSkinById(id: string): SkinOption | undefined {
  return mockSkins.find((s) => s.id === id)
}
export function getPlayerCount(): PlayerCountData          { return mockPlayerCount }
export function getMarketEvents(): MarketEvent[]           { return mockMarketEvents }
export function getNewsKeywords(): NewsKeyword[]            { return mockNewsKeywords }

// ── Async fetch helpers (replace mock with real API when API_BASE is set) ─────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json()
}

/**
 * Fetch all tracked skins with current price.
 * Falls back to mock data if API is unavailable.
 */
export async function fetchSkins(): Promise<SkinOption[]> {
  if (!API_BASE) return mockSkins
  try {
    return await apiFetch<SkinOption[]>('/api/v1/skins')
  } catch {
    return mockSkins
  }
}

/**
 * Fetch skin detail (90-day history + 7-day AI forecast).
 * Falls back to mock lookup if API is unavailable.
 */
export async function fetchSkinById(id: string): Promise<SkinOption | undefined> {
  if (!API_BASE) return getSkinById(id)
  try {
    return await apiFetch<SkinOption>(`/api/v1/skins/${encodeURIComponent(id)}`)
  } catch {
    return getSkinById(id)
  }
}

/**
 * Fetch live player count stats and 30-day history.
 * Falls back to mock data if API is unavailable.
 */
export async function fetchPlayerCount(): Promise<PlayerCountData> {
  if (!API_BASE) return mockPlayerCount
  try {
    return await apiFetch<PlayerCountData>('/api/v1/players')
  } catch {
    return mockPlayerCount
  }
}

/**
 * Fetch market events from Supabase.
 * Falls back to mock data if API is unavailable.
 */
export async function fetchMarketEvents(): Promise<MarketEvent[]> {
  if (!API_BASE) return mockMarketEvents
  try {
    return await apiFetch<MarketEvent[]>('/api/v1/events')
  } catch {
    return mockMarketEvents
  }
}

/**
 * Fetch community keyword signals.
 * Falls back to mock data if API is unavailable.
 */
export async function fetchNewsKeywords(): Promise<NewsKeyword[]> {
  if (!API_BASE) return mockNewsKeywords
  try {
    return await apiFetch<NewsKeyword[]>('/api/v1/keywords')
  } catch {
    return mockNewsKeywords
  }
}
