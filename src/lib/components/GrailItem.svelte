<script lang="ts">
  import { Badge } from 'flowbite-svelte';

  import { isDropOnly } from '#lib/catalog.js';
  import { i18n } from '#lib/i18n.js';
  import type { CatalogItem } from '#lib/types.js';
  import { grailTypes } from '#lib/grail-filters.js';
  import KeyedLines from './KeyedLines.svelte';

  let {
    item,
    found = false,
    tone = 'unique',
    onchange,
    ondetails
  }: { item: CatalogItem; found?: boolean; tone?: 'unique' | 'set'; onchange: (found: boolean) => void; ondetails: () => void } = $props();

  let itemKey = $derived(String(item.Index ?? item.NameKey ?? 'Unknown'));
  let dropOnly = $derived(!item.Runes?.length && isDropOnly(item));
</script>

<div class="panel scroll-card flex min-w-0 gap-4 rounded-lg p-4 hover:border-ember-400/45" class:opacity-55={found}>
  <input type="checkbox" checked={found} onchange={(event) => onchange(event.currentTarget.checked)} aria-label={`Mark ${$i18n.t(itemKey)} as found`} class="checkbox mt-1 shrink-0" />
  <button type="button" onclick={ondetails} aria-haspopup="dialog" aria-label={`View ${$i18n.t(itemKey)} details`} class="min-w-0 flex-1 cursor-pointer text-left [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-ember-400">
    <span class:unique-line={tone === 'unique'} class:set-line={tone === 'set'} class="display-text block text-lg">{$i18n.t(itemKey)}</span>
    {#if item.Runes?.length && grailTypes(item).length}<span class="base-line block">{grailTypes(item).map((type) => $i18n.t(type)).join(` ${$i18n.t('label_or')} `)}</span>{/if}
    {#if item.SetName}<span class="set-line block text-sm">{$i18n.t(String(item.SetName))}</span>{/if}
    {#if dropOnly}
      <span class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {#if item.Rarity}<span class="rarity-line min-w-0 text-sm">{$i18n.t('label_rarity', [item.Rarity])}</span>{/if}
        <Badge color="purple" class="ms-auto shrink-0">Drop Only</Badge>
      </span>
    {:else if item.Rarity}<span class="rarity-line block text-sm">{$i18n.t('label_rarity', [item.Rarity])}</span>{/if}
    {#if item.Equipment?.NameKey}<span class="base-line block">{$i18n.t(item.Equipment.NameKey)}</span>{/if}
    {#if item.Runes?.length}<span class="block text-parchment-200">{item.Runes.map((rune) => $i18n.t(rune.NameKey)).join(' + ')}</span>{/if}
    <KeyedLines lines={(item.Lines ?? []).slice(0, 2)} class="property-line mt-1 text-sm" collapsible={false} />
  </button>
</div>
