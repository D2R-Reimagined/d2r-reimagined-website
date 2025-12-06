// Item-type graph and filter helpers (fast, memoized).
// Data: itemtypes.txt (D2R Reimagined mod). Parents from Equiv1/Equiv2.
// Notes: heavy lookups are precomputed; helpers are cycle-safe and allocation-light.

export interface ItemTypeNode {
    // Human-friendly name (itemtypes.txt: ItemType)
    name: string;
    // Short code (itemtypes.txt: Code)
    code: string;
    // Parent names (Equiv1/Equiv2). Order: nearest parent first.
    parents?: string[];
}

// Types and their relationships
export const ITEM_TYPES: ReadonlyArray<ItemTypeNode> = [
    // High-level categories
    { name: 'Any', code: '' },
    { name: 'None', code: 'none' },
    { name: 'Weapon', code: 'weap' },
    { name: 'Melee Weapon', code: 'mele', parents: ['Weapon'] },
    { name: 'Missile Weapon', code: 'miss', parents: ['Weapon'] },
    { name: 'Any Armor', code: 'armo' },
    { name: 'Any Shield', code: 'shld', parents: ['Any Armor'] },
    { name: 'Miscellaneous', code: 'misc' },
    { name: 'Missile', code: 'misl', parents: ['Miscellaneous'] },
    { name: 'Second Hand', code: 'seco' },
    { name: 'Socket Filler', code: 'sock', parents: ['Miscellaneous'] },
    { name: 'Class Specific', code: 'clas' },
    { name: 'Charm', code: 'char', parents: ['Miscellaneous'] },

    // Armor subtypes
    { name: 'Body Armor', code: 'tors', parents: ['Any Armor'] },
    { name: 'Helm', code: 'helm', parents: ['Any Armor'] },
    { name: 'Gloves', code: 'glov', parents: ['Any Armor'] },
    { name: 'Boots', code: 'boot', parents: ['Any Armor'] },
    { name: 'Belt', code: 'belt', parents: ['Any Armor'] },
    { name: 'Circlet', code: 'circ', parents: ['Helm'] },
    { name: 'Shield', code: 'shie', parents: ['Any Shield'] },
    { name: 'Cloak', code: 'cloa', parents: ['Body Armor', 'Assassin Item'] },

    // Jewelry and socket fillers
    { name: 'Ring', code: 'ring' },
    { name: 'Amulet', code: 'amul' },
    { name: 'Small Charm', code: 'scha', parents: ['Charm'] },
    { name: 'Large Charm', code: 'mcha', parents: ['Charm'] },
    { name: 'Grand Charm', code: 'lcha', parents: ['Charm'] },
    { name: 'Jewel', code: 'jewl', parents: ['Socket Filler'] },
    { name: 'Rune', code: 'rune', parents: ['Socket Filler'] },
    { name: 'Gem', code: 'gem', parents: ['Socket Filler'] },

    // Weapon families
    { name: 'Axe', code: 'axe', parents: ['Melee Weapon', 'Weapon'] },
    { name: 'Club', code: 'club', parents: ['Blunt', 'Melee Weapon', 'Weapon'] },
    { name: 'Hammer', code: 'hamm', parents: ['Blunt', 'Melee Weapon', 'Weapon'] },
    { name: 'Mace', code: 'mace', parents: ['Blunt', 'Melee Weapon', 'Weapon'] },
    { name: 'Polearm', code: 'pole', parents: ['Spear/Polearm', 'Melee Weapon', 'Weapon'] },
    { name: 'Scepter', code: 'scep', parents: ['Staves And Rods', 'Melee Weapon', 'Weapon'] },
    { name: 'Staff', code: 'staf', parents: ['Staves And Rods', 'Melee Weapon', 'Weapon'] },
    { name: 'Spear', code: 'spea', parents: ['Spear/Polearm', 'Melee Weapon', 'Weapon'] },
    { name: 'Sword', code: 'swor', parents: ['Blade', 'Melee Weapon', 'Weapon'] },
    { name: 'Wand', code: 'wand', parents: ['Staves And Rods', 'Melee Weapon', 'Weapon'] },
    { name: 'Bow', code: 'bow', parents: ['Missile Weapon', 'Weapon'] },
    { name: 'Crossbow', code: 'xbow', parents: ['Missile Weapon', 'Weapon'] },
    { name: 'Knife', code: 'knif', parents: ['Blade', 'Melee Weapon', 'Weapon'] },
    { name: 'Javelin', code: 'jave', parents: ['Melee Weapon', 'Thrown Weapon', 'Weapon'] },
    { name: 'Throwing Knife', code: 'tkni', parents: ['Combo Weapon', 'Knife'] },
    { name: 'Throwing Axe', code: 'taxe', parents: ['Combo Weapon', 'Axe'] },

    // Aggregations
    { name: 'Blade', code: 'blde', parents: ['Melee Weapon'] },
    { name: 'Spear/Polearm', code: 'sppl', parents: ['Melee Weapon'] },
    { name: 'Blunt', code: 'blun', parents: ['Melee Weapon'] },
    { name: 'Staves And Rods', code: 'rod', parents: ['Blunt'] },
    { name: 'Thrown Weapon', code: 'thro', parents: ['Weapon'] },
    { name: 'Combo Weapon', code: 'comb', parents: ['Melee Weapon', 'Thrown Weapon'] },

    // Class-specific aggregations
    { name: 'Amazon Item', code: 'amaz', parents: ['Class Specific'] },
    { name: 'Barbarian Item', code: 'barb', parents: ['Class Specific'] },
    { name: 'Necromancer Item', code: 'necr', parents: ['Class Specific'] },
    { name: 'Paladin Item', code: 'pala', parents: ['Class Specific'] },
    { name: 'Sorceress Item', code: 'sorc', parents: ['Class Specific'] },
    { name: 'Assassin Item', code: 'assn', parents: ['Class Specific'] },
    { name: 'Druid Item', code: 'drui', parents: ['Class Specific'] },

    // Class specific weapons
    { name: 'Amazon Bow', code: 'abow', parents: ['Amazon Item', 'Bow', 'Missile Weapon', 'Weapon'] },
    { name: 'Amazon Spear', code: 'aspe', parents: ['Amazon Item', 'Spear', 'Melee Weapon', 'Weapon'] },
    { name: 'Amazon Javelin', code: 'ajav', parents: ['Amazon Item', 'Javelin', 'Melee Weapon', 'Weapon'] },
    { name: 'Hand to Hand', code: 'h2h', parents: ['Assassin Item', 'Melee Weapon', 'Weapon'] },
    { name: 'Orb', code: 'orb', parents: ['Sorceress Item', 'Weapon'] },

    // Class Specific Armors
    { name: 'Primal Helm', code: 'phlm', parents: ['Barbarian Item', 'Helm'] },
    { name: 'Pelt', code: 'pelt', parents: ['Druid Item', 'Helm'] },
    { name: 'Voodoo Heads', code: 'head', parents: ['Necromancer Item', 'Any Shield'] },
    { name: 'Auric Shields', code: 'ashd', parents: ['Paladin Item', 'Any Shield'] },

    // Miscellaneous consumables and scrolls
    { name: 'Gold', code: 'gold', parents: ['Miscellaneous'] },
    { name: 'Player Body Part', code: 'play', parents: ['Miscellaneous'] },
    { name: 'Body Part', code: 'body', parents: ['Miscellaneous'] },
    { name: 'Herb', code: 'herb', parents: ['Miscellaneous'] },
    { name: 'Potion', code: 'poti', parents: ['Miscellaneous'] },
    { name: 'Healing Potion', code: 'hpot', parents: ['Potion'] },
    { name: 'Mana Potion', code: 'mpot', parents: ['Potion'] },
    { name: 'Rejuv Potion', code: 'rpot', parents: ['Healing Potion', 'Mana Potion'] },
    { name: 'Stamina Potion', code: 'spot', parents: ['Potion'] },
    { name: 'Antidote Potion', code: 'apot', parents: ['Potion'] },
    { name: 'Thawing Potion', code: 'wpot', parents: ['Potion'] },
    { name: 'Missile Potion', code: 'tpot', parents: ['Thrown Weapon'] },
    { name: 'Scroll', code: 'scro', parents: ['Miscellaneous'] },
    { name: 'Book', code: 'book', parents: ['Miscellaneous'] },
    { name: 'Torch', code: 'torc', parents: ['Miscellaneous'] },
    { name: 'Elixir', code: 'elix', parents: ['Miscellaneous'] },
    { name: 'Key', code: 'key', parents: ['Miscellaneous'] },
    { name: 'Quest', code: 'ques' },
    { name: 'Bow Quiver', code: 'bowq', parents: ['Missile', 'Second Hand'] },
    { name: 'Crossbow Bolts', code: 'xboq', parents: ['Missile', 'Second Hand'] },
    { name: 'Magic Bow Quiv', code: 'mboq', parents: ['Bow Quiver'] },
    { name: 'Magic Xbow Quiv', code: 'mxbq', parents: ['Crossbow Bolts'] },
];

