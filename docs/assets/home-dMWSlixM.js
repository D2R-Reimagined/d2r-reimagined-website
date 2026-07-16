import { C as CustomElement, o as onLanguageChanged, t, c as customElement } from "./index-CTTJeB_J.js";
const name = "home";
const template = '\uFEFF<template>\n    <div class="container mx-auto mt-5">\n        <div class="max-w-5xl mx-auto text-lg type-text p-5">\n            ${\'home_mission_text\' | t}\n        </div>\n        <div class="max-w-5xl mx-auto text-lg type-text p-5">\n            ${\'home_open_source_text\' | t}\n        </div>\n        <div class="max-w-5xl mx-auto text-lg type-text p-5">\n            ${discordBefore}<a href.bind="discordUrl" target="_blank" rel="noopener noreferrer"\n                               class="link-text">${discordUrl}</a>${discordAfter}\n        </div>\n    </div>\n</template>\n';
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
var _Home_decorators, _init;
const DISCORD_URL = "https://discord.gg/9zZkYrSA8C";
_Home_decorators = [customElement(__au2ViewDef)];
class Home {
  discordUrl = DISCORD_URL;
  discordBefore = "";
  discordAfter = "";
  unsubscribe;
  attached() {
    this.refreshDiscordParts();
    this.unsubscribe = onLanguageChanged(() => this.refreshDiscordParts());
  }
  detached() {
    this.unsubscribe?.();
    this.unsubscribe = void 0;
  }
  refreshDiscordParts() {
    const template2 = t("home_discord_text");
    const idx = template2.indexOf("{0}");
    if (idx >= 0) {
      this.discordBefore = template2.substring(0, idx);
      this.discordAfter = template2.substring(idx + "{0}".length);
    } else {
      this.discordBefore = template2;
      this.discordAfter = "";
    }
  }
}
_init = __decoratorStart();
Home = __decorateElement(_init, 0, "Home", _Home_decorators, Home);
__runInitializers(_init, 1, Home);
export {
  Home
};
