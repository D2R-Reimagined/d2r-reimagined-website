import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-Ubr5Vxao.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
import { s as setsJson } from "./sets-DYK1PFWV.js";
import { r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options, g as getChainForTypeName } from "./item-type-filters-EbkYbcFa.js";
const name = "sets";
const template = '<template>\r\n    <h3 class="text-center my-4">\r\n        <span class="rarity-text">${sets.length}</span> Sets Found\r\n    </h3>\r\n    <search-area>\r\n        <div class="max-w-7xl mx-auto px-4">\r\n            <div class="flex flex-wrap justify-center items-center text-center">\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Class"\r\n                                options.bind="classes"\r\n                                value.bind="class"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Type"\r\n                                options.bind="types"\r\n                                value.bind="selectedType"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Equipment"\r\n                                options.bind="equipmentNames"\r\n                                value.bind="selectedEquipmentName"\r\n                                disabled.bind="!selectedType || selectedType.length === 0"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                    <moo-text-field\r\n                            class="w-full"\r\n                            label="Search Sets"\r\n                            type="text"\r\n                            value.bind="search"\r\n                    ></moo-text-field>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </search-area>\r\n\r\n    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\r\n        <div repeat.for="set of sets">\r\n            <div class="bg-gray-800 rounded shadow p-2">\r\n                <div class="set-text-light text-lg mb-1">\r\n                    ${set.Name}\r\n                </div>\r\n\r\n                <div class="partial-sets set-text" repeat.for="partial of set.PartialProperties">\r\n                    ${partial.PropertyString} (${getItemCount(partial.Index)} Items)\r\n                </div>\r\n\r\n                <div class="partial-sets set-text" repeat.for="full of set.FullProperties">\r\n                    ${full.PropertyString} (Full Set)\r\n                </div>\r\n\r\n                <div class="my-1" repeat.for="setItem of set.SetItems">\r\n                    <div class="set-text-light mt-2 mb-1">\r\n                        ${setItem.Name}\r\n                    </div>\r\n                    \r\n                    <div class="rarity-text mb-1" if.bind="setItem.Rarity">\r\n                        Rarity: ${setItem.Rarity}\r\n                    </div>\r\n\r\n                    <div class="armor mb-1" if.bind="setItem.Equipment.Name">\r\n                        ${setItem.Equipment.Name}\r\n                    </div>\r\n\r\n                    <div class="armor mb-1" if.bind="setItem.Equipment.ArmorString">\r\n                        Armor: ${setItem.Equipment.ArmorString}\r\n                    </div>\r\n\r\n                    <div class="damage" if.bind="setItem.Equipment.DamageTypes"\r\n                         repeat.for="damage of setItem.Equipment.DamageTypes">\r\n                        ${getDamageTypeString(damage.Type)} ${damage.DamageString}\r\n                    </div>\r\n\r\n                    <div class="requirement">\r\n                        Level ${setItem.RequiredLevel > 0 ? setItem.RequiredLevel : 1} Required\r\n                    </div>\r\n\r\n                    <div class="requirement" if.bind="setItem.Equipment.RequiredStrength > 0">\r\n                        ${setItem.Equipment.RequiredStrength} Strength Required\r\n                    </div>\r\n\r\n                    <div class="requirement" if.bind="setItem.Equipment.RequiredDexterity > 0">\r\n                        ${setItem.Equipment.RequiredDexterity} Dexterity Required\r\n                    </div>\r\n\r\n                    <div class="durability mt-1" if.bind="setItem.Equipment.Durability > 0">\r\n                        ${setItem.Equipment.Durability} Durability\r\n                    </div>\r\n\r\n                    <div class="mt-1">\r\n                        <div class="enhanced" repeat.for="property of setItem.Properties">\r\n                            ${property.PropertyString}\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class="set-text" repeat.for="setProperty of setItem.SetPropertiesString">\r\n                        ${setProperty}\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n';
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
var _class_dec, _handleSearchChanged_dec, _selectedEquipmentName_dec, _selectedType_dec, _search_dec, _Sets_decorators, _init;
_Sets_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _class_dec = [bindable];
class Sets {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "sets", setsJson);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedType", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "equipmentNames", []);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "class", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "classes", [
      { value: null, label: "-" },
      { value: "Amazon", label: "Amazon" },
      { value: "Assassin", label: "Assassin" },
      { value: "Barbarian", label: "Barbarian" },
      { value: "Druid", label: "Druid" },
      { value: "Necromancer", label: "Necromancer" },
      { value: "Paladin", label: "Paladin" },
      { value: "Sorceress", label: "Sorceress" }
    ]);
  }
  attached() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      this.search = searchParam;
    }
    const classParam = urlParams.get("class");
    if (classParam) {
      this.class = classParam;
    }
    const typeParam = urlParams.get("type");
    if (typeParam) {
      this.selectedType = typeParam.split(",");
    }
    try {
      const present = /* @__PURE__ */ new Set();
      for (const set of setsJson) {
        for (const item of set?.SetItems || []) {
          const base = resolveBaseTypeName(item?.Type ?? "");
          if (base) present.add(base);
        }
      }
      this.types = buildOptionsForPresentTypes(type_filtering_options, present);
    } catch {
    }
    this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
    if (this.selectedType && this.selectedType.length > 0) {
      this.equipmentNames = this.getSetEquipmentNames();
    }
    this.updateList();
  }
  // Types provided via shared preset (this.types)
  // Push current filters to URL
  updateUrl() {
    const url = new URL(window.location.href);
    if (this.search && this.search.trim() !== "") {
      url.searchParams.set("search", this.search);
    } else {
      url.searchParams.delete("search");
    }
    if (this.class) {
      url.searchParams.set("class", this.class);
    } else {
      url.searchParams.delete("class");
    }
    if (this.selectedType && this.selectedType.length > 0) {
      url.searchParams.set("type", this.selectedType.join(","));
    } else {
      url.searchParams.delete("type");
    }
    window.history.pushState({}, "", url.toString());
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  classChanged() {
    this.sets = setsJson;
    this.updateList();
    this.updateUrl();
  }
  selectedTypeChanged() {
    this.equipmentNames = this.getSetEquipmentNames();
    this.selectedEquipmentName = void 0;
    if (this._debouncedSearchItem) this._debouncedSearchItem();
    this.updateUrl();
  }
  selectedEquipmentNameChanged() {
    if (this._debouncedSearchItem) this._debouncedSearchItem();
  }
  updateList() {
    try {
      const searchText = this.search?.toLowerCase();
      const classText = this.class?.toLowerCase();
      const matchesType = (set) => {
        if (!this.selectedType || this.selectedType.length === 0) return true;
        const selectedSet = new Set(this.selectedType);
        return (set.SetItems ?? []).some((si) => {
          const base = getChainForTypeName(si?.Type ?? "")[0] || (si?.Type ?? "");
          return selectedSet.has(base);
        });
      };
      const matchesEquipment = (set) => {
        if (!this.selectedEquipmentName) return true;
        return (set.SetItems ?? []).some((si) => si.Equipment?.Name === this.selectedEquipmentName);
      };
      const matchesSearch = (set) => {
        if (!searchText) return true;
        if (set.Name?.toLowerCase().includes(searchText)) return true;
        const allProps = set.AllProperties ?? [...set.FullProperties || [], ...set.PartialProperties || []];
        if (allProps?.some((p) => p.PropertyString?.toLowerCase()?.includes(searchText))) return true;
        for (const si of set.SetItems ?? []) {
          if (si.Name?.toLowerCase().includes(searchText)) return true;
          if (si.Equipment?.Name?.toLowerCase().includes(searchText)) return true;
          if (si.Properties?.some((p) => p.PropertyString?.toLowerCase()?.includes(searchText))) return true;
          if (si.SetPropertiesString?.some((s) => s?.toLowerCase()?.includes(searchText))) return true;
        }
        return false;
      };
      const matchesClass = (set) => {
        if (!classText) return true;
        const allProps = set.AllProperties ?? [...set.FullProperties || [], ...set.PartialProperties || []];
        if (allProps?.some((p) => p.PropertyString?.toLowerCase()?.includes(classText))) return true;
        for (const si of set.SetItems ?? []) {
          if (si.Name?.toLowerCase().includes(classText)) return true;
          if (si.Equipment?.Name?.toLowerCase().includes(classText)) return true;
          if (si.Properties?.some((p) => p.PropertyString?.toLowerCase()?.includes(classText))) return true;
          if (si.SetPropertiesString?.some((s) => s?.toLowerCase()?.includes(classText))) return true;
        }
        return false;
      };
      if (!this.search && !this.class && (!this.selectedType || this.selectedType.length === 0) && !this.selectedEquipmentName) {
        this.sets = setsJson;
        return;
      }
      this.sets = setsJson.filter(
        (set) => matchesType(set) && matchesEquipment(set) && matchesSearch(set) && matchesClass(set)
      );
    } catch (e) {
      console.error(e);
    }
  }
  getDamageTypeString(type) {
    switch (type) {
      case 3:
        return "Damage: ";
      case 2:
        return "Throw Damage: ";
      case 1:
        return "Two-Handed Damage: ";
      default:
        return "Damage: ";
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
    const selectedSet = new Set(this.selectedType || []);
    for (const set of setsJson) {
      for (const si of set.SetItems ?? []) {
        if (this.selectedType && this.selectedType.length > 0) {
          const base = getChainForTypeName(si?.Type ?? "")[0] || (si?.Type ?? "");
          if (!selectedSet.has(base)) continue;
        }
        const name2 = si.Equipment?.Name;
        if (name2) names.add(name2);
      }
    }
    const options = [{ value: void 0, label: "-" }];
    Array.from(names).sort().forEach((n) => options.push({ value: n, label: n }));
    return options;
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Sets);
__decorateElement(_init, 5, "search", _search_dec, Sets);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Sets);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Sets);
__decorateElement(_init, 5, "class", _class_dec, Sets);
Sets = __decorateElement(_init, 0, "Sets", _Sets_decorators, Sets);
__runInitializers(_init, 1, Sets);
export {
  Sets
};
