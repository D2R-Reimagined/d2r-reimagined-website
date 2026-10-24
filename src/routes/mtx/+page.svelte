<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { CheckCircleSolid, InfoCircleSolid, LockSolid } from 'flowbite-svelte-icons';
  import { ApiError, authState, initializeAuth } from '$lib/auth';
  import { equipMtx, fetchMtx, groupBySlot, ownedCount, type MtxItem, type MtxLoadout, type MtxSlot } from '$lib/mtx';

  const signInHref = '/profile?returnTo=%2Fmtx';

  let mtx = $state<MtxLoadout | null>(null);
  let loading = $state(true);
  let loadError = $state('');
  let pending = $state<string | null>(null);
  let actionError = $state('');
  let notice = $state('');

  const slots = $derived(mtx ? groupBySlot(mtx) : []);
  const owned = $derived(mtx ? ownedCount(mtx.items) : 0);

  function errorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof ApiError)) return 'Unable to reach the server. Please try again shortly.';
    if (error.status === 403) return 'You have not unlocked that cosmetic yet.';
    if (error.status === 429) return 'Too many changes at once. Please wait a moment and try again.';
    return error.message || fallback;
  }

  async function load() {
    loading = true;
    loadError = '';
    try {
      mtx = await fetchMtx();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await goto(signInHref, { replaceState: true });
        return;
      }
      // An API without the cosmetics routes answers 404; treat it like a disabled catalog.
      if (error instanceof ApiError && error.status === 404) mtx = null;
      else loadError = errorMessage(error, 'Your cosmetics could not be loaded.');
    } finally {
      loading = false;
    }
  }

  async function equip(slot: MtxSlot, item: MtxItem | null) {
    if (pending) return;
    pending = `${slot.slot}:${item?.id ?? ''}`;
    actionError = '';
    notice = '';
    try {
      mtx = await equipMtx(slot.slot, item?.id ?? null);
      notice = item ? `${item.name} equipped.` : `${slot.label} cosmetic taken off.`;
    } catch (error) {
      actionError = errorMessage(error, 'That change could not be saved.');
    } finally {
      pending = null;
    }
  }

  onMount(async () => {
    await initializeAuth();
    if (!$authState.user) {
      await goto(signInHref, { replaceState: true });
      return;
    }
    await load();
  });
</script>

