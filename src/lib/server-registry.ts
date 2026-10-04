import { apiRequest } from '$lib/auth';

export interface ServerRegion { id: string; name: string }
export interface ServerConfiguration {
  id: string; ladderId: string; publicAddress: string; enabled: boolean; regionIds: string[];
}
export interface ServerConfigurationInput extends ServerConfiguration { keySha256?: string }
export interface ServerDraft extends ServerConfiguration { keySha256: string }

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
  const id = draft.id.trim(), publicAddress = draft.publicAddress.trim(), keySha256 = draft.keySha256.trim().toUpperCase();
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(id))
    throw new Error('Server ID must start with a letter or digit and use up to 64 letters, digits, dots, underscores or hyphens.');
  if (!draft.ladderId) throw new Error('Choose a ladder.');
  const octets = publicAddress.split('.');
  if (octets.length !== 4 || octets.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255 || String(Number(part)) !== part))
    throw new Error('Enter a valid IPv4 address, such as 203.0.113.20.');
  if ((creating || keySha256) && !/^[A-F0-9]{64}$/.test(keySha256))
    throw new Error('Enter the complete 64-character SHA-256 hash of the server key.');
  return { id, ladderId: draft.ladderId, publicAddress, enabled: draft.enabled, regionIds: [...draft.regionIds],
    ...(keySha256 ? { keySha256 } : {}) };
}

export function serverRegionInput(draft: ServerRegion): ServerRegion {
  const id = draft.id.trim(), name = draft.name.trim();
  if (!/^[a-z0-9-]{1,32}$/.test(id)) throw new Error('Region code must use 1–32 lowercase letters, digits or hyphens.');
  if (!name || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name))
    throw new Error('Enter a region name using up to 100 printable characters.');
  return { id, name };
}
