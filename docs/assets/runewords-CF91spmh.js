import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-BePQ-y0p.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
const name = "runewords";
const template = '<template>\n    <h3 class="text-center my-4">\n        ${filteredRunewords.length} Runewords Found\n    </h3>\n    <div class="container">\n        <div class="row align-content-center justify-content-center text-center mb-5">\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="au-select mb-2">\n                    <moo-select\n                            class="w-100"\n                            label="Select Socket Count"\n                            options.bind="amounts"\n                            class="standard-betsy-select"\n                            value.bind="selectedAmount"\n                    ></moo-select>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="au-select mb-2">\n                    <moo-select\n                            class="w-100"\n                            label="Select Type"\n                            options.bind="types"\n                            class="standard-betsy-select"\n                            value.bind="selectedType"\n                    ></moo-select>\n                    <moo-checkbox checked.bind="exclusiveType" id="exclusiveType">Exact type only</moo-checkbox>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="mb-2">\n                    <moo-text-field\n                            class="w-100"\n                            label="Search Runewords"\n                            type="text"\n                            value.bind="search"\n                    ></moo-text-field>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="mb-2">\n                    <moo-text-field\n                            class="w-100"\n                            label="Runes"\n                            type="text"\n                            value.bind="searchRunes"\n                    ></moo-text-field>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="row gy-5 px-5 text-center">\n        <div class="col-12 col-md-6 col-xxl-4" repeat.for="runeword of filteredRunewords">\n            <div class="card bg-dark p-2">\n                <div class="unique-text fs-4 mb-1">\n                    ${runeword.Name}\n                </div>\n                <div class="combo">\n                    <span repeat.for="rune of runeword.Runes">\n                        ${rune.Name | runeName} ${$index + 1 !== runeword.Runes.length ? \' + \' : \'\'}\n                    </span>\n                </div>\n                <div class="types py-2">\n                    <span repeat.for="type of runeword.Types">\n                        ${transformTypeName(type.Name)} ${$index + 1 !== runeword.Types.length ? \' or \' : \'\'}\n                    </span>\n                </div>\n                <div class="requirement" if.bind="actualLevelRequirement(runeword) > 0">\n                    Level ${actualLevelRequirement(runeword)} Required\n                </div>\n                <div class="mt-2">\n                    <div class="enhanced" repeat.for="property of runeword.Properties">\n                        ${property.PropertyString}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n';
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
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Law",
    Index: "Law",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 0,
    Code: "Law",
    Properties: [
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+120-170% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 6
      },
      {
        PropertyString: "Slows target by 30%",
        Index: 5
      },
      {
        PropertyString: "+48 to Life",
        Index: 3
      },
      {
        PropertyString: "+24 to Mana",
        Index: 4
      },
      {
        PropertyString: "+26 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -40%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Knowledge",
    Index: "Knowledge",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 11,
    RequiredLevel: 11,
    Code: "Knowledge",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+1.5 to Maximum Damage (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+150 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+10% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+3 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "+11 To Required Level",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Desire",
    Index: "Desire",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Desire",
    Properties: [
      {
        PropertyString: "+30-50% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+30-50% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 to All Attributes",
        Index: 2
      },
      {
        PropertyString: "+20-25% better chance of getting magic item",
        Index: 3
      },
      {
        PropertyString: "+100 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "+2 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+2 to Light Radius (Armor)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Armor)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense (Armor)",
        Index: 1
      },
      {
        PropertyString: "+2 to Light Radius (Shield)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Shield)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense (Shield)",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Nadir",
    Index: "Nadir",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Nadir",
    Properties: [
      {
        PropertyString: "+50% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 Defense",
        Index: 1
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+5 to Strength",
        Index: 5
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "-33% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "-3 to Light Radius",
        Index: 2
      },
      {
        PropertyString: "Level 13 Cloak of Shadows (9 Charges)",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Steel",
    Index: "Steel",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Steel",
    Properties: [
      {
        PropertyString: "+25% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+20% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "+3 to Minimum Damage",
        Index: 1
      },
      {
        PropertyString: "+3 to Maximum Damage",
        Index: 2
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+50% Chance of Open Wounds",
        Index: 3
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Scout",
    Index: "Scout",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Scout",
    Properties: [
      {
        PropertyString: "+1 to Dodge",
        Index: 4
      },
      {
        PropertyString: "+10% Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+10% Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+5 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "+12 to Light Radius",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Old Ben's Walking Stick",
    Index: "Old Ben's Walking Stick",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Old Ben's Walking Stick",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 1 Burst of Speed when you Level-Up",
        Index: 3
      },
      {
        PropertyString: "+100% Faster Run/Walk",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "-3.75 Drain Life (Per Character Level)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "-100% extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "-100% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Level 1 Teleport (5 Charges)",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Chance",
    Index: "Chance",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Chance",
    Properties: [
      {
        PropertyString: "+15% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 1
      },
      {
        PropertyString: "+15% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+25 to Mana",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "+20-30% better chance of getting magic item",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Malice",
    Index: "Malice",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Malice",
    Properties: [
      {
        PropertyString: "+33% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+100% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 2
      },
      {
        PropertyString: "-100 to Monster Defense Per Hit",
        Index: 1
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "-5 Drain Life",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+0 to Light Radius",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Penitence",
    Index: "Penitence",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Penitence",
    Properties: [
      {
        PropertyString: "+15% Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+15% Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "Half Freeze Duration",
        Index: 3
      },
      {
        PropertyString: "Poison Length Reduced by 50%",
        Index: 4
      },
      {
        PropertyString: "Repairs 0.1 durability per second",
        Index: 2
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Armor)",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana (Shield)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Jealousy",
    Index: "Jealousy",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Jealousy",
    Properties: [
      {
        PropertyString: "+3 to Jab",
        Index: 3
      },
      {
        PropertyString: "+3 to Melee Mastery",
        Index: 4
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+122% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Stealth",
    Index: "Stealth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Stealth",
    Properties: [
      {
        PropertyString: "+25% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+25% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 4
      },
      {
        PropertyString: "+6 to Dexterity",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 3",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Sting",
    Index: "Sting",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Sting",
    Properties: [
      {
        PropertyString: "+3 to Multiple Shot",
        Index: 3
      },
      {
        PropertyString: "+5 to Ice Arrow",
        Index: 4
      },
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+25-40 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 5-8% Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Leaf",
    Index: "Leaf",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 19,
    RequiredLevel: 19,
    Code: "Leaf",
    Properties: [
      {
        PropertyString: "+3 to Fire Skills",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "+3 to Inferno (Sorceress Only)",
        Index: 3
      },
      {
        PropertyString: "+3 to Fire Bolt (Sorceress Only)",
        Index: 4
      },
      {
        PropertyString: "+3 to Warmth (Sorceress Only)",
        Index: 5
      },
      {
        PropertyString: "+2 Defense (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "Cold Resist +33%",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Patience",
    Index: "Patience",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 19,
    RequiredLevel: 19,
    Code: "Patience",
    Properties: [
      {
        PropertyString: "+15% Faster Run/Walk",
        Index: 5
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+20-25 to Life",
        Index: 2
      },
      {
        PropertyString: "+3-5 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 4
      },
      {
        PropertyString: "+1-3% to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead (Weapon)",
        Index: 1
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Knockback (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile (Armor)",
        Index: 0
      },
      {
        PropertyString: "+5 Life after each Kill (Armor)",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile (Shield)",
        Index: 0
      },
      {
        PropertyString: "+7% Increased Chance of Blocking (Shield)",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +35% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Ancient's Pledge",
    Index: "Ancient's Pledge",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Ancient's Pledge",
    Properties: [
      {
        PropertyString: "+50% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +35%",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +35%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +13%",
        Index: 1
      },
      {
        PropertyString: "Poison Resist +35%",
        Index: 0
      },
      {
        PropertyString: "+10% Damage Taken Goes To Mana",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      }
    ],
    Name: "Holy Thunder",
    Index: "Holy Thunder",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Holy Thunder",
    Properties: [
      {
        PropertyString: "+60% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Damage",
        Index: 2
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "+21-110 to Minimum Lightning Damage",
        Index: 1
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds",
        Index: 0
      },
      {
        PropertyString: "+3 to Holy Shock (Paladin Only)",
        Index: 5
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 4
      },
      {
        PropertyString: "Lightning Resist +60%",
        Index: 3
      },
      {
        PropertyString: "Level 7 Chain Lightning (60 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Temptation",
    Index: "Temptation",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Temptation",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+176% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "-10 to All Attributes",
        Index: 3
      },
      {
        PropertyString: "+10% to Experience Gained",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Youth",
    Index: "Youth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Youth",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 4 Weaken on striking",
        Index: 6
      },
      {
        PropertyString: "+90-120% Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+8-10 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "Regenerate Mana +100%",
        Index: 5
      },
      {
        PropertyString: "Cold Resist +30-35%",
        Index: 1
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30-35%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30-35%",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Zephyr",
    Index: "Zephyr",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Zephyr",
    Properties: [
      {
        PropertyString: "7% Chance to cast level 1 Twister when struck",
        Index: 4
      },
      {
        PropertyString: "+25% Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+25% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+33% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+66 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+25 Defense",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Distortion",
    Index: "Distortion",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Distortion",
    Properties: [
      {
        PropertyString: "+1 to Warp",
        Index: 1
      },
      {
        PropertyString: "+3-5% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+6-10% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +5-10%",
        Index: 0
      },
      {
        PropertyString: "+10-15 to All Attributes",
        Index: 3
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Pattern",
    Index: "Pattern",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Pattern",
    Properties: [
      {
        PropertyString: "+40-80% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+30% Faster Block Rate",
        Index: 6
      },
      {
        PropertyString: "+10% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "Adds 12-32 to Fire Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds",
        Index: 0
      },
      {
        PropertyString: "+6 to Strength",
        Index: 4
      },
      {
        PropertyString: "+6 to Dexterity",
        Index: 5
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Prayer",
    Index: "Prayer",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 23,
    Code: "Prayer",
    Properties: [
      {
        PropertyString: "Level 10-14 Prayer Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+20-30% Increased Chance of Blocking",
        Index: 4
      },
      {
        PropertyString: "Adds 10-30 to Damage",
        Index: 0
      },
      {
        PropertyString: "+50-100 Defense",
        Index: 1
      },
      {
        PropertyString: "All Resistances +15-25%",
        Index: 6
      },
      {
        PropertyString: "+7 To Required Level",
        Index: 3
      },
      {
        PropertyString: "-25% Target Defense (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Requirements -20% (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Revenge",
    Index: "Revenge",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Revenge",
    Properties: [
      {
        PropertyString: "+1 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+15% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+50-75 to Mana",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +60%",
        Index: 4
      },
      {
        PropertyString: "Magic Resist +5-10%",
        Index: 5
      },
      {
        PropertyString: "+1-3% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+3 To Required Level",
        Index: 6
      },
      {
        PropertyString: "+5 Life after each Kill (Armor)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+7% Increased Chance of Blocking (Shield)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +35% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Snowdrop",
    Index: "Snowdrop",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Snowdrop",
    Properties: [
      {
        PropertyString: "+3 to Cold Skills (Sorceress only)",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+3 to Shiver Armor (Sorceress Only)",
        Index: 3
      },
      {
        PropertyString: "+3 to Glacial Spike (Sorceress Only)",
        Index: 4
      },
      {
        PropertyString: "+3 to Warmth (Sorceress Only)",
        Index: 5
      },
      {
        PropertyString: "+3 to Frost Nova (Sorceress Only)",
        Index: 6
      },
      {
        PropertyString: "+2 to Mana (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "Fire Resist +33%",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Friendship",
    Index: "Friendship",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 25,
    Code: "Friendship",
    Properties: [
      {
        PropertyString: "+133% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 25-50 to Damage",
        Index: 4
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+66% Chance of Crushing Blow",
        Index: 5
      },
      {
        PropertyString: "+34% Deadly Strike",
        Index: 6
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 2
      },
      {
        PropertyString: "-3% to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Edge",
    Index: "Edge",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Edge",
    Properties: [
      {
        PropertyString: "Level 15 Thorns Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+35% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+320-380% Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+280% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 4
      },
      {
        PropertyString: "+8-9 to All Attributes",
        Index: 6
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "Reduces all Vendor Prices 15%",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Hunger",
    Index: "Hunger",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 25,
    Code: "Hunger",
    Properties: [
      {
        PropertyString: "+15-30% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "+5% Life stolen per hit",
        Index: 5
      },
      {
        PropertyString: "-1 Drain Life",
        Index: 6
      },
      {
        PropertyString: "Magic Resist +20%",
        Index: 4
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 3
      },
      {
        PropertyString: "+10-15% Physical Damage Reduction",
        Index: 2
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+8 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      }
    ],
    Name: "King's Grace",
    Index: "King's Grace",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "King's Grace",
    Properties: [
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+150 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+100% Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+100 to Attack Rating against Demons",
        Index: 4
      },
      {
        PropertyString: "+50% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+100 to Attack Rating against Undead",
        Index: 5
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Lightning",
    Index: "Lightning",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Lightning",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 9 Lightning on striking",
        Index: 3
      },
      {
        PropertyString: "Level 2 Holy Shock Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+100-175% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+2-100 to Minimum Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +35-50%",
        Index: 0
      },
      {
        PropertyString: "+8-10 Lightning Absorb",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Druid Item",
        Index: "Druid Item",
        Class: "dru"
      }
    ],
    Name: "Nature's Kingdom",
    Index: "Nature's Kingdom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Nature's Kingdom",
    Properties: [
      {
        PropertyString: "+1 to Druid Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+40-60 to Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 4
      },
      {
        PropertyString: "+10 to All Attributes",
        Index: 5
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Serendipity",
    Index: "Serendipity",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Serendipity",
    Properties: [
      {
        PropertyString: "50% Chance to cast level 2 Inner Sight on striking",
        Index: 1
      },
      {
        PropertyString: "+120% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+14% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20 to Energy",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +50%",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Spirit",
    Index: "Spirit",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Spirit",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+25-35% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+55% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+250 Defense vs. Missile",
        Index: 2
      },
      {
        PropertyString: "+22 to Vitality",
        Index: 3
      },
      {
        PropertyString: "+89-112 to Mana",
        Index: 1
      },
      {
        PropertyString: "+3-8 Magic Absorb",
        Index: 5
      },
      {
        PropertyString: "+7% Life stolen per hit (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14 (Shield)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +35% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Strength",
    Index: "Strength",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Strength",
    Properties: [
      {
        PropertyString: "+35% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25% Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "+20 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Myth",
    Index: "Myth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 25,
    Code: "Myth",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 1 Taunt on striking",
        Index: 0
      },
      {
        PropertyString: "3% Chance to cast level 1 Howl when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Barbarian Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+10 Replenish Life",
        Index: 3
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Honor",
    Index: "Honor",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Honor",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+160% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+200 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+25% Deadly Strike",
        Index: 4
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Strength",
        Index: 5
      },
      {
        PropertyString: "+10 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      },
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      },
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Insight",
    Index: "Insight",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Insight",
    Properties: [
      {
        PropertyString: "Level 12-17 Meditation Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+1-6 to Critical Strike",
        Index: 3
      },
      {
        PropertyString: "+200-260% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+35% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+180-250% bonus to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+5 to All Attributes",
        Index: 6
      },
      {
        PropertyString: "+23% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 9 to Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill (Armor)",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7 (Armor)",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30% (Armor)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Lore",
    Index: "Lore",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Lore",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 3
      },
      {
        PropertyString: "+2 to Light Radius",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Radiance",
    Index: "Radiance",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Radiance",
    Properties: [
      {
        PropertyString: "+75% Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 2
      },
      {
        PropertyString: "+10 to Energy",
        Index: 1
      },
      {
        PropertyString: "+33 to Mana",
        Index: 4
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 3",
        Index: 3
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+5 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Thirst",
    Index: "Thirst",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Thirst",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+125-150% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+1.5 to Maximum Damage (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+8-12 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "+2-5 to Mana after each Kill",
        Index: 4
      },
      {
        PropertyString: "+1-3% to Experience Gained",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Orb",
        Index: "Orb",
        Class: "sor"
      }
    ],
    Name: "Truth",
    Index: "Truth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Truth",
    Properties: [
      {
        PropertyString: "+1 to Sorceress Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+25% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+9 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "+35 to Mana",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Barbarian Item",
        Index: "Barbarian Item",
        Class: "bar"
      }
    ],
    Name: "Void",
    Index: "Void",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Void",
    Properties: [
      {
        PropertyString: "+1 to Barbarian Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+25% Faster Run/Walk",
        Index: 4
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+10-15 to Maximum Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 3-6% Mana stolen per hit",
        Index: 6
      },
      {
        PropertyString: "Adds 3-6% Life stolen per hit",
        Index: 5
      },
      {
        PropertyString: "+50 to Life",
        Index: 2
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Rhyme",
    Index: "Rhyme",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Rhyme",
    Properties: [
      {
        PropertyString: "+40% Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 3
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Sorrow",
    Index: "Sorrow",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 33,
    RequiredLevel: 29,
    Code: "Sorrow",
    Properties: [
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+160-200% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6% Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "-2 Drain Life",
        Index: 6
      },
      {
        PropertyString: "Regenerate Mana +50%",
        Index: 5
      },
      {
        PropertyString: "+6-9 Life after each Kill",
        Index: 4
      },
      {
        PropertyString: "Level 20 Clay Golem (5 Charges)",
        Index: 3
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Whisper",
    Index: "Whisper",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Whisper",
    Properties: [
      {
        PropertyString: "+60% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 25-75 to Damage",
        Index: 0
      },
      {
        PropertyString: "-15% Target Defense",
        Index: 3
      },
      {
        PropertyString: "+6 Replenish Life",
        Index: 2
      },
      {
        PropertyString: "Requirements -25%",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Peace",
    Index: "Peace",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Peace",
    Properties: [
      {
        PropertyString: "2% Chance to cast level 15 Valkyrie on striking",
        Index: 0
      },
      {
        PropertyString: "4% Chance to cast level 5 Slow Missiles when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Amazon Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+2 to Critical Strike",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Knife",
        Index: "Knife",
        Class: ""
      },
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Duriel's Fang",
    Index: "Duriel's Fang",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Duriel's Fang",
    Properties: [
      {
        PropertyString: "+1-2 to Poison Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+10-15% to Poison Skill Damage",
        Index: 1
      },
      {
        PropertyString: "-5-8% to Enemy Poison Resistance",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Amazon Bow",
        Index: "Amazon Bow",
        Class: "ama"
      }
    ],
    Name: "Beauty",
    Index: "Beauty",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Beauty",
    Properties: [
      {
        PropertyString: "+3 to Bow and Crossbow Skills (Amazon only)",
        Index: 0
      },
      {
        PropertyString: "Adds 30-60 to Damage",
        Index: 1
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 5
      },
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+50% Chance of Open Wounds",
        Index: 6
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "Slows target by 15%",
        Index: 3
      },
      {
        PropertyString: "Knockback",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Dread",
    Index: "Dread",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Dread",
    Properties: [
      {
        PropertyString: "13% Chance to cast level 13 Charged Bolt on striking",
        Index: 1
      },
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+100-125% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "+0.5 to Strength (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "+0.5 to Dexterity (Per Character Level)",
        Index: 6
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+6-8 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Paladin Item",
        Index: "Paladin Item",
        Class: "pal"
      }
    ],
    Name: "Heaven's Will",
    Index: "Heaven's Will",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Heaven's Will",
    Properties: [
      {
        PropertyString: "+1 to Paladin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30-50% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+30% Faster Block Rate",
        Index: 2
      },
      {
        PropertyString: "+50% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 4
      },
      {
        PropertyString: "+6 to Fist of the Heavens (Paladin Only)",
        Index: 5
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5 Life after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Punishment",
    Index: "Punishment",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Punishment",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 35 Thunder Storm when you Level-Up",
        Index: 5
      },
      {
        PropertyString: "+135% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 20-40 to Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "-3 Drain Life",
        Index: 2
      },
      {
        PropertyString: "+20 to All Attributes",
        Index: 4
      },
      {
        PropertyString: "Damage Reduced by 15",
        Index: 6
      },
      {
        PropertyString: "-2% to Experience Gained",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Vengeance",
    Index: "Vengeance",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Vengeance",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 55 Poison Nova when you Die",
        Index: 1
      },
      {
        PropertyString: "+1 to Assassin Skill Levels",
        Index: 5
      },
      {
        PropertyString: "Adds 35-70 to Damage",
        Index: 0
      },
      {
        PropertyString: "+6% Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "+40 to Life",
        Index: 3
      },
      {
        PropertyString: "+10 to All Attributes",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Black",
    Index: "Black",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Black",
    Properties: [
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+120% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+200 to Attack Rating",
        Index: 4
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+40% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 2",
        Index: 3
      },
      {
        PropertyString: "Level 4 Corpse Explosion (12 Charges)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Bulwark",
    Index: "Bulwark",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Bulwark",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Adds 4-6% Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+30 Replenish Life",
        Index: 3
      },
      {
        PropertyString: "+10-15% Physical Damage Reduction",
        Index: 2
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Cure",
    Index: "Cure",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Cure",
    Properties: [
      {
        PropertyString: "Level 1 Cleansing Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +40-60%",
        Index: 2
      },
      {
        PropertyString: "Poison Length Reduced by 50%",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Ground",
    Index: "Ground",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Ground",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +40-60%",
        Index: 2
      },
      {
        PropertyString: "+10-15% Lightning Absorb",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Hatred",
    Index: "Hatred",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Hatred",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+140-190% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+100-200% Damage to Demons",
        Index: 5
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 4
      },
      {
        PropertyString: "Knockback",
        Index: 3
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Hearth",
    Index: "Hearth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Hearth",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +40-60%",
        Index: 2
      },
      {
        PropertyString: "+10-15% Cold Absorb",
        Index: 3
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      }
    ],
    Name: "Holy Tears",
    Index: "Holy Tears",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Holy Tears",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 9 Fist Of The Heavens on striking",
        Index: 1
      },
      {
        PropertyString: "+5 to Zeal",
        Index: 5
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 6
      },
      {
        PropertyString: "+160-200% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+35% bonus to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+300% Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "Slows target by 35%",
        Index: 4
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Madness",
    Index: "Madness",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Madness",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 5 Confuse when struck",
        Index: 0
      },
      {
        PropertyString: "12% Chance to cast level 16 Terror on striking",
        Index: 1
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+15% Faster Block Rate",
        Index: 5
      },
      {
        PropertyString: "+35-50 to Life",
        Index: 6
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 3
      },
      {
        PropertyString: "+10 to Vitality (Armor)",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality (Shield)",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life (Shield)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Red",
    Index: "Red",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Red",
    Properties: [
      {
        PropertyString: "8% Chance to cast level 4 Meteor on striking",
        Index: 6
      },
      {
        PropertyString: "+155% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+15-25% to Fire Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Cold Resist -20%",
        Index: 4
      },
      {
        PropertyString: "Fire Resist +95-110%",
        Index: 2
      },
      {
        PropertyString: "+10% Fire Absorb",
        Index: 3
      },
      {
        PropertyString: "Repairs 0.2 durability per second",
        Index: 1
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Wand",
        Index: "Wand",
        Class: ""
      }
    ],
    Name: "Shadow of Doubt",
    Index: "Shadow of Doubt",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Shadow of Doubt",
    Properties: [
      {
        PropertyString: "+1-3 to Curses (Necromancer only)",
        Index: 0
      },
      {
        PropertyString: "+1-3 to Poison and Bone Skills (Necromancer only)",
        Index: 1
      },
      {
        PropertyString: "+1-3 to Summoning Skills (Necromancer only)",
        Index: 2
      },
      {
        PropertyString: "+15% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+10% to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Temper",
    Index: "Temper",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Temper",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+75-100% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +40-60%",
        Index: 2
      },
      {
        PropertyString: "+10-15% Fire Absorb",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Wand",
        Index: "Wand",
        Class: ""
      }
    ],
    Name: "White",
    Index: "White",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "White",
    Properties: [
      {
        PropertyString: "+3 to Poison and Bone Skills (Necromancer only)",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+3 to Bone Armor (Necromancer Only)",
        Index: 4
      },
      {
        PropertyString: "+2 to Bone Spear (Necromancer Only)",
        Index: 5
      },
      {
        PropertyString: "+4 to Skeleton Mastery (Necromancer Only)",
        Index: 6
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+13 to Mana",
        Index: 3
      },
      {
        PropertyString: "Magic Damage Reduced by 4",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Deception",
    Index: "Deception",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Deception",
    Properties: [
      {
        PropertyString: "+1 to Warp",
        Index: 2
      },
      {
        PropertyString: "+165-205% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+40% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+1 to Maximum Damage (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+15% to Fire Skill Damage",
        Index: 5
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "Level 18 Meteor (150 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Memory",
    Index: "Memory",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Memory",
    Properties: [
      {
        PropertyString: "+3 to Sorceress Skill Levels",
        Index: 4
      },
      {
        PropertyString: "+33% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "+3 to Energy Shield (Sorceress Only)",
        Index: 5
      },
      {
        PropertyString: "+2 to Static Field (Sorceress Only)",
        Index: 6
      },
      {
        PropertyString: "+50% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Smoke",
    Index: "Smoke",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Smoke",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+75% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+280 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 2
      },
      {
        PropertyString: "-1 to Light Radius",
        Index: 4
      },
      {
        PropertyString: "Level 6 Weaken (18 Charges)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Splendor",
    Index: "Splendor",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Splendor",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+10% Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 2
      },
      {
        PropertyString: "+60-100% Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+20% better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "+3 to Light Radius",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Harmony",
    Index: "Harmony",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Harmony",
    Properties: [
      {
        PropertyString: "Level 10 Vigor Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+2-6 to Valkyrie",
        Index: 4
      },
      {
        PropertyString: "+200-275% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 55-160 to Fire Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 55-160 to Cold Damage",
        Index: 3
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +20%",
        Index: 5
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "Level 20 Revive (25 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Hustle",
    Index: "Hustle (Torso)",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Hustle (Torso)",
    Properties: [
      {
        PropertyString: "+6 to Evade",
        Index: 3
      },
      {
        PropertyString: "+65% Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "All Resistances +10%",
        Index: 2
      },
      {
        PropertyString: "+5 Life after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Hustle",
    Index: "Hustle (Weapon)",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Hustle (Weapon)",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 1 Burst of Speed on striking",
        Index: 0
      },
      {
        PropertyString: "Level 1 Fanaticism Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+180-200% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+75% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Melody",
    Index: "Melody",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Melody",
    Properties: [
      {
        PropertyString: "+3 to Bow and Crossbow Skills (Amazon only)",
        Index: 1
      },
      {
        PropertyString: "+50% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+300% Damage to Undead",
        Index: 5
      },
      {
        PropertyString: "+3 to Critical Strike (Amazon Only)",
        Index: 2
      },
      {
        PropertyString: "+3 to Dodge (Amazon Only)",
        Index: 3
      },
      {
        PropertyString: "+3 to Slow Missiles (Amazon Only)",
        Index: 4
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Pestilence",
    Index: "Pestilence",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Pestilence",
    Properties: [
      {
        PropertyString: "+1 to Poison Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+150-175% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 6
      },
      {
        PropertyString: "+10% to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+3 to Poison Dagger (Necromancer Only)",
        Index: 1
      },
      {
        PropertyString: "+3 to Poison Volley (Necromancer Only)",
        Index: 2
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Question",
    Index: "Question",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Question",
    Properties: [
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "+0.75 to Strength (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "0 to Dexterity",
        Index: 6
      },
      {
        PropertyString: "+0.75 to Dexterity (Per Character Level)",
        Index: 3
      },
      {
        PropertyString: "+0.75 to Vitality (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "+0.75 to Energy (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "+2% extra gold from monsters (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+1.5% better chance of getting magic item (Per Character Level)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Water",
    Index: "Water",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Water",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 25 Battle Orders when you Level-Up",
        Index: 5
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+175% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 4
      },
      {
        PropertyString: "Adds 33-122 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+3-5 Replenish Life",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +35%",
        Index: 1
      },
      {
        PropertyString: "Fire Resist +50%",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Envy",
    Index: "Envy",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Envy",
    Properties: [
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+222% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6% Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+6% Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 6
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 4
      },
      {
        PropertyString: "+35% better chance of getting magic item",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Fortune's Favor",
    Index: "Fortune's Favor",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Fortune's Favor",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+30-50 to Life",
        Index: 2
      },
      {
        PropertyString: "All Resistances +10%",
        Index: 3
      },
      {
        PropertyString: "+200% extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "+2% better chance of getting magic item (Per Character Level)",
        Index: 0
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 4
      },
      {
        PropertyString: "+10 to Strength (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength (Armor)",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality (Armor)",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength (Shield)",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Lionheart",
    Index: "Lionheart",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Lionheart",
    Properties: [
      {
        PropertyString: "+20% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+25 to Strength",
        Index: 0
      },
      {
        PropertyString: "+15 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "+20 to Vitality",
        Index: 1
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+50 to Life",
        Index: 4
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 5
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Obedience",
    Index: "Obedience",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Obedience",
    Properties: [
      {
        PropertyString: "30% Chance to cast level 21 Enchant when you Kill an Enemy",
        Index: 2
      },
      {
        PropertyString: "+370% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+40% Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "-25% to Enemy Fire Resistance",
        Index: 3
      },
      {
        PropertyString: "+40% Chance of Crushing Blow",
        Index: 1
      },
      {
        PropertyString: "+200-300 Defense",
        Index: 4
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "All Resistances +20-30%",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Unbending Will",
    Index: "Unbending Will",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Unbending Will",
    Properties: [
      {
        PropertyString: "18% Chance to cast level 18 Taunt on striking",
        Index: 1
      },
      {
        PropertyString: "+3 to Combat Skills (Barbarian only)",
        Index: 0
      },
      {
        PropertyString: "+20-30% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+300-350% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+9 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+75% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "Adds 8-10% Life stolen per hit",
        Index: 6
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 8",
        Index: 4
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Lawbringer",
    Index: "Lawbringer",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Lawbringer",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 Decrepify on striking",
        Index: 0
      },
      {
        PropertyString: "Level 18 Sanctuary Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "-50% Target Defense",
        Index: 2
      },
      {
        PropertyString: "Adds 150-220 to Fire Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 130-180 to Cold Damage",
        Index: 4
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 5
      },
      {
        PropertyString: "+200-250 Defense vs. Missile",
        Index: 6
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Passion",
    Index: "Passion",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Passion",
    Properties: [
      {
        PropertyString: "+1 to Zeal",
        Index: 1
      },
      {
        PropertyString: "+1 to Berserk",
        Index: 3
      },
      {
        PropertyString: "+25% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+160-210% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+50-80% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+75% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +10",
        Index: 6
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "Level 3 Heart of Wolverine (12 Charges)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Piety",
    Index: "Piety",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Piety",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+90-125% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+20 to Energy",
        Index: 1
      },
      {
        PropertyString: "+1 to Mana (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "Magic Resist +15-25%",
        Index: 6
      },
      {
        PropertyString: "All Resistances +15-25%",
        Index: 5
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Tempest",
    Index: "Tempest",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Tempest",
    Properties: [
      {
        PropertyString: "+3 to Traps (Assassin only)",
        Index: 5
      },
      {
        PropertyString: "+2 to Assassin Skill Levels",
        Index: 4
      },
      {
        PropertyString: "+140-190% Enhanced Damage",
        Index: 6
      },
      {
        PropertyString: "Adds 100-200 to Fire Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 1-300 to Lightning Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 30-70 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+20-30% to Lightning Skill Damage",
        Index: 3
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      }
    ],
    Name: "Treachery",
    Index: "Treachery",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Treachery",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 15 Venom on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 15 Fade when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Assassin Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+45% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Voice of Reason",
    Index: "Voice of Reason",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Voice of Reason",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 Frozen Orb on striking",
        Index: 0
      },
      {
        PropertyString: "18% Chance to cast level 20 Ice Blast on striking",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+220-350% Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+355-375% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "Adds 100-220 to Cold Damage",
        Index: 4
      },
      {
        PropertyString: "-24% to Enemy Cold Resistance",
        Index: 5
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 6
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Wealth",
    Index: "Wealth",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Wealth",
    Properties: [
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+300% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Amazon Bow",
        Index: "Amazon Bow",
        Class: "ama"
      }
    ],
    Name: "Love",
    Index: "Love",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Love",
    Properties: [
      {
        PropertyString: "+2 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+200% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+1 Fires Explosive Arrows or Bolts",
        Index: 6
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+75% Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "+100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "+30% Deadly Strike",
        Index: 5
      },
      {
        PropertyString: "+75 to Life",
        Index: 1
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Shadow",
    Index: "Shadow",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Shadow",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 12 Cloak Of Shadows when struck",
        Index: 4
      },
      {
        PropertyString: "+50% Faster Run/Walk",
        Index: 3
      },
      {
        PropertyString: "+166% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Adds 80-140 to Cold Damage",
        Index: 1
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 14",
        Index: 0
      },
      {
        PropertyString: "Level 10 Bone Wall (50 Charges)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Thunder",
    Index: "Thunder",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Thunder",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 22 Thunder Storm when struck",
        Index: 2
      },
      {
        PropertyString: "+1 to Static Field",
        Index: 5
      },
      {
        PropertyString: "+235% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 1-444 to Lightning Damage",
        Index: 1
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "Cold Resist -25%",
        Index: 4
      },
      {
        PropertyString: "Lightning Resist +75%",
        Index: 3
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "War",
    Index: "War",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "War",
    Properties: [
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+35-50% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 4
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+100-140% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+20-25% Physical Damage Reduction",
        Index: 3
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Wisdom",
    Index: "Wisdom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Wisdom",
    Properties: [
      {
        PropertyString: "+33% Piercing Attack",
        Index: 0
      },
      {
        PropertyString: "+15-25% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "Adds 4-8% Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 5
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 4
      },
      {
        PropertyString: "+5 to Mana after each Kill",
        Index: 3
      },
      {
        PropertyString: "+5 Life after each Kill",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Enlightenment",
    Index: "Enlightenment",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Enlightenment",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 15 Fire Ball on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 15 Blaze when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Sorceress Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+1 to Warmth",
        Index: 3
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Crescent Moon",
    Index: "Crescent Moon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Crescent Moon",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 Static Field on striking",
        Index: 5
      },
      {
        PropertyString: "20% Chance to cast level 17 Chain Lightning on striking",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "-35% to Enemy Lightning Resistance",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Duress",
    Index: "Duress",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Duress",
    Properties: [
      {
        PropertyString: "+10-20% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+40% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Adds 37-133 to Cold Damage",
        Index: 2
      },
      {
        PropertyString: "+15% Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "+33% Chance of Open Wounds",
        Index: 4
      },
      {
        PropertyString: "+150-200% Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Gloom",
    Index: "Gloom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Gloom",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 3 Dim Vision when struck",
        Index: 2
      },
      {
        PropertyString: "+10% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+200-260% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "All Resistances +45%",
        Index: 1
      },
      {
        PropertyString: "Half Freeze Duration",
        Index: 6
      },
      {
        PropertyString: "+5% Damage Taken Goes To Mana",
        Index: 4
      },
      {
        PropertyString: "-3 to Light Radius",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Paladin Item",
        Index: "Paladin Item",
        Class: "pal"
      }
    ],
    Name: "Judgement",
    Index: "Judgement",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Judgement",
    Properties: [
      {
        PropertyString: "2% Chance to cast level 35 Holy Shield when struck",
        Index: 4
      },
      {
        PropertyString: "50% Chance to cast level 5 Decrepify when struck",
        Index: 5
      },
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+25-35% Increased Chance of Blocking",
        Index: 2
      },
      {
        PropertyString: "+20-30 to Maximum Damage",
        Index: 3
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 35",
        Index: 6
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Barbarian Item",
        Index: "Barbarian Item",
        Class: "bar"
      }
    ],
    Name: "Oblivion",
    Index: "Oblivion",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Oblivion",
    Properties: [
      {
        PropertyString: "12% Chance to cast level 9 Amplify Damage on striking",
        Index: 3
      },
      {
        PropertyString: "+2 to Barbarian Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+10% Chance of Crushing Blow",
        Index: 6
      },
      {
        PropertyString: "+3 to random Barbarian Skill",
        Index: 2
      },
      {
        PropertyString: "+115-160% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+1.5 to Life (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Pillar of Faith",
    Index: "Pillar of Faith",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Pillar of Faith",
    Properties: [
      {
        PropertyString: "Level 12 Cleansing Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+230% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+400-500 Defense",
        Index: 2
      },
      {
        PropertyString: "+20 to Strength",
        Index: 0
      },
      {
        PropertyString: "+75 to Life",
        Index: 5
      },
      {
        PropertyString: "+15% Fire Absorb",
        Index: 6
      },
      {
        PropertyString: "Repairs 0.2 durability per second",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Stone",
    Index: "Stone",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Stone",
    Properties: [
      {
        PropertyString: "+60% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "+250-290% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+300 Defense vs. Missile",
        Index: 2
      },
      {
        PropertyString: "+16 to Strength",
        Index: 4
      },
      {
        PropertyString: "+16 to Vitality",
        Index: 5
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      },
      {
        PropertyString: "Level 16 Clay Golem (16 Charges)",
        Index: 1
      },
      {
        PropertyString: "Level 16 Molten Boulder (80 Charges)",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Voice",
    Index: "Voice",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Voice",
    Properties: [
      {
        PropertyString: "+10-15% to Cold Skill Damage",
        Index: 1
      },
      {
        PropertyString: "+10-15% to Fire Skill Damage",
        Index: 2
      },
      {
        PropertyString: "+10-15% to Lightning Skill Damage",
        Index: 3
      },
      {
        PropertyString: "+1 to Mana (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "All Resistances +7-10%",
        Index: 4
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14 (Armor)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana (Shield)",
        Index: 0
      },
      {
        PropertyString: "All Resistances +22% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14 (Shield)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Bone",
    Index: "Bone",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Bone",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 10 Bone Spear on striking",
        Index: 0
      },
      {
        PropertyString: "15% Chance to cast level 10 Bone Armor when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Necromancer Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+100-150 to Mana",
        Index: 3
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Searing Moon",
    Index: "Searing Moon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Searing Moon",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 Meteor on striking",
        Index: 5
      },
      {
        PropertyString: "20% Chance to cast level 17 Fire Ball on striking",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "-35% to Enemy Fire Resistance",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Winter Moon",
    Index: "Winter Moon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Winter Moon",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 Blizzard on striking",
        Index: 5
      },
      {
        PropertyString: "20% Chance to cast level 17 Glacial Spike on striking",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "-35% to Enemy Cold Resistance",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tal Rune",
        ItemLevel: 17,
        RequiredLevel: 17,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Harvest Moon",
    Index: "Harvest Moon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Harvest Moon",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 Corpse Explosion on striking",
        Index: 5
      },
      {
        PropertyString: "20% Chance to cast level 17 Poison Nova on striking",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "+76 Poison Damage Over 5 Seconds",
        Index: 0
      },
      {
        PropertyString: "-35% to Enemy Poison Resistance",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Blood",
    Index: "Blood",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Blood",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+200-250% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+125-175 Defense",
        Index: 2
      },
      {
        PropertyString: "+10-15% Increased Maximum Life",
        Index: 5
      },
      {
        PropertyString: "+10-15% Physical Damage Reduction",
        Index: 6
      },
      {
        PropertyString: "+18 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery (Armor)",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7 (Armor)",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Block Rate (Shield)",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7 (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Wand",
        Index: "Wand",
        Class: ""
      }
    ],
    Name: "Lust",
    Index: "Lust",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Lust",
    Properties: [
      {
        PropertyString: "Level 8 Holy Shock Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+2 to Necromancer Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+35% Increased Maximum Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +35-50%",
        Index: 3
      },
      {
        PropertyString: "+5% to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+80-120% extra gold from monsters",
        Index: 6
      },
      {
        PropertyString: "+40% better chance of getting magic item",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Oath",
    Index: "Oath",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Oath",
    Properties: [
      {
        PropertyString: "30% Chance to cast level 20 Bone Spirit on striking",
        Index: 0
      },
      {
        PropertyString: "Indestructible",
        Index: 1
      },
      {
        PropertyString: "+50% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+210-340% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+75% Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "+100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+10-15 Magic Absorb",
        Index: 4
      },
      {
        PropertyString: "Level 16 Heart of Wolverine (20 Charges)",
        Index: 5
      },
      {
        PropertyString: "Level 17 Iron Golem (14 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Prudence",
    Index: "Prudence",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Prudence",
    Properties: [
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+140-170% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "All Resistances +25-35%",
        Index: 2
      },
      {
        PropertyString: "Damage Reduced by 3",
        Index: 3
      },
      {
        PropertyString: "Magic Damage Reduced by 17",
        Index: 4
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 5
      },
      {
        PropertyString: "Repairs 0.25 durability per second",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Rain",
    Index: "Rain",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Rain",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 15 Twister on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 15 Cyclone Armor when struck",
        Index: 1
      },
      {
        PropertyString: "+2 to Druid Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+100-150 to Mana",
        Index: 3
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Sanctuary",
    Index: "Sanctuary",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Sanctuary",
    Properties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 1
      },
      {
        PropertyString: "+20% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+130-160% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+250 Defense vs. Missile",
        Index: 3
      },
      {
        PropertyString: "+20 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50-70%",
        Index: 4
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "Level 12 Slow Missiles (60 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Necromancer Item",
        Index: "Necromancer Item",
        Class: "nec"
      }
    ],
    Name: "Terror",
    Index: "Terror",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Terror",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 10 Terror when struck",
        Index: 0
      },
      {
        PropertyString: "+2 to Necromancer Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+3 to Fanaticism",
        Index: 6
      },
      {
        PropertyString: "+25% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+4 to random Necromancer Skill",
        Index: 2
      },
      {
        PropertyString: "+1.5 Defense (Per Character Level)",
        Index: 3
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+1% better chance of getting magic item (Per Character Level)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Full Moon",
    Index: "Full Moon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Full Moon",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 20 Blessed Hammer on striking",
        Index: 5
      },
      {
        PropertyString: "15% Chance to cast level 20 Bone Spear on striking",
        Index: 6
      },
      {
        PropertyString: "Level 10 Sanctuary Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Delirium",
    Index: "Delirium",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Delirium",
    Properties: [
      {
        PropertyString: "11% Chance to cast level 18 Confuse on striking",
        Index: 0
      },
      {
        PropertyString: "14% Chance to cast level 13 Terror when struck",
        Index: 2
      },
      {
        PropertyString: "6% Chance to cast level 14 Mind Blast when struck",
        Index: 4
      },
      {
        PropertyString: "1% Chance to cast level 50 Delerium Change when struck",
        Index: 5
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+261 Defense",
        Index: 3
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Level 17 Attract (60 Charges)",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Glory",
    Index: "Glory",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Glory",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+35% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+75-125% Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "+25% Increased Maximum Life",
        Index: 4
      },
      {
        PropertyString: "+25% Increased Maximum Mana",
        Index: 3
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Requirements -30%",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Orb",
        Index: "Orb",
        Class: "sor"
      }
    ],
    Name: "Thought",
    Index: "Thought",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Thought",
    Properties: [
      {
        PropertyString: "+2 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "+15% Increased Chance of Blocking",
        Index: 5
      },
      {
        PropertyString: "-20% to Enemy Lightning Resistance",
        Index: 3
      },
      {
        PropertyString: "+20% to Cold Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+6 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Despair",
    Index: "Despair",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Despair",
    Properties: [
      {
        PropertyString: "32% Chance to cast level 6 Weaken on striking",
        Index: 1
      },
      {
        PropertyString: "+7 to Fend",
        Index: 3
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+260-300% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+9% Mana stolen per hit",
        Index: 5
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Slows target by 20%",
        Index: 2
      },
      {
        PropertyString: "+35% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Kingslayer",
    Index: "Kingslayer",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Kingslayer",
    Properties: [
      {
        PropertyString: "+1 to Vengeance",
        Index: 5
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+230-270% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 2
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+33% Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "+50% Chance of Open Wounds",
        Index: 4
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+40% extra gold from monsters",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Mosaic",
    Index: "Mosaic",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Mosaic",
    Properties: [
      {
        PropertyString: "+50% chance for finishing moves to not consume charges",
        Index: 1
      },
      {
        PropertyString: "+2 to Martial Arts (Assassin only)",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+200-250% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+8-15% to Fire Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+8-15% to Cold Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+8-15% to Lightning Skill Damage",
        Index: 6
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      }
    ],
    Name: "Rift",
    Index: "Rift",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Rift",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 16 Tornado on striking",
        Index: 0
      },
      {
        PropertyString: "16% Chance to cast level 21 Frozen Orb on attack",
        Index: 1
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "Adds 160-250 to Magic Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 60-180 to Fire Damage",
        Index: 3
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+5-10 to All Attributes",
        Index: 4
      },
      {
        PropertyString: "+38% Damage Taken Goes To Mana",
        Index: 5
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "Level 15 Iron Maiden (40 Charges)",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Amazon Bow",
        Index: "Amazon Bow",
        Class: "ama"
      }
    ],
    Name: "Still Water",
    Index: "Still Water",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Still Water",
    Properties: [
      {
        PropertyString: "+2 to Bow and Crossbow Skills (Amazon only)",
        Index: 4
      },
      {
        PropertyString: "+1 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+80-120% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 30-150 to Damage",
        Index: 2
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "Adds 100-150 to Cold Damage",
        Index: 6
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "+15-20 Life after each Kill",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Principle",
    Index: "Principle",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Principle",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 5 Holy Bolt on striking",
        Index: 0
      },
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+50% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+100-150 to Life",
        Index: 2
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+5 Life after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Death",
    Index: "Death",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Death",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 44 Chain Lightning when you Die",
        Index: 0
      },
      {
        PropertyString: "25% Chance to cast level 18 Glacial Spike on attack",
        Index: 1
      },
      {
        PropertyString: "Indestructible",
        Index: 2
      },
      {
        PropertyString: "+300-385% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+50% Chance of Crushing Blow",
        Index: 4
      },
      {
        PropertyString: "+0.5% Deadly Strike (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Level 22 Blood Golem (15 Charges)",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Flame",
    Index: "Flame",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Flame",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 19 Fire Ball when struck",
        Index: 0
      },
      {
        PropertyString: "8% Chance to cast level 13 Eruption on striking",
        Index: 1
      },
      {
        PropertyString: "Level 17 Holy Fire Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+15-20% to Fire Skill Damage",
        Index: 3
      },
      {
        PropertyString: "-15-20% to Enemy Fire Resistance",
        Index: 4
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+15-20 Fire Absorb",
        Index: 5
      },
      {
        PropertyString: "+5 to Light Radius",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Flickering Flame",
    Index: "Flickering Flame",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Flickering Flame",
    Properties: [
      {
        PropertyString: "Level 4-8 Resist Fire Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+3 to Fire Skills",
        Index: 0
      },
      {
        PropertyString: "-10-15% to Enemy Fire Resistance",
        Index: 2
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+50-75 to Mana",
        Index: 3
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "Half Freeze Duration",
        Index: 4
      },
      {
        PropertyString: "Poison Length Reduced by 50%",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Heart of the Oak",
    Index: "Heart of the Oak",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Heart of the Oak",
    Properties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+40% Faster Cast Rate",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "+100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+20 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "+15% Increased Maximum Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +30-40%",
        Index: 5
      },
      {
        PropertyString: "Level 4 Oak Sage (25 Charges)",
        Index: 1
      },
      {
        PropertyString: "Level 14 Raven (60 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Innocence",
    Index: "Innocence",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Innocence",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+190-240% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+2 to Maximum Damage (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+25% Increased Maximum Life",
        Index: 4
      },
      {
        PropertyString: "+15-25 to All Attributes",
        Index: 5
      },
      {
        PropertyString: "-3% to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Repairs 0.15 durability per second",
        Index: 2
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Loyalty",
    Index: "Loyalty",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Loyalty",
    Properties: [
      {
        PropertyString: "Level 5-9 Thorns Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+35-50% Increased Chance of Blocking",
        Index: 6
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 3
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 2
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 1
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "All Resistances +40-50%",
        Index: 4
      },
      {
        PropertyString: "+6% to Experience Gained",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Silence",
    Index: "Silence",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Silence",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+200% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "+75% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+11% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +33",
        Index: 1
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee",
        Index: 0
      },
      {
        PropertyString: "All Resistances +75%",
        Index: 4
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Wand",
        Index: "Wand",
        Class: ""
      },
      {
        Name: "Orb",
        Index: "Orb",
        Class: "sor"
      }
    ],
    Name: "Arcane",
    Index: "Arcane2",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Arcane2",
    Properties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to Warmth",
        Index: 4
      },
      {
        PropertyString: "+50% Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+100 to Mana",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Maximum Mana",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 3
      },
      {
        PropertyString: "+5-10% to Experience Gained",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Wonder",
    Index: "Wonder",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Wonder",
    Properties: [
      {
        PropertyString: "+275% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+50% Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+20 to Strength",
        Index: 2
      },
      {
        PropertyString: "+20 to Dexterity",
        Index: 3
      },
      {
        PropertyString: "+1.5 to Life (Per Character Level)",
        Index: 6
      },
      {
        PropertyString: "+10 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +28",
        Index: 0
      },
      {
        PropertyString: "+100-140% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+60-80% better chance of getting magic item",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Natalya's Shroud",
    Index: "Natalya's Shroud",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Natalya's Shroud",
    Properties: [
      {
        PropertyString: "+2 to Assassin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+20% to Lightning Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+20% to Fire Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Call to Arms",
    Index: "Call to Arms",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Call to Arms",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+2-6 to Battle Command",
        Index: 3
      },
      {
        PropertyString: "+1-6 to Battle Orders",
        Index: 4
      },
      {
        PropertyString: "+1-4 to Battle Cry",
        Index: 5
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+250-290% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+12 Replenish Life",
        Index: 6
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Chaos",
    Index: "Chaos",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Chaos",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 11 Frozen Orb on striking",
        Index: 5
      },
      {
        PropertyString: "11% Chance to cast level 9 Charged Bolt on striking",
        Index: 6
      },
      {
        PropertyString: "+1 to Whirlwind",
        Index: 3
      },
      {
        PropertyString: "+35% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+290-340% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 216-471 to Magic Damage",
        Index: 2
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+15 Life after each Demon Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Paladin Item",
        Index: "Paladin Item",
        Class: "pal"
      }
    ],
    Name: "Exile",
    Index: "Exile",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Exile",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 5 Life Tap on striking",
        Index: 5
      },
      {
        PropertyString: "Level 13-16 Defiance Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+2 to Offensive Auras (Paladin only)",
        Index: 4
      },
      {
        PropertyString: "+30% Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "Freezes target +1",
        Index: 1
      },
      {
        PropertyString: "+220-260% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Repairs 0.25 durability per second",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Praise",
    Index: "Praise",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Praise",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 47 Frozen Orb when you Die",
        Index: 3
      },
      {
        PropertyString: "100% Chance to cast level 10 Glacial Spike when struck",
        Index: 4
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+330-400% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 2
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 6
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+40-60% better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "+15 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Trust",
    Index: "Trust",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Trust",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 57 Nova when you Die",
        Index: 6
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "Adds 15-30 to Damage",
        Index: 5
      },
      {
        PropertyString: "+125-200% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+75-100 to Life",
        Index: 3
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Victory",
    Index: "Victory",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Victory",
    Properties: [
      {
        PropertyString: "+60% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+200% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+2.5 to Maximum Damage (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+1-300 to Minimum Fire Damage",
        Index: 6
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Repairs 0.1 durability per second",
        Index: 2
      },
      {
        PropertyString: "+24 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -50%",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Fortitude",
    Index: "Fortitude",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Fortitude",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 Chilling Armor when struck",
        Index: 0
      },
      {
        PropertyString: "+300% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25% Faster Cast Rate",
        Index: 5
      },
      {
        PropertyString: "+200% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+1-1.5 to Life (Per Character Level)",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25-30%",
        Index: 4
      },
      {
        PropertyString: "+1 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20% Deadly Strike (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "25% Hit Causes Monster To Flee (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Adds 9 to Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius (Armor)",
        Index: 0
      },
      {
        PropertyString: "+15 Defense (Armor)",
        Index: 1
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Armor)",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7 (Armor)",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius (Shield)",
        Index: 0
      },
      {
        PropertyString: "+15 Defense (Shield)",
        Index: 1
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Shield)",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life (Shield)",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7 (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Fortitude (Helm Removed)",
    Index: "Fortitude (Dummy)",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Fortitude (Dummy)",
    Properties: [
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "+0 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Grief",
    Index: "Grief",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Grief",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 Venom on striking",
        Index: 0
      },
      {
        PropertyString: "+30-40% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+250-300 Damage",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 3
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "+1.88% Damage to Demons (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "-20-25% to Enemy Poison Resistance",
        Index: 5
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+11 Life after each Kill",
        Index: 6
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Night",
    Index: "Night",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Night",
    Properties: [
      {
        PropertyString: "+10-20 to Maximum Damage",
        Index: 4
      },
      {
        PropertyString: "+150-300% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+200-300 Defense",
        Index: 3
      },
      {
        PropertyString: "+10-20 to Vitality",
        Index: 2
      },
      {
        PropertyString: "+15-20 to Energy",
        Index: 6
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "+70-100% extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "+40-70% better chance of getting magic item",
        Index: 1
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Bramble",
    Index: "Bramble",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Bramble",
    Properties: [
      {
        PropertyString: "Level 15-21 Thorns Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+50% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+25-50% to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+300 Defense",
        Index: 1
      },
      {
        PropertyString: "+5% Increased Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +100%",
        Index: 5
      },
      {
        PropertyString: "+13 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "Level 13 Spirit of Barbs (33 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Dragon",
    Index: "Dragon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Dragon",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 18 Venom when struck",
        Index: 0
      },
      {
        PropertyString: "12% Chance to cast level 15 Hydra on striking",
        Index: 1
      },
      {
        PropertyString: "Level 14 Holy Fire Aura When Equipped",
        Index: 6
      },
      {
        PropertyString: "+360 Defense",
        Index: 2
      },
      {
        PropertyString: "+230 Defense vs. Missile",
        Index: 3
      },
      {
        PropertyString: "+0.38 to Strength (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "+3-5 to All Attributes",
        Index: 5
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Armor)",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7 (Armor)",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Shield)",
        Index: 0
      },
      {
        PropertyString: "+50 to Mana (Shield)",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7 (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Mantle of Lazarus",
    Index: "Mantle of Lazarus",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Mantle of Lazarus",
    Properties: [
      {
        PropertyString: "+2 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+20% to Fire Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+20% to Cold Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+20% to Lightning Skill Damage",
        Index: 6
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+10% Increased Maximum Mana",
        Index: 3
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 2
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Eclipse",
    Index: "Eclipse",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Eclipse",
    Properties: [
      {
        PropertyString: "8% Chance to cast level 5 Amplify Damage on striking",
        Index: 0
      },
      {
        PropertyString: "+1 to Melee Mastery",
        Index: 1
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+300-350% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "+10% Chance of Crushing Blow",
        Index: 4
      },
      {
        PropertyString: "+10% Deadly Strike",
        Index: 3
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "+5% Physical Damage Reduction",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Siren's Song",
    Index: "Siren's Song",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Siren's Song",
    Properties: [
      {
        PropertyString: "44% Chance to cast level 3 Confuse when struck",
        Index: 5
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+1 Defense (Per Character Level)",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Maximum Mana",
        Index: 1
      },
      {
        PropertyString: "+10-20 to All Attributes",
        Index: 3
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30-50% better chance of getting magic item",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Amazon Spear",
        Index: "Amazon Spear",
        Class: "ama"
      }
    ],
    Name: "Tradition",
    Index: "Tradition",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Tradition",
    Properties: [
      {
        PropertyString: "+3 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+50% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+375-450% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+10% Mana stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "-25% to Enemy Lightning Resistance",
        Index: 5
      },
      {
        PropertyString: "+25% to Lightning Skill Damage",
        Index: 6
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Wind",
    Index: "Wind",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Wind",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 9 Tornado on striking",
        Index: 4
      },
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+120-160% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+15% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "-50% Target Defense",
        Index: 3
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "+5% Increased Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Level 13 Twister (127 Charges)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Beast",
    Index: "Beast",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Beast",
    Properties: [
      {
        PropertyString: "Level 9 Fanaticism Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+3 to Werebear",
        Index: 5
      },
      {
        PropertyString: "+3 to Lycanthropy",
        Index: 6
      },
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+240-270% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+25-40 to Strength",
        Index: 3
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Level 13 Summon Grizzly (5 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Rathma's Husk",
    Index: "Rathma's Husk",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Rathma's Husk",
    Properties: [
      {
        PropertyString: "+2 to Poison Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+20% to Poison Skill Damage",
        Index: 1
      },
      {
        PropertyString: "+2 to Poison Dagger (Necromancer Only)",
        Index: 3
      },
      {
        PropertyString: "+2 to Poison Volley (Necromancer Only)",
        Index: 4
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 6
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 2
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Chains of Honor",
    Index: "Chains of Honor",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Chains of Honor",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+200% Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+100% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+70% Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+20 to Strength",
        Index: 6
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "All Resistances +65%",
        Index: 0
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sol Rune",
        ItemLevel: 27,
        RequiredLevel: 27,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Eternity",
    Index: "Eternity",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Eternity",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 1
      },
      {
        PropertyString: "+260-310% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Slows target by 33%",
        Index: 2
      },
      {
        PropertyString: "+16 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "+5% Increased Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +16%",
        Index: 5
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 6
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Level 8 Revive (88 Charges)",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Infinity",
    Index: "Infinity",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Infinity",
    Properties: [
      {
        PropertyString: "50% Chance to cast level 20 Chain Lightning when you Kill an Enemy",
        Index: 4
      },
      {
        PropertyString: "Level 12 Conviction Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+35% Faster Run/Walk",
        Index: 1
      },
      {
        PropertyString: "+255-325% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "-45-55% to Enemy Lightning Resistance",
        Index: 5
      },
      {
        PropertyString: "+40% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+0.5 to Vitality (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "Level 21 Cyclone Armor (30 Charges)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Knight's Vigil",
    Index: "Knight's Vigil",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Knight's Vigil",
    Properties: [
      {
        PropertyString: "Level 8-12 Meditation Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+40% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 4
      },
      {
        PropertyString: "+20-30% Increased Chance of Blocking",
        Index: 3
      },
      {
        PropertyString: "+10-15 Replenish Life",
        Index: 6
      },
      {
        PropertyString: "+12 To Required Level",
        Index: 5
      },
      {
        PropertyString: "+25% better chance of getting magic item (Armor)",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters (Armor)",
        Index: 0
      },
      {
        PropertyString: "+8% Physical Damage Reduction (Armor)",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item (Shield)",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters (Shield)",
        Index: 0
      },
      {
        PropertyString: "+8% Physical Damage Reduction (Shield)",
        Index: 0
      },
      {
        PropertyString: "All Resistances +22% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Mail of the Askari",
    Index: "Mail of the Askari",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Mail of the Askari",
    Properties: [
      {
        PropertyString: "Level 12 Vigor Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+2 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+150-200% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 6
      },
      {
        PropertyString: "+40 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 4
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      },
      {
        Name: "Circlet",
        Index: "Circlet",
        Class: ""
      }
    ],
    Name: "Venom",
    Index: "Venom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Venom",
    Properties: [
      {
        PropertyString: "Level 8 Cleansing Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+2 to Poison Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to Venom",
        Index: 3
      },
      {
        PropertyString: "+15% to Poison Skill Damage",
        Index: 2
      },
      {
        PropertyString: "-15% to Enemy Poison Resistance",
        Index: 6
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 4
      },
      {
        PropertyString: "+13% Physical Damage Reduction",
        Index: 5
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Wrath",
    Index: "Wrath",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Wrath",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 10 Life Tap on striking",
        Index: 4
      },
      {
        PropertyString: "30% Chance to cast level 1 Decrepify on striking",
        Index: 5
      },
      {
        PropertyString: "+300% Damage to Demons",
        Index: 0
      },
      {
        PropertyString: "+250-300% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "Adds 85-120 to Magic Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 41-240 to Lightning Damage",
        Index: 2
      },
      {
        PropertyString: "+30% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Brand",
    Index: "Brand",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Brand",
    Properties: [
      {
        PropertyString: "35% Chance to cast level 14 Amplify Damage when struck",
        Index: 0
      },
      {
        PropertyString: "100% Chance to cast level 18 Bone Spear on striking",
        Index: 1
      },
      {
        PropertyString: "+260-340% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+1 Fires Explosive Arrows or Bolts",
        Index: 2
      },
      {
        PropertyString: "+280-330% Damage to Demons",
        Index: 4
      },
      {
        PropertyString: "Knockback",
        Index: 5
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 7",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Orb",
        Index: "Orb",
        Class: "sor"
      }
    ],
    Name: "Daylight",
    Index: "Daylight",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Daylight",
    Properties: [
      {
        PropertyString: "Level 4 Conviction Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+3 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+25% Increased Maximum Life",
        Index: 6
      },
      {
        PropertyString: "+50% Increased Maximum Mana",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana +50%",
        Index: 1
      },
      {
        PropertyString: "Level 18 Lower Resist (33 Charges)",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Destruction",
    Index: "Destruction",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Destruction",
    Properties: [
      {
        PropertyString: "23% Chance to cast level 12 Volcano on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 23 Molten Boulder on striking",
        Index: 1
      },
      {
        PropertyString: "100% Chance to cast level 45 Meteor when you Die",
        Index: 2
      },
      {
        PropertyString: "15% Chance to cast level 22 Nova on attack",
        Index: 3
      },
      {
        PropertyString: "+350% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "Adds 100-180 to Magic Damage",
        Index: 5
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Pul Rune",
        ItemLevel: 45,
        RequiredLevel: 45,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Dream",
    Index: "Dream",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Dream",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 15 Confuse when struck",
        Index: 0
      },
      {
        PropertyString: "Level 15 Holy Shock Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+20-30% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+150-220 Defense",
        Index: 3
      },
      {
        PropertyString: "+0.62 to Mana (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "All Resistances +5-20%",
        Index: 5
      },
      {
        PropertyString: "+15-25% better chance of getting magic item",
        Index: 6
      },
      {
        PropertyString: "+10 to Vitality (Armor)",
        Index: 0
      },
      {
        PropertyString: "+30% Enhanced Defense (Armor)",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality (Shield)",
        Index: 0
      },
      {
        PropertyString: "+30% Enhanced Defense (Shield)",
        Index: 0
      },
      {
        PropertyString: "+50 to Life (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Enigma",
    Index: "Enigma",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Enigma",
    Properties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+1 to Teleport",
        Index: 6
      },
      {
        PropertyString: "+45% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+750-775 Defense",
        Index: 0
      },
      {
        PropertyString: "+0.75 to Strength (Per Character Level)",
        Index: 3
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "+14 Life after each Kill",
        Index: 1
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+1% better chance of getting magic item (Per Character Level)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Faith",
    Index: "Faith",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Faith",
    Properties: [
      {
        PropertyString: "Level 12-15 Fanaticism Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+1-2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+280% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+300% bonus to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+120 to Minimum Fire Damage",
        Index: 2
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 3
      },
      {
        PropertyString: "10% Reanimate as: Returned",
        Index: 5
      },
      {
        PropertyString: "+5 Life after each Kill",
        Index: 0
      },
      {
        PropertyString: "+50% extra gold from monsters",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Famine",
    Index: "Famine",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Famine",
    Properties: [
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+320-370% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "Adds 180-200 to Magic Damage",
        Index: 4
      },
      {
        PropertyString: "Adds 50-200 to Fire Damage",
        Index: 5
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+12% Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "Ethereal (Cannot Be Repaired)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Fury",
    Index: "Fury",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Fury",
    Properties: [
      {
        PropertyString: "+40% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+209% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6% Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+33% Deadly Strike",
        Index: 5
      },
      {
        PropertyString: "+66% Chance of Open Wounds",
        Index: 3
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 2
      },
      {
        PropertyString: "+5 to Frenzy (Barbarian Only)",
        Index: 6
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Ice",
    Index: "Ice",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Ice",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 40 Blizzard when you Level-Up",
        Index: 0
      },
      {
        PropertyString: "25% Chance to cast level 22 Frost Nova on striking",
        Index: 1
      },
      {
        PropertyString: "Level 18 Holy Freeze Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+140-210% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+25-30% to Cold Skill Damage",
        Index: 4
      },
      {
        PropertyString: "-20% to Enemy Cold Resistance",
        Index: 5
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14",
        Index: 0
      },
      {
        PropertyString: "+3.12% extra gold from monsters (Per Character Level)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Phoenix",
    Index: "Phoenix",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Phoenix",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 40 Blaze when you Level-Up",
        Index: 0
      },
      {
        PropertyString: "40% Chance to cast level 22 Firestorm on striking",
        Index: 1
      },
      {
        PropertyString: "Level 13 Redemption Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "-28% to Enemy Fire Resistance",
        Index: 4
      },
      {
        PropertyString: "+350-400 Defense vs. Missile",
        Index: 5
      },
      {
        PropertyString: "+15-21 Fire Absorb",
        Index: 6
      },
      {
        PropertyString: "+14% Mana stolen per hit (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20% Deadly Strike (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Ignore Target's Defense (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Fire Resist (Shield)",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Shield)",
        Index: 0
      },
      {
        PropertyString: "+50 to Life (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ko Rune",
        ItemLevel: 39,
        RequiredLevel: 39,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Akarat's Devotion",
    Index: "Akarat's Devotion",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Akarat's Devotion",
    Properties: [
      {
        PropertyString: "Level 8 Redemption Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+3 to Blessed Hammer (Paladin Only)",
        Index: 5
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+50 to Strength",
        Index: 6
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 4
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Barbarian Item",
        Index: "Barbarian Item",
        Class: "bar"
      }
    ],
    Name: "Prowess in Battle",
    Index: "Prowess in Battle",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Prowess in Battle",
    Properties: [
      {
        PropertyString: "Level 6 Fanaticism Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+3 to Barbarian Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "+40% Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "+50% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+3 Defense (Per Character Level)",
        Index: 6
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Storm",
    Index: "Storm",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Storm",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 21 Lightning on striking",
        Index: 2
      },
      {
        PropertyString: "+10 to Thunder Storm",
        Index: 3
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+383% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +100%",
        Index: 4
      },
      {
        PropertyString: "+25% Lightning Absorb",
        Index: 5
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Time",
    Index: "Time",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Time",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 25 Nova when struck",
        Index: 4
      },
      {
        PropertyString: "+1 to Teleport",
        Index: 6
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+160-220% Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+35-50 to Life",
        Index: 2
      },
      {
        PropertyString: "+10-20% Increased Maximum Life",
        Index: 3
      },
      {
        PropertyString: "+20 To Required Level",
        Index: 1
      },
      {
        PropertyString: "+5% Increased Maximum Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14 (Armor)",
        Index: 0
      },
      {
        PropertyString: "+50 to Life (Shield)",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +14 (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ral Rune",
        ItemLevel: 19,
        RequiredLevel: 19,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ort Rune",
        ItemLevel: 21,
        RequiredLevel: 21,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Armageddon",
    Index: "Armageddon",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Armageddon",
    Properties: [
      {
        PropertyString: "40% Chance to cast level 20 Blizzard on striking",
        Index: 3
      },
      {
        PropertyString: "40% Chance to cast level 20 Chain Lightning when struck",
        Index: 4
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+275-350% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 50-300 to Fire Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 6
      },
      {
        PropertyString: "+13 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Broken Promise",
    Index: "Broken Promise",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Broken Promise",
    Properties: [
      {
        PropertyString: "18% Chance to cast level 18 Bone Spirit on striking",
        Index: 4
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+3 to Maximum Damage (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+35% Chance of Crushing Blow",
        Index: 6
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "-5% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+15 To Required Level",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Doom",
    Index: "Doom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Doom",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 18 Cyclone Armor when struck",
        Index: 6
      },
      {
        PropertyString: "Level 12 Holy Freeze Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+50% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+40% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+15-25% to Cold Skill Damage",
        Index: 0
      },
      {
        PropertyString: "-40-60% to Enemy Cold Resistance",
        Index: 4
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+30% Increased Maximum Mana",
        Index: 3
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ohm Rune",
        ItemLevel: 57,
        RequiredLevel: 57,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Doom",
    Index: "Doom",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Doom",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 18 Volcano on striking",
        Index: 6
      },
      {
        PropertyString: "Level 12 Holy Freeze Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+45% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+330-370% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "-40-60% to Enemy Cold Resistance",
        Index: 4
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Amazon Bow",
        Index: "Amazon Bow",
        Class: "ama"
      }
    ],
    Name: "Elation",
    Index: "Elation",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Elation",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 8 Nova on striking",
        Index: 2
      },
      {
        PropertyString: "100% Chance to cast level 60 Nova when you Die",
        Index: 4
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+40-75 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+2.25 to Maximum Damage (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20-25% to Cold Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+20-25% to Fire Skill Damage",
        Index: 6
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "Knockback",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Hand of Justice",
    Index: "Hand of Justice",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Hand of Justice",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 36 Blaze when you Level-Up",
        Index: 3
      },
      {
        PropertyString: "100% Chance to cast level 48 Meteor when you Die",
        Index: 4
      },
      {
        PropertyString: "Level 16 Holy Fire Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+33% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+280-330% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 5
      },
      {
        PropertyString: "-20% to Enemy Fire Resistance",
        Index: 6
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      },
      {
        Name: "Club",
        Index: "Club",
        Class: ""
      },
      {
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Last Wish",
    Index: "Last Wish",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Last Wish",
    Properties: [
      {
        PropertyString: "6% Chance to cast level 11 Fade when struck",
        Index: 0
      },
      {
        PropertyString: "10% Chance to cast level 18 Life Tap on striking",
        Index: 1
      },
      {
        PropertyString: "20% Chance to cast level 20 Charged Bolt on attack",
        Index: 2
      },
      {
        PropertyString: "Level 17 Might Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "+40-50 to Minimum Damage",
        Index: 5
      },
      {
        PropertyString: "+80-100 to Maximum Damage",
        Index: 6
      },
      {
        PropertyString: "Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Metamorphosis",
    Index: "Metamorphosis",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Metamorphosis",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 1 Mark Of The Bear on striking",
        Index: 0
      },
      {
        PropertyString: "100% Chance to cast level 1 Mark Of The Wolf on striking",
        Index: 1
      },
      {
        PropertyString: "+5 to Shape Shifting Skills (Druid only)",
        Index: 2
      },
      {
        PropertyString: "+25% Chance of Crushing Blow",
        Index: 5
      },
      {
        PropertyString: "+50-80% Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "All Resistances +10%",
        Index: 4
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Thul Rune",
        ItemLevel: 23,
        RequiredLevel: 23,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Mist",
    Index: "Mist",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Mist",
    Properties: [
      {
        PropertyString: "Level 8-12 Concentration Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+325-375% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+100% Piercing Attack",
        Index: 3
      },
      {
        PropertyString: "+24 to Vitality",
        Index: 4
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 5
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Fal Rune",
        ItemLevel: 41,
        RequiredLevel: 41,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Qual-Kehk's Oath",
    Index: "Qual-Kehk's Oath",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Qual-Kehk's Oath",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 8 Decrepify on striking",
        Index: 5
      },
      {
        PropertyString: "+2 to Barbarian Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+200-250% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 4
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Missile Weapon",
        Index: "Missile Weapon",
        Class: ""
      }
    ],
    Name: "Peril",
    Index: "Peril",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Peril",
    Properties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+75% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+250% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+3.12 to Maximum Damage (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+10 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "+20-30 to All Attributes",
        Index: 6
      },
      {
        PropertyString: "+16% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+1% better chance of getting magic item (Per Character Level)",
        Index: 5
      },
      {
        PropertyString: "+11 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Sword",
        Index: "Sword",
        Class: ""
      },
      {
        Name: "Knife",
        Index: "Knife",
        Class: ""
      },
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Plague",
    Index: "Plague",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Plague",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 12 Lower Resist when struck",
        Index: 1
      },
      {
        PropertyString: "25% Chance to cast level 15 Poison Nova on striking",
        Index: 2
      },
      {
        PropertyString: "Level 13-17 Cleansing Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+1-2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+220-320% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "-23% to Enemy Poison Resistance",
        Index: 3
      },
      {
        PropertyString: "+0.38% Deadly Strike (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "+25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lo Rune",
        ItemLevel: 59,
        RequiredLevel: 59,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      },
      {
        Name: "Spear",
        Index: "Spear",
        Class: ""
      }
    ],
    Name: "Pride",
    Index: "Pride",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Pride",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 17 Fire Wall when struck",
        Index: 4
      },
      {
        PropertyString: "Level 16-20 Concentration Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+260-300% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+1% Damage to Demons (Per Character Level)",
        Index: 0
      },
      {
        PropertyString: "Adds 50-280 to Lightning Damage",
        Index: 1
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+8 Replenish Life",
        Index: 5
      },
      {
        PropertyString: "+1.88% extra gold from monsters (Per Character Level)",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Bark of the Great Oak",
    Index: "Bark of the Great Oak",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Bark of the Great Oak",
    Properties: [
      {
        PropertyString: "Level 18 Defiance Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+2 to Druid Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+200-250% Enhanced Defense",
        Index: 6
      },
      {
        PropertyString: "+25 to All Attributes",
        Index: 3
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 4
      },
      {
        PropertyString: "+16% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Dol Rune",
        ItemLevel: 31,
        RequiredLevel: 31,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Sur Rune",
        ItemLevel: 61,
        RequiredLevel: 61,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Melee Weapon",
        Index: "Melee Weapon",
        Class: ""
      }
    ],
    Name: "Valor",
    Index: "Valor",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Valor",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 4
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+100 to Minimum Damage",
        Index: 1
      },
      {
        PropertyString: "+2.5 to Maximum Damage (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+5% Increased Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+5% to Experience Gained",
        Index: 5
      },
      {
        PropertyString: "Level 40 Battle Orders (15 Charges)",
        Index: 6
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Ethereal (Cannot Be Repaired)",
        Index: 3
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Scepter",
        Index: "Scepter",
        Class: ""
      }
    ],
    Name: "Wings of Hope",
    Index: "Wings of Hope",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Wings of Hope",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 35 Bone Spear on striking",
        Index: 4
      },
      {
        PropertyString: "Level 3 Salvation Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+1 to Warp",
        Index: 2
      },
      {
        PropertyString: "+60-100 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+150-200 to Maximum Damage",
        Index: 1
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 5
      },
      {
        PropertyString: "Freezes target +6",
        Index: 0
      },
      {
        PropertyString: "+20 to All Attributes",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Woe",
    Index: "Woe",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Woe",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 25 Chain Lightning when struck",
        Index: 1
      },
      {
        PropertyString: "25% Chance to cast level 25 Fire Ball when struck",
        Index: 2
      },
      {
        PropertyString: "25% Chance to cast level 25 Blizzard when struck",
        Index: 3
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+25 to All Attributes",
        Index: 5
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "Poison Length Reduced by 80%",
        Index: 6
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+7 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Circlet",
        Index: "Circlet",
        Class: ""
      }
    ],
    Name: "Rain Reimagined",
    Index: "Rain Reimagined",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Rain Reimagined",
    Properties: [
      {
        PropertyString: "+16% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "-1 to Light Radius",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Helm",
        Index: "Helm",
        Class: ""
      }
    ],
    Name: "Authority",
    Index: "Authority",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Authority",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 9 Weaken on striking",
        Index: 4
      },
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25% Deadly Strike",
        Index: 6
      },
      {
        PropertyString: "Slows target by 20%",
        Index: 5
      },
      {
        PropertyString: "+160-200% Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+8% Physical Damage Reduction",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+1.5% better chance of getting magic item (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+12 To Required Level",
        Index: 1
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eld Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Eth Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Breath of the Dying",
    Index: "Breath of the Dying",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Breath of the Dying",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+60% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+200% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Adds 12-15% Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "+30 to All Attributes",
        Index: 5
      },
      {
        PropertyString: "+1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Amn Rune",
        ItemLevel: 25,
        RequiredLevel: 25,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Vex Rune",
        ItemLevel: 55,
        RequiredLevel: 55,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Darkness",
    Index: "Darkness",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Darkness",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+3 to Assassin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "Adds 75-150 to Damage",
        Index: 2
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+7% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20-30 to All Attributes",
        Index: 1
      },
      {
        PropertyString: "All Resistances +20-40%",
        Index: 3
      },
      {
        PropertyString: "+15% Physical Damage Reduction",
        Index: 4
      },
      {
        PropertyString: "+1% better chance of getting magic item (Per Character Level)",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Um Rune",
        ItemLevel: 47,
        RequiredLevel: 47,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Humility",
    Index: "Humility",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Humility",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "Level 3-5 Salvation Aura When Equipped",
        Index: 6
      },
      {
        PropertyString: "+1-4 to Shout",
        Index: 1
      },
      {
        PropertyString: "+1-4 to Battle Orders",
        Index: 2
      },
      {
        PropertyString: "+1-4 to Battle Command",
        Index: 3
      },
      {
        PropertyString: "+1-4 to Shiver Armor",
        Index: 4
      },
      {
        PropertyString: "+10-15 to Valkyrie",
        Index: 5
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+17 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Mal Rune",
        ItemLevel: 49,
        RequiredLevel: 49,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ith Rune",
        ItemLevel: 15,
        RequiredLevel: 15,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ber Rune",
        ItemLevel: 63,
        RequiredLevel: 63,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Cham Rune",
        ItemLevel: 67,
        RequiredLevel: 67,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Polearm",
        Index: "Polearm",
        Class: ""
      }
    ],
    Name: "Morning Dew",
    Index: "Morning Dew",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Morning Dew",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 20 Static Field when you Kill an Enemy",
        Index: 5
      },
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+3 to Druid Skill Levels",
        Index: 3
      },
      {
        PropertyString: "+20 to Melee Mastery",
        Index: 4
      },
      {
        PropertyString: "+50% Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+300-360% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+9 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 6
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Gul Rune",
        ItemLevel: 53,
        RequiredLevel: 53,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Druid Item",
        Index: "Druid Item",
        Class: "dru"
      }
    ],
    Name: "Mystery",
    Index: "Mystery",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Mystery",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "Level 6 Concentration Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+3 to Druid Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+15% Increased Maximum Life",
        Index: 2
      },
      {
        PropertyString: "+15% Increased Maximum Mana",
        Index: 1
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30-50%",
        Index: 3
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 6
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lem Rune",
        ItemLevel: 43,
        RequiredLevel: 43,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Io Rune",
        ItemLevel: 35,
        RequiredLevel: 35,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Nef Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Obsession",
    Index: "Obsession",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Obsession",
    Properties: [
      {
        PropertyString: "24% Chance to cast level 10 Weaken when struck",
        Index: 1
      },
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+65% Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+60% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "Knockback",
        Index: 0
      },
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+15-25% Increased Maximum Life",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 6
      },
      {
        PropertyString: "All Resistances +60-70%",
        Index: 4
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Jah Rune",
        ItemLevel: 65,
        RequiredLevel: 65,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Shael Rune",
        ItemLevel: 29,
        RequiredLevel: 29,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Purity",
    Index: "Purity",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Purity",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 19 Bone Armor when struck",
        Index: 4
      },
      {
        PropertyString: "35% Chance to cast level 8 Dim Vision on striking",
        Index: 5
      },
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "+50% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "+55% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+4 Defense (Per Character Level)",
        Index: 6
      },
      {
        PropertyString: "+50 to Life",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30-50%",
        Index: 3
      },
      {
        PropertyString: "+15 Life after each Kill",
        Index: 1
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Lum Rune",
        ItemLevel: 37,
        RequiredLevel: 37,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Tir Rune",
        ItemLevel: 13,
        RequiredLevel: 13,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Staff",
        Index: "Staff",
        Class: ""
      }
    ],
    Name: "Reason",
    Index: "Reason",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Reason",
    Properties: [
      {
        PropertyString: "Indestructible",
        Index: 0
      },
      {
        PropertyString: "Level 5 Meditation Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+3 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+50% Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+4 to random Sorceress Skill",
        Index: 6
      },
      {
        PropertyString: "+20 to Energy",
        Index: 0
      },
      {
        PropertyString: "+20% Physical Damage Reduction",
        Index: 4
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+20% Damage Taken Goes To Mana",
        Index: 5
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
  },
  {
    Runes: [
      {
        Name: "Zod Rune",
        ItemLevel: 69,
        RequiredLevel: 69,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Hel Rune",
        ItemLevel: 33,
        RequiredLevel: 0,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "Ist Rune",
        ItemLevel: 51,
        RequiredLevel: 51,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      },
      {
        Name: "El Rune",
        ItemLevel: 11,
        RequiredLevel: 11,
        Type: {
          Name: "Rune",
          Index: "Rune",
          Class: ""
        }
      }
    ],
    Types: [
      {
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      },
      {
        Name: "Any Armor",
        Index: "Any Armor",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Starlight",
    Index: "Starlight",
    Enabled: true,
    Rarity: 0,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Starlight",
    Properties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "Adds 35-140 to Damage",
        Index: 1
      },
      {
        PropertyString: "+100-200% Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+150-300% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "Requirements -80%",
        Index: 3
      },
      {
        PropertyString: "+20 To Required Level",
        Index: 5
      },
      {
        PropertyString: "+1 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+30% better chance of getting magic item (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+50 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "Indestructible (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Requirements -20% (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius (Armor)",
        Index: 0
      },
      {
        PropertyString: "+15 Defense (Armor)",
        Index: 1
      },
      {
        PropertyString: "+25% better chance of getting magic item (Armor)",
        Index: 0
      },
      {
        PropertyString: "Indestructible (Armor)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+1 to Light Radius (Shield)",
        Index: 0
      },
      {
        PropertyString: "+15 Defense (Shield)",
        Index: 1
      },
      {
        PropertyString: "+25% better chance of getting magic item (Shield)",
        Index: 0
      },
      {
        PropertyString: "Indestructible (Shield)",
        Index: 0
      },
      {
        PropertyString: "Requirements -15% (Shield)",
        Index: 0
      }
    ],
    DamageArmorEnhanced: false,
    Equipment: null
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
var _handleExclusiveTypeChanged_dec, _selectedAmountChanged_dec, _selectedTypeChanged_dec, _handleSearchChanged_dec, _handleSearchRunesChanged_dec, _exclusiveType_dec, _searchRunes_dec, _search_dec, _Runewords_decorators, _init;
_Runewords_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _searchRunes_dec = [bindable], _exclusiveType_dec = [bindable], _handleSearchRunesChanged_dec = [watch("searchRunes")], _handleSearchChanged_dec = [watch("search")], _selectedTypeChanged_dec = [watch("selectedType")], _selectedAmountChanged_dec = [watch("selectedAmount")], _handleExclusiveTypeChanged_dec = [watch("exclusiveType")];
class Runewords {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "runewords", json);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "searchRunes", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "exclusiveType", __runInitializers(_init, 16, this)), __runInitializers(_init, 19, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "filteredRunewords", []);
    __publicField(this, "types", [
      // Parent types
      { label: "-", value: [] },
      { label: "Any Armor", value: ["Armor", "Any Armor"] },
      { label: "Any Helm", value: ["Helm"] },
      { label: "Any Weapon", value: ["Weapon"] },
      { label: "Any Melee Weapon", value: ["Melee Weapon", "Weapon"] },
      { label: "Any Missile Weapon", value: ["Missile Weapon", "Weapon"] },
      { label: "Any Shield", value: ["Any Shield"] },
      // Specific weapon types
      { label: "Axe", value: ["Axe", "Melee Weapon", "Weapon"] },
      { label: "Club", value: ["Club", "Melee Weapon", "Weapon"] },
      { label: "Hammer", value: ["Hammer", "Melee Weapon", "Weapon"] },
      { label: "Hand to Hand", value: ["Hand to Hand", "Melee Weapon", "Weapon"] },
      { label: "Mace", value: ["Mace", "Melee Weapon", "Weapon"] },
      { label: "Orb", value: ["Orb"] },
      { label: "Polearm", value: ["Polearm", "Melee Weapon", "Weapon"] },
      { label: "Scepter", value: ["Scepter", "Melee Weapon", "Weapon"] },
      { label: "Staff", value: ["Staff", "Melee Weapon", "Weapon"] },
      { label: "Spear", value: ["Spear", "Melee Weapon", "Weapon"] },
      { label: "Sword", value: ["Sword", "Melee Weapon", "Weapon"] },
      { label: "Wand", value: ["Wand", "Melee Weapon", "Weapon"] },
      // Specific armor types
      { label: "Circlet", value: ["Circlet", "Helm"] },
      // Class specific types
      { label: "Amazon Bow", value: ["Amazon Bow", "Missile Weapon", "Weapon"] },
      { label: "Amazon Spear", value: ["Amazon Spear", "Spear", "Melee Weapon", "Weapon"] },
      { label: "Necromancer Shield", value: ["Necromancer Item", "Any Shield"] },
      { label: "Barbarian Item", value: ["Barbarian Item"] },
      { label: "Paladin Item", value: ["Paladin Item"] },
      { label: "Druid Item", value: ["Druid Item"] }
    ]);
    __publicField(this, "selectedType");
    __publicField(this, "amounts", [
      { value: void 0, label: "Any" },
      { value: 2, label: "2 Sockets" },
      { value: 3, label: "3 Sockets" },
      { value: 4, label: "4 Sockets" },
      { value: 5, label: "5 Sockets" },
      { value: 6, label: "6 Sockets" }
    ]);
    __publicField(this, "selectedAmount");
  }
  attached() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      this.search = searchParam;
    }
    const runesParam = urlParams.get("runes");
    if (runesParam) {
      this.searchRunes = runesParam;
    }
    const typeParam = urlParams.get("type");
    if (typeParam) {
      this.selectedType = typeParam.split(",");
    }
    const socketsParam = urlParams.get("sockets");
    if (socketsParam) {
      this.selectedAmount = parseInt(socketsParam, 10);
    }
    const exactParam = urlParams.get("exact");
    if (exactParam) {
      this.exclusiveType = exactParam === "true";
    }
    this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
    this.updateList();
  }
  // Helper method to update URL with current search parameters
  updateUrl() {
    const url = new URL(window.location.href);
    if (this.search && this.search.trim() !== "") {
      url.searchParams.set("search", this.search);
    } else {
      url.searchParams.delete("search");
    }
    if (this.searchRunes && this.searchRunes.trim() !== "") {
      url.searchParams.set("runes", this.searchRunes);
    } else {
      url.searchParams.delete("runes");
    }
    if (this.selectedType && this.selectedType.length > 0) {
      url.searchParams.set("type", this.selectedType.join(","));
    } else {
      url.searchParams.delete("type");
    }
    if (this.selectedAmount) {
      url.searchParams.set("sockets", this.selectedAmount.toString());
    } else {
      url.searchParams.delete("sockets");
    }
    if (this.exclusiveType) {
      url.searchParams.set("exact", "true");
    } else {
      url.searchParams.delete("exact");
    }
    window.history.pushState({}, "", url.toString());
  }
  handleSearchRunesChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  selectedTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  selectedAmountChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  handleExclusiveTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  normalizeRuneName(name2) {
    return name2.replace(/ rune$/i, "").trim().toLowerCase();
  }
  updateList() {
    let filteringRunewords = this.runewords;
    if (this.selectedType?.length > 0) {
      const selectedType = this.exclusiveType ? [this.selectedType[0]] : this.selectedType;
      filteringRunewords = filteringRunewords.filter((x) => {
        for (const type of x.Types) {
          if (selectedType.includes(type.Index) || type.Index === "Merc Equip" && selectedType.includes("Helm")) {
            return true;
          }
        }
        return false;
      });
    }
    if (this.selectedAmount) {
      filteringRunewords = filteringRunewords.filter((x) => x.Runes.length === this.selectedAmount);
    }
    let found = filteringRunewords;
    if (this.search) {
      found = found.filter((runeword) => {
        if (runeword.Name.toLowerCase().includes(this.search.toLowerCase())) {
          return true;
        }
        for (const property of runeword.Properties) {
          if (property.PropertyString.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          }
        }
        for (const type of runeword.Types) {
          if (type.Name.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    }
    if (this.searchRunes) {
      const inputRuneList = this.searchRunes.split(" ").map((rune) => rune.trim().toLowerCase()).filter((rune) => rune.length > 0);
      found = found.filter((runeword) => {
        const runewordRuneNames = runeword.Runes.map((rune) => this.normalizeRuneName(rune.Name));
        return inputRuneList.every(
          (inputRune) => runewordRuneNames.includes(inputRune)
        );
      });
    }
    this.filteredRunewords = found;
  }
  transformTypeName(name2) {
    switch (name2) {
      case "Merc Equip":
        return "Helm";
      default:
        return name2;
    }
  }
  actualLevelRequirement(runeword) {
    for (const property of runeword.Properties) {
      if (property.PropertyString && property.PropertyString.includes("To Required Level")) {
        const value = property.PropertyString.substring(1, 3);
        if (!runeword.RequiredLevel) {
          return parseInt(value.trim());
        }
        return runeword.RequiredLevel + parseInt(value.trim());
      }
    }
    return runeword.RequiredLevel;
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchRunesChanged", _handleSearchRunesChanged_dec, Runewords);
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedTypeChanged", _selectedTypeChanged_dec, Runewords);
__decorateElement(_init, 1, "selectedAmountChanged", _selectedAmountChanged_dec, Runewords);
__decorateElement(_init, 1, "handleExclusiveTypeChanged", _handleExclusiveTypeChanged_dec, Runewords);
__decorateElement(_init, 5, "search", _search_dec, Runewords);
__decorateElement(_init, 5, "searchRunes", _searchRunes_dec, Runewords);
__decorateElement(_init, 5, "exclusiveType", _exclusiveType_dec, Runewords);
Runewords = __decorateElement(_init, 0, "Runewords", _Runewords_decorators, Runewords);
__runInitializers(_init, 1, Runewords);
export {
  Runewords
};
