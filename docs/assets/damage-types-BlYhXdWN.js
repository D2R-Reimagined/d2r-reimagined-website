function getDamageTypeString(type) {
  switch (type) {
    case 4:
      return "Elemental Damage:";
    case 3:
      return "Damage:";
    case 2:
      return "Throw Damage:";
    case 1:
      return "Two-Hand Damage:";
    case 0:
      return "One-Hand Damage:";
    default:
      return "Damage:";
  }
}
function getWeaponPhysDamValue(unique, dam_type) {
  const types = Array.isArray(dam_type) ? dam_type : [dam_type];
  const damEntry = unique.Equipment?.DamageTypes?.find((e) => types.includes(e.Type));
  return damEntry?.AverageDamage ?? 0;
}
function getWeaponNonPhysDamValue(unique) {
  return unique.Equipment?.DamageTypes?.filter((d) => d.Type === 4).reduce((acc, d) => {
    return acc + (d.AverageDamage ?? 0);
  }, 0) ?? 0;
}
export {
  getWeaponPhysDamValue as a,
  getWeaponNonPhysDamValue as b,
  getDamageTypeString as g
};
