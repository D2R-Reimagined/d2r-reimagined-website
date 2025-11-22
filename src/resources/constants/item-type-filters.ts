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

// Minimal, curated set of types and their relationships used by filters today.
// Extend this list if new pages need more detailed types from itemtypes.txt.
export const ITEM_TYPES: ReadonlyArray<ItemTypeNode> = [
    // High-level categories
    {name: 'Weapon', code: 'weap'},
    {name: 'Melee Weapon', code: 'mele', parents: ['Weapon']},
    {name: 'Missile Weapon', code: 'miss', parents: ['Weapon']},
    {name: 'Any Armor', code: 'armo'},
    {name: 'Any Shield', code: 'shld', parents: ['Any Armor']},

    // Armor subtypes
    {name: 'Armor', code: 'tors', parents: ['Any Armor']},
    // Note: itemtypes.txt in the mod shows "Helm" with a non-standard code in row 39 and also a
    //       "Merc Equip" line in row 107 that points to helm. For filters we use canonical name "Helm".
    {name: 'Helm', code: 'helm', parents: ['Any Armor']},
    {name: 'Circlet', code: 'circ', parents: ['Helm']},

    // Weapon families
    {name: 'Axe', code: 'axe', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Club', code: 'club', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Hammer', code: 'hamm', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Hand to Hand', code: 'h2h', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Mace', code: 'mace', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Orb', code: 'orb', parents: ['Weapon']},
    {name: 'Polearm', code: 'pole', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Scepter', code: 'scep', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Staff', code: 'staf', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Spear', code: 'spea', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Sword', code: 'swor', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Wand', code: 'wand', parents: ['Melee Weapon', 'Weapon']},
    {name: 'Bow', code: 'bow', parents: ['Missile Weapon', 'Weapon']},
    {name: 'Crossbow', code: 'xbow', parents: ['Missile Weapon', 'Weapon']},

    // Class-specific aggregations
    {name: 'Amazon Item', code: 'amaz'},
    {name: 'Barbarian Item', code: 'barb'},
    {name: 'Necromancer Item', code: 'necr'},
    {name: 'Paladin Item', code: 'pala'},
    {name: 'Sorceress Item', code: 'sorc'},
    {name: 'Assassin Item', code: 'assn'},
    {name: 'Druid Item', code: 'drui'},

    // Amazon specific weapons
    {name: 'Amazon Bow', code: 'abow', parents: ['Missile Weapon', 'Weapon']},
    {name: 'Amazon Spear', code: 'aspe', parents: ['Spear', 'Melee Weapon', 'Weapon']},
    {name: 'Amazon Javelin', code: 'ajav', parents: ['Melee Weapon', 'Weapon']},

    // Shields (class specific)
    {name: 'Voodoo Heads', code: 'head', parents: ['Any Shield']}, // Necromancer shields
    {name: 'Auric Shields', code: 'ashd', parents: ['Any Shield']}, // Paladin shields
];

export const ITEM_TYPE_BY_NAME = new Map<string, ItemTypeNode>(
    ITEM_TYPES.map((t) => [t.name, t])
);

export const ITEM_TYPE_BY_CODE = new Map<string, ItemTypeNode>(
    ITEM_TYPES.map((t) => [t.code, t])
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
 * Some sources (JSON/game data) use slightly different names than our canonical filter names.
 * When a discrepancy exists, we treat the names defined in this file as canonical.
 * This helper converts raw names from game files to our canonical names.
 */
export function canonicalizeTypeName(name: string): string {
    const n = (name || '').trim();
    const lower = n.toLowerCase();
    switch (lower) {
        case 'merc equip':
            return 'Helm';
        case 'body armor':
            return 'Armor';
        case 'shield':
            return 'Any Shield';
        case 'hand to hand 2':
            return 'Hand to Hand';
        case 'primal helm':
            return 'Helm';
        case 'pelt':
            return 'Helm';
        default:
            return n;
    }
}

/**
 * Convenience: given a (possibly non-canonical) type name coming from game data,
 * return the full chain (itself + parents) using our canonical type graph where possible.
 */
export function getChainForTypeName(rawName: string): string[] {
    const canon = canonicalizeTypeName(rawName);
    const exists = ITEM_TYPE_BY_NAME.has(canon);
    return exists ? getTypeChain(canon) : [canon];
}

export interface FilterOption {
    label: string;
    value: string[];
}

/**
 * Convenience to build a FilterOption from an ItemType name and optional extra parents to append.
 */
export function makeTypeOption(label: string, baseTypeName?: string, extraParents: string[] = []): FilterOption {
    const value = baseTypeName ? getTypeChain(baseTypeName) : [];
    for (const p of extraParents) {
        if (!value.includes(p)) value.push(p);
    }
    return {label, value};
}

// Reusable options for Runewords-style type filtering.
// Kept here so multiple pages can import the same options.
export const RUNEWORD_TYPE_OPTIONS: ReadonlyArray<FilterOption> = [
    makeTypeOption('-', undefined),
    makeTypeOption('Any Armor', 'Any Armor'),
    // UI label says "Any Helm" but the underlying chain starts from Helm (then Any Armor)
    makeTypeOption('Any Helm', 'Helm'),
    makeTypeOption('Any Weapon', 'Weapon'),
    makeTypeOption('Any Melee Weapon', 'Melee Weapon'),
    makeTypeOption('Any Missile Weapon', 'Missile Weapon'),
    makeTypeOption('Any Shield', 'Any Shield'),

    // Specific weapons
    makeTypeOption('Axe', 'Axe'),
    makeTypeOption('Club', 'Club'),
    makeTypeOption('Hammer', 'Hammer'),
    makeTypeOption('Hand to Hand', 'Hand to Hand'),
    makeTypeOption('Mace', 'Mace'),
    // Orb is treated specially in some UIs; we still include parent chain for consistency
    makeTypeOption('Orb', 'Orb'),
    makeTypeOption('Polearm', 'Polearm'),
    makeTypeOption('Scepter', 'Scepter'),
    makeTypeOption('Staff', 'Staff'),
    makeTypeOption('Spear', 'Spear'),
    makeTypeOption('Sword', 'Sword'),
    makeTypeOption('Wand', 'Wand'),

    // Specific armor
    makeTypeOption('Circlet', 'Circlet'),

    // Class-specific
    makeTypeOption('Amazon Bow', 'Amazon Bow'),
    makeTypeOption('Amazon Spear', 'Amazon Spear'),
    // The current Runewords UI uses label "Necromancer Shield" but filters on "Necromancer Item"
    makeTypeOption('Necromancer Shield', 'Necromancer Item'),
    makeTypeOption('Barbarian Item', 'Barbarian Item'),
    makeTypeOption('Paladin Item', 'Paladin Item'),
    makeTypeOption('Druid Item', 'Druid Item'),
];

export interface NumberOption<T extends number | undefined = number | undefined> {
    value: T;
    label: string;
}

// Reusable socket amount options
export const SOCKET_AMOUNT_OPTIONS: ReadonlyArray<NumberOption> = [
    {value: undefined, label: 'Any'},
    {value: 2, label: '2 Sockets'},
    {value: 3, label: '3 Sockets'},
    {value: 4, label: '4 Sockets'},
    {value: 5, label: '5 Sockets'},
    {value: 6, label: '6 Sockets'},
];

// Utility lookups (optional)
export function findTypeByName(name: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_NAME.get(name);
}

export function findTypeByCode(code: string): ItemTypeNode | undefined {
    return ITEM_TYPE_BY_CODE.get(code);
}
