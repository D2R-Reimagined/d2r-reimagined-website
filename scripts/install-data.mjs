// Installs a D2R Multi-Export bundle staged by the exporter's `publish --staging` command into
// static/data. Nothing is pushed or deployed. See docs/DATA-INSTALL.md.
//
// Usage:
//   pnpm data:install --from <staging-directory>              validate, then replace static/data
//   pnpm data:install --from <staging-directory> --dry-run    report added/replaced/removed only
//   pnpm data:install --verify                                check static/data against its manifest
//   --to <directory>                                          use another destination (tests, trials)
import { createHash, randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MANIFEST = 'manifest.json';
const DEFAULT_DESTINATION = fileURLToPath(new URL('../static/data', import.meta.url));
const SHA256 = /^[0-9a-f]{64}$/;
const INVALID_SEGMENT_CHARS = /[<>:"|?*\\\u0000-\u001f\u007f]/;
const WINDOWS_DEVICE = /^(con|prn|aux|nul|conin\$|conout\$|com[0-9¹²³]|lpt[0-9¹²³])(\..*)?$/i;
const RETRYABLE_RENAME = new Set(['EPERM', 'EACCES', 'EBUSY']);

export class InstallError extends Error {
  /** @param {string} message @param {string[]} [problems] */
  constructor(message, problems = []) {
    super(problems.length ? `${message}\n  - ${problems.join('\n  - ')}` : message);
    this.name = 'InstallError';
    this.problems = problems;
  }
}

/** Windows compares names case-insensitively; macOS also normalizes Unicode. Fold both. */
const fold = (/** @type {string} */ p) => p.normalize('NFC').toLowerCase();
const toAbsolute = (/** @type {string} */ root, /** @type {string} */ rel) => path.join(root, ...rel.split('/'));

/** Why a manifest path is unsafe or unportable, or null when it is a plain root-relative path. */
export function pathProblem(/** @type {unknown} */ p) {
  if (typeof p !== 'string' || p === '') return 'path is empty or not a string';
  if (p.includes('\\')) return 'uses a backslash separator';
  if (p.startsWith('/')) return 'is absolute';
  if (/^[A-Za-z]:/.test(p)) return 'has a drive prefix';
  for (const segment of p.split('/')) {
    if (segment === '') return 'has an empty segment';
    if (segment === '.' || segment === '..') return 'contains a "." or ".." segment';
    if (INVALID_SEGMENT_CHARS.test(segment)) return `segment "${segment}" contains a character invalid in Windows names`;
    if (/[. ]$/.test(segment)) return `segment "${segment}" ends with a dot or space`;
    if (WINDOWS_DEVICE.test(segment)) return `segment "${segment}" is a reserved Windows device name`;
  }
  if (fold(p) === MANIFEST) return 'names the manifest itself';
  return null;
}

/**
 * Every entry below `root`, without following links. Links/junctions and special files are
 * reported as unsafe rather than traversed.
 */
async function inventory(/** @type {string} */ root) {
  /** @type {Map<string, number>} */
  const files = new Map();
  /** @type {string[]} */
  const dirs = [];
  /** @type {string[]} */
  const unsafe = [];
  async function walk(/** @type {string} */ rel) {
    const entries = await fs.readdir(rel ? toAbsolute(root, rel) : root);
    for (const name of entries.sort()) {
      const child = rel ? `${rel}/${name}` : name;
      const stat = await fs.lstat(toAbsolute(root, child));
      if (stat.isSymbolicLink()) unsafe.push(`${child} is a symbolic link or junction`);
      else if (stat.isDirectory()) { dirs.push(child); await walk(child); }
      else if (stat.isFile()) files.set(child, stat.size);
      else unsafe.push(`${child} is not a regular file or directory`);
    }
  }
  await walk('');
  const occupied = new Set([...files.keys()].flatMap((f) => ancestors(f)));
  const emptyDirs = dirs.filter((d) => !occupied.has(d));
  return { files, unsafe, emptyDirs };
}

function ancestors(/** @type {string} */ rel) {
  const parts = rel.split('/');
  return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join('/'));
}

async function hashFile(/** @type {string} */ file) {
  const hash = createHash('sha256');
  let bytes = 0;
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
    bytes += chunk.length;
  }
  return { bytes, sha256: hash.digest('hex') };
}

