<script lang="ts">
  import type { Skill, SkillClass } from '$lib/types';
  import SkillDetails from './SkillDetails.svelte';
  import SkillTree from './SkillTree.svelte';

  let {
    skillClass,
    ranks,
    baseRanks = ranks,
    readonly = false,
    floatDetails = false,
    increase = () => undefined,
    decrease = () => undefined,
    canIncrease = () => false
  }: {
    skillClass: SkillClass;
    ranks: Record<number, number>;
    baseRanks?: Record<number, number>;
    readonly?: boolean;
    floatDetails?: boolean;
    increase?: (skill: Skill, amount?: number) => void;
    decrease?: (skill: Skill, amount?: number) => void;
    canIncrease?: (skill: Skill) => boolean;
  } = $props();

  let selectedSkillId = $state<number | null>(null);
  let skills = $derived(skillClass.Tabs.flatMap((tab) => tab.Skills));
  let selectedSkill = $derived(
    skills.find((skill) => skill.Id === selectedSkillId)
      ?? skills.find((skill) => (ranks[skill.Id] ?? 0) > 0)
      ?? skills[0]
  );

  function select(skill: Skill): void {
    selectedSkillId = skill.Id;
  }
</script>

<div class="tree-view-layout" class:float-details={floatDetails}>
  <div class="tree-scroll" aria-label={`${skillClass.Class} skill trees`}>
    <div class="tree-row">
      {#each skillClass.Tabs as tab (tab.Page)}
        <SkillTree
          {tab}
          {ranks}
          {baseRanks}
          selectedSkillId={selectedSkill?.Id ?? null}
          {select}
          {increase}
          {decrease}
          {canIncrease}
          {readonly}
        />
      {/each}
    </div>
  </div>

  <div class="details-column">
    <SkillDetails
      skill={selectedSkill}
      {skills}
      {ranks}
      synergyRanks={baseRanks}
      rank={selectedSkill ? ranks[selectedSkill.Id] ?? 0 : 0}
      baseRank={selectedSkill ? baseRanks[selectedSkill.Id] ?? 0 : 0}
      available={selectedSkill ? canIncrease(selectedSkill) : false}
      {increase}
      {decrease}
      {readonly}
    />
  </div>
</div>

<style>
  .tree-view-layout { display: grid; min-width: 0; gap: 1rem; }
  .tree-scroll { min-width: 0; overflow-x: auto; padding: 0.25rem 0.25rem 1rem; }
  .tree-row { display: flex; width: max-content; gap: 0.8rem; margin: 0 auto; }
  .details-column { min-width: 0; }

  .float-details .tree-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(18rem, 1fr));
    width: 100%;
    min-width: 55.6rem;
    --skill-tree-width: 100%;
  }

  @media (min-width: 1280px) {
    .tree-view-layout { grid-template-columns: minmax(0, 1fr) 19rem; align-items: start; }
    .details-column {
      position: sticky;
      top: 5.5rem;
      max-height: calc(100vh - 7rem);
      overflow-y: auto;
    }
    .float-details { grid-template-columns: minmax(0, 1fr); }
    .float-details .details-column { position: static; max-height: none; overflow-y: visible; }
  }

  /* The build reader is 80rem wide; leave room for the details in its right gutter. */
  @media (min-width: 1920px) {
    .float-details {
      width: calc(100% + 20rem);
      grid-template-columns: minmax(0, 1fr) 19rem;
    }
    .float-details .details-column {
      position: sticky;
      top: 5.5rem;
      max-height: calc(100vh - 7rem);
      overflow-y: auto;
    }
  }
</style>
