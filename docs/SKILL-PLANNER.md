# Skill planner and skill descriptions

`/data/skills` shows each class's skill trees with an allocation planner and a description panel.
The same components are embedded in build guides (see [builds.md](builds.md)) and the character
viewer. This document describes what the planner stores and how description values are computed.

The planner is a reference tool built from exported data. It is not a simulation of the game
engine: it does not include equipment, character stats or auras, and some formulas cannot be
evaluated (see [Limitations](#limitations)).

## Allocation

The planner (`src/lib/components/skills/SkillPlanner.svelte`) stores **hard points** only, one
number per skill.

- A skill accepts up to its `MaxLevel` hard points (20 when the export gives none).
- Every prerequisite needs at least one point, and a skill other skills depend on cannot drop
  below one point.
- There is no total-point budget and no character-level check; `RequiredLevel` is displayed only.
- Click adds a point, Ctrl adds five and Shift fills the skill. Right-click removes points with the
  same modifiers.
- The standalone page saves allocations in the browser's `localStorage` under
  `d2r-reimagined-skill-planner-v1`. Allocations are not part of the URL. Embedded planners do not
  read or write that key.

Bonus `+skills` are never stored as an allocation. They exist only as a preview input.

## Selecting a skill

Hovering a skill previews it in the description panel. Clicking or focusing a skill pins it, and
the panel returns to the pinned skill when the pointer leaves the hovered skill. With nothing
pinned, the panel shows the first allocated skill, or the first skill of the tree. Keyboard focus
pins a skill; Enter or Space also adds a point in an editable planner.

## Description preview

The description panel (`SkillDetails.svelte`) previews a skill at a chosen level without changing
the allocation. In an editable planner it offers:

- **Hard points**: 0 up to the description's `HardPointCap` (the skill's own maximum). Zero
  represents an item-granted skill.
- **+ Skills**: bonus levels on top of the hard points.
- **Character level**: shown only for skills whose formulas read the character level (`ulvl`),
  such as Thorns, up to `CharacterLevelCap`.

The preview starts at the allocated rank (at least 1) with no bonus. The hard-point and bonus
inputs reset whenever the panel shows a different skill, including while another skill is hovered;
the character-level input is kept. Hard + bonus is limited to 100 (`SKILL_LEVEL_CAP` in
`src/lib/skill-points.ts`), a site-side limit because the export does not provide one. The
exported tables cover levels up to `Descriptions.MaxLevel`; above that, values hold at the last
exported level and the panel says so. The preview therefore accepts levels the allocation does not.

## How values are calculated

In the game's skill formulas, `lvl` is the effective level (hard + bonus) and `blvl` is hard
points only. Each numeric argument of a description line is resolved in this order
(`skillLineNumbers` in `src/lib/skill-points.ts`):

1. `valuesUlvl[arg][level - 1][characterLevel - 1]` for lines that read the character level. The
   default character level is the highest one exported.
2. `values2d[arg][hard][bonus]` for lines whose result depends on the hard/bonus split.
3. `values[arg][level - 1]`, indexed by the effective level.

Every axis is clamped to its last entry because the exporter trims constant tails.

Where a line ships `valuesCalc`, the website evaluates that formula live
(`src/lib/skill-calculation.ts`) and uses the result instead of the table value; this covers values
that read other skills' points, such as summon synergy caps. Otherwise synergy percentages come
from the line's `scaleCalc`, or from the skill's damage and length synergy formulas, and are
applied to the table value. Both read the other skills' points as the planner currently has them.

The evaluator supports integer arithmetic (`+ - * /` with truncating division), comparisons, the
ternary operator, `min` and `max`, the symbols `lvl`, `sklvl` and `blvl`, skill parameters
(`par1`… `pa20`), other calculations of the same skill (`clc1`… `clc10`) and `skill('code'.field)`
references.

## Limitations

- When a formula cannot be evaluated, the line silently keeps its exported table value and a
  synergy formula contributes 0%. No error is shown.
- `stat(...)` references evaluate to 0, because the planner has no character or item stats.
- The evaluator has no `ulvl` symbol, so `valuesCalc` formulas that read the character level fall
  back to the table value.
- Bonus `+skills` apply only to the previewed skill. Other skills, including synergy sources, use
  their allocated hard points.

## Read-only displays

- Build-guide readers show the planner read-only. Clicking still pins a skill for the description
  panel, but allocations cannot change.
- The character viewer passes the character's effective levels and hard points separately, and
  uses the saved character level for `ulvl` lines.
- Inline `[[skill:<id>:<rank>]]` links in build guides open a read-only description of that skill
  alone. The rank is split into hard points (up to the skill's `HardPointCap`) and bonus levels;
  other skills count as unallocated, and no equipment is applied.
