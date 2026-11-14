export type TradePriceCombine = 'Or' | 'And';

export interface TradePriceItem {
  currencyCode: string;
  quantity: number;
}

export type TradeCurrencyCategory = 'Orb' | 'Map' | 'Rune' | 'Boss';

export interface TradeCurrencyDefinition {
  code: string;
  name: string;
  shortLabel: string;
  category: TradeCurrencyCategory;
  sprite: string;
  aliases?: readonly string[];
  offerAliases?: readonly string[];
}

export const MAX_PRICE_ITEMS = 4;
export const MIN_PRICE_QUANTITY = 1;
export const MAX_PRICE_QUANTITY = 999;
export const MAX_PRICE_NOTE_LENGTH = 160;

const RUNE_NAMES = [
  'El', 'Eld', 'Tir', 'Nef', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
  'Amn', 'Sol', 'Shael', 'Dol', 'Hel', 'Io', 'Lum', 'Ko', 'Fal', 'Lem',
  'Pul', 'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm', 'Lo', 'Sur', 'Ber',
  'Jah', 'Cham', 'Zod',
  'Brak', 'Zeph', 'Myr', 'Grit', 'Dem', 'Hev'
] as const;

const RUNE_CURRENCIES: TradeCurrencyDefinition[] = RUNE_NAMES.map((label, index) => ({
  code: `r${String(index + 1).padStart(2, '0')}`,
  name: `${label} Rune`,
  shortLabel: label,
  category: 'Rune',
  sprite: `/data/sprites/items/misc-rune-${label.toLowerCase()}_rune.webp`,
  aliases: [label.toLowerCase(), `${label.toLowerCase()} rune`]
}));

const LOW_RUNE_CURRENCIES = RUNE_CURRENCIES.slice(0, 19);
const MID_HIGH_RUNE_CURRENCIES = RUNE_CURRENCIES.slice(19);

