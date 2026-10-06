import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('$lib/auth', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '$lib/auth';
import { canAccessAdminPage, canManageServers } from './admin-access';
import { createServerConfiguration, updateServerConfiguration, getServerConfigurations, getServerRegions,
  createServerRegion, updateServerRegion, deleteServerRegion, serverConfigurationInput, serverRegionInput, serverLabel, serverDraft, MAX_GAMES_PER_SERVER, DEFAULT_MAX_GAMES, type ServerDraft, type ServerConfiguration } from './server-registry';

const draft = (): ServerDraft => ({ id: 'eu-1', name: '', ladderId: 'ladder-id', publicAddress: '203.0.113.7', enabled: true,
  maxGames: 32, regionIds: ['eu-west', 'na-east'], keySha256: '' });
beforeEach(() => vi.clearAllMocks());

describe('server administration access', () => {
  it('requires an explicit Admin role, including direct page navigation', () => {
    for (const roles of [[], ['Player'], ['Tester'], ['Moderator']]) {
      expect(canManageServers(roles)).toBe(false);
      expect(canAccessAdminPage(roles, '/admin/servers')).toBe(false);
    }
    expect(canManageServers()).toBe(false);
    expect(canManageServers(['Admin'])).toBe(true);
    expect(canManageServers(['Admin', 'Moderator'])).toBe(true);
    expect(canAccessAdminPage(['Admin'], '/admin/servers')).toBe(true);
  });
});

describe('server configuration requests', () => {
  it('omits a blank key hash on edits and copies multiple memberships without changing enabled state', async () => {
    const value = draft(); value.enabled = false;
    const input = serverConfigurationInput(value, false);
    expect(input).not.toHaveProperty('keySha256');
    expect(input.regionIds).toEqual(['eu-west', 'na-east']);
    expect(input.regionIds).not.toBe(value.regionIds);
    await updateServerConfiguration(input);
    expect(apiRequest).toHaveBeenCalledWith('/admin/servers/configuration/eu-1', {
      method: 'PUT', body: JSON.stringify({ id: 'eu-1', name: '', ladderId: 'ladder-id', publicAddress: '203.0.113.7', enabled: false, maxGames: 32, regionIds: ['eu-west', 'na-east'] })
    }, true);
  });
  it('requires a complete hash on creation and normalizes hex case without silently truncating input', async () => {
    expect(() => serverConfigurationInput(draft(), true)).toThrow('64-character');
    const value = draft(); value.keySha256 = 'a'.repeat(64);
    const input = serverConfigurationInput(value, true);
    expect(input.keySha256).toBe('A'.repeat(64));
    await createServerConfiguration(input);
    expect(apiRequest).toHaveBeenCalledWith('/admin/servers/configuration', { method: 'POST', body: JSON.stringify(input) }, true);
    for (const hash of ['a'.repeat(63), 'a'.repeat(65), 'g'.repeat(64), 'SHA256: ' + 'a'.repeat(64)]) {
      value.keySha256 = hash;
      expect(() => serverConfigurationInput(value, false)).toThrow('64-character');
    }
  });
  it('rejects invalid IDs, missing ladders and noncanonical IPv4 addresses before submission', () => {
    for (const id of ['../server', 'server/id', 'name:port', '-server', 'x'.repeat(65)]) {
      const value = draft(); value.id = id;
      expect(() => serverConfigurationInput(value, false)).toThrow('Server ID');
    }
    const value = draft(); value.ladderId = '';
    expect(() => serverConfigurationInput(value, false)).toThrow('ladder');
    for (const address of ['::1', 'server.example', '203.0.113.256', '203.00.113.7', '203.0.113', '203.0.113.']) {
      const value = draft(); value.publicAddress = address;
      expect(() => serverConfigurationInput(value, false)).toThrow('IPv4');
    }
  });
  it('trims display names, limits them to 64 printable characters and always sends them', () => {
    const value = draft(); value.name = '  NA East 1  ';
    expect(serverConfigurationInput(value, false).name).toBe('NA East 1');
    value.name = ' ' + 'x'.repeat(64) + ' ';
    expect(serverConfigurationInput(value, false).name).toBe('x'.repeat(64));
    value.name = '   ';
    expect(serverConfigurationInput(value, false)).toHaveProperty('name', '');
    for (const name of ['x'.repeat(65), 'NA\nEast']) {
      value.name = name;
      expect(() => serverConfigurationInput(value, false)).toThrow('Server name');
    }
  });
  it('requires max games to be a whole number from 1 to 128 and always sends it', () => {
    expect(MAX_GAMES_PER_SERVER).toBe(128);
    expect(DEFAULT_MAX_GAMES).toBe(32);
    for (const maxGames of [1, 8, 32, 33, 64, MAX_GAMES_PER_SERVER]) {
      const value = draft(); value.maxGames = maxGames;
      expect(serverConfigurationInput(value, false).maxGames).toBe(maxGames);
    }
    const created = draft(); created.keySha256 = 'a'.repeat(64);
    expect(serverConfigurationInput(created, true)).toHaveProperty('maxGames', 32);
    for (const maxGames of [0, -1, 129, 2.5, Number.NaN, null as unknown as number, '8' as unknown as number]) {
      const value = draft(); value.maxGames = maxGames;
      expect(() => serverConfigurationInput(value, false)).toThrow('Max games');
    }
  });
  it('labels servers by name with the id, falling back to the id', () => {
    expect(serverLabel({ id: 'vps2', name: 'NA East 1' })).toBe('NA East 1 (vps2)');
    for (const name of [undefined, null, '', '  ']) expect(serverLabel({ id: 'vps2', name })).toBe('vps2');
  });
  it('builds edit drafts from API records, defaulting missing names and limits', () => {
    const record = { id: 'vps2', name: null, ladderId: 'l', publicAddress: '203.0.113.7', enabled: true, regionIds: ['na-east'] } as unknown as ServerConfiguration;
    const value = serverDraft(record);
    expect(value).toMatchObject({ name: '', maxGames: 32, keySha256: '' });
    expect(value.regionIds).not.toBe(record.regionIds);
  });
  it('loads private records without caching and propagates cancellation', async () => {
    const signal = new AbortController().signal;
    await getServerConfigurations(signal); await getServerRegions(signal);
    expect(apiRequest).toHaveBeenCalledWith('/admin/servers/configuration', { cache: 'no-store', signal }, true);
    expect(apiRequest).toHaveBeenCalledWith('/admin/regions', { cache: 'no-store', signal }, true);
  });
});

describe('region management', () => {
  it('validates stable region codes and names', () => {
    expect(serverRegionInput({ id: ' eu-west ', name: ' Europe West ' })).toEqual({ id: 'eu-west', name: 'Europe West' });
    for (const id of ['', 'EU', 'eu west', 'eu/west', 'x'.repeat(33)])
      expect(() => serverRegionInput({ id, name: 'West' })).toThrow('Region code');
    for (const name of ['', ' ', 'x'.repeat(101), 'West\nEurope'])
      expect(() => serverRegionInput({ id: 'eu-west', name })).toThrow('region name');
  });
  it('authenticates creation, rename and deletion requests', async () => {
    const region = { id: 'eu-west', name: 'Europe West' };
    await createServerRegion(region); await updateServerRegion(region); await deleteServerRegion(region.id);
    expect(apiRequest).toHaveBeenCalledWith('/admin/regions', { method: 'POST', body: JSON.stringify(region) }, true);
    expect(apiRequest).toHaveBeenCalledWith('/admin/regions/eu-west', { method: 'PUT', body: JSON.stringify(region) }, true);
    expect(apiRequest).toHaveBeenCalledWith('/admin/regions/eu-west', { method: 'DELETE' }, true);
  });
});
