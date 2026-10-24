<script lang="ts">
  import { onDestroy, tick, untrack } from 'svelte';
  import { afterNavigate, replaceState } from '$app/navigation';
  import { page as routePage } from '$app/state';
  import { countAdvancedDropFilters, readDropMode, readDropUrl, writeDropMode, writeDropUrl, type DropMode } from '$lib/drop-calculator-url';
  import { currentUrl } from '$lib/current-url';
  import { resumeItemMode } from '$lib/drop-mode-switch';
  import { checkDropForm, describeLevelRange, magicFindApplies, magicFindNote, maxLevelText, monsterLevelRange, partyForPlayers } from '$lib/drop-calculator-form';
  import { i18n } from '$lib/i18n';
  import MonsterDropSimulator from '$lib/components/MonsterDropSimulator.svelte';
  import SearchableSelect from '$lib/components/SearchableSelect.svelte';
  import type { DropItem, DropResult } from '$lib/drop-calculator';
  import { filterDropResults, hasPositiveChance, NEAR_CERTAIN_CHANCE, summarizeDropChances } from '$lib/drop-result-summary';
  import { DROP_DIFFICULTY_LABELS, DROP_KIND_LABELS, DROP_RESULTS_PAGE_SIZE, dropResultColumns, dropResultsPage, dropResultsPageCount, presentDropRow } from '$lib/drop-result-table';
  import { buildDropSearchIndex, categoryAllows, dropCategoryLabels, dropSuggestionLabel, MIN_DROP_QUERY_LENGTH, normalizeDropQuery, searchDropItems, showsDropBase, type DropCategory } from '$lib/drop-item-search';

  let { data } = $props();
  const levels = untrack(() => monsterLevelRange(data.drops.Sources));
  // Every read and write starts from the address bar: after shallow `replaceState` updates,
  // `routePage.url` (and the URL SvelteKit restores on Back/Forward) still holds the URL from
  // before the latest selection changes, and reading it would restore a cleared item or category.
  const initial = untrack(() => readDropUrl(currentUrl(routePage.url), data.drops.Items, levels));
  let mode = $state<DropMode>(untrack(() => readDropMode(currentUrl(routePage.url))));
  // Switching modes keeps the item calculation: its inputs cannot change while the simulator is
  // shown, and every input change still invalidates through its own handler. A calculation in
  // progress keeps running, so returning shows it instead of starting a second worker.
  function switchMode(next: DropMode) {
    if (next === mode) return;
    mode = next;
    replaceState(writeDropMode(currentUrl(routePage.url), next), routePage.state);
    if (next === 'item' && resumeItemMode({ selected, calculatedItem, hasResults: results !== null, busy, error }) === 'calculate') calculate();
  }
  let ready = $state(false);
  let shareStatus = $state('');
  let category = $state<DropCategory>(initial.category);
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
  let treasureClass = $state(initial.treasureClass);
  let minLevel = $state(initial.minLevel);
  let maxLevel = $state(initial.maxLevel);
  let kills = $state(initial.kills);
  // Typed text is validated separately; the numeric state above keeps the last valid values,
  // which are the only ones used for filtering, calculation, and the URL.
  let magicFindInput = $state(String(initial.magicFind));
  let minLevelInput = $state(String(initial.minLevel));
  let maxLevelInput = $state(maxLevelText(initial.maxLevel, levels));
  let killsInput = $state(String(initial.kills));
  let form = $state<HTMLFormElement>();
  let page = $state(0);
  // Presentation only: never read from or written to the URL, so bookmarks always open collapsed.
  let advancedOpen = $state(false);
  const advancedActive = $derived(countAdvancedDropFilters({ kind, party, treasureClass, minLevel, maxLevel, kills }));
  const treasureClasses = $derived(data.drops.TreasureClasses.map(tc => tc.Code).sort((a, b) => a.localeCompare(b)));
  const treasureClassOptions = $derived([
    ...(treasureClass && !treasureClasses.includes(treasureClass) ? [{ value: treasureClass, label: `${treasureClass} (unavailable)` }] : []),
    ...treasureClasses.map(code => ({ value: code, label: code }))
  ]);
  let worker: Worker | undefined;
  // The index depends only on the data and the active language, not on each keystroke.
  const searchIndex = $derived(buildDropSearchIndex(data.drops.Items, data.drops.Bases, $i18n.t));
  const search = $derived(searchDropItems(searchIndex, query, category));
  const suggestions = $derived(search.matches);
  const searching = $derived(normalizeDropQuery(query).length >= MIN_DROP_QUERY_LENGTH);
  const quality = $derived(selected?.Quality ?? (category === 'all' ? null : category));
  const mfApplies = $derived(magicFindApplies(quality));
  const check = $derived(checkDropForm({ magicFind: magicFindInput, minLevel: minLevelInput, maxLevel: maxLevelInput, kills: killsInput }, levels, mfApplies));
  const minLevelInvalid = $derived(!!check.errors.minLevel || !!check.levelRangeError);
  const maxLevelError = $derived(check.errors.maxLevel ?? check.levelRangeError);
  /** Native constraint validation blocks submission and lets the closed section reveal the field. */
  const validity = (message: string) => (node: HTMLInputElement) => { node.setCustomValidity(message); };
  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined;
  // Display filtering only: calculated rows are never recomputed when these filters change.
  const matched = $derived(filterDropResults(results ?? [], { treasureClass, minLevel, maxLevel, filter }, $i18n.t));
  let visible = $derived(showZero ? matched : matched.filter(hasPositiveChance));
  // Ranked from every matching row, not just the current table page.
  const summary = $derived(summarizeDropChances(matched));
  let unavailable = $derived(summary.unavailable);
  // Presentation only, like `advancedOpen`: switching views never recalculates, refilters, or
  // changes the page; it only chooses which formatted cells of the same rows are shown.
  let detailed = $state(false);
  const columns = $derived(dropResultColumns(detailed));
  const pageRows = $derived(dropResultsPage(visible, page).map(row => presentDropRow(row, $i18n.t)));
  let detailedResults = $state<HTMLElement>();
  function viewDetailedResults() {
    if (!detailedResults) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    detailedResults.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    detailedResults.focus({ preventScroll: true });
  }
  const difficulties = DROP_DIFFICULTY_LABELS;
  const kinds = DROP_KIND_LABELS;
  const pageSize = DROP_RESULTS_PAGE_SIZE;

  afterNavigate(() => {
    const address = currentUrl(routePage.url);
    mode = readDropMode(address);
    const restored = readDropUrl(address, data.drops.Items, levels);
    invalidate();
    selected = restored.selected; category = restored.category;
    query = $i18n.t(selected?.NameKey); open = false; active = -1;
    difficulty = restored.difficulty; kind = restored.kind;
    players = restored.players; party = restored.party; magicFind = restored.magicFind;
    filter = restored.filter; showZero = restored.showZero;
    treasureClass = restored.treasureClass; minLevel = restored.minLevel; maxLevel = restored.maxLevel; kills = restored.kills;
    magicFindInput = String(magicFind); minLevelInput = String(minLevel); maxLevelInput = maxLevelText(maxLevel, levels); killsInput = String(kills);
    ready = true;
    if (selected && mode === 'item') calculate();
  });

  $effect(() => {
    if (!ready) return;
    const state = { selected, category, difficulty, kind, players, party, magicFind, filter, showZero, treasureClass, minLevel, maxLevel, kills };
    const current = currentUrl(routePage.url);
    const url = writeDropUrl(current, state);
    if (url.href !== current.href) {
      replaceState(url, routePage.state);
      shareStatus = '';
    }
  });

  async function copyLink() {
    const url = writeDropUrl(currentUrl(routePage.url), { selected, category, difficulty, kind, players, party, magicFind, filter, showZero, treasureClass, minLevel, maxLevel, kills });
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
  // Typed values are validated on every keystroke but applied only on change (blur or Enter) or
  // submit, so a valid prefix typed on the way to an invalid value (99 while typing 999) never
  // filters results or reaches the URL. Invalid text keeps the previously applied values.
  function commitLevels() {
    if (!check.levelsValid) return;
    if (minLevel !== check.values.minLevel || maxLevel !== check.values.maxLevel) page = 0;
    minLevel = check.values.minLevel!; maxLevel = check.values.maxLevel!;
  }
  function commitMagicFind() { if (check.values.magicFind !== undefined) magicFind = check.values.magicFind; }
  function commitKills() { if (check.values.kills !== undefined) kills = check.values.kills; }
  /** Fallback when native validation is bypassed: open the advanced section and focus the first invalid field. */
  async function revealInvalid() {
    const field = form?.querySelector<HTMLInputElement>('input[aria-invalid="true"]:not(:disabled)');
    if (!field) return;
    if (field.closest('details')) { advancedOpen = true; await tick(); }
    field.focus();
  }
  function select(item: DropItem) {
    invalidate(); selected = item; query = $i18n.t(item.NameKey); open = false; active = -1;
  }
  function changeCategory() {
    // Keep the typed query; drop the selection only when the new filter excludes it.
    if (selected && !categoryAllows(category, selected)) { invalidate(); selected = null; }
    active = -1;
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'Escape') { open = false; active = -1; return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); open = true;
      if (!suggestions.length) { active = -1; return; }
      active = Math.max(0, Math.min(suggestions.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)));
      document.getElementById(`drop-option-${active}`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && open && searching) {
      // Enter commits a highlighted suggestion, or the only match; ambiguous text never picks one.
      event.preventDefault();
      if (active >= 0 && suggestions[active]) select(suggestions[active].item);
      else if (search.total === 1) select(suggestions[0].item);
    }
  }
  function calculate(event?: SubmitEvent) {
    event?.preventDefault();
    if (!selected) return;
    if (!check.valid) { if (event) revealInvalid(); return; }
    commitMagicFind(); commitKills(); commitLevels();
    worker?.terminate(); busy = true; error = ''; results = null; page = 0;
    calculatedItem = selected;
    try {
    worker = new Worker(new URL('../../../lib/drop-calculator.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = event => {
      results = event.data.results ?? null; error = event.data.error ?? ''; busy = false;
      worker?.terminate(); worker = undefined;
    };
    worker.onerror = () => { error = 'Unable to calculate drops. Please try again.'; busy = false; worker?.terminate(); };
    worker.postMessage($state.snapshot({ data: data.drops, target: selected, kills, settings: { difficulty, kind, players, party, magicFind } }));
    } catch {
      error = 'Unable to start the calculator. Please try again.'; busy = false; worker?.terminate();
    }
  }
  onDestroy(() => worker?.terminate());
</script>

<svelte:head>
  <title>Drop Calculator | D2R Reimagined</title>
  <meta name="description" content="Find where to farm unique items, set pieces, runes, and miscellaneous items in D2R Reimagined. Compare monster drop chances using the latest exported mod data." />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="data-page-hero mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <h1 class="display-text text-4xl sm:text-6xl">Drop Calculator</h1>
    <p class="data-page-description mx-auto mt-4 max-w-3xl text-lg text-parchment-300">Find where an item drops, or choose a monster and simulate its loot.</p>
  </div>
</section>

<section class="mx-auto max-w-7xl px-5 py-8">
  <div class="mb-6 flex gap-3" aria-label="Calculator mode">
    <button type="button" class="rounded border border-parchment-300/30 px-5 py-3" class:bg-ember-700={mode === 'item'} aria-pressed={mode === 'item'} onclick={() => switchMode('item')}>Find an item</button>
    <button type="button" class="rounded border border-parchment-300/30 px-5 py-3" class:bg-ember-700={mode === 'simulate'} aria-pressed={mode === 'simulate'} onclick={() => switchMode('simulate')}>Monster simulator</button>
  </div>
  {#if mode === 'simulate'}
    <MonsterDropSimulator data={data.drops} />
  {:else}
  <form class="drop-form panel rounded-lg p-4 sm:p-6" bind:this={form} onsubmit={calculate}>
    <div class="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
      <div class="relative min-w-0">
        <label for="drop-item" class="primary-label">Find an item</label>
        <input id="drop-item" class="field primary-search w-full" role="combobox" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0}
          aria-controls="drop-suggestions" aria-activedescendant={open && active >= 0 ? `drop-option-${active}` : undefined}
          autocomplete="off" placeholder="Item or base name, e.g. Shako…" bind:value={query}
          oninput={() => { invalidate(); selected = null; open = true; active = -1; }} onkeydown={keyboard}
          onfocus={() => { if (!selected) open = true; }} onblur={() => { open = false; }} />
        {#if open && searching}
          <div class="suggestions absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded border border-parchment-300/30 bg-abyss-900 shadow-xl">
            {#if suggestions.length}
              <div class="suggestion-list overflow-y-auto overscroll-contain" role="listbox" id="drop-suggestions" aria-label="Matching items">
                {#each suggestions as entry, index (entry.item.Id)}
                  <button id={`drop-option-${index}`} type="button" role="option" aria-selected={active === index} aria-label={dropSuggestionLabel(entry)}
                    class="block w-full border-b border-white/5 px-4 py-2.5 text-left hover:bg-white/10"
                    class:highlighted={active === index} onpointerdown={event => event.preventDefault()} onclick={() => select(entry.item)}>
                    <span class="flex items-baseline justify-between gap-3">
                      <span class="min-w-0" class:text-set={entry.item.Quality === 'set'} class:text-unique={entry.item.Quality === 'unique'} class:text-parchment-50={entry.item.Quality === 'rune' || entry.item.Quality === 'misc'}>{entry.name}</span>
                      <span class={`category-tag category-${entry.item.Quality} shrink-0`}>{dropCategoryLabels[entry.item.Quality]}</span>
                    </span>
                    {#if showsDropBase(entry)}<span class="mt-0.5 block text-xs text-parchment-300">{entry.base}</span>{/if}
                  </button>
                {/each}
              </div>
            {:else}<div class="px-4 py-3 text-parchment-300" role="status">No matching items{category === 'all' ? '' : ' in this category'}.</div>{/if}
            {#if search.total > suggestions.length}
              <p class="border-t border-parchment-300/20 px-4 py-2 text-xs text-parchment-300" role="status">Showing {suggestions.length} of {search.total.toLocaleString()} matches. Type more of the name or choose a category to narrow the list.</p>
            {/if}
          </div>
        {/if}
      </div>
      <label class="block min-w-0"><span class="control-label">Category <span class="normal-case tracking-normal">(optional)</span></span>
        <select class="field category-select w-full" bind:value={category} onchange={changeCategory}>
          <option value="all">All items</option><option value="unique">Unique items</option><option value="set">Set items</option><option value="rune">Runes</option><option value="misc">Misc items</option>
        </select>
      </label>
    </div>
    <!-- Top-aligned so a note or error under one field does not shift its neighbours. -->
    <div class="mt-5 grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
      <label class="col-span-2 block min-w-0 sm:col-span-1"><span class="control-label">Difficulty</span><select class="field w-full" bind:value={difficulty} onchange={invalidate}>
        <option value={-1}>All difficulties</option>{#each difficulties as label, value}<option {value}>{label}</option>{/each}
      </select></label>
      <label class="block min-w-0 self-start"><span class="control-label">Players in game</span><select class="field w-full" bind:value={players} onchange={() => { party = partyForPlayers(party, players); invalidate(); }}>
        {#each Array.from({ length: 8 }, (_, i) => i + 1) as value}<option {value}>{value}</option>{/each}
      </select></label>
      <div class="min-w-0 self-start">
        <label for="drop-magic-find" class="control-label">Magic find %</label>
        <input id="drop-magic-find" class="field w-full" type="text" inputmode="numeric" autocomplete="off" disabled={!mfApplies}
          aria-invalid={mfApplies && !!check.errors.magicFind} aria-describedby={describedBy(!mfApplies && 'drop-magic-find-note', mfApplies && !!check.errors.magicFind && 'drop-magic-find-error')}
          bind:value={magicFindInput} oninput={invalidate} onchange={commitMagicFind} {@attach validity(mfApplies ? check.errors.magicFind ?? '' : '')} />
        {#if !mfApplies}<p id="drop-magic-find-note" class="field-note">{magicFindNote(quality)}</p>
        {:else if check.errors.magicFind}<p id="drop-magic-find-error" class="field-error">{check.errors.magicFind}</p>{/if}
      </div>
    </div>
    <p class="mt-2 text-sm text-parchment-300">{mfApplies ? 'Magic find improves item quality; more players reduce the chance of no drop.' : 'More players reduce the chance of no drop.'}</p>
    <!-- Closed <details> keeps its controls rendered and bound; an invalid hidden field opens it so the browser can point at it. -->
    <details class="advanced mt-5 rounded border border-parchment-300/15" bind:open={advancedOpen} oninvalidcapture={event => { event.currentTarget.open = true; }}>
      <summary class="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-parchment-200">
        <span class="advanced-title">Advanced settings</span>
        {#if advancedActive}<span class="active-count" data-testid="advanced-active-count">{advancedActive} active<span class="sr-only">{` ${advancedActive === 1 ? 'setting differs' : 'settings differ'} from the defaults`}</span></span>{/if}
        <span class="hidden text-xs text-parchment-300 md:inline">Monster type, party, treasure class, levels, kills</span>
      </summary>
      <div class="space-y-5 border-t border-parchment-300/15 p-4">
        <fieldset class="min-w-0">
          <legend class="group-title">Monsters and party</legend>
          <div class="grid items-start gap-4 sm:grid-cols-3">
            <label class="block min-w-0 self-start"><span class="control-label">Monster type</span><select class="field w-full" bind:value={kind} onchange={invalidate}>
              {#each Object.entries(kinds) as [value, label]}<option {value}>{label}</option>{/each}
            </select></label>
            <label class="block min-w-0 self-start"><span class="control-label">Nearby party <span class="normal-case tracking-normal">(incl. you)</span></span><select class="field w-full" bind:value={party} onchange={invalidate}>
              {#each Array.from({ length: players }, (_, i) => i + 1) as value}<option {value}>{value}</option>{/each}
            </select></label>
            <div class="min-w-0 self-start">
              <label for="drop-kills" class="control-label">Kills per monster</label>
              <input id="drop-kills" class="field w-full" type="text" inputmode="numeric" autocomplete="off" required
                aria-invalid={!!check.errors.kills} aria-describedby={check.errors.kills ? 'drop-kills-error' : undefined}
                bind:value={killsInput} oninput={invalidate} onchange={commitKills} {@attach validity(check.errors.kills ?? '')} />
              {#if check.errors.kills}<p id="drop-kills-error" class="field-error">{check.errors.kills}</p>{/if}
            </div>
          </div>
          <p class="mt-2 text-sm text-parchment-300">For solo /players settings, leave nearby party at 1.</p>
        </fieldset>
        <fieldset class="min-w-0">
          <legend class="group-title">Drop source filters</legend>
          <div class="grid items-start gap-4 sm:grid-cols-3">
            <SearchableSelect id="drop-treasure-class" label="Treasure class (TC)"
              placeholder="All treasure classes" options={treasureClassOptions}
              bind:value={() => treasureClass, value => { treasureClass = value; page = 0; }} />
            <div class="min-w-0">
              <label for="drop-min-level" class="control-label">Min monster level</label>
              <input id="drop-min-level" class="field w-full" type="text" inputmode="numeric" autocomplete="off" required
                aria-invalid={minLevelInvalid} aria-describedby={describedBy(check.errors.minLevel && 'drop-min-level-error', !check.errors.minLevel && check.levelRangeError && 'drop-max-level-error', 'drop-level-help')}
                bind:value={minLevelInput} onchange={commitLevels} {@attach validity(check.errors.minLevel ?? '')} />
              {#if check.errors.minLevel}<p id="drop-min-level-error" class="field-error">{check.errors.minLevel}</p>{/if}
            </div>
            <div class="min-w-0">
              <!-- The "Any level" placeholder and the help text below explain that this field is optional. -->
              <label for="drop-max-level" class="control-label">Max monster level</label>
              <input id="drop-max-level" class="field w-full" type="text" inputmode="numeric" autocomplete="off" placeholder="Any level"
                aria-invalid={!!maxLevelError} aria-describedby={describedBy(maxLevelError && 'drop-max-level-error', 'drop-level-help')}
                bind:value={maxLevelInput} onchange={commitLevels} {@attach validity(maxLevelError ?? '')} />
              {#if maxLevelError}<p id="drop-max-level-error" class="field-error">{maxLevelError}</p>{/if}
            </div>
          </div>
          <p id="drop-level-help" class="mt-2 text-sm text-parchment-300">Monster levels range from {levels.min} to {levels.max}. Leave the maximum empty for any level, or set both to the same number for an exact level. TC filters use the monster's treasure class after level upgrades.</p>
        </fieldset>
      </div>
    </details>
    <div class="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-parchment-300/15 pt-5">
      {#if shareStatus}<p class="mr-auto w-full text-sm text-parchment-300 sm:w-auto" role="status">{shareStatus}</p>{/if}
      <!-- The address bar keeps the last valid values, so sharing waits until the typed values are valid too. -->
      <button type="button" class="action w-full rounded border border-parchment-300/30 px-4 py-3 disabled:opacity-40 sm:w-auto" disabled={!selected || !check.valid} title={check.valid ? undefined : 'Correct the highlighted fields to share this calculation.'} onclick={copyLink}>Copy link</button>
      <button class="calculate action w-full rounded border border-ember-400/50 bg-ember-700 px-7 py-3 text-parchment-50 hover:bg-ember-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto" disabled={!selected || busy} type="submit">{busy ? 'Calculating…' : 'Find drops & simulate'}</button>
    </div>
  </form>

  <div class="mt-8" aria-live="polite" aria-busy={busy}>
    {#if busy}<div class="panel rounded-lg p-10 text-center text-parchment-300">Calculating monster drop chances…</div>
    {:else if error}<p role="alert" class="text-requirement">{error}</p>
    {:else if results !== null}
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div><p class="text-sm text-parchment-300">Where to farm</p><h2 class="display-text mt-1 text-2xl">{$i18n.t(calculatedItem?.NameKey)}</h2><p class="mt-2 text-sm text-parchment-300">{visible.length.toLocaleString()} monster / area results · Highest chance first</p></div>
        <div class="flex flex-wrap items-center gap-4"><label><span class="sr-only">Filter monsters or areas</span><input class="field" placeholder="Filter monster or area…" bind:value={filter} oninput={() => page = 0} /></label><label class="text-sm"><input type="checkbox" bind:checked={showZero} onchange={() => page = 0} /> Include zero / unavailable</label></div>
      </div>
      {#if !check.levelsValid}<p class="level-notice mb-4 rounded border px-4 py-3 text-sm" role="status" data-testid="level-filter-notice">The monster level fields in Advanced settings need correcting, so results still show {describeLevelRange(minLevel, maxLevel)}.</p>{/if}
      <section class="top-chances panel mb-6 rounded-lg p-4 sm:p-5" aria-labelledby="top-chances-title" data-testid="top-chances">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 id="top-chances-title" class="display-text text-xl">Highest chances per kill</h3>
            <p class="mt-1 text-sm text-parchment-300">Ranked by calculated chance per kill. Actual farming efficiency also depends on clear speed, monster availability, and travel time.</p>
          </div>
          <button type="button" class="action shrink-0 rounded border border-parchment-300/30 px-4 py-2 text-sm hover:bg-white/10" aria-controls="drop-detailed-results" onclick={viewDetailedResults}>Explore all results</button>
        </div>
        {#if summary.top.length}
          <ol class="mt-4 divide-y divide-white/5 border-t border-parchment-300/15">
            {#each summary.top as row, index (row.source.Id)}
              {@const view = presentDropRow(row, $i18n.t)}
              <li class="top-chance py-3">
                <span class="rank tabular-nums" aria-hidden="true">{index + 1}</span>
                <div class="min-w-0">
                  <p class="text-parchment-50">{view.monster} <span class="text-xs text-parchment-300">· {view.kind}</span></p>
                  <p class="mt-0.5 text-sm text-parchment-300">{view.area} · {view.difficulty} · {view.level}</p>
                </div>
                <p class="odds tabular-nums"><span class="text-unique">{view.chance}</span><span class="block text-sm text-parchment-300">{view.odds}<span class="sr-only"> kills on average</span></span></p>
              </li>
            {/each}
          </ol>
          {#if summary.positive > summary.top.length}<p class="mt-2 text-xs text-parchment-300">Top {summary.top.length} of {summary.positive.toLocaleString()} matching results with a calculated chance above zero.</p>{/if}
        {:else}
          <p class="mt-4 border-t border-parchment-300/15 pt-4 text-sm text-parchment-200" role="status" data-testid="top-chances-empty">No matching monster has a confirmed drop chance above zero for these settings and filters.{#if summary.unavailable}{' '}{summary.unavailable.toLocaleString()} {summary.unavailable === 1 ? 'result uses' : 'results use'} conditional or unresolved drop rules that the calculator cannot evaluate, so {summary.unavailable === 1 ? 'it is' : 'they are'} not ranked here. {summary.unavailable === 1 ? 'It is' : 'They are'} marked Unavailable in all results{showZero ? '' : ' when “Include zero / unavailable” is on'}.{/if}</p>
        {/if}
      </section>
      <div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 id="drop-detailed-results" class="detailed-title text-lg text-parchment-50" tabindex="-1" bind:this={detailedResults}>All results</h3>
        <label class="text-sm"><input type="checkbox" bind:checked={detailed} data-testid="detailed-statistics-toggle" /> Show detailed statistics</label>
      </div>
      <details class="chance-help mb-4 rounded border border-parchment-300/15 text-sm text-parchment-300" data-testid="chance-help">
        <summary class="cursor-pointer px-4 py-2.5 text-parchment-200">How to read these chances</summary>
        <div class="space-y-3 border-t border-parchment-300/15 px-4 py-3 leading-relaxed">
          <dl class="chance-terms">
            <dt>Chance / kill</dt><dd>The probability that one kill of that monster drops at least one selected item.</dd>
            <dt>Odds (average kills)</dt><dd>“1 in N” is the reciprocal of the chance per kill: the average number of kills per success over a long run, not a countdown or a guarantee.</dd>
            <dt>Expected successful kills</dt><dd>Kills per monster ({kills.toLocaleString()}) × chance per kill: the average number of successful kills over many runs of that many kills. It counts kills dropping at least one selected item, not total copies.</dd>
            <dt>Chance of at least one success</dt><dd>The probability that at least one of {kills.toLocaleString()} independent kills succeeds: 1 − (1 − chance per kill)<sup>{kills.toLocaleString()}</sup>.</dd>
            <dt>Simulated successful kills</dt><dd>One random run of {kills.toLocaleString()} independent kills per monster. Each run varies; expected results are averages.</dd>
          </dl>
          <p>An expected value is not a guarantee: at 1 in 1,000 odds, 1,000 kills average one success but give only about a 63% chance of at least one. Unless the chance per kill is exactly 100%, a run with no drop stays possible, so very high cumulative chances below 100% are shown as {NEAR_CERTAIN_CHANCE} rather than 100%.</p>
          <p>0% means the current data and settings give that monster no way to drop the item. Unavailable means the result depends on conditional or unresolved drop rules the calculator cannot evaluate; it is not a zero chance. Show detailed statistics to see the reason, treasure class, monster level, and simulation columns.</p>
          <p>Results use the current exported Reimagined data, treasure-class upgrades, item rarity, magic find, player no-drop scaling, and the six-item drop limit. Quest boss results assume the quest drop is active. Game-completion drops are assumed to be unlocked. These results cover ordinary, non-terrorized monsters. Unique items are assumed not to have already dropped in the current game. Area entries come from monster spawn tables; scripted spawns may not have an area listed.</p>
        </div>
      </details>
      {#if unavailable}<p class="mb-4 text-sm text-parchment-300">{unavailable} results use conditional or unresolved drop rules and have no percentage. Enable “Include zero / unavailable” for details.</p>{/if}
      <!-- Compact fits its container (area and difficulty stack into the monster cell on narrow screens);
           detailed keeps the original full table, which scrolls inside this region rather than the page. -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus this region to scroll the table.) -->
      <div class="drop-results panel overflow-x-auto rounded-lg" class:detailed role="region" aria-label={detailed ? 'Drop results with detailed statistics, scroll horizontally on smaller screens' : 'Drop results'} tabindex="0" data-testid="drop-results" data-view={detailed ? 'detailed' : 'compact'}>
        <table class="w-full text-left text-sm"><thead class="border-b border-parchment-300/20 bg-white/5 text-parchment-300"><tr>{#each columns as column (column.id)}<th scope="col" class={`col-${column.id}`} class:text-right={column.numeric}>{column.label}{#if column.id === 'chance'}<span class="stack-meta">and odds</span>{/if}</th>{/each}</tr></thead>
          <tbody>{#each pageRows as row}
            <tr class="border-b border-white/5 hover:bg-white/5" data-state={row.state}>
              {#each columns as column (column.id)}
                {#if column.id === 'monster'}<td class="col-monster"><span class="text-parchment-50">{row.monster}</span><span class="mt-1 block text-xs text-parchment-300">{row.kind} · {row.level}</span><span class="stack-meta mt-1 text-xs text-parchment-200">{row.area} · {row.difficulty}</span></td>
                {:else if column.id === 'area'}<td class="col-area text-parchment-200">{row.area}</td>
                {:else if column.id === 'difficulty'}<td class="col-difficulty">{row.difficulty}</td>
                {:else if column.id === 'level'}<td>{row.levelNumber}</td>
                {:else if column.id === 'treasureClass'}<td>{row.treasureClass}</td>
                {:else if column.id === 'chance'}<td class="text-right tabular-nums" class:text-unique={row.state === 'positive'} class:text-parchment-200={row.state !== 'positive'}>{#if row.reason}<span title={row.reason}>{row.chance}</span>{#if detailed}<span class="mt-1 block text-xs text-parchment-300">{row.reason}</span>{/if}{:else}{row.chance}{/if}<span class="stack-meta mt-1 text-xs text-parchment-300">{row.odds}</span></td>
                {:else if column.id === 'odds'}<td class="col-odds text-right tabular-nums" class:text-parchment-300={row.state !== 'positive'}>{row.odds}</td>
                {:else}<td class="text-right tabular-nums">{row[column.id]}</td>{/if}
              {/each}
            </tr>
          {:else}<tr><td colspan={columns.length} class="py-10 text-center text-parchment-300">No matching monster drops{minLevel > levels.min || maxLevel <= levels.max ? ` for ${describeLevelRange(minLevel, maxLevel)}` : ''}. Try another difficulty or filter. Some items only come from recipes, objects, or scripted rewards.</td></tr>{/each}</tbody>
        </table>
      </div>
      {#if visible.length > pageSize}<div class="mt-4 flex items-center justify-end gap-4 text-sm"><button type="button" class="rounded border border-parchment-300/25 px-4 py-2 disabled:opacity-30" disabled={page === 0} onclick={() => page--}>Previous</button><span>Page {page + 1} of {dropResultsPageCount(visible.length)}</span><button type="button" class="rounded border border-parchment-300/25 px-4 py-2 disabled:opacity-30" disabled={(page + 1) * pageSize >= visible.length} onclick={() => page++}>Next</button></div>{/if}
    {:else}<div class="panel rounded-lg px-6 py-10 text-center"><h2 class="display-text text-xl">What are you hunting?</h2><p class="mt-3 text-parchment-300">Search for a unique item, set piece, rune, or miscellaneous item above, then choose a suggestion to compare its drops.</p></div>{/if}
  </div>
  {/if}
</section>

<style>
  /* Detailed keeps the original fixed ten-column table; compact sizes columns to their content so
     difficulties and numbers stay on one line and long names wrap only between words. */
  .drop-results.detailed table { table-layout: fixed; min-width: 64rem; }
  .drop-results:not(.detailed) td { overflow-wrap: break-word; }
  .drop-results:not(.detailed) :is(.col-difficulty, .tabular-nums) { white-space: nowrap; }
  .drop-results th { overflow-wrap: normal; }
  .stack-meta { display: none; }
  /* Narrow compact view: area and difficulty stack under the monster, odds under the chance. */
  @media (max-width: 40rem) {
    .drop-results:not(.detailed) :is(.col-area, .col-difficulty, .col-odds) { display: none; }
    .drop-results:not(.detailed) .stack-meta { display: block; white-space: normal; }
  }
  .chance-help { background: rgb(0 0 0 / 0.15); }
  .chance-help summary:focus-visible { outline: 2px solid var(--color-ember-400); outline-offset: 2px; }
  .chance-terms { display: grid; gap: 0.25rem 1rem; }
  .chance-terms dt { color: var(--color-parchment-200); }
  .chance-terms dd { margin-bottom: 0.5rem; }
  @media (min-width: 48rem) {
    .chance-terms { grid-template-columns: 14rem minmax(0, 1fr); }
    .chance-terms dd { margin-bottom: 0; }
  }
  th, td { padding: 0.9rem 0.65rem; overflow-wrap: anywhere; }
  th { white-space: normal; font-weight: normal; vertical-align: bottom; }
  .highlighted { background: rgb(255 255 255 / 0.1); box-shadow: inset 3px 0 0 var(--color-ember-400); }
  .suggestion-list { max-height: min(20rem, 50vh); }
  .category-tag { border: 1px solid currentColor; border-radius: 0.25rem; padding: 0 0.4rem; font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85; }
  .category-unique { color: var(--color-unique); }
  .category-set { color: var(--color-set); }
  .category-rune { color: var(--color-ember-400); }
  .category-misc { color: var(--color-rarity); }
  .primary-label { display: block; margin-bottom: 0.4rem; font-size: 1.125rem; color: var(--color-parchment-50); }
  /* Matches the label style of the shared SearchableSelect so every settings label lines up. */
  .control-label { display: block; margin-bottom: 0.25rem; font-size: 0.75rem; line-height: 1rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-parchment-300); }
  .drop-form :global(.field) { min-height: 2.75rem; }
  .primary-search { font-size: 1.0625rem; }
  .drop-form .primary-search, .drop-form .category-select { min-height: 3.25rem; }
  .advanced { background: rgb(0 0 0 / 0.15); }
  .advanced summary { list-style: none; }
  .advanced summary::-webkit-details-marker { display: none; }
  .advanced summary::before { content: '▸'; display: inline-block; width: 0.75rem; color: var(--color-parchment-300); transition: transform 0.15s; }
  .advanced[open] summary::before { transform: rotate(90deg); }
  .advanced summary:hover .advanced-title { color: var(--color-parchment-50); }
  .advanced summary:focus-visible { outline: 2px solid var(--color-ember-400); outline-offset: 2px; }
  .active-count { border: 1px solid currentColor; border-radius: 999px; padding: 0 0.5rem; font-size: 0.75rem; color: var(--color-ember-400); }
  .group-title { margin-bottom: 0.6rem; font-size: 0.875rem; color: var(--color-parchment-200); }
  .action { min-height: 2.75rem; }
  /* Scoped to this form: a disabled field must not look editable, while its preserved value stays readable. */
  .drop-form :global(.field:disabled) { cursor: not-allowed; border-style: dashed; border-color: rgb(188 167 125 / 0.4); background: repeating-linear-gradient(135deg, #1c1a19 0 6px, #161514 6px 12px); color: var(--color-parchment-300); -webkit-text-fill-color: var(--color-parchment-300); opacity: 1; }
  .drop-form :global(.field[aria-invalid='true']) { border-color: var(--color-requirement); }
  .field-note, .field-error { margin-top: 0.35rem; font-size: 0.8125rem; line-height: 1.25rem; }
  .field-note { color: var(--color-parchment-200); }
  .field-error { color: var(--color-requirement); }
  .level-notice { border-color: rgb(233 107 99 / 0.45); background: rgb(233 107 99 / 0.08); color: var(--color-parchment-200); }
  .top-chance { display: grid; grid-template-columns: 1.75rem minmax(0, 1fr) auto; align-items: baseline; column-gap: 0.75rem; }
  .rank { color: var(--color-ember-400); font-size: 1.125rem; }
  .odds { text-align: right; white-space: nowrap; }
  @media (max-width: 30rem) {
    .top-chance { grid-template-columns: 1.75rem minmax(0, 1fr); }
    .odds { grid-column: 2; margin-top: 0.35rem; text-align: left; }
    .odds > span { display: inline; }
    .odds > span + span::before { content: ' · '; }
  }
  .detailed-title { scroll-margin-top: 5rem; }
  .detailed-title:focus-visible { outline: 2px solid var(--color-ember-400); outline-offset: 4px; }
</style>
