<script lang="ts">
  import { navigating } from '$app/state';

  const routeNames: Record<string, string> = {
    '/grail': 'Holy Grail',
    '/data': 'Game Data',
    '/data/skills': 'Skill Planner',
    '/data/uniques': 'Unique Items',
    '/data/sets': 'Set Items',
    '/data/runewords': 'Runewords',
    '/data/bases': 'Item Bases',
    '/data/affixes': 'Magic Affixes',
    '/data/cube-recipes': 'Cube Recipes'
  };

  let targetPath = $derived(navigating.to?.url.pathname ?? '');
  let visible = $derived(Boolean(navigating.to && (targetPath === '/grail' || targetPath === '/data' || targetPath.startsWith('/data/'))));
  let routeName = $derived(routeNames[targetPath] ?? 'Sanctuary');
</script>

{#if visible}
  <div class="fixed inset-x-0 bottom-0 top-16 z-[45] overflow-hidden bg-abyss-950" role="status" aria-live="polite" aria-label={`Loading ${routeName}`}>
    <div class="loading-bar absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-ember-400 to-transparent"></div>
    <div class="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-5 py-12 text-center">
      <div class="relative grid size-20 place-items-center" aria-hidden="true">
        <span class="absolute inset-0 rounded-full border border-ember-400/25"></span>
        <span class="loading-ring absolute inset-1 rounded-full border-2 border-transparent border-r-ember-400 border-t-ember-400"></span>
        <span class="display-text text-2xl text-ember-400">R</span>
      </div>
      <p class="display-text mt-6 text-sm uppercase tracking-[0.3em] text-ember-400">Opening the archive</p>
      <h1 class="display-text mt-3 text-3xl text-parchment-50 sm:text-5xl">Loading {routeName}</h1>
      <p class="mt-3 text-parchment-300">Gathering the latest Reimagined data…</p>

      <div class="mt-10 grid w-full gap-3 sm:grid-cols-3" aria-hidden="true">
        {#each [0, 1, 2] as index}
          <div class="panel rounded-lg p-5" style={`animation-delay: ${index * 110}ms`}>
            <div class="skeleton mx-auto h-5 w-2/3 rounded"></div>
            <div class="skeleton mx-auto mt-4 h-3 w-5/6 rounded"></div>
            <div class="skeleton mx-auto mt-2 h-3 w-3/5 rounded"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .loading-ring { animation: loading-spin 0.9s linear infinite; }
  .loading-bar { animation: loading-sweep 1.2s ease-in-out infinite; transform-origin: center; }
  .skeleton {
    background: linear-gradient(90deg, rgb(188 167 125 / 0.08), rgb(228 90 53 / 0.2), rgb(188 167 125 / 0.08));
    background-size: 220% 100%;
    animation: loading-shimmer 1.35s ease-in-out infinite;
  }

  @keyframes loading-spin { to { transform: rotate(360deg); } }
  @keyframes loading-sweep { 0%, 100% { transform: scaleX(0.15); opacity: 0.3; } 50% { transform: scaleX(1); opacity: 1; } }
  @keyframes loading-shimmer { from { background-position: 100% 0; } to { background-position: -120% 0; } }

  @media (prefers-reduced-motion: reduce) {
    .loading-ring, .loading-bar, .skeleton { animation: none; }
  }
</style>
