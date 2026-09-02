<script lang="ts">
  import { onMount } from 'svelte';
  import { beforeNavigate, goto } from '$app/navigation';
  import { apiRequest, authState, initializeAuth } from '$lib/auth';
  import { getMyCharacters, type CharacterResponse, type CharacterDetailsResponse } from '$lib/characters';
  import { loadSkillClasses } from '$lib/skills';
  import type { SkillClass } from '$lib/types';
  import { blockKinds, blockLabels, buildClasses, buildCategories, buildBudgets, duplicateVariant, getBuild,
    newBlock, newBuild, newVariant, publicationErrors, saveBuild, type BuildBlock, type BuildContent,
    type BuildDetails, type BuildItemReference } from '$lib/builds';
  import SkillPlanner from '$lib/components/skills/SkillPlanner.svelte';
  import BuildItemLink from './BuildItemLink.svelte';
  import BuildItemPicker from './BuildItemPicker.svelte';
  import BuildRenderer from './BuildRenderer.svelte';

  let { id = null }: { id?: string | null } = $props();
  let content = $state<BuildContent>(newBuild());
  let saved = $state<BuildDetails | null>(null);
  let revision = $state(0);
  let loading = $state(true);
  let ready = $state(false);
  let busy = $state(false);
  let error = $state('');
  let notice = $state('');
  let storageNotice = $state('');
  let baseline = $state('');
  let recovery = $state<{ content: BuildContent; revision: number; savedAt: string } | null>(null);
  let activeVariantId = $state('');
  let preview = $state(false);
  let pickerFor = $state('');
  let confirmation = $state<'publish' | 'unpublish' | 'delete' | null>(null);
  let classes = $state<SkillClass[]>([]);
  let characters = $state<CharacterResponse[]>([]);
  let characterError = $state('');
  let skillError = $state('');
  let equipment = $state<Record<string, CharacterDetailsResponse>>({});
  let textareas: Record<string, HTMLTextAreaElement> = {};
  let dirty = $derived(ready && JSON.stringify(content) !== baseline);
  let variant = $derived(content.document.variants.find(v => v.id === activeVariantId) ?? content.document.variants[0]);
  let skillClass = $derived(classes.find(c => c.Class === content.characterClass));
  let issues = $derived(publicationErrors(content));
  let storageKey = $derived(`d2r-build-draft:${$authState.user?.id ?? 'guest'}:${id ?? 'new'}`);
  let matchingCharacters = $derived(characters.filter(c => c.class === content.characterClass));

  onMount(async () => {
    await initializeAuth();
    try {
      if (id) {
        if (!$authState.user) { await goto(`/profile?returnTo=${encodeURIComponent(`/builds/${id}/edit`)}`); return; }
        applySaved(await getBuild(id, true));
      } else baseline = JSON.stringify(content);
      try {
        const local = JSON.parse(localStorage.getItem(storageKey) ?? (!id ? localStorage.getItem('d2r-build-draft:guest:new') : null) ?? 'null');
        if (local?.content?.document?.version === 1 && Array.isArray(local.content.document.variants)
          && local.content.document.variants.length && JSON.stringify(local.content) !== baseline) recovery = local;
      } catch { storageNotice = 'Local draft recovery is unavailable in this browser.'; }
      ready = true;
    } catch (value) { error = message(value); }
    finally { loading = false; }
    loadSkillClasses().then(value => classes = value).catch(() => skillError = 'Skill trees could not load. Refresh to retry.');
    if ($authState.user) getMyCharacters().then(value => characters = value).catch(() => characterError = 'Characters could not load. Refresh to retry.');
  });

  $effect(() => {
    if (!ready || !dirty || recovery) return;
    const local = JSON.stringify({ content, revision, savedAt: new Date().toISOString() });
    const key = storageKey;
    const timer = setTimeout(() => {
      try { localStorage.setItem(key, local); storageNotice = 'Changes backed up in this browser'; }
      catch { storageNotice = 'Local backup failed. Save your draft to avoid losing changes.'; }
    }, 400);
    return () => clearTimeout(timer);
  });
  beforeNavigate(({ cancel }) => {
    backupNow();
    if (dirty && !busy && !window.confirm('You have changes that are not saved to your account. Leave the editor?')) cancel();
  });
  function backupNow() {
    if (!dirty || recovery) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ content, revision, savedAt: new Date().toISOString() })); } catch { /* best effort */ }
  }
  function beforeUnload(event: BeforeUnloadEvent) { if (dirty) { backupNow(); event.preventDefault(); event.returnValue = ''; } }
  function exportDraft() {
    const url = URL.createObjectURL(new Blob([JSON.stringify($state.snapshot(content), null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'reimagined-build-draft.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function message(value: unknown) { return value instanceof Error ? value.message : 'Something went wrong. Please try again.'; }
  function applySaved(value: BuildDetails) {
    saved = value; content = value.content; equipment = value.equipment; revision = value.revision;
    baseline = JSON.stringify(value.content);
  }
  function restore() {
    if (!recovery) return;
    content = recovery.content;
    // A stale base revision must cause a server conflict, never overwrite newer work.
    revision = recovery.revision;
    recovery = null; notice = 'Recovered your local changes. Review them before saving.';
  }
  function discardRecovery() { recovery = null; try { localStorage.removeItem(storageKey); } catch { /* optional */ } }
  async function persist(publish = false) {
    if (busy || !ready) return;
    if (!$authState.user) { error = 'Sign in to save this build to your account. Your local draft stays in this browser.'; return; }
    if (!content.title.trim()) { error = 'Give your build a title before saving.'; return; }
    busy = true; error = ''; notice = '';
    const oldKey = storageKey;
    try {
      const result = await saveBuild(id, $state.snapshot(content), revision, publish);
      applySaved(result);
      try { localStorage.removeItem(oldKey); } catch { /* optional */ }
      confirmation = null; storageNotice = ''; notice = publish ? 'Published! Players can now read and discuss this build.' : 'Draft saved to your account.';
      if (!id) await goto(`/builds/${result.build.id}/edit`, { replaceState: true });
    } catch (value) { error = message(value); }
    finally { busy = false; }
  }
  async function changePublication(action: 'unpublish' | 'delete') {
    if (!id || busy) return;
    busy = true; error = '';
    try {
      await apiRequest(`/builds/${id}${action === 'unpublish' ? '/unpublish' : ''}`, {
        method: action === 'unpublish' ? 'POST' : 'DELETE', body: JSON.stringify({ revision })
      }, true);
      confirmation = null;
      if (action === 'delete') { baseline = JSON.stringify(content); await goto('/builds/mine'); }
      else { applySaved(await getBuild(id, true)); notice = 'Build unpublished. Your draft and community feedback are retained.'; }
    } catch (value) { error = message(value); }
    finally { busy = false; }
  }
  function addVariant(copy = false) {
    if (content.document.variants.length >= 8) return;
    const source = $state.snapshot(variant);
    const next = copy ? duplicateVariant(source) : newVariant(`Setup ${content.document.variants.length + 1}`);
    content.document.variants.push(next); activeVariantId = next.id;
    if (copy) source.blocks.forEach((block, index) => { if (equipment[block.id]) equipment[next.blocks[index].id] = equipment[block.id]; });
  }
  function removeVariant() {
    if (content.document.variants.length <= 1 || !window.confirm(`Remove the “${variant.name}” variant from this draft?`)) return;
    content.document.variants = content.document.variants.filter(v => v.id !== variant.id); activeVariantId = content.document.variants[0].id;
  }
  function moveBlock(index: number, delta: number) {
    const next = [...variant.blocks]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; variant.blocks = next;
  }
  function removeBlock(block: BuildBlock) {
    if (!window.confirm(`Remove “${block.title}” from this draft?`)) return;
    variant.blocks = variant.blocks.filter(b => b.id !== block.id);
  }
  function copyBlock(block: BuildBlock) {
    if (variant.blocks.length >= 40) return;
    const next = { ...structuredClone($state.snapshot(block)), snapshotSourceId: block.snapshotSourceId ?? block.id, id: crypto.randomUUID() };
    variant.blocks.splice(variant.blocks.indexOf(block) + 1, 0, next);
    if (equipment[block.id]) equipment[next.id] = equipment[block.id];
  }
  function changeClass(next: string) {
    if (next === content.characterClass) return;
    const hasPlans = content.document.variants.some(v => v.blocks.some(b => Object.values(b.ranks).some(n => n > 0) || b.characterId));
    if (hasPlans && !window.confirm('Changing class clears all skill allocations and equipment selections in this draft. Continue?')) return;
    content.characterClass = next;
    for (const v of content.document.variants) for (const b of v.blocks) { b.ranks = {}; b.characterId = null; }
    equipment = {};
  }
  function insert(block: BuildBlock, before: string, after = '', fallback = 'text') {
    const element = textareas[block.id];
    const start = element?.selectionStart ?? block.body.length;
    const end = element?.selectionEnd ?? start;
    block.body = block.body.slice(0, start) + before + (block.body.slice(start, end) || fallback) + after + block.body.slice(end);
    element?.focus();
  }
  function chooseItem(block: BuildBlock, reference: BuildItemReference) {
    if (block.kind === 'items') {
      if (block.items.length < 40 && !block.items.some(i => i.catalog === reference.catalog && i.key === reference.key)) block.items.push(reference);
    } else insert(block, `[[item:${reference.catalog}:${reference.key}]]`, '', '');
    pickerFor = '';
  }
</script>

<svelte:window onbeforeunload={beforeUnload} />
<svelte:head><title>{content.title || 'Create a build'} · Build workshop | D2R Reimagined</title><meta name="robots" content="noindex" /></svelte:head>

<div class="workshop">
  <div class="breadcrumb"><a href="/builds">Builds</a><span>/</span><a href="/builds/mine">My builds</a><span>/</span><span>Workshop</span></div>
  <div class="workshop-heading"><div><p class="eyebrow">THE BUILD WORKSHOP</p><h1>{id ? 'Shape your guide.' : 'Share what works.'}</h1><p class="intro">Your knowledge. Your setup. A guide the community can make their own.</p></div>
    <a href="/builds" class="subtle-link">Explore community builds ↗</a></div>
  {#if loading}<div class="empty">Opening the workshop…</div>{:else if !ready}<div class="alert" role="alert">{error}<a href="/builds/mine"> Back to my builds</a></div>
  {:else}
    <div class="save-bar"><div><span class="status-dot" class:unsaved={dirty}></span><span>{dirty ? 'Unsaved changes' : saved?.build.isPublished ? 'Published build' : 'Private draft'}</span><small>{storageNotice || (saved ? `Revision ${revision}` : 'Not yet saved to your account')}</small></div>
      <div class="actions"><button class="secondary" type="button" onclick={() => preview = !preview}>{preview ? '← Edit guide' : 'Preview guide'}</button>
        <button class="secondary" type="button" disabled={busy} onclick={() => persist(false)}>{busy ? 'Saving…' : 'Save draft'}</button>
        <button class="primary" type="button" disabled={busy || !$authState.user} onclick={() => confirmation = 'publish'}>{saved?.build.isPublished ? 'Publish changes' : 'Publish build'} ↗</button></div>
    </div>
    {#if !$authState.user}<div class="notice">You can experiment here. <a href="/profile?returnTo=%2Fbuilds%2Fnew">Sign in</a> to save drafts and publish. Guest drafts remain in this browser; export a copy before switching devices.</div>{/if}
    <div class="draft-tools"><button type="button" onclick={exportDraft}>Export draft JSON</button><span>Keep a portable backup of your guide content.</span></div>
    {#if recovery}<div class="notice"><p>A local draft from {new Date(recovery.savedAt).toLocaleString()} is available.</p><button onclick={restore}>Restore local draft</button><button onclick={discardRecovery}>Use saved version</button></div>{/if}
    {#if error}<div role="alert" class="alert">{error}</div>{/if}
    {#if notice}<div role="status" class="notice">{notice}</div>{/if}
    {#if confirmation}
      <div class="confirmation" role="region" aria-label="Confirm publication action">
        {#if confirmation === 'publish'}
          <h2>{saved?.build.isPublished ? 'Publish this revision?' : 'Ready for the community?'}</h2>
          <p>Your guide and selected character equipment snapshots will be public. Draft changes after publishing remain private until you publish again.</p>
          {#if issues.length}<ul>{#each issues as issue}<li>{issue}</li>{/each}</ul>{:else}<p class="valid">Your guide is ready to publish.</p>{/if}
          <button class="primary" disabled={busy || issues.length > 0} onclick={() => persist(true)}>Confirm publish</button>
        {:else}<h2>{confirmation === 'delete' ? 'Remove this build?' : 'Unpublish this build?'}</h2><p>{confirmation === 'delete' ? 'This removes the build from readers and your dashboard. Content is retained in the database for administrator recovery.' : 'The public guide, ratings, and discussion will be hidden. Your draft and feedback are retained for republishing.'}</p>
          <button class="danger" disabled={busy || dirty} onclick={() => changePublication(confirmation as 'delete' | 'unpublish')}>Confirm {confirmation}</button>
          {#if dirty}<p>Save your draft before continuing.</p>{/if}
        {/if}
        <button class="secondary" disabled={busy} onclick={() => confirmation = null}>Cancel</button>
      </div>
    {/if}
    {#if preview}
      <div class="preview-heading"><span class="eyebrow">READER PREVIEW</span><h2>{content.title || 'Untitled build'}</h2><p>{content.summary}</p></div>
      <BuildRenderer {content} {equipment} bind:activeVariantId />
    {:else}
      <fieldset disabled={busy} class="editor-fields">
        <div class="metadata panel-box"><div class="panel-title"><span>01</span><h2>The essentials</h2><p>Help the right players find your build.</p></div>
          <label class="wide">Build title<input maxlength="120" bind:value={content.title} placeholder="e.g. Frozen Orb Sorceress — from starter to endgame" /></label>
          <label class="wide">Short summary<textarea rows="2" maxlength="400" bind:value={content.summary} placeholder="What does this build do, who is it for, and what makes it worth playing?"></textarea><small>{content.summary.length}/400</small></label>
          <label>Class<select value={content.characterClass} onchange={event => { changeClass(event.currentTarget.value); event.currentTarget.value = content.characterClass; }}>{#each buildClasses as name}<option>{name}</option>{/each}</select></label>
          <label>Build focus<select bind:value={content.category}>{#each buildCategories as name}<option>{name}</option>{/each}</select></label>
          <label>Gear budget<select bind:value={content.budget}>{#each buildBudgets as name}<option>{name}</option>{/each}</select></label>
          <label>Game version / patch<input bind:value={content.patch} maxlength="40" placeholder="e.g. Reimagined 3.1" /></label>
          <label class="wide">Tags <span class="label-note">Up to 8, separated by commas</span><input value={content.tags.join(', ')} maxlength="198" onchange={event => content.tags = [...new Set(event.currentTarget.value.split(',').map(s => s.trim()).filter(Boolean))].slice(0, 8)} placeholder="Beginner friendly, Hardcore, Solo self-found…" /></label>
        </div>

        <div class="variant-editor panel-box"><div class="panel-title"><span>02</span><h2>Build your guide</h2><p>Arrange sections and create different setups.</p></div>
          <div class="variant-tabs">{#each content.document.variants as v}<button type="button" class:active={variant.id === v.id} aria-pressed={variant.id === v.id} onclick={() => activeVariantId = v.id}>{v.name || 'Unnamed setup'}</button>{/each}
            <button type="button" disabled={content.document.variants.length >= 8} onclick={() => addVariant()}>＋ Add variant</button></div>
          <div class="variant-info"><label>Variant name<input maxlength="60" bind:value={variant.name} placeholder="Starter, Budget, Endgame…" /></label><label>When to use this setup<input maxlength="400" bind:value={variant.description} placeholder="Explain what changes and when players should switch." /></label></div>
          <div class="variant-tools"><button type="button" disabled={content.document.variants.length >= 8} onclick={() => addVariant(true)}>Duplicate variant</button><button type="button" disabled={content.document.variants.length <= 1} onclick={removeVariant}>Remove variant</button></div>

          {#each variant.blocks as block, index (block.id)}
            <div class="block-editor"><div class="block-toolbar"><span class="block-type">{String(index + 1).padStart(2, '0')} · {blockLabels[block.kind]}</span>
              <div><button type="button" aria-label={`Move ${block.title} up`} disabled={index === 0} onclick={() => moveBlock(index, -1)}>↑</button><button type="button" aria-label={`Move ${block.title} down`} disabled={index === variant.blocks.length - 1} onclick={() => moveBlock(index, 1)}>↓</button><button type="button" disabled={variant.blocks.length >= 40} onclick={() => copyBlock(block)}>Duplicate</button><button type="button" class="remove" onclick={() => removeBlock(block)}>Remove</button></div></div>
              <label>Section title<input maxlength="120" bind:value={block.title} /></label>
              {#if block.kind === 'callout'}<label>Callout style<select bind:value={block.tone}><option value="tip">Tip</option><option value="warning">Warning</option><option value="pros">Strengths</option><option value="cons">Weaknesses</option></select></label>{/if}
              {#if block.kind === 'skills'}
                {#if skillClass}<SkillPlanner classes={[skillClass]} classCode={skillClass.ClassCode} bind:ranks={block.ranks} persist={false} compact />{:else}<p class="hint">{skillError || 'Loading skill planner…'}</p>{/if}
              {:else if block.kind === 'equipment'}
                <label>Character equipment snapshot<select bind:value={block.characterId}><option value={null}>Choose one of your characters…</option>{#each matchingCharacters as character}<option value={character.id}>{character.name} · Level {character.level}</option>{/each}</select></label>
                <p class="hint">The server captures the equipment and inventory on save. Publishing shares this snapshot, including if the original character is private. Later character changes do not alter this guide.</p>
                {#if characterError}<p class="alert">{characterError}</p>{:else if !matchingCharacters.length}<p class="hint">No matching characters. <a href="/profile">Upload a {content.characterClass} on your profile</a> first.</p>{/if}
                {#if equipment[block.id]}<p class="hint">Captured: {equipment[block.id].character.name}. Use preview to inspect equipment.</p><button type="button" class="secondary" onclick={() => { block.snapshotVersion++; notice = 'Equipment will be refreshed from the character when you save.'; }}>Refresh snapshot on next save</button>{/if}
              {:else if block.kind === 'items'}
                <div class="chosen-items">{#each block.items as reference, itemIndex}<span><BuildItemLink {reference} /><button type="button" aria-label={`Remove ${reference.key}`} onclick={() => block.items.splice(itemIndex, 1)}>×</button></span>{/each}</div>
                <button class="secondary" type="button" onclick={() => pickerFor = pickerFor === block.id ? '' : block.id}>＋ Find an item</button>
              {:else if block.kind === 'image' || block.kind === 'video'}
                <label>{block.kind === 'image' ? 'HTTPS image URL' : 'YouTube video URL'}<input type="url" maxlength="2000" bind:value={block.url} placeholder="https://…" /></label>
                <label>{block.kind === 'image' ? 'Description / alt text' : 'Caption'}<input maxlength="400" bind:value={block.caption} /></label>
              {/if}
              <div class="format-toolbar" aria-label={`Formatting for ${block.title}`}>
                <button type="button" title="Bold" onclick={() => insert(block, '**', '**')}>Bold</button><button type="button" title="Italic" onclick={() => insert(block, '*', '*')}>Italic</button>
                <button type="button" onclick={() => insert(block, '\n## ', '\n', 'Heading')}>Heading</button><button type="button" onclick={() => insert(block, '\n- ', '\n', 'List item')}>List</button>
                <button type="button" onclick={() => insert(block, '\n1. ', '\n', 'Step')}>Steps</button><button type="button" onclick={() => insert(block, '[', '](https://example.com)', 'Link')}>Link</button>
                <button type="button" onclick={() => insert(block, '\n| Stat | Target |\n| --- | --- |\n| ', ' |  |\n', 'Breakpoint')}>Table</button>
                <button type="button" onclick={() => pickerFor = pickerFor === block.id ? '' : block.id}>Item tooltip</button>
              </div>
              {#if pickerFor === block.id}<BuildItemPicker onchoose={reference => chooseItem(block, reference)} />{/if}
              <label>{['text','callout'].includes(block.kind) ? 'Section content' : 'Notes (optional)'}<textarea bind:this={textareas[block.id]} rows={['text','callout'].includes(block.kind) ? 7 : 3} maxlength="20000" bind:value={block.body} placeholder="Write your guide. Use the toolbar or Markdown to format it."></textarea></label>
              <p class="hint">Markdown: **bold**, *italic*, headings, lists, tables, quotes, code, links, and inline item tooltips. HTML is displayed as text.</p>
            </div>
          {/each}
          <div class="add-section"><p>ADD A SECTION</p><div>{#each blockKinds as kind}<button type="button" disabled={variant.blocks.length >= 40} onclick={() => variant.blocks.push(newBlock(kind))}>＋ {blockLabels[kind]}</button>{/each}</div><small>{variant.blocks.length}/40 sections in this variant</small></div>
        </div>
      </fieldset>
    {/if}
    {#if saved}<div class="manage-bar"><a href="/builds/mine">← My builds</a>{#if saved.build.isPublished}<a href={`/builds/${saved.build.id}`}>View published guide ↗</a><button disabled={busy || dirty} onclick={() => confirmation = 'unpublish'}>Unpublish</button>{/if}<button disabled={busy || dirty} class="remove" onclick={() => confirmation = 'delete'}>Remove build</button></div>{/if}
  {/if}
</div>

<style>
  .workshop { max-width:1380px; margin:0 auto; padding:2rem clamp(1rem,4vw,3rem) 5rem; min-height:80vh; }
  .draft-tools { display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:1.2rem; color:#9b8c71; font:11px Arial,sans-serif; }.draft-tools button { color:#bfa369; text-decoration:underline; }
  .breadcrumb { display:flex; gap:.65rem; color:#877e6d; font:11px Arial,sans-serif; margin-bottom:2rem; }
  .breadcrumb a:hover,.subtle-link:hover { color:#ead09b; }
  .workshop-heading { display:flex; align-items:end; justify-content:space-between; gap:2rem; margin-bottom:2rem; }
  .eyebrow { font:10px Arial,sans-serif; letter-spacing:.24em; color:#bda06b; }
  h1 { font-family:var(--font-display); font-size:clamp(1.8rem,3.5vw,2.8rem); margin:.7rem 0; }
  .intro { color:#a99f8f; font:14px/1.7 Arial,sans-serif; }.subtle-link { font:12px Arial,sans-serif; color:#c7b790; }
  .save-bar { position:sticky; top:64px; z-index:35; display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; background:#141312f5; border:1px solid #aa8c5038; border-radius:7px; padding:1rem; margin-bottom:1.5rem; font:12px Arial,sans-serif; }
  .save-bar > div:first-child { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }small { color:#887f70; font:11px/1.5 Arial,sans-serif; }
  .status-dot { width:6px; height:6px; border-radius:50%; background:#81b191; }.status-dot.unsaved { background:#d7a65b; }
  .actions { display:flex; gap:.5rem; flex-wrap:wrap; }button { cursor:pointer; }button:disabled { opacity:.4; cursor:not-allowed; }
  .primary,.secondary,.danger { display:inline-block; border-radius:4px; padding:.75rem 1rem; font:12px Arial,sans-serif; border:1px solid #ad926146; }
  .primary { background:#b39962; border-color:#b39962; color:#100e09; font-weight:600; }.primary:hover { background:#c8ac71; }.secondary { background:#ffffff04; color:#d9cbb0; }.danger { background:#792a20; color:#fff; }
  .notice,.alert,.confirmation { margin:1rem 0; padding:1rem 1.2rem; border:1px solid #8da88544; border-radius:5px; background:#8da88508; font:13px/1.7 Arial,sans-serif; color:#d0d7c6; }
  .alert { border-color:#e0796655; color:#efac9a; }.notice a,.hint a { text-decoration:underline; color:#e9c686; }.notice button { margin:.7rem 1rem 0 0; text-decoration:underline; }
  .confirmation { border-color:#bda06566; color:#d9c9a9; }.confirmation h2 { font-size:1.25rem; margin-bottom:.5rem; }.confirmation button { margin:.7rem .5rem 0 0; }.confirmation ul { list-style:disc; padding-left:1.5rem; color:#e7a492; }.valid { color:#9ac9a0; }
  .editor-fields { border:0; padding:0; min-width:0; }.panel-box { border:1px solid #b49a642e; border-radius:7px; background:#151413; padding:clamp(1rem,2.5vw,2rem); margin-bottom:1.5rem; min-width:0; }
  .panel-title { display:flex; flex-wrap:wrap; align-items:baseline; gap:.7rem; grid-column:1/-1; margin-bottom:.5rem; }.panel-title > span { font:11px monospace; color:#b49a64; }.panel-title h2 { font-family:var(--font-display); font-size:1.25rem; }.panel-title p { margin-left:auto; font:12px Arial,sans-serif; color:#918777; }
  .metadata { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:1.3rem 1rem; }.wide { grid-column:1/-1; }
  label { display:flex; flex-direction:column; gap:.55rem; color:#bdb29e; font:12px/1.5 Arial,sans-serif; min-width:0; }.label-note { color:#857b6b; }
  input,textarea,select { width:100%; min-width:0; color:#ede3d1; background:#0d0c0b; border:1px solid #b49a6436; border-radius:4px; padding:.8rem .9rem; font:14px/1.6 Arial,sans-serif; }
  textarea { resize:vertical; }.variant-tabs { display:flex; flex-wrap:wrap; gap:.5rem; margin:1.5rem 0; }.variant-tabs button { border:1px solid #b49a6436; border-radius:4px; padding:.65rem .9rem; color:#ae9d80; font:12px Arial,sans-serif; overflow-wrap:anywhere; }
  .variant-tabs .active { background:#b49a641d; color:#e7c784; border-color:#b49a6480; }.variant-info { display:grid; grid-template-columns:1fr 2fr; gap:1rem; }.variant-tools { display:flex; gap:1rem; margin:1rem 0 1.5rem; font:11px Arial,sans-serif; color:#b4a485; }
  .block-editor { border:1px solid #ffffff17; border-radius:6px; padding:1.2rem; background:#0f0e0d; margin-bottom:1rem; min-width:0; }.block-editor > label { margin:.8rem 0; }.block-toolbar { display:flex; justify-content:space-between; flex-wrap:wrap; gap:.5rem; margin-bottom:1rem; }.block-type { text-transform:uppercase; letter-spacing:.1em; font:10px Arial,sans-serif; color:#b79b64; }.block-toolbar > div { display:flex; gap:.7rem; font:11px Arial,sans-serif; color:#ad9d80; }.remove { color:#cd8d7d; }
  .format-toolbar { display:flex; flex-wrap:wrap; gap:.3rem; margin-top:1rem; }.format-toolbar button { border:1px solid #ffffff15; border-radius:3px; padding:.45rem .6rem; font:11px Arial,sans-serif; color:#c6bba5; }.format-toolbar button:hover { background:#ffffff08; }
  .hint { font:11px/1.7 Arial,sans-serif; color:#958a77; margin:.6rem 0; }.chosen-items { display:flex; flex-wrap:wrap; gap:.5rem; margin:.8rem 0; }.chosen-items > span { border:1px solid #ffffff15; padding:.5rem .8rem; border-radius:4px; font:13px Arial,sans-serif; }.chosen-items button { margin-left:.7rem; color:#bb8a78; }
  .add-section { padding:1.2rem; border:1px dashed #b49a6445; border-radius:5px; margin-top:1.5rem; }.add-section p { font:10px Arial,sans-serif; letter-spacing:.15em; color:#a99775; margin-bottom:1rem; }.add-section > div { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:.7rem; }.add-section button { border:1px solid #ffffff15; border-radius:4px; padding:.7rem; font:12px Arial,sans-serif; color:#c7b38c; }.add-section button:hover { border-color:#b49a6490; }
  .preview-heading { padding:2rem 0; }.preview-heading h2 { font-family:var(--font-display); font-size:2rem; margin:.8rem 0; overflow-wrap:anywhere; }.preview-heading p { color:#b9aa8f; font:15px/1.8 Arial,sans-serif; }
  .manage-bar { display:flex; flex-wrap:wrap; gap:1.5rem; padding:1.5rem 0; font:12px Arial,sans-serif; color:#b6a482; }.empty { text-align:center; padding:5rem; color:#a89b84; }
  @media(max-width:750px){.metadata{grid-template-columns:repeat(2,minmax(0,1fr));}.workshop-heading{display:block;}.subtle-link{display:inline-block;margin-top:1rem;}.variant-info{grid-template-columns:1fr;}.panel-title p{width:100%;margin:0;}.block-editor{padding:.8rem;}.save-bar{position:static;}.save-bar .actions{width:100%;}}
  @media(max-width:400px){.metadata{grid-template-columns:1fr;}.actions{gap:.3rem;}.primary,.secondary{padding:.65rem .6rem;font-size:11px;}}
</style>
