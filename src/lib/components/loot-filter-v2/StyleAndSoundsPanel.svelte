<script lang="ts">
  import M from '#lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import ColorInput from '../loot-filter/ColorInput.svelte';
  import SoundPicker from '../loot-filter/SoundPicker.svelte';
  import {
    EDITABLE_RARITY_STYLES,
    THEME_PRESETS,
    TIER_RANKS,
    effectiveRarityTierStyle,
    effectiveTierStyle,
    type ItemRarityStyleKind,
    type ThemeId,
    type TierRank,
    type TierStyle,
    type V2Config
  } from '#lib/loot-filter/v2-compiler.js';

  let {
    config = $bindable(),
    onchange
  }: {
    config: V2Config;
    onchange: () => void;
  } = $props();

  let selectedTier = $state<Exclude<TierRank, 'HIDE'>>('S');
  let selectedRarity = $state<ItemRarityStyleKind>('unique');
  let selectedRarityTier = $state<Exclude<TierRank, 'HIDE'>>('S');

  const visibleRanks = TIER_RANKS.filter(r => r.id !== 'HIDE') as {
    id: Exclude<TierRank, 'HIDE'>;
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
  }[];

  const activeTierStyle = $derived(effectiveTierStyle(selectedTier, config));
  const activeRarityMeta = $derived(
    EDITABLE_RARITY_STYLES.find(r => r.id === selectedRarity) ?? EDITABLE_RARITY_STYLES[0]
  );
  const activeRarityStyle = $derived(
    effectiveRarityTierStyle(selectedRarityTier, config, undefined, selectedRarity)
  );
  const uniqueCompareStyle = $derived(
    effectiveRarityTierStyle(selectedRarityTier, config, 'uniques', 'unique')
  );
  const setCompareStyle = $derived(
    effectiveRarityTierStyle(selectedRarityTier, config, 'uniques', 'set')
  );
  const hasAnyStyleOverrides = $derived(
    Object.keys(config.tierStyleOverrides).length > 0 ||
      Object.keys(config.categoryTierStyleOverrides).length > 0 ||
      Object.keys(config.rarityTierStyleOverrides ?? {}).length > 0
  );

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }

  function styleToCss(style: TierStyle) {
    const text = cssColor(style.textColor, '#f7f1e3');
    const bg = cssColor(style.backgroundColor, 'rgba(14, 14, 18, 0.88)');
    const border = style.borderColor
      ? `2px solid ${cssColor(style.borderColor, 'transparent')}`
      : '1px solid rgba(188, 167, 125, 0.25)';
    return `color:${text};background:${bg};border:${border}`;
  }

  function selectTheme(themeId: ThemeId) {
    config.theme = themeId;
    onchange();
  }

  function updateGlobalTierStyle(
    tier: Exclude<TierRank, 'HIDE'>,
    patch: Partial<TierStyle>
  ) {
    const current = config.tierStyleOverrides[tier] ?? {};
    const merged: Partial<TierStyle> = { ...current, ...patch };
    for (const k of Object.keys(merged) as (keyof TierStyle)[]) {
      if (merged[k] === undefined) delete merged[k];
    }
    config.tierStyleOverrides = {
      ...config.tierStyleOverrides,
      [tier]: merged
    };
    onchange();
  }

  function updateRarityStyle(
    rarity: ItemRarityStyleKind,
    tier: Exclude<TierRank, 'HIDE'>,
    patch: Partial<TierStyle>
  ) {
    const currentRarityMap = config.rarityTierStyleOverrides?.[rarity] ?? {};
    const currentTier = currentRarityMap[tier] ?? {};
    const merged: Partial<TierStyle> = { ...currentTier, ...patch };
    for (const k of Object.keys(merged) as (keyof TierStyle)[]) {
      if (merged[k] === undefined) delete merged[k];
    }
    config.rarityTierStyleOverrides = {
      ...(config.rarityTierStyleOverrides ?? {}),
      [rarity]: {
        ...currentRarityMap,
        [tier]: merged
      }
    };
    onchange();
  }

  function resetRarityTierStyle(rarity: ItemRarityStyleKind, tier: Exclude<TierRank, 'HIDE'>) {
    const currentRarityMap = { ...(config.rarityTierStyleOverrides?.[rarity] ?? {}) };
    delete currentRarityMap[tier];
    const nextAll = { ...(config.rarityTierStyleOverrides ?? {}) };
    if (Object.keys(currentRarityMap).length === 0) {
      delete nextAll[rarity];
    } else {
      nextAll[rarity] = currentRarityMap;
    }
    config.rarityTierStyleOverrides = nextAll;
    onchange();
  }

  function resetAllStyles() {
    config.tierStyleOverrides = {};
    config.categoryTierStyleOverrides = {};
    config.rarityTierStyleOverrides = {};
    onchange();
  }
