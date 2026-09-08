/** Integer animation simulation. Content comes from the multi-exporter's mod bundle. */
export interface IasRule {
  Kind: string; SequenceFrames: Partial<Record<string, number>>; DualFrames: number;
  DualRequired: boolean; DualAllowed: boolean; SpeedAdjustment: number; Hits: number;
  SelfSpeedCalc?: string | null;
}
export interface IasWeapon {
  Code: string; NameKey: string; Speed: number; WeaponClass: string; TwoHandClass: string | null;
  TwoHanded: boolean; OneOrTwoHanded: boolean; Types: string[]; ClassCode: string;
}
export interface IasSkill {
  Code: string; NameKey: string; ClassCode: string; Mode: string; Sequence: string | null;
  Rule: IasRule; IncludeTypes: string[]; ExcludeTypes: string[];
  Restrict: string | null; States: string[]; Rollback: number[] | null; Hits: number[] | null; SelfSpeed: number[] | null;
}
export interface IasAnimation { Code: string; Frames: number; AnimationSpeed: number; ActionFrames: number[] }
export interface IasData {
  SchemaVersion: number;
  Sources: { Code: string; Hash: string }[];
  Classes: { ClassCode: string; Token: string; NameKey: string }[];
  FormTokens: Record<string, string>;
  Weapons: IasWeapon[]; Skills: IasSkill[];
  Buffs: { Code: string; NameKey: string; Values: number[] | null }[];
  Animations: IasAnimation[]; StartingFrames: Record<string, number>;
}
export interface IasState {
  character: string; skill: string; weapon: string; secondary: string; form: string;
  ias: number; weaponIas: number; secondaryIas: number; level: number;
  slow: number; extraSpeed: number; chilled: boolean; oneHanded: boolean;
  buffs: Record<string, number>;
}
export interface IasBreakpoint { ias: number; frames: number[]; total: number; attacksPerSecond: number }
export interface IasTable { label: string; rows: IasBreakpoint[]; current: IasBreakpoint; next?: IasBreakpoint }
export interface IasResult { tables: IasTable[]; error?: string; notes: string[] }
export const normalAttack = 'attack';
export const maxIas = 10000;
export const unarmed: IasWeapon = { Code: '', NameKey: '', Speed: 0, WeaponClass: 'HTH', TwoHandClass: null, TwoHanded: false, OneOrTwoHanded: false, Types: [], ClassCode: '' };
const normalRule: IasRule = { Kind: 'normal', SequenceFrames: {}, DualFrames: 0, DualRequired: false, DualAllowed: false, SpeedAdjustment: 0, Hits: 1 };
const integer = (value: unknown, min: number, max: number, fallback = min): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : fallback;
};
export const itemEias = (ias: number): number => Math.floor(120 * ias / (120 + ias));

export function skillAvailable(skill: IasSkill, character: string, form: string): boolean {
  if (skill.ClassCode && skill.ClassCode !== character) return false;
  if (form === 'human') return skill.Restrict !== '2';
  return skill.States.includes(form) || skill.Restrict === '0';
}

export function weaponAvailable(weapon: IasWeapon, character: string, skill?: IasSkill): boolean {
  if (weapon.ClassCode && weapon.ClassCode !== character) return false;
  if (!skill) return true;
  // Shield skills use the equipped weapon's speed; a shield is a separate requirement.
  const required = skill.IncludeTypes.filter(t => t !== 'shld');
  return (!required.length || required.some(t => weapon.Types.includes(t))) &&
    !skill.ExcludeTypes.some(t => weapon.Types.includes(t));
}

export function canDualWield(weapon: IasWeapon, character: string): boolean {
  return character === 'bar' ? !weapon.TwoHanded || weapon.OneOrTwoHanded :
    character === 'ass' && weapon.Types.includes('h2h');
}

