# Skill planner and skill descriptions

`/data/skills` shows each class's skill trees with an allocation planner and a description panel.
The same components are embedded in build guides (see [builds.md](builds.md)) and the character
viewer. The planner is a reference tool built from exported data, not a simulation of the game: it
does not include equipment, character stats or auras.

## Allocation

The planner (`src/lib/components/skills/SkillPlanner.svelte`) stores **hard points** only.

- A skill accepts up to its `MaxLevel` hard points (20 when the export gives none), and its
  prerequisites need at least one point.
- There is no total-point budget or character-level check; `RequiredLevel` is displayed only.
- Click adds a point, Ctrl adds five and Shift fills the skill; right-click removes points.
- The standalone page saves allocations in `localStorage` under `d2r-reimagined-skill-planner-v1`.
  Embedded planners do not read or write that key.

## Description preview

The description panel (`SkillDetails.svelte`) previews a skill at a chosen number of hard points,
bonus `+skills` and, for formulas that read the character level (`ulvl`), character level, without
changing the allocation. Hard + bonus is limited to 100 (`SKILL_LEVEL_CAP` in
`src/lib/skill-points.ts`), a site-side limit. Above the exported `Descriptions.MaxLevel`, values
hold at the last exported level and the panel says so.

## How values are calculated

`lvl` is the effective level (hard + bonus) and `blvl` is hard points only. Each numeric argument
of a description line is resolved in this order (`skillLineNumbers` in `src/lib/skill-points.ts`),
with every axis clamped to its last entry because the exporter trims constant tails:

1. `valuesUlvl[arg][level - 1][characterLevel - 1]` for lines that read the character level.
2. `values2d[arg][hard][bonus]` for lines whose result depends on the hard/bonus split.
3. `values[arg][level - 1]`.

Where a line ships `valuesCalc`, the website evaluates that formula live
(`src/lib/skill-calculation.ts`) instead of using the table value, which covers values that read
other skills' points. Otherwise synergies come from the line's `scaleCalc` or the skill's synergy
formulas. Both use the other skills' points as currently allocated.

## Limitations

- When a formula cannot be evaluated, the line silently keeps its exported table value and a
  synergy formula contributes 0%.
- `stat(...)` references evaluate to 0, and `valuesCalc` formulas that read `ulvl` fall back to
  the table value.
- Bonus `+skills` apply only to the previewed skill; synergy sources use their hard points.

## Read-only displays

- Build-guide readers show the planner read-only.
- The character viewer passes the character's effective levels and hard points separately, and
  uses the saved character level for `ulvl` lines.
- Inline `[[skill:<id>:<rank>]]` links in build guides open a read-only description of that skill
  alone, with other skills unallocated and no equipment applied.
