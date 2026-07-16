import { C as CustomElement, i as isBlankOrInvalid, t, s as syncParamsToUrl, f as format, w as watch, c as customElement, b as bindable } from "./index-CTTJeB_J.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, p as prependTypeResetOption, a as tokenizeSearch, m as matchesTokenGroups, d as getChainForTypeNameReadonly, c as type_filtering_options, I as IncrementalRenderer } from "./incremental-render-Cch9chka.js";
import { g as getDamageTypeString } from "./damage-types-BlYhXdWN.js";
const name = "bases";
const template = `<template>
    <h3 class="text-lg type-text text-center my-4">
        <span class="rarity-text">[N]</span> = \${'label_normal' | t} <span class="rarity-text">[X]</span> = \${'label_exceptional' | t} <span
            class="rarity-text">[E]</span> = \${'label_elite' | t}
    </h3>
    <h3 class="text-lg type-text text-center mb-4">
        <span class="rarity-text">\${totalCount}</span> \${'found_bases_suffix' | t}
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="\${'help_category_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="category" class="select-base peer" value.bind="selectedCategory"
                                    change.trigger="handleCategoryChange()">
                                <option repeat.for="opt of categoryOptions" value.bind="opt.value">\${opt.label | t}</option>
                            </select>
                            <label for="category" class="floating-label">\${'filter_select_category' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="category">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_category'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="\${'help_sockets_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="sockets" class="select-base peer" value.bind="selectedSockets">
                                <option repeat.for="opt of socketOptions" if.bind="opt.value === ''" value="">
                                    \${opt.label | t}
                                </option>
                                <option repeat.for="opt of socketOptions" if.bind="opt.value !== ''"
                                        model.bind="opt.value">\${opt.label | t:opt.value}
                                </option>
                            </select>
                            <label for="sockets" class="floating-label">\${'filter_select_sockets' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="sockets">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_sockets'}</span>
                        </button>
                    </div>
                </div>

                <searchable-select id="itype"
                                   class="w-full lg:w-auto lg:min-w-60"
                                   data-help-text="\${'help_item_type_filter' | t}"
                                   value.bind="selectedType"
                                   options.bind="types"
                                   label="\${'filter_select_type' | t}">
                    <button au-slot="after" type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">
                        <span class="mso">info</span>
                        <span class="sr-only">\${'info_more_about' | t:'filter_select_type'}</span>
                    </button>
                </searchable-select>

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="\${'help_tier_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="tier" class="select-base peer" value.bind="selectedTier">
                                <option repeat.for="opt of tierOptions" value.bind="opt.value">\${opt.label | t}</option>
                            </select>
                            <label for="tier" class="floating-label">\${'filter_select_tier' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="tier">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_tier'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-60"
                     data-help-text="\${'help_search' | t}">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"
                                   placeholder=" "/>
                            <label for="inputsearch" class="floating-label">\${'filter_search_placeholder' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_search_placeholder'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="\${'help_reset_filters' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="filterreset" class="button-base" type="button" click.trigger="resetFilters()">
                                \${'filter_reset' | t}
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="filterreset">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_reset'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <!-- Spacer -->
    <div class="h-5"></div>

    <!-- Cards and title begin -->
    <div class="card-vis" repeat.for="group of visibleGroups; key.bind: group.typeName">
        <h4 class="text-xl type-text">\${group.typeName | t}</h4>

        <div class="card-container">
            <template repeat.for="family of group.families; key.bind: family.familyKey">
                <div class="card-box card-vis" repeat.for="item of family.items; key.bind: item.__index">

                    <!-- Name + Sockets banner -->
                    <div class="mb-1">
                        <div class="text-xl base-text">\${item.NameKey | t}</div>
                        <div class="text-base rarity-text"
                             if.bind="(typeof item.GemSockets === 'number' ? item.GemSockets > 0 : (item.GemSockets && item.GemSockets !== '0'))">
                            <div>\${'label_item_level_sockets' | t}</div>
                            <div>\${item.GemSockets}</div>
                        </div>
                    </div>

                    <!-- Type label -->
                    <div class="mb-1">
                        <div class="text-base type-text" if.bind="item.Type && item.Type.Index">
                            \${item.Type.Index | t}
                        </div>
                    </div>

                    <!-- Defense / block / smite / kick -->
                    <div class="mb-1"
                         if.bind="item.Lines && item.Lines.length">
                        <div repeat.for="line of item.Lines"
                             if.bind="['strDefense','strDefenseRange','strDefenseRangeRange','strChanceToBlock','strSmiteDamage','strKickDamage'].includes(line.key)"
                             class="text-base type-text">
                            \${line | keyedLine}
                        </div>
                    </div>

                    <!-- Weapon damage -->
                    <div class="mb-1"
                         if.bind="item.__kind === 'weapon' && item.DamageTypes && item.DamageTypes.length">
                        <div class="text-base type-text flex items-center justify-center gap-1">
                            <div repeat.for="d of item.DamageTypes">
                                <span repeat.for="line of d.Lines | keyedLines">\${line}</span>
                                <span class="set-text" if.bind="d.AverageDamage"> <\${d.AverageDamage}></span>
                            </div>
                        </div>
                    </div>

                    <!-- Durability / indestructible / ethereal / sockets-on-item -->
                    <div class="mb-1"
                         if.bind="item.Lines && item.Lines.length">
                        <div repeat.for="line of item.Lines"
                             if.bind="['strDurability','strIndestructible','strethereal','strSocketedCount'].includes(line.key)"
                             class="text-base type-text">
                            \${line | keyedLine}
                        </div>
                    </div>

                    <!-- Requirements: class / dex / str / level -->
                    <div class="mb-1">
                        <div repeat.for="line of item.Lines"
                             if.bind="['strRequiredClass','strRequiredDexterity','strRequiredStrength'].includes(line.key)"
                             class="text-base requirement-text">
                            \${line | keyedLine}
                        </div>
                        <div class="text-base requirement-text">
                            \${'strRequiredLevel' | t: item.RequiredLevel || 1}
                        </div>
                    </div>

                    <!-- AutoMagicGroups: per-affix-family block, mirrors master layout -->
                    <div if.bind="item.AutoMagicGroups && item.AutoMagicGroups.length">
                        <div class="flex justify-between items-start mb-1 border-b border-gray-700 last:border-b-0 last:mb-0"
                             repeat.for="g of groupedProperties(item)">
                            <div class="text-base prop-text text-left whitespace-nowrap">
                                <span if.bind="g.requiredLevel && g.requiredLevel > 0">
                                    \${'strRequiredLevel' | t: g.requiredLevel}
                                </span>
                            </div>
                            <div class="flex flex-col items-end text-right">
                                <keyed-lines class="text-base prop-text" lines.bind="g.lines"></keyed-lines>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </div>
    </div>
    <div ref="sentinelEl" class="h-1"></div>
</template>
`;
const dependencies = [];
const bindables = {};
let _e;
function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies, bindables });
  }
  container.register(_e);
}
const __au2ViewDef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bindables,
  default: template,
  dependencies,
  name,
  register,
  template
}, Symbol.toStringTag, { value: "Module" }));
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name2, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name2, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name2, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name2]() {
    return __privateGet(this, extra);
  }, set [name2](x) {
    return __privateSet(this, extra, x);
  } }, name2));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name2) : __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name2 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name2];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name2] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _onSocketsChanged_dec, _onTierChanged_dec, _onTypeChanged_dec, _onSearchChanged_dec, _selectedSockets_dec, _selectedTier_dec, _selectedType_dec, _search_dec, _selectedCategory_dec, _Bases_decorators, _init;
