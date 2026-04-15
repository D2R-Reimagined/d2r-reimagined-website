import {
    getWeaponNonPhysDamValue,
    getWeaponPhysDamValue,
    IUniqueItem,
} from './damage-types';

export type WeaponSortMode = 'none' |
    'avg-throw-phys-ascending' | 'avg-throw-phys-descending' |
    'avg-1h-phys-ascending' | 'avg-1h-phys-descending' |
    'avg-2h-phys-ascending' | 'avg-2h-phys-descending' |
    'avg-non-phys-ascending' | 'avg-non-phys-descending';

export const weaponSortOptions = [
    { id: 'sort1h', type: '1h-phys', label: '1H Physical', help: 'Sort by One-Handed Physical Damage.' },
    { id: 'sort2h', type: '2h-phys', label: '2H Physical', help: 'Sort by Two-Handed Physical Damage.' },
    { id: 'sortthrow', type: 'throw-phys', label: 'Throw Physical', help: 'Sort by Throw Physical Damage.' },
    { id: 'sortnonphys', type: 'non-phys', label: 'Non-Physical', help: 'Sort by Non-Physical Damage.' },
];

export function sortItemsByWeaponDamage<T>(items: T[], mode: WeaponSortMode): T[] {
    if (mode === 'none') return items;

    const isAsc = mode.includes('ascending');
    return items.slice().sort((a, b) => {
        let vA = 0, vB = 0;
        if (mode.includes('1h-phys')) {
            vA = getWeaponPhysDamValue(a as unknown as IUniqueItem, [3, 0]);
            vB = getWeaponPhysDamValue(b as unknown as IUniqueItem, [3, 0]);
        } else if (mode.includes('2h-phys')) {
            vA = getWeaponPhysDamValue(a as unknown as IUniqueItem, 1);
            vB = getWeaponPhysDamValue(b as unknown as IUniqueItem, 1);
        } else if (mode.includes('throw-phys')) {
            vA = getWeaponPhysDamValue(a as unknown as IUniqueItem, 2);
            vB = getWeaponPhysDamValue(b as unknown as IUniqueItem, 2);
        } else if (mode.includes('non-phys')) {
            vA = getWeaponNonPhysDamValue(a as unknown as IUniqueItem);
            vB = getWeaponNonPhysDamValue(b as unknown as IUniqueItem);
        }

        if (vA === 0 && vB !== 0) return 1;
        if (vA !== 0 && vB === 0) return -1;
        return isAsc ? vA - vB : vB - vA;
    });
}

export function toggleWeaponSort(currentMode: WeaponSortMode, type: string): WeaponSortMode {
    if (typeof window !== 'undefined' && window.getSelection()?.toString().trim()) {
        return currentMode;
    }
    const desc = `avg-${type}-descending` as WeaponSortMode;
    const asc = `avg-${type}-ascending` as WeaponSortMode;
    return currentMode === desc ? asc : (currentMode === asc ? 'none' : desc);
}

export function getSortKeyFromDamageType(type: number): string | null {
    if (type === 0 || type === 3) return '1h-phys';
    if (type === 1) return '2h-phys';
    if (type === 2) return 'throw-phys';
    if (type === 4) return 'non-phys';
    return null;
}

// Hand filter: cycles All → 1H Only → 2H Only → All
export type HandFilterMode = 'all' | '1h' | '2h';

export function toggleHandFilter(current: HandFilterMode): HandFilterMode {
    if (current === 'all') return '1h';
    if (current === '1h') return '2h';
    return 'all';
}

export function getHandFilterLabel(mode: HandFilterMode): string {
    if (mode === '1h') return '1H Only';
    if (mode === '2h') return '2H Only';
    return 'All';
}

/**
 * Returns true if the item should be kept based on the hand filter.
 * Checks DamageTypes on the item (or item.Equipment for uniques).
 * - '1h': keep only if it does NOT have 2H damage (Type 1)
 * - '2h': keep only if it DOES have 2H damage (Type 1)
 * - 'all': keep everything
 */
export function passesHandFilter(damageTypes: { Type: number }[] | undefined | null, mode: HandFilterMode): boolean {
    if (mode === 'all') return true;
    const has2H = Array.isArray(damageTypes) && damageTypes.some(d => d.Type === 1);
    if (mode === '1h') return !has2H;
    if (mode === '2h') return has2H;
    return true;
}