async function realDirectory(/** @type {string} */ dir, /** @type {string} */ label) {
  let real;
  try {
    real = await fs.realpath(dir);
  } catch (e) {
    throw new InstallError(`The ${label} ${dir} cannot be read: ${/** @type {Error} */ (e).message}`);
  }
  if (!(await fs.stat(real)).isDirectory()) throw new InstallError(`The ${label} ${dir} is not a directory.`);
  return real;
}

/** Manifest-level checks only; source and calculation validation belong to the exporter. */
function manifestProblems(/** @type {any} */ manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return ['manifest is not a JSON object'];
  const problems = [];
  if (manifest.SchemaVersion !== 2) problems.push(`SchemaVersion is ${JSON.stringify(manifest.SchemaVersion)}, expected 2`);
  if (manifest.Succeeded !== true) problems.push('Succeeded is not true: the export recorded errors');
  if (manifest.Complete !== true) problems.push('Complete is not true: the export skipped or did not write declared outputs');
  if (!Array.isArray(manifest.Steps)) problems.push('Steps is not an array');
  else {
    for (const step of manifest.Steps) {
      if (step?.Status !== 'Written') problems.push(`step ${JSON.stringify(step?.Producer)} has status ${JSON.stringify(step?.Status)}`);
    }
  }
  if (!Array.isArray(manifest.Files)) problems.push('Files is not an array');
  return problems;
}

/** Path, size and hash shape of Files[], plus duplicates, case collisions and file/directory clashes. */
function fileEntryProblems(/** @type {any[]} */ entries) {
  const problems = [];
  /** @type {Map<string, {Bytes: number, Sha256: string}>} */
  const files = new Map();
  /** @type {Map<string, string>} */
  const folded = new Map();
  for (const [i, entry] of entries.entries()) {
    const label = `Files[${i}]`;
    if (!entry || typeof entry !== 'object') { problems.push(`${label} is not an object`); continue; }
    const problem = pathProblem(entry.Path);
    if (problem) { problems.push(`${label} ${JSON.stringify(entry.Path)} ${problem}`); continue; }
    if (!Number.isSafeInteger(entry.Bytes) || entry.Bytes < 0) problems.push(`${label} ${entry.Path} has invalid Bytes ${JSON.stringify(entry.Bytes)}`);
    if (typeof entry.Sha256 !== 'string' || !SHA256.test(entry.Sha256)) problems.push(`${label} ${entry.Path} has invalid Sha256 ${JSON.stringify(entry.Sha256)}`);
    const key = fold(entry.Path);
    const previous = folded.get(key);
    if (previous === entry.Path) { problems.push(`${label} duplicates path ${entry.Path}`); continue; }
    if (previous !== undefined) { problems.push(`${label} ${entry.Path} collides with ${previous} on case-insensitive file systems`); continue; }
    folded.set(key, entry.Path);
    files.set(entry.Path, { Bytes: entry.Bytes, Sha256: entry.Sha256 });
  }
  for (const file of files.keys()) {
    for (const dir of ancestors(file)) {
      const clash = folded.get(fold(dir));
      if (clash) problems.push(`${file} needs ${dir} to be a directory, but ${clash} is listed as a file`);
    }
  }
  return { problems, files };
}

/** Exact listed files on disk with matching sizes and hashes, and nothing else. */
async function contentProblems(/** @type {string} */ root, /** @type {Map<string, {Bytes: number, Sha256: string}>} */ files) {
  const found = await inventory(root);
  const problems = [...found.unsafe];
  for (const [file, expected] of files) {
    if (!found.files.has(file)) { problems.push(`${file} is listed but missing`); continue; }
    const actual = await hashFile(toAbsolute(root, file));
    if (actual.bytes !== expected.Bytes) problems.push(`${file} is ${actual.bytes} bytes, manifest declares ${expected.Bytes}`);
    else if (actual.sha256 !== expected.Sha256) problems.push(`${file} SHA-256 ${actual.sha256} does not match manifest ${expected.Sha256}`);
  }
  for (const file of found.files.keys()) {
    if (file !== MANIFEST && !files.has(file)) problems.push(`${file} is not listed in the manifest`);
  }
  for (const dir of found.emptyDirs) problems.push(`${dir}/ is an empty directory not used by the manifest`);
  return problems;
}

