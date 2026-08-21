<script lang="ts">
  import { Badge } from 'flowbite-svelte';

  import { itemTitle, itemType } from '$lib/catalog';
  import { i18n } from '$lib/i18n';
  import type { CatalogItem, CatalogSlug, KeyedLine } from '$lib/types';
  import KeyedLines from './KeyedLines.svelte';

  let { item, slug }: { item: CatalogItem; slug: CatalogSlug } = $props();

  const equipmentEarly = new Set([
    'strDefense', 'strDefenseRange', 'strDefenseRangeRange', 'strChanceToBlock',
    'strSmiteDamage', 'strKickDamage', 'strWeaponDamageGenericRange',
    'strWeaponDamageOneHand', 'strWeaponDamageTwoHand'
  ]);
  const requirements = new Set([
    'strRequiredClass', 'strRequiredDexterity', 'strRequiredStrength',
    'strRequiredDexterityRange', 'strRequiredStrengthRange', 'strRequiredLevelRange'
  ]);

  function byKeys(lines: KeyedLine[] | undefined, keys: Set<string>, include = true) {
    return (lines ?? []).filter((line) => include === keys.has(line.key));
  }

  function typeName(value: string | { Index?: string; Name?: string; Class?: string }): string {
    return typeof value === 'string' ? value : value.Index ?? value.Name ?? '';
  }

  function quantity(value: number | undefined): string {
    return value && value > 1 ? `${value} × ` : '';
  }

  function visibleQualifiers(qualifiers: KeyedLine[] | undefined): KeyedLine[] {
    return (qualifiers ?? []).filter((qualifier) => qualifier.key !== 'strCubeQualifierQuantityN');
  }

  function qualifierClass(key: string): string {
    if (key.includes('RareItem')) return 'border-yellow-500/50 bg-yellow-950/45 text-yellow-200';
    if (key.includes('MagicItem')) return 'border-blue-500/50 bg-blue-950/45 text-blue-200';
    if (key.includes('CraftedItem')) return 'border-orange-500/50 bg-orange-950/45 text-orange-200';
    if (key.includes('SetItem')) return 'border-green-500/50 bg-green-950/45 text-green-200';
    if (key.includes('UniqueItem')) return 'border-amber-500/50 bg-amber-950/45 text-amber-200';
    return 'border-parchment-300/30 bg-black/25 text-parchment-200';
  }
</script>