export const ITEM_TYPE_BY_NAME = new Map<string, ItemTypeNode>(
    ITEM_TYPES.map((t) => [t.name, t])
);

export const ITEM_TYPE_BY_CODE = new Map<string, ItemTypeNode>(
    ITEM_TYPES.map((t) => [t.code, t])
);

// Case-insensitive name lookup to tolerate minor casing differences in JSON sources
export const ITEM_TYPE_BY_NAME_LC = new Map<string, ItemTypeNode>(
    ITEM_TYPES.map((t) => [t.name.toLowerCase(), t])
);

// ---------------------------------------------
// Precomputed caches for performance
// ---------------------------------------------

// Cache of chains: name -> [name, parent, grandparent, ...]
const CHAIN_CACHE = new Map<string, readonly string[]>();

// Parent adjacency (name -> parents[]) and child adjacency (name -> children[])
const PARENTS_MAP = new Map<string, readonly string[]>();
const CHILDREN_MAP = new Map<string, string[]>();

for (const t of ITEM_TYPES) {
    const parents = (t.parents ?? []).slice();
    PARENTS_MAP.set(t.name, parents);
}

// Build children adjacency from parents
for (const t of ITEM_TYPES) {
    const parents = PARENTS_MAP.get(t.name) || [];
    for (const p of parents) {
        if (!CHILDREN_MAP.has(p)) CHILDREN_MAP.set(p, []);
        CHILDREN_MAP.get(p)!.push(t.name);
    }
}

