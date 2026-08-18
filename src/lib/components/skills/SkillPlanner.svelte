<script lang="ts">
  import { onMount } from 'svelte';

  import { i18n } from '$lib/i18n';
  import type { Skill, SkillClass } from '$lib/types';
  import SkillDetails from './SkillDetails.svelte';
  import SkillTree from './SkillTree.svelte';

  let { classes }: { classes: SkillClass[] } = $props();

  const storageKey = 'd2r-reimagined-skill-planner-v1';
  let activeClassCode = $state('');
  let selectedSkillId = $state<number | null>(null);
  let ranks = $state<Record<number, number>>({});
  let hydrated = $state(false);

  let activeClass = $derived(classes.find((entry) => entry.ClassCode === activeClassCode) ?? classes[0]);
  let activeSkills = $derived(activeClass?.Tabs.flatMap((tab) => tab.Skills) ?? []);
  let selectedSkill = $derived(activeSkills.find((skill) => skill.Id === selectedSkillId) ?? activeSkills[0]);
  let effectiveSelectedSkillId = $derived(selectedSkill?.Id ?? null);
  let totalPoints = $derived(activeSkills.reduce((total, skill) => total + (ranks[skill.Id] ?? 0), 0));

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, unknown>;
      const validIds = new Map(classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills)).map((skill) => [skill.Id, skill]));
      const restored: Record<number, number> = {};
      for (const [rawId, rawRank] of Object.entries(saved)) {
        const id = Number(rawId);
        const skill = validIds.get(id);
        if (!skill || typeof rawRank !== 'number') continue;
        restored[id] = Math.max(0, Math.min(Math.trunc(rawRank), skill.MaxLevel || 20));
      }
      ranks = restored;
    } catch { /* storage is optional */ }
    hydrated = true;
  });

  $effect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(storageKey, JSON.stringify(ranks)); } catch { /* storage is optional */ }
  });

  function chooseClass(skillClass: SkillClass): void {
    activeClassCode = skillClass.ClassCode;
    selectedSkillId = skillClass.Tabs[0]?.Skills[0]?.Id ?? null;
  }

  function select(skill: Skill): void {
    selectedSkillId = skill.Id;
  }

  function canIncrease(skill: Skill): boolean {
    const rank = ranks[skill.Id] ?? 0;
    return rank < (skill.MaxLevel || 20)
      && skill.PrerequisiteIds.every((id) => (ranks[id] ?? 0) > 0);
  }

  function increase(skill: Skill): void {
    selectedSkillId = skill.Id;
    if (!canIncrease(skill)) return;
    ranks = { ...ranks, [skill.Id]: (ranks[skill.Id] ?? 0) + 1 };
  }

  function decrease(skill: Skill): void {
    selectedSkillId = skill.Id;
    const rank = ranks[skill.Id] ?? 0;
    if (rank === 0) return;
    const hasAllocatedDependent = rank === 1 && activeSkills.some((candidate) =>
      (ranks[candidate.Id] ?? 0) > 0 && candidate.PrerequisiteIds.includes(skill.Id));
    if (hasAllocatedDependent) return;
    ranks = { ...ranks, [skill.Id]: rank - 1 };
  }

  function resetClass(): void {
    const next = { ...ranks };
    activeSkills.forEach((skill) => delete next[skill.Id]);
    ranks = next;
  }
</script>

<section class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-5">
  <div class="class-tabs panel rounded-lg p-2" role="tablist" aria-label="Character classes">
    {#each classes as skillClass}
      <button
        type="button"
        role="tab"
        aria-selected={activeClass?.ClassCode === skillClass.ClassCode}
        class:active={activeClass?.ClassCode === skillClass.ClassCode}
        class="class-tab"
        onclick={() => chooseClass(skillClass)}
      >
        <span class="class-crest" aria-hidden="true">{skillClass.ClassCode.toUpperCase()}</span>
        <span>{$i18n.t(skillClass.NameKey)}</span>
      </button>
    {/each}
  </div>

  <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-parchment-300/15 py-3">
    <p class="text-parchment-300"><span class="text-parchment-50">{totalPoints}</span> skill points allocated to {$i18n.t(activeClass?.NameKey)}</p>
    <button type="button" onclick={resetClass} disabled={totalPoints === 0} class="reset-button">Reset class</button>
  </div>

  {#each classes as skillClass}
    <section
      class:hidden={activeClass?.ClassCode !== skillClass.ClassCode}
      aria-hidden={activeClass?.ClassCode !== skillClass.ClassCode}
      class="planner-layout mt-6"
    >
      <div class="tree-scroll" aria-label={`${$i18n.t(skillClass.NameKey)} skill trees`}>
        <div class="tree-row">
          {#each skillClass.Tabs as tab (tab.Page)}
            <SkillTree
              {tab}
              {ranks}
              selectedSkillId={effectiveSelectedSkillId}
              {select}
              {increase}
              {decrease}
              {canIncrease}
            />
          {/each}
        </div>
      </div>

      {#if activeClass?.ClassCode === skillClass.ClassCode}
        <div class="details-column">
          <SkillDetails
            skill={selectedSkill}
            skills={activeSkills}
            rank={selectedSkill ? ranks[selectedSkill.Id] ?? 0 : 0}
            available={selectedSkill ? canIncrease(selectedSkill) : false}
            {increase}
            {decrease}
          />
        </div>
      {/if}
    </section>
  {/each}
</section>

<style>
  .class-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .class-tab {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
    padding: 0.55rem 0.65rem;
    color: #bca77d;
    transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
  }

  .class-tab:hover { color: white; background: rgb(255 255 255 / 0.04); }
  .class-tab.active { border-color: #8f6d36; color: #f1dfb0; background: linear-gradient(#382119, #17110e); }

  .class-crest {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid #76613b;
    border-radius: 50%;
    background: #0b0a09;
    font-family: Arial, sans-serif;
    font-size: 0.58rem;
    letter-spacing: 0.04em;
  }

  .reset-button {
    border: 1px solid rgb(228 90 53 / 0.55);
    border-radius: 0.35rem;
    padding: 0.45rem 0.85rem;
    color: #e89077;
  }

  .reset-button:hover:not(:disabled) { color: white; background: #7b1d18; }
  .reset-button:disabled { opacity: 0.35; }

  .planner-layout { display: grid; min-width: 0; gap: 1rem; }
  .planner-layout.hidden { display: none; }
  .tree-scroll { min-width: 0; overflow-x: auto; padding: 0.25rem 0.25rem 1rem; }
  .tree-row { display: flex; width: max-content; gap: 0.8rem; margin: 0 auto; }
  .details-column { min-width: 0; }

  @media (min-width: 768px) {
    .class-tabs { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .class-tab { flex-direction: column; }
  }

  @media (min-width: 1280px) {
    .planner-layout { grid-template-columns: minmax(0, 1fr) 19rem; align-items: start; }
    .details-column { position: sticky; top: 5.5rem; }
  }

  @media (max-width: 520px) {
    .class-tab { font-size: 0.75rem; }
    .class-crest { display: none; }
  }
</style>
