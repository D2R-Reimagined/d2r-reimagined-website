<script lang="ts">
  import FilterLibrary from '#lib/components/loot-filter/FilterLibrary.svelte';

  let { data } = $props();
  const title = $derived(data.shared ? `${data.shared.name} · Loot Filter | D2R Reimagined` : 'Loot Filter Builder | D2R Reimagined');
  const description = $derived(data.shared
    ? `A ${data.shared.ruleCount}-rule Pyre Loot Filter for D2R Reimagined shared by ${data.shared.authorName}.`
    : 'Create a Pyre Loot Filter using Reimagined item data.');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content={description} />
  <meta property="og:title" content={data.shared ? `${data.shared.name} · Loot Filter` : 'Loot Filter Builder'} />
  <meta property="og:description" content={description} />
</svelte:head>

{#key data.filterId}
  <FilterLibrary linkId={data.filterId} shared={data.shared} sharedError={data.sharedError} />
{/key}
