// Ladder shapes and the date arithmetic over them. Kept free of `$lib` imports
// so it stays unit-testable; `$lib/ladders` adds the API calls on top.

export type LadderExtensionKind = 'Plugin' | 'Patch';

export interface LadderAllowedExtension {
  id: string;
  name: string;
  fileName: string;
  sha256: string;
  kind: LadderExtensionKind;
  isRequired: boolean;
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
  allowedExtensions: LadderAllowedExtension[];
}

/** Whether `now` falls inside the ladder's scheduled window. */
export function isLadderRunning(ladder: LadderSummary, now = new Date()): boolean {
  return new Date(ladder.startDateUtc) <= now && now < new Date(ladder.endDateUtc);
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
