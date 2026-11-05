import { describe, expect, it, vi } from 'vitest';
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn() }));
import { portalAccessRows, supporterGap, type SupporterPack, type UserPortalAccess, type UserPurchase } from './admin-user';

function access(overrides: Partial<UserPortalAccess>, unlocked: string[]): UserPortalAccess {
  const ids = ['classic', 'green', 'gold', 'rainbow', 'ember'];
  return {
    portalIds: [],
    packIds: [],
    purchasedPackIds: [],
    supporterTier: null,
    effective: {
      selectedPortalId: 'classic',
      portals: ids.map((id) => ({ id, name: id, unlocked: unlocked.includes(id) }))
    },
    ...overrides
  };
}

function pack(id: string, portalIds: string[], isActive = true): SupporterPack {
  return { id, name: `Pack ${id}`, isActive, portalIds };
}

function purchase(productName: string, grantingReward: boolean): UserPurchase {
  return {
    id: productName, kind: 'subscription', status: 'active', productName, amount: 10, currency: 'usd',
    purchasedAtUtc: '2026-11-01T00:00:00Z', currentPeriodEndUtc: null, cancelAtPeriodEnd: false, grantingReward, reward: null
  };
}

const row = (rows: ReturnType<typeof portalAccessRows>, id: string) => rows.find((entry) => entry.id === id);

describe('portalAccessRows', () => {
  it('leaves locked portals without a source', () => {
    const rows = portalAccessRows(access({}, ['classic']), []);
    expect(row(rows, 'gold')).toEqual({ id: 'gold', name: 'gold', unlocked: false, sources: [] });
    expect(row(rows, 'classic')?.sources).toEqual(['Free for everyone']);
  });

  it('credits the supporter tier only when nothing else explains the unlock', () => {
    const rows = portalAccessRows(access({ supporterTier: 'insane-supporter', portalIds: ['ember'] }, ['classic', 'gold', 'ember']), []);
    expect(row(rows, 'gold')?.sources).toEqual(['Supporter tier: INSANE Supporter']);
    expect(row(rows, 'ember')?.sources).toEqual(['Individual reward']);
  });

  it('names assigned and purchased packs, ignoring inactive ones', () => {
    const packs = [pack('a', ['green']), pack('b', ['green']), pack('c', ['green'], false)];
    const rows = portalAccessRows(access({ packIds: ['a', 'c'], purchasedPackIds: ['b'] }, ['classic', 'green']), packs);
    expect(row(rows, 'green')?.sources).toEqual(['Pack: Pack a', 'Purchased pack: Pack b']);
  });

  it('falls back to server configuration for an unexplained unlock without a tier', () => {
    const rows = portalAccessRows(access({}, ['classic', 'rainbow']), []);
    expect(row(rows, 'rainbow')?.sources).toEqual(['Server configuration']);
  });
});

describe('supporterGap', () => {
  it('stays quiet without an active purchase, or when the tier is there', () => {
    expect(supporterGap({ discordId: null, discordSupporterTier: null }, [purchase('Pro', false)])).toBeNull();
    expect(supporterGap({ discordId: '1', discordSupporterTier: 'insane-supporter' }, [purchase('INSANE', true)])).toBeNull();
  });

  it('flags a buyer with no Discord link', () => {
    expect(supporterGap({ discordId: null, discordSupporterTier: null }, [purchase('INSANE', true)]))
      .toContain('no linked Discord account');
  });

  it('flags a linked buyer whose tier is empty', () => {
    expect(supporterGap({ discordId: '1', discordSupporterTier: null }, [purchase('INSANE', true), purchase('INSANE', true)]))
      .toContain('(INSANE) but no supporter tier');
  });
});
