<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import CharacterViewer from '$lib/components/CharacterViewer.svelte';
  import TradeStashPicker from '$lib/components/TradeStashPicker.svelte';
  import { getLadders, type Ladder } from '$lib/admin';
  import { authState, initializeAuth } from '$lib/auth';
  import type { CharacterDetailsResponse, SaveItem } from '$lib/characters';
  import { i18n } from '$lib/i18n';
  import { itemVariant, loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemUpgradeTiers, type ItemUpgradeTiers } from '$lib/item-upgrade-tiers';
  import { loadCatalog } from '$lib/catalog-sources';
  import type { CatalogItem } from '$lib/types';
  import {
    createTradeListing,
    getTradeInventory,
    type SharedStash,
    type TradeInventory
  } from '$lib/trades';

  let ladders = $state<Ladder[]>([]);
  let selectedLadderId = $state('');
  let inventory = $state<TradeInventory | null>(null);
  let selectedCharacterId = $state('');
  let selectedStashFile = $state('');
  let selectedStashTab = $state(0);
  let source = $state<'character' | 'stash'>('character');
  let selectedItem = $state<SaveItem | null>(null);
  let selectedCharacter = $state<CharacterDetailsResponse | null>(null);
  let loading = $state(true);
  let inventoryLoading = $state(false);
  let saving = $state(false);
  let error = $state('');
  let presentations = $state(new Map<string, ItemPresentation>());
  let upgradeTiers = $state<ItemUpgradeTiers>(new Map());
  let catalogItems = $state<CatalogItem[]>([]);
  let nameOptions = $state<string[]>([]);

  let itemName = $state('');
  let title = $state('');
  let itemType = $state('');
  let quality = $state('');
  let requiredLevel = $state<number | null>(null);
  let price = $state('');
  let description = $state('');
  let negotiable = $state(true);

  let currentStash = $derived(inventory?.sharedStashes.find((stash) => stash.fileName === selectedStashFile) ?? null);
  let currentStashTab = $derived(currentStash?.tabs[selectedStashTab] ?? null);
  let selectedLadder = $derived(ladders.find((ladder) => ladder.id === selectedLadderId) ?? null);
  let matchingNameOptions = $derived.by(() => {
    const query = itemName.trim().toLowerCase();
    if (query.length < 3) return [];
    if (nameOptions.some((name) => name.toLowerCase() === query)) return [];
    return nameOptions.filter((name) => name.toLowerCase().includes(query));
  });

  function selectedLadderQuery(): string | null {
    return selectedLadderId || null;
  }

  function chooseCharacter(id: string): void {
    selectedCharacterId = id;
    selectedCharacter = inventory?.characters.find((entry) => entry.character.id === id) ?? null;
    selectedItem = null;
  }

  function chooseStash(fileName: string): void {
    selectedStashFile = fileName;
    selectedStashTab = 0;
    selectedItem = null;
  }

  function itemLabel(item: SaveItem): string {
    const presentation = presentations.get(item.codeText.toLowerCase());
    const variant = itemVariant(item, presentation, presentations, upgradeTiers);
    return variant?.NameKey ? $i18n.t(variant.NameKey) : item.personalizedName || item.baseName || item.codeText;
  }

  function chooseItem(item: SaveItem): void {
    selectedItem = structuredClone($state.snapshot(item));
    itemName = itemLabel(item);
    title = `${itemName} for trade`;
    itemType = item.baseName || item.codeText;
    quality = item.runewordId != null ? 'Runeword' : item.quality;
    const catalog = catalogItems.find((entry) => String(entry.Index) === itemName)
      ?? catalogItems.find((entry) => String(entry.Code || '').toLowerCase() === item.codeText.toLowerCase());
    requiredLevel = typeof catalog?.RequiredLevel === 'number' ? catalog.RequiredLevel : null;
    description = '';
    requestAnimationFrame(() => document.getElementById('listing-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  async function loadInventory(): Promise<void> {
    inventoryLoading = true;
    error = '';
    selectedItem = null;
    try {
      inventory = await getTradeInventory(selectedLadderQuery());
      const firstCharacter = inventory.characters[0];
      const firstStash = inventory.sharedStashes[0];
      if (firstCharacter) {
        source = 'character';
        chooseCharacter(firstCharacter.character.id);
      } else if (firstStash) {
        source = 'stash';
        chooseStash(firstStash.fileName);
      } else {
        selectedCharacter = null;
        selectedStashFile = '';
      }
    } catch (value) {
      inventory = null;
      error = value instanceof Error ? value.message : 'Your item inventory could not be loaded.';
    } finally {
      inventoryLoading = false;
    }
  }

  async function publish(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!selectedItem || saving) return;
    saving = true;
    error = '';
    try {
      const listing = await createTradeListing({
        characterId: source === 'character' ? selectedCharacterId : null,
        ladderId: selectedLadderQuery(),
        title: title.trim(),
        itemName: itemName.trim(),
        description: description.trim() || null,
        itemData: JSON.stringify(selectedItem),
        itemCode: selectedItem.codeText,
        itemQuality: quality,
        itemType: itemType.trim() || null,
        requiredLevel,
        itemLevel: selectedItem.itemLevel,
        socketCount: selectedItem.sockets.length,
        isEthereal: selectedItem.flags.names.some((name) => name.toLowerCase() === 'ethereal'),
        isCorrupted: selectedItem.flags.names.some((name) => name.toLowerCase().includes('corrupt'))
          || selectedItem.stats.some((stat) => stat.name.toLowerCase().includes('corrupt')),
        isLadder: Boolean(selectedLadderId),
        price: price.trim() || null,
        isNegotiable: negotiable
      });
      await goto(`/trade/${listing.id}?listed=1`);
    } catch (value) {
      error = value instanceof Error ? value.message : 'The item could not be listed.';
    } finally {
      saving = false;
    }
  }

  onMount(async () => {
    await initializeAuth();
    if (!$authState.user) {
      await goto(`/profile?returnTo=${encodeURIComponent('/trade/list')}`);
      return;
    }
    try {
      const [loadedLadders, loadedPresentations, loadedTiers, uniques, sets] = await Promise.all([
        getLadders(),
        loadItemPresentation(),
        loadItemUpgradeTiers(),
        loadCatalog('uniques'),
        loadCatalog('sets')
      ]);
      ladders = loadedLadders;
      presentations = loadedPresentations;
      upgradeTiers = loadedTiers;
      const setItems = sets.flatMap((set) => set.SetItems ?? []);
      catalogItems = [...uniques, ...setItems];
      nameOptions = [...new Set(catalogItems.map((item) => String(item.Index || '')).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const now = Date.now();
      selectedLadderId = ladders.find((ladder) => new Date(ladder.startDateUtc).getTime() <= now && new Date(ladder.endDateUtc).getTime() > now)?.id ?? '';
      await loadInventory();
    } catch (value) {
      error = value instanceof Error ? value.message : 'The listing page could not be prepared.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>List an Item | Trade | D2R Reimagined</title>
  <meta name="description" content="Choose an item directly from a D2R Reimagined character or shared stash and publish a trade listing." />
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10">
    <a href="/trade" class="text-sm text-parchment-300 hover:text-ember-400">← Back to trade</a>
    <div class="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div><p class="text-xs uppercase tracking-[0.26em] text-ember-400">Create listing</p><h1 class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">List an item</h1><p class="mt-3 max-w-2xl text-parchment-300">Select the exact item from your server-synced character or shared stash. Its properties are filled in for you.</p></div>
      <ol class="flex gap-2 text-xs text-parchment-300" aria-label="Listing steps"><li class="rounded-full border border-ember-400/35 px-3 py-1.5">1 Ladder</li><li class="rounded-full border border-parchment-300/25 px-3 py-1.5">2 Item</li><li class="rounded-full border border-parchment-300/25 px-3 py-1.5">3 Details</li></ol>
    </div>
  </div>
</section>

<div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
  {#if error}<div role="alert" class="mb-6 rounded border border-red-500/35 bg-red-950/35 px-4 py-3 text-red-200">{error}</div>{/if}
  {#if loading}
    <div class="panel rounded-lg p-12 text-center text-parchment-300">Loading ladders and your server inventory…</div>
  {:else}
    <section class="panel rounded-lg p-5 sm:p-6" aria-labelledby="ladder-heading">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p class="text-xs uppercase tracking-[0.2em] text-ember-400">Step 1</p><h2 id="ladder-heading" class="display-text mt-1 text-2xl text-parchment-50">Choose ladder</h2><p class="mt-2 text-sm text-parchment-300">Characters and stash files are isolated by ladder.</p></div>
        <label class="w-full max-w-md text-sm text-parchment-200">Trading realm<select class="field mt-2" bind:value={selectedLadderId} onchange={() => loadInventory()}><option value="">Standard / non-ladder</option>{#each ladders as ladder}<option value={ladder.id}>{ladder.name}</option>{/each}</select></label>
      </div>
    </section>

    <section class="mt-6" aria-labelledby="item-heading">
      <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p class="text-xs uppercase tracking-[0.2em] text-ember-400">Step 2</p><h2 id="item-heading" class="display-text mt-1 text-2xl text-parchment-50">Select the item</h2></div>
        <div class="inline-flex rounded-full border border-parchment-300/25 bg-black/30 p-1">
          <button type="button" disabled={!inventory?.characters.length} class={`rounded-full px-4 py-2 text-sm ${source === 'character' ? 'bg-ember-700/35 text-white' : 'text-parchment-300'} disabled:opacity-35`} onclick={() => { source = 'character'; selectedItem = null; }}>Characters ({inventory?.characters.length ?? 0})</button>
          <button type="button" disabled={!inventory?.sharedStashes.length} class={`rounded-full px-4 py-2 text-sm ${source === 'stash' ? 'bg-ember-700/35 text-white' : 'text-parchment-300'} disabled:opacity-35`} onclick={() => { source = 'stash'; selectedItem = null; }}>Shared stash ({inventory?.sharedStashes.length ?? 0})</button>
        </div>
      </div>

      {#if inventoryLoading}
        <div class="panel rounded-lg p-12 text-center text-parchment-300">Loading {selectedLadder?.name || 'Standard'} inventory…</div>
      {:else if !inventory || (!inventory.characters.length && !inventory.sharedStashes.length)}
        <div class="panel rounded-lg p-10 text-center"><h3 class="display-text text-2xl text-parchment-50">No server-synced items found</h3><p class="mx-auto mt-3 max-w-xl text-parchment-300">Launch this ladder with the server saves plugin, or upload a Standard character from your profile, then return here.</p><a href="/profile" class="trade-secondary-button mt-5 inline-block">Open profile</a></div>
      {:else if source === 'character'}
        <div class="mb-4 flex flex-wrap gap-2">{#each inventory.characters as entry}<button type="button" class={`rounded border px-3 py-2 text-sm ${selectedCharacterId === entry.character.id ? 'border-ember-400/55 bg-ember-700/25 text-white' : 'border-parchment-300/20 text-parchment-300'}`} onclick={() => chooseCharacter(entry.character.id)}>{entry.character.name} · {entry.character.class} {entry.character.level}</button>{/each}</div>
        {#if selectedCharacter}<div class="rounded-lg border border-parchment-300/15 bg-[#101014] p-3 sm:p-6"><CharacterViewer details={selectedCharacter} inventoryOnly selectedItemSeed={selectedItem?.seed} onItemSelect={chooseItem} /></div>{/if}
      {:else}
        <div class="mb-4 flex flex-wrap gap-2">{#each inventory.sharedStashes as stash}<button type="button" class={`rounded border px-3 py-2 text-sm ${selectedStashFile === stash.fileName ? 'border-ember-400/55 bg-ember-700/25 text-white' : 'border-parchment-300/20 text-parchment-300'}`} onclick={() => chooseStash(stash.fileName)}>{stash.fileName}</button>{/each}</div>
        {#if currentStash}
          <div class="mb-5 flex gap-2 overflow-x-auto pb-2">{#each currentStash.tabs as tab}<button type="button" class={`whitespace-nowrap rounded border px-3 py-2 text-sm ${selectedStashTab === tab.index ? 'border-ember-400/55 bg-ember-700/25 text-white' : 'border-parchment-300/20 text-parchment-300'}`} onclick={() => { selectedStashTab = tab.index; selectedItem = null; }}>Tab {tab.index + 1} · {tab.items.length} items</button>{/each}</div>
          {#if currentStashTab}<TradeStashPicker items={currentStashTab.items} selectedItemSeed={selectedItem?.seed} onItemSelect={chooseItem} />{/if}
        {/if}
      {/if}
    </section>

    <section id="listing-details" class="mt-8 scroll-mt-24" aria-labelledby="details-heading">
      <div class="mb-4"><p class="text-xs uppercase tracking-[0.2em] text-ember-400">Step 3</p><h2 id="details-heading" class="display-text mt-1 text-2xl text-parchment-50">Review and publish</h2></div>
      {#if !selectedItem}
        <div class="rounded-lg border border-dashed border-parchment-300/25 px-6 py-12 text-center text-parchment-300">Select an item above to prefill its listing.</div>
      {:else}
        <form class="panel rounded-lg p-5 sm:p-7" onsubmit={publish}>
          <div class="grid gap-5 lg:grid-cols-2">
            <label class="text-sm text-parchment-200">Item name<input list={matchingNameOptions.length ? 'listing-item-names' : undefined} required maxlength="120" class="field mt-2" bind:value={itemName} />{#if matchingNameOptions.length}<datalist id="listing-item-names">{#each matchingNameOptions as name}<option value={name}></option>{/each}</datalist>{/if}</label>
            <label class="text-sm text-parchment-200">Listing title<input required minlength="3" maxlength="120" class="field mt-2" bind:value={title} /></label>
            <label class="text-sm text-parchment-200">Item type<input maxlength="120" class="field mt-2" bind:value={itemType} /></label>
            <label class="text-sm text-parchment-200">Quality<select class="field mt-2" bind:value={quality}><option>Unique</option><option>Set</option><option>Runeword</option><option>Rare</option><option>Crafted</option><option>Magic</option><option>Normal</option></select></label>
            <label class="text-sm text-parchment-200">Item level<input type="number" min="1" max="100" class="field mt-2" bind:value={selectedItem.itemLevel} /></label>
            <label class="text-sm text-parchment-200">Required level<input type="number" min="0" max="100" class="field mt-2" bind:value={requiredLevel} /></label>
            {#if selectedItem.defense != null}<label class="text-sm text-parchment-200">Defense<input type="number" min="0" class="field mt-2" bind:value={selectedItem.defense} /></label>{/if}
            {#if selectedItem.maximumDurability != null}<label class="text-sm text-parchment-200">Maximum durability<input type="number" min="0" class="field mt-2" bind:value={selectedItem.maximumDurability} /></label>{/if}
            {#if selectedItem.quantity != null}<label class="text-sm text-parchment-200">Quantity<input type="number" min="0" class="field mt-2" bind:value={selectedItem.quantity} /></label>{/if}
            <label class="text-sm text-parchment-200 lg:col-span-2">Price / what you want <span class="text-parchment-300">(free text)</span><input maxlength="500" class="field mt-2" placeholder="Examples: 2 Ber, Jah + offer, similar Sorceress gear" bind:value={price} /></label>
            <label class="text-sm text-parchment-200 lg:col-span-2">Notes<textarea rows="3" maxlength="4000" class="field mt-2 resize-y" placeholder="Anything the buyer should know…" bind:value={description}></textarea></label>
          </div>

          {#if selectedItem.stats.length}
            <fieldset class="mt-7 border-t border-parchment-300/15 pt-6"><legend class="display-text text-lg text-parchment-50">Item properties</legend><p class="mt-1 text-xs text-parchment-300">Prefilled from the save. Adjust a roll only when the decoded value needs correction.</p><div class="mt-4 grid gap-3 md:grid-cols-2">{#each selectedItem.stats as stat}<label class="grid grid-cols-[1fr_7rem] items-center gap-3 rounded border border-parchment-300/12 bg-black/20 px-3 py-2 text-sm text-parchment-200"><span>{stat.name}</span><input aria-label={`${stat.name} value`} type="number" class="field !py-1.5 text-right" bind:value={stat.value} /></label>{/each}</div></fieldset>
          {/if}

          <label class="mt-6 flex items-start gap-3 rounded border border-parchment-300/15 bg-black/20 p-4"><input type="checkbox" class="checkbox mt-0.5" bind:checked={negotiable} /><span><strong class="block text-parchment-50">Open to offers</strong><span class="mt-1 block text-sm text-parchment-300">Players can submit an offer without starting a conversation.</span></span></label>
          <div class="mt-7 flex flex-col-reverse gap-3 border-t border-parchment-300/15 pt-6 sm:flex-row sm:justify-end"><a href="/trade" class="trade-secondary-button text-center">Cancel</a><button type="submit" disabled={saving} class="trade-primary-button sm:min-w-40">{saving ? 'Publishing…' : 'Publish listing'}</button></div>
        </form>
      {/if}
    </section>
  {/if}
</div>
