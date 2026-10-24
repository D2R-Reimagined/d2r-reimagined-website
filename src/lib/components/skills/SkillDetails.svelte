<script lang="ts">
  import { i18n } from '$lib/i18n';
  import {
    applySkillSynergy,
    skillLineCalcValues,
    skillLineSynergyBonus,
    skillLineUnavailableStats
  } from '$lib/skill-calculation';
  import {
    clampSkillPoints,
    keepSkillPreviewOverride,
    skillBonusCap,
    skillHardPointCap,
    skillPointsFromRanks,
    skillPreviewPoints,
    skillReadsCharacterLevel,
    type SkillPoints,
    type SkillPreviewOverride
  } from '$lib/skill-points';
  import type { Skill, SkillDescriptionLine } from '$lib/types';

  let {
    skill,
    skills,
    ranks,
    synergyRanks = ranks,
    rank,
    baseRank = rank,
    points: fixedPoints,
    available,
    increase,
    decrease,
    readonly = false,
    headingLabel,
    characterLevel
  }: {
    skill: Skill | undefined;
    skills: Skill[];
    ranks: Record<number, number>;
    synergyRanks?: Record<number, number>;
    rank: number;
    baseRank?: number;
    /** Readonly views only: the exact hard / bonus split to render. Defaults to baseRank / rank. */
    points?: SkillPoints;
    available: boolean;
    increase: (skill: Skill, amount?: number) => void;
    decrease: (skill: Skill, amount?: number) => void;
    readonly?: boolean;
    headingLabel?: string;
    /** Character level for `ulvl` lines (Thorns). The planner lets the reader choose one. */
    characterLevel?: number;
  } = $props();

  // Hard points and +skills bonus are previewed independently, because the mod's formulas
  // read them separately (blvl vs lvl). Hard points start at the allocated rank (at least 1)
  // and the bonus at 0. The override sticks to its skill until that skill's allocation changes,
  // so hovering another skill and coming back keeps it.
  let override = $state<SkillPreviewOverride | null>(null);
  let failedIcon = $state('');
  // The planner has no character, so it previews the top exported level until one is chosen.
  let characterLevelOverride = $state<number | null>(null);

  let descriptions = $derived(skill?.Descriptions);
  let hardCap = $derived(skillHardPointCap(skill));
  let preview = $derived(
    readonly
      ? fixedPoints ? clampSkillPoints(skill, fixedPoints) : skillPointsFromRanks(skill, baseRank, rank)
      : skillPreviewPoints(skill, rank, override)
  );
  let bonusCap = $derived(skillBonusCap(preview.hard));
  let readsCharacterLevel = $derived(skillReadsCharacterLevel(skill));
  let characterLevelCap = $derived(descriptions?.CharacterLevelCap ?? 100);
  let previewCharacterLevel = $derived(
    readonly ? characterLevel : characterLevelOverride ?? characterLevel ?? characterLevelCap
  );
  let linePoints = $derived<SkillPoints>({ ...preview, characterLevel: previewCharacterLevel });
  // `ulvl` in calc expressions only reads a level the reader can see: the chosen one or the character's.
  let calcCharacterLevel = $derived(readsCharacterLevel ? previewCharacterLevel : characterLevel);
  let previewLevel = $derived(preview.hard + preview.bonus);
  let exportedLevel = $derived(descriptions?.MaxLevel ?? 0);
  let hasDescription = $derived(
    (descriptions?.Stats.length ?? 0) + (descriptions?.Details.length ?? 0) > 0
  );
  // The previewed skill's own rank comes from the preview; every other skill keeps its rank.
  let effectiveRanks = $derived(skill ? { ...ranks, [skill.Id]: previewLevel } : ranks);
  let hardRanks = $derived(skill ? { ...synergyRanks, [skill.Id]: preview.hard } : synergyRanks);

  // Stats the live formulas read but the site cannot supply; they count as 0 and are marked.
  let unavailableStats = $derived(
    [...new Set([...(descriptions?.Stats ?? []), ...(descriptions?.Details ?? []), ...(descriptions?.Synergies ?? [])]
      .flatMap(lineUnavailableStats))]
  );

  let icon = $derived(skill?.Icon ? `/data/${skill.Icon}` : '');
  $effect(() => {
    const kept = keepSkillPreviewOverride(override, skill, rank);
    if (kept !== override) override = kept;
  });

  function prerequisiteName(id: number): string {
    return $i18n.t(skills.find((candidate) => candidate.Id === id)?.NameKey ?? id);
  }

  function render(line: SkillDescriptionLine): string {
    const bonus = skill ? skillLineSynergyBonus(line, skill, skills, effectiveRanks, hardRanks, calcCharacterLevel) : 0;
    const live = skill ? skillLineCalcValues(line, skill, skills, effectiveRanks, hardRanks, calcCharacterLevel) : [];
    return $i18n.skillLine(line, linePoints, (value, index) => live[index] ?? applySkillSynergy(value, bonus));
  }

  function lineUnavailableStats(line: SkillDescriptionLine): string[] {
    return skill ? skillLineUnavailableStats(line, skill, skills, effectiveRanks, hardRanks, calcCharacterLevel) : [];
  }

  // Clearing a number input yields '' — hold the current value rather than snapping.
  function parsePoints(raw: string): number | null {
    const parsed = Number(raw);
    return raw === '' || !Number.isFinite(parsed) ? null : Math.trunc(parsed);
  }

  function chooseHard(raw: string): void {
    const hard = parsePoints(raw);
    if (hard === null) return;
    if (skill) override = { skillId: skill.Id, rank, points: clampSkillPoints(skill, { hard, bonus: preview.bonus }) };
  }

  function chooseBonus(raw: string): void {
    const bonus = parsePoints(raw);
    if (bonus === null) return;
    if (skill) override = { skillId: skill.Id, rank, points: clampSkillPoints(skill, { hard: preview.hard, bonus }) };
  }

  function chooseCharacterLevel(raw: string): void {
    const level = parsePoints(raw);
    if (level === null) return;
    characterLevelOverride = Math.min(Math.max(level, 1), characterLevelCap);
  }
