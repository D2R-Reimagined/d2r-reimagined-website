<script lang="ts">
  import { icons, type IconName } from './icons';
  let { name, size = 16 }: { name: IconName; size?: number } = $props();
</script>

<svg class="ve-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  {#each icons[name] as d}<path {d} />{/each}
</svg>

<style>
  .ve-icon { flex:none; display:block; }
</style>
