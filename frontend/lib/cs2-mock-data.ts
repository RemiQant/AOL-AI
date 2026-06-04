import type {
  SkinPricePoint,
  MarketEvent,
  NewsKeyword,
  PlayerCountData,
  SkinOption,
} from './cs2-types'

const AK_BASE_DATA: SkinPricePoint[] = [
  { date: '2026-03-01', price: 14.20, predicted: null, volume: 245 },
  { date: '2026-03-04', price: 14.55, predicted: null, volume: 312 },
  { date: '2026-03-07', price: 14.30, predicted: null, volume: 189 },
  { date: '2026-03-10', price: 14.85, predicted: null, volume: 267 },
  { date: '2026-03-13', price: 15.10, predicted: null, volume: 341 },
  { date: '2026-03-16', price: 14.75, predicted: null, volume: 223 },
  { date: '2026-03-19', price: 15.20, predicted: null, volume: 298 },
  { date: '2026-03-22', price: 15.45, predicted: null, volume: 356 },
  { date: '2026-03-25', price: 15.15, predicted: null, volume: 201 },
  { date: '2026-03-28', price: 15.60, predicted: null, volume: 289 },
  { date: '2026-03-31', price: 15.35, predicted: null, volume: 334 },
  { date: '2026-04-03', price: 15.80, predicted: null, volume: 278 },
  { date: '2026-04-06', price: 16.95, predicted: null, volume: 487 },
  { date: '2026-04-09', price: 16.40, predicted: null, volume: 312 },
  { date: '2026-04-12', price: 16.20, predicted: null, volume: 245 },
  { date: '2026-04-15', price: 16.60, predicted: null, volume: 367 },
  { date: '2026-04-18', price: 16.35, predicted: null, volume: 289 },
  { date: '2026-04-21', price: 16.05, predicted: null, volume: 223 },
  { date: '2026-04-24', price: 16.40, predicted: null, volume: 334 },
  { date: '2026-04-27', price: 15.85, predicted: null, volume: 198 },
  { date: '2026-04-30', price: 15.65, predicted: null, volume: 212 },
  { date: '2026-05-03', price: 15.30, predicted: null, volume: 445 },
  { date: '2026-05-06', price: 15.55, predicted: null, volume: 267 },
  { date: '2026-05-09', price: 15.90, predicted: null, volume: 289 },
  { date: '2026-05-12', price: 16.20, predicted: null, volume: 312 },
  { date: '2026-05-15', price: 16.05, predicted: null, volume: 234 },
  { date: '2026-05-18', price: 16.35, predicted: null, volume: 278 },
  { date: '2026-05-21', price: 16.60, predicted: null, volume: 345 },
  { date: '2026-05-24', price: 16.45, predicted: null, volume: 289 },
  { date: '2026-05-27', price: 16.80, predicted: null, volume: 334 },
  { date: '2026-05-30', price: 16.95, predicted: 16.95, predictedLSTM: 16.95, volume: 312 },
  { date: '2026-06-01', price: null,  predicted: 17.10, predictedLSTM: 17.32, volume: 0 },
  { date: '2026-06-02', price: null,  predicted: 17.25, predictedLSTM: 17.18, volume: 0 },
  { date: '2026-06-03', price: null,  predicted: 17.05, predictedLSTM: 17.41, volume: 0 },
  { date: '2026-06-04', price: null,  predicted: 17.40, predictedLSTM: 17.28, volume: 0 },
  { date: '2026-06-05', price: null,  predicted: 17.55, predictedLSTM: 17.63, volume: 0 },
  { date: '2026-06-06', price: null,  predicted: 17.35, predictedLSTM: 17.52, volume: 0 },
  { date: '2026-06-07', price: null,  predicted: 17.65, predictedLSTM: 17.74, volume: 0 },
]

function scaleData(data: SkinPricePoint[], factor: number): SkinPricePoint[] {
  return data.map((d) => ({
    ...d,
    price:         d.price         !== null ? Math.round(d.price         * factor * 100) / 100 : null,
    predicted:     d.predicted     !== null ? Math.round(d.predicted     * factor * 100) / 100 : null,
    predictedLSTM: d.predictedLSTM !== null && d.predictedLSTM !== undefined
      ? Math.round(d.predictedLSTM * factor * 100) / 100 : null,
  }))
}

