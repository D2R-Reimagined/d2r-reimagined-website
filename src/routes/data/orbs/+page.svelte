<script lang="ts">
  import { afterNavigate, replaceState } from '$app/navigation';
  import { page } from '$app/state';

  import { searchText } from '$lib/catalog';
  import { matchesSearch, tokenizeSearch } from '$lib/catalog-controls';
  import KeyedLines from '$lib/components/KeyedLines.svelte';
  import { debounced } from '$lib/debounce.svelte';
  import { i18n } from '$lib/i18n';
  import type { Orb, OrbOutcome, OrbTarget } from '$lib/orbs';

  let { data }: { data: { definition: { title: string; description: string }; orbs: Orb[] } } = $props();

  let selectedOrb = $state(page.url.searchParams.get('orb') ?? '');
  let selectedTarget = $state(page.url.searchParams.get('type') ?? '');
  let search = $state(page.url.searchParams.get('search') ?? page.url.searchParams.get('q') ?? '');

  // Re-rendering every outcome on each keystroke is the same cost the catalogs pay, so the
  // property filter waits for a pause the way they do.
  const settled = debounced(() => search);
  let query = $derived(settled.current);

  let orbTabs = $derived([
    { value: '', label: 'All orbs' },
    ...data.orbs.map((orb) => ({ value: orb.noteKey, label: $i18n.t(orb.reagent.key) }))
  ]);

  // Narrowing to one orb should narrow the item types on offer to the ones it accepts.
  let byOrb = $derived(data.orbs.filter((orb) => !selectedOrb || orb.noteKey === selectedOrb));

  let targetTabs = $derived([
    { value: '', label: 'All item types' },
    ...[...new Set(byOrb.flatMap((orb) => orb.targets.map((target) => target.key)))]
      .map((key) => ({ value: key, label: $i18n.t(key) }))
  ]);

  /**
   * An outcome is searchable by its own properties plus the orb and item type it belongs to,
   * so "socketing" and "amulet" find their rows the same way "faster cast rate" does.
   */
  function haystack(orb: Orb, target: OrbTarget, outcome: OrbOutcome): string {
    return [searchText(orb.reagent, $i18n), searchText(target.input, $i18n), searchText(outcome, $i18n)].join('\n');
  }

  let visible = $derived.by((): Orb[] => {
    const tokens = tokenizeSearch(query);
    return byOrb
      .map((orb) => ({
        ...orb,
        targets: orb.targets
          .filter((target) => !selectedTarget || target.key === selectedTarget)
          .map((target) => ({
            ...target,
            outcomes: tokens.length
              ? target.outcomes.filter((outcome) => matchesSearch(haystack(orb, target, outcome), tokens))
              : target.outcomes
          }))
          .filter((target) => target.outcomes.length > 0)
      }))
      .filter((orb) => orb.targets.length > 0);
  });

  let total = $derived(visible.reduce(
    (sum, orb) => sum + orb.targets.reduce((count, target) => count + target.outcomes.length, 0),
    0
  ));

  // Keeps a filtered view shareable without stacking a history entry per keystroke. The
  // router only exists after hydration, so the first pass — which also rewrites an inbound
  // `?q=` from the all-data search into this page's `search` — waits for it.
  let routerReady = $state(false);
  afterNavigate(() => (routerReady = true));

  let synced = page.url.search;
  $effect(() => {
    const next = new URL(page.url);
    next.searchParams.delete('q');
    for (const [key, value] of [['orb', selectedOrb], ['type', selectedTarget], ['search', query]]) {
      if (value) next.searchParams.set(key, value);
      else next.searchParams.delete(key);
    }
    if (!routerReady || next.search === synced) return;
    synced = next.search;
    replaceState(next, page.state);
  });

  function reset(): void {
    selectedOrb = '';
    selectedTarget = '';
    search = '';
  }

  function qualifierClass(key: string): string {
    if (key.includes('RareItem')) return 'border-yellow-500/50 bg-yellow-950/45 text-yellow-200';
    if (key.includes('MagicItem')) return 'border-blue-500/50 bg-blue-950/45 text-blue-200';
    if (key.includes('SetItem')) return 'border-green-500/50 bg-green-950/45 text-green-200';
    if (key.includes('UniqueItem')) return 'border-amber-500/50 bg-amber-950/45 text-amber-200';
    return 'border-parchment-300/30 bg-black/25 text-parchment-200';
  }

  /** The headline for an outcome that grants no property — a reroll, or nothing at all. */
  function fallbackLabel(outcome: OrbOutcome): string {
    return outcome.rerolls ? 'Rerolled as a new item' : 'Changed with no new property';
  }

  const badge = 'rounded border px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide';

  // Two chip rows make a tall sticky panel, so it collapses the way the catalog filters do.
  let expanded = $state(true);

  let activeSummary = $derived([
    selectedOrb ? $i18n.t(data.orbs.find((orb) => orb.noteKey === selectedOrb)?.reagent.key ?? '') : '',
    selectedTarget ? $i18n.t(selectedTarget) : '',
    query ? `“${query}”` : ''
  ].filter(Boolean).join(' · '));
