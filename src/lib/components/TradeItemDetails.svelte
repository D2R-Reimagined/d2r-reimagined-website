<script lang="ts">
  import { onMount } from 'svelte';
  import ItemTooltip from '$lib/components/ItemTooltip.svelte';
  import type { SaveItem } from '$lib/characters';
  import { itemSprite, loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import { loadItemStatPresentation, type ItemStatPresentationBundle } from '$lib/item-stat-presentation';

  let {
    item,
    itemCode = null,
    unidentified = false,
    label = 'Item'
  }: {
    item: SaveItem | null;
    itemCode?: string | null;
    unidentified?: boolean;
    label?: string;
  } = $props();
  let presentations = $state(new Map<string, ItemPresentation>());
  let upgradeTiers = $state<ItemUpgradeTiers>(new Map());
  let statPresentation = $state<ItemStatPresentationBundle>();
  let code = $derived(item?.codeText || itemCode || '');
  let presentation = $derived(presentations.get(code.toLowerCase()));
  let sprite = $derived.by(() => {
    if (item) return itemSprite(item, presentation, presentations, upgradeTiers);
    return presentation?.Sprite ? `/data/${presentation.Sprite}` : null;
  });

  onMount(async () => {
    [presentations, upgradeTiers, statPresentation] = await Promise.all([
      loadItemPresentation(), loadItemUpgradeTiers(), loadItemStatPresentation()
    ]);
  });
</script>

<div class="grid gap-5 md:grid-cols-[12rem_1fr] md:items-start">
  <div class="grid h-56 place-items-center overflow-hidden rounded border border-parchment-300/15 bg-black/45 p-5 shadow-inner shadow-black">
    {#if sprite}<span class="flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden"><img src={sprite} alt="" class="block max-h-full max-w-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.95)]" /></span>{:else}<span class="display-text text-parchment-300">{code || 'ITEM'}</span>{/if}
  </div>
  {#if unidentified}
    <div class="grid min-h-56 place-items-center rounded border border-red-500/20 bg-black/25 p-6 text-center">
      <div>
        <p class="display-text text-2xl text-parchment-50">{label}</p>
        <p class="mt-2 text-sm uppercase tracking-[0.2em] text-red-400">Unidentified</p>
        <p class="mx-auto mt-4 max-w-md text-sm leading-6 text-parchment-300">Its identity, quality, requirements, rolls, sockets, and properties are hidden from both players until it is identified in game.</p>
      </div>
    </div>
  {:else if item}
    <div class="[&_.item-tooltip]:pointer-events-auto"><ItemTooltip {item} {presentation} itemPresentations={presentations} {upgradeTiers} {statPresentation} /></div>
  {:else}
    <div class="grid min-h-56 place-items-center rounded border border-parchment-300/15 bg-black/25 p-6 text-center text-parchment-300">Detailed item data is unavailable for this listing.</div>
  {/if}
</div>
