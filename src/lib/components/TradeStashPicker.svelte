<script lang="ts">
  import { onMount } from 'svelte';
  import { loadCatalog } from '#lib/catalog-sources.js';
  import CharacterItem from '#lib/components/CharacterItem.svelte';
  import type { SaveItem } from '#lib/characters.js';
  import { loadItemPresentation, type ItemPresentation } from '#lib/item-presentation.js';
  import { loadItemStatPresentation, type ItemStatPresentationBundle } from '#lib/item-stat-presentation.js';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '#lib/item-upgrade-tiers.js';
  import { loadRareNamePresentation, type RareNamePresentation } from '#lib/rare-name-presentation.js';
  import { buildRunewordNameMap, runewordNameKey } from '#lib/runeword-presentation.js';
  import {
    isCurrencyStashTab,
    isSameSaveItem,
    layoutStashItems,
    type PositionedStashItem
  } from '#lib/trade-stash.js';

  let {
    items,
    tabType = 'Normal',
    selectedItem = null,
    selectedItemSeed,
    onItemSelect
  }: {
    items: SaveItem[];
    tabType?: string | null;
    selectedItem?: SaveItem | null;
    selectedItemSeed?: number | null;
    onItemSelect: (item: SaveItem) => void;
  } = $props();

  let presentations = $state(new Map<string, ItemPresentation>());
  let upgradeTiers = $state<ItemUpgradeTiers>(new Map());
  let statPresentation = $state<ItemStatPresentationBundle>();
  let rareNames = $state<RareNamePresentation>();
  let runewordNames = $state(new Map<string, string>());

  let grid = $derived(layoutStashItems(items, presentations, tabType));
  let currencyTab = $derived(isCurrencyStashTab(tabType));

  function entryStyle(entry: PositionedStashItem, columns: number, rows: number): string {
    return `left:${entry.x / columns * 100}%;top:${entry.y / rows * 100}%;width:${entry.width / columns * 100}%;height:${entry.height / rows * 100}%`;
  }

  function tooltipSide(entry: PositionedStashItem, columns: number): 'left' | 'right' {
    return entry.x + entry.width / 2 > columns / 2 ? 'left' : 'right';
  }

  onMount(async () => {
    const [loadedPresentations, loadedUpgradeTiers, loadedStatPresentation, loadedRareNames, runewords] = await Promise.all([
      loadItemPresentation(),
      loadItemUpgradeTiers(),
      loadItemStatPresentation(),
      loadRareNamePresentation(),
      loadCatalog('runewords')
    ]);
    presentations = loadedPresentations;
    upgradeTiers = loadedUpgradeTiers;
    statPresentation = loadedStatPresentation;
    rareNames = loadedRareNames;
    runewordNames = buildRunewordNameMap(runewords);
  });
</script>

<div class="mx-auto w-full max-w-[960px]">
  <div
    class="stash-grid relative w-full overflow-hidden rounded border border-parchment-300/25 bg-[#080808] shadow-2xl shadow-black/70"
    style={`--stash-cols:${grid.columns};--stash-rows:${grid.rows};aspect-ratio:${grid.columns} / ${grid.rows}`}
  >
    {#each grid.entries as entry (entry.key)}
      {@const presentation = presentations.get(entry.item.codeText.toLowerCase())}
      <CharacterItem
        item={entry.item}
        {presentation}
        itemPresentations={presentations}
        {upgradeTiers}
        {statPresentation}
        {rareNames}
        runewordNameKey={runewordNameKey(entry.item, runewordNames)}
        onselect={onItemSelect}
        selected={isSameSaveItem(selectedItem, entry.item, selectedItemSeed)}
        style={entryStyle(entry, grid.columns, grid.rows)}
        tooltipSide={tooltipSide(entry, grid.columns)}
      />
    {/each}
  </div>
  <p class="mt-4 text-center text-sm text-parchment-300">
    {currencyTab
      ? 'Currency stacks from your server-synced shared stash.'
      : 'Choose an item directly from your server-synced shared stash.'}
  </p>
</div>

<style>
  .stash-grid {
    background-image:
      linear-gradient(to right, rgb(188 167 125 / 0.11) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(188 167 125 / 0.11) 1px, transparent 1px),
      radial-gradient(circle at center, rgb(61 41 24 / 0.35), transparent 68%);
    background-size:
      calc(100% / var(--stash-cols, 16)) calc(100% / var(--stash-rows, 13)),
      calc(100% / var(--stash-cols, 16)) calc(100% / var(--stash-rows, 13)),
      100% 100%;
  }
</style>
