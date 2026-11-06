<script lang="ts">
  import { onMount } from 'svelte';

  import { sellerPresence } from '#lib/seller-presence.js';

  let {
    lastSeenAtUtc,
    showLabel = false
  }: {
    lastSeenAtUtc?: string | null;
    /** Writes the status out beside the orb; otherwise it is only a tooltip. */
    showLabel?: boolean;
  } = $props();

  // Worked out here rather than sent by the API, so a page left open turns grey
  // without asking the API anything.
  let now = $state(Date.now());
  let presence = $derived(sellerPresence(lastSeenAtUtc, now));

  onMount(() => {
    const timer = window.setInterval(() => now = Date.now(), 60_000);
    return () => window.clearInterval(timer);
  });
</script>

<span
  class="inline-block size-2 shrink-0 rounded-full {presence.online ? 'bg-set' : 'bg-parchment-300/40'}"
  role="img"
  aria-label={presence.label}
  title={presence.label}
></span>{#if showLabel}<span class="ml-1.5 text-xs text-parchment-300">{presence.label}</span>{/if}
