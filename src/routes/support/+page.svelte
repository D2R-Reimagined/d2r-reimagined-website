<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { CheckCircleSolid, CreditCardSolid, DiscordSolid, HeartSolid, LockSolid, ServerSolid } from 'flowbite-svelte-icons';
  import { ApiError, apiRequest, authState } from '$lib/auth';
  import {
    activeMembership,
    billingPeriod,
    discordInviteUrl,
    formatDate,
    formatMoney,
    goalPosition,
    monthLabel,
    nextGoal,
    productHighlights,
    progressPercent,
    purchaseStatusLabel,
    sourceLabel,
    type SupportProduct,
    type SupportPurchase
  } from '$lib/support';

  let { data } = $props();

  const summary = $derived(data.summary);
  const products = $derived(data.products);
  const currency = $derived(summary?.currency ?? 'usd');
  const total = $derived(summary?.monthlyTotal ?? 0);
  const goals = $derived(summary?.goals ?? []);
  const upcoming = $derived(nextGoal(total, goals));
  const percent = $derived(progressPercent(total, goals));
  const checkoutState = $derived(page.url.searchParams.get('checkout'));
  const checkoutEnabled = $derived(products?.checkoutEnabled ?? false);
  const signedIn = $derived(Boolean($authState.user));

  let purchases = $state<SupportPurchase[]>([]);
  let pendingPriceId = $state<string | null>(null);
  let checkoutError = $state('');
  let confirmedPurchase = $state<SupportPurchase | null>(null);
  let confirming = $state(false);

  const membership = $derived(activeMembership(purchases));

  async function loadPurchases() {
    try {
      purchases = await apiRequest<SupportPurchase[]>('/support/purchases', {}, true);
    } catch {
      purchases = [];
    }
  }

  onMount(async () => {
    const sessionId = page.url.searchParams.get('session_id');
    if ($authState.user && checkoutState === 'success' && sessionId) {
      confirming = true;
      try {
        confirmedPurchase = await apiRequest<SupportPurchase>(
          '/support/checkout/confirm',
          { method: 'POST', body: JSON.stringify({ sessionId }) },
          true
        );
      } catch {
        // The webhook still records it; the thank-you message covers the wait.
      } finally {
        confirming = false;
      }
      // Keep the thank-you banner but drop the session id from the address bar and history.
      const url = new URL(page.url);
      url.searchParams.delete('session_id');
      await goto(url, { replaceState: true, noScroll: true, keepFocus: true });
    }
    if ($authState.user) await loadPurchases();
  });

  async function purchase(product: SupportProduct) {
    if (pendingPriceId) return;
    pendingPriceId = product.priceId;
    checkoutError = '';
    try {
      const { url } = await apiRequest<{ url: string }>(
        '/support/checkout',
        { method: 'POST', body: JSON.stringify({ priceId: product.priceId }) },
        true
      );
      window.location.assign(url);
    } catch (error) {
      checkoutError = error instanceof ApiError
        ? error.status === 429 ? 'Too many attempts. Please wait a moment and try again.' : error.message
        : 'Unable to reach the server. Please try again shortly.';
      pendingPriceId = null;
    }
  }

  const signInHref = '/profile?returnTo=%2Fsupport';
</script>

<svelte:head>
  <title>Support the Project | D2R Reimagined</title>
  <meta name="description" content="Help fund D2R Reimagined's online game servers with a monthly membership or a one-time purchase, and see this month's server funding goals." />
  <meta property="og:title" content="Support D2R Reimagined" />
  <meta property="og:description" content="Memberships and one-time purchases fund the game servers. Every monthly goal brings a new region online." />
  <meta name="twitter:title" content="Support D2R Reimagined" />
  <meta name="twitter:description" content="Memberships and one-time purchases fund the game servers. Every monthly goal brings a new region online." />
</svelte:head>