export const mockSkins: SkinOption[] = [
  // ── RIFLES ────────────────────────────────────────────────────────────────
  { id: 'ak47-redline',           weapon: 'AK-47',          name: 'AK-47 | Redline',               wear: 'Field-Tested',   category: 'rifle',  currentPrice: 16.95,    changePct24h:  4.2, priceData: AK_BASE_DATA },
  { id: 'ak47-case-hardened',     weapon: 'AK-47',          name: 'AK-47 | Case Hardened',         wear: 'Battle-Scarred', category: 'rifle',  currentPrice: 48.00,    changePct24h:  1.5, priceData: scaleData(AK_BASE_DATA,   2.832) },
  { id: 'ak47-fire-serpent',      weapon: 'AK-47',          name: 'AK-47 | Fire Serpent',          wear: 'Field-Tested',   category: 'rifle',  currentPrice: 325.00,   changePct24h: -0.8, priceData: scaleData(AK_BASE_DATA,  19.172) },
  { id: 'ak47-asiimov',           weapon: 'AK-47',          name: 'AK-47 | Asiimov',               wear: 'Field-Tested',   category: 'rifle',  currentPrice: 27.50,    changePct24h:  2.1, priceData: scaleData(AK_BASE_DATA,   1.622) },
  { id: 'ak47-vulcan',            weapon: 'AK-47',          name: 'AK-47 | Vulcan',                wear: 'Field-Tested',   category: 'rifle',  currentPrice: 54.00,    changePct24h:  3.5, priceData: scaleData(AK_BASE_DATA,   3.186) },
  { id: 'ak47-hydroponic',        weapon: 'AK-47',          name: 'AK-47 | Hydroponic',            wear: 'Field-Tested',   category: 'rifle',  currentPrice: 68.00,    changePct24h: -1.2, priceData: scaleData(AK_BASE_DATA,   4.011) },
  { id: 'm4a4-howl',              weapon: 'M4A4',           name: 'M4A4 | Howl',                   wear: 'Field-Tested',   category: 'rifle',  currentPrice: 8420.00,  changePct24h:  2.3, priceData: scaleData(AK_BASE_DATA, 496.461) },
  { id: 'm4a4-asiimov',           weapon: 'M4A4',           name: 'M4A4 | Asiimov',                wear: 'Field-Tested',   category: 'rifle',  currentPrice: 19.00,    changePct24h:  0.9, priceData: scaleData(AK_BASE_DATA,   1.121) },
  { id: 'm4a1s-printstream',      weapon: 'M4A1-S',         name: 'M4A1-S | Printstream',          wear: 'Field-Tested',   category: 'rifle',  currentPrice: 98.00,    changePct24h:  5.1, priceData: scaleData(AK_BASE_DATA,   5.783) },
  { id: 'm4a1s-knight',           weapon: 'M4A1-S',         name: 'M4A1-S | Knight',               wear: 'Field-Tested',   category: 'rifle',  currentPrice: 590.00,   changePct24h: -0.4, priceData: scaleData(AK_BASE_DATA,  34.808) },
  { id: 'awp-dragon-lore',        weapon: 'AWP',            name: 'AWP | Dragon Lore',             wear: 'Field-Tested',   category: 'rifle',  currentPrice: 3245.00,  changePct24h: -0.5, priceData: scaleData(AK_BASE_DATA, 191.445) },
  { id: 'awp-medusa',             weapon: 'AWP',            name: 'AWP | Medusa',                  wear: 'Field-Tested',   category: 'rifle',  currentPrice: 1480.00,  changePct24h:  1.8, priceData: scaleData(AK_BASE_DATA,  87.316) },
  { id: 'awp-asiimov',            weapon: 'AWP',            name: 'AWP | Asiimov',                 wear: 'Field-Tested',   category: 'rifle',  currentPrice: 23.00,    changePct24h:  3.2, priceData: scaleData(AK_BASE_DATA,   1.357) },
  { id: 'awp-lightning-strike',   weapon: 'AWP',            name: 'AWP | Lightning Strike',        wear: 'Factory New',    category: 'rifle',  currentPrice: 168.00,   changePct24h:  6.5, priceData: scaleData(AK_BASE_DATA,   9.912) },

  // ── PISTOLS ───────────────────────────────────────────────────────────────
  { id: 'deagle-blaze',           weapon: 'Desert Eagle',   name: 'Desert Eagle | Blaze',          wear: 'Factory New',    category: 'pistol', currentPrice: 692.00,   changePct24h:  2.9, priceData: scaleData(AK_BASE_DATA,  40.828) },
  { id: 'deagle-printstream',     weapon: 'Desert Eagle',   name: 'Desert Eagle | Printstream',    wear: 'Factory New',    category: 'pistol', currentPrice: 78.00,    changePct24h:  4.4, priceData: scaleData(AK_BASE_DATA,   4.602) },
  { id: 'usps-kill-confirmed',    weapon: 'USP-S',          name: 'USP-S | Kill Confirmed',        wear: 'Field-Tested',   category: 'pistol', currentPrice: 39.00,    changePct24h:  1.3, priceData: scaleData(AK_BASE_DATA,   2.301) },
  { id: 'usps-orion',             weapon: 'USP-S',          name: 'USP-S | Orion',                 wear: 'Factory New',    category: 'pistol', currentPrice: 28.00,    changePct24h: -0.6, priceData: scaleData(AK_BASE_DATA,   1.651) },
  { id: 'glock-fade',             weapon: 'Glock-18',       name: 'Glock-18 | Fade',               wear: 'Factory New',    category: 'pistol', currentPrice: 328.00,   changePct24h:  3.1, priceData: scaleData(AK_BASE_DATA,  19.350) },

  // ── KNIVES ────────────────────────────────────────────────────────────────
  { id: 'karambit-doppler',       weapon: 'Karambit',       name: 'Karambit | Doppler Ph.2',       wear: 'Factory New',    category: 'knife',  currentPrice: 845.50,   changePct24h:  1.8, priceData: scaleData(AK_BASE_DATA,  49.882) },
  { id: 'karambit-case-hardened', weapon: 'Karambit',       name: 'Karambit | Case Hardened',      wear: 'Battle-Scarred', category: 'knife',  currentPrice: 2150.00,  changePct24h:  0.7, priceData: scaleData(AK_BASE_DATA, 126.843) },
  { id: 'butterfly-vanilla',      weapon: 'Butterfly Knife',name: 'Butterfly Knife | Vanilla',     wear: 'Battle-Scarred', category: 'knife',  currentPrice: 1850.00,  changePct24h: -1.5, priceData: scaleData(AK_BASE_DATA, 109.145) },
  { id: 'm9-crimson-web',         weapon: 'M9 Bayonet',     name: 'M9 Bayonet | Crimson Web',      wear: 'Minimal Wear',   category: 'knife',  currentPrice: 435.00,   changePct24h:  2.4, priceData: scaleData(AK_BASE_DATA,  25.664) },
  { id: 'bayonet-tiger-tooth',    weapon: 'Bayonet',        name: 'Bayonet | Tiger Tooth',         wear: 'Factory New',    category: 'knife',  currentPrice: 385.00,   changePct24h:  5.8, priceData: scaleData(AK_BASE_DATA,  22.714) },
  { id: 'stiletto-marble-fade',   weapon: 'Stiletto Knife', name: 'Stiletto Knife | Marble Fade',  wear: 'Factory New',    category: 'knife',  currentPrice: 530.00,   changePct24h:  3.7, priceData: scaleData(AK_BASE_DATA,  31.268) },
  { id: 'talon-doppler',          weapon: 'Talon Knife',    name: 'Talon Knife | Doppler',         wear: 'Factory New',    category: 'knife',  currentPrice: 695.00,   changePct24h:  0.5, priceData: scaleData(AK_BASE_DATA,  41.003) },
]

