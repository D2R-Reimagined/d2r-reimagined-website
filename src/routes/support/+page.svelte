<script lang="ts">
  import { page } from '$app/state';
  import { env } from '$env/dynamic/public';
  import { CheckCircleSolid, CreditCardSolid, DiscordSolid, HeartSolid, LockSolid, ServerSolid } from 'flowbite-svelte-icons';
  import {
    discordInviteUrl,
    donationPresets,
    formatMoney,
    goalPosition,
    monthLabel,
    nextGoal,
    parseDonationAmount,
    patreonUrl,
    progressPercent
  } from '$lib/support';

  let { data } = $props();

  const summary = $derived(data.summary);
  const currency = $derived(summary?.currency ?? 'usd');
  const total = $derived(summary?.monthlyTotal ?? 0);
  const goals = $derived(summary?.goals ?? []);
  const upcoming = $derived(nextGoal(total, goals));
  const percent = $derived(progressPercent(total, goals));
  const checkoutState = $derived(page.url.searchParams.get('checkout'));
  const minimum = $derived(summary?.minimumAmount ?? 1);
  const maximum = $derived(summary?.maximumAmount ?? 1000);

  let monthly = $state(false);
  let selectedPreset = $state<number | null>(10);
  let customAmount = $state('');
  let submitting = $state(false);
  let checkoutError = $state('');

  const amount = $derived(customAmount.trim() ? parseDonationAmount(customAmount, minimum, maximum) : selectedPreset);

  function choosePreset(value: number) {
    selectedPreset = value;
    customAmount = '';
    checkoutError = '';
  }

  async function donate(event: SubmitEvent) {
    event.preventDefault();
    if (amount == null || submitting) return;
    submitting = true;
    checkoutError = '';
    try {
      const api = (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${api}/support/checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, monthly })
      });
      if (!response.ok) {
        checkoutError = response.status === 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : 'We could not start checkout. Please try again shortly.';
        return;
      }
      const { url } = await response.json() as { url: string };
      window.location.assign(url);
    } catch {
      checkoutError = 'Unable to reach the server. Please try again shortly.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Support the Project | D2R Reimagined</title>
  <meta name="description" content="Help fund D2R Reimagined's online game servers. See this month's funding goals and support us through Patreon, Discord, or a direct donation." />
  <meta property="og:title" content="Support D2R Reimagined" />
  <meta property="og:description" content="Every monthly goal we reach brings a new game server region online." />
  <meta name="twitter:title" content="Support D2R Reimagined" />
  <meta name="twitter:description" content="Every monthly goal we reach brings a new game server region online." />
</svelte:head>

<section class="relative isolate overflow-hidden border-b border-parchment-300/15">
  <img src="/images/reimagined-hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
  <div class="absolute inset-0 bg-gradient-to-r from-abyss-950 via-abyss-950/95 to-abyss-950/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/25"></div>
  <div class="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
    <h1 class="display-text mt-3 max-w-3xl text-4xl leading-tight text-parchment-50 sm:text-6xl">Support the project</h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-parchment-200">
      D2R Reimagined is free to play. Your support pays for the game servers, and every monthly goal we reach brings another region online.
    </p>
  </div>
</section>

<section class="mx-auto max-w-5xl px-5 py-12 sm:py-16">
  {#if checkoutState === 'success'}
    <div class="mb-8 flex items-start gap-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-parchment-50" role="status">
      <HeartSolid class="mt-0.5 h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
      <p>Thank you for supporting D2R Reimagined! Your donation will appear in the monthly total within a few minutes.</p>
    </div>
  {:else if checkoutState === 'canceled'}
    <div class="mb-8 rounded-lg border border-parchment-300/25 bg-black/35 p-4 text-parchment-200" role="status">
      Checkout was canceled and you were not charged.
    </div>
  {/if}

  <!-- Monthly progress -->
  <div class="panel rounded-lg p-6 sm:p-8">
    {#if summary}
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-wider text-parchment-300">{monthLabel(summary.periodStartUtc)} funding</p>
          <p class="display-text mt-2 text-4xl text-parchment-50 sm:text-5xl">
            {formatMoney(total, currency)}<span class="text-xl text-parchment-300"> / month</span>
          </p>
        </div>
        <p class="text-parchment-200" aria-live="polite">
          {#if upcoming}
            <span class="text-ember-400">{formatMoney(Math.ceil((upcoming.amount - total) * 100) / 100, currency)}</span> more unlocks
            <span class="text-parchment-50">{upcoming.name}</span>
          {:else if goals.length}
            Every goal reached this month. Thank you!
          {/if}
        </p>
      </div>

      {#if goals.length}
        <div class="relative mt-10 mb-12">
          <div
            class="h-4 overflow-hidden rounded-full border border-parchment-300/25 bg-black/50"
            role="progressbar"
            aria-label="Monthly funding progress"
            aria-valuemin={0}
            aria-valuemax={goals[goals.length - 1].amount}
            aria-valuenow={total}
            aria-valuetext={`${formatMoney(total, currency)} of ${formatMoney(goals[goals.length - 1].amount, currency)}`}
          >
            <div class="progress-fill h-full rounded-full" style={`width: ${percent}%`}></div>
          </div>
          {#each goals as goal (goal.amount)}
            <div class="absolute top-0 -translate-x-1/2" style={`left: ${goalPosition(goal, goals)}%`}>
              <div class={`h-4 w-0.5 ${goal.reached ? 'bg-parchment-50' : 'bg-parchment-300/50'}`}></div>
              <span class={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs ${goal.reached ? 'text-ember-400' : 'text-parchment-300'}`}>
                {formatMoney(goal.amount, currency)}
              </span>
            </div>
          {/each}
        </div>
      {/if}

      <dl class="grid gap-3 sm:grid-cols-3">
        {#each summary.sources as source (source.key)}
          <div class="rounded-md border border-parchment-300/15 bg-black/30 px-4 py-3">
            <dt class="text-xs uppercase tracking-wider text-parchment-300">{source.label}</dt>
            <dd class="mt-1 text-lg text-parchment-50">{formatMoney(source.amount, currency)}</dd>
          </div>
        {/each}
      </dl>
    {:else}
      <h2 class="display-text text-2xl">Funding progress is unavailable</h2>
      <p class="mt-3 text-parchment-300">We could not load this month's totals right now. You can still support us below.</p>
    {/if}
  </div>

  <!-- Goals -->
  {#if goals.length}
    <h2 class="display-text mt-14 text-3xl">Monthly server goals</h2>
    <p class="mt-2 text-parchment-300">Each goal is a recurring monthly cost. Reaching it keeps that server region running.</p>
    <ol class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each goals as goal (goal.amount)}
        <li class={`panel flex gap-4 rounded-lg p-5 ${goal.reached ? 'border-ember-400/55' : ''}`}>
          {#if goal.reached}
            <CheckCircleSolid class="mt-1 h-6 w-6 shrink-0 text-ember-400" aria-hidden="true" />
          {:else}
            <ServerSolid class="mt-1 h-6 w-6 shrink-0 text-parchment-300/70" aria-hidden="true" />
          {/if}
          <div>
            <p class="text-sm text-parchment-300">{formatMoney(goal.amount, currency)} / month</p>
            <h3 class="display-text mt-1 text-xl text-parchment-50">{goal.name}</h3>
            {#if goal.description}<p class="mt-2 text-sm text-parchment-300">{goal.description}</p>{/if}
            <p class={`mt-3 text-xs uppercase tracking-wider ${goal.reached ? 'text-ember-400' : 'text-parchment-300/70'}`}>
              {goal.reached ? 'Funded' : 'Not yet funded'}
            </p>
          </div>
        </li>
      {/each}
    </ol>
  {/if}

  <!-- Ways to support -->
  <h2 class="display-text mt-14 text-3xl">Ways to support</h2>
  <div class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    <article class="panel flex flex-col rounded-lg border-ember-400/55 p-6 shadow-2xl shadow-black/25 md:col-span-2 lg:col-span-1">
      <span class="display-text inline-flex w-fit rounded-full bg-ember-700/35 px-3 py-1 text-xs uppercase tracking-wider text-ember-400">Direct</span>
      <h3 class="display-text mt-4 text-2xl">Donate</h3>
      {#if summary?.checkoutEnabled}
        <form class="mt-4 flex flex-1 flex-col" onsubmit={donate}>
          <div class="grid grid-cols-2 rounded-lg border border-parchment-300/25 bg-black/35 p-1" role="group" aria-label="Donation frequency">
            <button type="button" class:selected={!monthly} class="toggle-button rounded-md px-3 py-2 text-sm text-parchment-300" aria-pressed={!monthly} onclick={() => monthly = false}>One-time</button>
            <button type="button" class:selected={monthly} class="toggle-button rounded-md px-3 py-2 text-sm text-parchment-300" aria-pressed={monthly} onclick={() => monthly = true}>Monthly</button>
          </div>
          <div class="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="Donation amount">
            {#each donationPresets as preset (preset)}
              <button
                type="button"
                class:selected={!customAmount.trim() && selectedPreset === preset}
                class="toggle-button rounded-md border border-parchment-300/25 px-2 py-2 text-parchment-200"
                aria-pressed={!customAmount.trim() && selectedPreset === preset}
                onclick={() => choosePreset(preset)}
              >${preset}</button>
            {/each}
          </div>
          <label class="mt-4 block text-sm text-parchment-300" for="custom-amount">Or enter an amount (USD)</label>
          <input
            id="custom-amount"
            class="mt-1 w-full rounded-md border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50"
            inputmode="numeric"
            placeholder={`${minimum}–${maximum}`}
            bind:value={customAmount}
            oninput={() => checkoutError = ''}
          />
          {#if customAmount.trim() && amount == null}
            <p class="mt-2 text-sm text-ember-400">Enter a whole amount from ${minimum} to ${maximum}.</p>
          {/if}
          {#if checkoutError}<p class="mt-2 text-sm text-ember-400" role="alert">{checkoutError}</p>{/if}
          <button
            type="submit"
            class="donate-primary mt-5 flex w-full items-center justify-center gap-2 rounded px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={amount == null || submitting}
          >
            <CreditCardSolid class="h-5 w-5" aria-hidden="true" />
            {#if submitting}Opening checkout…{:else if amount != null}Donate {formatMoney(amount, currency)}{monthly ? ' monthly' : ''}{:else}Donate{/if}
          </button>
          <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-parchment-300/80">
            <LockSolid class="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout by Stripe{monthly ? ' · cancel anytime' : ''}
          </p>
        </form>
      {:else}
        <p class="mt-3 text-parchment-300">Direct donations are not available right now. Patreon and Discord are open any time.</p>
      {/if}
    </article>

    <article class="panel flex flex-col rounded-lg p-6">
      <span class="display-text inline-flex w-fit rounded-full border border-parchment-300/25 px-3 py-1 text-xs uppercase tracking-wider text-parchment-300">Membership</span>
      <h3 class="display-text mt-4 text-2xl">Patreon</h3>
      <p class="mt-3 flex-1 text-parchment-300">Become a monthly patron and follow development updates from ScottieKnows.</p>
      <a class="support-secondary mt-6 flex w-full items-center justify-center gap-2 rounded px-5 py-3" href={patreonUrl} target="_blank" rel="noreferrer">
        <HeartSolid class="h-5 w-5" aria-hidden="true" /> Join on Patreon ↗
      </a>
    </article>

    <article class="panel flex flex-col rounded-lg p-6">
      <span class="display-text inline-flex w-fit rounded-full border border-parchment-300/25 px-3 py-1 text-xs uppercase tracking-wider text-parchment-300">Membership</span>
      <h3 class="display-text mt-4 text-2xl">Discord server subscription</h3>
      <p class="mt-3 flex-1 text-parchment-300">Join our Discord, open the server name menu, and choose <span class="text-parchment-50">Server Subscriptions</span> to get supporter roles.</p>
      <a class="support-secondary mt-6 flex w-full items-center justify-center gap-2 rounded px-5 py-3" href={discordInviteUrl} target="_blank" rel="noreferrer">
        <DiscordSolid class="h-5 w-5" aria-hidden="true" /> Open Discord ↗
      </a>
    </article>
  </div>

  {#if summary}
    <p class="mt-10 border-t border-parchment-300/15 pt-6 text-sm text-parchment-300">
      Totals reset at the start of each month (UTC). Patreon and Discord amounts are updated by the team; direct donations update automatically.
    </p>
  {/if}
</section>

<style>
  .progress-fill {
    background: linear-gradient(90deg, var(--color-ember-700), var(--color-ember-500) 60%, var(--color-ember-400));
    box-shadow: 0 0 12px rgb(228 90 53 / 0.45);
    transition: width 600ms ease;
  }

  .toggle-button {
    transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
  }

  .toggle-button:hover { color: white; }

  .toggle-button.selected {
    background: rgb(123 29 24 / 0.45);
    color: var(--color-parchment-50);
    border-color: rgb(228 90 53 / 0.6);
    box-shadow: inset 0 0 0 1px rgb(228 90 53 / 0.6);
  }

  .donate-primary {
    background: var(--color-ember-500);
    color: white;
    transition: background-color 150ms ease, transform 150ms ease;
  }

  .donate-primary:not(:disabled):hover { background: var(--color-ember-400); }
  .donate-primary:not(:disabled):active { transform: translateY(1px); }

  .support-secondary {
    border: 1px solid rgb(188 167 125 / 0.4);
    color: var(--color-parchment-50);
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  .support-secondary:hover {
    border-color: var(--color-ember-400);
    background: rgb(123 29 24 / 0.2);
  }
</style>
