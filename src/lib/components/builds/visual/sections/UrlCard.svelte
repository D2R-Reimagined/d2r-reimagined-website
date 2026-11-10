<script lang="ts">
  // Empty state for media sections: a dashed card with one URL field.
  // Pressing Enter or pasting a valid link calls `oncommit`; the parent decides what to show.
  import Icon from '../ui/Icon.svelte';
  import type { IconName } from '../ui/icons';
  let { url = $bindable(''), icon, label, invalid, valid, input = $bindable(), oncommit, oncancel, onfocusin, onfocusout }: {
    url?: string; icon: IconName; label: string; invalid: string;
    valid: (value: string) => boolean; input?: HTMLInputElement;
    oncommit: () => void; oncancel?: () => void; onfocusin?: () => void; onfocusout?: () => void;
  } = $props();
  let focused = $state(false);
  const showError = $derived(!focused && !!url.trim() && !valid(url));
</script>

<div class="ve-dropzone" class:error={showError}>
  <Icon name={icon} size={22} />
  <label>
    <span>{label}</span>
    <input bind:this={input} class="ve-bare ve-url" type="url" inputmode="url" maxlength="2000" placeholder="https://…"
      bind:value={url} aria-invalid={showError}
      onfocus={() => { focused = true; onfocusin?.(); }}
      onblur={() => { focused = false; onfocusout?.(); }}
      onkeydown={(event) => {
        if (event.key === 'Enter') { event.preventDefault(); if (valid(url)) oncommit(); else focused = false; }
        if (event.key === 'Escape' && oncancel) { event.preventDefault(); event.stopPropagation(); oncancel(); }
      }}
      onpaste={() => setTimeout(() => { if (input && valid(input.value)) oncommit(); })} />
  </label>
  {#if showError}<p class="ve-issue">{invalid}</p>{/if}
</div>
