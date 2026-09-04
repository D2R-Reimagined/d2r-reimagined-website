<script lang="ts">
  import { onMount } from 'svelte';

  import { getOnlinePlayers } from '$lib/players';

  interface Props {
    /** How often to refresh, in milliseconds. */
    intervalMs?: number;
    /** Renders the count on its own, without the surrounding pill. */
    bare?: boolean;
    /** What one unit is called, for pages that mean something more specific. */
    noun?: string;
  }

  let { intervalMs = 30_000, bare = false, noun = 'player' }: Props = $props();

  let online = $state<number | null>(null);
  let failed = $state(false);

  // A count that has never loaded and a count that is genuinely zero look the
  // same if only the number is kept, and they mean very different things - one
  // is "nobody is playing", the other is "we do not know".
  let loaded = $derived(online !== null);
  let label = $derived(online === 1 ? noun : `${noun}s`);

  onMount(() => {
    let cancelled = false;

    async function refresh(): Promise<void> {
      try {
        const response = await getOnlinePlayers();
        if (cancelled) return;
        online = response.online;
        failed = false;
      } catch {
        if (cancelled) return;
        // The last known count is kept rather than blanked. A refresh that
        // fails does not mean everyone logged off, and showing zero because the
        // request failed would be a lie.
        failed = true;
      }
    }

    void refresh();
    const timer = setInterval(() => void refresh(), intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  });
</script>

{#if bare}
  {#if loaded}<span class="text-parchment-50">{online?.toLocaleString()}</span> {label} online{:else}<span class="text-parchment-300">Counting players…</span>{/if}
{:else}
  <span
    class="inline-flex items-center gap-2 rounded-full border border-parchment-300/20 bg-abyss-900/60 px-3 py-1 text-sm text-parchment-300"
    title={failed ? 'The last count could not be refreshed.' : 'Players connected to the game right now'}
  >
    <span
      class="inline-block size-2 shrink-0 rounded-full {loaded && !failed
        ? online && online > 0
          ? 'bg-set'
          : 'bg-parchment-300/40'
        : 'bg-parchment-300/25'}"
      aria-hidden="true"
    ></span>
    {#if loaded}
      <span><span class="text-parchment-50">{online?.toLocaleString()}</span> {label} online</span>
    {:else}
      <span>Counting players…</span>
    {/if}
  </span>
{/if}
