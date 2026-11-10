# Build editor v2 (visual editor, beta)

The build workshop has two editing surfaces for the same guide:

- **Classic**: the original form fields and Markdown textareas.
- **Visual (beta)**: a Notion-style surface where you edit the guide as players will read it, and the controls follow your pointer and focus.

Authors switch with the **Classic / Visual (beta)** toggle in the workshop's sticky save bar. The choice is remembered per browser (`localStorage` key `d2r-build-editor-mode`; the default is Classic). Switching is lossless and keeps unsaved changes, because both surfaces edit the same object.

## How it is structured

```
src/lib/components/builds/BuildEditor.svelte     state, load/save/recovery/publish, Preview, the mode toggle
src/lib/components/builds/visual/
  VisualSurface.svelte     the visual editor: layout, section operations, undo/redo
  EssentialsHeader.svelte  title, summary, class/focus/budget chips, patch, tags (ChipGroup, TagInput)
  VariantBar.svelte        the reader's "SETUP" tabs, editable
  OutlineRail.svelte       "On this page": click to jump, drag to reorder
  SectionShell.svelte      one section: grip + "+" gutter, number, title, publish hints, kind component
  InsertBetween.svelte     hover "+ Add section" line between sections
  AddSectionMenu.svelte    the kind picker menu; AddSectionGrid.svelte is the end-of-guide version
  context.ts               what section components can read from the editor (visualEditor())
  drag.ts                  pointer drag-to-reorder used by grips and the rail
  visual.css               all visual-editor styles, modelled on BuildRenderer's reader styles
  ui/                      Menu (keyboard-navigable dropdown), AutoGrow (in-place textarea), Icon + icons.ts
  sections/
    registry.ts            BlockKind -> { label, icon, description, component }
    TextSection.svelte, CalloutSection.svelte, ItemsSection.svelte, SkillsSection.svelte,
    EquipmentSection.svelte, ImageSection.svelte, VideoSection.svelte
    SectionNotes.svelte, UrlCard.svelte, tones.ts   shared bits
  text/                    SectionBody: Notion-style text editor, see visual/text
src/lib/build-editor/
  document.ts   shared document mutations used by both editors (limits, copy/duplicate, variants, class change, tags, per-section issues)
  history.ts    undo/redo history (pure)
  reorder.ts    drag-to-reorder geometry (pure)
  inline.ts, lines.ts   the rich text model used by visual/text
```

**BuildEditor keeps the state.** `content`, `equipment`, `activeVariantId`, skill classes, characters, saving, recovery and publishing all stay in `BuildEditor.svelte`. In visual mode it renders, instead of the classic fields:

```svelte
<VisualSurface bind:content bind:activeVariantId bind:equipment {classes} {characters} {characterError} {skillError} {busy}
  onchangeclass={changeClass} />
```

`onchangeclass` is BuildEditor's own `changeClass`, so the confirmation and the clearing of skills, characters and equipment snapshots happen exactly as in the classic editor. `bind:equipment` lets duplicated sections and setups share their source's saved equipment snapshot, as the classic editor does.

**VisualSurface** mirrors the public reader (`BuildRenderer.svelte`): an outline rail on the left and the guide on the right (stacked below 850 px). It owns structural operations (insert, duplicate, delete, move, setups), which call the helpers in `document.ts`, and the undo history.

**Sections** are rendered by `SectionShell`, which looks up the kind's component in `sections/registry.ts` and renders `<Kind bind:block />`. A kind component gets the section as a bindable `block` and reads shared data (class, skill trees, characters, equipment snapshots, `insertAfter`) via `visualEditor()` from `context.ts`.

**Text** (`text` and `callout` content, and the notes under embeds) is `SectionBody`: Notion-style text editor, see `visual/text`. Its contract:

```svelte
<SectionBody bind:body={block.body} characterClass={...} placeholder="Type '/' for commands"
  oninsertsection={(kind) => /* insert a section of `kind` after this one */} />
```

### Undo and redo

`VisualSurface` serializes `content` on every change and records it in `DocumentHistory` (`history.ts`). Changes within 600 ms of the previous one join the same step, so a burst of typing is one undo. Structural operations run through `step()`, which forces them into their own step. The history keeps 100 steps and starts when the visual editor opens (loading a draft or switching modes is not an undo step). Ctrl/Cmd+Z undoes, and Ctrl/Cmd+Shift+Z or Ctrl+Y redoes (caught in the capture phase on the surface, and on the window when focus has fallen back to the page), as do the toolbar buttons. Undo is ignored while saving. Restoring replaces `content`, so focus can be lost.

