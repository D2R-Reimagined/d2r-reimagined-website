<script lang="ts">
    import {Button} from 'flowbite-svelte';
    import {YoutubeSolid} from 'flowbite-svelte-icons';
    import {onMount} from 'svelte';

    let {data} = $props();

    // Ladder reveal stream, then the reveal itself (ladder start countdown).
    const streamStart = '2026-10-17T14:00:00-04:00';
    const revealAt = '2026-10-17T15:00:00-04:00';
    const ladderStart = '2026-10-30T14:00:00-04:00';
    const streamLinks = [
        {href: 'https://www.twitch.tv/scottieknowzmods', label: 'Twitch'},
        {href: 'https://www.youtube.com/@ScottieKnowz', label: 'YouTube'}
    ];

    let now = $state<number | null>(null);
    let currentMs = $derived(now ?? data.serverNow);
    let phase = $derived(
        currentMs < Date.parse(streamStart) ? 'stream-soon'
            : currentMs < Date.parse(revealAt) ? 'stream-live'
                : currentMs < Date.parse(ladderStart) ? 'ladder-soon'
                    : 'ladder-live'
    );
    let target = $derived(phase === 'stream-soon' ? streamStart : ladderStart);
    let secondsRemaining = $derived(Math.max(0, Math.ceil((Date.parse(target) - currentMs) / 1000)));
    let days = $derived(Math.floor(secondsRemaining / 86400));
    let countdown = $derived([
        ...(days > 0 ? [{label: 'Days', value: days}] : []),
        {label: 'Hours', value: Math.floor(secondsRemaining / 3600) - days * 24},
        {label: 'Minutes', value: Math.floor(secondsRemaining / 60) % 60},
        {label: 'Seconds', value: secondsRemaining % 60}
    ]);

    onMount(() => {
        now = Date.now();
        const timer = window.setInterval(() => {
            now = Date.now();
        }, 1000);
        return () => window.clearInterval(timer);
    });

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
    <title>D2R Reimagined</title>
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
    <img src="/images/reimagined-hero.webp" alt="D2R Reimagined artwork"
         class="absolute inset-0 h-full w-full object-cover object-center" fetchpriority="high"/>
    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/25"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/20"></div>
    <div class="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-5 py-20">
        <div class="max-w-2xl">
            <p class="display-text mb-4 text-sm uppercase tracking-[0.28em] text-ember-400">A familiar darkness,
                Reimagined</p>
            <h1 class="display-text text-5xl leading-tight text-parchment-50 sm:text-7xl">Diablo II,<br/><span
                    class="text-unique">Reimagined.</span></h1>
            <p class="mt-6 max-w-xl text-lg leading-8 text-parchment-200 sm:text-xl">An expanded D2R experience shaped
                by years of community ideas: deeper itemization, reworked skills, denser encounters, and much more to
                discover.
            </p>
            <div class="mt-8 max-w-md rounded-lg border border-ember-400/40 bg-black/60 p-5 backdrop-blur-sm">
                {#if phase === 'stream-live'}
                    <h2 role="status" class="display-text flex items-center gap-3 text-xl text-ember-400">
                        <span class="relative flex h-3 w-3" aria-hidden="true">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-75"></span>
                            <span class="relative inline-flex h-3 w-3 rounded-full bg-ember-500"></span>
                        </span>
                        Ladder reveal is live
                    </h2>
                    <p class="mt-2 text-sm text-parchment-200">Join the stream to see what the new ladder brings.</p>
                {:else if phase === 'ladder-live'}
                    <h2 role="status" class="display-text text-xl text-ember-400">The ladder is live</h2>
                    <a href="/leaderboard" class="mt-3 inline-block text-parchment-50 underline decoration-ember-400/60 underline-offset-4 hover:text-ember-400">View the leaderboard →</a>
                {:else}
                    <h2 class="display-text text-sm tracking-widest text-ember-400">
                        {phase === 'stream-soon' ? 'Ladder reveal stream starts in' : 'Next ladder starts in'}
                    </h2>
                    <div role="timer"
                         aria-label={phase === 'stream-soon' ? 'Time until the ladder reveal stream' : 'Time until ladder launch'}
                         aria-live="off"
                         class="mt-4 grid gap-3 text-center {countdown.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}">
                        {#each countdown as unit (unit.label)}
                            <div>
                                <span class="block font-sans text-4xl font-semibold tabular-nums text-parchment-50 sm:text-5xl">{String(unit.value).padStart(2, '0')}</span>
                                <span class="mt-1 block text-xs uppercase tracking-wider text-parchment-300">{unit.label}</span>
                            </div>
                        {/each}
                    </div>
                    <p class="mt-4 text-sm text-parchment-200">
                        {#if phase === 'stream-soon'}
                            <time datetime={streamStart}>Today, October 17 · 2:00 PM Eastern (EDT)</time>
                        {:else}
                            <time datetime={ladderStart}>October 30 · 2:00 PM Eastern (EDT)</time>
                        {/if}
                    </p>
                {/if}
                {#if phase === 'stream-soon' || phase === 'stream-live'}
                    <div class="mt-4 flex flex-wrap gap-2">
                        {#each streamLinks as link (link.label)}
                            <a href={link.href} target="_blank" rel="noreferrer"
                               class="inline-flex items-center gap-2 rounded-md border border-parchment-300/25 bg-black/40 px-3 py-2 text-sm text-parchment-50 transition hover:border-ember-400/60 hover:text-ember-400">
                                {#if link.label === 'Twitch'}
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                                    </svg>
                                {:else}
                                    <YoutubeSolid class="h-4 w-4" aria-hidden="true"/>
                                {/if}
                                Watch on {link.label} ↗
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
                <Button href="/download" color="red">
                    Download
                </Button>
                <Button href="/grail" color="alternative">
                    Open Holy Grail
                </Button>
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
               class="panel group rounded-lg p-6 hover:border-ember-400/50">
                <p class="rarity-line text-3xl">{card.count.toLocaleString()}</p>
                <h3 class="display-text mt-2 text-xl group-hover:text-ember-400">{card.label}</h3>
                <span class="mt-5 inline-block text-sm text-ember-400">Explore data →</span>
            </a>
        {/each}
    </div>
</section>

<section aria-labelledby="play-your-way-heading"
         class="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-2 lg:items-center">
    <div>
        <h2 id="play-your-way-heading" class="display-text mt-3 text-3xl sm:text-5xl">Face Hell solo or together</h2>
        <p class="mt-5 text-lg leading-8 text-parchment-200">Take on Sanctuary at your own pace in single player,
            or team up with friends in multiplayer through D2RLoader. Support added directly to the Reimaigned Launcher</p>
        <a href="https://d2rloader.net" target="_blank" rel="noreferrer"
           class="mt-6 inline-block text-ember-400 hover:text-ember-300">Explore D2RLoader ↗</a>
    </div>
    <div class="overflow-hidden rounded-lg border border-parchment-300/20 shadow-2xl"><img
            src="/images/multiplayer.webp" alt="D2RLoader multiplayer browser showing available games and player counts"
            width="1365" height="1111" class="h-auto w-full" loading="lazy"/></div>
</section>

<section class="border-y border-parchment-300/15 bg-black/30 py-20">
    <div class="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:items-center">
        <div class="overflow-hidden rounded-lg border border-parchment-300/20 shadow-2xl"><img
                src="/images/tectonic-slam.webp" alt="Tectonic Slam gameplay in D2R Reimagined"
                class="aspect-video h-full w-full object-cover" loading="lazy"/></div>
        <div>
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
            src="/images/reimagined-skills.webp" alt="A reimagined lightning skill in combat"
            class="aspect-video h-full w-full object-cover" loading="lazy"/></div>
</section>
