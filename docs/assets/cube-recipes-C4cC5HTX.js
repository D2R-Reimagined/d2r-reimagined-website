import { C as CustomElement, t, f as format, i as isBlankOrInvalid, s as syncParamsToUrl, w as watch, c as customElement, b as bindable } from "./index-CTTJeB_J.js";
import { t as tagIds, a as tokenizeSearch, m as matchesTokenGroups, I as IncrementalRenderer } from "./incremental-render-Cch9chka.js";
import { c as character_class_options } from "./character-classes-BxKvOt2-.js";
import { d as debounce } from "./debounce-DlM2vs2L.js";
const name = "cube-recipes";
const template = `<template>
    <h3 class="text-lg type-text text-center mx-auto my-4">
        <span class="rarity-text">\${recipes.length}</span> \${'found_recipes_suffix' | t}
    </h3>

    <search-area>
        <div class="w-full m-auto px-5 py-2">
            <div class="flex flex-wrap justify-center items-start gap-2">

                <searchable-select id="notesel"
                                   class="w-full lg:w-auto lg:min-w-60"
                                   data-help-text="\${'help_recipe_type_filter' | t}"
                                   value.bind="selectedNote"
                                   options.bind="noteOptions"
                                   label="\${'filter_select_recipe_type' | t}">
                    <button au-slot="after" type="button" class="m-info-button" aria-expanded="false" data-info-for="notesel">
                        <span class="mso">info</span>
                        <span class="sr-only">\${'info_more_about' | t:'filter_select_recipe_type'}</span>
                    </button>
                </searchable-select>

                <div class="w-full lg:w-auto lg:min-w-60"
                     data-help-text="\${'help_recipe_class_filter' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <select id="ficlass" class="select-base peer" value.bind="selectedClass">
                                <option repeat.for="opt of classOptions" value.bind="opt.value">\${opt.label | t}</option>
                            </select>
                            <label for="ficlass" class="floating-label">\${'filter_select_class' | t}</label>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="ficlass">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_select_class'}</span>
                        </button>
                    </div>
                </div>

                <div class="w-full lg:w-60"
                     data-help-text="\${'help_search' | t}">
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

                <div class="w-full lg:w-auto lg:min-w-35" data-help-text="\${'help_reset_filters' | t}">
                    <div class="flex items-stretch">
                        <div class="relative flex-1">
                            <button id="resetfilters" class="button-base" type="button" click.trigger="resetFilters()">
                                \${'filter_reset' | t}
                            </button>
                        </div>
                        <button type="button" class="m-info-button" aria-expanded="false" data-info-for="resetfilters">
                            <span class="mso">info</span>
                            <span class="sr-only">\${'info_more_about' | t:'filter_reset'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </search-area>

    <div class="card-container">
        <div class="card-box card-vis" repeat.for="recipe of visibleRecipes; key.bind: recipe.__rid">

            <div class="mb-1  text-xl unique-text">
                \${recipe.Description}
            </div>

            <div class="text-base requirement-text" if.bind="recipe.RequiredClass">
                \${'label_only' | t:recipe.RequiredClass}
            </div>

            <div class="text-base type-text" repeat.for="inp of recipe.Inputs">
                \${inp}
            </div>

            <div class="my-1 text-xl unique-text">
                ==========
            </div>

            <div class="mb-1 last:mb-0" repeat.for="blk of recipe.OutputBlocks">
                <div class="text-base type-text">
                    \${blk.lineOne}
                </div>
                <keyed-lines class="text-base prop-text" lines.bind="blk.properties"></keyed-lines>
                <div if.bind="blk.chanceText" class="text-base requirement-text">
                    \${blk.chanceText}
                </div>
            </div>
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
var _handleSelectedClassChanged_dec, _handleSelectedNoteChanged_dec, _handleSearchChanged_dec, _selectedClass_dec, _selectedNote_dec, _search_dec, _CubeRecipes_decorators, _init;
function mapV2ToDisplay(recipes) {
  const toQtyName = (qty, name2) => {
    const q = typeof qty === "number" && qty > 0 ? qty : 1;
    return `${q}x ${format(name2) ?? ""}`.trim();
  };
  const joinQualifiers = (q) => {
    const list = (q ?? []).map((item) => {
      if (typeof item === "string") return item;
      return format(item);
    }).filter(Boolean);
    return list.length ? list.join(", ") : "";
  };
  const shouldOmitQtyForOutput = (name2, qty) => {
    const n = format(name2);
    if (!n) return false;
    if (qty && qty !== 1) return false;
    return n.startsWith("Return");
  };
  return (recipes || []).map((r) => {
    const mappedClass = r.RequiredClass ? `class_${r.RequiredClass.toLowerCase()}` : void 0;
    const hasOrbOfCorruptionNote = (r.Notes ?? []).some(
      (n) => n.key === "strCubeNoteOrbOfCorruption" || format(n).toLowerCase().includes("orb of corruption recipe")
    );
    let chanceText;
    if (hasOrbOfCorruptionNote) {
      const raw = r.Value;
      let vNum;
      if (typeof raw === "number") {
        vNum = raw;
      } else if (typeof raw === "string") {
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) vNum = parsed;
      }
      if (typeof vNum === "number") {
        if (vNum === 100) {
          chanceText = t("label_chance", [1]);
        } else if (vNum >= 53 && vNum <= 99) {
          chanceText = t("label_chance", [6]);
        } else if (vNum >= 46 && vNum <= 52) {
          chanceText = t("label_chance", [7]);
        } else if (vNum >= 21 && vNum <= 45) {
          chanceText = t("label_chance", [25]);
        } else if (vNum >= 1 && vNum <= 20) {
          chanceText = t("label_chance", [20]);
        }
      }
    }
    const inputsArr = (r.Inputs ?? []).map((inp) => {
      const base = toQtyName(inp.Quantity, inp.Name);
      const qStr = joinQualifiers(inp.Qualifiers);
      return qStr ? `${base}, ${qStr}` : base;
    });
    const inputStr = inputsArr.join(" + ");
    const outputsArr = [];
    const outputBlocks = [];
    if (r.Outputs) {
      const keys = Object.keys(r.Outputs).sort();
      for (const k of keys) {
        const out = r.Outputs[k];
        const base = shouldOmitQtyForOutput(out.Name, out.Quantity) ? `${format(out.Name) ?? ""}`.trim() : toQtyName(out.Quantity, out.Name);
        const qStr = joinQualifiers(out.Qualifiers);
        const lines = out.Lines ?? [];
        const propsStrings = lines.map((l) => format(l)).filter(Boolean);
        const withQual = qStr ? `${base}, ${qStr}` : base;
        const withProps = propsStrings.length ? `${withQual}, ${propsStrings.join("; ")}` : withQual;
        outputsArr.push(withProps);
        outputBlocks.push({
          key: k,
          title: base,
          lineOne: withQual,
          modifiers: (out.Qualifiers ?? []).map((q) => typeof q === "string" ? q : format(q)).filter(Boolean),
          properties: lines,
          // Show the same chance text under each output block when applicable
          chanceText
        });
      }
    }
    const outputStr = outputsArr.join(" + ");
    const description = (r.Notes ?? []).map((n) => format(n)).join(" | ");
    return {
      Description: description,
      RequiredClass: mappedClass,
      Input: inputStr,
      Output: outputStr,
      Inputs: inputsArr,
      Outputs: outputsArr,
      OutputBlocks: outputBlocks,
      _raw: r
    };
  });
}
_CubeRecipes_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _selectedNote_dec = [bindable], _selectedClass_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _handleSelectedNoteChanged_dec = [watch("selectedNote")], _handleSelectedClassChanged_dec = [watch("selectedClass")];
class CubeRecipes {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "allRecipes", []);
    __publicField(this, "recipes", []);
    __publicField(this, "visibleRecipes", []);
    __publicField(this, "sentinelEl");
    __publicField(this, "_inc", new IncrementalRenderer(60));
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "selectedNote", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "selectedClass", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "noteOptions", []);
    __publicField(this, "classOptions", character_class_options.map((opt) => ({
      ...opt,
      label: t(opt.label)
    })));
    __publicField(this, "_debouncedSearchItem");
  }
  formatGroupName(name2) {
    return name2.replace(/-/g, " ").replace(/([a-z])([0-9])/g, "$1 $2");
  }
  async binding() {
    try {
      const resp = await fetch("/data/keyed/cube-recipes.json");
      const raw = await resp.json();
      this.allRecipes = mapV2ToDisplay(raw);
      this.recipes = [...this.allRecipes];
    } catch (e) {
      console.error("Failed to load cube recipes:", e);
      this.allRecipes = [];
      this.recipes = [];
    }
    tagIds(this.allRecipes);
    try {
      const noteSet = /* @__PURE__ */ new Set();
      for (const r of this.allRecipes) {
        const raw = r._raw;
        for (const n of raw?.Notes ?? []) {
          const t2 = format(n).trim();
          if (t2) noteSet.add(t2);
        }
      }
      const noteList = Array.from(noteSet).sort((a, b) => a.localeCompare(b));
      this.noteOptions = [
        { value: "", label: "-" },
        ...noteList.map((n) => ({ value: n, label: n }))
      ];
    } catch {
      this.noteOptions = [{ value: "", label: "-" }];
    }
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam && !isBlankOrInvalid(searchParam))
      this.search = searchParam;
    const noteParam = urlParams.get("note");
    if (noteParam && !isBlankOrInvalid(noteParam))
      this.selectedNote = noteParam;
    const classParam = urlParams.get("selectedClass");
    if (classParam && !isBlankOrInvalid(classParam))
      this.selectedClass = classParam;
  }
  attached() {
    this._debouncedSearchItem = debounce(() => this.handleSearch(), 350);
    this.handleSearch();
    this.updateUrl();
    this._inc.attach(this.sentinelEl, () => this.loadMore());
  }
  detached() {
    this._inc.detach();
    if (this._debouncedSearchItem) this._debouncedSearchItem.cancel();
  }
  applyVisible() {
    this._inc.reset();
    this.visibleRecipes = this._inc.visible(this.recipes);
  }
  loadMore() {
    if (this._inc.grow(this.recipes)) {
      this.visibleRecipes = this._inc.visible(this.recipes);
    }
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleSelectedNoteChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    } else {
      this.handleSearch();
    }
    this.updateUrl();
  }
  handleSelectedClassChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    } else {
      this.handleSearch();
    }
    this.updateUrl();
  }
  // Inputs/Outputs-only flags removed as redundant; search always scans all text
  updateUrl() {
    syncParamsToUrl({
      search: this.search,
      note: this.selectedNote,
      selectedClass: this.selectedClass
    }, false);
  }
  handleSearch() {
    const tokens = tokenizeSearch(this.search);
    const selectedNote = (this.selectedNote || "").toLowerCase();
    const selectedClass = (this.selectedClass || "").toLowerCase();
    if (!tokens.length && !selectedNote && !selectedClass) {
      this.recipes = this.allRecipes;
      this.applyVisible();
      return;
    }
    const found = [];
    for (const recipe of this.allRecipes) {
      if (selectedClass) {
        const rc = (recipe.RequiredClass || "").toLowerCase();
        if (!rc.includes(selectedClass)) continue;
      }
      if (selectedNote) {
        const notes = (recipe._raw?.Notes || []).map(
          (n) => format(n).trim().toLowerCase()
        );
        if (!notes.includes(selectedNote)) continue;
      }
      if (tokens.length) {
        const desc = (recipe.Description || "").toLowerCase();
        const inp = [recipe.Input || "", ...recipe.Inputs || []].join(" ").toLowerCase();
        const out = [recipe.Output || "", ...recipe.Outputs || []].join(" ").toLowerCase();
        const haystack = [inp, out, desc].filter(Boolean).join(" ").toLowerCase();
        if (!matchesTokenGroups(haystack, tokens))
          continue;
      }
      found.push(recipe);
    }
    this.recipes = found;
    this.applyVisible();
  }
  // Reset filters by default (show all) and refresh URL/list
  resetFilters() {
    this.search = "";
    this.selectedNote = void 0;
    this.selectedClass = void 0;
    this.recipes = this.allRecipes;
    this.applyVisible();
    this.updateUrl();
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, CubeRecipes);
__decorateElement(_init, 1, "handleSelectedNoteChanged", _handleSelectedNoteChanged_dec, CubeRecipes);
__decorateElement(_init, 1, "handleSelectedClassChanged", _handleSelectedClassChanged_dec, CubeRecipes);
__decorateElement(_init, 5, "search", _search_dec, CubeRecipes);
__decorateElement(_init, 5, "selectedNote", _selectedNote_dec, CubeRecipes);
__decorateElement(_init, 5, "selectedClass", _selectedClass_dec, CubeRecipes);
CubeRecipes = __decorateElement(_init, 0, "CubeRecipes", _CubeRecipes_decorators, CubeRecipes);
__runInitializers(_init, 1, CubeRecipes);
export {
  CubeRecipes
};
