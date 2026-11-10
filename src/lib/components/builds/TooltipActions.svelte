<script lang="ts">
  // Header strip for item and skill tooltips: what the preview is, plus pin and close.
  let { label, subject, pinned, onpin, onclose }: {
    /** Short kind shown on the left, e.g. "Item" or "Skill". */
    label: string;
    /** Name used in the button labels for screen readers. */
    subject: string;
    pinned: boolean;
    onpin: () => void;
    onclose: () => void;
  } = $props();
</script>

<span class="tooltip-bar">
  <span class="label">{pinned ? `${label} · pinned` : label}</span>
  <button type="button" class="icon" class:active={pinned} aria-pressed={pinned} onclick={onpin}
    aria-label={pinned ? `Unpin ${subject}` : `Pin ${subject} open`} title={pinned ? 'Unpin' : 'Keep open'}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 1.75h4M6.75 1.75v4.1L4.25 8.6v1.15h7.5V8.6L9.25 5.85v-4.1M8 9.75v4.5" />
    </svg>
  </button>
  <button type="button" class="icon" onclick={onclose} aria-label={`Close ${subject}`} title="Close">
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
  </button>
</span>

<style>
  .tooltip-bar {
    position:sticky; top:0; z-index:1; display:flex; align-items:center; gap:2px;
    padding:4px 4px 4px 12px; background:var(--color-abyss-850);
    border-bottom:1px solid color-mix(in srgb, var(--color-parchment-300) 18%, transparent);
  }
  .label {
    flex:1; min-width:0; font-size:11px; line-height:1.5; letter-spacing:.18em; text-transform:uppercase;
    color:var(--color-parchment-300); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .icon {
    display:grid; place-items:center; width:28px; height:28px; border-radius:5px; cursor:pointer;
    color:var(--color-parchment-300); transition:color .12s, background-color .12s;
  }
  .icon:hover { color:var(--color-parchment-50); background:color-mix(in srgb, var(--color-parchment-300) 12%, transparent); }
  .icon.active { color:var(--color-ember-400); }
  .icon.active svg path { fill:currentColor; fill-opacity:.25; }
  svg { width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }
</style>