/**
 * Validates a staged bundle without modifying anything. Returns the exact manifest bytes so the
 * installed manifest is a byte-for-byte copy.
 */
export async function validateBundle(/** @type {string} */ from) {
  const root = await realDirectory(from, 'bundle directory');
  const manifestPath = path.join(root, MANIFEST);
  const manifestStat = await fs.lstat(manifestPath).catch(() => null);
  if (!manifestStat?.isFile()) throw new InstallError(`${manifestPath} is missing or is not a regular file.`);
  const raw = await fs.readFile(manifestPath);
  let manifest;
  try {
    manifest = JSON.parse(raw.toString('utf8'));
  } catch (e) {
    throw new InstallError(`${manifestPath} is not valid JSON: ${/** @type {Error} */ (e).message}`);
  }
  const header = manifestProblems(manifest);
  if (header.length) throw new InstallError(`The manifest in ${root} cannot be installed.`, header);
  const { problems, files } = fileEntryProblems(manifest.Files);
  if (problems.length) throw new InstallError(`The manifest in ${root} lists unsafe or conflicting paths.`, problems);
  const content = await contentProblems(root, files);
  if (content.length) throw new InstallError(`The bundle in ${root} does not match its manifest.`, content);
  return { root, raw, files };
}

/**
 * What the destination holds. Files are only treated as generated (replaceable) when its current
 * manifest lists them; anything else is reported as unrecognized.
 */
export async function inspectDestination(/** @type {string} */ to) {
  const target = path.resolve(to);
  const stat = await fs.lstat(target).catch((e) => {
    if (e.code === 'ENOENT') return null;
    throw e;
  });
  if (!stat) return { target, exists: false, files: new Map(), owned: new Set(), manifestRaw: null, unrecognized: [] };
  if (stat.isSymbolicLink()) throw new InstallError(`The destination ${target} is a symbolic link or junction; refusing to replace it.`);
  if (!stat.isDirectory()) throw new InstallError(`The destination ${target} is not a directory.`);
  const found = await inventory(target);
  /** @type {Set<string>} */
  const owned = new Set();
  const unrecognized = [...found.unsafe];
  let manifestRaw = null;
  if (found.files.has(MANIFEST)) {
    manifestRaw = await fs.readFile(path.join(target, MANIFEST));
    owned.add(MANIFEST);
    try {
      const listed = JSON.parse(manifestRaw.toString('utf8')).Files;
      for (const entry of Array.isArray(listed) ? listed : []) {
        if (!pathProblem(entry?.Path)) owned.add(entry.Path);
      }
    } catch {
      unrecognized.push(`${MANIFEST} is not valid JSON, so no generated files can be identified`);
    }
  }
  for (const file of found.files.keys()) if (!owned.has(file)) unrecognized.push(`${file} is not listed in the installed manifest`);
  for (const dir of found.emptyDirs) unrecognized.push(`${dir}/ is an empty directory`);
  return { target, exists: true, files: found.files, owned, manifestRaw, unrecognized };
}

async function planChanges(
  /** @type {Awaited<ReturnType<typeof validateBundle>>} */ bundle,
  /** @type {Awaited<ReturnType<typeof inspectDestination>>} */ destination
) {
  /** @type {{added: string[], replaced: string[], unchanged: string[], removed: string[], manifest: string}} */
  const plan = { added: [], replaced: [], unchanged: [], removed: [], manifest: 'added' };
  for (const [file, expected] of bundle.files) {
    if (!destination.files.has(file)) { plan.added.push(file); continue; }
    const actual = await hashFile(toAbsolute(destination.target, file));
    const same = actual.bytes === expected.Bytes && actual.sha256 === expected.Sha256;
    (same ? plan.unchanged : plan.replaced).push(file);
  }
  for (const file of destination.files.keys()) {
    if (file !== MANIFEST && !bundle.files.has(file)) plan.removed.push(file);
  }
  if (destination.manifestRaw) plan.manifest = destination.manifestRaw.equals(bundle.raw) ? 'unchanged' : 'replaced';
  return plan;
}

const isInside = (/** @type {string} */ child, /** @type {string} */ parent) => {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
};

