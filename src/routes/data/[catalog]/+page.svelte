<script lang="ts">
  import CatalogCard from '$lib/components/CatalogCard.svelte';
  import CatalogFilters from '$lib/components/CatalogFilters.svelte';
  import { collectText, isVanilla, itemClass, itemType, uniqueOptions } from '$lib/catalog';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';

  let { data } = $props();
  let search = $state('');
  let selectedType = $state('');
  let selectedClass = $state('');
  let subtype = $state('');
  let hideVanilla = $state(false);
  let runeCount = $state('');
  let visibleCount = $state(48);

  function typesFor(item: CatalogItem): string[] {
    if (data.definition.slug === 'sets') return (item.SetItems ?? []).map(itemType);
    if (data.definition.slug === 'runewords') {
      return (item.Types ?? []).map((type) => typeof type === 'string' ? type : type.Index ?? type.Name ?? '');
    }
    if (data.definition.slug === 'affixes') {
      return (item.Types ?? []).map((type) => typeof type === 'string' ? type : type.Index ?? type.Name ?? '');
    }
    return [itemType(item)];
  }

  function classesFor(item: CatalogItem): string[] {
    if (data.definition.slug === 'sets') return (item.SetItems ?? []).map(itemClass);
    return [itemClass(item)];
  }

  let typeOptions = $derived(uniqueOptions(data.items.flatMap(typesFor), (value) => $i18n.t(value)).map((value) => $i18n.t(value)));
  let classOptions = $derived(uniqueOptions(data.items.flatMap(classesFor), (value) => $i18n.t(value)).map((value) => $i18n.t(value)));

  let filtered = $derived.by(() => {
    const query = search.trim().toLowerCase();
    return data.items.filter((item: CatalogItem) => {
      if (hideVanilla && isVanilla(item)) return false;
      if (selectedType && !typesFor(item).some((value) => $i18n.t(value) === selectedType)) return false;
      if (selectedClass && !classesFor(item).some((value) => $i18n.t(value) === selectedClass)) return false;
      if (subtype && item.source !== subtype) return false;
      if (runeCount && (item.Runes?.length ?? 0) !== Number(runeCount)) return false;
      if (query && !collectText(item, $i18n.t).includes(query)) return false;
      if (String(item.Index ?? '').toLowerCase().includes('grabber')) return false;
      return true;
    });
  });

  let visible = $derived(filtered.slice(0, visibleCount));

  $effect(() => {
    search; selectedType; selectedClass; subtype; hideVanilla; runeCount;
    visibleCount = 48;
  });

  function reset(): void {
    search = '';
    selectedType = '';
    selectedClass = '';
    subtype = '';
    hideVanilla = false;
    runeCount = '';
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
  <div class="mx-auto max-w-7xl px-5 py-12 text-center sm:py-16">
    <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">{data.definition.eyebrow}</p>
    <h1 class="display-text mt-3 text-4xl sm:text-6xl">{data.definition.title}</h1>
    <p class="mx-auto mt-4 max-w-3xl text-lg text-parchment-300">{data.definition.description}</p>
  </div>
</section>

<section class="mx-auto max-w-screen-2xl px-4 py-8">
  <CatalogFilters
    slug={data.definition.slug}
    {typeOptions}
    {classOptions}
    bind:search
    bind:selectedType
    bind:selectedClass
    bind:subtype
    bind:hideVanilla
    bind:runeCount
    {reset}
  />

  <p class="mb-5 text-center text-parchment-300"><span class="rarity-line">{filtered.length.toLocaleString()}</span> results</p>

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