</script>

<svelte:head>
  <title>{data.definition.title} — D2R Reimagined</title>
  <meta name="description" content={data.definition.description} />
  <meta property="og:title" content={`${data.definition.title} — D2R Reimagined`} />
  <meta property="og:description" content={data.definition.description} />
  <meta name="twitter:title" content={`${data.definition.title} — D2R Reimagined`} />
  <meta name="twitter:description" content={data.definition.description} />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="data-page-hero mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <h1 class="display-text text-4xl sm:text-6xl">{data.definition.title}</h1>
    <p class="data-page-description mx-auto mt-4 max-w-3xl text-lg text-parchment-300">{data.definition.description}</p>
    <p class="mt-3 text-sm text-parchment-300/80">
      Cube an orb with an item it accepts. Most orbs always do the same thing; the Orb of Corruption
      gives one of the outcomes listed for that item type.
    </p>
  </div>
</section>

<section class="data-page-content mx-auto max-w-screen-2xl px-4 py-8">
  <section
    class:collapsed={!expanded}
    class="filters-panel panel sticky top-16 z-40 mb-8 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg p-3 sm:p-4"
    aria-label="Orb filters"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="display-text text-base text-parchment-50">Filters</h2>
        <p class="text-xs text-parchment-300">{activeSummary || 'Refine the orb outcomes.'}</p>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-md border border-parchment-300/30 px-3 py-1.5 text-sm text-parchment-200 transition hover:border-ember-400/70 hover:text-white"
        aria-controls="orb-filter-controls"
        aria-expanded={expanded}
        onclick={() => expanded = !expanded}
      >
        {expanded ? 'Collapse' : 'Expand'} <span aria-hidden="true">{expanded ? '▴' : '▾'}</span>
      </button>
    </div>

    {#if expanded}
    <div id="orb-filter-controls">
    <div class="mt-3 flex flex-wrap items-end gap-3">
      <label class="min-w-56 grow sm:max-w-sm">
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Search</span>
        <input
          class="field"
          type="search"
          placeholder="Try “All Skills”, “sockets”, or “ethereal”"
          autocomplete="off"
          bind:value={search}
        />
      </label>
      {#if selectedOrb || selectedTarget || search}
        <button
          type="button"
          class="rounded-md border border-parchment-300/30 px-3 py-2 text-sm text-parchment-200 transition hover:border-ember-400/70 hover:text-white"
          onclick={reset}
        >
          Reset
        </button>
      {/if}
    </div>

    <div class="mt-3">
      <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Orb</span>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by orb">
        {#each orbTabs as tab}
          <button
            type="button"
            aria-pressed={selectedOrb === tab.value}
            class:active={selectedOrb === tab.value}
            class="type-chip rounded border border-parchment-300/25 px-3 py-1.5 text-sm text-parchment-200 transition hover:border-ember-400/70 hover:text-white"
            onclick={() => selectedOrb = tab.value}
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-3">
      <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Item type</span>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by item type">
        {#each targetTabs as tab}
          <button
            type="button"
            aria-pressed={selectedTarget === tab.value}
            class:active={selectedTarget === tab.value}
            class="type-chip rounded border border-parchment-300/25 px-3 py-1.5 text-sm text-parchment-200 transition hover:border-ember-400/70 hover:text-white"
            onclick={() => selectedTarget = tab.value}
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>
    </div>
    {/if}
  </section>

  <p class="mb-5 text-center text-parchment-300" aria-live="polite">
    <span class="rarity-line">{total.toLocaleString()}</span> outcomes
  </p>

  {#if visible.length}
    <div class="space-y-10">
      {#each visible as orb (orb.noteKey)}
        <section>
          <header class="mb-3 border-b border-parchment-300/15 pb-2">
            <h2 class="display-text unique-line text-2xl">{$i18n.t(orb.reagent.key)}</h2>
            {#if orb.sharedOutcome}
              <!-- One effect across every accepted type, so it is stated once here rather
                   than repeated as an identical card per item type. -->
              <p class="mt-1 flex flex-wrap items-center gap-1.5">
                {#if orb.sharedOutcome.lines.length}
                  <KeyedLines lines={orb.sharedOutcome.lines} class="property-line" />
                {:else}
                  <span class="text-parchment-200">{fallbackLabel(orb.sharedOutcome)}</span>
                {/if}
                {#each orb.sharedOutcome.qualifiers as qualifier}
                  <span class={`${badge} ${qualifierClass(qualifier.key)}`}>{$i18n.line(qualifier)}</span>
                {/each}
              </p>
            {:else if orb.targets.length > 1}
              <!-- With one type in view its own heading already carries the count. -->
              <p class="mt-1 text-sm text-parchment-300">
                {orb.targets.reduce((count, target) => count + target.outcomes.length, 0)} possible outcomes
                across {orb.targets.length} item types
              </p>
            {/if}
          </header>

          {#if orb.sharedOutcome}
            <ul class="flex flex-wrap gap-2">
              {#each orb.targets as target (target.key)}
                <li class="panel rounded-lg px-3 py-2">
                  <span class="base-line">{$i18n.line(target.input)}</span>
                  {#each target.requires as requirement}
                    <span class={`ml-1.5 ${badge} ${qualifierClass(requirement.key)}`}>{$i18n.line(requirement)}</span>
                  {/each}
                </li>
              {/each}
            </ul>
          {:else}
            <div class="space-y-6">
              {#each orb.targets as target (target.key)}
                <section>
                  <h3 class="mb-2 flex flex-wrap items-baseline gap-2">
                    <span class="display-text text-lg text-parchment-50">{$i18n.t(target.key)}</span>
                    <span class="text-sm text-parchment-300">{target.outcomes.length} outcomes</span>
                  </h3>
                  <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {#each target.outcomes as outcome (outcome.index)}
                      <article class="panel scroll-card flex h-full flex-col rounded-lg p-4 text-center">
                        {#if outcome.lines.length}
                          <KeyedLines lines={outcome.lines} />
                        {:else}
                          <p class="text-parchment-300">{fallbackLabel(outcome)}</p>
                        {/if}
                        {#if outcome.qualifiers.length}
                          <div class="mt-auto flex flex-wrap justify-center gap-1.5 pt-3">
                            {#each outcome.qualifiers as qualifier}
                              <span class={`${badge} ${qualifierClass(qualifier.key)}`}>{$i18n.line(qualifier)}</span>
                            {/each}
                          </div>
                        {/if}
                      </article>
                    {/each}
                  </div>
                </section>
              {/each}
            </div>
          {/if}
        </section>
      {/each}
    </div>
  {:else}
    <div class="panel mx-auto max-w-xl rounded-lg p-10 text-center">
      <h2 class="display-text text-2xl">Nothing matched</h2>
      <p class="mt-2 text-parchment-300">Try another orb, another item type, or a broader property.</p>
    </div>
  {/if}
</section>

<style>
  .filters-panel.collapsed {
    margin-bottom: 1rem;
  }

  .type-chip.active {
    color: #f7f1e3;
    border-color: rgb(228 90 53 / 0.7);
    background: rgb(123 29 24 / 0.5);
  }
</style>
