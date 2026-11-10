<script lang="ts">
  // Notion-style editor for one section body. The lines are the local source of truth;
  // `body` is only written after a real edit, and an outside change (undo, recovery,
  // switching editors) is re-parsed. Bodies the line model cannot reproduce exactly
  // open in a plain Markdown field instead.
  import { onMount, tick, untrack } from 'svelte';
  import type { BlockKind } from '#lib/builds.js';
  import { plainText, type Atom, type RichText } from '#lib/build-editor/inline.js';
  import { isLossless, lineLabels, newLine, parseBody, serializeBody, type EditorLine, type LineType } from '#lib/build-editor/lines.js';
  import {
    applyShortcut, backspaceAtStart, clearFormatting, convertLine, deleteAtEnd, duplicateLine, END, formatState, insertBlock,
    insertReference, lineRich, moveLine, opensTrigger, pasteText, removeLine, reuseIds, setColor, setLink, splitLine,
    toggleFormat, triggerQuery, withRich, type Edit, type Focus, type FormatMark, type FormatState
  } from '#lib/build-editor/commands.js';
  import { filterSlash, slashItems, type SlashItem } from '#lib/build-editor/menus.js';
  import { cellKey, setLineRegistry, type LineHandle } from './context';
  import { adjacentLine, arrowAcross, enterLine, rangeRect, rectAtOffset, type CaretRect } from './dom';
  import RichLine, { type InputInfo } from './RichLine.svelte';
  import TableLine from './TableLine.svelte';
  import SlashMenu from './SlashMenu.svelte';
  import ReferencePicker from './ReferencePicker.svelte';
  import SelectionToolbar from './SelectionToolbar.svelte';
  import BlockMenu from './BlockMenu.svelte';

  let { body = $bindable(''), characterClass, placeholder = "Type '/' for commands", oninsertsection }: {
    body?: string;
    characterClass: string;
    placeholder?: string;
    oninsertsection?: (kind: BlockKind) => void;
  } = $props();

  const startLines = (markdown: string) => { const parsed = parseBody(markdown); return parsed.length ? parsed : [newLine()]; };
  let lastEmitted = untrack(() => body);
  let lossless = $state(untrack(() => isLossless(body)));
  let lines = $state.raw<EditorLine[]>(untrack(() => lossless ? startLines(body) : [newLine()]));

  $effect(() => {
    const value = body;
    untrack(() => {
      if (value === lastEmitted) return;
      lastEmitted = value;
      lossless = isLossless(value);
      if (lossless) lines = reuseIds(lines, startLines(value));
      closeMenus();
    });
  });

  function emit() {
    const markdown = serializeBody(lines);
    lastEmitted = markdown;
    if (markdown !== body) body = markdown;
  }
  function commit(next: EditorLine[], focus?: Focus) {
    lines = next;
    emit();
    if (focus) void focusLater(focus);
  }
  const commitEdit = (edit: Edit | null) => { if (edit) commit(edit.lines, edit.focus); };
  const indexOf = (id: string) => lines.findIndex(line => line.id === id);
  const replaceAt = (list: EditorLine[], index: number, ...items: EditorLine[]) => [...list.slice(0, index), ...items, ...list.slice(index + 1)];

  const handles = new Map<string, LineHandle>();
  setLineRegistry({
    register: handle => { handles.set(handle.key, handle); },
    unregister: handle => { if (handles.get(handle.key) === handle) handles.delete(handle.key); },
    get: key => handles.get(key)
  });

  let root = $state<HTMLDivElement>();
  let linesEl = $state<HTMLDivElement>();
  const gripOf = (id: string | null | undefined) => id ? root?.querySelector<HTMLButtonElement>(`[data-grip="${CSS.escape(id)}"]`) ?? undefined : undefined;

  async function focusLater(focus: Focus) {
    await tick();
    const handle = handles.get(focus.cell ? cellKey(focus.id, focus.cell[0], focus.cell[1]) : focus.id);
    if (handle) handle.focusAt(focus.start, focus.end ?? focus.start);
    else root?.querySelector<HTMLElement>(`[data-line-id="${CSS.escape(focus.id)}"] [data-visual-line]`)?.focus();
  }

  // -------------------------------------------------------------------------
  // Typing, keys and paste.

  function lineChange(id: string, rich: RichText, info: InputInfo) {
    const index = indexOf(id);
    if (index < 0) return;
    const next = replaceAt(lines, index, withRich(lines[index], rich));
    if (info.inputType === 'insertText' && info.caret !== null) {
      const shortcut = applyShortcut(next, index, info.caret);
      if (shortcut) { closeMenus(); commit(shortcut.lines, shortcut.focus); return; }
    }
    lines = next;
    emit();
    updateTrigger(id, next[index], rich, info);
  }

  function lineKey(event: KeyboardEvent, id: string, handle: LineHandle) {
    const index = indexOf(id);
    if (index < 0) return;
    if (trigger?.id === id && (trigger.kind === 'slash' ? slashMenu?.handleKey(event) : pickerRef?.handleKey(event))) return;
    const mod = event.ctrlKey || event.metaKey;
    if (mod && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!handle.code) void requestLink();
      return;
    }
    if (event.altKey && event.key === 'F10') {
      if (toolbar) { event.preventDefault(); toolbarRef?.focusBar(); }
      return;
    }
    const sel = handle.selection();
    if (!sel) return;
    const collapsed = sel.start === sel.end;
    switch (event.key) {
      case 'Enter':
        if (mod || event.altKey) return;
        event.preventDefault();
        closeMenus();
        commitEdit(splitLine(lines, index, sel.start, sel.end, event.shiftKey));
        return;
      case 'Backspace':
        if (!collapsed || sel.start !== 0) return;
        event.preventDefault();
        commitEdit(backspaceAtStart(lines, index));
        return;
      case 'Delete':
        if (!collapsed || sel.end !== handle.length()) return;
        event.preventDefault();
        commitEdit(deleteAtEnd(lines, index));
        return;
      case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight':
        if (arrowAcross(event, handle.el)) event.preventDefault();
        return;
      case 'Escape':
        // Escape selects the whole line, Notion style; Delete then removes it.
        event.preventDefault();
        toolbar = null;
        gripOf(id)?.focus();
        return;
    }
  }

  function linePaste(id: string, text: string, start: number, end: number) {
    const index = indexOf(id);
    if (index < 0) return;
    closeMenus();
    commitEdit(pasteText(lines, index, start, end, text));
  }

  function ruleKey(event: KeyboardEvent, id: string) {
    const index = indexOf(id);
    const el = event.currentTarget as HTMLElement;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      commitEdit(removeLine(lines, index));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const para = newLine();
      commit([...lines.slice(0, index + 1), para, ...lines.slice(index + 1)], { id: para.id, start: 0 });
    } else if (event.key.startsWith('Arrow') && !event.shiftKey) {
      const dir = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
      const target = adjacentLine(el, dir);
      if (target) { event.preventDefault(); enterLine(target, dir < 0 ? 'end' : 'start'); }
    }
  }

  function setRows(id: string, rows: string[][]) {
    const index = indexOf(id);
    if (index >= 0) commit(replaceAt(lines, index, { ...lines[index], rows }));
  }

  function turnLine(id: string, type: LineType, level?: number, select?: { start: number; end: number }) {
    const index = indexOf(id);
    if (index < 0) return;
    if (type === 'rule' || type === 'table') { commitEdit(insertBlock(lines, index, type)); return; }
    commit(replaceAt(lines, index, convertLine(lines[index], type, level)), { id, start: select?.start ?? END, end: select?.end });
  }

  // -------------------------------------------------------------------------
  // "/" commands and "@" references.

  type Trigger = { kind: 'slash' | 'mention'; id: string; at: number; query: string; virtual?: boolean };
  type Picker = { id: string; at: number; target: 'item' | 'skill' };
  let trigger = $state<Trigger | null>(null);
  let picker = $state<Picker | null>(null);
  let anchor = $state<CaretRect | null>(null);
  let slashMenu = $state<SlashMenu>();
  let pickerRef = $state<ReferencePicker>();
  let available = $derived(oninsertsection ? slashItems : slashItems.filter(item => item.group !== 'Sections'));
  const triggerChar = (t: Trigger) => t.virtual ? '' : t.kind === 'slash' ? '/' : '@';

  function closeMenus() { trigger = null; picker = null; anchor = null; }
  function refreshAnchor() {
    const target = trigger ?? picker;
    const handle = target && handles.get(target.id);
    anchor = handle ? rectAtOffset(handle.el, target.at) : null;
  }

  function updateTrigger(id: string, line: EditorLine, rich: RichText, info: InputInfo) {
    if (line.type === 'code') { if (trigger?.id === id) closeMenus(); return; }
    const plain = plainText(rich);
    const caret = info.caret;
    if (trigger && trigger.id === id) {
      const query = caret === null ? null : triggerQuery(plain, trigger.at, caret, triggerChar(trigger));
      // A slash query that matches nothing ends at the next space, so prose like "a / b" keeps flowing.
      const dead = query === null || (trigger.kind === 'slash' && /\s$/.test(query) && !filterSlash(query, available).length);
      if (!dead) { trigger = { ...trigger, query }; refreshAnchor(); return; }
      closeMenus();
    }
    const typed = info.inputType === 'insertText' || info.inputType === 'insertCompositionText';
    const char = caret !== null ? plain[caret - 1] : undefined;
    if (typed && caret !== null && (char === '/' || char === '@') && opensTrigger(plain, caret, char)) {
      picker = null;
      trigger = { kind: char === '/' ? 'slash' : 'mention', id, at: caret - 1, query: '' };
      refreshAnchor();
    }
  }

  function popoverFocused() {
    const active = document.activeElement;
    return !!active && !!root?.contains(active) && !!active.closest('.visual-popover');
  }
  function checkTrigger() {
    if (!trigger || popoverFocused()) return;
    const handle = handles.get(trigger.id);
    const sel = handle?.selection();
    if (!handle || !sel || sel.start !== sel.end || triggerQuery(plainText(handle.rich()), trigger.at, sel.end, triggerChar(trigger)) === null) closeMenus();
  }

  /** Removes the typed "/query" or "@query" from its line. */
  function consumeTrigger(t: Trigger): { lines: EditorLine[]; index: number } | null {
    const index = indexOf(t.id);
    if (index < 0) return null;
    const rich = lineRich(lines[index]);
    const end = Math.min(t.at + triggerChar(t).length + t.query.length, rich.length);
    return { lines: replaceAt(lines, index, withRich(lines[index], [...rich.slice(0, t.at), ...rich.slice(end)])), index };
  }

  async function chooseSlash(item: SlashItem) {
    const t = trigger;
    closeMenus();
    if (!t) return;
    const consumed = consumeTrigger(t);
    if (!consumed) return;
    const { lines: next, index } = consumed;
    const action = item.action;
    if (action.kind === 'line') {
      if (action.type === 'rule' || action.type === 'table') commitEdit(insertBlock(next, index, action.type));
      else commit(replaceAt(next, index, convertLine(next[index], action.type, action.level)), { id: t.id, start: t.at });
    } else if (action.kind === 'reference') {
      commit(next, { id: t.id, start: t.at });
      await tick();
      picker = { id: t.id, at: t.at, target: action.target };
      refreshAnchor();
    } else {
      commit(next, { id: t.id, start: t.at });
      oninsertsection?.(action.block);
    }
  }

  function chooseReference(atom: Atom) {
    const mention = trigger?.kind === 'mention' ? trigger : null;
    const id = mention?.id ?? picker?.id;
    const index = id ? indexOf(id) : -1;
    if (!id || index < 0) { closeMenus(); return; }
    const start = mention ? mention.at : picker!.at;
    const end = mention ? mention.at + 1 + mention.query.length : start;
    const { rich, caret } = insertReference(lineRich(lines[index]), start, end, atom);
    closeMenus();
    commit(replaceAt(lines, index, withRich(lines[index], rich)), { id, start: caret });
  }

  function closePicker(refocus: boolean) {
    const target = trigger ?? picker;
    const offset = target ? target.at + (trigger ? triggerChar(trigger).length + trigger.query.length : 0) : 0;
    closeMenus();
    if (refocus && target) handles.get(target.id)?.focusAt(offset);
  }

  async function addBelow(index: number) {
    const line = lines[index];
    let id = line.id;
    if (line.type !== 'paragraph' || line.text) {
      // An empty paragraph saves as nothing, so this is not an edit yet.
      const created = newLine();
      id = created.id;
      lines = [...lines.slice(0, index + 1), created, ...lines.slice(index + 1)];
    }
    await tick();
    handles.get(id)?.focusAt(0);
    picker = null;
    trigger = { kind: 'slash', id, at: 0, query: '', virtual: true };
    refreshAnchor();
  }

  // -------------------------------------------------------------------------
  // Selection toolbar.

  type Toolbar = {
    key: string; start: number; end: number; rect: { left: number; right: number; top: number; bottom: number };
    state: FormatState; line: { type: LineType; level?: number } | null;
  };
  let toolbar = $state<Toolbar | null>(null);
  let toolbarRef = $state<SelectionToolbar>();
  let toolbarHold = false;
  let selecting = false;

  function updateToolbar() {
    if (toolbarHold) return;
    const sel = document.getSelection();
    if (selecting || !sel || !sel.rangeCount || sel.isCollapsed || !sel.anchorNode) { toolbar = null; return; }
    const node = sel.anchorNode;
    const lineEl = (node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement)?.closest<HTMLElement>('[data-visual-line][data-key]');
    const handle = lineEl && root?.contains(lineEl) ? handles.get(lineEl.dataset.key!) : undefined;
    const offsets = handle?.selection();
    if (!handle || handle.code || !offsets || offsets.start === offsets.end) { toolbar = null; return; }
    const line = lines.find(l => l.id === handle.key);
    toolbar = {
      key: handle.key, start: offsets.start, end: offsets.end, rect: rangeRect(handle.el, offsets.start, offsets.end),
      state: formatState(handle.rich(), offsets.start, offsets.end), line: line ? { type: line.type, level: line.level } : null
    };
  }
  function reflow() {
    const handle = toolbar && handles.get(toolbar.key);
    if (toolbar && handle) toolbar = { ...toolbar, rect: rangeRect(handle.el, toolbar.start, toolbar.end) };
    if (trigger || picker) refreshAnchor();
  }
  function applyToSelection(change: (rich: RichText, start: number, end: number) => RichText) {
    const t = toolbar;
    const handle = t && handles.get(t.key);
    if (!t || !handle) return;
    toolbarHold = false;
    handle.replace(change(handle.rich(), t.start, t.end), { start: t.start, end: t.end });
    updateToolbar();
  }
  function toolbarDone() {
    toolbarHold = false;
    const t = toolbar;
    if (t) handles.get(t.key)?.focusAt(t.start, t.end);
  }
  async function requestLink() {
    updateToolbar();
    if (!toolbar) return;
    await tick();
    void toolbarRef?.openLink();
  }

  onMount(() => {
    const selection = () => { checkTrigger(); updateToolbar(); };
    const release = () => { if (selecting) { selecting = false; updateToolbar(); } };
    document.addEventListener('selectionchange', selection);
    window.addEventListener('scroll', reflow, { capture: true, passive: true });
    window.addEventListener('resize', reflow);
    window.addEventListener('pointerup', release);
    return () => {
      document.removeEventListener('selectionchange', selection);
      window.removeEventListener('scroll', reflow, { capture: true });
      window.removeEventListener('resize', reflow);
      window.removeEventListener('pointerup', release);
    };
  });

  function sectionFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (next && root?.contains(next)) return;
    if (!toolbarHold) toolbar = null;
    closeMenus();
  }

  // -------------------------------------------------------------------------
  // Block handle: +, grip menu and drag to reorder.

  let menu = $state<{ id: string; anchor: { left: number; top: number; bottom: number } } | null>(null);
  let selectedId = $state<string | null>(null);
  let drag = $state<{ id: string; pointerId: number; startY: number; active: boolean; to: number; top: number } | null>(null);
  let menuLine = $derived(menu ? lines.find(line => line.id === menu!.id) : undefined);
  let menuIndex = $derived(menu ? indexOf(menu.id) : -1);

  function openMenu(id: string) {
    const grip = gripOf(id);
    if (!grip) return;
    const r = grip.getBoundingClientRect();
    selectedId = id;
    toolbar = null;
    closeMenus();
    menu = { id, anchor: { left: r.left, top: r.top, bottom: r.bottom } };
  }
  function closeMenu(refocus: boolean) {
    const id = menu?.id;
    menu = null;
    if (refocus && id) gripOf(id)?.focus();
    else selectedId = null;
  }
  async function focusGrip(id: string) { await tick(); gripOf(id)?.focus(); }

  const rows = () => Array.from(linesEl?.querySelectorAll<HTMLElement>(':scope > [data-row]') ?? []);
  function dropIndex(y: number) {
    const all = rows();
    const i = all.findIndex(row => { const r = row.getBoundingClientRect(); return y < r.top + r.height / 2; });
    return i < 0 ? all.length : i;
  }
  function indicatorTop(to: number) {
    const all = rows();
    const last = all.at(-1);
    return all[to] ? all[to].offsetTop : last ? last.offsetTop + last.offsetHeight : 0;
  }
  function gripDown(event: PointerEvent, id: string) {
    if (event.button !== 0) return;
    event.preventDefault();
    try { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); } catch { /* pointer already released */ }
    drag = { id, pointerId: event.pointerId, startY: event.clientY, active: false, to: -1, top: 0 };
  }
  function gripMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.active && Math.abs(event.clientY - drag.startY) < 5) return;
    if (!drag.active) { menu = null; toolbar = null; closeMenus(); }
    const to = dropIndex(event.clientY);
    drag = { ...drag, active: true, to, top: indicatorTop(to) };
    if (event.clientY < 80) window.scrollBy(0, -12);
    else if (event.clientY > window.innerHeight - 40) window.scrollBy(0, 12);
  }
  function gripUp(event: PointerEvent, id: string) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const done = drag;
    drag = null;
    if (!done.active) { openMenu(id); return; }
    const moved = moveLine(lines, indexOf(done.id), done.to);
    if (moved !== lines) commit(moved);
    void focusGrip(done.id);
  }
  function gripKey(event: KeyboardEvent, id: string) {
    const index = indexOf(id);
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      selectedId = null;
      commitEdit(removeLine(lines, index));
    } else if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      moveBy(id, event.key === 'ArrowUp' ? -1 : 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      void focusLater({ id, start: END });
    }
  }
  function moveBy(id: string, dir: -1 | 1) {
    const index = indexOf(id);
    const moved = moveLine(lines, index, dir < 0 ? index - 1 : index + 2);
    if (moved !== lines) commit(moved);
    void focusGrip(id);
  }

  // -------------------------------------------------------------------------

  let numbers = $derived.by(() => { let n = 0; return lines.map(line => line.type === 'numbered' ? ++n : (n = 0)); });
  function placeholderFor(line: EditorLine) {
    switch (line.type) {
      case 'heading': return `Heading ${line.level ?? 1}`;
      case 'bullet': case 'numbered': return 'List';
      case 'quote': return 'Quote';
      case 'code': return 'Code';
      default: return placeholder;
    }
  }
  const listEnd = (i: number) => (lines[i].type === 'bullet' || lines[i].type === 'numbered') && lines[i + 1]?.type !== lines[i].type;
