const ITEM_TYPES = [
  // High-level categories
  { name: "Any", code: "" },
  { name: "None", code: "none" },
  { name: "Weapon", code: "weapitype" },
  { name: "Melee Weapon", code: "meleitype", parents: ["weapitype"] },
  { name: "Missile Weapon", code: "missitype", parents: ["weapitype"] },
  { name: "Any Armor", code: "armoitype" },
  { name: "Any Shield", code: "shlditype", parents: ["armoitype"] },
  { name: "Miscellaneous", code: "miscitype" },
  { name: "Missile", code: "mislitype", parents: ["miscitype"] },
  { name: "Second Hand", code: "secoitype" },
  { name: "Socket Filler", code: "sockitype", parents: ["miscitype"] },
  { name: "Class Specific", code: "clasitype" },
  { name: "Charm", code: "charitype", parents: ["miscitype"] },
  // Armor subtypes
  { name: "Body Armor", code: "torsitype", parents: ["armoitype"] },
  { name: "Helm", code: "helmitype", parents: ["armoitype"] },
  { name: "Gloves", code: "glovitype", parents: ["armoitype"] },
  { name: "Boots", code: "bootitype", parents: ["armoitype"] },
  { name: "Belt", code: "beltitype", parents: ["armoitype"] },
  { name: "Circlet", code: "circitype", parents: ["helmitype"] },
  { name: "Shield", code: "shieitype", parents: ["shlditype"] },
  { name: "Cloak", code: "cloaitype", parents: ["torsitype", "assnitype"] },
  // Jewelry and socket fillers
  { name: "Ring", code: "ringitype" },
  { name: "Amulet", code: "amulitype" },
  { name: "Small Charm", code: "schaitype", parents: ["charitype"] },
  { name: "Large Charm", code: "mchaitype", parents: ["charitype"] },
  { name: "Grand Charm", code: "lchaitype", parents: ["charitype"] },
  { name: "Crafted Sunder Charm", code: "cschitype", parents: ["charitype"] },
  { name: "Jewel", code: "jewlitype", parents: ["sockitype"] },
  { name: "Colossal Jewel", code: "cjwlitype", parents: ["jewlitype"] },
  { name: "Rune", code: "runeitype", parents: ["sockitype"] },
  { name: "Gem", code: "gemitype", parents: ["sockitype"] },
  // Weapon families
  { name: "Axe", code: "axeitype", parents: ["meleitype", "weapitype"] },
  { name: "Club", code: "clubitype", parents: ["blunitype", "meleitype", "weapitype"] },
  { name: "Hammer", code: "hammitype", parents: ["blunitype", "meleitype", "weapitype"] },
  { name: "Mace", code: "maceitype", parents: ["blunitype", "meleitype", "weapitype"] },
  { name: "Polearm", code: "poleitype", parents: ["spplitype", "meleitype", "weapitype"] },
  { name: "Scepter", code: "scepitype", parents: ["roditype", "meleitype", "weapitype"] },
  { name: "Staff", code: "stafitype", parents: ["roditype", "meleitype", "weapitype"] },
  { name: "Spear", code: "speaitype", parents: ["spplitype", "meleitype", "weapitype"] },
  { name: "Sword", code: "sworitype", parents: ["bldeitype", "meleitype", "weapitype"] },
  { name: "Wand", code: "wanditype", parents: ["roditype", "meleitype", "weapitype"] },
  { name: "Bow", code: "bowitype", parents: ["missitype", "weapitype"] },
  { name: "Crossbow", code: "xbowitype", parents: ["missitype", "weapitype"] },
  { name: "Knife", code: "knifitype", parents: ["bldeitype", "meleitype", "weapitype"] },
  { name: "Javelin", code: "javeitype", parents: ["meleitype", "throitype", "weapitype"] },
  { name: "Throwing Knife", code: "tkniitype", parents: ["combitype", "knifitype"] },
  { name: "Throwing Axe", code: "taxeitype", parents: ["combitype", "axeitype"] },
  // Aggregations
  { name: "Blade", code: "bldeitype", parents: ["meleitype"] },
  { name: "Spear/Polearm", code: "spplitype", parents: ["meleitype"] },
  { name: "Blunt", code: "blunitype", parents: ["meleitype"] },
  { name: "Staves And Rods", code: "roditype", parents: ["blunitype"] },
  { name: "Thrown Weapon", code: "throitype", parents: ["weapitype"] },
  { name: "Combo Weapon", code: "combitype", parents: ["meleitype", "throitype"] },
  // Class-specific aggregations
  { name: "Amazon Item", code: "amazitype", parents: ["clasitype"] },
  { name: "Barbarian Item", code: "barbitype", parents: ["clasitype"] },
  { name: "Necromancer Item", code: "necritype", parents: ["clasitype"] },
  { name: "Paladin Item", code: "palaitype", parents: ["clasitype"] },
  { name: "Sorceress Item", code: "sorcitype", parents: ["clasitype"] },
  { name: "Assassin Item", code: "assnitype", parents: ["clasitype"] },
  { name: "Druid Item", code: "druiitype", parents: ["clasitype"] },
  { name: "Warlock Item", code: "warlitype", parents: ["clasitype"] },
  // Class-specific weapons
  { name: "Amazon Bow", code: "abowitype", parents: ["amazitype", "bowitype", "missitype", "weapitype"] },
  { name: "Amazon Spear", code: "aspeitype", parents: ["amazitype", "speaitype", "meleitype", "weapitype"] },
  { name: "Amazon Javelin", code: "ajavitype", parents: ["amazitype", "javeitype", "meleitype", "weapitype"] },
  { name: "Hand to Hand", code: "h2hitype", parents: ["assnitype", "meleitype", "weapitype"] },
  { name: "Orb", code: "orbitype", parents: ["sorcitype", "weapitype"] },
  // Class Specific Armors
  { name: "Primal Helm", code: "phlmitype", parents: ["barbitype", "helmitype"] },
  { name: "Pelt", code: "peltitype", parents: ["druiitype", "helmitype"] },
  { name: "Voodoo Heads", code: "headitype", parents: ["necritype", "shlditype"] },
  { name: "Auric Shields", code: "ashditype", parents: ["palaitype", "shlditype"] },
  { name: "Grimoire", code: "grimitype", parents: ["warlitype", "shlditype"] },
  // Miscellaneous consumables and scrolls
  { name: "Gold", code: "golditype", parents: ["miscitype"] },
  { name: "Player Body Part", code: "playitype", parents: ["miscitype"] },
  { name: "Body Part", code: "bodyitype", parents: ["miscitype"] },
  { name: "Herb", code: "herbitype", parents: ["miscitype"] },
  { name: "Potion", code: "potiitype", parents: ["miscitype"] },
  { name: "Healing Potion", code: "hpotitype", parents: ["potiitype"] },
  { name: "Mana Potion", code: "mpotitype", parents: ["potiitype"] },
  { name: "Rejuv Potion", code: "rpotitype", parents: ["hpotitype", "mpotitype"] },
  { name: "Stamina Potion", code: "spotitype", parents: ["potiitype"] },
  { name: "Antidote Potion", code: "apotitype", parents: ["potiitype"] },
  { name: "Thawing Potion", code: "wpotitype", parents: ["potiitype"] },
  { name: "Missile Potion", code: "tpotitype", parents: ["throitype"] },
  { name: "Scroll", code: "scroitype", parents: ["miscitype"] },
  { name: "Book", code: "bookitype", parents: ["miscitype"] },
  { name: "Torch", code: "torcitype", parents: ["miscitype"] },
  { name: "Elixir", code: "elixitype", parents: ["miscitype"] },
  { name: "Key", code: "keyitype", parents: ["miscitype"] },
  { name: "Quest", code: "quesitype" },
  { name: "Bow Quiver", code: "bowqitype", parents: ["mislitype", "secoitype"] },
  { name: "Crossbow Quiver", code: "xboqitype", parents: ["mislitype", "secoitype"] },
  { name: "Magic Bow Quiv", code: "mboqitype", parents: ["bowqitype"] },
  { name: "Magic Xbow Quiv", code: "mxbqitype", parents: ["xboqitype"] }
];
const ITEM_TYPE_BY_CODE = new Map(ITEM_TYPES.map((t) => [t.code, t]));
const ITEM_TYPE_BY_NAME_LC = new Map(ITEM_TYPES.map((t) => [t.name.toLowerCase(), t]));
const CHAIN_CACHE = /* @__PURE__ */ new Map();
const PARENTS_MAP = /* @__PURE__ */ new Map();
const CHILDREN_MAP = /* @__PURE__ */ new Map();
for (const t of ITEM_TYPES) {
  const parents = (t.parents ?? []).slice();
  PARENTS_MAP.set(t.code, parents);
}
for (const t of ITEM_TYPES) {
  const parents = PARENTS_MAP.get(t.code) || [];
  for (const p of parents) {
    let arr = CHILDREN_MAP.get(p);
    if (!arr) {
      arr = [];
      CHILDREN_MAP.set(p, arr);
    }
    arr.push(t.code);
  }
}
function computeChain(code, outerSeen) {
  const cached = CHAIN_CACHE.get(code);
  if (cached) return cached;
  const node = ITEM_TYPE_BY_CODE.get(code);
  if (!node) {
    const empty = Object.freeze([]);
    CHAIN_CACHE.set(code, empty);
    return empty;
  }
  const seen = outerSeen ?? /* @__PURE__ */ new Set();
  if (seen.has(code)) {
    const selfOnly = Object.freeze([code]);
    CHAIN_CACHE.set(code, selfOnly);
    return selfOnly;
  }
  seen.add(code);
  const chain = [code];
  const parents = PARENTS_MAP.get(code) || [];
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
  CHAIN_CACHE.set(code, frozen);
  return frozen;
}
function getTypeChain(code) {
  return computeChain(code).slice();
}
function getChainForTypeNameReadonly(raw) {
  const v = (raw ?? "").trim();
  if (!v) return Object.freeze([""]);
  const node = ITEM_TYPE_BY_CODE.get(v) || ITEM_TYPE_BY_NAME_LC.get(v.toLowerCase());
  return node ? computeChain(node.code) : Object.freeze([v]);
}
const CLASS_AGGREGATE_BASES = /* @__PURE__ */ new Set(["amazitype", "barbitype", "necritype", "palaitype", "sorcitype", "assnitype", "druiitype", "warlitype"]);
function makeTypeOption(label, baseCode, extraParents = [], exactBaseOnly = false, id) {
  if (!baseCode) return { id: "", label, value: void 0 };
  const finalId = id || (exactBaseOnly ? `exact-${baseCode}` : baseCode).toLowerCase().replace(/\s+/g, "-");
  let value = exactBaseOnly ? [baseCode] : getTypeChain(baseCode);
  if (!exactBaseOnly) {
    const descendants = getDescendantBaseNames(baseCode);
    if (descendants.length > 0) {
      const set = new Set(value);
      const combined = [...value];
      for (const d of descendants) {
        if (!set.has(d)) {
          combined.push(d);
          set.add(d);
        }
      }
      value = combined;
    }
  }
  if (extraParents && extraParents.length) {
    const set = new Set(value);
    const combined = [...value];
    for (const p of extraParents) {
      if (!set.has(p)) {
        combined.push(p);
        set.add(p);
      }
    }
    value = combined;
  }
  return { id: finalId, label, value };
}
function resolveBaseTypeName(raw) {
  const v = (raw ?? "").trim();
  if (!v) return "";
  const chain = getChainForTypeNameReadonly(v);
  return chain && chain.length > 0 ? chain[0] : v;
}
const CLASS_ITEM_TO_LEAF = {
  barbitype: "phlmitype",
  druiitype: "peltitype",
  necritype: "headitype",
  palaitype: "ashditype",
  warlitype: "grimitype"
};
function normalizeClassItemCode(raw) {
  const v = (raw ?? "").trim();
  return CLASS_ITEM_TO_LEAF[v] ?? v;
}
const DESCENDANTS_MAP = /* @__PURE__ */ new Map();
function computeDescendants(code) {
  const cached = DESCENDANTS_MAP.get(code);
  if (cached) return cached;
  const visited = /* @__PURE__ */ new Set();
  const stack = (CHILDREN_MAP.get(code) || []).slice();
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
    if (t.code !== code && visited.has(t.code)) ordered.push(t.code);
  }
  const frozen = Object.freeze(ordered);
  DESCENDANTS_MAP.set(code, frozen);
  return frozen;
}
function getDescendantBaseNames(baseCode) {
  return computeDescendants(baseCode).slice();
}
const ANCESTOR_ONLY_WHEN_EXACT_OFF = [
  "circlet",
  "colossal-jewel",
  "barbarian-helm",
  "druid-helm",
  "amazon-bow",
  "amazon-spear",
  "amazon-javelin",
  "assassin-claw",
  "necromancer-shield",
  "paladin-shield",
  "sorceress-orb",
  "warlock-grimoire",
  "helm"
];
function buildOptionsForPresentTypes(preset, presentBaseCodes, includeAncestorMatches = true) {
  const result = [];
  const presentClosure = /* @__PURE__ */ new Set();
  for (const b of presentBaseCodes) {
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
      include = presentBaseCodes.has(base);
    } else {
      include = includeAncestorMatches ? baseChain.some((b) => presentBaseCodes.has(b)) : presentBaseCodes.has(base);
      if (!include && extras.length > 0) {
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
  return result;
}
const type_filtering_options = [
  // Aggregate the types
  // Any Armor should include all armor descendants
  makeTypeOption("armoitype", "armoitype", [], false, "any-armor"),
  // Any Helm should include Helm itself plus Circlet, Primal Helm, and Pelt
  makeTypeOption("itype_any_helm", "helmitype", [], false, "any-helm"),
  // Any Shield should include generic Shield and class shields
  makeTypeOption("shlditype", "shlditype", [], false, "any-shield"),
  // Expand weapon aggregates so that selecting them matches child bases too
  makeTypeOption("weapitype", "weapitype", [], false, "any-weapon"),
  makeTypeOption("meleitype", "meleitype", [], false, "melee-weapon"),
  makeTypeOption("missitype", "missitype", [], false, "missile-weapon"),
  makeTypeOption("throitype", "throitype", [], false, "thrown-weapon"),
  // Armor subtypes
  makeTypeOption("torsitype", "torsitype"),
  makeTypeOption("glovitype", "glovitype"),
  makeTypeOption("bootitype", "bootitype"),
  makeTypeOption("beltitype", "beltitype"),
  makeTypeOption("helmitype", "helmitype", [], true, "helm"),
  makeTypeOption("circitype", "circitype", [], true, "circlet"),
  // Shields (Bases Page)
  makeTypeOption("shieitype", "shieitype"),
  // Jewelry and socket fillers
  makeTypeOption("ringitype", "ringitype"),
  makeTypeOption("amulitype", "amulitype"),
  makeTypeOption("jewlitype", "jewlitype"),
  makeTypeOption("cjwlitype", "cjwlitype", [], true, "colossal-jewel"),
  makeTypeOption("schaitype", "schaitype"),
  makeTypeOption("mchaitype", "mchaitype"),
  makeTypeOption("lchaitype", "lchaitype"),
  makeTypeOption("cschitype", "cschitype"),
  // Weapon bases
  makeTypeOption("axeitype", "axeitype"),
  makeTypeOption("clubitype", "clubitype"),
  makeTypeOption("maceitype", "maceitype"),
  makeTypeOption("hammitype", "hammitype"),
  makeTypeOption("sworitype", "sworitype"),
  makeTypeOption("knifitype", "knifitype"),
  makeTypeOption("speaitype", "speaitype"),
  makeTypeOption("poleitype", "poleitype"),
  makeTypeOption("scepitype", "scepitype"),
  makeTypeOption("stafitype", "stafitype"),
  makeTypeOption("wanditype", "wanditype"),
  makeTypeOption("bowitype", "bowitype"),
  makeTypeOption("xbowitype", "xbowitype"),
  makeTypeOption("javeitype", "javeitype"),
  makeTypeOption("tkniitype", "tkniitype", [], true),
  makeTypeOption("taxeitype", "taxeitype", [], true),
  // Quivers and Bolts: base on the non-magic types and include their descendants (magic quivers)
  makeTypeOption("bowqitype", "bowqitype"),
  makeTypeOption("xboqitype", "xboqitype"),
  // Class Specific
  // Class-specific leaf types must match ONLY themselves by default on pages without an "Exact" toggle
  // (Bases, Uniques, Sets). Runewords inherits parents via its own filtering logic and parent selections.
  makeTypeOption("ajavitype", "ajavitype", [], true, "amazon-javelin"),
  makeTypeOption("abowitype", "abowitype", [], true, "amazon-bow"),
  makeTypeOption("aspeitype", "aspeitype", [], true, "amazon-spear"),
  makeTypeOption("h2hitype", "h2hitype", [], true, "assassin-claw"),
  makeTypeOption("phlmitype", "phlmitype", [], true, "barbarian-helm"),
  makeTypeOption("peltitype", "peltitype", [], true, "druid-helm"),
  makeTypeOption("headitype", "headitype", [], true, "necromancer-shield"),
  makeTypeOption("ashditype", "ashditype", [], true, "paladin-shield"),
  makeTypeOption("orbitype", "orbitype", [], true, "sorceress-orb"),
  makeTypeOption("grimitype", "grimitype", [], true, "warlock-grimoire")
];
function prependTypeResetOption(options, label = "-") {
  const reset = { id: "", label, value: void 0 };
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
  return raw.split(/[,|]/).map((group) => {
    const tokens = [];
    for (const segment of group.split("+")) {
      const parts = segment.trim().split(/\s+(?=[-!]\S)/);
      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (/^[-!]\S/.test(trimmed)) {
          const term = trimmed.slice(1).trim();
          if (term) tokens.push({ term, negated: true });
        } else {
          tokens.push({ term: trimmed, negated: false });
        }
      }
    }
    return tokens;
  }).filter((group) => group.length > 0);
}
function matchesTokenGroups(hay, groups) {
  return groups.some(
    (group) => group.every((t) => t.negated ? !hay.includes(t.term) : hay.includes(t.term))
  );
}
function isVanillaItem(vanilla) {
  if (vanilla === void 0 || vanilla === null) return false;
  const vStr = typeof vanilla === "string" || typeof vanilla === "number" || typeof vanilla === "boolean" ? String(vanilla).toUpperCase() : "";
  return vStr === "Y";
}
class IncrementalRenderer {
  pageSize;
  shown;
  _observer = null;
  constructor(pageSize = 60) {
    this.pageSize = pageSize;
    this.shown = pageSize;
  }
  /** Collapse back to the first page (call whenever the source list changes). */
  reset() {
    this.shown = this.pageSize;
  }
  /** The prefix of `items` currently meant to be in the DOM. */
  visible(items) {
    return items.slice(0, this.shown);
  }
  /** Grow by one page. Returns false when already showing everything. */
  grow(items) {
    if (this.shown >= items.length) return false;
    this.shown = Math.min(this.shown + this.pageSize, items.length);
    return true;
  }
  hasMore(items) {
    return this.shown < items.length;
  }
  /**
   * Observe `sentinel`; call `onGrow` whenever it enters view (plus an 800px
   * lead margin so growth happens ~a viewport early). No-op without a sentinel
   * or when IntersectionObserver is unavailable (e.g. unit-test env).
   */
  attach(sentinel, onGrow) {
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onGrow();
      },
      { rootMargin: "0px 0px 800px 0px" }
    );
    this._observer.observe(sentinel);
  }
  detach() {
    this._observer?.disconnect();
    this._observer = null;
  }
}
function tagIds(items, field = "__rid") {
  for (let i = 0; i < items.length; i++) {
    items[i][field] = i;
  }
  return items;
}
export {
  ANCESTOR_ONLY_WHEN_EXACT_OFF as A,
  IncrementalRenderer as I,
  tokenizeSearch as a,
  buildOptionsForPresentTypes as b,
  type_filtering_options as c,
  getChainForTypeNameReadonly as d,
  toOptionalNumber as e,
  getTypeChain as g,
  isVanillaItem as i,
  matchesTokenGroups as m,
  normalizeClassItemCode as n,
  prependTypeResetOption as p,
  resolveBaseTypeName as r,
  swapMinMax as s,
  tagIds as t
};
