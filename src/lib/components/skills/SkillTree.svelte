<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { Skill, SkillTab } from '$lib/types';
  import SkillNode from './SkillNode.svelte';

  let {
    tab,
    ranks,
    selectedSkillId,
    select,
    increase,
    decrease,
    canIncrease,
    readonly = false
  }: {
    tab: SkillTab;
    ranks: Record<number, number>;
    selectedSkillId: number | null;
    select: (skill: Skill) => void;
    increase: (skill: Skill, amount?: number) => void;
    decrease: (skill: Skill, amount?: number) => void;
    canIncrease: (skill: Skill) => boolean;
    readonly?: boolean;
  } = $props();

  const x = (column: number) => column * 100 - 50;
  const y = (row: number) => row * 100 - 50;
</script>

<section class="skill-tree" aria-label={$i18n.t(tab.NameKey)}>
  <header class="tree-heading">
    <span aria-hidden="true">◆</span>
    <h3 class="display-text">{$i18n.t(tab.NameKey)}</h3>
    <span aria-hidden="true">◆</span>
  </header>

  <div class="tree-grid">
    <svg class="connectors" viewBox="0 0 300 600" preserveAspectRatio="none" aria-hidden="true">
      {#each tab.Skills as skill}
        {#each skill.PrerequisiteIds as prerequisiteId}
          {@const prerequisite = tab.Skills.find((candidate) => candidate.Id === prerequisiteId)}
          {#if prerequisite}
            <line
              x1={x(prerequisite.Column)}
              y1={y(prerequisite.Row)}
              x2={x(skill.Column)}
              y2={y(skill.Row)}
              class:lit={(ranks[prerequisite.Id] ?? 0) > 0}
            />
          {/if}
        {/each}
      {/each}
    </svg>

    {#each tab.Skills as skill (skill.Id)}
      <SkillNode
        {skill}
        rank={ranks[skill.Id] ?? 0}
        selected={selectedSkillId === skill.Id}
        available={canIncrease(skill)}
        {select}
        {increase}
        {decrease}
        {readonly}
      />
    {/each}
  </div>
</section>

<style>
  .skill-tree {
    width: 21rem;
    flex: 0 0 21rem;
    overflow: hidden;
    border: 1px solid #665735;
    border-radius: 0.35rem;
    background:
      radial-gradient(circle at 50% 45%, rgb(92 27 18 / 0.22), transparent 52%),
      linear-gradient(90deg, transparent 49.5%, rgb(216 201 167 / 0.03) 50%, transparent 50.5%),
      linear-gradient(#171411, #090909);
    box-shadow: inset 0 0 32px #000;
  }

  .tree-heading {
    display: flex;
    min-height: 3.5rem;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    border-bottom: 1px solid #665735;
    padding: 0.65rem;
    color: #d2b56c;
    background: linear-gradient(180deg, #241c15, #100e0c);
    text-align: center;
  }

  .tree-heading h3 { color: #f1dfb0; font-size: 1rem; }
  .tree-heading span { font-size: 0.5rem; opacity: 0.7; }

  .tree-grid {
    position: relative;
    height: 40rem;
  }

  .tree-grid::before {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
    opacity: 0.1;
    background-image: radial-gradient(circle, #bca77d 0 1px, transparent 1.2px);
    background-size: 1.25rem 1.25rem;
  }

  .connectors {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .connectors line {
    stroke: #39362f;
    stroke-width: 4;
    vector-effect: non-scaling-stroke;
  }

  .connectors line.lit { stroke: #aa7938; }
</style>
