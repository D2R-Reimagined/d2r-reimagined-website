// @ts-nocheck
// Reimagined integration for UnHoarder Builder. GPL-3.0-or-later.
import model from './model.js';
export function fromExport(bundle, strings) {
    if (bundle?.SchemaVersion !== 1 || bundle.FilterVersion !== 3 ||
        !['BaseItems', 'ItemTypes', 'UniqueItems', 'SetItems'].every(key => Array.isArray(bundle[key]))) {
      throw new Error('Unsupported Reimagined catalog. Please refresh or try again later.');
    }
    const translate = key => String(strings[key] || key || '').replace(/ÿc./g, '').replace(/\[\/?.*?\]/g, '');
    const bases = kind => ({ rows: bundle.BaseItems.filter(x => x.Kind === kind).map(x => ({
      code: x.Code, name: kind === 'misc' ? translate(x.NameKey) : x.BaseNameSelector, type: x.TypeCode, type2: x.TypeCode2
    })) });
    const enrichment = rows => ({ nameCol: 'name', baseCol: 'code', rows: rows.map(x => ({ name: translate(x.NameKey), code: x.Code })) });
    const catalog = model.buildCatalog({
      weapons: bases('weapon'), armor: bases('armor'), misc: bases('misc'),
      itemtypes: { rows: bundle.ItemTypes.map(x => ({ Code: x.Code, ItemType: x.TypeNameSelector, Equiv1: x.ParentCode, Equiv2: x.ParentCode2 })) },
      uniques: enrichment(bundle.UniqueItems), sets: enrichment(bundle.SetItems)
    });
    const names = new Map(bundle.BaseItems.map(x => [`${x.Kind}:${x.Code}`, translate(x.NameKey)]));
    catalog.baseItems.forEach(item => { item.displayName = names.get(`${item.kind}:${item.code}`) || item.name || item.code; });
    return catalog;
  }
