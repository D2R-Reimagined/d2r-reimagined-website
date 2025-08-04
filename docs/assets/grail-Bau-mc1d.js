import { C as CustomElement, c as customElement } from "./index-Du7mxieL.js";
import { j as json } from "./uniques-VKbxrdFn.js";
const name = "grail";
const template = '<template>\n    <h3 class="text-center my-4">\n        Holy Grail Tracker - ${foundCount}/${uniques.length} Uniques Found (${filteredUniques.length} Displayed)\n    </h3>\n    <search-area>\n        <div class="max-w-7xl mx-auto px-4">\n            <div class="flex flex-wrap justify-center items-center text-center">\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Class"\n                                options.bind="classes"\n                                value.bind="selectedClass"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Type"\n                                options.bind="types"\n                                value.bind="selectedType"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <div class="mb-2">\n                        <moo-select\n                                class="w-full standard-betsy-select"\n                                label="Select Equipment"\n                                options.bind="equipmentNames"\n                                value.bind="selectedEquipmentName"\n                                disabled.bind="!selectedType"\n                        ></moo-select>\n                    </div>\n                </div>\n                <div class="w-full md:w-5/12 lg:w-1/4 px-2">\n                    <moo-text-field\n                            class="w-full"\n                            label="Search Uniques"\n                            type="text"\n                            value.bind="search"\n                    ></moo-text-field>\n                </div>\n            </div>\n            <div class="flex justify-center mt-4">\n                <button click.trigger="resetGrail()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">\n                    Reset Grail Progress\n                </button>\n            </div>\n        </div>\n    </search-area>\n\n    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\n        <div class="bg-gray-800 rounded shadow p-2" repeat.for="unique of filteredUniques">\n            <div class="bg-gray-800 rounded shadow relative">\n                <div class="absolute top-2 right-2">\n                    <label class="inline-flex items-center cursor-pointer">\n                        <input type="checkbox" checked.bind="foundItems[unique.Name]" change.trigger="updateFoundStatus(unique.Name)" class="sr-only peer">\n                        <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>\n                    </label>\n                </div>\n                <div class="unique-text text-lg mb-1 ${foundItems[unique.Name] ? \'text-green-400\' : \'\'}">\n                    ${unique.Name}\n                </div>\n                <div class="rarity mb-1" if.bind="unique.Rarity">\n                    Rarity: ${unique.Rarity}\n                </div>\n                <div class="armor mb-1" if.bind="unique.Equipment.Name">\n                    ${unique.Equipment.Name}\n                </div>\n                <div class="armor mb-1" if.bind="unique.Equipment.ArmorString">\n                    Armor: ${unique.Equipment.ArmorString}\n                </div>\n                <div class="damage" if.bind="unique.Equipment.DamageTypes"\n                     repeat.for="damage of unique.Equipment.DamageTypes">\n                    ${getDamageTypeString(damage.Type)} ${damage.DamageString}\n                </div>\n                <div class="requirement" if.bind="unique.RequiredLevel > 0">\n                    Level ${unique.RequiredLevel} Required\n                </div>\n                <div class="requirement" if.bind="unique.Equipment.RequiredStrength > 0">\n                    ${unique.Equipment.RequiredStrength} Strength Required\n                </div>\n                <div class="requirement" if.bind="unique.Equipment.RequiredDexterity > 0">\n                    ${unique.Equipment.RequiredDexterity} Dexterity Required\n                </div>\n                <div class="durability mt-1" if.bind="unique.Equipment.Durability > 0">\n                    ${unique.Equipment.Durability} Durability\n                </div>\n                <div class="mt-2">\n                    <div class="enhanced" repeat.for="property of unique.Properties">\n                        ${property.PropertyString}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>';
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
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) fns[i].call(self);
  return value;
};
var __decorateElement = (array, flags, name2, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p) && __getOwnPropDesc(target, name2));
  __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array[3], extraInitializers);
    it = (0, decorators[i])(target, ctx), done._ = 1;
    __expectFn(it) && (target = it);
  }
  return __decoratorMetadata(array, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra : desc : target;
};
var _Grail_decorators, _init;
_Grail_decorators = [customElement(__au2ViewDef)];
class Grail {
  uniques = json;
  filteredUniques = [];
  classes = [{ id: "", name: "All Classes" }];
  types = [{ id: "", name: "All Types" }];
  equipmentNames = [{ id: "", name: "All Equipment" }];
  selectedClass = "";
  selectedType = "";
  selectedEquipmentName = "";
  search = "";
  showFoundItems = false;
  foundItems = {};
  foundCount = 0;
  binding() {
    this.loadFoundItems();
    this.filteredUniques = [...this.uniques];
    this.updateFoundCount();
    this.setupFilterOptions();
  }
  setupFilterOptions() {
    const classSet = /* @__PURE__ */ new Set();
    this.uniques.forEach((unique) => {
      if (unique.Class) {
        classSet.add(unique.Class);
      }
    });
    classSet.forEach((className) => {
      this.classes.push({ id: className, name: className });
    });
    const typeSet = /* @__PURE__ */ new Set();
    this.uniques.forEach((unique) => {
      if (unique.Equipment && unique.Equipment.Type) {
        typeSet.add(unique.Equipment.Type);
      }
    });
    typeSet.forEach((typeName) => {
      this.types.push({ id: typeName, name: typeName });
    });
  }
  selectedClassChanged() {
    this.filterUniques();
  }
  selectedTypeChanged() {
    this.selectedEquipmentName = "";
    this.equipmentNames = [{ id: "", name: "All Equipment" }];
    if (!this.selectedType) {
      this.filterUniques();
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
    this.filterUniques();
  }
  selectedEquipmentNameChanged() {
    this.filterUniques();
  }
  searchChanged() {
    this.filterUniques();
  }
  showFoundItemsChanged() {
    this.filterUniques();
  }
  filterUniques() {
    this.filteredUniques = this.uniques.filter((unique) => {
      if (this.selectedClass && unique.Class !== this.selectedClass) {
        return false;
      }
      if (this.selectedType && (!unique.Equipment || unique.Equipment.Type !== this.selectedType)) {
        return false;
      }
      if (this.selectedEquipmentName && (!unique.Equipment || unique.Equipment.Name !== this.selectedEquipmentName)) {
        return false;
      }
      if (!this.showFoundItems && this.foundItems[unique.Name]) {
        return false;
      }
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        const nameMatch = unique.Name.toLowerCase().includes(searchLower);
        const equipmentMatch = unique.Equipment && unique.Equipment.Name && unique.Equipment.Name.toLowerCase().includes(searchLower);
        const propertyMatch = unique.Properties && unique.Properties.some((prop) => prop.PropertyString.toLowerCase().includes(searchLower));
        if (!nameMatch && !equipmentMatch && !propertyMatch) {
          return false;
        }
      }
      return true;
    });
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
Grail = __decorateElement(_init, 0, "Grail", _Grail_decorators, Grail);
__runInitializers(_init, 1, Grail);
export {
  Grail
};
