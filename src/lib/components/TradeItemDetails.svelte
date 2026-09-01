<script lang="ts">
  import { onMount } from 'svelte';
  import ItemTooltip from '$lib/components/ItemTooltip.svelte';
  import type { SaveItem } from '$lib/characters';
  import { itemSprite, loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import { loadItemStatPresentation, type ItemStatPresentationBundle } from '$lib/item-stat-presentation';

  let { item }: { item: SaveItem } = $props();
  let presentations = $state(new Map<string, ItemPresentation>());
  let upgradeTiers = $state<ItemUpgradeTiers>(new Map());
  let statPresentation = $state<ItemStatPresentationBundle>();
  let presentation = $derived(presentations.get(item.codeText.toLowerCase()));
  let sprite = $derived(itemSprite(item, presentation, presentations, upgradeTiers));

  onMount(async () => {
    [presentations, upgradeTiers, statPresentation] = await Promise.all([
      loadItemPresentation(), loadItemUpgradeTiers(), loadItemStatPresentation()
    ]);
  });
</script>

<div class="grid gap-5 md:grid-cols-[12rem_1fr] md:items-start">
  <div class="grid min-h-56 place-items-center rounded border border-parchment-300/15 bg-black/45 p-5 shadow-inner shadow-black">
    {#if sprite}<img src={sprite} alt="" class="max-h-48 max-w-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.95)]" />{:else}<span class="display-text text-parchment-300">{item.codeText}</span>{/if}
  </div>
  <div class="[&_.item-tooltip]:pointer-events-auto"><ItemTooltip {item} {presentation} itemPresentations={presentations} {upgradeTiers} {statPresentation} /></div>
</div>
