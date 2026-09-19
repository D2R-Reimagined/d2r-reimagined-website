import { apiRequest } from '$lib/auth';
import type { LadderSummary } from '$lib/ladder-schedule';

export type {
  LadderAllowedExtension,
  LadderExtensionKind,
  LadderSummary
} from '$lib/ladder-schedule';
export { defaultLadder, isLadderRunning } from '$lib/ladder-schedule';

export function getLadders(): Promise<LadderSummary[]> {
  return apiRequest<LadderSummary[]>('/ladders/summaries', {}, 'optional');
}

export function getActiveLadders(): Promise<LadderSummary[]> {
  return apiRequest<LadderSummary[]>('/ladders/summaries?activeOnly=true', {}, 'optional');
}
