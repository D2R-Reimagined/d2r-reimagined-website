<script lang="ts">
  import { page } from '$app/state';
  import { buildClasses, buildCategories, buildBudgets } from '$lib/builds';
  import BuildCard from '$lib/components/builds/BuildCard.svelte';
  let { data } = $props();
  function filtered(key: string, value: string) {
    const params = new URLSearchParams(page.url.searchParams); params.delete('skip');
    if (value) params.set(key,value); else params.delete(key);
    return `/builds?${params}`;
  }
  function pageLink(skip: number) { const params = new URLSearchParams(page.url.searchParams); params.set('skip',String(skip)); return `/builds?${params}`; }
</script>
<svelte:head><title>Community Builds | D2R Reimagined</title><meta name="description" content="Find your next D2R Reimagined build. Community-written guides with item tooltips, equipment, skill trees, and player reviews." /><meta property="og:title" content="Community Builds · D2R Reimagined" /></svelte:head>
<div class="builds-page">
  <section class="library-hero"><div class="hero-copy"><p class="eyebrow">THE REIMAGINED BUILD LIBRARY</p><h1 class="build-title">Your next build.<br /><span>Made by the community.</span></h1><p class="build-intro">From your first steps in Sanctuary to your next endgame obsession. Find a guide, explore the gear, and make it yours.</p>
    <div class="hero-actions"><a href="/builds/new" class="primary">＋ Create a build</a><a href="/builds/mine" class="secondary">My builds</a></div></div>
    <div class="hero-note"><span class="ornament" aria-hidden="true">✧</span><p>THEORY. TEST. SHARE.</p><span>Real setups.<br />Knowledge worth passing on.</span></div>
  </section>
  <nav class="class-filter" aria-label="Filter builds by class"><a href={filtered('characterClass','')} class:active={!data.filters.characterClass}>All classes</a>{#each buildClasses as name}<a href={filtered('characterClass',name)} class:active={data.filters.characterClass === name} aria-current={data.filters.characterClass === name ? 'page' : undefined}>{name}</a>{/each}</nav>
  <div class="library-heading"><div><h2>{data.filters.characterClass || 'Community'} builds</h2><p>Find a playstyle that feels like you.</p></div><span>{data.serviceError ? 'Library unavailable' : `${data.results.total} ${data.results.total === 1 ? 'guide' : 'guides'}`}</span></div>
  <form class="filters" method="GET" action="/builds"><input type="hidden" name="characterClass" value={data.filters.characterClass} />
    <label class="search">Search<input name="search" value={data.filters.search} placeholder="Build, skill, creator, or tag…" maxlength="100" /></label>
    <label>Build focus<select name="category" value={data.filters.category}><option value="">Any focus</option>{#each buildCategories as name}<option>{name}</option>{/each}</select></label>
    <label>Gear budget<select name="budget" value={data.filters.budget}><option value="">Any budget</option>{#each buildBudgets as name}<option>{name}</option>{/each}</select></label>
    <label>Sort by<select name="sort" value={data.filters.sort}><option value="updated">Recently updated</option><option value="rating">Top rated</option><option value="newest">Newest guides</option></select></label>
    <button type="submit" class="secondary">Find builds</button>
    <details class="more-filters"><summary>More filters</summary><div><label>Game version / patch<input name="patch" value={data.filters.patch} maxlength="40" placeholder="Any patch" /></label><label>Exact tag<input name="tag" value={data.filters.tag} maxlength="24" placeholder="e.g. Hardcore" /></label><a href="/builds">Clear all filters</a></div></details>
  </form>
  {#if data.serviceError}<div class="alert" role="alert">{data.serviceError} <a href={page.url.pathname + page.url.search}>Retry</a></div>
  {:else if !data.results.items.length}<div class="empty"><p class="eyebrow">A NEW CHAPTER STARTS HERE</p><h2>{Object.entries(data.filters).some(([key,value]) => key !== 'sort' && value) ? 'No builds match these filters.' : 'Be the first to share a build.'}</h2><p>Bring your favorite setup to the community with equipment, interactive skill trees, and a guide written your way.</p><a href="/builds/new" class="primary">Open the build workshop ↗</a><a href="/builds" class="clear">Clear filters</a></div>
  {:else}<div class="guide-grid">{#each data.results.items as build (build.id)}<BuildCard {build} />{/each}</div>
    <nav class="pager" aria-label="Build results pages">{#if data.results.skip > 0}<a class="secondary" href={pageLink(Math.max(0,data.results.skip - data.results.count))}>← Previous</a>{/if}<span>{data.results.skip + 1}–{Math.min(data.results.skip + data.results.count,data.results.total)} of {data.results.total}</span>{#if data.results.skip + data.results.count < data.results.total}<a class="secondary" href={pageLink(data.results.skip + data.results.count)}>Next →</a>{/if}</nav>{/if}
  <aside class="creator-invite"><div><p class="eyebrow">GOT A SETUP WORTH SHARING?</p><h2>Turn your experience into someone’s next adventure.</h2><p>Flexible sections. Equipment snapshots. Skill trees. Your guide, your way.</p></div><a class="secondary" href="/builds/new">Start writing ↗</a></aside>
</div>
<style>
  .library-hero { position:relative; display:flex; align-items:center; gap:2rem; padding:1rem 0 3rem; border-bottom:1px solid #b9a16822; }.hero-copy{max-width:830px;}.build-title span{color:#bda776;}.hero-actions{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.5rem;}.hero-note{margin-left:auto;text-align:center;min-width:200px;}.ornament{display:block;font:110px/1.2 Georgia,serif;color:#b79b6540;text-shadow:0 0 65px #b3985230;}.hero-note p{color:#b19a67;font:10px Arial,sans-serif;letter-spacing:.2em;margin:1rem 0;}.hero-note > span:last-child{color:#6d6453;font:11px/1.8 Arial,sans-serif;}
  .class-filter{display:flex;gap:.35rem;flex-wrap:wrap;margin:1.5rem 0 2.5rem;}.class-filter a{padding:.7rem .95rem;color:#a19378;font:11px Arial,sans-serif;border:1px solid #ffffff13;border-radius:4px;}.class-filter a.active{color:#edcd88;border-color:#af955660;background:#af955613;}.class-filter a:hover{color:#edcd88;}
  .library-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.4rem;}.library-heading h2{font:1.5rem var(--font-display);color:#e8dcc3;}.library-heading p{font:12px Arial,sans-serif;color:#8d826e;margin-top:.5rem;}.library-heading > span{font:11px Arial,sans-serif;color:#82765f;}
  .filters{display:grid;grid-template-columns:minmax(150px,2fr) repeat(3,minmax(100px,1fr)) auto;gap:.8rem;align-items:end;border:1px solid #b49a6420;border-radius:6px;padding:1rem;background:#141311;margin-bottom:1.5rem;}.filters label{display:grid;gap:.5rem;font:10px Arial,sans-serif;color:#8d816b;}.filters input,.filters select{width:100%;min-width:0;background:#0b0b0a;border:1px solid #b49a6430;border-radius:3px;color:#d3c5aa;padding:.75rem;font:12px Arial,sans-serif;}.more-filters{grid-column:1/-1;font:11px Arial,sans-serif;color:#9b8b6b;}.more-filters summary{cursor:pointer;padding:.2rem 0;}.more-filters > div{display:flex;align-items:end;gap:1rem;flex-wrap:wrap;margin-top:1rem;}.more-filters a{padding:.8rem;text-decoration:underline;}.clear{display:block;margin-top:1rem;color:#a58d5d;font:12px Arial,sans-serif;}.alert a{text-decoration:underline;}
  .creator-invite{display:flex;align-items:center;justify-content:space-between;gap:2rem;margin-top:4rem;padding:2rem;border:1px solid #b3986230;border-radius:7px;background:linear-gradient(115deg,#b398620a,transparent);}.creator-invite h2{font:1.15rem/1.5 var(--font-display);color:#dac8a2;margin:.8rem 0;}.creator-invite p:last-child{font:12px/1.7 Arial,sans-serif;color:#8e826c;}.creator-invite a{flex:none;}
  @media(max-width:1000px){.hero-note{display:none;}.filters{grid-template-columns:repeat(2,minmax(0,1fr));}.filters .search{grid-column:1/-1;}.filters > button{grid-column:1/-1;}}
  @media(max-width:650px){.class-filter{gap:.35rem;}.class-filter a{padding:.6rem .7rem;font-size:10px;}.creator-invite{align-items:start;flex-direction:column;padding:1.5rem;}.library-heading h2{font-size:1.25rem;}}
</style>
