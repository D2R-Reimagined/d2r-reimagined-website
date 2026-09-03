<script lang="ts">
  let {
    checked,
    disabled = false,
    label,
    note,
    onToggle
  }: {
    checked: boolean;
    disabled?: boolean;
    label: string;
    note?: string;
    onToggle: (enabled: boolean) => void;
  } = $props();
</script>

<label class:role-control--locked={disabled} class="role-control" title={note}>
  <input
    type="checkbox"
    data-checkbox-appearance="switch"
    aria-label={label}
    {checked}
    {disabled}
    onchange={(event) => onToggle(event.currentTarget.checked)}
  />
  <span class="role-track" aria-hidden="true"></span>
  <span class:role-state--enabled={checked} class="role-state">
    {checked ? 'Enabled' : 'Disabled'}
  </span>
</label>

{#if note}
  <span class="role-note">{note}</span>
{/if}

<style>
  .role-control {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 8.25rem;
    cursor: pointer;
    user-select: none;
  }

  .role-control input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .role-track {
    position: relative;
    width: 3rem;
    height: 1.65rem;
    flex: none;
    border: 1px solid rgb(188 167 125 / 0.55);
    border-radius: 9999px;
    background: rgb(7 7 7 / 0.9);
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.65);
    transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }

  .role-track::after {
    position: absolute;
    top: 0.22rem;
    left: 0.23rem;
    width: 1.08rem;
    height: 1.08rem;
    border-radius: 9999px;
    background: var(--color-parchment-300);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.7);
    content: '';
    transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }

  .role-control input:checked + .role-track {
    border-color: rgb(76 194 56 / 0.95);
    background: rgb(76 194 56 / 0.25);
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(76 194 56 / 0.15), 0 0 12px rgb(76 194 56 / 0.2);
  }

  .role-control input:checked + .role-track::after {
    transform: translateX(1.43rem);
    background: var(--color-set);
    box-shadow: 0 0 8px rgb(76 194 56 / 0.75);
  }

  .role-control input:focus-visible + .role-track {
    outline: 2px solid var(--color-ember-400);
    outline-offset: 3px;
  }

  .role-control:not(.role-control--locked):hover .role-track {
    border-color: var(--color-ember-400);
  }

  .role-control--locked {
    cursor: not-allowed;
  }

  .role-state {
    color: var(--color-parchment-300);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .role-state--enabled {
    color: var(--color-set);
    text-shadow: 0 0 10px rgb(76 194 56 / 0.2);
  }

  .role-note {
    display: block;
    margin-top: 0.35rem;
    color: var(--color-parchment-300);
    font-size: 0.7rem;
  }
</style>