export const TRADE_CURRENCIES: readonly TradeCurrencyDefinition[] = [
  {
    code: 'ka3',
    name: 'Orb of Corruption',
    shortLabel: 'OoC',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofcorruption.webp',
    aliases: ['ooc', 'corruption', 'corrupt']
  },
  {
    code: 'ooa',
    name: 'Orb of Assemblage',
    shortLabel: 'OoA',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofassemblage.webp',
    aliases: ['ooa', 'assemblage']
  },
  {
    code: 'ooi',
    name: 'Orb of Infusion',
    shortLabel: 'OoI',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofinfusion.webp',
    aliases: ['ooi', 'infusion']
  },
  {
    code: 'oos',
    name: 'Orb of Socketing',
    shortLabel: 'OoS',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofsocketing.webp',
    aliases: ['oos', 'socketing', 'socket']
  },
  {
    code: 'ooc',
    name: 'Orb of Conversion',
    shortLabel: 'Conv Orb',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofconversion.webp',
    aliases: ['conversion', 'conv orb']
  },
  {
    code: 'ooe',
    name: 'Orb of Shadows',
    shortLabel: 'Shadow Orb',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofshadows.webp',
    aliases: ['ooe', 'shadows', 'shadow orb']
  },
  {
    code: 'oor',
    name: 'Orb of Renewal',
    shortLabel: 'Renewal Orb',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-powerorbs-orbofrenewal.webp',
    aliases: ['oor', 'renewal', 'renewal orb']
  },
  {
    code: '1gc',
    name: 'Gem Cluster',
    shortLabel: 'Gem Cluster',
    category: 'Orb',
    sprite: '/data/sprites/items/misc-storage-gem_cluster.webp',
    aliases: ['cluster', 'gem cluster', 'gems'],
    offerAliases: ['gem clusters', 'clusters']
  },
  {
    code: 'mrl',
    name: 'Vizjerei Prism',
    shortLabel: 'Prism',
    category: 'Map',
    sprite: '/data/sprites/items/misc-map-vizjerei_prism.webp',
    aliases: ['prism', 'vizjerei', 'map'],
    offerAliases: ['prisms', 'vizjerei prisms']
  },
  {
    code: 'mws',
    name: 'Horadric Astrolabe',
    shortLabel: 'Astrolabe',
    category: 'Map',
    sprite: '/data/sprites/items/misc-map-horadric_astrolabe.webp',
    aliases: ['astrolabe', 'horadric astrolabe', 'map'],
    offerAliases: ['astrolabes', 'horadric astrolabes']
  },
  {
    code: 'mor',
    name: 'Horadric Sextant',
    shortLabel: 'Sextant',
    category: 'Map',
    sprite: '/data/sprites/items/misc-map-horadric_sextant.webp',
    aliases: ['sextant', 'horadric sextant', 'map'],
    offerAliases: ['sextants', 'horadric sextants']
  },
  ...MID_HIGH_RUNE_CURRENCIES,
  {
    code: 'keyset',
    name: '3x3 Keyset',
    shortLabel: '3x3 Keyset',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-key-destruction_key.webp',
    aliases: ['keyset', '3x3', 'uber keys'],
    offerAliases: ['keyset', '3x3', 'keysets', '3x3 keysets']
  },
  {
    code: 'pk1',
    name: 'Key of Terror',
    shortLabel: 'Terror Key',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-key-terror_key.webp',
    aliases: ['tkey', 'terror', 'terror key'],
    offerAliases: ['tkey', 'tkeys']
  },
  {
    code: 'pk2',
    name: 'Key of Hate',
    shortLabel: 'Hate Key',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-key-hate_key.webp',
    aliases: ['hkey', 'hate', 'hate key'],
    offerAliases: ['hkey', 'hkeys']
  },
  {
    code: 'pk3',
    name: 'Key of Destruction',
    shortLabel: 'Destruction Key',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-key-destruction_key.webp',
    aliases: ['dkey', 'destruction', 'destruction key'],
    offerAliases: ['dkey', 'dkeys']
  },
  {
    code: 'mpa',
    name: "Mephisto's Animus",
    shortLabel: "Mephisto's Animus",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-quest-mephisto_animus.webp',
    aliases: ['animus', 'mephisto']
  },
  {
    code: 'blc',
    name: "Baal's Calamity",
    shortLabel: "Baal's Calamity",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-quest-baal_calamity.webp',
    aliases: ['calamity', 'baal']
  },
  {
    code: 'dia',
    name: "Diablo's Ire",
    shortLabel: "Diablo's Ire",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-quest-diablo_ire.webp',
    aliases: ['diablo ire', 'diablo']
  },
  {
    code: 'lab',
    name: 'Forsaken Token',
    shortLabel: 'Forsaken Token',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-quest-forsaken_token.webp',
    aliases: ['forsaken', 'labyrinth']
  },
  {
    code: 'xa1',
    name: 'Western Worldstone Shard',
    shortLabel: 'West Shard',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-mote_of_anguish.webp',
    aliases: ['west shard', 'western shard', 'worldstone shard']
  },
  {
    code: 'xa2',
    name: 'Eastern Worldstone Shard',
    shortLabel: 'East Shard',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-mote_of_pain.webp',
    aliases: ['east shard', 'eastern shard', 'worldstone shard']
  },
  {
    code: 'xa3',
    name: 'Southern Worldstone Shard',
    shortLabel: 'South Shard',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-mote_of_hatred.webp',
    aliases: ['south shard', 'southern shard', 'worldstone shard']
  },
  {
    code: 'xa4',
    name: 'Deep Worldstone Shard',
    shortLabel: 'Deep Shard',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-mote_of_terror.webp',
    aliases: ['deep shard', 'worldstone shard']
  },
  {
    code: 'xa5',
    name: 'Northern Worldstone Shard',
    shortLabel: 'North Shard',
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-mote_of_destruction.webp',
    aliases: ['north shard', 'northern shard', 'worldstone shard']
  },
  {
    code: 'ua1',
    name: "Talic's Anguish",
    shortLabel: "Talic's Anguish",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-talics_anguish.webp',
    aliases: ['talic', 'ancients']
  },
  {
    code: 'ua2',
    name: "Korlic's Pain",
    shortLabel: "Korlic's Pain",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-korlics_pain.webp',
    aliases: ['korlic', 'ancients']
  },
  {
    code: 'ua3',
    name: "Madawc's Ire",
    shortLabel: "Madawc's Ire",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-madawcs_ire.webp',
    aliases: ['madawc', 'ancients']
  },
  {
    code: 'ua4',
    name: "Bul-Kathos' Nightmare",
    shortLabel: "Bul-Kathos' Nightmare",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-bulkathos_nightmare.webp',
    aliases: ['bul-kathos', 'bulkathos']
  },
  {
    code: 'ua5',
    name: "Worusk's End",
    shortLabel: "Worusk's End",
    category: 'Boss',
    sprite: '/data/sprites/items/misc-shard-worusks_end.webp',
    aliases: ['worusk']
  },
  ...LOW_RUNE_CURRENCIES
];

const CURRENCY_BY_CODE = new Map(TRADE_CURRENCIES.map((entry) => [entry.code.toLowerCase(), entry]));
const CURRENCY_BY_LABEL = new Map<string, TradeCurrencyDefinition>();
for (const entry of TRADE_CURRENCIES) {
  CURRENCY_BY_LABEL.set(entry.shortLabel.toLowerCase(), entry);
  CURRENCY_BY_LABEL.set(entry.name.toLowerCase(), entry);
}
for (const entry of TRADE_CURRENCIES) {
  for (const label of [entry.code, ...(entry.offerAliases ?? [])]) {
    const key = label.toLowerCase();
    if (!CURRENCY_BY_LABEL.has(key)) {
      CURRENCY_BY_LABEL.set(key, entry);
    }
  }
}

