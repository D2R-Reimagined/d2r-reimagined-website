<script lang="ts">
  import M from '$lib/loot-filter/model.js';
  import { playSound, stopSound, soundPreview } from '$lib/loot-filter/sound-preview';
  let { value, onchange }: { value?: string; onchange: (value?: string) => void } = $props();
  let audition = $state(true);
  function choose(sound: string) { onchange(sound); if (audition) void playSound(sound); else stopSound(); }
</script>

<fieldset class="space-y-3 rounded border border-parchment-300/20 p-3">
  <legend class="px-1 text-xs uppercase tracking-widest text-parchment-300">Drop sound</legend>
  <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-parchment-300">
    <label class="flex items-center gap-2"><input type="checkbox" bind:checked={audition} />Preview on selection</label>
    <button class="text-ember-400 hover:underline" aria-pressed={!value} onclick={() => { onchange(undefined); stopSound(); }}>Original sound</button>
  </div>
  <div class="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Drop sounds">
    {#each M.DROP_SOUNDS as sound}
      <button class="rounded border border-parchment-300/25 px-2 py-3 text-sm hover:border-ember-400" class:selected={value === sound}
        aria-label={`Select and ${audition ? 'preview' : 'use'} ${sound}`} aria-pressed={value === sound} onclick={() => choose(sound)}>
        <span aria-hidden="true">{$soundPreview.playing === sound ? '◼' : '♪'}</span> {sound.slice(-2)}
      </button>
    {/each}
  </div>
  <div class="flex flex-wrap gap-4 text-xs text-parchment-300">
    <span>{value || 'Original sound'} selected</span>
    {#if value}<button class="text-ember-400 hover:underline" onclick={() => playSound(value!)}>Replay selected</button>{/if}
    {#if $soundPreview.playing}<button class="text-ember-400 hover:underline" onclick={stopSound}>Stop preview</button>{/if}
  </div>
  {#if $soundPreview.error}<p role="status" class="text-xs text-requirement">{$soundPreview.error}</p>{/if}
</fieldset>

<style>.selected { border-color: var(--color-ember-400); background: color-mix(in srgb, var(--color-ember-700) 40%, transparent); }</style>
