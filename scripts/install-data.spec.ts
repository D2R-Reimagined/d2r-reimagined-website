// Every case works on synthetic bundles in a throwaway temp directory, never on static/data.
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { installBundle, pathProblem, validateBundle } from './install-data.mjs';

type Payload = Record<string, string>;
type Manifest = Record<string, any>;

let root: string;
let site: string;
let destination: string;

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'install-data-'));
  site = path.join(root, 'site');
  destination = path.join(site, 'data');
  await fs.mkdir(site);
});

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

function manifestFor(files: Payload): Manifest {
  const paths = Object.keys(files).sort();
  return {
    SchemaVersion: 2,
    Succeeded: true,
    Complete: true,
    AbandonedTempFilesRemoved: 0,
    Steps: [{ Producer: 'test', Status: 'Written', Outputs: paths }],
    Files: paths.map((p) => ({ Path: p, Bytes: Buffer.byteLength(files[p]), Sha256: sha256(files[p]), Producer: 'test' }))
  };
}

/** Writes payload files plus a manifest; the CRLF/4-space layout checks the manifest is copied byte for byte. */
async function bundle(name: string, files: Payload, edit: (m: Manifest) => void = () => {}, extra: Payload = {}) {
  const dir = path.join(root, name);
  await fs.mkdir(dir, { recursive: true });
  for (const [rel, content] of Object.entries({ ...files, ...extra })) {
    await fs.mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
    await fs.writeFile(path.join(dir, rel), content);
  }
  const manifest = manifestFor(files);
  edit(manifest);
  await fs.writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 4).replace(/\n/g, '\r\n') + '\r\n');
  return dir;
}

/** Relative path -> content hash of every file below `dir` (empty object when absent). */
async function snapshot(dir: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const walk = async (rel: string) => {
    for (const entry of await fs.readdir(path.join(dir, rel), { withFileTypes: true })) {
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(child);
      else out[child] = sha256(await fs.readFile(path.join(dir, child)));
    }
  };
  if (await fs.stat(dir).catch(() => null)) await walk('');
  return out;
}

const v1: Payload = {
  'keyed/uniques.json': '[{"Name":"Old"}]',
  'sprites/items/old.webp': 'old-sprite',
  'strings/enUS.json': '{"a":"A"}'
};
const v2: Payload = {
  'keyed/uniques.json': '[{"Name":"New"}]',
  'sprites/items/new.webp': 'new-sprite',
  'strings/enUS.json': '{"a":"A"}'
};

async function installV1() {
  await installBundle({ from: await bundle('v1', v1), to: destination });
  return snapshot(destination);
}

