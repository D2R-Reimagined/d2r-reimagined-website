<script lang="ts">
  import { onMount } from 'svelte';
  import { ApiError } from '$lib/auth';
  import { feedbackTypeLabel, getFeedbackTypes, searchFeedback, updateFeedbackStatus, type Feedback, type FeedbackStatus } from '$lib/feedback';

  const pageSize = 25;
  let reports = $state<Feedback[]>([]);
  let types = $state<string[]>(['bug', 'suggestion']);
  let type = $state('');
  let status = $state<FeedbackStatus | ''>('open');
  let search = $state('');
  let applied = $state({ type: '', status: 'open' as FeedbackStatus | '', search: '' });
  let skip = $state(0);
  let total = $state(0);
  let loading = $state(true);
  let savingId = $state<string | null>(null);
  let selectedId = $state<string | null>(null);
  let error = $state('');
  let notice = $state('');
  let sequence = 0;
  let selected = $derived(reports.find(report => report.id === selectedId));
  let currentPage = $derived(Math.floor(skip / pageSize) + 1);
  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

  function message(value: unknown): string {
    return value instanceof Error ? value.message : 'Could not load feedback. Please try again.';
  }

  async function load(nextSkip = skip): Promise<void> {
    const request = ++sequence;
    loading = true;
    error = '';
    try {
      let result = await searchFeedback({ ...applied, skip: nextSkip, count: pageSize });
      // Closing the last item on a page should return to the last populated page.
      if (nextSkip > 0 && result.items.length === 0) {
        nextSkip = Math.max(0, Math.floor((result.total - 1) / pageSize) * pageSize);
        result = await searchFeedback({ ...applied, skip: nextSkip, count: pageSize });
      }
      if (request !== sequence) return;
      reports = result.items;
      total = result.total;
      skip = result.skip;
      if (!reports.some(report => report.id === selectedId)) selectedId = null;
    } catch (value) {
      if (request === sequence) error = message(value);
    } finally {
      if (request === sequence) loading = false;
    }
  }

  function filter(): void {
    applied = { type, status, search: search.trim() };
    selectedId = null;
    notice = '';
    void load(0);
  }

  async function setStatus(report: Feedback, nextStatus: FeedbackStatus): Promise<void> {
    savingId = report.id;
    error = '';
    notice = '';
    try {
      await updateFeedbackStatus(report, nextStatus);
      notice = nextStatus === 'open' ? 'Feedback reopened.' : nextStatus === 'closed' ? 'Feedback closed.' : 'Feedback archived.';
      await load();
    } catch (value) {
      if (value instanceof ApiError && value.status === 409) {
        await load();
        error = 'Another reviewer changed this report. The list has been refreshed; review its status before trying again.';
      } else error = message(value);
    } finally {
      savingId = null;
    }
  }

  onMount(() => {
    void load(0);
    void getFeedbackTypes().then(result => { types = result; }).catch(() => { /* Built-in types remain available. */ });
    return () => { sequence++; };
  });
</script>

<svelte:head><title>Feedback — D2R Reimagined</title></svelte:head>

<div class="mb-6">
  <h2 class="display-text text-3xl text-parchment-50">Feedback</h2>
  <p class="mt-2 text-parchment-300">Review player bug reports and suggestions. Close handled reports, archive old ones, or reopen them when needed.</p>
</div>

