<script lang="ts">
    import {Button} from 'flowbite-svelte';

    let {data} = $props();

    let dataCards = $derived([
        {
            href: '/data/uniques',
            label: 'Unique items',
            count: data.counts.uniques,
        },
        {
            href: '/data/sets',
            label: 'Item sets',
            count: data.counts.sets,
        },
        {
            href: '/data/runewords',
            label: 'Runewords',
            count: data.counts.runewords,
        },
        {
            href: '/data/cube-recipes',
            label: 'Cube recipes',
            count: data.counts.recipes,
        }
    ]);
</script>

<svelte:head>
    <title>D2R Reimagined — Expanded Diablo II: Resurrected</title>
    <meta name="description"
          content="D2R Reimagined expands Diablo II: Resurrected with new items, skills, recipes, balance changes, and searchable game data."/>
    <meta property="og:title" content="D2R Reimagined"/>
    <meta property="og:description"
          content="An expanded Diablo II: Resurrected experience with searchable items, runewords, recipes, and a Holy Grail tracker."/>
    <meta name="twitter:title" content="D2R Reimagined"/>
    <meta name="twitter:description"
          content="An expanded Diablo II: Resurrected experience with searchable game data and a Holy Grail tracker."/>
</svelte:head>

<section class="relative isolate min-h-[72vh] overflow-hidden border-b border-parchment-300/15">
    <img src="/images/reimagined-hero.jpg" alt="D2R Reimagined artwork"
         class="absolute inset-0 h-full w-full object-cover object-center" fetchpriority="high"/>
    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/25"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/20"></div>
    <div class="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-5 py-20">
        <div class="max-w-2xl">
            <p class="display-text mb-4 text-sm uppercase tracking-[0.28em] text-ember-400">A familiar darkness,
                reforged</p>
            <h1 class="display-text text-5xl leading-tight text-parchment-50 sm:text-7xl">Diablo II,<br/><span
                    class="text-unique">Reimagined.</span></h1>
            <p class="mt-6 max-w-xl text-lg leading-8 text-parchment-200 sm:text-xl">An expanded D2R experience shaped
                by years of community ideas: deeper itemization, reworked skills, denser encounters, and much more to
                discover.</p>
            <div class="mt-8 flex flex-wrap gap-3">
                <Button href="https://www.nexusmods.com/diablo2resurrected/mods/503" target="_blank" rel="noreferrer"
                        color="red">Get the mod
                </Button>
                <Button href="/grail" color="alternative">Open Holy Grail</Button>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-5 py-20">
    <div class="mx-auto mb-10 max-w-3xl text-center">
        <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">
            Endless Content
        </p>
        <h2 class="display-text mt-3 text-3xl sm:text-5xl">
            Know what waits in Sanctuary
        </h2>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {#each dataCards as card}
            <a href={card.href}
               class="panel group rounded-lg p-6 transition duration-200 hover:-translate-y-1 hover:border-ember-400/50">
                <p class="rarity-line text-3xl">{card.count.toLocaleString()}</p>
                <h3 class="display-text mt-2 text-xl group-hover:text-ember-400">{card.label}</h3>
                <span class="mt-5 inline-block text-sm text-ember-400">Explore data →</span>
            </a>
        {/each}
    </div>
</section>

<section class="border-y border-parchment-300/15 bg-black/30 py-20">
    <div class="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:items-center">
        <div class="overflow-hidden rounded-lg border border-parchment-300/20 shadow-2xl"><img
                src="/images/tectonic-slam.png" alt="Tectonic Slam gameplay in D2R Reimagined"
                class="aspect-video h-full w-full object-cover" loading="lazy"/></div>
        <div>
            <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">Built to be played</p>
            <h2 class="display-text mt-3 text-3xl sm:text-5xl">More ways to break Hell</h2>
            <p class="mt-5 text-lg leading-8 text-parchment-200">Rebalanced class trees, original skills, custom
                effects, expanded storage, new crafting paths, and end-game item hunts turn another playthrough into a
                new campaign.</p>
            <a href="https://wiki.d2r-reimagined.com/en/new_player_guide#gameplay-changes" target="_blank"
               rel="noreferrer" class="mt-6 inline-block text-ember-400 hover:text-ember-300">Read the new player guide
                ↗</a>
        </div>
    </div>
</section>

<section class="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
    <div>
        <p class="display-text text-sm uppercase tracking-[0.25em] text-ember-400">Open by design</p>
        <h2 class="display-text mt-3 text-3xl sm:text-5xl">Made with the community</h2>
        <p class="mt-5 text-lg leading-8 text-parchment-200">What began as a merge of beloved mods has grown into a
            community-maintained overhaul. The source is open, feedback is welcome, and contributors keep Sanctuary
            evolving.</p>
        <div class="mt-6 flex flex-wrap gap-5">
            <a href="https://github.com/D2R-Reimagined" target="_blank" rel="noreferrer"
               class="text-ember-400 hover:text-ember-300">Browse the source ↗</a>
            <a href="https://discord.gg/9zZkYrSA8C" target="_blank" rel="noreferrer"
               class="text-ember-400 hover:text-ember-300">Join Discord ↗</a>
        </div>
    </div>
    <div class="overflow-hidden rounded-lg border border-parchment-300/20 shadow-2xl"><img
            src="/images/reimagined-skills.png" alt="A reimagined lightning skill in combat"
            class="aspect-video h-full w-full object-cover" loading="lazy"/></div>
</section>
