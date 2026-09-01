<script lang="ts">
  import { onMount } from 'svelte';
  import CharacterItem from '$lib/components/CharacterItem.svelte';
  import type { SaveItem } from '$lib/characters';
  import { loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemStatPresentation, type ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import { loadRareNamePresentation, type RareNamePresentation } from '$lib/rare-name-presentation';

  let {
    items,
    selectedItemSeed,
    onItemSelect
  }: {
    items: SaveItem[];
    selectedItemSeed?: number | null;
    onItemSelect: (item: SaveItem) => void;
  } = $props();

  const columns = 10;
  const rows = 10;
  let presentations = $state(new Map<string, ItemPresentation>());
  let upgradeTiers = $state<ItemUpgradeTiers>(new Map());
  let statPresentation = $state<ItemStatPresentationBundle>();
  let rareNames = $state<RareNamePresentation>();

  function style(item: SaveItem, presentation?: ItemPresentation): string {
    const width = presentation?.Width ?? 1;
    const height = presentation?.Height ?? 1;
    return `left:${item.position.inventoryX / columns * 100}%;top:${item.position.inventoryY / rows * 100}%;width:${width / columns * 100}%;height:${height / rows * 100}%`;
  }

  function tooltipSide(item: SaveItem): 'left' | 'right' {
    return item.position.inventoryX >= columns / 2 ? 'left' : 'right';
  }

  onMount(async () => {
    [presentations, upgradeTiers, statPresentation, rareNames] = await Promise.all([
      loadItemPresentation(),
      loadItemUpgradeTiers(),
      loadItemStatPresentation(),
      loadRareNamePresentation()
    ]);
  });
</script>

<div class="mx-auto w-full max-w-[720px]">
  <div class="stash-grid relative aspect-square overflow-hidden rounded border border-parchment-300/25 bg-[#080808] shadow-2xl shadow-black/70">
    {#each items as item (item.seed)}
      {@const presentation = presentations.get(item.codeText.toLowerCase())}
      <CharacterItem
        {item}
        {presentation}
        itemPresentations={presentations}
        {upgradeTiers}
        {statPresentation}
        {rareNames}
        onselect={onItemSelect}
        selected={selectedItemSeed === item.seed}
        style={style(item, presentation)}
        tooltipSide={tooltipSide(item)}
      />
    {/each}
  </div>
  <p class="mt-4 text-center text-sm text-parchment-300">Choose an item directly from your server-synced shared stash.</p>
</div>

<style>
  .stash-grid {
    background-image:
      linear-gradient(to right, rgb(188 167 125 / 0.11) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(188 167 125 / 0.11) 1px, transparent 1px),
      radial-gradient(circle at center, rgb(61 41 24 / 0.35), transparent 68%);
    background-size: 10% 10%, 10% 10%, 100% 100%;
  }
</style>
