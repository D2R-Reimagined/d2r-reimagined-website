<<<<<<<< HEAD:docs/assets/grail-uUROwkiP.js
import { C as CustomElement, c as customElement, b as bindable } from "./index-CFDqh_h_.js";
import { j as json } from "./uniques-DR4Eo1cT.js";
========
import { C as CustomElement, c as customElement, b as bindable } from "./index-RxNSMCuM.js";
import { j as json } from "./uniques-Bk_ERHIS.js";
>>>>>>>> master:docs/assets/grail-CH0_rYPj.js
const name = "grail";
const template = '<template>\r\n    <h3 class="text-center my-4">\r\n        Holy Grail Tracker - ${foundCount}/${uniques.length} Uniques Found (${filteredUniques.length} Displayed)\r\n    </h3>\r\n    <search-area>\r\n        <div class="max-w-7xl mx-auto px-4">\r\n            <div class="flex flex-wrap justify-center items-center text-center">\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Class"\r\n                                options.bind="classes"\r\n                                value.bind="selectedClass"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Type"\r\n                                options.bind="types"\r\n                                value.bind="selectedType"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-select\r\n                                class="w-full standard-betsy-select"\r\n                                label="Select Equipment"\r\n                                options.bind="equipmentNames"\r\n                                value.bind="selectedEquipmentName"\r\n                                disabled.bind="!selectedType"\r\n                        ></moo-select>\r\n                    </div>\r\n                </div>\r\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\r\n                    <div class="mb-2">\r\n                        <moo-text-field\r\n                                class="w-full"\r\n                                label="Search Uniques"\r\n                                type="text"\r\n                                value.bind="search"\r\n                        ></moo-text-field>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </search-area>\r\n\r\n    <div class="mt-2 text-center">\r\n        <label class="inline-flex items-center cursor-pointer">\r\n            <input type="checkbox" checked.bind="showFoundItems" class="form-checkbox h-4 w-4 text-blue-600 bg-zinc-700 border-gray-300 rounded focus:ring-blue-500">\r\n            <span class="ms-3 font-medium text-white">Hide Found Uniques</span>\r\n        </label>\r\n    </div>\r\n\r\n    <div class="flex justify-center mt-4">\r\n        <button type="button" click.trigger="resetGrail()" class="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">\r\n            Reset Grail Progress\r\n        </button>\r\n    </div>\r\n\r\n    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\r\n        <div class="bg-zinc-800 rounded shadow p-2" repeat.for="unique of uniques">\r\n            <div class="bg-zinc-800 rounded shadow relative">\r\n                <div class="absolute top-2 right-2">\r\n                    <label class="inline-flex items-center cursor-pointer">\r\n                        <input type="checkbox" checked.bind="foundItems[unique.Name]" change.trigger="updateFoundStatus(unique.Name)" class="sr-only peer">\r\n                        <div class="relative w-4 h-2 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-green-600"></div>\r\n                    </label>\r\n                </div>\r\n                <div class="unique-text text-lg mb-1 ${foundItems[unique.Name] ? \'text-green-400\' : \'\'}">\r\n                    ${unique.Name}\r\n                </div>\r\n                <div class="rarity mb-1" if.bind="unique.Rarity">\r\n                    Rarity: ${unique.Rarity}\r\n                </div>\r\n                <div class="armor mb-1" if.bind="unique.Equipment.Name">\r\n                    ${unique.Equipment.Name}\r\n                </div>\r\n                <div class="armor mb-1" if.bind="unique.Equipment.ArmorString">\r\n                    Armor: ${unique.Equipment.ArmorString}\r\n                </div>\r\n                <div class="damage" if.bind="unique.Equipment.DamageTypes"\r\n                     repeat.for="damage of unique.Equipment.DamageTypes">\r\n                    ${getDamageTypeString(damage.Type)} ${damage.DamageString}\r\n                </div>\r\n                <div class="requirement" if.bind="unique.RequiredLevel > 0">\r\n                    Level ${unique.RequiredLevel} Required\r\n                </div>\r\n                <div class="requirement" if.bind="unique.Equipment.RequiredStrength > 0">\r\n                    ${unique.Equipment.RequiredStrength} Strength Required\r\n                </div>\r\n                <div class="requirement" if.bind="unique.Equipment.RequiredDexterity > 0">\r\n                    ${unique.Equipment.RequiredDexterity} Dexterity Required\r\n                </div>\r\n                <div class="durability mt-1" if.bind="unique.Equipment.Durability > 0">\r\n                    ${unique.Equipment.Durability} Durability\r\n                </div>\r\n                <div class="mt-2">\r\n                    <div class="enhanced" repeat.for="property of unique.Properties">\r\n                        ${property.PropertyString}\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>';
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
var _foundItems_dec, _showFoundItems_dec, _selectedEquipmentName_dec, _selectedType_dec, _selectedClass_dec, _search_dec, _Grail_decorators, _init;
_Grail_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedClass_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _showFoundItems_dec = [bindable], _foundItems_dec = [bindable];
class Grail {
  constructor() {
    __publicField(this, "uniques", json);
    __publicField(this, "filteredUniques", []);
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
    __publicField(this, "equipmentNames", [{ id: "", name: "All Equipment" }]);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedType", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "showFoundItems", __runInitializers(_init, 24, this, true)), __runInitializers(_init, 27, this);
    __publicField(this, "foundItems", __runInitializers(_init, 28, this, {})), __runInitializers(_init, 31, this);
    __publicField(this, "foundCount", 0);
  }
  binding() {
    this.loadFoundItems();
    this.filteredUniques = [...this.uniques];
    this.updateFoundCount();
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
  selectedClassChanged() {
    this.updateList();
  }
  selectedTypeChanged() {
    this.selectedEquipmentName = "";
    this.equipmentNames = [{ id: "", name: "All Equipment" }];
    if (!this.selectedType) {
      this.updateList();
      return;
    }
    const equipmentSet = /* @__PURE__ */ new Set();
    this.uniques.forEach((unique) => {
      if (unique.Equipment && unique.Equipment.Type === this.selectedType && unique.Equipment.Name) {
        equipmentSet.add(unique.Equipment.Name);
      }
    });
    equipmentSet.forEach((name2) => {
      this.equipmentNames.push({ id: name2, name: name2 });
    });
    this.updateList();
  }
  selectedEquipmentNameChanged() {
    this.updateList();
  }
  searchChanged() {
    this.updateList();
  }
  showFoundItemsChanged() {
    this.updateList();
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
    this.uniques = json.filter((unique) => !unique.Name.toLowerCase().includes("grabber") && isMatchingSearch(unique) && isMatchingClass(unique) && isMatchingType(unique) && isMatchingEquipmentName(unique) && (!this.showFoundItems || !this.foundItems[unique.Name]));
  }
  loadFoundItems() {
    const savedItems = localStorage.getItem("d2r-grail-items");
    if (savedItems) {
      this.foundItems = JSON.parse(savedItems);
    }
  }
  saveFoundItems() {
    localStorage.setItem("d2r-grail-items", JSON.stringify(this.foundItems));
  }
  updateFoundStatus(itemName) {
    this.foundItems[itemName] = !!this.foundItems[itemName];
    this.saveFoundItems();
    this.updateFoundCount();
  }
  updateFoundCount() {
    this.foundCount = Object.values(this.foundItems).filter((value) => value).length;
  }
  resetGrail() {
    if (confirm("Are you sure you want to reset your Grail progress? This cannot be undone.")) {
      this.foundItems = {};
      this.saveFoundItems();
      this.updateFoundCount();
    }
  }
  getDamageTypeString(type) {
    switch (type) {
      case 0:
        return "Damage:";
      case 1:
        return "One-Hand Damage:";
      case 2:
        return "Two-Hand Damage:";
      case 3:
        return "Throw Damage:";
      default:
        return "Damage:";
    }
  }
}
_init = __decoratorStart();
__decorateElement(_init, 5, "search", _search_dec, Grail);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Grail);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Grail);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Grail);
__decorateElement(_init, 5, "showFoundItems", _showFoundItems_dec, Grail);
__decorateElement(_init, 5, "foundItems", _foundItems_dec, Grail);
Grail = __decorateElement(_init, 0, "Grail", _Grail_decorators, Grail);
__runInitializers(_init, 1, Grail);
export {
  Grail
};
