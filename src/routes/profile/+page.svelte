<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import {
    authState,
    beginSteamLink,
    beginSteamSignIn,
    completeSteamSignIn,
    initializeAuth,
    refreshProfile,
    register,
    signIn,
    signOut,
    unlinkSteam
  } from '$lib/auth';

  let mode = $state<'signin' | 'register'>('signin');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let displayName = $state('');
  let battleTag = $state('');
  let busy = $state(false);
  let error = $state('');
  let notice = $state('');

  function profileUrl(): string {
    return `${window.location.origin}/profile`;
  }

  function message(value: unknown): string {
    return value instanceof Error ? value.message : 'Something went wrong. Please try again.';
  }

  async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (busy) return;
    error = '';
    notice = '';

    if (mode === 'register' && password !== confirmPassword) {
      error = 'The passwords do not match.';
      return;
    }

    busy = true;
    try {
      if (mode === 'register') {
        await register(email, password, displayName, battleTag);
        notice = 'Your account is ready.';
      } else {
        await signIn(email, password);
        notice = 'Welcome back.';
      }
    } catch (value) {
      error = message(value);
    } finally {
      busy = false;
    }
  }

  function steamSignIn(): void {
    error = '';
    beginSteamSignIn(profileUrl());
  }

  async function linkSteam(): Promise<void> {
    if (busy) return;
    busy = true;
    error = '';
    try {
      await beginSteamLink(profileUrl());
    } catch (value) {
      error = message(value);
      busy = false;
    }
  }

  async function removeSteam(): Promise<void> {
    if (busy) return;
    busy = true;
    error = '';
    notice = '';
    try {
      await unlinkSteam();
      notice = 'Your Steam account has been unlinked.';
    } catch (value) {
      error = message(value);
    } finally {
      busy = false;
    }
  }

  function logOut(): void {
    signOut();
    notice = 'You have been signed out.';
  }

  onMount(async () => {
    const steamStatus = page.url.searchParams.get('steam');
    try {
      if (steamStatus === 'signed-in') {
        busy = true;
        await completeSteamSignIn();
        notice = 'Signed in with Steam.';
      } else {
        await initializeAuth();
        if (steamStatus === 'linked') {
          await refreshProfile();
          notice = 'Your Steam account is linked.';
        }
      }
    } catch (value) {
      error = message(value);
    } finally {
      busy = false;
      if (steamStatus) await goto('/profile', { replaceState: true, noScroll: true });
    }
  });
</script>

