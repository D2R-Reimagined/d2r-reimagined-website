// Item-type graph and filter helpers (fast, memoized).
// Data: itemtypes.txt (D2R Reimagined mod). Parents from Equiv1/Equiv2.
//
// MIGRATION (issue: itemtype export now keyed by Code + "itype"):
//   The exporter now writes the itemtypes.txt **Code** column plus an "itype"
//   suffix as the canonical, language-agnostic identifier (carried in
//   Type.Index for object-shaped types and as the bare string in flat Type
//   fields). The website filter graph below is therefore keyed by
//   `code` (with "itype" suffix) everywhere internally — `parents` arrays hold
//   codes, all maps/caches use codes, helper functions accept and return codes.
//   `name` is retained on each node strictly as a debug/UI label and as a
//   compatibility fallback in `resolveBaseTypeName` (so legacy callers passing
//   English names continue to resolve).

export interface IItemTypeNode {
    // Human-friendly English display name (itemtypes.txt: ItemType).
    // Kept for debugging / fallback only — not used as a key.
    name: string;
    // Primary identifier (itemtypes.txt: Code). Used as the graph key.
    code: string;
    // Parent codes (Equiv1/Equiv2). Order: nearest parent first.
    parents?: string[];
}

// Types and their relationships
export const ITEM_TYPES: ReadonlyArray<IItemTypeNode> = [
    // High-level categories
    { name: 'Any', code: '' },
    { name: 'None', code: 'none' },
    { name: 'Weapon', code: 'weapitype' },
    { name: 'Melee Weapon', code: 'meleitype', parents: ['weapitype'] },
    { name: 'Missile Weapon', code: 'missitype', parents: ['weapitype'] },
    { name: 'Any Armor', code: 'armoitype' },
    { name: 'Any Shield', code: 'shlditype', parents: ['armoitype'] },
    { name: 'Miscellaneous', code: 'miscitype' },
    { name: 'Missile', code: 'mislitype', parents: ['miscitype'] },
    { name: 'Second Hand', code: 'secoitype' },
    { name: 'Socket Filler', code: 'sockitype', parents: ['miscitype'] },
    { name: 'Class Specific', code: 'clasitype' },
    { name: 'Charm', code: 'charitype', parents: ['miscitype'] },

    // Armor subtypes
    { name: 'Body Armor', code: 'torsitype', parents: ['armoitype'] },
    { name: 'Helm', code: 'helmitype', parents: ['armoitype'] },
    { name: 'Gloves', code: 'glovitype', parents: ['armoitype'] },
    { name: 'Boots', code: 'bootitype', parents: ['armoitype'] },
    { name: 'Belt', code: 'beltitype', parents: ['armoitype'] },
    { name: 'Circlet', code: 'circitype', parents: ['helmitype'] },
    { name: 'Shield', code: 'shieitype', parents: ['shlditype'] },
    { name: 'Cloak', code: 'cloaitype', parents: ['torsitype', 'assnitype'] },

    // Jewelry and socket fillers
    { name: 'Ring', code: 'ringitype' },
    { name: 'Amulet', code: 'amulitype' },
    { name: 'Small Charm', code: 'schaitype', parents: ['charitype'] },
    { name: 'Large Charm', code: 'mchaitype', parents: ['charitype'] },
    { name: 'Grand Charm', code: 'lchaitype', parents: ['charitype'] },
    { name: 'Crafted Sunder Charm', code: 'cschitype', parents: ['charitype'] },
    { name: 'Jewel', code: 'jewlitype', parents: ['sockitype'] },
    { name: 'Colossal Jewel', code: 'cjwlitype', parents: ['jewlitype'] },
    { name: 'Rune', code: 'runeitype', parents: ['sockitype'] },
    { name: 'Gem', code: 'gemitype', parents: ['sockitype'] },

    // Weapon families
    { name: 'Axe', code: 'axeitype', parents: ['meleitype', 'weapitype'] },
    { name: 'Club', code: 'clubitype', parents: ['blunitype', 'meleitype', 'weapitype'] },
    { name: 'Hammer', code: 'hammitype', parents: ['blunitype', 'meleitype', 'weapitype'] },
    { name: 'Mace', code: 'maceitype', parents: ['blunitype', 'meleitype', 'weapitype'] },
    { name: 'Polearm', code: 'poleitype', parents: ['spplitype', 'meleitype', 'weapitype'] },
    { name: 'Scepter', code: 'scepitype', parents: ['roditype', 'meleitype', 'weapitype'] },
    { name: 'Staff', code: 'stafitype', parents: ['roditype', 'meleitype', 'weapitype'] },
    { name: 'Spear', code: 'speaitype', parents: ['spplitype', 'meleitype', 'weapitype'] },
    { name: 'Sword', code: 'sworitype', parents: ['bldeitype', 'meleitype', 'weapitype'] },
    { name: 'Wand', code: 'wanditype', parents: ['roditype', 'meleitype', 'weapitype'] },
    { name: 'Bow', code: 'bowitype', parents: ['missitype', 'weapitype'] },
    { name: 'Crossbow', code: 'xbowitype', parents: ['missitype', 'weapitype'] },
    { name: 'Knife', code: 'knifitype', parents: ['bldeitype', 'meleitype', 'weapitype'] },
    { name: 'Javelin', code: 'javeitype', parents: ['meleitype', 'throitype', 'weapitype'] },
    { name: 'Throwing Knife', code: 'tknitype', parents: ['combitype', 'knifitype'] },
    { name: 'Throwing Axe', code: 'taxeitype', parents: ['combitype', 'axeitype'] },

    // Aggregations
    { name: 'Blade', code: 'bldeitype', parents: ['meleitype'] },
    { name: 'Spear/Polearm', code: 'spplitype', parents: ['meleitype'] },
    { name: 'Blunt', code: 'blunitype', parents: ['meleitype'] },
    { name: 'Staves And Rods', code: 'roditype', parents: ['blunitype'] },
    { name: 'Thrown Weapon', code: 'throitype', parents: ['weapitype'] },
    { name: 'Combo Weapon', code: 'combitype', parents: ['meleitype', 'throitype'] },

    // Class-specific aggregations
    { name: 'Amazon Item', code: 'amazitype', parents: ['clasitype'] },
    { name: 'Barbarian Item', code: 'barbitype', parents: ['clasitype'] },
    { name: 'Necromancer Item', code: 'necritype', parents: ['clasitype'] },
    { name: 'Paladin Item', code: 'palaitype', parents: ['clasitype'] },
    { name: 'Sorceress Item', code: 'sorcitype', parents: ['clasitype'] },
    { name: 'Assassin Item', code: 'assnitype', parents: ['clasitype'] },
    { name: 'Druid Item', code: 'druitype', parents: ['clasitype'] },
    { name: 'Warlock Item', code: 'warlitype', parents: ['clasitype'] },

    // Class-specific weapons
    { name: 'Amazon Bow', code: 'abowitype', parents: ['amazitype', 'bowitype', 'missitype', 'weapitype'] },
    { name: 'Amazon Spear', code: 'aspeitype', parents: ['amazitype', 'speaitype', 'meleitype', 'weapitype'] },
    { name: 'Amazon Javelin', code: 'ajavitype', parents: ['amazitype', 'javeitype', 'meleitype', 'weapitype'] },
    { name: 'Hand to Hand', code: 'h2hitype', parents: ['assnitype', 'meleitype', 'weapitype'] },
    { name: 'Orb', code: 'orbitype', parents: ['sorcitype', 'weapitype'] },

    // Class Specific Armors
    { name: 'Primal Helm', code: 'phlmitype', parents: ['barbitype', 'helmitype'] },
    { name: 'Pelt', code: 'peltitype', parents: ['druitype', 'helmitype'] },
    { name: 'Voodoo Heads', code: 'headitype', parents: ['necritype', 'shlditype'] },
    { name: 'Auric Shields', code: 'ashditype', parents: ['palaitype', 'shlditype'] },
    { name: 'Grimoire', code: 'grimitype', parents: ['warlitype', 'shlditype'] },

    // Miscellaneous consumables and scrolls
    { name: 'Gold', code: 'golditype', parents: ['miscitype'] },
    { name: 'Player Body Part', code: 'playitype', parents: ['miscitype'] },
    { name: 'Body Part', code: 'bodyitype', parents: ['miscitype'] },
    { name: 'Herb', code: 'herbitype', parents: ['miscitype'] },
    { name: 'Potion', code: 'potiitype', parents: ['miscitype'] },
    { name: 'Healing Potion', code: 'hpotitype', parents: ['potiitype'] },
    { name: 'Mana Potion', code: 'mpotitype', parents: ['potiitype'] },
    { name: 'Rejuv Potion', code: 'rpotitype', parents: ['hpotitype', 'mpotitype'] },
    { name: 'Stamina Potion', code: 'spotitype', parents: ['potiitype'] },
    { name: 'Antidote Potion', code: 'apotitype', parents: ['potiitype'] },
    { name: 'Thawing Potion', code: 'wpotitype', parents: ['potiitype'] },
    { name: 'Missile Potion', code: 'tpotitype', parents: ['throitype'] },
    { name: 'Scroll', code: 'scroitype', parents: ['miscitype'] },
    { name: 'Book', code: 'bookitype', parents: ['miscitype'] },
    { name: 'Torch', code: 'torcitype', parents: ['miscitype'] },
    { name: 'Elixir', code: 'elixitype', parents: ['miscitype'] },
    { name: 'Key', code: 'keyitype', parents: ['miscitype'] },
    { name: 'Quest', code: 'quesitype' },
    { name: 'Bow Quiver', code: 'bowqitype', parents: ['mislitype', 'secoitype'] },
    { name: 'Crossbow Quiver', code: 'xboqitype', parents: ['mislitype', 'secoitype'] },
    { name: 'Magic Bow Quiv', code: 'mboqitype', parents: ['bowqitype'] },
    { name: 'Magic Xbow Quiv', code: 'mxbqitype', parents: ['xboqitype'] },
];

