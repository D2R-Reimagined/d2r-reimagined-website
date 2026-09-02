<script lang="ts">
  import { onMount } from 'svelte';
  import { loadSkillClasses } from '$lib/skills';
  import type { SkillClass } from '$lib/types';
  import type { CharacterDetailsResponse } from '$lib/characters';
  import { safeMediaUrl, youtubeEmbedUrl, type BuildContent } from '$lib/builds';
  import CharacterViewer from '$lib/components/CharacterViewer.svelte';
  import SkillPlanner from '$lib/components/skills/SkillPlanner.svelte';
  import BuildMarkdown from './BuildMarkdown.svelte';
  import BuildItemLink from './BuildItemLink.svelte';

  let { content, equipment = {}, activeVariantId = $bindable('') }: {
    content: BuildContent; equipment?: Record<string, CharacterDetailsResponse>; activeVariantId?: string;
  } = $props();
  let classes = $state<SkillClass[]>([]);
  let skillError = $state('');
  let variant = $derived(content.document.variants.find(v => v.id === activeVariantId) ?? content.document.variants[0]);
  let skillClass = $derived(classes.find(c => c.Class === content.characterClass));
  onMount(() => { loadSkillClasses().then(value => classes = value).catch(() => skillError = 'Skill trees could not be loaded. Refresh to retry.'); });
</script>

<div class="build-renderer">
  <div class="variant-bar" aria-label="Build variants">
    <span class="variant-label">SETUP</span>
    {#each content.document.variants as option}
      <button type="button" class:active={variant?.id === option.id} aria-pressed={variant?.id === option.id}
        onclick={() => activeVariantId = option.id}>{option.name}</button>
    {/each}
  </div>
  {#if variant}
    {#if variant.description}<p class="variant-description">{variant.description}</p>{/if}
    <div class="reader-layout">
      <nav class="contents" aria-label="On this page">
        <p>ON THIS PAGE</p>
        {#each variant.blocks as block, i}<a href={`#section-${block.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{block.title}</a>{/each}
      </nav>
      <div class="sections">
        {#each variant.blocks as block, i (block.id)}
          <section id={`section-${block.id}`} class="guide-section" class:callout={block.kind === 'callout'} data-tone={block.tone}>
            <div class="section-heading"><span>{String(i + 1).padStart(2, '0')}</span><h2>{block.title}</h2></div>
            {#if block.kind === 'skills'}
              {#if skillClass}<SkillPlanner classes={[skillClass]} classCode={skillClass.ClassCode} ranks={block.ranks} persist={false} readonly compact />
              {:else}<p class="muted">{skillError || 'Loading skill trees…'}</p>{/if}
            {:else if block.kind === 'equipment'}
              {#if equipment[block.id]}<CharacterViewer details={equipment[block.id]} inventoryOnly embedded />
              {:else}<p class="muted">Select a character and save the draft to capture its equipment.</p>{/if}
            {:else if block.kind === 'items'}
              <div class="item-list">{#each block.items as reference}<span class="item-chip"><BuildItemLink {reference} /></span>{/each}</div>
            {:else if block.kind === 'image' && safeMediaUrl(block.url)}
              <figure><img src={safeMediaUrl(block.url)!} alt={block.caption || block.title} loading="lazy" referrerpolicy="no-referrer" />
                {#if block.caption}<figcaption>{block.caption}</figcaption>{/if}</figure>
            {:else if block.kind === 'video' && youtubeEmbedUrl(block.url)}
              <iframe src={youtubeEmbedUrl(block.url)!} title={block.title} loading="lazy" referrerpolicy="no-referrer" allowfullscreen
                sandbox="allow-scripts allow-same-origin allow-presentation" allow="encrypted-media; picture-in-picture; fullscreen"></iframe>
              {#if block.caption}<p class="muted">{block.caption}</p>{/if}
            {/if}
            {#if block.body}<BuildMarkdown text={block.body} />{/if}
          </section>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .build-renderer { min-width:0; }
  .variant-bar { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; padding:1rem 0; border-block:1px solid #bc9a652d; }
  .variant-label,.contents p { color:#9d927d; font:10px Arial,sans-serif; letter-spacing:.18em; margin-right:1rem; }
  .variant-bar button { padding:.65rem 1.1rem; border:1px solid #ffffff15; background:#ffffff04; border-radius:5px; font:13px Arial,sans-serif; overflow-wrap:anywhere; }
  .variant-bar button.active { background:#b9924820; border-color:#b9924870; color:#f2d492; }
  .variant-description { margin:1.2rem 0; color:#c3b8a5; font:14px/1.6 Arial,sans-serif; }
  .reader-layout { display:grid; grid-template-columns:190px minmax(0,1fr); gap:2.5rem; margin-top:2rem; align-items:start; }
  .contents { position:sticky; top:90px; display:grid; gap:.3rem; max-height:calc(100vh - 110px); overflow:auto; }
  .contents p { margin-bottom:1rem; } .contents a { display:flex; gap:.8rem; padding:.65rem .2rem; color:#bdb09a; font:12px/1.5 Arial,sans-serif; overflow-wrap:anywhere; }
  .contents a:hover { color:#f6dca3; } .contents a span { color:#675940; }
  .sections { min-width:0; }
  .guide-section { scroll-margin-top:95px; padding-bottom:2rem; margin-bottom:2rem; border-bottom:1px solid #ffffff10; min-width:0; }
  .section-heading { display:flex; align-items:baseline; gap:.85rem; margin-bottom:1.25rem; }
  .section-heading > span { font:11px monospace; color:#a68548; }
  h2 { font-family:var(--font-display); font-size:1.45rem; color:#ede1c8; overflow-wrap:anywhere; }
  .callout { border:1px solid #67988550; border-left:3px solid #679885; border-radius:5px; padding:1.3rem; background:#67988508; }
  .callout[data-tone='warning'],.callout[data-tone='cons'] { border-color:#bd785a60; border-left-color:#bd785a; background:#bd785a08; }
  .item-list { display:flex; flex-wrap:wrap; gap:.6rem; margin-bottom:1rem; }.item-chip { padding:.7rem 1rem; border:1px solid #bb9e5835; border-radius:5px; background:#bb9e5808; }
  .muted,figcaption { color:#a69b88; font:13px/1.6 Arial,sans-serif; padding:.7rem 0; }
  figure img { max-width:100%; max-height:800px; object-fit:contain; border-radius:5px; }
  iframe { width:100%; aspect-ratio:16/9; border:1px solid #ffffff20; border-radius:5px; margin-bottom:1rem; }
  @media(max-width:850px) { .reader-layout { grid-template-columns:minmax(0,1fr); gap:1.5rem; } .contents { position:static; display:flex; flex-wrap:wrap; gap:.2rem .8rem; max-height:none; } .contents p { width:100%; margin-bottom:.3rem; } .contents a { padding:.4rem 0; } }
</style>
