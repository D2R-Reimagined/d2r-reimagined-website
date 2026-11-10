<script lang="ts">
  import type { BlockKind } from '#lib/builds.js';
  import Menu from './ui/Menu.svelte';
  import Icon from './ui/Icon.svelte';
  import { sectionKindOrder, sectionKinds } from './sections/registry';
  let { open = $bindable(false), anchor, onpick }: { open?: boolean; anchor?: HTMLElement; onpick: (kind: BlockKind) => void } = $props();
</script>

<Menu bind:open {anchor} label="Add a section" wide>
  {#each sectionKindOrder as kind}
    {@const entry = sectionKinds[kind]}
    <button type="button" role="menuitem" class="ve-menu-item rich" onclick={() => onpick(kind)}>
      <Icon name={entry.icon} size={18} /><span><strong>{entry.label}</strong><small>{entry.description}</small></span>
    </button>
  {/each}
</Menu>
