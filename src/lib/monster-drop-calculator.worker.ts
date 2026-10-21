import { monsterDrops, type MonsterDropOptions } from './monster-drop-calculator';
import type { DropData, DropSettings, DropSource } from './drop-calculator';

self.onmessage = (event: MessageEvent<{ data: DropData; source: DropSource; settings: DropSettings; kills: number; seed: number; simulate: boolean; options?: MonsterDropOptions }>) => {
  try {
    const { data, source, settings, kills, seed, simulate, options } = event.data;
    if (!source) throw new Error('Choose a monster or treasure class from the list.');
    self.postMessage({ report: monsterDrops(data, source, settings, kills, seed, simulate, options) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Unable to calculate this source.' });
  }
};
