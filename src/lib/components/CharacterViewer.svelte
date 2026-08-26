<script lang="ts">
  import CharacterItem from '$lib/components/CharacterItem.svelte';
  import SkillTreeView from '$lib/components/skills/SkillTreeView.svelte';
  import { characterSkillRanks } from '$lib/character-skill-ranks';
  import type { CharacterDetailsResponse, SaveItem } from '$lib/characters';
  import { loadItemPresentation, type ItemPresentation } from '$lib/item-presentation';
  import { loadItemStatPresentation, type ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import { loadCatalog } from '$lib/catalog-sources';
  import { buildRunewordNameMap, runewordNameKey } from '$lib/runeword-presentation';
  import { loadRareNamePresentation, type RareNamePresentation } from '$lib/rare-name-presentation';
  import { loadSkillClasses } from '$lib/skills';
  import type { SkillClass } from '$lib/types';
  import { onMount } from 'svelte';

  let { details }: { details: CharacterDetailsResponse } = $props();
  let presentations = $state(new Map<string, ItemPresentation>());
  let statPresentation = $state<ItemStatPresentationBundle>();
  let runewordNames = $state(new Map<string, string>());
  let rareNames = $state<RareNamePresentation>();
  let skillClasses = $state<SkillClass[]>([]);
  let artworkError = $state('');
  let tab = $state<'player' | 'mercenary'>('player');
  let weaponSwap = $state(false);

  const slotRects: Record<string, [number, number, number, number]> = {
    RightArm: [97, 149, 219, 407],
    LeftArm: [849, 149, 219, 407],
    Head: [470, 100, 219, 215],
    Neck: [708, 267, 121, 121],
    Torso: [470, 341, 219, 319],
    Gloves: [97, 584, 219, 219],
    RightRing: [334, 683, 121, 121],
    Belt: [470, 683, 219, 121],
    LeftRing: [708, 683, 121, 121],
    Feet: [849, 584, 219, 219]
  };
  const weaponSetRects = [
    [97, 100, 219, 49],
    [849, 100, 219, 49]
  ] as const;
  const goldRect = [407, 1658, 348, 62] as const;
  const canvasWidth = 1162;
  const canvasHeight = 1799;
  const inventoryLeft = 91;
  const inventoryTop = 817;
  const inventoryCellWidth = 98;
  const inventoryCellHeight = 98;
  const inventoryColumns = 10;
  const inventoryRows = 8;

  let save = $derived(details.save);
  let sourceItems = $derived(
    tab === 'mercenary' ? save?.mercenaryItems?.entries ?? [] : save?.items.entries ?? []
  );
  let equipped = $derived(sourceItems.filter((item) => item.position.mode === 'Equipped'));
  let inventory = $derived(
    tab === 'player'
      ? sourceItems.filter((item) =>
          item.position.mode === 'Stored'
          && item.position.storePage === 'Inventory'
          && fitsInventory(item)
        )
      : []
  );
  let hasMercenary = $derived(Boolean(save?.character.mercenary.hasMercenary));
  let carriedGold = $derived(
    save?.stats.entries.find((stat) => stat.id === 14 || stat.name.toLowerCase() === 'gold')?.value ?? 0
  );
  let skillClass = $derived(
    skillClasses.find((entry) => entry.Class.toLowerCase() === details.character.class.toLowerCase())
  );
  let skillRanks = $derived(
    Object.fromEntries((save?.skills.entries ?? []).map((skill) => [skill.id, skill.points]))
  );
  let displayedSkillRanks = $derived(
    save && skillClass
      ? characterSkillRanks(save, skillClass, skillClasses).effective
      : skillRanks
  );
  let allocatedSkillPoints = $derived(
    Object.values(skillRanks).reduce((total, points) => total + points, 0)
  );

  function percent(value: number, total: number): string {
    return `${value / total * 100}%`;
  }

  function equippedStyle(item: SaveItem): string | null {
    let location = item.position.bodyLocation;
    const secondary = /secondary|alternate|swap/i.test(location);
    if (secondary !== weaponSwap) {
      if (secondary || /arm/i.test(location)) return null;
    }
    location = location.replace(/Secondary|Alternate|Swap/gi, '');
    const rect = slotRects[location];
    if (!rect) return null;
    const [x, y, width, height] = rect;
    return `left:${percent(x, canvasWidth)};top:${percent(y, canvasHeight)};width:${percent(width, canvasWidth)};height:${percent(height, canvasHeight)}`;
  }

  function inventoryStyle(item: SaveItem, presentation?: ItemPresentation): string {
    const width = presentation?.Width ?? 1;
    const height = presentation?.Height ?? 1;
    const x = inventoryLeft + item.position.inventoryX * inventoryCellWidth;
    const y = inventoryTop + item.position.inventoryY * inventoryCellHeight;
    return `left:${percent(x, canvasWidth)};top:${percent(y, canvasHeight)};width:${percent(width * inventoryCellWidth, canvasWidth)};height:${percent(height * inventoryCellHeight, canvasHeight)}`;
  }

  function fitsInventory(item: SaveItem): boolean {
    const itemPresentation = presentation(item);
    const width = itemPresentation?.Width ?? 1;
    const height = itemPresentation?.Height ?? 1;
    return item.position.inventoryX >= 0
      && item.position.inventoryY >= 0
      && item.position.inventoryX + width <= inventoryColumns
      && item.position.inventoryY + height <= inventoryRows;
  }

  function tooltipSide(item: SaveItem, itemPresentation?: ItemPresentation): 'left' | 'right' {
    if (item.position.mode === 'Equipped') {
      const location = item.position.bodyLocation.replace(/Secondary|Alternate|Swap/gi, '');
      const rect = slotRects[location];
      return rect && rect[0] + rect[2] / 2 > canvasWidth / 2 ? 'left' : 'right';
    }
    const width = itemPresentation?.Width ?? 1;
    return item.position.inventoryX + width / 2 > 5 ? 'left' : 'right';
  }

  function presentation(item: SaveItem): ItemPresentation | undefined {
    return presentations.get(item.codeText.toLowerCase());
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat().format(value);
  }

  onMount(async () => {
    try {
      const [loadedPresentations, loadedStatPresentation, loadedSkillClasses, runewords, loadedRareNames] = await Promise.all([
        loadItemPresentation(),
        loadItemStatPresentation(),
        loadSkillClasses(),
        loadCatalog('runewords'),
        loadRareNamePresentation()
      ]);
      presentations = loadedPresentations;
      statPresentation = loadedStatPresentation;
      skillClasses = loadedSkillClasses;
      runewordNames = buildRunewordNameMap(runewords);
      rareNames = loadedRareNames;
    } catch (value) {
      artworkError = value instanceof Error ? value.message : 'Item artwork could not be loaded.';
    }
  });
</script>

{#if !save}
  <div class="panel rounded-lg p-8 text-center">
    <h2 class="display-text text-2xl text-parchment-50">Upload this character again</h2>
    <p class="mx-auto mt-3 max-w-xl text-parchment-300">
      This character predates full save snapshots. Update it from the profile page to unlock its equipment, inventory, skills, quests, and other save details.
    </p>
  </div>
{:else}
  <section aria-labelledby="equipment-heading">
    <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.24em] text-ember-400">{details.character.ownerDisplayName}'s character</p>
        <h1 class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">{details.character.name}</h1>
        <p class="mt-2 text-parchment-300">
          {details.character.class} · level {details.character.level} · {formatNumber(details.character.experience)} experience
        </p>
      </div>
      <div class="flex flex-wrap gap-2 text-xs">
        {#if details.character.isHardcore}<span class="rounded border border-red-500/40 bg-red-950/40 px-3 py-1 text-red-200">Hardcore</span>{/if}
        <span class="rounded border border-parchment-300/25 bg-black/25 px-3 py-1 text-parchment-200">Save v{save.file.version}</span>
        <span class="rounded border border-set/30 bg-green-950/25 px-3 py-1 text-green-200">Checksum verified</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="inline-flex rounded-full border border-parchment-300/35 bg-black/30 p-1">
        <button type="button" class={`rounded-full px-5 py-2 text-sm transition ${tab === 'player' ? 'bg-slate-700 text-white' : 'text-parchment-300 hover:text-white'}`} onclick={() => tab = 'player'}>Player</button>
        <button type="button" disabled={!hasMercenary} class={`rounded-full px-5 py-2 text-sm transition ${tab === 'mercenary' ? 'bg-slate-700 text-white' : 'text-parchment-300 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-40`} onclick={() => tab = 'mercenary'}>Mercenary</button>
      </div>
    </div>

    {#if artworkError}<p role="alert" class="mt-4 text-sm text-red-300">{artworkError}</p>{/if}

    <div class="mx-auto mt-5 max-w-[780px] 2xl:max-w-[585px]">
      <h2 id="equipment-heading" class="sr-only">Equipment and inventory</h2>
      <div class="relative aspect-[1162/1799] w-full bg-black bg-[url('/data/sprites/ui/inventory.webp')] bg-contain bg-no-repeat shadow-2xl shadow-black/70">
        {#if tab === 'player'}
          {#each weaponSetRects as [left, top, width, height]}
            <div
              class="absolute z-20 grid grid-cols-2 overflow-hidden text-[clamp(0.55rem,1.4vw,0.9rem)] font-semibold text-parchment-300"
              style={`left:${percent(left, canvasWidth)};top:${percent(top, canvasHeight)};width:${percent(width, canvasWidth)};height:${percent(height, canvasHeight)};`}
              role="group"
              aria-label="Weapon set"
            >
              <button
                type="button"
                aria-label="Equip weapon set I"
                aria-pressed={!weaponSwap}
                class={`relative border-r border-parchment-300/20 transition hover:bg-white/5 hover:text-parchment-50 ${!weaponSwap ? 'bg-sky-950/35 text-parchment-50' : ''}`}
                onclick={() => weaponSwap = false}
              >
                I
                {#if !weaponSwap}<span class="absolute bottom-[8%] left-1/2 h-[clamp(0.18rem,0.45vw,0.3rem)] w-[clamp(0.18rem,0.45vw,0.3rem)] -translate-x-1/2 rotate-45 bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.95)]"></span>{/if}
              </button>
              <button
                type="button"
                aria-label="Equip weapon set II"
                aria-pressed={weaponSwap}
                class={`relative transition hover:bg-white/5 hover:text-parchment-50 ${weaponSwap ? 'bg-sky-950/35 text-parchment-50' : ''}`}
                onclick={() => weaponSwap = true}
              >
                II
                {#if weaponSwap}<span class="absolute bottom-[8%] left-1/2 h-[clamp(0.18rem,0.45vw,0.3rem)] w-[clamp(0.18rem,0.45vw,0.3rem)] -translate-x-1/2 rotate-45 bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.95)]"></span>{/if}
              </button>
            </div>
          {/each}
        {/if}
        <div
          class="pointer-events-none absolute z-20 flex items-center justify-center text-[clamp(0.6rem,1.5vw,0.95rem)] font-semibold tabular-nums text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
          style={`left:${percent(goldRect[0], canvasWidth)};top:${percent(goldRect[1], canvasHeight)};width:${percent(goldRect[2], canvasWidth)};height:${percent(goldRect[3], canvasHeight)};`}
        >
          <span class="sr-only">Gold: </span>{formatNumber(carriedGold)}
        </div>
        {#each equipped as item}
          {@const style = equippedStyle(item)}
          {@const itemPresentation = presentation(item)}
          {#if style}<CharacterItem {item} presentation={itemPresentation} itemPresentations={presentations} {statPresentation} {rareNames} characterLevel={details.character.level} runewordNameKey={runewordNameKey(item, runewordNames)} {style} tooltipSide={tooltipSide(item, itemPresentation)} />{/if}
        {/each}
        {#each inventory as item}
          {@const itemPresentation = presentation(item)}
          <CharacterItem {item} presentation={itemPresentation} itemPresentations={presentations} {statPresentation} {rareNames} characterLevel={details.character.level} runewordNameKey={runewordNameKey(item, runewordNames)} style={inventoryStyle(item, itemPresentation)} tooltipSide={tooltipSide(item, itemPresentation)} />
        {/each}
      </div>
    </div>

    <p class="mt-5 text-center text-sm text-parchment-300">
      Hover, focus, or tap an item to inspect every decoded property stored in the save.
    </p>
  </section>

  {#if skillClass}
    <section class="mt-14 border-t border-parchment-300/15 pt-10" aria-labelledby="skills-heading">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.24em] text-ember-400">Saved allocation</p>
          <h2 id="skills-heading" class="display-text mt-2 text-3xl text-parchment-50 sm:text-4xl">Skills</h2>
        </div>
        <p class="text-sm text-parchment-300"><span class="text-parchment-50">{allocatedSkillPoints}</span> hard points allocated</p>
      </div>
      <SkillTreeView {skillClass} ranks={displayedSkillRanks} baseRanks={skillRanks} readonly />
    </section>
  {/if}
{/if}
