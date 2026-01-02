// Type definitions for set data

export interface IProperty {
    PropertyString?: string;
    Index: number;
}

export interface IEquipment {
    Name: string;
    DamageString?: string;
    DamageTypes?: { Type: number, DamageString: string }[];
    ArmorString?: string;
    EquipmentType?: number;
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
    ItemLevel?: number;
    RequiredClass?: string; // present in some data and used in grail filters
}

export interface ISetItem {
    Type: string;
    Set: string;
    SetPropertiesString?: string[];
    Name: string;
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
    SetItems: ISetItem[];
    FullProperties: IProperty[];
    PartialProperties: IProperty[];
    AllProperties?: IProperty[];
    Vanilla?: string |number |boolean; // present in data, used in filtering
}
