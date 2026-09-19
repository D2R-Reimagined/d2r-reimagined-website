<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '$lib/auth';
  import { searchAdminUsers, type AdminUser } from '$lib/admin';
  import NormalCompletionRewards from '$lib/components/NormalCompletionRewards.svelte';
  type Pack = { id: string; name: string; isActive: boolean; portalIds: string[] };
  type Access = { portalIds: string[]; packIds: string[]; supporterTier: string | null; effective: { portals: { id: string; unlocked: boolean }[] } };
  let users = $state<AdminUser[]>([]), packs = $state<Pack[]>([]), catalog = $state<string[]>([]);
  let userId = $state(''), access = $state<Access | null>(null);
  let userSearch = $state(''), userTotal = $state(0), hasSearchedUsers = $state(false), searchingUsers = $state(false);
  let portalIds = $state<string[]>([]), packIds = $state<string[]>([]);
  let editPackId = $state(''), packName = $state(''), packActive = $state(true), packPortals = $state<string[]>([]);
  let busy = $state(false), loading = $state(true), error = $state(''), notice = $state('');
  let selectionVersion = 0, searchVersion = 0;
  const base = '/admin/portal-entitlements';
  const problem = (e: unknown) => e instanceof Error ? e.message : 'Could not save changes.';
  async function loadAccess() {
    const version = ++selectionVersion, id = userId;
    access = null; error = '';
    if (!id) return;
    try {
      const result = await apiRequest<Access>(base + '/users/' + id, {}, true);
      if (version !== selectionVersion) return;
      access = result; portalIds = [...result.portalIds]; packIds = [...result.packIds];
    } catch (e) { if (version === selectionVersion) error = problem(e); }
  }
  async function findUsers() {
    const search = userSearch.trim();
    if (!search || searchingUsers) return;
    const version = ++searchVersion;
    const selectedUser = users.find(user => user.id === userId);
    searchingUsers = true; error = ''; notice = '';
    try {
      const result = await searchAdminUsers({ search, count: 25 });
      if (version !== searchVersion) return;
      users = selectedUser && !result.items.some(user => user.id === selectedUser.id)
        ? [selectedUser, ...result.items]
        : result.items;
      userTotal = result.total;
      hasSearchedUsers = true;
    } catch (e) {
      if (version === searchVersion) error = problem(e);
    } finally {
      if (version === searchVersion) searchingUsers = false;
    }
  }
  async function saveAccess() {
    if (!access || busy) return;
    busy = true; error = ''; notice = '';
    try {
      access = await apiRequest<Access>(base + '/users/' + userId, { method: 'PUT', body: JSON.stringify({ portalIds, packIds }) }, true);
      portalIds = [...access.portalIds]; packIds = [...access.packIds];
      notice = 'Portal rewards and pack ownership saved. Active games pick up changes on authorization refresh.';
    } catch (e) { error = problem(e); } finally { busy = false; }
  }
  function edit(pack?: Pack) {
    editPackId = pack?.id ?? ''; packName = pack?.name ?? ''; packActive = pack?.isActive ?? true; packPortals = [...(pack?.portalIds ?? [])];
  }
  async function savePack() {
    if (busy) return;
    busy = true; error = ''; notice = '';
    try {
      await apiRequest<Pack>(base + '/packs' + (editPackId ? '/' + editPackId : ''), {
        method: editPackId ? 'PUT' : 'POST', body: JSON.stringify({ name: packName, isActive: packActive, portalIds: packPortals })
      }, true);
      packs = await apiRequest<Pack[]>(base + '/packs', {}, true);
      if (userId) await loadAccess();
      edit(); notice = 'Pack saved. Its active portal grants apply to every owner.';
    } catch (e) { error = problem(e); } finally { busy = false; }
  }
  onMount(async () => {
    try { [packs, catalog] = await Promise.all([apiRequest<Pack[]>(base + '/packs', {}, true), apiRequest<string[]>(base + '/catalog', {}, true)]); }
    catch (e) { error = problem(e); } finally { loading = false; }
  });
</script>

