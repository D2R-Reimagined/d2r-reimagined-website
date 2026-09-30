import { describe, expect, it } from 'vitest';
import { contentKey, fromRemote, isDirty, newDraft } from './library';
import type { FilterDetails } from './api';

describe('filter library drafts', () => {
  const details: FilterDetails = { id: 'server-id', name: 'Starter', ruleCount: 1, revision: 2, updatedAtUtc: '2026-09-29T12:00:00Z', lastUsedAtUtc: '2026-09-29T13:00:00Z', document: { version: 3, rules: [{ show: {} }] } };
  it('tracks account changes independently of selection and metadata', () => {
    const draft = fromRemote(details); expect(isDirty(draft)).toBe(false);
    draft.selected = -1; draft.lastUsedAt++; expect(isDirty(draft)).toBe(false);
    draft.document.rules.push({ hide: {} }); expect(isDirty(draft)).toBe(true);
    expect(details.document.rules).toHaveLength(1);
  });
  it('a duplicate has independent content and no association with its source account filter', () => {
    const source = fromRemote(details), copy = newDraft('Copy', source.document);
    expect(copy.remoteId).toBeUndefined(); expect(copy.revision).toBe(0); expect(isDirty(copy)).toBe(true);
    copy.document.rules[0].show!.ruleName = 'Changed'; expect(source.document.rules[0].show!.ruleName).toBeUndefined();
  });
  it('refresh keeps local identity but adopts the server revision and clamps selection', () => {
    const old = fromRemote(details); old.selected = 99;
    const fresh = fromRemote({ ...details, revision: 3 }, old);
    expect(fresh.id).toBe(old.id); expect(fresh.revision).toBe(3); expect(fresh.selected).toBe(0);
    expect(fresh.savedContent).toBe(contentKey(fresh.name, fresh.document));
  });
});
