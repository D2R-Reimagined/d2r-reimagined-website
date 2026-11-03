<script lang="ts">
  import { onMount } from 'svelte';
  import TradeItemProperties from '#lib/components/TradeItemProperties.svelte';
  import type { SaveItem } from '#lib/characters.js';
  import { itemSprite, loadItemPresentation, type ItemPresentation } from '#lib/item-presentation.js';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '#lib/item-upgrade-tiers.js';
  import type { TradeListing } from '#lib/trades.js';

  let {
    listing,
    compact = false,
    highlights = new Set<string>(),
    onoffer,
    onmessage
  }: {
    listing: TradeListing;
    /** Dense list layout: small sprite, inline tags, one-line price and actions. */
    compact?: boolean;
    /** Stats the current search filtered on; matching property lines glow. */
    highlights?: Set<string>;
    onoffer?: (listing: TradeListing) => void;
    onmessage?: (listing: TradeListing) => void;
  } = $props();

  let presentations = $state(new Map<string, ItemPresentation>());
  let tiers = $state<ItemUpgradeTiers>(new Map());
  let item = $derived.by(() => {
    if (!listing.itemData) return null;
    try { return JSON.parse(listing.itemData) as SaveItem; } catch { return null; }
  });
  let presentation = $derived(presentations.get((item?.codeText || listing.itemCode || '').toLowerCase()));
  let sprite = $derived.by(() => {
    if (item) return itemSprite(item, presentation, presentations, tiers);
    return presentation?.Sprite ? `/data/${presentation.Sprite}` : null;
  });

  function qualityClass(): string {
    if (!listing.isIdentified) return 'text-red-400';
    const quality = (listing.itemQuality || '').toLowerCase();
    if (quality.includes('unique')) return 'text-unique';
    if (quality.includes('set')) return 'text-set';
    if (quality.includes('magic')) return 'text-magic';
    if (quality.includes('rare') || quality.includes('crafted')) return 'text-yellow-300';
    return 'text-parchment-50';
  }

  function age(value: string): string {
    const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  onMount(async () => {
    [presentations, tiers] = await Promise.all([loadItemPresentation(), loadItemUpgradeTiers()]);
  });
</script>

{#snippet tags(size: string)}
  {#if !listing.isIdentified}<span class={`trade-tag ${size} !border-red-500/35 !text-red-300`}>Unidentified</span>
  {:else if listing.itemQuality}<span class={`trade-tag ${size}`}>{listing.itemQuality}</span>{/if}
  {#if listing.requiredLevel != null}<span class={`trade-tag ${size}`}>Req {listing.requiredLevel}</span>{/if}
  {#if listing.socketCount}<span class={`trade-tag ${size}`}>{listing.socketCount} sockets</span>{/if}
  {#if listing.isEthereal}<span class={`trade-tag ${size} !border-sky-400/30 !text-sky-200`}>Ethereal</span>{/if}
  {#if listing.isCorrupted}<span class={`trade-tag ${size} !border-red-500/35 !text-red-300`}>Corrupted</span>{/if}
  {#if listing.isLadder}<span class={`trade-tag ${size} !border-set/30 !text-set`}>Ladder</span>{/if}
  {#if listing.gameMode === 'RotW'}<span class={`trade-tag ${size} !border-ember-400/40 !text-ember-300`} title="Reign of the Warlock">RotW</span>
  {:else if listing.gameMode === 'Expansion'}<span class={`trade-tag ${size} !border-sky-400/30 !text-sky-200`}>Expansion</span>
  {:else}<span class={`trade-tag ${size}`} title="This listing does not say which game the item is in - ask the seller.">Game unknown</span>{/if}
{/snippet}

{#snippet spriteBox(box: string)}
  <div class={`grid shrink-0 place-items-center overflow-hidden rounded border border-parchment-300/15 bg-black/45 shadow-inner shadow-black ${box}`}>
    {#if sprite}<span class="flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden"><img src={sprite} alt="" class="block max-h-full max-w-full object-contain drop-shadow-[0_4px_5px_rgba(0,0,0,0.9)]" /></span>{:else}<span class="display-text text-center text-xs text-parchment-300">{listing.itemCode || 'ITEM'}</span>{/if}
  </div>
{/snippet}

{#if compact}
<article class="trade-listing-card compact flex h-full flex-col">
  <a href={`/trade/${listing.id}`} class="group flex min-w-0 flex-1 gap-3 px-3 pb-2.5 pt-2.5">
    {@render spriteBox('h-14 w-12 p-1')}
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline justify-between gap-2">
        <h2 class={`display-text truncate text-base leading-tight transition group-hover:text-ember-400 ${qualityClass()}`}>{listing.itemName}</h2>
        <span class="shrink-0 text-[0.65rem] text-parchment-300">{age(listing.createdAtUtc)}</span>
      </div>
      <p class="truncate text-xs text-parchment-300">{listing.itemType || listing.title}{#if item && listing.isIdentified} · ilvl {item.itemLevel}{/if}</p>
      <div class="mt-1 flex h-[1.1rem] flex-wrap gap-1 overflow-hidden text-[0.6rem] uppercase tracking-wider">{@render tags('compact-tag')}</div>
      <TradeItemProperties {item} unidentified={!listing.isIdentified} compact {highlights} />
    </div>
  </a>
  <div class="flex items-center gap-2 rounded-b-lg border-t border-parchment-300/10 bg-black/20 py-1.5 pl-3 pr-1.5">
    <p class="min-w-0 flex-1 truncate text-xs" title={listing.price || 'Offers'}>
      <span class="text-parchment-300">Wants</span> <span class="text-parchment-50">{listing.price || 'Offers'}</span>
      <span class="text-parchment-300"> · {listing.sellerDisplayName}</span>
    </p>
    <button type="button" class="shrink-0 rounded px-2 py-1 text-xs text-parchment-200 hover:bg-white/[0.06] hover:text-white" onclick={() => onmessage?.(listing)}>Message</button>
    <button type="button" class="shrink-0 rounded border border-ember-500/40 px-2 py-1 text-xs text-ember-400 hover:bg-ember-700/25 hover:text-ember-300" onclick={() => onoffer?.(listing)}>Offer</button>
  </div>
</article>
{:else}
<article class="trade-listing-card scroll-card">
  <a href={`/trade/${listing.id}`} class="group flex min-w-0 flex-1 gap-4 p-4 sm:p-5">
    {@render spriteBox('h-24 w-20 p-2 sm:h-28 sm:w-24')}
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class={`display-text truncate text-xl transition group-hover:text-ember-400 ${qualityClass()}`}>{listing.itemName}</h2>
          <p class="mt-0.5 truncate text-sm text-parchment-300">{listing.itemType || listing.title}</p>
        </div>
        <span class="shrink-0 text-xs text-parchment-300">{age(listing.createdAtUtc)}</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5 text-[0.68rem] uppercase tracking-wider">{@render tags('')}</div>
      <TradeItemProperties {item} unidentified={!listing.isIdentified} {highlights} />
      <div class="mt-4 border-t border-parchment-300/10 pt-3">
        <p class="text-[0.68rem] uppercase tracking-[0.18em] text-parchment-300">Looking for</p>
        <p class="mt-1 line-clamp-2 text-sm text-parchment-50">{listing.price || 'Offers'}</p>
      </div>
      <p class="mt-3 text-xs text-parchment-300">{listing.sellerDisplayName}{listing.ladderName ? ` · ${listing.ladderName}` : ' · Standard'}</p>
    </div>
  </a>
  <div class="flex border-t border-parchment-300/12 bg-black/20">
    <button type="button" class="flex-1 px-3 py-2.5 text-sm text-parchment-200 hover:bg-white/[0.035] hover:text-white" onclick={() => onmessage?.(listing)}>Message</button>
    <span class="w-px bg-parchment-300/12"></span>
    <button type="button" class="flex-1 px-3 py-2.5 text-sm text-ember-400 hover:bg-ember-700/15 hover:text-ember-300" onclick={() => onoffer?.(listing)}>Make offer</button>
  </div>
</article>
{/if}

<style>
  .trade-listing-card { overflow: hidden; border: 1px solid rgb(188 167 125 / 0.22); border-radius: 0.5rem; background: linear-gradient(145deg, #171514, #111010); transition: border-color 150ms ease, transform 150ms ease; }
  .trade-listing-card:hover { border-color: rgb(228 90 53 / 0.48); transform: translateY(-2px); }
  .trade-tag.compact-tag { padding: 0.05rem 0.35rem; }
  .trade-listing-card.compact { overflow: visible; }
  .trade-listing-card.compact:hover { transform: none; }
  .trade-tag { border: 1px solid rgb(188 167 125 / 0.22); border-radius: 999px; padding: 0.18rem 0.45rem; color: #bca77d; }
</style>