</script>

<aside class="details panel rounded-lg" aria-live="polite">
  {#if skill}
    <div class="details-portrait" aria-hidden="true">
      {#if icon && failedIcon !== icon}
        <img src={icon} alt="" onerror={() => failedIcon = icon} />
      {:else}
        {$i18n.t(skill.NameKey).charAt(0).toUpperCase()}
      {/if}
    </div>
    <p class="display-text mt-4 text-xs uppercase tracking-[0.22em] text-ember-400">{headingLabel ?? (readonly ? 'Character skill' : 'Selected skill')}</p>
    <h2 class="display-text mt-2 text-2xl text-parchment-50">{$i18n.t(skill.NameKey)}</h2>
    {#if skill.DescriptionKey}
      <p class="mt-3 text-sm leading-6 text-parchment-200">{$i18n.t(skill.DescriptionKey)}</p>
    {/if}

    <dl class="mt-5 grid grid-cols-2 gap-2 border-y border-parchment-300/15 py-4 text-sm">
      <div>
        <dt class="text-parchment-300">Skill rank</dt>
        <dd class="mt-1 text-parchment-50">
          {#if readonly && rank !== baseRank}
            {rank} current <span class="text-parchment-300">({baseRank} base)</span>
          {:else}
            {rank} / {skill.MaxLevel || 20}
          {/if}
        </dd>
      </div>
      <div>
        <dt class="text-parchment-300">Required level</dt>
        <dd class="mt-1 text-parchment-50">{skill.RequiredLevel}</dd>
      </div>
    </dl>

    {#if hasDescription}
      <section class="mt-5">
        {#if !readonly}
          <div class="level-control">
            <label class="display-text text-xs uppercase tracking-wider text-parchment-300" for="skill-preview-hard">
              Hard points
            </label>
            <input
              id="skill-preview-hard"
              type="number"
              min="0"
              max={hardCap}
              value={preview.hard}
              oninput={(event) => chooseHard(event.currentTarget.value)}
              class="level-number"
            />
          </div>
          <input
            type="range"
            min="0"
            max={hardCap}
            value={preview.hard}
            aria-label={`Preview ${$i18n.t(skill.NameKey)} with hard points`}
            oninput={(event) => chooseHard(event.currentTarget.value)}
            class="level-slider"
          />
          <div class="level-control mt-3">
            <label class="display-text text-xs uppercase tracking-wider text-parchment-300" for="skill-preview-bonus">
              + Skills bonus
            </label>
            <input
              id="skill-preview-bonus"
              type="number"
              min={preview.hard === 0 ? 1 : 0}
              max={bonusCap}
              value={preview.bonus}
              oninput={(event) => chooseBonus(event.currentTarget.value)}
              class="level-number"
            />
          </div>
          <input
            type="range"
            min={preview.hard === 0 ? 1 : 0}
            max={bonusCap}
            value={preview.bonus}
            aria-label={`Preview ${$i18n.t(skill.NameKey)} with bonus skill levels`}
            oninput={(event) => chooseBonus(event.currentTarget.value)}
            class="level-slider"
          />
          {#if readsCharacterLevel}
            <div class="level-control mt-3">
              <label class="display-text text-xs uppercase tracking-wider text-parchment-300" for="skill-preview-character-level">
                Character level
              </label>
              <input
                id="skill-preview-character-level"
                type="number"
                min="1"
                max={characterLevelCap}
                value={previewCharacterLevel}
                oninput={(event) => chooseCharacterLevel(event.currentTarget.value)}
                class="level-number"
              />
            </div>
            <input
              type="range"
              min="1"
              max={characterLevelCap}
              value={previewCharacterLevel}
              aria-label={`Preview ${$i18n.t(skill.NameKey)} at character level`}
              oninput={(event) => chooseCharacterLevel(event.currentTarget.value)}
              class="level-slider"
            />
          {/if}
          <p class="level-hint">
            Level {previewLevel}: {preview.hard} hard + {preview.bonus} from gear.
            {#if preview.hard === 0}
              No hard points — an item-granted skill.
            {/if}
          </p>
        {:else if preview.bonus > 0}
          <p class="level-hint">Level {previewLevel}: {preview.hard} hard + {preview.bonus} from gear.</p>
        {/if}
        {#if readonly && readsCharacterLevel && characterLevel}
          <p class="level-hint">Shown at character level {characterLevel}.</p>
        {/if}
        {#if exportedLevel && previewLevel > exportedLevel}
          <p class="level-hint">Past the exported range — values hold at level {exportedLevel}.</p>
        {/if}

        <ul class="stat-lines mt-4">
          {#each descriptions?.Stats ?? [] as line, index (index)}
            <li>{render(line)}{#if lineUnavailableStats(line).length}*{/if}</li>
          {/each}
          {#each descriptions?.Details ?? [] as line, index (index)}
            <li class="detail">{render(line)}{#if lineUnavailableStats(line).length}*{/if}</li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if descriptions?.Synergies.length}
      <section class="mt-5 border-t border-parchment-300/15 pt-4">
        <h3 class="display-text text-xs uppercase tracking-wider text-parchment-300">Synergies</h3>
        <ul class="stat-lines synergy mt-2">
          {#each descriptions.Synergies as line, index (index)}
            <li>{render(line)}{#if lineUnavailableStats(line).length}*{/if}</li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if unavailableStats.length}
      <p class="level-hint mt-3">* Calculated without the character or equipment stats these formulas also read ({unavailableStats.join(', ')}); they count as 0 here, so in-game values can differ.</p>
    {/if}

    {#if skill.PrerequisiteIds.length}
      <div class="mt-4">
        <h3 class="display-text text-xs uppercase tracking-wider text-parchment-300">Prerequisites</h3>
        <p class="mt-1 text-sm text-requirement">{skill.PrerequisiteIds.map(prerequisiteName).join(', ')}</p>
      </div>
    {/if}

    {#if !readonly}
      <div class="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onclick={() => decrease(skill)} disabled={rank === 0} class="planner-button">− Remove</button>
        <button type="button" onclick={() => increase(skill)} disabled={!available} class="planner-button primary">+ Add</button>
      </div>
      {#if !available && rank < (skill.MaxLevel || 20)}
        <p class="mt-3 text-xs text-requirement">Allocate every prerequisite before adding a point here.</p>
      {/if}
      <p class="mt-5 text-xs leading-5 text-parchment-300">Click a skill to add one point; Ctrl-click adds five and Shift-click fills it to its maximum. Right-click removes points using the same modifiers.</p>
    {/if}
  {:else}
    <p class="text-parchment-300">Select a skill to preview it.</p>
  {/if}
</aside>

<style>
  .details { padding: 1.25rem; }
  .details-portrait {
    display: grid;
    width: 5rem;
    height: 5rem;
    place-items: center;
    border: 2px solid #9d8652;
    border-radius: 0.35rem;
    color: #f1dfb0;
    background: radial-gradient(circle, #6f281d, #100d0c 70%);
    box-shadow: inset 0 0 0 3px #090909, 0 0 24px rgb(228 90 53 / 0.2);
    font-family: var(--font-display);
    font-size: 2.5rem;
  }
  .details-portrait img { width: 100%; height: 100%; border-radius: 0.18rem; object-fit: cover; }

  .level-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .level-number {
    width: 4.25rem;
    border: 1px solid rgb(188 167 125 / 0.34);
    border-radius: 0.35rem;
    padding: 0.3rem 0.45rem;
    color: #f7f1e3;
    background: #0d0d0e;
    font-family: Arial, sans-serif;
    font-size: 0.85rem;
    text-align: center;
  }

  .level-number:focus { border-color: #e45a35; outline: none; }

  .level-slider {
    width: 100%;
    margin-top: 0.6rem;
    accent-color: #e45a35;
  }

  .level-hint {
    margin-top: 0.35rem;
    color: rgb(216 201 167 / 0.55);
    font-size: 0.7rem;
    line-height: 1.1rem;
  }

  .stat-lines {
    display: grid;
    gap: 0.3rem;
    border-top: 1px solid rgb(188 167 125 / 0.18);
    padding-top: 0.75rem;
    color: #d8c9a7;
    font-size: 0.82rem;
    line-height: 1.25rem;
    /* Some templates carry their own line breaks (e.g. dual-stat auras). */
    white-space: pre-line;
  }

  .stat-lines .detail { color: rgb(216 201 167 / 0.72); }
  .stat-lines.synergy { border-top: 0; padding-top: 0; color: rgb(216 201 167 / 0.8); }

  .planner-button {
    border: 1px solid rgb(188 167 125 / 0.34);
    border-radius: 0.35rem;
    padding: 0.65rem 0.5rem;
    color: #d8c9a7;
    background: #0d0d0e;
  }

  .planner-button.primary { border-color: rgb(228 90 53 / 0.65); color: #f0a38e; }
  .planner-button:hover:not(:disabled) { border-color: #e45a35; color: white; }
  .planner-button:disabled { cursor: not-allowed; opacity: 0.38; }
</style>
