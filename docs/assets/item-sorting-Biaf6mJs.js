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
  let getValue;
  if (mode.includes("1h-phys")) {
    getValue = (item) => getWeaponPhysDamValue(item, [3, 0]);
  } else if (mode.includes("2h-phys")) {
    getValue = (item) => getWeaponPhysDamValue(item, 1);
  } else if (mode.includes("throw-phys")) {
    getValue = (item) => getWeaponPhysDamValue(item, 2);
  } else {
    getValue = (item) => getWeaponNonPhysDamValue(item);
  }
  const decorated = items.map((item) => ({ item, val: getValue(item) }));
  decorated.sort((a, b) => {
    if (a.val === 0 && b.val !== 0) return 1;
    if (a.val !== 0 && b.val === 0) return -1;
    return isAsc ? a.val - b.val : b.val - a.val;
  });
  return decorated.map((d) => d.item);
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
const handFilterOptions = [
  { value: "", label: "-" },
  { value: "1h", label: "1H Only" },
  { value: "2h", label: "2H Only" }
];
function passesHandFilter(damageTypes, mode) {
  if (!mode) return true;
  const has2H = Array.isArray(damageTypes) && damageTypes.some((d) => d.Type === 1);
  if (mode === "1h") return !has2H;
  if (mode === "2h") return has2H;
  return true;
}
export {
  character_class_options as c,
  getSortKeyFromDamageType as g,
  handFilterOptions as h,
  passesHandFilter as p,
  sortItemsByWeaponDamage as s,
  toggleWeaponSort as t,
  weaponSortOptions as w
};
