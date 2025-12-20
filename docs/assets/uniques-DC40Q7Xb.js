import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-BcLyVs97.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, p as prependTypeResetOption, a as tokenizeSearch, g as getDescendantBaseNames, c as getChainForTypeName, i as isVanillaItem } from "./filter-helpers-OZCyS2Ps.js";
import { c as character_class_options } from "./character-classes-LLAbBzNg.js";
import { g as getDamageTypeString } from "./damage-type-Du-j2Hbt.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { u as uniquesJson } from "./uniques-PVVDDl-d.js";
const name = "uniques";
const template = '<template>\r\n    <h3 class="text-lg type-text text-center mx-auto my-4">\r\n        <span class="rarity-text">${uniques.length}</span> Uniques Found\r\n    </h3>\r\n\r\n    <search-area>\r\n        <div class="w-full m-auto px-5 py-2">\r\n            <div class="flex flex-wrap justify-center items-start gap-2">\r\n\r\n                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by character class.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="relative flex-1">\r\n                            <select id="ficlass" class="select-base peer" value.bind="selectedClass">\r\n                                <option repeat.for="opt of classes" value.bind="opt.value">${opt.label}</option>\r\n                            </select>\r\n                            <label for="ficlass" class="floating-label">Select Class</label>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ficlass">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about Class filter</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by base item type, only includes class specific variants on generic types.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="relative flex-1">\r\n                            <select id="itype" class="select-base peer" value.bind="selectedType">\r\n                                <option repeat.for="opt of types"\r\n                                        value.bind="opt.value && opt.value.length ? opt.value[0] : \'\'">${opt.label}\r\n                                </option>\r\n                            </select>\r\n                            <label for="itype" class="floating-label">Select Item Type</label>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about Item Type filter</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter to a specific equipment for the selected item type, disabled if one isn\'t selected.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="relative flex-1">\r\n                            <select id="eqsel" class="select-base peer" value.bind="selectedEquipmentName"\r\n                                    disabled.bind="!selectedType">\r\n                                <option repeat.for="opt of equipmentNames" value.bind="opt.value">${opt.label}</option>\r\n                            </select>\r\n                            <label for="eqsel" class="floating-label">Select Equipment</label>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="eqsel">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about Equipment filter</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="w-full lg:w-60" data-help-text="Search across all fields. Uses (space) as an \'AND\' modifier. ex: Typing sorc skill mana will return items with only all 3 words.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="trailing-icon flex-1" data-icon="search">\r\n                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search" placeholder=" "/>\r\n                            <label for="inputsearch" class="floating-label">Search...</label>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about Search</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Filter toggle to hide Vanilla items.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="relative flex-1">\r\n                            <button\r\n                                    id="hidevanillabutton"\r\n                                    type="button"\r\n                                    class="vanilla-button flex-row-reverse"\r\n                                    aria-pressed.bind="hideVanilla"\r\n                                    click.trigger="hideVanilla = !hideVanilla">\r\n                                <span class="vanilla-indicator"></span>\r\n                                Hide Vanilla\r\n                            </button>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="hidevanillabutton">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about the Hide Vanilla button</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Reset all filters to default.">\r\n                    <div class="flex items-stretch">\r\n                        <div class="relative flex-1">\r\n                            <button id="resetfilters" class="button-base" type="button" click.trigger="resetFilters()">\r\n                                Reset Filters\r\n                            </button>\r\n                        </div>\r\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetfilters">\r\n                            <span class="mso">info</span>\r\n                            <span class="sr-only">More info about Reset Filters</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </search-area>\r\n\r\n    <div class="card-container">\r\n        <div class="card-box card-vis" repeat.for="unique of uniques">\r\n\r\n                <div class="mb-1">\r\n                    <div class="text-xl unique-text">\r\n                        ${unique.Name}\r\n                    </div>\r\n                    <div class="text-base rarity-text" if.bind="unique.Rarity">\r\n                        Rarity: ${unique.Rarity}\r\n                    </div>\r\n                    <div class="text-base rarity-text" if.bind="unique.Vanilla">\r\n                        ${unique.Vanilla === \'Y\' ? \'Vanilla\' : \'Mod\'}\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="mb-1">\r\n                    <div class="text-base type-text" if.bind="unique.Equipment.Name">\r\n                        ${unique.Equipment.Name}\r\n                    </div>\r\n                    <div class="text-base type-text" if.bind="unique.Equipment.ArmorString">\r\n                        Defense: ${unique.Equipment.ArmorString}\r\n                    </div>\r\n                    <div class="text-base type-text"\r\n                         if.bind="unique.Equipment.Block !== null && unique.Equipment.Block !== undefined && unique.Equipment.Block > 0">\r\n                        Block: ${unique.Equipment.Block}%\r\n                    </div>\r\n                    <div class="text-base type-text" if.bind="unique.Equipment.DamageTypes"\r\n                         repeat.for="damage of unique.Equipment.DamageTypes">\r\n                        ${getDamageTypeString(damage.Type)} ${damage.DamageString}\r\n                    </div>\r\n                    <div class="text-base type-text" if.bind="unique.Equipment.Durability > 0">\r\n                        Durability: ${unique.Equipment.Durability}\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="mb-1">\r\n                    <div class="text-base requirement-text"\r\n                         if.bind="unique.Equipment.RequiredClass && unique.Equipment.RequiredClass.length">\r\n                        (${unique.Equipment.RequiredClass} Only)\r\n                    </div>\r\n                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredDexterity > 0">\r\n                        Required Dexterity: ${unique.Equipment.RequiredDexterity}\r\n                    </div>\r\n                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredStrength > 0">\r\n                        Required Strength: ${unique.Equipment.RequiredStrength}\r\n                    </div>\r\n                    <div class="text-base requirement-text">\r\n                        Required Level: ${unique.RequiredLevel > 0? unique.RequiredLevel: 1}\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="text-base prop-text" repeat.for="property of unique.Properties">\r\n                    ${property.PropertyString}\r\n                </div>\r\n\r\n                </div>\r\n            </div>\r\n</template>\r\n';
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
var _handleEquipmentNameChanged_dec, _handleTypeChanged_dec, _handleSearchChanged_dec, _handleFilterChanged_dec, _selectedEquipmentName_dec, _selectedType_dec, _hideVanilla_dec, _selectedClass_dec, _search_dec, _Uniques_decorators, _init;
_Uniques_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedClass_dec = [bindable], _hideVanilla_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _handleFilterChanged_dec = [watch("selectedClass"), watch("hideVanilla")], _handleSearchChanged_dec = [watch("search")], _handleTypeChanged_dec = [watch("selectedType")], _handleEquipmentNameChanged_dec = [watch("selectedEquipmentName")];
class Uniques {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "uniques", uniquesJson);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 16, this, false)), __runInitializers(_init, 19, this);
    __publicField(this, "selectedType", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "equipmentNames", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "_debouncedUpdateUrl");
    __publicField(this, "classes", character_class_options);
    __publicField(this, "getDamageTypeString", getDamageTypeString);
  }
  // Hydrate state from URL and build type options BEFORE the controls render
  binding() {
    const urlParams = new URLSearchParams(window.location.search);
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
      const base = typeParam.split(",")[0];
      const opt = this.types.find((o) => o.value && o.value[0] === base);
      this.selectedType = opt ? base : void 0;
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
    });
  }
  updateList() {
    const searchTokens = tokenizeSearch(this.search);
    const selectedClassLower = (this.selectedClass || "").toLowerCase();
    const allowedTypeSet = (() => {
      if (!this.selectedType) return null;
      const set = /* @__PURE__ */ new Set();
      set.add(this.selectedType);
      const descendants = getDescendantBaseNames(this.selectedType);
      for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
      return set;
    })();
    const isMatchingClass = (unique) => {
      if (!selectedClassLower) return true;
      const req = unique?.Equipment?.RequiredClass ? String(unique.Equipment.RequiredClass).toLowerCase() : "";
      return req.includes(selectedClassLower);
    };
    const isMatchingSearch = (unique) => {
      if (!searchTokens.length) return true;
      const hay = [
        String(unique?.Name || ""),
        ...Array.isArray(unique?.Properties) ? unique.Properties.map((p) => String(p?.PropertyString || "")) : [],
        String(unique?.Equipment?.Name || "")
      ].filter(Boolean).join(" ").toLowerCase();
      return searchTokens.every((t) => hay.includes(t));
    };
    const isMatchingType = (unique) => {
      if (!allowedTypeSet) return true;
      const base = getChainForTypeName(unique?.Type ?? "")[0] || (unique?.Type ?? "");
      return allowedTypeSet.has(base);
    };
    const isMatchingEquipmentName = (unique) => {
      return !this.selectedEquipmentName || String(unique?.Equipment?.Name || "") === this.selectedEquipmentName;
    };
    const isMatchingVanilla = (unique) => {
      return !this.hideVanilla || !isVanillaItem(unique?.Vanilla);
    };
    if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
      this.equipmentNames = this.getUniqueEquipmentNames();
    }
    this.uniques = uniquesJson.filter(
      (unique) => !String(unique?.Name || "").toLowerCase().includes("grabber") && isMatchingSearch(unique) && isMatchingClass(unique) && isMatchingType(unique) && isMatchingEquipmentName(unique) && isMatchingVanilla(unique)
    );
  }
  getUniqueEquipmentNames() {
    const allowedTypeSet = (() => {
      if (!this.selectedType) return null;
      const set = /* @__PURE__ */ new Set();
      set.add(this.selectedType);
      const descendants = getDescendantBaseNames(this.selectedType);
      for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
      return set;
    })();
    const filteredUniques = uniquesJson.filter(
      (unique) => {
        if (!allowedTypeSet) return true;
        const base = getChainForTypeName(unique?.Type ?? "")[0] || (unique?.Type ?? "");
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
  // Reset all filters to their default values and refresh
  resetFilters() {
    this.search = "";
    this.selectedClass = void 0;
    this.hideVanilla = false;
    this.selectedType = void 0;
    this.selectedEquipmentName = void 0;
    this.equipmentNames = [{ value: "", label: "-" }];
    this.updateList();
    this.updateUrl();
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
Uniques = __decorateElement(_init, 0, "Uniques", _Uniques_decorators, Uniques);
__runInitializers(_init, 1, Uniques);
export {
  Uniques
};
