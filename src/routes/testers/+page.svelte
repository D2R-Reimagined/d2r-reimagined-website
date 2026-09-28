<script lang="ts">
  import { onMount } from 'svelte';
  import { authState, initializeAuth } from '$lib/auth';
  import {
    canUseTesterSaves, getTesterLadders, testerSaveError, uploadTesterSave,
    type TesterLadder
  } from '$lib/tester-saves';

  let ladders = $state<TesterLadder[]>([]);
  let ladderId = $state('');
  let files = $state<FileList>();
  let loading = $state(true);
  let uploading = $state(false);
  let error = $state('');
  let success = $state('');
  let canUpload = $derived(canUseTesterSaves($authState.user?.roles));
  let selectedFile = $derived(files?.[0]);

  async function loadLadders() {
    loading = true;
    error = '';
    try {
      ladders = await getTesterLadders();
      if (!ladders.some(ladder => ladder.id === ladderId)) ladderId = ladders[0]?.id ?? '';
    } catch (cause) {
      ladders = [];
      ladderId = '';
      error = cause instanceof Error ? cause.message : 'Unable to load tester ladders.';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await initializeAuth();
    if (canUpload) await loadLadders();
    else loading = false;
  });

  async function upload(event: SubmitEvent) {
    event.preventDefault();
    if (uploading || !canUpload) return;
    success = '';
    error = testerSaveError(selectedFile) ?? '';
    if (error || !selectedFile || !ladderId) return;
    const ladder = ladders.find(entry => entry.id === ladderId);
    uploading = true;
    try {
      const result = await uploadTesterSave(ladderId, selectedFile);
      success = `${result.characterName || result.fileName} was added to ${ladder?.name ?? 'the tester ladder'}. Launch this ladder from the launcher to download your save.`;
      files = new DataTransfer().files;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'The save could not be uploaded. Please try again.';
    } finally {
      uploading = false;
    }
  }
</script>

<svelte:head>
  <title>Testers — D2R Reimagined</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<section class="mx-auto max-w-3xl px-5 py-10 sm:py-12">
  <p class="display-text text-sm uppercase tracking-[0.24em] text-ember-400">TESTERS</p>
  <h1 class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">Bring your own character</h1>
  <p class="mt-4 text-parchment-300">Upload a Reimagined character save to a hidden tester ladder to get straight to the content you want to test.</p>

  {#if !$authState.ready}
    <p class="panel mt-8 rounded-lg p-6 text-parchment-300">Checking tester access…</p>
  {:else if !canUpload}
    <div class="panel mt-8 rounded-lg p-6">
      <h2 class="display-text text-2xl text-parchment-50">Tester access required</h2>
      <p class="mt-2 text-parchment-300">This page is available to accounts with the Tester role.</p>
      {#if !$authState.user}<a href="/profile" class="mt-4 inline-block text-ember-400 underline">Sign in</a>{/if}
    </div>
  {:else}
    <div class="panel mt-8 rounded-lg p-6 sm:p-8">
      <h2 class="display-text text-2xl text-parchment-50">Add a server save</h2>
      <p class="mt-3 text-sm leading-6 text-parchment-300">Close the game before uploading. Choose a complete <strong>.d2s</strong> save made with compatible Reimagined data. Keep its original character name and file name. Existing server characters cannot be overwritten.</p>
      {#if loading}
        <p class="mt-6 text-parchment-300">Loading tester ladders…</p>
      {:else if ladders.length === 0}
        <p class="mt-6 text-parchment-300">No active hidden tester ladders are available. Uploads open when a tester ladder starts.</p>
        <button type="button" onclick={loadLadders} class="mt-4 rounded border border-parchment-300/30 px-4 py-2 hover:bg-white/5">Refresh ladders</button>
      {:else}
        <form onsubmit={upload} class="mt-6 grid gap-6">
          <label class="grid gap-2 text-parchment-200">
            Hidden tester ladder
            <select bind:value={ladderId} disabled={uploading} required class="w-full rounded border border-parchment-300/30 bg-abyss-950 px-3 py-3 text-parchment-50">
              {#each ladders as ladder}<option value={ladder.id}>{ladder.name}</option>{/each}
            </select>
          </label>
          <label class="grid gap-2 text-parchment-200">
            Character save
            <input type="file" accept=".d2s" bind:files disabled={uploading} required class="w-full min-w-0 rounded border border-parchment-300/30 bg-abyss-950 p-3 text-sm file:mr-3 file:rounded file:border-0 file:bg-ember-700/40 file:px-3 file:py-2 file:text-parchment-50" />
            <span class="text-xs text-parchment-300">One .d2s character, up to 1 MiB. Shared stashes and other save files are not supported.</span>
          </label>
          <button type="submit" disabled={uploading || !selectedFile || !ladderId} class="rounded border border-ember-400/60 bg-ember-700/30 px-5 py-3 text-parchment-50 transition hover:bg-ember-700/50 disabled:cursor-not-allowed disabled:opacity-50">
            {uploading ? 'Uploading save…' : 'Upload character'}
          </button>
        </form>
      {/if}
      {#if error}<p role="alert" class="mt-5 rounded border border-requirement/40 bg-requirement/10 p-4 text-requirement">{error}</p>{/if}
      {#if success}<p role="status" class="mt-5 rounded border border-set/40 bg-set/10 p-4 text-set">{success}</p>{/if}
    </div>
    <p class="mt-5 text-sm leading-6 text-parchment-300">After uploading, select the same ladder in the Reimagined launcher and launch the game. Server Saves will download your character automatically. Uploads belong to your account and the selected tester ladder.</p>
  {/if}
</section>
