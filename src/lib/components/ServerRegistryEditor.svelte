<script lang="ts">
  import { onMount } from 'svelte';
  import { getLadders, type Ladder } from '$lib/admin';
  import { authState } from '$lib/auth';
  import { canManageServers } from '$lib/admin-access';
  import {
    getServerConfigurations, getServerRegions, createServerConfiguration, updateServerConfiguration,
    createServerRegion, updateServerRegion, deleteServerRegion, serverConfigurationInput, serverRegionInput,
    serverDraft, serverLabel, MAX_GAMES_PER_SERVER, type ServerConfiguration, type ServerRegion, type ServerDraft
  } from '$lib/server-registry';

  let { onchange, onconfigured }: {
    onchange?: () => Promise<void>;
    /** Receives the configured server records whenever they load or change (for display names elsewhere). */
    onconfigured?: (servers: ServerConfiguration[]) => void;
  } = $props();
  let servers = $state<ServerConfiguration[]>([]);
  let regions = $state<ServerRegion[]>([]);
  let ladders = $state<Ladder[]>([]);
  let loading = $state(true), saving = $state(false), error = $state(''), notice = $state('');
  let editingId = $state<string | null>(null), formOpen = $state(false);
  const emptyServer = (): ServerDraft => ({ id: '', name: '', ladderId: '', publicAddress: '', enabled: true, maxGames: MAX_GAMES_PER_SERVER, regionIds: [], keySha256: '' });
  let draft = $state<ServerDraft>(emptyServer());
  let editingRegionId = $state<string | null>(null);
  let regionDraft = $state<ServerRegion>({ id: '', name: '' });
  let regionsOpen = $state(false);
  let mounted = false;
  let loadSequence = 0;
  const allowed = $derived(canManageServers($authState.user?.roles));
  const sortedServers = $derived([...servers].sort((a, b) => serverLabel(a).localeCompare(serverLabel(b)) || a.id.localeCompare(b.id)));
  const sortedRegions = $derived([...regions].sort((a, b) => a.name.localeCompare(b.name)));

  $effect(() => { onconfigured?.(servers); });

  function problem(value: unknown): string { return value instanceof Error ? value.message : 'Unable to save configuration.'; }
  function ladderName(id: string): string { return ladders.find(l => l.id === id)?.name ?? id; }
  function regionNames(ids: string[]): string { return ids.map(id => regions.find(r => r.id === id)?.name ?? id).join(', ') || 'All regions only'; }
  function assignedCount(id: string): number { return servers.filter(s => s.regionIds.includes(id)).length; }

  async function load(signal?: AbortSignal): Promise<void> {
    if (!allowed) return;
    const sequence = ++loadSequence;
    loading = true; error = '';
    try {
      const [configured, availableRegions, availableLadders] = await Promise.all([
        getServerConfigurations(signal), getServerRegions(signal), getLadders()
      ]);
      if (!mounted || signal?.aborted || sequence !== loadSequence) return;
      servers = configured; regions = availableRegions; ladders = availableLadders;
      if (!regions.length) regionsOpen = true;
    } catch (e) { if (mounted && !signal?.aborted && sequence === loadSequence) error = problem(e); }
    finally { if (mounted && !signal?.aborted && sequence === loadSequence) loading = false; }
  }
  function addServer(): void {
    editingId = null; draft = emptyServer(); formOpen = true; error = ''; notice = '';
  }
  function editServer(server: ServerConfiguration): void {
    editingId = server.id; draft = serverDraft(server);
    formOpen = true; error = ''; notice = '';
  }
  function toggleRegion(id: string, checked: boolean): void {
    draft.regionIds = checked ? [...draft.regionIds, id] : draft.regionIds.filter(value => value !== id);
  }
  async function changed(message: string): Promise<void> {
    notice = message;
    try { await onchange?.(); }
    catch { if (mounted) notice = `${message} Monitoring will refresh when its connection resumes.`; }
  }
  async function saveServer(event: SubmitEvent): Promise<void> {
    event.preventDefault(); if (!allowed || saving) return;
    error = ''; notice = ''; saving = true;
    try {
      const input = serverConfigurationInput(draft, editingId === null);
      const result = editingId === null ? await createServerConfiguration(input) : await updateServerConfiguration(input);
      if (!mounted) return;
      servers = [...servers.filter(s => s.id !== result.id), result];
      editingId = result.id; draft = serverDraft(result);
      formOpen = false;
      await changed(`${serverLabel(result)} saved. Changes take effect without restarting the API.`);
    } catch (e) { if (mounted) error = problem(e); }
    finally { if (mounted) saving = false; }
  }
  function editRegion(region: ServerRegion): void {
    editingRegionId = region.id; regionDraft = { ...region }; error = ''; notice = '';
  }
  function resetRegion(): void { editingRegionId = null; regionDraft = { id: '', name: '' }; }
  async function saveRegion(event: SubmitEvent): Promise<void> {
    event.preventDefault(); if (!allowed || saving) return;
    error = ''; notice = ''; saving = true;
    try {
      const input = serverRegionInput(regionDraft);
      const result = editingRegionId === null ? await createServerRegion(input) : await updateServerRegion(input);
      if (!mounted) return;
      regions = [...regions.filter(r => r.id !== result.id), result]; resetRegion();
      await changed(`${result.name} saved.`);
    } catch (e) { if (mounted) error = problem(e); }
    finally { if (mounted) saving = false; }
  }
  async function removeRegion(region: ServerRegion): Promise<void> {
    if (!allowed || saving || assignedCount(region.id)) return;
    error = ''; notice = ''; saving = true;
    try {
      await deleteServerRegion(region.id); if (!mounted) return;
      regions = regions.filter(r => r.id !== region.id);
      draft.regionIds = draft.regionIds.filter(id => id !== region.id);
      if (editingRegionId === region.id) resetRegion();
      await changed(`${region.name} deleted.`);
    } catch (e) { if (mounted) error = problem(e); }
    finally { if (mounted) saving = false; }
  }
  onMount(() => {
    mounted = true; const controller = new AbortController(); void load(controller.signal);
    return () => { mounted = false; loadSequence++; controller.abort(); };
  });