describe('installBundle', () => {
  it('installs a valid bundle with an exact copy of its manifest', async () => {
    const from = await bundle('v1', v1);
    const result = await installBundle({ from, to: destination });
    expect(result.status).toBe('installed');
    expect(result.plan.added).toEqual(Object.keys(v1).sort());
    expect(await snapshot(destination)).toEqual(await snapshot(from));
    expect(await fs.readFile(path.join(destination, 'manifest.json'))).toEqual(await fs.readFile(path.join(from, 'manifest.json')));
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('leaves an identical installation alone', async () => {
    const before = await installV1();
    const again = await bundle('v1-again', v1);
    const result = await installBundle({ from: again, to: destination });
    expect(result.status).toBe('unchanged');
    expect(result.plan.unchanged).toHaveLength(3);
    expect(await snapshot(destination)).toEqual(before);
  });

  it('replaces changed JSON, adds new sprites and removes stale generated files', async () => {
    await installV1();
    const from = await bundle('v2', v2);
    const result = await installBundle({ from, to: destination });
    expect(result.status).toBe('installed');
    expect(result.plan).toMatchObject({
      added: ['sprites/items/new.webp'],
      replaced: ['keyed/uniques.json'],
      unchanged: ['strings/enUS.json'],
      removed: ['sprites/items/old.webp'],
      manifest: 'replaced'
    });
    expect(await snapshot(destination)).toEqual(await snapshot(from));
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('reports a dry run without changing anything', async () => {
    const before = await installV1();
    const result = await installBundle({ from: await bundle('v2', v2), to: destination, dryRun: true });
    expect(result.status).toBe('dry-run');
    expect(result.plan.removed).toEqual(['sprites/items/old.webp']);
    expect(await snapshot(destination)).toEqual(before);
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('does not create a missing destination on a dry run', async () => {
    await installBundle({ from: await bundle('v1', v1), to: destination, dryRun: true });
    expect(await fs.readdir(site)).toEqual([]);
  });

  it('restores the backup when promotion fails', async () => {
    const before = await installV1();
    const rename = async (from: string, to: string) => {
      if (path.basename(from).startsWith('.data.install-')) throw Object.assign(new Error('simulated promotion failure'), { code: 'EIO' });
      return fs.rename(from, to);
    };
    await expect(installBundle({ from: await bundle('v2', v2), to: destination, rename })).rejects.toThrow(/restored from its backup/);
    expect(await snapshot(destination)).toEqual(before);
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('keeps the destination untouched when the backup rename fails', async () => {
    const before = await installV1();
    const rename = async () => { throw Object.assign(new Error('locked'), { code: 'EIO' }); };
    await expect(installBundle({ from: await bundle('v2', v2), to: destination, rename })).rejects.toThrow(/not changed/);
    expect(await snapshot(destination)).toEqual(before);
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('refuses to delete files the installed manifest does not list', async () => {
    await installV1();
    await fs.writeFile(path.join(destination, 'keyed', 'hand-made.json'), '{}');
    const before = await snapshot(destination);
    await expect(installBundle({ from: await bundle('v2', v2), to: destination })).rejects.toThrow(/keyed\/hand-made\.json/);
    expect(await snapshot(destination)).toEqual(before);
  });

  it('refuses a non-empty destination without a manifest', async () => {
    await fs.mkdir(destination);
    await fs.writeFile(path.join(destination, 'notes.txt'), 'keep me');
    await expect(installBundle({ from: await bundle('v1', v1), to: destination })).rejects.toThrow(/notes\.txt/);
    expect(await snapshot(destination)).toEqual({ 'notes.txt': sha256('keep me') });
  });

  it('refuses to continue after an interrupted installation', async () => {
    const before = await installV1();
    await fs.mkdir(path.join(site, '.data.backup-earlier'));
    await expect(installBundle({ from: await bundle('v2', v2), to: destination })).rejects.toThrow(/interrupted/);
    expect(await snapshot(destination)).toEqual(before);
  });

  it('refuses a destination inside the bundle', async () => {
    const from = await bundle('v1', v1);
    await expect(installBundle({ from, to: path.join(from, 'nested') })).rejects.toThrow(/must not contain each other/);
  });
});

describe('bundle validation leaves the destination untouched', () => {
  const cases: [string, () => Promise<string>, RegExp][] = [
    ['a missing listed file', async () => {
      const dir = await bundle('bad', v2);
      await fs.rm(path.join(dir, 'sprites/items/new.webp'));
      return dir;
    }, /new\.webp is listed but missing/],
    ['a hash mismatch', () => bundle('bad', v2, (m) => { m.Files[0].Sha256 = '0'.repeat(64); }), /SHA-256 .* does not match/],
    ['a byte-length mismatch', () => bundle('bad', v2, (m) => { m.Files[0].Bytes += 1; }), /bytes, manifest declares/],
    ['a failed export', () => bundle('bad', v2, (m) => { m.Succeeded = false; }), /Succeeded is not true/],
    ['an incomplete export', () => bundle('bad', v2, (m) => { m.Complete = false; }), /Complete is not true/],
    ['a failed step', () => bundle('bad', v2, (m) => { m.Steps[0].Status = 'Failed'; }), /has status "Failed"/],
    ['schema 1', () => bundle('bad', v2, (m) => { m.SchemaVersion = 1; }), /expected 2/],
    ['an unlisted extra file', () => bundle('bad', v2, () => {}, { 'sprites/items/stale.webp': 'x' }), /stale\.webp is not listed/],
    ['an exact duplicate path', () => bundle('bad', v2, (m) => { m.Files.push({ ...m.Files[0] }); }), /duplicates path/],
    ['a case-only collision', () => bundle('bad', v2, (m) => { m.Files.push({ ...m.Files[0], Path: 'KEYED/Uniques.json' }); }),
      /collides with keyed\/uniques\.json/],
    ['a file/directory conflict', () => bundle('bad', v2, (m) => { m.Files.push({ ...m.Files[0], Path: 'Keyed' }); }),
      /needs keyed to be a directory/],
    ['a missing manifest', async () => {
      const dir = await bundle('bad', v2);
      await fs.rm(path.join(dir, 'manifest.json'));
      return dir;
    }, /missing or is not a regular file/],
    ['malformed manifest JSON', async () => {
      const dir = await bundle('bad', v2);
      await fs.writeFile(path.join(dir, 'manifest.json'), '{"SchemaVersion": 2,');
      return dir;
    }, /not valid JSON/]
  ];

  it.each(cases)('rejects %s', async (_, make, message) => {
    const before = await installV1();
    await expect(installBundle({ from: await make(), to: destination })).rejects.toThrow(message);
    expect(await snapshot(destination)).toEqual(before);
    expect(await fs.readdir(site)).toEqual(['data']);
  });

  it('rejects a junction that escapes the bundle', async () => {
    const before = await installV1();
    const outside = path.join(root, 'outside');
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, 'new.webp'), v2['sprites/items/new.webp']);
    const dir = await bundle('bad', v2);
    await fs.rm(path.join(dir, 'sprites/items'), { recursive: true });
    await fs.symlink(outside, path.join(dir, 'sprites/items'), 'junction');
    await expect(installBundle({ from: dir, to: destination })).rejects.toThrow(/sprites\/items is a symbolic link or junction/);
    expect(await snapshot(destination)).toEqual(before);
  });

  it('rejects a file symbolic link', async (context) => {
    const outside = path.join(root, 'outside.json');
    await fs.writeFile(outside, v2['keyed/uniques.json']);
    const dir = await bundle('bad', v2);
    await fs.rm(path.join(dir, 'keyed/uniques.json'));
    try {
      await fs.symlink(outside, path.join(dir, 'keyed/uniques.json'), 'file');
    } catch (e) {
      // Windows needs Developer Mode or elevation for file symlinks; junctions are covered above.
      if ((e as NodeJS.ErrnoException).code === 'EPERM') return context.skip();
      throw e;
    }
    await expect(validateBundle(dir)).rejects.toThrow(/keyed\/uniques\.json is a symbolic link/);
  });

  it.each([
    '../escape.json',
    'keyed/../../escape.json',
    'keyed\\..\\..\\escape.json',
    '..\\escape.json',
    '\\\\server\\share\\escape.json',
    '/etc/escape.json',
    'C:/Windows/escape.json',
    'c:escape.json',
    'keyed//double.json',
    './keyed/dot.json',
    'keyed/trailing.',
    'keyed/trailing ',
    'keyed/con.json',
    'keyed/LPT1',
    'keyed/stream.json:hidden',
    'keyed/ctrl\u0001.json',
    'manifest.json',
    'Manifest.JSON',
    ''
  ])('rejects the manifest path %j', async (bad) => {
    expect(pathProblem(bad)).not.toBeNull();
    const before = await installV1();
    const dir = await bundle('bad', v2, (m) => { m.Files.push({ ...m.Files[0], Path: bad }); });
    await expect(installBundle({ from: dir, to: destination })).rejects.toThrow(/unsafe or conflicting paths/);
    expect(await snapshot(destination)).toEqual(before);
  });

  it('accepts ordinary nested paths', () => {
    expect(pathProblem('sprites/skills/ama-0.webp')).toBeNull();
    expect(pathProblem('extras/asset-report.txt')).toBeNull();
  });
});
