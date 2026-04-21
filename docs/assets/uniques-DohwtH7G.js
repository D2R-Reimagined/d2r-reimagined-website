import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-Cxsh18tM.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, g as getTypeChain, a as getChainForTypeNameReadonly } from "./item-type-filters-D1_j0GR_.js";
import { p as passesHandFilter, s as sortItemsByWeaponDamage, t as toggleWeaponSort, g as getSortKeyFromDamageType, c as character_class_options, w as weaponSortOptions, h as handFilterOptions } from "./item-sorting-Biaf6mJs.js";
import { g as getDamageTypeString } from "./damage-types-BlYhXdWN.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { p as prependTypeResetOption, t as tokenizeSearch, i as isVanillaItem, m as matchesTokenGroups } from "./filter-helpers-DL_Ti2wh.js";
import { u as uniquesJson } from "./uniques-BHjt2FVf.js";
const name = "uniques";
const template = `<template>
    <h3 class="text-lg type-text text-center my-4">
        <span class="rarity-text">[N]</span> = Normal <span class="rarity-text">[X]</span> = Exceptional <span
            class="rarity-text">[E]</span> = Elite
    </h3>
    <h3 class="text-lg type-text text-center mx-auto mb-4">
        <span class="rarity-text">\${uniques.length}</span> Uniques Found
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by character class.">
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

                <searchable-select id="itype"
                                   class="w-full lg:w-auto lg:min-w-60"
                                   data-help-text="Filter by base item type, only includes class specific variants on generic types."
                                   value.bind="selectedType"
                                   options.bind="types"
                                   label="Select Item Type">
                    <button au-slot="after" type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">
                        <span class="mso">info</span>
                        <span class="sr-only">More info about Item Type filter</span>
                    </button>
                </searchable-select>

                <searchable-select id="eqsel"
                                   class="w-full lg:w-auto lg:min-w-60"
                                   data-help-text="Filter to a specific equipment for the selected item type, disabled if one isn't selected."
                                   value.bind="selectedEquipmentName"
                                   options.bind="equipmentNames"
                                   label="Select Equipment"
                                   disabled.bind="!selectedType">
                    <button au-slot="after" type="button" class="m-info-button" aria-expanded="false" data-info-for="eqsel">
                        <span class="mso">info</span>
                        <span class="sr-only">More info about Equipment filter</span>
                    </button>
                </searchable-select>

                <div class="w-full lg:w-60" data-help-text="Search across all fields. Text is matched as a phrase. Use '+' to require multiple terms (AND). Use ',' or '|' for OR. Prefix with '-' or '!' to exclude a term or phrase. ex. 'fire skill damage' finds the exact phrase. 'fire+cold' finds items with both. 'fire,cold' finds items with either. '-fire' excludes items containing fire. 'damage -fire' finds items with damage but not fire. 'fire skill damage -cold skill damage' finds fire skill damage but excludes cold skill damage.">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search" placeholder=" "/>
                            <label for="inputsearch" class="floating-label">Search...</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Search</span>
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
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="hidevanillabutton">
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

                <div class="w-full lg:w-auto lg:min-w-55" data-help-text="Filter weapon type: All, 1H Only, or 2H Only.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="handfilter" class="select-base peer" value.bind="handFilterMode">
                                <option repeat.for="opt of handFilterOptions" value.bind="opt.value">\${opt.label}</option>
                            </select>
                            <label for="handfilter" class="floating-label">Select Weapon Type</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="handfilter">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Weapon Type filter</span>
                        </button>
                    </div>
                </div>

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
        <div class="card-box card-vis" repeat.for="unique of uniques">

                <div class="mb-1">
                    <div class="text-xl unique-text">
                        \${unique.Name}
                    </div>
                    <div class="text-base rarity-text" if.bind="unique.Rarity">
                        Rarity: \${unique.Rarity}
                    </div>
                    <div class="text-base rarity-text" if.bind="unique.Vanilla">
                        \${unique.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}
                    </div>
                </div>

                <div class="mb-1">
                    <div class="text-base type-text" if.bind="unique.Equipment.Name">
                        \${unique.Equipment.Name}
                    </div>
                    <div class="text-base type-text" if.bind="unique.Equipment.ArmorString">
                        Defense: \${unique.Equipment.ArmorString}
                    </div>
                    <div class="text-base type-text"
                         if.bind="unique.Equipment.Block !== null && unique.Equipment.Block !== undefined && unique.Equipment.Block > 0">
                        Block: \${unique.Equipment.Block}%
                    </div>
                    <div class="text-base type-text flex items-center justify-center gap-1"
                         repeat.for="damage of unique.Equipment.DamageTypes"
                         click.trigger="getSortKeyFromDamageType(damage.Type) ? toggleSort(getSortKeyFromDamageType(damage.Type)) : null"
                         class.bind="getSortKeyFromDamageType(damage.Type) ? 'clickable' : ''">
                        <span>\${getDamageTypeString(damage.Type)} \${damage.DamageString}<span class="set-text" if.bind="damage.AverageDamage"> <\${damage.AverageDamage}></span></span>
                        <span class="mso set-text-light" if.bind="getSortKeyFromDamageType(damage.Type) && weaponSortMode.includes(getSortKeyFromDamageType(damage.Type))">
                            \${weaponSortMode.includes('ascending') ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                    </div>
                    <div class="text-base type-text" if.bind="unique.Equipment.Durability > 0">
                        Durability: \${unique.Equipment.Durability}
                    </div>
                </div>

                <div class="mb-1">
                    <div class="text-base requirement-text"
                         if.bind="unique.Equipment.RequiredClass && unique.Equipment.RequiredClass.length">
                        (\${unique.Equipment.RequiredClass} Only)
                    </div>
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredDexterity && unique.Equipment.RequiredDexterity !== '0' && unique.Equipment.RequiredDexterity !== 0">
                        Required Dexterity: \${unique.Equipment.RequiredDexterity}
                    </div>
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredStrength && unique.Equipment.RequiredStrength !== '0' && unique.Equipment.RequiredStrength !== 0">
                        Required Strength: \${unique.Equipment.RequiredStrength}
                    </div>
                    <div class="text-base requirement-text">
                        Required Level: \${unique.RequiredLevel > 0? unique.RequiredLevel: 1}
                    </div>
                </div>

                <div class="text-base prop-text" repeat.for="property of unique.Properties | sortProperties">
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
var _handleEquipmentNameChanged_dec, _handleTypeChanged_dec, _handleSearchChanged_dec, _handleFilterChanged_dec, _handFilterMode_dec, _weaponSortMode_dec, _selectedEquipmentName_dec, _selectedType_dec, _hideVanilla_dec, _selectedClass_dec, _search_dec, _Uniques_decorators, _init;
_Uniques_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedClass_dec = [bindable], _hideVanilla_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _weaponSortMode_dec = [bindable], _handFilterMode_dec = [bindable], _handleFilterChanged_dec = [watch("selectedClass"), watch("hideVanilla"), watch("weaponSortMode"), watch("handFilterMode")], _handleSearchChanged_dec = [watch("search")], _handleTypeChanged_dec = [watch("selectedType")], _handleEquipmentNameChanged_dec = [watch("selectedEquipmentName")];
class Uniques {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "allUniques", uniquesJson);
    __publicField(this, "uniques", []);
    __publicField(this, "_searchStrings", /* @__PURE__ */ new Map());
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 16, this, false)), __runInitializers(_init, 19, this);
    __publicField(this, "selectedType", __runInitializers(_init, 20, this, "")), __runInitializers(_init, 23, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "weaponSortMode", __runInitializers(_init, 28, this, "none")), __runInitializers(_init, 31, this);
    __publicField(this, "handFilterMode", __runInitializers(_init, 32, this, "")), __runInitializers(_init, 35, this);
    __publicField(this, "equipmentNames", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "_debouncedUpdateUrl");
    __publicField(this, "classes", character_class_options);
    __publicField(this, "weaponSortOptions", weaponSortOptions);
    __publicField(this, "handFilterOptions", handFilterOptions);
    __publicField(this, "getDamageTypeString", getDamageTypeString);
  }
  // Hydrate state from URL and build type options BEFORE the controls render
  binding() {
    const urlParams = new URLSearchParams(window.location.search);
    this.allUniques.forEach((u) => {
      this._searchStrings.set(u, this.buildSearchableStringForUnique(u));
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
      for (const u of uniquesJson || []) {
        const base = resolveBaseTypeName(u?.Type ?? "");
        if (base) present.add(base);
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
    if (eqParam && !isBlankOrInvalid(eqParam)) {
      this.selectedEquipmentName = eqParam;
    }
  }
  attached() {
    this._debouncedSearchItem = debounce(() => this.updateList(), 350);
    this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);
    if (this.selectedType) {
      this.equipmentNames = this.getUniqueEquipmentNames();
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
  handleFilterChanged() {
    this.updateList();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleTypeChanged() {
    this.equipmentNames = this.getUniqueEquipmentNames();
    this.selectedEquipmentName = void 0;
    if (!this.isWeaponType) this.weaponSortMode = "none";
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
  }
  handleEquipmentNameChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
  }
  // Helper method to update URL with current search parameters
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      selectedClass: this.selectedClass,
      type: this.selectedType,
      hideVanilla: this.hideVanilla,
      equipment: this.selectedEquipmentName
    }, false);
  }
  updateList() {
    const searchTokens = tokenizeSearch(this.search);
    const selectedClassLower = (this.selectedClass || "").toLowerCase();
    let allowedTypeSet;
    if (this.selectedType) {
      const opt = this.types.find((o) => o.id === this.selectedType);
      if (opt && opt.value) allowedTypeSet = new Set(opt.value);
    }
    if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
      this.equipmentNames = this.getUniqueEquipmentNames();
    }
    this.uniques = this.allUniques.filter((unique) => {
      const name2 = unique?.Name || "";
      if (name2.toLowerCase().includes("grabber")) return false;
      if (this.hideVanilla && isVanillaItem(unique?.Vanilla)) return false;
      if (selectedClassLower) {
        const req = unique?.Equipment?.RequiredClass ? String(unique.Equipment.RequiredClass).toLowerCase() : "";
        if (!req.includes(selectedClassLower)) return false;
      }
      if (allowedTypeSet) {
        const base = getChainForTypeNameReadonly(unique?.Type ?? "")[0] || (unique?.Type ?? "");
        if (!allowedTypeSet.has(base)) return false;
      }
      if (this.selectedEquipmentName && String(unique?.Equipment?.Name || "") !== this.selectedEquipmentName) {
        return false;
      }
      if (searchTokens.length > 0) {
        const hay = this._searchStrings.get(unique) || "";
        if (!matchesTokenGroups(hay, searchTokens)) {
          return false;
        }
      }
      return true;
    });
    if (this.handFilterMode) {
      this.uniques = this.uniques.filter(
        (u) => passesHandFilter(u?.Equipment?.DamageTypes, this.handFilterMode)
      );
    }
    if (this.isWeaponType && this.weaponSortMode !== "none") {
      this.uniques = sortItemsByWeaponDamage(this.uniques, this.weaponSortMode);
    }
  }
  buildSearchableStringForUnique(unique) {
    const parts = [
      String(unique?.Name || ""),
      String(unique?.Equipment?.Name || "")
    ];
    if (Array.isArray(unique?.Properties)) {
      unique.Properties.forEach((p) => {
        if (p.PropertyString) parts.push(p.PropertyString);
        if (p["group-properties"]) {
          Object.values(p["group-properties"]).forEach((pool) => {
            pool.forEach((affix) => {
              if (affix.PropertyString) parts.push(affix.PropertyString);
            });
          });
        }
      });
    }
    if (Array.isArray(unique?.Equipment?.DamageTypes)) {
      for (const d of unique.Equipment.DamageTypes) {
        parts.push(getDamageTypeString(d.Type));
        if (d.DamageString) parts.push(d.DamageString);
      }
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  }
  getUniqueEquipmentNames() {
    let allowedTypeSet;
    if (this.selectedType) {
      const opt = this.types.find((o) => o.id === this.selectedType);
      if (opt && opt.value) allowedTypeSet = new Set(opt.value);
    }
    const filteredUniques = this.allUniques.filter(
      (unique) => {
        if (!allowedTypeSet) return true;
        const base = getChainForTypeNameReadonly(unique?.Type ?? "")[0] || (unique?.Type ?? "");
        return allowedTypeSet.has(base);
      }
    );
    const uniqueEquipmentNames = /* @__PURE__ */ new Set();
    filteredUniques.forEach((unique) => {
      if (unique.Equipment && unique.Equipment.Name) {
        uniqueEquipmentNames.add(unique.Equipment.Name);
      }
    });
    const equipmentNameOptions = [{ value: "", label: "-" }];
    Array.from(uniqueEquipmentNames).sort().forEach((name2) => {
      equipmentNameOptions.push({ value: name2, label: name2 });
    });
    return equipmentNameOptions;
  }
  formatGroupName(name2) {
    return name2.replace(/-/g, " ").replace(/([a-z])([0-9])/g, "$1 $2");
  }
  // Reset all filters to their default values and refresh
  resetFilters() {
    this.search = "";
    this.selectedClass = void 0;
    this.hideVanilla = false;
    this.selectedType = "";
    this.selectedEquipmentName = void 0;
    this.equipmentNames = [{ value: "", label: "-" }];
    this.weaponSortMode = "none";
    this.handFilterMode = "";
    this.updateList();
    this.updateUrl();
  }
  // Reset only the weapon sorting mode
  resetSort() {
    this.weaponSortMode = "none";
    this.handFilterMode = "";
  }
  toggleSort(type) {
    this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
  }
  getSortKeyFromDamageType(type) {
    return getSortKeyFromDamageType(type);
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleFilterChanged", _handleFilterChanged_dec, Uniques);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Uniques);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Uniques);
__decorateElement(_init, 1, "handleEquipmentNameChanged", _handleEquipmentNameChanged_dec, Uniques);
__decorateElement(_init, 5, "search", _search_dec, Uniques);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Uniques);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Uniques);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Uniques);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Uniques);
__decorateElement(_init, 5, "weaponSortMode", _weaponSortMode_dec, Uniques);
__decorateElement(_init, 5, "handFilterMode", _handFilterMode_dec, Uniques);
Uniques = __decorateElement(_init, 0, "Uniques", _Uniques_decorators, Uniques);
__runInitializers(_init, 1, Uniques);
export {
  Uniques
};