<svelte:head>
  <title>Cosmetics | D2R Reimagined</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#snippet itemCard(slot: MtxSlot, item: MtxItem)}
  {@const equipped = slot.equipped?.id === item.id}
  <article class={`panel flex flex-col rounded-lg p-5 ${equipped ? 'border-ember-400/70 shadow-2xl shadow-black/25' : ''} ${item.owned ? '' : 'opacity-75'}`}>
    <div class="flex items-start justify-between gap-3">
      <h3 class="display-text text-xl text-parchment-50">{item.name}</h3>
      {#if equipped}
        <span class="display-text inline-flex shrink-0 items-center gap-1 rounded-full bg-ember-700/35 px-3 py-1 text-xs uppercase tracking-wider text-ember-400">
          <CheckCircleSolid class="h-3.5 w-3.5" aria-hidden="true" /> Equipped
        </span>
      {:else if item.owned}
        <span class="shrink-0 rounded-full border border-parchment-300/25 px-3 py-1 text-xs uppercase tracking-wider text-parchment-200">Owned</span>
      {:else}
        <span class="inline-flex shrink-0 items-center gap-1 rounded-full border border-parchment-300/15 px-3 py-1 text-xs uppercase tracking-wider text-parchment-300">
          <LockSolid class="h-3.5 w-3.5" aria-hidden="true" /> Locked
        </span>
      {/if}
    </div>
    <p class="mt-3 text-sm text-parchment-300">
      <span class="text-xs uppercase tracking-wider text-parchment-300/80">{item.owned ? 'Unlocked by' : 'How to unlock'}</span>
      <span class="block text-parchment-200">{item.unlock}</span>
    </p>
    <div class="mt-auto pt-5">
      {#if equipped}
        <button
          type="button"
          class="mtx-secondary flex w-full items-center justify-center rounded px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pending != null}
          onclick={() => equip(slot, null)}
        >
          {pending === `${slot.slot}:` ? 'Taking off…' : 'Take off'}
        </button>
      {:else if item.owned}
        <button
          type="button"
          class="mtx-primary flex w-full items-center justify-center rounded px-4 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pending != null}
          onclick={() => equip(slot, item)}
        >
          {pending === `${slot.slot}:${item.id}` ? 'Equipping…' : 'Equip'}
        </button>
      {:else}
        <span class="mtx-secondary flex w-full items-center justify-center gap-2 rounded px-4 py-2.5 opacity-60">
          <LockSolid class="h-4 w-4" aria-hidden="true" /> Locked
        </span>
      {/if}
    </div>
  </article>
{/snippet}

<section class="relative isolate overflow-hidden border-b border-parchment-300/15">
  <img src="/images/reimagined-hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
  <div class="absolute inset-0 bg-gradient-to-r from-abyss-950 via-abyss-950/95 to-abyss-950/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-black/25"></div>
  <div class="relative mx-auto max-w-7xl px-5 py-12 sm:py-16">
    <h1 class="display-text max-w-3xl text-4xl leading-tight text-parchment-50 sm:text-5xl">Cosmetics</h1>
    <p class="mt-4 max-w-2xl text-lg leading-8 text-parchment-200">
      Choose how your characters look in game. Everyone in your game sees your equipped cosmetics.
    </p>
  </div>
</section>

<section class="mx-auto max-w-6xl px-5 py-12 sm:py-14">
  {#if loading}
    <div class="panel rounded-lg p-6 text-parchment-300" role="status">Loading your cosmetics…</div>
  {:else if loadError}
    <div class="rounded-lg border border-ember-500/50 bg-ember-950/30 p-4 text-parchment-50" role="alert">
      {loadError}
      <button type="button" class="ml-2 underline hover:text-ember-400" onclick={() => load()}>Retry</button>
    </div>
  {:else if !mtx?.enabled}
    <div class="panel rounded-lg p-6">
      <h2 class="display-text text-2xl">Cosmetics are not available right now</h2>
      <p class="mt-3 text-parchment-300">Please check back soon.</p>
    </div>
  {:else}
    <div class="flex items-start gap-3 rounded-lg border border-parchment-300/25 bg-black/35 p-4 text-parchment-200">
      <InfoCircleSolid class="mt-0.5 h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
      <p>
        Changes apply in game the next time you join a game. Already in one? Take your helmet off and equip it again to
        show your new choice.
      </p>
    </div>

    {#if notice}
      <p class="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-parchment-50" role="status">
        <CheckCircleSolid class="h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />{notice}
      </p>
    {/if}
    {#if actionError}
      <p class="mt-6 rounded-lg border border-ember-500/50 bg-ember-950/30 p-4 text-parchment-50" role="alert">{actionError}</p>
    {/if}

    <p class="mt-8 text-sm uppercase tracking-wider text-parchment-300">{owned} of {mtx.items.length} unlocked</p>

    {#each slots as slot (slot.slot)}
      <h2 class="display-text mt-6 text-3xl">{slot.label}</h2>
      <p class="mt-1 text-parchment-300">
        {#if slot.equipped}Wearing <span class="text-parchment-50">{slot.equipped.name}</span>{:else}Nothing equipped. Your normal {slot.label.toLowerCase()} shows.{/if}
      </p>
      <div class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {#each slot.items as item (item.id)}
          {@render itemCard(slot, item)}
        {/each}
      </div>
    {/each}
  {/if}
</section>

<style>
  .mtx-primary {
    background: var(--color-ember-500);
    color: white;
    transition: background-color 150ms ease, transform 150ms ease;
  }

  .mtx-primary:not(:disabled):hover { background: var(--color-ember-400); }
  .mtx-primary:not(:disabled):active { transform: translateY(1px); }

  .mtx-secondary {
    border: 1px solid rgb(188 167 125 / 0.4);
    color: var(--color-parchment-50);
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  button.mtx-secondary:not(:disabled):hover {
    border-color: var(--color-ember-400);
    background: rgb(123 29 24 / 0.2);
  }
</style>
