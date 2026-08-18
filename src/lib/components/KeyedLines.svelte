<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { KeyedLine } from '$lib/types';

  let {
    lines = [],
    class: className = 'property-line'
  }: { lines?: KeyedLine[]; class?: string } = $props();

  function chance(line: KeyedLine, siblings: KeyedLine[]): string {
    if (line.chance == null) return '';
    const total = siblings.reduce((sum, sibling) => sum + (sibling.chance ?? 1), 0);
    return total > 0 ? ` (${((line.chance / total) * 100).toFixed(1)}%)` : '';
  }
</script>

{#if lines.length}
  <div class={className}>
    {#each lines as keyedLine}
      {#if keyedLine.children?.length}
        <div class="my-2 rounded border border-parchment-300/20 bg-black/25 p-2">
          {#if keyedLine.code}<p class="mb-1 text-parchment-300">{$i18n.t(keyedLine.code)}</p>{/if}
          {#each keyedLine.children as child}
            <p>{$i18n.line(child)}{chance(child, keyedLine.children)}</p>
          {/each}
        </div>
      {:else if keyedLine.key}
        <p>{$i18n.line(keyedLine)}</p>
      {/if}
    {/each}
  </div>
{/if}