export const QUICK_PICK_CURRENCY_CODES = ['ka3', 'ooa', 'ooi', 'oos', '1gc', 'mrl', 'r24', 'r27', 'r30', 'r31', 'r34', 'r39', 'keyset'] as const;

export const QUICK_PICK_CURRENCIES: readonly TradeCurrencyDefinition[] = QUICK_PICK_CURRENCY_CODES
  .map((code) => CURRENCY_BY_CODE.get(code))
  .filter((entry): entry is TradeCurrencyDefinition => Boolean(entry));

export function getTradeCurrency(code: string | null | undefined): TradeCurrencyDefinition | null {
  if (!code) return null;
  return CURRENCY_BY_CODE.get(code.trim().toLowerCase()) ?? null;
}

export function searchTradeCurrencies(query: string): TradeCurrencyDefinition[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    const quick = new Set<string>(QUICK_PICK_CURRENCY_CODES);
    return [
      ...QUICK_PICK_CURRENCIES,
      ...TRADE_CURRENCIES.filter((entry) => !quick.has(entry.code))
    ];
  }

  const scored: { entry: TradeCurrencyDefinition; rank: number; index: number }[] = [];
  TRADE_CURRENCIES.forEach((entry, index) => {
    const shortLower = entry.shortLabel.toLowerCase();
    const nameLower = entry.name.toLowerCase();
    const codeLower = entry.code.toLowerCase();
    const aliases = entry.aliases ?? [];

    let rank = Number.POSITIVE_INFINITY;
    if (shortLower === needle) rank = 0;
    else if (aliases.some((alias) => alias === needle)) rank = 1;
    else if (codeLower === needle) rank = 2;
    else if (shortLower.startsWith(needle) || nameLower.startsWith(needle)) rank = 3;
    else if (aliases.some((alias) => alias.startsWith(needle))) rank = 4;
    else if (
      shortLower.includes(needle)
      || nameLower.includes(needle)
      || codeLower.includes(needle)
      || aliases.some((alias) => alias.includes(needle))
      || entry.category.toLowerCase().includes(needle)
    ) {
      rank = 5;
    }

    if (Number.isFinite(rank)) scored.push({ entry, rank, index });
  });

  scored.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return scored.map((item) => item.entry);
}

export function formatStructuredPriceText(
  items: readonly TradePriceItem[],
  combine: TradePriceCombine,
  note: string | null | undefined
): string | null {
  const trimmedNote = note?.trim() || null;
  if (items.length === 0) return trimmedNote;
  const separator = combine === 'And' ? ' + ' : ' or ';
  const formatted = items
    .map((item) => {
      const currency = getTradeCurrency(item.currencyCode);
      const label = currency?.shortLabel ?? item.currencyCode;
      return item.quantity > 1 ? `${item.quantity} ${label}` : label;
    })
    .join(separator);
  return trimmedNote ? `${formatted} (${trimmedNote})` : formatted;
}

export function formatOfferText(items: readonly TradePriceItem[], note: string | null | undefined): string {
  const trimmedNote = note?.trim() || '';
  const chips = items
    .map((item) => {
      const currency = getTradeCurrency(item.currencyCode);
      const label = currency?.shortLabel ?? item.currencyCode;
      return `${item.quantity} ${label}`;
    })
    .join(' + ');
  if (chips && trimmedNote) return `${chips} — ${trimmedNote}`;
  return chips || trimmedNote;
}

export interface ParsedOfferCurrencies {
  items: TradePriceItem[];
  note: string | null;
}

export function parseOfferCurrencyChips(offerText: string): ParsedOfferCurrencies {
  const trimmed = offerText.trim();
  if (!trimmed) return { items: [], note: null };

  const sepMatch = /\s+—\s+/.exec(trimmed);
  const chipPart = sepMatch ? trimmed.slice(0, sepMatch.index).trim() : trimmed;
  const notePart = sepMatch ? trimmed.slice(sepMatch.index + sepMatch[0].length).trim() || null : null;

  const segments = chipPart.split(/\s+\+\s+/);
  if (segments.length === 0 || segments.length > MAX_PRICE_ITEMS) {
    return { items: [], note: trimmed };
  }

  const parsed: TradePriceItem[] = [];
  const seen = new Set<string>();
  for (const segment of segments) {
    const match = /^(\d{1,3})\s+(.+)$/.exec(segment.trim());
    if (!match) return { items: [], note: trimmed };
    const quantity = Number.parseInt(match[1], 10);
    if (!Number.isFinite(quantity) || quantity < MIN_PRICE_QUANTITY || quantity > MAX_PRICE_QUANTITY) {
      return { items: [], note: trimmed };
    }
    const currency = CURRENCY_BY_LABEL.get(match[2].trim().toLowerCase());
    if (!currency || seen.has(currency.code)) {
      return { items: [], note: trimmed };
    }
    seen.add(currency.code);
    parsed.push({ currencyCode: currency.code, quantity });
  }

  return { items: parsed, note: notePart };
}
