<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, description, children }: { title: string; description: string; children: Snippet } = $props();
</script>

<svelte:head>
  <title>{title} — D2R Reimagined</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={`${title} — D2R Reimagined`} />
  <meta property="og:description" content={description} />
</svelte:head>

<article class="legal-page mx-auto max-w-4xl px-5 py-12 sm:py-16">
  <header class="mb-10 border-b border-parchment-300/15 pb-8">
    <p class="mb-3 text-sm text-parchment-300">D2R Reimagined</p>
    <h1 class="display-text text-4xl text-parchment-50 sm:text-5xl">{title}</h1>
    <p class="mt-4 text-sm text-parchment-300">Last updated: <time datetime="2026-09-20">September 20, 2026</time></p>
    <nav aria-label="Legal information" class="mt-5 flex flex-wrap gap-5">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </header>
  <div class="legal-content space-y-8 text-base leading-8 text-parchment-200">
    {@render children()}
  </div>
</article>

<style>
  .legal-page :global(a) { color: var(--color-parchment-50); text-decoration: underline; text-underline-offset: 4px; }
  .legal-page :global(a:hover) { color: var(--color-ember-400); }
  .legal-content :global(h2) { margin-bottom: 0.75rem; color: var(--color-parchment-50); font-size: 1.4rem; line-height: 1.5; }
  .legal-content :global(p + p), .legal-content :global(ul + p) { margin-top: 1rem; }
  .legal-content :global(ul) { list-style: disc; padding-left: 1.5rem; }
  .legal-content :global(li + li) { margin-top: 0.5rem; }
</style>
