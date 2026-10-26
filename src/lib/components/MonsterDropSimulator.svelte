<script lang="ts">
  import { onDestroy, onMount, untrack } from 'svelte';
  import { afterNavigate, goto } from '$app/navigation';
  import { page as routePage } from '$app/state';
  import { i18n } from '#lib/i18n.js';
  import SearchableSelect from './SearchableSelect.svelte';
  import { matchesAllTerms } from '#lib/search-terms.js';
  import type { DropData } from '#lib/drop-calculator.js';
  import { treasureClassSource, type MonsterDropReport } from '#lib/monster-drop-calculator.js';
  import { countAdvancedMonsterDropSettings, readMonsterDropUrl, writeMonsterDropUrl, type MonsterDropSourceType } from '#lib/monster-drop-url.js';
  import { currentUrl } from '#lib/current-url.js';
  import { monsterDropTsv } from '#lib/monster-drop-export.js';
  import { DROP_RESULTS_PAGE_SIZE, dropResultsPage, dropResultsPageCount } from '#lib/drop-result-table.js';
  import { coverage, dropDistribution, formatPercent, rowShares, share } from '#lib/monster-drop-stats.js';
  import { DEFAULT_MONSTER_SORT, MONSTER_RESULT_COLUMNS, NOTABLE_CATEGORY, NOTABLE_CATEGORY_LABEL, categoryFilterLabel, defaultSortDesc, filterMonsterRows, isInternalOutcome,
    monsterCategories, monsterResultColumns, monsterResultsState, notableDrops, physicalDropSummary, presentMonsterRow, sortMonsterRows,
    type MonsterColumn, type MonsterColumnId } from '#lib/monster-drop-results.js';
  import { RESULT_PERSPECTIVES, activeFilters, leavesFor, missingItemHint, notableRecovery, perspectiveInfo, perspectiveOf, resultBasis, resultControls,
    type NotableRecovery } from '#lib/monster-drop-perspective.js';

  let { data }: { data: DropData } = $props();
  // Reads and writes start from the address bar: `routePage.url` misses shallow navigation updates.
  const initial = untrack(() => readMonsterDropUrl(currentUrl(routePage.url)));
  let sourceType = $state<MonsterDropSourceType>(initial.sourceType), treasureClass = $state(initial.treasureClass), level = $state(initial.level);
  let collapse = $state(initial.collapse), leaves = $state(initial.leaves), lastSimulate = false;
  let sourceId = $state(initial.sourceId), difficulty = $state(initial.difficulty), kills = $state(initial.kills);
  let players = $state(initial.players), party = $state(initial.party), magicFind = $state(initial.magicFind), seed = $state(initial.seed);
  let ready = $state(false), busy = $state(false), error = $state(''), status = $state(''), copyStatus = $state('');
  // Set while a row-shape change (perspective or Collapse similar) recalculates an existing result.
  let recalculating = $state(false);
  let report = $state<MonsterDropReport | null>(null);
  let search = $state(''), category = $state('all'), droppedOnly = $state(false), page = $state(0);
  // Only the clicked column shows the sort indicator, even when columns share a sort key.
  let sortColumn = $state<MonsterColumnId>(DEFAULT_MONSTER_SORT.column), sortDesc = $state(DEFAULT_MONSTER_SORT.desc);
  // Presentation only: toggling never reruns the worker or changes any value.
  let detailed = $state(false);
  // Presentation only: never read from or written to the URL, and toggling never reruns the worker.
  let advancedOpen = $state(false);
  const advancedActive = $derived(countAdvancedMonsterDropSettings({ seed }));
  let worker: Worker | undefined;
  let form: HTMLFormElement;
  const difficulties = ['Normal', 'Nightmare', 'Hell'];
  // Source pickers match every search word in any order; other selectors keep plain substring search.
  const sourceSearchHint = 'Search by name; use multiple words in any order to narrow results.';
  const kindLabel = (kind: string) => kind === 'quest' ? 'Quest boss' : kind;
  const areaLabel = (key: string | undefined) => key ? $i18n.t(key) : 'Fixed / summoned spawn';
  const options = $derived(data.Sources.filter(s => s.Difficulty === difficulty).map(s => ({ value: s.Id,
    label: `${$i18n.t(s.NameKey)} — ${kindLabel(s.Kind)} · ${areaLabel(s.AreaKey)} · Level ${s.Level}`
  })).sort((a,b) => a.label.localeCompare(b.label)));
  const classOptions = $derived(data.TreasureClasses.map(tc => ({ value: tc.Code, label: tc.Level ? `${tc.Code} · Level ${tc.Level}` : tc.Code }))
    .sort((a,b) => a.label.localeCompare(b.label)));
  const selectedClass = $derived(data.TreasureClasses.find(tc => tc.Code === treasureClass));
  const source = $derived(sourceType === 'tc'
    ? (selectedClass && level >= 1 && level <= 120 ? treasureClassSource(selectedClass.Code, difficulty, level) : undefined)
    : data.Sources.find(s => s.Id === sourceId && s.Difficulty === difficulty));
  const selection = $derived(sourceType === 'tc' ? treasureClass : sourceId);
  // The full selection, wrapped, so names cut short in the select stay readable.
  const sourceName = $derived(source ? (sourceType === 'tc' ? source.TreasureClass : $i18n.t(source.NameKey)) : '');
  const sourceMeta = $derived(source ? [sourceType === 'tc' ? 'Treasure class' : kindLabel(source.Kind), sourceType === 'tc' ? '' : areaLabel(source.AreaKey),
    difficulties[source.Difficulty], `Level ${source.Level}`, sourceType === 'tc' ? '' : source.TreasureClass, source.Kind === 'quest' ? 'Assumes the quest drop is active' : ''].filter(Boolean).join(' · ') : '');
  const categories = $derived(monsterCategories(detailed));
  const translate = (key: string) => $i18n.t(key);
  const activeColumn = $derived(MONSTER_RESULT_COLUMNS.find(column => column.id === sortColumn) ?? MONSTER_RESULT_COLUMNS[2]);
  const sortKey = $derived(activeColumn.sort ?? 'chance');
  const filtered = $derived(report ? filterMonsterRows(report, { category, search, droppedOnly, detailed }, translate) : []);
  const visible = $derived(sortMonsterRows(filtered, sortKey, sortDesc, !!report?.simulated, translate));
  const columns = $derived(report ? monsterResultColumns(report.simulated, detailed) : []);
  const summary = $derived(report ? physicalDropSummary(report) : null);
  const resultsState = $derived(report ? monsterResultsState(report, visible) : null);
  const listed = $derived(report ? report.rows.filter(row => detailed || !isInternalOutcome(row)).length : 0);
  // Uses the whole report regardless of table filters; rows and chances are shown unchanged.
  const notable = $derived(report ? notableDrops(report) : null);
  const recovery = $derived(notable ? notableRecovery(notable.limitation) : null);
  // Item drops = Treasure class leaves off; Treasure-class breakdown = leaves on. No other mode exists.
  const perspective = $derived(perspectiveOf(leaves));
  const controls = $derived(resultControls(perspective));
  const appliedFilters = $derived(activeFilters({ search, category, droppedOnly, simulated: !!report?.simulated }));
  const missingHint = $derived(missingItemHint({ perspective, collapse }));
  // The breakdown lists classes as well as items, so its counts are of rows.
  const noun = $derived(detailed ? 'results' : perspective === 'tc' ? 'rows' : 'items');
  const filtersActive = $derived(appliedFilters.length > 0);
  // Presentation only: these never rerun the worker or change any value.
  function setSearch(value: string) { search = value; page = 0; }
  function setCategory(value: string) { category = value; page = 0; }
  function resetFilters() { search = ''; category = 'all'; droppedOnly = false; page = 0; }
  function showInTable(name: string) { resetFilters(); search = name; }
  function sortBy(column: MonsterColumn) {
    if (!column.sort) return;
    if (sortColumn === column.id) sortDesc = !sortDesc; else { sortColumn = column.id; sortDesc = defaultSortDesc(column.sort); }
    page = 0;
  }
  // Row-shape options change which rows the worker produces, so an existing (or running) result is
  // recalculated with the same source, settings, seed and run type; filters and sorting are kept.
  function setRowShape(shape: { collapse?: boolean; leaves?: boolean }) {
    collapse = shape.collapse ?? collapse; leaves = shape.leaves ?? leaves;
    if (!report && !busy) return;
    run(lastSimulate);
    // A run that could not start must not leave the old rows under the new perspective's label.
    if (!busy && report) invalidate();
    recalculating = busy;
  }
  function recover(action: NotableRecovery['action']) { setRowShape(action === 'show-items' ? { leaves: false } : { collapse: false }); }
  function showDetailed(value: boolean) {
    detailed = value; page = 0;
    if (!value && category === 'no drop') category = 'all';
    if (!value && activeColumn.detailedOnly) { sortColumn = DEFAULT_MONSTER_SORT.column; sortDesc = DEFAULT_MONSTER_SORT.desc; }
  }
  // Shares always divide by every result of the run, never by the filtered rows.
  const distribution = $derived(report ? dropDistribution(report) : null);
  const covered = $derived(distribution ? coverage(visible, distribution) : null);
  const parts = $derived(distribution ? ([['noDrop', 'NoDrop', 'bg-parchment-300/50'], ['void', 'Void', 'bg-magic/70'], ['successful', 'Generated items', 'bg-ember-500']] as const)
    .map(([key, label, color]) => ({ key, label, color, expectedCount: distribution.expected[key], expected: share(distribution.expected[key], distribution.expected.total),
      count: distribution.simulated?.[key] ?? 0, simulated: distribution.simulated ? share(distribution.simulated[key], distribution.simulated.total) : null })) : []);
  const amount = (value: number) => value.toLocaleString('en-US', value > 0 && value < 1 ? {maximumSignificantDigits:3} : {maximumFractionDigits:2});
  // Joined in script because Svelte trims whitespace at the start of {#if} blocks.
  const help = $derived(report ? [
    'Chance per kill is the probability that one kill drops the result at least once; odds are the average number of kills for that.',
    'A result can drop more than once in a kill, so its count can be higher than its chance suggests.',
    'Gold and stacked items count once per pile or stack, not by quantity. Base equipment groups non-unique/set results by base, without affixes.',
    collapse && 'Collapsed rows combine every result in the group; their chance per kill is for at least one member of the group, not a particular item.',
    leaves && 'Treasure class rows credit each item to the nearest random-pick class that rolled it; items picked directly by a guaranteed (negative-pick) class stay as items.',
    leaves && collapse && 'All armo classes share one row, as do all weap classes.',
    !detailed && 'NoDrop and Void outcomes produce no item and are listed only with detailed statistics; hiding them does not change any chance.',
  ].filter(Boolean).join(' ') : '');
  const technical = $derived(report ? [
    'Terminal outcomes are the final results of treasure-class picks: generated items, NoDrop and Void. Nested treasure classes make their number per kill vary, so outcome shares are neither drop chances nor per-pick chances.',
    `Expected share divides a row's expected events by the expected events of all terminal outcomes; simulated share divides its events by all ${report.simulated ? report.totalDrops.toLocaleString() + ' ' : ''}terminal outcomes of the run. Filters never renormalize these shares.`,
    `Expected count is the theoretical average across ${report.kills.toLocaleString()} kills.`,
    "NoDrop and Void rows count picks that produced nothing; they don't use one of the six item slots. Their chance per kill is the chance of at least one such event.",
  ].join(' ') : '');
  function invalidate() { worker?.terminate(); worker = undefined; busy = false; recalculating = false; report = null; error = ''; page = 0; copyStatus = ''; }
  function run(simulate: boolean) {
    if (!source || !form?.reportValidity()) return;
    invalidate(); busy = true; lastSimulate = simulate;
    try {
      worker = new Worker(new URL('../monster-drop-calculator.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = event => { report = event.data.report ?? null; error = event.data.error ?? ''; busy = false; worker?.terminate(); worker = undefined; };
      worker.onerror = () => { error = 'Unable to calculate this source. Please try again.'; busy = false; worker?.terminate(); worker = undefined; };
      worker.postMessage($state.snapshot({data, source, settings:{players,party,magicFind,difficulty,kind:'all'},kills,seed,simulate,options:{collapse,leaves}}));
    } catch { busy = false; error = 'Unable to start the calculator.'; }
  }
  // The settings above were already read from the address bar, so syncing can start on mount.
  // `afterNavigate` alone is not enough: it only fires for navigations completed after mounting,
  // and switching modes mounts this component without a navigation (only a shallow navigation).
  onMount(() => { ready = true; });
  // Back/Forward and other real navigations restore the settings of the entry being shown.
  afterNavigate(({ shallow, type }) => {
    // This component's own URL writes are shallow gotos; they must not reset the settings.
    if (shallow && type === 'goto') return;
    invalidate();
    const restored = readMonsterDropUrl(currentUrl(routePage.url));
    sourceType = restored.sourceType; treasureClass = restored.treasureClass; level = restored.level; collapse = restored.collapse; leaves = restored.leaves;
    sourceId = restored.sourceId; difficulty = restored.difficulty; kills = restored.kills;
    players = restored.players; party = restored.party; magicFind = restored.magicFind; seed = restored.seed;
    ready = true;
    // Shared links restore settings; simulation runs only on explicit request.
  });
  $effect(() => {
    if (!ready) return;
    const current = currentUrl(routePage.url);
    const url = writeMonsterDropUrl(current,{sourceType,sourceId,treasureClass,level,difficulty,kills,players,party,magicFind,seed,collapse,leaves});
    if (url.href !== current.href) goto(url, { shallow: true, replace: true, state: routePage.state });
  });
  async function copyLink() {
    const url = writeMonsterDropUrl(currentUrl(routePage.url),{sourceType,sourceId,treasureClass,level,difficulty,kills,players,party,magicFind,seed,collapse,leaves});
    try { await navigator.clipboard.writeText(url.href); status = 'Link copied'; }
    catch { status = 'Copy the link from your address bar.'; }
  }
  // Copies every row matching the current filters, not just the visible page.
  async function copyTable() {
    if (!report || !source) return;
    const settings: [string, string | number][] = [
      ['Source', sourceType === 'tc' ? source.TreasureClass : $i18n.t(source.NameKey)], ['Source kind', source.Kind],
      ['Area', source.AreaKey ? $i18n.t(source.AreaKey) : ''], ['Difficulty', difficulties[source.Difficulty]], ['Monster level', source.Level],
      ['Players in game', players], ['Nearby party', party], ['Magic find %', magicFind],
      ['Rows', `${leaves ? 'treasure class leaves' : 'items'}${collapse ? ', collapsed similar' : ''}`],
      ['Filters', `type=${category}; text=${search || '(none)'}; seen this run only=${report.simulated && droppedOnly ? 'yes' : 'no'}; NoDrop and Void=${detailed ? 'shown' : 'hidden'}`],
      ['Sort', `${activeColumn.label} (${sortKey}) ${sortDesc ? 'descending' : 'ascending'}`]];
    try { await navigator.clipboard.writeText(monsterDropTsv(report, visible, settings, key => $i18n.t(key))); copyStatus = `Copied ${visible.length.toLocaleString()} rows as TSV`; }
    catch { copyStatus = 'Unable to access the clipboard.'; }
  }
  onDestroy(() => worker?.terminate());
</script>

<form bind:this={form} class="sim-form panel rounded-lg p-4 sm:p-6" onsubmit={event => {event.preventDefault();run(false);}}>
  <h2 class="display-text text-2xl">Monster drops &amp; simulation</h2>
  <p class="mt-1 text-sm text-parchment-300">Pick a drop source and game settings, then view drop rates or simulate kills.</p>
  <fieldset class="mt-4 min-w-0" data-testid="sim-source-group">
    <legend class="group-title">Drop source</legend>
    <div class="source-row">
      <div class="min-w-0">
        <span id="simulation-source-type-label" class="control-label">Source type</span>
        <div class="segmented" role="radiogroup" aria-labelledby="simulation-source-type-label">
          <label><input type="radio" name="simulation-source-type" value="monster" bind:group={sourceType} onchange={invalidate}/><span>Monster</span></label>
          <label><input type="radio" name="simulation-source-type" value="tc" bind:group={sourceType} onchange={invalidate}/><span>Treasure class</span></label>
        </div>
      </div>
      <label class="block min-w-0"><span class="control-label">Difficulty</span><select class="field w-full" bind:value={difficulty} onchange={() => {sourceId='';invalidate();}}>{#each difficulties as label,value}<option {value}>{label}</option>{/each}</select></label>
      <!-- The source select is the primary control: full width below desktop so long monster names have room. -->
      <div class="primary min-w-0">
        {#if sourceType === 'tc'}
          <SearchableSelect id="simulation-treasure-class" label="Treasure class" placeholder="Search for a treasure class…" options={classOptions} matches={matchesAllTerms} hint={sourceSearchHint}
            bind:value={() => treasureClass, value => {treasureClass=value;const tc=data.TreasureClasses.find(t => t.Code === value);if(tc?.Level)level=Math.min(120,tc.Level);invalidate();}} />
        {:else}
          <SearchableSelect id="simulation-monster" label="Monster / area" placeholder="Search for a monster…" {options} matches={matchesAllTerms} hint={sourceSearchHint}
            bind:value={() => sourceId, value => {sourceId=value;invalidate();}} />
        {/if}
      </div>
    </div>
    {#if sourceType === 'tc'}
      <div class="mt-4 grid items-start gap-x-4 gap-y-2 sm:grid-cols-[11rem_minmax(0,1fr)]">
        <label class="block min-w-0"><span class="control-label">Monster level</span><input class="field w-full" type="number" min="1" max="120" required aria-describedby="simulation-level-help" bind:value={level} oninput={invalidate}/></label>
        <p id="simulation-level-help" class="text-sm text-parchment-300 sm:mt-5">Required for a treasure class: it sets which uniques and sets can roll and their quality odds. The class is used exactly as chosen, without the monster-level class upgrade.</p>
      </div>
    {/if}
    {#if selection && !source}<p class="mt-3 text-requirement">{sourceType === 'tc' ? 'Choose a valid treasure class and monster level.' : 'This monster selection is no longer available. Choose another source.'}</p>{/if}
    {#if source}
      <div class="source-summary mt-3 rounded px-3 py-2" data-testid="sim-source-summary">
        <p class="text-parchment-50">{sourceName}</p>
        <p class="text-sm text-parchment-300">{sourceMeta}</p>
      </div>
    {/if}
  </fieldset>
  <fieldset class="mt-5 min-w-0" data-testid="sim-game-group">
    <legend class="group-title">Game settings</legend>
    <!-- Bottom-aligned so labels that wrap on narrow screens keep the fields in one row. -->
    <div class="grid grid-cols-3 items-end gap-3 sm:gap-4 lg:grid-cols-[repeat(3,minmax(0,14rem))]">
      <label class="block min-w-0"><span class="control-label">Players in game</span><select class="field w-full" bind:value={players} onchange={() => {party=Math.min(party,players);invalidate();}}>{#each Array.from({length:8},(_,i)=>i+1) as value}<option {value}>{value}</option>{/each}</select></label>
      <label class="block min-w-0"><span class="control-label">Nearby party</span><select class="field w-full" bind:value={party} onchange={invalidate}>{#each Array.from({length:players},(_,i)=>i+1) as value}<option {value}>{value}</option>{/each}</select></label>
      <label class="block min-w-0"><span class="control-label">Magic find %</span><input class="field w-full" type="number" min="0" max="10000" required bind:value={magicFind} oninput={invalidate}/></label>
    </div>
    <p class="mt-2 text-sm text-parchment-300">Nearby party includes you; for solo /players, leave it at 1.</p>
  </fieldset>
  <!-- Closed <details> keeps its controls rendered and bound; an invalid hidden field opens it so the browser can point at it. -->
  <details class="advanced mt-5 rounded border border-parchment-300/15" bind:open={advancedOpen} oninvalidcapture={event => { event.currentTarget.open = true; }} data-testid="sim-advanced">
    <summary class="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-parchment-200">
      <span class="advanced-title">Advanced settings</span>
      {#if advancedActive}<span class="active-count" data-testid="sim-advanced-active-count">{advancedActive} active<span class="sr-only">{` ${advancedActive === 1 ? 'setting differs' : 'settings differ'} from the defaults`}</span></span>{/if}
      <span class="text-xs text-parchment-300">Seed</span>
    </summary>
    <div class="grid items-start gap-x-4 gap-y-2 border-t border-parchment-300/15 p-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
      <label class="block min-w-0"><span class="control-label">Simulation seed</span><input class="field w-full" type="number" min="0" max="4294967295" required aria-describedby="simulation-seed-help" bind:value={seed} oninput={invalidate}/></label>
      <p id="simulation-seed-help" class="text-sm text-parchment-300 sm:mt-5">The same seed and settings repeat the same simulated run; change it for a fresh roll. Drop rates do not use it.</p>
    </div>
  </details>
  <!-- Two separate actions: theoretical rates, or one seeded run of the chosen number of kills. -->
  <div class="mt-5 grid gap-3 border-t border-parchment-300/15 pt-5 md:grid-cols-2" data-testid="sim-actions">
    <div class="action-card flex min-w-0 flex-col rounded p-3 sm:p-4">
      <p class="text-sm text-parchment-300"><span class="text-parchment-50">Drop rates</span> · calculated chance per kill, with no random rolls.</p>
      <div class="mt-auto pt-3"><button class="action rounded border border-parchment-300/30 px-5 py-2 disabled:opacity-40" type="submit" disabled={!source || busy}>View drop rates</button></div>
    </div>
    <div class="action-card flex min-w-0 flex-col rounded p-3 sm:p-4">
      <p id="simulation-kills-help" class="text-sm text-parchment-300"><span class="text-parchment-50">Simulation</span> · rolls this many kills using the seed in Advanced settings.</p>
      <div class="mt-auto flex items-end gap-3 pt-3">
        <label class="block w-28 min-w-0 shrink"><span class="control-label">Kills</span><input class="field w-full" type="number" min="1" max="100000" required aria-describedby="simulation-kills-help" bind:value={kills} oninput={invalidate}/></label>
        <button class="action shrink-0 whitespace-nowrap rounded border border-ember-400/50 bg-ember-700 px-4 py-2 disabled:opacity-40" type="button" disabled={!source || busy} onclick={() => run(true)}>Simulate kills</button>
      </div>
    </div>
  </div>
  <div class="mt-4 flex flex-wrap items-center gap-3">
    <button class="action rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-40" type="button" disabled={!source} onclick={copyLink}>Copy link</button>
    {#if busy}<button class="action rounded border border-parchment-300/30 px-4 py-2 text-sm" type="button" onclick={invalidate}>Cancel</button>{/if}
    {#if status}<p role="status" class="text-sm">{status}</p>{/if}
  </div>
</form>
{#snippet heading(column: MonsterColumn)}
  {@const active = sortColumn === column.id}
  <th title={column.title} class:num={column.numeric} class:secondary={column.secondary && !detailed} aria-sort={active ? (sortDesc ? 'descending' : 'ascending') : undefined}>
    {#if column.sort}<button type="button" class="text-left" onclick={() => sortBy(column)}>{column.label}<span aria-hidden="true">{active ? (sortDesc ? ' ▼' : ' ▲') : ''}</span></button>{:else}{column.label}{/if}
  </th>
{/snippet}
{#snippet cell(column: MonsterColumn, row: MonsterDropReport['rows'][number])}
  {@const view = presentMonsterRow(row, translate)}
  {#if column.id === 'name'}
    <td><span class="text-parchment-50">{view.name}</span>{#if detailed && view.code && view.code !== view.name}<span class="block text-xs text-parchment-300">{view.code}</span>{/if}
      {#if view.scope}<span class="block text-xs text-parchment-300">{view.scope}</span>{/if}
      {#if !detailed}<span class="block text-xs text-parchment-300 sm:hidden">{view.category}</span>{/if}</td>
  {:else if column.id === 'quality'}<td class:secondary={!detailed}>{view.category}</td>
  {:else if column.id === 'chance'}<td class="num"><span class={view.internal ? 'italic text-parchment-300' : 'text-parchment-50'}>{view.chance}</span>{#if !detailed}<span class="block text-xs text-parchment-300 sm:hidden">{view.odds}</span>{/if}</td>
  {:else if column.id === 'odds'}<td class="num" class:secondary={!detailed}>{view.odds}</td>
  {:else if column.id === 'count'}<td class="num">{row.count.toLocaleString()}</td>
  {:else if column.id === 'expected'}<td class="num">{amount(row.expected)}</td>
  {:else if column.id === 'expectedShare'}<td class="num">{formatPercent(rowShares(row, distribution!).expected)}</td>
  {:else if column.id === 'simulatedShare'}<td class="num">{formatPercent(rowShares(row, distribution!).simulated)}</td>
  {/if}
{/snippet}
<!-- The perspective switch is outside the live region so its own description is not re-announced with every result. -->
{#if source}
  <section class="perspective mt-6 min-w-0" aria-labelledby="result-perspective-label" data-testid="sim-perspective">
    <span id="result-perspective-label" class="control-label">Show results as</span>
    <!-- Item drops = Treasure class leaves off; Treasure-class breakdown = Treasure class leaves on (the sim_leaves URL setting). -->
    <div class="segmented perspective-switch" role="radiogroup" aria-labelledby="result-perspective-label" aria-describedby="result-perspective-help">
      {#each RESULT_PERSPECTIVES as option (option.value)}<label><input type="radio" name="result-perspective" value={option.value} checked={perspective === option.value}
        onchange={() => setRowShape({ leaves: leavesFor(option.value) })}/><span>{option.label}</span></label>{/each}
    </div>
    <p id="result-perspective-help" class="mt-2 text-sm text-parchment-300">{perspectiveInfo(perspective).description}{report || busy ? ' Switching recalculates this result with the same settings and seed.' : ''}</p>
  </section>
{/if}
<div class="results mt-4" aria-live="polite" aria-busy={busy}>
  {#if busy}<p class="panel rounded-lg p-8">{recalculating ? `Recalculating the ${perspective === 'tc' ? 'treasure-class breakdown' : 'item drops'} with the same source, settings and seed…` : 'Calculating the complete monster loot table…'}</p>
  {:else if error}<p role="alert" class="panel rounded-lg p-5 text-requirement"><strong>Results unavailable.</strong> {error} No partial loot run is shown.</p>
  {:else if report && summary}
    <h3 class="display-text text-xl">{sourceType === 'tc' ? source?.TreasureClass : $i18n.t(source?.NameKey)} · {report.kills.toLocaleString()} kills</h3>
    <p class="mt-2 text-sm text-parchment-300">{listed.toLocaleString()} possible {noun} · {report.treasureClass}</p>
    <section class="panel mt-4 rounded-lg p-4 sm:p-5" aria-label="Physical drops">
      {#if summary.observed}
        <p class="display-text text-lg text-parchment-50">{summary.observed.drops.toLocaleString()} physical {summary.observed.drops === 1 ? 'drop' : 'drops'} from {report.kills.toLocaleString()} {report.kills === 1 ? 'kill' : 'kills'}</p>
        <p class="mt-1 text-parchment-200"><strong>{amount(summary.observed.perKill)}</strong> drops per kill in this simulated run · Seed {report.seed}</p>
      {:else}
        <p class="text-parchment-200">Drop rates only: no kills were simulated. Choose Simulate kills for an observed run.</p>
      {/if}
      {#if summary.expectedPerKill !== null}<p class="mt-1 text-sm text-parchment-300">Expected drops per kill: {amount(summary.expectedPerKill)} (calculated average, not from the simulation)</p>{/if}
      <p class="mt-2 text-xs text-parchment-300">Physical drops are generated items: equipment, gold, potions, ammunition and other loot. A gold pile or stack counts as one drop; NoDrop and Void are not drops.</p>
    </section>
    {#if resultsState === 'no-items-possible'}<p role="status" class="panel mt-4 rounded-lg p-4 text-parchment-200">This source cannot drop any physical item with these settings: every outcome is NoDrop or Void.</p>
    {:else if resultsState === 'none-dropped'}<p role="status" class="panel mt-4 rounded-lg p-4 text-parchment-200">No physical items dropped in this simulated run. The chances per kill below are still the calculated odds.</p>{/if}
    {#if distribution && detailed}
      <section class="panel mt-4 rounded-lg p-4 sm:p-5" aria-label="Distribution of all terminal outcomes">
        <h4 class="text-xs uppercase tracking-widest text-parchment-300">Detailed statistics · terminal outcomes</h4>
        <p class="mt-2 text-parchment-200">{#if distribution.simulated}{distribution.simulated.total.toLocaleString()} simulated terminal outcomes · {report.kills ? amount(distribution.simulated.total / report.kills) : '—'} per kill · Seed {report.seed}{:else}{amount(distribution.expected.total)} expected terminal outcomes · {report.kills ? amount(distribution.expected.total / report.kills) : '—'} per kill{/if}</p>
        <p class="mt-1 text-sm text-parchment-300">Terminal outcomes per kill include NoDrop and Void{summary.observed ? `; physical drops per kill in this run: ${amount(summary.observed.perKill)}` : summary.expectedPerKill !== null ? `; expected physical drops per kill: ${amount(summary.expectedPerKill)}` : ''}.</p>
        <div class="mt-3 flex h-3 overflow-hidden rounded bg-white/5" aria-hidden="true">{#each parts as part}<div class={part.color} style:width={`${((distribution.simulated ? part.simulated : part.expected) ?? 0) * 100}%`} title={`${part.label}: ${formatPercent(distribution.simulated ? part.simulated : part.expected)}`}></div>{/each}</div>
        <dl class="mt-3 grid gap-3 text-sm sm:grid-cols-3">{#each parts as part}<div>
          <dt class="flex items-center gap-2 text-xs uppercase tracking-widest text-parchment-300"><span class={`inline-block h-2.5 w-2.5 rounded-sm ${part.color}`}></span>{part.label}</dt>
          {#if distribution.simulated}<dd class="mt-1 text-parchment-50">{part.count.toLocaleString()} · {formatPercent(part.simulated)} of simulated outcomes</dd>{/if}
          <dd class="mt-1 text-parchment-300">{formatPercent(part.expected)} of expected outcomes · {amount(part.expectedCount)}</dd>
        </div>{/each}</dl>
        {#if !distribution.reconciled}<p role="alert" class="mt-3 text-sm text-requirement">Row counts do not add up to the simulated outcome total; shares use the reported total.</p>{/if}
        <p class="mt-3 text-sm text-parchment-300">{technical}</p>
      </section>
    {/if}
    {#if notable}
      <section class="notable panel mt-4 rounded-lg p-4 sm:p-5" aria-labelledby="notable-drops-heading">
        <h4 id="notable-drops-heading" class="text-xs uppercase tracking-widest text-parchment-300">Most likely uniques, sets &amp; runes</h4>
        {#if !recovery || notable.top.length}<p class="mt-1 text-xs text-parchment-300">Highest calculated chance per kill among individual unique, set and rune results, not their value. Other items, such as orbs, stay under their own categories.</p>{/if}
        {#if notable.top.length}
          <ol class="mt-3 grid gap-2">{#each notable.top as row (row.id)}{@const view = presentMonsterRow(row, translate)}
            <li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded bg-white/5 px-3 py-2">
              <span class="min-w-0"><button type="button" class="text-left text-parchment-50 underline decoration-parchment-300/40 underline-offset-2" title="Show this item in the results table" onclick={() => showInTable(view.name)}>{view.name}</button>
                <span class="text-xs text-parchment-300"> · {view.category}</span></span>
              <span class="text-sm"><span class="text-parchment-50">{view.chance}</span> <span class="text-parchment-300">per kill · {view.odds}</span></span>
            </li>{/each}</ol>
        {:else if !recovery}
          <p class="mt-3 text-sm text-parchment-200">No unique, set or rune result can drop from this source with these settings.</p>
        {/if}
        <!-- Group and class chances are never split among members: the only remedy is switching the row representation. -->
        {#if recovery}<div class="mt-3 flex flex-wrap items-center gap-3" data-testid="sim-notable-recovery">
          <p class="min-w-0 flex-1 basis-64 text-sm text-parchment-200">{recovery.explanation}</p>
          <button class="action shrink-0 rounded border border-ember-400/50 bg-ember-700 px-4 py-2 text-sm" type="button" onclick={() => recover(recovery.action)}>{recovery.label}</button>
        </div>{/if}
      </section>
    {/if}
    <!-- Controls grouped by purpose: filters choose rows; grouping recalculates; the rest only change presentation or export. -->
    <div class="result-controls my-5 grid gap-3" data-testid="sim-result-controls">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-3" role="group" aria-label="Filter results" data-testid="sim-filters">
        <div class="flex min-w-0 max-w-full items-center gap-2">
          <label class="min-w-0 max-w-full"><span class="sr-only">{controls.searchLabel}</span><input class="field max-w-full" type="search" placeholder={controls.searchPlaceholder} bind:value={() => search, setSearch}/></label>
          {#if search}<button class="rounded border border-parchment-300/30 px-3 py-2 text-sm" type="button" onclick={() => setSearch('')}>Clear<span class="sr-only"> name filter</span></button>{/if}
        </div>
        <label class="min-w-0 max-w-full"><span class="sr-only">{controls.categoryLabel}</span><select class="field max-w-full" bind:value={() => category, setCategory}>{#each categories as value}<option {value}>{categoryFilterLabel(value)}</option>{/each}</select></label>
        <!-- Hidden in the breakdown, which cannot rank individual uniques and sets; the chosen category is kept either way. -->
        {#if controls.notableShortcut}<button class="rounded border px-4 py-2 text-sm" class:border-ember-400={category === NOTABLE_CATEGORY} class:bg-ember-700={category === NOTABLE_CATEGORY} class:border-parchment-300={category !== NOTABLE_CATEGORY}
          type="button" aria-pressed={category === NOTABLE_CATEGORY} title="Show only unique, set and rune results; other categories stay available in the type list"
          onclick={() => setCategory(category === NOTABLE_CATEGORY ? 'all' : NOTABLE_CATEGORY)}>{NOTABLE_CATEGORY_LABEL}</button>{/if}
      </div>
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div class="control-group" role="group" aria-labelledby="result-grouping-label">
          <span id="result-grouping-label" class="inline-label">Grouping</span>
          <label title="Group random armor bases, random weapon bases, all unique items and all set items; with treasure class leaves, group all armo classes and all weap classes. Recalculates with the same settings and seed."><input type="checkbox" checked={collapse} onchange={event => setRowShape({ collapse: event.currentTarget.checked })}/> Collapse similar <span class="text-xs text-parchment-300">(recalculates)</span></label>
        </div>
        {#if report.simulated}<div class="control-group" role="group" aria-labelledby="result-run-label">
          <span id="result-run-label" class="inline-label">This run</span>
          <label><input type="checkbox" bind:checked={droppedOnly} onchange={() => page=0}/> Only results seen this run</label>
        </div>{/if}
        <div class="control-group" role="group" aria-labelledby="result-report-label">
          <span id="result-report-label" class="inline-label">Technical</span>
          <label title="Show NoDrop and Void outcomes, terminal-outcome shares, expected counts and item codes. Uses the same results; nothing is recalculated."><input type="checkbox" checked={detailed} onchange={event => showDetailed(event.currentTarget.checked)}/> Show detailed statistics</label>
          <button class="rounded border border-parchment-300/30 px-3 py-1.5" type="button" title="Copy all rows matching the filters as tab-separated values" onclick={copyTable}>Copy table (TSV)</button>
          {#if copyStatus}<span role="status" class="text-sm">{copyStatus}</span>{/if}
        </div>
      </div>
    </div>
    <!-- What the table currently shows: perspective, grouping, simulated or theoretical, and which filters remove rows. -->
    <p class="view-state mb-2 text-sm text-parchment-200" data-testid="sim-view-state"><span class="text-parchment-50">{perspectiveInfo(perspective).label}</span>{collapse ? ' · collapsed similar' : ''} · {resultBasis(report)} · {appliedFilters.length ? `Filtered by ${appliedFilters.join(', ')}` : 'No filters applied'}</p>
    <p class="mb-2 text-sm text-parchment-300">Chance per kill is the probability that one kill drops the result at least once.{missingHint ? ` ${missingHint}` : ''}</p>
    <details class="advanced how-to mb-3 rounded border border-parchment-300/15" data-testid="sim-results-help">
      <summary class="cursor-pointer px-3 py-2 text-sm text-parchment-200"><span class="advanced-title">How to read these results</span></summary>
      <p class="border-t border-parchment-300/15 px-3 py-2 text-sm text-parchment-300">{help}</p>
    </details>
    <p role="status" class="mb-3 text-sm text-parchment-200">{#if visible.length !== listed}{visible.length.toLocaleString()} of {listed.toLocaleString()} {noun} match{#if detailed && covered}, covering {formatPercent(covered.expected)} of expected{report.simulated ? ` and ${formatPercent(covered.simulated)} of simulated` : ''} terminal outcomes. Shares still divide by all outcomes{/if}.{:else}{listed.toLocaleString()} {noun}{/if}
      {#if filtersActive}<button class="ml-2 underline underline-offset-2" type="button" onclick={resetFilters}>Reset filters</button>{/if}</p>
    <!-- The detailed table can be wider than the screen, so it scrolls inside its own keyboard-focusable panel. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="panel rounded-lg" class:overflow-x-auto={detailed} role={detailed ? 'region' : undefined} aria-label={detailed ? 'Detailed loot statistics' : undefined} tabindex={detailed ? 0 : undefined}>
      <table class="w-full text-left text-sm" class:detailed><thead class="border-b border-parchment-300/20 bg-white/5"><tr>
        {#each columns as column (column.id)}{@render heading(column)}{/each}
      </tr></thead>
        <tbody>{#each dropResultsPage(visible, page) as row (row.id)}<tr class="border-b border-white/5">{#each columns as column (column.id)}{@render cell(column, row)}{/each}</tr>
        {:else}<tr><td colspan={columns.length}>{#if resultsState === 'no-items-possible' && !detailed}No physical items can drop from this source.{:else}No {noun}{search.trim() ? ` named “${search.trim()}”` : ''} match the current filters{category !== 'all' ? ` in ${categoryFilterLabel(category)}` : ''}.{missingHint ? ` ${missingHint}` : ''}
          {#if filtersActive}<button class="ml-1 underline underline-offset-2" type="button" onclick={resetFilters}>Reset filters</button>{/if}{/if}</td></tr>{/each}</tbody>
      </table>
    </div>
    {#if visible.length>DROP_RESULTS_PAGE_SIZE}<div class="mt-4 flex justify-end gap-4"><button type="button" disabled={page===0} onclick={() => page--}>Previous</button><span>{page+1} / {dropResultsPageCount(visible.length)}</span><button type="button" disabled={(page+1)*DROP_RESULTS_PAGE_SIZE>=visible.length} onclick={() => page++}>Next</button></div>{/if}
  {/if}
</div>
<p class="mt-6 text-sm text-parchment-300">Each kill is independent and starts with unique items eligible to drop. These are ordinary, non-terrorized monsters. Game-completion drops are assumed to be unlocked. Sources with unsupported conditional drops cannot produce a complete loot simulation.</p>
<style>
  th,td {padding:0.8rem;overflow-wrap:anywhere;vertical-align:top;}
  th {font-weight:normal;}
  .num {text-align:right;}
  .num button {text-align:right;}
  button:focus-visible {outline:2px solid currentColor;outline-offset:2px;}
  .notable button {overflow-wrap:anywhere;}
  table.detailed {table-layout:fixed;min-width:56rem;}
  /* Category and odds are folded under the name and chance on narrow screens. */
  @media (max-width: 639.98px) {
    th,td {padding:0.6rem;}
    .secondary {display:none;}
  }
  /* Leaves room to scroll the last rows and pagination above the fixed Jump to Top button. */
  .results {padding-bottom:5rem;}
  /* Long perspective labels wrap instead of overflowing on phones. */
  .segmented.perspective-switch {max-width:34rem;grid-template-columns:repeat(2,minmax(0,1fr));}
  .segmented.perspective-switch span {white-space:normal;line-height:1.2;}
  .control-group {display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;}
  .inline-label {font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-parchment-300);}
  /* Form layout, matching the Find an item form: one label style and one field height throughout. */
  .group-title {margin-bottom:0.6rem;font-size:0.875rem;color:var(--color-parchment-200);}
  .control-label {display:block;margin-bottom:0.25rem;font-size:0.75rem;line-height:1rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-parchment-300);}
  .sim-form :global(.field), .segmented, .action {min-height:2.75rem;}
  /* The source select leads the form; its label keeps the shared height so fields stay aligned. */
  .primary :global(label) {color:var(--color-parchment-50);}
  .primary :global(.field) {border-color:rgb(228 90 53 / 0.5);}
  /* Scoped media queries: the site's px `lg` breakpoint sorts before the rem `sm` one, so `lg:` utilities cannot override `sm:` ones. */
  .source-row {display:grid;align-items:end;gap:0.75rem;}
  @media (min-width: 40rem) {
    .source-row {grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;}
    .source-row .primary {grid-column:span 2;}
  }
  @media (min-width: 1025px) {
    .source-row {grid-template-columns:18rem 11rem minmax(0,1fr);}
    .source-row .primary {grid-column:auto;}
  }
  .source-summary {border-left:3px solid var(--color-ember-500);background:rgb(255 255 255 / 0.04);overflow-wrap:anywhere;}
  .segmented {display:grid;grid-template-columns:1fr 1fr;overflow:hidden;border:1px solid rgb(188 167 125 / 0.28);border-radius:0.45rem;background:#0d0d0e;}
  .segmented label {position:relative;display:flex;cursor:pointer;}
  .segmented input {position:absolute;inset:0;margin:0;opacity:0;cursor:pointer;}
  .segmented span {display:flex;flex:1;align-items:center;justify-content:center;padding:0.5rem;white-space:nowrap;text-align:center;color:var(--color-parchment-200);}
  .segmented label + label span {border-left:1px solid rgb(188 167 125 / 0.28);}
  .segmented label:hover span {color:var(--color-parchment-50);}
  .segmented input:checked + span {background:var(--color-ember-700);color:var(--color-parchment-50);}
  .segmented input:focus-visible + span {outline:2px solid var(--color-ember-400);outline-offset:-2px;}
  .advanced, .action-card {background:rgb(0 0 0 / 0.15);}
  .action-card {border:1px solid rgb(188 167 125 / 0.15);}
  .advanced summary {list-style:none;}
  .advanced summary::-webkit-details-marker {display:none;}
  .advanced summary::before {content:'▸';display:inline-block;width:0.75rem;color:var(--color-parchment-300);transition:transform 0.15s;}
  .advanced[open] summary::before {transform:rotate(90deg);}
  .advanced summary:hover .advanced-title {color:var(--color-parchment-50);}
  .advanced summary:focus-visible {outline:2px solid var(--color-ember-400);outline-offset:2px;}
  .active-count {border:1px solid currentColor;border-radius:999px;padding:0 0.5rem;font-size:0.75rem;color:var(--color-ember-400);}
</style>
