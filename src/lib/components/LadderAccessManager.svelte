<script lang="ts">
  import {
    getLadderAccess,
    grantLadderAccess,
    revokeLadderAccess,
    searchAdminUsers,
    type AdminUser,
    type LadderAccessGrant
  } from '$lib/admin';
  import { ApiError } from '$lib/auth';

  let { ladderId, ladderName, isHidden }: { ladderId: string; ladderName: string; isHidden: boolean } = $props();

  let grants = $state<LadderAccessGrant[]>([]);
  let loading = $state(true);
  let busyUserId = $state<string | null>(null);
  let searchInput = $state('');
  let results = $state<AdminUser[]>([]);
  let searching = $state(false);
  let searched = $state(false);
  let error = $state('');
  let notice = $state('');
  let loadSequence = 0;

  let grantedIds = $derived(new Set(grants.map((grant) => grant.userId)));

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  async function load(id: string): Promise<void> {
    const sequence = ++loadSequence;
    loading = true;
    error = '';
    try {
      const loaded = await getLadderAccess(id);
      if (sequence === loadSequence) grants = loaded;
    } catch (value) {
      if (sequence === loadSequence) error = problemMessage(value);
    } finally {
      if (sequence === loadSequence) loading = false;
    }
  }

  $effect(() => {
    const id = ladderId;
    grants = [];
    results = [];
    searched = false;
    searchInput = '';
    notice = '';
    void load(id);
  });

  async function search(): Promise<void> {
    const query = searchInput.trim();
    if (!query || searching) return;
    searching = true;
    error = '';
    notice = '';
    try {
      results = (await searchAdminUsers({ search: query, count: 10 })).items;
      searched = true;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      searching = false;
    }
  }

  async function grant(user: AdminUser): Promise<void> {
    const id = ladderId;
    busyUserId = user.id;
    error = '';
    notice = '';
    try {
      const created = await grantLadderAccess(id, user.id);
      if (id !== ladderId) return;
      grants = [...grants.filter((entry) => entry.userId !== created.userId), created]
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      notice = `${created.displayName} can now see and play ${ladderName}.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busyUserId = null;
    }
  }

  async function revoke(entry: LadderAccessGrant): Promise<void> {
    if (!confirm(`Remove ${entry.displayName}'s access to ${ladderName}?`)) return;
    const id = ladderId;
    busyUserId = entry.userId;
    error = '';
    notice = '';
    try {
      await revokeLadderAccess(id, entry.userId);
      if (id !== ladderId) return;
      grants = grants.filter((item) => item.userId !== entry.userId);
      notice = `${entry.displayName} no longer has access to ${ladderName}.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      busyUserId = null;
    }
  }
</script>

<div>
  <p class="text-xs uppercase tracking-[0.18em] text-ember-400">Access</p>
  <h3 class="display-text mt-1 text-2xl">Invited players</h3>
  <p class="mt-2 max-w-3xl text-sm text-parchment-300">
    Everyone with the Tester role sees every hidden ladder. Invite other players here to give them access to
    <strong>{ladderName}</strong> only—its launcher entry, leaderboards, and trades—without access to any other hidden ladder.
    Changes apply on their next request.
  </p>
  {#if !isHidden}
    <p class="mt-3 rounded border border-ember-400/35 bg-ember-950/30 px-3 py-2 text-xs text-ember-200">
      This ladder is public, so everyone can already see it. Invitations take effect if you hide it.
    </p>
  {/if}

  {#if error}<p role="alert" class="mt-4 rounded border border-requirement/45 bg-requirement/10 p-3 text-sm text-requirement">{error}</p>{/if}
  {#if notice}<p class="mt-4 rounded border border-set/40 bg-set/10 p-3 text-sm text-set">{notice}</p>{/if}

  <div class="mt-5 grid gap-3">
    {#if loading}
      <p class="text-sm text-parchment-300">Loading invited players…</p>
    {:else}
      {#each grants as entry (entry.userId)}
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-parchment-300/20 bg-abyss-900 p-3">
          <div class="min-w-0">
            <span class="block break-all text-parchment-50">{entry.displayName}</span>
            <span class="text-xs text-parchment-300">{entry.email || 'Provider account'} · invited {new Date(entry.grantedAtUtc).toLocaleDateString()}</span>
          </div>
          <button class="rounded border border-requirement/45 px-3 py-2 text-sm text-requirement hover:bg-requirement/10 disabled:opacity-50"
                  type="button" disabled={busyUserId !== null} onclick={() => void revoke(entry)}>
            {busyUserId === entry.userId ? 'Removing…' : 'Remove'}
          </button>
        </div>
      {:else}
        <p class="rounded border border-dashed border-parchment-300/25 p-4 text-sm text-parchment-300">No players have been invited to this ladder.</p>
      {/each}
    {/if}
  </div>

  <form class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end" onsubmit={(event) => { event.preventDefault(); void search(); }}>
    <label class="min-w-0 flex-1">
      <span class="mb-1 block text-xs text-parchment-300">Find a player to invite</span>
      <input class="field" type="search" maxlength="100" placeholder="Display name, email, character, or user ID" bind:value={searchInput} />
    </label>
    <button class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" type="submit"
            disabled={searching || !searchInput.trim()}>{searching ? 'Searching…' : 'Search'}</button>
  </form>

  {#if searched}
    <div class="mt-3 grid gap-2">
      {#each results as user (user.id)}
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-parchment-300/15 p-3">
          <div class="min-w-0">
            <span class="block break-all text-parchment-50">{user.displayName}</span>
            <span class="text-xs text-parchment-300">{user.email || 'Provider account'}{user.roles.includes('Tester') ? ' · Tester (already sees all hidden ladders)' : ''}</span>
          </div>
          {#if grantedIds.has(user.id)}
            <span class="text-sm text-set">Invited</span>
          {:else}
            <button class="rounded border border-set/50 px-3 py-2 text-sm text-set hover:bg-set/10 disabled:opacity-50"
                    type="button" disabled={busyUserId !== null} onclick={() => void grant(user)}>
              {busyUserId === user.id ? 'Inviting…' : 'Invite'}
            </button>
          {/if}
        </div>
      {:else}
        <p class="text-sm text-parchment-300">No users match this search.</p>
      {/each}
    </div>
  {/if}
</div>
