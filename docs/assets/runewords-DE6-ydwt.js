import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-Ubr5Vxao.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
import { r as runewordsJson } from "./runewords-CBz0H1iM.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, g as getChainForTypeName } from "./item-type-filters-EbkYbcFa.js";
const name = "runewords";
const template = '<template>\r\n    <h3 class="text-center my-4">\r\n        <span class="rarity-text">${filteredRunewords.length}</span> Runewords Found\r\n    </h3>\r\n    <search-area>\r\n        <div class="max-w-7xl mx-auto px-4">\r\n            <div class="flex flex-wrap justify-center items-center text-center">\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Socket Count"\r\n                                options.bind="amounts"\r\n                                value.bind="selectedAmount"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="my-1">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Type"\r\n                                options.bind="types"\r\n                                value.bind="selectedType"\r\n                        ></moo-select>\r\n                        <moo-checkbox checked.bind="exclusiveType" id="exclusiveType">Exact Type Only</moo-checkbox>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-text-field\r\n                                class="w-full"\r\n                                label="Search Runewords"\r\n                                type="text"\r\n                                value.bind="search"\r\n                        ></moo-text-field>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-text-field\r\n                                class="w-full"\r\n                                label="Runes"\r\n                                type="text"\r\n                                value.bind="searchRunes"\r\n                        ></moo-text-field>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </search-area>\r\n    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\r\n        <div repeat.for="runeword of filteredRunewords">\r\n            <div class="bg-gray-800 rounded shadow p-2">\r\n                <div class="unique-text text-xl mb-1">\r\n                    ${runeword.Name}\r\n                </div>\r\n                <div class="combo mb-1">\r\n                    <span repeat.for="rune of runeword.Runes">\r\n                        ${rune.Name | runeName} ${$index + 1 !== runeword.Runes.length ? \' + \' : \'\'}\r\n                    </span>\r\n                </div>\r\n                <div class="types mb-1">\r\n                    <span repeat.for="type of runeword.Types">\r\n                        ${type.Name} ${$index + 1 !== runeword.Types.length ? \' or \' : \'\'}\r\n                    </span>\r\n                </div>\r\n                <div class="requirement mt-1">\r\n                    Level ${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1} Required\r\n                </div>\r\n                <div class="mt-1">\r\n                    <div class="enhanced" repeat.for="property of runeword.Properties">\r\n                        ${property.PropertyString}\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n';
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
var _handleExclusiveTypeChanged_dec, _selectedAmountChanged_dec, _selectedTypeChanged_dec, _handleSearchChanged_dec, _handleSearchRunesChanged_dec, _exclusiveType_dec, _searchRunes_dec, _search_dec, _Runewords_decorators, _init;
_Runewords_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _searchRunes_dec = [bindable], _exclusiveType_dec = [bindable], _handleSearchRunesChanged_dec = [watch("searchRunes")], _handleSearchChanged_dec = [watch("search")], _selectedTypeChanged_dec = [watch("selectedType")], _selectedAmountChanged_dec = [watch("selectedAmount")], _handleExclusiveTypeChanged_dec = [watch("exclusiveType")];
class Runewords {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "runewords", runewordsJson);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "searchRunes", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "exclusiveType", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "filteredRunewords", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "selectedType");
    __publicField(this, "amounts", [
      { value: void 0, label: "Any" },
      { value: 2, label: "2 Sockets" },
      { value: 3, label: "3 Sockets" },
      { value: 4, label: "4 Sockets" },
      { value: 5, label: "5 Sockets" },
      { value: 6, label: "6 Sockets" }
    ]);
    __publicField(this, "selectedAmount");
  }
  attached() {
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
    this.types = buildOptionsForPresentTypes(type_filtering_options, present);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      this.search = searchParam;
    }
    const runesParam = urlParams.get("runes");
    if (runesParam) {
      this.searchRunes = runesParam;
    }
    const typeParam = urlParams.get("type");
    if (typeParam) {
      this.selectedType = typeParam.split(",");
    }
    const socketsParam = urlParams.get("sockets");
    if (socketsParam) {
      this.selectedAmount = parseInt(socketsParam, 10);
    }
    const exactParam = urlParams.get("exact");
    if (exactParam) {
      this.exclusiveType = exactParam === "true";
    }
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
    if (this.selectedType && this.selectedType.length > 0) {
      url.searchParams.set("type", this.selectedType.join(","));
    } else {
      url.searchParams.delete("type");
    }
    if (this.selectedAmount) {
      url.searchParams.set("sockets", this.selectedAmount.toString());
    } else {
      url.searchParams.delete("sockets");
    }
    if (this.exclusiveType) {
      url.searchParams.set("exact", "true");
    } else {
      url.searchParams.delete("exact");
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
  normalizeRuneName(name2) {
    return name2.replace(/ rune$/i, "").trim().toLowerCase();
  }
  updateList() {
    let filteringRunewords = this.runewords;
    if (this.selectedType?.length > 0) {
      const selected = this.exclusiveType ? [this.selectedType[0]] : this.selectedType;
      const selectedSet = new Set(selected);
      const normalizeBase = (t) => {
        const raw = t?.Name != null ? String(t.Name) : "";
        const chain = getChainForTypeName(raw);
        return chain && chain.length > 0 ? chain[0] : raw;
      };
      filteringRunewords = filteringRunewords.filter((rw) => {
        const types = Array.isArray(rw.Types) ? rw.Types : [];
        return types.some((t) => selectedSet.has(normalizeBase(t)));
      });
    }
    if (this.selectedAmount) {
      filteringRunewords = filteringRunewords.filter((x) => x.Runes.length === this.selectedAmount);
    }
    let found = filteringRunewords;
    if (this.search) {
      found = found.filter((runeword) => {
        if (runeword.Name.toLowerCase().includes(this.search.toLowerCase())) {
          return true;
        }
        for (const property of runeword.Properties) {
          if (property.PropertyString.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          }
        }
        for (const type of runeword.Types) {
          if (type.Name.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          }
        }
        return false;
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
    this.filteredRunewords = found;
  }
  // Note: no type name transformations; use the names as exported by the game data.
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchRunesChanged", _handleSearchRunesChanged_dec, Runewords);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedTypeChanged", _selectedTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedAmountChanged", _selectedAmountChanged_dec, Runewords);
__decorateElement(_init, 1, "handleExclusiveTypeChanged", _handleExclusiveTypeChanged_dec, Runewords);
__decorateElement(_init, 5, "search", _search_dec, Runewords);
__decorateElement(_init, 5, "searchRunes", _searchRunes_dec, Runewords);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Runewords);
Runewords = __decorateElement(_init, 0, "Runewords", _Runewords_decorators, Runewords);
__runInitializers(_init, 1, Runewords);
export {
  Runewords
};
