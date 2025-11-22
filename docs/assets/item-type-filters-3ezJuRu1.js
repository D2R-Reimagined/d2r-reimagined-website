const ITEM_TYPES = [
  // High-level categories
  { name: "Any", code: "" },
  { name: "None", code: "none" },
  { name: "Weapon", code: "weap" },
  { name: "Melee Weapon", code: "mele", parents: ["Weapon"] },
  { name: "Missile Weapon", code: "miss", parents: ["Weapon"] },
  { name: "Any Armor", code: "armo" },
  { name: "Any Shield", code: "shld", parents: ["Any Armor"] },
  { name: "Miscellaneous", code: "misc" },
  { name: "Missile", code: "misl", parents: ["Miscellaneous"] },
  { name: "Second Hand", code: "seco" },
  { name: "Socket Filler", code: "sock", parents: ["Miscellaneous"] },
  { name: "Class Specific", code: "clas" },
  { name: "Charm", code: "char", parents: ["Miscellaneous"] },
  // Armor subtypes
  { name: "Body Armor", code: "tors", parents: ["Any Armor"] },
  { name: "Helm", code: "helm", parents: ["Any Armor"] },
  { name: "Gloves", code: "glov", parents: ["Any Armor"] },
  { name: "Boots", code: "boot", parents: ["Any Armor"] },
  { name: "Belt", code: "belt", parents: ["Any Armor"] },
  { name: "Circlet", code: "circ", parents: ["Helm"] },
  { name: "Shield", code: "shie", parents: ["Any Shield"] },
  { name: "Cloak", code: "cloa", parents: ["Body Armor", "Assassin Item"] },
  // Jewelry and socket fillers
  { name: "Ring", code: "ring" },
  { name: "Amulet", code: "amul" },
  { name: "Small Charm", code: "scha", parents: ["Charm"] },
  // Pipeline normalization: TSV Medium Charm → exported as 'Large Charm'
  { name: "Large Charm", code: "mcha", parents: ["Charm"] },
  // Pipeline normalization: TSV Large Charm → exported as 'Grand Charm'
  { name: "Grand Charm", code: "lcha", parents: ["Charm"] },
  { name: "Jewel", code: "jewl", parents: ["Socket Filler"] },
  { name: "Rune", code: "rune", parents: ["Socket Filler"] },
  { name: "Gem", code: "gem", parents: ["Socket Filler"] },
  // Weapon families
  { name: "Axe", code: "axe", parents: ["Melee Weapon", "Weapon"] },
  { name: "Club", code: "club", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Hammer", code: "hamm", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Mace", code: "mace", parents: ["Blunt", "Melee Weapon", "Weapon"] },
  { name: "Polearm", code: "pole", parents: ["Spear/Polearm", "Melee Weapon", "Weapon"] },
  { name: "Scepter", code: "scep", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Staff", code: "staf", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Spear", code: "spea", parents: ["Spear/Polearm", "Melee Weapon", "Weapon"] },
  { name: "Sword", code: "swor", parents: ["Blade", "Melee Weapon", "Weapon"] },
  { name: "Wand", code: "wand", parents: ["Staves And Rods", "Melee Weapon", "Weapon"] },
  { name: "Bow", code: "bow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Crossbow", code: "xbow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Knife", code: "knif", parents: ["Blade", "Melee Weapon", "Weapon"] },
  { name: "Javelin", code: "jave", parents: ["Melee Weapon", "Thrown Weapon", "Weapon"] },
  { name: "Throwing Knife", code: "tkni", parents: ["Combo Weapon", "Knife"] },
  { name: "Throwing Axe", code: "taxe", parents: ["Combo Weapon", "Axe"] },
  // Aggregations
  { name: "Blade", code: "blde", parents: ["Melee Weapon"] },
  { name: "Spear/Polearm", code: "sppl", parents: ["Melee Weapon"] },
  { name: "Blunt", code: "blun", parents: ["Melee Weapon"] },
  { name: "Staves And Rods", code: "rod", parents: ["Blunt"] },
  { name: "Thrown Weapon", code: "thro", parents: ["Weapon"] },
  { name: "Combo Weapon", code: "comb", parents: ["Melee Weapon", "Thrown Weapon"] },
  // Class-specific aggregations
  { name: "Amazon Item", code: "amaz", parents: ["Class Specific"] },
  { name: "Barbarian Item", code: "barb", parents: ["Class Specific"] },
  { name: "Necromancer Item", code: "necr", parents: ["Class Specific"] },
  { name: "Paladin Item", code: "pala", parents: ["Class Specific"] },
  { name: "Sorceress Item", code: "sorc", parents: ["Class Specific"] },
  { name: "Assassin Item", code: "assn", parents: ["Class Specific"] },
  { name: "Druid Item", code: "drui", parents: ["Class Specific"] },
  // Class specific weapons
  { name: "Amazon Bow", code: "abow", parents: ["Amazon Item", "Bow", "Missile Weapon", "Weapon"] },
  { name: "Amazon Spear", code: "aspe", parents: ["Amazon Item", "Spear", "Melee Weapon", "Weapon"] },
  { name: "Amazon Javelin", code: "ajav", parents: ["Amazon Item", "Javelin", "Melee Weapon", "Weapon"] },
  { name: "Hand to Hand", code: "h2h", parents: ["Assassin Item", "Melee Weapon", "Weapon"] },
  { name: "Orb", code: "orb", parents: ["Sorceress Item", "Weapon"] },
  // Class Specific Armors
  { name: "Primal Helm", code: "phlm", parents: ["Barbarian Item", "Helm"] },
  { name: "Pelt", code: "pelt", parents: ["Druid Item", "Helm"] },
  { name: "Voodoo Heads", code: "head", parents: ["Necromancer Item", "Any Shield"] },
  { name: "Auric Shields", code: "ashd", parents: ["Paladin Item", "Any Shield"] },
  // Miscellaneous consumables and scrolls
  { name: "Gold", code: "gold", parents: ["Miscellaneous"] },
  { name: "Player Body Part", code: "play", parents: ["Miscellaneous"] },
  { name: "Body Part", code: "body", parents: ["Miscellaneous"] },
  { name: "Herb", code: "herb", parents: ["Miscellaneous"] },
  { name: "Potion", code: "poti", parents: ["Miscellaneous"] },
  { name: "Healing Potion", code: "hpot", parents: ["Potion"] },
  { name: "Mana Potion", code: "mpot", parents: ["Potion"] },
  { name: "Rejuv Potion", code: "rpot", parents: ["Healing Potion", "Mana Potion"] },
  { name: "Stamina Potion", code: "spot", parents: ["Potion"] },
  { name: "Antidote Potion", code: "apot", parents: ["Potion"] },
  { name: "Thawing Potion", code: "wpot", parents: ["Potion"] },
  { name: "Missile Potion", code: "tpot", parents: ["Thrown Weapon"] },
  { name: "Scroll", code: "scro", parents: ["Miscellaneous"] },
  { name: "Book", code: "book", parents: ["Miscellaneous"] },
  { name: "Torch", code: "torc", parents: ["Miscellaneous"] },
  { name: "Elixir", code: "elix", parents: ["Miscellaneous"] },
  { name: "Key", code: "key", parents: ["Miscellaneous"] },
  { name: "Quest", code: "ques" },
  { name: "Bow Quiver", code: "bowq", parents: ["Missile", "Second Hand"] },
  { name: "Crossbow Quiver", code: "xboq", parents: ["Missile", "Second Hand"] },
  // Variants
  { name: "Hand to Hand 2", code: "h2h2", parents: ["Hand to Hand"] }
];
const ITEM_TYPE_BY_NAME = new Map(
  ITEM_TYPES.map((t) => [t.name, t])
);
new Map(
  ITEM_TYPES.map((t) => [t.code, t])
);
const ITEM_TYPE_BY_NAME_LC = new Map(
  ITEM_TYPES.map((t) => [t.name.toLowerCase(), t])
);
function getTypeChain(name) {
  const seen = /* @__PURE__ */ new Set();
  const chain = [];
  let current = ITEM_TYPE_BY_NAME.get(name);
  while (current && !seen.has(current.name)) {
    chain.push(current.name);
    seen.add(current.name);
    const parentName = current.parents?.[0];
    current = parentName ? ITEM_TYPE_BY_NAME.get(parentName) : void 0;
  }
  const first = ITEM_TYPE_BY_NAME.get(name);
  if (first && first.parents && first.parents.length > 1) {
    for (let i = 1; i < first.parents.length; i++) {
      const p = first.parents[i];
      if (!seen.has(p)) {
        chain.push(p);
        seen.add(p);
        const sub = getTypeChain(p);
        for (const s of sub.slice(1)) {
          if (!seen.has(s)) {
            chain.push(s);
            seen.add(s);
          }
        }
      }
    }
  }
  return chain;
}
function getChainForTypeName(rawName) {
  const raw = (rawName ?? "").trim();
  if (!raw) return [""];
  const node = ITEM_TYPE_BY_NAME.get(raw) || ITEM_TYPE_BY_NAME_LC.get(raw.toLowerCase());
  return node ? getTypeChain(node.name) : [raw];
}
const CLASS_AGGREGATE_BASES = /* @__PURE__ */ new Set([
  "Amazon Item",
  "Barbarian Item",
  "Necromancer Item",
  "Paladin Item",
  "Sorceress Item",
  "Assassin Item",
  "Druid Item"
]);
function makeTypeOption(label, baseTypeName, extraParents = []) {
  const value = baseTypeName ? getTypeChain(baseTypeName) : [];
  for (const p of extraParents) {
    if (!value.includes(p)) value.push(p);
  }
  return { label, value };
}
function resolveBaseTypeName(rawName) {
  const raw = (rawName ?? "").trim();
  if (!raw) return "";
  const chain = getChainForTypeName(raw);
  return chain && chain.length > 0 ? chain[0] : raw;
}
function buildOptionsForPresentTypes(preset, presentBaseNames) {
  const result = [];
  const presentClosure = /* @__PURE__ */ new Set();
  for (const b of presentBaseNames) {
    presentClosure.add(b);
    const chain = getTypeChain(b);
    for (const c of chain.slice(1)) presentClosure.add(c);
  }
  for (const opt of preset) {
    if (!opt.value || opt.value.length === 0) {
      result.push(opt);
      continue;
    }
    const base = opt.value[0];
    const baseChain = getTypeChain(base);
    const extras = opt.value.filter((v) => !baseChain.includes(v));
    const triggers = [base, ...extras];
    let include;
    if (CLASS_AGGREGATE_BASES.has(base)) {
      include = presentBaseNames.has(base);
    } else {
      include = triggers.some((t) => presentClosure.has(t));
    }
    if (include) result.push(opt);
  }
  return result;
}
const type_filtering_options = [
  // Placeholder
  makeTypeOption("-", void 0),
  // Aggregate types
  { label: "Any Armor", value: ["Body Armor", "Helm", "Any Shield", "Gloves", "Boots", "Belt"] },
  { label: "Any Helm", value: ["Helm", "Primal Helm", "Pelt"] },
  { label: "Any Shield", value: ["Any Shield", "Voodoo Heads", "Auric Shields"] },
  makeTypeOption("Any Weapon", "Weapon"),
  makeTypeOption("Melee Weapon", "Melee Weapon"),
  makeTypeOption("Missile Weapon", "Missile Weapon"),
  // Armor subtypes
  makeTypeOption("Body Armor", "Body Armor"),
  makeTypeOption("Gloves", "Gloves"),
  makeTypeOption("Boots", "Boots"),
  makeTypeOption("Belt", "Belt"),
  // Shields
  makeTypeOption("Shield", "Shield"),
  // Jewelry and socket fillers
  makeTypeOption("Ring", "Ring"),
  makeTypeOption("Amulet", "Amulet"),
  makeTypeOption("Jewel", "Jewel"),
  makeTypeOption("Small Charm", "Small Charm"),
  makeTypeOption("Large Charm", "Large Charm"),
  makeTypeOption("Grand Charm", "Grand Charm"),
  // Weapon bases
  makeTypeOption("Axe", "Axe"),
  makeTypeOption("Mace", "Mace"),
  makeTypeOption("Hammer", "Hammer"),
  makeTypeOption("Sword", "Sword"),
  makeTypeOption("Knife", "Knife"),
  makeTypeOption("Spear", "Spear"),
  makeTypeOption("Polearm", "Polearm"),
  makeTypeOption("Staff", "Staff"),
  makeTypeOption("Wand", "Wand"),
  makeTypeOption("Bow", "Bow"),
  makeTypeOption("Crossbow", "Crossbow"),
  makeTypeOption("Javelin", "Javelin"),
  makeTypeOption("Throwing Knife", "Throwing Knife"),
  makeTypeOption("Throwing Axe", "Throwing Axe"),
  //Class Specific
  makeTypeOption("Amazon Javelin", "Amazon Javelin"),
  makeTypeOption("Amazon Bow", "Amazon Bow"),
  makeTypeOption("Amazon Spear", "Amazon Spear"),
  makeTypeOption("Assassin Weapon", "Hand to Hand"),
  makeTypeOption("Barbarian Helm", "Primal Helm"),
  makeTypeOption("Druid Helm", "Pelt"),
  makeTypeOption("Necromancer Shield", "Voodoo Heads"),
  makeTypeOption("Paladin Shield", "Auric Shields"),
  makeTypeOption("Sorceress Orb", "Orb")
];
export {
  buildOptionsForPresentTypes as b,
  getChainForTypeName as g,
  resolveBaseTypeName as r,
  type_filtering_options as t
};