// Primary lookup: by code (canonical id).
export const ITEM_TYPE_BY_CODE = new Map<string, IItemTypeNode>(ITEM_TYPES.map((t) => [t.code, t]));

// Compatibility lookups (case-insensitive) for legacy call-sites that may still
// pass an English name (e.g. unstructured user input or pre-migration test data).
const ITEM_TYPE_BY_NAME_LC = new Map<string, IItemTypeNode>(ITEM_TYPES.map((t) => [t.name.toLowerCase(), t]));

// Precomputed caches for performance
// Cache of chains: code -> [code, parent, grandparent, ...]
const CHAIN_CACHE = new Map<string, readonly string[]>();

// Parent adjacency (code -> parents[]) and child adjacency (code -> children[])
const PARENTS_MAP = new Map<string, readonly string[]>();
const CHILDREN_MAP = new Map<string, string[]>();

for (const t of ITEM_TYPES) {
    const parents = (t.parents ?? []).slice();
    PARENTS_MAP.set(t.code, parents);
}

// Build children adjacency from parents
for (const t of ITEM_TYPES) {
    const parents = PARENTS_MAP.get(t.code) || [];
    for (const p of parents) {
        let arr = CHILDREN_MAP.get(p);
        if (!arr) {
            arr = [];
            CHILDREN_MAP.set(p, arr);
        }
        arr.push(t.code);
    }
}

