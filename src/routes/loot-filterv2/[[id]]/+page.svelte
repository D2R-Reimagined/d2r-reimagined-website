<script lang="ts">
  import FilterBladeWorkspace from '#lib/components/loot-filter-v2/FilterBladeWorkspace.svelte';

  let { data } = $props();
  const title = $derived(
    data.shared
      ? `${data.shared.name} · Loot Filter Customizer | D2R Reimagined`
      : 'Loot Filter Customizer (v2) | D2R Reimagined'
  );
  const description = $derived(
    data.shared
      ? `A ${data.shared.ruleCount}-rule Pyre Loot Filter for D2R Reimagined shared by ${data.shared.authorName}.`
      : 'Customize your D2R Reimagined Pyre Loot Filter with live strictness presets, drag-and-drop tier lists, themes, and a ground loot simulator.'
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</svelte:head>

{#key data.filterId}
  <FilterBladeWorkspace linkId={data.filterId} shared={data.shared} sharedError={data.sharedError} />
{/key}
