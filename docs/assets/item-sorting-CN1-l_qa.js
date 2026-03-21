import { a as getWeaponPhysDamValue, b as getWeaponNonPhysDamValue } from "./damage-types-BlYhXdWN.js";
const character_class_options = [
  { value: "", label: "-" },
  { value: "Amazon", label: "Amazon" },
  { value: "Assassin", label: "Assassin" },
  { value: "Barbarian", label: "Barbarian" },
  { value: "Druid", label: "Druid" },
  { value: "Necromancer", label: "Necromancer" },
  { value: "Paladin", label: "Paladin" },
  { value: "Sorceress", label: "Sorceress" },
  { value: "Warlock", label: "Warlock" }
];
const weaponSortOptions = [
  { id: "sort1h", type: "1h-phys", label: "1H Physical", help: "Sort by One-Handed Physical Damage." },
  { id: "sort2h", type: "2h-phys", label: "2H Physical", help: "Sort by Two-Handed Physical Damage." },
  { id: "sortthrow", type: "throw-phys", label: "Throw Physical", help: "Sort by Throw Physical Damage." },
  { id: "sortnonphys", type: "non-phys", label: "Non-Physical", help: "Sort by Non-Physical Damage." }
];
function sortItemsByWeaponDamage(items, mode) {
  if (mode === "none") return items;
  const isAsc = mode.includes("ascending");
  return items.slice().sort((a, b) => {
    let vA = 0, vB = 0;
    if (mode.includes("1h-phys")) {
      vA = getWeaponPhysDamValue(a, [3, 0]);
      vB = getWeaponPhysDamValue(b, [3, 0]);
    } else if (mode.includes("2h-phys")) {
      vA = getWeaponPhysDamValue(a, 1);
      vB = getWeaponPhysDamValue(b, 1);
    } else if (mode.includes("throw-phys")) {
      vA = getWeaponPhysDamValue(a, 2);
      vB = getWeaponPhysDamValue(b, 2);
    } else if (mode.includes("non-phys")) {
      vA = getWeaponNonPhysDamValue(a);
      vB = getWeaponNonPhysDamValue(b);
    }
    if (vA === 0 && vB !== 0) return 1;
    if (vA !== 0 && vB === 0) return -1;
    return isAsc ? vA - vB : vB - vA;
  });
}
function toggleWeaponSort(currentMode, type) {
  if (typeof window !== "undefined" && window.getSelection()?.toString().trim()) {
    return currentMode;
  }
  const desc = `avg-${type}-descending`;
  const asc = `avg-${type}-ascending`;
  return currentMode === desc ? asc : currentMode === asc ? "none" : desc;
}
function getSortKeyFromDamageType(type) {
  if (type === 0 || type === 3) return "1h-phys";
  if (type === 1) return "2h-phys";
  if (type === 2) return "throw-phys";
  if (type === 4) return "non-phys";
  return null;
}
export {
  character_class_options as c,
  getSortKeyFromDamageType as g,
  sortItemsByWeaponDamage as s,
  toggleWeaponSort as t,
  weaponSortOptions as w
};
