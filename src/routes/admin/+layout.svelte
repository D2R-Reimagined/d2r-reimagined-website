<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import { authState, initializeAuth } from '$lib/auth';

  let { children } = $props();

  const links = [
    {
      href: '/admin/ladders',
      label: 'Ladders',
      detail: 'Schedules and requirements'
    },
    {
      href: '/admin/users',
      label: 'Users',
      detail: 'Admin and Moderator roles'
    }
  ];

  let isAdmin = $derived($authState.user?.roles.includes('Admin') ?? false);

  function isActive(href: string): boolean {
    return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
  }

  onMount(async () => {
    await initializeAuth();
    if (!$authState.user) {
      await goto('/profile');
    }
  });
</script>

<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<section class="mx-auto max-w-screen-2xl px-5 py-10 sm:py-12">
  <div class="mb-7 max-w-3xl">
    <p class="display-text text-sm uppercase tracking-[0.24em] text-ember-400">Administration</p>
    <h1 class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">Admin dashboard</h1>
    <p class="mt-3 text-parchment-300">Manage Reimagined ladders and staff access.</p>
  </div>

  {#if !$authState.ready}
    <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading the admin dashboard…</div>
  {:else if !isAdmin}
    <div class="panel max-w-2xl rounded-lg p-8">
      <h2 class="display-text text-2xl text-requirement">Access denied</h2>
      <p class="mt-3 text-parchment-300">This area requires the Admin role.</p>
    </div>
  {:else}
    <div class="grid items-start gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside class="panel rounded-lg p-3 md:sticky md:top-24" aria-label="Admin navigation">
        <p class="display-text px-3 pb-2 pt-1 text-xs uppercase tracking-[0.18em] text-parchment-300">Manage</p>
        <nav class="grid gap-1">
          {#each links as link}
            <a
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              class={`rounded-lg border px-3 py-3 transition ${isActive(link.href) ? 'border-ember-400/65 bg-ember-700/25' : 'border-transparent hover:border-parchment-300/20 hover:bg-white/5'}`}
            >
              <span class={`display-text block ${isActive(link.href) ? 'text-ember-400' : 'text-parchment-50'}`}>{link.label}</span>
              <span class="mt-1 block text-xs leading-4 text-parchment-300">{link.detail}</span>
            </a>
          {/each}
        </nav>
      </aside>

      <div class="min-w-0">{@render children()}</div>
    </div>
  {/if}
</section>
