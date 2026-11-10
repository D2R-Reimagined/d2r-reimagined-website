<script lang="ts">
  // "On this page": click to jump, drag to reorder (wide screens; narrow screens use section grips).
  import type { BuildBlock } from '#lib/builds.js';
  import { startReorder } from './drag';
  let { blocks, onmove, onjump }: {
    blocks: BuildBlock[]; onmove: (from: number, to: number) => void; onjump: (id: string) => void;
  } = $props();
  let list = $state<HTMLDivElement>();
  let drop = $state<number | null>(null);
  let dragFrom = $state<number | null>(null);

  function down(event: PointerEvent, index: number) {
    if (event.pointerType === 'touch' || !window.matchMedia('(min-width: 851px)').matches) return;
    startReorder(event, {
      from: index,
      items: () => [...(list?.querySelectorAll<HTMLElement>('[data-rail-item]') ?? [])],
      onindicator: (value) => drop = value,
      onmove,
      ondragstart: () => dragFrom = index,
      ondragend: () => dragFrom = null
    });
  }
</script>

<nav class="ve-rail" aria-label="On this page">
  <p class="ve-eyebrow">ON THIS PAGE</p>
  <div class="ve-rail-list" bind:this={list}>
    {#each blocks as block, i (block.id)}
      <a href={`#section-${block.id}`} data-rail-item draggable="false" class:drop-before={drop === i} class:dragging={dragFrom === i}
        onpointerdown={(event) => down(event, i)} onclick={(event) => { event.preventDefault(); onjump(block.id); }}>
        <span>{String(i + 1).padStart(2, '0')}</span>{block.title.trim() || 'Untitled section'}
      </a>
    {/each}
    {#if drop === blocks.length}<span class="ve-rail-drop-end" aria-hidden="true"></span>{/if}
  </div>
  {#if !blocks.length}<p class="ve-hint">No sections yet.</p>{/if}
</nav>
