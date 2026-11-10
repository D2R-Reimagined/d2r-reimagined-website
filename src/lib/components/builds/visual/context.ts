// What every section component can read from the surrounding visual editor.
// VisualSurface provides it; section components call `visualEditor()`.
import { getContext, setContext } from 'svelte';
import type { BlockKind, BuildBlock } from '#lib/builds.js';
import type { CharacterDetailsResponse, CharacterResponse } from '#lib/characters.js';
import type { SkillClass } from '#lib/types.js';

export interface VisualEditorContext {
  readonly characterClass: string;
  /** Skill classes once loaded (empty while loading). */
  readonly classes: SkillClass[];
  readonly skillError: string;
  /** The signed-in user's characters (all classes). */
  readonly characters: CharacterResponse[];
  readonly characterError: string;
  /** Saved equipment snapshots, keyed by block id. */
  readonly equipment: Record<string, CharacterDetailsResponse>;
  /** Inserts a new section of `kind` right after `block` and focuses its title. */
  insertAfter(block: BuildBlock, kind: BlockKind): void;
}

const key = Symbol('visual-build-editor');
export const setVisualEditor = (context: VisualEditorContext) => setContext(key, context);
export function visualEditor(): VisualEditorContext {
  const context = getContext<VisualEditorContext | undefined>(key);
  if (!context) throw new Error('Section components must be rendered inside VisualSurface.');
  return context;
}