/**
 * Compute and memoize the chain for a type code with cycle protection.
 * Ordering rule: follow the nearest parent first; for additional parents, append
 * that parent and its chain (excluding duplicates), preserving declaration order.
 */
function computeChain(code: string, outerSeen?: Set<string>): readonly string[] {
    const cached = CHAIN_CACHE.get(code);
    if (cached) return cached;

    const node = ITEM_TYPE_BY_CODE.get(code);
    if (!node) {
        // Unknown code: treat as an empty chain to avoid surprising matches.
        const empty: readonly string[] = Object.freeze([]);
        CHAIN_CACHE.set(code, empty);
        return empty;
    }

    const seen = outerSeen ?? new Set<string>();
    if (seen.has(code)) {
        // Cycle guard: stop here.
        const selfOnly: readonly string[] = Object.freeze([code]);
        CHAIN_CACHE.set(code, selfOnly);
        return selfOnly;
    }
    seen.add(code);

    const chain: string[] = [code];
    const parents = PARENTS_MAP.get(code) || [];
    // Follow the primary (nearest) parent chain first
    if (parents.length > 0) {
        const first = parents[0];
        if (!seen.has(first)) {
            const sub = computeChain(first, new Set(seen));
            for (const s of sub) {
                if (chain.indexOf(s) === -1) chain.push(s);
            }
        } else if (chain.indexOf(first) === -1) {
            chain.push(first);
        }
        // Append additional parent branches
        for (let i = 1; i < parents.length; i++) {
            const p = parents[i];
            if (chain.indexOf(p) === -1) chain.push(p);
            if (!seen.has(p)) {
                const branch = computeChain(p, new Set(seen));
                for (const s of branch) {
                    if (chain.indexOf(s) === -1) chain.push(s);
                }
            }
        }
    }

    const frozen = Object.freeze(chain.slice());
    CHAIN_CACHE.set(code, frozen);
    return frozen;
}

