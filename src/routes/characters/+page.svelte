<script lang="ts">
  import { onMount } from 'svelte';

  import { characterSkillTreeAllocations } from '$lib/character-directory';
  import {
    getCharacterDirectory,
    type CharacterDirectoryEntry
  } from '$lib/characters';
  import { i18n } from '$lib/i18n';
  import { loadSkillClasses } from '$lib/skills';
  import type { SkillClass } from '$lib/types';

  const pageSize = 24;

  let classes = $state<SkillClass[]>([]);
  let selectedClass = $state('');
  let entries = $state<CharacterDirectoryEntry[]>([]);
  let total = $state(0);
  let skip = $state(0);
  let loading = $state(true);
  let error = $state('');
  let requestSequence = 0;

  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

  onMount(async () => {
    try {
      classes = await loadSkillClasses();
      await loadDirectory(0);
    } catch (value) {
      error = value instanceof Error ? value.message : 'The character directory could not be loaded.';
      loading = false;
    }
  });

  async function loadDirectory(nextSkip: number): Promise<void> {
    const sequence = ++requestSequence;
    loading = true;
    error = '';

    try {
      const response = await getCharacterDirectory({
        skip: nextSkip,
        count: pageSize,
        characterClass: selectedClass || undefined
      });
      if (sequence !== requestSequence) return;
      entries = response.items;
      total = response.total;
      skip = response.skip;
    } catch (value) {
      if (sequence !== requestSequence) return;
      entries = [];
      total = 0;
      error = value instanceof Error ? value.message : 'The character directory could not be loaded.';
    } finally {
      if (sequence === requestSequence) loading = false;
    }
  }

  function chooseClass(characterClass: string): void {
    if (selectedClass === characterClass) return;
    selectedClass = characterClass;
    void loadDirectory(0);
  }

  function classDataFor(characterClass: string): SkillClass | undefined {
    return classes.find((entry) => entry.Class.toLowerCase() === characterClass.toLowerCase());
  }
</script>

