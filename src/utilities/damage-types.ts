export interface ISimpleDamage {
    min: number;
    max: number;
}

export interface IRangedDamage {
    min_min: number;
    min_max: number;
    max_min: number;
    max_max: number;
}

export interface IDamageType {
    Type: number;
    DamageString: string;
}

export interface IUniqueEquipment {
    Name?: string;
    RequiredClass?: string;
    DamageTypes?: IDamageType[];
}

export interface IUniqueProperty {
    PropertyString?: string;
}

export interface IUniqueItem {
    Name?: string;
    Type?: string;
    Equipment?: IUniqueEquipment;
    Properties?: IUniqueProperty[];
    Vanilla?: string | number | boolean;
}

export function getDamageTypeString(type: number): string {
    switch (type) {
        case 3: return 'One-Hand Damage:';
        case 2: return 'Throw Damage:';
        case 1: return 'Two-Hand Damage:';
        case 0: return 'One-Hand Damage:';
        default: return 'Damage:';
    }
}

/**
 * Parse the damage string from a given item
 * NOTE: Matches: (1) X to Y; (2) (X1-X2) to (Y1-Y2); (3) X to (Y1-Y2); (4) (X1-X2) to Y
 */
export function parseDamageString(damage_string: string): ISimpleDamage | IRangedDamage | null {
    const parts = damage_string?.split(/\s+to\s+/);
    if (parts?.length !== 2) return null;

    const parseSide = (s: string) => {
        const m = s.trim().match(/^(\d+)$|^\((\d+)\s*-\s*(\d+)\)$/);
        return m ? (m[1] ? { min: +m[1], max: +m[1] } : { min: +m[2], max: +m[3] }) : null;
    };

    const l = parseSide(parts[0]), r = parseSide(parts[1]);
    if (!l || !r) return null;

    return (l.min === l.max && r.min === r.max)
        ? { min: l.min, max: r.min }
        : { min_min: l.min, min_max: l.max, max_min: r.min, max_max: r.max };
}

/**
 * Parse the final physical damage lines from items
 */
export function getWeaponPhysDamValue(unique: IUniqueItem, dam_type: number | number[]): number {
    const types = Array.isArray(dam_type) ? dam_type : [dam_type];
    const damage_string = unique.Equipment?.DamageTypes?.find((e: IDamageType) => types.includes(e.Type))?.DamageString;
    const p = parseDamageString(damage_string ?? '');
    if (!p) return 0;
    return 'min' in p ? (p.min + p.max) / 2 : (p.min_min + p.min_max + p.max_min + p.max_max) / 4;
}

/**
 * Reads and parses unique item's single properties and matches possible formats.
 */
export function parseDamageProperty(property_string: string): ISimpleDamage | null {
    if (!property_string) return null;
    const ELEMENTAL_DAMAGE_REGEX = /^(?:Adds\s+(\d+)\s*-\s*(\d+)\s+(?:to\s+(?:Cold|Fire|Lightning)\s+Damage|Weapon\s+(?:Cold|Lightning|Fire|Magic)\s+Damage|magic\s+damage))|(?:\+(\d+)\s*-\s*(\d+)\s+to\s+Minimum\s+(?:Cold|Lightning|Fire|Poison)\s+Damage)$/i;
    const m = property_string.match(ELEMENTAL_DAMAGE_REGEX);
    return m ? (m[1] !== undefined ? { min: +m[1], max: +m[2] } : { min: +m[3], max: 0 }) : null;
}

/**
 * Reads properties, selects them in case they are a damage property and adds to the total average accordingly.
 */
export function getWeaponNonPhysDamValueFromProperties(unique: IUniqueItem): number {
    return unique.Properties?.reduce((acc: number, p: IUniqueProperty) => {
        const d = parseDamageProperty(p.PropertyString ?? '');
        return acc + (d ? (d.min + d.max) / 2 : 0);
    }, 0) ?? 0;
}
