<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { apiWebSocketUrl, authState, refreshProfile } from '$lib/auth';
  import { createGlobalChatClient, type GlobalChatState } from '$lib/global-chat';

  let chat = $state<GlobalChatState>({ status: 'connecting', messages: [], sending: false, error: '' });
  let draft = $state('');
  let followLatest = $state(true);
  let feed: HTMLDivElement;
  let client: ReturnType<typeof createGlobalChatClient> | undefined;

  async function scrollToLatest() {
    await tick();
    if (followLatest && feed) feed.scrollTop = feed.scrollHeight;
  }

  onMount(() => {
    client = createGlobalChatClient({
      // This also refreshes expired access tokens before each connection.
      authorize: async () => (await refreshProfile()).roles.includes('Admin'),
      connect: () => new WebSocket(apiWebSocketUrl('/ws/chat')),
      changed: state => { chat = state; void scrollToLatest(); },
      accepted: () => { draft = ''; }
    });
    client.start();
    return () => client?.stop();
  });
</script>

<svelte:head><title>Global chat | Administration</title></svelte:head>

<section class="panel rounded-lg p-5 sm:p-6">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 class="display-text text-2xl text-parchment-50">Global chat</h2>
      <p class="mt-2 text-sm text-parchment-300">Read and reply to the same global chat players use in game.</p>
    </div>
    <span role="status" class="rounded-full border border-parchment-300/20 px-3 py-1 text-sm text-parchment-300">
      {chat.status === 'connected' ? 'Connected' : chat.status === 'reconnecting' ? 'Reconnecting…' : chat.status === 'disconnected' ? 'Disconnected' : 'Connecting…'}
    </span>
  </div>

  <!-- The scrollable log must be focusable so keyboard users can read older messages. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div bind:this={feed} role="log" aria-label="Global chat messages" aria-live="polite" aria-relevant="additions" tabindex="0"
    onscroll={() => { followLatest = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 60; }}
    class="mt-5 h-[28rem] overflow-y-auto rounded-lg border border-parchment-300/20 bg-black/20 p-4">
    {#each chat.messages as message (message.messageId)}
      <div class="mb-4 break-words">
        <div class="flex flex-wrap items-baseline gap-x-3 text-sm">
          <span class="font-semibold text-ember-400">{message.displayName}</span>
          <time datetime={message.sentAtUtc} title={new Date(message.sentAtUtc).toLocaleString()} class="text-xs text-parchment-300">{new Date(message.sentAtUtc).toLocaleTimeString()}</time>
        </div>
        <p class="mt-1 whitespace-pre-wrap text-parchment-50">{message.message}</p>
      </div>
    {:else}
      <p class="text-sm text-parchment-300">{chat.status === 'connected' ? 'No recent messages. Start a conversation with the community.' : 'Waiting for recent messages…'}</p>
    {/each}
  </div>
  <div class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-parchment-300">
    <span>Recent messages only; this is not a permanent chat archive.</span>
    {#if !followLatest}<button type="button" class="text-ember-400 underline" onclick={() => { followLatest = true; void scrollToLatest(); }}>Jump to latest</button>{/if}
  </div>

  {#if chat.error}<p role="alert" class="mt-4 text-sm text-requirement">{chat.error}</p>{/if}
  <form class="mt-5" onsubmit={event => { event.preventDefault(); client?.send(draft); }}>
    <label for="global-message" class="block text-sm text-parchment-300">Message as {$authState.user?.displayName}</label>
    <div class="mt-2 flex flex-col gap-3 sm:flex-row">
      <input id="global-message" bind:value={draft} maxlength="500" disabled={chat.sending} autocomplete="off"
        placeholder="Message global chat…" class="min-w-0 flex-1 rounded-lg border border-parchment-300/30 bg-black/30 px-3 py-2 text-parchment-50 disabled:opacity-60" />
      <button type="submit" disabled={chat.status !== 'connected' || chat.sending || !draft.trim()}
        class="rounded-lg border border-ember-400/65 bg-ember-700/25 px-5 py-2 text-parchment-50 disabled:cursor-not-allowed disabled:opacity-50">{chat.sending ? 'Sending…' : 'Send'}</button>
    </div>
    <p class="mt-2 text-xs text-parchment-300">{draft.length}/500 · Enter to send. Messages are visible to players in global chat.</p>
  </form>
</section>
