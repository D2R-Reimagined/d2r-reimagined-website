import { C as CustomElement, i as isBlankOrInvalid, w as watch, c as customElement, b as bindable } from "./index-04lAwL3n.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, p as prependTypeResetOption, a as getChainForTypeName, t as type_filtering_options } from "./filter-helpers-DQPTPo0a.js";
import { r as runewordsJson } from "./runewords-DIDEqgbm.js";
const name = "runewords";
const template = `<template>\r
    <h3 class="text-center my-4">\r
        <span class="rarity-text">\${filteredRunewords.length}</span> Runewords Found\r
    </h3>\r
\r
    <search-area>\r
\r
        <div class="max-w-11/12 m-auto px-4">\r
            <div class="flex flex-wrap justify-center items-start">\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="runecount" class="select-base peer" value.bind="selectedAmount" required>\r
                            <option repeat.for="opt of amounts" model.bind="opt.value">\${opt.label}</option>\r
                        </select>\r
                        <label for="runecount" class="floating-label">Rune Count</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="itype" class="select-base peer" value.bind="selectedType" required>\r
                            <option repeat.for="opt of types"\r
                                    value.bind="opt.value && opt.value.length ? opt.value[0] : ''">\${opt.label}\r
                            </option>\r
                        </select>\r
                        <label for="itype" class="floating-label">Item Type</label>\r
                    </div>\r
                    <div class="flex mb-2">\r
                        <input id="exacttype" type="checkbox" class="check-base" id="exclusiveType"\r
                               checked.bind="exclusiveType">\r
                        <label for="exacttype" class="block type-text ml-1">Exact Type Only</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <input id="rwsearch" class="select-base peer" type="text" value.bind="search" required/>\r
                        <label for="rwsearch" class="floating-label">Filter by Input</label>\r
                    </div>\r
                    <div class="flex mb-2">\r
                        <input id="hidevan" type="checkbox" class="check-base" checked.bind="hideVanilla">\r
                        <label for="hidevan" class="block type-text ml-1">Hide Vanilla</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <input id="runesearch" class="select-base peer" type="text" value.bind="searchRunes" required/>\r
                        <label for="runesearch" class="floating-label">Rune Check</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-35 px-2">\r
                    <div class="mb-2">\r
                        <button class="button-base" type="button" click.trigger="resetFilters()">\r
                            Reset Filters\r
                        </button>\r
                    </div>\r
                </div>\r
\r
            </div>\r
        </div>\r
\r
    </search-area>\r
\r
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\r
        <div class="bg-gray-800 rounded shadow p-2" repeat.for="runeword of filteredRunewords">\r
            <div class="bg-gray-800 rounded">\r
\r
                <div class="mb-1">\r
                    <div class="unique-text text-lg">\r
                        \${runeword.Name}\r
                    </div>\r
                    <div class="rarity-text">\r
                        \${runeword.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="type-text mb-1"><span repeat.for="type of runeword.Types">\r
                        \${type.Name} \${$index + 1 !== runeword.Types.length ? ' or ' : ''}\r
                    </span></div>\r
\r
                <div class="type-text"><span repeat.for="rune of runeword.Runes">\r
                        \${rune.Name | runeName} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}\r
                    </span></div>\r
\r
                <div class="requirement-text my-1">\r
                    Required Level: \${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1}\r
                </div>\r
\r
                <div class="prop-text" repeat.for="property of runeword.Properties">\r
                    \${property.PropertyString}\r
                </div>\r
\r
            </div>\r
        </div>\r
    </div>\r
</template>\r
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
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : Symbol.for("Symbol." + name2);
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
var _handleHideVanillaChanged_dec, _handleExclusiveTypeChanged_dec, _selectedAmountChanged_dec, _selectedTypeChanged_dec, _handleSearchChanged_dec, _handleSearchRunesChanged_dec, _hideVanilla_dec, _exclusiveType_dec, _searchRunes_dec, _search_dec, _Runewords_decorators, _init;
_Runewords_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _searchRunes_dec = [bindable], _exclusiveType_dec = [bindable], _hideVanilla_dec = [bindable], _handleSearchRunesChanged_dec = [watch("searchRunes")], _handleSearchChanged_dec = [watch("search")], _selectedTypeChanged_dec = [watch("selectedType")], _selectedAmountChanged_dec = [watch("selectedAmount")], _handleExclusiveTypeChanged_dec = [watch("exclusiveType")], _handleHideVanillaChanged_dec = [watch("hideVanilla")];
class Runewords {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "runewords", runewordsJson);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "searchRunes", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "exclusiveType", __runInitializers(_init, 16, this, false)), __runInitializers(_init, 19, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 20, this, false)), __runInitializers(_init, 23, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "filteredRunewords", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "selectedType");
    __publicField(this, "amounts", [
      { value: "", label: "-" },
      { value: 2, label: "2 Runes" },
      { value: 3, label: "3 Runes" },
      { value: 4, label: "4 Runes" },
      { value: 5, label: "5 Runes" },
      { value: 6, label: "6 Runes" }
    ]);
    __publicField(this, "selectedAmount");
  }
  // Build options and hydrate filters from URL before controls render
  binding() {
    const urlParams = new URLSearchParams(window.location.search);
    const present = /* @__PURE__ */ new Set();
    try {
      for (const rw of this.runewords) {
        const types = Array.isArray(rw?.Types) ? rw.Types : [];
        for (const t of types) {
          const base = resolveBaseTypeName(t?.Name ?? "");
          if (base) present.add(base);
        }
      }
    } catch {
    }
    this.types = buildOptionsForPresentTypes(
      type_filtering_options,
      present,
      { dedupeByBase: true, preferLabelStartsWith: "Any " }
    );
    this.types = prependTypeResetOption(this.types);
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam)) {
      this.search = searchParam;
    }
    const runesParam = urlParams.get("runes");
    if (runesParam && !isBlankOrInvalid(runesParam)) {
      this.searchRunes = runesParam;
    }
    const hv = urlParams.get("hideVanilla");
    if (hv === "true" || hv === "1") this.hideVanilla = true;
    const typeParam = urlParams.get("type");
    if (typeParam && !isBlankOrInvalid(typeParam)) {
      const base = typeParam.split(",")[0];
      const opt = this.types.find((o) => o.value && o.value[0] === base);
      this.selectedType = opt ? base : void 0;
    }
    const socketsParam = urlParams.get("sockets");
    if (socketsParam && !isBlankOrInvalid(socketsParam)) {
      const n = parseInt(socketsParam, 10);
      if (Number.isFinite(n) && n >= 2 && n <= 6) this.selectedAmount = n;
    }
    const exactParam = urlParams.get("exact");
    if (exactParam && !isBlankOrInvalid(exactParam)) {
      this.exclusiveType = exactParam === "true";
    }
  }
  attached() {
    this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
    this.updateList();
  }
  // Push current filters to URL
  updateUrl() {
    const url = new URL(window.location.href);
    if (this.search && this.search.trim() !== "") {
      url.searchParams.set("search", this.search);
    } else {
      url.searchParams.delete("search");
    }
    if (this.searchRunes && this.searchRunes.trim() !== "") {
      url.searchParams.set("runes", this.searchRunes);
    } else {
      url.searchParams.delete("runes");
    }
    if (this.selectedType && this.selectedType !== "") {
      url.searchParams.set("type", this.selectedType);
    } else {
      url.searchParams.delete("type");
    }
    if (typeof this.selectedAmount === "number" && Number.isFinite(this.selectedAmount) && this.selectedAmount >= 2 && this.selectedAmount <= 6) {
      url.searchParams.set("sockets", String(this.selectedAmount));
    } else {
      url.searchParams.delete("sockets");
    }
    if (this.exclusiveType) {
      url.searchParams.set("exact", "true");
    } else {
      url.searchParams.delete("exact");
    }
    if (this.hideVanilla) {
      url.searchParams.set("hideVanilla", "true");
    } else {
      url.searchParams.delete("hideVanilla");
    }
    window.history.pushState({}, "", url.toString());
  }
  handleSearchRunesChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  selectedTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  selectedAmountChanged() {
    if (typeof this.selectedAmount !== "number") {
      const v = Number(this.selectedAmount);
      if (Number.isFinite(v) && v >= 2 && v <= 6) {
        this.selectedAmount = v;
      } else {
        this.selectedAmount = void 0;
      }
    }
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleExclusiveTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleHideVanillaChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  normalizeRuneName(name2) {
    return name2.replace(/ rune$/i, "").trim().toLowerCase();
  }
  updateList() {
    let filteringRunewords = this.runewords;
    if (this.selectedType) {
      const selectedBase = resolveBaseTypeName(this.selectedType ?? "");
      if (selectedBase) {
        const selectedChain = getChainForTypeName(selectedBase);
        const selectedChainSet = new Set(selectedChain);
        let hasDescendantInData = false;
        if (!this.exclusiveType) {
          try {
            outer: for (const rw of this.runewords) {
              const types = Array.isArray(rw?.Types) ? rw.Types : [];
              for (let i = 0; i < types.length; i++) {
                const raw = types[i]?.Name != null ? String(types[i].Name) : "";
                const chain = getChainForTypeName(raw);
                if (!chain || chain.length === 0) continue;
                const base = chain[0];
                if (base !== selectedBase && chain.indexOf(selectedBase) !== -1) {
                  hasDescendantInData = true;
                  break outer;
                }
              }
            }
          } catch {
            hasDescendantInData = false;
          }
        }
        filteringRunewords = filteringRunewords.filter((rw) => {
          const types = Array.isArray(rw.Types) ? rw.Types : [];
          for (let i = 0; i < types.length; i++) {
            const raw = types[i]?.Name != null ? String(types[i].Name) : "";
            const chain = getChainForTypeName(raw);
            if (!chain || chain.length === 0) continue;
            const itemBase = chain[0];
            if (this.exclusiveType) {
              if (itemBase === selectedBase) return true;
            } else if (hasDescendantInData) {
              if (chain.indexOf(selectedBase) !== -1) return true;
            } else {
              if (selectedChainSet.has(itemBase)) return true;
            }
          }
          return false;
        });
      }
    }
    if (this.selectedAmount) {
      filteringRunewords = filteringRunewords.filter((x) => x.Runes.length === this.selectedAmount);
    }
    let found = filteringRunewords;
    const searchRaw = (this.search || "").trim().toLowerCase();
    const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
    if (searchTokens.length) {
      found = found.filter((runeword) => {
        const hay = [
          String(runeword.Name || ""),
          ...(runeword.Properties || []).map((p) => String(p?.PropertyString || "")),
          ...(runeword.Types || []).map((t) => String(t?.Name || ""))
        ].filter(Boolean).join(" ").toLowerCase();
        return searchTokens.every((t) => hay.includes(t));
      });
    }
    if (this.searchRunes) {
      const inputRuneList = this.searchRunes.split(" ").map((rune) => rune.trim().toLowerCase()).filter((rune) => rune.length > 0);
      found = found.filter((runeword) => {
        const runewordRuneNames = runeword.Runes.map((rune) => this.normalizeRuneName(rune.Name));
        return inputRuneList.every(
          (inputRune) => runewordRuneNames.includes(inputRune)
        );
      });
    }
    if (this.hideVanilla) {
      found = found.filter((rw) => String(rw?.Vanilla || "").toUpperCase() !== "Y");
    }
    this.filteredRunewords = found;
  }
  // Reset all filters and refresh URL/list
  resetFilters() {
    this.search = "";
    this.searchRunes = "";
    this.selectedType = void 0;
    this.selectedAmount = void 0;
    this.exclusiveType = false;
    this.hideVanilla = false;
    this.updateList();
    this.updateUrl();
  }
  // Note: no type name transformations; use the names as exported by the game data.
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchRunesChanged", _handleSearchRunesChanged_dec, Runewords);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedTypeChanged", _selectedTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedAmountChanged", _selectedAmountChanged_dec, Runewords);
__decorateElement(_init, 1, "handleExclusiveTypeChanged", _handleExclusiveTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "handleHideVanillaChanged", _handleHideVanillaChanged_dec, Runewords);
__decorateElement(_init, 5, "search", _search_dec, Runewords);
__decorateElement(_init, 5, "searchRunes", _searchRunes_dec, Runewords);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Runewords);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Runewords);
Runewords = __decorateElement(_init, 0, "Runewords", _Runewords_decorators, Runewords);
__runInitializers(_init, 1, Runewords);
export {
  Runewords
};
