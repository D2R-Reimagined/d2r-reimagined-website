import { apiRequest } from '$lib/auth';
import { validateCharacterSave } from '$lib/character-save';

export interface CharacterResponse {
  id: string;
  userId: string;
  ownerDisplayName: string;
  name: string;
  externalId: string | null;
  class: string;
  level: number;
  experience: number;
  isHardcore: boolean;
  ladderId: string | null;
  ladderName: string | null;
  isLadder: boolean;
  isExpansion: boolean;
  isDead: boolean;
  isPublic: boolean;
  ladderSeason: number | null;
  realm: string | null;
  title: string | null;
  lastPlayedAtUtc: string | null;
  lastTrackedAtUtc: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ParsedCharacterSave {
  character: {
    name: string;
    class: string;
    level: number;
  };
  file: {
    checksumValid: boolean;
  };
}

export interface SaveFlags {
  value: number;
  names: string[];
}

export interface SaveStat {
  id: number;
  name: string;
  layer: number;
  value: number;
}

export interface SaveItemPosition {
  modeId: number;
  mode: string;
  bodyLocationId: number;
  bodyLocation: string;
  inventoryX: number;
  inventoryY: number;
  storePageId: number;
  storePage: string;
  isOnGround: boolean;
}

export interface SaveQualityData {
  type: string;
  fileIndex: number | null;
  properties: Record<string, unknown>;
}

export interface SaveItem {
  flags: SaveFlags;
  version: number;
  position: SaveItemPosition;
  code: number;
  codeText: string;
  baseName: string | null;
  itemLevel: number;
  qualityId: number;
  quality: string;
  qualityData: SaveQualityData | null;
  runewordId: number | null;
  personalizedName: string;
  defense: number | null;
  maximumDurability: number | null;
  durability: number | null;
  quantity: number | null;
  setItemMask: number | null;
  stats: SaveStat[];
  setBonusStats: SaveStat[][];
  runewordStats: SaveStat[] | null;
  sockets: Array<SaveItem | null>;
  advancedStashStackSize: number | null;
  [key: string]: unknown;
}

export interface CharacterSaveDetails {
  profile: string;
  fileName: string;
  file: {
    version: number;
    checksumValid: boolean;
  };
  character: {
    name: string;
    class: string;
    level: number;
    weaponSwitch: number;
    flags: SaveFlags;
    mercenary: { hasMercenary: boolean; isDead: boolean; experience: number };
  };
  stats: { entries: SaveStat[] };
  skills: { entries: Array<{ id: number; name: string; points: number }> };
  items: { entries: SaveItem[] };
  mercenaryItems: { entries: SaveItem[] } | null;
  quests: unknown;
  waypoints: unknown;
  playerIntro: unknown;
  corpses: unknown;
  ironGolem: SaveItem | null;
  demon: unknown;
}

export interface CharacterDetailsResponse {
  character: CharacterResponse;
  save: CharacterSaveDetails | null;
}

export interface CharacterSkillAllocation {
  skillId: number;
  points: number;
}

export interface CharacterDirectoryEntry {
  character: CharacterResponse;
  skills: CharacterSkillAllocation[];
}

export interface CharacterDirectoryResponse {
  items: CharacterDirectoryEntry[];
  total: number;
  skip: number;
  count: number;
}

export interface CharacterDirectoryRequest {
  skip?: number;
  count?: number;
  characterClass?: string;
}

function saveForm(file: File, isPublic?: boolean): FormData {
  validateCharacterSave(file);
  const form = new FormData();
  form.set('file', file, file.name);
  if (isPublic !== undefined) form.set('isPublic', String(isPublic));
  return form;
}

export function getMyCharacters(): Promise<CharacterResponse[]> {
  return apiRequest<CharacterResponse[]>('/characters/mine', {}, true);
}

export function getCharacterDirectory(
  request: CharacterDirectoryRequest = {}
): Promise<CharacterDirectoryResponse> {
  const parameters = new URLSearchParams();
  parameters.set('skip', String(request.skip ?? 0));
  parameters.set('count', String(request.count ?? 24));
  if (request.characterClass) parameters.set('class', request.characterClass);
  return apiRequest<CharacterDirectoryResponse>(`/characters?${parameters}`);
}

export function getCharacterDetails(id: string): Promise<CharacterDetailsResponse> {
  return apiRequest<CharacterDetailsResponse>(
    `/characters/${encodeURIComponent(id)}/details`,
    {},
    'optional'
  );
}

export function parseCharacterSave(file: File): Promise<ParsedCharacterSave> {
  return apiRequest<ParsedCharacterSave>('/characters/parse', {
    method: 'POST',
    body: saveForm(file)
  });
}

export function createCharacter(file: File, isPublic: boolean): Promise<CharacterResponse> {
  return apiRequest<CharacterResponse>(
    '/characters',
    {
      method: 'POST',
      body: saveForm(file, isPublic)
    },
    true
  );
}

export function updateCharacter(
  id: string,
  file: File,
  isPublic?: boolean
): Promise<CharacterResponse> {
  return apiRequest<CharacterResponse>(
    `/characters/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: saveForm(file, isPublic)
    },
    true
  );
}

export function deleteCharacter(id: string): Promise<void> {
  return apiRequest<void>(
    `/characters/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    true
  );
}
