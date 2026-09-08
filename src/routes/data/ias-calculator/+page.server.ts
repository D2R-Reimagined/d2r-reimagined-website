import dataset from '../../../../static/data/keyed/ias-calculator.json';
import type { IasData } from '$lib/ias-calculator';

export function load() {
  return { ias: dataset as IasData };
}