</script>

{#if !lossless}
  <div class="fallback">
    <p class="notice" role="note">This section uses formatting the visual editor can't show exactly, so it opens as Markdown.</p>
    <textarea class="field" aria-label="Section text (Markdown)" rows={Math.min(18, Math.max(4, body.split('\n').length + 1))} value={body}
      oninput={event => { const value = event.currentTarget.value; lastEmitted = value; body = value; }}></textarea>
  </div>
{:else}
  <div class="section-body" bind:this={root} onfocusout={sectionFocusOut}>
    <div class="lines" bind:this={linesEl} role="presentation"
      onpointerdown={event => { if (event.pointerType === 'mouse' && event.button === 0) { selecting = true; toolbar = null; } }}>
      {#each lines as line, i (line.id)}
        <div class="row type-{line.type}" class:first={i === 0} class:list-end={listEnd(i)} class:selected={selectedId === line.id}
          class:dragging={drag?.active && drag.id === line.id} data-row data-line-id={line.id}>
          <div class="handle">
            <button type="button" class="add" aria-label="Add a line below" title="Add a line below"
              onmousedown={event => event.preventDefault()} onclick={() => addBelow(i)}>+</button>
            <button type="button" class="grip" data-grip={line.id} aria-label={`${lineLabels[line.type]} line: open actions, or drag to move`}
              title="Drag to move, click for actions" aria-haspopup="menu" aria-expanded={menu?.id === line.id}
              onpointerdown={event => gripDown(event, line.id)} onpointermove={gripMove} onpointerup={event => gripUp(event, line.id)}
              onpointercancel={() => { drag = null; }} onclick={event => { if (event.detail === 0) openMenu(line.id); }}
              onkeydown={event => gripKey(event, line.id)} onfocus={() => { selectedId = line.id; }}
              onblur={() => { if (menu?.id !== line.id) selectedId = null; }}>⋮⋮</button>
          </div>
          {#if line.type === 'rule'}
            <div class="rule" role="button" tabindex="0" aria-label="Divider. Backspace deletes it." data-visual-line onkeydown={event => ruleKey(event, line.id)}><hr /></div>
          {:else if line.type === 'table'}
            <TableLine id={line.id} rows={line.rows ?? []} onrows={next => setRows(line.id, next)} />
          {:else}
            {#if line.type === 'bullet'}<span class="marker" aria-hidden="true">•</span>{/if}
            {#if line.type === 'numbered'}<span class="marker" aria-hidden="true">{numbers[i]}.</span>{/if}
            <div class="content">
              <RichLine key={line.id} value={line.text} code={line.type === 'code'} placeholder={placeholderFor(line)}
                alwaysPlaceholder={line.type !== 'paragraph' || lines.length === 1}
                label={line.type === 'heading' ? `Heading ${line.level ?? 1}` : lineLabels[line.type]}
                class={line.type === 'heading' ? 'heading' : ''}
                onchange={(rich, info) => lineChange(line.id, rich, info)} onkey={(event, handle) => lineKey(event, line.id, handle)}
                onpaste={(text, start, end) => linePaste(line.id, text, start, end)} />
            </div>
          {/if}
        </div>
      {/each}
      {#if drag?.active}<div class="drop-indicator" style:top="{drag.top}px" aria-hidden="true"></div>{/if}
    </div>

    {#if toolbar}
      <SelectionToolbar bind:this={toolbarRef} rect={toolbar.rect} state={toolbar.state} lineType={toolbar.line}
        onformat={(mark: FormatMark) => applyToSelection((rich, s, e) => toggleFormat(rich, s, e, mark))}
        onlink={href => applyToSelection((rich, s, e) => setLink(rich, s, e, href))}
        oncolor={color => applyToSelection((rich, s, e) => setColor(rich, s, e, color))}
        onclear={() => applyToSelection(clearFormatting)}
        onturn={(type, level) => { const t = toolbar; toolbarHold = false; if (t) turnLine(t.key, type, level, { start: t.start, end: t.end }); }}
        onhold={hold => { toolbarHold = hold; }} ondone={toolbarDone} />
    {/if}
    {#if trigger?.kind === 'slash' && anchor}
      <SlashMenu bind:this={slashMenu} query={trigger.query} {anchor} sections={!!oninsertsection} onchoose={chooseSlash} onclose={() => closePicker(false)} />
    {/if}
    {#if anchor && (trigger?.kind === 'mention' || picker)}
      <ReferencePicker bind:this={pickerRef} {anchor} {characterClass} inline={trigger?.kind === 'mention'} query={trigger?.query ?? ''}
        target={picker?.target ?? 'all'} onchoose={chooseReference} onclose={closePicker} />
    {/if}
    {#if menu && menuLine}
      <BlockMenu anchor={menu.anchor} line={menuLine} canMoveUp={menuIndex > 0} canMoveDown={menuIndex < lines.length - 1}
        onturn={(type, level) => { const id = menu!.id; menu = null; selectedId = null; turnLine(id, type, level); }}
        onduplicate={() => { const index = menuIndex; menu = null; commitEdit(duplicateLine(lines, index)); }}
        ondelete={() => { const index = menuIndex; menu = null; selectedId = null; commitEdit(removeLine(lines, index)); }}
        onmove={dir => { const id = menu!.id; menu = null; moveBy(id, dir); }}
        onclose={closeMenu} />
    {/if}
  </div>
{/if}

<style>
  .section-body {
    --visual-gutter:3.25rem;
    position:relative; min-width:0; padding-left:var(--visual-gutter);
    color:var(--color-parchment-200); line-height:1.8; font-size:15px; overflow-wrap:anywhere;
  }
  .lines { position:relative; }
  .row { position:relative; padding-bottom:1rem; border-radius:4px; --handle-top:0px; }
  .row.selected { background:color-mix(in srgb, var(--color-ember-700) 18%, transparent); }
  .row.dragging { opacity:.45; }

  .handle {
    position:absolute; top:var(--handle-top); left:calc(-1 * var(--visual-gutter)); width:var(--visual-gutter);
    display:flex; justify-content:flex-end; gap:1px; padding-right:.35rem; opacity:0; transition:opacity 100ms ease;
  }
  .row:hover > .handle, .row:focus-within > .handle, .row.selected > .handle { opacity:1; }
  .handle button {
    display:grid; place-items:center; width:22px; height:27px; border-radius:4px; color:var(--color-parchment-300);
    font-size:15px; line-height:1; user-select:none; -webkit-user-select:none;
  }
  .handle button:hover, .handle button:focus-visible { background:#ffffff10; color:var(--color-parchment-50); }
  .handle button:focus-visible { outline:2px solid var(--color-ember-400); outline-offset:0; }
  .handle .grip { cursor:grab; touch-action:none; letter-spacing:-1px; font-size:13px; }
  .handle .grip:active { cursor:grabbing; }

  .content { min-width:0; }
  .row :global(.rich-line:focus-visible) { box-shadow:0 1px 0 0 rgb(228 90 53 / .35); }

  .type-heading { padding:1.3rem 0 .6rem; --handle-top:calc(1.3rem + 2px); }
  .type-heading.first { padding-top:0; --handle-top:2px; }
  .row :global(.rich-line.heading) { font-weight:600; color:var(--color-parchment-50); font-size:1.15em; }

  .type-bullet, .type-numbered { padding:.3rem 0 .3rem 1.8rem; --handle-top:.3rem; }
  .type-bullet.list-end, .type-numbered.list-end { padding-bottom:1.3rem; }
  .marker { position:absolute; left:0; width:1.45rem; text-align:right; top:.3rem; color:var(--color-parchment-200); }

  .type-quote { --handle-top:.5rem; }
  .type-quote .content { border-left:3px solid #b29354; padding:.5rem 1rem; background:#cda9590a; }
  .type-code { --handle-top:1rem; }
  .type-code .content { padding:1rem; background:#080808; font-size:14px; }

  .type-rule { padding:0; --handle-top:calc(1.5rem - 13px); }
  .rule { padding:1.5rem 0; border-radius:4px; cursor:default; }
  .rule:focus { outline:none; }
  .rule:focus-visible, .row.selected .rule { box-shadow:inset 0 0 0 1px var(--color-ember-400); }
  .rule:focus hr { border-color:var(--color-ember-400); }
  hr { border:0; border-top:1px solid #ffffff20; margin:0; }

  .type-table { padding-bottom:0; --handle-top:1rem; }

  .drop-indicator { position:absolute; left:0; right:0; height:2px; margin-top:-1px; background:var(--color-ember-400); border-radius:1px; pointer-events:none; }

  .fallback { display:grid; gap:.6rem; }
  .notice { font-size:13px; line-height:1.5; color:var(--color-parchment-300); padding:.55rem .75rem; border:1px solid rgb(188 167 125 / .25); border-radius:6px; background:#ffffff05; }
  .fallback textarea { font-family:monospace; font-size:14px; line-height:1.6; resize:vertical; }

  @media (max-width:640px) {
    .section-body { --visual-gutter:2.6rem; }
    .handle { padding-right:.2rem; }
    .handle button { width:19px; }
  }
</style>
