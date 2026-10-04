<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { afterNavigate, beforeNavigate, replaceState } from '$app/navigation';
  import { page } from '$app/state';

  import GrailItem from '$lib/components/GrailItem.svelte';
  import CatalogFilters from '$lib/components/CatalogFilters.svelte';
  import { itemClass } from '$lib/catalog';
  import { catalogTypeValues, equipmentNamesForType, sortOptions } from '$lib/catalog-controls';
  import { filterGrailItems, grailTypes, normalizeGrailFilters } from '$lib/grail-filters';
  import { readGrailFilters, writeGrailFilters, type GrailCategory } from '$lib/grail-query';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';

  type Category = GrailCategory;
  type FoundMap = Record<string, boolean>;

  let { data } = $props();
  const initial = untrack(() => {
    const restored = readGrailFilters(page.url.searchParams);
    restored.catalog = normalizeGrailFilters(restored.catalog, data[restored.category], restored.category, $i18n);
    return restored;
  });
  let category = $state<Category>(initial.category);
  let filters = $state(initial.catalog);
  let foundUniques = $state<FoundMap>({});
  let foundSets = $state<FoundMap>({});
  let foundRunewords = $state<FoundMap>({});
  let hideFound = $state(initial.hideFound);
  let routerReady = $state(false);
  let navigationInProgress = $state(false);
  let visibleCount = $state(60);
  let transferOpen = $state(false);
  let exportValue = $state('');
  let importValue = $state('');

  function mapFor(categoryName: Category): FoundMap {
    return categoryName === 'uniques' ? foundUniques : categoryName === 'sets' ? foundSets : foundRunewords;
  }

  function itemsFor(categoryName: Category): CatalogItem[] {
    return data[categoryName] as CatalogItem[];
  }

  function itemKey(item: CatalogItem): string {
    return String(item.Index ?? item.NameKey ?? 'Unknown');
  }

  let currentMap = $derived(mapFor(category));
  let currentItems = $derived(itemsFor(category));
  function options(values: string[]) {
    return [...new Set(values.filter(Boolean))].map((value) => ({ value, label: $i18n.t(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  let typeOptions = $derived(options(catalogTypeValues(currentItems.flatMap(grailTypes), category)));
  let classOptions = $derived(category === 'runewords' ? [] : options(currentItems.map(itemClass)));
  let equipmentOptions = $derived(category === 'runewords' ? [] : options(equipmentNamesForType(currentItems, filters.selectedType)));
  let runeOptions = $derived(options(currentItems.flatMap((item) => (item.Runes ?? []).map((rune) => rune.NameKey ?? '')))
    .sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true })));
  let filtered = $derived(filterGrailItems(currentItems, category, filters, currentMap, hideFound, $i18n));
  let visible = $derived(filtered.slice(0, visibleCount));
  let foundCount = $derived(Object.values(currentMap).filter(Boolean).length);

  $effect(() => { filtered; visibleCount = 60; });

  $effect(() => {
    if (navigationInProgress) return;
    // Category/type changes can invalidate an equipment or class selection.
    for (const [key, choices] of [
      ['selectedType', typeOptions], ['selectedClass', classOptions], ['selectedEquipment', equipmentOptions]
    ] as const) {
      const value = filters[key];
      if (value && !choices.some((option) => option.value === value)) {
        filters[key] = choices.find((option) => option.label.toLowerCase() === value.toLowerCase())?.value ?? '';
      }
    }
  });

  $effect(() => {
    if (!routerReady || navigationInProgress) return;
    const url = writeGrailFilters(new URL(page.url), { category, hideFound, catalog: filters });
    if (url.search !== page.url.search) replaceState(url, {});
  });
  beforeNavigate(() => { navigationInProgress = true; });
  afterNavigate(({ to }) => {
    if (!routerReady) { routerReady = true; return; }
    const restored = readGrailFilters((to?.url ?? page.url).searchParams);
    category = restored.category;
    filters = normalizeGrailFilters(restored.catalog, data[restored.category], restored.category, $i18n);
    hideFound = restored.hideFound;
    navigationInProgress = false;
  });

  function resetFilters(): void {
    filters = readGrailFilters(new URLSearchParams()).catalog;
    hideFound = false;
  }

  function readMap(key: string): FoundMap {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as FoundMap : {};
    } catch { return {}; }
  }

  function save(): void {
    try {
      localStorage.setItem('d2r-grail-uniques', JSON.stringify(foundUniques));
      localStorage.setItem('d2r-grail-sets', JSON.stringify(foundSets));
      localStorage.setItem('d2r-grail-runewords', JSON.stringify(foundRunewords));
    } catch { /* storage is optional */ }
  }

  function setFound(item: CatalogItem, value: boolean): void {
    const key = itemKey(item);
    if (category === 'uniques') foundUniques = { ...foundUniques, [key]: value };
    else if (category === 'sets') foundSets = { ...foundSets, [key]: value };
    else foundRunewords = { ...foundRunewords, [key]: value };
    save();
  }

  function toBase64(value: string): string {
    const bytes = new TextEncoder().encode(value);
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
  }

  function fromBase64(value: string): string {
    const binary = atob(value);
    return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
  }

  function enabled(map: FoundMap): string[] {
    return Object.entries(map).filter(([, value]) => value).map(([key]) => key);
  }

  function createExport(): string {
    return toBase64(JSON.stringify({
      version: 2,
      uniques: enabled(foundUniques),
      sets: enabled(foundSets),
      runewords: enabled(foundRunewords)
    }));
  }

  function openTransfer(): void {
    exportValue = createExport();
    importValue = '';
    transferOpen = true;
  }

  async function copyExport(): Promise<void> {
    exportValue = createExport();
    try { await navigator.clipboard.writeText(exportValue); } catch { /* textarea remains selectable */ }
  }

  function normalize(value: unknown): FoundMap {
    if (Array.isArray(value)) return Object.fromEntries(value.map((key) => [String(key), true]));
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, enabled]) => Boolean(enabled)).map(([key]) => [key, true]));
    }
    return {};
  }

  function importProgress(merge: boolean): void {
    try {
      const parsed = JSON.parse(fromBase64(importValue.trim())) as Record<string, unknown>;
      const incomingUniques = normalize(parsed.uniques);
      const incomingSets = normalize(parsed.sets);
      const incomingRunewords = normalize(parsed.runewords);
      foundUniques = merge ? { ...foundUniques, ...incomingUniques } : incomingUniques;
      foundSets = merge ? { ...foundSets, ...incomingSets } : incomingSets;
      foundRunewords = merge ? { ...foundRunewords, ...incomingRunewords } : incomingRunewords;
      save();
      exportValue = createExport();
      transferOpen = false;
    } catch {
      alert('That import string is not valid Grail data.');
    }
  }

  function resetCategory(): void {
    if (!confirm(`Reset all ${category} progress? This cannot be undone.`)) return;
    if (category === 'uniques') foundUniques = {};
    else if (category === 'sets') foundSets = {};
    else foundRunewords = {};
    save();
  }

  onMount(() => {
    const legacy = localStorage.getItem('d2r-grail-items');
    if (legacy && !localStorage.getItem('d2r-grail-uniques')) localStorage.setItem('d2r-grail-uniques', legacy);
    foundUniques = readMap('d2r-grail-uniques');
    foundSets = readMap('d2r-grail-sets');
    foundRunewords = readMap('d2r-grail-runewords');
  });
