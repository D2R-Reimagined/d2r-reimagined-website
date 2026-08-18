<script lang="ts">
  import type { CatalogSlug } from '$lib/types';

  let {
    slug,
    typeOptions,
    classOptions,
    search = $bindable(''),
    selectedType = $bindable(''),
    selectedClass = $bindable(''),
    subtype = $bindable(''),
    hideVanilla = $bindable(false),
    runeCount = $bindable(''),
    reset
  }: {
    slug: CatalogSlug;
    typeOptions: string[];
    classOptions: string[];
    search?: string;
    selectedType?: string;
    selectedClass?: string;
    subtype?: string;
    hideVanilla?: boolean;
    runeCount?: string;
    reset: () => void;
  } = $props();
</script>

<div class="panel mb-8 rounded-lg p-4" aria-label="Catalog filters">
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
    <label class="sm:col-span-2">
      <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Search</span>
      <input class="field" type="search" placeholder="Name, property, base, or class…" bind:value={search} />
    </label>

    {#if typeOptions.length}
      <label>
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Item type</span>
        <select class="field" bind:value={selectedType}>
          <option value="">All types</option>
          {#each typeOptions as option}<option value={option}>{option}</option>{/each}
        </select>
      </label>
    {/if}

    {#if classOptions.length}
      <label>
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Class</span>
        <select class="field" bind:value={selectedClass}>
          <option value="">All classes</option>
          {#each classOptions as option}<option value={option}>{option}</option>{/each}
        </select>
      </label>
    {/if}

    {#if slug === 'bases'}
      <label>
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Base group</span>
        <select class="field" bind:value={subtype}><option value="">All bases</option><option value="weapon">Weapons</option><option value="armor">Armor</option></select>
      </label>
    {:else if slug === 'affixes'}
      <label>
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Affix kind</span>
        <select class="field" bind:value={subtype}><option value="">All affixes</option><option value="prefix">Prefixes</option><option value="suffix">Suffixes</option></select>
      </label>
    {:else if slug === 'runewords'}
      <label>
        <span class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">Rune count</span>
        <select class="field" bind:value={runeCount}><option value="">Any count</option>{#each [2, 3, 4, 5, 6] as count}<option value={String(count)}>{count} runes</option>{/each}</select>
      </label>
    {/if}

    {#if ['uniques', 'sets', 'runewords'].includes(slug)}
      <label class="flex min-h-12 items-center gap-3 self-end rounded-md border border-parchment-300/20 bg-black/20 px-3 py-2">
        <input type="checkbox" bind:checked={hideVanilla} class="rounded border-gray-600 bg-gray-900 text-ember-500 focus:ring-ember-500" />
        <span>Hide vanilla</span>
      </label>
    {/if}

    <button type="button" onclick={reset} class="min-h-12 self-end rounded-md border border-ember-500/55 px-4 py-2 text-ember-400 transition hover:bg-ember-700 hover:text-white">
      Reset filters
    </button>
  </div>
</div>
