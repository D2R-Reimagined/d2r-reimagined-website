<script lang="ts">
  import { filterPath } from '#lib/loot-filter/library.js';

  let { data } = $props();

  function pageLink(skip: number) {
    const params = new URLSearchParams();
    if (data.search) params.set('search', data.search);
    if (skip > 0) params.set('skip', String(skip));
    const query = params.toString();
    return query ? `/loot-filter/public?${query}` : '/loot-filter/public';
  }
</script>

<svelte:head>
  <title>Public Loot Filters | D2R Reimagined</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content="Browse Pyre Loot Filters shared by D2R Reimagined players." />
  <meta property="og:title" content="Public Loot Filters · D2R Reimagined" />
</svelte:head>

<section class="mx-auto max-w-[1800px] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="display-text mt-2 text-3xl">Public Loot Filters</h1>
      <p class="mt-2 text-sm text-parchment-300">Filters other players have shared. Open one to see its rules, download it, or copy it into your own library.</p>
    </div>
    <a class="trade-secondary-button" href="/loot-filter">← My filters</a>
  </div>

  <form class="panel mt-6 flex flex-wrap items-end gap-3 rounded-lg p-4" method="GET" action="/loot-filter/public">
    <label class="min-w-0 flex-1 text-xs uppercase tracking-widest text-parchment-300">Search
      <input class="field mt-2" type="search" name="search" value={data.search} maxlength="80" placeholder="Filter name or author…" />
    </label>
    <button class="trade-primary-button" type="submit">Search</button>
    {#if data.search}<a class="text-sm text-ember-400 hover:underline" href="/loot-filter/public">Clear</a>{/if}
  </form>

  {#if data.serviceError}
    <p role="alert" class="mt-6 rounded border border-requirement/40 p-3 text-sm text-requirement">{data.serviceError}
      <a class="underline" href={pageLink(data.results.skip)}>Retry</a></p>
  {:else if !data.results.items.length}
    <p class="mt-6 rounded border border-dashed border-parchment-300/20 p-6 text-sm text-parchment-300">
      {data.search ? 'No public filters match this search.' : 'No one has shared a filter yet.'}
      Make one of your saved filters public from the <a class="text-ember-400 underline" href="/loot-filter">filter builder</a>.
    </p>
  {:else}
    <p class="mt-6 text-sm text-parchment-300">{data.results.total} {data.results.total === 1 ? 'filter' : 'filters'}</p>
    <ul class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {#each data.results.items as filter (filter.id)}
        <li>
          <a class="panel block h-full rounded-lg p-4 hover:border-ember-400" href={filterPath(filter.id)}>
            <h2 class="break-words text-parchment-50">{filter.name}</h2>
            <p class="mt-1 text-xs text-parchment-300">by {filter.authorName} · {filter.ruleCount} rules · updated
              {new Date(filter.updatedAtUtc).toLocaleDateString()}</p>
          </a>
        </li>
      {/each}
    </ul>
    <nav class="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm" aria-label="Public filter pages">
      {#if data.results.skip > 0}<a class="trade-secondary-button" href={pageLink(Math.max(0, data.results.skip - data.results.count))}>← Previous</a>{/if}
      <span class="text-parchment-300">{data.results.skip + 1}–{Math.min(data.results.skip + data.results.items.length, data.results.total)} of {data.results.total}</span>
      {#if data.results.skip + data.results.count < data.results.total}<a class="trade-secondary-button" href={pageLink(data.results.skip + data.results.count)}>Next →</a>{/if}
    </nav>
  {/if}
</section>
