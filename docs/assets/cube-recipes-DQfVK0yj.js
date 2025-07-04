import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-BePQ-y0p.js";
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
    Description: "CONVERSION AMULET - 1 Orb of Conversion & 1 Rare Amulet = Unique Amulet",
    Item: null,
    Output: "Unique Amulet",
    Input: "Rare Amulet + Orb of Conversion ",
    CubeRecipeDescription: "Rare Amulet + Orb Of Conversion = Unique Amulet"
  },
  {
    Description: "CONVERSION ARMOR - 1 Orb of Conversion & 1 Rare Armor/Shield  = Unique Armor",
    Item: null,
    Output: "Unique Any Armor",
    Input: "Rare Any Armor + Orb of Conversion ",
    CubeRecipeDescription: "Rare Any Armor + Orb Of Conversion = Unique Any Armor"
  },
  {
    Description: "CONVERSION RING - 1 Orb of Conversion & 1 Rare Ring = Unique Ring",
    Item: null,
    Output: "Unique Ring",
    Input: "Rare Ring + Orb of Conversion ",
    CubeRecipeDescription: "Rare Ring + Orb Of Conversion = Unique Ring"
  },
  {
    Description: "CONVERSION WEAPON - 1 Orb of Conversion & 1 Rare Weapon = Unique Weapon",
    Item: null,
    Output: "Unique Weapon",
    Input: "Rare Weapon + Orb of Conversion ",
    CubeRecipeDescription: "Rare Weapon + Orb Of Conversion = Unique Weapon"
  },
  {
    Description: "ASSEMBLAGE AMULET - 1 Orb of Assemblage & 1 Rare Amulet = Set Amulet",
    Item: null,
    Output: "Set Amulet",
    Input: "Rare Amulet + Orb of Assemblage ",
    CubeRecipeDescription: "Rare Amulet + Orb Of Assemblage = Set Amulet"
  },
  {
    Description: "ASSEMBLAGE ARMOR - 1 Orb of Assemblage & 1 Rare Armor/Shield = Set Armor",
    Item: null,
    Output: "Set Any Armor",
    Input: "Rare Any Armor + Orb of Assemblage ",
    CubeRecipeDescription: "Rare Any Armor + Orb Of Assemblage = Set Any Armor"
  },
  {
    Description: "ASSEMBLAGE RING - 1 Orb of Assemblage & 1 Rare Ring = Set Ring",
    Item: null,
    Output: "Set Ring",
    Input: "Rare Ring + Orb of Assemblage ",
    CubeRecipeDescription: "Rare Ring + Orb Of Assemblage = Set Ring"
  },
  {
    Description: "ASSEMBLAGE WEAPON - 1 Orb of Assemblage & 1 Rare Weapon = Set Weapon",
    Item: null,
    Output: "Set Weapon",
    Input: "Rare Weapon + Orb of Assemblage ",
    CubeRecipeDescription: "Rare Weapon + Orb Of Assemblage = Set Weapon"
  },
  {
    Description: "SOCKET ARMOR/SHIELD - 1 Orb of Socketing & Armor/Shield = Random # of Sockets",
    Item: null,
    Output: "Socketed Any Armor",
    Input: "Any Armor + Orb of Socketing ",
    CubeRecipeDescription: "Any Armor + Orb Of Socketing = Socketed Any Armor"
  },
  {
    Description: "SOCKET WEAPON - 1 Orb of Socketing & 1 Weapon = Random # of Sockets",
    Item: null,
    Output: "Socketed Weapon",
    Input: "Weapon + Orb of Socketing ",
    CubeRecipeDescription: "Weapon + Orb Of Socketing = Socketed Weapon"
  },
  {
    Description: "SOCKET RETRIEVE - Jewel Pliers & Socketed Item = Unsocket Item",
    Item: null,
    Output: "Remove gems ",
    Input: "Socketed any + Jewel Pliers ",
    CubeRecipeDescription: "Socketed Any + Jewel Pliers = Remove Gems "
  },
  {
    Description: "SOCKET RETRIEVE - Rune Pliers & Socketed Item = Unsocket Runeword Item",
    Item: null,
    Output: "Remove gems ",
    Input: "Socketed any + Rune Pliers ",
    CubeRecipeDescription: "Socketed Any + Rune Pliers = Remove Gems "
  },
  {
    Description: "INFUSE WEAPON - Infusion Orb & Inferior Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Low Quality Weapon + Orb of Infusion ",
    CubeRecipeDescription: "Low Quality Weapon + Orb Of Infusion = Rare Weapon"
  },
  {
    Description: "INFUSE WEAPON - Infusion Orb & Normal Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Normal Weapon + Orb of Infusion ",
    CubeRecipeDescription: "Normal Weapon + Orb Of Infusion = Rare Weapon"
  },
  {
    Description: "INFUSE WEAPON - Infusion Orb & Superior Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Weapon + Orb of Infusion ",
    CubeRecipeDescription: "Weapon + Orb Of Infusion = Rare Weapon"
  },
  {
    Description: "INFUSE ARMOR/SHIELD - Infusion Orb & Inferior Armor/Shield",
    Item: null,
    Output: "Rare Any Armor",
    Input: "Low Quality Any Armor + Orb of Infusion ",
    CubeRecipeDescription: "Low Quality Any Armor + Orb Of Infusion = Rare Any Armor"
  },
  {
    Description: "INFUSE ARMOR/SHIELD - Infusion Orb & Normal Armor/Shield",
    Item: null,
    Output: "Rare Any Armor",
    Input: "Normal Any Armor + Orb of Infusion ",
    CubeRecipeDescription: "Normal Any Armor + Orb Of Infusion = Rare Any Armor"
  },
  {
    Description: "INFUSE ARMOR/SHIELD - Infusion Orb & Superior Armor/Shield",
    Item: null,
    Output: "Rare Any Armor",
    Input: "Any Armor + Orb of Infusion ",
    CubeRecipeDescription: "Any Armor + Orb Of Infusion = Rare Any Armor"
  },
  {
    Description: "INFUSE RING - Infusion Orb & Magic Ring",
    Item: null,
    Output: "Rare Magic Ring",
    Input: "Magic Ring + Orb of Infusion ",
    CubeRecipeDescription: "Magic Ring + Orb Of Infusion = Rare Magic Ring"
  },
  {
    Description: "INFUSE AMULET - Infusion Orb & Magic Amulet",
    Item: null,
    Output: "Rare Magic Amulet",
    Input: "Magic Amulet + Orb of Infusion ",
    CubeRecipeDescription: "Magic Amulet + Orb Of Infusion = Rare Magic Amulet"
  },
  {
    Description: "SHADOW WEAPON - Shadow Orb & 1H Weapon",
    Item: null,
    Output: "1H Weapons",
    Input: "Not Etheral 1H Weapons + Orb of Shadows ",
    CubeRecipeDescription: "Not Etheral 1H Weapons + Orb Of Shadows = 1H Weapons"
  },
  {
    Description: "SHADOW WEAPON - Shadow Orb & 2H Weapon (Slam)",
    Item: null,
    Output: "Slam Weapons",
    Input: "Not Etheral Slam Weapons + Orb of Shadows ",
    CubeRecipeDescription: "Not Etheral Slam Weapons + Orb Of Shadows = Slam Weapons"
  },
  {
    Description: "SHADOW WEAPON - Shadow Orb & 2H Weapon (Spear/Polearm)",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Not Etheral Spears and Polearms + Orb of Shadows ",
    CubeRecipeDescription: "Not Etheral Spears And Polearms + Orb Of Shadows = Spears And Polearms"
  },
  {
    Description: "SHADOW ARMOR/SHIELD - Shadow Orb & Armor/Shield",
    Item: null,
    Output: "Any Armor",
    Input: "Not Etheral Any Armor + Orb of Shadows ",
    CubeRecipeDescription: "Not Etheral Any Armor + Orb Of Shadows = Any Armor"
  },
  {
    Description: "CRAFT ITEM - Any Magic Amulet + ITH Rune + EL Rune = +100% CTC level 4 Battle Orders on level up Magic Amulet",
    Item: null,
    Output: "Magic Magic Amulet",
    Input: "Magic Amulet + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Amulet + Ith Rune + El Rune = Magic Magic Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Magic Amulet + Orb of Infusion + RAL Rune + Gem(Any) = +1 Random Class All Skills Rare Amulet",
    Item: null,
    Output: "Rare Magic Amulet",
    Input: "Magic Amulet + Orb of Infusion + Ral Rune + Gem ",
    CubeRecipeDescription: "Magic Amulet + Orb Of Infusion + Ral Rune + Gem = Rare Magic Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Rare Amulet + Rare Jewel + PUL r+ EL Rune + Ruby = +1 All Skills & +10-12% Faster Attack Speed Rare Amulet ",
    Item: null,
    Output: "Rare Rare Amulet",
    Input: "Rare Amulet + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Amulet + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Rare Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Rare Amulet + Rare Jewel + PUL r+ EL Rune + Sapphire =  +1 All Skills & +10-12% Faster Cast Rate Rare Amulet",
    Item: null,
    Output: "Rare Rare Amulet",
    Input: "Rare Amulet + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Amulet + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Rare Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Rare Amulet + Unique Jewel + VEX Rune + LO Rune + Skull = +2 All Skills & +25-35 Weapon Damage Crafted Amulet",
    Item: null,
    Output: "Rare Amulet",
    Input: "Rare Amulet + Unique Jewel + Vex Rune + Lo Rune + Skull ",
    CubeRecipeDescription: "Rare Amulet + Unique Jewel + Vex Rune + Lo Rune + Skull = Rare Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Rare Amulet + Unique Jewel + VEX Rune + LO Rune + Sapphire = +2 All Skills & +10-15% All Elemental Damage Crafted Amulet",
    Item: null,
    Output: "Rare Amulet",
    Input: "Rare Amulet + Unique Jewel + Vex Rune + Lo Rune + Sapphire ",
    CubeRecipeDescription: "Rare Amulet + Unique Jewel + Vex Rune + Lo Rune + Sapphire = Rare Amulet"
  },
  {
    Description: "CRAFT ITEM - Any Magic Ring + ITH Rune + EL Rune = +100% CTC level 1 Fade on level up Magic Ring",
    Item: null,
    Output: "Magic Magic Ring",
    Input: "Magic Ring + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Ring + Ith Rune + El Rune = Magic Magic Ring"
  },
  {
    Description: "CRAFT ITEM - Any Magic Ring & Rare Jewel & Tal Rune & Ral Rune & Ort Rune = Barilzar's Mazed Band Unique Ring",
    Item: null,
    Output: "Barilzar's Mazed Band",
    Input: "Magic Ring + Rare Jewel + Tal Rune + Ral Rune + Ort Rune ",
    CubeRecipeDescription: "Magic Ring + Rare Jewel + Tal Rune + Ral Rune + Ort Rune = Barilzar's Mazed Band"
  },
  {
    Description: "CRAFT ITEM - Any Magic Ring + Orb of Infusion + AMN Rune + Gem(Any) = +20% Magic Find Rare Ring",
    Item: null,
    Output: "Rare Magic Ring",
    Input: "Magic Ring + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Ring + Orb Of Infusion + Amn Rune + Gem = Rare Magic Ring"
  },
  {
    Description: "CRAFT ITEM - Any Rare Ring + Rare Jewel + UM Rune + HEL Rune + Gem(Any) = +8-10% All Res +8-10 all attributes Rare Ring",
    Item: null,
    Output: "Rare Rare Ring",
    Input: "Rare Ring + Rare Jewel + Um Rune + Hel Rune + Gem ",
    CubeRecipeDescription: "Rare Ring + Rare Jewel + Um Rune + Hel Rune + Gem = Rare Rare Ring"
  },
  {
    Description: "CRAFT ITEM - Any Rare Ring + Unique Jewel + SUR Rune + JAH Rune + Gem(Any) = +5-8% Max HP & +5-8% Max Mana Crafted Ring",
    Item: null,
    Output: "Rare Ring",
    Input: "Rare Ring + Unique Jewel + Sur Rune + Jah Rune + Gem ",
    CubeRecipeDescription: "Rare Ring + Unique Jewel + Sur Rune + Jah Rune + Gem = Rare Ring"
  },
  {
    Description: "CRAFT ITEM - Any Rare Ring + Unique Jewel + ZOD r+ GUL Rune + Gem(Any) = +1 All Skills & +10% Faster Attack Speed & +10% Faster Cast Rate Crafted Ring",
    Item: null,
    Output: "Rare Ring",
    Input: "Rare Ring + Unique Jewel + Zod Rune + Gul Rune + Gem ",
    CubeRecipeDescription: "Rare Ring + Unique Jewel + Zod Rune + Gul Rune + Gem = Rare Ring"
  },
  {
    Description: "CRAFT ITEM - Any Rare Ring + Unique Jewel + ZOD r+ VEX Rune + Ruby = +1 All Skills & +15-25 Weapon Damage Crafted Ring",
    Item: null,
    Output: "Rare Ring",
    Input: "Rare Ring + Unique Jewel + Zod Rune + Vex Rune + Ruby ",
    CubeRecipeDescription: "Rare Ring + Unique Jewel + Zod Rune + Vex Rune + Ruby = Rare Ring"
  },
  {
    Description: "CRAFT ITEM - Any Rare Ring + Unique Jewel + ZOD r+ VEX Rune + Sapphire = +1 All Skills & +8-10% All Elemental Damage Crafted Ring",
    Item: null,
    Output: "Rare Ring",
    Input: "Rare Ring + Unique Jewel + Zod Rune + Vex Rune + Sapphire ",
    CubeRecipeDescription: "Rare Ring + Unique Jewel + Zod Rune + Vex Rune + Sapphire = Rare Ring"
  },
  {
    Description: "CRAFT ITEM - Any Magic Belt + ITH Rune + EL Rune = +100% CTC level Level 1 Frozen Armor on level up Magic Belt",
    Item: null,
    Output: "Magic Belt",
    Input: "Magic Belt + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Belt + Ith Rune + El Rune = Magic Belt"
  },
  {
    Description: "CRAFT ITEM - Any Magic Belt + Magic Jewel + RAL Rune = +1 Random Class All Skills Magic Belt",
    Item: null,
    Output: "Magic Belt",
    Input: "Magic Belt + Magic Jewel + Ral Rune ",
    CubeRecipeDescription: "Magic Belt + Magic Jewel + Ral Rune = Magic Belt"
  },
  {
    Description: "CRAFT ITEM - Any Rare Belt + Rare Jewel + UM Rune + IST Rune + Gem (Any) = +20-25% All Res & +30-40% Magic Find Rare Belt",
    Item: null,
    Output: "Rare Belt",
    Input: "Rare Belt + Rare Jewel + Um Rune + Ist Rune + Gem ",
    CubeRecipeDescription: "Rare Belt + Rare Jewel + Um Rune + Ist Rune + Gem = Rare Belt"
  },
  {
    Description: "CRAFT ITEM - Any Rare Belt + Rare Jewel + LEM Rune + MAL Rune + Gem (Any) = +10-15% Piercing Attack & +10-15% Open wounds Rare Belt",
    Item: null,
    Output: "Rare Belt",
    Input: "Rare Belt + Rare Jewel + Lem Rune + Mal Rune + Gem ",
    CubeRecipeDescription: "Rare Belt + Rare Jewel + Lem Rune + Mal Rune + Gem = Rare Belt"
  },
  {
    Description: "CRAFT ITEM - Any Rare Belt + Unique Jewel + CHAM r+ JAH Rune + Gem (Any) = +Cannot Be Frozen + 10-15% Max HP Crafted Belt",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Unique Jewel + Cham Rune + Jah Rune + Gem ",
    CubeRecipeDescription: "Rare Belt + Unique Jewel + Cham Rune + Jah Rune + Gem = Belt"
  },
  {
    Description: "CRAFT ITEM - Any Rare Belt + Unique Jewel + ZOD r+ VEX Rune + Ruby = +1 All Skills & +20-30 Weapon Damage Crafted Belt",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Unique Jewel + Zod Rune + Vex Rune + Ruby ",
    CubeRecipeDescription: "Rare Belt + Unique Jewel + Zod Rune + Vex Rune + Ruby = Belt"
  },
  {
    Description: "CRAFT ITEM - Any Rare Belt + Unique Jewel + ZOD r+ VEX Rune + Sapphire = +1 All Skills & +8-10% All Elemental Damage Crafted Belt",
    Item: null,
    Output: "Belt",
    Input: "Rare Belt + Unique Jewel + Zod Rune + Vex Rune + Sapphire ",
    CubeRecipeDescription: "Rare Belt + Unique Jewel + Zod Rune + Vex Rune + Sapphire = Belt"
  },
  {
    Description: "CRAFT ITEM - Any Magic Boots + ITH Rune + EL Rune = +100% CTC level 1 Burst of speed on level up Magic Boots",
    Item: null,
    Output: "Magic Boots",
    Input: "Magic Boots + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Boots + Ith Rune + El Rune = Magic Boots"
  },
  {
    Description: "CRAFT ITEM - Any Magic Boots + Orb of Infusion + HEL Rune + Gem (Any) = +15% Faster Run/Walk & +10 All Attributes Rare Boots",
    Item: null,
    Output: "Rare Boots",
    Input: "Magic Boots + Orb of Infusion + Hel Rune + Gem ",
    CubeRecipeDescription: "Magic Boots + Orb Of Infusion + Hel Rune + Gem = Rare Boots"
  },
  {
    Description: "CRAFT ITEM - Any Rare Boots + Rare Jewel + UM Rune + IST Rune + Gem (Any) = +20-25% All Resists & +30-40% Magic Find Rare Boots",
    Item: null,
    Output: "Rare Boots",
    Input: "Rare Boots + Rare Jewel + Um Rune + Ist Rune + Gem ",
    CubeRecipeDescription: "Rare Boots + Rare Jewel + Um Rune + Ist Rune + Gem = Rare Boots"
  },
  {
    Description: "CRAFT ITEM - Any Rare Boots + Unique Jewel + ZOD Rune + OHM Rune + Gem (Any) = +1 AllSkills & +20-30% Faster Run/Walk & +20-30 Weapon Damage Crafted Boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Unique Jewel + Zod Rune + Ohm Rune + Gem ",
    CubeRecipeDescription: "Rare Boots + Unique Jewel + Zod Rune + Ohm Rune + Gem = Boots"
  },
  {
    Description: "CRAFT ITEM - Any Rare Boots + Unique Jewel + ZOD Rune + VEX Rune + Gem (Any) = +1 AllSkills & +20-30% Faster Run/Walk & +5-10% All Elemental Damage Crafted Boots",
    Item: null,
    Output: "Boots",
    Input: "Rare Boots + Unique Jewel + Zod Rune + Vex Rune + Gem ",
    CubeRecipeDescription: "Rare Boots + Unique Jewel + Zod Rune + Vex Rune + Gem = Boots"
  },
  {
    Description: "CRAFT ITEM - Any Magic Gloves + ITH Rune + EL Rune = +100% CTC level Level 4 Battle Commands on level up Magic Gloves",
    Item: null,
    Output: "Magic Gloves",
    Input: "Magic Gloves + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Gloves + Ith Rune + El Rune = Magic Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Magic Gloves + Magic Jewel + RAL Rune = +8% Faster Attack Speed & +8% Faster Cast Rate Magic Gloves",
    Item: null,
    Output: "Magic Gloves",
    Input: "Magic Gloves + Magic Jewel + Ral Rune ",
    CubeRecipeDescription: "Magic Gloves + Magic Jewel + Ral Rune = Magic Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1 Random Skill Tab (current class) & +10-15% Increased Attack Speed Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + MAL Rune + DOL Rune + Gem(Any) = +1 Random Skill Tab (current class) & +10-15% Faster Cast Rate Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Rare Jewel + UM Rune + IST Rune + Gem (Any) = +20-25 All Res & +30% Magic Find Rare Gloves",
    Item: null,
    Output: "Rare Gloves",
    Input: "Rare Gloves + Rare Jewel + Um Rune + Ist Rune + Gem ",
    CubeRecipeDescription: "Rare Gloves + Rare Jewel + Um Rune + Ist Rune + Gem = Rare Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Unique Jewel + ZOD r+ VEX Rune + Ruby = +1 All Skills & +20-40 Weapon Damage & +0.375 Crushing blow/lvl Crafted Gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Unique Jewel + Zod Rune + Vex Rune + Ruby ",
    CubeRecipeDescription: "Rare Gloves + Unique Jewel + Zod Rune + Vex Rune + Ruby = Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Rare Gloves + Unique Jewel + ZOD r+ VEX Rune + Sapphire = +1 All Skills & +5-10% All Elemental Damage & +10-20% Faster Cast Rate Crafted Gloves",
    Item: null,
    Output: "Gloves",
    Input: "Rare Gloves + Unique Jewel + Zod Rune + Vex Rune + Sapphire ",
    CubeRecipeDescription: "Rare Gloves + Unique Jewel + Zod Rune + Vex Rune + Sapphire = Gloves"
  },
  {
    Description: "CRAFT ITEM - Any Magic Helm + ITH Rune + EL Rune = +100% CTC level Level 1 Shout on level up Magic Helm",
    Item: null,
    Output: "Magic Helm",
    Input: "Magic Helm + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Helm + Ith Rune + El Rune = Magic Helm"
  },
  {
    Description: "CRAFT ITEM - Any Magic Helm + Orb of Infusion + RAL Rune + Gem (Any) = +15% Faster Hit Recovery Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Magic Helm + Orb of Infusion + Ral Rune + Gem ",
    CubeRecipeDescription: "Magic Helm + Orb Of Infusion + Ral Rune + Gem = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + UM Rune + EL Rune + Gem (Any) = +20-25% All Resists & +20-30% Faster Hit Recovery Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Um Rune + El Rune + Gem ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Um Rune + El Rune + Gem = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune +  Ruby = +1 Current Class Skills & +10-15% Increased Attack Speed Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Ruby = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Rare Jewel + PUL Rune + EL Rune + Sapphire = +1 Current Class Skills & +10-15% Faster Cast Rate Rare Helm",
    Item: null,
    Output: "Rare Helm",
    Input: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Rare Jewel + Pul Rune + El Rune + Sapphire = Rare Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Unique Jewel + ZOD r+ VEX Rune + Ruby = +1-2 All Skills & +20-30% Enhanced Weapon Damage Crafted Helm",
    Item: null,
    Output: "Helm",
    Input: "Rare Helm + Unique Jewel + Zod Rune + Vex Rune + Ruby ",
    CubeRecipeDescription: "Rare Helm + Unique Jewel + Zod Rune + Vex Rune + Ruby = Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Unique Jewel + ZOD r+ VEX Rune + Sapphire = +1-2 All Skills & +5-10% All Elemental Damage Crafted Helm",
    Item: null,
    Output: "Helm",
    Input: "Rare Helm + Unique Jewel + Zod Rune + Vex Rune + Sapphire ",
    CubeRecipeDescription: "Rare Helm + Unique Jewel + Zod Rune + Vex Rune + Sapphire = Helm"
  },
  {
    Description: "CRAFT ITEM - Any Rare Helm + Unique Jewel + BER r+ JAH Rune + Gem(Any) = +2 All Skills & +5-10% Physical Damage Reduction & +5-10% Max HP Crafted Helm",
    Item: null,
    Output: "Helm",
    Input: "Rare Helm + Unique Jewel + Ber Rune + Jah Rune + Gem ",
    CubeRecipeDescription: "Rare Helm + Unique Jewel + Ber Rune + Jah Rune + Gem = Helm"
  },
  {
    Description: "CRAFT ITEM - Any Magic Body Armor + ITH Rune + EL Rune = +100% CTC level Level 5 Oak Sage on level up Magic Body Armor",
    Item: null,
    Output: "Magic Armor",
    Input: "Magic Armor + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Armor + Ith Rune + El Rune = Magic Armor"
  },
  {
    Description: "CRAFT ITEM - Any Magic Body Armor + Orb of Infusion + RAL Rune + Gem (Any) = +20% Faster Run/Walk & +100 Defense Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Magic Armor + Orb of Infusion + Ral Rune + Gem ",
    CubeRecipeDescription: "Magic Armor + Orb Of Infusion + Ral Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + UM Rune + IST Rune + Gem (Any) = +20-25 All Res & +20-40% Magic Find Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Um Rune + Ist Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Um Rune + Ist Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + SHAEL Rune + Gem (Any) = +1 Current Class Skills & +30-50 HP & +10-15% Increased Attack Speed Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Shael Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Rare Jewel + PUL Rune + DOL Rune + Gem (Any) = +1 Current Class Skills & +30-50 Mana & +10-15% Faster Cast Rate Rare Body Armor",
    Item: null,
    Output: "Rare Armor",
    Input: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Armor + Rare Jewel + Pul Rune + Dol Rune + Gem = Rare Armor"
  },
  {
    Description: "CRAFT ITEM - Any Rare Body Armor + Unique Jewel + ZOD Rune + BER Rune + UM RUNE = +2 All Skills & +150-175% Enhanced Defense & +20-30% All Resists +5-10% Physical Damage Reduction Crafted Body Armor",
    Item: null,
    Output: "Armor",
    Input: "Rare Armor + Unique Jewel + Zod Rune + Ber Rune + Um Rune ",
    CubeRecipeDescription: "Rare Armor + Unique Jewel + Zod Rune + Ber Rune + Um Rune = Armor"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + ITH Rune + EL Rune = +100% CTC level Level 4 Holy Shield on Level Up & +5 All Attributes Magic Shield",
    Item: null,
    Output: "Magic Any Shield",
    Input: "Magic Any Shield + Ith Rune + El Rune ",
    CubeRecipeDescription: "Magic Any Shield + Ith Rune + El Rune = Magic Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Shield + Orb of Infusion + AMN Rune + Gem (Any) = +1 Current Class Skills",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Magic Any Shield + Orb of Infusion + Amn Rune + Gem ",
    CubeRecipeDescription: "Magic Any Shield + Orb Of Infusion + Amn Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + UM Rune + IST Rune + Gem (Any) = +20-25% All Res & +30-40% Magic Find Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Um Rune + Ist Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Um Rune + Ist Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + UM Rune + SHAEL Rune + Gem (Any) = +20-25% All Res & +20-30% Increase Block Chance & +30% Faster Hit Recovery Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Um Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Um Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + SHAEL Rune + Gem (Any) = +1-2 Current Class Skills & +20-30% Enhanced Weapon Damage Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Shael Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Rare Jewel + MAL Rune + DOL Rune + Gem (Any) = +1-2 Current Class Skills & +5-8 All Elemental Damage & +(-5-8%) To All Enemy Resists Rare Shield",
    Item: null,
    Output: "Rare Any Shield",
    Input: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Rare Jewel + Mal Rune + Dol Rune + Gem = Rare Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Unique Jewel + BER Rune + UM Rune + Gem (Any) = +2 All Skills & +30-40% All Res & +5-10% Physical Damage Reduction Crafted Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Unique Jewel + Ber Rune + Um Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Unique Jewel + Ber Rune + Um Rune + Gem = Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Unique Jewel + OHM Rune + CHAM Rune + Gem (Any) = +2 All Skills & +50-80% Enhanced Weapon Damage Crafted Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Unique Jewel + Ohm Rune + Cham Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Unique Jewel + Ohm Rune + Cham Rune + Gem = Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Rare Shield + Unique Jewel + ZOD Rune + MAL Rune + Gem (Any) = +2 All SKills & +10-15% All Elemental Damage & +(-10-15%) To All Enemy Elemental Resist Crafted Shield",
    Item: null,
    Output: "Any Shield",
    Input: "Rare Any Shield + Unique Jewel + Zod Rune + Mal Rune + Gem ",
    CubeRecipeDescription: "Rare Any Shield + Unique Jewel + Zod Rune + Mal Rune + Gem = Any Shield"
  },
  {
    Description: "CRAFT ITEM - Any Magic Weapon + Magic Jewel + RAL Rune + Ruby = +85% Enhanced Damage & +20% Increased Attack Speed Magic Weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Magic Weapon + Magic Jewel + Ral Rune + Ruby ",
    CubeRecipeDescription: "Magic Weapon + Magic Jewel + Ral Rune + Ruby = Magic Weapon"
  },
  {
    Description: "CRAFT ITEM - Any Magic Weapon + Magic Jewel + RAL Rune + Sapphire = +5% All Elemental Damage & +15% Faster Cast Rate Magic Weapon",
    Item: null,
    Output: "Magic Weapon",
    Input: "Magic Weapon + Magic Jewel + Ral Rune + Sapphire ",
    CubeRecipeDescription: "Magic Weapon + Magic Jewel + Ral Rune + Sapphire = Magic Weapon"
  },
  {
    Description: "CRAFT ITEM - Any Magic Weapon + Orb of Infusion + SOL Rune + SHAEL Rune + Gem (Any) = +1 Min Damage/lvl & +1 Max Damage/lvl & +20% Increased Attack Speed Rare Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Magic Weapon + Orb of Infusion + Sol Rune + Shael Rune + Gem ",
    CubeRecipeDescription: "Magic Weapon + Orb Of Infusion + Sol Rune + Shael Rune + Gem = Rare Weapon"
  },
  {
    Description: "CRAFT ITEM - Any Rare Weapon + Rare Jewel + LEM Rune + EL Rune + Gem (Any) = +1 All Skills & +125-150% Enhanced Weapon Damage & +30% Increased Attack Speed Rare Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Rare Weapon + Rare Jewel + Lem Rune + El Rune + Gem ",
    CubeRecipeDescription: "Rare Weapon + Rare Jewel + Lem Rune + El Rune + Gem = Rare Weapon"
  },
  {
    Description: "CRAFT ITEM - Any Rare Weapon + Rare Jewel + PUL Rune + EL Rune + Gem (Any) = +1-2 All Skills & -10% To All Enemy Elemental Resist & 20% Faster Cast Speed Rare Weapon",
    Item: null,
    Output: "Rare Weapon",
    Input: "Rare Weapon + Rare Jewel + Pul Rune + El Rune + Gem ",
    CubeRecipeDescription: "Rare Weapon + Rare Jewel + Pul Rune + El Rune + Gem = Rare Weapon"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Slam) + Unique Jewel + BER Rune + OHM Rune + Gem (Any) = +2 All Skills & 220-250% Enhanced Weapon Damage & +60-100 Weapon Damage Crafted Weapon",
    Item: null,
    Output: "Slam Weapons",
    Input: "Rare Slam Weapons + Unique Jewel + Ber Rune + Ohm Rune + Gem ",
    CubeRecipeDescription: "Rare Slam Weapons + Unique Jewel + Ber Rune + Ohm Rune + Gem = Slam Weapons"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Spear/Polearm) + Unique Jewel + BER Rune + OHM Rune + Gem (Any) = +2 All Skills & 220-250% Enhanced Weapon Damage & +60-100 Weapon Damage Crafted Weapon",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Rare Spears and Polearms + Unique Jewel + Ber Rune + Ohm Rune + Gem ",
    CubeRecipeDescription: "Rare Spears And Polearms + Unique Jewel + Ber Rune + Ohm Rune + Gem = Spears And Polearms"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Bow/Crossbow) + Unique Jewel + BER Rune + OHM Rune + Gem (Any) = +2 All Skills & 220-250% Enhanced Weapon Damage & +60-100 Weapon Damage Crafted Weapon",
    Item: null,
    Output: "Missile Weapon",
    Input: "Rare Missile Weapon + Unique Jewel + Ber Rune + Ohm Rune + Gem ",
    CubeRecipeDescription: "Rare Missile Weapon + Unique Jewel + Ber Rune + Ohm Rune + Gem = Missile Weapon"
  },
  {
    Description: "CRAFT ITEM - Any 1 Hand Rare Weapon + Unique Jewel + BER Rune + OHM Rune + Gem (Any) = +2 All Skills & 150-200% Enhanced Weapon Damage & +30-60 Weapon Damage Crafted Weapon",
    Item: null,
    Output: "1H Weapons",
    Input: "Rare 1H Weapons + Unique Jewel + Ber Rune + Ohm Rune + Gem ",
    CubeRecipeDescription: "Rare 1H Weapons + Unique Jewel + Ber Rune + Ohm Rune + Gem = 1H Weapons"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Slam) + Unique Jewel + BER Rune + CHAM Rune + Gem (Any) = +2 All Skills & +15-20% All Elemental damage & + -12-16% To all Enemy Elemental Resist Crafted Weapon",
    Item: null,
    Output: "Slam Weapons",
    Input: "Rare Slam Weapons + Unique Jewel + Ber Rune + Cham Rune + Gem ",
    CubeRecipeDescription: "Rare Slam Weapons + Unique Jewel + Ber Rune + Cham Rune + Gem = Slam Weapons"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Spear/Polearm) + Unique Jewel + BER Rune + CHAM Rune + Gem (Any) = +2 All Skills & +15-20% All Elemental damage & + -12-16% To all Enemy Elemental Resist Crafted Weapon",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Rare Spears and Polearms + Unique Jewel + Ber Rune + Cham Rune + Gem ",
    CubeRecipeDescription: "Rare Spears And Polearms + Unique Jewel + Ber Rune + Cham Rune + Gem = Spears And Polearms"
  },
  {
    Description: "CRAFT ITEM - Any 2 Hand Rare Weapon(Bow/Crossbow) + Unique Jewel + BER Rune + CHAM Rune + Gem (Any) = +2 All Skills & +15-20% All Elemental damage & + -12-16% To all Enemy Elemental Resist Crafted Weapon",
    Item: null,
    Output: "Missile Weapon",
    Input: "Rare Missile Weapon + Unique Jewel + Ber Rune + Cham Rune + Gem ",
    CubeRecipeDescription: "Rare Missile Weapon + Unique Jewel + Ber Rune + Cham Rune + Gem = Missile Weapon"
  },
  {
    Description: "CRAFT ITEM - Any 1 Hand Rare Weapon + Unique Jewel + BER Rune + CHAM Rune + Gem (Any) = +2 All Skills & +10-15% All Elemental damage & + -8-12% To all Enemy Elemental Resist Crafted Weapon",
    Item: null,
    Output: "1H Weapons",
    Input: "Rare 1H Weapons + Unique Jewel + Ber Rune + Cham Rune + Gem ",
    CubeRecipeDescription: "Rare 1H Weapons + Unique Jewel + Ber Rune + Cham Rune + Gem = 1H Weapons"
  },
  {
    Description: "CRAFT ITEM - Arrows & Gem (Any) & Tir-Rune = Replenishing Quiver",
    Item: null,
    Output: "Barbed Arrows",
    Input: "Arrows + Tir Rune + Gem ",
    CubeRecipeDescription: "Arrows + Tir Rune + Gem = Barbed Arrows"
  },
  {
    Description: "CRAFT ITEM - Arrows & Gem (Any) & Thul-Rune = Quiver of Piercing",
    Item: null,
    Output: "Arrows of Piercing",
    Input: "Arrows + Thul Rune + Gem ",
    CubeRecipeDescription: "Arrows + Thul Rune + Gem = Arrows Of Piercing"
  },
  {
    Description: "CRAFT ITEM - Arrows & Gem (Any) & Fal-Rune = Quiver of Slaying",
    Item: null,
    Output: "Arrows of Slaying",
    Input: "Arrows + Fal Rune + Gem ",
    CubeRecipeDescription: "Arrows + Fal Rune + Gem = Arrows Of Slaying"
  },
  {
    Description: "CRAFT ITEM - Quiver of Slaying & Gul Rune & 1 Jewel Rare = Quiver of Pestilence",
    Item: null,
    Output: "Quiver of Pestilence",
    Input: "Arrows of Slaying + Rare Jewel + Gul Rune ",
    CubeRecipeDescription: "Arrows Of Slaying + Rare Jewel + Gul Rune = Quiver Of Pestilence"
  },
  {
    Description: "CRAFT ITEM - Quiver of Slaying & Vex Rune & 1 Jewel Rare = Quiver of Amplified Slaying",
    Item: null,
    Output: "Quiver of Amplified Slaying",
    Input: "Arrows of Slaying + Rare Jewel + Vex Rune ",
    CubeRecipeDescription: "Arrows Of Slaying + Rare Jewel + Vex Rune = Quiver Of Amplified Slaying"
  },
  {
    Description: "CRAFT ITEM - Quiver of Slaying & Ohm Rune & 1 Jewel Rare = Quiver of Resistance Slaying",
    Item: null,
    Output: "Quiver of Resistance Slaying",
    Input: "Arrows of Slaying + Rare Jewel + Ohm Rune ",
    CubeRecipeDescription: "Arrows Of Slaying + Rare Jewel + Ohm Rune = Quiver Of Resistance Slaying"
  },
  {
    Description: "CRAFT ITEM - Bolts & Gem (Any) & Tir-Rune = Replenishing Bolt Case",
    Item: null,
    Output: "Barbed Bolts",
    Input: "Bolts + Tir Rune + Gem ",
    CubeRecipeDescription: "Bolts + Tir Rune + Gem = Barbed Bolts"
  },
  {
    Description: "CRAFT ITEM - Bolts & Gem (Any) & Thul-Rune = Bolt Case of Piercing",
    Item: null,
    Output: "Bolts of Piercing",
    Input: "Bolts + Thul Rune + Gem ",
    CubeRecipeDescription: "Bolts + Thul Rune + Gem = Bolts Of Piercing"
  },
  {
    Description: "CRAFT ITEM - Bolts & Gem (Any) & Fal-Rune = Bolt Case of Slaying",
    Item: null,
    Output: "Bolts of Slaying",
    Input: "Bolts + Fal Rune + Gem ",
    CubeRecipeDescription: "Bolts + Fal Rune + Gem = Bolts Of Slaying"
  },
  {
    Description: "CRAFT ITEM - Bolt Case of Slaying & Gul Rune & 1 Jewel Rare = Bolt Case of Pestilence",
    Item: null,
    Output: "Bolt Case of Pestilence",
    Input: "Bolts of Slaying + Rare Jewel + Gul Rune ",
    CubeRecipeDescription: "Bolts Of Slaying + Rare Jewel + Gul Rune = Bolt Case Of Pestilence"
  },
  {
    Description: "CRAFT ITEM - Bolt Case of Slaying & Vex Rune & 1 Jewel Rare = Bolt Case of Amplified Slaying",
    Item: null,
    Output: "Bolt Case of Amplified Slaying",
    Input: "Bolts of Slaying + Rare Jewel + Vex Rune ",
    CubeRecipeDescription: "Bolts Of Slaying + Rare Jewel + Vex Rune = Bolt Case Of Amplified Slaying"
  },
  {
    Description: "CRAFT ITEM - Bolt Case of Slaying & Ohm Rune & 1 Jewel Rare = Bolt Case of Resistance Slaying",
    Item: null,
    Output: "Bolt Case of Resistance Slaying",
    Input: "Bolts of Slaying + Rare Jewel + Ohm Rune ",
    CubeRecipeDescription: "Bolts Of Slaying + Rare Jewel + Ohm Rune = Bolt Case Of Resistance Slaying"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Magic & Amn Rune & EL Rune = Crafted Grand Charm +40-60Hp & +20-30 replenish",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Magic Jewel + El Rune + Amn Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Magic Jewel + El Rune + Amn Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Magic & Sol Rune & EL Rune = Crafted Grand Charm +40-60Mana & +8-12 mana regen",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Magic Jewel + El Rune + Sol Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Magic Jewel + El Rune + Sol Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Magic & Shael Rune & EL Rune = Crafted Grand Charm +5-10% Faster Attack Speed",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Magic Jewel + El Rune + Shael Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Magic Jewel + El Rune + Shael Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Magic & Dol Rune & EL Rune = Crafted Grand Charm +5-10% Faster Cast Rate",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Magic Jewel + El Rune + Dol Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Magic Jewel + El Rune + Dol Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Magic & Hel Rune & EL Rune = Crafted Grand Charm +5-10% Exp",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Magic Jewel + El Rune + Hel Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Magic Jewel + El Rune + Hel Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Ko-Rune & Fal-Rune = Crafted Grand Charm +15-20Dexterity & +15-20Strength & +10-20% Enhanced Dmg",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Ko Rune + Fal Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Ko Rune + Fal Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Pul-Rune & EL Rune = Crafted Grand Charm +70-100Def & 15-25 Weapon Dmg",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + El Rune + Pul Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + El Rune + Pul Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Um-Rune & EL Rune = Crafted Grand Charm +8-12 All-res",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + El Rune + Um Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + El Rune + Um Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Ist-Rune & EL Rune  = Crafted Grand Charm +25-40% Magic Find & 50-80% Gold Find",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + El Rune + Ist Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + El Rune + Ist Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Topaz = Crafted Grand Charm & +1 Random Assassin Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Topaz ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Topaz = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Ruby = Crafted Grand Charm & +1 Random Barbarian Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Ruby ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Ruby = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Sapphire = Crafted Grand Charm & +1 Random Sorceress Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Sapphire ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Sapphire = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Emerald = Crafted Grand Charm & +1 Random Druid Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Emerald ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Emerald = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Skull = Crafted Grand Charm & +1 Random Necromancer Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Skull ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Skull = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Amethyst = Crafted Grand Charm & +1 Random Amazon Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Amethyst ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Amethyst = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Rare & Vex Rune & Thul Rune & Diamond = Crafted Grand Charm & +1 Random Paladin Skill Tab",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Diamond ",
    CubeRecipeDescription: "Magic Grand Charm + Rare Jewel + Thul Rune + Vex Rune + Diamond = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Charm Grand & Jewel Unique & EL-Rune & Zod-Rune = Crafted Grand Charm +All-skills",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "Magic Grand Charm + Unique Jewel + El Rune + Zod Rune ",
    CubeRecipeDescription: "Magic Grand Charm + Unique Jewel + El Rune + Zod Rune = Magic Grand Charm"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Cold ) & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Cold Rupture + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Cold Rupture + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Fire ) & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flame Rift + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Flame Rift + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Light ) & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Crack of the Heavens + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Crack Of The Heavens + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Poison ) & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Rotting Fissure + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Rotting Fissure + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Physical )  & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Bone Break + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Bone Break + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Magic ) & Unique Jewel & Sur-Rune & Gem Bag (50 Gems) = Crafted Grand Charm Sunder",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Black Cleft + Unique Jewel + Sur Rune ",
    CubeRecipeDescription: "Gem Bag + Black Cleft + Unique Jewel + Sur Rune = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Cold ) & Unique Jewel & Gem Bag (100 Gems) = Winter Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Cold Rupture + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Cold Rupture + Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Fire ) & Unique Jewel & Gem Bag (100 Gems) = Summer Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Flame Rift + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Flame Rift + Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Light ) & Unique Jewel & Gem Bag (100 Gems) = Spring Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Crack of the Heavens + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Crack Of The Heavens + Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Poison ) & Unique Jewel & Gem Bag (100 Gems) = Autumn Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Rotting Fissure + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Rotting Fissure + Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Physical )  & Unique Jewel & Gem Bag (100 Gems) = Star Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Bone Break + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Bone Break + Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - Sunder Charm Grand ( Magic ) & 2 Unique Jewel & Gem Bag (100 Gems) = Heaven Facet",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Black Cleft + 2 Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Black Cleft + 2 Unique Jewel = Gem Bag"
  },
  {
    Description: "CRAFT ITEM - 5x Infusion Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Conversion Orb",
    Item: null,
    Output: "Orb of Conversion",
    Input: "5 Orb of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "5 Orb Of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Orb Of Conversion"
  },
  {
    Description: "CRAFT ITEM - Unique Armor & Corruption Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Rerolled Unique Item",
    Item: null,
    Output: "Any Armor",
    Input: "Unique Any Armor + Orb of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Unique Any Armor + Orb Of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Any Armor"
  },
  {
    Description: "CRAFT ITEM - Unique Weapon & Corruption Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Rerolled Unique Item",
    Item: null,
    Output: "Weapon",
    Input: "Unique Weapon + Orb of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Unique Weapon + Orb Of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Weapon"
  },
  {
    Description: "CRAFT ITEM - Unique Amulet & Corruption Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Rerolled Unique Item",
    Item: null,
    Output: "Unique Amulet",
    Input: "Unique Amulet + Orb of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Unique Amulet + Orb Of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Unique Amulet"
  },
  {
    Description: "CRAFT ITEM - Unique Ring & Corruption Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Rerolled Unique Item",
    Item: null,
    Output: "Unique Ring",
    Input: "Unique Ring + Orb of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Unique Ring + Orb Of Corruption + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Unique Ring"
  },
  {
    Description: "CRAFT ITEM - Any Non-Throwing Weapon & Infusion Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Return Weapon Base as White, Elite, Maximum Sockets, Superior Rolls and +15% Enhanced Damage",
    Item: null,
    Output: "elite 6 Sockets",
    Input: "Weapon + Orb of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Weapon + Orb Of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Elite 6 Sockets"
  },
  {
    Description: "CRAFT ITEM - Any Helm & Infusion Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Return Helm Base as White, Elite, Maximum Sockets, Superior Rolls and +15% Enhanced Defense",
    Item: null,
    Output: "elite 4 Sockets",
    Input: "Helm + Orb of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Elite 4 Sockets"
  },
  {
    Description: "CRAFT ITEM - Any Torso & Infusion Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Return Torso Base as White, Elite, Maximum Sockets, Superior Rolls and +15% Enhanced Defense",
    Item: null,
    Output: "elite 4 Sockets",
    Input: "Armor + Orb of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Elite 4 Sockets"
  },
  {
    Description: "CRAFT ITEM - Any Shield & Infusion Orb & Mephisto's Animus & Baal's Calamity & Diablo's Ire = Return Shield Base as White, Elite, Maximum Sockets, Superior Rolls and +15% Enhanced Defense",
    Item: null,
    Output: "elite 4 Sockets",
    Input: "Any Shield + Orb of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Mephisto's Animus + Baal's Calamity + Diablo's Ire = Elite 4 Sockets"
  },
  {
    Description: "CRAFT ITEM - Mephisto's Animus & Baal's Calamity & Diablo's Ire = Hellfire Torch",
    Item: null,
    Output: "Hellfire Torch",
    Input: "Mephisto's Animus + Baal's Calamity + Diablo's Ire ",
    CubeRecipeDescription: "Mephisto's Animus + Baal's Calamity + Diablo's Ire = Hellfire Torch"
  },
  {
    Description: "CONVERT KEY - Terror Key + Corruption Orb + TP Tome  -> Hate Key",
    Item: null,
    Output: "Key of Hate",
    Input: "Key of Terror + Orb of Corruption + Tome of Town Portal ",
    CubeRecipeDescription: "Key Of Terror + Orb Of Corruption + Tome Of Town Portal = Key Of Hate"
  },
  {
    Description: "CONVERT KEY - Terror Key + Corruption Orb + ID Tome  -> Destruction Key",
    Item: null,
    Output: "Key of Destruction",
    Input: "Key of Terror + Orb of Corruption + Tome of Identify ",
    CubeRecipeDescription: "Key Of Terror + Orb Of Corruption + Tome Of Identify = Key Of Destruction"
  },
  {
    Description: "CONVERT KEY - Hate Key + Corruption Orb + TP Tome -> Destruction Key",
    Item: null,
    Output: "Key of Destruction",
    Input: "Key of Hate + Orb of Corruption + Tome of Town Portal ",
    CubeRecipeDescription: "Key Of Hate + Orb Of Corruption + Tome Of Town Portal = Key Of Destruction"
  },
  {
    Description: "CONVERT KEY - Hate Key + Corruption Orb + ID Tome -> Terror Key",
    Item: null,
    Output: "Key of Terror",
    Input: "Key of Hate + Orb of Corruption + Tome of Identify ",
    CubeRecipeDescription: "Key Of Hate + Orb Of Corruption + Tome Of Identify = Key Of Terror"
  },
  {
    Description: "CONVERT KEY - Destruction Key + Corruption Orb + TP Tome -> Terror Key",
    Item: null,
    Output: "Key of Terror",
    Input: "Key of Destruction + Orb of Corruption + Tome of Town Portal ",
    CubeRecipeDescription: "Key Of Destruction + Orb Of Corruption + Tome Of Town Portal = Key Of Terror"
  },
  {
    Description: "CONVERT KEY - Destruction Key + Corruption Orb + ID Tome -> Hate Key",
    Item: null,
    Output: "Key of Hate",
    Input: "Key of Destruction + Orb of Corruption + Tome of Identify ",
    CubeRecipeDescription: "Key Of Destruction + Orb Of Corruption + Tome Of Identify = Key Of Hate"
  },
  {
    Description: "CONVERT POTION - 1 Healing Potion (Any) & 1 Gem (Any) = Rejuvenation Potion",
    Item: null,
    Output: "Rejuvenation Potion",
    Input: "Healing Potion + Gem ",
    CubeRecipeDescription: "Healing Potion + Gem = Rejuvenation Potion"
  },
  {
    Description: "CONVERT POTION - 1 Healing Potion (Any) & 3 Gem (Any) = Full Rejuvenation Potion",
    Item: null,
    Output: "Full Rejuvenation Potion",
    Input: "Healing Potion + 3 Gem ",
    CubeRecipeDescription: "Healing Potion + 3 Gem = Full Rejuvenation Potion"
  },
  {
    Description: "CONVERT POTION - 1 Healing Potion (Any) & Gem Bag (3 Gems) = Full Rejuvenation Potion",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Healing Potion ",
    CubeRecipeDescription: "Gem Bag + Healing Potion = Gem Bag"
  },
  {
    Description: "CONVERT POTION - 3 Rejuvenation Potions = Full Rejuvenation Potion",
    Item: null,
    Output: "Full Rejuvenation Potion",
    Input: "3 Rejuvenation Potion ",
    CubeRecipeDescription: "3 Rejuvenation Potion = Full Rejuvenation Potion"
  },
  {
    Description: "CONVERT ARMOR -  Armor/Shield Any & 1 Unique Jewel & Ohm-Rune = Force Armor/Shield Ethereal",
    Item: null,
    Output: "Any Armor",
    Input: "Not Etheral Any Armor + Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Not Etheral Any Armor + Unique Jewel + Ohm Rune = Any Armor"
  },
  {
    Description: "CONVERT WEAPON - 1H Weapon Any & 1 Unique Jewel & Ohm-Rune = Force Weapon Ethereal",
    Item: null,
    Output: "1H Weapons",
    Input: "Not Etheral 1H Weapons + Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Not Etheral 1H Weapons + Unique Jewel + Ohm Rune = 1H Weapons"
  },
  {
    Description: "CONVERT WEAPON - 2H Weapon (Slam) Any & 1 Unique Jewel & Ohm-Rune = Force Weapon Ethereal",
    Item: null,
    Output: "Slam Weapons",
    Input: "Not Etheral Slam Weapons + Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Not Etheral Slam Weapons + Unique Jewel + Ohm Rune = Slam Weapons"
  },
  {
    Description: "CONVERT WEAPON - 2H Weapon (Spear/Polearm) & 1 Unique Jewel & Ohm-Rune = Force Weapon Ethereal",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Not Etheral Spears and Polearms + Unique Jewel + Ohm Rune ",
    CubeRecipeDescription: "Not Etheral Spears And Polearms + Unique Jewel + Ohm Rune = Spears And Polearms"
  },
  {
    Description: "CONVERT ARMOR - El-Rune & Hel-Rune & any armor/shield = Armor/Shield Normal",
    Item: null,
    Output: "Normal Any Armor",
    Input: "Any Armor + El Rune + Hel Rune ",
    CubeRecipeDescription: "Any Armor + El Rune + Hel Rune = Normal Any Armor"
  },
  {
    Description: "CONVERT WEAPON - El-Rune & Hel-Rune & any weapon = Weapon Normal",
    Item: null,
    Output: "Normal Weapon",
    Input: "Weapon + El Rune + Hel Rune ",
    CubeRecipeDescription: "Weapon + El Rune + Hel Rune = Normal Weapon"
  },
  {
    Description: "RECYCLE ITEM - 3 Unique Rings + ID Tome = Rare Jewel (100% plvl)",
    Item: null,
    Output: "Rare Jewel",
    Input: "3 Unique Ring + Tome of Identify ",
    CubeRecipeDescription: "3 Unique Ring + Tome Of Identify = Rare Jewel"
  },
  {
    Description: "RECYCLE ITEM - 3 Set Rings + ID Tome = Rare Jewel (100% plvl)",
    Item: null,
    Output: "Rare Jewel",
    Input: "3 Set Ring + Tome of Identify ",
    CubeRecipeDescription: "3 Set Ring + Tome Of Identify = Rare Jewel"
  },
  {
    Description: "RECYCLE ITEM - 3 Unique Amulets + ID Tome = Rare Jewel (100% plvl)",
    Item: null,
    Output: "Rare Jewel",
    Input: "3 Unique Amulet + Tome of Identify ",
    CubeRecipeDescription: "3 Unique Amulet + Tome Of Identify = Rare Jewel"
  },
  {
    Description: "RECYCLE ITEM - 3 Set Amulets + ID Tome = Rare Jewel (100% plvl)",
    Item: null,
    Output: "Rare Jewel",
    Input: "3 Set Amulet + Tome of Identify ",
    CubeRecipeDescription: "3 Set Amulet + Tome Of Identify = Rare Jewel"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Boots + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Boots + Tome of Identify ",
    CubeRecipeDescription: "5 Set Boots + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Boots + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Boots + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Boots + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Belts + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Belt + Tome of Identify ",
    CubeRecipeDescription: "5 Set Belt + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Belts + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Belt + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Belt + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Gloves + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Gloves + Tome of Identify ",
    CubeRecipeDescription: "5 Set Gloves + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Gloves + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Gloves + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Gloves + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Helms + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Helm + Tome of Identify ",
    CubeRecipeDescription: "5 Set Helm + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Helms + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Helm + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Helm + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Shields + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Any Shield + Tome of Identify ",
    CubeRecipeDescription: "5 Set Any Shield + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Shields + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Any Shield + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Any Shield + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Torsos + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Armor + Tome of Identify ",
    CubeRecipeDescription: "5 Set Armor + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Torsos + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Armor + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Armor + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Set Weapons + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Set Weapon + Tome of Identify ",
    CubeRecipeDescription: "5 Set Weapon + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "RECYCLE ITEM - 5 Unique Weapons + ID Tome = Gem Cluster",
    Item: null,
    Output: "Gem Cluster",
    Input: "5 Unique Weapon + Tome of Identify ",
    CubeRecipeDescription: "5 Unique Weapon + Tome Of Identify = Gem Cluster"
  },
  {
    Description: "REROLL RING = Gem Bag (3 Gems) + Magic Ring = New Magic Ring (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Ring ",
    CubeRecipeDescription: "Gem Bag + Magic Ring = Gem Bag"
  },
  {
    Description: "REROLL RING = Gem Bag (20 Gems) + Rare Ring = New Rare Ring (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Rare Ring ",
    CubeRecipeDescription: "Gem Bag + Rare Ring = Gem Bag"
  },
  {
    Description: "REROLL RING = Gem Bag (50 Gems) + Set Ring = New Set Ring (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Set Ring ",
    CubeRecipeDescription: "Gem Bag + Set Ring = Gem Bag"
  },
  {
    Description: "REROLL RING = Gem Bag (50 Gems) + Unique Ring = New Unique Ring (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Unique Ring ",
    CubeRecipeDescription: "Gem Bag + Unique Ring = Gem Bag"
  },
  {
    Description: "REROLL AMULET = Gem Bag (3 Gems) + Magic Amulet = New Magic Amulet (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Amulet ",
    CubeRecipeDescription: "Gem Bag + Magic Amulet = Gem Bag"
  },
  {
    Description: "REROLL AMULET= Gem Bag (20 Gems) + Rare Amulet = New Rare Amulet (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Rare Amulet ",
    CubeRecipeDescription: "Gem Bag + Rare Amulet = Gem Bag"
  },
  {
    Description: "REROLL AMULET = Gem Bag (50 Gems) + Set Amulet = New Set Amulet (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Set Amulet ",
    CubeRecipeDescription: "Gem Bag + Set Amulet = Gem Bag"
  },
  {
    Description: "REROLL AMULET = Gem Bag (50 Gems) + Unique Amulet = New Unique Amulet (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Unique Amulet ",
    CubeRecipeDescription: "Gem Bag + Unique Amulet = Gem Bag"
  },
  {
    Description: "REROLL CHARM - Gem Bag (3 Gems) + Small Magic Charm = New Small Magic Charm (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Small Charm ",
    CubeRecipeDescription: "Gem Bag + Magic Small Charm = Gem Bag"
  },
  {
    Description: "REROLL CHARM - Gem Bag (3 Gems) + Large Magic Charm = New Large Magic Charm (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Large Charm ",
    CubeRecipeDescription: "Gem Bag + Magic Large Charm = Gem Bag"
  },
  {
    Description: "REROLL CHARM - Gem Bag (3 Gems) + Grand Magic Charm = New Grand Magic Charm (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Grand Charm ",
    CubeRecipeDescription: "Gem Bag + Magic Grand Charm = Gem Bag"
  },
  {
    Description: "REROLL JEWEL - Gem Bag (3 Gems) + Magic Jewel = New Magic Jewel (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Magic Jewel ",
    CubeRecipeDescription: "Gem Bag + Magic Jewel = Gem Bag"
  },
  {
    Description: "REROLL JEWEL - Gem Bag (10 Gems) + Rare Jewel = New Rare Jewel (100% plvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Rare Jewel ",
    CubeRecipeDescription: "Gem Bag + Rare Jewel = Gem Bag"
  },
  {
    Description: "REROLL JEWEL - Gem Bag (50 Gems) + Unique Jewel = New Unique Jewel (100% ilvl)",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Unique Jewel ",
    CubeRecipeDescription: "Gem Bag + Unique Jewel = Gem Bag"
  },
  {
    Description: "REROLL RING - 3 Ring Magic = New Ring Magic (100% plvl)",
    Item: null,
    Output: "Magic Ring",
    Input: "3 Magic Ring ",
    CubeRecipeDescription: "3 Magic Ring = Magic Ring"
  },
  {
    Description: "REROLL RING - 3 Ring Rare = New Ring Rare (100% plvl)",
    Item: null,
    Output: "Rare Ring",
    Input: "3 Rare Ring ",
    CubeRecipeDescription: "3 Rare Ring = Rare Ring"
  },
  {
    Description: "REROLL AMULET - 3 Amulet Magic = Amulet Magic (100% plvl)",
    Item: null,
    Output: "Magic Amulet",
    Input: "3 Magic Amulet ",
    CubeRecipeDescription: "3 Magic Amulet = Magic Amulet"
  },
  {
    Description: "REROLL AMULET - 3 Amulet Rare = Amulet Rare (100% plvl)",
    Item: null,
    Output: "Rare Amulet",
    Input: "3 Rare Amulet ",
    CubeRecipeDescription: "3 Rare Amulet = Rare Amulet"
  },
  {
    Description: "REROLL CHARM - 3 Small Charms = New Small Charm (100% plvl)",
    Item: null,
    Output: "Magic Small Charm",
    Input: "3 Magic Small Charm ",
    CubeRecipeDescription: "3 Magic Small Charm = Magic Small Charm"
  },
  {
    Description: "REROLL CHARM - 3 Large Charms = New Large Charm (100% plvl)",
    Item: null,
    Output: "Magic Large Charm",
    Input: "3 Magic Large Charm ",
    CubeRecipeDescription: "3 Magic Large Charm = Magic Large Charm"
  },
  {
    Description: "REROLL CHARM - 3 Grand Charms = New Grand Charm (100% plvl)",
    Item: null,
    Output: "Magic Grand Charm",
    Input: "3 Magic Grand Charm ",
    CubeRecipeDescription: "3 Magic Grand Charm = Magic Grand Charm"
  },
  {
    Description: "UPGRADE JEWEL RARITY - 9 Jewel Magic = Jewel Rare (100% plvl)",
    Item: null,
    Output: "Rare Jewel",
    Input: "9 Magic Jewel ",
    CubeRecipeDescription: "9 Magic Jewel = Rare Jewel"
  },
  {
    Description: "UPGRADE JEWEL RARITY - 6 Jewel Rare = Jewel Unique (100% ilvl)",
    Item: null,
    Output: "Unique Jewel",
    Input: "6 Rare Jewel ",
    CubeRecipeDescription: "6 Rare Jewel = Unique Jewel"
  },
  {
    Description: "UPGRADE CHARM TIER - T1 Splash Charm & Gem Bag (1 Gem) = T2 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Lesser Might ",
    CubeRecipeDescription: "Gem Bag + Collin's Lesser Might = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T2 Splash Charm & Nef-Rune & Gem Bag (1 Gem) = T3 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Minor Might + Nef Rune ",
    CubeRecipeDescription: "Gem Bag + Collin's Minor Might + Nef Rune = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T3 Splash Charm & Sol-Rune & Gem Bag (1 Gem) = T4 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Might + Sol Rune ",
    CubeRecipeDescription: "Gem Bag + Collin's Might + Sol Rune = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T4 Splash Charm & Hel-Rune & Gem Bag (2 Gems) & Magic Jewel = T5 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Greater Might + Hel Rune + Magic Jewel ",
    CubeRecipeDescription: "Gem Bag + Collin's Greater Might + Hel Rune + Magic Jewel = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T5 Splash Charm & Fal-Rune & Gem Bag (3 Gems) & 2 Magic Jewels = T6 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Fury + Fal Rune + 2 Magic Jewel ",
    CubeRecipeDescription: "Gem Bag + Collin's Fury + Fal Rune + 2 Magic Jewel = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T6 Splash Charm & Pul-Rune & Eth-Rune & Gem Bag (4 Gems) & 3 Magic Jewels = T7 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Empowered Fury + Pul Rune + Eth Rune + 3 Magic Jewel ",
    CubeRecipeDescription: "Gem Bag + Collin's Empowered Fury + Pul Rune + Eth Rune + 3 Magic Jewel = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T7 Splash Charm & Mal-Rune & Tal-Rune & Gem Bag (5 Gems) & 4 Magic Jewels = T8 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Devastation + Mal Rune + Tal Rune + 4 Magic Jewel ",
    CubeRecipeDescription: "Gem Bag + Collin's Devastation + Mal Rune + Tal Rune + 4 Magic Jewel = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - T8 Splash Charm & Ohm-Rune & Ral-Rune & Gem Bag (10 Gems) & Rare Jewel & Magic Small Charm = T9 Splash Charm",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Collin's Furious Devastation + Ohm Rune + Ral Rune + Rare Jewel + Magic Small Charm ",
    CubeRecipeDescription: "Gem Bag + Collin's Furious Devastation + Ohm Rune + Ral Rune + Rare Jewel + Magic Small Charm = Gem Bag"
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (0/10) & Corruption Orb & Standard of Heroes = 1/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (1/10) & Corruption Orb & Standard of Heroes = 2/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (2/10) & Corruption Orb & Standard of Heroes = 3/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (3/10) & Corruption Orb & Standard of Heroes = 4/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (4/10) & Corruption Orb & Standard of Heroes = 5/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (5/10) & Corruption Orb & Standard of Heroes = 6/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (6/10) & Corruption Orb & Standard of Heroes = 7/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (7/10) & Corruption Orb & Standard of Heroes = 8/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (8/10) & Corruption Orb & Standard of Heroes = 9/10 Upgrades",
    Item: null,
    Output: "",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = "
  },
  {
    Description: "UPGRADE CHARM TIER - Hellfire Torch (9/10) & Corruption Orb & Standard of Heroes = Obsidian Beacon",
    Item: null,
    Output: "Obsidian Beacon",
    Input: "Hellfire Torch + Orb of Corruption + Standard of Heroes ",
    CubeRecipeDescription: "Hellfire Torch + Orb Of Corruption + Standard Of Heroes = Obsidian Beacon"
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus & Jah-Rune & Ith-Rune & Ber-Rune = 1/5 Upgrades",
    Item: null,
    Output: "",
    Input: "Annihilus + Jah Rune + Ith Rune + Ber Rune ",
    CubeRecipeDescription: "Annihilus + Jah Rune + Ith Rune + Ber Rune = "
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus 1/5 & 3 Infusion Orbs = 2/5 Upgrades",
    Item: null,
    Output: "",
    Input: "Annihilus + 3 Orb of Infusion ",
    CubeRecipeDescription: "Annihilus + 3 Orb Of Infusion = "
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus 2/5 & 3 Assemblage Orbs = 3/5 Upgrades",
    Item: null,
    Output: "",
    Input: "Annihilus + 3 Orb of Assemblage ",
    CubeRecipeDescription: "Annihilus + 3 Orb Of Assemblage = "
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus 3/5 & 3 Corruption Orbs = 4/5 Upgrades",
    Item: null,
    Output: "",
    Input: "Annihilus + 3 Orb of Corruption ",
    CubeRecipeDescription: "Annihilus + 3 Orb Of Corruption = "
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus 4/5 & 3 Conversion Orbs = 5/5 Upgrades",
    Item: null,
    Output: "",
    Input: "Annihilus + 3 Orb of Conversion ",
    CubeRecipeDescription: "Annihilus + 3 Orb Of Conversion = "
  },
  {
    Description: "UPGRADE CHARM TIER - Annihilus 5/5 & 3 Shadow Orbs = Black Soulstone",
    Item: null,
    Output: "Black Soulstone",
    Input: "Annihilus + 3 Orb of Shadows ",
    CubeRecipeDescription: "Annihilus + 3 Orb Of Shadows = Black Soulstone"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Rare Normal & Ral-Rune & Thul-Rune & Amethyst = Armor Rare Exceptional",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Rare Any Armor + Ral Rune + Thul Rune + Amethyst ",
    CubeRecipeDescription: "Basic Rare Any Armor + Ral Rune + Thul Rune + Amethyst = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Rare Exceptional & Ko-Rune & Pul-Rune & Amethyst = Armor Rare Elite",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Rare Any Armor + Ko Rune + Pul Rune + Amethyst ",
    CubeRecipeDescription: "Exceptional Rare Any Armor + Ko Rune + Pul Rune + Amethyst = Elite Any Armor"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Set Normal & Tal-Rune & Shael-Rune & Diamond = Armor Set Exceptional",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Set Any Armor + Tal Rune + Shael Rune + Diamond ",
    CubeRecipeDescription: "Basic Set Any Armor + Tal Rune + Shael Rune + Diamond = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Set Exceptional & Ko-Rune & Lem-Rune & Diamond = Armor Set Elite",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Set Any Armor + Ko Rune + Lem Rune + Diamond ",
    CubeRecipeDescription: "Exceptional Set Any Armor + Ko Rune + Lem Rune + Diamond = Elite Any Armor"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Unique Normal & Tal-Rune & Shael-Rune & Diamond = Unique Armor",
    Item: null,
    Output: "exceptional Any Armor",
    Input: "basic Unique Any Armor + Tal Rune + Shael Rune + Diamond ",
    CubeRecipeDescription: "Basic Unique Any Armor + Tal Rune + Shael Rune + Diamond = Exceptional Any Armor"
  },
  {
    Description: "UPGRADE ARMOR QUALITY - Armor Unique Exceptional & Ko-Rune & Lem-Rune & Diamond = Unique Armor",
    Item: null,
    Output: "elite Any Armor",
    Input: "exceptional Unique Any Armor + Ko Rune + Lem Rune + Diamond ",
    CubeRecipeDescription: "Exceptional Unique Any Armor + Ko Rune + Lem Rune + Diamond = Elite Any Armor"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Rare Normal & Ort-Rune & Amn-Rune & Sapphire = Weapon Rare Exceptional",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Rare Weapon + Ort Rune + Amn Rune + Sapphire ",
    CubeRecipeDescription: "Basic Rare Weapon + Ort Rune + Amn Rune + Sapphire = Exceptional Weapon"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Rare Exceptional & Fal-Rune & Um-Rune & Sapphire = Weapon Rare Elite",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Rare Weapon + Fal Rune + Um Rune + Sapphire ",
    CubeRecipeDescription: "Exceptional Rare Weapon + Fal Rune + Um Rune + Sapphire = Elite Weapon"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Set Normal & Ral-Rune & Sol-Rune & Emerald = Weapon Set Exceptional",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Set Weapon + Ral Rune + Sol Rune + Emerald ",
    CubeRecipeDescription: "Basic Set Weapon + Ral Rune + Sol Rune + Emerald = Exceptional Weapon"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Set Exceptional & Lum-Rune & Pul-Rune & Emerald = Weapon Set Elite",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Set Weapon + Lum Rune + Pul Rune + Emerald ",
    CubeRecipeDescription: "Exceptional Set Weapon + Lum Rune + Pul Rune + Emerald = Elite Weapon"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Unique Normal & Ral-Rune & Sol-Rune & Emerald = Weapon Unique Exceptional",
    Item: null,
    Output: "exceptional Weapon",
    Input: "basic Unique Weapon + Ral Rune + Sol Rune + Emerald ",
    CubeRecipeDescription: "Basic Unique Weapon + Ral Rune + Sol Rune + Emerald = Exceptional Weapon"
  },
  {
    Description: "UPGRADE WEAPON QUALITY - Weapon Unique Exceptional & Lum-Rune & Pul-Rune & Emerald = Weapon Unique Elite",
    Item: null,
    Output: "elite Weapon",
    Input: "exceptional Unique Weapon + Lum Rune + Pul Rune + Emerald ",
    CubeRecipeDescription: "Exceptional Unique Weapon + Lum Rune + Pul Rune + Emerald = Elite Weapon"
  },
  {
    Description: "REPAIR ETHEREAL - Weapon Any & 2 Jewel Rare & Pul-Rune = Repaired Ethereal Weapon",
    Item: null,
    Output: "Weapon Repair durability",
    Input: "Etheral Weapon + 2 Rare Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Weapon + 2 Rare Jewel + Pul Rune = Weapon Repair Durability"
  },
  {
    Description: "REPAIR ETHEREAL - Armor Any & 2 Jewel Rare & Pul-Rune = Repaired Ethereal Armor",
    Item: null,
    Output: "Any Armor Repair durability",
    Input: "Etheral Any Armor + 2 Rare Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Any Armor + 2 Rare Jewel + Pul Rune = Any Armor Repair Durability"
  },
  {
    Description: "REPAIR ETHEREAL - Shield Any & 2 Jewel Rare & Pul-Rune = Repaired Ethereal Shield",
    Item: null,
    Output: "Any Shield Repair durability",
    Input: "Etheral Any Shield + 2 Rare Jewel + Pul Rune ",
    CubeRecipeDescription: "Etheral Any Shield + 2 Rare Jewel + Pul Rune = Any Shield Repair Durability"
  },
  {
    Description: "REPAIR MISSLE - Any Quiver or Any Bolt Case + HP Potion = Restore Quantity to Full",
    Item: null,
    Output: "Missile",
    Input: "Missile + Healing Potion ",
    CubeRecipeDescription: "Missile + Healing Potion = Missile"
  },
  {
    Description: "REPAIR NORMAL - Weapon & Ort-Rune & Gem (Any) = Fully Repaired and Recharged Weapon",
    Item: null,
    Output: "255 Weapon Recharge Quantity Repair durability",
    Input: "Not Etheral Weapon + Ort Rune + Gem ",
    CubeRecipeDescription: "Not Etheral Weapon + Ort Rune + Gem = 255 Weapon Recharge Quantity Repair Durability"
  },
  {
    Description: "REPAIR NORMAL - Armor & Ral-Rune & Gem (Any) = Fully Repaired and Recharged Armor",
    Item: null,
    Output: "255 Any Armor Recharge Quantity Repair durability",
    Input: "Not Etheral Any Armor + Ral Rune + Gem ",
    CubeRecipeDescription: "Not Etheral Any Armor + Ral Rune + Gem = 255 Any Armor Recharge Quantity Repair Durability"
  },
  {
    Description: "PORTAL - Wirt's Leg = Portal to The Secret Cow Level",
    Item: null,
    Output: "Cow Portal",
    Input: "Wirt's Leg ",
    CubeRecipeDescription: "Wirt's Leg = Cow Portal"
  },
  {
    Description: "PORTAL - Key of Terror & Key of Hate & Key of Destruction = Portal to Matron's Den/Forgotten Sands/Furnace of Pain (Random)",
    Item: null,
    Output: "Pandemonium Portal",
    Input: "Key of Terror + Key of Hate + Key of Destruction ",
    CubeRecipeDescription: "Key Of Terror + Key Of Hate + Key Of Destruction = Pandemonium Portal"
  },
  {
    Description: "PORTAL - Diablo's Horn & Baal's Eye & Mephisto's Brain = Portal to Tristram (Pandemonium Finale)",
    Item: null,
    Output: "Pandemonium Finale Portal",
    Input: "Diablo's Horn + Baal's Eye + Mephisto's Brain ",
    CubeRecipeDescription: "Diablo's Horn + Baal's Eye + Mephisto's Brain = Pandemonium Finale Portal"
  },
  {
    Description: "QUEST - Staff of Kings & Amulet of the Viper = Horadric Staff",
    Item: null,
    Output: "Horadric Staff",
    Input: "Shaft of the Horadric Staff + Amulet of the Viper ",
    CubeRecipeDescription: "Shaft Of The Horadric Staff + Amulet Of The Viper = Horadric Staff"
  },
  {
    Description: "QUEST - Khalim's Flail & Khalim's Heart & Khalim's Eye & Khalim's Brain = Khalim's Will",
    Item: null,
    Output: "Khalim's Will",
    Input: "Khalim's Flail + Khalim's Heart + Khalim's Eye + Khalim's Brain ",
    CubeRecipeDescription: "Khalim's Flail + Khalim's Heart + Khalim's Eye + Khalim's Brain = Khalim's Will"
  },
  {
    Description: "ITEM UPGRADE - Amulet & Topaz = +12% Magic Find & +25% Gold Find",
    Item: null,
    Output: "",
    Input: "Amulet + Topaz ",
    CubeRecipeDescription: "Amulet + Topaz = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Ruby = +25 Life & +4 Life / Kill",
    Item: null,
    Output: "",
    Input: "Amulet + Ruby ",
    CubeRecipeDescription: "Amulet + Ruby = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Sapphire = +25 Mana & +4 Mana / Kill",
    Item: null,
    Output: "",
    Input: "Amulet + Sapphire ",
    CubeRecipeDescription: "Amulet + Sapphire = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Emerald = +5 Dexterity & +5 Vitality",
    Item: null,
    Output: "",
    Input: "Amulet + Emerald ",
    CubeRecipeDescription: "Amulet + Emerald = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Skull = +5 Energy & +5 Vitality",
    Item: null,
    Output: "",
    Input: "Amulet + Skull ",
    CubeRecipeDescription: "Amulet + Skull = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Amethyst = +5 Strength & +5 Vitalty",
    Item: null,
    Output: "",
    Input: "Amulet + Amethyst ",
    CubeRecipeDescription: "Amulet + Amethyst = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Ruby & Tir-Rune = +10 Fire Resistance",
    Item: null,
    Output: "",
    Input: "Amulet + Ruby + Tir Rune ",
    CubeRecipeDescription: "Amulet + Ruby + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Sapphire & Tir-Rune = +10 Cold Resistance",
    Item: null,
    Output: "",
    Input: "Amulet + Sapphire + Tir Rune ",
    CubeRecipeDescription: "Amulet + Sapphire + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Topaz & Tir-Rune = +10 Lightning Resistance",
    Item: null,
    Output: "",
    Input: "Amulet + Topaz + Tir Rune ",
    CubeRecipeDescription: "Amulet + Topaz + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Emerald & Tir-Rune = +10 Poison Resistance",
    Item: null,
    Output: "",
    Input: "Amulet + Emerald + Tir Rune ",
    CubeRecipeDescription: "Amulet + Emerald + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Diamond & Magic Jewel & Tir-Rune = +5 All Resistances",
    Item: null,
    Output: "",
    Input: "Amulet + Diamond + Magic Jewel + Tir Rune ",
    CubeRecipeDescription: "Amulet + Diamond + Magic Jewel + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Topaz & Magic Jewel = +2 Random Assassin Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Topaz + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Ruby & Magic Jewel = +2 Random Barbarian Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Ruby + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Sapphire & Magic Jewel = +2 Random Sorceress Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Sapphire + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Emerald & Magic Jewel = +2 Random Druid Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Emerald + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Skull & Magic Jewel = +2 Random Necromancer Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Skull + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Skull + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Amethyst & Magic Jewel = +2 Random Amazon Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Amethyst + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Diamond & Magic Jewel = +2 Random Paladin Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Amulet + Diamond + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Topaz & Rare Jewel = +25% Magic Find & +50% Gold Find",
    Item: null,
    Output: "",
    Input: "Amulet + Topaz + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Topaz + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Ruby & Rare Jewel = +75 Life & +8 Life / Kill",
    Item: null,
    Output: "",
    Input: "Amulet + Ruby + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Ruby + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Sapphire & Rare Jewel = +75 Mana & +8 Mana / Kill",
    Item: null,
    Output: "",
    Input: "Amulet + Sapphire + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Sapphire + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Emerald & Rare Jewel = +12 Dexterity & +12 Vitality",
    Item: null,
    Output: "",
    Input: "Amulet + Emerald + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Emerald + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Skull & Rare Jewel = +12 Energy & +12 Vitality",
    Item: null,
    Output: "",
    Input: "Amulet + Skull + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Skull + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Amethyst & Rare Jewel = +12 Strength & +12 Vitalty",
    Item: null,
    Output: "",
    Input: "Amulet + Amethyst + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Amethyst + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Diamond & Rare Jewel = +12 All Resistances",
    Item: null,
    Output: "",
    Input: "Amulet + Diamond + Rare Jewel + Orb of Infusion ",
    CubeRecipeDescription: "Amulet + Diamond + Rare Jewel + Orb Of Infusion = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Assassin Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Barbarian Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Sorceress Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Druid Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Necromancer Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Amazon Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Amulet & Infusion Orb & Unique Jewel = +1 Paladin Skills",
    Item: null,
    Output: "",
    Input: "Amulet + Orb of Infusion + Unique Jewel ",
    CubeRecipeDescription: "Amulet + Orb Of Infusion + Unique Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Topaz & Magic Jewel = +10% Magic Find  & +20% Gold Find",
    Item: null,
    Output: "",
    Input: "Ring + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Ring + Topaz + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Ruby & Magic Jewel = +20 HP & +2 Life / Kill",
    Item: null,
    Output: "",
    Input: "Ring + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Ring + Ruby + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Sapphire & Magic Jewel = +20 Mana & +2 Mana / Kill",
    Item: null,
    Output: "",
    Input: "Ring + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Ring + Sapphire + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Ruby & Tir-Rune = +10 Fire Resistance",
    Item: null,
    Output: "",
    Input: "Ring + Ruby + Tir Rune ",
    CubeRecipeDescription: "Ring + Ruby + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Sapphire & Tir-Rune = +10 Cold Resistance",
    Item: null,
    Output: "",
    Input: "Ring + Sapphire + Tir Rune ",
    CubeRecipeDescription: "Ring + Sapphire + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Topaz & Tir-Rune = +10 Lightning Resistance",
    Item: null,
    Output: "",
    Input: "Ring + Topaz + Tir Rune ",
    CubeRecipeDescription: "Ring + Topaz + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Emerald & Tir-Rune = +10 Poison Resistance",
    Item: null,
    Output: "",
    Input: "Ring + Emerald + Tir Rune ",
    CubeRecipeDescription: "Ring + Emerald + Tir Rune = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +50 HP & +5 Life / Kill",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Skull & Io-Rune & Magic Jewel = +5% Life Steal",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Skull + Io Rune + Magic Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Skull + Io Rune + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +5% Mana Steal",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +5 All Resistances",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +20% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Emerald & Vex-Rune & Rare Jewel = +6 All Attributes",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Emerald + Vex Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Emerald + Vex Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Topaz & Ohm-Rune & Rare Jewel = +4% Experience Gained",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Topaz + Ohm Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Topaz + Ohm Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Emerald & Gul-Rune & Rare Jewel = +8% Faster Attack Speed",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Emerald + Gul Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Emerald + Gul Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Emerald & Lo-Rune & Rare Jewel = +8% Faster Cast Rate",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Emerald + Lo Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Emerald + Lo Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +6% Max Mana",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Amethyst & Ber-Rune & Rare Jewel = +4% Damage Reduction",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Amethyst + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Amethyst + Ber Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Ring & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +6% Max HP",
    Item: null,
    Output: "",
    Input: "Ring + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Ring + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = "
  },
  {
    Description: "ITEM UPGRADE - Belt & Topaz & Magic Jewel = +7% Magic Find  & +10% Gold Find",
    Item: null,
    Output: "Belt",
    Input: "Belt + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Belt + Topaz + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Ruby & Magic Jewel = +15 HP & +2 Life / Kill",
    Item: null,
    Output: "Belt",
    Input: "Belt + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Belt + Ruby + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Belt",
    Input: "Belt + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Belt + Sapphire + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Emerald & Magic Jewel = +5 Dexterity & +5 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Belt + Emerald + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Amethyst & Magic Jewel = +5 Strength & +5 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Belt + Amethyst + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Skull & Magic Jewel = +5 Energy & +5 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Skull + Magic Jewel ",
    CubeRecipeDescription: "Belt + Skull + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Diamond & Magic Jewel = +2 All Resistances",
    Item: null,
    Output: "Belt",
    Input: "Belt + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Belt + Diamond + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Eth-Rune & Magic Jewel = +4% Mana Regen",
    Item: null,
    Output: "Belt",
    Input: "Belt + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Eth Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Ith-Rune & Magic Jewel = +6% Damage Goes To Mana",
    Item: null,
    Output: "Belt",
    Input: "Belt + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Ith Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Sol-Rune & Magic Jewel = Physical Damage Reduced By 3",
    Item: null,
    Output: "Belt",
    Input: "Belt + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Sol Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Emerald & Shael-Rune & Magic Jewel = +7% Faster Hit Recovery",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Emerald + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Emerald + Shael Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +50 HP & +4 Life / Kill",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +8% Mana Regen",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +10 Dexterity & +10 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +10 Strength & +10 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +10 Energy & +10 Vitality",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Skull & Lem-Rune & Magic Jewel =+50% Enhanced Defense",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Skull + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Skull + Lem Rune + Magic Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Diamond & Pul-Rune & Rare Jewel =+4 All Attributes",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Diamond + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Diamond + Pul Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +4 All Resistances",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = Magic Damage Reduced By 3",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +20% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +5% Max Mana",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Amethyst & Ber-Rune & Rare Jewel = +4% Damage Reduction",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Amethyst + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Amethyst + Ber Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +5% Max HP",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Sapphire & Cham-Rune & Unique Jewel = +6 All Attributes & +6 All Resistances",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Sapphire + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Sapphire + Cham Rune + Unique Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Topaz & Cham-Rune & Unique Jewel = +20% Magic Find & +40% Gold Find & +5% Reduced Vendor Prices",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Topaz + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Topaz + Cham Rune + Unique Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Belt & Infusion Orb & Amethyst & Cham-Rune & Unique Jewel = +150 HP & +150 Mana & +100% Enhanced Defense",
    Item: null,
    Output: "Belt",
    Input: "Belt + Orb of Infusion + Amethyst + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Belt + Orb Of Infusion + Amethyst + Cham Rune + Unique Jewel = Belt"
  },
  {
    Description: "ITEM UPGRADE - Boots & Topaz & Magic Jewel = +7% Magic Find  & +10% Gold Find",
    Item: null,
    Output: "Boots",
    Input: "Boots + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Boots + Topaz + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Ruby & Magic Jewel = +15 HP & +2 Life / Kill",
    Item: null,
    Output: "Boots",
    Input: "Boots + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Boots + Ruby + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Boots",
    Input: "Boots + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Boots + Sapphire + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Emerald & Magic Jewel = +5 Dexterity & +5 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Boots + Emerald + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Amethyst & Magic Jewel = +5 Strength & +5 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Boots + Amethyst + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Skull & Magic Jewel = +5 Energy & +5 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Skull + Magic Jewel ",
    CubeRecipeDescription: "Boots + Skull + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Diamond & Magic Jewel = +2 All Resistances",
    Item: null,
    Output: "Boots",
    Input: "Boots + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Boots + Diamond + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Nef-Rune & Magic Jewel = +5% Faster Run/Walk",
    Item: null,
    Output: "Boots",
    Input: "Boots + Nef Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Nef Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Eth-Rune & Magic Jewel = +4% Mana Regen",
    Item: null,
    Output: "Boots",
    Input: "Boots + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Eth Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Ith-Rune & Magic Jewel = +6% Damage Goes To Mana",
    Item: null,
    Output: "Boots",
    Input: "Boots + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Ith Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Sol-Rune & Magic Jewel = Physical Damage Reduced By 3",
    Item: null,
    Output: "Boots",
    Input: "Boots + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Sol Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +3 Mana / Kill",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Emerald & Sol-Rune & Magic Jewel = +10% Faster Run/Walk",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Emerald + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Emerald + Sol Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Amethyst & Shael-Rune & Magic Jewel = +7% Faster Hit Recovery",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Amethyst + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Amethyst + Shael Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +50 HP & +4 Life / Kill",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +8% Mana Regen",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +10 Dexterity & +10 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +10 Strength & +10 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +10 Energy & +10 Vitality",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Skull & Lem-Rune & Magic Jewel =+50% Enhanced Defense",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Skull + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Skull + Lem Rune + Magic Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Diamond & Pul-Rune & Rare Jewel =+4 All Attributes",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Diamond + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Diamond + Pul Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +4 All Resistances",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = Magic Damage Reduced By 3",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +20% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +6% Max Mana",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +4% Experience Gained",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +6% Max HP",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Topaz & Cham-Rune & Unique Jewel = +15% Faster Run/Walk & +12% Magic Find & +30% Gold Find",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Topaz + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Topaz + Cham Rune + Unique Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Diamond & Cham-Rune & Unique Jewel = +100% Enhanced Defense & +100 Thorns",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Diamond + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Diamond + Cham Rune + Unique Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Boots & Infusion Orb & Amethyst & Zod-Rune & Unique Jewel = +8% Max Mana & +8% Max HP",
    Item: null,
    Output: "Boots",
    Input: "Boots + Orb of Infusion + Amethyst + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Boots + Orb Of Infusion + Amethyst + Zod Rune + Unique Jewel = Boots"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Topaz & Magic Jewel = +7% Magic Find  & +10% Gold Find",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Topaz + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Ruby & Magic Jewel = +15 HP & +2 Life / Kill",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Ruby + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Sapphire + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Emerald & Magic Jewel = +5 Dexterity & +5 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Emerald + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Amethyst & Magic Jewel = +5 Strength & +5 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Amethyst + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Skull & Magic Jewel = +5 Energy & +5 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Skull + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Skull + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Diamond & Magic Jewel = +2 All Resistances",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Diamond + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Eth-Rune & Magic Jewel = +4% Mana Regen",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Eth Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Ith-Rune & Magic Jewel = +6% Damage Goes To Mana",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Ith Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Sol-Rune & Magic Jewel = Physical Damage Reduced By 3",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Sol Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Skull & Amn-Rune & Magic Jewel = +75 Thorns",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Skull + Amn Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Skull + Amn Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Amethyst & Sol-Rune & Magic Jewel = +7% Faster Attack Speed",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Amethyst + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Amethyst + Sol Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Sapphire & Shael-Rune & Magic Jewel = +7% Faster Cast Rate",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Sapphire + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Sapphire + Shael Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +50 HP & +8 Life / Kill",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +8% Mana Regen",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +10 Dexterity & +10 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +10 Strength & +10 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +10 Energy & +10 Vitality",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Topaz & Pul-Rune & Rare Jewel =+4 All Attributes",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Topaz + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Topaz + Pul Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +4 All Resistances",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Skull & Mal-Rune & Rare Jewel = Magic Damage Reduced By 3",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Skull + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Skull + Mal Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +20% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +6% Max Mana",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +6% Max HP",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Ruby & Cham-Rune & Unique Jewel = +6% Crushing Blow",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Ruby + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Ruby + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Sapphire & Cham-Rune & Unique Jewel = +6% Deadly Strike",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Sapphire + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Sapphire + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Emerald & Cham-Rune & Unique Jewel = +6% Open Wounds",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Emerald + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Emerald + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Diamond & Cham-Rune & Unique Jewel = +6% Pierce",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Diamond + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Diamond + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Topaz & Cham-Rune & Unique Jewel = +10% Slows Target",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Topaz + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Topaz + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Gloves & Infusion Orb & Skull & Cham-Rune & Unique Jewel = +10% Hit Blinds Target",
    Item: null,
    Output: "Gloves",
    Input: "Gloves + Orb of Infusion + Skull + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Gloves + Orb Of Infusion + Skull + Cham Rune + Unique Jewel = Gloves"
  },
  {
    Description: "ITEM UPGRADE - Helm & Topaz & Magic Jewel = +7% Magic Find  & +10% Gold Find",
    Item: null,
    Output: "Helm",
    Input: "Helm + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Helm + Topaz + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Ruby & Magic Jewel = +15 HP & +2 Life / Kill",
    Item: null,
    Output: "Helm",
    Input: "Helm + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Helm + Ruby + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Helm",
    Input: "Helm + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Helm + Sapphire + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Emerald & Magic Jewel = +5 Dexterity & +5 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Helm + Emerald + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Amethyst & Magic Jewel = +5 Strength & +5 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Helm + Amethyst + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Skull & Magic Jewel = +5 Energy & +5 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Skull + Magic Jewel ",
    CubeRecipeDescription: "Helm + Skull + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Diamond & Magic Jewel = +2 All Resistances",
    Item: null,
    Output: "Helm",
    Input: "Helm + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Helm + Diamond + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Eth-Rune & Magic Jewel = +4% Mana Regen",
    Item: null,
    Output: "Helm",
    Input: "Helm + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Eth Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Ith-Rune & Magic Jewel = +6% Damage Goes To Mana",
    Item: null,
    Output: "Helm",
    Input: "Helm + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Ith Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Sol-Rune & Magic Jewel = Physical Damage Reduced By 3",
    Item: null,
    Output: "Helm",
    Input: "Helm + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Sol Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Emerald & Thul-Rune & Magic Jewel = Ignore Target's Defense",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Emerald + Thul Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Emerald + Thul Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Skull & Amn-Rune & Magic Jewel = +75 Thorns",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Skull + Amn Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Skull + Amn Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +50 HP & +8 Life / Kill",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +8% Mana Regen",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +10 Dexterity & +10 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +10 Strength & +10 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +10 Energy & +10 Vitality",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Diamond & Pul-Rune & Rare Jewel =+4 All Attributes",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Diamond + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Diamond + Pul Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +4 All Resistances",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = Magic Damage Reduced By 3",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +20% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +6% Max Mana",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Amethyst & Ber-Rune & Rare Jewel = +4% Damage Reduction",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Amethyst + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Amethyst + Ber Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +6% Max HP",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Ruby & Cham-Rune & Unique Jewel = +2 Fire Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Ruby + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Ruby + Cham Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Sapphire & Cham-Rune & Unique Jewel = +2 Cold Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Sapphire + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Sapphire + Cham Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Topaz & Cham-Rune & Unique Jewel = +2 Lightning Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Topaz + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Topaz + Cham Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Emerald & Cham-Rune & Unique Jewel = +2 Poison Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Emerald + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Emerald + Cham Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Diamond & Cham-Rune & Unique Jewel = +2 Magic Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Diamond + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Diamond + Cham Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Helm & Infusion Orb & Skull & Zod-Rune & Unique Jewel = +1 All Skills",
    Item: null,
    Output: "Helm",
    Input: "Helm + Orb of Infusion + Skull + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Helm + Orb Of Infusion + Skull + Zod Rune + Unique Jewel = Helm"
  },
  {
    Description: "ITEM UPGRADE - Shield & Topaz & Magic Jewel = +7% Magic Find  & +10% Gold Find",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Topaz + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Ruby & Magic Jewel = +15 HP & +4 Life / Kill",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Ruby + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Sapphire + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Emerald & Magic Jewel = +7 Dexterity & +7 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Emerald + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Amethyst & Magic Jewel = +7 Strength & +7 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Amethyst + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Skull & Magic Jewel = +7 Energy & +7 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Skull + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Skull + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Diamond & Magic Jewel = +2 All Resistances",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Diamond + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Eth-Rune & Magic Jewel = +4% Mana Regen",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Eth Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Ith-Rune & Magic Jewel = +6% Damage Goes To Mana",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Ith Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Sol-Rune & Magic Jewel = Physical Damage Reduced By 3",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Sol Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Skull & Amn-Rune & Magic Jewel = +100 Thorns",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Skull + Amn Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Skull + Amn Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Diamond & Sol-Rune & Magic Jewel = +50% Enhanced Defense",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Diamond + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Diamond + Sol Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Ruby & Shael-Rune & Magic Jewel = +5% Faster Block Rate",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Ruby + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Ruby + Shael Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Sapphire & Shael-Rune & Magic Jewel = +5% Increased Block Chance",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Sapphire + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Sapphire + Shael Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Emerald & Shael-Rune & Magic Jewel = +7% Faster Hit Recovery",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Emerald + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Emerald + Shael Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +75 HP & +8 Life / Kill",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +10% Mana Regen",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +12 Dexterity & +10 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +12 Strength +10 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +12 Energy +10 Vitality",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Diamond & Pul-Rune & Rare Jewel =+6 All Attributes",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Diamond + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Diamond + Pul Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +6 All Resistances",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = Magic Damage Reduced By 4",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +6% Max Mana",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +6% Damage Reduction",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +6% Max HP",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Shield & Infusion Orb & Diamond & Zod-Rune & Unique Jewel = +2 Max All Resistances & +3 All Resistances",
    Item: null,
    Output: "Any Shield",
    Input: "Any Shield + Orb of Infusion + Diamond + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Any Shield + Orb Of Infusion + Diamond + Zod Rune + Unique Jewel = Any Shield"
  },
  {
    Description: "ITEM UPGRADE - Chest & Topaz & Magic Jewel = +15% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Armor",
    Input: "Armor + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Armor + Topaz + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Ruby & Magic Jewel = +15 HP & +4 Life / Kill",
    Item: null,
    Output: "Armor",
    Input: "Armor + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Armor + Ruby + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Sapphire & Magic Jewel = +15 Mana & +2 Mana / Kill",
    Item: null,
    Output: "Armor",
    Input: "Armor + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Armor + Sapphire + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Emerald & Magic Jewel = +7 Dexterity & +7 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Armor + Emerald + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Amethyst & Magic Jewel = +7 Strength & +7 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Armor + Amethyst + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Skull & Magic Jewel = +7 Energy & +7 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Skull + Magic Jewel ",
    CubeRecipeDescription: "Armor + Skull + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Diamond & Magic Jewel = +3 All Resistances",
    Item: null,
    Output: "Armor",
    Input: "Armor + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Armor + Diamond + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Eth-Rune & Magic Jewel = +5% Mana Regen",
    Item: null,
    Output: "Armor",
    Input: "Armor + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Eth Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Ith-Rune & Magic Jewel = +10% Damage Goes To Mana",
    Item: null,
    Output: "Armor",
    Input: "Armor + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Ith Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Sol-Rune & Magic Jewel = Physical Damage Reduced By 5",
    Item: null,
    Output: "Armor",
    Input: "Armor + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Sol Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Sapphire & Ith-Rune & Magic Jewel = +50 Mana & +4 Mana / Kill",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Sapphire + Ith Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Sapphire + Ith Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Skull & Amn-Rune & Magic Jewel = +150 Thorns",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Skull + Amn Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Skull + Amn Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Emerald & Shael-Rune & Magic Jewel = +10% Faster Run/Walk",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Emerald + Shael Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Emerald + Shael Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Ruby & Dol-Rune & Magic Jewel = +75 HP & +6 Life / Kill",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Ruby + Dol Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Ruby + Dol Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +10% Mana Regen",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Emerald & Fal-Rune & Magic Jewel = +15 Dexterity & +10 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Emerald + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Emerald + Fal Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +15 Strength & +10 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Sapphire & Fal-Rune & Magic Jewel = +15 Energy & +10 Vitality",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Sapphire + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Sapphire + Fal Rune + Magic Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Diamond & Pul-Rune & Rare Jewel =+6 All Attributes",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Diamond + Pul Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Diamond + Pul Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Diamond & Um-Rune & Rare Jewel = +6 All Resistances",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Diamond + Um Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Diamond + Um Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = Magic Damage Reduced By 5",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +8% Max Mana",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Diamond & Ber-Rune & Rare Jewel = +8% Damage Reduction",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Diamond + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Diamond + Ber Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Ruby & Jah-Rune & Rare Jewel = +8% Max HP",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Ruby + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Ruby + Jah Rune + Rare Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Amethyst & Cham-Rune & Unique Jewel = Absorb 4% Fire Damage",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Amethyst + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Amethyst + Cham Rune + Unique Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Sapphire & Cham-Rune & Unique Jewel = Absorb 4% Cold Damage",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Sapphire + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Sapphire + Cham Rune + Unique Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Topaz & Cham-Rune & Unique Jewel = Absorb 4% Lightning Damage",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Topaz + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Topaz + Cham Rune + Unique Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Skull & Cham-Rune & Unique Jewel = Absorb 4% Magic Damage",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Skull + Cham Rune + Unique Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Skull + Cham Rune + Unique Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - Chest & Infusion Orb & Amethyst & Zod-Rune & Unique Jewel = +2 Max All Resistances & +5 All Resistances",
    Item: null,
    Output: "Armor",
    Input: "Armor + Orb of Infusion + Amethyst + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Armor + Orb Of Infusion + Amethyst + Zod Rune + Unique Jewel = Armor"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Topaz & Magic Jewel = +15% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Topaz + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Ruby & Magic Jewel = +75 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Ruby + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Sapphire & Magic Jewel = +7% Increased Cast Rate",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Sapphire + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Emerald & Magic Jewel = +7% Increased Attack Speed",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Emerald + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Skull & Magic Jewel = +2% Mana Steal & +2% Life Steal",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Skull + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Skull + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Amethyst & Magic Jewel = +3 Life / Kill",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Amethyst + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Diamond & Magic Jewel = +2 Mana / Kill",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Diamond + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Eth-Rune & Magic Jewel = +6% Mana Regen",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Eth Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Sol-Rune & Magic Jewel = +6 Min Damage & +10 Max Damage",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Sol Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Topaz & Io-Rune & Magic Jewel = +100 Thorns",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Topaz + Io Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Topaz + Io Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Ruby & Lum-Rune & Magic Jewel = +50% Damage to Demons",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Ruby + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Ruby + Lum Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +50% Damage to Undead",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Emerald & Lem-Rune & Magic Jewel = +150 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Emerald + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Emerald + Lem Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +25% Enhanced Damage & +25 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = +15% Increased Cast Rate",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Ameythst & Mal-Rune & Rare Jewel = +15% Increased Attack Speed",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Amethyst + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Amethyst + Mal Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Skull & Vex-Rune & Rare Jewel =+5% Mana Steal & +5% Life Steal",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Skull + Vex Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Skull + Vex Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Emerald & Ohm-Rune & Rare Jewel = +15 Min Damage & +30 Max Damage",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Emerald + Ohm Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Emerald + Ohm Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Diamond & Lo-Rune & Rare Jewel = +63-511 Elemental Damage",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Diamond + Lo Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Diamond + Lo Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +10% Open Wounds & +50 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +10% Deadly Strike & +50 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Topaz & Jah-Rune & Rare Jewel = +10% Crushing Blow & +50 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Topaz + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Topaz + Jah Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Amethyst & Cham-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Amethyst & Cham-Rune & Nef-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating & +Knockback",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Conversion Orb & Ruby & Zod-Rune & Unique Jewel = +4% Fire Skill Damage & -4% Enemy Fire Res",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Orb of Conversion + Ruby + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Orb Of Conversion + Ruby + Zod Rune + Unique Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Conversion Orb & Sapphire & Zod-Rune & Unique Jewel = +4% Cold Skill Damage & -4% Enemy Cold Res",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Orb of Conversion + Sapphire + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Orb Of Conversion + Sapphire + Zod Rune + Unique Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Conversion Orb & Topaz & Zod-Rune & Unique Jewel = +4% Light Skill Damage & -4% Enemy Light Res",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Orb of Conversion + Topaz + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Orb Of Conversion + Topaz + Zod Rune + Unique Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Slam) & Infusion Orb & Conversion Orb & Emerald & Zod-Rune & Unique Jewel = +4% Poison Skill Damage & -4% Enemy Poison Res",
    Item: null,
    Output: "Slam Weapons",
    Input: "Slam Weapons + Orb of Infusion + Orb of Conversion + Emerald + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Slam Weapons + Orb Of Infusion + Orb Of Conversion + Emerald + Zod Rune + Unique Jewel = Slam Weapons"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Topaz & Magic Jewel = +15% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Topaz + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Ruby & Magic Jewel = +75 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Ruby + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Sapphire & Magic Jewel = +7% Increased Cast Rate",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Sapphire + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Emerald & Magic Jewel = +7% Increased Attack Speed",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Emerald + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Skull & Magic Jewel = +2% Mana Steal & +2% Life Steal",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Skull + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Skull + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Amethyst & Magic Jewel = +3 Life / Kill",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Amethyst + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Diamond & Magic Jewel = +2 Mana / Kill",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Diamond + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Eth-Rune & Magic Jewel = +6% Mana Regen",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Eth Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Sol-Rune & Magic Jewel = +6 Min Damage & +10 Max Damage",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Sol Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Topaz & Io-Rune & Magic Jewel = +100 Thorns",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Topaz + Io Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Topaz + Io Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Ruby & Lum-Rune & Magic Jewel = +50% Damage to Demons",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Ruby + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Ruby + Lum Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +50% Damage to Undead",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Emerald & Lem-Rune & Magic Jewel = +150 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Emerald + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Emerald + Lem Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +25% Enhanced Damage & +25 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = +15% Increased Cast Rate",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Ameythst & Mal-Rune & Rare Jewel = +15% Increased Attack Speed",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Amethyst + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Amethyst + Mal Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Skull & Vex-Rune & Rare Jewel =+5% Mana Steal & +5% Life Steal",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Skull + Vex Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Skull + Vex Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Emerald & Ohm-Rune & Rare Jewel = +15 Min Damage & +30 Max Damage",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Emerald + Ohm Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Emerald + Ohm Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Diamond & Lo-Rune & Rare Jewel = +63-511 Elemental Damage",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Diamond + Lo Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Diamond + Lo Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +10% Open Wounds & +50 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +10% Deadly Strike & +50 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Topaz & Jah-Rune & Rare Jewel = +10% Crushing Blow & +50 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Topaz + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Topaz + Jah Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Amethyst & Cham-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Amethyst & Cham-Rune & Nef-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating & +Knockback",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Conversion Orb & Ruby & Zod-Rune & Unique Jewel = +4% Fire Skill Damage & -4% Enemy Fire Res",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Orb of Conversion + Ruby + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Orb Of Conversion + Ruby + Zod Rune + Unique Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Conversion Orb & Sapphire & Zod-Rune & Unique Jewel = +4% Cold Skill Damage & -4% Enemy Cold Res",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Orb of Conversion + Sapphire + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Orb Of Conversion + Sapphire + Zod Rune + Unique Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Conversion Orb & Topaz & Zod-Rune & Unique Jewel = +4% Light Skill Damage & -4% Enemy Light Res",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Orb of Conversion + Topaz + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Orb Of Conversion + Topaz + Zod Rune + Unique Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Spear/Polearm) & Infusion Orb & Conversion Orb & Emerald & Zod-Rune & Unique Jewel = +4% Poison Skill Damage & -4% Enemy Poison Res",
    Item: null,
    Output: "Spears and Polearms",
    Input: "Spears and Polearms + Orb of Infusion + Orb of Conversion + Emerald + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Spears And Polearms + Orb Of Infusion + Orb Of Conversion + Emerald + Zod Rune + Unique Jewel = Spears And Polearms"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Topaz & Magic Jewel = +15% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Topaz + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Topaz + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Ruby & Magic Jewel = +75 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Ruby + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Ruby + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Sapphire & Magic Jewel = +7% Increased Cast Rate",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Sapphire + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Emerald & Magic Jewel = +7% Increased Attack Speed",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Emerald + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Emerald + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Skull & Magic Jewel = +2% Mana Steal & +2% Life Steal",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Skull + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Skull + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Amethyst & Magic Jewel = +3 Life / Kill",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Amethyst + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Diamond & Magic Jewel = +2 Mana / Kill",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Diamond + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Diamond + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Eth-Rune & Magic Jewel = +6% Mana Regen",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Eth Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Sol-Rune & Magic Jewel = +6 Min Damage & +10 Max Damage",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Sol Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Topaz & Io-Rune & Magic Jewel = +100 Thorns",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Topaz + Io Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Topaz + Io Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Ruby & Lum-Rune & Magic Jewel = +50% Damage to Demons",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Ruby + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Ruby + Lum Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +50% Damage to Undead",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Emerald & Lem-Rune & Magic Jewel = +150 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Emerald + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Emerald + Lem Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +25% Enhanced Damage & +25 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = +15% Increased Cast Rate",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Ameythst & Mal-Rune & Rare Jewel = +15% Increased Attack Speed",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Amethyst + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Amethyst + Mal Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Skull & Vex-Rune & Rare Jewel =+5% Mana Steal & +5% Life Steal",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Skull + Vex Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Skull + Vex Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Emerald & Ohm-Rune & Rare Jewel = +15 Min Damage & +30 Max Damage",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Emerald + Ohm Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Emerald + Ohm Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Diamond & Lo-Rune & Rare Jewel = +63-511 Elemental Damage",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Diamond + Lo Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Diamond + Lo Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +10% Open Wounds & +50 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +10% Deadly Strike & +50 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Topaz & Jah-Rune & Rare Jewel = +10% Crushing Blow & +50 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Topaz + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Topaz + Jah Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Amethyst & Cham-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Amethyst & Cham-Rune & Nef-Rune & Rare Jewel = +50% Enhanced Damage & +50 Attack Rating & +Knockback",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Conversion Orb & Ruby & Zod-Rune & Unique Jewel = +4% Fire Skill Damage & -4% Enemy Fire Res",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Orb of Conversion + Ruby + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Orb Of Conversion + Ruby + Zod Rune + Unique Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Conversion Orb & Sapphire & Zod-Rune & Unique Jewel = +4% Cold Skill Damage & -4% Enemy Cold Res",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Orb of Conversion + Sapphire + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Orb Of Conversion + Sapphire + Zod Rune + Unique Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Conversion Orb & Topaz & Zod-Rune & Unique Jewel = +4% Light Skill Damage & -4% Enemy Light Res",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Orb of Conversion + Topaz + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Orb Of Conversion + Topaz + Zod Rune + Unique Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - 2H Weapon (Bow/Crossbow) & Infusion Orb & Conversion Orb & Emerald & Zod-Rune & Unique Jewel = +4% Poison Skill Damage & -4% Enemy Poison Res",
    Item: null,
    Output: "Missile Weapon",
    Input: "Missile Weapon + Orb of Infusion + Orb of Conversion + Emerald + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "Missile Weapon + Orb Of Infusion + Orb Of Conversion + Emerald + Zod Rune + Unique Jewel = Missile Weapon"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Topaz & Magic Jewel = +15% Magic Find  & +30% Gold Find",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Topaz + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Topaz + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Ruby & Magic Jewel = +75 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Ruby + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Ruby + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Sapphire & Magic Jewel = +7% Increased Cast Rate",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Sapphire + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Sapphire + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Emerald & Magic Jewel = +7% Increased Attack Speed",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Emerald + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Emerald + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Skull & Magic Jewel = +2% Mana Steal & +2% Life Steal",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Skull + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Skull + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Amethyst & Magic Jewel = +3 Life / Kill",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Amethyst + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Amethyst + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Diamond & Magic Jewel = +2 Mana / Kill",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Diamond + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Diamond + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Eth-Rune & Magic Jewel = +6% Mana Regen",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Eth Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Eth Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Sol-Rune & Magic Jewel = +6 Min Damage & +10 Max Damage",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Sol Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Sol Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Topaz & Io-Rune & Magic Jewel = +100 Thorns",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Topaz + Io Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Topaz + Io Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Ruby & Lum-Rune & Magic Jewel = +50% Damage to Demons",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Ruby + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Ruby + Lum Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Skull & Lum-Rune & Magic Jewel = +50% Damage to Undead",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Skull + Lum Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Skull + Lum Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Emerald & Lem-Rune & Magic Jewel = +150 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Emerald + Lem Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Emerald + Lem Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Amethyst & Fal-Rune & Magic Jewel = +25% Enhanced Damage & +25 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Amethyst + Fal Rune + Magic Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Amethyst + Fal Rune + Magic Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Sapphire & Mal-Rune & Rare Jewel = +15% Increased Cast Rate",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Sapphire + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Sapphire + Mal Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Ameythst & Mal-Rune & Rare Jewel = +15% Increased Attack Speed",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Amethyst + Mal Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Amethyst + Mal Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Topaz & Ist-Rune & Rare Jewel = +30% Magic Find  & +50% Gold Find",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Topaz + Ist Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Topaz + Ist Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Skull & Vex-Rune & Rare Jewel =+5% Mana Steal & +5% Life Steal",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Skull + Vex Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Skull + Vex Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Emerald & Ohm-Rune & Rare Jewel = +15 Min Damage & 30 Max Damage",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Emerald + Ohm Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Emerald + Ohm Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Diamond & Lo-Rune & Rare Jewel = +63-511 Elemental Damage",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Diamond + Lo Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Diamond + Lo Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Sapphire & Sur-Rune & Rare Jewel = +10% Open Wounds & +50 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Sapphire + Sur Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Sapphire + Sur Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Ruby & Ber-Rune & Rare Jewel = +10% Deadly Strike & +50 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Ruby + Ber Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Ruby + Ber Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Topaz & Jah-Rune & Rare Jewel = +10% Crushing Blow & +50 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Topaz + Jah Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Topaz + Jah Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Amethyst & Cham-Rune & Rare Jewel = +50% Enhanced Damage &  & +50 Attack Rating",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Amethyst & Cham-Rune & & Nef-Rune Rare Jewel = +50% Enhanced Damage & +50 Attack Rating + Knockback",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Amethyst + Cham Rune + Rare Jewel + Nef Rune = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Conversion Orb & Ruby & Zod-Rune & Unique Jewel = +4% Fire Skill Damage & -4% Enemy Fire Res",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Orb of Conversion + Ruby + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Orb Of Conversion + Ruby + Zod Rune + Unique Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Conversion Orb & Sapphire & Zod-Rune & Unique Jewel = +4% Cold Skill Damage & -4% Enemy Cold Res",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Orb of Conversion + Sapphire + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Orb Of Conversion + Sapphire + Zod Rune + Unique Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Conversion Orb & Topaz & Zod-Rune & Unique Jewel = +4% Light Skill Damage & -4% Enemy Light Res",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Orb of Conversion + Topaz + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Orb Of Conversion + Topaz + Zod Rune + Unique Jewel = 1H Weapons"
  },
  {
    Description: "ITEM UPGRADE - Weapon & Infusion Orb & Conversion Orb & Emerald & Zod-Rune & Unique Jewel = +4% Poison Skill Damage & -4% Enemy Poison Res",
    Item: null,
    Output: "1H Weapons",
    Input: "1H Weapons + Orb of Infusion + Orb of Conversion + Emerald + Zod Rune + Unique Jewel ",
    CubeRecipeDescription: "1H Weapons + Orb Of Infusion + Orb Of Conversion + Emerald + Zod Rune + Unique Jewel = 1H Weapons"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Amethyst Grabber = Topaz Grabber",
    Item: null,
    Output: "Topaz Grabber",
    Input: "Amethyst Grabber ",
    CubeRecipeDescription: "Amethyst Grabber = Topaz Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Topaz Grabber = Sapphire Grabber",
    Item: null,
    Output: "Sapphire Grabber",
    Input: "Topaz Grabber ",
    CubeRecipeDescription: "Topaz Grabber = Sapphire Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Sapphire Grabber = Emerald Grabber",
    Item: null,
    Output: "Emerald Grabber",
    Input: "Sapphire Grabber ",
    CubeRecipeDescription: "Sapphire Grabber = Emerald Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Emerald Grabber = Diamond Grabber",
    Item: null,
    Output: "Diamond Grabber",
    Input: "Emerald Grabber ",
    CubeRecipeDescription: "Emerald Grabber = Diamond Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Diamond Grabber = Ruby Grabber",
    Item: null,
    Output: "Ruby Grabber",
    Input: "Diamond Grabber ",
    CubeRecipeDescription: "Diamond Grabber = Ruby Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Ruby Grabber = Skull Grabber",
    Item: null,
    Output: "Skull Grabber",
    Input: "Ruby Grabber ",
    CubeRecipeDescription: "Ruby Grabber = Skull Grabber"
  },
  {
    Description: "GEMBAG CHANGE GRABBER - Skull Grabber = Amethyst Grabber",
    Item: null,
    Output: "Amethyst Grabber",
    Input: "Skull Grabber ",
    CubeRecipeDescription: "Skull Grabber = Amethyst Grabber"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Amethyst Grabber = Amethyst",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Amethyst Grabber ",
    CubeRecipeDescription: "Gem Bag + Amethyst Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Topaz Grabber = Topaz",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Topaz Grabber ",
    CubeRecipeDescription: "Gem Bag + Topaz Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Sapphire Grabber = Sapphire",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Sapphire Grabber ",
    CubeRecipeDescription: "Gem Bag + Sapphire Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Emerald Grabber = Emerald",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Emerald Grabber ",
    CubeRecipeDescription: "Gem Bag + Emerald Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Diamond Grabber = Diamond",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Diamond Grabber ",
    CubeRecipeDescription: "Gem Bag + Diamond Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Ruby Grabber = Ruby",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Ruby Grabber ",
    CubeRecipeDescription: "Gem Bag + Ruby Grabber = Gem Bag"
  },
  {
    Description: "GEMBAG TRANSFER OUT GEM - Gem Bag & Skull Grabber = Skull",
    Item: null,
    Output: "Gem Bag",
    Input: "Gem Bag + Skull Grabber ",
    CubeRecipeDescription: "Gem Bag + Skull Grabber = Gem Bag"
  },
  {
    Description: "KEYCHAIN CHANGE GRABBER - Terror Key Grabber = Hate Key Grabber",
    Item: null,
    Output: "Hate Key Grabber",
    Input: "Terror Key Grabber ",
    CubeRecipeDescription: "Terror Key Grabber = Hate Key Grabber"
  },
  {
    Description: "KEYCHAIN CHANGE GRABBER - Hate Key Grabber = Destruction Key Grabber",
    Item: null,
    Output: "Desctruction Key Grabber",
    Input: "Hate Key Grabber ",
    CubeRecipeDescription: "Hate Key Grabber = Desctruction Key Grabber"
  },
  {
    Description: "KEYCHAIN CHANGE GRABBER - Destruction Key Grabber = Terror Key Grabber",
    Item: null,
    Output: "Terror Key Grabber",
    Input: "Desctruction Key Grabber ",
    CubeRecipeDescription: "Desctruction Key Grabber = Terror Key Grabber"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & Terror Key = Terror Key qty +1",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + Key Of Terror = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & Hate Key = Hate Key qty + 1",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + Key Of Hate = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & Destruction Key = Destruction Key qty + 1",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + Key Of Destruction = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 2 Terror Key = Terror Key qty + 2",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Terror = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 2 Hate Key = Hate Key qty + 2",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Hate = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 2 Destruction Key = Destruction Key qty + 2",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 2 Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + 2 Key Of Destruction = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 3 Terror Key = Terror Key qty + 3",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Terror ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Terror = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 3 Hate Key = Hate Key qty + 3",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Hate ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Hate = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER IN KEY - Keychain & 3 Destruction Key = Destruction Key qty + 3",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + 3 Key of Destruction ",
    CubeRecipeDescription: "Storage For Keys + 3 Key Of Destruction = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER OUT KEY - Keychain & Terror Key Grabber = Terror Key qty - 1 & 1 Terror Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Terror Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Terror Key Grabber = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER OUT KEY - Keychain & Hate Key Grabber = Hate Key qty - 1 & 1 Hate Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Hate Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Hate Key Grabber = Storage For Keys"
  },
  {
    Description: "KEYCHAIN TRANSFER OUT KEY - Keychain & Destruction Key Grabber = Destruction Key qty - 1 & 1 Destruction Key",
    Item: null,
    Output: "Storage for Keys",
    Input: "Storage for Keys + Desctruction Key Grabber ",
    CubeRecipeDescription: "Storage For Keys + Desctruction Key Grabber = Storage For Keys"
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
  binding() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      this.search = searchParam;
    }
  }
  attached() {
    this._debouncedSearchItem = debounce(this.handleSearch.bind(this), 350);
  }
  handleSearchChanged() {
    this._debouncedSearchItem();
    const url = new URL(window.location.href);
    if (this.search && this.search.trim() !== "") {
      url.searchParams.set("search", this.search);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState({}, "", url.toString());
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
