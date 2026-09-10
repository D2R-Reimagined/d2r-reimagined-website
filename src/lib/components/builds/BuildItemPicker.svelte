<script lang="ts">
  import { loadCatalog } from '$lib/catalog-sources';
  import { searchText } from '$lib/catalog';
  import { buildItemTitle, isCraftRecipe } from '$lib/build-items';
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
  let results = $derived(items.filter(item => (catalog !== 'cube-recipes' || isCraftRecipe(item))
    && (catalog === 'cube-recipes' ? searchText(item, $i18n) : buildItemTitle(item, catalog, $i18n).toLowerCase()).includes(search.toLowerCase())).slice(0, 30));
</script>
<div class="picker panel">
  <div class="picker-fields"><label>Catalog<select class="field" bind:value={catalog}><option value="uniques">Unique items</option><option value="sets">Sets</option><option value="runewords">Runewords</option><option value="bases">Item bases</option><option value="cube-recipes">Crafts</option></select></label>
    <label>Find an item<input class="field" bind:value={search} placeholder="Search item names…" /></label></div>
  {#if error}<p role="alert">{error}</p>{:else if loading}<p>Loading catalog…</p>
  {:else}<div class="results">{#each results as item}<button type="button" onclick={() => onchoose({ catalog, key: String(item.Index ?? item.NameKey ?? '') })}>{buildItemTitle(item, catalog, $i18n)}<span>＋</span></button>{/each}
    {#if !results.length}<p>No items found.</p>{/if}</div>{/if}
</div>
<style>
  .picker {   padding:1rem; border-radius:6px; margin:.8rem 0;   }
  .picker-fields { display:grid; grid-template-columns:1fr 2fr; gap:.7rem; } label { display:grid; gap:.4rem; color:var(--color-parchment-200); }
  input,select { min-width:0; width:100%;  }
  .results { display:grid; max-height:230px; overflow:auto; margin-top:.7rem; }
  button { display:flex; justify-content:space-between; text-align:left; padding:.6rem; color:var(--color-parchment-200); border-bottom:1px solid #ffffff0b; gap:1rem; }
  button:hover { background:#ffffff08; } p { padding:1rem; color:var(--color-parchment-200); }
  @media(max-width:500px){.picker-fields{grid-template-columns:1fr;}}
</style>
