import { apiRequest } from '$lib/auth';

export interface ServerRegion { id: string; name: string }
export interface ServerConfiguration {
  id: string; name?: string | null; ladderId: string; publicAddress: string; enabled: boolean; maxGames: number; regionIds: string[];
}
export interface ServerConfigurationInput extends Omit<ServerConfiguration, 'name'> { name: string; keySha256?: string }
export interface ServerDraft extends Omit<ServerConfiguration, 'name'> { name: string; keySha256: string }

/** Hard per-server cap enforced by the API (GameServerHeartbeatValidator.MaximumGamesPerServer). */
export const MAX_GAMES_PER_SERVER = 32;

/** Display label: "Name (id)" when a name is set, otherwise the id. */
export function serverLabel(server: { id: string; name?: string | null }): string {
  const name = server.name?.trim();
  return name ? `${name} (${server.id})` : server.id;
}
export function serverDraft(server: ServerConfiguration): ServerDraft {
  return { ...server, name: server.name ?? '', maxGames: server.maxGames ?? MAX_GAMES_PER_SERVER, regionIds: [...server.regionIds], keySha256: '' };
}

export const getServerConfigurations = (signal?: AbortSignal) =>
  apiRequest<ServerConfiguration[]>('/admin/servers/configuration', { cache: 'no-store', signal }, true);
export const getServerRegions = (signal?: AbortSignal) =>
  apiRequest<ServerRegion[]>('/admin/regions', { cache: 'no-store', signal }, true);
export const createServerConfiguration = (input: ServerConfigurationInput) =>
  apiRequest<ServerConfiguration>('/admin/servers/configuration', { method: 'POST', body: JSON.stringify(input) }, true);
export const updateServerConfiguration = (input: ServerConfigurationInput) =>
  apiRequest<ServerConfiguration>(`/admin/servers/configuration/${encodeURIComponent(input.id)}`,
    { method: 'PUT', body: JSON.stringify(input) }, true);
export const createServerRegion = (input: ServerRegion) =>
  apiRequest<ServerRegion>('/admin/regions', { method: 'POST', body: JSON.stringify(input) }, true);
export const updateServerRegion = (input: ServerRegion) =>
  apiRequest<ServerRegion>(`/admin/regions/${encodeURIComponent(input.id)}`, { method: 'PUT', body: JSON.stringify(input) }, true);
export const deleteServerRegion = (id: string) =>
  apiRequest<void>(`/admin/regions/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);

export function serverConfigurationInput(draft: ServerDraft, creating: boolean): ServerConfigurationInput {
  const id = draft.id.trim(), name = (draft.name ?? '').trim(), publicAddress = draft.publicAddress.trim(),
    keySha256 = draft.keySha256.trim().toUpperCase(), maxGames = draft.maxGames;
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(id))
    throw new Error('Server ID must start with a letter or digit and use up to 64 letters, digits, dots, underscores or hyphens.');
  if (name.length > 64 || /[\u0000-\u001f\u007f]/.test(name))
    throw new Error('Server name must use up to 64 printable characters.');
  if (!draft.ladderId) throw new Error('Choose a ladder.');
  const octets = publicAddress.split('.');
  if (octets.length !== 4 || octets.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255 || String(Number(part)) !== part))
    throw new Error('Enter a valid IPv4 address, such as 203.0.113.20.');
  if ((creating || keySha256) && !/^[A-F0-9]{64}$/.test(keySha256))
    throw new Error('Enter the complete 64-character SHA-256 hash of the server key.');
  if (typeof maxGames !== 'number' || !Number.isInteger(maxGames) || maxGames < 1 || maxGames > MAX_GAMES_PER_SERVER)
    throw new Error(`Max games must be a whole number from 1 to ${MAX_GAMES_PER_SERVER}.`);
  return { id, name, ladderId: draft.ladderId, publicAddress, enabled: draft.enabled, maxGames, regionIds: [...draft.regionIds],
    ...(keySha256 ? { keySha256 } : {}) };
}

export function serverRegionInput(draft: ServerRegion): ServerRegion {
  const id = draft.id.trim(), name = draft.name.trim();
  if (!/^[a-z0-9-]{1,32}$/.test(id)) throw new Error('Region code must use 1–32 lowercase letters, digits or hyphens.');
  if (!name || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name))
    throw new Error('Enter a region name using up to 100 printable characters.');
  return { id, name };
}
