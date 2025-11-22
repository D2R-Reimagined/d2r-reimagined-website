// Centralized filter constants built from data in
// C:\z_GitHub\d2r-reimagined-mod\data\global\excel\itemtypes.txt
//
// Purpose
// - Provide a single source of truth for item type names, codes, and basic parent relationships
// - Expose reusable option builders for dropdowns across multiple pages (e.g., Runewords)
// - Keep UI labels decoupled from underlying type names when needed
//
// Notes
// - The parent relationships come from the Equiv1 / Equiv2 columns of itemtypes.txt.
//   We represent parents using human-readable ItemType names rather than codes.
// - This file intentionally includes the major types currently used by filters across pages.
//   You can extend ITEM_TYPES with more rows from itemtypes.txt as needed.

export interface ItemTypeNode {
    // Human-friendly name (itemtypes.txt column: ItemType)
    name: string;
    // Short code (itemtypes.txt column: Code)
    code: string;
    // Human-friendly parent names (derived from Equiv1/Equiv2). Order: nearest parent first.
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
    { name: 'Crossbow Quiver', code: 'xboq', parents: ['Missile', 'Second Hand'] },
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

/**
 * Returns a type chain used for filtering, starting with the specific type name,
 * followed by its parent names recursively (nearest parent first).
 * Example: getTypeChain('Axe') => ['Axe', 'Melee Weapon', 'Weapon']
 */
export function getTypeChain(name: string): string[] {
    const seen = new Set<string>();
    const chain: string[] = [];

    let current = ITEM_TYPE_BY_NAME.get(name);
    while (current && !seen.has(current.name)) {
        chain.push(current.name);
        seen.add(current.name);
        const parentName = current.parents?.[0]; // follow nearest parent first
        current = parentName ? ITEM_TYPE_BY_NAME.get(parentName) : undefined;
    }
    // If there are multiple parents listed, include the additional branches after the main chain
    // (kept simple to avoid duplicates while keeping ordering intuitive for filters)
    const first = ITEM_TYPE_BY_NAME.get(name);
    if (first && first.parents && first.parents.length > 1) {
        for (let i = 1; i < first.parents.length; i++) {
            const p = first.parents[i];
            if (!seen.has(p)) {
                chain.push(p);
                seen.add(p);
                const sub = getTypeChain(p);
                for (const s of sub.slice(1)) { // avoid re-adding p itself
                    if (!seen.has(s)) {
                        chain.push(s);
                        seen.add(s);
                    }
                }
            }
        }
    }
    return chain;
}

/**
 * Convenience: given a (possibly non-canonical) type name coming from game data,
 * return the full chain (itself + parents) using our canonical type graph where possible.
 */
export function getChainForTypeName(rawName: string): string[] {
    const raw = (rawName ?? '').trim();
    if (!raw) return [''];
    // Prefer case-insensitive match to align JSON values with our graph without renaming them globally
    const node = ITEM_TYPE_BY_NAME.get(raw) || ITEM_TYPE_BY_NAME_LC.get(raw.toLowerCase());
    return node ? getTypeChain(node.name) : [raw];
}

export interface FilterOption {
    label: string;
    value: string[];
}

// Class aggregate base names (these should only appear as options when the aggregate itself
// exists in the page data; children like Primal Helm, Pelt, Orb, etc. should NOT cause these
// aggregates to be shown to avoid over-typed dropdowns and duplicates).
const CLASS_AGGREGATE_BASES = new Set<string>([
    'Amazon Item',
    'Barbarian Item',
    'Necromancer Item',
    'Paladin Item',
    'Sorceress Item',
    'Assassin Item',
    'Druid Item',
]);

/**
 * Convenience to build a FilterOption from an ItemType name and optional extra parents to append.
 */
export function makeTypeOption(label: string, baseTypeName?: string, extraParents: string[] = []): FilterOption {
    const value = baseTypeName ? getTypeChain(baseTypeName) : [];
    for (const p of extraParents) {
        if (!value.includes(p)) value.push(p);
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

    // Build a closure set that includes present bases and all their parents.
    const presentClosure = new Set<string>();
    for (const b of presentBaseNames) {
        presentClosure.add(b);
        const chain = getTypeChain(b);
        for (const c of chain.slice(1)) presentClosure.add(c);
    }

    for (const opt of preset) {
        // keep placeholder option
        if (!opt.value || opt.value.length === 0) {
            result.push(opt);
            continue;
        }

        const base = opt.value[0];
        const baseChain = getTypeChain(base);
        // extras are items that are not part of the base chain (i.e., explicitly appended children)
        const extras = opt.value.filter(v => !baseChain.includes(v));

        // Triggers for inclusion: base or any explicit extras present in the data closure (incl. parents)
        const triggers = [base, ...extras];
        let include: boolean;

        if (CLASS_AGGREGATE_BASES.has(base)) {
            // For class aggregates, only include when the aggregate itself is directly present
            // as a base type in the data. Do NOT include just because a child (e.g., Primal Helm)
            // or parent appears via closure to avoid over-populating the dropdown.
            include = presentBaseNames.has(base);
        } else {
            include = triggers.some(t => presentClosure.has(t));
        }
        if (include) result.push(opt);
    }
    return result;
}

// Reusable options for Runewords-style type filtering.
// Kept here so multiple pages can import the same options.
export const type_filtering_options: ReadonlyArray<FilterOption> = [
    // Placeholder
    makeTypeOption('-', undefined),

    // Aggregate types
    { label: 'Any Armor', value: ['Body Armor', 'Helm', 'Any Shield', 'Gloves', 'Boots', 'Belt'] },
    { label: 'Any Helm', value: ['Helm', 'Primal Helm', 'Pelt'] },
    { label: 'Any Shield', value: ['Any Shield', 'Voodoo Heads', 'Auric Shields'] },
    makeTypeOption('Any Weapon', 'Weapon'),
    makeTypeOption('Melee Weapon', 'Melee Weapon'),
    makeTypeOption('Missile Weapon', 'Missile Weapon'),

    // Armor subtypes
    makeTypeOption('Body Armor', 'Body Armor'),
    makeTypeOption('Gloves', 'Gloves'),
    makeTypeOption('Boots', 'Boots'),
    makeTypeOption('Belt', 'Belt'),

    // Shields
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

    //Class Specific
    makeTypeOption('Amazon Javelin', 'Amazon Javelin'),
    makeTypeOption('Amazon Bow', 'Amazon Bow'),
    makeTypeOption('Amazon Spear', 'Amazon Spear'),
    makeTypeOption('Assassin Weapon', 'Hand to Hand'),
    makeTypeOption('Barbarian Helm', 'Primal Helm'),
    makeTypeOption('Druid Helm', 'Pelt'),
    makeTypeOption('Necromancer Shield', 'Voodoo Heads'),
    makeTypeOption('Paladin Shield', 'Auric Shields'),
    makeTypeOption('Sorceress Orb', 'Orb'),
];

// Utility lookups (optional)
export function findTypeByName(name: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_NAME.get(name);
}

export function findTypeByCode(code: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_CODE.get(code);
}
