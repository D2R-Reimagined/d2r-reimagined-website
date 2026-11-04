<script lang="ts">
  import M from '#lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import type { Catalog, Filter } from '#lib/loot-filter/types.js';
  import {
    CATEGORIES,
    generateLootsplosion,
    simulateItemDrop,
    type CategoryId,
    type LootsplosionScenario,
    type SimulatedItem
  } from '#lib/loot-filter/v2-compiler.js';

  let {
    filter,
    catalog,
    onjumpcategory
  }: {
    filter: Filter;
    catalog: Catalog;
    onjumpcategory: (cat: CategoryId) => void;
  } = $props();

  let scenario = $state<LootsplosionScenario>('endgame-map');
  let holdCtrl = $state(false);
  let playAudioOnSelect = $state(true);
  let drops = $state<SimulatedItem[]>(generateLootsplosion('endgame-map'));
  let selectedDropId = $state<string>('sim-m1');

  // Custom single-item tester state
  let testerQuery = $state('');
  let customItem = $state<SimulatedItem | null>(null);

  const evaluatedDrops = $derived(
    drops.map(item => ({
      item,
      result: simulateItemDrop(filter, catalog, item)
    }))
  );

  const shownCount = $derived(evaluatedDrops.filter(d => d.result.show).length);
  const hiddenCount = $derived(evaluatedDrops.length - shownCount);

  const inspectedTarget = $derived.by(() => {
    if (customItem) {
      return {
        item: customItem,
        result: simulateItemDrop(filter, catalog, customItem),
        isCustom: true
      };
    }
    const found = evaluatedDrops.find(d => d.item.id === selectedDropId) ?? evaluatedDrops[0];
    return found ? { ...found, isCustom: false } : null;
  });

  const testerMatches = $derived.by(() => {
    const q = testerQuery.trim().toLocaleLowerCase();
    if (!q) return [];
    return catalog.baseItems
      .filter(b => b.code && `${b.displayName ?? ''} ${b.name} ${b.code}`.toLocaleLowerCase().includes(q))
      .slice(0, 16);
  });

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }

  function labelStyle(res: ReturnType<typeof simulateItemDrop>, dimmed = false) {
    const text = cssColor(res.textColor, '#f7f1e3');
    const bg = cssColor(res.backgroundColor, 'rgba(12, 12, 16, 0.88)');
    const border = res.borderColor
      ? `2px solid ${cssColor(res.borderColor, 'transparent')}`
      : '1px solid rgba(188, 167, 125, 0.25)';
    return `color:${text};background:${bg};border:${border}${dimmed ? ';opacity:0.48' : ''}`;
  }

  function changeScenario(next: LootsplosionScenario) {
    scenario = next;
    customItem = null;
    drops = generateLootsplosion(next);
    selectedDropId = drops[0]?.id ?? '';
  }

  function selectGroundDrop(item: SimulatedItem, sound?: string) {
    customItem = null;
    selectedDropId = item.id;
    if (playAudioOnSelect && sound) void playSound(sound);
  }

  function pickCustomTestItem(base: Catalog['baseItems'][number]) {
    const isEquip = base.kind === 'weapon' || base.kind === 'armor';
    customItem = {
      id: `custom-${base.code}`,
      code: base.code!,
      name: base.displayName || base.name || base.code!,
      baseName: isEquip ? base.name : undefined,
      kind: (base.kind as SimulatedItem['kind']) || 'misc',
      tier: base.tier,
      rarity: isEquip ? 'unique' : 'normal',
      sockets: 0,
      ethereal: false,
      identified: !isEquip,
      itemLevel: 85,
      quantity: 1
    };
    testerQuery = '';
  }
</script>

