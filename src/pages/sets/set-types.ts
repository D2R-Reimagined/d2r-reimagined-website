// Type definitions for set data

import { IKeyedLine } from '../../utilities/i-keyed-line';

export interface ISetItem {
    Type: string;
    Vanilla: string;
    Index: string;
    SetName: string;
    ItemLevel: number;
    RequiredLevel: number;
    Code: string;
    DamageArmorEnhanced: boolean;
    Lines: IKeyedLine[];
    SetBonuses: IKeyedLine[][];
    Equipment: {
        EquipmentType: number;
        NameKey: string;
        RequiredClass: string;
        DamageTypes?: {
            Type: number;
            AverageDamage: number;
            Lines: IKeyedLine[];
        }[];
        Lines: IKeyedLine[];
    };
}

export interface ISetData {
    Index: string;
    ItemLevel: number;
    Vanilla: string;
    SetItems: ISetItem[];
    PartialBonuses: IKeyedLine[];
    FullBonuses: IKeyedLine[];
}