export function readIasUrl(url: URL, data: IasData): IasState {
  const p = url.searchParams;
  const character = data.Classes.some(c => c.ClassCode === p.get('class')) ? p.get('class')! : data.Classes[0]?.ClassCode ?? 'ama';
  const form = p.get('form') && data.FormTokens[p.get('form')!] ? p.get('form')! : 'human';
  const skill = data.Skills.find(s => s.Code === p.get('skill') && skillAvailable(s, character, form));
  const weapon = data.Weapons.find(w => w.Code === p.get('weapon') && weaponAvailable(w, character, skill));
  const secondary = data.Weapons.find(w => w.Code === p.get('secondary') && weaponAvailable(w, character, skill) && canDualWield(w, character));
  return {
    character, form, skill: skill?.Code ?? normalAttack, weapon: weapon?.Code ?? '',
    secondary: secondary && weapon && canDualWield(weapon, character) && skill?.Rule.DualAllowed ? secondary.Code : '',
    ias: integer(p.get('ias'), 0, maxIas), weaponIas: weapon ? integer(p.get('wias'), 0, maxIas) : 0, secondaryIas: secondary ? integer(p.get('swias'), 0, maxIas) : 0,
    level: integer(p.get('level'), 1, 100), slow: integer(p.get('slow'), 0, 100), extraSpeed: integer(p.get('speed'), -200, 200, 0),
    chilled: p.get('chilled') === '1', oneHanded: p.get('onehand') === '1',
    buffs: Object.fromEntries(data.Buffs.map(b => [b.Code, integer(p.get(`buff.${b.Code}`), 0, b.Values?.length ?? 0)]))
  };
}

export function writeIasUrl(url: URL, state: IasState, data: IasData): URL {
  const result = new URL(url);
  const values: Record<string, string | number> = { class: state.character, form: state.form === 'human' ? '' : state.form,
    skill: state.skill === normalAttack ? '' : state.skill, weapon: state.weapon, secondary: state.secondary,
    ias: state.ias || '', wias: state.weaponIas || '', swias: state.secondary ? state.secondaryIas || '' : '',
    level: state.level === 1 ? '' : state.level, slow: state.slow || '', speed: state.extraSpeed || '',
    chilled: state.chilled ? 1 : '', onehand: state.oneHanded ? 1 : '' };
  for (const buff of data.Buffs) values[`buff.${buff.Code}`] = state.buffs[buff.Code] || '';
  for (const [key, value] of Object.entries(values)) {
    if (value === '') result.searchParams.delete(key); else result.searchParams.set(key, String(value));
  }
  return result;
}

