import { apiRequest } from '#lib/auth.js';
import type { LadderSummary } from '#lib/ladder-schedule.js';

export type {
  LadderAllowedExtension,
  LadderExtensionKind,
  LadderSummary
} from '#lib/ladder-schedule.js';
export { defaultLadder, isLadderRunning } from '#lib/ladder-schedule.js';

export function getLadders(): Promise<LadderSummary[]> {
  return apiRequest<LadderSummary[]>('/ladders/summaries', {}, 'optional');
}

export function getActiveLadders(): Promise<LadderSummary[]> {
  return apiRequest<LadderSummary[]>('/ladders/summaries?activeOnly=true', {}, 'optional');
}
