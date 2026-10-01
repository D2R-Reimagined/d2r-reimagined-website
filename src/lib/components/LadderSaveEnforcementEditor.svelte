<script lang="ts">
  import {
    getLadderSaveEnforcement,
    updateLadderSaveEnforcement,
    type LadderSaveEnforcement,
    type LadderSaveEnforcementSettings
  } from '$lib/admin';
  import { ApiError } from '$lib/auth';

  type SettingKey = keyof LadderSaveEnforcementSettings;

  interface Setting {
    key: SettingKey;
    label: string;
    description: string;
  }

  const saveChecks: Setting[] = [
    { key: 'enforceProgression', label: 'Progression and item legality',
      description: 'Levels, skill and stat points a character could not have earned, and items no table defines or stacks past their cap.' },
    { key: 'enforceAffixRanges', label: 'Affix ranges',
      description: 'Affixes or stat values the mod\'s generation tables cannot produce.' },
    { key: 'enforceSaveChecksum', label: 'Save checksums',
      description: 'A .d2s whose content does not match its own header checksum. Incomplete files are refused either way.' }
  ];
  const journalChecks: Setting[] = [
    { key: 'enforceUnwitnessedItems', label: 'Unwitnessed items',
      description: 'Items that appear with no journal entry recording them arriving.' },
    { key: 'enforceAreaBounds', label: 'Area bounds',
      description: 'Items first seen somewhere that could not have produced them.' },
    { key: 'enforceUnexplainedChanges', label: 'Unexplained changes',
      description: 'Generation-fixed fields that changed on an existing item, such as an edited stack.' },
    { key: 'enforceRetainedDivestments', label: 'Retained divestments',
      description: 'An item the account\'s own journal watched leave is still in the save it sent afterwards.' }
  ];
  const allSettings = [...saveChecks, ...journalChecks];

  let { ladderId, ladderName }: { ladderId: string; ladderName: string } = $props();

  let current = $state<LadderSaveEnforcement | null>(null);
  let draft = $state<LadderSaveEnforcementSettings | null>(null);
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let notice = $state('');
  let loadSequence = 0;

  let dirty = $derived(current !== null && draft !== null && allSettings.some(({ key }) => current![key] !== draft![key]));
  let enforcedCount = $derived(current === null ? 0 : allSettings.filter(({ key }) => current![key]).length);

  function problemMessage(value: unknown): string {
    return value instanceof ApiError || value instanceof Error ? value.message : 'An unexpected error occurred.';
  }

  function settingsOf(value: LadderSaveEnforcement): LadderSaveEnforcementSettings {
    return Object.fromEntries(allSettings.map(({ key }) => [key, value[key]])) as unknown as LadderSaveEnforcementSettings;
  }

  async function load(id: string): Promise<void> {
    const sequence = ++loadSequence;
    loading = true;
    error = '';
    try {
      const loaded = await getLadderSaveEnforcement(id);
      if (sequence !== loadSequence) return;
      current = loaded;
      draft = settingsOf(loaded);
    } catch (value) {
      if (sequence === loadSequence) error = problemMessage(value);
    } finally {
      if (sequence === loadSequence) loading = false;
    }
  }

  $effect(() => {
    const id = ladderId;
    current = null;
    draft = null;
    notice = '';
    void load(id);
  });

  async function save(): Promise<void> {
    if (!draft || !current || saving) return;
    const turningOn = allSettings.filter(({ key }) => draft![key] && !current![key]).map(({ label }) => label);
    if (turningOn.length > 0 && !confirm(
      `Start refusing saves on ${ladderName} that fail: ${turningOn.join(', ')}?\n\n`
      + 'Players whose saves fail these checks will be unable to sync until they restart from the server copy.'
    )) return;

    const id = ladderId;
    saving = true;
    error = '';
    notice = '';
    try {
      const updated = await updateLadderSaveEnforcement(id, { ...draft });
      if (id !== ladderId) return;
      current = updated;
      draft = settingsOf(updated);
      notice = 'Save enforcement updated. It applies to the next save each player sends.';
    } catch (value) {
      error = problemMessage(value);
    } finally {
      saving = false;
    }
  }
</script>

<div>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-ember-400">Anti-cheat</p>
      <h3 class="display-text mt-1 text-2xl">Save enforcement</h3>
      <p class="mt-2 max-w-3xl text-sm text-parchment-300">
        Choose which checks refuse a save on this ladder. A check that is off still runs and logs what it would have
        refused, so turn each one on only after its log has been quiet through real play.
      </p>
    </div>
    {#if current}
      <div class="rounded border border-parchment-300/20 px-4 py-3 text-sm">
        <span class="block text-xs uppercase tracking-wide text-parchment-300">Refusing on</span>
        <span class={`mt-1 block ${enforcedCount > 0 ? 'text-requirement' : 'text-parchment-50'}`}>
          {enforcedCount === 0 ? 'Nothing — observe only' : `${enforcedCount} of ${allSettings.length} checks`}
        </span>
      </div>
    {/if}
  </div>

  {#if error}<p role="alert" class="mt-4 rounded border border-requirement/45 bg-requirement/10 p-3 text-sm text-requirement">{error}</p>{/if}
  {#if notice}<p class="mt-4 rounded border border-set/40 bg-set/10 p-3 text-sm text-set">{notice}</p>{/if}

  {#if loading}
    <p class="mt-5 text-sm text-parchment-300">Loading save enforcement…</p>
  {:else if draft && current}
    <form class="mt-5" onsubmit={(event) => { event.preventDefault(); void save(); }}>
      <fieldset disabled={saving} class="grid gap-6 lg:grid-cols-2">
        {#each [{ title: 'Save checks', settings: saveChecks, enabled: current.progressionChecksEnabled, setting: 'SaveValidation:Enabled' },
                { title: 'Journal checks', settings: journalChecks, enabled: current.journalChecksEnabled, setting: 'ItemJournal:Enabled / CheckOnWrite' }] as group (group.title)}
          <div class="rounded-lg border border-parchment-300/20 bg-abyss-900 p-4">
            <h4 class="display-text text-lg">{group.title}</h4>
            {#if !group.enabled}
              <p class="mt-2 rounded border border-ember-400/35 bg-ember-950/30 px-3 py-2 text-xs text-ember-200">
                These checks are turned off server-wide ({group.setting}), so nothing here is checked or refused until that is re-enabled.
              </p>
            {/if}
            <div class="mt-3 grid gap-3">
              {#each group.settings as setting (setting.key)}
                <label class="flex items-start gap-3 text-sm text-parchment-200">
                  <input type="checkbox" class="mt-1" bind:checked={draft[setting.key]} />
                  <span>{setting.label}
                    <span class="mt-0.5 block text-xs text-parchment-300">{setting.description}</span>
                  </span>
                </label>
              {/each}
            </div>
          </div>
        {/each}
      </fieldset>
      <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-parchment-300">
          {current.updatedAtUtc ? `Last changed ${new Date(current.updatedAtUtc).toLocaleString()}` : 'Never changed'}
        </p>
        <div class="flex gap-2">
          {#if dirty}
            <button class="rounded border border-parchment-300/30 px-4 py-2 text-sm text-parchment-300" type="button"
                    disabled={saving} onclick={() => draft = settingsOf(current!)}>Discard</button>
          {/if}
          <button class="rounded bg-ember-700 px-4 py-2 text-parchment-50 hover:bg-ember-500 disabled:opacity-50" type="submit"
                  disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save enforcement'}</button>
        </div>
      </div>
    </form>
  {/if}
</div>
