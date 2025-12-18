import { C as CustomElement, i as isBlankOrInvalid, w as watch, c as customElement, b as bindable } from "./index-BcLyVs97.js";
import { c as getChainForTypeName, r as resolveBaseTypeName, b as buildOptionsForPresentTypes, p as prependTypeResetOption, a as tokenizeSearch, i as isVanillaItem, t as type_filtering_options } from "./filter-helpers-OZCyS2Ps.js";
import { c as character_class_options } from "./character-classes-LLAbBzNg.js";
import { g as getDamageTypeString } from "./damage-type-Du-j2Hbt.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { r as runewordsJson } from "./runewords-9XTgQhJw.js";
import { s as setsJson } from "./sets-BTNJ3NrF.js";
import { u as uniquesJson } from "./uniques-PVVDDl-d.js";
const name = "grail";
const template = `<template>\r
    <h3 class="text-lg type-text text-center items-center mx-auto my-4">\r
        <span class="unique-text">- Holy Grail Tracker -</span>\r
        <template if.bind="selectedCategory === 'sets'">\r
            <div>\r
                <span class="rarity-text">\${setItemFoundCount}</span>/<span\r
                    class="rarity-text">\${setItemTotalCount}</span>\r
                Items Found\r
                (<span class="rarity-text">\${setItemsDisplayedCount}</span> Displayed)\r
            </div>\r
            <div>\r
                <span class="rarity-text">\${foundCount}</span>/<span\r
                    class="rarity-text">\${totalCount}</span>\r
                Sets Completed\r
                (<span class="rarity-text">\${displayedCount}</span> Displayed)\r
            </div>\r
        </template>\r
        <template if.bind="selectedCategory !== 'sets'">\r
            <div class="mb-11">\r
                <span class="rarity-text">\${foundCount}</span>/<span\r
                    class="rarity-text">\${totalCount}</span>\r
                Items Found\r
                (<span class="rarity-text">\${displayedCount}</span> Displayed)\r
            </div>\r
        </template>\r
    </h3>\r
\r
    <div class="flex flex-col items-center gap-2 px-5 pb-5">\r
        <div class="w-full lg:w-85" data-help-text="Reset the tracked progress for the current Grail category only." data-tooltip-placement="top">\r
            <div class="flex items-stretch">\r
                <div class="relative flex-1">\r
                    <button id="resetgrailcat" type="button" click.trigger="resetGrail()" class="button-base">\r
                        Reset Grail Category Progress\r
                    </button>\r
                </div>\r
                <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetgrailcat">\r
                    <span class="mso">info</span>\r
                    <span class="sr-only">More info about Reset Grail Category Progress</span>\r
                </button>\r
            </div>\r
        </div>\r
        <div class="w-full lg:w-85" data-help-text="Filter toggle to hide items you've already found.">\r
            <div class="flex items-stretch">\r
                <div class="relative flex-1">\r
                    <button id="hidefounditems" type="button" class="vanilla-button flex-row-reverse justify-between"\r
                            aria-pressed.bind="showFoundItems"\r
                            click.trigger="showFoundItems = !showFoundItems"><span class="vanilla-indicator"></span>\r
                        Hide Found Items\r
                    </button>\r
                </div>\r
                <button type="button" class="m-info-button" aria-expanded="false" data-info-for="hidefounditems">\r
                    <span class="mso">info</span>\r
                    <span class="sr-only">More info about the Hide Found Items button</span>\r
                </button>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <search-area>\r
        <div class="w-full m-auto px-5 py-2">\r
            <div class="flex flex-wrap justify-center items-start gap-2">\r
\r
                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Choose the Grail category list.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <select id="category" class="select-base peer" value.bind="selectedCategory">\r
                                <option repeat.for="opt of categories" value.bind="opt.value">\${opt.label}</option>\r
                            </select>\r
                            <label for="category" class="floating-label">Select Category</label>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="category">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Category filter</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by character class.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <select id="ficlass" class="select-base peer" value.bind="selectedClass">\r
                                <option repeat.for="opt of classes" value.bind="opt.value">\${opt.label}</option>\r
                            </select>\r
                            <label for="ficlass" class="floating-label">Select Class</label>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ficlass">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Class filter</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by base item type, looser than other pages due to Grail.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <select id="itype" class="select-base peer" value.bind="selectedTypeBase">\r
                                <option repeat.for="opt of types"\r
                                        value.bind="opt.value && opt.value.length ? opt.value[0] : ''">\${opt.label}\r
                                </option>\r
                            </select>\r
                            <label for="itype" class="floating-label">Select Type</label>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Type filter</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter to a specific equipment for the selected item type, disabled if one isn't selected.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <select id="eqsel" class="select-base peer"\r
                                    value.bind="selectedEquipmentName"\r
                                    disabled.bind="selectedCategory === 'runewords' || !selectedTypeBase">\r
                                <option repeat.for="opt of equipmentNames" value.bind="opt.id">\${opt.name}</option>\r
                            </select>\r
                            <label for="eqsel" class="floating-label">Select Equipment</label>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="eqsel">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Equipment filter</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-60" data-help-text="Search across all fields. Uses (space) as an 'AND' modifier. ex: Typing sorc skill mana will return items with only all 3 words.">\r
                    <div class="flex items-stretch">\r
                        <div class="trailing-icon flex-1" data-icon="search">\r
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"\r
                                   placeholder=" "/>\r
                            <label for="inputsearch" class="floating-label">Search...</label>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Search</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Filter toggle to hide Vanilla items.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <button\r
                                    id="hidevanillabutton"\r
                                    type="button"\r
                                    class="vanilla-button flex-row-reverse"\r
                                    aria-pressed.bind="hideVanilla"\r
                                    click.trigger="hideVanilla = !hideVanilla">\r
                                <span class="vanilla-indicator"></span>\r
                                Hide Vanilla\r
                            </button>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="hidevanillabutton">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about the Hide Vanilla button</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="Reset all filters to default.">\r
                    <div class="flex items-stretch">\r
                        <div class="relative flex-1">\r
                            <button id="filterreset" class="button-base" type="button" click.trigger="resetFilters()">\r
                                Reset Filters\r
                            </button>\r
                        </div>\r
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="filterreset">\r
                            <span class="mso">info</span>\r
                            <span class="sr-only">More info about Reset Filters</span>\r
                        </button>\r
                    </div>\r
                </div>\r
\r
            </div>\r
        </div>\r
    </search-area>\r
\r
    <div class="card-container">\r
        <div class="card-box card-vis" repeat.for="unique of filteredUniques"\r
             if.bind="selectedCategory === 'uniques'">\r
            <div class="relative">\r
\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox"\r
                               checked.bind="foundUniques[unique.Name]"\r
                               change.trigger="updateFoundStatus(unique.Name)"\r
                               class="sr-only peer">\r
                        <span class="grail-toggle"></span>\r
                    </label>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-xl unique-text \${foundUniques[unique.Name] ? 'found' : ''}">\r
                        \${unique.Name}\r
                    </div>\r
                    <div class="text-base rarity-text" if.bind="unique.Rarity">\r
                        Rarity: \${unique.Rarity}\r
                    </div>\r
                    <div class="text-base rarity-text" if.bind="unique.Vanilla">\r
                        \${unique.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-base type-text" if.bind="unique.Equipment.Name">\r
                        \${unique.Equipment.Name}\r
                    </div>\r
                    <div class="text-base type-text" if.bind="unique.Equipment.ArmorString">\r
                        Defense: \${unique.Equipment.ArmorString}\r
                    </div>\r
                    <div class="text-base type-text"\r
                         if.bind="unique.Equipment.Block !== null && unique.Equipment.Block !== undefined && unique.Equipment.Block > 0">\r
                        Block: \${unique.Equipment.Block}%\r
                    </div>\r
                    <div class="text-base type-text" if.bind="unique.Equipment.DamageTypes"\r
                         repeat.for="damage of unique.Equipment.DamageTypes">\r
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}\r
                    </div>\r
                    <div class="text-base type-text" if.bind="unique.Equipment.Durability > 0">\r
                        Durability: \${unique.Equipment.Durability}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-base requirement-text"\r
                         if.bind="unique.Equipment.RequiredClass && unique.Equipment.RequiredClass.length">\r
                        (\${unique.Equipment.RequiredClass} Only)\r
                    </div>\r
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredDexterity > 0">\r
                        Required Dexterity: \${unique.Equipment.RequiredDexterity}\r
                    </div>\r
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredStrength > 0">\r
                        Required Strength: \${unique.Equipment.RequiredStrength}\r
                    </div>\r
                    <div class="text-base requirement-text">\r
                        Required Level: \${unique.RequiredLevel > 0? unique.RequiredLevel: 1}\r
                    </div>\r
                </div>\r
\r
                <div>\r
                    <div class="text-base prop-text" repeat.for="property of unique.Properties">\r
                        \${property.PropertyString}\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <div class="card-box card-vis" repeat.for="setItem of filteredSetItems"\r
             if.bind="selectedCategory === 'sets'">\r
            <div class="relative">\r
\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox"\r
                               checked.bind="foundSets[getSetItemKey(setItem)]"\r
                               change.trigger="updateFoundStatus(getSetItemKey(setItem))"\r
                               class="sr-only peer">\r
                        <span class="grail-toggle"></span>\r
                    </label>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-xl set-text-light \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">\r
                        \${setItem.Name}\r
                    </div>\r
                    <div class="text-base set-text  opacity-90 \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">\r
                        (\${setItem.Set})\r
                    </div>\r
                    <div class="text-base rarity-text" if.bind="setItem.Rarity">\r
                        Rarity: \${setItem.Rarity}\r
                    </div>\r
                    <div class="text-base rarity-text" if.bind="setItem.Vanilla">\r
                        \${setItem.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-base type-text" if.bind="setItem.Equipment.Name">\r
                        \${setItem.Equipment.Name}\r
                    </div>\r
                    <div class="text-base type-text" if.bind="setItem.Equipment.ArmorString">\r
                        Defense: \${setItem.Equipment.ArmorString}\r
                    </div>\r
                    <div class="text-base type-text"\r
                         if.bind="setItem.Equipment.Block !== null && setItem.Equipment.Block !== undefined && setItem.Equipment.Block > 0">\r
                        Block: \${setItem.Equipment.Block}%\r
                    </div>\r
                    <div class="text-base type-text" if.bind="setItem.Equipment.DamageTypes"\r
                         repeat.for="damage of setItem.Equipment.DamageTypes">\r
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}\r
                    </div>\r
                    <div class="text-base type-text" if.bind="setItem.Equipment.Durability > 0">\r
                        Durability: \${setItem.Equipment.Durability}\r
                    </div>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-base requirement-text"\r
                         if.bind="setItem.Equipment.RequiredClass && setItem.Equipment.RequiredClass.length">\r
                        (\${setItem.Equipment.RequiredClass} Only)\r
                    </div>\r
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredDexterity > 0">\r
                        Required Dexterity: \${setItem.Equipment.RequiredDexterity}\r
                    </div>\r
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredStrength > 0">\r
                        Required Strength: \${setItem.Equipment.RequiredStrength}\r
                    </div>\r
                    <div class="text-base requirement-text">\r
                        Required Level: \${setItem.RequiredLevel > 0? setItem.RequiredLevel: 1}\r
                    </div>\r
                </div>\r
\r
                <div>\r
                    <div class="text-base prop-text" repeat.for="property of setItem.Properties">\r
                        \${property.PropertyString}\r
                    </div>\r
                </div>\r
                <div class="text-base set-text" repeat.for="setProperty of setItem.SetPropertiesString">\r
                    \${setProperty}\r
                </div>\r
            </div>\r
        </div>\r
\r
        <div class="card-box card-vis" repeat.for="runeword of filteredRunewords"\r
             if.bind="selectedCategory === 'runewords'">\r
            <div class="relative">\r
\r
                <div class="absolute top-2 right-2">\r
                    <label class="inline-flex items-center cursor-pointer">\r
                        <input type="checkbox"\r
                               class="sr-only peer"\r
                               checked.bind="foundRunewords[runeword.Name]"\r
                               change.trigger="updateFoundStatus(runeword.Name)">\r
                        <span class="grail-toggle"></span>\r
                    </label>\r
                </div>\r
\r
                <div class="mb-1">\r
                    <div class="text-xl unique-text mb-1 \${foundRunewords[runeword.Name] ? 'found' : ''}">\r
                        \${runeword.Name}\r
                    </div>\r
                    <div class="text-base rarity-text" if.bind="runeword.Vanilla">\r
                        \${runeword.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}\r
                    </div>\r
                </div>\r
\r
                <div class="text-base type-text mb-1">\r
                    <span repeat.for="type of runeword.Types">\r
                        \${type.Name} \${$index + 1 !== runeword.Types.length ? ' or ' : ''}\r
                    </span>\r
                </div>\r
\r
                <div class="text-base type-text">\r
                    <span repeat.for="rune of runeword.Runes">\r
                        \${rune.Name} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}\r
                    </span>\r
                </div>\r
\r
                <div class="text-base requirement-text my-1">\r
                    Required Level: \${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1}\r
                </div>\r
\r
                <div>\r
                    <div class="text-base prop-text" repeat.for="property of runeword.Properties">\r
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
    __publicField(this, "classes", character_class_options);
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
    __publicField(this, "_uniqueTokens", /* @__PURE__ */ new Map());
    __publicField(this, "_setItemTokens", /* @__PURE__ */ new Map());
    __publicField(this, "_runewordTokens", /* @__PURE__ */ new Map());
    __publicField(this, "getDamageTypeString", getDamageTypeString);
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
      const opt = this.types.find(
        (o) => o.value && o.value[0] === this.selectedTypeBase
      );
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
            if (selectedBases.has(base) && u?.Equipment?.Name)
              set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
            if (selectedBases.has(base) && it?.Equipment?.Name)
              set.add(it.Equipment.Name);
          }
        }
        for (const name2 of set) this.equipmentNames.push({ id: name2, name: name2 });
      } catch {
      }
    }
    this.buildAllTokens();
    this.setItemTotalCount = this.allSetItems.length;
    this._debouncedSaveFound = debounce(() => this.saveFoundItems(), 200);
    this._debouncedApplyFilters = debounce(() => {
      this.updateList();
      this.updateUrl();
    }, 350);
    this.updateList();
  }
  // Reflect the current state back into the URL
  attached() {
    this.updateUrl();
  }
  // When navigating away, clear Grail-related params from the URL so returning starts empty
  detached() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("g-category");
      url.searchParams.delete("g-selectedClass");
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
      const cls = urlParams.get("g-selectedClass");
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
        url.searchParams.set("g-selectedClass", this.selectedClass);
      } else {
        url.searchParams.delete("g-selectedClass");
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
        for (const u of this.uniques) {
          const base = resolveBaseTypeName(u?.Type ?? "");
          if (base) present.add(base);
        }
      } else if (this.selectedCategory === "sets") {
        for (const s of setsJson) {
          for (const it of s?.SetItems ?? []) {
            const base = resolveBaseTypeName(it?.Type ?? "");
            if (base) present.add(base);
          }
        }
      } else if (this.selectedCategory === "runewords") {
        for (const rw of this.runewords) {
          const types = Array.isArray(rw?.Types) ? rw.Types : [];
          for (const t of types) {
            const base = resolveBaseTypeName(t?.Name ?? "");
            if (base) present.add(base);
          }
        }
      }
    } catch {
    }
    this.types = buildOptionsForPresentTypes(type_filtering_options, present, {
      dedupeByBase: true,
      preferLabelStartsWith: "Any "
    });
    this.types = prependTypeResetOption(this.types);
  }
  selectedCategoryChanged() {
    this.selectedClass = void 0;
    this.selectedType = void 0;
    this.selectedEquipmentName = void 0;
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
    this.selectedEquipmentName = void 0;
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
          if (selectedBases.has(base) && u?.Equipment?.Name)
            set.add(u.Equipment.Name);
        }
      } else if (this.selectedCategory === "sets") {
        for (const it of this.allSetItems) {
          const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
          if (selectedBases.has(base) && it?.Equipment?.Name)
            set.add(it.Equipment.Name);
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
      const opt = this.types.find(
        (o) => o.value && o.value[0] === this.selectedTypeBase
      );
      this.selectedType = opt?.value ?? [this.selectedTypeBase];
    } else {
      this.selectedType = void 0;
      this.selectedEquipmentName = void 0;
    }
    this.equipmentNames = [{ id: "", name: "-" }];
    if (this.selectedType && this.selectedType.length > 0 && this.selectedCategory !== "runewords") {
      try {
        const set = /* @__PURE__ */ new Set();
        if (this.selectedCategory === "uniques") {
          const selectedBases = new Set(this.selectedType);
          for (const u of this.uniques) {
            const base = getChainForTypeName(u?.Type ?? "")[0] || (u?.Type ?? "");
            if (selectedBases.has(base) && u?.Equipment?.Name)
              set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeName(it?.Type ?? "")[0] || (it?.Type ?? "");
            if (selectedBases.has(base) && it?.Equipment?.Name)
              set.add(it.Equipment.Name);
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
    this.selectedClass = void 0;
    this.selectedTypeBase = void 0;
    this.selectedType = void 0;
    this.selectedEquipmentName = void 0;
    this.equipmentNames = [{ id: "", name: "-" }];
    this.showFoundItems = false;
    this.hideVanilla = false;
    this.rebuildTypeOptions();
    this.updateList();
    this.updateTotalCount();
    this.updateUrl();
  }
  updateList() {
    const searchTokens = tokenizeSearch(this.search);
    const selectedTypeSet = this.selectedType && this.selectedType.length > 0 ? new Set(this.selectedType) : null;
    if (this.selectedCategory === "uniques") {
      const result = this.uniques.filter((unique) => {
        const okClass = !this.selectedClass || String(unique?.Equipment?.RequiredClass || "").toLowerCase().includes(String(this.selectedClass).toLowerCase());
        const okType = !selectedTypeSet || selectedTypeSet.has(
          getChainForTypeName(unique?.Type ?? "")[0] || (unique?.Type ?? "")
        );
        const okEquip = !this.selectedEquipmentName || String(unique?.Equipment?.Name || "") === this.selectedEquipmentName;
        const okVanilla = !this.hideVanilla || !isVanillaItem(unique?.Vanilla);
        const okSearch = this.tokensPartiallyMatch(
          this._uniqueTokens.get(this.getUniqueKey(unique)),
          searchTokens
        );
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
        const okType = !selectedTypeSet || selectedTypeSet.has(
          getChainForTypeName(item?.Type ?? "")[0] || (item?.Type ?? "")
        );
        const okEquip = !this.selectedEquipmentName || String(item?.Equipment?.Name || "") === this.selectedEquipmentName;
        const okVanilla = !this.hideVanilla || !isVanillaItem(item?.Vanilla);
        const okSearch = this.tokensPartiallyMatch(
          this._setItemTokens.get(this.getSetItemKey(item)),
          searchTokens
        );
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
      if (Array.isArray(this.selectedType) && this.selectedType.length > 0) {
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
        const okVanilla = !this.hideVanilla || !isVanillaItem(rw?.Vanilla);
        const okSearch = this.tokensPartiallyMatch(
          this._runewordTokens.get(this.getRunewordKey(rw)),
          searchTokens
        );
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
  //Tokenization helpers
  tokenizeStrings(values) {
    const out = /* @__PURE__ */ new Set();
    for (const v of values) {
      const toks = tokenizeSearch(v);
      for (const tok of toks) out.add(tok);
    }
    return out;
  }
  tokensFromTypeChain(typeName) {
    const chain = getChainForTypeName(typeName ? String(typeName) : "");
    return this.tokenizeStrings(chain);
  }
  buildTokensForUnique(u) {
    const baseVals = [
      u?.Name,
      u?.Equipment?.Name,
      u?.Equipment?.RequiredClass
    ];
    const tokens = this.tokenizeStrings(baseVals);
    if (Array.isArray(u?.Properties)) {
      for (const p of u.Properties) {
        const s = p?.PropertyString != null ? String(p.PropertyString) : "";
        if (s) {
          for (const t of this.tokenizeStrings([s])) tokens.add(t);
        }
      }
    }
    for (const t of this.tokensFromTypeChain(u?.Type)) tokens.add(t);
    return tokens;
  }
  buildTokensForSetItem(it) {
    const baseVals = [
      it?.Name,
      it?.Set,
      it?.Equipment?.Name
    ];
    const tokens = this.tokenizeStrings(baseVals);
    if (Array.isArray(it?.Properties)) {
      for (const p of it.Properties) {
        const s = p?.PropertyString != null ? String(p.PropertyString) : "";
        if (s) for (const t of this.tokenizeStrings([s])) tokens.add(t);
      }
    }
    if (Array.isArray(it?.SetPropertiesString)) {
      for (const s of it.SetPropertiesString) {
        if (s) for (const t of this.tokenizeStrings([String(s)])) tokens.add(t);
      }
    }
    for (const t of this.tokensFromTypeChain(it?.Type)) tokens.add(t);
    return tokens;
  }
  buildTokensForRuneword(rw) {
    const tokens = this.tokenizeStrings([rw?.Name]);
    if (Array.isArray(rw?.Properties)) {
      for (const p of rw.Properties) {
        const s = p?.PropertyString != null ? String(p.PropertyString) : "";
        if (s) for (const t of this.tokenizeStrings([s])) tokens.add(t);
      }
    }
    if (Array.isArray(rw?.Types)) {
      for (const t of rw.Types) {
        const name2 = t?.Name != null ? String(t.Name) : "";
        for (const tok of this.tokenizeStrings([name2])) tokens.add(tok);
        for (const tok of this.tokensFromTypeChain(name2)) tokens.add(tok);
      }
    }
    if (Array.isArray(rw?.Runes)) {
      for (const r of rw.Runes) {
        const name2 = r?.Name != null ? String(r.Name) : "";
        for (const tok of this.tokenizeStrings([name2])) tokens.add(tok);
      }
    }
    return tokens;
  }
  buildAllTokens() {
    this._uniqueTokens.clear();
    this._setItemTokens.clear();
    this._runewordTokens.clear();
    try {
      for (const u of this.uniques) {
        const key = this.getUniqueKey(u);
        this._uniqueTokens.set(key, this.buildTokensForUnique(u));
      }
    } catch {
    }
    try {
      for (const it of this.allSetItems) {
        const key = this.getSetItemKey(it);
        this._setItemTokens.set(key, this.buildTokensForSetItem(it));
      }
    } catch {
    }
    try {
      for (const rw of this.runewords) {
        const key = this.getRunewordKey(rw);
        this._runewordTokens.set(key, this.buildTokensForRuneword(rw));
      }
    } catch {
    }
  }
  // Checks that every query token is present as a substring of at least one item token
  // Enables partial (prefix/infix) matching instead of exact whole-word matching
  tokensPartiallyMatch(allTokens, queryTokens) {
    if (!queryTokens.length) return true;
    if (!allTokens || allTokens.size === 0) return false;
    for (let i = 0; i < queryTokens.length; i++) {
      const q = queryTokens[i];
      let hit = false;
      for (const tok of allTokens) {
        if (tok.includes(q)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    return true;
  }
  parseFoundMap(raw) {
    if (!raw) return {};
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") {
        const result = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k] = Boolean(v);
        }
        return result;
      }
    } catch {
    }
    return {};
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
    this.foundUniques = this.parseFoundMap(savedU);
    this.foundSets = this.parseFoundMap(savedS);
    this.foundRunewords = this.parseFoundMap(savedR);
  }
  saveFoundItems() {
    try {
      localStorage.setItem(
        "d2r-grail-uniques",
        JSON.stringify(this.foundUniques)
      );
    } catch {
    }
    try {
      localStorage.setItem("d2r-grail-sets", JSON.stringify(this.foundSets));
    } catch {
    }
    try {
      localStorage.setItem(
        "d2r-grail-runewords",
        JSON.stringify(this.foundRunewords)
      );
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
      this.foundCount = Object.values(this.foundRunewords).filter(
        Boolean
      ).length;
    } else {
      this.foundCount = 0;
    }
  }
  updateTotalCount() {
    if (this.selectedCategory === "uniques") {
      this.totalCount = this.uniques.length;
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
    if (confirm(
      "Are you sure you want to reset your Grail progress for this category? This cannot be undone."
    )) {
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
  // Maintain original item-based counters for Sets header-first line
  updateSetCounters() {
    try {
      this.setItemTotalCount = this.allSetItems.length;
    } catch {
      this.setItemTotalCount = 0;
    }
    try {
      this.setItemFoundCount = Object.values(this.foundSets).filter(
        Boolean
      ).length;
    } catch {
      this.setItemFoundCount = 0;
    }
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
