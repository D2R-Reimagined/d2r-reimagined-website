export type MonsterDropSourceType = 'monster' | 'tc';
export interface MonsterDropState {
  sourceType: MonsterDropSourceType; sourceId: string; treasureClass: string; level: number;
  difficulty: number; kills: number; players: number; party: number; magicFind: number; seed: number; collapse: boolean; leaves: boolean;
}
const fields = ['sourceType', 'sourceId', 'treasureClass', 'level', 'difficulty', 'kills', 'players', 'party', 'magicFind', 'seed', 'collapse', 'leaves'] as const;
export function readMonsterDropUrl(url: URL): MonsterDropState {
  const p = url.searchParams;
  const number = (field: string, fallback: number, min: number, max: number) => {
    const value = p.get(`sim_${field}`);
    return value && /^\d+$/.test(value) && Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
  };
  const players = number('players', 1, 1, 8);
  return { sourceType: p.get('sim_sourceType') === 'tc' ? 'tc' : 'monster', sourceId: p.get('sim_sourceId') ?? '',
    treasureClass: p.get('sim_treasureClass') ?? '', level: number('level', 85, 1, 120), difficulty: number('difficulty', 2, 0, 2),
    kills: number('kills', 100, 1, 100000), players, party: number('party', 1, 1, players), magicFind: number('magicFind', 0, 0, 10000),
    seed: number('seed', 1, 0, 4294967295), collapse: p.get('sim_collapse') === '1', leaves: p.get('sim_leaves') === '1' };
}
export function writeMonsterDropUrl(current: URL, state: MonsterDropState): URL {
  const url = new URL(current);
  const defaults = readMonsterDropUrl(new URL('https://example.test'));
  for (const field of fields) {
    url.searchParams.delete(`sim_${field}`);
    if (state[field] !== defaults[field]) url.searchParams.set(`sim_${field}`, typeof state[field] === 'boolean' ? '1' : String(state[field]));
  }
  return url;
}
/** Settings shown in the simulator's collapsible advanced section. */
export const advancedMonsterDropSettings = ['seed'] as const;
// Defaults come from the parser itself so the indicator always agrees with what an empty URL means.
const defaults = readMonsterDropUrl(new URL('https://defaults.invalid/'));
/** Counts advanced settings that differ from the defaults an empty URL would produce. */
export function countAdvancedMonsterDropSettings(state: Pick<MonsterDropState, (typeof advancedMonsterDropSettings)[number]>) {
  return advancedMonsterDropSettings.filter(key => state[key] !== defaults[key]).length;
}
