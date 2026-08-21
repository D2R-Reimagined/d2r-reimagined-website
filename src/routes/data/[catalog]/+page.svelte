<script lang="ts">
  import { page } from '$app/state';

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
  import { isVanilla, itemClass, itemType, searchText } from '$lib/catalog';
  import { debounced } from '$lib/debounce.svelte';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem, KeyedLine } from '$lib/types';

  type Option = { value: string; label: string };

  let { data } = $props();
  // Seeded from ?q= so the all-data search can hand a query straight to a catalog.
  let search = $state(page.url.searchParams.get('q') ?? '');
  let selectedType = $state('');
  let selectedClass = $state('');
  let subtype = $state('');
  let hideVanilla = $state(false);
  let runeCount = $state('');
  let selectedEquipment = $state('');
  let selectedTier = $state('');
  let selectedSockets = $state('');
  let propertyType = $state('');
  let minLevel = $state('');
  let maxLevel = $state('');
  let exactType = $state(false);
  let recipeType = $state('');
  let selectedRunes = $state<string[]>([]);
  let weaponSort = $state<WeaponSortMode>('');
  let handFilter = $state('');
  let visibleCount = $state(48);

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
