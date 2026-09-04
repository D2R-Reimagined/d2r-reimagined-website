<script lang="ts">
  import { authState } from '$lib/auth';
  import OnlinePlayers from '$lib/components/OnlinePlayers.svelte';
  import { debounced } from '$lib/debounce.svelte';
  import { isLadderRunning } from '$lib/ladder-schedule';
  import {
    entryStanding,
    formatExperience,
    getLeaderboard,
    getMyLeaderboardEntries,
    type LeaderboardEntry,
    type LeaderboardResponse
  } from '$lib/leaderboards';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const pageSize = 25;
  const classes = [
    'Amazon',
    'Assassin',
    'Barbarian',
    'Druid',
    'Necromancer',
    'Paladin',
    'Sorceress',
    'Warlock'
  ];

  // The server render is what is on screen until a client fetch replaces it, so
  // the board is derived from whichever is current rather than copied out of
  // `data` once. Copying would freeze the page at its first render and quietly
  // ignore a later navigation to a different ladder.
  let clientBoard = $state<LeaderboardResponse | null>(null);
  let clientError = $state<string | null>(null);
  let loading = $state(false);

  let entries = $derived(clientBoard?.items ?? data.board?.items ?? []);
  let total = $derived(clientBoard?.total ?? data.board?.total ?? 0);
  let skip = $derived(clientBoard?.skip ?? 0);
  let error = $derived(clientError ?? (clientBoard ? null : data.error));

  // Undefined means "whatever the server chose"; picking a ladder takes over.
  let ladderChoice = $state<string | null | undefined>(undefined);
  let ladderId = $derived(ladderChoice === undefined ? data.selectedLadderId : ladderChoice);

  let selectedClass = $state('');
  let hardcoreOnly = $state(false);
  let search = $state('');
  const searchTerm = debounced(() => search);

  let myEntries = $state<LeaderboardEntry[]>([]);
  let myBoardSize = $state(0);

  let requestSequence = 0;
  let hydrated = false;

  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));
  let selectedLadder = $derived(data.ladders.find((ladder) => ladder.id === ladderId) ?? null);
  let bestRank = $derived(
    myEntries.length === 0 ? null : Math.min(...myEntries.map((entry) => entry.rank))
  );

  function filters() {
    return {
      ladderId,
      characterClass: selectedClass || undefined,
      isHardcore: hardcoreOnly ? true : undefined,
      search: searchTerm.current || undefined
    };
  }

  // Every filter is a dependency, so changing any of them reloads from page one.
  // The server already rendered the first page, so the initial run only fetches
  // the caller's own standing rather than refetching what is already on screen.
  $effect(() => {
    void ladderId;
    void selectedClass;
    void hardcoreOnly;
    void searchTerm.current;

    if (!hydrated) {
      hydrated = true;
      void loadMine();
      return;
    }

    void load(0);
    void loadMine();
  });

  async function load(nextSkip: number): Promise<void> {
    const sequence = ++requestSequence;
    loading = true;
    clientError = null;

    try {
      const response = await getLeaderboard({ ...filters(), skip: nextSkip, count: pageSize });
      if (sequence !== requestSequence) return;
      clientBoard = response;
    } catch (value) {
      if (sequence !== requestSequence) return;
      clientBoard = { items: [], total: 0, skip: nextSkip, count: pageSize };
      clientError = value instanceof Error ? value.message : 'The leaderboard could not be loaded.';
    } finally {
      if (sequence === requestSequence) loading = false;
    }
  }

  async function loadMine(): Promise<void> {
    if (!$authState.user) {
      myEntries = [];
      myBoardSize = 0;
      return;
    }

    try {
      // Deliberately unfiltered except for the ladder: a player wants their place
      // on the board itself, not their place among whatever they filtered to.
      const response = await getMyLeaderboardEntries({ ladderId, count: pageSize });
      myEntries = response.entries;
      myBoardSize = response.total;
    } catch {
      // A missing personal rank is not worth failing the page over.
      myEntries = [];
      myBoardSize = 0;
    }
  }

  function chooseLadder(next: string | null): void {
    if (ladderId === next) return;
    ladderChoice = next;

    // Keeps a shared link pointing at the board being looked at.
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('ladderId', next);
    else url.searchParams.delete('ladderId');
    history.replaceState(history.state, '', url);
  }

  function standingLabel(entry: LeaderboardEntry): string {
    const standing = entryStanding(entry);
    if (standing === 'dead') return 'Fallen';
    return standing === 'removed' ? 'Retired' : '';
  }

  function formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Leaderboard | D2R Reimagined</title>
  <meta
    name="description"
    content="Ladder standings for D2R Reimagined - the top characters by level and experience, updated as players save."
  />
  <meta property="og:title" content="Leaderboard | D2R Reimagined" />
  <meta
    property="og:description"
    content="Ladder standings for D2R Reimagined - the top characters by level and experience, updated as players save."
  />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <h1 class="display-text mt-3 text-4xl text-parchment-50 sm:text-6xl">Leaderboard</h1>
    <p class="mx-auto mt-4 max-w-3xl text-lg text-parchment-300">
      {#if selectedLadder}
        Standings for {selectedLadder.name}, ranked by level and then experience.
      {:else}
        Standard standings, ranked by level and then experience.
      {/if}
    </p>
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
  <div class="panel rounded-lg p-3">
    <div class="ladder-tabs" role="tablist" aria-label="Choose a ladder">
      <button
        type="button"
        role="tab"
        aria-selected={ladderId === null}
        class:active={ladderId === null}
        class="ladder-tab"
        onclick={() => chooseLadder(null)}
      >
        Standard
      </button>
      {#each data.ladders as ladder (ladder.id)}
        <button
          type="button"
          role="tab"
          aria-selected={ladderId === ladder.id}
          class:active={ladderId === ladder.id}
          class="ladder-tab"
          onclick={() => chooseLadder(ladder.id)}
        >
          {ladder.name}
          {#if isLadderRunning(ladder)}<span class="live-dot" aria-label="Currently running"></span>{/if}
        </button>
      {/each}
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-3 border-t border-parchment-300/15 pt-3">
      <label class="sr-only" for="leaderboard-class">Class</label>
      <select id="leaderboard-class" class="control" bind:value={selectedClass}>
        <option value="">All classes</option>
        {#each classes as characterClass (characterClass)}
          <option value={characterClass}>{characterClass}</option>
        {/each}
      </select>

      <label class="control flex items-center gap-2">
        <input type="checkbox" class="checkbox" bind:checked={hardcoreOnly} />
        Hardcore only
      </label>

      <label class="sr-only" for="leaderboard-search">Search</label>
      <input
        id="leaderboard-search"
        class="control flex-1"
        type="search"
        placeholder="Search character or player"
        bind:value={search}
      />
    </div>
  </div>

  {#if $authState.user && myEntries.length > 0}
    <div class="panel mt-6 rounded-lg p-4">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="display-text text-xl text-parchment-50">Your standing</h2>
        {#if bestRank !== null}
          <p class="text-sm text-parchment-300">
            Best rank <span class="text-parchment-50">#{bestRank}</span> of {myBoardSize}
          </p>
        {/if}
      </div>
      <ul class="mt-3 grid gap-2">
        {#each myEntries as entry (entry.characterId)}
          <li>
            <a class="mine-row" href={`/characters/${entry.characterId}`}>
              <span class="rank">#{entry.rank}</span>
              <span class="min-w-0 flex-1 truncate text-parchment-50">{entry.characterName}</span>
              <span class="text-parchment-300">{entry.class}</span>
              <span class="text-parchment-50">Lv {entry.level}</span>
              {#if standingLabel(entry)}
                <span class="status-badge text-red-200">{standingLabel(entry)}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <div
    class="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-parchment-300/15 py-3 text-sm text-parchment-300"
  >
    <p>
      {#if loading}
        Loading standings...
      {:else}
        <span class="text-parchment-50">{total}</span>
        {total === 1 ? 'character' : 'characters'} ranked
      {/if}
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <OnlinePlayers />
      {#if ladderId}
        <p>Tracked automatically from ladder saves</p>
      {:else}
        <p>Sorted by level, highest first</p>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="panel mt-6 rounded-lg p-8 text-center">
      <h2 class="display-text text-2xl text-parchment-50">Leaderboard unavailable</h2>
      <p class="mt-3 text-red-200">{error}</p>
      <button type="button" class="page-button mt-5" onclick={() => load(skip)}>Try again</button>
    </div>
  {:else if entries.length === 0}
    <div class="panel mt-6 rounded-lg p-10 text-center">
      <h2 class="display-text text-2xl text-parchment-50">No characters ranked yet</h2>
      <p class="mt-3 text-parchment-300">
        {#if ladderId}
          Characters appear here automatically once players save on this ladder.
        {:else}
          No public characters have been shared yet.
        {/if}
      </p>
    </div>
  {:else}
    <div class="table-scroll mt-6" class:opacity-55={loading} aria-busy={loading}>
      <table class="board">
        <caption class="sr-only">
          {selectedLadder ? `${selectedLadder.name} standings` : 'Standard standings'}
        </caption>
        <thead>
          <tr>
            <th scope="col" class="numeric">Rank</th>
            <th scope="col">Character</th>
            <th scope="col">Class</th>
            <th scope="col" class="numeric">Level</th>
            <th scope="col" class="numeric">Experience</th>
            <th scope="col">Player</th>
            <th scope="col">Last played</th>
          </tr>
        </thead>
        <tbody>
          {#each entries as entry (entry.characterId)}
            <tr class:is-you={$authState.user?.id === entry.userId}>
              <td class="numeric rank">{entry.rank}</td>
              <td>
                <a class="character-link" href={`/characters/${entry.characterId}`}>
                  {entry.characterName}
                </a>
                <span class="badges">
                  {#if entry.isHardcore}<span class="status-badge text-red-200">HC</span>{/if}
                  {#if standingLabel(entry)}
                    <span class="status-badge text-red-300">{standingLabel(entry)}</span>
                  {/if}
                </span>
              </td>
              <td class="text-parchment-300">{entry.class}</td>
              <td class="numeric text-parchment-50">{entry.level}</td>
              <td class="numeric text-parchment-300">{formatExperience(entry.experience)}</td>
              <td class="truncate text-parchment-300">{entry.ownerDisplayName}</td>
              <td class="text-parchment-300">{formatDate(entry.lastPlayedAtUtc)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if pageCount > 1}
      <nav class="mt-8 flex items-center justify-center gap-4" aria-label="Leaderboard pages">
        <button
          type="button"
          class="page-button"
          disabled={loading || skip === 0}
          onclick={() => load(Math.max(0, skip - pageSize))}
        >
          Previous
        </button>
        <span class="text-sm text-parchment-300">
          Page <span class="text-parchment-50">{currentPage}</span> of {pageCount}
        </span>
        <button
          type="button"
          class="page-button"
          disabled={loading || skip + pageSize >= total}
          onclick={() => load(skip + pageSize)}
        >
          Next
        </button>
      </nav>
    {/if}
  {/if}
</section>

<style>
  .ladder-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .ladder-tab {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
    padding: 0.5rem 0.85rem;
    color: #bca77d;
    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease;
  }

  .ladder-tab:hover {
    color: white;
    background: rgb(255 255 255 / 0.04);
  }

  .ladder-tab.active {
    border-color: #8f6d36;
    color: #f1dfb0;
    background: linear-gradient(#382119, #17110e);
  }

  .live-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: #6fcf6f;
  }

  .control {
    border: 1px solid rgb(188 167 125 / 0.25);
    border-radius: 0.35rem;
    background: rgb(0 0 0 / 0.25);
    padding: 0.45rem 0.65rem;
    color: #f1dfb0;
    font-size: 0.9rem;
  }

  .table-scroll {
    overflow-x: auto;
    border: 1px solid rgb(188 167 125 / 0.18);
    border-radius: 0.5rem;
    transition: opacity 140ms ease;
  }

  .board {
    width: 100%;
    min-width: 44rem;
    border-collapse: collapse;
    font-size: 0.92rem;
  }

  .board th {
    position: sticky;
    top: 0;
    background: #17110e;
    padding: 0.7rem 0.85rem;
    color: #bca77d;
    font-size: 0.72rem;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .board td {
    border-top: 1px solid rgb(188 167 125 / 0.12);
    padding: 0.7rem 0.85rem;
    vertical-align: middle;
  }

  .board tbody tr:hover {
    background: rgb(255 255 255 / 0.03);
  }

  .board tbody tr.is-you {
    background: rgb(228 90 53 / 0.1);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .rank {
    color: #f1dfb0;
    font-family: var(--font-display);
    font-size: 1.05rem;
  }

  .character-link {
    color: #f7f1e3;
  }

  .character-link:hover {
    color: #e45a35;
  }

  .badges {
    display: inline-flex;
    gap: 0.3rem;
    margin-left: 0.45rem;
  }

  .status-badge {
    border: 1px solid rgb(188 167 125 / 0.22);
    border-radius: 999px;
    background: rgb(0 0 0 / 0.25);
    padding: 0.15rem 0.45rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .mine-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid rgb(188 167 125 / 0.18);
    border-radius: 0.4rem;
    background: rgb(0 0 0 / 0.2);
    padding: 0.55rem 0.75rem;
    font-size: 0.9rem;
  }

  .mine-row:hover {
    border-color: rgb(228 90 53 / 0.6);
  }

  .mine-row .rank {
    min-width: 3rem;
  }

  .page-button {
    border: 1px solid rgb(228 90 53 / 0.5);
    border-radius: 0.35rem;
    padding: 0.5rem 0.9rem;
    color: #f7f1e3;
  }

  .page-button:hover:not(:disabled) {
    background: rgb(123 29 24 / 0.45);
  }

  .page-button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
</style>