const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Windows briefly locks directories that indexers, antivirus or file watchers have open. */
async function renameWithRetry(/** @type {typeof fs.rename} */ rename, /** @type {string} */ from, /** @type {string} */ to) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await rename(from, to);
    } catch (e) {
      const code = /** @type {NodeJS.ErrnoException} */ (e).code ?? '';
      if (attempt >= 5 || !RETRYABLE_RENAME.has(code)) throw e;
      await sleep(100 * 2 ** attempt);
    }
  }
}

const removeQuietly = (/** @type {string} */ dir) => fs.rm(dir, { recursive: true, force: true }).catch(() => {});

/**
 * Validates `from`, prepares and verifies a complete replacement beside `to`, then swaps it in:
 * `to` -> backup, replacement -> `to`, verify, delete backup. A failed swap or verification
 * renames the backup back. The two renames are not one atomic transaction; an interruption
 * between them leaves the previous data in the reported backup directory.
 *
 * @param {{ from: string, to?: string, dryRun?: boolean, rename?: typeof fs.rename }} options
 */
export async function installBundle({ from, to = DEFAULT_DESTINATION, dryRun = false, rename = fs.rename }) {
  const bundle = await validateBundle(from);
  const target = path.resolve(to);
  const parent = path.dirname(target);
  const base = path.basename(target);
  if (parent === target) throw new InstallError(`Refusing to install into the file-system root ${target}.`);
  const realParent = await realDirectory(parent, 'destination parent directory');
  const realTarget = path.join(realParent, base);
  if (isInside(realTarget, bundle.root) || isInside(bundle.root, realTarget)) {
    throw new InstallError(`The bundle ${bundle.root} and destination ${realTarget} must not contain each other.`);
  }
  const prefix = `.${base}.`;
  const leftovers = (await fs.readdir(parent)).filter((name) => name.startsWith(prefix));
  const backups = leftovers.filter((name) => name.startsWith(`${prefix}backup-`));
  if (backups.length) {
    throw new InstallError(
      `A previous installation was interrupted. Inspect these directories in ${parent} and restore or delete them before installing again.`,
      backups
    );
  }
  const warnings = leftovers.map((name) => `Leftover directory ${path.join(parent, name)} from an earlier run can be deleted.`);

  const destination = await inspectDestination(target);
  if (destination.unrecognized.length) {
    throw new InstallError(
      `${target} contains entries its manifest does not identify as generated output. Move or remove them manually; nothing was changed.`,
      destination.unrecognized
    );
  }
  const plan = await planChanges(bundle, destination);
  if (dryRun) return { status: /** @type {const} */ ('dry-run'), target, plan, warnings };
  if (destination.exists && !plan.added.length && !plan.replaced.length && !plan.removed.length && plan.manifest === 'unchanged') {
    return { status: /** @type {const} */ ('unchanged'), target, plan, warnings };
  }

  const stamp = `${new Date().toISOString().replace(/[-:.]/g, '')}-${process.pid}-${randomBytes(3).toString('hex')}`;
  const prepared = path.join(parent, `${prefix}install-${stamp}`);
  const backup = path.join(parent, `${prefix}backup-${stamp}`);
  const failed = path.join(parent, `${prefix}failed-${stamp}`);
  try {
    await fs.mkdir(prepared);
    for (const file of bundle.files.keys()) {
      const destinationFile = toAbsolute(prepared, file);
      await fs.mkdir(path.dirname(destinationFile), { recursive: true });
      await fs.copyFile(toAbsolute(bundle.root, file), destinationFile, fs.constants.COPYFILE_EXCL);
    }
    await fs.writeFile(path.join(prepared, MANIFEST), bundle.raw, { flag: 'wx' });
    const problems = await verifyCopy(prepared, bundle);
    if (problems.length) throw new InstallError('The prepared copy does not match the validated bundle.', problems);
  } catch (e) {
    await removeQuietly(prepared);
    throw e instanceof InstallError ? e : new InstallError(`Preparing the replacement failed; ${target} was not changed: ${/** @type {Error} */ (e).message}`);
  }

  let backedUp = false;
  try {
    if (destination.exists) {
      await renameWithRetry(rename, target, backup);
      backedUp = true;
    }
    await renameWithRetry(rename, prepared, target);
  } catch (e) {
    const reason = /** @type {Error} */ (e).message;
    if (backedUp) {
      try {
        await renameWithRetry(rename, backup, target);
      } catch (restoreError) {
        throw new InstallError(
          `Promotion failed (${reason}) and the previous data could not be restored automatically ` +
          `(${/** @type {Error} */ (restoreError).message}). Rename ${backup} to ${target} by hand. ` +
          `The verified replacement is in ${prepared}.`
        );
      }
    }
    await removeQuietly(prepared);
    throw new InstallError(`Promotion failed (${reason}); ${target} was ${backedUp ? 'restored from its backup' : 'not changed'}.`);
  }

  const problems = await verifyCopy(target, bundle);
  if (problems.length) {
    try {
      await renameWithRetry(rename, target, failed);
      if (backedUp) await renameWithRetry(rename, backup, target);
    } catch (restoreError) {
      throw new InstallError(
        `The installed data failed verification and could not be rolled back (${/** @type {Error} */ (restoreError).message}). ` +
        `Previous data: ${backedUp ? backup : 'none'}. Failed installation: ${failed}.`,
        problems
      );
    }
    await removeQuietly(failed);
    throw new InstallError(`The installed data failed verification; ${backedUp ? 'the previous data was restored' : 'it was removed'}.`, problems);
  }
  if (backedUp) {
    await fs.rm(backup, { recursive: true, force: true }).catch((e) => {
      warnings.push(`Installed successfully, but the backup ${backup} could not be deleted: ${e.message}`);
    });
  }
  return { status: /** @type {const} */ ('installed'), target, plan, warnings };
}