/** Type chain: [code, parent, ...]. Example: 'axe' -> ['axe','mele','weap']. Memoized. */
export function getTypeChain(code: string): string[] {
    return computeChain(code).slice(); // return a shallow copy to keep the cache immutable
}

/** Returns the cached frozen chain without copying. */
export function getTypeChainReadonly(code: string): readonly string[] {
    return computeChain(code);
}

/**
 * Map a raw type identifier (preferred: itemtypes.txt code; tolerated: legacy
 * English ItemType name) to its chain using the canonical graph when possible.
 */
export function getChainForTypeName(raw: string): string[] {
    const v = (raw ?? '').trim();
    if (!v) return [''];
    // Prefer the code lookup (post-migration JSON shape).
    const node = ITEM_TYPE_BY_CODE.get(v) || ITEM_TYPE_BY_NAME_LC.get(v.toLowerCase());
    return node ? getTypeChain(node.code) : [v];
}

/** Returns the cached frozen chain for a type identifier without copying. */
export function getChainForTypeNameReadonly(raw: string): readonly string[] {
    const v = (raw ?? '').trim();
    if (!v) return Object.freeze(['']);
    const node = ITEM_TYPE_BY_CODE.get(v) || ITEM_TYPE_BY_NAME_LC.get(v.toLowerCase());
    return node ? computeChain(node.code) : Object.freeze([v]);
}

export interface IFilterOption {
    id: string;
    label: string;
    // Optional so placeholder entries can leave the bound model undefined
    value?: string[];
}

// Class aggregate bases (codes); only show when the aggregate itself exists in page data.
const CLASS_AGGREGATE_BASES = new Set<string>(['amazitype', 'barbitype', 'necritype', 'palaitype', 'sorcitype', 'assnitype', 'druitype', 'warlitype']);

/**
 * Build an IFilterOption from an itemtype CODE and optional extra parent codes.
 * `baseCode` is the itemtypes.txt Code (e.g. 'axe', 'tors'). `extraParents`
 * are additional codes to merge into the value list (used by aggregate options
 * that gather descendants explicitly).
 */
export function makeTypeOption(
    label: string,
    baseCode?: string,
    extraParents: string[] = [],
    exactBaseOnly: boolean = false,
    id?: string,
): IFilterOption {
    if (!baseCode) return { id: '', label, value: undefined };
    const finalId = id || (exactBaseOnly ? `exact-${baseCode}` : baseCode).toLowerCase().replace(/\s+/g, '-');

    // For exactBaseOnly, do NOT include implicit parents from the graph; keep only the base
    let value = exactBaseOnly ? [baseCode] : getTypeChain(baseCode);

    // For non-exact options, also include descendants to allow matching children
    if (!exactBaseOnly) {
        const descendants = getDescendantBaseNames(baseCode);
        if (descendants.length > 0) {
            const set = new Set<string>(value);
            const combined = [...value];
            for (const d of descendants) {
                if (!set.has(d)) {
                    combined.push(d);
                    set.add(d);
                }
            }
            value = combined;
        }
    }

    if (extraParents && extraParents.length) {
        const set = new Set<string>(value);
        const combined = [...value];
        for (const p of extraParents) {
            if (!set.has(p)) {
                combined.push(p);
                set.add(p);
            }
        }
        value = combined;
    }
    return { id: finalId, label, value };
}

/**
 * Resolve the base node code for a raw type identifier (as exported in JSON).
 * Returns the first element of the recognized chain, or the raw trimmed value
 * if the identifier is unknown. Accepts either a Code (preferred) or a legacy
 * English ItemType name for backward compatibility.
 */
export function resolveBaseTypeName(raw: string): string {
    const v = (raw ?? '').trim();
    if (!v) return '';
    const chain = getChainForTypeNameReadonly(v);
    return chain && chain.length > 0 ? chain[0] : v;
}

/**
 * Precompute descendants for all types using CHILDREN_MAP (cycle-safe).
 * Descendants are ordered by ITEM_TYPES declaration order.
 */
const DESCENDANTS_MAP = new Map<string, readonly string[]>();

