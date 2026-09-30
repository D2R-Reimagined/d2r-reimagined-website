# Loot filter builder

Open `/loot-filter` manually. This route has no navigation or sitemap entry and
returns `noindex, nofollow`. It is unlisted, not access-controlled.

The editor is built with native Svelte components and the site's existing theme,
fonts, panels, buttons, and searchable multi-select. There is no iframe or embedded
upstream page. UnHoarder's format/validation model is adapted as a local ES module;
the interface, preview, state management, and persistence are implemented in the
website. Sound previews are served locally. No account, external service or TXT
upload is required. Accounts are optional for editing and required for cloud saves.
Item labels follow the site's selected language; selectors
remain the exact values the plugin expects. UI labels remain English.

## Updating the catalog

Run `multi-export-tool` against the mod overlaid on extracted base data as usual.
Copy `keyed/loot-filter.json` to `static/data/keyed/loot-filter.json` alongside the
normal `strings/*.json` language bundle update. Never edit the generated JSON.
See the exporter's `docs/LOOT-FILTER.md` for the wire contract.

The editor fetches that JSON on each visit, including when restoring an old filter.
It does not persist mod data in IndexedDB. Filter libraries and selected rules
are stored in `reimagined-loot-filter-builder`, separate from Grail and upstream
workspaces. The old single workspace is migrated into the guest library as
"My original filter" without deleting its original backup. Invalid edits disable
downloads and account saves; the last valid browser copy is retained. Downloaded
`filter.json` files are portable backups. Clearing site data deletes browser drafts,
but account saves can be loaded again. A failed catalog request leaves editing and
downloads available; Retry data reloads the catalog without replacing the filter.

## Filter library and account saves

`/loot-filter` opens a landing screen with the last-used filter already loaded,
ready to continue, alongside saved filters and the preset slider. Creating or
importing a filter adds a separate entry; it never overwrites the current filter.
Guest and signed-in browser libraries are partitioned by account ID. Signing out
clears account data from the page. "Copy browser filters" deliberately imports
guest drafts into the signed-in library without modifying the guest originals.

Valid edits autosave locally. **Save to account** explicitly creates or updates the
private server copy. **Save account copy** forks a separate saved filter. Names can
be edited in the editor toolbar. Up to 50 filters can be saved per account; each
document is limited to 4 MiB and 4,096 rules. Server lists contain metadata only;
full documents load on demand. Last-used selection is recorded by the API across
devices; a dirty local copy is preserved when the same filter has changed remotely.
Filters removed remotely remain available as detached browser copies on refresh.

Revision conflicts keep the browser draft and offer saving a copy or explicitly
reloading the saved account version. Filter documents remain ordinary schema-v3
JSON; account metadata is not included in downloads. API deployment requires
migration `20260930011538_AddLootFilterLibrary` before enabling account saves.

## Starting presets (version 1)

The slider creates an independent copy of a versioned definition in
`src/lib/loot-filter/presets.ts`. Changing strictness never rewrites an existing
filter. This is a conservative starting policy, not an item-value or build evaluator.

| Preset | Equipment hidden after the shared keep rules |
| --- | --- |
| Starter | Nothing; notable loot receives highlights. |
| Semi Strict | Inferior and normal ordinary weapons/armor with zero sockets, non-ethereal. |
| Strict | The same, additionally including superior and magic ordinary weapons/armor. |

Rules run in this order: uniques/sets; quest items; maps/map currencies;
runes/gems/mod currencies and stacks; charms/jewels/jewelry; rares; class-specific
and mercenary gear; ethereal items; socketed items; the strictness-specific hide
rule; final Show. All miscellaneous items, including potions and gold, remain
visible. Only known equipment families are hidden, so new item families default
to visible. No hidden unique identity, rolled affix score, character level or
difficulty is inferred from the limited plugin conditions. Future refinements can
add reviewed base tiers or optional currency thresholds before the final fallback,
with fixtures for every protected category and monotonic strictness tests.

## Sound audition

The 16 sound buttons select and preview with one click. The shared player stops
the previous sound before playing another, including the preview panel's replay.
Preview-on-selection can be disabled; Replay and Stop remain available. Audio
only starts following an explicit click and plays at 50% volume.

## Installing filters

Place `filter.json` beside `unhoarder.dll` in
`mods/Reimagined/d2rloader/plugins`. UnHoarder reloads stable file changes, or use
Ctrl+Shift+F9. Ordered rules stop at the first match unless Continue is enabled.
Unique/set search shortcuts match base + rarity, never a specific hidden identity.
The installed starter filter shows everything; the builder starts empty.

The plugin needs its matching data archive: merge Filter01–Filter16 into the mod's
sound table with unused indices and install their FLAC files. Do not overwrite the
mod's sound table with the upstream one. The Reimagined mod source now includes
these rows and sounds. Game runtime behavior must still be tested in game.

## Upstream and local changes

- Builder: https://github.com/Lukaszpg/unhoarder-builder
- Snapshot: `84b30fa679943a092d7b80cb59707332af8792e4`
- Plugin: https://github.com/Lukaszpg/d2rl-unhoarder/releases/tag/v1.1.0
- License: GPL-3.0; full text is preserved at `src/lib/loot-filter/LICENSE`.
- Original author: MindH1ve. Local integration: D2R Reimagined, September 2026.
- Ported: schema-v3 validation and catalog expansion, including 1.1.0 limits.
- Native UI: ordered Show/Hide rules, Continue, duplication/deletion, drag and
  keyboard ordering, shared searchable conditions, numeric bounds, boolean
  conditions, colors, names, sounds, live label/icon/JSON previews, import/export,
  size validation, IndexedDB saving, installation help and catalog retry.
- Custom selector values and imported unknown selectors are preserved.
- Corrected upstream catalog trimming: runtime base/type names are literal strings.

Validation: `pnpm run check`, `pnpm test`, `pnpm run build`; exercise `/loot-filter`
against the built Node server at desktop and mobile widths. Regression coverage in
`src/lib/loot-filter.spec.ts` runs the same model and catalog adapter as the native UI.
