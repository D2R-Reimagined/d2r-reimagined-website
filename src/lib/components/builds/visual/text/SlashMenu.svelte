<script lang="ts">
  // Command menu for "/". Focus stays in the line; the line forwards keys via handleKey.
  import { tick } from 'svelte';
  import { filterSlash, slashItems, type SlashItem } from '#lib/build-editor/menus.js';
  import Popover from './Popover.svelte';
  import type { CaretRect } from './dom';

  let { query, anchor, sections = true, onchoose, onclose }: {
    query: string; anchor: CaretRect; sections?: boolean;
    onchoose: (item: SlashItem) => void; onclose: () => void;
  } = $props();

  const id = `slash-${Math.random().toString(36).slice(2, 9)}`;
  let list = $state<HTMLDivElement>();
  let active = $state(0);
  let results = $derived(filterSlash(query, sections ? slashItems : slashItems.filter(item => item.group !== 'Sections')));
  let groups = $derived([...new Set(results.map(item => item.group))]);
  $effect(() => { void query; active = 0; });
  $effect(() => {
    void active;
    void tick().then(() => list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }));
  });

  /** Returns true when the key was used by the menu. */
  export function handleKey(event: KeyboardEvent): boolean {
    if (event.key === 'Escape') { event.preventDefault(); onclose(); return true; }
    if (!results.length) return false;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      return true;
    }
    if ((event.key === 'Enter' && !event.shiftKey) || event.key === 'Tab') {
      event.preventDefault();
      onchoose(results[active]);
      return true;
    }
    return false;
  }
</script>

<Popover {anchor} class="slash-menu" role="listbox" aria-label="Commands" id={id}>
  <div class="scroll" bind:this={list}>
    {#each groups as group}
      <p class="group">{group}</p>
      {#each results as item, i}
        {#if item.group === group}
          <button type="button" role="option" aria-selected={i === active} class:active={i === active} tabindex="-1"
            onmousedown={event => event.preventDefault()} onmousemove={() => { active = i; }} onclick={() => onchoose(item)}>
            <span class="icon" aria-hidden="true">{item.icon}</span>
            <span class="text"><span class="label">{item.label}</span><span class="hint">{item.hint}</span></span>
          </button>
        {/if}
      {/each}
    {:else}
      <p class="empty">No matching commands</p>
    {/each}
  </div>
</Popover>

<style>
  :global(.slash-menu) { width:280px; }
  .scroll { max-height:min(340px, 50vh); overflow:auto; padding:.35rem; }
  .group { padding:.5rem .55rem .25rem; color:var(--color-parchment-300); font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
  button { display:flex; width:100%; align-items:center; gap:.7rem; padding:.4rem .55rem; border-radius:6px; text-align:left; color:var(--color-parchment-200); }
  button.active { background:#ffffff10; color:var(--color-parchment-50); }
  .icon { display:grid; place-items:center; flex:none; width:2rem; height:2rem; border:1px solid #ffffff1a; border-radius:5px; background:#ffffff06; font-size:13px; color:var(--color-parchment-50); }
  .text { display:grid; min-width:0; }
  .label { font-size:14px; }
  .hint { font-size:12px; color:var(--color-parchment-300); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .empty { padding:.75rem; color:var(--color-parchment-300); }
</style>
