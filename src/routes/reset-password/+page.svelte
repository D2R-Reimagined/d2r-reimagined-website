<script lang="ts">
  import { page } from '$app/state';
  import { resetPassword } from '$lib/auth';

  const userId = $derived(page.url.searchParams.get('uid') ?? '');
  const token = $derived(page.url.searchParams.get('token') ?? '');
  const linkComplete = $derived(/^[0-9a-f-]{36}$/i.test(userId) && token.length > 0);

  let password = $state('');
  let confirmPassword = $state('');
  let busy = $state(false);
  let done = $state(false);
  let error = $state('');

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (busy) return;
    error = '';
    if (password !== confirmPassword) {
      error = 'The passwords do not match.';
      return;
    }

    busy = true;
    try {
      await resetPassword(userId, token, password);
      done = true;
      password = '';
      confirmPassword = '';
    } catch (value) {
      error = value instanceof Error ? value.message : 'Something went wrong. Please try again.';
    } finally {
      busy = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password | D2R Reimagined</title>
  <meta name="description" content="Choose a new password for your D2R Reimagined account." />
  <meta name="robots" content="noindex" />
  <!-- The URL carries a live reset token; keep it out of Referer headers. -->
  <meta name="referrer" content="no-referrer" />
</svelte:head>

<section class="mx-auto flex min-h-[72vh] max-w-xl items-center px-4 py-12 sm:py-16">
  <article class="panel w-full rounded-lg p-6 sm:p-10">
    <p class="text-xs uppercase tracking-[0.28em] text-ember-400">D2R Reimagined account</p>
    <h1 class="display-text mt-3 text-3xl text-parchment-50">Choose a new password</h1>

    {#if done}
      <div role="status" class="mt-6 rounded border border-set/35 bg-green-950/35 px-4 py-3 text-green-200">
        Your password has been changed.
      </div>
      <p class="mt-5 text-sm leading-6 text-parchment-300">
        For your security, every device that was signed in to this account has been signed out, including the launcher. Sign in again with your new password.
      </p>
      <a href="/profile" class="mt-7 inline-block rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400">Sign in</a>
    {:else if !linkComplete}
      <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
        This reset link is incomplete. Open the link from your email again, or request a new one.
      </div>
      <a href="/forgot-password" class="mt-7 inline-block rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400">Request a new link</a>
    {:else}
      <p class="mt-4 leading-7 text-parchment-300">
        Use at least 8 characters. Changing your password signs you out on every device.
      </p>

      {#if error}
        <div role="alert" class="mt-6 rounded border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
          {error}
          {#if error.includes('expired')}
            <a href="/forgot-password" class="mt-2 block text-red-100 underline">Request a new link</a>
          {/if}
        </div>
      {/if}

      <form class="mt-7 space-y-5" onsubmit={submit}>
        <div>
          <label for="new-password" class="mb-2 block text-sm text-parchment-200">New password</label>
          <input class="field" id="new-password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" bind:value={password} />
        </div>
        <div>
          <label for="confirm-new-password" class="mb-2 block text-sm text-parchment-200">Confirm new password</label>
          <input class="field" id="confirm-new-password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" bind:value={confirmPassword} />
        </div>
        <button type="submit" disabled={busy} class="w-full rounded bg-ember-500 px-5 py-3 font-semibold text-white transition hover:bg-ember-400 disabled:cursor-wait disabled:opacity-60">
          {busy ? 'Saving…' : 'Set new password'}
        </button>
      </form>
    {/if}
  </article>
</section>
