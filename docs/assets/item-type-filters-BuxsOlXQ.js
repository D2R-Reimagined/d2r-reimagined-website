const ITEM_TYPES = [
  // High-level categories
  { name: "Weapon", code: "weap" },
  { name: "Melee Weapon", code: "mele", parents: ["Weapon"] },
  { name: "Missile Weapon", code: "miss", parents: ["Weapon"] },
  { name: "Any Armor", code: "armo" },
  { name: "Any Shield", code: "shld", parents: ["Any Armor"] },
  // Armor subtypes
  { name: "Armor", code: "tors", parents: ["Any Armor"] },
  // Note: itemtypes.txt in the mod shows "Helm" with a non-standard code in row 39 and also a
  //       "Merc Equip" line in row 107 that points to helm. For filters we use canonical name "Helm".
  { name: "Helm", code: "helm", parents: ["Any Armor"] },
  { name: "Circlet", code: "circ", parents: ["Helm"] },
  // Weapon families
  { name: "Axe", code: "axe", parents: ["Melee Weapon", "Weapon"] },
  { name: "Club", code: "club", parents: ["Melee Weapon", "Weapon"] },
  { name: "Hammer", code: "hamm", parents: ["Melee Weapon", "Weapon"] },
  { name: "Hand to Hand", code: "h2h", parents: ["Melee Weapon", "Weapon"] },
  { name: "Mace", code: "mace", parents: ["Melee Weapon", "Weapon"] },
  { name: "Orb", code: "orb", parents: ["Weapon"] },
  { name: "Polearm", code: "pole", parents: ["Melee Weapon", "Weapon"] },
  { name: "Scepter", code: "scep", parents: ["Melee Weapon", "Weapon"] },
  { name: "Staff", code: "staf", parents: ["Melee Weapon", "Weapon"] },
  { name: "Spear", code: "spea", parents: ["Melee Weapon", "Weapon"] },
  { name: "Sword", code: "swor", parents: ["Melee Weapon", "Weapon"] },
  { name: "Wand", code: "wand", parents: ["Melee Weapon", "Weapon"] },
  { name: "Bow", code: "bow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Crossbow", code: "xbow", parents: ["Missile Weapon", "Weapon"] },
  // Class-specific aggregations
  { name: "Amazon Item", code: "amaz" },
  { name: "Barbarian Item", code: "barb" },
  { name: "Necromancer Item", code: "necr" },
  { name: "Paladin Item", code: "pala" },
  { name: "Sorceress Item", code: "sorc" },
  { name: "Assassin Item", code: "assn" },
  { name: "Druid Item", code: "drui" },
  // Amazon specific weapons
  { name: "Amazon Bow", code: "abow", parents: ["Missile Weapon", "Weapon"] },
  { name: "Amazon Spear", code: "aspe", parents: ["Spear", "Melee Weapon", "Weapon"] },
  { name: "Amazon Javelin", code: "ajav", parents: ["Melee Weapon", "Weapon"] },
  // Shields (class specific)
  { name: "Voodoo Heads", code: "head", parents: ["Any Shield"] },
  // Necromancer shields
  { name: "Auric Shields", code: "ashd", parents: ["Any Shield"] }
  // Paladin shields
];
const ITEM_TYPE_BY_NAME = new Map(
  ITEM_TYPES.map((t) => [t.name, t])
);
new Map(
  ITEM_TYPES.map((t) => [t.code, t])
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
function canonicalizeTypeName(name) {
  const n = (name || "").trim();
  const lower = n.toLowerCase();
  switch (lower) {
    case "merc equip":
      return "Helm";
    case "body armor":
      return "Armor";
    case "shield":
      return "Any Shield";
    case "hand to hand 2":
      return "Hand to Hand";
    case "primal helm":
      return "Helm";
    case "pelt":
      return "Helm";
    default:
      return n;
  }
}
function getChainForTypeName(rawName) {
  const canon = canonicalizeTypeName(rawName);
  const exists = ITEM_TYPE_BY_NAME.has(canon);
  return exists ? getTypeChain(canon) : [canon];
}
function makeTypeOption(label, baseTypeName, extraParents = []) {
  const value = baseTypeName ? getTypeChain(baseTypeName) : [];
  for (const p of extraParents) {
    if (!value.includes(p)) value.push(p);
  }
  return { label, value };
}
const RUNEWORD_TYPE_OPTIONS = [
  makeTypeOption("-", void 0),
  makeTypeOption("Any Armor", "Any Armor"),
  // UI label says "Any Helm" but the underlying chain starts from Helm (then Any Armor)
  makeTypeOption("Any Helm", "Helm"),
  makeTypeOption("Any Weapon", "Weapon"),
  makeTypeOption("Any Melee Weapon", "Melee Weapon"),
  makeTypeOption("Any Missile Weapon", "Missile Weapon"),
  makeTypeOption("Any Shield", "Any Shield"),
  // Specific weapons
  makeTypeOption("Axe", "Axe"),
  makeTypeOption("Club", "Club"),
  makeTypeOption("Hammer", "Hammer"),
  makeTypeOption("Hand to Hand", "Hand to Hand"),
  makeTypeOption("Mace", "Mace"),
  // Orb is treated specially in some UIs; we still include parent chain for consistency
  makeTypeOption("Orb", "Orb"),
  makeTypeOption("Polearm", "Polearm"),
  makeTypeOption("Scepter", "Scepter"),
  makeTypeOption("Staff", "Staff"),
  makeTypeOption("Spear", "Spear"),
  makeTypeOption("Sword", "Sword"),
  makeTypeOption("Wand", "Wand"),
  // Specific armor
  makeTypeOption("Circlet", "Circlet"),
  // Class-specific
  makeTypeOption("Amazon Bow", "Amazon Bow"),
  makeTypeOption("Amazon Spear", "Amazon Spear"),
  // The current Runewords UI uses label "Necromancer Shield" but filters on "Necromancer Item"
  makeTypeOption("Necromancer Shield", "Necromancer Item"),
  makeTypeOption("Barbarian Item", "Barbarian Item"),
  makeTypeOption("Paladin Item", "Paladin Item"),
  makeTypeOption("Druid Item", "Druid Item")
];
const SOCKET_AMOUNT_OPTIONS = [
  { value: void 0, label: "Any" },
  { value: 2, label: "2 Sockets" },
  { value: 3, label: "3 Sockets" },
  { value: 4, label: "4 Sockets" },
  { value: 5, label: "5 Sockets" },
  { value: 6, label: "6 Sockets" }
];
export {
  RUNEWORD_TYPE_OPTIONS as R,
  SOCKET_AMOUNT_OPTIONS as S,
  canonicalizeTypeName as c,
  getChainForTypeName as g
};
