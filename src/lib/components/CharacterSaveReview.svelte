<script lang="ts">
  import { authState } from '$lib/auth';
  import type { CharacterResponse } from '$lib/characters';
  import {
    flagKindInfo,
    formatEvidence,
    getCharacterSaveReview,
    resolveSaveReviewFlag,
    type CharacterSaveReview,
    type SaveReviewFlag
  } from '$lib/save-review';

  let { character }: { character: CharacterResponse } = $props();

  let canReview = $derived($authState.user?.roles.some(role => role === 'Admin' || role === 'Moderator') ?? false);
  let review = $state<CharacterSaveReview | null>(null);
  let loading = $state(false);
  let error = $state('');
  let notice = $state('');
  let showResolved = $state(false);
  let expandedId = $state<string | null>(null);
  let resolvingId = $state<string | null>(null);
  let notes = $state<Record<string, string>>({});
  let sequence = 0;

  // Fetched with resolved rows always, and filtered here, so the toggle is
  // instant and the counts can say how much is hidden.
  async function load(): Promise<void> {
    const request = ++sequence;
    loading = true;
    error = '';
    try {
      const result = await getCharacterSaveReview(character.id, true);
      if (request === sequence) review = result;
    } catch (value) {
      if (request === sequence) error = value instanceof Error ? value.message : 'Could not load anti-cheat flags.';
    } finally {
      if (request === sequence) loading = false;
    }
  }

  $effect(() => {
    if (canReview && character.id) void load();
  });

  async function resolve(flag: SaveReviewFlag): Promise<void> {
    if (resolvingId) return;
    resolvingId = flag.id;
    error = '';
    notice = '';
    try {
      await resolveSaveReviewFlag(flag.id, notes[flag.id] ?? '');
      notice = 'Flag resolved. If the same finding is raised again it opens a new flag.';
      expandedId = null;
      await load();
    } catch (value) {
      error = value instanceof Error ? value.message : 'Could not resolve the flag.';
      await load();
    } finally {
      resolvingId = null;
    }
  }

  function visible(flags: SaveReviewFlag[]): SaveReviewFlag[] {
    return flags
      .filter(flag => showResolved || !flag.resolvedAtUtc)
      .sort((a, b) =>
        Number(!!a.resolvedAtUtc) - Number(!!b.resolvedAtUtc)
        || Number(b.refusedCount > 0) - Number(a.refusedCount > 0)
        || b.lastSeenAtUtc.localeCompare(a.lastSeenAtUtc));
  }

  function kindCounts(flags: SaveReviewFlag[]): Array<{ label: string; count: number }> {
    const counts = new Map<string, number>();
    for (const flag of flags) {
      const label = flagKindInfo(flag.kind).label;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  }

  function when(value: string): string {
    return new Date(value).toLocaleString();
  }

  let all = $derived(review ? [...review.characterFlags, ...review.sharedStashFlags, ...review.accountFlags] : []);
  let openCount = $derived(all.filter(flag => !flag.resolvedAtUtc).length);
  let resolvedCount = $derived(all.length - openCount);
  let refusedSaves = $derived(all.reduce((total, flag) => total + flag.refusedCount, 0));
  let groups = $derived(review ? [
    {
      title: 'This character',
      detail: review.fileName ? `Findings about ${review.fileName} and its summon state.` : '',
      flags: review.characterFlags
    },
    {
      title: 'Shared stash',
      detail: 'The stash every character on this account and ladder saves alongside.',
      flags: review.sharedStashFlags
    },
    {
      title: 'Account on this ladder',
      detail: 'Findings about the account as a whole, such as journal sessions and play time.',
      flags: review.accountFlags
    }
  ] : []);
</script>

{#if canReview}
  <section class="panel mb-6 rounded-lg p-4 sm:p-6" aria-label="Anti-cheat review" aria-busy={loading}>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 class="display-text text-2xl text-parchment-50">Anti-cheat review</h2>
        <p class="mt-1 text-sm text-parchment-300">
          Visible to Admins and Moderators only. Players whose saves are refused are told only that anti-cheat rejected them.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-parchment-300">
          <input type="checkbox" bind:checked={showResolved} />
          Show resolved{resolvedCount ? ` (${resolvedCount})` : ''}
        </label>
        <button type="button" class="action text-parchment-50" disabled={loading || resolvingId !== null} onclick={() => void load()}>Refresh</button>
      </div>
    </div>

    {#if error}<p role="alert" class="mt-4 rounded border border-requirement/45 bg-requirement/10 p-3 text-requirement">{error}</p>{/if}
    {#if notice}<p role="status" class="mt-4 rounded border border-set/40 bg-set/10 p-3 text-set">{notice}</p>{/if}

    {#if loading && !review}
      <p role="status" class="mt-5 text-parchment-300">Loading anti-cheat flags…</p>
    {:else if review && !review.isServerSave}
      <p class="mt-5 text-parchment-300">
        This character was uploaded by hand. The server never validated its save, so it has no anti-cheat flags.
      </p>
    {:else if review}
      <dl class="mt-5 grid grid-cols-3 gap-3 text-center">
        <div class="rounded border border-parchment-300/20 bg-black/20 p-3">
          <dt class="text-xs uppercase tracking-wide text-parchment-300">Open flags</dt>
          <dd class="mt-1 text-2xl {openCount ? 'text-ember-400' : 'text-parchment-50'}">{openCount}</dd>
        </div>
        <div class="rounded border border-parchment-300/20 bg-black/20 p-3">
          <dt class="text-xs uppercase tracking-wide text-parchment-300">Refused saves</dt>
          <dd class="mt-1 text-2xl {refusedSaves ? 'text-requirement' : 'text-parchment-50'}">{refusedSaves}</dd>
        </div>
        <div class="rounded border border-parchment-300/20 bg-black/20 p-3">
          <dt class="text-xs uppercase tracking-wide text-parchment-300">Resolved</dt>
          <dd class="mt-1 text-2xl text-parchment-50">{resolvedCount}</dd>
        </div>
      </dl>

      {#if groups.every(group => visible(group.flags).length === 0)}
        <p class="mt-6 text-parchment-300">
          {all.length === 0 ? 'Nothing has been flagged for this character.' : 'No open flags. Tick "Show resolved" to see past ones.'}
        </p>
      {:else}
      <div class="mt-6 grid gap-6" class:opacity-60={loading}>
        {#each groups as group (group.title)}
          {@const shown = visible(group.flags)}
          <section aria-label={group.title}>
            <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-parchment-300/15 pb-2">
              <h3 class="display-text text-lg text-parchment-50">
                {group.title} <span class="text-sm text-parchment-300">({shown.length})</span>
              </h3>
              <div class="flex flex-wrap gap-1.5">
                {#each kindCounts(shown) as entry (entry.label)}
                  <span class="rounded bg-white/5 px-2 py-0.5 text-xs text-parchment-300">{entry.label} ×{entry.count}</span>
                {/each}
              </div>
            </div>
            {#if group.detail}<p class="mt-2 text-xs text-parchment-300">{group.detail}</p>{/if}

            {#if shown.length === 0}
              <p class="mt-3 text-sm text-parchment-300">No {showResolved ? '' : 'open '}flags.</p>
            {:else}
              <div class="mt-3 grid gap-3">
                {#each shown as flag (flag.id)}
                  {@const info = flagKindInfo(flag.kind)}
                  <article class="min-w-0 rounded-lg border bg-black/20 p-4
                    {flag.resolvedAtUtc ? 'border-parchment-300/15 opacity-70' : flag.refusedCount ? 'border-requirement/50' : 'border-parchment-300/25'}">
                    <div class="flex flex-wrap items-center gap-2 text-xs">
                      <span class="rounded border border-ember-400/40 px-2 py-1 text-ember-400" title={info.description}>{info.label}</span>
                      {#if flag.refusedCount}
                        <span class="rounded bg-requirement/15 px-2 py-1 text-requirement">
                          Refused {flag.refusedCount} {flag.refusedCount === 1 ? 'save' : 'saves'}
                        </span>
                      {:else}
                        <span class="rounded bg-white/10 px-2 py-1 text-parchment-300">Observed only</span>
                      {/if}
                      {#if flag.resolvedAtUtc}<span class="rounded bg-set/15 px-2 py-1 text-set">Resolved</span>{/if}
                      <span class="text-parchment-300">Seen {flag.occurrences}×</span>
                    </div>

                    <p class="mt-3 whitespace-pre-wrap break-words text-parchment-50 [overflow-wrap:anywhere]">{flag.summary}</p>

                    <p class="mt-2 text-xs text-parchment-300">
                      {#if flag.fileName}<span class="break-all">{flag.fileName}</span> · {/if}
                      First <time datetime={flag.firstSeenAtUtc}>{when(flag.firstSeenAtUtc)}</time>
                      · Last <time datetime={flag.lastSeenAtUtc}>{when(flag.lastSeenAtUtc)}</time>
                      {#if flag.lastRefusedAtUtc} · Last refused <time datetime={flag.lastRefusedAtUtc}>{when(flag.lastRefusedAtUtc)}</time>{/if}
                    </p>

                    <button type="button" class="action mt-3 text-parchment-200" aria-expanded={expandedId === flag.id}
                      onclick={() => { expandedId = expandedId === flag.id ? null : flag.id; }}>
                      {expandedId === flag.id ? 'Hide details' : flag.resolvedAtUtc ? 'Details' : 'Details and resolve'}
                    </button>

                    {#if expandedId === flag.id}
                      <div class="mt-4 border-t border-parchment-300/20 pt-4">
                        {#if info.description}<p class="text-sm text-parchment-300">{info.description}</p>{/if}
                        {#if flag.evidenceJson}
                          <h4 class="mt-4 text-sm text-parchment-50">Evidence</h4>
                          <pre class="mt-2 max-h-80 overflow-auto rounded bg-black/40 p-3 text-xs text-parchment-200">{formatEvidence(flag.evidenceJson)}</pre>
                        {/if}
                        <dl class="mt-4 grid gap-x-4 gap-y-1 text-xs text-parchment-300 sm:grid-cols-[auto_1fr]">
                          <dt>Flag ID</dt><dd class="break-all">{flag.id}</dd>
                          <dt>Signature</dt><dd class="break-all">{flag.signature}</dd>
                          {#if flag.sessionId}<dt>Journal session</dt><dd class="break-all">{flag.sessionId}</dd>{/if}
                          {#if flag.resolvedAtUtc}
                            <dt>Resolved</dt><dd>{when(flag.resolvedAtUtc)}</dd>
                            {#if flag.resolvedByUserId}<dt>Resolved by</dt><dd class="break-all">{flag.resolvedByUserId}</dd>{/if}
                            <dt>Note</dt><dd class="whitespace-pre-wrap break-words">{flag.resolutionNote || 'None'}</dd>
                          {/if}
                        </dl>

                        {#if !flag.resolvedAtUtc}
                          <form class="mt-4" onsubmit={(event) => { event.preventDefault(); void resolve(flag); }}>
                            <label class="block text-sm text-parchment-300">Resolution note
                              <textarea class="field" rows="2" maxlength="1024" placeholder="What you checked and decided"
                                value={notes[flag.id] ?? ''}
                                oninput={(event) => { notes[flag.id] = event.currentTarget.value; }}
                                disabled={resolvingId !== null}></textarea>
                            </label>
                            <button type="submit" class="action mt-2 border-set/50 text-set" disabled={resolvingId !== null}>
                              {resolvingId === flag.id ? 'Resolving…' : 'Mark resolved'}
                            </button>
                          </form>
                        {/if}
                      </div>
                    {/if}
                  </article>
                {/each}
              </div>
            {/if}
          </section>
        {/each}
      </div>
      {/if}
    {/if}
  </section>
{/if}

<style>
  .field { display: block; width: 100%; margin-top: 0.5rem; border: 1px solid #a99f8a66; border-radius: 0.25rem; background: #111; color: #eee8dc; padding: 0.5rem 0.75rem; }
  .action { border: 1px solid; border-radius: 0.25rem; padding: 0.4rem 0.8rem; font-size: 0.875rem; }
  .action:disabled { opacity: 0.4; cursor: not-allowed; }
  .action:not(:disabled):hover { background: #ffffff0d; }
</style>
