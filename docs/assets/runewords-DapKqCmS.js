import { C as CustomElement, i as isBlankOrInvalid, t, s as syncParamsToUrl, f as format, w as watch, c as customElement, b as bindable } from "./index-CTTJeB_J.js";
import { t as tagIds, r as resolveBaseTypeName, n as normalizeClassItemCode, b as buildOptionsForPresentTypes, p as prependTypeResetOption, a as tokenizeSearch, A as ANCESTOR_ONLY_WHEN_EXACT_OFF, d as getChainForTypeNameReadonly, m as matchesTokenGroups, c as type_filtering_options, I as IncrementalRenderer } from "./incremental-render-Cch9chka.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
const name = "runewords";
const template = `<template>
    <h3 class="text-lg type-text text-center mx-auto my-4">
        <span class="rarity-text">\${filteredRunewords.length}</span> \${'found_runewords_suffix' | t}
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-40" data-help-text="\${'help_rune_count_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="runecount" class="select-base peer" value.bind="selectedAmount">
                                <option repeat.for="opt of amounts" if.bind="opt.value === ''" value="">\${opt.label | t}</option>
                                <option repeat.for="opt of amounts" if.bind="opt.value !== ''" model.bind="opt.value">\${opt.label | t:opt.value}</option>
                            </select>
                            <label for="runecount" class="floating-label">\${'filter_rune_count' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="runecount">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_rune_count'}</span>
                        </button>
                    </div>
                </div>

                <searchable-select id="itype"
                                   class="w-full lg:w-auto lg:min-w-80"
                                   data-help-text="\${'help_item_type_filter' | t}"
                                   value.bind="selectedType"
                                   options.bind="types"
                                   label="\${'filter_select_type' | t}"
                                   exact.bind="true">
                    <div au-slot="after" class="flex items-stretch">
                        <button type="button"
                                class="exact-button"
                                aria-pressed.bind="exclusiveType"
                                click.trigger="exclusiveType = !exclusiveType">
                            <span class="exact-indicator"></span>
                            \${'filter_exact' | t}
                        </button>
                        <!-- Mobile-only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false" data-info-for="itype">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_type'}</span>
                        </button>
                    </div>
                </searchable-select>

                <div class="w-full lg:w-60"
                     data-help-text="\${'help_search' | t}">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"
                                   placeholder=" "/>
                            <label for="inputsearch" class="floating-label">\${'filter_search_placeholder' | t}</label>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_search_placeholder'}</span>
                        </button>
                    </div>
                </div>

                <multi-select id="runesearch"
                              class="w-full lg:w-60"
                              data-help-text="\${'help_runes_only_filter' | t}"
                              values.bind="selectedRuneKeys"
                              options.bind="runeOptions"
                              label="\${'filter_runes_only_placeholder' | t}">
                    <div au-slot="after" class="flex items-stretch">
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="runesearch">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_runes_only_placeholder'}</span>
                        </button>
                    </div>
                </multi-select>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="\${'help_hide_vanilla' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button
                                    id="hidevanillabutton"
                                    type="button"
                                    class="vanilla-button flex-row-reverse"
                                    aria-pressed.bind="hideVanilla"
                                    click.trigger="hideVanilla = !hideVanilla">
                                <span class="vanilla-indicator"></span>
                                \${'filter_hide_vanilla' | t}
                            </button>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="hidevanillabutton">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_hide_vanilla'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="\${'help_reset_filters' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="resetfilters" class="button-base" type="button" click.trigger="resetFilters()">
                                \${'filter_reset' | t}
                            </button>
                        </div>
                        <!-- Mobile only info button -->
                        <button type="button"
                                class="m-info-button"
                                aria-expanded="false"
                                data-info-for="resetfilters">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_reset'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="runeword of visibleRunewords; key.bind: runeword.__rid">

            <div class="mb-1">
                <div class="text-xl unique-text">
                    \${runeword.Index | t}
                </div>
                <div class="text-base rarity-text">
                    \${runeword.Vanilla === 'Y' ? 'label_vanilla' : 'label_mod' | t}
                </div>
            </div>

            <div class="text-base type-text mb-1">
                <span repeat.for="typeInfo of runeword.Types">
                        \${typeInfo.Index | t} \${ ( $index + 1 !== runeword.Types.length ? 'label_or' : '' ) | t }
                    </span>
            </div>

            <div class="text-base type-text">
                <span repeat.for="rune of runeword.Runes">
                    \${rune.NameKey | t} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}
                </span>
            </div>

            <div class="text-base requirement-text my-1">
                \${'strRequiredLevel' | t: runeword.RequiredLevel || 1}
            </div>

            <keyed-lines class="text-base prop-text" lines.bind="runeword.Lines"></keyed-lines>

        </div>
        <div ref="sentinelEl" class="h-1"></div>
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
var _handleHideVanillaChanged_dec, _handleExclusiveTypeChanged_dec, _handleAmountChanged_dec, _handleTypeChanged_dec, _handleSearchChanged_dec, _handleSelectedRuneKeysChanged_dec, _selectedAmount_dec, _selectedType_dec, _hideVanilla_dec, _exclusiveType_dec, _selectedRuneKeys_dec, _search_dec, _Runewords_decorators, _init;
_Runewords_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedRuneKeys_dec = [bindable], _exclusiveType_dec = [bindable], _hideVanilla_dec = [bindable], _selectedType_dec = [bindable], _selectedAmount_dec = [bindable], _handleSelectedRuneKeysChanged_dec = [watch("selectedRuneKeys")], _handleSearchChanged_dec = [watch("search")], _handleTypeChanged_dec = [watch("selectedType")], _handleAmountChanged_dec = [watch("selectedAmount")], _handleExclusiveTypeChanged_dec = [watch("exclusiveType")], _handleHideVanillaChanged_dec = [watch("hideVanilla")];
class Runewords {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "allRunewords", []);
    __publicField(this, "filteredRunewords", []);
    __publicField(this, "visibleRunewords", []);
    __publicField(this, "sentinelEl");
    __publicField(this, "_inc", new IncrementalRenderer(60));
    __publicField(this, "_searchStrings", /* @__PURE__ */ new Map());
    __publicField(this, "search", __runInitializers(_init, 8, this, "")), __runInitializers(_init, 11, this);
    __publicField(this, "selectedRuneKeys", __runInitializers(_init, 12, this, [])), __runInitializers(_init, 15, this);
    __publicField(this, "exclusiveType", __runInitializers(_init, 16, this, false)), __runInitializers(_init, 19, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 20, this, false)), __runInitializers(_init, 23, this);
    __publicField(this, "selectedType", __runInitializers(_init, 24, this, "")), __runInitializers(_init, 27, this);
    __publicField(this, "selectedAmount", __runInitializers(_init, 28, this, "")), __runInitializers(_init, 31, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "_debouncedUpdateUrl");
    __publicField(this, "runeOptions", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "amounts", [
      { value: "", label: "-" },
      { value: 2, label: "label_runes_count" },
      { value: 3, label: "label_runes_count" },
      { value: 4, label: "label_runes_count" },
      { value: 5, label: "label_runes_count" },
      { value: 6, label: "label_runes_count" }
    ]);
  }
  // Build options and hydrate from URL BEFORE controls render
  async binding() {
    try {
      const resp = await fetch("/data/keyed/runewords.json");
      this.allRunewords = await resp.json();
    } catch (e) {
      console.error("Failed to load runewords:", e);
      this.allRunewords = [];
    }
    tagIds(this.allRunewords);
    this.allRunewords.forEach((rw) => {
      this._searchStrings.set(rw, this.buildSearchableStringForRuneword(rw));
    });
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam)) {
      this.search = searchParam;
    }
    const hv = urlParams.get("hideVanilla");
    if (hv === "true" || hv === "1") this.hideVanilla = true;
    const present = /* @__PURE__ */ new Set();
    try {
      for (const rw of this.allRunewords || []) {
        const types = Array.isArray(rw?.Types) ? rw.Types : [];
        for (const ty of types) {
          const base = resolveBaseTypeName(normalizeClassItemCode(ty?.Index ?? ""));
          if (base) present.add(base);
        }
      }
    } catch {
    }
    this.types = buildOptionsForPresentTypes(type_filtering_options, present, false).map((opt) => ({
      ...opt,
      label: t(opt.label)
    }));
    this.types = prependTypeResetOption(this.types);
    const runeKeys = /* @__PURE__ */ new Set();
    for (const rw of this.allRunewords || []) {
      const runes = Array.isArray(rw?.Runes) ? rw.Runes : [];
      for (const r of runes) {
        if (r?.NameKey) runeKeys.add(r.NameKey);
      }
    }
    this.runeOptions = Array.from(runeKeys).map((key) => {
      const m = /^r(\d+)$/i.exec(key);
      const n = m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
      return { id: key, label: t(key), n };
    }).sort((a, b) => a.n - b.n || a.id.localeCompare(b.id));
    const runesParam = urlParams.get("runes");
    if (runesParam && !isBlankOrInvalid(runesParam)) {
      const validKeys = new Set(this.runeOptions.map((o) => o.id));
      this.selectedRuneKeys = runesParam.split(",").map((s) => s.trim()).filter((s) => validKeys.has(s));
    }
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
    this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);
    this.updateList();
    this.updateUrl();
    this._inc.attach(this.sentinelEl, () => this.loadMore());
  }
  detached() {
    this._inc.detach();
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem.cancel();
    }
    if (this._debouncedUpdateUrl) {
      this._debouncedUpdateUrl.cancel();
    }
  }
  applyVisible() {
    this._inc.reset();
    this.visibleRunewords = this._inc.visible(this.filteredRunewords);
  }
  loadMore() {
    if (this._inc.grow(this.filteredRunewords)) {
      this.visibleRunewords = this._inc.visible(this.filteredRunewords);
    }
  }
  // Push current filters to URL
  updateUrl() {
    const runesParam = (this.selectedRuneKeys || []).join(",");
    syncParamsToUrl({
      search: this.search,
      runes: runesParam,
      type: this.selectedType,
      sockets: this.selectedAmount,
      exact: this.exclusiveType,
      hideVanilla: this.hideVanilla
    }, false);
  }
  handleSelectedRuneKeysChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleTypeChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleAmountChanged() {
    if (typeof this.selectedAmount !== "number" && this.selectedAmount !== "") {
      const v = Number(this.selectedAmount);
      if (Number.isFinite(v) && v >= 2 && v <= 6) {
        this.selectedAmount = v;
      } else {
        this.selectedAmount = "";
      }
    }
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    if (this._debouncedUpdateUrl) {
      this._debouncedUpdateUrl();
    }
  }
  handleExclusiveTypeChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleHideVanillaChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  formatGroupName(name2) {
    return name2.replace(/-/g, " ").replace(/([a-z])([0-9])/g, "$1 $2");
  }
  updateList() {
    const searchTokens = tokenizeSearch(this.search);
    let selectedSet;
    let selectedBase;
    if (this.selectedType) {
      const opt = this.types.find((o) => o.id === this.selectedType);
      if (opt && opt.value && opt.value.length > 0) {
        selectedBase = opt.value[0];
        if (!this.exclusiveType && opt.id && ANCESTOR_ONLY_WHEN_EXACT_OFF.includes(opt.id)) {
          selectedSet = new Set(getChainForTypeNameReadonly(selectedBase));
        } else {
          selectedSet = new Set(opt.value);
        }
      }
    }
    const selectedRunes = Array.isArray(this.selectedRuneKeys) ? this.selectedRuneKeys.filter(Boolean) : [];
    this.filteredRunewords = this.allRunewords.filter((rw) => {
      if (this.hideVanilla && String(rw?.Vanilla || "").toUpperCase() === "Y") {
        return false;
      }
      if (this.selectedAmount && (rw.Runes?.length ?? 0) !== this.selectedAmount) {
        return false;
      }
      if (selectedBase) {
        const types = Array.isArray(rw.Types) ? rw.Types : [];
        let hasTypeMatch = false;
        for (let i = 0; i < types.length; i++) {
          const raw = types[i]?.Index != null ? normalizeClassItemCode(String(types[i].Index)) : "";
          const chain = getChainForTypeNameReadonly(raw);
          if (!chain || chain.length === 0) continue;
          const itemBase = chain[0];
          if (this.exclusiveType) {
            if (itemBase === selectedBase) {
              hasTypeMatch = true;
              break;
            }
          } else if (selectedSet && selectedSet.has(itemBase)) {
            hasTypeMatch = true;
            break;
          }
        }
        if (!hasTypeMatch) return false;
      }
      if (searchTokens.length > 0) {
        const hay = this._searchStrings.get(rw) || "";
        if (!matchesTokenGroups(hay, searchTokens)) {
          return false;
        }
      }
      if (selectedRunes.length > 0) {
        const runewordRuneKeys = (rw.Runes ?? []).map((rune) => rune.NameKey);
        const hasAll = selectedRunes.every((k) => runewordRuneKeys.includes(k));
        if (!hasAll) return false;
      }
      return true;
    });
    this.applyVisible();
  }
  buildSearchableStringForRuneword(rw) {
    const parts = [
      t(rw.Index)
    ];
    if (Array.isArray(rw.Lines)) {
      for (const l of rw.Lines) {
        parts.push(format(l));
      }
    }
    if (Array.isArray(rw.Types)) {
      for (const typeInfo of rw.Types) {
        const index = typeInfo?.Index != null ? String(typeInfo.Index) : "";
        parts.push(index);
        const chain = getChainForTypeNameReadonly(index);
        if (chain) {
          parts.push(...chain);
          parts.push(...chain.map((c) => t(c)));
        }
      }
    }
    if (Array.isArray(rw.Runes)) {
      for (const rune of rw.Runes) {
        parts.push(t(rune.NameKey));
      }
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  }
  // Reset all filters and refresh URL/list
  resetFilters() {
    this.search = "";
    this.selectedRuneKeys = [];
    this.selectedType = "";
    this.selectedAmount = "";
    this.exclusiveType = false;
    this.hideVanilla = false;
    this.updateList();
    this.updateUrl();
  }
  // Note: no type name transformations; use the names as exported by the game data.
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSelectedRuneKeysChanged", _handleSelectedRuneKeysChanged_dec, Runewords);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Runewords);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "handleAmountChanged", _handleAmountChanged_dec, Runewords);
__decorateElement(_init, 1, "handleExclusiveTypeChanged", _handleExclusiveTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "handleHideVanillaChanged", _handleHideVanillaChanged_dec, Runewords);
__decorateElement(_init, 5, "search", _search_dec, Runewords);
__decorateElement(_init, 5, "selectedRuneKeys", _selectedRuneKeys_dec, Runewords);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Runewords);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Runewords);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Runewords);
__decorateElement(_init, 5, "selectedAmount", _selectedAmount_dec, Runewords);
Runewords = __decorateElement(_init, 0, "Runewords", _Runewords_decorators, Runewords);
__runInitializers(_init, 1, Runewords);
export {
  Runewords
};
