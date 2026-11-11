<script lang="ts">
  import { page } from '$app/state';
  import { confirmEmailChange } from '#lib/auth.js';

  const userId = $derived(page.url.searchParams.get('uid') ?? '');
  const token = $derived(page.url.searchParams.get('token') ?? '');
  const linkComplete = $derived(/^[0-9a-f-]{36}$/i.test(userId) && token.length > 0);

  let busy = $state(false);
  let done = $state(false);
  let error = $state('');

  // Confirming takes a click rather than happening on load, so a mail scanner
  // that opens the link cannot switch the address by itself.
  async function confirm(): Promise<void> {
    if (busy) return;
    busy = true;
    error = '';
    try {
      await confirmEmailChange(userId, token);
      done = true;
    } catch (value) {
      error = value instanceof Error ? value.message : 'Something went wrong. Please try again.';
    } finally {
      busy = false;
    }
  }
</script>

<svelte:head>
  <title>Confirm Email | D2R Reimagined</title>
  <meta name="description" content="Confirm the new email address for your D2R Reimagined account." />
  <meta name="robots" content="noindex" />
  <!-- The URL carries a live confirmation token; keep it out of Referer headers. -->
  <meta name="referrer" content="no-referrer" />
</svelte:head>

<section class="mx-auto flex min-h-[72vh] max-w-xl items-center px-4 py-12 sm:py-16">
  <article class="panel w-full rounded-lg p-6 sm:p-10">
    <p class="text-xs uppercase tracking-[0.28em] text-ember-400">D2R Reimagined account</p>
    <h1 class="display-text mt-3 text-3xl text-parchment-50">Confirm your email address</h1>

    {#if done}
      <div role="status" class="mt-6 rounded border border-set/35 bg-green-950/35 px-4 py-3 text-green-200">
        Your email address has been changed.
      </div>
      <p class="mt-5 text-sm leading-6 text-parchment-300">
        Sign in with this address from now on. Your password and everything else on the account are unchanged.
      </p>
      <a href="/profile" class="mt-7 inline-block rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400">Go to your profile</a>
    {:else if !linkComplete}
      <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
        This confirmation link is incomplete. Open the link from your email again, or change your email address from your profile to get a new one.
      </div>
      <a href="/profile" class="mt-7 inline-block rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400">Go to your profile</a>
    {:else}
      <p class="mt-4 leading-7 text-parchment-300">
        Confirm that you want this email address on your account. You will sign in with it from now on, and the old address will no longer be linked.
      </p>

      {#if error}
        <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
          {error}
        </div>
      {/if}

      <button type="button" disabled={busy} onclick={confirm} class="mt-7 w-full rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
        {busy ? 'Confirming…' : 'Confirm email address'}
      </button>
    {/if}
  </article>
</section>
