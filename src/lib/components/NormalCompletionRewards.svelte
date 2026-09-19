<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '$lib/auth';

  let { busy = $bindable(false), onGranted }: { busy?: boolean; onGranted: () => Promise<void> } = $props();
  type Ladder = { id: string; name: string; archivedAtUtc: string | null };
  type Player = { userId: string; displayName: string; email: string | null; characters: string[]; hasEmberReward: boolean };
  type PlayerList = { ladderId: string; ladderName: string; generatedAtUtc: string; players: Player[]; unreadableCharacters: number };
  const base = '/admin/portal-entitlements/normal-completion';
  let ladders = $state<Ladder[]>([]), ladderId = $state('');
  let list = $state<PlayerList | null>(null);
  let loading = $state(true), generating = $state(false), applying = $state(false), applied = $state(false);
  let error = $state(''), notice = $state('');
  let requestVersion = 0;
  const problem = (e: unknown) => e instanceof Error ? e.message : 'Could not update Normal completion rewards.';

  async function loadLadders() {
    loading = true; error = '';
    try { ladders = await apiRequest<Ladder[]>(base + '/ladders', {}, true); }
    catch (e) { error = problem(e); }
    finally { loading = false; }
  }
  function clearList() {
    requestVersion++; list = null; notice = ''; error = ''; applied = false;
  }
  async function generate() {
    if (!ladderId || busy) return;
    clearList();
    const version = requestVersion, id = ladderId;
    busy = generating = true;
    try {
      const result = await apiRequest<PlayerList>(`${base}/${id}/players`, {}, true);
      if (version === requestVersion && id === ladderId) list = result;
    } catch (e) { if (version === requestVersion) error = problem(e); }
    finally { busy = generating = false; }
  }
  async function applyEmber() {
    if (!list || !list.players.length || list.ladderId !== ladderId || busy || applied) return;
    const reviewed = list;
    busy = applying = true; error = ''; notice = '';
    try {
      const result = await apiRequest<{ granted: number; alreadyGranted: number }>(`${base}/${reviewed.ladderId}/ember`, {
        method: 'POST', body: JSON.stringify({ userIds: reviewed.players.map(player => player.userId) })
      }, true);
      applied = true;
      list = { ...reviewed, players: reviewed.players.map(player => ({ ...player, hasEmberReward: true })) };
      notice = `Ember granted to ${result.granted} account${result.granted === 1 ? '' : 's'}. ${result.alreadyGranted} already had the reward. Players can select it in the launcher.`;
      await onGranted();
    } catch (e) { error = problem(e); }
    finally { busy = applying = false; }
  }
  onMount(() => { void loadLadders(); });
</script>

<section class="panel mb-6 rounded-lg p-4 sm:p-6" aria-labelledby="normal-completion-heading">
  <h3 id="normal-completion-heading" class="display-text mb-3 text-xl">Normal completion reward</h3>
  <p class="mb-4 text-parchment-300">Find accounts with a saved Normal Baal quest completion in the selected ladder, then grant Ember to the listed players. Each account appears once, including completed runs from removed or fallen characters.</p>
  {#if error}<p role="alert" class="mb-4 text-requirement">{error}</p>{/if}
  {#if notice}<p role="status" class="mb-4 text-set">{notice}</p>{/if}
  {#if loading}
    <p>Loading ladders…</p>
  {:else if !ladders.length}
    <p class="text-parchment-300">No ladders are available.</p>
    <button class="mt-3 rounded border border-ember-400 px-4 py-2" disabled={busy} onclick={() => void loadLadders()}>Reload ladders</button>
  {:else}
    <label class="mb-4 block">Ladder
      <select class="mt-2 block w-full rounded bg-black/40 p-3" bind:value={ladderId} onchange={clearList} disabled={busy}>
        <option value="">Choose a ladder</option>
        {#each ladders as ladder}<option value={ladder.id}>{ladder.name}{ladder.archivedAtUtc ? ' (archived)' : ''}</option>{/each}
      </select>
    </label>
    <button class="rounded border border-ember-400 px-4 py-3 text-left disabled:opacity-50" disabled={busy || !ladderId} onclick={() => void generate()}>
      {generating ? 'Generating player list…' : 'Generate a list of all players that have completed normal'}
    </button>
  {/if}
  {#if list}
    <div class="mt-6">
      <p role="status" class="text-parchment-50">{list.players.length} qualifying account{list.players.length === 1 ? '' : 's'} — {list.ladderName}</p>
      <p class="mt-1 text-sm text-parchment-300">Generated {new Date(list.generatedAtUtc).toLocaleString()}. Generate again to include later completions.</p>
      {#if list.unreadableCharacters > 0}
        <p role="alert" class="mt-3 text-requirement">{list.unreadableCharacters} character snapshot{list.unreadableCharacters === 1 ? '' : 's'} could not be checked. Those characters were excluded; this list may be incomplete.</p>
      {/if}
      {#if list.players.length}
        <div class="mt-4 max-h-[32rem] overflow-auto rounded border border-parchment-300/20">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">Players who completed Normal in {list.ladderName}</caption>
            <thead class="bg-black/40 text-parchment-300"><tr><th scope="col" class="p-3">Player</th><th scope="col" class="p-3">Characters</th><th scope="col" class="p-3">Ember reward</th></tr></thead>
            <tbody>
              {#each list.players as player (player.userId)}
                <tr class="border-t border-parchment-300/15">
                  <td class="max-w-60 break-words p-3"><span class="block text-parchment-50">{player.displayName}</span><span class="text-xs text-parchment-300">{player.email ?? player.userId}</span></td>
                  <td class="max-w-48 break-words p-3">{player.characters.join(', ')}</td>
                  <td class="p-3">{player.hasEmberReward ? 'Already granted' : 'Ready to grant'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm text-parchment-300">Applies a permanent individual Ember reward to these {list.players.length} accounts. Existing rewards, packs, and selected portal effects stay unchanged.</p>
        <button class="mt-3 rounded border border-ember-400 bg-ember-950/30 px-4 py-3 disabled:opacity-50" disabled={busy || applied} onclick={() => void applyEmber()}>
          {applying ? 'Applying Ember…' : applied ? 'Ember applied' : 'Apply Ember portal effect to all listed players'}
        </button>
      {:else}
        <p class="mt-4 text-parchment-300">No players have a recorded Normal completion in this ladder yet.</p>
      {/if}
    </div>
  {/if}
</section>
