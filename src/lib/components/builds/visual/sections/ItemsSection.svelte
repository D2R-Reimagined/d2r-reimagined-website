<script lang="ts">
  import { tick } from 'svelte';
  import type { BuildBlock } from '#lib/builds.js';
  import { addItemReference, limits } from '#lib/build-editor/document.js';
  import BuildItemLink from '../../BuildItemLink.svelte';
  import BuildItemPicker from '../../BuildItemPicker.svelte';
  import Icon from '../ui/Icon.svelte';
  import SectionNotes from './SectionNotes.svelte';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  let picking = $state(false);
  let status = $state('');
  let addButton = $state<HTMLButtonElement>();
  let popover = $state<HTMLDivElement>();
  const full = $derived(block.items.length >= limits.items);

  async function open() {
    picking = !picking; status = '';
    await tick();
    popover?.querySelector<HTMLInputElement>('input')?.focus();
  }
  function close() { picking = false; addButton?.focus(); }
  function choose(reference: BuildBlock['items'][number]) {
    status = addItemReference(block.items, reference) ? 'Item added.' : full ? `This section has the maximum of ${limits.items} items.` : 'That item is already in this section.';
  }
</script>

<div class="ve-item-list">
  {#each block.items as reference, index}
    <span class="ve-item-chip">
      <BuildItemLink {reference} />
      <button type="button" class="ve-chip-remove" aria-label={`Remove ${reference.key}`} onclick={() => block.items.splice(index, 1)}><Icon name="close" size={13} /></button>
    </span>
  {/each}
  <button type="button" class="ve-add-chip" bind:this={addButton} aria-expanded={picking} disabled={full}
    title={full ? `At most ${limits.items} items per section` : undefined} onclick={open}><Icon name="plus" size={14} /> Add item</button>
</div>
{#if !block.items.length && !picking}<p class="ve-hint">Add the items this build relies on. Readers can hover them for full details.</p>{/if}
{#if picking}
  <div class="ve-popover" role="dialog" tabindex="-1" aria-label="Add an item" bind:this={popover}
    onkeydown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
    <BuildItemPicker onchoose={choose} />
    <div class="ve-popover-footer"><span role="status">{status}</span><button type="button" class="ve-text-button" onclick={close}>Done</button></div>
  </div>
{/if}
<SectionNotes bind:block />
