// Pointer-driven drag to reorder, shared by section grips and the outline rail.
// A press that moves less than a few pixels stays a click; a real drag swallows the click.
import { dropIndex, isMove, reorderTarget } from '#lib/build-editor/reorder.js';

export interface ReorderOptions {
  /** Index of the dragged item. */
  from: number;
  /** The list's items in order, measured on every move. */
  items: () => HTMLElement[];
  /** The gap to highlight (0…n), or null for none. */
  onindicator: (drop: number | null) => void;
  /** Called once on drop with the final index. */
  onmove: (from: number, to: number) => void;
  ondragstart?: () => void;
  ondragend?: () => void;
}

export function startReorder(event: PointerEvent, options: ReorderOptions) {
  if (event.button !== 0 || !event.isPrimary) return;
  const startY = event.clientY;
  let dragging = false;
  let drop: number | null = null;

  const move = (e: PointerEvent) => {
    if (!dragging) {
      if (Math.abs(e.clientY - startY) < 5) return;
      dragging = true;
      document.body.classList.add('ve-dragging');
      options.ondragstart?.();
    }
    e.preventDefault();
    const midpoints = options.items().map(el => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; });
    drop = dropIndex(midpoints, e.clientY);
    options.onindicator(isMove(options.from, drop) ? drop : null);
    if (e.clientY < 140) window.scrollBy(0, -16);
    else if (e.clientY > window.innerHeight - 60) window.scrollBy(0, 16);
  };
  const finish = (commit: boolean) => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    window.removeEventListener('keydown', escape, true);
    if (!dragging) return;
    document.body.classList.remove('ve-dragging');
    options.onindicator(null);
    options.ondragend?.();
    swallowNextClick();
    if (commit && drop !== null && isMove(options.from, drop)) options.onmove(options.from, reorderTarget(options.from, drop));
  };
  const up = () => finish(true);
  const cancel = () => finish(false);
  const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && dragging) { e.preventDefault(); e.stopPropagation(); finish(false); } };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
  window.addEventListener('keydown', escape, true);
}

function swallowNextClick() {
  const stop = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
  window.addEventListener('click', stop, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
}
