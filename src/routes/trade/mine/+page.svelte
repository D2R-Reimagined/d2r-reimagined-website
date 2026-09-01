<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { authState, initializeAuth } from '$lib/auth';
  import { getMyTradeListings, type TradeListing, type TradeListingStatus } from '$lib/trades';

  let listings = $state<TradeListing[]>([]);
  let status = $state<'All' | TradeListingStatus>('All');
  let loading = $state(true);
  let error = $state('');
  let visible = $derived(status === 'All' ? listings : listings.filter((listing) => listing.status === status));

  function formatDate(value: string): string {
    return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onMount(async () => {
    await initializeAuth();
    if (!$authState.user) {
      await goto(`/profile?returnTo=${encodeURIComponent('/trade/mine')}`);
      return;
    }
    try { listings = await getMyTradeListings(); }
    catch (value) { error = value instanceof Error ? value.message : 'Your listings could not be loaded.'; }
    finally { loading = false; }
  });
</script>

<svelte:head><title>My Trades | D2R Reimagined</title><meta name="robots" content="noindex" /></svelte:head>

<div class="mx-auto min-h-[75vh] max-w-6xl px-4 py-9 sm:px-6 sm:py-12">
  <a href="/trade" class="text-sm text-parchment-300 hover:text-ember-400">← Back to trade</a>
  <div class="mt-5 flex flex-col gap-5 border-b border-parchment-300/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
    <div><p class="text-xs uppercase tracking-[0.22em] text-ember-400">Seller dashboard</p><h1 class="display-text mt-2 text-4xl text-parchment-50">My trades</h1><p class="mt-2 text-parchment-300">Review offers, manage pending meetups, and close completed trades.</p></div>
    <a href="/trade/list" class="trade-primary-button text-center">+ List an item</a>
  </div>

  {#if error}<div role="alert" class="mt-6 rounded border border-red-500/35 bg-red-950/35 px-4 py-3 text-red-200">{error}</div>{/if}
  <div class="mt-6 flex gap-2 overflow-x-auto pb-2">{#each ['All', 'Active', 'Reserved', 'Completed', 'Cancelled'] as option}<button type="button" class={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${status === option ? 'border-ember-400/55 bg-ember-700/25 text-white' : 'border-parchment-300/20 text-parchment-300'}`} onclick={() => status = option as typeof status}>{option === 'Reserved' ? 'Pending' : option}</button>{/each}</div>

  {#if loading}<div class="panel mt-5 rounded-lg p-12 text-center text-parchment-300">Loading your listings…</div>
  {:else if visible.length === 0}<div class="panel mt-5 rounded-lg p-12 text-center"><h2 class="display-text text-2xl text-parchment-50">No {status === 'All' ? '' : status.toLowerCase()} listings</h2><p class="mt-2 text-parchment-300">Your listings will appear here as soon as you publish them.</p></div>
  {:else}<div class="mt-5 space-y-3">{#each visible as listing (listing.id)}<a href={`/trade/${listing.id}`} class="panel flex flex-col gap-4 rounded-lg p-4 transition hover:border-ember-400/45 hover:bg-[#191615] sm:flex-row sm:items-center sm:justify-between sm:p-5"><div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h2 class="display-text truncate text-xl text-parchment-50">{listing.itemName}</h2><span class={`rounded border px-2 py-0.5 text-xs uppercase ${listing.status === 'Active' ? 'border-set/30 text-set' : listing.status === 'Reserved' ? 'border-amber-400/30 text-amber-200' : 'border-parchment-300/25 text-parchment-300'}`}>{listing.status === 'Reserved' ? 'Pending' : listing.status}</span></div><p class="mt-1 truncate text-sm text-parchment-300">{listing.price || 'Offers'} · {listing.ladderName || 'Standard'} · listed {formatDate(listing.createdAtUtc)}</p></div><div class="flex shrink-0 items-center gap-5"><div class="text-right"><span class="display-text block text-2xl text-parchment-50">{listing.offerCount}</span><span class="text-xs uppercase tracking-wider text-parchment-300">offers</span></div><span class="text-ember-400">Manage →</span></div></a>{/each}</div>{/if}
</div>
