<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { i18n } from '#lib/i18n.js';
  import M from '#lib/loot-filter/model.js';
  import { fromExport } from '#lib/loot-filter/catalog.js';
  import { playSound, stopSound, soundPreview } from '#lib/loot-filter/sound-preview.js';
  import { blockOf, kindOf, values, type Catalog, type CatalogItem, type Filter, type Visibility } from '#lib/loot-filter/types.js';
  import RuleEditor from './RuleEditor.svelte';

  let { filter = $bindable(), selected = $bindable(-1), onedit, onimport }: {
    filter: Filter; selected?: number; onedit: () => void; onimport: (filter: Filter, name: string) => void;
  } = $props();
  let mounted = $state(false);
  const ready = true;
  let message = $state('');
  let catalog = $state.raw<Catalog>(M.buildCatalog({}));
  let catalogStatus = $state('Loading Reimagined item data…');
  let catalogError = $state(false);
  let loading = $state(true);
  let catalogRequest = 0;
  let query = $state('');
  let importInput: HTMLInputElement;
  let dragged = $state(-1);
  let dropTarget = $state(-1);
  const current = $derived(filter.rules[selected]);
  const block = $derived(current ? blockOf(current) : undefined);
  const validation = $derived(M.validateFilter(filter, catalog));
  const dataset = $derived([...catalog.baseItems, ...catalog.uniqueItems, ...catalog.setItems]);
  const matches = $derived(query.trim() ? dataset.filter(item => `${item.displayName ?? ''} ${item.name} ${item.code ?? ''} ${item.baseCode ?? ''} ${item.baseName ?? ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 24) : []);
  const tooltipText = $derived(block?.name || values(block?.conditions?.baseName)[0] || values(block?.conditions?.code)[0] || 'Item name');
  const tooltipBorder = $derived(block?.tooltip?.borderColor ? `;border:2px solid ${cssColor(block.tooltip.borderColor, 'transparent')}` : '');
  const tooltipStyle = $derived(`color:${cssColor(block?.tooltip?.textColor, '#f7f1e3')};background:${cssColor(block?.tooltip?.backgroundColor, 'rgba(0,0,0,.85)')}${tooltipBorder}`);

  function cssColor(value: string | undefined, fallback: string) {
    const parsed = M.parseRgba(value);
    return parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : fallback;
  }
  function ruleChipStyle(b: ReturnType<typeof blockOf> | undefined, kind: Visibility) {
    if (!b?.tooltip) return '';
    if (kind === 'hide') {
      const text = b.tooltip.textColor ? `color-mix(in srgb, ${cssColor(b.tooltip.textColor, '#cbd5e1')} 35%, #94a3b8)` : '#94a3b8';
      const bg = b.tooltip.backgroundColor ? `color-mix(in srgb, ${cssColor(b.tooltip.backgroundColor, '#0f1219')} 35%, #0f1219)` : '#0f1219';
      const border = b.tooltip.borderColor ? `1px solid color-mix(in srgb, ${cssColor(b.tooltip.borderColor, '#64748b')} 40%, rgb(148 163 184 / 0.35))` : '1px solid rgb(148 163 184 / 0.25)';
      return `color:${text};background:${bg};border:${border}`;
    }
    const text = b.tooltip.textColor ? `color-mix(in srgb, ${cssColor(b.tooltip.textColor, '#f7f1e3')} 85%, #d8c9a7)` : '#f7f1e3';
    const bg = b.tooltip.backgroundColor ? `color-mix(in srgb, ${cssColor(b.tooltip.backgroundColor, 'rgba(0,0,0,.7)')} 75%, #141313)` : 'rgba(20,19,19,.75)';
    const border = b.tooltip.borderColor ? `1px solid color-mix(in srgb, ${cssColor(b.tooltip.borderColor, 'transparent')} 65%, transparent)` : '1px solid rgba(188,167,125,.16)';
    return `color:${text};background:${bg};border:${border}`;
  }
  $effect(() => {
    JSON.stringify(filter);
    untrack(onedit);
  });
  $effect(() => {
    const language = $i18n.code;
    if (mounted) untrack(() => void loadCatalog(language));
  });
  async function loadCatalog(language = $i18n.code) {
    const request = ++catalogRequest;
    loading = true; catalogError = false;
    catalogStatus = 'Loading Reimagined item data…';
    const json = async (url: string) => {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Data request failed (${response.status})`);
      return response.json();
    };
    try {
      const [bundle, english, localized] = await Promise.all([
        json('/data/keyed/loot-filter.json'), json('/data/strings/enUS.json'),
        language === 'enUS' ? Promise.resolve({}) : json(`/data/strings/${language}.json`)
      ]);
      if (request !== catalogRequest) return;
      catalog = fromExport(bundle, { ...english, ...localized });
      catalogStatus = `${catalog.baseItems.length.toLocaleString()} bases · ${catalog.uniqueItems.length.toLocaleString()} uniques · ${catalog.setItems.length.toLocaleString()} set items`;
    } catch {
      if (request !== catalogRequest) return;
      catalogError = true;
      catalogStatus = 'Item data could not be loaded. Retry to enable item search. Your filter is still available.';
    } finally { if (request === catalogRequest) loading = false; }
  }
  onMount(() => { mounted = true; return stopSound; });
  function add(kind: Visibility, item?: CatalogItem) {
    if (filter.rules.length >= M.MAX_RULES) { message = 'The filter already has 4,096 rules.'; return; }
    const rule = item ? M.createRuleForFinderItem(item, kind) : M.makeRule(kind);
    if (item) { const label = item.displayName || item.name || item.code || 'Item'; const base = item.baseName || item.baseCode || item.code || 'base'; blockOf(rule).ruleName = item.kind === 'unique' || item.kind === 'set' ? `${item.kind === 'unique' ? 'Unique' : 'Set'} ${base} (${label})`.slice(0, 80) : label; }
    filter.rules.unshift(rule); selected = 0; query = '';
  }
  function changeKind(kind: Visibility) {
    if (!block) return;
    const next = M.clone(block);
    filter.rules[selected] = kind === 'hide' ? { hide: next } : { show: next };
  }
  function duplicate(index: number) {
    if (filter.rules.length >= M.MAX_RULES) { message = 'The filter already has 4,096 rules.'; return; }
    filter.rules.splice(index + 1, 0, M.clone(filter.rules[index])); selected = index + 1;
  }
  function remove(index: number) {
    filter.rules.splice(index, 1);
    selected = filter.rules.length ? Math.max(0, Math.min(selected > index ? selected - 1 : selected, filter.rules.length - 1)) : -1;
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= filter.rules.length || from === to) return;
    const active = filter.rules[selected];
    const [rule] = filter.rules.splice(from, 1); filter.rules.splice(to, 0, rule);
    selected = filter.rules.indexOf(active);
  }
  function drop(event: DragEvent, to: number) { event.preventDefault(); if (dragged >= 0) move(dragged, to); dragged = -1; dropTarget = -1; }
  async function importFilter(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0]; input.value = '';
    if (!file) return;
    try {
      if (file.size > M.MAX_BYTES) throw new Error('Filter exceeds the 4 MiB limit.');
      const parsed = JSON.parse(await file.text());
      const result = M.validateFilter(parsed, catalog);
      if (result.errors.length) throw new Error(result.errors.slice(0, 3).join(' '));
      onimport(parsed, file.name.replace(/\.json$/i, '') || 'Imported filter');
    } catch (error) { message = `Import failed: ${error instanceof Error ? error.message : 'Invalid file'}`; }
  }
  function download() {
    if (validation.errors.length) return;
    const url = URL.createObjectURL(new Blob([validation.json], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'filter.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message = 'Downloaded filter.json. Place it in mods/Reimagined/d2rloader/config (or mods/ReimaginedLadder/d2rloader/config).';
  }
  async function copy() {
    try { await navigator.clipboard.writeText(validation.json); message = 'Copied filter JSON.'; }
    catch { message = 'Clipboard access was blocked. Use Download filter.json instead.'; }
  }
  function previewSound() { if (block?.dropSound) void playSound(block.dropSound); }

</script>

{#snippet minimapShape(shape: string)}
  {#if shape === 'circle'}<circle cx="20" cy="20" r="17" />{:else if shape === 'square'}<rect x="4" y="4" width="32" height="32" />{:else if shape === 'triangle'}<polygon points="20,3 37,36 3,36" />{:else if shape === 'triangleDown'}<polygon points="20,37 3,4 37,4" />{:else if shape === 'star'}<polygon points="20,2 25,14 38,15 28,24 31,38 20,31 9,38 12,24 2,15 15,14" />{:else if shape === 'spark'}<polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" />{:else if shape === 'kite'}<polygon points="20,3 34,15 20,37 6,15" />{:else if shape === 'hexagon'}<polygon points="37,20 28.5,35 11.5,35 3,20 11.5,5 28.5,5" />{:else if shape === 'cross'}<polygon points="14,3 26,3 26,14 37,14 37,26 26,26 26,37 14,37 14,26 3,26 3,14 14,14" />{:else if shape === 'chevron'}<polygon points="20,3 37,24.2 31,32.8 20,18.3 9,32.8 3,24.2" />{:else if shape === 'bullseye'}<circle cx="20" cy="20" r="17" fill="none" /><circle cx="20" cy="20" r="7.65" stroke="none" />{:else}<polygon points="20,2 38,20 20,38 2,20" />{/if}
{/snippet}

<section class="mx-auto max-w-[1800px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
  <header class="flex flex-wrap items-end justify-between gap-5">
    <div>
      <p class="text-xs uppercase tracking-[0.2em] text-ember-400">Reimagined · UnHoarder</p>
      <p class="mt-3 text-parchment-300">Choose what drops stand out. Reimagined item data is loaded for you.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="trade-secondary-button" disabled={!ready} onclick={() => importInput.click()}>Import as new filter</button>
      <input bind:this={importInput} class="hidden" type="file" accept=".json,application/json" aria-label="Import filter file" onchange={importFilter} />
      <button class="trade-primary-button" disabled={!ready || validation.errors.length > 0} onclick={download}>Download filter.json</button>
    </div>
  </header>
  <div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded border border-parchment-300/20 bg-abyss-950 px-4 py-3 text-sm">
    <div class="flex flex-wrap gap-x-4 gap-y-1"><span class:text-requirement={catalogError} class="text-parchment-300" role="status">{catalogStatus}</span>
      <button class="text-ember-400 hover:underline disabled:opacity-40" disabled={loading} onclick={() => loadCatalog()}>Retry data</button>
    </div>
  </div>
  <details class="mt-3 text-sm text-parchment-300">
    <summary class="cursor-pointer text-parchment-200">How to install your filter</summary>
    <p class="mt-2 max-w-4xl leading-relaxed">Use <strong>Save to account</strong>, then choose your filter in the launcher dropdown and click <strong>Apply filter</strong>. You can also download <code>filter.json</code> manually and place it in <code class="break-all">mods/Reimagined/d2rloader/config</code> (or <code class="break-all">mods/ReimaginedLadder/d2rloader/config</code>) with <code>pyre-lootfilter.dll</code> installed in <code>d2rloader/plugins</code>. Saving or applying a filter reloads it in game automatically.</p>
  </details>
  {#if message}<p class="mt-4 rounded border border-parchment-300/25 p-3 text-sm text-parchment-200" role="status">{message}</p>{/if}

  <div class="builder-grid mt-6 grid items-start gap-5">
    <aside class="rules-panel panel min-w-0 rounded-lg p-4" aria-label="Filter rules">
      <div class="flex items-center justify-between gap-2"><h2 class="display-text text-xl">Rules</h2><div class="flex gap-1.5">
        <button class="trade-primary-button !px-2 !py-1.5" disabled={!ready} onclick={() => add('show')}>+ Show</button>
        <button class="trade-secondary-button !px-2 !py-1.5" disabled={!ready} onclick={() => add('hide')}>+ Hide</button>
      </div></div>
      <label class="mt-4 block"><span class="text-xs uppercase tracking-widest text-parchment-300">Look up base item</span>
        <input class="field mt-1" type="search" placeholder="Search base, code, or unique/set to find its base…" bind:value={query} disabled={!ready} />
      </label>
      {#if query.trim()}
        <div class="mt-2 max-h-72 overflow-y-auto rounded border border-parchment-300/20" aria-label="Item search results">
          {#each matches as item}
            <div class="border-b border-parchment-300/10 p-2 last:border-0">
              <p class="break-words text-sm text-parchment-50">{item.displayName || item.name || item.code}</p>
              <p class="mt-0.5 text-xs text-parchment-300">{item.kind === 'unique' || item.kind === 'set' ? `Matches all ${item.kind} ${item.baseName || item.baseCode || item.code} drops` : `${item.baseName || item.code} · ${item.kind} base`}</p>
              <div class="mt-1.5 flex gap-3 text-xs"><button class="text-ember-400 hover:underline" aria-label={`Show ${item.displayName || item.name || item.code}`} onclick={() => add('show', item)}>{item.kind === 'unique' || item.kind === 'set' ? `+ Show ${item.kind} base` : '+ Show'}</button><button class="text-parchment-300 hover:text-white" aria-label={`Hide ${item.displayName || item.name || item.code}`} onclick={() => add('hide', item)}>{item.kind === 'unique' || item.kind === 'set' ? `+ Hide ${item.kind} base` : '+ Hide'}</button></div>
            </div>
          {:else}<p class="p-3 text-sm text-parchment-300">{loading ? 'Loading items…' : catalogError ? 'Retry data to load item search.' : 'No matching items.'}</p>{/each}
        </div>
      {/if}
      <p class="mt-2 text-xs leading-relaxed text-parchment-300">Ground items drop unidentified—selecting a unique or set adds a rule for its base item and rarity.</p>
      <ol class="rule-list mt-4 space-y-2">
        {#each filter.rules as rule, index}
          {@const summary = M.summarizeRule(rule)}
          {@const itemBlock = blockOf(rule)}
          {@const itemKind = kindOf(rule)}
          {@const chipStyle = ruleChipStyle(itemBlock, itemKind)}
          <li class="rounded border border-parchment-300/20 bg-abyss-950 p-2.5 transition-colors" class:hide-rule={itemKind === 'hide'} class:selected-rule={selected === index} class:drop-target={dropTarget === index}
            ondragover={event => { event.preventDefault(); dropTarget = index; }} ondragleave={() => { if (dropTarget === index) dropTarget = -1; }} ondrop={event => drop(event, index)}>
            <div class="rule-meta flex items-center justify-between gap-1 text-xs">
              <div class="flex min-w-0 flex-1 items-center gap-1.5">
                <button class="cursor-grab px-0.5 text-parchment-300 hover:text-parchment-50" draggable="true" aria-label={`Drag rule ${index + 1}`} title="Drag to reorder"
                  ondragstart={event => { dragged = index; event.dataTransfer?.setData('text/plain', String(index)); }} ondragend={() => { dragged = -1; dropTarget = -1; }}>⋮⋮</button>
                <button type="button" tabindex="-1" class="flex min-w-0 flex-1 items-center gap-1.5 text-left" onclick={() => selected = index}>
                  <span class={`inline-flex h-5 w-11 shrink-0 items-center justify-center rounded border text-[11px] font-medium capitalize ${itemKind === 'hide' ? 'border-[#6e3230] bg-[#2d1414] text-[#d9827b]' : 'border-[#355930] bg-[#172615] text-[#8cb881]'}`}>{itemKind}</span>
                  <span class="text-parchment-300">#{index + 1}</span>
                  {#if itemBlock.dropSound}<span class="rounded border border-parchment-300/20 px-1 py-0.5 text-[11px] text-parchment-200" title={`Drop sound: ${itemBlock.dropSound}`}>♪ {itemBlock.dropSound.replace('Filter', '')}</span>{/if}
                  {#if itemBlock.continue}<span class="rounded border border-ember-400/40 px-1 py-0.5 text-[11px] text-ember-400" title="Continues to matching rules below">↷</span>{/if}
                </button>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-parchment-300">
                <button aria-label={`Move rule ${index + 1} up`} title="Move up" disabled={index === 0} class="hover:text-ember-400 disabled:opacity-25" onclick={() => move(index, index - 1)}>↑</button>
                <button aria-label={`Move rule ${index + 1} down`} title="Move down" disabled={index === filter.rules.length - 1} class="hover:text-ember-400 disabled:opacity-25" onclick={() => move(index, index + 1)}>↓</button>
                <button aria-label={`Duplicate rule ${index + 1}`} title="Duplicate rule" class="hover:text-ember-400" onclick={() => duplicate(index)}>⧉</button>
                <button aria-label={`Delete rule ${index + 1}`} title="Delete rule" class="hover:text-requirement" onclick={() => remove(index)}>✕</button>
              </div>
            </div>
            <button class="block w-full pt-2 text-left" aria-label={`Select rule ${index + 1}`} aria-pressed={selected === index} onclick={() => selected = index}>
              <div class={`flex items-center gap-2 rounded text-sm ${chipStyle ? 'px-2.5 py-1.5' : `border border-transparent py-1.5 ${itemKind === 'hide' ? 'text-parchment-300' : 'text-parchment-50'}`}`} style={chipStyle}>
                {#if itemBlock.minimapIcon}
                  <svg class="shrink-0" width="14" height="14" viewBox="0 0 40 40" fill={cssColor(itemBlock.minimapIcon.fillColor, '#b48cff')} stroke={cssColor(itemBlock.minimapIcon.borderColor, '#e1cdff')} stroke-width="3" aria-hidden="true">
                    {@render minimapShape(itemBlock.minimapIcon.shape)}
                  </svg>
                {/if}
                <span class="min-w-0 flex-1 break-words leading-snug">{itemBlock.ruleName || 'Unnamed rule'}</span>
              </div>
              <span class="rule-meta mt-1.5 block break-words text-xs leading-relaxed text-parchment-300">{summary.conditionSummary}</span>
            </button>
          </li>
        {:else}<li class="py-8 text-center text-sm text-parchment-300">No rules yet. Look up a base item or add a Show or Hide rule.</li>{/each}
      </ol>
    </aside>

    <div class="panel min-w-0 rounded-lg p-4 sm:p-5">
      {#if current && block}<RuleEditor bind:block={() => block!, next => { filter.rules[selected] = kindOf(current) === 'hide' ? { hide: next } : { show: next }; }} kind={kindOf(current)} {catalog} onkind={changeKind} />
      {:else}<div class="py-16 text-center"><h2 class="display-text text-xl">Build your filter</h2><p class="mt-3 text-sm text-parchment-300">Add a rule to choose conditions, colors, sounds, and minimap icons.</p></div>{/if}
    </div>

    <aside class="preview panel min-w-0 rounded-lg p-4" aria-label="Filter preview">
      <div class="flex items-center justify-between gap-2"><h2 class="display-text text-xl">Preview</h2><span class="rounded border border-parchment-300/25 px-2 py-1 text-xs" class:text-set={!validation.errors.length} class:text-requirement={validation.errors.length > 0}>{validation.errors.length ? 'Invalid' : filter.rules.length ? 'Valid' : 'Empty'}</span></div>
      <div class="mt-4 flex min-h-28 flex-col items-center justify-center gap-3 rounded border border-parchment-300/15 bg-abyss-950 p-4" aria-label="Ground label preview">
        {#if block?.minimapIcon}
          <svg aria-label={`${block.minimapIcon.shape} minimap icon`} width={Math.max(12, Math.min(40, block.minimapIcon.size ?? 12))} height={Math.max(12, Math.min(40, block.minimapIcon.size ?? 12))} viewBox="0 0 40 40" fill={cssColor(block.minimapIcon.fillColor, '#b48cff')} stroke={cssColor(block.minimapIcon.borderColor, '#e1cdff')} stroke-width="2">
            {@render minimapShape(block.minimapIcon.shape)}
          </svg>
        {/if}
        <span class="max-w-full whitespace-pre-line break-words px-3 py-2 text-center font-serif" style={tooltipStyle}>{current && kindOf(current) === 'hide' ? 'Hidden item' : tooltipText}</span>
      </div>
      <p class="mt-2 text-xs text-parchment-300">Selected rule preview. In-game appearance may differ.</p>
      {#if block?.dropSound}<button class="trade-secondary-button mt-3 w-full" onclick={previewSound}>{$soundPreview.playing === block?.dropSound ? 'Replay sound' : `Preview ${block.dropSound}`}</button>{/if}
      <div class="mt-4 flex justify-between gap-2 text-xs text-parchment-300"><span>{filter.rules.length.toLocaleString()} / 4,096 rules</span><span>{validation.bytes.toLocaleString()} / 4 MiB</span></div>
      {#if validation.errors.length || validation.warnings.length}
        <ul class="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs" aria-label="Filter validation">
          {#each validation.errors.slice(0, 10) as error}<li class="text-requirement">{error}</li>{/each}
          {#each validation.warnings.slice(0, 8) as warning}<li class="text-parchment-300">{warning}</li>{/each}
        </ul>
      {/if}
      <details class="mt-4" open>
        <summary class="cursor-pointer text-xs uppercase tracking-widest text-parchment-300">Filter JSON</summary>
        <pre class="mt-2 max-h-[28rem] overflow-auto rounded border border-parchment-300/15 bg-abyss-950 p-3 font-mono text-xs text-parchment-200" aria-label="filter.json preview">{validation.json}</pre>
      </details>
      <button class="trade-secondary-button mt-3 w-full" onclick={copy}>Copy JSON</button>
    </aside>
  </div>
  <p class="mt-6 text-xs text-parchment-300">Filter format and validation adapted from <a class="text-ember-400 hover:underline" href="https://github.com/Lukaszpg/unhoarder-builder" target="_blank" rel="noreferrer">UnHoarder Builder by MindH1ve</a> · GPL-3.0. Native Reimagined editor.</p>
</section>

<style>
  .builder-grid { grid-template-columns: minmax(0, 1fr); }
  .hide-rule { border-style: dashed; border-color: rgb(148 163 184 / 0.45); background: #161922; }
  .selected-rule { border-style: solid; border-color: var(--color-ember-400); background: color-mix(in srgb, var(--color-ember-700) 12%, var(--color-abyss-950)); }
  .drop-target { outline: 2px dashed var(--color-ember-400); outline-offset: 2px; }
  .rule-list { max-height: 32rem; overflow-y: auto; }
  .rule-meta { font-family: Verdana, Helvetica, Arial, sans-serif; }
  @media (min-width: 1025px) {
    .builder-grid { grid-template-columns: 300px minmax(0, 1fr); }
    .rules-panel { align-self: start; position: sticky; top: 6rem; height: calc(100dvh - 7rem); display: flex; flex-direction: column; min-height: 0; }
    .rules-panel > :not(.rule-list) { flex-shrink: 0; }
    .rule-list { flex: 1 1 0; height: 0; min-height: 0; max-height: none; }
    .preview { grid-column: 1 / -1; }
  }
  @media (min-width: 1440px) { .builder-grid { grid-template-columns: 310px minmax(0, 1fr) 320px; } .preview { grid-column: auto; position: sticky; top: 6rem; } }
  @media (max-width: 640px) { .rule-list { max-height: 18rem; } }
</style>
