// Undo/redo for the visual editor.
//
// States are serialized documents (JSON strings), so entries can never alias live
// Svelte state and equality is a string compare. Changes recorded within
// `coalesceMs` of the previous one join the same undo step, which turns a burst of
// typing into one step; `checkpoint()` forces the next change into a new step.
export interface HistoryOptions { limit?: number; coalesceMs?: number; now?: () => number }

export class DocumentHistory {
  private past: string[] = [];
  private future: string[] = [];
  private present: string;
  private lastAt = -Infinity;
  private readonly limit: number;
  private readonly coalesceMs: number;
  private readonly now: () => number;

  constructor(initial: string, { limit = 100, coalesceMs = 600, now = () => Date.now() }: HistoryOptions = {}) {
    this.present = initial; this.limit = limit; this.coalesceMs = coalesceMs; this.now = now;
  }

  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }

  /** Records the current document. Unchanged documents (including a just-restored one) are ignored. */
  record(state: string) {
    if (state === this.present) return;
    const at = this.now();
    if (at - this.lastAt >= this.coalesceMs || !this.past.length) {
      this.past.push(this.present);
      if (this.past.length > this.limit) this.past.shift();
    }
    this.present = state; this.future = []; this.lastAt = at;
  }

  /** Ends the current typing burst so the next change is its own undo step. */
  checkpoint() { this.lastAt = -Infinity; }

  undo(): string | null {
    const previous = this.past.pop();
    if (previous === undefined) return null;
    this.future.push(this.present); this.present = previous; this.checkpoint();
    return previous;
  }

  redo(): string | null {
    const next = this.future.pop();
    if (next === undefined) return null;
    this.past.push(this.present); this.present = next; this.checkpoint();
    return next;
  }
}
