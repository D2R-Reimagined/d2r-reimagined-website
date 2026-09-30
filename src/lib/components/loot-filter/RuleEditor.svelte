<script lang="ts">
  import StringCondition from './StringCondition.svelte';
  import NumericCondition from './NumericCondition.svelte';
  import ColorInput from './ColorInput.svelte';
  import SoundPicker from './SoundPicker.svelte';
  import M from '$lib/loot-filter/model.js';
  import { type Catalog, type Conditions, type RuleBlock, type Visibility } from '$lib/loot-filter/types';
  let { block = $bindable(), kind, catalog, onkind }: { block: RuleBlock; kind: Visibility; catalog: Catalog; onkind: (kind: Visibility) => void } = $props();
  const codes = $derived([...new Map(catalog.baseItems.map(item => [item.code!, { value: item.code!, label: `${item.displayName || item.name || item.code} (${item.code})` }])).values()]);
  const names = $derived(catalog.baseNames.map(value => ({ value, label: value })));
  const types = $derived(catalog.itemTypes.map(value => ({ value, label: value })));
  function condition<K extends keyof Conditions>(key: K, value: Conditions[K]) {
    const next = { ...block.conditions };
    if (value === undefined) delete next[key]; else next[key] = value;
    block.conditions = Object.keys(next).length ? next : undefined;
  }
  function tooltip(key: 'backgroundColor' | 'textColor', value?: string) {
    const next = { ...block.tooltip };
    if (value === undefined) delete next[key]; else next[key] = value;
    block.tooltip = Object.keys(next).length ? next : undefined;
  }
  function booleanValue(value: string): boolean | undefined { return value === '' ? undefined : value === 'true'; }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300/20 pb-4">
    <h2 class="display-text text-xl">Edit rule</h2>
    <div class="flex gap-2" aria-label="Rule visibility">
      <button type="button" class="trade-secondary-button" class:active={kind === 'show'} aria-pressed={kind === 'show'} onclick={() => onkind('show')}>Show</button>
      <button type="button" class="trade-secondary-button" class:active={kind === 'hide'} aria-pressed={kind === 'hide'} onclick={() => onkind('hide')}>Hide</button>
    </div>
  </div>
  <label class="block space-y-1.5"><span class="field-label">Rule name</span>
    <input class="field" placeholder="e.g. High-value currency" value={block.ruleName ?? ''} oninput={event => block.ruleName = event.currentTarget.value || undefined} />
  </label>
  <label class="flex items-start gap-3 text-sm text-parchment-200">
    <input type="checkbox" checked={block.continue === true} onchange={event => block.continue = event.currentTarget.checked || undefined} />
    <span>Continue evaluating later rules<span class="mt-1 block text-xs text-parchment-300">Normally, the first matching rule stops evaluation. Continue lets later rules add or override actions.</span></span>
  </label>

  <section class="space-y-4" aria-label="Rule conditions">
    <div><h3 class="display-text text-lg">Conditions</h3><p class="mt-1 text-xs text-parchment-300">All fields must match. Multiple values in one field match any selected value.</p></div>
    <div class="grid gap-4 sm:grid-cols-2">
      <StringCondition id="filter-code" label="Item code" options={codes} value={block.conditions?.code} onchange={value => condition('code', value)} />
      <StringCondition id="filter-base" label="Base name" options={names} value={block.conditions?.baseName} onchange={value => condition('baseName', value)} />
      <StringCondition id="filter-type" label="Item type" options={types} value={block.conditions?.itemType} onchange={value => condition('itemType', value)} />
      <StringCondition id="filter-rarity" label="Rarity" options={M.RARITIES.map((value: string) => ({ value, label: value }))} value={block.conditions?.rarity} onchange={value => condition('rarity', value)} manual={false} />
    </div>
    <p class="text-xs text-parchment-300">Base names and type codes use exact mod selectors, regardless of your display language. Miscellaneous items use item codes.</p>
    <div class="grid gap-3 sm:grid-cols-3">
      <NumericCondition label="Quantity" min={0} max={65535} value={block.conditions?.quantity} onchange={value => condition('quantity', value)} />
      <NumericCondition label="Item level" min={1} max={99} value={block.conditions?.itemLevel} onchange={value => condition('itemLevel', value)} />
      <NumericCondition label="Sockets" min={0} max={15} value={block.conditions?.sockets} onchange={value => condition('sockets', value)} />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <label class="space-y-1.5"><span class="field-label">Ethereal</span>
        <select class="field" value={block.conditions?.ethereal === undefined ? '' : String(block.conditions.ethereal)} onchange={event => condition('ethereal', booleanValue(event.currentTarget.value))}>
          <option value="">Any</option><option value="true">Yes</option><option value="false">No</option>
        </select>
      </label>
      <label class="space-y-1.5"><span class="field-label">Identified</span>
        <select class="field" value={block.conditions?.identified === undefined ? '' : String(block.conditions.identified)} onchange={event => condition('identified', booleanValue(event.currentTarget.value))}>
          <option value="">Any</option><option value="true">Yes</option><option value="false">No</option>
        </select>
      </label>
    </div>
  </section>

  {#if kind === 'show'}
    <section class="space-y-4 border-t border-parchment-300/20 pt-5" aria-label="Rule actions">
      <h3 class="display-text text-lg">Actions</h3>
      <label class="block space-y-1.5"><span class="field-label">Custom ground name</span>
        <textarea class="field min-h-20" placeholder="Use the original item name" value={block.name ?? ''} oninput={event => block.name = event.currentTarget.value || undefined}></textarea>
        <span class="block text-xs text-parchment-300">Up to 3 non-empty lines, 55 characters per line, 79 ASCII bytes total.</span>
      </label>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [{ key: 'backgroundColor', label: 'Tooltip background', default: 'RGBA(110, 35, 160, 0.82)' }, { key: 'textColor', label: 'Tooltip text', default: 'RGBA(180, 140, 255, 1)' }] as color}
          {@const key = color.key as 'backgroundColor' | 'textColor'}
          <div class="space-y-3 rounded border border-parchment-300/20 p-3">
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={block.tooltip?.[key] !== undefined} onchange={event => tooltip(key, event.currentTarget.checked ? color.default : undefined)} />{color.label}</label>
            {#if block.tooltip?.[key]}<ColorInput label={color.label} value={block.tooltip[key]!} onchange={value => tooltip(key, value)} />{/if}
          </div>
        {/each}
      </div>
      <SoundPicker value={block.dropSound} onchange={value => block.dropSound = value} />
      <div class="space-y-4 rounded border border-parchment-300/20 p-3">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!block.minimapIcon} onchange={event => block.minimapIcon = event.currentTarget.checked ? { shape: 'diamond', size: 20, borderColor: 'RGBA(225, 205, 255, 1)', fillColor: 'RGBA(180, 140, 255, 0.82)' } : undefined} />Minimap icon</label>
        {#if block.minimapIcon}
          <div class="grid grid-cols-2 gap-3">
            <label class="space-y-1.5"><span class="field-label">Shape</span><select class="field" bind:value={block.minimapIcon.shape}>{#each M.MINIMAP_SHAPES as shape}<option value={shape}>{shape}</option>{/each}</select></label>
            <label class="space-y-1.5"><span class="field-label">Size (px)</span><input class="field" type="number" min="12" max="40" step="1" value={block.minimapIcon.size ?? 12} oninput={event => { if (block.minimapIcon) block.minimapIcon.size = event.currentTarget.value === '' ? undefined : Number(event.currentTarget.value); }} /></label>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <ColorInput label="Icon border" value={block.minimapIcon.borderColor} onchange={value => { if (block.minimapIcon) block.minimapIcon.borderColor = value; }} />
            <ColorInput label="Icon fill" value={block.minimapIcon.fillColor} onchange={value => { if (block.minimapIcon) block.minimapIcon.fillColor = value; }} />
          </div>
        {/if}
      </div>
    </section>
  {:else}
    <p class="rounded border border-parchment-300/20 p-3 text-sm text-parchment-300">Hide controls visibility. Existing action settings are preserved if you switch this rule back to Show.</p>
  {/if}
</div>

<style>
  .field-label { display: block; font-size: .75rem; text-transform: uppercase; letter-spacing: .1em; color: var(--color-parchment-300); }
  .active { border-color: var(--color-ember-400); background: color-mix(in srgb, var(--color-ember-700) 40%, transparent); color: var(--color-parchment-50); }
</style>
