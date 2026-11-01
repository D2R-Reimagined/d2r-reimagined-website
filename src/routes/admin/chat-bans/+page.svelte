<script lang="ts">
  import { onMount } from 'svelte';

  import {
    getChatTimeouts,
    liftChatTimeout,
    searchChatBans,
    timeOutChatUser,
    updateChatBan,
    type ChatBanUser,
    type ChatTimeout
  } from '#lib/admin.js';
  import { ApiError, authState } from '#lib/auth.js';

  type Filter = 'timedOut' | 'banned' | 'all';
  type Action = 'ban' | 'timeout' | 'lift';

  const pageSize = 25;
  const durations = [
    { minutes: 10, label: '10 minutes' },
    { minutes: 60, label: '1 hour' },
    { minutes: 360, label: '6 hours' },
    { minutes: 1440, label: '24 hours' },
    { minutes: 4320, label: '3 days' },
    { minutes: 10080, label: '7 days' },
    { minutes: 43200, label: '30 days' }
  ];

  let users = $state<ChatBanUser[]>([]);
  let total = $state(0);
  let skip = $state(0);
  let searchInput = $state('');
  let appliedSearch = $state('');
  let filter = $state<Filter>('timedOut');
  let loading = $state(true);
  let error = $state('');
  let notice = $state('');
  let editing = $state<{ userId: string; action: Action } | null>(null);
  let reason = $state('');
  let durationMinutes = $state(60);
  let saving = $state(false);
  let historyUserId = $state<string | null>(null);
  let history = $state<ChatTimeout[]>([]);
  let historyLoading = $state(false);
  let requestSequence = 0;
  let historySequence = 0;

  let isAdmin = $derived($authState.user?.roles.includes('Admin') ?? false);
  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  // Moderators handle players; acting on staff is an admin's call (the API enforces this too).
  function lockedReason(user: ChatBanUser): string | null {
    if (user.id === $authState.user?.id) return 'Your account';
    if (!isAdmin && user.staffRoles.length > 0) return 'Staff · admins only';
    return null;
  }

  function isTimedOut(user: ChatBanUser): boolean {
    return user.timedOutUntilUtc !== null && new Date(user.timedOutUntilUtc).getTime() > Date.now();
  }

  // "2 days 3 hours", "5 hours 12 minutes", "1 minute".
  function formatSpan(milliseconds: number): string {
    const minutes = Math.max(1, Math.ceil(milliseconds / 60000));
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const rest = minutes % 60;
    const unit = (count: number, name: string) => `${count} ${name}${count === 1 ? '' : 's'}`;
    if (days > 0) return hours > 0 ? `${unit(days, 'day')} ${unit(hours, 'hour')}` : unit(days, 'day');
    if (hours > 0) return rest > 0 ? `${unit(hours, 'hour')} ${unit(rest, 'minute')}` : unit(hours, 'hour');
    return unit(rest, 'minute');
  }

  function formatTime(value: string): string {
    return new Date(value).toLocaleString();
  }

  function timeoutStatus(timeout: ChatTimeout): string {
    if (timeout.active) return `Active · ${formatSpan(new Date(timeout.expiresAtUtc).getTime() - Date.now())} left`;
    if (timeout.liftedAtUtc) {
      return `Ended early ${formatTime(timeout.liftedAtUtc)}${timeout.liftedByDisplayName ? ` by ${timeout.liftedByDisplayName}` : ''}${timeout.liftReason ? `: ${timeout.liftReason}` : ''}`;
    }
    return `Expired ${formatTime(timeout.expiresAtUtc)}`;
  }

  async function loadUsers(nextSkip = skip): Promise<void> {
    const sequence = ++requestSequence;
    loading = true;
    error = '';
    try {
      const response = await searchChatBans({
        skip: nextSkip,
        count: pageSize,
        search: appliedSearch,
        bannedOnly: filter === 'banned',
        timedOutOnly: filter === 'timedOut'
      });
      if (sequence !== requestSequence) return;
      users = response.items;
      total = response.total;
      skip = response.skip;
    } catch (value) {
      if (sequence !== requestSequence) return;
      error = problemMessage(value);
    } finally {
      if (sequence === requestSequence) loading = false;
    }
  }

  async function loadHistory(userId: string): Promise<void> {
    const sequence = ++historySequence;
    historyLoading = true;
    try {
      const timeouts = await getChatTimeouts(userId);
      if (sequence === historySequence) history = timeouts;
    } catch (value) {
      if (sequence === historySequence) error = problemMessage(value);
    } finally {
      if (sequence === historySequence) historyLoading = false;
    }
  }

  function toggleHistory(user: ChatBanUser): void {
    if (historyUserId === user.id) {
      historyUserId = null;
      return;
    }
    historyUserId = user.id;
    history = [];
    void loadHistory(user.id);
  }

  function submitSearch(): void {
    appliedSearch = searchInput.trim();
    notice = '';
    editing = null;
    historyUserId = null;
    void loadUsers(0);
  }

  function startEditing(user: ChatBanUser, action: Action): void {
    editing = editing?.userId === user.id && editing.action === action ? null : { userId: user.id, action };
    reason = '';
    durationMinutes = 60;
    error = '';
  }

  function replace(updated: ChatBanUser): void {
    users = users.map((entry) => entry.id === updated.id ? updated : entry);
  }

  async function save(user: ChatBanUser, action: Action): Promise<void> {
    if (saving || !reason.trim()) return;
    saving = true;
    error = '';
    notice = '';
    try {
      if (action === 'ban') {
        const banned = !user.globalChatBanned;
        replace(await updateChatBan(user.id, banned, reason.trim()));
        notice = banned
          ? `${user.displayName} is banned from global chat.`
          : `${user.displayName} can use global chat again.`;
      } else if (action === 'timeout') {
        const timeout = await timeOutChatUser(user.id, durationMinutes, reason.trim());
        replace({ ...user, timedOutUntilUtc: timeout.expiresAtUtc, timeoutCount: user.timeoutCount + 1 });
        notice = `${user.displayName} is timed out from global chat for ${formatSpan(durationMinutes * 60000)}.`;
      } else {
        await liftChatTimeout(user.id, reason.trim());
        replace({ ...user, timedOutUntilUtc: null });
        notice = `${user.displayName}'s timeout has ended.`;
      }
      editing = null;
      if (action !== 'ban' && historyUserId === user.id) void loadHistory(user.id);
    } catch (value) {
      error = problemMessage(value);
    } finally {
      saving = false;
    }
  }

  function submitLabel(user: ChatBanUser, action: Action): string {
    if (saving) return 'Saving…';
    if (action === 'timeout') return `Time out ${user.displayName} for ${formatSpan(durationMinutes * 60000)}`;
    if (action === 'lift') return `End ${user.displayName}'s timeout`;
    return user.globalChatBanned ? `Lift ${user.displayName}'s ban` : `Ban ${user.displayName}`;
  }

  onMount(() => { void loadUsers(0); });
