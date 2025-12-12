import { C as CustomElement, i as isBlankOrInvalid, w as watch, c as customElement, b as bindable } from "./index-04lAwL3n.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
import { a as getChainForTypeName, r as resolveBaseTypeName, b as buildOptionsForPresentTypes, p as prependTypeResetOption, t as type_filtering_options } from "./filter-helpers-DQPTPo0a.js";
import { r as runewordsJson } from "./runewords-DIDEqgbm.js";
import { s as setsJson } from "./sets-Dh9IIbeB.js";
import { u as uniquesJson } from "./uniques-DpTOnbm-.js";
const name = "grail";
const template = `<template>\r
    <h3 class="text-center my-4">\r
        <span class="unique-text">- Holy Grail Tracker -</span>\r
        <template if.bind="selectedCategory === 'sets'">\r
            <div>\r
                <span class="rarity-text">\${setItemFoundCount}</span>/<span\r
                    class="rarity-text">\${setItemTotalCount}</span>\r
                Items Found\r
                (<span class="rarity-text">\${setItemsDisplayedCount}</span> Displayed)\r
            </div>\r
            <div>\r
                <span class="rarity-text">\${foundCount}</span>/<span class="rarity-text">\${totalCount}</span>\r
                Sets Completed\r
                (<span class="rarity-text">\${displayedCount}</span> Displayed)\r
            </div>\r
        </template>\r
        <template if.bind="selectedCategory !== 'sets'">\r
            <div>\r
                <span class="rarity-text">\${foundCount}</span>/<span class="rarity-text">\${totalCount}</span>\r
                Items Found\r
                (<span class="rarity-text">\${displayedCount}</span> Displayed)\r
            </div>\r
        </template>\r
    </h3>\r
\r
    <search-area>\r
        <div class="max-w-11/12 m-auto px-4">\r
            <div class="flex flex-wrap justify-center items-start">\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="category" class="select-base peer" value.bind="selectedCategory" required>\r
                            <option repeat.for="opt of categories" value.bind="opt.value">\${opt.label}</option>\r
                        </select>\r
                        <label for="category" class="floating-label">Category</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="ficlass" class="select-base peer" value.bind="selectedClass" required>\r
                            <option repeat.for="opt of classes" value.bind="opt.value">\${opt.label}</option>\r
                        </select>\r
                        <label for="ficlass" class="floating-label">Select Class</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="itype" class="select-base peer" value.bind="selectedTypeBase" required>\r
                            <option repeat.for="opt of types"\r
                                    value.bind="opt.value && opt.value.length ? opt.value[0] : ''">\${opt.label}\r
                            </option>\r
                        </select>\r
                        <label for="itype" class="floating-label">Select Type</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <select id="eqsel" class="select-base peer"\r
                                value.bind="selectedEquipmentName"\r
                                disabled.bind="selectedCategory === 'runewords' || !selectedTypeBase" required>\r
                            <option repeat.for="opt of equipmentNames" value.bind="opt.id">\${opt.name}</option>\r
                        </select>\r
                        <label for="eqsel" class="floating-label">Select Equipment</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-70 px-2">\r
                    <div class="relative mb-2">\r
                        <input id="inputsearch" class="select-base peer" type="text" value.bind="search" required/>\r
                        <label for="inputsearch" class="floating-label">Filter by Input</label>\r
                    </div>\r
                    <div class="flex mb-2">\r
                        <input id="hidevan" type="checkbox" class="check-base" checked.bind="hideVanilla">\r
                        <label for="hidevan" class="block type-text ml-1">Hide Vanilla</label>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-35 px-2">\r
                    <div class="mb-2">\r
                        <button id="filterreset" class="button-base" type="button" click.trigger="resetFilters()">\r
                            Reset Filters\r
                        </button>\r
                    </div>\r
                </div>\r
\r
            </div>\r
        </div>\r
    </search-area>\r
\r
            <div class="w-full lg:w-fit m-auto lg:min-w-35 px-2 pt-2">\r
                <div class="mb-2 flex">\r
                    <input id="hidefound" type="checkbox" class="check-base" checked.bind="showFoundItems">\r
                    <label for="hidefound" class="block type-text ml-1">Hide Found Items</label>\r
                </div>\r
            </div>\r
            <div class="w-full lg:w-fit m-auto lg:min-w-35 p-2">\r
                    <button type="button" click.trigger="resetGrail()" class="button-base">\r
                        Reset Grail Category Progress\r
                    </button>\r
                </div>\r
\r
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 text-center mt-5">\r
\r
        <div class="bg-gray-800 rounded-lg shadow p-2" repeat.for="unique of filteredUniques"\r
             if.bind="selectedCategory === 'uniques'">\r
            <div class="bg-gray-800 rounded relative">\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox" checked.bind="foundUniques[unique.Name]"\r
                               change.trigger="updateFoundStatus(unique.Name)" class="sr-only peer">\r
                        <div class="relative w-4 h-2 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-green-600"></div>\r
                    </label>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="unique-text text-lg \${foundUniques[unique.Name] ? 'found' : ''}">\r
                        \${unique.Name}\r
                    </div>\r
                    <div class="rarity-text" if.bind="unique.Rarity">\r
                        Rarity: \${unique.Rarity}\r
                    </div>\r
                    <div class="rarity-text" if.bind="unique.Vanilla">\r
                        \${unique.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="type-text" if.bind="unique.Equipment.Name">\r
                        \${unique.Equipment.Name}\r
                    </div>\r
                    <div class="type-text" if.bind="unique.Equipment.ArmorString">\r
                        Defense: \${unique.Equipment.ArmorString}\r
                    </div>\r
                    <div class="type-text"\r
                         if.bind="unique.Equipment.Block !== null && unique.Equipment.Block !== undefined && unique.Equipment.Block > 0">\r
                        Block: \${unique.Equipment.Block}%\r
                    </div>\r
                    <div class="type-text" if.bind="unique.Equipment.DamageTypes"\r
                         repeat.for="damage of unique.Equipment.DamageTypes">\r
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}\r
                    </div>\r
                    <div class="type-text" if.bind="unique.Equipment.Durability > 0">\r
                        Durability: \${unique.Equipment.Durability}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="requirement-text"\r
                         if.bind="unique.Equipment.RequiredClass && unique.Equipment.RequiredClass.length">\r
                        (\${unique.Equipment.RequiredClass} Only)\r
                    </div>\r
                    <div class="requirement-text" if.bind="unique.Equipment.RequiredDexterity > 0">\r
                        Required Dexterity: \${unique.Equipment.RequiredDexterity}\r
                    </div>\r
                    <div class="requirement-text" if.bind="unique.Equipment.RequiredStrength > 0">\r
                        Required Strength: \${unique.Equipment.RequiredStrength}\r
                    </div>\r
                    <div class="requirement-text">\r
                        Required Level: \${unique.RequiredLevel > 0 ? unique.RequiredLevel : 1}\r
                    </div>\r
                </div>\r
\r
                <div>\r
                    <div class="prop-text" repeat.for="property of unique.Properties">\r
                        \${property.PropertyString}\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <div class="bg-gray-800 rounded shadow p-2" repeat.for="setItem of filteredSetItems"\r
             if.bind="selectedCategory === 'sets'">\r
            <div class="bg-gray-800 rounded relative">\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox" checked.bind="foundSets[getSetItemKey(setItem)]"\r
                               change.trigger="updateFoundStatus(getSetItemKey(setItem))" class="sr-only peer">\r
                        <div class="relative w-4 h-2 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-green-600"></div>\r
                    </label>\r
                </div>\r
\r
                <div class="mt-2 mb-1">\r
                    <div class=" set-text-light text-lg \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">\r
                        \${setItem.Name}\r
                    </div>\r
                    <div class=" set-text  opacity-90 \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">\r
                        (\${setItem.Set})\r
                    </div>\r
                    <div class="rarity-text" if.bind="setItem.Rarity">\r
                        Rarity: \${setItem.Rarity}\r
                    </div>\r
                    <div class="rarity-text" if.bind="setItem.Vanilla">\r
                        \${setItem.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="type-text" if.bind="setItem.Equipment.Name">\r
                        \${setItem.Equipment.Name}\r
                    </div>\r
                    <div class="type-text" if.bind="setItem.Equipment.ArmorString">\r
                        Defense: \${setItem.Equipment.ArmorString}\r
                    </div>\r
                    <div class="type-text"\r
                         if.bind="setItem.Equipment.Block !== null && setItem.Equipment.Block !== undefined && setItem.Equipment.Block > 0">\r
                        Block: \${setItem.Equipment.Block}%\r
                    </div>\r
                    <div class="type-text" if.bind="setItem.Equipment.DamageTypes"\r
                         repeat.for="damage of setItem.Equipment.DamageTypes">\r
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}\r
                    </div>\r
                    <div class="type-text" if.bind="setItem.Equipment.Durability > 0">\r
                        Durability: \${setItem.Equipment.Durability}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="requirement-text"\r
                         if.bind="setItem.Equipment.RequiredClass && setItem.Equipment.RequiredClass.length">\r
                        (\${setItem.Equipment.RequiredClass} Only)\r
                    </div>\r
                    <div class="requirement-text" if.bind="setItem.Equipment.RequiredDexterity > 0">\r
                        Required Dexterity: \${setItem.Equipment.RequiredDexterity}\r
                    </div>\r
                    <div class="requirement-text" if.bind="setItem.Equipment.RequiredStrength > 0">\r
                        Required Strength: \${setItem.Equipment.RequiredStrength}\r
                    </div>\r
                    <div class="requirement-text">\r
                        Required Level: \${setItem.RequiredLevel > 0 ? setItem.RequiredLevel : 1}\r
                    </div>\r
                </div>\r
\r
                <div>\r
                    <div class="prop-text" repeat.for="property of setItem.Properties">\r
                        \${property.PropertyString}\r
                    </div>\r
                </div>\r
                <div class=" set-text" repeat.for="setProperty of setItem.SetPropertiesString">\r
                    \${setProperty}\r
                </div>\r
            </div>\r
        </div>\r
\r
        <div class="bg-gray-800 rounded shadow p-2" repeat.for="runeword of filteredRunewords"\r
             if.bind="selectedCategory === 'runewords'">\r
            <div class="bg-gray-800 rounded relative">\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox" checked.bind="foundRunewords[runeword.Name]"\r
                               change.trigger="updateFoundStatus(runeword.Name)" class="sr-only peer">\r
                        <div class="relative w-4 h-2 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-green-600"></div>\r
                    </label>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="unique-text text-lg mb-1 \${foundRunewords[runeword.Name] ? 'found' : ''}">\r
                        \${runeword.Name}\r
                    </div>\r
                    <div class="rarity-text" if.bind="runeword.Vanilla">\r
                        \${runeword.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="type-text mb-1">\r
                    <span repeat.for="type of runeword.Types">\r
                        \${type.Name} \${$index + 1 !== runeword.Types.length ? ' or ' : ''}\r
                    </span>\r
                </div>\r
\r
                <div class="type-text">\r
                    <span repeat.for="rune of runeword.Runes">\r
                        \${rune.Name} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}\r
                    </span>\r
                </div>\r
\r
                <div class="requirement-text my-1">\r
                    Required Level: \${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1}\r
                </div>\r
\r
                <div>\r
                    <div class="prop-text" repeat.for="property of runeword.Properties">\r
                        \${property.PropertyString}\r
                    </div>\r
                </div>\r
\r
            </div>\r
        </div>\r
    </div>\r
</template>`;
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
var _selectedTypeChanged_dec, _foundRunewords_dec, _foundSets_dec, _foundUniques_dec, _showFoundItems_dec, _exclusiveType_dec, _hideVanilla_dec, _selectedEquipmentName_dec, _selectedType_dec, _selectedTypeBase_dec, _selectedClass_dec, _search_dec, _selectedCategory_dec, _Grail_decorators, _init;
_Grail_decorators = [customElement(__au2ViewDef)], _selectedCategory_dec = [bindable], _search_dec = [bindable], _selectedClass_dec = [bindable], _selectedTypeBase_dec = [bindable], _selectedType_dec = [bindable], _selectedEquipmentName_dec = [bindable], _hideVanilla_dec = [bindable], _exclusiveType_dec = [bindable], _showFoundItems_dec = [bindable], _foundUniques_dec = [bindable], _foundSets_dec = [bindable], _foundRunewords_dec = [bindable], _selectedTypeChanged_dec = [watch("selectedType")];
class Grail {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "uniques", uniquesJson);
    __publicField(this, "filteredUniques", []);
    __publicField(this, "allSetItems", []);
    __publicField(this, "filteredSetItems", []);
    __publicField(this, "runewords", runewordsJson);
    __publicField(this, "filteredRunewords", []);
    __publicField(this, "classes", [
      { value: "", label: "-" },
      { value: "Amazon", label: "Amazon" },
      { value: "Assassin", label: "Assassin" },
      { value: "Barbarian", label: "Barbarian" },
      { value: "Druid", label: "Druid" },
      { value: "Necromancer", label: "Necromancer" },
      { value: "Paladin", label: "Paladin" },
      { value: "Sorceress", label: "Sorceress" }
    ]);
    __publicField(this, "equipmentNames", [{ id: "", name: "-" }]);
    __publicField(this, "categories", [
      { value: "uniques", label: "Uniques" },
      { value: "sets", label: "Sets" },
      { value: "runewords", label: "Runewords" }
    ]);
    __publicField(this, "selectedCategory", __runInitializers(_init, 8, this, "uniques")), __runInitializers(_init, 11, this);
    __publicField(this, "search", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "selectedTypeBase", __runInitializers(_init, 20, this)), __runInitializers(_init, 23, this);
    __publicField(this, "selectedType", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "selectedEquipmentName", __runInitializers(_init, 28, this)), __runInitializers(_init, 31, this);
    __publicField(this, "hideVanilla", __runInitializers(_init, 32, this, false)), __runInitializers(_init, 35, this);
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "exclusiveType", __runInitializers(_init, 36, this, false)), __runInitializers(_init, 39, this);
    __publicField(this, "showFoundItems", __runInitializers(_init, 40, this, false)), __runInitializers(_init, 43, this);
    __publicField(this, "foundUniques", __runInitializers(_init, 44, this, {})), __runInitializers(_init, 47, this);
    __publicField(this, "foundSets", __runInitializers(_init, 48, this, {})), __runInitializers(_init, 51, this);
    __publicField(this, "foundRunewords", __runInitializers(_init, 52, this, {})), __runInitializers(_init, 55, this);
    __publicField(this, "foundCount", 0);
    __publicField(this, "totalCount", 0);
    __publicField(this, "displayedCount", 0);
    __publicField(this, "setItemFoundCount", 0);
    __publicField(this, "setItemTotalCount", 0);
    __publicField(this, "setItemsDisplayedCount", 0);
    __publicField(this, "_debouncedSaveFound");
    __publicField(this, "_debouncedApplyFilters");
  }
  binding() {
    try {
      const sets = setsJson;
      this.allSetItems = [];
      for (const s of sets) {
        for (const it of s.SetItems || []) {
          this.allSetItems.push(it);
        }
      }
    } catch {
      this.allSetItems = [];
    }
    this.loadFoundItems();
    this.readUrlStateSafely();
    this.rebuildTypeOptions();
    if (this.selectedTypeBase) {
      const opt = this.types.find((o) => o.value && o.value[0] === this.selectedTypeBase);
      this.selectedType = opt?.value ?? [this.selectedTypeBase];
    } else {
      this.selectedType = void 0;
    }
    this.equipmentNames = [{ id: "", name: "-" }];
    if (this.selectedType && this.selectedType.length > 0 && this.selectedCategory !== "runewords") {
      try {
        const set = /* @__PURE__ */ new Set();
        if (this.selectedCategory === "uniques") {
          const selectedBases = new Set(this.selectedType);
          for (const u of this.uniques) {
            const base = getChainForTypeName(u?.Type ?? "")[0] || (u?.Type ?? "");
            if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
            if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
          }
        }
        for (const name2 of set) this.equipmentNames.push({ id: name2, name: name2 });
      } catch {
      }
    }
    this.setItemTotalCount = this.allSetItems.length;
    this._debouncedSaveFound = debounce(() => this.saveFoundItems(), 200);
    this._debouncedApplyFilters = debounce(() => {
      this.updateList();
      this.updateUrl();
    }, 300);
    this.updateList();
  }
  // Reflect current state back into the URL
  attached() {
    this.updateUrl();
  }
  // When navigating away, clear Grail-related params from the URL so returning starts empty
  detached() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("g-category");
      url.searchParams.delete("g-class");
      url.searchParams.delete("g-type");
      url.searchParams.delete("g-equipment");
      url.searchParams.delete("g-search");
      url.searchParams.delete("g-hideFound");
      url.searchParams.delete("g-hideVanilla");
      window.history.pushState({}, "", url.toString());
    } catch {
    }
  }
  // Defensive URL parse (Grail-scoped params only)
  readUrlStateSafely() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = (urlParams.get("g-category") || "").toLowerCase();
      if (cat === "uniques" || cat === "sets" || cat === "runewords") {
        this.selectedCategory = cat;
      }
      const cls = urlParams.get("g-class");
      if (cls && !isBlankOrInvalid(cls)) this.selectedClass = cls;
      const t = urlParams.get("g-type");
      if (t && !isBlankOrInvalid(t)) {
        this.selectedTypeBase = t;
      } else {
        this.selectedTypeBase = void 0;
      }
      const eq = urlParams.get("g-equipment");
      if (eq && !isBlankOrInvalid(eq)) this.selectedEquipmentName = eq;
      const s = urlParams.get("g-search");
      if (s && !isBlankOrInvalid(s)) this.search = s;
      const hf = urlParams.get("g-hideFound");
      this.showFoundItems = hf === "true" || hf === "1";
      const hv = urlParams.get("g-hideVanilla");
      if (hv === "true" || hv === "1") this.hideVanilla = true;
    } catch {
    }
  }
  // Update browser URL with current selection and filters (no reload)
  updateUrl() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("g-category", this.selectedCategory);
      if (this.selectedClass && this.selectedClass.trim() !== "" && !isBlankOrInvalid(this.selectedClass)) {
        url.searchParams.set("g-class", this.selectedClass);
      } else {
        url.searchParams.delete("g-class");
      }
      if (this.selectedTypeBase && !isBlankOrInvalid(this.selectedTypeBase)) {
        url.searchParams.set("g-type", this.selectedTypeBase);
      } else {
        url.searchParams.delete("g-type");
      }
      if (this.selectedEquipmentName && this.selectedEquipmentName.trim() !== "" && !isBlankOrInvalid(this.selectedEquipmentName)) {
        url.searchParams.set("g-equipment", this.selectedEquipmentName);
      } else {
        url.searchParams.delete("g-equipment");
      }
      if (this.search && this.search.trim() !== "" && !isBlankOrInvalid(this.search)) {
        url.searchParams.set("g-search", this.search);
      } else {
        url.searchParams.delete("g-search");
      }
      if (this.showFoundItems) {
        url.searchParams.set("g-hideFound", "true");
      } else {
        url.searchParams.delete("g-hideFound");
      }
      if (this.hideVanilla) {
        url.searchParams.set("g-hideVanilla", "true");
      } else {
        url.searchParams.delete("g-hideVanilla");
      }
      window.history.pushState({}, "", url.toString());
    } catch {
    }
  }
  rebuildTypeOptions() {
    const present = /* @__PURE__ */ new Set();
    try {
      if (this.selectedCategory === "uniques") {
        for (const u of uniquesJson) {
          const base = resolveBaseTypeName(u?.Type ?? "");
          if (base) present.add(base);
        }
      } else if (this.selectedCategory === "sets") {
        for (const s of setsJson) {
          for (const it of s?.SetItems || []) {
            const base = resolveBaseTypeName(it?.Type ?? "");
            if (base) present.add(base);
          }
        }
      } else if (this.selectedCategory === "runewords") {
        for (const rw of runewordsJson) {
          const types = Array.isArray(rw?.Types) ? rw.Types : [];
          for (const t of types) {
            const base = resolveBaseTypeName(t?.Name ?? "");
            if (base) present.add(base);
          }
        }
      }
    } catch {
    }
    this.types = buildOptionsForPresentTypes(
      type_filtering_options,
      present,
      { dedupeByBase: true, preferLabelStartsWith: "Any " }
    );
    this.types = prependTypeResetOption(this.types);
  }
  selectedCategoryChanged() {
    this.selectedClass = void 0;
    this.selectedType = void 0;
    this.selectedEquipmentName = "";
    this.equipmentNames = [{ id: "", name: "-" }];
    this.rebuildTypeOptions();
    this.updateList();
    this.updateTotalCount();
    this.updateUrl();
  }
  selectedClassChanged() {
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  selectedTypeChanged() {
    this.selectedEquipmentName = "";
    this.equipmentNames = [{ id: "", name: "-" }];
    if (!this.selectedType || this.selectedType.length === 0) {
      this.updateList();
      this.updateUrl();
      return;
    }
    if (this.selectedCategory !== "runewords") {
      const set = /* @__PURE__ */ new Set();
      const selectedBases = new Set(this.selectedType);
      if (this.selectedCategory === "uniques") {
        for (const u of this.uniques) {
          const base = getChainForTypeName(u?.Type ?? "")[0] || (u?.Type ?? "");
          if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
        }
      } else if (this.selectedCategory === "sets") {
        for (const it of this.allSetItems) {
          const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
          if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
        }
      }
      for (const name2 of set) this.equipmentNames.push({ id: name2, name: name2 });
    }
    this.updateList();
    this.updateUrl();
  }
  searchChanged() {
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  showFoundItemsChanged() {
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  hideVanillaChanged() {
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  selectedTypeBaseChanged() {
    if (this.selectedTypeBase && this.selectedTypeBase !== "") {
      const opt = this.types.find((o) => o.value && o.value[0] === this.selectedTypeBase);
      this.selectedType = opt?.value ?? [this.selectedTypeBase];
    } else {
      this.selectedType = void 0;
      this.selectedEquipmentName = "";
    }
    this.equipmentNames = [{ id: "", name: "All Equipment" }];
    if (this.selectedType && this.selectedType.length > 0 && this.selectedCategory !== "runewords") {
      try {
        const set = /* @__PURE__ */ new Set();
        if (this.selectedCategory === "uniques") {
          const selectedBases = new Set(this.selectedType);
          for (const u of this.uniques) {
            const base = getChainForTypeName(u?.Type ?? "")[0] || (u?.Type ?? "");
            if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
            if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
          }
        }
        for (const name2 of set) this.equipmentNames.push({ id: name2, name: name2 });
      } catch {
      }
    }
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  selectedEquipmentNameChanged() {
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  // Reset only the filter controls (not found-state or progress)
  resetFilters() {
    this.search = "";
    this.selectedClass = "";
    this.selectedTypeBase = "";
    this.selectedType = void 0;
    this.selectedEquipmentName = "";
    this.equipmentNames = [{ id: "", name: "All Equipment" }];
    this.showFoundItems = false;
    this.hideVanilla = false;
    this.rebuildTypeOptions();
    this.updateList();
    this.updateTotalCount();
    this.updateUrl();
  }
  updateList() {
    const searchRaw = (this.search || "").trim().toLowerCase();
    const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
    const selectedTypeSet = this.selectedType && this.selectedType.length > 0 ? new Set(this.selectedType) : null;
    if (this.selectedCategory === "uniques") {
      const result = uniquesJson.filter((unique) => {
        const okClass = !this.selectedClass || String(unique?.Equipment?.RequiredClass || "").toLowerCase().includes(String(this.selectedClass).toLowerCase());
        const okType = !selectedTypeSet || selectedTypeSet.has(getChainForTypeName(unique?.Type ?? "")[0] || (unique?.Type ?? ""));
        const okEquip = !this.selectedEquipmentName || String(unique?.Equipment?.Name || "") === this.selectedEquipmentName;
        const okVanilla = !this.hideVanilla || String(unique?.Vanilla || "").toUpperCase() !== "Y";
        const okSearch = !searchTokens.length || (() => {
          const hay = [
            String(unique?.Name || ""),
            ...Array.isArray(unique?.Properties) ? unique.Properties.map((p) => String(p?.PropertyString || "")) : [],
            String(unique?.Equipment?.Name || "")
          ].filter(Boolean).join(" ").toLowerCase();
          return searchTokens.every((t) => hay.includes(t));
        })();
        const notGrabber = !String(unique?.Name || "").toLowerCase().includes("grabber");
        const key = this.getUniqueKey(unique);
        const okFound = !this.showFoundItems || !this.foundUniques[key];
        return okClass && okType && okEquip && okVanilla && okSearch && notGrabber && okFound;
      });
      this.filteredUniques = result;
      this.displayedCount = this.filteredUniques.length;
    } else if (this.selectedCategory === "sets") {
      const result = this.allSetItems.filter((item) => {
        const okClass = !this.selectedClass || String(item?.Equipment?.RequiredClass || "").toLowerCase().includes(String(this.selectedClass).toLowerCase());
        const okType = !selectedTypeSet || selectedTypeSet.has(getChainForTypeName(item?.Type ?? "")[0] || (item?.Type ?? ""));
        const okEquip = !this.selectedEquipmentName || String(item?.Equipment?.Name || "") === this.selectedEquipmentName;
        const okVanilla = !this.hideVanilla || String(item?.Vanilla || "").toUpperCase() !== "Y";
        const okSearch = !searchTokens.length || (() => {
          const hay = [
            String(item?.Name || ""),
            ...Array.isArray(item?.Properties) ? item.Properties.map((p) => String(p?.PropertyString || "")) : [],
            ...Array.isArray(item?.SetPropertiesString) ? item.SetPropertiesString.map((s) => String(s || "")) : [],
            String(item?.Equipment?.Name || "")
          ].filter(Boolean).join(" ").toLowerCase();
          return searchTokens.every((t) => hay.includes(t));
        })();
        const key = this.getSetItemKey(item);
        const okFound = !this.showFoundItems || !this.foundSets[key];
        return okClass && okType && okEquip && okVanilla && okSearch && okFound;
      });
      this.filteredSetItems = result;
      this.setItemsDisplayedCount = this.filteredSetItems.length;
      const displayedSets = /* @__PURE__ */ new Set();
      for (const it of this.filteredSetItems) {
        if (it?.Set) displayedSets.add(String(it.Set));
      }
      this.displayedCount = displayedSets.size;
    } else if (this.selectedCategory === "runewords") {
      let list = this.runewords;
      if (this.selectedType?.length > 0) {
        const selectedBase = resolveBaseTypeName(this.selectedType[0] ?? "");
        if (selectedBase) {
          const selectedChain = getChainForTypeName(selectedBase);
          const selectedChainSet = new Set(selectedChain);
          let hasDescendantInData = false;
          if (!this.exclusiveType) {
            try {
              outer: for (const rw of this.runewords) {
                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                for (let i = 0; i < types.length; i++) {
                  const raw = types[i]?.Name != null ? String(types[i].Name) : "";
                  const chain = getChainForTypeName(raw);
                  if (!chain || chain.length === 0) continue;
                  const base = chain[0];
                  if (base !== selectedBase && chain.indexOf(selectedBase) !== -1) {
                    hasDescendantInData = true;
                    break outer;
                  }
                }
              }
            } catch {
              hasDescendantInData = false;
            }
          }
          list = list.filter((rw) => {
            const types = Array.isArray(rw.Types) ? rw.Types : [];
            for (let i = 0; i < types.length; i++) {
              const raw = types[i]?.Name != null ? String(types[i].Name) : "";
              const chain = getChainForTypeName(raw);
              if (!chain || chain.length === 0) continue;
              const itemBase = chain[0];
              if (this.exclusiveType) {
                if (itemBase === selectedBase) return true;
              } else if (hasDescendantInData) {
                if (chain.indexOf(selectedBase) !== -1) return true;
              } else {
                if (selectedChainSet.has(itemBase)) return true;
              }
            }
            return false;
          });
        }
      }
      const result = list.filter((rw) => {
        const okVanilla = !this.hideVanilla || String(rw?.Vanilla || "").toUpperCase() !== "Y";
        const okSearch = !searchTokens.length || (() => {
          const hay = [
            String(rw?.Name || ""),
            ...Array.isArray(rw?.Properties) ? rw.Properties.map((p) => String(p?.PropertyString || "")) : [],
            ...Array.isArray(rw?.Types) ? rw.Types.map((t) => String(t?.Name || "")) : []
          ].filter(Boolean).join(" ").toLowerCase();
          return searchTokens.every((t) => hay.includes(t));
        })();
        const key = this.getRunewordKey(rw);
        const okFound = !this.showFoundItems || !this.foundRunewords[key];
        return okVanilla && okSearch && okFound;
      });
      this.filteredRunewords = result;
      this.displayedCount = this.filteredRunewords.length;
    }
    this.updateFoundCount();
    this.updateTotalCount();
    this.updateSetCounters();
  }
  loadFoundItems() {
    const legacy = localStorage.getItem("d2r-grail-items");
    const u = localStorage.getItem("d2r-grail-uniques");
    if (legacy && !u) {
      try {
        localStorage.setItem("d2r-grail-uniques", legacy);
      } catch {
      }
      try {
        localStorage.removeItem("d2r-grail-items");
      } catch {
      }
    }
    const savedU = localStorage.getItem("d2r-grail-uniques");
    const savedS = localStorage.getItem("d2r-grail-sets");
    const savedR = localStorage.getItem("d2r-grail-runewords");
    if (savedU) this.foundUniques = JSON.parse(savedU);
    if (savedS) this.foundSets = JSON.parse(savedS);
    if (savedR) this.foundRunewords = JSON.parse(savedR);
  }
  saveFoundItems() {
    try {
      localStorage.setItem("d2r-grail-uniques", JSON.stringify(this.foundUniques));
    } catch {
    }
    try {
      localStorage.setItem("d2r-grail-sets", JSON.stringify(this.foundSets));
    } catch {
    }
    try {
      localStorage.setItem("d2r-grail-runewords", JSON.stringify(this.foundRunewords));
    } catch {
    }
  }
  updateFoundStatus(_itemKey) {
    if (this._debouncedSaveFound) this._debouncedSaveFound();
    if (this._debouncedApplyFilters) this._debouncedApplyFilters();
  }
  updateFoundCount() {
    if (this.selectedCategory === "uniques") {
      this.foundCount = Object.values(this.foundUniques).filter(Boolean).length;
    } else if (this.selectedCategory === "sets") {
      this.foundCount = this.computeCompletedSetsCount();
    } else if (this.selectedCategory === "runewords") {
      this.foundCount = Object.values(this.foundRunewords).filter(Boolean).length;
    } else {
      this.foundCount = 0;
    }
  }
  updateTotalCount() {
    if (this.selectedCategory === "uniques") {
      this.totalCount = uniquesJson.length;
    } else if (this.selectedCategory === "sets") {
      try {
        this.totalCount = setsJson.length;
      } catch {
        this.totalCount = 0;
      }
    } else if (this.selectedCategory === "runewords") {
      this.totalCount = this.runewords.length;
    } else {
      this.totalCount = 0;
    }
  }
  resetGrail() {
    if (confirm("Are you sure you want to reset your Grail progress for this category? This cannot be undone.")) {
      if (this.selectedCategory === "uniques") {
        this.foundUniques = {};
      } else if (this.selectedCategory === "sets") {
        this.foundSets = {};
      } else if (this.selectedCategory === "runewords") {
        this.foundRunewords = {};
      }
      this.saveFoundItems();
      this.updateFoundCount();
      this.updateList();
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
  // Helpers for keys and equipment name list
  getUniqueKey(u) {
    return String(u?.Name || "");
  }
  getSetItemKey(it) {
    return `${String(it?.Set || "")}::${String(it?.Name || "")}`;
  }
  getRunewordKey(rw) {
    return String(rw?.Name || "");
  }
  // Count fully completed sets based on found set items
  computeCompletedSetsCount() {
    try {
      let completed = 0;
      for (const set of setsJson) {
        const items = Array.isArray(set?.SetItems) ? set.SetItems : [];
        if (items.length === 0) continue;
        let allFound = true;
        for (const it of items) {
          const key = this.getSetItemKey(it);
          if (!this.foundSets[key]) {
            allFound = false;
            break;
          }
        }
        if (allFound) completed++;
      }
      return completed;
    } catch {
      return 0;
    }
  }
  // Maintain original item-based counters for Sets header first line
  updateSetCounters() {
    try {
      this.setItemTotalCount = this.allSetItems.length;
    } catch {
      this.setItemTotalCount = 0;
    }
    try {
      this.setItemFoundCount = Object.values(this.foundSets).filter(Boolean).length;
    } catch {
      this.setItemFoundCount = 0;
    }
    if (this.selectedCategory !== "sets") {
      this.setItemsDisplayedCount = this.setItemsDisplayedCount;
    }
  }
  getUniqueEquipmentNames() {
    const set = /* @__PURE__ */ new Set();
    if (this.selectedCategory === "uniques") {
      for (const u of this.uniques) {
        if ((!this.selectedType || u.Type === this.selectedType) && u?.Equipment?.Name) {
          set.add(u.Equipment.Name);
        }
      }
    } else if (this.selectedCategory === "sets") {
      for (const it of this.allSetItems) {
        if ((!this.selectedType || it.Type === this.selectedType) && it?.Equipment?.Name) {
          set.add(it.Equipment.Name);
        }
      }
    }
    const result = [{ id: "", name: "All Equipment" }];
    for (const name2 of Array.from(set).sort()) {
      result.push({ id: name2, name: name2 });
    }
    return result;
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "selectedTypeChanged", _selectedTypeChanged_dec, Grail);
__decorateElement(_init, 5, "selectedCategory", _selectedCategory_dec, Grail);
__decorateElement(_init, 5, "search", _search_dec, Grail);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, Grail);
__decorateElement(_init, 5, "selectedTypeBase", _selectedTypeBase_dec, Grail);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Grail);
__decorateElement(_init, 5, "selectedEquipmentName", _selectedEquipmentName_dec, Grail);
__decorateElement(_init, 5, "hideVanilla", _hideVanilla_dec, Grail);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Grail);
__decorateElement(_init, 5, "showFoundItems", _showFoundItems_dec, Grail);
__decorateElement(_init, 5, "foundUniques", _foundUniques_dec, Grail);
__decorateElement(_init, 5, "foundSets", _foundSets_dec, Grail);
__decorateElement(_init, 5, "foundRunewords", _foundRunewords_dec, Grail);
Grail = __decorateElement(_init, 0, "Grail", _Grail_decorators, Grail);
__runInitializers(_init, 1, Grail);
export {
  Grail
};
