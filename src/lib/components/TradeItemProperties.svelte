<script lang="ts">
  import { onMount } from 'svelte';
  import type { SaveItem, SaveStat } from '$lib/characters';
  import { i18n } from '$lib/i18n';
  import {
    displayStatLines,
    loadItemStatPresentation,
    type DisplayStatLine,
    type ItemStatPresentationBundle
  } from '$lib/item-stat-presentation';

  let {
    item,
    unidentified = false
  }: {
    item: SaveItem | null;
    unidentified?: boolean;
  } = $props();

  let presentation = $state<ItemStatPresentationBundle>();
  let baseLines = $derived(lines(item?.stats ?? []));
  let runewordLines = $derived(lines(item?.runewordStats ?? []));
  let setBonusLines = $derived((item?.setBonusStats ?? []).map(lines).filter((group) => group.length));
  let scalars = $derived.by(() => {
    if (!item) return [] as string[];
    const values: string[] = [`Item level ${item.itemLevel}`];
    if (item.defense != null) values.push(`Defense ${item.defense}`);
    if (item.maximumDurability != null) values.push(`Durability ${item.durability ?? 0} of ${item.maximumDurability}`);
    if (item.quantity != null) values.push(`Quantity ${item.quantity}`);
    if (item.advancedStashStackSize != null) values.push(`Stack size ${item.advancedStashStackSize}`);
    if (item.sockets.length) values.push(`Socketed ${item.sockets.filter(Boolean).length} of ${item.sockets.length}`);
    return values;
  });

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
      : stats.map((stat) => ({ fallback: fallback(stat), tone: 'magic' }));
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

<section class="mt-4 border-t border-parchment-300/10 pt-3" aria-label="Item properties">
  <p class="text-[0.68rem] uppercase tracking-[0.18em] text-parchment-300">Properties</p>
  {#if unidentified}
    <p class="mt-2 rounded border border-red-500/20 bg-red-950/15 px-3 py-2 text-xs leading-5 text-red-300">Hidden while this item is unidentified.</p>
  {:else if item}
    <div class="mt-2 grid gap-x-5 gap-y-1 text-xs leading-5 sm:grid-cols-2">
      {#each scalars as value}<p class="text-parchment-200">{value}</p>{/each}
      {#each baseLines as line}<p class={tone(line)}>{rendered(line)}</p>{/each}
      {#each runewordLines as line}<p class={tone(line)}>{rendered(line)}</p>{/each}
      {#each setBonusLines as group, index}
        <div class="border-l border-set/25 pl-2 text-set">
          <p class="text-[0.62rem] uppercase tracking-wider">Set bonus {index + 1}</p>
          {#each group as line}<p>{rendered(line)}</p>{/each}
        </div>
      {/each}
    </div>
    {#if scalars.length === 0 && baseLines.length === 0 && runewordLines.length === 0 && setBonusLines.length === 0}
      <p class="mt-2 text-xs text-parchment-300">No additional properties.</p>
    {/if}
  {:else}
    <p class="mt-2 text-xs text-parchment-300">Property data is unavailable.</p>
  {/if}
</section>
