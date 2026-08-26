<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { authState, authorizeLauncher, initializeAuth } from '$lib/auth';
  import {
    launcherCancellationUrl,
    readLauncherAuthorizationParameters,
    type LauncherAuthorizationParameters
  } from '$lib/launcher-auth';

  let parameters = $state<LauncherAuthorizationParameters | null>(null);
  let ready = $state(false);
  let busy = $state(false);
  let error = $state('');

  function message(value: unknown): string {
    return value instanceof Error ? value.message : 'Authorization failed. Please try again.';
  }

  async function approve(): Promise<void> {
    if (!parameters || busy) return;
    busy = true;
    error = '';
    try {
      window.location.assign(await authorizeLauncher(
        parameters.redirectUri,
        parameters.codeChallenge,
        parameters.state
      ));
    } catch (value) {
      error = message(value);
      busy = false;
    }
  }

  function cancel(): void {
    if (!parameters) return;
    window.location.assign(launcherCancellationUrl(parameters));
  }

  onMount(async () => {
    parameters = readLauncherAuthorizationParameters(page.url.searchParams);
    if (!parameters) {
      error = 'This launcher sign-in request is invalid or incomplete.';
      ready = true;
      return;
    }

    try {
      await initializeAuth();
      if (!$authState.user) {
        const returnTo = `${page.url.pathname}${page.url.search}`;
        await goto(`/profile?returnTo=${encodeURIComponent(returnTo)}`, { replaceState: true });
        return;
      }
    } catch (value) {
      error = message(value);
    } finally {
      ready = true;
    }
  });
</script>

<svelte:head>
  <title>Authorize Launcher | D2R Reimagined</title>
  <meta name="description" content="Sign in to the D2R Reimagined Launcher through your website account." />
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto flex min-h-[72vh] max-w-3xl items-center px-4 py-12 sm:py-16">
  <article class="panel w-full rounded-lg p-6 sm:p-10">
    <p class="text-xs uppercase tracking-[0.28em] text-ember-400">Secure launcher sign-in</p>
    <h1 class="display-text mt-3 text-3xl text-parchment-50 sm:text-4xl">Connect D2R Reimagined Launcher</h1>

    {#if !ready}
      <p class="mt-6 text-parchment-300">Checking your website session…</p>
    {:else if error}
      <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">{error}</div>
    {:else if $authState.user}
      <p class="mt-5 max-w-2xl leading-7 text-parchment-300">
        The launcher is asking to use your D2R Reimagined account for API features. Your password and website session stay in this browser.
      </p>

      <div class="mt-7 rounded border border-parchment-300/20 bg-black/20 p-5">
        <p class="text-xs uppercase tracking-[0.2em] text-parchment-300">Continue as</p>
        <p class="display-text mt-2 text-2xl text-parchment-50">{$authState.user.displayName}</p>
        <p class="mt-1 text-sm text-parchment-300">{$authState.user.email || 'Steam account'}</p>
      </div>

      <div class="mt-7 rounded border border-ember-400/25 bg-ember-950/20 p-4 text-sm leading-6 text-parchment-300">
        A one-use code will be sent to the launcher on this device. You can sign out from the launcher without signing out of the website.
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onclick={approve} class="rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
          {busy ? 'Connecting…' : 'Connect launcher'}
        </button>
        <button type="button" disabled={busy} onclick={cancel} class="rounded border border-parchment-300/30 px-5 py-3 text-parchment-200 transition hover:border-parchment-200/60 hover:bg-white/5 hover:text-white disabled:opacity-60">
          Cancel
        </button>
      </div>
    {/if}
  </article>
</section>
