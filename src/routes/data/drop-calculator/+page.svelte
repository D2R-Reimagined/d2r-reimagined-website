<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { afterNavigate, replaceState } from '$app/navigation';
  import { page as routePage } from '$app/state';
  import { readDropUrl, writeDropUrl } from '$lib/drop-calculator-url';
  import { i18n } from '$lib/i18n';
  import { itemSuggestions, type DropItem, type DropQuality, type DropResult } from '$lib/drop-calculator';

  let { data } = $props();
  const initial = untrack(() => readDropUrl(routePage.url, data.drops.Items));
  let ready = $state(false);
  let shareStatus = $state('');
  let quality = $state<DropQuality>(initial.quality);
  let query = $state(untrack(() => $i18n.t(initial.selected?.NameKey)));
  let selected = $state<DropItem | null>(initial.selected);
  let open = $state(false);
  let active = $state(-1);
  let difficulty = $state(initial.difficulty);
  let kind = $state(initial.kind);
  let players = $state(initial.players);
  let party = $state(initial.party);
  let magicFind = $state(initial.magicFind);
  let busy = $state(false);
  let error = $state('');
  let results = $state<DropResult[] | null>(null);
  let calculatedItem = $state<DropItem | null>(null);
  let filter = $state(initial.filter);
  let showZero = $state(initial.showZero);
  let page = $state(0);
  let worker: Worker | undefined;
  let suggestions = $derived(itemSuggestions(data.drops.Items, query, quality, $i18n.t));
  let visible = $derived((results ?? []).filter(row =>
    (showZero || (row.chance !== null && row.chance > 0)) &&
    `${$i18n.t(row.source.NameKey)} ${$i18n.t(row.source.AreaKey)}`.toLocaleLowerCase().includes(filter.toLocaleLowerCase())));
  let unavailable = $derived((results ?? []).filter(row => row.chance === null).length);
  const difficulties = ['Normal', 'Nightmare', 'Hell'];
  const kinds: Record<string, string> = { all: 'All monsters', normal: 'Normal', champion: 'Champion', unique: 'Unique', superunique: 'Superunique', boss: 'Boss', quest: 'Quest boss' };
  const pageSize = 50;

  afterNavigate(() => {
    const restored = readDropUrl(routePage.url, data.drops.Items);
    invalidate();
    selected = restored.selected; quality = restored.quality;
    query = $i18n.t(selected?.NameKey); open = false; active = -1;
    difficulty = restored.difficulty; kind = restored.kind;
    players = restored.players; party = restored.party; magicFind = restored.magicFind;
    filter = restored.filter; showZero = restored.showZero;
    ready = true;
    if (selected) calculate();
  });

  $effect(() => {
    if (!ready) return;
    const state = { selected, quality, difficulty, kind, players, party, magicFind, filter, showZero };
    const url = writeDropUrl(routePage.url, state);
    if (url.href !== routePage.url.href) {
      replaceState(url, routePage.state);
      shareStatus = '';
    }
  });

  async function copyLink() {
    const url = writeDropUrl(routePage.url, { selected, quality, difficulty, kind, players, party, magicFind, filter, showZero });
    try {
      await navigator.clipboard.writeText(url.href);
      shareStatus = 'Link copied';
    } catch {
      shareStatus = 'Copy the link from your address bar to share this calculation.';
    }
  }

  function invalidate() {
    worker?.terminate(); worker = undefined;
    busy = false; results = null; error = ''; page = 0;
  }
  function select(item: DropItem) {
    invalidate(); selected = item; query = $i18n.t(item.NameKey); open = false; active = -1;
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'Escape') { open = false; return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); open = true;
      active = Math.max(0, Math.min(suggestions.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)));
      document.getElementById(`drop-option-${active}`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && open && suggestions.length) {
      event.preventDefault(); select(suggestions[Math.max(0, active)]);
    }
  }
  function calculate(event?: SubmitEvent) {
    event?.preventDefault();
    if (!selected) return;
    worker?.terminate(); busy = true; error = ''; results = null; page = 0;
    calculatedItem = selected;
    try {
    worker = new Worker(new URL('../../../lib/drop-calculator.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = event => {
      results = event.data.results ?? null; error = event.data.error ?? ''; busy = false;
      worker?.terminate(); worker = undefined;
    };
    worker.onerror = () => { error = 'Unable to calculate drops. Please try again.'; busy = false; worker?.terminate(); };
    worker.postMessage($state.snapshot({ data: data.drops, target: selected, settings: { difficulty, kind, players, party, magicFind } }));
    } catch {
      error = 'Unable to start the calculator. Please try again.'; busy = false; worker?.terminate();
    }
  }
  onDestroy(() => worker?.terminate());
  const percent = (chance: number) => chance === 0 ? '0%' : `${(chance * 100).toLocaleString('en-US', { maximumSignificantDigits: 5 })}%`;
</script>

<svelte:head>
  <title>Drop Calculator — D2R Reimagined</title>
  <meta name="description" content="Find where to farm unique items, set pieces, and runes in D2R Reimagined. Compare monster drop chances using the latest exported mod data." />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="data-page-hero mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <p class="mb-3 text-xs uppercase tracking-[0.22em] text-parchment-300">Plan your next hunt</p>
    <h1 class="display-text text-4xl sm:text-6xl">Drop Calculator</h1>
    <p class="data-page-description mx-auto mt-4 max-w-3xl text-lg text-parchment-300">Choose an item. Find the monsters most likely to drop it.</p>
  </div>
</section>

<section class="mx-auto max-w-7xl px-5 py-8">
  <form class="panel rounded-lg p-5 sm:p-7" onsubmit={calculate}>
    <div class="grid gap-5 sm:grid-cols-[12rem_1fr]">
      <label class="space-y-2"><span class="block text-parchment-200">Item type</span>
        <select class="field w-full" bind:value={quality} onchange={() => { invalidate(); selected = null; query = ''; open = false; }}>
          <option value="unique">Unique items</option><option value="set">Set items</option><option value="rune">Runes</option>
        </select>
      </label>
      <div class="relative space-y-2">
        <label for="drop-item" class="block text-parchment-200">Find an item</label>
        <input id="drop-item" class="field w-full" role="combobox" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0}
          aria-controls="drop-suggestions" aria-activedescendant={open && active >= 0 ? `drop-option-${active}` : undefined}
          autocomplete="off" placeholder="Type at least 3 characters…" bind:value={query}
          oninput={() => { invalidate(); selected = null; open = true; active = -1; }} onkeydown={keyboard}
          onfocus={() => { if (!selected) open = true; }} onblur={() => { open = false; }} />
        {#if open && query.trim().length >= 3}
          <div class="suggestions absolute z-20 max-h-72 w-full overflow-y-auto rounded border border-parchment-300/30 bg-abyss-900 shadow-xl" role="listbox" id="drop-suggestions" aria-label="Matching items">
            {#each suggestions as item, index}
              <button id={`drop-option-${index}`} type="button" role="option" aria-selected={active === index}
                class="block w-full border-b border-white/5 px-4 py-3 text-left hover:bg-white/10"
                class:highlighted={active === index} onpointerdown={event => event.preventDefault()} onclick={() => select(item)}>
                <span class:text-set={quality === 'set'} class:text-unique={quality === 'unique'}>{$i18n.t(item.NameKey)}</span>
              </button>
            {:else}<div class="px-4 py-3 text-parchment-300">No matching items.</div>{/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="drop-settings mt-5 grid gap-5 sm:grid-cols-2">
      <label class="space-y-2"><span class="block text-parchment-200">Difficulty</span><select class="field w-full" bind:value={difficulty} onchange={invalidate}>
        <option value={-1}>All difficulties</option>{#each difficulties as label, value}<option {value}>{label}</option>{/each}
      </select></label>
      <label class="space-y-2"><span class="block text-parchment-200">Monster type</span><select class="field w-full" bind:value={kind} onchange={invalidate}>
        {#each Object.entries(kinds) as [value, label]}<option {value}>{label}</option>{/each}
      </select></label>
      <label class="space-y-2"><span class="block text-parchment-200">Players in game</span><select class="field w-full" bind:value={players} onchange={() => { party = Math.min(party, players); invalidate(); }}>
        {#each Array.from({ length: 8 }, (_, i) => i + 1) as value}<option {value}>{value}</option>{/each}
      </select></label>
      <label class="space-y-2"><span class="block text-parchment-200">Nearby party <span class="text-xs">(incl. you)</span></span><select class="field w-full" bind:value={party} onchange={invalidate}>
        {#each Array.from({ length: players }, (_, i) => i + 1) as value}<option {value}>{value}</option>{/each}
      </select></label>
      <label class="space-y-2"><span class="block text-parchment-200">Magic find %</span><input class="field w-full" type="number" min="0" max="10000" step="1" bind:value={magicFind} oninput={invalidate} disabled={quality === 'rune'} /></label>
    </div>
    <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-parchment-300/15 pt-5">
      <p class="max-w-2xl text-sm text-parchment-300">{quality === 'rune' ? 'Magic find does not affect rune drops.' : 'Magic find improves item quality; more players reduce the chance of no drop.'} For solo /players settings, leave nearby party at 1.</p>
      <div class="flex items-center gap-3">
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-3 disabled:opacity-40" disabled={!selected} onclick={copyLink}>Copy link</button>
        <button class="calculate rounded border border-ember-400/50 bg-ember-700 px-7 py-3 text-parchment-50 hover:bg-ember-500 disabled:cursor-not-allowed disabled:opacity-40" disabled={!selected || busy} type="submit">{busy ? 'Calculating…' : 'Find drops'}</button>
      </div>
    </div>
    {#if shareStatus}<p class="mt-3 text-sm text-parchment-300" role="status">{shareStatus}</p>{/if}
  </form>

  <div class="mt-8" aria-live="polite" aria-busy={busy}>
    {#if busy}<div class="panel rounded-lg p-10 text-center text-parchment-300">Calculating monster drop chances…</div>
    {:else if error}<p role="alert" class="text-requirement">{error}</p>
    {:else if results !== null}
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div><p class="text-sm text-parchment-300">Where to farm</p><h2 class="display-text mt-1 text-2xl">{$i18n.t(calculatedItem?.NameKey)}</h2><p class="mt-2 text-sm text-parchment-300">{visible.length.toLocaleString()} monster / area results · Highest chance first</p></div>
        <div class="flex flex-wrap items-center gap-4"><label><span class="sr-only">Filter monsters or areas</span><input class="field" placeholder="Filter monster or area…" bind:value={filter} oninput={() => page = 0} /></label><label class="text-sm"><input type="checkbox" bind:checked={showZero} onchange={() => page = 0} /> Include zero / unavailable</label></div>
      </div>
      {#if unavailable}<p class="mb-4 text-sm text-parchment-300">{unavailable} results use conditional or unresolved drop rules and have no percentage. Enable “Include zero / unavailable” for details.</p>{/if}
      <div class="panel overflow-x-auto rounded-lg">
        <table class="w-full text-left text-sm"><thead class="border-b border-parchment-300/20 bg-white/5 text-parchment-300"><tr><th>Monster</th><th>Area</th><th>Difficulty</th><th>Level</th><th class="text-right">Chance / kill</th><th class="text-right">Average kills</th></tr></thead>
          <tbody>{#each visible.slice(page * pageSize, (page + 1) * pageSize) as row}
            <tr class="border-b border-white/5 hover:bg-white/5"><td><span class="text-parchment-50">{$i18n.t(row.source.NameKey)}</span><span class="mt-1 block text-xs text-parchment-300">{kinds[row.source.Kind] ?? row.source.Kind}</span></td><td class="text-parchment-200">{row.source.AreaKey ? $i18n.t(row.source.AreaKey) : 'Fixed / summoned spawn'}</td><td>{difficulties[row.source.Difficulty]}</td><td>{row.source.Level}</td><td class="text-right tabular-nums text-unique">{#if row.chance === null}<span title={row.reason}>Unavailable</span>{:else}{percent(row.chance)}{/if}</td><td class="text-right tabular-nums">{row.chance ? `1 in ${(1 / row.chance).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—'}</td></tr>
          {:else}<tr><td colspan="6" class="py-10 text-center text-parchment-300">No matching drops. Try another difficulty or monster type.</td></tr>{/each}</tbody>
        </table>
      </div>
      {#if visible.length > pageSize}<div class="mt-4 flex items-center justify-end gap-4 text-sm"><button type="button" class="rounded border border-parchment-300/25 px-4 py-2 disabled:opacity-30" disabled={page === 0} onclick={() => page--}>Previous</button><span>Page {page + 1} of {Math.ceil(visible.length / pageSize)}</span><button type="button" class="rounded border border-parchment-300/25 px-4 py-2 disabled:opacity-30" disabled={(page + 1) * pageSize >= visible.length} onclick={() => page++}>Next</button></div>{/if}
    {:else}<div class="panel rounded-lg px-6 py-10 text-center"><h2 class="display-text text-xl">What are you hunting?</h2><p class="mt-3 text-parchment-300">Search for a unique item, set piece, or rune above, then choose a suggestion to compare its drops.</p></div>{/if}
  </div>
  <details class="mt-8 text-sm text-parchment-300"><summary class="cursor-pointer text-parchment-200">How to read these chances</summary><div class="mt-3 max-w-4xl space-y-3 leading-relaxed">
    <p>Chance / kill is the probability of at least one selected item dropping from one monster. Average kills is the reciprocal of that chance, not a guarantee. Results use the current exported Reimagined data, treasure-class upgrades, item rarity, magic find, player no-drop scaling, and the six-item drop limit.</p>
    <p>Quest boss results assume the quest drop is active. These results cover ordinary, non-terrorized monsters. Conditional drops are marked unavailable. Unique items are assumed not to have already dropped in the current game. Area entries come from monster spawn tables; scripted spawns may not have an area listed.</p>
  </div></details>
</section>

<style>
  th, td { padding: 0.9rem 1rem; }
  th { white-space: nowrap; font-weight: normal; }
  .highlighted { background: rgb(255 255 255 / 0.1); }
  @media (min-width: 1025px) {
    .drop-settings { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  }
</style>
