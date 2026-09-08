export interface HealthStats {
    Level: number; MinHP: number; MaxHP: number;
    PhysicalResist: number; MagicResist: number; FireResist: number;
    LightningResist: number; ColdResist: number; PoisonResist: number;
}
export interface HealthMonster {
    Id: string; NameKey: string; Enabled: boolean; Killable: boolean; Boss: boolean;
    NoRatio: boolean; Align: number; DamageRegen: number | null; MonProp: string;
    Stats: HealthStats[]; Areas: number[][];
}
export interface HealthData {
    Rules: { AdditionalPlayerPercent: number; MaximumPlayers: number; MaximumLife: number };
    Monsters: HealthMonster[];
    Levels: { Level: number; HP: (number | null)[]; LHP: (number | null)[] }[];
    Areas: { Id: number; NameKey: string; Levels: number[] }[];
    Bonuses: { Minion: number[]; Champion: number[]; Unique: number[] };
    Sources: { Code: string; Hash: string }[];
}
export type HealthKind = 'normal' | 'minion' | 'champion' | 'unique';
export interface HealthInputs {
    level: number; min: number; max: number; scale: number; noRatio: boolean;
    playerPercent: number; typePercent: number; extraPercent: number; flatLife: number;
}
export function healthInputs(data: HealthData, monster: HealthMonster, difficulty: number,
    areaId: number, profile: 'HP' | 'LHP', kind: HealthKind): HealthInputs {
    const stats = monster.Stats[difficulty];
    const area = data.Areas.find(a => a.Id === areaId);
    // Unique/champion level additions happen after initial health allocation.
    const level = difficulty > 0 && !monster.Boss && !monster.NoRatio && area?.Levels[difficulty]
        ? area.Levels[difficulty] : stats.Level;
    const bonus = kind === 'normal' ? 0 : data.Bonuses[kind === 'minion' ? 'Minion' : kind === 'champion' ? 'Champion' : 'Unique'][difficulty];
    return { level, min: stats.MinHP, max: stats.MaxHP, scale: levelScale(data, level, difficulty, profile),
        noRatio: monster.NoRatio, playerPercent: monster.Align === 0 ? data.Rules.AdditionalPlayerPercent : 0,
        typePercent: bonus, extraPercent: 0, flatLife: 0 };
}
export function levelScale(data: HealthData, level: number, difficulty: number, profile: 'HP' | 'LHP') {
    const last = Math.max(...data.Levels.map(l => l.Level));
    return data.Levels.find(l => l.Level === Math.min(level, last))?.[profile][difficulty] ?? NaN;
}
// Legacy engine percentage helper deliberately divides first for large values.
function percentage(value: number, percent: number) {
    if (value > 1048576) return percent * Math.trunc(value / 100);
    if (percent > 65536 && Math.trunc(percent / 16) >= 100) return value * Math.trunc(percent / 100);
    return Math.trunc(value * percent / 100);
}
export function calculateHealth(data: HealthData, input: HealthInputs, players: number) {
    const values = [input.level, input.min, input.max, input.noRatio ? 0 : input.scale, input.playerPercent, input.typePercent, input.extraPercent, input.flatLife, players];
    if (values.some(v => !Number.isFinite(v) || !Number.isInteger(v)) || input.level < 0 ||
        input.min < 0 || input.max < input.min || (!input.noRatio && input.scale < 0) || input.playerPercent < 0 ||
        input.typePercent < -100 || input.extraPercent < -100 || input.flatLife < 0 ||
        players < 1 || players > data.Rules.MaximumPlayers || values.some(v => Math.abs(v) > 2147483647)) {
        return { error: 'Enter whole numbers within the supported range, with maximum HP at least minimum HP.' };
    }
    const base = [input.min, input.max].map(v => input.noRatio ? v : Math.trunc(v * input.scale / 100));
    if (base.some(v => !Number.isSafeInteger(v) || v > 2147483647)) {
        return { error: 'Base health exceeds the supported engine integer range. Reduce the HP values or level-table scale.' };
    }
    const uncapped = base.map(v => v + percentage(v, (players - 1) * input.playerPercent));
    const playerLife = uncapped.map(v => Math.min(v, data.Rules.MaximumLife));
    // Elite bonuses apply after player scaling, to the 8-bit fixed-point life stat.
    const typed = playerLife.map(v => (v * 256 + percentage(v * 256, input.typePercent)) / 256);
    const final = typed.map(v => Math.floor((v * 256 + percentage(v * 256, input.extraPercent)) / 256 + input.flatLife));
    if (final.some(v => !Number.isSafeInteger(v) || v > data.Rules.MaximumLife)) {
        return { error: 'This setup exceeds the signed life-stat range; the game may overflow. Reduce the health or bonuses.' };
    }
    return { base, playerLife, typed, min: final[0], max: final[1], average: (final[0] + final[1]) / 2,
        capped: uncapped.some(v => v > data.Rules.MaximumLife) };
}
