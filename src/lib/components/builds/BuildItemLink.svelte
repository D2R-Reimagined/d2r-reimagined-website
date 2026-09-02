<script lang="ts">
  import { loadCatalog } from '$lib/catalog-sources';
  import { itemTitle } from '$lib/catalog';
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
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(370, window.innerWidth - 24);
    const height = Math.min(500, window.innerHeight - 100);
    position = { left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      top: Math.max(76, Math.min(rect.bottom + 8, window.innerHeight - height - 12)), width, height };
    open = true;
  }
</script>

<svelte:window onkeydown={event => { if (event.key === 'Escape') { open = false; pinned = false; } }} onscroll={() => { open = false; pinned = false; }} onresize={() => { open = false; pinned = false; }} />
<span class="item-reference">
  <button type="button" bind:this={trigger} class="item-name" aria-expanded={open}
    onmouseenter={show} onfocus={show} onclick={() => { if (pinned) { open = false; pinned = false; } else { pinned = true; show(); } }}>
    {item ? $i18n.t(itemTitle(item, reference.catalog)) : reference.key}
  </button>
  {#if open}
    <span class="item-popover" role="dialog" aria-label={`Item details: ${reference.key}`} tabindex="-1"
      style={`left:${position.left}px;top:${position.top}px;width:${position.width}px;max-height:${position.height}px`}>
      <button type="button" class="close" onclick={() => { trigger.focus(); open = false; pinned = false; }} aria-label="Close item details">×</button>
      {#if item}<CatalogCard {item} slug={reference.catalog} />{:else}<span class="fallback">{error || 'Loading item…'}</span>{/if}
    </span>
  {/if}
</span>

<style>
  .item-name { color:#dec589; text-decoration:underline dotted; text-underline-offset:4px; text-align:left; cursor:pointer; overflow-wrap:anywhere; }
  .item-name:hover { color:#fff0c2; }
  .item-popover { display:block; position:fixed; z-index:70; overflow:auto; background:#121110; border:1px solid #97774a; box-shadow:0 12px 50px #000c; border-radius:8px; font-family:Arial,sans-serif; text-align:left; }
  .item-popover :global(.scroll-card) { content-visibility:visible; contain:none; }
  .close { position:sticky; top:0; float:right; z-index:1; background:#222; border-radius:3px; padding:2px 12px; font-size:24px; }
  .fallback { display:block; padding:2rem; }
</style>