/**
 * Compute and memoize the chain for a type name with cycle protection.
 * Ordering rule: follow the nearest parent first; for additional parents, append
 * that parent and its chain (excluding duplicates), preserving declaration order.
 */
function computeChain(name: string, outerSeen?: Set<string>): readonly string[] {
    if (CHAIN_CACHE.has(name)) return CHAIN_CACHE.get(name)!;

    const node = ITEM_TYPE_BY_NAME.get(name);
    if (!node) {
        // Unknown name: treat as empty chain to avoid surprising matches.
        CHAIN_CACHE.set(name, Object.freeze([]));
        return CHAIN_CACHE.get(name)!;
    }

    const seen = outerSeen ?? new Set<string>();
    if (seen.has(name)) {
        // Cycle guard: stop here.
        CHAIN_CACHE.set(name, Object.freeze([name]));
        return CHAIN_CACHE.get(name)!;
    }
    seen.add(name);

    const chain: string[] = [name];
    const parents = PARENTS_MAP.get(name) || [];
    // Follow primary (nearest) parent chain first
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
    CHAIN_CACHE.set(name, frozen);
    return frozen;
}

/** Type chain: [name, parent, ...]. Example: 'Axe' -> ['Axe','Melee Weapon','Weapon']. Memoized. */
export function getTypeChain(name: string): string[] {
    return computeChain(name).slice(); // return a shallow copy to keep cache immutable
}

/** Map a raw game type name to its chain using the canonical graph when possible. */
export function getChainForTypeName(rawName: string): string[] {
    const raw = (rawName ?? '').trim();
    if (!raw) return [''];
    // Prefer case-insensitive match to align JSON values with our graph without renaming them globally
    const node = ITEM_TYPE_BY_NAME.get(raw) || ITEM_TYPE_BY_NAME_LC.get(raw.toLowerCase());
    return node ? getTypeChain(node.name) : [raw];
}

