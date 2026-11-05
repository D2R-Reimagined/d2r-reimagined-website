<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import {
    getLadders,
    grantLadderAccess,
    revokeLadderAccess,
    updateUserRoles,
    type AdminUser,
    type Ladder,
    type LadderAccessGrant
  } from '#lib/admin.js';
  import {
    getAdminUser,
    getSupporterPacks,
    getUserPortalAccess,
    getUserPurchases,
    portalAccessRows,
    refreshUserDiscordRoles,
    saveUserPortalAccess,
    supporterGap,
    type SupporterPack,
    type UserPortalAccess,
    type UserPurchase
  } from '#lib/admin-user.js';
  import { authState } from '#lib/auth.js';
  import ParticipationEditor from '#lib/components/ParticipationEditor.svelte';
  import RoleToggle from '#lib/components/RoleToggle.svelte';
  import { supporterTierName } from '#lib/mtx.js';

  const staffRoles = ['Admin', 'Moderator', 'Tester'];

  let user = $state<AdminUser | null>(null);
  let access = $state<UserPortalAccess | null>(null);
  let packs = $state<SupporterPack[]>([]);
  let purchases = $state<UserPurchase[]>([]);
  let hiddenLadders = $state<Ladder[]>([]);
  let portalIds = $state<string[]>([]);
  let packIds = $state<string[]>([]);
  let loading = $state(true);
  let busy = $state(false);
  let editingBans = $state(false);
  let error = $state('');
  let notice = $state('');

  let rows = $derived(access ? portalAccessRows(access, packs) : []);
  let gap = $derived(user ? supporterGap(user, purchases) : null);
  let selectedPortalName = $derived(access?.effective.portals.find((portal) => portal.id === access?.effective.selectedPortalId)?.name);
  let addableLadders = $derived(hiddenLadders.filter((ladder) => !user?.ladderAccess.some((grant) => grant.ladderId === ladder.id)));
  let portalsChanged = $derived(access !== null && (!sameSet(portalIds, access.portalIds) || !sameSet(packIds, access.packIds)));

  function sameSet(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((value) => b.includes(value));
  }

  function problem(value: unknown): string {
    return value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  function dateTime(value: string | null): string {
    return value ? new Date(value).toLocaleString() : 'Never';
  }

  function money(amount: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  }

  function applyAccess(result: UserPortalAccess): void {
    access = result;
    portalIds = [...result.portalIds];
    packIds = [...result.packIds];
  }

  // Runs one change: clears old messages, blocks other changes, reports the outcome.
  async function run(action: () => Promise<string>): Promise<void> {
    if (busy) return;
    busy = true;
    error = '';
    notice = '';
    try {
      notice = await action();
    } catch (value) {
      error = problem(value);
    } finally {
      busy = false;
    }
  }

  function refreshDiscord(current: AdminUser): Promise<void> {
    return run(async () => {
      user = await refreshUserDiscordRoles(current.id);
      applyAccess(await getUserPortalAccess(current.id));
      return `Discord roles re-read. Supporter tier: ${supporterTierName(user.discordSupporterTier)}.`;
    });
  }

  function savePortals(current: AdminUser): Promise<void> {
    return run(async () => {
      applyAccess(await saveUserPortalAccess(current.id, portalIds, packIds));
      return 'Portal rewards and packs saved. The player gets them on their next game launch, or at once with /mtx sync.';
    });
  }

  function toggleRole(current: AdminUser, role: string, enabled: boolean): Promise<void> {
    const roles = enabled ? [...new Set([...current.roles, role])] : current.roles.filter((existing) => existing !== role);
    return run(async () => {
      user = await updateUserRoles(current.id, roles);
      return `${role} role ${enabled ? 'added' : 'removed'}. It takes effect immediately.`;
    });
  }

  function addLadder(current: AdminUser, ladderId: string): Promise<void> {
    if (!ladderId) return Promise.resolve();
    return run(async () => {
      const created = await grantLadderAccess(ladderId, current.id);
      user = {
        ...current,
        ladderAccess: [...current.ladderAccess.filter((grant) => grant.ladderId !== ladderId), created]
          .sort((a, b) => a.ladderName.localeCompare(b.ladderName))
      };
      return `${current.displayName} can now see and play ${created.ladderName}.`;
    });
  }

  function removeLadder(current: AdminUser, grant: LadderAccessGrant): Promise<void> {
    if (!confirm(`Remove ${current.displayName}'s access to ${grant.ladderName}?`)) return Promise.resolve();
    return run(async () => {
      await revokeLadderAccess(grant.ladderId, current.id);
      user = { ...current, ladderAccess: current.ladderAccess.filter((entry) => entry.ladderId !== grant.ladderId) };
      return `${current.displayName} no longer has access to ${grant.ladderName}.`;
    });
  }

  onMount(async () => {
    try {
      const id = page.params.id;
      if (!id) throw new Error('This user could not be found.');
      const [loadedUser, loadedAccess, loadedPacks, loadedPurchases, ladders] = await Promise.all([
        getAdminUser(id), getUserPortalAccess(id), getSupporterPacks(), getUserPurchases(id), getLadders()
      ]);
      user = loadedUser;
      packs = loadedPacks;
      purchases = loadedPurchases;
      hiddenLadders = ladders
        .filter((ladder) => ladder.isHidden && !ladder.archivedAtUtc)
        .sort((a, b) => a.name.localeCompare(b.name));
      applyAccess(loadedAccess);
    } catch (value) {
      error = problem(value);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{user ? `${user.displayName} | Users` : 'User'} | D2R Reimagined</title>
</svelte:head>

<a class="text-sm text-ember-400 underline" href="/admin/users">← All users</a>

{#if loading}
  <div class="panel mt-4 rounded-lg p-8 text-center text-parchment-300">Loading user…</div>
{:else if !user || !access}
  <div class="mt-4 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error || 'This user could not be found.'}</div>
{:else}
  {@const current = user}
  <h2 class="display-text mt-3 text-3xl text-parchment-50">{current.displayName}</h2>
  <dl class="mt-3 mb-6 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-[max-content_minmax(0,1fr)]">
    <dt class="text-parchment-300">Email</dt><dd class="break-all text-parchment-50">{current.email || 'Provider account'}</dd>
    <dt class="text-parchment-300">User ID</dt><dd class="break-all font-mono text-parchment-50">{current.id}</dd>
    <dt class="text-parchment-300">Joined</dt><dd class="text-parchment-50">{new Date(current.createdAtUtc).toLocaleDateString()}</dd>
  </dl>

  {#if error}<div role="alert" class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
  {#if notice}<div role="status" class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

  <section class="panel mb-6 rounded-lg p-5 sm:p-7">
    <h3 class="display-text mb-4 text-xl text-parchment-50">Supporter and Discord</h3>
    <dl class="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-[max-content_minmax(0,1fr)]">
      <dt class="text-parchment-300">Discord</dt>
      <dd class="break-all text-parchment-50">{current.discordId ? `${current.discordUsername ?? 'Unknown'} (${current.discordId})` : 'Not linked'}</dd>
      <dt class="text-parchment-300">Supporter tier</dt>
      <dd class="text-parchment-50">{supporterTierName(current.discordSupporterTier)}</dd>
      <dt class="text-parchment-300">Roles last checked</dt>
      <dd class="text-parchment-50">{dateTime(current.discordRolesSyncedAtUtc)}</dd>
    </dl>
    {#if gap}<p class="mt-4 rounded border border-ember-400/40 bg-ember-700/15 p-3 text-sm text-parchment-50">{gap}</p>{/if}
    {#if current.discordId}
      <button type="button" class="mt-4 rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" disabled={busy} onclick={() => void refreshDiscord(current)}>
        Refresh Discord roles
      </button>
    {/if}

    <h4 class="display-text mt-7 mb-3 text-lg text-parchment-50">Purchases</h4>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-b border-parchment-300/20 text-parchment-300">
          <tr><th class="px-3 py-2">Product</th><th class="px-3 py-2">Status</th><th class="px-3 py-2">Amount</th><th class="px-3 py-2">Bought</th><th class="px-3 py-2">Paid until</th><th class="px-3 py-2">Pack</th></tr>
        </thead>
        <tbody>
          {#each purchases as purchase (purchase.id)}
            <tr class="border-b border-parchment-300/10 last:border-0">
              <td class="px-3 py-2 text-parchment-50">{purchase.productName}</td>
              <td class="px-3 py-2">
                <span class={purchase.grantingReward ? 'text-set' : 'text-parchment-300'}>{purchase.status}{purchase.cancelAtPeriodEnd ? ', cancelling' : ''}</span>
              </td>
              <td class="px-3 py-2 text-parchment-300">{money(purchase.amount, purchase.currency)}</td>
              <td class="px-3 py-2 text-parchment-300">{new Date(purchase.purchasedAtUtc).toLocaleDateString()}</td>
              <td class="px-3 py-2 text-parchment-300">{purchase.currentPeriodEndUtc ? new Date(purchase.currentPeriodEndUtc).toLocaleDateString() : '—'}</td>
              <td class="px-3 py-2 text-parchment-300">{purchase.reward?.name ?? '—'}</td>
            </tr>
          {:else}
            <tr><td colspan="6" class="px-3 py-4 text-parchment-300">No website purchases.</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel mb-6 rounded-lg p-5 sm:p-7">
    <h3 class="display-text text-xl text-parchment-50">Town portals</h3>
    <p class="mt-2 mb-4 text-sm text-parchment-300">Selected: {selectedPortalName ?? 'Classic'}. Tick a portal to grant it individually. Unticking removes only that grant; a tier or pack can still unlock it.</p>
    <fieldset disabled={busy}>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[32rem] text-left text-sm">
          <thead class="border-b border-parchment-300/20 text-parchment-300">
            <tr><th class="px-3 py-2">Portal</th><th class="px-3 py-2">Access</th><th class="px-3 py-2">Unlocked by</th><th class="px-3 py-2">Individual reward</th></tr>
          </thead>
          <tbody>
            {#each rows as row (row.id)}
              <tr class="border-b border-parchment-300/10 last:border-0">
                <td class="px-3 py-2 text-parchment-50">{row.name}</td>
                <td class="px-3 py-2"><span class={row.unlocked ? 'text-set' : 'text-parchment-300'}>{row.unlocked ? 'Unlocked' : 'Locked'}</span></td>
                <td class="px-3 py-2 text-parchment-300">{row.sources.join(' · ') || '—'}</td>
                <td class="px-3 py-2">
                  {#if row.id !== 'classic'}
                    <input type="checkbox" aria-label={`Grant ${row.name} to ${current.displayName}`} value={row.id} bind:group={portalIds} />
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <h4 class="display-text mt-6 mb-3 text-lg text-parchment-50">Supporter packs</h4>
      {#each packs as pack (pack.id)}
        <label class="mb-2 flex items-center gap-2 text-parchment-50">
          {#if access.purchasedPackIds.includes(pack.id)}
            <input type="checkbox" checked disabled />
            {pack.name}{pack.isActive ? '' : ' (inactive)'} <span class="text-sm text-parchment-300">(from a purchase)</span>
          {:else}
            <input type="checkbox" value={pack.id} bind:group={packIds} />
            {pack.name}{pack.isActive ? '' : ' (inactive)'}
          {/if}
        </label>
      {:else}
        <p class="text-sm text-parchment-300">No packs yet. Create them on the <a class="text-ember-400 underline" href="/admin/portals">Portal rewards</a> page.</p>
      {/each}

      <button type="button" class="mt-4 rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" disabled={busy || !portalsChanged} onclick={() => void savePortals(current)}>
        Save portals and packs
      </button>
    </fieldset>
  </section>

  <section class="panel mb-6 rounded-lg p-5 sm:p-7">
    <h3 class="display-text mb-4 text-xl text-parchment-50">Roles</h3>
    <div class="grid gap-4 sm:grid-cols-3">
      {#each staffRoles as role (role)}
        {@const ownAdmin = role === 'Admin' && current.id === $authState.user?.id}
        <div>
          <p class="mb-2 text-sm text-parchment-300">{role}</p>
          <RoleToggle
            checked={current.roles.includes(role)}
            disabled={busy || ownAdmin}
            label={`${role} role for ${current.displayName}`}
            note={ownAdmin ? 'Your role · locked' : undefined}
            onToggle={(enabled) => void toggleRole(current, role, enabled)}
          />
        </div>
      {/each}
    </div>
  </section>

  <section class="panel mb-6 rounded-lg p-5 sm:p-7">
    <h3 class="display-text mb-4 text-xl text-parchment-50">Hidden ladder access</h3>
    {#if current.roles.includes('Tester')}<p class="mb-2 text-sm text-parchment-300">Sees all hidden ladders as a Tester.</p>{/if}
    <div class="flex flex-wrap gap-1.5">
      {#each current.ladderAccess as grant (grant.ladderId)}
        <span class="inline-flex items-center gap-1 rounded border border-set/40 bg-set/10 py-0.5 pl-2 pr-1 text-xs text-set">
          {grant.ladderName}{grant.ladderIsHidden ? '' : ' (public)'}
          <button type="button" class="rounded px-1 text-parchment-300 hover:text-requirement disabled:opacity-50"
            aria-label={`Remove ${current.displayName}'s access to ${grant.ladderName}`}
            disabled={busy} onclick={() => void removeLadder(current, grant)}>×</button>
        </span>
      {:else}
        {#if !current.roles.includes('Tester')}<p class="text-sm text-parchment-300">No hidden ladders.</p>{/if}
      {/each}
    </div>
    {#if addableLadders.length > 0}
      <select class="mt-3 block max-w-xs rounded border border-parchment-300/30 bg-abyss-950 px-2 py-1 text-sm text-parchment-50 disabled:opacity-50"
        aria-label={`Give ${current.displayName} access to a hidden ladder`}
        disabled={busy}
        onchange={(event) => { const select = event.currentTarget; void addLadder(current, select.value); select.value = ''; }}>
        <option value="">Add hidden ladder…</option>
        {#each addableLadders as ladder (ladder.id)}<option value={ladder.id}>{ladder.name}</option>{/each}
      </select>
    {/if}
  </section>

  <section class="panel rounded-lg p-5 sm:p-7">
    <h3 class="display-text mb-4 text-xl text-parchment-50">Participation</h3>
    {#if editingBans}
      <ParticipationEditor user={current} oncancel={() => editingBans = false} onsaved={(updated) => {
        user = updated;
        editingBans = false;
        error = '';
        notice = `${updated.displayName}'s participation settings were saved.`;
      }} />
    {:else}
      {#if current.tradeBanned || current.leaderboardBanned || current.lobbyHostBanned || current.globalChatBanned}
        <p class="text-requirement">
          {[current.tradeBanned && 'Trade', current.leaderboardBanned && 'Leaderboards', current.lobbyHostBanned && 'Lobby hosting', current.globalChatBanned && 'Global chat']
            .filter(Boolean).join(' · ')} banned
        </p>
      {:else}
        <p class="text-parchment-300">No bans.</p>
      {/if}
      <button type="button" class="mt-3 rounded border border-parchment-300/30 px-4 py-2 text-parchment-50 disabled:opacity-50" disabled={busy} onclick={() => editingBans = true}>Manage bans</button>
    {/if}
  </section>
{/if}
