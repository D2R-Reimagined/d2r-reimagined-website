import type {
  TradePropertyFilterGroup,
  TradePropertyGroupType
} from '$lib/trades';

export interface TradePropertyFilterDraft {
  id: number;
  query: string;
  stat: string;
  minimumValue: string;
  maximumValue: string;
  valueShift: number;
  valueFunction?: number;
}

export interface TradePropertyGroupDraft {
  id: number;
  type: TradePropertyGroupType;
  minimumCount: string;
  maximumCount: string;
  filters: TradePropertyFilterDraft[];
}

let nextDraftId = 0;

export function createTradePropertyFilter(): TradePropertyFilterDraft {
  return {
    id: ++nextDraftId,
    query: '',
    stat: '',
    minimumValue: '',
    maximumValue: '',
    valueShift: 0
  };
}

export function createTradePropertyGroup(
  type: TradePropertyGroupType = 'And'
): TradePropertyGroupDraft {
  return {
    id: ++nextDraftId,
    type,
    minimumCount: '1',
    maximumCount: '',
    filters: [createTradePropertyFilter()]
  };
}

export function activeTradePropertyCount(groups: TradePropertyGroupDraft[]): number {
  return groups.reduce(
    (count, group) => count + group.filters.filter((filter) => filter.stat).length,
    0
  );
}

export function invalidTradePropertyQuery(groups: TradePropertyGroupDraft[]): boolean {
  return groups.some((group) => group.filters.some(
    (filter) => filter.query.trim().length > 0 && !filter.stat
  ));
}

export function toTradePropertyFilterGroups(
  groups: TradePropertyGroupDraft[]
): TradePropertyFilterGroup[] {
  return groups.flatMap((group) => {
    const filters = group.filters
      .filter((filter) => filter.stat)
      .map((filter) => ({
        stat: filter.stat,
        minimumValue: optionalNumber(filter.minimumValue),
        maximumValue: optionalNumber(filter.maximumValue),
        valueShift: filter.valueShift,
        valueFunction: filter.valueFunction
      }));
    if (!filters.length) return [];

    return [{
      type: group.type,
      minimumCount: group.type === 'Count' ? optionalNumber(group.minimumCount) : undefined,
      maximumCount: group.type === 'Count' ? optionalNumber(group.maximumCount) : undefined,
      filters
    }];
  });
}

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
