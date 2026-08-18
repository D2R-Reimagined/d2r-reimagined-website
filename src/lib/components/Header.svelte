<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import { i18n, languages, restoreSavedLanguage, setLanguage, type LanguageCode } from '$lib/i18n';

  let mobileOpen = $state(false);
  let languageOpen = $state(false);
  let fontOpen = $state(false);
  let dataOpen = $state(false);

  const dataLinks = [
    { href: '/data/skills', label: 'Skills', detail: 'Class trees and build planner' },
    { href: '/data/uniques', label: 'Uniques', detail: 'Distinctive named items' },
    { href: '/data/sets', label: 'Sets', detail: 'Pieces and set bonuses' },
    { href: '/data/runewords', label: 'Runewords', detail: 'Rune orders and properties' },
    { href: '/data/bases', label: 'Bases', detail: 'Weapons and armor' },
    { href: '/data/affixes', label: 'Affixes', detail: 'Prefixes and suffixes' },
    { href: '/data/cube-recipes', label: 'Cube Recipes', detail: 'Inputs and outputs' }
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
    void restoreSavedLanguage();
  });
</script>

<header class="sticky top-0 z-50 border-b border-parchment-300/20 bg-abyss-950">
  <nav class="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-4 px-4" aria-label="Primary navigation">
    <a href="/" class="display-text truncate text-lg text-parchment-50 transition hover:text-ember-400">D2R Reimagined</a>

    <button type="button" class="rounded-md border border-parchment-300/25 px-3 py-2 lg:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen} onclick={() => mobileOpen = !mobileOpen}>
      <span aria-hidden="true" class="text-xl">☰</span>
    </button>

    <div class:hidden={!mobileOpen} class="absolute left-0 right-0 top-16 border-b border-parchment-300/20 bg-abyss-950 p-4 lg:static lg:flex lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0">
      <div class="flex flex-col gap-1 lg:flex-row lg:items-center">
        <a href="/" onclick={closeMenus} class={navClass('/')}>Home</a>
        <a href="/grail" onclick={closeMenus} class={navClass('/grail')}>Holy Grail</a>

        <div class="relative">
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

        <div class="relative">
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

        <div class="relative">
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
