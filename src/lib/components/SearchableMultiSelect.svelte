<script lang="ts">
  type Option = { value: string; label: string };

  let { id, label, placeholder, options, value = $bindable([]) }: {
    id: string;
    label: string;
    placeholder: string;
    options: Option[];
    value?: string[];
  } = $props();

  let open = $state(false);
  let query = $state('');
  let trigger: HTMLButtonElement;
  let popup: HTMLDivElement;
  let searchInput: HTMLInputElement;
  let popupStyle = $state('');
  const matches = $derived(options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  const selectedLabels = $derived(value.map((selected) => options.find((option) => option.value === selected)?.label ?? selected));
  const summary = $derived(value.length > 2 ? `${value.length} selected` : selectedLabels.join(', ') || placeholder);

  function show() {
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    const useBelow = below >= 280 || below >= above;
    const height = Math.min(360, Math.max(0, (useBelow ? below : above) - 12));
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = useBelow ? rect.bottom + 4 : rect.top - height - 4;
    popupStyle = `left:${left}px;top:${Math.max(4, top)}px;width:${width}px;max-height:${height}px`;
    query = '';
    popup.showPopover();
    searchInput.focus();
  }

  function hide() {
    if (popup.matches(':popover-open')) popup.hidePopover();
    trigger.focus();
  }

  function toggle(selected: string, checked: boolean) {
    value = checked ? [...value, selected] : value.filter((entry) => entry !== selected);
  }

  function keys(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
    }
  }
</script>

<div class="relative min-w-0">
  <label for={id} class="mb-1 block text-xs uppercase tracking-widest text-parchment-300">{label}</label>
  <button bind:this={trigger} {id} type="button" class="field flex w-full items-center justify-between gap-2 text-left"
    aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-choices`} aria-describedby={`${id}-summary`}
    title={selectedLabels.join(', ') || placeholder} onclick={() => open ? hide() : show()}>
    <span id={`${id}-summary`} class="min-w-0 truncate">{summary}</span><span aria-hidden="true">▾</span>
  </button>
  <div bind:this={popup} id={`${id}-choices`} popover="auto" role="dialog" aria-label={label} tabindex="-1"
    ontoggle={(event) => open = event.newState === 'open'} onkeydown={keys} style={popupStyle}
    class="multi-select-popup fixed z-50 m-0 rounded-md border border-parchment-300/30 bg-stone-950 p-1 shadow-xl">
    <input bind:this={searchInput} type="search" class="field w-full shrink-0" placeholder="Type to filter…"
      aria-label={`Search ${label}`} autocomplete="off" bind:value={query} />
    <div class="min-h-0 overflow-y-auto overscroll-contain py-1">
      {#each matches as option (option.value)}
        <label class="flex min-h-9 cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-ember-700/35 focus-within:bg-ember-700/35">
          <input type="checkbox" class="checkbox shrink-0" checked={value.includes(option.value)}
            onchange={(event) => toggle(option.value, event.currentTarget.checked)} />
          <span>{option.label}</span>
        </label>
      {:else}
        <p class="px-2 py-2 text-sm text-parchment-300">No matches</p>
      {/each}
    </div>
    <div class="flex shrink-0 items-center justify-between gap-2 border-t border-parchment-300/20 pt-1 text-sm">
      <button type="button" class="rounded px-2 py-1.5 text-parchment-200 hover:bg-ember-700/35 disabled:opacity-40"
        disabled={!value.length} onclick={() => value = []}>Clear selection</button>
      <button type="button" class="rounded px-3 py-1.5 text-ember-400 hover:bg-ember-700/35" onclick={hide}>Done</button>
    </div>
  </div>
</div>

<style>
  .multi-select-popup:popover-open {
    display: flex;
    flex-direction: column;
  }
</style>