{#if error}<div role="alert" class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>{/if}
{#if notice}<div role="status" class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>{/if}

<form class="panel mb-5 rounded-lg p-4" onsubmit={(event) => { event.preventDefault(); filter(); }}>
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr_auto]">
    <label class="text-sm text-parchment-300">Status
      <select class="field" bind:value={status} disabled={savingId !== null}>
        <option value="open">Open</option><option value="closed">Closed</option><option value="archived">Archived</option><option value="">All statuses</option>
      </select>
    </label>
    <label class="text-sm text-parchment-300">Type
      <select class="field" bind:value={type} disabled={savingId !== null}>
        <option value="">All types</option>
        {#each types as entry}<option value={entry}>{feedbackTypeLabel(entry)}</option>{/each}
      </select>
    </label>
    <label class="text-sm text-parchment-300">Search feedback
      <input class="field" type="search" maxlength="100" placeholder="Search report text" bind:value={search} disabled={savingId !== null} />
    </label>
    <button class="action self-end border-ember-400 text-parchment-50" type="submit" disabled={loading || savingId !== null}>Apply filters</button>
  </div>
</form>

<section class="panel rounded-lg p-4 sm:p-6" aria-busy={loading}>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-parchment-300">
    <p>{total} {total === 1 ? 'report' : 'reports'}{applied.status ? ` · ${applied.status}` : ''}</p>
    <button type="button" class="action" disabled={loading || savingId !== null} onclick={() => void load()}>Refresh</button>
  </div>
  {#if loading}<p role="status" class="py-5 text-center text-parchment-300">Loading feedback…</p>{/if}
  {#if !loading && reports.length === 0}
    <p class="py-8 text-center text-parchment-300">No feedback matches these filters.</p>
  {/if}
  <div class:opacity-50={loading} class="grid gap-3">
    {#each reports as report (report.id)}
      <article class="min-w-0 rounded-lg border border-parchment-300/20 bg-black/20 p-4">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded border border-ember-400/40 px-2 py-1 text-ember-400">{feedbackTypeLabel(report.type)}</span>
          <span class="rounded bg-white/10 px-2 py-1 capitalize text-parchment-50">{report.status}</span>
          <time class="text-parchment-300" datetime={report.createdAtUtc}>{new Date(report.createdAtUtc).toLocaleString()}</time>
        </div>
        <p class="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-parchment-50 [overflow-wrap:anywhere]">{report.message}</p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="min-w-0 break-all text-xs text-parchment-300">{report.userDisplayName || (report.userId ? 'Player account' : 'Anonymous')}{report.source ? ` · ${report.source}` : ''}</p>
          <button class="action text-parchment-50" type="button" aria-expanded={selectedId === report.id} disabled={loading || savingId !== null} onclick={() => { selectedId = selectedId === report.id ? null : report.id; }}> {selectedId === report.id ? 'Hide details' : 'Review report'}</button>
        </div>
        {#if selected?.id === report.id}
          <div class="mt-4 border-t border-parchment-300/20 pt-4">
            <h3 class="display-text text-lg text-parchment-50">Full report</h3>
            <p class="mt-3 max-h-[28rem] overflow-y-auto whitespace-pre-wrap break-words text-parchment-50 [overflow-wrap:anywhere]">{report.message}</p>
            <dl class="my-5 grid gap-2 text-xs text-parchment-300 sm:grid-cols-[auto_1fr]">
              <dt>Report ID</dt><dd class="break-all">{report.id}</dd>
              <dt>Account</dt><dd class="break-all">{report.userId || 'Anonymous'}</dd>
              <dt>Client</dt><dd class="break-all">{[report.plugin, report.pluginVersion].filter(Boolean).join(' ') || 'Not provided'}</dd>
              <dt>Last updated</dt><dd>{new Date(report.updatedAtUtc).toLocaleString()}</dd>
              {#if report.statusChangedByUserId}<dt>Last reviewed by</dt><dd class="break-all">{report.statusChangedByUserId}</dd>{/if}
            </dl>
            <div class="flex flex-wrap gap-2">
              {#if report.status !== 'closed'}<button class="action border-set/50 text-set" type="button" disabled={savingId !== null || loading} onclick={() => void setStatus(report, 'closed')}>Close report</button>{/if}
              {#if report.status !== 'archived'}<button class="action" type="button" disabled={savingId !== null || loading} onclick={() => void setStatus(report, 'archived')}>Archive report</button>{/if}
              {#if report.status !== 'open'}<button class="action border-ember-400 text-ember-400" type="button" disabled={savingId !== null || loading} onclick={() => void setStatus(report, 'open')}>Reopen report</button>{/if}
              {#if savingId === report.id}<span role="status" class="self-center text-sm text-parchment-300">Saving…</span>{/if}
            </div>
          </div>
        {/if}
      </article>
    {/each}
  </div>
  {#if total > pageSize || skip > 0}
    <nav class="mt-5 flex flex-wrap items-center justify-center gap-4 border-t border-parchment-300/15 pt-5" aria-label="Feedback pages">
      <button class="action" type="button" disabled={loading || savingId !== null || skip === 0} onclick={() => void load(Math.max(0, skip - pageSize))}>Previous</button>
      <span class="text-sm text-parchment-300">Page {currentPage} of {pageCount}</span>
      <button class="action" type="button" disabled={loading || savingId !== null || skip + pageSize >= total} onclick={() => void load(skip + pageSize)}>Next</button>
    </nav>
  {/if}
</section>

<style>
  .field { display: block; width: 100%; margin-top: 0.5rem; border: 1px solid #a99f8a66; border-radius: 0.25rem; background: #111; color: #eee8dc; padding: 0.5rem 0.75rem; }
  .action { border: 1px solid; border-radius: 0.25rem; padding: 0.5rem 0.85rem; font-size: 0.875rem; }
  .action:disabled { opacity: 0.4; cursor: not-allowed; }
  .action:not(:disabled):hover { background: #ffffff0d; }
</style>
