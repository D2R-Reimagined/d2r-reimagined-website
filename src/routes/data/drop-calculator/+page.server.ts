import drops from '../../../../static/data/keyed/drop-calculator.json';
import type { DropData } from '#lib/drop-calculator.js';

export function load() {
  return { drops: drops as DropData };
}
