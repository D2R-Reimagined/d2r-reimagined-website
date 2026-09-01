<script lang="ts">
  import { onMount } from 'svelte';

  import { getAdminUsers, updateUserRoles, type AdminUser } from '$lib/admin';
  import { ApiError, authState } from '$lib/auth';
  import RoleToggle from '$lib/components/RoleToggle.svelte';

  let users = $state<AdminUser[]>([]);
  let loading = $state(true);
  let roleSavingId = $state<string | null>(null);
  let error = $state('');
  let notice = $state('');

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error
      ? value.message
      : 'An unexpected error occurred.';
  }

  async function loadUsers(): Promise<void> {
    loading = true;
    error = '';
    try {
      users = await getAdminUsers();
    } catch (value) {
      error = problemMessage(value);
    } finally {
      loading = false;
    }
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

  onMount(loadUsers);
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

{#if loading}
  <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading users…</div>
{:else}
  <section class="panel rounded-lg p-5 sm:p-7">
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
            <tr><td class="px-3 py-8 text-center text-parchment-300" colspan="5">No users found.</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
{/if}
