<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { isItemIdentified, itemDisplayLabel } from '$lib/item-identification';
  import { itemVariant, type ItemPresentation } from '$lib/item-presentation';
  import { displayStatLines, isHiddenItemStat, type DisplayStatLine, type ItemStatPresentationBundle } from '$lib/item-stat-presentation';
  import type { SaveItem, SaveStat } from '$lib/characters';

  let {
    item,
    presentation,
    itemPresentations,
    statPresentation,
    characterLevel,
    runewordNameKey,
    identifiedName
  }: {
    item: SaveItem;
    presentation?: ItemPresentation;
    itemPresentations: Map<string, ItemPresentation>;
    statPresentation?: ItemStatPresentationBundle;
    characterLevel?: number;
    runewordNameKey?: string;
    identifiedName?: string | null;
  } = $props();
  let variant = $derived(presentation ? itemVariant(item, presentation, itemPresentations) : null);
  let identified = $derived(isItemIdentified(item));

  function words(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function fallbackStatLine(stat: SaveStat): string {
    const layer = stat.layer ? ` (layer ${stat.layer})` : '';
    const value = stat.value > 0 ? `+${stat.value}` : String(stat.value);
    return `${words(stat.name)}${layer}: ${value}`;
  }

  function renderedStatLine(line: DisplayStatLine): string {
    if (!line.keyed) return line.fallback;
    const rendered = $i18n.line(line.keyed);
    return rendered === line.keyed.key ? line.fallback : rendered;
  }

  function statLines(stats: SaveStat[]): DisplayStatLine[] {
    const visibleStats = stats.filter((stat) => !isHiddenItemStat(stat, statPresentation));
    return statPresentation
      ? displayStatLines(visibleStats, statPresentation, { characterLevel })
      : visibleStats.map((stat) => ({ fallback: fallbackStatLine(stat) }));
  }

  function statToneClass(line: DisplayStatLine): string {
    if (line.tone === 'enchantment') return 'text-purple-400';
    if (line.tone === 'corrupted') return 'text-red-400';
    if (line.tone === 'flavor') return 'text-parchment-300';
    return 'text-magic';
  }

  function qualityClass(): string {
    const quality = item.quality.toLowerCase();
    if (quality.includes('unique')) return 'text-unique';
    if (quality.includes('set')) return 'text-set';
    if (quality.includes('magic')) return 'text-magic';
    if (quality.includes('rare') || quality.includes('crafted')) return 'text-yellow-300';
    return 'text-parchment-100';
  }

  function displayName(): string {
    const resolvedVariant = identified && variant?.NameKey ? $i18n.t(variant.NameKey) : null;
    return itemDisplayLabel(item, identifiedName ?? resolvedVariant);
  }

  function scalarProperties(): Array<[string, string]> {
    return Object.entries(item.qualityData?.properties ?? {})
      .filter(([key]) => key !== 'rarePrefixId' && key !== 'rareSuffixId')
      .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
      .map(([key, value]) => [words(key), String(value)]);
  }
</script>

<aside class="item-tooltip pointer-events-none w-full border border-parchment-300/45 bg-black/95 px-4 py-3 text-center shadow-2xl shadow-black/80" role="tooltip">
  <h3 class={`text-lg leading-tight ${qualityClass()}`}>{displayName()}</h3>
  {#if identified && displayName() !== (item.baseName || item.codeText)}
    <p class="mt-0.5 text-sm text-parchment-200">{item.baseName || item.codeText}</p>
  {/if}
  {#if identified}
    <p class="mt-1 text-xs text-parchment-300">{item.quality} · Item level {item.itemLevel}</p>
  {:else}
    <p class="mt-1 text-sm text-red-500">{$i18n.t('ItemStats1b')}</p>
  {/if}

  <div class="mt-2 space-y-0.5 text-sm text-parchment-100">
    {#if item.defense != null}<p>Defense: {item.defense}</p>{/if}
    {#if item.maximumDurability != null}<p>Durability: {item.durability ?? 0} of {item.maximumDurability}</p>{/if}
    {#if item.quantity != null}<p>Quantity: {item.quantity}</p>{/if}
    {#if item.advancedStashStackSize != null}<p>Stack size: {item.advancedStashStackSize}</p>{/if}
    {#if identified && item.runewordId != null}<p class="text-unique">{runewordNameKey ? $i18n.t(runewordNameKey) : 'Runeword'}</p>{/if}
  </div>

  {#if identified && item.stats.length}
    <div class="mt-2 border-t border-parchment-300/20 pt-2 text-sm">
      {#each statLines(item.stats) as line}<p class={statToneClass(line)}>{renderedStatLine(line)}</p>{/each}
    </div>
  {/if}
  {#if identified && item.runewordStats?.length}
    <div class="mt-2 border-t border-parchment-300/20 pt-2 text-sm">
      {#each statLines(item.runewordStats) as line}<p class={statToneClass(line)}>{renderedStatLine(line)}</p>{/each}
    </div>
  {/if}
  {#if identified}
    {#each item.setBonusStats as group, index}
      {#if group.length}
        <div class="mt-2 border-t border-set/25 pt-2 text-sm text-set">
          <p class="mb-1 text-xs uppercase tracking-wider">Set bonus {index + 1}</p>
          {#each statLines(group) as line}<p>{renderedStatLine(line)}</p>{/each}
        </div>
      {/if}
    {/each}
  {/if}

  {#if item.sockets.length}
    <div class="mt-2 border-t border-parchment-300/20 pt-2 text-sm text-parchment-200">
      <p>Socketed ({item.sockets.filter(Boolean).length}/{item.sockets.length})</p>
      {#each item.sockets as socket}
        {#if socket}<p class="text-magic">{socket.baseName || socket.codeText}</p>{/if}
      {/each}
    </div>
  {/if}

  {#if identified && scalarProperties().length}
    <div class="mt-2 border-t border-parchment-300/20 pt-2 text-xs text-parchment-300">
      {#each scalarProperties() as [label, value]}<p>{label}: {value}</p>{/each}
    </div>
  {/if}
</aside>
