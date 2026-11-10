<script lang="ts" module>
  export interface InputInfo { inputType: string; data: string | null; caret: number | null }
</script>

<script lang="ts">
  // One contenteditable line. It owns its DOM imperatively: the model is rendered with
  // dom.ts, typing is read back from the DOM, and the DOM is only rebuilt when it no
  // longer matches the canonical model (so caret and IME composition stay stable).
  import { mount, onDestroy, onMount, unmount, untrack } from 'svelte';
  import { canonicalInline, deleteRange, insertPlain, insertRich, parseInline, serializeInline, sliceRich, type RichText } from '#lib/build-editor/inline.js';
  import { plainRich, toPlain, toggleFormat, type FormatMark } from '#lib/build-editor/commands.js';
  import BuildItemLink from '../../BuildItemLink.svelte';
  import BuildSkillLink from '../../BuildSkillLink.svelte';
  import { getLineRegistry, type LineHandle } from './context';
  import {
    atomAttr, domSignature, offsetFromPoint, readDom, renderTree, selectionOffsets, setSelectionOffsets, textLength,
    treeSignature, type RNode
  } from './dom';

  let {
    key, value, code = false, singleLine = false, placeholder = '', alwaysPlaceholder = false, label = 'Text',
    class: className = '', cellRow, cellCol, onchange, onkey, onpaste
  }: {
    key: string; value: string; code?: boolean; singleLine?: boolean; placeholder?: string; alwaysPlaceholder?: boolean;
    label?: string; class?: string; cellRow?: number; cellCol?: number;
    onchange?: (rich: RichText, info: InputInfo) => void;
    /** Runs first for every key; call preventDefault to take it over. */
    onkey?: (event: KeyboardEvent, handle: LineHandle) => void;
    /** Takes over paste/drop text; without it text is inserted inline. */
    onpaste?: (text: string, start: number, end: number) => void;
  } = $props();

  let el: HTMLDivElement;
  let model: RichText = [];
  let composing = false;
  const atoms = new Map<Element, Record<string, unknown>>();

  const fromValue = (v: string, raw: boolean): RichText => raw ? plainRich(v) : parseInline(v);
  const normalize = (rich: RichText): RichText => code ? rich.filter(c => !c.atom).map(c => ({ ch: c.ch, marks: {} })) : canonicalInline(rich);

  function build(node: RNode): Node {
    if (node.type === 'text') return document.createTextNode(node.text);
    if (node.type === 'atom') {
      const span = document.createElement('span');
      span.className = 'atom';
      span.contentEditable = 'false';
      span.setAttribute('data-atom', atomAttr(node.atom));
      const atom = node.atom;
      atoms.set(span, atom.kind === 'item'
        ? mount(BuildItemLink, { target: span, props: { reference: { catalog: atom.catalog, key: atom.key } } })
        : mount(BuildSkillLink, { target: span, props: { skillId: atom.skillId, rank: atom.rank } }));
      return span;
    }
    const element = document.createElement(node.tag);
    if (node.tag === 'a') { element.setAttribute('href', node.attr!); element.setAttribute('rel', 'ugc noreferrer'); }
    if (node.tag === 'span') { element.setAttribute('data-color', node.attr!); element.className = 'font-color'; element.style.color = node.attr!; }
    element.append(...node.children.map(build));
    return element;
  }

  /** Unmounts atom components whose element is gone (re-render, or deleted by the browser). */
  function sweepAtoms(all = false) {
    for (const [span, instance] of atoms) {
      if (all || !el?.contains(span)) { atoms.delete(span); void unmount(instance); }
    }
  }

  function render(rich: RichText) {
    const old = [...atoms.keys()];
    el.replaceChildren(...renderTree(rich).map(build));
    if (rich.at(-1)?.ch === '\n') { const br = document.createElement('br'); br.setAttribute('data-sentinel', ''); el.append(br); }
    for (const span of old) { const instance = atoms.get(span); atoms.delete(span); if (instance) void unmount(instance); }
    el.toggleAttribute('data-empty', rich.length === 0);
  }

  /** Shows `next`, rebuilding the DOM only when it differs; keeps the selection by offsets. */
  function sync(next: RichText) {
    model = next;
    if (!el || composing) return;
    el.toggleAttribute('data-empty', next.length === 0);
    if (domSignature(el) === treeSignature(next)) { sweepAtoms(); return; }
    const sel = selectionOffsets(el);
    render(next);
    if (sel) setSelectionOffsets(el, Math.min(sel.start, next.length), Math.min(sel.end, next.length), sel.backward);
  }

  $effect(() => {
    const next = normalize(fromValue(value, code));
    untrack(() => sync(next));
  });

  function emit(info: InputInfo) {
    onchange?.(model, info);
  }

  function readInput(info: Omit<InputInfo, 'caret'>) {
    sync(normalize(readDom(el)));
    const sel = selectionOffsets(el);
    emit({ ...info, caret: sel && sel.start === sel.end ? sel.end : null });
  }

  function replace(rich: RichText, select?: { start: number; end?: number }, info: Omit<InputInfo, 'caret'> = { inputType: 'replace', data: null }) {
    model = normalize(rich);
    render(model);
    let caret: number | null = null;
    if (select) {
      const start = Math.min(select.start, model.length);
      const end = Math.min(select.end ?? start, model.length);
      el.focus({ preventScroll: true });
      setSelectionOffsets(el, start, end);
      if (start === end) caret = start;
    }
    emit({ ...info, caret });
  }

  function focusAt(start: number, end = start) {
    const length = textLength(el);
    el.focus({ preventScroll: true });
    setSelectionOffsets(el, Math.min(start, length), Math.min(end, length));
    el.scrollIntoView({ block: 'nearest' });
  }

  function format(mark: FormatMark) {
    const sel = selectionOffsets(el);
    if (!sel || sel.start === sel.end) return;
    replace(toggleFormat(model, sel.start, sel.end, mark), { start: sel.start, end: sel.end });
  }

  const handle: LineHandle = {
    get key() { return key; },
    get el() { return el; },
    get code() { return code; },
    rich: () => model,
    length: () => model.length,
    selection: () => el ? selectionOffsets(el) : null,
    replace: (rich, select) => replace(rich, select),
    focusAt
  };
  const registry = getLineRegistry();
  onMount(() => { registry?.register(handle); });
  onDestroy(() => { registry?.unregister(handle); sweepAtoms(true); });

  const formatInputs: Record<string, FormatMark> = { formatBold: 'bold', formatItalic: 'italic', formatStrikeThrough: 'strike' };

  function onBeforeInput(event: InputEvent) {
    const type = event.inputType;
    // The page owns undo; native undo would replay DOM edits we re-render over.
    if (type === 'historyUndo' || type === 'historyRedo') { event.preventDefault(); return; }
    if (type.startsWith('format')) {
      event.preventDefault();
      if (!code && formatInputs[type]) format(formatInputs[type]);
      return;
    }
    if (type === 'insertParagraph' || type === 'insertLineBreak') {
      // Virtual keyboards can send these without a usable keydown.
      event.preventDefault();
      onkey?.(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: type === 'insertLineBreak' }), handle);
      return;
    }
    if (type === 'insertFromPaste' || type === 'insertFromDrop' || type === 'insertFromPasteAsQuotation') {
      event.preventDefault();
      const text = event.dataTransfer?.getData('text/plain');
      if (text) insertText(text);
      return;
    }
    if (type === 'insertText' && event.data && !code && !composing) {
      // Typing at the end of a link or code span starts plain text, as insertPlain does.
      const sel = selectionOffsets(el);
      if (!sel || sel.start !== sel.end) return;
      const before = model[sel.start - 1];
      const after = model[sel.start];
      const edge = (mark: 'link' | 'code') => before?.marks[mark] !== undefined && before.marks[mark] !== after?.marks[mark];
      if (before && !before.atom && (edge('link') || edge('code'))) {
        event.preventDefault();
        replace(insertPlain(model, sel.start, event.data), { start: sel.start + event.data.length }, { inputType: 'insertText', data: event.data });
      }
    }
  }

  function onInput(event: Event) {
    if (composing) return;
    const input = event as InputEvent;
    readInput({ inputType: input.inputType ?? '', data: input.data ?? null });
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.target !== el || composing || event.isComposing || event.keyCode === 229) return;
    onkey?.(event, handle);
    if (event.defaultPrevented) return;
    const mod = event.ctrlKey || event.metaKey;
    const k = event.key.toLowerCase();
    if (mod && !event.altKey) {
      const mark: FormatMark | null = event.shiftKey ? (k === 'x' ? 'strike' : null)
        : k === 'b' ? 'bold' : k === 'i' ? 'italic' : k === 'e' ? 'code' : null;
      if (mark || (!event.shiftKey && k === 'u')) {
        event.preventDefault();
        if (mark && !code) format(mark);
        return;
      }
    }
    if ((event.key === 'Backspace' || event.key === 'Delete') && !event.altKey) {
      const sel = selectionOffsets(el);
      if (!sel || sel.start !== sel.end) return;
      const i = event.key === 'Backspace' ? sel.start - 1 : sel.start;
      if (model[i]?.atom) {
        event.preventDefault();
        replace(deleteRange(model, i, i + 1), { start: i }, { inputType: 'deleteContent', data: null });
      }
    }
  }

  function insertText(text: string) {
    const sel = selectionOffsets(el) ?? { start: model.length, end: model.length };
    if (onpaste) { onpaste(text, sel.start, sel.end); return; }
    let clean = text.replace(/\r\n?/g, '\n');
    if (!code) clean = clean.replace(/ /g, ' ');
    if (singleLine) clean = clean.replace(/\n+/g, ' ').trim();
    const inserted = code ? plainRich(clean) : parseInline(clean);
    replace(insertRich(deleteRange(model, sel.start, sel.end), sel.start, inserted), { start: sel.start + inserted.length }, { inputType: 'insertFromPaste', data: null });
  }

  function onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    if (text) insertText(text);
  }

  /** Copies the selection as the saved Markdown so pasting it back keeps formatting and tooltips. */
  function onCopy(event: ClipboardEvent, cut: boolean) {
    const sel = selectionOffsets(el);
    if (!sel || sel.start === sel.end || !event.clipboardData) return;
    event.preventDefault();
    const slice = sliceRich(model, sel.start, sel.end);
    event.clipboardData.setData('text/plain', code ? toPlain(slice) : serializeInline(slice));
    if (cut) replace(deleteRange(model, sel.start, sel.end), { start: sel.start }, { inputType: 'deleteByCut', data: null });
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    const text = event.dataTransfer?.getData('text/plain');
    if (!text) return;
    el.focus({ preventScroll: true });
    const at = offsetFromPoint(el, event.clientX, event.clientY);
    if (at !== null) setSelectionOffsets(el, at);
    insertText(text);
  }

  function onCompositionEnd() {
    composing = false;
    readInput({ inputType: 'insertCompositionText', data: null });
  }
