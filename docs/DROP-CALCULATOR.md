# Drop calculator

`/data/drop-calculator` has two modes built on the exported `static/data/keyed/drop-calculator.json`
(monster sources, treasure classes and droppable unique, set, rune and miscellaneous items):

- **Find an item** lists every monster source that can drop a chosen item, with the chance per
  kill.
- **Monster simulator** shows the full loot table of one monster or treasure class, and can
  simulate a number of kills.

Both modes evaluate the exported treasure-class data with the rules described below. Their results
are calculations under stated assumptions, not observed in-game drop rates. Conditions the
calculator cannot evaluate are reported as unavailable or as an error rather than guessed (see
[Conditions and assumptions](#conditions-and-assumptions)).

## Find an item

Search for an item (at least two characters, optionally limited to a category), then run the
calculation. For each monster source, `calculateDrops` in `src/lib/drop-calculator.ts` computes
the exact probability that **one kill drops at least one copy** of the item. It walks the
treasure-class graph, applying treasure-class upgrades by monster level (outside Normal), picks,
NoDrop, the six-item drop limit, unique and set quality rolls, and item level and rarity
eligibility.

Settings that change the calculation:

- **Difficulty**: Normal, Nightmare, Hell or all difficulties.
- **Players** and **party size**: players in the game and in the killer's party (party size
  cannot exceed players). Together they raise NoDrop the way the game does.
- **Magic Find**: 0–10000, with the game's diminishing returns for unique and set items. It has no
  effect on runes and miscellaneous items, and the field is disabled for them.
- **Kills per monster**: 1–100000 (default 100000) for the derived statistics below.

Monster name, monster type, treasure class, and the minimum and maximum monster level only filter
the result list; they never change a calculated chance.

Each row shows the chance per kill and "1 in N" average kills. With detailed statistics on, rows
also show expected successful kills (`kills × chance`), the chance of at least one success in that
many kills, and one random simulated run. The simulated run uses an unseeded random generator, so
it varies between calculations.

Rows are in one of three states:

- a positive chance;
- **0%**: the current data and settings give that source no way to drop the item;
- **Unavailable** ("Not calculated"): the result depends on a condition the calculator cannot
  evaluate. This is not a zero chance; the reason is shown with detailed statistics.

Zero and unavailable rows are hidden unless "Include zero / unavailable" is on. A summary lists the
highest chances per kill among the filtered rows. Results are paged.

## Monster simulator

Choose a monster source, or a treasure class directly at a chosen monster level (1–120, default
85), with difficulty, players, party size and Magic Find. `monsterDrops` in
`src/lib/monster-drop-calculator.ts` then offers two actions:

- **View drop rates** computes each outcome's exact chance per kill and expected count.
- **Simulate kills** runs 1–100000 kills (default 100) with a seeded random generator. The same
  seed and settings reproduce the same run; the seed does not affect drop rates. Each simulated
  kill starts a fresh game, so unique items are always eligible.

Treasure-class upgrades by monster level apply to monster sources outside Normal difficulty; a
treasure class chosen directly is used as-is.

Presentation options:

- **NoDrop** and **Void** outcomes take no drop slot. They are hidden unless detailed statistics
  are shown, which also adds a NoDrop/Void/item split and expected versus observed drops per kill.
- **Collapse similar** groups random armor bases, random weapon bases, all uniques and all sets.
  A group's chance is the chance of at least one member, not the sum of its members.
- The **Treasure-class breakdown** perspective credits each item to the random-pick treasure class
  that rolled it, instead of listing individual items (the **Item drops** perspective).

Changing either option re-runs the last action. **Copy table (TSV)** copies the
settings and all filtered rows to the clipboard.

## Conditions and assumptions

Conditional treasure classes are resolved by `conditionState` and `gatedOff` in
`src/lib/drop-calculator.ts`:

- Difficulty conditions are evaluated against the selected difficulty.
- Game-completion conditions (`QuestFlagEx`, such as Terrorize consumables) are **assumed to be
  met** (`GAME_COMPLETED`). There is no setting to change this.
- Conditions that depend on other live game state are unsupported. In **Find an item**, a source
  whose result depends on one is Unavailable; an unsupported treasure class that cannot affect the
  item is checked both ways and only marks the row Unavailable if the result differs. In the
  **Monster simulator**, any unsupported condition reached makes the whole run fail with an error.

Both modes also assume:

- ordinary, non-terrorized monsters;
- quest drops of quest bosses are active;
- no unique item has already dropped in the current game;
- the item level is the exported monster level; there is no separate area-level input. Area
  entries come from monster spawn tables, so scripted spawns may have no area.

The calculator does not model rare or magic quality, affixes, gold amounts or stack sizes. A failed
unique or set roll counts as a miss rather than a downgraded item. Treasure-class modifiers other
than unique and set chance are ignored or make the result unavailable.

## Probability display

- An exact 100% is shown as `100%`. A probability below 100% that rounds up at five significant
  digits is shown as `>99.999%`, because a run with no drop is still possible.
- Very small chances keep enough precision to stay visibly above zero.
- "1 in N" is the average number of kills per success, not a guarantee.

## Sharing and recalculation

Both modes keep their settings in the URL. **Find an item** uses parameters such as `item`,
`difficulty`, `players`, `party`, `mf` and the filters; the simulator uses `mode=simulate` and
`sim_`-prefixed parameters (`src/lib/drop-calculator-url.ts`, `src/lib/monster-drop-url.ts`).
Default values are omitted. **Copy link** copies the current URL.

Calculations run in browser Web Workers (`src/lib/drop-calculator.worker.ts`,
`src/lib/monster-drop-calculator.worker.ts`), one worker per run. Changing a calculation input
clears stale results; nothing recalculates until the user runs it again, except that a shared
**Find an item** link calculates when opened. Shared simulator links fill in the settings without
running. Results are not server-rendered.
