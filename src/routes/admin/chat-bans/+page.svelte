<script lang="ts">
  import { onMount } from 'svelte';

  import { searchChatBans, updateChatBan, type ChatBanUser } from '#lib/admin.js';
  import { ApiError, authState } from '#lib/auth.js';

  const pageSize = 25;

  let users = $state<ChatBanUser[]>([]);
  let total = $state(0);
  let skip = $state(0);
  let searchInput = $state('');
  let appliedSearch = $state('');
  let bannedOnly = $state(true);
  let loading = $state(true);
  let error = $state('');
  let notice = $state('');
  let editingUserId = $state<string | null>(null);
  let reason = $state('');
  let saving = $state(false);
  let requestSequence = 0;

  let isAdmin = $derived($authState.user?.roles.includes('Admin') ?? false);
  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  // Moderators handle players; banning staff is an admin's call (the API enforces this too).
  function lockedReason(user: ChatBanUser): string | null {
    if (user.id === $authState.user?.id) return 'Your account';
    if (!isAdmin && user.staffRoles.length > 0) return 'Staff · admins only';
    return null;
  }

  async function loadUsers(nextSkip = skip): Promise<void> {
    const sequence = ++requestSequence;
    loading = true;
    error = '';
    try {
      const response = await searchChatBans({ skip: nextSkip, count: pageSize, search: appliedSearch, bannedOnly });
      if (sequence !== requestSequence) return;
      users = response.items;
      total = response.total;
      skip = response.skip;
    } catch (value) {
      if (sequence !== requestSequence) return;
      error = problemMessage(value);
    } finally {
      if (sequence === requestSequence) loading = false;
    }
  }

  function submitSearch(): void {
    appliedSearch = searchInput.trim();
    notice = '';
    editingUserId = null;
    void loadUsers(0);
  }

  function startEditing(user: ChatBanUser): void {
    editingUserId = editingUserId === user.id ? null : user.id;
    reason = '';
    error = '';
  }

  async function save(user: ChatBanUser): Promise<void> {
    if (saving || !reason.trim()) return;
    const banned = !user.globalChatBanned;
    saving = true;
    error = '';
    notice = '';
    try {
      const updated = await updateChatBan(user.id, banned, reason.trim());
      users = users.map((entry) => entry.id === updated.id ? updated : entry);
      editingUserId = null;
      notice = banned
        ? `${updated.displayName} is banned from global chat.`
        : `${updated.displayName} can use global chat again.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      saving = false;
    }
  }

  onMount(() => { void loadUsers(0); });
</script>

<svelte:head>
  <title>Chat bans | Administration</title>
</svelte:head>

<div class="mb-6">
  <h2 class="display-text mt-1 text-3xl text-parchment-50">Global chat bans</h2>
  <p class="mt-2 text-parchment-300">A ban stops a player sending to global chat, in game and on the website, until it is lifted. They can still read global chat and whisper friends. Search by display name, character name, or user ID.</p>
</div>

{#if error}<div role="alert" class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
{#if notice}<div role="status" class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

<form class="panel mb-5 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end" onsubmit={(event) => { event.preventDefault(); submitSearch(); }}>
  <label class="min-w-0 flex-1 text-sm text-parchment-300">
    Search players
    <input
      class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50 placeholder:text-parchment-300/60"
      type="search"
      maxlength="100"
      placeholder="Display name, character, or user ID"
      bind:value={searchInput}
    />
  </label>
  <label class="flex items-center gap-2 py-2 text-sm text-parchment-300">
    <input type="checkbox" bind:checked={bannedOnly} onchange={submitSearch} /> Banned players only
  </label>
  <button class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" type="submit" disabled={loading}>Search</button>
</form>

{#if loading && users.length === 0}
  <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading players…</div>
{:else}
  <section class:opacity-60={loading} class="panel rounded-lg p-5 transition-opacity sm:p-7" aria-busy={loading}>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-parchment-300">
      <p><span class="text-parchment-50">{total}</span> {bannedOnly ? 'banned ' : ''}{total === 1 ? 'player' : 'players'}{appliedSearch ? ` matching “${appliedSearch}”` : ''}</p>
      {#if total > 0}<p>Page {currentPage} of {pageCount}</p>{/if}
    </div>
    <ul class="divide-y divide-parchment-300/10">
      {#each users as user (user.id)}
        <li class="py-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-parchment-50">
                {user.displayName}
                {#each user.staffRoles as role}<span class="ml-2 rounded-full border border-parchment-300/30 px-2 text-xs text-parchment-300">{role}</span>{/each}
              </p>
              <p class={`mt-1 text-sm ${user.globalChatBanned ? 'text-requirement' : 'text-parchment-300'}`}>{user.globalChatBanned ? 'Banned from global chat' : 'Can use global chat'}</p>
              {#if user.updatedAtUtc}
                <p class="mt-1 break-words text-xs text-parchment-300">
                  {user.globalChatBanned ? 'Banned' : 'Lifted'} {new Date(user.updatedAtUtc).toLocaleString()}{user.updatedByDisplayName ? ` by ${user.updatedByDisplayName}` : ''}: {user.reason}
                </p>
              {/if}
            </div>
            {#if lockedReason(user)}
              <span class="text-xs text-parchment-300">{lockedReason(user)}</span>
            {:else}
              <button type="button" disabled={saving || loading} onclick={() => startEditing(user)}
                class={`rounded border px-3 py-1.5 text-sm disabled:opacity-50 ${user.globalChatBanned ? 'border-parchment-300/30 text-parchment-50' : 'border-requirement/60 text-requirement'}`}>
                {user.globalChatBanned ? 'Lift ban' : 'Ban from chat'}
              </button>
            {/if}
          </div>
          {#if editingUserId === user.id}
            <form class="mt-3 rounded border border-parchment-300/20 bg-black/30 p-4" onsubmit={(event) => { event.preventDefault(); void save(user); }}>
              <fieldset disabled={saving} class="space-y-3">
                <label class="block text-sm text-parchment-300">Reason (staff only)
                  <textarea required maxlength="1000" rows="2" bind:value={reason}
                    class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50"></textarea>
                </label>
                <div class="flex gap-3">
                  <button type="submit" disabled={!reason.trim()} class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50">
                    {saving ? 'Saving…' : user.globalChatBanned ? `Lift ${user.displayName}'s ban` : `Ban ${user.displayName}`}
                  </button>
                  <button type="button" onclick={() => { editingUserId = null; }} class="rounded border border-parchment-300/30 px-4 py-2 text-parchment-300">Cancel</button>
                </div>
              </fieldset>
            </form>
          {/if}
        </li>
      {:else}
        <li class="py-8 text-center text-parchment-300">{bannedOnly ? 'No players are banned from global chat.' : appliedSearch ? 'No players match this search.' : 'No players found.'}</li>
      {/each}
    </ul>
    {#if pageCount > 1}
      <nav class="mt-5 flex items-center justify-center gap-4 border-t border-parchment-300/15 pt-5" aria-label="Player pages">
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip === 0} onclick={() => void loadUsers(Math.max(0, skip - pageSize))}>Previous</button>
        <span class="text-sm text-parchment-300">Page <span class="text-parchment-50">{currentPage}</span> of {pageCount}</span>
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip + pageSize >= total} onclick={() => void loadUsers(skip + pageSize)}>Next</button>
      </nav>
    {/if}
  </section>
{/if}
