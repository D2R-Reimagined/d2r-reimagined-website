import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-4oso5Uie.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, g as getChainForTypeNameReadonly } from "./item-type-filters-DhJkOFOx.js";
import { c as character_class_options } from "./character-classes-LLAbBzNg.js";
import { g as getDamageTypeString } from "./damage-types-Du-j2Hbt.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { p as prependTypeResetOption, t as tokenizeSearch, i as isVanillaItem } from "./filter-helpers-018iK1be.js";
import { s as setsJson } from "./sets-BHx8JpOO.js";
const name = "sets";
const template = '<template>\n    <h3 class="type-text text-lg text-center mx-auto my-4">\n        <span class="rarity-text">${sets.length}</span> Sets Found\n    </h3>\n\n    <search-area>\n        <div class="w-full m-auto px-5 py-2">\n            <div class="flex flex-wrap justify-center items-start gap-2">\n\n                <div class="w-full lg:w-auto lg:min-w-60"\n                     data-help-text="Filter by character class, sets match as full set if one is found.">\n                    <div class="flex items-stretch">\n                        <div class="relative flex-1">\n                            <select id="ficlass" class="select-base peer" value.bind="selectedClass">\n                                <option repeat.for="opt of classes" value.bind="opt.value">${opt.label}</option>\n                            </select>\n                            <label for="ficlass" class="floating-label">Select Class</label>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ficlass">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about Class filter</span>\n                        </button>\n                    </div>\n                </div>\n\n                <div class="w-full lg:w-auto lg:min-w-60"\n                     data-help-text="Filter by base item type, sets match as full set if one is found.">\n                    <div class="flex items-stretch">\n                        <div class="relative flex-1">\n                            <select id="itype" class="select-base peer" value.bind="selectedType">\n                                <option repeat.for="opt of types"\n                                        value.bind="opt.id">${opt.label}\n                                </option>\n                            </select>\n                            <label for="itype" class="floating-label">Select Item Type</label>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about Item Type filter</span>\n                        </button>\n                    </div>\n                </div>\n\n                <div class="w-full lg:w-auto lg:min-w-60"\n                     data-help-text="Filter to a specific equipment for the selected type, disabled if one isn\'t selected.">\n                    <div class="flex items-stretch">\n                        <div class="relative flex-1">\n                            <select id="eqname" class="select-base peer" value.bind="selectedEquipmentName"\n                                    disabled.bind="!selectedType">\n                                <option repeat.for="opt of equipmentNames" value.bind="opt.value">${opt.label}</option>\n                            </select>\n                            <label for="eqname" class="floating-label">Select Equipment</label>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="eqname">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about Equipment filter</span>\n                        </button>\n                    </div>\n                </div>\n\n                <div class="w-full lg:w-60"\n                     data-help-text="Search across all fields, sets match as full set if one is found. Uses (space) as an \'AND\' modifier. ex: Typing sorc skill mana will return items with only all 3 words.">\n                    <div class="flex items-stretch">\n                        <div class="trailing-icon flex-1" data-icon="search">\n                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"\n                                   placeholder=" "/>\n                            <label for="inputsearch" class="floating-label">Search...</label>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about Search</span>\n                        </button>\n                    </div>\n                </div>\n\n                <div class="w-full lg:w-auto lg:min-w-35"\n                     data-help-text="Filter toggle to hide Vanilla items. Applies to the entire set.">\n                    <div class="flex items-stretch">\n                        <div class="relative flex-1">\n                            <button\n                                    id="hidevanillabutton"\n                                    type="button"\n                                    class="vanilla-button flex-row-reverse"\n                                    aria-pressed.bind="hideVanilla"\n                                    click.trigger="hideVanilla = !hideVanilla">\n                                <span class="vanilla-indicator"></span>\n                                Hide Vanilla\n                            </button>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false"\n                                data-info-for="hidevanillabutton">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about the Hide Vanilla button</span>\n                        </button>\n                    </div>\n                </div>\n\n                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Reset all filters to default.">\n                    <div class="flex items-stretch">\n                        <div class="relative flex-1">\n                            <button id="resetfilters" class="button-base" type="button" click.trigger="resetFilters()">\n                                Reset Filters\n                            </button>\n                        </div>\n                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetfilters">\n                            <span class="mso">info</span>\n                            <span class="sr-only">More info about Reset Filters</span>\n                        </button>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n    </search-area>\n\n    <div class="card-container">\n        <div class="card-box card-vis" repeat.for="set of sets">\n\n            <div class="mb-1">\n                <div class="text-xl set-text-light">\n                    ${set.Name}\n                </div>\n                <div class="text-base rarity-text">\n                    ${set.Vanilla === \'Y\' ? \'Vanilla\' : \'Mod\'}\n                </div>\n            </div>\n\n            <div class="mb-1">\n                <div class="partial-sets text-base set-text" repeat.for="partial of set.PartialProperties">\n                    ${partial.PropertyString} (${getItemCount(partial.Index)} Items)\n                </div>\n                <div class="partial-sets text-base set-text" repeat.for="full of set.FullProperties">\n                    ${full.PropertyString} (Full Set)\n                </div>\n            </div>\n\n            <div repeat.for="setItem of set.SetItems"\n                 if.bind="!hideVanilla || (set.Vanilla || \'\').toUpperCase() !== \'Y\'">\n\n                <div class="mt-2 mb-1">\n                    <div class="text-base set-text-light"\n                         if.bind="!hideVanilla || (set.Vanilla || \'\').toUpperCase() !== \'Y\'">\n                        ${setItem.Name}\n                    </div>\n                    <div class="text-base rarity-text" if.bind="setItem.Rarity">\n                        Rarity: ${setItem.Rarity}\n                    </div>\n                </div>\n\n                <div class="mb-1">\n                    <div class="text-base type-text" if.bind="setItem.Equipment.Name">\n                        ${setItem.Equipment.Name}\n                    </div>\n                    <div class="text-base type-text" if.bind="setItem.Equipment.ArmorString">\n                        Defense: ${setItem.Equipment.ArmorString}\n                    </div>\n                    <div class="text-base type-text"\n                         if.bind="setItem.Equipment.Block !== null && setItem.Equipment.Block !== undefined && setItem.Equipment.Block > 0">\n                        Block: ${setItem.Equipment.Block}%\n                    </div>\n                    <div class="text-base type-text" if.bind="setItem.Equipment.DamageTypes"\n                         repeat.for="damage of setItem.Equipment.DamageTypes">\n                        ${getDamageTypeString(damage.Type)} ${damage.DamageString}\n                    </div>\n                    <div class="text-base type-text" if.bind="setItem.Equipment.Durability > 0">\n                        Durability: ${setItem.Equipment.Durability}\n                    </div>\n                </div>\n\n                <div class="mb-1">\n                    <div class="text-base requirement-text"\n                         if.bind="setItem.Equipment.RequiredClass && setItem.Equipment.RequiredClass.length">\n                        (${setItem.Equipment.RequiredClass} Only)\n                    </div>\n                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredDexterity > 0">\n                        ${setItem.Equipment.RequiredDexterity} Dexterity Required\n                    </div>\n                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredStrength > 0">\n                        ${setItem.Equipment.RequiredStrength} Strength Required\n                    </div>\n                    <div class="text-base requirement-text">\n                        Level ${setItem.RequiredLevel > 0? setItem.RequiredLevel: 1} Required\n                    </div>\n                </div>\n\n                <div class="text-base prop-text" repeat.for="property of setItem.Properties">\n                    ${property.PropertyString}\n                </div>\n                <div class="text-base set-text" repeat.for="setProperty of setItem.SetPropertiesString">\n                    ${setProperty}\n                </div>\n\n            </div>\n\n        </div>\n    </div>\n</template>\n';
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
var _handleEquipmentNameChanged_dec, _handleTypeChanged_dec, _handleFilterChanged_dec, _selectedClass_dec, _handleSearchChanged_dec, _hideVanilla_dec, _selectedEquipmentName_dec, _selectedType_dec, _search_dec, _Sets_decorators, _init;
_Sets_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _hideVanilla_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _selectedClass_dec = [bindable], _handleFilterChanged_dec = [watch("selectedClass"), watch("hideVanilla")], _handleTypeChanged_dec = [watch("selectedType")], _handleEquipmentNameChanged_dec = [watch("selectedEquipmentName")];
class Sets {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "sets", setsJson);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedType", __runInitializers(_init, 12, this, "")), __runInitializers(_init, 15, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 20, this, false)), __runInitializers(_init, 23, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "equipmentNames", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "selectedClass", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "classes", character_class_options);
    __publicField(this, "getDamageTypeString", getDamageTypeString);
  }
  // Build options and hydrate from URL BEFORE controls render
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
    if (this.selectedType) {
      this.equipmentNames = this.getSetEquipmentNames();
    }
    this.updateList();
    this.updateUrl();
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
    this.updateUrl();
  }
  handleFilterChanged() {
    this.updateList();
    this.updateUrl();
  }
  handleTypeChanged() {
    this.equipmentNames = this.getSetEquipmentNames();
    this.selectedEquipmentName = void 0;
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  handleEquipmentNameChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  updateList() {
    try {
      const searchTokens = tokenizeSearch(this.search);
      const classText = this.selectedClass?.toLowerCase();
      const allowedTypeSet = (() => {
        if (!this.selectedType) return null;
        const opt = this.types.find((o) => o.id === this.selectedType);
        return opt && opt.value ? new Set(opt.value) : null;
      })();
      const matchesType = (set) => {
        if (!allowedTypeSet) return true;
        return (set.SetItems ?? []).some((si) => {
          const base = getChainForTypeNameReadonly(si?.Type ?? "")[0] || (si?.Type ?? "");
          return allowedTypeSet.has(base);
        });
      };
      const matchesEquipment = (set) => {
        if (!this.selectedEquipmentName) return true;
        return (set.SetItems ?? []).some(
          (si) => si.Equipment?.Name === this.selectedEquipmentName
        );
      };
      const matchesSearch = (set) => {
        if (!searchTokens.length) return true;
        const hayParts = [];
        if (set.Name) hayParts.push(String(set.Name));
        const allProps = set.AllProperties ?? [
          ...set.FullProperties || [],
          ...set.PartialProperties || []
        ];
        for (const p of allProps || [])
          hayParts.push(String(p?.PropertyString || ""));
        for (const si of set.SetItems ?? []) {
          hayParts.push(String(si?.Name || ""));
          hayParts.push(String(si?.Equipment?.Name || ""));
          for (const p of si?.Properties || [])
            hayParts.push(String(p?.PropertyString || ""));
          for (const s of si?.SetPropertiesString || [])
            hayParts.push(String(s || ""));
        }
        const hay = hayParts.filter(Boolean).join(" ").toLowerCase();
        return searchTokens.every((t) => hay.includes(t));
      };
      const matchesVanilla = (set) => {
        return !this.hideVanilla || !isVanillaItem(set?.Vanilla);
      };
      const matchesClass = (set) => {
        if (!classText) return true;
        const allProps = set.AllProperties ?? [
          ...set.FullProperties || [],
          ...set.PartialProperties || []
        ];
        if (allProps?.some(
          (p) => p.PropertyString?.toLowerCase()?.includes(classText)
        ))
          return true;
        for (const si of set.SetItems ?? []) {
          if (si.Name?.toLowerCase().includes(classText)) return true;
          if (si.Equipment?.Name?.toLowerCase().includes(classText))
            return true;
          if (si.Properties?.some(
            (p) => p.PropertyString?.toLowerCase()?.includes(classText)
          ))
            return true;
          if (si.SetPropertiesString?.some(
            (s) => s?.toLowerCase()?.includes(classText)
          ))
            return true;
        }
        return false;
      };
      if (!this.search && !this.selectedClass && !this.selectedType && !this.selectedEquipmentName && !this.hideVanilla) {
        this.sets = setsJson;
        return;
      }
      this.sets = setsJson.filter(
        (set) => matchesType(set) && matchesEquipment(set) && matchesSearch(set) && matchesClass(set) && matchesVanilla(set)
      );
    } catch (e) {
    }
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
    this.updateList();
    this.updateUrl();
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Sets);
__decorateElement(_init, 1, "handleFilterChanged", _handleFilterChanged_dec, Sets);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Sets);
__decorateElement(_init, 1, "handleEquipmentNameChanged", _handleEquipmentNameChanged_dec, Sets);
__decorateElement(_init, 5, "search", _search_dec, Sets);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Sets);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Sets);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Sets);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Sets);
Sets = __decorateElement(_init, 0, "Sets", _Sets_decorators, Sets);
__runInitializers(_init, 1, Sets);
export {
  Sets
};
