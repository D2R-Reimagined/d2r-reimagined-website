<script lang="ts">
  import { tick } from 'svelte';
  import {
    resolveTradePropertyOption,
    searchTradePropertyOptions,
    type TradePropertyOption
  } from '#lib/trade-property-filters.js';

  let {
    id,
    options,
    loading = false,
    selected = false,
    query = $bindable(''),
    onselect
  }: {
    id: string;
    options: TradePropertyOption[];
    loading?: boolean;
    selected?: boolean;
    query?: string;
    onselect: (option?: TradePropertyOption) => void;
  } = $props();

  let open = $state(false);
  let activeIndex = $state(-1);
  let browsing = $state(false);
  let listbox = $state<HTMLElement>();

  // Reopening a completed field offers every property rather than only the chosen one.
  let results = $derived(searchTradePropertyOptions(options, browsing ? '' : query));
  let listboxId = $derived(`${id}-options`);
  let activeId = $derived(open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined);
  let needsChoice = $derived(!open && !loading && Boolean(query.trim()) && !selected);

  function choose(option: TradePropertyOption): void {
    query = option.label;
    onselect(option);
    open = false;
    activeIndex = -1;
  }

  function handleInput(): void {
    const exact = options.find((option) => option.label.toLowerCase() === query.trim().toLowerCase());
    onselect(exact);
    browsing = false;
    open = true;
    activeIndex = query.trim() ? 0 : -1;
  }

  function handleFocus(event: FocusEvent): void {
    (event.currentTarget as HTMLInputElement).select();
    browsing = selected;
    open = true;
    activeIndex = selected ? results.findIndex((option) => option.label === query) : -1;
    void revealActive();
  }

  function handleBlur(): void {
    open = false;
    activeIndex = -1;
    if (selected) return;
    const option = resolveTradePropertyOption(options, query);
    if (option) choose(option);
  }

  async function revealActive(): Promise<void> {
    await tick();
    listbox?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }

  function move(step: number): void {
    if (!results.length) return;
    open = true;
    activeIndex = (Math.max(activeIndex, step > 0 ? -1 : 0) + step + results.length) % results.length;
    void revealActive();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && open && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex]);
    } else if (event.key === 'Enter' && query.trim() && !selected) {
      // Applying filters here would only report the unfinished property.
      event.preventDefault();
      open = true;
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      open = false;
      activeIndex = -1;
    }
  }
</script>

<div class="relative min-w-0 text-xs text-parchment-300">
  <label for={id}>Property</label>
  <input
    {id}
    class="field mt-1 !py-2"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-activedescendant={activeId}
    aria-invalid={needsChoice}
    placeholder="Search, e.g. faster cast or FCR"
    autocomplete="off"
    spellcheck="false"
    bind:value={query}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
  />
  {#if needsChoice}
    <p class="mt-1 text-red-300">{results.length ? 'Choose a property from the list.' : 'No matching properties.'}</p>
  {/if}
  <div
    bind:this={listbox}
    id={listboxId}
    role="listbox"
    aria-label="Properties"
    hidden={!open}
    class="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded border border-parchment-300/25 bg-[#0d0d0e] py-1 shadow-xl sm:right-auto sm:min-w-[24rem]"
  >
    {#if !open}
      <!-- Closed rows skip the list; each would otherwise hold hundreds of hidden buttons. -->
    {:else if loading}
      <p class="px-3 py-2 text-parchment-300">Loading properties…</p>
    {:else if !results.length}
      <p class="px-3 py-2 text-parchment-300">No matching properties.</p>
    {:else}
      {#each results as option, index (option.id)}
        <button
          type="button"
          id={`${id}-option-${index}`}
          role="option"
          tabindex="-1"
          aria-selected={index === activeIndex}
          class={`block w-full px-3 py-2 text-left text-sm ${index === activeIndex ? 'bg-ember-700/35 text-white' : 'text-parchment-100 hover:bg-white/5'}`}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => choose(option)}
        >{option.label}</button>
      {/each}
    {/if}
  </div>
</div>