</script>

<svelte:head>
  <title>Chat moderation | Administration</title>
</svelte:head>

<div class="mb-6">
  <h2 class="display-text mt-1 text-3xl text-parchment-50">Global chat moderation</h2>
  <p class="mt-2 text-parchment-300">A <span class="text-parchment-50">timeout</span> stops a player sending to global chat and whispering until it ends on its own; a <span class="text-parchment-50">ban</span> stops global chat until it is lifted. Either way they can still read global chat. Search by display name, character name, or user ID.</p>
  <p class="mt-2 text-sm text-parchment-300">Slurs in global chat are never shown to other players: the sender is timed out for 24 hours automatically, and the line appears in their history so you can review it.</p>
</div>

{#if error}<div role="alert" class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
{#if notice}<div role="status" class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

<form class="panel mb-5 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end" onsubmit={(event) => { event.preventDefault(); submitSearch(); }}>
  <label class="min-w-0 flex-1 text-sm text-parchment-300">
    Search players
    <input
      class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50 placeholder:text-parchment-300/60"
      type="search"
      maxlength="100"
      placeholder="Display name, character, or user ID"
      bind:value={searchInput}
    />
  </label>
  <label class="text-sm text-parchment-300">
    Show
    <select bind:value={filter} onchange={submitSearch}
      class="mt-2 block rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50">
      <option value="timedOut">Timed out now</option>
      <option value="banned">Banned</option>
      <option value="all">All players</option>
    </select>
  </label>
  <button class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50" type="submit" disabled={loading}>Search</button>
</form>

{#if loading && users.length === 0}
  <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading players…</div>
{:else}
  <section class:opacity-60={loading} class="panel rounded-lg p-5 transition-opacity sm:p-7" aria-busy={loading}>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-parchment-300">
      <p><span class="text-parchment-50">{total}</span> {filter === 'banned' ? 'banned ' : filter === 'timedOut' ? 'timed-out ' : ''}{total === 1 ? 'player' : 'players'}{appliedSearch ? ` matching “${appliedSearch}”` : ''}</p>
      {#if total > 0}<p>Page {currentPage} of {pageCount}</p>{/if}
    </div>
    <ul class="divide-y divide-parchment-300/10">
      {#each users as user (user.id)}
        {@const locked = lockedReason(user)}
        {@const timedOut = isTimedOut(user)}
        <li class="py-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-parchment-50">
                {user.displayName}
                {#each user.staffRoles as role}<span class="ml-2 rounded-full border border-parchment-300/30 px-2 text-xs text-parchment-300">{role}</span>{/each}
                {#if user.timeoutCount > 0}
                  <span class={`ml-2 rounded-full border px-2 text-xs ${user.timeoutCount >= 3 ? 'border-requirement/60 text-requirement' : 'border-parchment-300/30 text-parchment-300'}`}>
                    {user.timeoutCount} {user.timeoutCount === 1 ? 'timeout' : 'timeouts'} on record
                  </span>
                {/if}
              </p>
              <p class={`mt-1 text-sm ${user.globalChatBanned ? 'text-requirement' : 'text-parchment-300'}`}>{user.globalChatBanned ? 'Banned from global chat' : 'Not banned'}</p>
              {#if timedOut && user.timedOutUntilUtc}
                <p class="mt-1 text-sm text-requirement">Timed out until {formatTime(user.timedOutUntilUtc)} ({formatSpan(new Date(user.timedOutUntilUtc).getTime() - Date.now())} left)</p>
              {/if}
              {#if user.updatedAtUtc}
                <p class="mt-1 break-words text-xs text-parchment-300">
                  {user.globalChatBanned ? 'Banned' : 'Ban lifted'} {formatTime(user.updatedAtUtc)}{user.updatedByDisplayName ? ` by ${user.updatedByDisplayName}` : ''}: {user.reason}
                </p>
              {/if}
            </div>
            <div class="flex flex-wrap items-center gap-2">
              {#if locked}
                <span class="text-xs text-parchment-300">{locked}</span>
              {:else}
                <button type="button" disabled={saving || loading} onclick={() => startEditing(user, 'timeout')}
                  class="rounded border border-requirement/60 px-3 py-1.5 text-sm text-requirement disabled:opacity-50">
                  {timedOut ? 'Change timeout' : 'Time out'}
                </button>
                {#if timedOut}
                  <button type="button" disabled={saving || loading} onclick={() => startEditing(user, 'lift')}
                    class="rounded border border-parchment-300/30 px-3 py-1.5 text-sm text-parchment-50 disabled:opacity-50">End timeout</button>
                {/if}
                <button type="button" disabled={saving || loading} onclick={() => startEditing(user, 'ban')}
                  class={`rounded border px-3 py-1.5 text-sm disabled:opacity-50 ${user.globalChatBanned ? 'border-parchment-300/30 text-parchment-50' : 'border-requirement/60 text-requirement'}`}>
                  {user.globalChatBanned ? 'Lift ban' : 'Ban'}
                </button>
              {/if}
              <button type="button" onclick={() => toggleHistory(user)} aria-expanded={historyUserId === user.id}
                class="rounded border border-parchment-300/30 px-3 py-1.5 text-sm text-parchment-300">
                {historyUserId === user.id ? 'Hide history' : 'History'}
              </button>
            </div>
          </div>
          {#if editing?.userId === user.id}
            {@const action = editing.action}
            <form class="mt-3 rounded border border-parchment-300/20 bg-black/30 p-4" onsubmit={(event) => { event.preventDefault(); void save(user, action); }}>
              <fieldset disabled={saving} class="space-y-3">
                {#if action === 'timeout'}
                  <label class="block text-sm text-parchment-300">Length
                    <select bind:value={durationMinutes}
                      class="mt-2 block rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50">
                      {#each durations as duration}<option value={duration.minutes}>{duration.label}</option>{/each}
                    </select>
                  </label>
                  {#if timedOut}<p class="text-xs text-parchment-300">This replaces the current timeout and starts the new length from now.</p>{/if}
                {/if}
                <label class="block text-sm text-parchment-300">Reason (staff only)
                  <textarea required maxlength="1000" rows="2" bind:value={reason}
                    class="mt-2 block w-full rounded border border-parchment-300/25 bg-black/40 px-3 py-2 text-parchment-50"></textarea>
                </label>
                <div class="flex gap-3">
                  <button type="submit" disabled={!reason.trim()} class="rounded border border-ember-400 px-4 py-2 text-parchment-50 disabled:opacity-50">
                    {submitLabel(user, action)}
                  </button>
                  <button type="button" onclick={() => { editing = null; }} class="rounded border border-parchment-300/30 px-4 py-2 text-parchment-300">Cancel</button>
                </div>
              </fieldset>
            </form>
          {/if}
          {#if historyUserId === user.id}
            <div class="mt-3 rounded border border-parchment-300/20 bg-black/30 p-4" aria-busy={historyLoading}>
              <h3 class="text-sm text-parchment-50">Timeout history</h3>
              {#if historyLoading && history.length === 0}
                <p class="mt-2 text-sm text-parchment-300">Loading…</p>
              {:else if history.length === 0}
                <p class="mt-2 text-sm text-parchment-300">No timeouts on record.</p>
              {:else}
                <ol class="mt-2 space-y-3">
                  {#each history as timeout (timeout.id)}
                    <li class="border-l-2 pl-3 text-sm {timeout.active ? 'border-requirement/70' : 'border-parchment-300/20'}">
                      <p class="text-parchment-50">
                        {formatSpan(new Date(timeout.expiresAtUtc).getTime() - new Date(timeout.createdAtUtc).getTime())}
                        <span class="text-parchment-300">· {formatTime(timeout.createdAtUtc)} · {timeout.source === 'Automatic' ? 'Automatic' : `by ${timeout.issuedByDisplayName ?? 'unknown staff'}`}</span>
                      </p>
                      <p class="mt-0.5 break-words text-parchment-300">{timeout.reason}</p>
                      {#if timeout.messageText}
                        <p class="mt-1 break-words rounded bg-black/40 px-2 py-1 font-mono text-xs text-parchment-300">“{timeout.messageText}”</p>
                      {/if}
                      <p class={`mt-0.5 text-xs ${timeout.active ? 'text-requirement' : 'text-parchment-300'}`}>{timeoutStatus(timeout)}</p>
                    </li>
                  {/each}
                </ol>
              {/if}
            </div>
          {/if}
        </li>
      {:else}
        <li class="py-8 text-center text-parchment-300">
          {filter === 'banned' ? 'No players are banned from global chat.' : filter === 'timedOut' ? 'No players are timed out right now.' : appliedSearch ? 'No players match this search.' : 'No players found.'}
        </li>
      {/each}
    </ul>
    {#if pageCount > 1}
      <nav class="mt-5 flex items-center justify-center gap-4 border-t border-parchment-300/15 pt-5" aria-label="Player pages">
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip === 0} onclick={() => void loadUsers(Math.max(0, skip - pageSize))}>Previous</button>
        <span class="text-sm text-parchment-300">Page <span class="text-parchment-50">{currentPage}</span> of {pageCount}</span>
        <button type="button" class="rounded border border-parchment-300/30 px-4 py-2 text-sm disabled:opacity-30" disabled={loading || skip + pageSize >= total} onclick={() => void loadUsers(skip + pageSize)}>Next</button>
      </nav>
    {/if}
  </section>
{/if}
