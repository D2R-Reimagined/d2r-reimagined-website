<script lang="ts">
  import StringCondition from './StringCondition.svelte';
  import NumericCondition from './NumericCondition.svelte';
  import ColorInput from './ColorInput.svelte';
  import SoundPicker from './SoundPicker.svelte';
  import M from '#lib/loot-filter/model.js';
  import { values, type Catalog, type Conditions, type RuleBlock, type Visibility } from '#lib/loot-filter/types.js';
  let { block = $bindable(), kind, catalog, onkind }: { block: RuleBlock; kind: Visibility; catalog: Catalog; onkind: (kind: Visibility) => void } = $props();

  const uniquesByCode = $derived.by(() => {
    const map = new Map<string, string[]>();
    for (const u of catalog.uniqueItems) {
      if (!u.baseCode) continue;
      const list = map.get(u.baseCode) ?? [];
      if (!list.includes(u.name)) list.push(u.name);
      map.set(u.baseCode, list);
    }
    return map;
  });
  const setsByCode = $derived.by(() => {
    const map = new Map<string, string[]>();
    for (const s of catalog.setItems) {
      if (!s.baseCode) continue;
      const list = map.get(s.baseCode) ?? [];
      if (!list.includes(s.name)) list.push(s.name);
      map.set(s.baseCode, list);
    }
    return map;
  });

  const codes = $derived([...new Map(catalog.baseItems.map(item => {
    const code = item.code!;
    const baseLabel = item.displayName || item.name || code;
    const tierTag = item.tier ? ` · ${item.tier[0].toUpperCase()}${item.tier.slice(1)} ${item.kind}` : item.kind ? ` · ${item.kind}` : '';
    const uniques = uniquesByCode.get(code) ?? [];
    const sets = setsByCode.get(code) ?? [];
    const extra: string[] = [];
    if (uniques.length) extra.push(`Uniques: ${uniques.slice(0, 4).join(', ')}${uniques.length > 4 ? ` (+${uniques.length - 4})` : ''}`);
    if (sets.length) extra.push(`Sets: ${sets.slice(0, 4).join(', ')}${sets.length > 4 ? ` (+${sets.length - 4})` : ''}`);
    const description = `${baseLabel} (${code})${tierTag}${extra.length ? ` — ${extra.join(' · ')}` : ''}`;
    return [code, { value: code, label: `${baseLabel} (${code})`, description }];
  })).values()]);

  const names = $derived(catalog.baseNames.map(value => ({ value, label: value })));
  const types = $derived(catalog.itemTypes.map(value => {
    const display = catalog.itemTypeNames?.get(value);
    const label = display && display !== value ? `${display} (${value})` : value;
    return { value, label, description: label };
  }));
  const tiers = $derived(M.TIERS.map((value: string) => ({
    value,
    label: `${value[0].toUpperCase()}${value.slice(1)}`,
    description: `${value[0].toUpperCase()}${value.slice(1)} equipment tier`
  })));

  const sampleItemName = $derived.by(() => {
    const baseName = values(block.conditions?.baseName)[0];
    if (baseName) return baseName;
    const firstCode = values(block.conditions?.code)[0];
    if (firstCode) {
      const found = catalog.baseItems.find(item => item.code === firstCode);
      return found?.displayName || found?.name || firstCode;
    }
    return 'Item name';
  });
  const tooltipText = $derived(block.name ? block.name.replaceAll('{name}', sampleItemName) : sampleItemName);
  const tooltipBorder = $derived(block.tooltip?.borderColor ? `;border:2px solid ${cssColor(block.tooltip.borderColor, 'transparent')}` : '');
  const tooltipStyle = $derived(`color:${cssColor(block.tooltip?.textColor, '#f7f1e3')};background:${cssColor(block.tooltip?.backgroundColor, 'rgba(0,0,0,.85)')}${tooltipBorder}`);

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }
  function set<K extends keyof RuleBlock>(key: K, value: RuleBlock[K]) {
    if (value === undefined) delete block[key]; else block[key] = value;
  }
  function condition<K extends keyof Conditions>(key: K, value: Conditions[K]) {
    const next = { ...block.conditions };
    if (value === undefined) delete next[key]; else next[key] = value;
    set('conditions', Object.keys(next).length ? next : undefined);
  }
  function tooltip(key: 'backgroundColor' | 'borderColor' | 'textColor', value?: string) {
    const next = { ...block.tooltip };
    if (value === undefined) delete next[key]; else next[key] = value;
    set('tooltip', Object.keys(next).length ? next : undefined);
  }
  function booleanValue(value: string): boolean | undefined { return value === '' ? undefined : value === 'true'; }
