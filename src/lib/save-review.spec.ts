import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ api: vi.fn() }));
vi.mock('$lib/auth', () => ({ apiRequest: mocks.api }));

import { flagKindInfo, formatEvidence, getCharacterSaveReview, resolveSaveReviewFlag } from './save-review';

describe('character save review', () => {
  it('reads and resolves flags through authenticated staff routes', async () => {
    mocks.api.mockReset().mockResolvedValue(undefined);
    await getCharacterSaveReview('character/id');
    await resolveSaveReviewFlag('flag-id', '  checked the journal  ');
    await resolveSaveReviewFlag('flag-id', '   ');
    expect(mocks.api.mock.calls).toEqual([
      ['/admin/save-review/characters/character%2Fid?includeResolved=true', { cache: 'no-store' }, true],
      ['/admin/save-review/flag-id/resolve', { method: 'POST', body: '{"note":"checked the journal"}' }, true],
      ['/admin/save-review/flag-id/resolve', { method: 'POST', body: '{"note":null}' }, true]
    ]);
  });

  it('labels every kind, including ones added after this page', () => {
    expect(flagKindInfo('RetainedDivestment').label).toBe('Retained divestment');
    expect(flagKindInfo('AffixRange').label).toBe('Affix range');
    expect(flagKindInfo('SomethingNew' as never).label).toBe('SomethingNew');
  });

  it('pretty-prints JSON evidence and leaves anything else alone', () => {
    expect(formatEvidence('{"level":12}')).toBe('{\n  "level": 12\n}');
    expect(formatEvidence('not json')).toBe('not json');
    expect(formatEvidence(null)).toBe('');
  });
});
