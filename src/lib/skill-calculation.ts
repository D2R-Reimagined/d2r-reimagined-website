import type { Skill, SkillDamageScale, SkillDescriptionLine } from '#lib/types.js';

interface CalcContext {
  skill: Skill;
  skillsByCode: Map<string, Skill>;
  /** `lvl` / `sklvl` — skill levels including +skills. */
  ranks: Record<number, number>;
  /** `blvl` — hard points only, mirroring the exporter's CalcLevels.BaseLevel. */
  baseRanks: Record<number, number>;
  /** `ulvl` — the character level, when the caller has a real or user-chosen one. */
  characterLevel?: number;
  expanding: Set<string>;
  /** `stat('name')` references read during evaluation; the site has no character stats, so they read 0. */
  stats: Set<string>;
}

/**
 * skillcalc.txt's formula-shaped codes: `lnXY` is a linear progression and `dmXY` the diminishing
 * one over a Param pair. The digits do not always name the Params (`ln91` reads Param9/Param10,
 * `ln21` Param11/Param12, …), so the pairs are listed as the table spells them. `dmXY` uses the
 * exporter's `calcFormulaOverrides` form, which truncates `(110*lvl)/(lvl+6)` before applying it,
 * as the game does. Each is evaluated in the scope that names it: inside `skill('X'.ln56)` the
 * Params and `lvl` are X's.
 */
const FORMULA_PARAMS: Record<string, [string, string]> = {
  '12': ['par1', 'par2'],
  '34': ['par3', 'par4'],
  '56': ['par5', 'par6'],
  '78': ['par7', 'par8'],
  '91': ['par9', 'pa10'],
  '21': ['pa11', 'pa12'],
  '43': ['pa13', 'pa14'],
  '65': ['pa15', 'pa16'],
  '87': ['pa17', 'pa18'],
  '92': ['pa19', 'pa20']
};

const FORMULAS = new Map<string, string>(
  Object.entries(FORMULA_PARAMS).flatMap(([digits, [base, step]]): Array<[string, string]> => [
    [`ln${digits}`, `${base} + (lvl - 1) * ${step}`],
    [`dm${digits}`, `((110 * lvl) / (lvl + 6)) * (${step} - ${base}) / 100 + ${base}`]
  ])
);

export function skillSynergyBonus(
  skill: Skill,
  scale: SkillDamageScale,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number> = ranks,
  characterLevel?: number
): number {
  return safeEvaluate(scaleExpression(skill, scale), skill, skills, ranks, baseRanks, characterLevel);
}

function scaleExpression(skill: Skill, scale: SkillDamageScale): string | undefined {
  return {
    physical: skill.Calculation?.PhysicalDamage,
    elemental: skill.Calculation?.ElementalDamage,
    elementalLength: skill.Calculation?.ElementalLength
  }[scale];
}

/**
 * The damage percentage for one description line: its own missile-sourced `scaleCalc` when
 * present, otherwise the skill's `*SymPerCalc` named by `scale`, otherwise none.
 */
export function skillLineSynergyBonus(
  line: SkillDescriptionLine,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number> = ranks,
  characterLevel?: number
): number {
  return safeEvaluate(lineScaleExpression(line, skill), skill, skills, ranks, baseRanks, characterLevel);
}

function lineScaleExpression(line: SkillDescriptionLine, skill: Skill): string | undefined {
  if (line.scaleCalc) return line.scaleCalc;
  return line.scale ? scaleExpression(skill, line.scale) : undefined;
}

/**
 * Live values for a description line's `valuesCalc` expressions, one per numeric argument.
 * `undefined` marks an argument with no expression, or one that cannot be evaluated, so
 * the caller keeps the exported table value.
 */
export function skillLineCalcValues(
  line: SkillDescriptionLine,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number> = ranks,
  characterLevel?: number
): Array<number | undefined> {
  return (line.valuesCalc ?? []).map((expression) => {
    if (!expression) return undefined;
    try {
      return evaluateSkillCalc(expression, skill, skills, ranks, baseRanks, characterLevel);
    } catch {
      return undefined;
    }
  });
}

/**
 * The `stat()` names a description line's live calculations read. The site has no character or
 * equipment stats, so each one counted as 0 and the shown value leaves out its contribution.
 * Expressions that fail fall back to the exported table and contribute nothing here.
 */