{#snippet minimapShape(shape: string)}
  {#if shape === 'circle'}<circle cx="20" cy="20" r="17" />{:else if shape === 'square'}<rect x="4" y="4" width="32" height="32" />{:else if shape === 'triangle'}<polygon points="20,3 37,36 3,36" />{:else if shape === 'triangleDown'}<polygon points="20,37 3,4 37,4" />{:else if shape === 'star'}<polygon points="20,2 25,14 38,15 28,24 31,38 20,31 9,38 12,24 2,15 15,14" />{:else if shape === 'spark'}<polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" />{:else if shape === 'kite'}<polygon points="20,3 34,15 20,37 6,15" />{:else if shape === 'hexagon'}<polygon points="37,20 28.5,35 11.5,35 3,20 11.5,5 28.5,5" />{:else if shape === 'cross'}<polygon points="14,3 26,3 26,14 37,14 37,26 26,26 26,37 14,37 14,26 3,26 3,14 14,14" />{:else if shape === 'chevron'}<polygon points="20,3 37,24.2 31,32.8 20,18.3 9,32.8 3,24.2" />{:else if shape === 'bullseye'}<circle cx="20" cy="20" r="17" fill="none" /><circle cx="20" cy="20" r="7.65" stroke="none" />{:else}<polygon points="20,2 38,20 20,38 2,20" />{/if}
{/snippet}

<div class="grid items-start gap-6 lg:grid-cols-12">
  <!-- Left / Main: Ground Drop Canvas -->
  <section class="panel space-y-4 rounded-lg p-4 sm:p-6 lg:col-span-7" aria-label="Ground loot simulator">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Ground Loot Simulator</h2>
        <p class="mt-1 text-sm text-parchment-300">
          Preview how a realistic pile of Reimagined drops looks under your current strictness and custom rules.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="rounded border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-emerald-200">
          {shownCount} Shown
        </span>
        <span class="rounded border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-red-200">
          {hiddenCount} Hidden
        </span>
      </div>
    </div>

    <!-- Scenario Presets & Hold-Ctrl Toggle -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-y border-parchment-300/15 py-3">
      <div class="flex flex-wrap gap-1.5" aria-label="Loot drop scenarios">
        {#each [
          { id: 'endgame-map', label: 'Endgame Tier 6 Map' },
          { id: 'hell-boss', label: 'Hell Boss Kill' },
          { id: 'rune-currency', label: 'Rune & Currency Shower' },
          { id: 'campaign', label: 'Campaign Progression' }
        ] as opt}
          <button
            type="button"
            class={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
              scenario === opt.id
                ? 'border-ember-400 bg-ember-900/40 text-parchment-50'
                : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40'
            }`}
            aria-pressed={scenario === opt.id}
            onclick={() => changeScenario(opt.id as LootsplosionScenario)}
          >
            {opt.label}
          </button>
        {/each}
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs text-parchment-200">
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" bind:checked={holdCtrl} />
          <span>Hold <code>Ctrl</code> / <code>LB</code> (Show {hiddenCount} hidden)</span>
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" bind:checked={playAudioOnSelect} />
          <span>Play sound on click</span>
        </label>
      </div>
    </div>

    <!-- Dark D2R Ground Canvas -->
    <div
      class="relative min-h-[26rem] rounded-lg border border-parchment-300/20 bg-[radial-gradient(ellipse_at_center,_#17151c_0%,_#07070a_100%)] p-5 shadow-inner"
      aria-label="Simulated ground items"
    >
      <div class="flex flex-wrap items-center justify-center gap-3.5 py-4">
        {#each evaluatedDrops as { item, result } (item.id)}
          {#if result.show || holdCtrl}
            {@const isSelected = !customItem && selectedDropId === item.id}
            <button
              type="button"
              class={`group relative flex items-center gap-2 rounded px-3.5 py-1.5 font-sans text-sm font-semibold transition-transform hover:scale-105 ${
                isSelected ? 'ring-2 ring-ember-400 ring-offset-2 ring-offset-[#07070a]' : ''
              } ${!result.show ? 'line-through decoration-red-400/80' : ''}`}
              style={labelStyle(result, !result.show)}
              onclick={() => selectGroundDrop(item, result.dropSound)}
            >
              {#if result.minimapIcon}
                <svg
                  class="shrink-0"
                  width="15"
                  height="15"
                  viewBox="0 0 40 40"
                  fill={cssColor(result.minimapIcon.fillColor, '#f59e0b')}
                  stroke={cssColor(result.minimapIcon.borderColor, '#ffffff')}
                  stroke-width="2.5"
                  aria-hidden="true"
                >
                  {@render minimapShape(result.minimapIcon.shape)}
                </svg>
              {/if}
              <span class="whitespace-pre-line">{result.displayLabel}</span>
              {#if result.dropSound}
                <span class="ml-1 text-[10px] opacity-75">♪</span>
              {/if}
              {#if !result.show}
                <span class="ml-1 rounded bg-red-950/90 px-1 py-0.5 font-sans text-[10px] font-semibold uppercase text-red-300 no-underline">
                  Hidden
                </span>
              {/if}
            </button>
          {/if}
        {/each}
      </div>
      <p class="mt-6 text-center text-xs text-parchment-300/70">
        Click any ground label above to inspect which rule matched it and jump to its Customizer section.
      </p>
    </div>
  </section>

  <!-- Right Column: Rule Inspector & Single-Item Tester -->
  <aside class="panel space-y-5 rounded-lg p-4 sm:p-6 lg:col-span-5" aria-label="Rule inspector and item tester">
    <div>
      <h2 class="text-xl font-bold tracking-tight text-parchment-50">Why Did This Show or Hide?</h2>
      <p class="mt-1 text-xs text-parchment-300">
        Inspect the selected ground drop or search any Reimagined item below to test your filter rules.
      </p>
    </div>

    {#if inspectedTarget}
      {@const { item, result, isCustom } = inspectedTarget}
      <div class="space-y-4 rounded-lg border border-parchment-300/20 bg-abyss-950 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="text-[11px] uppercase tracking-widest text-parchment-300">
              {isCustom ? 'Custom Tested Item' : 'Selected Ground Drop'}
            </span>
            <h3 class="mt-0.5 text-lg font-semibold text-parchment-50">{item.name}</h3>
            <p class="text-xs text-parchment-300">
              Code: <code>{item.code}</code>
              · Rarity: <span class="capitalize">{item.rarity}</span>
              {#if item.tier}· Tier: <span class="capitalize">{item.tier}</span>{/if}
              {#if item.sockets > 0}· {item.sockets} Sockets{/if}
              {#if item.ethereal}· Ethereal{/if}
            </p>
          </div>
          <span
            class={`rounded border px-2.5 py-1 text-xs font-bold uppercase ${
              result.show
                ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-200'
                : 'border-red-500/50 bg-red-950/60 text-red-200'
            }`}
          >
            {result.show ? 'Shown' : 'Hidden'}
          </span>
        </div>

        <!-- Rendered Preview -->
        <div class="flex min-h-20 flex-col items-center justify-center gap-2 rounded border border-parchment-300/15 bg-[#06070a] p-3">
          {#if result.minimapIcon}
            <svg
              width="20"
              height="20"
              viewBox="0 0 40 40"
              fill={cssColor(result.minimapIcon.fillColor, '#f59e0b')}
              stroke={cssColor(result.minimapIcon.borderColor, '#ffffff')}
              stroke-width="2.5"
            >
              {@render minimapShape(result.minimapIcon.shape)}
            </svg>
          {/if}
          <span class="rounded px-3.5 py-1.5 font-sans text-sm font-semibold" style={labelStyle(result)}>
            {result.displayLabel}
          </span>
        </div>

        <!-- Matched Rule Details -->
        <div class="space-y-2 border-t border-parchment-300/15 pt-3 text-xs">
          <div class="flex justify-between gap-2">
            <span class="text-parchment-300">Matched Rule:</span>
            <span class="font-medium text-parchment-100">Rule #{result.matchedRuleIndex + 1}</span>
          </div>
          <p class="rounded border border-parchment-300/15 bg-abyss-900 p-2.5 text-parchment-100">
            {result.matchedRuleName}
          </p>
          {#if result.dropSound}
            <div class="flex items-center justify-between pt-1">
              <span class="text-parchment-300">Drop Alert Sound: <strong>{result.dropSound}</strong></span>
              <button
                type="button"
                class="text-ember-400 hover:underline"
                onclick={() =>
                  $soundPreview.playing === result.dropSound
                    ? stopSound()
                    : playSound(result.dropSound!)}
              >
                {$soundPreview.playing === result.dropSound ? '◼ Stop' : '♪ Preview Sound'}
              </button>
            </div>
          {/if}
          {#if result.matchedCategory}
            {@const catObj = CATEGORIES.find(c => c.id === result.matchedCategory)}
            <button
              type="button"
              class="trade-primary-button mt-2 w-full justify-center text-xs"
              onclick={() => onjumpcategory(result.matchedCategory!)}
            >
              Find in Customizer ({catObj?.name ?? result.matchedCategory}) →
            </button>
          {/if}
        </div>

        <!-- Interactive Property Controls when testing an item -->
        {#if item.kind === 'weapon' || item.kind === 'armor'}
          <div class="space-y-3 border-t border-parchment-300/15 pt-3">
            <p class="text-xs uppercase tracking-widest text-parchment-300">Tweak Drop Properties</p>
            <div class="grid grid-cols-2 gap-2.5 text-xs">
              <label class="space-y-1">
                <span class="text-parchment-300">Rarity</span>
                <select
                  class="field !py-1.5 text-xs"
                  value={item.rarity}
                  onchange={e => {
                    item.rarity = e.currentTarget.value as SimulatedItem['rarity'];
                    if (customItem) customItem = { ...customItem };
                    else drops = [...drops];
                  }}
                >
                  {#each M.RARITIES as r}
                    <option value={r}>{r}</option>
                  {/each}
                </select>
              </label>
              <label class="space-y-1">
                <span class="text-parchment-300">Sockets (0–6)</span>
                <input
                  type="number"
                  min="0"
                  max="6"
                  class="field !py-1.5 text-xs"
                  value={item.sockets}
                  oninput={e => {
                    item.sockets = Math.max(0, Math.min(6, Number(e.currentTarget.value) || 0));
                    if (customItem) customItem = { ...customItem };
                    else drops = [...drops];
                  }}
                />
              </label>
            </div>
            <label class="flex items-center gap-2 text-xs text-parchment-200">
              <input
                type="checkbox"
                checked={item.ethereal}
                onchange={e => {
                  item.ethereal = e.currentTarget.checked;
                  if (customItem) customItem = { ...customItem };
                  else drops = [...drops];
                }}
              />
              Ethereal
            </label>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Search Any Item in Reimagined Catalog -->
    <div class="space-y-2 border-t border-parchment-300/20 pt-4">
      <label class="block text-xs uppercase tracking-widest text-parchment-300">
        Test Any Item From Reimagined Catalog
        <input
          type="search"
          class="field mt-1.5"
          placeholder="Search any rune, orb, map, weapon, or armor…"
          bind:value={testerQuery}
        />
      </label>
      {#if testerMatches.length > 0}
        <div class="max-h-52 space-y-1 overflow-y-auto rounded border border-parchment-300/20 bg-abyss-950 p-2">
          {#each testerMatches as base (base.code)}
            <button
              type="button"
              class="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs hover:bg-ember-950/40"
              onclick={() => pickCustomTestItem(base)}
            >
              <span class="font-medium text-parchment-50">{base.displayName || base.name}</span>
              <span class="text-parchment-300">{base.code} · {base.tier ?? base.kind}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </aside>
</div>
