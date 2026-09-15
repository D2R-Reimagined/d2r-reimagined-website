<script lang="ts">
  type Option = { value: string; label: string };

  let { id, label, placeholder, options, value = $bindable('') }: {
    id: string;
    label: string;
    placeholder: string;
    options: Option[];
    value?: string;
  } = $props();

  let open = $state(false);
  let query = $state('');
  let active = $state(0);
  let searchInput: HTMLInputElement;
  let container: HTMLDivElement;
  let trigger: HTMLButtonElement;
  let popup: HTMLDivElement;
  let popupStyle = $state('');
  const choices = $derived([{ value: '', label: placeholder }, ...options]);
  const matches = $derived(choices.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  const selectedLabel = $derived(choices.find((option) => option.value === value)?.label ?? placeholder);

  function show() {
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    const height = Math.min(300, Math.max(160, (below >= 220 ? below : above) - 12));
    const top = below >= 220 || below >= above ? rect.bottom + 4 : rect.top - height - 4;
    const width = Math.min(Math.max(rect.width, 224), window.innerWidth - 16);
    const left = Math.min(rect.left, window.innerWidth - width - 8);
    popupStyle = `left:${Math.max(8, left)}px;top:${Math.max(4, top)}px;width:${width}px;max-height:${height}px`;
    open = true;
    query = '';
    active = 0;
    popup.showPopover();
    requestAnimationFrame(() => searchInput?.focus());
  }

  function hide() {
    if (popup.matches(':popover-open')) popup.hidePopover();
    open = false;
  }

  function choose(option: Option) {
    value = option.value;
    hide();
    query = '';
    trigger.focus();
  }

  function keys(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      hide();
      trigger.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = Math.max(0, Math.min(matches.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)));
      container.querySelector<HTMLElement>(`[data-option-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && matches[active]) {
      event.preventDefault();
      choose(matches[active]);
    }
  }
</script>

<div bind:this={container} class="relative min-w-0">
  <label for={id} class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">{label}</label>
  <button bind:this={trigger} id={id} type="button" class="field flex w-full items-center justify-between gap-2 text-left"
    aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-choices`}
    onclick={() => open ? hide() : show()}>
    <span class="min-w-0 truncate">{selectedLabel}</span><span aria-hidden="true">▾</span>
  </button>
    <div bind:this={popup} popover="auto" ontoggle={(event) => open = event.newState === 'open'}
      style={popupStyle} class="fixed z-50 m-0 min-w-56 rounded-md border border-parchment-300/30 bg-stone-950 p-1 shadow-xl">
      <input bind:this={searchInput} type="search" class="field mb-1 w-full" placeholder="Type to filter…"
        aria-label={`Search ${label}`} autocomplete="off" bind:value={query} oninput={() => active = 0} onkeydown={keys} />
      <div id={`${id}-choices`} role="listbox" aria-label={label} class="max-h-60 overflow-y-auto">
        {#each matches as option, index (option.value)}
          <button type="button" role="option" aria-selected={option.value === value} data-option-index={index}
            class:active={index === active} class="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-ember-700/35"
            onclick={() => choose(option)}>{option.label}</button>
        {:else}
          <p class="px-2 py-2 text-sm text-parchment-300">No matches</p>
        {/each}
      </div>
    </div>
</div>

<style>
  button.active { background: rgb(124 45 18 / 0.35); }
</style>