export function skillLineUnavailableStats(
  line: SkillDescriptionLine,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number> = ranks,
  characterLevel?: number
): string[] {
  const stats = new Set<string>();
  for (const expression of [lineScaleExpression(line, skill), ...(line.valuesCalc ?? [])]) {
    if (!expression) continue;
    try {
      for (const stat of evaluate(expression, skill, skills, ranks, baseRanks, characterLevel).stats) stats.add(stat);
    } catch {
      // Not evaluated, so its stats were not used either.
    }
  }
  return [...stats];
}

function safeEvaluate(
  expression: string | undefined,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number>,
  characterLevel: number | undefined
): number {
  if (!expression) return 0;
  try {
    return evaluateSkillCalc(expression, skill, skills, ranks, baseRanks, characterLevel);
  } catch {
    return 0;
  }
}

/**
 * Evaluates one exported skills.txt calc expression and throws if its vocabulary is unsupported.
 * `ulvl` throws unless a character level is given. `stat()` reads 0; see skillLineUnavailableStats.
 */
export function evaluateSkillCalc(
  expression: string,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number> = ranks,
  characterLevel?: number
): number {
  return evaluate(expression, skill, skills, ranks, baseRanks, characterLevel).value;
}

function evaluate(
  expression: string,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>,
  baseRanks: Record<number, number>,
  characterLevel: number | undefined
): { value: number; stats: Set<string> } {
  const context: CalcContext = {
    skill,
    skillsByCode: new Map(skills.map((entry) => [entry.Code.toLowerCase(), entry])),
    ranks,
    baseRanks,
    characterLevel,
    expanding: new Set(),
    stats: new Set()
  };
  const value = new Parser(balanceTerminalParentheses(expression.trim().replace(/^"|"$/g, '')), context).parse();
  return { value, stats: context.stats };
}

function balanceTerminalParentheses(expression: string): string {
  let depth = 0;
  let quoted = false;
  for (const character of expression) {
    if (character === "'") quoted = !quoted;
    else if (!quoted && character === '(') depth++;
    else if (!quoted && character === ')') depth--;
    if (depth < 0) return expression;
  }
  return depth > 0 ? expression + ')'.repeat(depth) : expression;
}

export function applySkillSynergy(value: number, percent: number): number {
  return Math.trunc(value * (100 + percent) / 100);
}

class Parser {
  private position = 0;

  constructor(private readonly text: string, private readonly context: CalcContext) {}

  parse(): number {
    const value = this.parseExpression();
    this.skipWhitespace();
    if (this.position !== this.text.length) throw new Error('Unexpected skillcalc input.');
    return value;
  }

  private parseExpression(): number {
    const condition = this.parseComparison();
    this.skipWhitespace();
    if (!this.match('?')) return condition;
    const whenTrue = this.parseExpression();
    this.expect(':');
    const whenFalse = this.parseExpression();
    return condition !== 0 ? whenTrue : whenFalse;
  }

  private parseComparison(): number {
    const left = this.parseAdditive();
    this.skipWhitespace();
    const operators = ['>=', '<=', '==', '!=', '>', '<'];
    const operator = operators.find((candidate) => this.text.startsWith(candidate, this.position));
    if (!operator) return left;
    this.position += operator.length;
    const right = this.parseAdditive();
    return Number({
      '>': left > right,
      '<': left < right,
      '>=': left >= right,
      '<=': left <= right,
      '==': left === right,
      '!=': left !== right
    }[operator]);
  }

  private parseAdditive(): number {
    let value = this.parseMultiplicative();
    while (true) {
      this.skipWhitespace();
      if (this.match('+')) value += this.parseMultiplicative();
      else if (this.match('-')) value -= this.parseMultiplicative();
      else return value;
    }
  }

  private parseMultiplicative(): number {
    let value = this.parseUnary();
    while (true) {
      this.skipWhitespace();
      if (this.match('*')) value *= this.parseUnary();
      else if (this.match('/')) {
        const divisor = this.parseUnary();
        if (divisor === 0) throw new Error('Division by zero.');
        value = Math.trunc(value / divisor);
      } else return value;
    }
  }

