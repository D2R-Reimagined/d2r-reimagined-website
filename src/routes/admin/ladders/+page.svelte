<script lang="ts">
    import {onMount} from 'svelte';

    import {
        createLadder,
        getLadders,
        startLadder,
        updateLadder,
        type Ladder,
        type LadderAllowedExtensionInput,
        type LadderExtensionKind,
        type LadderInput
    } from '$lib/admin';
    import {ApiError} from '$lib/auth';
    import {isSha256, normalizeSha256} from '$lib/sha256';

    interface LadderDraft {
        name: string;
        startDate: string;
        endDate: string;
        allowedExtensions: LadderAllowedExtensionInput[];
    }

    let ladders = $state<Ladder[]>([]);
    let selectedId = $state<string | null>(null);
    let draft = $state<LadderDraft>({name: '', startDate: '', endDate: '', allowedExtensions: []});
    let loading = $state(true);
    let saving = $state(false);
    let error = $state('');
    let notice = $state('');

    let selectedLadder = $derived(ladders.find((ladder) => ladder.id === selectedId) ?? null);

    function formatDateInput(date: Date): string {
        const offset = date.getTimezoneOffset() * 60_000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    }

    function problemMessage(value: unknown): string {
        return value instanceof ApiError || value instanceof Error
            ? value.message
            : 'An unexpected error occurred.';
    }

    function resetDraft(): void {
        const start = new Date();
        start.setSeconds(0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        selectedId = null;
        draft = {
            name: '',
            startDate: formatDateInput(start),
            endDate: formatDateInput(end),
            allowedExtensions: []
        };
        error = '';
        notice = '';
    }

    function editLadder(ladder: Ladder): void {
        selectedId = ladder.id;
        draft = {
            name: ladder.name,
            startDate: formatDateInput(new Date(ladder.startDateUtc)),
            endDate: formatDateInput(new Date(ladder.endDateUtc)),
            allowedExtensions: ladder.allowedExtensions.map((extension) => ({
                name: extension.name,
                fileName: extension.fileName,
                sha256: extension.sha256,
                kind: extension.kind,
                isRequired: extension.isRequired ?? false
            }))
        };
        error = '';
        notice = '';
    }

    function addRequirement(kind: LadderExtensionKind): void {
        draft.allowedExtensions.push({name: '', fileName: '', sha256: '', kind, isRequired: false});
    }

    function removeRequirement(index: number): void {
        draft.allowedExtensions.splice(index, 1);
    }

    async function loadLadders(): Promise<void> {
        loading = true;
        error = '';
        try {
            ladders = await getLadders();
        } catch (value) {
            error = problemMessage(value);
        } finally {
            loading = false;
        }
    }

    function requestFromDraft(): LadderInput {
        return {
            name: draft.name.trim(),
            startDateUtc: new Date(draft.startDate).toISOString(),
            endDateUtc: new Date(draft.endDate).toISOString(),
            allowedExtensions: draft.allowedExtensions.map((extension) => ({
                name: extension.name.trim(),
                fileName: extension.fileName.trim(),
                sha256: normalizeSha256(extension.sha256),
                kind: extension.kind,
                isRequired: extension.isRequired
            }))
        };
    }

    async function saveLadder(): Promise<void> {
        error = '';
        notice = '';
        for (const extension of draft.allowedExtensions) {
            extension.sha256 = normalizeSha256(extension.sha256);
            if (!isSha256(extension.sha256)) {
                const name = extension.name.trim() || extension.fileName.trim() || extension.kind;
                error = `${name}'s SHA-256 must contain exactly 64 hexadecimal characters. The current value contains ${extension.sha256.length}.`;
                return;
            }
        }

        saving = true;
        const wasUpdate = selectedId !== null;
        try {
            const saved = selectedId
                ? await updateLadder(selectedId, requestFromDraft())
                : await createLadder(requestFromDraft());
            await loadLadders();
            editLadder(ladders.find((ladder) => ladder.id === saved.id) ?? saved);
            notice = wasUpdate ? 'Ladder updated.' : 'Ladder created.';
        } catch (value) {
            error = problemMessage(value);
        } finally {
            saving = false;
        }
    }

    async function startSelectedLadder(): Promise<void> {
        if (!selectedId) return;
        error = '';
        notice = '';
        saving = true;
        try {
            const started = await startLadder(selectedId);
            await loadLadders();
            editLadder(ladders.find((ladder) => ladder.id === started.id) ?? started);
            notice = 'Ladder started. Its configured duration was preserved.';
        } catch (value) {
            error = problemMessage(value);
        } finally {
            saving = false;
        }
    }

    onMount(async () => {
        resetDraft();
        await loadLadders();
    });
</script>

<svelte:head>
    <title>Manage Ladders — D2R Reimagined</title>
</svelte:head>

<div class="mb-6">
    <h2 class="display-text mt-1 text-3xl text-parchment-50">Ladders</h2>
    <p class="mt-2 text-parchment-300">Schedule ladders, start them immediately, and define approved D2RLoader
        requirements.</p>
</div>

{#if error}
    <div class="mb-5 rounded-lg border border-requirement/45 bg-requirement/10 p-4 text-requirement">{error}</div>
{/if}
{#if notice}
    <div class="mb-5 rounded-lg border border-set/40 bg-set/10 p-4 text-set">{notice}</div>
{/if}

{#if loading}
    <div class="panel rounded-lg p-8 text-center text-parchment-300">Loading ladders…</div>
{:else}
    <div class="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside class="panel h-fit rounded-lg p-4">
            <div class="flex items-center justify-between gap-3">
                <h3 class="display-text text-xl">All ladders</h3>
                <button class="rounded border border-ember-400/50 px-3 py-2 text-sm hover:bg-ember-700/25" type="button"
                        onclick={resetDraft}>New
                </button>
            </div>
            <div class="mt-4 grid gap-2">
                {#each ladders as ladder}
                    <button
                            type="button"
                            onclick={() => editLadder(ladder)}
                            class={`rounded-lg border p-3 text-left transition ${selectedId === ladder.id ? 'border-ember-400 bg-ember-700/20' : 'border-parchment-300/20 hover:border-parchment-300/45'}`}
                    >
                        <span class="block text-parchment-50">{ladder.name}</span>
                        <span class="mt-1 block text-xs text-parchment-300">{new Date(ladder.startDateUtc).toLocaleString()}
                            – {new Date(ladder.endDateUtc).toLocaleString()}</span>
                        <span class="mt-1 block text-xs text-rarity">
                            {ladder.allowedExtensions.filter((extension) => extension.isRequired).length} required,
                            {ladder.allowedExtensions.filter((extension) => !extension.isRequired).length} optional
                        </span>
                    </button>
                {:else}
                    <p class="rounded border border-dashed border-parchment-300/25 p-4 text-sm text-parchment-300">No
                        ladders have been created.</p>
                {/each}
            </div>
        </aside>

        <form class="panel rounded-lg p-5 sm:p-7" onsubmit={(event) => { event.preventDefault(); void saveLadder(); }}>
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-ember-400">{selectedLadder ? 'Editing ladder' : 'New ladder'}</p>
                    <h3 class="display-text mt-1 text-2xl">{selectedLadder?.name || 'Create a ladder'}</h3>
                </div>
                {#if selectedId}
                    <button class="rounded border border-set/50 px-4 py-2 text-set hover:bg-set/10 disabled:opacity-50"
                            type="button" disabled={saving} onclick={() => void startSelectedLadder()}>Start now
                    </button>
                {/if}
            </div>

            <div class="mt-6 grid gap-5 lg:grid-cols-2">
                <label class="lg:col-span-2">
                    <span class="mb-2 block text-sm text-parchment-200">Ladder name</span>
                    <input class="field" required minlength="2" maxlength="100" bind:value={draft.name}/>
                </label>
                <label>
                    <span class="mb-2 block text-sm text-parchment-200">Starts</span>
                    <input class="field" type="datetime-local" required bind:value={draft.startDate}/>
                </label>
                <label>
                    <span class="mb-2 block text-sm text-parchment-200">Ends</span>
                    <input class="field" type="datetime-local" required bind:value={draft.endDate}/>
                </label>
            </div>

            <div class="mt-8 border-t border-parchment-300/15 pt-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="display-text text-xl">Ladder plugins and patches</h3>
                        <p class="mt-1 text-sm text-parchment-300">Optional extensions may be selected by players.
                            Required extensions are enforced by the launcher. Both require an exact kind, filename,
                            and SHA-256 match.</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="rounded border border-magic/50 px-3 py-2 text-sm text-magic hover:bg-magic/10"
                                type="button" onclick={() => addRequirement('Plugin')}>Add plugin
                        </button>
                        <button class="rounded border border-rarity/50 px-3 py-2 text-sm text-rarity hover:bg-rarity/10"
                                type="button" onclick={() => addRequirement('Patch')}>Add patch
                        </button>
                    </div>
                </div>

                <div class="mt-4 grid gap-3">
                    {#each draft.allowedExtensions as extension, index}
                        <div class="rounded-lg border border-parchment-300/20 bg-abyss-900 p-4">
                            <div class="grid gap-3 lg:grid-cols-[9rem_1fr_1fr_auto]">
                                <label>
                                    <span class="mb-1 block text-xs text-parchment-300">Kind</span>
                                    <select class="field" bind:value={extension.kind}>
                                        <option value="Plugin">Plugin</option>
                                        <option value="Patch">Patch</option>
                                    </select>
                                </label>
                                <label>
                                    <span class="mb-1 block text-xs text-parchment-300">Display name</span>
                                    <input class="field" required minlength="2" maxlength="100"
                                           bind:value={extension.name}/>
                                </label>
                                <label>
                                    <span class="mb-1 block text-xs text-parchment-300">Exact filename</span>
                                    <input class="field" required maxlength="255" bind:value={extension.fileName}/>
                                </label>
                                <button class="self-end rounded border border-requirement/45 px-3 py-3 text-requirement hover:bg-requirement/10"
                                        type="button" aria-label={`Remove ${extension.name || extension.kind}`}
                                        onclick={() => removeRequirement(index)}>Remove
                                </button>
                            </div>
                            <label class="mt-3 block">
                                <span class="mb-1 block text-xs text-parchment-300">SHA-256</span>
                                <input class="field hash-field text-sm" required value={extension.sha256}
                                       autocomplete="off" autocapitalize="characters" spellcheck="false"
                                       oninput={(event) => {
                                           const normalized = normalizeSha256(event.currentTarget.value);
                                           extension.sha256 = normalized;
                                           event.currentTarget.value = normalized;
                                       }}/>
                            </label>
                            <label class="mt-3 flex items-start gap-3 rounded border border-parchment-300/20 p-3">
                                <input class="checkbox mt-1" type="checkbox" bind:checked={extension.isRequired}/>
                                <span>
                                    <span class="block text-sm text-parchment-50">Required for this ladder</span>
                                    <span class="mt-1 block text-xs text-parchment-300">Players cannot disable this extension, and Ladder launch is blocked unless its exact file and hash are installed.</span>
                                </span>
                            </label>
                        </div>
                    {:else}
                        <p class="rounded border border-dashed border-parchment-300/25 p-4 text-sm text-parchment-300">
                            No extensions are approved. Ladder launches will disable every installed D2RLoader plugin
                            and patch.</p>
                    {/each}
                </div>
            </div>

            <div class="mt-7 flex justify-end">
                <button class="rounded bg-ember-700 px-5 py-3 text-parchment-50 hover:bg-ember-500 disabled:cursor-wait disabled:opacity-60"
                        type="submit"
                        disabled={saving}>{saving ? 'Saving…' : selectedId ? 'Save ladder' : 'Create ladder'}</button>
            </div>
        </form>
    </div>
{/if}
