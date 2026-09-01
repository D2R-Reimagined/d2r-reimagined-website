<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import TradeItemDetails from '$lib/components/TradeItemDetails.svelte';
  import { authState, initializeAuth } from '$lib/auth';
  import { openTradeChat } from '$lib/trade-chat';
  import type { SaveItem } from '$lib/characters';
  import {
    acceptTradeOffer,
    createTradeOffer,
    declineTradeOffer,
    getTradeListing,
    getTradeOffers,
    updateTradeListing,
    withdrawTradeOffer,
    type TradeListing,
    type TradeListingStatus,
    type TradeOffer
  } from '$lib/trades';

  let listing = $state<TradeListing | null>(null);
  let offers = $state<TradeOffer[]>([]);
  let loading = $state(true);
  let working = $state(false);
  let error = $state('');
  let notice = $state('');
  let offerText = $state('');
  let item = $derived.by(() => {
    if (!listing?.itemData) return null;
    try { return JSON.parse(listing.itemData) as SaveItem; } catch { return null; }
  });
  let isSeller = $derived(Boolean(listing && $authState.user?.id === listing.sellerId));
  let myOffers = $derived(offers.filter((offer) => offer.buyerId === $authState.user?.id));

  function formatDate(value: string): string {
    return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  async function load(): Promise<void> {
    const id = page.params.id;
    if (!id) return;
    listing = await getTradeListing(id);
    if ($authState.user) offers = await getTradeOffers(id);
  }

  function requireAccount(): boolean {
    if ($authState.user) return true;
    void goto(`/profile?returnTo=${encodeURIComponent(page.url.pathname)}`);
    return false;
  }

  function messageSeller(): void {
    if (!listing || !requireAccount()) return;
    openTradeChat({ listingId: listing.id });
  }

  async function submitOffer(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!listing || !offerText.trim() || working || !requireAccount()) return;
    working = true;
    error = '';
    try {
      const offer = await createTradeOffer(listing.id, offerText.trim());
      offers = [offer, ...offers];
      offerText = '';
      notice = 'Your offer was sent. The seller can accept it without a chat message.';
    } catch (value) {
      error = value instanceof Error ? value.message : 'The offer could not be sent.';
    } finally { working = false; }
  }

  async function answerOffer(offer: TradeOffer, accept: boolean): Promise<void> {
    if (working) return;
    working = true;
    error = '';
    try {
      const updated = accept ? await acceptTradeOffer(offer.id) : await declineTradeOffer(offer.id);
      offers = offers.map((entry) => entry.id === updated.id ? updated : (accept && entry.status === 'Pending' ? { ...entry, status: 'Declined' } : entry));
      if (accept) {
        await load();
        notice = `Offer accepted from ${offer.buyerDisplayName}. The item is now pending.`;
        openTradeChat({ conversationId: updated.conversationId });
      }
    } catch (value) { error = value instanceof Error ? value.message : 'The offer could not be updated.'; }
    finally { working = false; }
  }

  async function withdraw(offer: TradeOffer): Promise<void> {
    working = true;
    try {
      const updated = await withdrawTradeOffer(offer.id);
      offers = offers.map((entry) => entry.id === updated.id ? updated : entry);
    } catch (value) { error = value instanceof Error ? value.message : 'The offer could not be withdrawn.'; }
    finally { working = false; }
  }

  async function setStatus(status: TradeListingStatus): Promise<void> {
    if (!listing || working) return;
    working = true;
    try {
      listing = await updateTradeListing(listing.id, { status });
      notice = status === 'Completed' ? 'Trade marked complete.' : status === 'Cancelled' ? 'Listing cancelled.' : 'Listing is active again.';
    } catch (value) { error = value instanceof Error ? value.message : 'The listing could not be updated.'; }
    finally { working = false; }
  }

  onMount(async () => {
    try {
      await initializeAuth();
      await load();
      if (page.url.searchParams.get('listed') === '1') notice = 'Your item is live in the marketplace.';
    } catch (value) { error = value instanceof Error ? value.message : 'This listing could not be loaded.'; }
    finally { loading = false; }
  });
</script>

