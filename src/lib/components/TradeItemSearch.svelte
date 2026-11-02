<script lang="ts">
  import TradeSuggestionList from '#lib/components/TradeSuggestionList.svelte';

  let {
    id,
    names,
    value = $bindable(''),
    placeholder
  }: {
    id: string;
    names: string[];
    value?: string;
    placeholder: string;
  } = $props();

  let open = $state(false);
  let activeIndex = $state(-1);

  let items = $derived.by(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    const matches = names.filter((name) => name.toLowerCase().includes(query));
    if (matches.some((name) => name.toLowerCase() === query)) return [];
    const starts = (name: string) => Number(name.toLowerCase().startsWith(query));
    return matches
      .sort((left, right) => starts(right) - starts(left))
      .slice(0, 50)
      .map((name) => ({ id: name, label: name }));
  });
  let activeId = $derived(open && activeIndex >= 0 && activeIndex < items.length ? `${id}-option-${activeIndex}` : undefined);

  function close(): void {
    open = false;
    activeIndex = -1;
  }

  function choose(name: string): void {
    value = name;
    close();
  }

  function move(step: number): void {
    if (!items.length) return;
    open = true;
    activeIndex = (Math.max(activeIndex, step > 0 ? -1 : 0) + step + items.length) % items.length;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter') {
      // Free text stays searchable, so Enter only picks a highlighted suggestion.
      if (items[activeIndex] && open) {
        event.preventDefault();
        choose(items[activeIndex].label);
      } else {
        close();
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      close();
    }
  }
</script>

<input
  {id}
  class="field !py-3 !pl-11"
  role="combobox"
  aria-autocomplete="list"
  aria-expanded={open && items.length > 0}
  aria-controls={`${id}-options`}
  aria-activedescendant={activeId}
  {placeholder}
  autocomplete="off"
  spellcheck="false"
  bind:value
  oninput={() => { open = true; activeIndex = -1; }}
  onfocus={() => { open = true; }}
  onblur={close}
  onkeydown={handleKeydown}
/>
<TradeSuggestionList
  {id}
  {open}
  {items}
  {activeIndex}
  label="Item names"
  onchoose={(item) => choose(item.label)}
/>
