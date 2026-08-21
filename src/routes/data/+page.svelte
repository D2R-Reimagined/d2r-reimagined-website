<script lang="ts">
  import { browser } from '$app/environment';
  import { replaceState } from '$app/navigation';
  import { page } from '$app/state';

  import CatalogCard from '$lib/components/CatalogCard.svelte';
  import { searchText } from '$lib/catalog';
  import { matchesSearch, tokenizeSearch } from '$lib/catalog-controls';
  import { loadCatalog } from '$lib/catalog-sources';
  import { debounced } from '$lib/debounce.svelte';
  import { i18n } from '$lib/i18n';
  import { catalogDefinitions, catalogSlugs, skillPlannerDefinition, type CatalogItem, type CatalogSlug } from '$lib/types';

  type Status = 'idle' | 'loading' | 'ready' | 'error';
  type Group = { slug: CatalogSlug; title: string; busy: boolean; failed: boolean; matches: CatalogItem[] };

  /** Cards per section — enough to judge a hit, few enough that a broad query stays quick. */
  const preview = 6;

  const definitions = [skillPlannerDefinition, ...Object.values(catalogDefinitions)];

  let search = $state(page.url.searchParams.get('q') ?? '');
  let items = $state<Partial<Record<CatalogSlug, CatalogItem[]>>>({});
  let status = $state<Record<CatalogSlug, Status>>(
    Object.fromEntries(catalogSlugs.map((slug) => [slug, 'idle'])) as Record<CatalogSlug, Status>
  );

  // Every keystroke would otherwise re-filter all six catalogs and re-render their cards.
  const settled = debounced(() => search);
  let query = $derived(settled.current);
  let searching = $derived(query.length > 0);

  // The catalogs are only worth downloading once someone actually searches, so the fetches
  // start on the first query and every later one reuses them.
  $effect(() => {
    if (!searching) return;
    for (const slug of catalogSlugs) {
      if (status[slug] !== 'idle') continue;
      status[slug] = 'loading';
      loadCatalog(slug)
        .then((rows) => {
          items[slug] = rows;
          status[slug] = 'ready';
        })
        .catch(() => (status[slug] = 'error'));
    }
  });

  // Keeps a search shareable and survivable across a reload without stacking history
  // entries. Tracked outside the effect so writing the URL cannot retrigger it.
  let syncedQuery = page.url.searchParams.get('q') ?? '';
  $effect(() => {
    const next = query;
    if (!browser || next === syncedQuery) return;
    syncedQuery = next;

    const url = new URL(location.href);
    if (next) url.searchParams.set('q', next);
    else url.searchParams.delete('q');
    replaceState(url, page.state);
  });

  let groups = $derived.by((): Group[] => {
    if (!searching) return [];
    const tokens = tokenizeSearch(query);
    return catalogSlugs.map((slug) => ({
      slug,
      title: catalogDefinitions[slug].title,
      // `idle` counts as busy so the server-rendered pass of a shared ?q= link reads as
      // "searching" rather than flashing "Nothing matched" until hydration starts a fetch.
      busy: status[slug] === 'idle' || status[slug] === 'loading',
      failed: status[slug] === 'error',
      matches: (items[slug] ?? []).filter((item) => matchesSearch(searchText(item, $i18n), tokens))
    }));
  });

  let total = $derived(groups.reduce((sum, group) => sum + group.matches.length, 0));
  let pending = $derived(groups.some((group) => group.busy));
  let failed = $derived(groups.filter((group) => group.failed));
  let empty = $derived(searching && !pending && total === 0 && failed.length === 0);

  function catalogHref(slug: CatalogSlug): string {
    return `/data/${slug}?q=${encodeURIComponent(query)}`;
  }
</script>

<svelte:head>
  <title>Game Data — D2R Reimagined</title>
  <meta name="description" content="Search D2R Reimagined unique items, sets, runewords, bases, affixes, and cube recipes." />
</svelte:head>

<section class="data-index-page mx-auto max-w-7xl px-5 py-16">
  <div class="mx-auto max-w-3xl text-center">
    <h1 class="display-text text-4xl sm:text-6xl">Game Data</h1>
    <p class="mt-4 text-lg text-parchment-300">Search the systems and items that shape D2R Reimagined.</p>
  </div>

  <search class="mx-auto mt-8 max-w-2xl">
    <label>
      <span class="sr-only">Search all data</span>
      <input
        class="field all-data-field"
        type="search"
        placeholder="Search all data — try “Holy Bolt”"
        autocomplete="off"
        bind:value={search}
      />
    </label>
    <p class="mt-2 text-center text-xs text-parchment-300/75">
      Looks through every catalog at once. Use + for AND, comma or | for OR, and - to exclude a phrase.
    </p>
  </search>

  {#if !searching}
    <div class="data-index-grid mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each definitions as definition}
        <a href={`/data/${definition.slug}`} class="data-index-card panel group rounded-lg p-6 hover:border-ember-400/50">
          <h2 class="display-text text-2xl group-hover:text-ember-400">{definition.title}</h2>
          <p class="mt-3 text-parchment-300">{definition.description}</p>
        </a>
      {/each}
    </div>
  {:else}
    <p class="mt-8 text-center text-parchment-300" aria-live="polite">
      {#if pending}
        Searching every catalog…
      {:else}
        <span class="rarity-line">{total.toLocaleString()}</span> results for “{query}”
      {/if}
    </p>

    {#each groups as group (group.slug)}
      {#if group.matches.length || group.busy}
        <section class="mt-10">
          <header class="flex flex-wrap items-baseline justify-between gap-3 border-b border-parchment-300/15 pb-2">
            <h2 class="display-text text-2xl">
              {group.title}
              {#if !group.busy}
                <span class="text-base text-parchment-300">{group.matches.length.toLocaleString()}</span>
              {/if}
            </h2>
            {#if group.matches.length > preview}
              <a href={catalogHref(group.slug)} class="text-sm text-ember-400 hover:text-white">
                View all {group.matches.length.toLocaleString()} in {group.title} →
              </a>
            {/if}
          </header>

          {#if group.busy}
            <p class="mt-4 text-sm text-parchment-300/75">Loading {group.title.toLowerCase()}…</p>
          {:else}
            <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {#each group.matches.slice(0, preview) as item, index (`${String(item.Index ?? item.NameKey ?? index)}-${index}`)}
                <CatalogCard {item} slug={group.slug} />
              {/each}
            </div>
          {/if}
        </section>
      {/if}
    {/each}

    {#if failed.length}
      <p class="mt-8 text-center text-sm text-requirement">
        Could not load {failed.map((group) => group.title).join(', ')}. Check your connection and search again.
      </p>
    {/if}

    {#if empty}
      <div class="panel mx-auto mt-10 max-w-xl rounded-lg p-10 text-center">
        <h2 class="display-text text-2xl">Nothing matched</h2>
        <p class="mt-2 text-parchment-300">No item, affix, or recipe mentions “{query}”. Try a shorter phrase.</p>
      </div>
    {/if}
  {/if}
</section>

<style>
  .all-data-field {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
</style>