</script>

{#snippet minimapShape(shape: string)}
  {#if shape === 'circle'}<circle cx="20" cy="20" r="17" />{:else if shape === 'square'}<rect x="4" y="4" width="32" height="32" />{:else if shape === 'triangle'}<polygon points="20,3 37,36 3,36" />{:else if shape === 'triangleDown'}<polygon points="20,37 3,4 37,4" />{:else if shape === 'star'}<polygon points="20,2 25,14 38,15 28,24 31,38 20,31 9,38 12,24 2,15 15,14" />{:else if shape === 'spark'}<polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" />{:else if shape === 'kite'}<polygon points="20,3 34,15 20,37 6,15" />{:else if shape === 'hexagon'}<polygon points="37,20 28.5,35 11.5,35 3,20 11.5,5 28.5,5" />{:else if shape === 'cross'}<polygon points="14,3 26,3 26,14 37,14 37,26 26,26 26,37 14,37 14,26 3,26 3,14 14,14" />{:else if shape === 'chevron'}<polygon points="20,3 37,24.2 31,32.8 20,18.3 9,32.8 3,24.2" />{:else if shape === 'bullseye'}<circle cx="20" cy="20" r="17" fill="none" /><circle cx="20" cy="20" r="7.65" stroke="none" />{:else}<polygon points="20,2 38,20 20,38 2,20" />{/if}
{/snippet}

<div class="space-y-6">
  <!-- Global Color Themes -->
  <section class="panel rounded-lg p-5 sm:p-6" aria-label="Global color themes">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Global Color Themes</h2>
        <p class="mt-1 text-sm text-parchment-300">
          Switch the aesthetic palette across all tiers at once. Any custom tier tweaks you make below stay layered on top.
        </p>
      </div>
      {#if hasAnyStyleOverrides}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={resetAllStyles}>
          Reset all custom style overrides
        </button>
      {/if}
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {#each Object.values(THEME_PRESETS) as theme (theme.id)}
        {@const isSelected = config.theme === theme.id}
        <button
          type="button"
          class={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
            isSelected
              ? 'border-ember-400 bg-ember-950/20 shadow-md'
              : 'border-parchment-300/20 bg-abyss-950 hover:border-parchment-300/45'
          }`}
          aria-pressed={isSelected}
          onclick={() => selectTheme(theme.id)}
        >
          <div class="flex items-center justify-between gap-1.5">
            <h3 class="truncate text-sm font-bold tracking-tight text-parchment-50">{theme.name}</h3>
            {#if isSelected}
              <span class="shrink-0 rounded bg-ember-500/25 px-1.5 py-0.5 text-[10px] font-semibold text-ember-300">Active</span>
            {/if}
          </div>

          <div class="mt-2.5 space-y-1 rounded border border-parchment-300/15 bg-[#090a0f] p-2">
            {#each (['S', 'A', 'B', 'C', 'D'] as const) as r}
              {@const s = theme.tiers[r]}
              <div class="flex items-center justify-between gap-1.5">
                <span class="text-[10px] font-semibold uppercase text-parchment-300">{r}</span>
                <span class="truncate rounded px-2 py-0.5 font-sans text-[11px] font-semibold" style={styleToCss(s)}>
                  {r === 'S'
                    ? 'Ber Rune'
                    : r === 'A'
                      ? 'Ist Rune'
                      : r === 'B'
                        ? 'Perf Ruby'
                        : r === 'C'
                          ? 'Tal Rune'
                          : 'El Rune'}
                </span>
              </div>
            {/each}
          </div>
        </button>
      {/each}
    </div>
  </section>

  <!-- Tier-by-Tier Global Style & Sound Editor -->
  <section class="panel rounded-lg p-5 sm:p-6" aria-label="Global tier style editor">
    <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Tier Decorators, Minimap Icons & Sounds (Currency &amp; Shared Urgency)</h2>
    <p class="mt-1 text-sm text-parchment-300">
      Controls drop sounds, minimap icon shapes/sizes, and the shared Tier S jackpot background plate across your filter, plus Tier A–D colors for Runes, Orbs, Maps, Gems &amp; Boss tokens. Individual Unique, Set, Base, and Rare colors are configured below so they never collide.
    </p>

    <div class="mt-5 flex flex-wrap gap-2 border-b border-parchment-300/15 pb-4">
      {#each visibleRanks as rank (rank.id)}
        {@const style = effectiveTierStyle(rank.id, config)}
        <button
          type="button"
          class={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors ${
            selectedTier === rank.id
              ? 'border-ember-400 bg-ember-950/30 text-parchment-50'
              : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40'
          }`}
          aria-pressed={selectedTier === rank.id}
          onclick={() => (selectedTier = rank.id)}
        >
          <span class={`rounded border px-1.5 py-0.5 text-[11px] font-bold ${rank.badgeClass}`}>{rank.id}</span>
          <span class="font-medium">{rank.shortLabel}</span>
          {#if style.dropSound}
            <span class="text-xs text-parchment-300">♪ {style.dropSound.replace('Filter', '')}</span>
          {/if}
        </button>
      {/each}
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-12">
      <!-- Live Preview Box -->
      <div class="flex flex-col justify-between rounded-lg border border-parchment-300/20 bg-[#08090d] p-5 lg:col-span-5">
        <div>
          <span class="text-xs uppercase tracking-widest text-parchment-300">Live Ground Label Preview · Tier {selectedTier}</span>
          <div class="mt-6 flex min-h-36 flex-col items-center justify-center gap-3 rounded border border-parchment-300/10 bg-[#050608] p-6">
            {#if activeTierStyle.minimapIcon}
              <svg
                width={Math.max(14, Math.min(44, activeTierStyle.minimapIcon.size))}
                height={Math.max(14, Math.min(44, activeTierStyle.minimapIcon.size))}
                viewBox="0 0 40 40"
                fill={cssColor(activeTierStyle.minimapIcon.fillColor, '#f59e0b')}
                stroke={cssColor(activeTierStyle.minimapIcon.borderColor, '#ffffff')}
                stroke-width="2.5"
              >
                {@render minimapShape(activeTierStyle.minimapIcon.shape)}
              </svg>
            {/if}
            <span class="rounded px-4 py-2 text-center font-sans text-base font-semibold shadow-lg" style={styleToCss(activeTierStyle)}>
              Orb of Corruption
            </span>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-300/15 pt-4 text-xs text-parchment-300">
          <span>
            Sound: <strong class="text-parchment-100">{activeTierStyle.dropSound || 'Original in-game sound'}</strong>
          </span>
          {#if activeTierStyle.dropSound}
            <button
              type="button"
              class="trade-secondary-button !px-3 !py-1 text-xs"
              onclick={() =>
                $soundPreview.playing === activeTierStyle.dropSound
                  ? stopSound()
                  : playSound(activeTierStyle.dropSound!)}
            >
              {$soundPreview.playing === activeTierStyle.dropSound ? '◼ Stop Sound' : `♪ Play ${activeTierStyle.dropSound}`}
            </button>
          {/if}
        </div>
      </div>

      <!-- Color, Icon & Sound Controls -->
      <div class="space-y-5 lg:col-span-7">
        <div class="grid gap-4 sm:grid-cols-3">
          <ColorInput
            label="Tooltip Background"
            value={activeTierStyle.backgroundColor ?? 'RGBA(18, 18, 22, 0.85)'}
            onchange={v => updateGlobalTierStyle(selectedTier, { backgroundColor: v })}
          />
          <ColorInput
            label="Tooltip Border"
            value={activeTierStyle.borderColor ?? 'RGBA(220, 180, 100, 1)'}
            onchange={v => updateGlobalTierStyle(selectedTier, { borderColor: v })}
          />
          <ColorInput
            label="Tooltip Text"
            value={activeTierStyle.textColor ?? 'RGBA(245, 235, 210, 1)'}
            onchange={v => updateGlobalTierStyle(selectedTier, { textColor: v })}
          />
        </div>

        <!-- Minimap Icon Settings -->
        <div class="space-y-3 rounded border border-parchment-300/20 p-4">
          <label class="flex items-center gap-2.5 text-sm font-medium text-parchment-100">
            <input
              type="checkbox"
              checked={!!activeTierStyle.minimapIcon}
              onchange={e =>
                updateGlobalTierStyle(selectedTier, {
                  minimapIcon: e.currentTarget.checked
                    ? {
                        shape: 'star',
                        size: 20,
                        borderColor: 'RGBA(255, 255, 255, 1)',
                        fillColor: activeTierStyle.borderColor || 'RGBA(255, 150, 40, 1)'
                      }
                    : null
                })}
            />
            Show Minimap Icon for Tier {selectedTier}
          </label>
          {#if activeTierStyle.minimapIcon}
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="space-y-1 text-xs text-parchment-300">
                <span>Icon Shape</span>
                <select
                  class="field"
                  value={activeTierStyle.minimapIcon.shape}
                  onchange={e =>
                    updateGlobalTierStyle(selectedTier, {
                      minimapIcon: { ...activeTierStyle.minimapIcon!, shape: e.currentTarget.value }
                    })}
                >
                  {#each M.MINIMAP_SHAPES as shape}
                    <option value={shape}>{shape}</option>
                  {/each}
                </select>
              </label>
              <label class="space-y-1 text-xs text-parchment-300">
                <span>Icon Size (4–128 px)</span>
                <input
                  type="number"
                  min="4"
                  max="128"
                  class="field"
                  value={activeTierStyle.minimapIcon.size}
                  oninput={e =>
                    updateGlobalTierStyle(selectedTier, {
                      minimapIcon: {
                        ...activeTierStyle.minimapIcon!,
                        size: Math.max(4, Math.min(128, Math.round(Number(e.currentTarget.value) || 20)))
                      }
                    })}
                />
              </label>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <ColorInput
                label="Icon Border"
                value={activeTierStyle.minimapIcon.borderColor}
                onchange={v =>
                  updateGlobalTierStyle(selectedTier, {
                    minimapIcon: { ...activeTierStyle.minimapIcon!, borderColor: v }
                  })}
              />
              <ColorInput
                label="Icon Fill"
                value={activeTierStyle.minimapIcon.fillColor}
                onchange={v =>
                  updateGlobalTierStyle(selectedTier, {
                    minimapIcon: { ...activeTierStyle.minimapIcon!, fillColor: v }
                  })}
              />
            </div>
          {/if}
        </div>

        <SoundPicker
          value={activeTierStyle.dropSound || undefined}
          onchange={v => updateGlobalTierStyle(selectedTier, { dropSound: v ?? '' })}
        />
      </div>
    </div>
  </section>

  <!-- Individual D2R Item Rarity Colors (Unique, Set, Base, Rare, Crafted, Magic) -->
  <section class="panel rounded-lg p-5 sm:p-6" aria-label="Individual item rarity colors">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-parchment-50">D2R Item Rarity Colors (Unique, Set, Base &amp; Rare)</h2>
        <p class="mt-1 text-sm text-parchment-300">
          Customize each D2R item rarity individually at every tier. In Tier S, Uniques and Sets share your active theme's jackpot plate background by default with distinct Sanctuary Gold vs. Emerald Green borders, text, and minimap stars — and you can override any color or background per rarity below.
        </p>
      </div>
      {#if config.rarityTierStyleOverrides?.[selectedRarity]?.[selectedRarityTier]}
        <button
          type="button"
          class="trade-secondary-button !py-1.5 text-xs"
          onclick={() => resetRarityTierStyle(selectedRarity, selectedRarityTier)}
        >
          Reset {activeRarityMeta.shortLabel} Tier {selectedRarityTier} to default
        </button>
      {/if}
    </div>

    <!-- Rarity Selector Tabs -->
    <div class="mt-5 flex flex-wrap gap-2">
      {#each EDITABLE_RARITY_STYLES as r (r.id)}
        {@const hasOverride = Boolean(config.rarityTierStyleOverrides?.[r.id] && Object.keys(config.rarityTierStyleOverrides[r.id]!).length > 0)}
        <button
          type="button"
          class={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors ${
            selectedRarity === r.id
              ? 'border-ember-400 bg-ember-950/30 text-parchment-50'
              : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40'
          }`}
          aria-pressed={selectedRarity === r.id}
          onclick={() => (selectedRarity = r.id)}
        >
          <span class={`rounded border px-1.5 py-0.5 text-[11px] font-bold ${r.badgeClass}`}>{r.shortLabel}</span>
          <span class="font-medium">{r.label}</span>
          {#if hasOverride}
            <span class="rounded bg-ember-500/25 px-1.5 py-0.5 text-[10px] font-semibold text-ember-300">Edited</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Tier Selector Pills for Selected Rarity -->
    <div class="mt-3 flex flex-wrap gap-2 border-b border-parchment-300/15 pb-4">
      {#each visibleRanks as rank (rank.id)}
        {@const rStyle = effectiveRarityTierStyle(rank.id, config, undefined, selectedRarity)}
        {@const tierEdited = Boolean(config.rarityTierStyleOverrides?.[selectedRarity]?.[rank.id])}
        <button
          type="button"
          class={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
            selectedRarityTier === rank.id
              ? 'border-ember-400 bg-ember-950/30 text-parchment-50'
              : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40'
          }`}
          aria-pressed={selectedRarityTier === rank.id}
          onclick={() => (selectedRarityTier = rank.id)}
        >
          <span class={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${rank.badgeClass}`}>{rank.id}</span>
          <span class="font-medium">{rank.shortLabel}</span>
          {#if rStyle.dropSound}
            <span class="text-[11px] text-parchment-300">♪ {rStyle.dropSound.replace('Filter', '')}</span>
          {/if}
          {#if tierEdited}
            <span class="text-[10px] font-bold text-ember-300">●</span>
          {/if}
        </button>
      {/each}
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-12">
      <!-- Live Ground Preview (shows Unique vs Set side-by-side when editing Unique or Set!) -->
      <div class="flex flex-col justify-between rounded-lg border border-parchment-300/20 bg-[#08090d] p-5 lg:col-span-5">
        <div>
          <span class="text-xs uppercase tracking-widest text-parchment-300">
            Live Ground Placard Preview · {activeRarityMeta.shortLabel} · Tier {selectedRarityTier}
          </span>

          {#if selectedRarity === 'unique' || selectedRarity === 'set'}
            <div class="mt-5 grid gap-3 rounded border border-parchment-300/10 bg-[#050608] p-5 sm:grid-cols-2">
              <div class={`flex flex-col items-center justify-center gap-2 rounded p-3 ${selectedRarity === 'unique' ? 'ring-1 ring-amber-400/50 bg-white/[0.02]' : 'opacity-80'}`}>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Unique · Tier {selectedRarityTier}</span>
                {#if uniqueCompareStyle.minimapIcon}
                  <svg
                    width={Math.max(14, Math.min(36, uniqueCompareStyle.minimapIcon.size))}
                    height={Math.max(14, Math.min(36, uniqueCompareStyle.minimapIcon.size))}
                    viewBox="0 0 40 40"
                    fill={cssColor(uniqueCompareStyle.minimapIcon.fillColor, '#ffd24b')}
                    stroke={cssColor(uniqueCompareStyle.minimapIcon.borderColor, '#ffffff')}
                    stroke-width="2.5"
                  >
                    {@render minimapShape(uniqueCompareStyle.minimapIcon.shape)}
                  </svg>
                {/if}
                <span class="rounded px-3 py-1.5 text-center font-sans text-xs font-semibold shadow-lg" style={styleToCss(uniqueCompareStyle)}>
                  Shako [E] (86)
                </span>
              </div>

              <div class={`flex flex-col items-center justify-center gap-2 rounded p-3 ${selectedRarity === 'set' ? 'ring-1 ring-emerald-400/50 bg-white/[0.02]' : 'opacity-80'}`}>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">Set · Tier {selectedRarityTier}</span>
                {#if setCompareStyle.minimapIcon}
                  <svg
                    width={Math.max(14, Math.min(36, setCompareStyle.minimapIcon.size))}
                    height={Math.max(14, Math.min(36, setCompareStyle.minimapIcon.size))}
                    viewBox="0 0 40 40"
                    fill={cssColor(setCompareStyle.minimapIcon.fillColor, '#37ff73')}
                    stroke={cssColor(setCompareStyle.minimapIcon.borderColor, '#ffffff')}
                    stroke-width="2.5"
                  >
                    {@render minimapShape(setCompareStyle.minimapIcon.shape)}
                  </svg>
                {/if}
                <span class="rounded px-3 py-1.5 text-center font-sans text-xs font-semibold shadow-lg" style={styleToCss(setCompareStyle)}>
                  Lacquered Plate [E] (86)
                </span>
              </div>
            </div>
          {:else}
            <div class="mt-5 flex min-h-36 flex-col items-center justify-center gap-3 rounded border border-parchment-300/10 bg-[#050608] p-6">
              {#if activeRarityStyle.minimapIcon}
                <svg
                  width={Math.max(14, Math.min(44, activeRarityStyle.minimapIcon.size))}
                  height={Math.max(14, Math.min(44, activeRarityStyle.minimapIcon.size))}
                  viewBox="0 0 40 40"
                  fill={cssColor(activeRarityStyle.minimapIcon.fillColor, '#ffffff')}
                  stroke={cssColor(activeRarityStyle.minimapIcon.borderColor, '#ffffff')}
                  stroke-width="2.5"
                >
                  {@render minimapShape(activeRarityStyle.minimapIcon.shape)}
                </svg>
              {/if}
              <span class="rounded px-4 py-2 text-center font-sans text-base font-semibold shadow-lg" style={styleToCss(activeRarityStyle)}>
                {activeRarityMeta.sampleDrop}
              </span>
            </div>
          {/if}
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-300/15 pt-4 text-xs text-parchment-300">
          <span>
            Sound: <strong class="text-parchment-100">{activeRarityStyle.dropSound || 'Original in-game sound'}</strong>
          </span>
          {#if activeRarityStyle.dropSound}
            <button
              type="button"
              class="trade-secondary-button !px-3 !py-1 text-xs"
              onclick={() =>
                $soundPreview.playing === activeRarityStyle.dropSound
                  ? stopSound()
                  : playSound(activeRarityStyle.dropSound!)}
            >
              {$soundPreview.playing === activeRarityStyle.dropSound ? '◼ Stop Sound' : `♪ Play ${activeRarityStyle.dropSound}`}
            </button>
          {/if}
        </div>
      </div>

      <!-- Individual Rarity Color, Icon & Sound Controls -->
      <div class="space-y-5 lg:col-span-7">
        <div class="grid gap-4 sm:grid-cols-3">
          <ColorInput
            label="Placard Background"
            value={activeRarityStyle.backgroundColor ?? 'RGBA(18, 18, 22, 0.85)'}
            onchange={v => updateRarityStyle(selectedRarity, selectedRarityTier, { backgroundColor: v })}
          />
          <ColorInput
            label="Placard Border"
            value={activeRarityStyle.borderColor ?? 'RGBA(242, 178, 58, 1)'}
            onchange={v => updateRarityStyle(selectedRarity, selectedRarityTier, { borderColor: v })}
          />
          <ColorInput
            label="Placard Text"
            value={activeRarityStyle.textColor ?? 'RGBA(255, 212, 118, 1)'}
            onchange={v => updateRarityStyle(selectedRarity, selectedRarityTier, { textColor: v })}
          />
        </div>

        <div class="space-y-3 rounded border border-parchment-300/20 p-4">
          <label class="flex items-center gap-2.5 text-sm font-medium text-parchment-100">
            <input
              type="checkbox"
              checked={!!activeRarityStyle.minimapIcon}
              onchange={e =>
                updateRarityStyle(selectedRarity, selectedRarityTier, {
                  minimapIcon: e.currentTarget.checked
                    ? {
                        shape: 'star',
                        size: 20,
                        borderColor: 'RGBA(255, 255, 255, 1)',
                        fillColor: activeRarityStyle.borderColor || 'RGBA(242, 178, 58, 1)'
                      }
                    : null
                })}
            />
            Show Minimap Icon for {activeRarityMeta.shortLabel} · Tier {selectedRarityTier}
          </label>
          {#if activeRarityStyle.minimapIcon}
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="space-y-1 text-xs text-parchment-300">
                <span>Icon Shape</span>
                <select
                  class="field"
                  value={activeRarityStyle.minimapIcon.shape}
                  onchange={e =>
                    updateRarityStyle(selectedRarity, selectedRarityTier, {
                      minimapIcon: { ...activeRarityStyle.minimapIcon!, shape: e.currentTarget.value }
                    })}
                >
                  {#each M.MINIMAP_SHAPES as shape}
                    <option value={shape}>{shape}</option>
                  {/each}
                </select>
              </label>
              <label class="space-y-1 text-xs text-parchment-300">
                <span>Icon Size (4–128 px)</span>
                <input
                  type="number"
                  min="4"
                  max="128"
                  class="field"
                  value={activeRarityStyle.minimapIcon.size}
                  oninput={e =>
                    updateRarityStyle(selectedRarity, selectedRarityTier, {
                      minimapIcon: {
                        ...activeRarityStyle.minimapIcon!,
                        size: Math.max(4, Math.min(128, Math.round(Number(e.currentTarget.value) || 20)))
                      }
                    })}
                />
              </label>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <ColorInput
                label="Icon Border"
                value={activeRarityStyle.minimapIcon.borderColor}
                onchange={v =>
                  updateRarityStyle(selectedRarity, selectedRarityTier, {
                    minimapIcon: { ...activeRarityStyle.minimapIcon!, borderColor: v }
                  })}
              />
              <ColorInput
                label="Icon Fill"
                value={activeRarityStyle.minimapIcon.fillColor}
                onchange={v =>
                  updateRarityStyle(selectedRarity, selectedRarityTier, {
                    minimapIcon: { ...activeRarityStyle.minimapIcon!, fillColor: v }
                  })}
              />
            </div>
          {/if}
        </div>

        <SoundPicker
          value={activeRarityStyle.dropSound || undefined}
          onchange={v => updateRarityStyle(selectedRarity, selectedRarityTier, { dropSound: v ?? '' })}
        />
      </div>
    </div>
  </section>
</div>
