import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-DIUoZaLo.js";
import { g as getTypeChain, r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, a as getChainForTypeNameReadonly } from "./item-type-filters-CmW1RKqb.js";
import { t as toggleWeaponSort, g as getSortKeyFromDamageType, c as character_class_options, w as weaponSortOptions } from "./item-sorting-CN1-l_qa.js";
import { a as getWeaponPhysDamValue, b as getWeaponNonPhysDamValue, g as getDamageTypeString } from "./damage-types-BlYhXdWN.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { p as prependTypeResetOption, t as tokenizeSearch, i as isVanillaItem } from "./filter-helpers-C07hLFTd.js";
import { s as setsJson } from "./sets-BPM6FxId.js";
const name = "sets";
const template = `<template>
    <h3 class="text-lg type-text text-center my-4">
        <span class="rarity-text">[N]</span> = Normal <span class="rarity-text">[X]</span> = Exceptional <span
            class="rarity-text">[E]</span> = Elite
    </h3>
    <h3 class="type-text text-lg text-center mx-auto mb-4">
        <span class="rarity-text">\${sets.length}</span> Sets Found
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="Filter by character class, sets match as full set if one is found.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="ficlass" class="select-base peer" value.bind="selectedClass">
                                <option repeat.for="opt of classes" value.bind="opt.value">\${opt.label}</option>
                            </select>
                            <label for="ficlass" class="floating-label">Select Class</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ficlass">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Class filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="Filter by base item type, sets match as full set if one is found.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="itype" class="select-base peer" value.bind="selectedType">
                                <option repeat.for="opt of types"
                                        value.bind="opt.id">\${opt.label}
                                </option>
                            </select>
                            <label for="itype" class="floating-label">Select Item Type</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Item Type filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="Filter to a specific equipment for the selected type, disabled if one isn't selected.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="eqname" class="select-base peer" value.bind="selectedEquipmentName"
                                    disabled.bind="!selectedType">
                                <option repeat.for="opt of equipmentNames" value.bind="opt.value">\${opt.label}</option>
                            </select>
                            <label for="eqname" class="floating-label">Select Equipment</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="eqname">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Equipment filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-60"
                     data-help-text="Search across all fields, sets match as full set if one is found. Uses (space) as an 'AND' modifier. ex: Typing sorc skill mana will return items with only all 3 words.">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"
                                   placeholder=" "/>
                            <label for="inputsearch" class="floating-label">Search...</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Search</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35"
                     data-help-text="Filter toggle to hide Vanilla items. Applies to the entire set.">
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
                        <button type="button" class="m-info-button" aria-expanded="false"
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
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetfilters">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Reset Filters</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <!-- weapon-sort-area -->
    <div if.bind="isWeaponType">
        <div class="w-full m-auto px-5 py-5 pb-2 border-b border-gray-600">
            <h4 class="text-lg type-text text-center mb-2">Sort by Average Weapon Damage:</h4>
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div repeat.for="opt of weaponSortOptions" class="w-full lg:w-auto lg:min-w-45" data-help-text.bind="opt.help">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id.bind="opt.id" class="vanilla-button flex-row-reverse" type="button" click.trigger="toggleSort(opt.type)"
                                    aria-pressed.bind="weaponSortMode.includes(opt.type)">
                                <span class="mso \${weaponSortMode.includes(opt.type) ? 'set-text-light' : ''}">
                                    \${weaponSortMode === 'avg-' + opt.type + '-ascending' ? 'arrow_upward' : (weaponSortMode === 'avg-' + opt.type + '-descending' ? 'arrow_downward' : 'unknown_med')}
                                </span>
                                \${opt.label}
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for.bind="opt.id">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about \${opt.label} sorting</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Reset weapon sorting.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="resetsort" class="button-base" type="button" click.trigger="resetSort()">
                                Reset Sort
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetsort">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Reset Sort</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="set of sets">

            <div class="mb-1">
                <div class="text-xl set-text-light">
                    \${set.Name}
                </div>
                <div class="text-base rarity-text">
                    \${set.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}
                </div>
            </div>

            <div class="mb-1">
                <div class="partial-sets text-base set-text" repeat.for="partial of set.PartialProperties">
                    \${partial.PropertyString} (\${getItemCount(partial.Index)} Items)
                </div>
                <div class="partial-sets text-base set-text" repeat.for="full of set.FullProperties">
                    \${full.PropertyString} (Full Set)
                </div>
            </div>

            <div repeat.for="setItem of set.SetItems"
                 if.bind="!hideVanilla || (set.Vanilla || '').toUpperCase() !== 'Y'">

                <div class="mt-2 mb-1">
                    <div class="text-base set-text-light"
                         if.bind="!hideVanilla || (set.Vanilla || '').toUpperCase() !== 'Y'">
                        \${setItem.Name}
                    </div>
                    <div class="text-base rarity-text" if.bind="setItem.Rarity">
                        Rarity: \${setItem.Rarity}
                    </div>
                </div>

                <div class="mb-1">
                    <div class="text-base type-text" if.bind="setItem.Equipment.Name">
                        \${setItem.Equipment.Name}
                    </div>
                    <div class="text-base type-text" if.bind="setItem.Equipment.ArmorString">
                        Defense: \${setItem.Equipment.ArmorString}
                    </div>
                    <div class="text-base type-text"
                         if.bind="setItem.Equipment.Block !== null && setItem.Equipment.Block !== undefined && setItem.Equipment.Block > 0">
                        Block: \${setItem.Equipment.Block}%
                    </div>
                    <div class="text-base type-text flex items-center justify-center gap-1" if.bind="setItem.Equipment.DamageTypes"
                         repeat.for="damage of setItem.Equipment.DamageTypes"
                         click.trigger="getSortKeyFromDamageType(damage.Type) ? toggleSort(getSortKeyFromDamageType(damage.Type)) : null"
                         class.bind="getSortKeyFromDamageType(damage.Type) ? 'clickable' : ''">
                        <span>\${getDamageTypeString(damage.Type)} \${damage.DamageString}<span class="set-text" if.bind="damage.AverageDamage"> <\${damage.AverageDamage}></span></span>
                        <span class="mso set-text-light" if.bind="getSortKeyFromDamageType(damage.Type) && weaponSortMode.includes(getSortKeyFromDamageType(damage.Type))">
                            \${weaponSortMode.includes('ascending') ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                    </div>
                    <div class="text-base type-text" if.bind="setItem.Equipment.Durability > 0">
                        Durability: \${setItem.Equipment.Durability}
                    </div>
                </div>

                <div class="mb-1">
                    <div class="text-base requirement-text"
                         if.bind="setItem.Equipment.RequiredClass && setItem.Equipment.RequiredClass.length">
                        (\${setItem.Equipment.RequiredClass} Only)
                    </div>
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredDexterity && setItem.Equipment.RequiredDexterity !== '0' && setItem.Equipment.RequiredDexterity !== 0">
                        \${setItem.Equipment.RequiredDexterity} Dexterity Required
                    </div>
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredStrength && setItem.Equipment.RequiredStrength !== '0' && setItem.Equipment.RequiredStrength !== 0">
                        \${setItem.Equipment.RequiredStrength} Strength Required
                    </div>
                    <div class="text-base requirement-text">
                        Level \${setItem.RequiredLevel > 0? setItem.RequiredLevel: 1} Required
                    </div>
                </div>

                <div class="text-base prop-text" repeat.for="property of setItem.Properties | sortProperties">
                    <div if.bind="property.PropertyString">
                        <span>\${property.PropertyString}</span>
                    </div>
                    <div if.bind="property['group-properties']">
                        <div repeat.for="[groupName, pool] of property['group-properties'] | entries">
                            <div if.bind="property.pickmode == 0 || (pool[0] && pool[0].PickMode == 0)">
                                <div repeat.for="affix of pool" if.bind="affix.PropertyString">
                                    \${affix.PropertyString}
                                </div>
                            </div>
                            <div if.bind="property.pickmode != 0 && (!pool[0] || pool[0].PickMode != 0)" class="border px-2 border-gray-600 rounded m-2">
                                <div class="set-text text-center p-1 border-b border-gray-600">
                                    \${formatGroupName(groupName)}
                                </div>
                                <div repeat.for="affixData of pool" if.bind="affixData.PropertyString" class="flex justify-between p-1 border-b border-gray-700 last:border-0">
                                    <span class="prop-text">\${affixData | chance:pool}%</span>
                                    <span class="text-right">\${affixData.PropertyString}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-base set-text" repeat.for="setProperty of setItem.SetPropertiesString">
                    \${setProperty}
                </div>

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
var _handleEquipmentNameChanged_dec, _handleTypeChanged_dec, _handleFilterChanged_dec, _handleSearchChanged_dec, _weaponSortMode_dec, _hideVanilla_dec, _selectedEquipmentName_dec, _selectedType_dec, _selectedClass_dec, _search_dec, _Sets_decorators, _init;
_Sets_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedClass_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _hideVanilla_dec = [bindable], _weaponSortMode_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _handleFilterChanged_dec = [watch("selectedClass"), watch("hideVanilla"), watch("weaponSortMode")], _handleTypeChanged_dec = [watch("selectedType")], _handleEquipmentNameChanged_dec = [watch("selectedEquipmentName")];
class Sets {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "allSets", setsJson);
    __publicField(this, "sets", []);
    __publicField(this, "_searchStrings", /* @__PURE__ */ new Map());
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedType", __runInitializers(_init, 16, this, "")), __runInitializers(_init, 19, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 24, this, false)), __runInitializers(_init, 27, this);
    __publicField(this, "weaponSortMode", __runInitializers(_init, 28, this, "none")), __runInitializers(_init, 31, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "_debouncedUpdateUrl");
    __publicField(this, "equipmentNames", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "classes", character_class_options);
    __publicField(this, "weaponSortOptions", weaponSortOptions);
    __publicField(this, "getDamageTypeString", getDamageTypeString);
  }
  // Check if selected type is a weapon type
  get isWeaponType() {
    if (!this.selectedType) return false;
    const opt = this.types.find((o) => o.id === this.selectedType);
    if (!opt || !opt.value) return false;
    if (opt.value.includes("Weapon")) return true;
    return opt.value.some((typeName) => {
      const chain = getTypeChain(typeName);
      return chain.includes("Weapon");
    });
  }
  // Build options and hydrate from URL BEFORE controls render
  binding() {
    const urlParams = new URLSearchParams(window.location.search);
    this.allSets.forEach((s) => {
      this._searchStrings.set(s, this.buildSearchableStringForSet(s));
    });
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam)) {
      this.search = searchParam;
    }
    const classParam = urlParams.get("selectedClass");
    if (classParam && !isBlankOrInvalid(classParam)) {
      this.selectedClass = classParam;
    }
    const hv = urlParams.get("hideVanilla");
    if (hv === "true" || hv === "1") this.hideVanilla = true;
    try {
      const present = /* @__PURE__ */ new Set();
      for (const set of setsJson || []) {
        for (const item of set?.SetItems || []) {
          const base = resolveBaseTypeName(item?.Type ?? "");
          if (base) present.add(base);
        }
      }
      this.types = buildOptionsForPresentTypes(type_filtering_options, present);
      this.types = prependTypeResetOption(this.types);
    } catch {
    }
    const typeParam = urlParams.get("type");
    if (typeParam && !isBlankOrInvalid(typeParam)) {
      const opt = this.types.find((o) => o.id === typeParam);
      this.selectedType = opt ? opt.id : "";
    }
    const eqParam = urlParams.get("equipment");
    if (eqParam && !isBlankOrInvalid(eqParam))
      this.selectedEquipmentName = eqParam;
  }
  attached() {
    this._debouncedSearchItem = debounce(() => this.updateList(), 350);
    this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);
    if (this.selectedType) {
      this.equipmentNames = this.getSetEquipmentNames();
    }
    this.updateList();
    this.updateUrl();
  }
  detached() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem.cancel();
    }
    if (this._debouncedUpdateUrl) {
      this._debouncedUpdateUrl.cancel();
    }
  }
  // Types provided via shared preset (this.types)
  // Push current filters to URL
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      selectedClass: this.selectedClass,
      type: this.selectedType,
      equipment: this.selectedEquipmentName,
      hideVanilla: this.hideVanilla
    }, false);
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleFilterChanged() {
    this.updateList();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleTypeChanged() {
    this.equipmentNames = this.getSetEquipmentNames();
    this.selectedEquipmentName = void 0;
    if (!this.isWeaponType) this.weaponSortMode = "none";
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleEquipmentNameChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
  }
  updateList() {
    try {
      const searchTokens = tokenizeSearch(this.search);
      const classText = this.selectedClass?.toLowerCase();
      let allowedTypeSet;
      if (this.selectedType) {
        const opt = this.types.find((o) => o.id === this.selectedType);
        if (opt && opt.value) allowedTypeSet = new Set(opt.value);
      }
      if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
        this.equipmentNames = this.getSetEquipmentNames();
      }
      this.sets = this.allSets.filter((set) => {
        if (this.hideVanilla && isVanillaItem(set?.Vanilla)) return false;
        if (allowedTypeSet) {
          const hasMatch = (set.SetItems ?? []).some((si) => {
            const base = getChainForTypeNameReadonly(si?.Type ?? "")[0] || (si?.Type ?? "");
            return allowedTypeSet.has(base);
          });
          if (!hasMatch) return false;
        }
        if (this.selectedEquipmentName) {
          const hasMatch = (set.SetItems ?? []).some(
            (si) => si.Equipment?.Name === this.selectedEquipmentName
          );
          if (!hasMatch) return false;
        }
        const hay = this._searchStrings.get(set) || "";
        if (classText && !hay.includes(classText)) return false;
        if (searchTokens.length > 0) {
          if (!searchTokens.some((group) => group.every((t) => hay.includes(t)))) {
            return false;
          }
        }
        return true;
      });
      if (this.isWeaponType && this.weaponSortMode !== "none") {
        const isAsc = this.weaponSortMode.includes("ascending");
        const mode = this.weaponSortMode;
        this.sets = this.sets.slice().sort((a, b) => {
          const getBestDam = (set) => {
            let maxV = 0;
            for (const item of set.SetItems || []) {
              let v = 0;
              if (mode.includes("1h-phys"))
                v = getWeaponPhysDamValue(item, [3, 0]);
              else if (mode.includes("2h-phys"))
                v = getWeaponPhysDamValue(item, 1);
              else if (mode.includes("throw-phys"))
                v = getWeaponPhysDamValue(item, 2);
              else if (mode.includes("non-phys"))
                v = getWeaponNonPhysDamValue(item);
              if (v > maxV) maxV = v;
            }
            return maxV;
          };
          const vA = getBestDam(a);
          const vB = getBestDam(b);
          if (vA === 0 && vB !== 0) return 1;
          if (vA !== 0 && vB === 0) return -1;
          return isAsc ? vA - vB : vB - vA;
        });
      }
    } catch (e) {
      console.error(e);
      this.sets = this.allSets;
    }
  }
  buildSearchableStringForSet(set) {
    const parts = [];
    if (set.Name) parts.push(String(set.Name));
    const allProps = set.AllProperties ?? [
      ...set.FullProperties || [],
      ...set.PartialProperties || []
    ];
    for (const p of allProps || []) {
      if (p.PropertyString) parts.push(p.PropertyString);
      if (p["group-properties"]) {
        Object.values(p["group-properties"]).forEach((pool) => {
          pool.forEach((affix) => {
            if (affix.PropertyString) parts.push(affix.PropertyString);
          });
        });
      }
    }
    for (const si of set.SetItems ?? []) {
      parts.push(String(si?.Name || ""));
      parts.push(String(si?.Equipment?.Name || ""));
      for (const p of si?.Properties || []) {
        if (p.PropertyString) parts.push(p.PropertyString);
        if (p["group-properties"]) {
          Object.values(p["group-properties"]).forEach((pool) => {
            pool.forEach((affix) => {
              if (affix.PropertyString) parts.push(affix.PropertyString);
            });
          });
        }
      }
      for (const s of si?.SetPropertiesString || []) {
        if (s) parts.push(String(s));
      }
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  }
  formatGroupName(name2) {
    return name2.replace(/-/g, " ").replace(/([a-z])([0-9])/g, "$1 $2");
  }
  // Partial set bonus count display by index 0-1 = 2, 2-3 = 3, 4-5 = 4, 6+ = 5
  getItemCount(indexPassed) {
    if (indexPassed < 2) return 2;
    if (indexPassed < 4) return 3;
    if (indexPassed < 6) return 4;
    return 5;
  }
  // Build equipment names options for the selected type
  getSetEquipmentNames() {
    const names = /* @__PURE__ */ new Set();
    const allowed = (() => {
      if (!this.selectedType) return null;
      const opt = this.types.find((o) => o.id === this.selectedType);
      return opt && opt.value ? new Set(opt.value) : null;
    })();
    for (const set of setsJson || []) {
      for (const si of set.SetItems ?? []) {
        if (allowed) {
          const base = getChainForTypeNameReadonly(si?.Type ?? "")[0] || (si?.Type ?? "");
          if (!allowed.has(base)) continue;
        }
        const name2 = si.Equipment?.Name;
        if (name2) names.add(name2);
      }
    }
    const options = [
      { value: "", label: "-" }
    ];
    Array.from(names).sort().forEach((n) => options.push({ value: n, label: n }));
    return options;
  }
  // Reset all filters to defaults and refresh
  resetFilters() {
    this.search = "";
    this.selectedClass = void 0;
    this.selectedType = "";
    this.selectedEquipmentName = void 0;
    this.hideVanilla = false;
    this.equipmentNames = [{ value: "", label: "-" }];
    this.weaponSortMode = "none";
    this.updateList();
    this.updateUrl();
  }
  // Reset only the weapon sorting mode
  resetSort() {
    this.weaponSortMode = "none";
  }
  toggleSort(type) {
    this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
  }
  getSortKeyFromDamageType(type) {
    return getSortKeyFromDamageType(type);
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Sets);
__decorateElement(_init, 1, "handleFilterChanged", _handleFilterChanged_dec, Sets);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Sets);
__decorateElement(_init, 1, "handleEquipmentNameChanged", _handleEquipmentNameChanged_dec, Sets);
__decorateElement(_init, 5, "search", _search_dec, Sets);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Sets);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Sets);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Sets);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Sets);
__decorateElement(_init, 5, "weaponSortMode", _weaponSortMode_dec, Sets);
Sets = __decorateElement(_init, 0, "Sets", _Sets_decorators, Sets);
__runInitializers(_init, 1, Sets);
export {
  Sets
};
