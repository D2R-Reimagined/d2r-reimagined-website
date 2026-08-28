<script lang="ts">
  import { onMount } from 'svelte';
  import { DownloadSolid, TerminalSolid, WindowsSolid } from 'flowbite-svelte-icons';
  import {
    detectLauncherPlatform,
    formatDownloadSize,
    type LauncherDownload,
    type LauncherPlatform
  } from '$lib/launcher-downloads';

  let { data } = $props();
  let detectedPlatform = $state<LauncherPlatform>('unknown');
  let selectedPlatform = $state<Exclude<LauncherPlatform, 'unknown'>>('windows');

  onMount(() => {
    detectedPlatform = detectLauncherPlatform(navigator.userAgent, navigator.platform);
    if (detectedPlatform !== 'unknown') selectedPlatform = detectedPlatform;
  });

  function details(file: LauncherDownload | null): string {
    if (!file) return '';
    return [data.release?.version, formatDownloadSize(file.size)].filter(Boolean).join(' · ');
  }
</script>

<svelte:head>
  <title>Download the Launcher — D2R Reimagined</title>
  <meta name="description" content="Download the latest D2R Reimagined Launcher for Windows or Linux, with automatic updates or a static Windows install." />
  <meta property="og:title" content="Download the D2R Reimagined Launcher" />
  <meta property="og:description" content="Choose the right launcher download for Windows or Linux." />
  <meta name="twitter:title" content="Download the D2R Reimagined Launcher" />
  <meta name="twitter:description" content="Choose the right launcher download for Windows or Linux." />
</svelte:head>

