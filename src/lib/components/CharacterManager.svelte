<script lang="ts">
  import { onMount } from 'svelte';

  import { ApiError } from '$lib/auth';
  import { sameCharacterName, validateCharacterSave } from '$lib/character-save';
  import {
    createCharacter,
    deleteCharacter,
    getMyCharacters,
    parseCharacterSave,
    updateCharacter,
    type CharacterResponse
  } from '$lib/characters';

  interface OverwriteCandidate {
    character: CharacterResponse;
    file: File;
  }

  let characters = $state<CharacterResponse[]>([]);
  let loading = $state(true);
  let workingId = $state<string | null>(null);
  let selectedFile = $state<File | null>(null);
  let uploadPublicly = $state(true);
  let overwriteCandidate = $state<OverwriteCandidate | null>(null);
  let deleteCandidateId = $state<string | null>(null);
  let operationError = $state('');
  let notice = $state('');
  let uploadInput: HTMLInputElement | undefined = $state();

  let busy = $derived(workingId !== null);

  function message(value: unknown): string {
    return value instanceof Error ? value.message : 'Something went wrong. Please try again.';
  }

  function sortCharacters(values: CharacterResponse[]): CharacterResponse[] {
    return [...values].sort((left, right) => left.name.localeCompare(right.name));
  }

  function replaceCharacter(updated: CharacterResponse): void {
    characters = sortCharacters(
      characters.some((character) => character.id === updated.id)
        ? characters.map((character) => character.id === updated.id ? updated : character)
        : [...characters, updated]
    );
  }

  function resetUpload(): void {
    selectedFile = null;
    overwriteCandidate = null;
    if (uploadInput) uploadInput.value = '';
  }

  async function loadCharacters(showLoading = true): Promise<void> {
    if (showLoading) loading = true;
    try {
      characters = sortCharacters(await getMyCharacters());
    } finally {
      if (showLoading) loading = false;
    }
  }

  async function uploadSave(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!selectedFile || busy) return;

    operationError = '';
    notice = '';
    overwriteCandidate = null;
    workingId = 'upload';

    try {
      validateCharacterSave(selectedFile);
      const parsed = await parseCharacterSave(selectedFile);
      const existing = characters.find((character) =>
        sameCharacterName(character.name, parsed.character.name)
      );

      if (existing) {
        overwriteCandidate = { character: existing, file: selectedFile };
        return;
      }

      try {
        const created = await createCharacter(selectedFile, uploadPublicly);
        replaceCharacter(created);
        notice = `${created.name} is now tracked on your profile.`;
        resetUpload();
      } catch (value) {
        if (value instanceof ApiError && value.status === 409) {
          await loadCharacters(false);
          const conflicted = characters.find((character) =>
            sameCharacterName(character.name, parsed.character.name)
          );
          if (conflicted) {
            overwriteCandidate = { character: conflicted, file: selectedFile };
            return;
          }
        }
        throw value;
      }
    } catch (value) {
      operationError = message(value);
    } finally {
      workingId = null;
    }
  }

  async function confirmOverwrite(): Promise<void> {
    if (!overwriteCandidate || busy) return;
    const candidate = overwriteCandidate;
    operationError = '';
    notice = '';
    workingId = candidate.character.id;

    try {
      const updated = await updateCharacter(
        candidate.character.id,
        candidate.file,
        uploadPublicly
      );
      replaceCharacter(updated);
      notice = `${updated.name} was updated from the newer save.`;
      resetUpload();
    } catch (value) {
      operationError = message(value);
    } finally {
      workingId = null;
    }
  }

  async function updateSave(character: CharacterResponse, event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || busy) return;

    operationError = '';
    notice = '';
    workingId = character.id;

    try {
      validateCharacterSave(file);
      const parsed = await parseCharacterSave(file);
      if (!sameCharacterName(character.name, parsed.character.name)) {
        throw new Error(
          `That save belongs to ${parsed.character.name}. Choose a save for ${character.name}.`
        );
      }

      const updated = await updateCharacter(character.id, file);
      replaceCharacter(updated);
      notice = `${updated.name} was updated.`;
    } catch (value) {
      operationError = message(value);
    } finally {
      workingId = null;
    }
  }

  async function confirmDelete(character: CharacterResponse): Promise<void> {
    if (busy) return;
    operationError = '';
    notice = '';
    workingId = character.id;

    try {
      await deleteCharacter(character.id);
      characters = characters.filter((item) => item.id !== character.id);
      deleteCandidateId = null;
      notice = `${character.name} was removed from your profile.`;
    } catch (value) {
      operationError = message(value);
    } finally {
      workingId = null;
    }
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat().format(value);
  }

  function formatDate(value: string | null): string {
    if (!value) return 'Unknown';
    return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  onMount(async () => {
    try {
      await loadCharacters();
    } catch (value) {
      operationError = message(value);
      loading = false;
    }
  });
</script>

<section class="mt-6 panel rounded-lg p-6 sm:p-8" aria-labelledby="tracked-characters-heading">
  <div class="flex flex-col gap-4 border-b border-parchment-300/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-ember-400">Character saves</p>
      <h2 id="tracked-characters-heading" class="display-text mt-2 text-2xl text-parchment-50 sm:text-3xl">
        Tracked characters
      </h2>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-parchment-300">
        Upload a Reimagined .d2s save to add it to your profile and keep its leaderboard details current.
      </p>
    </div>
    {#if !loading}
      <p class="text-sm text-parchment-300">
        {characters.length} {characters.length === 1 ? 'character' : 'characters'}
      </p>
    {/if}
  </div>

  {#if operationError}
    <div role="alert" class="mt-5 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
      {operationError}
    </div>
  {/if}
  {#if notice}
    <div role="status" class="mt-5 rounded border border-set/35 bg-green-950/35 px-4 py-3 text-green-200">
      {notice}
    </div>
  {/if}

  <form class="mt-6 rounded border border-parchment-300/20 bg-black/20 p-4 sm:p-5" onsubmit={uploadSave}>
    <label for="character-save" class="mb-2 block text-sm font-semibold text-parchment-100">
      Character save
    </label>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
      <input
        bind:this={uploadInput}
        id="character-save"
        type="file"
        accept=".d2s,application/octet-stream"
        required
        disabled={busy}
        onchange={(event) => selectedFile = event.currentTarget.files?.[0] ?? null}
        class="block w-full rounded border border-parchment-300/30 bg-black/35 p-1.5 text-sm text-parchment-200 file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-parchment-300/25 file:bg-ember-800/35 file:px-4 file:py-2.5 file:text-parchment-50 hover:file:bg-ember-700/45 disabled:cursor-wait disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={busy || !selectedFile}
        class="rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60 lg:h-full"
      >
        {workingId === 'upload' ? 'Reading save…' : 'Upload character'}
      </button>
    </div>

    <p class="mt-2 text-xs text-parchment-300">Reimagined .d2s files up to 4 MiB. The save itself determines the character name and stats.</p>

    <label class="mt-4 flex w-fit items-center gap-3 text-sm text-parchment-200">
      <input type="checkbox" bind:checked={uploadPublicly} disabled={busy} class="h-4 w-4 rounded border-parchment-300/40 bg-black/40 text-ember-500" />
      Show this character publicly and on applicable leaderboards
    </label>
  </form>

  {#if overwriteCandidate}
    <div role="alertdialog" aria-labelledby="overwrite-character-heading" class="mt-5 rounded border border-ember-400/45 bg-ember-950/35 p-5">
      <h3 id="overwrite-character-heading" class="font-semibold text-parchment-50">
        Overwrite {overwriteCandidate.character.name}?
      </h3>
      <p class="mt-2 text-sm leading-6 text-parchment-200">
        A character with this name is already on your profile. Update it using the selected save, or cancel and keep the existing character unchanged.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onclick={confirmOverwrite} class="rounded bg-ember-500 px-4 py-2 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
          {workingId === overwriteCandidate.character.id ? 'Updating…' : 'Overwrite character'}
        </button>
        <button type="button" disabled={busy} onclick={resetUpload} class="rounded border border-parchment-300/35 px-4 py-2 text-parchment-200 transition hover:border-parchment-200/60 hover:bg-white/5 hover:text-white disabled:opacity-60">
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <div class="mt-7">
    {#if loading}
      <div class="rounded border border-parchment-300/15 px-5 py-8 text-center text-parchment-300">
        Loading your characters…
      </div>
    {:else if characters.length === 0}
      <div class="rounded border border-dashed border-parchment-300/25 px-5 py-10 text-center">
        <p class="font-semibold text-parchment-100">No tracked characters yet</p>
        <p class="mt-2 text-sm text-parchment-300">Upload your first Reimagined save above.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each characters as character (character.id)}
          <article class="rounded border border-parchment-300/20 bg-black/20 p-4 sm:p-5">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="display-text truncate text-xl text-parchment-50">{character.name}</h3>
                  {#if character.isHardcore}
                    <span class="rounded border border-red-500/45 bg-red-950/45 px-2 py-0.5 text-xs text-red-200">Hardcore</span>
                  {/if}
                  {#if character.isDead}
                    <span class="rounded border border-parchment-300/35 bg-black/40 px-2 py-0.5 text-xs text-parchment-300">Dead</span>
                  {/if}
                  <span class={`rounded border px-2 py-0.5 text-xs ${character.isPublic ? 'border-set/35 bg-green-950/25 text-green-200' : 'border-parchment-300/30 bg-black/30 text-parchment-300'}`}>
                    {character.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <dl class="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt class="text-xs uppercase tracking-wider text-parchment-300">Class</dt>
                    <dd class="mt-1 text-parchment-50">{character.class}</dd>
                  </div>
                  <div>
                    <dt class="text-xs uppercase tracking-wider text-parchment-300">Level</dt>
                    <dd class="mt-1 text-parchment-50">{character.level}</dd>
                  </div>
                  <div>
                    <dt class="text-xs uppercase tracking-wider text-parchment-300">Experience</dt>
                    <dd class="mt-1 text-parchment-50">{formatNumber(character.experience)}</dd>
                  </div>
                  <div>
                    <dt class="text-xs uppercase tracking-wider text-parchment-300">Mode</dt>
                    <dd class="mt-1 text-parchment-50">{character.ladderName || (character.isLadder ? 'Ladder' : 'Standard')}</dd>
                  </div>
                </dl>

                <p class="mt-3 text-xs text-parchment-300">
                  Last played {formatDate(character.lastPlayedAtUtc)} · Synced {formatDate(character.lastTrackedAtUtc)}
                </p>
              </div>

              <div class="flex shrink-0 flex-wrap gap-3">
                <a
                  href={`/characters/${character.id}`}
                  class="rounded border border-parchment-300/35 px-4 py-2 text-sm text-parchment-100 transition hover:border-parchment-200/60 hover:bg-white/5 hover:text-white"
                >
                  View character
                </a>
                <label class={`cursor-pointer rounded border border-ember-400/50 bg-ember-700/20 px-4 py-2 text-sm text-parchment-50 transition hover:bg-ember-700/35 ${busy ? 'pointer-events-none opacity-60' : ''}`}>
                  {workingId === character.id && deleteCandidateId !== character.id ? 'Updating…' : 'Update save'}
                  <input
                    class="sr-only"
                    type="file"
                    accept=".d2s,application/octet-stream"
                    disabled={busy}
                    onchange={(event) => updateSave(character, event)}
                  />
                </label>
                <button
                  type="button"
                  disabled={busy}
                  onclick={() => deleteCandidateId = character.id}
                  class="rounded border border-red-500/35 px-4 py-2 text-sm text-red-200 transition hover:bg-red-950/40 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>

            {#if deleteCandidateId === character.id}
              <div class="mt-4 flex flex-col gap-3 border-t border-red-500/25 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm text-red-200">Remove {character.name} from your profile? This cannot be undone.</p>
                <div class="flex gap-3">
                  <button type="button" disabled={busy} onclick={() => confirmDelete(character)} class="rounded bg-red-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">
                    {workingId === character.id ? 'Deleting…' : 'Confirm delete'}
                  </button>
                  <button type="button" disabled={busy} onclick={() => deleteCandidateId = null} class="rounded border border-parchment-300/35 px-4 py-2 text-sm text-parchment-200 transition hover:bg-white/5 disabled:opacity-60">
                    Cancel
                  </button>
                </div>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>
