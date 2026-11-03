<script lang="ts">
  import M from '#lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import type { Catalog } from '#lib/loot-filter/types.js';
  import ColorInput from '../loot-filter/ColorInput.svelte';
  import SoundPicker from '../loot-filter/SoundPicker.svelte';
  import {
    CATEGORIES,
    TIERABLE_ITEMS,
    TIER_RANKS,
    effectiveItemTier,
    effectiveTierStyle,
    isItemOverridden,
    type CategoryId,
    type CustomBaseRule,
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
  let dragOverTier = $state<TierRank | null>(null);
  let editingStyleTier = $state<Exclude<TierRank, 'HIDE'> | null>(null);

  // Custom base builder state (for 'bases' and 'uniques' categories)
  let baseSearch = $state('');
  let newBaseMode = $state<CustomBaseRule['mode']>('runeword');
  let newBaseTier = $state<TierRank>('A');
  let newBaseMinSockets = $state(0);
  let newBaseEthOnly = $state(false);

  const categoryInfo = $derived(CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]);

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLocaleLowerCase();
    if (q) {
      return TIERABLE_ITEMS.filter(
        item =>
          item.label.toLocaleLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLocaleLowerCase().includes(q)) ||
          (item.codes && item.codes.some(c => c.toLocaleLowerCase().includes(q)))
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

  const equipmentCatalogMatches = $derived.by(() => {
    const q = baseSearch.trim().toLocaleLowerCase();
    if (!q) return [];
    return catalog.baseItems
      .filter(
        b =>
          (b.kind === 'weapon' || b.kind === 'armor') &&
          b.code &&
          `${b.displayName ?? ''} ${b.name} ${b.code}`.toLocaleLowerCase().includes(q)
      )
      .slice(0, 18);
  });

  const categoryCustomBases = $derived(
    config.customBases.filter(cb =>
      activeCategory === 'bases' ? cb.mode === 'runeword' : cb.mode !== 'runeword'
    )
  );

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }

  function tierPreviewStyle(tier: Exclude<TierRank, 'HIDE'>) {
    const style = effectiveTierStyle(tier, config, activeCategory);
    const text = cssColor(style.textColor, '#f7f1e3');
    const bg = cssColor(style.backgroundColor, 'rgba(14, 14, 18, 0.88)');
    const border = style.borderColor
      ? `2px solid ${cssColor(style.borderColor, 'transparent')}`
      : '1px solid rgba(188, 167, 125, 0.25)';
    return `color:${text};background:${bg};border:${border}`;
  }

  function moveItemToTier(item: TierableItem, targetTier: TierRank) {
    const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
    if (targetTier === defaultForStrictness) {
      delete config.itemOverrides[item.id];
    } else {
      config.itemOverrides[item.id] = targetTier;
    }
    config.itemOverrides = { ...config.itemOverrides };
    onchange();
  }

  function resetItem(item: TierableItem) {
    delete config.itemOverrides[item.id];
    config.itemOverrides = { ...config.itemOverrides };
    onchange();
  }

  function resetCategoryItems() {
    const next = { ...config.itemOverrides };
    for (const item of TIERABLE_ITEMS) {
      if (item.category === activeCategory) delete next[item.id];
    }
    config.itemOverrides = next;
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
    config.categoryTierStyleOverrides = {
      ...config.categoryTierStyleOverrides,
      [activeCategory]: currentCat
    };
    onchange();
  }

  function addCustomBase(code: string, label: string) {
    const mode = activeCategory === 'bases' ? 'runeword' : newBaseMode === 'runeword' ? 'unique' : newBaseMode;
    config.customBases = [
      {
        id: `${code}-${mode}-${Date.now()}`,
        code,
        label,
        tier: newBaseTier,
        mode,
        minSockets: mode === 'runeword' && newBaseMinSockets > 0 ? newBaseMinSockets : undefined,
        etherealOnly: mode === 'runeword' && newBaseEthOnly ? true : undefined
      },
      ...config.customBases
    ];
    baseSearch = '';
    onchange();
  }

  function removeCustomBase(id: string) {
    config.customBases = config.customBases.filter(cb => cb.id !== id);
    onchange();
  }

  function updateCustomBaseTier(id: string, tier: TierRank) {
    config.customBases = config.customBases.map(cb => (cb.id === id ? { ...cb, tier } : cb));
    onchange();
  }

  function handleDrop(event: DragEvent, targetTier: TierRank) {
    event.preventDefault();
    dragOverTier = null;
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
        <h2 class="text-2xl font-bold tracking-tight text-parchment-50">{searchQuery.trim() ? `Search Results: “${searchQuery.trim()}”` : categoryInfo.name}</h2>
      </div>
      <p class="mt-1 text-sm text-parchment-300">
        {searchQuery.trim()
          ? `Showing ${filteredItems.length} matching item groups across all categories. Drag pills or click S / A / B / C / D / Hide to re-tier.`
          : `${categoryInfo.subtitle}. Drag any item pill into a tier row or use its quick-tier buttons.`}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#if searchQuery.trim()}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={() => (searchQuery = '')}>Clear search</button>
      {:else}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={resetCategoryItems}>
          Reset category to {config.strictness} defaults
        </button>
      {/if}
    </div>
  </div>

  <!-- Special Runeword Base Options when on 'bases' -->
  {#if activeCategory === 'bases' && !searchQuery.trim()}
    <div class="panel space-y-4 rounded-lg border border-ember-400/30 p-4 sm:p-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class="text-lg font-bold tracking-tight text-parchment-50">Runeword & Base Filtering Rules</h3>
          <p class="text-xs text-parchment-300">Automatic rules applied alongside the curated base tier list below.</p>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="flex items-start gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3 text-sm">
          <input type="checkbox" class="mt-0.5" bind:checked={config.baseSettings.highlightEthEliteBases} onchange={onchange} />
          <span>
            <strong class="block text-parchment-50">Ethereal Elite Bases (Tier B)</strong>
            <span class="text-xs text-parchment-300">Highlights all ethereal Elite-tier weapons & armor for mercenary and indestructible runewords.</span>
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

  <!-- Custom Base Rule Builder for 'bases' or 'uniques' -->
  {#if (activeCategory === 'bases' || activeCategory === 'uniques') && !searchQuery.trim()}
    <div class="panel space-y-3 rounded-lg p-4 sm:p-5">
      <h3 class="text-lg font-bold tracking-tight text-parchment-50">
        {activeCategory === 'bases' ? 'Pin Specific Weapon / Armor Base' : 'Pin Specific Unique / Set / Rare Base'}
      </h3>
      <p class="text-xs text-parchment-300">
        Search any of the 523 Reimagined weapon and armor bases to assign a dedicated priority rule.
      </p>
      <div class="grid gap-3 sm:grid-cols-12">
        <div class="sm:col-span-5">
          <label class="block text-xs uppercase tracking-widest text-parchment-300">
            Search base item
            <input
              type="search"
              class="field mt-1"
              placeholder="e.g. Monarch, Phase Blade, Shako, Grimoire…"
              bind:value={baseSearch}
            />
          </label>
        </div>
        {#if activeCategory !== 'bases'}
          <div class="sm:col-span-3">
            <label class="block text-xs uppercase tracking-widest text-parchment-300">
              Rarity
              <select class="field mt-1" bind:value={newBaseMode}>
                <option value="unique">Unique</option>
                <option value="set">Set</option>
                <option value="rare">Rare</option>
              </select>
            </label>
          </div>
        {:else}
          <div class="sm:col-span-2">
            <label class="block text-xs uppercase tracking-widest text-parchment-300">
              Min Sockets
              <select class="field mt-1" bind:value={newBaseMinSockets}>
                <option value={0}>Any (0–6)</option>
                <option value={2}>2+ Sockets</option>
                <option value={3}>3+ Sockets</option>
                <option value={4}>4+ Sockets</option>
                <option value={5}>5+ Sockets</option>
                <option value={6}>6 Sockets</option>
              </select>
            </label>
          </div>
          <div class="flex items-end pb-2 sm:col-span-2">
            <label class="flex items-center gap-2 text-xs text-parchment-200">
              <input type="checkbox" bind:checked={newBaseEthOnly} />
              Ethereal only
            </label>
          </div>
        {/if}
        <div class="sm:col-span-3">
          <label class="block text-xs uppercase tracking-widest text-parchment-300">
            Assign to Tier
            <select class="field mt-1" bind:value={newBaseTier}>
              {#each TIER_RANKS as r}
                <option value={r.id}>{r.shortLabel}</option>
              {/each}
            </select>
          </label>
        </div>
      </div>

      {#if equipmentCatalogMatches.length > 0}
        <div class="mt-2 grid max-h-56 gap-2 overflow-y-auto rounded border border-parchment-300/20 bg-abyss-950 p-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {#each equipmentCatalogMatches as baseItem (baseItem.code)}
            <div class="flex items-center justify-between gap-2 rounded border border-parchment-300/15 px-3 py-2 text-xs">
              <div class="min-w-0">
                <p class="break-words font-medium text-parchment-50">{baseItem.displayName || baseItem.name}</p>
                <p class="text-[11px] text-parchment-300">{baseItem.code} · {baseItem.tier ?? baseItem.kind}</p>
              </div>
              <button
                type="button"
                class="trade-primary-button shrink-0 !px-2.5 !py-1 text-xs"
                onclick={() => addCustomBase(baseItem.code!, baseItem.displayName || baseItem.name || baseItem.code!)}
              >
                + Pin ({newBaseTier})
              </button>
            </div>
          {/each}
        </div>
      {/if}

      {#if categoryCustomBases.length > 0}
        <div class="mt-3 space-y-2">
          <p class="text-xs uppercase tracking-widest text-parchment-300">Pinned Base Overrides ({categoryCustomBases.length})</p>
          <div class="flex flex-wrap gap-2">
            {#each categoryCustomBases as cb (cb.id)}
              <div class="flex items-center gap-2 rounded border border-ember-400/40 bg-abyss-950 px-3 py-1.5 text-xs">
                <span class="font-medium text-parchment-50">{cb.label}</span>
                <span class="text-parchment-300">
                  ({cb.code}{cb.minSockets ? ` · ${cb.minSockets}+os` : ''}{cb.etherealOnly ? ' · Eth' : ''})
                </span>
                <select
                  class="rounded border border-parchment-300/25 bg-abyss-900 px-1.5 py-0.5 text-xs text-ember-300"
                  value={cb.tier}
                  aria-label={`Tier for ${cb.label}`}
                  onchange={e => updateCustomBaseTier(cb.id, e.currentTarget.value as TierRank)}
                >
                  {#each TIER_RANKS as r}
                    <option value={r.id}>{r.shortLabel}</option>
                  {/each}
                </select>
                <button
                  type="button"
                  class="text-parchment-300 hover:text-requirement"
                  title="Remove pinned base"
                  aria-label={`Remove ${cb.label}`}
                  onclick={() => removeCustomBase(cb.id)}
                >
                  ✕
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- FilterBlade Tier Rows (S, A, B, C, D, HIDE) -->
  <div class="space-y-4">
    {#each TIER_RANKS as rank (rank.id)}
      {@const tierItems = itemsByTier.get(rank.id) ?? []}
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

              {#if style.dropSound}
                <button
                  type="button"
                  class="rounded border border-parchment-300/25 bg-abyss-900 px-2 py-1 text-xs text-parchment-200 hover:border-ember-400"
                  title={`Preview drop sound (${style.dropSound})`}
                  onclick={() =>
                    $soundPreview.playing === style.dropSound
                      ? stopSound()
                      : playSound(style.dropSound!)}
                >
                  {$soundPreview.playing === style.dropSound ? '◼' : '♪'} {style.dropSound.replace('Filter', '')}
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
            <span class="text-xs text-parchment-300">({tierItems.length})</span>
          </div>
        </div>

        <!-- Inline Category-Specific Tier Style Editor Drawer -->
        {#if !isHide && editingStyleTier === rank.id && style}
          {@const rankKey = rank.id as Exclude<TierRank, 'HIDE'>}
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
              value={style.dropSound}
              onchange={v => updateCategoryTierStyle(rankKey, { dropSound: v })}
            />
          </div>
        {/if}

        <!-- Draggable Item Pills -->
        <div class="p-3 sm:p-4">
          {#if tierItems.length > 0}
            <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {#each tierItems as item (item.id)}
                {@const modified = isItemOverridden(item, config)}
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
                  class={`group flex items-start justify-between gap-3 rounded border p-3 transition-all cursor-grab active:cursor-grabbing ${
                    modified
                      ? 'border-ember-400/70 bg-ember-950/25'
                      : 'border-parchment-300/15 bg-abyss-950 hover:border-parchment-300/35'
                  }`}
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start gap-1.5">
                      <span class="mt-0.5 shrink-0 text-xs text-parchment-300/60" aria-hidden="true">⋮⋮</span>
                      <span class="break-words text-sm font-semibold leading-snug text-parchment-50">{item.label}</span>
                      {#if modified}
                        <span class="shrink-0 rounded bg-ember-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-ember-300" title="Custom tier override">
                          Edited
                        </span>
                      {/if}
                    </div>
                    {#if item.subtitle}
                      <p class="mt-1 break-words pl-4 text-xs leading-relaxed text-parchment-300/85">{item.subtitle}</p>
                    {/if}
                  </div>

                  <!-- Quick-Tier Selector Buttons -->
                  <div class="flex shrink-0 items-center gap-1 pt-0.5" aria-label={`Move ${item.label} to tier`}>
                    {#each TIER_RANKS as targetRank}
                      {@const isCurrent = rank.id === targetRank.id}
                      <button
                        type="button"
                        class={`h-6 min-w-6 rounded border px-1 text-[11px] font-semibold transition-colors ${
                          isCurrent
                            ? 'border-ember-400 bg-ember-600/40 text-parchment-50'
                            : 'border-parchment-300/15 bg-abyss-900/80 text-parchment-300 hover:border-ember-400/60 hover:text-parchment-50'
                        }`}
                        title={`Move ${item.label} to ${targetRank.shortLabel}`}
                        aria-label={`Move ${item.label} to ${targetRank.shortLabel}`}
                        aria-pressed={isCurrent}
                        onclick={() => moveItemToTier(item, targetRank.id)}
                      >
                        {targetRank.id === 'HIDE' ? '✕' : targetRank.id}
                      </button>
                    {/each}
                    {#if modified}
                      <button
                        type="button"
                        class="ml-0.5 h-6 px-1 text-xs text-ember-400 hover:text-parchment-50"
                        title="Reset item to strictness default"
                        aria-label={`Reset ${item.label} to default`}
                        onclick={() => resetItem(item)}
                      >
                        ↺
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="rounded border border-dashed border-parchment-300/15 py-5 text-center text-xs text-parchment-300/70">
              Drag any item pill here or click its <strong>{rank.id === 'HIDE' ? '✕' : rank.id}</strong> button to place it in {rank.shortLabel}.
            </div>
          {/if}
        </div>
      </section>
    {/each}
  </div>
</div>
