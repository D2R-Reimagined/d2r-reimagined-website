<script lang="ts">
  import { sendAnnouncement } from '$lib/admin';
  import { ApiError } from '$lib/auth';

  let message = $state('');
  let sending = $state(false);
  let error = $state('');
  let notice = $state('');

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
      notice = `Announcement sent to ${recipients}.`;
      message = '';
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
    >{sending ? 'Sending…' : 'Send announcement'}</button>
  </div>
</form>

<section class="mt-6 max-w-3xl rounded-lg border border-parchment-300/20 bg-abyss-900/60 p-5 text-sm text-parchment-300">
  <h3 class="display-text text-lg text-parchment-50">WebSocket payload</h3>
  <p class="mt-2">Connected clients receive JSON containing <code>id</code>, <code>type</code>, <code>message</code>, and <code>sentAtUtc</code>.</p>
  <p class="mt-2">Endpoint: <code>/ws/announcements</code></p>
</section>