<svelte:head>
  <title>Profile | D2R Reimagined</title>
  <meta name="description" content="Manage your D2R Reimagined account and linked Steam identity." />
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto min-h-[72vh] max-w-5xl px-4 py-10 sm:py-16">
  <div class="mb-8 border-b border-parchment-300/20 pb-6">
    <p class="mb-2 text-xs uppercase tracking-[0.28em] text-ember-400">D2R Reimagined account</p>
    <h1 class="display-text text-3xl text-parchment-50 sm:text-4xl">Profile</h1>
    <p class="mt-3 max-w-2xl text-parchment-300">
      Sign in to manage tracked characters, leaderboard identity, and trading activity.
    </p>
  </div>

  {#if error}
    <div role="alert" class="mb-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">{error}</div>
  {/if}
  {#if notice}
    <div role="status" class="mb-6 rounded border border-set/35 bg-green-950/35 px-4 py-3 text-green-200">{notice}</div>
  {/if}

  {#if !$authState.ready}
    <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading your profile…</div>
  {:else if $authState.user}
    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <article class="panel rounded-lg p-6 sm:p-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div class="display-text flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-ember-400/55 bg-ember-700/25 text-3xl text-parchment-50">
            {$authState.user.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-[0.22em] text-parchment-300">Signed in as</p>
            <h2 class="display-text mt-1 truncate text-2xl text-parchment-50">{$authState.user.displayName}</h2>
            <p class="mt-1 truncate text-sm text-parchment-300">{$authState.user.email || 'Steam account'}</p>
          </div>
        </div>

        <dl class="mt-8 divide-y divide-parchment-300/15 border-y border-parchment-300/15">
          <div class="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <dt class="text-parchment-300">Display name</dt>
            <dd class="text-parchment-50">{$authState.user.displayName}</dd>
          </div>
          <div class="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <dt class="text-parchment-300">BattleTag</dt>
            <dd class="text-parchment-50">{$authState.user.battleTag || 'Not set'}</dd>
          </div>
          <div class="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <dt class="text-parchment-300">Member since</dt>
            <dd class="text-parchment-50">{new Date($authState.user.createdAtUtc).toLocaleDateString()}</dd>
          </div>
        </dl>

        <button type="button" onclick={logOut} class="mt-6 rounded border border-parchment-300/30 px-4 py-2 text-parchment-200 transition hover:border-parchment-200/60 hover:bg-white/5 hover:text-white">
          Sign out
        </button>
      </article>

      <aside class="panel rounded-lg p-6 sm:p-8">
        <p class="text-xs uppercase tracking-[0.22em] text-ember-400">Connected accounts</p>
        <h2 class="display-text mt-2 text-2xl text-parchment-50">Steam</h2>
        <p class="mt-3 text-sm leading-6 text-parchment-300">
          Link Steam to associate your account with future character tracking and leaderboard entries.
        </p>

        {#if $authState.user.steamId}
          <div class="mt-6 rounded border border-set/35 bg-green-950/25 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-green-300">Connected</p>
            <p class="mt-2 break-all text-parchment-50">SteamID64 {$authState.user.steamId}</p>
          </div>
          <button type="button" disabled={busy} onclick={removeSteam} class="mt-4 rounded border border-red-500/35 px-4 py-2 text-red-200 transition hover:bg-red-950/40 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Working…' : 'Unlink Steam'}
          </button>
        {:else}
          <button type="button" disabled={busy} onclick={linkSteam} class="mt-6 flex w-full items-center justify-center gap-3 rounded bg-[#1b2838] px-5 py-3 font-semibold text-white transition hover:bg-[#243b55] disabled:cursor-wait disabled:opacity-60">
            <span aria-hidden="true" class="text-xl">◉</span>
            {busy ? 'Opening Steam…' : 'Link Steam account'}
          </button>
        {/if}
      </aside>
    </div>
  {:else}
    <div class="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <article class="panel rounded-lg p-6 sm:p-8">
        <div class="mb-7 grid grid-cols-2 border-b border-parchment-300/20">
          <button type="button" onclick={() => { mode = 'signin'; error = ''; }} class={`border-b-2 px-4 py-3 text-center transition ${mode === 'signin' ? 'border-ember-400 text-parchment-50' : 'border-transparent text-parchment-300 hover:text-white'}`}>
            Sign in
          </button>
          <button type="button" onclick={() => { mode = 'register'; error = ''; }} class={`border-b-2 px-4 py-3 text-center transition ${mode === 'register' ? 'border-ember-400 text-parchment-50' : 'border-transparent text-parchment-300 hover:text-white'}`}>
            Register
          </button>
        </div>

        <form class="space-y-5" onsubmit={handleSubmit}>
          {#if mode === 'register'}
            <div>
              <label for="display-name" class="mb-2 block text-sm text-parchment-200">Display name</label>
              <input class="field" id="display-name" autocomplete="nickname" required minlength="2" maxlength="50" bind:value={displayName} />
            </div>
            <div>
              <label for="battle-tag" class="mb-2 block text-sm text-parchment-200">BattleTag <span class="text-parchment-300">(optional)</span></label>
              <input class="field" id="battle-tag" autocomplete="off" maxlength="80" placeholder="Name#1234" bind:value={battleTag} />
            </div>
          {/if}
          <div>
            <label for="email" class="mb-2 block text-sm text-parchment-200">Email</label>
            <input class="field" id="email" type="email" autocomplete="email" required maxlength="256" bind:value={email} />
          </div>
          <div>
            <label for="password" class="mb-2 block text-sm text-parchment-200">Password</label>
            <input class="field" id="password" type="password" autocomplete={mode === 'register' ? 'new-password' : 'current-password'} required minlength="8" maxlength="128" bind:value={password} />
          </div>
          {#if mode === 'register'}
            <div>
              <label for="confirm-password" class="mb-2 block text-sm text-parchment-200">Confirm password</label>
              <input class="field" id="confirm-password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" bind:value={confirmPassword} />
            </div>
          {/if}
          <button type="submit" disabled={busy} class="w-full rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </article>

      <aside class="panel flex flex-col justify-center rounded-lg p-6 sm:p-8">
        <p class="text-xs uppercase tracking-[0.22em] text-ember-400">Continue with Steam</p>
        <h2 class="display-text mt-2 text-2xl text-parchment-50">Use your Steam identity</h2>
        <p class="mt-3 text-sm leading-6 text-parchment-300">
          Steam sign-in creates an account automatically and prepares it for leaderboard integration. No Steam password is shared with this site.
        </p>
        <button type="button" onclick={steamSignIn} class="mt-6 flex items-center justify-center gap-3 rounded bg-[#1b2838] px-5 py-3 font-semibold text-white transition hover:bg-[#243b55]">
          <span aria-hidden="true" class="text-xl">◉</span>
          Sign in through Steam
        </button>
      </aside>
    </div>
  {/if}
</section>