export const mockMarketEvents: MarketEvent[] = [
  {
    id: 'e8', date: '2026-05-28',
    title: 'Float Data API Security Patch',
    description: 'Valve patched a vulnerability exploited by bulk scrapers to extract float data. Temporarily affected third-party pricing tool accuracy, causing minor price uncertainty across rare items.',
    impact: 'neutral', priceChangePct: -2, source: 'CSFloat Blog',
  },
  {
    id: 'e7', date: '2026-05-03',
    title: 'CS2 FPS Optimization Patch v1.42',
    description: 'Mandatory client update briefly disrupted marketplace API endpoints for 6 hours. Uncertainty caused temporary selling pressure across mid-tier liquid items.',
    impact: 'neutral', priceChangePct: -5, source: 'Steam Community',
  },
  {
    id: 'e6', date: '2026-04-06',
    title: 'Operation Abandoned Night Launch',
    description: 'New operation released with exclusive skin collection and mission system. FOMO-driven demand pushed liquid skin prices to 3-month highs within 72 hours of launch.',
    impact: 'positive', priceChangePct: 10, source: 'CS2 Official Blog',
  },
  {
    id: 'e5', date: '2026-02-14',
    title: 'Katowice 2026 Major Tournament',
    description: 'Katowice Major drew a record 1.2M peak concurrent viewers. Sticker capsule demand drove secondary market activity; liquid skins benefited from increased new player acquisition.',
    impact: 'positive', priceChangePct: 15, source: 'PGL Esports',
  },
  {
    id: 'e4', date: '2026-01-20',
    title: 'Professional League Season 2 Announced',
    description: 'New professional circuit with a $2M prize pool boosted player engagement by 18%, positively impacting liquid skin demand as new players entered the market.',
    impact: 'positive', priceChangePct: 8, source: 'FACEIT',
  },
  {
    id: 'e3', date: '2025-12-08',
    title: 'Winter 2025 Collection Release',
    description: 'Valve released the Winter 2025 Case featuring 3 exclusive knife finishes and 5 new rifle skins. New supply partially offset existing market recovery sentiment.',
    impact: 'positive', priceChangePct: 12, source: 'CS2 Official Blog',
  },
  {
    id: 'e2', date: '2025-11-15',
    title: 'Community Market Trading Restrictions',
    description: 'Steam temporarily restricted marketplace trading to contain volatility. Third-party platforms continued operating, fragmenting price discovery across platforms for 72 hours.',
    impact: 'neutral', priceChangePct: 0, source: 'Steam Community',
  },
  {
    id: 'e1', date: '2025-10-28',
    title: 'Trade-Up Contract Policy Crash',
    description: 'Valve modified the Trade-Up Contract system to allow instant generation of knives and gloves from Covert-grade weapons. A $1.75B supply shock erased 30–40% of market capitalization within 48 hours.',
    impact: 'negative', priceChangePct: -35, source: 'Esports Legal News',
  },
]

