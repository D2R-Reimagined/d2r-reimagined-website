import type { DropItem, DropQuality } from './drop-calculator';

const difficulties = ['normal', 'nightmare', 'hell'];
const kinds = ['all', 'normal', 'champion', 'unique', 'superunique', 'boss', 'quest'];
const params = ['item', 'type', 'difficulty', 'players', 'party', 'mf', 'monster', 'filter', 'zero'];
export interface DropUrlState {
  selected: DropItem | null;
  quality: DropQuality;
  difficulty: number;
  players: number;
  party: number;
  magicFind: number;
  kind: string;
  filter: string;
  showZero: boolean;
}

function integer(value: string | null, fallback: number, min: number, max: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

export function readDropUrl(url: URL, items: DropItem[]): DropUrlState {
  const p = url.searchParams;
  const selected = items.find(item => item.Id === p.get('item')) ?? null;
  const type = p.get('type');
  const players = integer(p.get('players'), 1, 1, 8);
  const difficulty = p.get('difficulty');
  return {
    selected,
    quality: selected?.Quality ?? (type === 'set' || type === 'rune' ? type : 'unique'),
    difficulty: difficulty === 'all' ? -1 : difficulties.includes(difficulty ?? '') ? difficulties.indexOf(difficulty!) : 2,
    players,
    party: integer(p.get('party'), 1, 1, players),
    magicFind: integer(p.get('mf'), 0, 0, 10000),
    kind: kinds.includes(p.get('monster') ?? '') ? p.get('monster')! : 'all',
    filter: p.get('filter') ?? '',
    showZero: p.get('zero') === '1'
  };
}

/** Keeps unrelated query parameters and fragments intact; omits default settings. */
export function writeDropUrl(current: URL, state: DropUrlState): URL {
  const url = new URL(current);
  for (const param of params) url.searchParams.delete(param);
  const p = url.searchParams;
  if (state.selected) p.set('item', state.selected.Id);
  else if (state.quality !== 'unique') p.set('type', state.quality);
  if (state.difficulty !== 2) p.set('difficulty', state.difficulty === -1 ? 'all' : difficulties[state.difficulty]);
  if (state.players !== 1) p.set('players', String(state.players));
  if (state.party !== 1) p.set('party', String(state.party));
  if (state.magicFind) p.set('mf', String(state.magicFind));
  if (state.kind !== 'all') p.set('monster', state.kind);
  if (state.filter) p.set('filter', state.filter);
  if (state.showZero) p.set('zero', '1');
  return url;
}