  private parseUnary(): number {
    this.skipWhitespace();
    if (this.match('-')) return -this.parseUnary();
    if (this.match('+')) return this.parseUnary();
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    this.skipWhitespace();
    if (this.match('(')) {
      const value = this.parseExpression();
      this.expect(')');
      return value;
    }

    const number = this.readNumber();
    if (number !== null) return number;

    const name = this.readIdentifier();
    if (!name) throw new Error('Expected skillcalc value.');
    this.skipWhitespace();
    if (this.match('(')) return this.parseCall(name);
    return this.resolveSymbol(name, this.context);
  }

  private parseCall(name: string): number {
    this.skipWhitespace();
    if (this.peek() === "'") return this.parseReference(name);

    const first = this.parseExpression();
    this.expect(',');
    const second = this.parseExpression();
    this.expect(')');
    if (name.toLowerCase() === 'min') return Math.min(first, second);
    if (name.toLowerCase() === 'max') return Math.max(first, second);
    throw new Error(`Unknown skillcalc function ${name}.`);
  }

  private parseReference(name: string): number {
    this.expect("'");
    const start = this.position;
    while (this.position < this.text.length && this.peek() !== "'") this.position++;
    if (this.position >= this.text.length) throw new Error('Unclosed skillcalc reference.');
    const target = this.text.slice(start, this.position);
    this.expect("'");

    const fields: string[] = [];
    while (this.match('.')) {
      const field = this.readIdentifier();
      if (!field) throw new Error('Missing skillcalc reference field.');
      fields.push(field);
    }
    this.expect(')');

    if (name.toLowerCase() === 'stat') {
      this.context.stats.add(target);
      return 0;
    }
    if (name.toLowerCase() !== 'skill' || fields.length !== 1) {
      throw new Error('Unsupported skillcalc reference.');
    }

    const skill = this.context.skillsByCode.get(target.toLowerCase());
    if (!skill) throw new Error(`Unknown referenced skill ${target}.`);
    return this.resolveSymbol(fields[0], { ...this.context, skill });
  }

  private resolveSymbol(symbol: string, context: CalcContext): number {
    const lower = symbol.toLowerCase();
    if (lower === 'blvl') return context.baseRanks[context.skill.Id] ?? 0;
    if (lower === 'lvl' || lower === 'sklvl') {
      return context.ranks[context.skill.Id] ?? 0;
    }
    if (lower === 'ulvl') {
      if (context.characterLevel === undefined) throw new Error('No character level for ulvl.');
      return context.characterLevel;
    }

    const param = /^(?:par([1-9])|pa(1[0-9]|20))$/.exec(lower);
    if (param) {
      const index = Number(param[1] ?? param[2]);
      return context.skill.Calculation?.Params[index] ?? 0;
    }

    const formula = FORMULAS.get(lower);
    if (formula) return new Parser(formula, context).parse();

    // skillcalc.txt spells the calc10 alias `clc0`.
    const calc = /^clc([0-9])$/.exec(lower);
    if (calc) {
      const index = Number(calc[1]) || 10;
      const expression = context.skill.Calculation?.Calcs[index];
      if (!expression) throw new Error(`Missing Calc${index}.`);
      const key = `${context.skill.Id}:clc${index}`;
      if (!context.expanding.add(key)) throw new Error('Recursive skillcalc reference.');
      try {
        return new Parser(balanceTerminalParentheses(expression.trim().replace(/^"|"$/g, '')), context).parse();
      } finally {
        context.expanding.delete(key);
      }
    }

    throw new Error(`Unsupported skillcalc symbol ${symbol}.`);
  }

  private readNumber(): number | null {
    const match = /^\d+/.exec(this.text.slice(this.position));
    if (!match) return null;
    this.position += match[0].length;
    return Number(match[0]);
  }

  private readIdentifier(): string {
    const match = /^[A-Za-z_][A-Za-z0-9_]*/.exec(this.text.slice(this.position));
    if (!match) return '';
    this.position += match[0].length;
    return match[0];
  }

  private expect(value: string): void {
    this.skipWhitespace();
    if (!this.match(value)) throw new Error(`Expected ${value}.`);
  }

  private match(value: string): boolean {
    this.skipWhitespace();
    if (!this.text.startsWith(value, this.position)) return false;
    this.position += value.length;
    return true;
  }

  private peek(): string {
    return this.text[this.position] ?? '';
  }

  private skipWhitespace(): void {
    while (/\s/.test(this.peek())) this.position++;
  }
}
