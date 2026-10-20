<script lang="ts">
  import { onMount } from 'svelte';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';
  import type { GrailCategory } from '$lib/grail-query';
  import CatalogCard from './CatalogCard.svelte';

  let { item, category, onclose }: { item: CatalogItem; category: GrailCategory; onclose: () => void } = $props();
  let dialog: HTMLDialogElement;
  let card = $derived(category === 'sets' ? {
    Index: String(item.SetName ?? item.Index ?? ''),
    PartialBonuses: item.PartialBonuses,
    FullBonuses: item.FullBonuses,
    SetItems: [item]
  } : item);

  onMount(() => { dialog.showModal(); });

  function dismissOutside(event: MouseEvent) {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
</script>

<dialog bind:this={dialog} onclose={onclose} onclick={dismissOutside} aria-label={`${$i18n.t(String(item.Index ?? item.NameKey))} details`}
  class="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg border border-parchment-300/25 bg-abyss-850 p-4 text-parchment-200 backdrop:bg-black/80">
  <form method="dialog" class="mb-3 flex justify-end">
    <button class="rounded border border-parchment-300/25 px-3 py-1 hover:border-ember-400" aria-label="Close item details">Close ✕</button>
  </form>
  <CatalogCard item={card} slug={category} />
</dialog>

<style>
  dialog :global(.scroll-card) { content-visibility: visible; contain: none; }
</style>
