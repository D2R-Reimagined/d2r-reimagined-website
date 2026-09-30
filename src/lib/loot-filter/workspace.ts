import type { Filter } from './types';
import { newDraft, type LocalLibrary } from './library';

const databaseName = 'reimagined-loot-filter-builder';
const storeName = 'workspace';
export interface Workspace { key: 'filter'; workspaceVersion: 1; filter: Filter; selected: number; savedAt: number }

async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Local workspace is open in another version of the site.'));
  });
}

export async function loadWorkspace(): Promise<Workspace | undefined> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(storeName, 'readonly').objectStore(storeName).get('filter');
      request.onsuccess = () => resolve(request.result?.workspaceVersion === 1 ? request.result : undefined);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

export async function saveWorkspace(filter: Filter, selected: number): Promise<void> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      transaction.objectStore(storeName).put({ key: 'filter', workspaceVersion: 1, filter, selected, savedAt: Date.now() });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

export async function loadLibrary(owner: string): Promise<LocalLibrary> {
  const key = `library:${owner}`;
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const request = transaction.objectStore(storeName).get(key);
      request.onsuccess = () => {
        if (request.result?.version === 1) { resolve(request.result); return; }
        if (owner !== 'guest') { resolve({ key, version: 1, entries: [], lastId: null }); return; }
        // Upgrade the previous single workspace without deleting the original backup.
        const legacy = transaction.objectStore(storeName).get('filter');
        legacy.onsuccess = () => {
          const saved = legacy.result;
          const draft = saved?.workspaceVersion === 1 && saved.filter?.rules?.length ? newDraft('My original filter', saved.filter) : null;
          if (draft) draft.selected = saved.selected ?? 0;
          resolve({ key, version: 1, entries: draft ? [draft] : [], lastId: draft?.id ?? null });
        };
        legacy.onerror = () => reject(legacy.error);
      };
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

export async function saveLibrary(library: LocalLibrary): Promise<void> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      transaction.objectStore(storeName).put(library);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
}
