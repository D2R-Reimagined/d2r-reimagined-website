import { calculateDrops, type DropData, type DropItem, type DropSettings } from './drop-calculator';

self.onmessage = (event: MessageEvent<{ data: DropData; target: DropItem; settings: DropSettings }>) => {
  try {
    self.postMessage({ results: calculateDrops(event.data.data, event.data.target, event.data.settings) });
  } catch {
    self.postMessage({ error: 'The drop data could not be calculated. Please try again.' });
  }
};
