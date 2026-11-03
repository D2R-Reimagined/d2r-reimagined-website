<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { authState, apiRequest } from '#lib/auth.js';
  import { getBuild, type BuildDetails, type BuildPage, type BuildSummary } from '#lib/builds.js';
  import { i18n } from '#lib/i18n.js';
  import M from '#lib/loot-filter/model.js';
  import { fromExport } from '#lib/loot-filter/catalog.js';
  import {
    listFilters,
    getFilter,
    useFilter,
    saveFilter,
    deleteFilter,
    setFilterVisibility,
    type FilterSummary,
    type PublicFilterDetails
  } from '#lib/loot-filter/api.js';
  import {
    newDraft,
    fromRemote,
    isDirty,
    contentKey,
    type FilterDraft,
    type LocalLibrary
  } from '#lib/loot-filter/library.js';
  import { loadLibrary, saveLibrary } from '#lib/loot-filter/workspace.js';
  import { stopSound } from '#lib/loot-filter/sound-preview.js';
  import { blockOf, kindOf, type Catalog, type Filter, type Visibility } from '#lib/loot-filter/types.js';
  import RuleEditor from '../loot-filter/RuleEditor.svelte';
  import TierListEditor from './TierListEditor.svelte';
  import StyleAndSoundsPanel from './StyleAndSoundsPanel.svelte';
  import SimulatorPanel from './SimulatorPanel.svelte';
  import {
    ALL_EQUIPMENT_FAMILY_IDS,
    BUILD_ARCHETYPES,
    BUILD_CLASSES,
    CATEGORIES,
    CURATED_BUILD_PRESETS,
    DEFAULT_BUILD_PROFILE,
    EQUIPMENT_FAMILIES,
    STRICTNESS_PRESETS,
    THEME_PRESETS,
    TIERABLE_ITEMS,
    TIER_RANKS,
    applyBuildCuration,
    applyCuratedBuildPreset,
    applySiteBuildToConfig,
    compileV2Filter,
    createDefaultV2Config,
    effectiveItemTier,
    extractV2ConfigFromFilter,
    selectArchetypeForBuild,
    selectClassForBuild,
    toggleEquipmentFamily,
    type BuildArchetypeId,
    type BuildClassId,
    type CategoryId,
    type EquipmentFamilyId,
    type SiteBuildSnapshotItem,
    type StrictnessId,
    type TierRank,
    type V2Config
  } from '#lib/loot-filter/v2-compiler.js';

  let {
    linkId = null,
    shared = null,
    sharedError = ''
  }: {
    linkId?: string | null;
    shared?: PublicFilterDetails | null;
    sharedError?: string;
  } = $props();

  type WorkspaceTab = 'overview' | 'customize' | 'style' | 'simulate' | 'advanced';

  let activeTab = $state<WorkspaceTab>('overview');
  let activeCategory = $state<CategoryId>('runes');
  let customizerSearch = $state('');
  let showLibraryDrawer = $state(false);

  // Library & persistence state
  let entries = $state<FilterDraft[]>([]);
  let remote = $state<FilterSummary[]>([]);
  let lastId = $state<string | null>(null);
  let owner = $state('');
  let loaded = $state(false);
  let busy = $state(false);
  // svelte-ignore state_referenced_locally
  let pendingLink = $state<string | null>(linkId);
  let viewingShared = $state<PublicFilterDetails | null>(null);
  let error = $state('');
  let notice = $state('');
  let localStatus = $state('Loading filters…');
  let epoch = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: LocalLibrary | undefined;
  let writes = Promise.resolve();
  let importInput = $state<HTMLInputElement>();

  // Catalog state
  let catalog = $state.raw<Catalog>(M.buildCatalog({}));
  let catalogStatus = $state('Loading Reimagined item catalog…');
  let catalogError = $state(false);
  let catalogLoading = $state(true);
  let catalogReq = 0;

  // Active FilterBlade V2 config state
  let v2Config = $state<V2Config>(createDefaultV2Config('semi-strict', 'reimagined'));
  let isLegacyFilter = $state(false);
  let selectedCustomRuleIdx = $state(0);

  const active = $derived(entries.find(e => e.id === lastId));
  const account = $derived(owner !== '' && owner !== 'guest');
  const activeStrictnessInfo = $derived(
    STRICTNESS_PRESETS.find(s => s.id === v2Config.strictness) ?? STRICTNESS_PRESETS[2]
  );
  const validation = $derived(
    active ? M.validateFilter(active.document, catalog) : { errors: [], warnings: [], bytes: 0, json: '{}' }
  );

  const cards = $derived(
    [
      ...entries.map(entry => ({
        id: entry.id,
        remoteId: entry.remoteId,
        name: entry.name,
        ruleCount: entry.document.rules.length,
        revision: entry.revision,
        modified: entry.updatedAt,
        dirty: isDirty(entry),
        local: true,
        isPublic: !!entry.remoteId && !!entry.isPublic
      })),
      ...remote
        .filter(row => !entries.some(entry => entry.remoteId === row.id))
        .map(row => ({
          id: row.id,
          remoteId: row.id,
          name: row.name,
          ruleCount: row.ruleCount,
          revision: row.revision,
          modified: Date.parse(row.updatedAtUtc),
          dirty: false,
          local: false,
          isPublic: row.isPublic
        }))
    ].sort((a, b) => b.modified - a.modified)
  );

  const overrideCounts = $derived({
    items: Object.keys(v2Config.itemOverrides).length,
    bases: v2Config.customBases.length,
    styles:
      Object.keys(v2Config.tierStyleOverrides).length +
      Object.keys(v2Config.categoryTierStyleOverrides).length,
    customRules: v2Config.customPriorityRules.length
  });

  const categoryBreakdown = $derived(
    CATEGORIES.map(cat => {
      const catItems = TIERABLE_ITEMS.filter(i => i.category === cat.id);
      const counts: Record<TierRank, number> = { S: 0, A: 0, B: 0, C: 0, D: 0, HIDE: 0 };
      let modified = 0;
      for (const item of catItems) {
        const t = effectiveItemTier(item, v2Config);
        counts[t]++;
        if (v2Config.itemOverrides[item.id] !== undefined) modified++;
      }
      return { ...cat, total: catItems.length, counts, modified };
    })
  );

  const v2Path = (id?: string | null) =>
    id ? `/loot-filterv2/${encodeURIComponent(id)}` : '/loot-filterv2';

  const currentPath = $derived(
    viewingShared
      ? v2Path(viewingShared.id)
      : active?.remoteId
        ? v2Path(active.remoteId)
        : v2Path(pendingLink)
  );

  function syncV2FromDraft(draft: FilterDraft | undefined) {
    if (!draft) return;
    const extracted = extractV2ConfigFromFilter(draft.document);
    if (extracted) {
      v2Config = extracted;
      isLegacyFilter = false;
    } else {
      // Legacy v1 filter: preserve its rules in customPriorityRules or let user convert
      isLegacyFilter = true;
      v2Config = createDefaultV2Config('semi-strict', 'reimagined');
    }
    selectedCustomRuleIdx = v2Config.customPriorityRules.length ? 0 : -1;
  }

  function applyV2Changes() {
    if (!active) return;
    isLegacyFilter = false;
    active.document = compileV2Filter(v2Config);
    active.updatedAt = Date.now();
  }

  function convertLegacyToV2(keepExistingRulesAsCustom: boolean) {
    if (!active) return;
    const next = createDefaultV2Config('semi-strict', 'reimagined');
    if (keepExistingRulesAsCustom) {
      next.customPriorityRules = M.clone(
        active.document.rules.filter(r => {
          const b = r.show ?? r.hide;
          return b?.conditions && Object.keys(b.conditions).length > 0;
        })
      );
    }
    v2Config = next;
    isLegacyFilter = false;
    active.document = compileV2Filter(v2Config);
    active.updatedAt = Date.now();
    notice = keepExistingRulesAsCustom
      ? 'Converted to FilterBlade v2 and kept your existing rules in Custom Priority Rules.'
      : 'Reset filter to FilterBlade v2 Semi-Strict preset.';
  }

  function flush() {
    if (timer) clearTimeout(timer);
    const snapshot = pending;
    pending = undefined;
    if (!snapshot) return writes;
    writes = writes
      .then(() => saveLibrary(snapshot))
      .then(() => {
        if (snapshot.key === `library:${owner}` && !pending) {
          localStatus = 'Saved in this browser';
        }
      })
      .catch(() => {
        if (snapshot.key === `library:${owner}`) {
          localStatus = 'Browser save unavailable — download a backup';
        }
      });
    return writes;
  }

  async function loadCatalog(language = $i18n.code) {
    const req = ++catalogReq;
    catalogLoading = true;
    catalogError = false;
    catalogStatus = 'Loading Reimagined item catalog…';
    const json = async (url: string) => {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Data request failed (${res.status})`);
      return res.json();
    };
    try {
      const [bundle, english, localized] = await Promise.all([
        json('/data/keyed/loot-filter.json'),
        json('/data/strings/enUS.json'),
        language === 'enUS' ? Promise.resolve({}) : json(`/data/strings/${language}.json`)
      ]);
      if (req !== catalogReq) return;
      catalog = fromExport(bundle, { ...english, ...localized });
      catalogStatus = `${catalog.baseItems.length.toLocaleString()} bases · ${catalog.uniqueItems.length.toLocaleString()} uniques · ${catalog.setItems.length.toLocaleString()} sets`;
    } catch {
      if (req !== catalogReq) return;
      catalogError = true;
      catalogStatus = 'Catalog could not load. Retry to enable item search.';
    } finally {
      if (req === catalogReq) catalogLoading = false;
    }
  }

  $effect(() => {
    if (!$authState.ready) return;
    const identity = $authState.user?.id ?? 'guest';
    untrack(() => {
      if (identity !== owner) void initialize(identity);
    });
  });

  $effect(() => {
    const language = $i18n.code;
    if (loaded) untrack(() => void loadCatalog(language));
  });

  $effect(() => {
    if (!loaded) return;
    const snapshot: LocalLibrary = {
      key: `library:${owner}`,
      version: 1,
      entries: JSON.parse(JSON.stringify(entries)),
      lastId
    };
    pending = snapshot;
    untrack(() => (localStatus = 'Saving in this browser…'));
    timer = setTimeout(() => void flush(), 300);
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  $effect(() => {
    const path = currentPath;
    if (loaded && typeof location !== 'undefined' && location.pathname !== path) {
      void goto(path, { shallow: true, replace: true });
    }
  });

  onMount(() => {
    void loadCatalog($i18n.code);
    const hide = () => {
      if (document.visibilityState === 'hidden') void flush();
    };
    const unload = () => void flush();
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
    const req = ++epoch;
    const persisted = flush();
    stopSound();
    owner = identity;
    loaded = false;
    busy = false;
    viewingShared = null;
    entries = [];
    remote = [];
    lastId = null;
    error = '';
    notice = '';
    try {
      await persisted;
      const saved = await loadLibrary(identity);
      if (req !== epoch) return;
      entries = saved.entries.filter(entry => !M.validateFilter(entry.document).errors.length);
      lastId = entries.some(entry => entry.id === saved.lastId) ? saved.lastId : entries[0]?.id ?? null;
    } catch {
      if (req === epoch) localStatus = 'Browser save unavailable — download a backup';
    }
    if (req !== epoch) return;

    if (identity !== 'guest') {
      try {
        const library = await listFilters();
        if (req !== epoch) return;
        remote = library.items;
        entries = entries.map(entry => {
          if (!entry.remoteId) return entry;
          const row = remote.find(r => r.id === entry.remoteId);
          return row
            ? { ...entry, isPublic: row.isPublic }
            : { ...entry, remoteId: undefined, revision: 0, savedContent: undefined, isPublic: false };
        });
        const localLast = entries.find(e => e.id === lastId);
        const latest = remote.find(r => r.id === library.lastUsedId);
        if (latest && (!localLast || Date.parse(latest.lastUsedAtUtc) >= localLast.lastUsedAt)) {
          const details = await getFilter(latest.id);
          if (req !== epoch) return;
          const cached = entries.find(e => e.remoteId === latest.id);
          const draft = cached && isDirty(cached) ? cached : fromRemote(details, cached);
          entries = [...entries.filter(e => e.id !== draft.id), draft];
          lastId = draft.id;
        }
      } catch {
        // Offline or cloud unavailable: keep browser library active
      }
    }

    if (req !== epoch) return;

    // Resolve shared/private link if present
    if (pendingLink) {
      const id = pendingLink;
      const cached = entries.find(e => e.remoteId === id);
      if (account && (cached || remote.some(r => r.id === id))) {
        await openFilter(cached?.id ?? id, !!cached, id, true);
        pendingLink = null;
      } else if (shared?.id.toLowerCase() === id.toLowerCase()) {
        viewingShared = shared;
        const extracted = extractV2ConfigFromFilter(shared.document);
        if (extracted) v2Config = extracted;
      } else if (sharedError) {
        error = sharedError;
      }
    }

    // If no filter exists yet in browser/account, auto-create a FilterBlade Semi-Strict filter!
    if (!entries.length && !viewingShared) {
      const initialCfg = createDefaultV2Config('semi-strict', 'reimagined');
      const draft = newDraft('My Semi-Strict Filter', compileV2Filter(initialCfg));
      entries = [draft];
      lastId = draft.id;
    }

    syncV2FromDraft(entries.find(e => e.id === lastId));
    loaded = true;
    localStatus = 'Saved in this browser';
  }

  async function createNewV2Filter(strictness: StrictnessId = v2Config.strictness, name?: string) {
    if (entries.length >= 50) {
      error = 'Your library holds up to 50 filters. Delete an old filter first.';
      return;
    }
    const presetInfo = STRICTNESS_PRESETS.find(s => s.id === strictness) ?? STRICTNESS_PRESETS[2];
    const cfg = createDefaultV2Config(strictness, v2Config.theme);
    const label = (name?.trim() || `My ${presetInfo.shortLabel} Filter`).slice(0, 80);
    const draft = newDraft(label, compileV2Filter(cfg));
    entries.push(draft);
    lastId = draft.id;
    pendingLink = null;
    viewingShared = null;
    syncV2FromDraft(draft);
    notice = `Created new ${presetInfo.name} filter.`;
  }

  async function openFilter(id: string, local: boolean, remoteId?: string, fromLink = false) {
    if (busy) return;
    const req = epoch;
    if (!fromLink) pendingLink = null;
    busy = true;
    error = '';
    notice = '';
    try {
      let draft = local ? entries.find(e => e.id === id) : undefined;
      if (remoteId && account) {
        try {
          const details = await useFilter(remoteId);
          if (req !== epoch) return;
          if (!draft || !isDirty(draft)) draft = fromRemote(details, draft);
        } catch (err) {
          if (!draft) throw err;
        }
      }
      if (req !== epoch || !draft) return;
      draft.lastUsedAt = Date.now();
      entries = [...entries.filter(e => e.id !== draft!.id), draft];
      lastId = draft.id;
      viewingShared = null;
      syncV2FromDraft(draft);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Could not open filter.';
    } finally {
      if (req === epoch) busy = false;
    }
  }

  async function saveToAccount(copy = false) {
    if (!active || !account || busy) return;
    if (!active.name.trim() || active.name.length > 80) {
      error = 'Give this filter a name of 1–80 characters.';
      return;
    }
    if (validation.errors.length > 0) {
      error = 'Fix validation errors before saving to your account.';
      return;
    }
    const req = epoch;
    const id = active.id;
    const snapshot = JSON.parse(JSON.stringify(active)) as FilterDraft;
    busy = true;
    error = '';
    notice = '';
    try {
      const details = await saveFilter(
        copy ? undefined : snapshot.remoteId,
        copy ? `${snapshot.name.slice(0, 73)} (copy)` : snapshot.name,
        snapshot.document,
        copy ? 0 : snapshot.revision
      );
      if (req !== epoch) return;
      const current = entries.find(e => e.id === id);
      if (copy) {
        const draft = fromRemote(details);
        entries.push(draft);
        lastId = draft.id;
        syncV2FromDraft(draft);
      } else if (current) {
        current.remoteId = details.id;
        current.revision = details.revision;
        current.savedContent = contentKey(details.name, details.document);
        current.updatedAt = Date.parse(details.updatedAtUtc);
        current.isPublic = details.isPublic;
      }
      remote = [details, ...remote.filter(r => r.id !== details.id)];
      notice = 'Saved to your account. Select it in the Reimagined Launcher to apply in game.';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Could not save to account.';
    } finally {
      if (req === epoch) busy = false;
    }
  }

  async function removeCard(card: (typeof cards)[number]) {
    if (busy || !confirm(`Delete “${card.name}”?`)) return;
    const req = epoch;
    busy = true;
    error = '';
    try {
      if (card.remoteId) await deleteFilter(card.remoteId, card.revision);
      if (req !== epoch) return;
      entries = entries.filter(e => e.id !== card.id);
      remote = remote.filter(r => r.id !== card.remoteId);
      if (lastId === card.id) {
        if (!entries.length) {
          const initialCfg = createDefaultV2Config('semi-strict', 'reimagined');
          const draft = newDraft('My Semi-Strict Filter', compileV2Filter(initialCfg));
          entries = [draft];
        }
        lastId = entries[0]?.id ?? null;
        syncV2FromDraft(entries.find(e => e.id === lastId));
      }
      notice = 'Filter deleted.';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Could not delete filter.';
    } finally {
      if (req === epoch) busy = false;
    }
  }

  async function togglePublicVisibility() {
    if (!active?.remoteId || busy) return;
    const req = epoch;
    busy = true;
    error = '';
    try {
      const details = await setFilterVisibility(active.remoteId, !active.isPublic);
      if (req !== epoch) return;
      active.isPublic = details.isPublic;
      remote = remote.map(r => (r.id === details.id ? { ...r, isPublic: details.isPublic } : r));
      notice = details.isPublic
        ? 'Filter is now Public. Anyone with the link can view or copy it.'
        : 'Filter is now Private.';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Could not change visibility.';
    } finally {
      if (req === epoch) busy = false;
    }
  }

  async function copyShareLink(id: string) {
    const url = new URL(v2Path(id), location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      notice = 'Share link copied to clipboard.';
    } catch {
      notice = `Share link: ${url}`;
    }
  }

  function downloadJson() {
    if (!active || validation.errors.length > 0) return;
    const url = URL.createObjectURL(new Blob([validation.json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filter.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice = 'Downloaded filter.json. Place it in mods/Reimagined/d2rloader/config (or apply via the Reimagined Launcher).';
  }

  async function handleFileImport(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      if (file.size > M.MAX_BYTES) throw new Error('Filter exceeds the 4 MiB limit.');
      const parsed = JSON.parse(await file.text()) as Filter;
      const res = M.validateFilter(parsed, catalog);
      if (res.errors.length) throw new Error(res.errors.slice(0, 3).join(' '));
      const draft = newDraft(file.name.replace(/\.json$/i, '') || 'Imported Filter', parsed);
      entries.push(draft);
      lastId = draft.id;
      viewingShared = null;
      syncV2FromDraft(draft);
      notice = 'Imported filter.json into your library.';
    } catch (err) {
      error = `Import failed: ${err instanceof Error ? err.message : 'Invalid file'}`;
    }
  }

  // Custom Priority Rules helpers (Advanced tab)
  function addCustomPriorityRule(kind: Visibility) {
    v2Config.customPriorityRules = [M.makeRule(kind), ...v2Config.customPriorityRules];
    selectedCustomRuleIdx = 0;
    applyV2Changes();
  }

  function removeCustomPriorityRule(idx: number) {
    v2Config.customPriorityRules.splice(idx, 1);
    v2Config.customPriorityRules = [...v2Config.customPriorityRules];
    selectedCustomRuleIdx = v2Config.customPriorityRules.length
      ? Math.max(0, Math.min(selectedCustomRuleIdx, v2Config.customPriorityRules.length - 1))
      : -1;
    applyV2Changes();
  }

  // Build Curation / Auto-Adjust for Build state & helpers
  let siteBuildQuery = $state('');
  let siteBuildResults = $state<BuildSummary[]>([]);
  let siteBuildLoading = $state(false);
  let siteBuildMessage = $state('');
  let lastSyncedBuildItems = $state<string[]>([]);

  const equipmentGroups = [
    {
      id: 'ranged',
      title: 'Ranged, Thrown & Quivers',
      items: EQUIPMENT_FAMILIES.filter(f => f.group === 'Ranged & Thrown')
    },
    {
      id: 'melee',
      title: 'Melee Weapons',
      items: EQUIPMENT_FAMILIES.filter(f => f.group === 'Melee Weapons')
    },
    {
      id: 'caster-class',
      title: 'Caster Weapons, Shields & Class Gear',
      items: EQUIPMENT_FAMILIES.filter(f => f.group === 'Caster, Shields & Class Gear')
    }
  ] as const;

  const enabledFamilyCount = $derived(
    ALL_EQUIPMENT_FAMILY_IDS.length - (v2Config.buildProfile?.disabledFamilies?.length ?? 0)
  );

  function isFamilyEnabled(familyId: EquipmentFamilyId): boolean {
    return !(v2Config.buildProfile?.disabledFamilies ?? []).includes(familyId);
  }

  function chooseBuildClass(clsId: BuildClassId) {
    const nextClass = v2Config.buildProfile?.selectedClass === clsId ? null : clsId;
    selectClassForBuild(v2Config, nextClass);
    applyV2Changes();
  }

  function chooseBuildArchetype(archId: BuildArchetypeId | null) {
    const nextArch = archId && v2Config.buildProfile?.archetype === archId && !v2Config.buildProfile?.selectedClass ? null : archId;
    selectArchetypeForBuild(v2Config, nextArch);
    applyV2Changes();
  }

  function handleToggleEquipmentFamily(familyId: EquipmentFamilyId) {
    toggleEquipmentFamily(v2Config, familyId);
    applyV2Changes();
  }

  function enableAllEquipmentFamilies() {
    applyBuildCuration(v2Config, {
      ...v2Config.buildProfile,
      disabledFamilies: [],
      presetId: undefined
    });
    applyV2Changes();
  }

  function selectCuratedPreset(presetId: string) {
    const preset = applyCuratedBuildPreset(v2Config, presetId);
    if (preset) {
      applyV2Changes();
      notice = `Auto-adjusted filter for ${preset.title}: selected ${preset.characterClass} (${preset.archetype}) weapon types and pinned ${preset.pinnedBases.length} chase bases to Tier S.`;
    }
  }

  function clearBuildCuration() {
    applyBuildCuration(v2Config, { ...DEFAULT_BUILD_PROFILE, disabledFamilies: [] });
    v2Config.customBases = v2Config.customBases.filter(cb => !cb.id.startsWith('build-'));
    applyV2Changes();
    notice = 'Cleared archetype & class filter overrides and enabled all weapon & class item types.';
  }

  async function fetchBuildPageWithFallback(query: string): Promise<BuildPage<BuildSummary>> {
    const params = new URLSearchParams({ search: query, sort: 'rating', count: '8' });
    try {
      const proxyRes = await fetch(`/loot-filterv2/builds-proxy?${params}`);
      if (proxyRes.ok) {
        return (await proxyRes.json()) as BuildPage<BuildSummary>;
      }
    } catch {
      // Fall through to apiRequest
    }
    return await apiRequest<BuildPage<BuildSummary>>(`/builds?${params}`, {}, 'optional');
  }

  async function fetchBuildDetailsWithFallback(buildId: string): Promise<BuildDetails> {
    try {
      const proxyRes = await fetch(`/loot-filterv2/builds-proxy?id=${encodeURIComponent(buildId)}`);
      if (proxyRes.ok) {
        return (await proxyRes.json()) as BuildDetails;
      }
    } catch {
      // Fall through to getBuild
    }
    return await getBuild(buildId, false);
  }

  async function searchOrImportSiteBuild() {
    const q = siteBuildQuery.trim();
    siteBuildMessage = '';
    // Check if input is a direct /builds/<id> URL or raw UUID
    const urlMatch = /\/builds\/([^/?#\s]+)/i.exec(q);
    const uuidMatch = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.exec(q);
    const extractedId = urlMatch?.[1] ?? uuidMatch?.[0];
    if (extractedId && extractedId !== 'new' && extractedId !== 'mine') {
      await importSiteBuildById(extractedId);
      return;
    }
    siteBuildLoading = true;
    try {
      const page = await fetchBuildPageWithFallback(q);
      siteBuildResults = page.items ?? [];
      if (siteBuildResults.length === 0) {
        siteBuildMessage = 'No published community builds matched that query. Try leaving the box blank and clicking Find / Sync to browse top builds.';
      }
    } catch {
      siteBuildMessage = 'Build library API is unreachable offline — use the 8 Signature Class Build Presets or Class toggles above.';
    } finally {
      siteBuildLoading = false;
    }
  }

  async function importSiteBuildById(buildId: string) {
    siteBuildLoading = true;
    siteBuildMessage = '';
    try {
      const details: BuildDetails = await fetchBuildDetailsWithFallback(buildId);
      const itemKeys: { catalog: string; key: string; name?: string }[] = [];
      const proseParts: string[] = [
        details.build.title || '',
        details.build.summary || '',
        details.content.title || '',
        details.content.summary || ''
      ];

      for (const variant of details.content.document?.variants ?? []) {
        if (variant.name) proseParts.push(variant.name);
        if (variant.description) proseParts.push(variant.description);
        for (const block of variant.blocks ?? []) {
          if (block.title) proseParts.push(block.title);
          if (block.body) proseParts.push(block.body);
          for (const ref of block.items ?? []) {
            itemKeys.push({ catalog: ref.catalog, key: ref.key });
          }
          for (const gear of block.manualGear ?? []) {
            if (gear.item) {
              itemKeys.push({ catalog: gear.item.catalog, key: gear.item.key, name: gear.name });
            } else if (gear.name) {
              itemKeys.push({ catalog: 'bases', key: gear.name, name: gear.name });
            }
            if (gear.name) proseParts.push(gear.name);
            if (gear.notes) proseParts.push(gear.notes);
          }
        }
      }

      // Extract equipped character & mercenary items from attached Character Save Snapshots
      const snapshotItems: SiteBuildSnapshotItem[] = [];
      for (const equip of Object.values(details.equipment ?? {})) {
        const charEntries = equip?.save?.items?.entries ?? [];
        for (const entry of charEntries) {
          const isEquipped =
            entry.position?.mode === 'Equipped' ||
            (typeof entry.position?.bodyLocationId === 'number' && entry.position.bodyLocationId > 0);
          if (isEquipped && entry.codeText) {
            snapshotItems.push({
              code: entry.codeText,
              baseName: entry.baseName,
              quality: entry.quality,
              sockets: Array.isArray(entry.sockets) ? entry.sockets.length : undefined,
              isRuneword: entry.runewordId != null
            });
          }
        }
        const mercEntries = equip?.save?.mercenaryItems?.entries ?? [];
        for (const entry of mercEntries) {
          if (entry.codeText) {
            snapshotItems.push({
              code: entry.codeText,
              baseName: entry.baseName,
              quality: entry.quality,
              sockets: Array.isArray(entry.sockets) ? entry.sockets.length : undefined,
              isRuneword: entry.runewordId != null
            });
          }
        }
      }

      const res = applySiteBuildToConfig(
        v2Config,
        {
          id: details.build.id,
          title: details.build.title || details.content.title,
          characterClass: details.build.characterClass || details.content.characterClass,
          itemKeys,
          snapshotItems,
          proseText: proseParts.join('\n')
        },
        catalog
      );

      // Also resolve any Runewords referenced in the build to promote their required Runes (r01..r33)
      const runewordRefs = itemKeys.filter(k => k.catalog === 'runewords');
      let promotedRunesCount = 0;
      if (runewordRefs.length > 0) {
        try {
          const rwRes = await fetch('/data/keyed/runewords.json');
          if (rwRes.ok) {
            const rwRows = (await rwRes.json()) as {
              Index?: string;
              NameKey?: string;
              Runes?: { NameKey?: string }[];
            }[];
            for (const ref of runewordRefs) {
              const q = (ref.key || ref.name || '').trim().toLocaleLowerCase();
              const matchedRw = rwRows.find(
                r =>
                  (r.Index && r.Index.toLocaleLowerCase() === q) ||
                  (r.NameKey && r.NameKey.toLocaleLowerCase() === q)
              );
              for (const rune of matchedRw?.Runes ?? []) {
                const runeCode = rune.NameKey?.trim().toLocaleLowerCase();
                if (runeCode && /^r\d{2}$/.test(runeCode)) {
                  const tierItemId = `rune-${runeCode}`;
                  if (!v2Config.itemOverrides[tierItemId]) {
                    v2Config.itemOverrides[tierItemId] = 'A';
                    promotedRunesCount++;
                  }
                }
              }
            }
          }
        } catch {
          // Non-fatal if runewords.json cannot be fetched
        }
      }

      lastSyncedBuildItems = res.matchedLabels;
      applyV2Changes();
      const runeNote = promotedRunesCount > 0 ? ` and promoted ${promotedRunesCount} runeword runes to Tier A` : '';
      notice = `Synced with “${details.build.title}” (${details.build.characterClass}): selected ${details.build.characterClass} weapon types, pinned ${res.pinnedCount} build items/bases into Tier S${runeNote}.`;
      siteBuildMessage =
        res.pinnedCount > 0
          ? `Synced “${details.build.title}”: pinned ${res.pinnedCount} items/bases (${res.matchedLabels.slice(0, 6).join(', ')}${res.matchedLabels.length > 6 ? ` +${res.matchedLabels.length - 6} more` : ''}).`
          : `Synced “${details.build.title}”: applied ${details.build.characterClass} weapon & class item types.`;
      siteBuildResults = [];
    } catch {
      siteBuildMessage = 'Could not load that build guide ID. Check the link or select a signature build preset above.';
    } finally {
      siteBuildLoading = false;
    }
  }
</script>

<section class="loot-filter-v2-root w-full max-w-none px-4 pb-12 pt-5 font-sans sm:px-6 lg:px-10">
  <!-- Top Workspace Header & Filter Bar -->
  <header class="panel rounded-lg p-4 sm:p-5">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="rounded border border-ember-400/50 bg-ember-950/60 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-ember-300">
            Pyre Loot Filter · v2
          </span>
          <span class="text-xs text-parchment-300">{catalogStatus}</span>
          {#if catalogError}
            <button type="button" class="text-xs text-ember-400 underline" onclick={() => loadCatalog()}>Retry</button>
          {/if}
        </div>
        <h1 class="mt-1.5 text-2xl font-bold tracking-tight text-parchment-50 sm:text-3xl">Loot Filter Customizer</h1>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="trade-secondary-button !py-1.5 text-xs"
          aria-expanded={showLibraryDrawer}
          onclick={() => (showLibraryDrawer = !showLibraryDrawer)}
        >
          {showLibraryDrawer ? 'Hide My Filters' : `My Filters (${cards.length})`}
        </button>
        <a class="trade-secondary-button !py-1.5 text-xs" href="/loot-filter/public">Public Filters</a>
        <a class="trade-secondary-button !py-1.5 text-xs" href="/loot-filter">Classic Rule Editor</a>
      </div>
    </div>

    <!-- Active Filter Controls Bar -->
    {#if active && !viewingShared}
      <div class="mt-4 flex flex-wrap items-end gap-3 border-t border-parchment-300/15 pt-4">
        <label class="min-w-[220px] flex-1 text-xs uppercase tracking-widest text-parchment-300">
          Active Filter Name
          <input
            class="field mt-1.5"
            maxlength="80"
            disabled={busy}
            bind:value={active.name}
            oninput={() => {
              if (active) active.updatedAt = Date.now();
            }}
          />
        </label>

        <div class="flex flex-wrap items-center gap-2">
          {#if account}
            <button
              type="button"
              class="trade-primary-button"
              disabled={busy || validation.errors.length > 0}
              onclick={() => saveToAccount(false)}
            >
              {busy ? 'Saving…' : 'Save to Account'}
            </button>
            <button
              type="button"
              class="trade-secondary-button"
              disabled={busy || validation.errors.length > 0 || entries.length >= 50}
              onclick={() => saveToAccount(true)}
            >
              Save Copy
            </button>
          {:else}
            <a class="trade-secondary-button" href="/profile">Sign in for Launcher Sync</a>
          {/if}

          <button
            type="button"
            class="trade-primary-button"
            disabled={validation.errors.length > 0}
            onclick={downloadJson}
          >
            Download filter.json
          </button>

          <button
            type="button"
            class="trade-secondary-button"
            onclick={() => importInput?.click()}
          >
            Import JSON
          </button>
          <input
            bind:this={importInput}
            type="file"
            accept=".json,application/json"
            class="hidden"
            onchange={handleFileImport}
          />
        </div>
      </div>

      <!-- Status & Sharing Sub-bar -->
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-parchment-300">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span role="status">{loaded ? localStatus : 'Loading…'}</span>
          <span>
            Strictness: <strong class="text-parchment-100">{activeStrictnessInfo.name}</strong>
          </span>
          <span>
            Theme: <strong class="text-parchment-100">{THEME_PRESETS[v2Config.theme]?.name}</strong>
          </span>
          <span>{active.document.rules.length} compiled rules</span>
        </div>

        {#if account && active.remoteId}
          <div class="flex flex-wrap items-center gap-3">
            <span>{isDirty(active) ? '● Unsaved account changes' : '✓ Synced to account'}</span>
            <button
              type="button"
              class="text-ember-400 hover:underline"
              disabled={busy}
              onclick={togglePublicVisibility}
            >
              {active.isPublic ? 'Public (Make Private)' : 'Private (Make Public)'}
            </button>
            <button
              type="button"
              class="text-ember-400 hover:underline"
              onclick={() => copyShareLink(active!.remoteId!)}
            >
              Copy Share Link
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Collapsible My Filters Library Drawer -->
    {#if showLibraryDrawer}
      <div class="mt-4 space-y-3 border-t border-parchment-300/20 pt-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-lg font-bold tracking-tight text-parchment-50">Saved Filters ({cards.length})</h2>
          <button
            type="button"
            class="trade-primary-button !py-1.5 text-xs"
            disabled={busy || entries.length >= 50}
            onclick={() => createNewV2Filter(v2Config.strictness)}
          >
            + New FilterBlade Filter
          </button>
        </div>
        <div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {#each cards as card (card.id)}
            <div
              class={`flex items-center justify-between gap-2 rounded border p-3 text-xs ${
                card.id === lastId ? 'border-ember-400 bg-ember-950/20' : 'border-parchment-300/20 bg-abyss-950'
              }`}
            >
              <div class="min-w-0">
                <p class="break-words font-semibold text-parchment-50">{card.name}</p>
                <p class="mt-0.5 text-parchment-300">
                  {card.ruleCount} rules · {card.remoteId ? (card.dirty ? 'Edited draft' : 'Account') : 'Browser only'}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                {#if card.id !== lastId}
                  <button
                    type="button"
                    class="text-ember-400 hover:underline"
                    disabled={busy}
                    onclick={() => openFilter(card.id, card.local, card.remoteId)}
                  >
                    Open
                  </button>
                {:else}
                  <span class="text-emerald-300">Active</span>
                {/if}
                <button
                  type="button"
                  class="text-parchment-300 hover:text-requirement"
                  disabled={busy}
                  onclick={() => removeCard(card)}
                >
                  Delete
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </header>

  {#if error}
    <p role="alert" class="mt-4 rounded border border-requirement/40 bg-abyss-950 p-3 text-sm text-requirement">{error}</p>
  {/if}
  {#if notice}
    <p role="status" class="mt-4 rounded border border-parchment-300/25 bg-abyss-950 p-3 text-sm text-parchment-100">{notice}</p>
  {/if}

  {#if viewingShared}
    <div class="panel mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ember-400/50 p-4">
      <div>
        <span class="text-xs uppercase tracking-widest text-ember-300">Shared Loot Filter</span>
        <h2 class="text-xl font-bold tracking-tight text-parchment-50">{viewingShared.name}</h2>
        <p class="text-xs text-parchment-300">
          Shared by {viewingShared.authorName} · {viewingShared.ruleCount} rules
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="trade-primary-button text-xs"
          onclick={() => {
            if (!viewingShared) return;
            const draft = newDraft(viewingShared.name, $state.snapshot(viewingShared.document) as Filter);
            entries.push(draft);
            lastId = draft.id;
            viewingShared = null;
            pendingLink = null;
            syncV2FromDraft(draft);
            notice = 'Copied shared filter into your library.';
          }}
        >
          Copy to My Filters & Edit
        </button>
      </div>
    </div>
  {/if}

  {#if isLegacyFilter && active}
    <div class="panel mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/40 p-4 text-sm">
      <div>
        <strong class="text-parchment-50">Opened a Classic Rule-List Filter (“{active.name}”)</strong>
        <p class="mt-0.5 text-xs text-parchment-300">
          This filter was created in the classic rule editor. Upgrade it to FilterBlade v2 to unlock live Strictness switching and Tier Lists.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="trade-primary-button !py-1.5 text-xs"
          onclick={() => convertLegacyToV2(true)}
        >
          Upgrade & Keep Existing Rules
        </button>
        <button
          type="button"
          class="trade-secondary-button !py-1.5 text-xs"
          onclick={() => convertLegacyToV2(false)}
        >
          Start Fresh v2 Preset
        </button>
      </div>
    </div>
  {/if}

  <!-- FilterBlade Main Navigation Tabs -->
  <nav
    class="mt-6 flex flex-wrap gap-2 border-b border-parchment-300/20 pb-3"
    aria-label="FilterBlade sections"
  >
    {#each [
      { id: 'overview', label: '1. Overview & Strictness', badge: activeStrictnessInfo.shortLabel },
      { id: 'customize', label: '2. Customize Tiers & Bases', badge: `${overrideCounts.items + overrideCounts.bases} edits` },
      { id: 'style', label: '3. Style & Sounds', badge: THEME_PRESETS[v2Config.theme]?.name.split(' ')[0] },
      { id: 'simulate', label: '4. Simulate & Test Loot', badge: 'Live' },
      { id: 'advanced', label: '5. Advanced / Raw Rules', badge: `${active?.document.rules.length ?? 0} rules` }
    ] as tab}
      <button
        type="button"
        class={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
          activeTab === tab.id
            ? 'border-ember-400 bg-ember-900/35 text-parchment-50 shadow-sm'
            : 'border-parchment-300/20 bg-abyss-950 text-parchment-300 hover:border-parchment-300/40 hover:text-parchment-100'
        }`}
        aria-pressed={activeTab === tab.id}
        onclick={() => (activeTab = tab.id as WorkspaceTab)}
      >
        <span>{tab.label}</span>
        <span class="rounded bg-abyss-900/90 px-2 py-0.5 text-[11px] text-ember-300">{tab.badge}</span>
      </button>
    {/each}
  </nav>

  <!-- TAB 1: OVERVIEW & STRICTNESS -->
  {#if activeTab === 'overview'}
    <div class="mt-6 space-y-6">
      <section class="panel rounded-lg p-5 sm:p-6" aria-label="Strictness selector">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Select Filter Strictness</h2>
            <p class="mt-1 text-sm text-parchment-300">
              Change strictness at any time as your character progresses. Your custom tier moves, pinned bases, and style tweaks are preserved automatically.
            </p>
          </div>
          {#if overrideCounts.items + overrideCounts.bases + overrideCounts.styles > 0}
            <button
              type="button"
              class="trade-secondary-button !py-1.5 text-xs"
              onclick={() => {
                v2Config = createDefaultV2Config(v2Config.strictness, v2Config.theme);
                applyV2Changes();
              }}
            >
              Reset all custom overrides ({overrideCounts.items + overrideCounts.bases + overrideCounts.styles})
            </button>
          {/if}
        </div>

        <!-- 5-Stop Strictness Cards -->
        <div class="mt-5 grid gap-3.5 md:grid-cols-5">
          {#each STRICTNESS_PRESETS as preset (preset.id)}
            {@const isCurrent = v2Config.strictness === preset.id}
            <button
              type="button"
              class={`flex flex-col justify-between rounded-lg border p-4 text-left transition-all ${
                isCurrent
                  ? 'border-ember-400 bg-ember-950/25 shadow-md'
                  : 'border-parchment-300/20 bg-abyss-950 hover:border-parchment-300/45'
              }`}
              aria-pressed={isCurrent}
              onclick={() => {
                v2Config.strictness = preset.id;
                applyV2Changes();
              }}
            >
              <div>
                <div class="flex items-center justify-between gap-2">
                  <span class="rounded border border-parchment-300/20 bg-abyss-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-parchment-300">
                    {preset.badge}
                  </span>
                  {#if isCurrent}
                    <span class="text-xs font-bold text-ember-400">● Active</span>
                  {/if}
                </div>
                <h3 class="mt-2.5 text-lg font-bold tracking-tight text-parchment-50">{preset.name}</h3>
                <p class="mt-1.5 text-xs leading-relaxed text-parchment-300">{preset.description}</p>
              </div>
              <p class="mt-3 border-t border-parchment-300/15 pt-2.5 text-[11px] text-parchment-200">
                <strong class="text-ember-300">Best for:</strong> {preset.recommendedFor}
              </p>
            </button>
          {/each}
        </div>

        <!-- Active Strictness Summary Box -->
        <div class="mt-5 grid gap-4 rounded-lg border border-parchment-300/20 bg-abyss-950 p-4 sm:grid-cols-2">
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-widest text-emerald-300">What {activeStrictnessInfo.shortLabel} Keeps & Highlights</h4>
            <p class="mt-1.5 text-sm text-parchment-200">{activeStrictnessInfo.keepsSummary}</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-widest text-red-300">What {activeStrictnessInfo.shortLabel} Hides by Default</h4>
            <p class="mt-1.5 text-sm text-parchment-200">{activeStrictnessInfo.hidesSummary}</p>
          </div>
        </div>
      </section>

      <!-- Auto-Adjust by Archetype & Class -->
      <section class="panel rounded-lg p-5 sm:p-6" aria-label="Adjust by archetype, class, and build">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2.5">
              <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Adjust by Archetype &amp; Class</h2>
              {#if v2Config.buildProfile?.linkedBuildTitle}
                <span class="rounded border border-ember-400/50 bg-ember-950/50 px-2.5 py-0.5 text-xs font-semibold text-ember-300">
                  Active Build: {v2Config.buildProfile.linkedBuildTitle}
                </span>
              {:else if v2Config.buildProfile?.selectedClass}
                <span class="rounded border border-ember-400/50 bg-ember-950/50 px-2.5 py-0.5 text-xs font-semibold text-ember-300">
                  Class: {v2Config.buildProfile.selectedClass}{v2Config.buildProfile.archetype ? ` · ${v2Config.buildProfile.archetype.toUpperCase()}` : ''}
                </span>
              {:else if v2Config.buildProfile?.archetype}
                <span class="rounded border border-ember-400/50 bg-ember-950/50 px-2.5 py-0.5 text-xs font-semibold text-ember-300">
                  Archetype: {v2Config.buildProfile.archetype.toUpperCase()}
                </span>
              {/if}
              <span class="rounded bg-abyss-900 px-2.5 py-0.5 text-xs text-parchment-300">
                {enabledFamilyCount} / {ALL_EQUIPMENT_FAMILY_IDS.length} weapon &amp; class types shown
              </span>
            </div>
            <p class="mt-1 text-sm text-parchment-300">
              Pick a combat archetype or a single character class to pre-select its weapon, quiver, offhand, and class item types, then toggle any individual weapon type on or off below. Unique &amp; Set drops always remain visible.
            </p>
          </div>
          {#if v2Config.buildProfile?.selectedClass || v2Config.buildProfile?.archetype || (v2Config.buildProfile?.disabledFamilies?.length ?? 0) > 0 || v2Config.buildProfile?.presetId || v2Config.buildProfile?.linkedBuildId}
            <button
              type="button"
              class="trade-secondary-button !py-1.5 text-xs"
              onclick={clearBuildCuration}
            >
              Reset (Show All Weapon &amp; Class Types)
            </button>
          {/if}
        </div>

        <!-- Step 1: Combat Archetype Selector -->
        <div class="mt-5">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-parchment-300">
            1. Select Combat Archetype (Pre-selects matching weapon &amp; offhand item types)
          </h3>
          <div class="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              class={`rounded-lg border p-3 text-left transition-all ${
                !v2Config.buildProfile?.archetype && !v2Config.buildProfile?.selectedClass && (v2Config.buildProfile?.disabledFamilies?.length ?? 0) === 0
                  ? 'border-ember-400 bg-ember-950/35 text-parchment-50'
                  : 'border-parchment-300/20 bg-abyss-950 text-parchment-200 hover:border-parchment-300/45'
              }`}
              aria-pressed={!v2Config.buildProfile?.archetype && !v2Config.buildProfile?.selectedClass && (v2Config.buildProfile?.disabledFamilies?.length ?? 0) === 0}
              onclick={() => chooseBuildArchetype(null)}
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-bold text-parchment-50">All Weapon &amp; Class Types</span>
                {#if !v2Config.buildProfile?.archetype && !v2Config.buildProfile?.selectedClass && (v2Config.buildProfile?.disabledFamilies?.length ?? 0) === 0}
                  <span class="text-xs font-bold text-ember-400">Active</span>
                {/if}
              </div>
              <p class="mt-1 text-xs leading-snug text-parchment-300/85">
                Enables all {ALL_EQUIPMENT_FAMILY_IDS.length} weapon, quiver, shield, and class-specific item families across every class.
              </p>
            </button>

            {#each BUILD_ARCHETYPES as arch (arch.id)}
              {@const isSelected = v2Config.buildProfile?.archetype === arch.id}
              <button
                type="button"
                class={`rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-ember-400 bg-ember-950/35 text-parchment-50'
                    : 'border-parchment-300/20 bg-abyss-950 text-parchment-200 hover:border-parchment-300/45'
                }`}
                aria-pressed={isSelected}
                onclick={() => chooseBuildArchetype(arch.id)}
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-bold text-parchment-50">{arch.name}</span>
                  {#if isSelected}
                    <span class="text-xs font-bold text-ember-400">Active</span>
                  {/if}
                </div>
                <p class="mt-1 text-xs leading-snug text-parchment-300/85">{arch.subtitle}</p>
              </button>
            {/each}
          </div>
        </div>

        <!-- Step 2: Single-Class Preset Selector -->
        <div class="mt-5 border-t border-parchment-300/15 pt-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-xs font-semibold uppercase tracking-widest text-parchment-300">
              2. Or Pick a Character Class (Selects 1 class and pre-fills its default weapon &amp; class item types)
            </h3>
            {#if v2Config.buildProfile?.selectedClass}
              <span class="text-xs text-ember-300">
                Selected: <strong>{v2Config.buildProfile.selectedClass}</strong> (click class again to deselect)
              </span>
            {/if}
          </div>

          <div class="mt-2.5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
            {#each BUILD_CLASSES as cls (cls.id)}
              {@const isSelected = v2Config.buildProfile?.selectedClass === cls.id}
              <button
                type="button"
                class={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-ember-400 bg-ember-950/35 text-parchment-50 shadow-sm'
                    : 'border-parchment-300/20 bg-abyss-950 text-parchment-200 hover:border-parchment-300/45'
                }`}
                aria-pressed={isSelected}
                onclick={() => chooseBuildClass(cls.id)}
              >
                <div class="flex items-center justify-between gap-1.5">
                  <span class="text-sm font-bold text-parchment-50">{cls.name}</span>
                  {#if isSelected}
                    <span class="rounded bg-ember-500/30 px-1.5 py-0.5 text-[10px] font-bold text-ember-300">Active</span>
                  {/if}
                </div>
                <p class="mt-1 text-[11px] leading-snug text-parchment-300/85">{cls.subtitle}</p>
              </button>
            {/each}
          </div>
        </div>

        <!-- Step 3: Individual Weapon, Offhand, Quiver & Class Item Type Toggles -->
        <div class="mt-5 border-t border-parchment-300/15 pt-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-widest text-parchment-300">
                3. Toggle Weapon, Quiver, Shield &amp; Class Item Types ({enabledFamilyCount} Enabled · {ALL_EQUIPMENT_FAMILY_IDS.length - enabledFamilyCount} Disabled)
              </h3>
              <p class="mt-0.5 text-xs text-parchment-300">
                Click any weapon or class item type below to toggle it on or off after selecting your class or archetype. Disabled types hide ordinary white, magic, and rare bases while keeping Uniques &amp; Sets visible.
              </p>
            </div>
            {#if (v2Config.buildProfile?.disabledFamilies?.length ?? 0) > 0}
              <button
                type="button"
                class="trade-secondary-button !px-3 !py-1 text-xs"
                onclick={enableAllEquipmentFamilies}
              >
                Enable All {ALL_EQUIPMENT_FAMILY_IDS.length} Types
              </button>
            {/if}
          </div>

          <div class="mt-3 grid gap-4 lg:grid-cols-3">
            {#each equipmentGroups as grp (grp.id)}
              <div class="rounded-lg border border-parchment-300/15 bg-abyss-950/80 p-3.5">
                <h4 class="text-xs font-bold uppercase tracking-wider text-ember-300">{grp.title}</h4>
                <div class="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {#each grp.items as fam (fam.id)}
                    {@const enabled = isFamilyEnabled(fam.id)}
                    <button
                      type="button"
                      class={`flex flex-col justify-between rounded border px-3 py-2 text-left transition-all ${
                        enabled
                          ? 'border-emerald-500/45 bg-emerald-950/20 text-parchment-50 hover:border-emerald-400'
                          : 'border-parchment-300/15 bg-abyss-900/50 text-parchment-300/60 opacity-75 hover:border-parchment-300/35 hover:opacity-100'
                      }`}
                      aria-pressed={enabled}
                      onclick={() => handleToggleEquipmentFamily(fam.id)}
                    >
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-xs font-bold text-parchment-50">{fam.name}</span>
                        <span
                          class={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            enabled
                              ? 'bg-emerald-500/25 text-emerald-300'
                              : 'bg-red-950/60 text-red-300/90'
                          }`}
                        >
                          {enabled ? '✓ Shown' : '✕ Off'}
                        </span>
                      </div>
                      <span class="mt-1 text-[11px] leading-tight text-parchment-300/80">{fam.subtitle}</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Step 4: 1-Click Signature Build Presets & Community /builds Importer -->
        <div class="mt-5 grid gap-5 border-t border-parchment-300/15 pt-4 xl:grid-cols-12">
          <!-- 8 Signature Build Presets -->
          <div class="xl:col-span-7">
            <h3 class="text-xs font-semibold uppercase tracking-widest text-parchment-300">
              4. Quick-Apply Signature Reimagined Build Preset (Optional)
            </h3>
            <div class="mt-2.5 grid gap-2 sm:grid-cols-2">
              {#each CURATED_BUILD_PRESETS as preset (preset.id)}
                {@const isActivePreset = v2Config.buildProfile?.presetId === preset.id}
                <button
                  type="button"
                  class={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
                    isActivePreset
                      ? 'border-ember-400 bg-ember-950/35 text-parchment-50'
                      : 'border-parchment-300/20 bg-abyss-950 text-parchment-200 hover:border-parchment-300/45'
                  }`}
                  aria-pressed={isActivePreset}
                  onclick={() => selectCuratedPreset(preset.id)}
                >
                  <div>
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-bold text-parchment-50">{preset.title}</span>
                      <span class="shrink-0 rounded bg-abyss-900 px-1.5 py-0.5 text-[10px] text-ember-300">
                        {preset.pinnedBases.length} S-Tier Bases
                      </span>
                    </div>
                    <p class="mt-1 text-[11px] leading-snug text-parchment-300/85">{preset.summary}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <!-- Sync with Community /builds Library -->
          <div class="flex flex-col justify-between rounded-lg border border-parchment-300/20 bg-abyss-950 p-4 xl:col-span-5">
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-widest text-ember-300">
                Sync with a Community Build Guide (/builds)
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-parchment-300">
                Search published Reimagined build guides or paste a <code>/builds/&lt;id&gt;</code> URL to automatically pin every Unique, Set, and Runeword base featured in that build into Tier S.
              </p>

              <div class="mt-3 flex gap-2">
                <input
                  type="search"
                  class="field !py-2 text-xs"
                  placeholder="Search builds or paste /builds/... link"
                  bind:value={siteBuildQuery}
                  onkeydown={e => {
                    if (e.key === 'Enter') void searchOrImportSiteBuild();
                  }}
                />
                <button
                  type="button"
                  class="trade-primary-button shrink-0 !px-3.5 !py-2 text-xs"
                  disabled={siteBuildLoading}
                  onclick={() => searchOrImportSiteBuild()}
                >
                  {siteBuildLoading ? 'Loading…' : 'Find / Sync'}
                </button>
              </div>

              {#if siteBuildMessage}
                <p class="mt-2.5 text-xs text-parchment-300">{siteBuildMessage}</p>
              {/if}

              {#if siteBuildResults.length > 0}
                <div class="mt-3 max-h-48 space-y-1.5 overflow-y-auto rounded border border-parchment-300/15 bg-abyss-900 p-2">
                  {#each siteBuildResults as b (b.id)}
                    <div class="flex items-center justify-between gap-2 rounded border border-parchment-300/15 bg-abyss-950 px-3 py-2 text-xs">
                      <div class="min-w-0">
                        <p class="break-words font-semibold text-parchment-50">{b.title}</p>
                        <p class="text-[11px] text-parchment-300">
                          {b.characterClass} · {b.category} · by {b.authorName}
                        </p>
                      </div>
                      <button
                        type="button"
                        class="trade-primary-button shrink-0 !px-2.5 !py-1 text-xs"
                        disabled={siteBuildLoading}
                        onclick={() => importSiteBuildById(b.id)}
                      >
                        Auto-Adjust
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-parchment-300/15 pt-3 text-xs text-parchment-300">
              <span>Pinned chase bases: <strong class="text-parchment-100">{v2Config.customBases.length}</strong></span>
              <button
                type="button"
                class="text-ember-400 hover:underline"
                onclick={() => {
                  activeCategory = 'bases';
                  activeTab = 'customize';
                }}
              >
                Inspect Pinned Bases in Customizer →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Coverage Matrix (Jump to Customizer) -->
      <section class="panel rounded-lg p-5 sm:p-6" aria-label="Category overview matrix">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-parchment-50">Category Tier Matrix</h2>
            <p class="mt-1 text-sm text-parchment-300">
              Click any category card below to open its drag-and-drop Tier List in the Customizer.
            </p>
          </div>
          <button
            type="button"
            class="trade-primary-button text-xs"
            onclick={() => (activeTab = 'customize')}
          >
            Open Full Customizer →
          </button>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each categoryBreakdown as cat (cat.id)}
            <button
              type="button"
              class="flex flex-col justify-between rounded-lg border border-parchment-300/20 bg-abyss-950 p-4 text-left transition-all hover:border-ember-400"
              onclick={() => {
                activeCategory = cat.id;
                customizerSearch = '';
                activeTab = 'customize';
              }}
            >
              <div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg text-ember-400" aria-hidden="true">{cat.icon}</span>
                    <h3 class="text-lg font-bold tracking-tight text-parchment-50">{cat.name}</h3>
                  </div>
                  {#if cat.modified > 0}
                    <span class="rounded bg-ember-500/25 px-2 py-0.5 text-[11px] font-semibold text-ember-300">
                      {cat.modified} edited
                    </span>
                  {/if}
                </div>
                <p class="mt-1 text-xs text-parchment-300">{cat.subtitle}</p>
              </div>

              <div class="mt-4 flex flex-wrap gap-1.5 border-t border-parchment-300/15 pt-3">
                {#each TIER_RANKS as r}
                  {@const count = cat.counts[r.id]}
                  {#if count > 0}
                    <span class={`rounded border px-2 py-0.5 text-[11px] font-medium ${r.badgeClass}`}>
                      {r.id === 'HIDE' ? 'Hidden' : r.id}: {count}
                    </span>
                  {/if}
                {/each}
              </div>
            </button>
          {/each}
        </div>
      </section>
    </div>

  <!-- TAB 2: CUSTOMIZE TIERS & BASES -->
  {:else if activeTab === 'customize'}
    <div class="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
      <!-- Category Accordion Sidebar -->
      <aside class="panel space-y-4 rounded-lg p-4 lg:sticky lg:top-6" aria-label="Customizer categories">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-widest text-parchment-300">Quick Search Items</span>
          <input
            type="search"
            class="field mt-1.5"
            placeholder="Search rune, orb, map, base…"
            bind:value={customizerSearch}
          />
        </label>

        <div class="space-y-2">
          {#each categoryBreakdown as cat (cat.id)}
            {@const isSelected = !customizerSearch.trim() && activeCategory === cat.id}
            <button
              type="button"
              class={`flex w-full items-start justify-between gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? 'border-ember-400 bg-ember-900/35 text-parchment-50'
                  : 'border-parchment-300/15 bg-abyss-950/60 text-parchment-200 hover:border-parchment-300/35'
              }`}
              aria-pressed={isSelected}
              onclick={() => {
                activeCategory = cat.id;
                customizerSearch = '';
              }}
            >
              <div class="flex min-w-0 flex-1 items-start gap-2.5">
                <span class="mt-0.5 shrink-0 text-base text-ember-400" aria-hidden="true">{cat.icon}</span>
                <div class="min-w-0 flex-1">
                  <span class="block font-semibold leading-snug text-parchment-50">{cat.name}</span>
                  <span class="mt-0.5 block text-xs leading-relaxed text-parchment-300/80">{cat.subtitle}</span>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-1.5 pt-0.5 text-xs">
                {#if cat.modified > 0}
                  <span class="rounded bg-ember-500/25 px-1.5 py-0.5 text-[10px] font-bold text-ember-300">
                    {cat.modified}
                  </span>
                {/if}
                <span class="text-parchment-300/70">{cat.total}</span>
              </div>
            </button>
          {/each}
        </div>
      </aside>

      <!-- Main Tier List Customizer -->
      <div class="min-w-0">
        <TierListEditor
          bind:config={v2Config}
          bind:activeCategory
          bind:searchQuery={customizerSearch}
          {catalog}
          onchange={applyV2Changes}
        />
      </div>
    </div>

  <!-- TAB 3: STYLE & SOUNDS -->
  {:else if activeTab === 'style'}
    <div class="mt-6">
      <StyleAndSoundsPanel bind:config={v2Config} onchange={applyV2Changes} />
    </div>

  <!-- TAB 4: SIMULATE & TEST LOOT -->
  {:else if activeTab === 'simulate'}
    <div class="mt-6">
      {#if active}
        <SimulatorPanel
          filter={active.document}
          {catalog}
          onjumpcategory={cat => {
            activeCategory = cat;
            customizerSearch = '';
            activeTab = 'customize';
          }}
        />
      {/if}
    </div>

  <!-- TAB 5: ADVANCED / RAW RULES & JSON -->
  {:else if activeTab === 'advanced'}
    <div class="mt-6 grid items-start gap-6 lg:grid-cols-12">
      <!-- Custom Priority Rules Column -->
      <div class="panel space-y-4 rounded-lg p-4 sm:p-5 lg:col-span-7">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-300/20 pb-3">
          <div>
            <h2 class="text-xl font-bold tracking-tight text-parchment-50">Custom Priority Exception Rules</h2>
            <p class="mt-0.5 text-xs text-parchment-300">
              Rules added here are evaluated at the very top of your filter before all generated category rules.
            </p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="trade-primary-button !px-3 !py-1.5 text-xs" onclick={() => addCustomPriorityRule('show')}>
              + Show Rule
            </button>
            <button type="button" class="trade-secondary-button !px-3 !py-1.5 text-xs" onclick={() => addCustomPriorityRule('hide')}>
              + Hide Rule
            </button>
          </div>
        </div>

        {#if v2Config.customPriorityRules.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each v2Config.customPriorityRules as rule, idx}
              {@const summary = M.summarizeRule(rule)}
              <div class="flex items-center gap-1 rounded border border-parchment-300/25 bg-abyss-950 px-2.5 py-1 text-xs">
                <button
                  type="button"
                  class={selectedCustomRuleIdx === idx ? 'font-bold text-ember-400' : 'text-parchment-200'}
                  onclick={() => (selectedCustomRuleIdx = idx)}
                >
                  #{idx + 1} {summary.ruleName || summary.conditionSummary}
                </button>
                <button
                  type="button"
                  class="ml-1 text-parchment-300 hover:text-requirement"
                  aria-label={`Delete custom rule ${idx + 1}`}
                  onclick={() => removeCustomPriorityRule(idx)}
                >
                  ✕
                </button>
              </div>
            {/each}
          </div>

          {#if v2Config.customPriorityRules[selectedCustomRuleIdx]}
            {@const currentRule = v2Config.customPriorityRules[selectedCustomRuleIdx]}
            {@const currentBlock = blockOf(currentRule)}
            <div class="pt-2">
              <RuleEditor
                bind:block={
                  () => currentBlock,
                  next => {
                    v2Config.customPriorityRules[selectedCustomRuleIdx] =
                      kindOf(currentRule) === 'hide' ? { hide: next } : { show: next };
                    applyV2Changes();
                  }
                }
                kind={kindOf(currentRule)}
                {catalog}
                onkind={nextKind => {
                  const cloned = M.clone(currentBlock);
                  v2Config.customPriorityRules[selectedCustomRuleIdx] =
                    nextKind === 'hide' ? { hide: cloned } : { show: cloned };
                  applyV2Changes();
                }}
              />
            </div>
          {/if}
        {:else}
          <p class="rounded border border-dashed border-parchment-300/20 py-10 text-center text-sm text-parchment-300">
            No custom exception rules yet. Most adjustments can be made directly in the <strong>Customize Tiers & Bases</strong> tab.
          </p>
        {/if}
      </div>

      <!-- Compiled Filter JSON Inspector -->
      <aside class="panel space-y-4 rounded-lg p-4 sm:p-5 lg:col-span-5" aria-label="Compiled JSON output">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-xl font-bold tracking-tight text-parchment-50">Compiled filter.json</h2>
          <span
            class="rounded border border-parchment-300/25 px-2 py-0.5 text-xs"
            class:text-emerald-300={validation.errors.length === 0}
            class:text-requirement={validation.errors.length > 0}
          >
            {validation.errors.length ? 'Invalid' : 'Valid Schema v3'}
          </span>
        </div>
        <div class="flex justify-between text-xs text-parchment-300">
          <span>{active?.document.rules.length ?? 0} / 4,096 rules</span>
          <span>{validation.bytes.toLocaleString()} / 4 MiB</span>
        </div>
        {#if validation.errors.length > 0}
          <ul class="space-y-1 text-xs text-requirement">
            {#each validation.errors.slice(0, 5) as err}
              <li>{err}</li>
            {/each}
          </ul>
        {/if}
        <pre
          class="max-h-[32rem] overflow-auto rounded border border-parchment-300/15 bg-abyss-950 p-3 font-mono text-xs text-parchment-200"
          aria-label="Compiled filter.json preview"
        >{validation.json}</pre>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="trade-primary-button w-full justify-center"
            disabled={validation.errors.length > 0}
            onclick={downloadJson}
          >
            Download filter.json
          </button>
          <button
            type="button"
            class="trade-secondary-button w-full justify-center"
            onclick={async () => {
              try {
                await navigator.clipboard.writeText(validation.json);
                notice = 'Copied compiled JSON to clipboard.';
              } catch {
                notice = 'Clipboard blocked — use Download filter.json.';
              }
            }}
          >
            Copy JSON
          </button>
        </div>
      </aside>
    </div>
  {/if}
</section>

<style>
  .loot-filter-v2-root,
  .loot-filter-v2-root :global(*) {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .loot-filter-v2-root :global(code),
  .loot-filter-v2-root :global(pre) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }
</style>
