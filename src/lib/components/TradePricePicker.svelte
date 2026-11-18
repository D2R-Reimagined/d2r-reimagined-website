<script lang="ts">
  import TradePriceDisplay from '#lib/components/TradePriceDisplay.svelte';
  import {
    MAX_PRICE_ITEMS,
    MAX_PRICE_NOTE_LENGTH,
    MAX_PRICE_QUANTITY,
    MIN_PRICE_QUANTITY,
    QUICK_PICK_CURRENCIES,
    formatOfferText,
    getTradeCurrency,
    searchTradeCurrencies,
    type TradePriceCombine,
    type TradePriceItem
  } from '#lib/trade-pricing.js';

  interface Props {
    variant?: 'listing' | 'offer';
    items?: TradePriceItem[];
    combine?: TradePriceCombine;
    note?: string;
    initialMode?: 'buyout' | 'offers';
    legacyPrice?: string | null;
    onclearlegacy?: () => void;
    value?: string;
  }

  let {
    variant = 'listing',
    items = $bindable<TradePriceItem[]>([]),
    combine = $bindable<TradePriceCombine>('Or'),
    note = $bindable(''),
    initialMode,
    legacyPrice = null,
    onclearlegacy,
    value = $bindable('')
  }: Props = $props();

  let mode = $state<'buyout' | 'offers'>(
    // svelte-ignore state_referenced_locally
    initialMode ?? (variant === 'listing' ? 'buyout' : 'buyout')
  );
  let search = $state('');
  let dropdownOpen = $state(false);
  let blurTimer: number | null = null;
  let offerItems = $state<TradePriceItem[]>([]);
  let offerNote = $state('');

  function openDropdown(): void {
    if (blurTimer !== null) {
      window.clearTimeout(blurTimer);
      blurTimer = null;
    }
    dropdownOpen = true;
  }

  function scheduleCloseDropdown(): void {
    if (blurTimer !== null) window.clearTimeout(blurTimer);
    blurTimer = window.setTimeout(() => {
      dropdownOpen = false;
      blurTimer = null;
    }, 160);
  }

  function handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!atLimit && searchResults.length > 0) {
        addCurrency(searchResults[0].code);
      }
    } else if (event.key === 'Escape' && dropdownOpen) {
      event.stopPropagation();
      dropdownOpen = false;
    }
  }

  let activeItems = $derived(variant === 'offer' ? offerItems : items);
  let selectedCodes = $derived(new Set(activeItems.map((entry) => entry.currencyCode.toLowerCase())));
  let searchResults = $derived(searchTradeCurrencies(search).slice(0, 14));
  let atLimit = $derived(activeItems.length >= MAX_PRICE_ITEMS);
  let holdingLegacyBuyout = $derived(
    variant === 'listing' && mode === 'buyout' && items.length === 0 && Boolean(legacyPrice?.trim())
  );

  function syncOfferValue(): void {
    if (variant !== 'offer') return;
    value = formatOfferText(offerItems, offerNote);
  }

  // Keep offer widget state cleared whenever the host resets bound value to empty.
  $effect(() => {
    if (variant === 'offer' && value === '' && (offerItems.length > 0 || offerNote !== '')) {
      offerItems = [];
      offerNote = '';
    }
  });

  function setItems(next: TradePriceItem[]): void {
    if (variant === 'offer') {
      offerItems = next;
      syncOfferValue();
    } else {
      items = next;
    }
  }

  function addCurrency(code: string): void {
    if (variant === 'listing' && mode === 'offers') mode = 'buyout';
    const current = variant === 'offer' ? offerItems : items;
    const normalized = code.toLowerCase();
    const existing = current.find((entry) => entry.currencyCode.toLowerCase() === normalized);
    if (existing) {
      updateQuantity(normalized, Math.min(MAX_PRICE_QUANTITY, existing.quantity + 1));
    } else if (current.length < MAX_PRICE_ITEMS) {
      setItems([...current, { currencyCode: normalized, quantity: 1 }]);
    }
    search = '';
    dropdownOpen = false;
  }

  function removeCurrency(code: string): void {
    const normalized = code.toLowerCase();
    const current = variant === 'offer' ? offerItems : items;
    const next = current.filter((entry) => entry.currencyCode.toLowerCase() !== normalized);
    setItems(next);
    if (variant === 'listing') {
      if (next.length < 2) combine = 'Or';
      if (mode === 'buyout' && next.length === 0 && Boolean(legacyPrice?.trim())) {
        note = '';
      }
    }
  }

  function clampQty(qty: number): number {
    if (!Number.isFinite(qty)) return MIN_PRICE_QUANTITY;
    return Math.min(MAX_PRICE_QUANTITY, Math.max(MIN_PRICE_QUANTITY, Math.trunc(qty)));
  }

  function updateQuantity(code: string, nextQty: number): void {
    const normalized = code.toLowerCase();
    const qty = clampQty(nextQty);
    const current = variant === 'offer' ? offerItems : items;
    setItems(
      current.map((entry) =>
        entry.currencyCode.toLowerCase() === normalized ? { ...entry, quantity: qty } : entry
      )
    );
  }

  function switchListingMode(nextMode: 'buyout' | 'offers'): void {
    mode = nextMode;
    if (nextMode === 'offers') {
      if (items.length > 0) {
        items = [];
      }
      combine = 'Or';
      onclearlegacy?.();
    }
  }