<svelte:head><title>Portal rewards — D2R Reimagined</title></svelte:head>
<h2 class="display-text text-3xl text-parchment-50">Portal rewards</h2>
<p class="mt-2 mb-6 text-parchment-300">Supporter tier colors, individual rewards, and owned packs add together. Ember requires an individual reward or a pack.</p>
{#if error}<p role="alert" class="mb-4 text-requirement">{error}</p>{/if}
{#if notice}<p role="status" class="mb-4 text-set">{notice}</p>{/if}
{#if loading}<p>Loading portal rewards…</p>
{:else}
<NormalCompletionRewards bind:busy onGranted={loadAccess} />
<section class="panel rounded-lg p-6 mb-6">
  <h3 class="display-text text-xl mb-4">User rewards</h3>
  <form class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end" onsubmit={(event) => { event.preventDefault(); void findUsers(); }}>
    <label class="min-w-0 flex-1">Find an account
      <input
        class="block w-full mt-2 rounded bg-black/40 p-3"
        type="search"
        required
        maxlength="100"
        placeholder="Display name or email"
        bind:value={userSearch}
        disabled={searchingUsers}
      />
    </label>
    <button class="rounded border border-ember-400 px-4 py-3 disabled:opacity-50" type="submit" disabled={busy || searchingUsers || !userSearch.trim()}>
      {searchingUsers ? 'Searching…' : 'Search'}
    </button>
  </form>
  <label class="block mb-4">Account
    <select class="block w-full mt-2 rounded bg-black/40 p-3" bind:value={userId} onchange={() => void loadAccess()} disabled={busy || searchingUsers || users.length === 0}>
      <option value="">{hasSearchedUsers ? 'Choose a matching account' : 'Search for an account first'}</option>
      {#each users as user}<option value={user.id}>{user.displayName} — {user.email}</option>{/each}
    </select>
  </label>
  {#if hasSearchedUsers && userTotal === 0}
    <p class="mb-4 text-sm text-parchment-300">No accounts matched that search.</p>
  {:else if hasSearchedUsers && userTotal > 25}
    <p class="mb-4 text-sm text-parchment-300">Showing the first 25 of {userTotal} matches. Refine the search to narrow the list.</p>
  {/if}
  {#if access}
    <p class="mb-4">Discord tier: {access.supporterTier ?? 'None'}</p>
    <fieldset disabled={busy} class="mb-4">
      <legend class="mb-2">Individual portal rewards</legend>
      <div class="flex flex-wrap gap-4">
        {#each catalog.filter(id => id !== 'classic') as id}
          <label class="flex items-center gap-2"><input type="checkbox" value={id} bind:group={portalIds} />{id}</label>
        {/each}
      </div>
    </fieldset>
    <fieldset disabled={busy} class="mb-4">
      <legend class="mb-2">Owned supporter packs</legend>
      {#each packs as pack}
        <label class="flex items-center gap-2 mb-2"><input type="checkbox" value={pack.id} bind:group={packIds} />{pack.name}{pack.isActive ? '' : ' (inactive)'}</label>
      {:else}<p class="text-parchment-300">Create a pack below to assign it.</p>{/each}
    </fieldset>
    <button class="rounded border border-ember-400 px-4 py-2" disabled={busy} onclick={() => void saveAccess()}>Save user rewards</button>
    <p class="mt-4 text-parchment-300">Currently unlocked: {access.effective.portals.filter(p => p.unlocked).map(p => p.id).join(', ')}</p>
    <p class="mt-2 text-sm text-parchment-300">Unchecking a reward removes that grant only. Tier, pack, and existing server configuration grants may still unlock it.</p>
  {/if}
</section>
<section class="panel rounded-lg p-6">
  <h3 class="display-text text-xl mb-4">Supporter packs</h3>
  <div class="flex flex-wrap gap-3 mb-5">
    {#each packs as pack}<button class="rounded border border-parchment-300/30 px-3 py-2" disabled={busy} onclick={() => edit(pack)}>{pack.name}{pack.isActive ? '' : ' (inactive)'}</button>{/each}
    <button class="rounded border border-ember-400 px-3 py-2" disabled={busy} onclick={() => edit()}>New pack</button>
  </div>
  <form onsubmit={(e) => { e.preventDefault(); void savePack(); }}>
    <fieldset disabled={busy}>
      <legend class="mb-3">{editPackId ? 'Edit pack' : 'Create pack'}</legend>
      <label class="block mb-4">Pack name<input class="block w-full mt-2 rounded bg-black/40 p-3" required maxlength="100" bind:value={packName} /></label>
      <label class="flex items-center gap-2 mb-4"><input type="checkbox" bind:checked={packActive} />Active — grants portals to owners</label>
      <div class="flex flex-wrap gap-4 mb-4">
        {#each catalog.filter(id => id !== 'classic') as id}<label class="flex items-center gap-2"><input type="checkbox" value={id} bind:group={packPortals} />{id}</label>{/each}
      </div>
      <p class="text-sm text-parchment-300 mb-4">Changing these grants affects all owners. Inactive packs retain ownership but grant no portals.</p>
      <button class="rounded border border-ember-400 px-4 py-2" type="submit">{editPackId ? 'Save pack' : 'Create pack'}</button>
    </fieldset>
  </form>
</section>
{/if}
