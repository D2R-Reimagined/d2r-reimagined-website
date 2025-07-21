// Type definitions for set data

export interface IProperty {
    PropertyString?: string;
    Index: number;
}

export interface IEquipment {
    Name: string;
    DamageString?: string;
    ArmorString?: string;
    EquipmentType?: number;
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
    ItemLevel?: number;
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
}

export interface ISetData {
    Index: string;
    Name: string;
    SetItems: ISetItem[];
    FullProperties: IProperty[];
    PartialProperties: IProperty[];
    AllProperties?: IProperty[]; // Added by the code
}