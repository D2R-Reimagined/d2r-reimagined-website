import type { Skill, SkillDamageScale } from '$lib/types';

interface CalcContext {
  skill: Skill;
  skillsByCode: Map<string, Skill>;
  ranks: Record<number, number>;
  expanding: Set<string>;
}

export function skillSynergyBonus(
  skill: Skill,
  scale: SkillDamageScale,
  skills: Skill[],
  ranks: Record<number, number>
): number {
  const expression = {
    physical: skill.Calculation?.PhysicalDamage,
    elemental: skill.Calculation?.ElementalDamage,
    elementalLength: skill.Calculation?.ElementalLength
  }[scale];
  if (!expression) return 0;

  try {
    return evaluateSkillCalc(expression, skill, skills, ranks);
  } catch {
    return 0;
  }
}

/** Evaluates one exported skills.txt calc expression and throws if its vocabulary is unsupported. */
export function evaluateSkillCalc(
  expression: string,
  skill: Skill,
  skills: Skill[],
  ranks: Record<number, number>
): number {
  const context: CalcContext = {
    skill,
    skillsByCode: new Map(skills.map((entry) => [entry.Code.toLowerCase(), entry])),
    ranks,
    expanding: new Set()
  };
  return new Parser(balanceTerminalParentheses(expression.trim().replace(/^"|"$/g, '')), context).parse();
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

    if (name.toLowerCase() === 'stat') return 0;
    if (name.toLowerCase() !== 'skill' || fields.length !== 1) {
      throw new Error('Unsupported skillcalc reference.');
    }

    const skill = this.context.skillsByCode.get(target.toLowerCase());
    if (!skill) throw new Error(`Unknown referenced skill ${target}.`);
    return this.resolveSymbol(fields[0], { ...this.context, skill });
  }

  private resolveSymbol(symbol: string, context: CalcContext): number {
    const lower = symbol.toLowerCase();
    if (lower === 'lvl' || lower === 'blvl' || lower === 'sklvl') {
      return context.ranks[context.skill.Id] ?? 0;
    }

    const param = /^(?:par([1-9])|pa(1[0-9]|20))$/.exec(lower);
    if (param) {
      const index = Number(param[1] ?? param[2]);
      return context.skill.Calculation?.Params[index] ?? 0;
    }

    const calc = /^clc([1-9]|10)$/.exec(lower);
    if (calc) {
      const index = Number(calc[1]);
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
