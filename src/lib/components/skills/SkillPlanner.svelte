<script lang="ts">
  import { onMount } from 'svelte';

  import { i18n } from '$lib/i18n';
  import type { Skill, SkillClass } from '$lib/types';
  import SkillTreeView from './SkillTreeView.svelte';

  let { classes, ranks = $bindable({}), classCode, persist = true, readonly = false, compact = false }: {
    classes: SkillClass[]; ranks?: Record<number, number>; classCode?: string;
    persist?: boolean; readonly?: boolean; compact?: boolean;
  } = $props();

  const storageKey = 'd2r-reimagined-skill-planner-v1';
  let activeClassCode = $state('');
  let hydrated = $state(false);

  let activeClass = $derived(classes.find((entry) => entry.ClassCode === (classCode ?? activeClassCode)) ?? classes[0]);
  let activeSkills = $derived(activeClass?.Tabs.flatMap((tab) => tab.Skills) ?? []);
  let totalPoints = $derived(activeSkills.reduce((total, skill) => total + (ranks[skill.Id] ?? 0), 0));

  onMount(() => {
    if (!persist) { hydrated = true; return; }
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
    if (!hydrated || !persist || readonly) return;
    try { localStorage.setItem(storageKey, JSON.stringify(ranks)); } catch { /* storage is optional */ }
  });

  function chooseClass(skillClass: SkillClass): void {
    activeClassCode = skillClass.ClassCode;
  }

  function canIncrease(skill: Skill): boolean {
    if (readonly) return false;
    const rank = ranks[skill.Id] ?? 0;
    return rank < (skill.MaxLevel || 20)
      && skill.PrerequisiteIds.every((id) => (ranks[id] ?? 0) > 0);
  }

  function increase(skill: Skill, amount = 1): void {
    if (!canIncrease(skill)) return;
    const rank = ranks[skill.Id] ?? 0;
    ranks = { ...ranks, [skill.Id]: Math.min(rank + amount, skill.MaxLevel || 20) };
  }

  function decrease(skill: Skill, amount = 1): void {
    if (readonly) return;
    const rank = ranks[skill.Id] ?? 0;
    if (rank === 0) return;
    const hasAllocatedDependent = activeSkills.some((candidate) =>
      (ranks[candidate.Id] ?? 0) > 0 && candidate.PrerequisiteIds.includes(skill.Id));
    const minimumRank = hasAllocatedDependent ? 1 : 0;
    if (rank === minimumRank) return;
    ranks = { ...ranks, [skill.Id]: Math.max(rank - amount, minimumRank) };
  }

  function resetClass(): void {
    const next = { ...ranks };
    activeSkills.forEach((skill) => delete next[skill.Id]);
    ranks = next;
  }
</script>

<section class:compact class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-5">
  {#if !classCode}
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
  {/if}

  <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-parchment-300/15 py-3">
    <p class="text-parchment-300"><span class="text-parchment-50">{totalPoints}</span> skill points allocated to {$i18n.t(activeClass?.NameKey)}</p>
    {#if !readonly}<button type="button" onclick={resetClass} disabled={totalPoints === 0} class="reset-button">Reset class</button>{/if}
  </div>

  {#if activeClass}
    <div class="mt-6">
      {#key activeClass.ClassCode}
        <SkillTreeView skillClass={activeClass} {ranks} {increase} {decrease} {canIncrease} {readonly} />
      {/key}
    </div>
  {/if}
</section>

<style>
  .compact { padding:0; }
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

  @media (min-width: 768px) {
    .class-tabs { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .class-tab { flex-direction: column; }
  }

  @media (max-width: 520px) {
    .class-tab { font-size: 0.75rem; }
    .class-crest { display: none; }
  }
</style>