</script>

<svelte:head>
  <title>Holy Grail Tracker | D2R Reimagined</title>
  <meta name="description" content="Track D2R Reimagined unique items, set pieces, and runewords in a private browser-based Holy Grail checklist." />
  <meta property="og:title" content="Holy Grail Tracker | D2R Reimagined" />
  <meta property="og:description" content="A private browser-based checklist for D2R Reimagined unique items, sets, and runewords." />
  <meta name="twitter:title" content="Holy Grail Tracker | D2R Reimagined" />
  <meta name="twitter:description" content="Track your D2R Reimagined collection." />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="mx-auto max-w-7xl px-5 py-12 text-center sm:py-16">
    <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">The long hunt</p>
    <h1 class="display-text mt-3 text-4xl sm:text-6xl">Holy Grail</h1>
    <p class="mx-auto mt-4 max-w-3xl text-lg text-parchment-300">Mark every unique, set piece, and runeword you find. Your progress stays in this browser unless you export it.</p>
  </div>
</section>

<section class="mx-auto max-w-screen-2xl px-4 py-8">
  <div class="panel mb-6 rounded-lg p-4">
    <div class="mx-auto grid max-w-md grid-cols-3 gap-2" role="tablist" aria-label="Grail category">
      {#each ['uniques', 'sets', 'runewords'] as value}
        <button type="button" role="tab" aria-selected={category === value} onclick={() => category = value as Category} class={`rounded-md border px-2 py-2 text-sm capitalize transition sm:px-5 sm:text-base ${category === value ? 'border-ember-400 bg-ember-700' : 'border-parchment-300/20'}`}>{value}</button>
      {/each}
    </div>
    <div class="mt-4 grid grid-cols-2 gap-2 text-sm sm:flex sm:flex-wrap sm:justify-center sm:text-base">
      <label class="flex items-center justify-center gap-2 rounded-md border border-parchment-300/20 bg-black/20 px-2 py-2 sm:px-4"><input type="checkbox" bind:checked={hideFound} class="checkbox" /> Hide found</label>
      <button type="button" onclick={openTransfer} class="rounded-md border border-parchment-300/25 px-2 py-2 hover:border-ember-400 sm:px-4">Import / export</button>
      <button type="button" onclick={resetCategory} class="col-span-2 rounded-md border border-ember-500/55 px-4 py-2 text-ember-400 hover:bg-ember-700 hover:text-white">Reset category</button>
    </div>
  </div>

  <CatalogFilters slug={category} grail {typeOptions} {classOptions} {equipmentOptions}
    propertyOptions={[]} recipeTypeOptions={[]} {runeOptions} {sortOptions}
    bind:search={filters.search} bind:selectedType={filters.selectedType}
    bind:selectedClass={filters.selectedClass} bind:selectedEquipment={filters.selectedEquipment}
    bind:hideVanilla={filters.hideVanilla} bind:runeCount={filters.runeCount}
    bind:selectedRunes={filters.selectedRunes} bind:runeMatch={filters.runeMatch} bind:exactType={filters.exactType} reset={resetFilters} />

  <p class="mb-5 text-center text-parchment-300" aria-live="polite"><span class="set-line">{foundCount.toLocaleString()}</span> / {currentItems.length.toLocaleString()} found · {filtered.length.toLocaleString()} shown</p>
  {#if !filtered.length}
    <div class="panel mb-5 rounded-lg p-8 text-center"><h2 class="display-text text-2xl">Nothing matched</h2><p class="mt-2 text-parchment-300">Try removing a filter or searching for a broader property.</p></div>
  {/if}

  <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {#each visible as item (itemKey(item))}
      {@const key = itemKey(item)}
      <GrailItem {item} tone={category === 'sets' ? 'set' : 'unique'} found={Boolean(currentMap[key])} onchange={(value) => setFound(item, value)} />
    {/each}
  </div>

  {#if visible.length < filtered.length}
    <div class="mt-8 text-center"><button type="button" onclick={() => visibleCount += 60} class="rounded-md border border-ember-500/60 px-6 py-3 text-ember-400 hover:bg-ember-700 hover:text-white">Load 60 more</button></div>
  {/if}
</section>

{#if transferOpen}
  <div class="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4" role="presentation" onclick={(event) => event.currentTarget === event.target && (transferOpen = false)}>
    <div class="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-6" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
      <div class="flex items-center justify-between gap-4"><h2 id="transfer-title" class="display-text text-2xl">Move Grail progress</h2><button type="button" aria-label="Close" onclick={() => transferOpen = false}>✕</button></div>
      <label class="mt-5 block"><span class="mb-2 block text-parchment-300">Export string</span><textarea class="field min-h-28 text-xs" readonly bind:value={exportValue}></textarea></label>
      <button type="button" onclick={copyExport} class="mt-2 rounded-md border border-parchment-300/25 px-4 py-2 hover:border-ember-400">Copy export</button>
      <label class="mt-6 block"><span class="mb-2 block text-parchment-300">Import string</span><textarea class="field min-h-28 text-xs" bind:value={importValue} placeholder="Paste exported Grail data here"></textarea></label>
      <div class="mt-3 flex flex-wrap gap-3"><button type="button" disabled={!importValue.trim()} onclick={() => importProgress(true)} class="rounded-md bg-ember-700 px-4 py-2 disabled:opacity-40">Merge progress</button><button type="button" disabled={!importValue.trim()} onclick={() => importProgress(false)} class="rounded-md border border-requirement/60 px-4 py-2 text-requirement disabled:opacity-40">Replace progress</button></div>
    </div>
  </div>
{/if}
