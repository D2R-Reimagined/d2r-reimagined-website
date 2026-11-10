<script lang="ts">
  // The visual (WYSIWYG) build editor. It edits BuildEditor's `content` in place; saving,
  // recovery and publishing stay in BuildEditor. This file owns layout, section operations
  // and undo/redo; each section kind lives in ./sections (see registry.ts).
  import { flushSync, tick, untrack } from 'svelte';
  import { newBlock, type BlockKind, type BuildBlock, type BuildContent } from '#lib/builds.js';
  import type { CharacterDetailsResponse, CharacterResponse } from '#lib/characters.js';
  import type { SkillClass } from '#lib/types.js';
  import { DocumentHistory } from '#lib/build-editor/history.js';
  import { addVariant, blockHasContent, canAddSection, duplicateBlockAt, insertBlock, moveItem, removeVariant } from '#lib/build-editor/document.js';
  import { setVisualEditor } from './context';
  import { startReorder } from './drag';
  import Icon from './ui/Icon.svelte';
  import EssentialsHeader from './EssentialsHeader.svelte';
  import VariantBar from './VariantBar.svelte';
  import OutlineRail from './OutlineRail.svelte';
  import SectionShell from './SectionShell.svelte';
  import InsertBetween from './InsertBetween.svelte';
  import AddSectionGrid from './AddSectionGrid.svelte';
  import './visual.css';

  let { content = $bindable(), activeVariantId = $bindable(''), equipment = $bindable({}), classes, characters, characterError = '',
    skillError = '', busy = false, onchangeclass }: {
    content: BuildContent;
    activeVariantId?: string;
    /** Saved equipment snapshots by block id; copies of a section share their source's entry. */
    equipment?: Record<string, CharacterDetailsResponse>;
    classes: SkillClass[];
    characters: CharacterResponse[];
    characterError?: string;
    skillError?: string;
    /** While saving, undo/redo is ignored so a restore cannot race the save. */
    busy?: boolean;
    /** BuildEditor's class change (confirms, then clears skills, characters and snapshots). */
    onchangeclass: (characterClass: string) => void;
  } = $props();

  const variant = $derived(content.document.variants.find((v) => v.id === activeVariantId) ?? content.document.variants[0]);
  const canAdd = $derived(canAddSection(variant));
  let sectionsList = $state<HTMLDivElement>();
  let drop = $state<number | null>(null);
  let dragFrom = $state<number | null>(null);

  // History: the surface mounts after the draft has loaded, so the first state is the baseline.
  const history = new DocumentHistory(untrack(() => JSON.stringify(content)));
  let canUndo = $state(false);
  let canRedo = $state(false);
  $effect(() => {
    const json = JSON.stringify(content);
    untrack(() => { history.record(json); canUndo = history.canUndo; canRedo = history.canRedo; });
  });
  function restore(json: string | null) {
    if (json === null) return;
    content = JSON.parse(json);
    canUndo = history.canUndo; canRedo = history.canRedo;
  }
  const undo = () => { if (!busy) restore(history.undo()); };
  const redo = () => { if (!busy) restore(history.redo()); };
  function shortcut(event: KeyboardEvent) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    const isUndo = key === 'z' && !event.shiftKey;
    const isRedo = (key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey);
    if (!isUndo && !isRedo) return;
    event.preventDefault(); event.stopPropagation();
    if (isUndo) undo(); else redo();
  }
  // A restore can drop focus to <body>; keep the shortcuts working from there.
  function windowShortcut(event: KeyboardEvent) {
    if (document.activeElement === document.body || document.activeElement === null) shortcut(event);
  }
  /** Runs a structural change as its own undo step, never merged with nearby typing. */
  function step(change: () => void) {
    history.checkpoint();
    flushSync(change);
    history.checkpoint();
  }

  async function focusTitle(id: string, scroll = true) {
    await tick();
    const title = document.querySelector<HTMLTextAreaElement>(`[data-section-title="${id}"]`);
    if (scroll) title?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    title?.focus({ preventScroll: true });
    if (title && scroll) title.select();
  }
  function insertAt(index: number, kind: BlockKind) {
    const block = newBlock(kind);
    let added = false;
    step(() => { added = insertBlock(variant, index, block); });
    if (added) void focusTitle(block.id);
  }
  const indexOf = (block: BuildBlock) => variant.blocks.findIndex((b) => b.id === block.id);
  function duplicate(index: number) {
    let copy: BuildBlock | null = null;
    step(() => { copy = duplicateBlockAt(variant, index, $state.snapshot(variant.blocks[index]) as BuildBlock, equipment); });
    if (copy) void focusTitle((copy as BuildBlock).id);
  }
  function remove(index: number) {
    const block = variant.blocks[index];
    if (blockHasContent(block) && !window.confirm(`Delete “${block.title.trim() || 'Untitled section'}”? You can undo this with Ctrl+Z.`)) return;
    step(() => { variant.blocks.splice(index, 1); });
  }
  async function move(from: number, to: number, refocus = false) {
    const id = variant.blocks[from]?.id;
    step(() => { variant.blocks = moveItem(variant.blocks, from, to); });
    if (refocus && id) { await tick(); document.querySelector<HTMLButtonElement>(`[data-grip="${id}"]`)?.focus(); }
  }
  function gripDown(event: PointerEvent, index: number) {
    startReorder(event, {
      from: index,
      items: () => [...(sectionsList?.querySelectorAll<HTMLElement>(':scope > [data-section]') ?? [])],
      onindicator: (value) => drop = value,
      onmove: (from, to) => move(from, to),
      ondragstart: () => dragFrom = index,
      ondragend: () => dragFrom = null
    });
  }
  function jump(id: string) {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void focusTitle(id, false);
  }

  function addSetup(copy: boolean) {
    step(() => {
      const next = addVariant(content, equipment, copy ? $state.snapshot(variant) as typeof variant : undefined);
      if (next) activeVariantId = next.id;
    });
  }
  function removeSetup() {
    if (!window.confirm(`Remove the “${variant.name}” variant from this draft?`)) return;
    step(() => { const next = removeVariant(content, variant.id); if (next) activeVariantId = next; });
  }
  function changeClass(next: string) { step(() => onchangeclass(next)); }

  setVisualEditor({
    get characterClass() { return content.characterClass; },
    get classes() { return classes; },
    get skillError() { return skillError; },
    get characters() { return characters; },
    get characterError() { return characterError; },
    get equipment() { return equipment; },
    insertAfter: (block, kind) => insertAt(indexOf(block) + 1, kind)
  });
