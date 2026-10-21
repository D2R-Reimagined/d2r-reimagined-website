// Every case works on a synthetic build directory in a throwaway temp directory, never on build/.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { verifyBuild, versionHash } from './verify-build.mjs';

let root: string;

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'verify-build-'));
});

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

async function write(files: Record<string, string>) {
  for (const [rel, content] of Object.entries(files)) {
    await fs.mkdir(path.dirname(path.join(root, rel)), { recursive: true });
    await fs.writeFile(path.join(root, rel), content);
  }
}

/** The shape adapter-node produces: a server options chunk and minified client chunks. */
function build(version: string, serverHash = versionHash(version), clientHash = versionHash(version)) {
  return write({
    'client/_app/version.json': JSON.stringify({ version }),
    'client/_app/immutable/chunks/Ab12Cd.js': `var b=globalThis.__sveltekit_${clientHash}?.base??\`\`;if(globalThis.__sveltekit_${clientHash}.data){}`,
    'client/_app/immutable/chunks/Ef34Gh.js': `var t=globalThis.__sveltekit_${clientHash}.env;`,
    'server/chunks/internal.js': `const options = {\n\troot,\n\tversion_hash: "${serverHash}"\n};`,
    'server/chunks/index.js': 'return new Response(`globalThis.__sveltekit_sw={env:${payload}}`);'
  });
}

describe('versionHash', () => {
  it("matches SvelteKit's hash for the identifiers seen in the failed build", () => {
    expect(versionHash('1791700513755')).toBe('1ncedmk');
    expect(versionHash('1791700514735')).toBe('te44wt');
  });
});

describe('verifyBuild', () => {
  it('accepts a build whose version, server and client agree', async () => {
    const sha = 'e7118b4b1560e01435647535c00a38a3e6da17a7';
    await build(sha);
    const result = await verifyBuild(root);
    expect(result.problems).toEqual([]);
    expect(result).toMatchObject({ version: sha, expected: versionHash(sha), server: [versionHash(sha)], client: [versionHash(sha)] });
  });

  it('rejects a server bundle generated with another process version', async () => {
    await build('1791700514735', versionHash('1791700513755'));
    const { problems } = await verifyBuild(root);
    expect(problems).toContain('server HTML would define __sveltekit_1ncedmk but the client reads __sveltekit_te44wt');
  });

  it('rejects a client bundle that does not match the build version', async () => {
    await build('1791700513755', undefined, 'te44wt');
    const { problems } = await verifyBuild(root);
    expect(problems.some((p) => p.includes('client global __sveltekit_te44wt does not match'))).toBe(true);
  });

  it('rejects client chunks that reference more than one global', async () => {
    await build('v1');
    await write({ 'client/_app/immutable/chunks/Stale.js': 'globalThis.__sveltekit_stale1.data' });
    const { problems } = await verifyBuild(root);
    expect(problems.some((p) => p.startsWith('the client bundle references several globals'))).toBe(true);
  });

  it('rejects output where the identifiers cannot be found', async () => {
    await write({ 'client/_app/version.json': '{"version":"v1"}', 'client/_app/a.js': '', 'server/index.js': '' });
    const { problems } = await verifyBuild(root);
    expect(problems).toEqual([
      'expected one version_hash in the server bundle, found none',
      'the client bundle references no __sveltekit_<hash> global'
    ]);
  });

  it('rejects a missing build', async () => {
    const { problems } = await verifyBuild(path.join(root, 'missing'));
    expect(problems).toHaveLength(2);
  });
});
