import { C as CustomElement, w as watch, c as customElement, b as bindable } from "./index-BePQ-y0p.js";
import { d as debounce } from "./debounce-ZwsFz6hU.js";
const name = "sets";
const template = '<template>\n    <h3 class="text-center my-4">\n        ${sets.length} Sets Found\n    </h3>\n    <div class="container">\n        <div class="row align-content-center justify-content-center text-center mb-5">\n            <div class="col-12 col-sm-6">\n                <div class="au-select mb-2">\n                    <moo-select\n                            class="w-100"\n                            label="Select Class"\n                            options.bind="classes"\n                            class="standard-betsy-select"\n                            value.bind="class"\n                    ></moo-select>\n                </div>\n            </div>\n            <div class="col-12 col-sm-6">\n                <moo-text-field\n                        class="w-100"\n                        label="Search Sets"\n                        type="text"\n                        value.bind="search"\n                ></moo-text-field>\n            </div>\n        </div>\n    </div>\n\n    <div class="row gy-5 px-5 text-center">\n        <div class="col-12 col-md-6 col-xxl-4" repeat.for="set of sets">\n            <div class="card bg-dark p-2">\n                <div class="set-text fs-5 mb-1">\n                    ${set.Name}\n                </div>\n\n                <div class="partial-sets set-text" repeat.for="partial of set.PartialProperties">\n                    ${partial.PropertyString} (${$index + 2} Items)\n                </div>\n\n                <div class="partial-sets set-text" repeat.for="full of set.FullProperties">\n                    ${full.PropertyString} (Full Set)\n                </div>\n\n                <div class="my-3" repeat.for="setItem of set.SetItems">\n                    <div class="set-text mb-1">\n                        ${setItem.Name}\n                    </div>\n\n                    <div class="armor mb-1" if.bind="setItem.Equipment.Name">\n                        ${setItem.Equipment.Name}\n                    </div>\n\n                    <div class="armor mt-1" if.bind="setItem.Equipment.ArmorString">\n                        Armor: ${setItem.Equipment.ArmorString}\n                    </div>\n\n                    <div class="damage" if.bind="setItem.Equipment.DamageTypes"\n                         repeat.for="damage of setItem.Equipment.DamageTypes">\n                        ${getDamageTypeString(damage.Type)} ${damage.DamageString}\n                    </div>\n\n                    <div class="requirement" if.bind="setItem.RequiredLevel > 0">\n                        Level ${setItem.RequiredLevel} Required\n                    </div>\n\n                    <div class="requirement" if.bind="setItem.Equipment.RequiredStrength > 0">\n                        ${setItem.Equipment.RequiredStrength} Strength Required\n                    </div>\n\n                    <div class="requirement" if.bind="setItem.Equipment.RequiredDexterity > 0">\n                        ${setItem.Equipment.RequiredDexterity} Dexterity Required\n                    </div>\n\n                    <div class="durability mt-1" if.bind="setItem.Equipment.Durability > 0">\n                        ${setItem.Equipment.Durability} Durability\n                    </div>\n\n                    <div class="enhanced" repeat.for="property of setItem.Properties">\n                        ${property.PropertyString}\n                    </div>\n\n                    <div class="set-text" repeat.for="setProperty of setItem.SetPropertiesString">\n                        ${setProperty}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n';
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
    Index: "Civerb's Vestments",
    Name: "Civerb's Vestments",
    SetItems: [
      {
        Type: "Shield",
        "Set": "Civerb's Vestments",
        SetPropertiesString: [
          "+21-22 to Mana (Civerb's Icon)",
          "Poison Resist +25-26% (Civerb's Cudgel)"
        ],
        Name: "Civerb's Ward",
        Index: "Civerb's Ward",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 13,
        RequiredLevel: 9,
        Code: "lrg",
        Properties: [
          {
            PropertyString: "+15% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+15 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "2 to 4",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "32-42",
          EquipmentType: 0,
          Name: "Large Shield",
          RequiredStrength: 34,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 11,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Civerb's Vestments",
        SetPropertiesString: [
          "+25 Defense (3 Items)",
          "Cold Resist +25% (2 Items)"
        ],
        Name: "Civerb's Icon",
        Index: "Civerb's Icon",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 13,
        RequiredLevel: 9,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+4 Replenish Life",
            Index: 1
          },
          {
            PropertyString: "Regenerate Mana +40%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Civerb's Vestments",
        SetPropertiesString: [],
        Name: "Civerb's Cudgel",
        Index: "Civerb's Cudgel",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 13,
        RequiredLevel: 9,
        Code: "gsc",
        Properties: [
          {
            PropertyString: "+17-23 to Maximum Damage",
            Index: 1
          },
          {
            PropertyString: "+75 to Attack Rating",
            Index: 0
          },
          {
            PropertyString: "+1 to Maximum Damage (Per Character Level)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "8 to 35"
            }
          ],
          EquipmentType: 1,
          Name: "Grand Scepter",
          RequiredStrength: 37,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 15,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Fire Resist +25%",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+25% bonus to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+200% Damage to Undead",
        Index: 1
      },
      {
        PropertyString: "+50 Defense",
        Index: 4
      },
      {
        PropertyString: "+15 to Strength",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +25%",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Hsarus' Defense",
    Name: "Hsarus' Defense",
    SetItems: [
      {
        Type: "Boots",
        "Set": "Hsarus' Defense",
        SetPropertiesString: [
          "+2.5 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Hsarus' Iron Heel",
        Index: "Hsarus' Iron Heel",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 4,
        RequiredLevel: 3,
        Code: "mbt",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +25%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "6 to 12",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "108",
          EquipmentType: 0,
          Name: "Chain Boots",
          RequiredStrength: 30,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Hsarus' Defense",
        SetPropertiesString: [
          "+2.5 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Hsarus' Iron Fist",
        Index: "Hsarus' Iron Fist",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 4,
        RequiredLevel: 3,
        Code: "buc",
        Properties: [
          {
            PropertyString: "+10 to Strength",
            Index: 1
          },
          {
            PropertyString: "Damage Reduced by 2",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "1 to 3",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "4",
          EquipmentType: 0,
          Name: "Buckler",
          RequiredStrength: 12,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 1,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Hsarus' Defense",
        SetPropertiesString: [
          "+2.5 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Hsarus' Iron Stay",
        Index: "Hsarus' Iron Stay",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 4,
        RequiredLevel: 3,
        Code: "mbl",
        Properties: [
          {
            PropertyString: "+20 to Life",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +20%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "5",
          EquipmentType: 0,
          Name: "Belt",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Attacker Takes Damage of +5",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5 to Maximum Damage",
        Index: 0
      },
      {
        PropertyString: "Lightning Resist +25%",
        Index: 2
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Cleglaw's Brace",
    Name: "Cleglaw's Brace",
    SetItems: [
      {
        Type: "Sword",
        "Set": "Cleglaw's Brace",
        SetPropertiesString: [
          "+1.25 to Maximum Damage (Per Character Level) (2 Items)"
        ],
        Name: "Cleglaw's Tooth",
        Index: "Cleglaw's Tooth",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 6,
        RequiredLevel: 4,
        Code: "lsd",
        Properties: [
          {
            PropertyString: "+30% bonus to Attack Rating",
            Index: 0
          },
          {
            PropertyString: "+50% Deadly Strike",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "3 to 19"
            }
          ],
          EquipmentType: 1,
          Name: "Long Sword",
          RequiredStrength: 55,
          RequiredDexterity: 39,
          Durability: 250,
          ItemLevel: 20,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Cleglaw's Brace",
        SetPropertiesString: [
          "All Resistances +15% (2 Items)"
        ],
        Name: "Cleglaw's Claw",
        Index: "Cleglaw's Claw",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 6,
        RequiredLevel: 4,
        Code: "sml",
        Properties: [
          {
            PropertyString: "+17 Defense",
            Index: 0
          },
          {
            PropertyString: "Poison Length Reduced by 75%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "2 to 3",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "25",
          EquipmentType: 0,
          Name: "Small Shield",
          RequiredStrength: 22,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 5,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Cleglaw's Brace",
        SetPropertiesString: [
          "+2.5 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Cleglaw's Pincers",
        Index: "Cleglaw's Pincers",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 6,
        RequiredLevel: 4,
        Code: "mgl",
        Properties: [
          {
            PropertyString: "Slows target by 25%",
            Index: 1
          },
          {
            PropertyString: "Knockback",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "15",
          EquipmentType: 0,
          Name: "Chain Gloves",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 Defense",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+6% Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+35% Chance of Crushing Blow",
        Index: 2
      },
      {
        PropertyString: "+50 Defense",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Iratha's Finery",
    Name: "Iratha's Finery",
    SetItems: [
      {
        Type: "Amulet",
        "Set": "Iratha's Finery",
        SetPropertiesString: [
          "All Resistances +15% (2 Items)"
        ],
        Name: "Iratha's Collar",
        Index: "Iratha's Collar",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 15,
        Code: "amu",
        Properties: [
          {
            PropertyString: "Poison Resist +30%",
            Index: 0
          },
          {
            PropertyString: "Poison Length Reduced by 75%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Iratha's Finery",
        SetPropertiesString: [
          "+20% Increased Attack Speed (2 Items)"
        ],
        Name: "Iratha's Cuff",
        Index: "Iratha's Cuff",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 15,
        Code: "tgl",
        Properties: [
          {
            PropertyString: "Cold Resist +30%",
            Index: 0
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "9",
          EquipmentType: 0,
          Name: "Light Gauntlets",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Iratha's Finery",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Iratha's Coil",
        Index: "Iratha's Coil",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 15,
        Code: "crn",
        Properties: [
          {
            PropertyString: "Lightning Resist +30%",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +30%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25",
          EquipmentType: 0,
          Name: "Crown",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 29,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Iratha's Finery",
        SetPropertiesString: [
          "+10 to Dexterity (2 Items)"
        ],
        Name: "Iratha's Cord",
        Index: "Iratha's Cord",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 15,
        Code: "tbl",
        Properties: [
          {
            PropertyString: "+5 to Minimum Damage",
            Index: 1
          },
          {
            PropertyString: "+25 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "26-36",
          EquipmentType: 0,
          Name: "Heavy Belt",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 Defense",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+24% Piercing Attack",
        Index: 3
      }
    ],
    FullProperties: [
      {
        PropertyString: "+15 to Dexterity",
        Index: 5
      },
      {
        PropertyString: "+10 to Maximum Poison Resist",
        Index: 4
      },
      {
        PropertyString: "+10 to Maximum Cold Resist",
        Index: 2
      },
      {
        PropertyString: "+10 to Maximum Lightning Resist",
        Index: 3
      },
      {
        PropertyString: "+10 to Maximum Fire Resist",
        Index: 1
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Isenhart's Armory",
    Name: "Isenhart's Armory",
    SetItems: [
      {
        Type: "Sword",
        "Set": "Isenhart's Armory",
        SetPropertiesString: [
          "+1.25 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Isenhart's Lightbrand",
        Index: "Isenhart's Lightbrand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 8,
        Code: "bsd",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+10 to Minimum Damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "17 to 14"
            }
          ],
          EquipmentType: 1,
          Name: "Broad Sword",
          RequiredStrength: 48,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 15,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Isenhart's Armory",
        SetPropertiesString: [
          "All Resistances +8% (2 Items)"
        ],
        Name: "Isenhart's Parry",
        Index: "Isenhart's Parry",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 8,
        Code: "gts",
        Properties: [
          {
            PropertyString: "+40 Defense",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Lightning Damage of +4",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "2 to 6",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "70",
          EquipmentType: 0,
          Name: "Gothic Shield",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 30,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Isenhart's Armory",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Isenhart's Case",
        Index: "Isenhart's Case",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 8,
        Code: "brs",
        Properties: [
          {
            PropertyString: "+40 Defense",
            Index: 0
          },
          {
            PropertyString: "Magic Damage Reduced by 2",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "115-145",
          EquipmentType: 0,
          Name: "Breast Plate",
          RequiredStrength: 30,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 18,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Isenhart's Armory",
        SetPropertiesString: [
          "All Resistances +8% (2 Items)"
        ],
        Name: "Isenhart's Horns",
        Index: "Isenhart's Horns",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 8,
        Code: "fhl",
        Properties: [
          {
            PropertyString: "+6 to Dexterity",
            Index: 0
          },
          {
            PropertyString: "Damage Reduced by 2",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "43-53",
          EquipmentType: 0,
          Name: "Full Helm",
          RequiredStrength: 41,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 15,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Strength",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 4
      },
      {
        PropertyString: "+30% Increased Chance of Blocking",
        Index: 3
      },
      {
        PropertyString: "+35% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+5% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "All Resistances +10%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Vidala's Rig",
    Name: "Vidala's Rig",
    SetItems: [
      {
        Type: "Bow",
        "Set": "Vidala's Rig",
        SetPropertiesString: [
          "+2 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Vidala's Barb",
        Index: "Vidala's Barb",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 19,
        RequiredLevel: 14,
        Code: "lbb",
        Properties: [
          {
            PropertyString: "Adds 1-20 Lightning damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "3 to 18"
            }
          ],
          EquipmentType: 1,
          Name: "Long Battle Bow",
          RequiredStrength: 40,
          RequiredDexterity: 50,
          Durability: 0,
          ItemLevel: 23,
          Type: {
            Name: "Bow",
            Index: "Bow",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Vidala's Rig",
        SetPropertiesString: [
          "All Resistances +8% (2 Items)"
        ],
        Name: "Vidala's Fetlock",
        Index: "Vidala's Fetlock",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 19,
        RequiredLevel: 14,
        Code: "tbt",
        Properties: [
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "8 to 16",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "18-21",
          EquipmentType: 0,
          Name: "Light Plated Boots",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Vidala's Rig",
        SetPropertiesString: [
          "+2.5 Defense (Per Character Level) (3 Items)",
          "Fire Resist +24% (2 Items)"
        ],
        Name: "Vidala's Ambush",
        Index: "Vidala's Ambush",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 19,
        RequiredLevel: 14,
        Code: "lea",
        Properties: [
          {
            PropertyString: "+50 Defense",
            Index: 0
          },
          {
            PropertyString: "+11 to Dexterity",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "64",
          EquipmentType: 0,
          Name: "Leather Armor",
          RequiredStrength: 15,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 3,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Vidala's Rig",
        SetPropertiesString: [
          "+50% better chance of getting magic item (2 Items)"
        ],
        Name: "Vidala's Snare",
        Index: "Vidala's Snare",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 19,
        RequiredLevel: 14,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+15 to Life",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+75 to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+7% Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+15 to Dexterity",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+50% Piercing Attack",
        Index: 2
      },
      {
        PropertyString: "+1.5 to Maximum Cold Damage (Per Character Level)",
        Index: 0
      },
      {
        PropertyString: "Freezes target +1",
        Index: 1
      },
      {
        PropertyString: "+10 to Strength",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Milabrega's Regalia",
    Name: "Milabrega's Regalia",
    SetItems: [
      {
        Type: "Shield",
        "Set": "Milabrega's Regalia",
        SetPropertiesString: [
          "+50% Enhanced Defense (3 Items)",
          "+50 to Life (2 Items)"
        ],
        Name: "Milabrega's Orb",
        Index: "Milabrega's Orb",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 23,
        RequiredLevel: 17,
        Code: "kit",
        Properties: [
          {
            PropertyString: "+25 Defense",
            Index: 1
          },
          {
            PropertyString: "+20% better chance of getting magic item",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "2 to 5",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "41",
          EquipmentType: 0,
          Name: "Kite Shield",
          RequiredStrength: 47,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 15,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Milabrega's Regalia",
        SetPropertiesString: [],
        Name: "Milabrega's Rod",
        Index: "Milabrega's Rod",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 23,
        RequiredLevel: 17,
        Code: "wsp",
        Properties: [
          {
            PropertyString: "+1 to Paladin Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+50% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+2 to Light Radius",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "15 to 25"
            }
          ],
          EquipmentType: 1,
          Name: "War Scepter",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 21,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Milabrega's Regalia",
        SetPropertiesString: [
          "Cold Resist +40% (2 Items)"
        ],
        Name: "Milabrega's Diadem",
        Index: "Milabrega's Diadem",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 23,
        RequiredLevel: 17,
        Code: "crn",
        Properties: [
          {
            PropertyString: "+15 to Life",
            Index: 0
          },
          {
            PropertyString: "+15 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25",
          EquipmentType: 0,
          Name: "Crown",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 29,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Milabrega's Regalia",
        SetPropertiesString: [
          "+100% Enhanced Defense (2 Items)"
        ],
        Name: "Milabrega's Robe",
        Index: "Milabrega's Robe",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 23,
        RequiredLevel: 17,
        Code: "aar",
        Properties: [
          {
            PropertyString: "Damage Reduced by 2",
            Index: 1
          },
          {
            PropertyString: "Attacker Takes Damage of +3",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "218",
          EquipmentType: 0,
          Name: "Ancient Armor",
          RequiredStrength: 100,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 40,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+75 to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+2 to Maximum Lightning Damage (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+125 to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 3
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+10% Mana stolen per hit",
        Index: 2
      },
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "Poison Resist +15%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Cathan's Traps",
    Name: "Cathan's Traps",
    SetItems: [
      {
        Type: "Staff",
        "Set": "Cathan's Traps",
        SetPropertiesString: [
          "+50 to Mana (2 Items)",
          "All Resistances +10% (3 Items)"
        ],
        Name: "Cathan's Rule",
        Index: "Cathan's Rule",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 11,
        Code: "bst",
        Properties: [
          {
            PropertyString: "+1 to Fire Skills",
            Index: 0
          },
          {
            PropertyString: "+10 to Maximum Fire Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "6 to 13"
            }
          ],
          EquipmentType: 1,
          Name: "Battle Staff",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 17,
          Type: {
            Name: "Staff",
            Index: "Staff",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Cathan's Traps",
        SetPropertiesString: [
          "Fire Resist +30% (3 Items)",
          "Attacker Takes Damage of +5 (2 Items)"
        ],
        Name: "Cathan's Mesh",
        Index: "Cathan's Mesh",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 11,
        Code: "chn",
        Properties: [
          {
            PropertyString: "+15 Defense",
            Index: 0
          },
          {
            PropertyString: "Requirements -50%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "87",
          EquipmentType: 0,
          Name: "Chain Mail",
          RequiredStrength: 48,
          RequiredDexterity: 0,
          Durability: 45,
          ItemLevel: 15,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Cathan's Traps",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Cathan's Visage",
        Index: "Cathan's Visage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 11,
        Code: "msk",
        Properties: [
          {
            PropertyString: "+20 to Mana",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +25%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "16-20",
          EquipmentType: 0,
          Name: "Mask",
          RequiredStrength: 23,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 19,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Cathan's Traps",
        SetPropertiesString: [
          "+50 to Attack Rating (2 Items)",
          "+25% better chance of getting magic item (3 Items)"
        ],
        Name: "Cathan's Sigil",
        Index: "Cathan's Sigil",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 11,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+10% Faster Hit Recovery",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Lightning Damage of +5",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Cathan's Traps",
        SetPropertiesString: [
          "+10 to Strength (2 Items)"
        ],
        Name: "Cathan's Seal",
        Index: "Cathan's Seal",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 11,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+6% Life stolen per hit",
            Index: 0
          },
          {
            PropertyString: "Damage Reduced by 2",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Adds 15-20 to Fire Damage",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +16%",
        Index: 1
      },
      {
        PropertyString: "Lightning Resist +25%",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+10% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+60 to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+20 to Mana",
        Index: 4
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "Magic Damage Reduced by 3",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Tancred's Battlegear",
    Name: "Tancred's Battlegear",
    SetItems: [
      {
        Type: "Axe",
        "Set": "Tancred's Battlegear",
        SetPropertiesString: [
          "+20% Increased Attack Speed (3 Items)",
          "+20 to Mana (2 Items)"
        ],
        Name: "Tancred's Crowbill",
        Index: "Tancred's Crowbill",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 27,
        RequiredLevel: 20,
        Code: "mpi",
        Properties: [
          {
            PropertyString: "+80% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+75 to Attack Rating",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "12 to 19"
            }
          ],
          EquipmentType: 1,
          Name: "Military Pick",
          RequiredStrength: 49,
          RequiredDexterity: 33,
          Durability: 250,
          ItemLevel: 19,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Tancred's Battlegear",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Tancred's Spine",
        Index: "Tancred's Spine",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 27,
        RequiredLevel: 20,
        Code: "ful",
        Properties: [
          {
            PropertyString: "+15 to Strength",
            Index: 1
          },
          {
            PropertyString: "+40 to Life",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "286-347",
          EquipmentType: 0,
          Name: "Full Plate Mail",
          RequiredStrength: 80,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 37,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Tancred's Battlegear",
        SetPropertiesString: [
          "+30% Faster Run/Walk (2 Items)",
          "+10 to Strength (3 Items)"
        ],
        Name: "Tancred's Hobnails",
        Index: "Tancred's Hobnails",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 27,
        RequiredLevel: 20,
        Code: "lbt",
        Properties: [
          {
            PropertyString: "+10 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "+25 Heal Stamina Plus",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "3 to 8",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Boots",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Tancred's Battlegear",
        SetPropertiesString: [
          "+60 to Attack Rating (3 Items)",
          "+78% better chance of getting magic item (2 Items)"
        ],
        Name: "Tancred's Weird",
        Index: "Tancred's Weird",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 27,
        RequiredLevel: 20,
        Code: "amu",
        Properties: [
          {
            PropertyString: "Damage Reduced by 2",
            Index: 0
          },
          {
            PropertyString: "Magic Damage Reduced by 1",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Tancred's Battlegear",
        SetPropertiesString: [
          "All Resistances +10% (2 Items)"
        ],
        Name: "Tancred's Skull",
        Index: "Tancred's Skull",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 27,
        RequiredLevel: 20,
        Code: "bhm",
        Properties: [
          {
            PropertyString: "+10% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+40 to Attack Rating",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "33",
          EquipmentType: 0,
          Name: "Bone Helm",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 22,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15 to Minimum Lightning Damage",
        Index: 0
      },
      {
        PropertyString: "+5% Life stolen per hit",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5% Mana stolen per hit",
        Index: 3
      },
      {
        PropertyString: "Slows target by 35%",
        Index: 2
      },
      {
        PropertyString: "All Resistances +10%",
        Index: 1
      },
      {
        PropertyString: "+75% extra gold from monsters",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Sigon's Complete Steel",
    Name: "Sigon's Complete Steel",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [
          "+30% Increased Attack Speed (2 Items)"
        ],
        Name: "Sigon's Gage",
        Index: "Sigon's Gage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "hgl",
        Properties: [
          {
            PropertyString: "+20 to Attack Rating",
            Index: 1
          },
          {
            PropertyString: "+10 to Strength",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Gauntlets",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [
          "+2 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Sigon's Visor",
        Index: "Sigon's Visor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "ghm",
        Properties: [
          {
            PropertyString: "+25 Defense",
            Index: 1
          },
          {
            PropertyString: "+30 to Mana",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "30",
          EquipmentType: 0,
          Name: "Great Helm",
          RequiredStrength: 63,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 23,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [
          "Attacker Takes Damage of +20 (2 Items)"
        ],
        Name: "Sigon's Shelter",
        Index: "Sigon's Shelter",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "gth",
        Properties: [
          {
            PropertyString: "+25% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +30%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "161",
          EquipmentType: 0,
          Name: "Gothic Plate",
          RequiredStrength: 70,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 32,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [
          "+50 to Attack Rating (2 Items)",
          "+50% better chance of getting magic item (3 Items)"
        ],
        Name: "Sigon's Sabot",
        Index: "Sigon's Sabot",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "hbt",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +40%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "10 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Greaves",
          RequiredStrength: 70,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Sigon's Wrap",
        Index: "Sigon's Wrap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "hbl",
        Properties: [
          {
            PropertyString: "+20 to Life",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +20%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-19",
          EquipmentType: 0,
          Name: "Plated Belt",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Sigon's Complete Steel",
        SetPropertiesString: [],
        Name: "Sigon's Guard",
        Index: "Sigon's Guard",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 6,
        Code: "tow",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20% Increased Chance of Blocking",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "1 to 5",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "22",
          EquipmentType: 0,
          Name: "Tower Shield",
          RequiredStrength: 75,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 22,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+100 Defense",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+24 to Maximum Fire Damage",
        Index: 3
      },
      {
        PropertyString: "+20 to Mana",
        Index: 4
      },
      {
        PropertyString: "Fire Resist +12%",
        Index: 0
      },
      {
        PropertyString: "Damage Reduced by 7",
        Index: 2
      },
      {
        PropertyString: "Attacker Takes Damage of +12",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Infernal Tools",
    Name: "Infernal Tools",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Infernal Tools",
        SetPropertiesString: [
          "+2 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Infernal Cranium",
        Index: "Infernal Cranium",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 7,
        RequiredLevel: 5,
        Code: "cap",
        Properties: [
          {
            PropertyString: "All Resistances +10%",
            Index: 0
          },
          {
            PropertyString: "+20% Damage Taken Goes To Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-28",
          EquipmentType: 0,
          Name: "Cap",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 1,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Wand",
        "Set": "Infernal Tools",
        SetPropertiesString: [
          "+2.5 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Infernal Torch",
        Index: "Infernal Torch",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 7,
        RequiredLevel: 5,
        Code: "gwn",
        Properties: [
          {
            PropertyString: "+1 to Necromancer Skill Levels",
            Index: 1
          },
          {
            PropertyString: "+8 to Minimum Damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "13 to 11"
            }
          ],
          EquipmentType: 1,
          Name: "Grim Wand",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 26,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Infernal Tools",
        SetPropertiesString: [
          "Poison Resist +25% (2 Items)",
          "Half Freeze Duration (3 Items)"
        ],
        Name: "Infernal Sign",
        Index: "Infernal Sign",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 7,
        RequiredLevel: 5,
        Code: "tbl",
        Properties: [
          {
            PropertyString: "+25 Defense",
            Index: 0
          },
          {
            PropertyString: "+20 to Life",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "26-36",
          EquipmentType: 0,
          Name: "Heavy Belt",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+8 Poison Damage Over 3 Seconds",
        Index: 0
      },
      {
        PropertyString: "+10 to Mana",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Necromancer Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+20% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+6% Mana stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+20% Chance of Open Wounds",
        Index: 2
      },
      {
        PropertyString: "+20% Increased Maximum Mana",
        Index: 4
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 5
      }
    ],
    Level: 1
  },
  {
    Index: "Berserker's Arsenal",
    Name: "Berserker's Arsenal",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Berserker's Arsenal",
        SetPropertiesString: [
          "+2 to Attack Rating (Per Character Level) (2 Items)"
        ],
        Name: "Berserker's Headgear",
        Index: "Berserker's Headgear",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 5,
        RequiredLevel: 3,
        Code: "hlm",
        Properties: [
          {
            PropertyString: "+15 Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +25%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "30",
          EquipmentType: 0,
          Name: "Helm",
          RequiredStrength: 26,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 11,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Berserker's Arsenal",
        SetPropertiesString: [
          "+3 Defense (Per Character Level) (2 Items)"
        ],
        Name: "Berserker's Hauberk",
        Index: "Berserker's Hauberk",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 5,
        RequiredLevel: 3,
        Code: "spl",
        Properties: [
          {
            PropertyString: "+1 to Barbarian Skill Levels",
            Index: 1
          },
          {
            PropertyString: "Magic Damage Reduced by 2",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "90",
          EquipmentType: 0,
          Name: "Splint Mail",
          RequiredStrength: 51,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 20,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Axe",
        "Set": "Berserker's Arsenal",
        SetPropertiesString: [
          "+50% Enhanced Damage (2 Items)"
        ],
        Name: "Berserker's Hatchet",
        Index: "Berserker's Hatchet",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 5,
        RequiredLevel: 3,
        Code: "2ax",
        Properties: [
          {
            PropertyString: "+30% bonus to Attack Rating",
            Index: 0
          },
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "5 to 13"
            }
          ],
          EquipmentType: 1,
          Name: "Double Axe",
          RequiredStrength: 43,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 13,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 to Life",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "Adds 16-32 Poison damage",
        Index: 1
      },
      {
        PropertyString: "+75 Defense",
        Index: 4
      },
      {
        PropertyString: "Poison Length Reduced by 75%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Death's Disguise",
    Name: "Death's Disguise",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "Death's Disguise",
        SetPropertiesString: [
          "+30% Increased Attack Speed (2 Items)"
        ],
        Name: "Death's Hand",
        Index: "Death's Hand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 8,
        RequiredLevel: 6,
        Code: "lgl",
        Properties: [
          {
            PropertyString: "Poison Resist +50%",
            Index: 0
          },
          {
            PropertyString: "Poison Length Reduced by 75%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Leather Gloves",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Death's Disguise",
        SetPropertiesString: [
          "All Resistances +15% (2 Items)"
        ],
        Name: "Death's Guard",
        Index: "Death's Guard",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 8,
        RequiredLevel: 6,
        Code: "lbl",
        Properties: [
          {
            PropertyString: "+20 Defense",
            Index: 0
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Sash",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Death's Disguise",
        SetPropertiesString: [
          "Adds 25-75 to Cold Damage (2 Items)"
        ],
        Name: "Death's Touch",
        Index: "Death's Touch",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 8,
        RequiredLevel: 6,
        Code: "wsd",
        Properties: [
          {
            PropertyString: "+25% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+4% Life stolen per hit",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "10 to 25"
            }
          ],
          EquipmentType: 1,
          Name: "War Sword",
          RequiredStrength: 71,
          RequiredDexterity: 45,
          Durability: 250,
          ItemLevel: 27,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+10 to Minimum Damage",
        Index: 1
      },
      {
        PropertyString: "+40% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Angelic Raiment",
    Name: "Angelic Raiment",
    SetItems: [
      {
        Type: "Sword",
        "Set": "Angelic Raiment",
        SetPropertiesString: [
          "+30% Increased Attack Speed (3 Items)",
          "+75% Enhanced Damage (2 Items)"
        ],
        Name: "Angelic Sickle",
        Index: "Angelic Sickle",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 12,
        Code: "sbr",
        Properties: [
          {
            PropertyString: "+75 to Attack Rating",
            Index: 0
          },
          {
            PropertyString: "+250% Damage to Undead",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "3 to 8"
            }
          ],
          EquipmentType: 1,
          Name: "Sabre",
          RequiredStrength: 25,
          RequiredDexterity: 25,
          Durability: 250,
          ItemLevel: 8,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Angelic Raiment",
        SetPropertiesString: [
          "+150 Defense (2 Items)",
          "Fire Resist +50% (3 Items)"
        ],
        Name: "Angelic Mantle",
        Index: "Angelic Mantle",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 12,
        Code: "rng",
        Properties: [
          {
            PropertyString: "+40% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "Damage Reduced by 3",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "64",
          EquipmentType: 0,
          Name: "Ring Mail",
          RequiredStrength: 36,
          RequiredDexterity: 0,
          Durability: 26,
          ItemLevel: 11,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Angelic Raiment",
        SetPropertiesString: [
          "+3 to Attack Rating (Per Character Level) (2 Items)",
          "+50% better chance of getting magic item (3 Items)"
        ],
        Name: "Angelic Halo",
        Index: "Angelic Halo",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 17,
        RequiredLevel: 12,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+20 to Life",
            Index: 1
          },
          {
            PropertyString: "+6 Replenish Life",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Angelic Raiment",
        SetPropertiesString: [
          "+1 to All Skills (3 Items)",
          "+75 to Life (2 Items)"
        ],
        Name: "Angelic Wings",
        Index: "Angelic Wings",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 12,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+20% Damage Taken Goes To Mana",
            Index: 1
          },
          {
            PropertyString: "+3 to Light Radius",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "Regenerate Mana +8%",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 0
      },
      {
        PropertyString: "Half Freeze Duration",
        Index: 1
      },
      {
        PropertyString: "+40% better chance of getting magic item",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Arctic Gear",
    Name: "Arctic Gear",
    SetItems: [
      {
        Type: "Bow",
        "Set": "Arctic Gear",
        SetPropertiesString: [
          "+2 to Attack Rating (Per Character Level) (2 Items)",
          "Adds 20-30 to Cold Damage (3 Items)"
        ],
        Name: "Arctic Horn",
        Index: "Arctic Horn",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 3,
        RequiredLevel: 2,
        Code: "swb",
        Properties: [
          {
            PropertyString: "+50% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+20% bonus to Attack Rating",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "9 to 21"
            }
          ],
          EquipmentType: 1,
          Name: "Short War Bow",
          RequiredStrength: 35,
          RequiredDexterity: 55,
          Durability: 0,
          ItemLevel: 27,
          Type: {
            Name: "Bow",
            Index: "Bow",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Arctic Gear",
        SetPropertiesString: [
          "+3 Defense (Per Character Level) (2 Items)",
          "Cold Resist +15% (3 Items)"
        ],
        Name: "Arctic Furs",
        Index: "Arctic Furs",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 3,
        RequiredLevel: 2,
        Code: "qui",
        Properties: [
          {
            PropertyString: "+275-325% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +10%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "8",
          EquipmentType: 0,
          Name: "Quilted Armor",
          RequiredStrength: 12,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 1,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Arctic Gear",
        SetPropertiesString: [
          "Cold Resist +10% (3 Items)",
          "+40% better chance of getting magic item (2 Items)"
        ],
        Name: "Arctic Binding",
        Index: "Arctic Binding",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 3,
        RequiredLevel: 2,
        Code: "vbl",
        Properties: [
          {
            PropertyString: "+30 Defense",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +40%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "3",
          EquipmentType: 0,
          Name: "Light Belt",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Arctic Gear",
        SetPropertiesString: [
          "+50 to Attack Rating (2 Items)",
          "+10 to Dexterity (3 Items)"
        ],
        Name: "Arctic Mitts",
        Index: "Arctic Mitts",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 3,
        RequiredLevel: 2,
        Code: "tgl",
        Properties: [
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+20 to Life",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "9",
          EquipmentType: 0,
          Name: "Light Gauntlets",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+5 to Strength",
        Index: 0
      },
      {
        PropertyString: "+50 to Life",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Maximum Cold Damage (Per Character Level)",
        Index: 0
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Arcanna's Tricks",
    Name: "Arcanna's Tricks",
    SetItems: [
      {
        Type: "Amulet",
        "Set": "Arcanna's Tricks",
        SetPropertiesString: [
          "Fire Resist +20% (3 Items)",
          "+50% better chance of getting magic item (2 Items)"
        ],
        Name: "Arcanna's Sign",
        Index: "Arcanna's Sign",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 20,
        RequiredLevel: 15,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+15 to Mana",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Staff",
        "Set": "Arcanna's Tricks",
        SetPropertiesString: [
          "+50 to Mana (2 Items)",
          "Regenerate Mana +5% (3 Items)"
        ],
        Name: "Arcanna's Deathwand",
        Index: "Arcanna's Deathwand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 15,
        Code: "wst",
        Properties: [
          {
            PropertyString: "+1 to Sorceress Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+25% Deadly Strike",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "12 to 28"
            }
          ],
          EquipmentType: 1,
          Name: "War Staff",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 24,
          Type: {
            Name: "Staff",
            Index: "Staff",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Arcanna's Tricks",
        SetPropertiesString: [
          "+3 Defense (Per Character Level) (2 Items)",
          "Lightning Resist +15% (3 Items)"
        ],
        Name: "Arcanna's Head",
        Index: "Arcanna's Head",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 15,
        Code: "skp",
        Properties: [
          {
            PropertyString: "+4 Replenish Life",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Damage of +2",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "8",
          EquipmentType: 0,
          Name: "Skull Cap",
          RequiredStrength: 15,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 5,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Arcanna's Tricks",
        SetPropertiesString: [
          "+100 Defense (2 Items)",
          "+10 to Energy (3 Items)"
        ],
        Name: "Arcanna's Flesh",
        Index: "Arcanna's Flesh",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 15,
        Code: "ltp",
        Properties: [
          {
            PropertyString: "Damage Reduced by 3",
            Index: 1
          },
          {
            PropertyString: "+2 to Light Radius",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "159-186",
          EquipmentType: 0,
          Name: "Light Plate",
          RequiredStrength: 41,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 35,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 to Mana",
        Index: 0
      },
      {
        PropertyString: "+50 to Life",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +12%",
        Index: 3
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 0
      },
      {
        PropertyString: "+5% Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+25 to Mana",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Natalya's Odium",
    Name: "Natalya's Odium",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Natalya's Odium",
        SetPropertiesString: [],
        Name: "Natalya's Totem",
        Index: "Natalya's Totem",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 59,
        Code: "xh9",
        Properties: [
          {
            PropertyString: "+135-175 Defense",
            Index: 0
          },
          {
            PropertyString: "+10-20 to Strength",
            Index: 2
          },
          {
            PropertyString: "+20-30 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "All Resistances +10-20%",
            Index: 3
          },
          {
            PropertyString: "Magic Damage Reduced by 3",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129",
          EquipmentType: 0,
          Name: "Grim Helm",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 50,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Hand to Hand 2",
        "Set": "Natalya's Odium",
        SetPropertiesString: [],
        Name: "Natalya's Mark",
        Index: "Natalya's Mark",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 79,
        Code: "7qr",
        Properties: [
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "+200% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "Ignore Target's Defense",
            Index: 2
          },
          {
            PropertyString: "+200% Damage to Demons",
            Index: 6
          },
          {
            PropertyString: "+200% Damage to Undead",
            Index: 5
          },
          {
            PropertyString: "Adds 12-17 to Fire Damage",
            Index: 4
          },
          {
            PropertyString: "+50 to Minimum Cold Damage",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "120 to 153"
            }
          ],
          EquipmentType: 1,
          Name: "Scissors Suwayyah",
          RequiredStrength: 118,
          RequiredDexterity: 118,
          Durability: 250,
          ItemLevel: 85,
          Type: {
            Name: "Hand to Hand 2",
            Index: "Hand to Hand 2",
            Class: "ass"
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Natalya's Odium",
        SetPropertiesString: [],
        Name: "Natalya's Shadow",
        Index: "Natalya's Shadow",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 73,
        Code: "ucl",
        Properties: [
          {
            PropertyString: "+2 to Shadow Disciplines (Assassin only)",
            Index: 2
          },
          {
            PropertyString: "+150-225 Defense",
            Index: 0
          },
          {
            PropertyString: "+1 to Life (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Poison Resist +25%",
            Index: 4
          },
          {
            PropertyString: "Poison Length Reduced by 75%",
            Index: 3
          },
          {
            PropertyString: "Socketed (1-3)",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1075-1173",
          EquipmentType: 0,
          Name: "Loricated Mail",
          RequiredStrength: 149,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 73,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Natalya's Odium",
        SetPropertiesString: [],
        Name: "Natalya's Soul",
        Index: "Natalya's Soul",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 25,
        Code: "xmb",
        Properties: [
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+75-125 Defense",
            Index: 0
          },
          {
            PropertyString: "+0.25 Heal Stamina Plus (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Cold Resist +15-25%",
            Index: 4
          },
          {
            PropertyString: "Lightning Resist +15-25%",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "23 to 52",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Mesh Boots",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 66,
          ItemLevel: 43,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Magic Damage Reduced by 15",
        Index: 0
      },
      {
        PropertyString: "+200 Defense",
        Index: 2
      },
      {
        PropertyString: "Poison Resist +20%",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Assassin Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+14% Mana stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+14% Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+150 Defense",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "+30% Physical Damage Reduction",
        Index: 5
      },
      {
        PropertyString: "You feel incorporeal...",
        Index: 6
      }
    ],
    Level: 1
  },
  {
    Index: "Aldur's Watchtower",
    Name: "Aldur's Watchtower",
    SetItems: [
      {
        Type: "Pelt",
        "Set": "Aldur's Watchtower",
        SetPropertiesString: [
          "+15 to Energy (2 Items)",
          "+15 to Energy (3 Items)",
          "+15 to Energy (4 Items)"
        ],
        Name: "Aldur's Stony Gaze",
        Index: "Aldur's Stony Gaze",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 29,
        RequiredLevel: 36,
        Code: "dr8",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "+90 Defense",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +17%",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +40-50%",
            Index: 4
          },
          {
            PropertyString: "+5 to Light Radius",
            Index: 2
          },
          {
            PropertyString: "Socketed (2)",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "157",
          EquipmentType: 0,
          Name: "Hunter's Guise",
          RequiredStrength: 56,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 46,
          Type: {
            Name: "Pelt",
            Index: "Pelt",
            Class: "dru"
          },
          RequiredClass: "Druid"
        }
      },
      {
        Type: "Armor",
        "Set": "Aldur's Watchtower",
        SetPropertiesString: [
          "+15 to Vitality (2 Items)",
          "+15 to Vitality (3 Items)",
          "+15 to Vitality (4 Items)"
        ],
        Name: "Aldur's Deception",
        Index: "Aldur's Deception",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 29,
        RequiredLevel: 76,
        Code: "uul",
        Properties: [
          {
            PropertyString: "+1 to Shape Shifting Skills (Druid only)",
            Index: 1
          },
          {
            PropertyString: "+1 to Elemental Skills (Druid only)",
            Index: 6
          },
          {
            PropertyString: "+300 Defense",
            Index: 0
          },
          {
            PropertyString: "+20 to Strength",
            Index: 2
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 3
          },
          {
            PropertyString: "Lightning Resist +40-50%",
            Index: 4
          },
          {
            PropertyString: "Requirements -50%",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1072-1162",
          EquipmentType: 0,
          Name: "Shadow Plate",
          RequiredStrength: 230,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 83,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Mace",
        "Set": "Aldur's Watchtower",
        SetPropertiesString: [
          "+15 to Strength (2 Items)",
          "+15 to Strength (3 Items)",
          "+15 to Strength (4 Items)"
        ],
        Name: "Aldur's Rhythm",
        Index: "Aldur's Rhythm",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 29,
        RequiredLevel: 42,
        Code: "9mt",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "Adds 40-62 to Damage",
            Index: 0
          },
          {
            PropertyString: "+200% Damage to Demons",
            Index: 4
          },
          {
            PropertyString: "Adds 50-75 to Lightning Damage",
            Index: 1
          },
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 5
          },
          {
            PropertyString: "+10% Life stolen per hit",
            Index: 2
          },
          {
            PropertyString: "Socketed (2-5)",
            Index: 6
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "60 to 93"
            }
          ],
          EquipmentType: 1,
          Name: "Jagged Star",
          RequiredStrength: 74,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 39,
          Type: {
            Name: "Mace",
            Index: "Mace",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Aldur's Watchtower",
        SetPropertiesString: [
          "+15 to Dexterity (2 Items)",
          "+15 to Dexterity (3 Items)",
          "+15 to Dexterity (4 Items)"
        ],
        Name: "Aldur's Advance",
        Index: "Aldur's Advance",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 29,
        RequiredLevel: 45,
        Code: "xtb",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 0
          },
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 4
          },
          {
            PropertyString: "+50 to Life",
            Index: 2
          },
          {
            PropertyString: "+32 Heal Stamina Plus",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +40-50%",
            Index: 6
          },
          {
            PropertyString: "+10% Damage Taken Goes To Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "37 to 64",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "90-100",
          EquipmentType: 0,
          Name: "Battle Boots",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 49,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+150% bonus to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Druid Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+350% Enhanced Damage",
        Index: 5
      },
      {
        PropertyString: "+10% Mana stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+150 Defense",
        Index: 2
      },
      {
        PropertyString: "+150 to Mana",
        Index: 4
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Immortal King",
    Name: "Immortal King",
    SetItems: [
      {
        Type: "Primal Helm",
        "Set": "Immortal King",
        SetPropertiesString: [],
        Name: "Immortal King's Will",
        Index: "Immortal King's Will",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 47,
        Code: "ba5",
        Properties: [
          {
            PropertyString: "+2 to Warcries (Barbarian only)",
            Index: 2
          },
          {
            PropertyString: "+125 Defense",
            Index: 0
          },
          {
            PropertyString: "+37% extra gold from monsters",
            Index: 1
          },
          {
            PropertyString: "+25-40% better chance of getting magic item",
            Index: 4
          },
          {
            PropertyString: "+4 to Light Radius",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "160",
          EquipmentType: 0,
          Name: "Avenger Guard",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 24,
          Type: {
            Name: "Primal Helm",
            Index: "Primal Helm",
            Class: "bar"
          },
          RequiredClass: "Barbarian"
        }
      },
      {
        Type: "Armor",
        "Set": "Immortal King",
        SetPropertiesString: [
          "+25% Faster Hit Recovery (2 Items)",
          "+50% Enhanced Defense (6 Items)",
          "Cold Resist +40% (3 Items)",
          "Lightning Resist +40% (5 Items)",
          "Fire Resist +40% (4 Items)"
        ],
        Name: "Immortal King's Soul Cage",
        Index: "Immortal King's Soul Cage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 76,
        Code: "uar",
        Properties: [
          {
            PropertyString: "5% Chance to cast level 5 Enchant when struck",
            Index: 1
          },
          {
            PropertyString: "+2 to Combat Skills (Barbarian only)",
            Index: 2
          },
          {
            PropertyString: "+400 Defense",
            Index: 0
          },
          {
            PropertyString: "Poison Resist +50%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1171-1415",
          EquipmentType: 0,
          Name: "Sacred Armor",
          RequiredStrength: 232,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 85,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Immortal King",
        SetPropertiesString: [
          "+2 to Masteries and Throwing Skills (Barbarian only) (6 Items)",
          "+25% Faster Hit Recovery (3 Items)",
          "+100% Enhanced Defense (4 Items)",
          "+105 Defense (2 Items)",
          "+20% Physical Damage Reduction (5 Items)"
        ],
        Name: "Immortal King's Detail",
        Index: "Immortal King's Detail",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 29,
        Code: "zhb",
        Properties: [
          {
            PropertyString: "+36 Defense",
            Index: 0
          },
          {
            PropertyString: "+25 to Strength",
            Index: 3
          },
          {
            PropertyString: "Lightning Resist +31%",
            Index: 2
          },
          {
            PropertyString: "Fire Resist +28%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "41",
          EquipmentType: 0,
          Name: "War Belt",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Immortal King",
        SetPropertiesString: [
          "+25% Increased Attack Speed (2 Items)",
          "+10% Mana stolen per hit (5 Items)",
          "+10% Life stolen per hit (4 Items)",
          "Freezes target +2 (6 Items)",
          "+120 Defense (3 Items)"
        ],
        Name: "Immortal King's Forge",
        Index: "Immortal King's Forge",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 30,
        Code: "xhg",
        Properties: [
          {
            PropertyString: "12% Chance to cast level 4 Charged Bolt when struck",
            Index: 3
          },
          {
            PropertyString: "+65 Defense",
            Index: 0
          },
          {
            PropertyString: "+20 to Strength",
            Index: 1
          },
          {
            PropertyString: "+20 to Dexterity",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "121-132",
          EquipmentType: 0,
          Name: "War Gauntlets",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Immortal King",
        SetPropertiesString: [
          "+2 to Combat Skills (Barbarian only) (3 Items)",
          "+160 Defense (4 Items)",
          "Half Freeze Duration (5 Items)",
          "+25% better chance of getting magic item (2 Items)"
        ],
        Name: "Immortal King's Pillar",
        Index: "Immortal King's Pillar",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 31,
        Code: "xhb",
        Properties: [
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+110 to Attack Rating",
            Index: 2
          },
          {
            PropertyString: "+75 Defense",
            Index: 0
          },
          {
            PropertyString: "+44 to Life",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "39 to 80",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "88-99",
          EquipmentType: 0,
          Name: "War Boots",
          RequiredStrength: 125,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Hammer",
        "Set": "Immortal King",
        SetPropertiesString: [
          "Adds 250-361 to Magic Damage (6 Items)",
          "Adds 211-397 to Fire Damage (2 Items)",
          "Adds 7-477 to Lightning Damage (3 Items)",
          "Adds 127-364 to Cold Damage (4 Items)",
          "+205 Poison Damage Over 6 Seconds (5 Items)"
        ],
        Name: "Immortal King's Stone Crusher",
        Index: "Immortal King's Stone Crusher",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 37,
        RequiredLevel: 76,
        Code: "7m7",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 0
          },
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+200% Enhanced Damage",
            Index: 5
          },
          {
            PropertyString: "+200% Damage to Demons",
            Index: 2
          },
          {
            PropertyString: "+200% Damage to Undead",
            Index: 3
          },
          {
            PropertyString: "+35-40% Chance of Crushing Blow",
            Index: 4
          },
          {
            PropertyString: "Socketed (2)",
            Index: 6
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "231 to 318"
            }
          ],
          EquipmentType: 1,
          Name: "Ogre Maul",
          RequiredStrength: 225,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 69,
          Type: {
            Name: "Hammer",
            Index: "Hammer",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+75 to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+125 to Attack Rating",
        Index: 4
      },
      {
        PropertyString: "+200 to Attack Rating",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Barbarian Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+150 to Life",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "Magic Damage Reduced by 10",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Tal Rasha's Wrappings",
    Name: "Tal Rasha's Wrappings",
    SetItems: [
      {
        Type: "Belt",
        "Set": "Tal Rasha's Wrappings",
        SetPropertiesString: [
          "+10% Faster Cast Rate (3 Items)",
          "+60 Defense (2 Items)"
        ],
        Name: "Tal Rasha's Fine-Spun Cloth",
        Index: "Tal Rasha's Fine-Spun Cloth",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 26,
        RequiredLevel: 53,
        Code: "zmb",
        Properties: [
          {
            PropertyString: "+20 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "+30 to Mana",
            Index: 1
          },
          {
            PropertyString: "+37% Damage Taken Goes To Mana",
            Index: 3
          },
          {
            PropertyString: "+10-15% better chance of getting magic item",
            Index: 4
          },
          {
            PropertyString: "Requirements -20%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "35",
          EquipmentType: 0,
          Name: "Mesh Belt",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Tal Rasha's Wrappings",
        SetPropertiesString: [
          "+10% Faster Cast Rate (4 Items)"
        ],
        Name: "Tal Rasha's Adjudication",
        Index: "Tal Rasha's Adjudication",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 26,
        RequiredLevel: 67,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+2 to Sorceress Skill Levels",
            Index: 1
          },
          {
            PropertyString: "Adds 3-32 to Lightning Damage",
            Index: 3
          },
          {
            PropertyString: "+50 to Life",
            Index: 2
          },
          {
            PropertyString: "+42 to Mana",
            Index: 4
          },
          {
            PropertyString: "Lightning Resist +33%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Orb",
        "Set": "Tal Rasha's Wrappings",
        SetPropertiesString: [
          "+1 to Sorceress Skill Levels (2 Items)",
          "-15% to Enemy Fire Resistance (3 Items)",
          "-15% to Enemy Lightning Resistance (4 Items)",
          "+15% to Cold Skill Damage (5 Items)"
        ],
        Name: "Tal Rasha's Lidless Eye",
        Index: "Tal Rasha's Lidless Eye",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 26,
        RequiredLevel: 65,
        Code: "oba",
        Properties: [
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "+1-2 to Fire Mastery (Sorceress Only)",
            Index: 4
          },
          {
            PropertyString: "+1-2 to Lightning Mastery (Sorceress Only)",
            Index: 5
          },
          {
            PropertyString: "+1-2 to Cold Mastery (Sorceress Only)",
            Index: 6
          },
          {
            PropertyString: "+10 to Energy",
            Index: 2
          },
          {
            PropertyString: "+57 to Life",
            Index: 0
          },
          {
            PropertyString: "+77 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "18 to 42"
            }
          ],
          EquipmentType: 1,
          Name: "Swirling Crystal",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 50,
          Type: {
            Name: "Orb",
            Index: "Orb",
            Class: "sor"
          },
          RequiredClass: "Sorceress"
        }
      },
      {
        Type: "Armor",
        "Set": "Tal Rasha's Wrappings",
        SetPropertiesString: [
          "+10% Faster Cast Rate (2 Items)"
        ],
        Name: "Tal Rasha's Guardianship",
        Index: "Tal Rasha's Guardianship",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 26,
        RequiredLevel: 71,
        Code: "uth",
        Properties: [
          {
            PropertyString: "+400 Defense",
            Index: 6
          },
          {
            PropertyString: "Cold Resist +40%",
            Index: 3
          },
          {
            PropertyString: "Lightning Resist +40%",
            Index: 5
          },
          {
            PropertyString: "Fire Resist +40%",
            Index: 4
          },
          {
            PropertyString: "Magic Damage Reduced by 15",
            Index: 1
          },
          {
            PropertyString: "+88% better chance of getting magic item",
            Index: 2
          },
          {
            PropertyString: "Requirements -60%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "433",
          EquipmentType: 0,
          Name: "Lacquered Plate",
          RequiredStrength: 208,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 82,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Tal Rasha's Wrappings",
        SetPropertiesString: [],
        Name: "Tal Rasha's Horadric Crest",
        Index: "Tal Rasha's Horadric Crest",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 26,
        RequiredLevel: 66,
        Code: "xsk",
        Properties: [
          {
            PropertyString: "+10% Mana stolen per hit",
            Index: 5
          },
          {
            PropertyString: "+10% Life stolen per hit",
            Index: 4
          },
          {
            PropertyString: "+45 Defense",
            Index: 2
          },
          {
            PropertyString: "+60 to Life",
            Index: 1
          },
          {
            PropertyString: "+30 to Mana",
            Index: 0
          },
          {
            PropertyString: "All Resistances +15%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129-154",
          EquipmentType: 0,
          Name: "Death Mask",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 48,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+65% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Sorceress Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+150 Defense",
        Index: 2
      },
      {
        PropertyString: "+50 Defense vs. Missile",
        Index: 4
      },
      {
        PropertyString: "+150 to Life",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Griswold's Legacy",
    Name: "Griswold's Legacy",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Griswold's Legacy",
        SetPropertiesString: [
          "+2 to Offensive Auras (Paladin only) (2 Items)"
        ],
        Name: "Griswold's Valor",
        Index: "Griswold's Valor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 44,
        RequiredLevel: 69,
        Code: "urn",
        Properties: [
          {
            PropertyString: "+50-75% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +5%",
            Index: 5
          },
          {
            PropertyString: "+0.25 Absorbs Cold Damage (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+20-30% better chance of getting magic item",
            Index: 4
          },
          {
            PropertyString: "Requirements -40%",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "263-308",
          EquipmentType: 0,
          Name: "Corona",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 85,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Griswold's Legacy",
        SetPropertiesString: [],
        Name: "Griswold's Heart",
        Index: "Griswold's Heart",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 44,
        RequiredLevel: 45,
        Code: "xar",
        Properties: [
          {
            PropertyString: "+2 to Defensive Auras (Paladin only)",
            Index: 1
          },
          {
            PropertyString: "+500 Defense",
            Index: 0
          },
          {
            PropertyString: "+20 to Strength",
            Index: 3
          },
          {
            PropertyString: "Requirements -40%",
            Index: 4
          },
          {
            PropertyString: "Socketed (3)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1045-1170",
          EquipmentType: 0,
          Name: "Ornate Plate",
          RequiredStrength: 170,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 64,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Griswold's Legacy",
        SetPropertiesString: [
          "+2 to Combat Skills (Paladin only) (2 Items)",
          "Adds 10-20 to Damage (3 Items)",
          "Adds 10-20 to Damage (4 Items)"
        ],
        Name: "Griswold's Redemption",
        Index: "Griswold's Redemption",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 44,
        RequiredLevel: 53,
        Code: "7ws",
        Properties: [
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+200-240% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+200% Damage to Undead",
            Index: 2
          },
          {
            PropertyString: "Requirements -20%",
            Index: 3
          },
          {
            PropertyString: "Socketed (3-4)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(111-125) to (129-146)"
            }
          ],
          EquipmentType: 1,
          Name: "Caduceus",
          RequiredStrength: 97,
          RequiredDexterity: 70,
          Durability: 250,
          ItemLevel: 85,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Auric Shields",
        "Set": "Griswold's Legacy",
        SetPropertiesString: [],
        Name: "Griswold's Honor",
        Index: "Griswold's Honor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 44,
        RequiredLevel: 68,
        Code: "paf",
        Properties: [
          {
            PropertyString: "+65% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+20% Increased Chance of Blocking",
            Index: 3
          },
          {
            PropertyString: "+108 Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +45%",
            Index: 4
          },
          {
            PropertyString: "Socketed (3)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "5 to 87",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "290",
          EquipmentType: 0,
          Name: "Vortex Shield",
          RequiredStrength: 148,
          RequiredDexterity: 0,
          Durability: 90,
          ItemLevel: 85,
          Type: {
            Name: "Auric Shields",
            Index: "Auric Shields",
            Class: "pal"
          },
          RequiredClass: "Paladin"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20 to Strength",
        Index: 0
      },
      {
        PropertyString: "+30 to Dexterity",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Paladin Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 5
      },
      {
        PropertyString: "+200 to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+150 to Life",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Trang-Oul's Avatar",
    Name: "Trang-Oul's Avatar",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Trang-Oul's Avatar",
        SetPropertiesString: [],
        Name: "Trang-Oul's Guise",
        Index: "Trang-Oul's Guise",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 65,
        Code: "uh9",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+80-100 Defense",
            Index: 0
          },
          {
            PropertyString: "+5 Replenish Life",
            Index: 4
          },
          {
            PropertyString: "+150 to Mana",
            Index: 3
          },
          {
            PropertyString: "Attacker Takes Damage of +20",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "252-303",
          EquipmentType: 0,
          Name: "Bone Visage",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 84,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Trang-Oul's Avatar",
        SetPropertiesString: [
          "Lightning Resist +50% (3 Items)",
          "+25% Physical Damage Reduction (5 Items)"
        ],
        Name: "Trang-Oul's Scales",
        Index: "Trang-Oul's Scales",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 49,
        Code: "xul",
        Properties: [
          {
            PropertyString: "+2 to Summoning Skills (Necromancer only)",
            Index: 3
          },
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 4
          },
          {
            PropertyString: "+150% Enhanced Defense",
            Index: 5
          },
          {
            PropertyString: "+100 Defense vs. Missile",
            Index: 1
          },
          {
            PropertyString: "Poison Resist +40%",
            Index: 2
          },
          {
            PropertyString: "Requirements -40%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "615-715",
          EquipmentType: 0,
          Name: "Chaos Armor",
          RequiredStrength: 140,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 61,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Voodoo Heads",
        "Set": "Trang-Oul's Avatar",
        SetPropertiesString: [
          "-25% to Enemy Poison Resistance (3 Items)",
          "+15 Replenish Life (4 Items)"
        ],
        Name: "Trang-Oul's Wing",
        Index: "Trang-Oul's Wing",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 54,
        Code: "ne9",
        Properties: [
          {
            PropertyString: "+2 to Poison and Bone Skills (Necromancer only)",
            Index: 6
          },
          {
            PropertyString: "+30% Increased Chance of Blocking",
            Index: 4
          },
          {
            PropertyString: "+125 Defense",
            Index: 0
          },
          {
            PropertyString: "+25 to Strength",
            Index: 1
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "Fire Resist +38-45%",
            Index: 3
          },
          {
            PropertyString: "Poison Resist +40%",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "175",
          EquipmentType: 0,
          Name: "Cantor Trophy",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 49,
          Type: {
            Name: "Voodoo Heads",
            Index: "Voodoo Heads",
            Class: "nec"
          },
          RequiredClass: "Necromancer"
        }
      },
      {
        Type: "Gloves",
        "Set": "Trang-Oul's Avatar",
        SetPropertiesString: [],
        Name: "Trang-Oul's Claws",
        Index: "Trang-Oul's Claws",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 45,
        Code: "xmg",
        Properties: [
          {
            PropertyString: "+2 to Curses (Necromancer only)",
            Index: 3
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+30 Defense",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +30%",
            Index: 2
          },
          {
            PropertyString: "+25% to Poison Skill Damage",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Heavy Bracers",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Trang-Oul's Avatar",
        SetPropertiesString: [
          "Cold Resist +40% (3 Items)"
        ],
        Name: "Trang-Oul's Girth",
        Index: "Trang-Oul's Girth",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 47,
        Code: "utc",
        Properties: [
          {
            PropertyString: "+75-100 Defense",
            Index: 0
          },
          {
            PropertyString: "+66 to Life",
            Index: 3
          },
          {
            PropertyString: "+5 Replenish Life",
            Index: 2
          },
          {
            PropertyString: "+25-50 to Mana",
            Index: 6
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 4
          },
          {
            PropertyString: "Requirements -40%",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "126-138",
          EquipmentType: 0,
          Name: "Troll Belt",
          RequiredStrength: 151,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 82,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 0
      },
      {
        PropertyString: "+18 to Fire Ball",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 2
      },
      {
        PropertyString: "+13 to Fire Wall",
        Index: 3
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 4
      },
      {
        PropertyString: "+10 to Meteor",
        Index: 5
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Necromancer Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+3 to Fire Mastery",
        Index: 6
      },
      {
        PropertyString: "+20% Life stolen per hit",
        Index: 7
      },
      {
        PropertyString: "+200 Defense",
        Index: 3
      },
      {
        PropertyString: "+100 to Mana",
        Index: 2
      },
      {
        PropertyString: "Regenerate Mana +15%",
        Index: 5
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "M'avina's Battle Hymn",
    Name: "M'avina's Battle Hymn",
    SetItems: [
      {
        Type: "Circlet",
        "Set": "M'avina's Battle Hymn",
        SetPropertiesString: [
          "+1 to All Skills (2 Items)",
          "+50% bonus to Attack Rating (3 Items)",
          "All Resistances +25% (4 Items)"
        ],
        Name: "M'avina's True Sight",
        Index: "M'avina's True Sight",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 59,
        Code: "ci3",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+150 Defense",
            Index: 0
          },
          {
            PropertyString: "+10 Replenish Life",
            Index: 1
          },
          {
            PropertyString: "+25 to Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "200",
          EquipmentType: 0,
          Name: "Diadem",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 85,
          Type: {
            Name: "Circlet",
            Index: "Circlet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "M'avina's Battle Hymn",
        SetPropertiesString: [
          "+30% Faster Hit Recovery (3 Items)"
        ],
        Name: "M'avina's Embrace",
        Index: "M'avina's Embrace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 70,
        Code: "uld",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 3 Glacial Spike when struck",
            Index: 0
          },
          {
            PropertyString: "+2 to Passive and Magic Skills (Amazon only)",
            Index: 3
          },
          {
            PropertyString: "+4 Defense (Per Character Level)",
            Index: 4
          },
          {
            PropertyString: "+350 Defense",
            Index: 5
          },
          {
            PropertyString: "Magic Damage Reduced by 5",
            Index: 2
          },
          {
            PropertyString: "Requirements -30%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "417",
          EquipmentType: 0,
          Name: "Kraken Shell",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 81,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "M'avina's Battle Hymn",
        SetPropertiesString: [
          "Adds 131-252 to Cold Damage (4 Items)",
          "+20% to Cold Skill Damage (5 Items)"
        ],
        Name: "M'avina's Icy Clutch",
        Index: "M'avina's Icy Clutch",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 32,
        Code: "xtg",
        Properties: [
          {
            PropertyString: "Adds 6-18 to Cold Damage",
            Index: 1
          },
          {
            PropertyString: "+45-50 Defense",
            Index: 0
          },
          {
            PropertyString: "+10 to Strength",
            Index: 4
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 5
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 2
          },
          {
            PropertyString: "+56% extra gold from monsters",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "140",
          EquipmentType: 0,
          Name: "Battle Gauntlets",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "M'avina's Battle Hymn",
        SetPropertiesString: [
          "All Resistances +25% (4 Items)"
        ],
        Name: "M'avina's Tenet",
        Index: "M'avina's Tenet",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 45,
        Code: "zvb",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+50 Defense",
            Index: 0
          },
          {
            PropertyString: "+5 to Light Radius",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "73-83",
          EquipmentType: 0,
          Name: "Sharkskin Belt",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amazon Bow",
        "Set": "M'avina's Battle Hymn",
        SetPropertiesString: [
          "10% Chance to cast level 15 Nova on striking (3 Items)",
          "+2 to Bow and Crossbow Skills (Amazon only) (4 Items)",
          "Adds 114-377 to Magic Damage (2 Items)"
        ],
        Name: "M'avina's Caster",
        Index: "M'avina's Caster",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 21,
        RequiredLevel: 70,
        Code: "amc",
        Properties: [
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+188% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+1 Fires Magic Arrows",
            Index: 2
          },
          {
            PropertyString: "+50 to Attack Rating",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "40 to 207"
            }
          ],
          EquipmentType: 1,
          Name: "Grand Matron Bow",
          RequiredStrength: 108,
          RequiredDexterity: 152,
          Durability: 0,
          ItemLevel: 78,
          Type: {
            Name: "Amazon Bow",
            Index: "Amazon Bow",
            Class: "ama"
          },
          RequiredClass: "Amazon"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20 to Strength",
        Index: 0
      },
      {
        PropertyString: "+30 to Dexterity",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to Amazon Skill Levels",
        Index: 1
      },
      {
        PropertyString: "+100 to Attack Rating",
        Index: 3
      },
      {
        PropertyString: "+100 Defense",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "The Disciple",
    Name: "The Disciple",
    SetItems: [
      {
        Type: "Amulet",
        "Set": "The Disciple",
        SetPropertiesString: [],
        Name: "Telling of Beads",
        Index: "Telling of Beads",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 39,
        RequiredLevel: 30,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +18%",
            Index: 2
          },
          {
            PropertyString: "Poison Resist +35-50%",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Damage of +8-10",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "The Disciple",
        SetPropertiesString: [],
        Name: "Laying of Hands",
        Index: "Laying of Hands",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 39,
        RequiredLevel: 63,
        Code: "ulg",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 3 Holy Bolt on striking",
            Index: 4
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+350% Damage to Demons",
            Index: 3
          },
          {
            PropertyString: "+25 Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +50%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54",
          EquipmentType: 0,
          Name: "Bramble Mitts",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 57,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "The Disciple",
        SetPropertiesString: [],
        Name: "Rite of Passage",
        Index: "Rite of Passage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 39,
        RequiredLevel: 29,
        Code: "xlb",
        Properties: [
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+25 Defense",
            Index: 0
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "26 to 46",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "28",
          EquipmentType: 0,
          Name: "Demonhide Boots",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "The Disciple",
        SetPropertiesString: [],
        Name: "Dark Adherent",
        Index: "Dark Adherent",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 39,
        RequiredLevel: 43,
        Code: "uui",
        Properties: [
          {
            PropertyString: "25% Chance to cast level 3 Nova when struck",
            Index: 2
          },
          {
            PropertyString: "Adds 25-35 Poison Damage Over 2 Seconds",
            Index: 3
          },
          {
            PropertyString: "+305-415 Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +24%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361",
          EquipmentType: 0,
          Name: "Dusk Shroud",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 65,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "The Disciple",
        SetPropertiesString: [],
        Name: "Credendum",
        Index: "Credendum",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 39,
        RequiredLevel: 65,
        Code: "umc",
        Properties: [
          {
            PropertyString: "+50 Defense",
            Index: 0
          },
          {
            PropertyString: "+10 to Strength",
            Index: 1
          },
          {
            PropertyString: "+10 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "All Resistances +15%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "58",
          EquipmentType: 0,
          Name: "Mithril Coil",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 75,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+150 Defense",
        Index: 0
      },
      {
        PropertyString: "+22 Poison Damage Over 3 Seconds",
        Index: 2
      },
      {
        PropertyString: "+10 to Strength",
        Index: 4
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+100 to Mana",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Heaven's Brethren",
    Name: "Heaven's Brethren",
    SetItems: [
      {
        Type: "Mace",
        "Set": "Heaven's Brethren",
        SetPropertiesString: [],
        Name: "Dangoon's Teaching",
        Index: "Dangoon's Teaching",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 55,
        RequiredLevel: 68,
        Code: "7ma",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 3 Frost Nova on striking",
            Index: 2
          },
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+1.5 to Maximum Damage (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+20-30 to Minimum Fire Damage",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "41 to 49"
            }
          ],
          EquipmentType: 1,
          Name: "Reinforced Mace",
          RequiredStrength: 145,
          RequiredDexterity: 46,
          Durability: 250,
          ItemLevel: 63,
          Type: {
            Name: "Mace",
            Index: "Mace",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Heaven's Brethren",
        SetPropertiesString: [],
        Name: "Taebaek's Glory",
        Index: "Taebaek's Glory",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 55,
        RequiredLevel: 81,
        Code: "uts",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 4
          },
          {
            PropertyString: "+30% Faster Block Rate",
            Index: 6
          },
          {
            PropertyString: "+25% Increased Chance of Blocking",
            Index: 5
          },
          {
            PropertyString: "+50 Defense",
            Index: 0
          },
          {
            PropertyString: "+100 to Mana",
            Index: 1
          },
          {
            PropertyString: "Lightning Resist +30%",
            Index: 2
          },
          {
            PropertyString: "Attacker Takes Damage of +30",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "11 to 35",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "203",
          EquipmentType: 0,
          Name: "Ward",
          RequiredStrength: 185,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 84,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Heaven's Brethren",
        SetPropertiesString: [],
        Name: "Haemosu's Adamant",
        Index: "Haemosu's Adamant",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 55,
        RequiredLevel: 44,
        Code: "xrs",
        Properties: [
          {
            PropertyString: "+500 Defense",
            Index: 0
          },
          {
            PropertyString: "+40 Defense vs. Melee",
            Index: 3
          },
          {
            PropertyString: "+35 Defense vs. Missile",
            Index: 1
          },
          {
            PropertyString: "+75 to Life",
            Index: 2
          },
          {
            PropertyString: "Requirements -20%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "688",
          EquipmentType: 0,
          Name: "Cuirass",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 47,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Heaven's Brethren",
        SetPropertiesString: [],
        Name: "Ondal's Almighty",
        Index: "Ondal's Almighty",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 55,
        RequiredLevel: 69,
        Code: "uhm",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 3 Weaken on striking",
            Index: 2
          },
          {
            PropertyString: "+24% Faster Hit Recovery",
            Index: 5
          },
          {
            PropertyString: "+50 Defense",
            Index: 0
          },
          {
            PropertyString: "+10 to Strength",
            Index: 3
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 4
          },
          {
            PropertyString: "Requirements -40%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "293-327",
          EquipmentType: 0,
          Name: "Spired Helm",
          RequiredStrength: 192,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 79,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 0
      },
      {
        PropertyString: "+30 Replenish Life",
        Index: 2
      },
      {
        PropertyString: "+3 to Maximum Fire Damage (Per Character Level)",
        Index: 3
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 1
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "+24% Physical Damage Reduction",
        Index: 4
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 2
      },
      {
        PropertyString: "+5 to Light Radius",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Orphan's Call",
    Name: "Orphan's Call",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Orphan's Call",
        SetPropertiesString: [],
        Name: "Guillaume's Face",
        Index: "Guillaume's Face",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 41,
        RequiredLevel: 34,
        Code: "xhm",
        Properties: [
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+35% Chance of Crushing Blow",
            Index: 2
          },
          {
            PropertyString: "+15% Deadly Strike",
            Index: 3
          },
          {
            PropertyString: "+120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Strength",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "189-232",
          EquipmentType: 0,
          Name: "Winged Helm",
          RequiredStrength: 115,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 51,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Orphan's Call",
        SetPropertiesString: [],
        Name: "Wilhelm's Pride",
        Index: "Wilhelm's Pride",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 41,
        RequiredLevel: 42,
        Code: "ztb",
        Properties: [
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 1
          },
          {
            PropertyString: "+5% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+75% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +10%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "66-83",
          EquipmentType: 0,
          Name: "Battle Belt",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Orphan's Call",
        SetPropertiesString: [],
        Name: "Magnus' Skin",
        Index: "Magnus' Skin",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 41,
        RequiredLevel: 37,
        Code: "xvg",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+100 to Attack Rating",
            Index: 4
          },
          {
            PropertyString: "+50% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +15%",
            Index: 1
          },
          {
            PropertyString: "+3 to Light Radius",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "51",
          EquipmentType: 0,
          Name: "Sharkskin Gloves",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Orphan's Call",
        SetPropertiesString: [],
        Name: "Whitstan's Guard",
        Index: "Whitstan's Guard",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 41,
        RequiredLevel: 29,
        Code: "xml",
        Properties: [
          {
            PropertyString: "+40% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+55% Increased Chance of Blocking",
            Index: 2
          },
          {
            PropertyString: "+175% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 3
          },
          {
            PropertyString: "+5 to Light Radius",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "7 to 14",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "132",
          EquipmentType: 0,
          Name: "Round Shield",
          RequiredStrength: 53,
          RequiredDexterity: 0,
          Durability: 64,
          ItemLevel: 37,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+35 to Life",
        Index: 0
      },
      {
        PropertyString: "Attacker Takes Damage of +5",
        Index: 2
      },
      {
        PropertyString: "+100 Defense",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+100 Defense",
        Index: 3
      },
      {
        PropertyString: "+20 to Strength",
        Index: 2
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 1
      },
      {
        PropertyString: "+50 to Life",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 4
      },
      {
        PropertyString: "+80% better chance of getting magic item",
        Index: 5
      }
    ],
    Level: 1
  },
  {
    Index: "Hwanin's Majesty",
    Name: "Hwanin's Majesty",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Hwanin's Majesty",
        SetPropertiesString: [],
        Name: "Hwanin's Splendor",
        Index: "Hwanin's Splendor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 45,
        Code: "xrn",
        Properties: [
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 3
          },
          {
            PropertyString: "+20 Replenish Life",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +37%",
            Index: 2
          },
          {
            PropertyString: "Magic Damage Reduced by 10",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "158",
          EquipmentType: 0,
          Name: "Grand Crown",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 55,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Hwanin's Majesty",
        SetPropertiesString: [],
        Name: "Hwanin's Refuge",
        Index: "Hwanin's Refuge",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 30,
        Code: "xcl",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 3 Static Field when struck",
            Index: 3
          },
          {
            PropertyString: "+200 Defense",
            Index: 0
          },
          {
            PropertyString: "+100 to Life",
            Index: 2
          },
          {
            PropertyString: "Poison Resist +27%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "477-548",
          EquipmentType: 0,
          Name: "Tigulated Mail",
          RequiredStrength: 86,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 43,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Hwanin's Majesty",
        SetPropertiesString: [],
        Name: "Hwanin's Blessing",
        Index: "Hwanin's Blessing",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 35,
        Code: "mbl",
        Properties: [
          {
            PropertyString: "Adds 3-33 to Lightning Damage",
            Index: 0
          },
          {
            PropertyString: "Prevent Monster Heal",
            Index: 1
          },
          {
            PropertyString: "+1.5 Defense (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "+12% Damage Taken Goes To Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "5",
          EquipmentType: 0,
          Name: "Belt",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Polearm",
        "Set": "Hwanin's Majesty",
        SetPropertiesString: [],
        Name: "Hwanin's Justice",
        Index: "Hwanin's Justice",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 28,
        Code: "9vo",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 1
          },
          {
            PropertyString: "10% Chance to cast level 3 Ice Blast on striking",
            Index: 2
          },
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+200% Enhanced Damage",
            Index: 4
          },
          {
            PropertyString: "+330 to Attack Rating",
            Index: 0
          },
          {
            PropertyString: "Adds 5-25 to Lightning Damage",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "42 to 159"
            }
          ],
          EquipmentType: 1,
          Name: "Bill",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 37,
          Type: {
            Name: "Polearm",
            Index: "Polearm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+100 Defense",
        Index: 0
      },
      {
        PropertyString: "+200 Defense",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "+20% Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Sazabi's Grand Tribute",
    Name: "Sazabi's Grand Tribute",
    SetItems: [
      {
        Type: "Sword",
        "Set": "Sazabi's Grand Tribute",
        SetPropertiesString: [],
        Name: "Sazabi's Cobalt Redeemer",
        Index: "Sazabi's Cobalt Redeemer",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 34,
        RequiredLevel: 73,
        Code: "7ls",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 4
          },
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+150% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+318% Damage to Demons",
            Index: 3
          },
          {
            PropertyString: "Adds 25-35 to Cold Damage",
            Index: 1
          },
          {
            PropertyString: "+5 to Strength",
            Index: 6
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "12 to 192"
            }
          ],
          EquipmentType: 1,
          Name: "Cryptic Sword",
          RequiredStrength: 99,
          RequiredDexterity: 109,
          Durability: 0,
          ItemLevel: 82,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Sazabi's Grand Tribute",
        SetPropertiesString: [],
        Name: "Sazabi's Ghost Liberator",
        Index: "Sazabi's Ghost Liberator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 34,
        RequiredLevel: 67,
        Code: "upl",
        Properties: [
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+300 to Attack Rating against Demons",
            Index: 3
          },
          {
            PropertyString: "+400 Defense",
            Index: 0
          },
          {
            PropertyString: "+25 to Strength",
            Index: 2
          },
          {
            PropertyString: "+50-75 to Life",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1068-1233",
          EquipmentType: 0,
          Name: "Balrog Skin",
          RequiredStrength: 165,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 76,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Sazabi's Grand Tribute",
        SetPropertiesString: [],
        Name: "Sazabi's Mental Sheath",
        Index: "Sazabi's Mental Sheath",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 34,
        RequiredLevel: 43,
        Code: "xhl",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 1
          },
          {
            PropertyString: "+100 Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +15-20%",
            Index: 3
          },
          {
            PropertyString: "Fire Resist +15-20%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "205-228",
          EquipmentType: 0,
          Name: "Basinet",
          RequiredStrength: 82,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 45,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+40% Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "Poison Length Reduced by 75%",
        Index: 1
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 3
      },
      {
        PropertyString: "+15% Life stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+27% Increased Maximum Life",
        Index: 2
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 0
      },
      {
        PropertyString: "+16% Physical Damage Reduction",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Bul-Kathos' Children",
    Name: "Bul-Kathos' Children",
    SetItems: [
      {
        Type: "Sword",
        "Set": "Bul-Kathos' Children",
        SetPropertiesString: [],
        Name: "Bul-Kathos' Sacred Charge",
        Index: "Bul-Kathos' Sacred Charge",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 50,
        RequiredLevel: 61,
        Code: "7gd",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+200% Enhanced Damage",
            Index: 3
          },
          {
            PropertyString: "+35% Chance of Crushing Blow",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "75 to 195"
            },
            {
              Type: 1,
              DamageString: "174 to 345"
            }
          ],
          EquipmentType: 1,
          Name: "Colossus Blade",
          RequiredStrength: 189,
          RequiredDexterity: 110,
          Durability: 250,
          ItemLevel: 85,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Bul-Kathos' Children",
        SetPropertiesString: [],
        Name: "Bul-Kathos' Tribal Guardian",
        Index: "Bul-Kathos' Tribal Guardian",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 50,
        RequiredLevel: 54,
        Code: "7wd",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+200% Enhanced Damage",
            Index: 4
          },
          {
            PropertyString: "+50 Poison Damage Over 2 Seconds",
            Index: 1
          },
          {
            PropertyString: "+20 to Strength",
            Index: 3
          },
          {
            PropertyString: "Fire Resist +50%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "120 to 150"
            }
          ],
          EquipmentType: 1,
          Name: "Mythical Sword",
          RequiredStrength: 147,
          RequiredDexterity: 124,
          Durability: 250,
          ItemLevel: 85,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 1
      },
      {
        PropertyString: "+200 to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "+200% Damage to Demons",
        Index: 5
      },
      {
        PropertyString: "+200% Damage to Undead",
        Index: 4
      },
      {
        PropertyString: "+200 to Minimum Fire Damage",
        Index: 0
      },
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 6
      },
      {
        PropertyString: "+20% Deadly Strike",
        Index: 7
      },
      {
        PropertyString: "+200 Defense",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Cow King's Leathers",
    Name: "Cow King's Leathers",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Cow King's Leathers",
        SetPropertiesString: [],
        Name: "Cow King's Horns",
        Index: "Cow King's Horns",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 25,
        Code: "xap",
        Properties: [
          {
            PropertyString: "+75 Defense",
            Index: 0
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 1
          },
          {
            PropertyString: "Attacker Takes Damage of +10",
            Index: 3
          },
          {
            PropertyString: "+35% Damage Taken Goes To Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "80-92",
          EquipmentType: 0,
          Name: "War Hat",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 34,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Cow King's Leathers",
        SetPropertiesString: [],
        Name: "Cow King's Hide",
        Index: "Cow King's Hide",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 18,
        Code: "stu",
        Properties: [
          {
            PropertyString: "18% Chance to cast level 5 Chain Lightning when struck",
            Index: 3
          },
          {
            PropertyString: "+60% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+30 to Life",
            Index: 2
          },
          {
            PropertyString: "All Resistances +18%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "67-82",
          EquipmentType: 0,
          Name: "Studded Leather",
          RequiredStrength: 27,
          RequiredDexterity: 0,
          Durability: 32,
          ItemLevel: 8,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Cow King's Leathers",
        SetPropertiesString: [],
        Name: "Cow King's Hooves",
        Index: "Cow King's Hooves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 13,
        Code: "vbt",
        Properties: [
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "Adds 25-35 to Fire Damage",
            Index: 4
          },
          {
            PropertyString: "+25-35 Defense",
            Index: 0
          },
          {
            PropertyString: "+20 to Dexterity",
            Index: 3
          },
          {
            PropertyString: "+25% better chance of getting magic item",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "4 to 10",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "30-40",
          EquipmentType: 0,
          Name: "Heavy Boots",
          RequiredStrength: 18,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Tectonic Slam",
        Index: 0
      },
      {
        PropertyString: "+100 Defense",
        Index: 1
      }
    ],
    FullProperties: [
      {
        PropertyString: "25% Chance to cast level 5 Static Field when struck",
        Index: 4
      },
      {
        PropertyString: "+2-3 to All Skills",
        Index: 7
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 5
      },
      {
        PropertyString: "+20 to Strength",
        Index: 1
      },
      {
        PropertyString: "+100 to Life",
        Index: 6
      },
      {
        PropertyString: "+100% extra gold from monsters",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Naj's Ancient Vestige",
    Name: "Naj's Ancient Vestige",
    SetItems: [
      {
        Type: "Staff",
        "Set": "Naj's Ancient Vestige",
        SetPropertiesString: [],
        Name: "Naj's Puzzler",
        Index: "Naj's Puzzler",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 43,
        RequiredLevel: 78,
        Code: "6cs",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 6
          },
          {
            PropertyString: "+150% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+30% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "Adds 6-45 to Lightning Damage",
            Index: 4
          },
          {
            PropertyString: "+35 to Energy",
            Index: 0
          },
          {
            PropertyString: "+70 to Mana",
            Index: 5
          },
          {
            PropertyString: "Level 11 Teleport (69 Charges)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "200 to 232"
            }
          ],
          EquipmentType: 1,
          Name: "Elder Staff",
          RequiredStrength: 44,
          RequiredDexterity: 37,
          Durability: 250,
          ItemLevel: 74,
          Type: {
            Name: "Staff",
            Index: "Staff",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Naj's Ancient Vestige",
        SetPropertiesString: [],
        Name: "Naj's Light Plate",
        Index: "Naj's Light Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 43,
        RequiredLevel: 71,
        Code: "ult",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 4
          },
          {
            PropertyString: "+300 Defense",
            Index: 5
          },
          {
            PropertyString: "+65 to Life",
            Index: 1
          },
          {
            PropertyString: "All Resistances +25%",
            Index: 2
          },
          {
            PropertyString: "+45% Damage Taken Goes To Mana",
            Index: 3
          },
          {
            PropertyString: "Requirements -60%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "844-949",
          EquipmentType: 0,
          Name: "Hellforge Plate",
          RequiredStrength: 196,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 78,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Circlet",
        "Set": "Naj's Ancient Vestige",
        SetPropertiesString: [],
        Name: "Naj's Circlet",
        Index: "Naj's Circlet",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 43,
        RequiredLevel: 28,
        Code: "ci0",
        Properties: [
          {
            PropertyString: "12% Chance to cast level 5 Chain Lightning when struck",
            Index: 4
          },
          {
            PropertyString: "Adds 25-35 to Fire Damage",
            Index: 1
          },
          {
            PropertyString: "+75 Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Strength",
            Index: 3
          },
          {
            PropertyString: "+5 to Light Radius",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "20",
          EquipmentType: 0,
          Name: "Circlet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 35,
          ItemLevel: 24,
          Type: {
            Name: "Circlet",
            Index: "Circlet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+175 Defense",
        Index: 0
      },
      {
        PropertyString: "+1.5% better chance of getting magic item (Per Character Level)",
        Index: 1
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+2 to Fire Skills",
        Index: 6
      },
      {
        PropertyString: "+20 to Strength",
        Index: 4
      },
      {
        PropertyString: "+15 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "+12% Increased Maximum Life",
        Index: 7
      },
      {
        PropertyString: "+20 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "+100 to Mana",
        Index: 5
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Sander's Folly",
    Name: "Sander's Folly",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Sander's Folly",
        SetPropertiesString: [],
        Name: "Sander's Paragon",
        Index: "Sander's Paragon",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 20,
        RequiredLevel: 25,
        Code: "cap",
        Properties: [
          {
            PropertyString: "+1 Defense (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Attacker Takes Damage of +8",
            Index: 1
          },
          {
            PropertyString: "+35% better chance of getting magic item",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-28",
          EquipmentType: 0,
          Name: "Cap",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 1,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Sander's Folly",
        SetPropertiesString: [],
        Name: "Sander's Riprap",
        Index: "Sander's Riprap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 20,
        Code: "vbt",
        Properties: [
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 0
          },
          {
            PropertyString: "+100 to Attack Rating",
            Index: 1
          },
          {
            PropertyString: "+5 to Strength",
            Index: 2
          },
          {
            PropertyString: "+10 to Dexterity",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "4 to 10",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "30-40",
          EquipmentType: 0,
          Name: "Heavy Boots",
          RequiredStrength: 18,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Sander's Folly",
        SetPropertiesString: [],
        Name: "Sander's Taboo",
        Index: "Sander's Taboo",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 28,
        Code: "vgl",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "Adds 9-11 Poison Damage Over 3 Seconds",
            Index: 3
          },
          {
            PropertyString: "+20-25 Defense",
            Index: 0
          },
          {
            PropertyString: "+40 to Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25-35",
          EquipmentType: 0,
          Name: "Heavy Gloves",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Wand",
        "Set": "Sander's Folly",
        SetPropertiesString: [],
        Name: "Sander's Superstition",
        Index: "Sander's Superstition",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 25,
        Code: "bwn",
        Properties: [
          {
            PropertyString: "+75% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "Adds 25-75 to Cold Damage",
            Index: 4
          },
          {
            PropertyString: "+8% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+25 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "3 to 7"
            }
          ],
          EquipmentType: 1,
          Name: "Bone Wand",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 18,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 Defense",
        Index: 0
      },
      {
        PropertyString: "+75 to Attack Rating",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+4% Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Midnight Calling",
    Name: "Midnight Calling",
    SetItems: [
      {
        Type: "Hand to Hand",
        "Set": "Midnight Calling",
        SetPropertiesString: [
          "+15 to Minimum Damage (2 Items)"
        ],
        Name: "Jakira's Strike",
        Index: "Jakira's Strike",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 12,
        Code: "axf",
        Properties: [
          {
            PropertyString: "+120% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+5% Life stolen per hit",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "4 to 33"
            }
          ],
          EquipmentType: 1,
          Name: "Hatchet Hands",
          RequiredStrength: 37,
          RequiredDexterity: 37,
          Durability: 250,
          ItemLevel: 12,
          Type: {
            Name: "Hand to Hand",
            Index: "Hand to Hand",
            Class: "ass"
          },
          RequiredClass: "Assassin"
        }
      },
      {
        Type: "Gloves",
        "Set": "Midnight Calling",
        SetPropertiesString: [
          "+2 to Traps (Assassin only) (3 Items)"
        ],
        Name: "Jakira's Braces",
        Index: "Jakira's Braces",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 10,
        Code: "mgl",
        Properties: [
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "+75% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+25-35 to Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "15",
          EquipmentType: 0,
          Name: "Chain Gloves",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Midnight Calling",
        SetPropertiesString: [
          "Magic Damage Reduced by 6 (2 Items)"
        ],
        Name: "Jakira's Hood",
        Index: "Jakira's Hood",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 5,
        Code: "cap",
        Properties: [
          {
            PropertyString: "+1 to Assassin Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+15-25 Defense",
            Index: 1
          },
          {
            PropertyString: "+20-30 to Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-28",
          EquipmentType: 0,
          Name: "Cap",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 1,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Midnight Calling",
        SetPropertiesString: [
          "Damage Reduced by 8 (3 Items)"
        ],
        Name: "Jakira's Leather Jerkin",
        Index: "Jakira's Leather Jerkin",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 9,
        Code: "stu",
        Properties: [
          {
            PropertyString: "+35-50 Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Strength",
            Index: 2
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "67-82",
          EquipmentType: 0,
          Name: "Studded Leather",
          RequiredStrength: 27,
          RequiredDexterity: 0,
          Durability: 32,
          ItemLevel: 8,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Dexterity",
        Index: 0
      },
      {
        PropertyString: "+10 to Strength",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Assassin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 2
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Nature's Grove",
    Name: "Nature's Grove",
    SetItems: [
      {
        Type: "Ring",
        "Set": "Nature's Grove",
        SetPropertiesString: [],
        Name: "Peace Ring",
        Index: "Peace Ring",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 12,
        RequiredLevel: 12,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+40-50 to Life",
            Index: 1
          },
          {
            PropertyString: "+40-50 to Mana",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Hammer",
        "Set": "Nature's Grove",
        SetPropertiesString: [
          "Adds 10-30 to Cold Damage (2 Items)"
        ],
        Name: "Balance of Power",
        Index: "Balance of Power",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 18,
        Code: "mau",
        Properties: [
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+140-200% Enhanced Damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(72-90) to (103-129)"
            }
          ],
          EquipmentType: 1,
          Name: "Maul",
          RequiredStrength: 69,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 21,
          Type: {
            Name: "Hammer",
            Index: "Hammer",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Nature's Grove",
        SetPropertiesString: [
          "+3 Replenish Life (3 Items)",
          "Regenerate Mana +75% (4 Items)"
        ],
        Name: "Calming Embrace",
        Index: "Calming Embrace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 7,
        Code: "hla",
        Properties: [
          {
            PropertyString: "+1-3 to Summoning Skills (Druid only)",
            Index: 1
          },
          {
            PropertyString: "+80-120% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "39-48",
          EquipmentType: 0,
          Name: "Hard Leather Armor",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 5,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Pelt",
        "Set": "Nature's Grove",
        SetPropertiesString: [
          "+4 to Lycanthropy (Druid Only) (4 Items)"
        ],
        Name: "Animal Kinship",
        Index: "Animal Kinship",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 15,
        Code: "dr3",
        Properties: [
          {
            PropertyString: "+1 to Druid Skill Levels",
            Index: 1
          },
          {
            PropertyString: "+30-40 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "48-58",
          EquipmentType: 0,
          Name: "Antlers        ",
          RequiredStrength: 24,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 16,
          Type: {
            Name: "Pelt",
            Index: "Pelt",
            Class: "dru"
          },
          RequiredClass: "Druid"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Vitality",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Elemental Skills (Druid only)",
        Index: 2
      },
      {
        PropertyString: "+1 to Druid Skill Levels",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Grimlock's Grave",
    Name: "Grimlock's Grave",
    SetItems: [
      {
        Type: "Voodoo Heads",
        "Set": "Grimlock's Grave",
        SetPropertiesString: [
          "+100% Enhanced Defense (2 Items)"
        ],
        Name: "Grimlock's Skull",
        Index: "Grimlock's Skull",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 16,
        Code: "ne2",
        Properties: [
          {
            PropertyString: "+20% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+25-30% Increased Chance of Blocking",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "4",
          EquipmentType: 0,
          Name: "Zombie Head",
          RequiredStrength: 14,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 8,
          Type: {
            Name: "Voodoo Heads",
            Index: "Voodoo Heads",
            Class: "nec"
          },
          RequiredClass: "Necromancer"
        }
      },
      {
        Type: "Wand",
        "Set": "Grimlock's Grave",
        SetPropertiesString: [
          "Adds 8-20 to Damage (3 Items)"
        ],
        Name: "Grimlock's Wand",
        Index: "Grimlock's Wand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 15,
        Code: "bwn",
        Properties: [
          {
            PropertyString: "+1 to Necromancer Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+33 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "3 to 7"
            }
          ],
          EquipmentType: 1,
          Name: "Bone Wand",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 18,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Grimlock's Grave",
        SetPropertiesString: [
          "+77 Defense (2 Items)",
          "Regenerate Mana +40% (3 Items)"
        ],
        Name: "Grimlock's Shroud",
        Index: "Grimlock's Shroud",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 11,
        Code: "qui",
        Properties: [
          {
            PropertyString: "15% Chance to cast level 2 Frost Nova when struck",
            Index: 1
          },
          {
            PropertyString: "+10% Physical Damage Reduction",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "8",
          EquipmentType: 0,
          Name: "Quilted Armor",
          RequiredStrength: 12,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 1,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Grimlock's Grave",
        SetPropertiesString: [
          "+20 Defense (2 Items)"
        ],
        Name: "Grimlock's Belt",
        Index: "Grimlock's Belt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 11,
        RequiredLevel: 9,
        Code: "mbl",
        Properties: [
          {
            PropertyString: "+15% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+20-25 to Life",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "5",
          EquipmentType: 0,
          Name: "Belt",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to Energy",
        Index: 0
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Necromancer Skill Levels",
        Index: 0
      },
      {
        PropertyString: "-10% to Enemy Poison Resistance",
        Index: 2
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Corgina's Element",
    Name: "Corgina's Element",
    SetItems: [
      {
        Type: "Orb",
        "Set": "Corgina's Element",
        SetPropertiesString: [
          "+1 to Cold Skills (Sorceress only) (2 Items)",
          "+1 to Lightning Skills (Sorceress only) (3 Items)",
          "+1 to Fire Skills (Sorceress only) (4 Items)"
        ],
        Name: "Corgina's Orb",
        Index: "Corgina's Orb",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "ob2",
        Properties: [
          {
            PropertyString: "+1 to Sorceress Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+2-4 to Mana after each Kill",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "3 to 8"
            }
          ],
          EquipmentType: 1,
          Name: "Sacred Globe",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 8,
          Type: {
            Name: "Orb",
            Index: "Orb",
            Class: "sor"
          },
          RequiredClass: "Sorceress"
        }
      },
      {
        Type: "Armor",
        "Set": "Corgina's Element",
        SetPropertiesString: [
          "+1 to Mana (Per Character Level) (3 Items)",
          "+10% Damage Taken Goes To Mana (2 Items)"
        ],
        Name: "Corgina's Plate",
        Index: "Corgina's Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 21,
        Code: "ltp",
        Properties: [
          {
            PropertyString: "+75-105% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "159-186",
          EquipmentType: 0,
          Name: "Light Plate",
          RequiredStrength: 41,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 35,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Corgina's Element",
        SetPropertiesString: [
          "+15% Faster Block Rate (2 Items)",
          "Cold Resist +20% (3 Items)",
          "Lightning Resist +20% (4 Items)"
        ],
        Name: "Corgina's Ward",
        Index: "Corgina's Ward",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 14,
        Code: "lrg",
        Properties: [
          {
            PropertyString: "+15-25% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+20-30 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "2 to 4",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "32-42",
          EquipmentType: 0,
          Name: "Large Shield",
          RequiredStrength: 34,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 11,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Corgina's Element",
        SetPropertiesString: [
          "Fire Resist +20% (2 Items)",
          "Poison Resist +20% (3 Items)"
        ],
        Name: "Corgina's Slippers",
        Index: "Corgina's Slippers",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 9,
        RequiredLevel: 9,
        Code: "lbt",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "3 to 8",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Boots",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+60 to Mana",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Cast Rate",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+10% to Fire Skill Damage",
        Index: 2
      },
      {
        PropertyString: "+10% to Cold Skill Damage",
        Index: 3
      },
      {
        PropertyString: "+10% to Lightning Skill Damage",
        Index: 4
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Sheena's Grace",
    Name: "Sheena's Grace",
    SetItems: [
      {
        Type: "Amazon Bow",
        "Set": "Sheena's Grace",
        SetPropertiesString: [
          "+25% Increased Attack Speed (4 Items)"
        ],
        Name: "Sheena's Heartwood",
        Index: "Sheena's Heartwood",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "am1",
        Properties: [
          {
            PropertyString: "Adds 15-30 to Damage",
            Index: 0
          },
          {
            PropertyString: "+35-55% Chance of Open Wounds",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "22 to 42"
            }
          ],
          EquipmentType: 1,
          Name: "Stag Bow",
          RequiredStrength: 30,
          RequiredDexterity: 45,
          Durability: 0,
          ItemLevel: 18,
          Type: {
            Name: "Amazon Bow",
            Index: "Amazon Bow",
            Class: "ama"
          },
          RequiredClass: "Amazon"
        }
      },
      {
        Type: "Amulet",
        "Set": "Sheena's Grace",
        SetPropertiesString: [
          "All Resistances +12% (3 Items)"
        ],
        Name: "Sheena's Choker",
        Index: "Sheena's Choker",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 12,
        RequiredLevel: 12,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Sheena's Grace",
        SetPropertiesString: [
          "+5% Life stolen per hit (4 Items)",
          "Damage Reduced by 12 (2 Items)",
          "Magic Damage Reduced by 8 (3 Items)"
        ],
        Name: "Sheena's Elven Mail",
        Index: "Sheena's Elven Mail",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 16,
        RequiredLevel: 14,
        Code: "scl",
        Properties: [
          {
            PropertyString: "+100-150 Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "157-207",
          EquipmentType: 0,
          Name: "Scale Mail",
          RequiredStrength: 44,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 13,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Sheena's Grace",
        SetPropertiesString: [
          "+10 to Vitality (2 Items)"
        ],
        Name: "Sheena's Band",
        Index: "Sheena's Band",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 8,
        RequiredLevel: 10,
        Code: "vbl",
        Properties: [
          {
            PropertyString: "+5-10% Increased Maximum Life",
            Index: 0
          },
          {
            PropertyString: "+5-10 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "3",
          EquipmentType: 0,
          Name: "Light Belt",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+30 to Life",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20 to Maximum Damage",
        Index: 2
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Talonrage's Fury",
    Name: "Talonrage's Fury",
    SetItems: [
      {
        Type: "Primal Helm",
        "Set": "Talonrage's Fury",
        SetPropertiesString: [
          "+1 to Combat Skills (Barbarian only) (3 Items)"
        ],
        Name: "Berserker's Howl",
        Index: "Berserker's Howl",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 18,
        RequiredLevel: 18,
        Code: "ba4",
        Properties: [
          {
            PropertyString: "+1 to Barbarian Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+1 to Terror",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "30",
          EquipmentType: 0,
          Name: "Assault Helmet",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 20,
          Type: {
            Name: "Primal Helm",
            Index: "Primal Helm",
            Class: "bar"
          },
          RequiredClass: "Barbarian"
        }
      },
      {
        Type: "Armor",
        "Set": "Talonrage's Fury",
        SetPropertiesString: [
          "+40 to Life (2 Items)",
          "+10% Physical Damage Reduction (4 Items)"
        ],
        Name: "Chaos Heart",
        Index: "Chaos Heart",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 22,
        Code: "fld",
        Properties: [
          {
            PropertyString: "+90-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (2)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "193-224",
          EquipmentType: 0,
          Name: "Field Plate",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 28,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Spear",
        "Set": "Talonrage's Fury",
        SetPropertiesString: [
          "+30% Increased Attack Speed (2 Items)"
        ],
        Name: "Warlord's Pike",
        Index: "Warlord's Pike",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 20,
        Code: "pik",
        Properties: [
          {
            PropertyString: "+110-140% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Repairs 0.05 durability per second",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(29-33) to (132-151)"
            }
          ],
          EquipmentType: 1,
          Name: "Pike",
          RequiredStrength: 60,
          RequiredDexterity: 45,
          Durability: 250,
          ItemLevel: 24,
          Type: {
            Name: "Spear",
            Index: "Spear",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Talonrage's Fury",
        SetPropertiesString: [
          "+20 to Strength (3 Items)"
        ],
        Name: "Shattering Fist",
        Index: "Shattering Fist",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 21,
        Code: "hgl",
        Properties: [
          {
            PropertyString: "+10% Chance of Crushing Blow",
            Index: 1
          },
          {
            PropertyString: "+20-30 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Gauntlets",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+5 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "+35% Enhanced Damage",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Barbarian Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Greyhawk's Mantle",
    Name: "Greyhawk's Mantle",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Greyhawk's Mantle",
        SetPropertiesString: [
          "+3 Replenish Life (4 Items)"
        ],
        Name: "Greyhawk's Wing",
        Index: "Greyhawk's Wing",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 19,
        Code: "plt",
        Properties: [
          {
            PropertyString: "+75-100 Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +15-20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "183-208",
          EquipmentType: 0,
          Name: "Plate Mail",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 24,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Greyhawk's Mantle",
        SetPropertiesString: [
          "15% Chance to cast level 3 Frozen Armor when struck (3 Items)"
        ],
        Name: "Greyhawk's Icebrand",
        Index: "Greyhawk's Icebrand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 14,
        Code: "scp",
        Properties: [
          {
            PropertyString: "+80-120% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 10-20 to Cold Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(10-13) to (19-24)"
            }
          ],
          EquipmentType: 1,
          Name: "Scepter",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 3,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Auric Shields",
        "Set": "Greyhawk's Mantle",
        SetPropertiesString: [
          "+25% Faster Block Rate (3 Items)"
        ],
        Name: "Greyhawk's Deflector",
        Index: "Greyhawk's Deflector",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 15,
        Code: "pa3",
        Properties: [
          {
            PropertyString: "+15% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "Socketed (1-4)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "3 to 9",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "16",
          EquipmentType: 0,
          Name: "Heraldic Shield",
          RequiredStrength: 40,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 16,
          Type: {
            Name: "Auric Shields",
            Index: "Auric Shields",
            Class: "pal"
          },
          RequiredClass: "Paladin"
        }
      },
      {
        Type: "Helm",
        "Set": "Greyhawk's Mantle",
        SetPropertiesString: [
          "+20 to Life (3 Items)"
        ],
        Name: "Greyhawk's Viser",
        Index: "Greyhawk's Viser",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 17,
        RequiredLevel: 13,
        Code: "fhl",
        Properties: [
          {
            PropertyString: "Adds 3-5% Mana stolen per hit",
            Index: 1
          },
          {
            PropertyString: "+20-30 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "43-53",
          EquipmentType: 0,
          Name: "Full Helm",
          RequiredStrength: 41,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 15,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+8 Life after each Kill",
        Index: 0
      },
      {
        PropertyString: "+4 to Mana after each Kill",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to Paladin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 3
      },
      {
        PropertyString: "Poison Length Reduced by 60%",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Silent Runnings",
    Name: "Silent Runnings",
    SetItems: [
      {
        Type: "Shield",
        "Set": "Silent Runnings",
        SetPropertiesString: [
          "+20% Increased Chance of Blocking (2 Items)"
        ],
        Name: "Dragon's Flank",
        Index: "Dragon's Flank",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 14,
        RequiredLevel: 18,
        Code: "bsh",
        Properties: [
          {
            PropertyString: "+65-90% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+5-10% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "3 to 6",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "10",
          EquipmentType: 0,
          Name: "Bone Shield",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 19,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Silent Runnings",
        SetPropertiesString: [
          "+25% better chance of getting magic item (3 Items)"
        ],
        Name: "Ferrit's Paw",
        Index: "Ferrit's Paw",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 14,
        Code: "vgl",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "Adds 4-6% Life stolen per hit",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25-35",
          EquipmentType: 0,
          Name: "Heavy Gloves",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Silent Runnings",
        SetPropertiesString: [
          "+8% Physical Damage Reduction (3 Items)"
        ],
        Name: "Turtle's Shell",
        Index: "Turtle's Shell",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 23,
        Code: "ful",
        Properties: [
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+90-130% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "286-347",
          EquipmentType: 0,
          Name: "Full Plate Mail",
          RequiredStrength: 80,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 37,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Silent Runnings",
        SetPropertiesString: [
          "+20 Defense (3 Items)"
        ],
        Name: "Wolf Pelt",
        Index: "Wolf Pelt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 14,
        RequiredLevel: 14,
        Code: "tbl",
        Properties: [
          {
            PropertyString: "+35-50 to Life",
            Index: 0
          },
          {
            PropertyString: "All Resistances +10-15%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "26-36",
          EquipmentType: 0,
          Name: "Heavy Belt",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Silent Runnings",
        SetPropertiesString: [],
        Name: "Beast Collar",
        Index: "Beast Collar",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "bhm",
        Properties: [
          {
            PropertyString: "+20-30% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 20-30 to Magic Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "33",
          EquipmentType: 0,
          Name: "Bone Helm",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 22,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+20% Faster Block Rate",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 1
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+150% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Snowmane's Jewelry",
    Name: "Snowmane's Jewelry",
    SetItems: [
      {
        Type: "Circlet",
        "Set": "Snowmane's Jewelry",
        SetPropertiesString: [
          "+15% Faster Hit Recovery (3 Items)",
          "+20 to Life (2 Items)"
        ],
        Name: "Jeweled Circlet",
        Index: "Jeweled Circlet",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 22,
        Code: "ci0",
        Properties: [
          {
            PropertyString: "+15 to Strength",
            Index: 0
          },
          {
            PropertyString: "+15 to Vitality",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "20",
          EquipmentType: 0,
          Name: "Circlet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 35,
          ItemLevel: 24,
          Type: {
            Name: "Circlet",
            Index: "Circlet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Snowmane's Jewelry",
        SetPropertiesString: [
          "+10% Physical Damage Reduction (4 Items)"
        ],
        Name: "Jeweled Belt",
        Index: "Jeweled Belt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 22,
        RequiredLevel: 22,
        Code: "hbl",
        Properties: [
          {
            PropertyString: "+100-125% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +10-15%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-19",
          EquipmentType: 0,
          Name: "Plated Belt",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Snowmane's Jewelry",
        SetPropertiesString: [
          "+30 to Life (3 Items)",
          "+15% better chance of getting magic item (4 Items)"
        ],
        Name: "Ruby Ring",
        Index: "Ruby Ring",
        Enabled: true,
        Rarity: 4,
        ItemLevel: 22,
        RequiredLevel: 22,
        Code: "rin",
        Properties: [
          {
            PropertyString: "All Resistances +10-15%",
            Index: 0
          },
          {
            PropertyString: "Magic Damage Reduced by 6",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Snowmane's Jewelry",
        SetPropertiesString: [
          "+1 to All Skills (3 Items)"
        ],
        Name: "Diamond Necklace",
        Index: "Diamond Necklace",
        Enabled: true,
        Rarity: 4,
        ItemLevel: 22,
        RequiredLevel: 22,
        Code: "amu",
        Properties: [
          {
            PropertyString: "All Resistances +15-20%",
            Index: 0
          },
          {
            PropertyString: "+20-30% better chance of getting magic item",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+30% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "All Resistances +15%",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Run/Walk",
        Index: 3
      },
      {
        PropertyString: "+5% Mana stolen per hit",
        Index: 1
      },
      {
        PropertyString: "+5% Life stolen per hit",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Four Seasons",
    Name: "Four Seasons",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Four Seasons",
        SetPropertiesString: [
          "+10 to Maximum Cold Resist (3 Items)",
          "+10% Cold Absorb (2 Items)",
          "Cannot Be Frozen (4 Items)"
        ],
        Name: "Winter's Heart",
        Index: "Winter's Heart",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 25,
        Code: "aar",
        Properties: [
          {
            PropertyString: "-10-15% to Enemy Cold Resistance",
            Index: 0
          },
          {
            PropertyString: "+10-15% to Cold Skill Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "218",
          EquipmentType: 0,
          Name: "Ancient Armor",
          RequiredStrength: 100,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 40,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Four Seasons",
        SetPropertiesString: [
          "+10 to Maximum Lightning Resist (3 Items)",
          "+10% Lightning Absorb (2 Items)"
        ],
        Name: "Spring Dawning",
        Index: "Spring Dawning",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 22,
        Code: "ghm",
        Properties: [
          {
            PropertyString: "-10-15% to Enemy Lightning Resistance",
            Index: 0
          },
          {
            PropertyString: "+10-15% to Lightning Skill Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "30",
          EquipmentType: 0,
          Name: "Great Helm",
          RequiredStrength: 63,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 23,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Four Seasons",
        SetPropertiesString: [
          "+10 to Maximum Fire Resist (3 Items)",
          "+10% Fire Absorb (2 Items)"
        ],
        Name: "Summer Flame",
        Index: "Summer Flame",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 21,
        Code: "hbt",
        Properties: [
          {
            PropertyString: "-10-15% to Enemy Fire Resistance",
            Index: 0
          },
          {
            PropertyString: "+10-15% to Fire Skill Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "10 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Greaves",
          RequiredStrength: 70,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Four Seasons",
        SetPropertiesString: [
          "+10 to Maximum Poison Resist (3 Items)",
          "Magic Resist +10% (2 Items)",
          "Poison Length Reduced by 75% (4 Items)"
        ],
        Name: "Autumn's Decay",
        Index: "Autumn's Decay",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 19,
        Code: "tgl",
        Properties: [
          {
            PropertyString: "-10-15% to Enemy Poison Resistance",
            Index: 0
          },
          {
            PropertyString: "+10-15% to Poison Skill Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "9",
          EquipmentType: 0,
          Name: "Light Gauntlets",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to All Attributes",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "15% Chance to cast level 6 Charged Bolt when struck",
        Index: 2
      },
      {
        PropertyString: "15% Chance to cast level 6 Frost Nova when struck",
        Index: 3
      },
      {
        PropertyString: "10% Chance to cast level 1 Meteor when struck",
        Index: 4
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Forgotten Treasures",
    Name: "Forgotten Treasures",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "Magic Resist +10% (4 Items)",
          "+15% Physical Damage Reduction (6 Items)"
        ],
        Name: "Fernandez' Plate",
        Index: "Fernandez' Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "brs",
        Properties: [
          {
            PropertyString: "+75-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "115-145",
          EquipmentType: 0,
          Name: "Breast Plate",
          RequiredStrength: 30,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 18,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "+30 to Mana (2 Items)",
          "Regenerate Mana +50% (5 Items)"
        ],
        Name: "Katriana's Mask",
        Index: "Katriana's Mask",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "msk",
        Properties: [
          {
            PropertyString: "+60-100% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "16-20",
          EquipmentType: 0,
          Name: "Mask",
          RequiredStrength: 23,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 19,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "+5% Mana stolen per hit (4 Items)",
          "+50 to Life (3 Items)"
        ],
        Name: "Luther's Cord",
        Index: "Luther's Cord",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 10,
        Code: "tbl",
        Properties: [
          {
            PropertyString: "+20-30 Defense",
            Index: 0
          },
          {
            PropertyString: "+2-5 Replenish Life",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "26-36",
          EquipmentType: 0,
          Name: "Heavy Belt",
          RequiredStrength: 45,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "+5% Life stolen per hit (4 Items)",
          "+10 to Strength (6 Items)"
        ],
        Name: "Janis' Gloves",
        Index: "Janis' Gloves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 10,
        Code: "vgl",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+20-30 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25-35",
          EquipmentType: 0,
          Name: "Heavy Gloves",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "+20% Faster Hit Recovery (3 Items)",
          "+10 to Dexterity (5 Items)"
        ],
        Name: "Xavier's Greaves",
        Index: "Xavier's Greaves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 15,
        Code: "tbt",
        Properties: [
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+80-110% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "8 to 16",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "18-21",
          EquipmentType: 0,
          Name: "Light Plated Boots",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 20,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Forgotten Treasures",
        SetPropertiesString: [
          "+25% Faster Block Rate (2 Items)",
          "+20% Increased Chance of Blocking (4 Items)"
        ],
        Name: "Quincy's Shield",
        Index: "Quincy's Shield",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 10,
        Code: "spk",
        Properties: [
          {
            PropertyString: "+100-135% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "5 to 9",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "32-37",
          EquipmentType: 0,
          Name: "Spiked Shield",
          RequiredStrength: 30,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 11,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15 to Strength",
        Index: 0
      },
      {
        PropertyString: "+15 to Dexterity",
        Index: 2
      },
      {
        PropertyString: "+15 to Energy",
        Index: 4
      },
      {
        PropertyString: "+15 to Vitality",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 1
      },
      {
        PropertyString: "+4% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+200% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Insight of Brother Laz",
    Name: "Insight of Brother Laz",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "Insight of Brother Laz",
        SetPropertiesString: [
          "+15 to Strength (3 Items)"
        ],
        Name: "Power of Brother Laz",
        Index: "Power of Brother Laz",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 33,
        Code: "xtg",
        Properties: [
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "Adds 4-6% Mana stolen per hit",
            Index: 1
          },
          {
            PropertyString: "+80-100% Enhanced Defense",
            Index: 3
          },
          {
            PropertyString: "Fire Resist +15-20%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "140",
          EquipmentType: 0,
          Name: "Battle Gauntlets",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Auric Shields",
        "Set": "Insight of Brother Laz",
        SetPropertiesString: [
          "7% Chance to cast level 1 Frozen Orb when struck (5 Items)"
        ],
        Name: "Prayer of Brother Laz",
        Index: "Prayer of Brother Laz",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 38,
        Code: "pa8",
        Properties: [
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+20% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+20-30% Increased Chance of Blocking",
            Index: 0
          },
          {
            PropertyString: "+1 Defense (Per Character Level)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "18 to 24",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "129",
          EquipmentType: 0,
          Name: "Protector Shield",
          RequiredStrength: 69,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 46,
          Type: {
            Name: "Auric Shields",
            Index: "Auric Shields",
            Class: "pal"
          },
          RequiredClass: "Paladin"
        }
      },
      {
        Type: "Amulet",
        "Set": "Insight of Brother Laz",
        SetPropertiesString: [
          "9% Chance to cast level 2 Mind Blast when struck (3 Items)",
          "+25 to Mana (2 Items)"
        ],
        Name: "Brother Laz' Holy Symbol",
        Index: "Brother Laz' Holy Symbol",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1 to Paladin Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+25-50 to Life",
            Index: 1
          },
          {
            PropertyString: "Lightning Resist +25-50%",
            Index: 2
          },
          {
            PropertyString: "Poison Length Reduced by 60%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Insight of Brother Laz",
        SetPropertiesString: [
          "12% Chance to cast level 1 Fire Wall on striking (3 Items)",
          "+1 to Maximum Damage (Per Character Level) (4 Items)"
        ],
        Name: "Wrath of Brother Laz",
        Index: "Wrath of Brother Laz",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 29,
        Code: "9sc",
        Properties: [
          {
            PropertyString: "+1 to Paladin Skill Levels",
            Index: 2
          },
          {
            PropertyString: "+160-190% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 20-40 to Damage",
            Index: 1
          },
          {
            PropertyString: "Ignore Target's Defense",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(53-57) to (102-109)"
            }
          ],
          EquipmentType: 1,
          Name: "Rune Scepter",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 31,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Insight of Brother Laz",
        SetPropertiesString: [
          "6% Chance to cast level 2 War Cry when struck (4 Items)",
          "+3 Replenish Life (5 Items)"
        ],
        Name: "Brother Laz' Faith",
        Index: "Brother Laz' Faith",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "xld",
        Properties: [
          {
            PropertyString: "+100-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +50%",
            Index: 3
          },
          {
            PropertyString: "Magic Resist +15-20%",
            Index: 2
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "558-631",
          EquipmentType: 0,
          Name: "Sharktooth Armor",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 55,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+20 to Strength",
        Index: 2
      },
      {
        PropertyString: "+20 to Dexterity",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Paladin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+100 to Life",
        Index: 3
      },
      {
        PropertyString: "+50 to Mana",
        Index: 4
      },
      {
        PropertyString: "All Resistances +60%",
        Index: 1
      },
      {
        PropertyString: "Half Freeze Duration",
        Index: 5
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Hades' Underworld",
    Name: "Hades' Underworld",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Hades' Underworld",
        SetPropertiesString: [
          "+50 to Mana (4 Items)"
        ],
        Name: "Afterlife",
        Index: "Afterlife",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 34,
        Code: "xla",
        Properties: [
          {
            PropertyString: "+1-3 to Summoning Skills (Necromancer only)",
            Index: 1
          },
          {
            PropertyString: "+4 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +25-40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "270-369",
          EquipmentType: 0,
          Name: "Demonhide Armor",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 37,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Voodoo Heads",
        "Set": "Hades' Underworld",
        SetPropertiesString: [
          "+20% Physical Damage Reduction (4 Items)"
        ],
        Name: "Dracolich",
        Index: "Dracolich",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "ne8",
        Properties: [
          {
            PropertyString: "+20-30% Increased Chance of Blocking",
            Index: 0
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +25-40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "44",
          EquipmentType: 0,
          Name: "Sexton Trophy",
          RequiredStrength: 47,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 45,
          Type: {
            Name: "Voodoo Heads",
            Index: "Voodoo Heads",
            Class: "nec"
          },
          RequiredClass: "Necromancer"
        }
      },
      {
        Type: "Ring",
        "Set": "Hades' Underworld",
        SetPropertiesString: [],
        Name: "Vampire's Crusade",
        Index: "Vampire's Crusade",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 30,
        RequiredLevel: 39,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+10% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+1 to Mana (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Regenerate Mana +50%",
            Index: 0
          },
          {
            PropertyString: "All Resistances +8-15%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Hades' Underworld",
        SetPropertiesString: [
          "Cannot Be Frozen (5 Items)"
        ],
        Name: "The River Stix",
        Index: "The River Stix",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 32,
        Code: "xlb",
        Properties: [
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+1 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +25-40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "26 to 46",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "28",
          EquipmentType: 0,
          Name: "Demonhide Boots",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Hades' Underworld",
        SetPropertiesString: [
          "+100% extra gold from monsters (3 Items)",
          "+35% better chance of getting magic item (4 Items)"
        ],
        Name: "Lord Hades' Throne",
        Index: "Lord Hades' Throne",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 41,
        Code: "xrn",
        Properties: [
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Poison Resist +25-40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "158",
          EquipmentType: 0,
          Name: "Grand Crown",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 55,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+2 to Revive",
        Index: 0
      },
      {
        PropertyString: "+7 to Skeleton Mastery",
        Index: 2
      },
      {
        PropertyString: "+4 to Shout",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Necromancer Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+20% Cold Absorb",
        Index: 2
      },
      {
        PropertyString: "+20% Lightning Absorb",
        Index: 3
      },
      {
        PropertyString: "+20% Fire Absorb",
        Index: 1
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Darque's Cabal",
    Name: "Darque's Cabal",
    SetItems: [
      {
        Type: "Primal Helm",
        "Set": "Darque's Cabal",
        SetPropertiesString: [
          "+15% Increased Attack Speed (4 Items)",
          "+15 to Maximum Damage (2 Items)"
        ],
        Name: "Secret Society",
        Index: "Secret Society",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 40,
        Code: "ba9",
        Properties: [
          {
            PropertyString: "12% Chance to cast level 6 Static Field when struck",
            Index: 1
          },
          {
            PropertyString: "+1 to Barbarian Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 3
          },
          {
            PropertyString: "+50-70 to Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "172",
          EquipmentType: 0,
          Name: "Savage Helmet",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 49,
          Type: {
            Name: "Primal Helm",
            Index: "Primal Helm",
            Class: "bar"
          },
          RequiredClass: "Barbarian"
        }
      },
      {
        Type: "Armor",
        "Set": "Darque's Cabal",
        SetPropertiesString: [
          "+100% Damage to Demons (2 Items)"
        ],
        Name: "Fallen Angels",
        Index: "Fallen Angels",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 43,
        Code: "xth",
        Properties: [
          {
            PropertyString: "+180-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 1
          },
          {
            PropertyString: "Socketed (1)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "792-905",
          EquipmentType: 0,
          Name: "Embossed Plate",
          RequiredStrength: 125,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 58,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Darque's Cabal",
        SetPropertiesString: [
          "+40% Increased Attack Speed (2 Items)",
          "Adds 50-125 to Damage (3 Items)",
          "Prevent Monster Heal (4 Items)"
        ],
        Name: "Savant Fury",
        Index: "Savant Fury",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 42,
        Code: "9gd",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 1
          },
          {
            PropertyString: "+220-300% Enhanced Damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "(76-96) to (128-160)"
            },
            {
              Type: 1,
              DamageString: "(150-188) to (256-320)"
            }
          ],
          EquipmentType: 1,
          Name: "Executioner Sword",
          RequiredStrength: 170,
          RequiredDexterity: 110,
          Durability: 0,
          ItemLevel: 54,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Darque's Cabal",
        SetPropertiesString: [
          "+20% Faster Block Rate (3 Items)"
        ],
        Name: "Dawn's Blessing",
        Index: "Dawn's Blessing",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 41,
        Code: "xts",
        Properties: [
          {
            PropertyString: "+35-50% Enhanced Damage",
            Index: 2
          },
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+25-35% Increased Chance of Blocking",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "12 to 16",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "178-194",
          EquipmentType: 0,
          Name: "Ancient Shield",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 80,
          ItemLevel: 56,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+200% Damage to Undead",
        Index: 0
      },
      {
        PropertyString: "+200% Damage to Demons",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Barbarian Skill Levels",
        Index: 0
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 1
      },
      {
        PropertyString: "+25 to All Attributes",
        Index: 2
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+125% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Red Havoc's Challenge",
    Name: "Red Havoc's Challenge",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Red Havoc's Challenge",
        SetPropertiesString: [
          "+1 to Maximum Damage (Per Character Level) (3 Items)"
        ],
        Name: "Cry of the Wolf",
        Index: "Cry of the Wolf",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 35,
        Code: "xcl",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "+2% Enhanced Defense (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Level 35 Summon Dire Wolf (8 Charges)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "477-548",
          EquipmentType: 0,
          Name: "Tigulated Mail",
          RequiredStrength: 86,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 43,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Pelt",
        "Set": "Red Havoc's Challenge",
        SetPropertiesString: [
          "+25% better chance of getting magic item (2 Items)"
        ],
        Name: "Full Moon Frenzy",
        Index: "Full Moon Frenzy",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 33,
        Code: "dr6",
        Properties: [
          {
            PropertyString: "+2-3 to Shape Shifting Skills (Druid only)",
            Index: 1
          },
          {
            PropertyString: "+180% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+10% Increased Maximum Life",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "52",
          EquipmentType: 0,
          Name: "Alpha Helm",
          RequiredStrength: 44,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 35,
          Type: {
            Name: "Pelt",
            Index: "Pelt",
            Class: "dru"
          },
          RequiredClass: "Druid"
        }
      },
      {
        Type: "Hammer",
        "Set": "Red Havoc's Challenge",
        SetPropertiesString: [
          "All Resistances +35% (3 Items)"
        ],
        Name: "Torment of Innocence",
        Index: "Torment of Innocence",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 39,
        Code: "9m9",
        Properties: [
          {
            PropertyString: "+50% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+160-200% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+20% bonus to Attack Rating",
            Index: 3
          },
          {
            PropertyString: "Requirements -40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(137-159) to (202-234)"
            }
          ],
          EquipmentType: 1,
          Name: "War Club",
          RequiredStrength: 124,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 45,
          Type: {
            Name: "Hammer",
            Index: "Hammer",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Red Havoc's Challenge",
        SetPropertiesString: [
          "+50 to Mana (4 Items)"
        ],
        Name: "Drawing Out the Beast",
        Index: "Drawing Out the Beast",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 32,
        Code: "zlb",
        Properties: [
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "+90-110% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+30-40 to Life",
            Index: 1
          },
          {
            PropertyString: "All Resistances +10-15%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54-63",
          EquipmentType: 0,
          Name: "Demonhide Sash",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+8 to Werewolf (Druid Only)",
        Index: 0
      },
      {
        PropertyString: "+6 to Lycanthropy (Druid Only)",
        Index: 1
      },
      {
        PropertyString: "+5 to Fury (Druid Only)",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Druid Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+30% bonus to Attack Rating",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 3
      },
      {
        PropertyString: "+60% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Mishy's Avatar",
    Name: "Mishy's Avatar",
    SetItems: [
      {
        Type: "Boots",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [
          "+20% Faster Hit Recovery (2 Items)"
        ],
        Name: "Elven Grace",
        Index: "Elven Grace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 32,
        Code: "xvb",
        Properties: [
          {
            PropertyString: "+5-10 to Maximum Damage",
            Index: 3
          },
          {
            PropertyString: "+120-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +20-30%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "28 to 50",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "68",
          EquipmentType: 0,
          Name: "Sharkskin Boots",
          RequiredStrength: 47,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [
          "+15% Increased Attack Speed (3 Items)",
          "+25 to Life (4 Items)"
        ],
        Name: "Woodland Protector",
        Index: "Woodland Protector",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 35,
        Code: "xhn",
        Properties: [
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+1 to Life (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Poison Length Reduced by 80%",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "547-646",
          EquipmentType: 0,
          Name: "Mesh Armor",
          RequiredStrength: 92,
          RequiredDexterity: 0,
          Durability: 45,
          ItemLevel: 45,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Circlet",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [],
        Name: "Silent Whisper",
        Index: "Silent Whisper",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 40,
        Code: "ci1",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+22% Damage Taken Goes To Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "30",
          EquipmentType: 0,
          Name: "Coronet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 52,
          Type: {
            Name: "Circlet",
            Index: "Circlet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [],
        Name: "Warder's Bond",
        Index: "Warder's Bond",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 35,
        RequiredLevel: 38,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+6% Life stolen per hit",
            Index: 1
          },
          {
            PropertyString: "Knockback",
            Index: 3
          },
          {
            PropertyString: "+10 to Strength",
            Index: 0
          },
          {
            PropertyString: "+40-50 to Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [
          "+20% Increased Attack Speed (5 Items)"
        ],
        Name: "Maiden's Kiss",
        Index: "Maiden's Kiss",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 33,
        Code: "xmg",
        Properties: [
          {
            PropertyString: "Cold Resist +30-40%",
            Index: 3
          },
          {
            PropertyString: "Lightning Resist +30-40%",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +30-40%",
            Index: 0
          },
          {
            PropertyString: "Poison Resist +30-40%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Heavy Bracers",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amazon Bow",
        "Set": "Mishy's Avatar",
        SetPropertiesString: [
          "Adds 25-100 to Fire Damage (6 Items)"
        ],
        Name: "Trent's Caster",
        Index: "Trent's Caster",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 40,
        Code: "am7",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+170-210% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(51-58) to (110-127)"
            }
          ],
          EquipmentType: 1,
          Name: "Ceremonial Bow",
          RequiredStrength: 73,
          RequiredDexterity: 110,
          Durability: 0,
          ItemLevel: 47,
          Type: {
            Name: "Amazon Bow",
            Index: "Amazon Bow",
            Class: "ama"
          },
          RequiredClass: "Amazon"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+150 to Attack Rating",
        Index: 0
      },
      {
        PropertyString: "+40% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 4
      },
      {
        PropertyString: "+10 to Dexterity",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Amazon Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+75 to Life",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Joel's Sanctuary",
    Name: "Joel's Sanctuary",
    SetItems: [
      {
        Type: "Orb",
        "Set": "Joel's Sanctuary",
        SetPropertiesString: [],
        Name: "Eye of the Trent",
        Index: "Eye of the Trent",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 33,
        Code: "ob8",
        Properties: [
          {
            PropertyString: "Level 4 Cleansing Aura When Equipped",
            Index: 2
          },
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+20% Increased Maximum Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "11 to 29"
            }
          ],
          EquipmentType: 1,
          Name: "Cloudy Sphere",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 41,
          Type: {
            Name: "Orb",
            Index: "Orb",
            Class: "sor"
          },
          RequiredClass: "Sorceress"
        }
      },
      {
        Type: "Armor",
        "Set": "Joel's Sanctuary",
        SetPropertiesString: [
          "+5 Replenish Life (4 Items)"
        ],
        Name: "Power of Fire",
        Index: "Power of Fire",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 33,
        Code: "xui",
        Properties: [
          {
            PropertyString: "+10-20% to Fire Skill Damage",
            Index: 1
          },
          {
            PropertyString: "-10-20% to Enemy Fire Resistance",
            Index: 2
          },
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +35-50%",
            Index: 4
          },
          {
            PropertyString: "+10-20% Fire Absorb",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "206-226",
          EquipmentType: 0,
          Name: "Ghost Armor",
          RequiredStrength: 38,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 34,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Joel's Sanctuary",
        SetPropertiesString: [
          "Half Freeze Duration (3 Items)"
        ],
        Name: "Power of Ice",
        Index: "Power of Ice",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 33,
        Code: "xap",
        Properties: [
          {
            PropertyString: "+10-20% to Cold Skill Damage",
            Index: 1
          },
          {
            PropertyString: "-10-20% to Enemy Cold Resistance",
            Index: 2
          },
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +35-50%",
            Index: 4
          },
          {
            PropertyString: "+10-20% Cold Absorb",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "80-92",
          EquipmentType: 0,
          Name: "War Hat",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 34,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Joel's Sanctuary",
        SetPropertiesString: [
          "+20% Increased Chance of Blocking (2 Items)"
        ],
        Name: "Power of Lightning",
        Index: "Power of Lightning",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 33,
        Code: "xuc",
        Properties: [
          {
            PropertyString: "+10-20% to Lightning Skill Damage",
            Index: 1
          },
          {
            PropertyString: "-10-20% to Enemy Lightning Resistance",
            Index: 2
          },
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +35-50%",
            Index: 4
          },
          {
            PropertyString: "+10-20% Lightning Absorb",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "8 to 12",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "84-92",
          EquipmentType: 0,
          Name: "Defender",
          RequiredStrength: 38,
          RequiredDexterity: 0,
          Durability: 68,
          ItemLevel: 34,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 to Mana",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +50%",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Sorceress Skill Levels",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+7 to Mana after each Kill",
        Index: 4
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "JBouley's Scion",
    Name: "JBouley's Scion",
    SetItems: [
      {
        Type: "Armor",
        "Set": "JBouley's Scion",
        SetPropertiesString: [],
        Name: "Shadow Ninja",
        Index: "Shadow Ninja",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 35,
        Code: "xtu",
        Properties: [
          {
            PropertyString: "+1 to Dodge",
            Index: 1
          },
          {
            PropertyString: "+1 to Evade",
            Index: 2
          },
          {
            PropertyString: "+1 to Avoid",
            Index: 3
          },
          {
            PropertyString: "+300-400 Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361-417",
          EquipmentType: 0,
          Name: "Trellised Armor",
          RequiredStrength: 61,
          RequiredDexterity: 0,
          Durability: 32,
          ItemLevel: 40,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "JBouley's Scion",
        SetPropertiesString: [
          "All Resistances +15% (3 Items)"
        ],
        Name: "Night's Caress",
        Index: "Night's Caress",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 32,
        Code: "xlg",
        Properties: [
          {
            PropertyString: "+2 to Martial Arts (Assassin only)",
            Index: 2
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+1.5 Defense (Per Character Level)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "28",
          EquipmentType: 0,
          Name: "Demonhide Gloves",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 33,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Hand to Hand 2",
        "Set": "JBouley's Scion",
        SetPropertiesString: [
          "+8% Mana stolen per hit (4 Items)",
          "+8% Life stolen per hit (3 Items)"
        ],
        Name: "Mystic Blades",
        Index: "Mystic Blades",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 39,
        Code: "9qr",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+160-190% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (1)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(49-55) to (104-116)"
            }
          ],
          EquipmentType: 1,
          Name: "Scissors Quhab",
          RequiredStrength: 82,
          RequiredDexterity: 82,
          Durability: 250,
          ItemLevel: 54,
          Type: {
            Name: "Hand to Hand 2",
            Index: "Hand to Hand 2",
            Class: "ass"
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "JBouley's Scion",
        SetPropertiesString: [
          "Slows target by 15% (2 Items)"
        ],
        Name: "Fade to Black",
        Index: "Fade to Black",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 38,
        Code: "ztb",
        Properties: [
          {
            PropertyString: "+80% Enhanced Defense",
            Index: 4
          },
          {
            PropertyString: "+25 to Life",
            Index: 2
          },
          {
            PropertyString: "+25 to Mana",
            Index: 3
          },
          {
            PropertyString: "All Resistances +15%",
            Index: 1
          },
          {
            PropertyString: "You feel incorporeal...",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "66-83",
          EquipmentType: 0,
          Name: "Battle Belt",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+33% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to Assassin Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+100% Chance of Open Wounds",
        Index: 3
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 1
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Forsaken Divinity",
    Name: "Forsaken Divinity",
    SetItems: [
      {
        Type: "Ring",
        "Set": "Forsaken Divinity",
        SetPropertiesString: [],
        Name: "Fall From Grace",
        Index: "Fall From Grace",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "rin",
        Properties: [
          {
            PropertyString: "Adds 4-7% Mana stolen per hit",
            Index: 1
          },
          {
            PropertyString: "Adds 6-9% Life stolen per hit",
            Index: 0
          },
          {
            PropertyString: "+35-50 to Life",
            Index: 2
          },
          {
            PropertyString: "+60-80 to Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Forsaken Divinity",
        SetPropertiesString: [],
        Name: "Tyrial's Grief",
        Index: "Tyrial's Grief",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "+3-5 Replenish Life",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +45%",
            Index: 1
          },
          {
            PropertyString: "+25-35% better chance of getting magic item",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Forsaken Divinity",
        SetPropertiesString: [],
        Name: "Redemption Denied",
        Index: "Redemption Denied",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+10 to All Attributes",
            Index: 2
          },
          {
            PropertyString: "All Resistances +15-25%",
            Index: 3
          },
          {
            PropertyString: "+40-50% better chance of getting magic item",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Forsaken Divinity",
        SetPropertiesString: [
          "+1 to All Skills (4 Items)",
          "+100% extra gold from monsters (2 Items)",
          "+50% better chance of getting magic item (3 Items)"
        ],
        Name: "Hell's Embrace",
        Index: "Hell's Embrace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "xtp",
        Properties: [
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (4)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "525-725",
          EquipmentType: 0,
          Name: "Mage Plate",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 60,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "-3% to Experience Gained",
        Index: 0
      },
      {
        PropertyString: "-5% to Experience Gained",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+50% Increased Attack Speed",
        Index: 4
      },
      {
        PropertyString: "+200% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 1
      },
      {
        PropertyString: "-7% to Experience Gained",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Volf's Undead Legion",
    Name: "Volf's Undead Legion",
    SetItems: [
      {
        Type: "Shield",
        "Set": "Volf's Undead Legion",
        SetPropertiesString: [
          "+35% Increased Chance of Blocking (2 Items)"
        ],
        Name: "Spectral Knight's Unholy Shield",
        Index: "Spectral Knight's Unholy Shield",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 38,
        Code: "xsh",
        Properties: [
          {
            PropertyString: "+125-155% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "-10 to Life",
            Index: 3
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 2
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "14 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "89-102",
          EquipmentType: 0,
          Name: "Grim Shield",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 48,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Volf's Undead Legion",
        SetPropertiesString: [
          "+20% Increased Attack Speed (2 Items)",
          "+100% Damage to Demons (4 Items)"
        ],
        Name: "Death Knight's Demon Blade",
        Index: "Death Knight's Demon Blade",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 37,
        Code: "9bs",
        Properties: [
          {
            PropertyString: "+160-220% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 20-55 to Damage",
            Index: 1
          },
          {
            PropertyString: "+15% Life stolen per hit",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(61-71) to (143-163)"
            }
          ],
          EquipmentType: 1,
          Name: "Battle Sword",
          RequiredStrength: 92,
          RequiredDexterity: 43,
          Durability: 250,
          ItemLevel: 40,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Volf's Undead Legion",
        SetPropertiesString: [
          "+1 to Sorceress Skill Levels (4 Items)",
          "+15 to Strength (3 Items)"
        ],
        Name: "Lich's Evil Grin",
        Index: "Lich's Cranium",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 39,
        Code: "xh9",
        Properties: [
          {
            PropertyString: "+25% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+60-80 to Mana",
            Index: 0
          },
          {
            PropertyString: "Socketed (1)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129",
          EquipmentType: 0,
          Name: "Grim Helm",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 50,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Volf's Undead Legion",
        SetPropertiesString: [
          "Cannot Be Frozen (4 Items)"
        ],
        Name: "Skeleton Warrior's Corpse Plate",
        Index: "Skeleton Warrior's Corpse Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 42,
        Code: "xlt",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+80-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "632-733",
          EquipmentType: 0,
          Name: "Templar Coat",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 52,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "-1 Drain Life",
        Index: 0
      },
      {
        PropertyString: "-2 Drain Life",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+300% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 4
      },
      {
        PropertyString: "-2 Drain Life",
        Index: 2
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Legacy of Vashna",
    Name: "Legacy of Vashna",
    SetItems: [
      {
        Type: "Knife",
        "Set": "Legacy of Vashna",
        SetPropertiesString: [
          "+8 Life after each Kill (2 Items)",
          "+5 to Mana after each Kill (3 Items)"
        ],
        Name: "Dagger of Vashna",
        Index: "Dagger of Vashna",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 30,
        Code: "9dg",
        Properties: [
          {
            PropertyString: "+75% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+10% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "Adds 35-70 to Damage",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "41 to 88"
            }
          ],
          EquipmentType: 1,
          Name: "Poignard",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 31,
          Type: {
            Name: "Knife",
            Index: "Knife",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Legacy of Vashna",
        SetPropertiesString: [
          "+5 to Raise Skeleton (2 Items)",
          "+3 to Skeleton Mastery (3 Items)"
        ],
        Name: "Mask of Vashna",
        Index: "Mask of Vashna",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 37,
        Code: "xsk",
        Properties: [
          {
            PropertyString: "+15% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+10% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "+100-115% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129-154",
          EquipmentType: 0,
          Name: "Death Mask",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 48,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Legacy of Vashna",
        SetPropertiesString: [
          "Prevent Monster Heal (3 Items)"
        ],
        Name: "Robes of Vashna",
        Index: "Robes of Vashna",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 33,
        Code: "xea",
        Properties: [
          {
            PropertyString: "+1 to Necromancer Skill Levels",
            Index: 2
          },
          {
            PropertyString: "+50% Damage to Undead",
            Index: 3
          },
          {
            PropertyString: "+300-400 Defense",
            Index: 1
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361-461",
          EquipmentType: 0,
          Name: "Serpentskin Armor",
          RequiredStrength: 43,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 36,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+15% Mana stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+15% Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "Reduces all Vendor Prices -10%",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Salander's Tirade",
    Name: "Salander's Tirade",
    SetItems: [
      {
        Type: "Polearm",
        "Set": "Salander's Tirade",
        SetPropertiesString: [
          "Adds 75-120 to Fire Damage (2 Items)"
        ],
        Name: "Lancer's Reach",
        Index: "Lancer's Reach",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 37,
        Code: "9pa",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+180-240% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Knockback",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(95-115) to (210-255)"
            }
          ],
          EquipmentType: 1,
          Name: "Partizan",
          RequiredStrength: 113,
          RequiredDexterity: 67,
          Durability: 250,
          ItemLevel: 35,
          Type: {
            Name: "Polearm",
            Index: "Polearm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Salander's Tirade",
        SetPropertiesString: [
          "+35 to Life (2 Items)"
        ],
        Name: "Salander's Mail",
        Index: "Salander's Mail",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 35,
        Code: "xng",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+120-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +15%",
            Index: 3
          },
          {
            PropertyString: "Socketed (1)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "365-429",
          EquipmentType: 0,
          Name: "Linked Mail",
          RequiredStrength: 74,
          RequiredDexterity: 0,
          Durability: 26,
          ItemLevel: 42,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Salander's Tirade",
        SetPropertiesString: [
          "+35 to Mana (2 Items)"
        ],
        Name: "Salander's Visor",
        Index: "Salander's Visor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 34,
        Code: "xlm",
        Properties: [
          {
            PropertyString: "+75-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+3 to Mana after each Kill",
            Index: 2
          },
          {
            PropertyString: "+10% Damage Taken Goes To Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "140-160",
          EquipmentType: 0,
          Name: "Casque",
          RequiredStrength: 59,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 42,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 3
      },
      {
        PropertyString: "Adds 25-50 to Damage",
        Index: 1
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "+20 Life after each Kill",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Jerik's Dragon Armor",
    Name: "Jerik's Dragon Armor",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Jerik's Dragon Armor",
        SetPropertiesString: [
          "+40% to Fire Skill Damage (2 Items)"
        ],
        Name: "Red Dragon Scale Mail",
        Index: "Red Dragon Scale Mail",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 37,
        Code: "xcl",
        Properties: [
          {
            PropertyString: "+4 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+35% Fire Absorb",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "477-548",
          EquipmentType: 0,
          Name: "Tigulated Mail",
          RequiredStrength: 86,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 43,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Jerik's Dragon Armor",
        SetPropertiesString: [
          "+30% Faster Block Rate (3 Items)",
          "+20% Increased Chance of Blocking (2 Items)"
        ],
        Name: "Black Dragon Hide Shield",
        Index: "Black Dragon Hide Shield",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 37,
        Code: "xit",
        Properties: [
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "All Resistances +60%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "15 to 24",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "135",
          EquipmentType: 0,
          Name: "Dragon Shield",
          RequiredStrength: 91,
          RequiredDexterity: 0,
          Durability: 76,
          ItemLevel: 45,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Jerik's Dragon Armor",
        SetPropertiesString: [
          "Magic Damage Reduced by 20 (3 Items)"
        ],
        Name: "Green Dragon Mask",
        Index: "Green Dragon Mask",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "xhm",
        Properties: [
          {
            PropertyString: "+100-125% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "Poison Resist +50%",
            Index: 0
          },
          {
            PropertyString: "Damage Reduced by 20",
            Index: 3
          },
          {
            PropertyString: "Poison Length Reduced by 60%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "189-232",
          EquipmentType: 0,
          Name: "Winged Helm",
          RequiredStrength: 115,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 51,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "All Resistances +15%",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "-15% Faster Run/Walk",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 1
      },
      {
        PropertyString: "+5 to All Maximum Resistances",
        Index: 4
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Onyx's Primal Rage",
    Name: "Onyx's Primal Rage",
    SetItems: [
      {
        Type: "Boots",
        "Set": "Onyx's Primal Rage",
        SetPropertiesString: [
          "+30 to Strength (4 Items)",
          "Damage Reduced by 15 (2 Items)",
          "Magic Damage Reduced by 15 (3 Items)"
        ],
        Name: "Onyx's Fallen Star",
        Index: "Onyx's Fallen Star",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "uhb",
        Properties: [
          {
            PropertyString: "+25% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "+170-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +25-35%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "83 to 149",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "138-151",
          EquipmentType: 0,
          Name: "Myrmidon Greaves",
          RequiredStrength: 208,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Onyx's Primal Rage",
        SetPropertiesString: [
          "+40% Increased Attack Speed (4 Items)",
          "+7% Mana stolen per hit (2 Items)",
          "+12% Life stolen per hit (3 Items)"
        ],
        Name: "Onyx's Solar Flair",
        Index: "Onyx's Solar Flair",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "7b7",
        Properties: [
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 75-200 to Damage",
            Index: 1
          },
          {
            PropertyString: "+2 Attacker Takes Damage of (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "+10% Damage Taken Goes To Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "(147-171) to (362-416)"
            },
            {
              Type: 1,
              DamageString: "(288-359) to (449-532)"
            }
          ],
          EquipmentType: 1,
          Name: "Champion Sword",
          RequiredStrength: 163,
          RequiredDexterity: 103,
          Durability: 250,
          ItemLevel: 77,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Onyx's Primal Rage",
        SetPropertiesString: [
          "12% Chance to cast level 19 Nova on striking (2 Items)",
          "+50 to Life (3 Items)"
        ],
        Name: "Onyx's Super Nova",
        Index: "Onyx's Super Nova",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "7gs",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+3 to Maximum Damage (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Socketed (2)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "(45-60) to (225-300)"
            },
            {
              Type: 1,
              DamageString: "(165-220) to (354-472)"
            }
          ],
          EquipmentType: 1,
          Name: "Balrog Blade",
          RequiredStrength: 185,
          RequiredDexterity: 87,
          Durability: 250,
          ItemLevel: 71,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Onyx's Primal Rage",
        SetPropertiesString: [
          "15% Chance to cast level 7 Meteor when struck (3 Items)",
          "+1 to Barbarian Skill Levels (2 Items)"
        ],
        Name: "Onyx's Meteor Shower",
        Index: "Onyx's Meteor Shower",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "upl",
        Properties: [
          {
            PropertyString: "+40% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+10-15% Increased Maximum Life",
            Index: 2
          },
          {
            PropertyString: "+10-15% Increased Maximum Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1068-1233",
          EquipmentType: 0,
          Name: "Balrog Skin",
          RequiredStrength: 165,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 76,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Primal Helm",
        "Set": "Onyx's Primal Rage",
        SetPropertiesString: [
          "+20% Increased Attack Speed (3 Items)",
          "+4 to Attack Rating (Per Character Level) (4 Items)",
          "+3% to Experience Gained (2 Items)"
        ],
        Name: "Onyx's Celestial Rage",
        Index: "Onyx's Celestial Rage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 79,
        Code: "baf",
        Properties: [
          {
            PropertyString: "+2 to Barbarian Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+15-25 to All Attributes",
            Index: 2
          },
          {
            PropertyString: "+15-20% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "117",
          EquipmentType: 0,
          Name: "Guardian Crown",
          RequiredStrength: 196,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 85,
          Type: {
            Name: "Primal Helm",
            Index: "Primal Helm",
            Class: "bar"
          },
          RequiredClass: "Barbarian"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "All Resistances +25%",
        Index: 0
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Brother Laz' Calling",
    Name: "Brother Laz' Calling",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Brother Laz' Calling",
        SetPropertiesString: [
          "+1 to Paladin Skill Levels (2 Items)",
          "+20% Faster Hit Recovery (3 Items)",
          "+3% to Experience Gained (4 Items)"
        ],
        Name: "Teachings of Brother Laz",
        Index: "Teachings of Brother Laz",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 81,
        Code: "urn",
        Properties: [
          {
            PropertyString: "+100-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 1
          },
          {
            PropertyString: "Socketed (2)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "263-308",
          EquipmentType: 0,
          Name: "Corona",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 85,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Brother Laz' Calling",
        SetPropertiesString: [
          "+1 to All Skills (2 Items)",
          "Slain Monsters Rest in Peace (3 Items)",
          "+15% Physical Damage Reduction (4 Items)"
        ],
        Name: "Holy Aura",
        Index: "Holy Aura",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 83,
        Code: "uar",
        Properties: [
          {
            PropertyString: "Level 3-5 Salvation Aura When Equipped",
            Index: 1
          },
          {
            PropertyString: "+140-190% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 2
          },
          {
            PropertyString: "Poison Length Reduced by 60%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1171-1415",
          EquipmentType: 0,
          Name: "Sacred Armor",
          RequiredStrength: 232,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 85,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Auric Shields",
        "Set": "Brother Laz' Calling",
        SetPropertiesString: [
          "+15 to Minimum Damage (3 Items)",
          "+33 to Maximum Damage (2 Items)",
          "Magic Resist +25% (4 Items)"
        ],
        Name: "Retribution",
        Index: "Retribution",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "pae",
        Properties: [
          {
            PropertyString: "+40% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+33% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+4 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+10-20 to Strength",
            Index: 4
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "46",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "169",
          EquipmentType: 0,
          Name: "Zakarum Shield",
          RequiredStrength: 142,
          RequiredDexterity: 0,
          Durability: 65,
          ItemLevel: 82,
          Type: {
            Name: "Auric Shields",
            Index: "Auric Shields",
            Class: "pal"
          },
          RequiredClass: "Paladin"
        }
      },
      {
        Type: "Gloves",
        "Set": "Brother Laz' Calling",
        SetPropertiesString: [
          "10% Chance to cast level 3 Amplify Damage when struck (2 Items)",
          "All Resistances +15% (3 Items)",
          "+50% better chance of getting magic item (4 Items)"
        ],
        Name: "Glory of Salvation",
        Index: "Glory of Salvation",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "utg",
        Properties: [
          {
            PropertyString: "+3 to Salvation",
            Index: 3
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "+75-125% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "+60 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "168-192",
          EquipmentType: 0,
          Name: "Crusader Gauntlets",
          RequiredStrength: 151,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 76,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Brother Laz' Calling",
        SetPropertiesString: [
          "20% Chance to cast level 8 Frost Nova on striking (3 Items)",
          "+25 to Dexterity (2 Items)"
        ],
        Name: "Angel's Touch",
        Index: "Angel's Touch",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 71,
        Code: "7qs",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+220-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 40-120 to Damage",
            Index: 2
          },
          {
            PropertyString: "+300% Damage to Demons",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(184-220) to (292-336)"
            }
          ],
          EquipmentType: 1,
          Name: "Seraph Rod",
          RequiredStrength: 108,
          RequiredDexterity: 69,
          Durability: 250,
          ItemLevel: 76,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15 to All Attributes",
        Index: 0
      },
      {
        PropertyString: "+33% Chance of Crushing Blow",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+4% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "The Mysterious Spin",
    Name: "The Mysterious Spin",
    SetItems: [
      {
        Type: "Circlet",
        "Set": "The Mysterious Spin",
        SetPropertiesString: [
          "+1.5 Defense (Per Character Level) (3 Items)",
          "+1.25 to Life (Per Character Level) (5 Items)",
          "+1 to Mana (Per Character Level) (5 Items)",
          "All Resistances +15% (2 Items)",
          "All Resistances +15% (3 Items)",
          "+100% extra gold from monsters (4 Items)",
          "+25% better chance of getting magic item (4 Items)"
        ],
        Name: "Spin's Enigma",
        Index: "Spin's Enigma",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 59,
        Code: "ci2",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "40",
          EquipmentType: 0,
          Name: "Tiara",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 25,
          ItemLevel: 70,
          Type: {
            Name: "Circlet",
            Index: "Circlet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "The Mysterious Spin",
        SetPropertiesString: [
          "+20% Faster Cast Rate (5 Items)",
          "+20% Faster Hit Recovery (5 Items)",
          "+120% Enhanced Defense (3 Items)",
          "Magic Resist +15% (4 Items)",
          "All Resistances +15% (4 Items)",
          "+15% Physical Damage Reduction (2 Items)"
        ],
        Name: "Spin's Paradox",
        Index: "Spin's Paradox",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 68,
        Code: "ula",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "814-925",
          EquipmentType: 0,
          Name: "Scarab Husk",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 68,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "The Mysterious Spin",
        SetPropertiesString: [
          "All Resistances +10% (5 Items)",
          "+10% Cold Absorb (2 Items)",
          "+10% Lightning Absorb (3 Items)",
          "+10% Fire Absorb (4 Items)",
          "Poison Length Reduced by 50% (5 Items)",
          "+25% better chance of getting magic item (4 Items)"
        ],
        Name: "Spin's Mystery",
        Index: "Spin's Mystery",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 63,
        Code: "ulc",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "180-230",
          EquipmentType: 0,
          Name: "Spiderweb Sash",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 61,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "The Mysterious Spin",
        SetPropertiesString: [
          "+40% Faster Block Rate (3 Items)",
          "+40% Increased Chance of Blocking (2 Items)",
          "+110% Enhanced Defense (5 Items)",
          "+15 Replenish Life (4 Items)",
          "Regenerate Mana +75% (4 Items)",
          "+15% Physical Damage Reduction (5 Items)"
        ],
        Name: "Spin's Conundrum",
        Index: "Spin's Conundrum",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 84,
        Code: "uow",
        Properties: [
          {
            PropertyString: "Requirements -80%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "18 to 28",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "145",
          EquipmentType: 0,
          Name: "Aegis",
          RequiredStrength: 219,
          RequiredDexterity: 0,
          Durability: 92,
          ItemLevel: 79,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Orb",
        "Set": "The Mysterious Spin",
        SetPropertiesString: [
          "+10% to Fire Skill Damage (2 Items)",
          "+10% to Cold Skill Damage (3 Items)",
          "+10% to Lightning Skill Damage (4 Items)",
          "Cold Resist +25% (3 Items)",
          "Lightning Resist +25% (4 Items)",
          "Fire Resist +25% (2 Items)"
        ],
        Name: "Spin's Perplexing Puzzle",
        Index: "Spin's Perplexing Puzzle",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "obc",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "18 to 50"
            }
          ],
          EquipmentType: 1,
          Name: "Eldritch Orb",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 67,
          Type: {
            Name: "Orb",
            Index: "Orb",
            Class: "sor"
          },
          RequiredClass: "Sorceress"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+15 to Slow Missiles",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+5% to Experience Gained",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Darkmage's Astral Projection",
    Name: "Darkmage's Astral Projection",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Darkmage's Astral Projection",
        SetPropertiesString: [
          "All Resistances +15% (4 Items)",
          "+15% Physical Damage Reduction (2 Items)"
        ],
        Name: "Darkmage's Falling Star",
        Index: "Darkmage's Falling Star",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "uhn",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 3
          },
          {
            PropertyString: "+150-180% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (1)",
            Index: 1
          },
          {
            PropertyString: "Ethereal (Cannot Be Repaired)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1100-1400",
          EquipmentType: 0,
          Name: "Boneweave",
          RequiredStrength: 158,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 62,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Darkmage's Astral Projection",
        SetPropertiesString: [
          "4% Chance to cast level 20 Shock Wave when struck (4 Items)",
          "+25 to Strength (4 Items)",
          "+25 to Dexterity (3 Items)"
        ],
        Name: "Darkmage's Solar Flair",
        Index: "Darkmage's Solar Flair",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "umg",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 3
          },
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+125-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Ethereal (Cannot Be Repaired)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "59",
          EquipmentType: 0,
          Name: "Vambraces",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 69,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Darkmage's Astral Projection",
        SetPropertiesString: [
          "20% Chance to cast level 14 Nova when struck (5 Items)",
          "+6% Mana stolen per hit (4 Items)",
          "+6% Life stolen per hit (2 Items)"
        ],
        Name: "Darkmage's Super Nova",
        Index: "Darkmage's Super Nova",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "umb",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 3
          },
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+140-170% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Ethereal (Cannot Be Repaired)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "69 to 118",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "108-132",
          EquipmentType: 0,
          Name: "Boneweave Boots",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 72,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Mace",
        "Set": "Darkmage's Astral Projection",
        SetPropertiesString: [
          "8% Chance to cast level 12 Meteor on striking (4 Items)",
          "+1 to All Skills (3 Items)",
          "+25% Chance of Crushing Blow (5 Items)"
        ],
        Name: "Darkmage's Meteor Shower",
        Index: "Darkmage's Meteor Shower",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "7mt",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 3
          },
          {
            PropertyString: "+25% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+220-280% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Ethereal (Cannot Be Repaired)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(137-163) to (169-201)"
            }
          ],
          EquipmentType: 1,
          Name: "Devil Star",
          RequiredStrength: 153,
          RequiredDexterity: 44,
          Durability: 0,
          ItemLevel: 70,
          Type: {
            Name: "Mace",
            Index: "Mace",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Pelt",
        "Set": "Darkmage's Astral Projection",
        SetPropertiesString: [
          "+2 to Druid Skill Levels (3 Items)",
          "+135 to Life (4 Items)",
          "+75 to Mana (5 Items)"
        ],
        Name: "Darkmage's Celestial Fury",
        Index: "Darkmage's Celestial Fury",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "dre",
        Properties: [
          {
            PropertyString: "Indestructible",
            Index: 3
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+190-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Ethereal (Cannot Be Repaired)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "301-332",
          EquipmentType: 0,
          Name: "Sky Spirit",
          RequiredStrength: 113,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 83,
          Type: {
            Name: "Pelt",
            Index: "Pelt",
            Class: "dru"
          },
          RequiredClass: "Druid"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10 to All Attributes",
        Index: 0
      },
      {
        PropertyString: "+20 to All Attributes",
        Index: 2
      },
      {
        PropertyString: "+20 to All Attributes",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+4% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Phrozen Heart's Mysticism",
    Name: "Phrozen Heart's Mysticism",
    SetItems: [
      {
        Type: "Hand to Hand 2",
        "Set": "Phrozen Heart's Mysticism",
        SetPropertiesString: [
          "+20% Chance of Crushing Blow (3 Items)",
          "+20% Deadly Strike (2 Items)",
          "+2% to Experience Gained (4 Items)"
        ],
        Name: "Cryptic Claws",
        Index: "Cryptic Claws",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "7tw",
        Properties: [
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+11% Life stolen per hit",
            Index: 1
          },
          {
            PropertyString: "+6 Replenish Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(72-96) to (132-176)"
            }
          ],
          EquipmentType: 1,
          Name: "Runic Talons",
          RequiredStrength: 115,
          RequiredDexterity: 115,
          Durability: 250,
          ItemLevel: 81,
          Type: {
            Name: "Hand to Hand 2",
            Index: "Hand to Hand 2",
            Class: "ass"
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Phrozen Heart's Mysticism",
        SetPropertiesString: [
          "+20% Physical Damage Reduction (2 Items)",
          "Cannot Be Frozen (4 Items)",
          "Poison Length Reduced by 50% (3 Items)"
        ],
        Name: "Way of the Shadow",
        Index: "Way of the Shadow",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 71,
        Code: "ung",
        Properties: [
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 0
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+75-100 to Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1267-1536",
          EquipmentType: 0,
          Name: "Diamond Mail",
          RequiredStrength: 131,
          RequiredDexterity: 0,
          Durability: 26,
          ItemLevel: 72,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Phrozen Heart's Mysticism",
        SetPropertiesString: [
          "+20% Increased Attack Speed (2 Items)",
          "+50% Enhanced Damage (3 Items)",
          "+15 to Strength (5 Items)",
          "+15 to Dexterity (4 Items)"
        ],
        Name: "Dawns Mist",
        Index: "Dawns Mist",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "uvg",
        Properties: [
          {
            PropertyString: "+100-140% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+40-50 to Mana",
            Index: 1
          },
          {
            PropertyString: "All Resistances +10-15%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "106-156",
          EquipmentType: 0,
          Name: "Vampirebone Gloves",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 63,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Phrozen Heart's Mysticism",
        SetPropertiesString: [
          "+3 to Dodge (2 Items)",
          "+3 to Evade (3 Items)",
          "+3 to Teleport (4 Items)",
          "+15 Kick Damage (5 Items)"
        ],
        Name: "Featherfoot",
        Index: "Featherfoot",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "ulb",
        Properties: [
          {
            PropertyString: "+40% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "+125-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+100-200 Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "65 to 100",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "143-165",
          EquipmentType: 0,
          Name: "Wyrmhide Boots",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 60,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Phrozen Heart's Mysticism",
        SetPropertiesString: [
          "+10 Kick Damage (3 Items)",
          "+15% Physical Damage Reduction (4 Items)",
          "+50% better chance of getting magic item (2 Items)"
        ],
        Name: "Winter's Discord",
        Index: "Winter's Discord",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "uvc",
        Properties: [
          {
            PropertyString: "10% Chance to cast level 6 Frost Nova when struck",
            Index: 1
          },
          {
            PropertyString: "+20% bonus to Attack Rating",
            Index: 2
          },
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "114-125",
          EquipmentType: 0,
          Name: "Vampirefang Belt",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 68,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "12% Chance to cast level 8 Frozen Orb when struck",
        Index: 5
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+5% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Chaos Energy",
    Name: "Chaos Energy",
    SetItems: [
      {
        Type: "Amulet",
        "Set": "Chaos Energy",
        SetPropertiesString: [
          "All Resistances +23% (3 Items)",
          "+35% better chance of getting magic item (4 Items)"
        ],
        Name: "Soulstone of Power",
        Index: "Soulstone of Power",
        Enabled: true,
        Rarity: 2,
        ItemLevel: 85,
        RequiredLevel: 81,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+15% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "Regenerate Mana +25%",
            Index: 2
          },
          {
            PropertyString: "+10% Physical Damage Reduction",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Chaos Energy",
        SetPropertiesString: [
          "+50 to Mana (2 Items)",
          "+22% Damage Taken Goes To Mana (5 Items)"
        ],
        Name: "Guiding Focus",
        Index: "Guiding Focus",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "ukp",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 2
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+120-165% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+4-8 to Mana after each Kill",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "224-244",
          EquipmentType: 0,
          Name: "Hydraskull",
          RequiredStrength: 84,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 63,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Voodoo Heads",
        "Set": "Chaos Energy",
        SetPropertiesString: [
          "+55 to Mana (5 Items)",
          "All Resistances +22% (3 Items)"
        ],
        Name: "Chaotic Shield",
        Index: "Chaotic Shield",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 83,
        Code: "nef",
        Properties: [
          {
            PropertyString: "44% Chance to cast level 17 Charged Bolt when struck",
            Index: 1
          },
          {
            PropertyString: "+3 to Necromancer Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+30% Faster Block Rate",
            Index: 3
          },
          {
            PropertyString: "+20-40% Increased Chance of Blocking",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "103",
          EquipmentType: 0,
          Name: "Bloodlord Skull",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 85,
          Type: {
            Name: "Voodoo Heads",
            Index: "Voodoo Heads",
            Class: "nec"
          },
          RequiredClass: "Necromancer"
        }
      },
      {
        Type: "Boots",
        "Set": "Chaos Energy",
        SetPropertiesString: [
          "+30% Faster Run/Walk (2 Items)",
          "+20% Increased Attack Speed (4 Items)",
          "+25% better chance of getting magic item (3 Items)"
        ],
        Name: "Treads of Energy",
        Index: "Treads of Energy",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "uvb",
        Properties: [
          {
            PropertyString: "+122 to Minimum Magic Damage",
            Index: 3
          },
          {
            PropertyString: "Adds 3-6% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+0.75 to Energy (Per Character Level)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "60 to 110",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "131-142",
          EquipmentType: 0,
          Name: "Scarabshell Boots",
          RequiredStrength: 91,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 66,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Chaos Energy",
        SetPropertiesString: [
          "+85 to Life (2 Items)",
          "+77 to Mana (4 Items)",
          "Magic Resist +20% (5 Items)"
        ],
        Name: "Band of Mysticism",
        Index: "Band of Mysticism",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "urs",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 1
          },
          {
            PropertyString: "+40% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "+20% Increased Maximum Life",
            Index: 3
          },
          {
            PropertyString: "+7-9 Replenish Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "995-1195",
          EquipmentType: 0,
          Name: "Great Hauberk",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 75,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+25 to Energy",
        Index: 0
      },
      {
        PropertyString: "+25 to Vitality",
        Index: 2
      },
      {
        PropertyString: "+25 to Dexterity",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25 to Strength",
        Index: 5
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+5% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Aiel Shieldmaiden",
    Name: "Aiel Shieldmaiden",
    SetItems: [
      {
        Type: "Amazon Javelin",
        "Set": "Aiel Shieldmaiden",
        SetPropertiesString: [
          "+2 to Amazon Skill Levels (3 Items)",
          "+20% Increased Attack Speed (2 Items)"
        ],
        Name: "Chiad's Lances",
        Index: "Chiad's Lances",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "amf",
        Properties: [
          {
            PropertyString: "+1-3 to Javelin and Spear Skills (Amazon only)",
            Index: 2
          },
          {
            PropertyString: "+220-250% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+33% Piercing Attack",
            Index: 3
          },
          {
            PropertyString: "Adds 35-70 to Damage",
            Index: 1
          },
          {
            PropertyString: "Replenishes quantity",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(131-140) to (242-259)"
            },
            {
              Type: 2,
              DamageString: "(147-157) to (281-301)"
            }
          ],
          EquipmentType: 1,
          Name: "Matriarchal Javelin",
          RequiredStrength: 107,
          RequiredDexterity: 151,
          Durability: 250,
          ItemLevel: 65,
          Type: {
            Name: "Amazon Javelin",
            Index: "Amazon Javelin",
            Class: "ama"
          },
          RequiredClass: "Amazon"
        }
      },
      {
        Type: "Shield",
        "Set": "Aiel Shieldmaiden",
        SetPropertiesString: [
          "All Resistances +25% (4 Items)",
          "+20% Physical Damage Reduction (3 Items)"
        ],
        Name: "Chiad's Wall",
        Index: "Chiad's Wall",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "uit",
        Properties: [
          {
            PropertyString: "+30% Faster Block Rate",
            Index: 3
          },
          {
            PropertyString: "+33% Increased Chance of Blocking",
            Index: 2
          },
          {
            PropertyString: "+180-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Requirements -40%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "12 to 34",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "375-428",
          EquipmentType: 0,
          Name: "Monarch",
          RequiredStrength: 156,
          RequiredDexterity: 0,
          Durability: 86,
          ItemLevel: 72,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Aiel Shieldmaiden",
        SetPropertiesString: [
          "+75 to Life (4 Items)",
          "+75 to Mana (5 Items)"
        ],
        Name: "Chiad's Heartbane",
        Index: "Chiad's Heartbane",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "ucl",
        Properties: [
          {
            PropertyString: "Adds 20-50 to Damage",
            Index: 3
          },
          {
            PropertyString: "+175-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+35 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "Requirements -35%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1075-1173",
          EquipmentType: 0,
          Name: "Loricated Mail",
          RequiredStrength: 149,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 73,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Aiel Shieldmaiden",
        SetPropertiesString: [
          "+35 to Life (3 Items)",
          "+20% better chance of getting magic item (2 Items)"
        ],
        Name: "Chiad's Halo",
        Index: "Chiad's Halo",
        Enabled: true,
        Rarity: 2,
        ItemLevel: 60,
        RequiredLevel: 71,
        Code: "rin",
        Properties: [
          {
            PropertyString: "Level 4 Holy Freeze Aura When Equipped",
            Index: 3
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "Adds 6-8% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "Adds 8-12% Life stolen per hit",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Aiel Shieldmaiden",
        SetPropertiesString: [
          "+25% to Lightning Skill Damage (3 Items)",
          "+15 Life after each Kill (4 Items)"
        ],
        Name: "Chiad's Valor",
        Index: "Chiad's Valor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "ulc",
        Properties: [
          {
            PropertyString: "-15% to Enemy Lightning Resistance",
            Index: 3
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to All Attributes",
            Index: 2
          },
          {
            PropertyString: "You feel incorporeal...",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "180-230",
          EquipmentType: 0,
          Name: "Spiderweb Sash",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 61,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 5
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+4% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Myhrginoc's Warbreeder",
    Name: "Myhrginoc's Warbreeder",
    SetItems: [
      {
        Type: "Axe",
        "Set": "Myhrginoc's Warbreeder",
        SetPropertiesString: [],
        Name: "Myhrginoc's Headhunter",
        Index: "Myhrginoc's Headhunter",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "7ga",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+280-320% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+2.25 to Maximum Damage (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Prevent Monster Heal",
            Index: 4
          },
          {
            PropertyString: "Knockback",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(224-247) to (357-394)"
            }
          ],
          EquipmentType: 1,
          Name: "Champion Axe",
          RequiredStrength: 167,
          RequiredDexterity: 59,
          Durability: 250,
          ItemLevel: 82,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Myhrginoc's Warbreeder",
        SetPropertiesString: [],
        Name: "Myhrginoc's Black Rain",
        Index: "Myhrginoc's Black Rain",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "uul",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 2
          },
          {
            PropertyString: "+170-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 3
          },
          {
            PropertyString: "+15-25% Physical Damage Reduction",
            Index: 1
          },
          {
            PropertyString: "Socketed (2)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1072-1162",
          EquipmentType: 0,
          Name: "Shadow Plate",
          RequiredStrength: 230,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 83,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Myhrginoc's Warbreeder",
        SetPropertiesString: [],
        Name: "Myhrginoc's Crimson Crusader",
        Index: "Myhrginoc's Crimson Crusader",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "ulm",
        Properties: [
          {
            PropertyString: "12% Chance to cast level 4 War Cry when struck",
            Index: 3
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+10% Increased Maximum Life",
            Index: 1
          },
          {
            PropertyString: "+10% Increased Maximum Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "255-305",
          EquipmentType: 0,
          Name: "Armet",
          RequiredStrength: 109,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 68,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Myhrginoc's Warbreeder",
        SetPropertiesString: [
          "+22% Chance of Crushing Blow (2 Items)",
          "+16% Deadly Strike (3 Items)"
        ],
        Name: "Myhrginoc's Deathmonger",
        Index: "Myhrginoc's Deathmonger",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 79,
        Code: "uhg",
        Properties: [
          {
            PropertyString: "+10 to Melee Mastery",
            Index: 2
          },
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+30-40% Enhanced Damage",
            Index: 3
          },
          {
            PropertyString: "+100-130% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "138-157",
          EquipmentType: 0,
          Name: "Ogre Gauntlets",
          RequiredStrength: 185,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "Adds 25-50 to Damage",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+10% Mana stolen per hit",
        Index: 4
      },
      {
        PropertyString: "+10% Life stolen per hit",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      },
      {
        PropertyString: "+15 to All Attributes",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Nefarious Ways",
    Name: "Nefarious Ways",
    SetItems: [
      {
        Type: "Polearm",
        "Set": "Nefarious Ways",
        SetPropertiesString: [
          "+4% extra gold from monsters (Per Character Level) (3 Items)",
          "+2% better chance of getting magic item (Per Character Level) (2 Items)"
        ],
        Name: "Sin and Greed",
        Index: "Sin and Greed",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "7s8",
        Properties: [
          {
            PropertyString: "15% Chance to cast level 15 Dim Vision on striking",
            Index: 3
          },
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+400-500% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Requirements Increased By +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(60-72) to (705-846)"
            }
          ],
          EquipmentType: 1,
          Name: "Thresher",
          RequiredStrength: 152,
          RequiredDexterity: 118,
          Durability: 250,
          ItemLevel: 71,
          Type: {
            Name: "Polearm",
            Index: "Polearm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Nefarious Ways",
        SetPropertiesString: [],
        Name: "Wicked Impulse",
        Index: "wicked Impulse",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "ult",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+100-160% Enhanced Damage",
            Index: 2
          },
          {
            PropertyString: "+40% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+125-175% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "844-949",
          EquipmentType: 0,
          Name: "Hellforge Plate",
          RequiredStrength: 196,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 78,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Nefarious Ways",
        SetPropertiesString: [
          "+30% better chance of getting magic item (3 Items)"
        ],
        Name: "Evil Reputation",
        Index: "Evil Reputation",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 76,
        Code: "utb",
        Properties: [
          {
            PropertyString: "+50% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+7% Life stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+200-250 Defense",
            Index: 0
          },
          {
            PropertyString: "+15-25 to Dexterity",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "50 to 145",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "168-186",
          EquipmentType: 0,
          Name: "Mirrored Boots",
          RequiredStrength: 163,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 81,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Nefarious Ways",
        SetPropertiesString: [
          "+7 to Mana after each Kill (2 Items)"
        ],
        Name: "Noxious Whispers",
        Index: "Noxious Whispers",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "usk",
        Properties: [
          {
            PropertyString: "+1-2 to All Skills",
            Index: 2
          },
          {
            PropertyString: "+150-200 to Life",
            Index: 0
          },
          {
            PropertyString: "+75-100 to Mana",
            Index: 1
          },
          {
            PropertyString: "+15-25 Life after each Kill",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "101",
          EquipmentType: 0,
          Name: "Demonhead",
          RequiredStrength: 102,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 74,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "-3 Drain Life",
        Index: 0
      },
      {
        PropertyString: "-10% to Experience Gained",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+50% Chance of Crushing Blow",
        Index: 3
      },
      {
        PropertyString: "+50% Deadly Strike",
        Index: 2
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 4
      },
      {
        PropertyString: "All Resistances +100%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Kraj's Memorial",
    Name: "Kraj's Memorial",
    SetItems: [
      {
        Type: "Amulet",
        "Set": "Kraj's Memorial",
        SetPropertiesString: [
          "All Resistances +18% (2 Items)",
          "Half Freeze Duration (3 Items)"
        ],
        Name: "Eternal Sleep",
        Index: "Eternal Sleep",
        Enabled: true,
        Rarity: 2,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "Slain Monsters Rest in Peace",
            Index: 1
          },
          {
            PropertyString: "+10% Increased Maximum Life",
            Index: 2
          },
          {
            PropertyString: "+10% Increased Maximum Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Kraj's Memorial",
        SetPropertiesString: [
          "Level 4 Cleansing Aura When Equipped (4 Items)",
          "+25% Faster Hit Recovery (3 Items)",
          "+35% Increased Chance of Blocking (2 Items)"
        ],
        Name: "Calming Peace",
        Index: "Calming Peace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 83,
        Code: "uow",
        Properties: [
          {
            PropertyString: "+140-160% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+125-150 Defense",
            Index: 2
          },
          {
            PropertyString: "+25-35% Physical Damage Reduction",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "18 to 28",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "145",
          EquipmentType: 0,
          Name: "Aegis",
          RequiredStrength: 219,
          RequiredDexterity: 0,
          Durability: 92,
          ItemLevel: 79,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Kraj's Memorial",
        SetPropertiesString: [
          "+70 to Life (3 Items)"
        ],
        Name: "Silk Shroud",
        Index: "Silk Shroud",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 79,
        Code: "uld",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+100-130% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Lightning Resist +25-50%",
            Index: 3
          },
          {
            PropertyString: "Fire Resist +25-50%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "417",
          EquipmentType: 0,
          Name: "Kraken Shell",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 81,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Mace",
        "Set": "Kraj's Memorial",
        SetPropertiesString: [
          "+25% Increased Attack Speed (2 Items)",
          "+18 Life after each Kill (3 Items)",
          "+3 to Mana after each Kill (4 Items)"
        ],
        Name: "Temple Guardian",
        Index: "Temple Guardian",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "7fl",
        Properties: [
          {
            PropertyString: "+8 to Zeal",
            Index: 3
          },
          {
            PropertyString: "+220-250% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+75 to Minimum Damage",
            Index: 1
          },
          {
            PropertyString: "+75% bonus to Attack Rating",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(84-85) to (256-280)"
            }
          ],
          EquipmentType: 1,
          Name: "Scourge",
          RequiredStrength: 125,
          RequiredDexterity: 77,
          Durability: 250,
          ItemLevel: 76,
          Type: {
            Name: "Mace",
            Index: "Mace",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+2% to Experience Gained",
        Index: 0
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "Adds 150-250 to Cold Damage",
        Index: 4
      },
      {
        PropertyString: "+100% Chance of Open Wounds",
        Index: 2
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "The Darkest Weaves",
    Name: "The Darkest Weaves",
    SetItems: [
      {
        Type: "Armor",
        "Set": "The Darkest Weaves",
        SetPropertiesString: [
          "+50% Faster Hit Recovery (2 Items)"
        ],
        Name: "Sundered Heart",
        Index: "Sundered Heart",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 76,
        Code: "uth",
        Properties: [
          {
            PropertyString: "+170-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (4)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "433",
          EquipmentType: 0,
          Name: "Lacquered Plate",
          RequiredStrength: 208,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 82,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "The Darkest Weaves",
        SetPropertiesString: [
          "+1 to Maximum Damage (Per Character Level) (2 Items)"
        ],
        Name: "Soulreaver",
        Index: "Soulreaver",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "7cr",
        Properties: [
          {
            PropertyString: "+220-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (6)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "81 to 185"
            }
          ],
          EquipmentType: 1,
          Name: "Phase Blade",
          RequiredStrength: 25,
          RequiredDexterity: 136,
          Durability: 0,
          ItemLevel: 73,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "The Darkest Weaves",
        SetPropertiesString: [
          "+50% Faster Block Rate (2 Items)"
        ],
        Name: "Throws of Hatred",
        Index: "Throws of Hatred",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 78,
        Code: "ush",
        Properties: [
          {
            PropertyString: "+30-50% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+170-210% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "24 to 38",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "429-492",
          EquipmentType: 0,
          Name: "Troll Nest",
          RequiredStrength: 156,
          RequiredDexterity: 0,
          Durability: 74,
          ItemLevel: 76,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20 to All Attributes",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+50% Faster Run/Walk",
        Index: 2
      },
      {
        PropertyString: "Adds 300-500 to Fire Damage",
        Index: 4
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Blood Raven's Despair",
    Name: "Blood Raven's Despair",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Blood Raven's Despair",
        SetPropertiesString: [
          "+10 to All Attributes (2 Items)"
        ],
        Name: "Blood Raven's Pain",
        Index: "Blood Raven's Pain",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "uh9",
        Properties: [
          {
            PropertyString: "+160-220 Defense",
            Index: 0
          },
          {
            PropertyString: "+80-100 to Life",
            Index: 1
          },
          {
            PropertyString: "+75-100 to Mana",
            Index: 2
          },
          {
            PropertyString: "+15% Damage Taken Goes To Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "252-303",
          EquipmentType: 0,
          Name: "Bone Visage",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 84,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Blood Raven's Despair",
        SetPropertiesString: [
          "+6% Mana stolen per hit (2 Items)"
        ],
        Name: "Blood Raven's Curse",
        Index: "Blood Raven's Curse",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "utu",
        Properties: [
          {
            PropertyString: "+25% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+9% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+675-900 Defense",
            Index: 0
          },
          {
            PropertyString: "+20-30 to Strength",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1050-1275",
          EquipmentType: 0,
          Name: "Wire Fleece",
          RequiredStrength: 111,
          RequiredDexterity: 0,
          Durability: 32,
          ItemLevel: 70,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Bow",
        "Set": "Blood Raven's Despair",
        SetPropertiesString: [
          "+10 to Immolation Arrow (2 Items)"
        ],
        Name: "Blood Raven's Redemption",
        Index: "Blood Raven's Redemption",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "6lb",
        Properties: [
          {
            PropertyString: "Level 5 Concentration Aura When Equipped",
            Index: 4
          },
          {
            PropertyString: "+10-12 to Ice Arrow",
            Index: 3
          },
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+35-70 to Minimum Damage",
            Index: 1
          },
          {
            PropertyString: "+100-150 to Maximum Damage",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(80-130) to (277-386)"
            }
          ],
          EquipmentType: 1,
          Name: "Shadow Bow",
          RequiredStrength: 52,
          RequiredDexterity: 188,
          Durability: 0,
          ItemLevel: 63,
          Type: {
            Name: "Bow",
            Index: "Bow",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+100% Piercing Attack",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "Slows target by 25%",
        Index: 2
      },
      {
        PropertyString: "Knockback",
        Index: 1
      },
      {
        PropertyString: "8-12% Reanimate as: PlagueBearer",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Narrow Path Between Light and Darkness",
    Name: "Narrow Path Between Light and Darkness",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Narrow Path Between Light and Darkness",
        SetPropertiesString: [
          "25% Chance to cast level 1 Frost Nova when struck (3 Items)",
          "+15% Increased Attack Speed (2 Items)"
        ],
        Name: "Char's Grimace of Death",
        Index: "Char's Grimace of Death",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 62,
        Code: "xh9",
        Properties: [
          {
            PropertyString: "+113% Enhanced Defense",
            Index: 3
          },
          {
            PropertyString: "+10 to Strength",
            Index: 1
          },
          {
            PropertyString: "+10 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "-2 to Light Radius",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129",
          EquipmentType: 0,
          Name: "Grim Helm",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 50,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Narrow Path Between Light and Darkness",
        SetPropertiesString: [
          "+45 to Mana (2 Items)",
          "Regenerate Mana +10% (4 Items)",
          "Magic Damage Reduced by 10 (3 Items)"
        ],
        Name: "Char's Annulus of Obscurity",
        Index: "Char's Annulus of Obscurity",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 40,
        RequiredLevel: 51,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+1 to Paladin Skill Levels",
            Index: 1
          },
          {
            PropertyString: "+12-15 to Sanctuary",
            Index: 2
          },
          {
            PropertyString: "-1 to Light Radius",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Narrow Path Between Light and Darkness",
        SetPropertiesString: [
          "+45 to Life (2 Items)",
          "Damage Reduced by 10 (3 Items)"
        ],
        Name: "Char's Blessed Reflection",
        Index: "Char's Blessed Reflection",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 40,
        RequiredLevel: 51,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+1 to Necromancer Skill Levels",
            Index: 1
          },
          {
            PropertyString: "+8-12 to Decrepify",
            Index: 2
          },
          {
            PropertyString: "+1 to Light Radius",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Narrow Path Between Light and Darkness",
        SetPropertiesString: [
          "+13-16 to Merc Static Field (3 Items)",
          "Adds 1-50 to Lightning Damage (2 Items)",
          "Fire Resist +15% (4 Items)"
        ],
        Name: "Char's Hand of Blessed Light",
        Index: "Char's Hand of Blessed Light",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 67,
        Code: "7sc",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+1 to Offensive Auras (Paladin only)",
            Index: 4
          },
          {
            PropertyString: "+75-110% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+15% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "Socketed (2)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(70-84) to (91-109)"
            }
          ],
          EquipmentType: 1,
          Name: "Mighty Scepter",
          RequiredStrength: 125,
          RequiredDexterity: 65,
          Durability: 250,
          ItemLevel: 62,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Narrow Path Between Light and Darkness",
        SetPropertiesString: [
          "+1 to All Skills (3 Items)"
        ],
        Name: "Char's Carapace",
        Index: "Char's Carapace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 65,
        Code: "uui",
        Properties: [
          {
            PropertyString: "+65-110% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +15-25%",
            Index: 2
          },
          {
            PropertyString: "+10-15% Physical Damage Reduction",
            Index: 3
          },
          {
            PropertyString: "Socketed (1)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361",
          EquipmentType: 0,
          Name: "Dusk Shroud",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 65,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+50 to Life",
        Index: 0
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+10 to All Maximum Resistances",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Treasure Hunter",
    Name: "Treasure Hunter",
    SetItems: [
      {
        Type: "Belt",
        "Set": "Treasure Hunter",
        SetPropertiesString: [],
        Name: "Kingpin's Wrap",
        Index: "Kingpin's Wrap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 25,
        Code: "ztb",
        Properties: [
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+40-60% Enhanced Defense",
            Index: 4
          },
          {
            PropertyString: "+25-35 Defense",
            Index: 2
          },
          {
            PropertyString: "+50-80% extra gold from monsters",
            Index: 5
          },
          {
            PropertyString: "+30% better chance of getting magic item",
            Index: 0
          },
          {
            PropertyString: "+2 to Light Radius",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "66-83",
          EquipmentType: 0,
          Name: "Battle Belt",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Treasure Hunter",
        SetPropertiesString: [],
        Name: "Kingpin's Greaves",
        Index: "Kingpin's Greaves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 42,
        Code: "xtb",
        Properties: [
          {
            PropertyString: "+25% Faster Run/Walk",
            Index: 4
          },
          {
            PropertyString: "Adds 15-25 to Damage",
            Index: 6
          },
          {
            PropertyString: "+150-190% Enhanced Defense",
            Index: 5
          },
          {
            PropertyString: "+10 to Strength",
            Index: 1
          },
          {
            PropertyString: "+10 to Vitality",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Damage of +5-10",
            Index: 7
          },
          {
            PropertyString: "+30-50% better chance of getting magic item",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "37 to 64",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "90-100",
          EquipmentType: 0,
          Name: "Battle Boots",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 49,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Treasure Hunter",
        SetPropertiesString: [
          "+10 to Vitality (2 Items)",
          "+10 to Energy (3 Items)"
        ],
        Name: "Kingpin's Ire",
        Index: "Kingpin's Ire",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 42,
        Code: "xpl",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "Magic Damage Reduced by 10",
            Index: 4
          },
          {
            PropertyString: "+1.25% better chance of getting magic item (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Repairs 0.2 durability per second",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "531-632",
          EquipmentType: 0,
          Name: "Russet Armor",
          RequiredStrength: 97,
          RequiredDexterity: 0,
          Durability: 90,
          ItemLevel: 49,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Treasure Hunter",
        SetPropertiesString: [
          "+44 to Life (5 Items)",
          "+15% better chance of getting magic item (4 Items)"
        ],
        Name: "Kingpin's Signet",
        Index: "Kingpin's Signet",
        Enabled: true,
        Rarity: 4,
        ItemLevel: 7,
        RequiredLevel: 7,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+50-80 to Attack Rating",
            Index: 2
          },
          {
            PropertyString: "Magic Damage Reduced by 3",
            Index: 0
          },
          {
            PropertyString: "Attacker Takes Damage of +3-7",
            Index: 1
          },
          {
            PropertyString: "+10-15% better chance of getting magic item",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Treasure Hunter",
        SetPropertiesString: [],
        Name: "Kingpin's Crown",
        Index: "Kingpin's Crown",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 61,
        Code: "uap",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+1.5 to Life (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "+1.5 to Mana (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+2 to All Attributes",
            Index: 0
          },
          {
            PropertyString: "+10% Physical Damage Reduction",
            Index: 5
          },
          {
            PropertyString: "+50% better chance of getting magic item",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "98",
          EquipmentType: 0,
          Name: "Shako",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 58,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Treasure Hunter",
        SetPropertiesString: [
          "Adds 50-120 to Damage (6 Items)"
        ],
        Name: "Kingpin's Blade",
        Index: "Kingpin's Blade",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 35,
        Code: "9fc",
        Properties: [
          {
            PropertyString: "+60-120% Enhanced Damage",
            Index: 4
          },
          {
            PropertyString: "+5-15 to Dexterity",
            Index: 5
          },
          {
            PropertyString: "+15 to Mana",
            Index: 3
          },
          {
            PropertyString: "+2.5% extra gold from monsters (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+1% better chance of getting magic item (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Socketed (2)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(25-35) to (56-77)"
            }
          ],
          EquipmentType: 1,
          Name: "Tulwar",
          RequiredStrength: 70,
          RequiredDexterity: 42,
          Durability: 250,
          ItemLevel: 37,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 1
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 2
      },
      {
        PropertyString: "+200% better chance of getting magic item",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Yohann's Savant",
    Name: "Yohann's Savant",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Yohann's Savant",
        SetPropertiesString: [],
        Name: "Wiseman's Cap",
        Index: "Wiseman's Cap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 25,
        RequiredLevel: 28,
        Code: "crn",
        Properties: [
          {
            PropertyString: "+1 to Sorceress Skill Levels",
            Index: 0
          },
          {
            PropertyString: "-10-15% to Enemy Lightning Resistance",
            Index: 3
          },
          {
            PropertyString: "Lightning Resist +15-25%",
            Index: 2
          },
          {
            PropertyString: "+2-3 to Mana after each Kill",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "25",
          EquipmentType: 0,
          Name: "Crown",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 29,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Yohann's Savant",
        SetPropertiesString: [
          "+5 Replenish Life (4 Items)"
        ],
        Name: "Sage's Leather",
        Index: "Sage's Leather",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 32,
        RequiredLevel: 33,
        Code: "xla",
        Properties: [
          {
            PropertyString: "+15 to Strength",
            Index: 0
          },
          {
            PropertyString: "+55-75 to Life",
            Index: 3
          },
          {
            PropertyString: "Damage Reduced by 15",
            Index: 1
          },
          {
            PropertyString: "Magic Damage Reduced by 15",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "270-369",
          EquipmentType: 0,
          Name: "Demonhide Armor",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 37,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Yohann's Savant",
        SetPropertiesString: [
          "+35% better chance of getting magic item (3 Items)"
        ],
        Name: "Gloves of Knowledge",
        Index: "Gloves of Knowledge",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 38,
        Code: "xmg",
        Properties: [
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+35-45 to Mana",
            Index: 0
          },
          {
            PropertyString: "+10-15 Life after each Kill",
            Index: 2
          },
          {
            PropertyString: "+1-3 to Mana after each Kill",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Heavy Bracers",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Staff",
        "Set": "Yohann's Savant",
        SetPropertiesString: [
          "+1 to Whirlwind (4 Items)",
          "+5% Mana stolen per hit (3 Items)"
        ],
        Name: "Arcane Battlestaff",
        Index: "Arcane Battlestaff",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 23,
        Code: "8bs",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+110-140% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "Adds 35-80 to Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 6-8% Life stolen per hit",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(64-68) to (151-161)"
            }
          ],
          EquipmentType: 1,
          Name: "Gothic Staff",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 42,
          Type: {
            Name: "Staff",
            Index: "Staff",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+125 to Mana",
        Index: 1
      },
      {
        PropertyString: "Regenerate Mana +75%",
        Index: 4
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 2
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Zhoulomcrist's Dread",
    Name: "Zhoulomcrist's Dread",
    SetItems: [
      {
        Type: "Helm",
        "Set": "Zhoulomcrist's Dread",
        SetPropertiesString: [
          "+1 to Warmth (4 Items)",
          "+1 to Warmth (5 Items)",
          "Adds 25-35 to Cold Damage (3 Items)"
        ],
        Name: "Unholy Desires",
        Index: "Unholy Desires",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 25,
        RequiredLevel: 31,
        Code: "xap",
        Properties: [
          {
            PropertyString: "+15% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+35-50 to Mana",
            Index: 0
          },
          {
            PropertyString: "+12-15% Damage Taken Goes To Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "80-92",
          EquipmentType: 0,
          Name: "War Hat",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 34,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Axe",
        "Set": "Zhoulomcrist's Dread",
        SetPropertiesString: [
          "20% Chance to cast level 15 Life Tap when you Kill an Enemy (4 Items)"
        ],
        Name: "Darkest Wishes",
        Index: "Darkest Wishes",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "72a",
        Properties: [
          {
            PropertyString: "+8 to Zeal",
            Index: 3
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+220-260% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Knockback",
            Index: 2
          },
          {
            PropertyString: "Level 15 Clay Golem (65 Charges)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(105-118) to (211-237)"
            }
          ],
          EquipmentType: 1,
          Name: "Ettin Axe",
          RequiredStrength: 145,
          RequiredDexterity: 45,
          Durability: 250,
          ItemLevel: 70,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Zhoulomcrist's Dread",
        SetPropertiesString: [
          "Damage Reduced by 20 (3 Items)",
          "Magic Damage Reduced by 25 (4 Items)"
        ],
        Name: "Shadowed Plate",
        Index: "Shadowed Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "utp",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 0
          },
          {
            PropertyString: "+175-195% Enhanced Defense",
            Index: 3
          },
          {
            PropertyString: "+1-5% to Experience Gained",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1150-1315",
          EquipmentType: 0,
          Name: "Archon Plate",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 84,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Zhoulomcrist's Dread",
        SetPropertiesString: [
          "Freezes target +2 (4 Items)"
        ],
        Name: "Draven Coil",
        Index: "Draven Coil",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 40,
        RequiredLevel: 50,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+10% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+10-20% bonus to Attack Rating",
            Index: 3
          },
          {
            PropertyString: "+80-120 Defense",
            Index: 2
          },
          {
            PropertyString: "+35-50 to Life",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+5 Replenish Life",
        Index: 0
      },
      {
        PropertyString: "Regenerate Mana +50%",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+3 to Lower Resist",
        Index: 4
      },
      {
        PropertyString: "Magic Resist +25%",
        Index: 2
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 3
      },
      {
        PropertyString: "+30% Physical Damage Reduction",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "The Warlord of Blood",
    Name: "The Warlord of Blood",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [
          "+20% bonus to Attack Rating (4 Items)",
          "+15% Chance of Crushing Blow (3 Items)",
          "+15% Deadly Strike (2 Items)",
          "+250 Defense (6 Items)",
          "+10% Physical Damage Reduction (5 Items)"
        ],
        Name: "Tortured Soul Gauntlets",
        Index: "Tortured Soul Gauntlets",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 29,
        Code: "hgl",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "+30-50% Enhanced Damage",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Gauntlets",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [
          "Adds 10-20 to Damage (3 Items)",
          "+313 Defense (6 Items)",
          "Magic Resist +10% (4 Items)",
          "All Resistances +10% (2 Items)",
          "+1.5 Attacker Takes Damage of (Per Character Level) (5 Items)"
        ],
        Name: "Hell's Torment Greaves",
        Index: "Hell's Torment Greaves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 28,
        RequiredLevel: 31,
        Code: "hbt",
        Properties: [
          {
            PropertyString: "18% Chance to cast level 1 Life Tap on striking",
            Index: 1
          },
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "10 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Greaves",
          RequiredStrength: 70,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [
          "Adds 25-200 to Lightning Damage (6 Items)",
          "-15% to Enemy Lightning Resistance (4 Items)",
          "Lightning Resist +33% (3 Items)"
        ],
        Name: "Bloody Visage Helm",
        Index: "Bloody Visage Helm",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "xhm",
        Properties: [
          {
            PropertyString: "Knockback",
            Index: 3
          },
          {
            PropertyString: "+120-170% Enhanced Defense",
            Index: 4
          },
          {
            PropertyString: "+70-100 to Life",
            Index: 0
          },
          {
            PropertyString: "+33-45 to Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "189-232",
          EquipmentType: 0,
          Name: "Winged Helm",
          RequiredStrength: 115,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 51,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [
          "Adds 100-150 to Fire Damage (6 Items)",
          "-15% to Enemy Fire Resistance (4 Items)",
          "Fire Resist +33% (3 Items)"
        ],
        Name: "Vengeance Unleashed",
        Index: "Vengeance Unleashed",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 45,
        RequiredLevel: 47,
        Code: "zhb",
        Properties: [
          {
            PropertyString: "+180-200% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+50-75 to Life",
            Index: 2
          },
          {
            PropertyString: "Damage Reduced by 22",
            Index: 3
          },
          {
            PropertyString: "Magic Damage Reduced by 20",
            Index: 4
          },
          {
            PropertyString: "Socketed (2)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "41",
          EquipmentType: 0,
          Name: "War Belt",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [],
        Name: "Elysian Fields",
        Index: "Elysian Fields",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 68,
        Code: "upk",
        Properties: [
          {
            PropertyString: "+40% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+20-40% Increased Chance of Blocking",
            Index: 0
          },
          {
            PropertyString: "Adds 100-150 to Cold Damage",
            Index: 6
          },
          {
            PropertyString: "-15% to Enemy Cold Resistance",
            Index: 5
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 4
          },
          {
            PropertyString: "All Resistances +35-50%",
            Index: 3
          },
          {
            PropertyString: "+15-20% Physical Damage Reduction",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "26 to 40",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "384-444",
          EquipmentType: 0,
          Name: "Blade Barrier",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 83,
          ItemLevel: 68,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "The Warlord of Blood",
        SetPropertiesString: [
          "+2 to All Skills (6 Items)",
          "Prevent Monster Heal (6 Items)"
        ],
        Name: "Death and Decay",
        Index: "Death and Decay",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "utp",
        Properties: [
          {
            PropertyString: "+180-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15-25 to Strength",
            Index: 4
          },
          {
            PropertyString: "+15-20 to Dexterity",
            Index: 3
          },
          {
            PropertyString: "+75-100 to Life",
            Index: 1
          },
          {
            PropertyString: "+35-50 to Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1150-1315",
          EquipmentType: 0,
          Name: "Archon Plate",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 84,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 4
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 2
      },
      {
        PropertyString: "+200% extra gold from monsters",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Darque Necromancy",
    Name: "Darque Necromancy",
    SetItems: [
      {
        Type: "Belt",
        "Set": "Darque Necromancy",
        SetPropertiesString: [
          "+1 to Mana (Per Character Level) (5 Items)"
        ],
        Name: "Dying Curses",
        Index: "Dying Curses",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 30,
        Code: "zlb",
        Properties: [
          {
            PropertyString: "100% Chance to cast level 40 Weaken when you Level-Up",
            Index: 2
          },
          {
            PropertyString: "+1 to Curses (Necromancer only)",
            Index: 1
          },
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54-63",
          EquipmentType: 0,
          Name: "Demonhide Sash",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Darque Necromancy",
        SetPropertiesString: [
          "+25% Increased Chance of Blocking (4 Items)"
        ],
        Name: "Lich's Rites",
        Index: "Lich's Rites",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 63,
        Code: "uuc",
        Properties: [
          {
            PropertyString: "100% Chance to cast level 33 Bone Armor when you Level-Up",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+80-140% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Socketed (1)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "16 to 30",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "220-240",
          EquipmentType: 0,
          Name: "Heater",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 88,
          ItemLevel: 58,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Wand",
        "Set": "Darque Necromancy",
        SetPropertiesString: [],
        Name: "Twilight of Evil",
        Index: "Twilight of Evil",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 29,
        Code: "9yw",
        Properties: [
          {
            PropertyString: "Level 1-7 Thorns Aura When Equipped",
            Index: 3
          },
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+25% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+1-5 Replenish Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "8 to 24"
            }
          ],
          EquipmentType: 1,
          Name: "Petrified Wand",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 38,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Darque Necromancy",
        SetPropertiesString: [
          "Cold Resist +20% (3 Items)",
          "Lightning Resist +10% (4 Items)",
          "Fire Resist +15% (2 Items)",
          "Poison Resist +25% (5 Items)"
        ],
        Name: "Dark Rituals",
        Index: "Dark Rituals",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 40,
        RequiredLevel: 50,
        Code: "xtp",
        Properties: [
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+300-400 Defense",
            Index: 0
          },
          {
            PropertyString: "+10-15% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "525-725",
          EquipmentType: 0,
          Name: "Mage Plate",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 60,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Darque Necromancy",
        SetPropertiesString: [
          "+100% extra gold from monsters (5 Items)"
        ],
        Name: "Legacy in Blood",
        Index: "Legacy in Blood",
        Enabled: true,
        Rarity: 4,
        ItemLevel: 33,
        RequiredLevel: 35,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+50-75% better chance of getting magic item",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to Necromancer Skill Levels",
        Index: 0
      },
      {
        PropertyString: "+1 to Necromancer Skill Levels",
        Index: 2
      },
      {
        PropertyString: "+1 to Necromancer Skill Levels",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "5% Chance to cast level 10 Iron Maiden when struck",
        Index: 1
      },
      {
        PropertyString: "+3 to Revive",
        Index: 4
      },
      {
        PropertyString: "+300% Damage to Undead",
        Index: 3
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 0
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Marhawkman's Disguise",
    Name: "Marhawkman's Disguise",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "Marhawkman's Disguise",
        SetPropertiesString: [],
        Name: "Andariel's Claw",
        Index: "Andariel's Claw",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "uvg",
        Properties: [
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+15% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "+90-130% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+40-70 to Mana",
            Index: 5
          },
          {
            PropertyString: "Poison Resist +60-80%",
            Index: 3
          },
          {
            PropertyString: "Poison Length Reduced by 60%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "106-156",
          EquipmentType: 0,
          Name: "Vampirebone Gloves",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 63,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Marhawkman's Disguise",
        SetPropertiesString: [],
        Name: "Andariel's Hooves",
        Index: "Andariel's Hooves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 72,
        Code: "umb",
        Properties: [
          {
            PropertyString: "+25% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+1200 Poison Damage Over 12 Seconds",
            Index: 4
          },
          {
            PropertyString: "+80-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+20-30 to Dexterity",
            Index: 2
          },
          {
            PropertyString: "All Resistances +10-20%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "69 to 118",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "108-132",
          EquipmentType: 0,
          Name: "Boneweave Boots",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 72,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Marhawkman's Disguise",
        SetPropertiesString: [],
        Name: "Andariel's Mask",
        Index: "Andariel's Mask",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "xsk",
        Properties: [
          {
            PropertyString: "+75-100 Defense",
            Index: 0
          },
          {
            PropertyString: "+20-30 to Vitality",
            Index: 4
          },
          {
            PropertyString: "+20-30 to Energy",
            Index: 3
          },
          {
            PropertyString: "+15-20 Life after each Kill",
            Index: 1
          },
          {
            PropertyString: "+3-6 to Mana after each Kill",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "129-154",
          EquipmentType: 0,
          Name: "Death Mask",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 48,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Marhawkman's Disguise",
        SetPropertiesString: [
          "+4% to Experience Gained (4 Items)"
        ],
        Name: "Andariel's Breastbone",
        Index: "Andariel's Breastbone",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 60,
        Code: "ula",
        Properties: [
          {
            PropertyString: "+25% to Poison Skill Damage",
            Index: 4
          },
          {
            PropertyString: "-25% to Enemy Poison Resistance",
            Index: 5
          },
          {
            PropertyString: "Prevent Monster Heal",
            Index: 1
          },
          {
            PropertyString: "+120-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Damage Reduced by 20",
            Index: 2
          },
          {
            PropertyString: "Magic Damage Reduced by 20",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "814-925",
          EquipmentType: 0,
          Name: "Scarab Husk",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 68,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "100% Chance to cast level 2 Poison Nova when struck",
        Index: 1
      },
      {
        PropertyString: "8% Chance to cast level 12 Poison Nova on striking",
        Index: 2
      },
      {
        PropertyString: "+8% Mana stolen per hit",
        Index: 5
      },
      {
        PropertyString: "+8% Life stolen per hit",
        Index: 4
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Aragorn's Scorn",
    Name: "Aragorn's Scorn",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Aragorn's Scorn",
        SetPropertiesString: [],
        Name: "Aragorn's Contempt",
        Index: "Aragorn's Contempt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 33,
        Code: "xui",
        Properties: [
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Magic Resist +10%",
            Index: 3
          },
          {
            PropertyString: "Fire Resist +25-35%",
            Index: 1
          },
          {
            PropertyString: "Damage Reduced by 15",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "206-226",
          EquipmentType: 0,
          Name: "Ghost Armor",
          RequiredStrength: 38,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 34,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Axe",
        "Set": "Aragorn's Scorn",
        SetPropertiesString: [
          "Adds 45-135 to Damage (4 Items)",
          "+8-12 Life after each Kill (2 Items)"
        ],
        Name: "Aragorn's Derision",
        Index: "Aragorn's Derision",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "9wa",
        Properties: [
          {
            PropertyString: "+120-200% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 150-250 to Fire Damage",
            Index: 1
          },
          {
            PropertyString: "-15-20% to Enemy Fire Resistance",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(35-48) to (99-135)"
            }
          ],
          EquipmentType: 1,
          Name: "Naga",
          RequiredStrength: 121,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 48,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Aragorn's Scorn",
        SetPropertiesString: [],
        Name: "Aragorn's Indignation",
        Index: "Aragorn's Indignation",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 62,
        Code: "uml",
        Properties: [
          {
            PropertyString: "+20% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+20-30% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "Prevent Monster Heal",
            Index: 3
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +25-35%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "17 to 29",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "239-283",
          EquipmentType: 0,
          Name: "Luna",
          RequiredStrength: 100,
          RequiredDexterity: 0,
          Durability: 84,
          ItemLevel: 61,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Aragorn's Scorn",
        SetPropertiesString: [
          "+25 to Dexterity (3 Items)"
        ],
        Name: "Aragorn's Disdain",
        Index: "Aragorn's Disdain",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 43,
        Code: "xhb",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+8-15 Kick Damage",
            Index: 2
          },
          {
            PropertyString: "Adds 3-6% Mana stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+100-125% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "39 to 80",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "88-99",
          EquipmentType: 0,
          Name: "War Boots",
          RequiredStrength: 125,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "25% Chance to cast level 2 Static Field when struck",
        Index: 2
      },
      {
        PropertyString: "+1 to Howl",
        Index: 3
      },
      {
        PropertyString: "+100% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "Slows target by 15%",
        Index: 4
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Bogrot's Magic",
    Name: "Bogrot's Magic",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Bogrot's Magic",
        SetPropertiesString: [],
        Name: "Winter's Embrace",
        Index: "Winter's Embrace",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 34,
        Code: "xea",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "-10-20% to Enemy Cold Resistance",
            Index: 3
          },
          {
            PropertyString: "+250-350 Defense",
            Index: 2
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361-461",
          EquipmentType: 0,
          Name: "Serpentskin Armor",
          RequiredStrength: 43,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 36,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Mace",
        "Set": "Bogrot's Magic",
        SetPropertiesString: [
          "Regenerate Mana +50% (3 Items)"
        ],
        Name: "Baptism by Fire",
        Index: "Baptism by Fire",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 31,
        Code: "9ma",
        Properties: [
          {
            PropertyString: "Level 3-5 Holy Fire Aura When Equipped",
            Index: 3
          },
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+35-50 to Mana",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "15 to 23"
            }
          ],
          EquipmentType: 1,
          Name: "Flanged Mace",
          RequiredStrength: 61,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 35,
          Type: {
            Name: "Mace",
            Index: "Mace",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Bogrot's Magic",
        SetPropertiesString: [],
        Name: "Between Fire and Ice",
        Index: "Between Fire and Ice",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 48,
        RequiredLevel: 48,
        Code: "urg",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "+35% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+15-25 to Strength",
            Index: 4
          },
          {
            PropertyString: "+40-75% better chance of getting magic item",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "14 to 32",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "119",
          EquipmentType: 0,
          Name: "Hyperion",
          RequiredStrength: 156,
          RequiredDexterity: 0,
          Durability: 82,
          ItemLevel: 64,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20 to Dexterity",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+15% Increased Chance of Blocking",
        Index: 5
      },
      {
        PropertyString: "+350 Defense",
        Index: 4
      },
      {
        PropertyString: "+75 to Life",
        Index: 3
      },
      {
        PropertyString: "+3% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+200% extra gold from monsters",
        Index: 0
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Cedric's Jinx",
    Name: "Cedric's Jinx",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Cedric's Jinx",
        SetPropertiesString: [
          "+5 Defense (Per Character Level) (3 Items)"
        ],
        Name: "Call of Gylandra",
        Index: "Call of Gylandra",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "xla",
        Properties: [
          {
            PropertyString: "+120-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +15-25%",
            Index: 2
          },
          {
            PropertyString: "+15-25% Physical Damage Reduction",
            Index: 1
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "270-369",
          EquipmentType: 0,
          Name: "Demonhide Armor",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 28,
          ItemLevel: 37,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Hammer",
        "Set": "Cedric's Jinx",
        SetPropertiesString: [
          "+6% Mana stolen per hit (2 Items)",
          "+6% Life stolen per hit (3 Items)"
        ],
        Name: "Return to Hydrakal",
        Index: "Return to Hydrakal",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "7wh",
        Properties: [
          {
            PropertyString: "+60% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+175-225% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (2)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(137-162) to (167-198)"
            }
          ],
          EquipmentType: 1,
          Name: "Legendary Mallet",
          RequiredStrength: 189,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 82,
          Type: {
            Name: "Hammer",
            Index: "Hammer",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Cedric's Jinx",
        SetPropertiesString: [],
        Name: "Neprida's Kiss",
        Index: "Neprida's Kiss",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 43,
        Code: "xrg",
        Properties: [
          {
            PropertyString: "+35-50% Enhanced Damage",
            Index: 3
          },
          {
            PropertyString: "+10-20% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "Ignore Target's Defense",
            Index: 2
          },
          {
            PropertyString: "+1.62 Defense (Per Character Level)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "11 to 15",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "53",
          EquipmentType: 0,
          Name: "Scutum",
          RequiredStrength: 71,
          RequiredDexterity: 0,
          Durability: 62,
          ItemLevel: 42,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [],
    FullProperties: [
      {
        PropertyString: "25% Chance to cast level 9 Battle Orders when struck",
        Index: 2
      },
      {
        PropertyString: "25% Chance to cast level 12 Bone Armor when struck",
        Index: 3
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "Adds 200-250 to Cold Damage",
        Index: 4
      },
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Dragon Reborn",
    Name: "Dragon Reborn",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Dragon Reborn",
        SetPropertiesString: [
          "+10 Life after each Kill (2 Items)",
          "+3 to Mana after each Kill (4 Items)"
        ],
        Name: "Warder's Vest",
        Index: "Warder's Vest",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 41,
        Code: "xtu",
        Properties: [
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "+75% extra gold from monsters",
            Index: 1
          },
          {
            PropertyString: "+25-30% better chance of getting magic item",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361-417",
          EquipmentType: 0,
          Name: "Trellised Armor",
          RequiredStrength: 61,
          RequiredDexterity: 0,
          Durability: 32,
          ItemLevel: 40,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Dragon Reborn",
        SetPropertiesString: [],
        Name: "Heron-Branded Blade",
        Index: "Heron-Branded Blade",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 44,
        Code: "9cr",
        Properties: [
          {
            PropertyString: "4% Chance to cast level 20 Weaken on striking",
            Index: 2
          },
          {
            PropertyString: "+35-50 to Minimum Damage",
            Index: 0
          },
          {
            PropertyString: "+100-140 to Maximum Damage",
            Index: 1
          },
          {
            PropertyString: "+200% Damage to Demons",
            Index: 3
          },
          {
            PropertyString: "+10-15 Cold Absorb",
            Index: 5
          },
          {
            PropertyString: "+10-15 Fire Absorb",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(48-63) to (135-175)"
            }
          ],
          EquipmentType: 1,
          Name: "Dimensional Blade",
          RequiredStrength: 85,
          RequiredDexterity: 60,
          Durability: 250,
          ItemLevel: 37,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Dragon Reborn",
        SetPropertiesString: [
          "+40 to Life (5 Items)"
        ],
        Name: "Ter'Angreal Ring",
        Index: "Ter'Angreal Ring",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 60,
        RequiredLevel: 67,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+5% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "+10% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+8-15 to All Attributes",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Dragon Reborn",
        SetPropertiesString: [
          "35% Chance to cast level 1 Decrepify when struck (5 Items)",
          "+1 to All Skills (6 Items)"
        ],
        Name: "Ser'Angreal Necklace",
        Index: "Ser'Angreal Necklace",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 60,
        RequiredLevel: 67,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+10% Faster Hit Recovery",
            Index: 0
          },
          {
            PropertyString: "+5-10% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+4-7% to Experience Gained",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Dragon Reborn",
        SetPropertiesString: [],
        Name: "Taint of Saidin",
        Index: "Taint of Saidin",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 67,
        Code: "uuc",
        Properties: [
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 4
          },
          {
            PropertyString: "+20% Faster Block Rate",
            Index: 3
          },
          {
            PropertyString: "+10-25% Increased Chance of Blocking",
            Index: 2
          },
          {
            PropertyString: "+130-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+5-8 Replenish Life",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "16 to 30",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "220-240",
          EquipmentType: 0,
          Name: "Heater",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 88,
          ItemLevel: 58,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Dragon Reborn",
        SetPropertiesString: [
          "+30% Faster Run/Walk (3 Items)",
          "+1 to Life (Per Character Level) (6 Items)",
          "+0.62 to Mana (Per Character Level) (5 Items)",
          "All Resistances +15% (4 Items)",
          "+25% better chance of getting magic item (2 Items)"
        ],
        Name: "Aviendha's Gift",
        Index: "Aviendha's Gift",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 10,
        RequiredLevel: 21,
        Code: "vbt",
        Properties: [
          {
            PropertyString: "+25-35 Defense",
            Index: 0
          },
          {
            PropertyString: "+10 to Dexterity",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "4 to 10",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "30-40",
          EquipmentType: 0,
          Name: "Heavy Boots",
          RequiredStrength: 18,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 7,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+35% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+65% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+7 to Sacrifice",
        Index: 2
      },
      {
        PropertyString: "+30% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+40 to Maximum Damage",
        Index: 4
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 1
      },
      {
        PropertyString: "+3.12% extra gold from monsters (Per Character Level)",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Soldier's Cairn",
    Name: "Soldier's Cairn",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Soldier's Cairn",
        SetPropertiesString: [],
        Name: "Heroes Stand",
        Index: "Heroes Stand",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 35,
        Code: "xng",
        Properties: [
          {
            PropertyString: "+50-75% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+130-170% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "365-429",
          EquipmentType: 0,
          Name: "Linked Mail",
          RequiredStrength: 74,
          RequiredDexterity: 0,
          Durability: 26,
          ItemLevel: 42,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Soldier's Cairn",
        SetPropertiesString: [
          "+3 to Melee Mastery (2 Items)",
          "Adds 100-150 to Damage (3 Items)",
          "+8% Life stolen per hit (2 Items)"
        ],
        Name: "Warrior's Heroism",
        Index: "Warrior's Heroism",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 55,
        Code: "9cm",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (1-4)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "(39-52) to (90-120)"
            },
            {
              Type: 1,
              DamageString: "(78-104) to (183-244)"
            }
          ],
          EquipmentType: 1,
          Name: "Dacian Falx",
          RequiredStrength: 91,
          RequiredDexterity: 20,
          Durability: 250,
          ItemLevel: 42,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Soldier's Cairn",
        SetPropertiesString: [
          "+1 to All Skills (2 Items)"
        ],
        Name: "Martyr's Principle",
        Index: "Martyr's Principle",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "utg",
        Properties: [
          {
            PropertyString: "+25% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+7-15% Deadly Strike",
            Index: 2
          },
          {
            PropertyString: "+100-160 Defense",
            Index: 0
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "168-192",
          EquipmentType: 0,
          Name: "Crusader Gauntlets",
          RequiredStrength: 151,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 76,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+65% Chance of Open Wounds",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+150 to Maximum Damage",
        Index: 2
      },
      {
        PropertyString: "All Resistances +20%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Gweibret's Rule",
    Name: "Gweibret's Rule",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Gweibret's Rule",
        SetPropertiesString: [],
        Name: "Judicial Decree",
        Index: "Judicial Decree",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "xcl",
        Properties: [
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+170-210% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+1.25 to Life (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "+0.75 to Mana (Per Character Level)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "477-548",
          EquipmentType: 0,
          Name: "Tigulated Mail",
          RequiredStrength: 86,
          RequiredDexterity: 0,
          Durability: 36,
          ItemLevel: 43,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Gweibret's Rule",
        SetPropertiesString: [],
        Name: "Regime of Regulation",
        Index: "Regime of Regulation",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 69,
        Code: "7sm",
        Properties: [
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+240-290% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 30-80 to Damage",
            Index: 1
          },
          {
            PropertyString: "+25% to Lightning Skill Damage",
            Index: 3
          },
          {
            PropertyString: "+8-15 Lightning Absorb",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(118-131) to (236-259)"
            }
          ],
          EquipmentType: 1,
          Name: "Ataghan",
          RequiredStrength: 138,
          RequiredDexterity: 95,
          Durability: 250,
          ItemLevel: 61,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Gweibret's Rule",
        SetPropertiesString: [
          "+20% Faster Block Rate (4 Items)",
          "+20% Increased Chance of Blocking (3 Items)"
        ],
        Name: "King's Prescript",
        Index: "King's Prescript",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 46,
        Code: "xit",
        Properties: [
          {
            PropertyString: "+125% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +15-20%",
            Index: 2
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 1
          },
          {
            PropertyString: "Socketed (1)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "15 to 24",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "135",
          EquipmentType: 0,
          Name: "Dragon Shield",
          RequiredStrength: 91,
          RequiredDexterity: 0,
          Durability: 76,
          ItemLevel: 45,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Gweibret's Rule",
        SetPropertiesString: [
          "+10% Faster Cast Rate (2 Items)",
          "+30 to Mana (3 Items)",
          "Regenerate Mana +50% (4 Items)"
        ],
        Name: "Born Supremacy",
        Index: "Born Supremacy",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "umc",
        Properties: [
          {
            PropertyString: "+1.62 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+25% Increased Maximum Life",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "58",
          EquipmentType: 0,
          Name: "Mithril Coil",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 75,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Gweibret's Rule",
        SetPropertiesString: [],
        Name: "Dominion's Thesis",
        Index: "Dominion's Thesis",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 50,
        RequiredLevel: 50,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+1-2 to Barbarian Skill Levels",
            Index: 0
          },
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+10-15 to Minimum Damage",
            Index: 2
          },
          {
            PropertyString: "+30-40 to Strength",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% Enhanced Damage",
        Index: 0
      },
      {
        PropertyString: "+30% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "+50% Enhanced Damage",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "10% Chance to cast level 10 Nova on striking",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+469 Poison Damage Over 6 Seconds",
        Index: 4
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 3
      },
      {
        PropertyString: "All Resistances +35%",
        Index: 5
      },
      {
        PropertyString: "+1.5% better chance of getting magic item (Per Character Level)",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Haunted Asylum",
    Name: "Haunted Asylum",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Haunted Asylum",
        SetPropertiesString: [
          "+200 Defense (4 Items)",
          "+50% better chance of getting magic item (5 Items)"
        ],
        Name: "Astral Body",
        Index: "Astral Body",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 44,
        Code: "xhn",
        Properties: [
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+15% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+15% Faster Block Rate",
            Index: 3
          },
          {
            PropertyString: "+175-225% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "You feel incorporeal...",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "547-646",
          EquipmentType: 0,
          Name: "Mesh Armor",
          RequiredStrength: 92,
          RequiredDexterity: 0,
          Durability: 45,
          ItemLevel: 45,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Haunted Asylum",
        SetPropertiesString: [
          "Adds 25-75 to Damage (4 Items)"
        ],
        Name: "Apparition of Malice",
        Index: "Apparition of Malice",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 42,
        Code: "9ls",
        Properties: [
          {
            PropertyString: "+200-250% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+10-15% to Cold Skill Damage",
            Index: 2
          },
          {
            PropertyString: "-15-20% to Enemy Cold Resistance",
            Index: 3
          },
          {
            PropertyString: "+225-250 Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(30-35) to (126-147)"
            }
          ],
          EquipmentType: 1,
          Name: "Rune Sword",
          RequiredStrength: 103,
          RequiredDexterity: 79,
          Durability: 250,
          ItemLevel: 44,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Haunted Asylum",
        SetPropertiesString: [
          "All Resistances +25% (5 Items)"
        ],
        Name: "Phantasm of Horror",
        Index: "Phantasm of Horror",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 47,
        Code: "xsh",
        Properties: [
          {
            PropertyString: "+15% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+40% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+100% Damage to Demons",
            Index: 3
          },
          {
            PropertyString: "+75-100% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "14 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "89-102",
          EquipmentType: 0,
          Name: "Grim Shield",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 48,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Haunted Asylum",
        SetPropertiesString: [],
        Name: "Haunted Wisdom",
        Index: "Haunted Wisdom",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 65,
        Code: "uhl",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "+75-100% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+1.75 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +75%",
            Index: 4
          },
          {
            PropertyString: "+20-50% better chance of getting magic item",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "194-222",
          EquipmentType: 0,
          Name: "Giant Conch",
          RequiredStrength: 142,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 54,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Haunted Asylum",
        SetPropertiesString: [],
        Name: "Revenant's Claw",
        Index: "Revenant's Claw",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 72,
        Code: "utg",
        Properties: [
          {
            PropertyString: "+1-3 to Combat Skills (Barbarian only)",
            Index: 1
          },
          {
            PropertyString: "+5% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+180-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+30-50 to Life",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "168-192",
          EquipmentType: 0,
          Name: "Crusader Gauntlets",
          RequiredStrength: 151,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 76,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "Adds 1-300 to Lightning Damage",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+25% to Experience Gained",
        Index: 0
      },
      {
        PropertyString: "+5% extra gold from monsters (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "+2.5% better chance of getting magic item (Per Character Level)",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Alyssa's Archery",
    Name: "Alyssa's Archery",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Alyssa's Archery",
        SetPropertiesString: [],
        Name: "Alyssa's Essence",
        Index: "Alyssa's Essence",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 47,
        Code: "xpl",
        Properties: [
          {
            PropertyString: "Adds 4-8% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+8% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "Knockback",
            Index: 1
          },
          {
            PropertyString: "+135-180% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "531-632",
          EquipmentType: 0,
          Name: "Russet Armor",
          RequiredStrength: 97,
          RequiredDexterity: 0,
          Durability: 90,
          ItemLevel: 49,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Bow",
        "Set": "Alyssa's Archery",
        SetPropertiesString: [
          "+50 to Minimum Damage (3 Items)",
          "+2 to Maximum Damage (Per Character Level) (2 Items)"
        ],
        Name: "Alyssa's Leafblighter",
        Index: "Alyssa's Leafblighter",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 44,
        Code: "8l8",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+180-220% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Socketed (3)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(28-32) to (117-134)"
            }
          ],
          EquipmentType: 1,
          Name: "Large Siege Bow",
          RequiredStrength: 80,
          RequiredDexterity: 95,
          Durability: 0,
          ItemLevel: 46,
          Type: {
            Name: "Bow",
            Index: "Bow",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Alyssa's Archery",
        SetPropertiesString: [
          "+30% Faster Run/Walk (3 Items)"
        ],
        Name: "Alyssa's Sandals",
        Index: "Alyssa's Sandals",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 60,
        Code: "ulb",
        Properties: [
          {
            PropertyString: "+20-30% Enhanced Damage",
            Index: 2
          },
          {
            PropertyString: "Adds 5-10 to Damage",
            Index: 1
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Strength",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "65 to 100",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "143-165",
          EquipmentType: 0,
          Name: "Wyrmhide Boots",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 60,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+30% Piercing Attack",
        Index: 3
      },
      {
        PropertyString: "Adds 25-50 to Damage",
        Index: 1
      },
      {
        PropertyString: "+300% better chance of getting magic item",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Forbidden Lore",
    Name: "Forbidden Lore",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Forbidden Lore",
        SetPropertiesString: [],
        Name: "Unholy Vows",
        Index: "Unholy Vows",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 46,
        Code: "xlt",
        Properties: [
          {
            PropertyString: "+150-190% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+75-100 to Life",
            Index: 1
          },
          {
            PropertyString: "+20-30 Replenish Life",
            Index: 2
          },
          {
            PropertyString: "Regenerate Mana +100%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "632-733",
          EquipmentType: 0,
          Name: "Templar Coat",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 52,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Knife",
        "Set": "Forbidden Lore",
        SetPropertiesString: [],
        Name: "Vampirebone Dagger",
        Index: "Vampirebone Dagger",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 63,
        Code: "7dg",
        Properties: [
          {
            PropertyString: "+1-2 to Necromancer Skill Levels",
            Index: 5
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+220-250% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 4
          },
          {
            PropertyString: "+10-20% to Poison Skill Damage",
            Index: 2
          },
          {
            PropertyString: "-10-20% to Enemy Poison Resistance",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(73-80) to (156-171)"
            }
          ],
          EquipmentType: 1,
          Name: "Bone Knife",
          RequiredStrength: 38,
          RequiredDexterity: 75,
          Durability: 250,
          ItemLevel: 58,
          Type: {
            Name: "Knife",
            Index: "Knife",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Forbidden Lore",
        SetPropertiesString: [
          "+22% Increased Chance of Blocking (2 Items)",
          "+15 to Dexterity (3 Items)",
          "+25% better chance of getting magic item (4 Items)"
        ],
        Name: "Wall of Modius",
        Index: "Wall of Modius",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 16,
        Code: "bsh",
        Properties: [
          {
            PropertyString: "Level 7-10 Thorns Aura When Equipped",
            Index: 0
          },
          {
            PropertyString: "+15% Damage Taken Goes To Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "3 to 6",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "10",
          EquipmentType: 0,
          Name: "Bone Shield",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 19,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Forbidden Lore",
        SetPropertiesString: [],
        Name: "Death's Door",
        Index: "Death's Door",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 32,
        Code: "zvb",
        Properties: [
          {
            PropertyString: "+120-130% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+55-75 to Mana",
            Index: 1
          },
          {
            PropertyString: "+2-4 to Mana after each Kill",
            Index: 2
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "73-83",
          EquipmentType: 0,
          Name: "Sharkskin Belt",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15 to Energy",
        Index: 0
      },
      {
        PropertyString: "+15 to Vitality",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "20% Chance to cast level 3 Corpse Explosion on striking",
        Index: 1
      },
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Cast Rate",
        Index: 3
      },
      {
        PropertyString: "+25% bonus to Attack Rating",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Hannibal's Demise",
    Name: "Hannibal's Demise",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Hannibal's Demise",
        SetPropertiesString: [],
        Name: "Hannibal's Shattered Plate",
        Index: "Hannibal's Shattered Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 48,
        Code: "xld",
        Properties: [
          {
            PropertyString: "+50% Piercing Attack",
            Index: 4
          },
          {
            PropertyString: "+35-50% Chance of Open Wounds",
            Index: 3
          },
          {
            PropertyString: "+130-160% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+3 Defense (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "558-631",
          EquipmentType: 0,
          Name: "Sharktooth Armor",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 55,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Throwing Knife",
        "Set": "Hannibal's Demise",
        SetPropertiesString: [
          "Adds 25-75 to Damage (3 Items)",
          "+100 Increased Stack Size (2 Items)"
        ],
        Name: "Hanabal's Final Flight",
        Index: "Hannibal's Final Flight",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 62,
        Code: "7bk",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+200-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "-20-30% Target Defense",
            Index: 3
          },
          {
            PropertyString: "Slows target by 75%",
            Index: 2
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 4
          },
          {
            PropertyString: "Replenishes quantity",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(81-108) to (105-140)"
            },
            {
              Type: 2,
              DamageString: "(69-92) to (117-156)"
            }
          ],
          EquipmentType: 1,
          Name: "Winged Knife",
          RequiredStrength: 45,
          RequiredDexterity: 142,
          Durability: 250,
          ItemLevel: 77,
          Type: {
            Name: "Throwing Knife",
            Index: "Throwing Knife",
            Class: ""
          },
          RequiredClass: "Knife"
        }
      },
      {
        Type: "Helm",
        "Set": "Hannibal's Demise",
        SetPropertiesString: [
          "Lightning Resist +30% (3 Items)"
        ],
        Name: "Hanabal's Blurred Vision",
        Index: "Hannibal's Blurred Vision",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 38,
        Code: "xhl",
        Properties: [
          {
            PropertyString: "+170-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +25-35%",
            Index: 3
          },
          {
            PropertyString: "+10-20 to All Attributes",
            Index: 1
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "205-228",
          EquipmentType: 0,
          Name: "Basinet",
          RequiredStrength: 82,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 45,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Hannibal's Demise",
        SetPropertiesString: [
          "+20% Faster Run/Walk (2 Items)",
          "+100 to Attack Rating (3 Items)"
        ],
        Name: "Hanabal's Bending Knee",
        Index: "Hannibal's Bending Knee",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 45,
        Code: "xtb",
        Properties: [
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "+300% extra gold from monsters",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "37 to 64",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "90-100",
          EquipmentType: 0,
          Name: "Battle Boots",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 49,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+100 to Life",
        Index: 1
      },
      {
        PropertyString: "+50 to Mana",
        Index: 2
      },
      {
        PropertyString: "+150% better chance of getting magic item",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Wrath of Vengeance",
    Name: "Wrath of Vengeance",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Wrath of Vengeance",
        SetPropertiesString: [
          "+8 Replenish Life (5 Items)"
        ],
        Name: "Shroud of Anger",
        Index: "Shroud of Anger",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 50,
        Code: "xth",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+180-220% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+55 to Life",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "792-905",
          EquipmentType: 0,
          Name: "Embossed Plate",
          RequiredStrength: 125,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 58,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Javelin",
        "Set": "Wrath of Vengeance",
        SetPropertiesString: [
          "37% Chance to cast level 10 Chain Lightning on striking (2 Items)",
          "+6 to Charged Strike (3 Items)"
        ],
        Name: "Holy Fury",
        Index: "Holy Fury",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 64,
        Code: "7s7",
        Properties: [
          {
            PropertyString: "+150-180% Enhanced Damage",
            Index: 2
          },
          {
            PropertyString: "Adds 50-200 to Damage",
            Index: 0
          },
          {
            PropertyString: "+200 Increased Stack Size",
            Index: 1
          },
          {
            PropertyString: "Replenishes quantity",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(132-142) to (357-376)"
            },
            {
              Type: 2,
              DamageString: "(150-162) to (355-373)"
            }
          ],
          EquipmentType: 1,
          Name: "Balrog Spear",
          RequiredStrength: 127,
          RequiredDexterity: 95,
          Durability: 250,
          ItemLevel: 71,
          Type: {
            Name: "Javelin",
            Index: "Javelin",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Wrath of Vengeance",
        SetPropertiesString: [],
        Name: "Harvest of Cruelty",
        Index: "Harvest of Cruelty",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 67,
        Code: "uvb",
        Properties: [
          {
            PropertyString: "5% Chance to cast level 1 Teleport when struck",
            Index: 4
          },
          {
            PropertyString: "+25% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+130-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15-25 Life after each Kill",
            Index: 3
          },
          {
            PropertyString: "+15-25% better chance of getting magic item",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "60 to 110",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "131-142",
          EquipmentType: 0,
          Name: "Scarabshell Boots",
          RequiredStrength: 91,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 66,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Wrath of Vengeance",
        SetPropertiesString: [
          "+1 to Frost Nova (2 Items)",
          "+1 to Blizzard (3 Items)",
          "+1 to Frozen Orb (4 Items)"
        ],
        Name: "Guiding Force",
        Index: "Guiding Force",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 71,
        Code: "umg",
        Properties: [
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "+1 to Mana (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "Regenerate Mana +25%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "59",
          EquipmentType: 0,
          Name: "Vambraces",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 69,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Wrath of Vengeance",
        SetPropertiesString: [
          "+1 to All Skills (3 Items)"
        ],
        Name: "Embracing Hatred",
        Index: "Embracing Hatred",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 39,
        Code: "ztb",
        Properties: [
          {
            PropertyString: "Adds 6-8% Mana stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+15% to Cold Skill Damage",
            Index: 0
          },
          {
            PropertyString: "+75-120% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "+15-20 Cold Absorb",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "66-83",
          EquipmentType: 0,
          Name: "Battle Belt",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "+10 to All Maximum Resistances",
        Index: 2
      },
      {
        PropertyString: "+50% Physical Damage Reduction",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Servitude or Rebellion",
    Name: "Servitude or Rebellion",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Servitude or Rebellion",
        SetPropertiesString: [],
        Name: "Slave to Anarchy",
        Index: "Slave to Anarchy",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 51,
        Code: "xul",
        Properties: [
          {
            PropertyString: "Hit blinds target +3",
            Index: 2
          },
          {
            PropertyString: "+3 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+300-400 Defense",
            Index: 1
          },
          {
            PropertyString: "All Resistances +20%",
            Index: 4
          },
          {
            PropertyString: "Magic Damage Reduced by 15",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "615-715",
          EquipmentType: 0,
          Name: "Chaos Armor",
          RequiredStrength: 140,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 61,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Spear",
        "Set": "Servitude or Rebellion",
        SetPropertiesString: [],
        Name: "Bound by Honor",
        Index: "Bound by Honor",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "7tr",
        Properties: [
          {
            PropertyString: "+5-9 to Melee Mastery",
            Index: 3
          },
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+240-270% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 50-200 to Damage",
            Index: 1
          },
          {
            PropertyString: "+8% Life stolen per hit",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(148-157) to (689-732)"
            }
          ],
          EquipmentType: 1,
          Name: "Stygian Pike",
          RequiredStrength: 168,
          RequiredDexterity: 97,
          Durability: 250,
          ItemLevel: 66,
          Type: {
            Name: "Spear",
            Index: "Spear",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Servitude or Rebellion",
        SetPropertiesString: [
          "+3-5 Replenish Life (2 Items)"
        ],
        Name: "Equilibrium",
        Index: "Equilibrium",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 43,
        Code: "zmb",
        Properties: [
          {
            PropertyString: "+1.5 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "+15-20 to Vitality",
            Index: 2
          },
          {
            PropertyString: "+15-20 to Energy",
            Index: 3
          },
          {
            PropertyString: "+20-25% better chance of getting magic item",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "35",
          EquipmentType: 0,
          Name: "Mesh Belt",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+5 to Whirlwind",
        Index: 3
      },
      {
        PropertyString: "+350 to Attack Rating",
        Index: 1
      },
      {
        PropertyString: "Slows target by 15%",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Kaldorn's Majesty",
    Name: "Kaldorn's Majesty",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Kaldorn's Majesty",
        SetPropertiesString: [
          "All Resistances +50% (4 Items)"
        ],
        Name: "Firecam Gilded Plate",
        Index: "Firecam Gilded Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 63,
        Code: "xar",
        Properties: [
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+150-180% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +30-50%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1045-1170",
          EquipmentType: 0,
          Name: "Ornate Plate",
          RequiredStrength: 170,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 64,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Polearm",
        "Set": "Kaldorn's Majesty",
        SetPropertiesString: [],
        Name: "Axe of Arvoreen",
        Index: "Axe of Arvoreen",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "7o7",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+220-270% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+200-300 to Maximum Damage",
            Index: 1
          },
          {
            PropertyString: "Socketed (1-3)",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(89-103) to (664-836)"
            }
          ],
          EquipmentType: 1,
          Name: "Ogre Axe",
          RequiredStrength: 195,
          RequiredDexterity: 75,
          Durability: 250,
          ItemLevel: 60,
          Type: {
            Name: "Polearm",
            Index: "Polearm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Kaldorn's Majesty",
        SetPropertiesString: [],
        Name: "Windspar Mask",
        Index: "Windspar Mask",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "uhm",
        Properties: [
          {
            PropertyString: "+155-185% Enhanced Defense",
            Index: 1
          },
          {
            PropertyString: "+40-50 to Life",
            Index: 2
          },
          {
            PropertyString: "+15-25% Physical Damage Reduction",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "293-327",
          EquipmentType: 0,
          Name: "Spired Helm",
          RequiredStrength: 192,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 79,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Kaldorn's Majesty",
        SetPropertiesString: [],
        Name: "Waterwyrd's Talon",
        Index: "Waterwyrd's Talon",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 55,
        Code: "xhg",
        Properties: [
          {
            PropertyString: "+40% Increased Attack Speed",
            Index: 0
          },
          {
            PropertyString: "+175-200% Enhanced Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "121-132",
          EquipmentType: 0,
          Name: "War Gauntlets",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Kaldorn's Majesty",
        SetPropertiesString: [],
        Name: "Daystar Wrap",
        Index: "Daystar Wrap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 58,
        Code: "zhb",
        Properties: [
          {
            PropertyString: "+175-200 to Life",
            Index: 0
          },
          {
            PropertyString: "+75-100 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "41",
          EquipmentType: 0,
          Name: "War Belt",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 54,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 2
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25 to All Attributes",
        Index: 1
      },
      {
        PropertyString: "+4% to Experience Gained",
        Index: 2
      },
      {
        PropertyString: "+125% extra gold from monsters",
        Index: 4
      },
      {
        PropertyString: "+125% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Warlock's Exploration",
    Name: "Warlock's Exploration",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Warlock's Exploration",
        SetPropertiesString: [],
        Name: "Incarnadine Elven Plate",
        Index: "Incarnadine Elven Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 59,
        Code: "xtp",
        Properties: [
          {
            PropertyString: "+3-4 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+300-500 Defense",
            Index: 2
          },
          {
            PropertyString: "Socketed (2)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "525-725",
          EquipmentType: 0,
          Name: "Mage Plate",
          RequiredStrength: 55,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 60,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Staff",
        "Set": "Warlock's Exploration",
        SetPropertiesString: [
          "+20% Faster Cast Rate (3 Items)",
          "+2% to Experience Gained (4 Items)"
        ],
        Name: "Staff of Elemental Mastery",
        Index: "Staff of Elemental Mastery",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "8ss",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+35% Increased Maximum Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "6 to 21"
            }
          ],
          EquipmentType: 1,
          Name: "Jo Staff",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 30,
          Type: {
            Name: "Staff",
            Index: "Staff",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Warlock's Exploration",
        SetPropertiesString: [
          "+150 Defense (5 Items)",
          "+40% Increased Maximum Life (4 Items)",
          "+2 to All Attributes (3 Items)",
          "+50% better chance of getting magic item (2 Items)"
        ],
        Name: "Lilarcor Cap",
        Index: "Lilarcor Cap",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 38,
        Code: "xap",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+75-100% Enhanced Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "80-92",
          EquipmentType: 0,
          Name: "War Hat",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 34,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Warlock's Exploration",
        SetPropertiesString: [],
        Name: "Teleomortis' Gloves",
        Index: "Teleomortis' Gloves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 71,
        Code: "ulg",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+150-200 Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54",
          EquipmentType: 0,
          Name: "Bramble Mitts",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 57,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Warlock's Exploration",
        SetPropertiesString: [],
        Name: "Citadel Belt",
        Index: "Citadel Belt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 66,
        Code: "ulc",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+125-175 Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "180-230",
          EquipmentType: 0,
          Name: "Spiderweb Sash",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 61,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "All Resistances +25%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "+25% Physical Damage Reduction",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+4 to All Skills",
        Index: 0
      },
      {
        PropertyString: "All Resistances +50%",
        Index: 2
      },
      {
        PropertyString: "+20 Life after each Kill",
        Index: 3
      },
      {
        PropertyString: "+5 to Mana after each Kill",
        Index: 4
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Amaunator's Peace",
    Name: "Amaunator's Peace",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [],
        Name: "Holy Shroud of Amaunator",
        Index: "Holy Shroud of Amaunator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "uui",
        Properties: [
          {
            PropertyString: "+4-6 to Melee Mastery",
            Index: 1
          },
          {
            PropertyString: "Prevent Monster Heal",
            Index: 3
          },
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+25-30% better chance of getting magic item",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361",
          EquipmentType: 0,
          Name: "Dusk Shroud",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 65,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Axe",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [
          "Adds 40-80 to Damage (5 Items)"
        ],
        Name: "Holy Cleaver of Amaunator",
        Index: "Holy Cleaver of Amaunator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 47,
        Code: "9ax",
        Properties: [
          {
            PropertyString: "+280-320% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 25-100 to Cold Damage",
            Index: 2
          },
          {
            PropertyString: "-10-15% to Enemy Cold Resistance",
            Index: 3
          },
          {
            PropertyString: "Knockback",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +40-50%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(38-42) to (125-138)"
            }
          ],
          EquipmentType: 1,
          Name: "Cleaver",
          RequiredStrength: 68,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 34,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [],
        Name: "Holy Buckler of Amaunator",
        Index: "Holy Buckler of Amaunator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 65,
        Code: "uml",
        Properties: [
          {
            PropertyString: "+40% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+120-160% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+10-15% Magic Absorb",
            Index: 4
          },
          {
            PropertyString: "+10-15% Physical Damage Reduction",
            Index: 2
          },
          {
            PropertyString: "Damage Reduced by 15",
            Index: 3
          },
          {
            PropertyString: "+8-12 Life after each Kill",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "17 to 29",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "239-283",
          EquipmentType: 0,
          Name: "Luna",
          RequiredStrength: 100,
          RequiredDexterity: 0,
          Durability: 84,
          ItemLevel: 61,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [],
        Name: "Holy Ring of Amaunator",
        Index: "Holy Ring of Amaunator",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 30,
        RequiredLevel: 33,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+125-200 to Attack Rating",
            Index: 3
          },
          {
            PropertyString: "+15-20 to Strength",
            Index: 2
          },
          {
            PropertyString: "+25-30 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "+35-50 to Life",
            Index: 0
          },
          {
            PropertyString: "+1 Attacker Takes Damage of (Per Character Level)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [
          "+20 to Maximum Damage (6 Items)",
          "+8-15% to Lightning Skill Damage (5 Items)",
          "+10-15 to Dexterity (2 Items)",
          "Lightning Resist +30% (3 Items)",
          "+33% better chance of getting magic item (4 Items)"
        ],
        Name: "Holy Boots of Amaunator",
        Index: "Holy Boots of Amaunator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 15,
        RequiredLevel: 22,
        Code: "hbt",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+1 Defense (Per Character Level)",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "10 to 20",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "12",
          EquipmentType: 0,
          Name: "Greaves",
          RequiredStrength: 70,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Amaunator's Peace",
        SetPropertiesString: [
          "Regenerate Mana +33% (5 Items)",
          "+33% better chance of getting magic item (4 Items)"
        ],
        Name: "Holy Sash of Amaunator",
        Index: "Holy Sash of Amaunator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 30,
        Code: "zlb",
        Properties: [
          {
            PropertyString: "+190-230% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15-20 to Vitality",
            Index: 1
          },
          {
            PropertyString: "Magic Damage Reduced by 10",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54-63",
          EquipmentType: 0,
          Name: "Demonhide Sash",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "+3 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+50% Enhanced Damage",
        Index: 3
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "+100% extra gold from monsters",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Tika's Request",
    Name: "Tika's Request",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Tika's Request",
        SetPropertiesString: [],
        Name: "Frostwyrm Hide",
        Index: "Frostwyrm Hide",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 60,
        Code: "uea",
        Properties: [
          {
            PropertyString: "+25% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+0.5 to Dexterity (Per Character Level)",
            Index: 4
          },
          {
            PropertyString: "+40-60 to Life",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "730-821",
          EquipmentType: 0,
          Name: "Wyrmhide",
          RequiredStrength: 84,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 67,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Axe",
        "Set": "Tika's Request",
        SetPropertiesString: [
          "+2.5 to Maximum Damage (Per Character Level) (4 Items)"
        ],
        Name: "Hallowed Redeemer",
        Index: "Hallowed Redeemer",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 72,
        Code: "7ba",
        Properties: [
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+290-350% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 12-15% Life stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+3-7 to Mana after each Kill",
            Index: 3
          },
          {
            PropertyString: "Socketed (2)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(241-279) to (429-495)"
            }
          ],
          EquipmentType: 1,
          Name: "Silver-edged Axe",
          RequiredStrength: 166,
          RequiredDexterity: 65,
          Durability: 250,
          ItemLevel: 65,
          Type: {
            Name: "Axe",
            Index: "Axe",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Tika's Request",
        SetPropertiesString: [
          "+25% better chance of getting magic item (3 Items)"
        ],
        Name: "Draconian Mask",
        Index: "Draconian Mask",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "xlm",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 4
          },
          {
            PropertyString: "+5% Mana stolen per hit",
            Index: 2
          },
          {
            PropertyString: "+120-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+1 Defense (Per Character Level)",
            Index: 1
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "140-160",
          EquipmentType: 0,
          Name: "Casque",
          RequiredStrength: 59,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 42,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Tika's Request",
        SetPropertiesString: [],
        Name: "Girdle of Kitthix",
        Index: "Girdle of Kitthix",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "uhc",
        Properties: [
          {
            PropertyString: "+3-5 to Melee Mastery",
            Index: 0
          },
          {
            PropertyString: "+25-35% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+35 to Strength",
            Index: 3
          },
          {
            PropertyString: "+10-20% Physical Damage Reduction",
            Index: 2
          },
          {
            PropertyString: "Requirements -20%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "139-155",
          EquipmentType: 0,
          Name: "Colossus Girdle",
          RequiredStrength: 185,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Tika's Request",
        SetPropertiesString: [
          "+45 to Life (4 Items)"
        ],
        Name: "Gauntlets of Quietus",
        Index: "Gauntlets of Quietus",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 48,
        Code: "xtg",
        Properties: [
          {
            PropertyString: "12% Chance to cast level 3 Glacial Spike on striking",
            Index: 2
          },
          {
            PropertyString: "+1-3 to Melee Mastery",
            Index: 1
          },
          {
            PropertyString: "+15% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+250% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+10-15 to Dexterity",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "140",
          EquipmentType: 0,
          Name: "Battle Gauntlets",
          RequiredStrength: 88,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 49,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "All Resistances +10%",
        Index: 0
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 2
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+20% Lightning Absorb",
        Index: 4
      },
      {
        PropertyString: "Attacker Takes Lightning Damage of +100",
        Index: 3
      },
      {
        PropertyString: "+50% better chance of getting magic item",
        Index: 1
      },
      {
        PropertyString: "+1.5% better chance of getting magic item (Per Character Level)",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Corthala Family Heirlooms",
    Name: "Corthala Family Heirlooms",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Corthala Family Heirlooms",
        SetPropertiesString: [],
        Name: "Sir Tylan's Sylvan Mail",
        Index: "Sir Tylan's Sylvan Mail",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "ung",
        Properties: [
          {
            PropertyString: "Adds 25-50 to Damage",
            Index: 2
          },
          {
            PropertyString: "+230-300% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15-30 to Strength",
            Index: 3
          },
          {
            PropertyString: "All Resistances +10-20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1267-1536",
          EquipmentType: 0,
          Name: "Diamond Mail",
          RequiredStrength: 131,
          RequiredDexterity: 0,
          Durability: 26,
          ItemLevel: 72,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Crossbow",
        "Set": "Corthala Family Heirlooms",
        SetPropertiesString: [
          "+10 to Magic Arrow (3 Items)",
          "+6 to Guided Arrow (4 Items)",
          "Adds 20-100 to Damage (5 Items)"
        ],
        Name: "Prince Karnd's Abomination",
        Index: "Prince Karnd's Abomination",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 79,
        Code: "6rx",
        Properties: [
          {
            PropertyString: "+60% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+200-240% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+40% Piercing Attack",
            Index: 3
          },
          {
            PropertyString: "Adds 30-60 to Damage",
            Index: 1
          },
          {
            PropertyString: "Knockback",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(108-118) to (180-196)"
            }
          ],
          EquipmentType: 1,
          Name: "Demon Crossbow",
          RequiredStrength: 141,
          RequiredDexterity: 98,
          Durability: 0,
          ItemLevel: 84,
          Type: {
            Name: "Crossbow",
            Index: "Crossbow",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Corthala Family Heirlooms",
        SetPropertiesString: [],
        Name: "Yavin's Infernal Visage",
        Index: "Yavin's Infernal Visage",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 81,
        Code: "uh9",
        Properties: [
          {
            PropertyString: "Adds 15-30 to Damage",
            Index: 2
          },
          {
            PropertyString: "+200-300 Defense",
            Index: 0
          },
          {
            PropertyString: "+15-30 to Dexterity",
            Index: 3
          },
          {
            PropertyString: "All Resistances +10-20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "252-303",
          EquipmentType: 0,
          Name: "Bone Visage",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 84,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Corthala Family Heirlooms",
        SetPropertiesString: [
          "+20% Increased Attack Speed (3 Items)"
        ],
        Name: "Prince Gwar's Bracers",
        Index: "Prince Gwar's Bracers",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 44,
        Code: "xmg",
        Properties: [
          {
            PropertyString: "+15-20 to Minimum Damage",
            Index: 2
          },
          {
            PropertyString: "+30-40 to Maximum Damage",
            Index: 3
          },
          {
            PropertyString: "+2 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Cold Resist +20-30%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Heavy Bracers",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Corthala Family Heirlooms",
        SetPropertiesString: [
          "+30% Faster Run/Walk (4 Items)"
        ],
        Name: "Lady Daan's Celeritous Jambeau",
        Index: "Lady Daan's Celeritous Jambeau",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 56,
        Code: "xmb",
        Properties: [
          {
            PropertyString: "+10% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+20-30 to Maximum Damage",
            Index: 2
          },
          {
            PropertyString: "+1.75 Defense (Per Character Level)",
            Index: 0
          },
          {
            PropertyString: "Fire Resist +20-30%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "23 to 52",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "37",
          EquipmentType: 0,
          Name: "Mesh Boots",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 66,
          ItemLevel: 43,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+15% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+25% Faster Hit Recovery",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+8 to Dodge",
        Index: 2
      },
      {
        PropertyString: "+20% Increased Attack Speed",
        Index: 3
      },
      {
        PropertyString: "+0.75% Deadly Strike (Per Character Level)",
        Index: 4
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Knight's Gallantry",
    Name: "Knight's Gallantry",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Knight's Gallantry",
        SetPropertiesString: [],
        Name: "Mail of Courageousness",
        Index: "Mail of Courageousness",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "uhn",
        Properties: [
          {
            PropertyString: "17% Chance to cast level 22 Fire Ball when struck",
            Index: 3
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+150-190% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+3-5 Replenish Life",
            Index: 2
          },
          {
            PropertyString: "Fire Resist +35-45%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1100-1400",
          EquipmentType: 0,
          Name: "Boneweave",
          RequiredStrength: 158,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 62,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Club",
        "Set": "Knight's Gallantry",
        SetPropertiesString: [],
        Name: "Baton of Intrepidity",
        Index: "Baton of Intrepidity",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 68,
        Code: "7cl",
        Properties: [
          {
            PropertyString: "+1-3 to Berserk",
            Index: 3
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+230-280% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Knockback",
            Index: 2
          },
          {
            PropertyString: "Cold Resist +35-45%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(115-133) to (141-163)"
            }
          ],
          EquipmentType: 1,
          Name: "Truncheon",
          RequiredStrength: 88,
          RequiredDexterity: 43,
          Durability: 250,
          ItemLevel: 52,
          Type: {
            Name: "Club",
            Index: "Club",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Knight's Gallantry",
        SetPropertiesString: [],
        Name: "Wall of Bravery",
        Index: "Wall of Bravery",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 51,
        Code: "xow",
        Properties: [
          {
            PropertyString: "+25% Faster Block Rate",
            Index: 3
          },
          {
            PropertyString: "+20-30% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+100-130% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +25-35%",
            Index: 4
          },
          {
            PropertyString: "Level 13 Amplify Damage (100 Charges)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "10 to 17",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "189-207",
          EquipmentType: 0,
          Name: "Pavise",
          RequiredStrength: 133,
          RequiredDexterity: 0,
          Durability: 72,
          ItemLevel: 50,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Knight's Gallantry",
        SetPropertiesString: [],
        Name: "Helm of Chivalry",
        Index: "Helm of Chivalry",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 60,
        Code: "ukp",
        Properties: [
          {
            PropertyString: "100% Chance to cast level 4 Iron Maiden when you Kill an Enemy",
            Index: 3
          },
          {
            PropertyString: "+120-140% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+10-15 to Strength",
            Index: 2
          },
          {
            PropertyString: "+10-15 to Dexterity",
            Index: 1
          },
          {
            PropertyString: "Lightning Resist +35-45%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "224-244",
          EquipmentType: 0,
          Name: "Hydraskull",
          RequiredStrength: 84,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 63,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Knight's Gallantry",
        SetPropertiesString: [
          "Adds 1-100 to Lightning Damage (4 Items)",
          "+30 to Life (2 Items)",
          "+30 to Mana (3 Items)"
        ],
        Name: "Belt of Temerity",
        Index: "Belt of Temerity",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 20,
        RequiredLevel: 30,
        Code: "hbl",
        Properties: [
          {
            PropertyString: "+100-120% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Poison Resist +35-45%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "18-19",
          EquipmentType: 0,
          Name: "Plated Belt",
          RequiredStrength: 60,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 27,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% Deadly Strike",
        Index: 0
      },
      {
        PropertyString: "+20% Chance of Crushing Blow",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+3 to Life (Per Character Level)",
        Index: 1
      },
      {
        PropertyString: "+1.5 to Mana (Per Character Level)",
        Index: 2
      },
      {
        PropertyString: "All Resistances +60%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Lord Sith's Province",
    Name: "Lord Sith's Province",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Lord Sith's Province",
        SetPropertiesString: [],
        Name: "Ebony Plate of Evil",
        Index: "Ebony Plate of Evil",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 76,
        Code: "urs",
        Properties: [
          {
            PropertyString: "+1-3 to Poison and Bone Skills (Necromancer only)",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "+600-800 Defense",
            Index: 0
          },
          {
            PropertyString: "Level 30 Life Tap (12 Charges)",
            Index: 4
          },
          {
            PropertyString: "Requirements -35%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "995-1195",
          EquipmentType: 0,
          Name: "Great Hauberk",
          RequiredStrength: 118,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 75,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Lord Sith's Province",
        SetPropertiesString: [],
        Name: "Deflector of Light",
        Index: "Deflector of Light",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 49,
        Code: "xts",
        Properties: [
          {
            PropertyString: "Adds 4-6% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "Freezes target +4",
            Index: 4
          },
          {
            PropertyString: "+120-140% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 1
          },
          {
            PropertyString: "Half Freeze Duration",
            Index: 5
          },
          {
            PropertyString: "Requirements -50%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "12 to 16",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "178-194",
          EquipmentType: 0,
          Name: "Ancient Shield",
          RequiredStrength: 110,
          RequiredDexterity: 0,
          Durability: 80,
          ItemLevel: 56,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Lord Sith's Province",
        SetPropertiesString: [],
        Name: "Dark Cataclysm",
        Index: "Dark Cataclysm",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "urn",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+2 to Evade",
            Index: 4
          },
          {
            PropertyString: "+135-175% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+35 to Mana",
            Index: 2
          },
          {
            PropertyString: "Requirements -60%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "263-308",
          EquipmentType: 0,
          Name: "Corona",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 85,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Wand",
        "Set": "Lord Sith's Province",
        SetPropertiesString: [
          "Adds 80-180 to Damage (4 Items)"
        ],
        Name: "Malignant Rod",
        Index: "Malignant Rod",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "9bw",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+0.75 to Mana (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Regenerate Mana +45%",
            Index: 3
          },
          {
            PropertyString: "+1% to Experience Gained",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "10 to 22"
            }
          ],
          EquipmentType: 1,
          Name: "Tomb Wand",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 43,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+1 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+50 to Life",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "100% Chance to cast level 9 Charged Bolt when struck",
        Index: 5
      },
      {
        PropertyString: "+1 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+30% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "All Resistances +30%",
        Index: 1
      },
      {
        PropertyString: "+5 to Mana after each Kill",
        Index: 3
      },
      {
        PropertyString: "+75% better chance of getting magic item",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Kai Lord's Valiance",
    Name: "Kai Lord's Valiance",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Kai Lord's Valiance",
        SetPropertiesString: [],
        Name: "Helshazag",
        Index: "Helshazag",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "upl",
        Properties: [
          {
            PropertyString: "+160-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+25% Increased Maximum Life",
            Index: 3
          },
          {
            PropertyString: "Magic Damage Reduced by 20",
            Index: 4
          },
          {
            PropertyString: "+1.25% better chance of getting magic item (Per Character Level)",
            Index: 2
          },
          {
            PropertyString: "Level 12 Find Item (200 Charges)",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1068-1233",
          EquipmentType: 0,
          Name: "Balrog Skin",
          RequiredStrength: 165,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 76,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Kai Lord's Valiance",
        SetPropertiesString: [
          "Adds 256-500 to Magic Damage (5 Items)"
        ],
        Name: "Summerswerd",
        Index: "Summerswerd",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 83,
        Code: "7cr",
        Properties: [
          {
            PropertyString: "Adds 50-150 to Damage",
            Index: 0
          },
          {
            PropertyString: "+175% Damage to Demons",
            Index: 4
          },
          {
            PropertyString: "+350% Damage to Undead",
            Index: 3
          },
          {
            PropertyString: "Adds 12-15% Mana stolen per hit",
            Index: 1
          },
          {
            PropertyString: "Adds 15-18% Life stolen per hit",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "81 to 185"
            }
          ],
          EquipmentType: 1,
          Name: "Phase Blade",
          RequiredStrength: 25,
          RequiredDexterity: 136,
          Durability: 0,
          ItemLevel: 73,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Kai Lord's Valiance",
        SetPropertiesString: [],
        Name: "Helghast Waistband",
        Index: "Helghast Waistband",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "utc",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 4
          },
          {
            PropertyString: "+110-130% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +10-15%",
            Index: 2
          },
          {
            PropertyString: "+10-15% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "126-138",
          EquipmentType: 0,
          Name: "Troll Belt",
          RequiredStrength: 151,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 82,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Kai Lord's Valiance",
        SetPropertiesString: [
          "+30% Faster Run/Walk (3 Items)"
        ],
        Name: "Hallowed Greaves",
        Index: "Hallowed Greaves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 58,
        Code: "xtb",
        Properties: [
          {
            PropertyString: "+1 to Paladin Skill Levels",
            Index: 4
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "+25-35 to Minimum Damage",
            Index: 1
          },
          {
            PropertyString: "+125-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+75% extra gold from monsters",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "37 to 64",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "90-100",
          EquipmentType: 0,
          Name: "Battle Boots",
          RequiredStrength: 95,
          RequiredDexterity: 0,
          Durability: 30,
          ItemLevel: 49,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Kai Lord's Valiance",
        SetPropertiesString: [
          "Level 6 Holy Shock Aura When Equipped (2 Items)",
          "+65% better chance of getting magic item (3 Items)"
        ],
        Name: "Sunspear Deflector",
        Index: "Sunspear Deflector",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 63,
        Code: "xow",
        Properties: [
          {
            PropertyString: "+15% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+100% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+175-200% Enhanced Defense",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "10 to 17",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "189-207",
          EquipmentType: 0,
          Name: "Pavise",
          RequiredStrength: 133,
          RequiredDexterity: 0,
          Durability: 72,
          ItemLevel: 50,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+10% Increased Attack Speed",
        Index: 0
      },
      {
        PropertyString: "+10% Increased Attack Speed",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+25% Cold Absorb",
        Index: 2
      },
      {
        PropertyString: "+25% Lightning Absorb",
        Index: 3
      },
      {
        PropertyString: "+25% Fire Absorb",
        Index: 1
      },
      {
        PropertyString: "Poison Length Reduced by 70%",
        Index: 4
      }
    ],
    Level: 1
  },
  {
    Index: "Path of Bravery",
    Name: "Path of Bravery",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "-20% to Enemy Fire Resistance (2 Items)",
          "-20% to Enemy Fire Resistance (3 Items)",
          "-20% to Enemy Fire Resistance (4 Items)",
          "-20% to Enemy Fire Resistance (5 Items)"
        ],
        Name: "Imperial Plate",
        Index: "Imperial Plate",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 73,
        Code: "ult",
        Properties: [
          {
            PropertyString: "+200% Damage to Demons",
            Index: 0
          },
          {
            PropertyString: "-20% to Enemy Fire Resistance",
            Index: 2
          },
          {
            PropertyString: "+100-125% Enhanced Defense",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "844-949",
          EquipmentType: 0,
          Name: "Hellforge Plate",
          RequiredStrength: 196,
          RequiredDexterity: 0,
          Durability: 60,
          ItemLevel: 78,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "-20% to Enemy Cold Resistance (2 Items)",
          "-20% to Enemy Cold Resistance (3 Items)",
          "-20% to Enemy Cold Resistance (4 Items)",
          "-20% to Enemy Cold Resistance (5 Items)"
        ],
        Name: "Imperial Helm",
        Index: "Imperial Helm",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 40,
        Code: "xkp",
        Properties: [
          {
            PropertyString: "-20% to Enemy Cold Resistance",
            Index: 2
          },
          {
            PropertyString: "+125-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+15% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "119-132",
          EquipmentType: 0,
          Name: "Sallet",
          RequiredStrength: 43,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 37,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "-20% to Enemy Lightning Resistance (2 Items)",
          "-20% to Enemy Lightning Resistance (3 Items)",
          "-20% to Enemy Lightning Resistance (4 Items)",
          "-20% to Enemy Lightning Resistance (5 Items)"
        ],
        Name: "Imperial Girdle",
        Index: "Imperial Girdle",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 75,
        Code: "uhc",
        Properties: [
          {
            PropertyString: "-20% to Enemy Lightning Resistance",
            Index: 2
          },
          {
            PropertyString: "+125-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +35-40%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "139-155",
          EquipmentType: 0,
          Name: "Colossus Girdle",
          RequiredStrength: 185,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "-20% to Enemy Poison Resistance (2 Items)",
          "-20% to Enemy Poison Resistance (3 Items)",
          "-20% to Enemy Poison Resistance (4 Items)",
          "-20% to Enemy Poison Resistance (5 Items)"
        ],
        Name: "Imperial Greaves",
        Index: "Imperial Greaves",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "uhb",
        Properties: [
          {
            PropertyString: "-20% to Enemy Poison Resistance",
            Index: 2
          },
          {
            PropertyString: "+120-140% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Magic Resist +20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "83 to 149",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "138-151",
          EquipmentType: 0,
          Name: "Myrmidon Greaves",
          RequiredStrength: 208,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Gloves",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "+20% Increased Attack Speed (3 Items)"
        ],
        Name: "Imperial Gauntlets",
        Index: "Imperial Gauntlets",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 76,
        Code: "uhg",
        Properties: [
          {
            PropertyString: "+30% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+120-150% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "Regenerate Mana +60%",
            Index: 3
          },
          {
            PropertyString: "Requirements -50%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "138-157",
          EquipmentType: 0,
          Name: "Ogre Gauntlets",
          RequiredStrength: 185,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 85,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Scepter",
        "Set": "Path of Bravery",
        SetPropertiesString: [
          "Adds 50-100 to Damage (4 Items)",
          "-20% to Enemy Fire Resistance (2 Items)",
          "-20% to Enemy Cold Resistance (3 Items)",
          "-20% to Enemy Lightning Resistance (4 Items)",
          "-20% to Enemy Poison Resistance (5 Items)"
        ],
        Name: "Imperial Scepter",
        Index: "Imperial Scepter",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 50,
        Code: "9ws",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+200-220% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Adds 6-8% Life stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+5 to Light Radius",
            Index: 4
          },
          {
            PropertyString: "Socketed (2-3)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(48-51) to (114-121)"
            }
          ],
          EquipmentType: 1,
          Name: "Divine Scepter",
          RequiredStrength: 103,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 45,
          Type: {
            Name: "Scepter",
            Index: "Scepter",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 0
      },
      {
        PropertyString: "+20% Faster Hit Recovery",
        Index: 2
      },
      {
        PropertyString: "+30% Faster Block Rate",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+30% Faster Run/Walk",
        Index: 3
      },
      {
        PropertyString: "+15% Increased Chance of Blocking",
        Index: 1
      },
      {
        PropertyString: "+2% to Experience Gained",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Terror of the Deep",
    Name: "Terror of the Deep",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Terror of the Deep",
        SetPropertiesString: [],
        Name: "Great White Terror",
        Index: "Great White Terror",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 74,
        Code: "uld",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 4
          },
          {
            PropertyString: "Lightning Resist -50%",
            Index: 2
          },
          {
            PropertyString: "Fire Resist +75%",
            Index: 3
          },
          {
            PropertyString: "+25% Physical Damage Reduction",
            Index: 0
          },
          {
            PropertyString: "Damage Reduced by 35",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "417",
          EquipmentType: 0,
          Name: "Kraken Shell",
          RequiredStrength: 174,
          RequiredDexterity: 0,
          Durability: 48,
          ItemLevel: 81,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Polearm",
        "Set": "Terror of the Deep",
        SetPropertiesString: [
          "+45% Increased Attack Speed (4 Items)",
          "Adds 50-250 to Damage (3 Items)"
        ],
        Name: "Feeding Frenzy",
        Index: "Feeding Frenzy",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 77,
        Code: "7wc",
        Properties: [
          {
            PropertyString: "+3 to Barbarian Skill Levels",
            Index: 4
          },
          {
            PropertyString: "+220-290% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+6% Mana stolen per hit",
            Index: 3
          },
          {
            PropertyString: "+6% Life stolen per hit",
            Index: 2
          },
          {
            PropertyString: "Requirements -25%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 1,
              DamageString: "(128-156) to (364-444)"
            }
          ],
          EquipmentType: 1,
          Name: "Giant Thresher",
          RequiredStrength: 188,
          RequiredDexterity: 140,
          Durability: 250,
          ItemLevel: 85,
          Type: {
            Name: "Polearm",
            Index: "Polearm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Terror of the Deep",
        SetPropertiesString: [],
        Name: "Mako's Quickness",
        Index: "Mako's Quickness",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 39,
        Code: "zvb",
        Properties: [
          {
            PropertyString: "+4-8 to Avoid",
            Index: 4
          },
          {
            PropertyString: "+15% Faster Run/Walk",
            Index: 1
          },
          {
            PropertyString: "+15% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+130-160% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+25 to Dexterity",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "73-83",
          EquipmentType: 0,
          Name: "Sharkskin Belt",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Terror of the Deep",
        SetPropertiesString: [],
        Name: "Hammerhead's Persistence",
        Index: "Hammerhead's Persistence",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 44,
        Code: "xvb",
        Properties: [
          {
            PropertyString: "+15-25% Chance of Crushing Blow",
            Index: 3
          },
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+60-90 to Life",
            Index: 4
          },
          {
            PropertyString: "+10% Physical Damage Reduction",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "28 to 50",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "68",
          EquipmentType: 0,
          Name: "Sharkskin Boots",
          RequiredStrength: 47,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 39,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "Half Freeze Duration",
        Index: 0
      },
      {
        PropertyString: "+25% Deadly Strike",
        Index: 2
      }
    ],
    FullProperties: [
      {
        PropertyString: "15% Chance to cast level 18 Shock Wave on striking",
        Index: 4
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+150% Enhanced Damage",
        Index: 2
      },
      {
        PropertyString: "Adds 25-50 to Damage",
        Index: 3
      },
      {
        PropertyString: "+66% Chance of Crushing Blow",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "Celestial Hierarchy",
    Name: "Celestial Hierarchy",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [],
        Name: "Angels",
        Index: "Angels",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 81,
        Code: "uth",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 5
          },
          {
            PropertyString: "+20% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "+20% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+20-25% Faster Block Rate",
            Index: 1
          },
          {
            PropertyString: "+1.12% better chance of getting magic item (Per Character Level)",
            Index: 3
          },
          {
            PropertyString: "Socketed (1-2)",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "433",
          EquipmentType: 0,
          Name: "Lacquered Plate",
          RequiredStrength: 208,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 82,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Sword",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [
          "+250 to Maximum Damage (6 Items)",
          "Adds 100-200 to Magic Damage (2 Items)",
          "Adds 100-200 to Fire Damage (4 Items)",
          "Adds 64-200 to Lightning Damage (5 Items)",
          "Adds 100-200 to Cold Damage (3 Items)"
        ],
        Name: "Principality",
        Index: "Principality",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 45,
        Code: "9b9",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 4
          },
          {
            PropertyString: "+260-300% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "+15% Chance of Crushing Blow",
            Index: 2
          },
          {
            PropertyString: "+15% Deadly Strike",
            Index: 1
          },
          {
            PropertyString: "-1 to -5 Drain Life",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 0,
              DamageString: "(50-56) to (144-160)"
            },
            {
              Type: 1,
              DamageString: "(140-156) to (216-240)"
            }
          ],
          EquipmentType: 1,
          Name: "Gothic Sword",
          RequiredStrength: 113,
          RequiredDexterity: 20,
          Durability: 250,
          ItemLevel: 48,
          Type: {
            Name: "Sword",
            Index: "Sword",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [
          "Regenerate Mana +50% (3 Items)",
          "All Resistances +10% (4 Items)",
          "+35% better chance of getting magic item (5 Items)"
        ],
        Name: "Virtue",
        Index: "Virtue",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 36,
        Code: "zlb",
        Properties: [
          {
            PropertyString: "+80-110% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+35-50 to Life",
            Index: 1
          },
          {
            PropertyString: "+6 Replenish Life",
            Index: 3
          },
          {
            PropertyString: "+7 to Mana after each Kill",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54-63",
          EquipmentType: 0,
          Name: "Demonhide Sash",
          RequiredStrength: 20,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 36,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [
          "+35 to Strength (5 Items)"
        ],
        Name: "Dominion",
        Index: "Dominion",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 70,
        Code: "utb",
        Properties: [
          {
            PropertyString: "+50% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "-20% Faster Hit Recovery",
            Index: 4
          },
          {
            PropertyString: "+180-210% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "-20 to Dexterity",
            Index: 3
          },
          {
            PropertyString: "Requirements -20%",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "50 to 145",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "168-186",
          EquipmentType: 0,
          Name: "Mirrored Boots",
          RequiredStrength: 163,
          RequiredDexterity: 0,
          Durability: 18,
          ItemLevel: 81,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [],
        Name: "Cherubim",
        Index: "Cherubim",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 61,
        Code: "ulm",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+150-200 Defense",
            Index: 1
          },
          {
            PropertyString: "+0.5 to Energy (Per Character Level)",
            Index: 4
          },
          {
            PropertyString: "+30 to Mana",
            Index: 2
          },
          {
            PropertyString: "Poison Resist +25%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "255-305",
          EquipmentType: 0,
          Name: "Armet",
          RequiredStrength: 109,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 68,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Celestial Hierarchy",
        SetPropertiesString: [],
        Name: "Seraphim",
        Index: "Seraphim",
        Enabled: true,
        Rarity: 5,
        ItemLevel: 49,
        RequiredLevel: 49,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+25% Enhanced Damage",
            Index: 1
          },
          {
            PropertyString: "+10 Life after each Kill",
            Index: 2
          },
          {
            PropertyString: "+1-2% to Experience Gained",
            Index: 3
          },
          {
            PropertyString: "Reduces all Vendor Prices 5%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+20% better chance of getting magic item",
        Index: 0
      },
      {
        PropertyString: "+25% better chance of getting magic item",
        Index: 2
      },
      {
        PropertyString: "+45% better chance of getting magic item",
        Index: 4
      },
      {
        PropertyString: "+2 to All Skills",
        Index: 6
      }
    ],
    FullProperties: [
      {
        PropertyString: "Slain Monsters Rest in Peace",
        Index: 2
      },
      {
        PropertyString: "+20 Replenish Life",
        Index: 1
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Lords of Hell",
    Name: "Lords of Hell",
    SetItems: [
      {
        Type: "Armor",
        "Set": "Lords of Hell",
        SetPropertiesString: [],
        Name: "Mephisto's Misty Aura",
        Index: "Mephisto's Misty Aura",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 80,
        Code: "uul",
        Properties: [
          {
            PropertyString: "20% Chance to cast level 8 Cloak Of Shadows when struck",
            Index: 0
          },
          {
            PropertyString: "Level 1 Cleansing Aura When Equipped",
            Index: 3
          },
          {
            PropertyString: "+140-160% Enhanced Defense",
            Index: 2
          },
          {
            PropertyString: "-4 to Light Radius",
            Index: 1
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1072-1162",
          EquipmentType: 0,
          Name: "Shadow Plate",
          RequiredStrength: 230,
          RequiredDexterity: 0,
          Durability: 70,
          ItemLevel: 83,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Lords of Hell",
        SetPropertiesString: [
          "+50% better chance of getting magic item (4 Items)"
        ],
        Name: "Diablo's Soulstone Ring",
        Index: "Diablo's Soulstone Ring",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 77,
        RequiredLevel: 77,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+50 to Life",
            Index: 1
          },
          {
            PropertyString: "+50 to Mana",
            Index: 2
          },
          {
            PropertyString: "+10% Physical Damage Reduction",
            Index: 3
          },
          {
            PropertyString: "Magic Damage Reduced by 20",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Lords of Hell",
        SetPropertiesString: [],
        Name: "Baal's Cryptic Amulet",
        Index: "Baal's Cryptic Amulet",
        Enabled: true,
        Rarity: 3,
        ItemLevel: 74,
        RequiredLevel: 74,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+25 Replenish Life",
            Index: 2
          },
          {
            PropertyString: "Regenerate Mana +50%",
            Index: 3
          },
          {
            PropertyString: "+35-50% better chance of getting magic item",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Javelin",
        "Set": "Lords of Hell",
        SetPropertiesString: [
          "+8 to Lightning Fury (3 Items)",
          "+25% Increased Attack Speed (2 Items)"
        ],
        Name: "Heaven's Lances",
        Index: "Heaven's Lances",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 51,
        Code: "9ts",
        Properties: [
          {
            PropertyString: "+190-240% Enhanced Damage",
            Index: 0
          },
          {
            PropertyString: "Knockback",
            Index: 3
          },
          {
            PropertyString: "+75 Increased Stack Size",
            Index: 1
          },
          {
            PropertyString: "Replenishes quantity",
            Index: 2
          },
          {
            PropertyString: "Replenishes quantity",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "(37-44) to (101-119)"
            },
            {
              Type: 2,
              DamageString: "(52-61) to (156-183)"
            }
          ],
          EquipmentType: 1,
          Name: "Harpoon",
          RequiredStrength: 25,
          RequiredDexterity: 118,
          Durability: 250,
          ItemLevel: 51,
          Type: {
            Name: "Javelin",
            Index: "Javelin",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+2 to All Skills",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "13% Chance to cast level 31 Charged Bolt when struck",
        Index: 1
      },
      {
        PropertyString: "+75% Piercing Attack",
        Index: 0
      },
      {
        PropertyString: "+55% Chance of Open Wounds",
        Index: 5
      },
      {
        PropertyString: "Prevent Monster Heal",
        Index: 4
      },
      {
        PropertyString: "Slows target by 20%",
        Index: 2
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Corruption Coils",
    Name: "Corruption Coils",
    SetItems: [
      {
        Type: "Ring",
        "Set": "Corruption Coils",
        SetPropertiesString: [
          "+40% to Fire Skill Damage (3 Items)",
          "+50% better chance of getting magic item (2 Items)"
        ],
        Name: "Demonic Chuckle",
        Index: "Demonic Chuckle",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+35-50 to Life",
            Index: 0
          },
          {
            PropertyString: "+25 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Ring",
        "Set": "Corruption Coils",
        SetPropertiesString: [
          "+40% to Lightning Skill Damage (3 Items)",
          "+100% extra gold from monsters (2 Items)"
        ],
        Name: "Evil Humor",
        Index: "Evil Humor",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "rin",
        Properties: [
          {
            PropertyString: "+35-50 to Life",
            Index: 0
          },
          {
            PropertyString: "+25 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Ring",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Ring",
            Index: "Ring",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Amulet",
        "Set": "Corruption Coils",
        SetPropertiesString: [
          "10% Chance to cast level 20 Taunt when struck (2 Items)",
          "+40% to Cold Skill Damage (3 Items)"
        ],
        Name: "Temptation's Death",
        Index: "Temptation's Death",
        Enabled: true,
        Rarity: 1,
        ItemLevel: 45,
        RequiredLevel: 45,
        Code: "amu",
        Properties: [
          {
            PropertyString: "+50-75 to Life",
            Index: 0
          },
          {
            PropertyString: "+40 to Mana",
            Index: 1
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          EquipmentType: 2,
          Name: "Amulet",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 0,
          Type: {
            Name: "Amulet",
            Index: "Amulet",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "-50 Drain Life",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5 to All Skills",
        Index: 4
      },
      {
        PropertyString: "+40% to Poison Skill Damage",
        Index: 2
      },
      {
        PropertyString: "All Resistances -50%",
        Index: 0
      },
      {
        PropertyString: "-40% to Experience Gained",
        Index: 1
      },
      {
        PropertyString: "+100% better chance of getting magic item",
        Index: 3
      }
    ],
    Level: 1
  },
  {
    Index: "Maadi's Paradox",
    Name: "Maadi's Paradox",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "Maadi's Paradox",
        SetPropertiesString: [
          "+5 to Bone Spear (Necromancer Only) (3 Items)",
          "+30 to Energy (2 Items)"
        ],
        Name: "Maadi's Silence",
        Index: "Maadi's Silence",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 47,
        RequiredLevel: 47,
        Code: "uvg",
        Properties: [
          {
            PropertyString: "+50-100 Defense",
            Index: 3
          },
          {
            PropertyString: "+50 to Life",
            Index: 2
          },
          {
            PropertyString: "Damage Reduced by 10",
            Index: 1
          },
          {
            PropertyString: "Magic Damage Reduced by 10",
            Index: 0
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "106-156",
          EquipmentType: 0,
          Name: "Vampirebone Gloves",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 14,
          ItemLevel: 63,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Helm",
        "Set": "Maadi's Paradox",
        SetPropertiesString: [
          "+15-20% Faster Run/Walk (2 Items)",
          "+15% Faster Cast Rate (3 Items)"
        ],
        Name: "Maadi's Vision",
        Index: "Maadi's Vision",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 63,
        RequiredLevel: 63,
        Code: "uh9",
        Properties: [
          {
            PropertyString: "+20-30% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "+150-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+25 to Vitality",
            Index: 1
          },
          {
            PropertyString: "All Resistances +10%",
            Index: 3
          },
          {
            PropertyString: "+30-50% better chance of getting magic item",
            Index: 4
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "252-303",
          EquipmentType: 0,
          Name: "Bone Visage",
          RequiredStrength: 106,
          RequiredDexterity: 0,
          Durability: 40,
          ItemLevel: 84,
          Type: {
            Name: "Helm",
            Index: "Helm",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Maadi's Paradox",
        SetPropertiesString: [
          "+50 to Vitality (2 Items)",
          "+50 to Energy (3 Items)",
          "+10% Magic Absorb (4 Items)",
          "Magic Damage Reduced by 10 (5 Items)"
        ],
        Name: "Maadi's Spirit",
        Index: "Maadi's Spirit",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 47,
        RequiredLevel: 47,
        Code: "uhn",
        Properties: [
          {
            PropertyString: "+150-200% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "+100-200 Defense",
            Index: 4
          },
          {
            PropertyString: "+25 to Vitality",
            Index: 1
          },
          {
            PropertyString: "+25 to Energy",
            Index: 2
          },
          {
            PropertyString: "+10-15% Increased Maximum Mana",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "1100-1400",
          EquipmentType: 0,
          Name: "Boneweave",
          RequiredStrength: 158,
          RequiredDexterity: 0,
          Durability: 0,
          ItemLevel: 62,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Wand",
        "Set": "Maadi's Paradox",
        SetPropertiesString: [
          "+25% Faster Cast Rate (2 Items)",
          "All Resistances +20% (3 Items)"
        ],
        Name: "Maadi's Torch",
        Index: "Maadi's Torch",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 64,
        RequiredLevel: 64,
        Code: "7gw",
        Properties: [
          {
            PropertyString: "+1 Additional Bone Spear Projectiles",
            Index: 1
          },
          {
            PropertyString: "+1-2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+30% Faster Cast Rate",
            Index: 2
          },
          {
            PropertyString: "+10-30% better chance of getting magic item",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "22 to 28"
            }
          ],
          EquipmentType: 1,
          Name: "Unearthed Wand",
          RequiredStrength: 25,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 86,
          Type: {
            Name: "Wand",
            Index: "Wand",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Voodoo Heads",
        "Set": "Maadi's Paradox",
        SetPropertiesString: [
          "+1 Additional Bone Spear Projectiles (5 Items)"
        ],
        Name: "Maadi's Soul",
        Index: "Maadi's Soul",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 49,
        RequiredLevel: 49,
        Code: "ned",
        Properties: [
          {
            PropertyString: "+1-2 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+20-30% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+20-35% Faster Block Rate",
            Index: 4
          },
          {
            PropertyString: "+20-35% Increased Chance of Blocking",
            Index: 3
          },
          {
            PropertyString: "+150-200% Enhanced Defense",
            Index: 5
          },
          {
            PropertyString: "All Resistances +20%",
            Index: 2
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "247-297",
          EquipmentType: 0,
          Name: "Overseer Skull",
          RequiredStrength: 91,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 66,
          Type: {
            Name: "Voodoo Heads",
            Index: "Voodoo Heads",
            Class: "nec"
          },
          RequiredClass: "Necromancer"
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "All Resistances +50%",
        Index: 0
      },
      {
        PropertyString: "+5 to Bone Spear (Necromancer Only)",
        Index: 2
      },
      {
        PropertyString: "+200 to Life",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+5 to All Skills",
        Index: 0
      },
      {
        PropertyString: "+10 to Energy Shield",
        Index: 2
      },
      {
        PropertyString: "Magic Resist +15%",
        Index: 3
      },
      {
        PropertyString: "Cannot Be Frozen",
        Index: 1
      }
    ],
    Level: 1
  },
  {
    Index: "The Raven's Nest",
    Name: "The Raven's Nest",
    SetItems: [
      {
        Type: "Gloves",
        "Set": "The Raven's Nest",
        SetPropertiesString: [
          "+15% Faster Cast Rate (4 Items)",
          "Cold Resist +30% (2 Items)"
        ],
        Name: "The Raven's Talons",
        Index: "The Raven's Talons",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 5,
        RequiredLevel: 10,
        Code: "lgl",
        Properties: [
          {
            PropertyString: "+5-10% Faster Cast Rate",
            Index: 0
          },
          {
            PropertyString: "All Resistances +5-10%",
            Index: 1
          },
          {
            PropertyString: "+5-10 to All Attributes",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Leather Gloves",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Boots",
        "Set": "The Raven's Nest",
        SetPropertiesString: [
          "+30% Faster Run/Walk (2 Items)",
          "All Resistances +20% (3 Items)"
        ],
        Name: "The Raven's Feet",
        Index: "The Raven's Feet",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 5,
        RequiredLevel: 10,
        Code: "mbt",
        Properties: [
          {
            PropertyString: "+10% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "+100 Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +10%",
            Index: 1
          },
          {
            PropertyString: "+10-25% better chance of getting magic item",
            Index: 3
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "6 to 12",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "108",
          EquipmentType: 0,
          Name: "Chain Boots",
          RequiredStrength: 30,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 12,
          Type: {
            Name: "Boots",
            Index: "Boots",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "The Raven's Nest",
        SetPropertiesString: [
          "+2 to All Skills (3 Items)",
          "+2 to Maximum Cold Resist (4 Items)",
          "+15 Cold Absorb (2 Items)"
        ],
        Name: "The Raven's Wing",
        Index: "The Raven's Wing",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 45,
        Code: "xpk",
        Properties: [
          {
            PropertyString: "+20% Faster Run/Walk",
            Index: 4
          },
          {
            PropertyString: "+20-30% Faster Cast Rate",
            Index: 3
          },
          {
            PropertyString: "+20-30% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "+20-30% Increased Chance of Blocking",
            Index: 1
          },
          {
            PropertyString: "+100% Enhanced Defense",
            Index: 0
          },
          {
            PropertyString: "All Resistances +20-30%",
            Index: 5
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: "18 to 35",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "118",
          EquipmentType: 0,
          Name: "Barbed Shield",
          RequiredStrength: 65,
          RequiredDexterity: 0,
          Durability: 55,
          ItemLevel: 42,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Knife",
        "Set": "The Raven's Nest",
        SetPropertiesString: [
          "+2 to Raven Hits (4 Items)",
          "+10% Faster Cast Rate (2 Items)"
        ],
        Name: "The Raven's Beak",
        Index: "The Raven's Beak",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 35,
        RequiredLevel: 45,
        Code: "9bl",
        Properties: [
          {
            PropertyString: "+1-2 to Raven Hits",
            Index: 7
          },
          {
            PropertyString: "+1 to All Skills",
            Index: 0
          },
          {
            PropertyString: "+15-30% Increased Attack Speed",
            Index: 3
          },
          {
            PropertyString: "+20-30% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+15-30% Faster Hit Recovery",
            Index: 2
          },
          {
            PropertyString: "Ignore Target's Defense",
            Index: 4
          },
          {
            PropertyString: "Hit blinds target +1",
            Index: 5
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "19 to 36"
            }
          ],
          EquipmentType: 1,
          Name: "Stiletto",
          RequiredStrength: 47,
          RequiredDexterity: 97,
          Durability: 250,
          ItemLevel: 46,
          Type: {
            Name: "Knife",
            Index: "Knife",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "The Raven's Nest",
        SetPropertiesString: [
          "+3 to Maximum Cold Resist (4 Items)",
          "+10% Cold Absorb (2 Items)",
          "Cannot Be Frozen (3 Items)"
        ],
        Name: "The Raven's Feathers",
        Index: "The Raven's Feathers",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 60,
        RequiredLevel: 60,
        Code: "uea",
        Properties: [
          {
            PropertyString: "+2-5 to Warmth",
            Index: 4
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
            PropertyString: "+300-500 Defense vs. Missile",
            Index: 1
          },
          {
            PropertyString: "Cold Resist +30%",
            Index: 3
          },
          {
            PropertyString: "Damage Reduced by 10",
            Index: 5
          },
          {
            PropertyString: "Magic Damage Reduced by 10",
            Index: 6
          }
        ],
        DamageArmorEnhanced: true,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "730-821",
          EquipmentType: 0,
          Name: "Wyrmhide",
          RequiredStrength: 84,
          RequiredDexterity: 0,
          Durability: 24,
          ItemLevel: 67,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+5 to Raven (Druid Only)",
        Index: 0
      },
      {
        PropertyString: "+ Max Ravens, - Max Wolves",
        Index: 1
      },
      {
        PropertyString: "All Resistances +40%",
        Index: 2
      },
      {
        PropertyString: "+ Max Ravens, - Max Wolves",
        Index: 4
      }
    ],
    FullProperties: [
      {
        PropertyString: "+50% to Raven Damage",
        Index: 0
      },
      {
        PropertyString: "+1 to Amplify Damage",
        Index: 1
      },
      {
        PropertyString: "+30% Faster Cast Rate",
        Index: 4
      },
      {
        PropertyString: "+10% Magic Absorb",
        Index: 3
      },
      {
        PropertyString: "+20% Physical Damage Reduction",
        Index: 2
      }
    ],
    Level: 1
  },
  {
    Index: "Tools of Vindication",
    Name: "Tools of Vindication",
    SetItems: [
      {
        Type: "Hammer",
        "Set": "Tools of Vindication",
        SetPropertiesString: [
          "+40% Increased Attack Speed (2 Items)"
        ],
        Name: "Hand of the Vindicator",
        Index: "Hand of the Vindicator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 12,
        RequiredLevel: 20,
        Code: "whm",
        Properties: [
          {
            PropertyString: "+20% Increased Attack Speed",
            Index: 1
          },
          {
            PropertyString: "+ to Minimum Damage",
            Index: 0
          },
          {
            PropertyString: "+3 to Vengeance (Paladin Only)",
            Index: 2
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageTypes: [
            {
              Type: 3,
              DamageString: "19 to 29"
            }
          ],
          EquipmentType: 1,
          Name: "War Hammer",
          RequiredStrength: 53,
          RequiredDexterity: 0,
          Durability: 250,
          ItemLevel: 25,
          Type: {
            Name: "Hammer",
            Index: "Hammer",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Auric Shields",
        "Set": "Tools of Vindication",
        SetPropertiesString: [
          "+ to Minimum Damage (3 Items)",
          "Cold Resist +30% (2 Items)",
          "+15% Physical Damage Reduction (3 Items)"
        ],
        Name: "Bulwark of the Vindicator",
        Index: "Bulwark of the Vindicator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 59,
        RequiredLevel: 60,
        Code: "pa9",
        Properties: [
          {
            PropertyString: "Level 12 Holy Freeze Aura When Equipped",
            Index: 3
          },
          {
            PropertyString: "+40% Faster Hit Recovery",
            Index: 1
          },
          {
            PropertyString: "+55% Faster Block Rate",
            Index: 2
          },
          {
            PropertyString: "All Resistances +35%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "20 to 28",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "144",
          EquipmentType: 0,
          Name: "Gilded Shield",
          RequiredStrength: 89,
          RequiredDexterity: 0,
          Durability: 50,
          ItemLevel: 51,
          Type: {
            Name: "Auric Shields",
            Index: "Auric Shields",
            Class: "pal"
          },
          RequiredClass: "Paladin"
        }
      },
      {
        Type: "Belt",
        "Set": "Tools of Vindication",
        SetPropertiesString: [
          "+ to Minimum Damage (2 Items)",
          "Lightning Resist +30% (3 Items)",
          "Fire Resist +30% (2 Items)"
        ],
        Name: "Belt of the Vindicator",
        Index: "Belt of the Vindicator",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 40,
        RequiredLevel: 40,
        Code: "zmb",
        Properties: [
          {
            PropertyString: "Cold Resist +20%",
            Index: 2
          },
          {
            PropertyString: "Lightning Resist +20%",
            Index: 1
          },
          {
            PropertyString: "Fire Resist +20%",
            Index: 0
          },
          {
            PropertyString: "+30% better chance of getting magic item",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "35",
          EquipmentType: 0,
          Name: "Mesh Belt",
          RequiredStrength: 58,
          RequiredDexterity: 0,
          Durability: 16,
          ItemLevel: 43,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "+3 to Vengeance (Paladin Only)",
        Index: 0
      }
    ],
    FullProperties: [
      {
        PropertyString: "All Resistances +30%",
        Index: 0
      }
    ],
    Level: 1
  },
  {
    Index: "Panda's Polar Adventure",
    Name: "Panda's Polar Adventure",
    SetItems: [
      {
        Type: "Pelt",
        "Set": "Panda's Polar Adventure",
        SetPropertiesString: [],
        Name: "Panda's Pelt",
        Index: "Panda's Pelt",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 30,
        RequiredLevel: 55,
        Code: "dr6",
        Properties: [
          {
            PropertyString: "+2-3 to All Skills",
            Index: 4
          },
          {
            PropertyString: "+2-4 to Polar Bear",
            Index: 1
          },
          {
            PropertyString: "+30% Faster Run/Walk",
            Index: 2
          },
          {
            PropertyString: "+30% Faster Hit Recovery",
            Index: 3
          },
          {
            PropertyString: "Cannot Be Frozen",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "52",
          EquipmentType: 0,
          Name: "Alpha Helm",
          RequiredStrength: 44,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 35,
          Type: {
            Name: "Pelt",
            Index: "Pelt",
            Class: "dru"
          },
          RequiredClass: "Druid"
        }
      },
      {
        Type: "Gloves",
        "Set": "Panda's Polar Adventure",
        SetPropertiesString: [],
        Name: "Panda's Mitts",
        Index: "Panda's Mitts",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 25,
        RequiredLevel: 45,
        Code: "ulg",
        Properties: [
          {
            PropertyString: "+2-5 to Polar Claws",
            Index: 0
          },
          {
            PropertyString: "+30% Increased Attack Speed",
            Index: 2
          },
          {
            PropertyString: "+5% Life stolen per hit",
            Index: 1
          },
          {
            PropertyString: "Freezes target +1",
            Index: 4
          },
          {
            PropertyString: "Fire Resist +15%",
            Index: 3
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "54",
          EquipmentType: 0,
          Name: "Bramble Mitts",
          RequiredStrength: 50,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 57,
          Type: {
            Name: "Gloves",
            Index: "Gloves",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Armor",
        "Set": "Panda's Polar Adventure",
        SetPropertiesString: [],
        Name: "Panda's Coat",
        Index: "Panda's Coat",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 70,
        RequiredLevel: 80,
        Code: "uui",
        Properties: [
          {
            PropertyString: "+2-3 to All Skills",
            Index: 3
          },
          {
            PropertyString: "+1 to Warmth",
            Index: 0
          },
          {
            PropertyString: "+15% Faster Cast Rate",
            Index: 1
          },
          {
            PropertyString: "+10 to Maximum Cold Resist",
            Index: 2
          },
          {
            PropertyString: "Cold Resist +50%",
            Index: 4
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "361",
          EquipmentType: 0,
          Name: "Dusk Shroud",
          RequiredStrength: 77,
          RequiredDexterity: 0,
          Durability: 20,
          ItemLevel: 65,
          Type: {
            Name: "Armor",
            Index: "Armor",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Belt",
        "Set": "Panda's Polar Adventure",
        SetPropertiesString: [],
        Name: "Panda's Sash",
        Index: "Panda's Sash",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 6,
        RequiredLevel: 12,
        Code: "lbl",
        Properties: [
          {
            PropertyString: "20% Chance to cast level 20 Tornado when struck",
            Index: 3
          },
          {
            PropertyString: "+10 to Vitality",
            Index: 1
          },
          {
            PropertyString: "+100 to Life",
            Index: 2
          },
          {
            PropertyString: "All Resistances +10%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: null,
          DamageStringPrefix: null,
          ArmorString: "2",
          EquipmentType: 0,
          Name: "Sash",
          RequiredStrength: 0,
          RequiredDexterity: 0,
          Durability: 12,
          ItemLevel: 3,
          Type: {
            Name: "Belt",
            Index: "Belt",
            Class: ""
          },
          RequiredClass: ""
        }
      },
      {
        Type: "Shield",
        "Set": "Panda's Polar Adventure",
        SetPropertiesString: [],
        Name: "Panda's Sled",
        Index: "Panda's Sled",
        Enabled: true,
        Rarity: 7,
        ItemLevel: 50,
        RequiredLevel: 60,
        Code: "uow",
        Properties: [
          {
            PropertyString: "+5-8 to Summon Spirit Wolf",
            Index: 2
          },
          {
            PropertyString: "+15% Increased Chance of Blocking",
            Index: 3
          },
          {
            PropertyString: "All Resistances +25%",
            Index: 1
          },
          {
            PropertyString: "Requirements -30%",
            Index: 0
          }
        ],
        DamageArmorEnhanced: false,
        Equipment: {
          DamageString: "18 to 28",
          DamageStringPrefix: "Unhandled Damage Prefix",
          ArmorString: "145",
          EquipmentType: 0,
          Name: "Aegis",
          RequiredStrength: 219,
          RequiredDexterity: 0,
          Durability: 92,
          ItemLevel: 79,
          Type: {
            Name: "Shield",
            Index: "Shield",
            Class: ""
          },
          RequiredClass: ""
        }
      }
    ],
    PartialProperties: [
      {
        PropertyString: "-10% to Enemy Cold Resistance",
        Index: 0
      },
      {
        PropertyString: "+10% to Cold Skill Damage",
        Index: 1
      },
      {
        PropertyString: "+10 to Polar Bear",
        Index: 2
      },
      {
        PropertyString: "+10 to Polar Claws",
        Index: 3
      },
      {
        PropertyString: "-10% to Enemy Cold Resistance",
        Index: 4
      },
      {
        PropertyString: "+10% to Cold Skill Damage",
        Index: 5
      }
    ],
    FullProperties: [
      {
        PropertyString: "+10 to Polar Bear",
        Index: 1
      },
      {
        PropertyString: "+10 to Polar Claws",
        Index: 3
      },
      {
        PropertyString: "+20% to Cold Skill Damage",
        Index: 0
      },
      {
        PropertyString: "-20% to Enemy Cold Resistance",
        Index: 2
      },
      {
        PropertyString: "All Resistances +25%",
        Index: 4
      }
    ],
    Level: 1
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
var _class_dec, _handleSearchChanged_dec, _search_dec, _Sets_decorators, _init;
_Sets_decorators = [customElement(__au2ViewDef)], _search_dec = [bindable], _handleSearchChanged_dec = [watch("search")], _class_dec = [bindable];
class Sets {
  constructor() {
    __runInitializers(_init, 5, this);
    __publicField(this, "sets", json);
    __publicField(this, "search", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
    __publicField(this, "_debouncedSearchItem");
    __publicField(this, "class", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
    __publicField(this, "classes", [
      { value: null, label: "-" },
      { value: "Amazon", label: "Amazon" },
      { value: "Assassin", label: "Assassin" },
      { value: "Barbarian", label: "Barbarian" },
      { value: "Druid", label: "Druid" },
      { value: "Necromancer", label: "Necromancer" },
      { value: "Paladin", label: "Paladin" },
      { value: "Sorceress", label: "Sorceress" }
    ]);
  }
  attached() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      this.search = searchParam;
    }
    const classParam = urlParams.get("class");
    if (classParam) {
      this.class = classParam;
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
    if (this.class) {
      url.searchParams.set("class", this.class);
    } else {
      url.searchParams.delete("class");
    }
    window.history.pushState({}, "", url.toString());
  }
  handleSearchChanged() {
    if (!this.search) {
      this.sets = json;
      this.updateUrl();
      return;
    }
    if (this._debouncedSearchItem) {
      this._debouncedSearchItem();
    }
    this.updateUrl();
  }
  classChanged() {
    this.sets = json;
    this.updateList();
    this.updateUrl();
  }
  updateList() {
    if (!this.search && !this.class) {
      return;
    }
    try {
      const foundSets = [];
      loop1:
        for (const set of json) {
          set.AllProperties = [...set?.FullProperties, ...set?.PartialProperties];
          if (this.search && set.Name?.toLowerCase().includes(this.search?.toLowerCase())) {
            foundSets.push(set);
            continue;
          }
          for (const property of set?.AllProperties) {
            if (this.class) {
              if (property?.PropertyString?.toLowerCase()?.includes(this.class?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            } else {
              if (property?.PropertyString?.toLowerCase()?.includes(this.search?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            }
          }
          for (const setItem of set?.SetItems) {
            if (this.class) {
              if (setItem.Name.toLowerCase().includes(this.class?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            } else {
              if (setItem.Name.toLowerCase().includes(this.search?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            }
            for (const property of setItem?.Properties) {
              if (this.class) {
                if (property?.PropertyString?.toLowerCase()?.includes(this.class?.toLowerCase())) {
                  foundSets.push(set);
                  continue loop1;
                }
              } else {
                if (property?.PropertyString?.toLowerCase()?.includes(this.search?.toLowerCase())) {
                  foundSets.push(set);
                  continue loop1;
                }
              }
            }
            if (this.class) {
              if (setItem.Equipment.Name.toLowerCase().includes(this.class?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            } else {
              if (setItem.Equipment.Name.toLowerCase().includes(this.search?.toLowerCase())) {
                foundSets.push(set);
                continue loop1;
              }
            }
          }
        }
      this.sets = foundSets;
    } catch (e) {
      console.error(e);
    }
  }
  getDamageTypeString(type) {
    switch (type) {
      case 3:
        return "Damage: ";
      case 2:
        return "Throw Damage: ";
      case 1:
        return "Two-Handed Damage: ";
      default:
        return "Damage: ";
    }
  }
}
_init = __decoratorStart();
__decorateElement(_init, 1, "handleSearchChanged", _handleSearchChanged_dec, Sets);
__decorateElement(_init, 5, "search", _search_dec, Sets);
__decorateElement(_init, 5, "class", _class_dec, Sets);
Sets = __decorateElement(_init, 0, "Sets", _Sets_decorators, Sets);
__runInitializers(_init, 1, Sets);
export {
  Sets
};
