export type Visibility = 'show' | 'hide';
export type NumberTest = Partial<Record<'eq' | 'gt' | 'gte' | 'lt' | 'lte', number>>;
export type MultiValue = string | string[];
export interface Conditions {
  code?: MultiValue;
  baseName?: MultiValue;
  itemType?: MultiValue;
  rarity?: MultiValue;
  quantity?: NumberTest;
  itemLevel?: NumberTest;
  sockets?: NumberTest;
  ethereal?: boolean;
  identified?: boolean;
}
export interface RuleBlock {
  ruleName?: string;
  conditions?: Conditions;
  continue?: boolean;
  name?: string;
  tooltip?: { backgroundColor?: string; textColor?: string };
  dropSound?: string;
  minimapIcon?: { shape: string; borderColor: string; fillColor: string; size?: number };
}
export type Rule = { show: RuleBlock; hide?: never } | { hide: RuleBlock; show?: never };
export interface Filter { version: 3; rules: Rule[] }
export interface CatalogItem {
  kind: string;
  code?: string;
  name: string;
  displayName?: string;
  type?: string;
  type2?: string;
  baseCode?: string;
  baseName?: string;
}
export interface Catalog {
  baseItems: CatalogItem[];
  uniqueItems: CatalogItem[];
  setItems: CatalogItem[];
  baseNames: string[];
  itemTypes: string[];
  itemTypeMap: Map<string, Set<string>>;
}
export const values = (value?: MultiValue): string[] => value === undefined ? [] : Array.isArray(value) ? value : [value];
export const blockOf = (rule: Rule): RuleBlock => rule.show ?? rule.hide!;
export const kindOf = (rule: Rule): Visibility => rule.hide ? 'hide' : 'show';
