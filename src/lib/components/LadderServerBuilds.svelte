<script lang="ts">
  import { untrack } from 'svelte';
  import {
    activateServerBuild,
    cancelServerBuildActivation,
    getServerBuilds,
    uploadServerBuild,
    type LadderPendingRelease,
    type ServerBuild,
    type ServerBuildState
  } from '$lib/admin';
  import { ApiError } from '$lib/auth';
  import {
    currentServerBuild,
    isServerBuildRollback,
    maxServerBuildNotes,
    pendingServerBuild,
    serverBuildCountdown,
    serverBuildFileName,
    serverBuildUploadProblem,
    shortBuildId,
    shortSha
  } from '$lib/server-builds';

  // The dedicated-server plugin. Deliberately nothing here fetches a build's
  // bytes: the API has no admin download, only the ladder's servers get one.
  let { ladderId, ladderName, bundleRelease }: {
    ladderId: string;
    ladderName: string;
    /** The ladder bundle counting down, which a newly activated build joins. */
    bundleRelease: LadderPendingRelease | null;
  } = $props();

  let buildState = $state<ServerBuildState | null>(null);
  let loading = $state(true);
  let busy = $state(false);
  let error = $state('');
  let notice = $state('');
  let file = $state<File | null>(null);
  let notes = $state('');
  let uploadProgress = $state<number | null>(null);
  let fileInput: HTMLInputElement | undefined = $state();
  let clockMs = $state(Date.now());
  let lastCountdownReloadMs = 0;
  let loadSequence = 0;

  let current = $derived(currentServerBuild(buildState));
  let pending = $derived(buildState?.pending ?? null);
  let pendingBuild = $derived(pendingServerBuild(buildState));
  // Bundle activation and cancellation move an attached build with them, so
  // a change to the bundle countdown reloads this ladder's builds.
  let bundleKey = $derived(bundleRelease ? `${bundleRelease.bundleId}:${bundleRelease.activatesAtUtc}` : '');

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  function formatBytes(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MiB` : `${(bytes / 1024).toFixed(1)} KiB`;
  }

  async function load(id: string): Promise<void> {
    const sequence = ++loadSequence;
    try {
      const loaded = await getServerBuilds(id);
      if (sequence === loadSequence) buildState = loaded;
    } catch (value) {
      if (sequence === loadSequence) error = problemMessage(value);
    } finally {
      if (sequence === loadSequence) loading = false;
    }
  }

  $effect(() => {
    const id = ladderId;
    buildState = null;
    loading = true;
    error = '';
    notice = '';
    file = null;
    notes = '';
    void load(id);
  });

  $effect(() => {
    void bundleKey;
    untrack(() => { if (buildState) void load(ladderId); });
  });

  // Ticks the countdown, and reloads once it has ended so the build that went
  // current shows (spaced out until the API has ended it).
  $effect(() => {
    if (!pending) return;
    const id = ladderId;
    const activatesAtMs = Date.parse(pending.activatesAtUtc);
    const timer = setInterval(() => {
      clockMs = Date.now();
      if (clockMs >= activatesAtMs + 3000 && clockMs - lastCountdownReloadMs >= 5000) {
        lastCountdownReloadMs = clockMs;
        void load(id);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  async function upload(): Promise<void> {
    const problem = serverBuildUploadProblem(file, notes);
    if (problem || !file) { error = problem ?? ''; return; }
    const id = ladderId;
    busy = true;
    uploadProgress = 0;
    error = '';
    notice = '';
    try {
      const build = await uploadServerBuild(id, file, notes, progress => uploadProgress = progress.percentage);
      if (id !== ladderId) return;
      const known = buildState?.builds.some(item => item.id === build.id) ?? false;
      file = null;
      notes = '';
      if (fileInput) fileInput.value = '';
      await load(id);
      notice = known
        ? `Those bytes are already build ${shortBuildId(build.id)}; nothing new was stored.`
        : `Build ${shortBuildId(build.id)} uploaded. Activate it to move this ladder's servers onto it.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busy = false;
      uploadProgress = null;
    }
  }

  async function activate(build: ServerBuild, immediate: boolean): Promise<void> {
    if (!buildState) return;
    const verb = isServerBuildRollback(buildState, build) ? 'Roll back to' : 'Activate';
    const name = `server build ${shortBuildId(build.id)}`;
    const replacing = pending && pending.buildId !== build.id
      ? ` This replaces the countdown to ${shortBuildId(pending.buildId)}.` : '';
    const question = immediate
      ? `${verb} ${name} NOW, with no countdown? Every ${ladderName} server restarts onto it as soon as it is empty, and players get no warning.${replacing}`
      : bundleRelease
        ? `${verb} ${name} together with the r${bundleRelease.revision} release? Servers restart once for both when that countdown ends.${replacing}`
        : `${verb} ${name}? Players are told in game that servers restart in 5 minutes (they do not need to relaunch), then every ${ladderName} server restarts onto it.${replacing}`;
    if (!confirm(question)) return;
    const id = ladderId;
    busy = true;
    error = '';
    notice = '';
    try {
      const updated = await activateServerBuild(id, build.id, immediate);
      if (id !== ladderId) return;
      buildState = updated;
      notice = updated.pending?.buildId === build.id
        ? `${name} goes live at ${new Date(updated.pending.activatesAtUtc).toLocaleTimeString()}${updated.pending.attachedToBundleRevision ? `, with the r${updated.pending.attachedToBundleRevision} release` : ''}.`
        : `${name} is now current. Servers restart onto it once their players leave.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busy = false;
    }
  }

  async function cancel(): Promise<void> {
    if (!pending) return;
    const attached = pending.attachedToBundleRevision
      ? ` The r${pending.attachedToBundleRevision} package release goes ahead without it.` : '';
    if (!confirm(`Cancel the countdown to server build ${shortBuildId(pending.buildId)}? Servers stay on the current build.${attached}`)) return;
    const id = ladderId;
    busy = true;
    error = '';
    notice = '';
    try {
      const updated = await cancelServerBuildActivation(id);
      if (id !== ladderId) return;
      buildState = updated;
      notice = 'Server build countdown cancelled. Servers stay on the current build.';
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busy = false;
    }
  }

  async function copySha(build: ServerBuild): Promise<void> {
    try {
      await navigator.clipboard.writeText(build.sha256);
      notice = `SHA-256 of ${shortBuildId(build.id)} copied.`;
    } catch {
      error = 'The clipboard is unavailable; select the hash from its tooltip instead.';
    }
  }
</script>

<div>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-ember-400">Dedicated servers</p>
      <h3 class="display-text mt-1 text-2xl">Server builds</h3>
      <p class="mt-2 max-w-3xl text-sm text-parchment-300">
        The {serverBuildFileName} this ladder's dedicated servers run. It is confidential and never part of the player
        package: only the ladder's servers can download a build, so this page shows hashes, never the file. Activating an
        older build rolls the servers back.
      </p>
    </div>
    <div class="rounded border border-parchment-300/20 px-4 py-3 text-sm">
      <span class="block text-xs uppercase tracking-wide text-parchment-300">Current build</span>
      <span class="mt-1 block font-mono text-parchment-50" title={current?.sha256}>{current ? shortBuildId(current.id) : 'None'}</span>
    </div>
  </div>

  {#if error}<p role="alert" class="mt-4 rounded border border-requirement/45 bg-requirement/10 p-3 text-sm text-requirement">{error}</p>{/if}
  {#if notice}<p class="mt-4 rounded border border-set/40 bg-set/10 p-3 text-sm text-set">{notice}</p>{/if}

  {#if pending}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ember-400/60 bg-abyss-950 p-4 shadow-[0_0_24px_rgba(217,119,6,0.08)]"
         role="status" aria-live="polite">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-ember-400">Server build counting down</p>
        <p class="mt-1 text-parchment-50">
          <span class="font-mono">{shortBuildId(pending.buildId)}</span> goes live in
          <span class="font-mono text-ember-300">{serverBuildCountdown(pending.activatesAtUtc, clockMs)}</span>
          <span class="text-sm text-parchment-300">({new Date(pending.activatesAtUtc).toLocaleTimeString()})</span>
        </p>
        <p class="mt-1 max-w-2xl text-xs text-parchment-300">
          {#if pending.attachedToBundleRevision}
            Attached to the r{pending.attachedToBundleRevision} package release: servers restart once for both. Cancelling that release cancels this build too.
          {:else}
            Players are told in game that servers restart; they do not need to relaunch.
          {/if}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="rounded border border-requirement/60 px-3 py-2 text-sm text-requirement hover:bg-requirement/10 disabled:opacity-50"
                type="button" disabled={busy} onclick={() => void cancel()}>Cancel</button>
        {#if pendingBuild}
          <button class="rounded border border-parchment-300/35 px-3 py-2 text-sm text-parchment-100 hover:bg-parchment-300/10 disabled:opacity-50"
                  type="button" disabled={busy} onclick={() => void activate(pendingBuild, true)}>Activate now</button>
        {/if}
      </div>
    </div>
  {/if}

  <form class="mt-5 rounded-lg border border-parchment-300/20 bg-abyss-900 p-4"
        onsubmit={(event) => { event.preventDefault(); void upload(); }}>
    <h4 class="display-text text-xl">Upload a build</h4>
    <div class="mt-3 grid gap-3 md:grid-cols-2">
      <label>
        <span class="mb-1 block text-xs text-parchment-300">{serverBuildFileName} (up to 64 MiB)</span>
        <input class="field min-w-0 max-w-full" type="file" accept=".dll" disabled={busy} bind:this={fileInput}
               onchange={(event) => file = event.currentTarget.files?.[0] ?? null}/>
      </label>
      <label>
        <span class="mb-1 block text-xs text-parchment-300">Notes (optional, {notes.trim().length}/{maxServerBuildNotes})</span>
        <input class="field" maxlength={maxServerBuildNotes} disabled={busy} bind:value={notes} placeholder="What changed"/>
      </label>
    </div>
    <div class="mt-4 flex justify-end">
      <button class="rounded bg-ember-700 px-4 py-2 text-parchment-50 hover:bg-ember-500 disabled:opacity-50"
              type="submit" disabled={busy || !file}>
        {uploadProgress !== null ? uploadProgress >= 100 ? 'Encrypting and storing…' : `Uploading… ${uploadProgress.toFixed(0)}%` : 'Upload build'}
      </button>
    </div>
  </form>

  {#if loading}
    <p class="mt-5 text-sm text-parchment-300">Loading server builds…</p>
  {:else if buildState}
    <div class="mt-5 grid gap-3">
      {#each buildState.builds as build (build.id)}
        {@const rollback = isServerBuildRollback(buildState, build)}
        <div class="rounded-lg border border-parchment-300/20 bg-abyss-900 p-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-parchment-50" title={build.id}>{shortBuildId(build.id)}</span>
                <span class={`rounded border px-2 py-1 text-xs uppercase tracking-wide ${build.status === 'current' ? 'border-set/60 text-set' : build.status === 'pending' ? 'border-ember-400/60 text-ember-300' : 'border-parchment-300/25'}`}>
                  {build.status}{build.status === 'pending' && pending ? ` · ${serverBuildCountdown(pending.activatesAtUtc, clockMs)}` : ''}
                </span>
              </div>
              <p class="mt-2 text-xs text-parchment-300">
                {formatBytes(build.sizeBytes)} · uploaded {new Date(build.uploadedAtUtc).toLocaleString()}
              </p>
              {#if build.notes}<p class="mt-1 break-words text-sm text-parchment-200">{build.notes}</p>{/if}
              <p class="mt-1 font-mono text-[0.7rem] text-parchment-300">
                SHA-256 <span title={build.sha256}>{shortSha(build.sha256)}…</span>
                <button class="ml-1 underline decoration-dotted hover:text-parchment-50" type="button"
                        onclick={() => void copySha(build)}>copy</button>
              </p>
            </div>
            {#if build.status === 'available'}
              <div class="flex flex-wrap gap-2">
                <button class="rounded border border-set/50 px-3 py-2 text-sm text-set hover:bg-set/10 disabled:opacity-50"
                        type="button" disabled={busy} onclick={() => void activate(build, false)}>
                  {rollback ? 'Roll back' : 'Activate'} {bundleRelease ? `with r${bundleRelease.revision}` : '(5 min countdown)'}
                </button>
                <button class="rounded border border-parchment-300/35 px-3 py-2 text-sm text-parchment-100 hover:bg-parchment-300/10 disabled:opacity-50"
                        type="button" disabled={busy} onclick={() => void activate(build, true)}>
                  {rollback ? 'Roll back now' : 'Activate now'}
                </button>
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <p class="rounded border border-dashed border-parchment-300/25 p-4 text-sm text-parchment-300">No server builds have been uploaded for this ladder.</p>
      {/each}
    </div>
  {/if}
</div>
