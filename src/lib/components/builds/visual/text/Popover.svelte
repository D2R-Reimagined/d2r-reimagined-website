<script lang="ts">
  // Fixed-position layer placed next to an anchor rect and kept inside the viewport.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { placePopover } from './dom';

  type Anchor = { left: number; right?: number; top: number; bottom: number };
  let { anchor, prefer = 'below', align = 'start', element = $bindable(), class: className = '', children, ...rest }: {
    anchor: Anchor; prefer?: 'above' | 'below'; align?: 'start' | 'center'; element?: HTMLDivElement;
    class?: string; children: Snippet;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> = $props();

  let width = $state(0);
  let height = $state(0);
  let vw = $state(1024);
  let vh = $state(768);
  // The site header is sticky (about 64px), so popovers never flip up behind it.
  let placed = $derived(placePopover(anchor, { width, height }, { width: vw, height: vh }, { prefer, align, minTop: 72 }));
</script>

<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} />
<div bind:this={element} bind:offsetWidth={width} bind:offsetHeight={height} {...rest}
  class="visual-popover {className}" style:left="{placed.left}px" style:top="{placed.top}px" style:opacity={width ? 1 : 0}>
  {@render children()}
</div>

<style>
  .visual-popover {
    position:fixed; z-index:60; max-width:calc(100vw - 16px); background:var(--color-abyss-850);
    border:1px solid rgb(188 167 125 / .35); border-radius:8px; box-shadow:0 12px 40px #000b; color:var(--color-parchment-200);
    font-size:14px; line-height:1.4; text-align:left;
  }
</style>