{#snippet productCard(product: SupportProduct, recurring: boolean)}
  {@const isCurrent = recurring && membership?.productId === product.productId}
  {@const blockedByMembership = recurring && membership != null && !isCurrent}
  {@const highlights = productHighlights(product)}
  <article class={`panel flex flex-col rounded-lg p-6 ${isCurrent ? 'border-ember-400/70 shadow-2xl shadow-black/25' : ''}`}>
    {#if product.imageUrl}
      <img src={product.imageUrl} alt="" class="mb-4 h-32 w-full rounded-md object-cover" loading="lazy" />
    {/if}
    {#if isCurrent}
      <span class="display-text mb-3 inline-flex w-fit rounded-full bg-ember-700/35 px-3 py-1 text-xs uppercase tracking-wider text-ember-400">Your membership</span>
    {/if}
    <h3 class="display-text text-2xl text-parchment-50">{product.name}</h3>
    <p class="mt-2 text-parchment-50">
      <span class="display-text text-3xl">{formatMoney(product.amount, product.currency)}</span>
      {#if recurring}<span class="text-sm text-parchment-300"> {billingPeriod(product)}</span>{/if}
    </p>
    {#if highlights.description}<p class="mt-3 text-sm text-parchment-300">{highlights.description}</p>{/if}
    {#if highlights.perks.length}
      <ul class="mt-4 space-y-2 text-sm text-parchment-200">
        {#each highlights.perks as feature (feature)}
          <li class="flex gap-2"><CheckCircleSolid class="mt-0.5 h-4 w-4 shrink-0 text-ember-400" aria-hidden="true" />{feature}</li>
        {/each}
      </ul>
    {/if}
    <div class="mt-auto pt-6">
      {#if !$authState.ready}
        <span class="support-secondary flex w-full items-center justify-center rounded px-5 py-3 opacity-60">Loading…</span>
      {:else if !signedIn}
        <a class="support-secondary flex w-full items-center justify-center rounded px-5 py-3" href={signInHref}>
          Sign in to {recurring ? 'subscribe' : 'buy'}
        </a>
      {:else if isCurrent || blockedByMembership}
        {#if products?.customerPortalUrl}
          <a class="support-secondary flex w-full items-center justify-center rounded px-5 py-3" href={products.customerPortalUrl} target="_blank" rel="noreferrer">
            {isCurrent ? 'Manage membership ↗' : 'Change tier in billing portal ↗'}
          </a>
        {:else}
          <span class="support-secondary flex w-full items-center justify-center rounded px-5 py-3 opacity-60">
            {isCurrent ? 'Current membership' : 'One membership at a time'}
          </span>
        {/if}
      {:else}
        <button
          type="button"
          class="support-primary flex w-full items-center justify-center gap-2 rounded px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pendingPriceId != null}
          onclick={() => purchase(product)}
        >
          <CreditCardSolid class="h-5 w-5" aria-hidden="true" />
          {#if pendingPriceId === product.priceId}Opening checkout…{:else}{recurring ? 'Subscribe' : 'Buy now'}{/if}
        </button>
      {/if}
    </div>
  </article>
{/snippet}

<section class="relative isolate overflow-hidden border-b border-parchment-300/15">
  <img src="/images/reimagined-hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
  <div class="absolute inset-0 bg-gradient-to-r from-abyss-950 via-abyss-950/95 to-abyss-950/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/25"></div>
  <div class="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
    <h1 class="display-text mt-3 max-w-3xl text-4xl leading-tight text-parchment-50 sm:text-6xl">Support the project</h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-parchment-200">
      D2R Reimagined is free to play. Memberships and one-time purchases pay for the game servers, and every monthly goal we reach brings another region online.
    </p>
  </div>
</section>

<section class="mx-auto max-w-6xl px-5 py-12 sm:py-16">
  {#if checkoutState === 'success'}
    <div class="mb-8 flex items-start gap-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-parchment-50" role="status">
      <HeartSolid class="mt-0.5 h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
      <p>
        {#if confirming}
          Thank you! Confirming your purchase…
        {:else if confirmedPurchase}
          Thank you! <span class="text-ember-400">{confirmedPurchase.productName}</span> has been added to your account.
        {:else}
          Thank you for supporting D2R Reimagined! Your purchase will appear on your account within a few minutes.
        {/if}
      </p>
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
            <dt class="text-xs uppercase tracking-wider text-parchment-300">{sourceLabel(source)}</dt>
            <dd class="mt-1 text-lg text-parchment-50">{formatMoney(source.amount, currency)}</dd>
          </div>
        {/each}
      </dl>
    {:else}
      <h2 class="display-text text-2xl">Funding progress is unavailable</h2>
      <p class="mt-3 text-parchment-300">We could not load this month's totals right now. You can still support us below.</p>
    {/if}
  </div>

  {#if checkoutError}
    <p class="mt-8 rounded-lg border border-ember-500/50 bg-ember-950/30 p-4 text-parchment-50" role="alert">{checkoutError}</p>
  {/if}

  <!-- Memberships -->
  {#if checkoutEnabled && products?.recurring.length}
    <h2 class="display-text mt-14 text-3xl">Monthly memberships</h2>
    <p class="mt-2 text-parchment-300">Recurring support billed automatically each period. Cancel anytime{products.customerPortalUrl ? ' from the billing portal' : ''}.</p>
    <div class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {#each products.recurring as product (product.priceId)}
        {@render productCard(product, true)}
      {/each}
    </div>
  {/if}

  <!-- One-time purchases -->
  {#if checkoutEnabled && products?.oneTime.length}
    <h2 class="display-text mt-14 text-3xl">One-time purchases</h2>
    <p class="mt-2 text-parchment-300">A single payment, with no subscription.</p>
    <div class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {#each products.oneTime as product (product.priceId)}
        {@render productCard(product, false)}
      {/each}
    </div>
  {/if}

  {#if !checkoutEnabled}
    <div class="panel mt-14 rounded-lg p-6">
      <h2 class="display-text text-2xl">Memberships are unavailable right now</h2>
      <p class="mt-3 text-parchment-300">We could not load the membership and purchase options. Please check back shortly, or support us through Discord below.</p>
    </div>
  {:else}
    <p class="mt-6 flex items-center gap-1.5 text-xs text-parchment-300/80">
      <LockSolid class="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout by Stripe. Purchases are linked to your D2R Reimagined account.
    </p>
  {/if}

  <!-- The signed-in account's purchases -->
  {#if signedIn && purchases.length}
    <h2 class="display-text mt-14 text-3xl">Your purchases</h2>
    <div class="panel mt-6 overflow-x-auto rounded-lg">
      <table class="w-full min-w-[32rem] text-left text-sm">
        <thead class="border-b border-parchment-300/15 text-xs uppercase tracking-wider text-parchment-300">
          <tr><th class="px-4 py-3 font-normal">Item</th><th class="px-4 py-3 font-normal">Amount</th><th class="px-4 py-3 font-normal">Status</th><th class="px-4 py-3 font-normal">Date</th></tr>
        </thead>
        <tbody>
          {#each purchases as item (item.id)}
            <tr class="border-b border-parchment-300/10 last:border-0">
              <td class="px-4 py-3 text-parchment-50">{item.productName}</td>
              <td class="px-4 py-3 text-parchment-200">{formatMoney(item.amount, item.currency)}{item.kind === 'subscription' ? ' / period' : ''}</td>
              <td class={`px-4 py-3 ${item.active ? 'text-ember-400' : 'text-parchment-300'}`}>{purchaseStatusLabel(item)}</td>
              <td class="px-4 py-3 text-parchment-300">
                {formatDate(item.purchasedAtUtc)}
                {#if item.kind === 'subscription' && item.active && item.currentPeriodEndUtc}
                  <span class="block text-xs">{item.cancelAtPeriodEnd ? 'Ends' : 'Renews'} {formatDate(item.currentPeriodEndUtc)}</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Goals -->
  {#if goals.length}
    <h2 class="display-text mt-14 text-3xl">Monthly server goals</h2>
    <p class="mt-2 text-parchment-300">Each goal is a recurring monthly cost. Reaching it keeps that server region running.</p>
    <ol class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

  <!-- Other ways to support -->
  <h2 class="display-text mt-14 text-3xl">Other ways to support</h2>
  <div class="mt-6 grid gap-5 md:grid-cols-2">
    <article class="panel flex flex-col rounded-lg p-6">
      <h3 class="display-text text-2xl">Discord server subscription</h3>
      <p class="mt-3 flex-1 text-parchment-300">Join our Discord, open the server name menu, and choose <span class="text-parchment-50">Server Subscriptions</span> to get supporter roles.</p>
      <a class="support-secondary mt-6 flex w-full items-center justify-center gap-2 rounded px-5 py-3" href={discordInviteUrl} target="_blank" rel="noreferrer">
        <DiscordSolid class="h-5 w-5" aria-hidden="true" /> Open Discord ↗
      </a>
    </article>
  </div>

  {#if summary}
    <p class="mt-10 border-t border-parchment-300/15 pt-6 text-sm text-parchment-300">
      Totals reset at the start of each month (UTC). Discord and other amounts are updated by the team; website memberships and purchases update automatically.
    </p>
  {/if}
</section>

<style>
  .progress-fill {
    background: linear-gradient(90deg, var(--color-ember-700), var(--color-ember-500) 60%, var(--color-ember-400));
    box-shadow: 0 0 12px rgb(228 90 53 / 0.45);
    transition: width 600ms ease;
  }

  .support-primary {
    background: var(--color-ember-500);
    color: white;
    transition: background-color 150ms ease, transform 150ms ease;
  }

  .support-primary:not(:disabled):hover { background: var(--color-ember-400); }
  .support-primary:not(:disabled):active { transform: translateY(1px); }

  .support-secondary {
    border: 1px solid rgb(188 167 125 / 0.4);
    color: var(--color-parchment-50);
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  a.support-secondary:hover {
    border-color: var(--color-ember-400);
    background: rgb(123 29 24 / 0.2);
  }
</style>