export function calculateIas(data: IasData, input: IasState): IasResult {
  const fail = (error: string): IasResult => ({ tables: [], notes: [], error });
  if (data.SchemaVersion !== 1) return fail('This attack-speed dataset needs to be updated.');
  const character = data.Classes.find(c => c.ClassCode === input.character);
  if (!character) return fail('Choose a character class.');
  const skill = data.Skills.find(s => s.Code === input.skill);
  if (input.skill !== normalAttack && (!skill || !skillAvailable(skill, input.character, input.form))) return fail('Choose an attack available for this class and form.');
  const weapon = input.weapon ? data.Weapons.find(w => w.Code === input.weapon) : unarmed;
  const secondary = input.secondary ? data.Weapons.find(w => w.Code === input.secondary) : undefined;
  if (!weapon || !weaponAvailable(weapon, input.character, skill)) return fail('Choose a compatible weapon.');
  const rule = skill?.Rule ?? normalRule;
  if (rule.DualRequired && !secondary) return fail('This attack requires a second weapon.');
  if (input.secondary && (!secondary || !rule.DualAllowed || !canDualWield(weapon, input.character) ||
    !canDualWield(secondary, input.character) || !weaponAvailable(secondary, input.character, skill))) return fail('Choose a compatible second weapon.');
  if (input.form !== 'human' && secondary) return fail('Dual-wielded attacks in wereform do not have verified timing data.');
  const level = integer(input.level, 1, 100);
  const ias = integer(input.ias, 0, maxIas);
  const wias = weapon.Code ? integer(input.weaponIas, 0, maxIas) : 0;
  const swias = integer(input.secondaryIas, 0, maxIas);
  let skillSpeed = integer(input.extraSpeed, -200, 200, 0) - integer(input.slow, 0, 100) - (input.chilled ? 50 : 0) + rule.SpeedAdjustment;
  if (rule.SelfSpeedCalc && !skill?.SelfSpeed) return fail('This attack’s skill-speed bonus could not be evaluated from the mod data.');
  if (skill?.SelfSpeed) skillSpeed += skill.SelfSpeed[level - 1];
  for (const buff of data.Buffs) {
    const rank = integer(input.buffs[buff.Code], 0, 100);
    if (!rank) continue;
    if (!buff.Values || buff.Values[rank - 1] === undefined) return fail('A selected buff has no verified speed value at this level.');
    if (buff.Code === 'Wearwolf' && input.form !== 'wolf' || buff.Code === 'Maul' && input.form !== 'bear') continue;
    skillSpeed += buff.Values[rank - 1];
  }
  const notes: string[] = [];
  if (skill?.IncludeTypes.includes('shld')) notes.push('Equip a shield. Its IAS belongs in equipment IAS.');
  if (rule.Kind === 'whirlwind') notes.push('Whirlwind checks its first two hits at frames 4 and 8. The table describes subsequent checks.');
  if (secondary && rule.Kind === 'sequence') notes.push('Dual-wield sequence timings use both weapons. In-game hit dispatch can differ because of D2R’s weapon-switching behavior.');
  if (rule.Kind === 'rollback') notes.push('The frame pattern includes the opening hit, follow-up hits, and final recovery. Attacks per second averages the complete sequence.');
  if (input.form === 'bear') notes.push('Maul’s speed bonus depends on your active charges. Enter that bonus under Other skill IAS.');

  const animationMap = new Map(data.Animations.map(a => [a.Code, a]));
  const weaponClass = (w: IasWeapon) => w.TwoHanded && !(input.character === 'bar' && w.OneOrTwoHanded && (input.oneHanded || !!secondary || rule.Kind === 'whirlwind')) ? w.TwoHandClass || w.WeaponClass : w.WeaponClass;
  const wc = weaponClass(weapon);
  const mode = rule.Kind === 'whirlwind' ? 'A1' : skill?.Mode ?? 'A1';
  const humanAnimation = (mode: string, wclass: string) => animationMap.get(character.Token + mode + wclass);
  const base = humanAnimation(mode === 'SQ' || input.form !== 'human' ? 'A1' : mode, wc);
  if (!base || base.Frames <= 0 || base.AnimationSpeed <= 0) return fail('Animation timing is unavailable for this attack and weapon combination.');
  const formAnimation = input.form === 'human' ? undefined : animationMap.get(data.FormTokens[input.form] + (mode === 'S3' ? 'S3' : 'A1') + 'HTH');
  const formBase = input.form === 'human' ? undefined : animationMap.get(data.FormTokens[input.form] + 'A1HTH');
  if (input.form !== 'human' && (!formAnimation || !formBase)) return fail('Animation timing is unavailable for this wereform.');
  const sequenceFrames = secondary && rule.DualFrames ? rule.DualFrames : rule.SequenceFrames[wc] ?? rule.SequenceFrames['*'];
  if (mode === 'SQ' && rule.Kind !== 'whirlwind' && (!sequenceFrames || rule.Kind !== 'sequence')) return fail('This skill uses a special animation sequence whose timing is not yet verified.');
  if (rule.Kind === 'rollback' && (!skill?.Rollback || !skill.Hits)) return fail('This attack’s repeat timing could not be evaluated from the mod data.');
  const attackCount = rule.Kind === 'rollback' ? integer(skill!.Hits![level - 1], 1, 24) : secondary && rule.DualFrames ? 2 : rule.Hits;
  if (rule.Kind === 'sequence') notes.push(`Frames describe the complete ${attackCount}-hit sequence, not each individual hit.`);
  if (rule.Kind === 'rollback') notes.push(`Assumes ${attackCount} attacks complete. Interruptions or fewer available targets can shorten the sequence.`);
  if (input.buffs.Frenzy > 0) notes.push('The Frenzy bonus assumes a fully charged buff.');
  const rollback = rule.Kind === 'rollback' ? skill!.Rollback![level - 1] : 0;
  if (rollback < 0 || rollback > 100) return fail('The exported repeat timing is outside the supported range.');

  function at(equipmentIas: number, animation: IasAnimation, offhand = false): IasBreakpoint {
    let effective = skillSpeed + itemEias(equipmentIas + (offhand ? swias : wias)) - (offhand ? secondary!.Speed : weapon!.Speed);
    if (secondary && rule.Kind === 'sequence') effective = Math.trunc(skillSpeed + (itemEias(equipmentIas + wias) + itemEias(equipmentIas + swias) - weapon!.Speed - secondary.Speed) / 2);
    if (rule.Kind === 'sequence') effective -= 30;
    effective = Math.max(-85, Math.min(formAnimation ? 150 : 75, effective));
    const animationSpeed = rule.Kind === 'sequence' ? 256 : animation.AnimationSpeed;
    const rate = formAnimation && formBase ? Math.trunc((animationSpeed + Math.trunc(animationSpeed * effective / 100)) * formBase.Frames / animation.Frames) : Math.trunc(animationSpeed * (100 + effective) / 100);
    const length = formAnimation?.Frames ?? (rule.Kind === 'sequence' ? sequenceFrames! : animation.Frames);
    const start = !skill && !formAnimation ? data.StartingFrames[character!.Token + wc] ?? 0 : 0;
    let frames: number[];
    if (rule.Kind === 'rollback') {
      const action = (formAnimation ?? animation).ActionFrames[0];
      if (action === undefined) return { ias: equipmentIas, frames: [], total: 0, attacksPerSecond: 0 };
      let position = start;
      frames = [];
      for (let hit = 0; hit < attackCount - 1; hit++) {
        const duration = Math.ceil(256 * (action - position) / rate);
        frames.push(duration);
        position = Math.trunc(Math.trunc((256 * position + duration * rate) / 256) * (100 - rollback) / 100);
      }
      frames.push(Math.ceil(256 * (length - position) / rate) - 1);
    } else if (rule.Kind === 'whirlwind') {
      const action = animation.ActionFrames[0];
      frames = action === undefined ? [] : [Math.max(4, Math.floor(256 * action / rate))];
    } else {
      frames = [Math.ceil(256 * (length - start) / rate) - (rule.Kind === 'sequence' ? 0 : 1)];
    }
    const total = frames.reduce((sum, n) => sum + n, 0);
    return { ias: equipmentIas, frames, total, attacksPerSecond: total > 0 ? 25 * attackCount / total : 0 };
  }
  const animations: { label: string; animation: IasAnimation; offhand?: boolean }[] = [{ label: 'Attack', animation: base }];
  if (!skill && !formAnimation) {
    const alternate = humanAnimation('A2', wc);
    if (alternate && (alternate.Frames !== base.Frames || alternate.AnimationSpeed !== base.AnimationSpeed)) animations.push({ label: 'Alternate swing', animation: alternate });
  }
  if (secondary && rule.Kind === 'whirlwind') {
    const other = humanAnimation('A1', weaponClass(secondary));
    if (!other) return fail('Animation timing is unavailable for the second weapon.');
    animations.push({ label: 'Second weapon', animation: other, offhand: true });
  }
  const tables: IasTable[] = [];
  for (const entry of animations) {
    const rows: IasBreakpoint[] = [];
    for (let amount = 0; amount <= maxIas; amount++) {
      const row = at(amount, entry.animation, entry.offhand);
      if (!row.frames.length || row.frames.some(n => n <= 0 || !Number.isFinite(n))) return fail('This combination has no verified action timing.');
      if (!rows.length || row.frames.join('/') !== rows[rows.length - 1].frames.join('/')) rows.push(row);
    }
    const current = rows.findLast(row => row.ias <= ias)!;
    tables.push({ label: entry.label, rows, current, next: rows.find(row => row.ias > ias) });
  }
  if (secondary && rule.Kind === 'whirlwind') {
    const rows: IasBreakpoint[] = [];
    for (const amount of [...new Set(tables.flatMap(t => t.rows.map(r => r.ias)))].sort((a, b) => a - b)) {
      const total = Math.ceil(tables.reduce((sum, t) => sum + t.rows.findLast(r => r.ias <= amount)!.total, 0) / 2);
      if (rows.at(-1)?.total !== total) rows.push({ ias: amount, frames: [total], total, attacksPerSecond: 25 / total });
    }
    tables.unshift({ label: 'Combined hit checks', rows, current: rows.findLast(r => r.ias <= ias)!, next: rows.find(r => r.ias > ias) });
  }
  return { tables, notes };
}
