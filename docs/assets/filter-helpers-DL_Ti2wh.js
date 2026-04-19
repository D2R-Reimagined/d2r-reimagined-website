function prependTypeResetOption(options, label = "-") {
  const reset = { id: "", label, value: void 0 };
  return [reset, ...options];
}
function toOptionalNumber(val, clampMin = 0, clampMax = 100) {
  if (val === void 0 || val === null) return void 0;
  if (typeof val === "string") {
    const t = val.trim();
    if (t === "") return void 0;
    const n = Number(t);
    return Number.isFinite(n) ? Math.max(clampMin, Math.min(clampMax, Math.floor(n))) : void 0;
  }
  if (Number.isFinite(val)) {
    return Math.max(clampMin, Math.min(clampMax, Math.floor(val)));
  }
  return void 0;
}
function swapMinMax(min, max) {
  if (typeof min === "number" && typeof max === "number" && min > max) {
    return [max, min];
  }
  return [min, max];
}
function tokenizeSearch(input) {
  const raw = (input || "").trim().toLowerCase();
  if (!raw) return [];
  return raw.split(/[,|]/).map((group) => {
    const tokens = [];
    for (const segment of group.split("+")) {
      const parts = segment.trim().split(/\s+(?=[-!]\S)/);
      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (/^[-!]\S/.test(trimmed)) {
          const term = trimmed.slice(1).trim();
          if (term) tokens.push({ term, negated: true });
        } else {
          tokens.push({ term: trimmed, negated: false });
        }
      }
    }
    return tokens;
  }).filter((group) => group.length > 0);
}
function matchesTokenGroups(hay, groups) {
  return groups.some(
    (group) => group.every((t) => t.negated ? !hay.includes(t.term) : hay.includes(t.term))
  );
}
function isVanillaItem(vanilla) {
  if (vanilla === void 0 || vanilla === null) return false;
  const vStr = typeof vanilla === "string" || typeof vanilla === "number" || typeof vanilla === "boolean" ? String(vanilla).toUpperCase() : "";
  return vStr === "Y";
}
export {
  toOptionalNumber as a,
  isVanillaItem as i,
  matchesTokenGroups as m,
  prependTypeResetOption as p,
  swapMinMax as s,
  tokenizeSearch as t
};