export interface FilterOption {
    label: string;
    // Optional so placeholder entries can leave the bound model undefined
    value?: string[];
}

// Class aggregate bases; only show when the aggregate itself exists in page data.
const CLASS_AGGREGATE_BASES = new Set<string>([
    'Amazon Item',
    'Barbarian Item',
    'Necromancer Item',
    'Paladin Item',
    'Sorceress Item',
    'Assassin Item',
    'Druid Item',
]);

// Build a FilterOption from an ItemType name and optional extra parents
export function makeTypeOption(
    label: string,
    baseTypeName?: string,
    extraParents: string[] = [],
    exactBaseOnly: boolean = false
): FilterOption {
    // Placeholder: return undefined value so UI can default to "-"
    if (!baseTypeName) return { label, value: undefined };

    // For exactBaseOnly, do NOT include implicit parents from the graph; keep only the base
    const value = exactBaseOnly ? [baseTypeName] : getTypeChain(baseTypeName);
    if (extraParents && extraParents.length) {
        const set = new Set<string>(value);
        for (const p of extraParents) {
            if (!set.has(p)) {
                value.push(p);
                set.add(p);
            }
        }
    }
    return { label, value };
}

/**
 * Resolve the base node name for a raw type string (as exported in JSON).
 * This returns the first element of our known chain if we recognize the name
 * (case-insensitive), otherwise returns the raw trimmed name.
 */
export function resolveBaseTypeName(rawName: string): string {
    const raw = (rawName ?? '').trim();
    if (!raw) return '';
    const chain = getChainForTypeName(raw);
    return chain && chain.length > 0 ? chain[0] : raw;
}

/**
 * Precompute descendants for all types using CHILDREN_MAP (cycle-safe).
 * Descendants are ordered by ITEM_TYPES declaration order.
 */
const DESCENDANTS_MAP = new Map<string, readonly string[]>();

function computeDescendants(name: string): readonly string[] {
    if (DESCENDANTS_MAP.has(name)) return DESCENDANTS_MAP.get(name)!;

    const visited = new Set<string>();
    const stack: string[] = (CHILDREN_MAP.get(name) || []).slice();
    while (stack.length) {
        const child = stack.pop()!;
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
        if (t.name !== name && visited.has(t.name)) ordered.push(t.name);
    }
    const frozen = Object.freeze(ordered);
    DESCENDANTS_MAP.set(name, frozen);
    return frozen;
}

export function getDescendantBaseNames(baseTypeName: string): string[] {
    return computeDescendants(baseTypeName).slice();
}

/**
 * Given a preset of filter options and a set of base item type names present in the data,
 * return a filtered list of options appropriate for that data.
 *
 * Rules:
 * - Always keep the '-' option (empty value).
 * - For most options (specific types like 'Axe'): include only if the option's base (value[0])
 *   appears in presentBaseNames.
 * - For aggregate options that intentionally include specific child types (e.g., 'Any Helm' which
 *   includes 'Primal Helm' and 'Pelt' as extras), include if the base OR any of those extras appear.
 *
 * We detect extras by comparing the option's value list to the canonical chain for its base: any
 * names not part of that base chain are considered extras.
 */
export function buildOptionsForPresentTypes(
    preset: ReadonlyArray<FilterOption>,
    presentBaseNames: ReadonlySet<string>
): FilterOption[] {
    const result: FilterOption[] = [];

    // Build a closure set that includes present bases and all their parents (using cached chains)
    const presentClosure = new Set<string>();
    for (const b of presentBaseNames) {
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

        // Triggers for inclusion: base or any explicit extras present in the data closure (incl. parents)
        let include: boolean;
        if (CLASS_AGGREGATE_BASES.has(base)) {
            // For class aggregates, only include when the aggregate itself is directly present
            include = presentBaseNames.has(base);
        } else {
            include = presentClosure.has(base);
            if (!include) {
                for (let k = 0; k < extras.length; k++) {
                    if (presentClosure.has(extras[k])) { include = true; break; }
                }
            }
        }
        if (include) result.push(opt);
    }
    return result;
}

