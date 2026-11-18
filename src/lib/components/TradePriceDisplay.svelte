<script lang="ts">
  import {
    getTradeCurrency,
    parseOfferCurrencyChips,
    type TradePriceCombine,
    type TradePriceItem
  } from '#lib/trade-pricing.js';

  interface Props {
    price?: string | null;
    priceItems?: readonly TradePriceItem[] | null;
    priceCombine?: TradePriceCombine;
    priceNote?: string | null;
    offerText?: string | null;
    compact?: boolean;
  }

  let {
    price = null,
    priceItems = null,
    priceCombine = 'Or',
    priceNote = null,
    offerText = null,
    compact = false
  }: Props = $props();

  let parsedOffer = $derived(offerText ? parseOfferCurrencyChips(offerText) : null);
  let effectiveItems = $derived(parsedOffer ? parsedOffer.items : (priceItems ?? []));
  let effectiveCombine = $derived<TradePriceCombine>(parsedOffer ? 'And' : priceCombine);
  let effectiveNote = $derived(parsedOffer ? parsedOffer.note : priceNote?.trim() || null);
  let connector = $derived(effectiveCombine === 'And' ? '+' : 'or');
  let showOffersBadge = $derived(
    !offerText && effectiveItems.length === 0 && !effectiveNote && !price?.trim()
  );
</script>

{#if effectiveItems.length > 0}
  <span class={`inline-flex max-w-full flex-wrap items-center gap-1 ${compact ? 'text-xs' : 'text-sm'}`}>
    {#each effectiveItems as entry, index (`${entry.currencyCode}-${index}`)}
      {@const currency = getTradeCurrency(entry.currencyCode)}
      {#if index > 0}
        <span class="px-0.5 text-[0.7rem] font-medium text-parchment-300">{connector}</span>
      {/if}
      <span
        class="inline-flex items-center gap-1 rounded border border-parchment-300/25 bg-black/45 px-1.5 py-0.5 text-parchment-50"
        title={currency ? `${entry.quantity}x ${currency.name}` : `${entry.quantity}x ${entry.currencyCode}`}
      >
        {#if currency}
          <img src={currency.sprite} alt="" class={compact ? 'h-3.5 w-3.5 shrink-0 object-contain' : 'h-4 w-4 shrink-0 object-contain'} loading="lazy" />
        {/if}
        <span class="font-medium text-ember-200">{entry.quantity > 1 ? `${entry.quantity} ` : ''}{currency?.shortLabel ?? entry.currencyCode}</span>
      </span>
    {/each}
    {#if effectiveNote}
      <span class="break-words text-xs text-parchment-300">({effectiveNote})</span>
    {/if}
  </span>
{:else if offerText}
  <span class={`break-words ${compact ? 'text-xs text-parchment-200' : 'text-sm text-parchment-200'}`}>{offerText}</span>
{:else if effectiveNote}
  <span class="inline-flex max-w-full flex-wrap items-center gap-1.5 text-xs text-parchment-200">
    <span class="rounded border border-parchment-300/20 bg-white/5 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-parchment-300">Offers</span>
    <span class="break-words">{effectiveNote}</span>
  </span>
{:else if price?.trim()}
  <span class={`break-words ${compact ? 'text-xs text-parchment-100' : 'text-sm text-parchment-100'}`}>{price}</span>
{:else if showOffersBadge}
  <span class="inline-flex items-center rounded border border-parchment-300/20 bg-white/5 px-1.5 py-0.5 text-xs text-parchment-300">Offers</span>
{/if}