</script>

{#snippet minimapShape(shape: string)}
  {#if shape === 'circle'}<circle cx="20" cy="20" r="17" />{:else if shape === 'square'}<rect x="4" y="4" width="32" height="32" />{:else if shape === 'triangle'}<polygon points="20,3 37,36 3,36" />{:else if shape === 'triangleDown'}<polygon points="20,37 3,4 37,4" />{:else if shape === 'star'}<polygon points="20,2 25,14 38,15 28,24 31,38 20,31 9,38 12,24 2,15 15,14" />{:else if shape === 'spark'}<polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" />{:else if shape === 'kite'}<polygon points="20,3 34,15 20,37 6,15" />{:else if shape === 'hexagon'}<polygon points="37,20 28.5,35 11.5,35 3,20 11.5,5 28.5,5" />{:else if shape === 'cross'}<polygon points="14,3 26,3 26,14 37,14 37,26 26,26 26,37 14,37 14,26 3,26 3,14 14,14" />{:else if shape === 'chevron'}<polygon points="20,3 37,24.2 31,32.8 20,18.3 9,32.8 3,24.2" />{:else if shape === 'bullseye'}<circle cx="20" cy="20" r="17" fill="none" /><circle cx="20" cy="20" r="7.65" stroke="none" />{:else}<polygon points="20,2 38,20 20,38 2,20" />{/if}
{/snippet}

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300/20 pb-4">
    <h2 class="display-text text-xl">Edit rule</h2>
    <div class="flex gap-2" aria-label="Rule visibility">
      <button type="button" class="trade-secondary-button" class:active={kind === 'show'} aria-pressed={kind === 'show'} onclick={() => onkind('show')}>Show</button>
      <button type="button" class="trade-secondary-button" class:active={kind === 'hide'} aria-pressed={kind === 'hide'} onclick={() => onkind('hide')}>Hide</button>
    </div>
  </div>
  <label class="block space-y-1.5"><span class="field-label">Rule name</span>
    <input class="field" placeholder="e.g. High-value currency" value={block.ruleName ?? ''} oninput={event => set('ruleName', event.currentTarget.value || undefined)} />
  </label>
  <label class="flex items-start gap-3 text-sm text-parchment-200">
    <input type="checkbox" checked={block.continue === true} onchange={event => set('continue', event.currentTarget.checked || undefined)} />
    <span>Continue evaluating later rules<span class="mt-1 block text-xs text-parchment-300">Normally, the first matching rule stops evaluation. Continue lets later rules add or override actions.</span></span>
  </label>

  <section class="space-y-4" aria-label="Rule conditions">
    <div><h3 class="display-text text-lg">Conditions</h3><p class="mt-1 text-xs text-parchment-300">All fields must match. Multiple values in one field match any selected value.</p></div>
    <div class="grid gap-4 sm:grid-cols-2">
      <StringCondition id="filter-code" label="Item code" options={codes} value={block.conditions?.code} onchange={value => condition('code', value)} />
      <StringCondition id="filter-base" label="Base name" options={names} value={block.conditions?.baseName} onchange={value => condition('baseName', value)} />
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <StringCondition id="filter-type" label="Item type" options={types} value={block.conditions?.itemType} onchange={value => condition('itemType', value)} />
      <StringCondition id="filter-tier" label="Equipment tier" options={tiers} value={block.conditions?.tier} onchange={value => condition('tier', value)} manual={false} />
      <StringCondition id="filter-rarity" label="Rarity" options={M.RARITIES.map((value: string) => ({ value, label: value }))} value={block.conditions?.rarity} onchange={value => condition('rarity', value)} manual={false} />
    </div>
    <p class="text-xs text-parchment-300">Hover any selected code pill to see the items it references. Base names and type codes use exact mod selectors regardless of display language.</p>
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
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col space-y-1.5"><span class="field-label">Custom ground name</span>
          <textarea class="field min-h-24 flex-1" placeholder="Use {name} or leave blank for original name" value={block.name ?? ''} oninput={event => set('name', event.currentTarget.value || undefined)}></textarea>
          <span class="block text-xs text-parchment-300">Use <code>{'{name}'}</code> to include the original item name. Up to 3 lines, 55 chars/line, 79 ASCII bytes total.</span>
        </label>
        <div class="flex flex-col space-y-1.5">
          <span class="field-label">Live rule preview</span>
          <div class="flex min-h-24 flex-1 flex-col items-center justify-center gap-2.5 rounded border border-parchment-300/15 bg-abyss-950 p-3" aria-label="Ground label preview">
            {#if block.minimapIcon}
              <svg aria-label={`${block.minimapIcon.shape} minimap icon`} width={Math.max(12, Math.min(44, block.minimapIcon.size ?? 20))} height={Math.max(12, Math.min(44, block.minimapIcon.size ?? 20))} viewBox="0 0 40 40" fill={cssColor(block.minimapIcon.fillColor, '#b48cff')} stroke={cssColor(block.minimapIcon.borderColor, '#e1cdff')} stroke-width="2">
                {@render minimapShape(block.minimapIcon.shape)}
              </svg>
            {/if}
            <span class="max-w-full whitespace-pre-line break-words px-3 py-1.5 text-center font-serif" style={tooltipStyle}>{tooltipText}</span>
          </div>
          <span class="block text-xs text-parchment-300">Selected rule preview. In-game appearance may differ.</span>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        {#each [{ key: 'backgroundColor', label: 'Tooltip background', default: 'RGBA(110, 35, 160, 0.82)' }, { key: 'borderColor', label: 'Tooltip border', default: 'RGBA(225, 205, 255, 1)' }, { key: 'textColor', label: 'Tooltip text', default: 'RGBA(180, 140, 255, 1)' }] as color}
          {@const key = color.key as 'backgroundColor' | 'borderColor' | 'textColor'}
          <div class="space-y-3 rounded border border-parchment-300/20 p-3">
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={block.tooltip?.[key] !== undefined} onchange={event => tooltip(key, event.currentTarget.checked ? color.default : undefined)} />{color.label}</label>
            {#if block.tooltip?.[key] !== undefined}<ColorInput label={color.label} value={block.tooltip[key]!} onchange={value => tooltip(key, value)} />{/if}
          </div>
        {/each}
      </div>
      <div class="space-y-4 rounded border border-parchment-300/20 p-3">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!block.minimapIcon} onchange={event => set('minimapIcon', event.currentTarget.checked ? { shape: 'diamond', size: 20, borderColor: 'RGBA(225, 205, 255, 1)', fillColor: 'RGBA(180, 140, 255, 0.82)' } : undefined)} />Minimap icon</label>
        {#if block.minimapIcon}
          <div class="grid grid-cols-2 gap-3">
            <label class="space-y-1.5"><span class="field-label">Shape</span><select class="field" bind:value={block.minimapIcon.shape}>{#each M.MINIMAP_SHAPES as shape}<option value={shape}>{shape}</option>{/each}</select></label>
            <label class="space-y-1.5"><span class="field-label">Size (px)</span><input class="field" type="number" min="4" max="128" step="1" placeholder="20" value={block.minimapIcon.size ?? ''} oninput={event => { if (!block.minimapIcon) return; if (event.currentTarget.value === '') delete block.minimapIcon.size; else block.minimapIcon.size = Number(event.currentTarget.value); }} /></label>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <ColorInput label="Icon border" value={block.minimapIcon.borderColor} onchange={value => { if (block.minimapIcon) block.minimapIcon.borderColor = value; }} />
            <ColorInput label="Icon fill" value={block.minimapIcon.fillColor} onchange={value => { if (block.minimapIcon) block.minimapIcon.fillColor = value; }} />
          </div>
        {/if}
      </div>
      <SoundPicker value={block.dropSound} onchange={value => set('dropSound', value)} />
    </section>
  {:else}
    <p class="rounded border border-parchment-300/20 p-3 text-sm text-parchment-300">Hide controls visibility. Existing action settings are preserved if you switch this rule back to Show.</p>
  {/if}
</div>

<style>
  .field-label { display: block; font-size: .75rem; text-transform: uppercase; letter-spacing: .1em; color: var(--color-parchment-300); }
  .active { border-color: var(--color-ember-400); background: color-mix(in srgb, var(--color-ember-700) 40%, transparent); color: var(--color-parchment-50); }
</style>