<article class="catalog-card panel scroll-card flex h-full flex-col rounded-lg p-5 text-center hover:border-ember-400/45">
  <header class="mb-3 border-b border-parchment-300/15 pb-3">
    <h2 class:unique-line={slug !== 'sets'} class:set-line={slug === 'sets'} class="display-text text-xl">
      {$i18n.t(itemTitle(item, slug))}
    </h2>
    <div class="mt-2 flex flex-wrap justify-center gap-2 text-xs">
      {#if item.Vanilla}
        <Badge color={item.Vanilla === 'Y' ? 'gray' : 'red'}>{item.Vanilla === 'Y' ? 'Vanilla' : 'Reimagined'}</Badge>
      {/if}
      {#if item.source}<Badge color="gray">{item.source}</Badge>{/if}
      {#if item.RequiredLevel != null}<Badge color="gray">Level {item.RequiredLevel}</Badge>{/if}
    </div>
  </header>

  {#if slug === 'sets'}
    <KeyedLines lines={item.PartialBonuses} class="set-line text-sm" />
    <KeyedLines lines={item.FullBonuses} class="set-line text-sm" />
    <div class="mt-2 space-y-5">
      {#each item.SetItems ?? [] as setItem}
        <section>
          <h3 class="set-line text-lg">{$i18n.t(setItem.Index)}</h3>
          <p class="base-line">{$i18n.t(setItem.Equipment?.NameKey)}</p>
          <KeyedLines lines={byKeys(setItem.Equipment?.Lines, equipmentEarly)} class="base-line" />
          {#each setItem.Equipment?.DamageTypes ?? [] as damage}
            <KeyedLines lines={damage.Lines} class="base-line" />
          {/each}
          <KeyedLines lines={byKeys(setItem.Equipment?.Lines, requirements)} class="requirement-line" />
          {#if !(setItem.Equipment?.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
            <p class="requirement-line">{$i18n.t('strRequiredLevel', [setItem.RequiredLevel ?? 1])}</p>
          {/if}
          <KeyedLines lines={setItem.Lines} />
          {#each setItem.SetBonuses ?? [] as bonus}<KeyedLines lines={bonus} class="set-line" />{/each}
        </section>
      {/each}
    </div>
  {:else if slug === 'runewords'}
    <p class="base-line mb-1">
      {(item.Types ?? []).map((value) => $i18n.t(typeName(value))).join(` ${$i18n.t('label_or')} `)}
    </p>
    <p class="mb-2">{(item.Runes ?? []).map((rune) => $i18n.t(rune.NameKey)).join(' + ')}</p>
    {#if !(item.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
      <p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel ?? 1])}</p>
    {/if}
    <KeyedLines lines={item.Lines} />
  {:else if slug === 'bases'}
    <p class="base-line mb-1">{$i18n.t(itemType(item))}</p>
    {#each item.DamageTypes ?? [] as damage}<KeyedLines lines={damage.Lines} class="base-line" />{/each}
    <KeyedLines lines={byKeys(item.Lines, requirements, false)} class="base-line" />
    <KeyedLines lines={byKeys(item.Lines, requirements)} class="requirement-line" />
    {#if item.RequiredLevel != null}<p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel])}</p>{/if}
    {#if item.GemSockets}<p class="mt-2 text-sm text-parchment-300">Sockets: {String(item.GemSockets)}</p>{/if}
  {:else if slug === 'affixes'}
    <p class="base-line mb-1">{item.PType} · Level {String(item.Level ?? 0)}{Number(item.MaxLevel) ? `–${String(item.MaxLevel)}` : '+'}</p>
    {#if item.ClassSpecific}<p class="requirement-line">{String(item.ClassSpecific)}</p>{/if}
    <p class="mb-2 text-sm text-parchment-300">{(item.Types ?? []).map((value) => $i18n.t(typeName(value))).join(', ')}</p>
    <KeyedLines lines={item.Lines} />
  {:else if slug === 'cube-recipes'}
    <div class="space-y-3 text-left">
      <div>
        <h3 class="display-text text-xs uppercase tracking-widest text-parchment-300">Inputs</h3>
        {#each item.Inputs ?? [] as input}
          <p class="flex flex-wrap items-center gap-1.5">
            <span>{quantity(input.Quantity)}{$i18n.line(input.Name)}</span>
            {#each visibleQualifiers(input.Qualifiers) as qualifier}
              <span class={`rounded border px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${qualifierClass(qualifier.key)}`}>
                {$i18n.line(qualifier)}
              </span>
            {/each}
          </p>
        {/each}
      </div>
      <div>
        <h3 class="display-text text-xs uppercase tracking-widest text-parchment-300">Outputs</h3>
        {#each Object.values(item.Outputs ?? {}) as output}
          <p class="flex flex-wrap items-center gap-1.5">
            <span>{quantity(output.Quantity)}{$i18n.line(output.Name)}</span>
            {#each visibleQualifiers(output.Qualifiers) as qualifier}
              <span class={`rounded border px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${qualifierClass(qualifier.key)}`}>
                {$i18n.line(qualifier)}
              </span>
            {/each}
          </p>
          <KeyedLines lines={output.Lines} />
        {/each}
      </div>
      <KeyedLines lines={item.Notes} class="text-parchment-300" />
    </div>
  {:else}
    <p class="base-line mb-1">{$i18n.t(item.Equipment?.NameKey)}</p>
    <KeyedLines lines={byKeys(item.Equipment?.Lines, equipmentEarly)} class="base-line" />
    {#each item.Equipment?.DamageTypes ?? [] as damage}<KeyedLines lines={damage.Lines} class="base-line" />{/each}
    <KeyedLines lines={byKeys(item.Equipment?.Lines, requirements)} class="requirement-line" />
    {#if !(item.Equipment?.Lines ?? []).some((line) => line.key === 'strRequiredLevelRange')}
      <p class="requirement-line">{$i18n.t('strRequiredLevel', [item.RequiredLevel ?? 1])}</p>
    {/if}
    <KeyedLines lines={item.Lines} />
  {/if}
</article>

<style>
  @media (max-height: 800px) and (min-width: 640px) {
    .catalog-card { padding: 1rem; }
    .catalog-card > header { margin-bottom: 0.5rem; padding-bottom: 0.5rem; }
  }
</style>
