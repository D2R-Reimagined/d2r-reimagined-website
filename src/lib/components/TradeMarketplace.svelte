<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import TradeListingCard from '$lib/components/TradeListingCard.svelte';
    import TradePropertyFilters from '$lib/components/TradePropertyFilters.svelte';
    import {authState, initializeAuth} from '$lib/auth';
    import {openTradeChat} from '$lib/trade-chat';
    import {loadCatalog} from '$lib/catalog-sources';
    import type {CatalogItem} from '$lib/types';
    import {
        createTradeOffer,
        getTradeListings,
        type TradeFilters,
        type TradeListing
    } from '$lib/trades';
    import {
        activeTradePropertyCount,
        createTradePropertyGroup,
        invalidTradePropertyQuery,
        toTradePropertyFilterGroups,
        type TradePropertyGroupDraft
    } from '$lib/trade-property-filters';
    import {
        lastTradeRealmStorageKey,
        tradeLadderPath,
        type TradeMarketplacePageData
    } from '$lib/trade-ladders';

    let {data}: { data: TradeMarketplacePageData } = $props();

    const pageSize = 24;
    // svelte-ignore state_referenced_locally
    const initialListings = data.initialListings;
    let listings = $state<TradeListing[]>(initialListings?.items ?? []);
    let total = $state(initialListings?.total ?? 0);
    let skip = $state(initialListings?.skip ?? 0);
    let loading = $state(!initialListings);
    let filterOpen = $state(false);
    let error = $state('');
    let search = $state('');
    let quality = $state('');
    let itemType = $state('');
    let negotiable = $state(false);
    let minLevel = $state('');
    let maxLevel = $state('');
    let minItemLevel = $state('');
    let minSockets = $state('');
    let maxSockets = $state('');
    let ethereal = $state(false);
    let corrupted = $state(false);
    let propertyGroups = $state<TradePropertyGroupDraft[]>([createTradePropertyGroup()]);
    let nameOptions = $state<string[]>([]);
    let offerListing = $state<TradeListing | null>(null);
    let offerText = $state('');
    let offering = $state(false);
    let notice = $state('');

    let activeFilterCount = $derived(
        [quality, itemType, minLevel, maxLevel, minItemLevel, minSockets, maxSockets].filter(Boolean).length
        + [negotiable, ethereal, corrupted].filter(Boolean).length
        + activeTradePropertyCount(propertyGroups)
    );
    let matchingNameOptions = $derived.by(() => {
        const query = search.trim().toLowerCase();
        if (query.length < 3) return [];
        if (nameOptions.some((name) => name.toLowerCase() === query)) return [];
        return nameOptions.filter((name) => name.toLowerCase().includes(query));
    });
    let page = $derived(Math.floor(skip / pageSize) + 1);
    let pages = $derived(Math.max(1, Math.ceil(total / pageSize)));

    function filters(nextSkip = 0): TradeFilters {
        if (invalidTradePropertyQuery(propertyGroups)) {
            throw new Error('Choose a property from the suggestion list before applying filters.');
        }
        const serializedPropertyGroups = toTradePropertyFilterGroups(propertyGroups);
        return {
            skip: nextSkip,
            count: pageSize,
            search: search.trim() || undefined,
            quality: quality || undefined,
            itemType: itemType.trim() || undefined,
            ladderId: data.realm.kind === 'ladder' ? data.realm.ladder?.id : undefined,
            isLadder: data.realm.kind === 'standard' ? false : undefined,
            isNegotiable: negotiable || undefined,
            isEthereal: ethereal || undefined,
            isCorrupted: corrupted || undefined,
            minimumRequiredLevel: minLevel ? Number(minLevel) : undefined,
            maximumRequiredLevel: maxLevel ? Number(maxLevel) : undefined,
            minimumItemLevel: minItemLevel ? Number(minItemLevel) : undefined,
            minimumSockets: minSockets ? Number(minSockets) : undefined,
            maximumSockets: maxSockets ? Number(maxSockets) : undefined,
            propertyGroups: serializedPropertyGroups.length ? serializedPropertyGroups : undefined
        };
    }

    async function load(nextSkip = 0): Promise<void> {
        loading = true;
        error = '';
        try {
            const response = await getTradeListings(filters(nextSkip));
            listings = response.items;
            total = response.total;
            skip = response.skip;
        } catch (value) {
            listings = [];
            error = value instanceof Error ? value.message : 'Trades could not be loaded.';
        } finally {
            loading = false;
        }
    }

    function clearFilters(): void {
        quality = '';
        itemType = '';
        negotiable = false;
        minLevel = '';
        maxLevel = '';
        minItemLevel = '';
        minSockets = '';
        maxSockets = '';
        ethereal = false;
        corrupted = false;
        propertyGroups = [createTradePropertyGroup()];
        void load(0);
    }

    async function chooseTradeRealm(event: Event): Promise<void> {
        const path = (event.currentTarget as HTMLSelectElement).value;
        try { localStorage.setItem(lastTradeRealmStorageKey, path); } catch { /* storage is optional */ }
        await goto(path);
    }

    function requireAccount(returnTo: string): boolean {
        if ($authState.user) return true;
        void goto(`/profile?returnTo=${encodeURIComponent(returnTo)}`);
        return false;
    }

    function messageSeller(listing: TradeListing): void {
        if (!requireAccount(`/trade/${listing.id}`)) return;
        openTradeChat({listingId: listing.id});
    }

    function makeOffer(listing: TradeListing): void {
        if (!requireAccount(`/trade/${listing.id}`)) return;
        offerListing = listing;
        offerText = listing.price || '';
        notice = '';
    }

    async function submitOffer(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        if (!offerListing || !offerText.trim() || offering) return;
        offering = true;
        error = '';
        try {
            await createTradeOffer(offerListing.id, offerText.trim());
            notice = `Offer sent to ${offerListing.sellerDisplayName}.`;
            offerListing = null;
            offerText = '';
        } catch (value) {
            error = value instanceof Error ? value.message : 'Your offer could not be sent.';
        } finally {
            offering = false;
        }
    }

    onMount(async () => {
        void initializeAuth();
        const [uniques, sets] = await Promise.all([loadCatalog('uniques'), loadCatalog('sets')]);
        const setItems = sets.flatMap((set) => set.SetItems ?? []);
        nameOptions = [...new Set([...uniques, ...setItems]
            .map((item: CatalogItem) => String(item.Index || ''))
            .filter(Boolean))].sort((a, b) => a.localeCompare(b));
        if (!initialListings) await load();
    });