<svelte:head>
  <title>{listing ? `${listing.itemName} | Trade | D2R Reimagined` : 'Trade Listing | D2R Reimagined'}</title>
  <meta name="description" content={listing?.description || (listing ? `${listing.itemName} listed by ${listing.sellerDisplayName}.` : 'View a D2R Reimagined trade listing.')} />
</svelte:head>

<div class="mx-auto min-h-[75vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
  <a href="/trade" class="text-sm text-parchment-300 hover:text-ember-400">← Back to all trades</a>
  {#if loading}
    <div class="panel mt-6 rounded-lg p-12 text-center text-parchment-300">Loading trade…</div>
  {:else if !listing}
    <div class="panel mt-6 rounded-lg p-12 text-center"><h1 class="display-text text-3xl text-parchment-50">Listing unavailable</h1><p class="mt-3 text-red-200">{error || 'This listing could not be found.'}</p></div>
  {:else}
    {#if notice}<div role="status" class="mt-5 rounded border border-set/30 bg-green-950/25 px-4 py-3 text-green-200">{notice}</div>{/if}
    {#if error}<div role="alert" class="mt-5 rounded border border-red-500/35 bg-red-950/35 px-4 py-3 text-red-200">{error}</div>{/if}
    <div class="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <main>
        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-parchment-300/15 pb-5">
          <div><p class="text-xs uppercase tracking-[0.22em] text-ember-400">{listing.itemQuality || 'Item'} listing</p><h1 class="display-text mt-2 text-3xl text-parchment-50 sm:text-4xl">{listing.itemName}</h1><p class="mt-2 text-parchment-300">{listing.title}</p></div>
          <span class={`rounded border px-3 py-1.5 text-xs uppercase tracking-wider ${listing.status === 'Active' ? 'border-set/30 text-set' : listing.status === 'Reserved' ? 'border-amber-400/30 text-amber-200' : 'border-parchment-300/25 text-parchment-300'}`}>{listing.status === 'Reserved' ? 'Pending trade' : listing.status}</span>
        </div>
        <div class="panel mt-6 rounded-lg p-5 sm:p-7">{#if item}<TradeItemDetails {item} />{:else}<div class="py-12 text-center text-parchment-300">Detailed item data is unavailable for this listing.</div>{/if}</div>
        {#if listing.description}<section class="mt-6 panel rounded-lg p-5"><h2 class="display-text text-xl text-parchment-50">Seller notes</h2><p class="mt-3 whitespace-pre-wrap leading-7 text-parchment-200">{listing.description}</p></section>{/if}

        {#if isSeller}
          <section class="mt-6 panel rounded-lg p-5 sm:p-6"><div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-ember-400">Seller controls</p><h2 class="display-text mt-1 text-2xl text-parchment-50">Offers ({offers.length})</h2></div><a href="/trade/mine" class="text-sm text-parchment-300 hover:text-white">All my listings →</a></div>
            {#if offers.length === 0}<div class="mt-5 rounded border border-dashed border-parchment-300/20 py-8 text-center text-parchment-300">No offers yet.</div>{:else}<div class="mt-5 space-y-3">{#each offers as offer}<article class="rounded border border-parchment-300/15 bg-black/25 p-4"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div class="flex items-center gap-2"><strong class="text-parchment-50">{offer.buyerDisplayName}</strong><span class={`rounded px-2 py-0.5 text-xs ${offer.status === 'Pending' ? 'bg-amber-950/45 text-amber-200' : offer.status === 'Accepted' ? 'bg-green-950/45 text-set' : 'bg-black/35 text-parchment-300'}`}>{offer.status}</span></div><p class="mt-2 text-lg text-parchment-100">{offer.offerText}</p><p class="mt-1 text-xs text-parchment-300">{formatDate(offer.createdAtUtc)}</p></div>{#if offer.status === 'Pending'}<div class="flex gap-2"><button type="button" disabled={working} class="trade-secondary-button" onclick={() => answerOffer(offer, false)}>Decline</button><button type="button" disabled={working} class="trade-primary-button" onclick={() => answerOffer(offer, true)}>Accept & chat</button></div>{:else if offer.status === 'Accepted'}<button type="button" class="trade-secondary-button" onclick={() => openTradeChat({ conversationId: offer.conversationId })}>Open chat</button>{/if}</div></article>{/each}</div>{/if}
          </section>
        {/if}
      </main>

      <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section class="panel rounded-lg p-5"><p class="text-xs uppercase tracking-[0.2em] text-parchment-300">Seller wants</p><p class="display-text mt-2 text-xl text-parchment-50">{listing.price || 'Offers'}</p>{#if listing.isNegotiable}<p class="mt-2 text-xs text-set">Open to negotiation</p>{/if}<dl class="mt-5 space-y-3 border-t border-parchment-300/15 pt-4 text-sm"><div class="flex justify-between gap-3"><dt class="text-parchment-300">Seller</dt><dd class="text-parchment-50">{listing.sellerDisplayName}</dd></div><div class="flex justify-between gap-3"><dt class="text-parchment-300">Realm</dt><dd class="text-right text-parchment-50">{listing.ladderName || 'Standard'}</dd></div>{#if listing.characterName}<div class="flex justify-between gap-3"><dt class="text-parchment-300">Character</dt><dd class="text-parchment-50">{listing.characterName}</dd></div>{/if}<div class="flex justify-between gap-3"><dt class="text-parchment-300">Listed</dt><dd class="text-right text-parchment-50">{formatDate(listing.createdAtUtc)}</dd></div></dl></section>

        {#if isSeller}
          <section class="panel rounded-lg p-5"><h2 class="display-text text-lg text-parchment-50">Listing status</h2><div class="mt-4 grid gap-2">{#if listing.status === 'Active'}<button type="button" disabled={working} class="trade-secondary-button" onclick={() => setStatus('Cancelled')}>Cancel listing</button>{:else if listing.status === 'Reserved'}<button type="button" disabled={working} class="trade-primary-button" onclick={() => setStatus('Completed')}>Mark trade complete</button><button type="button" disabled={working} class="trade-secondary-button" onclick={() => setStatus('Active')}>Return to active</button>{:else}<button type="button" disabled={working} class="trade-primary-button" onclick={() => setStatus('Active')}>Relist item</button>{/if}</div></section>
        {:else if listing.status === 'Active'}
          <section class="panel rounded-lg p-5"><button type="button" class="trade-primary-button w-full" onclick={messageSeller}>Message seller</button><div class="my-4 flex items-center gap-3 text-xs text-parchment-300"><span class="h-px flex-1 bg-parchment-300/15"></span>or offer directly<span class="h-px flex-1 bg-parchment-300/15"></span></div><form onsubmit={submitOffer}><label for="detail-offer" class="text-sm text-parchment-200">Your offer</label><textarea id="detail-offer" required maxlength="500" rows="3" class="field mt-2 resize-y" placeholder="2 Ber + Jah" bind:value={offerText}></textarea><button type="submit" disabled={working || !offerText.trim()} class="trade-secondary-button mt-3 w-full">Send offer</button></form>{#if myOffers.length}<div class="mt-5 border-t border-parchment-300/15 pt-4"><p class="text-xs uppercase tracking-wider text-parchment-300">Your offers</p>{#each myOffers as offer}<div class="mt-2 flex items-center justify-between gap-2 text-sm"><span class="truncate text-parchment-50">{offer.offerText}</span><span class="text-xs text-parchment-300">{offer.status}</span>{#if offer.status === 'Pending'}<button type="button" class="text-xs text-red-300 hover:text-red-200" onclick={() => withdraw(offer)}>Withdraw</button>{/if}</div>{/each}</div>{/if}</section>
        {:else if listing.status === 'Reserved' && listing.buyerId === $authState.user?.id}
          {@const accepted = myOffers.find((offer) => offer.status === 'Accepted')}
          <section class="rounded-lg border border-amber-400/25 bg-amber-950/20 p-5"><h2 class="display-text text-lg text-amber-100">Your offer was accepted</h2><p class="mt-2 text-sm leading-6 text-parchment-300">This item is reserved for you. Coordinate the in-game meetup with the seller.</p>{#if accepted}<button type="button" class="trade-primary-button mt-4 w-full" onclick={() => openTradeChat({ conversationId: accepted.conversationId })}>Open trade chat</button>{/if}</section>
        {/if}
      </aside>
    </div>
  {/if}
</div>
