import { getContext, setContext } from 'svelte';
import type { RichText } from '../../../../build-editor/inline';
import type { Offsets } from './dom';

/** What a mounted RichLine exposes to the section that owns it. */
export interface LineHandle {
  /** Line id, or `${lineId}:${row}:${col}` for a table cell. */
  key: string;
  el: HTMLElement;
  code: boolean;
  rich(): RichText;
  length(): number;
  selection(): Offsets | null;
  /** Replaces the content (emitting a change) and optionally selects [start, end). */
  replace(rich: RichText, select?: { start: number; end?: number }): void;
  focusAt(start: number, end?: number): void;
}
export interface LineRegistry {
  register(handle: LineHandle): void;
  unregister(handle: LineHandle): void;
  get(key: string): LineHandle | undefined;
}

const key = Symbol('visual-text-lines');
export const setLineRegistry = (registry: LineRegistry) => setContext(key, registry);
export const getLineRegistry = () => getContext<LineRegistry | undefined>(key);
export const cellKey = (lineId: string, row: number, col: number) => `${lineId}:${row}:${col}`;