<section class="relative isolate overflow-hidden border-b border-parchment-300/15">
  <img src="/images/reimagined-hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
  <div class="absolute inset-0 bg-gradient-to-r from-abyss-950 via-abyss-950/95 to-abyss-950/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/25"></div>
  <div class="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
    <h1 class="display-text mt-3 max-w-3xl text-4xl leading-tight text-parchment-50 sm:text-6xl">Download the launcher</h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-parchment-200">
      Install, update, configure, and launch D2R Reimagined from one place.
    </p>
    {#if data.release}
      <p class="mt-4 text-sm text-parchment-300">Latest release: <span class="text-parchment-50">{data.release.version}</span></p>
    {/if}
  </div>
</section>

<section class="mx-auto max-w-5xl px-5 py-12 sm:py-16">
  <div class="mx-auto max-w-2xl text-center">
    <p class="mt-3 text-parchment-300" aria-live="polite">
      {#if detectedPlatform === 'windows'}
        Windows detected. We recommend the auto-updating setup.
      {:else if detectedPlatform === 'linux'}
        Linux detected. We recommend the auto-updating AppImage.
      {:else}
        Select the operating system where you play Diablo II: Resurrected.
      {/if}
    </p>
  </div>

  <div class="mx-auto mt-8 grid max-w-lg grid-cols-2 rounded-lg border border-parchment-300/25 bg-black/35 p-1" aria-label="Operating system">
    <button
      type="button"
      class:selected={selectedPlatform === 'windows'}
      class="platform-button flex items-center justify-center gap-2 rounded-md px-4 py-3 text-parchment-300 transition hover:text-white"
      aria-pressed={selectedPlatform === 'windows'}
      onclick={() => selectedPlatform = 'windows'}
    >
      <WindowsSolid class="h-5 w-5" aria-hidden="true" /> Windows
    </button>
    <button
      type="button"
      class:selected={selectedPlatform === 'linux'}
      class="platform-button flex items-center justify-center gap-2 rounded-md px-4 py-3 text-parchment-300 transition hover:text-white"
      aria-pressed={selectedPlatform === 'linux'}
      onclick={() => selectedPlatform = 'linux'}
    >
      <TerminalSolid class="h-5 w-5" aria-hidden="true" /> Linux
    </button>
  </div>

  {#if data.release}
    {#if selectedPlatform === 'windows'}
      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <article class="panel relative rounded-lg border-ember-400/55 p-6 shadow-2xl shadow-black/25">
          <span class="display-text inline-flex rounded-full bg-ember-700/35 px-3 py-1 text-xs uppercase tracking-wider text-ember-400">Recommended</span>
          <h3 class="display-text mt-4 text-2xl">Auto-updating setup</h3>
          <p class="mt-3 min-h-14 text-parchment-300">Installs the launcher for you and keeps it current when new releases arrive.</p>
          {#if data.release.downloads.windowsSetup}
            <a class="download-primary mt-6 flex w-full items-center justify-center gap-2 rounded px-5 py-3 font-semibold" href={data.release.downloads.windowsSetup.url}>
              <DownloadSolid class="h-5 w-5" aria-hidden="true" /> Download setup
            </a>
            <p class="mt-3 text-center text-xs text-parchment-300/80">{details(data.release.downloads.windowsSetup)} · Windows x64 · .exe</p>
          {:else}
            <a class="download-secondary mt-6 flex w-full items-center justify-center rounded px-5 py-3" href={data.release.url}>View latest release</a>
          {/if}
        </article>

        <article class="panel rounded-lg p-6">
          <span class="display-text inline-flex rounded-full border border-parchment-300/25 px-3 py-1 text-xs uppercase tracking-wider text-parchment-300">Manual</span>
          <h3 class="display-text mt-4 text-2xl">Static install</h3>
          <p class="mt-3 min-h-14 text-parchment-300">Download the standalone ZIP, extract it anywhere, and update it manually when you choose.</p>
          {#if data.release.downloads.windowsStatic}
            <a class="download-secondary mt-6 flex w-full items-center justify-center gap-2 rounded px-5 py-3" href={data.release.downloads.windowsStatic.url}>
              <DownloadSolid class="h-5 w-5" aria-hidden="true" /> Download static ZIP
            </a>
            <p class="mt-3 text-center text-xs text-parchment-300/80">{details(data.release.downloads.windowsStatic)} · Windows x64 · .zip</p>
          {:else}
            <a class="download-secondary mt-6 flex w-full items-center justify-center rounded px-5 py-3" href={data.release.url}>View latest release</a>
          {/if}
        </article>
      </div>
    {:else}
      <div class="panel mx-auto mt-8 max-w-2xl rounded-lg border-ember-400/55 p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div class="flex items-start gap-4">
          <TerminalSolid class="mt-1 h-9 w-9 shrink-0 text-ember-400" aria-hidden="true" />
          <div>
            <span class="display-text inline-flex rounded-full bg-ember-700/35 px-3 py-1 text-xs uppercase tracking-wider text-ember-400">Recommended</span>
            <h3 class="display-text mt-4 text-2xl">Auto-updating AppImage</h3>
            <p class="mt-3 text-parchment-300">A single Linux x64 file with launcher updates built in. Make it executable, then run it through your D2R Steam/Proton setup.</p>
          </div>
        </div>
        {#if data.release.downloads.linuxAppImage}
          <a class="download-primary mt-7 flex w-full items-center justify-center gap-2 rounded px-5 py-3 font-semibold" href={data.release.downloads.linuxAppImage.url}>
            <DownloadSolid class="h-5 w-5" aria-hidden="true" /> Download AppImage
          </a>
          <p class="mt-3 text-center text-xs text-parchment-300/80">{details(data.release.downloads.linuxAppImage)} · Linux x64 · AppImage</p>
        {:else}
          <a class="download-secondary mt-7 flex w-full items-center justify-center rounded px-5 py-3" href={data.release.url}>View latest release</a>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="panel mx-auto mt-8 max-w-2xl rounded-lg p-8 text-center">
      <h3 class="display-text text-2xl">Downloads are still available</h3>
      <p class="mt-3 text-parchment-300">We could not load the latest release details right now. Open GitHub Releases to choose the newest download.</p>
      <a class="download-primary mt-6 inline-flex items-center gap-2 rounded px-5 py-3 font-semibold" href={data.releasesUrl}>
        View all releases ↗
      </a>
    </div>
  {/if}

  <div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-parchment-300/15 pt-6 text-sm text-parchment-300 sm:flex-row">
    <p>macOS and ARM builds are not currently published.</p>
    <a class="text-ember-400 hover:text-white" href={data.releasesUrl}>Release notes and older versions ↗</a>
  </div>
</section>

<style>
  .platform-button.selected {
    background: rgb(123 29 24 / 0.45);
    color: var(--color-parchment-50);
    box-shadow: inset 0 0 0 1px rgb(228 90 53 / 0.6);
  }

  .download-primary {
    background: var(--color-ember-500);
    color: white;
    transition: background-color 150ms ease, transform 150ms ease;
  }

  .download-primary:hover { background: var(--color-ember-400); }
  .download-primary:active { transform: translateY(1px); }

  .download-secondary {
    border: 1px solid rgb(188 167 125 / 0.4);
    color: var(--color-parchment-50);
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  .download-secondary:hover {
    border-color: var(--color-ember-400);
    background: rgb(123 29 24 / 0.2);
  }
</style>
