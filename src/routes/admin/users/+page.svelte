<script lang="ts">
  import { onMount } from 'svelte';

  import { searchAdminUsers, updateUserRoles, type AdminUser } from '$lib/admin';
  import { ApiError, authState } from '$lib/auth';
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

  onMount(() => void loadUsers(0, ''));
</script>

<svelte:head>
  <title>Manage Users — D2R Reimagined</title>
</svelte:head>

<div class="mb-6">
  <h2 class="display-text mt-1 text-3xl text-parchment-50">Users</h2>
  <p class="mt-2 text-parchment-300">Assign Admin and Moderator access. Changes take effect immediately.</p>
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
      placeholder="Display name or email"
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
      <table class="w-full min-w-[42rem] text-left text-sm">
        <thead class="border-b border-parchment-300/20 text-parchment-300">
          <tr><th class="px-3 py-3">User</th><th class="px-3 py-3">Email</th><th class="px-3 py-3">Admin</th><th class="px-3 py-3">Moderator</th><th class="px-3 py-3">Joined</th></tr>
        </thead>
        <tbody>
          {#each users as user}
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
              <td class="px-3 py-3 text-parchment-300">{new Date(user.createdAtUtc).toLocaleDateString()}</td>
            </tr>
          {:else}
            <tr><td class="px-3 py-8 text-center text-parchment-300" colspan="5">{appliedSearch ? 'No users match this search.' : 'No users found.'}</td></tr>
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
