import { calculateDrops, simulateKills, type DropData, type DropItem, type DropSettings } from './drop-calculator';

self.onmessage = (event: MessageEvent<{ data: DropData; target: DropItem; settings: DropSettings; kills: number }>) => {
  try {
    const results = calculateDrops(event.data.data, event.data.target, event.data.settings);
    for (const row of results) {
      if (row.chance !== null) row.simulation = simulateKills(row.chance, event.data.kills);
    }
    self.postMessage({ results });
  } catch {
    self.postMessage({ error: 'The drop data could not be calculated. Please try again.' });
  }
};
