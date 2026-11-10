<script lang="ts">
  // Title, summary and the "browse by" facts, edited where the reader shows them.
  import { buildBudgets, buildCategories, buildClasses, type BuildContent } from '#lib/builds.js';
  import AutoGrow from './ui/AutoGrow.svelte';
  import ChipGroup from './ChipGroup.svelte';
  import TagInput from './TagInput.svelte';
  let { content = $bindable(), onchangeclass }: { content: BuildContent; onchangeclass: (characterClass: string) => void } = $props();
  let summaryFocused = $state(false);
</script>

<header class="ve-essentials">
  <AutoGrow singleLine bind:value={content.title} class="ve-title" maxlength={120} placeholder="Untitled build" aria-label="Build title" />
  <div class="ve-summary-wrap">
    <AutoGrow bind:value={content.summary} class="ve-summary" maxlength={400} aria-label="Short summary"
      placeholder="Add a short summary: what does this build do, who is it for, and what makes it worth playing?"
      onfocus={() => summaryFocused = true} onblur={() => summaryFocused = false} />
    {#if summaryFocused}<small class="ve-counter" aria-live="polite">{content.summary.length}/400</small>{/if}
  </div>
  <dl class="ve-facts">
    <div><dt>Class</dt><dd><ChipGroup label="Class" options={buildClasses} value={content.characterClass} onselect={onchangeclass} /></dd></div>
    <div><dt>Focus</dt><dd><ChipGroup label="Build focus" options={buildCategories} value={content.category} onselect={(value) => content.category = value} /></dd></div>
    <div><dt>Budget</dt><dd><ChipGroup label="Gear budget" options={buildBudgets} value={content.budget} onselect={(value) => content.budget = value} /></dd></div>
    <div><dt>Patch</dt><dd><input class="ve-bare ve-patch" bind:value={content.patch} maxlength="40" placeholder="e.g. Reimagined 3.1" aria-label="Game version or patch" /></dd></div>
    <div><dt>Tags</dt><dd><TagInput bind:tags={content.tags} /></dd></div>
  </dl>
</header>
