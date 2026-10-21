import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { advancedMonsterDropSettings, countAdvancedMonsterDropSettings, readMonsterDropUrl, writeMonsterDropUrl } from './monster-drop-url';

const base = new URL('https://example.com/data/drop-calculator?mode=simulate');
const source = readFileSync(new URL('./components/MonsterDropSimulator.svelte', import.meta.url), 'utf8');
const form = source.slice(source.indexOf('<form'), source.indexOf('</form>'));
const advanced = form.slice(form.indexOf('<details'), form.indexOf('</details>'));
const outsideAdvanced = form.replace(advanced, '');

describe('simulator advanced settings indicator', () => {
  it('counts nothing for defaults or for primary settings', () => {
    expect(countAdvancedMonsterDropSettings(readMonsterDropUrl(base))).toBe(0);
    const primary = new URL(`${base}&sim_players=8&sim_party=3&sim_magicFind=300&sim_kills=5000&sim_difficulty=1&sim_sourceType=tc&sim_level=40`);
    expect(countAdvancedMonsterDropSettings(readMonsterDropUrl(primary))).toBe(0);
  });

  it('counts a custom seed restored from a bookmarked URL and keeps its value', () => {
    const state = readMonsterDropUrl(new URL(`${base}&sim_seed=42`));
    expect(state.seed).toBe(42);
    expect(countAdvancedMonsterDropSettings(state)).toBe(1);
    expect(writeMonsterDropUrl(base, state).searchParams.get('sim_seed')).toBe('42');
  });

  it('agrees with the URL writer about which values are defaults', () => {
    const state = { ...readMonsterDropUrl(base), seed: 1 };
    expect(countAdvancedMonsterDropSettings(state)).toBe(0);
    expect(writeMonsterDropUrl(base, state).href).toBe(base.href);
    expect(countAdvancedMonsterDropSettings({ seed: 0 })).toBe(1);
    expect(advancedMonsterDropSettings).toEqual(['seed']);
  });
});

describe('simulator form layout', () => {
  it('keeps every existing control, with the seed in the advanced section only', () => {
    expect(advanced).toContain('bind:value={seed}');
    expect(outsideAdvanced).not.toContain('bind:value={seed}');
    for (const control of ['bind:group={sourceType}', 'bind:value={difficulty}', 'id="simulation-monster"', 'id="simulation-treasure-class"',
      'bind:value={level}', 'bind:value={players}', 'bind:value={party}', 'bind:value={magicFind}', 'bind:value={kills}']) {
      expect(outsideAdvanced).toContain(control);
    }
  });

  it('starts collapsed and keeps the section open state out of the URL and the worker', () => {
    expect(source).toContain('let advancedOpen = $state(false);');
    expect(advanced).toContain('bind:open={advancedOpen}');
    // The address-bar sync and the worker message never read the open state.
    const effect = source.slice(source.indexOf('$effect(() => {'), source.indexOf('async function copyLink'));
    expect(effect).not.toContain('advancedOpen');
    expect(source.match(/advancedOpen/g)).toHaveLength(2);
    expect(advanced).not.toMatch(/ontoggle|run\(/);
  });

  it('opens the section when a hidden required field is invalid', () => {
    expect(advanced).toContain('oninvalidcapture={event => { event.currentTarget.open = true; }}');
    expect(advanced).toMatch(/bind:value=\{seed\}/);
    expect(advanced).toMatch(/required/);
  });

  it('keeps separate rate-only and simulation actions with their original meanings', () => {
    expect(form).toContain('onsubmit={event => {event.preventDefault();run(false);}}');
    expect(form).toMatch(/type="submit"[^>]*>View drop rates</);
    expect(form).toMatch(/onclick=\{\(\) => run\(true\)\}>Simulate kills</);
    // Only the two actions start a run from the form.
    expect(form.match(/run\(/g)).toHaveLength(2);
  });

  it('shows the full selected source so truncated names stay distinguishable', () => {
    expect(form).toContain('data-testid="sim-source-summary"');
    expect(source).toMatch(/const sourceName = \$derived/);
    expect(source).toMatch(/const sourceMeta = \$derived/);
  });
});
