<script lang="ts">
  import { page } from '$app/state';

  import { dropCalculatorDefinition, catalogDefinitions, skillPlannerDefinition } from '$lib/types';

  const links = [
    { href: '/data', label: 'All Data' },
    ...[dropCalculatorDefinition, skillPlannerDefinition, ...Object.values(catalogDefinitions)].map((definition) => ({
      href: `/data/${definition.slug}`,
      label: definition.title
    }))
  ];
</script>

<nav class="border-b border-parchment-300/15 bg-abyss-900/95" aria-label="Data navigation">
  <div class="mx-auto flex max-w-screen-2xl items-center gap-2 overflow-x-auto px-4 py-2">
    <span class="display-text shrink-0 px-2 text-xs uppercase tracking-[0.18em] text-parchment-300">Data</span>
    <div class="flex min-w-max items-center gap-1">
      {#each links as link}
        <a
          href={link.href}
          aria-current={page.url.pathname === link.href ? 'page' : undefined}
          class:active={page.url.pathname === link.href}
          class="quick-nav-link rounded px-3 py-2 text-sm text-parchment-200 hover:bg-white/5 hover:text-parchment-50"
        >
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  .quick-nav-link.active {
    color: #f7f1e3;
    background: rgb(123 29 24 / 0.5);
    box-shadow: inset 0 -2px #e45a35;
  }
</style>
