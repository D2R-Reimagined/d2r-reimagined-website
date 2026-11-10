<script lang="ts">
  import M from '#lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import type { Catalog } from '#lib/loot-filter/types.js';
  import ColorInput from '../loot-filter/ColorInput.svelte';
  import SoundPicker from '../loot-filter/SoundPicker.svelte';
  import {
    BASE_SLOT_FILTERS,
    CATEGORIES,
    EQUIPMENT_FAMILIES,
    TIERABLE_ITEMS,
    TIER_RANKS,
    EDITABLE_RARITY_STYLES,
    effectiveItemTier,
    effectiveRarityTierStyle,
    effectiveTierStyle,
    findParentGroupForBase,
    getGroupDisplayInfo,
    isFamilyExplicitlyHidden,
    isItemOverridden,
    modesMatchGroupMode,
    reconcileGroupSplits,
    resolveTierableItemBases,
    syncDisabledFamiliesFromOverrides,
    type CategoryId,
    type CustomBaseRule,
    type ItemRarityStyleKind,
    type ResolvedBaseEntry,
    type TierRank,
    type TierStyle,
    type TierableItem,
    type V2Config
  } from '#lib/loot-filter/v2-compiler.js';

  let {
    config = $bindable(),
    activeCategory = $bindable<CategoryId>('runes'),
    searchQuery = $bindable(''),
    catalog,
    onchange
  }: {
    config: V2Config;
    activeCategory: CategoryId;
    searchQuery?: string;
    catalog: Catalog;
    onchange: () => void;
  } = $props();

  let draggedItemId = $state<string | null>(null);
  let draggedCustomBaseId = $state<string | null>(null);
  let dragOverTier = $state<TierRank | null>(null);
  let editingStyleTier = $state<Exclude<TierRank, 'HIDE'> | null>(null);
  let editingRarityKind = $state<ItemRarityStyleKind>('unique');
  let expandedItemIds = $state<Record<string, boolean>>({});

  // Visual 523-Base Browser Matrix state
  let showBaseBrowser = $state(false);
  let browserSlotId = $state<string>('all');
  let browserQualityTier = $state<'all' | 'elite' | 'exceptional' | 'normal'>('elite');
  let baseSearch = $state('');
  let newBaseMode = $state<CustomBaseRule['mode']>('runeword');
  let newBaseMinSockets = $state(0);
  let newBaseEthOnly = $state(false);

  // Sync default rarity mode & inline rarity style target when switching between categories
  $effect(() => {
    if (activeCategory === 'bases') {
      newBaseMode = 'runeword';
      editingRarityKind = 'base';
    } else if (activeCategory === 'uniques') {
      if (newBaseMode !== 'unique' && newBaseMode !== 'set') newBaseMode = 'unique';
      if (!['unique', 'set', 'rare', 'crafted', 'magic'].includes(editingRarityKind)) editingRarityKind = 'unique';
    } else if (activeCategory === 'equipment') {
      if (
        newBaseMode !== 'rare' &&
        newBaseMode !== 'magic' &&
        newBaseMode !== 'crafted' &&
        newBaseMode !== 'any'
      ) {
        newBaseMode = 'rare';
      }
      if (!['rare', 'crafted', 'magic'].includes(editingRarityKind)) editingRarityKind = 'rare';
    }
  });

  const categoryInfo = $derived(CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]);
  const isEquipmentCategory = $derived(
    activeCategory === 'bases' || activeCategory === 'equipment' || activeCategory === 'uniques'
  );

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLocaleLowerCase();
    if (q) {
      return TIERABLE_ITEMS.filter(
        item =>
          item.label.toLocaleLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLocaleLowerCase().includes(q)) ||
          (item.codes && item.codes.some(c => c.toLocaleLowerCase().includes(q))) ||
          resolveTierableItemBases(item, catalog).some(
            b =>
              b.label.toLocaleLowerCase().includes(q) ||
              b.code.toLocaleLowerCase().includes(q) ||
              (b.notableNames && b.notableNames.toLocaleLowerCase().includes(q))
          )
      );
    }
    return TIERABLE_ITEMS.filter(item => item.category === activeCategory);
  });

  const itemsByTier = $derived.by(() => {
    const map = new Map<TierRank, TierableItem[]>();
    for (const r of TIER_RANKS) map.set(r.id, []);
    for (const item of filteredItems) {
      const t = effectiveItemTier(item, config);
      map.get(t)?.push(item);
    }
    return map;
  });

  function customBaseBelongsToCategory(cb: CustomBaseRule, cat: CategoryId): boolean {
    const parentGroup = findParentGroupForBase(cb.code, cb.mode, catalog, cb.parentItemId);
    if (parentGroup) return parentGroup.category === cat;
    if (cat === 'bases') return cb.mode === 'runeword';
    if (cat === 'uniques') return cb.mode === 'unique' || cb.mode === 'set' || cb.mode === 'unique-set';
    if (cat === 'equipment') {
      return (
        cb.mode === 'rare' ||
        cb.mode === 'rare-crafted' ||
        cb.mode === 'magic' ||
        cb.mode === 'crafted' ||
        cb.mode === 'any'
      );
    }
    return false;
  }

  const categoryCustomBases = $derived(
    config.customBases.filter(cb => customBaseBelongsToCategory(cb, activeCategory))
  );

  const customBasesByTier = $derived.by(() => {
    const map = new Map<TierRank, CustomBaseRule[]>();
    for (const r of TIER_RANKS) map.set(r.id, []);
    const q = searchQuery.trim().toLocaleLowerCase();
    for (const cb of config.customBases) {
      if (q) {
        if (!`${cb.label} ${cb.code} ${cb.mode}`.toLocaleLowerCase().includes(q)) continue;
      } else if (!customBaseBelongsToCategory(cb, activeCategory)) {
        continue;
      }
      map.get(cb.tier)?.push(cb);
    }
    return map;
  });

  const activeSlotFilter = $derived(
    BASE_SLOT_FILTERS.find(s => s.id === browserSlotId) ?? BASE_SLOT_FILTERS[0]
  );

  const browserMatchingBases = $derived.by(() => {
    const q = baseSearch.trim().toLocaleLowerCase();
    const slotTypes = activeSlotFilter.typeCodes;

    return catalog.baseItems
      .filter(b => {
        if (!b.code) return false;
        const isQuiverSlot =
          slotTypes.includes('bowq') || slotTypes.includes('xboq');
        if (b.kind !== 'weapon' && b.kind !== 'armor' && !isQuiverSlot) return false;

        if (!q && slotTypes.length > 0) {
          const matchesType =
            (b.type && slotTypes.includes(b.type)) ||
            slotTypes.some(t => catalog.itemTypeMap.get(t)?.has(b.code!));
          if (!matchesType) return false;
        } else if (!q && b.kind !== 'weapon' && b.kind !== 'armor') {
          return false;
        }

        if (!q && browserQualityTier !== 'all' && b.tier && b.tier !== browserQualityTier) {
          return false;
        }

        if (q) {
          const uNames = catalog.uniqueItems
            .filter(u => u.baseCode === b.code)
            .map(u => u.name)
            .join(' ');
          const sNames = catalog.setItems
            .filter(s => s.baseCode === b.code)
            .map(s => s.name)
            .join(' ');
          const haystack = `${b.displayName ?? ''} ${b.name} ${b.code} ${uNames} ${sNames}`.toLocaleLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .slice(0, 90);
  });

  function getCustomBaseRule(
    code: string,
    mode: CustomBaseRule['mode'],
    parentItemId?: string
  ): CustomBaseRule | undefined {
    return config.customBases.find(
      cb =>
        cb.code === code &&
        (cb.mode === mode ||
          (parentItemId && cb.parentItemId === parentItemId) ||
          modesMatchGroupMode(cb.mode, mode))
    );
  }

  function getInheritedBaseTier(code: string, mode: CustomBaseRule['mode']): TierRank | undefined {
    const parentGroup = findParentGroupForBase(code, mode, catalog);
    if (parentGroup) {
      return effectiveItemTier(parentGroup, config);
    }
    const baseInfo = catalog.baseItems.find(b => b.code === code);
    if (mode === 'unique' || mode === 'set') {
      const qTier = baseInfo?.tier ?? 'normal';
      const fallbackId =
        mode === 'unique'
          ? qTier === 'elite'
            ? 'uniq-elite'
            : qTier === 'exceptional'
              ? 'uniq-exceptional'
              : 'uniq-normal'
          : qTier === 'elite'
            ? 'set-elite'
            : qTier === 'exceptional'
              ? 'set-exceptional'
              : 'set-normal';
      const fallbackItem = TIERABLE_ITEMS.find(i => i.id === fallbackId);
      if (fallbackItem) return effectiveItemTier(fallbackItem, config);
    }
    if (mode === 'runeword') {
      for (const item of TIERABLE_ITEMS) {
        if (item.category !== 'bases' || !item.equipmentFamilies?.length) continue;
        const familyTypes = EQUIPMENT_FAMILIES.filter(f => item.equipmentFamilies!.includes(f.id)).flatMap(
          f => f.itemTypes
        );
        if (familyTypes.some(t => catalog.itemTypeMap.get(t)?.has(code))) {
          if (isFamilyExplicitlyHidden(item, config)) return 'HIDE';
        }
      }
    }
    return undefined;
  }

  const hasActiveBuildCuration = $derived(
    Boolean(
      config.buildProfile?.selectedClass ||
        config.buildProfile?.archetype ||
        (config.buildProfile?.disabledFamilies?.length ?? 0) > 0
    )
  );

  const buildAffectedCategories = $derived.by(() => {
    const targetCats: { id: CategoryId; label: string; icon: string }[] = [
      { id: 'bases', label: 'Runeword & Crafting Bases', icon: '⚔' },
      { id: 'equipment', label: 'Rares, Crafted & Magic Gear', icon: '🛡' },
      { id: 'misc', label: 'Quivers & Misc', icon: '⚗' }
    ];
    return targetCats.map(cat => {
      const items = TIERABLE_ITEMS.filter(i => i.category === cat.id);
      let shown = 0;
      let hidden = 0;
      for (const item of items) {
        if (effectiveItemTier(item, config) === 'HIDE') hidden++;
        else shown++;
      }
      return { ...cat, shown, hidden };
    });
  });

  function notableNamesForBase(code: string): string {
    const uNames = newBaseMode !== 'set' ? catalog.uniqueItems.filter(u => u.baseCode === code).map(u => u.name) : [];
    const sNames = newBaseMode !== 'unique' ? catalog.setItems.filter(s => s.baseCode === code).map(s => s.name) : [];
    const all = [...new Set([...uNames, ...sNames])];
    if (all.length === 0) return '';
    return all.slice(0, 2).join(', ') + (all.length > 2 ? ` +${all.length - 2}` : '');
  }

  function setIndividualBaseTier(
    code: string,
    label: string,
    mode: CustomBaseRule['mode'],
    targetTier: TierRank,
    parentDefaultTier?: TierRank,
    parentItemId?: string
  ) {
    const parentGroup = findParentGroupForBase(code, mode, catalog, parentItemId);
    const effectiveParentTier =
      parentDefaultTier ?? (parentGroup ? effectiveItemTier(parentGroup, config) : undefined);
    const existing = getCustomBaseRule(code, mode, parentItemId ?? parentGroup?.id);

    const hasCustomSocketOrEth =
      !parentItemId && mode === 'runeword' && (newBaseMinSockets > 0 || newBaseEthOnly);

    if (effectiveParentTier && targetTier === effectiveParentTier && !hasCustomSocketOrEth) {
      if (existing) {
        config.customBases = config.customBases.filter(cb => cb.id !== existing.id);
        reconcileGroupSplits(config, catalog);
        onchange();
      }
      return;
    }

    if (existing) {
      if (existing.tier === targetTier && !parentDefaultTier) {
        // Clicking the active tier button again in the browser toggles the override off
        config.customBases = config.customBases.filter(cb => cb.id !== existing.id);
      } else {
        // Move to front so reconcileGroupSplits knows this was the most recently moved base
        const updated: CustomBaseRule = {
          ...existing,
          tier: targetTier,
          parentItemId: existing.parentItemId ?? parentItemId ?? parentGroup?.id
        };
        config.customBases = [
          updated,
          ...config.customBases.filter(cb => cb.id !== existing.id)
        ];
      }
    } else {
      config.customBases = [
        {
          id: `base-${code}-${mode}`,
          code,
          label,
          tier: targetTier,
          mode,
          minSockets: !parentItemId && mode === 'runeword' && newBaseMinSockets > 0 ? newBaseMinSockets : undefined,
          etherealOnly: !parentItemId && mode === 'runeword' && newBaseEthOnly ? true : undefined,
          parentItemId: parentItemId ?? parentGroup?.id
        },
        ...config.customBases
      ];
    }
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function toggleExpandItem(itemId: string) {
    expandedItemIds = {
      ...expandedItemIds,
      [itemId]: !expandedItemIds[itemId]
    };
  }

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }

  function styleObjToCss(style: TierStyle) {
    const text = cssColor(style.textColor, '#f7f1e3');
    const bg = cssColor(style.backgroundColor, 'rgba(14, 14, 18, 0.88)');
    const border = style.borderColor
      ? `2px solid ${cssColor(style.borderColor, 'transparent')}`
      : '1px solid rgba(188, 167, 125, 0.25)';
    return `color:${text};background:${bg};border:${border}`;
  }

  function tierPreviewStyle(tier: Exclude<TierRank, 'HIDE'>) {
    return styleObjToCss(effectiveTierStyle(tier, config, activeCategory));
  }

  const categoryRarityTargets = $derived.by((): ItemRarityStyleKind[] => {
    if (activeCategory === 'uniques') return ['unique', 'set', 'rare', 'crafted', 'magic'];
    if (activeCategory === 'equipment') return ['rare', 'crafted', 'magic'];
    if (activeCategory === 'bases') return ['base'];
    return [];
  });

  function updateRarityTierStyle(
    rarity: ItemRarityStyleKind,
    tier: Exclude<TierRank, 'HIDE'>,
    patch: Partial<TierStyle>
  ) {
    const currentRarity = config.rarityTierStyleOverrides?.[rarity] ?? {};
    const currentTier = currentRarity[tier] ?? {};
    const merged: Partial<TierStyle> = { ...currentTier, ...patch };
    for (const k of Object.keys(merged) as (keyof TierStyle)[]) {
      if (merged[k] === undefined) delete merged[k];
    }
    config.rarityTierStyleOverrides = {
      ...(config.rarityTierStyleOverrides ?? {}),
      [rarity]: {
        ...currentRarity,
        [tier]: merged
      }
    };
    onchange();
  }

  function resetRarityTierStyle(rarity: ItemRarityStyleKind, tier: Exclude<TierRank, 'HIDE'>) {
    const currentRarity = { ...(config.rarityTierStyleOverrides?.[rarity] ?? {}) };
    delete currentRarity[tier];
    const nextAll = { ...(config.rarityTierStyleOverrides ?? {}) };
    if (Object.keys(currentRarity).length === 0) {
      delete nextAll[rarity];
    } else {
      nextAll[rarity] = currentRarity;
    }
    config.rarityTierStyleOverrides = nextAll;
    if (rarity === 'base' && config.categoryTierStyleOverrides.bases?.[tier]) {
      const currentBases = { ...config.categoryTierStyleOverrides.bases };
      delete currentBases[tier];
      const nextCats = { ...config.categoryTierStyleOverrides };
      if (Object.keys(currentBases).length === 0) delete nextCats.bases;
      else nextCats.bases = currentBases;
      config.categoryTierStyleOverrides = nextCats;
    }
    onchange();
  }

  function moveItemToTier(item: TierableItem, targetTier: TierRank) {
    const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
    if (targetTier === defaultForStrictness) {
      delete config.itemOverrides[item.id];
    } else {
      config.itemOverrides[item.id] = targetTier;
    }
    if (item.equipmentFamilies?.length) {
      syncDisabledFamiliesFromOverrides(config);
    }
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function resetItem(item: TierableItem) {
    delete config.itemOverrides[item.id];
    const childBases = resolveTierableItemBases(item, catalog);
    if (childBases.length > 1) {
      const childCodes = new Set(childBases.map(b => b.code));
      config.customBases = config.customBases.filter(
        cb => cb.parentItemId !== item.id && !childCodes.has(cb.code)
      );
    }
    if (item.equipmentFamilies?.length) {
      syncDisabledFamiliesFromOverrides(config);
    }
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function resetCategoryItems() {
    const next = { ...config.itemOverrides };
    for (const item of TIERABLE_ITEMS) {
      if (item.category === activeCategory) delete next[item.id];
    }
    config.itemOverrides = next;
    config.customBases = config.customBases.filter(cb => !customBaseBelongsToCategory(cb, activeCategory));
    syncDisabledFamiliesFromOverrides(config);
    onchange();
  }

  function updateCategoryTierStyle(
    tier: Exclude<TierRank, 'HIDE'>,
    patch: Partial<TierStyle>
  ) {
    const currentCat = config.categoryTierStyleOverrides[activeCategory] ?? {};
    const currentTier = currentCat[tier] ?? {};
    const merged: Partial<TierStyle> = { ...currentTier, ...patch };
    for (const k of Object.keys(merged) as (keyof TierStyle)[]) {
      if (merged[k] === undefined) delete merged[k];
    }
    config.categoryTierStyleOverrides = {
      ...config.categoryTierStyleOverrides,
      [activeCategory]: {
        ...currentCat,
        [tier]: merged
      }
    };
    onchange();
  }

  function resetCategoryTierStyle(tier: Exclude<TierRank, 'HIDE'>) {
    const currentCat = { ...(config.categoryTierStyleOverrides[activeCategory] ?? {}) };
    delete currentCat[tier];
    const nextCats = { ...config.categoryTierStyleOverrides };
    if (Object.keys(currentCat).length === 0) {
      delete nextCats[activeCategory];
    } else {
      nextCats[activeCategory] = currentCat;
    }
    config.categoryTierStyleOverrides = nextCats;
    onchange();
  }

  function removeCustomBase(id: string) {
    config.customBases = config.customBases.filter(cb => cb.id !== id);
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function updateCustomBaseTier(id: string, tier: TierRank) {
    const target = config.customBases.find(cb => cb.id === id);
    if (!target) return;
    config.customBases = [
      { ...target, tier },
      ...config.customBases.filter(cb => cb.id !== id)
    ];
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function updateCustomBasePatch(id: string, patch: Partial<CustomBaseRule>) {
    config.customBases = config.customBases.map(cb => (cb.id === id ? { ...cb, ...patch } : cb));
    reconcileGroupSplits(config, catalog);
    onchange();
  }

  function handleDrop(event: DragEvent, targetTier: TierRank) {
    event.preventDefault();
    dragOverTier = null;
    if (draggedCustomBaseId) {
      updateCustomBaseTier(draggedCustomBaseId, targetTier);
      draggedCustomBaseId = null;
      return;
    }
    if (!draggedItemId) return;
    const item = TIERABLE_ITEMS.find(x => x.id === draggedItemId);
    draggedItemId = null;
    if (item) moveItemToTier(item, targetTier);
  }
</script>

{#snippet minimapShape(shape: string)}
  {#if shape === 'circle'}<circle cx="20" cy="20" r="17" />{:else if shape === 'square'}<rect x="4" y="4" width="32" height="32" />{:else if shape === 'triangle'}<polygon points="20,3 37,36 3,36" />{:else if shape === 'triangleDown'}<polygon points="20,37 3,4 37,4" />{:else if shape === 'star'}<polygon points="20,2 25,14 38,15 28,24 31,38 20,31 9,38 12,24 2,15 15,14" />{:else if shape === 'spark'}<polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" />{:else if shape === 'kite'}<polygon points="20,3 34,15 20,37 6,15" />{:else if shape === 'hexagon'}<polygon points="37,20 28.5,35 11.5,35 3,20 11.5,5 28.5,5" />{:else if shape === 'cross'}<polygon points="14,3 26,3 26,14 37,14 37,26 26,26 26,37 14,37 14,26 3,26 3,14 14,14" />{:else if shape === 'chevron'}<polygon points="20,3 37,24.2 31,32.8 20,18.3 9,32.8 3,24.2" />{:else if shape === 'bullseye'}<circle cx="20" cy="20" r="17" fill="none" /><circle cx="20" cy="20" r="7.65" stroke="none" />{:else}<polygon points="20,2 38,20 20,38 2,20" />{/if}
{/snippet}

<div class="space-y-5">
  <!-- Category Header -->
  <div class="panel flex flex-wrap items-center justify-between gap-4 rounded-lg p-4 sm:p-5">
    <div>
      <div class="flex items-center gap-2.5">
        <span class="text-2xl text-ember-400" aria-hidden="true">{categoryInfo.icon}</span>
        <h2 class="text-2xl font-bold tracking-tight text-parchment-50">
          {searchQuery.trim() ? `Search Results: “${searchQuery.trim()}”` : categoryInfo.name}
        </h2>
      </div>
      <p class="mt-1 text-sm text-parchment-300">
        {searchQuery.trim()
          ? `Showing ${filteredItems.length} matching item groups across all categories. Drag pills, click S / A / B / C / D / ✕ to re-tier, or expand any multi-base group to tier individual bases.`
          : `${categoryInfo.subtitle}. Drag any item pill into a tier row, click Expand on any multi-base group to split out individual bases, or open the 523-Base Browser.`}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class={showBaseBrowser || isEquipmentCategory ? 'trade-primary-button !py-1.5 text-xs' : 'trade-secondary-button !py-1.5 text-xs'}
        aria-expanded={showBaseBrowser}
        onclick={() => (showBaseBrowser = !showBaseBrowser)}
      >
        {showBaseBrowser ? 'Hide 523-Base Browser' : 'Browse & Tier All 523 Item Bases'}
      </button>
      {#if searchQuery.trim()}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={() => (searchQuery = '')}>Clear search</button>
      {:else}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={resetCategoryItems}>
          Reset category to {config.strictness} defaults
        </button>
      {/if}
    </div>
  </div>

  <!-- Active Class / Archetype Curation Bar -->
  {#if hasActiveBuildCuration && !searchQuery.trim()}
    <div class="panel flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ember-400/40 bg-abyss-950/90 px-4 py-3 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded border border-ember-400/50 bg-ember-950/60 px-2 py-0.5 font-bold uppercase tracking-wider text-ember-300">
          {#if config.buildProfile.selectedClass}
            Class: {config.buildProfile.selectedClass}{config.buildProfile.archetype ? ` · ${config.buildProfile.archetype}` : ''}
          {:else if config.buildProfile.archetype}
            Archetype: {config.buildProfile.archetype}
          {:else}
            Custom Weapon/Class Filter
          {/if}
        </span>
        <span class="text-parchment-200">
          Off-build weapon &amp; class groups are placed in <strong>Hide</strong> below; primary build gear is promoted to <strong>Tier A / B</strong>.
        </span>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        {#each buildAffectedCategories as bCat (bCat.id)}
          <button
            type="button"
            class={`rounded border px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeCategory === bCat.id
                ? 'border-ember-400 bg-ember-900/45 text-parchment-50'
                : 'border-parchment-300/20 bg-abyss-900 text-parchment-200 hover:border-ember-400/60'
            }`}
            onclick={() => (activeCategory = bCat.id)}
          >
            {bCat.icon} {bCat.label} ({bCat.shown} shown · {bCat.hidden} hidden)
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Special Runeword Base Options when on 'bases' -->
  {#if activeCategory === 'bases' && !searchQuery.trim()}
    <div class="panel space-y-4 rounded-lg border border-ember-400/30 p-4 sm:p-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class="text-lg font-bold tracking-tight text-parchment-50">Runeword &amp; Base Filtering Rules</h3>
          <p class="text-xs text-parchment-300">Automatic rules applied alongside the curated base tier list below.</p>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="flex items-start gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm">
          <input type="checkbox" class="mt-0.5" bind:checked={config.baseSettings.highlightEthEliteBases} onchange={onchange} />
          <span>
            <strong class="block text-parchment-50">Ethereal Elite Bases (Tier B)</strong>
            <span class="text-xs text-parchment-300">Highlights all ethereal Elite-tier weapons &amp; armor for mercenary and indestructible runewords.</span>
          </span>
        </label>
        <label class="flex items-start gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm">
          <input type="checkbox" class="mt-0.5" bind:checked={config.baseSettings.highlightSupEliteBases} onchange={onchange} />
          <span>
            <strong class="block text-parchment-50">Superior 3+ Socket Elite Bases (Tier B)</strong>
            <span class="text-xs text-parchment-300">Highlights Superior Elite bases with 3 or more sockets.</span>
          </span>
        </label>
        <label class="flex items-start gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm">
          <input type="checkbox" class="mt-0.5" bind:checked={config.baseSettings.show3PlusSocketElite} onchange={onchange} />
          <span>
            <strong class="block text-parchment-50">All 3+ Socket Elite Bases (Tier C)</strong>
            <span class="text-xs text-parchment-300">Keeps any 3+ socket Elite weapon or armor visible even in Strict/Endgame.</span>
          </span>
        </label>
        <label class="flex items-start gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm">
          <input type="checkbox" class="mt-0.5" bind:checked={config.baseSettings.show4PlusSocketExceptional} onchange={onchange} />
          <span>
            <strong class="block text-parchment-50">4+ Socket Exceptional Bases (Tier D)</strong>
            <span class="text-xs text-parchment-300">Useful for Nightmare/Hell progression runewords (Insight, Spirit, Treachery).</span>
          </span>
        </label>
        <div class="flex flex-col justify-between rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm sm:col-span-2">
          <label class="flex items-center gap-2.5">
            <input type="checkbox" bind:checked={config.baseSettings.requireSocketsOnBases} onchange={onchange} />
            <strong class="text-parchment-50">Require minimum sockets on curated bases below</strong>
          </label>
          {#if config.baseSettings.requireSocketsOnBases}
            <div class="mt-2 flex items-center gap-3">
              <span class="text-xs text-parchment-300">Minimum sockets:</span>
              {#each [2, 3, 4, 5, 6] as s}
                <button
                  type="button"
                  class={`rounded border px-2.5 py-1 text-xs ${config.baseSettings.minSocketsOnBases === s ? 'border-ember-400 bg-ember-900/40 text-parchment-50' : 'border-parchment-300/20 text-parchment-300'}`}
                  onclick={() => {
                    config.baseSettings.minSocketsOnBases = s;
                    onchange();
                  }}
                >
                  {s}+ Sockets
                </button>
              {/each}
            </div>
          {:else}
            <p class="mt-1 text-xs text-parchment-300">When unchecked, curated bases (like Monarch or Archon Plate) also show with 0 sockets for Larzuk/Orb of Socketing.</p>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Visual 523-Base Browser Matrix (FilterBlade-style per-slot & per-weapon-type base tiering) -->
  {#if (showBaseBrowser || isEquipmentCategory) && !searchQuery.trim()}
    <div class="panel space-y-4 rounded-lg border border-ember-400/35 p-4 sm:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <h3 class="text-lg font-bold tracking-tight text-parchment-50">
              Tier Specific Weapon &amp; Armor Bases (523 Reimagined Bases)
            </h3>
            <span class="rounded bg-ember-500/20 px-2 py-0.5 text-xs font-semibold text-ember-300">
              {config.customBases.length} individual base{config.customBases.length === 1 ? '' : 's'} customized
            </span>
          </div>
          <p class="mt-0.5 text-xs text-parchment-300">
            Browse by equipment slot or weapon family below, or search any base by name/code, then click <strong>S / A / B / C / D / ✕</strong> to place that exact base into a tier row.
          </p>
        </div>
        <button
          type="button"
          class="trade-secondary-button !px-3 !py-1.5 text-xs"
          onclick={() => (showBaseBrowser = !showBaseBrowser)}
        >
          {showBaseBrowser ? 'Collapse Slot Matrix' : 'Expand Full Slot & Weapon Matrix'}
        </button>
      </div>

      <!-- Controls Row: Search + Rarity Mode + Quality Tier + Socket/Eth Options -->
      <div class="grid gap-3 sm:grid-cols-12">
        <div class="sm:col-span-4">
          <label class="block text-xs uppercase tracking-widest text-parchment-300">
            Search any base, code, or unique/set
            <input
              type="search"
              class="field mt-1 !py-1.5 text-xs"
              placeholder="e.g. Archon Plate, Monarch, Phase Blade, Griffon…"
              bind:value={baseSearch}
              oninput={() => {
                if (baseSearch.trim()) showBaseBrowser = true;
              }}
            />
          </label>
        </div>

        <div class="sm:col-span-3">
          <label class="block text-xs uppercase tracking-widest text-parchment-300">
            Apply Tier Rule To Rarity
            <select class="field mt-1 !py-1.5 text-xs" bind:value={newBaseMode}>
              <option value="runeword">Runeword / White &amp; Superior Base</option>
              <option value="rare">Rare Item of this Base</option>
              <option value="magic">Magic Item of this Base</option>
              <option value="crafted">Crafted Item of this Base</option>
              <option value="unique">Unique Item of this Base</option>
              <option value="set">Set Item of this Base</option>
              <option value="any">All Rarities of this Base</option>
            </select>
          </label>
        </div>

        <div class="sm:col-span-3">
          <span class="block text-xs uppercase tracking-widest text-parchment-300">Base Quality Filter</span>
          <div class="mt-1 flex gap-1">
            {#each [
              { id: 'all', label: 'All' },
              { id: 'elite', label: 'Elite' },
              { id: 'exceptional', label: 'Exceptional' },
              { id: 'normal', label: 'Normal' }
            ] as qt}
              <button
                type="button"
                class={`flex-1 rounded border px-2 py-1.5 text-xs font-semibold transition-colors ${
                  browserQualityTier === qt.id
                    ? 'border-ember-400 bg-ember-900/40 text-parchment-50'
                    : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40'
                }`}
                onclick={() => {
                  browserQualityTier = qt.id as typeof browserQualityTier;
                  showBaseBrowser = true;
                }}
              >
                {qt.label}
              </button>
            {/each}
          </div>
        </div>

        {#if newBaseMode === 'runeword'}
          <div class="sm:col-span-2">
            <label class="block text-xs uppercase tracking-widest text-parchment-300">
              New Rule Sockets
              <select class="field mt-1 !py-1.5 text-xs" bind:value={newBaseMinSockets}>
                <option value={0}>Any (0–6)</option>
                <option value={2}>2+ Sockets</option>
                <option value={3}>3+ Sockets</option>
                <option value={4}>4+ Sockets</option>
                <option value={5}>5+ Sockets</option>
                <option value={6}>6 Sockets</option>
              </select>
            </label>
            <label class="mt-1.5 flex items-center gap-1.5 text-[11px] text-parchment-200">
              <input type="checkbox" bind:checked={newBaseEthOnly} />
              Ethereal only
            </label>
          </div>
        {/if}
      </div>

      {#if showBaseBrowser || baseSearch.trim()}
        <!-- Slot & Weapon Family Selector Pills -->
        <div class="space-y-2 border-t border-parchment-300/15 pt-3">
          {#each ['Armor & Offhands', 'Weapons & Quivers'] as grpName}
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="mr-1 text-[11px] font-bold uppercase tracking-wider text-ember-300">{grpName}:</span>
              {#each BASE_SLOT_FILTERS.filter(s => s.group === grpName || (grpName === 'Armor & Offhands' && s.id === 'all')) as slot (slot.id)}
                <button
                  type="button"
                  class={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    browserSlotId === slot.id
                      ? 'border-ember-400 bg-ember-900/45 text-parchment-50'
                      : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/45 hover:text-parchment-100'
                  }`}
                  onclick={() => (browserSlotId = slot.id)}
                >
                  {slot.label}
                </button>
              {/each}
            </div>
          {/each}
        </div>

        <!-- Visual Grid of Matching Bases with Direct S / A / B / C / D / ✕ Tier Buttons -->
        <div class="grid max-h-80 gap-2 overflow-y-auto rounded-lg border border-parchment-300/20 bg-abyss-950 p-3 sm:grid-cols-2 xl:grid-cols-3">
          {#each browserMatchingBases as baseItem (baseItem.code)}
            {@const existingRule = getCustomBaseRule(baseItem.code!, newBaseMode)}
            {@const inheritedTier = !existingRule ? getInheritedBaseTier(baseItem.code!, newBaseMode) : undefined}
            {@const effectiveBrowserTier = existingRule?.tier ?? inheritedTier}
            {@const notables = notableNamesForBase(baseItem.code!)}
            <div
              class={`flex items-center justify-between gap-2 rounded border p-2.5 text-xs transition-colors ${
                existingRule
                  ? 'border-ember-400/75 bg-ember-950/25'
                  : effectiveBrowserTier === 'HIDE'
                    ? 'border-red-900/35 bg-abyss-950/50 opacity-70 hover:opacity-100'
                    : 'border-parchment-300/15 bg-abyss-900/60 hover:border-parchment-300/35'
              }`}
            >
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class={`break-words font-semibold ${effectiveBrowserTier === 'HIDE' ? 'line-through text-parchment-300/70' : 'text-parchment-50'}`}>
                    {baseItem.displayName || baseItem.name}
                  </span>
                  <span class="rounded bg-abyss-950 px-1.5 py-0.5 font-mono text-[10px] text-parchment-300">
                    {baseItem.code}
                  </span>
                  {#if baseItem.tier}
                    <span class="rounded border border-parchment-300/20 px-1.5 py-0.5 text-[10px] uppercase text-ember-300">
                      {baseItem.tier}
                    </span>
                  {/if}
                  {#if !existingRule && inheritedTier === 'HIDE'}
                    <span class="rounded bg-red-950/70 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                      Hidden
                    </span>
                  {/if}
                </div>
                {#if notables}
                  <p class="mt-0.5 break-words text-[11px] text-parchment-300/85">
                    Uniques/Sets: {notables}
                  </p>
                {/if}
              </div>

              <div class="flex shrink-0 items-center gap-1">
                {#each TIER_RANKS as targetRank}
                  {@const isAssigned = existingRule?.tier === targetRank.id}
                  {@const isInherited = !existingRule && inheritedTier === targetRank.id}
                  <button
                    type="button"
                    class={`h-6 min-w-6 rounded border px-1 text-[11px] font-semibold transition-colors ${
                      isAssigned
                        ? 'border-ember-400 bg-ember-600/50 text-parchment-50'
                        : isInherited
                          ? targetRank.id === 'HIDE'
                            ? 'border-red-400/50 bg-red-950/50 text-red-200'
                            : 'border-ember-400/45 bg-ember-950/40 text-ember-200'
                          : 'border-parchment-300/15 bg-abyss-950 text-parchment-300 hover:border-ember-400/60 hover:text-parchment-50'
                    }`}
                    title={`Assign ${baseItem.displayName || baseItem.name} (${newBaseMode}) to ${targetRank.shortLabel}`}
                    onclick={() =>
                      setIndividualBaseTier(
                        baseItem.code!,
                        baseItem.displayName || baseItem.name || baseItem.code!,
                        newBaseMode,
                        targetRank.id
                      )}
                  >
                    {targetRank.id === 'HIDE' ? '✕' : targetRank.id}
                  </button>
                {/each}
                {#if existingRule}
                  <button
                    type="button"
                    class="ml-0.5 h-6 px-1 text-xs text-ember-400 hover:text-parchment-50"
                    title="Remove custom base override"
                    onclick={() => removeCustomBase(existingRule.id)}
                  >
                    ↺
                  </button>
                {/if}
              </div>
            </div>
          {:else}
            <p class="col-span-full py-4 text-center text-xs text-parchment-300">
              No bases matched that filter. Try switching Base Quality to "All" or clearing the search box.
            </p>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- FilterBlade Tier Rows (S, A, B, C, D, HIDE) -->
  <div class="space-y-4">
    {#each TIER_RANKS as rank (rank.id)}
      {@const tierItems = itemsByTier.get(rank.id) ?? []}
      {@const tierCustomBases = customBasesByTier.get(rank.id) ?? []}
      {@const isHide = rank.id === 'HIDE'}
      {@const style = !isHide ? effectiveTierStyle(rank.id as Exclude<TierRank, 'HIDE'>, config, activeCategory) : undefined}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <section
        class={`panel rounded-lg border transition-colors ${dragOverTier === rank.id ? 'border-ember-400 bg-ember-950/20' : 'border-parchment-300/20'}`}
        aria-label={rank.label}
        ondragover={e => {
          e.preventDefault();
          dragOverTier = rank.id;
        }}
        ondragleave={() => {
          if (dragOverTier === rank.id) dragOverTier = null;
        }}
        ondrop={e => handleDrop(e, rank.id)}
      >
        <!-- Tier Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300/15 bg-abyss-950/70 px-4 py-3">
          <div class="flex flex-wrap items-center gap-3">
            <span class={`inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold tracking-wider uppercase ${rank.badgeClass}`}>
              {rank.shortLabel}
            </span>
            <div>
              <h3 class="text-sm font-semibold text-parchment-50">{rank.label}</h3>
              <p class="text-xs text-parchment-300">{rank.description}</p>
            </div>
          </div>

          <!-- Live Ground Label Preview & Style Controls -->
          <div class="flex flex-wrap items-center gap-2.5">
            {#if !isHide && style}
              {@const rankKey = rank.id as Exclude<TierRank, 'HIDE'>}
              {#if activeCategory === 'uniques'}
                {@const uPreview = effectiveRarityTierStyle(rankKey, config, 'uniques', 'unique')}
                {@const sPreview = effectiveRarityTierStyle(rankKey, config, 'uniques', 'set')}
                <div
                  class="flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={styleObjToCss(uPreview)}
                  title="Live Unique ground placard preview for this tier"
                >
                  {#if uPreview.minimapIcon}
                    <svg width="13" height="13" viewBox="0 0 40 40" fill={cssColor(uPreview.minimapIcon.fillColor, '#ffd24b')} stroke={cssColor(uPreview.minimapIcon.borderColor, '#ffffff')} stroke-width="3" aria-hidden="true">
                      {@render minimapShape(uPreview.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>Unique</span>
                </div>
                <div
                  class="flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={styleObjToCss(sPreview)}
                  title="Live Set ground placard preview for this tier"
                >
                  {#if sPreview.minimapIcon}
                    <svg width="13" height="13" viewBox="0 0 40 40" fill={cssColor(sPreview.minimapIcon.fillColor, '#37ff73')} stroke={cssColor(sPreview.minimapIcon.borderColor, '#ffffff')} stroke-width="3" aria-hidden="true">
                      {@render minimapShape(sPreview.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>Set</span>
                </div>
              {:else if activeCategory === 'equipment'}
                {@const rPreview = effectiveRarityTierStyle(rankKey, config, 'equipment', 'rare')}
                {@const cPreview = effectiveRarityTierStyle(rankKey, config, 'equipment', 'crafted')}
                <div
                  class="flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={styleObjToCss(rPreview)}
                  title="Live Rare ground placard preview for this tier"
                >
                  {#if rPreview.minimapIcon}
                    <svg width="13" height="13" viewBox="0 0 40 40" fill={cssColor(rPreview.minimapIcon.fillColor, '#ffeb46')} stroke={cssColor(rPreview.minimapIcon.borderColor, '#ffffff')} stroke-width="3" aria-hidden="true">
                      {@render minimapShape(rPreview.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>Rare</span>
                </div>
                <div
                  class="flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={styleObjToCss(cPreview)}
                  title="Live Crafted ground placard preview for this tier"
                >
                  {#if cPreview.minimapIcon}
                    <svg width="13" height="13" viewBox="0 0 40 40" fill={cssColor(cPreview.minimapIcon.fillColor, '#ff911e')} stroke={cssColor(cPreview.minimapIcon.borderColor, '#ffffff')} stroke-width="3" aria-hidden="true">
                      {@render minimapShape(cPreview.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>Crafted</span>
                </div>
              {:else if activeCategory === 'bases'}
                {@const bPreview = effectiveRarityTierStyle(rankKey, config, 'bases', 'base')}
                <div
                  class="flex items-center gap-2 rounded px-3 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={styleObjToCss(bPreview)}
                  title="Live Runeword Base ground placard preview for this tier"
                >
                  {#if bPreview.minimapIcon}
                    <svg width="14" height="14" viewBox="0 0 40 40" fill={cssColor(bPreview.minimapIcon.fillColor, '#f0f7ff')} stroke={cssColor(bPreview.minimapIcon.borderColor, '#374b64')} stroke-width="3" aria-hidden="true">
                      {@render minimapShape(bPreview.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>Base Drop</span>
                </div>
              {:else}
                <div
                  class="flex items-center gap-2 rounded px-3 py-1 font-sans text-xs font-semibold shadow-sm"
                  style={tierPreviewStyle(rankKey)}
                  title="Live ground label preview for this tier"
                >
                  {#if style.minimapIcon}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 40 40"
                      fill={cssColor(style.minimapIcon.fillColor, '#f59e0b')}
                      stroke={cssColor(style.minimapIcon.borderColor, '#ffffff')}
                      stroke-width="3"
                      aria-hidden="true"
                    >
                      {@render minimapShape(style.minimapIcon.shape)}
                    </svg>
                  {/if}
                  <span>
                    {style.namePrefix
                      ? style.namePrefix.replaceAll('{name}', `${categoryInfo.name.split(' ')[0]} Drop`)
                      : `${categoryInfo.name.split(' ')[0]} Drop`}
                  </span>
                </div>
              {/if}

              {@const headerSound =
                categoryRarityTargets.length > 0
                  ? effectiveRarityTierStyle(rankKey, config, activeCategory, editingRarityKind).dropSound
                  : style.dropSound}
              {#if headerSound}
                <button
                  type="button"
                  class="rounded border border-parchment-300/25 bg-abyss-900 px-2 py-1 text-xs text-parchment-200 hover:border-ember-400"
                  title={`Preview drop sound (${headerSound})`}
                  onclick={() =>
                    $soundPreview.playing === headerSound
                      ? stopSound()
                      : playSound(headerSound!)}
                >
                  {$soundPreview.playing === headerSound ? '◼' : '♪'} {headerSound.replace('Filter', '')}
                </button>
              {/if}

              <button
                type="button"
                class="trade-secondary-button !px-2.5 !py-1 text-xs"
                aria-expanded={editingStyleTier === rankKey}
                onclick={() => (editingStyleTier = editingStyleTier === rankKey ? null : rankKey)}
              >
                {editingStyleTier === rankKey ? 'Close Style' : 'Edit Tier Style'}
              </button>
            {:else}
              <span class="rounded border border-dashed border-red-500/40 bg-red-950/20 px-3 py-1 text-xs text-red-300">
                Hidden on ground (Hold Ctrl / LB to see)
              </span>
            {/if}
            <span class="text-xs text-parchment-300">({tierItems.length + tierCustomBases.length})</span>
          </div>
        </div>

        <!-- Inline Category / Rarity Tier Style Editor Drawer -->
        {#if !isHide && editingStyleTier === rank.id && style}
          {@const rankKey = rank.id as Exclude<TierRank, 'HIDE'>}
          {#if categoryRarityTargets.length > 0}
            {@const rStyle = effectiveRarityTierStyle(rankKey, config, activeCategory, editingRarityKind)}
            {@const rMeta = EDITABLE_RARITY_STYLES.find(x => x.id === editingRarityKind) ?? EDITABLE_RARITY_STYLES[0]}
            <div class="space-y-4 border-b border-parchment-300/20 bg-abyss-950 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-semibold uppercase tracking-widest text-ember-400">
                    Customize {rank.shortLabel}:
                  </span>
                  {#each categoryRarityTargets as rTarget (rTarget)}
                    {@const targetMeta = EDITABLE_RARITY_STYLES.find(x => x.id === rTarget)!}
                    <button
                      type="button"
                      class={`rounded border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        editingRarityKind === rTarget
                          ? 'border-ember-400 bg-ember-950/40 text-parchment-50'
                          : 'border-parchment-300/20 bg-abyss-900 text-parchment-300 hover:border-parchment-300/45'
                      }`}
                      onclick={() => (editingRarityKind = rTarget)}
                    >
                      {targetMeta.shortLabel}
                    </button>
                  {/each}
                </div>
                <button
                  type="button"
                  class="text-xs text-parchment-300 hover:text-ember-400 hover:underline"
                  onclick={() => resetRarityTierStyle(editingRarityKind, rankKey)}
                >
                  Reset {rMeta.shortLabel} {rank.shortLabel} to default
                </button>
              </div>
              <div class="grid gap-4 sm:grid-cols-3">
                <ColorInput
                  label="{rMeta.shortLabel} Background"
                  value={rStyle.backgroundColor ?? 'RGBA(20, 20, 26, 0.9)'}
                  onchange={v => updateRarityTierStyle(editingRarityKind, rankKey, { backgroundColor: v })}
                />
                <ColorInput
                  label="{rMeta.shortLabel} Border"
                  value={rStyle.borderColor ?? 'RGBA(240, 190, 90, 1)'}
                  onchange={v => updateRarityTierStyle(editingRarityKind, rankKey, { borderColor: v })}
                />
                <ColorInput
                  label="{rMeta.shortLabel} Text"
                  value={rStyle.textColor ?? 'RGBA(255, 240, 210, 1)'}
                  onchange={v => updateRarityTierStyle(editingRarityKind, rankKey, { textColor: v })}
                />
              </div>
              <SoundPicker
                value={rStyle.dropSound || undefined}
                onchange={v => updateRarityTierStyle(editingRarityKind, rankKey, { dropSound: v ?? '' })}
              />
            </div>
          {:else}
            <div class="space-y-4 border-b border-parchment-300/20 bg-abyss-950 p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-xs font-semibold uppercase tracking-widest text-ember-400">
                  Customize {rank.shortLabel} Appearance for {categoryInfo.name}
                </p>
                <button
                  type="button"
                  class="text-xs text-parchment-300 hover:text-ember-400 hover:underline"
                  onclick={() => resetCategoryTierStyle(rankKey)}
                >
                  Reset to theme default
                </button>
              </div>
              <div class="grid gap-4 sm:grid-cols-3">
                <ColorInput
                  label="Background Color"
                  value={style.backgroundColor ?? 'RGBA(20, 20, 26, 0.9)'}
                  onchange={v => updateCategoryTierStyle(rankKey, { backgroundColor: v })}
                />
                <ColorInput
                  label="Border Color"
                  value={style.borderColor ?? 'RGBA(240, 190, 90, 1)'}
                  onchange={v => updateCategoryTierStyle(rankKey, { borderColor: v })}
                />
                <ColorInput
                  label="Text Color"
                  value={style.textColor ?? 'RGBA(255, 240, 210, 1)'}
                  onchange={v => updateCategoryTierStyle(rankKey, { textColor: v })}
                />
              </div>
              <SoundPicker
                value={style.dropSound || undefined}
                onchange={v => updateCategoryTierStyle(rankKey, { dropSound: v ?? '' })}
              />
            </div>
          {/if}
        {/if}

        <!-- Draggable Item Pills & Individual Base Override Pills -->
        <div class="p-3 sm:p-4">
          {#if tierItems.length + tierCustomBases.length > 0}
            <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              <!-- Individual Custom-Tiered Base Pills in this Tier Row -->
              {#each tierCustomBases as cb (cb.id)}
                {@const parentGroup = findParentGroupForBase(cb.code, cb.mode, catalog, cb.parentItemId)}
                {@const parentTier = parentGroup ? effectiveItemTier(parentGroup, config) : undefined}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  draggable="true"
                  ondragstart={e => {
                    draggedCustomBaseId = cb.id;
                    e.dataTransfer?.setData('text/plain', cb.id);
                  }}
                  ondragend={() => {
                    draggedCustomBaseId = null;
                    dragOverTier = null;
                  }}
                  class="group flex flex-col justify-between gap-2 rounded border border-ember-400/75 bg-ember-950/30 p-3 transition-all cursor-grab active:cursor-grabbing"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-xs text-ember-300" aria-hidden="true">⋮⋮</span>
                        <span class="break-words text-sm font-bold text-parchment-50">{cb.label}</span>
                        <span class="rounded bg-abyss-950 px-1.5 py-0.5 font-mono text-[10px] text-parchment-300">
                          {cb.code}
                        </span>
                        <span class="rounded bg-ember-500/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ember-300">
                          {cb.mode === 'runeword' ? 'Base' : cb.mode}
                        </span>
                      </div>
                      {#if parentGroup && parentTier}
                        <p class="mt-1 pl-4 text-[11px] text-parchment-300/85">
                          Split from group · Move to <strong>{parentTier === 'HIDE' ? 'Hide' : `Tier ${parentTier}`}</strong> or click <strong>↺</strong> to rejoin group
                        </p>
                      {/if}
                      {#if cb.mode === 'runeword'}
                        <div class="mt-2 flex flex-wrap items-center gap-2 pl-4 text-[11px] text-parchment-200">
                          <label class="flex items-center gap-1">
                            <span>Sockets:</span>
                            <select
                              class="rounded border border-parchment-300/20 bg-abyss-950 px-1.5 py-0.5 text-[11px]"
                              value={cb.minSockets ?? 0}
                              onchange={e =>
                                updateCustomBasePatch(cb.id, {
                                  minSockets: Number(e.currentTarget.value) || undefined
                                })}
                            >
                              <option value={0}>Any</option>
                              <option value={2}>2+ os</option>
                              <option value={3}>3+ os</option>
                              <option value={4}>4+ os</option>
                              <option value={5}>5+ os</option>
                              <option value={6}>6 os</option>
                            </select>
                          </label>
                          <label class="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={cb.etherealOnly ?? false}
                              onchange={e =>
                                updateCustomBasePatch(cb.id, {
                                  etherealOnly: e.currentTarget.checked || undefined
                                })}
                            />
                            <span>Eth only</span>
                          </label>
                        </div>
                      {/if}
                    </div>

                    <div class="flex shrink-0 items-center gap-1 pt-0.5">
                      {#each TIER_RANKS as targetRank}
                        {@const isCurrent = cb.tier === targetRank.id}
                        <button
                          type="button"
                          class={`h-6 min-w-6 rounded border px-1 text-[11px] font-semibold transition-colors ${
                            isCurrent
                              ? 'border-ember-400 bg-ember-600/40 text-parchment-50'
                              : 'border-parchment-300/15 bg-abyss-900/80 text-parchment-300 hover:border-ember-400/60 hover:text-parchment-50'
                          }`}
                          title={parentTier === targetRank.id
                            ? `Return ${cb.label} to ${targetRank.shortLabel} and rejoin group`
                            : `Move ${cb.label} to ${targetRank.shortLabel}`}
                          onclick={() => updateCustomBaseTier(cb.id, targetRank.id)}
                        >
                          {targetRank.id === 'HIDE' ? '✕' : targetRank.id}
                        </button>
                      {/each}
                      <button
                        type="button"
                        class="ml-0.5 h-6 px-1 text-xs text-ember-400 hover:text-parchment-50"
                        title={parentGroup ? `Rejoin group (${parentGroup.label})` : 'Remove individual base override'}
                        aria-label={`Remove ${cb.label}`}
                        onclick={() => removeCustomBase(cb.id)}
                      >
                        ↺
                      </button>
                    </div>
                  </div>
                </div>
              {/each}

              <!-- Standard Curated Item / Group Pills -->
              {#each tierItems as item (item.id)}
                {@const modified = isItemOverridden(item, config)}
                {@const groupDisplay = getGroupDisplayInfo(item, config, catalog)}
                {@const childBases = groupDisplay.allBases}
                {@const isExpanded = !!expandedItemIds[item.id]}
                {@const overriddenChildrenCount = groupDisplay.splitBases.length}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  draggable="true"
                  ondragstart={e => {
                    draggedItemId = item.id;
                    e.dataTransfer?.setData('text/plain', item.id);
                  }}
                  ondragend={() => {
                    draggedItemId = null;
                    dragOverTier = null;
                  }}
                  class={`group flex flex-col justify-between gap-2 rounded border p-3 transition-all cursor-grab active:cursor-grabbing ${
                    isExpanded ? 'md:col-span-2 2xl:col-span-3 ' : ''
                  }${
                    modified || overriddenChildrenCount > 0
                      ? 'border-ember-400/70 bg-ember-950/25'
                      : 'border-parchment-300/15 bg-abyss-950 hover:border-parchment-300/35'
                  }`}
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-1.5">
                        <span class="mt-0.5 shrink-0 text-xs text-parchment-300/60" aria-hidden="true">⋮⋮</span>
                        <span class="break-words text-sm font-semibold leading-snug text-parchment-50">
                          {groupDisplay.label}
                        </span>
                        {#if item.rarities?.includes('unique') && item.rarities?.includes('set')}
                          <span class="shrink-0 rounded border border-amber-400/50 bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200">
                            Unique
                          </span>
                          <span class="shrink-0 rounded border border-emerald-400/50 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                            Set
                          </span>
                        {:else if item.rarities?.length === 1 && item.rarities[0] === 'unique'}
                          <span class="shrink-0 rounded border border-amber-400/50 bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200">
                            Unique
                          </span>
                        {:else if item.rarities?.length === 1 && item.rarities[0] === 'set'}
                          <span class="shrink-0 rounded border border-emerald-400/50 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                            Set
                          </span>
                        {:else if item.rarities?.includes('rare') && item.rarities?.includes('crafted')}
                          <span class="shrink-0 rounded border border-yellow-400/50 bg-yellow-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-200">
                            Rare
                          </span>
                          <span class="shrink-0 rounded border border-orange-400/50 bg-orange-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300">
                            Crafted
                          </span>
                        {:else if item.rarities?.length === 1 && item.rarities[0] === 'rare'}
                          <span class="shrink-0 rounded border border-yellow-400/50 bg-yellow-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-200">
                            Rare
                          </span>
                        {:else if item.rarities?.length === 1 && item.rarities[0] === 'crafted'}
                          <span class="shrink-0 rounded border border-orange-400/50 bg-orange-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300">
                            Crafted
                          </span>
                        {:else if (item.rarities?.length === 1 && item.rarities[0] === 'magic') || item.id === 'misc-magic-quivers'}
                          <span class="shrink-0 rounded border border-blue-400/50 bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                            Magic
                          </span>
                        {:else if item.category === 'bases'}
                          <span class="shrink-0 rounded border border-slate-300/45 bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-100">
                            Base
                          </span>
                        {/if}
                        {#if modified}
                          <span class="shrink-0 rounded bg-ember-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-ember-300" title="Custom tier override">
                            Edited
                          </span>
                        {/if}
                        {#if overriddenChildrenCount > 0}
                          <span
                            class="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300"
                            title={`Split out: ${groupDisplay.splitBases.map(s => `${s.entry.label} (${s.rule.tier === 'HIDE' ? 'Hide' : s.rule.tier})`).join(', ')}`}
                          >
                            {overriddenChildrenCount} split
                          </span>
                        {/if}
                      </div>
                      {#if groupDisplay.subtitle}
                        <p class="mt-1 break-words pl-4 text-xs leading-relaxed text-parchment-300/85">
                          {groupDisplay.subtitle}
                        </p>
                      {/if}
                      {#if overriddenChildrenCount > 0}
                        <p class="mt-1 break-words pl-4 text-[11px] text-emerald-300/90">
                          Split out:
                          {groupDisplay.splitBases
                            .map(s => `${s.entry.label} → ${s.rule.tier === 'HIDE' ? 'Hide' : `Tier ${s.rule.tier}`}`)
                            .join(', ')}
                        </p>
                      {/if}
                      {#if childBases.length > 1}
                        <div class="mt-2 pl-4">
                          <button
                            type="button"
                            class="rounded border border-parchment-300/25 bg-abyss-900 px-2.5 py-1 text-[11px] font-semibold text-ember-300 hover:border-ember-400 hover:text-parchment-50"
                            aria-expanded={isExpanded}
                            onclick={e => {
                              e.stopPropagation();
                              toggleExpandItem(item.id);
                            }}
                          >
                            {isExpanded
                              ? `▾ Hide Individual Bases (${groupDisplay.activeBases.length}/${childBases.length} in group)`
                              : `▸ Expand & Tier Individual Bases (${groupDisplay.activeBases.length}/${childBases.length})`}
                          </button>
                        </div>
                      {/if}
                    </div>

                    <!-- Quick-Tier Selector Buttons -->
                    <div class="flex shrink-0 items-center gap-1 pt-0.5" aria-label={`Move ${groupDisplay.label} to tier`}>
                      {#each TIER_RANKS as targetRank}
                        {@const isCurrent = rank.id === targetRank.id}
                        <button
                          type="button"
                          class={`h-6 min-w-6 rounded border px-1 text-[11px] font-semibold transition-colors ${
                            isCurrent
                              ? 'border-ember-400 bg-ember-600/40 text-parchment-50'
                              : 'border-parchment-300/15 bg-abyss-900/80 text-parchment-300 hover:border-ember-400/60 hover:text-parchment-50'
                          }`}
                          title={`Move ${groupDisplay.label} to ${targetRank.shortLabel}`}
                          aria-label={`Move ${groupDisplay.label} to ${targetRank.shortLabel}`}
                          aria-pressed={isCurrent}
                          onclick={() => moveItemToTier(item, targetRank.id)}
                        >
                          {targetRank.id === 'HIDE' ? '✕' : targetRank.id}
                        </button>
                      {/each}
                      {#if modified || overriddenChildrenCount > 0}
                        <button
                          type="button"
                          class="ml-0.5 h-6 px-1 text-xs text-ember-400 hover:text-parchment-50"
                          title="Reset group and rejoin all split bases"
                          aria-label={`Reset ${item.label} to default`}
                          onclick={() => resetItem(item)}
                        >
                          ↺
                        </button>
                      {/if}
                    </div>
                  </div>

                  <!-- Expanded Child Bases Drawer (Split / Re-Tier Any Single Base in this Group) -->
                  {#if isExpanded && childBases.length > 1}
                    <div class="mt-2 border-t border-parchment-300/15 pt-3">
                      <p class="mb-2 text-xs text-parchment-300">
                        Click <strong>S / A / B / C / D / ✕</strong> on any individual item below to pull it out into its own tier (updating this group's name), or click <strong>{rank.id === 'HIDE' ? '✕' : rank.id}</strong> to join it back into this group:
                      </p>
                      <div class="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                        {#each childBases as entry (entry.code)}
                          {@const customRule = getCustomBaseRule(entry.code, entry.mode, item.id)}
                          {@const effectiveChildTier = customRule ? customRule.tier : rank.id}
                          <div
                            class={`flex items-center justify-between gap-2 rounded border px-2.5 py-2 text-xs ${
                              customRule
                                ? 'border-ember-400/75 bg-ember-950/35'
                                : 'border-parchment-300/15 bg-abyss-900/75'
                            }`}
                          >
                            <div class="min-w-0 flex-1">
                              <div class="flex flex-wrap items-center gap-1.5">
                                <span class="break-words font-semibold text-parchment-50">{entry.label}</span>
                                <span class="rounded bg-abyss-950 px-1 py-0.5 font-mono text-[10px] text-parchment-300">
                                  {entry.code}
                                </span>
                                {#if customRule}
                                  <span class="rounded bg-ember-500/25 px-1 py-0.5 text-[10px] font-bold text-ember-300">
                                    Split → {customRule.tier === 'HIDE' ? 'Hide' : customRule.tier}
                                  </span>
                                {:else}
                                  <span class="rounded bg-emerald-500/15 px-1 py-0.5 text-[10px] text-emerald-300">
                                    In Group
                                  </span>
                                {/if}
                              </div>
                              {#if entry.notableNames}
                                <p class="mt-0.5 break-words text-[11px] text-parchment-300/80">{entry.notableNames}</p>
                              {/if}
                            </div>

                            <div class="flex shrink-0 items-center gap-1">
                              {#each TIER_RANKS as targetRank}
                                {@const isChildCurrent = effectiveChildTier === targetRank.id}
                                <button
                                  type="button"
                                  class={`h-6 min-w-6 rounded border px-1 text-[11px] font-semibold transition-colors ${
                                    isChildCurrent
                                      ? customRule
                                        ? 'border-ember-400 bg-ember-600/50 text-parchment-50'
                                        : 'border-parchment-300/45 bg-abyss-800 text-parchment-100'
                                      : 'border-parchment-300/15 bg-abyss-950 text-parchment-300 hover:border-ember-400/60 hover:text-parchment-50'
                                  }`}
                                  title={targetRank.id === rank.id
                                    ? `Join ${entry.label} back into this group (${rank.shortLabel})`
                                    : `Pull ${entry.label} out to ${targetRank.shortLabel}`}
                                  onclick={() =>
                                    setIndividualBaseTier(
                                      entry.code,
                                      entry.label,
                                      entry.mode,
                                      targetRank.id,
                                      rank.id,
                                      item.id
                                    )}
                                >
                                  {targetRank.id === 'HIDE' ? '✕' : targetRank.id}
                                </button>
                              {/each}
                              {#if customRule}
                                <button
                                  type="button"
                                  class="ml-0.5 h-6 px-1 text-xs text-ember-400 hover:text-parchment-50"
                                  title="Join back into group"
                                  onclick={() => removeCustomBase(customRule.id)}
                                >
                                  ↺
                                </button>
                              {/if}
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <div class="rounded border border-dashed border-parchment-300/15 py-5 text-center text-xs text-parchment-300/70">
              Drag any item or base pill here or click its <strong>{rank.id === 'HIDE' ? '✕' : rank.id}</strong> button to place it in {rank.shortLabel}.
            </div>
          {/if}
        </div>
      </section>
    {/each}
  </div>
</div>
