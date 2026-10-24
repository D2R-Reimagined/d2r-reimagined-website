# Drop calculator

`/data/drop-calculator` evaluates the exported treasure-class data in
`static/data/keyed/drop-calculator.json`. Results are calculations under the assumptions below,
not observed in-game drop rates.

## Modes

- **Find an item** (`calculateDrops` in `src/lib/drop-calculator.ts`) lists every monster source
  that can drop a chosen item, with the exact chance that one kill drops at least one copy. It
  applies treasure-class upgrades by monster level (outside Normal), picks, NoDrop (raised by
  players and party size), the six-item drop limit, unique and set quality rolls with Magic Find
  diminishing returns, and item level and rarity eligibility. Name, type, treasure-class and
  level filters only narrow the result list.
- **Monster simulator** (`monsterDrops` in `src/lib/monster-drop-calculator.ts`) shows the full
  loot table of one monster, or of a treasure class at a chosen monster level, and can simulate
  1–100000 kills. Simulations use a seeded random generator, so the same seed and settings
  reproduce the same run; each simulated kill starts a fresh game. "Collapse similar" groups show
  the chance of at least one member, not the sum of their members.

A **Find an item** row is either a positive chance, **0%** (no way to drop the item with the
current data and settings) or **Unavailable**, meaning the result depends on a condition the
calculator cannot evaluate. Unavailable is not a zero chance.

## Conditions and assumptions

- Difficulty conditions use the selected difficulty.
- Game-completion conditions (`QuestFlagEx`, such as Terrorize consumables) are assumed to be met.
- Conditions that depend on other live game state are unsupported. In **Find an item** they make
  a row Unavailable only when they can change the result; in the simulator they make the run fail
  with an error.
- Monsters are ordinary and non-terrorized, quest-boss quest drops are active, and no unique item
  has already dropped in the current game.
- The item level is the exported monster level; there is no separate area-level input.
- Rare and magic quality, affixes, gold amounts and stack sizes are not modeled. A failed unique or
  set roll counts as a miss rather than a downgraded item.

## Sharing

Settings are kept in the URL (`src/lib/drop-calculator-url.ts`, `src/lib/monster-drop-url.ts`).
A shared **Find an item** link calculates when opened; a shared simulator link only fills in the
settings. Calculations run in browser Web Workers and are not server-rendered.
