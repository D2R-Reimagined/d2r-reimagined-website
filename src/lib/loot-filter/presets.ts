import type { Conditions, Filter, Rule, RuleBlock } from './types';

export const presetVersion = 1;
export const presets = [
  { id: 'starter', name: 'Starter', description: 'For leveling and learning Reimagined. Every drop stays visible.', hides: 'Nothing. Adds highlights to notable drops.' },
  { id: 'semi-strict', name: 'Semi Strict', description: 'A gentle reduction in equipment clutter once you have a working setup.', hides: 'Inferior and normal unsocketed, non-ethereal ordinary weapons and armor.' },
  { id: 'strict', name: 'Strict', description: 'For farming when ordinary magic equipment is no longer useful to you.', hides: 'Inferior, normal, superior and magic unsocketed, non-ethereal ordinary weapons and armor.' }
] as const;
export type PresetId = typeof presets[number]['id'];
export const protectedLoot = 'All uniques, sets, rares, currencies, runes, gems, maps, quest items, charms, jewels, jewelry, class-specific gear, ethereal gear and socketed bases.';

// Rules are deliberately conservative: hide only known equipment families and
// end with Show. New mod item families therefore stay visible until reviewed.
export function createPreset(id: PresetId): Filter {
  const show = (ruleName: string, conditions: Conditions, actions: Partial<RuleBlock> = {}): Rule => ({ show: { ruleName, conditions, ...actions } });
  const icon = (color: string): RuleBlock['minimapIcon'] => ({ shape: 'diamond', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: color });
  const rules: Rule[] = [
    show('Uniques and sets', { rarity: ['unique', 'set'] }, { minimapIcon: icon('RGBA(215, 175, 85, 1)'), dropSound: 'Filter01' }),
    show('Quest items', { itemType: 'ques' }),
    show('Maps and map currency', { itemType: ['mapi', 'mcur'] }, { minimapIcon: icon('RGBA(190, 120, 255, 1)') }),
    show('Runes, gems and Reimagined currencies', { itemType: ['rune', 'runx', 'gem', 'gemx', 'gemo', 'pgem', 'elix', 'orbx', 'stor', 'grab'] }, { tooltip: { textColor: 'RGBA(255, 180, 90, 1)' } }),
    show('Charms, jewels and jewelry', { itemType: ['char', 'jewl', 'cjwl', 'csch', 'ring', 'amul', 'circ', 'torc'] }),
    show('Rare equipment', { rarity: 'rare' }),
    show('Class-specific and mercenary equipment', { itemType: ['clas', 'merc', 'helm'] }),
    show('Ethereal equipment', { ethereal: true }),
    show('Socketed bases', { sockets: { gte: 1 } })
  ];
  if (id !== 'starter') rules.push({ hide: { ruleName: id === 'strict' ? 'Hide ordinary equipment through magic' : 'Hide ordinary inferior and normal equipment',
    conditions: { itemType: ['weap', 'armo'], rarity: id === 'strict' ? ['inferior', 'normal', 'superior', 'magic'] : ['inferior', 'normal'], sockets: { eq: 0 }, ethereal: false } } });
  rules.push({ show: { ruleName: 'Keep everything else visible' } });
  return { version: 3, rules };
}
