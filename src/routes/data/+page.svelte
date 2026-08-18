<script lang="ts">
  import { catalogDefinitions, skillPlannerDefinition } from '$lib/types';

  const definitions = [skillPlannerDefinition, ...Object.values(catalogDefinitions)];
</script>

<svelte:head>
  <title>Game Data — D2R Reimagined</title>
  <meta name="description" content="Search D2R Reimagined unique items, sets, runewords, bases, affixes, and cube recipes." />
</svelte:head>

<section class="mx-auto max-w-7xl px-5 py-16">
  <div class="mx-auto max-w-3xl text-center">
    <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">The archive</p>
    <h1 class="display-text mt-3 text-4xl sm:text-6xl">Game Data</h1>
    <p class="mt-4 text-lg text-parchment-300">Search the systems and items that shape D2R Reimagined.</p>
  </div>
  <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each definitions as definition}
      <a href={`/data/${definition.slug}`} class="panel group rounded-lg p-6 hover:border-ember-400/50">
        <p class="display-text text-xs uppercase tracking-[0.2em] text-ember-400">{definition.eyebrow}</p>
        <h2 class="display-text mt-3 text-2xl group-hover:text-ember-400">{definition.title}</h2>
        <p class="mt-3 text-parchment-300">{definition.description}</p>
      </a>
    {/each}
  </div>
</section>
