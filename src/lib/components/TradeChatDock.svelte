<script lang="ts">
  import { onMount } from 'svelte';
  import { authState, initializeAuth } from '#lib/auth.js';
  import { connectTradeEvents, isTradeNotification, tradeEvent, tradeNotificationTitle, type TradeEvent } from '#lib/trade-realtime.js';
  import { tradeChatRequest } from '#lib/trade-chat.js';
  import {
    deleteTradeConversation,
    deleteTradeConversations,
    getTradeConversation,
    getTradeConversations,
    sendTradeMessage,
    startTradeConversation,
    type TradeConversation,
    type TradeConversationDeleteScope,
    type TradeConversationSummary,
    type TradeListingStatus
  } from '#lib/trades.js';
  import { formatChatTimestamp, formatLocalDateTime, formatUtcIso } from '#lib/utc-time.js';

  let open = $state(false);
  let conversations = $state<TradeConversationSummary[]>([]);
  let active = $state<TradeConversation | null>(null);
  let loading = $state(false);
  let sending = $state(false);
  let deletingId = $state<string | null>(null);
  let clearingScope = $state<TradeConversationDeleteScope | null>(null);
  let confirmingClearAll = $state(false);
  let message = $state('');
  let error = $state('');
  let now = $state(new Date());
  let disposed = false;
  let accountId: string | null = null;
  let stopConnection: (() => void) | undefined;
  let notifications = $state<TradeEvent[]>([]);
  let toast = $state<TradeEvent | null>(null);
  let messageList: HTMLDivElement | undefined = $state();

  let unread = $derived(conversations.reduce((total, conversation) => total + conversation.unreadCount, 0));
  let notificationCount = $derived(Math.max(unread, notifications.length));
  let closedCount = $derived(conversations.filter(isSummaryClosed).length);
  let otherName = $derived(
    active && $authState.user
      ? active.sellerId === $authState.user.id ? active.buyerDisplayName : active.sellerDisplayName
      : ''
  );

  function isClosedStatus(status: TradeListingStatus | undefined): boolean {
    return status === 'Completed' || status === 'Cancelled' || status === 'Expired';
  }

  function isSummaryClosed(conversation: TradeConversationSummary): boolean {
    return isClosedStatus(conversation.listingStatus)
      || (conversation.listingStatus === 'Reserved' && !conversation.isAcceptedTrade);
  }

  function statusLabel(status: TradeListingStatus | undefined, reservedForOther = false): string | null {
    if (!status || status === 'Active') return null;
    if (status === 'Reserved') return reservedForOther ? 'Reserved' : 'Pending';
    return status;
  }

  function statusBadgeClass(status: TradeListingStatus | undefined, reservedForOther = false): string {
    if (status === 'Reserved' && !reservedForOther) return 'border-amber-400/30 text-amber-200';
    return 'border-parchment-300/20 text-parchment-300';
  }

  function friendlyError(value: unknown): string {
    return value instanceof Error ? value.message : 'Trade chat is unavailable right now.';
  }

  function pruneDeletedConversationState(nextConversations: TradeConversationSummary[], clearAll = false): void {
    const remainingIds = new Set(nextConversations.map((entry) => entry.id));
    if (clearAll) {
      active = null;
      notifications = [];
      toast = null;
      return;
    }
    if (active && !remainingIds.has(active.id)) active = null;
    notifications = notifications.filter((entry) => !entry.conversationId || remainingIds.has(entry.conversationId));
    if (toast?.conversationId && !remainingIds.has(toast.conversationId)) toast = null;
  }

  async function loadSummaries(): Promise<TradeConversationSummary[] | null> {
    if (!$authState.user) return null;
    try {
      const owner = accountId;
      const result = await getTradeConversations();
      if (!disposed && owner === accountId) {
        now = new Date();
        conversations = result;
        if (result.length === 0) confirmingClearAll = false;
        return result;
      }
    } catch (value) {
      error = friendlyError(value);
    }
    return null;
  }

  async function openConversation(id: string): Promise<void> {
    if (loading || deletingId || clearingScope) return;
    loading = true;
    error = '';
    confirmingClearAll = false;
    const owner = accountId;
    try {
      const result = await getTradeConversation(id);
      if (disposed || owner !== accountId) return;
      now = new Date();
      active = result;
      notifications = notifications.filter((entry) => entry.type !== 'message_created' || entry.conversationId !== id);
      if (toast?.conversationId === id && toast.type === 'message_created') toast = null;
      open = true;
      await loadSummaries();
      requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight }));
    } catch (value) {
      error = friendlyError(value);
    } finally {
      if (!disposed && owner === accountId) loading = false;
    }
  }

  async function openListing(listingId: string): Promise<void> {
    if (!$authState.user) {
      window.location.assign(`/profile?returnTo=${encodeURIComponent(`/trade/${listingId}`)}`);
      return;
    }
    if (loading || deletingId || clearingScope) return;
    loading = true;
    error = '';
    confirmingClearAll = false;
    const owner = accountId;
    try {
      const result = await startTradeConversation(listingId);
      if (disposed || owner !== accountId) return;
      now = new Date();
      active = result;
      open = true;
      await loadSummaries();
    } catch (value) {
      error = friendlyError(value);
      open = true;
    } finally {
      if (!disposed && owner === accountId) loading = false;
    }
  }

  async function submitMessage(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const body = message.trim();
    if (!active || !body || sending) return;
    sending = true;
    error = '';
    const conversationId = active.id;
    const owner = accountId;
    try {
      const sent = await sendTradeMessage(conversationId, body);
      if (disposed || owner !== accountId || active?.id !== conversationId) return;
      now = new Date();
      if (active && !active.messages.some((entry) => entry.id === sent.id)) active = { ...active, messages: [...active.messages, sent] };
      message = '';
      await loadSummaries();
      requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' }));
    } catch (value) {
      error = friendlyError(value);
    } finally {
      sending = false;
    }
  }

  async function removeConversation(id: string): Promise<void> {
    if (loading || deletingId || clearingScope) return;
    deletingId = id;
    error = '';
    confirmingClearAll = false;
    const owner = accountId;
    try {
      await deleteTradeConversation(id);
      if (disposed || owner !== accountId) return;
      conversations = conversations.filter((entry) => entry.id !== id);
      if (active?.id === id) active = null;
      notifications = notifications.filter((entry) => entry.conversationId !== id);
      if (toast?.conversationId === id) toast = null;
      const refreshed = await loadSummaries();
      if (refreshed) pruneDeletedConversationState(refreshed);
    } catch (value) {
      error = friendlyError(value);
    } finally {
      if (!disposed && owner === accountId) deletingId = null;
    }
  }

  async function clearConversations(scope: TradeConversationDeleteScope): Promise<void> {
    if (loading || deletingId || clearingScope) return;
    clearingScope = scope;
    error = '';
    confirmingClearAll = false;
    const owner = accountId;
    try {
      await deleteTradeConversations(scope);
      if (disposed || owner !== accountId) return;
      const refreshed = await loadSummaries();
      if (refreshed) {
        pruneDeletedConversationState(refreshed, scope === 'all' && refreshed.length === 0);
      } else if (scope === 'all') {
        conversations = [];
        pruneDeletedConversationState([], true);
      }
    } catch (value) {
      error = friendlyError(value);
    } finally {
      if (!disposed && owner === accountId) clearingScope = null;
    }
  }

  async function handleEvent(event: TradeEvent): Promise<void> {
    tradeEvent.set(event);
    if (event.type === 'conversation_deleted') {
      if (event.conversationId) {
        if (active?.id === event.conversationId) active = null;
        notifications = notifications.filter((entry) => entry.conversationId !== event.conversationId);
        if (toast?.conversationId === event.conversationId) toast = null;
      }
      const refreshed = await loadSummaries();
      if (refreshed && !event.conversationId) pruneDeletedConversationState(refreshed);
      return;
    }
    if (isTradeNotification(event)) {
      notifications = [event, ...notifications].slice(0, 20);
      toast = event;
    }
    if (active && event.type === 'listing_deleted' && event.tradeListingId === active.listing.id) active = null;
    const id = active?.id;
    const owner = accountId;
    if (open && id && event.conversationId === id) {
      const result = await getTradeConversation(id).catch(() => null);
      if (!disposed && owner === accountId && open && active?.id === id && result) {
        now = new Date();
        active = result;
        notifications = notifications.filter((entry) => entry.type !== 'message_created' || entry.conversationId !== id);
        requestAnimationFrame(() => messageList?.scrollTo({ top: messageList.scrollHeight }));
      }
    }
    await loadSummaries();
  }

  function showNotification(event: TradeEvent): void {
    toast = null;
    notifications = notifications.filter((entry) => entry.eventId !== event.eventId);
    if (event.type === 'message_created' && event.conversationId) void openConversation(event.conversationId);
    else window.location.assign(`/trade/${encodeURIComponent(event.tradeListingId!)}`);
  }

  function toggleChat(): void {
    open = !open;
    confirmingClearAll = false;
    if (open && active) void openConversation(active.id);
  }

  onMount(() => {
    void initializeAuth();
    const clock = window.setInterval(() => {
      now = new Date();
    }, 60_000);

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
      const next = state.user?.id ?? null;
      if (next === accountId) return;
      stopConnection?.();
      accountId = next;
      conversations = [];
      active = null;
      notifications = [];
      toast = null;
      loading = false;
      deletingId = null;
      clearingScope = null;
      confirmingClearAll = false;
      tradeEvent.set(null);
      open = false;
      if (next) stopConnection = connectTradeEvents(next, (event) => void handleEvent(event), () => void loadSummaries());
    });

    return () => {
      disposed = true;
      window.clearInterval(clock);
      unsubscribeRequest();
      unsubscribeAuth();
      stopConnection?.();
    };
  });