// Reusable options for type filtering. Compared against JSON types to t/f display of type in dropdown.
export const type_filtering_options: ReadonlyArray<FilterOption> = [
    // Placeholder
    makeTypeOption('-', undefined),

    // Aggregate types
    // Any Armor should include all armor descendants (Body Armor, Helm, Circlet, Shields, Gloves, Boots, Belt, class shields/helms, etc.)
    makeTypeOption('Any Armor', 'Any Armor', getDescendantBaseNames('Any Armor')),
    // Any Helm should include Circlet, Primal Helm, and Pelt in addition to Helm
    makeTypeOption('Any Helm', 'Helm', getDescendantBaseNames('Helm')),
    // Any Shield should include generic Shield and class shields
    makeTypeOption('Any Shield', 'Any Shield', getDescendantBaseNames('Any Shield')),
    // Expand weapon aggregates so that selecting them matches child bases too
    makeTypeOption('Any Weapon', 'Weapon', getDescendantBaseNames('Weapon')),
    makeTypeOption('Melee Weapon', 'Melee Weapon', getDescendantBaseNames('Melee Weapon')),
    makeTypeOption('Missile Weapon', 'Missile Weapon', getDescendantBaseNames('Missile Weapon')),
    // Armor subtypes
    makeTypeOption('Body Armor', 'Body Armor'),
    makeTypeOption('Gloves', 'Gloves'),
    makeTypeOption('Boots', 'Boots'),
    makeTypeOption('Belt', 'Belt'),
    // Shields (Bases Page)
    makeTypeOption('Shield', 'Shield'),
    // Jewelry and socket fillers
    makeTypeOption('Ring', 'Ring'),
    makeTypeOption('Amulet', 'Amulet'),
    makeTypeOption('Jewel', 'Jewel'),
    makeTypeOption('Small Charm', 'Small Charm'),
    makeTypeOption('Large Charm', 'Large Charm'),
    makeTypeOption('Grand Charm', 'Grand Charm'),
    // Weapon bases
    makeTypeOption('Axe', 'Axe'),
    makeTypeOption('Mace', 'Mace'),
    makeTypeOption('Hammer', 'Hammer'),
    makeTypeOption('Sword', 'Sword'),
    makeTypeOption('Knife', 'Knife'),
    makeTypeOption('Spear', 'Spear'),
    makeTypeOption('Polearm', 'Polearm'),
    makeTypeOption('Staff', 'Staff'),
    makeTypeOption('Wand', 'Wand'),
    makeTypeOption('Bow', 'Bow'),
    makeTypeOption('Crossbow', 'Crossbow'),
    makeTypeOption('Javelin', 'Javelin'),
    makeTypeOption('Throwing Knife', 'Throwing Knife'),
    makeTypeOption('Throwing Axe', 'Throwing Axe'),
    // Quivers and Bolts
    makeTypeOption('Bow Quiver', 'Magic Bow Quiv'),
    makeTypeOption('Crossbow Bolts', 'Magic Xbow Quiv'),
    //Class Specific
    // Class-specific leaf types must match ONLY themselves (no leakage to their generic parents)
    makeTypeOption('Amazon Javelin', 'Amazon Javelin', [], true),
    makeTypeOption('Amazon Bow', 'Amazon Bow', [], true),
    makeTypeOption('Amazon Spear', 'Amazon Spear', [], true),
    makeTypeOption('Assassin Weapon', 'Hand to Hand', [], true),
    makeTypeOption('Barbarian Helm', 'Primal Helm', [], true),
    makeTypeOption('Druid Helm', 'Pelt', [], true),
    makeTypeOption('Necromancer Shield', 'Voodoo Heads', [], true),
    makeTypeOption('Paladin Shield', 'Auric Shields', [], true),
    makeTypeOption('Sorceress Orb', 'Orb', [], true),
];

// Utility lookups (optional)
export function findTypeByName(name: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_NAME.get(name);
}

export function findTypeByCode(code: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_CODE.get(code);
}
