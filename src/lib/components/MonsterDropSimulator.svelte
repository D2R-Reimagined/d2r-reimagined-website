<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { afterNavigate, replaceState } from '$app/navigation';
  import { page as routePage } from '$app/state';
  import { i18n } from '$lib/i18n';
  import SearchableSelect from './SearchableSelect.svelte';
  import type { DropData } from '$lib/drop-calculator';
  import type { MonsterDropReport } from '$lib/monster-drop-calculator';
  import { readMonsterDropUrl, writeMonsterDropUrl } from '$lib/monster-drop-url';

  let { data }: { data: DropData } = $props();
  const initial = untrack(() => readMonsterDropUrl(routePage.url));
  let sourceId = $state(initial.sourceId), difficulty = $state(initial.difficulty), kills = $state(initial.kills);
  let players = $state(initial.players), party = $state(initial.party), magicFind = $state(initial.magicFind), seed = $state(initial.seed);
  let ready = $state(false), busy = $state(false), error = $state(''), status = $state('');
  let report = $state<MonsterDropReport | null>(null);
  let search = $state(''), category = $state('all'), droppedOnly = $state(false), page = $state(0);
  let worker: Worker | undefined;
  let form: HTMLFormElement;
  const difficulties = ['Normal', 'Nightmare', 'Hell'];
  const options = $derived(data.Sources.filter(s => s.Difficulty === difficulty).map(s => ({ value: s.Id,
    label: `${$i18n.t(s.NameKey)} — ${s.Kind === 'quest' ? 'Quest boss' : s.Kind} · ${s.AreaKey ? $i18n.t(s.AreaKey) : 'Fixed / summoned spawn'} · Level ${s.Level}`
  })).sort((a,b) => a.label.localeCompare(b.label)));
  const source = $derived(data.Sources.find(s => s.Id === sourceId && s.Difficulty === difficulty));
  const categories = ['all', 'unique', 'set', 'rune', 'misc', 'other equipment'];
  const visible = $derived((report?.rows ?? []).filter(row => (category === 'all' || row.quality === category) &&
    (!droppedOnly || !report?.simulated || row.count > 0) && $i18n.t(row.nameKey).toLocaleLowerCase().includes(search.toLocaleLowerCase())));
  const percent = (chance: number) => `${(chance * 100).toLocaleString('en-US', {maximumSignificantDigits:5})}%`;
  function invalidate() { worker?.terminate(); worker = undefined; busy = false; report = null; error = ''; page = 0; }
  function run(simulate: boolean) {
    if (!source || !form?.reportValidity()) return;
    invalidate(); busy = true;
    try {
      worker = new Worker(new URL('../monster-drop-calculator.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = event => { report = event.data.report ?? null; error = event.data.error ?? ''; busy = false; worker?.terminate(); worker = undefined; };
      worker.onerror = () => { error = 'Unable to calculate this monster. Please try again.'; busy = false; worker?.terminate(); worker = undefined; };
      worker.postMessage($state.snapshot({data, sourceId, settings:{players,party,magicFind,difficulty,kind:'all'},kills,seed,simulate}));
    } catch { busy = false; error = 'Unable to start the calculator.'; }
  }
  afterNavigate(() => {
    invalidate();
    const restored = readMonsterDropUrl(routePage.url);
    sourceId = restored.sourceId; difficulty = restored.difficulty; kills = restored.kills;
    players = restored.players; party = restored.party; magicFind = restored.magicFind; seed = restored.seed;
    ready = true;
    // Shared links restore settings; simulation runs only on explicit request.
  });
  $effect(() => {
    if (!ready) return;
    const url = writeMonsterDropUrl(routePage.url,{sourceId,difficulty,kills,players,party,magicFind,seed});
    if (url.href !== routePage.url.href) replaceState(url,routePage.state);
  });
  async function copyLink() {
    try { await navigator.clipboard.writeText(routePage.url.href); status = 'Link copied'; }
    catch { status = 'Copy the link from your address bar.'; }
  }
  onDestroy(() => worker?.terminate());
</script>

<form bind:this={form} class="panel rounded-lg p-5 sm:p-7" onsubmit={event => {event.preventDefault();run(false);}}>
  <h2 class="display-text text-2xl">Monster drops &amp; simulation</h2>
  <p class="mt-2 text-sm text-parchment-300">Choose a monster to see its loot table, then simulate a full run of kills.</p>
  <div class="mt-5 grid items-end gap-5 sm:grid-cols-[12rem_1fr]">
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Difficulty</span><select class="field w-full" bind:value={difficulty} onchange={() => {sourceId='';invalidate();}}>{#each difficulties as label,value}<option {value}>{label}</option>{/each}</select></label>
    <SearchableSelect id="simulation-monster" label="Monster / area" placeholder="Search for a monster…" {options}
      bind:value={() => sourceId, value => {sourceId=value;invalidate();}} />
  </div>
  {#if sourceId && !source}<p class="mt-3 text-requirement">This monster selection is no longer available. Choose another source.</p>{/if}
  {#if source}<p class="mt-3 text-sm text-parchment-300">{difficulties[source.Difficulty]} · Level {source.Level} · {source.TreasureClass}{source.Kind === 'quest' ? ' · Assumes the quest drop is active' : ''}</p>{/if}
  <div class="mt-5 grid items-end gap-5 sm:grid-cols-2 xl:grid-cols-5">
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Kills to simulate</span><input class="field w-full" type="number" min="1" max="100000" required bind:value={kills} oninput={invalidate}/></label>
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Players in game</span><select class="field w-full" bind:value={players} onchange={() => {party=Math.min(party,players);invalidate();}}>{#each Array.from({length:8},(_,i)=>i+1) as value}<option {value}>{value}</option>{/each}</select></label>
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Nearby party (incl. you)</span><select class="field w-full" bind:value={party} onchange={invalidate}>{#each Array.from({length:players},(_,i)=>i+1) as value}<option {value}>{value}</option>{/each}</select></label>
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Magic find %</span><input class="field w-full" type="number" min="0" max="10000" required bind:value={magicFind} oninput={invalidate}/></label>
    <label><span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Simulation seed</span><input class="field w-full" type="number" min="0" max="4294967295" required bind:value={seed} oninput={invalidate}/></label>
  </div>
  <p class="mt-3 text-sm text-parchment-300">The same seed and settings repeat the same loot run. Change the seed for a fresh roll. For solo /players, leave nearby party at 1.</p>
  <div class="mt-5 flex flex-wrap gap-3">
    <button class="rounded border border-parchment-300/30 px-5 py-3 disabled:opacity-40" type="submit" disabled={!source || busy}>View drop rates</button>
    <button class="rounded border border-ember-400/50 bg-ember-700 px-5 py-3 disabled:opacity-40" type="button" disabled={!source || busy} onclick={() => run(true)}>Simulate kills</button>
    <button class="rounded border border-parchment-300/30 px-5 py-3 disabled:opacity-40" type="button" disabled={!source} onclick={copyLink}>Copy link</button>
    {#if busy}<button class="rounded border border-parchment-300/30 px-5 py-3" type="button" onclick={invalidate}>Cancel</button>{/if}
  </div>
  {#if status}<p role="status" class="mt-3 text-sm">{status}</p>{/if}
</form>
<div class="mt-6" aria-live="polite" aria-busy={busy}>
  {#if busy}<p class="panel rounded-lg p-8">Calculating the complete monster loot table…</p>
  {:else if error}<p role="alert" class="panel rounded-lg p-5 text-requirement">{error} No partial loot run is shown.</p>
  {:else if report}
    <h3 class="display-text text-xl">{$i18n.t(source?.NameKey)} · {report.kills.toLocaleString()} kills</h3>
    <p class="mt-2 text-sm text-parchment-300">{report.rows.length.toLocaleString()} possible item results · {report.treasureClass}</p>
    {#if report.simulated}<p class="mt-2 text-parchment-200">{report.totalDrops.toLocaleString()} drops · {report.emptyKills.toLocaleString()} empty kills · Seed {report.seed}</p>{/if}
    <div class="my-5 flex flex-wrap items-center gap-4">
      <label><span class="sr-only">Filter loot items</span><input class="field" placeholder="Filter loot items…" bind:value={search} oninput={() => page=0}/></label>
      <label><span class="sr-only">Loot category</span><select class="field" bind:value={category} onchange={() => page=0}>{#each categories as value}<option {value}>{value === 'all' ? 'All item types' : value}</option>{/each}</select></label>
      {#if report.simulated}<label><input type="checkbox" bind:checked={droppedOnly} onchange={() => page=0}/> Only items dropped this run</label>{/if}
    </div>
    <p class="mb-3 text-sm text-parchment-300">Chance / kill means at least one. Expected drops counts copies across {report.kills.toLocaleString()} kills. Gold and stacked items count drop events, not their quantities. Other equipment groups non-unique/set results by base, without affixes.</p>
    <div class="panel overflow-x-auto rounded-lg">
      <table class="w-full text-left text-sm"><thead class="border-b border-parchment-300/20 bg-white/5"><tr><th>Item</th><th>Type</th><th>Chance / kill</th><th>Expected drops</th>{#if report.simulated}<th>Simulated drops</th><th>Kills with item</th>{/if}</tr></thead>
        <tbody>{#each visible.slice(page*50,(page+1)*50) as row}<tr class="border-b border-white/5"><td>{$i18n.t(row.nameKey)}</td><td>{row.quality}</td><td>{percent(row.chance)}</td><td>{row.expected.toLocaleString('en-US',{maximumFractionDigits:3})}</td>{#if report.simulated}<td>{row.count.toLocaleString()}</td><td>{row.successfulKills.toLocaleString()}</td>{/if}</tr>
        {:else}<tr><td colspan={report.simulated ? 6 : 4}>No matching items.</td></tr>{/each}</tbody>
      </table>
    </div>
    {#if visible.length>50}<div class="mt-4 flex justify-end gap-4"><button type="button" disabled={page===0} onclick={() => page--}>Previous</button><span>{page+1} / {Math.ceil(visible.length/50)}</span><button type="button" disabled={(page+1)*50>=visible.length} onclick={() => page++}>Next</button></div>{/if}
  {/if}
</div>
<p class="mt-6 text-sm text-parchment-300">Each kill is independent and starts with unique items eligible to drop. These are ordinary, non-terrorized monsters. Sources with unsupported conditional drops cannot produce a complete loot simulation.</p>
<style>
  th,td {padding:0.8rem;overflow-wrap:anywhere;}
  th {font-weight:normal;}
  table {table-layout:fixed;min-width:42rem;}
</style>
