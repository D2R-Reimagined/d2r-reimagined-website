<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { Skill } from '$lib/types';

  let {
    skill,
    skills,
    rank,
    available,
    increase,
    decrease
  }: {
    skill: Skill | undefined;
    skills: Skill[];
    rank: number;
    available: boolean;
    increase: (skill: Skill, amount?: number) => void;
    decrease: (skill: Skill, amount?: number) => void;
  } = $props();

  function prerequisiteName(id: number): string {
    return $i18n.t(skills.find((candidate) => candidate.Id === id)?.NameKey ?? id);
  }
</script>

<aside class="details panel rounded-lg" aria-live="polite">
  {#if skill}
    <div class="details-portrait" aria-hidden="true">{$i18n.t(skill.NameKey).charAt(0).toUpperCase()}</div>
    <p class="display-text mt-4 text-xs uppercase tracking-[0.22em] text-ember-400">Selected skill</p>
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

    {#if skill.PrerequisiteIds.length}
      <div class="mt-4">
        <h3 class="display-text text-xs uppercase tracking-wider text-parchment-300">Prerequisites</h3>
        <p class="mt-1 text-sm text-requirement">{skill.PrerequisiteIds.map(prerequisiteName).join(', ')}</p>
      </div>
    {/if}

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" onclick={() => decrease(skill)} disabled={rank === 0} class="planner-button">− Remove</button>
      <button type="button" onclick={() => increase(skill)} disabled={!available} class="planner-button primary">+ Add</button>
    </div>
    {#if !available && rank < (skill.MaxLevel || 20)}
      <p class="mt-3 text-xs text-requirement">Allocate every prerequisite before adding a point here.</p>
    {/if}
    <p class="mt-5 text-xs leading-5 text-parchment-300">Click a skill to add one point; Ctrl-click adds five and Shift-click fills it to its maximum. Right-click removes points using the same modifiers.</p>
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
