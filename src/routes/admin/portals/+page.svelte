<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '#lib/auth.js';
  import { searchAdminUsers, type AdminUser } from '#lib/admin.js';
  import NormalCompletionRewards from '#lib/components/NormalCompletionRewards.svelte';
  import { fetchSupportRewards, rewardChangeSummary, rewardKindLabel, saveSupportReward, type SupportRewardProduct } from '#lib/admin-support.js';
  type Pack = { id: string; name: string; isActive: boolean; portalIds: string[]; chatBadge?: string | null };
  // The global chat badges a pack can grant (API ChatBadges, lowest to highest).
  const chatBadges = [
    { id: 'soldier', name: 'Harrowing Soldier' },
    { id: 'legionnaire', name: 'Harrowing Legionnaire' },
    { id: 'praetorian', name: 'Harrowing Praetorian' }
  ];
  type Access = { portalIds: string[]; packIds: string[]; supporterTier: string | null; effective: { portals: { id: string; unlocked: boolean }[] } };
  let users = $state<AdminUser[]>([]), packs = $state<Pack[]>([]), catalog = $state<string[]>([]);
  let userId = $state(''), access = $state<Access | null>(null);
  let userSearch = $state(''), userTotal = $state(0), hasSearchedUsers = $state(false), searchingUsers = $state(false);
  let portalIds = $state<string[]>([]), packIds = $state<string[]>([]);
  let editPackId = $state(''), packName = $state(''), packActive = $state(true), packPortals = $state<string[]>([]), packBadge = $state('');
  let busy = $state(false), loading = $state(true), error = $state(''), notice = $state('');
  // Store products and the pack each grants; `rewardPicks` is each row's unsaved choice.
  let rewards = $state<SupportRewardProduct[]>([]), rewardPicks = $state<Record<string, string>>({}), rewardsError = $state('');
  async function loadRewards() {
    try {
      rewards = await fetchSupportRewards();
      rewardPicks = Object.fromEntries(rewards.map(product => [product.productId, product.reward?.supporterPackId ?? '']));
      rewardsError = '';
    } catch (e) { rewardsError = problem(e); }
  }
  async function saveReward(product: SupportRewardProduct) {
    const packId = rewardPicks[product.productId] ?? '';
    const summary = rewardChangeSummary(product, packId, packs.find(pack => pack.id === packId)?.name ?? null);
    if (!summary || busy || !confirm(summary.confirm)) return;
    busy = true; error = ''; notice = '';
    try {
      await saveSupportReward(product.productId, packId);
      await loadRewards();
      if (userId) await loadAccess();
      notice = summary.done;
    } catch (e) { error = problem(e); } finally { busy = false; }
  }
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
    packBadge = pack?.chatBadge ?? '';
  }
  async function savePack() {
    if (busy) return;
    busy = true; error = ''; notice = '';
    try {
      await apiRequest<Pack>(base + '/packs' + (editPackId ? '/' + editPackId : ''), {
        method: editPackId ? 'PUT' : 'POST', body: JSON.stringify({ name: packName, isActive: packActive, portalIds: packPortals, chatBadge: packBadge || null })
      }, true);
      packs = await apiRequest<Pack[]>(base + '/packs', {}, true);
      await loadRewards();
      if (userId) await loadAccess();
      edit(); notice = 'Pack saved. Its active portal grants apply to every owner.';
    } catch (e) { error = problem(e); } finally { busy = false; }
  }
  onMount(async () => {
    try { [packs, catalog] = await Promise.all([apiRequest<Pack[]>(base + '/packs', {}, true), apiRequest<string[]>(base + '/catalog', {}, true)]); }
    catch (e) { error = problem(e); } finally { loading = false; }
    await loadRewards();
  });
</script>

<svelte:head><title>Supporter rewards | D2R Reimagined</title></svelte:head>
<h2 class="display-text text-3xl text-parchment-50">Supporter rewards</h2>
<p class="mt-2 mb-6 text-parchment-300">Supporter tier colors, individual rewards, and owned packs add together. Ember requires an individual reward or a pack. Store purchases grant the pack their product is mapped to below.</p>
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
      <label class="block mb-4">Chat badge
        <select class="block w-full mt-2 rounded bg-black/40 p-3" bind:value={packBadge}>
          <option value="">None</option>
          {#each chatBadges as badge (badge.id)}<option value={badge.id}>{badge.name}</option>{/each}
        </select>
        <span class="mt-1 block text-sm text-parchment-300">Shown before owners' names in global chat; an owner of several shows the highest unless they pick one on the cosmetics page.</span>
      </label>
      <p class="text-sm text-parchment-300 mb-4">Changing these grants affects all owners. Inactive packs retain ownership but grant no portals or badge.</p>
      <button class="rounded border border-ember-400 px-4 py-2" type="submit">{editPackId ? 'Save pack' : 'Create pack'}</button>
    </fieldset>
  </form>
</section>
<section class="panel mt-6 rounded-lg p-6">
  <h3 class="display-text text-xl mb-2">Store products</h3>
  <p class="text-sm text-parchment-300 mb-4">
    Each Stripe product grants the pack it is mapped to, to every buyer whose purchase is in good standing, past buyers included.
    A product with no pack grants nothing.
  </p>
  {#if rewardsError}
    <p role="alert" class="text-requirement">{rewardsError}</p>
  {:else if rewards.length === 0}
    <p class="text-parchment-300">No products are on sale or have been bought yet.</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-b border-parchment-300/15 text-xs uppercase tracking-wider text-parchment-300">
          <tr><th class="px-3 py-2 font-normal">Product</th><th class="px-3 py-2 font-normal">Type</th><th class="px-3 py-2 font-normal">Owners</th><th class="px-3 py-2 font-normal">Grants pack</th><th class="px-3 py-2"></th></tr>
        </thead>
        <tbody>
          {#each rewards as product (product.productId)}
            {@const changed = (rewardPicks[product.productId] ?? '') !== (product.reward?.supporterPackId ?? '')}
            <tr class="border-b border-parchment-300/10 last:border-0">
              <td class="px-3 py-3">
                <span class="text-parchment-50">{product.productName}</span>
                <span class="block font-mono text-xs text-parchment-300">{product.productId}</span>
              </td>
              <td class="px-3 py-3 text-parchment-200">{rewardKindLabel(product.kind)}{product.onSale ? '' : ' · not on sale'}</td>
              <td class="px-3 py-3 text-parchment-200">{product.currentOwners}</td>
              <td class="px-3 py-3">
                <select class="w-full rounded bg-black/40 p-2" bind:value={rewardPicks[product.productId]} disabled={busy} aria-label={`Pack for ${product.productName}`}>
                  <option value="">None</option>
                  {#each packs as pack (pack.id)}<option value={pack.id}>{pack.name}{pack.isActive ? '' : ' (inactive)'}</option>{/each}
                </select>
                {#if product.reward && !product.reward.isActive}<span class="mt-1 block text-xs text-requirement">Pack is inactive, so it grants nothing.</span>{/if}
              </td>
              <td class="px-3 py-3 text-right">
                <button class="rounded border border-ember-400 px-3 py-2 disabled:opacity-40" disabled={busy || !changed} onclick={() => void saveReward(product)}>Save</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if packs.length === 0}<p class="mt-3 text-sm text-parchment-300">Create a pack above first, then map products to it.</p>{/if}
  {/if}
</section>
{/if}
