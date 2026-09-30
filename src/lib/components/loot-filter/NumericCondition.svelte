<script lang="ts">
  import type { NumberTest } from '$lib/loot-filter/types';
  type Operator = keyof NumberTest;
  let { label, min, max, value, onchange }: { label: string; min: number; max: number; value?: NumberTest; onchange: (next?: NumberTest) => void } = $props();
  const comparisons: { value: Operator; label: string }[] = [
    { value: 'eq', label: '=' }, { value: 'gte', label: '≥' }, { value: 'gt', label: '>' }, { value: 'lte', label: '≤' }, { value: 'lt', label: '<' }
  ];
  const entries = $derived(Object.entries(value ?? {}) as [Operator, number][]);
  function update(operator: Operator, number: number | undefined) {
    const next = { ...value };
    if (number === undefined) delete next[operator]; else next[operator] = number;
    onchange(Object.keys(next).length ? next : undefined);
  }
  function changeOperator(previous: Operator, next: Operator) {
    const updated = { ...value }; delete updated[previous]; updated[next] = value?.[previous] ?? min; onchange(updated);
  }
</script>

<fieldset class="min-w-0 rounded border border-parchment-300/20 p-3">
  <legend class="px-1 text-xs uppercase tracking-widest text-parchment-300">{label}</legend>
  {#each entries as [operator, number] (operator)}
    <div class="mb-2 flex min-w-0 gap-1.5">
      <select class="field w-16 shrink-0 !px-2" aria-label={`${label} comparison`} value={operator} onchange={event => changeOperator(operator, event.currentTarget.value as Operator)}>
        {#each comparisons as option}<option value={option.value} disabled={option.value !== operator && option.value in (value ?? {})}>{option.label}</option>{/each}
      </select>
      <input class="field min-w-0 !px-2" type="number" {min} {max} step="1" aria-label={`${label} ${operator}`} value={Number.isFinite(number) ? number : ''} oninput={event => update(operator, event.currentTarget.value === '' ? NaN : Number(event.currentTarget.value))} />
      <button type="button" class="px-1 text-parchment-300 hover:text-requirement" aria-label={`Remove ${label} ${operator}`} onclick={() => update(operator, undefined)}>×</button>
    </div>
  {:else}<p class="mb-2 text-sm text-parchment-300">Any</p>{/each}
  <button type="button" class="text-xs text-ember-400 hover:underline disabled:opacity-40" disabled={entries.length === comparisons.length}
    onclick={() => { const next = comparisons.find(option => !(option.value in (value ?? {}))); if (next) update(next.value, min); }}>+ Add comparison</button>
  <p class="mt-1 text-xs text-parchment-300/70">{min}–{max.toLocaleString()}</p>
</fieldset>
