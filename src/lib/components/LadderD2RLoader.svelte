<script lang="ts">
  import { removeLadderD2RLoader, uploadLadderD2RLoader, type Ladder } from '$lib/admin';
  import { ApiError } from '$lib/auth';
  import { d2rLoaderUploadProblem, d2rLoaderVersionFromFileName, maxD2RLoaderBytes } from '$lib/d2rloader-release';
  import { shortSha } from '$lib/server-builds';

  // Pins the ladder to one D2RLoader build. Launchers compare the root files
  // by SHA-256 and install this ZIP, up or down, whenever they differ.
  let { ladder, onUpdated }: {
    ladder: Ladder;
    onUpdated: (ladder: Ladder) => void;
  } = $props();

  let busy = $state(false);
  let error = $state('');
  let notice = $state('');
  let file = $state<File | null>(null);
  let version = $state('');
  let uploadProgress = $state<number | null>(null);
  let fileInput: HTMLInputElement | undefined = $state();

  let pinned = $derived(ladder.requiredD2RLoader ?? null);
  let bundleMinimum = $derived(ladder.activeBundle?.compatibility.requiredD2RLoaderVersion ?? null);
  // Derived so replacing the ladder object after an upload does not clear the notice.
  let ladderId = $derived(ladder.id);

  $effect(() => {
    void ladderId;
    error = '';
    notice = '';
    file = null;
    version = '';
  });

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  function formatBytes(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MiB` : `${(bytes / 1024).toFixed(1)} KiB`;
  }

  function chooseFile(selected: File | null): void {
    file = selected;
    if (selected) version = d2rLoaderVersionFromFileName(selected.name) || version;
  }

  async function upload(): Promise<void> {
    const problem = d2rLoaderUploadProblem(file, version);
    if (problem || !file) { error = problem ?? ''; return; }
    const replacing = pinned ? ` This replaces the ${pinned.version} pin.` : '';
    if (!confirm(`Require D2RLoader ${version.trim()} for ${ladder.name}? Launchers on any other build will be told to install this one before they can play.${replacing}`)) return;
    const id = ladder.id;
    busy = true;
    uploadProgress = 0;
    error = '';
    notice = '';
    try {
      const updated = await uploadLadderD2RLoader(id, file, version, progress => uploadProgress = progress.percentage);
      onUpdated(updated);
      if (id !== ladder.id) return;
      file = null;
      version = '';
      if (fileInput) fileInput.value = '';
      notice = `D2RLoader ${updated.requiredD2RLoader?.version ?? ''} is now required. Launchers pick it up on their next ladder check.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busy = false;
      uploadProgress = null;
    }
  }

  async function remove(): Promise<void> {
    if (!pinned || !confirm(`Stop requiring D2RLoader ${pinned.version} for ${ladder.name}? Players keep whatever loader they have, as long as it meets the bundle minimum.`)) return;
    const id = ladder.id;
    busy = true;
    error = '';
    notice = '';
    try {
      onUpdated(await removeLadderD2RLoader(id));
      if (id === ladder.id) notice = 'D2RLoader pin removed.';
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busy = false;
    }
  }
</script>

<div>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-ember-400">Player runtime</p>
      <h3 class="display-text mt-1 text-2xl">Required D2RLoader</h3>
      <p class="mt-2 max-w-3xl text-sm text-parchment-300">
        Upload the release ZIP from d2rloader.net that this ladder's plugins were verified against. The launcher checks
        <code>D2RLoader.exe</code>, <code>D2RCore.dll</code> and <code>d2rloader.mpq</code> by SHA-256 and installs this
        build, including downgrades, before a player can join. Without a pin, players keep any loader at or above the bundle
        minimum{bundleMinimum ? ` (${bundleMinimum})` : ''}.
      </p>
    </div>
    <div class="rounded border border-parchment-300/20 px-4 py-3 text-sm">
      <span class="block text-xs uppercase tracking-wide text-parchment-300">Required build</span>
      <span class="mt-1 block font-mono text-parchment-50">{pinned ? pinned.version : 'Not pinned'}</span>
    </div>
  </div>

  {#if error}<p role="alert" class="mt-4 rounded border border-requirement/45 bg-requirement/10 p-3 text-sm text-requirement">{error}</p>{/if}
  {#if notice}<p class="mt-4 rounded border border-set/40 bg-set/10 p-3 text-sm text-set">{notice}</p>{/if}

  {#if pinned}
    <div class="mt-5 rounded-lg border border-parchment-300/20 bg-abyss-900 p-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-parchment-50">{pinned.fileName}</p>
          <p class="mt-1 text-xs text-parchment-300">
            {formatBytes(pinned.sizeBytes)} · uploaded {new Date(pinned.uploadedAtUtc).toLocaleString()} ·
            ZIP SHA-256 <span class="font-mono" title={pinned.sha256}>{shortSha(pinned.sha256)}…</span>
          </p>
          <ul class="mt-3 grid gap-1 text-xs text-parchment-200">
            {#each pinned.files as pinnedFile (pinnedFile.path)}
              <li>
                <code>{pinnedFile.path}</code>
                <span class="text-parchment-300">· {formatBytes(pinnedFile.sizeBytes)} ·</span>
                <span class="font-mono" title={pinnedFile.sha256}>{shortSha(pinnedFile.sha256)}…</span>
              </li>
            {/each}
          </ul>
        </div>
        <button class="rounded border border-requirement/60 px-3 py-2 text-sm text-requirement hover:bg-requirement/10 disabled:opacity-50"
                type="button" disabled={busy} onclick={() => void remove()}>Remove pin</button>
      </div>
    </div>
  {/if}

  <form class="mt-5 rounded-lg border border-parchment-300/20 bg-abyss-900 p-4"
        onsubmit={(event) => { event.preventDefault(); void upload(); }}>
    <h4 class="display-text text-xl">{pinned ? 'Replace the required build' : 'Pin a D2RLoader build'}</h4>
    <div class="mt-3 grid gap-3 md:grid-cols-2">
      <label>
        <span class="mb-1 block text-xs text-parchment-300">D2RLoader release ZIP (up to {maxD2RLoaderBytes / 1024 / 1024} MiB)</span>
        <input class="field min-w-0 max-w-full" type="file" accept=".zip,application/zip" disabled={busy} bind:this={fileInput}
               onchange={(event) => chooseFile(event.currentTarget.files?.[0] ?? null)}/>
      </label>
      <label>
        <span class="mb-1 block text-xs text-parchment-300">Version</span>
        <input class="field" maxlength="50" disabled={busy} bind:value={version} placeholder="1.3.1-beta"/>
      </label>
    </div>
    <div class="mt-4 flex justify-end">
      <button class="rounded bg-ember-700 px-4 py-2 text-parchment-50 hover:bg-ember-500 disabled:opacity-50"
              type="submit" disabled={busy || !file}>
        {uploadProgress !== null ? uploadProgress >= 100 ? 'Verifying and storing…' : `Uploading… ${uploadProgress.toFixed(0)}%` : 'Upload and require'}
      </button>
    </div>
  </form>
</div>
