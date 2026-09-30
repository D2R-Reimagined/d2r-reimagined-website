<script lang="ts">
  import SearchableMultiSelect from '$lib/components/SearchableMultiSelect.svelte';
  import { values, type MultiValue } from '$lib/loot-filter/types';
  let { id, label, options, value, onchange, manual = true }: {
    id: string; label: string; options: { value: string; label: string }[];
    value?: MultiValue; onchange: (value: MultiValue | undefined) => void; manual?: boolean;
  } = $props();
  let custom = $state('');
  const selected = $derived(values(value));
  const choices = $derived([...options, ...selected.filter(v => !options.some(o => o.value === v)).map(v => ({ value: v, label: v }))]);
  function change(next: string[]) { onchange(next.length === 0 ? undefined : next.length === 1 ? next[0] : next); }
  function add() {
    if (!custom || selected.includes(custom)) return;
    change([...selected, custom]); custom = '';
  }
</script>

<div class="space-y-2">
  <SearchableMultiSelect {id} {label} options={choices} placeholder="Any" bind:value={() => selected, change} />
  {#if selected.length}
    <div class="flex flex-wrap gap-1">
      {#each selected as item}
        <button type="button" class="max-w-full break-words rounded border border-parchment-300/25 px-2 py-1 text-xs text-parchment-200 hover:border-ember-400" aria-label={`Remove ${label}: ${item}`} onclick={() => change(selected.filter(v => v !== item))}>{item} ×</button>
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
