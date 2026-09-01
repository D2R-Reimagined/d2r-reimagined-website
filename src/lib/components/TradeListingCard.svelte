<script lang="ts">
  import { onMount } from 'svelte';
  import type { SaveItem } from '$lib/characters';
  import { itemSprite, loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import type { TradeListing } from '$lib/trades';

  let {
    listing,
    onoffer,
    onmessage
  }: {
    listing: TradeListing;
    onoffer?: (listing: TradeListing) => void;
    onmessage?: (listing: TradeListing) => void;
  } = $props();

  let presentations = $state(new Map<string, ItemPresentation>());
  let tiers = $state<ItemUpgradeTiers>(new Map());
  let item = $derived.by(() => {
    if (!listing.itemData) return null;
    try { return JSON.parse(listing.itemData) as SaveItem; } catch { return null; }
  });
  let presentation = $derived(item ? presentations.get(item.codeText.toLowerCase()) : undefined);
  let sprite = $derived(item ? itemSprite(item, presentation, presentations, tiers) : null);

  function qualityClass(): string {
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

<article class="trade-listing-card scroll-card">
  <a href={`/trade/${listing.id}`} class="group flex min-w-0 flex-1 gap-4 p-4 sm:p-5">
    <div class="grid h-24 w-20 shrink-0 place-items-center rounded border border-parchment-300/15 bg-black/45 p-2 shadow-inner shadow-black sm:h-28 sm:w-24">
      {#if sprite}<img src={sprite} alt="" class="max-h-full max-w-full object-contain drop-shadow-[0_4px_5px_rgba(0,0,0,0.9)]" />{:else}<span class="display-text text-center text-xs text-parchment-300">{listing.itemCode || 'ITEM'}</span>{/if}
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class={`display-text truncate text-xl transition group-hover:text-ember-400 ${qualityClass()}`}>{listing.itemName}</h2>
          <p class="mt-0.5 truncate text-sm text-parchment-300">{listing.itemType || listing.title}</p>
        </div>
        <span class="shrink-0 text-xs text-parchment-300">{age(listing.createdAtUtc)}</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5 text-[0.68rem] uppercase tracking-wider">
        {#if listing.itemQuality}<span class="trade-tag">{listing.itemQuality}</span>{/if}
        {#if listing.requiredLevel != null}<span class="trade-tag">Req {listing.requiredLevel}</span>{/if}
        {#if listing.socketCount}<span class="trade-tag">{listing.socketCount} sockets</span>{/if}
        {#if listing.isEthereal}<span class="trade-tag !border-sky-400/30 !text-sky-200">Ethereal</span>{/if}
        {#if listing.isCorrupted}<span class="trade-tag !border-red-500/35 !text-red-300">Corrupted</span>{/if}
        {#if listing.isLadder}<span class="trade-tag !border-set/30 !text-set">Ladder</span>{/if}
      </div>
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

<style>
  .trade-listing-card { overflow: hidden; border: 1px solid rgb(188 167 125 / 0.22); border-radius: 0.5rem; background: linear-gradient(145deg, #171514, #111010); transition: border-color 150ms ease, transform 150ms ease; }
  .trade-listing-card:hover { border-color: rgb(228 90 53 / 0.48); transform: translateY(-2px); }
  .trade-tag { border: 1px solid rgb(188 167 125 / 0.22); border-radius: 999px; padding: 0.18rem 0.45rem; color: #bca77d; }
</style>
