export interface MonsterDropState { sourceId: string; difficulty: number; kills: number; players: number; party: number; magicFind: number; seed: number }
const fields = ['sourceId', 'difficulty', 'kills', 'players', 'party', 'magicFind', 'seed'] as const;
export function readMonsterDropUrl(url: URL): MonsterDropState {
  const p = url.searchParams;
  const number = (field: string, fallback: number, min: number, max: number) => {
    const value = p.get(`sim_${field}`);
    return value && /^\d+$/.test(value) && Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
  };
  const players = number('players', 1, 1, 8);
  return { sourceId: p.get('sim_sourceId') ?? '', difficulty: number('difficulty', 2, 0, 2), kills: number('kills', 100, 1, 100000), players,
    party: number('party', 1, 1, players), magicFind: number('magicFind', 0, 0, 10000), seed: number('seed', 1, 0, 4294967295) };
}
export function writeMonsterDropUrl(current: URL, state: MonsterDropState): URL {
  const url = new URL(current);
  const defaults = readMonsterDropUrl(new URL('https://example.test'));
  for (const field of fields) {
    url.searchParams.delete(`sim_${field}`);
    if (state[field] !== defaults[field]) url.searchParams.set(`sim_${field}`, String(state[field]));
  }
  return url;
}