_Bases_decorators = [customElement(__au2ViewDef)], _selectedCategory_dec = [bindable], _search_dec = [bindable], _selectedType_dec = [bindable], _selectedTier_dec = [bindable], _selectedSockets_dec = [bindable], _onSearchChanged_dec = [watch("search")], _onTypeChanged_dec = [watch("selectedType")], _onTierChanged_dec = [watch("selectedTier")], _onSocketsChanged_dec = [watch("selectedSockets")];
class Bases {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "categoryOptions", [
      { value: "", label: "-" },
      { value: "armors", label: "label_armors" },
      { value: "weapons", label: "label_weapons" }
    ]);
    __publicField(this, "selectedCategory", __runInitializers(_init, 8, this, "")), __runInitializers(_init, 11, this);
    __publicField(this, "search", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedType", __runInitializers(_init, 16, this, "")), __runInitializers(_init, 19, this);
    __publicField(this, "selectedTier", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "selectedSockets", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "tierOptions", [
      { value: "", label: "-" },
      { value: "Normal", label: "label_normal" },
      { value: "Exceptional", label: "label_exceptional" },
      { value: "Elite", label: "label_elite" }
    ]);
    __publicField(this, "socketOptions", [
      { value: "", label: "-" },
      { value: 1, label: "label_socket" },
      { value: 2, label: "label_sockets" },
      { value: 3, label: "label_sockets" },
      { value: 4, label: "label_sockets" },
      { value: 5, label: "label_sockets" },
      { value: 6, label: "label_sockets" }
    ]);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "_tierMap", /* @__PURE__ */ new Map());
    __publicField(this, "_searchMap", /* @__PURE__ */ new Map());
    __publicField(this, "_familyMap", /* @__PURE__ */ new Map());
    __publicField(this, "_allBases", []);
    __publicField(this, "itemsArmor", []);
    __publicField(this, "itemsWeapon", []);
    __publicField(this, "sentinelEl");
    __publicField(this, "_inc", new IncrementalRenderer(8));
    __publicField(this, "shownGroups", 8);
    __publicField(this, "getDamageTypeString", getDamageTypeString);
  }
  // Build type options and hydrate from URL
  async binding() {
    try {
      const [aResp, wResp] = await Promise.all([
        fetch("/data/keyed/armors.json"),
        fetch("/data/keyed/weapons.json")
      ]);
      this.itemsArmor = (await aResp.json()).map((it, __index) => ({
        ...it,
        __kind: "armor",
        __index,
        Code: it.Code || it.NameKey
        // Fallback for missing Code
      }));
      this.itemsWeapon = (await wResp.json()).map((it, __index) => ({
        ...it,
        __kind: "weapon",
        __index,
        Code: it.Code || it.NameKey
        // Fallback for missing Code
      }));
    } catch (e) {
      console.error("Failed to load bases:", e);
      this.itemsArmor = [];
      this.itemsWeapon = [];
    }
    this._allBases = [...this.itemsArmor, ...this.itemsWeapon];
    this._familyMap.clear();
    for (const i of this._allBases) {
      const key = `${i.NormCode || ""}|${i.UberCode || ""}|${i.UltraCode || ""}`;
      if (key.replace(/\|/g, "").length > 0) {
        let list = this._familyMap.get(key);
        if (!list) {
          list = [];
          this._familyMap.set(key, list);
        }
        list.push(i);
      }
    }
    this._tierMap.clear();
    this._searchMap.clear();
    for (const i of this._allBases) {
      this._tierMap.set(i, this.calculateTier(i));
      this._searchMap.set(i, this.buildSearchString(i));
    }
    const path = window.location.pathname.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("category");
    if (catParam === "armors" || catParam === "weapons")
      this.selectedCategory = catParam;
    else if (path.endsWith("/armors")) this.selectedCategory = "armors";
    else if (path.endsWith("/weapons")) this.selectedCategory = "weapons";
    else this.selectedCategory = "";
    this.rebuildTypeOptions();
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam))
      this.search = searchParam;
    const tierParam = urlParams.get("tier");
    if (tierParam === "Normal" || tierParam === "Exceptional" || tierParam === "Elite") {
      this.selectedTier = tierParam;
    }
    const socketsParam = urlParams.get("sockets");
    if (socketsParam && !isBlankOrInvalid(socketsParam)) {
      const n = parseInt(socketsParam, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 6) this.selectedSockets = n;
    }
    const typeParam = urlParams.get("type");
    if (typeParam && !isBlankOrInvalid(typeParam)) {
      const opt = this.types.find((o) => o.id === typeParam);
      this.selectedType = opt ? opt.id : "";
    }
  }
  rebuildTypeOptions() {
    const present = /* @__PURE__ */ new Set();
    const datasets = this.selectedCategory === "armors" ? [this.itemsArmor] : this.selectedCategory === "weapons" ? [this.itemsWeapon] : [this.itemsArmor, this.itemsWeapon];
    for (const ds of datasets) {
      for (const i of ds) {
        const base = resolveBaseTypeName(i?.Type?.Index ?? "");
        if (base) present.add(base);
      }
    }
    const options = buildOptionsForPresentTypes(
      type_filtering_options,
      present
    ).map((opt) => ({
      ...opt,
      label: t(opt.label)
    }));
    this.types = prependTypeResetOption(options);
  }
  attached() {
    this.updateUrl();
    this._inc.attach(this.sentinelEl, () => this.loadMore());
  }
  detached() {
    this._inc.detach();
  }
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      type: this.selectedType,
      tier: this.selectedTier,
      sockets: this.selectedSockets,
      category: this.selectedCategory
    }, false);
  }
  handleCategoryChange() {
    this.rebuildTypeOptions();
    if (this.selectedType && !this.types.some((o) => o.id === this.selectedType)) {
      this.selectedType = "";
    }
    this.resetGroups();
    this.updateUrl();
  }
  onSearchChanged() {
    this.resetGroups();
    this.updateUrl();
  }
  onTypeChanged() {
    this.resetGroups();
    this.updateUrl();
  }
  onTierChanged() {
    if (this.selectedTier === "") this.selectedTier = void 0;
    this.resetGroups();
    this.updateUrl();
  }
  onSocketsChanged() {
    if (typeof this.selectedSockets !== "number") {
      const v = Number(this.selectedSockets);
      if (Number.isFinite(v) && v >= 1 && v <= 6) this.selectedSockets = v;
      else this.selectedSockets = void 0;
    }
    if (typeof this.selectedSockets !== "number" || !Number.isFinite(this.selectedSockets) || this.selectedSockets < 1 || this.selectedSockets > 6) {
      this.selectedSockets = void 0;
    }
    this.resetGroups();
    this.updateUrl();
  }
  resetFilters() {
    this.selectedCategory = "";
    this.search = "";
    this.selectedType = "";
    this.selectedTier = void 0;
    this.selectedSockets = void 0;
    this.rebuildTypeOptions();
    this.resetGroups();
    this.updateUrl();
  }
  get allItems() {
    if (this.selectedCategory === "armors") return this.itemsArmor;
    if (this.selectedCategory === "weapons") return this.itemsWeapon;
    return [...this.itemsArmor, ...this.itemsWeapon];
  }
  get filteredAndGrouped() {
    const searchTokens = tokenizeSearch(this.search);
    const typeFilter = this.selectedType;
    const tierFilter = this.selectedTier;
    const sockets = this.selectedSockets;
    const all = this.allItems || [];
    const primary = [];
    const codeSet = /* @__PURE__ */ new Set();
    for (const i of all) {
      const hay = this._searchMap.get(i) || "";
      const matches = !searchTokens.length || matchesTokenGroups(hay, searchTokens);
      if (matches) {
        primary.push(i);
        if (i.NormCode) codeSet.add(i.NormCode.toLowerCase());
        if (i.UberCode) codeSet.add(i.UberCode.toLowerCase());
        if (i.UltraCode) codeSet.add(i.UltraCode.toLowerCase());
      }
    }
    const combinedSet = new Set(primary);
    if (codeSet.size > 0) {
      for (const i of all) {
        if (combinedSet.has(i)) continue;
        if (i.NormCode && codeSet.has(i.NormCode.toLowerCase()) || i.UberCode && codeSet.has(i.UberCode.toLowerCase()) || i.UltraCode && codeSet.has(i.UltraCode.toLowerCase())) {
          combinedSet.add(i);
        }
      }
    }
    let allowedTypeSet;
    if (typeFilter) {
      const opt = this.types.find((o) => o.id === typeFilter);
      if (opt && opt.value) allowedTypeSet = new Set(opt.value);
    }
    const filtered = [];
    for (const i of combinedSet) {
      if (allowedTypeSet) {
        const base = getChainForTypeNameReadonly(i?.Type?.Index ?? "")[0] || (i?.Type?.Index ?? "");
        if (!allowedTypeSet.has(base)) continue;
      }
      if (tierFilter && this._tierMap.get(i) !== tierFilter) continue;
      if (sockets) {
        const gs = i.GemSockets;
        let match = false;
        if (typeof gs === "number") match = gs === sockets;
        else if (typeof gs === "string") {
          match = gs.includes(`: ${sockets}`) || gs.includes(`:${sockets}`);
        }
        if (!match) continue;
      }
      filtered.push(i);
    }
    const typeMap = /* @__PURE__ */ new Map();
    for (const i of filtered) {
      const t2 = i?.Type?.Index || "Other";
      let familyMap = typeMap.get(t2);
      if (!familyMap) {
        familyMap = /* @__PURE__ */ new Map();
        typeMap.set(t2, familyMap);
      }
      const fKey = `${i.NormCode || ""}|${i.UberCode || ""}|${i.UltraCode || ""}`;
      let members = familyMap.get(fKey);
      if (!members) {
        members = [];
        familyMap.set(fKey, members);
      }
      members.push(i);
    }
    const tierOrder = { "Normal": 0, "Exceptional": 1, "Elite": 2 };
    const groups = Array.from(typeMap.entries()).map(([typeName, familyMap]) => {
      const families = Array.from(familyMap.entries()).map(([familyKey, members]) => {
        members.sort((a, b) => {
          const oa = tierOrder[this._tierMap.get(a) || ""] ?? 99;
          const ob = tierOrder[this._tierMap.get(b) || ""] ?? 99;
          if (oa !== ob) return oa - ob;
          return (a.__index ?? 0) - (b.__index ?? 0);
        });
        const minIndex = members.reduce(
          (min, it) => Math.min(min, it.__index ?? 999999),
          999999
        );
        return { familyKey, items: members, minIndex };
      }).sort((a, b) => a.minIndex - b.minIndex);
      return { typeName, families };
    }).sort((a, b) => a.typeName.localeCompare(b.typeName));
    return groups;
  }
  // The prefix of groups currently rendered; grows as the sentinel scrolls in.
  get visibleGroups() {
    return this.filteredAndGrouped.slice(0, this.shownGroups);
  }
  resetGroups() {
    this._inc.reset();
    this.shownGroups = this._inc.shown;
  }
  loadMore() {
    if (this._inc.grow(this.filteredAndGrouped)) {
      this.shownGroups = this._inc.shown;
    }
  }
  get totalCount() {
    return this.filteredAndGrouped.reduce(
      (acc, g) => acc + g.families.reduce((s, f) => s + f.items.length, 0),
      0
    );
  }
  calculateTier(i) {
    const name2 = t(i.NameKey);
    const m = name2.match(/\[(N|X|E)\]/i);
    if (m) {
      const ch = m[1].toUpperCase();
      if (ch === "N") return "Normal";
      if (ch === "X") return "Exceptional";
      if (ch === "E") return "Elite";
    }
    const famKey = `${i.NormCode || ""}|${i.UberCode || ""}|${i.UltraCode || ""}`;
    if (famKey.replace(/\|/g, "").length === 0) return void 0;
    const family = this._familyMap.get(famKey);
    if (family && family.length >= 3) {
      const sorted = family.slice().sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
      const pos = sorted.indexOf(i);
      if (pos === 0) return "Normal";
      if (pos === 1) return "Exceptional";
      if (pos === 2) return "Elite";
    }
    return void 0;
  }
  buildSearchString(i) {
    const parts = [
      t(i.NameKey),
      t(i.Type.Index),
      i.Code || i.NameKey,
      i.NormCode ?? "",
      i.UberCode ?? "",
      i.UltraCode ?? ""
    ];
    if (Array.isArray(i.Lines)) {
      for (const l of i.Lines) parts.push(format(l));
    }
    if (Array.isArray(i.DamageTypes)) {
      for (const d of i.DamageTypes) {
        parts.push(getDamageTypeString(d.Type));
        if (Array.isArray(d.Lines)) {
          for (const l of d.Lines) parts.push(format(l));
        }
      }
    }
    if (Array.isArray(i.AutoMagicGroups)) {
      for (const g of i.AutoMagicGroups) {
        if (g.NameKey) parts.push(t(g.NameKey));
        if (Array.isArray(g.Lines)) {
          for (const l of g.Lines) parts.push(format(l));
        }
      }
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  }
  /**
   * Group `AutoMagicGroups` for display.
   *
   * The keyed bundle emits one entry per affix tier (e.g. "of Blight",
   * "of Venom", "of Pestilence", ...) � each carries its own `RequiredLevel`
   * and a `Lines` array describing the mods. The UI shows them as one block
   * per affix family with the lowest required level on the left and all
   * the lines stacked on the right (matching the master-branch layout).
   *
   * Strategy: bucket entries by `NameKey`, accumulate lines (deduped), keep
   * the smallest `RequiredLevel` and the `Level` for ordering, then return
   * the buckets sorted by min-level / order-of-appearance.
   */
  groupedProperties(item) {
    const raw = item?.AutoMagicGroups;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const map = /* @__PURE__ */ new Map();
    raw.forEach((g, idx) => {
      const nameKey = g.NameKey && g.NameKey.trim() !== "" ? g.NameKey : `__auto_${idx}`;
      const minIdx = g.Level ?? idx;
      let entry = map.get(nameKey);
      if (!entry) {
        entry = {
          nameKey,
          name: t(nameKey),
          level: g.Level ?? 0,
          requiredLevel: g.RequiredLevel,
          lines: [],
          minIndex: minIdx
        };
        map.set(nameKey, entry);
      } else {
        if (g.RequiredLevel !== void 0 && (entry.requiredLevel === void 0 || g.RequiredLevel < entry.requiredLevel)) {
          entry.requiredLevel = g.RequiredLevel;
        }
        if (minIdx < entry.minIndex) entry.minIndex = minIdx;
      }
      if (Array.isArray(g.Lines)) {
        for (const l of g.Lines) {
          const rendered = format(l);
          if (!entry.lines.some((existing) => format(existing) === rendered)) {
            entry.lines.push(l);
          }
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      if (a.minIndex !== b.minIndex) return a.minIndex - b.minIndex;
      return a.name.localeCompare(b.name);
    });
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "onSearchChanged", _onSearchChanged_dec, Bases);
__decorateElement(_init, 1, "onTypeChanged", _onTypeChanged_dec, Bases);
__decorateElement(_init, 1, "onTierChanged", _onTierChanged_dec, Bases);
__decorateElement(_init, 1, "onSocketsChanged", _onSocketsChanged_dec, Bases);
__decorateElement(_init, 5, "selectedCategory", _selectedCategory_dec, Bases);
__decorateElement(_init, 5, "search", _search_dec, Bases);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Bases);
__decorateElement(_init, 5, "selectedTier", _selectedTier_dec, Bases);
__decorateElement(_init, 5, "selectedSockets", _selectedSockets_dec, Bases);
Bases = __decorateElement(_init, 0, "Bases", _Bases_decorators, Bases);
__runInitializers(_init, 1, Bases);
export {
  Bases
};
