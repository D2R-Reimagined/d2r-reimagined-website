<script lang="ts">
  // One guide section as the reader shows it (number + title + content), plus the controls
  // that follow you: a grip (drag to reorder, click for options) and a "+" in the left gutter.
  // The content itself comes from the section kind's component in the registry.
  import type { BlockKind, BuildBlock } from '#lib/builds.js';
  import { blockIssues, limits } from '#lib/build-editor/document.js';
  import AutoGrow from './ui/AutoGrow.svelte';
  import Icon from './ui/Icon.svelte';
  import Menu from './ui/Menu.svelte';
  import AddSectionMenu from './AddSectionMenu.svelte';
  import { sectionKinds } from './sections/registry';
  import { calloutTones } from './sections/tones';

  let { block = $bindable(), index, total, canAdd, dragging = false, ongrip, onduplicate, ondelete, onmove, oninsert }: {
    block: BuildBlock; index: number; total: number; canAdd: boolean; dragging?: boolean;
    ongrip: (event: PointerEvent) => void; onduplicate: () => void; ondelete: () => void;
    onmove: (delta: -1 | 1) => void; oninsert: (kind: BlockKind) => void;
  } = $props();
  let menuOpen = $state(false);
  let addOpen = $state(false);
  let grip = $state<HTMLButtonElement>();
  let plus = $state<HTMLButtonElement>();
  const Kind = $derived(sectionKinds[block.kind].component);
  const issues = $derived(blockIssues(block));
  const name = $derived(block.title.trim() || 'Untitled section');
  const fullReason = `This setup has the maximum of ${limits.sections} sections`;

  function gripKey(event: KeyboardEvent) {
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
    event.preventDefault();
    if (event.key === 'ArrowUp' && index > 0) onmove(-1);
    if (event.key === 'ArrowDown' && index < total - 1) onmove(1);
  }
</script>

<section id={`section-${block.id}`} class="ve-section" class:callout={block.kind === 'callout'} class:dragging
  data-tone={block.tone} data-section>
  <div class="ve-heading">
    <div class="ve-gutter" class:open={menuOpen || addOpen}>
      <span class="ve-anchor">
        <button type="button" class="ve-grip" bind:this={grip} data-grip={block.id} aria-haspopup="menu" aria-expanded={menuOpen}
          aria-label={`Section options for ${name}. Drag to reorder, or Alt+Arrow keys to move.`} title="Drag to move · click for options"
          onpointerdown={ongrip} onclick={() => menuOpen = !menuOpen} onkeydown={gripKey}>⋮⋮</button>
        <Menu bind:open={menuOpen} anchor={grip} label={`Options for ${name}`}>
          <button type="button" role="menuitem" class="ve-menu-item" disabled={!canAdd} title={canAdd ? undefined : fullReason} onclick={onduplicate}><Icon name="copy" /> Duplicate</button>
          <button type="button" role="menuitem" class="ve-menu-item" disabled={index === 0} onclick={() => onmove(-1)}><Icon name="up" /> Move up</button>
          <button type="button" role="menuitem" class="ve-menu-item" disabled={index === total - 1} onclick={() => onmove(1)}><Icon name="down" /> Move down</button>
          {#if block.kind === 'callout'}
            <p class="ve-menu-label">Callout style</p>
            {#each calloutTones as tone}
              <button type="button" role="menuitemradio" class="ve-menu-item" aria-checked={block.tone === tone.value} onclick={() => block.tone = tone.value}>
                <span class="ve-tone-dot" data-tone={tone.value}></span> {tone.label}
              </button>
            {/each}
          {/if}
          <button type="button" role="menuitem" class="ve-menu-item danger" onclick={ondelete}><Icon name="trash" /> Delete</button>
        </Menu>
      </span>
      <span class="ve-anchor">
        <button type="button" class="ve-plus" bind:this={plus} aria-haspopup="menu" aria-expanded={addOpen} disabled={!canAdd}
          aria-label={`Add a section below ${name}`} title={canAdd ? 'Add a section below' : fullReason} onclick={() => addOpen = !addOpen}><Icon name="plus" size={15} /></button>
        <AddSectionMenu bind:open={addOpen} anchor={plus} onpick={oninsert} />
      </span>
    </div>
    <span class="ve-number">{String(index + 1).padStart(2, '0')}</span>
    <AutoGrow singleLine bind:value={block.title} class="ve-section-title" maxlength={120} placeholder="Untitled section"
      aria-label={`Section ${index + 1} title`} data-section-title={block.id} />
  </div>
  {#if issues.length}<p class="ve-issue">To publish: {issues.join(' ')}</p>{/if}
  <Kind bind:block />
</section>
