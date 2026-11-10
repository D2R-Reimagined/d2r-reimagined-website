<script lang="ts">
  import type { BuildBlock } from '#lib/builds.js';
  import SkillPlanner from '#lib/components/skills/SkillPlanner.svelte';
  import { visualEditor } from '../context';
  import SectionNotes from './SectionNotes.svelte';
  let { block = $bindable() }: { block: BuildBlock } = $props();
  const editor = visualEditor();
  const skillClass = $derived(editor.classes.find((c) => c.Class === editor.characterClass));
</script>

{#if skillClass}
  <div class="ve-embed ve-skills"><SkillPlanner classes={[skillClass]} classCode={skillClass.ClassCode} bind:ranks={block.ranks} persist={false} compact floatDetails /></div>
{:else}
  <p class="ve-hint">{editor.skillError || 'Loading skill planner…'}</p>
{/if}
<SectionNotes bind:block />
