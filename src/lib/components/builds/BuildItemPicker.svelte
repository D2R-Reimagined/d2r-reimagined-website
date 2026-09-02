<script lang="ts">
  import { loadCatalog } from '$lib/catalog-sources';
  import { itemTitle } from '$lib/catalog';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem } from '$lib/types';
  import type { BuildItemReference } from '$lib/builds';
  let { onchoose }: { onchoose: (reference: BuildItemReference) => void } = $props();
  let catalog = $state<BuildItemReference['catalog']>('uniques');
  let search = $state('');
  let items = $state<CatalogItem[]>([]);
  let error = $state('');
  let loading = $state(false);
  $effect(() => {
    let active = true; loading = true; error = ''; items = [];
    loadCatalog(catalog).then(result => { if (active) items = result; })
      .catch(() => { if (active) error = 'Unable to load items. Select another catalog to retry.'; })
      .finally(() => { if (active) loading = false; });
    return () => { active = false; };
  });
  let results = $derived(items.filter(item => $i18n.t(itemTitle(item, catalog)).toLowerCase().includes(search.toLowerCase())).slice(0, 30));
</script>
<div class="picker">
  <div class="picker-fields"><label>Catalog<select bind:value={catalog}><option value="uniques">Unique items</option><option value="sets">Sets</option><option value="runewords">Runewords</option><option value="bases">Item bases</option></select></label>
    <label>Find an item<input bind:value={search} placeholder="Search item names…" /></label></div>
  {#if error}<p role="alert">{error}</p>{:else if loading}<p>Loading catalog…</p>
  {:else}<div class="results">{#each results as item}<button type="button" onclick={() => onchoose({ catalog, key: String(item.Index ?? item.NameKey ?? '') })}>{$i18n.t(itemTitle(item, catalog))}<span>＋</span></button>{/each}
    {#if !results.length}<p>No items found.</p>{/if}</div>{/if}
</div>
<style>
  .picker { border:1px solid #ffffff18; background:#090909; padding:1rem; border-radius:6px; margin:.8rem 0; font:13px Arial,sans-serif; }
  .picker-fields { display:grid; grid-template-columns:1fr 2fr; gap:.7rem; } label { display:grid; gap:.4rem; color:#bca77d; }
  input,select { min-width:0; width:100%; background:#181716; border:1px solid #ffffff22; border-radius:4px; padding:.65rem; color:#e7deca; }
  .results { display:grid; max-height:230px; overflow:auto; margin-top:.7rem; }
  button { display:flex; justify-content:space-between; text-align:left; padding:.6rem; color:#dbc087; border-bottom:1px solid #ffffff0b; gap:1rem; }
  button:hover { background:#ffffff08; } p { padding:1rem; color:#bca77d; }
  @media(max-width:500px){.picker-fields{grid-template-columns:1fr;}}
</style>
