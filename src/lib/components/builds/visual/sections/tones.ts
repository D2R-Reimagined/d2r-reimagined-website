import type { BuildBlock } from '#lib/builds.js';

export const calloutTones: { value: BuildBlock['tone']; label: string }[] = [
  { value: 'tip', label: 'Tip' }, { value: 'warning', label: 'Warning' },
  { value: 'pros', label: 'Strengths' }, { value: 'cons', label: 'Weaknesses' }
];
