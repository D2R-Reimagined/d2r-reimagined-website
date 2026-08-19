<script lang="ts">
  import DataQuickNav from '$lib/components/DataQuickNav.svelte';

  let { children } = $props();
</script>

<DataQuickNav />
{@render children()}
