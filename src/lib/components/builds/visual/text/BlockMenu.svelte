<script lang="ts">
  // Menu opened from a line's grip: turn into, duplicate, delete, move.
  import { onMount, tick } from 'svelte';
  import type { LineType } from '#lib/build-editor/lines.js';
  import Popover from './Popover.svelte';

  let { anchor, line, canMoveUp, canMoveDown, onturn, onduplicate, ondelete, onmove, onclose }: {
    anchor: { left: number; top: number; bottom: number };
    line: { type: LineType; level?: number };
    canMoveUp: boolean; canMoveDown: boolean;
    onturn: (type: LineType, level?: number) => void;
    onduplicate: () => void; ondelete: () => void; onmove: (dir: -1 | 1) => void;
    /** `refocus` is true when the menu closed from the keyboard and the grip should get focus back. */
    onclose: (refocus: boolean) => void;
  } = $props();

  const turnOptions: { label: string; type: LineType; level?: number }[] = [
    { label: 'Text', type: 'paragraph' }, { label: 'Heading 1', type: 'heading', level: 1 }, { label: 'Heading 2', type: 'heading', level: 2 },
    { label: 'Heading 3', type: 'heading', level: 3 }, { label: 'Bulleted list', type: 'bullet' }, { label: 'Numbered list', type: 'numbered' },
    { label: 'Quote', type: 'quote' }, { label: 'Code', type: 'code' }
  ];
  let element = $state<HTMLDivElement>();
  let turning = $state(false);
  let canTurn = $derived(line.type !== 'rule' && line.type !== 'table');
  const isCurrent = (o: { type: LineType; level?: number }) => o.type === line.type && (o.type !== 'heading' || o.level === line.level);

  const items = () => Array.from(element?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
  onMount(() => { items()[0]?.focus(); });

  async function showTurn() {
    turning = !turning;
    await tick();
    if (turning) element?.querySelector<HTMLButtonElement>('.turn-list [role="menuitem"]')?.focus();
  }
  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onclose(true); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const all = items();
    const i = all.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? all.length - 1 : (i + (event.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length;
    all[next]?.focus();
  }
  function focusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (!next || !element?.contains(next)) onclose(false);
  }
</script>

<Popover {anchor} bind:element class="block-menu" role="menu" aria-label="Line actions" onkeydown={onKeydown} onfocusout={focusOut}>
  <div class="items">
    {#if canTurn}
      <button type="button" role="menuitem" aria-haspopup="true" aria-expanded={turning} onclick={showTurn}>Turn into <span aria-hidden="true">{turning ? '▴' : '▸'}</span></button>
      {#if turning}
        <div class="turn-list" role="group" aria-label="Turn into">
          {#each turnOptions as option}
            <button type="button" role="menuitem" class:current={isCurrent(option)} aria-current={isCurrent(option) || undefined}
              onclick={() => onturn(option.type, option.level)}>{option.label}</button>
          {/each}
        </div>
      {/if}
    {/if}
    <button type="button" role="menuitem" onclick={onduplicate}>Duplicate</button>
    <button type="button" role="menuitem" disabled={!canMoveUp} onclick={() => onmove(-1)}>Move up</button>
    <button type="button" role="menuitem" disabled={!canMoveDown} onclick={() => onmove(1)}>Move down</button>
    <button type="button" role="menuitem" class="danger" onclick={ondelete}>Delete <kbd>Del</kbd></button>
  </div>
</Popover>

<style>
  :global(.block-menu) { width:210px; }
  .items { display:grid; padding:.3rem; }
  button { display:flex; justify-content:space-between; align-items:center; padding:.45rem .6rem; border-radius:5px; text-align:left; color:var(--color-parchment-200); }
  button:hover:not(:disabled), button:focus-visible { background:#ffffff10; color:var(--color-parchment-50); outline:none; }
  button:disabled { opacity:.4; cursor:not-allowed; }
  .turn-list { display:grid; padding:0 0 .25rem .8rem; border-bottom:1px solid #ffffff10; margin-bottom:.25rem; }
  .turn-list button { padding:.3rem .55rem; font-size:13px; }
  .current { color:var(--color-parchment-50); background:#ffffff08; }
  .danger { color:#ff9b85; }
  kbd { font-size:11px; color:var(--color-parchment-300); font-family:inherit; }
</style>