### The text model

Section text is still saved as the Markdown subset in `src/lib/build-markdown.ts`; the visual editor never adds syntax.

- `src/lib/build-editor/inline.ts`: a line is an array of characters, each with a flat set of marks (bold, italic, strike, code, colour, link) or an atom (item or skill tooltip). Every edit is an array operation, and `serializeInline` is the only code that knows the syntax. The dialect cannot nest bold inside italic (bold wins) or put a link inside code (code wins); `canonicalChar` documents every such rule.
- `src/lib/build-editor/lines.ts`: a section body is a flat list of lines (paragraph, heading, bullet, numbered, quote, code, divider, table). `isLossless(body)` proves a body survives the round trip; a body that does not opens as a plain Markdown field instead.
- Literal syntax characters are saved with CommonMark backslash escapes (`\*`, `\[`, `\-` at the start of a paragraph line), which the reader renders as the plain character.
- `inline.spec.ts` fuzzes 5000 random formatted lines through save and load and requires an exact match. Any change to `build-markdown.ts` or the model must keep it passing.
- Typing, keys, menus and the selection toolbar live in `visual/text/`; editing logic that needs no DOM is in `src/lib/build-editor/commands.ts` and `menus.ts`, with specs.

## How to add or improve a section kind

The data format is shared with the classic editor, the reader and the API, so a **new** kind also needs `BlockKind`/`blockLabels` in `src/lib/builds.ts`, rendering in `BuildRenderer.svelte`, a classic-editor control, validation in `publicationErrors`, and API support. Improving an existing kind only touches the visual editor:

1. Open `src/lib/components/builds/visual/sections/<Kind>Section.svelte` (or create one). Start from `TextSection.svelte` or `ImageSection.svelte`:
   ```svelte
   <script lang="ts">
     import type { BuildBlock } from '#lib/builds.js';
     import { visualEditor } from '../context';
     import SectionNotes from './SectionNotes.svelte';
     let { block = $bindable() }: { block: BuildBlock } = $props();
     const editor = visualEditor();
   </script>
   <!-- edit block.url / block.items / ... in place -->
   <SectionNotes bind:block />
   ```
2. Register it in `sections/registry.ts` with a label (reuse `blockLabels`), an icon name from `ui/icons.ts` (add a path there if needed) and a one-line description. TypeScript fails if a `BlockKind` is missing.
3. Put styles in `visual.css` under `.ve` and reuse the reader's look (`BuildRenderer.svelte`) and the site tokens (`--color-abyss-*`, `--color-parchment-*`, `--color-ember-*`, `--font-display`).
4. Publication problems show on the section automatically via `blockIssues()` (which reuses `publicationErrors`). Add new rules to `publicationErrors`, not to the component.
5. Check it in the visual editor, Preview and the classic editor at 1280 px and 390 px, then run the checks below.

## Hard rules

- **Same data.** Both editors edit the same `BuildContent`. No visual-only fields, and no API or format changes from the visual editor. Switching editors must be lossless: anything the visual editor writes must round-trip through the classic editor and the reader unchanged.
- **Never write `body` until the user edits it.** Text components must not normalize or reformat `body` on load; an untouched section must serialize exactly as it was loaded.
- **Keep one copy of the rules.** Limits (8 setups, 40 sections, 40 items, 8 tags), copying and class changes live in `src/lib/build-editor/document.ts`; don't re-implement them in a component.
- **Copy Svelte state with `$state.snapshot`**, never `structuredClone` on a proxy.
- **No new dependencies.** Menus, drag and drop, undo and the text editor are hand-rolled.
- Run `pnpm run check` (no new errors or warnings), `pnpm test` and `pnpm run build` before opening a pull request.

## Good first issues

- Keyboard reordering in the outline rail (the section grip already supports Alt+Arrow keys).
- Drag to reorder on touch screens in the rail (currently grips only), and auto-scroll that keeps going while the pointer rests near the edge.
- Restore focus to the edited field after undo/redo instead of dropping it.
- Keep the undo history when switching between Classic and Visual.
- Drag to reorder setup tabs and items within an items section.
- A "change section type" option in the section menu (for example text to callout) that keeps the body.
- Show the item's display name instead of its key in the items section's remove button label.
- Preview the image before committing the URL, and accept images dropped from another tab.
- A compact "jump to next publish problem" control in the toolbar.
- Text: format a selection that spans several lines (each line is its own editable element today).
- Text: Ctrl/Cmd+B or I with nothing selected should turn bold/italic on for the next characters typed.
- Text: `@` item and skill search inside table cells.