</script>

{#if $authState.user}
  {#if toast && !open}
    <div role="status" class="fixed bottom-20 right-3 z-[75] w-[min(24rem,calc(100vw-1.5rem))] rounded-lg border border-ember-400/50 bg-[#171514] p-4 shadow-xl">
      <button type="button" aria-label="Dismiss trade notification" class="float-right ml-2 text-parchment-300" onclick={() => toast = null}>×</button>
      <button type="button" class="block w-full text-left" onclick={() => toast && showNotification(toast)}>
        <strong class="block text-sm text-ember-300">{tradeNotificationTitle(toast)}</strong>
        <span class="mt-2 line-clamp-3 block break-words text-sm text-parchment-100">{toast.preview}</span>
        <span class="mt-2 block text-xs text-parchment-300">Open trade →</span>
      </button>
    </div>
  {/if}
  <aside class:trade-chat-open={open} class="trade-chat-dock" aria-label="Trade conversations">
    <button type="button" class="trade-chat-header" aria-expanded={open} onclick={toggleChat}>
      <span class="flex items-center gap-2">
        <span class="relative grid h-7 w-7 place-items-center rounded-full border border-ember-400/50 bg-ember-950/40" aria-hidden="true">✦</span>
        <span>
          <strong class="display-text block text-sm text-parchment-50">Trade notifications</strong>
          <span class="block text-[0.68rem] text-parchment-300">{active ? `${otherName} · ${active.listing.itemName}` : `${conversations.length} conversations`}</span>
        </span>
      </span>
      <span class="flex items-center gap-2">
        {#if notificationCount}<span class="rounded-full bg-ember-500 px-2 py-0.5 text-xs font-bold text-white">{notificationCount}</span>{/if}
        <span aria-hidden="true">{open ? '×' : '⌃'}</span>
      </span>
    </button>

    {#if open}
      <div class="trade-chat-body">
        {#if notifications.length}
          <div class="max-h-36 shrink-0 overflow-y-auto border-b border-parchment-300/15" aria-label="Recent trade notifications">
            {#each notifications as notification (notification.eventId)}
              <button type="button" class="block w-full border-b border-parchment-300/10 p-3 text-left hover:bg-white/5" onclick={() => showNotification(notification)}>
                <strong class="block truncate text-xs text-ember-300">{tradeNotificationTitle(notification)}</strong>
                <span class="block truncate text-xs text-parchment-100">{notification.preview}</span>
              </button>
            {/each}
          </div>
        {/if}
        {#if error}<p role="alert" class="border-b border-red-500/25 bg-red-950/50 px-3 py-2 text-xs text-red-200">{error}</p>{/if}
        {#if active}
          {@const activeReservedOther = active.listing.status === 'Reserved' && active.listing.buyerId !== active.buyerId}
          {@const activeBadge = statusLabel(active.listing.status, activeReservedOther)}
          <div class="flex items-center gap-2.5 border-b border-parchment-300/15 px-3 py-2">
            <button type="button" aria-label="Back to conversations" class="rounded px-2 py-1 text-parchment-300 hover:bg-white/5 hover:text-white" onclick={() => active = null}>‹</button>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-parchment-50">{otherName}</p>
              <a href={`/trade/${active.listing.id}`} class="block truncate text-xs text-ember-400 hover:text-ember-300">{active.listing.itemName}</a>
            </div>
            {#if activeBadge}<span class={`rounded border px-2 py-0.5 text-[0.65rem] uppercase tracking-wider ${statusBadgeClass(active.listing.status, activeReservedOther)}`}>{activeBadge}</span>{/if}
            <button
              type="button"
              disabled={loading || deletingId === active.id || clearingScope !== null}
              aria-label={`Delete chat with ${otherName}`}
              title="Delete chat"
              class="rounded border border-parchment-300/20 px-2 py-0.5 text-[0.68rem] text-parchment-300 transition hover:border-red-400/40 hover:bg-red-950/35 hover:text-red-200 disabled:opacity-40"
              onclick={() => active && removeConversation(active.id)}
            >
              {deletingId === active.id ? 'Deleting…' : 'Delete'}
            </button>
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
              {@const stamp = formatChatTimestamp(entry.createdAtUtc, now)}
              <div class:ml-auto={mine} class="max-w-[82%]">
                <p class={`mb-1 flex items-baseline gap-1.5 text-[0.65rem] ${mine ? 'justify-end text-ember-400' : 'text-parchment-300'}`}>
                  <span>{mine ? 'You' : entry.authorDisplayName}</span>
                  {#if stamp}
                    <span aria-hidden="true" class="text-parchment-300/55">·</span>
                    <time datetime={formatUtcIso(entry.createdAtUtc)} title={formatLocalDateTime(entry.createdAtUtc)} class="text-parchment-300/80">{stamp}</time>
                  {/if}
                </p>
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
          {#if conversations.length > 0}
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-300/15 bg-black/25 px-3 py-2 text-[0.7rem]">
              {#if confirmingClearAll}
                <span class="text-parchment-200">Delete all {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}?</span>
                <span class="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={clearingScope !== null}
                    class="rounded border border-red-400/45 bg-red-950/40 px-2 py-0.5 text-red-200 hover:bg-red-900/50 disabled:opacity-40"
                    onclick={() => clearConversations('all')}
                  >
                    {clearingScope === 'all' ? 'Clearing…' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    disabled={clearingScope !== null}
                    class="rounded border border-parchment-300/20 px-2 py-0.5 text-parchment-300 hover:text-white"
                    onclick={() => confirmingClearAll = false}
                  >
                    Cancel
                  </button>
                </span>
              {:else}
                <span class="text-parchment-300">{conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}</span>
                <span class="flex items-center gap-1.5">
                  {#if closedCount > 0}
                    <button
                      type="button"
                      disabled={loading || clearingScope !== null || deletingId !== null}
                      class="rounded border border-parchment-300/20 px-2 py-0.5 text-parchment-200 transition hover:border-ember-400/45 hover:text-white disabled:opacity-40"
                      onclick={() => clearConversations('closed')}
                    >
                      {clearingScope === 'closed' ? 'Clearing…' : `Clear closed (${closedCount})`}
                    </button>
                  {/if}
                  <button
                    type="button"
                    disabled={loading || clearingScope !== null || deletingId !== null}
                    class="rounded border border-parchment-300/20 px-2 py-0.5 text-parchment-300 transition hover:border-red-400/40 hover:text-red-200 disabled:opacity-40"
                    onclick={() => confirmingClearAll = true}
                  >
                    Clear all
                  </button>
                </span>
              {/if}
            </div>
          {/if}
          <div class="min-h-0 flex-1 overflow-y-auto">
            {#if conversations.length === 0}
              <div class="px-6 py-12 text-center">
                <p class="display-text text-lg text-parchment-50">No trade chats yet</p>
                <p class="mt-2 text-xs leading-5 text-parchment-300">Message a seller or accept an offer and the conversation will appear here.</p>
                <a href="/trade" class="mt-4 inline-block text-sm text-ember-400 hover:text-ember-300">Browse trades</a>
              </div>
            {:else}
              {#each conversations as conversation (conversation.id)}
                {@const activityAt = conversation.lastMessageAtUtc ?? conversation.createdAtUtc}
                {@const stamp = formatChatTimestamp(activityAt, now)}
                {@const reservedForOther = conversation.listingStatus === 'Reserved' && !conversation.isAcceptedTrade}
                {@const rowBadge = statusLabel(conversation.listingStatus, reservedForOther)}
                <div class="group flex items-stretch border-b border-parchment-300/10 hover:bg-white/[0.035]">
                  <button
                    type="button"
                    disabled={deletingId === conversation.id || clearingScope !== null}
                    class="flex min-w-0 flex-1 gap-3 px-3 py-3 text-left disabled:opacity-50"
                    onclick={() => openConversation(conversation.id)}
                  >
                    <span class="display-text grid h-9 w-9 shrink-0 place-items-center rounded-full border border-parchment-300/25 bg-black/40 text-parchment-50">{conversation.otherUserDisplayName.slice(0, 1).toUpperCase()}</span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center justify-between gap-2">
                        <strong class="truncate text-sm text-parchment-50">{conversation.otherUserDisplayName}</strong>
                        <span class="flex shrink-0 items-center gap-1.5">
                          {#if stamp}
                            <time datetime={formatUtcIso(activityAt)} title={formatLocalDateTime(activityAt)} class="text-[0.65rem] text-parchment-300/80">{stamp}</time>
                          {/if}
                          {#if conversation.unreadCount}<span class="rounded-full bg-ember-500 px-1.5 text-[0.65rem] font-bold text-white">{conversation.unreadCount}</span>{/if}
                        </span>
                      </span>
                      <span class="mt-0.5 flex items-center gap-1.5">
                        <span class="truncate text-xs text-ember-400">{conversation.itemName}</span>
                        {#if rowBadge}<span class={`shrink-0 rounded border px-1.5 py-px text-[0.58rem] uppercase tracking-wider ${statusBadgeClass(conversation.listingStatus, reservedForOther)}`}>{rowBadge}</span>{/if}
                      </span>
                      <span class="mt-0.5 block truncate text-xs text-parchment-300">{conversation.lastMessage || 'Conversation ready'}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={loading || deletingId === conversation.id || clearingScope !== null}
                    aria-label={`Delete chat with ${conversation.otherUserDisplayName}`}
                    title="Delete chat"
                    class="shrink-0 px-2.5 text-sm text-parchment-300/60 transition hover:bg-red-950/35 hover:text-red-200 focus-visible:bg-red-950/35 focus-visible:text-red-200 disabled:opacity-40"
                    onclick={() => removeConversation(conversation.id)}
                  >
                    ×
                  </button>
                </div>
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
