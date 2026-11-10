<script lang="ts">
  // Item and skill search anchored to the caret. Inline mode ("@query") reads the query
  // from the line and gets keys through handleKey; box mode has its own search field.
  import { onMount, tick } from 'svelte';
  import { loadCatalog } from '#lib/catalog-sources.js';
  import { loadSkillClasses } from '#lib/skills.js';
  import { buildItemKey, buildItemTitle } from '#lib/build-items.js';
  import { skillPreviewRank } from '#lib/build-skills.js';
  import { i18n } from '#lib/i18n.js';
  import { rankReferences, type ReferenceEntry } from '#lib/build-editor/menus.js';
  import type { Atom } from '#lib/build-editor/inline.js';
  import type { BuildItemReference } from '#lib/builds.js';
  import type { CatalogItem, Skill, SkillClass } from '#lib/types.js';
  import Popover from './Popover.svelte';
  import type { CaretRect } from './dom';

  type Catalog = Exclude<BuildItemReference['catalog'], 'cube-recipes'>;
  let { anchor, inline = false, query: inlineQuery = '', target = 'all', characterClass, onchoose, onclose }: {
    anchor: CaretRect; inline?: boolean; query?: string; target?: 'all' | 'item' | 'skill'; characterClass: string;
    onchoose: (atom: Atom) => void;
    /** `refocus` is false when focus already moved elsewhere. */
    onclose: (refocus: boolean) => void;
  } = $props();

  const catalogs: Catalog[] = ['uniques', 'sets', 'runewords', 'bases'];
  const catalogLabels: Record<Catalog, string> = { uniques: 'Unique', sets: 'Set', runewords: 'Runeword', bases: 'Base' };
  const id = `refs-${Math.random().toString(36).slice(2, 9)}`;

  let element = $state<HTMLDivElement>();
  let search = $state<HTMLInputElement>();
  let list = $state<HTMLDivElement>();
  let ownQuery = $state('');
  let rank = $state(1);
  let active = $state(0);
  let items = $state<Partial<Record<Catalog, CatalogItem[]>>>({});
  let classes = $state<SkillClass[]>([]);
  let loading = $state(true);
  let error = $state('');
  let attempt = $state(0);

  let query = $derived(inline ? inlineQuery : ownQuery);
  let wantsItems = $derived(target !== 'skill');
  let wantsSkills = $derived(target !== 'item');

  $effect(() => {
    void attempt;
    let live = true;
    loading = true; error = '';
    const jobs: Promise<unknown>[] = [];
    if (wantsItems) for (const catalog of catalogs) jobs.push(loadCatalog(catalog).then(rows => { if (live) items = { ...items, [catalog]: rows }; }));
    if (wantsSkills) jobs.push(loadSkillClasses().then(rows => { if (live) classes = rows; }));
    Promise.allSettled(jobs).then(results => {
      if (!live) return;
      loading = false;
      if (results.some(r => r.status === 'rejected')) error = 'Some catalogs could not be loaded.';
    });
    return () => { live = false; };
  });

  let skillsById = $derived(new Map(classes.flatMap(entry => entry.Tabs.flatMap(tab => tab.Skills)).map(skill => [skill.Id, skill] as [number, Skill])));
  let entries = $derived.by(() => {
    const out: ReferenceEntry[] = [];
    const seen = new Set<string>();
    if (wantsItems) for (const catalog of catalogs) for (const item of items[catalog] ?? []) {
      const key = buildItemKey(item, catalog);
      const entryId = `${catalog}:${key}`;
      if (!key || key.length > 160 || /[\]\n]/.test(key) || seen.has(entryId)) continue;
      seen.add(entryId);
      out.push({ id: entryId, title: buildItemTitle(item, catalog, $i18n), detail: catalogLabels[catalog], atom: { kind: 'item', catalog, key } });
    }
    if (wantsSkills) for (const entry of classes) for (const tab of entry.Tabs) for (const skill of tab.Skills) {
      if (seen.has(`skill:${skill.Id}`)) continue;
      seen.add(`skill:${skill.Id}`);
      out.push({ id: `skill:${skill.Id}`, title: $i18n.t(skill.NameKey), detail: `${$i18n.t(entry.NameKey)} skill`, skillClass: entry.Class, atom: { kind: 'skill', skillId: skill.Id, rank: 1 } });
    }
    return out;
  });
  let results = $derived(rankReferences(entries, query, characterClass, 40));

  $effect(() => { void query; active = 0; });
  $effect(() => {
    void active;
    void tick().then(() => list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }));
  });
  onMount(() => { if (!inline) search?.focus(); });

  function choose(entry: ReferenceEntry | undefined) {
    if (!entry) return;
    if (entry.atom.kind === 'skill') {
      const skill = skillsById.get(entry.atom.skillId);
      onchoose({ ...entry.atom, rank: skill ? skillPreviewRank(skill, rank) : Math.min(Math.max(Math.trunc(rank) || 1, 1), 99) });
    } else onchoose(entry.atom);
  }

  /** Keyboard handling shared by the line (inline mode) and the search field. Returns true when used. */
  export function handleKey(event: KeyboardEvent): boolean {
    if (event.key === 'Escape') { event.preventDefault(); onclose(true); return true; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!results.length) return false;
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      return true;
    }
    if ((event.key === 'Enter' && !event.shiftKey) || (inline && event.key === 'Tab')) {
      if (!results.length) return false;
      event.preventDefault();
      choose(results[active]);
      return true;
    }
    return false;
  }

  function focusOut(event: FocusEvent) {
    // Box mode closes when focus leaves the picker (inline mode follows the line's caret).
    const next = event.relatedTarget as Node | null;
    if (!inline && (!next || !element?.contains(next))) onclose(false);
  }
  const hint = $derived(target === 'skill' ? 'skills' : target === 'item' ? 'items' : 'items and skills');