</script>

<svelte:window onkeydown={windowShortcut} />

<div class="ve" role="group" aria-label="Visual build editor" onkeydowncapture={shortcut}>
  <div class="ve-toolbar">
    <span class="ve-beta">Visual editor · beta</span>
    <span class="ve-toolbar-hint">Edit the guide as players will read it. Hover a section for its controls.</span>
    <div class="ve-history">
      <button type="button" class="ve-icon-button" aria-label="Undo" title="Undo (Ctrl+Z)" disabled={!canUndo || busy} onclick={undo}><Icon name="undo" /></button>
      <button type="button" class="ve-icon-button" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" disabled={!canRedo || busy} onclick={redo}><Icon name="redo" /></button>
    </div>
  </div>

  <EssentialsHeader bind:content onchangeclass={changeClass} />
  <VariantBar bind:content bind:activeVariantId onadd={addSetup} onremove={removeSetup} />

  <div class="ve-layout">
    <OutlineRail blocks={variant.blocks} onmove={(from, to) => move(from, to)} onjump={jump} />
    <div class="ve-sections" bind:this={sectionsList}>
      {#each variant.blocks as block, index (block.id)}
        {#if drop === index}<div class="ve-drop" aria-hidden="true"></div>{/if}
        <SectionShell bind:block={variant.blocks[index]} {index} total={variant.blocks.length} {canAdd} dragging={dragFrom === index}
          ongrip={(event) => gripDown(event, index)} onduplicate={() => duplicate(index)} ondelete={() => remove(index)}
          onmove={(delta) => move(index, index + delta, true)} oninsert={(kind) => insertAt(index + 1, kind)} />
        {#if index < variant.blocks.length - 1}<InsertBetween disabled={!canAdd} onpick={(kind) => insertAt(index + 1, kind)} />{/if}
      {/each}
      {#if drop === variant.blocks.length}<div class="ve-drop" aria-hidden="true"></div>{/if}
      <AddSectionGrid count={variant.blocks.length} onpick={(kind) => insertAt(variant.blocks.length, kind)} />
    </div>
  </div>
</div>
