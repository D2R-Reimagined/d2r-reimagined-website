import type { Conditions, Filter, Rule, RuleBlock } from './types';

export const presetVersion = 1;
export const presets = [
  { id: 'starter', name: 'Starter', description: 'For leveling and learning Reimagined. Every drop stays visible.', hides: 'Nothing. Adds highlights to notable drops.' },
  { id: 'semi-strict', name: 'Semi Strict', description: 'A gentle reduction in equipment clutter once you have a working setup.', hides: 'Inferior and normal unsocketed, non-ethereal ordinary weapons and armor.' },
  { id: 'strict', name: 'Strict', description: 'For farming when ordinary magic equipment is no longer useful to you.', hides: 'Inferior, normal, superior and magic unsocketed, non-ethereal ordinary weapons and armor.' }
] as const;
export type PresetId = typeof presets[number]['id'];
export const protectedLoot = 'All uniques, sets, rares, crafted items, currencies, runes, gems, maps, quest items, charms, jewels, jewelry, circlets, ethereal gear and socketed bases.';

// Rules are deliberately conservative: hide only known equipment families and
// end with Show. New mod item families therefore stay visible until reviewed.
export function createPreset(id: PresetId): Filter {
  const show = (ruleName: string, conditions: Conditions, actions: Partial<RuleBlock> = {}): Rule => ({ show: { ruleName, conditions, ...actions } });
  const icon = (color: string, shape: NonNullable<RuleBlock['minimapIcon']>['shape'] = 'diamond', size = 20): RuleBlock['minimapIcon'] => ({ shape, size, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: color });
  const rules: Rule[] = [
    show('Drop-only unique and set bases', {
      rarity: ['unique', 'set'],
      code: [
        'cm1', 'cjw', '7gd', '7fb', '7gs', '7wa', 'obb', 'pae', 'paf', 'ned', 'nee', 'bae', 'uul', 'uth',
        'utp', 'upl', 'uhn', 'urs', 'aqv', 'cqv', 'ame', 'amf', 'amb', 'drb', 'drf', '7ar', '7cs', '7wb',
        'hgl', 'ghm', 'ful', 'hbt', 'hbl'
      ]
    }, {
      tooltip: { backgroundColor: 'RGBA(28, 12, 44, 0.92)', borderColor: 'RGBA(210, 120, 255, 1)', textColor: 'RGBA(240, 200, 255, 1)' },
      minimapIcon: icon('RGBA(210, 120, 255, 1)', 'star', 24),
      dropSound: 'Filter01'
    }),
    show('Uniques and sets', { rarity: ['unique', 'set'] }, {
      tooltip: { borderColor: 'RGBA(215, 175, 85, 1)' },
      minimapIcon: icon('RGBA(215, 175, 85, 1)'),
      dropSound: 'Filter01'
    }),
    show('High runes (Lem through Hev)', {
      code: [
        'r20', 'r21', 'r22', 'r23', 'r24', 'r25', 'r26', 'r27', 'r28', 'r29', 'r30', 'r31', 'r32', 'r33', 'r34', 'r35', 'r36', 'r37', 'r38', 'r39',
        's20', 's21', 's22', 's23', 's24', 's25', 's26', 's27', 's28', 's29', 's30', 's31', 's32', 's33', 's34', 's35', 's36', 's37', 's38', 's39'
      ]
    }, {
      tooltip: { backgroundColor: 'RGBA(45, 20, 5, 0.92)', borderColor: 'RGBA(255, 145, 35, 1)', textColor: 'RGBA(255, 195, 110, 1)' },
      minimapIcon: icon('RGBA(255, 145, 35, 1)', 'star', 22),
      dropSound: 'Filter02'
    }),
    show('Colossal jewels, sunder charms and torches', { itemType: ['cjwl', 'csch', 'torc'] }, {
      tooltip: { backgroundColor: 'RGBA(42, 30, 6, 0.92)', borderColor: 'RGBA(255, 215, 100, 1)', textColor: 'RGBA(255, 240, 175, 1)' },
      minimapIcon: icon('RGBA(255, 215, 100, 1)', 'star', 22),
      dropSound: 'Filter02'
    }),
    show('Power orbs and Gem Clusters', {
      code: ['ka3', '1ka', 'oos', '1os', 'ooc', '1oc', 'ooa', '1oa', 'ooi', '1oi', 'ooe', '1oe', 'oor', '1or', '1gc']
    }, {
      tooltip: { backgroundColor: 'RGBA(15, 28, 48, 0.92)', borderColor: 'RGBA(110, 200, 255, 1)', textColor: 'RGBA(185, 230, 255, 1)' },
      minimapIcon: icon('RGBA(110, 200, 255, 1)', 'square', 20),
      dropSound: 'Filter03'
    }),
    show('Uber keys, organs, essences and endgame tokens', {
      code: [
        'pk1', 'pk2', 'pk3', 'dhn', 'bey', 'mbr', 'tes', 'ceh', 'bet', 'fed', 'toa', 'std', 'ttd', 'luv', 'lab',
        'xa1', 'xa2', 'xa3', 'xa4', 'xa5', 'ua1', 'ua2', 'ua3', 'ua4', 'ua5', 'um1', 'um2', 'um3', 'um4', 'um5', 'um6',
        'tws', 'scs', 'mpa', 'blc', 'dia'
      ]
    }, {
      tooltip: { backgroundColor: 'RGBA(40, 10, 20, 0.9)', borderColor: 'RGBA(255, 95, 120, 1)', textColor: 'RGBA(255, 190, 200, 1)' },
      minimapIcon: icon('RGBA(255, 95, 120, 1)', 'square', 20),
      dropSound: 'Filter04'
    }),
    show('Maps and map currency', { itemType: ['mapi', 'mcur'] }, {
      tooltip: { borderColor: 'RGBA(190, 120, 255, 1)' },
      minimapIcon: icon('RGBA(190, 120, 255, 1)')
    }),
    show('Quest items', { itemType: 'ques' }, {
      tooltip: { borderColor: 'RGBA(230, 195, 110, 1)', textColor: 'RGBA(245, 220, 150, 1)' },
      minimapIcon: icon('RGBA(230, 195, 110, 1)', 'square', 18)
    }),
    show('Runes, gems and Reimagined currencies', { itemType: ['rune', 'runx', 'gem', 'gemx', 'gemo', 'pgem', 'stor', 'grab'] }, { tooltip: { textColor: 'RGBA(255, 180, 90, 1)' } }),
    show('Charms, jewels and jewelry', { itemType: ['char', 'jewl', 'cjwl', 'csch', 'ring', 'amul', 'torc'] }),
    show('Circlets', { itemType: 'circ' }, {
      tooltip: { borderColor: 'RGBA(190, 210, 255, 1)', textColor: 'RGBA(225, 235, 255, 1)' }
    }),
    show('Rare and crafted equipment', { rarity: ['rare', 'crafted'] }),
    show('Ethereal equipment', { ethereal: true }),
    show('Socketed bases', { sockets: { gte: 1 } }),
    show('Buff and sunder potions', { code: ['mfp', 'xpp', 'fsp', 'csp', 'lsp', 'psp', 'msp', 'php'] }, {
      tooltip: { textColor: 'RGBA(185, 255, 225, 1)' }
    })
  ];
  if (id !== 'starter') rules.push({ hide: { ruleName: id === 'strict' ? 'Hide ordinary equipment through magic' : 'Hide ordinary inferior and normal equipment',
    conditions: { itemType: ['weap', 'armo'], rarity: id === 'strict' ? ['inferior', 'normal', 'superior', 'magic'] : ['inferior', 'normal'], sockets: { eq: 0 }, ethereal: false } } });
  rules.push({ show: { ruleName: 'Keep everything else visible' } });
  return { version: 3, rules };
}
