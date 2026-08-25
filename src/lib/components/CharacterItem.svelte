<script lang="ts">
  import ItemTooltip from '$lib/components/ItemTooltip.svelte';
  import { isItemIdentified, itemDisplayLabel } from '$lib/item-identification';
  import { itemSprite, itemVariant, type ItemPresentation } from '$lib/item-presentation';
  import type { ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import type { SaveItem } from '$lib/characters';

  let {
    item,
    presentation,
    itemPresentations,
    statPresentation,
    runewordNameKey,
    style,
    tooltipSide = 'right'
  }: {
    item: SaveItem;
    presentation?: ItemPresentation;
    itemPresentations: Map<string, ItemPresentation>;
    statPresentation?: ItemStatPresentationBundle;
    runewordNameKey?: string;
    style: string;
    tooltipSide?: 'left' | 'right';
  } = $props();

  let open = $state(false);
  let sprite = $derived(itemSprite(item, presentation, itemPresentations));
  let variant = $derived(presentation ? itemVariant(item, presentation, itemPresentations) : null);
  let identified = $derived(isItemIdentified(item));
  let label = $derived(itemDisplayLabel(item, identified ? variant?.NameKey : null));
  let socketItems = $derived(item.sockets.filter((socket): socket is SaveItem => socket !== null));

  function socketSprite(socket: SaveItem): string | null {
    return itemSprite(socket, itemPresentations.get(socket.codeText.toLowerCase()), itemPresentations);
  }
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
  {#if socketItems.length}
    <div
      class="pointer-events-none absolute bottom-[3%] left-1/2 z-20 grid w-[72%] -translate-x-1/2 gap-[2%]"
      style={`grid-template-columns:repeat(${socketItems.length},minmax(0,1fr))`}
      aria-hidden="true"
    >
      {#each socketItems as socket, index (`${socket.codeText}-${index}`)}
        {@const socketImage = socketSprite(socket)}
        <span class="aspect-square min-w-0 overflow-hidden rounded-full border border-parchment-300/65 bg-black/85 p-[7%] shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
          {#if socketImage}
            <img src={socketImage} alt="" class="h-full w-full object-contain" />
          {:else}
            <span class="flex h-full w-full items-center justify-center text-[clamp(0.35rem,0.8vw,0.58rem)] text-parchment-100">
              {socket.codeText}
            </span>
          {/if}
        </span>
      {/each}
    </div>
  {/if}
  {#if item.quantity && item.quantity > 1}
    <span class="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 text-[clamp(0.45rem,1.1vw,0.7rem)] text-white">{item.quantity}</span>
  {/if}
  {#if open}
    <div
      class={`pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-50 w-[min(23rem,82vw)] -translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 ${tooltipSide === 'left' ? 'sm:left-auto sm:right-[calc(100%+0.5rem)]' : 'sm:left-[calc(100%+0.5rem)]'}`}
    >
      <ItemTooltip {item} {presentation} {itemPresentations} {statPresentation} {runewordNameKey} />
    </div>
  {/if}
</div>
