import { apiRequest } from '$lib/auth';

/** Mirrors the API's SaveReviewFlagKind, serialized by name. */
export type SaveReviewFlagKind =
  | 'Unknown'
  | 'UnwitnessedItem'
  | 'AreaBound'
  | 'UnexplainedChange'
  | 'TransferAccounting'
  | 'UnwitnessedPlay'
  | 'CrossAccountDuplicate'
  | 'JournalIntegrity'
  | 'RetainedDivestment'
  | 'UnsealedSessions'
  | 'JournalCoverage'
  | 'ProgressionViolation'
  | 'ItemLegality'
  | 'AffixRange'
  | 'GambleOdds'
  | 'GambleGold'
  | 'UnlockViolation'
  | 'UnwitnessedWaypoint'
  | 'DropOdds'
  | 'ExperienceRate'
  | 'KillExperience'
  | 'MovementSpeed';

export interface SaveReviewFlag {
  id: string;
  userId: string;
  userName: string | null;
  ladderId: string | null;
  kind: SaveReviewFlagKind;
  signature: string;
  summary: string;
  evidenceJson: string | null;
  fileName: string | null;
  sessionId: string | null;
  occurrences: number;
  firstSeenAtUtc: string;
  lastSeenAtUtc: string;
  resolvedAtUtc: string | null;
  resolvedByUserId: string | null;
  resolutionNote: string | null;
  refusedCount: number;
  lastRefusedAtUtc: string | null;
}

export interface CharacterSaveReview {
  characterId: string;
  characterName: string;
  userId: string;
  ladderId: string | null;
  fileName: string | null;
  isServerSave: boolean;
  characterFlags: SaveReviewFlag[];
  sharedStashFlags: SaveReviewFlag[];
  accountFlags: SaveReviewFlag[];
}

interface KindInfo {
  label: string;
  description: string;
}

const kinds: Record<SaveReviewFlagKind, KindInfo> = {
  Unknown: { label: 'Unknown', description: 'A finding of a kind this page does not recognise.' },
  UnwitnessedItem: {
    label: 'Unwitnessed item',
    description: 'An item appeared that no previous save held and the journal never saw arrive.'
  },
  AreaBound: {
    label: 'Area bound',
    description: 'An item was first seen somewhere that could not have produced it.'
  },
  UnexplainedChange: {
    label: 'Unexplained change',
    description: 'A fixed property of an existing item, such as its stack size or affixes, changed with nothing to explain it.'
  },
  TransferAccounting: {
    label: 'Transfer accounting',
    description: "An item arrived from another player while that account's journal still shows it owned."
  },
  UnwitnessedPlay: {
    label: 'Unwitnessed play',
    description: 'A save arrived without journal coverage, from an account that has journalled before or on a ladder that requires the journal.'
  },
  CrossAccountDuplicate: {
    label: 'Cross-account duplicate',
    description: "The same item is in two accounts' saves at once."
  },
  JournalIntegrity: {
    label: 'Journal integrity',
    description: 'A journal chunk failed its signature or hash chain. Evidence of tampering, not proof.'
  },
  RetainedDivestment: {
    label: 'Retained divestment',
    description: 'An item the journal watched leave the account is back in its save. The usual sign of an alt-F4 dupe.'
  },
  UnsealedSessions: {
    label: 'Unsealed sessions',
    description: 'Many journal sessions ended without the game closing normally. Crashes cause this too.'
  },
  JournalCoverage: {
    label: 'Journal coverage',
    description: 'Item review was skipped because telemetry was incomplete. Never evidence of cheating by itself.'
  },
  ProgressionViolation: {
    label: 'Progression',
    description: "Level, experience, or skill and stat points the character could not have earned from the server's copy."
  },
  ItemLegality: {
    label: 'Item legality',
    description: 'An item no game table can produce, such as an unknown code or a stack past its cap.'
  },
  AffixRange: {
    label: 'Affix range',
    description: 'An item rolled affix values outside what generation allows.'
  },
  GambleOdds: {
    label: 'Gamble odds',
    description: "More gambles came out set or unique than the gamble tables could plausibly produce. The sign of edited gamble odds."
  },
  GambleGold: {
    label: 'Gamble gold',
    description: "Items gambled since the last save cost more than the account's gold went down by, with nothing that could have paid the difference. The sign of edited gamble prices."
  },
  UnlockViolation: {
    label: 'Unlock',
    description: "A difficulty or waypoint is unlocked that the character's own quest log could not have unlocked."
  },
  UnwitnessedWaypoint: {
    label: 'Unwitnessed waypoint',
    description: 'Waypoints became active in levels the journal never saw the player enter. The sign of a waypoint-unlock script.'
  },
  DropOdds: {
    label: 'Drop odds',
    description: 'Far more of the items dropping around the account were set or unique than any drop table produces. The sign of an edited drop table.'
  },
  ExperienceRate: {
    label: 'Experience rate',
    description: 'A character gained more experience than its play time since the last save could produce. The sign of a monster experience multiplier.'
  },
  KillExperience: {
    label: 'Kill experience',
    description: 'A character gained more experience than every monster that died around it could have paid, priced at their most generous. The sign of a monster experience multiplier.'
  },
  MovementSpeed: {
    label: 'Movement speed',
    description: 'The player walked or ran faster than any honest setup allows, for longer than a tolerance. Teleport and skill movement are not measured. The sign of a speed script.'
  }
};

export function flagKindInfo(kind: SaveReviewFlagKind): KindInfo {
  return kinds[kind] ?? { label: kind, description: '' };
}

/** Pretty-prints a flag's evidence, or returns it untouched when it is not JSON. */
export function formatEvidence(evidenceJson: string | null): string {
  if (!evidenceJson) return '';
  try {
    return JSON.stringify(JSON.parse(evidenceJson), null, 2);
  } catch {
    return evidenceJson;
  }
}

/** Staff only: the API answers 403 for anyone without Admin or Moderator. */
export function getCharacterSaveReview(characterId: string, includeResolved = true): Promise<CharacterSaveReview> {
  const query = new URLSearchParams({ includeResolved: String(includeResolved) });
  return apiRequest<CharacterSaveReview>(
    `/admin/save-review/characters/${encodeURIComponent(characterId)}?${query}`,
    { cache: 'no-store' },
    true
  );
}

export function resolveSaveReviewFlag(id: string, note: string): Promise<SaveReviewFlag> {
  return apiRequest<SaveReviewFlag>(
    `/admin/save-review/${encodeURIComponent(id)}/resolve`,
    {
      method: 'POST',
      body: JSON.stringify({ note: note.trim() || null })
    },
    true
  );
}
