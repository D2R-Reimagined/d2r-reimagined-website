<script lang="ts">
    import {onDestroy, onMount} from 'svelte';

    import {
        activateLadderBundle,
        createLadderBundle,
        createLadder,
        getLadderBundlePublishJob,
        getLadderBundles,
        getLatestLadderBundlePublishJob,
        getLadders,
        revokeLadderBundle,
        startLadder,
        deleteLadder,
        updateLadder,
        type Ladder,
        type LadderAllowedExtensionInput,
        type LadderBundle,
        type LadderBundlePublishJob,
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

    interface BundleDraft {
        minimumLauncherVersion: string;
        requiredD2RLoaderVersion: string;
        supportedGameVersion: string;
    }

    let ladders = $state<Ladder[]>([]);
    let selectedId = $state<string | null>(null);
    let draft = $state<LadderDraft>({name: '', startDate: '', endDate: '', allowedExtensions: []});
    let loading = $state(true);
    let saving = $state(false);
    let error = $state('');
    let notice = $state('');
    let ladderBundles = $state<LadderBundle[]>([]);
    let bundleArchive = $state<File | null>(null);
    let bundleBusy = $state(false);
    let bundleJob = $state<LadderBundlePublishJob | null>(null);
    let bundleUploadProgress = $state<{ loadedBytes: number; totalBytes: number | null; percentage: number | null } | null>(null);
    let publishMonitorGeneration = 0;
    let deleteConfirmName = $state('');
    let deleting = $state(false);
    let bundleDraft = $state<BundleDraft>({
        minimumLauncherVersion: '0.11.0',
        requiredD2RLoaderVersion: '0.0.0',
        supportedGameVersion: '3.2'
    });

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
        publishMonitorGeneration++;
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
        bundleJob = null;
        bundleUploadProgress = null;
        bundleBusy = false;
    }

    function editLadder(ladder: Ladder): void {
        publishMonitorGeneration++;
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
        void loadLadderBundles(ladder.id);
        void recoverLatestPublishJob(ladder.id);
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

    async function loadLadderBundles(ladderId: string): Promise<void> {
        try {
            ladderBundles = await getLadderBundles(ladderId);
        } catch (value) {
            error = problemMessage(value);
            ladderBundles = [];
        }
    }

    function formatBytes(bytes: number): string {
        const units = ['B', 'KiB', 'MiB', 'GiB'];
        let value = Math.max(0, bytes);
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit++;
        }
        return unit === 0 ? `${value.toFixed(0)} ${units[unit]}` : `${value.toFixed(1)} ${units[unit]}`;
    }

    function stageLabel(job: LadderBundlePublishJob): string {
        const labels: Record<LadderBundlePublishJob['stage'], string> = {
            Queued: 'Queued',
            DownloadingSource: 'Loading source',
            ValidatingArchive: 'Validating archive',
            HashingFiles: 'Hashing files',
            SigningManifest: 'Signing manifest',
            PackagingBundle: 'Building package',
            HashingBundle: 'Verifying package',
            UploadingBundle: 'Uploading to Spaces',
            SavingRevision: 'Saving revision',
            Completed: 'Completed',
            Failed: 'Failed'
        };
        return labels[job.stage];
    }

    function delay(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    async function recoverLatestPublishJob(ladderId: string): Promise<void> {
        try {
            const latest = await getLatestLadderBundlePublishJob(ladderId);
            if (selectedId !== ladderId) return;
            bundleJob = latest;
            if (latest?.status === 'Queued' || latest?.status === 'Processing') {
                bundleBusy = true;
                void monitorPublishJob(ladderId, latest.id);
            }
        } catch (value) {
            if (selectedId === ladderId) error = problemMessage(value);
        }
    }

    async function monitorPublishJob(ladderId: string, jobId: string): Promise<void> {
        const generation = ++publishMonitorGeneration;
        let failedPolls = 0;
        while (generation === publishMonitorGeneration && selectedId === ladderId) {
            try {
                const current = await getLadderBundlePublishJob(ladderId, jobId);
                if (generation !== publishMonitorGeneration || selectedId !== ladderId) return;
                bundleJob = current;
                failedPolls = 0;
                if (current.status === 'Completed') {
                    bundleBusy = false;
                    await loadLadderBundles(ladderId);
                    notice = current.message;
                    return;
                }
                if (current.status === 'Failed') {
                    bundleBusy = false;
                    error = current.error || current.message;
                    return;
                }
            } catch (value) {
                failedPolls++;
                if (failedPolls >= 3) {
                    bundleBusy = false;
                    error = `Publishing continues on the server, but progress could not be refreshed: ${problemMessage(value)}`;
                    return;
                }
            }
            await delay(1000);
        }
    }

    async function composeBundle(): Promise<void> {
        if (!selectedId || !bundleArchive) {
            error = 'Choose the complete Reimagined ZIP to upload.';
            return;
        }

        bundleBusy = true;
        bundleJob = null;
        bundleUploadProgress = {loadedBytes: 0, totalBytes: bundleArchive.size, percentage: 0};
        error = '';
        notice = '';
        try {
            const job = await createLadderBundle(selectedId, {
                ...bundleDraft,
                archive: bundleArchive
            }, (progress) => {
                bundleUploadProgress = progress;
            });
            bundleJob = job;
            bundleUploadProgress = null;
            bundleArchive = null;
            notice = 'Source archive uploaded. Package processing will continue in the background.';
            void monitorPublishJob(selectedId, job.id);
        } catch (value) {
            error = problemMessage(value);
            bundleBusy = false;
        } finally {
            bundleUploadProgress = null;
        }
    }

    async function activateBundle(bundle: LadderBundle): Promise<void> {
        if (!selectedId) return;
        bundleBusy = true;
        error = '';
        notice = '';
        try {
            await activateLadderBundle(selectedId, bundle.id);
            ladders = await getLadders();
            await loadLadderBundles(selectedId);
            notice = bundle.status === 'Retired'
                ? `Rolled the ladder back to signed package r${bundle.revision}.`
                : `Signed package r${bundle.revision} is now active.`;
        } catch (value) {
            error = problemMessage(value);
        } finally {
            bundleBusy = false;
        }
    }

    async function revokeBundle(bundle: LadderBundle): Promise<void> {
        if (!selectedId || !confirm(`Revoke ladder package r${bundle.revision}? Revoked packages cannot be reactivated.`)) return;
        bundleBusy = true;
        error = '';
        notice = '';
        try {
            await revokeLadderBundle(selectedId, bundle.id);
            ladders = await getLadders();
            await loadLadderBundles(selectedId);
            notice = `Signed package r${bundle.revision} was revoked.`;
        } catch (value) {
            error = problemMessage(value);
        } finally {
            bundleBusy = false;
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

    async function deleteSelectedLadder(): Promise<void> {
        if (!selectedLadder || deleteConfirmName !== selectedLadder.name) return;
        if (!confirm(
            `Permanently delete "${selectedLadder.name}"?

`
            + 'Every character, save file, signed package and stored artifact belonging to '
            + 'this ladder is destroyed. This cannot be undone.'
        )) {
            return;
        }

        deleting = true;
        error = '';
        notice = '';
        try {
            const result = await deleteLadder(selectedLadder.id, deleteConfirmName);
            deleteConfirmName = '';
            selectedId = null;
            ladderBundles = [];
            resetDraft();
            await loadLadders();
            notice = `Deleted "${result.name}": ${result.charactersDeleted} character(s), `
                + `${result.saveFilesDeleted} save file(s), ${result.bundlesDeleted} package(s), `
                + `${result.storedObjectsDeleted} stored object(s).`;
            if (result.storageWarning) {
                error = result.storageWarning;
            }
        } catch (value) {
            error = problemMessage(value);
        } finally {
            deleting = false;
        }
    }

    onMount(async () => {
        resetDraft();
        await loadLadders();
    });

    onDestroy(() => {
        publishMonitorGeneration++;
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
                        <p class="mt-1 text-sm text-parchment-300">Legacy fallback policy for ladders without an active signed package. Once a package is active, compose and activate a new revision below to change the enforced files.</p>
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

        {#if selectedLadder}
            <section class="panel rounded-lg border border-requirement/40 p-5 sm:p-7">
                <p class="text-xs uppercase tracking-[0.18em] text-requirement">Danger zone</p>
                <h3 class="display-text mt-1 text-2xl">Delete this ladder</h3>
                <p class="mt-2 max-w-3xl text-sm text-parchment-300">
                    Removes <strong>{selectedLadder.name}</strong> along with every character and save
                    file played on it, its extension policy, all signed package revisions, and the
                    stored artifacts behind them. Plugin releases stay in the catalog, because other
                    ladders may share them. This cannot be undone.
                </p>
                <div class="mt-5 grid gap-3 sm:max-w-xl">
                    <label>
                        <span class="mb-2 block text-sm text-parchment-200">
                            Type <span class="text-requirement">{selectedLadder.name}</span> to confirm
                        </span>
                        <input class="field" bind:value={deleteConfirmName} placeholder={selectedLadder.name}
                               autocomplete="off" />
                    </label>
                    <button class="justify-self-start rounded border border-requirement/60 px-4 py-2 text-requirement hover:bg-requirement/10 disabled:cursor-not-allowed disabled:opacity-40"
                            type="button"
                            disabled={deleting || deleteConfirmName !== selectedLadder.name}
                            onclick={() => void deleteSelectedLadder()}>
                        {deleting ? 'Deleting…' : 'Delete ladder permanently'}
                    </button>
                </div>
            </section>

            <section class="panel rounded-lg p-5 sm:p-7 xl:col-start-2">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p class="text-xs uppercase tracking-[0.18em] text-ember-400">Secure distribution</p>
                        <h3 class="display-text mt-1 text-2xl">Signed ladder packages</h3>
                        <p class="mt-2 max-w-3xl text-sm text-parchment-300">Upload one ZIP containing the complete Reimagined folder. The API inventories and hashes every file, detects D2RLoader plugins, and creates one signed package. Activating an older revision performs a rollback.</p>
                    </div>
                    <div class="rounded border border-parchment-300/20 px-4 py-3 text-sm">
                        <span class="block text-xs uppercase tracking-wide text-parchment-300">Active revision</span>
                        <span class="mt-1 block text-parchment-50">{selectedLadder.activeBundle ? `r${selectedLadder.activeBundle.revision}` : 'None — launcher blocked'}</span>
                    </div>
                </div>

                <form class="mt-7 rounded-lg border border-parchment-300/20 bg-abyss-900 p-4"
                      onsubmit={(event) => { event.preventDefault(); void composeBundle(); }}>
                    <h4 class="display-text text-xl">Upload and sign the complete package</h4>
                    <p class="mt-1 text-sm text-parchment-300">The ZIP must have exactly one top-level <code>Reimagined/</code> folder. All files beneath it—including JSON and TXT data—become mandatory signed files. The mod version is read from <code>modinfo.json</code>; no hashes are entered manually.</p>

                    <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <label class="md:col-span-2 xl:col-span-3">
                            <span class="mb-1 block text-xs text-parchment-300">Complete Reimagined ZIP</span>
                            <input class="field" required type="file" accept=".zip,application/zip"
                                   onchange={(event) => bundleArchive = event.currentTarget.files?.[0] ?? null}/>
                            {#if bundleArchive}
                                <span class="mt-1 block text-xs text-parchment-300">{bundleArchive.name} · {(bundleArchive.size / 1024 / 1024).toFixed(1)} MiB</span>
                            {/if}
                        </label>
                        <label>
                            <span class="mb-1 block text-xs text-parchment-300">Minimum launcher</span>
                            <input class="field" required maxlength="32" bind:value={bundleDraft.minimumLauncherVersion}/>
                        </label>
                        <label>
                            <span class="mb-1 block text-xs text-parchment-300">Minimum D2RLoader</span>
                            <input class="field" required maxlength="32" bind:value={bundleDraft.requiredD2RLoaderVersion}/>
                        </label>
                        <label>
                            <span class="mb-1 block text-xs text-parchment-300">Supported game version</span>
                            <input class="field" required maxlength="32" bind:value={bundleDraft.supportedGameVersion}/>
                        </label>
                    </div>
                    {#if bundleUploadProgress}
                        <div class="mt-4 rounded-lg border border-ember-400/35 bg-abyss-950 p-4">
                            <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
                                <span class="text-parchment-50">{bundleUploadProgress.percentage !== null && bundleUploadProgress.percentage >= 100 ? 'Upload received; staging source archive' : 'Uploading source archive'}</span>
                                <span class="text-ember-300">{bundleUploadProgress.percentage === null ? 'Working…' : `${bundleUploadProgress.percentage.toFixed(1)}%`}</span>
                            </div>
                            <div class="mt-3 h-2 overflow-hidden rounded-full bg-parchment-300/15">
                                <div class="h-full rounded-full bg-ember-500 transition-[width] duration-200"
                                     style={`width: ${bundleUploadProgress.percentage ?? 5}%`}></div>
                            </div>
                            <p class="mt-2 text-xs text-parchment-300">
                                {formatBytes(bundleUploadProgress.loadedBytes)}{bundleUploadProgress.totalBytes === null ? '' : ` of ${formatBytes(bundleUploadProgress.totalBytes)}`}
                            </p>
                        </div>
                    {/if}
                    {#if bundleJob}
                        <div class={`mt-4 rounded-lg border p-4 ${bundleJob.status === 'Failed' ? 'border-requirement/50 bg-requirement/10' : bundleJob.status === 'Completed' ? 'border-set/45 bg-set/10' : 'border-ember-400/35 bg-abyss-950'}`}>
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p class="text-sm text-parchment-50">{stageLabel(bundleJob)}</p>
                                    <p class="mt-1 text-xs text-parchment-300">{bundleJob.message}</p>
                                </div>
                                <span class="text-sm text-ember-300">{bundleJob.progressPercent}%</span>
                            </div>
                            <div class="mt-3 h-2 overflow-hidden rounded-full bg-parchment-300/15">
                                <div class={`h-full rounded-full transition-[width] duration-300 ${bundleJob.status === 'Failed' ? 'bg-requirement' : bundleJob.status === 'Completed' ? 'bg-set' : 'bg-ember-500'}`}
                                     style={`width: ${bundleJob.progressPercent}%`}></div>
                            </div>
                            {#if bundleJob.detail}
                                <p class="mt-2 text-xs text-parchment-300">{bundleJob.detail}</p>
                            {/if}
                            {#if bundleJob.processedFiles !== null && bundleJob.totalFiles !== null}
                                <p class="mt-1 text-xs text-parchment-300">{bundleJob.processedFiles.toLocaleString()} of {bundleJob.totalFiles.toLocaleString()} files</p>
                            {/if}
                            {#if bundleJob.error}
                                <p class="mt-2 text-sm text-requirement">{bundleJob.error}</p>
                            {/if}
                            <p class="mt-2 text-[0.7rem] text-parchment-300">Last updated {new Date(bundleJob.updatedAtUtc).toLocaleTimeString()}</p>
                        </div>
                    {/if}
                    <div class="mt-4 flex justify-end">
                        <button class="rounded bg-ember-700 px-4 py-2 text-parchment-50 hover:bg-ember-500 disabled:opacity-50"
                                type="submit" disabled={bundleBusy || !bundleArchive}>{bundleBusy ? 'Publishing package…' : 'Upload and publish package'}</button>
                    </div>
                </form>

                <div class="mt-6">
                    <h4 class="display-text text-xl">Activate, roll back, or revoke</h4>
                    <div class="mt-3 grid gap-3">
                        {#each ladderBundles as bundle}
                            <div class="rounded-lg border border-parchment-300/20 bg-abyss-900 p-4">
                                <div class="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="text-parchment-50">Revision {bundle.revision}</span>
                                            <span class="rounded border border-parchment-300/25 px-2 py-1 text-xs uppercase tracking-wide">{bundle.status}</span>
                                        </div>
                                        <p class="mt-2 text-xs text-parchment-300">{bundle.files.length} files · {bundle.plugins.length} plugins · mod {bundle.compatibility.requiredModVersion} · key {bundle.signingKeyId} · {new Date(bundle.createdAtUtc).toLocaleString()}</p>
                                        {#if bundle.plugins.length > 0}
                                            <p class="mt-1 text-xs text-parchment-300">{bundle.plugins.map((plugin) => plugin.name).join(', ')}</p>
                                        {/if}
                                        <p class="mt-1 break-all font-mono text-[0.7rem] text-parchment-300">Artifact {bundle.artifactSha256}</p>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        {#if bundle.status !== 'Active' && bundle.status !== 'Revoked'}
                                            <button class="rounded border border-set/50 px-3 py-2 text-sm text-set hover:bg-set/10 disabled:opacity-50"
                                                    type="button" disabled={bundleBusy} onclick={() => void activateBundle(bundle)}>
                                                {bundle.status === 'Retired' ? 'Roll back to this' : 'Activate'}
                                            </button>
                                        {/if}
                                        {#if bundle.status !== 'Revoked'}
                                            <button class="rounded border border-requirement/45 px-3 py-2 text-sm text-requirement hover:bg-requirement/10 disabled:opacity-50"
                                                    type="button" disabled={bundleBusy} onclick={() => void revokeBundle(bundle)}>Revoke</button>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {:else}
                            <p class="rounded border border-dashed border-parchment-300/25 p-4 text-sm text-parchment-300">No signed package revisions exist for this ladder.</p>
                        {/each}
                    </div>
                </div>
            </section>
        {/if}
    </div>
{/if}
