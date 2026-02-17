import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-BGwzg-wY.js";
import { g as getChainForTypeNameReadonly, t as type_filtering_options, A as ANCESTOR_ONLY_WHEN_EXACT_OFF } from "./item-type-filters-D9g9GJuK.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { p as prependTypeResetOption, t as tokenizeSearch } from "./filter-helpers-C07hLFTd.js";
import { r as runewordsJson } from "./runewords-ia0QhkoC.js";
const name = "runewords";
const template = `<template>
    <h3 class="text-lg type-text text-center mx-auto my-4">
        <span class="rarity-text">\${filteredRunewords.length}</span> Runewords Found
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-40"
                     data-help-text="Filter by number of runes required. This amount is exact.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="runecount" class="select-base peer" value.bind="selectedAmount">
                                <option repeat.for="opt of amounts" if.bind="opt.value === ''" value="">\${opt.label}
                                </option>
                                <option repeat.for="opt of amounts" if.bind="opt.value !== ''" model.bind="opt.value">
                                    \${opt.label}
                                </option>
                            </select>
                            <label for="runecount" class="floating-label">Rune Count</label>
                        </div>
                        <!-- Mobile-only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false" data-info-for="runecount"
                        >
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Item Type filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-70 flex flex-nowrap items-stretch"
                     data-help-text="Filter by base item type. Toggle ‘Exact’ to remove variants."
                >
                    <div class="relative flex-1">
                        <select id="itype" class="select-base-exact peer" value.bind="selectedType">
                            <option repeat.for="opt of types"
                                    value.bind="opt.id">\${opt.label}
                            </option>
                        </select>
                        <label for="itype" class="floating-label">Select Item Type</label>
                    </div>
                    <div class="flex items-center">
                        <button
                                type="button"
                                class="exact-button"
                                aria-pressed.bind="exclusiveType"
                                click.trigger="exclusiveType = !exclusiveType">
                            <span class="exact-indicator"></span>
                            Exact
                        </button>
                    </div>
                    <!-- Mobile-only info button -->
                    <button type="button"
                            class="m-info-button"
                            aria-expanded="false" data-info-for="itype"
                    >
                        <span class="mso">info</span>
                        <span class="sr-only">More info about Item Type filter</span>
                    </button>
                </div>

                <div class="w-full lg:w-60"
                     data-help-text="Search across all fields. Attempts exact match. Seperate with '+' for AND match. Seperate with ',' or '|' for OR match. ex. 'fire skill damage+enemy fire' finds items with only both tokens. 'fire skill damage,enemy fire' finds items with either token.">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"
                                   placeholder=" "/>
                            <label for="inputsearch" class="floating-label">Search...</label>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about the Hide Vanilla button</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-60"
                     data-help-text="Search for specific Runes. Uses (space) and + as AND. Uses , and | as OR. ex: El Eld|Hel Zod returns only Breath of the Dying and Starlight.">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="runesearch" type="text" class="select-base peer pr-12 w-full"
                                   value.bind="searchRunes"
                                   placeholder=" "/>
                            <label for="runesearch" class="floating-label">Runes Only...</label>
                        </div>

                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="runesearch">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Rune Only search</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Filter toggle to hide Vanilla items.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button
                                    id="hidevanillabutton"
                                    type="button"
                                    class="vanilla-button flex-row-reverse"
                                    aria-pressed.bind="hideVanilla"
                                    click.trigger="hideVanilla = !hideVanilla">
                                <span class="vanilla-indicator"></span>
                                Hide Vanilla
                            </button>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="hidevanillabutton">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about the Hide Vanilla button</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Reset all filters to default.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="resetfilters" class="button-base" type="button" click.trigger="resetFilters()">
                                Reset Filters
                            </button>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="resetfilters">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about the Hide Vanilla button</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="runeword of filteredRunewords">

            <div class="mb-1">
                <div class="text-xl unique-text">
                    \${runeword.Name}
                </div>
                <div class="text-base rarity-text">
                    \${runeword.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}
                </div>
            </div>

            <div class="text-base type-text mb-1"><span repeat.for="type of runeword.Types">
                        \${type.Name} \${$index + 1 !== runeword.Types.length ? ' or ' : ''}
                    </span></div>

            <div class="text-base type-text"><span repeat.for="rune of runeword.Runes">
                        \${rune.Name | runeName} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}
                    </span></div>

            <div class="text-base requirement-text my-1">
                Required Level: \${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1}
            </div>

            <div class="text-base prop-text" repeat.for="property of runeword.Properties">
                \${property.PropertyString}
            </div>

        </div>
    </div>
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
    __publicField(this, "selectedType", "");
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
    const presentExplicitBases = /* @__PURE__ */ new Set();
    try {
      for (const rw of this.runewords || []) {
        const types = Array.isArray(rw?.Types) ? rw.Types : [];
        for (const t of types) {
          const chain = getChainForTypeNameReadonly(t?.Name ?? "");
          const base = chain && chain.length ? chain[0] : "";
          if (base) presentExplicitBases.add(base);
        }
      }
    } catch {
    }
    this.types = type_filtering_options.filter((opt) => {
      if (!opt.value || opt.value.length === 0) return true;
      const base = opt.value[0];
      if (opt.id === "any-armor" || opt.id === "any-weapon" || opt.id === "melee-weapon" || opt.id === "missile-weapon" || opt.id === "any-helm" || opt.id === "any-shield") {
        return opt.value.some((v) => presentExplicitBases.has(v));
      }
      return presentExplicitBases.has(base);
    });
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
      const opt = this.types.find((o) => o.id === typeParam);
      this.selectedType = opt ? opt.id : "";
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
    this._debouncedSearchItem = debounce(() => this.updateList(), 350);
    this.updateList();
    this.updateUrl();
  }
  // Push current filters to URL
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      runes: this.searchRunes,
      type: this.selectedType,
      sockets: this.selectedAmount,
      exact: this.exclusiveType,
      hideVanilla: this.hideVanilla
    }, false);
  }
  handleSearchRunesChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  selectedTypeChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
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
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  handleHideVanillaChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  normalizeRuneName(name2) {
    return name2.replace(/ rune$/i, "").trim().toLowerCase();
  }
  updateList() {
    let filteringRunewords = this.runewords;
    if (this.selectedType) {
      const opt = this.types.find((o) => o.id === this.selectedType);
      if (opt && opt.value && opt.value.length > 0) {
        const selectedBase = opt.value[0];
        let selectedSet;
        if (!this.exclusiveType && opt.id && ANCESTOR_ONLY_WHEN_EXACT_OFF.includes(opt.id)) {
          selectedSet = new Set(getChainForTypeNameReadonly(selectedBase));
        } else {
          selectedSet = new Set(opt.value);
        }
        filteringRunewords = filteringRunewords.filter((rw) => {
          const types = Array.isArray(rw.Types) ? rw.Types : [];
          for (let i = 0; i < types.length; i++) {
            const raw = types[i]?.Name != null ? String(types[i].Name) : "";
            const chain = getChainForTypeNameReadonly(raw);
            if (!chain || chain.length === 0) continue;
            const itemBase = chain[0];
            if (this.exclusiveType) {
              if (itemBase === selectedBase) return true;
            } else {
              if (selectedSet.has(itemBase)) return true;
            }
          }
          return false;
        });
      }
    }
    if (this.selectedAmount) {
      filteringRunewords = filteringRunewords.filter(
        (x) => (x.Runes?.length ?? 0) === this.selectedAmount
      );
    }
    let found = filteringRunewords;
    const searchTokens = tokenizeSearch(this.search);
    if (searchTokens.length) {
      found = found.filter((runeword) => {
        const hay = [
          String(runeword.Name || ""),
          ...(runeword.Properties || []).map(
            (p) => String(p?.PropertyString || "")
          ),
          ...(runeword.Types || []).map(
            (t) => String(t?.Name || "")
          )
        ].filter(Boolean).join(" ").toLowerCase();
        return searchTokens.some(
          (group) => group.every((t) => hay.includes(t))
        );
      });
    }
    if (this.searchRunes) {
      const normalized = (this.searchRunes || "").trim().toLowerCase().replace(/\s*[,|]\s*/g, "|").replace(/\s*\+\s*/g, " ").replace(/\s+/g, " ");
      const groups = normalized.split(" ").map(
        (group) => group.split("|").map((tok) => this.normalizeRuneName(tok)).filter(Boolean)
      ).filter((g) => g.length > 0);
      if (groups.length) {
        found = found.filter((runeword) => {
          const runewordRuneNames = (runeword.Runes ?? []).map(
            (rune) => this.normalizeRuneName(String(rune.Name))
          );
          return groups.every(
            (orGroup) => orGroup.some((token) => runewordRuneNames.includes(token))
          );
        });
      }
    }
    if (this.hideVanilla) {
      found = found.filter(
        (rw) => String(rw?.Vanilla || "").toUpperCase() !== "Y"
      );
    }
    this.filteredRunewords = found;
  }
  // Reset all filters and refresh URL/list
  resetFilters() {
    this.search = "";
    this.searchRunes = "";
    this.selectedType = "";
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
