// @ts-nocheck
// GPL-3.0-or-later. Adapted from MindH1ve UnHoarder Builder. See LICENSE.
const model = (() => {
  'use strict';

  const RARITIES = ['inferior','normal','superior','magic','set','rare','unique'];
  const MINIMAP_SHAPES = ['circle','diamond','triangle','star'];
  const DROP_SOUNDS = Array.from({ length: 16 }, (_, i) => `Filter${String(i + 1).padStart(2, '0')}`);
  const CONDITION_KEYS = ['code','baseName','itemType','quantity','rarity','itemLevel','sockets','ethereal','identified'];
  const BLOCK_KEYS = ['ruleName','conditions','continue','name','tooltip','dropSound','minimapIcon'];
  const MAX_RULES = 4096;
  const MAX_BYTES = 4 * 1024 * 1024;

  function splitTsv(text) {
    const normalized = String(text || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    const lines = normalized.split('\n').filter((line, index, arr) => !(index === arr.length - 1 && line === ''));
    if (!lines.length) return { headers: [], rows: [] };
    const headers = lines[0].split('\t');
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const cells = lines[i].split('\t');
      const row = {};
      headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
      rows.push(row);
    }
    return { headers, rows };
  }

  function requireColumns(table, columns, label) {
    const missing = columns.filter(c => !table.headers.includes(c));
    if (missing.length) throw new Error(`${label} missing column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
  }

  function cleanCode(value) {
    return String(value ?? '').replace(/ +$/g, '');
  }

  function printableCode(code) {
    return typeof code === 'string' && code.length >= 1 && code.length <= 4 && /^[\x20-\x7E]+$/.test(code) && /[^ ]/.test(code);
  }

  function normalizeFilename(name) {
    return String(name || '').trim().toLowerCase();
  }

  function classifyDataFilename(name) {
    const n = normalizeFilename(name);
    if (n === 'weapons.txt') return 'weapons';
    if (n === 'armor.txt') return 'armor';
    if (n === 'misc.txt') return 'misc';
    if (n === 'itemtypes.txt') return 'itemtypes';
    if (n === 'uniqueitems.txt') return 'uniques';
    if (n === 'setitems.txt') return 'sets';
    return null;
  }

  function parseCoreTable(kind, text) {
    const table = splitTsv(text);
    if (kind === 'weapons' || kind === 'armor') {
      requireColumns(table, ['name','code','type'], kind === 'weapons' ? 'weapons.txt' : 'armor.txt');
    } else if (kind === 'misc') {
      requireColumns(table, ['code','type'], 'misc.txt');
    } else if (kind === 'itemtypes') {
      requireColumns(table, ['ItemType','Code','Equiv1','Equiv2'], 'itemtypes.txt');
    }
    return table;
  }

  function firstPresent(headers, choices) {
    return choices.find(c => headers.includes(c)) || null;
  }

  function parseEnrichmentTable(kind, text) {
    const table = splitTsv(text);
    const nameCol = firstPresent(table.headers, ['index','name','Name','Index']);
    let baseCol = null;
    if (kind === 'uniques') baseCol = firstPresent(table.headers, ['code','item','base','Code']);
    if (kind === 'sets') baseCol = firstPresent(table.headers, ['item','code','base','Code']);
    if (!nameCol || !baseCol) {
      throw new Error(`${kind === 'uniques' ? 'UniqueItems.txt' : 'SetItems.txt'} requires an item-name column (usually index) and base-code column (${kind === 'uniques' ? 'usually code' : 'usually item'})`);
    }
    return { ...table, nameCol, baseCol };
  }

  function buildCatalog(data) {
    const catalog = {
      baseItems: [],
      baseNames: [],
      itemTypes: [],
      itemTypeMap: new Map(),
      codeMap: new Map(),
      uniqueItems: [],
      setItems: [],
      warnings: []
    };

    const addBaseRows = (kind, table) => {
      if (!table) return;
      for (const row of table.rows) {
        const code = cleanCode(row.code);
        if (!printableCode(code)) continue;
        // Runtime names are literal, including whitespace. Display labels are separate.
        const name = kind === 'misc' ? String(row.name || row['*name'] || row['*ItemName'] || '').trim() : String(row.name || '');
        const item = {
          kind,
          code,
          name,
          type: cleanCode(row.type),
          type2: cleanCode(row.type2 || '')
        };
        catalog.baseItems.push(item);
        if (!catalog.codeMap.has(code)) catalog.codeMap.set(code, []);
        catalog.codeMap.get(code).push(item);
      }
    };

    addBaseRows('weapon', data.weapons);
    addBaseRows('armor', data.armor);
    addBaseRows('misc', data.misc);

    catalog.baseNames = catalog.baseItems
      .filter(x => (x.kind === 'weapon' || x.kind === 'armor') && x.name)
      .map(x => x.name)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a,b) => a.localeCompare(b));

    if (data.itemtypes) {
      const typeRows = new Map();
      const names = new Map();
      for (const row of data.itemtypes.rows) {
        const code = cleanCode(row.Code);
        if (!code) continue;
        typeRows.set(code, { parent1: cleanCode(row.Equiv1), parent2: cleanCode(row.Equiv2) });
        const display = String(row.ItemType || '');
        if (display) {
          if (!names.has(display)) names.set(display, []);
          names.get(display).push(code);
        }
      }

      const direct = new Map();
      for (const item of catalog.baseItems) {
        if (!item.type || !typeRows.has(item.type)) continue;
        if (!direct.has(item.code)) direct.set(item.code, []);
        direct.get(item.code).push(item.type);
        if (item.type2 && typeRows.has(item.type2)) direct.get(item.code).push(item.type2);
      }

      const memo = new Map();
      const ancestors = (id, visiting = new Set()) => {
        if (memo.has(id)) return memo.get(id);
        if (!typeRows.has(id) || visiting.has(id)) return [];
        visiting.add(id);
        const result = new Set([id]);
        const row = typeRows.get(id);
        [row.parent1, row.parent2].filter(Boolean).forEach(parent => ancestors(parent, visiting).forEach(v => result.add(v)));
        visiting.delete(id);
        const arr = [...result].sort();
        memo.set(id, arr);
        return arr;
      };

      const map = new Map();
      for (const [itemCode, types] of direct) {
        types.forEach(type => ancestors(type).forEach(ancestor => {
          if (!map.has(ancestor)) map.set(ancestor, new Set());
          map.get(ancestor).add(itemCode);
        }));
      }
      for (const [name, typeCodes] of names) {
        if (map.has(name) && typeRows.has(name)) continue;
        if (!map.has(name)) map.set(name, new Set());
        typeCodes.forEach(type => (map.get(type) || new Set()).forEach(code => map.get(name).add(code)));
      }
      catalog.itemTypeMap = map;
      catalog.itemTypes = [...map.keys()].sort((a,b) => a.localeCompare(b));
    }

    const addEnrichment = (kind, table, target) => {
      if (!table) return;
      for (const row of table.rows) {
        const name = String(row[table.nameCol] || '').trim();
        const baseCode = cleanCode(row[table.baseCol]);
        if (!name || !printableCode(baseCode)) continue;
        const bases = catalog.codeMap.get(baseCode) || [];
        const preferred = bases.find(x => x.kind === 'weapon' || x.kind === 'armor') || bases[0] || null;
        target.push({
          kind,
          name,
          baseCode,
          baseName: preferred && (preferred.kind === 'weapon' || preferred.kind === 'armor') ? preferred.name : '',
          baseKind: preferred ? preferred.kind : 'unknown'
        });
      }
      target.sort((a,b) => a.name.localeCompare(b.name));
    };
    addEnrichment('unique', data.uniques, catalog.uniqueItems);
    addEnrichment('set', data.sets, catalog.setItems);

    return catalog;
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined) return [];
    return [value];
  }

  function isNaturalInt(v) {
    return Number.isInteger(v) && v >= 0 && v <= 0xFFFFFFFF;
  }

  function parseRgba(value) {
    if (typeof value !== 'string') return null;
    const m = /^RGBA\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(?:(\d+(?:\.\d*)?)|(\.\d+))\s*\)$/.exec(value);
    if (!m) return null;
    const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]), a = Number(m[4] || m[5]);
    if ([r,g,b].some(n => !Number.isInteger(n) || n < 0 || n > 255) || !Number.isFinite(a) || a < 0 || a > 1) return null;
    return { r, g, b, a };
  }

  function rgbaString(hex, alpha) {
    const clean = String(hex || '#000000').replace('#','');
    const valid = /^[0-9a-fA-F]{6}$/.test(clean) ? clean : '000000';
    const r = parseInt(valid.slice(0,2),16), g = parseInt(valid.slice(2,4),16), b = parseInt(valid.slice(4,6),16);
    const a = Math.max(0, Math.min(1, Number(alpha)));
    return `RGBA(${r}, ${g}, ${b}, ${Number.isFinite(a) ? a : 1})`;
  }

  function rgbaToHex(value) {
    const parsed = parseRgba(value);
    if (!parsed) return { hex: '#000000', alpha: 1 };
    const h = n => n.toString(16).padStart(2,'0');
    return { hex: `#${h(parsed.r)}${h(parsed.g)}${h(parsed.b)}`, alpha: parsed.a };
  }

  function validateNumberTest(name, value, min, max, errors, path) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value).length) {
      errors.push(`${path} must be a non-empty comparison object.`); return;
    }
    const keys = Object.keys(value);
    const allowed = ['eq','gt','gte','lt','lte'];
    keys.filter(k => !allowed.includes(k)).forEach(k => errors.push(`${path}.${k} is not a supported comparator.`));
    if (keys.filter(k => k === 'gt' || k === 'gte').length > 1) errors.push(`${path} can contain only one minimum bound (gt or gte).`);
    if (keys.filter(k => k === 'lt' || k === 'lte').length > 1) errors.push(`${path} can contain only one maximum bound (lt or lte).`);
    for (const k of keys) {
      const n = value[k];
      if (!isNaturalInt(n) || n < min || n > max) errors.push(`${path}.${k} must be an integer ${min}..${max}.`);
    }
  }

  function validateFilter(filter, catalog) {
    const errors = [], warnings = [];
    if (!filter || typeof filter !== 'object' || Array.isArray(filter)) errors.push('Filter must be a JSON object.');
    if (!filter || filter.version !== 3) errors.push('Editor output requires version: 3.');
    if (!filter || !Array.isArray(filter.rules)) errors.push('rules must be an array.');
    const rules = filter && Array.isArray(filter.rules) ? filter.rules : [];
    if (rules.length > MAX_RULES) errors.push(`Filter has ${rules.length} rules; UnHoarder supports at most ${MAX_RULES}.`);

    rules.forEach((entry, idx) => {
      const p = `Rule ${idx + 1}`;
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { errors.push(`${p} must be an object.`); return; }
      const keys = Object.keys(entry);
      const hasShow = Object.prototype.hasOwnProperty.call(entry,'show');
      const hasHide = Object.prototype.hasOwnProperty.call(entry,'hide');
      if (keys.length !== 1 || hasShow === hasHide) { errors.push(`${p} must contain exactly one show or hide wrapper.`); return; }
      const block = entry[hasShow ? 'show' : 'hide'];
      if (!block || typeof block !== 'object' || Array.isArray(block)) { errors.push(`${p} wrapper must contain an object.`); return; }
      Object.keys(block).filter(k => !BLOCK_KEYS.includes(k)).forEach(k => errors.push(`${p}.${k} is not supported in schema v3.`));
      if ('ruleName' in block && typeof block.ruleName !== 'string') errors.push(`${p}.ruleName must be a string.`);
      if ('continue' in block && typeof block.continue !== 'boolean') errors.push(`${p}.continue must be true or false.`);

      if ('conditions' in block) {
        const c = block.conditions;
        if (!c || typeof c !== 'object' || Array.isArray(c) || !Object.keys(c).length) errors.push(`${p}.conditions must be a non-empty object.`);
        else {
          Object.keys(c).filter(k => !CONDITION_KEYS.includes(k)).forEach(k => errors.push(`${p}.conditions.${k} is not supported.`));
          ['code','baseName','itemType'].forEach(key => {
            if (!(key in c)) return;
            const values = asArray(c[key]);
            if (!(typeof c[key] === 'string' || Array.isArray(c[key])) || values.length < 1 || values.length > 64) {
              errors.push(`${p}.conditions.${key} must be a string or array of 1..64 values.`); return;
            }
            values.forEach(v => {
              if (typeof v !== 'string' || !v.length) errors.push(`${p}.conditions.${key} contains an invalid value.`);
              if (key === 'code' && !printableCode(v)) errors.push(`${p}.conditions.code values must be 1..4 printable ASCII characters.`);
              if ((key === 'baseName' || key === 'itemType') && (v.length > 127 || /[\t\r\n]/.test(v))) errors.push(`${p}.conditions.${key} values must be <=127 characters without tabs/newlines.`);
            });
            if (catalog && key === 'baseName' && catalog.baseNames.length) values.filter(v => !catalog.baseNames.includes(v)).forEach(v => warnings.push(`${p}: baseName “${v}” is not present in the loaded weapons/armor tables.`));
            if (catalog && key === 'itemType' && catalog.itemTypes.length) values.filter(v => !catalog.itemTypes.includes(v)).forEach(v => warnings.push(`${p}: itemType “${v}” is not present in the loaded ItemTypes catalog.`));
          });
          if ('rarity' in c) {
            const values = asArray(c.rarity);
            if (!(typeof c.rarity === 'string' || Array.isArray(c.rarity)) || values.length < 1 || values.length > RARITIES.length) errors.push(`${p}.conditions.rarity must be a name or array of 1..${RARITIES.length} names.`);
            else values.filter(v => !RARITIES.includes(v)).forEach(v => errors.push(`${p}.conditions.rarity contains unsupported value “${v}”.`));
          }
          if ('identified' in c && typeof c.identified !== 'boolean') errors.push(`${p}.conditions.identified must be true or false.`);
          if ('ethereal' in c && typeof c.ethereal !== 'boolean') errors.push(`${p}.conditions.ethereal must be true or false.`);
          if ('itemLevel' in c) validateNumberTest('itemLevel', c.itemLevel, 1, 99, errors, `${p}.conditions.itemLevel`);
          if ('quantity' in c) validateNumberTest('quantity', c.quantity, 0, 65535, errors, `${p}.conditions.quantity`);
          if ('sockets' in c) validateNumberTest('sockets', c.sockets, 0, 15, errors, `${p}.conditions.sockets`);
        }
      }

      if ('name' in block) {
        if (typeof block.name !== 'string') errors.push(`${p}.name must be a string.`);
        else {
          const bytes = new TextEncoder().encode(block.name).length;
          const lines = block.name.split('\n');
          if (!block.name || bytes > 79 || lines.length > 3 || lines.some(x => !x.length || x.length > 55) || !/^[\x20-\x7E\n]+$/.test(block.name)) {
            errors.push(`${p}.name must be 1..79 ASCII bytes, max 3 non-empty lines, max 55 characters per line.`);
          }
        }
      }
      if ('tooltip' in block) {
        const t = block.tooltip;
        if (!t || typeof t !== 'object' || Array.isArray(t)) errors.push(`${p}.tooltip must be an object.`);
        else {
          const keys = Object.keys(t);
          if (!keys.length || keys.length > 2 || keys.some(k => !['backgroundColor','textColor'].includes(k))) errors.push(`${p}.tooltip may contain only backgroundColor/textColor and needs at least one.`);
          keys.forEach(k => { if (!parseRgba(t[k])) errors.push(`${p}.tooltip.${k} must be RGBA(r, g, b, a), RGB 0..255 and alpha 0..1.`); });
        }
      }
      if ('dropSound' in block && (typeof block.dropSound !== 'string' || !DROP_SOUNDS.includes(block.dropSound))) errors.push(`${p}.dropSound must be one of Filter01..Filter16.`);
      if ('minimapIcon' in block) {
        const m = block.minimapIcon;
        if (!m || typeof m !== 'object' || Array.isArray(m)) errors.push(`${p}.minimapIcon must be an object.`);
        else {
          const keys = Object.keys(m);
          if (!['shape','borderColor','fillColor'].every(k => k in m) || keys.some(k => !['shape','borderColor','fillColor','size'].includes(k))) errors.push(`${p}.minimapIcon requires shape, borderColor and fillColor; size is optional.`);
          if (!MINIMAP_SHAPES.includes(m.shape)) errors.push(`${p}.minimapIcon.shape must be circle, diamond, triangle or star.`);
          if (!parseRgba(m.borderColor)) errors.push(`${p}.minimapIcon.borderColor is not valid RGBA.`);
          if (!parseRgba(m.fillColor)) errors.push(`${p}.minimapIcon.fillColor is not valid RGBA.`);
          if ('size' in m && !Number.isInteger(m.size)) errors.push(`${p}.minimapIcon.size must be an integer. Values are clamped by UnHoarder to 12..40 px.`);
          if (Number.isInteger(m.size) && (m.size < 12 || m.size > 40)) warnings.push(`${p}: minimap size ${m.size}px will be clamped to ${Math.max(12, Math.min(40, m.size))}px by UnHoarder.`);
        }
      }
    });

    const json = JSON.stringify(filter, null, 2);
    const bytes = new TextEncoder().encode(json).length;
    if (bytes > MAX_BYTES) errors.push(`Serialized filter is ${bytes.toLocaleString()} bytes; UnHoarder accepts at most ${MAX_BYTES.toLocaleString()} bytes.`);
    return { errors, warnings, bytes, json };
  }

  function makeRule(kind) {
    return { [kind === 'hide' ? 'hide' : 'show']: {} };
  }

  function ruleKind(entry) {
    return entry && Object.prototype.hasOwnProperty.call(entry, 'hide') ? 'hide' : 'show';
  }

  function ruleBlock(entry) {
    return entry[ruleKind(entry)];
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function compactStringOrArray(values) {
    const cleaned = [...new Set((values || []).map(v => String(v)).filter(Boolean))];
    if (!cleaned.length) return undefined;
    return cleaned.length === 1 ? cleaned[0] : cleaned;
  }

  function createRuleForFinderItem(item, visibility) {
    const kind = visibility === 'hide' ? 'hide' : 'show';
    const conditions = {};
    if (item.kind === 'unique' || item.kind === 'set') {
      if (item.baseName) conditions.baseName = item.baseName;
      else conditions.code = item.baseCode;
      conditions.rarity = item.kind;
    } else {
      if ((item.kind === 'weapon' || item.kind === 'armor') && item.name) conditions.baseName = item.name;
      else conditions.code = item.code;
    }
    return { [kind]: { conditions } };
  }

  function summarizeRule(entry) {
    const kind = ruleKind(entry), block = ruleBlock(entry), c = block.conditions || {};
    const parts = [];
    ['baseName','code','itemType'].forEach(k => {
      if (k in c) {
        const vals = asArray(c[k]);
        parts.push(`${k}: ${vals.slice(0,2).join(', ')}${vals.length > 2 ? ` +${vals.length - 2}` : ''}`);
      }
    });
    if ('rarity' in c) parts.push(`rarity: ${asArray(c.rarity).join('/')}`);
    if ('sockets' in c) parts.push(`sockets ${summarizeNumberTest(c.sockets)}`);
    if ('itemLevel' in c) parts.push(`ilvl ${summarizeNumberTest(c.itemLevel)}`);
    if ('quantity' in c) parts.push(`qty ${summarizeNumberTest(c.quantity)}`);
    if ('ethereal' in c) parts.push(`ethereal: ${c.ethereal}`);
    if ('identified' in c) parts.push(`identified: ${c.identified}`);
    if (!parts.length) parts.push('Catch-all');
    const actions = [];
    if (block.continue) actions.push('Continue');
    if (block.name) actions.push('Name');
    if (block.tooltip) actions.push('Tooltip');
    if (block.dropSound) actions.push('Sound');
    if (block.minimapIcon) actions.push('Minimap');
    return {
      kind,
      ruleName: typeof block.ruleName === 'string' ? block.ruleName : '',
      conditionSummary: parts.join(' · '),
      actionSummary: actions.join(' · ') || 'Visibility only'
    };
  }

  function summarizeNumberTest(test) {
    if (!test) return '';
    const parts=[];
    if ('eq' in test) parts.push(`= ${test.eq}`);
    if ('gt' in test) parts.push(`> ${test.gt}`);
    if ('gte' in test) parts.push(`≥ ${test.gte}`);
    if ('lt' in test) parts.push(`< ${test.lt}`);
    if ('lte' in test) parts.push(`≤ ${test.lte}`);
    return parts.join(' & ');
  }

  return {
    RARITIES,
    MINIMAP_SHAPES,
    DROP_SOUNDS,
    CONDITION_KEYS,
    MAX_RULES,
    MAX_BYTES,
    splitTsv,
    classifyDataFilename,
    parseCoreTable,
    parseEnrichmentTable,
    buildCatalog,
    validateFilter,
    parseRgba,
    rgbaString,
    rgbaToHex,
    printableCode,
    makeRule,
    ruleKind,
    ruleBlock,
    clone,
    compactStringOrArray,
    createRuleForFinderItem,
    summarizeRule
  };
})();
export default model;
