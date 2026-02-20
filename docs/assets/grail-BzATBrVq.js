import { C as CustomElement, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-DP7wp1gc.js";
import { g as getChainForTypeNameReadonly, r as resolveBaseTypeName, b as buildOptionsForPresentTypes, t as type_filtering_options } from "./item-type-filters-D9g9GJuK.js";
import { c as character_class_options } from "./character-classes-Cb6HmnkD.js";
import { g as getDamageTypeString } from "./damage-types-Du-j2Hbt.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
import { p as prependTypeResetOption, t as tokenizeSearch, i as isVanillaItem } from "./filter-helpers-C07hLFTd.js";
import { r as runewordsJson } from "./runewords-ia0QhkoC.js";
import { s as setsJson } from "./sets-BrsD3U8q.js";
import { u as uniquesJson } from "./uniques-D8BwdPHQ.js";
const name = "grail";
const template = `<template>
    <h3 class="text-lg type-text text-center items-center mx-auto my-4">
        <span class="unique-text">- Holy Grail Tracker -</span>
        <template if.bind="selectedCategory === 'sets'">
            <div>
                <span class="rarity-text">\${setItemFoundCount}</span>/<span
                    class="rarity-text">\${setItemTotalCount}</span>
                Items Found
                (<span class="rarity-text">\${setItemsDisplayedCount}</span> Displayed)
            </div>
            <div>
                <span class="rarity-text">\${foundCount}</span>/<span
                    class="rarity-text">\${totalCount}</span>
                Sets Completed
                (<span class="rarity-text">\${displayedCount}</span> Displayed)
            </div>
        </template>
        <template if.bind="selectedCategory !== 'sets'">
            <div class="mb-11">
                <span class="rarity-text">\${foundCount}</span>/<span
                    class="rarity-text">\${totalCount}</span>
                Items Found
                (<span class="rarity-text">\${displayedCount}</span> Displayed)
            </div>
        </template>
    </h3>

    <div class="flex flex-col items-center gap-2 px-5 pb-5">
        <div class="w-full lg:w-85" data-help-text="Reset the tracked progress for the current Grail category only." data-tooltip-placement="top">
            <div class="flex items-stretch">
                <div class="relative flex-1">
                    <button id="resetgrailcat" type="button" click.trigger="resetGrail()" class="button-base">
                        Reset Grail Category Progress
                    </button>
                </div>
                <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetgrailcat">
                    <span class="mso">info</span>
                    <span class="sr-only">More info about Reset Grail Category Progress</span>
                </button>
            </div>
        </div>
        <div class="w-full lg:w-85" data-help-text="Filter toggle to hide items you've already found.">
            <div class="flex items-stretch">
                <div class="relative flex-1">
                    <button id="hidefounditems" type="button" class="vanilla-button flex-row-reverse justify-between"
                            aria-pressed.bind="showFoundItems"
                            click.trigger="showFoundItems = !showFoundItems"><span class="vanilla-indicator"></span>
                        Hide Found Items
                    </button>
                </div>
                <button type="button" class="m-info-button" aria-expanded="false" data-info-for="hidefounditems">
                    <span class="mso">info</span>
                    <span class="sr-only">More info about the Hide Found Items button</span>
                </button>
            </div>
        </div>
    </div>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Choose the Grail category list.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="category" class="select-base peer" value.bind="selectedCategory">
                                <option repeat.for="opt of categories" value.bind="opt.value">\${opt.label}</option>
                            </select>
                            <label for="category" class="floating-label">Select Category</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="category">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Category filter</span>
                        </button>
                    </div>
                </div>

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

                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter by base item type, looser than other pages due to Grail.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="itype" class="select-base peer" value.bind="selectedTypeBase">
                                <option repeat.for="opt of types"
                                        value.bind="opt.id">\${opt.label}
                                </option>
                            </select>
                            <label for="itype" class="floating-label">Select Type</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Type filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-auto lg:min-w-60" data-help-text="Filter to a specific equipment for the selected item type, disabled if one isn't selected.">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="eqsel" class="select-base peer"
                                    value.bind="selectedEquipmentName"
                                    disabled.bind="selectedCategory === 'runewords' || !selectedTypeBase">
                                <option repeat.for="opt of equipmentNames" value.bind="opt.id">\${opt.name}</option>
                            </select>
                            <label for="eqsel" class="floating-label">Select Equipment</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="eqsel">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Equipment filter</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-60" data-help-text="Search across all fields. Attempts exact match. Seperate with '+' for AND match. Seperate with ',' or '|' for OR match. ex. 'fire skill damage+enemy fire' finds items with only both tokens. 'fire skill damage,enemy fire' finds items with either token.">
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
                            <button id="filterreset" class="button-base" type="button" click.trigger="resetFilters()">
                                Reset Filters
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="filterreset">
                            <span class="mso">info</span>
                            <span class="sr-only">More info about Reset Filters</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="unique of filteredUniques"
             if.bind="selectedCategory === 'uniques'">
            <div class="relative">

                <div class="absolute top-2 right-2">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                               checked.bind="foundUniques[unique.Name]"
                               change.trigger="updateFoundStatus(unique.Name)"
                               class="sr-only peer">
                        <span class="grail-toggle"></span>
                    </label>
                </div>

                <div class="mb-1">
                    <div class="text-xl unique-text \${foundUniques[unique.Name] ? 'found' : ''}">
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
                    <div class="text-base type-text" if.bind="unique.Equipment.DamageTypes"
                         repeat.for="damage of unique.Equipment.DamageTypes">
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}
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
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredDexterity > 0">
                        Required Dexterity: \${unique.Equipment.RequiredDexterity}
                    </div>
                    <div class="text-base requirement-text" if.bind="unique.Equipment.RequiredStrength > 0">
                        Required Strength: \${unique.Equipment.RequiredStrength}
                    </div>
                    <div class="text-base requirement-text">
                        Required Level: \${unique.RequiredLevel > 0? unique.RequiredLevel: 1}
                    </div>
                </div>

                <div>
                    <div class="text-base prop-text" repeat.for="property of unique.Properties">
                        \${property.PropertyString}
                    </div>
                </div>
            </div>
        </div>

        <div class="card-box card-vis" repeat.for="setItem of filteredSetItems"
             if.bind="selectedCategory === 'sets'">
            <div class="relative">

                <div class="absolute top-2 right-2">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                               checked.bind="foundSets[getSetItemKey(setItem)]"
                               change.trigger="updateFoundStatus(getSetItemKey(setItem))"
                               class="sr-only peer">
                        <span class="grail-toggle"></span>
                    </label>
                </div>

                <div class="mb-1">
                    <div class="text-xl set-text-light \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">
                        \${setItem.Name}
                    </div>
                    <div class="text-base set-text  opacity-90 \${foundSets[getSetItemKey(setItem)] ? 'found' : ''}">
                        (\${setItem.Set})
                    </div>
                    <div class="text-base rarity-text" if.bind="setItem.Rarity">
                        Rarity: \${setItem.Rarity}
                    </div>
                    <div class="text-base rarity-text" if.bind="setItem.Vanilla">
                        \${setItem.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}
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
                    <div class="text-base type-text" if.bind="setItem.Equipment.DamageTypes"
                         repeat.for="damage of setItem.Equipment.DamageTypes">
                        \${getDamageTypeString(damage.Type)} \${damage.DamageString}
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
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredDexterity > 0">
                        Required Dexterity: \${setItem.Equipment.RequiredDexterity}
                    </div>
                    <div class="text-base requirement-text" if.bind="setItem.Equipment.RequiredStrength > 0">
                        Required Strength: \${setItem.Equipment.RequiredStrength}
                    </div>
                    <div class="text-base requirement-text">
                        Required Level: \${setItem.RequiredLevel > 0? setItem.RequiredLevel: 1}
                    </div>
                </div>

                <div>
                    <div class="text-base prop-text" repeat.for="property of setItem.Properties">
                        \${property.PropertyString}
                    </div>
                </div>
                <div class="text-base set-text" repeat.for="setProperty of setItem.SetPropertiesString">
                    \${setProperty}
                </div>
            </div>
        </div>

        <div class="card-box card-vis" repeat.for="runeword of filteredRunewords"
             if.bind="selectedCategory === 'runewords'">
            <div class="relative">

                <div class="absolute top-2 right-2">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                               class="sr-only peer"
                               checked.bind="foundRunewords[runeword.Name]"
                               change.trigger="updateFoundStatus(runeword.Name)">
                        <span class="grail-toggle"></span>
                    </label>
                </div>

                <div class="mb-1">
                    <div class="text-xl unique-text mb-1 \${foundRunewords[runeword.Name] ? 'found' : ''}">
                        \${runeword.Name}
                    </div>
                    <div class="text-base rarity-text" if.bind="runeword.Vanilla">
                        \${runeword.Vanilla === 'Y' ? 'Vanilla' : 'Mod'}
                    </div>
                </div>

                <div class="text-base type-text mb-1">
                    <span repeat.for="type of runeword.Types">
                        \${type.Name} \${$index + 1 !== runeword.Types.length ? ' or ' : ''}
                    </span>
                </div>

                <div class="text-base type-text">
                    <span repeat.for="rune of runeword.Runes">
                        \${rune.Name} \${$index + 1 !== runeword.Runes.length ? ' + ' : ''}
                    </span>
                </div>

                <div class="text-base requirement-text my-1">
                    Required Level: \${runeword.RequiredLevel > 0? runeword.RequiredLevel: 1}
                </div>

                <div>
                    <div class="text-base prop-text" repeat.for="property of runeword.Properties">
                        \${property.PropertyString}
                    </div>
                </div>

            </div>
        </div>
    </div>
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
    __publicField(this, "selectedTypeBase", __runInitializers(_init, 20, this, "")), __runInitializers(_init, 23, this);
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
      const opt = this.types.find((o) => o.id === this.selectedTypeBase);
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
            const base = getChainForTypeNameReadonly(u?.Type ?? "")[0] || (u?.Type ?? "");
            if (selectedBases.has(base) && u?.Equipment?.Name)
              set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeNameReadonly(it?.Type ?? "")[0] || (it?.Type ?? "");
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
      window.history.replaceState({}, "", url.toString());
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
        this.selectedTypeBase = "";
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
    syncParamsToUrl({
      "g-category": this.selectedCategory,
      "g-selectedClass": this.selectedClass,
      "g-type": this.selectedTypeBase,
      "g-equipment": this.selectedEquipmentName,
      "g-search": this.search,
      "g-hideFound": this.showFoundItems,
      "g-hideVanilla": this.hideVanilla
    }, false);
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
    this.types = buildOptionsForPresentTypes(type_filtering_options, present);
    this.types = prependTypeResetOption(this.types);
  }
  selectedCategoryChanged() {
    this.selectedClass = void 0;
    this.selectedTypeBase = "";
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
          const base = getChainForTypeNameReadonly(u?.Type ?? "")[0] || (u?.Type ?? "");
          if (selectedBases.has(base) && u?.Equipment?.Name)
            set.add(u.Equipment.Name);
        }
      } else if (this.selectedCategory === "sets") {
        for (const it of this.allSetItems) {
          const base = getChainForTypeNameReadonly(it?.Type ?? "")[0] || (it?.Type ?? "");
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
      const opt = this.types.find((o) => o.id === this.selectedTypeBase);
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
            const base = getChainForTypeNameReadonly(u?.Type ?? "")[0] || (u?.Type ?? "");
            if (selectedBases.has(base) && u?.Equipment?.Name)
              set.add(u.Equipment.Name);
          }
        } else if (this.selectedCategory === "sets") {
          const selectedBases = new Set(this.selectedType);
          for (const it of this.allSetItems) {
            const base = getChainForTypeNameReadonly(it?.Type ?? "")[0] || (it?.Type ?? "");
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
    this.selectedTypeBase = "";
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
          getChainForTypeNameReadonly(unique?.Type ?? "")[0] || (unique?.Type ?? "")
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
          getChainForTypeNameReadonly(item?.Type ?? "")[0] || (item?.Type ?? "")
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
          const selectedChain = getChainForTypeNameReadonly(selectedBase);
          const selectedChainSet = new Set(selectedChain);
          let hasDescendantInData = false;
          if (!this.exclusiveType) {
            try {
              outer: for (const rw of this.runewords) {
                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                for (let i = 0; i < types.length; i++) {
                  const raw = types[i]?.Name != null ? String(types[i].Name) : "";
                  const chain = getChainForTypeNameReadonly(raw);
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
              const chain = getChainForTypeNameReadonly(raw);
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
    const chain = getChainForTypeNameReadonly(typeName ? String(typeName) : "");
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
  // Checks that the search query matches the item's tokens.
  // queryGroups is an OR-list of AND-groups (string[][]).
  // An item matches if at least one OR-group matches.
  // An OR-group matches if all its AND-terms are present as substrings in any item token.
  tokensPartiallyMatch(allTokens, queryGroups) {
    if (!queryGroups.length) return true;
    if (!allTokens || allTokens.size === 0) return false;
    return queryGroups.some((group) => {
      return group.every((term) => {
        for (const tok of allTokens) {
          if (tok.includes(term)) return true;
        }
        return false;
      });
    });
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