function computeDescendants(code: string): readonly string[] {
    const cached = DESCENDANTS_MAP.get(code);
    if (cached) return cached;

    const visited = new Set<string>();
    const stack: string[] = (CHILDREN_MAP.get(code) || []).slice();
    while (stack.length) {
        const child = stack.pop();
        if (!child) continue;
        if (visited.has(child)) continue;
        visited.add(child);
        const grandchildren = CHILDREN_MAP.get(child);
        if (grandchildren && grandchildren.length) {
            for (let i = 0; i < grandchildren.length; i++) {
                const g = grandchildren[i];
                if (!visited.has(g)) stack.push(g);
            }
        }
    }
    // Project visited into stable declaration order
    const ordered: string[] = [];
    for (const t of ITEM_TYPES) {
        if (t.code !== code && visited.has(t.code)) ordered.push(t.code);
    }
    const frozen = Object.freeze(ordered);
    DESCENDANTS_MAP.set(code, frozen);
    return frozen;
}

export function getDescendantBaseNames(baseCode: string): string[] {
    return computeDescendants(baseCode).slice();
}

export const ANCESTOR_ONLY_WHEN_EXACT_OFF: string[] = [
    'circlet',
    'colossal-jewel',
    'barbarian-helm',
    'druid-helm',
    'amazon-bow',
    'amazon-spear',
    'amazon-javelin',
    'assassin-claw',
    'necromancer-shield',
    'paladin-shield',
    'sorceress-orb',
    'warlock-grimoire',
    'helm',
];

/**
 * Given a preset of filter options and a set of base item type codes present in
 * the data, return a filtered list of options appropriate for that data.
 *
 * Rules:
 * - Always keep the '-' option (empty value).
 * - For most options (specific types like 'axe'): include only if the option's
 *   base (value[0]) appears in presentBaseCodes (or any parent does).
 * - For aggregate options that intentionally include specific child types (e.g.,
 *   'Any Helm' which includes 'phlm' and 'pelt' as extras), include if the base
 *   OR any of those extras appear.
 *
 * We detect extras by comparing the option's value list to the canonical chain
 * for its base: any codes not part of that base chain are considered extras.
 */
export function buildOptionsForPresentTypes(
    preset: ReadonlyArray<IFilterOption>,
    presentBaseCodes: ReadonlySet<string>,
): IFilterOption[] {
    const result: IFilterOption[] = [];

    // Build a closure set that includes present bases and all their parents (using cached chains)
    const presentClosure = new Set<string>();
    for (const b of presentBaseCodes) {
        presentClosure.add(b);
        const chain = CHAIN_CACHE.get(b) || computeChain(b);
        for (let i = 1; i < chain.length; i++) presentClosure.add(chain[i]);
    }

    for (let i = 0; i < preset.length; i++) {
        const opt = preset[i];
        // Keep placeholder option
        if (!opt.value || opt.value.length === 0) {
            result.push(opt);
            continue;
        }

        const base = opt.value[0];
        const baseChain = CHAIN_CACHE.get(base) || computeChain(base);
        const baseSet = new Set(baseChain);
        // Extras: tokens not part of the base chain (explicit children/descendants supplied by the preset)
        const extras: string[] = [];
        for (let j = 0; j < opt.value.length; j++) {
            const v = opt.value[j];
            if (!baseSet.has(v)) extras.push(v);
        }

        // Triggers for inclusion:
        // - Simple: include if the option's base or any of its parents (ancestors) are present in data.
        // - Aggregate (has extras): also include if any explicit extras (descendants) are present in data (closure).
        // - Class aggregates: include only when the aggregate itself is directly present.
        let include: boolean;
        if (CLASS_AGGREGATE_BASES.has(base)) {
            include = presentBaseCodes.has(base);
        } else {
            // Check if any part of the base chain is present in data (this type or its parents)
            include = baseChain.some((b) => presentBaseCodes.has(b));
            if (!include && extras.length > 0) {
                // Check if any explicit extra descendants are present (including THEIR parents)
                for (let k = 0; k < extras.length; k++) {
                    if (presentClosure.has(extras[k])) {
                        include = true;
                        break;
                    }
                }
            }
        }
        if (include) result.push(opt);
    }

    return result;
}