</script>

{#if allowed}
  <section class="panel rounded-lg p-4 sm:p-5" aria-label="Server configuration">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div><h3 class="display-text text-xl text-parchment-50">Server configuration</h3><p class="mt-1 text-sm text-parchment-300">Add servers and assign regions. Saved changes apply immediately.</p></div>
      <div class="flex gap-2"><button class="control" disabled={loading || saving || formOpen} onclick={() => void load()}>Refresh</button><button class="control primary" disabled={loading || saving} onclick={addServer}>Add server</button></div>
    </div>
    {#if error}<p class="mt-4 rounded-lg border border-ember-400/40 bg-ember-700/20 p-3 text-sm text-parchment-50" role="alert">{error}</p>{/if}
    {#if notice}<p class="mt-4 text-sm text-emerald-300" role="status">{notice}</p>{/if}
    {#if loading}<p class="mt-4 text-sm text-parchment-300">Loading server configuration…</p>
    {:else}
      <div class="mt-4 space-y-2" aria-label="Configured servers">
        {#if !servers.length}<p class="rounded-lg border border-parchment-300/15 p-4 text-sm text-parchment-300">No servers registered yet. Create regions below, then add your first server.</p>{/if}
        {#each sortedServers as server (server.id)}
          <div class="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-parchment-300/15 p-3">
            <div class="min-w-0 flex-1"><p class="break-words text-sm text-parchment-50"><span class="font-semibold">{serverLabel(server)}</span> <span class={`ml-2 text-xs ${server.enabled ? 'text-emerald-300' : 'text-amber-300'}`}>{server.enabled ? 'Enabled' : 'Disabled'}</span></p><p class="mt-1 break-words text-xs text-parchment-300">{server.publicAddress} · {ladderName(server.ladderId)} · max {server.maxGames ?? MAX_GAMES_PER_SERVER} games</p><p class="mt-1 break-words text-xs text-parchment-300">{regionNames(server.regionIds)}</p></div>
            <button class="control" disabled={saving} aria-label={`Edit server ${serverLabel(server)}`} onclick={() => editServer(server)}>Edit</button>
          </div>
        {/each}
      </div>
      {#if formOpen}
        <form class="mt-4 rounded-lg border border-ember-400/40 p-4" onsubmit={saveServer} aria-label={editingId ? `Edit server ${editingId}` : 'Add server'}>
          <fieldset disabled={saving} class="min-w-0"><legend class="display-text text-lg text-parchment-50">{editingId ? `Edit ${editingId}` : 'New server'}</legend>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <label class="label">Server ID<input class="field" bind:value={draft.id} required maxlength="64" disabled={editingId !== null} placeholder="na-1" /></label>
              <label class="label">Display name (optional)<input class="field" bind:value={draft.name} maxlength="64" placeholder="NA East 1" /><span class="mt-1 block text-xs text-parchment-300">Shown to admins instead of the ID. Leave blank to show the ID.</span></label>
              <label class="label">Ladder<select class="field" bind:value={draft.ladderId} required disabled={editingId !== null}><option value="">Choose a ladder</option>{#if editingId && !ladders.some(ladder => ladder.id === draft.ladderId)}<option value={draft.ladderId}>{ladderName(draft.ladderId)}</option>{/if}{#each ladders as ladder}<option value={ladder.id}>{ladder.name}{ladder.isHidden ? ' (hidden)' : ''}{ladder.archivedAtUtc ? ' (archived)' : ''}</option>{/each}</select></label>
              <label class="label">Public IPv4 address<input class="field" bind:value={draft.publicAddress} required maxlength="15" placeholder="203.0.113.20" /></label>
              <label class="label">Max games<input class="field" type="number" bind:value={draft.maxGames} required min="1" max={MAX_GAMES_PER_SERVER} step="1" /><span class="mt-1 block text-xs text-parchment-300">Hosting stops picking this server at this many games (1–{MAX_GAMES_PER_SERVER}).</span></label>
              <label class="flex items-center gap-2 self-center text-sm text-parchment-200"><input type="checkbox" bind:checked={draft.enabled} />Enabled for hosting and server access</label>
              <label class="label sm:col-span-2">{editingId ? 'New server key SHA-256 (optional)' : 'Server key SHA-256'}<input class="field font-mono" bind:value={draft.keySha256} required={editingId === null} autocomplete="off" spellcheck="false" placeholder={editingId ? 'Leave blank to keep the current key' : '64-character SHA-256 hash'} /><span class="mt-1 block text-xs text-parchment-300">{editingId ? 'Enter a new hash only when rotating this server’s key.' : 'Use the hash of the key configured on this dedicated server.'}</span><span class="mt-1 block text-xs text-parchment-300">Copy it from the server’s lobby-server-key.txt; lowercase or uppercase hex is accepted.</span></label>
            </div>
            <fieldset class="mt-4"><legend class="label">Regions</legend><p class="mt-1 text-xs text-parchment-300">Select every region this server serves. Without an assignment it appears when players select all regions.</p>
              <div class="mt-2 flex flex-wrap gap-x-5 gap-y-2">{#each sortedRegions as region}<label class="flex min-w-0 items-center gap-2 text-sm text-parchment-200"><input type="checkbox" checked={draft.regionIds.includes(region.id)} onchange={event => toggleRegion(region.id, event.currentTarget.checked)} /><span class="break-words">{region.name}</span></label>{/each}</div>
              {#if !regions.length}<p class="mt-2 text-xs text-amber-300">Create a region below to assign it here.</p>{/if}
            </fieldset>
            {#if editingId}<p class="mt-3 text-xs text-parchment-300">Server ID and ladder stay fixed. To serve another ladder, add a new server record.</p>{/if}
            {#if !draft.enabled}<p class="mt-3 text-xs text-amber-300">Drain this server and finish saving active games before disabling its API access.</p>{/if}
            <div class="mt-4 flex gap-2"><button type="submit" class="control primary">{saving ? 'Saving…' : 'Save server'}</button><button type="button" class="control" onclick={() => { formOpen = false; draft.keySha256 = ''; }}>Cancel</button></div>
          </fieldset>
        </form>
      {/if}
      <details class="mt-5 border-t border-parchment-300/15 pt-4" bind:open={regionsOpen}>
        <summary class="display-text cursor-pointer text-lg text-parchment-50">Regions <span class="text-sm text-parchment-300">({regions.length})</span></summary>
        <p class="mt-2 text-sm text-parchment-300">A region can contain multiple servers, and each server can serve multiple regions.</p>
        <form onsubmit={saveRegion} aria-label={editingRegionId ? `Edit region ${editingRegionId}` : 'Add region'} class="mt-3">
          <fieldset disabled={saving} class="grid min-w-0 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
            <label class="label">Region code<input class="field" bind:value={regionDraft.id} required maxlength="32" disabled={editingRegionId !== null} placeholder="na-east" /></label>
            <label class="label">Region name<input class="field" bind:value={regionDraft.name} required maxlength="100" placeholder="North America East" /></label>
            <div class="flex gap-2"><button type="submit" class="control primary">{editingRegionId ? 'Save region' : 'Add region'}</button>{#if editingRegionId}<button type="button" class="control" onclick={resetRegion}>Cancel</button>{/if}</div>
          </fieldset>
        </form>
        <div class="mt-3 space-y-2">{#each sortedRegions as region (region.id)}
          <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-parchment-300/15 p-3">
            <div class="min-w-0 flex-1"><p class="break-words text-sm text-parchment-50">{region.name}</p><p class="mt-1 break-words text-xs text-parchment-300">{region.id} · {assignedCount(region.id)} server{assignedCount(region.id) === 1 ? '' : 's'}</p></div>
            <div class="flex gap-2"><button class="control" aria-label={`Edit region ${region.name}`} disabled={saving} onclick={() => editRegion(region)}>Edit</button><button class="control" aria-label={`Delete region ${region.name}`} disabled={saving || assignedCount(region.id) > 0} title={assignedCount(region.id) ? 'Remove this region from its servers before deleting it.' : 'Delete this unassigned region'} onclick={() => void removeRegion(region)}>Delete</button></div>
          </div>
        {/each}</div>
      </details>
    {/if}
  </section>
{/if}

<style>
  .label { display: block; min-width: 0; color: #bcab89; font-size: .75rem; }
  .field { display: block; width: 100%; min-width: 0; margin-top: .35rem; border: 1px solid rgb(188 167 125 / .25); border-radius: .375rem; background: #0d0d0e; padding: .55rem .65rem; color: #f5ecd7; font-size: .875rem; }
  .field:disabled { opacity: .65; }
  .control { border: 1px solid rgb(188 167 125 / .25); border-radius: .375rem; padding: .5rem .75rem; color: #d8c9a7; font-size: .75rem; background: #0d0d0e; }
  .control:hover { border-color: #e45a35; }
  .control:disabled { opacity: .4; cursor: default; }
  .primary { border-color: rgb(228 90 53 / .6); background: rgb(119 38 25 / .35); color: #f5ecd7; }
</style>
