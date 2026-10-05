<script lang="ts">
  import { requestPasswordReset } from '$lib/auth';

  let email = $state('');
  let sentTo = $state('');
  let busy = $state(false);
  let error = $state('');

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (busy) return;
    busy = true;
    error = '';
    try {
      await requestPasswordReset(email, new URL('/reset-password', window.location.origin).href);
      sentTo = email.trim();
    } catch (value) {
      error = value instanceof Error ? value.message : 'Something went wrong. Please try again.';
    } finally {
      busy = false;
    }
  }
</script>

<svelte:head>
  <title>Forgot Password | D2R Reimagined</title>
  <meta name="description" content="Reset the password for your D2R Reimagined account." />
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto flex min-h-[72vh] max-w-xl items-center px-4 py-12 sm:py-16">
  <article class="panel w-full rounded-lg p-6 sm:p-10">
    <p class="text-xs uppercase tracking-[0.28em] text-ember-400">D2R Reimagined account</p>
    <h1 class="display-text mt-3 text-3xl text-parchment-50">Forgot your password?</h1>

    {#if sentTo}
      <div role="status" class="mt-6 rounded border border-set/35 bg-green-950/35 px-4 py-3 text-green-200">
        If an account uses <span class="break-all font-semibold">{sentTo}</span>, a reset link is on its way.
      </div>
      <p class="mt-5 text-sm leading-6 text-parchment-300">
        The link expires in 1 hour and works once. Check your spam folder if it hasn’t arrived in a few minutes.
        Accounts created through Steam only have an email once you add one in your profile.
      </p>
      <div class="mt-7 flex flex-wrap gap-3">
        <a href="/profile" class="rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400">Back to sign in</a>
        <button type="button" onclick={() => { sentTo = ''; }} class="rounded border border-parchment-300/30 px-5 py-3 text-parchment-200 transition hover:border-parchment-200/60 hover:bg-white/5 hover:text-white">
          Use a different email
        </button>
      </div>
    {:else}
      <p class="mt-4 leading-7 text-parchment-300">
        Enter the email address on your account and we’ll send you a link to choose a new password.
      </p>

      {#if error}
        <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">{error}</div>
      {/if}

      <form class="mt-7 space-y-5" onsubmit={submit}>
        <div>
          <label for="reset-email" class="mb-2 block text-sm text-parchment-200">Email</label>
          <input class="field" id="reset-email" type="email" autocomplete="email" required maxlength="256" bind:value={email} />
        </div>
        <button type="submit" disabled={busy} class="w-full rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p class="mt-6 text-sm text-parchment-300">
        Remembered it? <a href="/profile" class="text-ember-400 underline hover:text-parchment-50">Sign in</a>
      </p>
    {/if}
  </article>
</section>
