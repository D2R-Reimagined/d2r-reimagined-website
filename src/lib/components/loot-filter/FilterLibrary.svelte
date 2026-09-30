<script lang="ts">
    import {onMount, untrack} from 'svelte';
    import {authState} from '$lib/auth';
    import M from '$lib/loot-filter/model.js';
    import {
        listFilters,
        getFilter,
        useFilter,
        saveFilter,
        deleteFilter,
        type FilterSummary
    } from '$lib/loot-filter/api';
    import {
        newDraft,
        fromRemote,
        isDirty,
        contentKey,
        type FilterDraft,
        type LocalLibrary
    } from '$lib/loot-filter/library';
    import {loadLibrary, saveLibrary} from '$lib/loot-filter/workspace';
    import {createPreset, presets, protectedLoot} from '$lib/loot-filter/presets';
    import {stopSound} from '$lib/loot-filter/sound-preview';
    import type {Filter} from '$lib/loot-filter/types';
    import LootFilterBuilder from './LootFilterBuilder.svelte';

    let entries = $state<FilterDraft[]>([]);
    let remote = $state<FilterSummary[]>([]);
    let lastId = $state<string | null>(null);
    let owner = $state('');
    let loaded = $state(false);
    let busy = $state(false);
    let screen = $state<'library' | 'editor'>('library');
    let error = $state('');
    let notice = $state('');
    let localStatus = $state('Loading filters…');
    let cloudUnavailable = $state(false);
    let strictness = $state(0);
    let filterName = $state('');
    let epoch = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: LocalLibrary | undefined;
    let writes = Promise.resolve();
    const validDrafts = new Map<string, FilterDraft>();
    const active = $derived(entries.find(entry => entry.id === lastId));
    const account = $derived(owner !== '' && owner !== 'guest');
    const preset = $derived(presets[strictness]);
    const cards = $derived([
        ...entries.map(entry => ({
            id: entry.id, remoteId: entry.remoteId, name: entry.name, ruleCount: entry.document.rules.length,
            revision: entry.revision, modified: entry.updatedAt, dirty: isDirty(entry), local: true
        })),
        ...remote.filter(row => !entries.some(entry => entry.remoteId === row.id)).map(row => ({
            id: row.id,
            remoteId: row.id,
            name: row.name,
            ruleCount: row.ruleCount,
            revision: row.revision,
            modified: Date.parse(row.updatedAtUtc),
            dirty: false,
            local: false
        }))
    ].sort((a, b) => b.modified - a.modified));

    function flush() {
        if (timer) clearTimeout(timer);
        const snapshot = pending;
        pending = undefined;
        if (!snapshot) return writes;
        writes = writes.then(() => saveLibrary(snapshot)).then(() => {
            if (snapshot.key === `library:${owner}` && !pending)
                localStatus = entries.some(entry => M.validateFilter(entry.document).errors.length)
                    ? 'Fix filter errors — last valid browser copy retained' : 'Saved in this browser';
        }).catch(() => {
            if (snapshot.key === `library:${owner}`) localStatus = 'Browser save unavailable — download a backup';
        });
        return writes;
    }

    $effect(() => {
        if (!$authState.ready) return;
        const identity = $authState.user?.id ?? 'guest';
        untrack(() => {
            if (identity !== owner) void initialize(identity);
        });
    });
    $effect(() => {
        if (!loaded) return;
        const snapshot: LocalLibrary = {
            key: `library:${owner}`,
            version: 1,
            entries: JSON.parse(JSON.stringify(entries)),
            lastId
        };
        const invalid = snapshot.entries.some(entry => M.validateFilter(entry.document).errors.length);
        snapshot.entries = snapshot.entries.flatMap(entry => {
            if (!M.validateFilter(entry.document).errors.length) {
                validDrafts.set(entry.id, structuredClone(entry));
                return [entry];
            }
            const previous = validDrafts.get(entry.id);
            return previous ? [previous] : [];
        });
        pending = snapshot;
        untrack(() => localStatus = invalid ? 'Fix filter errors — last valid browser copy retained' : 'Saving in this browser…');
        timer = setTimeout(() => void flush(), 300);
        return () => {
            if (timer) clearTimeout(timer);
        };
    });
    onMount(() => {
        const hide = () => {
            if (document.visibilityState === 'hidden') void flush();
        };
        const unload = () => {
            void flush();
        };
        window.addEventListener('pagehide', unload);
        document.addEventListener('visibilitychange', hide);
        return () => {
            void flush();
            stopSound();
            window.removeEventListener('pagehide', unload);
            document.removeEventListener('visibilitychange', hide);
        };
    });

    async function initialize(identity: string) {
        const request = ++epoch;
        const persisted = flush();
        stopSound();
        owner = identity;
        loaded = false;
        busy = false;
        screen = 'library';
        entries = [];
        remote = [];
        lastId = null;
        error = '';
        notice = '';
        cloudUnavailable = false;
        try {
            await persisted;
            const saved = await loadLibrary(identity);
            if (request !== epoch) return;
            entries = saved.entries.filter(entry => !M.validateFilter(entry.document).errors.length);
            lastId = entries.some(entry => entry.id === saved.lastId) ? saved.lastId : entries[0]?.id ?? null;
        } catch {
            if (request === epoch) localStatus = 'Browser save unavailable — download a backup';
        }
        if (request !== epoch) return;
        if (identity !== 'guest') {
            try {
                const library = await listFilters();
                if (request !== epoch) return;
                remote = library.items;
                entries = entries.map(entry => entry.remoteId && !remote.some(row => row.id === entry.remoteId)
                    ? {...entry, remoteId: undefined, revision: 0, savedContent: undefined} : entry);
                // A dirty local draft is never silently replaced by a newer server document.
                const localLast = entries.find(entry => entry.id === lastId);
                const latest = remote.find(row => row.id === library.lastUsedId);
                if (latest && (!localLast || Date.parse(latest.lastUsedAtUtc) >= localLast.lastUsedAt)) {
                    const details = await getFilter(latest.id);
                    if (request !== epoch) return;
                    const cached = entries.find(entry => entry.remoteId === latest.id);
                    const draft = cached && isDirty(cached) ? cached : fromRemote(details, cached);
                    entries = [...entries.filter(entry => entry.id !== draft.id), draft];
                    lastId = draft.id;
                }
            } catch (failure) {
                if (request === epoch) {
                    cloudUnavailable = true;
                    error = explain(failure, 'Account filters could not load. Browser drafts remain available.');
                }
            }
        }
        if (request === epoch) {
            loaded = true;
            localStatus = 'Saved in this browser';
        }
    }

    function explain(failure: unknown, fallback: string) {
        return failure instanceof Error ? failure.message : fallback;
    }

    function leaveInvalid() {
        if (!active || !M.validateFilter(active.document).errors.length) return true;
        if (!confirm('Discard invalid edits and return to the last valid browser copy?')) return false;
        const previous = validDrafts.get(active.id);
        if (previous) active.document = structuredClone(previous.document);
        return true;
    }

    async function create(name: string, document: Filter) {
        if (!leaveInvalid()) return;
        if (entries.length >= 50) {
            error = 'This browser library holds up to 50 filters. Remove a filter first.';
            return;
        }
        const request = epoch;
        await flush();
        if (request !== epoch) return;
        const draft = newDraft(name.trim().slice(0, 80) || 'Untitled filter', document);
        entries.push(draft);
        lastId = draft.id;
        screen = 'editor';
        error = '';
        notice = '';
        stopSound();
    }

    async function open(id: string, local: boolean, remoteId?: string) {
        if (busy || !leaveInvalid()) return;
        const request = epoch;
        busy = true;
        error = '';
        notice = '';
        stopSound();
        await flush();
        try {
            let draft = local ? entries.find(entry => entry.id === id) : undefined;
            if (remoteId && account) {
                try {
                    const details = await useFilter(remoteId);
                    if (request !== epoch) return;
                    if (!draft || !isDirty(draft)) draft = fromRemote(details, draft);
                    else notice = 'Resumed your browser draft. Save to account when it is ready.';
                } catch (failure) {
                    if (!draft) throw failure;
                    notice = 'Opened the browser copy. Account access failed; your draft is still available.';
                }
            }
            if (request !== epoch || !draft) return;
            draft.lastUsedAt = Date.now();
            entries = [...entries.filter(entry => entry.id !== draft!.id), draft];
            lastId = draft.id;
            screen = 'editor';
        } catch (failure) {
            if (request === epoch) error = explain(failure, 'Could not open the filter.');
        } finally {
            if (request === epoch) busy = false;
        }
    }

    async function save(copy = false) {
        if (!active || !account || busy) return;
        if (!active.name.trim() || active.name.length > 80) {
            error = 'Give this filter a name of 1–80 characters.';
            return;
        }
        const checked = M.validateFilter(active.document);
        if (checked.errors.length) {
            error = 'Fix validation errors before saving to your account.';
            return;
        }
        const request = epoch, id = active.id, snapshot = JSON.parse(JSON.stringify(active)) as FilterDraft;
        busy = true;
        error = '';
        notice = '';
        try {
            const details = await saveFilter(copy ? undefined : snapshot.remoteId, copy ? `${snapshot.name.slice(0, 73)} (copy)` : snapshot.name, snapshot.document, copy ? 0 : snapshot.revision);
            if (request !== epoch) return;
            const current = entries.find(entry => entry.id === id);
            if (copy) {
                const draft = fromRemote(details);
                entries.push(draft);
                lastId = draft.id;
            } else if (current) {
                current.remoteId = details.id;
                current.revision = details.revision;
                current.savedContent = contentKey(details.name, details.document);
                current.updatedAt = Date.parse(details.updatedAtUtc);
                if (contentKey(current.name, current.document) === contentKey(snapshot.name, snapshot.document)) current.name = details.name;
            }
            remote = [details, ...remote.filter(row => row.id !== details.id)];
            cloudUnavailable = false;
            notice = 'Saved to your account.';
        } catch (failure) {
            if (request === epoch) error = explain(failure, 'Could not save. Your browser draft is kept.');
        } finally {
            if (request === epoch) busy = false;
        }
    }

    async function remove(card: typeof cards[number]) {
        if (busy || !confirm(`Delete “${card.name}”${card.remoteId ? ' from your account and this browser' : ' from this browser'}? Download a backup first if you want to keep it.`)) return;
        const request = epoch;
        busy = true;
        error = '';
        try {
            if (card.remoteId) await deleteFilter(card.remoteId, card.revision);
            if (request !== epoch) return;
            entries = entries.filter(entry => entry.id !== card.id);
            remote = remote.filter(row => row.id !== card.remoteId);
            if (lastId === card.id) lastId = entries[0]?.id ?? null;
            notice = 'Filter deleted.';
        } catch (failure) {
            if (request === epoch) error = explain(failure, 'Could not delete the filter.');
        } finally {
            if (request === epoch) busy = false;
        }
    }

    async function reloadAccount() {
        if (!active?.remoteId || busy || !confirm('Replace this browser draft with the saved account version? Unsaved edits will be discarded.')) return;
        const request = epoch, id = active.id, remoteId = active.remoteId;
        busy = true;
        error = '';
        try {
            const details = await getFilter(remoteId);
            if (request !== epoch) return;
            const draft = fromRemote(details, entries.find(entry => entry.id === id));
            entries = [...entries.filter(entry => entry.id !== id), draft];
            remote = [details, ...remote.filter(row => row.id !== remoteId)];
            notice = 'Loaded the saved account version.';
        } catch (failure) {
            if (request === epoch) error = explain(failure, 'Could not reload. Your browser draft is kept.');
        } finally {
            if (request === epoch) busy = false;
        }
    }

    async function importBrowser() {
        const request = epoch;
        busy = true;
        error = '';
        try {
            const guest = await loadLibrary('guest');
            if (request !== epoch) return;
            const existing = new Set(entries.map(entry => contentKey(entry.name, entry.document)));
            const copies = guest.entries.filter(entry => !existing.has(contentKey(entry.name, entry.document)));
            if (entries.length + copies.length > 50) throw new Error('Remove some browser drafts first; the library limit is 50.');
            entries.push(...copies.map(entry => newDraft(entry.name, entry.document)));
            notice = copies.length ? `Copied ${copies.length} browser filter(s). Open each and save it to your account.` : 'No new browser filters to copy.';
        } catch (failure) {
            if (request === epoch) error = explain(failure, 'Could not copy browser filters.');
        } finally {
            if (request === epoch) busy = false;
        }
    }

    function back() {
        if (leaveInvalid()) {
            void flush();
            stopSound();
            screen = 'library';
        }
    }
