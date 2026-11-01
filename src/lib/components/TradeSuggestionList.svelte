<script lang="ts" generics="Item extends { id: string; label: string }">
  let {
    id,
    open,
    items,
    activeIndex,
    label,
    loading = false,
    emptyText = '',
    class: className = '',
    onchoose
  }: {
    id: string;
    open: boolean;
    items: Item[];
    activeIndex: number;
    label: string;
    loading?: boolean;
    emptyText?: string;
    class?: string;
    onchoose: (item: Item) => void;
  } = $props();

  let listbox = $state<HTMLElement>();

  $effect(() => {
    if (open && activeIndex >= 0) {
      listbox?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    }
  });
</script>

<div
  bind:this={listbox}
  id={`${id}-options`}
  role="listbox"
  aria-label={label}
  hidden={!open || (!loading && !items.length && !emptyText)}
  class={`absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded border border-parchment-300/25 bg-[#0d0d0e] py-1 text-xs shadow-xl ${className}`}
>
  {#if !open}
    <!-- Closed rows skip the list; each would otherwise hold hundreds of hidden buttons. -->
  {:else if loading}
    <p class="px-3 py-2 text-parchment-300">Loading…</p>
  {:else if !items.length}
    <p class="px-3 py-2 text-parchment-300">{emptyText}</p>
  {:else}
    {#each items as item, index (item.id)}
      <button
        type="button"
        id={`${id}-option-${index}`}
        role="option"
        tabindex="-1"
        aria-selected={index === activeIndex}
        class={`block w-full px-3 py-2 text-left text-sm ${index === activeIndex ? 'bg-ember-700/35 text-white' : 'text-parchment-100 hover:bg-white/5'}`}
        onmousedown={(event) => event.preventDefault()}
        onclick={() => onchoose(item)}
      >{item.label}</button>
    {/each}
  {/if}
</div>
