const ITEM_TYPES = [
  // High-level categories
  { name: "Any", code: "" },
  { name: "None", code: "none" },
  { name: "Weapon", code: "weap" },
  { name: "Melee Weapon", code: "mele", parents: ["Weapon"] },
  { name: "Missile Weapon", code: "miss", parents: ["Weapon"] },
  { name: "Any Armor", code: "armo" },
  { name: "Any Shield", code: "shld", parents: ["Any Armor"] },
  { name: "Miscellaneous", code: "misc" },
  { name: "Missile", code: "misl", parents: ["Miscellaneous"] },
  { name: "Second Hand", code: "seco" },
  { name: "Socket Filler", code: "sock", parents: ["Miscellaneous"] },
  { name: "Class Specific", code: "clas" },
  { name: "Charm", code: "char", parents: ["Miscellaneous"] },
  // Armor subtypes
  { name: "Body Armor", code: "tors", parents: ["Any Armor"] },
  { name: "Helm", code: "helm", parents: ["Any Armor"] },
  { name: "Gloves", code: "glov", parents: ["Any Armor"] },
  { name: "Boots", code: "boot", parents: ["Any Armor"] },
  { name: "Belt", code: "belt", parents: ["Any Armor"] },
  { name: "Circlet", code: "circ", parents: ["Helm"] },
  { name: "Shield", code: "shie", parents: ["Any Shield"] },
  { name: "Cloak", code: "cloa", parents: ["Body Armor", "Assassin Item"] },
  // Jewelry and socket fillers
  { name: "Ring", code: "ring" },
  { name: "Amulet", code: "amul" },
  { name: "Small Charm", code: "scha", parents: ["Charm"] },
  { name: "Large Charm", code: "mcha", parents: ["Charm"] },
  { name: "Grand Charm", code: "lcha", parents: ["Charm"] },
  { name: "Jewel", code: "jewl", parents: ["Socket Filler"] },
  { name: "Rune", code: "rune", parents: ["Socket Filler"] },
  { name: "Gem", code: "gem", parents: ["Socket Filler"] },
  // Weapon families
  { name: "Axe", code: "axe", parents: ["Melee Weapon", "Weapon"] },
  { name: "Club", code: "club", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Hammer", code: "hamm", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Mace", code: "mace", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Polearm", code: "pole", parents: ["Spear/Polearm", "Melee Weapon", "Weapon"] },
  { name: "Scepter", code: "scep", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Staff", code: "staf", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Spear", code: "spea", parents: ["Spear/Polearm", "Melee Weapon", "Weapon"] },
  { name: "Sword", code: "swor", parents: ["Blade", "Melee Weapon", "Weapon"] },
  { name: "Wand", code: "wand", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Bow", code: "bow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Crossbow", code: "xbow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Knife", code: "knif", parents: ["Blade", "Melee Weapon", "Weapon"] },
  { name: "Javelin", code: "jave", parents: ["Melee Weapon", "Thrown Weapon", "Weapon"] },
  { name: "Throwing Knife", code: "tkni", parents: ["Combo Weapon", "Knife"] },
  { name: "Throwing Axe", code: "taxe", parents: ["Combo Weapon", "Axe"] },
  // Aggregations
  { name: "Blade", code: "blde", parents: ["Melee Weapon"] },
  { name: "Spear/Polearm", code: "sppl", parents: ["Melee Weapon"] },
  { name: "Blunt", code: "blun", parents: ["Melee Weapon"] },
  { name: "Staves And Rods", code: "rod", parents: ["Blunt"] },
  { name: "Thrown Weapon", code: "thro", parents: ["Weapon"] },
  { name: "Combo Weapon", code: "comb", parents: ["Melee Weapon", "Thrown Weapon"] },
  // Class-specific aggregations
  { name: "Amazon Item", code: "amaz", parents: ["Class Specific"] },
  { name: "Barbarian Item", code: "barb", parents: ["Class Specific"] },
  { name: "Necromancer Item", code: "necr", parents: ["Class Specific"] },
  { name: "Paladin Item", code: "pala", parents: ["Class Specific"] },
  { name: "Sorceress Item", code: "sorc", parents: ["Class Specific"] },
  { name: "Assassin Item", code: "assn", parents: ["Class Specific"] },
  { name: "Druid Item", code: "drui", parents: ["Class Specific"] },
  // Class-specific weapons
  { name: "Amazon Bow", code: "abow", parents: ["Amazon Item", "Bow", "Missile Weapon", "Weapon"] },
  { name: "Amazon Spear", code: "aspe", parents: ["Amazon Item", "Spear", "Melee Weapon", "Weapon"] },
  { name: "Amazon Javelin", code: "ajav", parents: ["Amazon Item", "Javelin", "Melee Weapon", "Weapon"] },
  { name: "Hand to Hand", code: "h2h", parents: ["Assassin Item", "Melee Weapon", "Weapon"] },
  { name: "Orb", code: "orb", parents: ["Sorceress Item", "Weapon"] },
  // Class Specific Armors
  { name: "Primal Helm", code: "phlm", parents: ["Barbarian Item", "Helm"] },
  { name: "Pelt", code: "pelt", parents: ["Druid Item", "Helm"] },
  { name: "Voodoo Heads", code: "head", parents: ["Necromancer Item", "Any Shield"] },
  { name: "Auric Shields", code: "ashd", parents: ["Paladin Item", "Any Shield"] },
  // Miscellaneous consumables and scrolls
  { name: "Gold", code: "gold", parents: ["Miscellaneous"] },
  { name: "Player Body Part", code: "play", parents: ["Miscellaneous"] },
  { name: "Body Part", code: "body", parents: ["Miscellaneous"] },
  { name: "Herb", code: "herb", parents: ["Miscellaneous"] },
  { name: "Potion", code: "poti", parents: ["Miscellaneous"] },
  { name: "Healing Potion", code: "hpot", parents: ["Potion"] },
  { name: "Mana Potion", code: "mpot", parents: ["Potion"] },
  { name: "Rejuv Potion", code: "rpot", parents: ["Healing Potion", "Mana Potion"] },
  { name: "Stamina Potion", code: "spot", parents: ["Potion"] },
  { name: "Antidote Potion", code: "apot", parents: ["Potion"] },
  { name: "Thawing Potion", code: "wpot", parents: ["Potion"] },
  { name: "Missile Potion", code: "tpot", parents: ["Thrown Weapon"] },
  { name: "Scroll", code: "scro", parents: ["Miscellaneous"] },
  { name: "Book", code: "book", parents: ["Miscellaneous"] },
  { name: "Torch", code: "torc", parents: ["Miscellaneous"] },
  { name: "Elixir", code: "elix", parents: ["Miscellaneous"] },
  { name: "Key", code: "key", parents: ["Miscellaneous"] },
  { name: "Quest", code: "ques" },
  { name: "Bow Quiver", code: "bowq", parents: ["Missile", "Second Hand"] },
  { name: "Crossbow Bolts", code: "xboq", parents: ["Missile", "Second Hand"] },
  { name: "Magic Bow Quiv", code: "mboq", parents: ["Bow Quiver"] },
  { name: "Magic Xbow Quiv", code: "mxbq", parents: ["Crossbow Bolts"] }
];
const ITEM_TYPE_BY_NAME = new Map(ITEM_TYPES.map((t) => [t.name, t]));
new Map(ITEM_TYPES.map((t) => [t.code, t]));
const ITEM_TYPE_BY_NAME_LC = new Map(ITEM_TYPES.map((t) => [t.name.toLowerCase(), t]));
const CHAIN_CACHE = /* @__PURE__ */ new Map();
const PARENTS_MAP = /* @__PURE__ */ new Map();
const CHILDREN_MAP = /* @__PURE__ */ new Map();
for (const t of ITEM_TYPES) {
  const parents = (t.parents ?? []).slice();
  PARENTS_MAP.set(t.name, parents);
}
for (const t of ITEM_TYPES) {
  const parents = PARENTS_MAP.get(t.name) || [];
  for (const p of parents) {
    let arr = CHILDREN_MAP.get(p);
    if (!arr) {
      arr = [];
      CHILDREN_MAP.set(p, arr);
    }
    arr.push(t.name);
  }
}
function computeChain(name, outerSeen) {
  const cached = CHAIN_CACHE.get(name);
  if (cached) return cached;
  const node = ITEM_TYPE_BY_NAME.get(name);
  if (!node) {
    const empty = Object.freeze([]);
    CHAIN_CACHE.set(name, empty);
    return empty;
  }
  const seen = outerSeen ?? /* @__PURE__ */ new Set();
  if (seen.has(name)) {
    const selfOnly = Object.freeze([name]);
    CHAIN_CACHE.set(name, selfOnly);
    return selfOnly;
  }
  seen.add(name);
  const chain = [name];
  const parents = PARENTS_MAP.get(name) || [];
  if (parents.length > 0) {
    const first = parents[0];
    if (!seen.has(first)) {
      const sub = computeChain(first, new Set(seen));
      for (const s of sub) {
        if (chain.indexOf(s) === -1) chain.push(s);
      }
    } else if (chain.indexOf(first) === -1) {
      chain.push(first);
    }
    for (let i = 1; i < parents.length; i++) {
      const p = parents[i];
      if (chain.indexOf(p) === -1) chain.push(p);
      if (!seen.has(p)) {
        const branch = computeChain(p, new Set(seen));
        for (const s of branch) {
          if (chain.indexOf(s) === -1) chain.push(s);
        }
      }
    }
  }
  const frozen = Object.freeze(chain.slice());
  CHAIN_CACHE.set(name, frozen);
  return frozen;
}
function getTypeChain(name) {
  return computeChain(name).slice();
}
function getChainForTypeName(rawName) {
  const raw = (rawName ?? "").trim();
  if (!raw) return [""];
  const node = ITEM_TYPE_BY_NAME.get(raw) || ITEM_TYPE_BY_NAME_LC.get(raw.toLowerCase());
  return node ? getTypeChain(node.name) : [raw];
}
const CLASS_AGGREGATE_BASES = /* @__PURE__ */ new Set(["Amazon Item", "Barbarian Item", "Necromancer Item", "Paladin Item", "Sorceress Item", "Assassin Item", "Druid Item"]);
function makeTypeOption(label, baseTypeName, extraParents = [], exactBaseOnly = false) {
  if (!baseTypeName) return { label, value: void 0 };
  const value = exactBaseOnly ? [baseTypeName] : getTypeChain(baseTypeName);
  if (extraParents && extraParents.length) {
    const set = new Set(value);
    for (const p of extraParents) {
      if (!set.has(p)) {
        value.push(p);
        set.add(p);
      }
    }
  }
  return { label, value };
}
function resolveBaseTypeName(rawName) {
  const raw = (rawName ?? "").trim();
  if (!raw) return "";
  const chain = getChainForTypeName(raw);
  return chain && chain.length > 0 ? chain[0] : raw;
}
const DESCENDANTS_MAP = /* @__PURE__ */ new Map();
function computeDescendants(name) {
  const cached = DESCENDANTS_MAP.get(name);
  if (cached) return cached;
  const visited = /* @__PURE__ */ new Set();
  const stack = (CHILDREN_MAP.get(name) || []).slice();
  while (stack.length) {
    const child = stack.pop();
    if (!child) continue;
    if (visited.has(child)) continue;
    visited.add(child);
    const grandchildren = CHILDREN_MAP.get(child);
    if (grandchildren && grandchildren.length) {
      for (let i = 0; i < grandchildren.length; i++) {
        const g = grandchildren[i];
        if (!visited.has(g)) stack.push(g);
      }
    }
  }
  const ordered = [];
  for (const t of ITEM_TYPES) {
    if (t.name !== name && visited.has(t.name)) ordered.push(t.name);
  }
  const frozen = Object.freeze(ordered);
  DESCENDANTS_MAP.set(name, frozen);
  return frozen;
}
function getDescendantBaseNames(baseTypeName) {
  return computeDescendants(baseTypeName).slice();
}
function buildOptionsForPresentTypes(preset, presentBaseNames, opts) {
  const result = [];
  const presentClosure = /* @__PURE__ */ new Set();
  for (const b of presentBaseNames) {
    presentClosure.add(b);
    const chain = CHAIN_CACHE.get(b) || computeChain(b);
    for (let i = 1; i < chain.length; i++) presentClosure.add(chain[i]);
  }
  for (let i = 0; i < preset.length; i++) {
    const opt = preset[i];
    if (!opt.value || opt.value.length === 0) {
      result.push(opt);
      continue;
    }
    const base = opt.value[0];
    const baseChain = CHAIN_CACHE.get(base) || computeChain(base);
    const baseSet = new Set(baseChain);
    const extras = [];
    for (let j = 0; j < opt.value.length; j++) {
      const v = opt.value[j];
      if (!baseSet.has(v)) extras.push(v);
    }
    let include;
    if (CLASS_AGGREGATE_BASES.has(base)) {
      include = presentBaseNames.has(base);
    } else if (extras.length === 0) {
      include = presentBaseNames.has(base);
    } else {
      include = presentBaseNames.has(base);
      if (!include) {
        for (let k = 0; k < extras.length; k++) {
          if (presentClosure.has(extras[k])) {
            include = true;
            break;
          }
        }
      }
    }
    if (include) result.push(opt);
  }
  if (opts && opts.dedupeByBase) {
    const prefer = opts.preferLabelStartsWith || "";
    const kept = [];
    const byBase = /* @__PURE__ */ new Map();
    for (let i = 0; i < result.length; i++) {
      const opt = result[i];
      if (!opt.value || opt.value.length === 0) {
        kept.push(opt);
        continue;
      }
      const base = opt.value[0];
      const existingIdx = byBase.get(base);
      if (existingIdx === void 0) {
        byBase.set(base, kept.length);
        kept.push(opt);
      } else {
        const current = kept[existingIdx];
        const currLabel = current?.label || "";
        const nextLabel = opt.label || "";
        const currPreferred = prefer && currLabel.startsWith(prefer);
        const nextPreferred = prefer && nextLabel.startsWith(prefer);
        if (!currPreferred && nextPreferred) {
          kept[existingIdx] = opt;
        }
      }
    }
    return kept;
  }
  return result;
}
const type_filtering_options = [
  // Aggregate the types
  // Any Armor should include all armor descendants (Body Armor, Helm, Circlet, Shields, Gloves, Boots, Belt, class shields/helms, etc.)
  makeTypeOption("Any Armor", "Any Armor", getDescendantBaseNames("Any Armor")),
  // Any Helm should include Helm itself plus Circlet, Primal Helm, and Pelt
  // Use base 'Helm' so plain helms are matched as well; add all helm descendants as extras
  makeTypeOption("Any Helm", "Helm", getDescendantBaseNames("Helm")),
  // Any Shield should include generic Shield and class shields
  makeTypeOption("Any Shield", "Any Shield", getDescendantBaseNames("Any Shield")),
  // Expand weapon aggregates so that selecting them matches child bases too
  makeTypeOption("Any Weapon", "Weapon", getDescendantBaseNames("Weapon")),
  makeTypeOption("Melee Weapon", "Melee Weapon", getDescendantBaseNames("Melee Weapon")),
  makeTypeOption("Missile Weapon", "Missile Weapon", getDescendantBaseNames("Missile Weapon")),
  // Armor subtypes
  makeTypeOption("Body Armor", "Body Armor"),
  makeTypeOption("Gloves", "Gloves"),
  makeTypeOption("Boots", "Boots"),
  makeTypeOption("Belt", "Belt"),
  makeTypeOption("Helm", "Helm", [], true),
  makeTypeOption("Circlet", "Circlet", [], true),
  // Shields (Bases Page)
  makeTypeOption("Shield", "Shield"),
  // Jewelry and socket fillers
  makeTypeOption("Ring", "Ring"),
  makeTypeOption("Amulet", "Amulet"),
  makeTypeOption("Jewel", "Jewel"),
  makeTypeOption("Small Charm", "Small Charm"),
  makeTypeOption("Large Charm", "Large Charm"),
  makeTypeOption("Grand Charm", "Grand Charm"),
  // Weapon bases
  makeTypeOption("Axe", "Axe"),
  makeTypeOption("Mace", "Mace"),
  makeTypeOption("Hammer", "Hammer"),
  makeTypeOption("Sword", "Sword"),
  makeTypeOption("Knife", "Knife"),
  makeTypeOption("Spear", "Spear"),
  makeTypeOption("Polearm", "Polearm"),
  makeTypeOption("Staff", "Staff"),
  makeTypeOption("Wand", "Wand"),
  makeTypeOption("Bow", "Bow"),
  makeTypeOption("Crossbow", "Crossbow"),
  makeTypeOption("Javelin", "Javelin"),
  makeTypeOption("Throwing Knife", "Throwing Knife"),
  makeTypeOption("Throwing Axe", "Throwing Axe"),
  // Quivers and Bolts: base on the non-magic types and include their descendants (magic quivers)
  makeTypeOption("Bow Quiver", "Bow Quiver", getDescendantBaseNames("Bow Quiver")),
  makeTypeOption("Crossbow Bolts", "Crossbow Bolts", getDescendantBaseNames("Crossbow Bolts")),
  // Class Specific
  // Class-specific leaf types must match ONLY themselves by default on pages without an "Exact" toggle
  // (Bases, Uniques, Sets). Runewords inherits parents via its own filtering logic and parent selections.
  makeTypeOption("Amazon Javelin", "Amazon Javelin", [], true),
  makeTypeOption("Amazon Bow", "Amazon Bow", [], true),
  makeTypeOption("Amazon Spear", "Amazon Spear", [], true),
  makeTypeOption("Assassin Claw", "Hand to Hand", [], true),
  makeTypeOption("Barbarian Helm", "Primal Helm", [], true),
  makeTypeOption("Druid Helm", "Pelt", [], true),
  makeTypeOption("Necromancer Shield", "Voodoo Heads", [], true),
  makeTypeOption("Paladin Shield", "Auric Shields", [], true),
  makeTypeOption("Sorceress Orb", "Orb", [], true)
];
function prependTypeResetOption(options, label = "-") {
  const reset = { label, value: [] };
  return [reset, ...options];
}
function toOptionalNumber(val, clampMin = 0, clampMax = 100) {
  if (val === void 0 || val === null) return void 0;
  if (typeof val === "string") {
    const t = val.trim();
    if (t === "") return void 0;
    const n = Number(t);
    return Number.isFinite(n) ? Math.max(clampMin, Math.min(clampMax, Math.floor(n))) : void 0;
  }
  if (Number.isFinite(val)) {
    return Math.max(clampMin, Math.min(clampMax, Math.floor(val)));
  }
  return void 0;
}
function swapMinMax(min, max) {
  if (typeof min === "number" && typeof max === "number" && min > max) {
    return [max, min];
  }
  return [min, max];
}
function tokenizeSearch(input) {
  const raw = (input || "").trim().toLowerCase();
  if (!raw) return [];
  const cleaned = raw.replace(/[^a-z0-9]+/g, " ").trim();
  if (!cleaned) return [];
  return cleaned.split(/\s+/);
}
function isVanillaItem(vanilla) {
  if (vanilla === void 0 || vanilla === null) return false;
  const vStr = typeof vanilla === "string" || typeof vanilla === "number" || typeof vanilla === "boolean" ? String(vanilla).toUpperCase() : "";
  return vStr === "Y";
}
export {
  tokenizeSearch as a,
  buildOptionsForPresentTypes as b,
  getChainForTypeName as c,
  toOptionalNumber as d,
  getDescendantBaseNames as g,
  isVanillaItem as i,
  prependTypeResetOption as p,
  resolveBaseTypeName as r,
  swapMinMax as s,
  type_filtering_options as t
};
