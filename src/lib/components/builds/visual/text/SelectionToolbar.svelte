<script lang="ts">
  // Floating formatting bar for a text selection. Buttons keep the selection by
  // cancelling mousedown; panels with inputs report `onhold` so the section keeps
  // the bar (and the saved selection offsets) while focus is inside it.
  import { tick } from 'svelte';
  import { normalizeLink, type FormatMark, type FormatState } from '#lib/build-editor/commands.js';
  import type { LineType } from '#lib/build-editor/lines.js';
  import Popover from './Popover.svelte';

  let { rect, state: marks, lineType = null, onformat, onlink, oncolor, onturn, onclear, onhold, ondone }: {
    rect: { left: number; right: number; top: number; bottom: number };
    state: FormatState;
    /** Null for table cells, which cannot change type. */
    lineType?: { type: LineType; level?: number } | null;
    onformat: (mark: FormatMark) => void;
    onlink: (href: string | null) => void;
    oncolor: (color: string | null) => void;
    onturn: (type: LineType, level?: number) => void;
    onclear: () => void;
    onhold: (hold: boolean) => void;
    /** Return focus to the text with the selection restored. */
    ondone: () => void;
  } = $props();

  const swatches = [
    { color: '#c7b377', name: 'Unique gold' }, { color: '#00c400', name: 'Set green' }, { color: '#6969ff', name: 'Magic blue' },
    { color: '#ffff64', name: 'Rare yellow' }, { color: '#ffa800', name: 'Crafted orange' }, { color: '#ff4d4d', name: 'Red' },
    { color: '#8a8a8a', name: 'Grey' }
  ];
  const turnOptions: { label: string; type: LineType; level?: number }[] = [
    { label: 'Text', type: 'paragraph' }, { label: 'Heading 1', type: 'heading', level: 1 }, { label: 'Heading 2', type: 'heading', level: 2 },
    { label: 'Heading 3', type: 'heading', level: 3 }, { label: 'Bulleted list', type: 'bullet' }, { label: 'Numbered list', type: 'numbered' },
    { label: 'Quote', type: 'quote' }, { label: 'Code', type: 'code' }
  ];
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const mod = mac ? '⌘' : 'Ctrl+';

  let panel = $state<'link' | 'color' | 'turn' | null>(null);
  let element = $state<HTMLDivElement>();
  let linkInput = $state<HTMLInputElement>();
  let linkValue = $state('');
  let linkError = $state('');
  let custom = $state('#c7b377');
  let currentLabel = $derived(lineType ? turnOptions.find(o => o.type === lineType.type && (o.level ?? undefined) === (lineType.type === 'heading' ? lineType.level : undefined))?.label ?? 'Text' : '');

  /** Opens the link field (Ctrl/Cmd+K). */
  export async function openLink() {
    panel = 'link';
    linkValue = marks.link ?? '';
    linkError = '';
    onhold(true);
    await tick();
    linkInput?.focus();
    linkInput?.select();
  }
  function toggle(name: 'color' | 'turn') { panel = panel === name ? null : name; }
  function applyLink() {
    if (!linkValue.trim()) { removeLink(); return; }
    const href = normalizeLink(linkValue);
    if (!href) { linkError = 'Use a full https:// address or a site path such as /data/uniques.'; return; }
    panel = null;
    onlink(href);
    onhold(false);
  }
  function removeLink() { panel = null; onlink(null); onhold(false); }
  function cancel() { panel = null; onhold(false); ondone(); }
  const keep = (event: MouseEvent) => event.preventDefault();

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel(); return; }
    // Roving arrows across the main buttons.
    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && (event.target as HTMLElement).matches('.bar > button')) {
      const buttons = Array.from(element?.querySelectorAll<HTMLButtonElement>('.bar > button:not(:disabled)') ?? []);
      const i = buttons.indexOf(event.target as HTMLButtonElement);
      buttons[(i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
      event.preventDefault();
    }
  }
  function focusIn() { onhold(true); }
  function focusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (!next || !element?.contains(next)) { panel = null; onhold(false); }
  }
  /** Moves keyboard focus into the bar (Alt+F10). */
  export function focusBar() { element?.querySelector<HTMLButtonElement>('.bar > button')?.focus(); }
</script>