</script>

<svelte:head>
    <title>{data.realm.kind === 'all' ? 'Trade' : `${data.realm.label} Trade`} | D2R Reimagined</title>
    <meta name="description" content="Find, list, offer on, and coordinate D2R Reimagined item trades."/>
    <meta property="og:title" content="Trade | D2R Reimagined"/>
    <meta property="og:description" content="Find, list, offer on, and coordinate D2R Reimagined item trades."/>
</svelte:head>

<section
        class="border-b border-parchment-300/15 bg-[radial-gradient(circle_at_top,_rgba(123,29,24,0.2),_transparent_55%)]">
    <div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <div class="flex flex-wrap items-center gap-3 sm:gap-12 lg:gap-24">
                    <h1 class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">Trade</h1>
                    <label class="mt-2">
                        <span class="sr-only">Trade ladder</span>
                        {#if data.ladders.length}
                            <select aria-label="Trade ladder"
                                    class="min-w-48 rounded border border-parchment-300/25 bg-black/35 px-4 py-3 text-sm text-parchment-100 transition hover:border-ember-400/50 focus:border-ember-400 focus:outline-none sm:min-w-52"
                                    value={data.realm.kind === 'ladder' ? data.realm.path : ''} onchange={chooseTradeRealm}>
                                <option value="" disabled>Select active ladder</option>
                                {#each data.ladders as ladder}<option value={tradeLadderPath(ladder)}>{ladder.name}</option>{/each}
                            </select>
                        {:else}
                            <select aria-label="Trade ladder" disabled
                                    class="min-w-48 cursor-not-allowed rounded border border-parchment-300/15 bg-black/25 px-4 py-3 text-sm text-parchment-300 opacity-80 sm:min-w-52">
                                <option>No active ladders</option>
                            </select>
                        {/if}
                    </label>
                </div>
                <p class="mt-2 text-sm text-parchment-300">{data.realm.label}</p>
            </div>
            <div class="flex flex-wrap gap-3">
                {#if $authState.user}<a href="/trade/mine" class="trade-secondary-button">My trades</a>{/if}
                <a href="/trade/list" class="trade-primary-button">+ List an item</a>
            </div>
        </div>

        <form class="mt-7 flex flex-col gap-3 sm:flex-row"
              onsubmit={(event) => { event.preventDefault(); void load(0); }}>
            <div class="relative min-w-0 flex-1">
                <label for="trade-search" class="sr-only">Search item names and listings</label>
                <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-parchment-300"
                      aria-hidden="true">⌕</span>
                <input id="trade-search" list={matchingNameOptions.length ? 'trade-item-names' : undefined}
                       class="field !py-3 !pl-11" placeholder="Search..."
                       bind:value={search}/>
                {#if matchingNameOptions.length}
                    <datalist id="trade-item-names">
                        {#each matchingNameOptions as name}
                            <option value={name}></option>
                        {/each}
                    </datalist>
                {/if}
            </div>
            <button type="submit" class="trade-primary-button sm:min-w-28">Search</button>
            <button type="button" class="trade-secondary-button flex items-center justify-center gap-2"
                    aria-expanded={filterOpen} onclick={() => filterOpen = !filterOpen}>
                Filters
                {#if activeFilterCount}<span
                        class="rounded-full bg-ember-500 px-2 text-xs text-white">{activeFilterCount}</span>{/if}<span
                    aria-hidden="true">{filterOpen ? '▴' : '▾'}</span>
            </button>
        </form>

        {#if filterOpen}
            <form class="mt-3 rounded-lg border border-parchment-300/20 bg-black/35"
                  onsubmit={(event) => { event.preventDefault(); void load(0); }}>
                <div class="grid lg:grid-cols-[minmax(20rem,0.78fr)_minmax(28rem,1.22fr)]">
                    <section class="border-b border-parchment-300/15 p-4 sm:p-5 lg:border-b-0 lg:border-r" aria-labelledby="item-filter-heading">
                        <h3 id="item-filter-heading" class="display-text mt-1 text-xl text-parchment-50">Item filters</h3>
                        <p class="mt-1 text-xs leading-5 text-parchment-300">Narrow the item itself and its core requirements.</p>

                        <div class="mt-4 grid gap-4 sm:grid-cols-2">
                            <label class="trade-filter-label">Quality<select class="field mt-1.5" bind:value={quality}>
                                <option value="">Any quality</option>
                                <option>Unique</option><option>Set</option><option>Runeword</option><option>Rare</option><option>Crafted</option><option>Magic</option><option>Normal</option>
                            </select></label>
                            <label class="trade-filter-label">Item type<input class="field mt-1.5" placeholder="Sword, charm, armor…" bind:value={itemType}/></label>
                            <div class="trade-filter-label">Realm
                                <div class="mt-1.5 flex min-h-11 items-center rounded border border-parchment-300/15 bg-black/20 px-3 text-sm text-parchment-200">{data.realm.label}</div>
                            </div>
                            <label class="trade-filter-label">Minimum required level<input type="number" min="0" max="100" class="field mt-1.5" placeholder="0" bind:value={minLevel}/></label>
                            <label class="trade-filter-label">Maximum required level<input type="number" min="0" max="100" class="field mt-1.5" placeholder="100" bind:value={maxLevel}/></label>
                            <label class="trade-filter-label">Minimum item level<input type="number" min="0" max="100" class="field mt-1.5" placeholder="Any" bind:value={minItemLevel}/></label>
                            <label class="trade-filter-label">Minimum sockets<input type="number" min="0" max="12" class="field mt-1.5" placeholder="Any" bind:value={minSockets}/></label>
                            <label class="trade-filter-label">Maximum sockets<input type="number" min="0" max="12" class="field mt-1.5" placeholder="Any" bind:value={maxSockets}/></label>
                        </div>

                        <div class="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <label class="flex items-center gap-3 rounded border border-parchment-300/15 px-3 py-3 text-sm text-parchment-200"><input type="checkbox" class="checkbox" bind:checked={ethereal}/> Ethereal</label>
                            <label class="flex items-center gap-3 rounded border border-parchment-300/15 px-3 py-3 text-sm text-parchment-200"><input type="checkbox" class="checkbox" bind:checked={corrupted}/> Corrupted</label>
                            <label class="flex items-center gap-3 rounded border border-parchment-300/15 px-3 py-3 text-sm text-parchment-200"><input type="checkbox" class="checkbox" bind:checked={negotiable}/> Negotiable</label>
                        </div>
                    </section>

                    <div class="p-4 sm:p-5">
                        <TradePropertyFilters bind:groups={propertyGroups}/>
                    </div>
                </div>

                <div class="flex flex-col-reverse gap-3 border-t border-parchment-300/15 bg-black/20 p-4 sm:flex-row sm:justify-end">
                    <button type="button" class="trade-secondary-button" onclick={clearFilters}>Clear all</button>
                    <button type="submit" class="trade-primary-button sm:min-w-40">Apply filters</button>
                </div>
            </form>
        {/if}
    </div>
</section>

<section class="mx-auto max-w-screen-2xl px-4 py-7 sm:px-6 sm:py-9">
    {#if notice}
        <div role="status"
             class="mb-5 rounded border border-set/30 bg-green-950/25 px-4 py-3 text-green-200">{notice}</div>
    {/if}
    {#if error}
        <div role="alert"
             class="mb-5 rounded border border-red-500/35 bg-red-950/35 px-4 py-3 text-red-200">{error}</div>
    {/if}
    <div class="flex flex-wrap items-end justify-between gap-3 border-b border-parchment-300/15 pb-4">
        <div>
            <h2 class="display-text mt-1 text-2xl text-parchment-50">Listings</h2>
        </div>
        <p class="text-sm text-parchment-300">{loading ? 'Updating…' : `${total} active ${total === 1 ? 'listing' : 'listings'}`}</p>
    </div>

    {#if loading && listings.length === 0}
        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {#each Array(6) as _}
                <div class="panel h-56 animate-pulse rounded-lg"></div>
            {/each}
        </div>
    {:else if listings.length === 0}
        <div class="panel mt-6 rounded-lg px-6 py-16 text-center"><h2 class="display-text text-2xl text-parchment-50">No
            matching items</h2>
            <p class="mt-2 text-parchment-300">Try clearing a filter, or be the first to list one.</p><a
                    href="/trade/list" class="trade-primary-button mt-5 inline-block">List an item</a></div>
    {:else}
        <div class:opacity-55={loading} class="mt-6 grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3"
             aria-busy={loading}>
            {#each listings as listing (listing.id)}
                <TradeListingCard {listing} onoffer={makeOffer} onmessage={messageSeller}/>
            {/each}
        </div>
    {/if}

    {#if pages > 1}
        <nav class="mt-8 flex items-center justify-center gap-4" aria-label="Trade listing pages">
            <button type="button" class="trade-secondary-button" disabled={loading || skip === 0}
                    onclick={() => load(Math.max(0, skip - pageSize))}>Previous
            </button>
            <span class="text-sm text-parchment-300">Page <span
                    class="text-parchment-50">{page}</span> of {pages}</span>
            <button type="button" class="trade-secondary-button" disabled={loading || skip + pageSize >= total}
                    onclick={() => load(skip + pageSize)}>Next
            </button>
        </nav>
    {/if}
</section>

{#if offerListing}
    <div class="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4" role="presentation"
         onclick={(event) => { if (event.target === event.currentTarget) offerListing = null; }}>
        <form class="panel w-full max-w-lg rounded-lg p-6 shadow-2xl" onsubmit={submitOffer}>
            <p class="text-xs uppercase tracking-[0.2em] text-ember-400">Offer on</p>
            <h2 class="display-text mt-2 text-2xl text-parchment-50">{offerListing.itemName}</h2>
            <p class="mt-2 text-sm text-parchment-300">Seller is looking for: <span
                    class="text-parchment-50">{offerListing.price || 'Offers'}</span></p>
            <label for="offer-text" class="mt-5 block text-sm text-parchment-200">Your offer</label>
            <textarea id="offer-text" required maxlength="500" rows="4" class="field mt-2 resize-y"
                      placeholder="Example: 2 Ber + 1 Jah" bind:value={offerText}></textarea>
            <p class="mt-2 text-xs text-parchment-300">The seller can accept this directly. Chat only opens when you
                choose to message or the offer is accepted.</p>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="trade-secondary-button" onclick={() => offerListing = null}>Cancel</button>
                <button type="submit" disabled={offering || !offerText.trim()}
                        class="trade-primary-button">{offering ? 'Sending…' : 'Send offer'}</button>
            </div>
        </form>
    </div>
{/if}
