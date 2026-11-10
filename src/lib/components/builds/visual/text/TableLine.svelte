<script lang="ts">
  // Editable grid for a table line: each cell is a single-line RichLine.
  import { tick } from 'svelte';
  import { serializeInline, type RichText } from '#lib/build-editor/inline.js';
  import { cellRich, padRows, tableAddColumn, tableAddRow, tableDeleteColumn, tableDeleteRow, tableSetCell } from '#lib/build-editor/commands.js';
  import { cellKey, getLineRegistry, type LineHandle } from './context';
  import { adjacentLine, caretLines, enterLine, rectAtOffset } from './dom';
  import RichLine from './RichLine.svelte';

  let { id, rows: source, onrows }: { id: string; rows: string[][]; onrows: (rows: string[][]) => void } = $props();
  let rows = $derived(padRows(source));
  let width = $derived(rows[0].length);
  let current = $state<[number, number]>([1, 0]);
  const registry = getLineRegistry();

  async function focusCell(r: number, c: number, start = 0) {
    await tick();
    registry?.get(cellKey(id, r, c))?.focusAt(start);
  }
  function setCell(r: number, c: number, rich: RichText) {
    const value = serializeInline(cellRich(rich));
    if (value !== rows[r]?.[c]) onrows(tableSetCell(rows, r, c, value));
  }

  function cellKeydown(event: KeyboardEvent, handle: LineHandle, r: number, c: number) {
    const mod = event.ctrlKey || event.metaKey || event.altKey;
    if (event.key === 'Enter' && !mod) {
      event.preventDefault();
      if (r + 1 < rows.length) void focusCell(r + 1, c);
      else { onrows(tableAddRow(rows, rows.length)); void focusCell(rows.length, c); }
      return;
    }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !mod && !event.shiftKey) {
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      const lines = caretLines(handle.el);
      if (dir > 0 ? !lines.last : !lines.first) return;
      event.preventDefault();
      const sel = handle.selection();
      const x = rectAtOffset(handle.el, sel?.end ?? 0).left;
      const next = registry?.get(cellKey(id, r + dir, c))?.el;
      if (next) { enterLine(next, dir > 0 ? 'start' : 'end', x); return; }
      // Leave the table from its first or last cell so document order continues past it.
      const edge = registry?.get(cellKey(id, dir > 0 ? rows.length - 1 : 0, dir > 0 ? width - 1 : 0))?.el;
      const target = edge && adjacentLine(edge, dir, x);
      if (target) enterLine(target, dir > 0 ? 'start' : 'end', x);
    }
  }

  function track(event: FocusEvent) {
    const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-cell-row]');
    if (cell) current = [Number(cell.dataset.cellRow), Number(cell.dataset.cellCol)];
  }
  const keep = (event: MouseEvent) => event.preventDefault();
  function addRow() { const at = Math.min(current[0] + 1, rows.length); onrows(tableAddRow(rows, at)); void focusCell(at, current[1]); }
  function addColumn() { const at = Math.min(current[1] + 1, width); onrows(tableAddColumn(rows, at)); void focusCell(current[0], at); }
  function deleteRow() {
    const [r, c] = current;
    if (r <= 0 || rows.length <= 1) return;
    onrows(tableDeleteRow(rows, r));
    void focusCell(Math.min(r, rows.length - 2), c);
  }
  function deleteColumn() {
    const [r, c] = current;
    if (width <= 1) return;
    onrows(tableDeleteColumn(rows, c));
    void focusCell(r, Math.min(c, width - 2));
  }
</script>

{#snippet cell(r: number, c: number, value: string)}
  <RichLine key={cellKey(id, r, c)} {value} singleLine cellRow={r} cellCol={c}
    label={r === 0 ? `Table header, column ${c + 1}` : `Table row ${r}, column ${c + 1}`}
    onchange={rich => setCell(r, c, rich)} onkey={(event, handle) => cellKeydown(event, handle, r, c)} />
{/snippet}

<div class="table-line" data-table onfocusin={track}>
  <div class="table-scroll">
    <table>
      <thead><tr>{#each rows[0] as value, c}<th>{@render cell(0, c, value)}</th>{/each}</tr></thead>
      <tbody>
        {#each rows.slice(1) as row, i}<tr>{#each row as value, c}<td>{@render cell(i + 1, c, value)}</td>{/each}</tr>{/each}
      </tbody>
    </table>
  </div>
  <div class="controls" role="group" aria-label="Table rows and columns">
    <button type="button" onmousedown={keep} onclick={addRow}>+ Row</button>
    <button type="button" onmousedown={keep} onclick={addColumn}>+ Column</button>
    <button type="button" onmousedown={keep} onclick={deleteRow} disabled={current[0] <= 0 || rows.length <= 1}
      title={current[0] <= 0 ? 'The header row stays; select a body row' : undefined}>− Row</button>
    <button type="button" onmousedown={keep} onclick={deleteColumn} disabled={width <= 1}>− Column</button>
  </div>
</div>

<style>
  .table-line { margin:1rem 0; min-width:0; }
  .table-scroll { max-width:100%; overflow:auto; }
  table { border-collapse:collapse; min-width:100%; }
  th, td { padding:.65rem .9rem; border:1px solid #ffffff20; text-align:left; min-width:100px; vertical-align:top; }
  th { background:#ffffff08; color:var(--color-parchment-50); font-weight:600; }
  th:focus-within, td:focus-within { box-shadow:inset 0 0 0 1px var(--color-ember-400); }
  .controls { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.45rem; opacity:0; transition:opacity 120ms ease; }
  .table-line:hover .controls, .table-line:focus-within .controls { opacity:1; }
  .controls button { padding:.2rem .55rem; border:1px solid #ffffff1a; border-radius:5px; font-size:12px; color:var(--color-parchment-200); background:#ffffff05; }
  .controls button:hover:not(:disabled) { color:var(--color-parchment-50); border-color:var(--color-ember-400); }
  .controls button:disabled { opacity:.4; cursor:not-allowed; }
  @media (hover:none) { .controls { opacity:1; } }
</style>