export const mockNewsKeywords: NewsKeyword[] = [
  { word: 'trade-up contract', count: 1240, trend: 'up',     sentiment: 'negative', category: 'trade'     },
  { word: 'market crash',      count: 934,  trend: 'down',   sentiment: 'negative', category: 'valve'     },
  { word: 'investment return', count: 893,  trend: 'up',     sentiment: 'positive', category: 'community' },
  { word: 'valve update',      count: 847,  trend: 'up',     sentiment: 'neutral',  category: 'update'    },
  { word: 'CS2 major',         count: 756,  trend: 'up',     sentiment: 'positive', category: 'community' },
  { word: 'operation launch',  count: 654,  trend: 'up',     sentiment: 'positive', category: 'update'    },
  { word: 'AI prediction',     count: 621,  trend: 'up',     sentiment: 'positive', category: 'price'     },
  { word: 'price recovery',    count: 682,  trend: 'up',     sentiment: 'positive', category: 'price'     },
  { word: 'skin trading',      count: 567,  trend: 'stable', sentiment: 'neutral',  category: 'trade'     },
  { word: 'knife skin',        count: 523,  trend: 'stable', sentiment: 'positive', category: 'price'     },
  { word: 'float value',       count: 412,  trend: 'up',     sentiment: 'neutral',  category: 'trade'     },
  { word: 'ban wave',          count: 312,  trend: 'down',   sentiment: 'negative', category: 'valve'     },
]

export const mockPlayerCount: PlayerCountData = {
  current: 1_245_891, peak24h: 1_520_344, peak30d: 1_683_502,
  change24hPct: 3.2, trend: 'up',
  history: [
    { hour: '00:00', count: 892_450  }, { hour: '01:00', count: 845_100  },
    { hour: '02:00', count: 798_320  }, { hour: '03:00', count: 756_890  },
    { hour: '04:00', count: 734_210  }, { hour: '05:00', count: 712_540  },
    { hour: '06:00', count: 745_670  }, { hour: '07:00', count: 834_900  },
    { hour: '08:00', count: 967_340  }, { hour: '09:00', count: 1_123_450 },
    { hour: '10:00', count: 1_245_780 }, { hour: '11:00', count: 1_312_340 },
    { hour: '12:00', count: 1_389_120 }, { hour: '13:00', count: 1_420_670 },
    { hour: '14:00', count: 1_455_890 }, { hour: '15:00', count: 1_489_230 },
    { hour: '16:00', count: 1_520_344 }, { hour: '17:00', count: 1_502_110 },
    { hour: '18:00', count: 1_478_340 }, { hour: '19:00', count: 1_443_560 },
    { hour: '20:00', count: 1_398_780 }, { hour: '21:00', count: 1_354_210 },
    { hour: '22:00', count: 1_298_450 }, { hour: '23:00', count: 1_245_891 },
  ],
}