async function verifyCopy(/** @type {string} */ dir, /** @type {Awaited<ReturnType<typeof validateBundle>>} */ bundle) {
  const problems = await contentProblems(dir, bundle.files);
  const manifest = await fs.readFile(path.join(dir, MANIFEST)).catch(() => null);
  if (!manifest?.equals(bundle.raw)) problems.push(`${MANIFEST} is not a byte-for-byte copy of the staged manifest`);
  return problems;
}

function parseArgs(/** @type {string[]} */ argv) {
  /** @type {{ from?: string, to?: string, dryRun: boolean, verify: boolean, help: boolean }} */
  const options = { dryRun: false, verify: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s, 2);
    const value = () => {
      const v = inline ?? argv[++i];
      if (!v) throw new InstallError(`${flag} needs a directory.`);
      return v;
    };
    if (flag === '--') continue;
    else if (flag === '--from') options.from = value();
    else if (flag === '--to') options.to = value();
    else if (flag === '--dry-run') options.dryRun = true;
    else if (flag === '--verify') options.verify = true;
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new InstallError(`Unknown argument ${argv[i]}.`);
  }
  return options;
}

function printList(/** @type {string} */ label, /** @type {string[]} */ items) {
  console.log(`${label}: ${items.length}`);
  for (const item of items) console.log(`  ${item}`);
}

async function main() {
  const usage = 'Usage: pnpm data:install --from <staging-directory> [--to <directory>] [--dry-run]\n' +
    '       pnpm data:install --verify [--to <directory>]';
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`${/** @type {Error} */ (e).message}\n${usage}`);
    return 2;
  }
  if (options.help) { console.log(usage); return 0; }
  if (options.verify === Boolean(options.from)) { console.error(usage); return 2; }
  const to = options.to ?? DEFAULT_DESTINATION;
  try {
    if (options.verify) {
      const bundle = await validateBundle(to);
      console.log(`${bundle.root} matches its manifest (${bundle.files.size} files).`);
      return 0;
    }
    const result = await installBundle({ from: /** @type {string} */ (options.from), to, dryRun: options.dryRun });
    const { plan } = result;
    console.log(result.status === 'dry-run' ? `Dry run for ${result.target}; nothing was changed.` : `Destination ${result.target}`);
    printList('Added', plan.added);
    printList('Replaced', plan.replaced);
    printList('Removed', plan.removed);
    console.log(`Unchanged: ${plan.unchanged.length}`);
    console.log(`Manifest: ${plan.manifest}`);
    for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
    if (result.status === 'unchanged') console.log('The bundle is already installed; nothing was changed.');
    if (result.status === 'installed') console.log('Installed and verified. Review the diff and commit the data separately.');
    return 0;
  } catch (e) {
    console.error(e instanceof InstallError ? e.message : /** @type {Error} */ (e).stack);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
