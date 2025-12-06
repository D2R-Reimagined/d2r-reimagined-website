      import { bindable, watch, resolve } from 'aurelia';
      import { IRouter } from '@aurelia/router';

      import json from '../item-jsons/armors.json';
      import {
          type_filtering_options,
          buildOptionsForPresentTypes,
          resolveBaseTypeName,
          getChainForTypeName,
          FilterOption
      } from '../../resources/constants/item-type-filters';

      // New automagic property schema (legacy no longer supported)
      type NewPropGroup = { Name: string; Level?: number; RequiredLevel?: number; PropertyStrings: string[]; Index?: number };

      type ArmorBase = {
          Name: string;
          ArmorString?: string | null;
          DamageString?: string | null;
          DamageStringPrefix?: string | null;
          Block?: number | null;
          StrBonus?: number;
          DexBonus?: number;
          EquipmentType?: number;
          BaseRequiredLevel?: number;
          RequiredStrength?: number;
          RequiredDexterity?: number;
          Durability?: number;
          ItemLevel?: number;
          Type?: { Name?: string; Index?: string; Class?: string } | null;
          NormCode?: string | null;
          UberCode?: string | null;
          UltraCode?: string | null;
          GemSockets?: number | null;
          AutoPrefix?: string | null;
          RequiredClass?: string | null;
          AutoMagicGroups?: NewPropGroup[] | null;
          __index?: number; // synthetic index based on array order
      };

      type Family = { familyKey: string; items: ArmorBase[]; minIndex: number };
      type Group = { typeName: string; families: Family[] };

      export class Armors {
          // Aurelia router
          private readonly router = resolve(IRouter);
          // dataset switcher (for banner dropdown)
          datasetOptions = [
              { value: 'armors', label: 'Armors' },
              { value: 'weapons', label: 'Weapons' },
          ];
          selectedDataset = 'armors';

          // Full list from JSON
          items: ArmorBase[] = (json as unknown as ArmorBase[]).map((it, idx) => ({ ...it, __index: idx }));

          @bindable search: string;
          // Selected type option value (base + parents)
          @bindable selectedType: string[];
          @bindable selectedTier: 'Normal' | 'Exceptional' | 'Elite' | undefined;

          tierOptions = [
              { value: undefined, label: '-' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Exceptional', label: 'Exceptional' },
              { value: 'Elite', label: 'Elite' },
          ];

          // Centralized, data-driven type options filtered to present types in bases data
          types: ReadonlyArray<FilterOption> = type_filtering_options.slice();

          // Build options and hydrate from URL BEFORE controls render
          binding() {
              // Build type options from present base types in armors data
              try {
                  const present = new Set<string>();
                  (json as ArmorBase[]).forEach(i => {
                      const base = resolveBaseTypeName(i?.Type?.Name ?? '');
                      if (base) present.add(base);
                  });
                  this.types = buildOptionsForPresentTypes(type_filtering_options, present);
              } catch {
                  // keep default preset
              }

              // Hydrate 'type' from URL (base token) to exact option.value reference
              const urlParams = new URLSearchParams(window.location.search);
              // search
              const searchParam = urlParams.get('search');
              if (searchParam) this.search = searchParam;
              // tier
              const tierParam = urlParams.get('tier');
              if (tierParam === 'Normal' || tierParam === 'Exceptional' || tierParam === 'Elite') {
                  this.selectedTier = tierParam as any;
              }
              const typeParam = urlParams.get('type');
              if (typeParam) {
                  const base = typeParam.split(',')[0];
                  const opt = this.types.find(o => o.value && o.value[0] === base);
                  this.selectedType = opt?.value;
              }
          }

          attached() {
              // keep dataset selector defaulted correctly when landing via navigation
              this.selectedDataset = 'armors';
          }

          @watch('selectedDataset')
          handleDatasetChanged() {
              this.onDatasetChange();
          }

          // Reflect filters into URL (no reload)
          private updateUrl() {
              const url = new URL(window.location.href);
              // search
              if (this.search && this.search.trim() !== '') {
                  url.searchParams.set('search', this.search);
              } else {
                  url.searchParams.delete('search');
              }
              // type (base token)
              if (this.selectedType && this.selectedType.length > 0) {
                  url.searchParams.set('type', this.selectedType[0]);
              } else {
                  url.searchParams.delete('type');
              }
              // tier
              if (this.selectedTier) {
                  url.searchParams.set('tier', this.selectedTier);
              } else {
                  url.searchParams.delete('tier');
              }
              window.history.pushState({}, '', url.toString());
          }

          @watch('search')
          handleSearchChanged() {
              this.updateUrl();
          }

          @watch('selectedType')
          handleTypeChanged() {
              this.updateUrl();
          }

          @watch('selectedTier')
          handleTierChanged() {
              this.updateUrl();
          }

          onDatasetChange() {
              // Navigate using Aurelia router (so the component actually changes), preserving query params
              const target = this.selectedDataset === 'armors' ? '/armors' : '/weapons';

              const url = new URL(window.location.href);
              if (url.pathname === target) return; // already there

              const qs = url.search || '';
              // Use router.load to trigger a real navigation + component swap
              void this.router.load(`${target}${qs}`);
          }

          // Type options provided via this.types property

          get filteredAndGrouped(): Group[] {
              const search = (this.search || '').toLowerCase();
              const typeFilter = this.selectedType;
              const tierFilter = this.selectedTier;

              const allItems = this.items || [];

              // Helper: basic search match across key fields
              const matchesSearch = (i: ArmorBase) => {
                  if (!search) return true;
                  const hay = [
                      i.Name,
                      i.Type?.Name,
                      i.NormCode ?? '',
                      i.UberCode ?? '',
                      i.UltraCode ?? '',
                  ]
                      .filter(Boolean)
                      .join(' ')
                      .toLowerCase();
                  return hay.includes(search);
              };

              // Primary matches using search
              const primary = search ? allItems.filter(matchesSearch) : allItems.slice();

              // Build associated set from code family (single-hop, non-recursive)
              let combinedSet: Set<ArmorBase>;
              if (search) {
                  const codeSet = new Set<string>();
                  for (const i of primary) {
                      if (i.NormCode) codeSet.add(i.NormCode.toLowerCase());
                      if (i.UberCode) codeSet.add(i.UberCode.toLowerCase());
                      if (i.UltraCode) codeSet.add(i.UltraCode.toLowerCase());
                  }
                  const associated = allItems.filter(i => {
                      const codes = [i.NormCode, i.UberCode, i.UltraCode].filter(Boolean).map(c => (c as string).toLowerCase());
                      return codes.some(c => codeSet.has(c));
                  });
                  combinedSet = new Set<ArmorBase>([...primary, ...associated]);
              } else {
                  combinedSet = new Set<ArmorBase>(primary);
              }

              // Apply Type and Tier filters (Tier is strict as per requirement)
              const filtered = Array.from(combinedSet).filter(i => {
                  const byType = !typeFilter || typeFilter.length === 0 || ((): boolean => {
                      const selectedSet = new Set<string>(this.selectedType || []);
                      const base = getChainForTypeName(i?.Type?.Name ?? '')[0] || (i?.Type?.Name ?? '');
                      return selectedSet.has(base);
                  })();
                  if (!byType) return false;
                  const byTier = !tierFilter || (this.getTier(i) === tierFilter);
                  return byTier;
              });

              // Group by Type.Name, then cluster into code families within each type
              const typeMap = new Map<string, ArmorBase[]>();
              filtered.forEach(i => {
                  const t = i?.Type?.Name || 'Other';
                  if (!typeMap.has(t)) typeMap.set(t, []);
                  typeMap.get(t)!.push(i);
              });

              const tierOrder = new Map([
                  ['Normal', 0],
                  ['Exceptional', 1],
                  ['Elite', 2],
              ] as const);

              const groups: Group[] = Array.from(typeMap.entries())
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([typeName, items]) => {
                      // Build families keyed by combined codes
                      const famMap = new Map<string, ArmorBase[]>();
                      for (const it of items) {
                          const key = `${it.NormCode || ''}|${it.UberCode || ''}|${it.UltraCode || ''}`;
                          if (!famMap.has(key)) famMap.set(key, []);
                          famMap.get(key)!.push(it);
                      }

                      // Convert to array with sorting rules
                      const families: Family[] = Array.from(famMap.entries()).map(([familyKey, members]) => {
                          // Sort members by tier order, fallback to __index
                          members.sort((a, b) => {
                              const ta = this.getTier(a) ?? '';
                              const tb = this.getTier(b) ?? '';
                              const oa = tierOrder.has(ta as any) ? (tierOrder.get(ta as any) as number) : 99;
                              const ob = tierOrder.has(tb as any) ? (tierOrder.get(tb as any) as number) : 99;
                              if (oa !== ob) return oa - ob;
                              return (a.__index ?? 0) - (b.__index ?? 0);
                          });
                          const minIndex = members.reduce((min, it) => Math.min(min, it.__index ?? Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
                          return { familyKey, items: members, minIndex };
                      }).sort((a, b) => a.minIndex - b.minIndex);

                      return { typeName, families };
                  });

              return groups;
          }

          get totalCount() {
              return this.filteredAndGrouped.reduce((acc, g) => acc + g.families.reduce((s, f) => s + f.items.length, 0), 0);
          }

          getDamageLabel(i: ArmorBase) {
              // Use DamageStringPrefix when present, else default to "Damage:"
              if (i?.DamageString) {
                  const prefix = (i.DamageStringPrefix && i.DamageStringPrefix.trim() !== '')
                      ? `${i.DamageStringPrefix}:`
                      : 'Damage:';
                  return `${prefix} ${i.DamageString}`;
              }
              return '';
          }

          // Expose item tier for template usage (highlighting codes line)
          itemTier(i: ArmorBase): 'Normal' | 'Exceptional' | 'Elite' | undefined {
              return this.getTier(i);
          }

          private getTier(i: ArmorBase): 'Normal' | 'Exceptional' | 'Elite' | undefined {
              // Preferred: use name suffix when present
              // Mapping per dataset convention: [N] = Normal, [X] = Exceptional, [E] = Elite
              const name = i?.Name || '';
              const m = name.match(/\[(N|X|E)\]/i);
              if (m) {
                  const ch = m[1].toUpperCase();
                  if (ch === 'N') return 'Normal';
                  if (ch === 'X') return 'Exceptional';
                  if (ch === 'E') return 'Elite';
              }
              // Fallback (best-effort): infer via relative position among family if suffix missing
              // Group by code family; pick minimum index as Normal, middle as Exceptional, max as Elite
              const famKey = [i.NormCode || '', i.UberCode || '', i.UltraCode || ''].join('|');
              if (!famKey.trim()) return undefined;
              const family = (this.items || []).filter(x =>
                  x.NormCode === i.NormCode && x.UberCode === i.UberCode && x.UltraCode === i.UltraCode
              );
              if (family.length >= 3) {
                  const sorted = family.slice().sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
                  const pos = sorted.findIndex(x => x === i);
                  if (pos === 0) return 'Normal';
                  if (pos === 1) return 'Exceptional';
                  if (pos === 2) return 'Elite';
              }
              return undefined;
          }

          // Group an item's AutoMagicGroups by their Name (new grouped PropertyStrings schema only)
          groupedProperties(item: ArmorBase) {
              const raw = (item?.AutoMagicGroups || []).slice();
              if (!raw.length) return [] as { name: string; propertyStrings: string[]; requiredLevel?: number; minIndex: number }[];

              const splitLines = (s: string) => s.split(',').map(x => x.trim()).filter(x => x.length > 0);

              const map = new Map<string, { name: string; propertyStrings: string[]; requiredLevel?: number; minIndex: number }>();
              (raw as NewPropGroup[]).forEach((g, idx) => {
                  const name = (g.Name && g.Name.trim() !== '') ? g.Name : 'Other';
                  const minIdx = (g.Level ?? g.Index ?? idx ?? Number.MAX_SAFE_INTEGER) as number;
                  if (!map.has(name)) map.set(name, { name, propertyStrings: [], requiredLevel: g.RequiredLevel, minIndex: minIdx });
                  const entry = map.get(name)!;
                  if (g.RequiredLevel !== undefined) entry.requiredLevel = g.RequiredLevel;
                  (g.PropertyStrings || []).forEach(ps => {
                      splitLines(ps).forEach(line => entry.propertyStrings.push(line));
                  });
                  if (minIdx < entry.minIndex) entry.minIndex = minIdx;
              });
              return Array.from(map.values()).sort((a, b) => {
                  if (a.minIndex !== b.minIndex) return a.minIndex - b.minIndex;
                  return a.name.localeCompare(b.name);
              });
          }

          
      }
