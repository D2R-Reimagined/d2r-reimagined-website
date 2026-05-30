import { a as getWeaponPhysDamValue, b as getWeaponNonPhysDamValue } from "./damage-types-BlYhXdWN.js";
const weaponSortOptions = [
  { id: "sort1h", type: "1h-phys", label: "sort_1h_phys", help: "sort_1h_phys_help" },
  { id: "sort2h", type: "2h-phys", label: "sort_2h_phys", help: "sort_2h_phys_help" },
  { id: "sortthrow", type: "throw-phys", label: "sort_throw_phys", help: "sort_throw_phys_help" },
  { id: "sortnonphys", type: "non-phys", label: "sort_non_phys", help: "sort_non_phys_help" }
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
  { value: "1h", label: "label_1h_only" },
  { value: "2h", label: "label_2h_only" }
];
function passesHandFilter(damageTypes, mode) {
  if (!mode) return true;
  const has2H = Array.isArray(damageTypes) && damageTypes.some((d) => d.Type === 1);
  if (mode === "1h") return !has2H;
  if (mode === "2h") return has2H;
  return true;
}
export {
  getSortKeyFromDamageType as g,
  handFilterOptions as h,
  passesHandFilter as p,
  sortItemsByWeaponDamage as s,
  toggleWeaponSort as t,
  weaponSortOptions as w
};
