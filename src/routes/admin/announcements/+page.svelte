<script lang="ts">
  import { onMount } from 'svelte';

  import { getAnnouncementListeners, sendAnnouncement, type AnnouncementListeners } from '$lib/admin';
  import { ApiError } from '$lib/auth';

  let message = $state('');
  let sending = $state(false);
  let error = $state('');
  let notice = $state('');

  let audience = $state<AnnouncementListeners | null>(null);
  let audienceFailed = $state(false);

  // Never loaded and genuinely nobody look identical if only the number is
  // kept, and they mean opposite things: one is "do not send yet", the other is
  // "sending this reaches nobody".
  let audienceKnown = $derived(audience !== null);
  let reach = $derived(audience?.players ?? 0);

  // Two sockets for one account is somebody playing twice, not two people. Only
  // worth mentioning when the two numbers actually differ.
  let extraClients = $derived(audience ? audience.listeners - audience.players : 0);

  async function refreshAudience(): Promise<void> {
    try {
      audience = await getAnnouncementListeners();
      audienceFailed = false;
    } catch {
      // The last known figure is kept. A failed refresh is not evidence that
      // everybody left.
      audienceFailed = true;
    }
  }

  onMount(() => {
    let cancelled = false;

    void (async () => {
      if (!cancelled) await refreshAudience();
    })();

    const timer = setInterval(() => {
      if (!cancelled) void refreshAudience();
    }, 15_000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  });

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error
      ? value.message
      : 'An unexpected error occurred.';
  }

  async function send(): Promise<void> {
    error = '';
    notice = '';
    sending = true;
    try {
      const result = await sendAnnouncement(message);
      const recipients = result.recipientCount === 1 ? '1 connected client' : `${result.recipientCount} connected clients`;
      notice = result.recipientCount === 0
        ? 'Announcement sent, but no clients were connected to receive it.'
        : `Announcement sent to ${recipients}.`;
      message = '';
      await refreshAudience();
    } catch (value) {
      error = problemMessage(value);
    } finally {
      sending = false;
    }
  }
</script>

<svelte:head>
  <title>Send Announcements — D2R Reimagined</title>
</svelte:head>

<div class="mb-6">
  <h2 class="display-text mt-1 text-3xl text-parchment-50">Announcements</h2>
  <p class="mt-2 text-parchment-300">Send a message to every client currently connected to the announcements WebSocket.</p>
</div>

<div
  class="mb-5 flex flex-wrap items-center gap-3 rounded-lg border p-4 {audienceKnown && reach === 0
    ? 'border-requirement/45 bg-requirement/10'
    : 'border-parchment-300/20 bg-abyss-900/60'}"
>
  <span
    class="inline-block size-2.5 shrink-0 rounded-full {audienceKnown
      ? reach > 0
        ? 'bg-set'
        : 'bg-requirement'
      : 'bg-parchment-300/25'}"
    aria-hidden="true"
  ></span>
  {#if !audienceKnown}
    <p class="text-parchment-300">Checking who is connected…</p>
  {:else if reach === 0}
    <p class="text-parchment-200">
      <span class="text-parchment-50">Nobody is connected.</span>
      An announcement sent now would reach no one. Clients only appear here while the game is running with the
      announcements plugin loaded.
    </p>
  {:else}
    <p class="text-parchment-200">
      This would reach <span class="text-parchment-50">{reach.toLocaleString()}</span>
      {reach === 1 ? 'player' : 'players'}{#if extraClients > 0}<span class="text-parchment-300">
          ({audience?.listeners.toLocaleString()} clients — someone has the game open more than once)</span
        >{/if}.
    </p>
  {/if}
  {#if audienceFailed}
    <span class="text-xs text-parchment-300">Last count could not be refreshed.</span>
  {/if}
</div>

{#if error}<div class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
{#if notice}<div class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

<form class="panel max-w-3xl rounded-lg p-5 sm:p-7" onsubmit={(event) => { event.preventDefault(); void send(); }}>
  <label>
    <span class="mb-2 block text-sm text-parchment-200">Announcement message</span>
    <textarea
      class="field min-h-44 resize-y"
      required
      maxlength="2000"
      bind:value={message}
      placeholder="Enter the announcement clients should receive…"
    ></textarea>
  </label>

  <div class="mt-2 flex items-start justify-between gap-4 text-xs text-parchment-300">
    <p>Messages are delivered live and are not stored. Clients that are offline will not receive them.</p>
    <span class="shrink-0">{message.length.toLocaleString()} / 2,000</span>
  </div>

  <div class="mt-7 flex justify-end">
    <button
      class="rounded bg-ember-700 px-5 py-3 text-parchment-50 hover:bg-ember-500 disabled:cursor-wait disabled:opacity-60"
      type="submit"
      disabled={sending || message.trim().length === 0}
    >{sending
        ? 'Sending…'
        : audienceKnown && reach > 0
          ? `Send to ${reach.toLocaleString()} ${reach === 1 ? 'player' : 'players'}`
          : 'Send announcement'}</button>
  </div>
</form>

<section class="mt-6 max-w-3xl rounded-lg border border-parchment-300/20 bg-abyss-900/60 p-5 text-sm text-parchment-300">
  <h3 class="display-text text-lg text-parchment-50">WebSocket payload</h3>
  <p class="mt-2">Connected clients receive JSON containing <code>id</code>, <code>type</code>, <code>message</code>, and <code>sentAtUtc</code>.</p>
  <p class="mt-2">Endpoint: <code>/ws/announcements</code></p>
</section>
