<script lang="ts">
  import SkillPlanner from '$lib/components/skills/SkillPlanner.svelte';
  import { skillPlannerDefinition } from '$lib/types';

  let { data } = $props();
</script>

<svelte:head>
  <title>Skill Planner — D2R Reimagined</title>
  <meta name="description" content={skillPlannerDefinition.description} />
  <meta property="og:title" content="Skill Planner — D2R Reimagined" />
  <meta property="og:description" content={skillPlannerDefinition.description} />
  <meta name="twitter:title" content="Skill Planner — D2R Reimagined" />
  <meta name="twitter:description" content={skillPlannerDefinition.description} />
</svelte:head>

<section class="border-b border-parchment-300/15 bg-black/25">
  <div class="data-page-hero mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
    <h1 class="display-text text-4xl sm:text-6xl">{skillPlannerDefinition.title}</h1>
    <p class="data-page-description mx-auto mt-4 max-w-3xl text-lg text-parchment-300">{skillPlannerDefinition.description}</p>
  </div>
</section>

<SkillPlanner classes={data.classes} />
