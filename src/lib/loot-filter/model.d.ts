import type { Catalog, CatalogItem, Filter, Rule, RuleBlock, Visibility } from './types';

interface Validation { errors: string[]; warnings: string[]; json: string; bytes: number }
interface FilterModel {
  MAX_RULES: number;
  MAX_BYTES: number;
  RARITIES: string[];
  DROP_SOUNDS: string[];
  MINIMAP_SHAPES: string[];
  buildCatalog(data: Record<string, unknown>): Catalog;
  validateFilter(filter: unknown, catalog?: Catalog): Validation;
  makeRule(kind: Visibility): Rule;
  ruleKind(rule: Rule): Visibility;
  ruleBlock(rule: Rule): RuleBlock;
  clone<T>(value: T): T;
  createRuleForFinderItem(item: CatalogItem, visibility: Visibility): Rule;
  summarizeRule(rule: Rule): { kind: Visibility; ruleName: string; conditionSummary: string; actionSummary: string };
  parseRgba(value: unknown): { r: number; g: number; b: number; a: number } | null;
  rgbaToHex(value: string): { hex: string; alpha: number };
  rgbaString(hex: string, alpha: number | string): string;
}
declare const model: FilterModel;
export default model;