</script>

<div class="rounded-lg border border-parchment-300/20 bg-black/25 p-3.5">
  {#if variant === 'listing'}
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="inline-flex rounded border border-parchment-300/20 bg-black/40 p-0.5 text-xs" role="group" aria-label="Pricing mode">
        <button
          type="button"
          aria-pressed={mode === 'buyout'}
          class={`rounded px-3 py-1 transition ${mode === 'buyout' ? 'bg-ember-600/35 text-white' : 'text-parchment-300 hover:text-white'}`}
          onclick={() => switchListingMode('buyout')}
        >
          Set buyout
        </button>
        <button
          type="button"
          aria-pressed={mode === 'offers'}
          class={`rounded px-3 py-1 transition ${mode === 'offers' ? 'bg-ember-600/35 text-white' : 'text-parchment-300 hover:text-white'}`}
          onclick={() => switchListingMode('offers')}
        >
          Offers only
        </button>
      </div>
      <div class="text-xs text-parchment-300">
        Preview: <TradePriceDisplay
          price={holdingLegacyBuyout ? legacyPrice : null}
          priceItems={items}
          priceCombine={combine}
          priceNote={holdingLegacyBuyout ? '' : note}
        />
      </div>
    </div>

    {#if holdingLegacyBuyout}
      <div class="mt-2 flex items-center justify-between gap-2 rounded border border-parchment-300/15 bg-white/[0.03] px-2.5 py-1.5 text-xs text-parchment-300">
        <span>Legacy price text: <span class="text-parchment-100">{legacyPrice}</span> — pick currencies below to convert it, or clear to set Offers only.</span>
        {#if onclearlegacy}
          <button
            type="button"
            class="shrink-0 rounded border border-parchment-300/25 px-2 py-0.5 text-[0.7rem] text-parchment-200 hover:border-ember-400/50 hover:text-white"
            onclick={() => switchListingMode('offers')}
          >
            Clear
          </button>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
      <span class="text-xs uppercase tracking-[0.14em] text-parchment-300">Currency offer builder</span>
      {#if value.trim()}
        <span class="text-xs text-parchment-300">Preview: <TradePriceDisplay offerText={value} compact /></span>
      {/if}
    </div>
  {/if}

  {#if variant === 'offer' || mode === 'buyout'}
    <div class="mt-3">
      <div class="flex flex-wrap gap-1.5">
        {#each QUICK_PICK_CURRENCIES as currency (currency.code)}
          {@const active = selectedCodes.has(currency.code)}
          <button
            type="button"
            disabled={!active && atLimit}
            class={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs transition ${
              active
                ? 'border-ember-400/55 bg-ember-700/25 text-white'
                : 'border-parchment-300/20 bg-black/35 text-parchment-200 hover:border-parchment-300/45 disabled:opacity-40'
            }`}
            title={`Add ${currency.name}`}
            onclick={() => addCurrency(currency.code)}
          >
            <img src={currency.sprite} alt="" class="h-3.5 w-3.5 object-contain" loading="lazy" />
            <span>{currency.shortLabel}</span>
          </button>
        {/each}
      </div>

      <div class="relative mt-2.5">
        <input
          type="text"
          class="field !py-1.5 text-xs"
          placeholder={atLimit ? `Maximum of ${MAX_PRICE_ITEMS} currencies selected` : 'Search all currencies (e.g. ooc, prism, ist, ber, hev, keyset)…'}
          disabled={atLimit}
          bind:value={search}
          onfocus={openDropdown}
          onclick={openDropdown}
          oninput={openDropdown}
          onkeydown={handleSearchKeydown}
          onblur={scheduleCloseDropdown}
          aria-label="Search currency"
        />
        {#if dropdownOpen && !atLimit}
          <div class="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded border border-parchment-300/25 bg-[#171514] shadow-xl">
            {#if searchResults.length === 0}
              <p class="px-3 py-2 text-xs text-parchment-300">No matching currencies.</p>
            {:else}
              {#each searchResults as currency (currency.code)}
                {@const already = selectedCodes.has(currency.code)}
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-2 border-b border-parchment-300/10 px-3 py-2 text-left text-xs text-parchment-100 hover:bg-white/5"
                  onmousedown={(event) => event.preventDefault()}
                  onclick={() => addCurrency(currency.code)}
                  onfocus={openDropdown}
                  onblur={scheduleCloseDropdown}
                >
                  <span class="flex items-center gap-2">
                    <img src={currency.sprite} alt="" class="h-4 w-4 shrink-0 object-contain" loading="lazy" />
                    <span class="font-medium text-parchment-50">{currency.name}</span>
                    <span class="text-parchment-300">({currency.shortLabel})</span>
                  </span>
                  <span class="text-[0.65rem] uppercase tracking-wider text-parchment-300">{already ? '+1' : currency.category}</span>
                </button>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>

    {#if activeItems.length > 0}
      <div class="mt-3 space-y-2">
        {#each activeItems as entry (entry.currencyCode)}
          {@const currency = getTradeCurrency(entry.currencyCode)}
          <div class="flex flex-wrap items-center justify-between gap-2 rounded border border-parchment-300/20 bg-black/35 px-2.5 py-1.5">
            <span class="flex items-center gap-2 text-sm text-parchment-50">
              {#if currency}
                <img src={currency.sprite} alt="" class="h-5 w-5 object-contain" />
              {/if}
              <span>{currency?.name ?? entry.currencyCode}</span>
              {#if currency && currency.shortLabel !== currency.name}
                <span class="text-xs text-parchment-300">({currency.shortLabel})</span>
              {/if}
            </span>
            <span class="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`Decrease ${currency?.name ?? entry.currencyCode} quantity`}
                class="rounded border border-parchment-300/20 px-2 py-0.5 text-xs text-parchment-200 hover:border-parchment-300/45 disabled:opacity-40"
                disabled={entry.quantity <= MIN_PRICE_QUANTITY}
                onclick={() => updateQuantity(entry.currencyCode, entry.quantity - 1)}
              >
                −
              </button>
              <input
                type="number"
                min={MIN_PRICE_QUANTITY}
                max={MAX_PRICE_QUANTITY}
                class="field !w-16 !py-1 text-center text-xs"
                aria-label={`${currency?.name ?? entry.currencyCode} quantity`}
                value={entry.quantity}
                oninput={(event) => {
                  const target = event.currentTarget as HTMLInputElement;
                  if (target.value !== '') updateQuantity(entry.currencyCode, Number(target.value));
                }}
                onblur={(event) => {
                  const target = event.currentTarget as HTMLInputElement;
                  const fixed = clampQty(Number(target.value));
                  updateQuantity(entry.currencyCode, fixed);
                  target.value = String(fixed);
                }}
              />
              <button
                type="button"
                aria-label={`Increase ${currency?.name ?? entry.currencyCode} quantity`}
                class="rounded border border-parchment-300/20 px-2 py-0.5 text-xs text-parchment-200 hover:border-parchment-300/45 disabled:opacity-40"
                disabled={entry.quantity >= MAX_PRICE_QUANTITY}
                onclick={() => updateQuantity(entry.currencyCode, entry.quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                aria-label={`Remove ${currency?.name ?? entry.currencyCode}`}
                class="ml-1 rounded px-1.5 py-0.5 text-xs text-parchment-300 hover:bg-red-950/40 hover:text-red-200"
                onclick={() => removeCurrency(entry.currencyCode)}
              >
                ×
              </button>
            </span>
          </div>
        {/each}
      </div>
    {:else if variant === 'listing'}
      <p class="mt-2.5 text-xs text-parchment-300">Pick up to {MAX_PRICE_ITEMS} currencies above, or switch to 'Offers only'.</p>
    {/if}

    {#if variant === 'listing' && items.length >= 2}
      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span class="text-parchment-300">Buyer must pay:</span>
        <div class="inline-flex rounded border border-parchment-300/20 bg-black/40 p-0.5" role="group" aria-label="Currency combine mode">
          <button
            type="button"
            aria-pressed={combine === 'Or'}
            class={`rounded px-2.5 py-1 transition ${combine === 'Or' ? 'bg-ember-600/35 text-white' : 'text-parchment-300 hover:text-white'}`}
            onclick={() => combine = 'Or'}
          >
            Either (OR)
          </button>
          <button
            type="button"
            aria-pressed={combine === 'And'}
            class={`rounded px-2.5 py-1 transition ${combine === 'And' ? 'bg-ember-600/35 text-white' : 'text-parchment-300 hover:text-white'}`}
            onclick={() => combine = 'And'}
          >
            Bundle (AND +)
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <p class="mt-2.5 text-xs text-parchment-300">Buyers can propose currency combinations or item swaps. Add an optional note below.</p>
  {/if}

  {#if variant === 'listing'}
    <label class="mt-3 block text-xs text-parchment-300">
      Barter note <span class="text-parchment-300/75">(optional, up to {MAX_PRICE_NOTE_LENGTH} characters)</span>
      <input
        type="text"
        maxlength={MAX_PRICE_NOTE_LENGTH}
        disabled={holdingLegacyBuyout}
        class="field mt-1 !py-1.5 text-xs disabled:opacity-50"
        placeholder={
          holdingLegacyBuyout
            ? "Pick currencies above or switch to 'Offers only' before adding a barter note"
            : mode === 'offers'
              ? 'Example: ISO cold skillers, Sorc torch, or currency offer'
              : 'Example: or cold skillers, firm, open to swaps'
        }
        bind:value={note}
      />
    </label>
  {:else}
    <label class="mt-3 block text-xs text-parchment-300">
      Message or extra items <span class="text-parchment-300/75">(optional, or type a pure item offer)</span>
      <input
        type="text"
        maxlength={MAX_PRICE_NOTE_LENGTH}
        class="field mt-1 !py-1.5 text-xs"
        placeholder="Example: can add 30 life cold skiller"
        bind:value={offerNote}
        oninput={syncOfferValue}
      />
    </label>
  {/if}
</div>