</script>

<Popover {anchor} bind:element class="reference-picker" role="dialog" aria-label={`Insert ${hint}`} onfocusout={focusOut}>
  {#if !inline}
    <input bind:this={search} class="search" bind:value={ownQuery} placeholder={`Search ${hint}…`} aria-label={`Search ${hint}`}
      role="combobox" aria-expanded="true" aria-controls={id} aria-autocomplete="list" onkeydown={event => { handleKey(event); }} />
  {:else}
    <p class="heading">{query ? `Items and skills matching “${query}”` : 'Type to search items and skills'}</p>
  {/if}
  <div class="scroll" bind:this={list} role="listbox" id={id} aria-label="Results">
    {#each results as entry, i (entry.id)}
      <button type="button" role="option" aria-selected={i === active} class:active={i === active} tabindex="-1"
        onmousedown={event => event.preventDefault()} onmousemove={() => { active = i; }} onclick={() => choose(entry)}>
        <span class="title">{entry.title}</span><span class="detail">{entry.detail}</span>
      </button>
    {:else}
      <p class="empty">
        {#if loading}Loading catalogs…
        {:else if !query}{wantsSkills ? 'Type to search.' : 'Type to search unique items, sets, runewords and bases.'}
        {:else}No matches.{/if}
      </p>
    {/each}
  </div>
  {#if error}<p class="error" role="alert">{error} <button type="button" class="retry" onmousedown={event => event.preventDefault()} onclick={() => attempt++}>Retry</button></p>{/if}
  {#if wantsSkills}
    <label class="rank">Skill tooltip level
      <input type="number" min="1" max="99" bind:value={rank} onkeydown={event => { if (event.key === 'Enter' || event.key === 'Escape') handleKey(event); }} />
    </label>
  {/if}
</Popover>

<style>
  :global(.reference-picker) { width:330px; display:grid; }
  .search { margin:.5rem .5rem 0; padding:.5rem .65rem; border:1px solid rgb(188 167 125 / .3); border-radius:6px; background:#0d0d0e; color:var(--color-parchment-50); }
  .search:focus { outline:2px solid var(--color-ember-400); outline-offset:1px; }
  .heading { padding:.6rem .8rem .2rem; font-size:12px; color:var(--color-parchment-300); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .scroll { max-height:min(300px, 45vh); overflow:auto; padding:.35rem; }
  button[role="option"] { display:flex; width:100%; justify-content:space-between; gap:.8rem; padding:.45rem .55rem; border-radius:6px; text-align:left; color:var(--color-parchment-200); }
  button.active { background:#ffffff10; color:var(--color-parchment-50); }
  .title { min-width:0; overflow-wrap:anywhere; }
  .detail { flex:none; font-size:12px; color:var(--color-parchment-300); }
  .empty, .error { padding:.6rem .55rem; color:var(--color-parchment-300); font-size:13px; }
  .retry { text-decoration:underline; color:var(--color-parchment-50); }
  .rank { display:flex; align-items:center; justify-content:space-between; gap:.6rem; padding:.5rem .8rem .65rem; border-top:1px solid #ffffff12; font-size:12px; color:var(--color-parchment-300); }
  .rank input { width:4.5rem; padding:.3rem .45rem; border:1px solid rgb(188 167 125 / .3); border-radius:5px; background:#0d0d0e; color:var(--color-parchment-50); }
  .rank input:focus-visible { outline:2px solid var(--color-ember-400); outline-offset:1px; }
</style>
