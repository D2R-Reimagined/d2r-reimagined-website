import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-B0bmGqGX.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
const name = "runewords";
const template = '<template>\n    <h3 class="text-center my-4">\n        ${filteredRunewords.length} Runewords Found\n    </h3>\n    <div class="container">\n        <div class="row align-content-center justify-content-center text-center mb-5">\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="au-select mb-2">\n                    <moo-select\n                            class="w-100"\n                            label="Select Socket Count"\n                            options.bind="amounts"\n                            class="standard-betsy-select"\n                            value.bind="selectedAmount"\n                    ></moo-select>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="au-select mb-2">\n                    <moo-select\n                            class="w-100"\n                            label="Select Type"\n                            options.bind="types"\n                            class="standard-betsy-select"\n                            value.bind="selectedType"\n                    ></moo-select>\n                    <moo-checkbox checked.bind="exclusiveType" id="exclusiveType">Exact type only</moo-checkbox>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="mb-2">\n                    <moo-text-field\n                            class="w-100"\n                            label="Search Runewords"\n                            type="text"\n                            value.bind="search"\n                    ></moo-text-field>\n                </div>\n            </div>\n            <div class="col-12 col-md-4 col-lg-3">\n                <div class="mb-2">\n                    <moo-text-field\n                            class="w-100"\n                            label="Runes"\n                            type="text"\n                            value.bind="searchRunes"\n                    ></moo-text-field>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="row gy-5 px-5 text-center">\n        <div class="col-12 col-md-6 col-xxl-4" repeat.for="runeword of filteredRunewords">\n            <div class="card bg-dark p-2">\n                <div class="unique-text fs-4 mb-1">\n                    ${runeword.Name}\n                </div>\n                <div class="combo">\n                    <span repeat.for="rune of runeword.Runes">\n                        ${removeRuneFromName(rune.Name)} ${$index + 1 !== runeword.Runes.length ? \' + \' : \'\'}\n                    </span>\n                </div>\n                <div class="types py-2">\n                    <span repeat.for="type of runeword.Types">\n                        ${transformTypeName(type.Name)} ${$index + 1 !== runeword.Types.length ? \' or \' : \'\'}\n                    </span>\n                </div>\n                <div class="requirement" if.bind="runeword.RequiredLevel > 0">\n                    Level ${runeword.RequiredLevel} Required\n                </div>\n                <div class="mt-2">\n                    <div class="enhanced" repeat.for="property of runeword.Properties">\n                        ${property.PropertyString}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n';
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
    Index: "Runeword70",
    Enabled: true,
    ItemLevel: 33,
    RequiredLevel: 0,
    Code: "Runeword70",
    Properties: [
      {
        PropertyString: "+15 Increased Attack Speed",
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
        PropertyString: "+30 Slows target by",
        Index: 5
      },
      {
        PropertyString: "48 to Life",
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
    Index: "Runeword68",
    Enabled: true,
    ItemLevel: 11,
    RequiredLevel: 11,
    Code: "Runeword68",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+15 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+12 to Maximum Damage Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "20 to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+11 To Required Level",
        Index: 5
      },
      {
        PropertyString: "150 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "3 to Light Radius",
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
    Index: "Runeword23",
    Enabled: true,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Runeword23",
    Properties: [
      {
        PropertyString: "+30-50% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+30-50 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "5 to Strength",
        Index: 2
      },
      {
        PropertyString: "+20-25 better chance of getting magic item",
        Index: 3
      },
      {
        PropertyString: "100 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "6 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+60 Defense (Armor)",
        Index: 1
      },
      {
        PropertyString: "+6 to Mana after each Kill (Weapon)",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Nadir",
    Index: "Runeword88",
    Enabled: true,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Runeword88",
    Properties: [
      {
        PropertyString: "+50 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+10 Defense",
        Index: 1
      },
      {
        PropertyString: "5 to Strength",
        Index: 5
      },
      {
        PropertyString: "-33 extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "-3 to Light Radius",
        Index: 2
      },
      {
        PropertyString: "Level 13 Cloak of Shadows (9 Charges)",
        Index: 3
      },
      {
        PropertyString: "+30 Defense vs. Missile",
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
        Name: "Wand",
        Index: "Wand",
        Class: ""
      }
    ],
    Name: "Shadow of Doubt",
    Index: "Runeword125",
    Enabled: true,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Runeword125",
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
        PropertyString: "+15 Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "10 to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Steel",
    Index: "Runeword134",
    Enabled: true,
    ItemLevel: 13,
    RequiredLevel: 13,
    Code: "Runeword134",
    Properties: [
      {
        PropertyString: "+25 Increased Attack Speed",
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
        PropertyString: "50% Chance of Open Wounds",
        Index: 3
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
    Index: "Runeword15",
    Enabled: true,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Runeword15",
    Properties: [
      {
        PropertyString: "+15 Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 1
      },
      {
        PropertyString: "15% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+25 to Mana",
        Index: 2
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "+20-30 better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Index: "Runeword81",
    Enabled: true,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Runeword81",
    Properties: [
      {
        PropertyString: "+33% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "100% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 2
      },
      {
        PropertyString: "-100 to Monster Defense Per Hit",
        Index: 1
      },
      {
        PropertyString: "-5 Drain Life",
        Index: 5
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 0
      },
      {
        PropertyString: "0 to Light Radius",
        Index: 4
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
    Name: "Peace",
    Index: "Runeword98",
    Enabled: true,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Runeword98",
    Properties: [
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 4
      },
      {
        PropertyString: "Adds 20-40 to Damage",
        Index: 1
      },
      {
        PropertyString: "All Resistances +15",
        Index: 6
      },
      {
        PropertyString: "+6 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Fade",
        Index: 5
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
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
    Index: "Runeword100",
    Enabled: true,
    ItemLevel: 15,
    RequiredLevel: 15,
    Code: "Runeword100",
    Properties: [
      {
        PropertyString: "+15 Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+15 Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "+1 Half Freeze Duration",
        Index: 3
      },
      {
        PropertyString: "+50 Poison Length Reduced by",
        Index: 4
      },
      {
        PropertyString: "Repairs 0.1 durability per second",
        Index: 2
      },
      {
        PropertyString: "30% Damage Taken Goes To Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "+4 to Mana after each Kill (Armor)",
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
    Index: "Runeword63",
    Enabled: true,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Runeword63",
    Properties: [
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+122% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+3 to Jab",
        Index: 3
      },
      {
        PropertyString: "+3 to Sword Mastery",
        Index: 4
      },
      {
        PropertyString: "+154 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
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
    Index: "Runeword133",
    Enabled: true,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Runeword133",
    Properties: [
      {
        PropertyString: "+25 Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+25 Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 4
      },
      {
        PropertyString: "6 to Dexterity",
        Index: 1
      },
      {
        PropertyString: "+3 Magic Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
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
    Index: "Runeword136",
    Enabled: true,
    ItemLevel: 17,
    RequiredLevel: 17,
    Code: "Runeword136",
    Properties: [
      {
        PropertyString: "+15 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+25-40 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 5-8 Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+3 to Multiple Shot",
        Index: 3
      },
      {
        PropertyString: "+5 to Ice Arrow",
        Index: 4
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
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
    Index: "Runeword72",
    Enabled: true,
    ItemLevel: 19,
    RequiredLevel: 19,
    Code: "Runeword72",
    Properties: [
      {
        PropertyString: "+3 to Fire Skills",
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
        PropertyString: "+16 Defense Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "Cold Resist +33%",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
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
    Index: "Runeword96",
    Enabled: true,
    ItemLevel: 19,
    RequiredLevel: 19,
    Code: "Runeword96",
    Properties: [
      {
        PropertyString: "+15 Faster Run/Walk",
        Index: 5
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "20-25 to Life",
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
        PropertyString: "1-3 to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+1 Knockback (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead (Weapon)",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead (Weapon)",
        Index: 0
      },
      {
        PropertyString: "15% Stamina Drain (Armor)",
        Index: 0
      },
      {
        PropertyString: "7% Increased Chance of Blocking (Shield)",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+60 Defense vs. Missile (Armor)",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +65% (Armor)",
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
    Name: "Ancients' Pledge",
    Index: "Runeword1",
    Enabled: true,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Runeword1",
    Properties: [
      {
        PropertyString: "+50 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +13",
        Index: 1
      },
      {
        PropertyString: "10% Damage Taken Goes To Mana",
        Index: 3
      },
      {
        PropertyString: "Fire Resist +35%",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +35%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +35%",
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
    Index: "Runeword54",
    Enabled: true,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Runeword54",
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
        PropertyString: "+154 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "+21-110 to Minimum Lightning Damage",
        Index: 1
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Temptation",
    Index: "Runeword141",
    Enabled: true,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Runeword141",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+176% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "-10 to Strength",
        Index: 3
      },
      {
        PropertyString: "10-15 to Experience Gained",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
    Index: "Runeword169",
    Enabled: true,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Runeword169",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 4 weaken on striking",
        Index: 6
      },
      {
        PropertyString: "+90-120 Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+8-10 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "Cold Resist +30-35%",
        Index: 1
      },
      {
        PropertyString: "Fire Resist +30-35%",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30-35%",
        Index: 2
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 100%",
        Index: 5
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
    Index: "Runeword170",
    Enabled: true,
    ItemLevel: 21,
    RequiredLevel: 21,
    Code: "Runeword170",
    Properties: [
      {
        PropertyString: "7% Chance to cast level 1 twister when struck",
        Index: 4
      },
      {
        PropertyString: "+25 Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+25 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+33% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "66 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+25 Defense",
        Index: 5
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Distortion",
    Index: "Runeword200",
    Enabled: true,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Runeword200",
    Properties: [
      {
        PropertyString: "+3-5 Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+6-10 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+1 to Warp",
        Index: 1
      },
      {
        PropertyString: "10-15 to Strength",
        Index: 3
      },
      {
        PropertyString: "All Resistances +5-10",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Name: "Patter",
    Index: "Runeword97",
    Enabled: true,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Runeword97",
    Properties: [
      {
        PropertyString: "+40-80% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+30 Faster Block Rate",
        Index: 6
      },
      {
        PropertyString: "10 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "Adds 12-32 to Fire Damage",
        Index: 2
      },
      {
        PropertyString: "6 to Strength",
        Index: 4
      },
      {
        PropertyString: "6 to Dexterity",
        Index: 5
      },
      {
        PropertyString: "All Resistances +15",
        Index: 3
      },
      {
        PropertyString: "+154 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
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
    Index: "Runeword108",
    Enabled: true,
    ItemLevel: 33,
    RequiredLevel: 23,
    Code: "Runeword108",
    Properties: [
      {
        PropertyString: "Level 10-14 Prayer Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "20-30% Increased Chance of Blocking",
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
        PropertyString: "All Resistances +15-25",
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
        PropertyString: "Requirements -50% (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +65% (Armor)",
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
    Index: "Runeword56",
    Enabled: true,
    ItemLevel: 23,
    RequiredLevel: 23,
    Code: "Runeword56",
    Properties: [
      {
        PropertyString: "+1 All Sorceress Skills",
        Index: 0
      },
      {
        PropertyString: "+15 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+50-75 to Mana",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana 60%",
        Index: 4
      },
      {
        PropertyString: "Magic Resist +5-10%",
        Index: 5
      },
      {
        PropertyString: "1-3 to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+3 To Required Level",
        Index: 6
      },
      {
        PropertyString: "15% Stamina Drain (Armor)",
        Index: 0
      },
      {
        PropertyString: "7% Increased Chance of Blocking (Shield)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +65% (Armor)",
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Friendship",
    Index: "Runeword43",
    Enabled: true,
    ItemLevel: 33,
    RequiredLevel: 25,
    Code: "Runeword43",
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
        PropertyString: "+66 Chance of Crushing Blow",
        Index: 5
      },
      {
        PropertyString: "+34 Deadly Strike",
        Index: 6
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 2
      },
      {
        PropertyString: "-3 to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
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
    Index: "Runeword31",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword31",
    Properties: [
      {
        PropertyString: "Level 15 Thorns Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "+35 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+320-380% Damage to Demons Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+280% Damage to Undead Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 4
      },
      {
        PropertyString: "8-9 to Strength",
        Index: 6
      },
      {
        PropertyString: "+15 Reduces all Vendor Prices",
        Index: 5
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
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
    Index: "Runeword58",
    Enabled: true,
    ItemLevel: 33,
    RequiredLevel: 25,
    Code: "Runeword58",
    Properties: [
      {
        PropertyString: "15-30% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "+5 Life stolen per hit",
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
        PropertyString: "All Resistances +20",
        Index: 3
      },
      {
        PropertyString: "+10-15 Damage Reduced by 10-15%%",
        Index: 2
      },
      {
        PropertyString: "+8 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
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
    Index: "Runeword65",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword65",
    Properties: [
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "150 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+100% Damage to Demons Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "100 to Attack Rating against Demons",
        Index: 4
      },
      {
        PropertyString: "+50% Damage to Undead Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "100 to Attack Rating against Undead",
        Index: 5
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
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
    Index: "Runeword73",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword73",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 9 lightning on striking",
        Index: 3
      },
      {
        PropertyString: "Level 2 Holy Shock Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+100-175% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Lightning Resist +35-50%",
        Index: 0
      },
      {
        PropertyString: "+8-10 Lightning Absorb",
        Index: 5
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+2-100 to Minimum Lightning Damage",
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
    Index: "Runeword89",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword89",
    Properties: [
      {
        PropertyString: "+1 All Druid Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "10 to Strength",
        Index: 5
      },
      {
        PropertyString: "+40-60 to Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +20",
        Index: 4
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Index: "Runeword123",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword123",
    Properties: [
      {
        PropertyString: "50% Chance to cast level 2 inner sight on striking",
        Index: 1
      },
      {
        PropertyString: "+120% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "20 to Energy",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana 50%",
        Index: 3
      },
      {
        PropertyString: "+14 Life stolen per hit",
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
    Index: "Runeword130",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword130",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+25-35 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+55 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+250 Defense vs. Missile",
        Index: 2
      },
      {
        PropertyString: "22 to Vitality",
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
        PropertyString: "+154 to Minimum Poison Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +35% (Shield)",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+14 Attacker Takes Damage of (Shield)",
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
    Index: "Runeword139",
    Enabled: true,
    ItemLevel: 25,
    RequiredLevel: 25,
    Code: "Runeword139",
    Properties: [
      {
        PropertyString: "+35% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25 Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "20 to Strength",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 2
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
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
    Index: "Runeword55",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword55",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+160% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "200 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+25 Deadly Strike",
        Index: 4
      },
      {
        PropertyString: "10 to Strength",
        Index: 5
      },
      {
        PropertyString: "+10 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
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
    Index: "Runeword62",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword62",
    Properties: [
      {
        PropertyString: "Level 12-17 Meditation Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "+200-260% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+35 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "180-250 bonus to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+1-6 to Critical Strike",
        Index: 3
      },
      {
        PropertyString: "5 to Strength",
        Index: 6
      },
      {
        PropertyString: "+23 better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+154 to Minimum Poison Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+9 to Minimum Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by (Armor)",
        Index: 0
      },
      {
        PropertyString: "+4 to Mana after each Kill (Weapon)",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Lore",
    Index: "Runeword75",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword75",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 3
      },
      {
        PropertyString: "2 to Light Radius",
        Index: 2
      },
      {
        PropertyString: "Lightning Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Radiance",
    Index: "Runeword116",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword116",
    Properties: [
      {
        PropertyString: "+75 Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "10 to Vitality",
        Index: 2
      },
      {
        PropertyString: "10 to Energy",
        Index: 1
      },
      {
        PropertyString: "+33 to Mana",
        Index: 4
      },
      {
        PropertyString: "+3 Magic Damage Reduced by",
        Index: 3
      },
      {
        PropertyString: "5 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Index: "Runeword143",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword143",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+125-150% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+12 to Maximum Damage Per Level (Based on Character Level)",
        Index: 5
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
        PropertyString: "1-3 to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
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
    Index: "Runeword150",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword150",
    Properties: [
      {
        PropertyString: "+1 All Sorceress Skills",
        Index: 1
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+25 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+35 to Mana",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana 75%",
        Index: 3
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+9 to Maximum Damage",
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
    Index: "Runeword157",
    Enabled: true,
    ItemLevel: 27,
    RequiredLevel: 27,
    Code: "Runeword157",
    Properties: [
      {
        PropertyString: "+1 All Barbarian Skills",
        Index: 0
      },
      {
        PropertyString: "+25 Faster Run/Walk",
        Index: 4
      },
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+10-15 to Maximum Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 3-6 Mana stolen per hit",
        Index: 6
      },
      {
        PropertyString: "Adds 3-6 Life stolen per hit",
        Index: 5
      },
      {
        PropertyString: "50 to Life",
        Index: 2
      },
      {
        PropertyString: "+7 Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
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
    Index: "Runeword120",
    Enabled: true,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Runeword120",
    Properties: [
      {
        PropertyString: "20% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "All Resistances +25",
        Index: 2
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 3
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 0
      },
      {
        PropertyString: "+40 Faster Block Rate",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Sorrow",
    Index: "Runeword129",
    Enabled: true,
    ItemLevel: 33,
    RequiredLevel: 29,
    Code: "Runeword129",
    Properties: [
      {
        PropertyString: "+160-200% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6 Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "-2 Drain Life",
        Index: 6
      },
      {
        PropertyString: "Regenerate Mana 50%",
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
      },
      {
        PropertyString: "+40 Increased Attack Speed",
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
    Index: "Runeword161",
    Enabled: true,
    ItemLevel: 29,
    RequiredLevel: 29,
    Code: "Runeword161",
    Properties: [
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
      },
      {
        PropertyString: "+60 Increased Attack Speed",
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
    Index: "Runeword5",
    Enabled: true,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Runeword5",
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
        PropertyString: "+1 Ignore Target's Defense",
        Index: 5
      },
      {
        PropertyString: "+8 Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "50% Chance of Open Wounds",
        Index: 6
      },
      {
        PropertyString: "+15 Slows target by",
        Index: 3
      },
      {
        PropertyString: "+3 Knockback",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "25%",
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
    Index: "Runeword28",
    Enabled: true,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Runeword28",
    Properties: [
      {
        PropertyString: "13% Chance to cast level 13 charged bolt on striking",
        Index: 1
      },
      {
        PropertyString: "+20 Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+100-125 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "to Strength Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "to Dexterity Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "+6-8 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 4
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Index: "Runeword52",
    Enabled: true,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Runeword52",
    Properties: [
      {
        PropertyString: "+1 All Paladin Skills",
        Index: 0
      },
      {
        PropertyString: "+30-50% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+30 Faster Block Rate",
        Index: 2
      },
      {
        PropertyString: "50% Increased Chance of Blocking",
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
        PropertyString: "15% Stamina Drain",
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
    Index: "Runeword113",
    Enabled: true,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Runeword113",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 35 thunder storm when you Level-Up",
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
        PropertyString: "20 to Strength",
        Index: 4
      },
      {
        PropertyString: "-3 Drain Life",
        Index: 2
      },
      {
        PropertyString: "+15-20 Damage Reduced by",
        Index: 6
      },
      {
        PropertyString: "-2 to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
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
    Index: "Runeword153",
    Enabled: true,
    ItemLevel: 31,
    RequiredLevel: 31,
    Code: "Runeword153",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 55 poison nova when you Die",
        Index: 1
      },
      {
        PropertyString: "+1 All Assassin Skills",
        Index: 5
      },
      {
        PropertyString: "Adds 35-70 to Damage",
        Index: 0
      },
      {
        PropertyString: "+6 Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "10 to Strength",
        Index: 4
      },
      {
        PropertyString: "40 to Life",
        Index: 3
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
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
    Index: "Runeword6",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword6",
    Properties: [
      {
        PropertyString: "+15 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+120% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "200 to Attack Rating",
        Index: 4
      },
      {
        PropertyString: "+40 Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "+2 Magic Damage Reduced by",
        Index: 3
      },
      {
        PropertyString: "Level 4 Corpse Explosion (12 Charges)",
        Index: 5
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Bulwark\n",
    Index: "Runeword179",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword179",
    Properties: [
      {
        PropertyString: "Adds 4-6 Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+30 Replenish Life",
        Index: 3
      },
      {
        PropertyString: "+10-15 Damage Reduced by 10-15%%",
        Index: 2
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Cure\n",
    Index: "Runeword178",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword178",
    Properties: [
      {
        PropertyString: "Level 1 Cleansing Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+50 Poison Length Reduced by",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +40-60%",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Ground\n",
    Index: "Runeword175",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword175",
    Properties: [
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+10-15 Lightning Absorb",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +40-60%",
        Index: 2
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
    Index: "Runeword50",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword50",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+140-190% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+100-200% Damage to Demons Damage to Demons",
        Index: 5
      },
      {
        PropertyString: "Freezes target +3",
        Index: 4
      },
      {
        PropertyString: "+1 Knockback",
        Index: 3
      },
      {
        PropertyString: "+50 better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Hearth\n",
    Index: "Runeword177",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword177",
    Properties: [
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+10-15 Cold Absorb",
        Index: 3
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 4
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +40-60%",
        Index: 2
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
    Index: "Runeword53",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword53",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 9 fist of the heavens on striking",
        Index: 1
      },
      {
        PropertyString: "+160-200% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "35 bonus to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+300% Damage to Demons Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+5 to Zeal",
        Index: 5
      },
      {
        PropertyString: "+35 Slows target by",
        Index: 4
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 6
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
    Index: "Runeword79",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword79",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 5 confuse when struck",
        Index: 0
      },
      {
        PropertyString: "12% Chance to cast level 16 terror on striking",
        Index: 1
      },
      {
        PropertyString: "1 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+15 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+15 Faster Block Rate",
        Index: 5
      },
      {
        PropertyString: "35-50 to Life",
        Index: 6
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 3
      },
      {
        PropertyString: "20 to Vitality (Armor)",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 30% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+14 Replenish Life (Armor)",
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
    Index: "Runeword119",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword119",
    Properties: [
      {
        PropertyString: "8% Chance to cast level 4 meteor on striking",
        Index: 6
      },
      {
        PropertyString: "+155% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "15-25 to Fire Skill Damage",
        Index: 5
      },
      {
        PropertyString: "Cold Resist -20%",
        Index: 4
      },
      {
        PropertyString: "+10 Fire Absorb",
        Index: 3
      },
      {
        PropertyString: "Repairs 0.2 durability per second",
        Index: 1
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +95-110%",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Temper\n",
    Index: "Runeword176",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword176",
    Properties: [
      {
        PropertyString: "+75-100 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+10-15 Fire Absorb",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "Fire Resist +40-60%",
        Index: 2
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
      }
    ],
    Types: [
      {
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "War",
    Index: "Runeword158",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword158",
    Properties: [
      {
        PropertyString: "+30 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+35-50% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 4
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+100-140 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+20-25 Damage Reduced by 20-25%%",
        Index: 3
      },
      {
        PropertyString: "10 to Vitality",
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
    Index: "Runeword162",
    Enabled: true,
    ItemLevel: 35,
    RequiredLevel: 35,
    Code: "Runeword162",
    Properties: [
      {
        PropertyString: "+3 to Poison and Bone Skills (Necromancer only)",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Cast Rate",
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
        PropertyString: "+13 to Mana",
        Index: 3
      },
      {
        PropertyString: "+4 Magic Damage Reduced by",
        Index: 1
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
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
    Index: "Runeword21",
    Enabled: true,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Runeword21",
    Properties: [
      {
        PropertyString: "+165-205% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+40 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+8 to Maximum Damage Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "+8 Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "15 to Fire Skill Damage",
        Index: 5
      },
      {
        PropertyString: "+1 to Teleport",
        Index: 2
      },
      {
        PropertyString: "Level 18 Meteor (150 Charges)",
        Index: 6
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
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
    Index: "Runeword83",
    Enabled: true,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Runeword83",
    Properties: [
      {
        PropertyString: "+3 All Sorceress Skills",
        Index: 4
      },
      {
        PropertyString: "+33 Faster Cast Rate",
        Index: 3
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
        PropertyString: "+50 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+20 Increase Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "+7 Magic Damage Reduced by",
        Index: 1
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "-25% Target Defense",
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
    Index: "Runeword128",
    Enabled: true,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Runeword128",
    Properties: [
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+75 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "All Resistances +50",
        Index: 2
      },
      {
        PropertyString: "-1 to Light Radius",
        Index: 4
      },
      {
        PropertyString: "Level 6 Weaken (18 Charges)",
        Index: 5
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+280 Defense vs. Missile",
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
    Index: "Runeword131",
    Enabled: true,
    ItemLevel: 37,
    RequiredLevel: 37,
    Code: "Runeword131",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+10 Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 2
      },
      {
        PropertyString: "+60-100 Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+20 better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "3 to Light Radius",
        Index: 6
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
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
    Index: "Runeword49",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword49",
    Properties: [
      {
        PropertyString: "Level 10 Vigor Aura When Equipped",
        Index: 0
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
        PropertyString: "+2-6 to Valkyrie",
        Index: 4
      },
      {
        PropertyString: "Regenerate Mana 20%",
        Index: 5
      },
      {
        PropertyString: "Level 20 Revive (25 Charges)",
        Index: 6
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
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
        Name: "Armor",
        Index: "Armor",
        Class: ""
      }
    ],
    Name: "Hustle\n",
    Index: "Runeword171",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword171",
    Properties: [
      {
        PropertyString: "+65 Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+6 to Evade",
        Index: 4
      },
      {
        PropertyString: "All Resistances +10",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "50% Stamina Drain",
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
    Name: "Hustle\n",
    Index: "Runeword172",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword172",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 1 quickness on striking",
        Index: 0
      },
      {
        PropertyString: "Level 1 Fanaticism Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+180-200% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+30 Increased Attack Speed",
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
    Index: "Runeword82",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword82",
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
        PropertyString: "+300% Damage to Undead Damage to Undead",
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
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile",
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
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Pestilence",
    Index: "Runeword102",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword102",
    Properties: [
      {
        PropertyString: "+188% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+800 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "20 to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 1
      },
      {
        PropertyString: "+3 to Poison Explosion",
        Index: 5
      },
      {
        PropertyString: "+50 Poison Length Reduced by",
        Index: 6
      },
      {
        PropertyString: "+20-35 better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+9 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
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
    Index: "Runeword115",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword115",
    Properties: [
      {
        PropertyString: "to Strength Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "to Dexterity Per Level (Based on Character Level)",
        Index: 3
      },
      {
        PropertyString: "to Vitality Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "to Energy Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "+16 extra gold from monsters Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "+12 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
        Index: 0
      },
      {
        PropertyString: "0 to Dexterity",
        Index: 6
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
    Index: "Runeword159",
    Enabled: true,
    ItemLevel: 39,
    RequiredLevel: 39,
    Code: "Runeword159",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 25 battle orders when you Level-Up",
        Index: 5
      },
      {
        PropertyString: "+175% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 4
      },
      {
        PropertyString: "Adds 33-122 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+3-5 Replenish Life",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana 35%",
        Index: 1
      },
      {
        PropertyString: "Fire Resist +50%",
        Index: 6
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
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
    Index: "Runeword35",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword35",
    Properties: [
      {
        PropertyString: "+30 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+222% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6 Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+6 Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25",
        Index: 6
      },
      {
        PropertyString: "2 to Experience Gained",
        Index: 4
      },
      {
        PropertyString: "+35 better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
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
    Name: "Fortune",
    Index: "Runeword42",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword42",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "30-50 to Life",
        Index: 2
      },
      {
        PropertyString: "All Resistances +10",
        Index: 3
      },
      {
        PropertyString: "+200 extra gold from monsters",
        Index: 5
      },
      {
        PropertyString: "+1625 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 0
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 4
      },
      {
        PropertyString: "30 to Strength (Weapon)",
        Index: 0
      },
      {
        PropertyString: "30 to Vitality (Weapon)",
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
    Index: "Runeword74",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword74",
    Properties: [
      {
        PropertyString: "+20% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "15 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "20 to Vitality",
        Index: 1
      },
      {
        PropertyString: "50 to Life",
        Index: 4
      },
      {
        PropertyString: "All Resistances +30",
        Index: 5
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "25 to Strength",
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
    Index: "Runeword92",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword92",
    Properties: [
      {
        PropertyString: "30% Chance to cast level 21 enchant when you Kill an Enemy",
        Index: 2
      },
      {
        PropertyString: "+370% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+40 Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "25 to Enemy Fire Resistance",
        Index: 3
      },
      {
        PropertyString: "+40 Chance of Crushing Blow",
        Index: 1
      },
      {
        PropertyString: "+200-300 Defense",
        Index: 4
      },
      {
        PropertyString: "All Resistances +20-30",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
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
        Name: "Amazon Spear",
        Index: "Amazon Spear",
        Class: "ama"
      }
    ],
    Name: "Principle",
    Index: "Runeword110",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword110",
    Properties: [
      {
        PropertyString: "+2 All Amazon Skills",
        Index: 3
      },
      {
        PropertyString: "+200-260% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 1
      },
      {
        PropertyString: "All Resistances +35",
        Index: 4
      },
      {
        PropertyString: "2 to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "Level 20 Thunder Storm (10 Charges)",
        Index: 5
      },
      {
        PropertyString: "Level 10 Cyclone Armor (22 Charges)",
        Index: 6
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
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
    Index: "Runeword151",
    Enabled: true,
    ItemLevel: 41,
    RequiredLevel: 41,
    Code: "Runeword151",
    Properties: [
      {
        PropertyString: "18% Chance to cast level 18 taunt on striking",
        Index: 1
      },
      {
        PropertyString: "+3 to Masteries (Barbarian only)",
        Index: 0
      },
      {
        PropertyString: "+20-30 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+300-350% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 8-10 Life stolen per hit",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+8 Damage Reduced by",
        Index: 4
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+9 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
      }
    ],
    Name: "Lawbringer",
    Index: "Runeword71",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword71",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 decrepify on striking",
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
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 5
      },
      {
        PropertyString: "+200-250 Defense vs. Missile",
        Index: 6
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
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
    Index: "Runeword95",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword95",
    Properties: [
      {
        PropertyString: "+25 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+160-210% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "50-80 bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+1 to Zeal",
        Index: 1
      },
      {
        PropertyString: "+1 to Berserk",
        Index: 3
      },
      {
        PropertyString: "Hit blinds target +10",
        Index: 6
      },
      {
        PropertyString: "Level 3 Heart of Wolverine (12 Charges)",
        Index: 5
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Piety",
    Index: "Runeword104",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword104",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+90-125 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "20 to Energy",
        Index: 1
      },
      {
        PropertyString: "+8 to Mana Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "Magic Resist +15-25%",
        Index: 6
      },
      {
        PropertyString: "All Resistances +15-25",
        Index: 5
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Siren's Song",
    Index: "Runeword127",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword127",
    Properties: [
      {
        PropertyString: "44% Chance to cast level 3 confuse when struck",
        Index: 5
      },
      {
        PropertyString: "2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+8 Defense Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "10-20 to Strength",
        Index: 3
      },
      {
        PropertyString: "+40 Increase Maximum Mana",
        Index: 1
      },
      {
        PropertyString: "+30-50 better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
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
    Index: "Runeword140",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword140",
    Properties: [
      {
        PropertyString: "+3 to Traps (Assassin only)",
        Index: 5
      },
      {
        PropertyString: "+2 All Assassin Skills",
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
        PropertyString: "20-30 to Lightning Skill Damage",
        Index: 3
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
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
    Index: "Runeword148",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword148",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 15 venom on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 15 fade when struck",
        Index: 1
      },
      {
        PropertyString: "+2 All Assassin Skills",
        Index: 2
      },
      {
        PropertyString: "+45 Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+50 extra gold from monsters",
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Voice of Reason",
    Index: "Runeword99",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword99",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 13 frozen orb on striking",
        Index: 0
      },
      {
        PropertyString: "18% Chance to cast level 20 ice blast on striking",
        Index: 1
      },
      {
        PropertyString: "+220-350% Damage to Demons Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "Adds 100-220 to Cold Damage",
        Index: 4
      },
      {
        PropertyString: "24 to Enemy Cold Resistance",
        Index: 5
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 6
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+355-375% Damage to Undead Damage to Undead",
        Index: 3
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
    Index: "Runeword160",
    Enabled: true,
    ItemLevel: 43,
    RequiredLevel: 43,
    Code: "Runeword160",
    Properties: [
      {
        PropertyString: "+100 better chance of getting magic item",
        Index: 1
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+300 extra gold from monsters",
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
    Index: "Runeword76",
    Enabled: true,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Runeword76",
    Properties: [
      {
        PropertyString: "+2 All Amazon Skills",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
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
        PropertyString: "+30 Deadly Strike",
        Index: 5
      },
      {
        PropertyString: "75 to Life",
        Index: 1
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      },
      {
        PropertyString: "+75% Damage to Demons Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
    Index: "Runeword124",
    Enabled: true,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Runeword124",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '200' parameter: '' op: '6' op_param: 'null'",
        Index: 1
      },
      {
        PropertyString: "25% Chance to cast level 12 cloak of shadows when struck",
        Index: 4
      },
      {
        PropertyString: "+50 Faster Run/Walk",
        Index: 3
      },
      {
        PropertyString: "+166% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Level 10 Bone Wall (50 Charges)",
        Index: 5
      },
      {
        PropertyString: "+30 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+14 Damage Reduced by",
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
    Index: "Runeword145",
    Enabled: true,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Runeword145",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 22 thunder storm when struck",
        Index: 2
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
        PropertyString: "+1 to Static Field",
        Index: 5
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
        PropertyString: "2 to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "+30 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Wisdom",
    Index: "Runeword165",
    Enabled: true,
    ItemLevel: 45,
    RequiredLevel: 45,
    Code: "Runeword165",
    Properties: [
      {
        PropertyString: "+33 Piercing Attack",
        Index: 0
      },
      {
        PropertyString: "15-25 bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "Adds 4-8 Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "10 to Energy",
        Index: 5
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 4
      },
      {
        PropertyString: "+5 to Mana after each Kill",
        Index: 3
      },
      {
        PropertyString: "+30 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "15% Stamina Drain",
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
    Index: "Runeword17",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword17",
    Properties: [
      {
        PropertyString: "7% Chance to cast level 13 static field on striking",
        Index: 5
      },
      {
        PropertyString: "10% Chance to cast level 17 chain lightning on striking",
        Index: 6
      },
      {
        PropertyString: "+180-220% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "35 to Enemy Lightning Resistance",
        Index: 0
      },
      {
        PropertyString: "+9-11 Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "Level 18 Summon Spirit Wolf (30 Charges)",
        Index: 4
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
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
    Index: "Runeword30",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword30",
    Properties: [
      {
        PropertyString: "+10-20% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "Adds 37-133 to Cold Damage",
        Index: 2
      },
      {
        PropertyString: "+15 Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "33% Chance of Open Wounds",
        Index: 4
      },
      {
        PropertyString: "+150-200 Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "-20% Stamina Drain",
        Index: 6
      },
      {
        PropertyString: "All Resistances +15",
        Index: 0
      },
      {
        PropertyString: "Cold Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+40 Faster Hit Recovery",
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
      }
    ],
    Types: [
      {
        Name: "Druid Item",
        Index: "Druid Item",
        Class: "dru"
      }
    ],
    Name: "Enlightenment",
    Index: "Runeword34",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword34",
    Properties: [
      {
        PropertyString: "30% Chance to cast level 20 cyclone armor when struck",
        Index: 4
      },
      {
        PropertyString: "+3 to Elemental Skills (Druid only)",
        Index: 3
      },
      {
        PropertyString: "+2 All Druid Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 6
      },
      {
        PropertyString: "+221-250 to Unsummon",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana 75%",
        Index: 2
      },
      {
        PropertyString: "+20-25 Damage Reduced by 20-25%%",
        Index: 5
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
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
    Index: "Runeword45",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword45",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 3 dim vision when struck",
        Index: 2
      },
      {
        PropertyString: "+10 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+1 Half Freeze Duration",
        Index: 6
      },
      {
        PropertyString: "5% Damage Taken Goes To Mana",
        Index: 4
      },
      {
        PropertyString: "-3 to Light Radius",
        Index: 5
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+200-260 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "All Resistances +45",
        Index: 1
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
    Index: "Runeword64",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword64",
    Properties: [
      {
        PropertyString: "2% Chance to cast level 35 holy shield when struck",
        Index: 4
      },
      {
        PropertyString: "50% Chance to cast level 5 decrepify when struck",
        Index: 5
      },
      {
        PropertyString: "+2 All Paladin Skills",
        Index: 0
      },
      {
        PropertyString: "25-35% Increased Chance of Blocking",
        Index: 2
      },
      {
        PropertyString: "+20-30 to Maximum Damage",
        Index: 3
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "+35-50 Magic Damage Reduced by",
        Index: 6
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30",
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
    Index: "Runeword93",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword93",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '100' parameter: '3' op: '6' op_param: 'null'",
        Index: 6
      },
      {
        PropertyString: "12% Chance to cast level 9 amplify damage on striking",
        Index: 3
      },
      {
        PropertyString: "+2 All Barbarian Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+126-155 to Unsummon",
        Index: 2
      },
      {
        PropertyString: "+115-160 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "to Life Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "All Resistances +15",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
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
    Index: "Runeword105",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword105",
    Properties: [
      {
        PropertyString: "Level 12 Cleansing Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+230% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+400-500 Defense",
        Index: 2
      },
      {
        PropertyString: "75 to Life",
        Index: 5
      },
      {
        PropertyString: "+15 Fire Absorb",
        Index: 6
      },
      {
        PropertyString: "Repairs 0.2 durability per second",
        Index: 1
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "20 to Strength",
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
    Index: "Runeword137",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword137",
    Properties: [
      {
        PropertyString: "+300 Defense vs. Missile",
        Index: 2
      },
      {
        PropertyString: "16 to Strength",
        Index: 4
      },
      {
        PropertyString: "16 to Vitality",
        Index: 5
      },
      {
        PropertyString: "Level 16 Clay Golem (16 Charges)",
        Index: 1
      },
      {
        PropertyString: "Level 16 Molten Boulder (80 Charges)",
        Index: 3
      },
      {
        PropertyString: "All Resistances +15",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+60 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "+250-290 Enhanced Defense",
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
    Index: "Runeword156",
    Enabled: true,
    ItemLevel: 47,
    RequiredLevel: 47,
    Code: "Runeword156",
    Properties: [
      {
        PropertyString: "10-15 to Cold Skill Damage",
        Index: 1
      },
      {
        PropertyString: "10-15 to Fire Skill Damage",
        Index: 2
      },
      {
        PropertyString: "10-15 to Lightning Skill Damage",
        Index: 3
      },
      {
        PropertyString: "+8 to Mana Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "+1 To Required Level",
        Index: 0
      },
      {
        PropertyString: "All Resistances +44-47",
        Index: 4
      },
      {
        PropertyString: "30% Damage Taken Goes To Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "+28 Attacker Takes Damage of (Armor)",
        Index: 0
      },
      {
        PropertyString: "Requirements -30% (Armor)",
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
    Index: "Runeword7",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword7",
    Properties: [
      {
        PropertyString: "2 to All Skills",
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
        PropertyString: "+10-15 Increase Maximum Life",
        Index: 5
      },
      {
        PropertyString: "+10-15 Damage Reduced by 10-15%%",
        Index: 6
      },
      {
        PropertyString: "+18 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery (Armor)",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Block Rate (Shield)",
        Index: 0
      },
      {
        PropertyString: "+14 Magic Damage Reduced by (Armor)",
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
    Index: "Runeword78",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword78",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '300' parameter: '1' op: '6' op_param: 'null'",
        Index: 6
      },
      {
        PropertyString: "Level 8 Holy Shock Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+2 All Necromancer Skills",
        Index: 0
      },
      {
        PropertyString: "+35 Increase Maximum Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +35-50",
        Index: 3
      },
      {
        PropertyString: "5 to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+40 better chance of getting magic item",
        Index: 5
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Oath",
    Index: "Runeword91",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword91",
    Properties: [
      {
        PropertyString: "30% Chance to cast level 20 bone spirit on striking",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 1
      },
      {
        PropertyString: "+210-340% Enhanced Damage",
        Index: 3
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
        PropertyString: "Level 17 IronGolem (14 Charges)",
        Index: 6
      },
      {
        PropertyString: "+75% Damage to Demons Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+50 Increased Attack Speed",
        Index: 2
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
    Index: "Runeword112",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword112",
    Properties: [
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+140-170 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "All Resistances +25-35",
        Index: 2
      },
      {
        PropertyString: "+3 Damage Reduced by",
        Index: 3
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 5
      },
      {
        PropertyString: "Repairs 0.25 durability per second",
        Index: 6
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+17 Magic Damage Reduced by",
        Index: 4
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
    Index: "Runeword117",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword117",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 15 twister on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 15 cyclone armor when struck",
        Index: 1
      },
      {
        PropertyString: "+2 All Druid Skills",
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
        PropertyString: "+7 Magic Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Index: "Runeword122",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword122",
    Properties: [
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 1
      },
      {
        PropertyString: "20% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+130-160 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+250 Defense vs. Missile",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50-70",
        Index: 4
      },
      {
        PropertyString: "Level 12 Slow Missiles (60 Charges)",
        Index: 6
      },
      {
        PropertyString: "+7 Magic Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "20 to Dexterity",
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
    Index: "Runeword142",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword142",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 10 terror when struck",
        Index: 0
      },
      {
        PropertyString: "+2 All Necromancer Skills",
        Index: 1
      },
      {
        PropertyString: "+25 Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+66-95 to Unsummon",
        Index: 2
      },
      {
        PropertyString: "+3 to Fanaticism",
        Index: 6
      },
      {
        PropertyString: "+12 Defense Per Level (Based on Character Level)",
        Index: 3
      },
      {
        PropertyString: "+8 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+7 Magic Damage Reduced by",
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
        Name: "Weapon",
        Index: "Weapon",
        Class: ""
      }
    ],
    Name: "Venom",
    Index: "Runeword154",
    Enabled: true,
    ItemLevel: 49,
    RequiredLevel: 49,
    Code: "Runeword154",
    Properties: [
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 1
      },
      {
        PropertyString: "+312 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 4
      },
      {
        PropertyString: "Level 15 Poison Explosion (27 Charges)",
        Index: 2
      },
      {
        PropertyString: "Level 13 Poison Nova (11 Charges)",
        Index: 3
      },
      {
        PropertyString: "+154 to Minimum Poison Damage",
        Index: 0
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Delirium",
    Index: "Runeword22",
    Enabled: true,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Runeword22",
    Properties: [
      {
        PropertyString: "11% Chance to cast level 18 confuse on striking",
        Index: 0
      },
      {
        PropertyString: "14% Chance to cast level 13 terror when struck",
        Index: 2
      },
      {
        PropertyString: "6% Chance to cast level 14 mind blast when struck",
        Index: 4
      },
      {
        PropertyString: "1% Chance to cast level 50 delerium change when struck",
        Index: 5
      },
      {
        PropertyString: "2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+261 Defense",
        Index: 3
      },
      {
        PropertyString: "Level 17 Attract (60 Charges)",
        Index: 1
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
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
    Index: "Runeword46",
    Enabled: true,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Runeword46",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+35 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+25 Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+75-125 Enhanced Defense",
        Index: 5
      },
      {
        PropertyString: "+25 Increase Maximum Life",
        Index: 4
      },
      {
        PropertyString: "+25 Increase Maximum Mana",
        Index: 3
      },
      {
        PropertyString: "Requirements -30%",
        Index: 6
      },
      {
        PropertyString: "+100 better chance of getting magic item",
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
    Index: "Runeword144",
    Enabled: true,
    ItemLevel: 51,
    RequiredLevel: 51,
    Code: "Runeword144",
    Properties: [
      {
        PropertyString: "+2 All Sorceress Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "15% Increased Chance of Blocking",
        Index: 5
      },
      {
        PropertyString: "20 to Enemy Lightning Resistance",
        Index: 3
      },
      {
        PropertyString: "20 to Cold Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+6 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana 75%",
        Index: 2
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
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
    Index: "Runeword24",
    Enabled: true,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Runeword24",
    Properties: [
      {
        PropertyString: "32% Chance to cast level 6 weaken on striking",
        Index: 1
      },
      {
        PropertyString: "+260-300% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+9 Mana stolen per hit",
        Index: 5
      },
      {
        PropertyString: "+7 to Fend",
        Index: 3
      },
      {
        PropertyString: "+20 Slows target by",
        Index: 2
      },
      {
        PropertyString: "+35 better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
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
    Index: "Runeword66",
    Enabled: true,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Runeword66",
    Properties: [
      {
        PropertyString: "+30 Increased Attack Speed",
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
        PropertyString: "+33 Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "+1 to Vengeance",
        Index: 5
      },
      {
        PropertyString: "+40 extra gold from monsters",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "50% Chance of Open Wounds",
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
    Name: "Mosaic\n",
    Index: "Runeword173",
    Enabled: true,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Runeword173",
    Properties: [
      {
        PropertyString: "50 chance for finishing moves to not consume charges",
        Index: 1
      },
      {
        PropertyString: "+2 to Martial Arts (Assassin only)",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "+200-250% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "8-15 to Fire Skill Damage",
        Index: 4
      },
      {
        PropertyString: "8-15 to Cold Skill Damage",
        Index: 5
      },
      {
        PropertyString: "8-15 to Lightning Skill Damage",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
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
    Index: "Runeword121",
    Enabled: true,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Runeword121",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 16 tornado on striking",
        Index: 0
      },
      {
        PropertyString: "16% Chance to cast level 21 frozen orb on attack",
        Index: 1
      },
      {
        PropertyString: "Adds 160-250 Adds 160-250 magic damage",
        Index: 2
      },
      {
        PropertyString: "Adds 60-180 to Fire Damage",
        Index: 3
      },
      {
        PropertyString: "5-10 to Strength",
        Index: 4
      },
      {
        PropertyString: "38% Damage Taken Goes To Mana",
        Index: 5
      },
      {
        PropertyString: "Level 15 Iron Maiden (40 Charges)",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
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
    Index: "Runeword135",
    Enabled: true,
    ItemLevel: 53,
    RequiredLevel: 53,
    Code: "Runeword135",
    Properties: [
      {
        PropertyString: "+2 to Bow and Crossbow Skills (Amazon only)",
        Index: 4
      },
      {
        PropertyString: "+1 All Amazon Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
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
        PropertyString: "Adds 100-150 to Cold Damage",
        Index: 6
      },
      {
        PropertyString: "+15-20 Life after each Kill",
        Index: 5
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
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
    Index: "Runeword20",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword20",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 44 chain lightning when you Die",
        Index: 0
      },
      {
        PropertyString: "25% Chance to cast level 18 glacial spike on attack",
        Index: 1
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 2
      },
      {
        PropertyString: "+300-385% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "+50 Chance of Crushing Blow",
        Index: 4
      },
      {
        PropertyString: "+4 Deadly Strike Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "Level 22 BloodGolem (15 Charges)",
        Index: 6
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
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
    Name: "Flame\n",
    Index: "Runeword201",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword201",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 19 fire ball when struck",
        Index: 0
      },
      {
        PropertyString: "8% Chance to cast level 13 eruption on striking",
        Index: 1
      },
      {
        PropertyString: "Level 17 Holy Fire Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "15-20 to Fire Skill Damage",
        Index: 3
      },
      {
        PropertyString: "15-20 to Enemy Fire Resistance",
        Index: 4
      },
      {
        PropertyString: "+15-20 Fire Absorb",
        Index: 5
      },
      {
        PropertyString: "5 to Light Radius",
        Index: 6
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
        PropertyString: "10 to Dexterity",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Flame",
    Index: "Runeword40",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword40",
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
        PropertyString: "10-15 to Enemy Fire Resistance",
        Index: 2
      },
      {
        PropertyString: "+50-75 to Mana",
        Index: 3
      },
      {
        PropertyString: "+1 Half Freeze Duration",
        Index: 4
      },
      {
        PropertyString: "+50 Poison Length Reduced by",
        Index: 5
      },
      {
        PropertyString: "+30 Defense vs. Missile",
        Index: 0
      },
      {
        PropertyString: "+30 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
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
        Name: "Mace",
        Index: "Mace",
        Class: ""
      }
    ],
    Name: "Heart of the Oak",
    Index: "Runeword51",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword51",
    Properties: [
      {
        PropertyString: "3 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+40 Faster Cast Rate",
        Index: 0
      },
      {
        PropertyString: "+20 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "+15 Increase Maximum Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +30-40",
        Index: 5
      },
      {
        PropertyString: "Level 4 Oak Sage (25 Charges)",
        Index: 1
      },
      {
        PropertyString: "Level 14 Raven (60 Charges)",
        Index: 6
      },
      {
        PropertyString: "10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Demons Damage to Demons",
        Index: 1
      },
      {
        PropertyString: "100 to Attack Rating against Demons",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Innocence",
    Index: "Runeword61",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword61",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+190-240% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+16 to Maximum Damage Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "15-25 to Strength",
        Index: 5
      },
      {
        PropertyString: "+25 Increase Maximum Life",
        Index: 4
      },
      {
        PropertyString: "-3 to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "Repairs 0.15 durability per second",
        Index: 2
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
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
    Index: "Runeword77",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword77",
    Properties: [
      {
        PropertyString: "Level 5-9 Thorns Aura When Equipped",
        Index: 0
      },
      {
        PropertyString: "35-50% Increased Chance of Blocking",
        Index: 6
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
        PropertyString: "All Resistances +100",
        Index: 4
      },
      {
        PropertyString: "6 to Experience Gained",
        Index: 5
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life",
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
    Index: "Runeword126",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword126",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+200% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "Hit blinds target +33",
        Index: 1
      },
      {
        PropertyString: "All Resistances +75",
        Index: 4
      },
      {
        PropertyString: "25%",
        Index: 0
      },
      {
        PropertyString: "+75% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+11 Mana stolen per hit",
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
    Index: "Runeword167",
    Enabled: true,
    ItemLevel: 55,
    RequiredLevel: 55,
    Code: "Runeword167",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '200' parameter: '1' op: '6' op_param: 'null'",
        Index: 4
      },
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '100' parameter: '3' op: '6' op_param: 'null'",
        Index: 5
      },
      {
        PropertyString: "+275% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "20 to Strength",
        Index: 2
      },
      {
        PropertyString: "20 to Dexterity",
        Index: 3
      },
      {
        PropertyString: "to Life Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "+50 Faster Hit Recovery",
        Index: 1
      },
      {
        PropertyString: "+10 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "+28 Attacker Takes Damage of",
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
    Index: "Runeword13",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword13",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 0
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
        PropertyString: "+12 Replenish Life",
        Index: 6
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+250-290% Enhanced Damage",
        Index: 1
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
    Index: "Runeword16",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword16",
    Properties: [
      {
        PropertyString: "9% Chance to cast level 11 frozen orb on striking",
        Index: 5
      },
      {
        PropertyString: "11% Chance to cast level 9 charged bolt on striking",
        Index: 6
      },
      {
        PropertyString: "+35 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "Adds 216-471 Adds 216-471 magic damage",
        Index: 2
      },
      {
        PropertyString: "+1 to Whirlwind",
        Index: 3
      },
      {
        PropertyString: "+15 Life after each Demon Kill",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+290-340% Enhanced Damage",
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
    Index: "Runeword37",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword37",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 5 life tap on striking",
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
        PropertyString: "+30 Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "Freezes target +1",
        Index: 1
      },
      {
        PropertyString: "+220-260 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "Repairs 0.25 durability per second",
        Index: 6
      },
      {
        PropertyString: "+5 to Maximum Fire Resist",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Praise",
    Index: "Runeword107",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword107",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '200' parameter: '0' op: '6' op_param: 'null'",
        Index: 5
      },
      {
        PropertyString: "100% Chance to cast level 47 frozen orb when you Die",
        Index: 3
      },
      {
        PropertyString: "100% Chance to cast level 10 glacial spike when struck",
        Index: 4
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 2
      },
      {
        PropertyString: "+10 Life stolen per hit",
        Index: 6
      },
      {
        PropertyString: "+15 To Required Level",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+330-400% Enhanced Damage",
        Index: 1
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
    Index: "Runeword149",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword149",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 57 nova when you Die",
        Index: 6
      },
      {
        PropertyString: "1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "Adds 15-30 to Damage",
        Index: 5
      },
      {
        PropertyString: "+125-200 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "75-100 to Life",
        Index: 3
      },
      {
        PropertyString: "+5 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
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
    Index: "Runeword155",
    Enabled: true,
    ItemLevel: 57,
    RequiredLevel: 57,
    Code: "Runeword155",
    Properties: [
      {
        PropertyString: "+60 Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+20 to Maximum Damage Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "+1-300 to Minimum Fire Damage",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "Repairs 0.1 durability per second",
        Index: 2
      },
      {
        PropertyString: "Requirements -50%",
        Index: 4
      },
      {
        PropertyString: "+24 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+200% Enhanced Damage",
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
    Name: "Fortitude",
    Index: "Runeword41",
    Enabled: true,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Runeword41",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 chilling armor when struck",
        Index: 0
      },
      {
        PropertyString: "+300% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25 Faster Cast Rate",
        Index: 5
      },
      {
        PropertyString: "+200 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "8-12 to Life Per Level (Based on Character Level)",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25-30",
        Index: 4
      },
      {
        PropertyString: "50 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "+9 to Minimum Damage (Weapon)",
        Index: 0
      },
      {
        PropertyString: "25% (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike (Weapon)",
        Index: 0
      },
      {
        PropertyString: "3 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense (Armor)",
        Index: 1
      },
      {
        PropertyString: "+14 Damage Reduced by (Armor)",
        Index: 0
      },
      {
        PropertyString: "+14 Replenish Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Lightning Resist (Armor)",
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
    Index: "Runeword47",
    Enabled: true,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Runeword47",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 15 venom on striking",
        Index: 0
      },
      {
        PropertyString: "+30-40 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+340-400 Damage",
        Index: 2
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 3
      },
      {
        PropertyString: "+15% Damage to Demons Damage to Demons Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "20-25 to Enemy Poison Resistance",
        Index: 5
      },
      {
        PropertyString: "+11 Life after each Kill",
        Index: 6
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
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
    Index: "Runeword90",
    Enabled: true,
    ItemLevel: 59,
    RequiredLevel: 59,
    Code: "Runeword90",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '300' parameter: '2' op: '6' op_param: 'null'",
        Index: 1
      },
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '50' parameter: '2' op: '6' op_param: 'null'",
        Index: 2
      },
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '500' parameter: '2' op: '6' op_param: 'null'",
        Index: 3
      },
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '75' parameter: '2' op: '6' op_param: 'null'",
        Index: 4
      },
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '300' parameter: '2' op: '6' op_param: 'null'",
        Index: 5
      },
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '25' parameter: '2' op: '6' op_param: 'null'",
        Index: 6
      },
      {
        PropertyString: "+150-300 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "Requirements -15%",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
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
    Index: "Runeword9",
    Enabled: true,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Runeword9",
    Properties: [
      {
        PropertyString: "Level 15-21 Thorns Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+50 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "25-50 to Poison Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+300 Defense",
        Index: 1
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
      },
      {
        PropertyString: "Fire Resist +30%",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
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
    Index: "Runeword27",
    Enabled: true,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Runeword27",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 18 venom when struck",
        Index: 0
      },
      {
        PropertyString: "12% Chance to cast level 15 hydra on striking",
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
        PropertyString: "3-5 to Strength",
        Index: 5
      },
      {
        PropertyString: "to Strength Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "+5 Increase Maximum Mana (Armor)",
        Index: 0
      },
      {
        PropertyString: "+50 to Mana (Shield)",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Lightning Resist (Armor)",
        Index: 0
      },
      {
        PropertyString: "+14 Damage Reduced by (Armor)",
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
        Name: "Sword",
        Index: "Sword",
        Class: ""
      }
    ],
    Name: "Plague Reimagined\n",
    Index: "Runeword203",
    Enabled: true,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Runeword203",
    Properties: [
      {
        PropertyString: "15% Chance to cast level 27 poison nova on striking",
        Index: 1
      },
      {
        PropertyString: "+200-250% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+1845 to Minimum Poison Damage",
        Index: 3
      },
      {
        PropertyString: "+50 Deadly Strike",
        Index: 4
      },
      {
        PropertyString: "+10 to Maximum Poison Resist",
        Index: 5
      },
      {
        PropertyString: "Poison Resist +80%",
        Index: 6
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+40 Increased Attack Speed",
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
    Index: "Runeword147",
    Enabled: true,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Runeword147",
    Properties: [
      {
        PropertyString: "+3 All Amazon Skills",
        Index: 0
      },
      {
        PropertyString: "+50 Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+10 Mana stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+10 Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "25 to Enemy Lightning Resistance",
        Index: 5
      },
      {
        PropertyString: "25 to Lightning Skill Damage",
        Index: 6
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "20 bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+375-450% Enhanced Damage",
        Index: 1
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
    Index: "Runeword163",
    Enabled: true,
    ItemLevel: 61,
    RequiredLevel: 61,
    Code: "Runeword163",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 9 tornado on striking",
        Index: 4
      },
      {
        PropertyString: "+20 Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+120-160% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+15 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "-50% Target Defense",
        Index: 3
      },
      {
        PropertyString: "Level 13 Twister (127 Charges)",
        Index: 5
      },
      {
        PropertyString: "+5 Increase Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "+15 Defense",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Beast",
    Index: "Runeword4",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword4",
    Properties: [
      {
        PropertyString: "Level 9 Fanaticism Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+240-270% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+3 to Wearbear",
        Index: 5
      },
      {
        PropertyString: "+3 to Shape Shifting",
        Index: 6
      },
      {
        PropertyString: "25-40 to Strength",
        Index: 3
      },
      {
        PropertyString: "Level 13 Summon Grizzly (5 Charges)",
        Index: 4
      },
      {
        PropertyString: "+20 Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
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
        Name: "Necromancer Item",
        Index: "Necromancer Item",
        Class: "nec"
      }
    ],
    Name: "Bone",
    Index: "Runeword8",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword8",
    Properties: [
      {
        PropertyString: "+4 to Poison and Bone Skills (Necromancer only)",
        Index: 1
      },
      {
        PropertyString: "+2 All Necromancer Skills",
        Index: 0
      },
      {
        PropertyString: "+3 to Bone Armor (Necromancer Only)",
        Index: 2
      },
      {
        PropertyString: "+3 to Bone Wall (Necromancer Only)",
        Index: 3
      },
      {
        PropertyString: "+3 to Bone Spear (Necromancer Only)",
        Index: 4
      },
      {
        PropertyString: "+3 to Bone Prison (Necromancer Only)",
        Index: 5
      },
      {
        PropertyString: "+3 to Bone Spirit (Necromancer Only)",
        Index: 6
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15",
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
    Index: "Runeword14",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword14",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+200% Damage to Demons Damage to Demons",
        Index: 2
      },
      {
        PropertyString: "+100% Damage to Undead Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "+8 Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+70 Enhanced Defense",
        Index: 1
      },
      {
        PropertyString: "20 to Strength",
        Index: 6
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "All Resistances +65",
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
    Index: "Runeword36",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword36",
    Properties: [
      {
        PropertyString: "+1 Indestructible",
        Index: 1
      },
      {
        PropertyString: "+260-310% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+33 Slows target by",
        Index: 2
      },
      {
        PropertyString: "+16 Replenish Life",
        Index: 4
      },
      {
        PropertyString: "Regenerate Mana 16%",
        Index: 5
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 6
      },
      {
        PropertyString: "Level 8 Revive (88 Charges)",
        Index: 3
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
        Index: 0
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+7 Damage Reduced by",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Mana",
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
    Index: "Runeword60",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword60",
    Properties: [
      {
        PropertyString: "50% Chance to cast level 20 chain lightning when you Kill an Enemy",
        Index: 4
      },
      {
        PropertyString: "Level 12 Conviction Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+35 Faster Run/Walk",
        Index: 1
      },
      {
        PropertyString: "+255-325% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "45-55 to Enemy Lightning Resistance",
        Index: 5
      },
      {
        PropertyString: "to Vitality Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "Level 21 Cyclone Armor (30 Charges)",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+40 Chance of Crushing Blow",
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
    Index: "Runeword67",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword67",
    Properties: [
      {
        PropertyString: "Level 8-12 Meditation Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+2 All Paladin Skills",
        Index: 0
      },
      {
        PropertyString: "+40 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 4
      },
      {
        PropertyString: "20-30% Increased Chance of Blocking",
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
        PropertyString: "+16 Damage Reduced by 16%% (Armor)",
        Index: 0
      },
      {
        PropertyString: "+100 extra gold from monsters (Armor)",
        Index: 0
      },
      {
        PropertyString: "All Resistances +37 (Armor)",
        Index: 0
      },
      {
        PropertyString: "+50 better chance of getting magic item (Armor)",
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
    Index: "Runeword168",
    Enabled: true,
    ItemLevel: 63,
    RequiredLevel: 63,
    Code: "Runeword168",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 10 life tap on striking",
        Index: 4
      },
      {
        PropertyString: "30% Chance to cast level 1 decrepify on striking",
        Index: 5
      },
      {
        PropertyString: "+300% Damage to Demons Damage to Demons",
        Index: 0
      },
      {
        PropertyString: "+250-300% Damage to Undead Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "Adds 85-120 Adds 85-120 magic damage",
        Index: 3
      },
      {
        PropertyString: "Adds 41-240 to Lightning Damage",
        Index: 2
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 6
      },
      {
        PropertyString: "+30 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
        Index: 0
      },
      {
        PropertyString: "+7 Magic Damage Reduced by",
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
    Index: "Runeword10",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword10",
    Properties: [
      {
        PropertyString: "35% Chance to cast level 14 amplify damage when struck",
        Index: 0
      },
      {
        PropertyString: "100% Chance to cast level 18 bone spear on striking",
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
        PropertyString: "+280-330% Damage to Demons Damage to Demons",
        Index: 4
      },
      {
        PropertyString: "+1 Knockback",
        Index: 5
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "+7 Magic Damage Reduced by",
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
    Index: "Runeword19",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword19",
    Properties: [
      {
        PropertyString: "Level 4 Conviction Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+3 All Sorceress Skills",
        Index: 0
      },
      {
        PropertyString: "+30 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+25 Increase Maximum Life",
        Index: 6
      },
      {
        PropertyString: "+50 Increase Maximum Mana",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana 50%",
        Index: 1
      },
      {
        PropertyString: "Level 18 Lower Resist (33 Charges)",
        Index: 4
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
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
    Index: "Runeword25",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword25",
    Properties: [
      {
        PropertyString: "23% Chance to cast level 12 volcano on striking",
        Index: 0
      },
      {
        PropertyString: "5% Chance to cast level 23 molten boulder on striking",
        Index: 1
      },
      {
        PropertyString: "100% Chance to cast level 45 meteor when you Die",
        Index: 2
      },
      {
        PropertyString: "15% Chance to cast level 22 nova on attack",
        Index: 3
      },
      {
        PropertyString: "+350% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "Adds 100-180 Adds 100-180 magic damage",
        Index: 5
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+20 Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "10 to Dexterity",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      },
      {
        Name: "Any Shield",
        Index: "Any Shield",
        Class: ""
      }
    ],
    Name: "Dream",
    Index: "Runeword29",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword29",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 15 confuse when struck",
        Index: 0
      },
      {
        PropertyString: "Level 15 Holy Shock Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "+20-30 Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+150-220 Defense",
        Index: 3
      },
      {
        PropertyString: "+5 to Mana Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "All Resistances +5-20",
        Index: 5
      },
      {
        PropertyString: "+15-25 better chance of getting magic item",
        Index: 6
      },
      {
        PropertyString: "+5 Increase Maximum Life (Armor)",
        Index: 0
      },
      {
        PropertyString: "50 to Life (Shield)",
        Index: 0
      },
      {
        PropertyString: "20 to Vitality (Armor)",
        Index: 0
      },
      {
        PropertyString: "+60 Enhanced Defense (Armor)",
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
    Index: "Runeword33",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword33",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+45 Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+1 to Teleport",
        Index: 6
      },
      {
        PropertyString: "+750-775 Defense",
        Index: 0
      },
      {
        PropertyString: "to Strength Per Level (Based on Character Level)",
        Index: 3
      },
      {
        PropertyString: "+14 Life after each Kill",
        Index: 1
      },
      {
        PropertyString: "+8 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
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
    Index: "Runeword38",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword38",
    Properties: [
      {
        PropertyString: "Level 12-15 Fanaticism Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "1-2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+280% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "300 bonus to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "+120 to Minimum Fire Damage",
        Index: 2
      },
      {
        PropertyString: "All Resistances +15",
        Index: 3
      },
      {
        PropertyString: "10% Reanimate as: Returned",
        Index: 5
      },
      {
        PropertyString: "+5 to Maximum Cold Resist",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+50 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "15% Stamina Drain",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Famine",
    Index: "Runeword39",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword39",
    Properties: [
      {
        PropertyString: "+30 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "Adds 180-200 Adds 180-200 magic damage",
        Index: 4
      },
      {
        PropertyString: "Adds 50-200 to Fire Damage",
        Index: 5
      },
      {
        PropertyString: "+12 Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "Ethereal (Cannot Be Repaired)",
        Index: 6
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "+320-370% Enhanced Damage",
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
    Index: "Runeword44",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword44",
    Properties: [
      {
        PropertyString: "+40 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+209% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+6 Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+33 Deadly Strike",
        Index: 5
      },
      {
        PropertyString: "66% Chance of Open Wounds",
        Index: 3
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 2
      },
      {
        PropertyString: "+5 to Frenzy (Barbarian Only)",
        Index: 6
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Poison Resist",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana 15%",
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
    Index: "Runeword59",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword59",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 40 blizzard when you Level-Up",
        Index: 0
      },
      {
        PropertyString: "25% Chance to cast level 22 frost nova on striking",
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
        PropertyString: "25-30 to Cold Skill Damage",
        Index: 4
      },
      {
        PropertyString: "20 to Enemy Cold Resistance",
        Index: 5
      },
      {
        PropertyString: "+25 extra gold from monsters Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "+14 Attacker Takes Damage of",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist",
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
    Index: "Runeword103",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword103",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 40 blaze when you Level-Up",
        Index: 0
      },
      {
        PropertyString: "40% Chance to cast level 22 firestorm on striking",
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
        PropertyString: "28 to Enemy Fire Resistance",
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
        PropertyString: "+20 Deadly Strike (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+5 to Maximum Lightning Resist (Shield)",
        Index: 0
      },
      {
        PropertyString: "+1 Ignore Target's Defense (Weapon)",
        Index: 0
      },
      {
        PropertyString: "50 to Life (Shield)",
        Index: 0
      },
      {
        PropertyString: "+14 Mana stolen per hit (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Fire Resist (Shield)",
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
    Index: "Runeword111",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword111",
    Properties: [
      {
        PropertyString: "Level 6 Fanaticism Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+3 All Barbarian Skills",
        Index: 1
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "+40 Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "50 bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+24 Defense Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Life",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
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
    Index: "Runeword138",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword138",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 21 lightning on striking",
        Index: 2
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+10 to Thunder Storm",
        Index: 3
      },
      {
        PropertyString: "Lightning Resist +100%",
        Index: 4
      },
      {
        PropertyString: "+25 Lightning Absorb",
        Index: 5
      },
      {
        PropertyString: "3 to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "Adds 1-50 to Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
        Index: 0
      },
      {
        PropertyString: "+383% Enhanced Damage",
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
    Index: "Runeword146",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword146",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 25 nova when struck",
        Index: 4
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 5
      },
      {
        PropertyString: "+1 to Teleport",
        Index: 6
      },
      {
        PropertyString: "+160-220 Enhanced Defense",
        Index: 0
      },
      {
        PropertyString: "+20 To Required Level",
        Index: 1
      },
      {
        PropertyString: "85-100 to Life",
        Index: 2
      },
      {
        PropertyString: "+15-25 Increase Maximum Life",
        Index: 3
      },
      {
        PropertyString: "+28 Attacker Takes Damage of (Armor)",
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
      }
    ],
    Name: "Wisdom Reimagined\n",
    Index: "Runeword204",
    Enabled: true,
    ItemLevel: 65,
    RequiredLevel: 65,
    Code: "Runeword204",
    Properties: [
      {
        PropertyString: "2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+5 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "+16 to Mana Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana 75%",
        Index: 3
      },
      {
        PropertyString: "Magic Resist +20%",
        Index: 4
      },
      {
        PropertyString: "3-5 to Experience Gained",
        Index: 5
      },
      {
        PropertyString: "+10 Reduces all Vendor Prices",
        Index: 6
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
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
    Index: "Runeword2",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword2",
    Properties: [
      {
        PropertyString: "40% Chance to cast level 20 blizzard on striking",
        Index: 3
      },
      {
        PropertyString: "40% Chance to cast level 20 chain lightning when struck",
        Index: 4
      },
      {
        PropertyString: "+30 Increased Attack Speed",
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
        PropertyString: "All Resistances +35",
        Index: 6
      },
      {
        PropertyString: "+13 To Required Level",
        Index: 0
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
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+20 Chance of Crushing Blow",
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
    Index: "Runeword12",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword12",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '18' value1: '1' value2: '100' parameter: '1' op: '6' op_param: 'null'",
        Index: 6
      },
      {
        PropertyString: "18% Chance to cast level 18 bone spirit on striking",
        Index: 4
      },
      {
        PropertyString: "2 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+24 to Maximum Damage Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "-5 to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+15 To Required Level",
        Index: 5
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      }
    ],
    Name: "Doom",
    Index: "Runeword26",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword26",
    Properties: [
      {
        PropertyString: "5% Chance to cast level 18 volcano on striking",
        Index: 6
      },
      {
        PropertyString: "Level 12 Holy Freeze Aura When Equipped",
        Index: 1
      },
      {
        PropertyString: "2 to All Skills",
        Index: 5
      },
      {
        PropertyString: "+45 Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "40-60 to Enemy Cold Resistance",
        Index: 4
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+330-370% Enhanced Damage",
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
    Index: "Runeword32",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword32",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 8 nova on striking",
        Index: 2
      },
      {
        PropertyString: "100% Chance to cast level 60 nova when you Die",
        Index: 4
      },
      {
        PropertyString: "+40-75 to Minimum Damage",
        Index: 0
      },
      {
        PropertyString: "+18 to Maximum Damage Per Level (Based on Character Level)",
        Index: 1
      },
      {
        PropertyString: "20-25 to Cold Skill Damage",
        Index: 5
      },
      {
        PropertyString: "20-25 to Fire Skill Damage",
        Index: 6
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "Adds 3-14 to Cold Damage",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
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
    Index: "Runeword48",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword48",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 36 blaze when you Level-Up",
        Index: 3
      },
      {
        PropertyString: "100% Chance to cast level 48 meteor when you Die",
        Index: 4
      },
      {
        PropertyString: "Level 16 Holy Fire Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+33 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+280-330% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+1 Ignore Target's Defense",
        Index: 5
      },
      {
        PropertyString: "20 to Enemy Fire Resistance",
        Index: 6
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
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
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
        Name: "Hammer",
        Index: "Hammer",
        Class: ""
      },
      {
        Name: "Axe",
        Index: "Axe",
        Class: ""
      }
    ],
    Name: "Last Wish",
    Index: "Runeword69",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword69",
    Properties: [
      {
        PropertyString: "6% Chance to cast level 11 fade when struck",
        Index: 0
      },
      {
        PropertyString: "10% Chance to cast level 18 life tap on striking",
        Index: 1
      },
      {
        PropertyString: "20% Chance to cast level 20 charged bolt on attack",
        Index: 2
      },
      {
        PropertyString: "Level 17 Might Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "+330-375% Enhanced Damage",
        Index: 4
      },
      {
        PropertyString: "+4 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "+20-30 Chance of Crushing Blow",
        Index: 5
      },
      {
        PropertyString: "+2 Ignore Target's Defense",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Metamorphosis\n",
    Index: "Runeword174",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword174",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 1 mark of the bear on striking",
        Index: 0
      },
      {
        PropertyString: "100% Chance to cast level 1 mark of the wolf on striking",
        Index: 1
      },
      {
        PropertyString: "+5 to Shape Shifting Skills (Druid only)",
        Index: 2
      },
      {
        PropertyString: "+25 Chance of Crushing Blow",
        Index: 5
      },
      {
        PropertyString: "+50-80 Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "All Resistances +10",
        Index: 4
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
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
    Index: "Runeword84",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword84",
    Properties: [
      {
        PropertyString: "Level 8-12 Concentration Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+325-375% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+100 Piercing Attack",
        Index: 3
      },
      {
        PropertyString: "24 to Vitality",
        Index: 4
      },
      {
        PropertyString: "All Resistances +40",
        Index: 5
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
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
        PropertyString: "15% Damage Taken Goes To Mana",
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
    Name: "Myth",
    Index: "Runeword87",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword87",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 60 nova when you Die",
        Index: 6
      },
      {
        PropertyString: "3 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+80-120% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "Adds 200-400 to Damage",
        Index: 1
      },
      {
        PropertyString: "All Resistances +50",
        Index: 5
      },
      {
        PropertyString: "Repairs 0.15 durability per second",
        Index: 2
      },
      {
        PropertyString: "+8 To Required Level",
        Index: 0
      },
      {
        PropertyString: "10 to Strength",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+20 Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "Adds 5-30 to Fire Damage",
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
    Index: "Runeword101",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword101",
    Properties: [
      {
        PropertyString: "1 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+75 Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+250% Enhanced Damage",
        Index: 1
      },
      {
        PropertyString: "+25 to Maximum Damage Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "20-30 to Strength",
        Index: 6
      },
      {
        PropertyString: "+8 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 5
      },
      {
        PropertyString: "+11 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+2 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+10 to Maximum Lightning Resist",
        Index: 0
      },
      {
        PropertyString: "+16 Damage Reduced by 16%%",
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
        Name: "Hand to Hand",
        Index: "Hand to Hand",
        Class: "ass"
      }
    ],
    Name: "Plague",
    Index: "Runeword106",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword106",
    Properties: [
      {
        PropertyString: "20% Chance to cast level 12 lower resist when struck",
        Index: 1
      },
      {
        PropertyString: "25% Chance to cast level 15 poison nova on striking",
        Index: 2
      },
      {
        PropertyString: "Level 13-17 Cleansing Aura When Equipped",
        Index: 5
      },
      {
        PropertyString: "1-2 to All Skills",
        Index: 6
      },
      {
        PropertyString: "+220-320% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "23 to Enemy Poison Resistance",
        Index: 3
      },
      {
        PropertyString: "+3 Deadly Strike Per Level (Based on Character Level)",
        Index: 4
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "25% Chance of Open Wounds",
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
    Index: "Runeword109",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword109",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 17 fire wall when struck",
        Index: 4
      },
      {
        PropertyString: "Level 16-20 Concentration Aura When Equipped",
        Index: 3
      },
      {
        PropertyString: "260-300 bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+8% Damage to Demons Damage to Demons Per Level (Based on Character Level)",
        Index: 0
      },
      {
        PropertyString: "Adds 50-280 to Lightning Damage",
        Index: 1
      },
      {
        PropertyString: "+8 Replenish Life",
        Index: 5
      },
      {
        PropertyString: "+15 extra gold from monsters Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "Hit blinds target +1",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+20 Deadly Strike",
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
    Name: "Rain Reimagined\n",
    Index: "Runeword202",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword202",
    Properties: [
      {
        PropertyString: "4 to All Skills",
        Index: 1
      },
      {
        PropertyString: "25 to Strength",
        Index: 4
      },
      {
        PropertyString: "100-150 to Life",
        Index: 2
      },
      {
        PropertyString: "+20 Replenish Life",
        Index: 5
      },
      {
        PropertyString: "+60-100 to Mana",
        Index: 3
      },
      {
        PropertyString: "Regenerate Mana 100%",
        Index: 6
      },
      {
        PropertyString: "+22 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+16 Damage Reduced by 16%%",
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
    Index: "Runeword152",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword152",
    Properties: [
      {
        PropertyString: "+1 Indestructible",
        Index: 4
      },
      {
        PropertyString: "+100 to Minimum Damage",
        Index: 1
      },
      {
        PropertyString: "+20 to Maximum Damage Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "5 to Experience Gained",
        Index: 5
      },
      {
        PropertyString: "Ethereal (Cannot Be Repaired)",
        Index: 3
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
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+7 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+5 Increase Maximum Mana",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15",
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
    Index: "Runeword164",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword164",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 35 bone spear on striking",
        Index: 4
      },
      {
        PropertyString: "Level 3 Salvation Aura When Equipped",
        Index: 3
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
        PropertyString: "+8 to Teleport",
        Index: 2
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 5
      },
      {
        PropertyString: "20 to Strength",
        Index: 6
      },
      {
        PropertyString: "Freezes target +6",
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
    Index: "Runeword166",
    Enabled: true,
    ItemLevel: 67,
    RequiredLevel: 67,
    Code: "Runeword166",
    Properties: [
      {
        PropertyString: "25% Chance to cast level 25 chain lightning when struck",
        Index: 1
      },
      {
        PropertyString: "25% Chance to cast level 25 fire ball when struck",
        Index: 2
      },
      {
        PropertyString: "25% Chance to cast level 25 blizzard when struck",
        Index: 3
      },
      {
        PropertyString: "2 to All Skills",
        Index: 4
      },
      {
        PropertyString: "25 to Strength",
        Index: 5
      },
      {
        PropertyString: "+80 Poison Length Reduced by",
        Index: 6
      },
      {
        PropertyString: "+7 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
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
        Name: "Merc Equip",
        Index: "Merc Equip",
        Class: ""
      }
    ],
    Name: "Authority",
    Index: "Runeword3",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword3",
    Properties: [
      {
        PropertyString: "16% Chance to cast level 9 weaken on striking",
        Index: 4
      },
      {
        PropertyString: "2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25 Deadly Strike",
        Index: 6
      },
      {
        PropertyString: "+20 Slows target by",
        Index: 5
      },
      {
        PropertyString: "+160-200 Enhanced Defense",
        Index: 3
      },
      {
        PropertyString: "+12 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 2
      },
      {
        PropertyString: "+12 To Required Level",
        Index: 1
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "+8 Damage Reduced by 8%%",
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
    Index: "Runeword11",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword11",
    Properties: [
      {
        PropertyString: "50% Chance to cast level 20 poison nova when you Kill an Enemy",
        Index: 4
      },
      {
        PropertyString: "+60 Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+350-400% Enhanced Damage",
        Index: 5
      },
      {
        PropertyString: "Adds 12-15 Life stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "30 to Strength",
        Index: 6
      },
      {
        PropertyString: "+7 Mana stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Requirements -20%",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "1 to Light Radius",
        Index: 0
      },
      {
        PropertyString: "50 to Attack Rating against Undead",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "-25% Target Defense",
        Index: 0
      },
      {
        PropertyString: "+200% Damage to Undead Damage to Undead",
        Index: 1
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
    Index: "Runeword18",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword18",
    Properties: [
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '100' parameter: '1' op: '6' op_param: 'null'",
        Index: 1
      },
      {
        PropertyString: "TODO: Unimplemented function: '17' value1: '1' value2: '100' parameter: '3' op: '6' op_param: 'null'",
        Index: 2
      },
      {
        PropertyString: "+3 All Assassin Skills",
        Index: 0
      },
      {
        PropertyString: "Adds 75-150 to Damage",
        Index: 3
      },
      {
        PropertyString: "All Resistances +20-40",
        Index: 4
      },
      {
        PropertyString: "+15 Damage Reduced by 15%%",
        Index: 5
      },
      {
        PropertyString: "+8 better chance of getting magic item Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "+7 Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+7 Mana stolen per hit",
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
    Index: "Runeword57",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword57",
    Properties: [
      {
        PropertyString: "Level 5-7 Salvation Aura When Equipped",
        Index: 6
      },
      {
        PropertyString: "+10-15 to Shout",
        Index: 1
      },
      {
        PropertyString: "+10-15 to Battle Orders",
        Index: 2
      },
      {
        PropertyString: "+10-15 to Battle Command",
        Index: 3
      },
      {
        PropertyString: "+10-15 to Shiver Armor",
        Index: 4
      },
      {
        PropertyString: "+10-15 to Valkyrie",
        Index: 5
      },
      {
        PropertyString: "+17 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15",
        Index: 0
      },
      {
        PropertyString: "15% Damage Taken Goes To Mana",
        Index: 0
      },
      {
        PropertyString: "+1 Cannot Be Frozen",
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
    Name: "Morning",
    Index: "Runeword85",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword85",
    Properties: [
      {
        PropertyString: "100% Chance to cast level 20 static field when you Kill an Enemy",
        Index: 5
      },
      {
        PropertyString: "+3 All Druid Skills",
        Index: 3
      },
      {
        PropertyString: "+50 Increased Attack Speed",
        Index: 1
      },
      {
        PropertyString: "+300-360% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+20 to Sword Mastery",
        Index: 4
      },
      {
        PropertyString: "All Resistances +25",
        Index: 6
      },
      {
        PropertyString: "+10 To Required Level",
        Index: 0
      },
      {
        PropertyString: "+1 Prevent Monster Heal",
        Index: 0
      },
      {
        PropertyString: "+9 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "+20 Chance of Crushing Blow",
        Index: 0
      },
      {
        PropertyString: "Freezes target +3",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
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
    Index: "Runeword86",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword86",
    Properties: [
      {
        PropertyString: "Level 6 Concentration Aura When Equipped",
        Index: 4
      },
      {
        PropertyString: "+3 All Druid Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+15 Increase Maximum Life",
        Index: 2
      },
      {
        PropertyString: "+15 Increase Maximum Mana",
        Index: 1
      },
      {
        PropertyString: "All Resistances +30-50",
        Index: 3
      },
      {
        PropertyString: "3 to Experience Gained",
        Index: 6
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
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
    Index: "Runeword94",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword94",
    Properties: [
      {
        PropertyString: "24% Chance to cast level 10 weaken when struck",
        Index: 1
      },
      {
        PropertyString: "4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+65 Faster Cast Rate",
        Index: 2
      },
      {
        PropertyString: "+60 Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "+15-25 Increase Maximum Life",
        Index: 5
      },
      {
        PropertyString: "Regenerate Mana 15%",
        Index: 6
      },
      {
        PropertyString: "All Resistances +60-70",
        Index: 4
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "+30 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+75 extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "10 to Energy",
        Index: 0
      },
      {
        PropertyString: "10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+1 Knockback",
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
    Index: "Runeword114",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword114",
    Properties: [
      {
        PropertyString: "10% Chance to cast level 19 bone armor when struck",
        Index: 4
      },
      {
        PropertyString: "35% Chance to cast level 8 dim vision on striking",
        Index: 5
      },
      {
        PropertyString: "+50 Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "55% Increased Chance of Blocking",
        Index: 0
      },
      {
        PropertyString: "+32 Defense Per Level (Based on Character Level)",
        Index: 6
      },
      {
        PropertyString: "All Resistances +30-50",
        Index: 3
      },
      {
        PropertyString: "+15 Life after each Kill",
        Index: 1
      },
      {
        PropertyString: "50 to Life",
        Index: 0
      },
      {
        PropertyString: "+25 better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Block Rate",
        Index: 0
      },
      {
        PropertyString: "+1 Indestructible",
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
    Index: "Runeword118",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword118",
    Properties: [
      {
        PropertyString: "Level 5 Meditation Aura When Equipped",
        Index: 2
      },
      {
        PropertyString: "+3 All Sorceress Skills",
        Index: 0
      },
      {
        PropertyString: "+50 Faster Cast Rate",
        Index: 1
      },
      {
        PropertyString: "+36-65 to Inner Sight (Amazon Only)",
        Index: 6
      },
      {
        PropertyString: "+20 Damage Reduced by 20%%",
        Index: 4
      },
      {
        PropertyString: "3 to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "20% Damage Taken Goes To Mana",
        Index: 5
      },
      {
        PropertyString: "+1 Indestructible",
        Index: 0
      },
      {
        PropertyString: "+2 to Mana after each Kill",
        Index: 0
      },
      {
        PropertyString: "20 to Energy",
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
    Index: "Runeword132",
    Enabled: true,
    ItemLevel: 69,
    RequiredLevel: 69,
    Code: "Runeword132",
    Properties: [
      {
        PropertyString: "3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+20 Faster Hit Recovery",
        Index: 6
      },
      {
        PropertyString: "Adds 35-140 to Damage",
        Index: 1
      },
      {
        PropertyString: "+100-200 Enhanced Defense",
        Index: 2
      },
      {
        PropertyString: "+20 To Required Level",
        Index: 5
      },
      {
        PropertyString: "50 to Attack Rating (Weapon)",
        Index: 1
      },
      {
        PropertyString: "+230-380 better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "Requirements -130%",
        Index: 3
      },
      {
        PropertyString: "+3 Indestructible (Weapon)",
        Index: 0
      },
      {
        PropertyString: "3 to Light Radius (Weapon)",
        Index: 0
      },
      {
        PropertyString: "+30 Defense (Armor)",
        Index: 1
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
    this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
    this.updateList();
  }
  handleSearchRunesChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
  }
  handleSearchChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
  }
  selectedTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
  }
  selectedAmountChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
  }
  handleExclusiveTypeChanged() {
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
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
  removeRuneFromName(runeName) {
    return runeName.replace(" Rune", "");
  }
  transformTypeName(name2) {
    switch (name2) {
      case "Merc Equip":
        return "Helm";
      default:
        return name2;
    }
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