</script>

<div bind:this={el} class="rich-line {className}" class:code contenteditable="true" role="textbox" tabindex="0"
  aria-multiline={!singleLine} aria-label={label} spellcheck={!code} data-visual-line data-key={key}
  data-placeholder={placeholder || undefined} data-always={alwaysPlaceholder || undefined}
  data-cell-row={cellRow} data-cell-col={cellCol}
  onbeforeinput={onBeforeInput} oninput={onInput} onkeydown={onKeydown} onpaste={onPaste}
  oncopy={event => onCopy(event, false)} oncut={event => onCopy(event, true)}
  ondrop={onDrop} ondragover={event => event.preventDefault()} ondragstart={event => event.preventDefault()}
  oncompositionstart={() => { composing = true; }} oncompositionend={onCompositionEnd}></div>

<style>
  .rich-line { position:relative; min-height:1.8em; outline:none; white-space:pre-wrap; overflow-wrap:anywhere; word-break:normal; caret-color:var(--color-parchment-50); cursor:text; }
  .rich-line.code { white-space:pre; overflow-wrap:normal; overflow-x:auto; font-family:monospace; }
  /* data-empty is toggled imperatively, so Svelte cannot see it in the markup. */
  .rich-line:global([data-empty])[data-placeholder]:focus::before,
  .rich-line:global([data-empty])[data-placeholder][data-always]::before {
    content:attr(data-placeholder); position:absolute; inset:0 auto auto 0; color:rgb(188 167 125 / .5); pointer-events:none; white-space:nowrap;
  }
  .rich-line :global(strong) { color:var(--color-parchment-50); font-weight:700; }
  .rich-line :global(a) { color:var(--color-parchment-50); text-decoration:underline; cursor:text; }
  .rich-line :global(.font-color strong), .rich-line :global(.font-color a) { color:inherit; }
  .rich-line :global(code) { background:#ffffff0b; border-radius:3px; padding:.15rem .3rem; font-family:monospace; }
  .rich-line :global(.atom) { display:inline; }
  .rich-line :global(.atom button) { cursor:pointer; }
</style>
