<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';
  import KeyedLines from './KeyedLines.svelte';

  let {
    item,
    found = false,
    tone = 'unique',
    onchange
  }: { item: CatalogItem; found?: boolean; tone?: 'unique' | 'set'; onchange: (found: boolean) => void } = $props();

  let itemKey = $derived(String(item.Index ?? item.NameKey ?? 'Unknown'));
</script>

<label class="panel scroll-card flex cursor-pointer gap-4 rounded-lg p-4 hover:border-ember-400/45" class:opacity-55={found}>
  <input type="checkbox" checked={found} onchange={(event) => onchange(event.currentTarget.checked)} aria-label={`Mark ${$i18n.t(itemKey)} as found`} class="mt-1 h-5 w-5 shrink-0 rounded border-gray-600 bg-gray-900 text-ember-500 focus:ring-ember-500" />
  <span class="min-w-0">
    <span class:unique-line={tone === 'unique'} class:set-line={tone === 'set'} class="display-text block text-lg">{$i18n.t(itemKey)}</span>
    {#if item.Equipment?.NameKey}<span class="base-line block">{$i18n.t(item.Equipment.NameKey)}</span>{/if}
    {#if item.Runes?.length}<span class="block text-parchment-200">{item.Runes.map((rune) => $i18n.t(rune.NameKey)).join(' + ')}</span>{/if}
    <KeyedLines lines={(item.Lines ?? []).slice(0, 2)} class="property-line mt-1 text-sm" />
  </span>
</label>
