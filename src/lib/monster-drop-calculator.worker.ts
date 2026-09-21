import { monsterDrops } from './monster-drop-calculator';
import type { DropData, DropSettings } from './drop-calculator';

self.onmessage = (event: MessageEvent<{ data: DropData; sourceId: string; settings: DropSettings; kills: number; seed: number; simulate: boolean }>) => {
  try {
    const { data, sourceId, settings, kills, seed, simulate } = event.data;
    const source = data.Sources.find(s => s.Id === sourceId);
    if (!source) throw new Error('Choose a monster from the list.');
    self.postMessage({ report: monsterDrops(data, source, settings, kills, seed, simulate) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Unable to calculate this monster.' });
  }
};
