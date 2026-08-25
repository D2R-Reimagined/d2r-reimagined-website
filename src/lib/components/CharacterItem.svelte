<script lang="ts">
  import ItemTooltip from '$lib/components/ItemTooltip.svelte';
  import { itemSprite, itemVariant, type ItemPresentation } from '$lib/item-presentation';
  import type { ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import type { SaveItem } from '$lib/characters';

  let {
    item,
    presentation,
    statPresentation,
    style
  }: { item: SaveItem; presentation?: ItemPresentation; statPresentation?: ItemStatPresentationBundle; style: string } = $props();

  let open = $state(false);
  let sprite = $derived(itemSprite(item, presentation));
  let variant = $derived(presentation ? itemVariant(item, presentation) : null);
  let label = $derived(variant?.NameKey || item.baseName || item.codeText);
</script>

<div
  class="character-item absolute flex cursor-help items-center justify-center p-[0.3%] focus:outline-none"
  class:z-40={open}
  class:z-10={!open}
  style={style}
  tabindex="0"
  role="button"
  aria-label={`Inspect ${label}`}
  onmouseenter={() => open = true}
  onmouseleave={() => open = false}
  onfocus={() => open = true}
  onblur={() => open = false}
  onclick={() => open = true}
  onkeydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open = true;
    } else if (event.key === 'Escape') {
      open = false;
    }
  }}
>
  {#if sprite}
    <img src={sprite} alt="" class="h-full w-full object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.9)]" />
  {:else}
    <span class="rounded bg-black/75 px-1 py-0.5 text-center text-[clamp(0.42rem,1.25vw,0.72rem)] leading-tight text-parchment-200">
      {item.codeText}
    </span>
  {/if}
  {#if item.quantity && item.quantity > 1}
    <span class="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 text-[clamp(0.45rem,1.1vw,0.7rem)] text-white">{item.quantity}</span>
  {/if}
  {#if open}
    <div class="absolute bottom-[calc(100%+0.4rem)] left-1/2">
      <ItemTooltip {item} {presentation} {statPresentation} />
    </div>
  {/if}
</div>
