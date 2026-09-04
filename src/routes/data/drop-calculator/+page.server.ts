import drops from '../../../../static/data/keyed/drop-calculator.json';
import type { DropData } from '$lib/drop-calculator';

export function load() {
  return { drops: drops as DropData };
}
