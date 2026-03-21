export interface IDamageType {
    Type: number;
    DamageString: string;
    AverageDamage?: number;
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
        case 4: return 'Elemental Damage:';
        case 3: return 'One-Hand Damage:';
        case 2: return 'Throw Damage:';
        case 1: return 'Two-Hand Damage:';
        case 0: return 'One-Hand Damage:';
        default: return 'Damage:';
    }
}

/**
 * Reads the pre-calculated physical damage average from the item
 */
export function getWeaponPhysDamValue(unique: IUniqueItem, dam_type: number | number[]): number {
    const types = Array.isArray(dam_type) ? dam_type : [dam_type];
    const damEntry = unique.Equipment?.DamageTypes?.find((e: IDamageType) => types.includes(e.Type));
    return damEntry?.AverageDamage ?? 0;
}

/**
 * Reads the pre-calculated non-physical damage average from the item
 */
export function getWeaponNonPhysDamValue(unique: IUniqueItem): number {
    return unique.Equipment?.DamageTypes?.filter(d => d.Type === 4).reduce((acc, d) => {
        return acc + (d.AverageDamage ?? 0);
    }, 0) ?? 0;
}