</script>

<section class="mx-auto max-w-[1800px] px-4 pt-8 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
            <h1 class="display-text mt-2 text-3xl">{screen === 'library' ? 'Loot Filter Library' : 'Loot Filter Builder'}</h1>
        </div>
        {#if screen === 'editor'}
            <button class="trade-secondary-button" onclick={back}>← My filters</button>
        {/if}
    </div>
    <div class="mt-4 flex flex-wrap justify-between gap-2 text-sm text-parchment-300">
        <span>{account ? 'Private account library · edits also stay in this browser' : 'Browser library · sign in to save across devices'}</span>
        <span role="status">{loaded ? localStatus : 'Loading filters…'}</span>
    </div>
    {#if error}<p role="alert" class="mt-4 rounded border border-requirement/40 p-3 text-sm text-requirement">{error}
        Your browser draft has not been replaced.</p>{/if}
    {#if notice}<p role="status" class="mt-4 rounded border border-parchment-300/25 p-3 text-sm">{notice}</p>{/if}

    {#if screen === 'library'}
        {#if loaded && active}
            <div class="panel mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg p-5">
                <div>
                    <h2 class="display-text mt-2 text-xl">{active.name || 'Untitled filter'}</h2>
                    <p class="mt-1 text-sm text-parchment-300">{active.document.rules.length}
                        rules{account && isDirty(active) ? ' · browser draft has unsaved account changes' : ''}</p>
                </div>
                <button class="trade-primary-button" disabled={busy}
                        onclick={() => open(active!.id, true, active!.remoteId)}>Continue last filter
                </button>
            </div>
        {/if}
        <div class="mt-6 grid gap-5 lg:grid-cols-2">
            <section class="panel rounded-lg p-5 sm:p-6" aria-label="Starting presets">
                <h2 class="display-text mt-2 text-2xl">Choose your strictness</h2>
                <p class="mt-3 text-sm text-parchment-300">Create an editable copy. Changing this slider never changes
                    an existing filter.</p>
                <label class="mt-6 block"><span class="sr-only">Preset strictness</span><input
                        class="w-full accent-ember-400" type="range" min="0" max="2" step="1" bind:value={strictness}
                        aria-valuetext={preset.name}/></label>
                <div class="mt-2 grid grid-cols-3 gap-2">
                    {#each presets as option, i}
                        <button class={`rounded border p-2 text-sm ${strictness === i ? 'border-ember-400' : 'border-parchment-300/20'}`}
                                aria-pressed={strictness === i} onclick={() => strictness = i}>{option.name}</button>
                    {/each}
                </div>
                <h3 class="display-text mt-5 text-xl">{preset.name}</h3>
                <p class="mt-2 text-sm text-parchment-200">{preset.description}</p>
                <p class="mt-3 text-sm text-parchment-300"><strong
                        class="text-parchment-50">Hides:</strong> {preset.hides}</p>
                <p class="mt-3 text-sm text-parchment-300"><strong class="text-parchment-50">Always
                    keeps:</strong> {protectedLoot}</p>
                <p class="mt-3 text-xs text-parchment-300">Potions, gold and other miscellaneous drops stay visible at
                    every level. These are conservative starting rules, not a valuation of rolled stats.</p>
                <label class="mt-5 block text-sm">Filter name<input class="field mt-2" maxlength="80"
                                                                    placeholder={`My ${preset.name} filter`}
                                                                    bind:value={filterName}/></label>
                <div class="mt-4 flex flex-wrap gap-2">
                    <button class="trade-primary-button" disabled={!loaded || busy}
                            onclick={() => create(filterName || `My ${preset.name} filter`, createPreset(preset.id))}>
                        Create {preset.name} filter
                    </button>
                    <button class="trade-secondary-button" disabled={!loaded || busy}
                            onclick={() => create(filterName || 'My blank filter', { version: 3, rules: [] })}>Start
                        blank
                    </button>
                </div>
            </section>
            <section class="panel rounded-lg p-5 sm:p-6" aria-label="Saved filters">
                <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="display-text text-2xl">My
                    filters</h2><span class="text-sm text-parchment-300">{cards.length} filters</span></div>
                {#if !account}<p class="mt-3 text-sm text-parchment-300"><a class="text-ember-400 underline"
                                                                            href="/profile">Sign in</a> to save your
                    filters to your account.</p>{:else}
                    <div class="mt-3 flex flex-wrap gap-4 text-xs">
                        <button class="text-ember-400 hover:underline" disabled={busy} onclick={importBrowser}>Copy
                            browser filters
                        </button>
                        <button class="text-ember-400 hover:underline" disabled={busy}
                                onclick={() => initialize(owner)}>{cloudUnavailable ? 'Retry account library' : 'Refresh account library'}</button>
                    </div>
                {/if}
                <ul class="mt-4 space-y-3">
                    {#each cards as card (card.id)}
                        <li class="rounded border border-parchment-300/20 p-4">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0"><h3
                                        class="break-words text-parchment-50">{card.name || 'Untitled filter'}</h3>
                                    <p class="mt-1 text-xs text-parchment-300">{card.ruleCount} rules
                                        · {card.remoteId ? (card.dirty ? 'Account + edited browser draft' : 'Saved to account') : 'Browser only'}</p>
                                </div>
                                <button class="text-xs text-parchment-300 hover:text-requirement" disabled={busy}
                                        aria-label={`Delete ${card.name}`} onclick={() => remove(card)}>Delete
                                </button>
                            </div>
                            <button class="mt-3 text-sm text-ember-400 hover:underline" disabled={busy}
                                    aria-label={`Open ${card.name}`}
                                    onclick={() => open(card.id, card.local, card.remoteId)}>Open filter →
                            </button>
                        </li>
                    {:else}
                        <li class="rounded border border-dashed border-parchment-300/20 p-6 text-sm text-parchment-300">{loaded ? 'Start with a preset or create a blank filter. Your filters will appear here.' : 'Loading your library…'}</li>
                    {/each}
                </ul>
            </section>
        </div>
    {:else if active}
        <div class="panel mt-5 flex flex-wrap items-end gap-3 rounded-lg p-4">
            <label class="min-w-0 flex-1 text-xs uppercase tracking-widest text-parchment-300">Filter name<input
                    class="field mt-2" maxlength="80" disabled={busy} bind:value={active.name}
                    oninput={() => { if (active) active.updatedAt = Date.now(); }}/></label>
            {#if account}
                <button class="trade-primary-button"
                        disabled={busy || M.validateFilter(active.document).errors.length > 0}
                        onclick={() => save()}>{busy ? 'Working…' : 'Save to account'}</button>
                <button class="trade-secondary-button"
                        disabled={busy || M.validateFilter(active.document).errors.length > 0 || entries.length >= 50}
                        onclick={() => save(true)}>Save account copy
                </button>
            {:else}<a class="trade-secondary-button" href="/profile">Sign in to save to account</a>{/if}
            <button class="trade-secondary-button" disabled={busy || entries.length >= 50}
                    onclick={() => create(`${active!.name.slice(0, 73)} (copy)`, $state.snapshot(active!.document))}>
                Duplicate filter
            </button>
            {#if account}<span
                    class="w-full text-xs text-parchment-300">{isDirty(active) ? 'Unsaved account changes · browser draft retained' : 'Account copy is up to date'}</span>{/if}
            {#if active.remoteId}
                <button class="text-xs text-ember-400 hover:underline" disabled={busy} onclick={reloadAccount}>Reload
                    saved account version
                </button>
            {/if}
        </div>
    {/if}
</section>
{#if screen === 'editor' && active}
    <div inert={busy}>
        {#key active.id}
            <LootFilterBuilder bind:filter={active.document} bind:selected={active.selected}
                               onedit={() => { if (active) active.updatedAt = Date.now(); }}
                               onimport={(filter, name) => create(name, filter)}/>
        {/key}
    </div>
{:else}
    <div class="h-10"></div>
{/if}
