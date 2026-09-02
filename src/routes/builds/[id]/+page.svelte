<script lang="ts">
  import BuildReader from '$lib/components/builds/BuildReader.svelte';
  let { data } = $props();
</script>
{#key data.details.build.id}<BuildReader initial={data.details} initialVariant={data.variant} />{/key}
