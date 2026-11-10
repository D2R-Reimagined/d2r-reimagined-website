<script lang="ts">
  // The thin "+ Add section" line that appears when hovering the gap between two sections.
  import type { BlockKind } from '#lib/builds.js';
  import Icon from './ui/Icon.svelte';
  import AddSectionMenu from './AddSectionMenu.svelte';
  let { disabled = false, onpick }: { disabled?: boolean; onpick: (kind: BlockKind) => void } = $props();
  let open = $state(false);
  let button = $state<HTMLButtonElement>();
</script>

<div class="ve-between" class:open>
  <span class="ve-anchor">
    <button type="button" bind:this={button} class="ve-between-button" aria-haspopup="menu" aria-expanded={open} {disabled}
      title={disabled ? 'This setup has the maximum of 40 sections' : undefined} onclick={() => open = !open}>
      <Icon name="plus" size={13} /> Add section
    </button>
    <AddSectionMenu bind:open anchor={button} {onpick} />
  </span>
</div>
