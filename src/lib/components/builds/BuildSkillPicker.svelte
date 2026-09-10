<script lang="ts">
  import { untrack } from 'svelte';
  import { loadSkillClasses } from '$lib/skills';
  import { i18n } from '$lib/i18n';
  import { skillPreviewRank } from '$lib/build-skills';
  import type { SkillClass } from '$lib/types';

  let { characterClass, onchoose }: { characterClass: string; onchoose: (id: number, rank: number) => void } = $props();
  let selectedClass = $state(untrack(() => characterClass));
  let search = $state('');
  let rank = $state(1);
  let classes = $state<SkillClass[]>([]);
  let loading = $state(true);
  let error = $state('');
  let attempt = $state(0);
  $effect(() => {
    void attempt;
    let active = true;
    loading = true; error = '';
    loadSkillClasses().then(value => { if (active) classes = value; })
      .catch(() => { if (active) error = 'Unable to load skills.'; })
      .finally(() => { if (active) loading = false; });
    return () => { active = false; };
  });
  let results = $derived(classes.filter(entry => !selectedClass || entry.Class === selectedClass)
    .flatMap(entry => entry.Tabs.flatMap(tab => tab.Skills.map(skill => ({ skill, className: entry.Class }))))
    .filter(({ skill }) => $i18n.t(skill.NameKey).toLowerCase().includes(search.toLowerCase())));
</script>

<div class="picker panel">
  <div class="picker-fields">
    <label>Skill class<select class="field" bind:value={selectedClass}><option value="">All classes</option>{#each classes as entry}<option value={entry.Class}>{$i18n.t(entry.NameKey)}</option>{/each}</select></label>
    <label>Find a skill<input class="field" bind:value={search} placeholder="Search skill names…" /></label>
    <label>Tooltip level<input class="field" type="number" min="1" max="99" bind:value={rank} /></label>
  </div>
  {#if loading}<p>Loading skills…</p>
  {:else if error}<p role="alert">{error} <button type="button" onclick={() => attempt++}>Retry</button></p>
  {:else}<div class="results">{#each results as { skill, className }}<button type="button" onclick={() => onchoose(skill.Id, skillPreviewRank(skill, rank))}>{$i18n.t(skill.NameKey)} <span>{className} ＋</span></button>{/each}
    {#if !results.length}<p>No skills found.</p>{/if}</div>{/if}
  <p>Shows stats at the selected level without equipment or allocated synergy bonuses.</p>
</div>

<style>
  .picker { padding:1rem; border-radius:6px; margin:.8rem 0; }
  .picker-fields { display:grid; grid-template-columns:1fr 2fr 1fr; gap:.7rem; }
  label { display:grid; gap:.4rem; color:var(--color-parchment-200); }
  input,select { min-width:0; width:100%; }
  .results { display:grid; max-height:230px; overflow:auto; margin-top:.7rem; }
  button { display:flex; justify-content:space-between; text-align:left; padding:.6rem; color:var(--color-parchment-200); border-bottom:1px solid #ffffff0b; gap:1rem; }
  button:hover { background:#ffffff08; } p { padding:.5rem; color:var(--color-parchment-200); }
  @media(max-width:600px){.picker-fields{grid-template-columns:1fr;}}
</style>
