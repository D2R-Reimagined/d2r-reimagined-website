<script lang="ts">
  import { Button } from 'flowbite-svelte';
    import {page} from '$app/state';
    import {buildClasses, buildCategories, buildBudgets} from '$lib/builds';
    import BuildCard from '$lib/components/builds/BuildCard.svelte';

    let {data} = $props();

    function filtered(key: string, value: string) {
        const params = new URLSearchParams(page.url.searchParams);
        params.delete('skip');
        if (value) params.set(key, value); else params.delete(key);
        return `/builds?${params}`;
    }

    function pageLink(skip: number) {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('skip', String(skip));
        return `/builds?${params}`;
    }
</script>
<svelte:head><title>Community Builds | D2R Reimagined</title>
    <meta name="description"
          content="Find your next D2R Reimagined build. Community-written guides with item tooltips, equipment, skill trees, and player reviews."/>
    <meta property="og:title" content="Community Builds · D2R Reimagined"/>
</svelte:head>
<div class="builds-page">
    <section class="library-hero">
        <div class="hero-copy">
            <p class="eyebrow">COMMUNITY</p><h1 class="build-title">Build Guides</h1><p class="build-intro">Discover player-created setups, plan your skills, and share your next build.</p>
            <div class="hero-actions"><Button href="/builds/new" color="red" size="sm">＋ Create a build</Button><Button href="/builds/mine"
                                                                                                   color="alternative" size="sm">My
                builds</Button></div>
        </div>
    </section>
    <nav class="class-filter" aria-label="Filter builds by class"><a href={filtered('characterClass','')}
                                                                     class:active={!data.filters.characterClass}>All
        classes</a>
        {#each buildClasses as name}<a href={filtered('characterClass',name)}
                                       class:active={data.filters.characterClass === name}
                                       aria-current={data.filters.characterClass === name ? 'page' : undefined}>{name}</a>{/each}
    </nav>
    <div class="library-heading">
        <div><h2>{data.filters.characterClass || 'Community'} builds</h2></div>
        <span>{data.serviceError ? 'Library unavailable' : `${data.results.total} ${data.results.total === 1 ? 'guide' : 'guides'}`}</span>
    </div>
    <form class="filters panel" method="GET" action="/builds"><input type="hidden" name="characterClass"
                                                               value={data.filters.characterClass}/>
        <label class="search">Search<input class="field" name="search" value={data.filters.search}
                                           placeholder="Build, skill, creator, or tag…" maxlength="100"/></label>
        <label>Build focus<select class="field" name="category" value={data.filters.category}>
            <option value="">Any focus</option>
            {#each buildCategories as name}
                <option>{name}</option>
            {/each}
        </select></label>
        <label>Gear budget<select class="field" name="budget" value={data.filters.budget}>
            <option value="">Any budget</option>
            {#each buildBudgets as name}
                <option>{name}</option>
            {/each}
        </select></label>
        <label>Sort by<select class="field" name="sort" value={data.filters.sort}>
            <option value="updated">Recently updated</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest guides</option>
        </select></label>
        <Button type="submit" color="alternative" size="sm">Find builds</Button>
        <details class="more-filters">
            <summary>More filters</summary>
            <div><label>Game version / patch<input class="field" name="patch" value={data.filters.patch} maxlength="40"
                                                   placeholder="Any patch"/></label><label>Exact tag<input class="field" name="tag"
                                                                                                           value={data.filters.tag}
                                                                                                           maxlength="24"
                                                                                                           placeholder="e.g. Hardcore"/></label><a
                    href="/builds">Clear all filters</a></div>
        </details>
    </form>
    {#if data.serviceError}
        <div class="alert" role="alert">{data.serviceError} <a href={page.url.pathname + page.url.search}>Retry</a>
        </div>
    {:else if !data.results.items.length}
        <div class="empty panel"><p class="eyebrow">A NEW CHAPTER STARTS HERE</p>
            <h2>{Object.entries(data.filters).some(([key, value]) => key !== 'sort' && value) ? 'No builds match these filters.' : 'Be the first to share a build.'}</h2>
            <p>Bring your favorite setup to the community with equipment, interactive skill trees, and a guide written
                your way.</p><Button href="/builds/new" color="red" size="sm">Open the build workshop ↗</Button><a href="/builds"
                                                                                                   class="clear">Clear
                filters</a></div>
    {:else}
        <div class="guide-grid">
            {#each data.results.items as build (build.id)}
                <BuildCard {build}/>
            {/each}
        </div>
        <nav class="pager" aria-label="Build results pages">
            {#if data.results.skip > 0}<Button color="alternative" size="sm"
                                          href={pageLink(Math.max(0,data.results.skip - data.results.count))}>←
                Previous</Button>{/if}<span>{data.results.skip + 1}
            –{Math.min(data.results.skip + data.results.count, data.results.total)} of {data.results.total}</span>
            {#if data.results.skip + data.results.count < data.results.total}<Button color="alternative" size="sm"
                                                                                href={pageLink(data.results.skip + data.results.count)}>Next
                →</Button>{/if}
        </nav>
    {/if}
    <aside class="creator-invite panel">
        <div><p class="eyebrow">GOT A SETUP WORTH SHARING?</p>
            <h2>Turn your experience into someone’s next adventure.</h2>
            <p>Flexible sections. Equipment snapshots. Skill trees. Your guide, your way.</p></div>
        <Button color="alternative" size="sm" href="/builds/new">Start writing ↗</Button></aside>
</div>
<style>
    .library-hero {
        position: relative;
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1rem 0 3rem;
        border-bottom: 1px solid #b9a16822;
    }

    .hero-copy {
        max-width: 830px;
    }

    .hero-actions {
        display: flex;
        gap: .6rem;
        flex-wrap: wrap;
        margin-top: 1.5rem;
    }

    .class-filter {
        display: flex;
        gap: .35rem;
        flex-wrap: wrap;
        margin: 1.5rem 0 2.5rem;
    }

    .class-filter a {
        padding: .7rem .95rem;
        color:var(--color-parchment-300);
        font-size:12px; line-height:1.5;
        border: 1px solid #ffffff13;
        border-radius: 4px;
    }

    .class-filter a.active {
        color:var(--color-parchment-50);
        border-color: var(--color-ember-400);
        background: color-mix(in srgb,var(--color-ember-700) 25%,transparent);
    }

    .class-filter a:hover {
        color:var(--color-parchment-50);
    }

    .library-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.4rem;
    }

    .library-heading h2 {
        font: 1.5rem var(--font-display);
        color:var(--color-parchment-50);
    }

    .library-heading > span {
        font-size:12px; line-height:1.5;
        color:var(--color-parchment-300);
    }

    .filters {
        display: grid;
        grid-template-columns:minmax(150px, 2fr) repeat(3, minmax(100px, 1fr)) auto;
        gap: .8rem;
        align-items: end;
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }

    .filters label {
        display: grid;
        gap: .5rem;
        font-size:12px; line-height:1.5;
        color:var(--color-parchment-300);
    }

    .filters input, .filters select {
        width: 100%;
        min-width: 0;


    }

    .more-filters {
        grid-column: 1/-1;
        font-size:12px; line-height:1.5;
        color:var(--color-parchment-300);
    }

    .more-filters summary {
        cursor: pointer;
        padding: .2rem 0;
    }

    .more-filters > div {
        display: flex;
        align-items: end;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    .more-filters a {
        padding: .8rem;
        text-decoration: underline;
    }

    .clear {
        display: block;
        margin-top: 1rem;
        color:var(--color-parchment-300);
        font-size:12px; line-height:1.5;
    }

    .alert a {
        text-decoration: underline;
    }

    .creator-invite {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        margin-top: 4rem;
        padding: 2rem;
        border-radius: 7px;
    }

    .creator-invite h2 {
        font: 1.15rem/1.5 var(--font-display);
        color:var(--color-parchment-200);
        margin: .8rem 0;
    }

    .creator-invite p:last-child {
        font-size:12px; line-height:1.7;
        color:var(--color-parchment-300);
    }

    @media (max-width: 1000px) {

        .filters {
            grid-template-columns:repeat(2, minmax(0, 1fr));
        }

        .filters .search {
            grid-column: 1/-1;
        }
    }

    @media (max-width: 650px) {
        .class-filter {
            gap: .35rem;
        }

        .class-filter a {
            padding: .6rem .7rem;
            font-size:12px;
        }

        .creator-invite {
            align-items: start;
            flex-direction: column;
            padding: 1.5rem;
        }

        .library-heading h2 {
            font-size: 1.25rem;
        }
    }
</style>
