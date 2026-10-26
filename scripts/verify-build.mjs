// Fails a production build whose server and client bundles disagree on SvelteKit's bootstrap
// global. Server-rendered HTML assigns `globalThis.__sveltekit_<hash>`, and a client bundle that
// reads the global must use the same name; when they differ every page renders but the client
// never starts ("Cannot read properties of undefined (reading 'data')"). That happens when another
// process (e.g. `svelte-kit sync` from `pnpm run check`) rewrites .svelte-kit/generated during a
// build with a version of its own.
//
// SvelteKit 2 compiled the hash into the server as `version_hash` and every client chunk read the
// global. SvelteKit 3 compiles the full `__sveltekit_<hash>` name into the server instead, and
// split client bundles receive the payload from the start script, so they may not reference it.
//
// Usage:
//   node scripts/verify-build.mjs [build-directory]    defaults to the adapter-node output, build/
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_BUILD = fileURLToPath(new URL('../build', import.meta.url));
/** SvelteKit 2's server option; SvelteKit 3 servers carry the global name itself (CLIENT_GLOBAL). */
const SERVER_HASH = /\bversion_hash:\s*(["'])([0-9a-z]+)\1/g;
const CLIENT_GLOBAL = /\b__sveltekit_([0-9a-z]+)\b/g;
/** Fixed global names SvelteKit uses for dev mode, service workers and env, never a version hash. */
const RESERVED = new Set(['dev', 'sw', 'env']);

/** SvelteKit's djb2 hash of `kit.version.name`, as used for `__sveltekit_<hash>`. */
export function versionHash(/** @type {string} */ name) {
  let hash = 5381;
  let i = name.length;
  while (i) hash = (hash * 33) ^ name.charCodeAt(--i);
  return (hash >>> 0).toString(36);
}

async function scripts(/** @type {string} */ dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && /\.m?js$/.test(entry.name)) files.push(path.join(entry.parentPath, entry.name));
  }
  return files.sort();
}

/** Every distinct capture of `pattern` group `group` across the JavaScript files below `dir`. */
async function collect(/** @type {string} */ dir, /** @type {RegExp} */ pattern, /** @type {number} */ group) {
  /** @type {Map<string, string[]>} */
  const found = new Map();
  for (const file of await scripts(dir)) {
    const source = await fs.readFile(file, 'utf8');
    for (const match of source.matchAll(pattern)) {
      const value = match[group];
      if (RESERVED.has(value)) continue;
      const files = found.get(value) ?? [];
      if (!files.includes(file)) files.push(file);
      found.set(value, files);
    }
  }
  return found;
}

/** `<appDir>/version.json` in the client output; the app directory is configurable, so find it. */
async function readVersion(/** @type {string} */ client) {
  for (const entry of await fs.readdir(client, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(client, entry.name, 'version.json');
    const raw = await fs.readFile(file, 'utf8').catch(() => null);
    if (raw === null) continue;
    const { version } = JSON.parse(raw);
    if (typeof version === 'string' && version) return version;
  }
  return null;
}

/**
 * Compares the build version, the server bundle's `version_hash` and the client bundle's
 * `__sveltekit_<hash>` references. `problems` is empty when all three agree.
 */
export async function verifyBuild(/** @type {string} */ dir = DEFAULT_BUILD) {
  const client = path.join(dir, 'client');
  const server = path.join(dir, 'server');
  /** @type {string[]} */
  const problems = [];
  for (const required of [client, server]) {
    if (!(await fs.stat(required).catch(() => null))?.isDirectory()) problems.push(`${required} does not exist`);
  }
  if (problems.length) return { version: null, expected: null, server: [], client: [], problems };

  const version = await readVersion(client);
  const expected = version === null ? null : versionHash(version);
  const serverHashes = await collect(server, SERVER_HASH, 2);
  if (serverHashes.size === 0) for (const [hash, files] of await collect(server, CLIENT_GLOBAL, 1)) serverHashes.set(hash, files);
  const clientHashes = await collect(client, CLIENT_GLOBAL, 1);
  const describe = (/** @type {Map<string, string[]>} */ found) =>
    [...found].map(([hash, files]) => `${hash} (${files.map((f) => path.relative(dir, f)).join(', ')})`).join('; ');

  if (version === null) problems.push(`no <appDir>/version.json with a version was found in ${client}`);
  if (serverHashes.size !== 1) {
    problems.push(`expected one version hash in the server bundle, found ${serverHashes.size ? describe(serverHashes) : 'none'}`);
  }
  if (clientHashes.size > 1) problems.push(`the client bundle references several globals: ${describe(clientHashes)}`);

  const serverHash = serverHashes.size === 1 ? [...serverHashes.keys()][0] : null;
  const clientHash = clientHashes.size === 1 ? [...clientHashes.keys()][0] : null;
  if (serverHash && clientHash && serverHash !== clientHash) {
    problems.push(`server HTML would define __sveltekit_${serverHash} but the client reads __sveltekit_${clientHash}`);
  }
  if (expected) {
    if (serverHash && serverHash !== expected) problems.push(`server version_hash ${serverHash} does not match version ${version} (${expected})`);
    if (clientHash && clientHash !== expected) problems.push(`client global __sveltekit_${clientHash} does not match version ${version} (${expected})`);
  }
  return { version, expected, server: [...serverHashes.keys()], client: [...clientHashes.keys()], problems };
}

async function main() {
  const dir = path.resolve(process.argv[2] ?? DEFAULT_BUILD);
  const result = await verifyBuild(dir);
  if (result.problems.length) {
    console.error(`Build verification failed for ${dir}:\n  - ${result.problems.join('\n  - ')}`);
    console.error('Rebuild without running `svelte-kit sync`, `pnpm run check` or another build at the same time.');
    return 1;
  }
  console.log(`Build verified: version ${result.version}, bootstrap global __sveltekit_${result.expected}.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
