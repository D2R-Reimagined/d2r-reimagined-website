<script lang="ts">
  import M from '$lib/loot-filter/model.js';
  let { label, value, onchange }: { label: string; value: string; onchange: (value: string) => void } = $props();
  const color = $derived(M.rgbaToHex(value));
</script>

<div class="space-y-1.5">
  <span class="block text-xs text-parchment-300">{label}</span>
  <div class="flex gap-2">
    <input type="color" class="h-10 w-11 shrink-0 rounded border border-parchment-300/25 bg-abyss-950 p-1" aria-label={`${label} color`} value={color.hex} oninput={event => onchange(M.rgbaString(event.currentTarget.value, color.alpha))} />
    <input type="number" class="field min-w-0 !py-2" min="0" max="1" step="0.05" aria-label={`${label} opacity`} value={color.alpha} oninput={event => onchange(M.rgbaString(color.hex, event.currentTarget.value))} />
  </div>
  <input class="field !py-2 font-mono text-xs" aria-label={`${label} RGBA`} {value} oninput={event => onchange(event.currentTarget.value)} />
</div>
