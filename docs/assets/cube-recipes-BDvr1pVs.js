import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-B0bmGqGX.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
const name = "cube-recipes";
const template = '<template>\n    <h3 class="text-center my-4">\n        ${recipes.length} Recipes Found\n    </h3>\n    <div class="search my-2 text-center">\n        <form>\n            <label>Search Recipes</label><br>\n            <input type="text" value.bind="search" />\n        </form>\n    </div>\n    <div class="row gy-5 px-5 text-center">\n        <div class="col-12 col-md-6 col-xxl-4" repeat.for="recipe of recipes">\n            <div class="card bg-dark p-2">\n                <div class="unique-text">\n                    ${recipe.Description}\n                </div>\n                <div class="description" innerhtml.bind="recipe.Input | cubeInputs"></div>\n\n                <div class="unique-text">\n                    = <br>\n                    ${recipe.Output}\n                </div>\n            </div>\n        </div>\n    </div>\n</template>';
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
const json = [
  {
    Description: "QUEST - Staff of Kings + Amulet of the Viper = Horadric Staff",
    Item: null,
    Output: "Horadric Staff",
    Input: "Shaft of the Horadric Staff + Amulet of the Viper ",
    CubeRecipeDescription: "Shaft Of The Horadric Staff + Amulet Of The Viper = Horadric Staff"
  },
  {
    Description: "QUEST - Khalim's Flail + Khalim's Heart + Khalim's Eye + Khalim's Brain = Khalim's Will",
    Item: null,
    Output: "Khalim's Will",
    Input: "Khalim's Flail + Khalim's Heart + Khalim's Eye + Khalim's Brain ",
    CubeRecipeDescription: "Khalim's Flail + Khalim's Heart + Khalim's Eye + Khalim's Brain = Khalim's Will"
  },
  {
    Description: "PORTAL - Wirt's Leg + Tome of Town Portal = Portal to The Secret Cow Level",
    Item: null,
    Output: "Cow Portal",
    Input: "Wirt's Leg + Tome of Town Portal ",
    CubeRecipeDescription: "Wirt's Leg + Tome Of Town Portal = Cow Portal"
  },
  {
    Description: "TRANSFORM POTION - 3 Healing Potions (Any) + 3 Mana Potions (Any) + 1 Standard Gem (Any) = Full Rejuvenation Potion",
    Item: null,
    Output: "Full Rejuvenation Potion",
    Input: "3 Healing Potion + 3 Mana Potion + Standard Gem ",
    CubeRecipeDescription: "3 Healing Potion + 3 Mana Potion + Standard Gem = Full Rejuvenation Potion"
  },
  {
    Description: "TRANSFORM POTION - 3 Healing Potions (Any) + 3 Mana Potions (Any)  + 1 Chipped Gem (Any) = Rejuvenation Potion",
    Item: null,
    Output: "Rejuvenation Potion",
    Input: "3 Healing Potion + 3 Mana Potion + Chipped Gem ",
    CubeRecipeDescription: "3 Healing Potion + 3 Mana Potion + Chipped Gem = Rejuvenation Potion"
  },
  {
    Description: "TRANSFORM POTION - 3 Rejuvenation Potions = Full Rejuvenation Potion",
    Item: null,
    Output: "Full Rejuvenation Potion",
    Input: "3 Rejuvenation Potion ",
    CubeRecipeDescription: "3 Rejuvenation Potion = Full Rejuvenation Potion"
  },
  {
    Description: "CRAFT AMULET - 6 Perfect Gems (1 of each type) + 1 Magic Amulet = Prismatic Amulet",
    Item: null,
    Output: "Gymnast's Amulet",
    Input: "Magic Amulet + Perfect Amethyst + Perfect Topaz + Perfect Sapphire + Perfect Emerald + Perfect Ruby + Perfect Diamond ",
    CubeRecipeDescription: "Magic Amulet + Perfect Amethyst + Perfect Topaz + Perfect Sapphire + Perfect Emerald + Perfect Ruby + Perfect Diamond = Gymnast's Amulet"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Perfect Ruby + 1 Exploding Potion = Garnet Ring",
    Item: null,
    Output: "Expert's Ring",
    Input: "Magic Ring + Perfect Ruby + Exploding Potion ",
    CubeRecipeDescription: "Magic Ring + Perfect Ruby + Exploding Potion = Expert's Ring"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Perfect Sapphire + 1 Thawing Potion = Cobalt Ring",
    Item: null,
    Output: "Accursed Ring",
    Input: "Magic Ring + Perfect Sapphire + Thawing Potion ",
    CubeRecipeDescription: "Magic Ring + Perfect Sapphire + Thawing Potion = Accursed Ring"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Perfect Topaz + 1 Rejuvenation Potion = Coral Ring",
    Item: null,
    Output: "Communal Ring",
    Input: "Magic Ring + Perfect Topaz + Rejuvenation Potion ",
    CubeRecipeDescription: "Magic Ring + Perfect Topaz + Rejuvenation Potion = Communal Ring"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Standard Emerald + 1 Antidote Potion = Jade Ring",
    Item: null,
    Output: "gnostics1 Ring",
    Input: "Magic Ring + Perfect Emerald + Antidote Potion ",
    CubeRecipeDescription: "Magic Ring + Perfect Emerald + Antidote Potion = Gnostics1 Ring"
  },
  {
    Description: "CRAFT WEAPON - 1 Axe (Any) + 1 Dagger (Any) = Throwing Axe",
    Item: null,
    Output: "Normal Throwing Axe",
    Input: "Axe + Knife ",
    CubeRecipeDescription: "Axe + Knife = Normal Throwing Axe"
  },
  {
    Description: "CRAFT WEAPON - 1 Spear (Any) + 1 Arrows = Javelins",
    Item: null,
    Output: "Normal Javelin",
    Input: "Spear + Arrows ",
    CubeRecipeDescription: "Spear + Arrows = Normal Javelin"
  },
  {
    Description: "REROLL MAGIC RING - 3 Magic Rings = Magic Amulet",
    Item: null,
    Output: "Magic Amulet",
    Input: "3 Magic Ring ",
    CubeRecipeDescription: "3 Magic Ring = Magic Amulet"
  },
  {
    Description: "REROLl MAGIC AMULET - 3 Magic Amulets = Magic Ring",
    Item: null,
    Output: "Magic Ring",
    Input: "3 Magic Amulet ",
    CubeRecipeDescription: "3 Magic Amulet = Magic Ring"
  },
  {
    Description: "SOCKET WEAPON MAGIC - 3 Standard Gems + 1 Socketed Weapon = Socketed Magic Weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Socketed Weapon + 3 Standard Gem ",
    CubeRecipeDescription: "Socketed Weapon + 3 Standard Gem = Magic Weapon"
  },
  {
    Description: "SOCKET WAPON MAGIC - 3 Flawless Gems + 1 Magic Weapon = Socketed Magic Weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Magic Weapon + 3 Flawless Gem ",
    CubeRecipeDescription: "Magic Weapon + 3 Flawless Gem = Magic Weapon"
  },
  {
    Description: "CRAFT MAGIC SHIELD - 1 Magic Shield + 1 Spiked Club + 2 Skulls (Any) = Magic Shield of Spikes",
    Item: null,
    Output: "Any Shield of the Lamprey",
    Input: "Magic Any Shield + 2 Skull + Spiked Club ",
    CubeRecipeDescription: "Magic Any Shield + 2 Skull + Spiked Club = Any Shield Of The Lamprey"
  },
  {
    Description: "CRAFT MAGIC SWORD - 4 Healing Potions (Any) + 1 Standard Ruby + 1 Magic Sword = Sword of the Leech",
    Item: null,
    Output: "Sword of the Colosuss",
    Input: "Magic Sword + Ruby + 4 Healing Potion ",
    CubeRecipeDescription: "Magic Sword + Ruby + 4 Healing Potion = Sword Of The Colosuss"
  },
  {
    Description: "CRAFT MAGIC POLEARM - 1 Diamond (Any) + 1 Kris + 1 Staff + 1 Belt = Savage Polearm",
    Item: null,
    Output: "Jagged Polearm",
    Input: "Kris + Diamond + Staff + Belt ",
    CubeRecipeDescription: "Kris + Diamond + Staff + Belt = Jagged Polearm"
  },
  {
    Description: "TRANSFORM POTION - 1 Strangling Gas Potion + 1 Healing Potion (Any) = Antidote Potion",
    Item: null,
    Output: "Antidote Potion",
    Input: "Strangling Gas Potion + Healing Potion ",
    CubeRecipeDescription: "Strangling Gas Potion + Healing Potion = Antidote Potion"
  },
  {
    Description: "CRAFT BOLTS - 2 Arrows = Bolts",
    Item: null,
    Output: "Bolts",
    Input: "2 Arrows ",
    CubeRecipeDescription: "2 Arrows = Bolts"
  },
  {
    Description: "CRAFT ARROWS - 2 Bolts = Arrows",
    Item: null,
    Output: "Arrows",
    Input: "2 Bolts ",
    CubeRecipeDescription: "2 Bolts = Arrows"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Amethysts = Flawed Amethyst",
    Item: null,
    Output: "Flawed Amethyst",
    Input: "2 Chipped Amethyst ",
    CubeRecipeDescription: "2 Chipped Amethyst = Flawed Amethyst"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Amethysts = Standard Amethyst",
    Item: null,
    Output: "Amethyst",
    Input: "2 Flawed Amethyst ",
    CubeRecipeDescription: "2 Flawed Amethyst = Amethyst"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Amethysts = Flawless Amethyst",
    Item: null,
    Output: "Flawless Amethyst",
    Input: "2 Amethyst ",
    CubeRecipeDescription: "2 Amethyst = Flawless Amethyst"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Amethysts = Perfect Amethyst",
    Item: null,
    Output: "Perfect Amethyst",
    Input: "2 Flawless Amethyst ",
    CubeRecipeDescription: "2 Flawless Amethyst = Perfect Amethyst"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Rubies = Flawed Ruby",
    Item: null,
    Output: "Flawed Ruby",
    Input: "2 Chipped Ruby ",
    CubeRecipeDescription: "2 Chipped Ruby = Flawed Ruby"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Rubies = Standard Ruby",
    Item: null,
    Output: "Ruby",
    Input: "2 Flawed Ruby ",
    CubeRecipeDescription: "2 Flawed Ruby = Ruby"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Rubies = Flawless Ruby",
    Item: null,
    Output: "Flawless Ruby",
    Input: "2 Ruby ",
    CubeRecipeDescription: "2 Ruby = Flawless Ruby"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Rubies = Perfect Ruby",
    Item: null,
    Output: "Perfect Ruby",
    Input: "2 Flawless Ruby ",
    CubeRecipeDescription: "2 Flawless Ruby = Perfect Ruby"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Sapphires = Flawed Sapphire",
    Item: null,
    Output: "Flawed Sapphire",
    Input: "2 Chipped Sapphire ",
    CubeRecipeDescription: "2 Chipped Sapphire = Flawed Sapphire"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Sapphires = Standard Sapphire",
    Item: null,
    Output: "Sapphire",
    Input: "2 Flawed Sapphire ",
    CubeRecipeDescription: "2 Flawed Sapphire = Sapphire"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Sapphires = Flawless Sapphire",
    Item: null,
    Output: "Flawless Sapphire",
    Input: "2 Sapphire ",
    CubeRecipeDescription: "2 Sapphire = Flawless Sapphire"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Sapphires = Perfect Sapphire",
    Item: null,
    Output: "Perfect Sapphire",
    Input: "2 Flawless Sapphire ",
    CubeRecipeDescription: "2 Flawless Sapphire = Perfect Sapphire"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Topazes = Flawed Topaz",
    Item: null,
    Output: "Flawed Topaz",
    Input: "2 Chipped Topaz ",
    CubeRecipeDescription: "2 Chipped Topaz = Flawed Topaz"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Topazes = Standard Topaz",
    Item: null,
    Output: "Topaz",
    Input: "2 Flawed Topaz ",
    CubeRecipeDescription: "2 Flawed Topaz = Topaz"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Topazes = Flawless Topaz",
    Item: null,
    Output: "Flawless Topaz",
    Input: "2 Topaz ",
    CubeRecipeDescription: "2 Topaz = Flawless Topaz"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Topazes = Perfect Topaz",
    Item: null,
    Output: "Perfect Topaz",
    Input: "2 Flawless Topaz ",
    CubeRecipeDescription: "2 Flawless Topaz = Perfect Topaz"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Emeralds = Flawed Emerald",
    Item: null,
    Output: "Flawed Emerald",
    Input: "2 Chipped Emerald ",
    CubeRecipeDescription: "2 Chipped Emerald = Flawed Emerald"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Emeralds = Standard Emerald",
    Item: null,
    Output: "Emerald",
    Input: "2 Flawed Emerald ",
    CubeRecipeDescription: "2 Flawed Emerald = Emerald"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Emeralds = Flawless Emerald",
    Item: null,
    Output: "Flawless Emerald",
    Input: "2 Emerald ",
    CubeRecipeDescription: "2 Emerald = Flawless Emerald"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Emeralds = Perfect Emerald",
    Item: null,
    Output: "Perfect Emerald",
    Input: "2 Flawless Emerald ",
    CubeRecipeDescription: "2 Flawless Emerald = Perfect Emerald"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Diamonds = Flawed Diamond",
    Item: null,
    Output: "Flawed Diamond",
    Input: "2 Chipped Diamond ",
    CubeRecipeDescription: "2 Chipped Diamond = Flawed Diamond"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Diamonds = Standard Diamond",
    Item: null,
    Output: "Diamond",
    Input: "2 Flawed Diamond ",
    CubeRecipeDescription: "2 Flawed Diamond = Diamond"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Diamonds = Flawless Diamond",
    Item: null,
    Output: "Flawless Diamond",
    Input: "2 Diamond ",
    CubeRecipeDescription: "2 Diamond = Flawless Diamond"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Diamonds = Perfect Diamond",
    Item: null,
    Output: "Perfect Diamond",
    Input: "2 Flawless Diamond ",
    CubeRecipeDescription: "2 Flawless Diamond = Perfect Diamond"
  },
  {
    Description: "UPGRADE GEM - 2 Chipped Skulls = Flawed Skull",
    Item: null,
    Output: "Flawed Skull",
    Input: "2 Chipped Skull ",
    CubeRecipeDescription: "2 Chipped Skull = Flawed Skull"
  },
  {
    Description: "UPGRADE GEM - 2 Flawed Skulls = Standard Skull",
    Item: null,
    Output: "Skull",
    Input: "2 Flawed Skull ",
    CubeRecipeDescription: "2 Flawed Skull = Skull"
  },
  {
    Description: "UPGRADE GEM - 2 Standard Skulls = Flawless Skull",
    Item: null,
    Output: "Flawless Skull",
    Input: "2 Skull ",
    CubeRecipeDescription: "2 Skull = Flawless Skull"
  },
  {
    Description: "UPGRADE GEM - 2 Flawless Skulls = Perfect Skull",
    Item: null,
    Output: "Perfect Skull",
    Input: "2 Flawless Skull ",
    CubeRecipeDescription: "2 Flawless Skull = Perfect Skull"
  },
  {
    Description: "UPGRADE RUNE - 3 El Runes = Eld Rune",
    Item: null,
    Output: "Eld Rune",
    Input: "2 El Rune ",
    CubeRecipeDescription: "2 El Rune = Eld Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Eld Runes = Tir Rune",
    Item: null,
    Output: "Tir Rune",
    Input: "2 Eld Rune ",
    CubeRecipeDescription: "2 Eld Rune = Tir Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Tir Runes = Nef Rune",
    Item: null,
    Output: "Nef Rune",
    Input: "2 Tir Rune ",
    CubeRecipeDescription: "2 Tir Rune = Nef Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Nef Runes = Eth Rune",
    Item: null,
    Output: "Eth Rune",
    Input: "2 Nef Rune ",
    CubeRecipeDescription: "2 Nef Rune = Eth Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Eth Runes = Ith Rune",
    Item: null,
    Output: "Ith Rune",
    Input: "2 Eth Rune ",
    CubeRecipeDescription: "2 Eth Rune = Ith Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Ith Runes = Tal Rune",
    Item: null,
    Output: "Tal Rune",
    Input: "2 Ith Rune ",
    CubeRecipeDescription: "2 Ith Rune = Tal Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Tal Runes = Ral Rune",
    Item: null,
    Output: "Ral Rune",
    Input: "2 Tal Rune ",
    CubeRecipeDescription: "2 Tal Rune = Ral Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Ral Runes = Ort Rune",
    Item: null,
    Output: "Ort Rune",
    Input: "2 Ral Rune ",
    CubeRecipeDescription: "2 Ral Rune = Ort Rune"
  },
  {
    Description: "UPGRADE RUNE - 3 Ort Runes = Thul Rune",
    Item: null,
    Output: "Thul Rune",
    Input: "2 Ort Rune ",
    CubeRecipeDescription: "2 Ort Rune = Thul Rune"
  },
  {
    Description: "REROLL MAGIC ITEM - 3 Perfect Gems (Any) + 1 Magic Item = Re-rolled Magic Item",
    Item: null,
    Output: "Magic item",
    Input: "Magic any + 3 Perfect Gem ",
    CubeRecipeDescription: "Magic Any + 3 Perfect Gem = Magic Item"
  },
  {
    Description: "REROLL MAGIC ITEM - 3 Perfect Gems stack (Any) + 1 Magic Item = Re-rolled Magic Item",
    Item: null,
    Output: "Magic item",
    Input: "Magic any + 3 Perfect Gem Stack ",
    CubeRecipeDescription: "Magic Any + 3 Perfect Gem Stack = Magic Item"
  },
  {
    Description: "REROLL MAGIC ITEM - 3 Perfect Gems stack (Any) + 1 Magic Item = Re-rolled Magic Item",
    Item: null,
    Output: "Perfect Gem Stack",
    Input: "Perfect Gem Stack + Magic Grand Charm ",
    CubeRecipeDescription: "Perfect Gem Stack + Magic Grand Charm = Perfect Gem Stack"
  },
  {
    Description: "REROLL MAGIC ITEM - 3 Perfect Gems stack (Any) + 1 Magic Item = Re-rolled Magic Item",
    Item: null,
    Output: "Perfect Gem Stack",
    Input: "Perfect Gem Stack + Magic Large Charm ",
    CubeRecipeDescription: "Perfect Gem Stack + Magic Large Charm = Perfect Gem Stack"
  },
  {
    Description: "REROLL MAGIC ITEM - 3 Perfect Gems stack (Any) + 1 Magic Item = Re-rolled Magic Item",
    Item: null,
    Output: "Perfect Gem Stack",
    Input: "Perfect Gem Stack + Magic Small Charm ",
    CubeRecipeDescription: "Perfect Gem Stack + Magic Small Charm = Perfect Gem Stack"
  },
  {
    Description: "REROLL RARE ITEM - 6 Perfect Skulls + 1 Rare Item = 1 Low Quality Rare Item",
    Item: null,
    Output: "Rare item",
    Input: "Rare any + 6 Perfect Skull ",
    CubeRecipeDescription: "Rare Any + 6 Perfect Skull = Rare Item"
  },
  {
    Description: "UPGRADE RARE ITEM QUALITY - 3 Perfect Skull + 1 Rare Item + 1 Stone of Jordan = 1 High Quality Rare Item",
    Item: null,
    Output: "Rare item",
    Input: "Rare any + Perfect Skull + The Stone of Jordan ",
    CubeRecipeDescription: "Rare Any + Perfect Skull + The Stone Of Jordan = Rare Item"
  },
  {
    Description: "SOCKET ITEM RARE - 3 Perfect Skull + 1 Rare Item + 1 Stone of Jordan = Add 1 Socket to Rare Item",
    Item: null,
    Output: "1 Sockets",
    Input: "Rare No Socket any + 3 Perfect Skull + The Stone of Jordan ",
    CubeRecipeDescription: "Rare No Socket Any + 3 Perfect Skull + The Stone Of Jordan = 1 Sockets"
  },
  {
    Description: "CRAFT HELM - 1 Magic Full Helm + 1 Jewel + 1 Ith Rune + 1 Perfect Sapphire = Hit Power Helm",
    Item: null,
    Output: "Magic Full Helm",
    Input: "Magic Full Helm + Jewel + Ith Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Full Helm + Jewel + Ith Rune + Perfect Sapphire = Magic Full Helm"
  },
  {
    Description: "CRAFT BOOTS - 1 Magic Chain Boots + 1 Jewel + 1 Ral Rune + 1 Perfect Sapphire = Hit Power Boots",
    Item: null,
    Output: "Magic Chain Boots",
    Input: "Magic Chain Boots + Jewel + Ral Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Chain Boots + Jewel + Ral Rune + Perfect Sapphire = Magic Chain Boots"
  },
  {
    Description: "CRAFT GLOVES - 1 Magic Chain Gloves + 1 Jewel + 1 Ort Rune + 1 Perfect Sapphire = Hit Power Gloves",
    Item: null,
    Output: "Magic Chain Gloves",
    Input: "Magic Chain Gloves + Jewel + Ort Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Chain Gloves + Jewel + Ort Rune + Perfect Sapphire = Magic Chain Gloves"
  },
  {
    Description: "CRAFT BELT - 1 Magic Heavy Belt + 1 Jewel + 1 Tal Rune + 1 Perfect Sapphire = Hit Power Belt",
    Item: null,
    Output: "Magic Heavy Belt",
    Input: "Magic Heavy Belt + Jewel + Tal Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Heavy Belt + Jewel + Tal Rune + Perfect Sapphire = Magic Heavy Belt"
  },
  {
    Description: "CRAFT SHIELD - 1 Magic Gothic Shield + 1 Jewel + 1 Eth Rune + 1 Perfect Sapphire = Hit Power Shield",
    Item: null,
    Output: "Magic Gothic Shield",
    Input: "Magic Gothic Shield + Jewel + Eth Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Gothic Shield + Jewel + Eth Rune + Perfect Sapphire = Magic Gothic Shield"
  },
  {
    Description: "CRAFT ARMOR - 1 Magic Field Plate + 1 Jewel + 1 Nef Rune + 1 Perfect Sapphire = Hit Power Body",
    Item: null,
    Output: "Magic Field Plate",
    Input: "Magic Field Plate + Jewel + Nef Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Field Plate + Jewel + Nef Rune + Perfect Sapphire = Magic Field Plate"
  },
  {
    Description: "CRAFT AMULET - 1 Magic Amulet + 1 Jewel + Thul Rune + 1 Perfect Sapphire = Hit Power Amulet",
    Item: null,
    Output: "Amulet",
    Input: "Magic Amulet + Jewel + Thul Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Amulet + Jewel + Thul Rune + Perfect Sapphire = Amulet"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Jewel + 1 Amn Rune + 1 Perfect Sapphire = Hit Power Ring",
    Item: null,
    Output: "Ring",
    Input: "Magic Ring + Jewel + Amn Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Ring + Jewel + Amn Rune + Perfect Sapphire = Ring"
  },
  {
    Description: "CRAFT WEAPON - 1 Magic Blunt Weapon + 1 Jewel + 1 Tir Rune + 1 Perfect Sapphire = Hit Power Weapon",
    Item: null,
    Output: "Blunt",
    Input: "Magic Blunt + Jewel + Tir Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Magic Blunt + Jewel + Tir Rune + Perfect Sapphire = Blunt"
  },
  {
    Description: "CRAFT HELM - 1 Magic Helm + 1 Jewel + 1 Ral Rune + 1 Perfect Ruby = Blood Helm",
    Item: null,
    Output: "Magic Helm",
    Input: "Magic Helm + Jewel + Ral Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Helm + Jewel + Ral Rune + Perfect Ruby = Magic Helm"
  },
  {
    Description: "CRAFT BOOTS - 1 Magic Light Plated Boots + 1 Jewel + 1 Eth Rune + 1 Perfect Ruby = Blood Boots",
    Item: null,
    Output: "Magic Light Plated Boots",
    Input: "Magic Light Plated Boots + Jewel + Eth Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Light Plated Boots + Jewel + Eth Rune + Perfect Ruby = Magic Light Plated Boots"
  },
  {
    Description: "CRAFT GLOVES - 1 Magic Heavy Gloves + 1 Jewel + 1 Nef Rune + 1 Perfect Ruby = Blood Gloves",
    Item: null,
    Output: "Magic Heavy Gloves",
    Input: "Magic Heavy Gloves + Jewel + Nef Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Heavy Gloves + Jewel + Nef Rune + Perfect Ruby = Magic Heavy Gloves"
  },
  {
    Description: "CRAFT BELT - 1 Magic Belt + 1 Jewel + 1 Tal Rune + 1 Perfect Ruby = Blood Belt",
    Item: null,
    Output: "Magic Belt",
    Input: "Magic Belt + Jewel + Tal Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Belt + Jewel + Tal Rune + Perfect Ruby = Magic Belt"
  },
  {
    Description: "CRAFT SHIELD - 1 Magic Spiked Shield + 1 Jewel + 1 Ith Rune + 1 Perfect Ruby = Blood Shield",
    Item: null,
    Output: "Magic Spiked Shield",
    Input: "Magic Spiked Shield + Jewel + Ith Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Spiked Shield + Jewel + Ith Rune + Perfect Ruby = Magic Spiked Shield"
  },
  {
    Description: "CRAFT ARMOR - 1 Magic Plate Mail + 1 Jewel + 1 Thul Rune + 1 Perfect Ruby = Blood Body",
    Item: null,
    Output: "Magic Plate Mail",
    Input: "Magic Plate Mail + Jewel + Thul Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Plate Mail + Jewel + Thul Rune + Perfect Ruby = Magic Plate Mail"
  },
  {
    Description: "CRAFT AMULET - 1 Magic Amulet + 1 Jewel + 1 Amn Rune + 1 Perfect Ruby = Blood Amulet",
    Item: null,
    Output: "Amulet",
    Input: "Magic Amulet + Jewel + Amn Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Amulet + Jewel + Amn Rune + Perfect Ruby = Amulet"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Jewel + 1 Sol Rune + 1 Perfect Ruby = Blood Ring",
    Item: null,
    Output: "Ring",
    Input: "Magic Ring + Jewel + Sol Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Ring + Jewel + Sol Rune + Perfect Ruby = Ring"
  },
  {
    Description: "CRAFT WEAPON - 1 Magic Axe + 1 Jewel + Ort Rune + 1 Perfect Ruby = Blood Weapon",
    Item: null,
    Output: "Axe",
    Input: "Magic Axe + Jewel + Ort Rune + Perfect Ruby ",
    CubeRecipeDescription: "Magic Axe + Jewel + Ort Rune + Perfect Ruby = Axe"
  },
  {
    Description: "CRAFT HELM - 1 Magic Mask + 1 Jewel + Nef Rune + 1 Perfect Amethyst = Caster Helm",
    Item: null,
    Output: "Magic Mask",
    Input: "Magic Mask + Jewel + Nef Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Mask + Jewel + Nef Rune + Perfect Amethyst = Magic Mask"
  },
  {
    Description: "CRAFT BOOTS - 1 Magic Boots + 1 Jewel + Thul Rune + 1 Perfect Amethyst = Caster Boots",
    Item: null,
    Output: "Magic Boots",
    Input: "Magic Boots + Jewel + Thul Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Boots + Jewel + Thul Rune + Perfect Amethyst = Magic Boots"
  },
  {
    Description: "CRAFT GLOVES - 1 Magic Leather Gloves + 1 Jewel + Ort Rune + 1 Perfect Amethyst = Caster Gloves",
    Item: null,
    Output: "Magic Leather Gloves",
    Input: "Magic Leather Gloves + Jewel + Ort Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Leather Gloves + Jewel + Ort Rune + Perfect Amethyst = Magic Leather Gloves"
  },
  {
    Description: "CRAFT BELT - 1 Magic Light Belt + 1 Jewel + Ith Rune + 1 Perfect Amethyst = Caster Belt",
    Item: null,
    Output: "Magic Light Belt",
    Input: "Magic Light Belt + Jewel + Ith Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Light Belt + Jewel + Ith Rune + Perfect Amethyst = Magic Light Belt"
  },
  {
    Description: "CRAFT SHIELD - 1 Magic Small Shield + 1 Jewel + 1 Eth Rune + 1 Perfect Amethyst = Caster Shield",
    Item: null,
    Output: "Magic Small Shield",
    Input: "Magic Small Shield + Jewel + Eth Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Small Shield + Jewel + Eth Rune + Perfect Amethyst = Magic Small Shield"
  },
  {
    Description: "CRAFT ARMOR - 1 Magic Light Plate + 1 Jewel + 1 Tal Rune + 1 Perfect Amethyst = Caster Body",
    Item: null,
    Output: "Magic Light Plate",
    Input: "Magic Light Plate + Jewel + Tal Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Light Plate + Jewel + Tal Rune + Perfect Amethyst = Magic Light Plate"
  },
  {
    Description: "CRAFT AMULET - 1 Magic Amulet + 1 Jewel + 1 Ral Rune + 1 Perfect Amethyst = Caster Amulet",
    Item: null,
    Output: "Amulet",
    Input: "Magic Amulet + Jewel + Ral Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Amulet + Jewel + Ral Rune + Perfect Amethyst = Amulet"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Jewel + 1 Amn Rune + 1 Perfect Amethyst = Caster Ring",
    Item: null,
    Output: "Ring",
    Input: "Magic Ring + Jewel + Amn Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Ring + Jewel + Amn Rune + Perfect Amethyst = Ring"
  },
  {
    Description: "CRAFT WEAPON - 1 Magic Rod + 1 Jewel + 1 Tir Rune + 1 Perfect Amethyst = Caster Weapon",
    Item: null,
    Output: "Staves And Rods",
    Input: "Magic Staves And Rods + Jewel + Tir Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Magic Staves And Rods + Jewel + Tir Rune + Perfect Amethyst = Staves And Rods"
  },
  {
    Description: "CRAFT HELM - Magic Crown + 1 Jewel + 1 Ith Rune + 1 Perfect Emerald = Safety Helm",
    Item: null,
    Output: "Magic Crown",
    Input: "Magic Crown + Jewel + Ith Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Crown + Jewel + Ith Rune + Perfect Emerald = Magic Crown"
  },
  {
    Description: "CRAFT BOOTS - 1 Magic Plated Boots + 1 Jewel + 1 Ort Rune + 1 Perfect Emerald = Safety Boots",
    Item: null,
    Output: "Magic Greaves",
    Input: "Magic Greaves + Jewel + Ort Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Greaves + Jewel + Ort Rune + Perfect Emerald = Magic Greaves"
  },
  {
    Description: "CRAFT GLOVES - 1 Magic Gauntlets + 1 Jewel + 1 Ral Rune + 1 Perfect Emerald = Safety Gloves",
    Item: null,
    Output: "Magic Gauntlets",
    Input: "Magic Gauntlets + Jewel + Ral Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Gauntlets + Jewel + Ral Rune + Perfect Emerald = Magic Gauntlets"
  },
  {
    Description: "CRAFT BELT - 1 Magic Sash + 1 Jewel + 1 Tal Rune + 1 Perfect Emerald = Safety Belt",
    Item: null,
    Output: "Magic Sash",
    Input: "Magic Sash + Jewel + Tal Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Sash + Jewel + Tal Rune + Perfect Emerald = Magic Sash"
  },
  {
    Description: "CRAFT SHIELD - 1 Magic Kite Shield + 1 Jewel + 1 Nef Rune + 1 Perfect Emerald = Safety Shield",
    Item: null,
    Output: "Magic Kite Shield",
    Input: "Magic Kite Shield + Jewel + Nef Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Kite Shield + Jewel + Nef Rune + Perfect Emerald = Magic Kite Shield"
  },
  {
    Description: "CRAFT ARMOR - 1 Magic Breast Plate + 1 Jewel + 1 Eth Rune + 1 Perfect Emerald = Safety Body",
    Item: null,
    Output: "Magic Breast Plate",
    Input: "Magic Breast Plate + Jewel + Eth Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Breast Plate + Jewel + Eth Rune + Perfect Emerald = Magic Breast Plate"
  },
  {
    Description: "CRAFT AMULET - 1 Magic Amulet + 1 Jewel + 1 Thul Rune + 1 Perfect Emerald = Safety Amulet",
    Item: null,
    Output: "Amulet",
    Input: "Magic Amulet + Jewel + Thul Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Amulet + Jewel + Thul Rune + Perfect Emerald = Amulet"
  },
  {
    Description: "CRAFT RING - 1 Magic Ring + 1 Jewel + 1 Amn Rune + 1 Perfect Emerald = Safety Ring",
    Item: null,
    Output: "Ring",
    Input: "Magic Ring + Jewel + Amn Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Ring + Jewel + Amn Rune + Perfect Emerald = Ring"
  },
  {
    Description: "CRAFT WEAPON - SPEAR - 1 Magic Spear + 1 Jewel + 1 Sol Rune + 1 Perfect Emerald = Safety Weapon",
    Item: null,
    Output: "Spear",
    Input: "Magic Spear + Jewel + Sol Rune + Perfect Emerald ",
    CubeRecipeDescription: "Magic Spear + Jewel + Sol Rune + Perfect Emerald = Spear"
  },
  {
    Description: "UPGRADE RUNE - 2 Thul Runes = Amn Rune",
    Item: null,
    Output: "Amn Rune",
    Input: "2 Thul Rune ",
    CubeRecipeDescription: "2 Thul Rune = Amn Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Amn Runes = Sol Rune",
    Item: null,
    Output: "Sol Rune",
    Input: "2 Amn Rune ",
    CubeRecipeDescription: "2 Amn Rune = Sol Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Sol Runes = Shael Rune",
    Item: null,
    Output: "Shael Rune",
    Input: "2 Sol Rune ",
    CubeRecipeDescription: "2 Sol Rune = Shael Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Shael Runes = Dol Rune",
    Item: null,
    Output: "Dol Rune",
    Input: "2 Shael Rune ",
    CubeRecipeDescription: "2 Shael Rune = Dol Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Dol Runes = Hel Rune",
    Item: null,
    Output: "Hel Rune",
    Input: "2 Dol Rune ",
    CubeRecipeDescription: "2 Dol Rune = Hel Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Hel Runes = Io Rune",
    Item: null,
    Output: "Io Rune",
    Input: "2 Hel Rune ",
    CubeRecipeDescription: "2 Hel Rune = Io Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Io Runes = Lum Rune",
    Item: null,
    Output: "Lum Rune",
    Input: "2 Io Rune ",
    CubeRecipeDescription: "2 Io Rune = Lum Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Lum Runes  = Ko Rune",
    Item: null,
    Output: "Ko Rune",
    Input: "2 Lum Rune ",
    CubeRecipeDescription: "2 Lum Rune = Ko Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Ko Runes = Fal Rune",
    Item: null,
    Output: "Fal Rune",
    Input: "2 Ko Rune ",
    CubeRecipeDescription: "2 Ko Rune = Fal Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Fal Runes = Lem Rune",
    Item: null,
    Output: "Lem Rune",
    Input: "2 Fal Rune ",
    CubeRecipeDescription: "2 Fal Rune = Lem Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Lem Runes = Pul Rune",
    Item: null,
    Output: "Pul Rune",
    Input: "2 Lem Rune ",
    CubeRecipeDescription: "2 Lem Rune = Pul Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Pul Runes = Um Rune",
    Item: null,
    Output: "Um Rune",
    Input: "2 Pul Rune ",
    CubeRecipeDescription: "2 Pul Rune = Um Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Um Runes = Mal Rune",
    Item: null,
    Output: "Mal Rune",
    Input: "2 Um Rune ",
    CubeRecipeDescription: "2 Um Rune = Mal Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Mal Runes = Ist Rune",
    Item: null,
    Output: "Ist Rune",
    Input: "2 Mal Rune ",
    CubeRecipeDescription: "2 Mal Rune = Ist Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Ist Runes = Gul Rune",
    Item: null,
    Output: "Gul Rune",
    Input: "2 Ist Rune ",
    CubeRecipeDescription: "2 Ist Rune = Gul Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Gul Runes = Vex Rune",
    Item: null,
    Output: "Vex Rune",
    Input: "2 Gul Rune ",
    CubeRecipeDescription: "2 Gul Rune = Vex Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Vex Runes = Ohm Rune",
    Item: null,
    Output: "Ohm Rune",
    Input: "2 Vex Rune ",
    CubeRecipeDescription: "2 Vex Rune = Ohm Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Ohm Runes = Lo Rune",
    Item: null,
    Output: "Lo Rune",
    Input: "2 Ohm Rune ",
    CubeRecipeDescription: "2 Ohm Rune = Lo Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Lo Runes = Sur Rune",
    Item: null,
    Output: "Sur Rune",
    Input: "2 Lo Rune ",
    CubeRecipeDescription: "2 Lo Rune = Sur Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Sur Runes = Ber Rune",
    Item: null,
    Output: "Ber Rune",
    Input: "2 Sur Rune ",
    CubeRecipeDescription: "2 Sur Rune = Ber Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Ber Runes = Jah Rune",
    Item: null,
    Output: "Jah Rune",
    Input: "2 Ber Rune ",
    CubeRecipeDescription: "2 Ber Rune = Jah Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Jah Runes = Cham Rune",
    Item: null,
    Output: "Cham Rune",
    Input: "2 Jah Rune ",
    CubeRecipeDescription: "2 Jah Rune = Cham Rune"
  },
  {
    Description: "UPGRADE RUNE - 2 Cham Runes = Zod Rune",
    Item: null,
    Output: "Zod Rune",
    Input: "2 Cham Rune ",
    CubeRecipeDescription: "2 Cham Rune = Zod Rune"
  },
  {
    Description: "SOCKET ARMOR NORMAL - 1 Tal Rune + 1 Thul Rune + 1 Perfect Topaz + 1 Normal Torso Armor = Socketed Torso Armor",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal No Socket Armor + Tal Rune + Thul Rune + Perfect Topaz ",
    CubeRecipeDescription: "Normal No Socket Armor + Tal Rune + Thul Rune + Perfect Topaz = Socketed Armor"
  },
  {
    Description: "SOCKET WEAPON NORMAL - 1 Ral Rune + 1 Amn Rune + 1 Perfect Amethyst + 1 Normal Weapon = Socketed Weapon",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal No Socket Weapon + Ral Rune + Amn Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Normal No Socket Weapon + Ral Rune + Amn Rune + Perfect Amethyst = Socketed Weapon"
  },
  {
    Description: "SOCKET HELM NORMAL - 1 Ral Rune + 1 Thul Rune + 1 Perfect Sapphire + 1 Normal Helm = Socketed Helm",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Normal No Socket Merc Equip + Ral Rune + Thul Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Normal No Socket Merc Equip + Ral Rune + Thul Rune + Perfect Sapphire = Socketed Merc Equip"
  },
  {
    Description: "SOCKET SHIELD NORMAL - 1 Tal Rune + 1 Amn Rune + 1 Perfect Ruby + 1 Normal Shield = Socketed Shield",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Normal No Socket Any Shield + Tal Rune + Amn Rune + Perfect Ruby ",
    CubeRecipeDescription: "Normal No Socket Any Shield + Tal Rune + Amn Rune + Perfect Ruby = Socketed Any Shield"
  },
  {
    Description: "TRANFORM LQ WEAPON - 1 Eld Rune + 1 Chipped Gem (Any) + 1 Low Quality Weapon = Normal Weapon",
    Item: null,
    Output: "Normal Weapon",
    Input: "Low Quality Weapon + Eld Rune + Chipped Gem ",
    CubeRecipeDescription: "Low Quality Weapon + Eld Rune + Chipped Gem = Normal Weapon"
  },
  {
    Description: "TRANFORM LQ ARMOR - 1 El Rune + 1 Chipped Gem (Any) + 1 Low Quality Armor = Normal Armor",
    Item: null,
    Output: "Normal Any Armor",
    Input: "Low Quality Any Armor + El Rune + Chipped Gem ",
    CubeRecipeDescription: "Low Quality Any Armor + El Rune + Chipped Gem = Normal Any Armor"
  },
  {
    Description: "UPGRADE UNIQUE WEAPON QUALITY - 1 Ral Rune + 1 Sol Rune + 1 Perfect Emerald + 1 Normal Unique Weapon = Exceptional Unique Weapon",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Unique Weapon + Ral Rune + Sol Rune + Perfect Emerald ",
    CubeRecipeDescription: "Basic Unique Weapon + Ral Rune + Sol Rune + Perfect Emerald = Exceptional Weapon"
  },
  {
    Description: "UPGRADE UNIQUE ARMOR QUALITY - 1 Tal Rune + 1 Shael Rune + 1 Perfect Diamond + 1 Normal Unique Armor = Exceptional Unique Armor",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Unique Any Armor + Tal Rune + Shael Rune + Perfect Diamond ",
    CubeRecipeDescription: "Basic Unique Any Armor + Tal Rune + Shael Rune + Perfect Diamond = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE UNIQUE WEAPON QUALITY - 1 Lum Rune + 1 Pul Rune + 1 Perfect Emerald + 1 Exceptional Unique Weapon = Elite Unique Weapon",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Unique Weapon + Lum Rune + Pul Rune + Perfect Emerald ",
    CubeRecipeDescription: "Exceptional Unique Weapon + Lum Rune + Pul Rune + Perfect Emerald = Elite Weapon"
  },
  {
    Description: "UPGRADE UNIQUE ARMOR QUALITY - 1 Ko Rune + 1 Lem Rune + 1 Perfect Diamond + 1 Exceptional Unique Armor = Elite Unique Armor",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Unique Any Armor + Ko Rune + Lem Rune + Perfect Diamond ",
    CubeRecipeDescription: "Exceptional Unique Any Armor + Ko Rune + Lem Rune + Perfect Diamond = Elite Any Armor"
  },
  {
    Description: "UPGRADE RARE WEAPON QUALITY - 1 Ort Rune + 1 Amn Rune + 1 Perfect Sapphire + 1 Normal Rare Weapon = Exceptional Rare Weapon",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Rare Weapon + Ort Rune + Amn Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Basic Rare Weapon + Ort Rune + Amn Rune + Perfect Sapphire = Exceptional Weapon"
  },
  {
    Description: "UPGRADE RARE ARMOR QUALITY - 1 Ral Rune + 1 Thul Rune + 1 Perfect Amethyst + 1 Normal Rare Armor = Exceptional Rare Armor",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Rare Any Armor + Ral Rune + Thul Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Basic Rare Any Armor + Ral Rune + Thul Rune + Perfect Amethyst = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE RARE WEAPON QUALITY - 1 Fal Rune + 1 Um Rune + 1 Perfect Sapphire + 1 Exceptional Rare Weapon = Elite Rare Weapon",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Rare Weapon + Fal Rune + Um Rune + Perfect Sapphire ",
    CubeRecipeDescription: "Exceptional Rare Weapon + Fal Rune + Um Rune + Perfect Sapphire = Elite Weapon"
  },
  {
    Description: "UPGRADE RARE ARMOR QUALITY - 1 Ko Rune + 1 Pul Rune + 1 Perfect Amethyst + 1 Exceptional Rare Armor = Elite Rare Armor",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Rare Any Armor + Ko Rune + Pul Rune + Perfect Amethyst ",
    CubeRecipeDescription: "Exceptional Rare Any Armor + Ko Rune + Pul Rune + Perfect Amethyst = Elite Any Armor"
  },
  {
    Description: "REPAIR WEAPON - 1 Ort Rune + 1 Weapon = Fully Repaired Weapon",
    Item: null,
    Output: "255 Weapon Repair durability",
    Input: "Not Etheral Weapon + Ort Rune ",
    CubeRecipeDescription: "Not Etheral Weapon + Ort Rune = 255 Weapon Repair Durability"
  },
  {
    Description: "REPAIR ARMOR - 1 Ral Rune + 1 Armor = Fully Repaired Armor",
    Item: null,
    Output: "255 Any Armor Repair durability",
    Input: "Not Etheral Any Armor + Ral Rune ",
    CubeRecipeDescription: "Not Etheral Any Armor + Ral Rune = 255 Any Armor Repair Durability"
  },
  {
    Description: "REPAIR AND RECHARGE WEAPON - 1 Ort Rune + 1 Chipped Gem (Any) + 1 Weapon = Fully Repaired and Recharged Weapon",
    Item: null,
    Output: "255 Weapon Recharge Quantity Repair durability",
    Input: "Not Etheral Weapon + Ort Rune + Chipped Gem ",
    CubeRecipeDescription: "Not Etheral Weapon + Ort Rune + Chipped Gem = 255 Weapon Recharge Quantity Repair Durability"
  },
  {
    Description: "REPAIR AND RECHARGE ARMOR - 1 Ral Rune + 1 Flawed Gem (Any) + 1 Armor = Fully Repaired and Recharged Armor",
    Item: null,
    Output: "255 Any Armor Recharge Quantity Repair durability",
    Input: "Not Etheral Any Armor + Ral Rune + Flawed Gem ",
    CubeRecipeDescription: "Not Etheral Any Armor + Ral Rune + Flawed Gem = 255 Any Armor Recharge Quantity Repair Durability"
  },
  {
    Description: "SOCKET DESTROY SOCKETED ITEMS - 1 Hel Rune + Scroll of Town Portal + 1 Socketed Item = Clear Sockets on Item",
    Item: null,
    Output: "Destroy gems ",
    Input: "Socketed any + Hel Rune + Scroll of Town Portal ",
    CubeRecipeDescription: "Socketed Any + Hel Rune + Scroll Of Town Portal = Destroy Gems "
  },
  {
    Description: "SOCKET WEAPON MAGIC- 3 Chipped Gems (Any) + 1 Magic Weapon = Socketed Magic Weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Magic Weapon + 3 Chipped Gem ",
    CubeRecipeDescription: "Magic Weapon + 3 Chipped Gem = Magic Weapon"
  },
  {
    Description: "PORTAL - 1 Key of Terror + 1 Key of Hate + 1 Key of Destruction = Portal to Matron's Den/Forgotten Sands/Furnace of Pain (Random)",
    Item: null,
    Output: "Pandemonium Portal",
    Input: "Key of Terror + Key of Hate + Key of Destruction ",
    CubeRecipeDescription: "Key Of Terror + Key Of Hate + Key Of Destruction = Pandemonium Portal"
  },
  {
    Description: "PORTAL - 1 Diablo's Horn + 1 Baal's Eye + 1 Mephisto's Brain = Portal to Tristram (Pandemonium Finale)",
    Item: null,
    Output: "Pandemonium Finale Portal",
    Input: "Diablo's Horn + Baal's Eye + Mephisto's Brain ",
    CubeRecipeDescription: "Diablo's Horn + Baal's Eye + Mephisto's Brain = Pandemonium Finale Portal"
  },
  {
    Description: "CRAFT TOKEN - 1 Twisted Essence of Suffering + 1 Charged Essence of Hatred + 1 Burning Essence of Terror + 1 Festering Essence of Destruction = Token of Absolution",
    Item: null,
    Output: "Token of Absolution",
    Input: "Twisted Essence of Suffering + Charged Essense of Hatred + Burning Essence of Terror + Festering Essence of Destruction ",
    CubeRecipeDescription: "Twisted Essence Of Suffering + Charged Essense Of Hatred + Burning Essence Of Terror + Festering Essence Of Destruction = Token Of Absolution"
  },
  {
    Description: "CRAFT TOKEN - Scroll of Town Portal + Scroll of Identify = Token of Absolution",
    Item: null,
    Output: "Token of Absolution",
    Input: "Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Scroll Of Identify + Scroll Of Town Portal = Token Of Absolution"
  },
  {
    Description: "SOCKET RETRIEVE SOCKETED ITEMS - Scroll of Town Portal + 1 Socketed Item = Clear Sockets on Item",
    Item: null,
    Output: "Remove gems ",
    Input: "Socketed any + Scroll of Town Portal ",
    CubeRecipeDescription: "Socketed Any + Scroll Of Town Portal = Remove Gems "
  },
  {
    Description: "DOWNGRADE RUNE - 33 Zod-Rune downgrade",
    Item: null,
    Output: "Cham Rune",
    Input: "Zod Rune ",
    CubeRecipeDescription: "Zod Rune = Cham Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 32 Cham-downgrade",
    Item: null,
    Output: "Jah Rune",
    Input: "Cham Rune ",
    CubeRecipeDescription: "Cham Rune = Jah Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 31 Jah-downgrade",
    Item: null,
    Output: "Ber Rune",
    Input: "Jah Rune ",
    CubeRecipeDescription: "Jah Rune = Ber Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 30 Ber-downgrade",
    Item: null,
    Output: "Sur Rune",
    Input: "Ber Rune ",
    CubeRecipeDescription: "Ber Rune = Sur Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 29 Sur-downgrade",
    Item: null,
    Output: "Lo Rune",
    Input: "Sur Rune ",
    CubeRecipeDescription: "Sur Rune = Lo Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 28 Lo-downgrade",
    Item: null,
    Output: "Ohm Rune",
    Input: "Lo Rune ",
    CubeRecipeDescription: "Lo Rune = Ohm Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 27 Ohm-downgrade",
    Item: null,
    Output: "Vex Rune",
    Input: "Ohm Rune ",
    CubeRecipeDescription: "Ohm Rune = Vex Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 26 Vex-downgrade",
    Item: null,
    Output: "Gul Rune",
    Input: "Vex Rune ",
    CubeRecipeDescription: "Vex Rune = Gul Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 25 Gul-downgrade",
    Item: null,
    Output: "Ist Rune",
    Input: "Gul Rune ",
    CubeRecipeDescription: "Gul Rune = Ist Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 24 Ist-downgrade",
    Item: null,
    Output: "Mal Rune",
    Input: "Ist Rune ",
    CubeRecipeDescription: "Ist Rune = Mal Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 23 Mal-downgrade",
    Item: null,
    Output: "Um Rune",
    Input: "Mal Rune ",
    CubeRecipeDescription: "Mal Rune = Um Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 22 Um-downgrade",
    Item: null,
    Output: "Pul Rune",
    Input: "Um Rune ",
    CubeRecipeDescription: "Um Rune = Pul Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 21 Pul-downgrade",
    Item: null,
    Output: "Lem Rune",
    Input: "Pul Rune ",
    CubeRecipeDescription: "Pul Rune = Lem Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 20 Lem-downgrade",
    Item: null,
    Output: "Fal Rune",
    Input: "Lem Rune ",
    CubeRecipeDescription: "Lem Rune = Fal Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 19 Fal-downgrade",
    Item: null,
    Output: "Ko Rune",
    Input: "Fal Rune ",
    CubeRecipeDescription: "Fal Rune = Ko Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 18 Ko-downgrade",
    Item: null,
    Output: "Lum Rune",
    Input: "Ko Rune ",
    CubeRecipeDescription: "Ko Rune = Lum Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 17 Lum-downgrade",
    Item: null,
    Output: "Io Rune",
    Input: "Lum Rune ",
    CubeRecipeDescription: "Lum Rune = Io Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 16 Io-downgrade",
    Item: null,
    Output: "Hel Rune",
    Input: "Io Rune ",
    CubeRecipeDescription: "Io Rune = Hel Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 15 Hel-downgrade",
    Item: null,
    Output: "Dol Rune",
    Input: "Hel Rune ",
    CubeRecipeDescription: "Hel Rune = Dol Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 14 Dol-downgrade",
    Item: null,
    Output: "Shael Rune",
    Input: "Dol Rune ",
    CubeRecipeDescription: "Dol Rune = Shael Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 13 Sheal-downgrade",
    Item: null,
    Output: "Sol Rune",
    Input: "Shael Rune ",
    CubeRecipeDescription: "Shael Rune = Sol Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 12 Sol-downgrade",
    Item: null,
    Output: "Amn Rune",
    Input: "Sol Rune ",
    CubeRecipeDescription: "Sol Rune = Amn Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 11 Amn-downgrade",
    Item: null,
    Output: "Thul Rune",
    Input: "Amn Rune ",
    CubeRecipeDescription: "Amn Rune = Thul Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 10 Thul-downgrade",
    Item: null,
    Output: "Ort Rune",
    Input: "Thul Rune ",
    CubeRecipeDescription: "Thul Rune = Ort Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 9 Ort-downgrade",
    Item: null,
    Output: "Ral Rune",
    Input: "Ort Rune ",
    CubeRecipeDescription: "Ort Rune = Ral Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 8 Ral-downgrade",
    Item: null,
    Output: "Tal Rune",
    Input: "Ral Rune ",
    CubeRecipeDescription: "Ral Rune = Tal Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 7 Tal-downgrade",
    Item: null,
    Output: "Ith Rune",
    Input: "Tal Rune ",
    CubeRecipeDescription: "Tal Rune = Ith Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 6 Ith-downgrade",
    Item: null,
    Output: "Eth Rune",
    Input: "Ith Rune ",
    CubeRecipeDescription: "Ith Rune = Eth Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 5 Eth-downgrade",
    Item: null,
    Output: "Nef Rune",
    Input: "Eth Rune ",
    CubeRecipeDescription: "Eth Rune = Nef Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 4 Nef-downgrade",
    Item: null,
    Output: "Tir Rune",
    Input: "Nef Rune ",
    CubeRecipeDescription: "Nef Rune = Tir Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 3 Tir-downgrade",
    Item: null,
    Output: "Eld Rune",
    Input: "Tir Rune ",
    CubeRecipeDescription: "Tir Rune = Eld Rune"
  },
  {
    Description: "DOWNGRADE RUNE - 2 Eld-downgrade (El-Rune would be Rune number 1)",
    Item: null,
    Output: "El Rune",
    Input: "Eld Rune ",
    CubeRecipeDescription: "Eld Rune = El Rune"
  },
  {
    Description: "SOCKET WEAPON MAGIC - 3 chipped gems + 1 magic weapon = socketed, magic weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Magic Weapon + 3 Chipped Gem ",
    CubeRecipeDescription: "Magic Weapon + 3 Chipped Gem = Magic Weapon"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Arrows",
    Item: null,
    Output: "500  Repair durability",
    Input: "Barbed Arrows + Healing Potion ",
    CubeRecipeDescription: "Barbed Arrows + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "CRAFT UNIQUE ARROWS - Replenishing Quiver",
    Item: null,
    Output: "Barbed Arrows",
    Input: "Arrows + Amethyst + Tir Rune ",
    CubeRecipeDescription: "Arrows + Amethyst + Tir Rune = Barbed Arrows"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Arrows",
    Item: null,
    Output: "500  Repair durability",
    Input: "Arrows of Piercing + Healing Potion ",
    CubeRecipeDescription: "Arrows Of Piercing + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "CRAFT UNIQUE ARROWS - Quiver of Piercing",
    Item: null,
    Output: "Arrows of Piercing",
    Input: "Arrows + Perfect Topaz + Thul Rune ",
    CubeRecipeDescription: "Arrows + Perfect Topaz + Thul Rune = Arrows Of Piercing"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Arrows",
    Item: null,
    Output: "500  Repair durability",
    Input: "Arrows of Slaying + Healing Potion ",
    CubeRecipeDescription: "Arrows Of Slaying + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "CRAFT UNIQUE ARROWS - Quiver of Slaying",
    Item: null,
    Output: "Arrows of Slaying",
    Input: "Arrows + Perfect Sapphire + Fal Rune ",
    CubeRecipeDescription: "Arrows + Perfect Sapphire + Fal Rune = Arrows Of Slaying"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Arrows",
    Item: null,
    Output: "500  Repair durability",
    Input: "Barbed Bolts + Healing Potion ",
    CubeRecipeDescription: "Barbed Bolts + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "REPAIR UNIQUE BOLTS - Replenishing Bolt Case",
    Item: null,
    Output: "Barbed Bolts",
    Input: "Bolts + Amethyst + Tir Rune ",
    CubeRecipeDescription: "Bolts + Amethyst + Tir Rune = Barbed Bolts"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Arrows",
    Item: null,
    Output: "500  Repair durability",
    Input: "Bolts of Piercing + Healing Potion ",
    CubeRecipeDescription: "Bolts Of Piercing + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "CRAFT UNIQUE BOLTS - Bolt Case of Piercing",
    Item: null,
    Output: "Bolts of Piercing",
    Input: "Bolts + Perfect Topaz + Thul Rune ",
    CubeRecipeDescription: "Bolts + Perfect Topaz + Thul Rune = Bolts Of Piercing"
  },
  {
    Description: "REPAIR MISSLE - Replenish Unique Bolts",
    Item: null,
    Output: "500  Repair durability",
    Input: "Bolts of Slaying + Healing Potion ",
    CubeRecipeDescription: "Bolts Of Slaying + Healing Potion = 500  Repair Durability"
  },
  {
    Description: "CRAFT UNIQUE BOLTS - Bolt Case of Slaying",
    Item: null,
    Output: "Bolts of Slaying",
    Input: "Bolts + Perfect Sapphire + Fal Rune ",
    CubeRecipeDescription: "Bolts + Perfect Sapphire + Fal Rune = Bolts Of Slaying"
  },
  {
    Description: "ADD ITEM STAT - Lightning Damage Weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Topaz ",
    CubeRecipeDescription: "Weapon + Perfect Topaz = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Fire Damage Weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Ruby ",
    CubeRecipeDescription: "Weapon + Perfect Ruby = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Cold Damage Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Sapphire ",
    CubeRecipeDescription: "Weapon + Perfect Sapphire = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Poison Damage Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Emerald ",
    CubeRecipeDescription: "Weapon + Perfect Emerald = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Physical Damage Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Skull ",
    CubeRecipeDescription: "Weapon + Perfect Skull = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Attack Rating Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Amethyst ",
    CubeRecipeDescription: "Weapon + Perfect Amethyst = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Durability Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Perfect Diamond ",
    CubeRecipeDescription: "Weapon + Perfect Diamond = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Duel Leech Weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Perfect Skull ",
    CubeRecipeDescription: "Weapon + 3 Perfect Skull = Weapon"
  },
  {
    Description: "ADD ITEM STAT - MF Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Topaz ",
    CubeRecipeDescription: "Armor + Perfect Topaz = Armor"
  },
  {
    Description: "ADD ITEM STAT - Life Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Ruby ",
    CubeRecipeDescription: "Armor + Perfect Ruby = Armor"
  },
  {
    Description: "ADD ITEM STAT - Mana Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Sapphire ",
    CubeRecipeDescription: "Armor + Perfect Sapphire = Armor"
  },
  {
    Description: "ADD ITEM STAT - Dexterity Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Emerald ",
    CubeRecipeDescription: "Armor + Perfect Emerald = Armor"
  },
  {
    Description: "ADD ITEM STAT - Regen Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Skull ",
    CubeRecipeDescription: "Armor + Perfect Skull = Armor"
  },
  {
    Description: "ADD ITEM STAT - Strength Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Perfect Amethyst ",
    CubeRecipeDescription: "Armor + Perfect Amethyst = Armor"
  },
  {
    Description: "ADD ITEM STAT - Durability Armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + Perfect Diamond ",
    CubeRecipeDescription: "Any Armor + Perfect Diamond = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - Defense Armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Perfect Diamond ",
    CubeRecipeDescription: "Any Armor + 3 Perfect Diamond = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - MF Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Topaz ",
    CubeRecipeDescription: "Belt + Perfect Topaz = Belt"
  },
  {
    Description: "ADD ITEM STAT - Life Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Ruby ",
    CubeRecipeDescription: "Belt + Perfect Ruby = Belt"
  },
  {
    Description: "ADD ITEM STAT - Mana Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Sapphire ",
    CubeRecipeDescription: "Belt + Perfect Sapphire = Belt"
  },
  {
    Description: "ADD ITEM STAT - Dexterity Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Emerald ",
    CubeRecipeDescription: "Belt + Perfect Emerald = Belt"
  },
  {
    Description: "ADD ITEM STAT - Regen Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Skull ",
    CubeRecipeDescription: "Belt + Perfect Skull = Belt"
  },
  {
    Description: "ADD ITEM STAT - Strength Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + Perfect Amethyst ",
    CubeRecipeDescription: "Belt + Perfect Amethyst = Belt"
  },
  {
    Description: "SOCKET WEAPON MAGIC - Adds 3 Socket",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + Thul Rune ",
    CubeRecipeDescription: "Magic Weapon + Thul Rune = Socketed Weapon"
  },
  {
    Description: "ADD ITEM STAT - MF Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Topaz ",
    CubeRecipeDescription: "Gloves + Perfect Topaz = Gloves"
  },
  {
    Description: "ADD ITEM STAT - Life Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Ruby ",
    CubeRecipeDescription: "Gloves + Perfect Ruby = Gloves"
  },
  {
    Description: "ADD ITEM STAT - Mana Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Sapphire ",
    CubeRecipeDescription: "Gloves + Perfect Sapphire = Gloves"
  },
  {
    Description: "ADD ITEM STAT - Dexterity Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Emerald ",
    CubeRecipeDescription: "Gloves + Perfect Emerald = Gloves"
  },
  {
    Description: "ADD ITEM STAT - Regen Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Skull ",
    CubeRecipeDescription: "Gloves + Perfect Skull = Gloves"
  },
  {
    Description: "ADD ITEM STAT - Strength Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Perfect Amethyst ",
    CubeRecipeDescription: "Gloves + Perfect Amethyst = Gloves"
  },
  {
    Description: "ADD ITEM STAT - MF Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Topaz ",
    CubeRecipeDescription: "Boots + Perfect Topaz = Boots"
  },
  {
    Description: "ADD ITEM STAT - Life Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Ruby ",
    CubeRecipeDescription: "Boots + Perfect Ruby = Boots"
  },
  {
    Description: "ADD ITEM STAT - Mana Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Sapphire ",
    CubeRecipeDescription: "Boots + Perfect Sapphire = Boots"
  },
  {
    Description: "ADD ITEM STAT - Dexterity Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Emerald ",
    CubeRecipeDescription: "Boots + Perfect Emerald = Boots"
  },
  {
    Description: "ADD ITEM STAT - Regen Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Skull ",
    CubeRecipeDescription: "Boots + Perfect Skull = Boots"
  },
  {
    Description: "ADD ITEM STAT - Strength Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + Perfect Amethyst ",
    CubeRecipeDescription: "Boots + Perfect Amethyst = Boots"
  },
  {
    Description: "ADD ITEM STAT - MF Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Topaz ",
    CubeRecipeDescription: "Merc Equip + Perfect Topaz = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Life Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Ruby ",
    CubeRecipeDescription: "Merc Equip + Perfect Ruby = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Mana Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Sapphire ",
    CubeRecipeDescription: "Merc Equip + Perfect Sapphire = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Dexterity Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Emerald ",
    CubeRecipeDescription: "Merc Equip + Perfect Emerald = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Regen Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Skull ",
    CubeRecipeDescription: "Merc Equip + Perfect Skull = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Strength Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Perfect Amethyst ",
    CubeRecipeDescription: "Merc Equip + Perfect Amethyst = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Lightning Resist Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Topaz ",
    CubeRecipeDescription: "Any Shield + Perfect Topaz = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Fire Resist Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Ruby ",
    CubeRecipeDescription: "Any Shield + Perfect Ruby = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Cold Resist Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Sapphire ",
    CubeRecipeDescription: "Any Shield + Perfect Sapphire = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Poison Resist Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Emerald ",
    CubeRecipeDescription: "Any Shield + Perfect Emerald = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Attacker Takes DMG Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Skull ",
    CubeRecipeDescription: "Any Shield + Perfect Skull = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Increased % to Block Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Perfect Amethyst ",
    CubeRecipeDescription: "Any Shield + Perfect Amethyst = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - All resist Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 2 Perfect Diamond ",
    CubeRecipeDescription: "Any Shield + 2 Perfect Diamond = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Topaz ",
    CubeRecipeDescription: "Amulet + 6 Perfect Topaz = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Ruby ",
    CubeRecipeDescription: "Amulet + 6 Perfect Ruby = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Sapphire ",
    CubeRecipeDescription: "Amulet + 6 Perfect Sapphire = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Emerald ",
    CubeRecipeDescription: "Amulet + 6 Perfect Emerald = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Skull ",
    CubeRecipeDescription: "Amulet + 6 Perfect Skull = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Amethyst ",
    CubeRecipeDescription: "Amulet + 6 Perfect Amethyst = "
  },
  {
    Description: "ADD ITEM STAT - +1 Skills to Amulet",
    Item: null,
    Output: "",
    Input: "Amulet + 6 Perfect Diamond ",
    CubeRecipeDescription: "Amulet + 6 Perfect Diamond = "
  },
  {
    Description: "ADD ITEM STAT - MF Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Topaz ",
    CubeRecipeDescription: "Ring + Perfect Topaz = "
  },
  {
    Description: "ADD ITEM STAT - Life Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Ruby ",
    CubeRecipeDescription: "Ring + Perfect Ruby = "
  },
  {
    Description: "ADD ITEM STAT - Mana Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Sapphire ",
    CubeRecipeDescription: "Ring + Perfect Sapphire = "
  },
  {
    Description: "ADD ITEM STAT - Dexterity Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Emerald ",
    CubeRecipeDescription: "Ring + Perfect Emerald = "
  },
  {
    Description: "ADD ITEM STAT - Attacker Takes DMG Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Skull ",
    CubeRecipeDescription: "Ring + Perfect Skull = "
  },
  {
    Description: "ADD ITEM STAT - Strength Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Amethyst ",
    CubeRecipeDescription: "Ring + Perfect Amethyst = "
  },
  {
    Description: "ADD ITEM STAT - All resist Ring",
    Item: null,
    Output: "",
    Input: "Ring + Perfect Diamond ",
    CubeRecipeDescription: "Ring + Perfect Diamond = "
  },
  {
    Description: "REROLL CHARM - 3 Small charms = reroll charm",
    Item: null,
    Output: "Magic Small Charm",
    Input: "3 Magic Small Charm ",
    CubeRecipeDescription: "3 Magic Small Charm = Magic Small Charm"
  },
  {
    Description: "REROLL CHARM - 3 med charms = reroll charm",
    Item: null,
    Output: "Magic Large Charm",
    Input: "3 Magic Large Charm ",
    CubeRecipeDescription: "3 Magic Large Charm = Magic Large Charm"
  },
  {
    Description: "REROLL CHARM - 3 grand charms = reroll charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "3 Magic Grand Charm ",
    CubeRecipeDescription: "3 Magic Grand Charm = Magic Grand Charm"
  },
  {
    Description: "REROLL JEWEL - 3 magic jewels = reroll magic jewel",
    Item: null,
    Output: "Magic Jewel",
    Input: "3 Magic Jewel ",
    CubeRecipeDescription: "3 Magic Jewel = Magic Jewel"
  },
  {
    Description: "REROLL JEWEL - 3 rare jewels = reroll rare jewel",
    Item: null,
    Output: "Rare Jewel",
    Input: "3 Rare Jewel ",
    CubeRecipeDescription: "3 Rare Jewel = Rare Jewel"
  },
  {
    Description: "REROLL RARE RING - 3 rare rings = rare ring",
    Item: null,
    Output: "Rare Ring",
    Input: "3 Rare Ring ",
    CubeRecipeDescription: "3 Rare Ring = Rare Ring"
  },
  {
    Description: "REROLL RARE AMULET - 3 rare amulets = rare amulet",
    Item: null,
    Output: "Rare Amulet",
    Input: "3 Rare Amulet ",
    CubeRecipeDescription: "3 Rare Amulet = Rare Amulet"
  },
  {
    Description: "ADD ITEM STAT - Light weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + El Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + El Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - dmg undead weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Eld Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - mana kill weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Tir Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - knockback weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Nef Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - damage ac% weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Eth Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - max damage weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Ith Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Ith Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - elemental damage weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Weapon + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Lifeleech weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Amn Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - min damage weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Sol Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal damage weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 2 Ith Rune + 2 Sol Rune ",
    CubeRecipeDescription: "Weapon + 2 Ith Rune + 2 Sol Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - ias weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Magic Jewel + 2 Shael Rune ",
    CubeRecipeDescription: "Weapon + Magic Jewel + 2 Shael Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Hit causes monster flee weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Dol Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Lighter weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Hel Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Hel Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - All attributes weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Weapon + Io Rune + Lum Rune + Ko Rune + Fal Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - gold weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Lem Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - dmg to demon weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Pul Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Pul Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - open wounds weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Um Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Um Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - no heal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Mal Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - MF Weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Ist Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - cheaper vendor weapons",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Magic Jewel + 3 Lem Rune ",
    CubeRecipeDescription: "Weapon + Magic Jewel + 3 Lem Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Att% Weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Gul Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Gul Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Manaleech weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Vex Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Vex Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - duelleech weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 2 Amn Rune + 2 Vex Rune ",
    CubeRecipeDescription: "Weapon + 2 Amn Rune + 2 Vex Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - dmg/lvl weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Ohm Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Ohm Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Deadly Strike weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Lo Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Lo Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - hit blinds weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Sur Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Crushing blow weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Ber Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Ber Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - ignore ac",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Jah Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Freeze Target",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Cham Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Cham Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - -10 Level requirements",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 3 Magic Jewel + Zod Rune ",
    CubeRecipeDescription: "Weapon + 3 Magic Jewel + Zod Rune = Weapon"
  },
  {
    Description: "ADD ITEM STAT - -10 Level requirements",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Zod Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Zod Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - -10 Level requirements",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Zod Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Zod Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - -10 Level requirements",
    Item: null,
    Output: "",
    Input: "Ring + 3 Magic Jewel + Zod Rune ",
    CubeRecipeDescription: "Ring + 3 Magic Jewel + Zod Rune = "
  },
  {
    Description: "ADD ITEM STAT - -10 Level requirements",
    Item: null,
    Output: "",
    Input: "Amulet + 3 Magic Jewel + Zod Rune ",
    CubeRecipeDescription: "Amulet + 3 Magic Jewel + Zod Rune = "
  },
  {
    Description: "ADD ITEM STAT - light armors",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + El Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + El Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - stamina armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Eld Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - stamina armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Eld Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - stamina armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Eld Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - stamina armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Eld Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - stamina armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Eld Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - mana kill armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Tir Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - mana kill Belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Tir Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - mana kill boots",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Tir Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - mana kill gloves",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Tir Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - mana kill helm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Tir Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - defense armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Nef Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - defense armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Nef Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - defense armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Nef Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - defense armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Nef Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - defense armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Nef Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - regen mana armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Eth Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - regen mana belt",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Eth Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - regen mana boots",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Eth Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - regen mana gloves",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Eth Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - regen mana hellm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Eth Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - damage to mana armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Ith Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Ith Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - dmg to mana belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Ith Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Ith Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - dmg to mana boots",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Ith Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Ith Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - resist all armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Armor + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - resist all belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Belt + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - resist all boot",
    Item: null,
    Output: "Boots",
    Input: "Boots + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Boots + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - resist all glove",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Gloves + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - resist all helm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Merc Equip + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - regen armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Amn Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - regen belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Amn Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - regen boot",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Amn Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - regen glove",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Amn Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - regen helm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Amn Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - red dmg armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Sol Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - red dmg belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Sol Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - red dmg boot",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Sol Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - red dmg glove",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Sol Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - red dmg helm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Sol Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - fast hit recovery armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Shael Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - fast hit recovery armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Shael Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - fast hit recovery armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Shael Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - fast hit recovery armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Shael Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - fast hit recovery armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Shael Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - reduce mag dmg armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Dol Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - reduce mag dmg armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Dol Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - reduce mag dmg armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Dol Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - reduce mag dmg armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Dol Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - reduce mag dmg armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Dol Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - -requirements armors",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Hel Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Hel Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - resist all armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Armor + Io Rune + Lum Rune + Ko Rune + Fal Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - resist all belt",
    Item: null,
    Output: "Belt",
    Input: "Belt + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Belt + Io Rune + Lum Rune + Ko Rune + Fal Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - resist all boot",
    Item: null,
    Output: "Boots",
    Input: "Boots + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Boots + Io Rune + Lum Rune + Ko Rune + Fal Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - resist all glove",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Gloves + Io Rune + Lum Rune + Ko Rune + Fal Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - resist all helm",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Merc Equip + Io Rune + Lum Rune + Ko Rune + Fal Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - 10% Extra Gold",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Lem Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - 10% Extra Gold",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Lem Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - 10% Extra Gold",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Lem Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - 10% Extra Gold",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Lem Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - 10% Extra Gold",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Lem Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - -4% Vendor armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + Magic Jewel + 3 Lem Rune ",
    CubeRecipeDescription: "Any Armor + Magic Jewel + 3 Lem Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - enhanced defense Armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Pul Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Pul Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - +1% Added Experience",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Um Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Um Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - reduce magic dmg armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Mal Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - reduce magic dmg armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Mal Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - reduce magic dmg armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Mal Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - reduce magic dmg armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Mal Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - reduce magic dmg armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Mal Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - 30% mf Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Ist Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - 30% mf Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Ist Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - 30% mf Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Ist Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - 30% mf Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Ist Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - 30% mf Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Ist Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - res-all-max armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + Gul Rune + Vex Rune + Ohm Rune + Lo Rune ",
    CubeRecipeDescription: "Any Armor + Gul Rune + Vex Rune + Ohm Rune + Lo Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - 5% mana Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Sur Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Sur Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Sur Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Sur Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Sur Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - 5% dmg reduced armor",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Ber Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Ber Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - 5% mana Armor",
    Item: null,
    Output: "Armor",
    Input: "Armor + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Armor + 3 Magic Jewel + Jah Rune = Armor"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Belt",
    Input: "Belt + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Belt + 3 Magic Jewel + Jah Rune = Belt"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Boots",
    Input: "Boots + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Boots + 3 Magic Jewel + Jah Rune = Boots"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Gloves + 3 Magic Jewel + Jah Rune = Gloves"
  },
  {
    Description: "ADD ITEM STAT - 4% mana Armor",
    Item: null,
    Output: "Merc Equip",
    Input: "Merc Equip + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Merc Equip + 3 Magic Jewel + Jah Rune = Merc Equip"
  },
  {
    Description: "ADD ITEM STAT - Nofreeze armors",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Cham Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Cham Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - light shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + El Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + El Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Increased Block shields",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Eld Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Eld Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - mana-kill Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Tir Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - defense Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Nef Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Nef Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - mana regen Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Eth Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Eth Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - all resist shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Tal Rune + Ral Rune + Ort Rune + Thul Rune ",
    CubeRecipeDescription: "Any Shield + Tal Rune + Ral Rune + Ort Rune + Thul Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - thorns Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Amn Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - reduce damage shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Sol Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Sol Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - faster block rate shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Shael Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Shael Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - regen life shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Dol Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Dol Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - -requirements shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Hel Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Hel Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - all attributes shields",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Io Rune + Lum Rune + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Any Shield + Io Rune + Lum Rune + Ko Rune + Fal Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - extra gold shields",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Lem Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Lem Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - lower vendor prices shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Magic Jewel + 3 Lem Rune ",
    CubeRecipeDescription: "Any Shield + Magic Jewel + 3 Lem Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - defense shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Pul Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Pul Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - added experience shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Um Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Um Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - reduce magic shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Mal Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Mal Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - mf shield ",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Ist Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Ist Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - res pois max shld",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Gul Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Gul Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - res fire max shld",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Vex Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Vex Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - res-cold max shld",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Ohm Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Ohm Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - res ltng max shld",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Lo Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Lo Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - res all max shld",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Gul Rune + Vex Rune + Ohm Rune + Lo Rune ",
    CubeRecipeDescription: "Any Shield + Gul Rune + Vex Rune + Ohm Rune + Lo Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - Mana shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Sur Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Sur Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - dmg reduced shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Ber Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Ber Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - life shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Jah Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Jah Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - no freeze shield",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 3 Magic Jewel + Cham Rune ",
    CubeRecipeDescription: "Any Shield + 3 Magic Jewel + Cham Rune = Any Shield"
  },
  {
    Description: "ADD ITEM STAT - res pois max shld",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Gul Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Gul Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - res fire max shld",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Vex Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Vex Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - res-cold max shld",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Ohm Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Ohm Rune = Any Armor"
  },
  {
    Description: "ADD ITEM STAT - res ltng max shld",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 3 Magic Jewel + Lo Rune ",
    CubeRecipeDescription: "Any Armor + 3 Magic Jewel + Lo Rune = Any Armor"
  },
  {
    Description: "CRAFT CHARM - crafted hp charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Unique Jewel + 3 Io Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Unique Jewel + 3 Io Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted mana charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Unique Jewel + 3 Lum Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Unique Jewel + 3 Lum Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted dex charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Unique Jewel + 3 Ko Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Unique Jewel + 3 Ko Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted dex charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Unique Jewel + 3 Fal Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Unique Jewel + 3 Fal Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted def charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + 2 Unique Jewel + 2 Pul Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + 2 Unique Jewel + 2 Pul Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted resist charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + 2 Unique Jewel + 2 Um Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + 2 Unique Jewel + 2 Um Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted mf charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + 2 Unique Jewel + 2 Ist Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + 2 Unique Jewel + 2 Ist Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted added xp charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + 2 Unique Jewel + 2 Ohm Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + 2 Unique Jewel + 2 Ohm Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT CHARM - crafted mf charm",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + 3 Unique Jewel + Zod Rune + El Rune ",
    CubeRecipeDescription: "Magic Grand Charm + 3 Unique Jewel + Zod Rune + El Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT AMULET - crafted barb amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted sorc amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted ama amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted necro amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted pally amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted druid amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT AMULET - crafted assassin amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 4 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Amulet + 4 Unique Jewel + Mal Rune = Unique Amulet"
  },
  {
    Description: "CRAFT RING - crafted resist ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Um Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Um Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted xp ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Mal Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Mal Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted mf ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Ist Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Ist Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted att% ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Gul Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Gul Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted d-l ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Vex Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Vex Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted dmg% ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Ohm Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted ias ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Lo Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Lo Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted hp ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Sur Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted dmg reduced ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Ber Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Ber Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted mana ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Jah Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Jah Rune = Unique Ring"
  },
  {
    Description: "CRAFT RING - crafted absorb ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + 3 Unique Jewel + Cham Rune ",
    CubeRecipeDescription: "Unique Ring + 3 Unique Jewel + Cham Rune = Unique Ring"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Amethyst ",
    CubeRecipeDescription: "Weapon + Chipped Amethyst = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Sapphire ",
    CubeRecipeDescription: "Weapon + Chipped Sapphire = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Emerald ",
    CubeRecipeDescription: "Weapon + Chipped Emerald = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Ruby ",
    CubeRecipeDescription: "Weapon + Chipped Ruby = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Diamond ",
    CubeRecipeDescription: "Weapon + Chipped Diamond = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Topaz ",
    CubeRecipeDescription: "Weapon + Chipped Topaz = Weapon"
  },
  {
    Description: "ADD ITEM STAT - chipped weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Chipped Skull ",
    CubeRecipeDescription: "Weapon + Chipped Skull = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Amethyst ",
    CubeRecipeDescription: "Weapon + Flawed Amethyst = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Sapphire ",
    CubeRecipeDescription: "Weapon + Flawed Sapphire = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Emerald ",
    CubeRecipeDescription: "Weapon + Flawed Emerald = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Ruby ",
    CubeRecipeDescription: "Weapon + Flawed Ruby = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Diamond ",
    CubeRecipeDescription: "Weapon + Flawed Diamond = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Topaz ",
    CubeRecipeDescription: "Weapon + Flawed Topaz = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawed weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawed Skull ",
    CubeRecipeDescription: "Weapon + Flawed Skull = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Amethyst ",
    CubeRecipeDescription: "Weapon + Amethyst = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Sapphire ",
    CubeRecipeDescription: "Weapon + Sapphire = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Emerald ",
    CubeRecipeDescription: "Weapon + Emerald = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Ruby ",
    CubeRecipeDescription: "Weapon + Ruby = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Diamond ",
    CubeRecipeDescription: "Weapon + Diamond = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Topaz ",
    CubeRecipeDescription: "Weapon + Topaz = Weapon"
  },
  {
    Description: "ADD ITEM STAT - normal weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Skull ",
    CubeRecipeDescription: "Weapon + Skull = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Amethyst ",
    CubeRecipeDescription: "Weapon + Flawless Amethyst = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Sapphire ",
    CubeRecipeDescription: "Weapon + Flawless Sapphire = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Emerald ",
    CubeRecipeDescription: "Weapon + Flawless Emerald = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Ruby ",
    CubeRecipeDescription: "Weapon + Flawless Ruby = Weapon"
  },
  {
    Description: "ADD ITEM STAT - flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Diamond ",
    CubeRecipeDescription: "Weapon + Flawless Diamond = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Topaz ",
    CubeRecipeDescription: "Weapon + Flawless Topaz = Weapon"
  },
  {
    Description: "ADD ITEM STAT - Flawless weapon",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + Flawless Skull ",
    CubeRecipeDescription: "Weapon + Flawless Skull = Weapon"
  },
  {
    Description: "CRAFT ITEM AMULET - crafted all skills amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + 3 Unique Jewel + Ohm Rune + Jah Rune ",
    CubeRecipeDescription: "Unique Amulet + 3 Unique Jewel + Ohm Rune + Jah Rune = Unique Amulet"
  },
  {
    Description: "CRAFT ITEM AMULET - crafted level 10 amulet",
    Item: null,
    Output: "Magic Amulet",
    Input: "Magic Amulet + 2 Magic Jewel + El Rune ",
    CubeRecipeDescription: "Magic Amulet + 2 Magic Jewel + El Rune = Magic Amulet"
  },
  {
    Description: "CRAFT ITEM AMULET - crafted level 25 amulet",
    Item: null,
    Output: "Magic Amulet",
    Input: "Magic Amulet + 2 Magic Jewel + Amn Rune ",
    CubeRecipeDescription: "Magic Amulet + 2 Magic Jewel + Amn Rune = Magic Amulet"
  },
  {
    Description: "CRAFT ITEM AMULET - crafted level 35 amulet",
    Item: null,
    Output: "Rare Amulet",
    Input: "Rare Amulet + 2 Rare Jewel + Lum Rune ",
    CubeRecipeDescription: "Rare Amulet + 2 Rare Jewel + Lum Rune = Rare Amulet"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 13 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + Magic Jewel + Chipped Diamond ",
    CubeRecipeDescription: "Rare Weapon + Magic Jewel + Chipped Diamond = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 20 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + Magic Jewel + Diamond + Ith Rune ",
    CubeRecipeDescription: "Rare Weapon + Magic Jewel + Diamond + Ith Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 31 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + 2 Magic Jewel + Flawless Diamond + Shael Rune ",
    CubeRecipeDescription: "Rare Weapon + 2 Magic Jewel + Flawless Diamond + Shael Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 44 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + 2 Rare Jewel + Fal Rune + Shael Rune ",
    CubeRecipeDescription: "Rare Weapon + 2 Rare Jewel + Fal Rune + Shael Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 57 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + 2 Rare Jewel + Amn Rune + Vex Rune ",
    CubeRecipeDescription: "Rare Weapon + 2 Rare Jewel + Amn Rune + Vex Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 69 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + 2 Unique Jewel + Ohm Rune + Sur Rune ",
    CubeRecipeDescription: "Rare Weapon + 2 Unique Jewel + Ohm Rune + Sur Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM WEAPON - crafted lvl 78 weapon",
    Item: null,
    Output: "Weapon",
    Input: "Rare Weapon + 2 Unique Jewel + Ber Rune + Cham Rune + Zod Rune ",
    CubeRecipeDescription: "Rare Weapon + 2 Unique Jewel + Ber Rune + Cham Rune + Zod Rune = Weapon"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Thul Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Thul Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Sol Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Sol Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Dol Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Dol Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Io Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Io Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Ko Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Ko Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARROWS - crafted arrows",
    Item: null,
    Output: "Normal Arrows",
    Input: "Normal Arrows + Lem Rune + Rare Jewel ",
    CubeRecipeDescription: "Normal Arrows + Lem Rune + Rare Jewel = Normal Arrows"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 12 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Magic Jewel + Chipped Ruby ",
    CubeRecipeDescription: "Rare Armor + Magic Jewel + Chipped Ruby = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 19 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Magic Jewel + Ruby ",
    CubeRecipeDescription: "Rare Armor + Magic Jewel + Ruby = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 30 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Rare Jewel + Ral Rune + Thul Rune ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Ral Rune + Thul Rune = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 43 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Rare Jewel + Dol Rune + Fal Rune ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Dol Rune + Fal Rune = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 57 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Unique Jewel + Pul Rune + Ist Rune ",
    CubeRecipeDescription: "Rare Armor + Unique Jewel + Pul Rune + Ist Rune = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 69 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Unique Jewel + Lo Rune + Gul Rune ",
    CubeRecipeDescription: "Rare Armor + Unique Jewel + Lo Rune + Gul Rune = Armor"
  },
  {
    Description: "CRAFT ITEM ARMOR - crafted lvl 80 armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Unique Jewel + Sur Rune + Jah Rune ",
    CubeRecipeDescription: "Rare Armor + Unique Jewel + Sur Rune + Jah Rune = Armor"
  },
  {
    Description: "CRAFT ITEM GLOVES - crafted lvl 10 gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Magic Jewel + Chipped Amethyst ",
    CubeRecipeDescription: "Rare Gloves + Magic Jewel + Chipped Amethyst = Gloves"
  },
  {
    Description: "CRAFT ITEM GLOVES - crafted lvl 20 gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Magic Jewel + Amethyst ",
    CubeRecipeDescription: "Rare Gloves + Magic Jewel + Amethyst = Gloves"
  },
  {
    Description: "CRAFT ITEM GLOVES - crafted lvl 30 gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Rare Jewel + Ith Rune + Hel Rune ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Ith Rune + Hel Rune = Gloves"
  },
  {
    Description: "CRAFT ITEM GLOVES - crafted lvl 50 gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Unique Jewel + Lem Rune + Ist Rune ",
    CubeRecipeDescription: "Rare Gloves + Unique Jewel + Lem Rune + Ist Rune = Gloves"
  },
  {
    Description: "CRAFT ITEM GLOVES - crafted lvl 70 gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + 2 Unique Jewel + Ber Rune + Jah Rune ",
    CubeRecipeDescription: "Rare Gloves + 2 Unique Jewel + Ber Rune + Jah Rune = Gloves"
  },
  {
    Description: "CRAFT ITEM BELT - crafted lvl 10 belts",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Magic Jewel + Chipped Emerald ",
    CubeRecipeDescription: "Rare Belt + Magic Jewel + Chipped Emerald = Belt"
  },
  {
    Description: "CRAFT ITEM BELT - crafted lvl 20 belts",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Magic Jewel + Emerald ",
    CubeRecipeDescription: "Rare Belt + Magic Jewel + Emerald = Belt"
  },
  {
    Description: "CRAFT ITEM BELT - crafted lvl 30 belts",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Rare Jewel + Ral Rune + Io Rune ",
    CubeRecipeDescription: "Rare Belt + Rare Jewel + Ral Rune + Io Rune = Belt"
  },
  {
    Description: "CRAFT ITEM BELT - crafted lvl 50 belts",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Unique Jewel + Lum Rune + Ohm Rune ",
    CubeRecipeDescription: "Rare Belt + Unique Jewel + Lum Rune + Ohm Rune = Belt"
  },
  {
    Description: "CRAFT ITEM BELT - crafted lvl 70 belts",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + 2 Unique Jewel + Ist Rune + Cham Rune ",
    CubeRecipeDescription: "Rare Belt + 2 Unique Jewel + Ist Rune + Cham Rune = Belt"
  },
  {
    Description: "CRAFT ITEM BOOTS - crafted lvl 10 boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Magic Jewel + Chipped Sapphire ",
    CubeRecipeDescription: "Rare Boots + Magic Jewel + Chipped Sapphire = Boots"
  },
  {
    Description: "CRAFT ITEM BOOTS - crafted lvl 20 boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Magic Jewel + Sapphire ",
    CubeRecipeDescription: "Rare Boots + Magic Jewel + Sapphire = Boots"
  },
  {
    Description: "CRAFT ITEM BOOTS - crafted lvl 30 boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Rare Jewel + Eth Rune + Sol Rune ",
    CubeRecipeDescription: "Rare Boots + Rare Jewel + Eth Rune + Sol Rune = Boots"
  },
  {
    Description: "CRAFT ITEM BOOTS - crafted lvl 50 boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Unique Jewel + Ko Rune + Um Rune ",
    CubeRecipeDescription: "Rare Boots + Unique Jewel + Ko Rune + Um Rune = Boots"
  },
  {
    Description: "CRAFT ITEM BOOTS - crafted lvl 70 boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + 2 Unique Jewel + Lo Rune + Ber Rune ",
    CubeRecipeDescription: "Rare Boots + 2 Unique Jewel + Lo Rune + Ber Rune = Boots"
  },
  {
    Description: "CRAFT ITEM HELMS - crafted lvl 10 helms",
    Item: null,
    Output: "Merc Equip",
    Input: "Rare Merc Equip + Magic Jewel + Chipped Topaz ",
    CubeRecipeDescription: "Rare Merc Equip + Magic Jewel + Chipped Topaz = Merc Equip"
  },
  {
    Description: "CRAFT ITEM HELMS - crafted lvl 20 helms",
    Item: null,
    Output: "Merc Equip",
    Input: "Rare Merc Equip + Magic Jewel + Topaz ",
    CubeRecipeDescription: "Rare Merc Equip + Magic Jewel + Topaz = Merc Equip"
  },
  {
    Description: "CRAFT ITEM HELMS - crafted lvl 30 helms",
    Item: null,
    Output: "Merc Equip",
    Input: "Rare Merc Equip + Rare Jewel + Tal Rune + Amn Rune ",
    CubeRecipeDescription: "Rare Merc Equip + Rare Jewel + Tal Rune + Amn Rune = Merc Equip"
  },
  {
    Description: "CRAFT ITEM HELMS - crafted lvl 50 helms",
    Item: null,
    Output: "Merc Equip",
    Input: "Rare Merc Equip + Unique Jewel + Lum Rune + Mal Rune ",
    CubeRecipeDescription: "Rare Merc Equip + Unique Jewel + Lum Rune + Mal Rune = Merc Equip"
  },
  {
    Description: "CRAFT ITEM HELMS - crafted lvl 70 helms",
    Item: null,
    Output: "Merc Equip",
    Input: "Rare Merc Equip + 2 Unique Jewel + Ohm Rune + Cham Rune ",
    CubeRecipeDescription: "Rare Merc Equip + 2 Unique Jewel + Ohm Rune + Cham Rune = Merc Equip"
  },
  {
    Description: "CRAFT ITEM SHIELDS - crafted lvl 10 shields",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Magic Jewel + Chipped Skull ",
    CubeRecipeDescription: "Rare Any Shield + Magic Jewel + Chipped Skull = Any Shield"
  },
  {
    Description: "CRAFT ITEM SHIELDS - crafted lvl 20 shields",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Magic Jewel + Skull ",
    CubeRecipeDescription: "Rare Any Shield + Magic Jewel + Skull = Any Shield"
  },
  {
    Description: "CRAFT ITEM SHIELDS - crafted lvl 30 shields",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Thul Rune + Dol Rune ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Thul Rune + Dol Rune = Any Shield"
  },
  {
    Description: "CRAFT ITEM SHIELDS - crafted lvl 50 shields",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Unique Jewel + Hel Rune + Pul Rune ",
    CubeRecipeDescription: "Rare Any Shield + Unique Jewel + Hel Rune + Pul Rune = Any Shield"
  },
  {
    Description: "CRAFT ITEM SHIELDS - crafted lvl 70 shields",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + 2 Unique Jewel + Vex Rune + Sur Rune ",
    CubeRecipeDescription: "Rare Any Shield + 2 Unique Jewel + Vex Rune + Sur Rune = Any Shield"
  },
  {
    Description: "REPAIR ITEM ETHEREAL repair eth item",
    Item: null,
    Output: "Weapon Repair durability",
    Input: "Etheral Weapon + 2 Unique Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Weapon + 2 Unique Jewel + Pul Rune = Weapon Repair Durability"
  },
  {
    Description: "REPAIR ITEM ETHEREAL repair eth item",
    Item: null,
    Output: "Any Armor Repair durability",
    Input: "Etheral Any Armor + 2 Unique Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Any Armor + 2 Unique Jewel + Pul Rune = Any Armor Repair Durability"
  },
  {
    Description: "REPAIR ITEM ETHEREAL - repair eth item",
    Item: null,
    Output: "Any Shield Repair durability",
    Input: "Etheral Any Shield + 2 Unique Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Any Shield + 2 Unique Jewel + Pul Rune = Any Shield Repair Durability"
  },
  {
    Description: "TRANSFORM ITEM ETHEREAL - forces item ethereal",
    Item: null,
    Output: "Weapon",
    Input: "Weapon + 2 Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Weapon + 2 Unique Jewel + Ohm Rune = Weapon"
  },
  {
    Description: "TRANSFORM ITEM ETHEREAL - forces item ethereal",
    Item: null,
    Output: "Any Armor",
    Input: "Any Armor + 2 Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Any Armor + 2 Unique Jewel + Ohm Rune = Any Armor"
  },
  {
    Description: "TRANSFORM ITEM ETHEREAL - forces item ethereal",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + 2 Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Any Shield + 2 Unique Jewel + Ohm Rune = Any Shield"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Amethyst Downgrade",
    Item: null,
    Output: "Chipped Amethyst",
    Input: "Flawed Amethyst ",
    CubeRecipeDescription: "Flawed Amethyst = Chipped Amethyst"
  },
  {
    Description: "DOWNGRADE GEM - Standard Amethyst Downgrade",
    Item: null,
    Output: "Flawed Amethyst",
    Input: "Amethyst ",
    CubeRecipeDescription: "Amethyst = Flawed Amethyst"
  },
  {
    Description: "DOWNGRADE GEM - Flaweless Amethyst Downgrade",
    Item: null,
    Output: "Amethyst",
    Input: "Flawless Amethyst ",
    CubeRecipeDescription: "Flawless Amethyst = Amethyst"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Amethyst Downgrade",
    Item: null,
    Output: "Flawless Amethyst",
    Input: "Perfect Amethyst ",
    CubeRecipeDescription: "Perfect Amethyst = Flawless Amethyst"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Ruby Downgrade",
    Item: null,
    Output: "Chipped Ruby",
    Input: "Flawed Ruby ",
    CubeRecipeDescription: "Flawed Ruby = Chipped Ruby"
  },
  {
    Description: "DOWNGRADE GEM - Standard Ruby Downgrade",
    Item: null,
    Output: "Flawed Ruby",
    Input: "Ruby ",
    CubeRecipeDescription: "Ruby = Flawed Ruby"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Ruby Downgrade",
    Item: null,
    Output: "Ruby",
    Input: "Flawless Ruby ",
    CubeRecipeDescription: "Flawless Ruby = Ruby"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Ruby Downgrade",
    Item: null,
    Output: "Flawless Ruby",
    Input: "Perfect Ruby ",
    CubeRecipeDescription: "Perfect Ruby = Flawless Ruby"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Sapphire Downgrade",
    Item: null,
    Output: "Chipped Sapphire",
    Input: "Flawed Sapphire ",
    CubeRecipeDescription: "Flawed Sapphire = Chipped Sapphire"
  },
  {
    Description: "DOWNGRADE GEM - Standard Sapphire Downgrade",
    Item: null,
    Output: "Flawed Sapphire",
    Input: "Sapphire ",
    CubeRecipeDescription: "Sapphire = Flawed Sapphire"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Sapphire Downgrade",
    Item: null,
    Output: "Sapphire",
    Input: "Flawless Sapphire ",
    CubeRecipeDescription: "Flawless Sapphire = Sapphire"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Sapphire Downgrade",
    Item: null,
    Output: "Flawless Sapphire",
    Input: "Perfect Sapphire ",
    CubeRecipeDescription: "Perfect Sapphire = Flawless Sapphire"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Topaz Downgrade",
    Item: null,
    Output: "Chipped Topaz",
    Input: "Flawed Topaz ",
    CubeRecipeDescription: "Flawed Topaz = Chipped Topaz"
  },
  {
    Description: "DOWNGRADE GEM - Standard Topaz Downgrade",
    Item: null,
    Output: "Flawed Topaz",
    Input: "Topaz ",
    CubeRecipeDescription: "Topaz = Flawed Topaz"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Topaz Downgrade",
    Item: null,
    Output: "Topaz",
    Input: "Flawless Topaz ",
    CubeRecipeDescription: "Flawless Topaz = Topaz"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Topaz Downgrade",
    Item: null,
    Output: "Flawless Topaz",
    Input: "Perfect Topaz ",
    CubeRecipeDescription: "Perfect Topaz = Flawless Topaz"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Emerald Downgrade",
    Item: null,
    Output: "Chipped Emerald",
    Input: "Flawed Emerald ",
    CubeRecipeDescription: "Flawed Emerald = Chipped Emerald"
  },
  {
    Description: "DOWNGRADE GEM - Standard Emerald Downgrade",
    Item: null,
    Output: "Flawed Emerald",
    Input: "Emerald ",
    CubeRecipeDescription: "Emerald = Flawed Emerald"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Emerald Downgrade",
    Item: null,
    Output: "Emerald",
    Input: "Flawless Emerald ",
    CubeRecipeDescription: "Flawless Emerald = Emerald"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Emerald Downgrade",
    Item: null,
    Output: "Flawless Emerald",
    Input: "Perfect Emerald ",
    CubeRecipeDescription: "Perfect Emerald = Flawless Emerald"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Diamond Downgrade",
    Item: null,
    Output: "Chipped Diamond",
    Input: "Flawed Diamond ",
    CubeRecipeDescription: "Flawed Diamond = Chipped Diamond"
  },
  {
    Description: "DOWNGRADE GEM - Standard Diamond Downgrade",
    Item: null,
    Output: "Flawed Diamond",
    Input: "Diamond ",
    CubeRecipeDescription: "Diamond = Flawed Diamond"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Diamond Downgrade",
    Item: null,
    Output: "Diamond",
    Input: "Flawless Diamond ",
    CubeRecipeDescription: "Flawless Diamond = Diamond"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Diamond Downgrade",
    Item: null,
    Output: "Flawless Diamond",
    Input: "Perfect Diamond ",
    CubeRecipeDescription: "Perfect Diamond = Flawless Diamond"
  },
  {
    Description: "DOWNGRADE GEM - Flawed Skull Downgrade",
    Item: null,
    Output: "Chipped Skull",
    Input: "Flawed Skull ",
    CubeRecipeDescription: "Flawed Skull = Chipped Skull"
  },
  {
    Description: "DOWNGRADE GEM - Standard Skull Downgrade",
    Item: null,
    Output: "Flawed Skull",
    Input: "Skull ",
    CubeRecipeDescription: "Skull = Flawed Skull"
  },
  {
    Description: "DOWNGRADE GEM - Flawless Skull Downgrade",
    Item: null,
    Output: "Skull",
    Input: "Flawless Skull ",
    CubeRecipeDescription: "Flawless Skull = Skull"
  },
  {
    Description: "DOWNGRADE GEM - Perfect Skull Downgrade",
    Item: null,
    Output: "Flawless Skull",
    Input: "Perfect Skull ",
    CubeRecipeDescription: "Perfect Skull = Flawless Skull"
  },
  {
    Description: "UPGRADE TO NORM - el + hel + any armor = normal armor",
    Item: null,
    Output: "Normal Any Armor",
    Input: "Any Armor + r1 + Hel Rune ",
    CubeRecipeDescription: "Any Armor + R1 + Hel Rune = Normal Any Armor"
  },
  {
    Description: "TRANSFORM TO NORM - el + hel + any weapon = normal weapon",
    Item: null,
    Output: "Normal Weapon",
    Input: "Weapon + r1 + Hel Rune ",
    CubeRecipeDescription: "Weapon + R1 + Hel Rune = Normal Weapon"
  },
  {
    Description: "STACK GEM - 3 Perfect Amethyst = 3x Stacked Perfect Amethyst",
    Item: null,
    Output: "3 Perfect Amethyst Stack",
    Input: "3 Perfect Amethyst ",
    CubeRecipeDescription: "3 Perfect Amethyst = 3 Perfect Amethyst Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Amethyst = 1 Unstacked Perfect Amethyst",
    Item: null,
    Output: "Perfect Amethyst",
    Input: "Perfect Amethyst Stack ",
    CubeRecipeDescription: "Perfect Amethyst Stack = Perfect Amethyst"
  },
  {
    Description: "STACK GEM - 3 Flawless Amethyst = 3x Stacked Flawless Amethyst",
    Item: null,
    Output: "3 Flawless Amethyst Stack",
    Input: "3 Flawless Amethyst ",
    CubeRecipeDescription: "3 Flawless Amethyst = 3 Flawless Amethyst Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Amethyst = 1 Unstacked Flawless Amethyst",
    Item: null,
    Output: "Flawless Amethyst",
    Input: "Flawless Amethyst Stack ",
    CubeRecipeDescription: "Flawless Amethyst Stack = Flawless Amethyst"
  },
  {
    Description: "STACK GEM - 3 Amethyst = 3x Stacked Amethyst",
    Item: null,
    Output: "3 Amethyst Stack",
    Input: "3 Amethyst ",
    CubeRecipeDescription: "3 Amethyst = 3 Amethyst Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Amethyst = 1 Unstacked Amethyst",
    Item: null,
    Output: "Amethyst",
    Input: "Amethyst Stack ",
    CubeRecipeDescription: "Amethyst Stack = Amethyst"
  },
  {
    Description: "STACK GEM - 3 Flawed Amethyst = 3x Stacked Flawed Amethyst",
    Item: null,
    Output: "3 Flawed Amethyst Stack",
    Input: "3 Flawed Amethyst ",
    CubeRecipeDescription: "3 Flawed Amethyst = 3 Flawed Amethyst Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Amethyst = 1 Unstacked Flawed Amethyst",
    Item: null,
    Output: "Flawed Amethyst",
    Input: "Flawed Amethyst Stack ",
    CubeRecipeDescription: "Flawed Amethyst Stack = Flawed Amethyst"
  },
  {
    Description: "STACK GEM - 3 Chipped Amethyst = 3x Stacked Chipped Amethyst",
    Item: null,
    Output: "3 Chipped Amethyst Stack",
    Input: "3 Chipped Amethyst ",
    CubeRecipeDescription: "3 Chipped Amethyst = 3 Chipped Amethyst Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Amethyst = 1 Unstacked Chipped Amethyst",
    Item: null,
    Output: "Chipped Amethyst",
    Input: "Chipped Amethyst Stack ",
    CubeRecipeDescription: "Chipped Amethyst Stack = Chipped Amethyst"
  },
  {
    Description: "STACK GEM - 3 Perfect Topaz = 3x Stacked Perfect Topaz",
    Item: null,
    Output: "3 Perfect Topaz Stack",
    Input: "3 Perfect Topaz ",
    CubeRecipeDescription: "3 Perfect Topaz = 3 Perfect Topaz Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Topaz= 1 Unstacked Perfect Topaz",
    Item: null,
    Output: "Perfect Topaz",
    Input: "Perfect Topaz Stack ",
    CubeRecipeDescription: "Perfect Topaz Stack = Perfect Topaz"
  },
  {
    Description: "STACK GEM - 3 Flawless Topaz = 3x Stacked Flawless Topaz",
    Item: null,
    Output: "3 Flawless Topaz Stack",
    Input: "3 Flawless Topaz ",
    CubeRecipeDescription: "3 Flawless Topaz = 3 Flawless Topaz Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Topaz = 1 Unstacked Flawless Topaz",
    Item: null,
    Output: "Flawless Topaz",
    Input: "Flawless Topaz Stack ",
    CubeRecipeDescription: "Flawless Topaz Stack = Flawless Topaz"
  },
  {
    Description: "STACK GEM - 3 Topaz = 3x Stacked Topaz",
    Item: null,
    Output: "3 Topaz Stack",
    Input: "3 Topaz ",
    CubeRecipeDescription: "3 Topaz = 3 Topaz Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Topaz = 1 Unstacked Topaz",
    Item: null,
    Output: "Topaz",
    Input: "Topaz Stack ",
    CubeRecipeDescription: "Topaz Stack = Topaz"
  },
  {
    Description: "STACK GEM - 3 Flawed Topaz = 3x Stacked Flawed Topaz",
    Item: null,
    Output: "3 Flawed Topaz Stack",
    Input: "3 Flawed Topaz ",
    CubeRecipeDescription: "3 Flawed Topaz = 3 Flawed Topaz Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Topaz = 1 Unstacked Flawed Topaz",
    Item: null,
    Output: "Flawed Topaz",
    Input: "Flawed Topaz Stack ",
    CubeRecipeDescription: "Flawed Topaz Stack = Flawed Topaz"
  },
  {
    Description: "STACK GEM - 3 Chipped Topaz = 3x Stacked Chipped Topaz",
    Item: null,
    Output: "3 Chipped Topaz Stack",
    Input: "3 Chipped Topaz ",
    CubeRecipeDescription: "3 Chipped Topaz = 3 Chipped Topaz Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Topaz = 1 Unstacked Chipped Topaz",
    Item: null,
    Output: "Chipped Topaz",
    Input: "Chipped Topaz Stack ",
    CubeRecipeDescription: "Chipped Topaz Stack = Chipped Topaz"
  },
  {
    Description: "STACK GEM - 3 Perfect Sapphire = 3x Stacked Perfect Sapphire",
    Item: null,
    Output: "3 Perfect Sapphire Stack",
    Input: "3 Perfect Sapphire ",
    CubeRecipeDescription: "3 Perfect Sapphire = 3 Perfect Sapphire Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Sapphire = 1 Unstacked Perfect Sapphire",
    Item: null,
    Output: "Perfect Sapphire",
    Input: "Perfect Sapphire Stack ",
    CubeRecipeDescription: "Perfect Sapphire Stack = Perfect Sapphire"
  },
  {
    Description: "STACK GEM - 3 Flawless Sapphire = 3x Stacked Flawless Sapphire",
    Item: null,
    Output: "3 Flawless Sapphire Stack",
    Input: "3 Flawless Sapphire ",
    CubeRecipeDescription: "3 Flawless Sapphire = 3 Flawless Sapphire Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Sapphire = 1 Unstacked Flawless Sapphire",
    Item: null,
    Output: "Flawless Sapphire",
    Input: "Flawless Sapphire Stack ",
    CubeRecipeDescription: "Flawless Sapphire Stack = Flawless Sapphire"
  },
  {
    Description: "STACK GEM - 3 Sapphire = 3x Stacked Sapphire",
    Item: null,
    Output: "3 Sapphire Stack",
    Input: "3 Sapphire ",
    CubeRecipeDescription: "3 Sapphire = 3 Sapphire Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Sapphire = 1 Unstacked Sapphire",
    Item: null,
    Output: "Sapphire",
    Input: "Sapphire Stack ",
    CubeRecipeDescription: "Sapphire Stack = Sapphire"
  },
  {
    Description: "STACK GEM - 3 Flawed Sapphire = 3x Stacked Flawed Sapphire",
    Item: null,
    Output: "3 Flawed Sapphire Stack",
    Input: "3 Flawed Sapphire ",
    CubeRecipeDescription: "3 Flawed Sapphire = 3 Flawed Sapphire Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Sapphire = 1 Unstacked Flawed Sapphire",
    Item: null,
    Output: "Flawed Sapphire",
    Input: "Flawed Sapphire Stack ",
    CubeRecipeDescription: "Flawed Sapphire Stack = Flawed Sapphire"
  },
  {
    Description: "STACK GEM - 3 Chipped Sapphire = 3x Stacked Chipped Sapphire",
    Item: null,
    Output: "3 Chipped Sapphire Stack",
    Input: "3 Chipped Sapphire ",
    CubeRecipeDescription: "3 Chipped Sapphire = 3 Chipped Sapphire Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Sapphire = 1 Unstacked Chipped Sapphire",
    Item: null,
    Output: "Chipped Sapphire",
    Input: "Chipped Sapphire Stack ",
    CubeRecipeDescription: "Chipped Sapphire Stack = Chipped Sapphire"
  },
  {
    Description: "STACK GEM - 3 Perfect Emerald= 3x Stacked Perfect Emerald",
    Item: null,
    Output: "3 Perfect Emerald Stack",
    Input: "3 Perfect Emerald ",
    CubeRecipeDescription: "3 Perfect Emerald = 3 Perfect Emerald Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Emerald = 1 Unstacked Perfect Emerald",
    Item: null,
    Output: "Perfect Emerald",
    Input: "Perfect Emerald Stack ",
    CubeRecipeDescription: "Perfect Emerald Stack = Perfect Emerald"
  },
  {
    Description: "STACK GEM - 3 Flawless Emerald = 3x Stacked Flawless Emerald",
    Item: null,
    Output: "3 Flawless Emerald Stack",
    Input: "3 Flawless Emerald ",
    CubeRecipeDescription: "3 Flawless Emerald = 3 Flawless Emerald Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Emerald = 1 Unstacked Flawless Emerald",
    Item: null,
    Output: "Flawless Emerald",
    Input: "Flawless Emerald Stack ",
    CubeRecipeDescription: "Flawless Emerald Stack = Flawless Emerald"
  },
  {
    Description: "STACK GEM - 3 Emerald = 3x Stacked Emerald",
    Item: null,
    Output: "3 Emerald Stack",
    Input: "3 Emerald ",
    CubeRecipeDescription: "3 Emerald = 3 Emerald Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Emerald = 1 Unstacked Emerald",
    Item: null,
    Output: "Emerald",
    Input: "Emerald Stack ",
    CubeRecipeDescription: "Emerald Stack = Emerald"
  },
  {
    Description: "STACK GEM - 3 Flawed Emerald = 3x Stacked Flawed Emerald",
    Item: null,
    Output: "3 Flawed Emerald Stack",
    Input: "3 Flawed Emerald ",
    CubeRecipeDescription: "3 Flawed Emerald = 3 Flawed Emerald Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Emerald = 1 Unstacked Flawed Emerald",
    Item: null,
    Output: "Flawed Emerald",
    Input: "Flawed Emerald Stack ",
    CubeRecipeDescription: "Flawed Emerald Stack = Flawed Emerald"
  },
  {
    Description: "STACK GEM - 3 Chipped Emerald= 3x Stacked Chipped Emerald",
    Item: null,
    Output: "3 Chipped Emerald Stack",
    Input: "3 Chipped Emerald ",
    CubeRecipeDescription: "3 Chipped Emerald = 3 Chipped Emerald Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Emerald = 1 Unstacked Chipped Emerald",
    Item: null,
    Output: "Chipped Emerald",
    Input: "Chipped Emerald Stack ",
    CubeRecipeDescription: "Chipped Emerald Stack = Chipped Emerald"
  },
  {
    Description: "STACK GEM - 3 Perfect Ruby = 3x Stacked Perfect Ruby",
    Item: null,
    Output: "3 Perfect Ruby Stack",
    Input: "3 Perfect Ruby ",
    CubeRecipeDescription: "3 Perfect Ruby = 3 Perfect Ruby Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Ruby = 1 Unstacked Perfect Ruby",
    Item: null,
    Output: "Perfect Ruby",
    Input: "Perfect Ruby Stack ",
    CubeRecipeDescription: "Perfect Ruby Stack = Perfect Ruby"
  },
  {
    Description: "STACK GEM - 3 Flawless Ruby = 3x Stacked Flawless Ruby",
    Item: null,
    Output: "3 Flawless Ruby Stack",
    Input: "3 Flawless Ruby ",
    CubeRecipeDescription: "3 Flawless Ruby = 3 Flawless Ruby Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Ruby = 1 Unstacked Flawless Ruby",
    Item: null,
    Output: "Flawless Ruby",
    Input: "Flawless Ruby Stack ",
    CubeRecipeDescription: "Flawless Ruby Stack = Flawless Ruby"
  },
  {
    Description: "STACK GEM - 3 Ruby= 3x Stacked Ruby",
    Item: null,
    Output: "3 Ruby Stack",
    Input: "3 Ruby ",
    CubeRecipeDescription: "3 Ruby = 3 Ruby Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Ruby = 1 Unstacked Ruby",
    Item: null,
    Output: "Ruby",
    Input: "Ruby Stack ",
    CubeRecipeDescription: "Ruby Stack = Ruby"
  },
  {
    Description: "STACK GEM - 3 Flawed Ruby = 3x Stacked Flawed Ruby",
    Item: null,
    Output: "3 Flawed Ruby Stack",
    Input: "3 Flawed Ruby ",
    CubeRecipeDescription: "3 Flawed Ruby = 3 Flawed Ruby Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Ruby = 1 Unstacked Flawed Ruby",
    Item: null,
    Output: "Flawed Ruby",
    Input: "Flawed Ruby Stack ",
    CubeRecipeDescription: "Flawed Ruby Stack = Flawed Ruby"
  },
  {
    Description: "STACK GEM - 3 Chipped Ruby = 3x Stacked Chipped Ruby",
    Item: null,
    Output: "3 Chipped Ruby Stack",
    Input: "3 Chipped Ruby ",
    CubeRecipeDescription: "3 Chipped Ruby = 3 Chipped Ruby Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Ruby = 1 Unstacked Chipped Ruby",
    Item: null,
    Output: "Chipped Ruby",
    Input: "Chipped Ruby Stack ",
    CubeRecipeDescription: "Chipped Ruby Stack = Chipped Ruby"
  },
  {
    Description: "STACK GEM - 3 Perfect Diamond = 3x Stacked Perfect Diamond",
    Item: null,
    Output: "3 Perfect Diamond Stack",
    Input: "3 Perfect Diamond ",
    CubeRecipeDescription: "3 Perfect Diamond = 3 Perfect Diamond Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Diamond = 1 Unstacked Perfect Diamond",
    Item: null,
    Output: "Perfect Diamond",
    Input: "Perfect Diamond Stack ",
    CubeRecipeDescription: "Perfect Diamond Stack = Perfect Diamond"
  },
  {
    Description: "STACK GEM - 3 Flawless Diamond = 3x Stacked Flawless Diamond",
    Item: null,
    Output: "3 Flawless Diamond Stack",
    Input: "3 Flawless Diamond ",
    CubeRecipeDescription: "3 Flawless Diamond = 3 Flawless Diamond Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Diamond = 1 Unstacked Flawless Diamond",
    Item: null,
    Output: "Flawless Diamond",
    Input: "Flawless Diamond Stack ",
    CubeRecipeDescription: "Flawless Diamond Stack = Flawless Diamond"
  },
  {
    Description: "STACK GEM - 3 Diamond = 3x Stacked Diamons",
    Item: null,
    Output: "3 Diamond Stack",
    Input: "3 Diamond ",
    CubeRecipeDescription: "3 Diamond = 3 Diamond Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Diamond = 1 Unstacked Diamond",
    Item: null,
    Output: "Diamond",
    Input: "Diamond Stack ",
    CubeRecipeDescription: "Diamond Stack = Diamond"
  },
  {
    Description: "STACK GEM - 3 Flawed Diamond = 3x Stacked Flawed Diamond",
    Item: null,
    Output: "3 Flawed Diamond Stack",
    Input: "3 Flawed Diamond ",
    CubeRecipeDescription: "3 Flawed Diamond = 3 Flawed Diamond Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Diamond = 1 Unstacked Flawed Diamond",
    Item: null,
    Output: "Flawed Diamond",
    Input: "Flawed Diamond Stack ",
    CubeRecipeDescription: "Flawed Diamond Stack = Flawed Diamond"
  },
  {
    Description: "STACK GEM - 3 Chipped Diamond = 3x Stacked Chipped Diamond",
    Item: null,
    Output: "3 Chipped Diamond Stack",
    Input: "3 Chipped Diamond ",
    CubeRecipeDescription: "3 Chipped Diamond = 3 Chipped Diamond Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Diamond = 1 Unstacked Chipped Diamond",
    Item: null,
    Output: "Chipped Diamond",
    Input: "Chipped Diamond Stack ",
    CubeRecipeDescription: "Chipped Diamond Stack = Chipped Diamond"
  },
  {
    Description: "STACK GEM - 3 Perfect Skull = 3x Stacked Perfect Skull",
    Item: null,
    Output: "3 Perfect Skull Stack",
    Input: "3 Perfect Skull ",
    CubeRecipeDescription: "3 Perfect Skull = 3 Perfect Skull Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Perfect Skull = 1 Unstacked Perfect Skull",
    Item: null,
    Output: "Perfect Skull",
    Input: "Perfect Skull Stack ",
    CubeRecipeDescription: "Perfect Skull Stack = Perfect Skull"
  },
  {
    Description: "STACK GEM - 3 Flawless Skull = 3x Stacked Flawless Skull",
    Item: null,
    Output: "3 Flawless Skull Stack",
    Input: "3 Flawless Skull ",
    CubeRecipeDescription: "3 Flawless Skull = 3 Flawless Skull Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawless Skull = 1 Unstacked Flawless Skull",
    Item: null,
    Output: "Flawless Skull",
    Input: "Flawless Skull Stack ",
    CubeRecipeDescription: "Flawless Skull Stack = Flawless Skull"
  },
  {
    Description: "STACK GEM - 3 Skull= 3x Stacked Skull",
    Item: null,
    Output: "3 Skull Stack",
    Input: "3 Skull ",
    CubeRecipeDescription: "3 Skull = 3 Skull Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Skull = 1 Unstacked Skull",
    Item: null,
    Output: "Skull",
    Input: "Skull Stack ",
    CubeRecipeDescription: "Skull Stack = Skull"
  },
  {
    Description: "STACK GEM - 3 Flawed Skull = 3x Stacked Flawed Skull",
    Item: null,
    Output: "3 Flawed Skull Stack",
    Input: "3 Flawed Skull ",
    CubeRecipeDescription: "3 Flawed Skull = 3 Flawed Skull Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Flawed Skull = 1 Unstacked Flawed Skull",
    Item: null,
    Output: "Flawed Skull",
    Input: "Flawed Skull Stack ",
    CubeRecipeDescription: "Flawed Skull Stack = Flawed Skull"
  },
  {
    Description: "STACK GEM - 3 Chipped Skull = 3x Stacked Chipped Skull",
    Item: null,
    Output: "3 Chipped Skull Stack",
    Input: "3 Chipped Skull ",
    CubeRecipeDescription: "3 Chipped Skull = 3 Chipped Skull Stack"
  },
  {
    Description: "UNSTACK GEM - 1 Stacked Chipped Skull= 1 Unstacked Chipped Skull",
    Item: null,
    Output: "Chipped Skull",
    Input: "Chipped Skull Stack ",
    CubeRecipeDescription: "Chipped Skull Stack = Chipped Skull"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked El Rune = 1 El Rune",
    Item: null,
    Output: "El Rune",
    Input: "El Rune Stack ",
    CubeRecipeDescription: "El Rune Stack = El Rune"
  },
  {
    Description: "STACK RUNE - 3 El Rune = 3 Stacked El Rune",
    Item: null,
    Output: "3 El Rune Stack",
    Input: "3 El Rune ",
    CubeRecipeDescription: "3 El Rune = 3 El Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Eld Rune = 1 Eld Rune",
    Item: null,
    Output: "Eld Rune",
    Input: "Eld Rune Stack ",
    CubeRecipeDescription: "Eld Rune Stack = Eld Rune"
  },
  {
    Description: "STACK RUNE - 3 Eld Rune = 3 Stacked Eld Rune",
    Item: null,
    Output: "3 Eld Rune Stack",
    Input: "3 Eld Rune ",
    CubeRecipeDescription: "3 Eld Rune = 3 Eld Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Tir Rune = 1 Tir Rune",
    Item: null,
    Output: "Tir Rune",
    Input: "Tir Rune Stack ",
    CubeRecipeDescription: "Tir Rune Stack = Tir Rune"
  },
  {
    Description: "STACK RUNE - 3 Tir Rune = 3 Stacked Tir Rune",
    Item: null,
    Output: "3 Tir Rune Stack",
    Input: "3 Tir Rune ",
    CubeRecipeDescription: "3 Tir Rune = 3 Tir Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Nef Rune = 1 Nef Rune",
    Item: null,
    Output: "Nef Rune",
    Input: "Nef Rune Stack ",
    CubeRecipeDescription: "Nef Rune Stack = Nef Rune"
  },
  {
    Description: "STACK RUNE - 3 Nef Rune = 3 Stacked Nef Rune",
    Item: null,
    Output: "3 Nef Rune Stack",
    Input: "3 Nef Rune ",
    CubeRecipeDescription: "3 Nef Rune = 3 Nef Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Eth Rune = 1 Eth Rune",
    Item: null,
    Output: "Eth Rune",
    Input: "Eth Rune Stack ",
    CubeRecipeDescription: "Eth Rune Stack = Eth Rune"
  },
  {
    Description: "STACK RUNE - 3 Eth Rune = 3 Stacked Eth Rune",
    Item: null,
    Output: "3 Eth Rune Stack",
    Input: "3 Eth Rune ",
    CubeRecipeDescription: "3 Eth Rune = 3 Eth Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ith Rune = 1 Ith Rune",
    Item: null,
    Output: "Ith Rune",
    Input: "Ith Rune Stack ",
    CubeRecipeDescription: "Ith Rune Stack = Ith Rune"
  },
  {
    Description: "STACK RUNE - 3 Ith Rune = 3 Stacked Ith Rune",
    Item: null,
    Output: "3 Ith Rune Stack",
    Input: "3 Ith Rune ",
    CubeRecipeDescription: "3 Ith Rune = 3 Ith Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Tal Rune = 1 Tal Rune",
    Item: null,
    Output: "Tal Rune",
    Input: "Tal Rune Stack ",
    CubeRecipeDescription: "Tal Rune Stack = Tal Rune"
  },
  {
    Description: "STACK RUNE - 3 Tal Rune = 3 Stacked Tal Rune",
    Item: null,
    Output: "3 Tal Rune Stack",
    Input: "3 Tal Rune ",
    CubeRecipeDescription: "3 Tal Rune = 3 Tal Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ral Rune = 1 Ral Rune",
    Item: null,
    Output: "Ral Rune",
    Input: "Ral Rune Stack ",
    CubeRecipeDescription: "Ral Rune Stack = Ral Rune"
  },
  {
    Description: "STACK RUNE - 3 Ral Rune = 3 Stacked Ral Rune",
    Item: null,
    Output: "3 Ral Rune Stack",
    Input: "3 Ral Rune ",
    CubeRecipeDescription: "3 Ral Rune = 3 Ral Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ort Rune = 1 Ort Rune",
    Item: null,
    Output: "Ort Rune",
    Input: "Ort Rune Stack ",
    CubeRecipeDescription: "Ort Rune Stack = Ort Rune"
  },
  {
    Description: "STACK RUNE - 3 Ort Rune = 3 Stacked Ort Rune",
    Item: null,
    Output: "3 Ort Rune Stack",
    Input: "3 Ort Rune ",
    CubeRecipeDescription: "3 Ort Rune = 3 Ort Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Thul Rune = 1 Thul Rune",
    Item: null,
    Output: "Thul Rune",
    Input: "Thul Rune Stack ",
    CubeRecipeDescription: "Thul Rune Stack = Thul Rune"
  },
  {
    Description: "STACK RUNE - 3 Thul Rune = 3 Stacked Thul Rune",
    Item: null,
    Output: "3 Thul Rune Stack",
    Input: "3 Thul Rune ",
    CubeRecipeDescription: "3 Thul Rune = 3 Thul Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Amn Rune = 1 Amn Rune",
    Item: null,
    Output: "Amn Rune",
    Input: "Amn Rune Stack ",
    CubeRecipeDescription: "Amn Rune Stack = Amn Rune"
  },
  {
    Description: "STACK RUNE - 3 Amn Rune = 3 Stacked Amn Rune",
    Item: null,
    Output: "3 Amn Rune Stack",
    Input: "3 Amn Rune ",
    CubeRecipeDescription: "3 Amn Rune = 3 Amn Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Sol Rune = 1 Sol Rune",
    Item: null,
    Output: "Sol Rune",
    Input: "Sol Rune Stack ",
    CubeRecipeDescription: "Sol Rune Stack = Sol Rune"
  },
  {
    Description: "STACK RUNE - 3 Sol Rune = 3 Stacked Sol Rune",
    Item: null,
    Output: "3 Sol Rune Stack",
    Input: "3 Sol Rune ",
    CubeRecipeDescription: "3 Sol Rune = 3 Sol Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Shael Rune = 1 Shael Rune",
    Item: null,
    Output: "Shael Rune",
    Input: "Shael Rune Stack ",
    CubeRecipeDescription: "Shael Rune Stack = Shael Rune"
  },
  {
    Description: "STACK RUNE - 3 Shael Rune = 3 Stacked Shael Rune",
    Item: null,
    Output: "3 Shael Rune Stack",
    Input: "3 Shael Rune ",
    CubeRecipeDescription: "3 Shael Rune = 3 Shael Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Dol Rune = 1 Dol Rune",
    Item: null,
    Output: "Dol Rune",
    Input: "Dol Rune Stack ",
    CubeRecipeDescription: "Dol Rune Stack = Dol Rune"
  },
  {
    Description: "STACK RUNE - 3 Dol Rune = 3 Stacked Dol Rune",
    Item: null,
    Output: "3 Dol Rune Stack",
    Input: "3 Dol Rune ",
    CubeRecipeDescription: "3 Dol Rune = 3 Dol Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Hel Rune = 1 Hel Rune",
    Item: null,
    Output: "Hel Rune",
    Input: "Hel Rune Stack ",
    CubeRecipeDescription: "Hel Rune Stack = Hel Rune"
  },
  {
    Description: "STACK RUNE - 3 Hel Rune = 3 Stacked Hel Rune",
    Item: null,
    Output: "3 Hel Rune Stack",
    Input: "3 Hel Rune ",
    CubeRecipeDescription: "3 Hel Rune = 3 Hel Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Io Rune = 1 Io Rune",
    Item: null,
    Output: "Io Rune",
    Input: "Io Rune Stack ",
    CubeRecipeDescription: "Io Rune Stack = Io Rune"
  },
  {
    Description: "STACK RUNE - 3 Io Rune = 3 Stacked Io Rune",
    Item: null,
    Output: "3 Io Rune Stack",
    Input: "3 Io Rune ",
    CubeRecipeDescription: "3 Io Rune = 3 Io Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Lum Rune = 1 Lum Rune",
    Item: null,
    Output: "Lum Rune",
    Input: "Lum Rune Stack ",
    CubeRecipeDescription: "Lum Rune Stack = Lum Rune"
  },
  {
    Description: "STACK RUNE - 3 Lum Rune = 3 Stacked Lum Rune",
    Item: null,
    Output: "3 Lum Rune Stack",
    Input: "3 Lum Rune ",
    CubeRecipeDescription: "3 Lum Rune = 3 Lum Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ko Rune = 1 Ko Rune",
    Item: null,
    Output: "Ko Rune",
    Input: "Ko Rune Stack ",
    CubeRecipeDescription: "Ko Rune Stack = Ko Rune"
  },
  {
    Description: "STACK RUNE - 3 Ko Rune = 3 Stacked Ko Rune",
    Item: null,
    Output: "3 Ko Rune Stack",
    Input: "3 Ko Rune ",
    CubeRecipeDescription: "3 Ko Rune = 3 Ko Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Fal Rune = 1 Fal Rune",
    Item: null,
    Output: "Fal Rune",
    Input: "Fal Rune Stack ",
    CubeRecipeDescription: "Fal Rune Stack = Fal Rune"
  },
  {
    Description: "STACK RUNE - 3 Fal Rune = 3 Stacked Fal Rune",
    Item: null,
    Output: "3 Fal Rune Stack",
    Input: "3 Fal Rune ",
    CubeRecipeDescription: "3 Fal Rune = 3 Fal Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Lem Rune = 1 Lem Rune",
    Item: null,
    Output: "Lem Rune",
    Input: "Lem Rune Stack ",
    CubeRecipeDescription: "Lem Rune Stack = Lem Rune"
  },
  {
    Description: "STACK RUNE - 3 Lem Rune = 3 Stacked Lem Rune",
    Item: null,
    Output: "3 Lem Rune Stack",
    Input: "3 Lem Rune ",
    CubeRecipeDescription: "3 Lem Rune = 3 Lem Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Pul Rune = 1 Pul Rune",
    Item: null,
    Output: "Pul Rune",
    Input: "Pul Rune Stack ",
    CubeRecipeDescription: "Pul Rune Stack = Pul Rune"
  },
  {
    Description: "STACK RUNE - 3 Pul Rune = 3 Stacked Pul Rune",
    Item: null,
    Output: "3 Pul Rune Stack",
    Input: "3 Pul Rune ",
    CubeRecipeDescription: "3 Pul Rune = 3 Pul Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Um Rune = 1 Um Rune",
    Item: null,
    Output: "Um Rune",
    Input: "Um Rune Stack ",
    CubeRecipeDescription: "Um Rune Stack = Um Rune"
  },
  {
    Description: "STACK RUNE - 3 Um Rune = 3 Stacked Um Rune",
    Item: null,
    Output: "3 Um Rune Stack",
    Input: "3 Um Rune ",
    CubeRecipeDescription: "3 Um Rune = 3 Um Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Mal Rune = 1 Mal Rune",
    Item: null,
    Output: "Mal Rune",
    Input: "Mal Rune Stack ",
    CubeRecipeDescription: "Mal Rune Stack = Mal Rune"
  },
  {
    Description: "STACK RUNE - 3 Mal Rune = 3 Stacked Mal Rune",
    Item: null,
    Output: "3 Mal Rune Stack",
    Input: "3 Mal Rune ",
    CubeRecipeDescription: "3 Mal Rune = 3 Mal Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ist Rune = 1 Ist Rune",
    Item: null,
    Output: "Ist Rune",
    Input: "Ist Rune Stack ",
    CubeRecipeDescription: "Ist Rune Stack = Ist Rune"
  },
  {
    Description: "STACK RUNE - 3 Ist Rune = 3 Stacked Ist Rune",
    Item: null,
    Output: "3 Ist Rune Stack",
    Input: "3 Ist Rune ",
    CubeRecipeDescription: "3 Ist Rune = 3 Ist Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Gul Rune = 1 Gul Rune",
    Item: null,
    Output: "Gul Rune",
    Input: "Gul Rune Stack ",
    CubeRecipeDescription: "Gul Rune Stack = Gul Rune"
  },
  {
    Description: "STACK RUNE - 3 Gul Rune = 3 Stacked Gul Rune",
    Item: null,
    Output: "3 Gul Rune Stack",
    Input: "3 Gul Rune ",
    CubeRecipeDescription: "3 Gul Rune = 3 Gul Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Vex Rune = 1 Vex Rune",
    Item: null,
    Output: "Vex Rune",
    Input: "Vex Rune Stack ",
    CubeRecipeDescription: "Vex Rune Stack = Vex Rune"
  },
  {
    Description: "STACK RUNE - 3 Vex Rune = 3 Stacked Vex Rune",
    Item: null,
    Output: "3 Vex Rune Stack",
    Input: "3 Vex Rune ",
    CubeRecipeDescription: "3 Vex Rune = 3 Vex Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ohm Rune = 1 Ohm Rune",
    Item: null,
    Output: "Ohm Rune",
    Input: "Ohm Rune Stack ",
    CubeRecipeDescription: "Ohm Rune Stack = Ohm Rune"
  },
  {
    Description: "STACK RUNE - 3 Ohm Rune = 3 Stacked Ohm Rune",
    Item: null,
    Output: "3 Ohm Rune Stack",
    Input: "3 Ohm Rune ",
    CubeRecipeDescription: "3 Ohm Rune = 3 Ohm Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Lo Rune = 1 Lo Rune",
    Item: null,
    Output: "Lo Rune",
    Input: "Lo Rune Stack ",
    CubeRecipeDescription: "Lo Rune Stack = Lo Rune"
  },
  {
    Description: "STACK RUNE - 3 Lo Rune = 3 Stacked Lo Rune",
    Item: null,
    Output: "3 Lo Rune Stack",
    Input: "3 Lo Rune ",
    CubeRecipeDescription: "3 Lo Rune = 3 Lo Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Sur Rune = 1 Sur Rune",
    Item: null,
    Output: "Sur Rune",
    Input: "Sur Rune Stack ",
    CubeRecipeDescription: "Sur Rune Stack = Sur Rune"
  },
  {
    Description: "STACK RUNE - 3 Sur Rune = 3 Stacked Sur Rune",
    Item: null,
    Output: "3 Sur Rune Stack",
    Input: "3 Sur Rune ",
    CubeRecipeDescription: "3 Sur Rune = 3 Sur Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Ber Rune = 1 Ber Rune",
    Item: null,
    Output: "Ber Rune",
    Input: "Ber Rune Stack ",
    CubeRecipeDescription: "Ber Rune Stack = Ber Rune"
  },
  {
    Description: "STACK RUNE - 3 Ber Rune = 3 Stacked Ber Rune",
    Item: null,
    Output: "3 Ber Rune Stack",
    Input: "3 Ber Rune ",
    CubeRecipeDescription: "3 Ber Rune = 3 Ber Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Jah Rune = 1 Jah Rune",
    Item: null,
    Output: "Jah Rune",
    Input: "Jah Rune Stack ",
    CubeRecipeDescription: "Jah Rune Stack = Jah Rune"
  },
  {
    Description: "STACK RUNE - 3 Jah Rune = 3 Stacked Jah Rune",
    Item: null,
    Output: "3 Jah Rune Stack",
    Input: "3 Jah Rune ",
    CubeRecipeDescription: "3 Jah Rune = 3 Jah Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Cham Rune = 1 Cham Rune",
    Item: null,
    Output: "Cham Rune",
    Input: "Cham Rune Stack ",
    CubeRecipeDescription: "Cham Rune Stack = Cham Rune"
  },
  {
    Description: "STACK RUNE - 3 Cham Rune = 3 Stacked Cham Rune",
    Item: null,
    Output: "3 Cham Rune Stack",
    Input: "3 Cham Rune ",
    CubeRecipeDescription: "3 Cham Rune = 3 Cham Rune Stack"
  },
  {
    Description: "UNSTACK RUNE - 1 Stacked Zod Rune = 1 Zod Rune",
    Item: null,
    Output: "Zod Rune",
    Input: "Zod Rune Stack ",
    CubeRecipeDescription: "Zod Rune Stack = Zod Rune"
  },
  {
    Description: "STACK RUNE - 3 Zod Rune = 3 Stacked Zod Rune",
    Item: null,
    Output: "3 Zod Rune Stack",
    Input: "3 Zod Rune ",
    CubeRecipeDescription: "3 Zod Rune = 3 Zod Rune Stack"
  },
  {
    Description: "PORTAL - Town Portal Scroll = Snapchip's Soul + Perfect Skull = Pitzilla Red Portal",
    Item: null,
    Output: "137 Red Portal",
    Input: "Perfect Skull + Scroll of Town Portal + Snapchip's Soul ",
    CubeRecipeDescription: "Perfect Skull + Scroll Of Town Portal + Snapchip's Soul = 137 Red Portal"
  },
  {
    Description: "PORTAL - Town Portal Scroll = Snapchip's Soul + Stacked Perfect Skull = Pitzilla Red Portal",
    Item: null,
    Output: "137 Red Portal",
    Input: "Perfect Skull Stack + Scroll of Town Portal + Snapchip's Soul ",
    CubeRecipeDescription: "Perfect Skull Stack + Scroll Of Town Portal + Snapchip's Soul = 137 Red Portal"
  },
  {
    Description: "CRAFT ITEM KEYCHAIN - Terror Key + Hate Key + Destruction Key + ID Scroll = Keychain",
    Item: null,
    Output: "Storage for Keys",
    Input: "Key of Terror + Key of Hate + Key of Destruction + Scroll of Identify ",
    CubeRecipeDescription: "Key Of Terror + Key Of Hate + Key Of Destruction + Scroll Of Identify = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Terror Key = Increment +1 to Terror Key Quantity",
    Item: null,
    Output: "",
    Input: "Storage for Keys + Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + Key Of Terror = "
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Hate Key = Increment +1 to Hate Key Quantity",
    Item: null,
    Output: "",
    Input: "Storage for Keys + Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + Key Of Hate = "
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Destruction Key = Increment +1 to Destruction Key Quantity",
    Item: null,
    Output: "",
    Input: "Storage for Keys + Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + Key Of Destruction = "
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 2x Terror Key = Increment +2 to Terror Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Terror = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 2x Hate Key = Increment +2 to Hate Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Hate = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 2x Destruction Key = Increment +2 to Destruction Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Destruction = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 3x Terror Key = Increment +3 to Terror Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Terror = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 3x Hate Key = Increment +3 to Hate Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Hate = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + 3x Destruction Key = Increment +3 to Destruction Key Quantity",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Destruction = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Terror Key Grabber = Descrease 1 to Terror Key Quantity + 1 Terror Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Terror Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Terror Key Grabber = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Hate Key Grabber = Descrease 1 to Hate Key Quantity + 1 Hate Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Hate Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Hate Key Grabber = Storage For Keys"
  },
  {
    Description: "TRANSFER OUT KEY - Keychain + Destruction Key Grabber = Descrease 1 to Destruction Key Quantity + 1 Destruction Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Desctruction Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Desctruction Key Grabber = Storage For Keys"
  },
  {
    Description: "CHANGE GRABBER - Terror Key Grabber = Hate Key Grabber",
    Item: null,
    Output: "Hate Key Grabber",
    Input: "Terror Key Grabber ",
    CubeRecipeDescription: "Terror Key Grabber = Hate Key Grabber"
  },
  {
    Description: "CHANGE GRABBER - Hate Key Grabber = Destruction Key Grabber",
    Item: null,
    Output: "Desctruction Key Grabber",
    Input: "Hate Key Grabber ",
    CubeRecipeDescription: "Hate Key Grabber = Desctruction Key Grabber"
  },
  {
    Description: "CHANGE GRABBER - Desctruction Key Grabber = Terror Key Grabber",
    Item: null,
    Output: "Terror Key Grabber",
    Input: "Desctruction Key Grabber ",
    CubeRecipeDescription: "Desctruction Key Grabber = Terror Key Grabber"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Topaz + Gem Bag = +16 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Topaz ",
    CubeRecipeDescription: "Gem Bag + Perfect Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Topaz + Gem Bag = +32 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Topaz ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Topaz + Gem Bag = +48 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Topaz ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Topaz + Gem Bag = +64 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Topaz ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Amethyst + Gem Bag = +16 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Amethyst ",
    CubeRecipeDescription: "Gem Bag + Perfect Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Amethyst + Gem Bag = +32 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Amethyst ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Amethyst + Gem Bag = +48 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Amethyst ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Amethyst + Gem Bag = +64 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Amethyst ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Diamond + Gem Bag = +16 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Diamond ",
    CubeRecipeDescription: "Gem Bag + Perfect Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Diamond + Gem Bag = +32 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Diamond ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Diamond + Gem Bag = +48 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Diamond ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Diamond + Gem Bag = +64 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Diamond ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Emerald + Gem Bag = +16 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Emerald ",
    CubeRecipeDescription: "Gem Bag + Perfect Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Emerald + Gem Bag = +32 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Emerald ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Emerald + Gem Bag = +48 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Emerald ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Emerald + Gem Bag = +64 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Emerald ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Ruby + Gem Bag = +16 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Ruby ",
    CubeRecipeDescription: "Gem Bag + Perfect Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Ruby + Gem Bag = +32 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Ruby ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Ruby + Gem Bag = +48 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Ruby ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Ruby + Gem Bag = +64 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Ruby ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Skull + Gem Bag = +16 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Skull ",
    CubeRecipeDescription: "Gem Bag + Perfect Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Skull + Gem Bag = +32 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Skull ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Skull + Gem Bag = +48 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Skull ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Skull + Gem Bag = +64 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Skull ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Perfect Sapphire + Gem Bag = +16 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Sapphire ",
    CubeRecipeDescription: "Gem Bag + Perfect Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Perfect Sapphire + Gem Bag = +32 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Perfect Sapphire ",
    CubeRecipeDescription: "Gem Bag + 2 Perfect Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Perfect Sapphire + Gem Bag = +48 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Perfect Sapphire ",
    CubeRecipeDescription: "Gem Bag + 3 Perfect Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Perfect Sapphire + Gem Bag = +64 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Perfect Sapphire ",
    CubeRecipeDescription: "Gem Bag + 4 Perfect Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Topaz + Gem Bag = +8 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Topaz ",
    CubeRecipeDescription: "Gem Bag + Flawless Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Topaz + Gem Bag = +16 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Topaz ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Topaz + Gem Bag = +24 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Topaz ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Topaz + Gem Bag = +32 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Topaz ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Amethyst + Gem Bag = +8 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Amethyst ",
    CubeRecipeDescription: "Gem Bag + Flawless Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Amethyst + Gem Bag = +16 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Amethyst ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Amethyst + Gem Bag = +24 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Amethyst ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Amethyst + Gem Bag = +32 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Amethyst ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Diamond + Gem Bag = +8 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Diamond ",
    CubeRecipeDescription: "Gem Bag + Flawless Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Diamond + Gem Bag = +16 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Diamond ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Diamond + Gem Bag = +24 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Diamond ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Diamond + Gem Bag = +32 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Diamond ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Emerald + Gem Bag = +8 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Emerald ",
    CubeRecipeDescription: "Gem Bag + Flawless Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Emerald + Gem Bag = +16 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Emerald ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Emerald + Gem Bag = +24 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Emerald ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Emerald + Gem Bag = +32 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Emerald ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Ruby + Gem Bag = +8 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Ruby ",
    CubeRecipeDescription: "Gem Bag + Flawless Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Ruby + Gem Bag = +16 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Ruby ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Ruby + Gem Bag = +24 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Ruby ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Ruby + Gem Bag = +32 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Ruby ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Skull + Gem Bag = +8 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Skull ",
    CubeRecipeDescription: "Gem Bag + Flawless Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Skull + Gem Bag = +16 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Skull ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Skull + Gem Bag = +24 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Skull ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Skull + Gem Bag = +32 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Skull ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawless Sapphire + Gem Bag = +8 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Sapphire ",
    CubeRecipeDescription: "Gem Bag + Flawless Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawless Sapphire + Gem Bag = +16 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawless Sapphire ",
    CubeRecipeDescription: "Gem Bag + 2 Flawless Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawless Sapphire + Gem Bag = +24 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawless Sapphire ",
    CubeRecipeDescription: "Gem Bag + 3 Flawless Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawless Sapphire + Gem Bag = +32 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawless Sapphire ",
    CubeRecipeDescription: "Gem Bag + 4 Flawless Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Topaz + Gem Bag = +4 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Topaz ",
    CubeRecipeDescription: "Gem Bag + Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Topaz + Gem Bag = +8 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Topaz ",
    CubeRecipeDescription: "Gem Bag + 2 Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Topaz + Gem Bag = +12 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Topaz ",
    CubeRecipeDescription: "Gem Bag + 3 Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Topaz + Gem Bag = +16 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Topaz ",
    CubeRecipeDescription: "Gem Bag + 4 Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Amethyst + Gem Bag = +4 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Amethyst ",
    CubeRecipeDescription: "Gem Bag + Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Amethyst + Gem Bag = +8 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Amethyst ",
    CubeRecipeDescription: "Gem Bag + 2 Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Amethyst + Gem Bag = +12 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Amethyst ",
    CubeRecipeDescription: "Gem Bag + 3 Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Amethyst + Gem Bag = +16 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Amethyst ",
    CubeRecipeDescription: "Gem Bag + 4 Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Diamond + Gem Bag = +4 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Diamond ",
    CubeRecipeDescription: "Gem Bag + Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Diamond + Gem Bag = +8 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Diamond ",
    CubeRecipeDescription: "Gem Bag + 2 Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Diamond + Gem Bag = +12 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Diamond ",
    CubeRecipeDescription: "Gem Bag + 3 Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Diamond + Gem Bag = +16 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Diamond ",
    CubeRecipeDescription: "Gem Bag + 4 Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Emerald + Gem Bag = +4 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Emerald ",
    CubeRecipeDescription: "Gem Bag + Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Emerald + Gem Bag = +8 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Emerald ",
    CubeRecipeDescription: "Gem Bag + 2 Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Emerald + Gem Bag = +12 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Emerald ",
    CubeRecipeDescription: "Gem Bag + 3 Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Emerald + Gem Bag = +16 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Emerald ",
    CubeRecipeDescription: "Gem Bag + 4 Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Ruby + Gem Bag = +4 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Ruby ",
    CubeRecipeDescription: "Gem Bag + Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Ruby + Gem Bag = +8 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Ruby ",
    CubeRecipeDescription: "Gem Bag + 2 Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Ruby + Gem Bag = +12 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Ruby ",
    CubeRecipeDescription: "Gem Bag + 3 Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Ruby + Gem Bag = +16 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Ruby ",
    CubeRecipeDescription: "Gem Bag + 4 Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Skull + Gem Bag = +4 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Skull ",
    CubeRecipeDescription: "Gem Bag + Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Skull + Gem Bag = +8 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Skull ",
    CubeRecipeDescription: "Gem Bag + 2 Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Skull + Gem Bag = +12 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Skull ",
    CubeRecipeDescription: "Gem Bag + 3 Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Skull + Gem Bag = +16 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Skull ",
    CubeRecipeDescription: "Gem Bag + 4 Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Sapphire + Gem Bag = +4 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Sapphire ",
    CubeRecipeDescription: "Gem Bag + Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Sapphire + Gem Bag = +8 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Sapphire ",
    CubeRecipeDescription: "Gem Bag + 2 Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Sapphire + Gem Bag = +12 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Sapphire ",
    CubeRecipeDescription: "Gem Bag + 3 Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Sapphire + Gem Bag = +16 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Sapphire ",
    CubeRecipeDescription: "Gem Bag + 4 Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Topaz + Gem Bag = +2 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Topaz ",
    CubeRecipeDescription: "Gem Bag + Flawed Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Topaz + Gem Bag = +4 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Topaz ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Topaz + Gem Bag = +6 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Topaz ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Topaz + Gem Bag = +8 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Topaz ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Amethyst + Gem Bag = +2 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Amethyst ",
    CubeRecipeDescription: "Gem Bag + Flawed Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Amethyst + Gem Bag = +4 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Amethyst ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Amethyst + Gem Bag = +6 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Amethyst ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Amethyst + Gem Bag = +8 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Amethyst ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Diamond + Gem Bag = +2 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Diamond ",
    CubeRecipeDescription: "Gem Bag + Flawed Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Diamond + Gem Bag = +4 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Diamond ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Diamond + Gem Bag = +6 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Diamond ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Diamond + Gem Bag = +8 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Diamond ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Emerald + Gem Bag = +2 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Emerald ",
    CubeRecipeDescription: "Gem Bag + Flawed Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Emerald + Gem Bag = +4 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Emerald ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Emerald + Gem Bag = +6 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Emerald ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Emerald + Gem Bag = +8 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Emerald ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Ruby + Gem Bag = +2 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Ruby ",
    CubeRecipeDescription: "Gem Bag + Flawed Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Ruby + Gem Bag = +4 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Ruby ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Ruby + Gem Bag = +6 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Ruby ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Ruby + Gem Bag = +8 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Ruby ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Skull + Gem Bag = +2 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Skull ",
    CubeRecipeDescription: "Gem Bag + Flawed Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Skull + Gem Bag = +4 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Skull ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Skull + Gem Bag = +6 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Skull ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Skull + Gem Bag = +8 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Skull ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Flawed Sapphire + Gem Bag = +2 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Sapphire ",
    CubeRecipeDescription: "Gem Bag + Flawed Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Flawed Sapphire + Gem Bag = +4 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Flawed Sapphire ",
    CubeRecipeDescription: "Gem Bag + 2 Flawed Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Flawed Sapphire + Gem Bag = +6 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Flawed Sapphire ",
    CubeRecipeDescription: "Gem Bag + 3 Flawed Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Flawed Sapphire + Gem Bag = +8 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Flawed Sapphire ",
    CubeRecipeDescription: "Gem Bag + 4 Flawed Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Topaz + Gem Bag = +1 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Topaz ",
    CubeRecipeDescription: "Gem Bag + Chipped Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Topaz + Gem Bag = +2 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Topaz ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Topaz + Gem Bag = +3 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Topaz ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Topaz + Gem Bag = +4 to Topaz Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Topaz ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Topaz = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Amethyst + Gem Bag = +1 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Amethyst ",
    CubeRecipeDescription: "Gem Bag + Chipped Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Amethyst + Gem Bag = +2 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Amethyst ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Amethyst + Gem Bag = +3 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Amethyst ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Amethyst + Gem Bag = +4 to Amethyst Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Amethyst ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Amethyst = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Diamond + Gem Bag = +1 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Diamond ",
    CubeRecipeDescription: "Gem Bag + Chipped Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Diamond + Gem Bag = +2 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Diamond ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Diamond + Gem Bag = +3 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Diamond ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Diamond + Gem Bag = +4 to Diamond Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Diamond ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Diamond = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Emerald + Gem Bag = +1 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Emerald ",
    CubeRecipeDescription: "Gem Bag + Chipped Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Emerald + Gem Bag = +2 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Emerald ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Emerald + Gem Bag = +3 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Emerald ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Emerald + Gem Bag = +4 to Emerald Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Emerald ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Emerald = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Ruby + Gem Bag = +1 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Ruby ",
    CubeRecipeDescription: "Gem Bag + Chipped Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Ruby + Gem Bag = +2 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Ruby ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Ruby + Gem Bag = +3 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Ruby ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Ruby + Gem Bag = +4 to Ruby Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Ruby ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Ruby = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Skull + Gem Bag = +1 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Skull ",
    CubeRecipeDescription: "Gem Bag + Chipped Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Skull + Gem Bag = +2 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Skull ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Skull + Gem Bag = +3 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Skull ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Skull + Gem Bag = +4 to Skull Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Skull ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Skull = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - Chipped Sapphire + Gem Bag = +1 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Sapphire ",
    CubeRecipeDescription: "Gem Bag + Chipped Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 2x Chipped Sapphire + Gem Bag = +2 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 2 Chipped Sapphire ",
    CubeRecipeDescription: "Gem Bag + 2 Chipped Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 3x Chipped Sapphire + Gem Bag = +3 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 3 Chipped Sapphire ",
    CubeRecipeDescription: "Gem Bag + 3 Chipped Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER IN GEM - 4x Chipped Sapphire + Gem Bag = +4 to Sapphire Credits",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + 4 Chipped Sapphire ",
    CubeRecipeDescription: "Gem Bag + 4 Chipped Sapphire = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Topaz Grabber = Perfect Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Topaz Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Amethyst Grabber = Perfect Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Amethyst Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Diamond Grabber = Perfect Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Diamond Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Emerald Grabber = Perfect Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Emerald Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Ruby Grabber = Perfect Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Ruby Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Skull Grabber = Perfect Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Skull Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Perfect Sapphire Grabber = Perfect Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Perfect Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Perfect Sapphire Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Topaz Grabber = Flawless Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Topaz Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Amethyst Grabber = Flawless Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Amethyst Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Diamond Grabber = Flawless Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Diamond Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Emerald Grabber = Flawless Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Emerald Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Ruby Grabber = Flawless Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Ruby Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Skull Grabber = Flawless Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Skull Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawless Sapphire Grabber = Flawless Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawless Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawless Sapphire Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Topaz Grabber = Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Topaz Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Amethyst Grabber = Perfect Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Amethyst Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Diamond Grabber =  Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Diamond Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Emerald Grabber = Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Emerald Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Ruby Grabber = Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Ruby Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Skull Grabber = Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Skull Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Sapphire Grabber = Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Sapphire Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Topaz Grabber = Flawed Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Topaz Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Amethyst Grabber = Flawed Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Amethyst Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Diamond Grabber = Flawed Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Diamond Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Emerald Grabber = Flawed Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Emerald Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Ruby Grabber = Flawed Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Ruby Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Skull Grabber = Flawed Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Skull Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Flawed Sapphire Grabber = Flawed Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flawed Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Flawed Sapphire Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Topaz Grabber = Chipped Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Topaz Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Amethyst Grabber = Chipped Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Amethyst Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Diamond Grabber = Chipped Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Diamond Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Emerald Grabber = Chipped Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Emerald Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Ruby Grabber = Chipped Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Ruby Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Skull Grabber = Chipped Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Skull Grabber = Gem Bag"
  },
  {
    Description: "TRANSFER OUT GEM - Gem Bag + Chipped Sapphire Grabber = Chipped Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Chipped Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Chipped Sapphire Grabber = Gem Bag"
  },
  {
    Description: "CRAFT ITEM GEM BAG - All Chipped Gems = Gem Bag",
    Item: null,
    Output: "Gem Bag",
    Input: "Chipped Topaz + Chipped Amethyst + Chipped Diamond + Chipped Emerald + Chipped Ruby + Chipped Skull + Chipped Sapphire ",
    CubeRecipeDescription: "Chipped Topaz + Chipped Amethyst + Chipped Diamond + Chipped Emerald + Chipped Ruby + Chipped Skull + Chipped Sapphire = Gem Bag"
  },
  {
    Description: "CHANGE GRABBER - Chipped Topaz Grabber = Flawed Topaz Grabber",
    Item: null,
    Output: "Flawed Topaz Grabber",
    Input: "Chipped Topaz Grabber ",
    CubeRecipeDescription: "Chipped Topaz Grabber = Flawed Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Topaz Grabber = Topaz Grabber",
    Item: null,
    Output: "Topaz Grabber",
    Input: "Flawed Topaz Grabber ",
    CubeRecipeDescription: "Flawed Topaz Grabber = Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Topaz Grabber = Flawless Topaz Grabber",
    Item: null,
    Output: "Flawless Topaz Grabber",
    Input: "Topaz Grabber ",
    CubeRecipeDescription: "Topaz Grabber = Flawless Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Topaz Grabber = Perfect Topaz Grabber",
    Item: null,
    Output: "Perfect Topaz Grabber",
    Input: "Flawless Topaz Grabber ",
    CubeRecipeDescription: "Flawless Topaz Grabber = Perfect Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Topaz Grabber = Chipped Topaz Grabber",
    Item: null,
    Output: "Chipped Topaz Grabber",
    Input: "Perfect Topaz Grabber ",
    CubeRecipeDescription: "Perfect Topaz Grabber = Chipped Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Sapphire Grabber = Flawed Sapphire Grabber",
    Item: null,
    Output: "Flawed Sapphire Grabber",
    Input: "Chipped Sapphire Grabber ",
    CubeRecipeDescription: "Chipped Sapphire Grabber = Flawed Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Sapphire Grabber = Sapphire Grabber",
    Item: null,
    Output: "Sapphire Grabber",
    Input: "Flawed Sapphire Grabber ",
    CubeRecipeDescription: "Flawed Sapphire Grabber = Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Sapphire Grabber = Flawless Sapphire Grabber",
    Item: null,
    Output: "Flawless Sapphire Grabber",
    Input: "Sapphire Grabber ",
    CubeRecipeDescription: "Sapphire Grabber = Flawless Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Sapphire Grabber = Perfect Sapphire Grabber",
    Item: null,
    Output: "Perfect Sapphire Grabber",
    Input: "Flawless Sapphire Grabber ",
    CubeRecipeDescription: "Flawless Sapphire Grabber = Perfect Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Sapphire Grabber = Chipped Sapphire Grabber",
    Item: null,
    Output: "Chipped Sapphire Grabber",
    Input: "Perfect Sapphire Grabber ",
    CubeRecipeDescription: "Perfect Sapphire Grabber = Chipped Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Ruby Grabber = Flawed Ruby Grabber",
    Item: null,
    Output: "Flawed Ruby Grabber",
    Input: "Chipped Ruby Grabber ",
    CubeRecipeDescription: "Chipped Ruby Grabber = Flawed Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Ruby Grabber = Ruby Grabber",
    Item: null,
    Output: "Ruby Grabber",
    Input: "Flawed Ruby Grabber ",
    CubeRecipeDescription: "Flawed Ruby Grabber = Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Ruby Grabber = Flawless Ruby Grabber",
    Item: null,
    Output: "Flawless Ruby Grabber",
    Input: "Ruby Grabber ",
    CubeRecipeDescription: "Ruby Grabber = Flawless Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Ruby Grabber = Perfect Ruby Grabber",
    Item: null,
    Output: "Perfect Ruby Grabber",
    Input: "Flawless Ruby Grabber ",
    CubeRecipeDescription: "Flawless Ruby Grabber = Perfect Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Ruby Grabber = Chipped Ruby Grabber",
    Item: null,
    Output: "Chipped Ruby Grabber",
    Input: "Perfect Ruby Grabber ",
    CubeRecipeDescription: "Perfect Ruby Grabber = Chipped Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Emerald Grabber = Flawed Emerald Grabber",
    Item: null,
    Output: "Flawed Emerald Grabber",
    Input: "Chipped Emerald Grabber ",
    CubeRecipeDescription: "Chipped Emerald Grabber = Flawed Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Emerald Grabber = Emerald Grabber",
    Item: null,
    Output: "Emerald Grabber",
    Input: "Flawed Emerald Grabber ",
    CubeRecipeDescription: "Flawed Emerald Grabber = Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Emerald Grabber = Flawless Emerald Grabber",
    Item: null,
    Output: "Flawless Emerald Grabber",
    Input: "Emerald Grabber ",
    CubeRecipeDescription: "Emerald Grabber = Flawless Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Emerald Grabber = Perfect Emerald Grabber",
    Item: null,
    Output: "Perfect Emerald Grabber",
    Input: "Flawless Emerald Grabber ",
    CubeRecipeDescription: "Flawless Emerald Grabber = Perfect Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Emerald Grabber = Chipped Emerald Grabber",
    Item: null,
    Output: "Chipped Emerald Grabber",
    Input: "Perfect Emerald Grabber ",
    CubeRecipeDescription: "Perfect Emerald Grabber = Chipped Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Diamond Grabber = Flawed Diamond Grabber",
    Item: null,
    Output: "Flawed Diamond Grabber",
    Input: "Chipped Diamond Grabber ",
    CubeRecipeDescription: "Chipped Diamond Grabber = Flawed Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Diamond Grabber = Diamond Grabber",
    Item: null,
    Output: "Diamond Grabber",
    Input: "Flawed Diamond Grabber ",
    CubeRecipeDescription: "Flawed Diamond Grabber = Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Diamond Grabber = Flawless Diamond Grabber",
    Item: null,
    Output: "Flawless Diamond Grabber",
    Input: "Diamond Grabber ",
    CubeRecipeDescription: "Diamond Grabber = Flawless Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Diamond Grabber = Perfect Diamond Grabber",
    Item: null,
    Output: "Perfect Diamond Grabber",
    Input: "Flawless Diamond Grabber ",
    CubeRecipeDescription: "Flawless Diamond Grabber = Perfect Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Diamond Grabber = Chipped Diamond Grabber",
    Item: null,
    Output: "Chipped Diamond Grabber",
    Input: "Perfect Diamond Grabber ",
    CubeRecipeDescription: "Perfect Diamond Grabber = Chipped Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Skull Grabber = Flawed Skull Grabber",
    Item: null,
    Output: "Flawed Skull Grabber",
    Input: "Chipped Skull Grabber ",
    CubeRecipeDescription: "Chipped Skull Grabber = Flawed Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Skull Grabber = Skull Grabber",
    Item: null,
    Output: "Skull Grabber",
    Input: "Flawed Skull Grabber ",
    CubeRecipeDescription: "Flawed Skull Grabber = Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Skull Grabber = Flawless Skull Grabber",
    Item: null,
    Output: "Flawless Skull Grabber",
    Input: "Skull Grabber ",
    CubeRecipeDescription: "Skull Grabber = Flawless Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Skull Grabber = Perfect Skull Grabber",
    Item: null,
    Output: "Perfect Skull Grabber",
    Input: "Flawless Skull Grabber ",
    CubeRecipeDescription: "Flawless Skull Grabber = Perfect Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Skull Grabber = Chipped Skull Grabber",
    Item: null,
    Output: "Chipped Skull Grabber",
    Input: "Perfect Skull Grabber ",
    CubeRecipeDescription: "Perfect Skull Grabber = Chipped Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Amethyst Grabber = Flawed Amethyst Grabber",
    Item: null,
    Output: "Flawed Amethyst Grabber",
    Input: "Chipped Amethyst Grabber ",
    CubeRecipeDescription: "Chipped Amethyst Grabber = Flawed Amethyst Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawed Amethyst Grabber = Amethyst Grabber",
    Item: null,
    Output: "Amethyst Grabber",
    Input: "Flawed Amethyst Grabber ",
    CubeRecipeDescription: "Flawed Amethyst Grabber = Amethyst Grabber"
  },
  {
    Description: "CHANGE GRABBER - Amethyst Grabber = Flawless Amethyst Grabber",
    Item: null,
    Output: "Flawless Amethyst Grabber",
    Input: "Amethyst Grabber ",
    CubeRecipeDescription: "Amethyst Grabber = Flawless Amethyst Grabber"
  },
  {
    Description: "CHANGE GRABBER - Flawless Amethyst Grabber = Perfect Amethyst Grabber",
    Item: null,
    Output: "Perfect Amethyst Grabber",
    Input: "Flawless Amethyst Grabber ",
    CubeRecipeDescription: "Flawless Amethyst Grabber = Perfect Amethyst Grabber"
  },
  {
    Description: "CHANGE GRABBER - Perfect Amethyst Grabber = Chipped Amethyst Grabber",
    Item: null,
    Output: "Chipped Amethyst Grabber",
    Input: "Perfect Amethyst Grabber ",
    CubeRecipeDescription: "Perfect Amethyst Grabber = Chipped Amethyst Grabber"
  },
  {
    Description: "CHANGE GRABBER - CHANGE GRABBER - Chipped Topaz = Chipped Topaz Grabber",
    Item: null,
    Output: "Chipped Topaz Grabber",
    Input: "Chipped Topaz ",
    CubeRecipeDescription: "Chipped Topaz = Chipped Topaz Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Sapphire = Chipped Sapphire Grabber",
    Item: null,
    Output: "Chipped Sapphire Grabber",
    Input: "Chipped Sapphire ",
    CubeRecipeDescription: "Chipped Sapphire = Chipped Sapphire Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Ruby = Chipped Ruby Grabber",
    Item: null,
    Output: "Chipped Ruby Grabber",
    Input: "Chipped Ruby ",
    CubeRecipeDescription: "Chipped Ruby = Chipped Ruby Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Skull = Chipped Skull Grabber",
    Item: null,
    Output: "Chipped Skull Grabber",
    Input: "Chipped Skull ",
    CubeRecipeDescription: "Chipped Skull = Chipped Skull Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Emerald = Chipped Emerald Grabber",
    Item: null,
    Output: "Chipped Emerald Grabber",
    Input: "Chipped Emerald ",
    CubeRecipeDescription: "Chipped Emerald = Chipped Emerald Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Diamond = Chipped Diamond Grabber",
    Item: null,
    Output: "Chipped Diamond Grabber",
    Input: "Chipped Diamond ",
    CubeRecipeDescription: "Chipped Diamond = Chipped Diamond Grabber"
  },
  {
    Description: "CHANGE GRABBER - Chipped Amethyst = Chipped Amethyst Grabber",
    Item: null,
    Output: "Chipped Amethyst Grabber",
    Input: "Chipped Amethyst ",
    CubeRecipeDescription: "Chipped Amethyst = Chipped Amethyst Grabber"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Occam's Razor + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Occam's Razor",
    Input: "Occam's Razor + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Occam's Razor + Scroll Of Identify + Scroll Of Town Portal = Occam's Razor"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Curseweaver + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Curseweaver",
    Input: "Curseweaver + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Curseweaver + Scroll Of Identify + Scroll Of Town Portal = Curseweaver"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Eater of Souls + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Eater of Souls",
    Input: "Eater of Souls + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Eater Of Souls + Scroll Of Identify + Scroll Of Town Portal = Eater Of Souls"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Stunhummer + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Stunhummer",
    Input: "Stunhummer + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Stunhummer + Scroll Of Identify + Scroll Of Town Portal = Stunhummer"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Spiritcrusher + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Spirit Crusher",
    Input: "Spirit Crusher + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Spirit Crusher + Scroll Of Identify + Scroll Of Town Portal = Spirit Crusher"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Readiness for War + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Readiness for War",
    Input: "Readiness for War + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Readiness For War + Scroll Of Identify + Scroll Of Town Portal = Readiness For War"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Shattered Dreams + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Shattered Dreams",
    Input: "Shattered Dreams + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Shattered Dreams + Scroll Of Identify + Scroll Of Town Portal = Shattered Dreams"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Ruemonger + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Ruemonger",
    Input: "Ruemonger + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Ruemonger + Scroll Of Identify + Scroll Of Town Portal = Ruemonger"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Jouster's Boast + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Jouster's Boast",
    Input: "Jouster's Boast + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Jouster's Boast + Scroll Of Identify + Scroll Of Town Portal = Jouster's Boast"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Cadin'Sor + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Cadin'Sor",
    Input: "Cadin'Sor + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Cadin'sor + Scroll Of Identify + Scroll Of Town Portal = Cadin'sor"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Gnomebane + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Gnomebane",
    Input: "Gnomebane + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Gnomebane + Scroll Of Identify + Scroll Of Town Portal = Gnomebane"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Shieldmaiden's Shield + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Shieldmaiden's Pavise",
    Input: "Shieldmaiden's Pavise + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Shieldmaiden's Pavise + Scroll Of Identify + Scroll Of Town Portal = Shieldmaiden's Pavise"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Murder's Mistress + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Murder's Mistress",
    Input: "Murder's Mistress + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Murder's Mistress + Scroll Of Identify + Scroll Of Town Portal = Murder's Mistress"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Ravings of the Mad + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Ravings of the Mad",
    Input: "Ravings of the Mad + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Ravings Of The Mad + Scroll Of Identify + Scroll Of Town Portal = Ravings Of The Mad"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Simpering Edge + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Simpering Edge",
    Input: "Simpering Edge + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Simpering Edge + Scroll Of Identify + Scroll Of Town Portal = Simpering Edge"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Moonlight Edge + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Moonlight Edge",
    Input: "Moonlight Edge + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Moonlight Edge + Scroll Of Identify + Scroll Of Town Portal = Moonlight Edge"
  },
  {
    Description: "UPGRADE UNIQUE LEVEL - Titan's Reach + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Titan's Reach",
    Input: "Titan's Reach + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Titan's Reach + Scroll Of Identify + Scroll Of Town Portal = Titan's Reach"
  },
  {
    Description: "UPGRADE SET LEVEL - Set12.2 + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Bound by Honor",
    Input: "Bound by Honor + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Bound By Honor + Scroll Of Identify + Scroll Of Town Portal = Bound By Honor"
  },
  {
    Description: "UPGRADE SET LEVEL - Set15.1 + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Holy Shroud of Amaunator",
    Input: "Holy Shroud of Amaunator + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Holy Shroud Of Amaunator + Scroll Of Identify + Scroll Of Town Portal = Holy Shroud Of Amaunator"
  },
  {
    Description: "UPGRADE SET LEVEL - Set16.4 + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Girdle of Kitthix",
    Input: "Girdle of Kitthix + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Girdle Of Kitthix + Scroll Of Identify + Scroll Of Town Portal = Girdle Of Kitthix"
  },
  {
    Description: "UPGRADE SET LEVEL - Set16.5 + scroll of TP + scroll of ID = updated item",
    Item: null,
    Output: "Gauntlets of Quietus",
    Input: "Gauntlets of Quietus + Scroll of Identify + Scroll of Town Portal ",
    CubeRecipeDescription: "Gauntlets Of Quietus + Scroll Of Identify + Scroll Of Town Portal = Gauntlets Of Quietus"
  },
  {
    Description: "UPGRADE SET QUALITY - 1 Ral Rune + 1 Sol Rune + 1 Perfect Emerald + 1 Normal Set Weapon = Exceptional Set Weapon",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Set Weapon + Ral Rune + Sol Rune + Perfect Emerald ",
    CubeRecipeDescription: "Basic Set Weapon + Ral Rune + Sol Rune + Perfect Emerald = Exceptional Weapon"
  },
  {
    Description: "UPGRADE SET QUALITY - 1 Tal Rune + 1 Shael Rune + 1 Perfect Diamond + 1 Normal Set Armor = Exceptional Set Armor",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Set Any Armor + Tal Rune + Shael Rune + Perfect Diamond ",
    CubeRecipeDescription: "Basic Set Any Armor + Tal Rune + Shael Rune + Perfect Diamond = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE SET QUALITY - 1 Lum Rune + 1 Pul Rune + 1 Perfect Emerald + 1 Exceptional Set Weapon = Elite Set Weapon",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Set Weapon + Lum Rune + Pul Rune + Perfect Emerald ",
    CubeRecipeDescription: "Exceptional Set Weapon + Lum Rune + Pul Rune + Perfect Emerald = Elite Weapon"
  },
  {
    Description: "UPGRADE SET QUALITY - 1 Ko Rune + 1 Lem Rune + 1 Perfect Diamond + 1 Exceptional Set Armor = Elite Set Armor",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Set Any Armor + Ko Rune + Lem Rune + Perfect Diamond ",
    CubeRecipeDescription: "Exceptional Set Any Armor + Ko Rune + Lem Rune + Perfect Diamond = Elite Any Armor"
  },
  {
    Description: "UPGRADE CHARM TIER - 1 t1 Splash Charm + 1 any chipped gem = 1 t2 Splash Charm",
    Item: null,
    Output: "Collin's Fury",
    Input: "Collin's Might + Chipped Gem ",
    CubeRecipeDescription: "Collin's Might + Chipped Gem = Collin's Fury"
  },
  {
    Description: "UPGRADE CHARM TIER - 1 t2 Splash Charm + 1 El-Rune + 1 any flawed gem  = 1 t3 Splash Charm",
    Item: null,
    Output: "Collin's Devastation",
    Input: "Collin's Fury + El Rune + Flawed Gem ",
    CubeRecipeDescription: "Collin's Fury + El Rune + Flawed Gem = Collin's Devastation"
  },
  {
    Description: "UPGRADE CHARM TIER - 1 t3 Splash Charm + 1 Ort-Rune + 1 any flawless gem = 1 t4 Splash Charm",
    Item: null,
    Output: "Tier 4 Splash Charm",
    Input: "Collin's Devastation + Ort Rune + Flawless Gem ",
    CubeRecipeDescription: "Collin's Devastation + Ort Rune + Flawless Gem = Tier 4 Splash Charm"
  },
  {
    Description: "UPGRADE CHARM TIER - 1 t4 Splash Charm + 1 Shael-Rune + 2 any perfect gem + 1 magic jewel = 1 t5 Splash Charm",
    Item: null,
    Output: "Tier 5 Splash Charm",
    Input: "Tier 4 Splash Charm + Shael Rune + 2 Perfect Gem + Magic Jewel ",
    CubeRecipeDescription: "Tier 4 Splash Charm + Shael Rune + 2 Perfect Gem + Magic Jewel = Tier 5 Splash Charm"
  },
  {
    Description: "UPGRADE CHARM TIER - 1 t5 Splash Charm + 1 Io-Rune + 3 any perfect gem + 2 magic jewels = 1 t6 Splash Charm",
    Item: null,
    Output: "Tier 6 Splash Charm",
    Input: "Tier 5 Splash Charm + Io Rune + 3 Perfect Gem + 2 Magic Jewel ",
    CubeRecipeDescription: "Tier 5 Splash Charm + Io Rune + 3 Perfect Gem + 2 Magic Jewel = Tier 6 Splash Charm"
  },
  {
    Description: "SOCKET ARMOR ANY - 1 Orb of Socketing + 1 Armor = Random # of Sockets",
    Item: null,
    Output: "Socketed Any Armor",
    Input: "Any Armor + Orb of Socketing ",
    CubeRecipeDescription: "Any Armor + Orb Of Socketing = Socketed Any Armor"
  },
  {
    Description: "SOCKET SHIELD ANY - 1 Orb of Socketing + 1 Shield = Random # of Sockets",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Any Shield + Orb of Socketing ",
    CubeRecipeDescription: "Any Shield + Orb Of Socketing = Socketed Any Shield"
  },
  {
    Description: "SOCKET WEAPON ANY - 1 Orb of Socketing + 1 Weapon = Random # of Sockets",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + Orb of Socketing ",
    CubeRecipeDescription: "Weapon + Orb Of Socketing = Socketed Weapon"
  },
  {
    Description: "UPGRADE ARMOR RARITY - 1 Orb of Conversion + 1 Rare Armor(Chest, Helm, Gloves, Boots,OR Belt) = Unique Armor",
    Item: null,
    Output: "Unique Any Armor",
    Input: "Rare Any Armor + Orb of Conversion ",
    CubeRecipeDescription: "Rare Any Armor + Orb Of Conversion = Unique Any Armor"
  },
  {
    Description: "UPGRADE SHIELD RARITY - 1 Orb of Conversion + 1 Rare Shield = Unique Shield",
    Item: null,
    Output: "Unique Any Shield",
    Input: "Rare Any Shield + Orb of Conversion ",
    CubeRecipeDescription: "Rare Any Shield + Orb Of Conversion = Unique Any Shield"
  },
  {
    Description: "UPGRADE WEAPON RARITY - 1 Orb of Conversion + 1 Rare Weapon = Unique Weapon",
    Item: null,
    Output: "Unique Weapon",
    Input: "Rare Weapon + Orb of Conversion ",
    CubeRecipeDescription: "Rare Weapon + Orb Of Conversion = Unique Weapon"
  },
  {
    Description: "UPGRADE AMULET RARITY - 1 Orb of Conversion + 1 Rare Amulet = Unique Amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Rare Amulet + Orb of Conversion ",
    CubeRecipeDescription: "Rare Amulet + Orb Of Conversion = Unique Amulet"
  },
  {
    Description: "UPGRADE RING RARITY - 1 Orb of Conversion + 1 Rare Ring = Unique Ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Rare Ring + Orb of Conversion ",
    CubeRecipeDescription: "Rare Ring + Orb Of Conversion = Unique Ring"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Low Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Low Quality Merc Equip + Magic Jewel ",
    CubeRecipeDescription: "Low Quality Merc Equip + Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Normal Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Normal Merc Equip + Magic Jewel ",
    CubeRecipeDescription: "Normal Merc Equip + Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm High Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Merc Equip + Magic Jewel ",
    CubeRecipeDescription: "Merc Equip + Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Magic",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Magic Merc Equip + Magic Jewel ",
    CubeRecipeDescription: "Magic Merc Equip + Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Rare",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Rare Merc Equip + Rare Jewel ",
    CubeRecipeDescription: "Rare Merc Equip + Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Set",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Set Merc Equip + Rare Jewel ",
    CubeRecipeDescription: "Set Merc Equip + Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Helm Unique",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Unique Merc Equip + Unique Jewel ",
    CubeRecipeDescription: "Unique Merc Equip + Unique Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Low Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Low Quality Merc Equip + 2 Magic Jewel ",
    CubeRecipeDescription: "Low Quality Merc Equip + 2 Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Normal Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Normal Merc Equip + 2 Magic Jewel ",
    CubeRecipeDescription: "Normal Merc Equip + 2 Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm High Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Merc Equip + 2 Magic Jewel ",
    CubeRecipeDescription: "Merc Equip + 2 Magic Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Magic",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Magic Merc Equip + 2 Jewel ",
    CubeRecipeDescription: "Magic Merc Equip + 2 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Rare",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Rare Merc Equip + 2 Rare Jewel ",
    CubeRecipeDescription: "Rare Merc Equip + 2 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Set",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Set Merc Equip + 2 Rare Jewel ",
    CubeRecipeDescription: "Set Merc Equip + 2 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 2 - Helm Unique",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Unique Merc Equip + 2 Unique Jewel ",
    CubeRecipeDescription: "Unique Merc Equip + 2 Unique Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Low Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Low Quality Merc Equip + 3 Jewel ",
    CubeRecipeDescription: "Low Quality Merc Equip + 3 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Normal Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Normal Merc Equip + 3 Jewel ",
    CubeRecipeDescription: "Normal Merc Equip + 3 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm High Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Merc Equip + 3 Jewel ",
    CubeRecipeDescription: "Merc Equip + 3 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Magic",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Magic Merc Equip + 3 Jewel ",
    CubeRecipeDescription: "Magic Merc Equip + 3 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Rare",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Rare Merc Equip + 3 Rare Jewel ",
    CubeRecipeDescription: "Rare Merc Equip + 3 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Set",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Set Merc Equip + 3 Rare Jewel ",
    CubeRecipeDescription: "Set Merc Equip + 3 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 3 - Helm Unique",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Unique Merc Equip + 3 Unique Jewel ",
    CubeRecipeDescription: "Unique Merc Equip + 3 Unique Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Low Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Low Quality Merc Equip + 4 Jewel ",
    CubeRecipeDescription: "Low Quality Merc Equip + 4 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Normal Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Normal Merc Equip + 4 Jewel ",
    CubeRecipeDescription: "Normal Merc Equip + 4 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm High Quality",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Merc Equip + 4 Jewel ",
    CubeRecipeDescription: "Merc Equip + 4 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Magic",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Magic Merc Equip + 4 Jewel ",
    CubeRecipeDescription: "Magic Merc Equip + 4 Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Rare",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Rare Merc Equip + 4 Rare Jewel ",
    CubeRecipeDescription: "Rare Merc Equip + 4 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Set",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Set Merc Equip + 4 Rare Jewel ",
    CubeRecipeDescription: "Set Merc Equip + 4 Rare Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 4 - Helm Unique",
    Item: null,
    Output: "Socketed Merc Equip",
    Input: "Unique Merc Equip + 4 Unique Jewel ",
    CubeRecipeDescription: "Unique Merc Equip + 4 Unique Jewel = Socketed Merc Equip"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + Magic Jewel ",
    CubeRecipeDescription: "Low Quality Armor + Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + Magic Jewel ",
    CubeRecipeDescription: "Normal Armor + Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + Magic Jewel ",
    CubeRecipeDescription: "Armor + Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + Magic Jewel ",
    CubeRecipeDescription: "Magic Armor + Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + Rare Jewel ",
    CubeRecipeDescription: "Set Armor + Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + Unique Jewel ",
    CubeRecipeDescription: "Unique Armor + Unique Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + 2 Magic Jewel ",
    CubeRecipeDescription: "Low Quality Armor + 2 Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + 2 Magic Jewel ",
    CubeRecipeDescription: "Normal Armor + 2 Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + 2 Magic Jewel ",
    CubeRecipeDescription: "Armor + 2 Magic Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + 2 Jewel ",
    CubeRecipeDescription: "Magic Armor + 2 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + 2 Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + 2 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + 2 Rare Jewel ",
    CubeRecipeDescription: "Set Armor + 2 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 2 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + 2 Unique Jewel ",
    CubeRecipeDescription: "Unique Armor + 2 Unique Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + 3 Jewel ",
    CubeRecipeDescription: "Low Quality Armor + 3 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + 3 Jewel ",
    CubeRecipeDescription: "Normal Armor + 3 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + 3 Jewel ",
    CubeRecipeDescription: "Armor + 3 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + 3 Jewel ",
    CubeRecipeDescription: "Magic Armor + 3 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + 3 Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + 3 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + 3 Rare Jewel ",
    CubeRecipeDescription: "Set Armor + 3 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 3 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + 3 Unique Jewel ",
    CubeRecipeDescription: "Unique Armor + 3 Unique Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + 4 Jewel ",
    CubeRecipeDescription: "Low Quality Armor + 4 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + 4 Jewel ",
    CubeRecipeDescription: "Normal Armor + 4 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + 4 Jewel ",
    CubeRecipeDescription: "Armor + 4 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + 4 Jewel ",
    CubeRecipeDescription: "Magic Armor + 4 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + 4 Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + 4 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + 4 Rare Jewel ",
    CubeRecipeDescription: "Set Armor + 4 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 4 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + 4 Unique Jewel ",
    CubeRecipeDescription: "Unique Armor + 4 Unique Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + 5 Jewel ",
    CubeRecipeDescription: "Low Quality Armor + 5 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + 5 Jewel ",
    CubeRecipeDescription: "Normal Armor + 5 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + 5 Jewel ",
    CubeRecipeDescription: "Armor + 5 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + 5 Jewel ",
    CubeRecipeDescription: "Magic Armor + 5 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + 5 Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + 5 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + 5 Rare Jewel ",
    CubeRecipeDescription: "Set Armor + 5 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 5 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + 5 Rare Jewel ",
    CubeRecipeDescription: "Unique Armor + 5 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Low Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Low Quality Armor + 6 Jewel ",
    CubeRecipeDescription: "Low Quality Armor + 6 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Normal Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Normal Armor + 6 Jewel ",
    CubeRecipeDescription: "Normal Armor + 6 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor High Quality",
    Item: null,
    Output: "Socketed Armor",
    Input: "Armor + 6 Jewel ",
    CubeRecipeDescription: "Armor + 6 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Magic",
    Item: null,
    Output: "Socketed Armor",
    Input: "Magic Armor + 6 Jewel ",
    CubeRecipeDescription: "Magic Armor + 6 Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Rare",
    Item: null,
    Output: "Socketed Armor",
    Input: "Rare Armor + 6 Rare Jewel ",
    CubeRecipeDescription: "Rare Armor + 6 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Set",
    Item: null,
    Output: "Socketed Armor",
    Input: "Set Armor + 6 Rare Jewel ",
    CubeRecipeDescription: "Set Armor + 6 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 6 - Body Armor Unique",
    Item: null,
    Output: "Socketed Armor",
    Input: "Unique Armor + 6 Rare Jewel ",
    CubeRecipeDescription: "Unique Armor + 6 Rare Jewel = Socketed Armor"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield low Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Low Quality Any Shield + Magic Jewel ",
    CubeRecipeDescription: "Low Quality Any Shield + Magic Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield Normal Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Normal Any Shield + Magic Jewel ",
    CubeRecipeDescription: "Normal Any Shield + Magic Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield High Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Any Shield + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Magic Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield Magic",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Magic Any Shield + Magic Jewel ",
    CubeRecipeDescription: "Magic Any Shield + Magic Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield Rare",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Rare Any Shield + Rare Jewel ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield Set",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Set Any Shield + Rare Jewel ",
    CubeRecipeDescription: "Set Any Shield + Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Shield Unique",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Unique Any Shield + Unique Jewel ",
    CubeRecipeDescription: "Unique Any Shield + Unique Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Low Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Low Quality Any Shield + 2 Jewel ",
    CubeRecipeDescription: "Low Quality Any Shield + 2 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Normal Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Normal Any Shield + 2 Jewel ",
    CubeRecipeDescription: "Normal Any Shield + 2 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield High Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Any Shield + 2 Jewel ",
    CubeRecipeDescription: "Any Shield + 2 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Magic",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Magic Any Shield + 2 Jewel ",
    CubeRecipeDescription: "Magic Any Shield + 2 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Rare",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Rare Any Shield + 2 Rare Jewel ",
    CubeRecipeDescription: "Rare Any Shield + 2 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Set",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Set Any Shield + 2 Rare Jewel ",
    CubeRecipeDescription: "Set Any Shield + 2 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 2 - Shield Unique",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Unique Any Shield + 2 Unique Jewel ",
    CubeRecipeDescription: "Unique Any Shield + 2 Unique Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield low Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Low Quality Any Shield + 3 Jewel ",
    CubeRecipeDescription: "Low Quality Any Shield + 3 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield Normal Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Normal Any Shield + 3 Jewel ",
    CubeRecipeDescription: "Normal Any Shield + 3 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield high Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Any Shield + 3 Jewel ",
    CubeRecipeDescription: "Any Shield + 3 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield Magic",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Magic Any Shield + 3 Jewel ",
    CubeRecipeDescription: "Magic Any Shield + 3 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield Rare",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Rare Any Shield + 3 Rare Jewel ",
    CubeRecipeDescription: "Rare Any Shield + 3 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield Set",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Set Any Shield + 3 Rare Jewel ",
    CubeRecipeDescription: "Set Any Shield + 3 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 3 - Shield Unique",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Unique Any Shield + 3 Unique Jewel ",
    CubeRecipeDescription: "Unique Any Shield + 3 Unique Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Low Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Low Quality Any Shield + 4 Jewel ",
    CubeRecipeDescription: "Low Quality Any Shield + 4 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Normal Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Normal Any Shield + 4 Jewel ",
    CubeRecipeDescription: "Normal Any Shield + 4 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield High Quality",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Any Shield + 4 Jewel ",
    CubeRecipeDescription: "Any Shield + 4 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Magic",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Magic Any Shield + 4 Jewel ",
    CubeRecipeDescription: "Magic Any Shield + 4 Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Rare",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Rare Any Shield + 4 Rare Jewel ",
    CubeRecipeDescription: "Rare Any Shield + 4 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Set",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Set Any Shield + 4 Rare Jewel ",
    CubeRecipeDescription: "Set Any Shield + 4 Rare Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 4 - Shield Unique",
    Item: null,
    Output: "Socketed Any Shield",
    Input: "Unique Any Shield + 4 Unique Jewel ",
    CubeRecipeDescription: "Unique Any Shield + 4 Unique Jewel = Socketed Any Shield"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + Magic Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + Magic Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Normal Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + Magic Jewel ",
    CubeRecipeDescription: "Normal Weapon + Magic Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + Magic Jewel ",
    CubeRecipeDescription: "Weapon + Magic Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + Magic Jewel ",
    CubeRecipeDescription: "Magic Weapon + Magic Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 1 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + Unique Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + 2 Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + 2 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Normal Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + 2 Jewel ",
    CubeRecipeDescription: "Normal Weapon + 2 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + 2 Jewel ",
    CubeRecipeDescription: "Weapon + 2 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + 2 Jewel ",
    CubeRecipeDescription: "Magic Weapon + 2 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + 2 Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + 2 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + 2 Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + 2 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 2 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + 2 Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + 2 Unique Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + 3 Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + 3 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Normal Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + 3 Jewel ",
    CubeRecipeDescription: "Normal Weapon + 3 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + 3 Jewel ",
    CubeRecipeDescription: "Weapon + 3 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + 3 Jewel ",
    CubeRecipeDescription: "Magic Weapon + 3 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + 3 Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + 3 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + 3 Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + 3 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 3 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + 3 Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + 3 Unique Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + 4 Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + 4 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Normal Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + 4 Jewel ",
    CubeRecipeDescription: "Normal Weapon + 4 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + 4 Jewel ",
    CubeRecipeDescription: "Weapon + 4 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + 4 Jewel ",
    CubeRecipeDescription: "Magic Weapon + 4 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + 4 Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + 4 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + 4 Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + 4 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 4 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + 4 Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + 4 Unique Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + 5 Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + 5 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Normal Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + 5 Jewel ",
    CubeRecipeDescription: "Normal Weapon + 5 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + 5 Jewel ",
    CubeRecipeDescription: "Weapon + 5 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + 5 Jewel ",
    CubeRecipeDescription: "Magic Weapon + 5 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + 5 Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + 5 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + 5 Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + 5 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 5 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + 5 Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + 5 Unique Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Low Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Low Quality Weapon + 6 Jewel ",
    CubeRecipeDescription: "Low Quality Weapon + 6 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Normal Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Normal Weapon + 6 Jewel ",
    CubeRecipeDescription: "Normal Weapon + 6 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon High Quality",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + 6 Jewel ",
    CubeRecipeDescription: "Weapon + 6 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Magic",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Magic Weapon + 6 Jewel ",
    CubeRecipeDescription: "Magic Weapon + 6 Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Rare",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Rare Weapon + 6 Rare Jewel ",
    CubeRecipeDescription: "Rare Weapon + 6 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Set",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Set Weapon + 6 Rare Jewel ",
    CubeRecipeDescription: "Set Weapon + 6 Rare Jewel = Socketed Weapon"
  },
  {
    Description: "SOCKET PUNCH - 6 - Weapon Unique",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Unique Weapon + 6 Unique Jewel ",
    CubeRecipeDescription: "Unique Weapon + 6 Unique Jewel = Socketed Weapon"
  },
  {
    Description: "MISC - Stack of 2 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "1 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 1 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 3 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "2 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 2 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 4 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "3 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 3 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 5 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "4 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 4 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 6 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "5 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 5 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 7 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "6 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 6 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 8 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "7 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 7 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 9 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "8 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 8 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 10 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "9 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 9 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 11 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "10 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 10 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 12 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "11 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 11 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 13 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "12 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 12 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 14 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "13 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 13 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 15 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "14 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 14 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 16 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "15 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 15 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 17 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "16 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 16 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 18 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "17 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 17 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 19 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "18 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 18 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 20 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "19 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 19 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 21 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "20 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 20 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 22 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "21 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 21 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 23 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "22 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 22 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 24 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "23 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 23 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 25 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "24 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 24 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 26 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "25 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 25 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 27 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "26 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 26 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 28 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "27 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 27 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 29 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "28 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 28 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 30 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "29 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 29 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 31 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "30 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 30 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 32 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "31 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 31 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 33 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "32 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 32 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 34 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "33 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 33 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 35 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "34 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 34 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 36 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "35 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 35 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 37 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "36 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 36 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 38 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "37 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 37 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 39 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "38 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 38 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 40 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "39 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 39 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 41 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "40 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 40 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 42 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "41 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 41 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 43 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "42 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 42 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 44 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "43 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 43 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 45 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "44 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 44 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 46 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "45 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 45 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 47 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "46 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 46 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 48 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "47 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 47 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 49 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "48 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 48 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 50 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "49 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 49 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 51 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "50 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 50 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 52 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "51 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 51 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 53 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "52 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 52 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 54 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "53 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 53 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 55 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "54 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 54 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 56 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "55 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 55 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 57 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "56 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 56 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 58 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "57 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 57 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 59 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "58 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 58 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 60 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "59 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 59 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 61 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "60 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 60 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 62 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "61 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 61 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 63 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "62 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 62 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 64 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "63 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 63 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 65 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "64 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 64 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 66 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "65 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 65 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 67 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "66 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 66 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 68 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "67 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 67 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 69 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "68 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 68 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 70 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "69 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 69 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 71 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "70 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 70 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 72 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "71 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 71 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 73 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "72 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 72 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 74 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "73 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 73 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 75 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "74 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 74 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 76 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "75 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 75 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 77 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "76 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 76 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 78 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "77 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 77 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 79 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "78 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 78 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 80 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "79 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 79 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 81 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "80 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 80 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 82 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "81 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 81 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 83 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "82 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 82 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 84 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "83 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 83 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 85 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "84 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 84 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 86 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "85 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 85 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 87 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "86 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 86 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 88 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "87 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 87 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 89 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "88 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 88 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 90 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "89 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 89 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 91 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "90 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 90 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 92 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "91 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 91 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 93 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "92 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 92 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 94 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "93 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 93 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 95 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "94 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 94 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 96 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "95 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 95 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 97 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "96 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 96 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 98 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "97 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 97 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 99 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "98 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 98 Miscellaneous"
  },
  {
    Description: "MISC - Stack of 100 Misc (any) = Stack-1 + Single Misc",
    Item: null,
    Output: "99 Miscellaneous",
    Input: "Miscellaneous ",
    CubeRecipeDescription: "Miscellaneous = 99 Miscellaneous"
  }
];
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
var _handleSearchChanged_dec, _search_dec, _CubeRecipes_decorators, _init;
_CubeRecipes_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _handleSearchChanged_dec = [watch("search")];
class CubeRecipes {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "recipes", [...json]);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "_debouncedSearchItem");
  }
  attached() {
    this._debouncedSearchItem = debounce(this.handleSearch.bind(this), 350);
  }
  handleSearchChanged() {
    this._debouncedSearchItem();
  }
  handleSearch() {
    if (!this.search) {
      this.recipes = json;
      return;
    }
    const found = [];
    for (const recipe of json) {
      if (!recipe.CubeRecipeDescription) {
        recipe.CubeRecipeDescription = "";
      }
      if (!recipe.Output) {
        recipe.Output = "";
      }
      if (!recipe.Description) {
        recipe.Description = "";
      }
      if (recipe.CubeRecipeDescription.toLowerCase().includes(this.search.toLowerCase()) || recipe.Output.toLowerCase().includes(this.search.toLowerCase()) || recipe.Description.toLowerCase().includes(this.search.toLowerCase())) {
        found.push(recipe);
      }
    }
    this.recipes = found;
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, CubeRecipes);
__decorateElement(_init, 5, "search", _search_dec, CubeRecipes);
CubeRecipes = __decorateElement(_init, 0, "CubeRecipes", _CubeRecipes_decorators, CubeRecipes);
__runInitializers(_init, 1, CubeRecipes);
export {
  CubeRecipes
};
