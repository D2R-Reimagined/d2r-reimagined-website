<script lang="ts">
  import { onMount } from 'svelte';
  import type { SaveItem, SaveStat } from '#lib/characters.js';
  import { i18n } from '#lib/i18n.js';
  import {
    displayStatLines,
    loadItemStatPresentation,
    socketedItemStats,
    type DisplayStatLine,
    type ItemStatPresentationBundle
  } from '#lib/item-stat-presentation.js';
  import { lineMatchesHighlights } from '#lib/trade-stat-highlights.js';

  let {
    item,
    unidentified = false,
    compact = false,
    highlights = new Set<string>()
  }: {
    item: SaveItem | null;
    unidentified?: boolean;
    /** Dense listing layout: no heading or divider, one tight list, item level left to the caller. */
    compact?: boolean;
    /** Stats the current search filtered on; matching lines glow. */
    highlights?: Set<string>;
  } = $props();

  type Entry = { text: string; className: string; matched: boolean };

  let presentation = $state<ItemStatPresentationBundle>();
  let baseLines = $derived(lines(item ? socketedItemStats(item) : []));
  let runewordLines = $derived(lines(item?.runewordStats ?? []));
  let setBonusLines = $derived((item?.setBonusStats ?? []).map(lines).filter((group) => group.length));
  let scalars = $derived.by(() => {
    if (!item) return [] as string[];
    const values: string[] = compact ? [] : [`Item level ${item.itemLevel}`];
    if (item.defense != null) values.push(`Defense ${item.defense}`);
    if (!compact && item.maximumDurability != null) values.push(`Durability ${item.durability ?? 0} of ${item.maximumDurability}`);
    if (item.quantity != null) values.push(`Quantity ${item.quantity}`);
    if (item.advancedStashStackSize != null) values.push(`Stack size ${item.advancedStashStackSize}`);
    // An item sent from the game carries its filled-socket count rather than
    // the socketed items themselves.
    const socketed = typeof item.socketedCount === 'number' ? item.socketedCount : item.sockets.filter(Boolean).length;
    if (item.sockets.length) values.push(`Socketed ${socketed} of ${item.sockets.length}`);
    return values;
  });

  // Compact cards flatten everything into one tight list.
  let entries = $derived.by(() => {
    const list: Entry[] = scalars.map((text) => ({ text, className: 'text-parchment-200', matched: false }));
    for (const line of [...baseLines, ...runewordLines]) {
      list.push({ text: rendered(line), className: tone(line), matched: matches(line) });
    }
    return list;
  });
  // Set bonuses only apply with other pieces worn, so they sit behind a hover chip.
  let setBonusMatched = $derived(setBonusLines.some((group) => group.some(matches)));

  function words(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function fallback(stat: SaveStat): string {
    const layer = stat.layer ? ` (layer ${stat.layer})` : '';
    const value = stat.value > 0 ? `+${stat.value}` : String(stat.value);
    return `${words(stat.name)}${layer}: ${value}`;
  }

  function lines(stats: SaveStat[]): DisplayStatLine[] {
    return presentation
      ? displayStatLines(stats, presentation)
      : stats.map((stat) => ({ fallback: fallback(stat), tone: 'magic', sources: [{ name: stat.name, layer: stat.layer }] }));
  }

  function matches(line: DisplayStatLine): boolean {
    return lineMatchesHighlights(line, highlights);
  }

  function rendered(line: DisplayStatLine): string {
    if (!line.keyed) return line.fallback;
    const value = $i18n.line(line.keyed);
    return value === line.keyed.key ? line.fallback : value;
  }

  function tone(line: DisplayStatLine): string {
    if (line.tone === 'enchantment') return 'text-purple-400';
    if (line.tone === 'corrupted') return 'text-red-400';
    if (line.tone === 'flavor') return 'text-parchment-300';
    return 'text-magic';
  }

  onMount(async () => {
    presentation = await loadItemStatPresentation();
  });
</script>

{#snippet setBonuses()}
  {#if setBonusLines.length}
    <!-- Inside the listing link: a tap shows the bonuses instead of opening the listing. -->
    <span class="set-bonus-chip group/set relative mt-1.5 inline-block" tabindex="0" role="button"
          onclick={(event) => { event.preventDefault(); event.stopPropagation(); }}
          onkeydown={(event) => { if (event.key === 'Enter') event.preventDefault(); }}
          aria-label={`${setBonusLines.length} set ${setBonusLines.length === 1 ? 'bonus' : 'bonuses'}`}>
      <span class="rounded border border-set/35 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-set"
            class:stat-match={setBonusMatched}>Set bonuses ({setBonusLines.length}) ▾</span>
      <span class="set-bonus-popover invisible absolute bottom-full left-0 z-30 mb-1 w-72 max-w-[calc(100vw-9rem)] rounded border border-set/35 bg-[#0d0c0c] p-2.5 text-xs leading-[1.35] opacity-0 shadow-xl shadow-black/80 transition group-hover/set:visible group-hover/set:opacity-100 group-focus/set:visible group-focus/set:opacity-100">
        {#each setBonusLines as group, index}
          <span class="block text-[0.62rem] uppercase tracking-wider text-parchment-300" class:mt-1.5={index > 0}>Set bonus {index + 1}</span>
          {#each group as line}<span class="block text-set" class:stat-match={matches(line)}>{rendered(line)}</span>{/each}
        {/each}
      </span>
    </span>
  {/if}
{/snippet}

{#if compact}
  <section class="compact-properties mt-1.5 text-xs" aria-label="Item properties">
    {#if unidentified}
      <p class="rounded border border-red-500/20 bg-red-950/15 px-2 py-1.5 leading-5 text-red-300">Hidden while this item is unidentified.</p>
    {:else if item}
      {#each entries as entry}
        <p class={entry.className} class:stat-match={entry.matched}>{entry.text}</p>
      {:else}
        {#if !setBonusLines.length}<p class="text-parchment-300">No additional properties.</p>{/if}
      {/each}
      {@render setBonuses()}
    {:else}
      <p class="text-parchment-300">Property data is unavailable.</p>
    {/if}
  </section>
{:else}
  <section class="mt-4 border-t border-parchment-300/10 pt-3" aria-label="Item properties">
    <p class="text-[0.68rem] uppercase tracking-[0.18em] text-parchment-300">Properties</p>
    {#if unidentified}
      <p class="mt-2 rounded border border-red-500/20 bg-red-950/15 px-3 py-2 text-xs leading-5 text-red-300">Hidden while this item is unidentified.</p>
    {:else if item}
      <div class="mt-2 grid gap-x-5 gap-y-1 text-xs leading-5 sm:grid-cols-2">
        {#each scalars as value}<p class="text-parchment-200">{value}</p>{/each}
        {#each baseLines as line}<p class={tone(line)} class:stat-match={matches(line)}>{rendered(line)}</p>{/each}
        {#each runewordLines as line}<p class={tone(line)} class:stat-match={matches(line)}>{rendered(line)}</p>{/each}
      </div>
      {@render setBonuses()}
      {#if scalars.length === 0 && baseLines.length === 0 && runewordLines.length === 0 && setBonusLines.length === 0}
        <p class="mt-2 text-xs text-parchment-300">No additional properties.</p>
      {/if}
    {:else}
      <p class="mt-2 text-xs text-parchment-300">Property data is unavailable.</p>
    {/if}
  </section>
{/if}

<style>
  .compact-properties { line-height: 1.35; }

  .stat-match {
    color: #fde68a !important;
    text-shadow: 0 0 6px rgb(251 191 36 / 0.85), 0 0 12px rgb(251 191 36 / 0.45);
    background: linear-gradient(90deg, rgb(251 191 36 / 0.16), transparent 85%);
    box-shadow: inset 2px 0 0 rgb(251 191 36 / 0.9);
    padding-left: 0.35rem;
    border-radius: 0.15rem;
  }
</style>
