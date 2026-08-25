<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { Skill, SkillDescriptionLine } from '$lib/types';

  let {
    skill,
    skills,
    rank,
    available,
    increase,
    decrease,
    readonly = false
  }: {
    skill: Skill | undefined;
    skills: Skill[];
    rank: number;
    available: boolean;
    increase: (skill: Skill, amount?: number) => void;
    decrease: (skill: Skill, amount?: number) => void;
    readonly?: boolean;
  } = $props();

  // The preview follows the points you have allocated, so the panel answers "what do I get
  // for this next point?" without any fiddling. Dragging the slider past that — into the
  // levels +skills gear grants — sticks until the allocation changes again.
  let previewOverride = $state<number | null>(null);
  let failedIcon = $state('');

  let descriptions = $derived(skill?.Descriptions);
  let maxPreviewLevel = $derived(descriptions?.MaxLevel ?? skill?.MaxLevel ?? 20);
  let previewLevel = $derived(Math.min(Math.max(previewOverride ?? rank, 1), maxPreviewLevel));
  let hasDescription = $derived(
    (descriptions?.Stats.length ?? 0) + (descriptions?.Details.length ?? 0) > 0
  );

  // Reading both values inside the effect is what makes the override reset when either changes.
  let allocation = $derived(`${skill?.Id ?? ''}:${rank}`);
  let icon = $derived(skill?.Icon ? `/data/${skill.Icon}` : '');
  $effect(() => {
    void allocation;
    previewOverride = null;
  });

  function prerequisiteName(id: number): string {
    return $i18n.t(skills.find((candidate) => candidate.Id === id)?.NameKey ?? id);
  }

  function render(line: SkillDescriptionLine): string {
    return $i18n.skillLine(line, previewLevel);
  }

  // Clearing the number input yields '' — hold the current level rather than snapping to 1.
  function choosePreviewLevel(raw: string): void {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || raw === '') return;
    previewOverride = Math.min(Math.max(Math.trunc(parsed), 1), maxPreviewLevel);
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
    <p class="display-text mt-4 text-xs uppercase tracking-[0.22em] text-ember-400">{readonly ? 'Character skill' : 'Selected skill'}</p>
    <h2 class="display-text mt-2 text-2xl text-parchment-50">{$i18n.t(skill.NameKey)}</h2>
    {#if skill.DescriptionKey}
      <p class="mt-3 text-sm leading-6 text-parchment-200">{$i18n.t(skill.DescriptionKey)}</p>
    {/if}

    <dl class="mt-5 grid grid-cols-2 gap-2 border-y border-parchment-300/15 py-4 text-sm">
      <div>
        <dt class="text-parchment-300">Skill rank</dt>
        <dd class="mt-1 text-parchment-50">{rank} / {skill.MaxLevel || 20}</dd>
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
            <label class="display-text text-xs uppercase tracking-wider text-parchment-300" for="skill-preview-level">
              Preview at level
            </label>
            <input
              id="skill-preview-level"
              type="number"
              min="1"
              max={maxPreviewLevel}
              value={previewLevel}
              oninput={(event) => choosePreviewLevel(event.currentTarget.value)}
              class="level-number"
            />
          </div>
          <input
            type="range"
            min="1"
            max={maxPreviewLevel}
            value={previewLevel}
            aria-label={`Preview ${$i18n.t(skill.NameKey)} at skill level`}
            oninput={(event) => choosePreviewLevel(event.currentTarget.value)}
            class="level-slider"
          />
          <p class="level-hint">
            {#if previewLevel > (skill.MaxLevel || 20)}
              +{previewLevel - (skill.MaxLevel || 20)} above the hard-point cap — reachable with +skills gear.
            {:else}
              Slide past {skill.MaxLevel || 20} to see what +skills gear adds.
            {/if}
          </p>
        {/if}

        <ul class="stat-lines mt-4">
          {#each descriptions?.Stats ?? [] as line, index (index)}
            <li>{render(line)}</li>
          {/each}
          {#each descriptions?.Details ?? [] as line, index (index)}
            <li class="detail">{render(line)}</li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if descriptions?.Synergies.length}
      <section class="mt-5 border-t border-parchment-300/15 pt-4">
        <h3 class="display-text text-xs uppercase tracking-wider text-parchment-300">Synergies</h3>
        <ul class="stat-lines synergy mt-2">
          {#each descriptions.Synergies as line, index (index)}
            <li>{render(line)}</li>
          {/each}
        </ul>
      </section>
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
