import dataset from '../../../../static/data/keyed/ias-calculator.json';
import type { IasData } from '#lib/ias-calculator.js';

export function load() {
  return { ias: dataset as IasData };
}
