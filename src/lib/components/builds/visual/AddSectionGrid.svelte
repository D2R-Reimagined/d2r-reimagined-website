<script lang="ts">
  // The always-visible "Add a section" card at the end of the guide.
  import type { BlockKind } from '#lib/builds.js';
  import { limits } from '#lib/build-editor/document.js';
  import Icon from './ui/Icon.svelte';
  import { sectionKindOrder, sectionKinds } from './sections/registry';
  let { count, onpick }: { count: number; onpick: (kind: BlockKind) => void } = $props();
  const full = $derived(count >= limits.sections);
</script>

<div class="ve-add-grid" role="group" aria-labelledby="ve-add-grid-title">
  <p id="ve-add-grid-title" class="ve-eyebrow">ADD A SECTION</p>
  <div class="ve-add-grid-options">
    {#each sectionKindOrder as kind}
      {@const entry = sectionKinds[kind]}
      <button type="button" disabled={full} onclick={() => onpick(kind)}>
        <Icon name={entry.icon} size={20} /><span><strong>{entry.label}</strong><small>{entry.description}</small></span>
      </button>
    {/each}
  </div>
  <small class="ve-hint">{full ? `This setup has the maximum of ${limits.sections} sections. Remove one, or add another setup.` : `${count}/${limits.sections} sections in this setup`}</small>
</div>
