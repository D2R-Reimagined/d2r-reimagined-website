<script lang="ts">
  import { onDestroy } from 'svelte';
  import { loadCatalog } from '$lib/catalog-sources';
  import { buildItemTitle } from '$lib/build-items';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';
  import type { BuildItemReference } from '$lib/builds';
  import CatalogCard from '$lib/components/CatalogCard.svelte';

  let { reference }: { reference: BuildItemReference } = $props();
  let item = $state<CatalogItem | null>(null);
  let open = $state(false);
  let error = $state('');
  let trigger: HTMLButtonElement;
  let pinned = $state(false);
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  function cancelClose() {
    clearTimeout(closeTimer);
    closeTimer = undefined;
  }
  function close() {
    cancelClose();
    open = false;
    pinned = false;
  }
  function scheduleClose() {
    cancelClose();
    if (pinned) return;
    // Allow the pointer to cross the gap between the name and the preview.
    closeTimer = setTimeout(() => { if (!pinned) close(); }, 200);
  }
  function leave(event: PointerEvent) {
    if (event.pointerType !== 'touch') scheduleClose();
  }
  function blur(event: FocusEvent) {
    if (!(event.relatedTarget instanceof Node) || !(event.currentTarget as HTMLElement).contains(event.relatedTarget)) {
      scheduleClose();
    }
  }
  function togglePin() {
    cancelClose();
    pinned = !pinned;
  }
  onDestroy(cancelClose);
  let position = $state({ left: 12, top: 80, width: 340, height: 500 });
  $effect(() => {
    let active = true;
    item = null; error = '';
    loadCatalog(reference.catalog).then(items => {
      if (!active) return;
      item = items.find(entry => String(entry.Index ?? entry.NameKey ?? '') === reference.key) ?? null;
      if (!item) error = 'This item is no longer in the current game catalog.';
    }).catch(() => { if (active) error = 'The item catalog could not be loaded.'; });
    return () => { active = false; };
  });
  function show() {
    cancelClose();
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(370, window.innerWidth - 24);
    const height = Math.min(500, window.innerHeight - 100);
    position = { left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      top: Math.max(76, Math.min(rect.bottom + 8, window.innerHeight - height - 12)), width, height };
    open = true;
  }
</script>

<svelte:window onkeydown={event => { if (event.key === 'Escape') close(); }} onscroll={() => { if (!pinned) close(); }} onresize={close} />
<span class="item-reference" role="group" onpointerenter={cancelClose} onpointerleave={leave} onfocusin={cancelClose} onfocusout={blur}>
  <button type="button" bind:this={trigger} class="item-name" aria-expanded={open}
    onmouseenter={show} onfocus={show} onclick={show}>
    {item ? buildItemTitle(item, reference.catalog, $i18n) : reference.key}
  </button>
  {#if open}
    <span class="item-popover" role="dialog" aria-label={`Item details: ${reference.key}`} tabindex="-1"
      style={`left:${position.left}px;top:${position.top}px;width:${position.width}px;max-height:${position.height}px`}>
      <span class="preview-actions">
        <button type="button" class="pin" aria-label={pinned ? 'Unpin item details' : 'Pin item details'} aria-pressed={pinned} onclick={togglePin}>{pinned ? 'Unpin' : 'Pin'}</button>
        <button type="button" class="close" onclick={() => { trigger.focus(); close(); }} aria-label="Close item details">×</button>
      </span>
      {#if item}<CatalogCard {item} slug={reference.catalog} />{:else}<span class="fallback">{error || 'Loading item…'}</span>{/if}
    </span>
  {/if}
</span>

<style>
  .item-name { color:var(--color-parchment-200); text-decoration:underline dotted; text-underline-offset:4px; text-align:left; cursor:pointer; overflow-wrap:anywhere; }
  .item-name:hover { color:var(--color-parchment-50); }
  .item-popover { display:block; position:fixed; z-index:70; overflow:auto; background:var(--color-abyss-850); border:1px solid var(--color-parchment-300); box-shadow:0 12px 50px #000c; border-radius:8px; text-align:left; }
  .item-popover :global(.scroll-card) { content-visibility:visible; contain:none; }
  .preview-actions { position:sticky; top:0; float:right; z-index:1; display:flex; align-items:center; gap:4px; background:#222; border-radius:3px; }
  .preview-actions button { cursor:pointer; padding:4px 10px; }
  .pin { font-size:12px; }
  .pin[aria-pressed="true"] { color:var(--color-parchment-50); background:#594922; }
  .close { font-size:24px; }

  .fallback { display:block; padding:2rem; }
</style>
