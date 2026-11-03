<script lang="ts">
  import M from '#lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import ColorInput from '../loot-filter/ColorInput.svelte';
  import SoundPicker from '../loot-filter/SoundPicker.svelte';
  import {
    THEME_PRESETS,
    TIER_RANKS,
    effectiveTierStyle,
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

  const visibleRanks = TIER_RANKS.filter(r => r.id !== 'HIDE') as {
    id: Exclude<TierRank, 'HIDE'>;
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
  }[];

  const activeTierStyle = $derived(effectiveTierStyle(selectedTier, config));

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

  function resetAllStyles() {
    config.tierStyleOverrides = {};
    config.categoryTierStyleOverrides = {};
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
      {#if Object.keys(config.tierStyleOverrides).length > 0 || Object.keys(config.categoryTierStyleOverrides).length > 0}
        <button type="button" class="trade-secondary-button !py-1.5 text-xs" onclick={resetAllStyles}>
          Reset all custom style overrides
        </button>
      {/if}
    </div>

    <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {#each Object.values(THEME_PRESETS) as theme (theme.id)}
        {@const isSelected = config.theme === theme.id}
        <button
          type="button"
          class={`flex flex-col justify-between rounded-lg border p-4 text-left transition-all ${
            isSelected
              ? 'border-ember-400 bg-ember-950/20 shadow-md'
              : 'border-parchment-300/20 bg-abyss-950 hover:border-parchment-300/45'
          }`}
          aria-pressed={isSelected}
          onclick={() => selectTheme(theme.id)}
        >
          <div>
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-lg font-bold tracking-tight text-parchment-50">{theme.name}</h3>
              {#if isSelected}
                <span class="rounded bg-ember-500/25 px-2 py-0.5 text-[11px] font-semibold text-ember-300">Active</span>
              {/if}
            </div>
            <p class="mt-1.5 text-xs leading-relaxed text-parchment-300">{theme.description}</p>
          </div>

          <div class="mt-4 space-y-1.5 rounded border border-parchment-300/15 bg-[#090a0f] p-3">
            {#each (['S', 'A', 'B', 'C'] as const) as r}
              {@const s = theme.tiers[r]}
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-semibold uppercase text-parchment-300">Tier {r}</span>
                <span class="rounded px-2.5 py-0.5 font-sans text-xs font-semibold" style={styleToCss(s)}>
                  {r === 'S' ? 'Ber Rune (#30)' : r === 'A' ? 'Ist Rune (#24)' : r === 'B' ? 'Perfect Ruby' : 'Tal Rune (#7)'}
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
    <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Tier Decorators, Minimap Icons & Sounds</h2>
    <p class="mt-1 text-sm text-parchment-300">
      Customize how each tier looks and sounds globally across your entire filter.
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
                    : undefined
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
                        size: Math.max(4, Math.min(128, Number(e.currentTarget.value) || 20))
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
          value={activeTierStyle.dropSound}
          onchange={v => updateGlobalTierStyle(selectedTier, { dropSound: v })}
        />
      </div>
    </div>
  </section>
</div>
