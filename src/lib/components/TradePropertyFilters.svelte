<script lang="ts">
  import { onMount } from 'svelte';
  import { i18n } from '$lib/i18n';
  import {
    loadItemStatPresentation,
    type ItemStatPresentation
  } from '$lib/item-stat-presentation';
  import {
    createTradePropertyFilter,
    createTradePropertyGroup,
    type TradePropertyFilterDraft,
    type TradePropertyGroupDraft
  } from '$lib/trade-property-filters';

  interface PropertyDefinition {
    stat: string;
    labelKey: string;
    valueShift: number;
    valueFunction?: number;
  }

  interface PropertyOption extends PropertyDefinition {
    label: string;
  }

  let {
    groups = $bindable([])
  }: {
    groups?: TradePropertyGroupDraft[];
  } = $props();

  let definitions = $state<PropertyDefinition[]>([]);
  let loadError = $state('');
  let draftCount = $derived(groups.reduce((count, group) => count + group.filters.length, 0));
  let propertyOptions = $derived.by(() => {
    const labelled = definitions.map((definition) => ({
      ...definition,
      label: translatedLabel(definition)
    }));
    const counts = new Map<string, number>();
    for (const option of labelled) {
      const key = option.label.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return labelled
      .map((option) => counts.get(option.label.toLowerCase()) === 1
        ? option
        : { ...option, label: `${option.label} · ${words(option.stat)}` })
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  function words(value: string): string {
    return value
      .replace(/^item_/, '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function translatedLabel(definition: PropertyDefinition): string {
    const translated = $i18n.t(definition.labelKey, ['#', '#', '#', '#']);
    return translated === definition.labelKey || /%(?:\+d|[dDisS]|\d)/.test(translated)
      ? words(definition.stat)
      : translated;
  }

  function matchingOptions(filter: TradePropertyFilterDraft): PropertyOption[] {
    const query = filter.query.trim().toLowerCase();
    if (query.length < 3) return [];
    if (propertyOptions.some((option) => option.label.toLowerCase() === query)) return [];
    return propertyOptions
      .filter((option) => option.label.toLowerCase().includes(query))
      .slice(0, 50);
  }

  function selectProperty(filter: TradePropertyFilterDraft): void {
    const query = filter.query.trim().toLowerCase();
    const option = propertyOptions.find((candidate) => candidate.label.toLowerCase() === query);
    filter.stat = option?.stat ?? '';
    filter.valueShift = option?.valueShift ?? 0;
    filter.valueFunction = option?.valueFunction;
  }

  function addGroup(): void {
    if (groups.length >= 6 || draftCount >= 24) return;
    groups = [...groups, createTradePropertyGroup('And')];
  }

  function removeGroup(id: number): void {
    if (groups.length === 1) {
      groups = [createTradePropertyGroup('And')];
      return;
    }
    groups = groups.filter((group) => group.id !== id);
  }

  function addFilter(group: TradePropertyGroupDraft): void {
    if (group.filters.length >= 12 || draftCount >= 24) return;
    group.filters.push(createTradePropertyFilter());
  }

  function removeFilter(group: TradePropertyGroupDraft, id: number): void {
    if (group.filters.length === 1) {
      group.filters[0] = createTradePropertyFilter();
      return;
    }
    group.filters = group.filters.filter((filter) => filter.id !== id);
  }

  function groupHelp(group: TradePropertyGroupDraft): string {
    if (group.type === 'And') return 'Every property in this group must match.';
    if (group.type === 'Or') return 'At least one property in this group must match.';
    return 'Choose how many of these properties must match.';
  }

  onMount(async () => {
    try {
      const bundle = await loadItemStatPresentation();
      definitions = Object.entries(bundle.Stats)
        .filter(([stat, metadata]) => Boolean(metadata.PositiveKey) && stat !== 'charm_weight')
        .map(([stat, metadata]: [string, ItemStatPresentation]) => ({
          stat,
          labelKey: metadata.PositiveKey!,
          valueShift: metadata.ValueShift ?? 0,
          valueFunction: metadata.Function
        }));
    } catch (value) {
      loadError = value instanceof Error ? value.message : 'Property names could not be loaded.';
    }
  });
</script>

<section aria-labelledby="property-filter-heading">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h3 id="property-filter-heading" class="display-text mt-1 text-xl text-parchment-50">Property filters</h3>
      <p class="mt-1 max-w-xl text-xs leading-5 text-parchment-300">Combine exact item stats and roll ranges. Separate groups are combined together.</p>
    </div>
    <button type="button" class="trade-secondary-button !px-3 !py-2" disabled={groups.length >= 6 || draftCount >= 24} onclick={addGroup}>+ Add group</button>
  </div>

  {#if loadError}<p role="alert" class="mt-3 text-xs text-red-300">{loadError}</p>{/if}

  <div class="mt-4 space-y-4">
    {#each groups as group, groupIndex (group.id)}
      <fieldset class="rounded-lg border border-parchment-300/18 bg-black/25 p-3 sm:p-4">
        <legend class="sr-only">Property group {groupIndex + 1}</legend>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label class="flex items-center gap-2 text-xs uppercase tracking-wider text-parchment-300">
            Match
            <select class="field !w-auto !py-2 text-sm" bind:value={group.type}>
              <option value="And">AND</option>
              <option value="Or">OR</option>
              <option value="Count">COUNT</option>
            </select>
          </label>
          <p class="min-w-0 flex-1 text-xs text-parchment-300">{groupHelp(group)}</p>
          <button type="button" class="rounded px-2 py-1 text-xs text-parchment-300 hover:bg-white/5 hover:text-red-300" onclick={() => removeGroup(group.id)}>Remove group</button>
        </div>

        {#if group.type === 'Count'}
          <div class="mt-3 grid max-w-sm grid-cols-2 gap-3 rounded border border-ember-400/15 bg-ember-950/10 p-3">
            <label class="text-xs text-parchment-300">Minimum count<input type="number" min="1" max={group.filters.length} class="field mt-1 !py-2" bind:value={group.minimumCount} /></label>
            <label class="text-xs text-parchment-300">Maximum count<input type="number" min="1" max={group.filters.length} class="field mt-1 !py-2" placeholder="Any" bind:value={group.maximumCount} /></label>
          </div>
        {/if}

        <div class="mt-3 space-y-2">
          {#each group.filters as filter (filter.id)}
            {@const suggestions = matchingOptions(filter)}
            <div class="grid gap-2 rounded border border-parchment-300/12 bg-[#0d0d0e]/70 p-2 sm:grid-cols-[minmax(12rem,1fr)_6rem_6rem_auto] sm:items-end">
              <label class="min-w-0 text-xs text-parchment-300">
                Property
                <input
                  class="field mt-1 !py-2"
                  list={suggestions.length ? `trade-property-${filter.id}` : undefined}
                  placeholder="Type at least 3 characters…"
                  autocomplete="off"
                  bind:value={filter.query}
                  oninput={() => selectProperty(filter)}
                />
                {#if suggestions.length}
                  <datalist id={`trade-property-${filter.id}`}>{#each suggestions as option}<option value={option.label}></option>{/each}</datalist>
                {/if}
              </label>
              <label class="text-xs text-parchment-300">Minimum<input type="number" step="any" class="field mt-1 !py-2" placeholder="Any" bind:value={filter.minimumValue} /></label>
              <label class="text-xs text-parchment-300">Maximum<input type="number" step="any" class="field mt-1 !py-2" placeholder="Any" bind:value={filter.maximumValue} /></label>
              <button type="button" aria-label="Remove property" title="Remove property" class="h-10 rounded border border-parchment-300/18 px-3 text-parchment-300 hover:border-red-400/40 hover:text-red-300" onclick={() => removeFilter(group, filter.id)}>×</button>
            </div>
          {/each}
        </div>

        <button type="button" class="mt-3 rounded border border-dashed border-parchment-300/25 px-3 py-2 text-xs text-parchment-300 hover:border-ember-400/40 hover:text-parchment-50" disabled={group.filters.length >= 12 || draftCount >= 24} onclick={() => addFilter(group)}>+ Add property</button>
      </fieldset>
    {/each}
  </div>
</section>