// Reusable options for type filtering. Compared against JSON Type codes to
// determine which options to show in the dropdown. All `makeTypeOption` calls
// pass a CODE (itemtypes.txt Code column) as the base identifier.
export const type_filtering_options: ReadonlyArray<IFilterOption> = [
    // Aggregate the types
    // Any Armor should include all armor descendants
    makeTypeOption('armoitype', 'armoitype', [], false, 'any-armor'),
    // Any Helm should include Helm itself plus Circlet, Primal Helm, and Pelt
    makeTypeOption('itype_any_helm', 'helmitype', [], false, 'any-helm'),
    // Any Shield should include generic Shield and class shields
    makeTypeOption('shlditype', 'shlditype', [], false, 'any-shield'),
    // Expand weapon aggregates so that selecting them matches child bases too
    makeTypeOption('weapitype', 'weapitype', [], false, 'any-weapon'),
    makeTypeOption('meleitype', 'meleitype', [], false, 'melee-weapon'),
    makeTypeOption('missitype', 'missitype', [], false, 'missile-weapon'),
    makeTypeOption('throitype', 'throitype', [], false, 'thrown-weapon'),
    // Armor subtypes
    makeTypeOption('torsitype', 'torsitype'),
    makeTypeOption('glovitype', 'glovitype'),
    makeTypeOption('bootitype', 'bootitype'),
    makeTypeOption('beltitype', 'beltitype'),
    makeTypeOption('helmitype', 'helmitype', [], true, 'helm'),
    makeTypeOption('circitype', 'circitype', [], true, 'circlet'),
    // Shields (Bases Page)
    makeTypeOption('shieitype', 'shieitype'),
    // Jewelry and socket fillers
    makeTypeOption('ringitype', 'ringitype'),
    makeTypeOption('amulitype', 'amulitype'),
    makeTypeOption('jewlitype', 'jewlitype'),
    makeTypeOption('cjwlitype', 'cjwlitype', [], true, 'colossal-jewel'),
    makeTypeOption('schaitype', 'schaitype'),
    makeTypeOption('mchaitype', 'mchaitype'),
    makeTypeOption('lchaitype', 'lchaitype'),
    makeTypeOption('cschitype', 'cschitype'),
    // Weapon bases
    makeTypeOption('axeitype', 'axeitype'),
    makeTypeOption('clubitype', 'clubitype'),
    makeTypeOption('maceitype', 'maceitype'),
    makeTypeOption('hammitype', 'hammitype'),
    makeTypeOption('sworitype', 'sworitype'),
    makeTypeOption('knifitype', 'knifitype'),
    makeTypeOption('speaitype', 'speaitype'),
    makeTypeOption('poleitype', 'poleitype'),
    makeTypeOption('scepitype', 'scepitype'),
    makeTypeOption('stafitype', 'stafitype'),
    makeTypeOption('wanditype', 'wanditype'),
    makeTypeOption('bowitype', 'bowitype'),
    makeTypeOption('xbowitype', 'xbowitype'),
    makeTypeOption('javeitype', 'javeitype'),
    makeTypeOption('tknitype', 'tknitype', [], true),
    makeTypeOption('taxeitype', 'taxeitype', [], true),
    // Quivers and Bolts: base on the non-magic types and include their descendants (magic quivers)
    makeTypeOption('bowqitype', 'bowqitype'),
    makeTypeOption('xboqitype', 'xboqitype'),
    // Class Specific
    // Class-specific leaf types must match ONLY themselves by default on pages without an "Exact" toggle
    // (Bases, Uniques, Sets). Runewords inherits parents via its own filtering logic and parent selections.
    makeTypeOption('ajavitype', 'ajavitype', [], true, 'amazon-javelin'),
    makeTypeOption('abowitype', 'abowitype', [], true, 'amazon-bow'),
    makeTypeOption('aspeitype', 'aspeitype', [], true, 'amazon-spear'),
    makeTypeOption('h2hitype', 'h2hitype', [], true, 'assassin-claw'),
    makeTypeOption('phlmitype', 'phlmitype', [], true, 'barbarian-helm'),
    makeTypeOption('peltitype', 'peltitype', [], true, 'druid-helm'),
    makeTypeOption('headitype', 'headitype', [], true, 'necromancer-shield'),
    makeTypeOption('ashditype', 'ashditype', [], true, 'paladin-shield'),
    makeTypeOption('orbitype', 'orbitype', [], true, 'sorceress-orb'),
    makeTypeOption('grimitype', 'grimitype', [], true, 'warlock-grimoire'),
];
