<script lang="ts">
  // A row of pill buttons where exactly one is chosen (class, focus, budget).
  let { label, options, value, onselect }: {
    label: string; options: readonly string[]; value: string; onselect: (value: string) => void;
  } = $props();
</script>

<div class="ve-chips" role="group" aria-label={label}>
  {#each options as option}
    <button type="button" class="ve-pill" aria-pressed={value === option} onclick={() => onselect(option)}>{option}</button>
  {/each}
  {#if value && !options.includes(value)}<span class="ve-pill" aria-current="true">{value}</span>{/if}
</div>
