<script lang="ts">
  import { afterNavigate, beforeNavigate, replaceState } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import CatalogCard from '$lib/components/CatalogCard.svelte';
  import CatalogFilters from '$lib/components/CatalogFilters.svelte';
  import {
    affixMatchesProperty,
    affixPropertyOptions,
    baseHasSockets,
    baseTier,
    matchesSearch,
    matchesItemType,
    passesHandFilter,
    recipeType as recipeTypesFor,
    sortByWeaponDamage,
    tokenizeSearch,
    weaponSortOptions,
    type WeaponSortMode
  } from '$lib/catalog-controls';
  import { readCatalogFilters, writeCatalogFilters, type CatalogFilterState } from '$lib/catalog-query';
  import { isVanilla, itemClass, itemType, searchText } from '$lib/catalog';
  import { debounced } from '$lib/debounce.svelte';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem, CatalogSlug, KeyedLine } from '$lib/types';

  type Option = { value: string; label: string };

  let { data } = $props();
  const initialFilters = untrack(() => normalizeFilters(
    readCatalogFilters(page.url.searchParams, page.params.catalog as CatalogSlug),
    options(data.items.flatMap(typesFor)),
    options(data.items.flatMap((item: CatalogItem) => item.Runes ?? []).map((rune: { NameKey?: string }) => rune.NameKey ?? ''))
  ));
  let search = $state(initialFilters.search);
  let selectedType = $state(initialFilters.selectedType);
  let selectedClass = $state(initialFilters.selectedClass);
  let subtype = $state(initialFilters.subtype);
  let hideVanilla = $state(initialFilters.hideVanilla);
  let runeCount = $state(initialFilters.runeCount);
  let selectedEquipment = $state(initialFilters.selectedEquipment);
  let selectedTier = $state(initialFilters.selectedTier);
  let selectedSockets = $state(initialFilters.selectedSockets);
  let propertyType = $state(initialFilters.propertyType);
  let minLevel = $state(initialFilters.minLevel);
  let maxLevel = $state(initialFilters.maxLevel);
  let exactType = $state(initialFilters.exactType);
  let recipeType = $state(initialFilters.recipeType);
  let selectedRunes = $state<string[]>(initialFilters.selectedRunes);
  let weaponSort = $state<WeaponSortMode>(initialFilters.weaponSort);
  let handFilter = $state(initialFilters.handFilter);
  let visibleCount = $state(48);
  let routerReady = $state(false);
  let navigationInProgress = $state(false);

  // Filtering redraws up to 48 cards, so it waits for a pause rather than every keystroke.
  const settled = debounced(() => search);
  let query = $derived(settled.current);

  function typeValue(value: string | { Index?: string; Name?: string }): string {
    return typeof value === 'string' ? value : value.Index ?? value.Name ?? '';
  }

  function typesFor(item: CatalogItem): string[] {
    if (data.definition.slug === 'sets') return (item.SetItems ?? []).map(itemType).filter(Boolean);
    if (data.definition.slug === 'runewords' || data.definition.slug === 'affixes') {
      return (item.Types ?? []).map(typeValue).filter(Boolean);
    }
    return [itemType(item)].filter(Boolean);
  }

  function classesFor(item: CatalogItem): string[] {
    if (data.definition.slug === 'sets') return (item.SetItems ?? []).map(itemClass).filter(Boolean);
    return [itemClass(item)].filter(Boolean);
  }

  function equipmentFor(item: CatalogItem): string[] {
    if (data.definition.slug === 'sets') {
      return (item.SetItems ?? []).map((setItem) => setItem.Equipment?.NameKey ?? '').filter(Boolean);
    }
    return [item.Equipment?.NameKey ?? ''].filter(Boolean);
  }

  function options(values: string[]): Option[] {
    return [...new Set(values.filter(Boolean))]
      .map((value) => ({ value, label: $i18n.t(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  function recipeLabel(key: string): string {
    const source = data.items
      .flatMap((item: CatalogItem) => item.Notes ?? [])
      .find((line: KeyedLine) => line.key === key);
    return source ? $i18n.line(source) : $i18n.t(key);
  }

  let typeOptions = $derived(options(data.items.flatMap(typesFor)));
  let classOptions = $derived(options(data.items.flatMap(classesFor)));
  let equipmentOptions = $derived(options(data.items.flatMap(equipmentFor)));
  let propertyOptions = $derived(affixPropertyOptions
    .map((value) => ({ value, label: $i18n.t(value) }))
    .sort((a, b) => a.label.localeCompare(b.label)));
  let recipeTypeOptions = $derived(([...new Set<string>(data.items.flatMap((item: CatalogItem) => recipeTypesFor(item)))] as string[])
    .map((value) => ({ value, label: recipeLabel(value) }))
    .sort((a, b) => a.label.localeCompare(b.label)));
  let runeOptions = $derived(options(data.items
    .flatMap((item: CatalogItem) => item.Runes ?? [])
    .map((rune: { NameKey?: string }) => rune.NameKey ?? '')));

  function optionValue(value: string, choices: Option[]): string {
    const normalize = (label: string) => label.toLowerCase().replace(/\s+rune(?:\s+\(#\d+\))?$/i, '');
    const normalized = normalize(value);
    return choices.find((option) =>
      option.value.toLowerCase() === normalized
      || normalize(option.label) === normalized
    )?.value ?? value;
  }

  // Legacy links stored translated type/rune labels. Convert those labels to the keyed
  // values used by the Svelte catalog controls while continuing to accept new keyed URLs.
  function normalizeFilters(filters: CatalogFilterState, types: Option[], runes: Option[]): CatalogFilterState {
    filters.selectedType = optionValue(filters.selectedType, types);
    filters.selectedRunes = filters.selectedRunes.map((value) => optionValue(value, runes));
    return filters;
  }

  let filtered = $derived.by(() => {
    const searchGroups = tokenizeSearch(query);
    const minimum = minLevel ? Number(minLevel) : undefined;
    const maximum = maxLevel ? Number(maxLevel) : undefined;

    const matches = data.items.filter((item: CatalogItem) => {
      if (hideVanilla && isVanilla(item)) return false;
      if (!matchesItemType(typesFor(item), selectedType, exactType)) return false;
      if (selectedClass && !classesFor(item).includes(selectedClass)) return false;
      if (selectedEquipment && !equipmentFor(item).includes(selectedEquipment)) return false;
      if (subtype && item.source !== subtype) return false;
      if (runeCount && (item.Runes?.length ?? 0) !== Number(runeCount)) return false;
      if (selectedRunes.length) {
        const itemRunes = (item.Runes ?? []).map((rune) => rune.NameKey ?? '');
        if (!selectedRunes.every((rune) => itemRunes.includes(rune))) return false;
      }
      if (selectedTier && baseTier(item) !== selectedTier) return false;
      if (selectedSockets && !baseHasSockets(item, Number(selectedSockets))) return false;
      if (propertyType && !affixMatchesProperty(item, propertyType)) return false;
      if (minimum != null && Number(item.RequiredLevel ?? 0) < minimum) return false;
      if (maximum != null && Number(item.RequiredLevel ?? 0) > maximum) return false;
      if (recipeType && !recipeTypesFor(item).includes(recipeType)) return false;
      if (handFilter && !passesHandFilter(item, handFilter)) return false;
      // Guarded so an unsearched page never pays for flattening every item.
      if (searchGroups.length && !matchesSearch(searchText(item, $i18n), searchGroups)) return false;
      if (String(item.Index ?? '').toLowerCase().includes('grabber')) return false;
      return true;
    });

    return sortByWeaponDamage(matches, weaponSort);
  });

  let visible = $derived(filtered.slice(0, visibleCount));

  $effect(() => {
    query; selectedType; selectedClass; subtype; hideVanilla; runeCount;
    selectedEquipment; selectedTier; selectedSockets; propertyType; minLevel;
    maxLevel; exactType; recipeType; selectedRunes; weaponSort; handFilter;
    visibleCount = 48;
  });

  $effect(() => {
    if (!routerReady || navigationInProgress) return;
    const filters: CatalogFilterState = {
      search, selectedType, selectedClass, subtype, hideVanilla, runeCount,
      selectedEquipment, selectedTier, selectedSockets, propertyType, minLevel,
      maxLevel, exactType, recipeType, selectedRunes, weaponSort, handFilter
    };
    const url = writeCatalogFilters(new URL(page.url), filters, data.definition.slug);
    if (url.search !== page.url.search) replaceState(url, {});
  });

  beforeNavigate(() => {
    navigationInProgress = true;
  });

  afterNavigate(({ to }) => {
    if (!routerReady) {
      routerReady = true;
      return;
    }
    const destination = to?.url ?? page.url;
    const filters = normalizeFilters(
      readCatalogFilters(destination.searchParams, data.definition.slug),
      typeOptions,
      runeOptions
    );
    search = filters.search;
    selectedType = filters.selectedType;
    selectedClass = filters.selectedClass;
    subtype = filters.subtype;
    hideVanilla = filters.hideVanilla;
    runeCount = filters.runeCount;
    selectedEquipment = filters.selectedEquipment;
    selectedTier = filters.selectedTier;
    selectedSockets = filters.selectedSockets;
    propertyType = filters.propertyType;
    minLevel = filters.minLevel;
    maxLevel = filters.maxLevel;
    exactType = filters.exactType;
    recipeType = filters.recipeType;
    selectedRunes = filters.selectedRunes;
    weaponSort = filters.weaponSort;
    handFilter = filters.handFilter;

    const normalizedUrl = writeCatalogFilters(new URL(destination), filters, data.definition.slug);
    if (normalizedUrl.search !== page.url.search) replaceState(normalizedUrl, {});
    navigationInProgress = false;
  });

  function reset(): void {
    search = '';
    selectedType = '';
    selectedClass = '';
    subtype = '';
    hideVanilla = false;
    runeCount = '';
    selectedEquipment = '';
    selectedTier = '';
    selectedSockets = '';
    propertyType = '';
    minLevel = '';
    maxLevel = '';
    exactType = false;
    recipeType = '';
    selectedRunes = [];
    weaponSort = '';
    handFilter = '';
  }
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
  </div>
</section>
<!-- Catalog controls are shared across every data route. -->

<section class="data-page-content mx-auto max-w-screen-2xl px-4 py-8">
  <CatalogFilters
    slug={data.definition.slug}
    {typeOptions}
    {classOptions}
    {equipmentOptions}
    {propertyOptions}
    {recipeTypeOptions}
    {runeOptions}
    {weaponSortOptions}
    bind:search
    bind:selectedType
    bind:selectedClass
    bind:subtype
    bind:hideVanilla
    bind:runeCount
    bind:selectedEquipment
    bind:selectedTier
    bind:selectedSockets
    bind:propertyType
    bind:minLevel
    bind:maxLevel
    bind:exactType
    bind:recipeType
    bind:selectedRunes
    bind:weaponSort
    bind:handFilter
    {reset}
  />

  <p class="mb-5 text-center text-parchment-300" aria-live="polite"><span class="rarity-line">{filtered.length.toLocaleString()}</span> results</p>

  {#if visible.length}
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {#each visible as item, index (`${String(item.Index ?? item.NameKey ?? index)}-${index}`)}
        <CatalogCard {item} slug={data.definition.slug} />
      {/each}
    </div>
    {#if visible.length < filtered.length}
      <div class="mt-8 text-center">
        <button type="button" onclick={() => visibleCount += 48} class="rounded-md border border-ember-500/60 px-6 py-3 text-ember-400 hover:bg-ember-700 hover:text-white">Load 48 more</button>
      </div>
    {/if}
  {:else}
    <div class="panel mx-auto max-w-xl rounded-lg p-10 text-center">
      <h2 class="display-text text-2xl">Nothing matched</h2>
      <p class="mt-2 text-parchment-300">Try removing a filter or searching for a broader property.</p>
    </div>
  {/if}
</section>
