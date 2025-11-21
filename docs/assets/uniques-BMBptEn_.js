import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-C94TE2s_.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
import { j as json } from "./uniques-0P1Z2_dm.js";
const name = "uniques";
const template = '<template>\n    <h3 class="text-center my-4">\n        ${uniques.length} Uniques Found\n    </h3>\n    <search-area>\n        <div class="max-w-7xl mx-auto px-4">\n            <div class="flex flex-wrap justify-center items-center text-center">\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Class"\n                                options.bind="classes"\n                                value.bind="selectedClass"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Type"\n                                options.bind="types"\n                                value.bind="selectedType"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Equipment"\n                                options.bind="equipmentNames"\n                                value.bind="selectedEquipmentName"\n                                disabled.bind="!selectedType"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                    <moo-text-field\n                            class="w-full"\n                            label="Search Uniques"\n                            type="text"\n                            value.bind="search"\n                    ></moo-text-field>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </search-area>\n\n    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\n        <div class="bg-gray-800 rounded shadow p-2" repeat.for="unique of uniques">\n            <div class="bg-gray-800 rounded shadow">\n                <div class="unique-text text-lg mb-1">\n                    ${unique.Name}\n                </div>\n                <div class="rarity mb-1" if.bind="unique.Rarity">\n                    Rarity: ${unique.Rarity}\n                </div>\n                <div class="armor mb-1" if.bind="unique.Equipment.Name">\n                    ${unique.Equipment.Name}\n                </div>\n                <div class="armor mb-1" if.bind="unique.Equipment.ArmorString">\n                    Armor: ${unique.Equipment.ArmorString}\n                </div>\n                <div class="damage" if.bind="unique.Equipment.DamageTypes"\n                     repeat.for="damage of unique.Equipment.DamageTypes">\n                    ${getDamageTypeString(damage.Type)} ${damage.DamageString}\n                </div>\n                <div class="requirement" if.bind="unique.RequiredLevel > 0">\n                    Level ${unique.RequiredLevel} Required\n                </div>\n                <div class="requirement" if.bind="unique.Equipment.RequiredStrength > 0">\n                    ${unique.Equipment.RequiredStrength} Strength Required\n                </div>\n                <div class="requirement" if.bind="unique.Equipment.RequiredDexterity > 0">\n                    ${unique.Equipment.RequiredDexterity} Dexterity Required\n                </div>\n                <div class="durability mt-1" if.bind="unique.Equipment.Durability > 0">\n                    ${unique.Equipment.Durability} Durability\n                </div>\n                <div class="mt-2">\n                    <div class="enhanced" repeat.for="property of unique.Properties">\n                        ${property.PropertyString}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n';
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
var _handleEquipmentNameChanged_dec, _handleTypeChanged_dec, _handleSearchChanged_dec, _handleClassChanged_dec, _selectedEquipmentName_dec, _selectedType_dec, _selectedClass_dec, _search_dec, _Uniques_decorators, _init;
_Uniques_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedClass_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _handleClassChanged_dec = [watch("class")], _handleSearchChanged_dec = [watch("search")], _handleTypeChanged_dec = [watch("selectedType")], _handleEquipmentNameChanged_dec = [watch("selectedEquipmentName")];
class Uniques {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "uniques", json);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedType", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "equipmentNames", []);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "classes", [
      { value: void 0, label: "-" },
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
      this.selectedClass = classParam;
    }
    const typeParam = urlParams.get("type");
    if (typeParam) {
      this.selectedType = typeParam;
    }
    this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
    this.updateList();
  }
  get types() {
    const uniqueTypes = /* @__PURE__ */ new Set();
    json.forEach((unique) => {
      if (unique.Type) {
        uniqueTypes.add(unique.Type);
      }
    });
    const typeOptions = [{ value: void 0, label: "-" }];
    Array.from(uniqueTypes).sort().forEach((type) => {
      typeOptions.push({ value: type, label: type });
    });
    return typeOptions;
  }
  handleClassChanged() {
    this.updateList();
    this.updateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleTypeChanged() {
    this.equipmentNames = this.getUniqueEquipmentNames();
    this.selectedEquipmentName = void 0;
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleEquipmentNameChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
  }
  // Helper method to update URL with current search parameters
  updateUrl() {
    const url = new URL(window.location.href);
    if (this.search && this.search.trim() !== "") {
      url.searchParams.set("search", this.search);
    } else {
      url.searchParams.delete("search");
    }
    if (this.selectedClass) {
      url.searchParams.set("class", this.selectedClass);
    } else {
      url.searchParams.delete("class");
    }
    if (this.selectedType) {
      url.searchParams.set("type", this.selectedType);
    } else {
      url.searchParams.delete("type");
    }
    window.history.pushState({}, "", url.toString());
  }
  updateList() {
    const isMatchingClass = (unique) => {
      return !this.selectedClass || unique.Equipment.RequiredClass?.toLowerCase().includes(this.selectedClass?.toLowerCase());
    };
    const isMatchingSearch = (unique) => {
      if (!this.search) return true;
      const search = this.search.toLowerCase();
      const uniqueName = unique.Name.toLowerCase();
      const properties = unique.Properties.map((property) => property.PropertyString.toLowerCase());
      const baseName = unique.Equipment.Name.toLowerCase();
      return uniqueName.includes(search) || properties.find((p) => p.includes(search)) || baseName.includes(search);
    };
    const isMatchingType = (unique) => {
      return !this.selectedType || unique.Type === this.selectedType;
    };
    const isMatchingEquipmentName = (unique) => {
      return !this.selectedEquipmentName || unique.Equipment.Name === this.selectedEquipmentName;
    };
    if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
      this.equipmentNames = this.getUniqueEquipmentNames();
    }
    this.uniques = json.filter((unique) => !unique.Name.toLowerCase().includes("grabber") && isMatchingSearch(unique) && isMatchingClass(unique) && isMatchingType(unique) && isMatchingEquipmentName(unique));
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
  getUniqueEquipmentNames() {
    const filteredUniques = json.filter(
      (unique) => !this.selectedType || unique.Type === this.selectedType
    );
    const uniqueEquipmentNames = /* @__PURE__ */ new Set();
    filteredUniques.forEach((unique) => {
      if (unique.Equipment && unique.Equipment.Name) {
        uniqueEquipmentNames.add(unique.Equipment.Name);
      }
    });
    const equipmentNameOptions = [{ value: void 0, label: "-" }];
    Array.from(uniqueEquipmentNames).sort().forEach((name2) => {
      equipmentNameOptions.push({ value: name2, label: name2 });
    });
    return equipmentNameOptions;
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleClassChanged", _handleClassChanged_dec, Uniques);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Uniques);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Uniques);
__decorateElement(_init, 1, "handleEquipmentNameChanged", _handleEquipmentNameChanged_dec, Uniques);
__decorateElement(_init, 5, "search", _search_dec, Uniques);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Uniques);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Uniques);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Uniques);
Uniques = __decorateElement(_init, 0, "Uniques", _Uniques_decorators, Uniques);
__runInitializers(_init, 1, Uniques);
export {
  Uniques
};
