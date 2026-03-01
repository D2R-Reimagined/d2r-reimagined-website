// Type definitions for set data

import { IDamageType } from '../../utilities/damage-types';

export interface IProperty {
    PropertyString?: string;
    'group-properties'?: Record<string, IProperty[]>;
    pickmode?: number;
    Index?: number;
    Chance?: number;
}

export interface IEquipment {
    Name: string;
    Names: Record<string, string>
    DamageString?: string;
    DamageTypes?: IDamageType[];
    ArmorString?: string;
    EquipmentType?: number;
    RequiredStrength?: string;
    RequiredDexterity?: string;
    Durability?: number;
    ItemLevel?: number;
    RequiredClass?: string; // present in some data and used in grail filters
}

export interface ISetItem {
    Type: string;
    Set: string;
    SetNames: Record<string, string>;
    SetPropertiesString?: string[];
    Name: string;
    Names: Record<string, string>
    Index: string;
    Enabled: boolean;
    Rarity: number;
    ItemLevel: number;
    RequiredLevel: number;
    Code: string;
    Properties: IProperty[];
    Equipment: IEquipment;
    DamageArmorEnhanced?: boolean;
    Vanilla?: string | number | boolean; // present in data, used in filtering
}

export interface ISetData {
    Index: string;
    Name: string;
    Names: Record<string, string>
    SetItems: ISetItem[];
    FullProperties: IProperty[];
    PartialProperties: IProperty[];
    AllProperties?: IProperty[];
    Vanilla?: string |number |boolean; // present in data, used in filtering
}
