<script lang="ts">
  import { onMount } from 'svelte';
  import { apiWebSocketUrl, authState, initializeAuth } from '$lib/auth';
  import { tradeChatRequest } from '$lib/trade-chat';
  import {
    getTradeConversation,
    getTradeConversations,
    sendTradeMessage,
    startTradeConversation,
    type TradeConversation,
    type TradeConversationSummary
  } from '$lib/trades';

  let open = $state(false);
  let conversations = $state<TradeConversationSummary[]>([]);
  let active = $state<TradeConversation | null>(null);
  let loading = $state(false);
  let sending = $state(false);
  let message = $state('');
  let error = $state('');
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  let messageList: HTMLDivElement | undefined = $state();

  let unread = $derived(conversations.reduce((total, conversation) => total + conversation.unreadCount, 0));
  let otherName = $derived(
    active && $authState.user
      ? active.sellerId === $authState.user.id ? active.buyerDisplayName : active.sellerDisplayName
      : ''
  );

  function friendlyError(value: unknown): string {
    return value instanceof Error ? value.message : 'Trade chat is unavailable right now.';
  }

  async function loadSummaries(): Promise<void> {
    if (!$authState.user) return;
    try {
      conversations = await getTradeConversations();
    } catch (value) {
      error = friendlyError(value);
    }
  }

  async function openConversation(id: string): Promise<void> {
    if (loading) return;
    loading = true;
    error = '';
    try {
      active = await getTradeConversation(id);
      open = true;
      await loadSummaries();
      requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight }));
    } catch (value) {
      error = friendlyError(value);
    } finally {
      loading = false;
    }
  }

  async function openListing(listingId: string): Promise<void> {
    if (!$authState.user) {
      window.location.assign(`/profile?returnTo=${encodeURIComponent(`/trade/${listingId}`)}`);
      return;
    }
    loading = true;
    error = '';
    try {
      active = await startTradeConversation(listingId);
      open = true;
      await loadSummaries();
    } catch (value) {
      error = friendlyError(value);
      open = true;
    } finally {
      loading = false;
    }
  }

  async function submitMessage(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const body = message.trim();
    if (!active || !body || sending) return;
    sending = true;
    error = '';
    try {
      const sent = await sendTradeMessage(active.id, body);
      active = { ...active, messages: [...active.messages, sent] };
      message = '';
      await loadSummaries();
      requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' }));
    } catch (value) {
      error = friendlyError(value);
    } finally {
      sending = false;
    }
  }

  function connect(): void {
    if (disposed || !$authState.user || socket) return;
    socket = new WebSocket(apiWebSocketUrl('/ws/trades'));
    socket.onmessage = async (event) => {
      const payload = JSON.parse(String(event.data)) as { conversationId?: string };
      await loadSummaries();
      if (active && payload.conversationId === active.id) {
        active = await getTradeConversation(active.id).catch(() => active);
        requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight }));
      }
    };
    socket.onclose = () => {
      socket = null;
      if (!disposed && $authState.user) reconnectTimer = setTimeout(connect, 2500);
    };
    socket.onerror = () => socket?.close();
  }

  onMount(() => {
    void initializeAuth().then(async () => {
      if ($authState.user) {
        await loadSummaries();
        connect();
      }
    });

    let requestSubscriptionReady = false;
    const unsubscribeRequest = tradeChatRequest.subscribe((request) => {
      if (!requestSubscriptionReady) {
        requestSubscriptionReady = true;
        return;
      }
      if (!request.nonce) return;
      if (request.conversationId) void openConversation(request.conversationId);
      else if (request.listingId) void openListing(request.listingId);
      else open = true;
    });
    const unsubscribeAuth = authState.subscribe((state) => {
      if (state.user) connect();
      else {
        socket?.close();
        socket = null;
        conversations = [];
        active = null;
      }
    });

    return () => {
      disposed = true;
      unsubscribeRequest();
      unsubscribeAuth();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  });
</script>

{#if $authState.user}
  <aside class:trade-chat-open={open} class="trade-chat-dock" aria-label="Trade conversations">
    <button type="button" class="trade-chat-header" aria-expanded={open} onclick={() => open = !open}>
      <span class="flex items-center gap-2">
        <span class="relative grid h-7 w-7 place-items-center rounded-full border border-ember-400/50 bg-ember-950/40" aria-hidden="true">✦</span>
        <span>
          <strong class="display-text block text-sm text-parchment-50">Trade chat</strong>
          <span class="block text-[0.68rem] text-parchment-300">{active ? `${otherName} · ${active.listing.itemName}` : `${conversations.length} conversations`}</span>
        </span>
      </span>
      <span class="flex items-center gap-2">
        {#if unread}<span class="rounded-full bg-ember-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>{/if}
        <span aria-hidden="true">{open ? '×' : '⌃'}</span>
      </span>
    </button>

    {#if open}
      <div class="trade-chat-body">
        {#if error}<p role="alert" class="border-b border-red-500/25 bg-red-950/50 px-3 py-2 text-xs text-red-200">{error}</p>{/if}
        {#if active}
          <div class="flex items-center gap-3 border-b border-parchment-300/15 px-3 py-2">
            <button type="button" aria-label="Back to conversations" class="rounded px-2 py-1 text-parchment-300 hover:bg-white/5 hover:text-white" onclick={() => active = null}>‹</button>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-parchment-50">{otherName}</p>
              <a href={`/trade/${active.listing.id}`} class="block truncate text-xs text-ember-400 hover:text-ember-300">{active.listing.itemName}</a>
            </div>
            {#if active.listing.status === 'Reserved'}<span class="rounded border border-amber-400/30 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-amber-200">Pending</span>{/if}
          </div>

          <div bind:this={messageList} class="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-live="polite">
            {#if loading && active.messages.length === 0}<p class="text-center text-xs text-parchment-300">Loading messages…</p>{/if}
            {#if active.messages.length === 0}
              <div class="mx-auto mt-8 max-w-60 text-center">
                <p class="display-text text-parchment-50">Start the trade</p>
                <p class="mt-2 text-xs leading-5 text-parchment-300">Coordinate an in-game meetup here. Accepted offers keep this conversation tied to the reserved item.</p>
              </div>
            {/if}
            {#each active.messages as entry (entry.id)}
              {@const mine = entry.authorId === $authState.user.id}
              <div class:ml-auto={mine} class="max-w-[82%]">
                <p class={`mb-1 text-[0.65rem] ${mine ? 'text-right text-ember-400' : 'text-parchment-300'}`}>{mine ? 'You' : entry.authorDisplayName}</p>
                <div class={`rounded-lg px-3 py-2 text-sm leading-5 ${mine ? 'bg-ember-700/45 text-parchment-50' : 'border border-parchment-300/15 bg-black/35 text-parchment-100'}`}>{entry.body}</div>
              </div>
            {/each}
          </div>

          <form class="border-t border-parchment-300/15 p-3" onsubmit={submitMessage}>
            <div class="flex gap-2">
              <input aria-label="Trade message" maxlength="2000" class="field min-w-0 flex-1 !py-2 text-sm" placeholder="Message {otherName}…" bind:value={message} />
              <button type="submit" disabled={sending || !message.trim()} class="rounded border border-ember-400/50 bg-ember-700/30 px-3 text-sm text-parchment-50 hover:bg-ember-700/50 disabled:opacity-40">Send</button>
            </div>
          </form>
        {:else}
          <div class="min-h-0 flex-1 overflow-y-auto">
            {#if conversations.length === 0}
              <div class="px-6 py-12 text-center">
                <p class="display-text text-lg text-parchment-50">No trade chats yet</p>
                <p class="mt-2 text-xs leading-5 text-parchment-300">Message a seller or accept an offer and the conversation will appear here.</p>
                <a href="/trade" class="mt-4 inline-block text-sm text-ember-400 hover:text-ember-300">Browse trades</a>
              </div>
            {:else}
              {#each conversations as conversation (conversation.id)}
                <button type="button" class="flex w-full gap-3 border-b border-parchment-300/10 px-3 py-3 text-left hover:bg-white/[0.035]" onclick={() => openConversation(conversation.id)}>
                  <span class="display-text grid h-9 w-9 shrink-0 place-items-center rounded-full border border-parchment-300/25 bg-black/40 text-parchment-50">{conversation.otherUserDisplayName.slice(0, 1).toUpperCase()}</span>
                  <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2">
                      <strong class="truncate text-sm text-parchment-50">{conversation.otherUserDisplayName}</strong>
                      {#if conversation.unreadCount}<span class="rounded-full bg-ember-500 px-1.5 text-[0.65rem] font-bold">{conversation.unreadCount}</span>{/if}
                    </span>
                    <span class="block truncate text-xs text-ember-400">{conversation.itemName}</span>
                    <span class="mt-0.5 block truncate text-xs text-parchment-300">{conversation.lastMessage || 'Conversation ready'}</span>
                  </span>
                </button>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </aside>
{/if}

<style>
  .trade-chat-dock {
    position: fixed;
    right: 1rem;
    bottom: 0;
    z-index: 70;
    width: min(24rem, calc(100vw - 1.5rem));
    overflow: hidden;
    border: 1px solid rgb(188 167 125 / 0.3);
    border-bottom: 0;
    border-radius: 0.65rem 0.65rem 0 0;
    background: #0d0d0e;
    box-shadow: 0 -12px 45px rgb(0 0 0 / 0.55);
  }
  .trade-chat-header { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 0.8rem; text-align: left; }
  .trade-chat-body { display: flex; height: min(31rem, calc(100vh - 7rem)); flex-direction: column; border-top: 1px solid rgb(188 167 125 / 0.16); background: #111010; }
  @media (max-width: 640px) {
    .trade-chat-dock { right: 0.5rem; width: calc(100vw - 1rem); }
    .trade-chat-body { height: min(34rem, calc(100vh - 6.5rem)); }
  }
</style>
