<script lang="ts">
  import { tick } from 'svelte';
  import ItemTooltip from '$lib/components/ItemTooltip.svelte';
  import { isItemIdentified, itemDisplayLabel } from '$lib/item-identification';
  import { hasUnknownItemVariant, itemSprite, itemVariant, type ItemPresentation } from '$lib/item-presentation';
  import type { ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import type { ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import { i18n } from '$lib/i18n';
  import { rareItemName, type RareNamePresentation } from '$lib/rare-name-presentation';
  import type { SaveItem } from '$lib/characters';

  let {
    item,
    presentation,
    itemPresentations,
    upgradeTiers,
    statPresentation,
    rareNames,
    runewordNameKey,
    characterLevel,
    style,
    tooltipSide = 'right'
  }: {
    item: SaveItem;
    presentation?: ItemPresentation;
    itemPresentations: Map<string, ItemPresentation>;
    upgradeTiers: ItemUpgradeTiers;
    statPresentation?: ItemStatPresentationBundle;
    rareNames?: RareNamePresentation;
    runewordNameKey?: string;
    characterLevel?: number;
    style: string;
    tooltipSide?: 'left' | 'right';
  } = $props();

  let open = $state(false);
  let itemElement: HTMLDivElement | undefined = $state();
  let tooltipElement: HTMLDivElement | undefined = $state();
  let tooltipStyle = $state('left:0;top:0;visibility:hidden');
  let sprite = $derived(itemSprite(item, presentation, itemPresentations, upgradeTiers));
  let variant = $derived(itemVariant(item, presentation, itemPresentations, upgradeTiers));
  let unknownVariant = $derived(hasUnknownItemVariant(item, presentation, itemPresentations, upgradeTiers));
  let identified = $derived(isItemIdentified(item));
  let generatedRareName = $derived(
    identified ? rareItemName(item, rareNames, (key) => $i18n.t(key)) : null
  );
  let identifiedName = $derived(
    generatedRareName
      ?? (variant?.NameKey ? $i18n.t(variant.NameKey) : null)
      ?? (unknownVariant ? 'Unknown item' : null)
  );
  let label = $derived(itemDisplayLabel(item, identified ? identifiedName : null));
  let socketItems = $derived(item.sockets.filter((socket): socket is SaveItem => socket !== null));

  function socketSprite(socket: SaveItem): string | null {
    return itemSprite(socket, itemPresentations.get(socket.codeText.toLowerCase()), itemPresentations, upgradeTiers);
  }

  function positionTooltip() {
    if (!itemElement || !tooltipElement) return;

    const margin = 8;
    const gap = 8;
    const anchor = itemElement.getBoundingClientRect();
    const tooltip = tooltipElement.getBoundingClientRect();
    const availableWidth = window.innerWidth - (margin * 2);
    const width = Math.min(tooltip.width, availableWidth);
    let left: number;
    let top: number;

    if (window.innerWidth < 640) {
      left = anchor.left + (anchor.width / 2) - (width / 2);
      top = anchor.top - tooltip.height - gap;
      if (top < margin) top = anchor.bottom + gap;
    } else {
      const preferredLeft = tooltipSide === 'left'
        ? anchor.left - width - gap
        : anchor.right + gap;
      const alternateLeft = tooltipSide === 'left'
        ? anchor.right + gap
        : anchor.left - width - gap;
      const preferredFits = preferredLeft >= margin && preferredLeft + width <= window.innerWidth - margin;
      left = preferredFits ? preferredLeft : alternateLeft;
      top = anchor.top + (anchor.height / 2) - (tooltip.height / 2);
    }

    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltip.height - margin));
    tooltipStyle = `left:${left}px;top:${top}px;width:${width}px;visibility:visible`;
  }

  async function showTooltip() {
    open = true;
    tooltipStyle = 'left:0;top:0;visibility:hidden';
    await tick();
    positionTooltip();
  }

  function hideTooltip() {
    open = false;
  }

  $effect(() => {
    if (!open) return;
    const reposition = () => positionTooltip();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  });
</script>

<div
  bind:this={itemElement}
  class="character-item absolute flex cursor-help items-center justify-center p-[0.3%] focus:outline-none"
  class:z-60={open}
  class:z-10={!open}
  style={style}
  tabindex="0"
  role="button"
  aria-label={`Inspect ${label}`}
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocus={showTooltip}
  onblur={hideTooltip}
  onclick={showTooltip}
  onkeydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showTooltip();
    } else if (event.key === 'Escape') {
      hideTooltip();
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
      bind:this={tooltipElement}
      class="pointer-events-auto fixed z-[100] pointer-fine:pointer-events-none max-h-[calc(100vh-1rem)] w-[min(23rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain"
      style={tooltipStyle}
    >
      <ItemTooltip {item} {presentation} {itemPresentations} {upgradeTiers} {statPresentation} {runewordNameKey} {identifiedName} {characterLevel} />
    </div>
  {/if}
</div>
