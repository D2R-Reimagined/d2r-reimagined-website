<script lang="ts">
  import TradeMarketplace from '$lib/components/TradeMarketplace.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<TradeMarketplace {data} />
