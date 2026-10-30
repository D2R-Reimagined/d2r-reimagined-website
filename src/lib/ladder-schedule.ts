// Ladder shapes and the date arithmetic over them. Kept free of `#lib` imports
// so it stays unit-testable; `#lib/ladders.js` adds the API calls on top.

export type LadderExtensionKind = 'Plugin' | 'Patch';

export interface LadderAllowedExtension {
  id: string;
  name: string;
  fileName: string;
  sha256: string;
  kind: LadderExtensionKind;
  isRequired: boolean;
  sizeBytes?: number | null;
  downloadPath?: string | null;
}

/**
 * A ladder as anyone can see it. Deliberately narrower than the admin `Ladder`,
 * which drags the whole bundle/plugin-release surface along with it - the
 * leaderboard needs a name and a date range and nothing else.
 */
export interface LadderSummary {
  id: string;
  name: string;
  startDateUtc: string;
  endDateUtc: string;
  archivedAtUtc?: string | null;
  isHidden?: boolean;
}

/** Whether `now` falls inside the ladder's scheduled window. */
export function isLadderRunning(ladder: LadderSummary, now = new Date()): boolean {
  return new Date(ladder.startDateUtc) <= now && now < new Date(ladder.endDateUtc);
}

/** Archived, or past its scheduled end. */
export function isPastLadder(ladder: LadderSummary, now = new Date()): boolean {
  return !!ladder.archivedAtUtc || new Date(ladder.endDateUtc) <= now;
}

/**
 * Splits ladders into the ones worth a tab of their own (running or scheduled)
 * and past ones, newest first, so the list of tabs does not grow every season.
 */
export function partitionLadders(
  ladders: LadderSummary[],
  now = new Date()
): { current: LadderSummary[]; past: LadderSummary[] } {
  const current = ladders.filter((ladder) => !isPastLadder(ladder, now));
  const past = ladders
    .filter((ladder) => isPastLadder(ladder, now))
    .sort((a, b) => new Date(b.endDateUtc).getTime() - new Date(a.endDateUtc).getTime());
  return { current, past };
}

/**
 * Whether admins can launch the ladder before it starts (the API's admin
 * preview): scheduled, not archived and not over. Nothing played in a preview
 * is saved.
 */
export function isAdminPreviewOpen(ladder: LadderSummary, now = new Date()): boolean {
  return !ladder.archivedAtUtc && now < new Date(ladder.startDateUtc) && now < new Date(ladder.endDateUtc);
}

/**
 * The ladder a visitor most likely wants to see first: the running one, or the
 * one that ran most recently if none is running.
 *
 * A scheduled ladder is never chosen - it has no standings yet, and landing on
 * an empty board reads as "nobody has played" rather than "this has not started".
 */
export function defaultLadder(
  ladders: LadderSummary[],
  now = new Date()
): LadderSummary | null {
  const running = ladders.filter((ladder) => isLadderRunning(ladder, now));
  if (running.length > 0) {
    return running.reduce((latest, ladder) =>
      new Date(ladder.startDateUtc) > new Date(latest.startDateUtc) ? ladder : latest
    );
  }

  const finished = ladders.filter((ladder) => new Date(ladder.endDateUtc) <= now);
  if (finished.length === 0) return null;

  return finished.reduce((latest, ladder) =>
    new Date(ladder.endDateUtc) > new Date(latest.endDateUtc) ? ladder : latest
  );
}
