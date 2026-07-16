import { C as CustomElement, i as isBlankOrInvalid, t, s as syncParamsToUrl, f as format, w as watch, c as customElement, b as bindable } from "./index-CTTJeB_J.js";
import { t as tagIds, r as resolveBaseTypeName, b as buildOptionsForPresentTypes, p as prependTypeResetOption, e as toOptionalNumber, a as tokenizeSearch, s as swapMinMax, A as ANCESTOR_ONLY_WHEN_EXACT_OFF, d as getChainForTypeNameReadonly, m as matchesTokenGroups, c as type_filtering_options, I as IncrementalRenderer } from "./incremental-render-Cch9chka.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
const name = "affixes";
const template = `<template>
    <h3 class="text-lg type-text text-center mx-auto mt-4">
        <span class="text-lg set-text">\${'affix_included_types' | t}</span>
    </h3>
    <h3 class="text-lg type-text text-center mx-auto mb-4">
        <span class="text-lg requirement-text">\${'affix_excluded_types' | t}</span>
    </h3>
    <h3 class="text-lg type-text text-center mx-auto my-4">
        <span class="rarity-text">\${filteredAffixes.length}</span> \${'found_affixes_suffix' | t}
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <div class="w-full lg:w-auto lg:min-w-45" data-help-text="\${'help_affix_type_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="ptype" class="select-base peer" value.bind="selectedPType">
                                <option repeat.for="opt of pTypeOptions" value.bind="opt.value"> \${opt.label | t}</option>
                            </select>
                            <label for="ptype" class="floating-label">\${'filter_select_affix_type' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ptype">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_affix_type'}</span>
                        </button>
                    </div>
                </div>

                <searchable-select id="desc"
                                   class="w-full lg:w-auto lg:min-w-60"
                                   data-help-text="\${'help_property_type_filter' | t}"
                                   value.bind="selectedGroupDescription"
                                   options.bind="groupOptions"
                                   label="\${'filter_select_property_type' | t}">
                    <button au-slot="after" type="button" class="m-info-button" aria-expanded="false" data-info-for="desc">
                        <span class="mso">info</span>
                        <span class="sr-only">\${'info_more_about' | t:'filter_select_property_type'}</span>
                    </button>
                </searchable-select>

                <searchable-select id="itype"
                                   class="w-full lg:w-auto lg:min-w-75"
                                   data-help-text="\${'help_item_type_filter' | t}"
                                   value.bind="selectedType"
                                   options.bind="types"
                                   label="\${'filter_select_type' | t}"
                                   exact.bind="true">
                    <div au-slot="after" class="flex items-stretch">
                        <button type="button"
                                class="exact-button"
                                aria-pressed.bind="exclusiveType"
                                click.trigger="exclusiveType = !exclusiveType">
                            <span class="exact-indicator"></span>
                            \${'filter_exact' | t}
                        </button>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="itype">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_type'}</span>
                        </button>
                    </div>
                </searchable-select>

                <div class="w-full lg:w-60" data-help-text="\${'help_search' | t}">
                    <div class="flex items-stretch">
                        <div class="trailing-icon flex-1" data-icon="search">
                            <input id="inputsearch" type="text" class="select-base peer pr-12" value.bind="search"
                                   placeholder=" "/>
                            <label for="inputsearch" class="floating-label">\${'filter_search_placeholder' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="inputsearch">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_search_placeholder'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full flex flex-nowrap gap-2 lg:w-auto lg:min-w-60" data-help-text="\${'help_required_level_range' | t}">
                    <div class="w-full relative">
                        <select id="minrlvl" class="select-base peer" value.bind="minRequiredLevel">
                            <option repeat.for="opt of rLevelOptions" value.bind="opt.value">\${opt.label}</option>
                        </select>
                        <label for="minrlvl" class="floating-label">\${'filter_min_rlvl' | t}</label>
                    </div>
                    <div class="w-full relative">
                        <select id="maxrlvl" class="select-base peer" value.bind="maxRequiredLevel">
                            <option repeat.for="opt of rLevelOptions" value.bind="opt.value">\${opt.label}</option>
                        </select>
                        <label for="maxrlvl" class="floating-label">\${'filter_max_rlvl' | t}</label>
                    </div>
                    <button type="button" class="m-info-button ml-0!" aria-expanded="false" data-info-for="minrlvl">
                        <span class="mso">info</span>
                        <span class="sr-only">\${'info_more_about' | t:'help_required_level_range'}</span>
                    </button>
                </div>

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="\${'help_reset_filters' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="filterreset" class="button-base" type="button" click.trigger="resetFilters()">
                                \${'filter_reset' | t}
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="filterreset">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_reset'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="affix of visibleAffixes; key.bind: affix.__rid">

                <div class="flex justify-between items-center">
                    <div class="text-lg prop-text mt-1 ml-1">\${affix.NameKey | t}</div>
                    <div class="text-lg type-text mt-1 mr-1">\${(affix.PType === 'Prefix' ? 'label_prefix' : 'label_suffix') | t}</div>
                </div>

                <div class="text-base requirement-text mb-1">
                    \${'label_level_required' | t: affix.RequiredLevel || 1}
                </div>

                <div class="text-base type-text mb-1" if.bind="affix.Level">
                    \${'label_affix_level' | t: (affix.MaxLevel ? affix.Level + '-' + affix.MaxLevel : affix.Level)}
                </div>

                <div class="flex flex-wrap justify-center" if.bind="affix.Types && affix.Types.length">
                    <span class="text-base set-text mx-1" repeat.for="t of affix.Types">\${t | t}</span>
                </div>

                <div class="flex flex-wrap justify-center" if.bind="affix.ETypes && affix.ETypes.length">
                    <span class="text-base requirement-text mx-1" repeat.for="et of affix.ETypes">\${et | t}</span>
                </div>

                <keyed-lines class="text-base prop-text my-1" lines.bind="affix.Lines"></keyed-lines>

            </div>
        <div ref="sentinelEl" class="h-1"></div>
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
const propertyGroups = /* @__PURE__ */ JSON.parse('[{"group":111,"items":[{"description":"prop_group_damage"}]},{"group":105,"items":[{"description":"prop_group_damage"}]},{"group":123,"items":[{"description":"prop_group_demon_damage"}]},{"group":142,"items":[{"description":"prop_group_undead_damage"}]},{"group":110,"items":[{"description":"prop_group_attack_rating"}]},{"group":200,"items":[{"description":"prop_group_attack_rating"}]},{"group":103,"items":[{"description":"prop_group_damage"}]},{"group":104,"items":[{"description":"prop_group_damage"}]},{"group":101,"items":[{"description":"prop_group_defense"}]},{"group":125,"items":[{"description":"prop_group_skill_levels"}]},{"group":201,"items":[{"description":"prop_group_skill_levels"}]},{"group":137,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":138,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":139,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":140,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":117,"items":[{"description":"prop_group_resistances"}]},{"group":118,"items":[{"description":"prop_group_resistances"}]},{"group":119,"items":[{"description":"prop_group_resistances"}]},{"group":120,"items":[{"description":"prop_group_resistances"}]},{"group":116,"items":[{"description":"prop_group_resistances"}]},{"group":115,"items":[{"description":"prop_group_mana"}]},{"group":121,"items":[{"description":"prop_group_mana"}]},{"group":107,"items":[{"description":"prop_group_mana"}]},{"group":112,"items":[{"description":"prop_group_light_radius"}]},{"group":114,"items":[{"description":"prop_group_magic_find"}]},{"group":122,"items":[{"description":"prop_group_sockets"}]},{"group":141,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":102,"items":[{"description":"prop_group_resistances"}]},{"group":113,"items":[{"description":"prop_group_weapon_effects"}]},{"group":202,"items":[{"description":"prop_group_weapon_effects"}]},{"group":203,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":204,"items":[{"description":"prop_group_experience"}]},{"group":205,"items":[{"description":"prop_group_kick_damage"}]},{"group":206,"items":[{"description":"prop_group_damage"}]},{"group":207,"items":[{"description":"prop_group_equip_aura"}]},{"group":209,"items":[{"description":"prop_group_elemental_skill_effect"}]},{"group":44,"items":[{"description":"prop_group_charges"}]},{"group":130,"items":[{"description":"prop_group_resistances"}]},{"group":131,"items":[{"description":"prop_group_mana"}]},{"group":133,"items":[{"description":"prop_group_resistances"}]},{"group":134,"items":[{"description":"prop_group_life"}]},{"group":210,"items":[{"description":"prop_group_thorns"}]},{"group":211,"items":[{"description":"prop_group_speeds"}]},{"group":212,"items":[{"description":"prop_group_speeds"},{"description":"prop_group_weapon_effects"}]},{"group":213,"items":[{"description":"prop_group_skill_levels"}]},{"group":214,"items":[{"description":"prop_group_elemental_skill_effect"}]},{"group":215,"items":[{"description":"prop_group_elemental_skill_effect"}]},{"group":143,"items":[{"description":"prop_group_damage"}]},{"group":61,"items":[{"description":"prop_group_damage"},{"description":"prop_group_defense"}]},{"group":14,"items":[{"description":"prop_group_damage"}]},{"group":15,"items":[{"description":"prop_group_damage"}]},{"group":10,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":12,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":13,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":16,"items":[{"description":"prop_group_elemental_weapon_damage"}]},{"group":11,"items":[{"description":"prop_group_elemental_effect_defense"}]},{"group":29,"items":[{"description":"prop_group_elemental_effect_defense"}]},{"group":27,"items":[{"description":"prop_group_life_leech"}]},{"group":28,"items":[{"description":"prop_group_mana_leech"}]},{"group":60,"items":[{"description":"prop_group_life_leech"},{"description":"prop_group_mana_leech"}]},{"group":1,"items":[{"description":"prop_group_resistances"}]},{"group":2,"items":[{"description":"prop_group_resistances"},{"description":"prop_group_resistances"}]},{"group":3,"items":[{"description":"prop_group_absorbs"}]},{"group":43,"items":[{"description":"prop_group_resistances"}]},{"group":67,"items":[{"description":"prop_group_resistances"}]},{"group":17,"items":[{"description":"prop_group_attributes"}]},{"group":31,"items":[{"description":"prop_group_attributes"}]},{"group":23,"items":[{"description":"prop_group_attributes"}]},{"group":42,"items":[{"description":"prop_group_attributes"}]},{"group":26,"items":[{"description":"prop_group_life"}]},{"group":41,"items":[{"description":"prop_group_life"}]},{"group":19,"items":[{"description":"prop_group_life"}]},{"group":35,"items":[{"description":"prop_group_speeds"}]},{"group":18,"items":[{"description":"prop_group_speeds"}]},{"group":7,"items":[{"description":"prop_group_speeds"}]},{"group":6,"items":[{"description":"prop_group_thorns"}]},{"group":25,"items":[{"description":"prop_group_light_radius"}]},{"group":22,"items":[{"description":"prop_group_magic_find"}]},{"group":21,"items":[{"description":"prop_group_gold_find"}]},{"group":30,"items":[{"description":"prop_group_requirements"}]},{"group":37,"items":[{"description":"prop_group_auto_repair"}]},{"group":39,"items":[{"description":"prop_group_indestructible"}]},{"group":4,"items":[{"description":"prop_group_weapon_effects"}]},{"group":5,"items":[{"description":"prop_group_weapon_effects"}]},{"group":8,"items":[{"description":"prop_group_block_chance"}]},{"group":9,"items":[{"description":"prop_group_speeds"}]},{"group":20,"items":[{"description":"prop_group_weapon_effects"}]},{"group":24,"items":[{"description":"prop_group_weapon_effects"}]},{"group":63,"items":[{"description":"prop_group_vendor_prices"}]},{"group":64,"items":[{"description":"prop_group_weapon_effects"}]},{"group":65,"items":[{"description":"prop_group_weapon_effects"}]},{"group":66,"items":[{"description":"prop_group_reanimate"}]},{"group":77,"items":[{"description":"prop_group_ctc_when_struck"}]},{"group":78,"items":[{"description":"prop_group_ctc_when_striking"}]},{"group":79,"items":[{"description":"prop_group_ctc_level_up"}]},{"group":80,"items":[{"description":"prop_group_life"}]},{"group":81,"items":[{"description":"prop_group_skill_special_effects"}]},{"group":32,"items":[{"description":"prop_group_speeds"}]},{"group":82,"items":[{"description":"prop_group_elemental_skill_effect"}]},{"group":83,"items":[{"description":"prop_group_elemental_skill_effect"}]}]');
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
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
var _handleExclusiveTypeChanged_dec, _handleMaxReqChanged_dec, _handleMinReqChanged_dec, _handleTypeChanged_dec, _handleGroupChanged_dec, _handlePTypeChanged_dec, _handleSearchChanged_dec, _maxRequiredLevel_dec, _minRequiredLevel_dec, _exclusiveType_dec, _selectedType_dec, _selectedGroupDescription_dec, _selectedPType_dec, _search_dec, _Affixes_decorators, _init;
_Affixes_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedPType_dec = [bindable], _selectedGroupDescription_dec = [bindable], _selectedType_dec = [bindable], _exclusiveType_dec = [bindable], _minRequiredLevel_dec = [bindable], _maxRequiredLevel_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _handlePTypeChanged_dec = [watch("selectedPType")], _handleGroupChanged_dec = [watch("selectedGroupDescription")], _handleTypeChanged_dec = [watch("selectedType")], _handleMinReqChanged_dec = [watch("minRequiredLevel")], _handleMaxReqChanged_dec = [watch("maxRequiredLevel")], _handleExclusiveTypeChanged_dec = [watch("exclusiveType")];
class Affixes {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "allAffixes", []);
    __publicField(this, "filteredAffixes", []);
    __publicField(this, "visibleAffixes", []);
    __publicField(this, "sentinelEl");
    __publicField(this, "_inc", new IncrementalRenderer(60));
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "_debouncedFilter");
    __publicField(this, "_isCoercing", false);
    __publicField(this, "pTypeOptions", [
      { value: "", label: "-" },
      { value: "Prefix", label: "label_prefix" },
      { value: "Suffix", label: "label_suffix" }
    ]);
    __publicField(this, "selectedPType", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "groupOptions", [
      { value: "", label: "-" }
    ]);
    __publicField(this, "selectedGroupDescription", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "descToGroups", /* @__PURE__ */ new Map());
    __publicField(this, "types", type_filtering_options.slice());
    __publicField(this, "selectedType", __runInitializers(_init, 20, this, "")), __runInitializers(_init, 23, this);
    __publicField(this, "exclusiveType", __runInitializers(_init, 24, this)), __runInitializers(_init, 27, this);
    __publicField(this, "rLevelOptions", [
      { value: "", label: "-" },
      ...Array.from({ length: 99 }, (_, i) => {
        const v = String(i + 1);
        return { value: v, label: v };
      })
    ]);
    __publicField(this, "minRequiredLevel", __runInitializers(_init, 28, this)), __runInitializers(_init, 31, this);
    __publicField(this, "maxRequiredLevel", __runInitializers(_init, 32, this)), __runInitializers(_init, 35, this);
  }
  // Read search query parameters from URL before the first render
  async binding() {
    try {
      const [pResp, sResp] = await Promise.all([
        fetch("/data/keyed/magicprefix.json"),
        fetch("/data/keyed/magicsuffix.json")
      ]);
      const p = await pResp.json();
      const s = await sResp.json();
      this.allAffixes = [...p, ...s];
    } catch (e) {
      console.error("Failed to load affixes:", e);
      this.allAffixes = [];
    }
    tagIds(this.allAffixes);
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam))
      this.search = searchParam;
    const ptypeParam = urlParams.get("ptype");
    if (ptypeParam === "Prefix" || ptypeParam === "Suffix") {
      this.selectedPType = ptypeParam;
    }
    const groupParam = urlParams.get("group");
    if (groupParam && !isBlankOrInvalid(groupParam))
      this.selectedGroupDescription = groupParam;
    const typeParam = urlParams.get("type");
    let typeBaseFromUrl;
    if (typeParam && !isBlankOrInvalid(typeParam))
      typeBaseFromUrl = typeParam.split(",")[0];
    const minrl = urlParams.get("minrl");
    if (minrl !== null && !isBlankOrInvalid(minrl))
      this.minRequiredLevel = minrl;
    const maxrl = urlParams.get("maxrl");
    if (maxrl !== null && !isBlankOrInvalid(maxrl))
      this.maxRequiredLevel = maxrl;
    const exactParam = urlParams.get("exact");
    if (exactParam && !isBlankOrInvalid(exactParam))
      this.exclusiveType = exactParam === "true";
    if (this.selectedPType === void 0) this.selectedPType = void 0;
    if (this.selectedGroupDescription === void 0)
      this.selectedGroupDescription = "";
    if (this.selectedType === void 0) this.selectedType = "";
    if (this.minRequiredLevel === void 0) this.minRequiredLevel = "";
    if (this.maxRequiredLevel === void 0) this.maxRequiredLevel = "";
    const present = /* @__PURE__ */ new Set();
    try {
      for (const a of this.allAffixes) {
        const types = Array.isArray(a?.Types) ? a.Types : [];
        for (const t2 of types) {
          const base = resolveBaseTypeName(t2 != null ? String(t2) : "");
          if (base) present.add(base);
        }
      }
    } catch {
    }
    this.types = buildOptionsForPresentTypes(type_filtering_options, present).map((opt) => ({
      ...opt,
      label: t(opt.label)
    }));
    this.types = prependTypeResetOption(this.types);
    if (typeBaseFromUrl) {
      const opt = this.types.find((o) => o.id === typeBaseFromUrl);
      this.selectedType = opt ? opt.id : "";
    }
    this.buildGroupOptions(propertyGroups);
    this._debouncedFilter = debounce(() => this.applyFilters(), 350);
    this.applyFilters();
  }
  attached() {
    this.updateUrl();
    this._inc.attach(this.sentinelEl, () => this.loadMore());
  }
  detached() {
    this._inc.detach();
    if (this._debouncedFilter) this._debouncedFilter.cancel();
  }
  applyVisible() {
    this._inc.reset();
    this.visibleAffixes = this._inc.visible(this.filteredAffixes);
  }
  loadMore() {
    if (this._inc.grow(this.filteredAffixes)) {
      this.visibleAffixes = this._inc.visible(this.filteredAffixes);
    }
  }
  // Helper method to update URL with current search parameters
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      ptype: this.selectedPType,
      group: this.selectedGroupDescription,
      type: this.selectedType,
      minrl: this.minRequiredLevel,
      maxrl: this.maxRequiredLevel,
      exact: this.exclusiveType
    }, false);
  }
  buildGroupOptions(groups) {
    const descMap = /* @__PURE__ */ new Map();
    for (const entry of groups) {
      const g = entry.group;
      for (const item of entry.items || []) {
        const desc = item.description?.trim();
        if (!desc) continue;
        let set = descMap.get(desc);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          descMap.set(desc, set);
        }
        set.add(g);
      }
    }
    this.descToGroups = descMap;
    const descriptions = Array.from(descMap.keys()).map((d) => ({
      value: d,
      label: t(d) || d
    }));
    descriptions.sort((a, b) => a.label.localeCompare(b.label));
    this.groupOptions = [{ value: "", label: "-" }, ...descriptions];
  }
  handleSearchChanged() {
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handlePTypeChanged() {
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handleGroupChanged() {
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handleTypeChanged() {
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handleMinReqChanged() {
    if (this._isCoercing) return;
    const minNum = toOptionalNumber(this.minRequiredLevel);
    const maxNum = toOptionalNumber(this.maxRequiredLevel);
    if (typeof minNum === "number" && typeof maxNum === "number" && minNum > maxNum) {
      this._isCoercing = true;
      this.maxRequiredLevel = this.minRequiredLevel;
      this._isCoercing = false;
    }
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handleMaxReqChanged() {
    if (this._isCoercing) return;
    const minNum = toOptionalNumber(this.minRequiredLevel);
    const maxNum = toOptionalNumber(this.maxRequiredLevel);
    if (typeof minNum === "number" && typeof maxNum === "number" && maxNum < minNum) {
      this._isCoercing = true;
      this.minRequiredLevel = this.maxRequiredLevel;
      this._isCoercing = false;
    }
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  handleExclusiveTypeChanged() {
    if (this._debouncedFilter) this._debouncedFilter();
    this.updateUrl();
  }
  applyFilters() {
    const tokens = tokenizeSearch(this.search);
    const hasQuery = tokens.length > 0;
    const selectedGroups = this.selectedGroupDescription ? this.descToGroups.get(this.selectedGroupDescription) : void 0;
    let minOpt = toOptionalNumber(this.minRequiredLevel);
    let maxOpt = toOptionalNumber(this.maxRequiredLevel);
    [minOpt, maxOpt] = swapMinMax(minOpt, maxOpt);
    let selectedBase;
    let selectedSet;
    if (this.selectedType) {
      const opt = this.types.find((o) => o.id === this.selectedType);
      if (opt && opt.value && opt.value.length > 0) {
        selectedBase = opt.value[0];
        if (!this.exclusiveType && opt.id && ANCESTOR_ONLY_WHEN_EXACT_OFF.includes(opt.id)) {
          selectedSet = new Set(getChainForTypeNameReadonly(selectedBase));
        } else {
          selectedSet = new Set(opt.value);
        }
      }
    }
    this.filteredAffixes = this.allAffixes.filter((a) => {
      if (this.selectedPType && a.PType !== this.selectedPType) return false;
      if (selectedGroups) {
        const grp = a?.Group;
        if (grp == null || !selectedGroups.has(grp)) return false;
      }
      if (this.selectedType && selectedBase && selectedSet) {
        const types = Array.isArray(a.Types) ? a.Types : [];
        if (types.length > 0) {
          const allowed = types.some((t2) => {
            const chain = getChainForTypeNameReadonly(
              t2 != null ? String(t2) : ""
            );
            if (!chain || chain.length === 0) return false;
            const itemBase = chain[0];
            if (this.exclusiveType) {
              return itemBase === selectedBase;
            } else {
              return selectedSet.has(itemBase);
            }
          });
          if (!allowed) return false;
        }
        const e = Array.isArray(a.ETypes) ? a.ETypes : [];
        if (e.length > 0) {
          const excluded = e.some((t2) => {
            const chain = getChainForTypeNameReadonly(
              t2 != null ? String(t2) : ""
            );
            if (!chain || chain.length === 0) return false;
            const itemBase = chain[0];
            if (this.exclusiveType) {
              return itemBase === selectedBase;
            } else {
              return selectedSet.has(itemBase);
            }
          });
          if (excluded) return false;
        }
      }
      const rl = typeof a.RequiredLevel === "number" ? a.RequiredLevel : 0;
      if (typeof minOpt === "number" && rl < minOpt) return false;
      if (typeof maxOpt === "number" && rl > maxOpt) return false;
      if (hasQuery) {
        const hayParts = [
          t(a.NameKey),
          ...(a?.Lines || []).map((l) => format(l)),
          ...(a?.Types || []).flatMap((ty) => {
            const index = String(ty);
            const chain = getChainForTypeNameReadonly(index);
            return [index, ...chain || [], ...(chain || []).map((c) => t(c))];
          })
        ];
        const hay = hayParts.filter(Boolean).join(" ").toLowerCase();
        if (!matchesTokenGroups(hay, tokens)) return false;
      }
      return true;
    });
    this.applyVisible();
  }
  formatGroupName(name2) {
    return name2.replace(/-/g, " ").replace(/([a-z])([0-9])/g, "$1 $2");
  }
  // Reset all filters to defaults and refresh URL/list
  resetFilters() {
    this.search = "";
    this.selectedPType = void 0;
    this.selectedGroupDescription = "";
    this.selectedType = "";
    this.exclusiveType = false;
    this.minRequiredLevel = "";
    this.maxRequiredLevel = "";
    this.applyFilters();
    this.updateUrl();
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Affixes);
__decorateElement(_init, 1, "handlePTypeChanged", _handlePTypeChanged_dec, Affixes);
__decorateElement(_init, 1, "handleGroupChanged", _handleGroupChanged_dec, Affixes);
__decorateElement(_init, 1, "handleTypeChanged", _handleTypeChanged_dec, Affixes);
__decorateElement(_init, 1, "handleMinReqChanged", _handleMinReqChanged_dec, Affixes);
__decorateElement(_init, 1, "handleMaxReqChanged", _handleMaxReqChanged_dec, Affixes);
__decorateElement(_init, 1, "handleExclusiveTypeChanged", _handleExclusiveTypeChanged_dec, Affixes);
__decorateElement(_init, 5, "search", _search_dec, Affixes);
__decorateElement(_init, 5, "selectedPType", _selectedPType_dec, Affixes);
__decorateElement(_init, 5, "selectedGroupDescription", _selectedGroupDescription_dec, Affixes);
__decorateElement(_init, 5, "selectedType", _selectedType_dec, Affixes);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Affixes);
__decorateElement(_init, 5, "minRequiredLevel", _minRequiredLevel_dec, Affixes);
__decorateElement(_init, 5, "maxRequiredLevel", _maxRequiredLevel_dec, Affixes);
Affixes = __decorateElement(_init, 0, "Affixes", _Affixes_decorators, Affixes);
__runInitializers(_init, 1, Affixes);
export {
  Affixes
};
