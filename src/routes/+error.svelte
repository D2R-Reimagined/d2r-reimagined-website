<script lang="ts">
  import { page } from '$app/state';

  const notFound = $derived(page.status === 404);
  const heading = $derived(notFound ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
  <title>{heading} | D2R Reimagined</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="relative isolate overflow-hidden">
  <img src="/images/reimagined-hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-25" />
  <div class="absolute inset-0 bg-gradient-to-r from-abyss-950 via-abyss-950/95 to-abyss-950/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/25"></div>
  <div class="relative mx-auto max-w-7xl px-5 py-20 sm:py-28">
    <p class="display-text text-6xl text-ember-400 sm:text-8xl">{page.status}</p>
    <h1 class="display-text mt-4 text-4xl leading-tight text-parchment-50 sm:text-5xl">{heading}</h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-parchment-200">
      {#if notFound}
        The page you were looking for doesn't exist or has moved. Check the address, or head back to the homepage.
      {:else}
        {page.error?.message || 'An unexpected error occurred.'} Please try again shortly.
      {/if}
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a class="error-primary rounded px-5 py-3 font-semibold" href="/">Go to the homepage</a>
      <a class="error-secondary rounded px-5 py-3" href="/data">Browse the item database</a>
    </div>
  </div>
</section>

<style>
  .error-primary {
    background: var(--color-ember-500);
    color: white;
    transition: background-color 150ms ease;
  }

  .error-primary:hover { background: var(--color-ember-400); }

  .error-secondary {
    border: 1px solid rgb(188 167 125 / 0.4);
    color: var(--color-parchment-50);
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  .error-secondary:hover {
    border-color: var(--color-ember-400);
    background: rgb(123 29 24 / 0.2);
  }
</style>
