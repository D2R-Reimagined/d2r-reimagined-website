<script lang="ts">
  import { onMount } from 'svelte';

  import {
    getLadders,
    grantLadderAccess,
    revokeLadderAccess,
    searchAdminUsers,
    updateUserRoles,
    type AdminUser,
    type Ladder,
    type LadderAccessGrant
  } from '$lib/admin';
  import { ApiError, authState } from '$lib/auth';
  import ParticipationEditor from '$lib/components/ParticipationEditor.svelte';
  import RoleToggle from '$lib/components/RoleToggle.svelte';

  const pageSize = 25;

  let users = $state<AdminUser[]>([]);
  let total = $state(0);
  let skip = $state(0);
  let searchInput = $state('');
  let appliedSearch = $state('');
  let loading = $state(true);
  let roleSavingId = $state<string | null>(null);
  let error = $state('');
  let notice = $state('');
  let editingUserId = $state<string | null>(null);
  let hiddenLadders = $state<Ladder[]>([]);
  let accessSavingId = $state<string | null>(null);
  let requestSequence = 0;

  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error
      ? value.message
      : 'An unexpected error occurred.';
  }

  async function loadUsers(nextSkip = skip, search = appliedSearch): Promise<void> {
    const sequence = ++requestSequence;
    loading = true;
    error = '';
    try {
      const response = await searchAdminUsers({ skip: nextSkip, count: pageSize, search });
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
    void loadUsers(0, appliedSearch);
  }

  function clearSearch(): void {
    searchInput = '';
    appliedSearch = '';
    notice = '';
    void loadUsers(0, '');
  }

  async function toggleRole(user: AdminUser, role: string, enabled: boolean): Promise<void> {
    const roles = enabled
      ? [...new Set([...user.roles, role])]
      : user.roles.filter((existingRole) => existingRole !== role);
    roleSavingId = user.id;
    error = '';
    notice = '';
    try {
      const updated = await updateUserRoles(user.id, roles);
      users = users.map((entry) => entry.id === updated.id ? updated : entry);
      notice = `${updated.displayName}'s roles were updated and take effect immediately.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      roleSavingId = null;
    }
  }

  async function loadHiddenLadders(): Promise<void> {
    try {
      hiddenLadders = (await getLadders())
        .filter((ladder) => ladder.isHidden && !ladder.archivedAtUtc)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (value) {
      error = problemMessage(value);
    }
  }

  function setLadderAccess(userId: string, access: LadderAccessGrant[]): void {
    users = users.map((entry) => entry.id === userId ? { ...entry, ladderAccess: access } : entry);
  }

  async function addLadderAccess(user: AdminUser, ladderId: string): Promise<void> {
    if (!ladderId) return;
    accessSavingId = user.id;
    error = '';
    notice = '';
    try {
      const created = await grantLadderAccess(ladderId, user.id);
      setLadderAccess(user.id, [...user.ladderAccess.filter((grant) => grant.ladderId !== ladderId), created]
        .sort((a, b) => a.ladderName.localeCompare(b.ladderName)));
      notice = `${user.displayName} can now see and play ${created.ladderName}.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      accessSavingId = null;
    }
  }

  async function removeLadderAccess(user: AdminUser, grant: LadderAccessGrant): Promise<void> {
    if (!confirm(`Remove ${user.displayName}'s access to ${grant.ladderName}?`)) return;
    accessSavingId = user.id;
    error = '';
    notice = '';
    try {
      await revokeLadderAccess(grant.ladderId, user.id);
      setLadderAccess(user.id, user.ladderAccess.filter((entry) => entry.ladderId !== grant.ladderId));
      notice = `${user.displayName} no longer has access to ${grant.ladderName}.`;
    } catch (value) {
      error = problemMessage(value);
    } finally {
      accessSavingId = null;
    }
  }

  onMount(() => {
    void loadUsers(0, '');
    void loadHiddenLadders();
  });
</script>

<svelte:head>
  <title>Manage Users | D2R Reimagined</title>
</svelte:head>

<div class="mb-6">
  <h2 class="display-text mt-1 text-3xl text-parchment-50">Users</h2>
  <p class="mt-2 text-parchment-300">Manage roles, individual hidden-ladder access, and account-wide trade or leaderboard bans. Search by display name, email, character name, or user ID.</p>
</div>

{#if error}<div class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
{#if notice}<div class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

<form class="panel mb-5 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end" onsubmit={(event) => { event.preventDefault(); submitSearch(); }}>
  <label class="min-w-0 flex-1 text-sm text-parchment-300">
    Search users
    <input
      class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50 placeholder:text-parchment-300/60"
      type="search"
      maxlength="100"
      placeholder="Display name, email, character, or user ID"
      bind:value={searchInput}
    />
  </label>
  <div class="flex gap-2">
    <button class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" type="submit" disabled={loading}>Search</button>
    {#if appliedSearch}
      <button class="rounded border border-parchment-300/30 px-4 py-2 text-parchment-300 disabled:opacity-50" type="button" disabled={loading} onclick={clearSearch}>Clear</button>
    {/if}
  </div>
</form>

{#if loading && users.length === 0}
  <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading users…</div>
{:else}
  <section class:opacity-60={loading} class="panel rounded-lg p-5 transition-opacity sm:p-7" aria-busy={loading}>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-parchment-300">
      <p><span class="text-parchment-50">{total}</span> {total === 1 ? 'user' : 'users'}{appliedSearch ? ` matching “${appliedSearch}”` : ''}</p>
      {#if total > 0}<p>Page {currentPage} of {pageCount}</p>{/if}
    </div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[52rem] text-left text-sm">
        <thead class="border-b border-parchment-300/20 text-parchment-300">
          <tr><th class="px-3 py-3">User</th><th class="px-3 py-3">Email</th><th class="px-3 py-3">Admin</th><th class="px-3 py-3">Moderator</th><th class="px-3 py-3">Tester</th><th class="px-3 py-3">Ladder access</th><th class="px-3 py-3">Participation</th><th class="px-3 py-3">Joined</th></tr>
        </thead>
        <tbody>
          {#each users as user (user.id)}
            <tr class="border-b border-parchment-300/10 last:border-0">
              <td class="px-3 py-3 text-parchment-50">{user.displayName}</td>
              <td class="px-3 py-3 text-parchment-300">{user.email || 'Provider account'}</td>
              <td class="px-3 py-3">
                <RoleToggle
                  checked={user.roles.includes('Admin')}
                  disabled={roleSavingId === user.id || user.id === $authState.user?.id}
                  label={`Admin role for ${user.displayName}`}
                  note={user.id === $authState.user?.id ? 'Your role · locked' : undefined}
                  onToggle={(enabled) => void toggleRole(user, 'Admin', enabled)}
                />
              </td>
              <td class="px-3 py-3">
                <RoleToggle
                  checked={user.roles.includes('Moderator')}
                  disabled={roleSavingId === user.id}
                  label={`Moderator role for ${user.displayName}`}
                  onToggle={(enabled) => void toggleRole(user, 'Moderator', enabled)}
                />
              </td>
              <td class="px-3 py-3">
                <RoleToggle checked={user.roles.includes('Tester')} disabled={roleSavingId === user.id}
                  label={`Tester role for ${user.displayName}`}
                  onToggle={(enabled) => void toggleRole(user, 'Tester', enabled)} />
              </td>
              <td class="px-3 py-3">
                {#if user.roles.includes('Tester')}
                  <p class="mb-2 text-xs text-parchment-300">All hidden ladders (Tester)</p>
                {/if}
                <div class="flex flex-wrap gap-1.5">
                  {#each user.ladderAccess as grant (grant.ladderId)}
                    <span class="inline-flex items-center gap-1 rounded border border-set/40 bg-set/10 py-0.5 pl-2 pr-1 text-xs text-set">
                      {grant.ladderName}{grant.ladderIsHidden ? '' : ' (public)'}
                      <button type="button" class="rounded px-1 text-parchment-300 hover:text-requirement disabled:opacity-50"
                        aria-label={`Remove ${user.displayName}'s access to ${grant.ladderName}`}
                        disabled={accessSavingId === user.id} onclick={() => void removeLadderAccess(user, grant)}>×</button>
                    </span>
                  {/each}
                </div>
                {#if hiddenLadders.some((ladder) => !user.ladderAccess.some((grant) => grant.ladderId === ladder.id))}
                  <select class="mt-2 block max-w-[12rem] rounded border border-parchment-300/30 bg-abyss-950 px-2 py-1 text-xs text-parchment-50 disabled:opacity-50"
                    aria-label={`Give ${user.displayName} access to a hidden ladder`}
                    disabled={accessSavingId === user.id}
                    onchange={(event) => { const select = event.currentTarget; void addLadderAccess(user, select.value); select.value = ''; }}>
                    <option value="">Add hidden ladder…</option>
                    {#each hiddenLadders.filter((ladder) => !user.ladderAccess.some((grant) => grant.ladderId === ladder.id)) as ladder (ladder.id)}
                      <option value={ladder.id}>{ladder.name}</option>
                    {/each}
                  </select>
                {:else if user.ladderAccess.length === 0 && !user.roles.includes('Tester')}
                  <p class="text-xs text-parchment-300">No hidden ladders</p>
                {/if}
              </td>
              <td class="px-3 py-3">
                <p class={user.tradeBanned || user.leaderboardBanned ? 'text-requirement' : 'text-parchment-300'}>
                  {user.tradeBanned ? 'Trade banned' : 'Trade allowed'} · {user.leaderboardBanned ? 'Leaderboards banned' : 'Leaderboards allowed'}
                </p>
                <button type="button" class="mt-2 text-ember-400 underline disabled:opacity-50" disabled={roleSavingId !== null || loading}
                  onclick={() => { editingUserId = editingUserId === user.id ? null : user.id; }}>Manage bans</button>
              </td>
              <td class="px-3 py-3 text-parchment-300">{new Date(user.createdAtUtc).toLocaleDateString()}</td>
            </tr>
            {#if editingUserId === user.id}
              <tr><td colspan="8" class="px-3 py-4">
                <ParticipationEditor {user} oncancel={() => editingUserId = null} onsaved={(updated) => {
                  users = users.map(entry => entry.id === updated.id ? updated : entry);
                  editingUserId = null;
                  notice = `${updated.displayName}'s participation settings were saved.`;
                }} />
              </td></tr>
            {/if}
          {:else}
            <tr><td class="px-3 py-8 text-center text-parchment-300" colspan="8">{appliedSearch ? 'No users match this search.' : 'No users found.'}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if pageCount > 1}
      <nav class="mt-5 flex items-center justify-center gap-4 border-t border-parchment-300/15 pt-5" aria-label="User pages">
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip === 0} onclick={() => void loadUsers(Math.max(0, skip - pageSize))}>Previous</button>
        <span class="text-sm text-parchment-300">Page <span class="text-parchment-50">{currentPage}</span> of {pageCount}</span>
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip + pageSize >= total} onclick={() => void loadUsers(skip + pageSize)}>Next</button>
      </nav>
    {/if}
  </section>
{/if}