<Popover anchor={rect} prefer="above" align="center" bind:element class="selection-toolbar" role="toolbar" aria-label="Text formatting"
  onkeydown={onKeydown} onfocusin={focusIn} onfocusout={focusOut}>
  <div class="bar">
    <button type="button" class="mark bold" aria-label="Bold" title={`Bold (${mod}B)`} aria-pressed={marks.bold} onmousedown={keep} onclick={() => onformat('bold')}>B</button>
    <button type="button" class="mark italic" aria-label="Italic" aria-pressed={marks.italic} disabled={marks.italicBlocked}
      title={marks.italicBlocked ? 'Build guides cannot combine bold and italic; remove bold first' : `Italic (${mod}I)`}
      onmousedown={keep} onclick={() => onformat('italic')}>I</button>
    <button type="button" class="mark strike" aria-label="Strikethrough" title={`Strikethrough (${mod}Shift+X)`} aria-pressed={marks.strike} onmousedown={keep} onclick={() => onformat('strike')}>S</button>
    <button type="button" class="mark code" aria-label="Inline code" title={`Code (${mod}E)`} aria-pressed={marks.code} onmousedown={keep} onclick={() => onformat('code')}>&lt;/&gt;</button>
    <button type="button" aria-label="Link" title={`Link (${mod}K)`} aria-pressed={!!marks.link} aria-expanded={panel === 'link'} onmousedown={keep} onclick={() => panel === 'link' ? cancel() : openLink()}>Link</button>
    <button type="button" class="color-button" aria-label="Text colour" title="Text colour" aria-expanded={panel === 'color'} onmousedown={keep} onclick={() => toggle('color')}>
      <span class="color-a" style:border-color={marks.color ?? 'transparent'}>A</span>
    </button>
    {#if lineType}
      <button type="button" class="turn" aria-label={`Turn into, currently ${currentLabel}`} title="Turn into" aria-expanded={panel === 'turn'} onmousedown={keep} onclick={() => toggle('turn')}>{currentLabel} ▾</button>
    {/if}
    <button type="button" aria-label="Clear formatting" title="Clear formatting" onmousedown={keep} onclick={onclear}>T<sub>x</sub></button>
  </div>

  {#if panel === 'link'}
    <form class="panel link" onsubmit={event => { event.preventDefault(); applyLink(); }}>
      <input bind:this={linkInput} bind:value={linkValue} type="text" inputmode="url" autocomplete="off" spellcheck="false"
        placeholder="https://… or /data/…" aria-label="Link address" aria-invalid={!!linkError} aria-describedby={linkError ? 'link-error' : undefined} />
      <button type="submit" class="apply">Apply</button>
      {#if marks.link}<button type="button" class="remove" onclick={removeLink}>Remove</button>{/if}
      {#if linkError}<p class="error" id="link-error" role="alert">{linkError}</p>{/if}
    </form>
  {:else if panel === 'color'}
    <div class="panel colors" role="group" aria-label="Text colours">
      {#each swatches as swatch}
        <button type="button" class="swatch" style:background={swatch.color} aria-label={swatch.name} title={swatch.name}
          aria-pressed={marks.color === swatch.color} onmousedown={keep} onclick={() => { panel = null; oncolor(swatch.color); }}></button>
      {/each}
      <label class="custom" title="Custom colour">
        <span class="sr-only">Custom colour</span>
        <input type="color" bind:value={custom} onchange={() => { panel = null; oncolor(custom.toLowerCase()); onhold(false); }} />
      </label>
      <button type="button" class="none" onmousedown={keep} onclick={() => { panel = null; oncolor(null); }}>No colour</button>
    </div>
  {:else if panel === 'turn' && lineType}
    <div class="panel turn-list" role="group" aria-label="Turn into">
      {#each turnOptions as option}
        <button type="button" aria-pressed={option.label === currentLabel} onmousedown={keep}
          onclick={() => { panel = null; onturn(option.type, option.level); }}>{option.label}</button>
      {/each}
    </div>
  {/if}
</Popover>

<style>
  :global(.selection-toolbar) { padding:.25rem; }
  .bar { display:flex; flex-wrap:wrap; gap:2px; max-width:calc(100vw - 24px); }
  .bar > button { min-width:2rem; height:2rem; padding:0 .45rem; border-radius:5px; color:var(--color-parchment-200); font-size:13px; white-space:nowrap; }
  .bar > button:hover:not(:disabled) { background:#ffffff10; color:var(--color-parchment-50); }
  .bar > button[aria-pressed="true"] { background:color-mix(in srgb, var(--color-ember-700) 45%, transparent); color:var(--color-parchment-50); }
  .bar > button:disabled { opacity:.35; cursor:not-allowed; }
  .bold { font-weight:700; } .italic { font-style:italic; font-family:Georgia, serif; } .strike { text-decoration:line-through; } .code { font-family:monospace; }
  .color-a { display:inline-block; padding:0 .15rem; border-bottom:3px solid transparent; line-height:1.1; }
  .turn { border-left:1px solid #ffffff14; }
  .panel { padding:.45rem .3rem .3rem; border-top:1px solid #ffffff12; margin-top:.25rem; }
  .link { display:flex; flex-wrap:wrap; gap:.35rem; width:min(320px, calc(100vw - 32px)); }
  .link input { flex:1 1 10rem; min-width:0; padding:.35rem .5rem; border:1px solid rgb(188 167 125 / .3); border-radius:5px; background:#0d0d0e; color:var(--color-parchment-50); }
  .link input:focus { outline:2px solid var(--color-ember-400); outline-offset:1px; }
  .link button { padding:.35rem .6rem; border-radius:5px; border:1px solid #ffffff1a; color:var(--color-parchment-50); }
  .apply { background:var(--color-ember-700); }
  .error { flex-basis:100%; color:#ff8a70; font-size:12px; }
  .colors { display:flex; flex-wrap:wrap; align-items:center; gap:.35rem; }
  .swatch { width:1.6rem; height:1.6rem; border-radius:50%; border:2px solid #0008; }
  .swatch[aria-pressed="true"] { outline:2px solid var(--color-parchment-50); outline-offset:1px; }
  .custom { position:relative; display:inline-grid; width:1.6rem; height:1.6rem; border-radius:50%; overflow:hidden; border:1px dashed #ffffff55; cursor:pointer; }
  .custom input { width:200%; height:200%; margin:-50%; cursor:pointer; border:0; padding:0; }
  .custom:focus-within { outline:2px solid var(--color-ember-400); outline-offset:2px; }
  .none { padding:.25rem .5rem; border-radius:5px; font-size:12px; color:var(--color-parchment-200); border:1px solid #ffffff1a; }
  .turn-list { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:2px; width:min(260px, calc(100vw - 32px)); }
  .turn-list button { padding:.35rem .5rem; border-radius:5px; text-align:left; font-size:13px; color:var(--color-parchment-200); }
  .turn-list button:hover, .turn-list button[aria-pressed="true"] { background:#ffffff10; color:var(--color-parchment-50); }
  .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
</style>
