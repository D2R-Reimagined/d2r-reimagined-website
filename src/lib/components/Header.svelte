<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { DiscordSolid } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';

  import { authState, initializeAuth } from '$lib/auth';
  import { i18n, languages, restoreSavedLanguage, setLanguage, type LanguageCode } from '$lib/i18n';
  import {
    lastTradeRealmStorageKey,
    tradeLadderPath,
    validStoredTradePath,
    type TradeLadder
  } from '$lib/trade-ladders';

  let { tradeEnabled, ladders }: { tradeEnabled: boolean; ladders: TradeLadder[] } = $props();

  let mobileOpen = $state(false);
  let languageOpen = $state(false);
  let fontOpen = $state(false);
  let dataOpen = $state(false);
  let tradeHref = $state('/trade');
  let tradeRealmRestored = $state(false);

  let currentTradePath = $derived.by(() => {
    const path = page.url.pathname;
    if (path === '/trade' || path === '/trade/standard') return path;
    if (path === '/trade/list' || path === '/trade/mine') return null;
    return ladders
      .map(tradeLadderPath)
      .find((ladderPath) => ladderPath.toLowerCase() === path.toLowerCase()) ?? null;
  });

  const dataLinks = [
    { href: '/data/skills', label: 'Skills', detail: 'Class trees and build planner' },
    { href: '/data/uniques', label: 'Uniques', detail: 'Distinctive named items' },
    { href: '/data/sets', label: 'Sets', detail: 'Pieces and set bonuses' },
    { href: '/data/runewords', label: 'Runewords', detail: 'Rune orders and properties' },
    { href: '/data/bases', label: 'Bases', detail: 'Weapons and armor' },
    { href: '/data/affixes', label: 'Affixes', detail: 'Prefixes and suffixes' },
    { href: '/data/cube-recipes', label: 'Cube Recipes', detail: 'Inputs and outputs' },
    { href: '/data/orbs', label: 'Orbs', detail: 'Cube orbs and corruption outcomes' }
  ];

  const fonts = [
    { value: 'font-classic', label: 'Classic' },
    { value: 'font-resurrected', label: 'Resurrected' },
    { value: 'font-neutral', label: 'Neutral' }
  ];

  function isActive(href: string): boolean {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
  }

  function navClass(href: string): string {
    return `rounded px-3 py-2 hover:bg-white/5 hover:text-white ${isActive(href) ? 'text-ember-400' : 'text-parchment-200'}`;
  }

  function closeMenus(): void {
    mobileOpen = false;
    dataOpen = false;
    languageOpen = false;
    fontOpen = false;
  }

  function closeDropdowns(): void {
    dataOpen = false;
    languageOpen = false;
    fontOpen = false;
  }

  function handleWindowClick(event: MouseEvent): void {
    if (!dataOpen && !languageOpen && !fontOpen) return;
    const target = event.target as Element | null;
    if (target?.closest('[data-nav-dropdown]')) return;
    closeDropdowns();
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') closeDropdowns();
  }

  function toggleDataMenu(): void {
    dataOpen = !dataOpen;
    languageOpen = false;
    fontOpen = false;
  }

  function toggleLanguageMenu(): void {
    languageOpen = !languageOpen;
    dataOpen = false;
    fontOpen = false;
  }

  function toggleFontMenu(): void {
    fontOpen = !fontOpen;
    dataOpen = false;
    languageOpen = false;
  }

  async function chooseLanguage(code: LanguageCode): Promise<void> {
    await setLanguage(code);
    closeMenus();
  }

  function chooseFont(font: string): void {
    document.body.classList.remove(...fonts.map((entry) => entry.value));
    document.body.classList.add(font);
    try { localStorage.setItem('font', font); } catch { /* storage is optional */ }
    closeMenus();
  }

  onMount(() => {
    const savedFont = localStorage.getItem('font') ?? 'font-resurrected';
    chooseFont(fonts.some((font) => font.value === savedFont) ? savedFont : 'font-resurrected');
    try {
      const savedTradePath = localStorage.getItem(lastTradeRealmStorageKey);
      tradeHref = savedTradePath ? validStoredTradePath(savedTradePath, ladders) ?? '/trade' : '/trade';
      if (page.url.pathname === '/trade' && tradeHref !== '/trade') {
        void goto(tradeHref, { replaceState: true }).finally(() => tradeRealmRestored = true);
      } else {
        tradeRealmRestored = true;
      }
    } catch { tradeRealmRestored = true; }
    void restoreSavedLanguage();
    void initializeAuth();
  });

  $effect(() => {
    if (!browser || !tradeRealmRestored || !currentTradePath) return;
    tradeHref = currentTradePath;
    try { localStorage.setItem(lastTradeRealmStorageKey, currentTradePath); } catch { /* storage is optional */ }
  });
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<header class="sticky top-0 z-50 border-b border-parchment-300/20 bg-abyss-950">
  <nav class="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-4 px-4" aria-label="Primary navigation">
    <a href="/" class="display-text truncate text-lg text-parchment-50 transition hover:text-ember-400">D2R Reimagined</a>

    <div class="ml-auto flex items-center gap-2 lg:order-3 lg:ml-2">
      <a
        href="https://discord.gg/ZvQD4MARxz"
        target="_blank"
        rel="noreferrer"
        aria-label="Join the D2R Reimagined Discord"
        title="Join our Discord"
        class="flex h-10 w-10 items-center justify-center rounded text-parchment-200 transition hover:bg-white/5 hover:text-white"
      >
        <DiscordSolid class="h-5 w-5" aria-hidden="true" />
      </a>

      {#if $authState.user}
        <a href="/profile" onclick={closeMenus} aria-label={`Open ${$authState.user.displayName}'s profile`} class="display-text flex h-10 w-10 items-center justify-center rounded-full border border-ember-400/55 bg-ember-700/25 text-parchment-50 transition hover:border-ember-400 hover:bg-ember-700/40">
          {$authState.user.displayName.slice(0, 1).toUpperCase()}
        </a>
      {:else}
        <a href="/profile" onclick={closeMenus} class="whitespace-nowrap rounded border border-ember-400/50 px-3 py-2 text-sm text-parchment-50 transition hover:border-ember-400 hover:bg-ember-700/25">
          Sign in
        </a>
      {/if}

      <button type="button" class="rounded-md border border-parchment-300/25 px-3 py-2 lg:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen} onclick={() => mobileOpen = !mobileOpen}>
        <span aria-hidden="true" class="text-xl">☰</span>
      </button>
    </div>

    <div class:hidden={!mobileOpen} class="absolute left-0 right-0 top-16 border-b border-parchment-300/20 bg-abyss-950 p-4 lg:static lg:order-2 lg:ml-auto lg:flex lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0">
      <div class="flex flex-col gap-1 lg:flex-row lg:items-center">
        <a href="/" onclick={closeMenus} class={navClass('/')}>Home</a>
        <a href="/download" onclick={closeMenus} class={navClass('/download')}>Download</a>
        <a href="/characters" onclick={closeMenus} class={navClass('/characters')}>Characters</a>
        {#if tradeEnabled}
          <a href={tradeHref} onclick={closeMenus} class={`${navClass('/trade')} border border-ember-400/35 bg-ember-950/20`}>Trade</a>
        {/if}
        <a href="/grail" onclick={closeMenus} class={navClass('/grail')}>Holy Grail</a>
        {#if $authState.user?.roles.includes('Admin')}
          <a href="/admin/ladders" onclick={closeMenus} class={navClass('/admin')}>Admin</a>
        {/if}

        <div class="relative" data-nav-dropdown>
          <button type="button" onclick={toggleDataMenu} class={`flex w-full items-center justify-between gap-2 ${navClass('/data')}`} aria-expanded={dataOpen}>
            Data <span aria-hidden="true" class="text-xs">▾</span>
          </button>
          {#if dataOpen}
            <div class="mt-1 grid min-w-72 gap-1 rounded-lg border border-parchment-300/20 bg-abyss-900 p-2 shadow-2xl lg:absolute lg:left-0 lg:top-full">
              {#each dataLinks as link}
                <a href={link.href} onclick={closeMenus} class="rounded px-3 py-2 hover:bg-white/5">
                  <span class="block text-parchment-50">{link.label}</span>
                  <span class="block text-xs text-parchment-300">{link.detail}</span>
                </a>
              {/each}
            </div>
          {/if}
        </div>

        <a href="https://wiki.d2r-reimagined.com/" target="_blank" rel="noreferrer" class="rounded px-3 py-2 text-parchment-200 hover:bg-white/5 hover:text-white">Wiki ↗</a>

        <div class="my-2 h-px bg-parchment-300/15 lg:mx-2 lg:my-0 lg:h-7 lg:w-px"></div>

        <div class="relative" data-nav-dropdown>
          <button type="button" aria-label="Choose language" aria-expanded={languageOpen} onclick={toggleLanguageMenu} class="flex w-full items-center gap-2 rounded px-3 py-2 text-parchment-200 hover:bg-white/5 hover:text-white">◎ <span class="lg:hidden">Language</span></button>
          {#if languageOpen}
            <div class="mt-1 max-h-80 min-w-56 overflow-y-auto rounded-lg border border-parchment-300/20 bg-abyss-900 p-2 shadow-2xl lg:absolute lg:right-0 lg:top-full">
              {#each languages as language}
                <button type="button" onclick={() => chooseLanguage(language.code)} class="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-white/5">
                  {language.name}{#if language.code === $i18n.code}<span class="text-set">✓</span>{/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <div class="relative" data-nav-dropdown>
          <button type="button" aria-label="Choose font" aria-expanded={fontOpen} onclick={toggleFontMenu} class="flex w-full items-center gap-2 rounded px-3 py-2 text-parchment-200 hover:bg-white/5 hover:text-white">Aa <span class="lg:hidden">Font</span></button>
          {#if fontOpen}
            <div class="mt-1 min-w-44 rounded-lg border border-parchment-300/20 bg-abyss-900 p-2 shadow-2xl lg:absolute lg:right-0 lg:top-full">
              {#each fonts as font}
                <button type="button" onclick={() => chooseFont(font.value)} class="w-full rounded px-3 py-2 text-left hover:bg-white/5">{font.label}</button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>
</header>
