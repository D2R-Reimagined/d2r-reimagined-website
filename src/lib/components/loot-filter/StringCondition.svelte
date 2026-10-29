<script lang="ts">
  import SearchableMultiSelect from '#lib/components/SearchableMultiSelect.svelte';
  import { values, type MultiValue } from '#lib/loot-filter/types.js';
  type Option = { value: string; label: string; description?: string };
  let { id, label, options, value, onchange, manual = true }: {
    id: string; label: string; options: Option[];
    value?: MultiValue; onchange: (value: MultiValue | undefined) => void; manual?: boolean;
  } = $props();
  let custom = $state('');
  const selected = $derived(values(value));
  const optionByValue = $derived(new Map(options.map(o => [o.value, o])));
  const choices = $derived([...options, ...selected.filter(v => !optionByValue.has(v)).map(v => ({ value: v, label: v }))]);
  function change(next: string[]) { onchange(next.length === 0 ? undefined : next.length === 1 ? next[0] : next); }
  function add() {
    if (!custom || selected.includes(custom)) return;
    change([...selected, custom]); custom = '';
  }
  function hoverText(item: string): string | undefined {
    const match = optionByValue.get(item);
    if (!match) return undefined;
    const text = match.description || match.label;
    return text && text !== item ? text : undefined;
  }
</script>

<div class="space-y-2">
  <SearchableMultiSelect {id} {label} options={choices} placeholder="Any" bind:value={() => selected, change} />
  {#if selected.length}
    <div class="flex flex-wrap gap-1">
      {#each selected as item}
        {@const tip = hoverText(item)}
        <div class="pill-wrapper relative inline-flex max-w-full">
          <button type="button" class="max-w-full break-words rounded border border-parchment-300/25 px-2 py-1 text-xs text-parchment-200 hover:border-ember-400"
            title={tip ?? item} aria-label={`Remove ${label}: ${item}${tip ? ` (${tip})` : ''}`}
            onclick={() => change(selected.filter(v => v !== item))}>{item} ×</button>
          {#if tip}
            <span role="tooltip" class="pill-tooltip pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 w-max max-w-72 rounded border border-parchment-300/35 bg-abyss-950 px-2.5 py-1.5 text-xs leading-snug text-parchment-100 shadow-lg">
              {tip}
            </span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  {#if manual}
    <details class="text-xs text-parchment-300">
      <summary class="cursor-pointer">Enter a custom value</summary>
      <div class="mt-2 flex gap-2">
        <input class="field min-w-0" aria-label={`Custom ${label}`} bind:value={custom} onkeydown={event => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} />
        <button type="button" class="trade-secondary-button" onclick={add}>Add</button>
      </div>
    </details>
  {/if}
</div>

<style>
  .pill-tooltip {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.12s ease, visibility 0.12s ease;
  }
  .pill-wrapper:hover .pill-tooltip,
  .pill-wrapper:focus-within .pill-tooltip {
    opacity: 1;
    visibility: visible;
  }
</style>