<svelte:head>
  <title>Characters | D2R Reimagined</title>
  <meta name="description" content="Browse public D2R Reimagined characters by class, level, and skill-tree allocation." />
  <meta property="og:title" content="Characters | D2R Reimagined" />
  <meta property="og:description" content="Browse public D2R Reimagined characters by class, level, and skill-tree allocation." />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <h1 class="display-text mt-3 text-4xl text-parchment-50 sm:text-6xl">Characters</h1>
    <p class="mx-auto mt-4 max-w-3xl text-lg text-parchment-300">
      Explore tracked Reimagined characters and see their skill-tree focus at a glance.
    </p>
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
  <div class="class-tabs panel rounded-lg p-2" role="tablist" aria-label="Filter characters by class">
    <button
      type="button"
      role="tab"
      aria-selected={selectedClass === ''}
      class:active={selectedClass === ''}
      class="class-tab"
      onclick={() => chooseClass('')}
    >
      <span class="class-crest" aria-hidden="true">ALL</span>
      <span>All classes</span>
    </button>

    {#each classes as skillClass (skillClass.ClassCode)}
      <button
        type="button"
        role="tab"
        aria-selected={selectedClass === skillClass.Class}
        class:active={selectedClass === skillClass.Class}
        class="class-tab"
        onclick={() => chooseClass(skillClass.Class)}
      >
        <span class="class-crest" aria-hidden="true">{skillClass.ClassCode.toUpperCase()}</span>
        <span>{$i18n.t(skillClass.NameKey)}</span>
      </button>
    {/each}
  </div>

  <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-parchment-300/15 py-3 text-sm text-parchment-300">
    <p>
      {#if loading}
        Loading characters...
      {:else}
        <span class="text-parchment-50">{total}</span>
        {total === 1 ? 'character' : 'characters'}
        {selectedClass ? `playing ${selectedClass}` : 'across all classes'}
      {/if}
    </p>
    <p>Sorted by level, highest first</p>
  </div>

  {#if error}
    <div class="panel mt-6 rounded-lg p-8 text-center">
      <h2 class="display-text text-2xl text-parchment-50">Characters unavailable</h2>
      <p class="mt-3 text-red-200">{error}</p>
      <button type="button" class="retry-button mt-5" onclick={() => loadDirectory(skip)}>Try again</button>
    </div>
  {:else if loading && entries.length === 0}
    <div class="character-grid mt-6" aria-label="Loading characters">
      {#each Array(6) as _}
        <div class="panel h-52 animate-pulse rounded-lg bg-white/[0.025]"></div>
      {/each}
    </div>
  {:else if entries.length === 0}
    <div class="panel mt-6 rounded-lg p-10 text-center">
      <h2 class="display-text text-2xl text-parchment-50">No public characters found</h2>
      <p class="mt-3 text-parchment-300">
        {selectedClass ? `No ${selectedClass} characters have been shared yet.` : 'No characters have been shared yet.'}
      </p>
    </div>
  {:else}
    <div class:opacity-55={loading} class="character-grid mt-6 transition-opacity" aria-busy={loading}>
      {#each entries as entry (entry.character.id)}
        {@const classData = classDataFor(entry.character.class)}
        {@const trees = characterSkillTreeAllocations(entry, classes)}
        <a class="character-card panel scroll-card rounded-lg" href={`/characters/${entry.character.id}`}>
          <div class="flex items-start gap-4">
            <span class="character-crest" aria-hidden="true">{classData?.ClassCode.toUpperCase() ?? entry.character.class.slice(0, 3).toUpperCase()}</span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="min-w-0">
                  <h2 class="display-text truncate text-2xl text-parchment-50">{entry.character.name}</h2>
                  <p class="mt-1 text-sm text-parchment-300">
                    {$i18n.t(classData?.NameKey ?? entry.character.class)} &middot; {entry.character.ownerDisplayName}
                  </p>
                </div>
                <div class="level-block">
                  <span>Level</span>
                  <strong>{entry.character.level}</strong>
                </div>
              </div>

              {#if entry.character.isHardcore || entry.character.isLadder || entry.character.isDead}
                <div class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wider">
                  {#if entry.character.isHardcore}<span class="status-badge text-red-200">Hardcore</span>{/if}
                  {#if entry.character.isLadder}<span class="status-badge text-set">Ladder</span>{/if}
                  {#if entry.character.isDead}<span class="status-badge text-red-300">Fallen</span>{/if}
                </div>
              {/if}
            </div>
          </div>

          <div class="skill-summary mt-5" aria-label={`${entry.character.name} skill-tree allocation`}>
            {#each trees as tree (tree.page)}
              <div class="skill-total">
                <strong>{tree.points}</strong>
                <span>{$i18n.t(tree.nameKey)}</span>
              </div>
            {/each}
          </div>
        </a>
      {/each}
    </div>

    {#if pageCount > 1}
      <nav class="mt-8 flex items-center justify-center gap-4" aria-label="Character pages">
        <button type="button" class="page-button" disabled={loading || skip === 0} onclick={() => loadDirectory(Math.max(0, skip - pageSize))}>Previous</button>
        <span class="text-sm text-parchment-300">Page <span class="text-parchment-50">{currentPage}</span> of {pageCount}</span>
        <button type="button" class="page-button" disabled={loading || skip + pageSize >= total} onclick={() => loadDirectory(skip + pageSize)}>Next</button>
      </nav>
    {/if}
  {/if}
</section>

<style>
  .class-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .class-tab {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
    padding: 0.55rem 0.65rem;
    color: #bca77d;
    transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
  }

  .class-tab:hover { color: white; background: rgb(255 255 255 / 0.04); }
  .class-tab.active { border-color: #8f6d36; color: #f1dfb0; background: linear-gradient(#382119, #17110e); }

  .class-crest,
  .character-crest {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid #76613b;
    border-radius: 50%;
    background: #0b0a09;
    font-family: Arial, sans-serif;
    letter-spacing: 0.04em;
  }

  .class-crest { width: 2rem; height: 2rem; font-size: 0.55rem; }
  .character-crest { width: 3.5rem; height: 3.5rem; color: #f1dfb0; font-size: 0.7rem; }

  .character-grid { display: grid; gap: 1rem; }

  .character-card {
    display: block;
    padding: 1.25rem;
    transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
  }

  .character-card:hover {
    border-color: rgb(228 90 53 / 0.6);
    background: #191615;
    transform: translateY(-2px);
  }

  .level-block { display: grid; min-width: 3.8rem; text-align: right; }
  .level-block span { color: #bca77d; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; }
  .level-block strong { color: #f7f1e3; font-family: var(--font-display); font-size: 1.75rem; line-height: 1; }

  .status-badge {
    border: 1px solid rgb(188 167 125 / 0.22);
    border-radius: 999px;
    background: rgb(0 0 0 / 0.25);
    padding: 0.25rem 0.55rem;
  }

  .skill-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: hidden;
    border: 1px solid rgb(188 167 125 / 0.18);
    border-radius: 0.4rem;
    background: rgb(0 0 0 / 0.2);
  }

  .skill-total { min-width: 0; padding: 0.65rem 0.5rem; text-align: center; }
  .skill-total + .skill-total { border-left: 1px solid rgb(188 167 125 / 0.15); }
  .skill-total strong { display: block; color: #f1dfb0; font-family: var(--font-display); font-size: 1.35rem; }
  .skill-total span { display: block; overflow: hidden; color: #bca77d; font-size: 0.75rem; text-overflow: ellipsis; white-space: nowrap; }

  .page-button,
  .retry-button {
    border: 1px solid rgb(228 90 53 / 0.5);
    border-radius: 0.35rem;
    padding: 0.5rem 0.9rem;
    color: #f7f1e3;
  }

  .page-button:hover:not(:disabled), .retry-button:hover { background: rgb(123 29 24 / 0.45); }
  .page-button:disabled { cursor: not-allowed; opacity: 0.35; }

  @media (min-width: 640px) {
    .class-tabs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  @media (min-width: 768px) {
    .class-tabs { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .class-tab { flex-direction: column; }
    .character-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (min-width: 1024px) {
    .class-tabs { grid-template-columns: repeat(9, minmax(0, 1fr)); }
    .class-tab { padding-inline: 0.35rem; white-space: nowrap; }
  }

  @media (max-width: 440px) {
    .class-tab { font-size: 0.75rem; }
    .class-crest { display: none; }
    .skill-total span { font-size: 0.68rem; }
  }
</style>
